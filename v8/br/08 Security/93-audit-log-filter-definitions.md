#### 8.4.5.8 Definições de Filtro de Registro de Eventos

As definições de filtro são valores `JSON`. Para obter informações sobre o uso de dados `JSON` no MySQL, consulte a Seção 13.5, “O Tipo de Dados JSON”.

As definições de filtro têm esta forma, onde *`actions`* indica como o filtro ocorre:

```
{ "filter": actions }
```

A discussão a seguir descreve as construções permitidas nas definições de filtro.

* Registrar Todos os Eventos
* Registrar Categorias Específicas de Eventos
* Registrar Subcategorias Específicas de Eventos
* Registro Inclusivo e Exclusivo
* Testar Valores de Campo de Evento
* Bloquear a Execução de Eventos Específicos
* Operadores Lógicos
* Referenciar Variáveis Predefinidas
* Referenciar Funções Predefinidas
* Substituição de Valores de Campo de Evento
* Substituição de um Filtro de Usuário

##### Registro de Todos os Eventos

Para habilitar ou desabilitar explicitamente o registro de todos os eventos, use um item `log` no filtro:

```
{
  "filter": { "log": true }
}
```

O valor `log` pode ser `true` ou `false`.

O filtro anterior habilita o registro de todos os eventos. É equivalente a:

```
{
  "filter": { }
}
```

O comportamento de registro depende do valor de `log` e se os itens `class` ou `event` são especificados:

* Com `log` especificado, seu valor dado é usado.
* Sem `log` especificado, o registro é `true` se nenhum item `class` ou `event` for especificado, e `false` caso contrário (neste caso, `class` ou `event` podem incluir seu próprio item `log`).

##### Registro de Categorias Específicas de Eventos

Para registrar eventos de uma categoria específica, use um item `class` no filtro, com seu campo `name` denotando o nome da categoria a ser registrada:

```
{
  "filter": {
    "class": { "name": "connection" }
  }
}
```

O valor `name` pode ser `connection`, `general` ou `table_access` para registrar eventos de conexão, gerais ou de acesso a tabelas, respectivamente.

O filtro anterior habilita o registro de eventos na classe `connection`. É equivalente ao seguinte filtro com itens `log` explicitados:

```
{
  "filter": {
    "log": false,
    "class": { "log": true,
               "name": "connection" }
  }
}
```

Para habilitar o registro de múltiplas categorias, defina o valor `class` como um elemento de array `JSON` que nomeia as categorias:

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

::: info Nota
Português (Brasil):

Quando múltiplas instâncias de um item específico aparecem no mesmo nível dentro de uma definição de filtro, os valores dos itens podem ser combinados em uma única instância desse item dentro de um valor de matriz. A definição anterior pode ser escrita da seguinte forma:

```
{
  "filter": {
    "class": [
      { "name": [ "connection", "general", "table_access" ] }
    ]
  }
}
```

:::

##### Registro de Subclasses Específicas de Eventos

Para selecionar subclasses de eventos específicas, use um item `event` contendo um item `name` que nomeia as subclasses. A ação padrão para eventos selecionados por um item `event` é registrar-os. Por exemplo, este filtro habilita o registro para as subclasses de eventos nomeadas:

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

O item `event` também pode conter itens `log` explícitos para indicar se os eventos qualificadores devem ser registrados. Este item `event` seleciona múltiplos eventos e indica explicitamente o comportamento de registro para eles:

```
"event": [
  { "name": "read", "log": false },
  { "name": "insert", "log": true },
  { "name": "delete", "log": true },
  { "name": "update", "log": true }
]
```

O item `event` também pode indicar se os eventos qualificadores devem ser bloqueados, se contiver um item `abort`. Para detalhes, consulte Bloqueando a Execução de Eventos Específicos.

 A Tabela 8.34, “Combinações de Classes e Subclasses de Eventos”, descreve os valores de subclasse permitidos para cada classe de evento.

**Tabela 8.34 Combinações de Classes e Subclasses de Eventos**

<table><col style="width: 20%"/><col style="width: 20%"/><col style="width: 60%"/><thead><tr> <th>Classe de Evento</th> <th>Subclasse de Evento</th> <th>Descrição</th> </tr></thead><tbody><tr> <th><code>conexão</code></th> <td><code>conectar</code></td> <td>Início da conexão (sucesso ou falha)</td> </tr><tr> <th><code>conexão</code></th> <td><code>mudar_usuário</code></td> <td>Reauthenticação do usuário com diferentes usuário/senha durante a sessão</td> </tr><tr> <th><code>conexão</code></th> <td><code>desconectar</code></td> <td>Terminação da conexão</td> </tr><tr> <th><code>geral</code></th> <td><code>status</code></td> <td>Informações gerais sobre a operação</td> </tr><tr> <th><code>mensagem</code></th> <td><code>interno</code></td> <td>Mensagem gerada internamente</td> </tr><tr> <th><code>mensagem</code></th> <td><code>usuário</code></td> <td>Mensagem gerada por <code>audit_api_message_emit_udf()</code></td> </tr><tr> <th><code>acesso à tabela</code></th> <td><code>leitura</code></td> <td>Instruções de leitura de tabela, como <code>SELECT</code> ou <code>INSERT INTO ... SELECT</code></td> </tr><tr> <th><code>acesso à tabela</code></th> <td><code>exclusão</code></td> <td>Instruções de exclusão de tabela, como <code>DELETE</code> ou <code>TRUNCATE TABLE</code></td> </tr><tr> <th><code>acesso à tabela</code></th> <td><code>inserção</code></td> <td>Instruções de inserção de tabela, como <code>INSERT</code> ou <code>REPLACE</code></td> </tr><tr> <th><code>acesso à tabela</code></th> <td><code>atualização</code></td> <td>Instruções de atualização de tabela, como <code>UPDATE</code></td> </tr></tbody></table>

 A tabela 8.35, “Características de Log e Abordagem por Combinação de Classe e Subclasse de Evento”, descreve para cada subclasse de evento se ela pode ser registrada ou abordada.

**Tabela 8.35 Características de Log e Abordagem por Combinação de Classe e Subclasse de Evento**

<table><col style="width: 20%"/><col style="width: 20%"/><col style="width: 30%"/><col style="width: 30%"/><thead><tr> <th>Classe do Evento</th> <th>Subclasse do Evento</th> <th>Pode ser Registrado</th> <th>Pode ser Abandonado</th> </tr></thead><tbody><tr> <th><code>conexão</code></th> <td><code>conectar</code></td> <td>Sim</td> <td>Não</td> </tr><tr> <th><code>conexão</code></th> <td><code>alterar_usuário</code></td> <td>Sim</td> <td>Não</td> </tr><tr> <th><code>conexão</code></th> <td><code>desconectar</code></td> <td>Sim</td> <td>Não</td> </tr><tr> <th><code>geral</code></th> <td><code>status</code></td> <td>Sim</td> <td>Não</td> </tr><tr> <th><code>mensagem</code></th> <td><code>interno</code></td> <td>Sim</td> <td>Sim</td> </tr><tr> <th><code>mensagem</code></th> <td><code>usuário</code></td> <td>Sim</td> <td>Sim</td> </tr><tr> <th><code>acesso_tabela</code></th> <td><code>leitura</code></td> <td>Sim</td> <td>Sim</td> </tr><tr> <th><code>acesso_tabela</code></th> <td><code>exclusão</code></td> <td>Sim</td> <td>Sim</td> </tr><tr> <th><code>acesso_tabela</code></th> <td><code>inserção</code></td> <td>Sim</td> <td>Sim</td> </tr><tr> <th><code>acesso_tabela</code></th> <td><code>atualização</code></td> <td>Sim</td> <td>Sim</td> </tr></tbody></table>

##### Registro Inclusivo e Exclusivo

Uma filtro pode ser definido no modo inclusivo ou exclusivo:

* O modo inclusivo registra apenas itens especificados explicitamente.
* O modo exclusivo registra tudo, exceto itens especificados explicitamente.

Para realizar o registro inclusivo, desative o registro globalmente e habilite o registro para classes específicas. Este filtro registra os eventos `conectar` e `desconectar` na classe `conexão`, e eventos na classe `geral`:

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

Para realizar o registro exclusivo, habilite o registro globalmente e desabilite o registro para classes específicas. Este filtro registra tudo, exceto eventos na classe `geral`:

```
{
  "filter": {
    "log": true,
    "class":
      { "name": "general", "log": false }
  }
}
```

Este filtro registra eventos `change_user` na classe `connection`, eventos `message` e eventos `table_access`, por não registrar tudo o resto:

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

##### Testando os Valores dos Campos de Eventos

Para habilitar o registro com base em valores específicos de campos de eventos, especifique um item `field` dentro do item `log` que indique o nome do campo e seu valor esperado:

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

Um evento na classe `connection` indica quando uma atividade relacionada à conexão ocorre durante uma sessão, como um usuário se conectando ou desconectando do servidor. A Tabela 8.36, “Campos de Eventos de Conexão”, indica os campos permitidos para eventos `connection`.

**Tabela 8.36 Campos de Eventos de Conexão**

<table><col style="width: 35%"/><col style="width: 20%"/><col style="width: 45%"/><thead><tr> <th>Nome do Campo</th> <th>Tipo do Campo</th> <th>Descrição</th> </tr></thead><tbody><tr> <th><code>status</code></th> <td>inteiro</td> <td><p class="valor-válido"> Status do evento: </p><p class="valor-válido"> 0: OK </p><p class="valor-válido"> Caso contrário: Falhou </p></td> </tr><tr> <th><code>connection_id</code></th> <td>inteiro sem sinal</td> <td>ID de conexão</td> </tr><tr> <th><code>user.str</code></th> <td>string</td> <td>Nome do usuário especificado durante a autenticação</td> </tr><tr> <th><code>user.length</code></th> <td>inteiro sem sinal</td> <td>Tamanho do nome do usuário</td> </tr><tr> <th><code>priv_user.str</code></th> <td>string</td> <td>Nome do usuário autenticado (nome do usuário da conta)</td> </tr><tr> <th><code>priv_user.length</code></th> <td>inteiro sem sinal</td> <td>Tamanho do nome do usuário autenticado</td> </tr><tr> <th><code>external_user.str</code></th> <td>string</td> <td>Nome do usuário externo (fornecido pelo plugin de autenticação de terceiros)</td> </tr><tr> <th><code>external_user.length</code></th> <td>inteiro sem sinal</td> <td>Tamanho do nome do usuário externo</td> </tr><tr> <th><code>proxy_user.str</code></th> <td>string</td> <td>Nome do usuário proxy</td> </tr><tr> <th><code>proxy_user.length</code></th> <td>inteiro sem sinal</td> <td>Tamanho do nome do usuário proxy</td> </tr><tr> <th><code>host.str</code></th> <td>string</td> <td>Host do usuário conectado</td> </tr><tr> <th><code>host.length</code></th> <td>inteiro sem sinal</td> <td>Tamanho do host do usuário conectado</td> </tr><tr> <th><code>ip.str</code></th> <td>string</td> <td>Endereço IP do usuário conectado</td> </tr><tr> <th><code>ip.length</code></th> <td>inteiro sem sinal</td> <td>Tamanho do endereço IP do usuário conectado</td> </tr><tr> <th><code>database.str</code></th> <td>string</td> <td>Nome do banco de dados especificado no momento da conexão</td> </tr><tr> <th><code>database.length</code></th> <td>inteiro sem sinal</td> <td>Tamanho do nome do banco de dados</td> </tr><tr> <th><code>connection_type</code></th> <td>inteiro</td> <td><p class="valor-válido"> Tipo de conexão: </p><p class="valor-válido"> 0 ou <code>"::undefined"</code>: Indefinido </p><p class="valor-válido"> 1 ou <code>"::tcp/ip"</code>: TCP/IP </p><p class="valor-válido"> 2 ou <code>"::socket"</code>: Socket </p><p class="valor-válido"> 3 ou <code>"::named_pipe"</code>: Named pipe </p><p class="valor-válido"> 4 ou <code>"::ssl"</code>: TCP/IP com criptografia </p><p class="valor-válido"> 5 ou <code>"::shared_memory"</code>: Memória compartilhada </p></td> </tr></tbody></table>

Os valores `"::xxx"` são pseudo-constantes simbólicas que podem ser usados em vez dos valores numéricos literais. Eles devem ser citados como strings e são sensíveis a maiúsculas e minúsculas.

Um evento na classe `general` indica o código de status de uma operação e seus detalhes. A Tabela 8.37, “Campos de Evento Geral”, indica os campos permitidos para eventos `general`.

**Tabela 8.37 Campos de Evento Geral**

<table><col style="width: 35%"/><col style="width: 20%"/><col style="width: 45%"/><thead><tr> <th>Nome do campo</th> <th>Tipo do campo</th> <th>Descrição</th> </tr></thead><tbody><tr> <th><code>general_error_code</code></th> <td>inteiro</td> <td><p class="valor_válido"> Status do evento: </p><p class="valor_válido"> 0: OK </p><p class="valor_válido"> Caso contrário: Falhou </p></td> </tr><tr> <th><code>general_thread_id</code></th> <td>inteiro sem sinal</td> <td>ID de conexão/thread</td> </tr><tr> <th><code>general_user.str</code></th> <td>string</td> <td>Nome do usuário especificado durante a autenticação</td> </tr><tr> <th><code>general_user.length</code></th> <td>inteiro sem sinal</td> <td>Comprimento do nome do usuário</td> </tr><tr> <th><code>general_command.str</code></th> <td>string</td> <td>Nome do comando</td> </tr><tr> <th><code>general_command.length</code></th> <td>inteiro sem sinal</td> <td>Comprimento do nome do comando</td> </tr><tr> <th><code>general_query.str</code></th> <td>string</td> <td>Texto da instrução SQL</td> </tr><tr> <th><code>general_query.length</code></th> <td>inteiro sem sinal</td> <td>Comprimento do texto da instrução SQL</td> </tr><tr> <th><code>general_host.str</code></th> <td>string</td> <td>Nome do host</td> </tr><tr> <th><code>general_host.length</code></th> <td>inteiro sem sinal</td> <td>Comprimento do nome do host</td> </tr><tr> <th><code>general_sql_command.str</code></th> <td>string</td> <td>Nome do tipo de comando SQL</td> </tr><tr> <th><code>general_sql_command.length</code></th> <td>inteiro sem sinal</td> <td>Comprimento do nome do tipo de comando SQL</td> </tr><tr> <th><code>general_external_user.str</code></th> <td>string</td> <td>Nome do usuário externo (fornecido pelo plugin de autenticação de terceiros)</td> </tr><tr> <th><code>general_external_user.length</code></th> <td>inteiro sem sinal</td> <td>Comprimento do nome do usuário externo</td> </tr><tr> <th><code>general_ip.str</code></th> <td>string</td> <td>Endereço IP do usuário conectado</td> </tr><tr> <th><code>general_ip.length</code></th> <td>inteiro sem sinal</td> <td>Comprimento do endereço IP do usuário conectado</td> </tr></tbody></table>

`general_command.str` indica um nome de comando: `Query`, `Execute`, `Sair` ou `Alterar usuário`.

Um evento `general` com o campo `general_command.str` definido como `Query` ou `Execute` contém `general_sql_command.str` definido para um valor que especifica o tipo de comando SQL: `alter_db`, `alter_db_upgrade`, `admin_commands`, e assim por diante. Os valores `general_sql_command.str` disponíveis podem ser vistos como os últimos componentes dos instrumentos do Schema de Desempenho exibidos por esta declaração:

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

Um evento na classe `table_access` fornece informações sobre um tipo específico de acesso a uma tabela. A Tabela 8.38, “Campos de Eventos de Acesso à Tabela”, indica os campos permitidos para eventos `table_access`.

**Tabela 8.38 Campos de Eventos de Acesso à Tabela**

<table><col style="width: 35%"/><col style="width: 20%"/><col style="width: 45%"/><thead><tr> <th>Nome do Campo</th> <th>Tipo de Campo</th> <th>Descrição</th> </tr></thead><tbody><tr> <th><code>connection_id</code></th> <td>inteiro sem sinal</td> <td>ID de conexão do evento</td> </tr><tr> <th><code>sql_command_id</code></th> <td>inteiro</td> <td>ID do comando SQL</td> </tr><tr> <th><code>query.str</code></th> <td>string</td> <td>texto do comando SQL</td> </tr><tr> <th><code>query.length</code></th> <td>inteiro sem sinal</td> <td>comprimento do texto do comando SQL</td> </tr><tr> <th><code>table_database.str</code></th> <td>string</td> <td>nome do banco de dados associado ao evento</td> </tr><tr> <th><code>table_database.length</code></th> <td>inteiro sem sinal</td> <td>comprimento do nome do banco de dados</td> </tr><tr> <th><code>table_name.str</code></th> <td>string</td> <td>nome da tabela associado ao evento</td> </tr><tr> <th><code>table_name.length</code></th> <td>inteiro sem sinal</td> <td>comprimento do nome da tabela</td> </tr></tbody></table>

A lista a seguir mostra quais declarações produzem quais eventos de acesso à tabela:

* Evento `read`:

+ `SELECT`
+ `INSERT ... SELECT` (para tabelas referenciadas na cláusula `SELECT`)
+ `REPLACE ... SELECT` (para tabelas referenciadas na cláusula `SELECT`)
+ `UPDATE ... WHERE` (para tabelas referenciadas na cláusula `WHERE`)
+ `HANDLER ... READ`
* evento `delete`:

+ `DELETE`
+ `TRUNCATE TABLE`
* evento `insert`:

+ `INSERT`
+ `INSERT ... SELECT` (para tabela referenciada na cláusula `INSERT`)
+ `REPLACE`
+ `REPLACE ... SELECT` (para tabela referenciada na cláusula `REPLACE`)
+ `LOAD DATA`
+ `LOAD XML`
* evento `update`:

+ `UPDATE`
+ `UPDATE ... WHERE` (para tabelas referenciadas na cláusula `UPDATE`)

##### Bloqueio da Execução de Eventos Específicos

Os itens `event` podem incluir um item `abort` que indica se os eventos qualificadores devem ser impedidos de serem executados. O `abort` permite que regras sejam escritas que bloqueiam a execução de declarações SQL específicas.

Importante

Teoricamente, é possível que um usuário com permissões suficientes crie acidentalmente um item `abort` no filtro do log de auditoria que impeça a si mesmo e a outros administradores de acessar o sistema. O privilégio `AUDIT_ABORT_EXEMPT` está disponível para permitir que as consultas de uma conta sejam sempre executadas, mesmo que um item `abort` as bloqueie. As contas com esse privilégio podem, portanto, ser usadas para recuperar o acesso a um sistema após uma configuração incorreta de auditoria. A consulta ainda é registrada no log de auditoria, mas, em vez de ser rejeitada, é permitida devido ao privilégio.

As contas criadas com o privilégio `SYSTEM_USER` têm o privilégio `AUDIT_ABORT_EXEMPT` atribuído automaticamente quando são criadas. O privilégio `AUDIT_ABORT_EXEMPT` também é atribuído às contas existentes com o privilégio `SYSTEM_USER` quando você executa um procedimento de atualização, se nenhuma conta existente tiver esse privilégio atribuído.

O item `abort` deve aparecer dentro de um item `event`. Por exemplo:

```
"event": {
  "name": qualifying event subclass names
  "abort": condition
}
```

Para subclasses de eventos selecionadas pelo item `name`, a ação `abort` é verdadeira ou falsa, dependendo da avaliação da `condition`. Se a condição for avaliada como verdadeira, o evento é bloqueado. Caso contrário, o evento continua sendo executado.

A especificação da `condition` pode ser tão simples quanto `true` ou `false`, ou pode ser mais complexa, dependendo das características do evento.

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

Este filtro mais complexo bloqueia as mesmas instruções, mas apenas para uma tabela específica (`finances.bank_account`):

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

As instruções que correspondem e são bloqueadas pelo filtro retornam um erro ao cliente:

```
ERROR 1045 (28000): Statement was aborted by an audit log filter
```

Nem todos os eventos podem ser bloqueados (consulte a Tabela 8.35, “Características de Log e Abort por Combinação de Classe e Subclasse de Evento”). Para um evento que não pode ser bloqueado, o log de auditoria escreve uma mensagem de aviso no log de erros em vez de bloqueá-lo.

Para tentativas de definir um filtro em que o item `abort` aparece em outro lugar que não em um item `event`, ocorre um erro.

##### Operadores Lógicos

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

##### Referenciando Variáveis Predefinidas

Para referenciar uma variável predefinida em uma condição `log`, use um item `variable`, que aceita os itens `name` e `value` e testa a igualdade da variável nomeada com um valor dado:

```
"variable": {
  "name": "variable_name",
  "value": comparison_value
}
```

Isso é verdadeiro se *`variable_name`* tiver o valor *`comparison_value`*, falso caso contrário.

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

As variáveis do sistema `audit_log_xxx_policy` são usadas para o modo legado obsoleto do log de auditoria (consulte a Seção 8.4.5.10, “Filtragem do Log de Auditoria no Modo Legado”). Com a filtragem do log de auditoria baseada em regras, essas variáveis permanecem visíveis (por exemplo, usando `SHOW VARIABLES`), mas as alterações nelas não têm efeito, a menos que você escreva filtros que contenham construções que as refiram.

A lista a seguir descreve as variáveis predefinidas permitidas para os itens `variable`:

* `audit_log_connection_policy_value`

  Esta variável corresponde ao valor da variável do sistema `audit_log_connection_policy`. O valor é um inteiro não assinado. A Tabela 8.39, “Valores de audit_log_connection_policy_value”, mostra os valores permitidos e os valores correspondentes de `audit_log_connection_policy`.

  **Tabela 8.39 Valores de audit_log_connection_policy_value**

  <table><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Valor</th> <th>Valor correspondente de audit_log_connection_policy</th> </tr></thead><tbody><tr> <td><code>0</code> ou <code>"::none"</code></td> <td><code>NONE</code></td> </tr><tr> <td><code>1</code> ou <code>"::errors"</code></td> <td><code>ERRORS</code></td> </tr><tr> <td><code>2</code> ou <code>"::all"</code></td> <td><code>ALL</code></td> </tr></tbody></table>

  Os valores `"::xxx"` são pseudo-constantes simbólicas que podem ser fornecidos em vez dos valores numéricos literais. Eles devem ser citados como strings e são sensíveis ao caso.
* `audit_log_policy_value`

Esta variável corresponde ao valor da variável de sistema `audit_log_policy`. O valor é um inteiro sem sinal. A tabela 8.40, “Valores de `audit_log_policy_value`”, mostra os valores permitidos e os valores correspondentes de `audit_log_policy`.

**Tabela 8.40 Valores de `audit_log_policy_value`**

<table><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Valor</th> <th>Valor correspondente de `audit_log_policy`</th> </tr></thead><tbody><tr> <td><code>0</code> ou <code>"::none"</code></td> <td><code>NONE</code></td> </tr><tr> <td><code>1</code> ou <code>"::logins"</code></td> <td><code>LOGINS</code></td> </tr><tr> <td><code>2</code> ou <code>"::all"</code></td> <td><code>ALL</code></td> </tr><tr> <td><code>3</code> ou <code>"::queries"</code></td> <td><code>QUERIES</code></td> </tr></tbody></table>

Os valores `"::xxx"` são constantes simbólicas que podem ser usadas em vez dos valores numéricos literais. Eles devem ser citados como strings e são sensíveis ao caso.
* `audit_log_statement_policy_value`

Esta variável corresponde ao valor da variável de sistema `audit_log_statement_policy`. O valor é um inteiro sem sinal. A tabela 8.41, “Valores de `audit_log_statement_policy_value`”, mostra os valores permitidos e os valores correspondentes de `audit_log_statement_policy`.

**Tabela 8.41 Valores de `audit_log_statement_policy_value`**

<table><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Valor</th> <th>Valor correspondente de `audit_log_statement_policy`</th> </tr></thead><tbody><tr> <td><code>0</code> ou <code>"::none"</code></td> <td><code>NONE</code></td> </tr><tr> <td><code>1</code> ou <code>"::errors"</code></td> <td><code>ERRORS</code></td> </tr><tr> <td><code>2</code> ou <code>"::all"</code></td> <td><code>ALL</code></td> </tr></tbody></table>

Os valores `"::xxx"` são constantes simbólicas que podem ser usadas em vez dos valores numéricos literais. Eles devem ser citados como strings e são sensíveis ao caso.

##### Referência a Funções Predefinidas

Para referenciar uma função predefinida em uma condição `log`, use um item `function`, que aceita os itens `name` e `args` para especificar o nome da função e seus argumentos, respectivamente:

```
"function": {
  "name": "function_name",
  "args": arguments
}
```

O item `name` deve especificar apenas o nome da função, sem parênteses ou a lista de argumentos.

O item `args` deve satisfazer estas condições:

* Se a função não receber argumentos, não deve ser fornecido nenhum item `args`.
* Se a função receber argumentos, um item `args` é necessário, e os argumentos devem ser fornecidos na ordem listada na descrição da função. Os argumentos podem referenciar variáveis predefinidas, campos de evento ou constantes numéricas ou de string.

Se o número de argumentos estiver incorreto ou os argumentos não forem dos tipos de dados corretos exigidos pela função, ocorrerá um erro.

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

O filtro anterior determina se os eventos de status da classe `general` devem ser registrados no `log` dependendo se o usuário atual está encontrado na variável de sistema `audit_log_include_accounts`. Esse usuário é construído usando campos no evento.

A lista a seguir descreve as funções predefinidas permitidas para os itens `function`:

* `audit_log_exclude_accounts_is_null()`

  Verifica se a variável de sistema `audit_log_exclude_accounts` é `NULL`. Esta função pode ser útil ao definir filtros que correspondem à implementação de log de auditoria legada.

  Argumentos:

  Nenhum.
* `audit_log_include_accounts_is_null()`

  Verifica se a variável de sistema `audit_log_include_accounts` é `NULL`. Esta função pode ser útil ao definir filtros que correspondem à implementação de log de auditoria legada.

  Argumentos:

  Nenhum.
* `debug_sleep(millisec)`

  Faz o sono por um número determinado de milissegundos. Esta função é usada durante a medição de desempenho.

  O `debug_sleep()` está disponível apenas para builds de depuração.

  Argumentos:

  + *`millisec`*: Um inteiro sem sinal que especifica o número de milissegundos para dormir.
* `find_in_exclude_list(account)`

Verifica se uma string de conta existe na lista de exclusão do log de auditoria (o valor da variável de sistema `audit_log_exclude_accounts`).

Argumentos:

+ *`account`*: Uma string que especifica o nome da conta do usuário.
* `find_in_include_list(account)`

Verifica se uma string de conta existe na lista de inclusão do log de auditoria (o valor da variável de sistema `audit_log_include_accounts`).

Argumentos:

+ *`account`*: Uma string que especifica o nome da conta do usuário.
* `query_digest([str])`

Esta função tem comportamento diferente dependendo de se um argumento for fornecido:

+ Sem argumento, `query_digest` retorna o valor do digest da declaração correspondente ao texto literal da declaração no evento atual.
+ Com um argumento, `query_digest` retorna um Booleano indicando se o argumento é igual ao digest atual da declaração.

Argumentos:

+ *`str`*: Este argumento é opcional. Se fornecido, especifica um digest de declaração a ser comparado com o digest da declaração no evento atual.

Exemplos:

Este item `function` não inclui argumento, então `query_digest` retorna o digest atual da declaração como uma string:

```
  "function": {
    "name": "query_digest"
  }
  ```

Este item `function` inclui um argumento, então `query_digest` retorna um Booleano indicando se o argumento é igual ao digest atual da declaração:

```
  "function": {
    "name": "query_digest",
    "args": "SELECT ?"
  }
  ```
* `string_find(text, substr)`

Verifica se o valor `substr` está contido no valor `text`. Esta busca é case-sensitive.

Argumentos:

+ *`text`*: A string de texto a ser pesquisada.
+ *`substr`*: A substring a ser pesquisada em *`text`*.

##### Substituição de Valores de Campos de Eventos

As definições de filtro de auditoria suportam a substituição de certos campos de eventos de auditoria, para que os eventos registrados contenham o valor de substituição em vez do valor original. Essa capacidade permite que os registros de auditoria registrados incluam digests de declarações em vez de declarações literais, o que pode ser útil para implantações MySQL nas quais as declarações possam expor valores sensíveis.

A substituição de campos em eventos de auditoria funciona da seguinte maneira:

* As substituições de campos são especificadas nas definições dos filtros de auditoria, portanto, a filtragem do log de auditoria deve ser habilitada conforme descrito na Seção 8.4.5.7, “Filtragem do Log de Auditoria”.
* Nem todos os campos podem ser substituídos. A Tabela 8.42, “Campos de Evento Suscetíveis à Substituição”, mostra quais campos são substituíveis em quais classes de eventos.

  **Tabela 8.42 Campos de Evento Suscetíveis à Substituição**

  <table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Classe de Evento</th> <th>Nome do Campo</th> </tr></thead><tbody><tr> <td><code>general</code></td> <td><code>general_query.str</code></td> </tr><tr> <td><code>table_access</code></td> <td><code>query.str</code></td> </tr></tbody></table>
* A substituição é condicional. Cada especificação de substituição em uma definição de filtro inclui uma condição, permitindo que um campo substituível seja alterado ou deixado inalterado, dependendo do resultado da condição.
* Se a substituição ocorrer, a especificação de substituição indica o valor de substituição usando uma função permitida para esse propósito.

Como a Tabela 8.42, “Campos de Evento Suscetíveis à Substituição”, mostra, atualmente, os únicos campos substituíveis são aqueles que contêm texto de declaração (que ocorre em eventos das classes `general` e `table_access`). Além disso, a única função permitida para especificar o valor de substituição é `query_digest`. Isso significa que a única operação de substituição permitida é substituir o texto literal de declaração pelo seu digest correspondente.

Como a substituição de campo ocorre em uma fase de auditoria precoce (durante a filtragem), a escolha de escrever o texto literal de declaração ou os valores de digest aplica-se independentemente do formato do log escrito posteriormente (ou seja, se o plugin de log de auditoria produz saída XML ou JSON).

A substituição de campo pode ocorrer em diferentes níveis de granularidade de evento:

* Para realizar substituição de campo para todos os eventos em uma classe, filtre os eventos no nível da classe.
* Para realizar substituição com base em uma granularidade mais fina, inclua itens adicionais de seleção de eventos. Por exemplo, você pode realizar substituição de campo apenas para subclasses específicas de uma determinada classe de evento ou apenas em eventos para os quais os campos têm certas características.

Dentro de uma definição de filtro, especifique a substituição de campo incluindo um item `print`, que tem esta sintaxe:

```
"print": {
  "field": {
    "name": "field_name",
    "print": condition,
    "replace": replacement_value
  }
}
```

Dentro do item `print`, seu item `field` recebe estes três itens para indicar como a substituição ocorre, se e como:

* `name`: O campo para o qual a substituição (potencialmente) ocorre. *`field_name`* deve ser um dos mostrados na Tabela 8.42, “Campos de Evento Sujeitos à Substituição”.
* `print`: A condição que determina se o valor original do campo deve ser mantido ou substituído:

  + Se *`condition`* avaliar para `true`, o campo permanece inalterado.
  + Se *`condition`* avaliar para `false`, a substituição ocorre, usando o valor do item `replace`.

Para substituir incondicionalmente um campo, especifique a condição assim:

```
  "print": false
  ```
* `replace`: O valor de substituição a ser usado quando a condição `print` avaliar para `false`. Especifique *`replacement_value`* usando um item `function`.

Por exemplo, esta definição de filtro se aplica a todos os eventos na classe `general`, substituindo o texto literal da declaração pelo seu digest:

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

O filtro anterior usa este item `print` para substituir incondicionalmente o texto literal da declaração contida em `general_query.str` pelo seu valor de digest:

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

Itens `print` podem ser escritos de diferentes maneiras para implementar diferentes estratégias de substituição. O item `replace` mostrado apenas especifica o texto de substituição usando esta construção `function` para retornar uma string representando o digest atual da declaração:

```
"function": {
  "name": "query_digest"
}
```

A função `query_digest` também pode ser usada de outra maneira, como um comparador que retorna um valor booleano, o que permite seu uso na condição `print`. Para isso, forneça um argumento que especifique um digest de declaração de comparação:

```
"function": {
  "name": "query_digest",
  "args": "digest"
}
```

Neste caso, `query_digest` retorna `true` ou `false`, dependendo se o digest atual da declaração é o mesmo do digest de comparação. Usar `query_digest` dessa maneira permite que as definições de filtro detectem declarações que correspondem a digests específicos. A condição na construção a seguir é verdadeira apenas para declarações que têm um digest igual a `SELECT ?`, afetando assim a substituição apenas para declarações que não correspondem ao digest:

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

Suponha que você queira que o log de auditoria contenha apenas digests de declarações e não declarações literais. Para isso, você deve realizar a substituição em todos os eventos que contêm texto de declaração; ou seja, eventos nas classes `general` e `table_access`. Uma definição de filtro anterior mostrou como substituir incondicionalmente o texto de declaração para eventos `general`. Para fazer o mesmo para eventos `table_access`, use um filtro que é semelhante, mas altera a classe de `general` para `table_access` e o nome do campo de `general_query.str` para `query.str`:

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

Combinando os filtros `general` e `table_access` resulta em um único filtro que realiza a substituição para todos os eventos que contêm texto de declaração:

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

Para realizar a substituição apenas em alguns eventos dentro de uma classe, adicione itens ao filtro que indiquem mais especificamente quando a substituição ocorre. O seguinte filtro se aplica a eventos na classe `table_access`, mas realiza a substituição apenas para eventos `insert` e `update` (deixando os eventos `read` e `delete` inalterados):

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

Este filtro substitui eventos da classe `general` que correspondem às declarações de gerenciamento de conta listadas (o efeito é ocultar os valores de credenciais e dados nas declarações):

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

Para obter informações sobre os possíveis valores de `general_sql_command.str`, consulte Testando os valores dos campos de evento.

##### Substituindo um Filtro de Usuário

Em alguns casos, a definição do filtro pode ser alterada dinamicamente. Para fazer isso, defina uma configuração de `filter` dentro de um `filter` existente. Por exemplo:

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

Um novo filtro pode ser substituído pelo original usando um item `ref` dentro do subfiltro para referenciar o ID do filtro original.

O filtro mostrado funciona da seguinte forma:

* O filtro `main` aguarda eventos de `table_access`, seja `update` ou `delete`.
* Se o evento `update` ou `delete` de `table_access` ocorrer na tabela `temp_1` ou `temp_2`, o filtro é substituído pelo interno (sem um `id`, pois não há necessidade de referenciá-lo explicitamente).
* Se o final do comando for sinalizado (`evento general` / `status`), uma entrada é escrita no arquivo de log de auditoria e o filtro é substituído pelo filtro `main`.

O filtro é útil para registrar declarações que atualizam ou excluem algo das tabelas `temp_1` ou `temp_2`, como esta:

```
UPDATE temp_1, temp_3 SET temp_1.a=21, temp_3.a=23;
```

A declaração gera vários eventos de `table_access`, mas o arquivo de log de auditoria contém apenas entradas `general` / `status`.

::: info Nota

Quaisquer valores de `id` usados na definição são avaliados apenas com relação a essa definição. Eles não têm nada a ver com o valor da variável de sistema `audit_log_filter_id`.

:::