### 29.12.13 Tabelas de bloqueio do esquema de desempenho

29.12.13.1 A tabela data\_locks

29.12.13.2 A tabela data\_lock\_waits

29.12.13.3 A tabela metadata\_locks

29.12.13.4 A tabela\_handles

O Schema de Desempenho expõe informações de bloqueio através dessas tabelas:

- `data_locks`: Bloqueios e solicitações de bloqueios de dados

- `data_lock_waits`: Relações entre os proprietários de bloqueios de dados e os solicitantes de bloqueios de dados bloqueados por esses proprietários

- `metadata_locks`: Bloqueios e solicitações de bloqueios de metadados realizados

- `table_handles`: Cadeiras de mesa seguráveis e solicitadas

As seções a seguir descrevem essas tabelas com mais detalhes.
