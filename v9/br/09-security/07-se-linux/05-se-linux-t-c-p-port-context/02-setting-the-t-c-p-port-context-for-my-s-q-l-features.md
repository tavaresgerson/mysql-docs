#### 8.7.5.2 Configurando o Contexto de Porta TCP para Recursos do MySQL

Se você habilitar certos recursos do MySQL, pode ser necessário configurar o contexto de porta TCP do SELinux para portas adicionais usadas por esses recursos. Se as portas usadas pelos recursos do MySQL não tiverem o contexto correto do SELinux, os recursos podem não funcionar corretamente.

As seções a seguir descrevem como configurar os contextos de porta para os recursos do MySQL. Geralmente, o mesmo método pode ser usado para configurar o contexto de porta para qualquer recurso do MySQL. Para obter informações sobre as portas usadas pelos recursos do MySQL, consulte o Referência de Portas do MySQL.

Para o MySQL 9.5, habilitar `mysql_connect_any` não é necessário nem recomendado.

```
setsebool -P mysql_connect_any=ON
```

##### Configurando o Contexto de Porta TCP para a Replicação de Grupo

Se o SELinux estiver habilitado, você deve configurar o contexto de porta para a porta de comunicação da Replicação de Grupo, que é definida pela variável `group_replication_local_address`. O **mysqld** deve ser capaz de se vincular à porta de comunicação da Replicação de Grupo e ouvir nela. O InnoDB Cluster depende da Replicação de Grupo, então isso se aplica igualmente às instâncias usadas em um clúster. Para ver as portas atualmente usadas pelo MySQL, execute:

```
semanage port -l | grep mysqld
```

Assumindo que a porta de comunicação da Replicação de Grupo é 33061, configure o contexto de porta executando:

```
semanage port -a -t mysqld_port_t -p tcp 33061
```

##### Configurando o Contexto de Porta TCP para o Armazenamento de Documentos

Se o SELinux estiver habilitado, você deve configurar o contexto de porta para a porta de comunicação usada pelo Plugin X, que é definida pela variável `mysqlx_port`. O **mysqld** deve ser capaz de se vincular à porta de comunicação do Plugin X e ouvir nela.

Assumindo que a porta de comunicação do Plugin X é 33060, configure o contexto de porta executando:

```
semanage port -a -t mysqld_port_t -p tcp 33060
```

##### Configurando o Contexto de Porta TCP para o Roteador do MySQL

Se o SELinux estiver ativado, você deve definir o contexto de porta para as portas de comunicação usadas pelo MySQL Router. Supondo que as portas de comunicação adicionais usadas pelo MySQL Router sejam as portas padrão 6446, 6447, 64460 e 64470, em cada instância, defina o contexto de porta emitindo:

```
semanage port -a -t mysqld_port_t -p tcp 6446
semanage port -a -t mysqld_port_t -p tcp 6447
semanage port -a -t mysqld_port_t -p tcp 64460
semanage port -a -t mysqld_port_t -p tcp 64470
```