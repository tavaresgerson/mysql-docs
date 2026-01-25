#### 16.1.5.4 Adicionando uma Fonte Baseada em Binary Log a uma Replica Multi-Source

Estes passos assumem que você ativou o binary logging no servidor source de replicação usando [`--log-bin`](replication-options-binary-log.html#sysvar_log_bin), que a replica está usando repositórios de metadados de replicação baseados em `TABLE`, e que você ativou um usuário de replicação e anotou a posição atual do binary log. Você precisa saber o `MASTER_LOG_FILE` e o `MASTER_LOG_POSITION` atuais.

Use a instrução [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") para configurar um replication channel para cada source na replica (veja [Section 16.2.2, “Replication Channels”](replication-channels.html "16.2.2 Replication Channels")). A cláusula `FOR CHANNEL` é usada para especificar o channel. Por exemplo, para adicionar `source1` e `source2` como sources à replica, use o cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") para emitir a instrução [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") duas vezes na replica, desta forma:

```sql
mysql> CHANGE MASTER TO MASTER_HOST="source1", MASTER_USER="ted", MASTER_PASSWORD="password", \
MASTER_LOG_FILE='source1-bin.000006', MASTER_LOG_POS=628 FOR CHANNEL "source_1";
mysql> CHANGE MASTER TO MASTER_HOST="source2", MASTER_USER="ted", MASTER_PASSWORD="password", \
MASTER_LOG_FILE='source2-bin.000018', MASTER_LOG_POS=104 FOR CHANNEL "source_2";
```

Para a sintaxe completa da instrução [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") e outras opções disponíveis, veja [Section 13.4.2.1, “CHANGE MASTER TO Statement”](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement").