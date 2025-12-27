### 10.9.4 Dicas de índice

As dicas de índice fornecem ao otimizador informações sobre como escolher índices durante o processamento de consultas. As dicas de índice, descritas aqui, diferem das dicas de otimizador, descritas na Seção 10.9.3, “Dicas de otimizador”. As dicas de índice e otimizador podem ser usadas separadamente ou juntas.

As dicas de índice se aplicam às instruções `SELECT` e `UPDATE`. Elas também funcionam com instruções `DELETE` de várias tabelas, mas não com `DELETE` de uma única tabela, como mostrado mais adiante nesta seção.

As dicas de índice são especificadas após o nome de uma tabela. (Para a sintaxe geral de especificação de tabelas em uma instrução `SELECT`, consulte a Seção 15.2.13.2, “Cláusula JOIN”.) A sintaxe para referenciar uma tabela individual, incluindo dicas de índice, é a seguinte:

```
tbl_name [[AS] alias] [index_hint_list]

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

A dica `USE INDEX (index_list)` informa ao MySQL que deve usar apenas um dos índices nomeados para encontrar linhas na tabela. A sintaxe alternativa `IGNORE INDEX (index_list)` informa ao MySQL que não deve usar algum índice ou índices específicos. Essas dicas são úteis se o `EXPLAIN` mostrar que o MySQL está usando o índice errado da lista de índices possíveis.

A dica `FORCE INDEX` age como `USE INDEX (index_list)`, com a adição de que uma varredura da tabela é assumida como *muito* cara. Em outras palavras, uma varredura da tabela é usada apenas se não houver maneira de usar um dos índices nomeados para encontrar linhas na tabela.

::: info Nota

O MySQL 8.4 suporta as dicas de otimizador de nível de índice `JOIN_INDEX`, `GROUP_INDEX`, `ORDER_INDEX` e `INDEX`, que são equivalentes e destinadas a substituir as dicas de índice `FORCE INDEX`, bem como as dicas de otimizador `NO_JOIN_INDEX`, `NO_GROUP_INDEX`, `NO_ORDER_INDEX` e `NO_INDEX`, que são equivalentes e destinadas a substituir as dicas de índice `IGNORE INDEX`. Portanto, você deve esperar que `USE INDEX`, `FORCE INDEX` e `IGNORE INDEX` sejam desatualizados em uma futura versão do MySQL e, em algum momento, posteriormente, serem removidos completamente.

Essas dicas de otimizador de nível de índice são suportadas tanto com instruções `DELETE` de uma única tabela quanto com instruções `DELETE` de várias tabelas.

Para obter mais informações, consulte Dicas de otimização de nível de índice.

:::

Cada dica requer nomes de índice, não de colunas. Para se referir a uma chave primária, use o nome `PRIMARY`. Para ver os nomes dos índices de uma tabela, use a instrução `SHOW INDEX` ou a tabela `STATISTICS` do Schema de Informações.

Um valor de *`index_name`* não precisa ser o nome completo de um índice. Pode ser um prefixo inequívoco de um nome de índice. Se um prefixo for ambíguo, ocorrerá um erro.

Exemplos:

```
SELECT * FROM table1 USE INDEX (col1_index,col2_index)
  WHERE col1=1 AND col2=2 AND col3=3;

SELECT * FROM table1 IGNORE INDEX (col3_index)
  WHERE col1=1 AND col2=2 AND col3=3;
```

A sintaxe das dicas de índice tem as seguintes características:

* É sintaticamente válido omitir *`index_list`* para `USE INDEX`, o que significa "não usar índices". Omitindo *`index_list`* para `FORCE INDEX` ou `IGNORE INDEX` é um erro de sintaxe.
* Você pode especificar o escopo de uma dica de índice adicionando uma cláusula `FOR` à dica. Isso fornece um controle mais fino sobre a seleção do plano de execução pelo otimizador para várias fases do processamento de consultas. Para afetar apenas os índices usados quando o MySQL decide como encontrar linhas na tabela e como processar junções, use `FOR JOIN`. Para influenciar o uso de índices para ordenação ou agrupamento de linhas, use `FOR ORDER BY` ou `FOR GROUP BY`.
* Você pode especificar múltiplas dicas de índice:

  ```
  SELECT * FROM t1 USE INDEX (i1) IGNORE INDEX FOR ORDER BY (i2) ORDER BY a;
  ```

  Não é um erro nomear o mesmo índice em várias dicas (mesmo dentro da mesma dica):

  ```
  SELECT * FROM t1 USE INDEX (i1) USE INDEX (i1,i1);
  ```

  No entanto, é um erro misturar `USE INDEX` e `FORCE INDEX` para a mesma tabela:

  ```
  SELECT * FROM t1 USE INDEX FOR JOIN (i1) FORCE INDEX FOR JOIN (i2);
  ```

Se uma dica de índice não incluir nenhuma cláusula `FOR`, o escopo da dica é aplicar a todas as partes da instrução. Por exemplo, esta dica:

```
IGNORE INDEX (i1)
```

é equivalente a esta combinação de dicas:

```
IGNORE INDEX FOR JOIN (i1)
IGNORE INDEX FOR ORDER BY (i1)
IGNORE INDEX FOR GROUP BY (i1)
```

Quando as dicas de índice são processadas, elas são coletadas em uma única lista por tipo (`USE`, `FORCE`, `IGNORE`) e por escopo (`FOR JOIN`, `FOR ORDER BY`, `FOR GROUP BY`). Por exemplo:

```
SELECT * FROM t1
  USE INDEX () IGNORE INDEX (i2) USE INDEX (i1) USE INDEX (i2);
```

é equivalente a:

```
SELECT * FROM t1
   USE INDEX (i1,i2) IGNORE INDEX (i2);
```

As dicas de índice são então aplicadas para cada escopo na seguinte ordem:

O comando `{USE|FORCE} INDEX` é aplicado se estiver presente. (Se não estiver, o conjunto de índices determinado pelo otimizador é usado.)
2. O comando `IGNORE INDEX` é aplicado sobre o resultado da etapa anterior. Por exemplo, as seguintes duas consultas são equivalentes:

```
   SELECT * FROM t1 USE INDEX (i1) IGNORE INDEX (i2) USE INDEX (i2);

   SELECT * FROM t1 USE INDEX (i1);
   ```

Para pesquisas `FULLTEXT`, as dicas de índice funcionam da seguinte forma:

* Para pesquisas no modo de linguagem natural, as dicas de índice são ignoradas silenciosamente. Por exemplo, `IGNORE INDEX(i1)` é ignorado sem aviso e o índice ainda é usado.
* Para pesquisas no modo booleano, as dicas de índice com `FOR ORDER BY` ou `FOR GROUP BY` são ignoradas silenciosamente. As dicas de índice com `FOR JOIN` ou sem o modificador `FOR` são respeitadas. Em contraste com a forma como as dicas se aplicam para pesquisas não `FULLTEXT`, a dica é usada para todas as fases da execução da consulta (encontrar linhas e recuperar, agrupar e ordenar). Isso é verdadeiro mesmo se a dica for dada para um índice não `FULLTEXT`.

Por exemplo, as seguintes duas consultas são equivalentes:

```
  SELECT * FROM t
    USE INDEX (index1)
    IGNORE INDEX FOR ORDER BY (index1)
    IGNORE INDEX FOR GROUP BY (index1)
    WHERE ... IN BOOLEAN MODE ... ;

  SELECT * FROM t
    USE INDEX (index1)
    WHERE ... IN BOOLEAN MODE ... ;
  ```

As dicas de índice funcionam com as instruções `DELETE`, mas apenas se você usar a sintaxe de `DELETE` de várias tabelas, como mostrado aqui:

```
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