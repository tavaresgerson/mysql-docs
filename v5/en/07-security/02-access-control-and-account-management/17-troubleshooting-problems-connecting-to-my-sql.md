### 6.2.17 Solução de Problemas de Conexão com o MySQL

Se você encontrar problemas ao tentar conectar-se ao MySQL server, os seguintes itens descrevem algumas ações que você pode tomar para corrigir o problema.

* Certifique-se de que o server está em execução. Se não estiver, os clients não podem se conectar a ele. Por exemplo, se uma tentativa de conexão com o server falhar com uma mensagem como uma das seguintes, uma causa pode ser que o server não está em execução:

  ```sql
  $> mysql
  ERROR 2003: Can't connect to MySQL server on 'host_name' (111)
  $> mysql
  ERROR 2002: Can't connect to local MySQL server through socket
  '/tmp/mysql.sock' (111)
  ```

* Pode ser que o server esteja em execução, mas você está tentando se conectar usando um port TCP/IP, named pipe ou Unix socket file diferente daquele no qual o server está escutando. Para corrigir isso ao invocar um programa client, especifique uma opção [`--port`](connection-options.html#option_general_port) para indicar o número de port correto, ou uma opção [`--socket`](connection-options.html#option_general_socket) para indicar o named pipe ou Unix socket file correto. Para descobrir onde está o socket file, você pode usar este comando:

  ```sql
  $> netstat -ln | grep mysql
  ```

* Certifique-se de que o server não foi configurado para ignorar conexões de rede ou (se você estiver tentando conectar remotamente) que ele não foi configurado para escutar apenas localmente em suas interfaces de rede. Se o server foi iniciado com a variável de sistema [`skip_networking`](server-system-variables.html#sysvar_skip_networking) habilitada, ele não aceita conexões TCP/IP. Se o server foi iniciado com a variável de sistema [`bind_address`](server-system-variables.html#sysvar_bind_address) definida como `127.0.0.1`, ele escuta conexões TCP/IP apenas localmente na interface de loopback e não aceita conexões remotas.

* Verifique se não há um firewall bloqueando o acesso ao MySQL. Seu firewall pode ser configurado com base na aplicação sendo executada, ou no número de port usado pelo MySQL para comunicação (3306 por padrão). No Linux ou Unix, verifique sua configuração de IP tables (ou similar) para garantir que o port não foi bloqueado. No Windows, aplicações como ZoneAlarm ou Windows Firewall podem precisar ser configuradas para não bloquear o port do MySQL.

* As grant tables devem ser configuradas corretamente para que o server possa usá-las para controle de acesso. Para alguns tipos de distribuição (como distribuições binárias no Windows, ou distribuições RPM e DEB no Linux), o processo de instalação inicializa o diretório de dados do MySQL, incluindo a database de sistema `mysql` que contém as grant tables. Para distribuições que não fazem isso, você deve inicializar o diretório de dados manualmente. Para detalhes, consulte [Section 2.9, “Postinstallation Setup and Testing”](postinstallation.html "2.9 Postinstallation Setup and Testing").

  Para determinar se você precisa inicializar as grant tables, procure por um diretório `mysql` sob o diretório de dados. (O diretório de dados é normalmente nomeado `data` ou `var` e está localizado sob o seu diretório de instalação do MySQL.) Certifique-se de ter um arquivo chamado `user.MYD` no diretório da database `mysql`. Caso contrário, [inicialize o diretório de dados](data-directory-initialization.html "2.9.1 Initializing the Data Directory"). Depois de fazer isso e iniciar o server, você deverá conseguir se conectar ao server.

* Após uma nova instalação, se você tentar fazer login no server como `root` sem usar um password, você pode receber a seguinte mensagem de erro.

  ```sql
  $> mysql -u root
  ERROR 1045 (28000): Access denied for user 'root'@'localhost' (using password: NO)
  ```

  Isso significa que um password de `root` já foi atribuído durante a instalação e precisa ser fornecido. Consulte [Section 2.9.4, “Securing the Initial MySQL Account”](default-privileges.html "2.9.4 Securing the Initial MySQL Account") sobre as diferentes maneiras pelas quais o password pode ter sido atribuído e, em alguns casos, como encontrá-lo. Se você precisar redefinir o password de `root`, consulte as instruções em [Section B.3.3.2, “How to Reset the Root Password”](resetting-permissions.html "B.3.3.2 How to Reset the Root Password"). Depois de encontrar ou redefinir seu password, faça login novamente como `root` usando a opção [`--password`](connection-options.html#option_general_password) (ou [`-p`](connection-options.html#option_general_password)):

  ```sql
  $> mysql -u root -p
  Enter password:
  ```

  No entanto, o server permitirá que você se conecte como `root` sem usar um password se você tiver inicializado o MySQL usando [**mysqld --initialize-insecure**](mysqld.html "4.3.1 mysqld — The MySQL Server") (consulte [Section 2.9.1, “Initializing the Data Directory”](data-directory-initialization.html "2.9.1 Initializing the Data Directory") para detalhes). Isso é um risco de segurança, portanto, você deve definir um password para a conta `root`; consulte [Section 2.9.4, “Securing the Initial MySQL Account”](default-privileges.html "2.9.4 Securing the Initial MySQL Account") para obter instruções.

* Se você atualizou uma instalação existente do MySQL para uma versão mais recente, você executou o procedimento de upgrade do MySQL? Caso contrário, faça-o. A estrutura das grant tables muda ocasionalmente quando novos recursos são adicionados, portanto, após um upgrade, você deve sempre garantir que suas tables tenham a estrutura atual. Para obter instruções, consulte [Section 2.10, “Upgrading MySQL”](upgrading.html "2.10 Upgrading MySQL").

* Se um programa client receber a seguinte mensagem de erro ao tentar se conectar, isso significa que o server espera passwords em um formato mais novo do que o client é capaz de gerar:

  ```sql
  $> mysql
  Client does not support authentication protocol requested
  by server; consider upgrading MySQL client
  ```

  Para obter informações sobre como lidar com isso, consulte [Section 6.4.1.3, “Migrating Away from Pre-4.1 Password Hashing and the mysql_old_password Plugin”](account-upgrades.html "6.4.1.3 Migrating Away from Pre-4.1 Password Hashing and the mysql_old_password Plugin").

* Lembre-se de que os programas client usam parâmetros de conexão especificados em option files ou environment variables. Se um programa client parecer estar enviando parâmetros de conexão default incorretos quando você não os especificou na command line, verifique quaisquer option files aplicáveis e seu ambiente. Por exemplo, se você receber `Access denied` ao executar um client sem opções, certifique-se de não ter especificado um old password em nenhum dos seus option files!

  Você pode suprimir o uso de option files por um programa client, invocando-o com a opção [`--no-defaults`](option-file-options.html#option_general_no-defaults). Por exemplo:

  ```sql
  $> mysqladmin --no-defaults -u root version
  ```

  Os option files que os clients usam estão listados em [Section 4.2.2.2, “Using Option Files”](option-files.html "4.2.2.2 Using Option Files"). As environment variables estão listadas em [Section 4.9, “Environment Variables”](environment-variables.html "4.9 Environment Variables").

* Se você receber o seguinte erro, significa que você está usando um password de `root` incorreto:

  ```sql
  $> mysqladmin -u root -pxxxx ver
  Access denied for user 'root'@'localhost' (using password: YES)
  ```

  Se o erro anterior ocorrer mesmo quando você não especificou um password, significa que você tem um password incorreto listado em algum option file. Tente a opção [`--no-defaults`](option-file-options.html#option_general_no-defaults), conforme descrito no item anterior.

  Para obter informações sobre como alterar passwords, consulte [Section 6.2.10, “Assigning Account Passwords”](assigning-passwords.html "6.2.10 Assigning Account Passwords").

  Se você perdeu ou esqueceu o password de `root`, consulte [Section B.3.3.2, “How to Reset the Root Password”](resetting-permissions.html "B.3.3.2 How to Reset the Root Password").

* `localhost` é um sinônimo para o seu hostname local e também é o host default ao qual os clients tentam se conectar se você não especificar um host explicitamente.

  Você pode usar uma opção [`--host=127.0.0.1`](connection-options.html#option_general_host) para nomear o server host explicitamente. Isso estabelece uma conexão TCP/IP com o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") server local. Você também pode usar TCP/IP especificando uma opção [`--host`](connection-options.html#option_general_host) que usa o hostname real do host local. Neste caso, o hostname deve ser especificado em uma linha da `user` table no server host, mesmo que você esteja executando o programa client no mesmo host que o server.

* A mensagem de erro `Access denied` informa quem você está tentando logar, o client host a partir do qual você está tentando se conectar e se você estava usando um password. Normalmente, você deve ter uma linha na `user` table que corresponda exatamente ao hostname e ao nome de user que foram fornecidos na mensagem de erro. Por exemplo, se você receber uma mensagem de erro que contém `using password: NO`, isso significa que você tentou fazer login sem um password.

* Se você receber um erro `Access denied` ao tentar se conectar à database com `mysql -u user_name`, você pode ter um problema com a `user` table. Verifique isso executando `mysql -u root mysql` e emitindo esta instrução SQL:

  ```sql
  SELECT * FROM user;
  ```

  O resultado deve incluir uma linha com as colunas `Host` e `User` correspondentes ao hostname do seu client e ao seu nome de user do MySQL.

* Se o erro a seguir ocorrer quando você tentar se conectar a partir de um host diferente daquele em que o MySQL server está sendo executado, significa que não há nenhuma linha na `user` table com um valor `Host` que corresponda ao client host:

  ```sql
  Host ... is not allowed to connect to this MySQL server
  ```

  Você pode corrigir isso configurando uma conta para a combinação de client hostname e nome de user que você está usando ao tentar se conectar.

  Se você não souber o IP address ou hostname da máquina a partir da qual você está se conectando, você deve inserir uma linha com `'%'` como valor da coluna `Host` na `user` table. Depois de tentar conectar a partir da máquina client, use uma Query `SELECT USER()` para ver como você realmente se conectou. Em seguida, altere o `'%'` na linha da `user` table para o hostname real que aparece no log. Caso contrário, seu sistema fica inseguro porque permite conexões de qualquer host para o nome de user fornecido.

  No Linux, outra razão pela qual este erro pode ocorrer é que você está usando uma versão binária do MySQL que foi compilada com uma versão diferente da biblioteca `glibc` daquela que você está usando. Neste caso, você deve atualizar seu sistema operacional ou `glibc`, ou baixar uma distribuição source da versão do MySQL e compilá-la você mesmo. Um source RPM é normalmente trivial para compilar e instalar, portanto, isso não é um grande problema.

* Se você especificar um hostname ao tentar se conectar, mas receber uma mensagem de erro onde o hostname não é mostrado ou é um IP address, significa que o MySQL server recebeu um erro ao tentar resolver o IP address do client host para um nome:

  ```sql
  $> mysqladmin -u root -pxxxx -h some_hostname ver
  Access denied for user 'root'@'' (using password: YES)
  ```

  Se você tentar se conectar como `root` e receber o seguinte erro, significa que você não tem uma linha na `user` table com um valor na coluna `User` de `'root'` e que o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") não consegue resolver o hostname para o seu client:

  ```sql
  Access denied for user ''@'unknown'
  ```

  Esses erros indicam um problema de DNS. Para corrigi-lo, execute [**mysqladmin flush-hosts**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") para redefinir o host cache interno do DNS. Consulte [Section 5.1.11.2, “DNS Lookups and the Host Cache”](host-cache.html "5.1.11.2 DNS Lookups and the Host Cache").

  Algumas soluções permanentes são:

  + Determine o que está errado com seu DNS server e conserte-o.
  + Especifique IP addresses em vez de hostnames nas grant tables do MySQL.
  + Coloque uma entrada para o nome da máquina client em `/etc/hosts` no Unix ou `\windows\hosts` no Windows.
  + Inicie o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") com a variável de sistema [`skip_name_resolve`](server-system-variables.html#sysvar_skip_name_resolve) habilitada.
  + Inicie o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") com a opção [`--skip-host-cache`](server-options.html#option_mysqld_skip-host-cache).
  + No Unix, se você estiver executando o server e o client na mesma máquina, conecte-se a `localhost`. Para conexões com `localhost`, os programas MySQL tentam se conectar ao server local usando um Unix socket file, a menos que parâmetros de conexão sejam especificados para garantir que o client faça uma conexão TCP/IP. Para mais informações, consulte [Section 4.2.4, “Connecting to the MySQL Server Using Command Options”](connecting.html "4.2.4 Connecting to the MySQL Server Using Command Options").
  + No Windows, se você estiver executando o server e o client na mesma máquina e o server suportar conexões por named pipe, conecte-se ao hostname `.` (ponto). Conexões para `.` usam um named pipe em vez de TCP/IP.

* Se `mysql -u root` funcionar, mas `mysql -h your_hostname -u root` resultar em `Access denied` (onde *`your_hostname`* é o hostname real do host local), você pode não ter o nome correto para o seu host na `user` table. Um problema comum aqui é que o valor `Host` na linha da `user` table especifica um hostname não qualificado, mas as rotinas de resolução de nomes do seu sistema retornam um fully qualified domain name (ou vice-versa). Por exemplo, se você tiver uma linha com host `'pluto'` na `user` table, mas seu DNS disser ao MySQL que seu hostname é `'pluto.example.com'`, a linha não funcionará. Tente adicionar uma linha à `user` table que contenha o IP address do seu host como valor da coluna `Host`. (Alternativamente, você poderia adicionar uma linha à `user` table com um valor `Host` que contenha um wildcard (por exemplo, `'pluto.%'`). No entanto, o uso de valores `Host` terminados em `%` é *inseguro* e *não* é recomendado!)

* Se `mysql -u user_name` funcionar, mas `mysql -u user_name some_db` não funcionar, você não concedeu acesso ao user fornecido para a database chamada *`some_db`*.

* Se `mysql -u user_name` funcionar quando executado no server host, mas `mysql -h host_name -u user_name` não funcionar quando executado em um client host remoto, você não habilitou o acesso ao server para o nome de user fornecido a partir do host remoto.

* Se você não conseguir descobrir por que recebe `Access denied`, remova da `user` table todas as linhas que têm valores `Host` contendo wildcards (linhas que contêm os caracteres `'%'` ou `'_'`). Um erro muito comum é inserir uma nova linha com `Host`=`'%'` e `User`=`'some_user'`, pensando que isso permite que você especifique `localhost` para conectar a partir da mesma máquina. A razão pela qual isso não funciona é que os default privileges incluem uma linha com `Host`=`'localhost'` e `User`=`''`. Como essa linha tem um valor `Host` `'localhost'` que é mais específico do que `'%'`, ela é usada em preferência à nova linha ao conectar-se a partir de `localhost`! O procedimento correto é inserir uma segunda linha com `Host`=`'localhost'` e `User`=`'some_user'`, ou excluir a linha com `Host`=`'localhost'` e `User`=`''`. Após excluir a linha, lembre-se de emitir uma instrução [`FLUSH PRIVILEGES`](flush.html#flush-privileges) para recarregar as grant tables. Consulte também [Section 6.2.5, “Access Control, Stage 1: Connection Verification”](connection-access.html "6.2.5 Access Control, Stage 1: Connection Verification").

* Se você conseguir se conectar ao MySQL server, mas receber uma mensagem `Access denied` sempre que emitir uma instrução [`SELECT ... INTO OUTFILE`](select-into.html "13.2.9.1 SELECT ... INTO Statement") ou [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement"), sua linha na `user` table não tem o privilege [`FILE`](privileges-provided.html#priv_file) habilitado.

* Se você alterar as grant tables diretamente (por exemplo, usando instruções [`INSERT`](insert.html "13.2.5 INSERT Statement"), [`UPDATE`](update.html "13.2.11 UPDATE Statement") ou [`DELETE`](delete.html "13.2.2 DELETE Statement")) e suas alterações parecerem ser ignoradas, lembre-se de que você deve executar uma instrução [`FLUSH PRIVILEGES`](flush.html#flush-privileges) ou um comando [**mysqladmin flush-privileges**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") para fazer com que o server recarregue as privilege tables. Caso contrário, suas alterações não terão efeito até a próxima vez que o server for reiniciado. Lembre-se de que depois de alterar o password de `root` com uma instrução [`UPDATE`](update.html "13.2.11 UPDATE Statement"), você não precisa especificar o new password até que você execute o flush dos privileges, porque o server ainda não sabe que você alterou o password.

* Se seus privileges parecerem ter mudado no meio de uma sessão, pode ser que um administrador MySQL os tenha alterado. Recarregar as grant tables afeta novas conexões client, mas também afeta conexões existentes, conforme indicado em [Section 6.2.9, “When Privilege Changes Take Effect”](privilege-changes.html "6.2.9 When Privilege Changes Take Effect").

* Se você tiver problemas de acesso com um programa Perl, PHP, Python ou ODBC, tente conectar-se ao server com `mysql -u user_name db_name` ou `mysql -u user_name -ppassword db_name`. Se você conseguir se conectar usando o client [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"), o problema reside no seu programa, e não nos access privileges. (Não há espaço entre `-p` e o password; você também pode usar a sintaxe [`--password=password`](connection-options.html#option_general_password) para especificar o password. Se você usar a opção `-p` ou [`--password`](connection-options.html#option_general_password) sem um valor de password, o MySQL solicitará o password.)

* Para fins de teste, inicie o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") server com a opção [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables). Em seguida, você pode alterar as grant tables do MySQL e usar a instrução [`SHOW GRANTS`](show-grants.html "13.7.5.21 SHOW GRANTS Statement") para verificar se suas modificações têm o efeito desejado. Quando estiver satisfeito com suas alterações, execute [**mysqladmin flush-privileges**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") para instruir o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") server a recarregar os privileges. Isso permite que você comece a usar o novo conteúdo da grant table sem parar e reiniciar o server.

* Se tudo mais falhar, inicie o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") server com uma opção de debugging (por exemplo, [`--debug=d,general,query`](server-options.html#option_mysqld_debug)). Isso imprime informações de host e user sobre tentativas de conexão, bem como informações sobre cada comando emitido. Consulte [Section 5.8.3, “The DBUG Package”](dbug-package.html "5.8.3 The DBUG Package").

* Se você tiver qualquer outro problema com as grant tables do MySQL e perguntar no [MySQL Community Slack](https://mysqlcommunity.slack.com/), sempre forneça um dump das grant tables do MySQL. Você pode despejar as tables com o comando [**mysqldump mysql**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program"). Para registrar um bug report, consulte as instruções em [Section 1.5, “How to Report Bugs or Problems”](bug-reports.html "1.5 How to Report Bugs or Problems"). Em alguns casos, você pode precisar reiniciar o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") com [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables) para executar o [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program").
