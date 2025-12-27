### 15.8.2 Instrução `DESCRIBE`

```
{EXPLAIN | DESCRIBE | DESC}
    tbl_name [col_name | wild]

{EXPLAIN | DESCRIBE | DESC}
    [explain_type] [INTO variable]
    {[schema_spec] explainable_stmt | FOR CONNECTION connection_id}

{EXPLAIN | DESCRIBE | DESC} ANALYZE [FORMAT = TREE] [schema_spec] select_statement

{EXPLAIN | DESCRIBE | DESC} ANALYZE FORMAT = JSON INTO variable [schema_spec] select_statement

explain_type: {
    FORMAT = format_name
}

format_name: {
    TRADITIONAL
  | JSON
  | TREE
}

explainable_stmt: {
    SELECT statement
  | TABLE statement
  | DELETE statement
  | INSERT statement
  | REPLACE statement
  | UPDATE statement
}

schema_spec:
FOR {SCHEMA | DATABASE} schema_name
```

As instruções `DESCRIBE` e `EXPLAIN` são sinônimas. Na prática, a palavra-chave `DESCRIBE` é mais frequentemente usada para obter informações sobre a estrutura da tabela, enquanto `EXPLAIN` é usada para obter um plano de execução da consulta (ou seja, uma explicação de como o MySQL executaria uma consulta).

A discussão a seguir usa as palavras-chave `DESCRIBE` e `EXPLAIN` de acordo com esses usos, mas o analisador do MySQL as trata como completamente sinônimas.

* Obtendo Informações sobre a Estrutura da Tabela
* Obtendo Informações sobre o Plano de Execução
* Obtendo Informações com `EXPLAIN ANALYZE`

#### Obtendo Informações sobre a Estrutura da Tabela

`DESCRIBE` fornece informações sobre as colunas de uma tabela:

```
mysql> DESCRIBE City;
+------------+----------+------+-----+---------+----------------+
| Field      | Type     | Null | Key | Default | Extra          |
+------------+----------+------+-----+---------+----------------+
| Id         | int(11)  | NO   | PRI | NULL    | auto_increment |
| Name       | char(35) | NO   |     |         |                |
| Country    | char(3)  | NO   | UNI |         |                |
| District   | char(20) | YES  | MUL |         |                |
| Population | int(11)  | NO   |     | 0       |                |
+------------+----------+------+-----+---------+----------------+
```

`DESCRIBE` é um atalho para `SHOW COLUMNS`. Essas instruções também exibem informações para visualizações. A descrição para `SHOW COLUMNS` fornece mais informações sobre as colunas de saída. Veja a Seção 15.7.7.6, “Instrução `SHOW COLUMNS`”.

Por padrão, `DESCRIBE` exibe informações sobre todas as colunas da tabela. *`col_name`*, se fornecido, é o nome de uma coluna na tabela. Neste caso, a instrução exibe informações apenas para a coluna nomeada. *`wild`*, se fornecido, é uma string de padrão. Pode conter os caracteres curinga `%` e `_` do SQL. Neste caso, a instrução exibe a saída apenas para as colunas com nomes que correspondem à string. Não há necessidade de encerrar a string entre aspas, a menos que ela contenha espaços ou outros caracteres especiais.

A instrução `DESCRIBE` é fornecida para compatibilidade com o Oracle.

As instruções `SHOW CREATE TABLE`, `SHOW TABLE STATUS` e `SHOW INDEX` também fornecem informações sobre tabelas. Veja a Seção 15.7.7, “Instruções `SHOW`”.

A variável de sistema `explain_format` não tem efeito na saída do `EXPLAIN` quando usada para obter informações sobre as colunas da tabela.

#### Obtendo Informações do Plano de Execução

O comando `EXPLAIN` fornece informações sobre como o MySQL executa instruções:

* O `EXPLAIN` funciona com instruções `SELECT`, `DELETE`, `INSERT`, `REPLACE`, `UPDATE` e `TABLE`.

* Quando o `EXPLAIN` é usado com uma instrução explicável, o MySQL exibe informações do otimizador sobre o plano de execução da instrução. Ou seja, o MySQL explica como processaria a instrução, incluindo informações sobre como as tabelas são unidas e em que ordem. Para obter informações sobre como usar o `EXPLAIN` para obter informações sobre o plano de execução, consulte a Seção 10.8.2, “Formato de Saída do EXPLAIN”.

* Quando o `EXPLAIN` é usado com `FOR connection_id` em vez de uma instrução explicável, ele exibe o plano de execução da instrução que está sendo executada na conexão nomeada. Consulte a Seção 10.8.4, “Obtendo Informações do Plano de Execução para uma Conexão Nomeada”.

* Para instruções explicáveis, o `EXPLAIN` produz informações adicionais sobre o plano de execução que podem ser exibidas usando `SHOW WARNINGS`. Consulte a Seção 10.8.3, “Formato de Saída Extendido do EXPLAIN”.

* O `EXPLAIN` é útil para examinar consultas que envolvem tabelas particionadas. Consulte a Seção 26.3.5, “Obtendo Informações Sobre Partições”.

* A opção `FORMAT` pode ser usada para selecionar o formato de saída. `TRADITIONAL` apresenta a saída em formato tabular. Este é o formato padrão se nenhuma opção `FORMAT` estiver presente. O formato `JSON` exibe as informações no formato JSON. `TREE` fornece uma saída semelhante a uma árvore com descrições mais precisas do processamento de consultas do que o formato `TRADITIONAL`; é o único formato que mostra o uso de junção hash (veja a Seção 10.2.1.4, “Otimização da Junção Hash”) e é sempre usado para `EXPLAIN ANALYZE`.

  No MySQL 9.5, o formato de saída padrão usado pelo `EXPLAIN` (ou seja, quando não tem a opção `FORMAT`) é determinado pelo valor da variável de sistema `explain_format`. Os efeitos precisos desta variável são descritos mais adiante nesta seção.

  O MySQL 9.5 suporta uma opção adicional `INTO` com `EXPLAIN FORMAT=JSON`, que permite salvar a saída formatada em JSON em uma variável do usuário, assim:

  ```
  mysql> EXPLAIN FORMAT=JSON INTO @myselect
      ->     SELECT name FROM a WHERE id = 2;
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT @myselect\G
  *************************** 1. row ***************************
  @myex: {
    "query_block": {
      "select_id": 1,
      "cost_info": {
        "query_cost": "1.00"
      },
      "table": {
        "table_name": "a",
        "access_type": "const",
        "possible_keys": [
          "PRIMARY"
        ],
        "key": "PRIMARY",
        "used_key_parts": [
          "id"
        ],
        "key_length": "4",
        "ref": [
          "const"
        ],
        "rows_examined_per_scan": 1,
        "rows_produced_per_join": 1,
        "filtered": "100.00",
        "cost_info": {
          "read_cost": "0.00",
          "eval_cost": "0.10",
          "prefix_cost": "0.00",
          "data_read_per_join": "408"
        },
        "used_columns": [
          "id",
          "name"
        ]
      }
    }
  }
  1 row in set (0.00 sec)
  ```

  Isso funciona com qualquer declaração explicável (`SELECT`, `TABLE`, `INSERT`, `UPDATE`, `REPLACE` ou `DELETE`). Exemplos usando as declarações `UPDATE` e `DELETE` são mostrados aqui:

  ```
  mysql> EXPLAIN FORMAT=JSON INTO @myupdate
      ->   UPDATE a SET name2 = "garcia" WHERE id = 3;
  Query OK, 0 rows affected (0.00 sec)

  mysql> EXPLAIN FORMAT=JSON INTO @mydelete
      ->     DELETE FROM a WHERE name1 LIKE '%e%';
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT @myupdate, @mydelete\G
  *************************** 1. row ***************************
  @myupdate: {
    "query_block": {
      "select_id": 1,
      "table": {
        "update": true,
        "table_name": "a",
        "access_type": "range",
        "possible_keys": [
          "PRIMARY"
        ],
        "key": "PRIMARY",
        "used_key_parts": [
          "id"
        ],
        "key_length": "4",
        "ref": [
          "const"
        ],
        "rows_examined_per_scan": 1,
        "filtered": "100.00",
        "attached_condition": "(`db`.`a`.`id` = 3)"
      }
    }
  }
  @mydelete: {
    "query_block": {
      "select_id": 1,
      "table": {
        "delete": true,
        "table_name": "a",
        "access_type": "ALL",
        "rows_examined_per_scan": 2,
        "filtered": "100.00",
        "attached_condition": "(`db`.`a`.`name1` like '%e%')"
      }
    }
  }
  1 row in set (0.00 sec)
  ```

  Você pode trabalhar com este valor usando as funções JSON do MySQL como faria com qualquer outro valor JSON, como nesses exemplos usando `JSON_EXTRACT()`:

  ```
  mysql> SELECT JSON_EXTRACT(@myselect, "$.query_block.table.key");
  +----------------------------------------------------+
  | JSON_EXTRACT(@myselect, "$.query_block.table.key") |
  +----------------------------------------------------+
  | "PRIMARY"                                          |
  +----------------------------------------------------+
  1 row in set (0.01 sec)

  mysql> SELECT JSON_EXTRACT(@myupdate, "$.query_block.table.access_type") AS U_acc,
      ->        JSON_EXTRACT(@mydelete, "$.query_block.table.access_type") AS D_acc;
  +---------+-------+
  | U_acc   | D_acc |
  +---------+-------+
  | "range" | "ALL" |
  +---------+-------+
  1 row in set (0.00 sec)
  ```

  Para declarações complexas, a saída JSON pode ser bastante grande; em particular, pode ser difícil lê-la para emparelhar o parêntese de fechamento e o parêntese de abertura; para fazer com que a chave da estrutura JSON, se houver, seja repetida perto do parêntese de fechamento, configure `end_markers_in_json=ON`. Você deve estar ciente de que, embora isso torne a saída mais fácil de ler, também torna a estrutura JSON inválida, fazendo com que as funções JSON levantem um erro.

  Veja também a Seção 14.17, “Funções JSON”.

Tentar usar uma cláusula `INTO` sem incluir explicitamente `FORMAT=JSON` faz com que o `EXPLAIN` seja rejeitado com `ER_EXPLAIN_INTO_IMPLICIT_FORMAT_NOT_SUPPORTED`. Isso é verdadeiro independentemente do valor atual da variável de sistema `explain_format`.

A cláusula `INTO` não é suportada com `FOR CONNECTION`.

`INTO` também não é suportada com `EXPLAIN ANALYZE` quando `explain_json_format_version=1`.

Importante

Se, por qualquer motivo, a declaração a ser analisada for rejeitada, a variável do usuário não será atualizada.

* O MySQL 9.5 suporta uma cláusula `FOR SCHEMA`, que faz com que o `EXPLAIN` se comporte como se a declaração a ser analisada tivesse sido executada no banco de dados nomeado; `FOR DATABASE` é suportado como sinônimo. Um exemplo simples de uso é mostrado aqui:

  ```
  mysql> USE b;
  Database changed
  mysql> CREATE SCHEMA s1;
  Query OK, 1 row affected (0.01 sec)

  mysql> CREATE SCHEMA s2;
  Query OK, 1 row affected (0.01 sec)

  mysql> USE s1;
  Database changed
  mysql> CREATE TABLE t (c1 INT NOT NULL AUTO_INCREMENT PRIMARY KEY, c2 INT NOT NULL);
  Query OK, 0 rows affected (0.04 sec)

  mysql> USE s2;
  Database changed
  mysql> CREATE TABLE t (c1 INT NOT NULL AUTO_INCREMENT PRIMARY KEY, c2 INT NOT NULL, KEY i1 (c2));
  Query OK, 0 rows affected (0.04 sec)

  mysql> USE b;
  Database changed
  mysql> EXPLAIN FORMAT=TREE FOR SCHEMA s1 SELECT * FROM t WHERE c2 > 50\G
  *************************** 1. row ***************************
  EXPLAIN: -> Filter: (t.c2 > 50)  (cost=0.35 rows=1)
      -> Table scan on t  (cost=0.35 rows=1)

  1 row in set (0.00 sec)

  mysql> EXPLAIN FORMAT=TREE FOR SCHEMA s2 SELECT * FROM t WHERE c2 > 50\G
  *************************** 1. row ***************************
  EXPLAIN: -> Filter: (t.c2 > 50)  (cost=0.35 rows=1)
      -> Covering index scan on t using i1  (cost=0.35 rows=1)

  1 row in set (0.00 sec)
  ```

  Se o banco de dados não existir, a declaração é rejeitada com `ER_BAD_DB_ERROR`. Se o usuário não tiver os privilégios necessários para executar a declaração, ela é rejeitada com `ER_DBACCESS_DENIED_ERROR`.

`FOR SCHEMA` não é compatível com `FOR CONNECTION`.

O `EXPLAIN` requer os mesmos privilégios necessários para executar a declaração explicada. Além disso, o `EXPLAIN` também requer o privilégio `SHOW VIEW` para qualquer vista explicada. `EXPLAIN ... FOR CONNECTION` também requer o privilégio `PROCESS` se a conexão especificada pertencer a um usuário diferente.

A variável de sistema `explain_format` determina o formato da saída do `EXPLAIN` quando usado para exibir um plano de execução de consulta. Esta variável pode assumir qualquer um dos valores usados com a opção `FORMAT`, com a adição de `DEFAULT` como sinônimo de `TRADITIONAL`. O exemplo seguinte usa a tabela `country` do banco de dados `world` que pode ser obtida do MySQL: Outros Downloads:

```
mysql> USE world; # Make world the current database
Database changed
```

Ao verificar o valor de `explain_format`, vemos que ele tem o valor padrão e que o `EXPLAIN` (sem a opção `FORMAT`) usa, portanto, a saída tabular tradicional:

```
mysql> SELECT @@explain_format;
+------------------+
| @@explain_format |
+------------------+
| TRADITIONAL      |
+------------------+
1 row in set (0.00 sec)

mysql> EXPLAIN SELECT Name FROM country WHERE Code Like 'A%';
+----+-------------+---------+------------+-------+---------------+---------+---------+------+------+----------+-------------+
| id | select_type | table   | partitions | type  | possible_keys | key     | key_len | ref  | rows | filtered | Extra       |
+----+-------------+---------+------------+-------+---------------+---------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | country | NULL       | range | PRIMARY       | PRIMARY | 12      | NULL |   17 |   100.00 | Using where |
+----+-------------+---------+------------+-------+---------------+---------+---------+------+------+----------+-------------+
1 row in set, 1 warning (0.00 sec)
```

Se definirmos o valor de `explain_format` para `TREE`, então executarmos novamente a mesma declaração `EXPLAIN`, a saída usa o formato semelhante a uma árvore:

```
mysql> SET @@explain_format=TREE;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT @@explain_format;
+------------------+
| @@explain_format |
+------------------+
| TREE             |
+------------------+
1 row in set (0.00 sec)

mysql> EXPLAIN SELECT Name FROM country WHERE Code LIKE 'A%';
+--------------------------------------------------------------------------------------------------------------+
| EXPLAIN                                                                                                      |
+--------------------------------------------------------------------------------------------------------------+
| -> Filter: (country.`Code` like 'A%')  (cost=3.67 rows=17)
    -> Index range scan on country using PRIMARY over ('A' <= Code <= 'A????????')  (cost=3.67 rows=17)  |
+--------------------------------------------------------------------------------------------------------------+
1 row in set, 1 warning (0.00 sec)
```

Como mencionado anteriormente, a opção `FORMAT` sobrepõe esse ajuste. Executar a mesma declaração `EXPLAIN` usando `FORMAT=JSON` em vez de `FORMAT=TREE` mostra que esse é o caso:

```
mysql> EXPLAIN FORMAT=JSON SELECT Name FROM country WHERE Code LIKE 'A%';
+------------------------------------------------------------------------------+
| EXPLAIN                                                                      |
+------------------------------------------------------------------------------+
| {
  "query_block": {
    "select_id": 1,
    "cost_info": {
      "query_cost": "3.67"
    },
    "table": {
      "table_name": "country",
      "access_type": "range",
      "possible_keys": [
        "PRIMARY"
      ],
      "key": "PRIMARY",
      "used_key_parts": [
        "Code"
      ],
      "key_length": "12",
      "rows_examined_per_scan": 17,
      "rows_produced_per_join": 17,
      "filtered": "100.00",
      "cost_info": {
        "read_cost": "1.97",
        "eval_cost": "1.70",
        "prefix_cost": "3.67",
        "data_read_per_join": "16K"
      },
      "used_columns": [
        "Code",
        "Name"
      ],
      "attached_condition": "(`world`.`country`.`Code` like 'A%')"
    }
  }
}                                                                              |
+------------------------------------------------------------------------------+
1 row in set, 1 warning (0.00 sec)
```

Para retornar a saída padrão do `EXPLAIN` ao formato tabular, defina `explain_format` para `TRADITIONAL`. Alternativamente, você pode defini-lo para `DEFAULT`, que tem o mesmo efeito, como mostrado aqui:

```
mysql> SET @@explain_format=DEFAULT;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT @@explain_format;
+------------------+
| @@explain_format |
+------------------+
| TRADITIONAL      |
+------------------+
1 row in set (0.00 sec)
```

O MySQL 9.5 suporta duas versões do formato de saída JSON. A versão 1 é o formato linear usado no MySQL 9.4 e versões anteriores. A versão 2 do formato de saída JSON é baseada em caminhos de acesso e é a padrão a partir do MySQL 9.5. Você pode alternar o formato alterando o valor da variável de sistema `explain_json_format_version` do servidor, como mostrado aqui para a mesma declaração `EXPLAIN` usada no exemplo anterior:

```
mysql> SELECT @@explain_json_format_version;
+-------------------------------+
| @@explain_json_format_version |
+-------------------------------+
|                             1 |
+-------------------------------+
1 row in set (0.00 sec)

mysql> SET @@explain_json_format_version = 2;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT @@explain_json_format_version;
+-------------------------------+
| @@explain_json_format_version |
+-------------------------------+
|                             2 |
+-------------------------------+
1 row in set (0.00 sec)

mysql> EXPLAIN FORMAT=JSON SELECT Name FROM country WHERE Code LIKE 'A%'\G
EXPLAIN: {
  "query": "/* select#1 */ select `world`.`country`.`Name` AS `Name` from `world`.`country` where (`world`.`country`.`Code` like 'A%')",
  "query_plan": {
    "inputs": [
      {
        "ranges": [
          "('A' <= Code <= 'A????????')"
        ],
        "covering": false,
        "operation": "Index range scan on country using PRIMARY over ('A' <= Code <= 'A????????')",
        "index_name": "PRIMARY",
        "table_name": "country",
        "access_type": "index",
        "key_columns": [
          "Code"
        ],
        "schema_name": "world",
        "used_columns": [
          "Code",
          "Name"
        ],
        "estimated_rows": 17.0,
        "index_access_type": "index_range_scan",
        "estimated_total_cost": 3.668778400708174
      }
    ],
    "condition": "(country.`Code` like 'A%')",
    "operation": "Filter: (country.`Code` like 'A%')",
    "access_type": "filter",
    "estimated_rows": 17.0,
    "filter_columns": [
      "world.country.`Code`"
    ],
    "estimated_total_cost": 3.668778400708174
  },
  "query_type": "select",
  "json_schema_version": "2.0"
}
1 row in set, 1 warning (0.01 sec)
```

Definir `explain_json_format_version = 2` também habilita o suporte para uma cláusula `INTO` com `EXPLAIN ANALYZE FORMAT=JSON`, o que permite armazenar a saída JSON em uma variável do usuário, como mostrado aqui:

```
mysql> EXPLAIN ANALYZE FORMAT=JSON INTO @v1
    ->   SELECT Name FROM country WHERE Code LIKE 'A%'\G
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql> SELECT @v1\G
*************************** 1. row ***************************
@v1: {
  "query": "/* select#1 */ select `world`.`country`.`Name` AS `Name` from `world`.`country` where (`world`.`country`.`Code` like 'A%')",
  "query_plan": {
    "inputs": [
      {
        "ranges": [
          "('A' <= Code <= 'A????????')"
        ],
        "covering": false,
        "operation": "Index range scan on country using PRIMARY over ('A' <= Code <= 'A????????')",
        "index_name": "PRIMARY",
        "table_name": "country",
        "access_type": "index",
        "actual_rows": 17.0,
        "key_columns": [
          "Code"
        ],
        "schema_name": "world",
        "actual_loops": 1,
        "used_columns": [
          "Code",
          "Name"
        ],
        "estimated_rows": 17.0,
        "index_access_type": "index_range_scan",
        "actual_last_row_ms": 0.018502,
        "actual_first_row_ms": 0.015971,
        "estimated_total_cost": 3.668778400708174
      }
    ],
    "condition": "(country.`Code` like 'A%')",
    "operation": "Filter: (country.`Code` like 'A%')",
    "access_type": "filter",
    "actual_rows": 17.0,
    "actual_loops": 1,
    "estimated_rows": 17.0,
    "filter_columns": [
      "world.country.`Code`"
    ],
    "actual_last_row_ms": 0.020957,
    "actual_first_row_ms": 0.017315,
    "estimated_total_cost": 3.668778400708174
  },
  "query_type": "select",
  "json_schema_version": "2.0"
}
1 row in set (0.00 sec)
```

Você pode usar a variável como argumento em funções JSON para obter itens específicos de informações do valor, assim:

```
mysql> SELECT JSON_EXTRACT(@v1,'$.index_name') AS iname,
    ->        JSON_EXTRACT(@v1, '$.table_name') AS tname\G
*************************** 1. row ***************************
iname: "PRIMARY"
tname: "country"
1 row in set (0.00 sec)
```

Esta forma de `EXPLAIN ANALYZE` requer uma cláusula explícita `FORMAT=JSON` e é suportada apenas com instruções `SELECT`. Também é suportada uma opção opcional `FOR SCHEMA`, mas não é obrigatória. (`FOR DATABASE` também pode ser usado, em vez disso.) A cláusula `INTO` é suportada com `FORMAT=JSON` apenas quando `explain_json_format_version` é igual a 2; caso contrário, a instrução falha com EXPLAIN ANALYZE não suporta FORMAT=JSON com explain_json_format_version=1 (`ER_EXPLAIN_ANALYZE_JSON_FORMAT_VERSION_NOT_SUPPORTED`).

Após usar o formato da Versão 2, você pode fazer com que a saída JSON de todas as instruções subsequentes `EXPLAIN FORMAT=JSON` volte ao formato da Versão 1, definindo `explain_json_format_version` de volta para `1` (o padrão).

O valor de `explain_json_format_version` determina a versão do formato de saída JSON empregado por todas as instruções `EXPLAIN` que a utilizam, seja o formato JSON usado porque uma determinada instrução `EXPLAIN` inclui uma opção explícita `FORMAT=JSON`, ou porque o formato JSON é usado automaticamente devido à variável de sistema `explain_format` ser definida como `JSON`.

Com a ajuda do `EXPLAIN`, você pode ver onde deve adicionar índices às tabelas para que a instrução execute mais rápido usando índices para encontrar linhas. Você também pode usar o `EXPLAIN` para verificar se o otimizador junta as tabelas em uma ordem ótima. Para dar uma dica ao otimizador para usar uma ordem de junção correspondente à ordem em que as tabelas são nomeadas em uma instrução `SELECT`, comece a instrução com `SELECT STRAIGHT_JOIN` em vez de apenas `SELECT`. (Veja a Seção 15.2.13, “Instrução SELECT”.)

O rastreamento do otimizador pode, às vezes, fornecer informações complementares às do `EXPLAIN`. No entanto, o formato e o conteúdo do rastreamento do otimizador estão sujeitos a mudanças entre as versões. Para obter detalhes, consulte a Seção 10.15, “Rastrear o Otimizador”.

Se você tiver um problema com índices não sendo usados quando acredita que deveriam ser, execute `ANALYZE TABLE` para atualizar as estatísticas da tabela, como a cardinalidade das chaves, que podem afetar as escolhas do otimizador. Consulte a Seção 15.7.3.1, “Instrução ANALYZE TABLE”.

Observação

O MySQL Workbench tem uma capacidade de Explicação Visual que fornece uma representação visual do `EXPLAIN` output. Consulte o Tutorial: Usando Explain para Melhorar o Desempenho das Consultas.

#### Obtendo Informações com EXPLAIN ANALYZE

`EXPLAIN ANALYZE` executa uma instrução e produz o `EXPLAIN` output junto com o tempo e informações adicionais, baseadas em iteradores, sobre como as expectativas do otimizador corresponderam à execução real. Para cada iterador, as seguintes informações são fornecidas:

* Custo estimado de execução

  (Alguns iteradores não são contabilizados pelo modelo de custo, e, portanto, não estão incluídos na estimativa.)

* Número estimado de linhas retornadas
* Tempo para retornar a primeira linha
* Tempo gasto executando este iterador (incluindo iteradores filhos, mas não iteradores pai), em milissegundos.

  (Quando há múltiplos loops, esse número mostra o tempo médio por loop.)

* Número de linhas retornadas pelo iterador
* Número de loops

As informações de execução da consulta são exibidas usando o formato de saída `TREE`, no qual os nós representam iteradores. `EXPLAIN ANALYZE` usa um formato de saída que pode ser especificado explicitamente usando `FORMAT=TREE` ou `FORMAT=JSON`; o padrão é `TREE`. `FORMAT=JSON` pode ser usado apenas se `explain_json_format_version` estiver definido como 2.

`EXPLAIN ANALYZE` pode ser usado com instruções `SELECT`, `UPDATE` e `DELETE` de várias tabelas, e instruções `TABLE`.

Você pode encerrar essa instrução usando `KILL QUERY` ou **CTRL-C**.

`EXPLAIN ANALYZE` não pode ser usado com `FOR CONNECTION`.

Exemplo de saída:

```
mysql> SELECT @@explain_format;
+------------------+
| @@explain_format |
+------------------+
| TRADITIONAL      |
+------------------+

mysql> EXPLAIN ANALYZE SELECT * FROM t1 JOIN t2 ON (t1.c1 = t2.c2)\G
*************************** 1. row ***************************
EXPLAIN: -> Inner hash join (t2.c2 = t1.c1)  (cost=3.5 rows=5)
(actual time=0.121..0.131 rows=1 loops=1)
    -> Table scan on t2  (cost=0.07 rows=5)
(actual time=0.0126..0.0221 rows=5 loops=1)
    -> Hash
        -> Table scan on t1  (cost=0.75 rows=5)
(actual time=0.0372..0.0534 rows=5 loops=1)

mysql> EXPLAIN ANALYZE FORMAT=TREE SELECT * FROM t3 WHERE i > 8\G
*************************** 1. row ***************************
EXPLAIN: -> Filter: (t3.i > 8)  (cost=0.75 rows=1.67)
(actual time=0.0484..0.0542 rows=1 loops=1)
    -> Table scan on t3  (cost=0.75 rows=5)
(actual time=0.0417..0.0494 rows=5 loops=1)

mysql> EXPLAIN ANALYZE FORMAT=JSON SELECT * FROM t3 WHERE pk < 17\G
*************************** 1. row ***************************
EXPLAIN: {
  "query": "/* select#1 */ select `a`.`t3`.`pk` AS `pk`,`a`.`t3`.`i` AS `i` from `a`.`t3` where (`a`.`t3`.`pk` < 17)",
  "inputs": [
    {
      "ranges": [
        "(pk < 17)"
      ],
      "covering": false,
      "operation": "Index range scan on t3 using PRIMARY over (pk < 17)",
      "index_name": "PRIMARY",
      "table_name": "t3",
      "access_type": "index",
      "actual_rows": 3.0,
      "key_columns": [
        "pk"
      ],
      "schema_name": "a",
      "actual_loops": 1,
      "used_columns": [
        "pk",
        "i"
      ],
      "estimated_rows": 3.0,
      "index_access_type": "index_range_scan",
      "actual_last_row_ms": 0.034214,
      "actual_first_row_ms": 0.03052,
      "estimated_total_cost": 0.860618301731245
    }
  ],
  "condition": "(t3.pk < 17)",
  "operation": "Filter: (t3.pk < 17)",
  "query_type": "select",
  "access_type": "filter",
  "actual_rows": 3.0,
  "actual_loops": 1,
  "estimated_rows": 3.0,
  "filter_columns": [
    "a.t3.pk"
  ],
  "actual_last_row_ms": 0.038189,
  "actual_first_row_ms": 0.033429,
  "estimated_total_cost": 0.860618301731245
}
```

As tabelas usadas na saída do exemplo foram criadas pelas instruções mostradas aqui:

```
CREATE TABLE t1 (
    c1 INTEGER DEFAULT NULL,
    c2 INTEGER DEFAULT NULL
);

CREATE TABLE t2 (
    c1 INTEGER DEFAULT NULL,
    c2 INTEGER DEFAULT NULL
);

CREATE TABLE t3 (
    pk INTEGER NOT NULL PRIMARY KEY,
    i INTEGER DEFAULT NULL
);
```

Os valores mostrados para `tempo real` na saída desta instrução são expressos em milissegundos.

`explain_format` tem os seguintes efeitos em `EXPLAIN ANALYZE`:

* Se o valor dessa variável for `TRADITIONAL` ou `TREE` (ou o sinônimo `DEFAULT`), `EXPLAIN ANALYZE` usa o formato `TREE` a menos que a instrução inclua `FORMAT=JSON`.

* Se o valor de `explain_format` for `JSON`, `EXPLAIN ANALYZE` usa o formato JSON a menos que `FORMAT=TREE` seja especificado como parte da instrução.

Usar `FORMAT=TRADITIONAL` ou `FORMAT=DEFAULT` com `EXPLAIN ANALYZE` sempre gera um erro, independentemente do valor de `explain_format`.

No MySQL 9.5, os números na saída de `EXPLAIN ANALYZE` e `EXPLAIN FORMAT=TREE` são formatados de acordo com as seguintes regras:

* Números na faixa de 0,001 a 999999,5 são impressos como números decimais.

  Números decimais menores que 1000 têm três dígitos significativos; os demais têm quatro, cinco ou seis.

* Números fora da faixa de 0,001 a 999999,5 são impressos no formato de engenharia. Exemplos desses valores são `1.23e+9` e `934e-6`.

* Não são impressas zeros finais. Por exemplo, imprimimos `2.3` em vez de `2.30`, e `1.2e+6` em vez de `1.20e+6`.

* Números menores que `1e-12` são impressos como `0`.