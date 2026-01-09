#### 8.4.1.5 Autenticação Conectada a Windows

Nota

A autenticação conectada a Windows é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para obter mais informações sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

A Edição Empresarial do MySQL para Windows suporta um método de autenticação que realiza autenticação externa no Windows, permitindo que o MySQL Server use serviços nativos do Windows para autenticar conexões de clientes. Usuários que fizeram login no Windows podem se conectar a partir de programas clientes do MySQL ao servidor com base nas informações de seu ambiente, sem precisar especificar uma senha adicional.

O cliente e o servidor trocam pacotes de dados no aperto de mão de autenticação. Como resultado dessa troca, o servidor cria um objeto de contexto de segurança que representa a identidade do cliente no sistema operacional Windows. Essa identidade inclui o nome da conta do cliente. A autenticação conectada a Windows usa a identidade do cliente para verificar se é uma conta específica ou um membro de um grupo. Por padrão, a negociação usa Kerberos para autenticação, e depois NTLM se o Kerberos estiver indisponível.

A autenticação conectada a Windows oferece essas capacidades:

* Autenticação externa: A autenticação no Windows permite que o MySQL Server aceite conexões de usuários definidos fora das tabelas de concessão do MySQL que fizeram login no Windows.

* Suporte a usuários proxy: A autenticação no Windows pode retornar ao MySQL um nome de usuário diferente do nome de usuário externo passado pelo programa cliente. Isso significa que o plugin pode retornar o usuário MySQL que define os privilégios que o usuário autenticado no Windows deve ter. Por exemplo, um usuário do Windows chamado `joe` pode se conectar e ter os privilégios de um usuário do MySQL chamado `developer`.

A tabela a seguir mostra os nomes dos arquivos de plugin e biblioteca. O arquivo deve estar localizado no diretório nomeado pela variável de sistema `plugin_dir`.

**Tabela 8.18 Nomes de Plugin e Biblioteca para Autenticação Windows**

<table summary="Nomes dos plugins e arquivos de biblioteca usados para autenticação de senha do Windows."><thead><tr> <th>Plugin ou Arquivo</th> <th>Plugin ou Nome do Arquivo</th> </tr></thead><tbody><tr> <td>Plugin do lado do servidor</td> <td><code class="literal">authentication_windows</code></td> </tr><tr> <td>Plugin do lado do cliente</td> <td><code class="literal">authentication_windows_client</code></td> </tr><tr> <td>Arquivo de biblioteca</td> <td><code class="filename">authentication_windows.dll</code></td> </tr></tbody></table>

O arquivo de biblioteca inclui apenas o plugin do lado do servidor. O plugin do lado do cliente está embutido na biblioteca de cliente `libmysqlclient`.

O plugin de autenticação Windows do lado do servidor está incluído apenas na Edição Empresarial do MySQL. Não está incluído nas distribuições comunitárias do MySQL. O plugin do lado do cliente está incluído em todas as distribuições, incluindo as distribuições comunitárias. Isso permite que clientes de qualquer distribuição se conectem a um servidor que tenha o plugin do lado do servidor carregado.

As seções a seguir fornecem informações de instalação e uso específicas para a autenticação de plugin de autenticação do Windows:

* Instalando Autenticação de Plugin de Autenticação do Windows
* Desinstalando Autenticação de Plugin de Autenticação do Windows
* Usando Autenticação de Plugin de Autenticação do Windows

Para informações gerais sobre autenticação de plugin no MySQL, consulte a Seção 8.2.17, “Autenticação de Plugin”. Para informações sobre usuários proxy, consulte a Seção 8.2.19, “Usuários Proxy”.

##### Instalando Autenticação de Plugin de Autenticação do Windows

Esta seção descreve como instalar o plugin de autenticação Windows no lado do servidor. Para obter informações gerais sobre como instalar plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

Para que o plugin seja utilizado pelo servidor, o arquivo da biblioteca do plugin deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin definindo o valor de `plugin_dir` na inicialização do servidor.

Para carregar o plugin na inicialização do servidor, use a opção `--plugin-load-add` para nomear o arquivo da biblioteca que o contém. Com esse método de carregamento de plugins, a opção deve ser fornecida toda vez que o servidor for iniciado. Por exemplo, coloque essas linhas no arquivo `my.cnf` do servidor:

```
[mysqld]
plugin-load-add=authentication_windows.dll
```

Após modificar o `my.cnf`, reinicie o servidor para que as novas configurações entrem em vigor.

Alternativamente, para carregar o plugin em tempo de execução, use a seguinte declaração:

```
INSTALL PLUGIN authentication_windows SONAME 'authentication_windows.dll';
```

`INSTALL PLUGIN` carrega o plugin imediatamente e também o registra na tabela do sistema `mysql.plugins` para que o servidor o carregue para cada inicialização normal subsequente, sem a necessidade de `--plugin-load-add`.

Para verificar a instalação do plugin, examine a tabela do esquema de informações `PLUGINS` ou use a declaração `SHOW PLUGINS` (consulte a Seção 7.6.2, “Obtendo Informações de Plugins do Servidor”). Por exemplo:

```
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE '%windows%';
+------------------------+---------------+
| PLUGIN_NAME            | PLUGIN_STATUS |
+------------------------+---------------+
| authentication_windows | ACTIVE        |
+------------------------+---------------+
```

Se o plugin não conseguir inicializar, verifique o log de erro do servidor em busca de mensagens de diagnóstico.

Para associar contas do MySQL ao plugin de autenticação Windows, consulte Usar Autenticação Windows Personalizável. O controle adicional do plugin é fornecido pelas variáveis de sistema `authentication_windows_use_principal_name` e `authentication_windows_log_level`. Consulte a Seção 7.1.8, “Variáveis de Sistema do Servidor”.

##### Desinstalação da Autenticação Windows Personalizável

O método usado para desinstalar o plugin de autenticação do Windows depende de como você o instalou:

* Se você instalou o plugin na inicialização do servidor usando a opção `--plugin-load-add`, reinicie o servidor sem essa opção.

* Se você instalou o plugin em tempo de execução usando uma declaração `INSTALL PLUGIN`, ele permanece instalado em todos os reinicializações do servidor. Para desinstalá-lo, use `UNINSTALL PLUGIN`:

  ```
  UNINSTALL PLUGIN authentication_windows;
  ```

Além disso, remova quaisquer opções de inicialização que definam variáveis de sistema relacionadas ao plugin do Windows.

##### Usando o Plugin de Autenticação de Windows Pluggable

O plugin de autenticação do Windows suporta o uso de contas MySQL de modo que os usuários que se cadastrarem no Windows possam se conectar ao servidor MySQL sem precisar especificar uma senha adicional. Assume-se que o servidor está sendo executado com o plugin do lado do servidor habilitado, conforme descrito na Instalação do Windows Pluggable Authentication. Uma vez que o DBA tenha habilitado o plugin do lado do servidor e configurado contas para usá-lo, os clientes podem se conectar usando essas contas sem nenhuma outra configuração necessária por parte deles.

Para referenciar o plugin de autenticação do Windows no `IDENTIFIED WITH` da cláusula de uma declaração `CREATE USER`, use o nome `authentication_windows`. Suponha que os usuários do Windows `Rafal` e `Tasha` devam ter permissão para se conectar ao MySQL, assim como quaisquer usuários do grupo `Administradores` ou `Usuários de Poder`. Para configurar isso, crie uma conta MySQL chamada `sql_admin` que use o plugin do Windows para autenticação:

```
CREATE USER sql_admin
  IDENTIFIED WITH authentication_windows
  AS 'Rafal, Tasha, Administrators, "Power Users"';
```

O nome do plugin é `authentication_windows`. A string que segue a palavra-chave `AS` é a string de autenticação. Ela especifica que os usuários do Windows chamados `Rafal` ou `Tasha` têm permissão para se autenticar no servidor como o usuário MySQL `sql_admin`, assim como qualquer usuário do Windows no grupo `Administradores` ou `Usuários com Permissões Avançadas`. O nome do grupo `Administrators` contém um espaço, então ele deve ser citado com caracteres de aspas duplas.

Depois de criar a conta `sql_admin`, um usuário que tenha iniciado sessão no Windows pode tentar se conectar ao servidor usando essa conta:

```
C:\> mysql --user=sql_admin
```

Não é necessário digitar uma senha aqui. O plugin `authentication_windows` usa a API de segurança do Windows para verificar qual usuário do Windows está se conectando. Se esse usuário for chamado `Rafal` ou `Tasha`, ou for membro do grupo `Administradores` ou `Usuários com Permissões Avançadas`, o servidor concede o acesso e o cliente é autenticado como `sql_admin` e tem quaisquer privilégios concedidos à conta `sql_admin`. Caso contrário, o servidor nega o acesso.

A sintaxe da string de autenticação para o plugin de autenticação do Windows segue estas regras:

* A string consiste em uma ou mais associações de usuário separadas por vírgulas.

* Cada associação de usuário associa um nome de usuário ou grupo do Windows com um nome de usuário MySQL:

  ```
  win_user_or_group_name=mysql_user_name
  win_user_or_group_name
  ```

  Para a sintaxe do último tipo, sem o valor `mysql_user_name`, o valor implícito é o usuário MySQL criado pela instrução `CREATE USER`. Assim, essas instruções são equivalentes:

  ```
  CREATE USER sql_admin
    IDENTIFIED WITH authentication_windows
    AS 'Rafal, Tasha, Administrators, "Power Users"';

  CREATE USER sql_admin
    IDENTIFIED WITH authentication_windows
    AS 'Rafal=sql_admin, Tasha=sql_admin, Administrators=sql_admin,
        "Power Users"=sql_admin';
  ```

* Cada caractere barra invertida (`\`) em um valor deve ser duplicado porque a barra invertida é o caractere de escape nas strings MySQL.

* Espaços de início e fim não dentro de aspas são ignorados.

* Valores de *`win_user_or_group_name`* e *`mysql_user_name`* não citados são capazes de conter qualquer coisa, exceto sinal de igual, vírgula ou espaço.

* Se o valor de *`win_user_or_group_name`* e/ou *`mysql_user_name`* estiver entre aspas duplas, tudo entre as aspas faz parte do valor. Isso é necessário, por exemplo, se o nome contiver caracteres de espaço. Todos os caracteres entre as aspas são legais, exceto as aspas duplas e a barra invertida. Para incluir qualquer um desses caracteres, escape-o com uma barra invertida.

Os valores de *`win_user_or_group_name`* usam a sintaxe convencional para princípios do Windows, sejam eles locais ou em um domínio. Exemplos (note a duplicação de barras invertidas):

```
  domain\\user
  .\\user
  domain\\group
  .\\group
  BUILTIN\\WellKnownGroup
  ```

Quando invocado pelo servidor para autenticar um cliente, o plugin analisa a string de autenticação da esquerda para a direita em busca de um usuário ou grupo que corresponda ao usuário do Windows. Se houver uma correspondência, o plugin retorna o *`mysql_user_name`* correspondente ao servidor MySQL. Se não houver correspondência, a autenticação falha.

Uma correspondência de nome de usuário tem preferência sobre uma correspondência de nome de grupo. Suponha que o usuário do Windows chamado `win_user` seja membro de `win_group` e a string de autenticação seja assim:

```
'win_group = sql_user1, win_user = sql_user2'
```

Quando `win_user` se conecta ao servidor MySQL, há uma correspondência tanto para `win_group` quanto para `win_user`. O plugin autentica o usuário como `sql_user2` porque a correspondência de usuário mais específica tem precedência sobre a correspondência de grupo, mesmo que o grupo esteja listado primeiro na string de autenticação.

A autenticação do Windows sempre funciona para conexões do mesmo computador em que o servidor está em execução. Para conexões entre computadores, ambos os computadores devem estar registrados no Microsoft Active Directory. Se estiverem no mesmo domínio do Windows, não é necessário especificar um nome de domínio. Também é possível permitir conexões de um domínio diferente, como neste exemplo:

```
CREATE USER sql_accounting
  IDENTIFIED WITH authentication_windows
  AS 'SomeDomain\\Accounting';
```

Aqui, `SomeDomain` é o nome do outro domínio. O caractere barra invertida é duplicado porque é o caractere de escape MySQL dentro de strings.

O MySQL suporta o conceito de usuários proxy, onde um cliente pode se conectar e autenticar-se no servidor MySQL usando uma única conta, mas, enquanto conectado, tem os privilégios de outra conta (veja a Seção 8.2.19, “Usuários Proxy”). Suponha que você queira que os usuários do Windows se conectem usando um único nome de usuário, mas sejam mapeados com base nos nomes de usuário e grupos do Windows para contas MySQL específicas da seguinte forma:

* Os usuários `local_user` e `MyDomain\domain_user` dos usuários Windows locais e do domínio devem ser mapeados para a conta `local_wlad` do MySQL.

* Os usuários do grupo de domínio `MyDomain\Developers` devem ser mapeados para a conta `local_dev` do MySQL.

* Os administradores da máquina local devem ser mapeados para a conta `local_admin` do MySQL.

Para configurar isso, crie uma conta proxy para os usuários do Windows se conectarem e configure essa conta para que os usuários e grupos sejam mapeados para as contas MySQL apropriadas (`local_wlad`, `local_dev`, `local_admin`). Além disso, conceda às contas MySQL os privilégios apropriados às operações que precisam realizar. As instruções a seguir usam `win_proxy` como a conta proxy e `local_wlad`, `local_dev` e `local_admin` como as contas proxy.

1. Crie a conta MySQL proxy:

   ```
   CREATE USER win_proxy
     IDENTIFIED WITH  authentication_windows
     AS 'local_user = local_wlad,
         MyDomain\\domain_user = local_wlad,
         MyDomain\\Developers = local_dev,
         BUILTIN\\Administrators = local_admin';
   ```

2. Para que a proxy funcione, as contas proxy devem existir, então crie-as:

   ```
   CREATE USER local_wlad
     IDENTIFIED WITH mysql_no_login;
   CREATE USER local_dev
     IDENTIFIED WITH mysql_no_login;
   CREATE USER local_admin
     IDENTIFIED WITH mysql_no_login;
   ```

As contas proxy utilizam o plugin de autenticação `mysql_no_login` para impedir que os clientes usem as contas para fazer login diretamente no servidor MySQL. Em vez disso, espera-se que os usuários que se autentiquem usando o Windows usem a conta proxy `win_proxy`. (Isso pressupõe que o plugin esteja instalado. Para instruções, consulte a Seção 8.4.1.8, “Autenticação Plugável sem Login”.) Para métodos alternativos de proteção das contas proxy contra o uso direto, consulte Como Proteger o Login Direto em Contas Proxy.

Você também deve executar as declarações `GRANT` (não mostradas) que concedam a cada conta proxy os privilégios necessários para o acesso ao MySQL.

3. Conceda à conta proxy o privilégio `PROXY` para cada conta proxy:

```
   GRANT PROXY ON local_wlad TO win_proxy;
   GRANT PROXY ON local_dev TO win_proxy;
   GRANT PROXY ON local_admin TO win_proxy;
   ```

Agora, os usuários do Windows `local_user` e `MyDomain\domain_user` podem se conectar ao servidor MySQL como `win_proxy` e, ao serem autenticados, terão os privilégios da conta fornecidos na string de autenticação (neste caso, `local_wlad`). Um usuário no grupo `MyDomain\Developers` que se conecta como `win_proxy` tem os privilégios da conta `local_dev`. Um usuário no grupo `BUILTIN\Administrators` tem os privilégios da conta `local_admin`.

Para configurar a autenticação de modo que todos os usuários do Windows que não têm sua própria conta MySQL passem por uma conta proxy, substitua a conta proxy padrão (`''@''`) pela `win_proxy` nas instruções anteriores. Para informações sobre contas proxy padrão, consulte a Seção 8.2.19, “Usuários Proxy”.

Observação

Se sua instalação do MySQL tiver usuários anônimos, eles podem entrar em conflito com o usuário proxy padrão. Para mais informações sobre esse problema e maneiras de lidar com ele, consulte Conflitos de Usuário Proxy e Usuário Anônimo Padrão.

Para usar o plugin de autenticação do Windows com as cadeias de conexão Connector/NET no Connector/NET 9.5 e versões posteriores, consulte Autenticação do Connector/NET.