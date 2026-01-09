#### 16.1.5.1 Configurando a Replicação de Múltiplas Fontes

Uma topologia de replicação de múltiplas fontes requer pelo menos duas fontes e uma replica configurada. Nestes tutoriais, assumimos que você tem duas fontes `source1` e `source2` e uma replica `replicahost`. A replica replica um banco de dados de cada uma das fontes, `db1` de `source1` e `db2` de `source2`.

Fontes em uma topologia de replicação de múltiplas fontes podem ser configuradas para usar a replicação baseada em GTID ou a replicação baseada na posição do log binário. Veja Seção 16.1.3.4, “Configurando a Replicação Usando GTIDs” para saber como configurar uma fonte usando replicação baseada em GTID. Veja Seção 16.1.2.1, “Configurando a Configuração da Fonte de Replicação” para saber como configurar uma fonte usando replicação baseada na posição do arquivo.

As réplicas em uma topologia de replicação de múltiplas fontes requerem repositórios `TABLE` para o repositório de metadados de conexão e o repositório de metadados do aplicador, conforme especificado pelas variáveis de sistema `[master_info_repository]` (opções de replicação-replica.html#sysvar_master_info_repository) e `relay_log_info_repository` (opções de replicação-replica.html#sysvar_relay_log_info_repository). A replicação de múltiplas fontes não é compatível com repositórios `FILE`.

Para modificar uma replica existente que está usando repositórios `FILE` para os repositórios de metadados de replicação e fazer com que eles usem repositórios `TABLE`, você pode converter os repositórios existentes dinamicamente usando o cliente **mysql** para emitir as seguintes instruções na replica:

```sql
mysql> STOP SLAVE;
mysql> SET GLOBAL master_info_repository = 'TABLE';
mysql> SET GLOBAL relay_log_info_repository = 'TABLE';
```

Crie uma conta de usuário adequada em todos os servidores de origem de replicação que a replica possa usar para se conectar. Você pode usar a mesma conta em todas as fontes ou uma conta diferente em cada uma. Se você criar uma conta apenas para fins de replicação, essa conta precisa apenas do privilégio `REPLICATION SLAVE`. Por exemplo, para configurar um novo usuário, `ted`, que possa se conectar a partir da replica `replicahost`, use o cliente **mysql** para emitir essas instruções em cada uma das fontes:

```sql
mysql> CREATE USER 'ted'@'replicahost' IDENTIFIED BY 'password';
mysql> GRANT REPLICATION SLAVE ON *.* TO 'ted'@'replicahost';
```

Para mais detalhes, consulte Seção 16.1.2.2, “Criando um Usuário para Replicação”.
