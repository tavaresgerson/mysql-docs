### 15.1.34 Declarações `DROP PROCEDURE` e `DROP FUNCTION`

```
DROP {PROCEDURE | FUNCTION} [IF EXISTS] sp_name
```

Essas declarações são usadas para descartar uma rotina armazenada (uma rotina armazenada ou função). Ou seja, a rotina especificada é removida do servidor. (`DROP FUNCTION` também é usado para descartar funções carregáveis; veja a Seção 15.7.4.2, “Declaração `DROP FUNCTION` para Funções Carregáveis”.)

Para descartar uma rotina armazenada, você deve ter o privilégio `ALTER ROUTINE` para ela. (Se a variável de sistema `automatic_sp_privileges` estiver habilitada, esse privilégio e `EXECUTE` são concedidos automaticamente ao criador da rotina quando a rotina é criada e descartada pelo criador quando a rotina é descartada. Veja a Seção 27.2.2, “Rotinas Armazenadas e Privilégios MySQL”.)

Além disso, se o definidor da rotina tiver o privilégio `SYSTEM_USER`, o usuário que a descarta também deve ter esse privilégio.

A cláusula `IF EXISTS` é uma extensão do MySQL. Ela previne que um erro ocorra se o procedimento ou função não existir. Um aviso é produzido que pode ser visualizado com `SHOW WARNINGS`.

`DROP FUNCTION` também é usado para descartar funções carregáveis (veja a Seção 15.7.4.2, “Declaração `DROP FUNCTION` para Funções Carregáveis”).