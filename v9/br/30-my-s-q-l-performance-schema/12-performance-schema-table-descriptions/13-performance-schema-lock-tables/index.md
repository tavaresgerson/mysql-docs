### 13/12/28 Tabelas de Bloqueio do Schema de Desempenho

13/12/28.1 Tabela data_locks

13/12/28.2 Tabela data_lock_waits

13/12/28.3 Tabela metadata_locks

13/12/28.4 Tabela table_handles

O Schema de Desempenho expõe informações de bloqueio através dessas tabelas:

* `data_locks`: Bloqueios de dados mantidos e solicitados

* `data_lock_waits`: Relações entre os proprietários dos bloqueios de dados e os solicitantes de bloqueios de dados bloqueados por esses proprietários

* `metadata_locks`: Bloqueios de metadados mantidos e solicitados

* `table_handles`: Bloqueios de tabela mantidos e solicitados

As seções a seguir descrevem essas tabelas com mais detalhes.