#### 29.12.20.4 Tabelas de Resumo de Histograma de Eventos de Declaração

O Schema de Desempenho mantém tabelas de resumo de eventos de declaração que contêm informações sobre a latência mínima, máxima e média da declaração (veja a Seção 29.12.20.3, “Tabelas de Resumo de Declaração”). Essas tabelas permitem uma avaliação de alto nível do desempenho do sistema. Para permitir uma avaliação em um nível mais detalhado, o Schema de Desempenho também coleta dados de histograma para as latências das declarações. Esses histogramas fornecem informações adicionais sobre as distribuições de latência.

A Seção 29.12.6, “Tabelas de Eventos de Declaração do Schema de Desempenho”, descreve os eventos sobre os quais os resumos de declarações são baseados. Consulte essa discussão para obter informações sobre o conteúdo dos eventos de declaração, as tabelas atuais e históricas de eventos de declaração e como controlar a coleta de eventos de declaração, que está parcialmente desativada por padrão.

Informações de histograma de declaração de exemplo:

```
mysql> SELECT *
       FROM performance_schema.events_statements_histogram_by_digest
       WHERE SCHEMA_NAME = 'mydb' AND DIGEST = 'bb3f69453119b2d7b3ae40673a9d4c7c'
       AND COUNT_BUCKET > 0 ORDER BY BUCKET_NUMBER\G
*************************** 1. row ***************************
           SCHEMA_NAME: mydb
                DIGEST: bb3f69453119b2d7b3ae40673a9d4c7c
         BUCKET_NUMBER: 42
      BUCKET_TIMER_LOW: 66069344
     BUCKET_TIMER_HIGH: 69183097
          COUNT_BUCKET: 1
COUNT_BUCKET_AND_LOWER: 1
       BUCKET_QUANTILE: 0.058824
*************************** 2. row ***************************
           SCHEMA_NAME: mydb
                DIGEST: bb3f69453119b2d7b3ae40673a9d4c7c
         BUCKET_NUMBER: 43
      BUCKET_TIMER_LOW: 69183097
     BUCKET_TIMER_HIGH: 72443596
          COUNT_BUCKET: 1
COUNT_BUCKET_AND_LOWER: 2
       BUCKET_QUANTILE: 0.117647
*************************** 3. row ***************************
           SCHEMA_NAME: mydb
                DIGEST: bb3f69453119b2d7b3ae40673a9d4c7c
         BUCKET_NUMBER: 44
      BUCKET_TIMER_LOW: 72443596
     BUCKET_TIMER_HIGH: 75857757
          COUNT_BUCKET: 2
COUNT_BUCKET_AND_LOWER: 4
       BUCKET_QUANTILE: 0.235294
*************************** 4. row ***************************
           SCHEMA_NAME: mydb
                DIGEST: bb3f69453119b2d7b3ae40673a9d4c7c
         BUCKET_NUMBER: 45
      BUCKET_TIMER_LOW: 75857757
     BUCKET_TIMER_HIGH: 79432823
          COUNT_BUCKET: 6
COUNT_BUCKET_AND_LOWER: 10
       BUCKET_QUANTILE: 0.625000
...
```

Por exemplo, na linha 3, esses valores indicam que 23,52% das consultas são executadas em menos de 75,86 microsegundos:

```
BUCKET_TIMER_HIGH: 75857757
  BUCKET_QUANTILE: 0.235294
```

Na linha 4, esses valores indicam que 62,50% das consultas são executadas em menos de 79,44 microsegundos:

```
BUCKET_TIMER_HIGH: 79432823
  BUCKET_QUANTILE: 0.625000
```

Cada tabela de resumo de histograma de declaração tem uma ou mais colunas de agrupamento para indicar como a tabela agrega eventos:

* `events_statements_histogram_by_digest` tem as colunas `SCHEMA_NAME`, `DIGEST` e `BUCKET_NUMBER`:

  + As colunas `SCHEMA_NAME` e `DIGEST` identificam uma linha de digest de declaração na tabela `events_statements_summary_by_digest`.

  + As linhas `events_statements_histogram_by_digest` com os mesmos valores de `SCHEMA_NAME` e `DIGEST` compõem o histograma para essa combinação de esquema/digest.

  + Dentro de um histograma dado, a coluna `BUCKET_NUMBER` indica o número de bucket.

* `events_statements_histogram_global` tem uma coluna `BUCKET_NUMBER`. Esta tabela resume as latências globalmente em relação ao nome do esquema e aos valores de digest, usando um único histograma. A coluna `BUCKET_NUMBER` indica o número do bucket dentro deste histograma global.

Um histograma consiste em *`N`* buckets, onde cada linha representa um bucket, com o número do bucket indicado pela coluna `BUCKET_NUMBER`. Os números dos buckets começam com 0.

Cada tabela de resumo de histogramas de declarações contém essas colunas de resumo contendo valores agregados:

* `BUCKET_TIMER_LOW`, `BUCKET_TIMER_HIGH`

  Um bucket conta declarações que têm uma latência, em picosegundos, medida entre `BUCKET_TIMER_LOW` e `BUCKET_TIMER_HIGH`:

  + O valor de `BUCKET_TIMER_LOW` para o primeiro bucket (`BUCKET_NUMBER` = 0) é 0.

  + O valor de `BUCKET_TIMER_LOW` para um bucket (`BUCKET_NUMBER` = *`k`*) é o mesmo que `BUCKET_TIMER_HIGH` para o bucket anterior (`BUCKET_NUMBER` = *`k`*−1)

  + O último bucket é um catchall para declarações que têm uma latência que excede os buckets anteriores no histograma.

* `COUNT_BUCKET`

  O número de declarações medidas com uma latência no intervalo de `BUCKET_TIMER_LOW` até, mas não incluindo `BUCKET_TIMER_HIGH`.

* `COUNT_BUCKET_AND_LOWER`

  O número de declarações medidas com uma latência no intervalo de 0 até, mas não incluindo `BUCKET_TIMER_HIGH`.

* `BUCKET_QUANTILE`

  A proporção de declarações que caem neste ou em um bucket inferior. Esta proporção corresponde, por definição, a `COUNT_BUCKET_AND_LOWER / SUM(COUNT_BUCKET)` e é exibida como uma coluna de conveniência.

As tabelas de resumo de histogramas de declarações têm esses índices:

* `events_statements_histogram_by_digest`:

  + Índice único em (`SCHEMA_NAME`, `DIGEST`, `BUCKET_NUMBER`)

* `events_statements_histogram_global`:

+ Chave primária em (`BUCKET_NUMBER`)

O comando `TRUNCATE TABLE` é permitido para tabelas de resumo de histograma de declarações. A truncagem define as colunas `COUNT_BUCKET` e `COUNT_BUCKET_AND_LOWER` para 0.

Além disso, a truncagem de `events_statements_summary_by_digest` trunca implicitamente `events_statements_histogram_by_digest`, e a truncagem de `events_statements_summary_global_by_event_name` trunca implicitamente `events_statements_histogram_global`.