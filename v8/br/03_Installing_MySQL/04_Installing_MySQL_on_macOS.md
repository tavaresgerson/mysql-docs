## 2.4 Instalando o MySQL no macOS

Para uma lista das versões do macOS que o servidor MySQL suporta, consulte <https://www.mysql.com/support/supportedplatforms/database.html>.

O MySQL para macOS está disponível em vários formatos diferentes:

* Instalador de pacote nativo, que utiliza o instalador nativo do macOS (DMG) para guiá-lo na instalação do MySQL. Para mais informações, consulte a Seção 2.4.2, “Instalando MySQL no macOS usando pacotes nativos”. Você pode usar o instalador de pacote com o macOS. O usuário que você usa para realizar a instalação deve ter privilégios de administrador.

* Arquivo TAR comprimido, que utiliza um arquivo embalado usando os comandos Unix **tar** e **gzip**. Para usar esse método, você precisa abrir uma janela de **Terminal**. Você não precisa de privilégios de administrador usando esse método; você pode instalar o servidor MySQL em qualquer lugar usando esse método. Para mais informações sobre como usar esse método, você pode usar as instruções genéricas para usar um tarball, Seção 2.2, “Instalando MySQL em Unix/Linux Usando Binários Genéricos”.

Além da instalação básica, o Instalador de Pacotes também inclui a Seção 2.4.3, “Instalando e usando o daemon de lançamento do MySQL” e a Seção 2.4.4, “Instalando e usando o painel de preferências do MySQL” para simplificar a gestão da sua instalação.

Para obter informações adicionais sobre o uso do MySQL no macOS, consulte a Seção 2.4.1, “Observações gerais sobre a instalação do MySQL no macOS”.

### 2.4.1 Notas gerais sobre a instalação do MySQL no macOS

Você deve ter em mente os seguintes pontos e notas:

* **Outras instalações do MySQL**: O procedimento de instalação não reconhece as instalações do MySQL por meio de gerenciadores de pacotes, como o Homebrew. O processo de instalação e atualização é para pacotes do MySQL fornecidos por nós. Se outras instalações estiverem presentes, considere interromper essas instalações antes de executar este instalador para evitar conflitos de porta.

**Homebrew**: Por exemplo, se você instalou o MySQL Server usando Homebrew em sua localização padrão, o instalador do MySQL será instalado em um local diferente e não atualizará a versão do Homebrew. Nesse cenário, você acabará com várias instalações do MySQL que, por padrão, tentam usar os mesmos ports. Parar as outras instâncias do MySQL antes de executar este instalador, como executar *brew services stop mysql* para parar o serviço MySQL do Homebrew.

* **Launchd**: Um daemon de launchd é instalado e altera as opções de configuração do MySQL. Considere editá-lo, se necessário, consulte a documentação abaixo para obter informações adicionais. Além disso, o macOS 10.10 removeu o suporte a itens de inicialização em favor de daemonos de launchd. O painel de preferências MySQL opcional sob as Preferências do Sistema do macOS usa o daemon de launchd.

* **Usuários**: Você pode precisar (ou querer) criar um usuário específico `mysql` para possuir o diretório e os dados do MySQL. Você pode fazer isso através do **Utilitário de Diretório**, e o usuário `mysql` já deve existir. Para uso em modo de usuário único, uma entrada para `_mysql` (note o prefixo sublinhado) já deve existir dentro do arquivo `/etc/passwd` do sistema.

* **Dados**: Como o instalador do pacote MySQL instala o conteúdo do MySQL em um diretório específico para a versão e a plataforma, você pode usar isso para atualizar e migrar seu banco de dados entre versões. Você precisa copiar o diretório `data` da versão antiga para a nova versão, ou especificar um valor alternativo `datadir` para definir a localização do diretório de dados. Por padrão, os diretórios do MySQL são instalados em `/usr/local/`.

* **Aliases**: Você pode querer adicionar aliases ao arquivo de recursos do seu shell para facilitar o acesso a programas comumente usados, como **mysql** e **mysqladmin**, a partir da linha de comando. A sintaxe para **bash** é:

  ```
  alias mysql=/usr/local/mysql/bin/mysql
  alias mysqladmin=/usr/local/mysql/bin/mysqladmin
  ```

Para o **tcsh**, use:

  ```
  alias mysql /usr/local/mysql/bin/mysql
  alias mysqladmin /usr/local/mysql/bin/mysqladmin
  ```

Melhor ainda, adicione `/usr/local/mysql/bin` à sua variável de ambiente `PATH`. Você pode fazer isso modificando o arquivo de inicialização apropriado para o seu shell. Para mais informações, consulte a Seção 6.2.1, “Invocação de programas MySQL”.

* **Remoção**: Após ter copiado os arquivos do banco de dados MySQL da instalação anterior e ter iniciado com sucesso o novo servidor, você deve considerar a remoção dos arquivos da instalação antiga para economizar espaço em disco. Além disso, você também deve remover as versões mais antigas dos diretórios de Receituário de Pacotes localizados em `/Library/Receipts/mysql-VERSION.pkg`.

### 2.4.2 Instalar o MySQL no macOS usando pacotes nativos

O pacote está localizado dentro de um arquivo de imagem de disco (`.dmg`) que você primeiro precisa montar clicando duas vezes em seu ícone no Finder. Ele deve então montar a imagem e exibir seu conteúdo.

Nota

Antes de prosseguir com a instalação, certifique-se de parar todas as instâncias do servidor MySQL em execução usando o Aplicativo do Gestor MySQL (no macOS Server), o painel de preferências ou **mysqladmin shutdown** na linha de comando.

Para instalar o MySQL usando o instalador de pacotes:

1. Faça o download do arquivo de imagem do disco (`.dmg`) (a versão comunitária está disponível [aqui][(https://dev.mysql.com/downloads/mysql/)]) que contém o instalador do pacote MySQL. Clique duas vezes no arquivo para montar a imagem do disco e veja seu conteúdo.

Faça duplo clique no pacote do instalador do MySQL a partir do disco. Ele é nomeado de acordo com a versão do MySQL que você baixou. Por exemplo, para o servidor MySQL 8.0.44, pode ser chamado de `mysql-8.0.44-macos-10.13-x86_64.pkg`.

2. A tela inicial do assistente de introdução faz referência à versão do servidor MySQL a ser instalada. Clique em Continuar para iniciar a instalação.

A edição comunitária do MySQL exibe uma cópia da licença de uso público geral GNU relevante. Clique em Continuar e, em seguida, em Concordar para continuar.

3. Na página Tipo de instalação, você pode clicar em Instalar para executar o assistente de instalação com todos os valores padrão, clicar em Personalizar para alterar quais componentes serão instalados (servidor MySQL, Teste MySQL, Painel de preferências, Suporte Launchd -- todos, exceto o Teste MySQL, são habilitados por padrão).

Nota

Embora a opção "Instalar em local diferente" seja visível, o local de instalação não pode ser alterado.

**Figura 2.13 Guia do Instalador do Pacote MySQL: Tipo de Instalação**

   ![Content is described in the surrounding text.](images/mac-installer-installation-type-standard.png)

**Figura 2.14 Guia do Instalador de Pacotes MySQL: Personalizar**

   ![Customize shows three package name options: MySQL Server, MySQL Test, Preference Pane, and Launchd Support. All three options are checked.](images/mac-installer-installation-type-customize.png)

4. Clique em Instalar para instalar o MySQL Server. O processo de instalação termina aqui se estiver atualizando uma instalação atual do MySQL Server, caso contrário, siga os passos adicionais de configuração do assistente para sua nova instalação do MySQL Server.

5. Após a instalação bem-sucedida do novo servidor MySQL, complete os passos de configuração escolhendo o tipo de criptografia padrão para as senhas, defina a senha do root e também habilite (ou desabilite) o servidor MySQL no início.

6. O mecanismo de senha padrão do MySQL 8.0 é `caching_sha2_password` (Forte), e este passo permite que você o mude para `mysql_native_password` (Legado).

**Figura 2.15 Guia do Instalador do Pacote MySQL: Escolha um Tipo de Encriptação de Senha**

   ![Most content is described in the surrounding text. The installer refers to caching_sha2_password as "Use Strong Password Encryption" and mysql_native_password as a "Use Legacy Password Encryption".](images/mac-installer-configuration-password-type.png)

Escolher o mecanismo de senha de legado altera o arquivo gerado do launchd para definir `--default_authentication_plugin=mysql_native_password` em `ProgramArguments`. Escolher criptografia de senha forte não define `--default_authentication_plugin`, porque o valor padrão do servidor MySQL é usado, que é `caching_sha2_password`.

7. Defina uma senha para o usuário root e, também, configure se o MySQL Server deve iniciar após a etapa de configuração ser concluída.

**Figura 2.16 Guia do Instalador do Pacote MySQL: Defina a Senha do Root**

   ![Content is described in the surrounding text.](images/mac-installer-configuration-password-define.png)

8. O resumo é a etapa final e faz referência a uma instalação bem-sucedida e completa do MySQL Server. Feche o assistente.

**Figura 2.17 Guia do Instalador de Pacotes MySQL: Resumo**

   ![Shows that the installation was a success, and includes links to the MySQL manual, mysql.com, and oracle.com.](images/mac-installer-summary.png)

O servidor MySQL está instalado agora. Se você escolheu não iniciar o MySQL, então use launchctl a partir da linha de comando ou inicie o MySQL clicando em "Iniciar" usando o painel de preferências do MySQL. Para informações adicionais, consulte a Seção 2.4.3, “Instalando e Usando o Daemon de Lançamento do MySQL”, e a Seção 2.4.4, “Instalando e Usando o Painel de Preferências do MySQL”. Use o Painel de preferências do MySQL ou launchd para configurar o MySQL para iniciar automaticamente no momento do boot.

Ao instalar usando o instalador de pacotes, os arquivos são instalados em um diretório dentro de `/usr/local` que corresponde ao nome da versão de instalação e da plataforma. Por exemplo, o arquivo do instalador `mysql-8.0.44-macos10.15-x86_64.dmg` instala o MySQL em `/usr/local/mysql-8.0.44-macos10.15-x86_64/` com um symlink para `/usr/local/mysql`. O seguinte quadro mostra o layout desse diretório de instalação do MySQL.

Nota

O processo de instalação do macOS não cria nem instala um arquivo de configuração de amostra `my.cnf` do MySQL.

**Tabela 2.7. Estrutura de instalação do MySQL no macOS**

<table><col style="width: 45%"/><col style="width: 55%"/><thead><tr> <th>Directory</th> <th>Conteúdo do Diretório</th> </tr></thead><tbody><tr> <td><code>bin</code></td> <td>servidor mysqld, programas de cliente e utilitários</td> </tr><tr> <td><code>data</code></td> <td>Arquivos de registro, bancos de dados, onde<code>/usr/local/mysql/data/mysqld.local.err</code>é o log de erro padrão</td> </tr><tr> <td><code>docs</code></td> <td>Documentos auxiliares, como as Notas de lançamento e as informações de construção</td> </tr><tr> <td><code>include</code></td> <td>Incluir arquivos (cabeçalho)</td> </tr><tr> <td><code>lib</code></td> <td>Livrarias</td> </tr><tr> <td><code>man</code></td> <td>Páginas do manual do Unix</td> </tr><tr> <td><code>mysql-test</code></td> <td>Conjunto de testes do MySQL ('MySQL Test' é desativado por padrão durante o processo de instalação quando se usa o pacote de instalação (DMG))</td> </tr><tr> <td><code>share</code></td> <td>Arquivos de suporte diversos, incluindo mensagens de erro,<code>dictionary.txt</code>, e reescreveu o SQL</td> </tr><tr> <td><code>support-files</code></td> <td>Scripts de suporte, como<code>mysqld_multi.server</code>,<code>mysql.server</code>, e<code>mysql-log-rotate</code>.</td> </tr><tr> <td><code>/tmp/mysql.sock</code></td> <td>Localização do soquete Unix do MySQL</td> </tr></tbody></table>

### 2.4.3 Instalar e usar o daemon de lançamento do MySQL

O macOS utiliza demonios de lançamento para iniciar, parar e gerenciar processos e aplicativos automaticamente, como o MySQL.

Por padrão, o pacote de instalação (DMG) no macOS instala um arquivo launchd chamado `/Library/LaunchDaemons/com.oracle.oss.mysql.mysqld.plist` que contém uma definição plist semelhante a:

```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>             <string>com.oracle.oss.mysql.mysqld</string>
    <key>ProcessType</key>       <string>Interactive</string>
    <key>Disabled</key>          <false/>
    <key>RunAtLoad</key>         <true/>
    <key>KeepAlive</key>         <true/>
    <key>SessionCreate</key>     <true/>
    <key>LaunchOnlyOnce</key>    <false/>
    <key>UserName</key>          <string>_mysql</string>
    <key>GroupName</key>         <string>_mysql</string>
    <key>ExitTimeOut</key>       <integer>600</integer>
    <key>Program</key>           <string>/usr/local/mysql/bin/mysqld</string>
    <key>ProgramArguments</key>
        <array>
            <string>/usr/local/mysql/bin/mysqld</string>
            <string>--user=_mysql</string>
            <string>--basedir=/usr/local/mysql</string>
            <string>--datadir=/usr/local/mysql/data</string>
            <string>--plugin-dir=/usr/local/mysql/lib/plugin</string>
            <string>--log-error=/usr/local/mysql/data/mysqld.local.err</string>
            <string>--pid-file=/usr/local/mysql/data/mysqld.local.pid</string>
            <string>--keyring-file-data=/usr/local/mysql/keyring/keyring</string>
            <string>--early-plugin-load=keyring_file=keyring_file.so</string>
        </array>
    <key>WorkingDirectory</key>  <string>/usr/local/mysql</string>
</dict>
</plist>
```

Nota

Alguns usuários relatam que a adição de uma declaração plist DOCTYPE causa o fracasso da operação do launchd, apesar de passar na verificação de lint. Suspeitamos que seja um erro de cópia e cola. O checksum md5 de um arquivo que contém o trecho acima é *d925f05f6d1b6ee5ce5451b596d6baed*.

Para habilitar o serviço launchd, você pode:

* Abra as preferências do sistema do macOS e selecione o painel de preferências do MySQL, em seguida, execute Iniciar o servidor MySQL.

**Figura 2.18 Painel de Preferências do MySQL: Localização**

  ![Shows "MySQL" typed into the macOS System Preferences search box, and a highlighted "MySQL" icon in the bottom left portion of the MySQL Preference Pane.](images/mac-installer-preference-pane-location.png)

A página Instâncias inclui uma opção para iniciar ou parar o MySQL, e Inicializar banco de dados recria o diretório `data/`. Desinstalar desinstala o MySQL Server e, opcionalmente, o painel de preferências do MySQL e as informações do launchd.

**Figura 2.19 Painel de Preferências do MySQL: Instâncias**

  ![The left side shows a list of MySQL instances separated by "Active Instance", "Installed Instances", and "Data Directories" sections. The right side shows a "Stop MySQL Server" button, a check box titled "Start MySQL when your computer starts up", and "Initialize Database" and "Uninstall" buttons. Several fields reference 8.0.11 as the current installed MySQL version.](images/mac-installer-preference-pane-instances.png)

* Ou, carregue manualmente o arquivo launchd.

  ```
  $> cd /Library/LaunchDaemons
  $> sudo launchctl load -F com.oracle.oss.mysql.mysqld.plist
  ```

* Para configurar o MySQL para iniciar automaticamente ao inicializar, você pode:

  ```
  $> sudo launchctl load -w com.oracle.oss.mysql.mysqld.plist
  ```

Nota

Ao atualizar o servidor MySQL, o processo de instalação do launchd remove os itens de inicialização antigos que foram instalados com o servidor MySQL 5.7.7 e versões anteriores.

A atualização também substitui seu arquivo existente de launchd chamado `com.oracle.oss.mysql.mysqld.plist`.

Informações adicionais relacionadas ao launchd:

* As entradas do plist substituem as entradas de `my.cnf`, porque são passadas como argumentos na linha de comando. Para informações adicionais sobre como passar opções de programa, consulte a Seção 6.2.2, “Especificação de Opções de Programa”.

* A seção **ProgramArguments** define as opções de linha de comando que são passadas para o programa, que é o binário `mysqld` neste caso.

* A definição plist padrão é escrita com casos de uso menos sofisticados em mente. Para configurações mais complicadas, você pode querer remover alguns dos argumentos e, em vez disso, confiar em um arquivo de configuração MySQL, como `my.cnf`.

* Se você editar o arquivo plist, desmarque a opção do instalador ao reinstalar ou atualizar o MySQL. Caso contrário, o arquivo plist editado será sobrescrito e todas as edições serão perdidas.

Como a definição padrão do plist define vários **ProgramArguments**, você pode remover a maioria desses argumentos e, em vez disso, confiar no arquivo de configuração `my.cnf` do MySQL para defini-los. Por exemplo:

```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>             <string>com.oracle.oss.mysql.mysqld</string>
    <key>ProcessType</key>       <string>Interactive</string>
    <key>Disabled</key>          <false/>
    <key>RunAtLoad</key>         <true/>
    <key>KeepAlive</key>         <true/>
    <key>SessionCreate</key>     <true/>
    <key>LaunchOnlyOnce</key>    <false/>
    <key>UserName</key>          <string>_mysql</string>
    <key>GroupName</key>         <string>_mysql</string>
    <key>ExitTimeOut</key>       <integer>600</integer>
    <key>Program</key>           <string>/usr/local/mysql/bin/mysqld</string>
    <key>ProgramArguments</key>
        <array>
            <string>/usr/local/mysql/bin/mysqld</string>
            <string>--user=_mysql</string>
            <string>--basedir=/usr/local/mysql</string>
            <string>--datadir=/usr/local/mysql/data</string>
            <string>--plugin-dir=/usr/local/mysql/lib/plugin</string>
            <string>--log-error=/usr/local/mysql/data/mysqld.local.err</string>
            <string>--pid-file=/usr/local/mysql/data/mysqld.local.pid</string>
            <string>--keyring-file-data=/usr/local/mysql/keyring/keyring</string>
            <string>--early-plugin-load=keyring_file=keyring_file.so</string>
        </array>
    <key>WorkingDirectory</key>  <string>/usr/local/mysql</string>
</dict>
</plist>
```

Neste caso, as opções `basedir`, `datadir`, `plugin_dir`, `log_error`, `pid_file`, `keyring_file_data` e `--early-plugin-load` foram removidas da definição padrão do plist *ProgramArguments*, que você pode ter definido em `my.cnf` em vez disso.

### 2.4.4 Instalar e usar o painel de preferências do MySQL

O Pacote de Instalação do MySQL inclui um painel de preferências do MySQL que permite iniciar, parar e controlar a inicialização automatizada durante o arranque da sua instalação do MySQL.

Essa aba de preferências é instalada por padrão e está listada na janela *Preferências do sistema* do seu sistema.

**Figura 2.20: Painel de Preferências do MySQL: Localização**

![Shows "MySQL" typed into the macOS System Preferences search box, and a highlighted "MySQL" icon in the bottom left.](images/mac-installer-preference-pane-location.png)

O painel de preferências do MySQL é instalado com o mesmo arquivo DMG que instala o MySQL Server. Normalmente, é instalado com o MySQL Server, mas também pode ser instalado por si só.

Para instalar o painel de preferências do MySQL:

1. Siga o processo de instalação do servidor MySQL, conforme descrito na documentação na Seção 2.4.2, “Instalando MySQL no macOS usando pacotes nativos”.

2. Clique em Personalizar na etapa do Tipo de instalação. A opção "Painel de Preferências" está listada lá e habilitada por padrão; certifique-se de que ela não esteja des selecionada. As outras opções, como o MySQL Server, podem ser selecionadas ou des selecionadas.

**Figura 2.21 Guia do Instalador de Pacotes MySQL: Personalizar**

   ![Customize shows three package name options: MySQL Server, MySQL Test, Preference Pane, and Launchd Support. All three options are checked.](images/mac-installer-installation-type-customize.png)

3. Complete o processo de instalação.

Nota

O painel de preferências do MySQL só inicia e para a instalação do MySQL instalada a partir da instalação do pacote MySQL que foram instalados na localização padrão.

Depois que o painel de preferências do MySQL foi instalado, você pode controlar sua instância do servidor MySQL usando este painel de preferências.

A página Instâncias inclui uma opção para iniciar ou parar o MySQL, e Inicializar Banco de Dados recria o diretório `data/`. Desinstalar desinstala o MySQL Server e, opcionalmente, o painel de preferências do MySQL e as informações do launchd.

**Figura 2.22 Painel de Preferências do MySQL: Instâncias**

![The left side shows a list of MySQL instances separated by "Active Instance", "Installed Instances", and "Data Directories" sections. The right side shows a "Stop MySQL Server" button, a check box titled "Start MySQL when your computer starts up", and "Initialize Database" and "Uninstall" buttons. Several fields reference 8.0.11 as the current installed MySQL version.](images/mac-installer-preference-pane-instances.png)

**Figura 2.23 Painel de Preferências do MySQL: Inicializar o Banco de Dados**

![Shows an option to enter the root password, along with choosing between two password types: Strong Password Encryption that is suggested for MySQL 8 clients or Legacy Password Encryption with compatibility with older MySQL 5.x clients. The optional "Load configuration file" option is loaded by mysqld during initialization, and it notes that plugin-specific options may prevent the initialization from completing.](images/mac-installer-preference-pane-initialize.png)

A página de Configuração exibe as opções do Servidor MySQL, incluindo o caminho para o arquivo de configuração do MySQL.

**Figura 2.24 Painel de Preferências do MySQL: Configuração**

![Content is described in the surrounding text.](images/mac-installer-preference-pane-configuration.png)

O Painel de Preferências do MySQL mostra o status atual do servidor MySQL, mostrando parado (em vermelho) se o servidor não estiver em execução e em execução (em verde) se o servidor já tiver sido iniciado. O painel de preferências também mostra a configuração atual de se o servidor MySQL foi configurado para iniciar automaticamente.