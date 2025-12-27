## Tabelas do Pool de Sincronização de Threads do `INFORMATION_SCHEMA`

28.5.1 Referência da Tabela TP_THREAD_GROUP_STATE do `INFORMATION_SCHEMA`

28.5.2 Tabela TP_THREAD_GROUP_STATS do `INFORMATION_SCHEMA`

28.5.3 Tabela TP_THREAD_STATE do `INFORMATION_SCHEMA`

Observação

As tabelas do pool de sincronização de threads do `INFORMATION_SCHEMA` estão desatualizadas e estão sujeitas à remoção em uma versão futura do MySQL. O acesso a qualquer uma dessas tabelas produz um aviso; você deve usar as versões disponíveis como tabelas do Schema de Desempenho. Consulte a Seção 29.12.16, “Tabelas do Pool de Sincronização de Threads do Schema de Desempenho”. As aplicações devem migrar das tabelas antigas para as novas tabelas. Por exemplo, se uma aplicação usa esta consulta:

```
SELECT * FROM INFORMATION_SCHEMA.TP_THREAD_STATE;
```

A aplicação deve usar esta consulta em vez disso:

```
SELECT * FROM performance_schema.tp_thread_state;
```

As seções a seguir descrevem as tabelas do `INFORMATION_SCHEMA` associadas ao plugin do pool de sincronização de threads (consulte a Seção 7.6.3, “Pool de Sincronização de Threads do MySQL Enterprise”). Elas fornecem informações sobre a operação do pool de sincronização de threads:

* `TP_THREAD_GROUP_STATE`: Informações sobre os estados dos grupos de threads do pool de sincronização de threads

* `TP_THREAD_GROUP_STATS`: Estatísticas do grupo de threads

* `TP_THREAD_STATE`: Informações sobre os estados dos threads do pool de sincronização de threads

As linhas nessas tabelas representam instantâneos no tempo. No caso do `TP_THREAD_STATE`, todas as linhas para um grupo de threads compreendem um instantâneo no tempo. Assim, o servidor MySQL mantém o mutex do grupo de threads enquanto produz o instantâneo. Mas ele não mantém mutexes em todos os grupos de threads ao mesmo tempo, para evitar que uma declaração contra o `TP_THREAD_STATE` bloqueie todo o servidor MySQL.

As tabelas do pool de threads `INFORMATION_SCHEMA` são implementadas por plugins individuais e a decisão de carregá-las pode ser tomada de forma independente das outras (consulte a Seção 7.6.3.2, “Instalação do Pool de Threads”). No entanto, o conteúdo de todas as tabelas depende do plugin do pool de threads estar habilitado. Se um plugin de tabela estiver habilitado, mas o plugin do pool de threads não estiver, a tabela se tornará visível e poderá ser acessada, mas ficará vazia.