#### 13.4.3.1 Instrução START GROUP_REPLICATION

```sql
START GROUP_REPLICATION
```

Inicia a Group Replication nesta instância do servidor. Esta instrução requer o privilégio [`SUPER`](privileges-provided.html#priv_super). Se [`super_read_only=ON`](server-system-variables.html#sysvar_super_read_only) e o membro deve realizar o JOIN como um primary, [`super_read_only`](server-system-variables.html#sysvar_super_read_only) é definido como `OFF` assim que a Group Replication iniciar com sucesso.

Um servidor que participa de um grupo no modo single-primary deve usar [`skip_replica_start=ON`](/doc/refman/8.0/en/replication-options-replica.html#sysvar_skip_replica_start). Caso contrário, o servidor não tem permissão para realizar o JOIN em um grupo como um secondary.