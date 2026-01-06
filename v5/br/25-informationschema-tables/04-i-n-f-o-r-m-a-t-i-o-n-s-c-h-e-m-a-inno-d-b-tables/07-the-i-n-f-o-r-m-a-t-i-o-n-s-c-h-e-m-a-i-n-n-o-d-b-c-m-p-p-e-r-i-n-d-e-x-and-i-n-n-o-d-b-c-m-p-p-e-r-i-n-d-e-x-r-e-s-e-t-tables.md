### 24.4.7 As tabelas INFORMATION\_SCHEMA INNODB\_CMP\_PER\_INDEX e INNODB\_CMP\_PER\_INDEX\_RESET

As tabelas [`INNODB_CMP_PER_INDEX`](https://pt.wikipedia.org/wiki/T%C3%A1bula_INNODB_CMP_PER_INDEX) e [`INNODB_CMP_PER_INDEX_RESET`](https://pt.wikipedia.org/wiki/T%C3%A1bula_INNODB_CMP_PER_INDEX_RESET) fornecem informações de status sobre operações relacionadas a tabelas e índices `InnoDB` compactados, com estatísticas separadas para cada combinação de banco de dados, tabela e índice, para ajudá-lo a avaliar o desempenho e a utilidade da compactação para tabelas específicas.

Para uma tabela `InnoDB` compactada, tanto os dados da tabela quanto todos os índices secundários são compactados. Nesse contexto, os dados da tabela são tratados como apenas outro índice, que por acaso contém todas as colunas: o índice agrupado.

As tabelas [`INNODB_CMP_PER_INDEX`](https://pt.wikipedia.org/wiki/Tabela_information-schema-innodb-cmp-per-index) e [`INNODB_CMP_PER_INDEX_RESET`](https://pt.wikipedia.org/wiki/Tabela_information-schema-innodb-cmp-per-index) possuem as seguintes colunas:

- `DATABASE_NAME`

  O esquema (banco de dados) que contém a tabela aplicável.

- `NOME_TABELA`

  A tabela para monitorar as estatísticas de compressão.

- `INDEX_NAME`

  O índice para monitorar as estatísticas de compressão.

- `COMPRESS_OPS`

  O número de operações de compressão realizadas. As páginas Pages são comprimidas sempre que uma página vazia é criada ou quando o espaço para o log de modificação não comprimido esgota-se.

- `COMPRESS_OPS_OK`

  O número de operações de compressão bem-sucedidas. Subtraia do valor `COMPRESS_OPS` para obter o número de falhas de compressão. Divida pelo valor `COMPRESS_OPS` para obter a porcentagem de falhas de compressão.

- `COMPRESS_TIME`

  O tempo total em segundos usado para comprimir os dados neste índice.

- `UNCOMPRESS_OPS`

  O número de operações de descompactação realizadas. As páginas compactadas do `InnoDB` são descompactadas sempre que a compactação falha, ou pela primeira vez que uma página compactada é acessada no buffer pool e a página descompactada não existe.

- `UNCOMPRESS_TIME`

  O tempo total em segundos usado para descompactação dos dados neste índice.

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

- Use essas tabelas para medir a eficácia da tabela `InnoDB` compressão para tabelas específicas, índices ou ambas.

- Você deve ter o privilégio `PROCESSO` para consultar essas tabelas.

- Use a tabela `INFORMATION_SCHEMA `COLUMNS` ou a instrução `SHOW COLUMNS\` para visualizar informações adicionais sobre as colunas dessas tabelas, incluindo tipos de dados e valores padrão.

- Como a coleta de medições separadas para cada índice impõe um custo de desempenho substancial, as estatísticas `INNODB_CMP_PER_INDEX` e `INNODB_CMP_PER_INDEX_RESET` não são coletadas por padrão. Você deve habilitar a variável de sistema `innodb_cmp_per_index_enabled` antes de realizar as operações em tabelas compactadas que você deseja monitorar.

- Para informações sobre uso, consulte Seção 14.9.1.4, “Monitoramento da Compressão de Tabelas InnoDB em Tempo Real” e Seção 14.16.1.3, “Uso das Tabelas do Esquema de Informações de Compressão”. Para informações gerais sobre a compressão de tabelas `InnoDB`, consulte Seção 14.9, “Compressão de Tabelas e Páginas InnoDB”.
