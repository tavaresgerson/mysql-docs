## 28.5 Tabelas do Pool de Fios do Schema de Informação

28.5.1 Informações da Tabela de Rede do Banco de Fila do Schema\_Information

28.5.2 A tabela INFORMATION\_SCHEMA TP\_THREAD\_GROUP\_STATE

28.5.3 A tabela INFORMATION\_SCHEMA TP\_THREAD\_GROUP\_STATS

28.5.4 A tabela INFORMATION\_SCHEMA TP\_THREAD\_STATE

Nota

A partir do MySQL 8.0.14, as tabelas do pool de threads `INFORMATION_SCHEMA` também estão disponíveis como tabelas do Schema de Desempenho. (Veja a Seção 29.12.16, “Tabelas do Pool de Threads do Schema de Desempenho”). As tabelas `INFORMATION_SCHEMA` estão desatualizadas; espera-se que sejam removidas em uma versão futura do MySQL. As aplicações devem migrar para as novas tabelas, em vez das tabelas antigas. Por exemplo, se uma aplicação usa esta consulta:

```
SELECT * FROM INFORMATION_SCHEMA.TP_THREAD_STATE;
```

O aplicativo deve usar essa consulta em vez disso:

```
SELECT * FROM performance_schema.tp_thread_state;
```

As seções a seguir descrevem as tabelas `INFORMATION_SCHEMA` associadas ao plugin de pool de threads (consulte a Seção 7.6.3, “MySQL Enterprise Thread Pool”). Elas fornecem informações sobre a operação do pool de threads:

- `TP_THREAD_GROUP_STATE`: Informações sobre os estados do grupo de threads do pool de threads

- `TP_THREAD_GROUP_STATS`: Estatísticas do grupo de fios

- `TP_THREAD_STATE`: Informações sobre os estados dos threads do pool de threads

As linhas nessas tabelas representam instantâneos no tempo. No caso do `TP_THREAD_STATE`, todas as linhas de um grupo de threads compõem um instantâneo no tempo. Assim, o servidor MySQL mantém o mutex do grupo de threads enquanto produz o instantâneo. Mas ele não mantém mutexes em todos os grupos de threads ao mesmo tempo, para evitar que uma declaração contra `TP_THREAD_STATE` bloqueie todo o servidor MySQL.

As tabelas do pool de threads `INFORMATION_SCHEMA` são implementadas por plugins individuais e a decisão de carregá-las pode ser tomada de forma independente das outras (consulte a Seção 7.6.3.2, “Instalação do Pool de Threads”). No entanto, o conteúdo de todas as tabelas depende do plugin do pool de threads estar habilitado. Se um plugin de tabela estiver habilitado, mas o plugin do pool de threads não estiver, a tabela se tornará visível e poderá ser acessada, mas ficará vazia.
