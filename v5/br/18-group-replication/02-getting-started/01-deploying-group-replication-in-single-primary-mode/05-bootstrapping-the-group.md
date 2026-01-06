#### 17.2.1.5 Autofinanciamento do Grupo

O processo de criação de um grupo pela primeira vez é chamado de bootstrapping. Você usa a variável de sistema `group_replication_bootstrap_group` para iniciar um grupo. O bootstrapping deve ser feito apenas por um único servidor, aquele que inicia o grupo e apenas uma vez. É por isso que o valor da opção `group_replication_bootstrap_group` não foi armazenado no arquivo de opções da instância. Se for salvo no arquivo de opções, ao reiniciar o servidor, ele automaticamente inicia um segundo grupo com o mesmo nome. Isso resultaria em dois grupos distintos com o mesmo nome. O mesmo raciocínio se aplica ao desligar e reiniciar o plugin com essa opção definida como `ON`. Portanto, para iniciar o grupo de forma segura, conecte-se ao s1 e execute:

```sql
mysql> SET GLOBAL group_replication_bootstrap_group=ON;
mysql> START GROUP_REPLICATION;
mysql> SET GLOBAL group_replication_bootstrap_group=OFF;
```

Depois que a instrução `START GROUP_REPLICATION` retornar, o grupo foi iniciado. Você pode verificar se o grupo foi criado e se há um membro nele:

```sql
mysql> SELECT * FROM performance_schema.replication_group_members;
+---------------------------+--------------------------------------+-------------+-------------+---------------+
| CHANNEL_NAME              | MEMBER_ID                            | MEMBER_HOST | MEMBER_PORT | MEMBER_STATE  |
+---------------------------+--------------------------------------+-------------+-------------+---------------+
| group_replication_applier | ce9be252-2b71-11e6-b8f4-00212844f856 |   s1        |       3306  | ONLINE        |
+---------------------------+--------------------------------------+-------------+-------------+---------------+
```

As informações nesta tabela confirmam que há um membro no grupo com o identificador único `ce9be252-2b71-11e6-b8f4-00212844f856`, que está `ONLINE` e está ouvindo conexões de clientes na porta `3306`.

Para demonstrar que o servidor está de fato em um grupo e que ele consegue lidar com a carga, crie uma tabela e adicione algum conteúdo nela.

```sql
mysql> CREATE DATABASE test;
mysql> USE test;
mysql> CREATE TABLE t1 (c1 INT PRIMARY KEY, c2 TEXT NOT NULL);
mysql> INSERT INTO t1 VALUES (1, 'Luis');
```

Verifique o conteúdo da tabela `t1` e do log binário.

```sql
mysql> SELECT * FROM t1;
+----+------+
| c1 | c2   |
+----+------+
|  1 | Luis |
+----+------+

mysql> SHOW BINLOG EVENTS;
+---------------+-----+----------------+-----------+-------------+--------------------------------------------------------------------+
| Log_name      | Pos | Event_type     | Server_id | End_log_pos | Info                                                               |
+---------------+-----+----------------+-----------+-------------+--------------------------------------------------------------------+
| binlog.000001 |   4 | Format_desc    |         1 |         123 | Server ver: 5.7.44-log, Binlog ver: 4                              |
| binlog.000001 | 123 | Previous_gtids |         1 |         150 |                                                                    |
| binlog.000001 | 150 | Gtid           |         1 |         211 | SET @@SESSION.GTID_NEXT= 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa:1'  |
| binlog.000001 | 211 | Query          |         1 |         270 | BEGIN                                                              |
| binlog.000001 | 270 | View_change    |         1 |         369 | view_id=14724817264259180:1                                        |
| binlog.000001 | 369 | Query          |         1 |         434 | COMMIT                                                             |
| binlog.000001 | 434 | Gtid           |         1 |         495 | SET @@SESSION.GTID_NEXT= 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa:2'  |
| binlog.000001 | 495 | Query          |         1 |         585 | CREATE DATABASE test                                               |
| binlog.000001 | 585 | Gtid           |         1 |         646 | SET @@SESSION.GTID_NEXT= 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa:3'  |
| binlog.000001 | 646 | Query          |         1 |         770 | use `test`; CREATE TABLE t1 (c1 INT PRIMARY KEY, c2 TEXT NOT NULL) |
| binlog.000001 | 770 | Gtid           |         1 |         831 | SET @@SESSION.GTID_NEXT= 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa:4'  |
| binlog.000001 | 831 | Query          |         1 |         899 | BEGIN                                                              |
| binlog.000001 | 899 | Table_map      |         1 |         942 | table_id: 108 (test.t1)                                            |
| binlog.000001 | 942 | Write_rows     |         1 |         984 | table_id: 108 flags: STMT_END_F                                    |
| binlog.000001 | 984 | Xid            |         1 |        1011 | COMMIT /* xid=38 */                                                |
+---------------+-----+----------------+-----------+-------------+--------------------------------------------------------------------+
```

Como visto acima, o banco de dados e os objetos da tabela foram criados e suas declarações DDL correspondentes foram escritas no log binário. Além disso, os dados foram inseridos na tabela e escritos no log binário. A importância das entradas do log binário é ilustrada na seção seguinte, quando o grupo cresce e a recuperação distribuída é executada, à medida que novos membros tentam se atualizar e entrar online.
