### 2.10.13 Copiar bancos de dados MySQL para outra máquina

Em casos em que você precise transferir bancos de dados entre diferentes arquiteturas, você pode usar o **mysqldump** para criar um arquivo contendo instruções SQL. Em seguida, você pode transferir o arquivo para a outra máquina e alimentá-lo como entrada para o cliente **mysql**.

Use **mysqldump --help** para ver quais opções estão disponíveis.

A maneira mais fácil (embora não a mais rápida) de mover um banco de dados entre duas máquinas é executar os seguintes comandos na máquina em que o banco de dados está localizado:

```sql
mysqladmin -h 'other_hostname' create db_name
mysqldump db_name | mysql -h 'other_hostname' db_name
```

Se você quiser copiar um banco de dados de uma máquina remota em uma rede lenta, você pode usar esses comandos:

```sql
mysqladmin create db_name
mysqldump -h 'other_hostname' --compress db_name | mysql db_name
```

Você também pode armazenar o dump em um arquivo, transferir o arquivo para a máquina de destino e, em seguida, carregar o arquivo no banco de dados lá. Por exemplo, você pode fazer um dump de um banco de dados em um arquivo compactado na máquina de origem da seguinte maneira:

```sql
mysqldump --quick db_name | gzip > db_name.gz
```

Transfira o arquivo que contém o conteúdo do banco de dados para a máquina de destino e execute esses comandos lá:

```sql
mysqladmin create db_name
gunzip < db_name.gz | mysql db_name
```

Você também pode usar **mysqldump** e **mysqlimport** para transferir o banco de dados. Para tabelas grandes, isso é muito mais rápido do que simplesmente usar **mysqldump**. Nos comandos a seguir, *`DUMPDIR`* representa o nome completo do diretório que você usa para armazenar o resultado de **mysqldump**.

Primeiro, crie o diretório para os arquivos de saída e faça o dump do banco de dados:

```sql
mkdir DUMPDIR
mysqldump --tab=DUMPDIR db_name
```

Em seguida, transfira os arquivos no diretório *`DUMPDIR`* para algum diretório correspondente na máquina de destino e carregue os arquivos no MySQL:

```sql
mysqladmin create db_name           # create database
cat DUMPDIR/*.sql | mysql db_name   # create tables in database
mysqlimport db_name DUMPDIR/*.txt   # load data into tables
```

Não se esqueça de copiar o banco de dados `mysql`, pois é lá que as tabelas de concessão estão armazenadas. Você pode precisar executar comandos como usuário `root` do MySQL na nova máquina até que o banco de dados `mysql` esteja configurado.

Depois de importar o banco de dados `mysql` na nova máquina, execute **mysqladmin flush-privileges** para que o servidor recarregue as informações da tabela de concessão.

Nota

Você pode copiar os arquivos `.frm`, `.MYI` e `.MYD` para tabelas `MyISAM` entre diferentes arquiteturas que suportem o mesmo formato de ponto flutuante. (O MySQL cuida de quaisquer problemas de troca de bytes.) Veja a Seção 15.2, “O Motor de Armazenamento MyISAM”.
