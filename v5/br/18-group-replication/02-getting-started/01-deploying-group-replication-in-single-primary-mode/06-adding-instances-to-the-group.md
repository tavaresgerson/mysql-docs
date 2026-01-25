#### 17.2.1.6 Adicionando Instâncias ao Grupo

Neste ponto, o grupo tem um membro, o server s1, que contém alguns dados. Agora é hora de expandir o grupo adicionando os outros dois servers configurados anteriormente.

##### 17.2.1.6.1 Adicionando uma Segunda Instância

Para adicionar uma segunda instância, o server s2, primeiro crie o arquivo de configuração para ele. A configuração é semelhante à usada para o server s1, exceto por itens como o [`server_id`](replication-options.html#sysvar_server_id).

```sql
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
master_info_repository=TABLE
relay_log_info_repository=TABLE
binlog_checksum=NONE
log_slave_updates=ON
log_bin=binlog
binlog_format=ROW

#
# Group Replication configuration
#
transaction_write_set_extraction=XXHASH64
group_replication_group_name="aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
group_replication_start_on_boot=off
group_replication_local_address= "s2:33061"
group_replication_group_seeds= "s1:33061,s2:33061,s3:33061"
group_replication_bootstrap_group= off
```

De forma similar ao procedimento para o server s1, com o arquivo de opção configurado, você inicia o server. Em seguida, configure as *recovery credentials* (credenciais de recuperação) da seguinte forma. Os comandos são os mesmos usados ao configurar o server s1, já que o user é compartilhado dentro do grupo. Este membro precisa ter o mesmo *replication user* configurado na [Seção 17.2.1.3, “User Credentials”](group-replication-user-credentials.html "17.2.1.3 User Credentials"). Se você está contando com a *distributed recovery* para configurar o user em todos os membros, quando s2 se conecta ao *seed* s1, o *replication user* é replicado para s1. Se você não tinha o *binary logging* habilitado ao configurar as *user credentials* no s1, você deve criar o *replication user* no s2. Neste caso, conecte-se ao s2 e execute:

```sql
SET SQL_LOG_BIN=0;
CREATE USER rpl_user@'%' IDENTIFIED BY 'password';
GRANT REPLICATION SLAVE ON *.* TO rpl_user@'%';
SET SQL_LOG_BIN=1;
CHANGE MASTER TO MASTER_USER='rpl_user', MASTER_PASSWORD='password' \\
	FOR CHANNEL 'group_replication_recovery';
```

Se necessário, instale o Group Replication *plugin*, veja [Seção 17.2.1.4, “Launching Group Replication”](group-replication-launching.html "17.2.1.4 Launching Group Replication").

Inicie o Group Replication e s2 iniciará o processo de ingresso no grupo (joining the group).

```sql
mysql> START GROUP_REPLICATION;
```

Diferentemente dos passos anteriores que foram os mesmos executados no s1, aqui há uma diferença: você *não* precisa fazer o *bootstrap* do grupo porque o grupo já existe. Em outras palavras, no s2 [`group_replication_bootstrap_group`](group-replication-system-variables.html#sysvar_group_replication_bootstrap_group) é definido como *off*, e você não executa `SET GLOBAL group_replication_bootstrap_group=ON;` antes de iniciar o Group Replication, pois o grupo já foi criado e inicializado (*bootstrapped*) pelo server s1. Neste ponto, o server s2 só precisa ser adicionado ao grupo já existente.

Tip

Quando o Group Replication inicia com sucesso e o server ingressa no grupo, ele verifica a variável [`super_read_only`](server-system-variables.html#sysvar_super_read_only). Ao definir [`super_read_only`](server-system-variables.html#sysvar_super_read_only) como ON no arquivo de configuração do membro, você pode garantir que servers que falhem ao iniciar o Group Replication por qualquer motivo não aceitem transactions. Se o server deve ingressar no grupo como instância read-write, por exemplo, como o *primary* em um grupo *single-primary* ou como membro de um grupo *multi-primary*, quando a variável [`super_read_only`](server-system-variables.html#sysvar_super_read_only) é definida como ON, ela é alterada para OFF ao ingressar no grupo.

Verificar novamente a tabela [`performance_schema.replication_group_members`](performance-schema-replication-group-members-table.html "25.12.11.8 The replication_group_members Table") mostra que agora existem dois servers *ONLINE* no grupo.

```sql
mysql> SELECT * FROM performance_schema.replication_group_members;
+---------------------------+--------------------------------------+-------------+-------------+---------------+
| CHANNEL_NAME              | MEMBER_ID                            | MEMBER_HOST | MEMBER_PORT | MEMBER_STATE  |
+---------------------------+--------------------------------------+-------------+-------------+---------------+
| group_replication_applier | 395409e1-6dfa-11e6-970b-00212844f856 |   s1        |        3306 | ONLINE        |
| group_replication_applier | ac39f1e6-6dfa-11e6-a69d-00212844f856 |   s2        |        3306 | ONLINE        |
+---------------------------+--------------------------------------+-------------+-------------+---------------+
```

Quando s2 tentou ingressar no grupo, a [Seção 17.9.5, “Distributed Recovery”](group-replication-distributed-recovery.html "17.9.5 Distributed Recovery") garantiu que s2 aplicasse as mesmas transactions que s1 havia aplicado. Uma vez concluído este processo, s2 pôde ingressar no grupo como membro e, neste ponto, é marcado como ONLINE. Em outras palavras, ele deve ter automaticamente alcançado o server s1 (*caught up*). Assim que s2 estiver ONLINE, ele começa a processar transactions com o grupo. Verifique se s2 realmente sincronizou com o server s1 da seguinte forma.

```sql
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
| binlog.000001 |    4 | Format_desc    |         2 |         123 | Server ver: 5.7.44-log, Binlog ver: 4                              |
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

Como visto acima, o segundo server foi adicionado ao grupo e replicou automaticamente as alterações do server s1 usando *distributed recovery*. Em outras palavras, as transactions aplicadas no s1 até o momento em que s2 ingressou no grupo foram replicadas para s2.

##### 17.2.1.6.2 Adicionando Instâncias Adicionais

Adicionar instâncias adicionais ao grupo é essencialmente a mesma sequência de passos que adicionar o segundo server, exceto que a configuração deve ser alterada, assim como foi necessário para o server s2. Para resumir os comandos necessários:

*1. Crie o arquivo de configuração*

```sql
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
master_info_repository=TABLE
relay_log_info_repository=TABLE
binlog_checksum=NONE
log_slave_updates=ON
log_bin=binlog
binlog_format=ROW

#
# Group Replication configuration
#
group_replication_group_name="aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
group_replication_start_on_boot=off
group_replication_local_address= "s3:33061"
group_replication_group_seeds= "s1:33061,s2:33061,s3:33061"
group_replication_bootstrap_group= off
```

*2. Inicie o server e conecte-se a ele. Configure as *recovery credentials* para o canal `group_replication_recovery`.*

```sql
SET SQL_LOG_BIN=0;
CREATE USER rpl_user@'%' IDENTIFIED BY 'password';
GRANT REPLICATION SLAVE ON *.* TO rpl_user@'%';
FLUSH PRIVILEGES;
SET SQL_LOG_BIN=1;
CHANGE MASTER TO MASTER_USER='rpl_user', MASTER_PASSWORD='password'  \\
FOR CHANNEL 'group_replication_recovery';
```

*4. Instale o Group Replication *plugin* e inicie-o.*

```sql
INSTALL PLUGIN group_replication SONAME 'group_replication.so';
START GROUP_REPLICATION;
```

Neste ponto, o server s3 está inicializado (*booted*) e em execução, ingressou no grupo e alcançou (*caught up*) os outros servers no grupo. Consultar novamente a tabela [`performance_schema.replication_group_members`](performance-schema-replication-group-members-table.html "25.12.11.8 The replication_group_members Table") confirma este cenário.

```sql
mysql> SELECT * FROM performance_schema.replication_group_members;
+---------------------------+--------------------------------------+-------------+-------------+---------------+
| CHANNEL_NAME              | MEMBER_ID                            | MEMBER_HOST | MEMBER_PORT | MEMBER_STATE  |
+---------------------------+--------------------------------------+-------------+-------------+---------------+
| group_replication_applier | 395409e1-6dfa-11e6-970b-00212844f856 |   s1        |       3306  | ONLINE        |
| group_replication_applier | 7eb217ff-6df3-11e6-966c-00212844f856 |   s3        |       3306  | ONLINE        |
| group_replication_applier | ac39f1e6-6dfa-11e6-a69d-00212844f856 |   s2        |       3306  | ONLINE        |
+---------------------------+--------------------------------------+-------------+-------------+---------------+
```

Executar esta mesma Query no server s2 ou no server s1 resulta no mesmo output. Além disso, você pode verificar se o server s3 está atualizado (*caught up*):

```sql
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
| binlog.000001 |    4 | Format_desc    |         3 |         123 | Server ver: 5.7.44-log, Binlog ver: 4                              |
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
