#### 8.4.1.9 Autenticação Pluggable sem Login

O plugin de autenticação do lado do servidor `mysql_no_login` impede todas as conexões do cliente para qualquer conta que o use. Os casos de uso para este plugin incluem:

* Contas que devem ser capazes de executar programas e visualizações armazenados com privilégios elevados sem expor esses privilégios a usuários comuns.
* Contas proxy que nunca devem permitir login direto, mas devem ser acessadas apenas por meio de contas proxy.

A tabela a seguir mostra os nomes dos arquivos do plugin e da biblioteca. O sufixo do nome do arquivo pode diferir no seu sistema. O arquivo deve estar localizado no diretório nomeado pela variável de sistema `plugin_dir`.

**Tabela 8.24 Nomes do Plugin e da Biblioteca para Autenticação Pluggable sem Login**

<table><thead><tr> <th>Plugin ou Arquivo</th> <th>Nome do Plugin ou Arquivo</th> </tr></thead><tbody><tr> <td>Plugin do lado do servidor</td> <td><code>mysql_no_login</code></td> </tr><tr> <td>Plugin do lado do cliente</td> <td>Nenhum</td> </tr><tr> <td>Arquivo da biblioteca</td> <td><code>mysql_no_login.so</code></td> </tr></tbody></table>

As seções a seguir fornecem informações de instalação e uso específicas para a autenticação pluggable sem login:

*  Instalando Autenticação Pluggable sem Login
*  Desinstalando Autenticação Pluggable sem Login
*  Usando Autenticação Pluggable sem Login

Para informações gerais sobre autenticação pluggable no MySQL, consulte  Seção 8.2.17, “Autenticação Pluggable”. Para informações sobre usuários proxy, consulte  Seção 8.2.19, “Usuários Proxy”.

##### Instalando Autenticação Pluggable sem Login

Esta seção descreve como instalar o plugin de autenticação sem login. Para informações gerais sobre como instalar plugins, consulte  Seção 7.6.1, “Instalando e Desinstalando Plugins”.

Para ser utilizável pelo servidor, o arquivo da biblioteca do plugin deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin definindo o valor de `plugin_dir` na inicialização do servidor.

O nome de base do arquivo da biblioteca de plugins é `mysql_no_login`. O sufixo do nome do arquivo difere conforme a plataforma (por exemplo, `.so` para sistemas Unix e Unix-like, `.dll` para Windows).

Para carregar o plugin no início do servidor, use a opção `--plugin-load-add` para nomear o arquivo da biblioteca que o contém. Com esse método de carregamento de plugins, a opção deve ser fornecida toda vez que o servidor for iniciado. Por exemplo, coloque essas linhas no arquivo `my.cnf` do servidor, ajustando o sufixo `.so` conforme necessário para sua plataforma:

```
[mysqld]
plugin-load-add=mysql_no_login.so
```

Após modificar o `my.cnf`, reinicie o servidor para que as novas configurações entrem em vigor.

Alternativamente, para carregar o plugin em tempo de execução, use esta declaração, ajustando o sufixo `.so` conforme necessário para sua plataforma:

```
INSTALL PLUGIN mysql_no_login SONAME 'mysql_no_login.so';
```

`INSTALL PLUGIN` carrega o plugin imediatamente e também o registra na tabela `mysql.plugins` do sistema para fazer com que o servidor o carregue para cada inicialização normal subsequente, sem a necessidade de `--plugin-load-add`.

Para verificar a instalação do plugin, examine a tabela do Schema de Informações `PLUGINS` ou use a declaração `SHOW PLUGINS` (consulte a Seção 7.6.2, “Obtendo Informações de Plugins do Servidor”). Por exemplo:

```
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE '%login%';
+----------------+---------------+
| PLUGIN_NAME    | PLUGIN_STATUS |
+----------------+---------------+
| mysql_no_login | ACTIVE        |
+----------------+---------------+
```

Se o plugin não conseguir inicializar, verifique o log de erro do servidor em busca de mensagens de diagnóstico.

Para associar contas MySQL ao plugin sem login, consulte Usar Autenticação de Pluggable sem Login.

##### Desinstalação da Autenticação de Pluggable sem Login

O método usado para desinstalar o plugin de autenticação sem login depende de como ele foi instalado:

* Se você instalou o plugin no início do servidor usando uma opção `--plugin-load-add`, reinicie o servidor sem a opção.
* Se você instalou o plugin em tempo de execução usando uma declaração `INSTALL PLUGIN`, ele permanece instalado em todas as reinicializações do servidor. Para desinstalá-lo, use `UNINSTALL PLUGIN`:

  ```
  UNINSTALL PLUGIN mysql_no_login;
  ```

##### Usar a Autenticação de Pluggable sem Login

Esta seção descreve como usar o plugin de autenticação sem login para impedir que contas sejam usadas para conectar programas clientes do MySQL ao servidor. Assume-se que o servidor está em execução com o plugin sem login habilitado, conforme descrito em Instalar Autenticação Pluggable sem Login.

Para referenciar o plugin de autenticação sem login na cláusula `IDENTIFIED WITH` de uma declaração `CREATE USER`, use o nome `mysql_no_login`.

Uma conta que autentica usando `mysql_no_login` pode ser usada como o `DEFINER` para objetos de programas e visualizações armazenados. Se tal definição de objeto também incluir `SQL SECURITY DEFINER`, ela é executada com os privilégios daquela conta. Os DBA podem usar esse comportamento para fornecer acesso a dados confidenciais ou sensíveis que são expostos apenas por interfaces bem controladas.

O exemplo a seguir ilustra esses princípios. Ele define uma conta que não permite conexões de clientes e a associa a ela uma visualização que exibe apenas certas colunas da tabela de sistema `mysql.user`:

```
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

```
GRANT SELECT ON nologindb.myview
  TO 'ordinaryuser'@'localhost';
```

Agora, o usuário comum pode usar a visualização para acessar as informações limitadas que ela apresenta:

```
SELECT * FROM nologindb.myview;
```

Tentativas do usuário de acessar colunas diferentes das expostas pela visualização resultam em um erro, assim como tentativas de seleção da visualização por usuários que não têm acesso a ela.

::: info Nota

Como a conta `nologin` não pode ser usada diretamente, as operações necessárias para configurar objetos que ela usa devem ser realizadas por uma conta `root` ou uma conta semelhante que tenha os privilégios necessários para criar os objetos e definir os valores de `DEFINER`.

:::

O plugin `mysql_no_login` também é útil em cenários de proxy. (Para uma discussão sobre os conceitos envolvidos no proxy, consulte Seção 8.2.19, “Usuários Proxy”.) Uma conta que autentica usando `mysql_no_login` pode ser usada como um usuário proxy para contas proxy:

```
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

Isso permite que os clientes acessem o MySQL por meio da conta do proxy (`proxy_user`), mas não para contornar o mecanismo do proxy conectando-se diretamente como o usuário proxy (`proxied_user`). Um cliente que se conecta usando a conta `proxy_user` tem os privilégios da conta `proxied_user`, mas o próprio `proxied_user` não pode ser usado para se conectar.

Para métodos alternativos de proteção de contas proxy contra o uso direto, consulte Prevenir o Login Direto em Contas Proxy.