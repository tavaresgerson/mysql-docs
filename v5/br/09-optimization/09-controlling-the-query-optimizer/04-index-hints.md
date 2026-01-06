### 8.9.4 Dicas de índice

Os índices de dicas fornecem ao otimizador informações sobre como escolher índices durante o processamento de consultas. Os índices de dicas, descritos aqui, diferem dos índices de dicas, descritos na Seção 8.9.3, “Indicação de otimizador”. Os índices e os índices de dicas podem ser usados separadamente ou juntos.

Os índices indicam que as instruções `SELECT` e `UPDATE` são aplicadas. Eles também funcionam com instruções `DELETE` de várias tabelas, mas não com `DELETE` de uma única tabela, conforme mostrado mais adiante nesta seção.

Os índices de dicas são especificados após o nome de uma tabela. (Para a sintaxe geral de especificação de tabelas em uma instrução `SELECT`, consulte a Seção 13.2.9.2, “Cláusula JOIN”.) A sintaxe para referenciar uma tabela individual, incluindo índices de dicas, é a seguinte:

```sql
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

O indicativo `USE INDEX (index_list)` informa ao MySQL que deve usar apenas um dos índices nomeados para encontrar linhas na tabela. A sintaxe alternativa `IGNORE INDEX (index_list)` informa ao MySQL que não deve usar algum índice ou índices específicos. Esses indicativos são úteis se o `EXPLAIN` mostrar que o MySQL está usando o índice errado da lista de índices possíveis.

O indicativo `FORCE INDEX` funciona como `USE INDEX (index_list)`, com a adição de que uma varredura da tabela é considerada *muito* cara. Em outras palavras, uma varredura da tabela é usada apenas se não houver nenhuma maneira de usar um dos índices nomeados para encontrar linhas na tabela.

Cada pista requer nomes de índices, não de colunas. Para se referir a uma chave primária, use o nome `PRIMARY`. Para ver os nomes dos índices de uma tabela, use a instrução `SHOW INDEX` ou a tabela `STATISTICS` do Schema de Informações.

O valor de *`index_name`* não precisa ser o nome completo do índice. Pode ser um prefixo inequívoco do nome do índice. Se um prefixo for ambíguo, ocorrerá um erro.

Exemplos:

```sql
SELECT * FROM table1 USE INDEX (col1_index,col2_index)
  WHERE col1=1 AND col2=2 AND col3=3;

SELECT * FROM table1 IGNORE INDEX (col3_index)
  WHERE col1=1 AND col2=2 AND col3=3;
```

A sintaxe para dicas de índice tem as seguintes características:

- É sintaticamente válido omitir *`index_list`* para `USE INDEX`, o que significa “não usar índices”. Omitir *`index_list`* para `FORCE INDEX` ou `IGNORE INDEX` é um erro de sintaxe.

- Você pode especificar o escopo de uma dica de índice adicionando uma cláusula `FOR` à dica. Isso oferece um controle mais detalhado sobre a seleção do plano de execução do otimizador para várias fases do processamento de consultas. Para afetar apenas os índices usados quando o MySQL decide como encontrar linhas na tabela e como processar junções, use `FOR JOIN`. Para influenciar o uso de índices para ordenação ou agrupamento de linhas, use `FOR ORDER BY` ou `FOR GROUP BY`.

- Você pode especificar várias dicas de índice:

  ```sql
  SELECT * FROM t1 USE INDEX (i1) IGNORE INDEX FOR ORDER BY (i2) ORDER BY a;
  ```

  Não há erro em nomear o mesmo índice em várias dicas (mesmo dentro da mesma dica):

  ```sql
  SELECT * FROM t1 USE INDEX (i1) USE INDEX (i1,i1);
  ```

  No entanto, é um erro misturar `USE INDEX` e `FORCE INDEX` para a mesma tabela:

  ```sql
  SELECT * FROM t1 USE INDEX FOR JOIN (i1) FORCE INDEX FOR JOIN (i2);
  ```

Se uma dica de índice não incluir nenhuma cláusula `FOR`, o escopo da dica será aplicado a todas as partes da declaração. Por exemplo, esta dica:

```sql
IGNORE INDEX (i1)
```

é equivalente a esta combinação de dicas:

```sql
IGNORE INDEX FOR JOIN (i1)
IGNORE INDEX FOR ORDER BY (i1)
IGNORE INDEX FOR GROUP BY (i1)
```

No MySQL 5.0, o escopo do hint sem a cláusula `FOR` aplicava-se apenas à recuperação de linhas. Para fazer com que o servidor use esse comportamento mais antigo quando não houver a cláusula `FOR`, habilite a variável de sistema `old` durante o início do servidor. Tenha cuidado ao habilitar essa variável em uma configuração de replicação. Com o registro binário baseado em instruções, ter modos diferentes para a fonte e as réplicas pode levar a erros de replicação.

Quando as dicas de índice são processadas, elas são coletadas em uma única lista por tipo (`USE`, `FORCE`, `IGNORE`) e por escopo (`FOR JOIN`, `FOR ORDER BY`, `FOR GROUP BY`). Por exemplo:

```sql
SELECT * FROM t1
  USE INDEX () IGNORE INDEX (i2) USE INDEX (i1) USE INDEX (i2);
```

é equivalente a:

```sql
SELECT * FROM t1
   USE INDEX (i1,i2) IGNORE INDEX (i2);
```

As dicas de índice são aplicadas para cada escopo na seguinte ordem:

1. O `{USE|FORCE} INDEX` é aplicado se estiver presente. (Se não estiver, o conjunto de índices determinado pelo otimizador é usado.)

2. O comando `IGNORE INDEX` é aplicado sobre o resultado da etapa anterior. Por exemplo, as seguintes duas consultas são equivalentes:

   ```sql
   SELECT * FROM t1 USE INDEX (i1) IGNORE INDEX (i2) USE INDEX (i2);

   SELECT * FROM t1 USE INDEX (i1);
   ```

Para as pesquisas `FULLTEXT`, os índices funcionam da seguinte maneira:

- Para pesquisas no modo de linguagem natural, as dicas de índice são ignoradas silenciosamente. Por exemplo, `IGNORE INDEX(i1)` é ignorado sem aviso e o índice ainda é usado.

- Para pesquisas em modo booleano, as dicas de índice com `FOR ORDER BY` ou `FOR GROUP BY` são ignoradas silenciosamente. As dicas de índice com `FOR JOIN` ou sem o modificador `FOR` são respeitadas. Ao contrário do que acontece com as dicas para pesquisas que não são `FULLTEXT`, a dica é usada em todas as fases da execução da consulta (encontrar linhas e recuperar, agrupar e ordenar). Isso é verdadeiro mesmo que a dica seja dada para um índice que não é `FULLTEXT`.

  Por exemplo, as seguintes duas consultas são equivalentes:

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

Os índices indicam o que fazer com as instruções `DELETE`, mas apenas se você usar a sintaxe `DELETE` de múltiplas tabelas, como mostrado aqui:

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
