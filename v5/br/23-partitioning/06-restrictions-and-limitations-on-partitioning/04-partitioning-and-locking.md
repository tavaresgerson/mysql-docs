### 22.6.4 Particionamento e Locking

Para storage engines como o `MyISAM` que de fato executam Locks em nível de tabela ao executar comandos DML ou DDL, tal comando em versões mais antigas do MySQL (5.6.5 e anteriores) que afetava uma tabela particionada impunha um Lock na tabela como um todo; ou seja, todas as partições eram bloqueadas até que o comando fosse concluído. No MySQL 5.7, a poda de Locks de partição (*partition lock pruning*) elimina Locks desnecessários em muitos casos, e a maioria dos comandos de leitura ou atualização de uma tabela `MyISAM` particionada faz com que apenas as partições afetadas sejam bloqueadas. Por exemplo, um `SELECT` de uma tabela `MyISAM` particionada aplica o Lock apenas naquelas partições que de fato contêm linhas que satisfazem a condição `WHERE` do comando `SELECT`.

Para comandos que afetam tabelas particionadas usando storage engines como o `InnoDB`, que empregam row-level locking (Lock em nível de linha) e não executam (ou precisam executar) os Locks antes da poda de partição (*partition pruning*), isso não é um problema.

Os próximos parágrafos discutem os efeitos da poda de Locks de partição (*partition lock pruning*) para vários comandos MySQL em tabelas que utilizam storage engines que empregam Locks em nível de tabela.

#### Efeitos em comandos DML

Comandos `SELECT` (incluindo aqueles que contêm unions ou joins) aplicam o Lock apenas nas partições que precisam ser lidas. Isso também se aplica a `SELECT ... PARTITION`.

Um `UPDATE` poda Locks apenas para tabelas nas quais nenhuma coluna de particionamento é atualizada.

`REPLACE` e `INSERT` aplicam o Lock apenas nas partições que possuem linhas a serem inseridas ou substituídas. No entanto, se um valor `AUTO_INCREMENT` for gerado para qualquer coluna de particionamento, todas as partições serão bloqueadas.

O `INSERT ... ON DUPLICATE KEY UPDATE` tem Locks podados, desde que nenhuma coluna de particionamento seja atualizada.

O `INSERT ... SELECT` aplica Lock apenas nas partições da tabela de origem que precisam ser lidas, embora todas as partições na tabela de destino sejam bloqueadas.

Os Locks impostos por comandos `LOAD DATA` em tabelas particionadas não podem ser podados.

A presença de triggers `BEFORE INSERT` ou `BEFORE UPDATE` que utilizam qualquer coluna de particionamento de uma tabela particionada significa que os Locks em comandos `INSERT` e `UPDATE` que atualizam esta tabela não podem ser podados, uma vez que o trigger pode alterar seus valores: Um trigger `BEFORE INSERT` em qualquer uma das colunas de particionamento da tabela significa que os Locks definidos por `INSERT` ou `REPLACE` não podem ser podados, pois o trigger `BEFORE INSERT` pode alterar as colunas de particionamento de uma linha antes que ela seja inserida, forçando a linha a ir para uma partição diferente da original. Um trigger `BEFORE UPDATE` em uma coluna de particionamento significa que os Locks impostos por `UPDATE` ou `INSERT ... ON DUPLICATE KEY UPDATE` não podem ser podados.

#### Comandos DDL afetados

`CREATE VIEW` não causa nenhum Lock.

O `ALTER TABLE ... EXCHANGE PARTITION` poda Locks; apenas a tabela trocada e a partição trocada são bloqueadas.

O `ALTER TABLE ... TRUNCATE PARTITION` poda Locks; apenas as partições a serem esvaziadas são bloqueadas.

Além disso, comandos `ALTER TABLE` aplicam metadata locks (Locks de metadados) no nível da tabela.

#### Outros comandos

O `LOCK TABLES` não pode podar Locks de partição.

O `CALL stored_procedure(expr)` suporta a poda de Locks, mas a avaliação de *`expr`* não.

Os comandos `DO` e `SET` não suportam a poda de Locks de particionamento.