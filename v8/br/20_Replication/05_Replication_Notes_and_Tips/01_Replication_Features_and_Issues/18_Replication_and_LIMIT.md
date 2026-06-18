#### 19.5.1.18 Replicação e LIMITE

A replicação baseada em declarações das cláusulas `LIMIT` nas declarações `DELETE`, `UPDATE` e `INSERT ... SELECT` não é segura, pois a ordem das linhas afetadas não é definida. (Tais declarações podem ser replicadas corretamente com replicação baseada em declarações apenas se contiverem também uma cláusula `ORDER BY`. Quando tal declaração é encontrada:

- Ao usar o modo `STATEMENT`, agora é emitido um aviso de que a declaração não é segura para a replicação baseada em declarações.

  Ao usar o modo `STATEMENT`, são emitidos avisos para instruções DML que contêm `LIMIT`, mesmo quando elas também têm uma cláusula `ORDER BY` (e, portanto, tornam-se determinísticas). Esse é um problema conhecido. (Bug #42851)

- Ao usar o modo `MIXED`, a declaração agora é replicada automaticamente usando o modo baseado em linha.
