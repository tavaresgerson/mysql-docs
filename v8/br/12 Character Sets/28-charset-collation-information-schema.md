### 12.8.7 Uso de Coletâneas em Pesquisas na Tabela `INFORMATION_SCHEMA`

Colunas de texto nas tabelas de `INFORMATION_SCHEMA` têm uma coletânea de `utf8mb3_general_ci`, que é insensível a maiúsculas e minúsculas. No entanto, para valores que correspondem a objetos representados no sistema de arquivos, como bancos de dados e tabelas, as pesquisas nas colunas de texto de `INFORMATION_SCHEMA` podem ser sensíveis ou insensíveis a maiúsculas, dependendo das características do sistema de arquivos subjacente e do valor da variável de sistema `lower_case_table_names`. Por exemplo, as pesquisas podem ser sensíveis a maiúsculas se o sistema de arquivos for sensível a maiúsculas. Esta seção descreve esse comportamento e como modificá-lo, se necessário.

Suponha que uma consulta pesquise a coluna `SCHEMATA.SCHEMA_NAME` pelo banco de dados `test`. No Linux, os sistemas de arquivos são sensíveis a maiúsculas, então as comparações de `SCHEMATA.SCHEMA_NAME` com `'test'` correspondem, mas as comparações com `'TEST'` não:

```
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

Esses resultados ocorrem com a variável de sistema `lower_case_table_names` definida como 0. Um valor de `lower_case_table_names` de 1 ou 2 faz com que a segunda consulta retorne o mesmo (não vazio) resultado que a primeira consulta.

::: info Nota

É proibido iniciar o servidor com uma variável de sistema `lower_case_table_names` diferente da variável de sistema usada quando o servidor foi inicializado.


:::

No Windows ou macOS, os sistemas de arquivos não são sensíveis a maiúsculas, então as comparações correspondem tanto a `'test'` quanto a `'TEST'`:

```
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

O comportamento anterior ocorre porque a coletânea `utf8mb3_general_ci` não é usada para pesquisas de `INFORMATION_SCHEMA` ao pesquisar por valores que correspondem a objetos representados no sistema de arquivos.

Se o resultado de uma operação de string em uma coluna de `INFORMATION_SCHEMA` for diferente das expectativas, uma solução é usar uma cláusula `COLLATE` explícita para forçar uma collation adequada (consulte a Seção 12.8.1, “Usando COLLATE em instruções SQL”). Por exemplo, para realizar uma pesquisa não sensível ao caso, use `COLLATE` com o nome da coluna de `INFORMATION_SCHEMA`:

```
mysql> SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA
       WHERE SCHEMA_NAME COLLATE utf8mb3_general_ci = 'test';
+-------------+
| SCHEMA_NAME |
+-------------+
| test        |
+-------------+

mysql> SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA
       WHERE SCHEMA_NAME COLLATE utf8mb3_general_ci = 'TEST';
+-------------+
| SCHEMA_NAME |
+-------------+
| test        |
+-------------+
```

Você também pode usar a função `UPPER()` ou `LOWER()`:

```
WHERE UPPER(SCHEMA_NAME) = 'TEST'
WHERE LOWER(SCHEMA_NAME) = 'test'
```

Embora uma comparação não sensível ao caso possa ser realizada mesmo em plataformas com sistemas de arquivos sensíveis ao caso, como mostrado acima, nem sempre é a coisa certa a fazer. Em tais plataformas, é possível ter múltiplos objetos com nomes que diferem apenas na maiúscula e minúscula. Por exemplo, tabelas nomeadas `city`, `CITY` e `City` podem existir simultaneamente. Considere se uma pesquisa deve corresponder a todos esses nomes ou apenas a um deles e escreva consultas de acordo. A primeira das seguintes comparações (com `utf8mb3_bin`) é sensível ao caso; as outras não:

```
WHERE TABLE_NAME COLLATE utf8mb3_bin = 'City'
WHERE TABLE_NAME COLLATE utf8mb3_general_ci = 'city'
WHERE UPPER(TABLE_NAME) = 'CITY'
WHERE LOWER(TABLE_NAME) = 'city'
```

As pesquisas em colunas de string de `INFORMATION_SCHEMA` para valores que se referem ao próprio `INFORMATION_SCHEMA` usam a collation `utf8mb3_general_ci` porque `INFORMATION_SCHEMA` é um banco de dados “virtual” não representado no sistema de arquivos. Por exemplo, as comparações com `SCHEMATA.SCHEMA_NAME` correspondem a `'information_schema'` ou `'INFORMATION_SCHEMA'` independentemente da plataforma:

```
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