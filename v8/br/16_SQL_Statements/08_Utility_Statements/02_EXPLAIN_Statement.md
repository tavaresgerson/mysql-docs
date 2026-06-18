### 15.8.2 Instrução EXPLAIN

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

As instruções `DESCRIBE` e `EXPLAIN` são sinônimas. Na prática, a palavra-chave `DESCRIBE` é mais frequentemente usada para obter informações sobre a estrutura da tabela, enquanto `EXPLAIN` é usada para obter um plano de execução de consulta (ou seja, uma explicação de como o MySQL executaria uma consulta).

A discussão a seguir utiliza as palavras-chave `DESCRIBE` e `EXPLAIN` de acordo com esses usos, mas o analisador MySQL as trata como completamente sinônimas.

- Obtendo Informações da Estrutura da Tabela
- Obter informações sobre o plano de execução
- Obter informações com EXPLAIN ANALYZE

#### Obtendo Informações da Estrutura da Tabela

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

Por padrão, `DESCRIBE` exibe informações sobre todas as colunas da tabela. `col_name`, se fornecido, é o nome de uma coluna na tabela. Neste caso, a declaração exibe informações apenas para a coluna nomeada. `wild`, se fornecido, é uma string de padrão. Ela pode conter os caracteres curinga `%` e `_` do SQL. Neste caso, a declaração exibe a saída apenas para as colunas com nomes que correspondem à string. Não é necessário encerrar a string entre aspas, a menos que ela contenha espaços ou outros caracteres especiais.

A declaração `DESCRIBE` é fornecida para compatibilidade com o Oracle.

As instruções `SHOW CREATE TABLE`, `SHOW TABLE STATUS` e `SHOW INDEX` também fornecem informações sobre tabelas. Veja a Seção 15.7.7, “Instruções SHOW”.

A variável de sistema `explain_format`, adicionada no MySQL 8.0.32, não tem efeito na saída de `EXPLAIN` quando usada para obter informações sobre as colunas da tabela.

#### Obter informações sobre o plano de execução

A declaração `EXPLAIN` fornece informações sobre como o MySQL executa as declarações:

- `EXPLAIN` funciona com as instruções `SELECT`, `DELETE`, `INSERT`, `REPLACE` e `UPDATE`. No MySQL 8.0.19 e versões posteriores, também funciona com as instruções `TABLE`.

- Quando `EXPLAIN` é usado com uma instrução explicável, o MySQL exibe informações do otimizador sobre o plano de execução da instrução. Ou seja, o MySQL explica como processaria a instrução, incluindo informações sobre como as tabelas são unidas e em que ordem. Para obter informações sobre o uso de `EXPLAIN` para obter informações sobre o plano de execução, consulte a Seção 10.8.2, “Formato de Saída EXPLAIN”.

- Quando `EXPLAIN` é usado com `FOR CONNECTION connection_id` em vez de uma declaração explicável, ele exibe o plano de execução da declaração que está sendo executada na conexão nomeada. Veja a Seção 10.8.4, “Obtendo Informações do Plano de Execução para uma Conexão Nomeada”.

- Para declarações explicáveis, `EXPLAIN` produz informações adicionais sobre o plano de execução que podem ser exibidas usando `SHOW WARNINGS`. Veja a Seção 10.8.3, “Formato de Saída EXPLAIN Extendido”.

- `EXPLAIN` é útil para examinar consultas que envolvem tabelas particionadas. Veja a Seção 26.3.5, “Obtendo Informações Sobre Partições”.

- A opção `FORMAT` pode ser usada para selecionar o formato de saída. `TRADITIONAL` apresenta a saída em formato tabular. Este é o formato padrão se nenhuma opção `FORMAT` estiver presente. O formato `JSON` exibe as informações em formato JSON. No MySQL 8.0.16 e versões posteriores, `TREE` fornece uma saída semelhante a uma árvore com descrições mais precisas do processamento de consultas do que o formato `TRADITIONAL`; é o único formato que mostra o uso de junção hash (veja a Seção 10.2.1.4, “Otimização de Junção Hash”) e é sempre usado para `EXPLAIN ANALYZE`.

  A partir do MySQL 8.0.32, o formato de saída padrão usado pelo `EXPLAIN` (ou seja, quando não há a opção `FORMAT`) é determinado pelo valor da variável de sistema `explain_format`. Os efeitos precisos dessa variável são descritos mais adiante nesta seção.

  Para declarações complexas, a saída JSON pode ser bastante grande; em particular, pode ser difícil lê-la para combinar os colchetes de fechamento e abertura; para fazer com que a chave da estrutura JSON, se houver, seja repetida perto do colchete de fechamento, defina `end_markers_in_json=ON`. Você deve estar ciente de que, embora isso torne a saída mais fácil de ler, também torna o JSON inválido, fazendo com que as funções JSON gerem um erro.

`EXPLAIN` exige os mesmos privilégios necessários para executar a declaração explicada. Além disso, `EXPLAIN` também exige o privilégio `SHOW VIEW` para qualquer visualização explicada. `EXPLAIN ... FOR CONNECTION` também exige o privilégio `PROCESS` se a conexão especificada pertencer a um usuário diferente.

A variável de sistema `explain_format` introduzida no MySQL 8.0.32 determina o formato da saída do `EXPLAIN` quando usado para exibir um plano de execução de consulta. Essa variável pode assumir qualquer um dos valores usados com a opção `FORMAT`, com a adição de `DEFAULT` como sinônimo de `TRADITIONAL`. O exemplo a seguir usa a tabela `country` do banco de dados `world`, que pode ser obtida do MySQL: Outros downloads:

```
mysql> USE world; # Make world the current database
Database changed
```

Ao verificar o valor de `explain_format`, vemos que ele tem o valor padrão, e que `EXPLAIN` (sem a opção `FORMAT`) usa, portanto, a saída tabular tradicional:

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

Se definirmos o valor de `explain_format` para `TREE`, então, ao executar novamente a mesma instrução `EXPLAIN`, a saída usa o formato em forma de árvore:

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

Como mencionado anteriormente, a opção `FORMAT` substitui essa configuração. Executando a mesma instrução `EXPLAIN` usando `FORMAT=JSON` em vez de `FORMAT=TREE`, podemos ver que isso é o caso:

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

Para retornar a saída padrão de `EXPLAIN` ao formato tabular, defina `explain_format` para `TRADITIONAL`. Alternativamente, você pode defini-lo para `DEFAULT`, que tem o mesmo efeito, como mostrado aqui:

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

Com a ajuda de `EXPLAIN`, você pode ver onde deve adicionar índices às tabelas para que a instrução seja executada mais rapidamente, usando índices para encontrar linhas. Você também pode usar `EXPLAIN` para verificar se o otimizador junta as tabelas em uma ordem ótima. Para dar uma dica ao otimizador para usar uma ordem de junção correspondente à ordem em que as tabelas são nomeadas em uma instrução `SELECT`, comece a instrução com `SELECT STRAIGHT_JOIN` em vez de apenas `SELECT`. (Veja a Seção 15.2.13, “Instrução SELECT”.)

O rastreamento do otimizador pode, às vezes, fornecer informações complementares às do `EXPLAIN`. No entanto, o formato e o conteúdo do rastreamento do otimizador estão sujeitos a alterações entre as versões. Para obter detalhes, consulte a Seção 10.15, “Rastreamento do Otimizador”.

Se você tiver um problema com os índices não sendo usados quando você acredita que eles deveriam ser, execute `ANALYZE TABLE` para atualizar as estatísticas da tabela, como a cardinalidade das chaves, que podem afetar as escolhas do otimizador. Veja a Seção 15.7.3.1, “Instrução ANALYZE TABLE”.

Nota

O MySQL Workbench possui uma funcionalidade de Visual Explain que fornece uma representação visual do resultado do `EXPLAIN`. Veja o Tutorial: Usando Explain para melhorar o desempenho da consulta.

#### Obter informações com EXPLAIN ANALYZE

O MySQL 8.0.18 introduz `EXPLAIN ANALYZE`, que executa uma instrução e produz `EXPLAIN` como saída, juntamente com informações de temporização e adicionais, baseadas em iteradores, sobre como as expectativas do otimizador corresponderam à execução real. Para cada iterador, as seguintes informações são fornecidas:

- Custo estimado de execução

  (Alguns iteradores não são contabilizados pelo modelo de custo e, portanto, não estão incluídos na estimativa.)

- Número estimado de linhas devolvidas

- É hora de voltar à primeira fila

- Tempo gasto executando este iterador (incluindo iteradores filhos, mas não iteradores pai), em milissegundos.

  (Quando há múltiplos loops, esta figura mostra o tempo médio por loop.)

- Número de linhas retornadas pelo iterador

- Número de loops

As informações sobre a execução da consulta são exibidas usando o formato de saída `TREE`, no qual os nós representam iteradores. `EXPLAIN ANALYZE` sempre usa o formato de saída `TREE`. No MySQL 8.0.21 e versões posteriores, isso pode ser especificado explicitamente opcionalmente usando `FORMAT=TREE`; formatos diferentes de `TREE` permanecem não suportados.

O `EXPLAIN ANALYZE` pode ser usado com as instruções `SELECT`, bem como com as instruções multitabela `UPDATE` e `DELETE`. A partir do MySQL 8.0.19, ele também pode ser usado com as instruções `TABLE`.

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

As tabelas usadas na saída de exemplo foram criadas pelas declarações mostradas aqui:

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

Os valores mostrados para `actual time` na saída desta declaração são expressos em milissegundos.

A partir do MySQL 8.0.32, a variável de sistema `explain_format` tem os seguintes efeitos sobre `EXPLAIN ANALYZE`:

- Se o valor desta variável for `TRADITIONAL` ou `TREE` (ou o sinônimo `DEFAULT`), o `EXPLAIN ANALYZE` utiliza o formato `TREE`. Isso garante que esta declaração continue a utilizar o formato `TREE` por padrão, como fazia antes da introdução do `explain_format`.

- Se o valor de `explain_format` for `JSON`, `EXPLAIN ANALYZE` retornará um erro, a menos que `FORMAT=TREE` seja especificado como parte da declaração. Isso ocorre porque o `EXPLAIN ANALYZE` suporta apenas o formato de saída `TREE`.

Aqui, ilustramos o comportamento descrito no segundo ponto, reutilizando a última declaração `EXPLAIN ANALYZE` do exemplo anterior:

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

- Números na faixa de 0,001 a 999.999,99 são impressos como números decimais.

  Os números decimais menores que 1000 têm três dígitos significativos; os demais têm quatro, cinco ou seis.

- Números fora da faixa de 0,001 a 999.999,99 são impressos no formato de engenharia. Exemplos desses valores são `1.23e+9` e `934e-6`.

- Não são impressas zeros finais. Por exemplo, imprimimos `2.3` em vez de `2.30` e `1.2e+6` em vez de `1.20e+6`.

- Números menores que `1e-12` são impressos como `0`.
