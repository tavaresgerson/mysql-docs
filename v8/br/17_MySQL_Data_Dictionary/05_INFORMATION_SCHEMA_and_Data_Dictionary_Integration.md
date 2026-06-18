## 16.5 Integração do esquema de informações e do dicionário de dados

Com a introdução do dicionário de dados, as seguintes tabelas `INFORMATION_SCHEMA` são implementadas como visualizações em tabelas do dicionário de dados:

- `CHARACTER_SETS`
- `CHECK_CONSTRAINTS`
- `COLLATIONS`
- `COLLATION_CHARACTER_SET_APPLICABILITY`
- `COLUMNS`
- `COLUMN_STATISTICS`
- `EVENTS`
- `FILES`
- `INNODB_COLUMNS`
- `INNODB_DATAFILES`
- `INNODB_FIELDS`
- `INNODB_FOREIGN`
- `INNODB_FOREIGN_COLS`
- `INNODB_INDEXES`
- `INNODB_TABLES`
- `INNODB_TABLESPACES`
- `INNODB_TABLESPACES_BRIEF`
- `INNODB_TABLESTATS`
- `KEY_COLUMN_USAGE`
- `KEYWORDS`
- `PARAMETERS`
- `PARTITIONS`
- `REFERENTIAL_CONSTRAINTS`
- `RESOURCE_GROUPS`
- `ROUTINES`
- `SCHEMATA`
- `STATISTICS`
- `ST_GEOMETRY_COLUMNS`
- `ST_SPATIAL_REFERENCE_SYSTEMS`
- `TABLES`
- `TABLE_CONSTRAINTS`
- `TRIGGERS`
- `VIEWS`
- `VIEW_ROUTINE_USAGE`
- `VIEW_TABLE_USAGE`

As consultas nessas tabelas agora são mais eficientes, pois obtêm informações das tabelas do dicionário de dados em vez de por outros meios mais lentos. Em particular, para cada tabela `INFORMATION_SCHEMA` que é uma visualização de tabelas do dicionário de dados:

- O servidor não precisa mais criar uma tabela temporária para cada consulta da tabela `INFORMATION_SCHEMA`.

- Quando as tabelas do dicionário de dados subjacentes armazenam valores obtidos anteriormente por varreduras de diretórios (por exemplo, para enumerar nomes de bancos de dados ou nomes de tabelas dentro de bancos de dados) ou operações de abertura de arquivos (por exemplo, para ler informações de arquivos `.frm`), as consultas `INFORMATION_SCHEMA` agora buscam esses valores usando consultas de tabela. (Além disso, mesmo para uma tabela não visual `INFORMATION_SCHEMA`, valores como nomes de banco de dados e tabelas são recuperados por buscas no dicionário de dados e não requerem varreduras de diretórios ou arquivos.)

- Os índices nas tabelas do dicionário de dados subjacente permitem que o otimizador construa planos de execução de consultas eficientes, algo que não era verdade na implementação anterior, que processava a tabela `INFORMATION_SCHEMA` usando uma tabela temporária por consulta.

As melhorias anteriores também se aplicam às declarações `SHOW` que exibem informações correspondentes às tabelas `INFORMATION_SCHEMA`, que são visualizações de tabelas do dicionário de dados. Por exemplo, `SHOW DATABASES` exibe as mesmas informações que a tabela `SCHEMATA`.

Além da introdução de visualizações nas tabelas do dicionário de dados, as estatísticas da tabela contidas nas tabelas `STATISTICS` e `TABLES` agora são armazenadas em cache para melhorar o desempenho da consulta `INFORMATION_SCHEMA`. A variável de sistema `information_schema_stats_expiry` define o período de tempo antes que as estatísticas da tabela armazenadas em cache expirem. O padrão é de 86400 segundos (24 horas). Se não houver estatísticas armazenadas em cache ou se as estatísticas tiverem expirado, as estatísticas são recuperadas do mecanismo de armazenamento ao consultar as colunas de estatísticas da tabela. Para atualizar os valores armazenados em cache a qualquer momento para uma determinada tabela, use `ANALYZE TABLE`

`information_schema_stats_expiry` pode ser definido como `0` para que as consultas `INFORMATION_SCHEMA` recuperem as estatísticas mais recentes diretamente do mecanismo de armazenamento, o que não é tão rápido quanto recuperar estatísticas em cache.

Para obter mais informações, consulte a Seção 10.2.3, “Otimizando consultas do INFORMATION\_SCHEMA”.

As tabelas `INFORMATION_SCHEMA` no MySQL 8.0 estão intimamente ligadas ao dicionário de dados, resultando em várias diferenças de uso. Veja a Seção 16.7, “Diferenças de Uso do Dicionário de Dados”.
