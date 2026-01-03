### 2.3.5 Solução de problemas de instalação do Microsoft Windows MySQL Server

Ao instalar e executar o MySQL pela primeira vez, você pode encontrar certos erros que impedem o início do servidor MySQL. Esta seção ajuda você a diagnosticar e corrigir alguns desses erros.

Seu primeiro recurso ao resolver problemas no servidor é o log de erros. O servidor MySQL usa o log de erros para registrar informações relevantes ao erro que impede o servidor de iniciar. O log de erros está localizado no diretório de dados especificado no seu arquivo `my.ini`. A localização padrão do diretório de dados é `C:\Program Files\MySQL\MySQL Server 5.7\data`, ou `C:\ProgramData\Mysql` no Windows 7 e no Windows Server 2008. O diretório `C:\ProgramData` é oculto por padrão. Você precisa alterar suas opções de pasta para ver o diretório e seu conteúdo. Para obter mais informações sobre o log de erros e entender o conteúdo, consulte a Seção 5.4.2, “O Log de Erros”.

Para obter informações sobre possíveis erros, consulte também as mensagens do console exibidas quando o serviço MySQL está sendo iniciado. Use o comando **SC START *`mysqld_service_name`*** ou **NET START *`mysqld_service_name`*** a partir da linha de comando após instalar o **mysqld** como um serviço para ver quaisquer mensagens de erro relacionadas ao início do servidor MySQL como serviço. Consulte a Seção 2.3.4.8, “Iniciando o MySQL como um Serviço do Windows”.

Os exemplos a seguir mostram outras mensagens de erro comuns que você pode encontrar ao instalar o MySQL e iniciar o servidor pela primeira vez:

- Se o servidor MySQL não conseguir encontrar o banco de dados de privilégios `mysql` ou outros arquivos críticos, ele exibe essas mensagens:

  ```
  System error 1067 has occurred.
  Fatal error: Can't open and lock privilege tables:
  Table 'mysql.user' doesn't exist
  ```

  Essas mensagens geralmente ocorrem quando a base MySQL ou os diretórios de dados são instalados em locais diferentes dos locais padrão (`C:\Program Files\MySQL\MySQL Server 5.7`, respectivamente).

  Essa situação pode ocorrer quando o MySQL é atualizado e instalado em um novo local, mas o arquivo de configuração não é atualizado para refletir o novo local. Além disso, arquivos de configuração antigos e novos podem entrar em conflito. Certifique-se de excluir ou renomear quaisquer arquivos de configuração antigos ao atualizar o MySQL.

  Se você instalou o MySQL em um diretório diferente de `C:\Program Files\MySQL\MySQL Server 5.7`, certifique-se de que o servidor MySQL esteja ciente disso por meio de um arquivo de configuração (`my.ini`). Coloque o arquivo `my.ini` em seu diretório do Windows, geralmente `C:\WINDOWS`. Para determinar sua localização exata a partir do valor da variável de ambiente `WINDIR`, execute o seguinte comando no prompt de comando:

  ```bash
  C:\> echo %WINDIR%
  ```

  Você pode criar ou modificar um arquivo de opções com qualquer editor de texto, como o Bloco de Notas. Por exemplo, se o MySQL estiver instalado em `E:\mysql` e o diretório de dados estiver em `D:\MySQLdata`, você pode criar o arquivo de opções e configurar uma seção `[mysqld]` para especificar valores para as opções `basedir` e `datadir`:

  ```
  [mysqld]
  # set basedir to your installation path
  basedir=E:/mysql
  # set datadir to the location of your data directory
  datadir=D:/MySQLdata
  ```

  Os nomes de caminho do Microsoft Windows são especificados em arquivos de opção usando barras inclinadas (forward slashes) em vez de barras invertidas (back slashes). Se você usar barras invertidas, duplique-as:

  ```
  [mysqld]
  # set basedir to your installation path
  basedir=C:\\Program Files\\MySQL\\MySQL Server 5.7
  # set datadir to the location of your data directory
  datadir=D:\\MySQLdata
  ```

  As regras para o uso de barras invertidas nos valores dos arquivos de opção estão descritas na Seção 4.2.2.2, "Usando arquivos de opção".

  Se você alterar o valor `datadir` no arquivo de configuração do MySQL, você deve mover o conteúdo do diretório de dados existente do MySQL antes de reiniciar o servidor MySQL.

  Consulte a Seção 2.3.4.2, “Criando um arquivo de opção”.

- Se você reinstalar ou atualizar o MySQL sem primeiro parar e remover o serviço MySQL existente e instalar o MySQL usando o Instalador do MySQL, você pode ver este erro:

  ```
  Error: Cannot create Windows service for MySql. Error: 0
  ```

  Isso ocorre quando o Assistente de Configuração tenta instalar o serviço e encontra um serviço existente com o mesmo nome.

  Uma solução para esse problema é escolher um nome de serviço diferente de `mysql` ao usar o assistente de configuração. Isso permite que o novo serviço seja instalado corretamente, mas deixa o serviço desatualizado em funcionamento. Embora isso não seja prejudicial, é melhor remover serviços antigos que não são mais usados.

  Para remover permanentemente o serviço antigo `mysql`, execute o seguinte comando como um usuário com privilégios administrativos, na linha de comando:

  ```
  C:\> SC DELETE mysql
  [SC] DeleteService SUCCESS
  ```

  Se o utilitário `SC` não estiver disponível para a sua versão do Windows, baixe o utilitário `delsrv` em <http://www.microsoft.com/windows2000/techinfo/reskit/tools/existing/delsrv-o.asp> e use a sintaxe `delsrv mysql`.
