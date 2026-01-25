#### 8.2.1.6 Algoritmos de JOIN de Loop Aninhado

O MySQL executa JOINs entre tabelas usando um algoritmo de loop aninhado (nested-loop) ou variações dele.

* Algoritmo de JOIN de Loop Aninhado (Nested-Loop Join Algorithm)
* Algoritmo de JOIN de Loop Aninhado em Bloco (Block Nested-Loop Join Algorithm)

##### Algoritmo de JOIN de Loop Aninhado

Um algoritmo simples de JOIN de loop aninhado (NLJ) lê linhas da primeira tabela em um loop, uma de cada vez, passando cada linha para um loop aninhado que processa a próxima tabela no JOIN. Este processo é repetido tantas vezes quantas forem as tabelas restantes a serem unidas.

Suponha que um JOIN entre três tabelas `t1`, `t2` e `t3` deva ser executado usando os seguintes tipos de JOIN:

```sql
Table   Join Type
t1      range
t2      ref
t3      ALL
```

Se um algoritmo NLJ simples for usado, o JOIN é processado assim:

```sql
for each row in t1 matching range {
  for each row in t2 matching reference key {
    for each row in t3 {
      if row satisfies join conditions, send to client
    }
  }
}
```

Como o algoritmo NLJ passa linhas, uma de cada vez, dos loops externos para os loops internos, ele tipicamente lê as tabelas processadas nos loops internos muitas vezes.

##### Algoritmo de JOIN de Loop Aninhado em Bloco

Um algoritmo de JOIN de Loop Aninhado em Bloco (BNL) usa *buffering* de linhas lidas em loops externos para reduzir o número de vezes que as tabelas em loops internos devem ser lidas. Por exemplo, se 10 linhas forem lidas em um *buffer* e o *buffer* for passado para o próximo loop interno, cada linha lida no loop interno pode ser comparada com todas as 10 linhas no *buffer*. Isso reduz em uma ordem de magnitude o número de vezes que a tabela interna deve ser lida.

O *join buffering* do MySQL tem estas características:

* O *Join buffering* pode ser usado quando o JOIN é do tipo `ALL` ou `index` (em outras palavras, quando nenhuma chave possível pode ser usada, e um *full scan* é feito, respectivamente, nas linhas de dados ou de *Index*), ou `range`. O uso de *buffering* também se aplica a *outer joins*, conforme descrito na Seção 8.2.1.11, “Block Nested-Loop and Batched Key Access Joins”.

* Um *join buffer* nunca é alocado para a primeira tabela não constante, mesmo que seja do tipo `ALL` ou `index`.

* Apenas colunas de interesse para um JOIN são armazenadas em seu *join buffer*, não linhas inteiras.

* A variável de sistema `join_buffer_size` determina o tamanho de cada *join buffer* usado para processar uma *Query*.

* Um *buffer* é alocado para cada JOIN que pode ser armazenado em *buffer*, portanto, uma determinada *Query* pode ser processada usando múltiplos *join buffers*.

* Um *join buffer* é alocado antes da execução do JOIN e liberado após a conclusão da *Query*.

Para o exemplo de JOIN descrito anteriormente para o algoritmo NLJ (sem *buffering*), o JOIN é feito da seguinte forma usando *join buffering*:

```sql
for each row in t1 matching range {
  for each row in t2 matching reference key {
    store used columns from t1, t2 in join buffer
    if buffer is full {
      for each row in t3 {
        for each t1, t2 combination in join buffer {
          if row satisfies join conditions, send to client
        }
      }
      empty join buffer
    }
  }
}

if buffer is not empty {
  for each row in t3 {
    for each t1, t2 combination in join buffer {
      if row satisfies join conditions, send to client
    }
  }
}
```

Se *`S`* for o tamanho de cada combinação `t1`, `t2` armazenada no *join buffer* e *`C`* for o número de combinações no *buffer*, o número de vezes que a tabela `t3` é percorrida (*scanned*) é:

```sql
(S * C)/join_buffer_size + 1
```

O número de *scans* em `t3` diminui à medida que o valor de `join_buffer_size` aumenta, até o ponto em que `join_buffer_size` é grande o suficiente para armazenar todas as combinações de linhas anteriores. Nesse ponto, nenhum ganho de velocidade é obtido ao aumentá-lo.