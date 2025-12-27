#### 19.1.5.3 Adicionando Fontes Baseadas em GTID a uma Replicação Múltipla

Esses passos pressupõem que você habilitou GTIDs para transações nas fontes usando `gtid_mode=ON`, criou um usuário de replicação, garantiu que a replica esteja usando repositórios de metadados do aplicador de replicação baseados em `TABLE` e, se apropriado, provisionou a replica com dados das fontes.

Use `CHANGE REPLICATION SOURCE TO` para configurar um canal de replicação para cada fonte na replica (veja a Seção 19.2.2, “Canais de Replicação”). A cláusula `FOR CHANNEL` é usada para especificar o canal. Para a replicação baseada em GTID, o autoposicionamento de GTID é usado para sincronizar com a fonte (veja a Seção 19.1.3.3, “Autoposicionamento de GTID”). A opção `SOURCE_AUTO_POSITION` é definida para especificar o uso do autoposicionamento.

Por exemplo, para adicionar `source1` e `source2` como fontes para a replica, use o cliente **mysql** para emitir a declaração duas vezes na replica, assim:

```
mysql> CHANGE REPLICATION SOURCE TO SOURCE_HOST="source1", SOURCE_USER="ted", \
SOURCE_PASSWORD="password", SOURCE_AUTO_POSITION=1 FOR CHANNEL "source_1";
mysql> CHANGE REPLICATION SOURCE TO SOURCE_HOST="source2", SOURCE_USER="ted", \
SOURCE_PASSWORD="password", SOURCE_AUTO_POSITION=1 FOR CHANNEL "source_2";
```

Para fazer a replica replicar apenas o banco de dados `db1` da `source1` e apenas o banco de dados `db2` da `source2`, use o cliente **mysql** para emitir a declaração `CHANGE REPLICATION FILTER` para cada canal, assim:

```
mysql> CHANGE REPLICATION FILTER REPLICATE_WILD_DO_TABLE = ('db1.%') FOR CHANNEL "source_1";
mysql> CHANGE REPLICATION FILTER REPLICATE_WILD_DO_TABLE = ('db2.%') FOR CHANNEL "source_2";
```

Para obter a sintaxe completa da declaração `CHANGE REPLICATION FILTER` e outras opções disponíveis, consulte a Seção 15.4.2.1, “Declaração CHANGE REPLICATION FILTER”.