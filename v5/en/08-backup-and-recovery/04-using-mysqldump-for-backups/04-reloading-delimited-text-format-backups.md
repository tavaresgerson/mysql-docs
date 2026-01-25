### 7.4.4 Recarregando Backups em Formato de Texto Delimitado

Para backups produzidos com **mysqldump --tab**, cada tabela é representada no diretório de saída por um arquivo `.sql` contendo a instrução `CREATE TABLE` para a tabela, e um arquivo `.txt` contendo os dados da tabela. Para recarregar uma tabela, primeiro mude o local para o diretório de saída. Em seguida, processe o arquivo `.sql` com o **mysql** para criar uma tabela vazia e processe o arquivo `.txt` para carregar os dados na tabela:

```sql
$> mysql db1 < t1.sql
$> mysqlimport db1 t1.txt
```

Uma alternativa ao uso do **mysqlimport** para carregar o arquivo de dados é usar a instrução `LOAD DATA` de dentro do cliente **mysql**:

```sql
mysql> USE db1;
mysql> LOAD DATA INFILE 't1.txt' INTO TABLE t1;
```

Se você usou quaisquer opções de formatação de dados com o **mysqldump** quando realizou o dump inicial da tabela, você deve usar as mesmas opções com **mysqlimport** ou `LOAD DATA` para garantir a interpretação correta do conteúdo do arquivo de dados:

```sql
$> mysqlimport --fields-terminated-by=,
         --fields-enclosed-by='"' --lines-terminated-by=0x0d0a db1 t1.txt
```

Ou:

```sql
mysql> USE db1;
mysql> LOAD DATA INFILE 't1.txt' INTO TABLE t1
       FIELDS TERMINATED BY ',' FIELDS ENCLOSED BY '"'
       LINES TERMINATED BY '\r\n';
```