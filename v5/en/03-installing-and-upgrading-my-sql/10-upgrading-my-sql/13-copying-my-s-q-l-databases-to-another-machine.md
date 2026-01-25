### 2.10.13 Copiando Databases MySQL para Outra Máquina

Em casos em que você precisa transferir **Databases** entre diferentes arquiteturas, você pode usar o **mysqldump** para criar um arquivo contendo comandos SQL. Você pode então transferir o arquivo para a outra máquina e fornecê-lo como **input** para o cliente **mysql**.

Use **mysqldump --help** para ver quais opções estão disponíveis.

A maneira mais fácil (embora não a mais rápida) de mover um **Database** entre duas máquinas é executar os seguintes comandos na máquina onde o **Database** está localizado:

```sql
mysqladmin -h 'other_hostname' create db_name
mysqldump db_name | mysql -h 'other_hostname' db_name
```

Se você quiser copiar um **Database** de uma máquina remota por meio de uma rede lenta, você pode usar estes comandos:

```sql
mysqladmin create db_name
mysqldump -h 'other_hostname' --compress db_name | mysql db_name
```

Você também pode armazenar o **dump** em um arquivo, transferir o arquivo para a máquina de destino e, em seguida, carregar o arquivo no **Database** lá. Por exemplo, você pode fazer um **dump** de um **Database** para um arquivo compactado na máquina de origem desta forma:

```sql
mysqldump --quick db_name | gzip > db_name.gz
```

Transfira o arquivo contendo o conteúdo do **Database** para a máquina de destino e execute estes comandos lá:

```sql
mysqladmin create db_name
gunzip < db_name.gz | mysql db_name
```

Você também pode usar **mysqldump** e **mysqlimport** para transferir o **Database**. Para **Tables** grandes, isso é muito mais rápido do que simplesmente usar **mysqldump**. Nos seguintes comandos, *`DUMPDIR`* representa o caminho completo (**full path name**) do diretório que você usa para armazenar a saída do **mysqldump**.

Primeiro, crie o diretório para os arquivos de saída e faça o **dump** do **Database**:

```sql
mkdir DUMPDIR
mysqldump --tab=DUMPDIR db_name
```

Em seguida, transfira os arquivos no diretório *`DUMPDIR`* para algum diretório correspondente na máquina de destino e carregue os arquivos no MySQL lá:

```sql
mysqladmin create db_name           # create database
cat DUMPDIR/*.sql | mysql db_name   # create tables in database
mysqlimport db_name DUMPDIR/*.txt   # load data into tables
```

Não se esqueça de copiar o **Database** `mysql`, pois é onde as **grant tables** são armazenadas. Você pode ter que executar comandos como o usuário `root` do MySQL na nova máquina até que o **Database** `mysql` esteja instalado.

Depois de importar o **Database** `mysql` na nova máquina, execute **mysqladmin flush-privileges** para que o **server** recarregue as informações da **grant table**.

Nota

Você pode copiar os arquivos `.frm`, `.MYI` e `.MYD` para **Tables** `MyISAM` entre diferentes arquiteturas que suportam o mesmo formato de ponto flutuante (**floating-point format**). (O MySQL cuida de quaisquer problemas de troca de *bytes* [**byte-swapping**].) Consulte a Seção 15.2, “The MyISAM Storage Engine”.