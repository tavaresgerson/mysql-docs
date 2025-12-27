#### 15.3.8.1 Instruções SQL de Transações XA

Para realizar transações XA no MySQL, use as seguintes instruções:

```
XA {START|BEGIN} xid [JOIN|RESUME]

XA END xid [SUSPEND [FOR MIGRATE]]

XA PREPARE xid

XA COMMIT xid [ONE PHASE]

XA ROLLBACK xid

XA RECOVER [CONVERT XID]
```

Para `XA START`, as cláusulas `JOIN` e `RESUME` são reconhecidas, mas não têm efeito.

Para `XA END`, a cláusula `SUSPEND [FOR MIGRATE]` é reconhecida, mas não tem efeito.

Cada instrução XA começa com a palavra-chave `XA`, e a maioria delas requer um valor de *`xid`*. Um *`xid`* é um identificador de transação XA. Ele indica para qual transação a instrução se aplica. Os valores de *`xid`* são fornecidos pelo cliente ou gerados pelo servidor MySQL. Um valor de *`xid`* tem de uma a três partes:

```
xid: gtrid [, bqual [, formatID ]]
```

*`gtrid`* é um identificador de transação global, *`bqual`* é um qualificador de ramo, e *`formatID`* é um número que identifica o formato usado pelos valores de *`gtrid`* e *`bqual`*. Como indicado pela sintaxe, *`bqual`* e *`formatID`* são opcionais. O valor padrão de *`bqual`* é `''` se não for fornecido. O valor padrão de *`formatID`* é 1 se não for fornecido.

*`gtrid`* e *`bqual`* devem ser literais de string, cada um com até 64 bytes (não caracteres). *`gtrid`* e *`bqual`* podem ser especificados de várias maneiras. Você pode usar uma string entre aspas (`'ab'`), string hexadecimal (`X'6162'`, `0x6162`) ou valor de bit (`b'nnnn'`).

*`formatID`* é um inteiro não negativo.

Os valores de *`gtrid`* e *`bqual`* são interpretados em bytes pelas rotinas de suporte XA subjacentes do servidor MySQL. No entanto, enquanto uma instrução SQL que contém uma instrução XA está sendo analisada, o servidor trabalha com um conjunto de caracteres específico. Para segurança, escreva *`gtrid`* e *`bqual`* como strings hexadecimais.

Os valores `xid` são normalmente gerados pelo Gerenciador de Transações. Os valores gerados por uma única MT devem ser diferentes dos valores gerados por outras MTs. Uma determinada MT deve ser capaz de reconhecer seus próprios valores `xid` em uma lista de valores retornada pela instrução `XA RECOVER`.

`XA START xid` inicia uma transação XA com o valor `xid` fornecido. Cada transação XA deve ter um valor `xid` único, portanto, o valor não deve estar sendo usado atualmente por outra transação XA. A unicidade é avaliada usando os valores `gtrid` e `bqual`. Todas as instruções XA subsequentes para a transação XA devem ser especificadas usando o mesmo valor `xid` que foi fornecido na instrução `XA START`. Se você usar alguma dessas instruções, mas especificar um valor `xid` que não corresponda a alguma transação XA existente, ocorrerá um erro.

As instruções `XA START`, `XA BEGIN`, `XA END`, `XA COMMIT` e `XA ROLLBACK` não são filtradas pelo banco de dados padrão quando o servidor está em execução com `--replicate-do-db` ou `--replicate-ignore-db`.

Uma ou mais transações XA podem fazer parte da mesma transação global. Todas as transações XA dentro de uma determinada transação global devem usar o mesmo valor `gtrid` no valor `xid`. Por essa razão, os valores `gtrid` devem ser globalmente únicos para que não haja ambiguidade sobre qual transação global uma determinada transação XA faz parte. A parte `bqual` do valor `xid` deve ser diferente para cada transação XA dentro de uma transação global. (O requisito de que os valores `bqual` sejam diferentes é uma limitação da implementação atual do MySQL XA. Não faz parte da especificação XA.)

A declaração `XA RECOVER` retorna informações sobre as transações XA no servidor MySQL que estão no estado `PREPARED` (preparado). (Veja a Seção 15.3.8.2, “Estados das Transações XA”.) A saída inclui uma linha para cada transação XA desse tipo no servidor, independentemente de qual cliente a iniciou.

`XA RECOVER` requer o privilégio `XA_RECOVER_ADMIN`. Esse requisito de privilégio impede que os usuários descubram os valores do XID para transações XA preparadas pendentes, exceto as suas próprias. Isso não afeta o commit ou rollback normais de uma transação XA, porque o usuário que a iniciou conhece seu XID.

As linhas de saída de `XA RECOVER` têm a seguinte aparência (para um exemplo de valor de *`xid`* composto pelas partes `'abc'`, `'def'` e `7`):

```
mysql> XA RECOVER;
+----------+--------------+--------------+--------+
| formatID | gtrid_length | bqual_length | data   |
+----------+--------------+--------------+--------+
|        7 |            3 |            3 | abcdef |
+----------+--------------+--------------+--------+
```

As colunas da saída têm os seguintes significados:

* `formatID` é a parte `formatID` da transação `xid`

* `gtrid_length` é o comprimento em bytes da parte `gtrid` da `xid`

* `bqual_length` é o comprimento em bytes da parte `bqual` da `xid`

* `data` é a concatenação das partes `gtrid` e `bqual` da `xid`

Os valores do XID podem conter caracteres não imprimíveis. `XA RECOVER` permite uma cláusula opcional `CONVERT XID` para que os clientes possam solicitar os valores do XID em hexadecimal.