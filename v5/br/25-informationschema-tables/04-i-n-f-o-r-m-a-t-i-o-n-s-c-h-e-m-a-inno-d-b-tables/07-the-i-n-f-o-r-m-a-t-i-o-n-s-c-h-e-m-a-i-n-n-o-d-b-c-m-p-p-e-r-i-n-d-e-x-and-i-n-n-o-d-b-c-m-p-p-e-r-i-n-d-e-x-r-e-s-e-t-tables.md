### 24.4.7 As Tabelas INNODB_CMP_PER_INDEX e INNODB_CMP_PER_INDEX_RESET do INFORMATION_SCHEMA

As tabelas `INNODB_CMP_PER_INDEX` e `INNODB_CMP_PER_INDEX_RESET` fornecem informações de status sobre operações relacionadas a tabelas e Indexes `InnoDB` comprimidos, com estatísticas separadas para cada combinação de Database, tabela e Index, para ajudar a avaliar o desempenho e a utilidade da Compression para tabelas específicas.

Para uma tabela `InnoDB` comprimida, tanto os dados da tabela quanto todos os secondary indexes são comprimidos. Neste contexto, os dados da tabela são tratados apenas como mais um Index, que por acaso contém todas as colunas: o clustered index.

As tabelas `INNODB_CMP_PER_INDEX` e `INNODB_CMP_PER_INDEX_RESET` possuem estas colunas:

* `DATABASE_NAME`

  O schema (Database) contendo a tabela aplicável.

* `TABLE_NAME`

  A tabela a ser monitorada para estatísticas de Compression.

* `INDEX_NAME`

  O Index a ser monitorado para estatísticas de Compression.

* `COMPRESS_OPS`

  O número de operações de Compression tentadas. Pages são comprimidas sempre que uma Page vazia é criada ou quando o espaço para o log de modificação não comprimido se esgota.

* `COMPRESS_OPS_OK`

  O número de operações de Compression bem-sucedidas. Subtraia do valor de `COMPRESS_OPS` para obter o número de falhas de compression. Divida pelo valor de `COMPRESS_OPS` para obter a porcentagem de falhas de Compression.

* `COMPRESS_TIME`

  O tempo total em segundos usado para comprimir dados neste Index.

* `UNCOMPRESS_OPS`

  O número de operações de descompressão realizadas. Pages `InnoDB` comprimidas são descomprimidas sempre que a Compression falha, ou na primeira vez que uma Page comprimida é acessada no buffer pool e a Page descomprimida não existe.

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

* Use estas tabelas para medir a eficácia da compression de tabelas `InnoDB` para tabelas, Indexes específicos, ou ambos.

* Você deve ter o privilégio `PROCESS` para realizar Querys nessas tabelas.

* Use a tabela `COLUMNS` do `INFORMATION_SCHEMA` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas dessas tabelas, incluindo tipos de dados e valores padrão.

* Como a coleta de medições separadas para cada Index impõe uma sobrecarga substancial de desempenho, as estatísticas de `INNODB_CMP_PER_INDEX` e `INNODB_CMP_PER_INDEX_RESET` não são coletadas por padrão. Você deve habilitar a variável de sistema `innodb_cmp_per_index_enabled` antes de executar as operações nas tabelas comprimidas que você deseja monitorar.

* Para informações de uso, consulte Seção 14.9.1.4, “Monitoring InnoDB Table Compression at Runtime” e Seção 14.16.1.3, “Using the Compression Information Schema Tables”. Para informações gerais sobre Compression de tabelas `InnoDB`, consulte Seção 14.9, “InnoDB Table and Page Compression”.
