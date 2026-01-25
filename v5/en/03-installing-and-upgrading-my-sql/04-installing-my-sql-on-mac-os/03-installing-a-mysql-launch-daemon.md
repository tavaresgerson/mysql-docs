### 2.4.3 Instalando um Daemon de Inicialização do MySQL

O macOS utiliza launch daemons para iniciar, parar e gerenciar automaticamente processos e aplicações, como o MySQL.

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

Alguns usuários relatam que adicionar uma declaração DOCTYPE no plist faz com que a operação launchd falhe, apesar de passar na verificação de lint. Suspeitamos que seja um erro de copy-n-paste (copiar e colar). O checksum md5 de um arquivo contendo o trecho acima é *24710a27dc7a28fb7ee6d825129cd3cf*.

Para habilitar o serviço launchd, você pode:

* Clicar em Start MySQL Server (Iniciar Servidor MySQL) no painel de preferências do MySQL.

  **Figura 2.19 Painel de Preferências do MySQL: Localização**

  ![O conteúdo é descrito no texto circundante.](images/mac-installer-preference-pane-location.png)

  **Figura 2.20 Painel de Preferências do MySQL: Uso**

  ![O conteúdo é descrito no texto circundante.](images/mac-installer-preference-pane-usage.png)

* Ou, carregar manualmente o arquivo launchd.

  ```sql
  $> cd /Library/LaunchDaemons
  $> sudo launchctl load -F com.oracle.oss.mysql.mysqld.plist
  ```

* Para configurar o MySQL para iniciar automaticamente durante o bootup, você pode:

  ```sql
  $> sudo launchctl load -w com.oracle.oss.mysql.mysqld.plist
  ```

Nota

Ao atualizar o MySQL server, o processo de instalação launchd remove os itens de startup antigos que foram instalados com o MySQL server 5.7.7 e anterior.

A atualização também substitui o seu arquivo **launchd** existente com o mesmo nome.

Informações adicionais relacionadas ao **launchd**:

* As entradas `plist` sobrescrevem as entradas `my.cnf`, porque elas são passadas como command line arguments. Para informações adicionais sobre como passar opções de programa, consulte a Seção 4.2.2, “Especificando Opções de Programa”.

* A seção **ProgramArguments** define as opções de linha de comando que são passadas para o programa, que neste caso é o binário `mysqld`.

* A definição padrão do `plist` é escrita pensando em casos de uso menos sofisticados. Para configurações mais complexas, você pode querer remover alguns dos argumentos e, em vez disso, confiar em um arquivo de configuração do MySQL, como o `my.cnf`.

* Se você editar o arquivo `plist`, desmarque a opção do instalador ao reinstalar ou atualizar o MySQL. Caso contrário, seu arquivo `plist` editado será sobrescrito, resultando na perda de quaisquer alterações que você tenha feito.

Como a definição padrão do plist define vários **ProgramArguments**, você pode remover a maioria desses argumentos e, em vez disso, confiar no seu arquivo de configuração my.cnf do MySQL para defini-los. Por exemplo:

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

Neste caso, as opções `basedir`, `datadir`, `plugin_dir`, `log_error` e `pid_file` foram removidas da definição plist, e então você pode defini-las no `my.cnf`.