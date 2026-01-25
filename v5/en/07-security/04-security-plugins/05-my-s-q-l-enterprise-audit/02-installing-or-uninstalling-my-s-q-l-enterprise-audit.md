#### 6.4.5.2 Instalando ou Desinstalando o MySQL Enterprise Audit

Esta seção descreve como instalar ou desinstalar o MySQL Enterprise Audit, que é implementado usando o audit log plugin e elementos relacionados descritos na [Seção 6.4.5.1, “Elementos do MySQL Enterprise Audit”](audit-log-elements.html "6.4.5.1 Elementos do MySQL Enterprise Audit"). Para informações gerais sobre a instalação de Plugins, consulte a [Seção 5.5.1, “Instalando e Desinstalando Plugins”](plugin-loading.html "5.5.1 Instalando e Desinstalando Plugins").

Importante

Leia esta seção na íntegra antes de seguir suas instruções. Partes do procedimento diferem dependendo do seu ambiente.

Nota

Se instalado, o `audit_log` plugin envolve alguma sobrecarga (overhead) mínima, mesmo quando desabilitado. Para evitar essa sobrecarga, não instale o MySQL Enterprise Audit a menos que você planeje usá-lo.

Para ser utilizável pelo Server, o arquivo da biblioteca do Plugin deve estar localizado no diretório de Plugin do MySQL (o diretório nomeado pela variável de sistema [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir)). Se necessário, configure a localização do diretório do Plugin definindo o valor de [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir) na inicialização do Server.

Nota

As instruções aqui se aplicam ao MySQL 5.7.13 e versões posteriores.

Além disso, antes do MySQL 5.7.13, o MySQL Enterprise Audit consistia apenas no `audit_log` plugin e não incluía nenhum dos outros elementos descritos na [Seção 6.4.5.1, “Elementos do MySQL Enterprise Audit”](audit-log-elements.html "6.4.5.1 Elementos do MySQL Enterprise Audit"). A partir do MySQL 5.7.13, se o `audit_log` plugin já estiver instalado a partir de uma versão anterior ao MySQL 5.7.13, desinstale-o usando a seguinte instrução e reinicie o Server antes de instalar a versão atual:

```sql
UNINSTALL PLUGIN audit_log;
```

Para instalar o MySQL Enterprise Audit, procure no diretório `share` da sua instalação MySQL e escolha o script apropriado para sua plataforma. Os scripts disponíveis diferem no sufixo usado para se referir ao arquivo da biblioteca do Plugin:

* `audit_log_filter_win_install.sql`: Escolha este script para sistemas Windows que usam `.dll` como sufixo do nome do arquivo.

* `audit_log_filter_linux_install.sql`: Escolha este script para Linux e sistemas semelhantes que usam `.so` como sufixo do nome do arquivo.

Execute o script da seguinte forma. O exemplo aqui usa o script de instalação para Linux. Faça a substituição apropriada para o seu sistema.

```sql
$> mysql -u root -p < audit_log_filter_linux_install.sql
Enter password: (enter root password here)
```

Nota

Algumas versões do MySQL introduziram alterações na estrutura das tabelas do MySQL Enterprise Audit. Para garantir que suas tabelas estejam atualizadas para Upgrades de versões anteriores do MySQL 5.7, execute [**mysql_upgrade --force**](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables") (o que também executa quaisquer outras atualizações necessárias). Se você preferir executar as instruções de atualização apenas para as tabelas do MySQL Enterprise Audit, consulte a discussão a seguir.

A partir do MySQL 5.7.23, para novas instalações do MySQL, as colunas `USER` e `HOST` na tabela `audit_log_user` usadas pelo MySQL Enterprise Audit têm definições que correspondem melhor às definições das colunas `User` e `Host` na tabela de sistema `mysql.user`. Para Upgrades para 5.7.23 ou superior de uma instalação na qual o MySQL Enterprise Audit já está instalado, é recomendado que você altere as definições da tabela da seguinte forma:

```sql
ALTER TABLE mysql.audit_log_user
  DROP FOREIGN KEY audit_log_user_ibfk_1;
ALTER TABLE mysql.audit_log_filter
  ENGINE=InnoDB;
ALTER TABLE mysql.audit_log_filter
  CONVERT TO CHARACTER SET utf8 COLLATE utf8_bin;
ALTER TABLE mysql.audit_log_user
  ENGINE=InnoDB;
ALTER TABLE mysql.audit_log_user
  CONVERT TO CHARACTER SET utf8 COLLATE utf8_bin;
ALTER TABLE mysql.audit_log_user
  MODIFY COLUMN USER VARCHAR(32);
ALTER TABLE mysql.audit_log_user
  ADD FOREIGN KEY (FILTERNAME) REFERENCES mysql.audit_log_filter(NAME);
```

A partir do MySQL 5.7.21, para uma nova instalação do MySQL Enterprise Audit, `InnoDB` é usado em vez de `MyISAM` para as tabelas de audit log. Para Upgrades para 5.7.21 ou superior de uma instalação na qual o MySQL Enterprise Audit já está instalado, é recomendado que você altere as tabelas de audit log para usar `InnoDB`:

```sql
ALTER TABLE mysql.audit_log_user ENGINE=InnoDB;
ALTER TABLE mysql.audit_log_filter ENGINE=InnoDB;
```

Nota

Para usar o MySQL Enterprise Audit no contexto de replicação source/replica, Group Replication, ou InnoDB Cluster, você deve usar o MySQL 5.7.21 ou superior e garantir que as tabelas de audit log usem `InnoDB` conforme descrito. Em seguida, você deve preparar os nós Replica antes de executar o script de instalação no nó Source. Isto é necessário porque a instrução [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") no script não é replicada.

1. Em cada nó Replica, extraia a instrução [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") do script de instalação e execute-a manualmente.

2. No nó Source, execute o script de instalação conforme descrito anteriormente.

Para verificar a instalação do Plugin, examine a tabela [PLUGINS](information-schema-plugins-table.html "24.3.17 The INFORMATION_SCHEMA PLUGINS Table") do Information Schema ou use a instrução [SHOW PLUGINS](show-plugins.html "13.7.5.25 SHOW PLUGINS Statement") (consulte a [Seção 5.5.2, “Obtendo Informações do Plugin do Server”](obtaining-plugin-information.html "5.5.2 Obtaining Server Plugin Information")). Por exemplo:

```sql
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE 'audit%';
+-------------+---------------+
| PLUGIN_NAME | PLUGIN_STATUS |
+-------------+---------------+
| audit_log   | ACTIVE        |
+-------------+---------------+
```

Se o Plugin falhar ao inicializar, verifique o error log do Server em busca de mensagens de diagnóstico.

Após a instalação do MySQL Enterprise Audit, você pode usar a opção [`--audit-log`](audit-log-reference.html#option_mysqld_audit-log) para inicializações subsequentes do Server, a fim de controlar a ativação do `audit_log` plugin. Por exemplo, para evitar que o Plugin seja removido em tempo de execução (runtime), use esta opção:

```sql
[mysqld]
audit-log=FORCE_PLUS_PERMANENT
```

Se for desejado impedir que o Server seja executado sem o Audit Plugin, use [`--audit-log`](audit-log-reference.html#option_mysqld_audit-log) com o valor `FORCE` ou `FORCE_PLUS_PERMANENT` para forçar a falha na inicialização do Server caso o Plugin não seja inicializado com sucesso.

Importante

Por padrão, a filtragem de audit log baseada em regras não registra eventos auditáveis para nenhum usuário. Isso difere do comportamento de audit log legacy (anterior ao MySQL 5.7.13), que registra todos os eventos auditáveis para todos os usuários (consulte a [Seção 6.4.5.10, “Filtragem de Audit Log em Modo Legacy”](audit-log-legacy-filtering.html "6.4.5.10 Legacy Mode Audit Log Filtering")). Caso você deseje produzir o comportamento de registrar tudo (log-everything) com filtragem baseada em regras, crie um Filter simples para habilitar o logging e atribua-o à conta padrão:

```sql
SELECT audit_log_filter_set_filter('log_all', '{ "filter": { "log": true } }');
SELECT audit_log_filter_set_user('%', 'log_all');
```

O Filter atribuído a `%` é usado para conexões de qualquer conta que não tenha um Filter atribuído explicitamente (o que inicialmente é verdadeiro para todas as contas).

Uma vez instalado conforme descrito, o MySQL Enterprise Audit permanece instalado até ser desinstalado. Para removê-lo, execute as seguintes instruções:

```sql
DROP TABLE IF EXISTS mysql.audit_log_user;
DROP TABLE IF EXISTS mysql.audit_log_filter;
UNINSTALL PLUGIN audit_log;
DROP FUNCTION audit_log_filter_set_filter;
DROP FUNCTION audit_log_filter_remove_filter;
DROP FUNCTION audit_log_filter_set_user;
DROP FUNCTION audit_log_filter_remove_user;
DROP FUNCTION audit_log_filter_flush;
DROP FUNCTION audit_log_encryption_password_get;
DROP FUNCTION audit_log_encryption_password_set;
DROP FUNCTION audit_log_read;
DROP FUNCTION audit_log_read_bookmark;
```