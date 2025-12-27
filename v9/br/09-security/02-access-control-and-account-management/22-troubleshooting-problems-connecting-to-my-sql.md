### 8.2.22 Solução de Problemas para Conectar ao MySQL

Se você encontrar problemas ao tentar se conectar ao servidor MySQL, os seguintes itens descrevem algumas ações que você pode tomar para corrigir o problema.

* Certifique-se de que o servidor esteja em execução. Se não estiver, os clientes não poderão se conectar a ele. Por exemplo, se uma tentativa de conexão com o servidor falhar com uma mensagem como uma das seguintes, uma das causas pode ser que o servidor não esteja em execução:

  ```
  $> mysql
  ERROR 2003: Can't connect to MySQL server on 'host_name' (111)
  $> mysql
  ERROR 2002: Can't connect to local MySQL server through socket
  '/tmp/mysql.sock' (111)
  ```

* Pode ser que o servidor esteja em execução, mas você esteja tentando se conectar usando uma porta TCP/IP, um pipe nomeado ou um arquivo de soquete Unix diferente do que o servidor está ouvindo. Para corrigir isso ao invocar um programa cliente, especifique uma opção `--port` para indicar o número de porta correto ou uma opção `--socket` para indicar o pipe nomeado ou o arquivo de soquete Unix correto. Para descobrir onde está o arquivo de soquete, você pode usar este comando:

  ```
  $> netstat -ln | grep mysql
  ```

* Certifique-se de que o servidor não foi configurado para ignorar conexões de rede ou (se você estiver tentando se conectar remotamente) que ele não foi configurado para ouvir apenas localmente em suas interfaces de rede. Se o servidor foi iniciado com a variável de sistema `skip_networking` habilitada, nenhuma conexão TCP/IP é aceita. Se o servidor foi iniciado com a variável de sistema `bind_address` definida como `127.0.0.1`, ele escuta conexões TCP/IP apenas localmente na interface de loopback e não aceita conexões remotas.

* Verifique se não há um firewall bloqueando o acesso ao MySQL. Seu firewall pode estar configurado com base na aplicação que está sendo executada ou no número de porta usado pelo MySQL para comunicação (3306 por padrão). Em Linux ou Unix, verifique a configuração de suas tabelas de IP (ou similar) para garantir que a porta não tenha sido bloqueada. Em Windows, aplicativos como o ZoneAlarm ou o Windows Firewall podem precisar ser configurados para não bloquear a porta do MySQL.

* As tabelas de concessão devem estar corretamente configuradas para que o servidor possa usá-las para controle de acesso. Para alguns tipos de distribuição (como distribuições binárias no Windows ou distribuições RPM e DEB no Linux), o processo de instalação inicializa o diretório de dados do MySQL, incluindo o banco de dados do sistema `mysql` que contém as tabelas de concessão. Para distribuições que não fazem isso, você deve inicializar o diretório de dados manualmente. Para obter detalhes, consulte a Seção 2.9, “Configuração e Teste Pós-Instalação”.

* Para determinar se você precisa inicializar as tabelas de concessão, procure um diretório `mysql` sob o diretório de dados. (O diretório de dados normalmente é nomeado `data` ou `var` e está localizado sob o diretório de instalação do MySQL.) Certifique-se de que você tem um arquivo chamado `user.MYD` no diretório do banco de dados `mysql`. Se não, inicie o diretório de dados. Após fazer isso e iniciar o servidor, você deve ser capaz de se conectar ao servidor.

* Após uma instalação recente, se você tentar fazer login no servidor como `root` sem usar uma senha, você pode receber a seguinte mensagem de erro.

  ```
  $> mysql -u root
  ERROR 1045 (28000): Access denied for user 'root'@'localhost' (using password: NO)
  ```

Isso significa que uma senha de raiz já foi atribuída durante a instalação e ela precisa ser fornecida. Veja a Seção 2.9.4, “Segurança da Conta Inicial do MySQL” sobre as diferentes maneiras pelas quais a senha poderia ter sido atribuída e, em alguns casos, como encontrá-la. Se você precisar redefinir a senha de raiz, consulte as instruções na Seção B.3.3.2, “Como Redefinir a Senha de Raiz”. Após encontrar ou redefinir sua senha, faça login novamente como `root` usando a opção `--password` (ou `-p`):

```
  $> mysql -u root -p
  Enter password:
  ```

No entanto, o servidor permitirá que você se conecte como `root` sem usar uma senha se você tiver inicializado o MySQL usando **mysqld --initialize-insecure** (consulte a Seção 2.9.1, “Inicialização do Diretório de Dados” para detalhes). Esse é um risco de segurança, então você deve definir uma senha para a conta `root`; consulte a Seção 2.9.4, “Segurança da Conta Inicial do MySQL” para instruções.

* Se você atualizou uma instalação existente do MySQL para uma versão mais recente, você realizou o procedimento de atualização do MySQL? Se não, faça-o. A estrutura das tabelas de concessão muda ocasionalmente quando novos recursos são adicionados, então após uma atualização, você deve sempre garantir que suas tabelas tenham a estrutura atual. Para instruções, consulte o Capítulo 3, *Atualizando o MySQL*.

* Se um programa cliente recebe o seguinte mensagem de erro quando tenta se conectar, isso significa que o servidor espera senhas em um formato mais recente do que o cliente é capaz de gerar:

```
  $> mysql
  Client does not support authentication protocol requested
  by server; consider upgrading MySQL client
  ```

* Lembre-se de que os programas de cliente usam parâmetros de conexão especificados em arquivos de opção ou variáveis de ambiente. Se um programa de cliente parecer estar enviando parâmetros de conexão padrão incorretos, mesmo que você não os tenha especificado na linha de comando, verifique quaisquer arquivos de opção aplicáveis e seu ambiente. Por exemplo, se você receber `Acesso negado` ao executar um cliente sem nenhuma opção, certifique-se de que você não tenha especificado uma senha antiga em nenhum de seus arquivos de opção!

  Você pode suprimir o uso de arquivos de opção por um programa de cliente invocando-o com a opção `--no-defaults`. Por exemplo:

  ```
  $> mysqladmin --no-defaults -u root version
  ```

  Os arquivos de opção que os clientes usam estão listados na Seção 6.2.2.2, “Usando Arquivos de Opção”. Variáveis de ambiente estão listadas na Seção 6.9, “Variáveis de Ambiente”.

* Se você receber o seguinte erro, isso significa que está usando uma senha `root` incorreta:

  ```
  $> mysqladmin -u root -pxxxx ver
  Access denied for user 'root'@'localhost' (using password: YES)
  ```

  Se o erro anterior ocorrer mesmo quando você não especificou uma senha, isso significa que você tem uma senha incorreta listada em algum arquivo de opção. Tente a opção `--no-defaults` conforme descrito no item anterior.

  Para informações sobre alterar senhas, consulte a Seção 8.2.14, “Atribuindo Senhas de Conta”.

  Se você perdeu ou esqueceu a senha `root`, consulte a Seção B.3.3.2, “Como Redefinir a Senha `root`”.

* `localhost` é um sinônimo do seu nome de host local e também é o host padrão para o qual os clientes tentam se conectar se você não especificar explicitamente um host.

Você pode usar a opção `--host=127.0.0.1` para nomear explicitamente o host do servidor. Isso causa uma conexão TCP/IP com o servidor **mysqld** local. Você também pode usar TCP/IP especificando uma opção `--host` que usa o nome real do host do host local. Neste caso, o nome do host deve ser especificado em uma linha da tabela `user` no host do servidor, mesmo que você esteja executando o programa cliente no mesmo host que o servidor.

* A mensagem de erro `Acesso negado` informa quem você está tentando fazer login como, o host do cliente do qual você está tentando se conectar e se você estava usando uma senha. Normalmente, você deve ter uma linha na tabela `user` que corresponda exatamente ao nome do host e ao nome de usuário que foram fornecidos na mensagem de erro. Por exemplo, se você receber uma mensagem de erro que contém `usando senha: NÃO`, isso significa que você tentou fazer login sem uma senha.

* Se você receber um erro `Acesso negado` ao tentar se conectar ao banco de dados com `mysql -u user_name`, você pode ter um problema com a tabela `user`. Verifique isso executando `mysql -u root mysql` e emitindo esta instrução SQL:

  ```
  SELECT * FROM user;
  ```

  O resultado deve incluir uma linha com as colunas `Host` e `User` correspondentes ao nome do host do seu cliente e ao nome de usuário do seu MySQL.

* Se o seguinte erro ocorrer quando você tenta se conectar de um host diferente do que no qual o servidor MySQL está em execução, isso significa que não há uma linha na tabela `user` com um valor `Host` que corresponda ao host do cliente:

  ```
  Host ... is not allowed to connect to this MySQL server
  ```

  Você pode corrigir isso configurando uma conta para a combinação de nome do host do cliente e nome de usuário que você está usando ao tentar se conectar.

Se você não conhece o endereço IP ou o nome do host da máquina de onde está se conectando, deve inserir uma linha com `'%'` como valor da coluna `Host` na tabela `user`. Após tentar se conectar a partir da máquina cliente, use uma consulta `SELECT USER()` para ver como realmente se conectou. Em seguida, mude o `'%'` na linha da tabela `user` pelo nome real do host que aparece no log. Caso contrário, seu sistema ficará inseguro, pois permitirá conexões de qualquer host para o nome de usuário dado.

No Linux, outra razão pela qual esse erro pode ocorrer é que você está usando uma versão binária do MySQL compilada com uma versão diferente da biblioteca `glibc` do que a que você está usando. Nesse caso, você deve atualizar seu sistema operacional ou a `glibc`, ou baixar uma distribuição de código-fonte da versão do MySQL e compilar manualmente. Uma distribuição RPM de código-fonte é normalmente trivial de compilar e instalar, então isso não é um grande problema.

* Se você especificar um nome de host ao tentar se conectar, mas receber uma mensagem de erro onde o nome do host não é mostrado ou é um endereço IP, isso significa que o servidor MySQL recebeu um erro ao tentar resolver o endereço IP do host cliente em um nome:

  ```
  $> mysqladmin -u root -pxxxx -h some_hostname ver
  Access denied for user 'root'@'' (using password: YES)
  ```

  Se você tentar se conectar como `root` e receber o seguinte erro, isso significa que você não tem uma linha na tabela `user` com um valor na coluna `User` de `'root'` e que o **mysqld** não consegue resolver o nome do host para o seu cliente:

  ```
  Access denied for user ''@'unknown'
  ```

  Esses erros indicam um problema de DNS. Para corrigi-lo, execute **mysqladmin flush-hosts** para reiniciar o cache interno de hosts do DNS. Veja a Seção 7.1.12.3, “Consultas de DNS e o Cache de Hosts”.

  Algumas soluções permanentes são:

  + Determine o que está errado com seu servidor DNS e corrija.
  + Especifique endereços IP em vez de nomes de host nas tabelas de concessão do MySQL.

+ Adicione uma entrada para o nome da máquina do cliente em `/etc/hosts` no Unix ou em `\windows\hosts` no Windows.

+ Inicie o **mysqld** com a variável de sistema `skip_name_resolve` habilitada.

+ Inicie o **mysqld** com `--host-cache-size=0`.

+ No Unix, se você estiver executando o servidor e o cliente na mesma máquina, conecte-se a `localhost`. Para conexões a `localhost`, os programas MySQL tentam se conectar ao servidor local usando um arquivo de socket Unix, a menos que haja parâmetros de conexão especificados para garantir que o cliente faça uma conexão TCP/IP. Para mais informações, consulte a Seção 6.2.4, “Conectando ao Servidor MySQL Usando Opções de Comando”.

+ No Windows, se você estiver executando o servidor e o cliente na mesma máquina e o servidor suportar conexões por canal nomeado, conecte-se ao nome do host `.` (ponto). As conexões a `.` usam um canal nomeado em vez de TCP/IP.

* Se `mysql -u root` funciona, mas `mysql -h seu_hostname -u root` resulta em `Acesso negado` (onde *seu_hostname* é o nome real do host local), você pode não ter o nome correto para o seu host na tabela `user`. Um problema comum aqui é que o valor `Host` na linha da tabela `user` especifica um nome de host não qualificado, mas as rotinas de resolução de nomes do seu sistema retornam um nome de domínio totalmente qualificado (ou vice-versa). Por exemplo, se você tiver uma linha com o host `'pluto'` na tabela `user`, mas seu DNS informar ao MySQL que o nome do seu host é `'pluto.example.com'`, a linha não funciona. Tente adicionar uma linha à tabela `user` que contenha o endereço IP do seu host como o valor da coluna `Host`. (Alternativamente, você poderia adicionar uma linha à tabela `user` com um valor de `Host` que contenha um caractere curinga (por exemplo, `'pluto.%'`). No entanto, o uso de valores de `Host` terminados com `%` é *inseguro* e *não* recomendado!)

* Se `mysql -u user_name` funciona, mas `mysql -u user_name some_db` não funciona, você não concedeu acesso ao usuário fornecido para o banco de dados chamado *`some_db`*.

* Se `mysql -u user_name` funciona quando executado no host do servidor, mas `mysql -h host_name -u user_name` não funciona quando executado em um host de cliente remoto, você não habilitou o acesso ao servidor para o nome de usuário fornecido a partir do host remoto.

* Se você não conseguir descobrir por que está recebendo `Access denied`, remova da tabela `user` todas as linhas que têm valores de `Host` contendo caracteres de asteriscos (linhas que contêm os caracteres `'%'` ou `'_'`). Um erro muito comum é inserir uma nova linha com `Host`=`'%'` e `User`=`'some_user'`, pensando que isso permite especificar `localhost` para se conectar da mesma máquina. A razão pela qual isso não funciona é que os privilégios padrão incluem uma linha com `Host`=`'localhost'` e `User`=`''`. Como essa linha tem um valor de `Host`=`'localhost'` que é mais específico que `'%'`, ela é usada preferencialmente à nova linha ao se conectar a partir de `localhost`! O procedimento correto é inserir uma segunda linha com `Host`=`'localhost'` e `User`=`'some_user'`, ou excluir a linha com `Host`=`'localhost'` e `User`=`''`. Após excluir a linha, lembre-se de emitir uma declaração `FLUSH PRIVILEGES` para recarregar as tabelas de concessão. Veja também a Seção 8.2.6, “Controle de Acesso, Etapa 1: Verificação de Conexão”.

* Se você conseguir se conectar ao servidor MySQL, mas receber uma mensagem `Access denied` sempre que emitir uma declaração `SELECT ... INTO OUTFILE` ou `LOAD DATA`, sua linha na tabela `user` não tem o privilégio `FILE` habilitado.

* Se você alterar as tabelas de concessão diretamente (por exemplo, usando as instruções `INSERT`, `UPDATE` ou `DELETE`) e suas alterações parecerem ignoradas, lembre-se de que você deve executar uma instrução `FLUSH PRIVILEGES` ou o comando **mysqladmin flush-privileges** para fazer o servidor recarregar as tabelas de privilégios. Caso contrário, suas alterações não terão efeito até que o servidor seja reiniciado da próxima vez. Lembre-se de que, após alterar a senha do `root` com uma instrução `UPDATE`, você não precisa especificar a nova senha até que você feche os privilégios, porque o servidor não sabe disso até então.

* Se seus privilégios parecerem ter mudado no meio de uma sessão, pode ser que um administrador do MySQL os tenha alterado. Recarregar as tabelas de concessão afeta novas conexões de clientes, mas também afeta conexões existentes, conforme indicado na Seção 8.2.13, “Quando as Alterações de Privilégios Se Tornam Efetivas”.

* Se você tiver problemas de acesso com um programa Perl, PHP, Python ou ODBC, tente se conectar ao servidor com `mysql -u user_name db_name` ou `mysql -u user_name -ppassword db_name`. Se você conseguir se conectar usando o cliente **mysql**, o problema está com seu programa, não com os privilégios de acesso. (Não há espaço entre `-p` e a senha; você também pode usar a sintaxe `--password=password` para especificar a senha. Se você usar a opção `-p` ou `--password` sem valor de senha, o MySQL solicitará a senha.)

* Para fins de teste, inicie o servidor **mysqld** com a opção `--skip-grant-tables`. Em seguida, você pode alterar as tabelas de concessão do MySQL e usar a instrução `SHOW GRANTS` para verificar se suas modificações tiveram o efeito desejado. Quando estiver satisfeito com suas alterações, execute **mysqladmin flush-privileges** para informar ao servidor **mysqld** para recarregar os privilégios. Isso permite que você comece a usar o novo conteúdo da tabela de concessão sem parar e reiniciar o servidor.

* Se tudo mais falhar, inicie o servidor **mysqld** com uma opção de depuração (por exemplo, `--debug=d,general,query`). Isso imprime informações sobre o host e o usuário de conexões tentativas, além de informações sobre cada comando emitido. Veja a Seção 7.9.4, “O Pacote DBUG”.

[MySQL Community Slack](https://mysqlcommunity.slack.com/), sempre forneça um dump das tabelas de concessão do MySQL. Você pode fazer o dump das tabelas com o comando **mysqldump mysql**. Para registrar um relatório de erro, consulte as instruções na Seção 1.6, “Como relatar erros ou problemas”. Em alguns casos, você pode precisar reiniciar o **mysqld** com `--skip-grant-tables` para executar o **mysqldump**.