### 2.3.4 Solução de problemas de uma instalação do Microsoft Windows MySQL Server

Ao instalar e executar o MySQL pela primeira vez, você pode encontrar certos erros que impedem o servidor MySQL de iniciar. Esta seção ajuda você a diagnosticar e corrigir alguns desses erros.

Seu primeiro recurso ao solucionar problemas de servidor é o registro de erros. O servidor MySQL usa o registro de erros para registrar informações relevantes para o erro que impede o servidor de iniciar. O registro de erros está localizado no diretório de dados especificado em seu arquivo `my.ini`. O local padrão do diretório de dados é `C:\Program Files\MySQL\MySQL Server 8.4\data`, ou `C:\ProgramData\Mysql` no Windows 7 e Windows Server 2008. O diretório `C:\ProgramData` está oculto por padrão. Você precisa alterar suas opções de pasta para ver o diretório e o conteúdo. Para mais informações sobre o registro de erros e entender o conteúdo, consulte a Seção 7.4.2, O Registro de Erros.

Para obter informações sobre possíveis erros, consulte também as mensagens de console exibidas quando o serviço MySQL está sendo iniciado. Utilize o comando **SC START `mysqld_service_name`** ou **NET START `mysqld_service_name`** da linha de comando depois de instalar `mysqld` como um serviço para ver quaisquer mensagens de erro sobre o início do servidor MySQL como um serviço. Veja a Seção 2.3.3.8, Início do MySQL como um Serviço do Windows.

Os exemplos a seguir mostram outras mensagens de erro comuns que você pode encontrar ao instalar o MySQL e iniciar o servidor pela primeira vez:

- Se o servidor MySQL não puder encontrar o banco de dados de privilégios `mysql` ou outros arquivos críticos, ele exibe estas mensagens:

  ```
  System error 1067 has occurred.
  Fatal error: Can't open and lock privilege tables:
  Table 'mysql.user' doesn't exist
  ```

  Essas mensagens geralmente ocorrem quando a base MySQL ou os diretórios de dados são instalados em locais diferentes dos locais padrão (`C:\Program Files\MySQL\MySQL Server 8.4` e `C:\Program Files\MySQL\MySQL Server 8.4\data`, respectivamente).

  Esta situação pode ocorrer quando o MySQL é atualizado e instalado em um novo local, mas o arquivo de configuração não é atualizado para refletir o novo local. Além disso, os arquivos de configuração antigos e novos podem entrar em conflito. Certifique-se de excluir ou renomear qualquer arquivo de configuração antigo ao atualizar o MySQL.

  Se você instalou o MySQL em um diretório diferente do `C:\Program Files\MySQL\MySQL Server 8.4`, certifique-se de que o servidor MySQL está ciente disso através do uso de um arquivo de configuração (`my.ini`). Coloque o arquivo `my.ini` no seu diretório do Windows, normalmente `C:\WINDOWS`. Para determinar sua localização exata a partir do valor da variável de ambiente `WINDIR`, emita o seguinte comando do prompt de comando:

  ```
  C:\> echo %WINDIR%
  ```

  Você pode criar ou modificar um arquivo de opções com qualquer editor de texto, como o Bloco de Notas. Por exemplo, se o MySQL está instalado em `E:\mysql` e o diretório de dados é `D:\MySQLdata`, você pode criar o arquivo de opções e configurar uma seção `[mysqld]` para especificar valores para as opções `basedir` e `datadir`:

  ```
  [mysqld]
  # set basedir to your installation path
  basedir=E:/mysql
  # set datadir to the location of your data directory
  datadir=D:/MySQLdata
  ```

  Os nomes de caminho do Microsoft Windows são especificados em arquivos de opções usando barras (para a frente) em vez de barras invertidas. Se você usar barras invertidas, duplique-as:

  ```
  [mysqld]
  # set basedir to your installation path
  basedir=C:\\Program Files\\MySQL\\MySQL Server 8.4
  # set datadir to the location of your data directory
  datadir=D:\\MySQLdata
  ```

  As regras para a utilização da barra invertida nos valores dos ficheiros de opções são apresentadas na secção 6.2.2.2, "Utilização dos ficheiros de opções".

  Se você alterar o valor `datadir` no seu arquivo de configuração do MySQL, você deve mover o conteúdo do diretório de dados do MySQL existente antes de reiniciar o servidor do MySQL.

  Ver secção 2.3.3.2, "Criar um ficheiro de opções".
- Se você reinstalar ou atualizar o MySQL sem primeiro parar e remover o serviço MySQL existente e, em seguida, configurar o MySQL usando o MySQL Configurator, você pode ver este erro:

  ```
  Error: Cannot create Windows service for MySql. Error: 0
  ```

  Isto ocorre quando o Assistente de Configuração tenta instalar o serviço e encontra um serviço existente com o mesmo nome.

  Uma solução para este problema é escolher um nome de serviço diferente de `mysql` ao usar o assistente de configuração. Isso permite que o novo serviço seja instalado corretamente, mas deixa o serviço desatualizado no lugar. Embora isso seja inofensivo, é melhor remover os serviços antigos que não estão mais em uso.

  Para remover permanentemente o antigo serviço `mysql`, execute o seguinte comando como um usuário com privilégios administrativos, na linha de comando:

  ```
  C:\> SC DELETE mysql
  [SC] DeleteService SUCCESS
  ```

  Se o utilitário `SC` não estiver disponível para a sua versão do Windows, faça o download do utilitário `delsrv` em <http://www.microsoft.com/windows2000/techinfo/reskit/tools/existing/delsrv-o.asp> e use a sintaxe `delsrv mysql`.
