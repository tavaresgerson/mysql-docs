### 15.1.29 Declarações de procedimentos de eliminação e funções de eliminação

```
DROP {PROCEDURE | FUNCTION} [IF EXISTS] sp_name
```

Essas declarações são usadas para descartar uma rotina armazenada (um procedimento ou função armazenada). Ou seja, a rotina especificada é removida do servidor. (O `DROP FUNCTION` também é usado para descartar funções carregáveis; veja a Seção 15.7.4.2, “Declaração DROP FUNCTION para Funções Carregáveis”.)

Para descartar uma rotina armazenada, você deve ter o privilégio `ALTER ROUTINE` para ela. (Se a variável de sistema `automatic_sp_privileges` estiver habilitada, esse privilégio e `EXECUTE` são concedidos automaticamente ao criador da rotina quando a rotina é criada e descartada do criador quando a rotina é descartada. Veja a Seção 27.2.2, “Rotinas Armazenadas e Privilégios MySQL”.)

Além disso, se o definidor da rotina tiver o privilégio `SYSTEM_USER`, o usuário que a remover também deve ter esse privilégio. Isso é aplicado no MySQL 8.0.16 e versões posteriores.

A cláusula `IF EXISTS` é uma extensão do MySQL. Ela impede que um erro ocorra se o procedimento ou função não existir. Um aviso é gerado que pode ser visualizado com `SHOW WARNINGS`.

`DROP FUNCTION` também é usado para descartar funções carregáveis (consulte a Seção 15.7.4.2, “Instrução DROP FUNCTION para Funções Carregáveis”).
