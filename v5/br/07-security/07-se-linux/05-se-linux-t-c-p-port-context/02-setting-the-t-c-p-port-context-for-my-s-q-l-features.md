#### 6.7.5.2 Configurando o contexto da porta TCP para recursos do MySQL

Se você ativar certas funcionalidades do MySQL, talvez precise definir o contexto de porta TCP do SELinux para portas adicionais usadas por essas funcionalidades. Se as portas usadas pelas funcionalidades do MySQL não tiverem o contexto correto do SELinux, as funcionalidades podem não funcionar corretamente.

As seções a seguir descrevem como definir contextos de porta para recursos do MySQL. Geralmente, o mesmo método pode ser usado para definir o contexto de porta para qualquer recurso do MySQL. Para obter informações sobre as portas usadas pelos recursos do MySQL, consulte o Referência de Portas do MySQL.

##### Definindo o contexto da porta TCP para a replicação em grupo

Se o SELinux estiver ativado, você deve definir o contexto da porta para a porta de comunicação da replicação de grupo, que é definida pela variável `group_replication_local_address`. O **mysqld** deve ser capaz de se conectar à porta de comunicação da replicação de grupo e ouvir nela. O InnoDB Cluster depende da replicação de grupo, portanto, isso se aplica igualmente às instâncias usadas em um clúster. Para ver as portas atualmente usadas pelo MySQL, execute:

```sql
semanage port -l | grep mysqld
```

Supondo que o porto de comunicação da replicação em grupo seja 33061, defina o contexto do porto emitindo:

```sql
semanage port -a -t mysqld_port_t -p tcp 33061
```

##### Definindo o contexto da porta TCP para a Armazenamento de Documentos

Se o SELinux estiver ativado, você deve definir o contexto da porta para a porta de comunicação usada pelo X Plugin, que é definida pela variável `mysqlx_port`. O **mysqld** deve ser capaz de se conectar à porta de comunicação do X Plugin e ouvir nela.

Supondo que a porta de comunicação do X Plugin seja 33060, defina o contexto da porta emitindo:

```sql
semanage port -a -t mysqld_port_t -p tcp 33060
```
