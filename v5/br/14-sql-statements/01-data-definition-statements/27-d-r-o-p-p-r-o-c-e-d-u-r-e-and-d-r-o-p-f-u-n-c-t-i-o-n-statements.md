### 13.1.27 Declarações DROP PROCEDURE e DROP FUNCTION

```sql
DROP {PROCEDURE | FUNCTION} [IF EXISTS] sp_name
```

Essas declarações são usadas para remover uma *stored Routine* (uma *stored Procedure* ou *Function*). Ou seja, a *Routine* especificada é removida do *Server*. (`DROP FUNCTION` também é usada para remover *loadable functions*; veja [Seção 13.7.3.2, “Declaração DROP FUNCTION para Loadable Functions”](drop-function-loadable.html "13.7.3.2 DROP FUNCTION Statement for Loadable Functions").)

Para remover uma *stored Routine*, você deve ter o *privilege* [`ALTER ROUTINE`](privileges-provided.html#priv_alter-routine) para ela. (Se a *system variable* `automatic_sp_privileges` estiver habilitada, esse *privilege* e [`EXECUTE`](privileges-provided.html#priv_execute) são concedidos automaticamente ao criador da *Routine* quando ela é criada e removidos do criador quando a *Routine* é removida. Veja [Seção 23.2.2, “Stored Routines e MySQL Privileges”](stored-routines-privileges.html "23.2.2 Stored Routines and MySQL Privileges").)

A cláusula `IF EXISTS` é uma extensão do MySQL. Ela impede que um *error* ocorra caso a *Procedure* ou *Function* não exista. Um *Warning* é gerado, o qual pode ser visualizado com [`SHOW WARNINGS`](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement").

[`DROP FUNCTION`](drop-function.html "13.1.24 DROP FUNCTION Statement") também é usada para remover *loadable functions* (veja [Seção 13.7.3.2, “Declaração DROP FUNCTION para Loadable Functions”](drop-function-loadable.html "13.7.3.2 DROP FUNCTION Statement for Loadable Functions")).