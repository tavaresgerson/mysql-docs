#### 8.4.7.4 Referência do Firewall Empresarial MySQL

As seções a seguir fornecem uma referência aos elementos do Firewall Empresarial MySQL:

*  Tabelas do Firewall Empresarial MySQL
*  Procedimentos Armazenados do Firewall Empresarial MySQL
*  Funções Administrativas do Firewall Empresarial MySQL
*  Variáveis de Sistema do Firewall Empresarial MySQL
*  Variáveis de Status do Firewall Empresarial MySQL

##### Tabelas do Firewall Empresarial MySQL

O Firewall Empresarial MySQL mantém informações de perfil por grupo e por conta, usando tabelas no banco de dados do firewall para armazenamento persistente e tabelas do Schema de Informações e do Schema de Desempenho para fornecer visões de dados em cache na memória. Quando habilitado, o firewall baseia as decisões operacionais nos dados em cache. O banco de dados do firewall pode ser o banco de dados do sistema `mysql` ou um esquema personalizado (consulte Instalar o Firewall Empresarial MySQL).

As tabelas no banco de dados do firewall são abordadas nesta seção. Para informações sobre as tabelas do Schema de Informações e do Schema de Desempenho do Firewall Empresarial MySQL, consulte a Seção 28.7, “Tabelas do Schema de Informações do Firewall Empresarial MySQL”, e a Seção 29.12.17, “Tabelas do Firewall do Schema de Desempenho”, respectivamente.

*  Tabelas de Perfil de Grupo do Firewall
*  Tabelas de Perfil de Conta do Firewall

###### Tabelas de Perfil de Grupo do Firewall

O Firewall Empresarial MySQL mantém informações de perfil de grupo usando tabelas no banco de dados do firewall (`mysql` ou personalizado) para armazenamento persistente e tabelas do Schema de Desempenho para fornecer visões de dados em cache na memória.

Cada tabela do sistema e do Schema de Desempenho é acessível apenas por contas que têm o privilégio `SELECT` para ela.

A tabela `firewall-database.firewall_groups` lista os nomes e modos operacionais dos perfis de grupo de firewall registrados. A tabela tem as seguintes colunas (com a tabela `firewall_groups` do Schema de Desempenho tendo colunas semelhantes, mas não necessariamente idênticas):

* `NAME`

  O nome do perfil de grupo.
* `MODE`

O modo operacional atual para o perfil. Os valores permitidos para o modo são `OFF`, `DETECTANDO`, `PROTEGENDO` e `RECORDANDO`. Para obter detalhes sobre seus significados, consulte  Conceitos de Firewall.
* `USERHOST`

  A conta de treinamento para o perfil do grupo, a ser usada quando o perfil estiver no modo `RECORDANDO`. O valor é `NULL`, ou uma conta `não NULL` que tenha o formato `user_name@host_name`:

  + Se o valor for `NULL`, as regras de allowlist do firewall permitem regras de declaração recebidas de qualquer conta que seja membro do grupo.
  + Se o valor for `não NULL`, as regras de allowlist do firewall permitem apenas declarações recebidas da conta nomeada (que deve ser membro do grupo).

A tabela `firewall-database.firewall_group_allowlist` lista as regras de allowlist dos perfis de grupo de firewall registrados. A tabela tem as seguintes colunas (com a tabela correspondente do Schema de Desempenho `firewall_group_allowlist` tendo colunas semelhantes, mas não necessariamente idênticas):
* `NAME`

  O nome do perfil de grupo.
* `RULE`

  Uma declaração normalizada indicando um padrão de declaração aceitável para o perfil. Uma allowlist de perfil é a união de suas regras.
* `ID`

  Uma coluna inteira que é uma chave primária para a tabela.

A tabela `firewall-database.firewall_membership` lista os membros (contas) dos perfis de grupo de firewall registrados. A tabela tem as seguintes colunas (com a tabela correspondente do Schema de Desempenho `firewall_membership` tendo colunas semelhantes, mas não necessariamente idênticas):
* `GROUP_ID`

  O nome do perfil de grupo.
* `MEMBER_ID`

  O nome de uma conta que é membro do perfil.

###### Tabelas de Perfis de Conta de Firewall

O Firewall da Empresa MySQL mantém as informações do perfil de conta usando tabelas no banco de dados do firewall para armazenamento persistente e tabelas do `INFORMATION_SCHEMA` para fornecer visualizações de dados em cache na memória. O banco de dados do firewall pode ser o banco de dados do sistema `mysql` ou um esquema personalizado (consulte  Instalando o Firewall da Empresa MySQL).

Cada tabela de banco de dados padrão é acessível apenas por contas que têm o privilégio `SELECT` para ela. As tabelas `INFORMATION_SCHEMA` são acessíveis por qualquer pessoa.

Essas tabelas estão desatualizadas e estão sujeitas à remoção em uma versão futura do MySQL. Veja Migrar perfis de conta para perfis de grupo.

A tabela `firewall-database.firewall_users` lista os nomes e os modos operacionais dos perfis de contas de firewall registrados. A tabela tem as seguintes colunas (com a tabela `MYSQL_FIREWALL_USERS` correspondente tendo colunas semelhantes, mas não necessariamente idênticas):

* `USERHOST`

  O nome do perfil de conta. Cada nome de conta tem o formato `user_name@host_name`.
* `MODE`

  O modo operacional atual para o perfil. Os valores permitidos do modo são `OFF`, `DETECTING`, `PROTECTING`, `RECORDING` e `RESET`. Para detalhes sobre seus significados, veja Conceitos de firewall.

A tabela `firewall-database.firewall_whitelist` lista as regras de lista de permissão dos perfis de contas de firewall registrados. A tabela tem as seguintes colunas (com a tabela `MYSQL_FIREWALL_WHITELIST` correspondente tendo colunas semelhantes, mas não necessariamente idênticas):

* `USERHOST`

  O nome do perfil de conta. Cada nome de conta tem o formato `user_name@host_name`.
* `RULE`

  Uma declaração normalizada indicando um padrão de declaração aceitável para o perfil. Uma lista de permissão de perfil é a união de suas regras.
* `ID`

  Uma coluna inteira que é uma chave primária para a tabela.

##### Procedimentos armazenados do MySQL Enterprise Firewall

Os procedimentos armazenados do MySQL Enterprise Firewall realizam tarefas como registrar perfis com o firewall, estabelecer seu modo operacional e gerenciar a transferência de dados do firewall entre o cache e o armazenamento persistente. Esses procedimentos invocam funções administrativas que fornecem uma API para tarefas de nível mais baixo.

Os procedimentos armazenados do firewall são criados no banco de dados do firewall. O banco de dados do firewall pode ser o banco de dados do sistema `mysql` ou um esquema personalizado (veja Instalando o MySQL Enterprise Firewall).

Para invocar um procedimento armazenado de firewall, faça isso enquanto a base de dados do firewall especificada é a base de dados padrão, ou qualifique o nome do procedimento com o nome da base de dados. Por exemplo, se `mysql` for a base de dados do firewall:

```
CALL mysql.sp_set_firewall_group_mode(group, mode);
```

No MySQL 8.4, os procedimentos armazenados de firewall são transacionais; se ocorrer um erro durante a execução de um procedimento armazenado de firewall, todas as alterações feitas até aquele ponto são revertidas e um erro é relatado.

::: info Nota

Se você instalou o MySQL Enterprise Firewall em um esquema personalizado, faça a substituição apropriada para o seu sistema. Por exemplo, se o firewall estiver instalado no esquema `fwdb`, execute os procedimentos armazenados da seguinte forma:

```
CALL fwdb.sp_set_firewall_group_mode(group, mode);
```

:::

*  Procedimentos Armazenados de Perfil de Grupo de Firewall
*  Procedimentos Armazenados de Perfil de Conta de Firewall
*  Procedimentos Armazenados de Diversos de Firewall

###### Procedimentos Armazenados de Perfil de Grupo de Firewall

Esses procedimentos armazenados realizam operações de gerenciamento em perfis de grupo de firewall:

* `sp_firewall_group_delist(group, user)`

Este procedimento armazenado remove uma conta de um perfil de grupo de firewall.

Se a chamada for bem-sucedida, a mudança na associação do grupo é feita tanto no cache em memória quanto no armazenamento persistente.

Argumentos:

+ *`group`*: O nome do perfil de grupo afetado.
+ *`user`*: A conta a ser removida, como uma string no formato `user_name@host_name`.

Exemplo:

```
  CALL mysql.sp_firewall_group_delist('g', 'fwuser@localhost');
  ```
* `sp_firewall_group_enlist(group, user)`

Este procedimento armazenado adiciona uma conta a um perfil de grupo de firewall. Não é necessário registrar a própria conta com o firewall antes de adicionar a conta ao grupo.

Se a chamada for bem-sucedida, a mudança na associação do grupo é feita tanto no cache em memória quanto no armazenamento persistente.

Argumentos:

+ *`group`*: O nome do perfil de grupo afetado.
+ *`user`*: A conta a ser adicionada, como uma string no formato `user_name@host_name`.

Exemplo:

```
  CALL mysql.sp_firewall_group_enlist('g', 'fwuser@localhost');
  ```

Este procedimento armazenado fornece controle sobre a operação do firewall para perfis de grupo individuais. O procedimento utiliza funções administrativas do firewall para recarregar as regras de memória para um perfil de grupo a partir das regras armazenadas na tabela `firewall-database.firewall_group_allowlist`.

Argumentos:

+ *`group`*: O nome do perfil de grupo afetado.

Exemplo:

```
  CALL mysql.sp_reload_firewall_group_rules('myapp');
  ```

Aviso

Este procedimento limpa as regras de allowlist de memória do perfil de grupo antes de recarregá-las do armazenamento persistente e define o modo do perfil para `OFF`. Se o modo do perfil não fosse `OFF` antes da chamada `sp_reload_firewall_group_rules()`, use `sp_set_firewall_group_mode()` para restaurá-lo ao seu modo anterior após recarregar as regras. Por exemplo, se o perfil estava no modo `PROTECTING`, isso não é mais verdade após a chamada `sp_reload_firewall_group_rules()` e você deve defini-lo explicitamente para `PROTECTING` novamente.
* `sp_set_firewall_group_mode(group, mode)`

Este procedimento armazenado estabelece o modo operacional para um perfil de grupo de firewall, após registrar o perfil com o firewall, se ele não estiver já registrado. O procedimento também invoca funções administrativas do firewall conforme necessário para transferir dados do firewall entre o cache e o armazenamento persistente. Este procedimento pode ser chamado mesmo se a variável de sistema `mysql_firewall_mode` estiver em `OFF`, embora definir o modo para um perfil não tenha efeito operacional até que o firewall seja habilitado.

Se o perfil existia anteriormente, qualquer limitação de registro para ele permanece inalterada. Para definir ou limpar a limitação, chame `sp_set_firewall_group_mode_and_user()` em vez disso.

Argumentos:

+ *`group`*: O nome do perfil de grupo afetado.
+ *`mode`*: O modo operacional para o perfil, como uma string. Os valores de modo permitidos são `OFF`, `DETECTING`, `PROTECTING` e `RECORDING`. Para detalhes sobre seus significados, consulte  Conceitos de Firewall.

Exemplo:

```
  CALL mysql.sp_set_firewall_group_mode('myapp', 'PROTECTING');
  ```
* `sp_set_firewall_group_mode_and_user(group, mode, user)`

Este procedimento armazenado registra um grupo no firewall e estabelece seu modo operacional, semelhante a `sp_set_firewall_group_mode()`, mas também especifica a conta de treinamento a ser usada quando o grupo estiver no modo `RECORDING`.

Argumentos:

+ *`group`*: O nome do perfil de grupo afetado.
+ *`mode`*: O modo operacional para o perfil, como uma string. Os valores de modo permitidos são `OFF`, `DETECTING`, `PROTECTING` e `RECORDING`. Para detalhes sobre seus significados, consulte Conceitos de Firewall.
+ *`user`*: A conta de treinamento para o perfil de grupo, a ser usada quando o perfil estiver no modo `RECORDING`. O valor é `NULL`, ou uma conta `não NULL` que tenha o formato `user_name@host_name`:

  - Se o valor for `NULL`, as regras de allowlist do firewall são registradas para declarações recebidas de qualquer conta que seja membro do grupo.
  - Se o valor for `não NULL`, as regras de allowlist do firewall são registradas apenas para declarações recebidas da conta nomeada (que deve ser membro do grupo).

Exemplo:

```
  CALL mysql.sp_set_firewall_group_mode_and_user('myapp', 'RECORDING', 'myapp_user1@localhost');
  ```

###### Perfis de Conta de Firewall Procedimentos Armazenados

Esses procedimentos armazenados realizam operações de gerenciamento em perfis de conta de firewall:

* `sp_reload_firewall_rules(user)`

  Este procedimento armazenado fornece controle sobre a operação do firewall para perfis de conta individuais. O procedimento usa funções administrativas do firewall para recarregar as regras de memória para um perfil de conta a partir das regras armazenadas na tabela `firewall-database.firewall_whitelist`.

  Argumentos:

  + *`user`*: O nome do perfil de conta afetado, como uma string no formato `user_name@host_name`.

  Exemplo:

  ```
  CALL sp_reload_firewall_rules('fwuser@localhost');
  ```

  Aviso

Este procedimento limpa as regras do perfil de perfil de firewall em memória antes de recarregá-las do armazenamento persistente e define o modo do perfil para `OFF`. Se o modo do perfil não estiver em `OFF` antes da chamada `sp_reload_firewall_rules()`, use `sp_set_firewall_mode()` para restaurá-lo ao modo anterior após recarregar as regras. Por exemplo, se o perfil estiver no modo `PROTECTING`, isso não é mais verdade após a chamada `sp_reload_firewall_rules()` e você deve defini-lo explicitamente para `PROTECTING`.

Este procedimento é desatualizado e está sujeito à remoção em uma versão futura do MySQL. Veja Migrar perfis de conta para perfis de grupo.
* `sp_set_firewall_mode(user, mode)`

Este procedimento armazenado estabelece o modo operacional para um perfil de conta de firewall, após registrar o perfil com o firewall, se ele ainda não estiver registrado. O procedimento também invoca as funções administrativas do firewall, conforme necessário, para transferir dados do firewall entre o cache e o armazenamento persistente. Este procedimento pode ser chamado mesmo se a variável de sistema `mysql_firewall_mode` estiver em `OFF`, embora definir o modo para um perfil não tenha efeito operacional até que o firewall seja habilitado.

Argumentos:

+ *`user`*: O nome do perfil de conta afetado, como uma string no formato `user_name@host_name`.
+ *`mode`*: O modo operacional para o perfil, como uma string. Os valores de modo permitidos são `OFF`, `DETECTING`, `PROTECTING`, `RECORDING` e `RESET`. Para detalhes sobre seus significados, consulte Conceitos de firewall.

Alternar um perfil de conta para qualquer modo, exceto `RECORDING`, sincroniza os dados do cache do firewall com as tabelas do banco de dados do firewall que fornecem armazenamento persistente subjacente (`mysql` ou personalizado). Alternar o modo de `OFF` para `RECORDING` recarrega a lista de permissões da tabela `firewall-database.firewall_whitelist` para o cache.

Se um perfil de conta tiver uma lista de permissões vazia, seu modo não pode ser definido como `PROTECTING` (Protegendo), porque o perfil rejeitaria todas as declarações, proibindo efetivamente a execução de declarações pela conta. Em resposta a essa tentativa de definição de modo, o firewall produz uma mensagem de diagnóstico que é retornada como resultado em vez de um erro SQL:

```
  mysql> CALL sp_set_firewall_mode('a@b','PROTECTING');
  +----------------------------------------------------------------------+
  | set_firewall_mode(arg_userhost, arg_mode)                            |
  +----------------------------------------------------------------------+
  | ERROR: PROTECTING mode requested for a@b but the allowlist is empty. |
  +----------------------------------------------------------------------+
  ```

Esse procedimento é desatualizado e está sujeito à remoção em uma versão futura do MySQL. Consulte Migrar perfis de conta para perfis de grupo.

###### Funções Administrativas do Firewall MySQL Enterprise

Essas funções administrativas do firewall do MySQL Enterprise fornecem uma API para tarefas de nível mais baixo, como sincronizar o cache do firewall com as tabelas do sistema subjacente.

* Em operação normal, essas funções são invocadas pelos procedimentos armazenados do firewall, e não diretamente pelos usuários.* Por esse motivo, essas descrições de funções não incluem detalhes como informações sobre seus argumentos e tipos de retorno.

* Funções de Perfil de Grupo de Firewall
* Funções de Perfil de Conta de Firewall
* Funções Diversas de Firewall

###### Funções de Perfil de Grupo de Firewall

Essas funções realizam operações de gerenciamento em perfis de grupo de firewall:

* `firewall_group_delist(group, user)`

  Esta função remove uma conta de um perfil de grupo. Requer o privilégio `FIREWALL_ADMIN`.

  Exemplo:

  ```
  CALL sp_migrate_firewall_user_to_group('fwuser@localhost', 'mygroup);
  ```
* `firewall_group_enlist(group, user)`

  Esta função adiciona uma conta a um perfil de grupo. Requer o privilégio `FIREWALL_ADMIN`.

  Não é necessário registrar a própria conta com o firewall antes de adicionar a conta ao grupo.

  Exemplo:

  ```
  SELECT firewall_group_delist('g', 'fwuser@localhost');
  ```
* `read_firewall_group_allowlist(group, rule)`

  Esta função agregada atualiza o cache de declaração registrada para o perfil de grupo nomeado por meio de uma declaração `SELECT` na tabela `firewall-database.firewall_group_allowlist`. Requer o privilégio `FIREWALL_ADMIN`.

  Exemplo:

  ```
  SELECT firewall_group_enlist('g', 'fwuser@localhost');
  ```
* `read_firewall_groups(group, mode, user)`

  Esta função agregada atualiza o cache de perfil de grupo de firewall por meio de uma declaração `SELECT` na tabela `firewall-database.firewall_groups`. Requer o privilégio `FIREWALL_ADMIN`.

  Exemplo:

  ```
  SELECT read_firewall_group_allowlist('my_fw_group', fgw.rule)
  FROM mysql.firewall_group_allowlist AS fgw
  WHERE NAME = 'my_fw_group';
  ```
* `set_firewall_group_mode(group, mode[, user])`

  Esta função gerencia o cache de perfil de grupo, estabelece o modo operacional do perfil e, opcionalmente, especifica a conta de treinamento do perfil. Requer o privilégio `FIREWALL_ADMIN`.

  Se o argumento opcional *`user`* não for fornecido, qualquer configuração anterior de *`user`* para o perfil permanece inalterada. Para alterar a configuração, chame a função com um terceiro argumento.

Se o argumento opcional *`user`* for fornecido, ele especifica a conta de treinamento para o perfil do grupo, a ser usada quando o perfil estiver no modo `RECORDING`. O valor é `NULL`, ou uma conta `não NULL` que tenha o formato `user_name@host_name`:

+ Se o valor for `NULL`, as regras de lista de permissão do firewall são registradas para declarações recebidas de qualquer conta que seja membro do grupo.
+ Se o valor for `não NULL`, as regras de lista de permissão do firewall são registradas apenas para declarações recebidas da conta nomeada (que deve ser membro do grupo).

Exemplo:

```
  SELECT read_firewall_groups('g', 'RECORDING', 'fwuser@localhost')
  FROM mysql.firewall_groups;
  ```

###### Funções de Perfil de Conta do Firewall

Essas funções realizam operações de gerenciamento nos perfis de conta do firewall:

* `read_firewall_users(user, mode)`

  Esta função agregada atualiza o cache do perfil de conta do firewall por meio de uma instrução `SELECT` na tabela `firewall-database.firewall_users`. Ela requer o privilégio `FIREWALL_ADMIN` ou o privilégio desatualizado `SUPER`.

  Exemplo:

  ```
  SELECT set_firewall_group_mode('g', 'DETECTING');
  ```

  Esta função é desatualizada e está sujeita à remoção em uma versão futura do MySQL. Veja Migrar perfis de conta para perfis de grupo.
* `read_firewall_whitelist(user, rule)`

  Esta função agregada atualiza o cache de declarações registradas para o perfil de conta nomeada por meio de uma instrução `SELECT` na tabela `firewall-database.firewall_whitelist`. Ela requer o privilégio `FIREWALL_ADMIN` ou o privilégio desatualizado `SUPER`.

  Exemplo:

  ```
  SELECT read_firewall_users('fwuser@localhost', 'RECORDING')
  FROM mysql.firewall_users;
  ```

  Esta função é desatualizada e está sujeita à remoção em uma versão futura do MySQL. Veja Migrar perfis de conta para perfis de grupo.
* `set_firewall_mode(user, mode)`

  Esta função gerencia o cache do perfil de conta e estabelece o modo operacional do perfil. Ela requer o privilégio `FIREWALL_ADMIN` ou o privilégio desatualizado `SUPER`.

  Exemplo:

  ```
  SELECT read_firewall_whitelist('fwuser@localhost', fw.rule)
  FROM mysql.firewall_whitelist AS fw
  WHERE USERHOST = 'fwuser@localhost';
  ```

  Esta função é desatualizada e está sujeita à remoção em uma versão futura do MySQL. Veja Migrar perfis de conta para perfis de grupo.

###### Firewall Funções Diversas

Essas funções realizam operações diversas do firewall:

*  `mysql_firewall_flush_status()`

  Esta função redefreia várias variáveis de status do firewall para 0:

  +  `Firewall_access_denied`
  +  `Firewall_access_granted`
  +  `Firewall_access_suspicious`

  Esta função requer o privilégio `FIREWALL_ADMIN` ou o privilégio desatualizado `SUPER`.

  Exemplo:

  ```
  SELECT set_firewall_mode('fwuser@localhost', 'RECORDING');
  ```
*  `normalize_statement(stmt)`

  Esta função normaliza uma instrução SQL na forma de digestão usada para regras de allowlist. Ela requer o privilégio `FIREWALL_ADMIN` ou o privilégio desatualizado `SUPER`.

  Exemplo:

  ```
  SELECT mysql_firewall_flush_status();
  ```

  ::: info Nota

  A mesma funcionalidade de digestão está disponível fora do contexto do firewall usando a função SQL `STATEMENT_DIGEST_TEXT()`.

  :::

##### Variáveis do Sistema do Firewall MySQL Enterprise

O MySQL Enterprise Firewall suporta as seguintes variáveis de sistema. Use-as para configurar a operação do firewall. Essas variáveis não estão disponíveis a menos que o firewall esteja instalado (consulte a Seção 8.4.7.2, “Instalando ou Desinstalando o MySQL Enterprise Firewall”).

*  `mysql_firewall_database`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--mysql-firewall-database[=value]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>mysql_firewall_database</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>mysql</code></td> </tr></tbody></table>

Especifica o banco de dados a partir do qual o MySQL Enterprise Firewall lê dados. Tipicamente, o plugin do lado do servidor `MYSQL_FIREWALL` armazena seus dados internos (tabelas, procedimentos armazenados e funções) no banco de dados `mysql` do sistema, mas você pode criar e usar um esquema personalizado (veja Instalar o MySQL Enterprise Firewall). Esta variável permite especificar um nome de banco de dados alternativo no início.
*  `mysql_firewall_mode`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--mysql-firewall-mode[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>mysql_firewall_mode</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Se o MySQL Enterprise Firewall está habilitado (o padrão) ou desabilitado.
*  `mysql_firewall_reload_interval_seconds`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--mysql-firewall-reload-interval-seconds[=value]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>mysql_firewall_reload_interval_seconds</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>0</code></td> </tr><tr><th>Valor mínimo</th> <td><code>60 (a menos que 0: OFF)</code></td> </tr><tr><th>Valor máximo</th> <td><code>INT_MAX</code></td> </tr><tr><th>Unidade</th> <td>segundos</td> </tr></tbody></table>

Especifica o intervalo (em segundos) que o plugin do lado do servidor usa para recarregar seu cache interno a partir das tabelas do firewall. Quando `mysql_firewall_reload_interval_seconds` tem um valor de zero (o padrão), não ocorre recarga periódica de dados das tabelas em tempo de execução. Valores entre `0` e `60` (1 a 59) não são reconhecidos pelo plugin. Em vez disso, esses valores ajustam-se automaticamente para `60`.

Esta variável exige que o componente `scheduler` esteja habilitado (`ON`). Para mais informações, consulte Agendamento de Recargas de Cache do Firewall. *  `mysql_firewall_trace`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--mysql-firewall-trace[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>mysql_firewall_trace</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Se o rastreamento do MySQL Enterprise Firewall está habilitado ou desabilitado (o padrão). Quando `mysql_firewall_trace` está habilitado, para o modo `PROTECTING`, o firewall escreve declarações rejeitadas no log de erro.

##### Variáveis de Status do MySQL Enterprise Firewall

O MySQL Enterprise Firewall suporta as seguintes variáveis de status. Use-as para obter informações sobre o status operacional do firewall. Essas variáveis não estão disponíveis a menos que o firewall esteja instalado (consulte  Seção 8.4.7.2, “Instalando ou Desinstalando o MySQL Enterprise Firewall”). As variáveis de status do firewall são definidas para 0 sempre que o plugin `MYSQL_FIREWALL` estiver instalado ou o servidor estiver iniciado. Muitas delas são zeradas pela função `mysql_firewall_flush_status()` (consulte Funções Administrativas do MySQL Enterprise Firewall).

*  `Firewall_access_denied`

  O número de declarações rejeitadas pelo MySQL Enterprise Firewall.
*  `Firewall_access_granted`

Número de declarações aceitas pelo Firewall Empresarial MySQL.
*  `Firewall_access_suspicious`

Número de declarações registradas pelo Firewall Empresarial MySQL como suspeitas para usuários que estão no modo `DETECTING`.
*  `Firewall_cached_entries`

Número de declarações registradas pelo Firewall Empresarial MySQL, incluindo duplicados.