### 28.5.3 A Tabela TP_THREAD_GROUP_STATS do INFORMATION_SCHEMA

Observação

As tabelas de pool de threads do `INFORMATION_SCHEMA` estão desatualizadas e estão sujeitas à remoção em uma versão futura do MySQL. Você deve usar as versões disponíveis como tabelas do Schema de Desempenho. Consulte a Seção 29.12.16, “Tabelas de Pool de Threads do Schema de Desempenho”. As aplicações devem migrar das tabelas antigas para as novas tabelas. Por exemplo, se uma aplicação usa esta consulta:

```
SELECT * FROM INFORMATION_SCHEMA.TP_THREAD_GROUP_STATS;
```

A aplicação deve usar esta consulta em vez disso:

```
SELECT * FROM performance_schema.tp_thread_group_stats;
```

A tabela `TP_THREAD_GROUP_STATS` relata estatísticas por grupo de threads. Há uma linha por grupo.

Para descrições das colunas na tabela `TP_THREAD_GROUP_STATS` do `INFORMATION_SCHEMA`, consulte a Seção 29.12.16.3, “A Tabela tp_thread_group_stats”. A tabela `tp_thread_group_stats` do Schema de Desempenho tem colunas equivalentes.