### 2.3.5 Solução de Problemas em uma Instalação do MySQL Server no Microsoft Windows

Ao instalar e executar o MySQL pela primeira vez, você pode encontrar certos erros que impedem o MySQL server de iniciar. Esta seção ajuda você a diagnosticar e corrigir alguns desses erros.

Seu primeiro recurso ao solucionar problemas do server é o *error log*. O MySQL server usa o *error log* para registrar informações relevantes ao erro que impede o server de iniciar. O *error log* está localizado no *data directory* especificado no seu arquivo `my.ini`. O local padrão do *data directory* é `C:\Program Files\MySQL\MySQL Server 5.7\data`, ou `C:\ProgramData\Mysql` no Windows 7 e Windows Server 2008. O diretório `C:\ProgramData` fica oculto por padrão. Você precisa alterar suas opções de pasta (*folder options*) para ver o diretório e seu conteúdo. Para mais informações sobre o *error log* e a compreensão do seu conteúdo, consulte a Seção 5.4.2, “The Error Log”.

Para obter informações sobre possíveis erros, consulte também as mensagens do console exibidas quando o MySQL *service* está sendo iniciado. Use o comando **SC START *`mysqld_service_name`*** ou **NET START *`mysqld_service_name`*** na *command line* após instalar o **mysqld** como um *service* para ver quaisquer mensagens de erro relacionadas à inicialização do MySQL server como um *service*. Consulte a Seção 2.3.4.8, “Starting MySQL as a Windows Service”.

Os exemplos a seguir mostram outras mensagens de erro comuns que você pode encontrar ao instalar o MySQL e iniciar o server pela primeira vez:

* Se o MySQL server não conseguir encontrar o *privileges database* `mysql` ou outros arquivos críticos, ele exibirá estas mensagens:

  ```sql
  System error 1067 has occurred.
  Fatal error: Can't open and lock privilege tables:
  Table 'mysql.user' doesn't exist
  ```

  Essas mensagens ocorrem frequentemente quando os *base* ou *data directories* do MySQL são instalados em locais diferentes dos locais padrão (`C:\Program Files\MySQL\MySQL Server 5.7` e `C:\Program Files\MySQL\MySQL Server 5.7\data`, respectivamente).

  Essa situação pode ocorrer quando o MySQL é atualizado e instalado em um novo local, mas o *configuration file* não é atualizado para refletir o novo local. Além disso, arquivos de configuração antigos e novos podem entrar em conflito. Certifique-se de excluir ou renomear quaisquer arquivos de configuração antigos ao atualizar o MySQL.

  Se você instalou o MySQL em um diretório diferente de `C:\Program Files\MySQL\MySQL Server 5.7`, certifique-se de que o MySQL server esteja ciente disso através do uso de um *configuration file* (`my.ini`). Coloque o arquivo `my.ini` em seu diretório Windows, tipicamente `C:\WINDOWS`. Para determinar sua localização exata a partir do valor da variável de ambiente `WINDIR`, execute o seguinte comando no *command prompt*:

  ```sql
  C:\> echo %WINDIR%
  ```

  Você pode criar ou modificar um *option file* com qualquer editor de texto, como o Notepad. Por exemplo, se o MySQL estiver instalado em `E:\mysql` e o *data directory* for `D:\MySQLdata`, você pode criar o *option file* e configurar uma seção `[mysqld]` para especificar valores para as *options* `basedir` e `datadir`:

  ```sql
  [mysqld]
  # set basedir to your installation path
  basedir=E:/mysql
  # set datadir to the location of your data directory
  datadir=D:/MySQLdata
  ```

  Os nomes de caminho (*path names*) do Microsoft Windows são especificados em *option files* usando barras (diagonais) normais (*forward slashes*) em vez de barras invertidas (*backslashes*). Se você usar barras invertidas, duplique-as:

  ```sql
  [mysqld]
  # set basedir to your installation path
  basedir=C:\\Program Files\\MySQL\\MySQL Server 5.7
  # set datadir to the location of your data directory
  datadir=D:\\MySQLdata
  ```

  As regras para o uso de barra invertida em valores de *option file* são fornecidas na Seção 4.2.2.2, “Using Option Files”.

  Se você alterar o valor `datadir` no seu arquivo de configuração do MySQL, você deve mover o conteúdo do *data directory* existente do MySQL antes de reiniciar o MySQL server.

  Consulte a Seção 2.3.4.2, “Creating an Option File”.

* Se você reinstalar ou atualizar o MySQL sem primeiro parar e remover o MySQL *service* existente e instalar o MySQL usando o MySQL Installer, você poderá ver este erro:

  ```sql
  Error: Cannot create Windows service for MySql. Error: 0
  ```

  Isso ocorre quando o *Configuration Wizard* tenta instalar o *service* e encontra um *service* existente com o mesmo nome.

  Uma solução para este problema é escolher um nome de *service* diferente de `mysql` ao usar o *configuration wizard*. Isso permite que o novo *service* seja instalado corretamente, mas deixa o *service* desatualizado no local. Embora isso seja inofensivo, é melhor remover *services* antigos que não estão mais em uso.

  Para remover permanentemente o antigo *service* `mysql`, execute o seguinte comando como um usuário com privilégios administrativos, na *command line*:

  ```sql
  C:\> SC DELETE mysql
  [SC] DeleteService SUCCESS
  ```

  Se o utilitário `SC` não estiver disponível para sua versão do Windows, baixe o utilitário `delsrv` em <http://www.microsoft.com/windows2000/techinfo/reskit/tools/existing/delsrv-o.asp> e use a sintaxe `delsrv mysql`.