### 2.4.3 Instalação e uso do daemon de inicialização do MySQL

O macOS usa demoníaios de inicialização para iniciar, parar e gerenciar automaticamente processos e aplicativos, como o MySQL.

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

Alguns usuários relatam que a adição de uma declaração de DOCTYPE plist causa o falha da operação do launchd, apesar de passar na verificação de lint. Acreditamos que seja um erro de cópia e colagem. O checksum md5 de um arquivo que contém o trecho acima é *d925f05f6d1b6ee5ce5451b596d6baed*.

Para habilitar o serviço launchd, você pode:

- Abra as preferências do sistema do macOS e selecione o painel de preferências do MySQL, em seguida, execute Iniciar o servidor MySQL.

  **Figura 2.18 Painel de Preferências do MySQL: Localização**

  ![Shows "MySQL" typed into the macOS System Preferences search box, and a highlighted "MySQL" icon in the bottom left portion of the MySQL Preference Pane.](images/mac-installer-preference-pane-location.png)

  A página Instâncias inclui uma opção para iniciar ou parar o MySQL, e Inicializar Banco de Dados recria o diretório `data/`. A desinstalação desinstala o MySQL Server e, opcionalmente, o painel de preferências do MySQL e as informações do launchd.

  **Figura 2.19 Painel de Preferências do MySQL: Instâncias**

  ![The left side shows a list of MySQL instances separated by "Active Instance", "Installed Instances", and "Data Directories" sections. The right side shows a "Stop MySQL Server" button, a check box titled "Start MySQL when your computer starts up", and "Initialize Database" and "Uninstall" buttons. Several fields reference 8.0.11 as the current installed MySQL version.](images/mac-installer-preference-pane-instances.png)

- Ou, carregue manualmente o arquivo launchd.

  ```
  $> cd /Library/LaunchDaemons
  $> sudo launchctl load -F com.oracle.oss.mysql.mysqld.plist
  ```

- Para configurar o MySQL para iniciar automaticamente ao inicializar, você pode:

  ```
  $> sudo launchctl load -w com.oracle.oss.mysql.mysqld.plist
  ```

Nota

Ao atualizar o servidor MySQL, o processo de instalação do launchd remove os itens de inicialização antigos que foram instalados com o servidor MySQL 5.7.7 e versões anteriores.

A atualização também substitui seu arquivo existente do launchd chamado `com.oracle.oss.mysql.mysqld.plist`.

Informações adicionais sobre o launchd:

- As entradas do arquivo plist substituem as entradas do `my.cnf`, pois são passadas como argumentos na linha de comando. Para obter informações adicionais sobre como passar opções de programa, consulte a Seção 6.2.2, “Especificação de Opções de Programa”.

- A seção **ProgramArguments** define as opções de linha de comando que são passadas para o programa, que é o binário `mysqld` neste caso.

- A definição padrão do arquivo plist é escrita com casos de uso menos sofisticados em mente. Para configurações mais complicadas, você pode querer remover alguns dos argumentos e, em vez disso, confiar em um arquivo de configuração do MySQL, como `my.cnf`.

- Se você editar o arquivo plist, desmarque a opção do instalador ao reinstalar ou atualizar o MySQL. Caso contrário, o arquivo plist editado será sobrescrito e todas as edições serão perdidas.

Como a definição padrão do arquivo plist define vários **ProgramArguments**, você pode remover a maioria desses argumentos e, em vez disso, confiar no arquivo de configuração `my.cnf` do MySQL para defini-los. Por exemplo:

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

Neste caso, as opções `basedir`, `datadir`, `plugin_dir`, `log_error`, `pid_file`, `keyring_file_data` e `--early-plugin-load` foram removidas da definição padrão do arquivo plist *ProgramArguments*, que você pode ter definido em `my.cnf` em vez disso.
