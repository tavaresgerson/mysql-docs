## Relatório de progresso do esquema `sys`

Os seguintes pontos de vista do esquema `sys` fornecem relatórios de progresso para transações de longa duração:

```
processlist
session
x$processlist
x$session
```

Supondo que os instrumentos e consumidores necessários estejam habilitados, a coluna `progresso` desses pontos de vista mostra a porcentagem de trabalho concluído para etapas que suportam o relatório de progresso.

O relatório de progresso da etapa requer que o consumidor `events_stages_current` esteja habilitado, bem como os instrumentos para os quais as informações de progresso são desejadas. Os instrumentos para essas etapas atualmente suportam o relatório de progresso:

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

Para etapas que não suportam o relatório de trabalho estimado e concluído, ou se os instrumentos ou consumidores necessários não estiverem habilitados, a coluna `progresso` é `NULL`.