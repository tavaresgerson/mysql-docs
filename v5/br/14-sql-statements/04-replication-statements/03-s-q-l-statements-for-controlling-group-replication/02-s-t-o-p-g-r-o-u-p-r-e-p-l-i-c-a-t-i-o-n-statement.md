#### 13.4.3.2. Declaração STOP GROUP\_REPLICATION

```sql
STOP GROUP_REPLICATION
```

Para interromper a replicação em grupo. Essa declaração requer o privilégio `GROUP_REPLICATION_ADMIN` ou `SUPER`. Assim que você emitir `STOP GROUP_REPLICATION`, o membro é configurado para `super_read_only=ON`, o que garante que nenhuma escrita possa ser feita no membro enquanto a replicação em grupo estiver parada. Todos os outros canais de replicação em execução no membro também são interrompidos.

Aviso

Use essa declaração com extrema cautela, pois ela remove a instância do servidor do grupo, o que significa que ela não está mais protegida pelos mecanismos de garantia de consistência da Replicação por Grupo. Para garantir a segurança total, certifique-se de que suas aplicações não possam mais se conectar à instância antes de emitir essa declaração, para evitar qualquer chance de leituras desatualizadas.
