### 2.4.3 Instalação do Daemon de Inicialização do MySQL

O macOS usa daemons de inicialização para iniciar, parar e gerenciar automaticamente processos e aplicativos, como o MySQL.

Por padrão, o pacote de instalação (DMG) no macOS instala um arquivo launchd chamado `/Library/LaunchDaemons/com.oracle.oss.mysql.mysqld.plist` que contém uma definição plist semelhante a:

```xml
<?xml version="1.0" encoding="utf-8"?><!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd"><plist version="1.0"><dict><key>Label</key>             <string>com.oracle.oss.mysql.mysqld</string><key>ProcessType</key>       <string>Interactive</string><key>Disabled</key>          <false/><key>RunAtLoad</key>         <true/><key>KeepAlive</key>         <true/><key>SessionCreate</key>     <true/><key>LaunchOnlyOnce</key>    <false/><key>UserName</key>          <string>_mysql</string><key>GroupName</key>         <string>_mysql</string><key>ExitTimeOut</key>       <integer>600</integer><key>Program</key>           <string>/usr/local/mysql/bin/mysqld</string><key>ProgramArguments</key><array><string>/usr/local/mysql/bin/mysqld</string><string>--user=_mysql</string><string>--basedir=/usr/local/mysql</string><string>--datadir=/usr/local/mysql/data</string><string>--plugin-dir=/usr/local/mysql/lib/plugin</string><string>--log-error=/usr/local/mysql/data/mysqld.local.err</string><string>--pid-file=/usr/local/mysql/data/mysqld.local.pid</string></array><key>WorkingDirectory</key>  <string>/usr/local/mysql</string></dict></plist>
```

::: info Nota
Alguns usuários relatam que a adição de uma declaração de DOCTYPE plist causa o falha da operação do launchd, apesar de passar na verificação de lint. Acreditamos que seja um erro de cópia e colagem. O checksum md5 de um arquivo que contém o trecho acima é *24710a27dc7a28fb7ee6d825129cd3cf*.
:::

Para habilitar o serviço launchd, você pode:

- Clique em Iniciar o servidor MySQL no painel de preferências do MySQL.

  **Figura 2.19 Painel de Preferências do MySQL: Localização**

  ![](images/mac-installer-preference-pane-location.png)

  **Figura 2.20: Painel de Preferências do MySQL: Uso**

  ![](images/mac-installer-preference-pane-usage.png)

- Ou, carregue manualmente o arquivo launchd.

  ```sql
  $> cd /Library/LaunchDaemons
  $> sudo launchctl load -F com.oracle.oss.mysql.mysqld.plist
  ```

- Para configurar o MySQL para iniciar automaticamente ao inicializar, você pode:

  ```sql
  $> sudo launchctl load -w com.oracle.oss.mysql.mysqld.plist
  ```

::: info Nota
Ao atualizar o servidor MySQL, o processo de instalação do launchd remove os itens de inicialização antigos que foram instalados com o servidor MySQL 5.7.7 e versões anteriores.
:::

A atualização também substitui seu arquivo existente **launchd** com o mesmo nome.

Informações adicionais relacionadas ao **launchd**:

- As entradas do `plist` substituem as entradas do `my.cnf`, pois são passadas como argumentos na linha de comando. Para obter informações adicionais sobre como passar opções de programa, consulte a Seção 4.2.2, “Especificação de Opções de Programa”.

- A seção **ProgramArguments** define as opções de linha de comando que são passadas para o programa, que, neste caso, é o binário `mysqld`.

- A definição padrão do `plist` é escrita com casos de uso menos sofisticados em mente. Para configurações mais complicadas, você pode querer remover alguns dos argumentos e, em vez disso, confiar em um arquivo de configuração do MySQL, como `my.cnf`.

- Se você editar o arquivo `plist`, desmarque a opção de instalação ao reinstalar ou atualizar o MySQL. Caso contrário, o arquivo `plist` editado será sobrescrito, perdendo todas as alterações que você fez.

Como a definição padrão do `plist` define vários **ProgramArguments**, você pode remover a maioria desses argumentos e, em vez disso, confiar no arquivo de configuração MySQL `my.cnf` para defini-los. Por exemplo:

```xml
<?xml version="1.0" encoding="utf-8"?><!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd"><plist version="1.0"><dict><key>Label</key>             <string>com.oracle.oss.mysql.mysqld</string><key>ProcessType</key>       <string>Interactive</string><key>Disabled</key>          <false/><key>RunAtLoad</key>         <true/><key>KeepAlive</key>         <true/><key>SessionCreate</key>     <true/><key>LaunchOnlyOnce</key>    <false/><key>UserName</key>          <string>_mysql</string><key>GroupName</key>         <string>_mysql</string><key>ExitTimeOut</key>       <integer>600</integer><key>Program</key>           <string>/usr/local/mysql/bin/mysqld</string><key>WorkingDirectory</key>  <string>/usr/local/mysql</string><key>ProgramArguments</key><array><string>/usr/local/mysql/bin/mysqld</string><string>--user=_mysql</string></array></dict></plist>
```

Neste caso, as opções `basedir`, `datadir`, `plugin_dir`, `log_error` e `pid_file` foram removidas da definição do plist, e então você pode defini-las no `my.cnf`.
