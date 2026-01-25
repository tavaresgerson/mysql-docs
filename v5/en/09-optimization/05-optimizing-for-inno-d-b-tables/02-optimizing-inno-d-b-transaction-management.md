### 8.5.2 Otimizando o Gerenciamento de Transações InnoDB

Para otimizar o processamento de transações `InnoDB`, encontre o equilíbrio ideal entre a sobrecarga de desempenho (performance overhead) dos recursos transacionais e a carga de trabalho (workload) do seu servidor. Por exemplo, uma aplicação pode enfrentar problemas de desempenho se realizar COMMITs milhares de vezes por segundo, e problemas de desempenho diferentes se realizar COMMITs apenas a cada 2-3 horas.

* A configuração padrão do MySQL `AUTOCOMMIT=1` pode impor limitações de desempenho em um servidor de Database ocupado. Onde for prático, agrupe várias operações de alteração de dados relacionadas em uma única transação, emitindo `SET AUTOCOMMIT=0` ou uma instrução `START TRANSACTION`, seguida por uma instrução `COMMIT` após realizar todas as alterações.

  O `InnoDB` deve realizar o flush do log para o disco a cada COMMIT de transação se essa transação tiver feito modificações no Database. Quando cada alteração é seguida por um COMMIT (como ocorre com a configuração autocommit padrão), a taxa de transferência de I/O do dispositivo de armazenamento limita o número de operações potenciais por segundo.

* Alternativamente, para transações que consistem apenas em uma única instrução `SELECT`, ativar `AUTOCOMMIT` ajuda o `InnoDB` a reconhecer transações somente leitura e otimizá-las. Consulte a Seção 8.5.3, “Otimizando Transações InnoDB Somente Leitura” para os requisitos.

* Evite realizar ROLLBACKs após INSERTs, UPDATEs ou DELETEs em um grande número de linhas. Se uma transação grande estiver diminuindo o desempenho do servidor, realizar o ROLLBACK pode piorar o problema, podendo levar várias vezes o tempo das operações originais de alteração de dados. Eliminar o processo do Database não ajuda, pois o ROLLBACK é reiniciado na inicialização do servidor (server startup).

  Para minimizar a chance de ocorrência deste problema:

  + Aumente o tamanho do Buffer Pool para que todas as alterações de dados possam ser armazenadas em cache, em vez de serem gravadas imediatamente no disco.

  + Defina `innodb_change_buffering=all` para que as operações de UPDATE e DELETE sejam armazenadas em Buffer, além dos INSERTs.

  + Considere emitir instruções `COMMIT` periodicamente durante a grande operação de alteração de dados, possivelmente dividindo um único DELETE ou UPDATE em múltiplas instruções que operam em um número menor de linhas.

  Para se livrar de um ROLLBACK descontrolado (runaway rollback) depois que ele ocorrer, aumente o Buffer Pool para que o ROLLBACK dependa principalmente da CPU (CPU-bound) e seja executado rapidamente, ou elimine o servidor e reinicie com `innodb_force_recovery=3`, conforme explicado na Seção 14.19.2, “Recuperação InnoDB”.

  Espera-se que este problema seja incomum com a configuração padrão `innodb_change_buffering=all`, que permite que as operações de UPDATE e DELETE sejam armazenadas em cache na memória, tornando-as mais rápidas de serem executadas e também mais rápidas de terem seu ROLLBACK realizado, se necessário. Certifique-se de usar esta configuração de parâmetro em servidores que processam transações de longa duração com muitos INSERTs, UPDATEs ou DELETEs.

* Se você puder tolerar a perda de algumas das transações com COMMIT mais recentes caso ocorra um encerramento inesperado, você pode definir o parâmetro `innodb_flush_log_at_trx_commit` como 0. O `InnoDB` tenta realizar o flush do log uma vez por segundo de qualquer forma, embora o flush não seja garantido. Além disso, defina o valor de `innodb_support_xa` como 0, o que reduz o número de flushes no disco devido à sincronização dos dados no disco e do binary log.

  Nota

  `innodb_support_xa` está descontinuado (deprecated); espera-se que seja removido em uma versão futura. A partir do MySQL 5.7.10, o suporte do `InnoDB` para two-phase commit em transações XA está sempre ativado, e desabilitar `innodb_support_xa` não é mais permitido.

* Quando linhas são modificadas ou excluídas, as linhas e os undo logs associados não são fisicamente removidos imediatamente, ou mesmo imediatamente após o COMMIT da transação. Os dados antigos são preservados até que as transações que começaram antes ou concorrentemente terminem, para que essas transações possam acessar o estado anterior das linhas modificadas ou excluídas. Assim, uma transação de longa duração pode impedir que o `InnoDB` realize a purga de dados que foram alterados por uma transação diferente.

* Quando linhas são modificadas ou excluídas dentro de uma transação de longa duração, outras transações que utilizam os níveis de isolamento `READ COMMITTED` e `REPEATABLE READ` têm que realizar mais trabalho para reconstruir os dados mais antigos caso leiam essas mesmas linhas.

* Quando uma transação de longa duração modifica uma tabela, as Queries contra essa tabela, provenientes de outras transações, não utilizam a técnica de covering index. Queries que normalmente poderiam recuperar todas as colunas de resultado a partir de um secondary index, buscam, em vez disso, os valores apropriados nos dados da tabela.

  Se for descoberto que as páginas do secondary index possuem um `PAGE_MAX_TRX_ID` muito recente, ou se os registros no secondary index estiverem marcados para exclusão (delete-marked), o `InnoDB` poderá precisar buscar registros usando um clustered index.