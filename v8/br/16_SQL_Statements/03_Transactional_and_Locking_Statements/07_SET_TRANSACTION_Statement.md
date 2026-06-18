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

Esta declaração especifica as características da transação. Ela aceita uma lista de um ou mais valores de características separados por vírgulas. Cada valor de característica define o nível de isolamento da transação ou o modo de acesso. O nível de isolamento é usado para operações em tabelas `InnoDB`. O modo de acesso especifica se as transações operam no modo de leitura/escrita ou apenas de leitura.

Além disso, `SET TRANSACTION` pode incluir uma palavra-chave opcional `GLOBAL` ou `SESSION` para indicar o escopo da declaração.

- Níveis de Isolamento de Transações
- Modo de Acesso à Transação
- Âmbito das características da transação

#### Níveis de Isolamento de Transações

Para definir o nível de isolamento de transação, use uma cláusula `ISOLATION LEVEL level`. Não é permitido especificar múltiplas cláusulas `ISOLATION LEVEL` na mesma instrução `SET TRANSACTION`.

O nível de isolamento padrão é `REPEATABLE READ`. Outros valores permitidos são `READ COMMITTED`, `READ UNCOMMITTED` e `SERIALIZABLE`. Para obter informações sobre esses níveis de isolamento, consulte a Seção 17.7.2.1, “Níveis de Isolamento de Transações”.

#### Modo de Acesso à Transação

Para definir o modo de acesso à transação, use uma cláusula `READ WRITE` ou `READ ONLY`. Não é permitido especificar múltiplas cláusulas de modo de acesso na mesma declaração `SET TRANSACTION`.

Por padrão, uma transação ocorre no modo de leitura/escrita, com permissão para leituras e escritas em tabelas usadas na transação. Esse modo pode ser especificado explicitamente usando `SET TRANSACTION` com um modo de acesso de `READ WRITE`.

Se o modo de acesso à transação estiver configurado como `READ ONLY`, as alterações nas tabelas serão proibidas. Isso pode permitir que os motores de armazenamento realizem melhorias de desempenho que são possíveis quando as escritas não são permitidas.

No modo de leitura somente, ainda é possível alterar tabelas criadas com a palavra-chave `TEMPORARY` usando instruções DML. As alterações feitas com instruções DDL não são permitidas, assim como com tabelas permanentes.

Os modos de acesso `READ WRITE` e `READ ONLY` também podem ser especificados para uma transação individual usando a instrução `START TRANSACTION`.

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

    ```
    mysql> START TRANSACTION;
    Query OK, 0 rows affected (0.02 sec)

    mysql> SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    ERROR 1568 (25001): Transaction characteristics can't be changed
    while a transaction is in progress
    ```

Para alterar as características de transação global, é necessário o privilégio `CONNECTION_ADMIN` (ou o privilégio desatualizado `SUPER`). Qualquer sessão pode alterar suas características de sessão (mesmo no meio de uma transação) ou as características para sua próxima transação (antes do início dessa transação).

Para definir o nível de isolamento global ao iniciar o servidor, use a opção `--transaction-isolation=level` na linha de comando ou em um arquivo de opções. Os valores de `level` para essa opção usam travessões em vez de espaços, portanto, os valores permitidos são `READ-UNCOMMITTED`, `READ-COMMITTED`, `REPEATABLE-READ` ou `SERIALIZABLE`.

Da mesma forma, para definir o modo de acesso à transação global ao iniciar o servidor, use a opção `--transaction-read-only`. O padrão é `OFF` (modo de leitura/escrita), mas o valor pode ser definido para `ON` para um modo de leitura apenas.

Por exemplo, para definir o nível de isolamento para `REPEATABLE READ` e o modo de acesso para `READ WRITE`, use essas linhas na seção `[mysqld]` de um arquivo de opções:

```
[mysqld]
transaction-isolation = REPEATABLE-READ
transaction-read-only = OFF
```

Durante a execução, as características nos níveis de escopo global, sessão e próxima transação podem ser definidas indiretamente usando a instrução `SET TRANSACTION`, conforme descrito anteriormente. Elas também podem ser definidas diretamente usando a instrução `SET` para atribuir valores às variáveis de sistema `transaction_isolation` e `transaction_read_only`:

- O `SET TRANSACTION` permite palavras-chave opcionais `GLOBAL` e `SESSION` para definir características de transação em diferentes níveis de escopo.

- A declaração `SET` para atribuir valores às variáveis de sistema `transaction_isolation` e `transaction_read_only` tem sintaxes para definir essas variáveis em diferentes níveis de escopo.

As tabelas a seguir mostram o nível de escopo característico definido por cada `SET TRANSACTION` e sintaxe de atribuição de variáveis.

**Tabela 15.9 Sintaxe SET TRANSACTION para características de transação**

<table summary="Sintaxe para definir características de transação usando SET TRANSACTION e escopo afetado."><thead><tr> <th>Sintaxe</th> <th>Âmbito da característica afetada</th> </tr></thead><tbody><tr> <td>[[<code>SET GLOBAL TRANSACTION <em class="replaceable"><code>transaction_characteristic</code>]]</em></code></td> <td>Global</td> </tr><tr> <td>[[<code>SET SESSION TRANSACTION <em class="replaceable"><code>transaction_characteristic</code>]]</em></code></td> <td>Sessão</td> </tr><tr> <td>[[<code>SET TRANSACTION <em class="replaceable"><code>transaction_characteristic</code>]]</em></code></td> <td>Próxima transação apenas</td> </tr></tbody></table>

**Tabela 15.10 Sintaxe SET para características de transação**

<table summary="Sintaxe para definir características de transação usando SET e escopo afetado."><thead><tr> <th>Sintaxe</th> <th>Âmbito da característica afetada</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code>SET @@PERSIST_ONLY.<em class="replaceable"><code>var_name</code>]</em>=<em class="replaceable">[[PH_HTML_CODE_<code>SET @@PERSIST_ONLY.<em class="replaceable"><code>var_name</code>]</em></code></td> <td>Global</td> </tr><tr> <td>[[PH_HTML_CODE_<code>SET SESSION <em class="replaceable"><code>var_name</code>]</em>=<em class="replaceable">[[PH_HTML_CODE_<code>value</code>]</em></code></td> <td>Global</td> </tr><tr> <td>[[PH_HTML_CODE_<code>SET @@SESSION.<em class="replaceable"><code>var_name</code>]</em>=<em class="replaceable">[[PH_HTML_CODE_<code>value</code>]</em></code></td> <td>Global</td> </tr><tr> <td>[[PH_HTML_CODE_<code>SET <em class="replaceable"><code>var_name</code>]</em>=<em class="replaceable">[[PH_HTML_CODE_<code>value</code>]</em></code></td> <td>Global</td> </tr><tr> <td>[[PH_HTML_CODE_<code>SET @@<em class="replaceable"><code>var_name</code>]</em>=<em class="replaceable">[[PH_HTML_CODE_<code>value</code>]</em></code></td> <td>Sem efeito de execução</td> </tr><tr> <td>[[<code>SET @@PERSIST_ONLY.<em class="replaceable"><code>var_name</code>]]</em>=<em class="replaceable">[[<code>value</code><code>SET @@PERSIST_ONLY.<em class="replaceable"><code>var_name</code>]</em></code></td> <td>Sem efeito de execução</td> </tr><tr> <td>[[<code>SET SESSION <em class="replaceable"><code>var_name</code>]]</em>=<em class="replaceable">[[<code>value</code>]]</em></code></td> <td>Sessão</td> </tr><tr> <td>[[<code>SET @@SESSION.<em class="replaceable"><code>var_name</code>]]</em>=<em class="replaceable">[[<code>value</code>]]</em></code></td> <td>Sessão</td> </tr><tr> <td>[[<code>SET <em class="replaceable"><code>var_name</code>]]</em>=<em class="replaceable">[[<code>value</code>]]</em></code></td> <td>Sessão</td> </tr><tr> <td>[[<code>SET @@<em class="replaceable"><code>var_name</code>]]</em>=<em class="replaceable">[[<code>value</code>]]</em></code></td> <td>Próxima transação apenas</td> </tr></tbody></table>

É possível verificar os valores globais e de sessão das características da transação em tempo de execução:

```
SELECT @@GLOBAL.transaction_isolation, @@GLOBAL.transaction_read_only;
SELECT @@SESSION.transaction_isolation, @@SESSION.transaction_read_only;
```
