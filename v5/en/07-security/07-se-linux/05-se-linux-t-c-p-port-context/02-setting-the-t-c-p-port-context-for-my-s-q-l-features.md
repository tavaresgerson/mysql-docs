#### 6.7.5.2 Configurando o Contexto da Porta TCP para Recursos do MySQL

Se você habilitar certos recursos do MySQL, pode ser necessário configurar o contexto da porta TCP do SELinux para portas adicionais usadas por esses recursos. Se as portas usadas pelos recursos do MySQL não tiverem o contexto SELinux correto, os recursos podem não funcionar corretamente.

As seções a seguir descrevem como configurar contextos de porta para recursos do MySQL. Geralmente, o mesmo método pode ser usado para configurar o contexto da porta para quaisquer recursos do MySQL. Para obter informações sobre portas usadas pelos recursos do MySQL, consulte a [MySQL Port Reference](/doc/mysql-port-reference/en/).

##### Configurando o Contexto da Porta TCP para Group Replication

Se o SELinux estiver habilitado, você deve configurar o contexto da porta para a porta de comunicação do Group Replication, que é definida pela variável [`group_replication_local_address`](group-replication-system-variables.html#sysvar_group_replication_local_address). O [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") deve ser capaz de realizar um *bind* na porta de comunicação do Group Replication e realizar o *listen* nela. O InnoDB Cluster depende do Group Replication, portanto, isso se aplica igualmente a instâncias usadas em um cluster. Para visualizar as portas atualmente usadas pelo MySQL, execute:

```sql
semanage port -l | grep mysqld
```

Assumindo que a porta de comunicação do Group Replication seja 33061, configure o contexto da porta executando:

```sql
semanage port -a -t mysqld_port_t -p tcp 33061
```

##### Configurando o Contexto da Porta TCP para Document Store

Se o SELinux estiver habilitado, você deve configurar o contexto da porta para a porta de comunicação usada pelo X Plugin, que é definida pela variável [`mysqlx_port`](x-plugin-options-system-variables.html#sysvar_mysqlx_port). O [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") deve ser capaz de realizar um *bind* na porta de comunicação do X Plugin e realizar o *listen* nela.

Assumindo que a porta de comunicação do X Plugin seja 33060, configure o contexto da porta executando:

```sql
semanage port -a -t mysqld_port_t -p tcp 33060
```