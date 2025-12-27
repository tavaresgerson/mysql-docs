#### 8.4.6.10 Filtragem do Log de Auditoria no Modo Legado

Nota

Esta seção descreve a filtragem do log de auditoria no modo legado, que se aplica se o plugin `audit_log` for instalado sem as tabelas e funções de auditoria associadas necessárias para a filtragem baseada em regras.

A filtragem do log de auditoria no modo legado está desatualizada.

O plugin de log de auditoria pode filtrar eventos auditados. Isso permite que você controle se os eventos auditados são escritos no arquivo de log de auditoria com base na conta de onde os eventos se originam ou no status do evento. A filtragem de status ocorre separadamente para eventos de conexão e eventos de declaração.

* Filtragem de Eventos Legados por Conta
* Filtragem de Eventos Legados por Status

##### Filtragem de Eventos Legados por Conta

Para filtrar eventos auditados com base na conta de origem, defina uma (e não ambas) das seguintes variáveis de sistema no início ou durante o runtime do servidor. Essas variáveis desatualizadas aplicam-se apenas para a filtragem de log de auditoria legado.

* `audit_log_include_accounts`: As contas a serem incluídas no registro de auditoria. Se essa variável for definida, apenas essas contas são auditadas.

* `audit_log_exclude_accounts`: As contas a serem excluídas do registro de auditoria. Se essa variável for definida, todas as contas, exceto essas, são auditadas.

O valor para qualquer uma das variáveis pode ser `NULL` ou uma string contendo um ou mais nomes de contas separados por vírgula, cada um no formato `user_name@host_name`. Por padrão, ambas as variáveis são `NULL`, caso em que não há filtragem de conta e a auditoria ocorre para todas as contas.

As modificações em `audit_log_include_accounts` ou `audit_log_exclude_accounts` afetam apenas as conexões criadas após a modificação, não as conexões existentes.

Exemplo: Para habilitar o registro de auditoria apenas para as contas de host local `user1` e `user2`, defina a variável de sistema `audit_log_include_accounts` da seguinte forma:

```
SET GLOBAL audit_log_include_accounts = 'user1@localhost,user2@localhost';
```

Apenas uma das variáveis `audit_log_include_accounts` ou `audit_log_exclude_accounts` pode ser diferente de `NULL` de cada vez:

* Se você definir `audit_log_include_accounts`, o servidor define `audit_log_exclude_accounts` como `NULL`.
* Se você tentar definir `audit_log_exclude_accounts`, ocorrerá um erro, a menos que `audit_log_include_accounts` seja `NULL`. Nesse caso, você deve primeiro limpar `audit_log_include_accounts` definindo-a como `NULL`.

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

Se você inspecionar o valor de qualquer uma das variáveis, esteja ciente de que `SHOW VARIABLES` exibe `NULL` como uma string vazia. Para exibir `NULL` como `NULL`, use `SELECT`:

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

Se um nome de usuário ou nome de host requer citação porque contém uma vírgula, um espaço ou outro caractere especial, cite-o usando aspas simples. Se o próprio valor da variável for citado com aspas simples, duplique as aspas simples internas ou escape-as com uma barra invertida. As seguintes declarações habilitam o registro de auditoria para a conta local `root` e são equivalentes, embora os estilos de citação sejam diferentes:

```
SET GLOBAL audit_log_include_accounts = 'root@localhost';
SET GLOBAL audit_log_include_accounts = '''root''@''localhost''';
SET GLOBAL audit_log_include_accounts = '\'root\'@\'localhost\'';
SET GLOBAL audit_log_include_accounts = "'root'@'localhost'";
```

A última declaração não funciona se o modo SQL `ANSI_QUOTES` estiver habilitado, porque, nesse modo, as aspas duplas significam citação de identificadores, não citação de strings.

##### Filtro de Eventos Legados por Status

Para filtrar eventos auditados com base no status, defina as seguintes variáveis de sistema no início ou durante o runtime do servidor. Essas variáveis desatualizadas aplicam-se apenas ao filtro de log de auditoria legítimo. Para o filtro de log de auditoria JSON, variáveis de status diferentes se aplicam; consulte Opções e Variáveis do Log de Auditoria.

* `audit_log_connection_policy`: Política de registro de eventos de conexão

* `audit_log_statement_policy`: Política de registro de eventos de declaração

Cada variável recebe um valor de `ALL` (registrar todos os eventos associados; este é o valor padrão), `ERROS` (registrar apenas eventos falhos) ou `NÃO` (não registrar eventos). Por exemplo, para registrar todos os eventos de declaração, mas apenas eventos de conexão falhos, use essas configurações:

```
SET GLOBAL audit_log_statement_policy = ALL;
SET GLOBAL audit_log_connection_policy = ERRORS;
```

Outra variável do sistema de políticas, `audit_log_policy`, está disponível, mas não oferece tanto controle quanto `audit_log_connection_policy` e `audit_log_statement_policy`. Ela pode ser definida apenas no início do servidor.

Observação

A variável de sistema `audit_log_policy` no modo legado está desatualizada.

Em tempo de execução, é uma variável de leitura somente. Ela recebe um valor de `ALL` (registrar todos os eventos; este é o valor padrão), `LOGINS` (registrar eventos de conexão), `QUERIES` (registrar eventos de declaração) ou `NÃO` (não registrar eventos). Para qualquer um desses valores, o plugin de log de auditoria registra todos os eventos selecionados sem distinção de sucesso ou falha. O uso de `audit_log_policy` no início funciona da seguinte forma:

* Se você não definir `audit_log_policy` ou definir como o valor padrão de `ALL`, quaisquer configurações explícitas para `audit_log_connection_policy` ou `audit_log_statement_policy` se aplicam conforme especificado. Se não especificadas, elas têm o valor padrão de `ALL`.

* Se você definir `audit_log_policy` para um valor que não seja `ALL`, esse valor tem precedência e é usado para definir `audit_log_connection_policy` e `audit_log_statement_policy`, conforme indicado na tabela a seguir. Se você também definir uma dessas variáveis para um valor diferente do seu valor padrão de `ALL`, o servidor escreve uma mensagem no log de erro para indicar que seus valores estão sendo substituídos.

<table summary="Como o servidor usa a política audit_log_policy para definir as políticas audit_log_connection_policy e audit_log_statement_policy ao iniciar."><col style="width: 33%"/><col style="width: 33%"/><col style="width: 33%"/><thead><tr> <th scope="col">Valor da política audit_log_policy ao iniciar</th> <th scope="col">Valor da política audit_log_connection_policy resultante</th> <th scope="col">Valor da política audit_log_statement_policy resultante</th> </tr></thead><tbody><tr> <th scope="row"><code class="literal">LOGINS</code></th> <td><code class="literal">ALL</code></td> <td><code class="literal">NONE</code></td> </tr><tr> <th scope="row"><code class="literal">QUERIES</code></th> <td><code class="literal">NONE</code></td> <td><code class="literal">ALL</code></td> </tr><tr> <th scope="row"><code class="literal">NONE</code></th> <td><code class="literal">NONE</code></td> <td><code class="literal">NONE</code></td> </tr></tbody></table>