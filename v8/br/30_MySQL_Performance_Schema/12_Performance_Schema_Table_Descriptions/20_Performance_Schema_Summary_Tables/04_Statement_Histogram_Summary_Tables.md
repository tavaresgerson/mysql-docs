#### 29.12.20.4 Tabelas de resumo do histograma da declaração

O Schema de Desempenho mantém tabelas de resumo de eventos de declarações que contêm informações sobre a latência mínima, máxima e média das declarações (consulte a Seção 29.12.20.3, “Tabelas de Resumo de Declarações”). Essas tabelas permitem uma avaliação de alto nível do desempenho do sistema. Para permitir uma avaliação em um nível mais detalhado, o Schema de Desempenho também coleta dados de histogramas para as latências das declarações. Esses histogramas fornecem informações adicionais sobre as distribuições de latência.

A Seção 29.12.6, “Tabelas de Eventos de Declaração do Schema de Desempenho”, descreve os eventos sobre os quais os resumos das declarações são baseados. Consulte essa discussão para obter informações sobre o conteúdo dos eventos de declaração, as tabelas de eventos de declaração atuais e históricas, e como controlar a coleta de eventos de declaração, que está parcialmente desativada por padrão.

Exemplo de declaração de informações do histograma:

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

- As colunas `events_statements_histogram_by_digest`, `SCHEMA_NAME`, `DIGEST` e `BUCKET_NUMBER` têm:

  - As colunas `SCHEMA_NAME` e `DIGEST` identificam uma linha de digestão de declaração na tabela `events_statements_summary_by_digest`.

  - As linhas `events_statements_histogram_by_digest` com os mesmos valores de `SCHEMA_NAME` e `DIGEST` compõem o histograma para essa combinação de esquema/digestão.

  - Dentro de um histograma dado, a coluna `BUCKET_NUMBER` indica o número do bucket.

- A tabela `events_statements_histogram_global` possui uma coluna `BUCKET_NUMBER`. Esta tabela resume as latências globalmente em relação ao nome do esquema e aos valores do digest, utilizando um único histograma. A coluna `BUCKET_NUMBER` indica o número do bucket dentro deste histograma global.

Um histograma é composto por `N` `BUCKET_NUMBER` *\[\[PH\_CODE\_2]]* *\[\[PH\_CODE\_3]]* *\[\[PH\_CODE\_4]]* *\[\[PH\_CODE\_5]]* *\[\[PH\_CODE\_6]]* *\[\[PH\_CODE\_7]]* *\[\[PH\_CODE\_8]]* *\[\[PH\_CODE\_9]]* *\[\[PH\_CODE\_10]]* *\[\[PH\_CODE\_11]]* *\[\[PH\_CODE\_12]]* *\[\[PH\_CODE\_13]]* *\[\[PH\_CODE\_14]]* *\[\[PH\_CODE\_15]]* *\[\[PH\_CODE\_16]]* *\[\[PH\_CODE\_17]]* *\[\[PH\_CODE\_18]]* *\[\[PH\_CODE\_19]]* *\[\[PH\_CODE\_20]]* *\[\[PH\_CODE\_21]]* *\[\[PH\_CODE\_22]]* *\[\[PH\_CODE\_23]]* *\[\[PH\_CODE\_24]]* *\[\[PH\_CODE\_25]]* *\[\[PH\_CODE\_26]]* *\[\[PH\_CODE\_27]]* *\[\[PH\_CODE\_28]]* *\[\[PH\_CODE\_29]]* *\[\[PH\_CODE\_30]]* *\[\[PH\_CODE\_31]]* *\[\[PH\_CODE\_32]]* *\[\[PH\_CODE\_33]]* *\[\[PH\_CODE\_34]]* *\[\[PH\_CODE\_35]]* *\[\[PH\_CODE\_36]]* *\[\[PH\_CODE\_37]]* *\[\[PH\_CODE\_38]]* *\[\[PH\_CODE\_39]]* *\[\[PH\_CODE\_40]]* *\[\[PH\_CODE\_41]]* *\[\[PH\_CODE\_42]]* *\[\[PH\_CODE\_43]]* *\[\[PH\_CODE\_44]]* *\[\[PH\_CODE\_45]]* *\[\[PH\_CODE\_46]]* *\[\[PH\_CODE\_47]]* *\[\[PH\_CODE\_48]]* *\[\[PH\_CODE\_49]]* *\[\[PH\_CODE\_50]]* *\[\[PH\_CODE\_51]]* *\[\[PH\_CODE\_52]]* *\[\[PH\_CODE\_53]]* *\[\[PH\_CODE\_54]]* *\[\[PH\_CODE\_55]]* *\[\[PH\_CODE\_56]]* *\[\[PH\_CODE\_57]]* *\[\[PH\_CODE\_58]]*

Cada tabela de resumo do histograma da declaração contém essas colunas de resumo contendo valores agregados:

- `BUCKET_TIMER_LOW`, `BUCKET_TIMER_HIGH`

  Um balde conta as declarações que têm uma latência, em picosegundos, medida entre `BUCKET_TIMER_LOW` e `BUCKET_TIMER_HIGH`:

  - O valor de `BUCKET_TIMER_LOW` para o primeiro bucket (`BUCKET_NUMBER` = 0) é 0.

  - O valor de `BUCKET_TIMER_LOW` para um bucket (`BUCKET_NUMBER` = `k`) é o mesmo que `BUCKET_TIMER_HIGH` para o bucket anterior (`BUCKET_NUMBER` = \*`k`−1)

  - O último bucket é um termo genérico para declarações que têm uma latência superior às declarações dos buckets anteriores no histograma.

- `COUNT_BUCKET`

  O número de declarações medido com uma latência no intervalo de `BUCKET_TIMER_LOW` até, mas não incluindo `BUCKET_TIMER_HIGH`.

- `COUNT_BUCKET_AND_LOWER`

  O número de declarações medido com uma latência no intervalo de 0 até, mas não incluindo `BUCKET_TIMER_HIGH`.

- `BUCKET_QUANTILE`

  A proporção de declarações que caem nesta ou em uma categoria inferior. Essa proporção corresponde, por definição, a `COUNT_BUCKET_AND_LOWER / SUM(COUNT_BUCKET)` e é exibida como uma coluna de conveniência.

As tabelas de resumo do histograma da declaração têm esses índices:

- `events_statements_histogram_by_digest`:

  - Índice único sobre (`SCHEMA_NAME`, `DIGEST`, `BUCKET_NUMBER`)

- `events_statements_histogram_global`:

  - Chave primária em (`BUCKET_NUMBER`)

`TRUNCATE TABLE` é permitido para tabelas de resumo de histogramas de declaração. A truncação define as colunas `COUNT_BUCKET` e `COUNT_BUCKET_AND_LOWER` para 0.

Além disso, a truncação de `events_statements_summary_by_digest` trunca implicitamente `events_statements_histogram_by_digest`, e a truncação de `events_statements_summary_global_by_event_name` trunca implicitamente `events_statements_histogram_global`.
