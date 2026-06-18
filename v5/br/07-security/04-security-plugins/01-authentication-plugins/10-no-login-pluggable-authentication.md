#### 6.4.1.10 Autenticação Plugável sem Login

O plugin de autenticação de servidor `mysql_no_login` impede todas as conexões do cliente a qualquer conta que o utilize. Os casos de uso para este plugin incluem:

- Contas que devem ser capazes de executar programas e visualizações armazenados com privilégios elevados, sem expor esses privilégios aos usuários comuns.

- Contas proxy que nunca devem permitir login direto, mas devem ser acessadas apenas por meio de contas proxy.

A tabela a seguir mostra os nomes dos arquivos de plugin e biblioteca. O sufixo do nome do arquivo pode variar no seu sistema. O arquivo deve estar localizado no diretório nomeado pela variável de sistema `plugin_dir`.

**Tabela 6.17 Nomes de plugins e bibliotecas para autenticação sem login**

<table summary="Nomes para os plugins e o arquivo de biblioteca usados para autenticação de senha sem login."><thead><tr> <th>Plugin ou arquivo</th> <th>Nome do Plugin ou do Arquivo</th> </tr></thead><tbody><tr> <td>Plugin no lado do servidor</td> <td><code>mysql_no_login</code></td> </tr><tr> <td>Plugin no lado do cliente</td> <td>Nenhum</td> </tr><tr> <td>Arquivo da biblioteca</td> <td><code>mysql_no_login.so</code></td> </tr></tbody></table>

As seções a seguir fornecem informações de instalação e uso específicas para a autenticação plugável sem login:

- Instalando Autenticação Pluggable sem Login
- Desinstalação da Autenticação Conectada sem Login
- Usando Autenticação Pluggable sem Login

Para informações gerais sobre autenticação plugável no MySQL, consulte Seção 6.2.13, “Autenticação Plugável”. Para informações sobre usuários proxy, consulte Seção 6.2.14, “Usuários Proxy”.

##### Instalando Autenticação Pluggable sem Login

Esta seção descreve como instalar o plugin de autenticação sem login. Para informações gerais sobre como instalar plugins, consulte Seção 5.5.1, “Instalando e Desinstalando Plugins”.

Para que o plugin possa ser usado pelo servidor, o arquivo da biblioteca do plugin deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin definindo o valor de `plugin_dir` durante o início do servidor.

O nome de base do arquivo da biblioteca de plugins é `mysql_no_login`. O sufixo do nome do arquivo difere de acordo com a plataforma (por exemplo, `.so` para sistemas Unix e sistemas semelhantes ao Unix, `.dll` para Windows).

Para carregar o plugin no início do servidor, use a opção `--plugin-load-add` para nomear o arquivo da biblioteca que o contém. Com esse método de carregamento de plugins, a opção deve ser fornecida toda vez que o servidor for iniciado. Por exemplo, coloque essas linhas no arquivo `my.cnf` do servidor, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
[mysqld]
plugin-load-add=mysql_no_login.so
```

Depois de modificar o `my.cnf`, reinicie o servidor para que as novas configurações entrem em vigor.

Como alternativa, para carregar o plugin em tempo de execução, use esta declaração, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```sql
INSTALL PLUGIN mysql_no_login SONAME 'mysql_no_login.so';
```

`INSTALL PLUGIN` carrega o plugin imediatamente e também o registra na tabela `mysql.plugins` do sistema para que o servidor o carregue em cada inicialização normal subsequente, sem a necessidade de `--plugin-load-add`.

Para verificar a instalação do plugin, examine a tabela Schema de Informações `PLUGINS` ou use a declaração `SHOW PLUGINS` (consulte Seção 5.5.2, “Obtendo Informações de Plugins do Servidor”). Por exemplo:

```sql
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE '%login%';
+----------------+---------------+
| PLUGIN_NAME    | PLUGIN_STATUS |
+----------------+---------------+
| mysql_no_login | ACTIVE        |
+----------------+---------------+
```

Se o plugin não conseguir se inicializar, verifique o log de erro do servidor para obter mensagens de diagnóstico.

Para associar contas do MySQL ao plugin sem login, consulte Usando o Plugin de Autenticação Desconectada.

##### Desinstalação da Autenticação Conectada sem Login

O método usado para desinstalar o plugin de autenticação sem login depende de como você o instalou:

- Se você instalou o plugin na inicialização do servidor usando a opção `--plugin-load-add`, reinicie o servidor sem essa opção.

- Se você instalou o plugin durante a execução usando uma declaração `INSTALL PLUGIN`, ele permanece instalado após reinicializações do servidor. Para desinstalá-lo, use `UNINSTALL PLUGIN`:

  ```sql
  UNINSTALL PLUGIN mysql_no_login;
  ```

##### Usando Autenticação Pluggable sem Login

Esta seção descreve como usar o plugin de autenticação sem login para impedir que contas sejam usadas para conectar programas de clientes MySQL ao servidor. Assume-se que o servidor está em execução com o plugin de não login habilitado, conforme descrito em Instalando Autenticação Pluggable sem Login.

Para se referir ao plugin de autenticação sem login na cláusula `IDENTIFIED WITH` de uma declaração `CREATE USER` (create-user.html), use o nome `mysql_no_login`.

Uma conta que autentica usando `mysql_no_login` pode ser usada como `DEFINER` para objetos de programas e visualizações armazenados. Se tal definição de objeto também incluir `SQL SECURITY DEFINER`, ela será executada com os privilégios dessa conta. Os administradores de banco de dados podem usar esse comportamento para fornecer acesso a dados confidenciais ou sensíveis que são expostos apenas por meio de interfaces bem controladas.

O exemplo a seguir ilustra esses princípios. Ele define uma conta que não permite conexões de clientes e a associa a uma visualização que exibe apenas certas colunas da tabela de sistema `mysql.user`:

```sql
CREATE DATABASE nologindb;
CREATE USER 'nologin'@'localhost'
  IDENTIFIED WITH mysql_no_login;
GRANT ALL ON nologindb.*
  TO 'nologin'@'localhost';
GRANT SELECT ON mysql.user
  TO 'nologin'@'localhost';
CREATE DEFINER = 'nologin'@'localhost'
  SQL SECURITY DEFINER
  VIEW nologindb.myview
  AS SELECT User, Host FROM mysql.user;
```

Para fornecer acesso protegido à visualização a um usuário comum, faça o seguinte:

```sql
GRANT SELECT ON nologindb.myview
  TO 'ordinaryuser'@'localhost';
```

Agora, o usuário comum pode usar a visualização para acessar as informações limitadas que ela apresenta:

```sql
SELECT * FROM nologindb.myview;
```

As tentativas do usuário de acessar colunas que não estejam expostas pela visualização resultam em um erro, assim como as tentativas de seleção da visualização por usuários que não tenham acesso a ela.

Nota

Como a conta `nologin` não pode ser usada diretamente, as operações necessárias para configurar os objetos que ela utiliza devem ser realizadas pela conta `root` ou por uma conta semelhante que tenha os privilégios necessários para criar os objetos e definir os valores `DEFINER`.

O plugin `mysql_no_login` também é útil em cenários de proxy. (Para uma discussão sobre os conceitos envolvidos no proxy, consulte Seção 6.2.14, “Usuários de Proxy”.) Uma conta que autentica usando `mysql_no_login` pode ser usada como um usuário proxy para contas proxy:

```sql
-- create proxied account
CREATE USER 'proxied_user'@'localhost'
  IDENTIFIED WITH mysql_no_login;
-- grant privileges to proxied account
GRANT ...
  ON ...
  TO 'proxied_user'@'localhost';
-- permit proxy_user to be a proxy account for proxied account
GRANT PROXY
  ON 'proxied_user'@'localhost'
  TO 'proxy_user'@'localhost';
```

Isso permite que os clientes acessem o MySQL através da conta do proxy (`proxy_user`), mas não para contornar o mecanismo do proxy conectando-se diretamente como o usuário proxy (`proxied_user`). Um cliente que se conecta usando a conta `proxy_user` tem os privilégios da conta `proxied_user`, mas o próprio `proxied_user` não pode ser usado para se conectar.

Para métodos alternativos de proteção de contas proxy contra o uso direto, consulte Prevenção do Login Direto em Contas Proxy.
