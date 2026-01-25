#### 16.1.5.1 Configurando Replicação Multi-Source

Uma topologia de replicação multi-source requer pelo menos dois sources e um replica configurados. Nestes tutoriais, assumimos que você tem dois sources, `source1` e `source2`, e um replica, `replicahost`. O replica replica um Database de cada um dos sources, `db1` do `source1` e `db2` do `source2`.

Sources em uma topologia de replicação multi-source podem ser configurados para usar replicação baseada em GTID ou replicação baseada na posição do Binary Log. Veja [Section 16.1.3.4, “Setting Up Replication Using GTIDs”](replication-gtids-howto.html "16.1.3.4 Setting Up Replication Using GTIDs") para saber como configurar um source usando replicação baseada em GTID. Veja [Section 16.1.2.1, “Setting the Replication Source Configuration”](replication-howto-masterbaseconfig.html "16.1.2.1 Setting the Replication Source Configuration") para saber como configurar um source usando replicação baseada na posição do arquivo.

Replicas em uma topologia de replicação multi-source requerem repositórios `TABLE` para o repositório de metadados de conexão e o repositório de metadados do *applier*, conforme especificado pelas variáveis de sistema [`master_info_repository`](replication-options-replica.html#sysvar_master_info_repository) e [`relay_log_info_repository`](replication-options-replica.html#sysvar_relay_log_info_repository). Replicação multi-source não é compatível com repositórios `FILE`.

Para modificar um replica existente que está usando repositórios `FILE` para os repositórios de metadados de replicação para que use repositórios `TABLE`, você pode converter os repositórios existentes dinamicamente usando o cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") para emitir as seguintes declarações no replica:

```sql
mysql> STOP SLAVE;
mysql> SET GLOBAL master_info_repository = 'TABLE';
mysql> SET GLOBAL relay_log_info_repository = 'TABLE';
```

Crie uma conta de usuário adequada em todos os servidores source de replicação que o replica possa usar para se conectar. Você pode usar a mesma conta em todos os sources ou uma conta diferente em cada um. Se você criar uma conta apenas para fins de replicação, essa conta precisa apenas do privilégio [`REPLICATION SLAVE`](privileges-provided.html#priv_replication-slave). Por exemplo, para configurar um novo usuário, `ted`, que pode se conectar a partir do replica `replicahost`, use o cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") para emitir estas declarações em cada um dos sources:

```sql
mysql> CREATE USER 'ted'@'replicahost' IDENTIFIED BY 'password';
mysql> GRANT REPLICATION SLAVE ON *.* TO 'ted'@'replicahost';
```

Para mais detalhes, veja [Section 16.1.2.2, “Creating a User for Replication”](replication-howto-repuser.html "16.1.2.2 Creating a User for Replication").