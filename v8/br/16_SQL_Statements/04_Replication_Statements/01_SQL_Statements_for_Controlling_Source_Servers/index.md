### 15.4.1 Instruções SQL para controlar servidores de origem

15.4.1.1 Declaração de PURGE BINARY LOGS

15.4.1.2 Declaração de RESET MASTER

15.4.1.3 Declaração sql\_log\_bin do SET

Esta seção discute declarações para gerenciar servidores de origem de replicação. A seção 15.4.2, “Declarações SQL para controle de servidores de replicação”, discute declarações para gerenciar servidores de replicação.

Além das declarações descritas aqui, as seguintes declarações `SHOW` são usadas com servidores de origem na replicação. Para obter informações sobre essas declarações, consulte a Seção 15.7.7, “Declarações SHOW”.

- `SHOW BINARY LOGS`
- `SHOW BINLOG EVENTS`
- `SHOW MASTER STATUS`
- `SHOW REPLICAS` (ou antes do MySQL 8.0.22, `SHOW SLAVE HOSTS`)
