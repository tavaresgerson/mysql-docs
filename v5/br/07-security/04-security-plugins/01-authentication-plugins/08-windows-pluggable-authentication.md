#### 6.4.1.8 Autenticação Plugável no Windows

Nota

A autenticação plugável do Windows é uma extensão incluída na MySQL Enterprise Edition, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

A Edição Empresarial do MySQL para Windows suporta um método de autenticação que realiza autenticação externa no Windows, permitindo que o MySQL Server use serviços nativos do Windows para autenticar conexões de clientes. Usuários que estiveram autenticados no Windows podem se conectar a partir de programas clientes do MySQL ao servidor com base nas informações de seu ambiente, sem precisar especificar uma senha adicional.

O cliente e o servidor trocam pacotes de dados no aperto de mão de autenticação. Como resultado dessa troca, o servidor cria um objeto de contexto de segurança que representa a identidade do cliente no sistema operacional Windows. Essa identidade inclui o nome da conta do cliente. A autenticação plugável do Windows usa a identidade do cliente para verificar se é uma conta específica ou um membro de um grupo. Por padrão, a negociação usa o Kerberos para autenticar, e depois o NTLM se o Kerberos estiver indisponível.

A autenticação plugável do Windows oferece essas capacidades:

- Autenticação externa: a autenticação do Windows permite que o MySQL Server aceite conexões de usuários definidos fora das tabelas de concessão do MySQL que tenham iniciado sessão no Windows.

- Suporte ao usuário proxy: a autenticação do Windows pode retornar ao MySQL um nome de usuário diferente do nome de usuário externo passado pelo programa cliente. Isso significa que o plugin pode retornar o usuário MySQL que define os privilégios que o usuário externo autenticado no Windows deve ter. Por exemplo, um usuário do Windows chamado `joe` pode se conectar e ter os privilégios de um usuário do MySQL chamado `desenvolvedor`.

A tabela a seguir mostra os nomes dos arquivos de plugin e biblioteca. O arquivo deve estar localizado no diretório nomeado pela variável de sistema `plugin_dir`.

**Tabela 6.14 Nomes de plugins e bibliotecas para autenticação no Windows**

<table summary="Nomes para os plugins e o arquivo de biblioteca usados para autenticação de senha do Windows."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Plugin ou arquivo</th> <th>Nome do Plugin ou do Arquivo</th> </tr></thead><tbody><tr> <td>Plugin no lado do servidor</td> <td>[[<code class="literal">authentication_windows</code>]]</td> </tr><tr> <td>Plugin no lado do cliente</td> <td>[[<code class="literal">authentication_windows_client</code>]]</td> </tr><tr> <td>Arquivo da biblioteca</td> <td>[[<code class="filename">authentication_windows.dll</code>]]</td> </tr></tbody></table>

O arquivo da biblioteca inclui apenas o plugin do lado do servidor. O plugin do lado do cliente está integrado à biblioteca de clientes `libmysqlclient`.

O plugin de autenticação do Windows no lado do servidor está incluído apenas na Edição Empresarial do MySQL. Ele não está incluído nas distribuições comunitárias do MySQL. O plugin no lado do cliente está incluído em todas as distribuições, incluindo as comunitárias. Isso permite que clientes de qualquer distribuição se conectem a um servidor que tenha o plugin no lado do servidor carregado.

As seções a seguir fornecem informações de instalação e uso específicas para autenticação plugável do Windows:

- Instalando Autenticação Pluggable do Windows
- Desinstalação do Autenticação Conectada ao Windows
- Usando Autenticação Conectada a Windows

Para informações gerais sobre autenticação plugável no MySQL, consulte Seção 6.2.13, “Autenticação Plugável”. Para informações sobre usuários proxy, consulte Seção 6.2.14, “Usuários Proxy”.

##### Instalando Autenticação Conectada ao Windows

Esta seção descreve como instalar o plugin de autenticação do Windows no lado do servidor. Para informações gerais sobre como instalar plugins, consulte Seção 5.5.1, “Instalando e Desinstalando Plugins”.

Para que o plugin possa ser usado pelo servidor, o arquivo da biblioteca do plugin deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin definindo o valor de `plugin_dir` durante o início do servidor.

Para carregar o plugin na inicialização do servidor, use a opção `--plugin-load-add` para nomear o arquivo da biblioteca que o contém. Com esse método de carregamento de plugins, a opção deve ser fornecida toda vez que o servidor for iniciado. Por exemplo, coloque essas linhas no arquivo `my.cnf` do servidor:

```sql
[mysqld]
plugin-load-add=authentication_windows.dll
```

Depois de modificar o `my.cnf`, reinicie o servidor para que as novas configurações entrem em vigor.

Alternativamente, para carregar o plugin em tempo de execução, use esta declaração:

```sql
INSTALL PLUGIN authentication_windows SONAME 'authentication_windows.dll';
```

`INSTALE O PLUGIN` carrega o plugin imediatamente e também o registra na tabela `mysql.plugins` do sistema para que o servidor o carregue em cada inicialização normal subsequente, sem a necessidade de `--plugin-load-add`.

Para verificar a instalação do plugin, examine a tabela Schema de Informações `PLUGINS` ou use a declaração `SHOW PLUGINS` (consulte Seção 5.5.2, “Obtendo Informações de Plugins do Servidor”). Por exemplo:

```sql
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE '%windows%';
+------------------------+---------------+
| PLUGIN_NAME            | PLUGIN_STATUS |
+------------------------+---------------+
| authentication_windows | ACTIVE        |
+------------------------+---------------+
```

Se o plugin não conseguir se inicializar, verifique o log de erro do servidor para obter mensagens de diagnóstico.

Para associar contas do MySQL ao plugin de autenticação do Windows, consulte Usando a autenticação de plug-in do Windows. O controle adicional do plugin é fornecido pelas variáveis de sistema `authentication_windows_use_principal_name` e `authentication_windows_log_level`. Consulte Seção 5.1.7, “Variáveis de sistema do servidor”.

##### Desinstalação do Windows Pluggable Authentication

O método usado para desinstalar o plugin de autenticação do Windows depende de como você o instalou:

- Se você instalou o plugin na inicialização do servidor usando a opção `--plugin-load-add`, reinicie o servidor sem essa opção.

- Se você instalou o plugin durante a execução usando uma declaração `INSTALL PLUGIN`, ele permanece instalado após reinicializações do servidor. Para desinstalá-lo, use `UNINSTALL PLUGIN`:

  ```sql
  UNINSTALL PLUGIN authentication_windows;
  ```

Além disso, remova quaisquer opções de inicialização que definam variáveis de sistema relacionadas a plugins do Windows.

##### Usando Autenticação Conectada ao Windows

O plugin de autenticação do Windows suporta o uso de contas MySQL, de modo que os usuários que se cadastrarem no Windows possam se conectar ao servidor MySQL sem precisar especificar uma senha adicional. Assume-se que o servidor esteja em execução com o plugin do lado do servidor habilitado, conforme descrito em Instalando Autenticação Personalizável do Windows. Uma vez que o DBA tenha habilitado o plugin do lado do servidor e configurado as contas para usá-lo, os clientes podem se conectar usando essas contas sem nenhuma outra configuração necessária por parte deles.

Para referenciar o plugin de autenticação do Windows na cláusula `IDENTIFIED WITH` de uma declaração `CREATE USER` (create-user.html), use o nome `authentication_windows`. Suponha que os usuários do Windows `Rafal` e `Tasha` devem ter permissão para se conectar ao MySQL, assim como qualquer usuário no grupo `Administradores` ou `Usuários com Poder`. Para configurar isso, crie uma conta MySQL chamada `sql_admin` que use o plugin de autenticação do Windows:

```sql
CREATE USER sql_admin
  IDENTIFIED WITH authentication_windows
  AS 'Rafal, Tasha, Administrators, "Power Users"';
```

O nome do plugin é `authentication_windows`. A string que segue a palavra-chave `AS` é a string de autenticação. Ela especifica que os usuários do Windows chamados `Rafal` ou `Tasha` têm permissão para se autenticar no servidor como o usuário MySQL `sql_admin`, assim como qualquer usuário do Windows no grupo `Administradores` ou `Usuários com Poder`. O nome do grupo `Administrators` contém um espaço, então ele deve ser citado com caracteres de aspas duplas.

Depois de criar a conta `sql_admin`, um usuário que tenha iniciado sessão no Windows pode tentar se conectar ao servidor usando essa conta:

```sql
C:\> mysql --user=sql_admin
```

Aqui, não é necessário fornecer uma senha. O plugin `authentication_windows` usa a API de segurança do Windows para verificar qual usuário do Windows está se conectando. Se esse usuário for chamado de `Rafal` ou `Tasha` ou for membro do grupo `Administradores` ou `Usuários com Poder`, o servidor concede o acesso e o cliente é autenticado como `sql_admin` e possui os privilégios concedidos à conta `sql_admin`. Caso contrário, o servidor nega o acesso.

A sintaxe da string de autenticação para o plugin de autenticação do Windows segue estas regras:

- A cadeia consiste em uma ou mais mapeamentos de usuário separados por vírgulas.

- Cada mapeamento de usuário associa um nome de usuário ou grupo do Windows com um nome de usuário do MySQL:

  ```sql
  win_user_or_group_name=mysql_user_name
  win_user_or_group_name
  ```

  Para a sintaxe do último caso, sem o valor de `mysql_user_name`, o valor implícito é o usuário MySQL criado pela instrução `CREATE USER`. Assim, essas instruções são equivalentes:

  ```sql
  CREATE USER sql_admin
    IDENTIFIED WITH authentication_windows
    AS 'Rafal, Tasha, Administrators, "Power Users"';

  CREATE USER sql_admin
    IDENTIFIED WITH authentication_windows
    AS 'Rafal=sql_admin, Tasha=sql_admin, Administrators=sql_admin,
        "Power Users"=sql_admin';
  ```

- Cada caractere barra invertida (`\`) em um valor deve ser duplicado, pois a barra invertida é o caractere de escape nas strings do MySQL.

- Espaços de início e de fim não dentro de aspas duplas são ignorados.

- Os valores não citados de *`win_user_or_group_name`* e *`mysql_user_name`* podem conter qualquer coisa, exceto sinal de igual, vírgula ou espaço.

- Se um valor de *`win_user_or_group_name`* e ou *`mysql_user_name`* estiver entre aspas duplas, tudo entre as aspas faz parte do valor. Isso é necessário, por exemplo, se o nome contiver caracteres de espaço. Todos os caracteres entre aspas são legais, exceto aspas duplas e barra invertida. Para incluir qualquer um desses caracteres, escape-o com uma barra invertida.

- Os valores de `win_user_or_group_name` usam a sintaxe convencional para princípios do Windows, sejam eles locais ou em um domínio. Exemplos (observe o duplicar de barras invertidas):

  ```sql
  domain\\user
  .\\user
  domain\\group
  .\\group
  BUILTIN\\WellKnownGroup
  ```

Quando invocado pelo servidor para autenticar um cliente, o plugin verifica a string de autenticação de esquerda para direita em busca de um usuário ou grupo que corresponda ao usuário do Windows. Se houver uma correspondência, o plugin retorna o nome do *`mysql_user_name`* correspondente ao servidor MySQL. Se não houver correspondência, a autenticação falha.

Uma correspondência de nome de usuário tem preferência sobre uma correspondência de nome de grupo. Suponha que o usuário do Windows chamado `win_user` seja membro do `win_group` e que a string de autenticação seja a seguinte:

```sql
'win_group = sql_user1, win_user = sql_user2'
```

Quando o `win_user` se conecta ao servidor MySQL, há uma correspondência tanto com `win_group` quanto com `win_user`. O plugin autentica o usuário como `sql_user2` porque a correspondência de usuário mais específica tem precedência sobre a correspondência de grupo, mesmo que o grupo esteja listado primeiro na string de autenticação.

A autenticação do Windows sempre funciona para conexões do mesmo computador em que o servidor está sendo executado. Para conexões entre computadores, ambos os computadores devem estar registrados no Microsoft Active Directory. Se estiverem no mesmo domínio do Windows, não é necessário especificar um nome de domínio. Também é possível permitir conexões de um domínio diferente, como neste exemplo:

```sql
CREATE USER sql_accounting
  IDENTIFIED WITH authentication_windows
  AS 'SomeDomain\\Accounting';
```

Aqui `SomeDomain` é o nome do outro domínio. O caractere barra invertida é duplicado porque é o caractere de escape MySQL dentro das strings.

O MySQL suporta o conceito de usuários proxy, onde um cliente pode se conectar e autenticar-se no servidor MySQL usando uma única conta, mas, enquanto conectado, possui os privilégios de outra conta (veja Seção 6.2.14, “Usuários Proxy”). Suponha que você queira que os usuários do Windows se conectem usando um único nome de usuário, mas sejam mapeados com base nos nomes de usuário e grupos do Windows para contas MySQL específicas da seguinte forma:

- Os usuários locais `local_user` e `MyDomain\domain_user` do Windows devem ser mapeados para a conta MySQL `local_wlad`.

- Os usuários do grupo de domínio `MyDomain\Developers` devem ser mapeados para a conta MySQL `local_dev`.

- Os administradores de máquinas locais devem mapear para a conta MySQL `local_admin`.

Para configurar isso, crie uma conta proxy para que os usuários do Windows se conectem e configure essa conta para que os usuários e grupos sejam mapeados para as contas MySQL apropriadas (`local_wlad`, `local_dev`, `local_admin`). Além disso, conceda aos perfis MySQL os privilégios apropriados para as operações que eles precisam realizar. As instruções a seguir usam `win_proxy` como a conta proxy e `local_wlad`, `local_dev` e `local_admin` como as contas proxy.

1. Crie a conta de proxy do MySQL:

   ```sql
   CREATE USER win_proxy
     IDENTIFIED WITH  authentication_windows
     AS 'local_user = local_wlad,
         MyDomain\\domain_user = local_wlad,
         MyDomain\\Developers = local_dev,
         BUILTIN\\Administrators = local_admin';
   ```

2. Para que o redirecionamento funcione, as contas redirecionadas devem existir, então crie-as:

   ```sql
   CREATE USER local_wlad
     IDENTIFIED WITH mysql_no_login;
   CREATE USER local_dev
     IDENTIFIED WITH mysql_no_login;
   CREATE USER local_admin
     IDENTIFIED WITH mysql_no_login;
   ```

   As contas proxy utilizam o plugin de autenticação `mysql_no_login` para impedir que os clientes usem as contas para fazer login diretamente no servidor MySQL. Em vez disso, espera-se que os usuários que se autentiquem usando o Windows usem a conta proxy `win_proxy`. (Isso pressupõe que o plugin esteja instalado. Para instruções, consulte Seção 6.4.1.10, “Autenticação Pluggable sem Login”.) Para métodos alternativos de proteção de contas proxy contra uso direto, consulte Prevenção de Login Direto em Contas Proxy.

   Você também deve executar as declarações `GRANT` (não mostradas) que concedem a cada conta proxy os privilégios necessários para o acesso ao MySQL.

3. Atribua ao `PROXY` o privilégio à conta proxy para cada conta proxy:

   ```sql
   GRANT PROXY ON local_wlad TO win_proxy;
   GRANT PROXY ON local_dev TO win_proxy;
   GRANT PROXY ON local_admin TO win_proxy;
   ```

Agora, os usuários `local_user` e `MyDomain\domain_user` do Windows podem se conectar ao servidor MySQL como `win_proxy` e, após autenticados, terão os privilégios da conta fornecida na string de autenticação (neste caso, `local_wlad`). Um usuário do grupo `MyDomain\Developers` que se conecta como `win_proxy` tem os privilégios da conta `local_dev`. Um usuário do grupo `BUILTIN\Administrators` tem os privilégios da conta `local_admin`.

Para configurar a autenticação de modo que todos os usuários do Windows que não tenham sua própria conta MySQL passem por uma conta proxy, substitua a conta proxy padrão (`''@''`) pelo `win_proxy` nas instruções anteriores. Para obter informações sobre contas de proxy padrão, consulte Seção 6.2.14, “Usuários Proxy”.

Nota

Se a sua instalação do MySQL tiver usuários anônimos, eles podem entrar em conflito com o usuário padrão do proxy. Para obter mais informações sobre esse problema e maneiras de resolvê-lo, consulte Conflitos entre o Usuário Padrão do Proxy e o Usuário Anônimo.

Para usar o plugin de autenticação do Windows com as cadeias de conexão Connector/NET no Connector/NET 8.0 e versões posteriores, consulte Autenticação do Connector/NET.
