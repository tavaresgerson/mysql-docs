### 28.5.2 A Tabela TP_THREAD_GROUP_STATE do INFORMATION_SCHEMA

Observação

As tabelas de pool de threads do `INFORMATION_SCHEMA` estão desatualizadas e estão sujeitas à remoção em uma versão futura do MySQL. Você deve usar as versões disponíveis como tabelas do Performance Schema. Consulte a Seção 29.12.16, “Tabelas de Pool de Threads do Performance Schema”. As aplicações devem migrar das tabelas antigas para as novas tabelas. Por exemplo, se uma aplicação usa esta consulta:

```
SELECT * FROM INFORMATION_SCHEMA.TP_THREAD_GROUP_STATE;
```

A aplicação deve usar esta consulta em vez disso:

```
SELECT * FROM performance_schema.tp_thread_group_state;
```

A tabela `TP_THREAD_GROUP_STATE` tem uma linha por grupo de threads no pool de threads. Cada linha fornece informações sobre o estado atual de um grupo.

Para descrições das colunas na tabela `TP_THREAD_GROUP_STATE` do `INFORMATION_SCHEMA`, consulte a Seção 29.12.16.2, “A Tabela tp_thread_group_state”. A tabela `tp_thread_group_state` do Performance Schema tem colunas equivalentes.