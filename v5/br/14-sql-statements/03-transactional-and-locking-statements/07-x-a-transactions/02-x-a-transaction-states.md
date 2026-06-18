#### 13.3.7.2 Estados da Transação XA

Uma transação XA progride através dos seguintes estados:

1. Use `XA START` para iniciar uma transação XA e colocá-la no estado `ACTIVE`.

2. Para uma transação XA `ACTIVE`, execute as instruções SQL que compõem a transação e, em seguida, execute uma instrução `XA END`. O `XA END` coloca a transação no estado `IDLE`.

3. Para uma transação XA `IDLE`, você pode executar uma instrução `XA PREPARE` ou uma instrução `XA COMMIT ... ONE PHASE`:

   * O `XA PREPARE` coloca a transação no estado `PREPARED`. Uma instrução `XA RECOVER` neste ponto inclui o valor *`xid`* da transação em sua saída, porque `XA RECOVER` lista todas as transações XA que estão no estado `PREPARED`.

   * `XA COMMIT ... ONE PHASE` prepara e faz o COMMIT da transação. O valor *`xid`* não é listado por `XA RECOVER` porque a transação é encerrada.

4. Para uma transação XA `PREPARED`, você pode executar uma instrução `XA COMMIT` para fazer o COMMIT e encerrar a transação, ou `XA ROLLBACK` para fazer o ROLLBACK e encerrar a transação.

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

No contexto de uma determinada conexão de cliente, as transações XA e as transações locais (não XA) são mutuamente exclusivas. Por exemplo, se `XA START` tiver sido executado para iniciar uma transação XA, uma transação local não poderá ser iniciada até que a transação XA tenha sido objeto de COMMIT ou ROLLBACK. Inversamente, se uma transação local tiver sido iniciada com `START TRANSACTION`, nenhuma instrução XA poderá ser usada até que a transação tenha sido objeto de COMMIT ou ROLLBACK.

Se uma transação XA estiver no estado `ACTIVE`, você não pode executar nenhuma instrução que cause um COMMIT implícito. Isso violaria o contrato XA porque você não conseguiria fazer o ROLLBACK da transação XA. O seguinte erro é gerado se você tentar executar tal instrução:

```sql
ERROR 1399 (XAE07): XAER_RMFAIL: The command cannot be executed
when global transaction is in the ACTIVE state
```

As instruções às quais a observação anterior se aplica estão listadas na Seção 13.3.3, “Instruções Que Causam um COMMIT Implícito”.