### 8.11.2 Problemas de Table Locking

Tabelas `InnoDB` usam row-level locking para que múltiplas sessions e applications possam ler e escrever na mesma table simultaneamente, sem que uma precise esperar pela outra ou produzir resultados inconsistentes. Para este storage engine, evite usar a instrução `LOCK TABLES`, pois ela não oferece proteção extra, mas, em vez disso, reduz a concurrency. O row-level locking automático torna essas tables adequadas para seus databases mais movimentados com seus dados mais importantes, ao mesmo tempo que simplifica a lógica da application, já que você não precisa aplicar lock e unlock nas tables. Consequentemente, o storage engine `InnoDB` é o padrão no MySQL.

O MySQL usa table locking (em vez de page, row, ou column locking) para todos os storage engines, exceto o `InnoDB`. As operações de locking em si não geram muita sobrecarga (overhead). Mas, como apenas uma session pode escrever em uma table por vez, para obter o melhor performance com estes outros storage engines, use-os principalmente para tables que são consultadas (queried) frequentemente e raramente recebem INSERTs ou UPDATEs.

* Considerações de Performance que Favorecem o InnoDB
* Soluções Alternativas (Workarounds) para Problemas de Performance de Locking

#### Considerações de Performance que Favorecem o InnoDB

Ao escolher entre criar uma table usando `InnoDB` ou um storage engine diferente, tenha em mente as seguintes desvantagens do table locking:

* O table locking permite que muitas sessions leiam uma table ao mesmo tempo, mas se uma session quiser escrever em uma table, ela deve primeiro obter acesso exclusivo, o que significa que ela pode ter que esperar que outras sessions terminem de usar a table. Durante o update, todas as outras sessions que desejam acessar esta table específica devem esperar até que o update seja concluído.

* O table locking causa problemas quando uma session está esperando porque o disco está cheio e é necessário que haja espaço livre disponível antes que a session possa prosseguir. Neste caso, todas as sessions que desejam acessar a table problemática também são colocadas em um estado de espera até que mais espaço em disco seja disponibilizado.

* Uma instrução `SELECT` que leva muito tempo para ser executada impede que outras sessions façam o UPDATE da table enquanto isso, fazendo com que as outras sessions pareçam lentas ou sem resposta. Enquanto uma session está esperando para obter acesso exclusivo à table para updates, outras sessions que emitem instruções `SELECT` fazem fila atrás dela, reduzindo a concurrency, mesmo para sessions de read-only.

#### Soluções Alternativas (Workarounds) para Problemas de Performance de Locking

Os itens a seguir descrevem algumas maneiras de evitar ou reduzir a contenção causada pelo table locking:

* Considere mudar a table para o storage engine `InnoDB`, usando `CREATE TABLE ... ENGINE=INNODB` durante a configuração, ou usando `ALTER TABLE ... ENGINE=INNODB` para uma table existente. Consulte o Capítulo 14, *The InnoDB Storage Engine* para obter mais detalhes sobre este storage engine.

* Otimize as instruções `SELECT` para que sejam executadas mais rapidamente, de modo a aplicar lock nas tables por menos tempo. Você pode ter que criar algumas summary tables para isso.

* Inicie o **mysqld** com `--low-priority-updates`. Para storage engines que usam apenas table-level locking (como `MyISAM`, `MEMORY` e `MERGE`), isso confere a todas as instruções que fazem update (modificam) de uma table uma priority menor do que as instruções `SELECT`. Neste caso, a segunda instrução `SELECT` no cenário anterior seria executada antes da instrução `UPDATE` e não esperaria que o primeiro `SELECT` terminasse.

* Para especificar que todos os updates emitidos em uma connection específica devem ser feitos com low priority, defina a system variable de servidor `low_priority_updates` como 1.

* Para dar a uma instrução `INSERT`, `UPDATE` ou `DELETE` específica uma priority menor, use o atributo `LOW_PRIORITY`.

* Para dar a uma instrução `SELECT` específica uma priority maior, use o atributo `HIGH_PRIORITY`. Consulte a Seção 13.2.9, “SELECT Statement”.

* Inicie o **mysqld** com um valor baixo para a system variable `max_write_lock_count` para forçar o MySQL a elevar temporariamente a priority de todas as instruções `SELECT` que estão esperando por uma table após um número específico de write locks ocorrerem na table (por exemplo, para operações de INSERT). Isso permite read locks após um certo número de write locks.

* Se você tiver problemas com instruções `SELECT` e `DELETE` misturadas, a opção `LIMIT` na instrução `DELETE` pode ajudar. Consulte a Seção 13.2.2, “DELETE Statement”.

* Usar `SQL_BUFFER_RESULT` com instruções `SELECT` pode ajudar a reduzir a duração dos table locks. Consulte a Seção 13.2.9, “SELECT Statement”.

* Dividir o conteúdo da table em tables separadas pode ajudar, permitindo que as queries sejam executadas em columns de uma table, enquanto os updates ficam restritos a columns em uma table diferente.

* Você pode alterar o código de locking em `mysys/thr_lock.c` para usar uma única queue. Neste caso, write locks e read locks teriam a mesma priority, o que pode ajudar algumas applications.