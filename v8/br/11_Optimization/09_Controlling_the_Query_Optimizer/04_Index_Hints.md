### 10.9.4 Dicas de índice

Os índices de dicas fornecem ao otimizador informações sobre como escolher índices durante o processamento de consultas. Os índices de dicas, descritos aqui, diferem dos índices de dicas, descritos na Seção 10.9.3, “Indicação de otimizador”. Os índices e os índices de dicas podem ser usados separadamente ou juntos.

Os índices de dicas se aplicam às declarações `SELECT` e `UPDATE`. Eles também funcionam com declarações multitabela `DELETE`, mas não com declarações de tabela única `DELETE`, conforme mostrado mais adiante nesta seção.

Os índices de dicas são especificados após o nome de uma tabela. (Para a sintaxe geral de especificação de tabelas em uma declaração `SELECT`, consulte a Seção 15.2.13.2, “Cláusula JOIN”.) A sintaxe para referenciar uma tabela individual, incluindo índices de dicas, é a seguinte:

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

O `USE INDEX (index_list)` indica ao MySQL que use apenas um dos índices nomeados para encontrar linhas na tabela. A sintaxe alternativa `IGNORE INDEX (index_list)` indica ao MySQL que não use algum índice ou índices específicos. Esses indicadores são úteis se `EXPLAIN` mostrar que o MySQL está usando o índice errado da lista de índices possíveis.

O `FORCE INDEX` atalho funciona como o `USE INDEX (index_list)`, com a adição de que uma varredura de tabela é considerada *muito* cara. Em outras palavras, uma varredura de tabela é usada apenas se não houver maneira de usar um dos índices nomeados para encontrar linhas na tabela.

Nota

A partir do MySQL 8.0.20, o servidor suporta as dicas de otimização de nível de índice `JOIN_INDEX`, `GROUP_INDEX`, `ORDER_INDEX` e `INDEX`, que são equivalentes e destinadas a substituir as dicas de índice `FORCE INDEX`, bem como as dicas de otimização `NO_JOIN_INDEX`, `NO_GROUP_INDEX`, `NO_ORDER_INDEX` e `NO_INDEX`, que são equivalentes e destinadas a substituir as dicas de índice `IGNORE INDEX`. Portanto, você deve esperar que `USE INDEX`, `FORCE INDEX` e `IGNORE INDEX` sejam descontinuados em uma futura versão do MySQL e, em algum momento, posteriormente, sejam removidos completamente.

Essas dicas de otimização de nível de índice são suportadas tanto com instruções de tabela única quanto de tabela múltipla `DELETE`.

Para obter mais informações, consulte Dicas de otimização de nível de índice.

Cada pista requer nomes de índices, não de colunas. Para se referir a uma chave primária, use o nome `PRIMARY`. Para ver os nomes dos índices de uma tabela, use a declaração `SHOW INDEX` ou a tabela do Schema de Informações `STATISTICS`.

Um valor `index_name` não precisa ser o nome completo de um índice. Pode ser um prefixo inequívoco de um nome de índice. Se um prefixo for ambíguo, ocorrerá um erro.

Exemplos:

```
SELECT * FROM table1 USE INDEX (col1_index,col2_index)
  WHERE col1=1 AND col2=2 AND col3=3;

SELECT * FROM table1 IGNORE INDEX (col3_index)
  WHERE col1=1 AND col2=2 AND col3=3;
```

A sintaxe para dicas de índice tem as seguintes características:

- É sintaticamente válido omitir `index_list` para `USE INDEX`, o que significa “não usar índices”. Omitir `index_list` para `FORCE INDEX` ou `IGNORE INDEX` é um erro de sintaxe.

- Você pode especificar o escopo de uma dica de índice adicionando uma cláusula `FOR` à dica. Isso oferece um controle mais detalhado sobre a seleção do plano de execução do otimizador para várias fases do processamento de consultas. Para afetar apenas os índices usados quando o MySQL decide como encontrar linhas na tabela e como processar junções, use `FOR JOIN`. Para influenciar o uso de índices para ordenação ou agrupamento de linhas, use `FOR ORDER BY` ou `FOR GROUP BY`.

- Você pode especificar várias dicas de índice:

  ```
  SELECT * FROM t1 USE INDEX (i1) IGNORE INDEX FOR ORDER BY (i2) ORDER BY a;
  ```

  Não há erro em nomear o mesmo índice em várias dicas (mesmo dentro da mesma dica):

  ```
  SELECT * FROM t1 USE INDEX (i1) USE INDEX (i1,i1);
  ```

  No entanto, é um erro misturar `USE INDEX` e `FORCE INDEX` para a mesma tabela:

  ```
  SELECT * FROM t1 USE INDEX FOR JOIN (i1) FORCE INDEX FOR JOIN (i2);
  ```

Se uma dica de índice não incluir a cláusula `FOR`, o escopo da dica será aplicado a todas as partes da declaração. Por exemplo, esta dica:

```
IGNORE INDEX (i1)
```

é equivalente a esta combinação de dicas:

```
IGNORE INDEX FOR JOIN (i1)
IGNORE INDEX FOR ORDER BY (i1)
IGNORE INDEX FOR GROUP BY (i1)
```

No MySQL 5.0, o escopo do hint sem a cláusula `FOR` era aplicável apenas à recuperação de linhas. Para fazer com que o servidor use esse comportamento mais antigo quando não houver a cláusula `FOR`, habilite a variável de sistema `old` no início do servidor. Tenha cuidado ao habilitar essa variável em uma configuração de replicação. Com o registro binário baseado em instruções, ter modos diferentes para a fonte e réplicas pode levar a erros de replicação.

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

As dicas de índice são aplicadas para cada escopo na seguinte ordem:

1. `{USE|FORCE} INDEX` é aplicado se estiver presente. (Se não estiver, o conjunto de índices determinado pelo otimizador é usado.)

2. `IGNORE INDEX` é aplicado sobre o resultado da etapa anterior. Por exemplo, as seguintes duas consultas são equivalentes:

   ```
   SELECT * FROM t1 USE INDEX (i1) IGNORE INDEX (i2) USE INDEX (i2);

   SELECT * FROM t1 USE INDEX (i1);
   ```

Para as pesquisas `FULLTEXT`, os dicas de índice funcionam da seguinte forma:

- Para pesquisas no modo de linguagem natural, as dicas de índice são ignoradas silenciosamente. Por exemplo, `IGNORE INDEX(i1)` é ignorado sem aviso e o índice ainda é usado.

- Para pesquisas em modo booleano, as dicas de índice com `FOR ORDER BY` ou `FOR GROUP BY` são ignoradas silenciosamente. As dicas de índice com `FOR JOIN` ou sem o modificador `FOR` são respeitadas. Ao contrário do que acontece com as dicas para pesquisas que não são `FULLTEXT`, a dica é usada em todas as fases da execução da consulta (encontrar linhas e recuperar, agrupar e ordenar). Isso é verdadeiro mesmo que a dica seja dada para um índice que não é `FULLTEXT`.

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

Os índices indicam funcionam com as declarações `DELETE` , mas apenas se você usar a sintaxe multitabela `DELETE` , como mostrado aqui:

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
