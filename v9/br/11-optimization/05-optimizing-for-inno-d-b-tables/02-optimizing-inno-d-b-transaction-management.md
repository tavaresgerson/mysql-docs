### 10.5.2 Otimizando o Gerenciamento de Transações InnoDB

Para otimizar o processamento de transações no `InnoDB`, encontre o equilíbrio ideal entre o custo de desempenho das funcionalidades transacionais e a carga de trabalho do seu servidor. Por exemplo, um aplicativo pode encontrar problemas de desempenho se cometer milhares de vezes por segundo, e diferentes problemas de desempenho se cometer apenas a cada 2 a 3 horas.

* O ajuste padrão do MySQL `AUTOCOMMIT=1` pode impor limitações de desempenho em um servidor de banco de dados ocupado. Sempre que possível, envolva várias operações relacionadas de alteração de dados em uma única transação, emitindo `SET AUTOCOMMIT=0` ou uma declaração `START TRANSACTION`, seguida de uma declaração `COMMIT` após fazer todas as alterações.

  O `InnoDB` deve limpar o log no disco em cada commit de transação se essa transação fez modificações no banco de dados. Quando cada alteração é seguida por um commit (como no ajuste de autocommit padrão), o throughput de I/O do dispositivo de armazenamento coloca um limite no número de operações potenciais por segundo.

* Alternativamente, para transações que consistem apenas em uma única declaração `SELECT`, ativar `AUTOCOMMIT` ajuda o `InnoDB` a reconhecer transações de leitura apenas e otimizá-las. Consulte a Seção 10.5.3, “Otimizando Transações de Leitura InnoDB”, para requisitos.

* Evite realizar recuos após inserir, atualizar ou excluir um grande número de linhas. Se uma grande transação está desacelerando o desempenho do servidor, recuá-la pode piorar o problema, potencialmente levando vários vezes mais tempo para ser realizada do que as operações originais de alteração de dados. Matar o processo do banco de dados não ajuda, porque o recuo começa novamente na inicialização do servidor.

Para minimizar a chance de esse problema ocorrer:
- Envolva várias operações de alteração de dados em uma única transação, emitindo `SET AUTOCOMMIT=0` ou uma declaração `START TRANSACTION`, seguida de uma declaração `COMMIT`.
- Evite realizar recuos após inserir, atualizar ou excluir um grande número de linhas.
- Se uma grande transação está desacelerando o desempenho do servidor, recuá-la pode piorar o problema, potencialmente levando vários vezes mais tempo para ser realizada do que as operações originais de alteração de dados. Matar o processo do banco de dados não ajuda, porque o recuo começa novamente na inicialização do servidor.

+ Aumente o tamanho do pool de buffer para que todas as alterações de dados possam ser armazenadas em cache em vez de serem escritas imediatamente no disco.

+ Defina `innodb_change_buffering=all` para que as operações de atualização e exclusão sejam armazenadas em buffer, além das inserções.

+ Considere emitir instruções `COMMIT` periodicamente durante a operação de alteração de grandes volumes de dados, possivelmente dividindo uma única exclusão ou atualização em várias instruções que operam em números menores de linhas.

+ Para se livrar de um rollback descontrolado uma vez que ocorra, aumente o pool de buffer para que o rollback se torne dependente do processador e execute rapidamente, ou interrompa o servidor e reinicie com `innodb_force_recovery=3`, conforme explicado na Seção 17.18.2, “Recuperação do InnoDB”.

* Se você pode arcar com a perda de algumas das transações comprometidas mais recentes se ocorrer uma saída inesperada, você pode definir o parâmetro `innodb_flush_log_at_trx_commit` para 0. O `InnoDB` tenta esvaziar o log uma vez por segundo de qualquer forma, embora o esvaziamento não seja garantido.

* Quando as linhas são modificadas ou excluídas, as linhas e os logs de desfazer associados não são removidos fisicamente imediatamente, nem mesmo imediatamente após a transação ser confirmada. Os dados antigos são preservados até que as transações que começaram anteriormente ou simultaneamente sejam concluídas, para que essas transações possam acessar o estado anterior das linhas modificadas ou excluídas. Assim, uma transação de longa duração pode impedir que o `InnoDB` elimine dados que foram alterados por uma transação diferente.

* Quando as linhas são modificadas ou excluídas dentro de uma transação de longa duração, outras transações que utilizam os níveis de isolamento `READ COMMITTED` e `REPEATABLE READ` têm que fazer mais trabalho para reconstruir os dados mais antigos se lerem essas mesmas linhas.

* Quando uma transação de longa duração modifica uma tabela, as consultas a essa tabela de outras transações não utilizam a técnica de índice coberto. As consultas que normalmente poderiam recuperar todas as colunas do resultado de um índice secundário, em vez disso, procuram os valores apropriados nos dados da tabela.

Se as páginas do índice secundário forem encontradas com um `PAGE_MAX_TRX_ID` muito novo ou se os registros no índice secundário estiverem marcados para exclusão, o `InnoDB` pode precisar procurar registros usando um índice agrupado.