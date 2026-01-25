#### 6.4.1.12 Teste de Autenticação Pluggable

MySQL inclui um plugin de teste que verifica as credenciais da conta e registra o sucesso ou falha no error log do servidor. Este é um plugin loadable (não embutido) e deve ser instalado antes do uso.

O código fonte do plugin de teste é separado do código fonte do servidor, diferentemente do plugin native embutido, para que possa ser examinado como um exemplo relativamente simples que demonstra como escrever um plugin de autenticação loadable.

Note

Este plugin destina-se a fins de teste e desenvolvimento, e não deve ser usado em ambientes de produção ou em servidores expostos a redes públicas.

A tabela a seguir mostra os nomes dos arquivos do plugin e da library. O sufixo do nome do arquivo pode ser diferente no seu sistema. O arquivo deve estar localizado no diretório nomeado pela variável de sistema [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir).

**Tabela 6.19 Nomes de Plugin e Library para Autenticação de Teste**

| Plugin ou Arquivo | Nome do Plugin ou Arquivo |
| :--- | :--- |
| Plugin do lado do servidor | `test_plugin_server` |
| Plugin do lado do cliente | `auth_test_plugin` |
| Arquivo Library | `auth_test_plugin.so` |

As seções a seguir fornecem informações de instalação e uso específicas para a Autenticação Pluggable de Teste:

* [Instalando a Autenticação Pluggable de Teste](test-pluggable-authentication.html#test-pluggable-authentication-installation "Installing Test Pluggable Authentication")
* [Desinstalando a Autenticação Pluggable de Teste](test-pluggable-authentication.html#test-pluggable-authentication-uninstallation "Uninstalling Test Pluggable Authentication")
* [Usando a Autenticação Pluggable de Teste](test-pluggable-authentication.html#test-pluggable-authentication-usage "Using Test Pluggable Authentication")

Para informações gerais sobre Autenticação Pluggable no MySQL, consulte [Seção 6.2.13, “Pluggable Authentication”](pluggable-authentication.html "6.2.13 Pluggable Authentication").

##### Instalando a Autenticação Pluggable de Teste

Esta seção descreve como instalar o plugin de autenticação de teste do lado do servidor. Para obter informações gerais sobre a instalação de plugins, consulte [Seção 5.5.1, “Instalando e Desinstalando Plugins”](plugin-loading.html "5.5.1 Installing and Uninstalling Plugins").

Para ser utilizável pelo servidor, o arquivo library do plugin deve estar localizado no diretório de plugins do MySQL (o diretório nomeado pela variável de sistema [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir)). Se necessário, configure a localização do diretório de plugins definindo o valor de [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir) na inicialização do servidor.

Para carregar o plugin na inicialização do servidor, use a opção [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add) para nomear o arquivo library que o contém. Com este método de carregamento de plugin, a opção deve ser fornecida sempre que o servidor for iniciado. Por exemplo, coloque estas linhas no arquivo `my.cnf` do servidor, ajustando o sufixo `.so` conforme necessário para a sua plataforma:

```sql
[mysqld]
plugin-load-add=auth_test_plugin.so
```

Após modificar `my.cnf`, reinicie o servidor para que as novas configurações entrem em vigor.

Alternativamente, para carregar o plugin em tempo de execução, use esta instrução, ajustando o sufixo `.so` conforme necessário para a sua plataforma:

```sql
INSTALL PLUGIN test_plugin_server SONAME 'auth_test_plugin.so';
```

[`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") carrega o plugin imediatamente e também o registra na tabela de sistema `mysql.plugins` para fazer com que o servidor o carregue em cada inicialização normal subsequente, sem a necessidade de [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add).

Para verificar a instalação do plugin, examine a tabela [`PLUGINS`](information-schema-plugins-table.html "24.3.17 The INFORMATION_SCHEMA PLUGINS Table") do Information Schema ou use a instrução [`SHOW PLUGINS`](show-plugins.html "13.7.5.25 SHOW PLUGINS Statement") (consulte [Seção 5.5.2, “Obtendo Informações de Plugin do Servidor”](obtaining-plugin-information.html "5.5.2 Obtaining Server Plugin Information")). Por exemplo:

```sql
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE '%test_plugin%';
+--------------------+---------------+
| PLUGIN_NAME        | PLUGIN_STATUS |
+--------------------+---------------+
| test_plugin_server | ACTIVE        |
+--------------------+---------------+
```

Se o plugin falhar ao inicializar, verifique o error log do servidor em busca de mensagens de diagnóstico.

Para associar contas MySQL ao plugin de teste, consulte [Usando a Autenticação Pluggable de Teste](test-pluggable-authentication.html#test-pluggable-authentication-usage "Using Test Pluggable Authentication").

##### Desinstalando a Autenticação Pluggable de Teste

O método usado para desinstalar o plugin de autenticação de teste depende de como você o instalou:

* Se você instalou o plugin na inicialização do servidor usando a opção [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add), reinicie o servidor sem a opção.

* Se você instalou o plugin em tempo de execução usando uma instrução [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement"), ele permanece instalado nas reinicializações do servidor. Para desinstalá-lo, use [`UNINSTALL PLUGIN`](uninstall-plugin.html "13.7.3.4 UNINSTALL PLUGIN Statement"):

  ```sql
  UNINSTALL PLUGIN test_plugin_server;
  ```

##### Usando a Autenticação Pluggable de Teste

Para usar o plugin de autenticação de teste, crie uma conta e nomeie esse plugin na cláusula `IDENTIFIED WITH`:

```sql
CREATE USER 'testuser'@'localhost'
IDENTIFIED WITH test_plugin_server
BY 'testpassword';
```

Em seguida, forneça as opções [`--user`](connection-options.html#option_general_user) e [`--password`](connection-options.html#option_general_password) para essa conta ao se conectar ao servidor. Por exemplo:

```sql
$> mysql --user=testuser --password
Enter password: testpassword
```

O plugin busca o password conforme recebido do cliente e o compara com o valor armazenado na coluna `authentication_string` da linha da conta na tabela de sistema `mysql.user`. Se os dois valores coincidirem, o plugin retorna o valor de `authentication_string` como o novo ID de usuário efetivo.

Você pode procurar no error log do servidor por uma mensagem que indique se a autenticação foi bem-sucedida (observe que o password é relatado como o "user"):

```sql
[Note] Plugin test_plugin_server reported:
'successfully authenticated user testpassword'
```