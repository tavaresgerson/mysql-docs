#### 8.4.5.8 Escrever definições de filtro do log de auditoria

As definições de filtro são valores `JSON`. Para obter informações sobre o uso dos dados `JSON` no MySQL, consulte a Seção 13.5, “O tipo de dados JSON”.

As definições de filtro têm essa forma, onde `actions` indica como o filtro é aplicado:

```
{ "filter": actions }
```

A discussão a seguir descreve as construções permitidas nas definições de filtro.

- Registro de todos os eventos
- Registro de Classes Específicas de Eventos
- Registro de Subclasses Específicas de Eventos
- Registros inclusivos e exclusivos
- Testando os valores do campo do evento
- Bloquear a execução de eventos específicos
- Operadores lógicos
- Referência de variáveis pré-definidas
- Referência a Funções Predefinidas
- Substituição de valores de campos de evento
- Substituindo um filtro de usuário

##### Registro de todos os eventos

Para habilitar ou desabilitar explicitamente o registro de todos os eventos, use um item `log` no filtro:

```
{
  "filter": { "log": true }
}
```

O valor `log` pode ser `true` ou `false`.

O filtro anterior permite o registro de todos os eventos. É equivalente a:

```
{
  "filter": { }
}
```

O comportamento de registro depende do valor de `log` e se os itens `class` ou `event` são especificados:

- Com `log` especificado, seu valor fornecido é usado.

- Sem `log` especificado, o registro é `true` se nenhum item `class` ou `event` for especificado, e `false` caso contrário (neste caso, `class` ou `event` podem incluir seu próprio item `log`).

##### Registro de Classes Específicas de Eventos

Para registrar eventos de uma classe específica, use um item `class` no filtro, com seu campo `name` indicando o nome da classe a ser registrada:

```
{
  "filter": {
    "class": { "name": "connection" }
  }
}
```

O valor `name` pode ser `connection`, `general` ou `table_access` para registrar eventos de conexão, gerais ou de acesso à tabela, respectivamente.

O filtro anterior permite o registro de eventos na classe `connection`. É equivalente ao seguinte filtro com itens `log` explicitados:

```
{
  "filter": {
    "log": false,
    "class": { "log": true,
               "name": "connection" }
  }
}
```

Para habilitar o registro de múltiplas classes, defina o valor `class` como um elemento do array `JSON` que nomeie as classes:

```
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

```
{
  "filter": {
    "class": [
      { "name": [ "connection", "general", "table_access" ] }
    ]
  }
}
```

##### Registro de Subclasses Específicas de Eventos

Para selecionar subcategorias específicas de eventos, use um item `event` contendo um item `name` que nomeia as subcategorias. A ação padrão para eventos selecionados por um item `event` é registrar-os. Por exemplo, este filtro habilita o registro para as subcategorias de eventos nomeadas:

```
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

O item `event` também pode conter itens explícitos `log` para indicar se os eventos qualificadores devem ser registrados. Este item `event` seleciona vários eventos e indica explicitamente o comportamento de registro para eles:

```
"event": [
  { "name": "read", "log": false },
  { "name": "insert", "log": true },
  { "name": "delete", "log": true },
  { "name": "update", "log": true }
]
```

O item `event` também pode indicar se os eventos qualificadores devem ser bloqueados, se ele contiver um item `abort`. Para obter detalhes, consulte Bloqueando a Execução de Eventos Específicos.

A Tabela 8.35, “Combinações de Classe e Subclasse de Eventos”, descreve os valores permitidos para cada subclasse de evento.

**Tabela 8.35 Combinações de Classe e Subclasse de Eventos**

<table summary="Combinações permitidas de valores de classe e subclasse de evento."><thead><tr> <th scope="col">Classe de evento</th> <th scope="col">Subclasse de evento</th> <th scope="col">Descrição</th> </tr></thead><tbody><tr> <th>[[PH_HTML_CODE_<code>message</code>]</th> <td>[[PH_HTML_CODE_<code>message</code>]</td> <td>Início da conexão (sucesso ou falha)</td> </tr><tr> <th>[[PH_HTML_CODE_<code>audit_api_message_emit_udf()</code>]</th> <td>[[PH_HTML_CODE_<code>table_access</code>]</td> <td>Reauthenticação do usuário com diferentes usuário/senha durante a sessão</td> </tr><tr> <th>[[PH_HTML_CODE_<code>read</code>]</th> <td>[[PH_HTML_CODE_<code>SELECT</code>]</td> <td>Termina��o da conex�o</td> </tr><tr> <th>[[PH_HTML_CODE_<code>INSERT INTO ... SELECT</code>]</th> <td>[[PH_HTML_CODE_<code>table_access</code>]</td> <td>Informações gerais sobre o funcionamento</td> </tr><tr> <th>[[PH_HTML_CODE_<code>delete</code>]</th> <td>[[PH_HTML_CODE_<code>DELETE</code>]</td> <td>Mensagem gerada internamente</td> </tr><tr> <th>[[<code>message</code>]]</th> <td>[[<code>connect</code><code>message</code>]</td> <td>Mensagem gerada por [[<code>audit_api_message_emit_udf()</code>]]</td> </tr><tr> <th>[[<code>table_access</code>]]</th> <td>[[<code>read</code>]]</td> <td>Declarações de leitura da tabela, como [[<code>SELECT</code>]] ou [[<code>INSERT INTO ... SELECT</code>]]</td> </tr><tr> <th>[[<code>table_access</code>]]</th> <td>[[<code>delete</code>]]</td> <td>Declarações de exclusão de tabela, como [[<code>DELETE</code>]] ou [[<code>connection</code><code>message</code>]</td> </tr><tr> <th>[[<code>connection</code><code>message</code>]</th> <td>[[<code>connection</code><code>audit_api_message_emit_udf()</code>]</td> <td>Declarações de inserção de tabela, como [[<code>connection</code><code>table_access</code>] ou [[<code>connection</code><code>read</code>]</td> </tr><tr> <th>[[<code>connection</code><code>SELECT</code>]</th> <td>[[<code>connection</code><code>INSERT INTO ... SELECT</code>]</td> <td>Declarações de atualização da tabela, como [[<code>connection</code><code>table_access</code>]</td> </tr></tbody></table>

A Tabela 8.36, “Características de registro e interrupção por combinação de classe e subclasse de evento”, descreve, para cada subclasse de evento, se ela pode ser registrada ou interrompida.

**Tabela 8.36 Características de registro e interrupção por classe de evento e combinação de subclasses**

<table summary="Características de registro e interrupção para combinações de classe e subclasse de eventos."><thead><tr> <th scope="col">Classe de evento</th> <th scope="col">Subclasse de evento</th> <th scope="col">Pode ser registrado</th> <th scope="col">Pode ser interrompido</th> </tr></thead><tbody><tr> <th>[[PH_HTML_CODE_<code>message</code>]</th> <td>[[PH_HTML_CODE_<code>message</code>]</td> <td>Sim</td> <td>Não</td> </tr><tr> <th>[[PH_HTML_CODE_<code>table_access</code>]</th> <td>[[PH_HTML_CODE_<code>read</code>]</td> <td>Sim</td> <td>Não</td> </tr><tr> <th>[[PH_HTML_CODE_<code>table_access</code>]</th> <td>[[PH_HTML_CODE_<code>delete</code>]</td> <td>Sim</td> <td>Não</td> </tr><tr> <th>[[PH_HTML_CODE_<code>table_access</code>]</th> <td>[[PH_HTML_CODE_<code>insert</code>]</td> <td>Sim</td> <td>Não</td> </tr><tr> <th>[[PH_HTML_CODE_<code>table_access</code>]</th> <td>[[PH_HTML_CODE_<code>update</code>]</td> <td>Sim</td> <td>Sim</td> </tr><tr> <th>[[<code>message</code>]]</th> <td>[[<code>connect</code><code>message</code>]</td> <td>Sim</td> <td>Sim</td> </tr><tr> <th>[[<code>table_access</code>]]</th> <td>[[<code>read</code>]]</td> <td>Sim</td> <td>Sim</td> </tr><tr> <th>[[<code>table_access</code>]]</th> <td>[[<code>delete</code>]]</td> <td>Sim</td> <td>Sim</td> </tr><tr> <th>[[<code>table_access</code>]]</th> <td>[[<code>insert</code>]]</td> <td>Sim</td> <td>Sim</td> </tr><tr> <th>[[<code>table_access</code>]]</th> <td>[[<code>update</code>]]</td> <td>Sim</td> <td>Sim</td> </tr></tbody></table>

##### Registros inclusivos e exclusivos

Um filtro pode ser definido no modo inclusivo ou exclusivo:

- O modo inclusivo registra apenas itens especificados explicitamente.
- O modo exclusivo registra tudo, exceto itens especificamente indicados.

Para realizar o registro inclusivo, desative o registro globalmente e habilite o registro para classes específicas. Este filtro registra os eventos `connect` e `disconnect` na classe `connection` e eventos na classe `general`:

```
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

```
{
  "filter": {
    "log": true,
    "class":
      { "name": "general", "log": false }
  }
}
```

Este filtro registra eventos `change_user` na classe `connection`, eventos `message` e eventos `table_access`, em virtude de *não* registrar tudo o resto:

```
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

Para habilitar o registro com base em valores específicos de campos de evento, especifique um item `field` dentro do item `log` que indique o nome do campo e seu valor esperado:

```
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

Um evento na classe `connection` indica quando uma atividade relacionada à conexão ocorre durante uma sessão, como um usuário se conectando ou desconectando do servidor. A Tabela 8.37, “Campos de Evento de Conexão”, indica os campos permitidos para eventos `connection`.

**Tabela 8.37 Campos de Eventos de Conexão**

<table summary="Campos permitidos para eventos de conexão."><thead><tr> <th scope="col">Nome do campo</th> <th scope="col">Tipo de campo</th> <th scope="col">Descrição</th> </tr></thead><tbody><tr> <th>[[PH_HTML_CODE_<code>host.str</code>]</th> <td>inteiro</td> <td><p class="valid-value">Status do evento:</p><p class="valid-value">0: OK</p><p class="valid-value">Caso contrário: Falha</p></td> </tr><tr> <th>[[PH_HTML_CODE_<code>host.str</code>]</th> <td>inteiro não assinado</td> <td>ID de conexão</td> </tr><tr> <th>[[PH_HTML_CODE_<code>ip.str</code>]</th> <td>string</td> <td>Nome do usuário especificado durante a autenticação</td> </tr><tr> <th>[[PH_HTML_CODE_<code>ip.length</code>]</th> <td>inteiro não assinado</td> <td>Comprimento do nome do usuário</td> </tr><tr> <th>[[PH_HTML_CODE_<code>database.str</code>]</th> <td>string</td> <td>Nome de usuário autenticado (nome do usuário da conta)</td> </tr><tr> <th>[[PH_HTML_CODE_<code>database.length</code>]</th> <td>inteiro não assinado</td> <td>Nome de usuário autenticado com comprimento</td> </tr><tr> <th>[[PH_HTML_CODE_<code>connection_type</code>]</th> <td>string</td> <td>Nome do usuário externo (fornecido pelo plugin de autenticação de terceiros)</td> </tr><tr> <th>[[PH_HTML_CODE_<code>"::undefined"</code>]</th> <td>inteiro não assinado</td> <td>Nome do usuário externo de comprimento</td> </tr><tr> <th>[[PH_HTML_CODE_<code>"::tcp/ip"</code>]</th> <td>string</td> <td>Nome de usuário do proxy</td> </tr><tr> <th>[[PH_HTML_CODE_<code>"::socket"</code>]</th> <td>inteiro não assinado</td> <td>Nome de usuário do proxy comprimento</td> </tr><tr> <th>[[<code>host.str</code>]]</th> <td>string</td> <td>Hospedeiro de usuário conectado</td> </tr><tr> <th>[[<code>connection_id</code><code>host.str</code>]</th> <td>inteiro não assinado</td> <td>Comprimento do host do usuário conectado</td> </tr><tr> <th>[[<code>ip.str</code>]]</th> <td>string</td> <td>Endereço IP do usuário conectado</td> </tr><tr> <th>[[<code>ip.length</code>]]</th> <td>inteiro não assinado</td> <td>Tamanho do endereço IP do usuário conectado</td> </tr><tr> <th>[[<code>database.str</code>]]</th> <td>string</td> <td>Nome do banco de dados especificado no momento da conexão</td> </tr><tr> <th>[[<code>database.length</code>]]</th> <td>inteiro não assinado</td> <td>Nome do banco de dados</td> </tr><tr> <th>[[<code>connection_type</code>]]</th> <td>inteiro</td> <td><p class="valid-value">Tipo de conexão:</p><p class="valid-value">0 ou [[<code>"::undefined"</code>]]: Indefinido</p><p class="valid-value">1 ou [[<code>"::tcp/ip"</code>]]: TCP/IP</p><p class="valid-value">2 ou [[<code>"::socket"</code>]]: Soquete</p><p class="valid-value">3 ou [[<code>user.str</code><code>host.str</code>]: Pipe nomeado</p><p class="valid-value">4 ou [[<code>user.str</code><code>host.str</code>]: TCP/IP com criptografia</p><p class="valid-value">5 ou [[<code>user.str</code><code>ip.str</code>]: Memória compartilhada</p></td> </tr></tbody></table>

Os valores `"::xxx"` são pseudo-constantes simbólicas que podem ser fornecidos em vez dos valores numéricos literais. Eles devem ser citados como strings e são sensíveis a maiúsculas e minúsculas.

Um evento na classe `general` indica o código de status de uma operação e seus detalhes. A Tabela 8.38, “Campos de Evento Geral”, indica os campos permitidos para eventos `general`.

**Tabela 8.38 Campos Gerais de Evento**

<table summary="Tipos de campos permitidos para eventos gerais."><thead><tr> <th scope="col">Nome do campo</th> <th scope="col">Tipo de campo</th> <th scope="col">Descrição</th> </tr></thead><tbody><tr> <th>[[PH_HTML_CODE_<code>general_sql_command.str</code>]</th> <td>inteiro</td> <td><p class="valid-value">Status do evento:</p><p class="valid-value">0: OK</p><p class="valid-value">Caso contrário: Falha</p></td> </tr><tr> <th>[[PH_HTML_CODE_<code>general_sql_command.str</code>]</th> <td>inteiro não assinado</td> <td>ID de conexão/fio</td> </tr><tr> <th>[[PH_HTML_CODE_<code>general_external_user.str</code>]</th> <td>string</td> <td>Nome do usuário especificado durante a autenticação</td> </tr><tr> <th>[[PH_HTML_CODE_<code>general_external_user.length</code>]</th> <td>inteiro não assinado</td> <td>Comprimento do nome do usuário</td> </tr><tr> <th>[[PH_HTML_CODE_<code>general_ip.str</code>]</th> <td>string</td> <td>Nome do comando</td> </tr><tr> <th>[[PH_HTML_CODE_<code>general_ip.length</code>]</th> <td>inteiro não assinado</td> <td>Nome do comando de comprimento</td> </tr><tr> <th>[[<code>general_query.str</code>]]</th> <td>string</td> <td>Texto da instrução SQL</td> </tr><tr> <th>[[<code>general_query.length</code>]]</th> <td>inteiro não assinado</td> <td>Texto do comando SQL</td> </tr><tr> <th>[[<code>general_host.str</code>]]</th> <td>string</td> <td>Nome do host</td> </tr><tr> <th>[[<code>general_host.length</code>]]</th> <td>inteiro não assinado</td> <td>Nome do host de comprimento</td> </tr><tr> <th>[[<code>general_sql_command.str</code>]]</th> <td>string</td> <td>Nome do tipo de comando SQL</td> </tr><tr> <th>[[<code>general_thread_id</code><code>general_sql_command.str</code>]</th> <td>inteiro não assinado</td> <td>Nome do tipo de comando SQL comprimento</td> </tr><tr> <th>[[<code>general_external_user.str</code>]]</th> <td>string</td> <td>Nome do usuário externo (fornecido pelo plugin de autenticação de terceiros)</td> </tr><tr> <th>[[<code>general_external_user.length</code>]]</th> <td>inteiro não assinado</td> <td>Nome do usuário externo de comprimento</td> </tr><tr> <th>[[<code>general_ip.str</code>]]</th> <td>string</td> <td>Endereço IP do usuário conectado</td> </tr><tr> <th>[[<code>general_ip.length</code>]]</th> <td>inteiro não assinado</td> <td>Comprimento do endereço IP do usuário de conexão</td> </tr></tbody></table>

`general_command.str` indica o nome de um comando: `Query`, `Execute`, `Quit` ou `Change user`.

Um evento `general` com o campo `general_command.str` definido como `Query` ou `Execute` contém `general_sql_command.str` definido para um valor que especifica o tipo de comando SQL: `alter_db`, `alter_db_upgrade`, `admin_commands` e assim por diante. Os valores disponíveis de `general_sql_command.str` podem ser vistos como os últimos componentes dos instrumentos do Schema de Desempenho exibidos por esta declaração:

```
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

Um evento na classe `table_access` fornece informações sobre um tipo específico de acesso a uma tabela. A Tabela 8.39, “Campos de Eventos de Acesso à Tabela”, indica os campos permitidos para eventos `table_access`.

**Tabela 8.39 Campos de eventos de acesso à tabela**

<table summary="Campos permitidos para eventos de acesso à tabela."><thead><tr> <th scope="col">Nome do campo</th> <th scope="col">Tipo de campo</th> <th scope="col">Descrição</th> </tr></thead><tbody><tr> <th>[[<code>connection_id</code>]]</th> <td>inteiro não assinado</td> <td>ID de conexão do evento</td> </tr><tr> <th>[[<code>sql_command_id</code>]]</th> <td>inteiro</td> <td>ID do comando SQL</td> </tr><tr> <th>[[<code>query.str</code>]]</th> <td>string</td> <td>Texto da instrução SQL</td> </tr><tr> <th>[[<code>query.length</code>]]</th> <td>inteiro não assinado</td> <td>Texto do comando SQL</td> </tr><tr> <th>[[<code>table_database.str</code>]]</th> <td>string</td> <td>Nome do banco de dados associado ao evento</td> </tr><tr> <th>[[<code>table_database.length</code>]]</th> <td>inteiro não assinado</td> <td>Nome do banco de dados</td> </tr><tr> <th>[[<code>table_name.str</code>]]</th> <td>string</td> <td>Nome da tabela associado ao evento</td> </tr><tr> <th>[[<code>table_name.length</code>]]</th> <td>inteiro não assinado</td> <td>Nome da tabela</td> </tr></tbody></table>

A lista a seguir mostra quais declarações geram quais eventos de acesso à tabela:

- Evento `read`:

  - `SELECT`

  - `INSERT ... SELECT` (para tabelas referenciadas na cláusula `SELECT`).

  - `REPLACE ... SELECT` (para tabelas referenciadas na cláusula `SELECT`).

  - `UPDATE ... WHERE` (para tabelas referenciadas na cláusula `WHERE`).

  - `HANDLER ... READ`
- Evento `delete`:

  - `DELETE`
  - `TRUNCATE TABLE`
- Evento `insert`:

  - `INSERT`

  - `INSERT ... SELECT` (para a tabela referenciada na cláusula `INSERT`)

  - `REPLACE`

  - `REPLACE ... SELECT` (para a tabela referenciada na cláusula `REPLACE`

  - `LOAD DATA`

  - `LOAD XML`
- Evento `update`:

  - `UPDATE`
  - `UPDATE ... WHERE` (para tabelas referenciadas na cláusula `UPDATE`).

##### Bloquear a execução de eventos específicos

`event` itens podem incluir um `abort` item que indica se os eventos qualificadores devem ser impedidos de serem executados. `abort` permite que regras sejam escritas para bloquear a execução de instruções SQL específicas.

Importante

Teoricamente, é possível que um usuário com permissões suficientes crie acidentalmente um item `abort` no filtro do log de auditoria que impeça a si mesmo e outros administradores de acessar o sistema. A partir do MySQL 8.0.28, o privilégio `AUDIT_ABORT_EXEMPT` está disponível para permitir que as consultas de uma conta de usuário sejam sempre executadas, mesmo que um item `abort` os bloqueie. As contas com esse privilégio podem, portanto, ser usadas para recuperar o acesso a um sistema após uma má configuração de auditoria. A consulta ainda é registrada no log de auditoria, mas, em vez de ser rejeitada, é permitida devido ao privilégio.

Contas criadas no MySQL 8.0.28 ou posterior com o privilégio `SYSTEM_USER` têm o privilégio `AUDIT_ABORT_EXEMPT` atribuído automaticamente quando são criadas. O privilégio `AUDIT_ABORT_EXEMPT` também é atribuído às contas existentes com o privilégio `SYSTEM_USER` quando você executa um procedimento de atualização com o MySQL 8.0.28 ou posterior, se nenhuma conta existente tiver esse privilégio atribuído.

O item `abort` deve aparecer dentro de um item `event`. Por exemplo:

```
"event": {
  "name": qualifying event subclass names
  "abort": condition
}
```

Para subclasses de eventos selecionadas pelo item `name`, a ação `abort` é verdadeira ou falsa, dependendo da avaliação de `condition`. Se a condição for avaliada como verdadeira, o evento é bloqueado. Caso contrário, o evento continua sendo executado.

A especificação `condition` pode ser tão simples quanto `true` ou `false`, ou pode ser mais complexa, de modo que a avaliação depende das características do evento.

Este filtro bloqueia as instruções `INSERT`, `UPDATE` e `DELETE`:

```
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

```
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

```
ERROR 1045 (28000): Statement was aborted by an audit log filter
```

Nem todos os eventos podem ser bloqueados (consulte a Tabela 8.36, “Características de Log e Abandono por Combinação de Classe e Subclasse de Evento”). Para um evento que não pode ser bloqueado, o log de auditoria escreve uma mensagem de alerta no log de erros em vez de bloqueá-lo.

Para tentativas de definir um filtro no qual o item `abort` apareça em outro lugar que não em um item `event`, ocorre um erro.

##### Operadores lógicos

Os operadores lógicos (`and`, `or`, `not`) permitem a construção de condições complexas, permitindo a escrita de configurações de filtragem mais avançadas. O item `log` a seguir registra apenas eventos `general` com campos `general_command` que têm um valor e comprimento específicos:

```
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

```
"variable": {
  "name": "variable_name",
  "value": comparison_value
}
```

Isso é verdadeiro se `variable_name` tiver o valor `comparison_value`, caso contrário, é falso.

Exemplo:

```
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

As variáveis de sistema `audit_log_xxx_policy` são usadas para o log de auditoria do modo legado obsoleto (consulte a Seção 8.4.5.10, “Filtragem do Log de Auditoria do Modo Legado”). Com a filtragem baseada em regras do log de auditoria, essas variáveis permanecem visíveis (por exemplo, usando `SHOW VARIABLES`), mas alterações nelas não têm efeito, a menos que você escreva filtros que contenham construções que as refiram.

A lista a seguir descreve as variáveis pré-definidas permitidas para os itens `variable`:

- `audit_log_connection_policy_value`

  Esta variável corresponde ao valor da variável de sistema `audit_log_connection_policy`. O valor é um inteiro sem sinal. A Tabela 8.40, “Valores de `audit_log_connection_policy` da política de conexão do log de auditoria”, mostra os valores permitidos e os valores correspondentes de `audit_log_connection_policy`.

  **Tabela 8.40 audit\_log\_connection\_policy\_value Valores**

  <table summary="Valores permitidos de audit_log_connection_policy_value e os valores correspondentes de audit_log_connection_policy."><thead><tr> <th>Valor</th> <th>Valor correspondente a audit_log_connection_policy</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CÓDIGO_<code>0</code>] ou [[PH_HTML_CÓDIGO_<code>"::none"</code>]</td> <td>[[<code>NONE</code>]]</td> </tr><tr> <td>[[<code>1</code>]] ou [[<code>"::errors"</code>]]</td> <td>[[<code>ERRORS</code>]]</td> </tr><tr> <td>[[<code>2</code>]] ou [[<code>"::all"</code>]]</td> <td>[[<code>ALL</code>]]</td> </tr></tbody></table>

  Os valores `"::xxx"` são pseudo-constantes simbólicas que podem ser fornecidos em vez dos valores numéricos literais. Eles devem ser citados como strings e são sensíveis a maiúsculas e minúsculas.

- `audit_log_policy_value`

  Essa variável corresponde ao valor da variável de sistema `audit_log_policy`. O valor é um inteiro sem sinal. A Tabela 8.41, “Valores de audit\_log\_policy\_value”, mostra os valores permitidos e os valores correspondentes de `audit_log_policy`.

  **Tabela 8.41 audit\_log\_policy\_value Valores**

  <table summary="Valores permitidos de audit_log_policy_value e os valores correspondentes de audit_log_policy."><thead><tr> <th>Valor</th> <th>Valor correspondente a audit_log_policy</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CÓDIGO_<code>"::queries"</code>] ou [[PH_HTML_CÓDIGO_<code>"::queries"</code>]</td> <td>[[<code>NONE</code>]]</td> </tr><tr> <td>[[<code>1</code>]] ou [[<code>"::logins"</code>]]</td> <td>[[<code>LOGINS</code>]]</td> </tr><tr> <td>[[<code>2</code>]] ou [[<code>"::all"</code>]]</td> <td>[[<code>ALL</code>]]</td> </tr><tr> <td>[[<code>3</code>]] ou [[<code>"::queries"</code>]]</td> <td>[[<code>"::none"</code><code>"::queries"</code>]</td> </tr></tbody></table>

  Os valores `"::xxx"` são pseudo-constantes simbólicas que podem ser fornecidos em vez dos valores numéricos literais. Eles devem ser citados como strings e são sensíveis a maiúsculas e minúsculas.

- `audit_log_statement_policy_value`

  Esta variável corresponde ao valor da variável de sistema `audit_log_statement_policy`. O valor é um inteiro sem sinal. A Tabela 8.42, “Valores de política de declaração de auditoria”, mostra os valores permitidos e os valores correspondentes `audit_log_statement_policy`.

  **Tabela 8.42 política\_valor\_declaração\_audit\_log\_statement Valores**

  <table summary="Valores permitidos de audit_log_statement_policy_value e os valores correspondentes de audit_log_statement_policy."><thead><tr> <th>Valor</th> <th>Política de declaração de audit_log_statement correspondente Valor</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CÓDIGO_<code>0</code>] ou [[PH_HTML_CÓDIGO_<code>"::none"</code>]</td> <td>[[<code>NONE</code>]]</td> </tr><tr> <td>[[<code>1</code>]] ou [[<code>"::errors"</code>]]</td> <td>[[<code>ERRORS</code>]]</td> </tr><tr> <td>[[<code>2</code>]] ou [[<code>"::all"</code>]]</td> <td>[[<code>ALL</code>]]</td> </tr></tbody></table>

  Os valores `"::xxx"` são pseudo-constantes simbólicas que podem ser fornecidos em vez dos valores numéricos literais. Eles devem ser citados como strings e são sensíveis a maiúsculas e minúsculas.

##### Referência a Funções Predefinidas

Para referenciar uma função predefinida em uma condição `log`, use um item `function`, que aceita os itens `name` e `args` para especificar o nome da função e seus argumentos, respectivamente:

```
"function": {
  "name": "function_name",
  "args": arguments
}
```

O item `name` deve especificar apenas o nome da função, sem parênteses ou lista de argumentos.

O item `args` deve satisfazer estas condições:

- Se a função não receber argumentos, não deve ser fornecido nenhum item `args`.

- Se a função receber argumentos, é necessário um item `args` e os argumentos devem ser fornecidos na ordem listada na descrição da função. Os argumentos podem se referir a variáveis predefinidas, campos de evento ou constantes de string ou número.

Se o número de argumentos estiver incorreto ou se os argumentos não forem dos tipos de dados corretos exigidos pela função, ocorrerá um erro.

Exemplo:

```
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

O filtro anterior determina se os eventos da classe `general` devem ser registrados dependendo se o usuário atual está encontrado na variável de sistema `audit_log_include_accounts`. Esse usuário é construído usando campos no evento.

A lista a seguir descreve as funções pré-definidas permitidas para os itens `function`:

- `audit_log_exclude_accounts_is_null()`

  Verifica se a variável de sistema `audit_log_exclude_accounts` é `NULL`. Esta função pode ser útil ao definir filtros que correspondam à implementação do log de auditoria antigo.

  Argumentos:

  None.

- `audit_log_include_accounts_is_null()`

  Verifica se a variável de sistema `audit_log_include_accounts` é `NULL`. Esta função pode ser útil ao definir filtros que correspondam à implementação do log de auditoria antigo.

  Argumentos:

  None.

- `debug_sleep(millisec)`

  Dorme por um número determinado de milissegundos. Esta função é usada durante a medição de desempenho.

  `debug_sleep()` está disponível apenas para builds de depuração.

  Argumentos:

  - `millisec`: Um inteiro não assinado que especifica o número de milissegundos para dormir.

- `find_in_exclude_list(account)`

  Verifica se uma string de conta existe na lista de exclusão do log de auditoria (o valor da variável de sistema `audit_log_exclude_accounts`).

  Argumentos:

  - `account`: Uma string que especifica o nome da conta do usuário.

- `find_in_include_list(account)`

  Verifica se uma string de conta existe na lista de log de auditoria (o valor da variável de sistema `audit_log_include_accounts`).

  Argumentos:

  - `account`: Uma string que especifica o nome da conta do usuário.

- `query_digest([str])`

  Essa função tem comportamento diferente dependendo se um argumento é fornecido:

  - Sem argumento, `query_digest` retorna o valor do resumo da declaração correspondente ao texto literal da declaração no evento atual.

  - Com um argumento, `query_digest` retorna um valor booleano que indica se o argumento é igual ao digest atual da declaração.

  Argumentos:

  - `str`: Este argumento é opcional. Se fornecido, ele especifica um resumo de declaração a ser comparado com o resumo da declaração no evento atual.

  Exemplos:

  Este item `function` não inclui argumento, então `query_digest` retorna o digest atual da declaração como uma string:

  ```
  "function": {
    "name": "query_digest"
  }
  ```

  Este item `function` inclui um argumento, então `query_digest` retorna um valor booleano indicando se o argumento é igual ao digest atual da declaração:

  ```
  "function": {
    "name": "query_digest",
    "args": "SELECT ?"
  }
  ```

  Essa função foi adicionada no MySQL 8.0.26.

- `string_find(text, substr)`

  Verifica se o valor `substr` está contido no valor `text`. Essa pesquisa é case-sensitive.

  Argumentos:

  - `text`: A string de texto para pesquisar.

  - `substr`: A subcadeia a ser pesquisada em `text`.

##### Substituição de valores de campos de evento

A partir do MySQL 8.0.26, as definições de filtros de auditoria suportam a substituição de certos campos de eventos de auditoria, de modo que os eventos registrados contenham o valor de substituição em vez do valor original. Essa capacidade permite que os registros de auditoria registrados incluam resumos de declarações em vez de declarações literais, o que pode ser útil para implantações do MySQL para as quais as declarações possam expor valores sensíveis.

A substituição de campo em eventos de auditoria funciona da seguinte maneira:

- As substituições de campo são especificadas nas definições dos filtros de auditoria, portanto, o filtro do log de auditoria deve ser habilitado conforme descrito na Seção 8.4.5.7, “Filtragem do Log de Auditoria”.

- Nem todos os campos podem ser substituídos. A Tabela 8.43, “Campos de Evento Suscetíveis à Substituição”, mostra quais campos são substituíveis em quais classes de eventos.

  **Tabela 8.43 Campos de evento sujeitos a substituição**

  <table summary="Campos de evento que estão sujeitos à substituição durante a filtragem do evento."><thead><tr> <th>Classe de evento</th> <th>Nome do campo</th> </tr></thead><tbody><tr> <td>[[<code>general</code>]]</td> <td>[[<code>general_query.str</code>]]</td> </tr><tr> <td>[[<code>table_access</code>]]</td> <td>[[<code>query.str</code>]]</td> </tr></tbody></table>

- A substituição é condicional. Cada especificação de substituição em uma definição de filtro inclui uma condição, permitindo que um campo substituível seja alterado ou deixado inalterado, dependendo do resultado da condição.

- Se ocorrer substituição, a especificação da substituição indica o valor da substituição usando uma função permitida para esse fim.

Como a Tabela 8.43, “Campos de Evento Suscetíveis à Substituição”, mostra, atualmente, os únicos campos substituíveis são aqueles que contêm texto de declaração (que ocorre em eventos das classes `general` e `table_access`). Além disso, a única função permitida para especificar o valor de substituição é `query_digest`. Isso significa que a única operação de substituição permitida é substituir o texto literal da declaração pelo seu digest correspondente.

Como a substituição de campo ocorre em uma fase inicial da auditoria (durante o filtro), a escolha de escrever texto literal de declaração ou valores de digestão aplica-se independentemente do formato de log escrito posteriormente (ou seja, se o plugin de log de auditoria produz saída XML ou JSON).

A substituição de campo pode ocorrer em diferentes níveis de granularidade do evento:

- Para realizar a substituição de campo para todos os eventos em uma classe, filtre os eventos no nível da classe.

- Para realizar substituições de forma mais detalhada, inclua itens adicionais de seleção de eventos. Por exemplo, você pode realizar substituições de campo apenas para subclasses específicas de uma determinada classe de evento ou apenas em eventos para os quais os campos têm certas características.

Dentro de uma definição de filtro, especifique a substituição de campo incluindo um item `print`, que tem a seguinte sintaxe:

```
"print": {
  "field": {
    "name": "field_name",
    "print": condition,
    "replace": replacement_value
  }
}
```

No item `print`, seu item `field` leva esses três itens para indicar se e como a substituição ocorre:

- `name`: O campo para o qual a substituição (potencialmente) ocorre. `field_name` deve ser um dos mostrados na Tabela 8.43, “Campos de Evento Suscetíveis à Substituição”.

- `print`: A condição que determina se o valor original do campo deve ser mantido ou substituído:

  - Se `condition` for avaliado como `true`, o campo permanece inalterado.

  - Se `condition` for avaliado como `false`, a substituição ocorre, usando o valor do item `replace`.

  Para substituir incondicionalmente um campo, especifique a condição da seguinte forma:

  ```
  "print": false
  ```

- `replace`: O valor de substituição a ser usado quando a condição `print` for avaliada como `false`. Especifique `replacement_value` usando um item `function`.

Por exemplo, essa definição de filtro se aplica a todos os eventos da classe `general`, substituindo o texto literal da declaração pelo seu resumo:

```
{
  "filter": {
    "class": {
      "name": "general",
      "print": {
        "field": {
          "name": "general_query.str",
          "print": false,
          "replace": {
            "function": {
              "name": "query_digest"
            }
          }
        }
      }
    }
  }
}
```

O filtro anterior usa este item `print` para substituir incondicionalmente o texto literal da declaração contida em `general_query.str` pelo seu valor de digestão:

```
"print": {
  "field": {
    "name": "general_query.str",
    "print": false,
    "replace": {
      "function": {
        "name": "query_digest"
      }
    }
  }
}
```

`print` itens podem ser escritos de diferentes maneiras para implementar diferentes estratégias de substituição. O item `replace` que acabou de ser mostrado especifica o texto de substituição usando essa construção `function` para retornar uma string que representa o digest atual da declaração:

```
"function": {
  "name": "query_digest"
}
```

A função `query_digest` também pode ser usada de outra maneira, como um comparador que retorna um valor booleano, o que permite seu uso na condição `print`. Para isso, forneça um argumento que especifique um resumo da declaração de comparação:

```
"function": {
  "name": "query_digest",
  "args": "digest"
}
```

Neste caso, `query_digest` retorna `true` ou `false`, dependendo se o digest atual da declaração é o mesmo do digest de comparação. Usando `query_digest` dessa maneira, as definições de filtro podem detectar declarações que correspondem a digests específicos. A condição na construção a seguir é verdadeira apenas para declarações que têm um digest igual a `SELECT ?`, afetando assim a substituição apenas para declarações que não correspondem ao digest:

```
"print": {
  "field": {
    "name": "general_query.str",
    "print": {
      "function": {
        "name": "query_digest",
        "args": "SELECT ?"
      }
    },
    "replace": {
      "function": {
        "name": "query_digest"
      }
    }
  }
}
```

Para realizar a substituição apenas para declarações que correspondem ao digest, use `not` para inverter a condição:

```
"print": {
  "field": {
    "name": "general_query.str",
    "print": {
      "not": {
        "function": {
          "name": "query_digest",
          "args": "SELECT ?"
        }
      }
    },
    "replace": {
      "function": {
        "name": "query_digest"
      }
    }
  }
}
```

Suponha que você queira que o log de auditoria contenha apenas resumos de declarações e não declarações literais. Para isso, você deve realizar a substituição em todos os eventos que contêm texto de declaração; ou seja, eventos nas classes `general` e `table_access`. Uma definição de filtro anterior mostrou como substituir incondicionalmente o texto de declaração para eventos `general`. Para fazer o mesmo para eventos `table_access`, use um filtro que seja semelhante, mas mude a classe de `general` para `table_access` e o nome do campo de `general_query.str` para `query.str`:

```
{
  "filter": {
    "class": {
      "name": "table_access",
      "print": {
        "field": {
          "name": "query.str",
          "print": false,
          "replace": {
            "function": {
              "name": "query_digest"
            }
          }
        }
      }
    }
  }
}
```

A combinação dos filtros `general` e `table_access` resulta em um único filtro que realiza a substituição para todos os eventos que contêm texto de declaração:

```
{
  "filter": {
    "class": [
      {
        "name": "general",
        "print": {
          "field": {
            "name": "general_query.str",
            "print": false,
            "replace": {
              "function": {
                "name": "query_digest"
              }
            }
          }
        }
      },
      {
        "name": "table_access",
        "print": {
          "field": {
            "name": "query.str",
            "print": false,
            "replace": {
              "function": {
                "name": "query_digest"
              }
            }
          }
        }
      }
    ]
  }
}
```

Para realizar a substituição apenas em alguns eventos dentro de uma classe, adicione itens ao filtro que indiquem mais especificamente quando a substituição ocorre. O seguinte filtro se aplica a eventos na classe `table_access`, mas realiza a substituição apenas para os eventos `insert` e `update` (mantendo os eventos `read` e `delete` inalterados):

```
{
  "filter": {
    "class": {
      "name": "table_access",
      "event": {
        "name": [
          "insert",
          "update"
        ],
        "print": {
          "field": {
            "name": "query.str",
            "print": false,
            "replace": {
              "function": {
                "name": "query_digest"
              }
            }
          }
        }
      }
    }
  }
}
```

Este filtro substitui os eventos da classe `general` correspondentes às declarações de gerenciamento de contas listadas (o efeito é ocultar os valores de credenciais e dados nas declarações):

```
{
  "filter": {
    "class": {
      "name": "general",
      "event": {
        "name": "status",
        "print": {
          "field": {
            "name": "general_query.str",
            "print": false,
            "replace": {
              "function": {
                "name": "query_digest"
              }
            }
          }
        },
        "log": {
          "or": [
            {
              "field": {
                "name": "general_sql_command.str",
                "value": "alter_user"
              }
            },
            {
              "field": {
                "name": "general_sql_command.str",
                "value": "alter_user_default_role"
              }
            },
            {
              "field": {
                "name": "general_sql_command.str",
                "value": "create_role"
              }
            },
            {
              "field": {
                "name": "general_sql_command.str",
                "value": "create_user"
              }
            }
          ]
        }
      }
    }
  }
}
```

Para obter informações sobre os possíveis valores de `general_sql_command.str`, consulte Testando valores de campos de evento.

##### Substituindo um filtro de usuário

Em alguns casos, a definição do filtro pode ser alterada dinamicamente. Para fazer isso, defina uma configuração `filter` dentro de um existente `filter`. Por exemplo:

```
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

Um novo filtro pode ser substituído pelo original usando um item `ref` dentro do subfiltro para se referir ao filtro original `id`.

O filtro mostrado funciona da seguinte maneira:

- O filtro `main` aguarda eventos `table_access`, seja `update` ou `delete`.

- Se o evento `update` ou `delete` `table_access` ocorrer na tabela `temp_1` ou `temp_2`, o filtro é substituído pelo interno (sem o `id`, pois não há necessidade de referenciá-lo explicitamente).

- Se o fim do comando for sinalizado (evento `general` / `status`), uma entrada é escrita no arquivo de log de auditoria e o filtro é substituído pelo filtro `main`.

O filtro é útil para registrar declarações que atualizam ou excluem qualquer coisa das tabelas `temp_1` ou `temp_2`, como esta:

```
UPDATE temp_1, temp_3 SET temp_1.a=21, temp_3.a=23;
```

A declaração gera vários eventos `table_access`s, mas o arquivo de registro de auditoria contém apenas entradas `general`/`status`.

Nota

Qualquer valor `id` usado na definição é avaliado apenas em relação a essa definição. Eles não têm nada a ver com o valor da variável de sistema `audit_log_filter_id`.
