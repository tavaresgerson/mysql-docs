#### 15.1.11.2 Alterar tabelas e colunas geradas

As operações `ALTER TABLE` permitidas para colunas geradas são `ADD`, `MODIFY` e `CHANGE`.

* Colunas geradas podem ser adicionadas.

```
  CREATE TABLE t1 (c1 INT);
  ALTER TABLE t1 ADD COLUMN c2 INT GENERATED ALWAYS AS (c1 + 1) STORED;
  ```

* O tipo de dados e a expressão de colunas geradas podem ser modificados.

```
  CREATE TABLE t1 (c1 INT, c2 INT GENERATED ALWAYS AS (c1 + 1) STORED);
  ALTER TABLE t1 MODIFY COLUMN c2 TINYINT GENERATED ALWAYS AS (c1 + 5) STORED;
  ```

* Colunas geradas podem ser renomeadas ou excluídas, desde que nenhuma outra coluna as refira.

```
  CREATE TABLE t1 (c1 INT, c2 INT GENERATED ALWAYS AS (c1 + 1) STORED);
  ALTER TABLE t1 CHANGE c2 c3 INT GENERATED ALWAYS AS (c1 + 1) STORED;
  ALTER TABLE t1 DROP COLUMN c3;
  ```

* Colunas geradas virtuais não podem ser alteradas para colunas armazenadas ou vice-versa. Para contornar isso, exclua a coluna e adicione-a com a nova definição.

```
  CREATE TABLE t1 (c1 INT, c2 INT GENERATED ALWAYS AS (c1 + 1) VIRTUAL);
  ALTER TABLE t1 DROP COLUMN c2;
  ALTER TABLE t1 ADD COLUMN c2 INT GENERATED ALWAYS AS (c1 + 1) STORED;
  ```

* Colunas não geradas podem ser alteradas para armazenadas, mas não para colunas geradas virtuais.

```
  CREATE TABLE t1 (c1 INT, c2 INT);
  ALTER TABLE t1 MODIFY COLUMN c2 INT GENERATED ALWAYS AS (c1 + 1) STORED;
  ```

* Colunas armazenadas, mas não virtuais geradas, podem ser alteradas para colunas não geradas. Os valores gerados armazenados se tornam os valores da coluna não gerada.

```
  CREATE TABLE t1 (c1 INT, c2 INT GENERATED ALWAYS AS (c1 + 1) STORED);
  ALTER TABLE t1 MODIFY COLUMN c2 INT;
  ```

* `ADD COLUMN` não é uma operação in-place para colunas armazenadas (realizada sem o uso de uma tabela temporária) porque a expressão deve ser avaliada pelo servidor. Para colunas armazenadas, as alterações de índice são feitas in-place e as alterações de expressão não são feitas in-place. As alterações nos comentários das colunas são feitas in-place.

* Para tabelas não particionadas, `ADD COLUMN` e `DROP COLUMN` são operações in-place para colunas virtuais. No entanto, adicionar ou excluir uma coluna virtual não pode ser feito in-place em combinação com outras operações `ALTER TABLE`.

* Para tabelas particionadas, `ADD COLUMN` e `DROP COLUMN` não são operações in-place para colunas virtuais.

* O `InnoDB` suporta índices secundários em colunas geradas virtuais. Adicionar ou excluir um índice secundário em uma coluna gerada virtual é uma operação in-place. Para mais informações, consulte a Seção 15.1.24.9, “Indekses Secundários e Colunas Geradas”.

* Quando uma coluna gerada por `VIRTUAL` é adicionada a uma tabela ou modificada, não se garante que os dados calculados pela expressão da coluna gerada não estejam fora do intervalo da coluna. Isso pode levar a dados inconsistentes sendo retornados e declarações falhando inesperadamente. Para permitir o controle sobre se a validação ocorre para tais colunas, o `ALTER TABLE` suporta as cláusulas `WITHOUT VALIDATION` e `WITH VALIDATION`:

  + Com `WITHOUT VALIDATION` (o padrão se nenhuma cláusula for especificada), uma operação local é realizada (se possível), a integridade dos dados não é verificada e a declaração termina mais rapidamente. No entanto, leituras posteriores da tabela podem relatar avisos ou erros para a coluna se os valores estiverem fora do intervalo.

  + Com `WITH VALIDATION`, o `ALTER TABLE` copia a tabela. Se ocorrer um erro fora do intervalo ou qualquer outro erro, a declaração falha. Como uma cópia da tabela é realizada, a declaração leva mais tempo.

`WITHOUT VALIDATION` e `WITH VALIDATION` são permitidos apenas com as operações `ADD COLUMN`, `CHANGE COLUMN` e `MODIFY COLUMN`. Caso contrário, ocorre um erro `ER_WRONG_USAGE`.

* Se a avaliação da expressão causar truncação ou fornecer entrada incorreta para uma função, a declaração `ALTER TABLE` termina com um erro e a operação DDL é rejeitada.

* Uma declaração `ALTER TABLE` que altera o valor padrão de uma coluna *`col_name`* também pode alterar o valor de uma expressão de coluna gerada que se refere à coluna usando *`col_name`*, o que pode alterar o valor de uma expressão de coluna gerada que se refere à coluna usando `DEFAULT(col_name)`. Por essa razão, as operações `ALTER TABLE` que alteram a definição de uma coluna causam uma reconstrução da tabela se qualquer expressão de coluna gerada usar `DEFAULT()`.