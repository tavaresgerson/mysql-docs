### 24.4.5 As tabelas INFORMATION\_SCHEMA INNODB\_CMP e INNODB\_CMP\_RESET

As tabelas `INNODB_CMP` e `INNODB_CMP_RESET` fornecem informações de status sobre operações relacionadas a tabelas `InnoDB` compactadas.

As tabelas `INNODB_CMP` e `INNODB_CMP_RESET` possuem as seguintes colunas:

- `PAGE_SIZE`

  O tamanho da página comprimida em bytes.

- `COMPRESS_OPS`

  O número de vezes que uma página de árvore B do tamanho `PAGE_SIZE` foi comprimida. As páginas são comprimidas sempre que uma página vazia é criada ou o espaço para o log de modificação não compactado esgota-se.

- `COMPRESS_OPS_OK`

  O número de vezes que uma página de árvore B do tamanho `PAGE_SIZE` foi comprimida com sucesso. Esse contagem nunca deve exceder `COMPRESS_OPS`.

- `COMPRESS_TIME`

  O tempo total em segundos usado para tentativas de comprimir páginas de árvore B do tamanho `PAGE_SIZE`.

- `UNCOMPRESS_OPS`

  O número de vezes que uma página de árvore B do tamanho `PAGE_SIZE` foi descompactada. As páginas de árvore B são descompactadas sempre que a compressão falha ou na primeira vez de acesso, quando a página descompactada não existe no pool de buffer.

- `UNCOMPRESS_TIME`

  O tempo total em segundos usado para descompactação das páginas B-tree do tamanho `PAGE_SIZE`.

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

- Use essas tabelas para medir a eficácia da tabela `InnoDB` compressão no seu banco de dados.

- Você deve ter o privilégio `PROCESSO` para consultar esta tabela.

- Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

- Para informações sobre uso, consulte Seção 14.9.1.4, “Monitoramento da Compressão de Tabelas InnoDB em Tempo Real” e Seção 14.16.1.3, “Uso das Tabelas do Esquema de Informações de Compressão”. Para informações gerais sobre a compressão de tabelas `InnoDB`, consulte Seção 14.9, “Compressão de Tabelas e Páginas InnoDB”.
