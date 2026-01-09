#### 6.4.6.4 Referência ao Firewall Empresarial MySQL

As seções a seguir fornecem uma referência aos elementos do Firewall Empresarial MySQL:

- Tabelas do Firewall Empresarial MySQL
- Procedimentos armazenados do Firewall do MySQL Enterprise (firewall-reference.html#firewall-stored-routines)
- Funções administrativas do Firewall Empresarial MySQL (firewall-reference.html#firewall-functions)
- Variáveis do sistema do firewall empresarial do MySQL
- Variáveis de status do firewall empresarial do MySQL

##### Tabelas do Firewall Empresarial MySQL

O MySQL Enterprise Firewall mantém as informações do perfil em uma base por grupo e por conta, usando tabelas no banco de dados do firewall para armazenamento persistente e tabelas do Schema de Informações para fornecer visões sobre dados armazenados em cache na memória. Quando ativado, o firewall baseia as decisões operacionais nos dados armazenados em cache. O banco de dados do firewall pode ser o banco de dados do sistema `mysql` ou um esquema personalizado (consulte Instalando o MySQL Enterprise Firewall).

As tabelas no banco de dados do firewall são abordadas nesta seção. Para informações sobre as tabelas do esquema de informações do MySQL Enterprise Firewall, consulte Seção 24.7, “Tabelas do esquema de informações MySQL Enterprise Firewall”.

Cada tabela de banco de dados do sistema `mysql` é acessível apenas por contas que tenham o privilégio `SELECT` para ela. As tabelas do `INFORMATION_SCHEMA` são acessíveis por qualquer pessoa.

A tabela `mysql.firewall_users` lista os nomes e os modos operacionais dos perfis de contas de firewall registrados. A tabela tem as seguintes colunas (com a tabela correspondente do Schema de Informações `MYSQL_FIREWALL_USERS` que tem colunas semelhantes, mas não necessariamente idênticas):

- `USERHOST`

  O nome do perfil da conta. Cada nome de conta tem o formato `user_name@host_name`.

- `MODO`

  O modo operacional atual para o perfil. Os valores permitidos para o modo são `OFF`, `DETECTING`, `PROTECTING`, `RECORDING` e `RESET`. Para obter detalhes sobre seus significados, consulte Conceitos de Firewall.

A tabela `mysql.firewall_whitelist` lista as regras de lista de permissão dos perfis de conta de firewall registrados. A tabela tem as seguintes colunas (com a tabela correspondente do Schema de Informações `MYSQL_FIREWALL_WHITELIST` que tem colunas semelhantes, mas não necessariamente idênticas):

- `USERHOST`

  O nome do perfil da conta. Cada nome de conta tem o formato `user_name@host_name`.

- REGRA

  Uma declaração normalizada que indica um padrão de declaração aceitável para o perfil. Um allowlist de perfil é a união de suas regras.

- `ID`

  Uma coluna inteira que é uma chave primária para a tabela. Esta coluna foi adicionada no MySQL 5.7.23.

##### Procedimentos armazenados do firewall empresarial MySQL

Os procedimentos armazenados do MySQL Enterprise Firewall realizam tarefas como registrar perfis com o firewall, estabelecer seu modo operacional e gerenciar a transferência de dados do firewall entre o cache e o armazenamento persistente. Esses procedimentos invocam funções administrativas que fornecem uma API para tarefas de nível inferior.

Os procedimentos armazenados do firewall são criados no banco de dados do sistema `mysql`. Para invocar um procedimento armazenado do firewall, faça isso enquanto `mysql` é o banco de dados padrão, ou qualifique o nome do procedimento com o nome do banco de dados. Por exemplo:

```sql
CALL mysql.sp_set_firewall_mode(user, mode);
```

A lista a seguir descreve cada procedimento armazenado do firewall:

- `sp_reload_firewall_rules(usuário)`

  Este procedimento armazenado fornece controle sobre o funcionamento do firewall para perfis de contas individuais. O procedimento utiliza funções administrativas do firewall para recarregar as regras de memória para um perfil de conta a partir das regras armazenadas na tabela `mysql.firewall_whitelist`.

  Argumentos:

  - *`user`*: O nome do perfil da conta afetada, como uma string no formato `user_name@host_name`.

  Exemplo:

  ```sql
  CALL mysql.sp_reload_firewall_rules('fwuser@localhost');
  ```

  Aviso

  Esse procedimento limpa as regras do perfil de conta na lista de permissões em memória antes de recarregá-las do armazenamento persistente e define o modo do perfil para `OFF`. Se o modo do perfil não estiver em `OFF` antes da chamada `sp_reload_firewall_rules()`, use `sp_set_firewall_mode()` para restaurar seu modo anterior após recarregar as regras. Por exemplo, se o perfil estiver no modo `PROTECTING`, isso não é mais verdade após a chamada `sp_reload_firewall_rules()` e você deve defini-lo novamente para `PROTECTING` explicitamente.

- `sp_set_firewall_mode(usuário, modo)`

  Este procedimento armazenado estabelece o modo operacional para um perfil de conta de firewall, após registrar o perfil com o firewall, se ele ainda não estiver registrado. O procedimento também invoca as funções administrativas do firewall, conforme necessário, para transferir dados do firewall entre o cache e o armazenamento persistente. Este procedimento pode ser chamado mesmo se a variável de sistema `mysql_firewall_mode` estiver em `OFF`, embora a definição do modo para um perfil não tenha efeito operacional até que o firewall seja habilitado.

  Argumentos:

  - *`user`*: O nome do perfil da conta afetada, como uma string no formato `user_name@host_name`.

  - *`mode`*: O modo operacional para o perfil, como uma string. Os valores de modo permitidos são `OFF`, `DETECTING`, `PROTECTING`, `RECORDING` e `RESET`. Para obter detalhes sobre seus significados, consulte Conceitos de Firewall.

  Ao mudar o perfil da conta para qualquer modo, exceto `RECORDING`, os dados do cache do firewall são sincronizados com as tabelas do banco de dados do sistema `mysql`, que fornecem armazenamento persistente. Ao mudar o modo de `OFF` para `RECORDING`, o allowlist é recarregado da tabela `mysql.firewall_whitelist` para o cache.

  Se um perfil de conta tiver uma lista de permissões vazia, seu modo não pode ser definido como `PROTECTING` (Protegendo), porque o perfil rejeitaria todas as declarações, proibindo efetivamente a execução de declarações na conta. Em resposta a essa tentativa de definição de modo, o firewall emite uma mensagem de diagnóstico que é retornada como um conjunto de resultados, em vez de como um erro SQL:

  ```sql
  mysql> CALL mysql.sp_set_firewall_mode('a@b','PROTECTING');
  +----------------------------------------------------------------------+
  | set_firewall_mode(arg_userhost, arg_mode)                            |
  +----------------------------------------------------------------------+
  | ERROR: PROTECTING mode requested for a@b but the whitelist is empty. |
  +----------------------------------------------------------------------+
  1 row in set (0.02 sec)

  Query OK, 0 rows affected (0.02 sec)
  ```

##### Funções administrativas do Firewall Empresarial MySQL

As funções administrativas do MySQL Enterprise Firewall fornecem uma API para tarefas de nível inferior, como sincronizar o cache do firewall com as tabelas do sistema subjacente.

\*Em operação normal, essas funções são chamadas pelos procedimentos armazenados do firewall, e não diretamente pelos usuários. \* Por essa razão, essas descrições de funções não incluem detalhes como informações sobre seus argumentos e tipos de retorno.

- Funções do perfil da conta do firewall
- Funções Diversas do Firewall

###### Funções do perfil de conta do firewall

Essas funções realizam operações de gerenciamento em perfis de contas de firewall:

- \`read\_firewall\_users(user, mode)

  Essa função agregada atualiza o cache do perfil da conta do firewall por meio de uma instrução `SELECT` na tabela `mysql.firewall_users`. Ela requer o privilégio `SUPER`.

  Exemplo:

  ```sql
  SELECT read_firewall_users('fwuser@localhost', 'RECORDING')
  FROM mysql.firewall_users;
  ```

- \`read\_firewall\_whitelist(usuário, regra)

  Essa função agregada atualiza o cache de declarações registradas para o perfil de conta nomeado por meio de uma instrução `SELECT` na tabela `mysql.firewall_whitelist`. Ela requer o privilégio `SUPER`.

  Exemplo:

  ```sql
  SELECT read_firewall_whitelist('fwuser@localhost', fw.rule)
  FROM mysql.firewall_whitelist AS fw
  WHERE USERHOST = 'fwuser@localhost';
  ```

- `set_firewall_mode(usuário, modo)`

  Essa função gerencia o cache do perfil da conta e estabelece o modo operacional do perfil. Ela requer o privilégio `SUPER`.

  Exemplo:

  ```sql
  SELECT set_firewall_mode('fwuser@localhost', 'RECORDING');
  ```

###### Firewall Funções Diversas

Essas funções realizam operações de firewall variadas:

- `mysql_firewall_flush_status()`

  Essa função redefre várias variáveis de status do firewall para 0:

  - `Firewall_access_denied`
  - `Firewall_access_granted`
  - `Firewall_access_suspicious`

  Essa função requer o privilégio `SUPER`.

  Exemplo:

  ```sql
  SELECT mysql_firewall_flush_status();
  ```

- `normalize_statement(stmt)`

  Essa função normaliza uma instrução SQL na forma de digestão usada para regras de allowlist. Ela requer o privilégio `SUPER`.

  Exemplo:

  ```sql
  SELECT normalize_statement('SELECT * FROM t1 WHERE c1 > 2');
  ```

##### Variáveis do sistema de firewall empresarial do MySQL

O MySQL Enterprise Firewall suporta as seguintes variáveis de sistema. Use-as para configurar o funcionamento do firewall. Essas variáveis não estão disponíveis a menos que o firewall esteja instalado (consulte Seção 6.4.6.2, “Instalando ou Desinstalando o MySQL Enterprise Firewall”).

- `mysql_firewall_mode`

  <table frame="box" rules="all" summary="Propriedades para mysql_firewall_mode"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysql-firewall-mode[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="firewall-reference.html#sysvar_mysql_firewall_mode">mysql_firewall_mode</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>

  Se o MySQL Enterprise Firewall está habilitado (o padrão) ou desabilitado.

- `mysql_firewall_trace`

  <table frame="box" rules="all" summary="Propriedades para mysql_firewall_trace"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysql-firewall-trace[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="firewall-reference.html#sysvar_mysql_firewall_trace">mysql_firewall_trace</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  Se o rastreamento do Firewall Empresarial do MySQL estiver habilitado ou desabilitado (o padrão). Quando o `mysql_firewall_trace` está habilitado, para o modo `PROTECTING`, o firewall escreve declarações rejeitadas no log de erro.

##### Variáveis de status do Firewall Empresarial MySQL

O MySQL Enterprise Firewall suporta as seguintes variáveis de status. Use-as para obter informações sobre o status operacional do firewall. Essas variáveis não estão disponíveis a menos que o firewall esteja instalado (consulte Seção 6.4.6.2, “Instalando ou Desinstalando o MySQL Enterprise Firewall”). As variáveis de status do firewall são definidas como 0 sempre que o plugin `MYSQL_FIREWALL` estiver instalado ou o servidor estiver iniciado. Muitas delas são zeradas pela função `mysql_firewall_flush_status()` (consulte Funções Administrativas do MySQL Enterprise Firewall).

- `Firewall_access_denied`

  Número de declarações rejeitadas pelo MySQL Enterprise Firewall.

- `Firewall_access_granted`

  O número de declarações aceitas pelo MySQL Enterprise Firewall.

- `Firewall_access_suspicious`

  O número de declarações registradas pelo MySQL Enterprise Firewall como suspeitas para usuários que estão no modo `DETECTANDO`.

- `Firewall_cached_entries`

  O número de declarações registradas pelo MySQL Enterprise Firewall, incluindo duplicados.
