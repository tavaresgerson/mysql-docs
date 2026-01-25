#### 13.3.7.1 Instruções SQL de Transação XA

Para executar transações XA no MySQL, utilize as seguintes instruções:

```sql
XA {START|BEGIN} xid [JOIN|RESUME]

XA END xid [SUSPEND [FOR MIGRATE

XA PREPARE xid

XA COMMIT xid [ONE PHASE]

XA ROLLBACK xid

XA RECOVER [CONVERT XID]
```

Para [`XA START`](xa-statements.html "13.3.7.1 Instruções SQL de Transação XA"), as cláusulas `JOIN` e `RESUME` são reconhecidas, mas não têm efeito.

Para [`XA END`](xa-statements.html "13.3.7.1 Instruções SQL de Transação XA"), a cláusula `SUSPEND [FOR MIGRATE]` é reconhecida, mas não tem efeito.

Cada instrução XA começa com a palavra-chave `XA`, e a maioria delas requer um valor *`xid`*. Um *`xid`* é um identificador de transação XA. Ele indica a qual transação a instrução se aplica. Os valores *`xid`* são fornecidos pelo cliente ou gerados pelo servidor MySQL. Um valor *`xid`* possui de uma a três partes:

```sql
xid: gtrid [, bqual [, formatID 
```

*`gtrid`* é um identificador de transação global, *`bqual`* é um qualificador de branch, e *`formatID`* é um número que identifica o formato usado pelos valores *`gtrid`* e *`bqual`*. Conforme indicado pela sintaxe, *`bqual`* e *`formatID`* são opcionais. O valor padrão de *`bqual`* é `''` se não for fornecido. O valor padrão de *`formatID`* é 1 se não for fornecido.

*`gtrid`* e *`bqual`* devem ser literais de string, cada um com até 64 bytes (não caracteres) de comprimento. *`gtrid`* e *`bqual`* podem ser especificados de várias maneiras. Você pode usar uma string entre aspas (`'ab'`), string hexadecimal (`X'6162'`, `0x6162`) ou valor de bit (`b'nnnn'`).

*`formatID`* é um inteiro não assinado (unsigned integer).

Os valores *`gtrid`* e *`bqual`* são interpretados em bytes pelas rotinas de suporte XA subjacentes do servidor MySQL. No entanto, enquanto uma instrução SQL contendo uma instrução XA está sendo analisada (parsed), o servidor trabalha com um conjunto de caracteres específico. Para garantir segurança, escreva *`gtrid`* e *`bqual`* como strings hexadecimais.

Os valores *`xid`* são tipicamente gerados pelo Transaction Manager (Gerenciador de Transações). Os valores gerados por um TM devem ser diferentes dos valores gerados por outros TMs. Um TM específico deve ser capaz de reconhecer seus próprios valores *`xid`* em uma lista de valores retornados pela instrução [`XA RECOVER`](xa-statements.html "13.3.7.1 Instruções SQL de Transação XA").

[`XA START xid`](xa-statements.html "13.3.7.1 Instruções SQL de Transação XA") inicia uma transação XA com o valor *`xid`* fornecido. Cada transação XA deve ter um valor *`xid`* único, portanto, o valor não deve estar em uso por outra transação XA. A unicidade é avaliada usando os valores *`gtrid`* e *`bqual`*. Todas as instruções XA subsequentes para a transação XA devem ser especificadas usando o mesmo valor *`xid`* fornecido na instrução [`XA START`](xa-statements.html "13.3.7.1 Instruções SQL de Transação XA"). Se você usar qualquer uma dessas instruções, mas especificar um valor *`xid`* que não corresponda a uma transação XA existente, ocorrerá um erro.

Uma ou mais transações XA podem fazer parte da mesma transação global. Todas as transações XA dentro de uma determinada transação global devem usar o mesmo valor *`gtrid`* no valor *`xid`*. Por esse motivo, os valores *`gtrid`* devem ser globalmente únicos para que não haja ambiguidade sobre de qual transação global uma determinada transação XA faz parte. A parte *`bqual`* do valor *`xid`* deve ser diferente para cada transação XA dentro de uma transação global. (A exigência de que os valores *`bqual`* sejam diferentes é uma limitação da implementação XA atual do MySQL. Isso não faz parte da especificação XA.)

A instrução [`XA RECOVER`](xa-statements.html "13.3.7.1 Instruções SQL de Transação XA") retorna informações para aquelas transações XA no servidor MySQL que estão no estado `PREPARED`. (Veja [Seção 13.3.7.2, “Estados da Transação XA”](xa-states.html "13.3.7.2 Estados da Transação XA")). A saída inclui uma linha para cada transação XA no servidor, independentemente de qual cliente a iniciou.

As linhas de saída de [`XA RECOVER`](xa-statements.html "13.3.7.1 Instruções SQL de Transação XA") se parecem com isto (para um valor *`xid`* de exemplo consistindo nas partes `'abc'`, `'def'` e `7`):

```sql
mysql> XA RECOVER;
+----------+--------------+--------------+--------+
| formatID | gtrid_length | bqual_length | data   |
+----------+--------------+--------------+--------+
|        7 |            3 |            3 | abcdef |
+----------+--------------+--------------+--------+
```

As colunas de saída têm os seguintes significados:

* `formatID` é a parte *`formatID`* do *`xid`* da transação
* `gtrid_length` é o comprimento em bytes da parte *`gtrid`* do *`xid`*
* `bqual_length` é o comprimento em bytes da parte *`bqual`* do *`xid`*
* `data` é a concatenação das partes *`gtrid`* e *`bqual`* do *`xid`*

Os valores XID podem conter caracteres não imprimíveis. A partir do MySQL 5.7.5, [`XA RECOVER`](xa-statements.html "13.3.7.1 Instruções SQL de Transação XA") permite uma cláusula opcional `CONVERT XID` para que os clientes possam solicitar valores XID em hexadecimal.
