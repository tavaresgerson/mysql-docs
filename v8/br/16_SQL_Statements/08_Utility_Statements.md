## 15.8 Declarações de Utilidade

### 15.8.1 Declaração DESCRIBE

As declarações `DESCRIBE` e `EXPLAIN` são sinônimos, usadas para obter informações sobre a estrutura da tabela ou planos de execução de consultas. Para mais informações, consulte a Seção 15.7.7.5, “Declaração SHOW COLUMNS”, e a Seção 15.8.2, “Declaração EXPLAIN”.

### 15.8.2 Declaração `EXPLAIN`

```
{EXPLAIN | DESCRIBE | DESC}
    tbl_name [col_name | wild]

{EXPLAIN | DESCRIBE | DESC}
    [explain_type]
    {explainable_stmt | FOR CONNECTION connection_id}

{EXPLAIN | DESCRIBE | DESC} ANALYZE [explain_type] select_stmt

explain_type: {
    FORMAT = format_name
}

format_name: {
    TRADITIONAL
  | JSON
  | TREE
}

explainable_stmt: {
    select_stmt
  | TABLE ...
  | DELETE ...
  | INSERT ...
  | REPLACE ...
  | UPDATE ...
}

select_stmt:
    SELECT ...
```

As declarações `DESCRIBE` e `EXPLAIN` são sinônimos. Na prática, a palavra-chave `DESCRIBE` é mais frequentemente usada para obter informações sobre a estrutura da tabela, enquanto `EXPLAIN` é usada para obter um plano de execução de consulta (ou seja, uma explicação de como o MySQL executaria uma consulta).

A discussão a seguir utiliza as palavras-chave `DESCRIBE` e `EXPLAIN` de acordo com essas utilizações, mas o analisador MySQL as trata como completamente sinônimas.

* Obter informações sobre a estrutura da tabela * Obter informações sobre o plano de execução * Obter informações com EXPLAIN ANALYZE

#### Obtenção de informações sobre a estrutura da tabela

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

`DESCRIBE` é um atalho para `SHOW COLUMNS`. Essas declarações também exibem informações para visualizações. A descrição para `SHOW COLUMNS` fornece mais informações sobre as colunas de saída. Veja a Seção 15.7.7.5, “Declaração SHOW COLUMNS”.

Por padrão, `DESCRIBE` exibe informações sobre todas as colunas da tabela. *`col_name`*, se fornecido, é o nome de uma coluna na tabela. Neste caso, a declaração exibe informações apenas para a coluna nomeada. *`wild`*, se fornecido, é uma string de padrão. Ela pode conter os caracteres curinga `%` e `_` do SQL. Neste caso, a declaração exibe saída apenas para as colunas com nomes que correspondem à string. Não há necessidade de encerrar a string entre aspas, a menos que ela contenha espaços ou outros caracteres especiais.

A declaração `DESCRIBE` é fornecida para compatibilidade com o Oracle.

As declarações `SHOW CREATE TABLE`, `SHOW TABLE STATUS` e `SHOW INDEX` também fornecem informações sobre tabelas. Veja a Seção 15.7.7, “Declarações SHOW”.

A variável de sistema `explain_format`, adicionada no MySQL 8.0.32, não tem efeito sobre a saída de `EXPLAIN` quando usada para obter informações sobre as colunas da tabela.

#### Obtenção de informações sobre o plano de execução

A declaração `EXPLAIN` fornece informações sobre como o MySQL executa as declarações:

* As declarações `EXPLAIN` funcionam com as declarações `SELECT`, `DELETE`, `INSERT`, `REPLACE` e `UPDATE`. No MySQL 8.0.19 e versões posteriores, também funciona com as declarações `TABLE`.

* Quando `EXPLAIN` é usado com uma declaração explicável, o MySQL exibe informações do otimizador sobre o plano de execução da declaração. Isso significa que o MySQL explica como processaria a declaração, incluindo informações sobre como as tabelas são unidas e em que ordem. Para informações sobre o uso de `EXPLAIN` para obter informações sobre o plano de execução, consulte a Seção 10.8.2, “Formato de Saída EXPLAIN”.

* Quando `EXPLAIN` é usado com `FOR CONNECTION connection_id` em vez de uma declaração explicável, ele exibe o plano de execução da declaração que está sendo executada na conexão nomeada. Veja a Seção 10.8.4, “Obtenção de Informações do Plano de Execução para uma Conexão Nomeada”.

* Para declarações explicáveis, `EXPLAIN` produz informações adicionais sobre o plano de execução que podem ser exibidas usando `SHOW WARNINGS`. Veja a Seção 10.8.3, “Formato de Saída de EXPLAIN Extendido”.

* `EXPLAIN` é útil para examinar consultas que envolvem tabelas particionadas. Veja a Seção 26.3.5, “Obtenção de Informações sobre Partições”.

* A opção `FORMAT` pode ser usada para selecionar o formato de saída. `TRADITIONAL` apresenta a saída em formato tabular. Este é o padrão se não houver opção `FORMAT`. O formato `JSON` exibe as informações em formato JSON. No MySQL 8.0.16 e versões posteriores, `TREE` fornece uma saída semelhante a uma árvore com descrições mais precisas do tratamento de consultas do que o formato `TRADITIONAL`; é o único formato que mostra o uso de junção hash (ver Seção 10.2.1.4, “Otimização de Junção Hash”) e é sempre usado para `EXPLAIN ANALYZE`.

A partir do MySQL 8.0.32, o formato de saída padrão usado pelo `EXPLAIN` (ou seja, quando não tem a opção `FORMAT`) é determinado pelo valor da variável de sistema `explain_format`. Os efeitos precisos dessa variável são descritos mais adiante nesta seção.

Para declarações complexas, a saída JSON pode ser bastante grande; em particular, pode ser difícil, ao lê-la, alinhar o parêntese de fechamento e o parêntese de abertura; para fazer com que a chave da estrutura JSON, se houver, seja repetida perto do parêntese de fechamento, definida como `end_markers_in_json=ON`. Você deve estar ciente de que, embora isso torne a saída mais fácil de ler, também torna o JSON inválido, fazendo com que as funções JSON gerem um erro.

`EXPLAIN` exige os mesmos privilégios necessários para executar a declaração explicada. Além disso, `EXPLAIN` também exige o privilégio `SHOW VIEW` para qualquer visão explicada. [`EXPLAIN ... FOR CONNECTION`(explain.html "15.8.2 EXPLAIN Statement")]] também exige o privilégio `PROCESS` se a conexão especificada pertencer a um usuário diferente.

A variável de sistema `explain_format` introduzida no MySQL 8.0.32 determina o formato da saída do `EXPLAIN` quando usado para exibir um plano de execução de consulta. Essa variável pode assumir qualquer um dos valores usados com a opção `FORMAT`, com a adição de `DEFAULT` como sinônimo de `TRADITIONAL`. O exemplo a seguir usa a tabela `country` do banco de dados `world`, que pode ser obtida a partir de [MySQL: Outros downloads](/doc/index-other.html):

```
mysql> USE world; # Make world the current database
Database changed
```

Verificando o valor de `explain_format`, vemos que ele tem o valor padrão, e que `EXPLAIN` (sem a opção `FORMAT`) usa, portanto, a saída tabular tradicional:

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

Se definirmos o valor de `explain_format` para `TREE`, então execute novamente a mesma declaração `EXPLAIN`, a saída usa o formato semelhante a uma árvore:

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

Como mencionado anteriormente, a opção `FORMAT` substitui essa configuração. Executando a mesma declaração `EXPLAIN` usando `FORMAT=JSON` em vez de `FORMAT=TREE`, mostra-se que esse é o caso:

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

Para retornar a saída padrão de `EXPLAIN` ao formato tabular, defina `explain_format` como `TRADITIONAL`. Alternativamente, você pode defini-lo como `DEFAULT`, que tem o mesmo efeito, conforme mostrado aqui:

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

Com a ajuda do `EXPLAIN`, você pode ver onde deve adicionar índices às tabelas para que a declaração execute mais rápido, usando índices para encontrar linhas. Você também pode usar o `EXPLAIN` para verificar se o otimizador está combinando as tabelas em uma ordem ótima. Para dar uma dica ao otimizador para usar uma ordem de junção correspondente à ordem em que as tabelas são nomeadas em uma declaração `SELECT`, comece a declaração com `SELECT STRAIGHT_JOIN` em vez de apenas `SELECT`. (Veja a Seção 15.2.13, “Declaração SELECT”.)

O rastreamento do otimizador pode, às vezes, fornecer informações complementares às do `EXPLAIN`. No entanto, o formato e o conteúdo do rastreamento do otimizador estão sujeitos a alterações entre as versões. Para detalhes, consulte a Seção 10.15, “Rastreamento do Otimizador”.

Se você tiver um problema com os índices não sendo usados quando você acredita que eles deveriam ser, execute `ANALYZE TABLE`(analyze-table.html "15.7.3.1 ANALYZE TABLE Statement") para atualizar as estatísticas da tabela, como a cardinalidade das chaves, que podem afetar as escolhas que o otimizador faz. Veja a Seção 15.7.3.1, “Declaração ANALYZE TABLE”.

Nota

O MySQL Workbench possui uma capacidade de Explicação Visual que fornece uma representação visual do `EXPLAIN` de saída. Veja o Tutorial: Usando Explicação para melhorar o desempenho da consulta.

#### Obter informações com EXPLAIN ANALYZE

O MySQL 8.0.18 introduz `EXPLAIN ANALYZE`, que executa uma declaração e produz `EXPLAIN` de saída, juntamente com temporização e informações adicionais, baseadas em iteradores, sobre como as expectativas do otimizador corresponderam à execução real. Para cada iterador, as seguintes informações são fornecidas:

* Custo estimado de execução

(Alguns iteradores não são contabilizados pelo modelo de custo, e, portanto, não estão incluídos na estimativa.)

* Número estimado de linhas devolvidas * Tempo para retornar a primeira linha * Tempo gasto executando este iterador (incluindo iteradores filhos, mas não iteradores parentais), em milissegundos.

(Quando há vários loops, esta figura mostra o tempo médio por loop.)

* Número de linhas retornadas pelo iterador
* Número de loops

As informações sobre a execução da consulta são exibidas usando o formato de saída `TREE`, no qual os nós representam iteradores. `EXPLAIN ANALYZE` sempre usa o formato de saída `TREE`. Em MySQL 8.0.21 e versões posteriores, isso pode ser especificado explicitamente opcionalmente usando `FORMAT=TREE`; outros formatos além de `TREE` permanecem não suportados.

`EXPLAIN ANALYZE` pode ser usado com as declarações `SELECT`, bem como com declarações multi-tabela `UPDATE` e `DELETE`. A partir do MySQL 8.0.19, ele também pode ser usado com declarações `TABLE`.

A partir do MySQL 8.0.20, você pode encerrar essa declaração usando `KILL QUERY` ou **CTRL-C**.

`EXPLAIN ANALYZE` não pode ser usado com `FOR CONNECTION`.

Exemplo de saída:

```
mysql> EXPLAIN ANALYZE SELECT * FROM t1 JOIN t2 ON (t1.c1 = t2.c2)\G
*************************** 1. row ***************************
EXPLAIN: -> Inner hash join (t2.c2 = t1.c1)  (cost=4.70 rows=6)
(actual time=0.032..0.035 rows=6 loops=1)
    -> Table scan on t2  (cost=0.06 rows=6)
(actual time=0.003..0.005 rows=6 loops=1)
    -> Hash
        -> Table scan on t1  (cost=0.85 rows=6)
(actual time=0.018..0.022 rows=6 loops=1)

mysql> EXPLAIN ANALYZE SELECT * FROM t3 WHERE i > 8\G
*************************** 1. row ***************************
EXPLAIN: -> Filter: (t3.i > 8)  (cost=1.75 rows=5)
(actual time=0.019..0.021 rows=6 loops=1)
    -> Table scan on t3  (cost=1.75 rows=15)
(actual time=0.017..0.019 rows=15 loops=1)

mysql> EXPLAIN ANALYZE SELECT * FROM t3 WHERE pk > 17\G
*************************** 1. row ***************************
EXPLAIN: -> Filter: (t3.pk > 17)  (cost=1.26 rows=5)
(actual time=0.013..0.016 rows=5 loops=1)
    -> Index range scan on t3 using PRIMARY  (cost=1.26 rows=5)
(actual time=0.012..0.014 rows=5 loops=1)
```

As tabelas usadas no exemplo de saída foram criadas pelas declarações mostradas aqui:

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

Os valores exibidos para `actual time` na saída desta declaração são expressos em milissegundos.

A partir do MySQL 8.0.32, a variável de sistema `explain_format` tem os seguintes efeitos sobre `EXPLAIN ANALYZE`:

* Se o valor desta variável for `TRADITIONAL` ou `TREE` (ou o sinônimo `DEFAULT`), o `EXPLAIN ANALYZE` utiliza o formato `TREE`. Isso garante que esta declaração continue a utilizar o formato `TREE` por padrão, como fazia antes da introdução do `explain_format`.

* Se o valor de `explain_format` for `JSON`, `EXPLAIN ANALYZE` retorna um erro, a menos que `FORMAT=TREE` seja especificado como parte da declaração. Isso ocorre porque `EXPLAIN ANALYZE` suporta apenas o formato de saída `TREE`.

Ilustramos o comportamento descrito no segundo ponto aqui, reutilizando a última declaração `EXPLAIN ANALYZE` do exemplo anterior:

```
mysql> SET @@explain_format=JSON;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT @@explain_format;
+------------------+
| @@explain_format |
+------------------+
| JSON             |
+------------------+
1 row in set (0.00 sec)

mysql> EXPLAIN ANALYZE SELECT * FROM t3 WHERE pk > 17\G
ERROR 1235 (42000): This version of MySQL doesn't yet support 'EXPLAIN ANALYZE with JSON format'

mysql> EXPLAIN ANALYZE FORMAT=TRADITIONAL SELECT * FROM t3 WHERE pk > 17\G
ERROR 1235 (42000): This version of MySQL doesn't yet support 'EXPLAIN ANALYZE with TRADITIONAL format'

mysql> EXPLAIN ANALYZE FORMAT=TREE SELECT * FROM t3 WHERE pk > 17\G
*************************** 1. row ***************************
EXPLAIN: -> Filter: (t3.pk > 17)  (cost=1.26 rows=5)
(actual time=0.013..0.016 rows=5 loops=1)
    -> Index range scan on t3 using PRIMARY  (cost=1.26 rows=5)
(actual time=0.012..0.014 rows=5 loops=1)
```

Usar `FORMAT=TRADITIONAL` ou `FORMAT=JSON` com `EXPLAIN ANALYZE` sempre gera um erro, independentemente do valor de `explain_format`.

A partir do MySQL 8.0.33, os números na saída de `EXPLAIN ANALYZE` e `EXPLAIN FORMAT=TREE` são formatados de acordo com as seguintes regras:

* Os números na faixa de 0,001 a 999.999,5 são impressos como números decimais.

Os números decimais menores que 1000 têm três algarismos significativos; os demais têm quatro, cinco ou seis.

* Os números fora da faixa de 0,001-999999,5 são impressos no formato de engenharia. Exemplos desses valores são `1.23e+9` e `934e-6`.

* Não são impressas zeros finais. Por exemplo, imprimimos `2.3` em vez de `2.30`, e `1.2e+6` em vez de `1.20e+6`.

* Os números menores que `1e-12` são impressos como `0`.

### 15.8.3 Declaração de AJUDA

```
HELP 'search_string'
```

A declaração `HELP` retorna informações online do Manual de Referência do MySQL. Seu funcionamento adequado requer que as tabelas de ajuda no banco de dados `mysql` sejam inicializadas com informações sobre tópicos de ajuda (consulte Seção 7.1.17, “Suporte de Ajuda do Lado do Servidor”).

A declaração `HELP` procura as tabelas de ajuda pelo texto de pesquisa fornecido e exibe o resultado da pesquisa. O texto de pesquisa não é sensível ao caso.

A string de busca pode conter os caracteres de comodinho `%` e `_`. Estes têm o mesmo significado que para operações de correspondência de padrões realizadas com o operador `LIKE`. Por exemplo, `HELP 'rep%'` retorna uma lista de tópicos que começam com `rep`.

A declaração `HELP` não exige um terminador como `;` ou `\G`.

A declaração `HELP` entende vários tipos de strings de busca:

* No nível mais geral, use `contents` para obter uma lista das categorias de ajuda de nível superior:

  ```
  HELP 'contents'
  ```

* Para uma lista de tópicos em uma categoria de ajuda dada, como `Data Types`, use o nome da categoria:

  ```
  HELP 'data types'
  ```

* Para obter ajuda sobre um tópico específico, como a função `ASCII()` ou a declaração `CREATE TABLE`, use a(s) palavra(s)‑chave associada(s):

  ```
  HELP 'ascii'
  HELP 'create table'
  ```

Em outras palavras, a string de busca corresponde a uma categoria, muitos tópicos ou um único tópico. As descrições a seguir indicam as formas que o conjunto de resultados pode assumir.

* Resultado vazio

Não foi possível encontrar uma correspondência para a string de pesquisa.

Exemplo: `HELP 'fake'`

Rendimentos:

  ```
  Nothing found
  Please try to run 'help contents' for a list of all accessible topics
  ```

* Conjunto de resultados contendo uma única linha

Isso significa que a string de busca produziu um resultado para o tópico de ajuda. O resultado inclui os seguintes itens:

+ `name`: Nome do tópico.  
  + `description`: Texto de ajuda descritiva para o tópico.

+ `example`: Um ou mais exemplos de uso. (Pode estar vazio.)

Exemplo: `HELP 'log'`

Rendimentos:

  ```
  Name: 'LOG'
  Description:
  Syntax:
  LOG(X), LOG(B,X)

  If called with one parameter, this function returns the natural
  logarithm of X. If X is less than or equal to 0.0E0, the function
  returns NULL and a warning "Invalid argument for logarithm" is
  reported. Returns NULL if X or B is NULL.

  The inverse of this function (when called with a single argument) is
  the EXP() function.

  URL: https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html

  Examples:
  mysql> SELECT LOG(2);
          -> 0.69314718055995
  mysql> SELECT LOG(-2);
          -> NULL
  ```

* Lista de tópicos.

Isso significa que a string de busca correspondeu a vários tópicos de ajuda.

Exemplo: `HELP 'status'`

Rendimentos:

  ```
  Many help items for your request exist.
  To make a more specific request, please type 'help <item>',
  where <item> is one of the following topics:
     FLUSH
     SHOW
     SHOW ENGINE
     SHOW FUNCTION STATUS
     SHOW MASTER STATUS
     SHOW PROCEDURE STATUS
     SHOW REPLICA STATUS
     SHOW SLAVE STATUS
     SHOW STATUS
     SHOW TABLE STATUS
  ```

* Lista de tópicos.

Uma lista também é exibida se a string de busca corresponder a uma categoria.

Exemplo: `HELP 'functions'`

Rendimentos:

  ```
  You asked for help about help category: "Functions"
  For more information, type 'help <item>', where <item> is one of the following
  categories:
     Aggregate Functions and Modifiers
     Bit Functions
     Cast Functions and Operators
     Comparison Operators
     Date and Time Functions
     Encryption Functions
     Enterprise Encryption Functions
     Flow Control Functions
     GROUP BY Functions and Modifiers
     GTID
     Information Functions
     Internal Functions
     Locking Functions
     Logical Operators
     Miscellaneous Functions
     Numeric Functions
     Performance Schema Functions
     Spatial Functions
     String Functions
     Window Functions
     XML
  ```

### 15.8.4 Declaração de USO

```
USE db_name
```

A declaração `USE` informa ao MySQL que deve usar o banco de dados nomeado como o banco de dados padrão (atual) para declarações subsequentes. Esta declaração requer algum privilégio para o banco de dados ou algum objeto dentro dele.

O banco de dados nomeado permanece como padrão até o final da sessão ou até que outra declaração `USE` seja emitida:

```
USE db1;
SELECT COUNT(*) FROM mytable;   # selects from db1.mytable
USE db2;
SELECT COUNT(*) FROM mytable;   # selects from db2.mytable
```

O nome do banco de dados deve ser especificado em uma única linha. As novas linhas nos nomes dos bancos de dados não são suportadas.

Fazer uma base de dados específica padrão por meio da declaração `USE` não impede o acesso a tabelas em outras bases de dados. O exemplo a seguir acessa a tabela `author` da base de dados `db1` e a tabela `editor` da base de dados `db2`:

```
USE db1;
SELECT author_name,editor_name FROM author,db2.editor
  WHERE author.editor_id = db2.editor.editor_id;
```
