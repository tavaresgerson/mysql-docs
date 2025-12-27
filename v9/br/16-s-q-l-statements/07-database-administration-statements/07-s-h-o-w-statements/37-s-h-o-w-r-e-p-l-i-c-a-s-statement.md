#### 15.7.7.37 Exibir Replicas

```
SHOW REPLICAS
```

Exibe uma lista de replicas atualmente registradas com a fonte. `SHOW REPLICAS` requer o privilégio `REPLICATION SLAVE`.

`SHOW REPLICAS` deve ser executado em um servidor que atua como fonte de replicação. A declaração exibe informações sobre servidores que estão ou estiveram conectados como replicas, com cada linha do resultado correspondendo a um servidor de replica, conforme mostrado aqui:

```
mysql> SHOW REPLICAS;
+------------+-----------+------+-----------+--------------------------------------+
| Server_id  | Host      | Port | Source_id | Replica_UUID                         |
+------------+-----------+------+-----------+--------------------------------------+
|         10 | iconnect2 | 3306 |         3 | 14cb6624-7f93-11e0-b2c0-c80aa9429562 |
|         21 | athena    | 3306 |         3 | 07af4990-f41f-11df-a566-7ac56fdaf645 |
+------------+-----------+------+-----------+--------------------------------------+
```

* `Server_id`: O ID de servidor único do servidor de replica, conforme configurado no arquivo de opção do servidor de replica, ou na linha de comando com `--server-id=valor`.

* `Host`: O nome do host do servidor de replica, conforme especificado no replica com a opção `--report-host`. Isso pode diferir do nome da máquina conforme configurado no sistema operacional.

* `User`: O nome de usuário do servidor de replica, conforme especificado no replica com a opção `--report-user`. A saída da declaração inclui esta coluna apenas se o servidor de origem for iniciado com a opção `--show-replica-auth-info`.

* `Password`: A senha do servidor de replica, conforme especificado no replica com a opção `--report-password`. A saída da declaração inclui esta coluna apenas se o servidor de origem for iniciado com a opção `--show-replica-auth-info`.

* `Port`: A porta na fonte para a qual o servidor de replica está ouvindo, conforme especificado no replica com a opção `--report-port`.

Um zero nesta coluna significa que a porta de replica (`--report-port`) não foi definida.

* `Source_id`: O ID de servidor único do servidor de origem do qual o servidor de replica está replicando. Este é o ID de servidor do servidor no qual `SHOW REPLICAS` é executado, então este mesmo valor é listado para cada linha no resultado.

* `Replica_UUID`: O ID único global desta replica, conforme gerado na replica e encontrado no arquivo `auto.cnf` da replica.