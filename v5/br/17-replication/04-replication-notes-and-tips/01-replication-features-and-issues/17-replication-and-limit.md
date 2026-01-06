#### 16.4.1.17 Replicação e LIMITE

A replicação baseada em declarações de cláusulas `LIMIT` em instruções `DELETE` (delete.html), `UPDATE` (update.html) e `INSERT ... SELECT` (insert-select.html) não é segura, pois a ordem das linhas afetadas não é definida. (Tais instruções podem ser replicadas corretamente com replicação baseada em declarações apenas se elas também contiverem uma cláusula `ORDER BY`.) Quando essa instrução é encontrada:

- Ao usar o modo `STATEMENT`, agora é emitido um aviso de que a declaração não é segura para a replicação baseada em declarações.

  Ao usar o modo `STATEMENT`, os avisos são emitidos para instruções DML que contêm `LIMIT`, mesmo quando elas também têm uma cláusula `ORDER BY` (e, portanto, tornam-se determinísticas). Esse é um problema conhecido. (Bug #42851)

- Ao usar o modo `MIXED`, a declaração agora é replicada automaticamente usando o modo baseado em linhas.
