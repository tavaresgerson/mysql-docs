### 24.4.7 As Tabelas INNODB_CMP_PER_INDEX e INNODB_CMP_PER_INDEX_RESET do INFORMATION_SCHEMA

As tabelas [`INNODB_CMP_PER_INDEX`](information-schema-innodb-cmp-per-index-table.html "24.4.7 The INFORMATION_SCHEMA INNODB_CMP_PER_INDEX and INNODB_CMP_PER_INDEX_RESET Tables") e [`INNODB_CMP_PER_INDEX_RESET`](information-schema-innodb-cmp-per-index-table.html "24.4.7 The INFORMATION_SCHEMA INNODB_CMP_PER_INDEX and INNODB_CMP_PER_INDEX_RESET Tables") fornecem informações de status sobre operações relacionadas a tabelas e Indexes `InnoDB` [comprimidos](glossary.html#glos_compression "compression"), com estatísticas separadas para cada combinação de Database, tabela e Index, para ajudar a avaliar o desempenho e a utilidade da Compression para tabelas específicas.

Para uma tabela `InnoDB` comprimida, tanto os dados da tabela quanto todos os [secondary indexes](glossary.html#glos_secondary_index "secondary index") são comprimidos. Neste contexto, os dados da tabela são tratados apenas como mais um Index, que por acaso contém todas as colunas: o [clustered index](glossary.html#glos_clustered_index "clustered index").

As tabelas [`INNODB_CMP_PER_INDEX`](information-schema-innodb-cmp-per-index-table.html "24.4.7 The INFORMATION_SCHEMA INNODB_CMP_PER_INDEX and INNODB_CMP_PER_INDEX_RESET Tables") e [`INNODB_CMP_PER_INDEX_RESET`](information-schema-innodb-cmp-per-index-table.html "24.4.7 The INFORMATION_SCHEMA INNODB_CMP_PER_INDEX and INNODB_CMP_PER_INDEX_RESET Tables") possuem estas colunas:

* `DATABASE_NAME`

  O schema (Database) contendo a tabela aplicável.

* `TABLE_NAME`

  A tabela a ser monitorada para estatísticas de Compression.

* `INDEX_NAME`

  O Index a ser monitorado para estatísticas de Compression.

* `COMPRESS_OPS`

  O número de operações de Compression tentadas. [Pages](glossary.html#glos_page "page") são comprimidas sempre que uma Page vazia é criada ou quando o espaço para o log de modificação não comprimido se esgota.

* `COMPRESS_OPS_OK`

  O número de operações de Compression bem-sucedidas. Subtraia do valor de `COMPRESS_OPS` para obter o número de [falhas de compression](glossary.html#glos_compression_failure "compression failure"). Divida pelo valor de `COMPRESS_OPS` para obter a porcentagem de falhas de Compression.

* `COMPRESS_TIME`

  O tempo total em segundos usado para comprimir dados neste Index.

* `UNCOMPRESS_OPS`

  O número de operações de descompressão realizadas. Pages `InnoDB` comprimidas são descomprimidas sempre que a Compression [falha](glossary.html#glos_compression_failure "compression failure"), ou na primeira vez que uma Page comprimida é acessada no [buffer pool](glossary.html#glos_buffer_pool "buffer pool") e a Page descomprimida não existe.

* `UNCOMPRESS_TIME`

  O tempo total em segundos usado para descomprimir dados neste Index.

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_CMP_PER_INDEX\G
*************************** 1. row ***************************
  database_name: employees
     table_name: salaries
     index_name: PRIMARY
   compress_ops: 0
compress_ops_ok: 0
  compress_time: 0
 uncompress_ops: 23451
uncompress_time: 4
*************************** 2. row ***************************
  database_name: employees
     table_name: salaries
     index_name: emp_no
   compress_ops: 0
compress_ops_ok: 0
  compress_time: 0
 uncompress_ops: 1597
uncompress_time: 0
```

#### Notas

* Use estas tabelas para medir a eficácia da [compression](glossary.html#glos_compression "compression") de tabelas `InnoDB` para tabelas, Indexes específicos, ou ambos.

* Você deve ter o privilégio [`PROCESS`](privileges-provided.html#priv_process) para realizar Querys nessas tabelas.

* Use a tabela [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") do `INFORMATION_SCHEMA` ou a instrução [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") para visualizar informações adicionais sobre as colunas dessas tabelas, incluindo tipos de dados e valores padrão.

* Como a coleta de medições separadas para cada Index impõe uma sobrecarga substancial de desempenho, as estatísticas de [`INNODB_CMP_PER_INDEX`](information-schema-innodb-cmp-per-index-table.html "24.4.7 The INFORMATION_SCHEMA INNODB_CMP_PER_INDEX and INNODB_CMP_PER_INDEX_RESET Tables") e [`INNODB_CMP_PER_INDEX_RESET`](information-schema-innodb-cmp-per-index-table.html "24.4.7 The INFORMATION_SCHEMA INNODB_CMP_PER_INDEX and INNODB_CMP_PER_INDEX_RESET Tables") não são coletadas por padrão. Você deve habilitar a variável de sistema [`innodb_cmp_per_index_enabled`](innodb-parameters.html#sysvar_innodb_cmp_per_index_enabled) antes de executar as operações nas tabelas comprimidas que você deseja monitorar.

* Para informações de uso, consulte [Seção 14.9.1.4, “Monitoring InnoDB Table Compression at Runtime”](innodb-compression-tuning-monitoring.html "14.9.1.4 Monitoring InnoDB Table Compression at Runtime") e [Seção 14.16.1.3, “Using the Compression Information Schema Tables”](innodb-information-schema-examples-compression-sect.html "14.16.1.3 Using the Compression Information Schema Tables"). Para informações gerais sobre Compression de tabelas `InnoDB`, consulte [Seção 14.9, “InnoDB Table and Page Compression”](innodb-compression.html "14.9 InnoDB Table and Page Compression").
