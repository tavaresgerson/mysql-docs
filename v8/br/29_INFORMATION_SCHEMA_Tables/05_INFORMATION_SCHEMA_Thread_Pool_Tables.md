## 28.5 Tabelas do Pool de Fuso de Schemas de Informação

Nota

A partir do MySQL 8.0.14, as tabelas do pool de threads `INFORMATION_SCHEMA` também estão disponíveis como tabelas do Schema de Desempenho. (Veja a Seção 29.12.16, “Tabelas de Pool de Threads do Schema de Desempenho”.) As tabelas `INFORMATION_SCHEMA` são desatualizadas; espera-se que sejam removidas em uma versão futura do MySQL. As aplicações devem migrar para as novas tabelas e não para as tabelas antigas. Por exemplo, se uma aplicação usa esta consulta:

```
SELECT * FROM INFORMATION_SCHEMA.TP_THREAD_STATE;
```

O aplicativo deve usar essa consulta em vez disso:

```
SELECT * FROM performance_schema.tp_thread_state;
```

As seções a seguir descrevem as tabelas do `INFORMATION_SCHEMA` associadas ao plugin de pool de threads (consulte a Seção 7.6.3, “MySQL Enterprise Thread Pool”). Elas fornecem informações sobre a operação do pool de threads:

* `TP_THREAD_GROUP_STATE`: Informações sobre os estados do grupo de threads do pool de threads

* `TP_THREAD_GROUP_STATS`: Estatísticas do grupo de fios

* `TP_THREAD_STATE`: Informações sobre os estados dos threads do pool de threads

As linhas nessas tabelas representam instantâneos no tempo. No caso do `TP_THREAD_STATE`, todas as linhas de um grupo de threads compreendem um instantâneo no tempo. Assim, o servidor MySQL mantém o mutex do grupo de threads enquanto produz o instantâneo. Mas ele não mantém mutexes em todos os grupos de threads ao mesmo tempo, para evitar que uma declaração contra o `TP_THREAD_STATE` bloqueie todo o servidor MySQL.

As tabelas do pool de threads `INFORMATION_SCHEMA` são implementadas por plugins individuais e a decisão de carregar uma delas pode ser feita independentemente das outras (consulte a Seção 7.6.3.2, “Instalação do Pool de Threads”). No entanto, o conteúdo de todas as tabelas depende do plugin do pool de threads estar habilitado. Se um plugin de tabela estiver habilitado, mas o plugin do pool de threads não estiver, a tabela se torna visível e pode ser acessada, mas está vazia.

### 28.5.1 Informações_Schema Referência à tabela do Pool de Fuso
### 28.5.2 INFORMATION_SCHEMA Thread Pool Table Information
### 28.5.3 INFORMATION_SCHEMA Thread Pool Table Statistics
### 28.5.4 INFORMATION_SCHEMA Thread Pool Table Statistics (continued)

A tabela a seguir resume as tabelas de pools de threads `INFORMATION_SCHEMA`. Para mais detalhes, consulte as descrições das tabelas individuais.

**Tabela 28.7 Tabelas do Pool de Fuso de Informação_SCHEMA**

<table frame="box" rules="all" summary="A reference that lists INFORMATION_SCHEMA thread pool tables."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Table Name</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>TP_THREAD_GROUP_STATE</code></td> <td>Estados do grupo de threads do pool de threads</td> </tr><tr><td><code>TP_THREAD_GROUP_STATS</code></td> <td>Estatísticas do grupo de threads do pool de threads</td> </tr><tr><td><code>TP_THREAD_STATE</code></td> <td>Informações sobre o fio do pool de threads</td> </tr></tbody></table>

### 28.5.2 A tabela INFORMATION_SCHEMA TP_THREAD_GROUP_STATE

Nota

A partir do MySQL 8.0.14, as tabelas do pool de threads `INFORMATION_SCHEMA` também estão disponíveis como tabelas do Gerador de Desempenho (Performance Schema). (Veja a Seção 29.12.16, “Tabelas do Pool de Threads do Gerador de Desempenho”). As tabelas `INFORMATION_SCHEMA` são desatualizadas; espera-se que elas sejam removidas em uma versão futura do MySQL. As aplicações devem migrar das tabelas antigas para as novas tabelas. Por exemplo, se uma aplicação usa esta consulta:

```
SELECT * FROM INFORMATION_SCHEMA.TP_THREAD_GROUP_STATE;
```

O aplicativo deve usar essa consulta em vez disso:

```
SELECT * FROM performance_schema.tp_thread_group_state;
```

A tabela `TP_THREAD_GROUP_STATE` tem uma linha por grupo de thread no pool de threads. Cada linha fornece informações sobre o estado atual de um grupo.

Para descrições das colunas da tabela `INFORMATION_SCHEMA` `TP_THREAD_GROUP_STATE`, consulte a Seção 29.12.16.1, “A tabela tp_thread_group_state”. A tabela do Gerenciamento de Desempenho `tp_thread_group_state` tem colunas equivalentes.

### 28.5.3 A tabela INFORMATION_SCHEMA TP_THREAD_GROUP_STATS

Nota

A partir do MySQL 8.0.14, as tabelas do pool de threads `INFORMATION_SCHEMA` também estão disponíveis como tabelas do Gerador de Desempenho (Performance Schema). (Veja a Seção 29.12.16, “Tabelas do Pool de Threads do Gerador de Desempenho”.) As tabelas `INFORMATION_SCHEMA` são desatualizadas; espera-se que elas sejam removidas em uma versão futura do MySQL. As aplicações devem migrar das tabelas antigas para as novas tabelas. Por exemplo, se uma aplicação usa esta consulta:

```
SELECT * FROM INFORMATION_SCHEMA.TP_THREAD_GROUP_STATS;
```

O aplicativo deve usar essa consulta em vez disso:

```
SELECT * FROM performance_schema.tp_thread_group_stats;
```

A tabela `TP_THREAD_GROUP_STATS` reporta estatísticas por grupo de fios. Há uma linha por grupo.

Para descrições das colunas da tabela `INFORMATION_SCHEMA` `TP_THREAD_GROUP_STATS`, consulte a Seção 29.12.16.2, “A tabela tp_thread_group_stats”. A tabela do Gerenciamento de Desempenho `tp_thread_group_stats` tem colunas equivalentes.

### 28.5.4 A tabela INFORMATION_SCHEMA TP_THREAD_STATE

Nota

A partir do MySQL 8.0.14, as tabelas do pool de threads `INFORMATION_SCHEMA` também estão disponíveis como tabelas do Gerador de Desempenho (Performance Schema). (Veja a Seção 29.12.16, “Tabelas do Pool de Threads do Gerador de Desempenho”.) As tabelas `INFORMATION_SCHEMA` são desatualizadas; espera-se que elas sejam removidas em uma versão futura do MySQL. As aplicações devem migrar das tabelas antigas para as novas tabelas. Por exemplo, se uma aplicação usa esta consulta:

```
SELECT * FROM INFORMATION_SCHEMA.TP_THREAD_STATE;
```

O aplicativo deve usar essa consulta em vez disso:

```
SELECT * FROM performance_schema.tp_thread_state;
```

A tabela `TP_THREAD_STATE` tem uma linha por fio criado pelo pool de threads para lidar com as conexões.

Para descrições das colunas da tabela `INFORMATION_SCHEMA` `TP_THREAD_STATE`, consulte a Seção 29.12.16.3, “A tabela tp_thread_state”. A tabela do Gerenciamento de Desempenho `tp_thread_state` tem colunas equivalentes.