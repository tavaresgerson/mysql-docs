### 24.4.5 As Tabelas INFORMATION_SCHEMA INNODB_CMP e INNODB_CMP_RESET

As tabelas \`INNODB_CMP\` e \`INNODB_CMP_RESET\` fornecem informações de status sobre operações relacionadas a tabelas `InnoDB` comprimidas.

As tabelas \`INNODB_CMP\` e \`INNODB_CMP_RESET\` possuem as seguintes colunas:

* `PAGE_SIZE`

  O tamanho da página comprimida em bytes.

* `COMPRESS_OPS`

  O número de vezes que uma página B-tree do tamanho `PAGE_SIZE` foi comprimida. As páginas são comprimidas sempre que uma página vazia é criada ou quando o espaço para o log de modificação não comprimido se esgota.

* `COMPRESS_OPS_OK`

  O número de vezes que uma página B-tree do tamanho `PAGE_SIZE` foi comprimida com sucesso. Essa contagem nunca deve exceder `COMPRESS_OPS`.

* `COMPRESS_TIME`

  O tempo total em segundos usado para tentativas de comprimir páginas B-tree do tamanho `PAGE_SIZE`.

* `UNCOMPRESS_OPS`

  O número de vezes que uma página B-tree do tamanho `PAGE_SIZE` foi descomprimida. As páginas B-tree são descomprimidas sempre que a compression falha ou no primeiro acesso, quando a página não comprimida não existe no buffer pool.

* `UNCOMPRESS_TIME`

  O tempo total em segundos usado para descomprimir páginas B-tree do tamanho `PAGE_SIZE`.

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_CMP\G
*************************** 1. row ***************************
      page_size: 1024
   compress_ops: 0
compress_ops_ok: 0
  compress_time: 0
 uncompress_ops: 0
uncompress_time: 0
*************************** 2. row ***************************
      page_size: 2048
   compress_ops: 0
compress_ops_ok: 0
  compress_time: 0
 uncompress_ops: 0
uncompress_time: 0
*************************** 3. row ***************************
      page_size: 4096
   compress_ops: 0
compress_ops_ok: 0
  compress_time: 0
 uncompress_ops: 0
uncompress_time: 0
*************************** 4. row ***************************
      page_size: 8192
   compress_ops: 86955
compress_ops_ok: 81182
  compress_time: 27
 uncompress_ops: 26828
uncompress_time: 5
*************************** 5. row ***************************
      page_size: 16384
   compress_ops: 0
compress_ops_ok: 0
  compress_time: 0
 uncompress_ops: 0
uncompress_time: 0
```

#### Notas

* Use essas tabelas para medir a eficácia da compression de tabelas `InnoDB` no seu Database.

* Você deve ter o privilégio \`PROCESS\` para executar Query nesta tabela.

* Use a tabela `INFORMATION_SCHEMA` \`COLUMNS\` ou a instrução \`SHOW COLUMNS\` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

* Para informações de uso, consulte Seção 14.9.1.4, “Monitorando a Compression de Tabela InnoDB em Tempo de Execução” e Seção 14.16.1.3, “Usando as Tabelas Information Schema de Compression”. Para informações gerais sobre a compression de tabela `InnoDB`, consulte Seção 14.9, “Compression de Tabela e Página InnoDB”.