### 13.3.6 Declaração SET TRANSACTION

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

Esta declaração especifica as características da transação. Ela aceita uma lista de um ou mais valores de características separados por vírgulas. Cada valor de característica define o nível de isolamento da transação ou o modo de acesso. O nível de isolamento é usado para operações em tabelas de `InnoDB`. O modo de acesso especifica se as transações operam no modo de leitura/escrita ou apenas de leitura.

Além disso, `SET TRANSACTION` pode incluir a palavra-chave `GLOBAL` ou `SESSION` opcional para indicar o escopo da instrução.

- Níveis de Isolamento de Transações
- Modo de acesso à transação
- Âmbito da característica da transação

#### Níveis de Isolamento de Transações

Para definir o nível de isolamento de transação, use uma cláusula `ISOLATION LEVEL level`. Não é permitido especificar múltiplas cláusulas `ISOLATION LEVEL` na mesma instrução `SET TRANSACTION`.

O nível de isolamento padrão é `REPEATABLE READ`. Outros valores permitidos são `READ COMMITTED`, `READ UNCOMMITTED` e `SERIALIZABLE`. Para obter informações sobre esses níveis de isolamento, consulte Seção 14.7.2.1, “Níveis de Isolamento de Transações”.

#### Modo de Acesso à Transação

Para definir o modo de acesso à transação, use uma cláusula `READ WRITE` ou `READ ONLY`. Não é permitido especificar múltiplas cláusulas de modo de acesso na mesma instrução `SET TRANSACTION`.

Por padrão, uma transação ocorre no modo de leitura/escrita, com permissão para leituras e escritas em tabelas usadas na transação. Esse modo pode ser especificado explicitamente usando `SET TRANSACTION` com um modo de acesso de `READ WRITE`.

Se o modo de acesso à transação estiver configurado como `LEITURA SOMENTE`, as alterações nas tabelas serão proibidas. Isso pode permitir que os motores de armazenamento realizem melhorias de desempenho que são possíveis quando as escritas não são permitidas.

No modo de leitura somente, ainda é possível alterar tabelas criadas com a palavra-chave `TEMPORARY` usando instruções DML. As alterações feitas com instruções DDL não são permitidas, assim como com tabelas permanentes.

Os modos de acesso `LEIA ESCRITA` e `LEIA SOMENTE` também podem ser especificados para uma transação individual usando a instrução `START TRANSACTION`.

#### Âmbito das características da transação

Você pode definir as características da transação globalmente, para a sessão atual ou apenas para a próxima transação:

- Com a palavra-chave `GLOBAL`:

  - A declaração se aplica globalmente para todas as sessões subsequentes.

  - As sessões existentes não são afetadas.

- Com a palavra-chave `SESSION`:

  - A declaração se aplica a todas as transações subsequentes realizadas durante a sessão atual.

  - A declaração é permitida dentro das transações, mas não afeta a transação em andamento atual.

  - Se executada entre transações, a declaração substitui qualquer declaração anterior que defina o valor da próxima transação das características nomeadas.

- Sem nenhuma palavra-chave `SESSION` ou `GLOBAL`:

  - A declaração se aplica apenas à próxima transação única realizada dentro da sessão.

  - As transações subsequentes retornam ao uso do valor da sessão das características nomeadas.

  - A declaração não é permitida em transações:

    ```sql
    mysql> START TRANSACTION;
    Query OK, 0 rows affected (0.02 sec)

    mysql> SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    ERROR 1568 (25001): Transaction characteristics can't be changed
    while a transaction is in progress
    ```

Para alterar as características de transação global, é necessário o privilégio `SUPER`. Qualquer sessão pode alterar suas características de sessão (mesmo no meio de uma transação) ou as características para sua próxima transação (antes do início dessa transação).

Para definir o nível de isolamento global ao iniciar o servidor, use a opção `--transaction-isolation=level` na linha de comando ou em um arquivo de opções. Os valores de *`level`* para essa opção usam travessões em vez de espaços, portanto, os valores permitidos são `READ-UNCOMMITTED` (innodb-transaction-isolation-levels.html#isolevel_read-uncommitted), `READ-COMMITTED` (innodb-transaction-isolation-levels.html#isolevel_read-committed), `REPEATABLE-READ` (innodb-transaction-isolation-levels.html#isolevel_repeatable-read) ou `SERIALIZABLE` (innodb-transaction-isolation-levels.html#isolevel_serializable).

Da mesma forma, para definir o modo de acesso global de transações na inicialização do servidor, use a opção `--transaction-read-only`. O padrão é `OFF` (modo de leitura/escrita), mas o valor pode ser definido como `ON` para um modo de leitura apenas.

Por exemplo, para definir o nível de isolamento para `REPEATABLE READ` e o modo de acesso para `READ WRITE`, use essas linhas na seção `[mysqld]` de um arquivo de opções:

```sql
[mysqld]
transaction-isolation = REPEATABLE-READ
transaction-read-only = OFF
```

No momento da execução, as características nos níveis de escopo global, sessão e próxima transação podem ser definidas indiretamente usando a instrução `SET TRANSACTION`, conforme descrito anteriormente. Elas também podem ser definidas diretamente usando a instrução `SET` para atribuir valores às variáveis de sistema `transaction_isolation` e `transaction_read_only`:

- `SET TRANSACTION` permite as palavras-chave `GLOBAL` e `SESSION` opcionais para definir as características da transação em diferentes níveis de escopo.

- A instrução `SET` para atribuir valores às variáveis de sistema `transaction_isolation` e `transaction_read_only` tem sintaxes para definir essas variáveis em diferentes níveis de escopo.

As tabelas a seguir mostram o nível de escopo característico definido por cada sintaxe de `[SET TRANSACTION]` e atribuição de variáveis.

**Tabela 13.6 Sintaxe SET TRANSACTION para características de transação**

<table summary="Sintaxe para definir características de transação usando SET TRANSACTION e escopo afetado."><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th>Sintaxe</th> <th>Âmbito da característica afetada</th> </tr></thead><tbody><tr> <td>[[<code>SET GLOBAL TRANSACTION <em><code>transaction_characteristic</code>]]</em></code></td> <td>Global</td> </tr><tr> <td>[[<code>SET SESSION TRANSACTION <em><code>transaction_characteristic</code>]]</em></code></td> <td>Sessão</td> </tr><tr> <td>[[<code>SET TRANSACTION <em><code>transaction_characteristic</code>]]</em></code></td> <td>Próxima transação apenas</td> </tr></tbody></table>

**Tabela 13.7 Sintaxe SET para características de transação**

<table summary="Sintaxe para definir características de transação usando SET e escopo afetado."><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th>Sintaxe</th> <th>Âmbito da característica afetada</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code>SET @@<em><code>var_name</code>]</em>=<em>[[PH_HTML_CODE_<code>SET @@<em><code>var_name</code>]</em></code></td> <td>Global</td> </tr><tr> <td>[[<code>SET @@GLOBAL.<em><code>var_name</code>]]</em>=<em>[[<code>value</code>]]</em></code></td> <td>Global</td> </tr><tr> <td>[[<code>SET SESSION <em><code>var_name</code>]]</em>=<em>[[<code>value</code>]]</em></code></td> <td>Sessão</td> </tr><tr> <td>[[<code>SET @@SESSION.<em><code>var_name</code>]]</em>=<em>[[<code>value</code>]]</em></code></td> <td>Sessão</td> </tr><tr> <td>[[<code>SET <em><code>var_name</code>]]</em>=<em>[[<code>value</code>]]</em></code></td> <td>Sessão</td> </tr><tr> <td>[[<code>SET @@<em><code>var_name</code>]]</em>=<em>[[<code>value</code><code>SET @@<em><code>var_name</code>]</em></code></td> <td>Próxima transação apenas</td> </tr></tbody></table>

É possível verificar os valores globais e de sessão das características da transação em tempo de execução:

```sql
SELECT @@GLOBAL.transaction_isolation, @@GLOBAL.transaction_read_only;
SELECT @@SESSION.transaction_isolation, @@SESSION.transaction_read_only;
```

Antes do MySQL 5.7.20, use `tx_isolation` e `tx_read_only` em vez de `transaction_isolation` e `transaction_read_only`.
