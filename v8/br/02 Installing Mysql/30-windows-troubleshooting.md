### 2.3.4 Solução de problemas de instalação de um servidor MySQL da Microsoft Windows

Ao instalar e executar o MySQL pela primeira vez, você pode encontrar certos erros que impedem o servidor MySQL de iniciar. Esta seção ajuda você a diagnosticar e corrigir alguns desses erros.

Seu primeiro recurso ao resolver problemas de servidor é o log de erro. O servidor MySQL usa o log de erro para registrar informações relevantes ao erro que impede o servidor de iniciar. O log de erro está localizado no diretório  data especificado no seu arquivo `my.ini`. A localização padrão do diretório de dados é `C:\Program Files\MySQL\MySQL Server 8.4\data`, ou `C:\ProgramData\Mysql` no Windows 7 e no Windows Server 2008. O diretório `C:\ProgramData` é oculto por padrão. Você precisa alterar suas opções de pasta para ver o diretório e seu conteúdo. Para mais informações sobre o log de erro e entender o conteúdo, consulte a Seção 7.4.2, “O Log de Erro”.

Para informações sobre possíveis erros, consulte também as mensagens de console exibidas quando o serviço MySQL está iniciando. Use o comando `SC START` `mysqld_service_name` ou `NET START` `mysqld_service_name` a partir da linha de comando após instalar `mysqld` como um serviço para ver quaisquer mensagens de erro relacionadas ao início do servidor MySQL como um serviço.

Os seguintes exemplos mostram outros erros comuns que você pode encontrar ao instalar o MySQL e iniciar o servidor pela primeira vez:

* Se o servidor MySQL não conseguir encontrar o banco de dados de privilégios `mysql` ou outros arquivos críticos, ele exibe essas mensagens:

  ```
  System error 1067 has occurred.
  Fatal error: Can't open and lock privilege tables:
  Table 'mysql.user' doesn't exist
  ```

  Essas mensagens geralmente ocorrem quando o diretório de base ou de dados do MySQL é instalado em locais diferentes dos locais padrão (`C:\Program Files\MySQL\MySQL Server 8.4` e `C:\Program Files\MySQL\MySQL Server 8.4\data`, respectivamente).

  Essa situação pode ocorrer quando o MySQL é atualizado e instalado em um novo local, mas o arquivo de configuração não é atualizado para refletir o novo local. Além disso, arquivos de configuração antigos e novos podem entrar em conflito. Certifique-se de excluir ou renomear quaisquer arquivos de configuração antigos ao atualizar o MySQL.

  Se você instalou o MySQL em um diretório diferente de `C:\Program Files\MySQL\MySQL Server 8.4`, garanta que o servidor MySQL esteja ciente disso usando um arquivo de configuração (`my.ini`). Coloque o arquivo `my.ini` em seu diretório do Windows, tipicamente `C:\WINDOWS`. Para determinar sua localização exata a partir do valor da variável de ambiente `WINDIR`, execute o seguinte comando no prompt de comando:

  ```
  C:\> echo %WINDIR%
  ```

  Você pode criar ou modificar um arquivo de opções com qualquer editor de texto, como o Bloco de Notas. Por exemplo, se o MySQL estiver instalado em `E:\mysql` e o diretório de dados for `D:\MySQLdata`, você pode criar o arquivo de opções e configurar uma seção `[mysqld]` para especificar valores para as opções `basedir` e `datadir`:

  ```
  [mysqld]
  # set basedir to your installation path
  basedir=E:/mysql
  # set datadir to the location of your data directory
  datadir=D:/MySQLdata
  ```

  Os nomes de caminho do Microsoft Windows são especificados em arquivos de opções usando barras invertidas (`) em vez de barras traseiras (`\`). Se você usar barras traseiras, duplicá-las:

  ```
  [mysqld]
  # set basedir to your installation path
  basedir=C:\\Program Files\\MySQL\\MySQL Server 8.4
  # set datadir to the location of your data directory
  datadir=D:\\MySQLdata
  ```

  As regras para o uso de barras traseiras em valores de arquivos de opções são fornecidas na Seção 6.2.2.2, “Usando Arquivos de Opções”.

  Se você alterar o valor `datadir` em seu arquivo de configuração do MySQL, você deve mover o conteúdo do diretório de dados MySQL existente antes de reiniciar o servidor MySQL.
  
* Se você reinstalar ou atualizar o MySQL sem primeiro parar e remover o serviço MySQL existente, e depois configurar o MySQL usando o Configurável MySQL, você pode ver esse erro:

  ```
  Error: Cannot create Windows service for MySql. Error: 0
  ```

  Isso ocorre quando o Assistente de Configuração tenta instalar o serviço e encontra um serviço existente com o mesmo nome.

  Uma solução para esse problema é escolher um nome de serviço diferente de `mysql` ao usar o assistente de configuração. Isso permite que o novo serviço seja instalado corretamente, mas deixa o serviço desatualizado em vigor. Embora isso não seja prejudicial, é melhor remover serviços antigos que não são mais usados.

  Para remover permanentemente o serviço antigo `mysql`, execute o seguinte comando como um usuário com privilégios administrativos, na linha de comando:

  ```
  C:\> SC DELETE mysql
  [SC] DeleteService SUCCESS
  ```

  Se o utilitário `SC` não estiver disponível para a sua versão do Windows, baixe o utilitário `delsrv` de <http://www.microsoft.com/windows2000/techinfo/reskit/tools/existing/delsrv-o.asp> e use a sintaxe `delsrv mysql`.