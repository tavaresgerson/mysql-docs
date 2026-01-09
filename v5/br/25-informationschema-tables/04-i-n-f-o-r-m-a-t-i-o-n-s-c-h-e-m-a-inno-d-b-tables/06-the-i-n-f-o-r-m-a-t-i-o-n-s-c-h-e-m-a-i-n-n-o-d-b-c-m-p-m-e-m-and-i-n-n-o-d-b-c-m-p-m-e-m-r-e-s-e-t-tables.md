### 24.4.6 As tabelas INFORMATION_SCHEMA INNODB_CMPMEM e INNODB_CMPMEM_RESET

As tabelas `INNODB_CMPMEM` e `INNODB_CMPMEM_RESET` fornecem informações de status sobre as páginas compactadas (`glossary.html#glos_page`) dentro do `buffer pool` (`glossary.html#glos_buffer_pool`) do `InnoDB`.

As tabelas [`INNODB_CMPMEM`](https://pt.wikipedia.org/wiki/Tabela_information-schema-innodb-cmpmem) e [`INNODB_CMPMEM_RESET`](https://pt.wikipedia.org/wiki/Tabela_information-schema-innodb-cmpmem) possuem as seguintes colunas:

- `PAGE_SIZE`

  O tamanho do bloco em bytes. Cada registro desta tabela descreve blocos desse tamanho.

- `BUFFER_POOL_INSTANCE`

  Um identificador único para a instância do pool de buffers.

- `Páginas usadas`

  O número de blocos do tamanho `PAGE_SIZE` que estão atualmente em uso.

- `PAGES_FREE`

  O número de blocos do tamanho `PAGE_SIZE` atualmente disponíveis para alocação. Esta coluna mostra a fragmentação externa no pool de memória. Idealmente, esses números devem ser no máximo 1.

- `RELOCAÇÃO_OPS`

  O número de vezes que um bloco do tamanho `PAGE_SIZE` foi realocado. O sistema de amigos pode realocar o "amigo vizinho" alocado de um bloco liberado quando ele tenta formar um bloco liberado maior. A leitura da tabela `INNODB_CMPMEM_RESET` reinicia esse contagem.

- `RELOCAÇÃO_TEMPO`

  O tempo total em microsegundos usado para realocar blocos do tamanho `PAGE_SIZE`. A leitura da tabela `INNODB_CMPMEM_RESET` reinicia esse contador.

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

- Use essas tabelas para medir a eficácia da tabela `InnoDB` compressão no seu banco de dados.

- Você deve ter o privilégio `PROCESSO` para consultar esta tabela.

- Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

- Para informações sobre uso, consulte Seção 14.9.1.4, “Monitoramento da Compressão de Tabelas InnoDB em Tempo Real” e Seção 14.16.1.3, “Uso das Tabelas do Esquema de Informações de Compressão”. Para informações gerais sobre a compressão de tabelas `InnoDB`, consulte Seção 14.9, “Compressão de Tabelas e Páginas InnoDB”.
