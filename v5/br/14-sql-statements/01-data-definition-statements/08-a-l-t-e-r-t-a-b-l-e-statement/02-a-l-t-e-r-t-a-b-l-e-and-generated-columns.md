#### 13.1.8.2 ALTER TABLE e Colunas Geradas

As operações `ALTER TABLE` permitidas para colunas geradas são `ADD`, `MODIFY` e `CHANGE`.

- Colunas geradas podem ser adicionadas.

  ```sql
  CREATE TABLE t1 (c1 INT);
  ALTER TABLE t1 ADD COLUMN c2 INT GENERATED ALWAYS AS (c1 + 1) STORED;
  ```

- O tipo de dados e a expressão das colunas geradas podem ser modificados.

  ```sql
  CREATE TABLE t1 (c1 INT, c2 INT GENERATED ALWAYS AS (c1 + 1) STORED);
  ALTER TABLE t1 MODIFY COLUMN c2 TINYINT GENERATED ALWAYS AS (c1 + 5) STORED;
  ```

- Colunas geradas podem ser renomeadas ou excluídas, desde que nenhuma outra coluna as refira.

  ```sql
  CREATE TABLE t1 (c1 INT, c2 INT GENERATED ALWAYS AS (c1 + 1) STORED);
  ALTER TABLE t1 CHANGE c2 c3 INT GENERATED ALWAYS AS (c1 + 1) STORED;
  ALTER TABLE t1 DROP COLUMN c3;
  ```

- As colunas geradas virtualmente não podem ser alteradas para colunas geradas armazenadas, ou vice-versa. Para contornar isso, exclua a coluna e, em seguida, adicione-a com a nova definição.

  ```sql
  CREATE TABLE t1 (c1 INT, c2 INT GENERATED ALWAYS AS (c1 + 1) VIRTUAL);
  ALTER TABLE t1 DROP COLUMN c2;
  ALTER TABLE t1 ADD COLUMN c2 INT GENERATED ALWAYS AS (c1 + 1) STORED;
  ```

- As colunas não geradas podem ser alteradas para colunas armazenadas, mas não para colunas geradas virtualmente.

  ```sql
  CREATE TABLE t1 (c1 INT, c2 INT);
  ALTER TABLE t1 MODIFY COLUMN c2 INT GENERATED ALWAYS AS (c1 + 1) STORED;
  ```

- Colunas armazenadas, mas não geradas virtualmente, podem ser alteradas para colunas não geradas. Os valores gerados armazenados se tornam os valores da coluna não gerada.

  ```sql
  CREATE TABLE t1 (c1 INT, c2 INT GENERATED ALWAYS AS (c1 + 1) STORED);
  ALTER TABLE t1 MODIFY COLUMN c2 INT;
  ```

- `ADD COLUMN` não é uma operação de inserção em tempo real para colunas armazenadas (realizada sem o uso de uma tabela temporária), porque a expressão deve ser avaliada pelo servidor. Para colunas armazenadas, as alterações de indexação são feitas em tempo real, e as alterações de expressão não são feitas em tempo real. As alterações nos comentários das colunas são feitas em tempo real.

- Para tabelas não particionadas, `ADD COLUMN` e `DROP COLUMN` são operações in-place para colunas virtuais. No entanto, adicionar ou excluir uma coluna virtual não pode ser feito in-place em combinação com outras operações de `ALTER TABLE` (alter-table.html).

  Para tabelas particionadas, `ADD COLUMN` e `DROP COLUMN` não são operações in-place para colunas virtuais.

- O `InnoDB` suporta índices secundários em colunas geradas virtualmente. Adicionar ou excluir um índice secundário em uma coluna gerada virtualmente é uma operação in-place. Para mais informações, consulte Seção 13.1.18.8, “Índices Secundários e Colunas Geradas”.

- Quando uma coluna gerada `VIRTUAL` é adicionada a uma tabela ou modificada, não se garante que os valores calculados pela expressão da coluna gerada não estejam fora do intervalo da coluna. Isso pode levar a dados inconsistentes serem retornados e a declarações falharem inesperadamente. Para permitir o controle sobre se a validação ocorre para essas colunas, o `ALTER TABLE` suporta as cláusulas `WITHOUT VALIDATION` e `WITH VALIDATION`:

  - Com `SEM VALIDAÇÃO` (a opção padrão se nenhuma das cláusulas for especificada), uma operação no local é realizada (se possível), a integridade dos dados não é verificada e a instrução termina mais rapidamente. No entanto, leituras posteriores da tabela podem exibir avisos ou erros para a coluna se os valores estiverem fora do intervalo.

  - Com `WITH VALIDATION`, `ALTER TABLE` copia a tabela. Se ocorrer um erro fora do intervalo ou qualquer outro erro, a instrução falhará. Como uma cópia da tabela é realizada, a instrução leva mais tempo.

  `SEM VALIDAÇÃO` e `COM VALIDAÇÃO` só são permitidos com as operações `ADICIONAR COLUNA`, `ALTERAR COLUNA` e `MODIFICAR COLUNA`. Caso contrário, ocorre um erro `ER_WRONG_USAGE`.

- A partir do MySQL 5.7.10, se a avaliação da expressão causar truncação ou fornecer uma entrada incorreta para uma função, a instrução `ALTER TABLE` termina com um erro e a operação DDL é rejeitada.

- Uma declaração `ALTER TABLE` que altera o valor padrão de uma coluna *`col_name`* também pode alterar o valor de uma expressão de coluna gerada que faz referência à coluna usando `DEFAULT(col_name)` (funções diversas.html#função_default). Por essa razão, a partir do MySQL 5.7.13, as operações `ALTER TABLE` que alteram a definição de uma coluna causam uma reconstrução da tabela se qualquer expressão de coluna gerada usar `DEFAULT()` (funções diversas.html#função_default).
