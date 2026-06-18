#### 15.7.7.21 DECLARAR GRANTS SHOW

```
SHOW GRANTS
    [FOR user_or_role
        [USING role [, role] ...]]

user_or_role: {
    user (see Section 8.2.4, “Specifying Account Names”)
  | role (see Section 8.2.5, “Specifying Role Names”.
}
```

Esta declaração exibe os privilégios e papéis atribuídos a uma conta de usuário ou papel do MySQL, na forma de instruções `GRANT` que devem ser executadas para duplicar as atribuições de privilégios e papéis.

Nota

Para exibir informações não privilegiadas para contas do MySQL, use a instrução `SHOW CREATE USER`. Veja a Seção 15.7.7.12, “Instrução SHOW CREATE USER”.

`SHOW GRANTS` requer o privilégio `SELECT` para o esquema de sistema `mysql`, exceto para exibir privilégios e papéis para o usuário atual.

Para nomear a conta ou o papel para `SHOW GRANTS`, use o mesmo formato que para a declaração `GRANT` (por exemplo, `'jeffrey'@'localhost'`):

```
mysql> SHOW GRANTS FOR 'jeffrey'@'localhost';
+------------------------------------------------------------------+
| Grants for jeffrey@localhost                                     |
+------------------------------------------------------------------+
| GRANT USAGE ON *.* TO `jeffrey`@`localhost`                      |
| GRANT SELECT, INSERT, UPDATE ON `db1`.* TO `jeffrey`@`localhost` |
+------------------------------------------------------------------+
```

A parte do host, se omitida, tem como padrão `'%'`. Para obter informações adicionais sobre a especificação de nomes de contas e de papéis, consulte a Seção 8.2.4, “Especificação de Nomes de Contas”, e a Seção 8.2.5, “Especificação de Nomes de Papéis”.

Para exibir os privilégios concedidos ao usuário atual (a conta que você está usando para se conectar ao servidor), você pode usar qualquer uma das seguintes declarações:

```
SHOW GRANTS;
SHOW GRANTS FOR CURRENT_USER;
SHOW GRANTS FOR CURRENT_USER();
```

Se `SHOW GRANTS FOR CURRENT_USER` (ou qualquer sintaxe equivalente) for usado no contexto do definidor, como dentro de um procedimento armazenado que é executado com privilégios de definidor em vez de de invocador, as permissões exibidas são as do definidor e não do invocador.

No MySQL 8.0 em comparação com as séries anteriores, `SHOW GRANTS` não exibe mais `ALL PRIVILEGES` em sua saída de privilégios globais porque o significado de `ALL PRIVILEGES` no nível global varia dependendo dos privilégios dinâmicos definidos. Em vez disso, `SHOW GRANTS` lista explicitamente cada privilégio global concedido:

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

As aplicações que processam a saída `SHOW GRANTS` devem ser ajustadas conforme necessário.

A nível global, `GRANT OPTION` se aplica a todos os privilégios globais estáticos concedidos, se concedidos para qualquer um deles, mas se aplica individualmente aos privilégios dinâmicos concedidos. `SHOW GRANTS` exibe os privilégios globais da seguinte forma:

- Uma linha listando todos os privilégios estáticos concedidos, se houver algum, incluindo `WITH GRANT OPTION` se apropriado.

- Uma linha listando todos os privilégios dinâmicos concedidos para os quais `GRANT OPTION` é concedido, se houver algum, incluindo `WITH GRANT OPTION`.

- Uma linha listando todos os privilégios dinâmicos concedidos para os quais `GRANT OPTION` não está concedido, se houver algum, sem `WITH GRANT OPTION`.

Com a cláusula opcional `USING`, `SHOW GRANTS` permite que você examine os privilégios associados aos papéis do usuário. Cada papel mencionado na cláusula `USING` deve ser concedido ao usuário.

Suponha que o usuário `u1` seja atribuído aos papéis `r1` e `r2`, conforme a seguir:

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

A adição de uma cláusula `USING` faz com que a declaração também exiba os privilégios associados a cada função mencionada na cláusula:

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

Nota

Um privilégio concedido a uma conta sempre está em vigor, mas um papel não. Os papéis ativos para uma conta podem variar entre sessões e dentro delas, dependendo do valor da variável de sistema `activate_all_roles_on_login`, dos papéis padrão da conta e se `SET ROLE` foi executado dentro de uma sessão.

O MySQL 8.0.16 e versões superiores suportam revogações parciais de privilégios globais, de modo que um privilégio global pode ser restringido de se aplicar a esquemas específicos (consulte a Seção 8.2.12, “Restrição de Privilégios Usando Revogações Parciais”). Para indicar quais privilégios de esquemas globais foram revogados para esquemas específicos, a saída `SHOW GRANTS` inclui instruções `REVOKE`:

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

`SHOW GRANTS` não exibe privilégios que estão disponíveis para a conta nomeada, mas são concedidos a uma conta diferente. Por exemplo, se existir uma conta anônima, a conta nomeada pode ser capaz de usar seus privilégios, mas `SHOW GRANTS` não os exibe.

`SHOW GRANTS` exibe os papéis obrigatórios nomeados no valor da variável de sistema `mandatory_roles` da seguinte forma:

- `SHOW GRANTS` sem uma cláusula `FOR` exibe privilégios para o usuário atual e inclui papéis obrigatórios.

- `SHOW GRANTS FOR user` exibe privilégios para o usuário nomeado e não inclui papéis obrigatórios.

Esse comportamento é para benefício de aplicativos que usam a saída de `SHOW GRANTS FOR user` para determinar quais privilégios são concedidos explicitamente ao usuário nomeado. Se essa saída incluir papéis obrigatórios, seria difícil distinguir os papéis concedidos explicitamente ao usuário dos papéis obrigatórios.

Para o usuário atual, as aplicações podem determinar privilégios com ou sem papéis obrigatórios usando `SHOW GRANTS` ou `SHOW GRANTS FOR CURRENT_USER`, respectivamente.
