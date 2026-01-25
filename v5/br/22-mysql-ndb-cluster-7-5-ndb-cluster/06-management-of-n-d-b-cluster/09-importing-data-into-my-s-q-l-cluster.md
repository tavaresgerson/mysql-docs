### 21.6.9 Importando Dados no MySQL Cluster

É comum, ao configurar uma nova *instance* do NDB Cluster, ser necessário importar dados de um NDB Cluster existente, de uma *instance* do MySQL ou de outra fonte. Esses dados estão, na maioria das vezes, disponíveis em um ou mais dos seguintes formatos:

* Um arquivo de *dump* SQL, como o produzido por [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") ou [**mysqlpump**](mysqlpump.html "4.5.6 mysqlpump — A Database Backup Program"). Este pode ser importado usando o [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client, conforme mostrado mais adiante nesta seção.

* Um arquivo CSV produzido por [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") ou outro programa de *export*. Tais arquivos podem ser importados para o `NDB` usando `LOAD DATA INFILE` no [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client, ou com o utilitário [**ndb_import**](mysql-cluster-programs-ndb-import.html "21.5.14 ndb_import — Import CSV Data Into NDB") fornecido com a distribuição NDB Cluster. Para mais informações sobre este último, veja [Section 21.5.14, “ndb_import — Import CSV Data Into NDB”](mysql-cluster-programs-ndb-import.html "21.5.14 ndb_import — Import CSV Data Into NDB").

* Um *backup* nativo `NDB` produzido usando [`START BACKUP`](mysql-cluster-backup-using-management-client.html "21.6.8.2 Using The NDB Cluster Management Client to Create a Backup") no *management client* do `NDB`. Para importar um *backup* nativo, você deve usar o programa [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") que acompanha o NDB Cluster. Veja [Section 21.5.24, “ndb_restore — Restore an NDB Cluster Backup”](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup"), para mais informações sobre o uso deste programa.

Ao importar dados de um arquivo SQL, frequentemente não é necessário impor *transactions* ou *foreign keys*, e desabilitar temporariamente esses recursos pode acelerar muito o processo de *import*. Isso pode ser feito usando o [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client, seja a partir de uma *client session*, ou invocando-o na linha de comando. Dentro de uma *client session* do [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"), você pode realizar a importação usando os seguintes comandos SQL:

```sql
SET ndb_use_transactions=0;
SET foreign_key_checks=0;

source path/to/dumpfile;

SET ndb_use_transactions=1;
SET foreign_key_checks=1;
```

Ao realizar o *import* dessa maneira, você *deve* habilitar `ndb_use_transaction` e `foreign_key_checks` novamente após a execução do comando `source` do [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client. Caso contrário, é possível que comandos posteriores na mesma *session* também sejam executados sem impor *transactions* ou restrições de *foreign key*, o que pode levar à inconsistência de dados.

A partir do *shell* do sistema, você pode importar o arquivo SQL, desabilitando a imposição de *transaction* e *foreign keys*, usando o [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client com a opção [`--init-command`](mysql-command-options.html#option_mysql_init-command), assim:

```sql
$> mysql --init-command='SET ndb_use_transactions=0; SET foreign_key_checks=0' < path/to/dumpfile
```

Também é possível carregar os dados em uma tabela [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") e convertê-la para usar o NDB *storage engine* posteriormente usando ALTER TABLE ... ENGINE NDB). Você deve considerar, especialmente para muitas tabelas, que isso pode exigir várias operações desse tipo; além disso, se *foreign keys* forem usadas, você deve observar cuidadosamente a ordem dos comandos `ALTER TABLE`, devido ao fato de que *foreign keys* não funcionam entre tabelas que usam diferentes MySQL *storage engines*.

Você deve estar ciente de que os métodos descritos anteriormente nesta seção não são otimizados para conjuntos de dados muito grandes (*very large data sets*) ou *transactions* grandes. Caso um aplicativo realmente necessite de grandes *transactions* ou muitas *transactions* concorrentes como parte da operação normal, você pode querer aumentar o valor do parâmetro de configuração de *data node* [`MaxNoOfConcurrentOperations`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofconcurrentoperations), que reserva mais memória para permitir que um *data node* assuma uma *transaction* se seu coordenador de *transaction* parar inesperadamente.

Você também pode querer fazer isso ao realizar operações [`DELETE`](delete.html "13.2.2 DELETE Statement") ou [`UPDATE`](update.html "13.2.11 UPDATE Statement") em massa em tabelas NDB Cluster. Se possível, tente fazer com que os aplicativos executem essas operações em blocos (*chunks*), por exemplo, adicionando `LIMIT` a tais comandos.

Se uma operação de *import* de dados não for concluída com sucesso, por qualquer motivo, você deve estar preparado para realizar qualquer limpeza necessária, incluindo possivelmente um ou mais comandos [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement"), comandos [`DROP DATABASE`](drop-database.html "13.1.22 DROP DATABASE Statement"), ou ambos. Deixar de fazer isso pode deixar o Database em um estado inconsistente.