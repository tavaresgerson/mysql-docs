#### 6.4.3.1 Instalação do Plugin de Validação de Senha

Esta seção descreve como instalar o plugin de validação de senha `validate_password`. Para informações gerais sobre a instalação de plugins, consulte [Section 5.5.1, “Installing and Uninstalling Plugins”](plugin-loading.html "5.5.1 Installing and Uninstalling Plugins").

Nota

Se você instalou o MySQL 5.7 usando o [MySQL Yum repository](https://dev.mysql.com/downloads/repo/yum/), [MySQL SLES Repository](https://dev.mysql.com/downloads/repo/suse/), ou [pacotes RPM fornecidos pela Oracle](linux-installation-rpm.html "2.5.5 Installing MySQL on Linux Using RPM Packages from Oracle"), o `validate_password` é ativado por padrão após você iniciar seu MySQL Server pela primeira vez.

Para ser utilizável pelo servidor, o arquivo da biblioteca do plugin deve estar localizado no diretório de plugins do MySQL (o diretório nomeado pela variável de sistema [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir)). Se necessário, configure a localização do diretório do plugin definindo o valor de [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir) durante a inicialização do servidor.

O nome base do arquivo da biblioteca do plugin é `validate_password`. O sufixo do nome do arquivo difere por plataforma (por exemplo, `.so` para sistemas Unix e tipo Unix, `.dll` para Windows).

Para carregar o plugin na inicialização do servidor, use a opção [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add) para nomear o arquivo da biblioteca que o contém. Com este método de carregamento de plugin, a opção deve ser fornecida toda vez que o servidor iniciar. Por exemplo, coloque estas linhas no arquivo `my.cnf` do servidor, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```sql
[mysqld]
plugin-load-add=validate_password.so
```

Após modificar o `my.cnf`, reinicie o servidor para que as novas configurações entrem em vigor.

Alternativamente, para carregar o plugin em tempo de execução, use esta instrução, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```sql
INSTALL PLUGIN validate_password SONAME 'validate_password.so';
```

[`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") carrega o plugin e também o registra na tabela de sistema `mysql.plugins` para fazer com que o plugin seja carregado em cada inicialização normal subsequente do servidor sem a necessidade de [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add).

Para verificar a instalação do plugin, examine a tabela Information Schema [`PLUGINS`](information-schema-plugins-table.html "24.3.17 The INFORMATION_SCHEMA PLUGINS Table") ou use a instrução [`SHOW PLUGINS`](show-plugins.html "13.7.5.25 SHOW PLUGINS Statement") (consulte [Section 5.5.2, “Obtaining Server Plugin Information”](obtaining-plugin-information.html "5.5.2 Obtaining Server Plugin Information")). Por exemplo:

```sql
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE 'validate%';
+-------------------+---------------+
| PLUGIN_NAME       | PLUGIN_STATUS |
+-------------------+---------------+
| validate_password | ACTIVE        |
+-------------------+---------------+
```

Se o plugin falhar ao inicializar, verifique o log de erro do servidor em busca de mensagens de diagnóstico.

Se o plugin tiver sido previamente registrado com [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") ou for carregado com [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add), você pode usar a opção `--validate-password` na inicialização do servidor para controlar a ativação do plugin. Por exemplo, para carregar o plugin na inicialização e impedir que ele seja removido em tempo de execução, use estas opções:

```sql
[mysqld]
plugin-load-add=validate_password.so
validate-password=FORCE_PLUS_PERMANENT
```

Se for desejado impedir que o servidor execute sem o plugin de validação de senha, use [`--validate-password`](validate-password-options-variables.html#option_mysqld_validate-password) com um valor de `FORCE` ou `FORCE_PLUS_PERMANENT` para forçar a falha na inicialização do servidor caso o plugin não seja inicializado com sucesso.