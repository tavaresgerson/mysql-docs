## 30.3 Relatório de progresso do esquema do sistema

As seguintes vistas do esquema `sys` fornecem relatórios de progresso para transações de longa duração:

```
processlist
session
x$processlist
x$session
```

Supondo que os instrumentos e consumidores necessários estejam habilitados, a coluna `progress` desses visualizações mostra a porcentagem de trabalho concluído para as etapas que suportam relatórios de progresso.

Para que o relatório de progresso de estágios seja exibido, é necessário habilitar o consumidor `events_stages_current` e os instrumentos para os quais deseja-se obter informações de progresso. Os instrumentos desses estágios atualmente suportam o relatório de progresso:

```
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
