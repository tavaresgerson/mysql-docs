#### 13.7.5.21 Declaração de GRANTS SHOW

```sql
SHOW GRANTS [FOR user]
```

Esta declaração exibe os privilégios atribuídos a uma conta de usuário do MySQL, na forma de declarações de `GRANT` que devem ser executadas para duplicar as atribuições de privilégios.

Nota

Para exibir informações não de privilégio para contas do MySQL, use a instrução `SHOW CREATE USER`. Veja Seção 13.7.5.12, “Instrução SHOW CREATE USER”.

`SHOW GRANTS` requer o privilégio `SELECT` para o banco de dados do sistema `mysql`, exceto para exibir privilégios para o usuário atual.

Para nomear a conta para `SHOW GRANTS`, use o mesmo formato que para a declaração `GRANT` (por exemplo, `'jeffrey'@'localhost'`)

```sql
mysql> SHOW GRANTS FOR 'jeffrey'@'localhost';
+------------------------------------------------------------------+
| Grants for jeffrey@localhost                                     |
+------------------------------------------------------------------+
| GRANT USAGE ON *.* TO `jeffrey`@`localhost`                      |
| GRANT SELECT, INSERT, UPDATE ON `db1`.* TO `jeffrey`@`localhost` |
+------------------------------------------------------------------+
```

A parte do host, se omitida, tem como padrão `'%'.` Para obter informações adicionais sobre a especificação de nomes de contas, consulte Seção 6.2.4, “Especificação de Nomes de Contas”.

Para exibir os privilégios concedidos ao usuário atual (a conta que você está usando para se conectar ao servidor), você pode usar qualquer uma das seguintes declarações:

```sql
SHOW GRANTS;
SHOW GRANTS FOR CURRENT_USER;
SHOW GRANTS FOR CURRENT_USER();
```

Se `SHOW GRANTS FOR CURRENT_USER` (ou qualquer sintaxe equivalente) for usado no contexto do definidor, como dentro de um procedimento armazenado que é executado com privilégios de definidor em vez de de invocador, as permissões exibidas são as do definidor e não do invocador.

`SHOW GRANTS` não exibe privilégios que estão disponíveis para a conta nomeada, mas que são concedidos a uma conta diferente. Por exemplo, se uma conta anônima existir, a conta nomeada pode ser capaz de usar seus privilégios, mas o `SHOW GRANTS` não os exibe.

A saída `SHOW GRANTS` não inclui cláusulas `IDENTIFIED BY PASSWORD`. Use a instrução `SHOW CREATE USER` em vez disso. Veja Seção 13.7.5.12, “Instrução SHOW CREATE USER”.
