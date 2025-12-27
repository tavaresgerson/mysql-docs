#### 15.3.8.2 Estados de Transações XA

Uma transação XA progride pelos seguintes estados:

1. Use `XA START` para iniciar uma transação XA e colocá-la no estado `ACTIVE`.

2. Para uma transação XA `ACTIVE`, emita as instruções SQL que compõem a transação e, em seguida, emita uma instrução `XA END`. `XA END` coloca a transação no estado `IDLE`.

3. Para uma transação `IDLE` XA, você pode emitir uma instrução `XA PREPARE` ou uma instrução `XA COMMIT ... ONE PHASE`:

   * `XA PREPARE` coloca a transação no estado `PREPARED`. Uma instrução `XA RECOVER` neste ponto inclui o valor do *`xid`* da transação em sua saída, porque `XA RECOVER` lista todas as transações XA que estão no estado `PREPARED`.

   * `XA COMMIT ... ONE PHASE` prepara e confirma a transação. O valor do *`xid`* não é listado por `XA RECOVER` porque a transação termina.

4. Para uma transação `PREPARED` XA, você pode emitir uma instrução `XA COMMIT` para confirmar e terminar a transação, ou `XA ROLLBACK` para reverter e terminar a transação.

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

O MySQL 9.5 suporta transações XA desacopladas, habilitadas pela variável de sistema `xa_detach_on_prepare` (`ON` por padrão). As transações desacopladas são desconectadas da sessão atual após a execução de `XA PREPARE` (e podem ser confirmadas ou revertidas por outra conexão). Isso significa que a sessão atual está livre para iniciar uma nova transação local ou XA sem ter que esperar para que a transação XA preparada seja confirmada ou revertida.

Quando as transações XA são desativadas, uma conexão não tem conhecimento especial de nenhuma transação XA que ela tenha preparado. Se a sessão atual tentar confirmar ou reverter uma transação XA dada (mesmo aquela que ela preparou) depois que outra conexão já a tenha feito, a tentativa é rejeitada com um erro de XID inválido (`ER_XAER_NOTA`), pois o *`xid`* solicitado não existe mais.

Nota

Transações XA desativadas não podem usar tabelas temporárias.

Quando as transações XA desativadas são desativadas (`xa_detach_on_prepare` definido como `OFF`), uma transação XA permanece conectada até que seja confirmada ou revertida pela conexão original. Desativar transações XA desativadas não é recomendado para uma instância do servidor MySQL usada na replicação em grupo; consulte Configuração da Instância do Servidor para obter mais informações.

Se uma transação XA estiver no estado `ACTIVE`, você não pode emitir quaisquer instruções que causem um commit implícito. Isso violaria o contrato XA porque você não poderia reverter a transação XA. Tentar executar uma instrução desse tipo gera o seguinte erro:

```
ERROR 1399 (XAE07): XAER_RMFAIL: The command cannot be executed
when global transaction is in the ACTIVE state
```

As instruções às quais a observação anterior se aplica estão listadas na Seção 15.3.3, “Instruções que causam um commit implícito”.