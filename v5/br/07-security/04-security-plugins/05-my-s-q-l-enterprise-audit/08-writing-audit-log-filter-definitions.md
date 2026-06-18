#### 6.4.5.8 Escrever definições de filtro do log de auditoria

As definições de filtro são valores de `JSON`. Para obter informações sobre o uso dos dados de `JSON` no MySQL, consulte Seção 11.5, “O Tipo de Dados JSON”.

As definições de filtro têm essa forma, onde *`ações`* indica como o filtro é realizado:

```json
{ "filter": actions }
```

A discussão a seguir descreve as construções permitidas nas definições de filtro.

- Registrar todos os eventos
- Registro de Classes Específicas de Eventos
- Registro de subcategorias específicas de eventos
- Registro Inclusivo e Exclusivo
- Teste de campos de eventos de registro de auditoria
- Bloquear a execução de eventos específicos
- Operadores lógicos
- Referência a variáveis pré-definidas
- Referência a Funções Predefinidas
- Substituir um filtro de usuário

##### Registro de todos os eventos

Para habilitar ou desabilitar explicitamente o registro de todos os eventos, use um item `log` no filtro:

```json
{
  "filter": { "log": true }
}
```

O valor `log` pode ser `true` ou `false`.

O filtro anterior permite o registro de todos os eventos. É equivalente a:

```json
{
  "filter": { }
}
```

O comportamento de registro depende do valor `log` e se os itens `class` ou `event` são especificados:

- Com `log` especificado, seu valor fornecido é usado.

- Sem a especificação de `log`, o registro é `true` se nenhum item `class` ou `event` for especificado e `false` caso contrário (neste caso, `class` ou `event` podem incluir seu próprio item `log`).

##### Registro de Classes Específicas de Eventos

Para registrar eventos de uma classe específica, use um item `class` no filtro, com seu campo `name` indicando o nome da classe a ser registrada:

```json
{
  "filter": {
    "class": { "name": "connection" }
  }
}
```

O valor `name` pode ser `connection`, `general` ou `table_access` para registrar eventos de conexão, gerais ou de acesso à tabela, respectivamente.

O filtro anterior permite o registro de eventos na classe `connection`. É equivalente ao seguinte filtro com os itens `log` explicitamente definidos:

```json
{
  "filter": {
    "log": false,
    "class": { "log": true,
               "name": "connection" }
  }
}
```

Para habilitar o registro de múltiplas classes, defina o valor `class` como um elemento de array de JSON que nomeia as classes:

```json
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

Quando várias instâncias de um item específico aparecem no mesmo nível dentro de uma definição de filtro, os valores do item podem ser combinados em uma única instância desse item dentro de um valor de matriz. A definição anterior pode ser escrita da seguinte forma:

```json
{
  "filter": {
    "class": [
      { "name": [ "connection", "general", "table_access" ] }
    ]
  }
}
```

##### Registro de Subclasses Específicas de Eventos

Para selecionar subcategorias de eventos específicas, use um item `event` contendo um item `name` que nomeia as subcategorias. A ação padrão para eventos selecionados por um item `event` é registrar-los. Por exemplo, este filtro habilita o registro para as subcategorias de eventos nomeadas:

```json
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

O item `event` também pode conter itens `log` explícitos para indicar se os eventos qualificadores devem ser registrados. Este item `event` seleciona vários eventos e indica explicitamente o comportamento de registro para eles:

```json
"event": [
  { "name": "read", "log": false },
  { "name": "insert", "log": true },
  { "name": "delete", "log": true },
  { "name": "update", "log": true }
]
```

A partir do MySQL 5.7.20, o item `event` também pode indicar se os eventos qualificados devem ser bloqueados, se ele contiver um item `abort`. Para obter detalhes, consulte Bloqueando a Execução de Eventos Específicos.

A Tabela 6.26, “Combinações de Classe e Subclasse de Eventos” (audit-log-filter-definitions.html#audit-log-event-subclass-combinations) descreve os valores permitidos para cada subclasse de evento.

**Tabela 6.26 Combinações de Classe e Subclasse de Eventos**

<table summary="Combinações permitidas de valores de classe e subclasse de evento."><col style="width: 20%"/><col style="width: 20%"/><col style="width: 60%"/><thead><tr><th>Classe de Evento</th><th>Subclasse de Evento</th><th>Descrição</th></tr></thead><tbody><tr><th><code>connection</code></th><td><code>connect</code></td><td>Iniciação da conexão (bem-sucedida ou malsucedida)</td></tr><tr><th><code>connection</code></th><td><code>change_user</code></td><td>Reautenticação de usuário com usuário/senha diferente durante a sessão</td></tr><tr><th><code>connection</code></th><td><code>disconnect</code></td><td>Término da conexão</td></tr><tr><th><code>general</code></th><td><code>status</code></td><td>Informações gerais de operação</td></tr><tr><th><code>table_access</code></th><td><code>read</code></td><td>Instruções de leitura de tabela, como <code>SELECT</code> ou <code>INSERT INTO ... SELECT</code></td></tr><tr><th><code>table_access</code></th><td><code>delete</code></td><td>Instruções de exclusão de tabela, como <code>DELETE</code> ou <code>TRUNCATE TABLE</code></td></tr><tr><th><code>table_access</code></th><td><code>insert</code></td><td>Instruções de inserção de tabela, como <code>INSERT</code> ou <code>REPLACE</code></td></tr><tr><th><code>table_access</code></th><td><code>update</code></td><td>Instruções de atualização de tabela, como <code>UPDATE</code></td></tr></tbody></table>

Tabela 6.27, “Características de registro e interrupção por combinação de classe e subclasse de evento” descreve, para cada subclasse de evento, se ela pode ser registrada ou interrompida.

**Tabela 6.27 Características de registro e interrupção por classe de evento e combinação de subclasses**

<table summary="Características de registro e interrupção para combinações de classe e subclasse de eventos."><thead><tr><th>Classe de Evento</th><th>Subclasse de Evento</th><th>Pode ser registrado</th><th>Pode ser abortado</th></tr></thead><tbody><tr><th><code>connection</code></th><td><code>connect</code></td><td>Sim</td><td>Não</td></tr><tr><th><code>connection</code></th><td><code>change_user</code></td><td>Sim</td><td>Não</td></tr><tr><th><code>connection</code></th><td><code>disconnect</code></td><td>Sim</td><td>Não</td></tr><tr><th><code>general</code></th><td><code>status</code></td><td>Sim</td><td>Não</td></tr><tr><th><code>table_access</code></th><td><code>read</code></td><td>Sim</td><td>Sim</td></tr><tr><th><code>table_access</code></th><td><code>delete</code></td><td>Sim</td><td>Sim</td></tr><tr><th><code>table_access</code></th><td><code>insert</code></td><td>Sim</td><td>Sim</td></tr><tr><th><code>table_access</code></th><td><code>update</code></td><td>Sim</td><td>Sim</td></tr></tbody></table>

##### Registros inclusivos e exclusivos

Um filtro pode ser definido no modo inclusivo ou exclusivo:

- O modo inclusivo registra apenas itens especificados explicitamente.
- O modo exclusivo registra tudo, exceto itens especificamente indicados.

Para realizar o registro inclusivo, desative o registro globalmente e habilite o registro para classes específicas. Esse filtro registra os eventos `connect` e `disconnect` na classe `connection` e eventos na classe `general`:

```json
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

Para realizar o registro exclusivo, habilite o registro globalmente e desative o registro para classes específicas. Esse filtro registra tudo, exceto eventos na classe `general`:

```json
{
  "filter": {
    "log": true,
    "class":
      { "name": "general", "log": false }
  }
}
```

Este filtro registra eventos `change_user` na classe `connection` e eventos `table_access`, em virtude de não registrar tudo o mais:

```json
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

##### Testando os valores do campo do evento

Para habilitar o registro com base em valores específicos de campos de evento, especifique um item `campo` dentro do item `log` que indique o nome do campo e seu valor esperado:

```json
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

Cada evento contém campos específicos da classe do evento que podem ser acessados dentro de um filtro para realizar filtragem personalizada.

Um evento na classe `connection` indica quando uma atividade relacionada à conexão ocorre durante uma sessão, como um usuário se conectando ou desconectando do servidor. Tabela 6.28, “Campos de Evento de Conexão” indica os campos permitidos para eventos de `connection`.

**Tabela 6.28 Campos de Eventos de Conexão**

<table summary="Campos permitidos para eventos de conexão."><thead><tr><th>Nome do campo</th><th>Tipo de campo</th><th>Descrição</th></tr></thead><tbody><tr><th><code>status</code></th><td>integer</td><td><p> Event status: </p><p> 0: OK </p><p> Otherwise: Failed </p></td></tr><tr><th><code>connection_id</code></th><td>unsigned integer</td><td>ID de conexão</td></tr><tr><th><code>user.str</code></th><td>string</td><td>Nome de usuário especificado durante a autenticação</td></tr><tr><th><code>user.length</code></th><td>unsigned integer</td><td>Comprimento do nome de usuário</td></tr><tr><th><code>priv_user.str</code></th><td>string</td><td>Nome de usuário autenticado (nome de usuário da conta)</td></tr><tr><th><code>priv_user.length</code></th><td>unsigned integer</td><td>Comprimento do nome de usuário autenticado</td></tr><tr><th><code>external_user.str</code></th><td>string</td><td>Nome de usuário externo (fornecido pelo plugin de autenticação de terceiros)</td></tr><tr><th><code>external_user.length</code></th><td>unsigned integer</td><td>Comprimento do nome de usuário externo</td></tr><tr><th><code>proxy_user.str</code></th><td>string</td><td>Nome de usuário proxy</td></tr><tr><th><code>proxy_user.length</code></th><td>unsigned integer</td><td>Comprimento do nome de usuário proxy</td></tr><tr><th><code>host.str</code></th><td>string</td><td>Host de usuário conectado</td></tr><tr><th><code>host.length</code></th><td>unsigned integer</td><td>Comprimento do host do usuário conectado</td></tr><tr><th><code>ip.str</code></th><td>string</td><td>Endereço IP do usuário conectado</td></tr><tr><th><code>ip.length</code></th><td>unsigned integer</td><td>Comprimento do endereço IP do usuário conectado</td></tr><tr><th><code>database.str</code></th><td>string</td><td>Nome do banco de dados especificado no momento da conexão</td></tr><tr><th><code>database.length</code></th><td>unsigned integer</td><td>Comprimento do nome do banco de dados</td></tr><tr><th><code>connection_type</code></th><td>integer</td><td><p> Tipo de conexão: </p><p> 0 ou <code>"::undefined"</code>: Undefined </p><p> 1 ou <code>"::tcp/ip"</code>: TCP/IP </p><p> 2 ou <code>"::socket"</code>: Socket </p><p> 3 ou <code>"::named_pipe"</code>: Named pipe </p><p> 4 ou <code>"::ssl"</code>: TCP/IP with encryption </p><p> 5 ou <code>"::shared_memory"</code>: Shared memory </p></td></tr></tbody></table>

Os valores `"::xxx"` são pseudo-constantes simbólicas que podem ser usados em vez dos valores numéricos literais. Eles devem ser citados como strings e são sensíveis a maiúsculas e minúsculas.

Um evento na classe `general` indica o código de status de uma operação e seus detalhes. Tabela 6.29, “Campos de Evento Geral” indica os campos permitidos para eventos `general`.

**Tabela 6.29 Campos Gerais de Evento**

<table summary="Tipos de campo permitidos para eventos gerais."><col style="width: 35%"/><col style="width: 20%"/><col style="width: 45%"/><thead><tr> <th>Nome do campo</th> <th>Tipo de campo</th> <th>Descrição</th> </tr></thead><tbody><tr> <th><code>general_error_code</code></th> <td>inteiro</td> <td><p> Status do evento: </p><p> 0: OK </p><p> Caso contrário: falhou </p></td> </tr><tr> <th><code>general_thread_id</code></th> <td>número inteiro não assinado</td> <td>ID de conexão/thread</td> </tr><tr> <th><code>general_user.str</code></th> <td>string</td> <td>Nome de usuário especificado durante a autenticação</td> </tr><tr> <th><code>general_user.length</code></th> <td>número inteiro não assinado</td> <td>Comprimento do nome de usuário</td> </tr><tr> <th><code>general_command.str</code></th> <td>string</td> <td>Nome do comando</td> </tr><tr> <th><code>general_command.length</code></th> <td>número inteiro não assinado</td> <td>Comprimento do nome do comando</td> </tr><tr> <th><code>general_query.str</code></th> <td>string</td> <td>Texto da instrução SQL</td> </tr><tr> <th><code>general_query.length</code></th> <td>número inteiro não assinado</td> <td>comprimento do texto da instrução SQL</td> </tr><tr> <th><code>general_host.str</code></th> <td>string</td> <td>Nome do host</td> </tr><tr> <th><code>general_host.length</code></th> <td>unsigned inteiro</td> <td>Comprimento do nome do host</td> </tr><tr> <th><code>general_sql_command.str</code></th> <td>string</td> <td>Nome do tipo de comando SQL</td> </tr><tr> <th><code>general_sql_command.length</code></th> <td>Inteiro não assinado</td> <td>Comprimento do nome do tipo de comando SQL</td> </tr><tr> <th><code>general_external_user.str</code></th> <td>string</td> <td>Nome de usuário externo (fornecido por plug-in de autenticação de terceiros)</td> </tr><tr> <th><code>general_external_user.length</code></th> <td>número inteiro não assinado</td> <td>Comprimento do nome de usuário externo</td> </tr><tr> <th><code>general_ip.str</code></th> <td>string</td> <td>Endereço IP do usuário conectado</td> </tr><tr> <th><code>general_ip.length</code></th> <td>número inteiro não assinado</td> <td>Comprimento do endereço IP do usuário de conexão</td> </tr></tbody></table>

`general_command.str` indica um nome de comando: `Query`, `Execute`, `Sair` ou `Mudar usuário`.

Um evento `geral` com o campo `general_command.str` definido como `Query` ou `Execute` contém `general_sql_command.str` definido para um valor que especifica o tipo de comando SQL: `alter_db`, `alter_db_upgrade`, `admin_commands`, e assim por diante. Os valores `general_sql_command.str` disponíveis podem ser vistos como os últimos componentes dos instrumentos do Schema de Desempenho exibidos por esta declaração:

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

Um evento na classe `table_access` fornece informações sobre um tipo específico de acesso a uma tabela. Tabela 6.30, “Campos de eventos de acesso à tabela” indica os campos permitidos para eventos de `table_access`.

**Tabela 6.30 Campos de eventos de acesso à tabela**

<table summary="Campos permitidos para eventos de acesso à tabela."><col style="width: 35%"/><col style="width: 20%"/><col style="width: 45%"/><thead><tr> <th>Nome do campo</th> <th>Tipo de campo</th> <th>Descrição</th> </tr></thead><tbody><tr> <th><code>connection_id</code></th> <td>inteiro não assinado</td> <td>ID de conexão do evento</td> </tr><tr> <th><code>sql_command_id</code></th> <td>inteiro</td> <td>ID do comando SQL</td> </tr><tr> <th><code>query.str</code></th> <td>string</td> <td>Texto da instrução SQL</td> </tr><tr> <th><code>query.length</code></th> <td>inteiro não assinado</td> <td>Texto do comando SQL</td> </tr><tr> <th><code>table_database.str</code></th> <td>string</td> <td>Nome do banco de dados associado ao evento</td> </tr><tr> <th><code>table_database.length</code></th> <td>inteiro não assinado</td> <td>Nome do banco de dados</td> </tr><tr> <th><code>table_name.str</code></th> <td>string</td> <td>Nome da tabela associado ao evento</td> </tr><tr> <th><code>table_name.length</code></th> <td>inteiro não assinado</td> <td>Nome da tabela</td> </tr></tbody></table>

A lista a seguir mostra quais declarações geram quais eventos de acesso à tabela:

- Evento `read`:

  - `SELECT`

  - `INSERT ... SELECT` (para tabelas referenciadas na cláusula `SELECT`)

  - `REPLACE ... SELECT` (para tabelas referenciadas na cláusula `SELECT`)

  - `UPDATE ... WHERE` (para tabelas referenciadas na cláusula `WHERE`)

  - `HANDLER ... READ`
- Evento `delete`:

  - `DELETE`
  - `TRUNCATE TABLE`
- Evento `inserir`:

  - `INSERT`

  - `INSERT ... SELECT` (para a tabela referenciada na cláusula `INSERT`)

  - `REPLACAR`

  - `REPLACE ... SELECT` (para a tabela referenciada na cláusula `REPLACE`

  - `LOAD DATA`

  - `LOAD XML`
- Evento `update`:

  - `UPDATE`
  - `UPDATE ... WHERE` (para tabelas referenciadas na cláusula `UPDATE`)

##### Bloquear a execução de eventos específicos

A partir do MySQL 5.7.20, os itens `event` podem incluir um item `abort` que indica se os eventos qualificados devem ser impedidos de serem executados. O `abort` permite a criação de regras que bloqueiam a execução de instruções SQL específicas.

O item `abort` deve aparecer dentro de um item `event`. Por exemplo:

```json
"event": {
  "name": qualifying event subclass names
  "abort": condition
}
```

Para subclasses de eventos selecionadas pelo item `name`, a ação `abort` é verdadeira ou falsa, dependendo da avaliação da condição. Se a condição for avaliada como verdadeira, o evento é bloqueado. Caso contrário, o evento continua sendo executado.

A especificação de *`condition`* pode ser tão simples quanto `true` ou `false`, ou pode ser mais complexa, de modo que a avaliação dependa das características do evento.

Este filtro bloqueia as instruções `INSERT`, `UPDATE` e `DELETE`:

```json
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

Esse filtro mais complexo bloqueia as mesmas declarações, mas apenas para uma tabela específica (`finances.bank_account`):

```json
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

As declarações que correspondem e são bloqueadas pelo filtro retornam um erro ao cliente:

```sql
ERROR 1045 (28000): Statement was aborted by an audit log filter
```

Nem todos os eventos podem ser bloqueados (consulte Tabela 6.27, “Características de registro e interrupção por combinação de classe e subclasse de evento”). Para um evento que não pode ser bloqueado, o registro de auditoria escreve uma mensagem de alerta no log de erro em vez de bloqueá-lo.

Para tentativas de definir um filtro no qual o item `abort` aparece em outro lugar que não em um item `event`, ocorre um erro.

##### Operadores lógicos

Os operadores lógicos (`e`, `ou`, `não`) permitem a construção de condições complexas, permitindo a escrita de configurações de filtragem mais avançadas. O item `log` a seguir registra apenas eventos `gerais` com campos `general_command` que tenham um valor e comprimento específicos:

```json
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

##### Referência de variáveis pré-definidas

Para referenciar uma variável predefinida em uma condição `log`, use um item `variable`, que aceita os itens `name` e `value` e testa a igualdade da variável nomeada com um valor dado:

```json
"variable": {
  "name": "variable_name",
  "value": comparison_value
}
```

Isso é verdadeiro se *`variable_name`* tiver o valor *`comparison_value`*, caso contrário, é falso.

Exemplo:

```json
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

Cada variável predefinida corresponde a uma variável do sistema. Ao escrever um filtro que testa uma variável predefinida, você pode modificar a operação do filtro definindo a variável do sistema correspondente, sem precisar redefinir o filtro. Por exemplo, ao escrever um filtro que testa o valor da variável predefinida `audit_log_connection_policy_value`, você pode modificar a operação do filtro alterando o valor da variável do sistema `audit_log_connection_policy`.

As variáveis de sistema `audit_log_xxx_policy` são usadas para o log de auditoria no modo legado (consulte Seção 6.4.5.10, “Filtragem do Log de Auditoria no Modo Legado”). Com a filtragem do log de auditoria baseada em regras, essas variáveis permanecem visíveis (por exemplo, usando `SHOW VARIABLES`), mas alterações nelas não têm efeito, a menos que você escreva filtros que contenham construções que se refiram a elas.

A lista a seguir descreve as variáveis pré-definidas permitidas para itens `variable`:

- `audit_log_connection_policy_value`

  Esta variável corresponde ao valor da variável de sistema `audit_log_connection_policy`. O valor é um inteiro não assinado. Tabela 6.31, “Valores de `audit_log_connection_policy_value`” mostra os valores permitidos e os valores correspondentes de `audit_log_connection_policy`.

  **Tabela 6.31 valores da política de conexão do log de auditoria**

  <table summary="Valores audit_log_connection_policy_value permitidos e os valores audit_log_connection_policy correspondentes."><thead><tr><th>Valor</th><th>Valor correspondente de audit_log_connection_policy</th></tr></thead><tbody><tr><td><code>0</code> or <code>"::none"</code></td><td><code>NONE</code></td></tr><tr><td><code>1</code> or <code>"::errors"</code></td><td><code>ERRORS</code></td></tr><tr><td><code>2</code> or <code>"::all"</code></td><td><code>ALL</code></td></tr></tbody></table>

  Os valores `"::xxx"` são pseudo-constantes simbólicas que podem ser usados em vez dos valores numéricos literais. Eles devem ser citados como strings e são sensíveis a maiúsculas e minúsculas.

- `audit_log_policy_value`

  Esta variável corresponde ao valor da variável de sistema `audit_log_policy`. O valor é um inteiro não assinado. Tabela 6.32, “Valores de `audit_log_policy_value` mostra os valores permitidos e os valores correspondentes de `audit_log_policy`.

  **Tabela 6.32 audit_log_policy_value Valores**

  <table summary="Valores audit_log_policy_value permitidos e os valores audit_log_policy correspondentes."><col style="width: 20%"/><col style="width: 80%"/><thead><tr><th>Valor</th><th>Valor audit_log_policy correspondente</th></tr></thead><tbody><tr><td><code>0</code> or <code>"::none"</code></td><td><code>NONE</code></td></tr><tr><td><code>1</code> or <code>"::logins"</code></td><td><code>LOGINS</code></td></tr><tr><td><code>2</code> or <code>"::all"</code></td><td><code>ALL</code></td></tr><tr><td><code>3</code> or <code>"::queries"</code></td><td><code>QUERIES</code></td></tr></tbody></table>

  Os valores `"::xxx"` são pseudo-constantes simbólicas que podem ser usados em vez dos valores numéricos literais. Eles devem ser citados como strings e são sensíveis a maiúsculas e minúsculas.

- `audit_log_statement_policy_value`

  Esta variável corresponde ao valor da variável de sistema `audit_log_statement_policy`. O valor é um inteiro não assinado. Tabela 6.33, “Valores de `audit_log_statement_policy_value`” mostra os valores permitidos e os valores correspondentes de `audit_log_statement_policy`.

  **Tabela 6.33 política_valor_declaração_audit_log_statement Valores**

  <table summary="Valores audit_log_statement_policy_value permitidos e os valores audit_log_statement_policy correspondentes."><col style="width: 20%"/><col style="width: 80%"/><thead><tr><th>Valor</th><th>Valor correspondente de audit_log_statement_policy</th></tr></thead><tbody><tr><td><code>0</code> or <code>"::none"</code></td><td><code>NONE</code></td></tr><tr><td><code>1</code> or <code>"::errors"</code></td><td><code>ERRORS</code></td></tr><tr><td><code>2</code> or <code>"::all"</code></td><td><code>ALL</code></td></tr></tbody></table>

  Os valores `"::xxx"` são pseudo-constantes simbólicas que podem ser usados em vez dos valores numéricos literais. Eles devem ser citados como strings e são sensíveis a maiúsculas e minúsculas.

##### Referência a Funções Predefinidas

Para referenciar uma função predefinida em uma condição `log`, use um item `function`, que aceita os itens `name` e `args` para especificar o nome da função e seus argumentos, respectivamente:

```json
"function": {
  "name": "function_name",
  "args": arguments
}
```

O item `name` deve especificar apenas o nome da função, sem parênteses ou lista de argumentos.

O item `args` deve satisfazer estas condições:

- Se a função não receber argumentos, não deve ser fornecido nenhum item `args`.

- Se a função receber argumentos, é necessário um item `args`, e os argumentos devem ser fornecidos na ordem listada na descrição da função. Os argumentos podem se referir a variáveis pré-definidas, campos de evento ou constantes numéricas ou de string.

Se o número de argumentos estiver incorreto ou se os argumentos não forem dos tipos de dados corretos exigidos pela função, ocorrerá um erro.

Exemplo:

```json
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

O filtro anterior determina se os eventos de status da classe `general` devem ser registrados, dependendo se o usuário atual está encontrado na variável de sistema `audit_log_include_accounts`. Esse usuário é construído usando campos no evento.

A lista a seguir descreve as funções pré-definidas permitidas para os itens `function`:

- `audit_log_exclude_accounts_is_null()`

  Verifica se a variável de sistema `audit_log_exclude_accounts` é `NULL`. Esta função pode ser útil ao definir filtros que correspondam à implementação antiga do log de auditoria.

  Argumentos:

  Nenhum.

- `audit_log_include_accounts_is_null()`

  Verifica se a variável de sistema `audit_log_include_accounts` é `NULL`. Esta função pode ser útil ao definir filtros que correspondam à implementação antiga do log de auditoria.

  Argumentos:

  Nenhum.

- `debug_sleep(millisec)`

  Dorme por um número determinado de milissegundos. Esta função é usada durante a medição de desempenho.

  `debug_sleep()` está disponível apenas para compilações de depuração.

  Argumentos:

  - *`millisec`*: Um inteiro não assinado que especifica o número de milissegundos para dormir.

- `find_in_exclude_list(account)`

  Verifica se uma string de conta existe na lista de exclusão do log de auditoria (o valor da variável de sistema `audit_log_exclude_accounts`).

  Argumentos:

  - *`account`*: Uma string que especifica o nome da conta do usuário.

- `find_in_include_list(account)`

  Verifica se uma string de conta existe na lista de log de auditoria (o valor da variável de sistema `audit_log_include_accounts`).

  Argumentos:

  - *`account`*: Uma string que especifica o nome da conta do usuário.

- `string_find(text, substr)`

  Verifica se o valor `substr` está contido no valor `text`. Essa pesquisa é case-sensitive.

  Argumentos:

  - *`text`*: A string de texto para pesquisar.

  - *`substr`*: A subcadeia de caracteres a ser pesquisada em *`text`*.

##### Substituindo um filtro de usuário

Em alguns casos, a definição do filtro pode ser alterada dinamicamente. Para fazer isso, defina uma configuração de `filter` dentro de um `filter` existente. Por exemplo:

```json
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

Um novo filtro é ativado quando o item `activate` dentro de um subfiltro é avaliado como `true`. Não é permitido usar `activate` em um `filter` de nível superior.

Um novo filtro pode ser substituído pelo original usando um item `ref` dentro do subfiltro para referenciar o `id` do filtro original.

O filtro mostrado funciona da seguinte maneira:

- O filtro `main` aguarda eventos `table_access`, que podem ser `update` ou `delete`.

- Se o evento `update` ou `delete` da `table_access` ocorrer na tabela `temp_1` ou `temp_2`, o filtro é substituído pelo interno (sem um `id`, pois não há necessidade de referenciá-lo explicitamente).

- Se o fim do comando for sinalizado (evento `general` / `status`), uma entrada é escrita no arquivo de log de auditoria e o filtro é substituído pelo filtro `main`.

O filtro é útil para registrar declarações que atualizam ou excluem qualquer coisa das tabelas `temp_1` ou `temp_2`, como esta:

```sql
UPDATE temp_1, temp_3 SET temp_1.a=21, temp_3.a=23;
```

A declaração gera vários eventos de `table_access`, mas o arquivo de log de auditoria contém apenas entradas de `general` ou `status`.

Nota

Quaisquer valores de `id` usados na definição são avaliados apenas em relação a essa definição. Eles não têm nada a ver com o valor da variável de sistema `audit_log_filter_id`.
