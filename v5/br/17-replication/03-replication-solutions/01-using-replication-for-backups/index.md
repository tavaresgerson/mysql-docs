### 16.3.1 Usando Replication para Backups

[16.3.1.1 Realizando o Backup de uma Replica Usando mysqldump](replication-solutions-backups-mysqldump.html)

[16.3.1.2 Realizando o Backup de Dados Raw de uma Replica](replication-solutions-backups-rawdata.html)

[16.3.1.3 Realizando o Backup de um Source ou Replica Tornando-o Read Only](replication-solutions-backups-read-only.html)

Para usar Replication como uma solução de Backup, replique dados do Source para uma Replica e, em seguida, realize o Backup da Replica. A Replica pode ser pausada e desligada sem afetar a operação em execução do Source, permitindo que você produza um snapshot efetivo de dados “live” que, de outra forma, exigiria que o Source fosse desligado.

A forma como você realiza o Backup de um Database depende do seu tamanho e se você está fazendo Backup apenas dos dados, ou dos dados e do estado da Replica para que você possa reconstruir a Replica no caso de uma falha. Portanto, existem duas opções:

* Se você estiver usando Replication como uma solução para permitir o Backup dos dados no Source, e o tamanho do seu Database não for muito grande, a ferramenta [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") pode ser adequada. Consulte [Section 16.3.1.1, “Realizando o Backup de uma Replica Usando mysqldump”](replication-solutions-backups-mysqldump.html "16.3.1.1 Backing Up a Replica Using mysqldump").

* Para Databases maiores, onde [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") seria impraticável ou ineficiente, você pode, em vez disso, realizar o Backup dos arquivos de dados raw. Usar a opção de arquivos de dados raw também significa que você pode fazer o Backup dos Binary e Relay Logs que permitem recriar a Replica no caso de uma falha da Replica. Para mais informações, consulte [Section 16.3.1.2, “Realizando o Backup de Dados Raw de uma Replica”](replication-solutions-backups-rawdata.html "16.3.1.2 Backing Up Raw Data from a Replica").

Outra estratégia de Backup, que pode ser usada tanto para servidores Source quanto Replica, é colocar o servidor em um estado read-only. O Backup é realizado contra o servidor read-only, que então é alterado de volta para seu status operacional read/write usual. Consulte [Section 16.3.1.3, “Realizando o Backup de um Source ou Replica Tornando-o Read Only”](replication-solutions-backups-read-only.html "16.3.1.3 Backing Up a Source or Replica by Making It Read Only").
