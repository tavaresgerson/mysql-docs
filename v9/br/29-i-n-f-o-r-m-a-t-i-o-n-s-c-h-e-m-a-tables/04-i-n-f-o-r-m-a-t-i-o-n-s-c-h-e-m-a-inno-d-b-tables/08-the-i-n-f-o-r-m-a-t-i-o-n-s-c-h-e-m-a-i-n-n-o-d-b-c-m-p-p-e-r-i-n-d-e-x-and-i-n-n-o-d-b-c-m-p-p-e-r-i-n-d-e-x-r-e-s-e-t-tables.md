### 28.4.8 As tabelas INFORMATION_SCHEMA INNODB_CMP_PER_INDEX e INNODB_CMP_PER_INDEX_RESET

As tabelas `INNODB_CMP_PER_INDEX` e `INNODB_CMP_PER_INDEX_RESET` fornecem informações de status sobre operações relacionadas a tabelas e índices `InnoDB` compactados, com estatísticas separadas para cada combinação de banco de dados, tabela e índice, para ajudá-lo a avaliar o desempenho e a utilidade da compactação para tabelas específicas.

Para uma tabela `InnoDB` compactada, os dados da tabela e todos os índices secundários são compactados. Neste contexto, os dados da tabela são tratados como apenas outro índice, que por acaso contém todas as colunas: o índice agrupado.

As tabelas `INNODB_CMP_PER_INDEX` e `INNODB_CMP_PER_INDEX_RESET` têm essas colunas:

* `DATABASE_NAME`

  O esquema (banco de dados) que contém a tabela aplicável.

* `TABLE_NAME`

  A tabela a ser monitorada para estatísticas de compactação.

* `INDEX_NAME`

  O índice a ser monitorado para estatísticas de compactação.

* `COMPRESS_OPS`

  O número de operações de compactação tentadas. As páginas são compactadas sempre que uma página vazia é criada ou o espaço para o log de modificação não compactado esgota-se.

* `COMPRESS_OPS_OK`

  O número de operações de compactação bem-sucedidas. Subtraia do valor `COMPRESS_OPS` para obter o número de falhas de compactação. Divida pelo valor `COMPRESS_OPS` para obter a porcentagem de falhas de compactação.

* `COMPRESS_TIME`

  O tempo total em segundos usado para comprimir os dados neste índice.

* `UNCOMPRESS_OPS`

  O número de operações de descompactação realizadas. As páginas `InnoDB` compactadas são descompactadas sempre que a compactação falhar, ou na primeira vez que uma página compactada é acessada no buffer pool e a página descompactada não existir.

* `UNCOMPRESS_TIME`

O tempo total em segundos usado para descompactação de dados neste índice.

#### Exemplo

```
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

* Use essas tabelas para medir a eficácia da compressão de tabelas `InnoDB` para tabelas específicas, índices ou ambos.

* Você deve ter o privilégio `PROCESS` para consultar essas tabelas.

* Use a tabela `COLUMNS` do `INFORMATION_SCHEMA` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas dessas tabelas, incluindo tipos de dados e valores padrão.

* Como a coleta de medições separadas para cada índice impõe um overhead de desempenho substancial, as estatísticas `INNODB_CMP_PER_INDEX` e `INNODB_CMP_PER_INDEX_RESET` não são coletadas por padrão. Você deve habilitar a variável de sistema `innodb_cmp_per_index_enabled` antes de realizar as operações em tabelas compactadas que você deseja monitorar.

* Para informações de uso, consulte a Seção 17.9.1.4, “Monitoramento da Compressão de Tabelas InnoDB em Tempo Real” e a Seção 17.15.1.3, “Uso das Tabelas do Schema de Informações de Compressão”. Para informações gerais sobre a compressão de tabelas `InnoDB`, consulte a Seção 17.9, “Compressão de Tabelas e Páginas InnoDB”.