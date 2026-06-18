#### 8.4.5.10 Filtro do Log de Auditoria no Modo Legado

Nota

Esta seção descreve a filtragem do log de auditoria de legado, que se aplica se o plugin `audit_log` for instalado sem as tabelas e funções de auditoria necessárias para a filtragem baseada em regras.

O filtro do log de auditoria no modo legado foi descontinuado a partir do MySQL 8.0.34.

O plugin de registro de auditoria pode filtrar eventos auditados. Isso permite que você controle se os eventos auditados são escritos no arquivo de registro de auditoria com base na conta de onde os eventos se originam ou no status do evento. O filtro de status ocorre separadamente para eventos de conexão e eventos de declaração.

- Filtrar eventos de legado por conta
- Filtrar eventos de legado por status

##### Filtrar eventos de legado por conta

Para filtrar eventos auditados com base na conta de origem, defina uma (e não ambas) das seguintes variáveis de sistema no início ou durante o funcionamento do servidor. Essas variáveis desatualizadas são aplicáveis apenas para a filtragem de log de auditoria de versões antigas.

- `audit_log_include_accounts`: As contas a serem incluídas no registro de auditoria. Se essa variável for definida, apenas essas contas serão auditadas.

- `audit_log_exclude_accounts`: As contas a serem excluídas do registro de auditoria. Se essa variável for definida, todas as contas, exceto essas, serão auditadas.

O valor para qualquer uma das variáveis pode ser `NULL` ou uma string contendo um ou mais nomes de contas separados por vírgula, cada um no formato `user_name@host_name`. Por padrão, ambas as variáveis são `NULL`, nesse caso, não há filtragem de contas e a auditoria ocorre para todas as contas.

As modificações em `audit_log_include_accounts` ou `audit_log_exclude_accounts` afetam apenas as conexões criadas após a modificação, e não as conexões existentes.

Exemplo: Para habilitar o registro de auditoria apenas para as contas de host local `user1` e `user2`, defina a variável de sistema `audit_log_include_accounts` da seguinte maneira:

```
SET GLOBAL audit_log_include_accounts = 'user1@localhost,user2@localhost';
```

Apenas um dos `audit_log_include_accounts` ou `audit_log_exclude_accounts` pode não ser `NULL` de cada vez:

- Se você definir `audit_log_include_accounts`, o servidor define `audit_log_exclude_accounts` para `NULL`.

- Se você tentar definir `audit_log_exclude_accounts`, ocorrerá um erro, a menos que `audit_log_include_accounts` seja `NULL`. Nesse caso, você deve primeiro limpar `audit_log_include_accounts`, definindo-o como `NULL`.

```
-- This sets audit_log_exclude_accounts to NULL
SET GLOBAL audit_log_include_accounts = value;

-- This fails because audit_log_include_accounts is not NULL
SET GLOBAL audit_log_exclude_accounts = value;

-- To set audit_log_exclude_accounts, first set
-- audit_log_include_accounts to NULL
SET GLOBAL audit_log_include_accounts = NULL;
SET GLOBAL audit_log_exclude_accounts = value;
```

Se você verificar o valor de qualquer uma das variáveis, esteja ciente de que `SHOW VARIABLES` exibe `NULL` como uma string vazia. Para exibir `NULL` como `NULL`, use `SELECT` em vez disso:

```
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

Se o nome de usuário ou o nome do host exigir aspas porque contém uma vírgula, espaço ou outro caractere especial, use aspas simples. Se o próprio valor da variável for citado com aspas simples, duplique cada aspa simples interna ou escape-a com uma barra invertida. As seguintes declarações habilitam o registro de auditoria para a conta local `root` e são equivalentes, embora os estilos de citação sejam diferentes:

```
SET GLOBAL audit_log_include_accounts = 'root@localhost';
SET GLOBAL audit_log_include_accounts = '''root''@''localhost''';
SET GLOBAL audit_log_include_accounts = '\'root\'@\'localhost\'';
SET GLOBAL audit_log_include_accounts = "'root'@'localhost'";
```

A última afirmação não funciona se o modo SQL `ANSI_QUOTES` estiver habilitado, pois, nesse modo, as aspas duplas significam a citação de identificadores, e não a citação de strings.

##### Filtrar eventos de legado por status

Para filtrar eventos auditados com base no status, defina as seguintes variáveis de sistema no início ou durante o funcionamento do servidor. Essas variáveis desatualizadas se aplicam apenas ao filtro de log de auditoria de legado. Para o filtro de log de auditoria JSON, variáveis de status diferentes se aplicam; consulte Opções e variáveis do log de auditoria.

- `audit_log_connection_policy`: Política de registro para eventos de conexão

- `audit_log_statement_policy`: Política de registro para eventos de declaração

Cada variável aceita um valor de `ALL` (registrar todos os eventos associados; este é o padrão), `ERRORS` (registrar apenas eventos falhos) ou `NONE` (não registrar eventos). Por exemplo, para registrar todos os eventos de declaração, mas apenas eventos de conexão falhos, use essas configurações:

```
SET GLOBAL audit_log_statement_policy = ALL;
SET GLOBAL audit_log_connection_policy = ERRORS;
```

Outra variável do sistema de políticas, `audit_log_policy`, está disponível, mas não oferece tanto controle quanto `audit_log_connection_policy` e `audit_log_statement_policy`. Ela só pode ser definida na inicialização do servidor.

Nota

A variável de sistema `audit_log_policy` no modo legado é desaconselhada a partir do MySQL 8.0.34.

Em tempo de execução, é uma variável de leitura somente. Ela recebe um valor de `ALL` (registrar todos os eventos; este é o padrão), `LOGINS` (registrar eventos de conexão), `QUERIES` (registrar eventos de declaração) ou `NONE` (não registrar eventos). Para qualquer um desses valores, o plugin de log de auditoria registra todos os eventos selecionados sem distinção entre sucesso ou falha. O uso de `audit_log_policy` ao iniciar funciona da seguinte forma:

- Se você não definir `audit_log_policy` ou definir-lo para o valor padrão `ALL`, quaisquer configurações explícitas para `audit_log_connection_policy` ou `audit_log_statement_policy` serão aplicadas conforme especificado. Se não forem especificadas, elas terão o valor padrão `ALL`.

- Se você definir `audit_log_policy` para um valor que não seja `ALL`, esse valor terá precedência e será usado para definir `audit_log_connection_policy` e `audit_log_statement_policy`, conforme indicado na tabela a seguir. Se você também definir qualquer uma dessas variáveis para um valor diferente do padrão `ALL`, o servidor escreverá uma mensagem no log de erro para indicar que seus valores estão sendo substituídos.

  <table summary="Como o servidor usa a política de log_audit para definir a política de log_audit_connection e a política de log_audit_statement ao iniciar."><thead><tr> <th scope="col">Política de registro de auditoria de startup_log_policy Valor</th> <th scope="col">Valor de audit_log_connection_policy (política de conexão do log de auditoria)</th> <th scope="col">Política de registro de auditoria _log_statement_value</th> </tr></thead><tbody><tr> <th>[[<code>LOGINS</code>]]</th> <td>[[<code>ALL</code>]]</td> <td>[[<code>NONE</code>]]</td> </tr><tr> <th>[[<code>QUERIES</code>]]</th> <td>[[<code>NONE</code>]]</td> <td>[[<code>ALL</code>]]</td> </tr><tr> <th>[[<code>NONE</code>]]</th> <td>[[<code>NONE</code>]]</td> <td>[[<code>NONE</code>]]</td> </tr></tbody></table>
