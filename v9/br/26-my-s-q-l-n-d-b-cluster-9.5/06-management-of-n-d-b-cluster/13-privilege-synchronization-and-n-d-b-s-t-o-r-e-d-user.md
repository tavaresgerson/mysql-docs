### 25.6.13 Sincronização de privilégios e NDB_STORED_USER

A sincronização de privilégios é o mecanismo utilizado pelo NDB Cluster para compartilhar e sincronizar usuários, papéis e privilégios entre os nós SQL. Isso pode ser habilitado concedendo o privilégio `NDB_STORED_USER`. Veja a descrição do privilégio para obter informações de uso.

`NDB_STORED_USER` é impresso na saída do `SHOW GRANTS` como qualquer outro privilégio, conforme mostrado aqui:

```
mysql> SHOW GRANTS for 'jon'@'localhost';
+---------------------------------------------------+
| Grants for jon@localhost                          |
+---------------------------------------------------+
| GRANT USAGE ON *.* TO `jon`@`localhost`           |
| GRANT NDB_STORED_USER ON *.* TO `jon`@`localhost` |
+---------------------------------------------------+
```

Você também pode verificar se os privilégios são compartilhados para essa conta usando o utilitário **ndb_select_all** fornecido com o NDB Cluster, como este (algum output formatado para preservar a formatação):

```
$> ndb_select_all -d mysql ndb_sql_metadata | grep '`jon`@`localhost`'
12      "'jon'@'localhost'"     0       [NULL]  "GRANT USAGE ON *.* TO `jon`@`localhost`"
11      "'jon'@'localhost'"     0       2       "CREATE USER `jon`@`localhost`
IDENTIFIED WITH 'caching_sha2_password' AS
0x2441243030352466014340225A107D590E6E653B5D587922306102716D752E6656772F3038512F
6C5072776D30376D37347A384B557A4C564F70495158656A31382E45324E33
REQUIRE NONE PASSWORD EXPIRE DEFAULT ACCOUNT UNLOCK PASSWORD HISTORY DEFAULT
PASSWORD REUSE INTERVAL DEFAULT PASSWORD REQUIRE CURRENT DEFAULT"
12      "'jon'@'localhost'"     1       [NULL]  "GRANT NDB_STORED_USER ON *.* TO `jon`@`localhost`"
```

`ndb_sql_metadata` é uma tabela especial `NDB` que não é visível usando o **mysql** ou outros clientes MySQL.

Uma declaração que concede o privilégio `NDB_STORED_USER`, como `GRANT NDB_STORED_USER ON *.* TO 'cluster_app_user'@'localhost'`, funciona direcionando o `NDB` a criar um snapshot usando as consultas `SHOW CREATE USER cluster_app_user@localhost` e `SHOW GRANTS FOR cluster_app_user@localhost`, e armazenando os resultados em `ndb_sql_metadata`. Qualquer outro nó SQL é então solicitado para ler e aplicar o snapshot. Sempre que um servidor MySQL é iniciado e se junta ao clúster como um nó SQL, ele executa essas declarações `CREATE USER` e `GRANT` armazenadas como parte do processo de sincronização do esquema do clúster.

Sempre que uma declaração SQL é executada em um nó SQL diferente do que a originou, a declaração é executada em um fio de utilitário do motor de armazenamento `NDBCLUSTER`; isso é feito dentro de um ambiente de segurança equivalente ao do fio de aplicador de réplica MySQL.

Um nó SQL que realiza uma alteração nos privilégios do usuário obtém um bloqueio global antes de fazê-lo, o que previne deadlocks por operações ACL compartilhadas em diferentes nós SQL.

Você deve ter em mente que, como as operações de alteração de esquema compartilhado são realizadas de forma sincronizada, a próxima alteração de esquema compartilhado após uma alteração em qualquer usuário ou usuários compartilhados serve como um ponto de sincronização. Quaisquer alterações de usuário pendentes são concluídas antes que a distribuição da alteração de esquema possa começar; após isso, a própria alteração de esquema é realizada de forma sincronizada. Por exemplo, se uma instrução `DROP DATABASE` for seguida por uma instrução `DROP USER` de um usuário distribuído, a remoção do banco de dados não pode ocorrer até que a remoção do usuário tenha sido concluída em todos os nós SQL.

No caso de múltiplas instruções `GRANT`, `REVOKE` ou outras declarações de administração de usuários de múltiplos nós SQL causarem divergências nos privilégios de um usuário em diferentes nós SQL, você pode resolver esse problema emitindo `GRANT NDB_STORED_USER` para esse usuário em um nó SQL onde os privilégios são conhecidos como corretos; isso causa uma nova captura dos privilégios e os sincroniza com os outros nós SQL.

Nota

O NDB Cluster 9.5 não suporta a distribuição de usuários e privilégios MySQL entre nós SQL em um NDB Cluster alterando as tabelas de privilégios MySQL de forma que elas usem o mecanismo de armazenamento `NDB`, como foi feito em versões anteriores (NDB 7.6 e anteriores — consulte Privilegios Distribuídos Usando Tabelas de Concessão Compartilhadas).