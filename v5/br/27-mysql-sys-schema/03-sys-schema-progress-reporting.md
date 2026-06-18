## 26.3 Relatório de Progresso do Schema sys

As seguintes views do `sys` schema fornecem relatórios de progresso para transactions de longa duração:

```sql
processlist
session
x$processlist
x$session
```

Assumindo que os instruments e consumers necessários estejam habilitados, a coluna `progress` dessas views mostra a porcentagem do trabalho concluído para stages que suportam relatórios de progresso.

O relatório de progresso de Stage requer que o consumer `events_stages_current` esteja habilitado, bem como os instruments para os quais a informação de progresso é desejada. Instruments para estes stages atualmente suportam relatórios de progresso:

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

Para stages que não suportam relatórios de trabalho estimado e concluído, ou se os instruments ou consumers necessários não estiverem habilitados, a coluna `progress` é `NULL`.