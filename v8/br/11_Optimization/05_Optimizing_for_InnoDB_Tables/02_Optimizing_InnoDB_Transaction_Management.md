### 10.5.2 Otimização da Gestão de Transações InnoDB

Para otimizar o processamento de transações do `InnoDB` (se aplicável), encontre o equilíbrio ideal entre o custo de desempenho das funcionalidades transacionais e a carga de trabalho do seu servidor. Por exemplo, um aplicativo pode enfrentar problemas de desempenho se fizer milhares de commits por segundo e diferentes problemas de desempenho se fizer commits apenas a cada 2 a 3 horas.

- A configuração padrão do MySQL `AUTOCOMMIT=1` pode impor limitações de desempenho em um servidor de banco de dados ocupado. Sempre que possível, envolva várias operações relacionadas de alteração de dados em uma única transação, emitindo a instrução `SET AUTOCOMMIT=0` ou `START TRANSACTION`, seguida de uma instrução `COMMIT` após fazer todas as alterações.

  `InnoDB` deve limpar o log no disco em cada commit de transação, se essa transação tiver feito modificações no banco de dados. Quando cada alteração é seguida por um commit (como no ajuste de autocommit padrão), o desempenho de I/O do dispositivo de armazenamento limita o número de operações potenciais por segundo.

- Como alternativa, para transações que consistem apenas em uma única declaração `SELECT`, ativar `AUTOCOMMIT` ajuda o `InnoDB` a reconhecer transações apenas de leitura e otimizá-las. Consulte a Seção 10.5.3, “Otimizando Transações Apenas de Leitura do InnoDB”, para obter os requisitos.

- Evite realizar recuos após inserir, atualizar ou excluir um grande número de linhas. Se uma grande transação estiver prejudicando o desempenho do servidor, reverter a transação pode piorar o problema, podendo levar vários vezes mais tempo do que as operações originais de alteração de dados. Matar o processo do banco de dados não ajuda, porque o recuo começa novamente ao inicializar o servidor.

  Para minimizar a chance de esse problema ocorrer:

  - Aumente o tamanho do pool de buffer para que todas as alterações de dados possam ser armazenadas em cache em vez de serem escritas imediatamente no disco.

  - Defina `innodb_change_buffering=all` para que as operações de atualização e exclusão sejam armazenadas em cache, além das inserções.

  - Considere emitir declarações `COMMIT` periodicamente durante a operação de mudança de big data, possivelmente dividindo uma única exclusão ou atualização em várias declarações que operam em um número menor de linhas.

  Para se livrar de um rollback descontrolado uma vez que ele ocorre, aumente o pool de tampão para que o rollback se torne dependente da CPU e funcione rapidamente, ou interrompa o servidor e reinicie com `innodb_force_recovery=3`, conforme explicado na Seção 17.18.2, “Recuperação do InnoDB”.

  Espera-se que essa questão seja rara com o ajuste padrão `innodb_change_buffering=all`, que permite que as operações de atualização e exclusão sejam armazenadas em cache na memória, tornando-as mais rápidas para serem executadas em primeiro lugar, e também mais rápidas para serem revertidas, se necessário. Certifique-se de usar esse ajuste de parâmetro em servidores que processam transações de longa duração com muitas inserções, atualizações ou exclusões.

- Se você pode arcar com a perda de algumas das transações mais recentes se ocorrer uma saída inesperada, você pode definir o parâmetro `innodb_flush_log_at_trx_commit` para 0. `InnoDB` tenta limpar o log uma vez por segundo, mesmo assim, embora a limpeza não seja garantida.

- Quando as linhas são modificadas ou excluídas, as linhas e os registros de desfazer associados não são removidos fisicamente imediatamente, nem mesmo imediatamente após a transação ser confirmada. Os dados antigos são preservados até que as transações que começaram anteriormente ou simultaneamente sejam concluídas, para que essas transações possam acessar o estado anterior das linhas modificadas ou excluídas. Assim, uma transação de longa duração pode impedir que o `InnoDB` apague dados que foram alterados por outra transação.

- Quando as linhas são modificadas ou excluídas dentro de uma transação de longa duração, outras transações que utilizam os níveis de isolamento `READ COMMITTED` e `REPEATABLE READ` precisam fazer mais trabalho para reconstruir os dados mais antigos se elas lerem aquelas mesmas linhas.

- Quando uma transação de longa duração modifica uma tabela, as consultas a essa tabela de outras transações não utilizam a técnica de índice coberto. As consultas que normalmente poderiam recuperar todas as colunas do resultado de um índice secundário, em vez disso, procuram os valores apropriados nos dados da tabela.

  Se as páginas de índice secundário tiverem um `PAGE_MAX_TRX_ID` que é muito novo, ou se os registros no índice secundário estiverem marcados para exclusão, o `InnoDB` pode precisar consultar registros usando um índice agrupado.
