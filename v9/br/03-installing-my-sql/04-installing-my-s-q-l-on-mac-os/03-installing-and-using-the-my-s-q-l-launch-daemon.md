### 2.4.3 Instalando e usando o daemon de inicialização do MySQL

O macOS usa daemon de inicialização para iniciar, parar e gerenciar processos e aplicativos, como o MySQL, automaticamente.

Por padrão, o pacote de instalação (DMG) no macOS instala um arquivo de launchd chamado `/Library/LaunchDaemons/com.oracle.oss.mysql.mysqld.plist` que contém uma definição plist semelhante a:

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

Observação

Alguns usuários relatam que adicionar uma declaração de DOCTYPE plist causa o falha da operação do launchd, apesar de passar na verificação de lint. Acreditamos que seja um erro de cópia e colagem. O checksum md5 de um arquivo contendo o trecho acima é *d925f05f6d1b6ee5ce5451b596d6baed*.

Para habilitar o serviço launchd, você pode:

* Abrir as preferências do sistema do macOS e selecionar o painel de preferências do MySQL, e depois executar Iniciar o servidor MySQL.

**Figura 2.6 Painel de preferências do MySQL: Localização**

![Mostra "MySQL" digitado na caixa de pesquisa das preferências do sistema do macOS, e um ícone "MySQL" destacado na parte inferior esquerda do Painel de preferências do MySQL.](images/mac-installer-preference-pane-location.png)

A página Instâncias inclui uma opção para iniciar ou parar o MySQL, e Inicializar banco de dados recria o diretório `data/`. Desinstalar desinstala o servidor MySQL e, opcionalmente, o painel de preferências do MySQL e as informações do launchd.

**Figura 2.7 Painel de preferências do MySQL: Instâncias**

![O lado esquerdo mostra uma lista de instâncias do MySQL separadas por seções "Instância Ativa", "Instâncias Instaladas" e "Diretórios de Dados". O lado direito mostra um botão "Parar o servidor MySQL", uma caixa de seleção intitulada "Iniciar o MySQL quando o computador for iniciado" e os botões "Inicializar banco de dados" e "Desinstalar".](images/mac-installer-preference-pane-instances.png)

* Ou, carregar manualmente o arquivo de launchd.

```
  $> cd /Library/LaunchDaemons
  $> sudo launchctl load -F com.oracle.oss.mysql.mysqld.plist
  ```

* Para configurar o MySQL para iniciar automaticamente ao inicializar, você pode:

  ```
  $> sudo launchctl load -w com.oracle.oss.mysql.mysqld.plist
  ```

Observação

O processo de atualização substitui o arquivo launchd existente chamado `com.oracle.oss.mysql.mysqld.plist`.

Informações adicionais relacionadas ao launchd:

* As entradas do plist substituem as entradas do `my.cnf`, pois são passadas como argumentos na linha de comando. Para obter informações adicionais sobre como passar opções de programa, consulte a Seção 6.2.2, “Especificação de Opções de Programa”.

* A seção **ProgramArguments** define as opções de linha de comando que são passadas para o programa, que é o binário `mysqld` neste caso.

* A definição padrão do plist é escrita com casos de uso menos sofisticados em mente. Para configurações mais complicadas, você pode remover alguns dos argumentos e, em vez disso, confiar em um arquivo de configuração do MySQL, como `my.cnf`.

* Se você editar o arquivo plist, desmarque a opção do instalador ao reinstalar ou atualizar o MySQL. Caso contrário, o arquivo plist editado será sobrescrito e todas as edições serão perdidas.

Como a definição padrão do plist define vários **ProgramArguments**, você pode remover a maioria desses argumentos e, em vez disso, confiar no arquivo de configuração do MySQL `my.cnf` para defini-los. Por exemplo:

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

Neste caso, as opções `basedir`, `datadir`, `plugin_dir`, `log_error`, `pid_file` e `--early-plugin-load` foram removidas da definição padrão do `ProgramArguments` do plist, que você pode ter definido no `my.cnf` em vez disso.

Observação

`--early-plugin-load` está desatualizado e sujeito à remoção em uma versão futura do MySQL. Consulte a descrição desta opção para obter mais informações.