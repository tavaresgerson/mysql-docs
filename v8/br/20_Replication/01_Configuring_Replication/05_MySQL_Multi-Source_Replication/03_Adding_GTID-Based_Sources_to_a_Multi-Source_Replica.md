#### 19.1.5.3 Adicionando fontes baseadas em GTID a uma réplica de múltiplas fontes

Esses passos pressupõem que você tenha habilitado GTIDs para transações nas fontes usando `gtid_mode=ON`, criado um usuário de replicação, garantido que a replica esteja usando os repositórios de metadados do aplicativo de replicação com base em `TABLE` e, se apropriado, provisionado a replica com dados das fontes.

Use a declaração `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou a declaração `CHANGE MASTER TO` (antes do MySQL 8.0.23) para configurar um canal de replicação para cada fonte na replica (veja a Seção 19.2.2, “Canais de Replicação”). A cláusula `FOR CHANNEL` é usada para especificar o canal. Para a replicação baseada em GTID, o autoposicionamento do GTID é usado para sincronizar com a fonte (veja a Seção 19.1.3.3, “Autoposicionamento do GTID”). A opção `SOURCE_AUTO_POSITION` | `MASTER_AUTO_POSITION` é definida para especificar o uso do autoposicionamento.

Por exemplo, para adicionar `source1` e `source2` como fontes para a replica, use o cliente **mysql** para emitir a instrução duas vezes na replica, assim:

```
mysql> CHANGE MASTER TO MASTER_HOST="source1", MASTER_USER="ted", \
MASTER_PASSWORD="password", MASTER_AUTO_POSITION=1 FOR CHANNEL "source_1";
mysql> CHANGE MASTER TO MASTER_HOST="source2", MASTER_USER="ted", \
MASTER_PASSWORD="password", MASTER_AUTO_POSITION=1 FOR CHANNEL "source_2";

Or from MySQL 8.0.23:
mysql> CHANGE REPLICATION SOURCE TO SOURCE_HOST="source1", SOURCE_USER="ted", \
SOURCE_PASSWORD="password", SOURCE_AUTO_POSITION=1 FOR CHANNEL "source_1";
mysql> CHANGE REPLICATION SOURCE TO SOURCE_HOST="source2", SOURCE_USER="ted", \
SOURCE_PASSWORD="password", SOURCE_AUTO_POSITION=1 FOR CHANNEL "source_2";
```

Para fazer a replicação da réplica apenas do banco de dados `db1` de `source1`, e apenas do banco de dados `db2` de `source2`, use o cliente **mysql** para emitir a instrução `CHANGE REPLICATION FILTER` para cada canal, da seguinte forma:

```
mysql> CHANGE REPLICATION FILTER REPLICATE_WILD_DO_TABLE = ('db1.%') FOR CHANNEL "source_1";
mysql> CHANGE REPLICATION FILTER REPLICATE_WILD_DO_TABLE = ('db2.%') FOR CHANNEL "source_2";
```

Para a sintaxe completa da instrução `CHANGE REPLICATION FILTER` e outras opções disponíveis, consulte a Seção 15.4.2.2, “Instrução de Filtro de Replicação”.
