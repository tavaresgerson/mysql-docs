#### 6.4.5.10 Filtragem do Audit Log no Modo Legado

Nota:

Esta seção descreve a filtragem do audit log legado, que se aplica sob qualquer uma destas circunstâncias:

* Antes do MySQL 5.7.13, ou seja, antes da introdução da filtragem do audit log baseada em regras descrita na [Seção 6.4.5.7, “Audit Log Filtering”](audit-log-filtering.html "6.4.5.7 Filtragem do Audit Log").

* A partir do MySQL 5.7.13, se o plugin `audit_log` estiver instalado sem as tabelas de auditoria e funções necessárias para a filtragem baseada em regras.

O plugin audit log pode filtrar eventos auditados. Isso permite que você controle se os eventos auditados são gravados no arquivo de audit log com base na conta de origem dos eventos ou no status do evento. A filtragem por status ocorre separadamente para eventos de conexão e eventos de Statement.

* [Filtragem de Eventos Legados por Conta](audit-log-legacy-filtering.html#audit-log-account-filtering "Filtragem de Eventos Legados por Conta")
* [Filtragem de Eventos Legados por Status](audit-log-legacy-filtering.html#audit-log-status-filtering "Filtragem de Eventos Legados por Status")

##### Filtragem de Eventos Legados por Conta

Para filtrar eventos auditados com base na conta de origem, defina uma (não ambas) das seguintes variáveis de sistema na inicialização ou em runtime do servidor. Essas variáveis se aplicam apenas à filtragem de audit log legado.

* [`audit_log_include_accounts`](audit-log-reference.html#sysvar_audit_log_include_accounts): As contas a serem incluídas no audit logging. Se esta variável for definida, apenas estas contas são auditadas.

* [`audit_log_exclude_accounts`](audit-log-reference.html#sysvar_audit_log_exclude_accounts): As contas a serem excluídas do audit logging. Se esta variável for definida, todas as contas, exceto estas, são auditadas.

O valor para qualquer uma das variáveis pode ser `NULL` ou uma string contendo um ou mais nomes de conta separados por vírgula, cada um no formato `user_name@host_name`. Por padrão, ambas as variáveis são `NULL`, caso em que nenhuma filtragem de conta é realizada e a auditoria ocorre para todas as contas.

Modificações em [`audit_log_include_accounts`](audit-log-reference.html#sysvar_audit_log_include_accounts) ou [`audit_log_exclude_accounts`](audit-log-reference.html#sysvar_audit_log_exclude_accounts) afetam apenas as conexões criadas subsequentemente à modificação, e não as conexões existentes.

Exemplo: Para habilitar o audit logging apenas para as contas de host local `user1` e `user2`, defina a variável de sistema [`audit_log_include_accounts`](audit-log-reference.html#sysvar_audit_log_include_accounts) desta forma:

```sql
SET GLOBAL audit_log_include_accounts = 'user1@localhost,user2@localhost';
```

Apenas uma das variáveis [`audit_log_include_accounts`](audit-log-reference.html#sysvar_audit_log_include_accounts) ou [`audit_log_exclude_accounts`](audit-log-reference.html#sysvar_audit_log_exclude_accounts) pode ser diferente de `NULL` por vez:

* Se você definir [`audit_log_include_accounts`](audit-log-reference.html#sysvar_audit_log_include_accounts), o servidor define [`audit_log_exclude_accounts`](audit-log-reference.html#sysvar_audit_log_exclude_accounts) como `NULL`.

* Se você tentar definir [`audit_log_exclude_accounts`](audit-log-reference.html#sysvar_audit_log_exclude_accounts), ocorrerá um erro, a menos que [`audit_log_include_accounts`](audit-log-reference.html#sysvar_audit_log_include_accounts) seja `NULL`. Neste caso, você deve primeiro limpar [`audit_log_include_accounts`](audit-log-reference.html#sysvar_audit_log_include_accounts), definindo-a como `NULL`.

```sql
-- This sets audit_log_exclude_accounts to NULL
SET GLOBAL audit_log_include_accounts = value;

-- This fails because audit_log_include_accounts is not NULL
SET GLOBAL audit_log_exclude_accounts = value;

-- To set audit_log_exclude_accounts, first set
-- audit_log_include_accounts to NULL
SET GLOBAL audit_log_include_accounts = NULL;
SET GLOBAL audit_log_exclude_accounts = value;
```

Se você inspecionar o valor de qualquer uma das variáveis, esteja ciente de que [`SHOW VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement") exibe `NULL` como uma string vazia. Para exibir `NULL` como `NULL`, utilize [`SELECT`](select.html "13.2.9 SELECT Statement") em vez disso:

```sql
mysql> SHOW VARIABLES LIKE 'audit_log_include_accounts';
+----------------------------+-------+
| Variable_name              | Value |
+----------------------------+-------+
| audit_log_include_accounts |       |
+----------------------------+-------+
mysql> SELECT @@audit_log_include_accounts;
+------------------------------+
| @@audit_log_include_accounts |
+------------------------------+
| NULL                         |
+------------------------------+
```

Se um nome de usuário ou nome de host exigir aspas (quoting) por conter uma vírgula, espaço ou outro caractere especial, utilize aspas simples para citá-lo. Se o valor da variável em si for citado com aspas simples, duplique cada aspa simples interna ou escape-a com uma barra invertida (backslash). As seguintes Statements habilitam o audit logging para a conta `root` local e são equivalentes, embora os estilos de aspas difiram:

```sql
SET GLOBAL audit_log_include_accounts = 'root@localhost';
SET GLOBAL audit_log_include_accounts = '''root''@''localhost''';
SET GLOBAL audit_log_include_accounts = '\'root\'@\'localhost\'';
SET GLOBAL audit_log_include_accounts = "'root'@'localhost'";
```

A última Statement não funciona se o modo SQL `ANSI_QUOTES` estiver habilitado, pois, nesse modo, as aspas duplas (double quotes) significam aspas de identificador (identifier quoting), e não aspas de string (string quoting).

##### Filtragem de Eventos Legados por Status

Para filtrar eventos auditados com base no status, defina as seguintes variáveis de sistema na inicialização ou em runtime do servidor. Essas variáveis se aplicam apenas à filtragem de audit log legado. Para filtragem de audit log JSON, aplicam-se variáveis de status diferentes; consulte [Audit Log Options and Variables](audit-log-reference.html#audit-log-options-variables "Opções e Variáveis do Audit Log").

* [`audit_log_connection_policy`](audit-log-reference.html#sysvar_audit_log_connection_policy): Policy de logging para eventos de conexão

* [`audit_log_statement_policy`](audit-log-reference.html#sysvar_audit_log_statement_policy): Policy de logging para eventos de Statement

Cada variável aceita um valor de `ALL` (registra todos os eventos associados; este é o padrão), `ERRORS` (registra apenas eventos que falharam) ou `NONE` (não registra eventos). Por exemplo, para registrar todos os eventos de Statement, mas apenas eventos de conexão que falharam, utilize estas configurações:

```sql
SET GLOBAL audit_log_statement_policy = ALL;
SET GLOBAL audit_log_connection_policy = ERRORS;
```

Outra variável de sistema Policy, [`audit_log_policy`](audit-log-reference.html#sysvar_audit_log_policy), está disponível, mas não oferece tanto controle quanto [`audit_log_connection_policy`](audit-log-reference.html#sysvar_audit_log_connection_policy) e [`audit_log_statement_policy`](audit-log-reference.html#sysvar_audit_log_statement_policy). Ela pode ser definida apenas na inicialização do servidor. Em runtime, é uma variável somente leitura. Ela aceita um valor de `ALL` (registra todos os eventos; este é o padrão), `LOGINS` (registra eventos de conexão), `QUERIES` (registra eventos de Statement) ou `NONE` (não registra eventos). Para qualquer um desses valores, o plugin audit log registra todos os eventos selecionados sem distinção de sucesso ou falha. O uso de [`audit_log_policy`](audit-log-reference.html#sysvar_audit_log_policy) na inicialização funciona da seguinte forma:

* Se você não definir [`audit_log_policy`](audit-log-reference.html#sysvar_audit_log_policy) ou defini-la como seu padrão de `ALL`, quaisquer configurações explícitas para [`audit_log_connection_policy`](audit-log-reference.html#sysvar_audit_log_connection_policy) ou [`audit_log_statement_policy`](audit-log-reference.html#sysvar_audit_log_statement_policy) são aplicadas conforme especificadas. Se não forem especificadas, o padrão delas é `ALL`.

* Se você definir [`audit_log_policy`](audit-log-reference.html#sysvar_audit_log_policy) para um valor diferente de `ALL`, esse valor terá precedência e será usado para definir [`audit_log_connection_policy`](audit-log-reference.html#sysvar_audit_log_connection_policy) e [`audit_log_statement_policy`](audit-log-reference.html#sysvar_audit_log_statement_policy), conforme indicado na tabela a seguir. Se você também definir qualquer uma dessas variáveis para um valor diferente do padrão `ALL`, o servidor escreverá uma mensagem no error log para indicar que seus valores estão sendo sobrescritos.

  <table summary="Como o servidor usa audit_log_policy para definir audit_log_connection_policy e audit_log_statement_policy na inicialização."><col style="width: 33%"/><col style="width: 33%"/><col style="width: 33%"/><thead><tr> <th>Valor audit_log_policy na Inicialização</th> <th>Valor Resultante audit_log_connection_policy</th> <th>Valor Resultante audit_log_statement_policy</th> </tr></thead><tbody><tr> <th><code>LOGINS</code></th> <td><code>ALL</code></td> <td><code>NONE</code></td> </tr><tr> <th><code>QUERIES</code></th> <td><code>NONE</code></td> <td><code>ALL</code></td> </tr><tr> <th><code>NONE</code></th> <td><code>NONE</code></td> <td><code>NONE</code></td> </tr> </tbody></table>
