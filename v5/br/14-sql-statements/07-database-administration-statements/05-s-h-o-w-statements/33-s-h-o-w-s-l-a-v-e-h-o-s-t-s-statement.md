#### 13.7.5.33 Instrução SHOW SLAVE HOSTS

```sql
SHOW SLAVE HOSTS
```

Exibe uma lista de replicas atualmente registradas no source.

`SHOW SLAVE HOSTS` deve ser executado em um servidor que atua como um source de replicação. `SHOW SLAVE HOSTS` requer o privilégio [`REPLICATION SLAVE`](privileges-provided.html#priv_replication-slave). A instrução exibe informações sobre servidores que estão ou estiveram conectados como replicas, com cada linha do resultado correspondendo a um servidor replica, conforme mostrado aqui:

```sql
mysql> SHOW SLAVE HOSTS;
+------------+-----------+------+-----------+--------------------------------------+
| Server_id  | Host      | Port | Master_id | Slave_UUID                           |
+------------+-----------+------+-----------+--------------------------------------+
|  192168010 | iconnect2 | 3306 | 192168011 | 14cb6624-7f93-11e0-b2c0-c80aa9429562 |
| 1921680101 | athena    | 3306 | 192168011 | 07af4990-f41f-11df-a566-7ac56fdaf645 |
+------------+-----------+------+-----------+--------------------------------------+
```

* `Server_id`: O ID único do servidor replica, conforme configurado no arquivo de opções do servidor replica, ou na linha de comando com [`--server-id=value`](replication-options.html#sysvar_server_id).

* `Host`: O nome do host do servidor replica, conforme especificado no replica com a opção [`--report-host`](replication-options-replica.html#sysvar_report_host). Isso pode ser diferente do nome da máquina configurado no sistema operacional.

* `User`: O nome de usuário do servidor replica, conforme especificado no replica com a opção [`--report-user`](replication-options-replica.html#sysvar_report_user). A saída da instrução inclui esta coluna apenas se o servidor source for iniciado com a opção [`--show-slave-auth-info`](replication-options-source.html#option_mysqld_show-slave-auth-info).

* `Password`: A senha do servidor replica, conforme especificado no replica com a opção [`--report-password`](replication-options-replica.html#sysvar_report_password). A saída da instrução inclui esta coluna apenas se o servidor source for iniciado com a opção [`--show-slave-auth-info`](replication-options-source.html#option_mysqld_show-slave-auth-info).

* `Port`: A porta no source para a qual o servidor replica está escutando, conforme especificado no replica com a opção [`--report-port`](replication-options-replica.html#sysvar_report_port).

  Um zero nesta coluna significa que a porta do replica ([`--report-port`](replication-options-replica.html#sysvar_report_port)) não foi configurada.

* `Master_id`: O ID único do servidor source a partir do qual o servidor replica está replicando. Este é o Server ID do servidor no qual `SHOW SLAVE HOSTS` é executado, então este mesmo valor é listado para cada linha no resultado.

* `Slave_UUID`: O ID globalmente único (UUID) desta replica, conforme gerado no replica e encontrado no arquivo `auto.cnf` do replica.