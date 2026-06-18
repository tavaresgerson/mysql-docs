### 13.1.27 Declarações DROP PROCEDURE e DROP FUNCTION

```sql
DROP {PROCEDURE | FUNCTION} [IF EXISTS] sp_name
```

Essas declarações são usadas para remover uma *stored Routine* (uma *stored Procedure* ou *Function*). Ou seja, a *Routine* especificada é removida do *Server*. (`DROP FUNCTION` também é usada para remover *loadable functions*; veja Seção 13.7.3.2, “Declaração DROP FUNCTION para Loadable Functions”.)

Para remover uma *stored Routine*, você deve ter o *privilege* `ALTER ROUTINE` para ela. (Se a *system variable* `automatic_sp_privileges` estiver habilitada, esse *privilege* e `EXECUTE` são concedidos automaticamente ao criador da *Routine* quando ela é criada e removidos do criador quando a *Routine* é removida. Veja Seção 23.2.2, “Stored Routines e MySQL Privileges”.)

A cláusula `IF EXISTS` é uma extensão do MySQL. Ela impede que um *error* ocorra caso a *Procedure* ou *Function* não exista. Um *Warning* é gerado, o qual pode ser visualizado com `SHOW WARNINGS`.

`DROP FUNCTION` também é usada para remover *loadable functions* (veja Seção 13.7.3.2, “Declaração DROP FUNCTION para Loadable Functions”).