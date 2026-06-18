### 25.6.13 Sincronização de privilégios e NDB\_STORED\_USER

O NDB 8.0 introduz um novo mecanismo para compartilhar e sincronizar usuários, papéis e privilégios entre nós SQL conectados a um NDB Cluster. Isso pode ser habilitado concedendo o privilégio `NDB_STORED_USER`. Consulte a descrição do privilégio para obter informações sobre o uso.

`NDB_STORED_USER` é impresso na saída de `SHOW GRANTS` como qualquer outro privilégio, conforme mostrado aqui:

```
mysql> SHOW GRANTS for 'jon'@'localhost';
+---------------------------------------------------+
| Grants for jon@localhost                          |
+---------------------------------------------------+
| GRANT USAGE ON *.* TO `jon`@`localhost`           |
| GRANT NDB_STORED_USER ON *.* TO `jon`@`localhost` |
+---------------------------------------------------+
```

Você também pode verificar se os privilégios estão compartilhados para essa conta usando o utilitário **ndb\_select\_all**, fornecido com o NDB Cluster, da seguinte forma (algum resultado foi formatado para preservar a formatação):

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

Uma declaração que concede o privilégio `NDB_STORED_USER`, como `GRANT NDB_STORED_USER ON *.* TO 'cluster_app_user'@'localhost'`, funciona direcionando `NDB` para criar uma instantânea usando as consultas `SHOW CREATE USER cluster_app_user@localhost` e `SHOW GRANTS FOR cluster_app_user@localhost`, e, em seguida, armazenando os resultados em `ndb_sql_metadata`. Em seguida, quaisquer outros nós SQL são solicitados para ler e aplicar a instantânea. Sempre que um servidor MySQL é iniciado e se junta ao clúster como um nó SQL, ele executa essas declarações armazenadas `CREATE USER` e `GRANT` como parte do processo de sincronização do esquema do clúster.

Sempre que uma instrução SQL é executada em um nó SQL diferente daquele onde foi originada, a instrução é executada em um fio de utilitário do mecanismo de armazenamento `NDBCLUSTER`; isso é feito dentro de um ambiente de segurança equivalente ao do fio de aplicação da réplica de replicação MySQL.

A partir da versão NDB 8.0.27, um nó SQL que realiza uma alteração nos privilégios do usuário obtém um bloqueio global antes de fazer isso, o que previne deadlocks por operações ACL concorrentes em diferentes nós SQL. Antes da versão NDB 8.0.27, as alterações nos usuários com `NDB_STORED_USER` eram atualizadas de forma completamente assíncrona, sem que nenhum bloqueio fosse obtido.

Você deve ter em mente que, como as operações de alteração de esquema compartilhado são realizadas de forma sincronizada, a próxima alteração de esquema compartilhado após uma alteração em qualquer usuário ou usuários compartilhados serve como ponto de sincronização. Quaisquer alterações de usuário pendentes são concluídas antes que a distribuição da alteração de esquema possa começar; após isso, a própria alteração de esquema é executada de forma sincronizada. Por exemplo, se uma declaração `DROP DATABASE` seguir uma declaração `DROP USER` de um usuário distribuído, a eliminação do banco de dados não pode ocorrer até que a eliminação do usuário tenha sido concluída em todos os nós SQL.

Caso múltiplos `GRANT`, `REVOKE` ou outros registros de administração de usuários de vários nós SQL causem divergências nos privilégios de um usuário em diferentes nós SQL, você pode resolver esse problema emitindo `GRANT NDB_STORED_USER` para esse usuário em um nó SQL onde os privilégios são conhecidos como corretos; isso faz com que um novo instantâneo dos privilégios seja tomado e sincronizado com os outros nós SQL.

O NDB Cluster 8.0 não suporta a distribuição de usuários e privilégios do MySQL entre os nós SQL em um NDB Cluster alterando as tabelas de privilégios do MySQL para que utilizem o mecanismo de armazenamento `NDB`, como no NDB 7.6 e versões anteriores (consulte Privilegios Distribuídos Usando Tabelas de Concessão Compartilhada). Para obter informações sobre o impacto dessa mudança em atualizações do NDB 8.0 a partir de uma versão anterior, consulte a Seção 25.3.7, “Atualização e Downgrade do NDB Cluster”.
