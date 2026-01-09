## 24.5 Tabelas do Pool de Fios do Schema de Informação

24.5.1 Referência da Tabela do Conjunto de Filas de Tarefas do Schema de Informações

Tabela INFORMATION_SCHEMA TP_THREAD_GROUP_STATE

Tabela INFORMATION_SCHEMA TP_THREAD_GROUP_STATS

Tabela INFORMATION_SCHEMA TP_THREAD_STATE

As seções a seguir descrevem as tabelas `INFORMATION_SCHEMA` associadas ao plugin de pool de threads (consulte Seção 5.5.3, “MySQL Enterprise Thread Pool”). Elas fornecem informações sobre o funcionamento do pool de threads:

- [`TP_THREAD_GROUP_STATE`](https://pt.wikipedia.org/wiki/TP_THREAD_GROUP_STATE): Informações sobre os estados dos grupos de threads do pool de threads

- [`TP_THREAD_GROUP_STATS`](https://information-schema-tp-thread-group-stats-table.html): Estatísticas do grupo de threads

- [`TP_THREAD_STATE`](https://pt.wikipedia.org/wiki/TP_THREAD_STATE): Informações sobre os estados dos threads do pool de threads

As linhas nessas tabelas representam instantâneos no tempo. No caso de `TP_THREAD_STATE`, todas as linhas de um grupo de threads compõem um instantâneo no tempo. Assim, o servidor MySQL mantém o mutex do grupo de threads enquanto produz o instantâneo. Mas ele não mantém mutexes em todos os grupos de threads ao mesmo tempo, para evitar que uma declaração contra `TP_THREAD_STATE` bloqueie todo o servidor MySQL.

As tabelas do pool de threads `INFORMATION_SCHEMA` são implementadas por plugins individuais e a decisão de carregá-las pode ser tomada de forma independente das outras (consulte Seção 5.5.3.2, “Instalação do Pool de Threads”). No entanto, o conteúdo de todas as tabelas depende do plugin do pool de threads estar habilitado. Se um plugin de tabela estiver habilitado, mas o plugin do pool de threads não estiver, a tabela se tornará visível e poderá ser acessada, mas ficará vazia.
