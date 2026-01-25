### 24.4.6 As Tabelas INNODB_CMPMEM e INNODB_CMPMEM_RESET do INFORMATION_SCHEMA

As tabelas [`INNODB_CMPMEM`](information-schema-innodb-cmpmem-table.html "24.4.6 The INFORMATION_SCHEMA INNODB_CMPMEM and INNODB_CMPMEM_RESET Tables") e [`INNODB_CMPMEM_RESET`](information-schema-innodb-cmpmem-table.html "24.4.6 The INFORMATION_SCHEMA INNODB_CMPMEM and INNODB_CMPMEM_RESET Tables") fornecem informações de status sobre [pages] compactadas dentro do [buffer pool] do `InnoDB`.

As tabelas [`INNODB_CMPMEM`](information-schema-innodb-cmpmem-table.html "24.4.6 The INFORMATION_SCHEMA INNODB_CMPMEM and INNODB_CMPMEM_RESET Tables") e [`INNODB_CMPMEM_RESET`](information-schema-innodb-cmpmem-table.html "24.4.6 The INFORMATION_SCHEMA INNODB_CMPMEM and INNODB_CMPMEM_RESET Tables") possuem as seguintes colunas:

* `PAGE_SIZE`

  O tamanho do bloco em bytes. Cada registro desta tabela descreve blocos deste tamanho.

* `BUFFER_POOL_INSTANCE`

  Um identificador exclusivo para a instance do buffer pool.

* `PAGES_USED`

  O número de blocos do tamanho `PAGE_SIZE` que estão atualmente em uso.

* `PAGES_FREE`

  O número de blocos do tamanho `PAGE_SIZE` que estão atualmente disponíveis para alocação. Esta coluna mostra a fragmentação externa no pool de memória. Idealmente, esses números devem ser no máximo 1.

* `RELOCATION_OPS`

  O número de vezes que um bloco do tamanho `PAGE_SIZE` foi realocado. O *buddy system* pode realocar o “buddy neighbor” alocado de um bloco liberado quando tenta formar um bloco liberado maior. A leitura da tabela [`INNODB_CMPMEM_RESET`](information-schema-innodb-cmpmem-table.html "24.4.6 The INFORMATION_SCHEMA INNODB_CMPMEM and INNODB_CMPMEM_RESET Tables") zera essa contagem.

* `RELOCATION_TIME`

  O tempo total em microssegundos usado para realocar blocos do tamanho `PAGE_SIZE`. A leitura da tabela `INNODB_CMPMEM_RESET` zera essa contagem.

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_CMPMEM\G
*************************** 1. row ***************************
           page_size: 1024
buffer_pool_instance: 0
          pages_used: 0
          pages_free: 0
      relocation_ops: 0
     relocation_time: 0
*************************** 2. row ***************************
           page_size: 2048
buffer_pool_instance: 0
          pages_used: 0
          pages_free: 0
      relocation_ops: 0
     relocation_time: 0
*************************** 3. row ***************************
           page_size: 4096
buffer_pool_instance: 0
          pages_used: 0
          pages_free: 0
      relocation_ops: 0
     relocation_time: 0
*************************** 4. row ***************************
           page_size: 8192
buffer_pool_instance: 0
          pages_used: 7673
          pages_free: 15
      relocation_ops: 4638
     relocation_time: 0
*************************** 5. row ***************************
           page_size: 16384
buffer_pool_instance: 0
          pages_used: 0
          pages_free: 0
      relocation_ops: 0
     relocation_time: 0
```

#### Notas

* Use estas tabelas para medir a eficácia da [compression] de tabelas `InnoDB` no seu Database.

* Você deve ter o [`PROCESS`](privileges-provided.html#priv_process) privilege para executar uma Query nesta tabela.

* Use a tabela [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") do `INFORMATION_SCHEMA` ou o comando [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

* Para informações de uso, consulte a [Seção 14.9.1.4, “Monitorando a Compression de Tabelas InnoDB em Tempo de Execução”](innodb-compression-tuning-monitoring.html "14.9.1.4 Monitoring InnoDB Table Compression at Runtime") e a [Seção 14.16.1.3, “Usando as Information Schema Tables de Compression”](innodb-information-schema-examples-compression-sect.html "14.16.1.3 Using the Compression Information Schema Tables"). Para informações gerais sobre a compression de tabelas `InnoDB`, consulte a [Seção 14.9, “Compression de Table e Page do InnoDB”](innodb-compression.html "14.9 InnoDB Table and Page Compression").