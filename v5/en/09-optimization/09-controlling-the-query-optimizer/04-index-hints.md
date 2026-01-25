### 8.9.4 Dicas de Index (Index Hints)

Dicas de Index (Index hints) fornecem ao Optimizer informações sobre como escolher Indexes durante o processamento de uma Query. As Index hints, descritas aqui, diferem das Optimizer hints, descritas na Seção 8.9.3, “Optimizer Hints”. Index e Optimizer hints podem ser usadas separadamente ou em conjunto.

As Index hints se aplicam a comandos `SELECT` e `UPDATE`. Elas também funcionam com comandos `DELETE` de múltiplas tabelas, mas não com `DELETE` de tabela única, conforme será demonstrado mais adiante nesta seção.

As Index hints são especificadas após o nome de uma tabela. (Para a sintaxe geral de especificação de tabelas em um comando `SELECT`, consulte a Seção 13.2.9.2, “JOIN Clause”.) A sintaxe para fazer referência a uma tabela individual, incluindo as Index hints, é a seguinte:

```sql
tbl_name AS] alias] [index_hint_list]

index_hint_list:
    index_hint [index_hint] ...

index_hint:
    USE {INDEX|KEY}
      [FOR {JOIN|ORDER BY|GROUP BY}] ([index_list])
  | {IGNORE|FORCE} {INDEX|KEY}
      [FOR {JOIN|ORDER BY|GROUP BY}] (index_list)

index_list:
    index_name [, index_name] ...
```

A dica `USE INDEX (index_list)` instrui o MySQL a usar apenas um dos Indexes nomeados para encontrar linhas na tabela. A sintaxe alternativa `IGNORE INDEX (index_list)` instrui o MySQL a não usar um ou mais Indexes específicos. Essas dicas são úteis se o `EXPLAIN` mostrar que o MySQL está usando o Index errado na lista de Indexes possíveis.

A dica `FORCE INDEX` atua como `USE INDEX (index_list)`, com o acréscimo de que um *table scan* é presumido ser *muito* caro. Em outras palavras, um *table scan* é usado apenas se não houver como utilizar um dos Indexes nomeados para encontrar linhas na tabela.

Cada dica requer nomes de Index, não nomes de coluna. Para se referir a uma Primary Key, use o nome `PRIMARY`. Para ver os nomes dos Indexes de uma tabela, utilize o comando `SHOW INDEX` ou a tabela `STATISTICS` do Information Schema.

Um valor *`index_name`* não precisa ser o nome completo do Index. Ele pode ser um prefixo inequívoco do nome de um Index. Se um prefixo for ambíguo, ocorrerá um erro.

Exemplos:

```sql
SELECT * FROM table1 USE INDEX (col1_index,col2_index)
  WHERE col1=1 AND col2=2 AND col3=3;

SELECT * FROM table1 IGNORE INDEX (col3_index)
  WHERE col1=1 AND col2=2 AND col3=3;
```

A sintaxe para Index hints possui as seguintes características:

* É sintaticamente válido omitir *`index_list`* para `USE INDEX`, o que significa “não usar Indexes”. Omitir *`index_list`* para `FORCE INDEX` ou `IGNORE INDEX` é um erro de sintaxe.

* Você pode especificar o escopo de uma Index hint adicionando uma cláusula `FOR` à dica. Isso fornece um controle mais detalhado sobre a seleção de um plano de execução pelo Optimizer para várias fases do processamento da Query. Para afetar apenas os Indexes usados quando o MySQL decide como encontrar linhas na tabela e como processar JOINs, use `FOR JOIN`. Para influenciar o uso de Index para ordenação ou agrupamento de linhas, use `FOR ORDER BY` ou `FOR GROUP BY`.

* Você pode especificar múltiplas Index hints:

  ```sql
  SELECT * FROM t1 USE INDEX (i1) IGNORE INDEX FOR ORDER BY (i2) ORDER BY a;
  ```

  Não é um erro nomear o mesmo Index em diversas dicas (mesmo dentro da mesma dica):

  ```sql
  SELECT * FROM t1 USE INDEX (i1) USE INDEX (i1,i1);
  ```

  No entanto, é um erro misturar `USE INDEX` e `FORCE INDEX` para a mesma tabela:

  ```sql
  SELECT * FROM t1 USE INDEX FOR JOIN (i1) FORCE INDEX FOR JOIN (i2);
  ```

Se uma Index hint não incluir uma cláusula `FOR`, o escopo da dica se aplicará a todas as partes do comando. Por exemplo, esta dica:

```sql
IGNORE INDEX (i1)
```

é equivalente a esta combinação de dicas:

```sql
IGNORE INDEX FOR JOIN (i1)
IGNORE INDEX FOR ORDER BY (i1)
IGNORE INDEX FOR GROUP BY (i1)
```

No MySQL 5.0, o escopo da dica sem a cláusula `FOR` se aplicava apenas à recuperação de linhas. Para fazer com que o servidor use esse comportamento antigo quando não houver uma cláusula `FOR` presente, habilite a variável de sistema `old` na inicialização do servidor. Tome cuidado ao habilitar essa variável em uma configuração de replicação. Com o *statement-based binary logging*, ter modos diferentes para a source e as replicas pode levar a erros de replicação.

Quando as Index hints são processadas, elas são coletadas em uma única lista por tipo (`USE`, `FORCE`, `IGNORE`) e por escopo (`FOR JOIN`, `FOR ORDER BY`, `FOR GROUP BY`). Por exemplo:

```sql
SELECT * FROM t1
  USE INDEX () IGNORE INDEX (i2) USE INDEX (i1) USE INDEX (i2);
```

é equivalente a:

```sql
SELECT * FROM t1
   USE INDEX (i1,i2) IGNORE INDEX (i2);
```

As Index hints são então aplicadas para cada escopo na seguinte ordem:

1. `{USE|FORCE} INDEX` é aplicado, se presente. (Se não estiver, o conjunto de Indexes determinado pelo Optimizer é usado.)

2. `IGNORE INDEX` é aplicado sobre o resultado da etapa anterior. Por exemplo, as duas Queries a seguir são equivalentes:

   ```sql
   SELECT * FROM t1 USE INDEX (i1) IGNORE INDEX (i2) USE INDEX (i2);

   SELECT * FROM t1 USE INDEX (i1);
   ```

Para pesquisas `FULLTEXT`, as Index hints funcionam da seguinte forma:

* Para pesquisas em modo de linguagem natural (*natural language mode*), as Index hints são ignoradas silenciosamente. Por exemplo, `IGNORE INDEX(i1)` é ignorada sem aviso e o Index continua a ser usado.

* Para pesquisas em modo booleano (*boolean mode*), as Index hints com `FOR ORDER BY` ou `FOR GROUP BY` são ignoradas silenciosamente. As Index hints com `FOR JOIN` ou sem modificador `FOR` são respeitadas. Em contraste com a forma como as dicas se aplicam a pesquisas que não são `FULLTEXT`, a dica é usada para todas as fases da execução da Query (encontrar e recuperar linhas, agrupamento e ordenação). Isso é verdade mesmo que a dica seja fornecida para um Index que não seja `FULLTEXT`.

  Por exemplo, as duas Queries a seguir são equivalentes:

  ```sql
  SELECT * FROM t
    USE INDEX (index1)
    IGNORE INDEX FOR ORDER BY (index1)
    IGNORE INDEX FOR GROUP BY (index1)
    WHERE ... IN BOOLEAN MODE ... ;

  SELECT * FROM t
    USE INDEX (index1)
    WHERE ... IN BOOLEAN MODE ... ;
  ```

As Index hints funcionam com comandos `DELETE`, mas apenas se você usar a sintaxe `DELETE` de múltiplas tabelas, conforme mostrado aqui:

```sql
mysql> EXPLAIN DELETE FROM t1 USE INDEX(col2)
    -> WHERE col1 BETWEEN 1 AND 100 AND COL2 BETWEEN 1 AND 100\G
ERROR 1064 (42000): You have an error in your SQL syntax; check the manual that
corresponds to your MySQL server version for the right syntax to use near 'use
index(col2) where col1 between 1 and 100 and col2 between 1 and 100' at line 1

mysql> EXPLAIN DELETE t1.* FROM t1 USE INDEX(col2)
    -> WHERE col1 BETWEEN 1 AND 100 AND COL2 BETWEEN 1 AND 100\G
*************************** 1. row ***************************
           id: 1
  select_type: DELETE
        table: t1
   partitions: NULL
         type: range
possible_keys: col2
          key: col2
      key_len: 5
          ref: NULL
         rows: 72
     filtered: 11.11
        Extra: Using where
1 row in set, 1 warning (0.00 sec)
```