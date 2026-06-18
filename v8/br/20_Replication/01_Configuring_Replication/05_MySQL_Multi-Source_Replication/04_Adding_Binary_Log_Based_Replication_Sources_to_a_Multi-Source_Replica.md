#### 19.1.5.4 Adicionando fontes de replicação com registro binário à replicação de múltiplas fontes

Esses passos pressupõem que o registro binário esteja habilitado na fonte (o que é o padrão), o replicador esteja usando os repositórios de metadados do aplicativo de replicação com base em `TABLE` (o que é o padrão no MySQL 8.0) e que você tenha habilitado um usuário de replicação e anotado o nome e a posição atuais do arquivo de log binário.

Use a declaração `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou a declaração `CHANGE MASTER TO` (antes do MySQL 8.0.23) para configurar um canal de replicação para cada fonte na replica (consulte a Seção 19.2.2, “Canais de Replicação”). A cláusula `FOR CHANNEL` é usada para especificar o canal. Por exemplo, para adicionar `source1` e `source2` como fontes na replica, use o cliente **mysql** para emitir a declaração duas vezes na replica, da seguinte forma:

```
mysql> CHANGE MASTER TO MASTER_HOST="source1", MASTER_USER="ted", MASTER_PASSWORD="password", \
MASTER_LOG_FILE='source1-bin.000006', MASTER_LOG_POS=628 FOR CHANNEL "source_1";
mysql> CHANGE MASTER TO MASTER_HOST="source2", MASTER_USER="ted", MASTER_PASSWORD="password", \
MASTER_LOG_FILE='source2-bin.000018', MASTER_LOG_POS=104 FOR CHANNEL "source_2";

Or from MySQL 8.0.23:
mysql> CHANGE REPLICATION SOURCE TO SOURCE_HOST="source1", SOURCE_USER="ted", SOURCE_PASSWORD="password", \
SOURCE_LOG_FILE='source1-bin.000006', SOURCE_LOG_POS=628 FOR CHANNEL "source_1";
mysql> CHANGE REPLICATION SOURCE TO SOURCE_HOST="source2", SOURCE_USER="ted", SOURCE_PASSWORD="password", \
SOURCE_LOG_FILE='source2-bin.000018', SOURCE_LOG_POS=104 FOR CHANNEL "source_2";
```

Para fazer a replicação da réplica apenas do banco de dados `db1` de `source1`, e apenas do banco de dados `db2` de `source2`, use o cliente **mysql** para emitir a instrução `CHANGE REPLICATION FILTER` para cada canal, da seguinte forma:

```
mysql> CHANGE REPLICATION FILTER REPLICATE_WILD_DO_TABLE = ('db1.%') FOR CHANNEL "source_1";
mysql> CHANGE REPLICATION FILTER REPLICATE_WILD_DO_TABLE = ('db2.%') FOR CHANNEL "source_2";
```

Para a sintaxe completa da instrução `CHANGE REPLICATION FILTER` e outras opções disponíveis, consulte a Seção 15.4.2.2, “Instrução de Filtro de Replicação”.
