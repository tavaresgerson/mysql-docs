### 7.4.4 Recarga de backups no formato de texto delimitado

Para backups produzidos com **mysqldump --tab**, cada tabela é representada no diretório de saída por um arquivo `.sql` contendo a instrução `CREATE TABLE` para a tabela e um arquivo `.txt` contendo os dados da tabela. Para recarregar uma tabela, primeiro mude para o diretório de saída. Em seguida, processe o arquivo `.sql` com o **mysql** para criar uma tabela vazia e processe o arquivo `.txt` para carregar os dados na tabela:

```sh
$> mysql db1 < t1.sql
$> mysqlimport db1 t1.txt
```

Uma alternativa para usar **mysqlimport** para carregar o arquivo de dados é usar a instrução `LOAD DATA` dentro do cliente **mysql**:

```sh
mysql> USE db1;
mysql> LOAD DATA INFILE 't1.txt' INTO TABLE t1;
```

Se você usou quaisquer opções de formatação de dados com **mysqldump** quando você inicialmente fez o dump da tabela, você deve usar as mesmas opções com **mysqlimport** ou `LOAD DATA` para garantir a interpretação correta do conteúdo do arquivo de dados:

```sh
$> mysqlimport --fields-terminated-by=,
         --fields-enclosed-by='"' --lines-terminated-by=0x0d0a db1 t1.txt
```

Ou:

```sh
mysql> USE db1;
mysql> LOAD DATA INFILE 't1.txt' INTO TABLE t1
       FIELDS TERMINATED BY ',' FIELDS ENCLOSED BY '"'
       LINES TERMINATED BY '\r\n';
```
