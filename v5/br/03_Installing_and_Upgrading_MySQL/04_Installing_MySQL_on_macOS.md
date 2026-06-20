## 2.4 Instalando o MySQL no macOS

Para uma lista das versões do macOS que o servidor MySQL suporta, consulte <https://www.mysql.com/support/supportedplatforms/database.html>.

O MySQL para macOS está disponível em vários formatos diferentes:

* Instalador de pacote nativo, que utiliza o instalador nativo do macOS (DMG) para guiá-lo na instalação do MySQL. Para mais informações, consulte a Seção 2.4.2, “Instalando MySQL no macOS usando pacotes nativos”. Você pode usar o instalador de pacote com o macOS. O usuário que você usa para realizar a instalação deve ter privilégios de administrador.

* Arquivo TAR comprimido, que utiliza um arquivo embalado usando os comandos Unix **tar** e **gzip**. Para usar esse método, você precisa abrir uma janela de **Terminal**. Não é necessário privilégios de administrador usando esse método, pois você pode instalar o servidor MySQL em qualquer lugar usando esse método. Para mais informações sobre como usar esse método, você pode usar as instruções genéricas para usar um tarball, Seção 2.2, “Instalando MySQL em Unix/Linux Usando Binários Genéricos”.

Além da instalação básica, o Instalador de Pacotes também inclui a Seção 2.4.3, “Instalando um Daemon de Início do MySQL” e a Seção 2.4.4, “Instalando e Usando o Painel de Preferências do MySQL”, ambas que simplificam a gestão da sua instalação.

Para obter informações adicionais sobre o uso do MySQL no macOS, consulte a Seção 2.4.1, “Observações gerais sobre a instalação do MySQL no macOS”.

### 2.4.1 Notas gerais sobre a instalação do MySQL no macOS

Você deve ter em mente os seguintes pontos e notas:

* A partir do macOS 10.14 (Majave), o aplicativo Instalador do MySQL 5.7 do macOS requer permissão para controlar *Eventos do Sistema* para que possa exibir uma senha de raiz MySQL gerada (temporária). Escolher "Não permitir" significa que essa senha não será visível para uso.

Se anteriormente não permitido, a correção habilita o *System Events.app* para o *Installer.app* na aba *Segurança e privacidade | *Automação | *Privacidade*.

* Um daemon do launchd é instalado e inclui opções de configuração do MySQL. Considere editar se necessário, consulte a documentação abaixo para obter informações adicionais. Além disso, o macOS 10.10 removeu o suporte ao item de inicialização em favor dos daemon do launchd. O painel de preferências MySQL opcional sob as Preferências do Sistema do macOS usa o daemon do launchd.

* Você pode precisar (ou querer) criar um usuário específico `mysql` para possuir o diretório e os dados do MySQL. Você pode fazer isso através do **Utilitário de Diretório**, e o usuário `mysql` já deve existir. Para uso em modo de usuário único, uma entrada para `_mysql` (note o prefixo sublinhado) já deve existir dentro do arquivo `/etc/passwd` do sistema.

* Como o instalador do pacote MySQL instala o conteúdo do MySQL em um diretório específico para a versão e a plataforma, você pode usar isso para atualizar e migrar seu banco de dados entre versões. Você precisa copiar o diretório `data` da versão antiga para a nova versão, ou especificar um valor alternativo `datadir` para definir a localização do diretório de dados. Por padrão, os diretórios do MySQL são instalados em `/usr/local/`.

* Você pode querer adicionar aliases ao arquivo de recursos do seu shell para facilitar o acesso a programas comumente usados, como **mysql** e **mysqladmin**, a partir da linha de comando. A sintaxe para **bash** é:

  ```sql
  alias mysql=/usr/local/mysql/bin/mysql
  alias mysqladmin=/usr/local/mysql/bin/mysqladmin
  ```

Para o **tcsh**, use:

  ```sql
  alias mysql /usr/local/mysql/bin/mysql
  alias mysqladmin /usr/local/mysql/bin/mysqladmin
  ```

Melhor ainda, adicione `/usr/local/mysql/bin` à sua variável de ambiente `PATH`. Você pode fazer isso modificando o arquivo de inicialização apropriado para o seu shell. Para mais informações, consulte a Seção 4.2.1, “Invocação de programas MySQL”.

* Após ter copiado os arquivos do banco de dados MySQL da instalação anterior e iniciado com sucesso o novo servidor, você deve considerar a remoção dos arquivos da instalação antiga para economizar espaço em disco. Além disso, você também deve remover as versões mais antigas dos diretórios de Receituário de Pacotes localizados em `/Library/Receipts/mysql-VERSION.pkg`.

### 2.4.2 Instalar o MySQL no macOS usando pacotes nativos

O pacote está localizado dentro de um arquivo de imagem de disco (`.dmg`) que você primeiro precisa montar clicando duas vezes em seu ícone no Finder. Ele deve então montar a imagem e exibir seu conteúdo.

Nota

Antes de prosseguir com a instalação, certifique-se de parar todas as instâncias do servidor MySQL em execução usando o Aplicativo do Gestor MySQL (no macOS Server), o painel de preferências ou **mysqladmin shutdown** na linha de comando.

Para instalar o MySQL usando o instalador de pacotes:

1. Faça o download do arquivo de imagem do disco (`.dmg`) (a versão comunitária está disponível aqui) que contém o instalador do pacote MySQL. Clique duas vezes no arquivo para montar a imagem do disco e veja seu conteúdo.

**Figura 2.13 Instalação do pacote MySQL: Conteúdo do DMG**

   ![Mounted macOS disk image contents that contains the MySQL Server package file.](images/mac-installer-dmg-contents.png)

2. Faça duplo clique no pacote do instalador do MySQL a partir do disco. Ele é nomeado de acordo com a versão do MySQL que você baixou. Por exemplo, para o servidor MySQL 5.7.44, pode ser chamado de `mysql-5.7.44-macos-10.13-x86_64.pkg`.

3. A tela inicial do assistente de introdução faz referência à versão do servidor MySQL a ser instalada. Clique em Continuar para iniciar a instalação.

**Figura 2.14 Guia do Instalador de Pacotes MySQL: Introdução**

   ![Shows that the installation is ready to start, the MySQL server version being installed, and includes links to the MySQL manual, mysql.com, and oracle.com.](images/mac-installer-dmg-introduction.png)

4. A edição comunitária do MySQL exibe uma cópia da Licença Pública Geral GNU relevante. Clique em Continuar e, em seguida, em Concordar para continuar.

5. Na página Tipo de instalação, você pode clicar em Instalar para executar o assistente de instalação com todos os valores padrão, clicar em Personalizar para alterar quais componentes serão instalados (servidor MySQL, Painel de preferências, Suporte Launchd — todos habilitados por padrão).

Nota

Embora a opção "Instalar em local diferente" seja visível, o local de instalação não pode ser alterado.

**Figura 2.15 Guia do Instalador do Pacote MySQL: Tipo de Instalação**

   ![Content is described in the surrounding text.](images/mac-installer-installation-type.png)

**Figura 2.16 Guia do Instalador de Pacotes MySQL: Personalizar**

   ![Customize shows three package name options: MySQL Server, Preference Pane, and Launchd Support. All three options are checked.](images/mac-installer-installation-customize.png)

6. Clique em Instalar para iniciar o processo de instalação.

7. Após a instalação bem-sucedida, o instalador exibe uma janela com sua senha de raiz temporária. Essa senha não pode ser recuperada, então você deve salvar essa senha para o login inicial no MySQL. Por exemplo:

**Figura 2.17 Guia do Instalador do Pacote MySQL: Senha de Raiz Temporária**

   ![Content is described in the surrounding text.](images/mac-installer-root-password.png)

Nota

O MySQL expira essa senha de raiz temporária após o login inicial e exige que você crie uma nova senha.

8. O resumo é a etapa final e faz referência a uma instalação bem-sucedida e completa do MySQL Server. Feche o assistente.

**Figura 2.18 Guia do Instalador de Pacotes MySQL: Resumo**

   ![Shows that the installation was a success, and includes links to the MySQL manual, mysql.com, and oracle.com.](images/mac-installer-summary.png)

O servidor MySQL está instalado, mas não é carregado (ou iniciado) por padrão. Use o launchctl a partir da linha de comando ou inicie o MySQL clicando em "Iniciar" usando o painel de preferências do MySQL. Para informações adicionais, consulte a Seção 2.4.3, “Instalando um daemon de inicialização do MySQL”, e a Seção 2.4.4, “Instalando e usando o painel de preferências do MySQL”. Use o painel de preferências do MySQL ou o launchd para configurar o MySQL para iniciar automaticamente no momento do boot.

Ao instalar usando o instalador de pacotes, os arquivos são instalados em um diretório dentro de `/usr/local` que corresponde ao nome da versão de instalação e da plataforma. Por exemplo, o arquivo do instalador `mysql-5.7.44-macos10.13-x86_64.dmg` instala o MySQL em `/usr/local/mysql-5.7.44-macos10.13-x86_64/`. O seguinte quadro mostra o layout do diretório de instalação.

**Tabela 2.7. Estrutura de instalação do MySQL no macOS**

<table>
<thead>
<tr>
<th>Directory</th>
<th>Conteúdo do Diretório</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>bin</code></td>
<td><strong>mysqld</strong>programas de servidor, cliente e utilitário</td>
</tr>
<tr>
<td><code>data</code></td>
<td>Arquivos de registro, bancos de dados</td>
</tr>
<tr>
<td><code>docs</code></td>
<td>Documentos auxiliares, como as Notas de lançamento e as informações de construção</td>
</tr>
<tr>
<td><code>include</code></td>
<td>Incluir arquivos (cabeçalho)</td>
</tr>
<tr>
<td><code>lib</code></td>
<td>Livrarias</td>
</tr>
<tr>
<td><code>man</code></td>
<td>Páginas do manual do Unix</td>
</tr>
<tr>
<td><code>mysql-test</code></td>
<td>Conjunto de testes MySQL</td>
</tr>
<tr>
<td><code>share</code></td>
<td>Arquivos de suporte diversos, incluindo mensagens de erro, arquivos de configuração de amostra, SQL para instalação de banco de dados</td>
</tr>
<tr>
<td><code>support-files</code></td>
<td>E scripts e arquivos de configuração de amostra</td>
</tr>
<tr>
<td><code>/tmp/mysql.sock</code></td>
<td>Localização do soquete Unix do MySQL</td>
</tr>
</tbody>
</table>

Durante o processo de instalação do pacote, um link simbólico de `/usr/local/mysql` para o diretório específico da versão/plataforma criado durante a instalação é criado automaticamente.

### 2.4.3 Instalar um daemon de lançamento do MySQL

O macOS utiliza demonios de lançamento para iniciar, parar e gerenciar processos e aplicativos automaticamente, como o MySQL.

Por padrão, o pacote de instalação (DMG) no macOS instala um arquivo launchd chamado `/Library/LaunchDaemons/com.oracle.oss.mysql.mysqld.plist` que contém uma definição plist semelhante a:

```sql
<?xml version="1.0" encoding="utf-8"?>
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
        </array>
    <key>WorkingDirectory</key>  <string>/usr/local/mysql</string>
</dict>
</plist>
```

Nota

Alguns usuários relatam que a adição de uma declaração plist DOCTYPE causa o fracasso da operação do launchd, apesar de passar na verificação de lint. Suspeitamos que seja um erro de cópia e colagem. O checksum md5 de um arquivo que contém o trecho acima é *24710a27dc7a28fb7ee6d825129cd3cf*.

Para habilitar o serviço launchd, você pode:

* Clique em Iniciar o servidor MySQL no painel de preferências do MySQL.

**Figura 2.19 Painel de Preferências do MySQL: Localização**

  ![Content is described in the surrounding text.](images/mac-installer-preference-pane-location.png)

**Figura 2.20 Painel de Preferências do MySQL: Uso**

  ![Content is described in the surrounding text.](images/mac-installer-preference-pane-usage.png)

* Ou, carregue manualmente o arquivo launchd.

  ```sql
  $> cd /Library/LaunchDaemons
  $> sudo launchctl load -F com.oracle.oss.mysql.mysqld.plist
  ```

* Para configurar o MySQL para iniciar automaticamente ao inicializar, você pode:

  ```sql
  $> sudo launchctl load -w com.oracle.oss.mysql.mysqld.plist
  ```

Nota

Ao atualizar o servidor MySQL, o processo de instalação do launchd remove os itens de inicialização antigos que foram instalados com o servidor MySQL 5.7.7 e versões anteriores.

A atualização também substitui seu arquivo existente **launchd** com o mesmo nome.

Informações adicionais relacionadas ao **launchd**:

* As entradas `plist` substituem as entradas `my.cnf`, porque são passadas como argumentos na linha de comando. Para informações adicionais sobre como passar opções de programa, consulte a Seção 4.2.2, “Especificação de Opções de Programa”.

* A seção **ProgramArguments** define as opções de linha de comando que são passadas para o programa, que é o binário `mysqld` neste caso.

* A definição padrão `plist` é escrita com casos de uso menos sofisticados em mente. Para configurações mais complicadas, você pode querer remover alguns dos argumentos e, em vez disso, confiar em um arquivo de configuração do MySQL, como `my.cnf`.

* Se você editar o arquivo `plist`, desmarque a opção do instalador ao reinstalar ou atualizar o MySQL. Caso contrário, o arquivo `plist` editado será sobrescrito, com a perda de todas as alterações que você fez.

Como a definição padrão do `plist` define vários **ProgramArguments**, você pode remover a maioria desses argumentos e, em vez disso, confiar no arquivo de configuração do MySQL do `my.cnf` para defini-los. Por exemplo:

```sql
<?xml version="1.0" encoding="utf-8"?>
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
    <key>WorkingDirectory</key>  <string>/usr/local/mysql</string>
    <key>ProgramArguments</key>
        <array>
            <string>/usr/local/mysql/bin/mysqld</string>
            <string>--user=_mysql</string>
        </array>
</dict>
</plist>
```

Neste caso, as opções `basedir`, `datadir`, `plugin_dir`, `log_error` e `pid_file` foram removidas da definição do plist, e então você pode defini-las em `my.cnf`.

### 2.4.4 Instalar e usar o painel de preferências do MySQL

O Pacote de Instalação do MySQL inclui um painel de preferências do MySQL que permite iniciar, parar e controlar a inicialização automatizada durante o arranque da sua instalação do MySQL.

Essa aba de preferências é instalada por padrão e está listada na janela *Preferências do sistema* do seu sistema.

**Figura 2.21 Painel de Preferências do MySQL: Localização**

![Content is described in the surrounding text.](images/mac-installer-preference-pane-location.png)

Para instalar o Painel de Preferências do MySQL:

1. Faça o download do arquivo de imagem do disco (`.dmg`) (a versão comunitária está disponível aqui) que contém o instalador do pacote MySQL. Clique duas vezes no arquivo para montar a imagem do disco e veja seu conteúdo.

**Figura 2.22 Instalação do pacote MySQL: Conteúdo do DMG**

   ![Content is described in the surrounding text.](images/mac-installer-dmg-contents.png)

2. Siga o processo de instalação do servidor MySQL, conforme descrito na documentação na Seção 2.4.2, “Instalando MySQL no macOS usando pacotes nativos”.

3. Clique em Personalizar na etapa de Tipo de instalação. A opção "Painel de Preferências" está listada lá e habilitada por padrão; certifique-se de que ela não esteja des selecionada.

**Figura 2.23 Instalação do MySQL no macOS: Personalizar**

   ![Content is described in the surrounding text.](images/mac-installer-installation-customize.png)

4. Conclua o processo de instalação do servidor MySQL.

Nota

O painel de preferências do MySQL só inicia e para a instalação do MySQL instalada a partir da instalação do pacote MySQL que foram instalados na localização padrão.

Depois que o painel de preferências do MySQL foi instalado, você pode controlar sua instância do servidor MySQL usando o painel de preferências. Para usar o painel de preferências, abra as Preferências do Sistema... no menu Apple. Selecione o painel de preferências do MySQL clicando no ícone MySQL na lista de painéis de preferências.

**Figura 2.24 Painel de Preferências do MySQL: Localização**

![Content is described in the surrounding text.](images/mac-installer-preference-pane-location.png)

**Figura 2.25 Painel de Preferências do MySQL: Uso**

![Content is described in the surrounding text.](images/mac-installer-preference-pane-usage.png)

O Painel de Preferências do MySQL mostra o status atual do servidor MySQL, mostrando parado (em vermelho) se o servidor não estiver em execução e em execução (em verde) se o servidor já tiver sido iniciado. O painel de preferências também mostra a configuração atual de se o servidor MySQL foi configurado para iniciar automaticamente.

* **Para iniciar o servidor MySQL usando o painel de preferências:**

Clique em Iniciar o servidor MySQL. Você pode ser solicitado a fornecer o nome de usuário e a senha de um usuário com privilégios de administrador para iniciar o servidor MySQL.

* **Para parar o servidor MySQL usando o painel de preferências:**

Clique em Parar o servidor MySQL. Você pode ser solicitado a fornecer o nome de usuário e a senha de um usuário com privilégios de administrador para parar o servidor MySQL.

* **Para iniciar automaticamente o servidor MySQL quando o sistema é iniciado:**

Marque a caixa de seleção ao lado de Iniciar automaticamente o servidor MySQL no início.

* **Para desativar o início automático do servidor MySQL quando o sistema é iniciado:**

Desmarque a caixa de seleção ao lado de Iniciar automaticamente o servidor MySQL no início.

Você pode fechar a janela **Preferências do Sistema...** assim que tiver concluído as configurações.