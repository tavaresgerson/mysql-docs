#### 15.7.7.23 Declaração de GRANTS

```
SHOW GRANTS
    [FOR user_or_role
        [USING role [, role] ...]]

user_or_role: {
    user (see Section 8.2.4, “Specifying Account Names”)
  | role (see Section 8.2.5, “Specifying Role Names”.
}
```

Esta declaração exibe os privilégios e papéis atribuídos a uma conta de usuário ou papel do MySQL, na forma de declarações `GRANT` que devem ser executadas para duplicar as atribuições de privilégios e papéis.

Nota

Para exibir informações não de privilégio para contas do MySQL, use a declaração `SHOW CREATE USER`. Consulte a Seção 15.7.7.14, “Declaração SHOW CREATE USER”.

`SHOW GRANTS` requer o privilégio `SELECT` para o esquema do sistema `mysql`, exceto para exibir privilégios e papéis para o usuário atual.

Para nomear a conta ou papel para `SHOW GRANTS`, use o mesmo formato que para a declaração `GRANT` (por exemplo, `'jeffrey'@'localhost'`)

```
mysql> SHOW GRANTS FOR 'jeffrey'@'localhost';
+------------------------------------------------------------------+
| Grants for jeffrey@localhost                                     |
+------------------------------------------------------------------+
| GRANT USAGE ON *.* TO `jeffrey`@`localhost`                      |
| GRANT SELECT, INSERT, UPDATE ON `db1`.* TO `jeffrey`@`localhost` |
+------------------------------------------------------------------+
```

A parte do host, se omitida, tem como padrão `'%'`. Para obter informações adicionais sobre a especificação de nomes de conta e papel, consulte a Seção 8.2.4, “Especificação de Nomes de Conta”, e a Seção 8.2.5, “Especificação de Nomes de Papel”.

Para exibir os privilégios concedidos ao usuário atual (a conta que você está usando para se conectar ao servidor), você pode usar qualquer uma das seguintes declarações:

```
SHOW GRANTS;
SHOW GRANTS FOR CURRENT_USER;
SHOW GRANTS FOR CURRENT_USER();
```

Se `SHOW GRANTS FOR CURRENT_USER` (ou qualquer sintaxe equivalente) for usado no contexto do definidor, como dentro de um procedimento armazenado que é executado com privilégios de definidor em vez de de invocador, os privilégios exibidos são os do definidor e não do invocador.

No MySQL 9.5 em comparação com as séries anteriores, `SHOW GRANTS` não exibe mais `ALL PRIVILEGES` em sua saída de privilégios globais porque o significado de `ALL PRIVILEGES` no nível global varia dependendo dos privilégios dinâmicos definidos. Em vez disso, `SHOW GRANTS` lista explicitamente cada privilégio global concedido:

```
mysql> SHOW GRANTS FOR 'root'@'localhost';
+---------------------------------------------------------------------+
| Grants for root@localhost                                           |
+---------------------------------------------------------------------+
| GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, RELOAD,         |
| SHUTDOWN, PROCESS, FILE, REFERENCES, INDEX, ALTER, SHOW DATABASES,  |
| SUPER, CREATE TEMPORARY TABLES, LOCK TABLES, EXECUTE, REPLICATION   |
| SLAVE, REPLICATION CLIENT, CREATE VIEW, SHOW VIEW, CREATE ROUTINE,  |
| ALTER ROUTINE, CREATE USER, EVENT, TRIGGER, CREATE TABLESPACE,      |
| CREATE ROLE, DROP ROLE ON *.* TO `root`@`localhost` WITH GRANT      |
| OPTION                                                              |
| GRANT PROXY ON ''@'' TO `root`@`localhost` WITH GRANT OPTION        |
+---------------------------------------------------------------------+
```

Aplicações que processam a saída de `SHOW GRANTS` devem ser ajustadas conforme necessário.

No nível global, `GRANT OPTION` se aplica a todos os privilégios estáticos globais concedidos, se forem concedidos para algum deles, mas se aplica individualmente aos privilégios dinâmicos concedidos. `SHOW GRANTS` exibe os privilégios globais da seguinte maneira:

* Uma linha listando todos os privilégios estáticos concedidos, se houver algum, incluindo `WITH GRANT OPTION` se apropriado.

* Uma linha listando todos os privilégios dinâmicos concedidos para os quais `GRANT OPTION` é concedido, se houver algum, incluindo `WITH GRANT OPTION`.

* Uma linha listando todos os privilégios dinâmicos concedidos para os quais `GRANT OPTION` não é concedido, se houver algum, sem `WITH GRANT OPTION`.

Com a cláusula opcional `USING`, `SHOW GRANTS` permite que você examine os privilégios associados aos papéis do usuário. Cada papel nomeado na cláusula `USING` deve ser concedido ao usuário.

Suponha que o usuário `u1` seja atribuído os papéis `r1` e `r2`, da seguinte forma:

```
CREATE ROLE 'r1', 'r2';
GRANT SELECT ON db1.* TO 'r1';
GRANT INSERT, UPDATE, DELETE ON db1.* TO 'r2';
CREATE USER 'u1'@'localhost' IDENTIFIED BY 'u1pass';
GRANT 'r1', 'r2' TO 'u1'@'localhost';
```

`SHOW GRANTS` sem `USING` mostra os papéis concedidos:

```
mysql> SHOW GRANTS FOR 'u1'@'localhost';
+---------------------------------------------+
| Grants for u1@localhost                     |
+---------------------------------------------+
| GRANT USAGE ON *.* TO `u1`@`localhost`      |
| GRANT `r1`@`%`,`r2`@`%` TO `u1`@`localhost` |
+---------------------------------------------+
```

Adicionar uma cláusula `USING` faz com que a declaração também exiba os privilégios associados a cada papel nomeado na cláusula:

```
mysql> SHOW GRANTS FOR 'u1'@'localhost' USING 'r1';
+---------------------------------------------+
| Grants for u1@localhost                     |
+---------------------------------------------+
| GRANT USAGE ON *.* TO `u1`@`localhost`      |
| GRANT SELECT ON `db1`.* TO `u1`@`localhost` |
| GRANT `r1`@`%`,`r2`@`%` TO `u1`@`localhost` |
+---------------------------------------------+
mysql> SHOW GRANTS FOR 'u1'@'localhost' USING 'r2';
+-------------------------------------------------------------+
| Grants for u1@localhost                                     |
+-------------------------------------------------------------+
| GRANT USAGE ON *.* TO `u1`@`localhost`                      |
| GRANT INSERT, UPDATE, DELETE ON `db1`.* TO `u1`@`localhost` |
| GRANT `r1`@`%`,`r2`@`%` TO `u1`@`localhost`                 |
+-------------------------------------------------------------+
mysql> SHOW GRANTS FOR 'u1'@'localhost' USING 'r1', 'r2';
+---------------------------------------------------------------------+
| Grants for u1@localhost                                             |
+---------------------------------------------------------------------+
| GRANT USAGE ON *.* TO `u1`@`localhost`                              |
| GRANT SELECT, INSERT, UPDATE, DELETE ON `db1`.* TO `u1`@`localhost` |
| GRANT `r1`@`%`,`r2`@`%` TO `u1`@`localhost`                         |
+---------------------------------------------------------------------+
```

Observação

Um privilégio concedido a uma conta sempre está em vigor, mas um papel não. Os papéis ativos para uma conta podem diferir entre sessões e dentro delas, dependendo do valor da variável de sistema `activate_all_roles_on_login`, dos papéis padrão da conta e de se a execução de `SET ROLE` foi realizada dentro de uma sessão.

O MySQL suporta a revogação parcial de privilégios globais, de modo que um privilégio global pode ser restringido de se aplicar a esquemas particulares (veja a Seção 8.2.12, “Restrição de Privilégios Usando Revogações Parciais”). Para indicar quais privilégios de esquemas globais foram revogados para esquemas particulares, a saída de `SHOW GRANTS` inclui declarações `REVOKE`:

```
mysql> SET PERSIST partial_revokes = ON;
mysql> CREATE USER u1;
mysql> GRANT SELECT, INSERT, DELETE ON *.* TO u1;
mysql> REVOKE SELECT, INSERT ON mysql.* FROM u1;
mysql> REVOKE DELETE ON world.* FROM u1;
mysql> SHOW GRANTS FOR u1;
+--------------------------------------------------+
| Grants for u1@%                                  |
+--------------------------------------------------+
| GRANT SELECT, INSERT, DELETE ON *.* TO `u1`@`%`  |
| REVOKE SELECT, INSERT ON `mysql`.* FROM `u1`@`%` |
| REVOKE DELETE ON `world`.* FROM `u1`@`%`         |
+--------------------------------------------------+
```

`SHOW GRANTS` não exibe privilégios que estão disponíveis para a conta nomeada, mas que são concedidos a uma conta diferente. Por exemplo, se existir uma conta anônima, a conta nomeada pode ser capaz de usar seus privilégios, mas `SHOW GRANTS` não os exibe.

`SHOW GRANTS` exibe os papéis obrigatórios nomeados no valor da variável de sistema `mandatory_roles` da seguinte forma:

* `SHOW GRANTS` sem uma cláusula `FOR` exibe privilégios para o usuário atual e inclui papéis obrigatórios.

* `SHOW GRANTS FOR user` exibe privilégios para o usuário nomeado e não inclui papéis obrigatórios.

Esse comportamento é para o benefício de aplicativos que usam a saída de `SHOW GRANTS FOR user` para determinar quais privilégios são explicitamente concedidos ao usuário nomeado. Se essa saída incluir papéis obrigatórios, seria difícil distinguir papéis concedidos explicitamente ao usuário de papéis obrigatórios.

Para o usuário atual, os aplicativos podem determinar privilégios com ou sem papéis obrigatórios usando `SHOW GRANTS` ou `SHOW GRANTS FOR CURRENT_USER`, respectivamente.