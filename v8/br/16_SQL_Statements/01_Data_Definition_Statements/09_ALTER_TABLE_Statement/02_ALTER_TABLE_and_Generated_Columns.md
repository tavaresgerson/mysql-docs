#### 15.1.9.2 ALTER TABLE e Colunas Geradas

As operações `ALTER TABLE` permitidas para colunas geradas são `ADD`, `MODIFY` e `CHANGE`.

- Colunas geradas podem ser adicionadas.

  ```
  CREATE TABLE t1 (c1 INT);
  ALTER TABLE t1 ADD COLUMN c2 INT GENERATED ALWAYS AS (c1 + 1) STORED;
  ```

- O tipo de dados e a expressão das colunas geradas podem ser modificados.

  ```
  CREATE TABLE t1 (c1 INT, c2 INT GENERATED ALWAYS AS (c1 + 1) STORED);
  ALTER TABLE t1 MODIFY COLUMN c2 TINYINT GENERATED ALWAYS AS (c1 + 5) STORED;
  ```

- Colunas geradas podem ser renomeadas ou excluídas, desde que nenhuma outra coluna as refira.

  ```
  CREATE TABLE t1 (c1 INT, c2 INT GENERATED ALWAYS AS (c1 + 1) STORED);
  ALTER TABLE t1 CHANGE c2 c3 INT GENERATED ALWAYS AS (c1 + 1) STORED;
  ALTER TABLE t1 DROP COLUMN c3;
  ```

- As colunas geradas virtualmente não podem ser alteradas para colunas geradas armazenadas, ou vice-versa. Para contornar isso, exclua a coluna e, em seguida, adicione-a com a nova definição.

  ```
  CREATE TABLE t1 (c1 INT, c2 INT GENERATED ALWAYS AS (c1 + 1) VIRTUAL);
  ALTER TABLE t1 DROP COLUMN c2;
  ALTER TABLE t1 ADD COLUMN c2 INT GENERATED ALWAYS AS (c1 + 1) STORED;
  ```

- As colunas não geradas podem ser alteradas para colunas armazenadas, mas não para colunas geradas virtualmente.

  ```
  CREATE TABLE t1 (c1 INT, c2 INT);
  ALTER TABLE t1 MODIFY COLUMN c2 INT GENERATED ALWAYS AS (c1 + 1) STORED;
  ```

- Colunas armazenadas, mas não geradas virtualmente, podem ser alteradas para colunas não geradas. Os valores gerados armazenados se tornam os valores da coluna não gerada.

  ```
  CREATE TABLE t1 (c1 INT, c2 INT GENERATED ALWAYS AS (c1 + 1) STORED);
  ALTER TABLE t1 MODIFY COLUMN c2 INT;
  ```

- `ADD COLUMN` não é uma operação in-place para colunas armazenadas (realizada sem o uso de uma tabela temporária), porque a expressão deve ser avaliada pelo servidor. Para colunas armazenadas, as alterações de indexação são feitas in-place, e as alterações de expressão não são feitas in-place. Alterações nos comentários das colunas são feitas in-place.

- Para tabelas não particionadas, `ADD COLUMN` e `DROP COLUMN` são operações in-place para colunas virtuais. No entanto, a adição ou remoção de uma coluna virtual não pode ser realizada in-place em combinação com outras operações `ALTER TABLE`.

  Para tabelas particionadas, `ADD COLUMN` e `DROP COLUMN` não são operações in-place para colunas virtuais.

- O `InnoDB` suporta índices secundários em colunas geradas virtualmente. Adicionar ou excluir um índice secundário em uma coluna gerada virtualmente é uma operação in-place. Para mais informações, consulte a Seção 15.1.20.9, “Índices Secundários e Colunas Geradas”.

- Quando uma coluna gerada por `VIRTUAL` é adicionada a uma tabela ou modificada, não se garante que os dados calculados pela expressão da coluna gerada não estejam fora do intervalo da coluna. Isso pode levar a dados inconsistentes serem retornados e a declarações falharem inesperadamente. Para permitir o controle sobre se a validação ocorre para essas colunas, o `ALTER TABLE` suporta as cláusulas `WITHOUT VALIDATION` e `WITH VALIDATION`:

  - Com `WITHOUT VALIDATION` (o padrão se nenhuma cláusula for especificada), uma operação in-place é realizada (se possível), a integridade dos dados não é verificada e a instrução termina mais rapidamente. No entanto, leituras posteriores da tabela podem emitir avisos ou erros para a coluna se os valores estiverem fora do intervalo.

  - Com `WITH VALIDATION`, `ALTER TABLE` copia a tabela. Se ocorrer um erro fora do intervalo ou qualquer outro erro, a instrução falha. Como uma cópia da tabela é realizada, a instrução leva mais tempo.

  `WITHOUT VALIDATION` e `WITH VALIDATION` são permitidos apenas com as operações `ADD COLUMN`, `CHANGE COLUMN` e `MODIFY COLUMN`. Caso contrário, ocorre um erro `ER_WRONG_USAGE`.

- Se a avaliação da expressão causar truncação ou fornecer uma entrada incorreta para uma função, a instrução `ALTER TABLE` termina com um erro e a operação DDL é rejeitada.

- Uma declaração `ALTER TABLE` que altera o valor padrão de uma coluna `col_name` também pode alterar o valor de uma expressão de coluna gerada que faz referência à coluna usando `col_name`, o que pode alterar o valor de uma expressão de coluna gerada que faz referência à coluna usando `DEFAULT(col_name)`. Por essa razão, operações `ALTER TABLE` que alteram a definição de uma coluna causam uma reconstrução da tabela se alguma expressão de coluna gerada usar `DEFAULT()`.
