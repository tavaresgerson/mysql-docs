### 13.3.6 Instrução SET TRANSACTION

```sql
SET [GLOBAL | SESSION] TRANSACTION
    transaction_characteristic [, transaction_characteristic] ...

transaction_characteristic: {
    ISOLATION LEVEL level
  | access_mode
}

level: {
     REPEATABLE READ
   | READ COMMITTED
   | READ UNCOMMITTED
   | SERIALIZABLE
}

access_mode: {
     READ WRITE
   | READ ONLY
}
```

Esta instrução especifica as características de uma [Transaction](glossary.html#glos_transaction "transaction"). Ela aceita uma lista de um ou mais valores de características separados por vírgulas. Cada valor de característica define o [Isolation Level](glossary.html#glos_isolation_level "isolation level") da Transaction ou o modo de acesso. O Isolation Level é usado para operações em tabelas [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"). O modo de acesso especifica se as Transactions operam em modo de leitura/escrita (*read/write*) ou somente leitura (*read-only*).

Além disso, [`SET TRANSACTION`](set-transaction.html "13.3.6 SET TRANSACTION Statement") pode incluir as palavras-chave opcionais `GLOBAL` ou `SESSION` para indicar o Scope da instrução.

* [Isolation Levels de Transaction](set-transaction.html#set-transaction-isolation-level "Transaction Isolation Levels")
* [Modo de Acesso da Transaction](set-transaction.html#set-transaction-access-mode "Transaction Access Mode")
* [Scope da Característica da Transaction](set-transaction.html#set-transaction-scope "Transaction Characteristic Scope")

#### Isolation Levels de Transaction

Para definir o Isolation Level da Transaction, use uma cláusula `ISOLATION LEVEL level`. Não é permitido especificar múltiplas cláusulas `ISOLATION LEVEL` na mesma instrução [`SET TRANSACTION`](set-transaction.html "13.3.6 SET TRANSACTION Statement").

O Isolation Level padrão é [`REPEATABLE READ`](innodb-transaction-isolation-levels.html#isolevel_repeatable-read). Outros valores permitidos são [`READ COMMITTED`](innodb-transaction-isolation-levels.html#isolevel_read-committed), [`READ UNCOMMITTED`](innodb-transaction-isolation-levels.html#isolevel_read-uncommitted) e [`SERIALIZABLE`](innodb-transaction-isolation-levels.html#isolevel_serializable). Para obter informações sobre esses Isolation Levels, consulte [Seção 14.7.2.1, “Transaction Isolation Levels”](innodb-transaction-isolation-levels.html "14.7.2.1 Transaction Isolation Levels").

#### Modo de Acesso da Transaction

Para definir o modo de acesso da Transaction, use uma cláusula `READ WRITE` ou `READ ONLY`. Não é permitido especificar múltiplas cláusulas de modo de acesso na mesma instrução [`SET TRANSACTION`](set-transaction.html "13.3.6 SET TRANSACTION Statement").

Por padrão, uma Transaction ocorre no modo *read/write* (leitura/escrita), permitindo operações de leitura e escrita nas tabelas usadas na Transaction. Este modo pode ser especificado explicitamente usando [`SET TRANSACTION`](set-transaction.html "13.3.6 SET TRANSACTION Statement") com um modo de acesso `READ WRITE`.

Se o modo de acesso da Transaction for definido como `READ ONLY` (somente leitura), alterações nas tabelas são proibidas. Isso pode permitir que os *storage engines* implementem melhorias de performance que são possíveis quando operações de escrita não são permitidas.

No modo somente leitura (*read-only*), ainda é possível alterar tabelas criadas com a palavra-chave `TEMPORARY` usando instruções DML. Alterações feitas com instruções DDL não são permitidas, assim como ocorre com tabelas permanentes.

Os modos de acesso `READ WRITE` e `READ ONLY` também podem ser especificados para uma Transaction individual usando a instrução [`START TRANSACTION`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements").

#### Scope da Característica da Transaction

Você pode definir as características da Transaction globalmente, para a Session atual, ou apenas para a próxima Transaction:

* Com a palavra-chave `GLOBAL`:

  + A instrução se aplica globalmente para todas as Sessions subsequentes.

  + Sessions existentes não são afetadas.
* Com a palavra-chave `SESSION`:

  + A instrução se aplica a todas as Transactions subsequentes executadas dentro da Session atual.

  + A instrução é permitida dentro de Transactions, mas não afeta a Transaction atual em andamento.

  + Se executada entre Transactions, a instrução anula qualquer instrução anterior que tenha definido o valor das características nomeadas para a próxima Transaction.

* Sem qualquer palavra-chave `SESSION` ou `GLOBAL`:

  + A instrução se aplica apenas à próxima Transaction realizada dentro da Session.

  + Transactions subsequentes voltam a usar o valor Session das características nomeadas.

  + A instrução não é permitida dentro de Transactions:

    ```sql
    mysql> START TRANSACTION;
    Query OK, 0 rows affected (0.02 sec)

    mysql> SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    ERROR 1568 (25001): Transaction characteristics can't be changed
    while a transaction is in progress
    ```

Uma alteração nas características globais de Transaction exige o privilégio [`SUPER`](privileges-provided.html#priv_super). Qualquer Session está livre para alterar suas características de Session (mesmo no meio de uma Transaction), ou as características para sua próxima Transaction (antes do início dessa Transaction).

Para definir o Isolation Level global na inicialização do servidor, use a opção [`--transaction-isolation=level`](server-options.html#option_mysqld_transaction-isolation) na linha de comando ou em um arquivo de opções. Os valores de *`level`* para esta opção usam hífens em vez de espaços, portanto, os valores permitidos são [`READ-UNCOMMITTED`](innodb-transaction-isolation-levels.html#isolevel_read-uncommitted), [`READ-COMMITTED`](innodb-transaction-isolation-levels.html#isolevel_read-committed), [`REPEATABLE-READ`](innodb-transaction-isolation-levels.html#isolevel_repeatable-read) ou [`SERIALIZABLE`](innodb-transaction-isolation-levels.html#isolevel_serializable).

Da mesma forma, para definir o modo de acesso global da Transaction na inicialização do servidor, use a opção [`--transaction-read-only`](server-options.html#option_mysqld_transaction-read-only). O padrão é `OFF` (modo *read/write*), mas o valor pode ser definido como `ON` para o modo *read only*.

Por exemplo, para definir o Isolation Level como [`REPEATABLE READ`](innodb-transaction-isolation-levels.html#isolevel_repeatable-read) e o modo de acesso como `READ WRITE`, use estas linhas na seção `[mysqld]` de um arquivo de opções:

```sql
[mysqld]
transaction-isolation = REPEATABLE-READ
transaction-read-only = OFF
```

Em tempo de execução (*runtime*), as características nos níveis de Scope global, Session e próxima Transaction podem ser definidas indiretamente usando a instrução [`SET TRANSACTION`](set-transaction.html "13.3.6 SET TRANSACTION Statement"), conforme descrito anteriormente. Elas também podem ser definidas diretamente usando a instrução [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") para atribuir valores às variáveis de sistema [`transaction_isolation`](server-system-variables.html#sysvar_transaction_isolation) e [`transaction_read_only`](server-system-variables.html#sysvar_transaction_read_only):

* [`SET TRANSACTION`](set-transaction.html "13.3.6 SET TRANSACTION Statement") permite palavras-chave opcionais `GLOBAL` e `SESSION` para definir as características da Transaction em diferentes níveis de Scope.

* A instrução [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") para atribuição de valores às variáveis de sistema [`transaction_isolation`](server-system-variables.html#sysvar_transaction_isolation) e [`transaction_read_only`](server-system-variables.html#sysvar_transaction_read_only) possui sintaxes para definir essas variáveis em diferentes níveis de Scope.

As tabelas a seguir mostram o nível de Scope da característica definido por cada sintaxe [`SET TRANSACTION`](set-transaction.html "13.3.6 SET TRANSACTION Statement") e de atribuição de variáveis.

**Tabela 13.6 Sintaxe SET TRANSACTION para Características de Transaction**

| Sintaxe | Scope da Característica Afetada |
| :--- | :--- |
| `SET GLOBAL TRANSACTION transaction_characteristic` | Global |
| `SET SESSION TRANSACTION transaction_characteristic` | Session |
| `SET TRANSACTION transaction_characteristic` | Apenas a próxima Transaction |

**Tabela 13.7 Sintaxe SET para Características de Transaction**

| Sintaxe | Scope da Característica Afetada |
| :--- | :--- |
| `SET GLOBAL var_name = value` | Global |
| `SET @@GLOBAL.var_name = value` | Global |
| `SET SESSION var_name = value` | Session |
| `SET @@SESSION.var_name = value` | Session |
| `SET var_name = value` | Session |
| `SET @@var_name = value` | Apenas a próxima Transaction |

É possível verificar os valores global e Session das características da Transaction em tempo de execução (*runtime*):

```sql
SELECT @@GLOBAL.transaction_isolation, @@GLOBAL.transaction_read_only;
SELECT @@SESSION.transaction_isolation, @@SESSION.transaction_read_only;
```

Antes do MySQL 5.7.20, use [`tx_isolation`](server-system-variables.html#sysvar_tx_isolation) e [`tx_read_only`](server-system-variables.html#sysvar_tx_read_only) em vez de [`transaction_isolation`](server-system-variables.html#sysvar_transaction_isolation) e [`transaction_read_only`](server-system-variables.html#sysvar_transaction_read_only).
