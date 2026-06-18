#### 8.4.7.4 Referência ao Firewall Empresarial do MySQL

As seções a seguir fornecem uma referência aos elementos do Firewall Empresarial MySQL:

- Tabelas do Firewall Empresarial MySQL
- Procedimentos armazenados do firewall empresarial MySQL
- Funções administrativas do Firewall Empresarial MySQL
- Variáveis do sistema de firewall empresarial do MySQL
- Variáveis de status do Firewall Empresarial MySQL

##### Tabelas do Firewall Empresarial MySQL

O MySQL Enterprise Firewall mantém as informações do perfil em uma base por grupo e por conta, usando tabelas no banco de dados do firewall para armazenamento persistente e tabelas do Schema de Informações e do Schema de Desempenho para fornecer visões sobre dados armazenados em cache na memória. Quando ativado, o firewall baseia as decisões operacionais nos dados armazenados em cache. O banco de dados do firewall pode ser o banco de dados do sistema `mysql` ou um esquema personalizado (consulte Instalar o MySQL Enterprise Firewall).

As tabelas do banco de dados do firewall são abordadas nesta seção. Para informações sobre as tabelas do esquema de informações do MySQL Enterprise Firewall e do esquema de desempenho, consulte a Seção 28.7, “Tabelas do esquema de informações do MySQL Enterprise Firewall”, e a Seção 29.12.17, “Tabelas do esquema de firewall de desempenho”, respectivamente.

- Tabelas de perfil do grupo do firewall
- Tabelas de perfil de conta do firewall

###### Tabelas de perfil do grupo do firewall

A partir do MySQL 8.0.23, o MySQL Enterprise Firewall mantém as informações do perfil do grupo usando tabelas no banco de dados do sistema `mysql` para armazenamento persistente e tabelas do Schema de Desempenho para fornecer visões sobre dados armazenados em cache na memória.

Cada sistema e tabela do Schema de Desempenho é acessível apenas por contas que tenham o privilégio \[\[`SELECT`] para ele.

A tabela `mysql.firewall_groups` lista os nomes e os modos operacionais dos perfis de grupo de firewall registrados. A tabela tem as seguintes colunas (com a tabela correspondente do Schema de Desempenho `firewall_groups` que tem colunas semelhantes, mas não necessariamente idênticas):

- `NAME`

  O nome do perfil do grupo.

- `MODE`

  O modo operacional atual para o perfil. Os valores permitidos para o modo são `OFF`, `DETECTING`, `PROTECTING` e `RECORDING`. Para obter detalhes sobre seus significados, consulte Conceitos de Firewall.

- `USERHOST`

  A conta de treinamento para o perfil do grupo, a ser usada quando o perfil estiver no modo `RECORDING`. O valor é `NULL`, ou uma conta que não seja `NULL` e tenha o formato `user_name@host_name`:

  - Se o valor for `NULL`, as regras de permissão do firewall permitem listas de endereços para declarações recebidas de qualquer conta que seja membro do grupo.

  - Se o valor não for `NULL`, as regras de allowlist do firewall permitem apenas declarações recebidas da conta nomeada (que deve ser membro do grupo).

As regras de allowlist da tabela `mysql.firewall_group_allowlist` permitem listar perfis de grupo de firewall registrados. A tabela tem as seguintes colunas (com a tabela correspondente do Schema de Desempenho `firewall_group_allowlist` que tem colunas semelhantes, mas não necessariamente idênticas):

- `NAME`

  O nome do perfil do grupo.

- `RULE`

  Uma declaração normalizada que indica um padrão de declaração aceitável para o perfil. Um allowlist de perfil é a união de suas regras.

- `ID`

  Uma coluna inteira que é uma chave primária para a tabela.

A tabela `mysql.firewall_membership` lista os membros (contas) dos perfis de grupo de firewall registrados. A tabela tem as seguintes colunas (com a tabela correspondente do Schema de Desempenho `firewall_membership` que tem colunas semelhantes, mas não necessariamente idênticas):

- `GROUP_ID`

  O nome do perfil do grupo.

- `MEMBER_ID`

  O nome de uma conta que é membro do perfil.

###### Tabelas de perfil de conta do firewall

O MySQL Enterprise Firewall mantém as informações do perfil da conta usando tabelas no banco de dados do sistema `mysql` para armazenamento persistente e tabelas `INFORMATION_SCHEMA` para fornecer visões de dados armazenados em cache na memória.

Cada tabela de banco de dados do sistema `mysql` é acessível apenas por contas que tenham o privilégio `SELECT` para ela. As tabelas `INFORMATION_SCHEMA` são acessíveis por qualquer pessoa.

A partir do MySQL 8.0.26, essas tabelas são desaconselhadas e estão sujeitas à remoção em uma versão futura do MySQL. Veja Migrar perfis de conta para perfis de grupo.

A tabela `mysql.firewall_users` lista os nomes e os modos operacionais dos perfis de contas de firewall registrados. A tabela tem as seguintes colunas (com a tabela `MYSQL_FIREWALL_USERS` correspondente, que tem colunas semelhantes, mas não necessariamente idênticas):

- `USERHOST`

  O nome do perfil da conta. Cada nome de conta tem o formato `user_name@host_name`.

- `MODE`

  O modo operacional atual para o perfil. Os valores permitidos para o modo são `OFF`, `DETECTING`, `PROTECTING`, `RECORDING` e `RESET`. Para obter detalhes sobre seus significados, consulte Conceitos de Firewall.

As regras de allowlist da tabela `mysql.firewall_whitelist` permitem a listagem de perfis de contas de firewall registadas. A tabela possui as seguintes colunas (com a tabela `MYSQL_FIREWALL_WHITELIST` correspondente, que possui colunas semelhantes, mas não necessariamente idênticas):

- `USERHOST`

  O nome do perfil da conta. Cada nome de conta tem o formato `user_name@host_name`.

- `RULE`

  Uma declaração normalizada que indica um padrão de declaração aceitável para o perfil. Um allowlist de perfil é a união de suas regras.

- `ID`

  Uma coluna inteira que é uma chave primária para a tabela. Esta coluna foi adicionada no MySQL 8.0.12.

##### Procedimentos armazenados do firewall empresarial MySQL

Os procedimentos armazenados do MySQL Enterprise Firewall realizam tarefas como registrar perfis com o firewall, estabelecer seu modo operacional e gerenciar a transferência de dados do firewall entre o cache e o armazenamento persistente. Esses procedimentos invocam funções administrativas que fornecem uma API para tarefas de nível inferior.

Os procedimentos armazenados do firewall são criados no banco de dados do sistema `mysql`. Para invocar um procedimento armazenado do firewall, faça isso enquanto `mysql` é o banco de dados padrão, ou qualifique o nome do procedimento com o nome do banco de dados. Por exemplo:

```
CALL mysql.sp_set_firewall_group_mode(group, mode);
```

- Perfil do Grupo do Firewall Procedimentos Armazenados
- Perfil de Conta do Firewall Procedimentos Armazenados
- Firewall - Procedimentos Múltiplos Armazenados

###### Perfil do Grupo do Firewall Procedimentos Armazenados

Esses procedimentos armazenados realizam operações de gerenciamento em perfis de grupos de firewall:

- `sp_firewall_group_delist(group, user)`

  Este procedimento armazenado remove uma conta de um perfil de grupo de firewall.

  Se a chamada for bem-sucedida, a alteração na associação do grupo é feita tanto no cache de memória quanto no armazenamento persistente.

  Argumentos:

  - `group`: O nome do perfil do grupo afetado.

  - `user`: A conta a ser removida, como uma string no formato `user_name@host_name`.

  Exemplo:

  ```
  CALL sp_firewall_group_delist('g', 'fwuser@localhost');
  ```

  Esse procedimento foi adicionado no MySQL 8.0.23.

- `sp_firewall_group_enlist(group, user)`

  Este procedimento armazenado adiciona uma conta a um perfil de grupo de firewall. Não é necessário registrar a própria conta com o firewall antes de adicionar a conta ao grupo.

  Se a chamada for bem-sucedida, a alteração na associação do grupo é feita tanto no cache de memória quanto no armazenamento persistente.

  Argumentos:

  - `group`: O nome do perfil do grupo afetado.

  - `user`: A conta a ser adicionada, como uma string no formato `user_name@host_name`.

  Exemplo:

  ```
  CALL sp_firewall_group_enlist('g', 'fwuser@localhost');
  ```

  Esse procedimento foi adicionado no MySQL 8.0.23.

- `sp_reload_firewall_group_rules(group)`

  Este procedimento armazenado fornece controle sobre a operação do firewall para perfis de grupo individuais. O procedimento utiliza funções administrativas do firewall para recarregar as regras de memória para um perfil de grupo a partir das regras armazenadas na tabela `mysql.firewall_group_allowlist`.

  Argumentos:

  - `group`: O nome do perfil do grupo afetado.

  Exemplo:

  ```
  CALL sp_reload_firewall_group_rules('myapp');
  ```

  Aviso

  Esse procedimento limpa as regras do grupo de permissões em memória antes de recarregá-las do armazenamento persistente e define o modo do perfil para `OFF`. Se o modo do perfil não era `OFF` antes da chamada `sp_reload_firewall_group_rules()`, use `sp_set_firewall_group_mode()` para restaurar seu modo anterior após recarregar as regras. Por exemplo, se o perfil estava no modo `PROTECTING`, isso não é mais verdade após a chamada `sp_reload_firewall_group_rules()` e você deve defini-lo novamente para `PROTECTING` explicitamente.

  Esse procedimento foi adicionado no MySQL 8.0.23.

- `sp_set_firewall_group_mode(group, mode)`

  Este procedimento armazenado estabelece o modo operacional para um perfil de grupo de firewall, após registrar o perfil com o firewall, se ele ainda não estiver registrado. O procedimento também invoca as funções administrativas do firewall, conforme necessário, para transferir dados do firewall entre o cache e o armazenamento persistente. Este procedimento pode ser chamado mesmo que a variável de sistema `mysql_firewall_mode` seja `OFF`, embora a definição do modo para um perfil não tenha efeito operacional até que o firewall seja habilitado.

  Se o perfil já existia, qualquer limitação de gravação permanecerá inalterada. Para definir ou limpar a limitação, ligue para `sp_set_firewall_group_mode_and_user()` em vez disso.

  Argumentos:

  - `group`: O nome do perfil do grupo afetado.

  - `mode`: O modo operacional para o perfil, como uma string. Os valores de modo permitidos são `OFF`, `DETECTING`, `PROTECTING` e `RECORDING`. Para obter detalhes sobre seus significados, consulte Conceitos de Firewall.

  Exemplo:

  ```
  CALL sp_set_firewall_group_mode('myapp', 'PROTECTING');
  ```

  Esse procedimento foi adicionado no MySQL 8.0.23.

- `sp_set_firewall_group_mode_and_user(group, mode, user)`

  Este procedimento armazenado registra um grupo no firewall e estabelece seu modo operacional, semelhante ao `sp_set_firewall_group_mode()`, mas também especifica a conta de treinamento a ser usada quando o grupo estiver no modo `RECORDING`.

  Argumentos:

  - `group`: O nome do perfil do grupo afetado.

  - `mode`: O modo operacional para o perfil, como uma string. Os valores de modo permitidos são `OFF`, `DETECTING`, `PROTECTING` e `RECORDING`. Para obter detalhes sobre seus significados, consulte Conceitos de Firewall.

  - `user`: A conta de treinamento para o perfil do grupo, a ser usada quando o perfil estiver no modo `RECORDING`. O valor é `NULL`, ou uma conta que não seja `NULL` e tenha o formato `user_name@host_name`:

    - Se o valor for `NULL`, as regras de permissão do firewall permitem listas de endereços para declarações recebidas de qualquer conta que seja membro do grupo.

    - Se o valor não for `NULL`, as regras de allowlist do firewall permitem apenas declarações recebidas da conta nomeada (que deve ser membro do grupo).

  Exemplo:

  ```
  CALL sp_set_firewall_group_mode_and_user('myapp', 'RECORDING', 'myapp_user1@localhost');
  ```

  Esse procedimento foi adicionado no MySQL 8.0.23.

###### Perfil de Conta do Firewall Procedimentos Armazenados

Esses procedimentos armazenados realizam operações de gerenciamento em perfis de contas de firewall:

- `sp_reload_firewall_rules(user)`

  Este procedimento armazenado fornece controle sobre o funcionamento do firewall para perfis de contas individuais. O procedimento utiliza funções administrativas do firewall para recarregar as regras de memória para um perfil de conta a partir das regras armazenadas na tabela `mysql.firewall_whitelist`.

  Argumentos:

  - `user`: O nome do perfil da conta afetada, como uma string no formato `user_name@host_name`.

  Exemplo:

  ```
  CALL mysql.sp_reload_firewall_rules('fwuser@localhost');
  ```

  Aviso

  Esse procedimento limpa as regras do perfil de conta na lista de permissões em memória antes de recarregá-las do armazenamento persistente e define o modo do perfil para `OFF`. Se o modo do perfil não era `OFF` antes da chamada `sp_reload_firewall_rules()`, use `sp_set_firewall_mode()` para restaurar seu modo anterior após recarregar as regras. Por exemplo, se o perfil estava no modo `PROTECTING`, isso não é mais verdade após a chamada `sp_reload_firewall_rules()` e você deve defini-lo novamente para `PROTECTING` explicitamente.

  A partir do MySQL 8.0.26, esse procedimento é desaconselhável e está sujeito à remoção em uma versão futura do MySQL. Veja Migrar perfis de conta para perfis de grupo.

- `sp_set_firewall_mode(user, mode)`

  Este procedimento armazenado estabelece o modo operacional para um perfil de conta de firewall, após registrar o perfil com o firewall, se ele ainda não estiver registrado. O procedimento também invoca as funções administrativas do firewall, conforme necessário, para transferir dados do firewall entre o cache e o armazenamento persistente. Este procedimento pode ser chamado mesmo que a variável de sistema `mysql_firewall_mode` seja `OFF`, embora a definição do modo para um perfil não tenha efeito operacional até que o firewall seja habilitado.

  Argumentos:

  - `user`: O nome do perfil da conta afetada, como uma string no formato `user_name@host_name`.

  - `mode`: O modo operacional para o perfil, como uma string. Os valores de modo permitidos são `OFF`, `DETECTING`, `PROTECTING`, `RECORDING` e `RESET`. Para obter detalhes sobre seus significados, consulte Conceitos de Firewall.

  Mudar o perfil de uma conta para qualquer modo, exceto `RECORDING`, sincroniza os dados do cache do firewall com as tabelas do banco de dados do sistema `mysql`, que fornecem armazenamento persistente. Mudar o modo de `OFF` para `RECORDING` recarrega a lista de permissões da tabela `mysql.firewall_whitelist` para o cache.

  Se um perfil de conta tiver uma lista de permissões vazia, seu modo não pode ser definido como `PROTECTING`, pois o perfil rejeitaria todas as declarações, proibindo efetivamente a execução de declarações na conta. Em resposta a essa tentativa de definição de modo, o firewall produz uma mensagem de diagnóstico que é retornada como um conjunto de resultados, em vez de como um erro SQL:

  ```
  mysql> CALL mysql.sp_set_firewall_mode('a@b','PROTECTING');
  +----------------------------------------------------------------------+
  | set_firewall_mode(arg_userhost, arg_mode)                            |
  +----------------------------------------------------------------------+
  | ERROR: PROTECTING mode requested for a@b but the allowlist is empty. |
  +----------------------------------------------------------------------+
  ```

  A partir do MySQL 8.0.26, esse procedimento é desaconselhável e está sujeito à remoção em uma versão futura do MySQL. Veja Migrar perfis de conta para perfis de grupo.

###### Firewall - Procedimentos Múltiplos Armazenados

Esses procedimentos armazenados realizam operações de gerenciamento de firewall diversos.

- `sp_migrate_firewall_user_to_group(user, group)`

  A partir do MySQL 8.0.26, os perfis de conta são desaconselhados, pois os perfis de grupo podem fazer tudo o que os perfis de conta podem fazer. O procedimento armazenado `sp_migrate_firewall_user_to_group()` converte um perfil de conta de firewall em um perfil de grupo com a conta como seu único membro registrado. Execute o script `firewall_profile_migration.sql` para instalá-lo. O procedimento de conversão é discutido em Migrar perfis de conta para perfis de grupo.

  Essa rotina requer o privilégio `FIREWALL_ADMIN`.

  Argumentos:

  - `user`: O nome do perfil de conta a ser convertido em um perfil de grupo, como uma string no formato `user_name@host_name`. O perfil de conta deve existir e não estar atualmente no modo `RECORDING`.

  - `group`: O nome do novo perfil de grupo, que não pode já existir. O novo perfil de grupo tem a conta nomeada como seu único membro inscrito, e esse membro é definido como a conta de treinamento do grupo. O modo operacional do perfil de grupo é obtido do modo operacional do perfil da conta.

  Exemplo:

  ```
  CALL sp_migrate_firewall_user_to_group('fwuser@localhost', 'mygroup);
  ```

  Esse procedimento foi adicionado no MySQL 8.0.26.

##### Funções administrativas do Firewall Empresarial MySQL

As funções administrativas do MySQL Enterprise Firewall fornecem uma API para tarefas de nível inferior, como sincronizar o cache do firewall com as tabelas do sistema subjacente.

\*Em operação normal, essas funções são chamadas pelos procedimentos armazenados do firewall, e não diretamente pelos usuários. \* Por essa razão, essas descrições de funções não incluem detalhes como informações sobre seus argumentos e tipos de retorno.

- Funções do perfil do grupo do firewall
- Funções do perfil de conta do firewall
- Firewall Funções Diversas

###### Funções do perfil do grupo do firewall

Essas funções realizam operações de gerenciamento em perfis de grupos de firewall:

- `firewall_group_delist(group, user)`

  Essa função remove uma conta de um perfil de grupo. Requer o privilégio `FIREWALL_ADMIN`.

  Exemplo:

  ```
  SELECT firewall_group_delist('g', 'fwuser@localhost');
  ```

  Essa função foi adicionada no MySQL 8.0.23.

- `firewall_group_enlist(group, user)`

  Essa função adiciona uma conta ao perfil de um grupo. Requer o privilégio `FIREWALL_ADMIN`.

  Não é necessário registrar a própria conta com o firewall antes de adicionar a conta ao grupo.

  Exemplo:

  ```
  SELECT firewall_group_enlist('g', 'fwuser@localhost');
  ```

  Essa função foi adicionada no MySQL 8.0.23.

- `read_firewall_group_allowlist(group, rule)`

  Essa função agregada atualiza o cache de declarações registradas para o perfil do grupo nomeado por meio de uma declaração `SELECT` na tabela `mysql.firewall_group_allowlist`. Ela requer o privilégio `FIREWALL_ADMIN`.

  Exemplo:

  ```
  SELECT read_firewall_group_allowlist('my_fw_group', fgw.rule)
  FROM mysql.firewall_group_allowlist AS fgw
  WHERE NAME = 'my_fw_group';
  ```

  Essa função foi adicionada no MySQL 8.0.23.

- `read_firewall_groups(group, mode, user)`

  Essa função agregada atualiza o cache do perfil do grupo de firewall por meio de uma declaração `SELECT` na tabela `mysql.firewall_groups`. Ela requer o privilégio `FIREWALL_ADMIN`.

  Exemplo:

  ```
  SELECT read_firewall_groups('g', 'RECORDING', 'fwuser@localhost')
  FROM mysql.firewall_groups;
  ```

  Essa função foi adicionada no MySQL 8.0.23.

- `set_firewall_group_mode(group, mode[, user])`

  Essa função gerencia o cache do perfil do grupo, estabelece o modo operacional do perfil e, opcionalmente, especifica a conta de treinamento do perfil. Requer o privilégio `FIREWALL_ADMIN`.

  Se o argumento opcional `user` não for fornecido, qualquer configuração anterior de `user` para o perfil permanecerá inalterada. Para alterar a configuração, chame a função com um terceiro argumento.

  Se o argumento opcional `user` for fornecido, ele especifica a conta de treinamento para o perfil do grupo, a ser usada quando o perfil estiver no modo `RECORDING`. O valor é `NULL`, ou uma conta que não seja `NULL` e tenha o formato `user_name@host_name`:

  - Se o valor for `NULL`, as regras de permissão do firewall permitem listas de endereços para declarações recebidas de qualquer conta que seja membro do grupo.

  - Se o valor não for `NULL`, as regras de allowlist do firewall permitem apenas declarações recebidas da conta nomeada (que deve ser membro do grupo).

  Exemplo:

  ```
  SELECT set_firewall_group_mode('g', 'DETECTING');
  ```

  Essa função foi adicionada no MySQL 8.0.23.

###### Funções do perfil de conta do firewall

Essas funções realizam operações de gerenciamento em perfis de contas de firewall:

- `read_firewall_users(user, mode)`

  Essa função agregada atualiza o cache do perfil da conta do firewall por meio de uma declaração `SELECT` na tabela `mysql.firewall_users`. Ela requer o privilégio `FIREWALL_ADMIN` ou o privilégio desatualizado `SUPER`.

  Exemplo:

  ```
  SELECT read_firewall_users('fwuser@localhost', 'RECORDING')
  FROM mysql.firewall_users;
  ```

  A partir do MySQL 8.0.26, essa função é desaconselhada e está sujeita à remoção em uma versão futura do MySQL. Veja Migrar perfis de conta para perfis de grupo.

- `read_firewall_whitelist(user, rule)`

  Essa função agregada atualiza o cache de declarações registradas para o perfil de conta nomeado por meio de uma declaração `SELECT` na tabela `mysql.firewall_whitelist`. Ela requer o privilégio `FIREWALL_ADMIN` ou o privilégio desatualizado `SUPER`.

  Exemplo:

  ```
  SELECT read_firewall_whitelist('fwuser@localhost', fw.rule)
  FROM mysql.firewall_whitelist AS fw
  WHERE USERHOST = 'fwuser@localhost';
  ```

  A partir do MySQL 8.0.26, essa função é desaconselhada e está sujeita à remoção em uma versão futura do MySQL. Veja Migrar perfis de conta para perfis de grupo.

- `set_firewall_mode(user, mode)`

  Essa função gerencia o cache do perfil da conta e estabelece o modo operacional do perfil. Ela requer o privilégio `FIREWALL_ADMIN` ou o privilégio desatualizado `SUPER`.

  Exemplo:

  ```
  SELECT set_firewall_mode('fwuser@localhost', 'RECORDING');
  ```

  A partir do MySQL 8.0.26, essa função é desaconselhada e está sujeita à remoção em uma versão futura do MySQL. Veja Migrar perfis de conta para perfis de grupo.

###### Firewall Funções Diversas

Essas funções realizam operações de firewall variadas:

- `mysql_firewall_flush_status()`

  Essa função redefre várias variáveis de status do firewall para 0:

  - `Firewall_access_denied`
  - `Firewall_access_granted`
  - `Firewall_access_suspicious`

  Essa função requer o privilégio `FIREWALL_ADMIN` ou o privilégio desatualizado `SUPER`.

  Exemplo:

  ```
  SELECT mysql_firewall_flush_status();
  ```

- `normalize_statement(stmt)`

  Essa função normaliza uma instrução SQL na forma de digestão usada para regras de allowlist. Ela requer o privilégio `FIREWALL_ADMIN` ou o privilégio desatualizado `SUPER`.

  Exemplo:

  ```
  SELECT normalize_statement('SELECT * FROM t1 WHERE c1 > 2');
  ```

  Nota

  A mesma funcionalidade de digest está disponível fora do contexto do firewall usando a função SQL `STATEMENT_DIGEST_TEXT()`.

##### Variáveis do sistema de firewall empresarial do MySQL

O MySQL Enterprise Firewall suporta as seguintes variáveis de sistema. Use-as para configurar o funcionamento do firewall. Essas variáveis não estão disponíveis a menos que o firewall esteja instalado (consulte a Seção 8.4.7.2, “Instalando ou Desinstalando o MySQL Enterprise Firewall”).

- `mysql_firewall_mode`

  <table summary="Propriedades para mysql_firewall_mode"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysql-firewall-mode[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>mysql_firewall_mode</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>

  Se o MySQL Enterprise Firewall está habilitado (o padrão) ou desabilitado.

- `mysql_firewall_trace`

  <table summary="Propriedades para mysql_firewall_trace"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysql-firewall-trace[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>mysql_firewall_trace</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  Se o rastreamento do Firewall Empresarial do MySQL estiver ativado ou desativado (o padrão). Quando o `mysql_firewall_trace` estiver ativado, para o modo `PROTECTING`, o firewall escreve as declarações rejeitadas no log de erro.

##### Variáveis de status do Firewall Empresarial MySQL

O MySQL Enterprise Firewall suporta as seguintes variáveis de status. Use-as para obter informações sobre o status operacional do firewall. Essas variáveis não estão disponíveis a menos que o firewall esteja instalado (consulte a Seção 8.4.7.2, “Instalando ou Desinstalando o MySQL Enterprise Firewall”). As variáveis de status do firewall são definidas como 0 sempre que o plugin `MYSQL_FIREWALL` estiver instalado ou o servidor estiver iniciado. Muitas delas são zeradas pela função `mysql_firewall_flush_status()` (consulte Funções Administrativas do MySQL Enterprise Firewall).

- `Firewall_access_denied`

  Número de declarações rejeitadas pelo MySQL Enterprise Firewall.

- `Firewall_access_granted`

  O número de declarações aceitas pelo MySQL Enterprise Firewall.

- `Firewall_access_suspicious`

  O número de declarações registradas pelo MySQL Enterprise Firewall como suspeitas para usuários que estão no modo `DETECTING`.

- `Firewall_cached_entries`

  O número de declarações registradas pelo MySQL Enterprise Firewall, incluindo duplicados.
