#### 13.7.5.33 Mostrar anfitriões escravos Declaração

```sql
SHOW SLAVE HOSTS
```

Exibe uma lista de réplicas atualmente registradas com a fonte.

A execução da instrução `SHOW SLAVE HOSTS` deve ser realizada em um servidor que atua como fonte de replicação. A instrução `SHOW SLAVE HOSTS` requer o privilégio `REPLICATION SLAVE`. A declaração exibe informações sobre os servidores que estão ou estiveram conectados como réplicas, com cada linha do resultado correspondendo a um servidor de réplica, conforme mostrado aqui:

```sql
mysql> SHOW SLAVE HOSTS;
+------------+-----------+------+-----------+--------------------------------------+
| Server_id  | Host      | Port | Master_id | Slave_UUID                           |
+------------+-----------+------+-----------+--------------------------------------+
|  192168010 | iconnect2 | 3306 | 192168011 | 14cb6624-7f93-11e0-b2c0-c80aa9429562 |
| 1921680101 | athena    | 3306 | 192168011 | 07af4990-f41f-11df-a566-7ac56fdaf645 |
+------------+-----------+------+-----------+--------------------------------------+
```

- `Server_id`: O ID único do servidor da replica, conforme configurado no arquivo de opções do servidor de replicação ou na linha de comando com `--server-id=valor`.

- `Host`: O nome do host do servidor replica conforme especificado na replica com a opção `--report-host`. Isso pode diferir do nome da máquina conforme configurado no sistema operacional.

- `Usuário`: O nome do usuário do servidor de replicação, conforme especificado na replicação com a opção `--report-user`. A saída da declaração inclui esta coluna apenas se o servidor de origem for iniciado com a opção `--show-slave-auth-info`.

- `Senha`: A senha do servidor replicador, conforme especificado no replicador com a opção `--report-password`. A saída da declaração inclui esta coluna apenas se o servidor de origem for iniciado com a opção `--show-slave-auth-info`.

- `Port`: O porto na fonte para o qual o servidor de replicação está ouvindo, conforme especificado na replicação com a opção `--report-port`.

  Um zero nesta coluna significa que o porta de replicação (`--report-port`) não foi definido.

- `Master_id`: O ID único do servidor da fonte do qual o servidor de replicação está replicando. Este é o ID do servidor no qual o comando `SHOW SLAVE HOSTS` é executado, portanto, este mesmo valor é listado para cada linha no resultado.

- `Slave_UUID`: O ID único global desta replica, conforme gerado na replica e encontrado no arquivo `auto.cnf` da replica.
