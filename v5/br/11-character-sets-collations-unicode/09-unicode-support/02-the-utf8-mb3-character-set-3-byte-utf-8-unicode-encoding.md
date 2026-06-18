### 10.9.2 O Character Set utf8mb3 (Codificação Unicode UTF-8 de 3 Bytes)

O `character set` `utf8mb3` possui estas características:

* Suporta apenas caracteres BMP (sem suporte para caracteres suplementares)

* Requer um máximo de três bytes por caractere multibyte.

Aplicações que usam dados UTF-8, mas que exigem suporte a caracteres suplementares, devem usar `utf8mb4` em vez de `utf8mb3` (veja Seção 10.9.1, “O Character Set utf8mb4 (Codificação Unicode UTF-8 de 4 Bytes)”").

Exatamente o mesmo conjunto de caracteres está disponível em `utf8mb3` e `ucs2`. Ou seja, eles têm o mesmo `repertoire`.

`utf8` é um `alias` para `utf8mb3`; o limite de caracteres é implícito, em vez de explícito no nome.

`utf8mb3` pode ser usado em cláusulas `CHARACTER SET`, e `utf8mb3_collation_substring` em cláusulas `COLLATE`, onde *`collation_substring`* é `bin`, `czech_ci`, `danish_ci`, `esperanto_ci`, `estonian_ci`, e assim por diante. Por exemplo:

```sql
CREATE TABLE t (s1 CHAR(1)) CHARACTER SET utf8mb3;
SELECT * FROM t WHERE s1 COLLATE utf8mb3_general_ci = 'x';
DECLARE x VARCHAR(5) CHARACTER SET utf8mb3 COLLATE utf8mb3_danish_ci;
SELECT CAST('a' AS CHAR CHARACTER SET utf8) COLLATE utf8_czech_ci;
```

O MySQL converte imediatamente instâncias de `utf8mb3` em `statements` para `utf8`, então em `statements` como `SHOW CREATE TABLE` ou `SELECT CHARACTER_SET_NAME FROM INFORMATION_SCHEMA.COLUMNS` ou `SELECT COLLATION_NAME FROM INFORMATION_SCHEMA.COLUMNS`, os usuários verão o nome `utf8` ou `utf8_collation_substring`.

`utf8mb3` também é válido em contextos diferentes das cláusulas `CHARACTER SET`. Por exemplo:

```sql
mysqld --character-set-server=utf8mb3
```

```sql
SET NAMES 'utf8mb3'; /* and other SET statements that have similar effect */
SELECT _utf8mb3 'a';
```

Para obter informações sobre o armazenamento de tipos de dados conforme ele se relaciona a `character sets` multibyte, veja Requisitos de Armazenamento de Tipos String.