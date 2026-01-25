#### 6.4.5.7 Filtragem do Log de Auditoria

Nota

A partir do MySQL 5.7.13, para que a filtragem do Log de Auditoria (*Audit Log Filtering*) funcione conforme descrito aqui, o *plugin* de *audit log* *e as tabelas e funções de auditoria que o acompanham* devem ser instalados. Se o *plugin* for instalado sem as tabelas e funções de auditoria necessárias para a filtragem baseada em regras (*rule-based filtering*), ele operará no modo de filtragem legado (*legacy filtering mode*), descrito na [Seção 6.4.5.10, “Filtragem do Log de Auditoria em Modo Legado”](audit-log-legacy-filtering.html "6.4.5.10 Filtragem do Log de Auditoria em Modo Legado"). O modo legado é o comportamento de filtragem anterior ao MySQL 5.7.13; ou seja, antes da introdução da filtragem baseada em regras.

* [Propriedades da Filtragem do Log de Auditoria](audit-log-filtering.html#audit-log-filtering-properties "Propriedades da Filtragem do Log de Auditoria")
* [Restrições em Funções de Filtragem do Log de Auditoria](audit-log-filtering.html#audit-log-filtering-function-constraints "Restrições em Funções de Filtragem do Log de Auditoria")
* [Usando Funções de Filtragem do Log de Auditoria](audit-log-filtering.html#audit-log-filtering-function-usage "Usando Funções de Filtragem do Log de Auditoria")

##### Propriedades da Filtragem do Log de Auditoria

O *plugin* de *audit log* tem a capacidade de controlar o registro (*logging*) de eventos auditados através de sua filtragem:

* Eventos auditados podem ser filtrados usando estas características:
  + Conta de usuário (*User account*)
  + Classe de evento de auditoria (*Audit event class*)
  + Subclasse de evento de auditoria (*Audit event subclass*)
  + Campos de evento de auditoria (*Audit event fields*), como aqueles que indicam o *status* da operação ou a *SQL statement* executada.

* A filtragem de auditoria é baseada em regras (*rule based*):
  + Uma definição de *filter* cria um conjunto de regras de auditoria. As definições podem ser configuradas para incluir ou excluir eventos para *logging* com base nas características que acabamos de descrever.
  + A partir do MySQL 5.7.20, as regras de *filter* têm a capacidade de bloquear (*blocking* ou abortar) a execução de eventos qualificados, além das capacidades existentes para o *logging* de eventos.
  + Múltiplos *filters* podem ser definidos, e qualquer *filter* pode ser atribuído a qualquer número de contas de usuário.
  + É possível definir um *filter* padrão a ser usado com qualquer conta de usuário que não possua um *filter* explicitamente atribuído.
  + Para obter informações sobre como escrever regras de filtragem, consulte a [Seção 6.4.5.8, “Escrevendo Definições de Filter do Log de Auditoria”](audit-log-filter-definitions.html "6.4.5.8 Escrevendo Definições de Filter do Log de Auditoria").

* *Filters* do *audit log* podem ser definidos e modificados usando uma interface SQL baseada em chamadas de função. Por padrão, as definições de *filter* do *audit log* são armazenadas no *system Database* `mysql`, e você pode exibir os *audit filters* ao realizar uma *Query* na tabela `mysql.audit_log_filter`. É possível usar um *Database* diferente para essa finalidade, caso em que você deve consultar a tabela `database_name.audit_log_filter` em vez disso. Consulte a [Seção 6.4.5.2, “Instalando ou Desinstalando o MySQL Enterprise Audit”](audit-log-installation.html "6.4.5.2 Instalando ou Desinstalando o MySQL Enterprise Audit"), para obter mais informações.

* Dentro de uma determinada *session*, o valor da variável de sistema somente leitura [`audit_log_filter_id`](audit-log-reference.html#sysvar_audit_log_filter_id) indica se um *filter* está atribuído à *session*.

Nota

Por padrão, a filtragem do *audit log* baseada em regras não registra (*logs no*) eventos auditáveis para nenhum usuário. Para registrar todos os eventos auditáveis para todos os usuários, use as seguintes instruções, que criam um *filter* simples para habilitar o *logging* e o atribuem à conta padrão:

```sql
SELECT audit_log_filter_set_filter('log_all', '{ "filter": { "log": true } }');
SELECT audit_log_filter_set_user('%', 'log_all');
```

O *filter* atribuído a `%` é usado para *connections* de qualquer conta que não tenha um *filter* explicitamente atribuído (o que inicialmente é verdadeiro para todas as contas).

Conforme mencionado anteriormente, a interface SQL para controle de filtragem de auditoria é baseada em funções. A lista a seguir resume brevemente essas funções:

* [`audit_log_filter_set_filter()`](audit-log-reference.html#function_audit-log-filter-set-filter): Define um *filter*.

* [`audit_log_filter_remove_filter()`](audit-log-reference.html#function_audit-log-filter-remove-filter): Remove um *filter*.

* [`audit_log_filter_set_user()`](audit-log-reference.html#function_audit-log-filter-set-user): Inicia a filtragem de uma conta de usuário.

* [`audit_log_filter_remove_user()`](audit-log-reference.html#function_audit-log-filter-remove-user): Interrompe a filtragem de uma conta de usuário.

* [`audit_log_filter_flush()`](audit-log-reference.html#function_audit-log-filter-flush): Aplica (*Flush*) as alterações manuais nas tabelas de *filter* para afetar a filtragem em curso.

Para exemplos de uso e detalhes completos sobre as funções de filtragem, consulte [Usando Funções de Filtragem do Log de Auditoria](audit-log-filtering.html#audit-log-filtering-function-usage "Usando Funções de Filtragem do Log de Auditoria") e [Funções do Log de Auditoria](audit-log-reference.html#audit-log-routines "Funções do Log de Auditoria").

##### Restrições em Funções de Filtragem do Log de Auditoria

As funções de filtragem do *audit log* estão sujeitas a estas restrições:

* Para usar qualquer função de filtragem, o *plugin* `audit_log` deve estar habilitado, ou ocorrerá um *error*. Além disso, as tabelas de auditoria devem existir, ou ocorrerá um *error*. Para instalar o *plugin* `audit_log` e suas funções e tabelas acompanhantes, consulte a [Seção 6.4.5.2, “Instalando ou Desinstalando o MySQL Enterprise Audit”](audit-log-installation.html "6.4.5.2 Instalando ou Desinstalando o MySQL Enterprise Audit").

* Para usar qualquer função de filtragem, o usuário deve possuir o [`SUPER`](privileges-provided.html#priv_super) *Privilege*, ou ocorrerá um *error*. Para conceder o [`SUPER`](privileges-provided.html#priv_super) *Privilege* a uma conta de usuário, use esta *statement*:

  ```sql
  GRANT SUPER ON *.* TO user;
  ```

  Alternativamente, caso você prefira evitar a concessão do [`SUPER`](privileges-provided.html#priv_super) *Privilege*, mas ainda assim permitir que os usuários acessem funções de filtragem específicas, programas armazenados (*stored programs*) de "wrapper" podem ser definidos. Essa técnica é descrita no contexto de funções de *keyring* em [Usando Funções de Keyring de Propósito Geral](keyring-functions-general-purpose.html#keyring-function-usage "Usando Funções de Keyring de Propósito Geral"); ela pode ser adaptada para uso com funções de filtragem.

* O *plugin* `audit_log` opera em modo legado se estiver instalado, mas as tabelas e funções de auditoria que o acompanham não forem criadas. O *plugin* grava estas mensagens no *error log* na inicialização do *server*:

  ```sql
  [Warning] Plugin audit_log reported: 'Failed to open the audit log filter tables.'
  [Warning] Plugin audit_log reported: 'Audit Log plugin supports a filtering,
  which has not been installed yet. Audit Log plugin will run in the legacy
  mode, which will be disabled in the next release.'
  ```

  No modo legado, a filtragem pode ser feita apenas com base na conta ou *status* do evento. Para detalhes, consulte a [Seção 6.4.5.10, “Filtragem do Log de Auditoria em Modo Legado”](audit-log-legacy-filtering.html "6.4.5.10 Filtragem do Log de Auditoria em Modo Legado").

##### Usando Funções de Filtragem do Log de Auditoria

Antes de usar as funções de *audit log*, instale-as de acordo com as instruções fornecidas na [Seção 6.4.5.2, “Instalando ou Desinstalando o MySQL Enterprise Audit”](audit-log-installation.html "6.4.5.2 Instalando ou Desinstalando o MySQL Enterprise Audit"). O [`SUPER`](privileges-provided.html#priv_super) *Privilege* é exigido para usar qualquer uma dessas funções.

As funções de filtragem do *audit log* permitem o controle da filtragem ao fornecer uma interface para criar, modificar e remover definições de *filter* e atribuir *filters* a contas de usuário.

As definições de *filter* são valores [`JSON`](json.html "11.5 The JSON Data Type"). Para obter informações sobre o uso de dados [`JSON`](json.html "11.5 The JSON Data Type") no MySQL, consulte a [Seção 11.5, “O Tipo de Dados JSON”](json.html "11.5 O Tipo de Dados JSON"). Esta seção mostra algumas definições de *filter* simples. Para obter mais informações sobre definições de *filter*, consulte a [Seção 6.4.5.8, “Escrevendo Definições de Filter do Log de Auditoria”](audit-log-filter-definitions.html "6.4.5.8 Escrevendo Definições de Filter do Log de Auditoria").

Quando uma *connection* chega, o *plugin* de *audit log* determina qual *filter* usar para a nova *session*, procurando o nome da conta de usuário nas atribuições de *filter* atuais:

* Se um *filter* estiver atribuído ao usuário, o *audit log* usa esse *filter*.

* Caso contrário, se não existir uma atribuição de *filter* específica do usuário, mas houver um *filter* atribuído à conta padrão (`%`), o *audit log* usa o *filter* padrão.

* Caso contrário, o *audit log* não seleciona nenhum evento de auditoria da *session* para processamento.

Se uma operação de `change-user` ocorrer durante uma *session* (consulte [mysql_change_user()](/doc/c-api/5.7/en/mysql-change-user.html)), a atribuição de *filter* para a *session* é atualizada usando as mesmas regras, mas para o novo usuário.

Por padrão, nenhuma conta possui um *filter* atribuído, portanto, nenhum processamento de eventos auditáveis ocorre para qualquer conta.

Suponha que você queira alterar o padrão para registrar apenas a atividade relacionada à *connection* (por exemplo, para ver eventos de *connect*, `change-user` e *disconnect*, mas não as *SQL statements* que os usuários executam enquanto estão conectados). Para conseguir isso, defina um *filter* (mostrado aqui com o nome `log_conn_events`) que habilite o *logging* apenas de eventos na classe `connection` e atribua esse *filter* à conta padrão, representada pelo nome de conta `%`:

```sql
SET @f = '{ "filter": { "class": { "name": "connection" } } }';
SELECT audit_log_filter_set_filter('log_conn_events', @f);
SELECT audit_log_filter_set_user('%', 'log_conn_events');
```

Agora, o *audit log* usa este *filter* de conta padrão para *connections* de qualquer conta que não tenha um *filter* explicitamente definido.

Para atribuir um *filter* explicitamente a uma ou mais contas de usuário específicas, defina o *filter*, então atribua-o às contas relevantes:

```sql
SELECT audit_log_filter_set_filter('log_all', '{ "filter": { "log": true } }');
SELECT audit_log_filter_set_user('user1@localhost', 'log_all');
SELECT audit_log_filter_set_user('user2@localhost', 'log_all');
```

Agora, o *full logging* está habilitado para `user1@localhost` e `user2@localhost`. *Connections* de outras contas continuam a ser filtradas usando o *filter* de conta padrão.

Para desassociar uma conta de usuário de seu *filter* atual, desatribua o *filter* ou atribua um *filter* diferente:

* Para desatribuir o *filter* da conta de usuário:

  ```sql
  SELECT audit_log_filter_remove_user('user1@localhost');
  ```

  A filtragem das *current sessions* para a conta permanece inalterada. *Connections* subsequentes da conta são filtradas usando o *filter* de conta padrão, se houver um, e não são registradas caso contrário.

* Para atribuir um *filter* diferente à conta de usuário:

  ```sql
  SELECT audit_log_filter_set_filter('log_nothing', '{ "filter": { "log": false } }');
  SELECT audit_log_filter_set_user('user1@localhost', 'log_nothing');
  ```

  A filtragem das *current sessions* para a conta permanece inalterada. *Connections* subsequentes da conta são filtradas usando o novo *filter*. Para o *filter* mostrado aqui, isso significa que não há *logging* para novas *connections* de `user1@localhost`.

Para a filtragem do *audit log*, as comparações de nome de usuário e nome de *host* diferenciam maiúsculas de minúsculas (*case-sensitive*). Isso difere das comparações para verificação de *Privilege*, para as quais as comparações de nome de *host* não diferenciam maiúsculas de minúsculas.

Para remover um *filter*, faça o seguinte:

```sql
SELECT audit_log_filter_remove_filter('log_nothing');
```

A remoção de um *filter* também o desatribui de quaisquer usuários aos quais ele esteja atribuído, incluindo quaisquer *current sessions* para esses usuários.

As funções de filtragem que acabamos de descrever afetam a filtragem de auditoria imediatamente e atualizam as tabelas do *audit log* no *system Database* `mysql` que armazenam *filters* e contas de usuário (consulte [Tabelas do Log de Auditoria](audit-log-reference.html#audit-log-tables "Tabelas do Log de Auditoria")). Também é possível modificar as tabelas de *audit log* diretamente usando *statements* como [`INSERT`](insert.html "13.2.5 INSERT Statement"), [`UPDATE`](update.html "13.2.11 UPDATE Statement") e [`DELETE`](delete.html "13.2.2 DELETE Statement"), mas tais alterações não afetam a filtragem imediatamente. Para aplicar (*flush*) suas alterações e torná-las operacionais, chame [`audit_log_filter_flush()`](audit-log-reference.html#function_audit-log-filter-flush):

```sql
SELECT audit_log_filter_flush();
```

Aviso

[`audit_log_filter_flush()`](audit-log-reference.html#function_audit-log-filter-flush) deve ser usado apenas após modificar as tabelas de auditoria diretamente, para forçar o recarregamento de todos os *filters*. Caso contrário, esta função deve ser evitada. É, na verdade, uma versão simplificada de descarregar (*unloading*) e recarregar (*reloading*) o *plugin* `audit_log` com [`UNINSTALL PLUGIN`](uninstall-plugin.html "13.7.3.4 UNINSTALL PLUGIN Statement") mais [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement").

[`audit_log_filter_flush()`](audit-log-reference.html#function_audit-log-filter-flush) afeta todas as *current sessions* e as desvincula de seus *filters* anteriores. As *current sessions* não são mais registradas, a menos que se desconectem e reconectem, ou executem uma operação de `change-user`.

Para determinar se um *filter* está atribuído à *current session*, verifique o valor de *session* da variável de sistema somente leitura [`audit_log_filter_id`](audit-log-reference.html#sysvar_audit_log_filter_id). Se o valor for 0, nenhum *filter* está atribuído. Um valor diferente de zero indica o ID mantido internamente do *filter* atribuído:

```sql
mysql> SELECT @@audit_log_filter_id;
+-----------------------+
| @@audit_log_filter_id |
+-----------------------+
|                     2 |
+-----------------------+
```
