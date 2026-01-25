### 24.3.2 A Tabela CHARACTER_SETS do INFORMATION_SCHEMA

A tabela [`CHARACTER_SETS`](information-schema-character-sets-table.html "24.3.2 The INFORMATION_SCHEMA CHARACTER_SETS Table") fornece informações sobre os conjuntos de caracteres (character sets) disponíveis.

A tabela [`CHARACTER_SETS`](information-schema-character-sets-table.html "24.3.2 The INFORMATION_SCHEMA CHARACTER_SETS Table") possui estas colunas:

* `CHARACTER_SET_NAME`

  O nome do conjunto de caracteres.

* `DEFAULT_COLLATE_NAME`

  A collation padrão para o conjunto de caracteres.

* `DESCRIPTION`

  Uma descrição do conjunto de caracteres.

* `MAXLEN`

  O número máximo de bytes necessários para armazenar um caractere.

#### Notas

Informações sobre character sets também estão disponíveis a partir da instrução [`SHOW CHARACTER SET`](show-character-set.html "13.7.5.3 SHOW CHARACTER SET Statement"). Consulte [Seção 13.7.5.3, “SHOW CHARACTER SET Statement”](show-character-set.html "13.7.5.3 SHOW CHARACTER SET Statement"). As seguintes instruções são equivalentes:

```sql
SELECT * FROM INFORMATION_SCHEMA.CHARACTER_SETS
  [WHERE CHARACTER_SET_NAME LIKE 'wild']

SHOW CHARACTER SET
  [LIKE 'wild']
```