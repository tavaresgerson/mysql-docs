#### 6.4.5.8 Escrevendo Definições de Filtro do Audit Log

Definições de filtro são valores [`JSON`](json.html "11.5 The JSON Data Type"). Para informações sobre o uso de dados [`JSON`](json.html "11.5 The JSON Data Type") no MySQL, veja [Section 11.5, “The JSON Data Type”](json.html "11.5 The JSON Data Type").

Definições de filtro têm esta forma, onde *`actions`* indica como a filtragem ocorre:

```sql
{ "filter": actions }
```

A discussão a seguir descreve os constructos permitidos nas definições de filtro.

* [Registrando Todos os Eventos](audit-log-filter-definitions.html#audit-log-filtering-enabling-logging "Logging All Events")
* [Registrando Classes de Eventos Específicas](audit-log-filter-definitions.html#audit-log-filtering-class-logging "Logging Specific Event Classes")
* [Registrando Subclasses de Eventos Específicas](audit-log-filter-definitions.html#audit-log-filtering-subclass-logging "Logging Specific Event Subclasses")
* [Registro Inclusivo e Exclusivo](audit-log-filter-definitions.html#audit-log-filtering-inclusive-exclusive "Inclusive and Exclusive Logging")
* [Testando Valores de Campos de Evento](audit-log-filter-definitions.html#audit-log-filtering-event-fields "Testing Event Field Values")
* [Bloqueando a Execução de Eventos Específicos](audit-log-filter-definitions.html#audit-log-filtering-blocking-events "Blocking Execution of Specific Events")
* [Operadores Lógicos](audit-log-filter-definitions.html#audit-log-filtering-logical-operators "Logical Operators")
* [Referenciando Variáveis Predefinidas](audit-log-filter-definitions.html#audit-log-filtering-predefined-variables "Referencing Predefined Variables")
* [Referenciando Funções Predefinidas](audit-log-filter-definitions.html#audit-log-filtering-predefined-functions "Referencing Predefined Functions")
* [Substituindo um Filtro de Usuário](audit-log-filter-definitions.html#audit-log-filtering-filter-replacement "Replacing a User Filter")

##### Registrando Todos os Eventos

Para habilitar ou desabilitar explicitamente o registro de todos os eventos, use um item `log` no filtro:

```sql
{
  "filter": { "log": true }
}
```

O valor de `log` pode ser `true` ou `false`.

O filtro anterior habilita o registro de todos os eventos. É equivalente a:

```sql
{
  "filter": { }
}
```

O comportamento de registro depende do valor de `log` e se os itens `class` ou `event` são especificados:

* Com `log` especificado, seu valor fornecido é usado.

* Sem `log` especificado, o registro é `true` se nenhum item `class` ou `event` for especificado, e `false` caso contrário (em cujo caso, `class` ou `event` podem incluir seu próprio item `log`).

##### Registrando Classes de Eventos Específicas

Para registrar eventos de uma classe específica, use um item `class` no filtro, com seu campo `name` denotando o nome da classe a ser registrada:

```sql
{
  "filter": {
    "class": { "name": "connection" }
  }
}
```

O valor de `name` pode ser `connection`, `general` ou `table_access` para registrar eventos de connection, gerais ou de acesso a Table, respectivamente.

O filtro anterior habilita o registro de eventos na classe `connection`. É equivalente ao seguinte filtro com itens `log` tornados explícitos:

```sql
{
  "filter": {
    "log": false,
    "class": { "log": true,
               "name": "connection" }
  }
}
```

Para habilitar o registro de múltiplas classes, defina o valor `class` como um elemento de array [`JSON`](json.html "11.5 The JSON Data Type") que nomeia as classes:

```sql
{
  "filter": {
    "class": [
      { "name": "connection" },
      { "name": "general" },
      { "name": "table_access" }
    ]
  }
}
```

Nota

Quando múltiplas instâncias de um dado item aparecem no mesmo nível dentro de uma definição de filtro, os valores dos itens podem ser combinados em uma única instância desse item dentro de um valor de array. A definição anterior pode ser escrita assim:

```sql
{
  "filter": {
    "class": [
      { "name": [ "connection", "general", "table_access" ] }
    ]
  }
}
```

##### Registrando Subclasses de Eventos Específicas

Para selecionar subclasses de eventos específicas, use um item `event` contendo um item `name` que nomeia as subclasses. A ação padrão para eventos selecionados por um item `event` é registrá-los. Por exemplo, este filtro habilita o registro para as subclasses de eventos nomeadas:

```sql
{
  "filter": {
    "class": [
      {
        "name": "connection",
        "event": [
          { "name": "connect" },
          { "name": "disconnect" }
        ]
      },
      { "name": "general" },
      {
        "name": "table_access",
        "event": [
          { "name": "insert" },
          { "name": "delete" },
          { "name": "update" }
        ]
      }
    ]
  }
}
```

O item `event` também pode conter itens `log` explícitos para indicar se deve registrar eventos qualificadores. Este item `event` seleciona múltiplos eventos e indica explicitamente o comportamento de registro para eles:

```sql
"event": [
  { "name": "read", "log": false },
  { "name": "insert", "log": true },
  { "name": "delete", "log": true },
  { "name": "update", "log": true }
]
```

A partir do MySQL 5.7.20, o item `event` também pode indicar se deve bloquear eventos qualificadores, se contiver um item `abort`. Para detalhes, veja [Bloqueando a Execução de Eventos Específicos](audit-log-filter-definitions.html#audit-log-filtering-blocking-events "Blocking Execution of Specific Events").

[Table 6.26, “Event Class and Subclass Combinations”](audit-log-filter-definitions.html#audit-log-event-subclass-combinations "Table 6.26 Event Class and Subclass Combinations") descreve os valores de subclasse permitidos para cada classe de evento.

**Table 6.26 Combinações de Classe e Subclasse de Evento**

<table summary="Permitted combiniations of event class and subclass values.">
  <col style="width: 20%"/>
  <col style="width: 20%"/>
  <col style="width: 60%"/>
  <thead>
    <tr>
      <th>Classe de Evento</th>
      <th>Subclasse de Evento</th>
      <th>Descrição</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th><code>connection</code></th>
      <td><code>connect</code></td>
      <td>Iniciação de Connection (bem-sucedida ou malsucedida)</td>
    </tr>
    <tr>
      <th><code>connection</code></th>
      <td><code>change_user</code></td>
      <td>Reautenticação de usuário com usuário/senha diferentes durante a sessão</td>
    </tr>
    <tr>
      <th><code>connection</code></th>
      <td><code>disconnect</code></td>
      <td>Término de Connection</td>
    </tr>
    <tr>
      <th><code>general</code></th>
      <td><code>status</code></td>
      <td>Informações gerais de operação</td>
    </tr>
    <tr>
      <th><code>table_access</code></th>
      <td><code>read</code></td>
      <td>Declarações de leitura de Table, como <code>SELECT</code> ou <code>INSERT INTO ... SELECT</code></td>
    </tr>
    <tr>
      <th><code>table_access</code></th>
      <td><code>delete</code></td>
      <td>Declarações de exclusão de Table, como <code>DELETE</code> ou <code>TRUNCATE TABLE</code></td>
    </tr>
    <tr>
      <th><code>table_access</code></th>
      <td><code>insert</code></td>
      <td>Declarações de inserção de Table, como <code>INSERT</code> ou <code>REPLACE</code></td>
    </tr>
    <tr>
      <th><code>table_access</code></th>
      <td><code>update</code></td>
      <td>Declarações de atualização de Table, como <code>UPDATE</code></td>
    </tr>
  </tbody>
</table>

[Table 6.27, “Log and Abort Characteristics Per Event Class and Subclass Combination”](audit-log-filter-definitions.html#audit-log-event-subclass-log-abort "Table 6.27 Log and Abort Characteristics Per Event Class and Subclass Combination") descreve para cada subclasse de evento se ela pode ser registrada (logged) ou abortada (aborted).

**Table 6.27 Características de Registro e Abortamento por Combinação de Classe e Subclasse de Evento**

<table summary="Log and abort characteristics for event class and subclass combinations."><col style="width: 20%"/><col style="width: 20%"/><col style="width: 30%"/><col style="width: 30%"/><thead><tr> <th>Classe de Evento</th> <th>Subclasse de Evento</th> <th>Pode ser Registrado</th> <th>Pode ser Abortado</th> </tr></thead><tbody><tr> <th><code>connection</code></th> <td><code>connect</code></td> <td>Sim</td> <td>Não</td> </tr><tr> <th><code>connection</code></th> <td><code>change_user</code></td> <td>Sim</td> <td>Não</td> </tr><tr> <th><code>connection</code></th> <td><code>disconnect</code></td> <td>Sim</td> <td>Não</td> </tr><tr> <th><code>general</code></th> <td><code>status</code></td> <td>Sim</td> <td>Não</td> </tr><tr> <th><code>table_access</code></th> <td><code>read</code></td> <td>Sim</td> <td>Sim</td> </tr><tr> <th><code>table_access</code></th> <td><code>delete</code></td> <td>Sim</td> <td>Sim</td> </tr><tr> <th><code>table_access</code></th> <td><code>insert</code></td> <td>Sim</td> <td>Sim</td> </tr><tr> <th><code>table_access</code></th> <td><code>update</code></td> <td>Sim</td> <td>Sim</td> </tr></tbody></table>

##### Registro Inclusivo e Exclusivo

Um filtro pode ser definido em modo inclusivo ou exclusivo:

* O modo inclusivo registra apenas itens explicitamente especificados.
* O modo exclusivo registra tudo, exceto itens explicitamente especificados.

Para realizar o registro inclusivo, desabilite o registro globalmente e habilite o registro para classes específicas. Este filtro registra eventos `connect` e `disconnect` na classe `connection`, e eventos na classe `general`:

```sql
{
  "filter": {
    "log": false,
    "class": [
      {
        "name": "connection",
        "event": [
          { "name": "connect", "log": true },
          { "name": "disconnect", "log": true }
        ]
      },
      { "name": "general", "log": true }
    ]
  }
}
```

Para realizar o registro exclusivo, habilite o registro globalmente e desabilite o registro para classes específicas. Este filtro registra tudo, exceto eventos na classe `general`:

```sql
{
  "filter": {
    "log": true,
    "class":
      { "name": "general", "log": false }
  }
}
```

Este filtro registra eventos `change_user` na classe `connection` e eventos `table_access`, em virtude de *não* registrar todo o resto:

```sql
{
  "filter": {
    "log": true,
    "class": [
      {
        "name": "connection",
        "event": [
          { "name": "connect", "log": false },
          { "name": "disconnect", "log": false }
        ]
      },
      { "name": "general", "log": false }
    ]
  }
}
```

##### Testando Valores de Campos de Evento

Para habilitar o registro baseado em valores de campos de eventos específicos, especifique um item `field` dentro do item `log` que indica o nome do campo e seu valor esperado:

```sql
{
  "filter": {
    "class": {
    "name": "general",
      "event": {
        "name": "status",
        "log": {
          "field": { "name": "general_command.str", "value": "Query" }
        }
      }
    }
  }
}
```

Cada evento contém campos específicos da classe de evento que podem ser acessados dentro de um filtro para realizar filtragem personalizada.

Um evento na classe `connection` indica quando uma atividade relacionada à connection ocorre durante uma sessão, como um usuário conectando-se ou desconectando-se do servidor. [Table 6.28, “Connection Event Fields”](audit-log-filter-definitions.html#audit-log-connection-event-fields "Table 6.28 Connection Event Fields") indica os campos permitidos para eventos `connection`.

**Table 6.28 Campos de Evento de Connection**

<table summary="Permitted fields for connection events."><col style="width: 35%"/><col style="width: 20%"/><col style="width: 45%"/><thead><tr> <th>Nome do Campo</th> <th>Tipo de Campo</th> <th>Descrição</th> </tr></thead><tbody><tr> <th><code>status</code></th> <td>integer</td> <td><p> Status do Evento: </p><p> 0: OK </p><p> Caso contrário: Falha </p></td> </tr><tr> <th><code>connection_id</code></th> <td>unsigned integer</td> <td>ID da Connection</td> </tr><tr> <th><code>user.str</code></th> <td>string</td> <td>Nome de usuário especificado durante a autenticação</td> </tr><tr> <th><code>user.length</code></th> <td>unsigned integer</td> <td>Comprimento do nome de usuário</td> </tr><tr> <th><code>priv_user.str</code></th> <td>string</td> <td>Nome de usuário autenticado (nome de usuário da conta)</td> </tr><tr> <th><code>priv_user.length</code></th> <td>unsigned integer</td> <td>Comprimento do nome de usuário autenticado</td> </tr><tr> <th><code>external_user.str</code></th> <td>string</td> <td>Nome de usuário externo (fornecido por plugin de autenticação de terceiros)</td> </tr><tr> <th><code>external_user.length</code></th> <td>unsigned integer</td> <td>Comprimento do nome de usuário externo</td> </tr><tr> <th><code>proxy_user.str</code></th> <td>string</td> <td>Nome de usuário Proxy</td> </tr><tr> <th><code>proxy_user.length</code></th> <td>unsigned integer</td> <td>Comprimento do nome de usuário Proxy</td> </tr><tr> <th><code>host.str</code></th> <td>string</td> <td>Host do usuário conectado</td> </tr><tr> <th><code>host.length</code></th> <td>unsigned integer</td> <td>Comprimento do host do usuário conectado</td> </tr><tr> <th><code>ip.str</code></th> <td>string</td> <td>Endereço IP do usuário conectado</td> </tr><tr> <th><code>ip.length</code></th> <td>unsigned integer</td> <td>Comprimento do endereço IP do usuário conectado</td> </tr><tr> <th><code>database.str</code></th> <td>string</td> <td>Nome do Database especificado no momento da conexão</td> </tr><tr> <th><code>database.length</code></th> <td>unsigned integer</td> <td>Comprimento do nome do Database</td> </tr><tr> <th><code>connection_type</code></th> <td>integer</td> <td><p> Tipo de Connection: </p><p> 0 ou <code>"::undefined"</code>: Indefinido </p><p> 1 ou <code>"::tcp/ip"</code>: TCP/IP </p><p> 2 ou <code>"::socket"</code>: Socket </p><p> 3 ou <code>"::named_pipe"</code>: Named pipe </p><p> 4 ou <code>"::ssl"</code>: TCP/IP com criptografia </p><p> 5 ou <code>"::shared_memory"</code>: Shared memory </p></td> </tr></tbody></table>

Os valores `"::xxx"` são pseudo-constantes simbólicas que podem ser fornecidas em vez dos valores numéricos literais. Eles devem ser citados como strings e são case-sensitive.

Um evento na classe `general` indica o código de status de uma operação e seus detalhes. [Table 6.29, “General Event Fields”](audit-log-filter-definitions.html#audit-log-general-event-fields "Table 6.29 General Event Fields") indica os campos permitidos para eventos `general`.

**Table 6.29 Campos de Evento Geral**

<table summary="Permitted field types for general events."><col style="width: 35%"/><col style="width: 20%"/><col style="width: 45%"/><thead><tr> <th>Nome do Campo</th> <th>Tipo de Campo</th> <th>Descrição</th> </tr></thead><tbody><tr> <th><code>general_error_code</code></th> <td>integer</td> <td><p> Status do Evento: </p><p> 0: OK </p><p> Caso contrário: Falha </p></td> </tr><tr> <th><code>general_thread_id</code></th> <td>unsigned integer</td> <td>ID da Connection/Thread</td> </tr><tr> <th><code>general_user.str</code></th> <td>string</td> <td>Nome de usuário especificado durante a autenticação</td> </tr><tr> <th><code>general_user.length</code></th> <td>unsigned integer</td> <td>Comprimento do nome de usuário</td> </tr><tr> <th><code>general_command.str</code></th> <td>string</td> <td>Nome do Command</td> </tr><tr> <th><code>general_command.length</code></th> <td>unsigned integer</td> <td>Comprimento do nome do Command</td> </tr><tr> <th><code>general_query.str</code></th> <td>string</td> <td>Texto da Declaração SQL</td> </tr><tr> <th><code>general_query.length</code></th> <td>unsigned integer</td> <td>Comprimento do texto da Declaração SQL</td> </tr><tr> <th><code>general_host.str</code></th> <td>string</td> <td>Nome do Host</td> </tr><tr> <th><code>general_host.length</code></th> <td>unsigned integer</td> <td>Comprimento do nome do Host</td> </tr><tr> <th><code>general_sql_command.str</code></th> <td>string</td> <td>Nome do tipo de Command SQL</td> </tr><tr> <th><code>general_sql_command.length</code></th> <td>unsigned integer</td> <td>Comprimento do nome do tipo de Command SQL</td> </tr><tr> <th><code>general_external_user.str</code></th> <td>string</td> <td>Nome de usuário externo (fornecido por plugin de autenticação de terceiros)</td> </tr><tr> <th><code>general_external_user.length</code></th> <td>unsigned integer</td> <td>Comprimento do nome de usuário externo</td> </tr><tr> <th><code>general_ip.str</code></th> <td>string</td> <td>Endereço IP do usuário conectado</td> </tr><tr> <th><code>general_ip.length</code></th> <td>unsigned integer</td> <td>Comprimento do endereço IP do usuário conectado</td> </tr></tbody></table>

`general_command.str` indica um nome de Command: `Query`, `Execute`, `Quit` ou `Change user`.

Um evento `general` com o campo `general_command.str` definido como `Query` ou `Execute` contém `general_sql_command.str` definido para um valor que especifica o tipo de Command SQL: `alter_db`, `alter_db_upgrade`, `admin_commands`, e assim por diante. Os valores `general_sql_command.str` disponíveis podem ser vistos como os últimos componentes dos instrumentos Performance Schema exibidos por esta declaração:

```sql
mysql> SELECT NAME FROM performance_schema.setup_instruments
       WHERE NAME LIKE 'statement/sql/%' ORDER BY NAME;
+---------------------------------------+
| NAME                                  |
+---------------------------------------+
| statement/sql/alter_db                |
| statement/sql/alter_db_upgrade        |
| statement/sql/alter_event             |
| statement/sql/alter_function          |
| statement/sql/alter_instance          |
| statement/sql/alter_procedure         |
| statement/sql/alter_server            |
...
```

Um evento na classe `table_access` fornece informações sobre um tipo específico de acesso a uma Table. [Table 6.30, “Table-Access Event Fields”](audit-log-filter-definitions.html#audit-log-table-access-event-fields "Table 6.30 Table-Access Event Fields") indica os campos permitidos para eventos `table_access`.

**Table 6.30 Campos de Evento de Acesso a Table**

<table summary="Permitted fields for table-access events."><col style="width: 35%"/><col style="width: 20%"/><col style="width: 45%"/><thead><tr> <th>Nome do Campo</th> <th>Tipo de Campo</th> <th>Descrição</th> </tr></thead><tbody><tr> <th><code>connection_id</code></th> <td>unsigned integer</td> <td>ID da Connection do Evento</td> </tr><tr> <th><code>sql_command_id</code></th> <td>integer</td> <td>ID do Comando SQL</td> </tr><tr> <th><code>query.str</code></th> <td>string</td> <td>Texto da Declaração SQL</td> </tr><tr> <th><code>query.length</code></th> <td>unsigned integer</td> <td>Comprimento do texto da Declaração SQL</td> </tr><tr> <th><code>table_database.str</code></th> <td>string</td> <td>Nome do Database associado ao evento</td> </tr><tr> <th><code>table_database.length</code></th> <td>unsigned integer</td> <td>Comprimento do nome do Database</td> </tr><tr> <th><code>table_name.str</code></th> <td>string</td> <td>Nome da Table associada ao evento</td> </tr><tr> <th><code>table_name.length</code></th> <td>unsigned integer</td> <td>Comprimento do nome da Table</td> </tr></tbody></table>

A lista a seguir mostra quais declarações produzem quais eventos de acesso à Table:

* Evento `read`:

  + `SELECT`
  + `INSERT ... SELECT` (para Tables referenciadas na cláusula `SELECT`)

  + `REPLACE ... SELECT` (para Tables referenciadas na cláusula `SELECT`)

  + `UPDATE ... WHERE` (para Tables referenciadas na cláusula `WHERE`)

  + `HANDLER ... READ`
* Evento `delete`:

  + `DELETE`
  + `TRUNCATE TABLE`
* Evento `insert`:

  + `INSERT`
  + `INSERT ... SELECT` (para Table referenciada na cláusula `INSERT`)

  + `REPLACE`
  + `REPLACE ... SELECT` (para Table referenciada na cláusula `REPLACE`)

  + `LOAD DATA`
  + `LOAD XML`
* Evento `update`:

  + `UPDATE`
  + `UPDATE ... WHERE` (para Tables referenciadas na cláusula `UPDATE`)

##### Bloqueando a Execução de Eventos Específicos

A partir do MySQL 5.7.20, os itens `event` podem incluir um item `abort` que indica se deve impedir a execução de eventos qualificadores. `abort` permite que regras sejam escritas para bloquear a execução de declarações SQL específicas.

O item `abort` deve aparecer dentro de um item `event`. Por exemplo:

```sql
"event": {
  "name": qualifying event subclass names
  "abort": condition
}
```

Para subclasses de eventos selecionadas pelo item `name`, a ação `abort` é true ou false, dependendo da avaliação da *`condition`*. Se a condição for avaliada como true, o evento é bloqueado. Caso contrário, o evento continua a ser executado.

A especificação da *`condition`* pode ser tão simples quanto `true` ou `false`, ou pode ser mais complexa, dependendo das características do evento.

Este filtro bloqueia as declarações [`INSERT`](insert.html "13.2.5 INSERT Statement"), [`UPDATE`](update.html "13.2.11 UPDATE Statement") e [`DELETE`](delete.html "13.2.2 DELETE Statement"):

```sql
{
  "filter": {
    "class": {
      "name": "table_access",
      "event": {
        "name": [ "insert", "update", "delete" ],
        "abort": true
      }
    }
  }
}
```

Este filtro mais complexo bloqueia as mesmas declarações, mas apenas para uma Table específica (`finances.bank_account`):

```sql
{
  "filter": {
    "class": {
      "name": "table_access",
      "event": {
        "name": [ "insert", "update", "delete" ],
        "abort": {
          "and": [
            { "field": { "name": "table_database.str", "value": "finances" } },
            { "field": { "name": "table_name.str", "value": "bank_account" } }
          ]
        }
      }
    }
  }
}
```

Declarações correspondidas e bloqueadas pelo filtro retornam um erro ao cliente:

```sql
ERROR 1045 (28000): Statement was aborted by an audit log filter
```

Nem todos os eventos podem ser bloqueados (veja [Table 6.27, “Log and Abort Characteristics Per Event Class and Subclass Combination”](audit-log-filter-definitions.html#audit-log-event-subclass-log-abort "Table 6.27 Log and Abort Characteristics Per Event Class and Subclass Combination")). Para um evento que não pode ser bloqueado, o audit log escreve um aviso no error log em vez de bloqueá-lo.

Para tentativas de definir um filtro no qual o item `abort` aparece em outro lugar que não seja um item `event`, ocorre um erro.

##### Operadores Lógicos

Operadores lógicos (`and`, `or`, `not`) permitem a construção de condições complexas, possibilitando a escrita de configurações de filtragem mais avançadas. O seguinte item `log` registra apenas eventos `general` com campos `general_command` que possuem um valor e comprimento específicos:

```sql
{
  "filter": {
    "class": {
      "name": "general",
      "event": {
        "name": "status",
        "log": {
          "or": [
            {
              "and": [
                { "field": { "name": "general_command.str",    "value": "Query" } },
                { "field": { "name": "general_command.length", "value": 5 } }
              ]
            },
            {
              "and": [
                { "field": { "name": "general_command.str",    "value": "Execute" } },
                { "field": { "name": "general_command.length", "value": 7 } }
              ]
            }
          ]
        }
      }
    }
  }
}
```

##### Referenciando Variáveis Predefinidas

Para referir-se a uma variável predefinida em uma condição `log`, use um item `variable`, que aceita itens `name` e `value` e testa a igualdade da variável nomeada em relação a um valor fornecido:

```sql
"variable": {
  "name": "variable_name",
  "value": comparison_value
}
```

Isso é true se *`variable_name`* tiver o valor *`comparison_value`*, false caso contrário.

Exemplo:

```sql
{
  "filter": {
    "class": {
      "name": "general",
      "event": {
        "name": "status",
        "log": {
          "variable": {
            "name": "audit_log_connection_policy_value",
            "value": "::none"
          }
        }
      }
    }
  }
}
```

Cada variável predefinida corresponde a uma variável de sistema. Ao escrever um filtro que testa uma variável predefinida, você pode modificar a operação do filtro definindo a variável de sistema correspondente, sem ter que redefinir o filtro. Por exemplo, ao escrever um filtro que testa o valor da variável predefinida `audit_log_connection_policy_value`, você pode modificar a operação do filtro alterando o valor da variável de sistema [`audit_log_connection_policy`](audit-log-reference.html#sysvar_audit_log_connection_policy).

As variáveis de sistema `audit_log_xxx_policy` são usadas para o audit log em modo legado (veja [Section 6.4.5.10, “Legacy Mode Audit Log Filtering”](audit-log-legacy-filtering.html "6.4.5.10 Legacy Mode Audit Log Filtering")). Com a filtragem do audit log baseada em regras, essas variáveis permanecem visíveis (por exemplo, usando [`SHOW VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement")), mas as alterações nelas não têm efeito a menos que você escreva filtros contendo constructos que se refiram a elas.

A lista a seguir descreve as variáveis predefinidas permitidas para itens `variable`:

* `audit_log_connection_policy_value`

  Esta variável corresponde ao valor da variável de sistema [`audit_log_connection_policy`](audit-log-reference.html#sysvar_audit_log_connection_policy). O valor é um unsigned integer. [Table 6.31, “audit_log_connection_policy_value Values”](audit-log-filter-definitions.html#audit-log-connection-policy-value-values "Table 6.31 audit_log_connection_policy_value Values") mostra os valores permitidos e os valores [`audit_log_connection_policy`](audit-log-reference.html#sysvar_audit_log_connection_policy) correspondentes.

  **Table 6.31 Valores de audit_log_connection_policy_value**

  <table summary="Permitted audit_log_connection_policy_value values and the corresponding audit_log_connection_policy values."><thead><tr> <th>Valor</th> <th>Valor Correspondente de audit_log_connection_policy</th> </tr></thead><tbody><tr> <td><code>0</code> ou <code>"::none"</code></td> <td><code>NONE</code></td> </tr><tr> <td><code>1</code> ou <code>"::errors"</code></td> <td><code>ERRORS</code></td> </tr><tr> <td><code>2</code> ou <code>"::all"</code></td> <td><code>ALL</code></td> </tr></tbody></table>

  Os valores `"::xxx"` são pseudo-constantes simbólicas que podem ser fornecidas em vez dos valores numéricos literais. Eles devem ser citados como strings e são case-sensitive.

* `audit_log_policy_value`

  Esta variável corresponde ao valor da variável de sistema [`audit_log_policy`](audit-log-reference.html#sysvar_audit_log_policy). O valor é um unsigned integer. [Table 6.32, “audit_log_policy_value Values”](audit-log-filter-definitions.html#audit-log-policy-value-values "Table 6.32 audit_log_policy_value Values") mostra os valores permitidos e os valores [`audit_log_policy`](audit-log-reference.html#sysvar_audit_log_policy) correspondentes.

  **Table 6.32 Valores de audit_log_policy_value**

  <table summary="Permitted audit_log_policy_value values and the corresponding audit_log_policy values."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Valor</th> <th>Valor Correspondente de audit_log_policy</th> </tr></thead><tbody><tr> <td><code>0</code> ou <code>"::none"</code></td> <td><code>NONE</code></td> </tr><tr> <td><code>1</code> ou <code>"::logins"</code></td> <td><code>LOGINS</code></td> </tr><tr> <td><code>2</code> ou <code>"::all"</code></td> <td><code>ALL</code></td> </tr><tr> <td><code>3</code> ou <code>"::queries"</code></td> <td><code>QUERIES</code></td> </tr></tbody></table>

  Os valores `"::xxx"` são pseudo-constantes simbólicas que podem ser fornecidas em vez dos valores numéricos literais. Eles devem ser citados como strings e são case-sensitive.

* `audit_log_statement_policy_value`

  Esta variável corresponde ao valor da variável de sistema [`audit_log_statement_policy`](audit-log-reference.html#sysvar_audit_log_statement_policy). O valor é um unsigned integer. [Table 6.33, “audit_log_statement_policy_value Values”](audit-log-filter-definitions.html#audit-log-statement-policy-value-values "Table 6.33 audit_log_statement_policy_value Values") mostra os valores permitidos e os valores [`audit_log_statement_policy`](audit-log-reference.html#sysvar_audit_log_statement_policy) correspondentes.

  **Table 6.33 Valores de audit_log_statement_policy_value**

  <table summary="Permitted audit_log_statement_policy_value values and the corresponding audit_log_statement_policy values."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Valor</th> <th>Valor Correspondente de audit_log_statement_policy</th> </tr></thead><tbody><tr> <td><code>0</code> ou <code>"::none"</code></td> <td><code>NONE</code></td> </tr><tr> <td><code>1</code> ou <code>"::errors"</code></td> <td><code>ERRORS</code></td> </tr><tr> <td><code>2</code> ou <code>"::all"</code></td> <td><code>ALL</code></td> </tr></tbody></table>

  Os valores `"::xxx"` são pseudo-constantes simbólicas que podem ser fornecidas em vez dos valores numéricos literais. Eles devem ser citados como strings e são case-sensitive.

##### Referenciando Funções Predefinidas

Para referir-se a uma função predefinida em uma condição `log`, use um item `function`, que aceita itens `name` e `args` para especificar o nome da função e seus argumentos, respectivamente:

```sql
"function": {
  "name": "function_name",
  "args": arguments
}
```

O item `name` deve especificar apenas o nome da função, sem parênteses ou a lista de argumentos.

O item `args` deve satisfazer estas condições:

* Se a função não aceitar argumentos, nenhum item `args` deve ser fornecido.

* Se a função aceitar argumentos, um item `args` é necessário, e os argumentos devem ser fornecidos na ordem listada na descrição da função. Os argumentos podem se referir a variáveis predefinidas, campos de evento ou constantes string ou numéricas.

Se o número de argumentos estiver incorreto ou os argumentos não forem dos tipos de dados corretos exigidos pela função, ocorre um erro.

Exemplo:

```sql
{
  "filter": {
    "class": {
      "name": "general",
      "event": {
        "name": "status",
        "log": {
          "function": {
            "name": "find_in_include_list",
            "args": [ { "string": [ { "field": "user.str" },
                                    { "string": "@"},
                                    { "field": "host.str" } ] } ]
          }
        }
      }
    }
  }
}
```

O filtro anterior determina se deve registrar eventos de `status` da classe `general` dependendo se o usuário atual é encontrado na variável de sistema [`audit_log_include_accounts`](audit-log-reference.html#sysvar_audit_log_include_accounts). Esse usuário é construído usando campos no evento.

A lista a seguir descreve as funções predefinidas permitidas para itens `function`:

* `audit_log_exclude_accounts_is_null()`

  Verifica se a variável de sistema [`audit_log_exclude_accounts`](audit-log-reference.html#sysvar_audit_log_exclude_accounts) é `NULL`. Esta função pode ser útil ao definir filtros que correspondem à implementação do audit log legado.

  Argumentos:

  Nenhum.

* `audit_log_include_accounts_is_null()`

  Verifica se a variável de sistema [`audit_log_include_accounts`](audit-log-reference.html#sysvar_audit_log_include_accounts) é `NULL`. Esta função pode ser útil ao definir filtros que correspondem à implementação do audit log legado.

  Argumentos:

  Nenhum.

* `debug_sleep(millisec)`

  Suspende a execução (sleep) pelo número de milissegundos fornecido. Esta função é usada durante a medição de performance.

  `debug_sleep()` está disponível apenas para compilações de debug.

  Argumentos:

  + *`millisec`*: Um unsigned integer que especifica o número de milissegundos para suspender.

* `find_in_exclude_list(account)`

  Verifica se uma string de conta existe na lista de exclusão do audit log (o valor da variável de sistema [`audit_log_exclude_accounts`](audit-log-reference.html#sysvar_audit_log_exclude_accounts)).

  Argumentos:

  + *`account`*: Uma string que especifica o nome da conta de usuário.

* `find_in_include_list(account)`

  Verifica se uma string de conta existe na lista de inclusão do audit log (o valor da variável de sistema [`audit_log_include_accounts`](audit-log-reference.html#sysvar_audit_log_include_accounts)).

  Argumentos:

  + *`account`*: Uma string que especifica o nome da conta de usuário.

* `string_find(text, substr)`

  Verifica se o valor `substr` está contido no valor `text`. Esta pesquisa é case-sensitive.

  Argumentos:

  + *`text`*: A string de texto para pesquisar.

  + *`substr`*: A substring a ser procurada em *`text`*.

##### Substituindo um Filtro de Usuário

Em alguns casos, a definição do filtro pode ser alterada dinamicamente. Para fazer isso, defina uma configuração `filter` dentro de um `filter` existente. Por exemplo:

```sql
{
  "filter": {
    "id": "main",
    "class": {
      "name": "table_access",
      "event": {
        "name": [ "update", "delete" ],
        "log": false,
        "filter": {
          "class": {
            "name": "general",
            "event" : { "name": "status",
                        "filter": { "ref": "main" } }
          },
          "activate": {
            "or": [
              { "field": { "name": "table_name.str", "value": "temp_1" } },
              { "field": { "name": "table_name.str", "value": "temp_2" } }
            ]
          }
        }
      }
    }
  }
}
```

Um novo filtro é ativado quando o item `activate` dentro de um subfiltro é avaliado como `true`. Usar `activate` em um `filter` de nível superior não é permitido.

Um novo filtro pode ser substituído pelo original usando um item `ref` dentro do subfiltro para referir-se ao `id` do filtro original.

O filtro mostrado opera da seguinte forma:

* O filtro `main` espera por eventos `table_access`, seja `update` ou `delete`.

* Se o evento `table_access` de `update` ou `delete` ocorrer na Table `temp_1` ou `temp_2`, o filtro é substituído pelo filtro interno (sem um `id`, já que não há necessidade de se referir a ele explicitamente).

* Se o fim do comando for sinalizado (evento `general` / `status`), uma entrada é escrita no arquivo de audit log e o filtro é substituído pelo filtro `main`.

O filtro é útil para registrar declarações que atualizam ou excluem algo das Tables `temp_1` ou `temp_2`, como esta:

```sql
UPDATE temp_1, temp_3 SET temp_1.a=21, temp_3.a=23;
```

A declaração gera múltiplos eventos `table_access`, mas o arquivo de audit log contém apenas entradas `general` ou `status`.

Nota

Quaisquer valores `id` usados na definição são avaliados apenas em relação a essa definição. Eles não têm nada a ver com o valor da variável de sistema [`audit_log_filter_id`](audit-log-reference.html#sysvar_audit_log_filter_id).