#### 6.4.1.7 Autenticação Pluggable PAM (PAM)

Nota

A autenticação pluggable do PAM é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

A Edição Empresarial do MySQL suporta um método de autenticação que permite que o MySQL Server use o PAM (Módulos de Autenticação Conectam) para autenticar os usuários do MySQL. O PAM permite que um sistema use uma interface padrão para acessar vários tipos de métodos de autenticação, como senhas tradicionais do Unix ou um diretório LDAP.

A autenticação pluggable do PAM oferece essas capacidades:

- Autenticação externa: a autenticação PAM permite que o MySQL Server aceite conexões de usuários definidos fora das tabelas de concessão do MySQL e que se autentiquem usando métodos suportados pelo PAM.

- Suporte ao usuário proxy: a autenticação PAM pode retornar ao MySQL um nome de usuário diferente do nome de usuário externo passado pelo programa cliente, com base nos grupos PAM dos quais o usuário externo é membro e na string de autenticação fornecida. Isso significa que o plugin pode retornar o usuário MySQL que define os privilégios que o usuário externo autenticado pelo PAM deve ter. Por exemplo, um usuário do sistema operacional chamado `joe` pode se conectar e ter os privilégios de um usuário MySQL chamado `developer`.

A autenticação pluggable do PAM foi testada no Linux e no macOS.

A tabela a seguir mostra os nomes dos arquivos de plugin e biblioteca. O sufixo do nome do arquivo pode variar no seu sistema. O arquivo deve estar localizado no diretório nomeado pela variável de sistema `plugin_dir`. Para informações sobre instalação, consulte Instalando Autenticação Pluggable PAM.

**Tabela 6.13 Nomes de plugins e bibliotecas para autenticação PAM**

<table summary="Nomes para os plugins e o arquivo de biblioteca usados para autenticação de senha do PAM."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Plugin ou arquivo</th> <th>Nome do Plugin ou do Arquivo</th> </tr></thead><tbody><tr> <td>Plugin no lado do servidor</td> <td>[[<code class="literal">authentication_pam</code>]]</td> </tr><tr> <td>Plugin no lado do cliente</td> <td>[[<code class="literal">mysql_clear_password</code>]]</td> </tr><tr> <td>Arquivo da biblioteca</td> <td>[[<code class="filename">authentication_pam.so</code>]]</td> </tr></tbody></table>

O plugin de criptografia `mysql_clear_password` do lado do cliente que se comunica com o plugin PAM do lado do servidor está integrado à biblioteca de clientes `libmysqlclient` e está incluído em todas as distribuições, incluindo as distribuições comunitárias. A inclusão do plugin de criptografia do lado do cliente em todas as distribuições do MySQL permite que clientes de qualquer distribuição se conectem a um servidor que tenha o plugin PAM do lado do servidor carregado.

As seções a seguir fornecem informações de instalação e uso específicas para a autenticação plugável PAM:

- Como funciona a autenticação PAM de usuários do MySQL
- Instalando Autenticação Conectada (PAM)
- Desinstalação do PAM Pluggable Authentication
- Usando autenticação plugável PAM
- Autenticação de senha PAM Unix sem usuários com proxy
- Autenticação PAM LDAP sem usuários de proxy
- Autenticação de senha PAM Unix com usuários de proxy e mapeamento de grupos
- Acesso de Autenticação PAM ao Armazenamento de Senhas Unix
- Depuração da Autenticação PAM

Para informações gerais sobre autenticação plugável no MySQL, consulte Seção 6.2.13, “Autenticação Plugável”. Para informações sobre o plugin `mysql_clear_password`, consulte Seção 6.4.1.6, “Autenticação Plugável em Texto Aberto no Lado do Cliente”. Para informações sobre informações de usuários proxy, consulte Seção 6.2.14, “Usuários Proxy”.

##### Como funciona a autenticação PAM de usuários do MySQL

Esta seção fornece uma visão geral de como o MySQL e o PAM trabalham juntos para autenticar os usuários do MySQL. Para exemplos que mostram como configurar contas do MySQL para usar serviços específicos do PAM, consulte Usando PAM Pluggable Authentication.

1. O programa cliente e o servidor se comunicam, com o cliente enviando ao servidor o nome de usuário do cliente (o nome de usuário do sistema operacional por padrão) e a senha:

   - O nome de usuário do cliente é o nome de usuário externo.
   - Para contas que utilizam o plugin de autenticação no lado do servidor do PAM, o plugin correspondente no lado do cliente é `mysql_clear_password`. Esse plugin no lado do cliente não realiza a criptografia da senha, com o resultado de que o cliente envia a senha para o servidor como texto simples.

2. O servidor encontra uma conta MySQL correspondente com base no nome do usuário externo e no host a partir do qual o cliente se conecta. O plugin PAM usa as informações passadas a ele pelo MySQL Server (como nome de usuário, nome do host, senha e string de autenticação). Quando você define uma conta MySQL que autentica usando PAM, a string de autenticação contém:

   - Um nome de serviço do PAM, que é um nome que o administrador do sistema pode usar para se referir a um método de autenticação para uma aplicação específica. Pode haver várias aplicações associadas a uma única instância do servidor de banco de dados, portanto, a escolha do nome do serviço é deixada ao desenvolvedor da aplicação SQL.

   - Opcionalmente, se a proxy for usada, uma mapeamento de grupos PAM para nomes de usuário do MySQL.

3. O plugin usa o serviço PAM nomeado na string de autenticação para verificar as credenciais do usuário e retorna `'Autenticação bem-sucedida, nome de usuário é user_name'` ou `'Autenticação falhou'`. A senha deve ser apropriada para o repositório de senhas usado pelo serviço PAM. Exemplos:

   - Para senhas tradicionais do Unix, o serviço consulta as senhas armazenadas no arquivo `/etc/shadow`.

   - Para o LDAP, o serviço busca senhas armazenadas em um diretório LDAP.

   Se a verificação das credenciais falhar, o servidor recusa a conexão.

4. Caso contrário, a string de autenticação indica se o encaminhamento ocorre. Se a string não contiver mapeamento de grupo PAM, o encaminhamento não ocorrerá. Nesse caso, o nome do usuário do MySQL é o mesmo do nome do usuário externo.

5. Caso contrário, o encaminhamento é indicado com base na mapeo do grupo PAM, com o nome do usuário do MySQL determinado com base no primeiro grupo correspondente na lista de mapeo. O significado de "grupo PAM" depende do serviço PAM. Exemplos:

   - Para senhas tradicionais do Unix, os grupos são grupos Unix definidos no arquivo `/etc/group`, possivelmente complementados com informações adicionais do PAM em um arquivo como `/etc/security/group.conf`.

   - Para o LDAP, os grupos são grupos LDAP definidos em um diretório LDAP.

   Se o usuário proxy (o usuário externo) tiver o privilégio `PROXY` para o nome do usuário MySQL proxy, o proxy ocorrerá, com o usuário proxy assumindo os privilégios do usuário proxy.

##### Instalando PAM Pluggable Authentication

Esta seção descreve como instalar o plugin de autenticação PAM no lado do servidor. Para informações gerais sobre como instalar plugins, consulte Seção 5.5.1, “Instalando e Desinstalando Plugins”.

Para que o plugin possa ser usado pelo servidor, o arquivo da biblioteca do plugin deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin definindo o valor de `plugin_dir` durante o início do servidor.

O nome de base do arquivo da biblioteca de plugins é `authentication_pam`. O sufixo do nome do arquivo difere de acordo com a plataforma (por exemplo, `.so` para sistemas Unix e sistemas semelhantes ao Unix, `.dll` para Windows).

Para carregar o plugin no início do servidor, use a opção `--plugin-load-add` para nomear o arquivo da biblioteca que o contém. Com esse método de carregamento de plugins, a opção deve ser fornecida toda vez que o servidor for iniciado. Por exemplo, coloque essas linhas no arquivo `my.cnf` do servidor, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```sql
[mysqld]
plugin-load-add=authentication_pam.so
```

Depois de modificar o `my.cnf`, reinicie o servidor para que as novas configurações entrem em vigor.

Como alternativa, para carregar o plugin em tempo de execução, use esta declaração, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```sql
INSTALL PLUGIN authentication_pam SONAME 'authentication_pam.so';
```

`INSTALE O PLUGIN` carrega o plugin imediatamente e também o registra na tabela `mysql.plugins` do sistema para que o servidor o carregue em cada inicialização normal subsequente, sem a necessidade de `--plugin-load-add`.

Para verificar a instalação do plugin, examine a tabela Schema de Informações `PLUGINS` ou use a declaração `SHOW PLUGINS` (consulte Seção 5.5.2, “Obtendo Informações de Plugins do Servidor”). Por exemplo:

```sql
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE '%pam%';
+--------------------+---------------+
| PLUGIN_NAME        | PLUGIN_STATUS |
+--------------------+---------------+
| authentication_pam | ACTIVE        |
+--------------------+---------------+
```

Se o plugin não conseguir se inicializar, verifique o log de erro do servidor para obter mensagens de diagnóstico.

Para associar contas do MySQL ao plugin PAM, consulte Usando o PAM Pluggable Authentication.

##### Desinstalação do PAM Pluggable Authentication

O método usado para desinstalar o plugin de autenticação PAM depende de como você o instalou:

- Se você instalou o plugin na inicialização do servidor usando a opção `--plugin-load-add`, reinicie o servidor sem essa opção.

- Se você instalou o plugin durante a execução usando uma declaração `INSTALL PLUGIN`, ele permanece instalado após reinicializações do servidor. Para desinstalá-lo, use `UNINSTALL PLUGIN`:

  ```sql
  UNINSTALL PLUGIN authentication_pam;
  ```

##### Usando PAM Pluggable Authentication

Esta seção descreve, de forma geral, como usar o plugin de autenticação PAM para conectar programas clientes do MySQL ao servidor. As seções seguintes fornecem instruções para usar a autenticação PAM de maneiras específicas. Assume-se que o servidor está em execução com o plugin de PAM de servidor habilitado, conforme descrito em Instalando Autenticação PAM Pluggable.

Para se referir ao plugin de autenticação PAM na cláusula `IDENTIFIED WITH` de uma declaração `CREATE USER`, use o nome `authentication_pam`. Por exemplo:

```sql
CREATE USER user
  IDENTIFIED WITH authentication_pam
  AS 'auth_string';
```

A string de autenticação especifica os seguintes tipos de informações:

- O nome do serviço do PAM (consulte Como funciona a autenticação do PAM de usuários do MySQL). Os exemplos na discussão a seguir usam o nome do serviço `mysql-unix` para autenticação usando senhas tradicionais do Unix e `mysql-ldap` para autenticação usando LDAP.

- Para suporte a proxy, o PAM fornece uma maneira para um módulo PAM retornar ao servidor um nome de usuário MySQL diferente do nome de usuário externo passado pelo programa cliente ao se conectar ao servidor. Use a string de autenticação para controlar a correspondência entre nomes de usuário externos e nomes de usuário MySQL. Se você deseja aproveitar as capacidades do usuário proxy, a string de autenticação deve incluir esse tipo de mapeamento.

Por exemplo, se uma conta usa o nome do serviço PAM `mysql-unix` e deve mapear usuários do sistema operacional nos grupos PAM `root` e `users` para os usuários MySQL `developer` e `data_entry`, respectivamente, use uma declaração como esta:

```sql
CREATE USER user
  IDENTIFIED WITH authentication_pam
  AS 'mysql-unix, root=developer, users=data_entry';
```

A sintaxe da string de autenticação para o plugin de autenticação PAM segue estas regras:

- A cadeia consiste em um nome de serviço PAM, opcionalmente seguido de uma lista de mapeamento de grupo PAM, que consiste em um ou mais pares de palavras-chave/valores, cada um especificando um nome de grupo PAM e um nome de usuário MySQL:

  ```sql
  pam_service_name[,pam_group_name=mysql_user_name]...
  ```

  O plugin analisa a string de autenticação para cada tentativa de conexão que utiliza a conta. Para minimizar o overhead, mantenha a string o mais curta possível.

- Cada par `pam_group_name=mysql_user_name` deve ser precedido por uma vírgula.

- Espaços de início e de fim não dentro de aspas duplas são ignorados.

- Os valores não citados de *`pam_service_name`*, *`pam_group_name`* e *`mysql_user_name`* podem conter qualquer coisa, exceto sinal de igual, vírgula ou espaço.

- Se um valor de *`pam_service_name`*, *`pam_group_name`* ou *`mysql_user_name`* for citado com aspas duplas, tudo entre as aspas faz parte do valor. Isso é necessário, por exemplo, se o valor contiver caracteres de espaço. Todos os caracteres são legais, exceto as aspas duplas e a barra invertida (`\`). Para incluir qualquer um desses caracteres, escape-o com uma barra invertida.

Se o plugin autenticar com sucesso o nome do usuário externo (o nome passado pelo cliente), ele procura uma lista de mapeamento de grupo PAM na string de autenticação e, se presente, usa-a para retornar um nome de usuário MySQL diferente ao servidor MySQL com base no qual o grupo PAM o usuário externo é membro:

- Se a string de autenticação não contiver uma lista de mapeamento de grupo PAM, o plugin retorna o nome externo.

- Se a string de autenticação contiver uma lista de mapeamento de grupo PAM, o plugin examina cada par `pam_group_name=mysql_user_name` na lista da esquerda para a direita e tenta encontrar uma correspondência para o valor *`pam_group_name`* em um diretório não MySQL dos grupos atribuídos ao usuário autenticado e retorna *`mysql_user_name`* para a primeira correspondência encontrada. Se o plugin não encontrar nenhuma correspondência para nenhum grupo PAM, ele retorna o nome externo. Se o plugin não for capaz de procurar um grupo em um diretório, ele ignora a lista de mapeamento de grupo PAM e retorna o nome externo.

As seções a seguir descrevem como configurar vários cenários de autenticação que utilizam o plugin de autenticação PAM:

- Sem usuários proxy. Isso usa o PAM apenas para verificar nomes de login e senhas. Todo usuário externo autorizado a se conectar ao MySQL Server deve ter uma conta MySQL correspondente que seja definida para usar autenticação PAM. (Para que uma conta MySQL de `'user_name'@'host_name'` corresponda ao usuário externo, *`user_name`* deve ser o nome do usuário externo e *`host_name`* deve corresponder ao host a partir do qual o cliente se conecta.) A autenticação pode ser realizada por vários métodos suportados pelo PAM. A discussão posterior mostra como autenticar as credenciais do cliente usando senhas tradicionais do Unix e senhas no LDAP.

  A autenticação PAM, quando não realizada por meio de usuários proxy ou grupos PAM, exige que o nome do usuário do MySQL seja o mesmo do nome do usuário do sistema operacional. Os nomes de usuário do MySQL são limitados a 32 caracteres (consulte Seção 6.2.3, “Tabelas de Concessão”), o que limita a autenticação PAM não proxy a contas Unix com nomes de no máximo 32 caracteres.

- Apenas para usuários proxy, com mapeamento de grupo PAM. Para este cenário, crie uma ou mais contas MySQL que definam diferentes conjuntos de privilégios. (Idealmente, ninguém deve se conectar diretamente usando essas contas.) Em seguida, defina um usuário padrão que se autentique através do PAM, usando algum esquema de mapeamento (geralmente baseado nos grupos PAM externos dos quais os usuários são membros) para mapear todos os nomes de usuário externos para as poucas contas MySQL que possuem os conjuntos de privilégios. Qualquer cliente que se conecte e especifique um nome de usuário externo como o nome de usuário do cliente será mapeado para uma das contas MySQL e usará seus privilégios. A discussão mostra como configurar isso usando senhas tradicionais do Unix, mas outros métodos PAM, como LDAP, podem ser usados.

Variações desses cenários são possíveis:

- Você pode permitir que alguns usuários façam login diretamente (sem proxy) e exigir que outros se conectem por meio de contas de proxy.

- Você pode usar um método de autenticação PAM para alguns usuários e outro método para outros usuários, usando nomes de serviços PAM diferentes entre suas contas autenticadas por PAM. Por exemplo, você pode usar o serviço PAM `mysql-unix` para alguns usuários e `mysql-ldap` para outros.

Os exemplos fazem as seguintes suposições. Você pode precisar fazer alguns ajustes se o seu sistema estiver configurado de maneira diferente.

- O nome de login e a senha são `antonio` e `antonio_password`, respectivamente. Mude esses valores para corresponder ao usuário que deseja autenticar.

- O diretório de configuração do PAM é `/etc/pam.d`.

- O nome do serviço PAM corresponde ao método de autenticação (`mysql-unix` ou `mysql-ldap` nesta discussão). Para usar um serviço PAM específico, você deve configurar um arquivo PAM com o mesmo nome no diretório de configuração do PAM (criando o arquivo se ele não existir). Além disso, você deve nomear o serviço PAM na string de autenticação da instrução `CREATE USER` para qualquer conta que autentique usando esse serviço PAM.

O plugin de autenticação PAM verifica no momento da inicialização se o valor do ambiente `AUTHENTICATION_PAM_LOG` está definido no ambiente de inicialização do servidor. Se estiver, o plugin habilita a gravação de mensagens de diagnóstico no saída padrão. Dependendo de como o servidor é iniciado, a mensagem pode aparecer na consola ou no log de erros. Essas mensagens podem ser úteis para depurar problemas relacionados ao PAM que ocorrem quando o plugin realiza a autenticação. Para mais informações, consulte Depuração da Autenticação PAM.

##### Autenticação de senha PAM Unix sem usuários com proxy

Este cenário de autenticação utiliza o PAM para verificar usuários externos definidos em termos de nomes de usuário do sistema operacional e senhas Unix, sem proxy. Todos os usuários externos autorizados a se conectar ao MySQL Server devem ter uma conta MySQL correspondente definida para usar a autenticação PAM através do armazenamento tradicional de senhas Unix.

Nota

As senhas tradicionais do Unix são verificadas usando o arquivo `/etc/shadow`. Para obter informações sobre possíveis problemas relacionados a este arquivo, consulte Autenticação PAM para Acesso à Armazenamento de Senhas do Unix.

1. Verifique se a autenticação Unix permite logins no sistema operacional com o nome de usuário `antonio` e a senha *`antonio_password`*.

2. Configure o PAM para autenticar as conexões do MySQL usando senhas Unix tradicionais, criando um arquivo de serviço PAM `mysql-unix` chamado `/etc/pam.d/mysql-unix`. O conteúdo do arquivo depende do sistema, então verifique os arquivos relacionados ao login no diretório `/etc/pam.d` para ver como eles estão. No Linux, o arquivo `mysql-unix` pode parecer assim:

   ```sql
   #%PAM-1.0
   auth            include         password-auth
   account         include         password-auth
   ```

   Para o macOS, use `login` em vez de `password-auth`.

   O formato de arquivo PAM pode diferir em alguns sistemas. Por exemplo, em Ubuntu e outros sistemas baseados no Debian, use esses conteúdos de arquivo:

   ```sql
   @include common-auth
   @include common-account
   @include common-session-noninteractive
   ```

3. Crie uma conta MySQL com o mesmo nome de usuário do nome do usuário do sistema operacional e defina-a para autenticação usando o plugin PAM e o serviço PAM `mysql-unix`:

   ```sql
   CREATE USER 'antonio'@'localhost'
     IDENTIFIED WITH authentication_pam
     AS 'mysql-unix';
   GRANT ALL PRIVILEGES
     ON mydb.*
     TO 'antonio'@'localhost';
   ```

   Aqui, a string de autenticação contém apenas o nome do serviço PAM, `mysql-unix`, que autentica senhas Unix.

4. Use o cliente de linha de comando **mysql** para se conectar ao servidor MySQL como `antonio`. Por exemplo:

   ```sql
   $> mysql --user=antonio --password --enable-cleartext-plugin
   Enter password: antonio_password
   ```

   O servidor deve permitir a conexão e a seguinte consulta retorna o resultado conforme mostrado:

   ```sql
   mysql> SELECT USER(), CURRENT_USER(), @@proxy_user;
   +-------------------+-------------------+--------------+
   | USER()            | CURRENT_USER()    | @@proxy_user |
   +-------------------+-------------------+--------------+
   | antonio@localhost | antonio@localhost | NULL         |
   +-------------------+-------------------+--------------+
   ```

   Isso demonstra que o usuário do sistema operacional `antonio` está autenticado e possui os privilégios concedidos ao usuário MySQL `antonio`, e que não houve nenhum redirecionamento.

Nota

O plugin de autenticação `mysql_clear_password` do lado do cliente deixa a senha intacta, então os programas do cliente enviam-na para o servidor MySQL como texto não criptografado. Isso permite que a senha seja passada como está para o PAM. Uma senha não criptografada é necessária para usar a biblioteca PAM do lado do servidor, mas pode ser um problema de segurança em algumas configurações. Essas medidas minimizam o risco:

- Para tornar menos provável o uso acidental do plugin `mysql_clear_password`, os clientes MySQL devem habilitá-lo explicitamente (por exemplo, com a opção `--enable-cleartext-plugin`). Veja Seção 6.4.1.6, “Autenticação com Autenticação de Texto Aberto no Lado do Cliente”.

- Para evitar a exposição da senha com o plugin `mysql_clear_password` ativado, os clientes MySQL devem se conectar ao servidor MySQL usando uma conexão criptografada. Consulte Seção 6.3.1, “Configurando o MySQL para usar conexões criptografadas”.

##### Autenticação PAM LDAP sem usuários de proxy

Este cenário de autenticação utiliza o PAM para verificar usuários externos definidos em termos de nomes de usuário do sistema operacional e senhas LDAP, sem proxy. Todos os usuários externos autorizados a se conectar ao MySQL Server devem ter uma conta MySQL correspondente definida para usar a autenticação PAM através do LDAP.

Para usar a autenticação pluggable PAM LDAP para MySQL, é necessário que os seguintes pré-requisitos sejam atendidos:

- Um servidor LDAP deve estar disponível para que o serviço PAM LDAP possa se comunicar.

- Cada usuário do LDAP que será autenticado pelo MySQL deve estar presente no diretório gerenciado pelo servidor LDAP.

Nota

Outra maneira de usar o LDAP para autenticação de usuários do MySQL é usar os plugins de autenticação específicos do LDAP. Veja Seção 6.4.1.9, “Autenticação Pluggable LDAP”.

Configure o MySQL para autenticação PAM LDAP da seguinte forma:

1. Verifique se a autenticação Unix permite logins no sistema operacional com o nome de usuário `antonio` e a senha *`antonio_password`*.

2. Configure o PAM para autenticar conexões do MySQL usando LDAP criando um arquivo de serviço PAM `mysql-ldap` com o nome `/etc/pam.d/mysql-ldap`. O conteúdo do arquivo depende do sistema, então verifique os arquivos relacionados ao login no diretório `/etc/pam.d` para ver como eles estão. No Linux, o arquivo `mysql-ldap` pode parecer assim:

   ```sql
   #%PAM-1.0
   auth        required    pam_ldap.so
   account     required    pam_ldap.so
   ```

   Se os arquivos de objeto do PAM tiverem um sufixo diferente de `.so` no seu sistema, substitua o sufixo correto.

   O formato de arquivo PAM pode diferir em alguns sistemas.

3. Crie uma conta MySQL com o mesmo nome de usuário do nome de usuário do sistema operacional e defina-a para autenticação usando o plugin PAM e o serviço PAM `mysql-ldap`:

   ```sql
   CREATE USER 'antonio'@'localhost'
     IDENTIFIED WITH authentication_pam
     AS 'mysql-ldap';
   GRANT ALL PRIVILEGES
     ON mydb.*
     TO 'antonio'@'localhost';
   ```

   Aqui, a string de autenticação contém apenas o nome do serviço PAM, `mysql-ldap`, que autentica usando LDAP.

4. Conectar ao servidor é o mesmo descrito em Autenticação de senha PAM Unix sem usuários de proxy.

##### Autenticação de senha PAM Unix com usuários proxy e mapeamento de grupos

O esquema de autenticação descrito aqui utiliza o mapeamento de grupo PAM e o encaminhamento para mapearem usuários do MySQL que se autenticam usando o PAM para outras contas do MySQL que definem diferentes conjuntos de privilégios. Os usuários não se conectam diretamente através das contas que definem os privilégios. Em vez disso, eles se conectam através de uma conta de proxy padrão autenticada usando o PAM, de modo que todos os usuários externos sejam mapeados para as contas do MySQL que possuem os privilégios. Qualquer usuário que se conecte usando a conta do proxy é mapeado para uma dessas contas do MySQL, cujos privilégios determinam as operações de banco de dados permitidas ao usuário externo.

O procedimento mostrado aqui utiliza autenticação de senha Unix. Para usar o LDAP, consulte os primeiros passos de Autenticação PAM LDAP sem Usuários Proxy.

Nota

As senhas tradicionais do Unix são verificadas usando o arquivo `/etc/shadow`. Para obter informações sobre possíveis problemas relacionados a este arquivo, consulte Autenticação PAM para Acesso à Armazenamento de Senhas do Unix.

1. Verifique se a autenticação Unix permite logins no sistema operacional com o nome de usuário `antonio` e a senha *`antonio_password`*.

2. Verifique se `antonio` é membro do grupo PAM `root` ou `users`.

3. Configure o PAM para autenticar o serviço PAM `mysql-unix` por meio de usuários do sistema operacional, criando um arquivo chamado `/etc/pam.d/mysql-unix`. O conteúdo do arquivo depende do sistema, então verifique os arquivos relacionados ao login no diretório `/etc/pam.d` para ver como eles estão. No Linux, o arquivo `mysql-unix` pode parecer assim:

   ```sql
   #%PAM-1.0
   auth            include         password-auth
   account         include         password-auth
   ```

   Para o macOS, use `login` em vez de `password-auth`.

   O formato de arquivo PAM pode diferir em alguns sistemas. Por exemplo, em Ubuntu e outros sistemas baseados no Debian, use esses conteúdos de arquivo:

   ```sql
   @include common-auth
   @include common-account
   @include common-session-noninteractive
   ```

4. Crie um usuário proxy padrão (`''@''`) que mapeie usuários externos do PAM para as contas proxy:

   ```sql
   CREATE USER ''@''
     IDENTIFIED WITH authentication_pam
     AS 'mysql-unix, root=developer, users=data_entry';
   ```

   Aqui, a string de autenticação contém o nome do serviço PAM, `mysql-unix`, que autentica senhas Unix. A string de autenticação também mapeia usuários externos nos grupos PAM `root` e `users` para os nomes de usuário MySQL `developer` e `data_entry`, respectivamente.

   A lista de mapeamento do grupo PAM, seguindo o nome do serviço PAM, é necessária ao configurar usuários proxy. Caso contrário, o plugin não saberá como realizar o mapeamento de nomes de usuários externos para os nomes de usuário MySQL proxy apropriados.

   Nota

   Se a sua instalação do MySQL tiver usuários anônimos, eles podem entrar em conflito com o usuário padrão do proxy. Para obter mais informações sobre esse problema e maneiras de resolvê-lo, consulte Conflitos entre o Usuário Padrão do Proxy e o Usuário Anônimo.

5. Crie as contas proxy e conceda a cada uma delas os privilégios que ela deve ter:

   ```sql
   CREATE USER 'developer'@'localhost'
     IDENTIFIED WITH mysql_no_login;
   CREATE USER 'data_entry'@'localhost'
     IDENTIFIED WITH mysql_no_login;

   GRANT ALL PRIVILEGES
     ON mydevdb.*
     TO 'developer'@'localhost';
   GRANT ALL PRIVILEGES
     ON mydb.*
     TO 'data_entry'@'localhost';
   ```

   As contas proxy utilizam o plugin de autenticação `mysql_no_login` para impedir que os clientes usem as contas para fazer login diretamente no servidor MySQL. Em vez disso, espera-se que os usuários que se autentiquem usando o PAM usem a conta `developer` ou `data_entry` por proxy com base em seu grupo PAM. (Isso pressupõe que o plugin esteja instalado. Para instruções, consulte Seção 6.4.1.10, “Autenticação Pluggable sem Login”.) Para métodos alternativos de proteção de contas proxy contra uso direto, consulte Prevenção de Login Direto em Contas Proxy.

6. Atribua ao `PROXY` o privilégio à conta proxy para cada conta proxy:

   ```sql
   GRANT PROXY
     ON 'developer'@'localhost'
     TO ''@'';
   GRANT PROXY
     ON 'data_entry'@'localhost'
     TO ''@'';
   ```

7. Use o cliente de linha de comando **mysql** para se conectar ao servidor MySQL como `antonio`.

   ```sql
   $> mysql --user=antonio --password --enable-cleartext-plugin
   Enter password: antonio_password
   ```

   O servidor autentica a conexão usando a conta de proxy padrão `''@''`. Os privilégios resultantes para `antonio` dependem dos grupos PAM de que `antonio` é membro. Se `antonio` for membro do grupo PAM `root`, o plugin PAM mapeia `root` para o nome de usuário MySQL `developer` e retorna esse nome para o servidor. O servidor verifica se `''@''` tem o privilégio `PROXY` para `developer` e permite a conexão. A seguinte consulta retorna o resultado conforme mostrado:

   ```sql
   mysql> SELECT USER(), CURRENT_USER(), @@proxy_user;
   +-------------------+---------------------+--------------+
   | USER()            | CURRENT_USER()      | @@proxy_user |
   +-------------------+---------------------+--------------+
   | antonio@localhost | developer@localhost | ''@''        |
   +-------------------+---------------------+--------------+
   ```

   Isso demonstra que o usuário do sistema operacional `antonio` está autenticado para ter os privilégios concedidos ao usuário `developer` do MySQL, e que a proxy é realizada através da conta de proxy padrão.

   Se `antonio` não for membro do grupo PAM `root`, mas sim do grupo PAM `users`, um processo semelhante ocorre, mas o plugin mapeia a associação do grupo PAM `user` ao nome de usuário MySQL `data_entry` e retorna esse nome para o servidor:

   ```sql
   mysql> SELECT USER(), CURRENT_USER(), @@proxy_user;
   +-------------------+----------------------+--------------+
   | USER()            | CURRENT_USER()       | @@proxy_user |
   +-------------------+----------------------+--------------+
   | antonio@localhost | data_entry@localhost | ''@''        |
   +-------------------+----------------------+--------------+
   ```

   Isso demonstra que o usuário do sistema operacional `antonio` está autenticado para ter os privilégios do usuário `data_entry` do MySQL, e que a proxy é realizada através da conta de proxy padrão.

Nota

O plugin de autenticação `mysql_clear_password` do lado do cliente deixa a senha intacta, então os programas do cliente enviam-na para o servidor MySQL como texto não criptografado. Isso permite que a senha seja passada como está para o PAM. Uma senha não criptografada é necessária para usar a biblioteca PAM do lado do servidor, mas pode ser um problema de segurança em algumas configurações. Essas medidas minimizam o risco:

- Para tornar menos provável o uso acidental do plugin `mysql_clear_password`, os clientes MySQL devem habilitá-lo explicitamente (por exemplo, com a opção `--enable-cleartext-plugin`). Veja Seção 6.4.1.6, “Autenticação com Autenticação de Texto Aberto no Lado do Cliente”.

- Para evitar a exposição da senha com o plugin `mysql_clear_password` ativado, os clientes MySQL devem se conectar ao servidor MySQL usando uma conexão criptografada. Consulte Seção 6.3.1, “Configurando o MySQL para usar conexões criptografadas”.

##### Autenticação PAM Acesso à Armazenamento de Senhas Unix

Em alguns sistemas, a autenticação Unix usa um repositório de senhas, como `/etc/shadow`, um arquivo que geralmente tem permissões de acesso restritas. Isso pode fazer com que a autenticação baseada no PAM do MySQL falhe. Infelizmente, a implementação do PAM não permite distinguir entre “senha não pode ser verificada” (devido, por exemplo, à incapacidade de ler `/etc/shadow`) e “senha não corresponde”. Se você estiver usando o repositório de senhas Unix para autenticação baseada no PAM, você pode ser capaz de habilitar o acesso a ele a partir do MySQL usando um dos seguintes métodos:

- Supondo que o servidor MySQL seja executado com a conta do sistema operacional `mysql`, coloque essa conta no grupo `shadow` que tem acesso ao `/etc/shadow`:

  1. Crie um grupo `shadow` em `/etc/group`.

  2. Adicione o usuário do sistema operacional `mysql` ao grupo `shadow` em `/etc/group`.

  3. Atribua o diretório `/etc/group` ao grupo `shadow` e habilite a permissão de leitura do grupo:

     ```sql
     chgrp shadow /etc/shadow
     chmod g+r /etc/shadow
     ```

  4. Reinicie o servidor MySQL.
- Se você estiver usando o módulo `pam_unix` e o utilitário **unix\_chkpwd**, habilite o acesso ao repositório de senhas da seguinte forma:

  ```sql
  chmod u-s /usr/sbin/unix_chkpwd
  setcap cap_dac_read_search+ep /usr/sbin/unix_chkpwd
  ```

  Ajuste o caminho para **unix\_chkpwd** conforme necessário para sua plataforma.

##### Depuração da Autenticação PAM

O plugin de autenticação PAM verifica no momento da inicialização se o valor do ambiente `AUTHENTICATION_PAM_LOG` está definido. No MySQL 5.7 e no MySQL NDB Cluster antes da versão NDB 7.5.33 e NDB 7.6.29, o valor não importa. O plugin habilita o registro de mensagens de diagnóstico no saída padrão, incluindo senhas. Essas mensagens podem ser úteis para depuração de problemas relacionados ao PAM que ocorrem quando o plugin realiza a autenticação.

No MySQL NDB Cluster, a partir das versões 7.5.33 e 7.6.29, as senhas *não* são incluídas se você definir `AUTHENTICATION_PAM_LOG=1` (ou outro valor arbitrário); você pode habilitar o registro de mensagens de depuração, incluindo senhas, definindo `AUTHENTICATION_PAM_LOG=PAM_LOG_WITH_SECRET_INFO`.

Algumas mensagens incluem referências aos arquivos de origem do plugin PAM e números de linha, o que permite que as ações do plugin sejam vinculadas mais estreitamente à localização no código onde elas ocorrem.

Outra técnica para depurar falhas de conexão e determinar o que está acontecendo durante as tentativas de conexão é configurar a autenticação PAM para permitir todas as conexões e, em seguida, verificar os arquivos de log do sistema. Essa técnica deve ser usada apenas de forma *temporária* e não em um servidor de produção.

Configure um arquivo de serviço PAM chamado `/etc/pam.d/mysql-any-password` com este conteúdo (o formato pode variar em alguns sistemas):

```sql
#%PAM-1.0
auth        required    pam_permit.so
account     required    pam_permit.so
```

Crie uma conta que utilize o plugin PAM e nomeie o serviço PAM `mysql-any-password`:

```sql
CREATE USER 'testuser'@'localhost'
  IDENTIFIED WITH authentication_pam
  AS 'mysql-any-password';
```

O arquivo de serviço `mysql-any-password` faz com que qualquer tentativa de autenticação retorne verdadeiro, mesmo para senhas incorretas. Se uma tentativa de autenticação falhar, isso indica que o problema de configuração está no lado do MySQL. Caso contrário, o problema está no lado do sistema operacional/PAM. Para ver o que pode estar acontecendo, verifique os arquivos de log do sistema, como `/var/log/secure`, `/var/log/audit.log`, `/var/log/syslog` ou `/var/log/messages`.

Depois de determinar qual é o problema, remova o arquivo do serviço PAM `mysql-any-password` para desabilitar o acesso com qualquer senha.
