#### 6.4.1.11 Autenticação Pluggable Socket Peer-Credential

O plugin de autenticação `auth_socket` do lado do Server autentica Clients que se conectam a partir do host local através do arquivo de Unix socket. O plugin usa a opção de socket `SO_PEERCRED` para obter informações sobre o User que está executando o programa Client. Desta forma, o plugin pode ser usado apenas em sistemas que suportam a opção `SO_PEERCRED`, como o Linux.

O código-fonte deste plugin pode ser examinado como um exemplo relativamente simples, demonstrando como escrever um plugin de autenticação carregável.

A tabela a seguir mostra os nomes dos arquivos do plugin e da Library. O arquivo deve estar localizado no diretório nomeado pela System Variable [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir).

**Tabela 6.18 Nomes do Plugin e da Library para Autenticação Socket Peer-Credential**

<table summary="Nomes para os plugins e o arquivo de Library usados para a autenticação por senha socket peer-credential."><thead><tr> <th>Plugin ou Arquivo</th> <th>Nome do Plugin ou Arquivo</th> </tr></thead><tbody><tr> <td>Plugin do lado do Server</td> <td><code>auth_socket</code></td> </tr><tr> <td>Plugin do lado do Client</td> <td>Nenhum, veja a discussão</td> </tr><tr> <td>Arquivo de Library</td> <td><code>auth_socket.so</code></td> </tr> </tbody></table>

As seções a seguir fornecem informações de instalação e uso específicas para a autenticação pluggable via socket:

* [Instalação da Autenticação Pluggable Socket](socket-pluggable-authentication.html#socket-pluggable-authentication-installation "Instalação da Autenticação Pluggable Socket")
* [Desinstalação da Autenticação Pluggable Socket](socket-pluggable-authentication.html#socket-pluggable-authentication-uninstallation "Desinstalação da Autenticação Pluggable Socket")
* [Uso da Autenticação Pluggable Socket](socket-pluggable-authentication.html#socket-pluggable-authentication-usage "Uso da Autenticação Pluggable Socket")

Para informações gerais sobre autenticação pluggable no MySQL, consulte [Seção 6.2.13, “Autenticação Pluggable”](pluggable-authentication.html "6.2.13 Autenticação Pluggable").

##### Instalação da Autenticação Pluggable Socket

Esta seção descreve como instalar o plugin de autenticação via socket. Para informações gerais sobre a instalação de plugins, consulte [Seção 5.5.1, “Instalando e Desinstalando Plugins”](plugin-loading.html "5.5.1 Instalando e Desinstalando Plugins").

Para ser utilizável pelo Server, o arquivo de Library do plugin deve estar localizado no diretório de plugins do MySQL (o diretório nomeado pela System Variable [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir)). Se necessário, configure a localização do diretório do plugin definindo o valor de [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir) na inicialização do Server.

Para carregar o plugin na inicialização do Server, use a opção [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add) para nomear o arquivo de Library que o contém. Com este método de carregamento de plugin, a opção deve ser fornecida toda vez que o Server for iniciado. Por exemplo, insira estas linhas no arquivo `my.cnf` do Server:

```sql
[mysqld]
plugin-load-add=auth_socket.so
```

Após modificar `my.cnf`, reinicie o Server para que as novas configurações entrem em vigor.

Alternativamente, para carregar o plugin em tempo de execução (runtime), use esta instrução:

```sql
INSTALL PLUGIN auth_socket SONAME 'auth_socket.so';
```

[`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") carrega o plugin imediatamente e também o registra na tabela de sistema `mysql.plugins` para fazer com que o Server o carregue em cada inicialização normal subsequente sem a necessidade de [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add).

Para verificar a instalação do plugin, examine a tabela Information Schema [`PLUGINS`](information-schema-plugins-table.html "24.3.17 The INFORMATION_SCHEMA PLUGINS Table") ou use a instrução [`SHOW PLUGINS`](show-plugins.html "13.7.5.25 SHOW PLUGINS Statement") (consulte [Seção 5.5.2, “Obtendo Informações de Plugin do Server”](obtaining-plugin-information.html "5.5.2 Obtendo Informações de Plugin do Server")). Por exemplo:

```sql
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE '%socket%';
+-------------+---------------+
| PLUGIN_NAME | PLUGIN_STATUS |
+-------------+---------------+
| auth_socket | ACTIVE        |
+-------------+---------------+
```

Se o plugin falhar ao inicializar, verifique o error log do Server em busca de mensagens de diagnóstico.

Para associar contas MySQL ao socket plugin, consulte [Uso da Autenticação Pluggable Socket](socket-pluggable-authentication.html#socket-pluggable-authentication-usage "Uso da Autenticação Pluggable Socket").

##### Desinstalação da Autenticação Pluggable Socket

O método usado para desinstalar o plugin de autenticação via socket depende de como você o instalou:

* Se você instalou o plugin na inicialização do Server usando uma opção [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add), reinicie o Server sem a opção.

* Se você instalou o plugin em runtime usando uma instrução [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement"), ele permanece instalado nas reinicializações do Server. Para desinstalá-lo, use [`UNINSTALL PLUGIN`](uninstall-plugin.html "13.7.3.4 UNINSTALL PLUGIN Statement"):

  ```sql
  UNINSTALL PLUGIN auth_socket;
  ```

##### Uso da Autenticação Pluggable Socket

O socket plugin verifica se o nome de User do socket (o nome de User do sistema operacional) corresponde ao nome de User do MySQL especificado pelo programa Client para o Server. Se os nomes não coincidirem, o plugin verifica se o nome de User do socket corresponde ao nome especificado na coluna `authentication_string` da linha da tabela de sistema `mysql.user`. Se uma correspondência for encontrada, o plugin permite a conexão. O valor `authentication_string` pode ser especificado usando uma cláusula `IDENTIFIED ...AS` com [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") ou [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement").

Suponha que uma conta MySQL seja criada para um User do sistema operacional chamado `valerie` que deve ser autenticado pelo plugin `auth_socket` para conexões a partir do host local através do arquivo socket:

```sql
CREATE USER 'valerie'@'localhost' IDENTIFIED WITH auth_socket;
```

Se um User no host local com o nome de login `stefanie` invocar [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") com a opção `--user=valerie` para se conectar através do arquivo socket, o Server usa `auth_socket` para autenticar o Client. O plugin determina que o valor da opção `--user` (`valerie`) difere do nome de User do Client (`stephanie`) e recusa a conexão. Se um User chamado `valerie` tentar a mesma coisa, o plugin descobre que o nome de User e o nome de User do MySQL são ambos `valerie` e permite a conexão. No entanto, o plugin recusa a conexão mesmo para `valerie` se a conexão for feita usando um protocolo diferente, como TCP/IP.

Para permitir que os Users do sistema operacional `valerie` e `stephanie` acessem o MySQL através de conexões via arquivo socket que usam a conta, isso pode ser feito de duas maneiras:

* Nomeie ambos os Users no momento da criação da conta, um seguindo [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement"), e o outro na string de autenticação:

  ```sql
  CREATE USER 'valerie'@'localhost' IDENTIFIED WITH auth_socket AS 'stephanie';
  ```

* Se você já usou [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") para criar a conta para um único User, use [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") para adicionar o segundo User:

  ```sql
  CREATE USER 'valerie'@'localhost' IDENTIFIED WITH auth_socket;
  ALTER USER 'valerie'@'localhost' IDENTIFIED WITH auth_socket AS 'stephanie';
  ```

Para acessar a conta, tanto `valerie` quanto `stephanie` devem especificar `--user=valerie` no momento da conexão.