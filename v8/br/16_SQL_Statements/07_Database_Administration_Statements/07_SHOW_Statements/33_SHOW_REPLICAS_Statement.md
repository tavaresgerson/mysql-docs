#### 15.7.7.33. EXIBIR REPLICAS Declaração

```
{SHOW REPLICAS}
```

Exibe uma lista de réplicas atualmente registradas com a fonte. A partir do MySQL 8.0.22, use `SHOW REPLICAS` no lugar de `SHOW SLAVE HOSTS`, que é desatualizado a partir dessa versão. Em versões anteriores ao MySQL 8.0.22, use `SHOW SLAVE HOSTS`. `SHOW REPLICAS` requer o privilégio `REPLICATION SLAVE`.

`SHOW REPLICAS` deve ser executado em um servidor que atua como fonte de replicação. A declaração exibe informações sobre os servidores que estão ou estiveram conectados como réplicas, com cada linha do resultado correspondendo a um servidor de réplica, conforme mostrado aqui:

```
mysql> SHOW REPLICAS;
+------------+-----------+------+-----------+--------------------------------------+
| Server_id  | Host      | Port | Source_id | Replica_UUID                         |
+------------+-----------+------+-----------+--------------------------------------+
|         10 | iconnect2 | 3306 |         3 | 14cb6624-7f93-11e0-b2c0-c80aa9429562 |
|         21 | athena    | 3306 |         3 | 07af4990-f41f-11df-a566-7ac56fdaf645 |
+------------+-----------+------+-----------+--------------------------------------+
```

- `Server_id`: O ID único do servidor da replica, conforme configurado no arquivo de opções do servidor de replicação ou na linha de comando com `--server-id=value`.

- `Host`: O nome do host do servidor replica, conforme especificado na replica com a opção `--report-host`. Isso pode diferir do nome da máquina conforme configurado no sistema operacional.

- `User`: O nome de usuário do servidor de replicação, conforme especificado na replica com a opção `--report-user`. A saída da declaração inclui essa coluna apenas se o servidor de origem for iniciado com a opção `--show-replica-auth-info` ou `--show-slave-auth-info`.

- `Password`: A senha do servidor de replicação, conforme especificado no servidor de replicação com a opção `--report-password`. A saída da declaração inclui essa coluna apenas se o servidor de origem for iniciado com a opção `--show-replica-auth-info` ou `--show-slave-auth-info`.

- `Port`: O porto na fonte para o qual o servidor de replicação está ouvindo, conforme especificado na replica com a opção `--report-port`.

  Um zero nesta coluna significa que o porto de replicação (`--report-port`) não foi definido.

- `Source_id`: O ID único do servidor de origem do qual o servidor de replicação está replicando. Este é o ID do servidor em que o `SHOW REPLICAS` é executado, portanto, este mesmo valor é listado para cada linha no resultado.

- `Replica_UUID`: O ID único global desta réplica, conforme gerado na réplica e encontrado no arquivo `auto.cnf` da réplica.
