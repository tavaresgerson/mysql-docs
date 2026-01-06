#### 13.4.3.1 Declaração do grupo de início de replicação

```sql
START GROUP_REPLICATION
```

Começa a replicação em grupo nesta instância do servidor. Esta declaração requer o privilégio `SUPER`. Se `super_read_only=ON` e o membro deve se juntar como primário, `super_read_only` é definido como `OFF` assim que a replicação em grupo começar com sucesso.

Um servidor que participa de um grupo no modo único primário deve usar `skip_replica_start=ON`. Caso contrário, o servidor não poderá se juntar a um grupo como secundário.
