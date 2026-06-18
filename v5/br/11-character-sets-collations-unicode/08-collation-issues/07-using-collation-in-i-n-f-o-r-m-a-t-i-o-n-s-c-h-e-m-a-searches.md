### 10.8.7 Usando Collation em Buscas no INFORMATION_SCHEMA

Colunas de string nas tabelas do `INFORMATION_SCHEMA` possuem uma `collation` de `utf8_general_ci`, que não diferencia maiúsculas de minúsculas (`case-insensitive`). No entanto, para valores que correspondem a objetos representados no sistema de arquivos, como Databases e tabelas, as buscas em colunas de string do `INFORMATION_SCHEMA` podem ser `case-sensitive` (sensíveis a maiúsculas e minúsculas) ou `case-insensitive`, dependendo das características do sistema de arquivos subjacente e do valor da variável de sistema `lower_case_table_names`. Por exemplo, as buscas podem ser `case-sensitive` se o sistema de arquivos for `case-sensitive`. Esta seção descreve este comportamento e como modificá-lo, se necessário; veja também Bug #34921.

Suponha que uma Query busque a coluna `SCHEMATA.SCHEMA_NAME` pelo Database `test`. No Linux, os sistemas de arquivos são `case-sensitive`, portanto, comparações de `SCHEMATA.SCHEMA_NAME` com `'test'` encontram correspondência, mas comparações com `'TEST'` não:

```sql
mysql> SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA
       WHERE SCHEMA_NAME = 'test';
+-------------+
| SCHEMA_NAME |
+-------------+
| test        |
+-------------+

mysql> SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA
       WHERE SCHEMA_NAME = 'TEST';
Empty set (0.00 sec)
```

Estes resultados ocorrem com a variável de sistema `lower_case_table_names` definida como 0. Alterar o valor de `lower_case_table_names` para 1 ou 2 faz com que a segunda Query retorne o mesmo resultado (não vazio) que a primeira Query.

No Windows ou macOS, os sistemas de arquivos não são `case-sensitive`, portanto, as comparações encontram correspondência tanto para `'test'` quanto para `'TEST'`:

```sql
mysql> SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA
       WHERE SCHEMA_NAME = 'test';
+-------------+
| SCHEMA_NAME |
+-------------+
| test        |
+-------------+

mysql> SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA
       WHERE SCHEMA_NAME = 'TEST';
+-------------+
| SCHEMA_NAME |
+-------------+
| TEST        |
+-------------+
```

O valor de `lower_case_table_names` não faz diferença neste contexto.

O comportamento anterior ocorre porque a `collation` `utf8_general_ci` não é utilizada para Queries no `INFORMATION_SCHEMA` ao buscar valores que correspondem a objetos representados no sistema de arquivos. Isso é resultado de otimizações de varredura do sistema de arquivos implementadas para buscas no `INFORMATION_SCHEMA`. Para obter informações sobre essas otimizações, consulte Seção 8.2.3, “Optimizing INFORMATION_SCHEMA Queries”.

Se o resultado de uma operação de string em uma coluna do `INFORMATION_SCHEMA` for diferente do esperado, uma solução alternativa (`workaround`) é usar uma cláusula `COLLATE` explícita para forçar uma `collation` adequada (consulte Seção 10.8.1, “Using COLLATE in SQL Statements”). Por exemplo, para realizar uma busca `case-insensitive`, use `COLLATE` com o nome da coluna do `INFORMATION_SCHEMA`:

```sql
mysql> SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA
       WHERE SCHEMA_NAME COLLATE utf8_general_ci = 'test';
+-------------+
| SCHEMA_NAME |
+-------------+
| test        |
+-------------+

mysql> SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA
       WHERE SCHEMA_NAME COLLATE utf8_general_ci = 'TEST';
+-------------+
| SCHEMA_NAME |
+-------------+
| test        |
+-------------+
```

Nas Queries anteriores, é importante aplicar a cláusula `COLLATE` ao nome da coluna do `INFORMATION_SCHEMA`. Aplicar `COLLATE` ao valor de comparação não tem efeito.

Você também pode usar a função `UPPER()` ou `LOWER()`:

```sql
WHERE UPPER(SCHEMA_NAME) = 'TEST'
WHERE LOWER(SCHEMA_NAME) = 'test'
```

Embora uma comparação `case-insensitive` possa ser realizada mesmo em plataformas com sistemas de arquivos `case-sensitive`, como acabamos de mostrar, isso não é necessariamente sempre o correto a se fazer. Em tais plataformas, é possível ter múltiplos objetos com nomes que diferem apenas no uso de maiúsculas/minúsculas. Por exemplo, tabelas nomeadas `city`, `CITY` e `City` podem coexistir simultaneamente. Considere se uma busca deve corresponder a todos esses nomes ou apenas a um, e escreva as Queries de acordo. A primeira das seguintes comparações (com `utf8_bin`) é `case-sensitive`; as outras não são:

```sql
WHERE TABLE_NAME COLLATE utf8_bin = 'City'
WHERE TABLE_NAME COLLATE utf8_general_ci = 'city'
WHERE UPPER(TABLE_NAME) = 'CITY'
WHERE LOWER(TABLE_NAME) = 'city'
```

Buscas em colunas de string do `INFORMATION_SCHEMA` por valores que se referem ao próprio `INFORMATION_SCHEMA` usam a `collation` `utf8_general_ci` porque `INFORMATION_SCHEMA` é um Database “virtual” não representado no sistema de arquivos. Por exemplo, comparações com `SCHEMATA.SCHEMA_NAME` encontram correspondência para `'information_schema'` ou `'INFORMATION_SCHEMA'` independentemente da plataforma:

```sql
mysql> SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA
       WHERE SCHEMA_NAME = 'information_schema';
+--------------------+
| SCHEMA_NAME        |
+--------------------+
| information_schema |
+--------------------+

mysql> SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA
       WHERE SCHEMA_NAME = 'INFORMATION_SCHEMA';
+--------------------+
| SCHEMA_NAME        |
+--------------------+
| information_schema |
+--------------------+
```