#### 20.2.1.6 Adicionando Instâncias ao Grupo

Neste ponto, o grupo tem um membro, o servidor s1, que contém alguns dados. Agora é hora de expandir o grupo adicionando os outros dois servidores configurados anteriormente.

##### 20.2.1.6.1 Adicionando uma Segunda Instância

Para adicionar uma segunda instância, o servidor s2, primeiro crie o arquivo de configuração para ele. A configuração é semelhante à usada para o servidor s1, exceto por coisas como o `server_id`.

```
[mysqld]

#
# Disable other storage engines
#
disabled_storage_engines="MyISAM,BLACKHOLE,FEDERATED,ARCHIVE,MEMORY"

#
# Replication configuration parameters
#
server_id=2
gtid_mode=ON
enforce_gtid_consistency=ON

#
# Group Replication configuration
#
plugin_load_add='group_replication.so'
group_replication_group_name="aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
group_replication_start_on_boot=off
group_replication_local_address= "s2:33061"
group_replication_group_seeds= "s1:33061,s2:33061,s3:33061"
group_replication_bootstrap_group= off
```

Semelhante ao procedimento para o servidor s1, com a opção de arquivo em uso, inicie o servidor. Em seguida, configure as credenciais de recuperação distribuída da seguinte forma. Os comandos são os mesmos usados ao configurar o servidor s1, pois o usuário é compartilhado dentro do grupo. Este membro precisa ter o mesmo usuário de replicação configurado na Seção 20.2.1.3, “Credenciais de Usuário para Recuperação Distribuída”. Se você está confiando na recuperação distribuída para configurar o usuário em todos os membros, quando o s2 se conectar ao s1, o usuário de replicação será replicado ou clonado para o s1. Se você não tiver habilitado o registro binário ao configurar as credenciais de usuário no s1 e uma operação de clonagem remota não for usada para transferência de estado, você deve criar o usuário de replicação no s2. Nesse caso, conecte-se ao s2 e execute:

```
SET SQL_LOG_BIN=0;
CREATE USER rpl_user@'%' IDENTIFIED BY 'password';
GRANT REPLICATION SLAVE ON *.* TO rpl_user@'%';
GRANT CONNECTION_ADMIN ON *.* TO rpl_user@'%';
GRANT BACKUP_ADMIN ON *.* TO rpl_user@'%';
GRANT GROUP_REPLICATION_STREAM ON *.* TO rpl_user@'%';
FLUSH PRIVILEGES;
SET SQL_LOG_BIN=1;
```

Se você estiver fornecendo credenciais de usuário usando um `CHANGE REPLICATION SOURCE TO`, execute a seguinte declaração após isso:

```
CHANGE REPLICATION SOURCE TO SOURCE_USER='rpl_user', SOURCE_PASSWORD='password' \
	FOR CHANNEL 'group_replication_recovery';
```

Dica

Se você estiver usando o plugin de autenticação de cache SHA-2 (o padrão), consulte a Seção 20.6.3.1.1, “Usuário de Replicação com o Plugin de Autenticação de Cache SHA-2”.

Se necessário, instale o plugin de Replicação de Grupo, consulte a Seção 20.2.1.4, “Iniciando a Replicação de Grupo”.

Inicie a Replicação de Grupo e o s2 inicia o processo de adição ao grupo.

```
mysql> START GROUP_REPLICATION;
```DqRRez3P2A```
mysql> START GROUP_REPLICATION USER='rpl_user', PASSWORD='password';
```BkNOf4lu8s```
mysql> SELECT * FROM performance_schema.replication_group_members;
+---------------------------+--------------------------------------+-------------+-------------+--------------+-------------+----------------+----------------------------+
| CHANNEL_NAME              | MEMBER_ID                            | MEMBER_HOST | MEMBER_PORT | MEMBER_STATE | MEMBER_ROLE | MEMBER_VERSION | MEMBER_COMMUNICATION_STACK |
+---------------------------+--------------------------------------+-------------+-------------+--------------+-------------+----------------+----------------------------+
| group_replication_applier | 395409e1-6dfa-11e6-970b-00212844f856 |   s1        |        3306 | ONLINE       | PRIMARY     | 9.5.0          | XCom                       |
| group_replication_applier | ac39f1e6-6dfa-11e6-a69d-00212844f856 |   s2        |        3306 | ONLINE       | SECONDARY   | 9.5.0          | XCom                       |
+---------------------------+--------------------------------------+-------------+-------------+--------------+-------------+----------------+----------------------------+
```VuKHbdM9KX```
mysql> SHOW DATABASES LIKE 'test';
+-----------------+
| Database (test) |
+-----------------+
| test            |
+-----------------+

mysql> SELECT * FROM test.t1;
+----+------+
| c1 | c2   |
+----+------+
|  1 | Luis |
+----+------+

mysql> SHOW BINLOG EVENTS;
+---------------+------+----------------+-----------+-------------+--------------------------------------------------------------------+
| Log_name      | Pos  | Event_type     | Server_id | End_log_pos | Info                                                               |
+---------------+------+----------------+-----------+-------------+--------------------------------------------------------------------+
| binlog.000001 |    4 | Format_desc    |         2 |         123 | Server ver: 9.5.0-log, Binlog ver: 4                              |
| binlog.000001 |  123 | Previous_gtids |         2 |         150 |                                                                    |
| binlog.000001 |  150 | Gtid           |         1 |         211 | SET @@SESSION.GTID_NEXT= 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa:1'  |
| binlog.000001 |  211 | Query          |         1 |         270 | BEGIN                                                              |
| binlog.000001 |  270 | View_change    |         1 |         369 | view_id=14724832985483517:1                                        |
| binlog.000001 |  369 | Query          |         1 |         434 | COMMIT                                                             |
| binlog.000001 |  434 | Gtid           |         1 |         495 | SET @@SESSION.GTID_NEXT= 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa:2'  |
| binlog.000001 |  495 | Query          |         1 |         585 | CREATE DATABASE test                                               |
| binlog.000001 |  585 | Gtid           |         1 |         646 | SET @@SESSION.GTID_NEXT= 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa:3'  |
| binlog.000001 |  646 | Query          |         1 |         770 | use `test`; CREATE TABLE t1 (c1 INT PRIMARY KEY, c2 TEXT NOT NULL) |
| binlog.000001 |  770 | Gtid           |         1 |         831 | SET @@SESSION.GTID_NEXT= 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa:4'  |
| binlog.000001 |  831 | Query          |         1 |         890 | BEGIN                                                              |
| binlog.000001 |  890 | Table_map      |         1 |         933 | table_id: 108 (test.t1)                                            |
| binlog.000001 |  933 | Write_rows     |         1 |         975 | table_id: 108 flags: STMT_END_F                                    |
| binlog.000001 |  975 | Xid            |         1 |        1002 | COMMIT /* xid=30 */                                                |
| binlog.000001 | 1002 | Gtid           |         1 |        1063 | SET @@SESSION.GTID_NEXT= 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa:5'  |
| binlog.000001 | 1063 | Query          |         1 |        1122 | BEGIN                                                              |
| binlog.000001 | 1122 | View_change    |         1 |        1261 | view_id=14724832985483517:2                                        |
| binlog.000001 | 1261 | Query          |         1 |        1326 | COMMIT                                                             |
+---------------+------+----------------+-----------+-------------+--------------------------------------------------------------------+
```3K0Mms0XOl```
   [mysqld]

   #
   # Disable other storage engines
   #
   disabled_storage_engines="MyISAM,BLACKHOLE,FEDERATED,ARCHIVE,MEMORY"

   #
   # Replication configuration parameters
   #
   server_id=3
   gtid_mode=ON
   enforce_gtid_consistency=ON

   #
   # Group Replication configuration
   #
   plugin_load_add='group_replication.so'
   group_replication_group_name="aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
   group_replication_start_on_boot=off
   group_replication_local_address= "s3:33061"
   group_replication_group_seeds= "s1:33061,s2:33061,s3:33061"
   group_replication_bootstrap_group= off
   ```RJEAOwQ2bl```
   SET SQL_LOG_BIN=0;
   CREATE USER rpl_user@'%' IDENTIFIED BY 'password';
   GRANT REPLICATION SLAVE ON *.* TO rpl_user@'%';
   GRANT CONNECTION_ADMIN ON *.* TO rpl_user@'%';
   GRANT BACKUP_ADMIN ON *.* TO rpl_user@'%';
   GRANT GROUP_REPLICATION_STREAM ON *.* TO rpl_user@'%';
   FLUSH PRIVILEGES;
   SET SQL_LOG_BIN=1;
   ```5NNQ3EuN98```
   mysql> CHANGE REPLICATION SOURCE TO SOURCE_USER='rpl_user',
       ->   SOURCE_PASSWORD='password'
       ->   FOR CHANNEL 'group_replication_recovery';
   ```sQLVp6LKJp```
   mysql> INSTALL PLUGIN group_replication SONAME 'group_replication.so';
   ```rmDLA6Jldb```
   mysql> START GROUP_REPLICATION;
   ```mWNyFqPQtk```
   mysql> START GROUP_REPLICATION USER='rpl_user', PASSWORD='password';
   ```GMtSzlArvC```
mysql> SELECT * FROM performance_schema.replication_group_members;
+---------------------------+--------------------------------------+-------------+-------------+--------------+-------------+----------------+----------------------------+
| CHANNEL_NAME              | MEMBER_ID                            | MEMBER_HOST | MEMBER_PORT | MEMBER_STATE | MEMBER_ROLE | MEMBER_VERSION | MEMBER_COMMUNICATION_STACK |
+---------------------------+--------------------------------------+-------------+-------------+--------------+-------------+----------------+----------------------------+
| group_replication_applier | 395409e1-6dfa-11e6-970b-00212844f856 |   s1        |        3306 | ONLINE       | PRIMARY     | 9.5.0          | XCom                       |
| group_replication_applier | 7eb217ff-6df3-11e6-966c-00212844f856 |   s3        |        3306 | ONLINE       | SECONDARY   | 9.5.0          | XCom                       |
| group_replication_applier | ac39f1e6-6dfa-11e6-a69d-00212844f856 |   s2        |        3306 | ONLINE       | SECONDARY   | 9.5.0          | XCom                       |
+---------------------------+--------------------------------------+-------------+-------------+--------------+-------------+----------------+----------------------------+
```Arux3C1Mge```