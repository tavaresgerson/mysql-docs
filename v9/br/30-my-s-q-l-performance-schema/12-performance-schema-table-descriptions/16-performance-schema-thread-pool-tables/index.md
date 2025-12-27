### 29.12.16 Tabelas do Pool de Nervos do Schema de Desempenho

29.12.16.1 A Tabela `tp_connections`

29.12.16.2 A Tabela `tp_thread_group_state`

29.12.16.3 A Tabela `tp_thread_group_stats`

29.12.16.4 A Tabela `tp_thread_state`

As seções a seguir descrevem as tabelas do Schema de Desempenho associadas ao plugin de pool de nervos (consulte a Seção 7.6.3, “MySQL Enterprise Thread Pool”). Elas fornecem informações sobre a operação do pool de nervos:

* `tp_connections`: Informações sobre as conexões do pool de nervos.

* `tp_thread_group_state`: Informações sobre os estados dos grupos de nervos do pool de nervos.

* `tp_thread_group_stats`: Estatísticas do grupo de nervos.

* `tp_thread_state`: Informações sobre os estados dos nervos do pool de nervos.

As linhas nessas tabelas representam instantâneos no tempo. No caso de `tp_thread_state`, todas as linhas para um grupo de nervos compõem um instantâneo no tempo. Assim, o servidor MySQL mantém o mutex do grupo de nervos enquanto produz o instantâneo. Mas ele não mantém mutexes em todos os grupos de nervos ao mesmo tempo, para evitar que uma declaração contra `tp_thread_state` bloqueie todo o servidor MySQL.

As tabelas do pool de nervos do Schema de Desempenho são implementadas pelo plugin de pool de nervos e são carregadas e descarregadas quando esse plugin é carregado e descarregado (consulte a Seção 7.6.3.2, “Instalação do Pool de Nervos”). Não é necessário realizar nenhuma etapa de configuração especial para as tabelas. No entanto, as tabelas dependem de o plugin de pool de nervos estar habilitado. Se o plugin de pool de nervos for carregado, mas desabilitado, as tabelas não são criadas.