### 10.8.7 Uso da Colagem em Pesquisas no INFORMATION_SCHEMA

As colunas de texto nas tabelas do `INFORMATION_SCHEMA` têm uma concordância de `utf8_general_ci`, que é insensível a maiúsculas e minúsculas. No entanto, para valores que correspondem a objetos representados no sistema de arquivos, como bancos de dados e tabelas, as pesquisas nas colunas de texto do `INFORMATION_SCHEMA` podem ser sensíveis ou insensíveis a maiúsculas, dependendo das características do sistema de arquivos subjacente e do valor da variável de sistema `lower_case_table_names`. Por exemplo, as pesquisas podem ser sensíveis a maiúsculas se o sistema de arquivos for sensível a maiúsculas. Esta seção descreve esse comportamento e como modificá-lo, se necessário; veja também o Bug #34921.

Suponha que uma consulta procure a coluna `SCHEMATA.SCHEMA_NAME` para o banco de dados `test`. No Linux, os sistemas de arquivos são case-sensitive, então as comparações de `SCHEMATA.SCHEMA_NAME` com `'test'` correspondem, mas as comparações com `'TEST'` não:

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

Esses resultados ocorrem quando a variável de sistema `lower_case_table_names` é definida como 0. Alterar o valor de `lower_case_table_names` para 1 ou 2 faz com que a segunda consulta retorne o mesmo resultado (não vazio) que a primeira consulta.

Em Windows ou macOS, os sistemas de arquivos não são case-sensitive, então as comparações correspondem tanto a `'test'` quanto a `'TEST'`:

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

Esse comportamento anterior ocorre porque a collation `utf8_general_ci` não é usada para consultas do `INFORMATION_SCHEMA` ao procurar valores que correspondem a objetos representados no sistema de arquivos. É um resultado das otimizações de varredura do sistema de arquivos implementadas para as pesquisas do `INFORMATION_SCHEMA`. Para obter informações sobre essas otimizações, consulte a Seção 8.2.3, “Otimizando consultas do INFORMATION_SCHEMA”.

Se o resultado de uma operação de string em uma coluna do `INFORMATION_SCHEMA` for diferente das expectativas, uma solução é usar uma cláusula `COLLATE` explícita para forçar uma collation adequada (consulte a Seção 10.8.1, “Usando COLLATE em Instruções SQL”). Por exemplo, para realizar uma pesquisa não sensível ao caso, use `COLLATE` com o nome da coluna `INFORMATION_SCHEMA`:

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

Nas consultas anteriores, é importante aplicar a cláusula `COLLATE` ao nome da coluna `INFORMATION_SCHEMA`. Aplicar `COLLATE` ao valor de comparação não tem efeito.

Você também pode usar a função `UPPER()` ou `LOWER()`:

```sql
WHERE UPPER(SCHEMA_NAME) = 'TEST'
WHERE LOWER(SCHEMA_NAME) = 'test'
```

Embora uma comparação não sensível à maiúscula possa ser realizada mesmo em plataformas com sistemas de arquivos sensíveis à maiúscula, como foi demonstrado, nem sempre é a coisa certa a fazer. Nessas plataformas, é possível ter vários objetos com nomes que diferem apenas na grafia. Por exemplo, tabelas chamadas `city`, `CITY` e `City` podem existir simultaneamente. Considere se uma pesquisa deve corresponder a todos esses nomes ou apenas a um deles e escreva consultas de acordo. A primeira das seguintes comparações (com `utf8_bin`) é sensível à maiúscula; as outras não são:

```sql
WHERE TABLE_NAME COLLATE utf8_bin = 'City'
WHERE TABLE_NAME COLLATE utf8_general_ci = 'city'
WHERE UPPER(TABLE_NAME) = 'CITY'
WHERE LOWER(TABLE_NAME) = 'city'
```

As pesquisas nas colunas de texto `INFORMATION_SCHEMA` para valores que se referem ao próprio `INFORMATION_SCHEMA` usam a collation `utf8_general_ci` porque `INFORMATION_SCHEMA` é um banco de dados “virtual” que não está representado no sistema de arquivos. Por exemplo, as comparações com `SCHEMATA.SCHEMA_NAME` correspondem a `'information_schema'` ou `'INFORMATION_SCHEMA'` independentemente da plataforma:

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
