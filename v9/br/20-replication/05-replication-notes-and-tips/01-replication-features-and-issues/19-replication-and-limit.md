#### 19.5.1.19 Replicação e LIMIT

A replicação baseada em declarações de cláusulas `LIMIT` em declarações `DELETE`, `UPDATE` e `INSERT ... SELECT` não é segura, pois a ordem das linhas afetadas não é definida. (Tais declarações podem ser replicadas corretamente com replicação baseada em declarações apenas se também contiverem uma cláusula `ORDER BY`.) Quando tal declaração é encontrada:

* Ao usar o modo `STATEMENT`, um aviso é emitido indicando que a declaração não é segura para replicação baseada em declarações.

  Ao usar o modo `STATEMENT`, avisos são emitidos para declarações DML que contêm `LIMIT`, mesmo quando também possuem uma cláusula `ORDER BY` (e, portanto, tornam-se determinísticos). Este é um problema conhecido. (Bug #42851)

* Ao usar o modo `MIXED`, a declaração é agora replicada automaticamente usando o modo baseado em linhas.