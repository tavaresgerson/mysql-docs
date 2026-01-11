### 15.3.7 Declaração SET TRANSACTION

```
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

Esta declaração especifica as características da transação. Ela aceita uma lista de um ou mais valores de característica separados por vírgulas. Cada valor de característica define o nível de isolamento da transação ou o modo de acesso. O nível de isolamento é usado para operações em tabelas `InnoDB`. O modo de acesso especifica se as transações operam no modo de leitura/escrita ou de leitura somente.

Além disso, `SET TRANSACTION` pode incluir uma palavra-chave opcional `GLOBAL` ou `SESSION` para indicar o escopo da declaração.

* Níveis de Isolamento de Transação
* Modo de Acesso de Transação
* Escopo de Características de Transação

#### Níveis de Isolamento de Transação

Para definir o nível de isolamento de transação, use uma cláusula `ISOLATION LEVEL level`. Não é permitido especificar múltiplas cláusulas `ISOLATION LEVEL` na mesma declaração `SET TRANSACTION`.

O nível de isolamento padrão é `REPEATABLE READ`. Outros valores permitidos são `READ COMMITTED`, `READ UNCOMMITTED` e `SERIALIZABLE`. Para informações sobre esses níveis de isolamento, consulte a Seção 17.7.2.1, “Níveis de Isolamento de Transação”.

#### Modo de Acesso de Transação

Para definir o modo de acesso de transação, use uma cláusula `READ WRITE` ou `READ ONLY`. Não é permitido especificar múltiplas cláusulas de modo de acesso na mesma declaração `SET TRANSACTION`.

Por padrão, uma transação ocorre no modo de leitura/escrita, com leituras e escritas permitidas em tabelas usadas na transação. Esse modo pode ser especificado explicitamente usando `SET TRANSACTION` com um modo de acesso de `READ WRITE`.

Se o modo de acesso de transação for definido como `READ ONLY`, as alterações em tabelas são proibidas. Isso pode permitir que os motores de armazenamento realizem melhorias de desempenho que são possíveis quando as escritas não são permitidas.

No modo de leitura somente, ainda é possível alterar tabelas criadas com a palavra-chave `TEMPORARY` usando instruções DML. As alterações feitas com instruções DDL não são permitidas, assim como com tabelas permanentes.

Os modos de acesso `READ WRITE` e `READ ONLY` também podem ser especificados para uma transação individual usando a instrução `START TRANSACTION`.

#### escopo de características da transação

Você pode definir as características da transação globalmente, para a sessão atual ou apenas para a próxima transação:

* Com a palavra-chave `GLOBAL`:

  + A instrução se aplica globalmente para todas as sessões subsequentes.

  + As sessões existentes não são afetadas.
* Com a palavra-chave `SESSION`:

  + A instrução se aplica a todas as transações subsequentes realizadas dentro da sessão atual.

  + A instrução é permitida dentro de transações, mas não afeta a transação em andamento atual.

  + Se executada entre transações, a instrução substitui qualquer instrução anterior que defina o valor da próxima transação das características nomeadas.

* Sem nenhuma palavra-chave `SESSION` ou `GLOBAL`:

  + A instrução se aplica apenas à próxima transação única realizada dentro da sessão.

  + Transações subsequentes retornam ao uso do valor da sessão das características nomeadas.

  + A instrução não é permitida dentro de transações:

    ```
    mysql> START TRANSACTION;
    Query OK, 0 rows affected (0.02 sec)

    mysql> SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    ERROR 1568 (25001): Transaction characteristics can't be changed
    while a transaction is in progress
    ```

Uma mudança nas características da transação global requer o privilégio `CONNECTION_ADMIN` (ou o privilégio desatualizado `SUPER`). Qualquer sessão é livre para alterar suas características de sessão (mesmo no meio de uma transação) ou as características para sua próxima transação (antes do início dessa transação).

Para definir o nível de isolamento global no início do servidor, use a opção `--transaction-isolation=level` na linha de comando ou em um arquivo de opções. Os valores de *`level`* para essa opção usam travessões em vez de espaços, então os valores permitidos são `READ-UNCOMMITTED`, `READ-COMMITTED`, `REPEATABLE-READ` ou `SERIALIZABLE`.

Da mesma forma, para definir o modo de acesso de transação global no início do servidor, use a opção `--transaction-read-only`. O padrão é `OFF` (modo de leitura/escrita), mas o valor pode ser definido como `ON` para um modo de leitura apenas.

Por exemplo, para definir o nível de isolamento para `REPEATABLE READ` e o modo de acesso para `READ WRITE`, use essas linhas na seção `[mysqld]` de um arquivo de opções:

```
[mysqld]
transaction-isolation = REPEATABLE-READ
transaction-read-only = OFF
```

No tempo de execução, as características de escopo global, de sessão e de próxima transação podem ser definidas indiretamente usando a instrução `SET TRANSACTION`, conforme descrito anteriormente. Elas também podem ser definidas diretamente usando a instrução `SET` para atribuir valores às variáveis de sistema `transaction_isolation` e `transaction_read_only`:

* A instrução `SET TRANSACTION` permite as palavras-chave opcionais `GLOBAL` e `SESSION` para definir características de transação em diferentes níveis de escopo.

* A instrução `SET` para atribuir valores às variáveis de sistema `transaction_isolation` e `transaction_read_only` tem sintaxes para definir essas variáveis em diferentes níveis de escopo.

As tabelas a seguir mostram o nível de escopo da característica definido por cada sintaxe de `SET TRANSACTION` e atribuição de variáveis.

**Tabela 15.9 Sintaxe SET TRANSACTION para Características de Transação**

<table summary="Sintaxe para definir características de transação usando SET TRANSACTION e escopo afetado."><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th>Sintaxe</th> <th>Escopo da característica afetada</th> </tr></thead><tbody><tr> <td><code>SET GLOBAL TRANSACTION <em class="substituível"><code>característica_de_transação</code></em></code></td> <td>Global</td> </tr><tr> <td><code>SET SESSION TRANSACTION <em class="substituível"><code>característica_de_transação</code></em></code></td> <td>Sessão</td> </tr><tr> <td><code>SET TRANSACTION <em class="substituível"><code>característica_de_transação</code></em></code></td> <td>Apenas na próxima transação</td> </tr></tbody></table>

**Tabela 15.10 Sintaxe SET para Características de Transação**

<table summary="Sintaxe para definir características de transação usando SET e escopo afetado."><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th>Sintaxe</th> <th>Escopo da Característica Afetada</th> </tr></thead><tbody><tr> <td><code>SET GLOBAL <em><code>var_name</code></em> = <em><code>value</code></em></code></td> <td>Global</td> </tr><tr> <td><code>SET @@GLOBAL.<em><code>var_name</code></em> = <em><code>value</code></em></code></td> <td>Global</td> </tr><tr> <td><code>SET PERSIST <em><code>var_name</code></em> = <em><code>value</code></em></code></td> <td>Global</td> </tr><tr> <td><code>SET @@PERSIST.<em><code>var_name</code></em> = <em><code>value</code></em></code></td> <td>Global</td> </tr><tr> <td><code>SET PERSIST_ONLY <em><code>var_name</code></em> = <em><code>value</code></em></code></td> <td>Sem efeito no tempo de execução</td> </tr><tr> <td><code>SET @@PERSIST_ONLY.<em><code>var_name</code></em> = <em><code>value</code></em></code></td> <td>Sem efeito no tempo de execução</td> </tr><tr> <td><code>SET SESSION <em><code>var_name</code></em> = <em><code>value</code></em></code></td> <td>Sessão</td> </tr><tr> <td><code>SET @@SESSION.<em><code>var_name</code></em> = <em><code>value</code></em></code></td> <td>Sessão</td> </tr><tr> <td><code>SET <em><code>var_name</code></em> = <em><code>value</code></em></code></td> <td>Sessão</td> </tr><tr> <td><code>SET @@<em><code>var_name</code></em> = <em><code>value</code></em></code></td> <td>Próxima transação apenas</td> </tr></tbody></table>

É possível verificar os valores globais e de sessão das características da transação em tempo de execução: