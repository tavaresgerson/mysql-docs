#### 13.1.18.7 CREATE TABLE e Colunas Geradas

O [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") suporta a especificação de colunas geradas. Os valores de uma coluna gerada são computados a partir de uma expressão incluída na definição da coluna.

Colunas geradas são suportadas pelo storage engine [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") a partir do MySQL NDB Cluster 7.5.3.

O seguinte exemplo simples mostra uma tabela que armazena os comprimentos dos lados de triângulos retângulos nas colunas `sidea` e `sideb`, e calcula o comprimento da hipotenusa em `sidec` (a raiz quadrada da soma dos quadrados dos outros lados):

```sql
CREATE TABLE triangle (
  sidea DOUBLE,
  sideb DOUBLE,
  sidec DOUBLE AS (SQRT(sidea * sidea + sideb * sideb))
);
INSERT INTO triangle (sidea, sideb) VALUES(1,1),(3,4),(6,8);
```

A seleção da tabela resulta nisto:

```sql
mysql> SELECT * FROM triangle;
+-------+-------+--------------------+
| sidea | sideb | sidec              |
+-------+-------+--------------------+
|     1 |     1 | 1.4142135623730951 |
|     3 |     4 |                  5 |
|     6 |     8 |                 10 |
+-------+-------+--------------------+
```

Qualquer aplicação que utilize a tabela `triangle` tem acesso aos valores da hipotenusa sem ter que especificar a expressão que os calcula.

Definições de colunas geradas têm esta sintaxe:

```sql
col_name data_type [GENERATED ALWAYS] AS (expr)
  [VIRTUAL | STORED] [NOT NULL | NULL]
  [UNIQUE [KEY PRIMARY] KEY]
  [COMMENT 'string']
```

`AS (expr)` indica que a coluna é gerada e define a expressão usada para computar os valores da coluna. `AS` pode ser precedido por `GENERATED ALWAYS` para tornar a natureza gerada da coluna mais explícita. Construções que são permitidas ou proibidas na expressão são discutidas posteriormente.

A palavra-chave `VIRTUAL` ou `STORED` indica como os valores da coluna são armazenados, o que tem implicações para o uso da coluna:

* `VIRTUAL`: Os valores da coluna não são armazenados, mas são avaliados quando as linhas são lidas, imediatamente após quaisquer triggers `BEFORE`. Uma coluna virtual não requer armazenamento.

  O `InnoDB` suporta Secondary Indexes em colunas virtual. Consulte [Section 13.1.18.8, “Secondary Indexes and Generated Columns”](create-table-secondary-indexes.html "13.1.18.8 Secondary Indexes and Generated Columns").

* `STORED`: Os valores da coluna são avaliados e armazenados quando as linhas são inseridas ou atualizadas. Uma coluna stored requer espaço de armazenamento e pode ser indexada.

O padrão é `VIRTUAL` se nenhuma das palavras-chave for especificada.

É permitido misturar colunas `VIRTUAL` e `STORED` dentro de uma tabela.

Outros atributos podem ser fornecidos para indicar se a coluna é indexada ou pode ser `NULL`, ou fornecer um comentário.

As expressões de colunas geradas devem aderir às seguintes regras. Um erro ocorre se uma expressão contiver construções não permitidas.

* Literais, funções built-in determinísticas e operadores são permitidos. Uma função é determinística se, dados os mesmos dados nas tabelas, múltiplas invocações produzem o mesmo resultado, independentemente do usuário conectado. Exemplos de funções que são não determinísticas e falham nesta definição: [`CONNECTION_ID()`](information-functions.html#function_connection-id), [`CURRENT_USER()`](information-functions.html#function_current-user), [`NOW()`](date-and-time-functions.html#function_now).

* Funções armazenadas (Stored functions) e funções carregáveis (loadable functions) não são permitidas.
* Parâmetros de stored procedure e function não são permitidos.
* Variáveis (variáveis de sistema, variáveis definidas pelo usuário e variáveis locais de programas armazenados) não são permitidas.

* Subqueries não são permitidas.
* Uma definição de coluna gerada pode referir-se a outras colunas geradas, mas apenas aquelas que ocorrem mais cedo na definição da tabela. Uma definição de coluna gerada pode referir-se a qualquer coluna base (não gerada) na tabela, quer sua definição ocorra mais cedo ou mais tarde.

* O atributo `AUTO_INCREMENT` não pode ser usado em uma definição de coluna gerada.

* Uma coluna `AUTO_INCREMENT` não pode ser usada como uma coluna base em uma definição de coluna gerada.

* A partir do MySQL 5.7.10, se a avaliação da expressão causar truncamento ou fornecer uma entrada incorreta para uma função, o comando [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") termina com um erro e a operação DDL é rejeitada.

Se a expressão for avaliada como um tipo de dados que difere do tipo de coluna declarado, ocorre uma coerção implícita para o tipo declarado, de acordo com as regras usuais de conversão de tipos do MySQL. Consulte [Section 12.3, “Type Conversion in Expression Evaluation”](type-conversion.html "12.3 Type Conversion in Expression Evaluation").

Note

Se algum componente da expressão depender do SQL mode, resultados diferentes podem ocorrer para diferentes usos da tabela, a menos que o SQL mode seja o mesmo durante todos os usos.

Para [`CREATE TABLE ... LIKE`](create-table-like.html "13.1.18.3 CREATE TABLE ... LIKE Statement"), a tabela de destino preserva informações de colunas geradas da tabela original.

Para [`CREATE TABLE ... SELECT`](create-table-select.html "13.1.18.4 CREATE TABLE ... SELECT Statement"), a tabela de destino não preserva informações sobre se as colunas na tabela selecionada são colunas geradas. A parte `SELECT` do comando não pode atribuir valores a colunas geradas na tabela de destino.

O particionamento por colunas geradas é permitido. Consulte [Table Partitioning](create-table.html#create-table-partitioning "Table Partitioning").

Uma restrição de chave estrangeira (foreign key constraint) em uma coluna gerada STORED não pode usar `CASCADE`, `SET NULL` ou `SET DEFAULT` como ações referenciais `ON UPDATE`, nem pode usar `SET NULL` ou `SET DEFAULT` como ações referenciais `ON DELETE`.

Uma restrição de chave estrangeira na coluna base de uma coluna gerada STORED não pode usar `CASCADE`, `SET NULL` ou `SET DEFAULT` como ações referenciais `ON UPDATE` ou `ON DELETE`.

Uma restrição de chave estrangeira não pode referenciar uma coluna gerada VIRTUAL.

Triggers não podem usar `NEW.col_name` ou `OLD.col_name` para referir-se a colunas geradas.

Para [`INSERT`](insert.html "13.2.5 INSERT Statement"), [`REPLACE`](replace.html "13.2.8 REPLACE Statement") e [`UPDATE`](update.html "13.2.11 UPDATE Statement"), se uma coluna gerada for explicitamente inserida, substituída ou atualizada, o único valor permitido é `DEFAULT`.

Uma coluna gerada em uma View é considerada atualizável porque é possível atribuir um valor a ela. No entanto, se tal coluna for atualizada explicitamente, o único valor permitido é `DEFAULT`.

Colunas geradas têm diversos casos de uso, como estes:

* Colunas geradas VIRTUAL podem ser usadas como uma forma de simplificar e unificar Queries. Uma condição complicada pode ser definida como uma coluna gerada e referida a partir de múltiplas Queries na tabela para garantir que todas elas usem exatamente a mesma condição.

* Colunas geradas STORED podem ser usadas como um cache materializado para condições complicadas que são custosas para calcular em tempo de execução.

* Colunas geradas podem simular Indexes funcionais: Use uma coluna gerada para definir uma expressão funcional e indexá-la. Isso pode ser útil para trabalhar com colunas de tipos que não podem ser indexados diretamente, como colunas [`JSON`](json.html "11.5 O Tipo de Dados JSON"); veja [Indexing a Generated Column to Provide a JSON Column Index](create-table-secondary-indexes.html#json-column-indirect-index "Indexing a Generated Column to Provide a JSON Column Index"), para um exemplo detalhado.

  Para colunas geradas STORED, a desvantagem desta abordagem é que os valores são armazenados duas vezes; uma vez como o valor da coluna gerada e uma vez no Index.

* Se uma coluna gerada é indexada, o otimizador reconhece expressões de Query que correspondem à definição da coluna e usa Indexes da coluna conforme apropriado durante a execução da Query, mesmo que uma Query não se refira à coluna diretamente pelo nome. Para detalhes, consulte [Section 8.3.10, “Optimizer Use of Generated Column Indexes”](generated-column-index-optimizations.html "8.3.10 Uso pelo Otimizador de Indexes de Colunas Geradas").

Exemplo:

Suponha que uma tabela `t1` contenha colunas `first_name` e `last_name` e que as aplicações frequentemente constroem o nome completo usando uma expressão como esta:

```sql
SELECT CONCAT(first_name,' ',last_name) AS full_name FROM t1;
```

Uma maneira de evitar escrever a expressão é criar uma View `v1` em `t1`, o que simplifica as aplicações, permitindo que selecionem `full_name` diretamente sem usar uma expressão:

```sql
CREATE VIEW v1 AS
SELECT *, CONCAT(first_name,' ',last_name) AS full_name FROM t1;

SELECT full_name FROM v1;
```

Uma coluna gerada também permite que as aplicações selecionem `full_name` diretamente sem a necessidade de definir uma View:

```sql
CREATE TABLE t1 (
  first_name VARCHAR(10),
  last_name VARCHAR(10),
  full_name VARCHAR(255) AS (CONCAT(first_name,' ',last_name))
);

SELECT full_name FROM t1;
```
