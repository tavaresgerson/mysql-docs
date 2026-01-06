#### 13.3.7.2 Estados de Transação XA

Uma transação XA progride pelos seguintes estados:

1. Use `XA START` para iniciar uma transação XA e colocá-la no estado `ACTIVE`.

2. Para uma transação `ACTIVE` (ativa) do XA, execute as instruções SQL que compõem a transação e, em seguida, execute uma instrução `XA END` (xa-statements.html). A instrução `XA END` coloca a transação no estado `IDLE` (em repouso).

3. Para uma transação `IDLE` XA, você pode emitir uma declaração `XA PREPARE` (xa-statements.html) ou uma declaração `XA COMMIT ... UMA FASE`:

   - `XA PREPARE` coloca a transação no estado `PREPARED`. Uma declaração `XA RECOVER` neste ponto inclui o valor do *`xid`* da transação em sua saída, porque `XA RECOVER` lista todas as transações XA que estão no estado `PREPARED`.

   - `XA COMMIT ... UMA FASE` prepara e compromete a transação. O valor *`xid`* não é listado por `XA RECOVER` porque a transação é encerrada.

4. Para uma transação XA `PREPARAÇÃO`, você pode emitir uma declaração `XA COMMIT` (xa-statements.html) para confirmar e encerrar a transação, ou `XA ROLLBACK` (xa-statements.html) para reverter e encerrar a transação.

Aqui está uma transação XA simples que insere uma linha em uma tabela como parte de uma transação global:

```sql
mysql> XA START 'xatest';
Query OK, 0 rows affected (0.00 sec)

mysql> INSERT INTO mytable (i) VALUES(10);
Query OK, 1 row affected (0.04 sec)

mysql> XA END 'xatest';
Query OK, 0 rows affected (0.00 sec)

mysql> XA PREPARE 'xatest';
Query OK, 0 rows affected (0.00 sec)

mysql> XA COMMIT 'xatest';
Query OK, 0 rows affected (0.00 sec)
```

No contexto de uma conexão com um cliente específico, as transações XA e as transações locais (não XA) são mutuamente exclusivas. Por exemplo, se `XA START` foi emitido para iniciar uma transação XA, uma transação local não pode ser iniciada até que a transação XA tenha sido confirmada ou revertida. Por outro lado, se uma transação local foi iniciada com `START TRANSACTION`, nenhuma declaração XA pode ser usada até que a transação tenha sido confirmada ou revertida.

Se uma transação XA estiver no estado `ATIVO`, você não pode emitir quaisquer declarações que causem um commit implícito. Isso violaria o contrato XA, pois você não poderia reverter a transação XA. O seguinte erro será exibido se você tentar executar essa declaração:

```sql
ERROR 1399 (XAE07): XAER_RMFAIL: The command cannot be executed
when global transaction is in the ACTIVE state
```

As declarações às quais a observação anterior se aplica estão listadas em Seção 13.3.3, "Declarações que Causam um Compromisso Implícito".
