#### 8.7.5.2 Configurando o contexto da porta TCP para recursos do MySQL

Se você ativar certas funcionalidades do MySQL, talvez precise definir o contexto de porta TCP do SELinux para portas adicionais usadas por essas funcionalidades. Se as portas usadas pelas funcionalidades do MySQL não tiverem o contexto correto do SELinux, as funcionalidades podem não funcionar corretamente.

As seções a seguir descrevem como definir contextos de porta para recursos do MySQL. Geralmente, o mesmo método pode ser usado para definir o contexto de porta para qualquer recurso do MySQL. Para obter informações sobre as portas usadas pelos recursos do MySQL, consulte o Referência de Porta do MySQL.

De MySQL 8.0.14 a MySQL 8.0.17, o booleano `mysql_connect_any` SELinux deve ser definido como `ON`. A partir do MySQL 8.0.18, a ativação de `mysql_connect_any` não é necessária nem recomendada.

```
setsebool -P mysql_connect_any=ON
```

##### Definindo o contexto da porta TCP para a replicação em grupo

Se o SELinux estiver ativado, você deve definir o contexto da porta para a porta de comunicação da replicação de grupo, que é definida pela variável `group_replication_local_address`. O **mysqld** deve ser capaz de se conectar à porta de comunicação da replicação de grupo e ouvir nela. O InnoDB Cluster depende da replicação de grupo, então isso se aplica igualmente às instâncias usadas em um clúster. Para ver as portas atualmente usadas pelo MySQL, execute:

```
semanage port -l | grep mysqld
```

Supondo que o porto de comunicação da replicação em grupo seja 33061, defina o contexto do porto emitindo:

```
semanage port -a -t mysqld_port_t -p tcp 33061
```

##### Definindo o contexto da porta TCP para a Armazenamento de Documentos

Se o SELinux estiver ativado, você deve definir o contexto da porta para a porta de comunicação usada pelo X Plugin, que é definida pela variável `mysqlx_port`. O **mysqld** deve ser capaz de se conectar à porta de comunicação do X Plugin e ouvir nela.

Supondo que a porta de comunicação do X Plugin seja 33060, defina o contexto da porta emitindo:

```
semanage port -a -t mysqld_port_t -p tcp 33060
```

##### Definindo o contexto da porta TCP para o roteador MySQL

Se o SELinux estiver ativado, você deve definir o contexto de porta para as portas de comunicação usadas pelo MySQL Router. Supondo que as portas de comunicação adicionais usadas pelo MySQL Router sejam as portas padrão 6446, 6447, 64460 e 64470, em cada instância, defina o contexto de porta emitindo:

```
semanage port -a -t mysqld_port_t -p tcp 6446
semanage port -a -t mysqld_port_t -p tcp 6447
semanage port -a -t mysqld_port_t -p tcp 64460
semanage port -a -t mysqld_port_t -p tcp 64470
```
