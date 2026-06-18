#### 15.3.8.2 Estados de Transação XA

Uma transação XA progride pelos seguintes estados:

1. Use `XA START` para iniciar uma transação XA e colocá-la no estado `ACTIVE`.

2. Para uma transação `ACTIVE` XA, emita as instruções SQL que compõem a transação e, em seguida, emita uma instrução `XA END`. `XA END` coloca a transação no estado `IDLE`.

3. Para uma transação `IDLE` XA, você pode emitir uma declaração `XA PREPARE` ou uma declaração `XA COMMIT ... ONE PHASE`:

   - `XA PREPARE` coloca a transação no estado `PREPARED`. Uma declaração `XA RECOVER` neste ponto inclui o valor `xid` da transação em sua saída, porque `XA RECOVER` lista todas as transações XA que estão no estado `PREPARED`.

   - `XA COMMIT ... ONE PHASE` prepara e confirma a transação. O valor `xid` não é listado por `XA RECOVER` porque a transação é encerrada.

4. Para uma transação `PREPARED` XA, você pode emitir uma declaração `XA COMMIT` para confirmar e encerrar a transação, ou `XA ROLLBACK` para reverter e encerrar a transação.

Aqui está uma transação XA simples que insere uma linha em uma tabela como parte de uma transação global:

```
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

No MySQL 8.0.28 e versões anteriores, no contexto de uma conexão de cliente específica, as transações XA e as transações locais (não XA) são mutuamente exclusivas. Por exemplo, se `XA START` foi emitido para iniciar uma transação XA, uma transação local não pode ser iniciada até que a transação XA tenha sido confirmada ou revertida. Por outro lado, se uma transação local foi iniciada com `START TRANSACTION`, nenhuma declaração XA pode ser usada até que a transação tenha sido confirmada ou revertida.

O MySQL 8.0.29 e versões posteriores suportam transações XA desvinculadas, habilitadas pela variável de sistema `xa_detach_on_prepare` (por padrão, `ON`). As transações desvinculadas são desconectadas da sessão atual após a execução de `XA PREPARE` (e podem ser confirmadas ou revertidas por outra conexão). Isso significa que a sessão atual está livre para iniciar uma nova transação local ou transação XA sem precisar esperar que a transação XA preparada seja confirmada ou revertida.

Quando as transações XA são desvinculadas, uma conexão não tem conhecimento especial de nenhuma transação XA que ela tenha preparado. Se a sessão atual tentar confirmar ou reverter uma determinada transação XA (mesmo aquela que ela preparou) depois que outra conexão já a fez, a tentativa é rejeitada com um erro XID inválido (`ER_XAER_NOTA`) porque o `xid` solicitado já não existe.

Nota

As transações XA isoladas não podem usar tabelas temporárias.

Quando as transações XA desconectadas são desativadas (`xa_detach_on_prepare` definido como `OFF`), uma transação XA permanece conectada até que seja confirmada ou revertida pela conexão de origem, conforme descrito anteriormente para o MySQL 8.0.28 e versões anteriores. Desativar transações XA desconectadas não é recomendado para uma instância do servidor MySQL usada na replicação em grupo; consulte Configuração da Instância do Servidor para obter mais informações.

Se uma transação XA estiver no estado `ACTIVE`, você não pode emitir quaisquer declarações que causem um commit implícito. Isso violaria o contrato XA, pois você não poderia reverter a transação XA. Tentar executar tal declaração gera o seguinte erro:

```
ERROR 1399 (XAE07): XAER_RMFAIL: The command cannot be executed
when global transaction is in the ACTIVE state
```

As declarações às quais a observação anterior se aplica estão listadas na Seção 15.3.3, "Declarações que Causam um Compromisso Implícito".
