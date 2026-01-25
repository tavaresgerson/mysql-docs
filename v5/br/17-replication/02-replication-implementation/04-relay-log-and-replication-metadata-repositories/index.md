### 16.2.4 Relay Log e Repositórios de Metadata de Replication

[16.2.4.1 O Relay Log](replica-logs-relaylog.html)

[16.2.4.2 Repositórios de Metadata de Replication](replica-logs-status.html)

Um servidor replica cria diversos repositórios de informação para usar no processo de Replication:

* O *relay log*, que é escrito pelo replication I/O thread, contém as transactions lidas do binary log do servidor replication source. As transactions no relay log são aplicadas na replica pelo replication SQL thread. Para informações sobre o relay log, consulte [Seção 16.2.4.1, “O Relay Log”](replica-logs-relaylog.html "16.2.4.1 The Relay Log").

* O *connection metadata repository* da replica contém informações que o replication I/O thread precisa para se conectar ao servidor replication source e recuperar transactions do binary log da source. O connection metadata repository é escrito na `mysql.slave_master_info` table ou em um arquivo.

* O *applier metadata repository* da replica contém informações que o replication SQL thread precisa para ler e aplicar transactions do relay log da replica. O applier metadata repository é escrito na `mysql.slave_relay_log_info` table ou em um arquivo.

O connection metadata repository e o applier metadata repository são coletivamente conhecidos como replication metadata repositories. Para informações sobre eles, consulte [Seção 16.2.4.2, “Repositórios de Metadata de Replication”](replica-logs-status.html "16.2.4.2 Replication Metadata Repositories").

**Tornando a replication resiliente a paradas inesperadas.** As tables `mysql.slave_master_info` e `mysql.slave_relay_log_info` são criadas usando o storage engine transacional [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"). As atualizações para a table do applier metadata repository da replica são committed junto com as transactions, significando que a informação de progresso da replica registrada nesse repository é sempre consistente com o que foi aplicado ao Database, mesmo no caso de uma parada inesperada do servidor. Para informações sobre a combinação de configurações na replica que é mais resiliente a paradas inesperadas, consulte [Seção 16.3.2, “Lidando com uma Parada Inesperada de uma Replica”](replication-solutions-unexpected-replica-halt.html "16.3.2 Handling an Unexpected Halt of a Replica").