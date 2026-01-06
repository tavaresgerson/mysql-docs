#### 17.5.1.3 Encontrar o Primário

O exemplo a seguir mostra como descobrir qual servidor é o principal atualmente quando está configurado no modo de único principal.

```sql
mysql> SHOW STATUS LIKE 'group_replication_primary_member';
```
