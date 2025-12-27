#### 2.9.2.1 Solução de Problemas para Iniciar o Servidor MySQL

Esta seção fornece sugestões para solucionar problemas de inicialização do servidor. Para sugestões adicionais para sistemas Windows, consulte a Seção 2.3.4, “Solução de Problemas com a Instalação do Servidor MySQL Microsoft Windows”.

Se você tiver problemas para iniciar o servidor, aqui estão algumas coisas que você pode tentar:

* Verifique o log de erro para ver por que o servidor não inicia. Os arquivos de log estão localizados no diretório de dados (tipicamente `C:\Program Files\MySQL\MySQL Server 8.4\data` no Windows, `/usr/local/mysql/data` para uma distribuição binária Unix/Linux, e `/usr/local/var` para uma distribuição de código-fonte Unix/Linux). Procure no diretório de dados por arquivos com nomes na forma `host_name.err` e `host_name.log`, onde `host_name` é o nome do seu host do servidor. Em seguida, examine as últimas linhas desses arquivos. Use `tail` para exibí-las:

  ```
  $> tail host_name.err
  $> tail host_name.log
  ```
* Especifique quaisquer opções especiais necessárias pelos motores de armazenamento que você está usando. Você pode criar um arquivo `my.cnf` e especificar opções de inicialização para os motores que você planeja usar. Se você vai usar motores de armazenamento que suportam tabelas transacionais (`InnoDB`, `NDB`), certifique-se de que eles estão configurados da maneira que você deseja antes de iniciar o servidor. Se você estiver usando tabelas `InnoDB`, consulte a Seção 17.8, “Configuração do InnoDB”, para diretrizes e a Seção 17.14, “Opções de Inicialização e Variáveis de Sistema do InnoDB” para a sintaxe das opções.

Embora os motores de armazenamento usem valores padrão para opções que você omite, a Oracle recomenda que você revise as opções disponíveis e especifique valores explícitos para quaisquer opções cujos valores padrão não sejam apropriados para sua instalação.
* Certifique-se de que o servidor saiba onde encontrar o diretório de dados. O servidor `mysqld` usa esse diretório como seu diretório atual. É aqui que ele espera encontrar bancos de dados e onde espera escrever arquivos de log. O servidor também escreve o arquivo de PID (ID de processo) no diretório de dados.

A localização padrão do diretório de dados é codificada no código quando o servidor é compilado. Para determinar quais são as configurações do caminho padrão, inicie o  `mysqld` com as opções `--verbose` e `--help`. Se o diretório de dados estiver localizado em outro lugar do seu sistema, especifique essa localização com a opção `--datadir` para o  `mysqld` ou  `mysqld_safe`, na linha de comando ou em um arquivo de opção. Caso contrário, o servidor não funcionará corretamente. Como alternativa à opção `--datadir`, você pode especificar ao  `mysqld` a localização do diretório base sob o qual o MySQL está instalado com a opção `--basedir`, e o  `mysqld` procura o diretório `data` lá.

Para verificar o efeito de especificar opções de caminho, inicie o  `mysqld` com essas opções seguidas das opções `--verbose` e `--help`. Por exemplo, se você alterar a localização para o diretório onde o  `mysqld` está instalado e depois executar o seguinte comando, ele mostrará o efeito de iniciar o servidor com um diretório base de `/usr/local`:

```
  $> ./mysqld --basedir=/usr/local --verbose --help
  ```

Você pode especificar outras opções, como `--datadir`, mas `--verbose` e `--help` devem ser as últimas opções.

Uma vez que você determine as configurações de caminho que deseja, inicie o servidor sem `--verbose` e `--help`.

Se o  `mysqld` estiver atualmente em execução, você pode descobrir quais são as configurações de caminho que está usando executando este comando:

```
  $> mysqladmin variables
  ```

Ou:

```
  $> mysqladmin -h host_name variables
  ```

`host_name` é o nome do host do servidor MySQL.
* Certifique-se de que o servidor possa acessar o diretório de dados. A propriedade e as permissões do diretório de dados e de seu conteúdo devem permitir que o servidor os leia e modifique.

Se você receber `Errcode 13` (o que significa `Permissão negada`) ao iniciar o  `mysqld`, isso significa que os privilégios do diretório de dados ou de seu conteúdo não permitem o acesso do servidor. Nesse caso, você altera as permissões dos arquivos e diretórios envolvidos para que o servidor tenha o direito de usá-los. Você também pode iniciar o servidor como `root`, mas isso levanta questões de segurança e deve ser evitado.

Altere a localização para o diretório de dados e verifique a propriedade do diretório de dados e seu conteúdo para garantir que o servidor tenha acesso. Por exemplo, se o diretório de dados estiver em `/usr/local/mysql/var`, use este comando:

```
  $> ls -la /usr/local/mysql/var
  ```

Se o diretório de dados ou seus arquivos ou subdiretórios não estiverem de propriedade da conta de login que você usa para executar o servidor, mude sua propriedade para essa conta. Se a conta for chamada de `mysql`, use estes comandos:

```
  $> chown -R mysql /usr/local/mysql/var
  $> chgrp -R mysql /usr/local/mysql/var
  ```

Mesmo com a propriedade correta, o MySQL pode falhar ao iniciar se houver outro software de segurança em execução no seu sistema que gerencia o acesso do aplicativo a várias partes do sistema de arquivos. Nesse caso, reconfigure esse software para permitir que o `mysqld` acesse os diretórios que ele usa durante o funcionamento normal.

* Verifique se as interfaces de rede que o servidor deseja usar estão disponíveis.

Se ocorrer algum dos seguintes erros, isso significa que algum outro programa (provavelmente outro servidor `mysqld`) está usando a porta TCP/IP ou o arquivo de soquete Unix que o `mysqld` está tentando usar:

```
  Can't start server: Bind on TCP/IP port: Address already in use
  Can't start server: Bind on unix socket...
  ```

Use `ps` para determinar se você tem outro servidor `mysqld` em execução. Se sim, desligue o servidor antes de iniciar novamente o `mysqld`. (Se outro servidor estiver em execução e você realmente quiser executar múltiplos servidores, você pode encontrar informações sobre como fazer isso na Seção 7.8, “Executando Instâncias Múltiplas do MySQL em Uma Máquina”.)

Se nenhum outro servidor estiver em execução, execute o comando `telnet seu_nome_do_host número_da_porta_tcp_ip`. (O número de porta padrão do MySQL é 3306.) Em seguida, pressione Enter algumas vezes. Se você não receber uma mensagem de erro como `telnet: Não é possível conectar ao host remoto: Conexão recusada`, algum outro programa está usando a porta TCP/IP que o `mysqld` está tentando usar. Identifique qual programa é esse e desabilite-o ou diga ao `mysqld` para ouvir em uma porta diferente com a opção `--port`. Neste caso, especifique o mesmo número de porta não padrão para os programas cliente ao se conectar ao servidor usando TCP/IP.

Outra razão pela qual o porto pode estar inacessível é que você está executando um firewall que bloqueia as conexões a ele. Se for o caso, modifique as configurações do firewall para permitir o acesso à porta.

Se o servidor começar a funcionar, mas você não conseguir se conectar a ele, certifique-se de que você tem uma entrada no `/etc/hosts` que seja semelhante a esta:

```
  127.0.0.1       localhost
  ```
* Se você não conseguir fazer o `mysqld` começar, tente criar um arquivo de registro para encontrar o problema usando a opção `--debug`. Veja a Seção 7.9.4, “O Pacote DBUG”.