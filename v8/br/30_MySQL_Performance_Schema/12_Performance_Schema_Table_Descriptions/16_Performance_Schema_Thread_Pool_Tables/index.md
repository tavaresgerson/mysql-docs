### 29.12.16 Tabelas do Conjunto de Níveis de Desempenho do Pool de Fios

29.12.16.1 A tabela tp\_thread\_group\_state

29.12.16.2 A tabela tp\_thread\_group\_stats

29.12.16.3 A tabela tp\_thread\_state

Nota

As tabelas do Schema de Desempenho descritas aqui estão disponíveis a partir do MySQL 8.0.14. Antes do MySQL 8.0.14, use as tabelas correspondentes `INFORMATION_SCHEMA` em vez disso; veja a Seção 28.5, “Tabelas do Pool de Threads do INFORMATION\_SCHEMA”.

As seções a seguir descrevem as tabelas do Schema de Desempenho associadas ao plugin de pool de threads (consulte a Seção 7.6.3, “MySQL Enterprise Thread Pool”). Elas fornecem informações sobre a operação do pool de threads:

- `tp_thread_group_state`: Informações sobre os estados do grupo de threads do pool de threads.

- `tp_thread_group_stats`: Estatísticas do grupo de fios.

- `tp_thread_state`: Informações sobre os estados dos threads do pool de threads.

As linhas nessas tabelas representam instantâneos no tempo. No caso do `tp_thread_state`, todas as linhas de um grupo de threads compõem um instantâneo no tempo. Assim, o servidor MySQL mantém o mutex do grupo de threads enquanto produz o instantâneo. Mas ele não mantém mutexes em todos os grupos de threads ao mesmo tempo, para evitar que uma declaração contra `tp_thread_state` bloqueie todo o servidor MySQL.

As tabelas do pool de threads do Schema de Desempenho são implementadas pelo plugin do pool de threads e são carregadas e descarregadas quando esse plugin é carregado e descarregado (consulte a Seção 7.6.3.2, “Instalação do Pool de Threads”). Não é necessário realizar nenhuma etapa de configuração especial para as tabelas. No entanto, as tabelas dependem do plugin do pool de threads estar habilitado. Se o plugin do pool de threads for carregado, mas desabilitado, as tabelas não serão criadas.
