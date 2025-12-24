### 2.4.3 Instalar e usar o Daemon de Lançamento do MySQL

O macOS usa demônios de lançamento para iniciar, parar e gerenciar automaticamente processos e aplicativos como o MySQL.

Por padrão, o pacote de instalação (DMG) no macOS instala um arquivo de lançamento chamado `/Library/LaunchDaemons/com.oracle.oss.mysql.mysqld.plist` que contém uma definição de plist semelhante a:

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
            <string>--early-plugin-load=keyring_okv=keyring_okv.so</string>
        </array>
    <key>WorkingDirectory</key>  <string>/usr/local/mysql</string>
</dict>
</plist>
```

::: info Note

Alguns usuários relatam que a adição de uma declaração plist DOCTYPE faz com que a operação launchd falhe, apesar de ter passado a verificação de lint. Suspeitamos que seja um erro de cópia e colagem. A soma de verificação md5 de um arquivo contendo o trecho acima é *d925f05f6d1b6ee5ce5451b596d6baed*.

:::

Para ativar o serviço de lançamento, você pode:

- Abra as preferências do sistema do macOS e selecione o painel de preferências do MySQL e, em seguida, execute o Start MySQL Server.

  \*\* Figura 2.6 Painel de preferências do MySQL: Localização\*\*

  ![Shows "MySQL" typed into the macOS System Preferences search box, and a highlighted "MySQL" icon in the bottom left portion of the MySQL Preference Pane.](images/mac-installer-preference-pane-location.png)

  A página Instâncias inclui uma opção para iniciar ou parar o MySQL, e Iniciar o banco de dados recria o diretório `data/`. Desinstalar desinstala o MySQL Server e opcionalmente o painel de preferências do MySQL e informações de lançamento.

  \*\* Figura 2.7 Painel de Preferências MySQL: Instâncias\*\*

  ![The left side shows a list of MySQL instances separated by "Active Instance", "Installed Instances", and "Data Directories" sections. The right side shows a "Stop MySQL Server" button, a check box titled "Start MySQL when your computer starts up", and "Initialize Database" and "Uninstall" buttons.](images/mac-installer-preference-pane-instances.png)
- Ou, manualmente carregar o arquivo launchd.

  ```
  $> cd /Library/LaunchDaemons
  $> sudo launchctl load -F com.oracle.oss.mysql.mysqld.plist
  ```
- Para configurar o MySQL para iniciar automaticamente na inicialização, você pode:

  ```
  $> sudo launchctl load -w com.oracle.oss.mysql.mysqld.plist
  ```

::: info Note

O processo de atualização substitui seu arquivo de lançamento existente chamado `com.oracle.oss.mysql.mysqld.plist`.

:::

Informações adicionais relativas ao lançamento:

- As entradas plist substituem as entradas `my.cnf`, porque são passadas como argumentos de linha de comando. Para informações adicionais sobre a passagem de opções de programa, veja Seção 6.2.2,  Especificar Opções de Programa.
- A seção **ProgramArguments** define as opções de linha de comando que são passadas para o programa, que é o binário `mysqld` neste caso.
- A definição de plist padrão é escrita com casos de uso menos sofisticados em mente. Para configurações mais complicadas, você pode remover alguns dos argumentos e, em vez disso, confiar em um arquivo de configuração do MySQL, como `my.cnf`.
- Se você editar o arquivo plist, desmarque a opção de instalador ao reinstalar ou atualizar o MySQL. Caso contrário, o arquivo plist editado será sobrescrito e todas as edições serão perdidas.

Como a definição de plist padrão define vários `ProgramArguments`, você pode remover a maioria desses argumentos e, em vez disso, confiar no seu `my.cnf` arquivo de configuração do MySQL para defini-los. Por exemplo:

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
            <string>--early-plugin-load=keyring_okv=keyring_okv.so</string>
        </array>
    <key>WorkingDirectory</key>  <string>/usr/local/mysql</string>
</dict>
</plist>
```

Neste caso, as opções `basedir`, `datadir`, `plugin_dir`, `log_error`, `pid_file`, e `--early-plugin-load` foram removidas da definição padrão da plista `ProgramArguments`, que você poderia ter definido em `my.cnf` em vez disso.
