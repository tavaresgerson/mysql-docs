#### 29.12.20.6 Resumo da tabela de espera do objeto

O Schema de Desempenho mantém a tabela `objects_summary_global_by_type` para agregação de eventos de espera de objetos.

Resumo das informações do evento de espera do objeto exemplo:

```
mysql> SELECT * FROM performance_schema.objects_summary_global_by_type\G
...
*************************** 3. row ***************************
   OBJECT_TYPE: TABLE
 OBJECT_SCHEMA: test
   OBJECT_NAME: t
    COUNT_STAR: 3
SUM_TIMER_WAIT: 263126976
MIN_TIMER_WAIT: 1522272
AVG_TIMER_WAIT: 87708678
MAX_TIMER_WAIT: 258428280
...
*************************** 10. row ***************************
   OBJECT_TYPE: TABLE
 OBJECT_SCHEMA: mysql
   OBJECT_NAME: user
    COUNT_STAR: 14
SUM_TIMER_WAIT: 365567592
MIN_TIMER_WAIT: 1141704
AVG_TIMER_WAIT: 26111769
MAX_TIMER_WAIT: 334783032
...
```

A tabela `objects_summary_global_by_type` possui essas colunas de agrupamento para indicar como a tabela agrega eventos: `OBJECT_TYPE`, `OBJECT_SCHEMA` e `OBJECT_NAME`. Cada linha resume os eventos para o objeto fornecido.

`objects_summary_global_by_type` tem as mesmas colunas de resumo das tabelas `events_waits_summary_by_xxx`. Veja a Seção 29.12.20.1, “Tabelas de Resumo de Eventos de Aguardar”.

A tabela `objects_summary_global_by_type` tem esses índices:

- Chave primária em (`OBJECT_TYPE`, `OBJECT_SCHEMA`, `OBJECT_NAME`)

`TRUNCATE TABLE` é permitido para a tabela de resumo do objeto. Ele redefiniu as colunas de resumo para zero em vez de remover linhas.
