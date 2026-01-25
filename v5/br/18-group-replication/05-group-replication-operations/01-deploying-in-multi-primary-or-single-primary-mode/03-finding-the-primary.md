#### 17.5.1.3 Encontrando o Primary

O exemplo a seguir mostra como descobrir qual servidor é atualmente o *primary* quando implantado no modo *single-primary*.

```sql
mysql> SHOW STATUS LIKE 'group_replication_primary_member';
```