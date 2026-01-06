### 22.6.4 Partição e bloqueio

Para motores de armazenamento como `MyISAM` que realmente executam bloqueios de nível de tabela ao executar instruções DML ou DDL, uma instrução em versões mais antigas do MySQL (5.6.5 e anteriores) que afetava uma tabela particionada impunha um bloqueio na tabela como um todo; ou seja, todas as partições eram bloqueadas até que a instrução fosse concluída. No MySQL 5.7, a poda de bloqueios de partição elimina blocos desnecessários em muitos casos, e a maioria das instruções que lêem ou atualizam uma tabela `MyISAM` particionada causam apenas o bloqueio das partições afetadas. Por exemplo, uma `SELECT` de uma tabela `MyISAM` particionada bloqueia apenas aquelas partições que realmente contêm linhas que satisfazem a condição `WHERE` da instrução `SELECT`.

Para declarações que afetam tabelas particionadas usando motores de armazenamento como o `InnoDB`, que empregam bloqueio em nível de linha e não realizam (ou não precisam realizar) os bloqueios antes da poda de partições, isso não é um problema.

Os próximos parágrafos discutem os efeitos da poda de bloqueio de partição para várias declarações do MySQL em tabelas que utilizam motores de armazenamento que empregam bloqueios em nível de tabela.

#### Efeitos em declarações DML

As instruções `SELECT` (incluindo aquelas que contêm uniões ou junções) bloqueiam apenas as partições que realmente precisam ser lidas. Isso também se aplica ao `SELECT ... PARTITION`.

Uma atualização (`UPDATE` em inglês) poda travamentos apenas para tabelas nas quais não são atualizadas colunas de particionamento.

As opções `REPLACE` e `INSERT` bloqueiam apenas as partições que possuem linhas a serem inseridas ou substituídas. No entanto, se um valor `AUTO_INCREMENT` for gerado para qualquer coluna de partição, todas as partições serão bloqueadas.

`INSERT ... ON DUPLICATE KEY UPDATE` é aparado enquanto nenhuma coluna de particionamento for atualizada.

`INSERT ... SELECT` bloqueia apenas as partições na tabela de origem que precisam ser lidas, embora todas as partições na tabela de destino estejam bloqueadas.

As bloqueadoras impostas por declarações `LOAD DATA` em tabelas particionadas não podem ser eliminadas.

A presença de gatilhos `BEFORE INSERT` ou `BEFORE UPDATE` usando qualquer coluna de particionamento de uma tabela particionada significa que os bloqueios em declarações `INSERT` e `UPDATE` que atualizam esta tabela não podem ser eliminados, uma vez que o gatilho pode alterar seus valores: um gatilho `BEFORE INSERT` em qualquer uma das colunas de particionamento da tabela significa que os bloqueios definidos por `INSERT` ou `REPLACE` não podem ser eliminados, uma vez que o gatilho `BEFORE INSERT` pode alterar as colunas de particionamento de uma linha antes que a linha seja inserida, forçando a linha para uma partição diferente da que ela seria de outra forma. Um gatilho `BEFORE UPDATE` em uma coluna de particionamento significa que os bloqueios impostos por `UPDATE` ou `INSERT ... ON DUPLICATE KEY UPDATE` não podem ser eliminados.

#### Declarações DDL afetadas

`CREATE VIEW` (criar visualização) não causa bloqueios.

`ALTER TABLE ... EXCHANGE PARTITION` elimina bloqueios; apenas a tabela e a partição trocadas são bloqueadas.

`ALTER TABLE ... TRUNCATE PARTITION` elimina bloqueios; apenas as partições que serão esvaziadas são bloqueadas.

Além disso, as instruções `ALTER TABLE` garantem bloqueios de metadados no nível da tabela.

#### Outras declarações

`LOCK TABLES` não pode remover bloqueios de partição.

`CALL stored_procedure(expr)` suporta poda de bloqueio, mas a avaliação de *`expr`*

As instruções `DO` e `SET` não suportam a poda de bloqueio de partição.
