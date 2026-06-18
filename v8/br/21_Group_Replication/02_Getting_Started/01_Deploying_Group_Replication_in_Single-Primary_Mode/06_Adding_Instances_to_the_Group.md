#### 20.2.1.6 Adicionar instâncias ao grupo

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
binlog_checksum=NONE           # Not needed in 8.0.21 or later

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

Semelhante ao procedimento para o servidor s1, com a opção de arquivo em uso, você inicia o servidor. Em seguida, configure as credenciais de recuperação distribuída da seguinte forma. As instruções são as mesmas usadas ao configurar o servidor s1, pois o usuário é compartilhado dentro do grupo. Esse membro precisa ter o mesmo usuário de replicação configurado na Seção 20.2.1.3, “Credenciais de Usuário para Recuperação Distribuída”. Se você está confiando na recuperação distribuída para configurar o usuário em todos os membros, quando o s2 se conectar ao s1 mestre, o usuário de replicação é replicado ou clonado para o s1. Se você não tiver o registro binário habilitado quando configurar as credenciais do usuário no s1 e uma operação de clonagem remota não for usada para transferência de estado, você deve criar o usuário de replicação no s2. Nesse caso, conecte-se ao s2 e execute:

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

Se você estiver fornecendo credenciais de usuário usando uma declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO`, emita a seguinte declaração após essa:

```
CHANGE MASTER TO MASTER_USER='rpl_user', MASTER_PASSWORD='password' \\
	FOR CHANNEL 'group_replication_recovery';
```

Em MySQL 8.0.23 e versões posteriores, use o seguinte:

```
CHANGE REPLICATION SOURCE TO SOURCE_USER='rpl_user', SOURCE_PASSWORD='password' \\
	FOR CHANNEL 'group_replication_recovery';
```

Dica

Se você estiver usando o plugin de autenticação com cache SHA-2, o padrão no MySQL 8, consulte a Seção 20.6.3.1.1, “Usuário de Replicação com o Plugin de Autenticação com Cache SHA-2”.

Se necessário, instale o plugin de replicação de grupo, consulte a Seção 20.2.1.4, “Lançamento da replicação de grupo”.

Inicie a replicação em grupo e o s2 inicia o processo de junção ao grupo.

```
mysql> START GROUP_REPLICATION;
```

Se você estiver fornecendo credenciais de usuário para recuperação distribuída como parte do `START GROUP_REPLICATION` (MySQL 8.0.21 ou posterior), você pode fazer isso da seguinte maneira:

```
mysql> START GROUP_REPLICATION USER='rpl_user', PASSWORD='password';
```

Ao contrário das etapas anteriores, que eram as mesmas que as executadas no s1, aqui há uma diferença: você *não* precisa inicializar o grupo porque o grupo já existe. Em outras palavras, no s2, `group_replication_bootstrap_group` está definido como `OFF`, e você não emite `SET GLOBAL group_replication_bootstrap_group=ON;` antes de iniciar a Replicação de Grupo, porque o grupo já foi criado e inicializado pelo servidor s1. Neste ponto, o servidor s2 só precisa ser adicionado ao grupo já existente.

Dica

Quando a Replicação em Grupo começa com sucesso e o servidor se junta ao grupo, ele verifica a variável `super_read_only`. Ao definir `super_read_only` para ON no arquivo de configuração do membro, você pode garantir que os servidores que falham ao iniciar a Replicação em Grupo por qualquer motivo não aceitem transações. Se o servidor deve se juntar ao grupo como uma instância de leitura/escrita, por exemplo, como o primário em um grupo de primário único ou como um membro de um grupo de múltiplos primários, quando `super_read_only` é definido para `ON`, ele é definido para `OFF` ao se juntar ao grupo.

Verificando novamente a tabela `performance_schema.replication_group_members`, vemos que agora há dois servidores `ONLINE` no grupo.

```
mysql> SELECT * FROM performance_schema.replication_group_members;
+---------------------------+--------------------------------------+-------------+-------------+--------------+-------------+----------------+----------------------------+
| CHANNEL_NAME              | MEMBER_ID                            | MEMBER_HOST | MEMBER_PORT | MEMBER_STATE | MEMBER_ROLE | MEMBER_VERSION | MEMBER_COMMUNICATION_STACK |
+---------------------------+--------------------------------------+-------------+-------------+--------------+-------------+----------------+----------------------------+
| group_replication_applier | 395409e1-6dfa-11e6-970b-00212844f856 |   s1        |        3306 | ONLINE       | PRIMARY     | 8.0.44          | XCom                       |
| group_replication_applier | ac39f1e6-6dfa-11e6-a69d-00212844f856 |   s2        |        3306 | ONLINE       | SECONDARY   | 8.0.44          | XCom                       |
+---------------------------+--------------------------------------+-------------+-------------+--------------+-------------+----------------+----------------------------+
```

Quando o s2 tentou se juntar ao grupo, a Seção 20.5.4, “Recuperação Distribuída”, garantiu que o s2 aplicasse as mesmas transações que o s1 havia aplicado. Uma vez que esse processo foi concluído, o s2 pôde se juntar ao grupo como membro, e, neste ponto, ele é marcado como `ONLINE`. Em outras palavras, ele deve ter se atualizado automaticamente com o servidor s1. Uma vez que o s2 esteja em `ONLINE`, ele então começa a processar transações com o grupo. Verifique se o s2 realmente se sincronizou com o servidor s1 da seguinte forma.

```
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
| binlog.000001 |    4 | Format_desc    |         2 |         123 | Server ver: 8.0.44-log, Binlog ver: 4                              |
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
```

Como visto acima, o segundo servidor foi adicionado ao grupo e replicou automaticamente as alterações do servidor s1. Em outras palavras, as transações aplicadas em s1 até o momento em que s2 se juntou ao grupo foram replicadas para s2.

##### 20.2.1.6.2 Adicionar instâncias adicionais

Adicionar instâncias adicionais ao grupo é essencialmente a mesma sequência de etapas que adicionar o segundo servidor, exceto que a configuração precisa ser alterada, como foi necessário para o servidor s2. Para resumir as operações necessárias:

1. Crie o arquivo de configuração.

   ```
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
   binlog_checksum=NONE           # Not needed from 8.0.21

   #
   # Group Replication configuration
   #
   plugin_load_add='group_replication.so'
   group_replication_group_name="aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
   group_replication_start_on_boot=off
   group_replication_local_address= "s3:33061"
   group_replication_group_seeds= "s1:33061,s2:33061,s3:33061"
   group_replication_bootstrap_group= off
   ```

2. Inicie o servidor e conecte-se a ele. Crie o usuário de replicação para recuperação distribuída.

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

   Se você estiver fornecendo credenciais de usuário usando uma declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO`, emita a seguinte declaração após essa:

   ```
   CHANGE MASTER TO MASTER_USER='rpl_user', MASTER_PASSWORD='password' \\
   	FOR CHANNEL 'group_replication_recovery';
   ```

   No MySQL 8.0.23 ou posterior, use esta declaração em vez disso:

   ```
   CHANGE REPLICATION SOURCE TO SOURCE_USER='rpl_user', SOURCE_PASSWORD='password' \\
   	FOR CHANNEL 'group_replication_recovery';
   ```

3. Instale o plugin de replicação de grupo, se necessário, da seguinte forma:

   ```
   mysql> INSTALL PLUGIN group_replication SONAME 'group_replication.so';
   ```

4. Iniciar a replicação em grupo:

   ```
   mysql> START GROUP_REPLICATION;
   ```

   Se você estiver fornecendo credenciais de usuário para recuperação distribuída na declaração `START GROUP_REPLICATION` (MySQL 8.0.21 ou posterior), você pode fazer isso da seguinte maneira:

   ```
   mysql> START GROUP_REPLICATION USER='rpl_user', PASSWORD='password';
   ```

Neste ponto, o servidor s3 foi inicializado e está em execução, se juntou ao grupo e alcançou os outros servidores do grupo. Consultar novamente a tabela `performance_schema.replication_group_members` confirma que este é o caso.

```
mysql> SELECT * FROM performance_schema.replication_group_members;
+---------------------------+--------------------------------------+-------------+-------------+--------------+-------------+----------------+----------------------------+
| CHANNEL_NAME              | MEMBER_ID                            | MEMBER_HOST | MEMBER_PORT | MEMBER_STATE | MEMBER_ROLE | MEMBER_VERSION | MEMBER_COMMUNICATION_STACK |
+---------------------------+--------------------------------------+-------------+-------------+--------------+-------------+----------------+----------------------------+
| group_replication_applier | 395409e1-6dfa-11e6-970b-00212844f856 |   s1        |        3306 | ONLINE       | PRIMARY     | 8.0.44          | XCom                       |
| group_replication_applier | 7eb217ff-6df3-11e6-966c-00212844f856 |   s3        |        3306 | ONLINE       | SECONDARY   | 8.0.44          | XCom                       |
| group_replication_applier | ac39f1e6-6dfa-11e6-a69d-00212844f856 |   s2        |        3306 | ONLINE       | SECONDARY   | 8.0.44          | XCom                       |
+---------------------------+--------------------------------------+-------------+-------------+--------------+-------------+----------------+----------------------------+
```

Ao emitir a mesma consulta no servidor s2 ou no servidor s1, o resultado é o mesmo. Além disso, você pode verificar que o servidor s3 já está atualizado:

```
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
| binlog.000001 |    4 | Format_desc    |         3 |         123 | Server ver: 8.0.44-log, Binlog ver: 4                              |
| binlog.000001 |  123 | Previous_gtids |         3 |         150 |                                                                    |
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
| binlog.000001 |  975 | Xid            |         1 |        1002 | COMMIT /* xid=29 */                                                |
| binlog.000001 | 1002 | Gtid           |         1 |        1063 | SET @@SESSION.GTID_NEXT= 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa:5'  |
| binlog.000001 | 1063 | Query          |         1 |        1122 | BEGIN                                                              |
| binlog.000001 | 1122 | View_change    |         1 |        1261 | view_id=14724832985483517:2                                        |
| binlog.000001 | 1261 | Query          |         1 |        1326 | COMMIT                                                             |
| binlog.000001 | 1326 | Gtid           |         1 |        1387 | SET @@SESSION.GTID_NEXT= 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa:6'  |
| binlog.000001 | 1387 | Query          |         1 |        1446 | BEGIN                                                              |
| binlog.000001 | 1446 | View_change    |         1 |        1585 | view_id=14724832985483517:3                                        |
| binlog.000001 | 1585 | Query          |         1 |        1650 | COMMIT                                                             |
+---------------+------+----------------+-----------+-------------+--------------------------------------------------------------------+
```
