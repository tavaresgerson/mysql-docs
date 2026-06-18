### 28.5.2 A tabela INFORMATION\_SCHEMA TP\_THREAD\_GROUP\_STATE

Nota

A partir do MySQL 8.0.14, as tabelas do pool de threads `INFORMATION_SCHEMA` também estão disponíveis como tabelas do Gerenciador de Desempenho (Performance Schema). (Veja a Seção 29.12.16, “Tabelas do Pool de Threads do Gerenciador de Desempenho”). As tabelas `INFORMATION_SCHEMA` estão desatualizadas; espera-se que sejam removidas em uma versão futura do MySQL. As aplicações devem migrar para as novas tabelas, em vez das tabelas antigas. Por exemplo, se uma aplicação usa esta consulta:

```
SELECT * FROM INFORMATION_SCHEMA.TP_THREAD_GROUP_STATE;
```

O aplicativo deve usar essa consulta em vez disso:

```
SELECT * FROM performance_schema.tp_thread_group_state;
```

A tabela `TP_THREAD_GROUP_STATE` tem uma linha por grupo de threads no pool de threads. Cada linha fornece informações sobre o estado atual de um grupo.

Para descrições das colunas da tabela `INFORMATION_SCHEMA` `TP_THREAD_GROUP_STATE`, consulte a Seção 29.12.16.1, “A tabela tp\_thread\_group\_state”. A tabela do Schema de Desempenho `tp_thread_group_state` tem colunas equivalentes.
