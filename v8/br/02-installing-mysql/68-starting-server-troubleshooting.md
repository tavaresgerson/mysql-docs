#### 2.9.2.1 Solução de problemas ao iniciar o servidor MySQL

Esta secção fornece sugestões de solução de problemas para problemas de inicialização do servidor. Para sugestões adicionais para sistemas Windows, consulte a Seção 2.3.4, "Solução de problemas de uma instalação do Microsoft Windows MySQL Server".

Se você tiver problemas para iniciar o servidor, aqui estão algumas coisas para tentar:

- Verifique o registro de erros para ver por que o servidor não inicia. Os arquivos de registro estão localizados no diretório de dados (tipicamente `C:\Program Files\MySQL\MySQL Server 8.4\data` no Windows, `/usr/local/mysql/data` para uma distribuição binária Unix/Linux, e `/usr/local/var` para uma distribuição de origem Unix/Linux). Procure no diretório de dados por arquivos com nomes da forma `host_name.err` e `host_name.log`, onde `host_name` é o nome do seu servidor host. Em seguida, examine as últimas linhas desses arquivos. Use `tail` para exibi-los:

  ```
  $> tail host_name.err
  $> tail host_name.log
  ```
- Especifique quaisquer opções especiais necessárias pelos motores de armazenamento que você está usando. Você pode criar um arquivo `my.cnf` e especificar opções de inicialização para os motores que você planeja usar. Se você estiver usando motores de armazenamento que suportam tabelas transacionais (`InnoDB`, `NDB`), certifique-se de que você os configurou da maneira que deseja antes de iniciar o servidor. Se você estiver usando tabelas `InnoDB` , consulte a Seção 17.8,  Configuração do InnoDB para diretrizes e a Seção 17.14,  Opções de inicialização do InnoDB e opções de variáveis do sistema para a sintaxe.

  Embora os motores de armazenamento usem valores padrão para opções que você omite, a Oracle recomenda que você revise as opções disponíveis e especifique valores explícitos para quaisquer opções cujos valores padrão não são apropriados para sua instalação.
- Certifique-se de que o servidor sabe onde encontrar o diretório de dados. O servidor `mysqld` usa este diretório como seu diretório atual. É aqui que ele espera encontrar bancos de dados e onde ele espera escrever arquivos de log. O servidor também escreve o arquivo pid (process ID) no diretório de dados.

  A localização padrão do diretório de dados é codificada quando o servidor é compilado. Para determinar quais são as configurações padrão do caminho, invoque `mysqld` com as opções `--verbose` e `--help`. Se o diretório de dados estiver localizado em outro lugar em seu sistema, especifique essa localização com a opção `--datadir` para `mysqld` ou `mysqld_safe`, na linha de comando ou em um arquivo de opções. Caso contrário, o servidor não funciona corretamente. Como alternativa à opção `--datadir`, você pode especificar `mysqld` a localização do diretório base sob o qual o MySQL está instalado com o `--basedir`, e `mysqld` procura o diretório `data` lá.

  Para verificar o efeito de especificar opções de caminho, invoque `mysqld` com essas opções seguidas pelas opções `--verbose` e `--help`. Por exemplo, se você mudar de localização para o diretório onde `mysqld` está instalado e depois executar o seguinte comando, ele mostra o efeito de iniciar o servidor com um diretório base de `/usr/local`:

  ```
  $> ./mysqld --basedir=/usr/local --verbose --help
  ```

  Você também pode especificar outras opções, como `--datadir`, mas `--verbose` e `--help` devem ser as últimas opções.

  Depois de determinar as configurações de caminho desejadas, inicie o servidor sem `--verbose` e `--help`.

  Se `mysqld` estiver atualmente em execução, você pode descobrir quais configurações de caminho ele está usando executando este comando:

  ```
  $> mysqladmin variables
  ```

  Ou:

  ```
  $> mysqladmin -h host_name variables
  ```

  `host_name` é o nome do servidor MySQL.
- Verifique se o servidor pode acessar o diretório de dados. A propriedade e as permissões do diretório de dados e seu conteúdo devem permitir que o servidor leia e modifique-os.

  Se você receber `Errcode 13` (o que significa `Permission denied`) ao iniciar `mysqld`, isso significa que os privilégios do diretório de dados ou seu conteúdo não permitem o acesso ao servidor. Neste caso, você muda as permissões para os arquivos e diretórios envolvidos para que o servidor tenha o direito de usá-los. Você também pode iniciar o servidor como `root`, mas isso levanta problemas de segurança e deve ser evitado.

  Mudar o local para o diretório de dados e verificar a propriedade do diretório de dados e seu conteúdo para garantir que o servidor tem acesso. Por exemplo, se o diretório de dados é `/usr/local/mysql/var`, use este comando:

  ```
  $> ls -la /usr/local/mysql/var
  ```

  Se o diretório de dados ou seus arquivos ou subdiretórios não são de propriedade da conta de login que você usa para executar o servidor, mude sua propriedade para essa conta. Se a conta é nomeada `mysql`, use estes comandos:

  ```
  $> chown -R mysql /usr/local/mysql/var
  $> chgrp -R mysql /usr/local/mysql/var
  ```

  Mesmo com a propriedade correta, o MySQL pode falhar em iniciar se houver outro software de segurança em execução no seu sistema que gerencia o acesso de aplicativos a várias partes do sistema de arquivos. Neste caso, reconfigure esse software para habilitar o `mysqld` para acessar os diretórios que ele usa durante a operação normal.
- Verifique se as interfaces de rede que o servidor deseja utilizar estão disponíveis.

  Se algum dos seguintes erros ocorrer, significa que algum outro programa (talvez outro servidor `mysqld`) está usando a porta TCP/IP ou o arquivo de soquete do Unix que `mysqld` está tentando usar:

  ```
  Can't start server: Bind on TCP/IP port: Address already in use
  Can't start server: Bind on unix socket...
  ```

  Use `ps` para determinar se você tem outro servidor `mysqld` em execução. Se assim for, feche o servidor antes de iniciar `mysqld` novamente. (Se outro servidor está em execução, e você realmente quer executar vários servidores, você pode encontrar informações sobre como fazê-lo na Seção 7.8, "Executar múltiplas instâncias do MySQL em uma máquina")

  Se nenhum outro servidor estiver em execução, execute o comando `telnet your_host_name tcp_ip_port_number`. (O número de porta padrão do MySQL é 3306.) Em seguida, pressione Enter algumas vezes. Se você não receber uma mensagem de erro como `telnet: Unable to connect to remote host: Connection refused`, algum outro programa está usando a porta TCP/IP que `mysqld` está tentando usar. Descubra qual programa é esse e desative-o, ou diga `mysqld` para ouvir uma porta diferente com a opção `--port`. Neste caso, especifique o mesmo número de porta não padrão para programas cliente ao se conectar ao servidor usando TCP/IP.

  Outra razão pela qual a porta pode ser inacessível é que você tem um firewall em execução que bloqueia conexões com ela. Se assim for, modifique as configurações do firewall para permitir o acesso à porta.

  Se o servidor começar, mas você não conseguir se conectar a ele, verifique se você tem uma entrada no `/etc/hosts` que se parece com isto:

  ```
  127.0.0.1       localhost
  ```
- Se você não conseguir fazer o `mysqld` começar, tente criar um arquivo de rastreamento para encontrar o problema usando a opção `--debug`.
