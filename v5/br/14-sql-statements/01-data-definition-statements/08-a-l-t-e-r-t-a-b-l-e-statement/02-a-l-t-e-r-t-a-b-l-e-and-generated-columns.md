#### 13.1.8.2 ALTER TABLE e Colunas Geradas

As operações `ALTER TABLE` permitidas para colunas geradas são `ADD`, `MODIFY` e `CHANGE`.

* Colunas geradas podem ser adicionadas.

  ```sql
  CREATE TABLE t1 (c1 INT);
  ALTER TABLE t1 ADD COLUMN c2 INT GENERATED ALWAYS AS (c1 + 1) STORED;
  ```

* O tipo de dado e a expression de colunas geradas podem ser modificados.

  ```sql
  CREATE TABLE t1 (c1 INT, c2 INT GENERATED ALWAYS AS (c1 + 1) STORED);
  ALTER TABLE t1 MODIFY COLUMN c2 TINYINT GENERATED ALWAYS AS (c1 + 5) STORED;
  ```

* Colunas geradas podem ser renomeadas ou eliminadas (dropped), se nenhuma outra coluna se referir a elas.

  ```sql
  CREATE TABLE t1 (c1 INT, c2 INT GENERATED ALWAYS AS (c1 + 1) STORED);
  ALTER TABLE t1 CHANGE c2 c3 INT GENERATED ALWAYS AS (c1 + 1) STORED;
  ALTER TABLE t1 DROP COLUMN c3;
  ```

* Colunas geradas `VIRTUAL` não podem ser alteradas para colunas geradas `STORED`, ou vice-versa. Para contornar isso, elimine (drop) a column e, em seguida, adicione-a com a nova definition.

  ```sql
  CREATE TABLE t1 (c1 INT, c2 INT GENERATED ALWAYS AS (c1 + 1) VIRTUAL);
  ALTER TABLE t1 DROP COLUMN c2;
  ALTER TABLE t1 ADD COLUMN c2 INT GENERATED ALWAYS AS (c1 + 1) STORED;
  ```

* Colunas não geradas podem ser alteradas para colunas geradas `STORED`, mas não `VIRTUAL`.

  ```sql
  CREATE TABLE t1 (c1 INT, c2 INT);
  ALTER TABLE t1 MODIFY COLUMN c2 INT GENERATED ALWAYS AS (c1 + 1) STORED;
  ```

* Colunas geradas `STORED` (mas não `VIRTUAL`) podem ser alteradas para colunas não geradas. Os valores gerados `STORED` tornam-se os valores da coluna não gerada.

  ```sql
  CREATE TABLE t1 (c1 INT, c2 INT GENERATED ALWAYS AS (c1 + 1) STORED);
  ALTER TABLE t1 MODIFY COLUMN c2 INT;
  ```

* `ADD COLUMN` não é uma operação *in-place* para colunas `STORED` (feita sem o uso de uma tabela temporária) porque a expression deve ser avaliada pelo server. Para colunas `STORED`, as alterações de Indexing são feitas *in-place*, e as alterações de expression não são feitas *in-place*. As alterações nos comentários da coluna são feitas *in-place*.

* Para tabelas não particionadas, `ADD COLUMN` e `DROP COLUMN` são operações *in-place* para colunas `VIRTUAL`. No entanto, adicionar ou eliminar (dropping) uma coluna `VIRTUAL` não pode ser realizado *in-place* em combinação com outras operações [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement").

  Para tabelas particionadas, `ADD COLUMN` e `DROP COLUMN` não são operações *in-place* para colunas `VIRTUAL`.

* `InnoDB` suporta secondary indexes em colunas geradas `VIRTUAL`. Adicionar ou eliminar (dropping) um secondary index em uma coluna gerada `VIRTUAL` é uma operação *in-place*. Para mais informações, consulte [Section 13.1.18.8, “Secondary Indexes and Generated Columns”](create-table-secondary-indexes.html "13.1.18.8 Secondary Indexes and Generated Columns").

* Quando uma coluna gerada `VIRTUAL` é adicionada ou modificada em uma tabela, não há garantia de que os valores sendo calculados pela expression da coluna gerada não estejam fora do range (out of range) para a coluna. Isso pode levar ao retorno de dados inconsistentes e a falhas inesperadas de statements. Para permitir o controle sobre se a validation ocorre para tais colunas, `ALTER TABLE` suporta as cláusulas `WITHOUT VALIDATION` e `WITH VALIDATION`:

  + Com `WITHOUT VALIDATION` (o padrão se nenhuma das cláusulas for especificada), uma operação *in-place* é executada (se possível), a integridade dos dados não é verificada, e o statement é concluído mais rapidamente. No entanto, leituras posteriores da tabela podem relatar warnings ou erros para a coluna se os valores estiverem fora do range.

  + Com `WITH VALIDATION`, `ALTER TABLE` copia a tabela. Se um erro de *out-of-range* ou qualquer outro erro ocorrer, o statement falha. Como uma cópia da tabela é executada, o statement leva mais tempo.

  `WITHOUT VALIDATION` e `WITH VALIDATION` são permitidos apenas com as operações `ADD COLUMN`, `CHANGE COLUMN` e `MODIFY COLUMN`. Caso contrário, ocorre um erro [`ER_WRONG_USAGE`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_wrong_usage).

* A partir do MySQL 5.7.10, se a avaliação da expression causar truncamento ou fornecer input incorreto a uma função, o statement [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") é encerrado com um erro e a operação DDL é rejeitada.

* Um statement [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") que altera o valor default de uma coluna *`col_name`* pode também alterar o valor de uma expression de coluna gerada que se refere à coluna usando [`DEFAULT(col_name)`](miscellaneous-functions.html#function_default). Por esse motivo, a partir do MySQL 5.7.13, operações [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") que alteram a definition de uma coluna causam uma reconstrução da tabela (*table rebuild*) se alguma expression de coluna gerada usar [`DEFAULT()`](miscellaneous-functions.html#function_default).