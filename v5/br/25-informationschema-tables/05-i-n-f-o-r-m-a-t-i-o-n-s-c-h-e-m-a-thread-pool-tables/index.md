## 24.5 Tabelas Thread Pool do INFORMATION_SCHEMA

[24.5.1 Referência da Tabela Thread Pool do INFORMATION_SCHEMA](information-schema-thread-pool-table-reference.html)

[24.5.2 A Tabela TP_THREAD_GROUP_STATE do INFORMATION_SCHEMA](information-schema-tp-thread-group-state-table.html)

[24.5.3 A Tabela TP_THREAD_GROUP_STATS do INFORMATION_SCHEMA](information-schema-tp-thread-group-stats-table.html)

[24.5.4 A Tabela TP_THREAD_STATE do INFORMATION_SCHEMA](information-schema-tp-thread-state-table.html)

As seções a seguir descrevem as tabelas do `INFORMATION_SCHEMA` associadas ao `plugin` de `thread pool` (consulte [Seção 5.5.3, “MySQL Enterprise Thread Pool”](thread-pool.html "5.5.3 MySQL Enterprise Thread Pool")). Elas fornecem informações sobre a operação do `thread pool`:

* [`TP_THREAD_GROUP_STATE`](information-schema-tp-thread-group-state-table.html "24.5.2 A Tabela TP_THREAD_GROUP_STATE do INFORMATION_SCHEMA"): Informações sobre os estados dos `thread groups` do `thread pool`

* [`TP_THREAD_GROUP_STATS`](information-schema-tp-thread-group-stats-table.html "24.5.3 A Tabela TP_THREAD_GROUP_STATS do INFORMATION_SCHEMA"): Estatísticas de `thread group`

* [`TP_THREAD_STATE`](information-schema-tp-thread-state-table.html "24.5.4 A Tabela TP_THREAD_STATE do INFORMATION_SCHEMA"): Informações sobre os estados dos `threads` do `thread pool`

As linhas nestas tabelas representam `snapshots` no tempo. No caso da [`TP_THREAD_STATE`](information-schema-tp-thread-state-table.html "24.5.4 A Tabela TP_THREAD_STATE do INFORMATION_SCHEMA"), todas as linhas de um `thread group` compreendem um `snapshot` no tempo. Assim, o servidor MySQL mantém o `mutex` do `thread group` enquanto produz o `snapshot`. No entanto, ele não mantém `mutexes` em todos os `thread groups` simultaneamente, a fim de evitar que uma instrução na [`TP_THREAD_STATE`](information-schema-tp-thread-state-table.html "24.5.4 A Tabela TP_THREAD_STATE do INFORMATION_SCHEMA") bloqueie todo o servidor MySQL.

As tabelas `INFORMATION_SCHEMA` do `thread pool` são implementadas por `plugins` individuais, e a decisão de carregar um pode ser tomada independentemente dos outros (consulte [Seção 5.5.3.2, “Thread Pool Installation”](thread-pool-installation.html "5.5.3.2 Thread Pool Installation")). Contudo, o conteúdo de todas as tabelas depende de o `plugin` de `thread pool` estar habilitado. Se um `plugin` de tabela estiver habilitado, mas o `plugin` de `thread pool` não estiver, a tabela se torna visível e pode ser acessada, mas estará vazia.