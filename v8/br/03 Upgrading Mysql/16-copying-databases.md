## 3.15 Copia de bases de dados MySQL para outra máquina

Nos casos em que você precisa transferir bancos de dados entre diferentes arquiteturas, você pode usar `mysqldump` para criar um arquivo contendo instruções SQL. Você pode então transferir o arquivo para a outra máquina e alimentá-lo como entrada para o cliente `mysql`.

Use **mysqldump --help** para ver quais opções estão disponíveis.

::: info Note

Se os GTIDs estiverem em uso no servidor onde você cria o dump (`gtid_mode=ON`), por padrão, `mysqldump` inclui o conteúdo do conjunto `gtid_executed` no dump para transferir esses para a nova máquina. Os resultados podem variar dependendo das versões do MySQL Server envolvidas. Verifique a descrição da opção `mysqldump` `--set-gtid-purged` para descobrir o que acontece com as versões que você está usando e como alterar o comportamento se o resultado do comportamento padrão não for adequado para sua situação.

:::

A maneira mais fácil (embora não a mais rápida) de mover um banco de dados entre duas máquinas é executar os seguintes comandos na máquina em que o banco de dados está localizado:

```
mysqladmin -h 'other_hostname' create db_name
mysqldump db_name | mysql -h 'other_hostname' db_name
```

Se você quiser copiar um banco de dados de uma máquina remota através de uma rede lenta, você pode usar esses comandos:

```
mysqladmin create db_name
mysqldump -h 'other_hostname' --compress db_name | mysql db_name
```

Você também pode armazenar o dump em um arquivo, transferir o arquivo para a máquina de destino e, em seguida, carregar o arquivo no banco de dados lá. Por exemplo, você pode despejar um banco de dados para um arquivo comprimido na máquina de origem assim:

```
mysqldump --quick db_name | gzip > db_name.gz
```

Transferir o arquivo contendo o conteúdo da base de dados para a máquina de destino e executar os seguintes comandos lá:

```
mysqladmin create db_name
gunzip < db_name.gz | mysql db_name
```

Você também pode usar `mysqldump` e **mysqlimport** para transferir o banco de dados. Para tabelas grandes, isso é muito mais rápido do que simplesmente usar `mysqldump`. Nos comandos seguintes, `DUMPDIR` representa o nome completo do caminho do diretório que você usa para armazenar a saída do `mysqldump`.

Primeiro, crie o diretório para os arquivos de saída e descarregue o banco de dados:

```
mkdir DUMPDIR
mysqldump --tab=DUMPDIR
   db_name
```

Em seguida, transfira os arquivos no diretório \* `DUMPDIR` \* para algum diretório correspondente na máquina de destino e carregue os arquivos no MySQL lá:

```
mysqladmin create db_name           # create database
cat DUMPDIR/*.sql | mysql db_name   # create tables in database
mysqlimport db_name
   DUMPDIR/*.txt   # load data into tables
```

Não se esqueça de copiar o banco de dados `mysql` porque é onde as tabelas de concessão são armazenadas. Você pode ter que executar comandos como o usuário `root` do MySQL na nova máquina até ter o banco de dados `mysql` no lugar.

Depois de importar o banco de dados `mysql` na nova máquina, execute **mysqladmin flush-privileges** para que o servidor recarregue as informações da tabela de concessão.
