#### 16.1.5.3 Adicionando Sources Baseados em GTID a uma Multi-Source Replica

Estes passos assumem que você habilitou GTIDs para transações nos Source servers de Replication usando [`gtid_mode=ON`](replication-options-gtids.html#sysvar_gtid_mode), criou um usuário de Replication, garantiu que a Replica está usando repositórios de metadados de Replication baseados em `TABLE`, e provisionou a Replica com dados dos Sources, se apropriado.

Use a instrução [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") para configurar um Replication Channel para cada Source na Replica (veja [Seção 16.2.2, “Replication Channels”](replication-channels.html "16.2.2 Replication Channels")). A cláusula `FOR CHANNEL` é usada para especificar o Channel. Para Replication baseada em GTID, o GTID auto-positioning é usado para sincronizar com o Source (veja [Seção 16.1.3.3, “GTID Auto-Positioning”](replication-gtids-auto-positioning.html "16.1.3.3 GTID Auto-Positioning")). A opção `MASTER_AUTO_POSITION` é definida para especificar o uso do auto-positioning.

Por exemplo, para adicionar `source1` e `source2` como Sources à Replica, use o cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") para emitir a instrução [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") duas vezes na Replica, assim:

```sql
mysql> CHANGE MASTER TO MASTER_HOST="source1", MASTER_USER="ted", \
MASTER_PASSWORD="password", MASTER_AUTO_POSITION=1 FOR CHANNEL "source_1";
mysql> CHANGE MASTER TO MASTER_HOST="source2", MASTER_USER="ted", \
MASTER_PASSWORD="password", MASTER_AUTO_POSITION=1 FOR CHANNEL "source_2";
```

Para a sintaxe completa da instrução [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") e outras opções disponíveis, veja [Seção 13.4.2.1, “CHANGE MASTER TO Statement”](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement").