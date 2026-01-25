#### 2.9.2.1 Solução de Problemas ao Iniciar o MySQL Server

Esta seção fornece sugestões de solução de problemas para problemas ao iniciar o Server. Para sugestões adicionais para sistemas Windows, consulte a Seção 2.3.5, “Solução de Problemas na Instalação do MySQL Server no Microsoft Windows”.

Se você tiver problemas ao iniciar o Server, aqui estão algumas coisas que você pode tentar:

* Verifique o Error Log para descobrir por que o Server não está iniciando. Os arquivos de Log estão localizados no Data Directory (normalmente `C:\Program Files\MySQL\MySQL Server 5.7\data` no Windows, `/usr/local/mysql/data` para uma distribuição binária Unix/Linux e `/usr/local/var` para uma distribuição de código-fonte Unix/Linux). Procure no Data Directory por arquivos com nomes no formato `host_name.err` e `host_name.log`, onde *`host_name`* é o nome do host do seu Server. Em seguida, examine as últimas linhas desses arquivos. Use `tail` para exibi-los:

  ```sql
  $> tail host_name.err
  $> tail host_name.log
  ```

* Especifique quaisquer opções especiais necessárias pelas Storage Engines que você está utilizando. Você pode criar um arquivo `my.cnf` e especificar opções de startup para os Engines que planeja usar. Se você for usar Storage Engines que suportam tabelas transacionais (`InnoDB`, `NDB`), certifique-se de configurá-las da maneira desejada antes de iniciar o Server. Se você estiver usando tabelas `InnoDB`, consulte a Seção 14.8, “InnoDB Configuration” para diretrizes e a Seção 14.15, “InnoDB Startup Options and System Variables” para a sintaxe das opções.

  Embora as Storage Engines usem valores padrão para as opções que você omitir, a Oracle recomenda que você revise as opções disponíveis e especifique valores explícitos para quaisquer opções cujos defaults não sejam apropriados para sua instalação.

* Certifique-se de que o Server saiba onde encontrar o Data Directory. O **mysqld** Server usa este diretório como seu diretório atual. É aqui que ele espera encontrar Databases e onde espera escrever arquivos de Log. O Server também escreve o arquivo PID (Process ID) no Data Directory.

  A localização padrão do Data Directory é hardcoded quando o Server é compilado. Para determinar quais são as configurações de path padrão, invoque o **mysqld** com as opções `--verbose` e `--help`. Se o Data Directory estiver localizado em outro lugar no seu sistema, especifique esse local com a opção `--datadir` para **mysqld** ou **mysqld_safe**, na Command Line ou em um arquivo de opção. Caso contrário, o Server não funcionará corretamente. Como alternativa à opção `--datadir`, você pode especificar para o **mysqld** o local do diretório base sob o qual o MySQL está instalado com `--basedir`, e o **mysqld** procurará o diretório `data` ali.

  Para verificar o efeito da especificação das opções de path, invoque o **mysqld** com essas opções seguidas pelas opções `--verbose` e `--help`. Por exemplo, se você mudar a localização para o diretório onde o **mysqld** está instalado e depois executar o seguinte comando, ele mostrará o efeito de iniciar o Server com um diretório base de `/usr/local:`

  ```sql
  $> ./mysqld --basedir=/usr/local --verbose --help
  ```

  Você pode especificar outras opções como `--datadir` também, mas `--verbose` e `--help` devem ser as últimas opções.

  Assim que você determinar as configurações de path desejadas, inicie o Server sem `--verbose` e `--help`.

  Se o **mysqld** estiver em execução, você pode descobrir quais configurações de path ele está usando, executando este comando:

  ```sql
  $> mysqladmin variables
  ```

  Ou:

  ```sql
  $> mysqladmin -h host_name variables
  ```

  *`host_name`* é o nome do host do MySQL Server.

* Certifique-se de que o Server possa acessar o Data Directory. A propriedade (`ownership`) e as permissões do Data Directory e seu conteúdo devem permitir que o Server os leia e modifique.

  Se você receber `Errcode 13` (que significa `Permission denied` ou "Permissão negada") ao iniciar o **mysqld**, isso significa que os privilégios do Data Directory ou de seu conteúdo não permitem o acesso do Server. Neste caso, você deve alterar as permissões para os arquivos e diretórios envolvidos para que o Server tenha o direito de usá-los. Você também pode iniciar o Server como `root`, mas isso levanta problemas de segurança e deve ser evitado.

  Mude a localização para o Data Directory e verifique a `ownership` do Data Directory e seu conteúdo para garantir que o Server tenha acesso. Por exemplo, se o Data Directory for `/usr/local/mysql/var`, use este comando:

  ```sql
  $> ls -la /usr/local/mysql/var
  ```

  Se o Data Directory, seus arquivos ou subdiretórios não pertencerem à conta de login que você usa para executar o Server, altere a propriedade (`ownership`) deles para essa conta. Se a conta for chamada `mysql`, use estes comandos:

  ```sql
  $> chown -R mysql /usr/local/mysql/var
  $> chgrp -R mysql /usr/local/mysql/var
  ```

  Mesmo com a `ownership` correta, o MySQL pode falhar ao iniciar se houver outro software de segurança em execução no seu sistema que gerencie o acesso de aplicativos a várias partes do sistema de arquivos. Neste caso, reconfigure esse software para permitir que o **mysqld** acesse os diretórios que ele usa durante a operação normal.

* Verifique se as interfaces de rede que o Server deseja usar estão disponíveis.

  Se ocorrer qualquer um dos erros a seguir, isso significa que algum outro programa (talvez outro **mysqld** Server) está usando a porta TCP/IP ou o arquivo Unix socket que o **mysqld** está tentando utilizar:

  ```sql
  Can't start server: Bind on TCP/IP port: Address already in use
  Can't start server: Bind on unix socket...
  ```

  Use **ps** para determinar se há outro **mysqld** Server em execução. Se houver, desligue o Server antes de iniciar o **mysqld** novamente. (Se outro Server estiver em execução, e você realmente deseja executar múltiplos Servers, você pode encontrar informações sobre como fazer isso na Seção 5.7, “Running Multiple MySQL Instances on One Machine”).

  Se nenhum outro Server estiver em execução, execute o comando `telnet your_host_name tcp_ip_port_number`. (O número de porta padrão do MySQL é 3306.) Em seguida, pressione Enter algumas vezes. Se você não receber uma mensagem de erro como `telnet: Unable to connect to remote host: Connection refused`, algum outro programa está usando a porta TCP/IP que o **mysqld** está tentando usar. Descubra que programa é esse e desabilite-o, ou diga ao **mysqld** para escutar uma porta diferente com a opção `--port`. Neste caso, especifique o mesmo número de porta não padrão para os programas `client` ao se conectar ao Server usando TCP/IP.

  Outra razão pela qual a porta pode estar inacessível é se você tiver um Firewall em execução que bloqueia conexões com ela. Se for o caso, modifique as configurações do Firewall para permitir o acesso à porta.

  Se o Server iniciar, mas você não conseguir se conectar a ele, certifique-se de ter uma entrada em `/etc/hosts` que se pareça com isto:

  ```sql
  127.0.0.1       localhost
  ```

* Se você não conseguir iniciar o **mysqld**, tente criar um trace file para encontrar o problema usando a opção `--debug`. Consulte a Seção 5.8.3, “The DBUG Package”.