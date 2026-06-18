#### 13.4.3.2 Instrução STOP GROUP_REPLICATION

```sql
STOP GROUP_REPLICATION
```

Para o Group Replication. Esta instrução requer o privilégio `GROUP_REPLICATION_ADMIN` ou `SUPER`. Assim que você emite `STOP GROUP_REPLICATION`, o membro é configurado para `super_read_only=ON`, o que garante que nenhuma escrita possa ser feita no membro enquanto o Group Replication está parando. Quaisquer outros canais de replicação (replication channels) em execução no membro também são parados.

Aviso

Use esta instrução com extrema cautela, pois ela remove a instância do servidor do grupo, o que significa que ela não está mais protegida pelos mecanismos de garantia de consistência do Group Replication. Para total segurança, certifique-se de que suas aplicações não consigam mais se conectar à instância antes de emitir esta instrução para evitar qualquer chance de leituras desatualizadas (*stale reads*).