#### 13.4.3.1 Instrução START GROUP_REPLICATION

```sql
START GROUP_REPLICATION
```

Inicia a Group Replication nesta instância do servidor. Esta instrução requer o privilégio `SUPER`. Se `super_read_only=ON` e o membro deve realizar o JOIN como um primary, `super_read_only` é definido como `OFF` assim que a Group Replication iniciar com sucesso.

Um servidor que participa de um grupo no modo single-primary deve usar `skip_replica_start=ON`. Caso contrário, o servidor não tem permissão para realizar o JOIN em um grupo como um secondary.