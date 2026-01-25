#### 6.4.6.4 Referência do MySQL Enterprise Firewall

As seções a seguir fornecem uma referência aos elementos do MySQL Enterprise Firewall:

* [Tabelas do MySQL Enterprise Firewall](firewall-reference.html#firewall-tables "MySQL Enterprise Firewall Tables")
* [Stored Procedures do MySQL Enterprise Firewall](firewall-reference.html#firewall-stored-routines "MySQL Enterprise Firewall Stored Procedures")
* [Funções Administrativas do MySQL Enterprise Firewall](firewall-reference.html#firewall-functions "MySQL Enterprise Firewall Administrative Functions")
* [System Variables do MySQL Enterprise Firewall](firewall-reference.html#firewall-system-variables "MySQL Enterprise Firewall System Variables")
* [Status Variables do MySQL Enterprise Firewall](firewall-reference.html#firewall-status-variables "MySQL Enterprise Firewall Status Variables")

##### Tabelas do MySQL Enterprise Firewall

O MySQL Enterprise Firewall mantém informações de Profile por grupo e por conta, utilizando tabelas no Database do Firewall para armazenamento persistente e tabelas do Information Schema para fornecer views para dados armazenados em Cache na memória. Quando habilitado, o Firewall baseia as decisões operacionais nos dados em Cache. O Database do Firewall pode ser o system Database `mysql` ou um schema personalizado (consulte [Instalando o MySQL Enterprise Firewall](firewall-installation.html#firewall-install "Instalando o MySQL Enterprise Firewall")).

As tabelas no Database do Firewall são abordadas nesta seção. Para obter informações sobre as tabelas do Information Schema do MySQL Enterprise Firewall, consulte [Seção 24.7, “Tabelas INFORMATION_SCHEMA do MySQL Enterprise Firewall”](firewall-information-schema-tables.html "24.7 Tabelas INFORMATION_SCHEMA do MySQL Enterprise Firewall”).

Cada tabela do system Database `mysql` é acessível apenas por contas que possuem o privilege [`SELECT`](privileges-provided.html#priv_select) para ela. As tabelas `INFORMATION_SCHEMA` são acessíveis por qualquer pessoa.

A tabela `mysql.firewall_users` lista nomes e operational Modes de Profiles de contas de Firewall registrados. A tabela possui as seguintes colunas (sendo que a tabela correspondente no Information Schema [`MYSQL_FIREWALL_USERS`](information-schema-mysql-firewall-users-table.html "24.7.2 The INFORMATION_SCHEMA MYSQL_FIREWALL_USERS Table") possui colunas semelhantes, mas não necessariamente idênticas):

* `USERHOST`

  O nome do Profile da conta. Cada nome de conta tem o formato `user_name@host_name`.

* `MODE`

  O operational Mode atual para o Profile. Os valores de Mode permitidos são `OFF`, `DETECTING`, `PROTECTING`, `RECORDING` e `RESET`. Para obter detalhes sobre seus significados, consulte [Conceitos do Firewall](firewall-usage.html#firewall-concepts "Firewall Concepts").

A tabela `mysql.firewall_whitelist` lista as regras de allowlist de Profiles de contas de Firewall registrados. A tabela possui as seguintes colunas (sendo que a tabela correspondente no Information Schema [`MYSQL_FIREWALL_WHITELIST`](information-schema-mysql-firewall-whitelist-table.html "24.7.3 The INFORMATION_SCHEMA MYSQL_FIREWALL_WHITELIST Table") possui colunas semelhantes, mas não necessariamente idênticas):

* `USERHOST`

  O nome do Profile da conta. Cada nome de conta tem o formato `user_name@host_name`.

* `RULE`

  Um statement normalizado que indica um padrão de statement aceitável para o Profile. Uma allowlist de Profile é a união de suas regras.

* `ID`

  Uma coluna integer que é a Primary Key para a tabela. Esta coluna foi adicionada no MySQL 5.7.23.

##### Stored Procedures do MySQL Enterprise Firewall

Os Stored Procedures do MySQL Enterprise Firewall executam tarefas como registrar Profiles no Firewall, estabelecer seu operational Mode e gerenciar a transferência de dados do Firewall entre o Cache e o armazenamento persistente. Esses Procedures invocam funções administrativas que fornecem uma API para tarefas de nível inferior.

Os Stored Procedures do Firewall são criados no system Database `mysql`. Para invocar um Stored Procedure do Firewall, faça-o enquanto `mysql` for o Database padrão, ou qualifique o nome do Procedure com o nome do Database. Por exemplo:

```sql
CALL mysql.sp_set_firewall_mode(user, mode);
```

A lista a seguir descreve cada Stored Procedure do Firewall:

* `sp_reload_firewall_rules(user)`

  Este Stored Procedure fornece controle sobre a operação do Firewall para Profiles de contas individuais. O Procedure usa funções administrativas do Firewall para recarregar as regras em memória para um Profile de conta a partir das regras armazenadas na tabela `mysql.firewall_whitelist`.

  Argumentos:

  + *`user`*: O nome do Profile de conta afetado, como uma string no formato `user_name@host_name`.

  Exemplo:

  ```sql
  CALL mysql.sp_reload_firewall_rules('fwuser@localhost');
  ```

  Aviso

  Este Procedure limpa as regras de allowlist em memória do Profile da conta antes de recarregá-las do armazenamento persistente e define o Mode do Profile para `OFF`. Se o Mode do Profile não era `OFF` antes da chamada `sp_reload_firewall_rules()`, use `sp_set_firewall_mode()` para restaurar seu Mode anterior após recarregar as regras. Por exemplo, se o Profile estava no Mode `PROTECTING`, isso não será mais verdade após chamar `sp_reload_firewall_rules()`, e você deve configurá-lo para `PROTECTING` novamente explicitamente.

* `sp_set_firewall_mode(user, mode)`

  Este Stored Procedure estabelece o operational Mode para um Profile de conta de Firewall, após registrar o Profile no Firewall, caso ainda não estivesse registrado. O Procedure também invoca funções administrativas do Firewall, conforme necessário, para transferir dados do Firewall entre o Cache e o armazenamento persistente. Este Procedure pode ser chamado mesmo que a System Variable `mysql_firewall_mode` esteja `OFF`, embora a definição do Mode para um Profile não tenha efeito operacional até que o Firewall seja habilitado.

  Argumentos:

  + *`user`*: O nome do Profile de conta afetado, como uma string no formato `user_name@host_name`.

  + *`mode`*: O operational Mode para o Profile, como uma string. Os valores de Mode permitidos são `OFF`, `DETECTING`, `PROTECTING`, `RECORDING` e `RESET`. Para obter detalhes sobre seus significados, consulte [Conceitos do Firewall](firewall-usage.html#firewall-concepts "Firewall Concepts").

  Mudar um Profile de conta para qualquer Mode, exceto `RECORDING`, sincroniza seus dados de Cache do Firewall com as tabelas do system Database `mysql` que fornecem o armazenamento subjacente persistente. Mudar o Mode de `OFF` para `RECORDING` recarrega a allowlist da tabela `mysql.firewall_whitelist` para o Cache.

  Se um Profile de conta tiver uma allowlist vazia, seu Mode não pode ser definido como `PROTECTING`, pois o Profile rejeitaria todo Statement, efetivamente proibindo a conta de executar Statements. Em resposta a tal tentativa de definição de Mode, o Firewall produz uma mensagem de diagnóstico que é retornada como um result set em vez de um SQL error:

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

##### Funções Administrativas do MySQL Enterprise Firewall

As funções administrativas do MySQL Enterprise Firewall fornecem uma API para tarefas de nível inferior, como sincronizar o Cache do Firewall com as tabelas do sistema subjacentes.

*Em operação normal, essas funções são invocadas pelos Stored Procedures do Firewall, e não diretamente pelos usuários.* Por esse motivo, as descrições dessas funções não incluem detalhes como informações sobre seus argumentos e tipos de retorno.

* [Funções de Profile de Conta do Firewall](firewall-reference.html#firewall-functions-account "Firewall Account Profile Functions")
* [Funções Diversas do Firewall](firewall-reference.html#firewall-functions-miscellaneous "Firewall Miscellaneous Functions")

###### Funções de Profile de Conta do Firewall

Estas funções executam operações de gerenciamento em Profiles de conta do Firewall:

* [`read_firewall_users(user, mode)`](firewall-reference.html#function_read-firewall-users)

  Esta função agregada atualiza o Cache do Profile de conta do Firewall através de um statement `SELECT` na tabela `mysql.firewall_users`. Requer o privilege [`SUPER`](privileges-provided.html#priv_super).

  Exemplo:

  ```sql
  SELECT read_firewall_users('fwuser@localhost', 'RECORDING')
  FROM mysql.firewall_users;
  ```

* [`read_firewall_whitelist(user, rule)`](firewall-reference.html#function_read-firewall-whitelist)

  Esta função agregada atualiza o Cache de statements registrados para o Profile de conta nomeado através de um statement `SELECT` na tabela `mysql.firewall_whitelist`. Requer o privilege [`SUPER`](privileges-provided.html#priv_super).

  Exemplo:

  ```sql
  SELECT read_firewall_whitelist('fwuser@localhost', fw.rule)
  FROM mysql.firewall_whitelist AS fw
  WHERE USERHOST = 'fwuser@localhost';
  ```

* [`set_firewall_mode(user, mode)`](firewall-reference.html#function_set-firewall-mode)

  Esta função gerencia o Cache do Profile da conta e estabelece o operational Mode do Profile. Requer o privilege [`SUPER`](privileges-provided.html#priv_super).

  Exemplo:

  ```sql
  SELECT set_firewall_mode('fwuser@localhost', 'RECORDING');
  ```

###### Funções Diversas do Firewall

Estas funções executam operações diversas do Firewall:

* [`mysql_firewall_flush_status()`](firewall-reference.html#function_mysql-firewall-flush-status)

  Esta função redefine diversas Status Variables do Firewall para 0:

  + [`Firewall_access_denied`](firewall-reference.html#statvar_Firewall_access_denied)
  + [`Firewall_access_granted`](firewall-reference.html#statvar_Firewall_access_granted)
  + [`Firewall_access_suspicious`](firewall-reference.html#statvar_Firewall_access_suspicious)

  Esta função requer o privilege [`SUPER`](privileges-provided.html#priv_super).

  Exemplo:

  ```sql
  SELECT mysql_firewall_flush_status();
  ```

* [`normalize_statement(stmt)`](firewall-reference.html#function_normalize-statement)

  Esta função normaliza um statement SQL para a forma de digest usada para regras de allowlist. Requer o privilege [`SUPER`](privileges-provided.html#priv_super).

  Exemplo:

  ```sql
  SELECT normalize_statement('SELECT * FROM t1 WHERE c1 > 2');
  ```

##### System Variables do MySQL Enterprise Firewall

O MySQL Enterprise Firewall suporta as seguintes System Variables. Use-as para configurar a operação do Firewall. Essas variáveis não estão disponíveis a menos que o Firewall esteja instalado (consulte [Seção 6.4.6.2, “Instalando ou Desinstalando o MySQL Enterprise Firewall”](firewall-installation.html "6.4.6.2 Installing or Uninstalling MySQL Enterprise Firewall")).

* [`mysql_firewall_mode`](firewall-reference.html#sysvar_mysql_firewall_mode)

  <table frame="box" rules="all" summary="Propriedades para mysql_firewall_mode"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--mysql-firewall-mode[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>mysql_firewall_mode</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Indica se o MySQL Enterprise Firewall está habilitado (o padrão) ou desabilitado.

* [`mysql_firewall_trace`](firewall-reference.html#sysvar_mysql_firewall_trace)

  <table frame="box" rules="all" summary="Propriedades para mysql_firewall_trace"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--mysql-firewall-trace[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>mysql_firewall_trace</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Indica se o trace do MySQL Enterprise Firewall está habilitado ou desabilitado (o padrão). Quando [`mysql_firewall_trace`](firewall-reference.html#sysvar_mysql_firewall_trace) está habilitado, para o Mode `PROTECTING`, o Firewall escreve os statements rejeitados no log de erros.

##### Status Variables do MySQL Enterprise Firewall

O MySQL Enterprise Firewall suporta as seguintes Status Variables. Use-as para obter informações sobre o Status operacional do Firewall. Essas variáveis não estão disponíveis a menos que o Firewall esteja instalado (consulte [Seção 6.4.6.2, “Instalando ou Desinstalando o MySQL Enterprise Firewall”](firewall-installation.html "6.4.6.2 Installing or Uninstalling MySQL Enterprise Firewall")). As Status Variables do Firewall são definidas como 0 sempre que o plugin `MYSQL_FIREWALL` é instalado ou o servidor é iniciado. Muitas delas são redefinidas para zero pela função [`mysql_firewall_flush_status()`](firewall-reference.html#function_mysql-firewall-flush-status) (consulte [Funções Administrativas do MySQL Enterprise Firewall](firewall-reference.html#firewall-functions "MySQL Enterprise Firewall Administrative Functions")).

* [`Firewall_access_denied`](firewall-reference.html#statvar_Firewall_access_denied)

  O número de statements rejeitados pelo MySQL Enterprise Firewall.

* [`Firewall_access_granted`](firewall-reference.html#statvar_Firewall_access_granted)

  O número de statements aceitos pelo MySQL Enterprise Firewall.

* [`Firewall_access_suspicious`](firewall-reference.html#statvar_Firewall_access_suspicious)

  O número de statements registrados pelo MySQL Enterprise Firewall como suspeitos para usuários que estão no Mode `DETECTING`.

* [`Firewall_cached_entries`](firewall-reference.html#statvar_Firewall_cached_entries)

  O número de statements registrados pelo MySQL Enterprise Firewall, incluindo duplicatas.