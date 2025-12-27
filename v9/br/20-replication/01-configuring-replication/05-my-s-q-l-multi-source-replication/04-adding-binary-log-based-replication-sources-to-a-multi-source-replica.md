#### 19.1.5.4 Adicionando fontes de replicação baseadas em log binário a uma replica de múltiplas fontes

Esses passos assumem que o registro binário está habilitado na fonte (o que é o padrão), a replica está usando repositórios de metadados do aplicativo de replicação baseados em `TABLE` (o que é o padrão no MySQL 9.5) e que você habilitou um usuário de replicação e anotou o nome e a posição atuais do arquivo de log binário.

Use uma declaração `CHANGE REPLICATION SOURCE TO` para configurar um canal de replicação para cada fonte na replica (consulte a Seção 19.2.2, “Canais de replicação”). A cláusula `FOR CHANNEL` é usada para especificar o canal. Por exemplo, para adicionar `source1` e `source2` como fontes para a replica, use o cliente **mysql** para emitir a declaração duas vezes na replica, assim:

```
mysql> CHANGE REPLICATION SOURCE TO SOURCE_HOST="source1", SOURCE_USER="ted", SOURCE_PASSWORD="password", \
SOURCE_LOG_FILE='source1-bin.000006', SOURCE_LOG_POS=628 FOR CHANNEL "source_1";

mysql> CHANGE REPLICATION SOURCE TO SOURCE_HOST="source2", SOURCE_USER="ted", SOURCE_PASSWORD="password", \
SOURCE_LOG_FILE='source2-bin.000018', SOURCE_LOG_POS=104 FOR CHANNEL "source_2";
```

Para fazer a replica replicar apenas o banco de dados `db1` da `source1` e apenas o banco de dados `db2` da `source2`, use o cliente **mysql** para emitir a declaração `CHANGE REPLICATION FILTER` para cada canal, assim:

```
mysql> CHANGE REPLICATION FILTER REPLICATE_WILD_DO_TABLE = ('db1.%') FOR CHANNEL "source_1";
mysql> CHANGE REPLICATION FILTER REPLICATE_WILD_DO_TABLE = ('db2.%') FOR CHANNEL "source_2";
```

Para obter a sintaxe completa da declaração `CHANGE REPLICATION FILTER` e outras opções disponíveis, consulte a Seção 15.4.2.1, “Declaração CHANGE REPLICATION FILTER”.