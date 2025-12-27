### 28.5.4 A Tabela TP_THREAD_STATE do INFORMATION_SCHEMA

Observação

As tabelas de pool de threads do `INFORMATION_SCHEMA` estão desatualizadas e estão sujeitas à remoção em uma versão futura do MySQL. Você deve usar as versões disponíveis como tabelas do Schema de Desempenho. Consulte a Seção 29.12.16, “Tabelas de Pool de Threads do Schema de Desempenho”. As aplicações devem migrar das tabelas antigas para as novas tabelas. Por exemplo, se uma aplicação usa esta consulta:

```
SELECT * FROM INFORMATION_SCHEMA.TP_THREAD_STATE;
```

A aplicação deve usar esta consulta em vez disso:

```
SELECT * FROM performance_schema.tp_thread_state;
```

A tabela `TP_THREAD_STATE` tem uma linha por thread criado pelo pool de threads para gerenciar conexões.

Para descrições das colunas na tabela `TP_THREAD_STATE` do `INFORMATION_SCHEMA`, consulte a Seção 29.12.16.4, “A Tabela tp_thread_state”. A tabela `tp_thread_state` do Schema de Desempenho tem colunas equivalentes.