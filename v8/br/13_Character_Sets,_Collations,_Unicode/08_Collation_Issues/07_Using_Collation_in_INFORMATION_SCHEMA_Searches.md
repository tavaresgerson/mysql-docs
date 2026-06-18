### 12.8.7 Usar a Colaboração em Pesquisas no INFORMATION\_SCHEMA

As colunas de texto nas tabelas `INFORMATION_SCHEMA` têm uma collation de `utf8mb3_general_ci`, que é case-insensitive. No entanto, para valores que correspondem a objetos representados no sistema de arquivos, como bancos de dados e tabelas, as pesquisas em colunas de texto `INFORMATION_SCHEMA` podem ser case-sensitive ou case-insensitive, dependendo das características do sistema de arquivos subjacente e da configuração da variável de sistema `lower_case_table_names`. Por exemplo, as pesquisas podem ser case-sensitive se o sistema de arquivos for case-sensitive. Esta seção descreve esse comportamento e como modificá-lo, se necessário.

Suponha que uma consulta procure a coluna `SCHEMATA.SCHEMA_NAME` no banco de dados `test`. No Linux, os sistemas de arquivos são case-sensitive, então as comparações de `SCHEMATA.SCHEMA_NAME` com `'test'` correspondem, mas as comparações com `'TEST'` não:

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

Esses resultados ocorrem quando a variável de sistema `lower_case_table_names` é definida como 0. Uma configuração de `lower_case_table_names` de 1 ou 2 faz com que a segunda consulta retorne o mesmo resultado (não vazio) que a primeira consulta.

Nota

É proibido iniciar o servidor com uma configuração `lower_case_table_names` diferente daquela usada quando o servidor foi inicializado.

Em Windows ou macOS, os sistemas de arquivos não são case-sensitive, então as comparações correspondem tanto a `'test'` quanto a `'TEST'`:

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

Esse comportamento anterior ocorre porque a collation `utf8mb3_general_ci` não é usada para consultas `INFORMATION_SCHEMA` ao procurar por valores que correspondem a objetos representados no sistema de arquivos.

Se o resultado de uma operação de string em uma coluna `INFORMATION_SCHEMA` diferir das expectativas, uma solução é usar uma cláusula explícita `COLLATE` para forçar uma collation adequada (veja a Seção 12.8.1, “Usando COLLATE em Instruções SQL”). Por exemplo, para realizar uma pesquisa não sensível ao caso, use `COLLATE` com o nome da coluna `INFORMATION_SCHEMA`:

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

Embora uma comparação não sensível à maiúscula possa ser realizada mesmo em plataformas com sistemas de arquivos sensíveis à maiúscula, como foi demonstrado, nem sempre é a coisa certa a fazer. Nessas plataformas, é possível ter vários objetos com nomes que diferem apenas na grafia. Por exemplo, tabelas com os nomes `city`, `CITY` e `City` podem existir simultaneamente. Considere se uma pesquisa deve corresponder a todos esses nomes ou apenas a um deles e escreva as consultas de acordo. A primeira das seguintes comparações (com `utf8mb3_bin`) é sensível à maiúscula; as outras não são:

```
WHERE TABLE_NAME COLLATE utf8mb3_bin = 'City'
WHERE TABLE_NAME COLLATE utf8mb3_general_ci = 'city'
WHERE UPPER(TABLE_NAME) = 'CITY'
WHERE LOWER(TABLE_NAME) = 'city'
```

As pesquisas nas colunas de string `INFORMATION_SCHEMA` por valores que se referem ao próprio `INFORMATION_SCHEMA` utilizam a collation `utf8mb3_general_ci`, pois `INFORMATION_SCHEMA` é um banco de dados “virtual” que não está representado no sistema de arquivos. Por exemplo, as comparações com `SCHEMATA.SCHEMA_NAME` correspondem a `'information_schema'` ou `'INFORMATION_SCHEMA'`, independentemente da plataforma:

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
