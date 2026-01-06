### 13.1.27 Declarações de procedimentos de exclusão e funções de exclusão

```sql
DROP {PROCEDURE | FUNCTION} [IF EXISTS] sp_name
```

Essas declarações são usadas para descartar uma rotina armazenada (um procedimento ou função armazenada). Ou seja, a rotina especificada é removida do servidor. (`DROP FUNCTION` também é usado para descartar funções carregáveis; veja Seção 13.7.3.2, “Declaração DROP FUNCTION para Funções Carregáveis”.)

Para descartar uma rotina armazenada, você deve ter o privilégio `ALTER ROUTINE`. (Se a variável de sistema `automatic_sp_privileges` estiver habilitada, esse privilégio e `EXECUTE` são concedidos automaticamente ao criador da rotina quando ela é criada e descartada pelo criador quando a rotina é descartada. Veja Seção 23.2.2, “Rotinas Armazenadas e Privilégios do MySQL”.)

A cláusula `IF EXISTS` é uma extensão do MySQL. Ela impede que um erro ocorra se o procedimento ou função não existir. Um aviso é gerado e pode ser visualizado com `SHOW WARNINGS`.

`DROP FUNCTION` também é usado para descartar funções carregáveis (veja Seção 13.7.3.2, “Instrução DROP FUNCTION para Funções Carregáveis”).
