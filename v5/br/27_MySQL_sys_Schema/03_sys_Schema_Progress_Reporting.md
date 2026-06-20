## Relatório de progresso do esquema 26.3 sys

As seguintes vistas do esquema `sys` fornecem relatórios de progresso para transações de longa duração:

```sql
processlist
session
x$processlist
x$session
```

Supondo que os instrumentos e os consumidores necessários estejam habilitados, a coluna `progress` desses pontos de vista mostra a porcentagem de trabalho concluído para etapas que suportam relatórios de progresso.

O relatório de progresso de estágio exige que o consumidor `events_stages_current` seja habilitado, bem como os instrumentos para os quais as informações de progresso são desejadas. Os instrumentos para esses estágios atualmente suportam o relatório de progresso:

```sql
stage/sql/Copying to tmp table
stage/innodb/alter table (end)
stage/innodb/alter table (flush)
stage/innodb/alter table (insert)
stage/innodb/alter table (log apply index)
stage/innodb/alter table (log apply table)
stage/innodb/alter table (merge sort)
stage/innodb/alter table (read PK and internal sort)
stage/innodb/buffer pool load
```

Para etapas que não suportam relatórios de trabalho estimado e concluído, ou se os instrumentos ou consumidores necessários não estiverem habilitados, a coluna `progress` é `NULL`.