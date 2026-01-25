### 4.4.7 mysql_upgrade — Verificação e Upgrade de Tabelas MySQL

Sempre que você realizar um upgrade do MySQL, você deve executar o **mysql_upgrade**, que procura por incompatibilidades com o MySQL server atualizado:

* Ele atualiza as system tables no schema `mysql` para que você possa aproveitar novos privilégios ou capacidades que possam ter sido adicionadas.

* Ele atualiza o Performance Schema e o `sys` schema.

* Ele examina os user schemas.

Se o **mysql_upgrade** descobrir que uma tabela possui uma possível incompatibilidade, ele realiza uma verificação da tabela e, se problemas forem encontrados, tenta um reparo da tabela. Se a tabela não puder ser reparada, consulte a Seção 2.10.12, “Rebuilding or Repairing Tables or Indexes” para estratégias manuais de reparo de tabela.

O **mysql_upgrade** se comunica diretamente com o MySQL server, enviando as SQL statements necessárias para realizar o upgrade.

Importante

No MySQL 5.7.11, o valor padrão de `--early-plugin-load` é o nome do arquivo da biblioteca do plugin `keyring_file`, fazendo com que esse plugin seja carregado por padrão. No MySQL 5.7.12 e superior, o valor padrão de `--early-plugin-load` é vazio; para carregar o plugin `keyring_file`, você deve especificar explicitamente a opção com um valor que nomeie o arquivo da biblioteca do plugin `keyring_file`.

A criptografia de tablespace `InnoDB` requer que o keyring plugin a ser usado seja carregado antes da inicialização do `InnoDB`. Portanto, essa mudança no valor padrão de `--early-plugin-load` introduz uma incompatibilidade para upgrades da versão 5.7.11 para 5.7.12 ou superior. Administradores que criptografaram `InnoDB` tablespaces devem tomar ações explícitas para garantir o carregamento contínuo do keyring plugin: Inicie o server com uma opção `--early-plugin-load` que nomeie o arquivo da biblioteca do plugin. Para informações adicionais, consulte a Seção 6.4.4.1, “Keyring Plugin Installation”.

Importante

Se você fizer upgrade para o MySQL 5.7.2 ou posterior a partir de uma versão anterior à 5.7.2, uma alteração na tabela `mysql.user` exige uma sequência especial de passos para realizar o upgrade usando o **mysql_upgrade**. Para detalhes, consulte a Seção 2.10.3, “Changes in MySQL 5.7”.

Nota

No Windows, você deve executar o **mysql_upgrade** com privilégios de administrador. Você pode fazer isso executando um Prompt de Comando como Administrador e executando o comando. Não fazer isso pode resultar na falha da execução correta do upgrade.

Atenção

Você deve sempre fazer backup da sua instalação atual do MySQL *antes* de realizar um upgrade. Consulte a Seção 7.2, “Database Backup Methods”.

Algumas incompatibilidades de upgrade podem exigir tratamento especial *antes* de atualizar sua instalação do MySQL e executar o **mysql_upgrade**. Consulte a Seção 2.10, “Upgrading MySQL”, para obter instruções sobre como determinar se tais incompatibilidades se aplicam à sua instalação e como lidar com elas.

Use o **mysql_upgrade** da seguinte forma:

1. Certifique-se de que o server esteja em execução.
2. Invoque o **mysql_upgrade** para atualizar as system tables no schema `mysql` e verificar e reparar tables em outros schemas:

   ```sql
   mysql_upgrade [options]
   ```

3. Pare o server e reinicie-o para que quaisquer alterações nas system tables entrem em vigor.

Se você tiver múltiplas instâncias do MySQL server para atualizar, invoque o **mysql_upgrade** com os parâmetros de conexão apropriados para conectar a cada um dos servers desejados. Por exemplo, com servers sendo executados no host local nas ports 3306 a 3308, atualize cada um deles conectando à port apropriada:

```sql
mysql_upgrade --protocol=tcp -P 3306 [other_options]
mysql_upgrade --protocol=tcp -P 3307 [other_options]
mysql_upgrade --protocol=tcp -P 3308 [other_options]
```

Para conexões de host local no Unix, a opção `--protocol=tcp` força uma conexão usando TCP/IP em vez do arquivo de Unix socket.

Por padrão, o **mysql_upgrade** é executado como o usuário `root` do MySQL. Se a password do `root` estiver expirada quando você executar o **mysql_upgrade**, ele exibirá uma mensagem informando que sua password expirou e que o **mysql_upgrade** falhou como resultado. Para corrigir isso, redefina a password do `root` para desexpirá-la e execute o **mysql_upgrade** novamente. Primeiro, conecte-se ao server como `root`:

```sql
$> mysql -u root -p
Enter password: ****  <- enter root password here
```

Redefina a password usando `ALTER USER`:

```sql
mysql> ALTER USER USER() IDENTIFIED BY 'root-password';
```

Em seguida, saia do **mysql** e execute o **mysql_upgrade** novamente:

```sql
$> mysql_upgrade [options]
```

Nota

Se você executar o server com a variável de sistema `disabled_storage_engines` configurada para desabilitar certos storage engines (por exemplo, `MyISAM`), o **mysql_upgrade** pode falhar com um erro como este:

```sql
mysql_upgrade: [ERROR] 3161: Storage engine MyISAM is disabled
(Table creation is disallowed).
```

Para lidar com isso, reinicie o server com `disabled_storage_engines` desabilitado. Assim, você deverá ser capaz de executar o **mysql_upgrade** com sucesso. Depois disso, reinicie o server com `disabled_storage_engines` configurado para seu valor original.

A menos que seja invocado com a opção `--upgrade-system-tables`, o **mysql_upgrade** processa todas as tables em todos os user schemas conforme necessário. A verificação de tabelas pode levar muito tempo para ser concluída. Cada tabela é bloqueada e, portanto, fica indisponível para outras sessions enquanto está sendo processada. As operações de verificação e reparo podem ser demoradas, particularmente para tables grandes. A verificação de tabela usa a opção `FOR UPGRADE` da `CHECK TABLE statement`. Para detalhes sobre o que essa opção implica, consulte a Seção 13.7.2.2, “CHECK TABLE Statement”.

O **mysql_upgrade** marca todas as tables verificadas e reparadas com o número da versão atual do MySQL. Isso garante que, na próxima vez que você executar o **mysql_upgrade** com a mesma versão do server, seja possível determinar se há necessidade de verificar ou reparar uma determinada tabela novamente.

O **mysql_upgrade** salva o número da versão do MySQL em um arquivo chamado `mysql_upgrade_info` no data directory. Isso é usado para verificar rapidamente se todas as tables foram verificadas para esta release, de modo que a verificação de tabelas possa ser ignorada. Para ignorar este arquivo e realizar a verificação independentemente, use a opção `--force`.

O **mysql_upgrade** verifica as linhas da system table `mysql.user` e, para qualquer linha com uma coluna `plugin` vazia, define essa coluna como `'mysql_native_password'` ou `'mysql_old_password'`, dependendo do formato hash do valor da coluna `Password`.

O suporte para password hashing pré-4.1 e `mysql_old_password` foi removido, então o **mysql_upgrade** define valores `plugin` vazios para `'mysql_native_password'` se as credenciais usarem um formato hash compatível com esse plugin. As linhas com um password hash pré-4.1 devem ser atualizadas manualmente. Para obter instruções de upgrade de conta, consulte a Seção 6.4.1.3, “Migrating Away from Pre-4.1 Password Hashing and the mysql_old_password Plugin”.

O **mysql_upgrade** não atualiza o conteúdo das tabelas de time zone ou help tables. Para obter instruções de upgrade, consulte a Seção 5.1.13, “MySQL Server Time Zone Support”, e a Seção 5.1.14, “Server-Side Help Support”.

A menos que seja invocado com a opção `--skip-sys-schema`, o **mysql_upgrade** instala o `sys` schema se ele não estiver instalado, e o atualiza para a versão atual caso contrário. Ocorre um erro se um `sys` schema existir, mas não tiver uma `version view`, sob a suposição de que sua ausência indica um schema criado pelo usuário:

```sql
A sys schema exists with no sys.version view. If
you have a user created sys schema, this must be renamed for the
upgrade to succeed.
```

Para fazer o upgrade neste caso, remova ou renomeie o `sys` schema existente primeiro.

O **mysql_upgrade** verifica tabelas `InnoDB` particionadas que foram criadas usando o generic partitioning handler e tenta atualizá-las para `InnoDB native partitioning`. (Bug #76734, Bug #20727344) Você pode atualizar essas tabelas individualmente no client **mysql** usando a SQL statement `ALTER TABLE ... UPGRADE PARTITIONING`.

O **mysql_upgrade** suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysql_upgrade]` e `[client]` de um option file. Para obter informações sobre option files usados por programas MySQL, consulte a Seção 4.2.2.2, “Using Option Files”.

**Tabela 4.12 Opções do mysql_upgrade**

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para o mysql_upgrade."><col style="width: 31%"/><col style="width: 56%"/><col style="width: 12%"/><thead><tr><th>Nome da Opção</th> <th>Descrição</th> <th>Introduzida</th> </tr></thead><tbody><tr><th>--bind-address</th> <td>Usa a interface de rede especificada para conectar ao MySQL Server</td> <td></td> </tr><tr><th>--character-sets-dir</th> <td>Diretório onde os character sets estão instalados</td> <td></td> </tr><tr><th>--compress</th> <td>Compacta todas as informações enviadas entre o client e o server</td> <td></td> </tr><tr><th>--debug</th> <td>Escreve log de debugging</td> <td></td> </tr><tr><th>--debug-check</th> <td>Imprime informações de debugging quando o programa é encerrado</td> <td></td> </tr><tr><th>--debug-info</th> <td>Imprime informações de debugging, memória e estatísticas de CPU quando o programa é encerrado</td> <td></td> </tr><tr><th>--default-auth</th> <td>Plugin de autenticação a ser usado</td> <td></td> </tr><tr><th>--default-character-set</th> <td>Especifica o character set padrão</td> <td></td> </tr><tr><th>--defaults-extra-file</th> <td>Lê o option file nomeado além dos option files usuais</td> <td></td> </tr><tr><th>--defaults-file</th> <td>Lê apenas o option file nomeado</td> <td></td> </tr><tr><th>--defaults-group-suffix</th> <td>Valor de sufixo do grupo de opções</td> <td></td> </tr><tr><th>--force</th> <td>Força a execução mesmo que o mysql_upgrade já tenha sido executado para a versão atual do MySQL</td> <td></td> </tr><tr><th>--help</th> <td>Exibe mensagem de ajuda e sai</td> <td></td> </tr><tr><th>--host</th> <td>Host no qual o MySQL server está localizado</td> <td></td> </tr><tr><th>--login-path</th> <td>Lê opções de caminho de login de .mylogin.cnf</td> <td></td> </tr><tr><th>--max-allowed-packet</th> <td>Comprimento máximo do packet a ser enviado ou recebido do server</td> <td></td> </tr><tr><th>--net-buffer-length</th> <td>Tamanho do Buffer para comunicação TCP/IP e socket</td> <td></td> </tr><tr><th>--no-defaults</th> <td>Não lê option files</td> <td></td> </tr><tr><th>--password</th> <td>Password a ser usada ao conectar ao server</td> <td></td> </tr><tr><th>--pipe</th> <td>Conecta ao server usando named pipe (somente Windows)</td> <td></td> </tr><tr><th>--plugin-dir</th> <td>Diretório onde os plugins estão instalados</td> <td></td> </tr><tr><th>--port</th> <td>Número da port TCP/IP para conexão</td> <td></td> </tr><tr><th>--print-defaults</th> <td>Imprime opções padrão</td> <td></td> </tr><tr><th>--protocol</th> <td>Protocolo de transporte a ser usado</td> <td></td> </tr><tr><th>--shared-memory-base-name</th> <td>Nome de shared-memory para conexões de shared-memory (somente Windows)</td> <td></td> </tr><tr><th>--skip-sys-schema</th> <td>Não instala ou atualiza o sys schema</td> <td></td> </tr><tr><th>--socket</th> <td>Arquivo de Unix socket ou named pipe do Windows a ser usado</td> <td></td> </tr><tr><th>--ssl</th> <td>Habilita a criptografia de conexão</td> <td></td> </tr><tr><th>--ssl-ca</th> <td>Arquivo que contém a lista de Certificate Authorities SSL confiáveis</td> <td></td> </tr><tr><th>--ssl-capath</th> <td>Diretório que contém arquivos de certificado de Certificate Authority SSL confiáveis</td> <td></td> </tr><tr><th>--ssl-cert</th> <td>Arquivo que contém o certificado X.509</td> <td></td> </tr><tr><th>--ssl-cipher</th> <td>Ciphers permitidos para criptografia de conexão</td> <td></td> </tr><tr><th>--ssl-crl</th> <td>Arquivo que contém listas de revogação de certificado</td> <td></td> </tr><tr><th>--ssl-crlpath</th> <td>Diretório que contém arquivos de lista de revogação de certificado</td> <td></td> </tr><tr><th>--ssl-key</th> <td>Arquivo que contém a chave X.509</td> <td></td> </tr><tr><th>--ssl-mode</th> <td>Estado de segurança desejado da conexão com o server</td> <td>5.7.11</td> </tr><tr><th>--ssl-verify-server-cert</th> <td>Verifica o host name em relação à identidade Common Name do certificado do server</td> <td></td> </tr><tr><th>--tls-version</th> <td>Protocolos TLS permitidos para conexões criptografadas</td> <td>5.7.10</td> </tr><tr><th>--upgrade-system-tables</th> <td>Atualiza apenas as system tables, e não os user schemas</td> <td></td> </tr><tr><th>--user</th> <td>Nome de usuário MySQL a ser usado ao conectar ao server</td> <td></td> </tr><tr><th>--verbose</th> <td>Modo Verbose (detalhado)</td> <td></td> </tr><tr><th>--version-check</th> <td>Verifica a versão adequada do server</td> <td></td> </tr><tr><th>--write-binlog</th> <td>Escreve todas as statements no binary log</td> <td></td> </tr></tbody></table>

* `--help`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Exibe uma breve mensagem de ajuda e sai.

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Em um computador com múltiplas interfaces de rede, use esta opção para selecionar qual interface usar para conectar ao MySQL server.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do Diretório</td> </tr></tbody></table>

  O diretório onde os character sets estão instalados. Consulte a Seção 10.15, “Character Set Configuration”.

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Propriedades para compress"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Compacta todas as informações enviadas entre o client e o server, se possível. Consulte a Seção 4.2.6, “Connection Compression Control”.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Propriedades para debug"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--debug[=#]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>d:t:O,/tmp/mysql_upgrade.trace</code></td> </tr></tbody></table>

  Escreve um log de debugging. Uma string *`debug_options`* típica é `d:t:o,file_name`. O padrão é `d:t:O,/tmp/mysql_upgrade.trace`.

* `--debug-check`

  <table frame="box" rules="all" summary="Propriedades para debug-check"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--debug-check</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr></tbody></table>

  Imprime algumas informações de debugging quando o programa é encerrado.

* `--debug-info`, `-T`

  <table frame="box" rules="all" summary="Propriedades para debug-info"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--debug-info</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Imprime informações de debugging e estatísticas de uso de memória e CPU quando o programa é encerrado.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Propriedades para default-auth"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Uma dica sobre qual plugin de autenticação do lado do client usar. Consulte a Seção 6.2.13, “Pluggable Authentication”.

* `--default-character-set=charset_name`

  <table frame="box" rules="all" summary="Propriedades para default-character-set"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--default-character-set=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Usa *`charset_name`* como o character set padrão. Consulte a Seção 10.15, “Character Set Configuration”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Lê este option file após o option file global, mas (no Unix) antes do option file do usuário. Se o arquivo não existir ou for inacessível por outro motivo, ocorre um erro. Se *`file_name`* não for um absolute path name, ele é interpretado em relação ao diretório atual.

  Para informações adicionais sobre esta e outras opções de option file, consulte a Seção 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Usa apenas o option file fornecido. Se o arquivo não existir ou for inacessível por outro motivo, ocorre um erro. Se *`file_name`* não for um absolute path name, ele é interpretado em relação ao diretório atual.

  Para informações adicionais sobre esta e outras opções de option file, consulte a Seção 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Lê não apenas os option groups usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, o **mysql_upgrade** normalmente lê os grupos `[client]` e `[mysql_upgrade]`. Se esta opção for fornecida como `--defaults-group-suffix=_other`, o **mysql_upgrade** também lê os grupos `[client_other]` e `[mysql_upgrade_other]`.

  Para informações adicionais sobre esta e outras opções de option file, consulte a Seção 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--force`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Ignora o arquivo `mysql_upgrade_info` e força a execução mesmo que o **mysql_upgrade** já tenha sido executado para a versão atual do MySQL.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Conecta-se ao MySQL server no host fornecido.

* `--login-path=name`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Lê opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um option group que contém opções que especificam a qual MySQL server conectar e com qual conta autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql_config_editor**. Consulte a Seção 4.6.6, “mysql_config_editor — MySQL Configuration Utility”.

  Para informações adicionais sobre esta e outras opções de option file, consulte a Seção 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--max-allowed-packet=value`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  O tamanho máximo do Buffer para comunicação client/server. O valor padrão é 24MB. Os valores mínimo e máximo são 4KB e 2GB.

* `--net-buffer-length=value`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  O tamanho inicial do Buffer para comunicação client/server. O valor padrão é 1MB − 1KB. Os valores mínimo e máximo são 4KB e 16MB.

* `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Não lê option files. Se a inicialização do programa falhar devido à leitura de opções desconhecidas de um option file, o `--no-defaults` pode ser usado para impedir que sejam lidas.

  A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que passwords sejam especificadas de uma forma mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar o `.mylogin.cnf`, use o utilitário **mysql_config_editor**. Consulte a Seção 4.6.6, “mysql_config_editor — MySQL Configuration Utility”.

  Para informações adicionais sobre esta e outras opções de option file, consulte a Seção 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  A password da conta MySQL usada para conectar ao server. O valor da password é opcional. Se não for fornecido, o **mysql_upgrade** solicita um. Se fornecido, não deve haver *espaço* entre `--password=` ou `-p` e a password que o segue. Se nenhuma opção de password for especificada, o padrão é não enviar password.

  Especificar uma password na linha de comando deve ser considerado inseguro. Para evitar fornecer a password na linha de comando, use um option file. Consulte a Seção 6.1.2.1, “End-User Guidelines for Password Security”.

  Para especificar explicitamente que não há password e que o **mysql_upgrade** não deve solicitá-la, use a opção `--skip-password`.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  No Windows, conecta-se ao server usando um named pipe. Esta opção se aplica somente se o server foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de named pipe. Além disso, o usuário que faz a conexão deve ser membro do grupo Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  O diretório onde procurar por plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um authentication plugin, mas o **mysql_upgrade** não o encontrar. Consulte a Seção 6.2.13, “Pluggable Authentication”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Para conexões TCP/IP, o número da port a ser usado.

* `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Imprime o nome do programa e todas as opções que ele obtém dos option files.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  O protocolo de transporte a ser usado para conectar ao server. É útil quando os outros parâmetros de conexão normalmente resultam no uso de um protocolo diferente daquele que você deseja. Para obter detalhes sobre os valores permitidos, consulte a Seção 4.2.5, “Connection Transport Protocols”.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  No Windows, o nome de shared-memory a ser usado para conexões feitas usando shared memory a um server local. O valor padrão é `MYSQL`. O nome de shared-memory diferencia maiúsculas de minúsculas.

  Esta opção se aplica somente se o server foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de shared-memory.

* `--skip-sys-schema`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Por padrão, o **mysql_upgrade** instala o `sys` schema se ele não estiver instalado, e o atualiza para a versão atual caso contrário. A opção `--skip-sys-schema` suprime este comportamento.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Para conexões a `localhost`, o arquivo de Unix socket a ser usado ou, no Windows, o nome do named pipe a ser usado.

  No Windows, esta opção se aplica somente se o server foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de named pipe. Além disso, o usuário que faz a conexão deve ser membro do grupo Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--ssl*`

  Opções que começam com `--ssl` especificam se deve ser feita a conexão ao server usando criptografia e indicam onde encontrar chaves e certificados SSL. Consulte Command Options for Encrypted Connections.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolos separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 6.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

  Esta opção foi adicionada no MySQL 5.7.10.

* `--upgrade-system-tables`, `-s`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Atualiza apenas as system tables no schema `mysql`, não atualiza os user schemas.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do Diretório</td> </tr></tbody></table>

  O nome de usuário da conta MySQL a ser usada para conectar ao server. O nome de usuário padrão é `root`.

* `--verbose`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do Diretório</td> </tr></tbody></table>

  Modo Verbose (detalhado). Imprime mais informações sobre o que o programa faz.

* `--version-check`, `-k`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do Diretório</td> </tr></tbody></table>

  Verifica a versão do server ao qual o **mysql_upgrade** está se conectando para verificar se é a mesma versão para a qual o **mysql_upgrade** foi construído. Caso contrário, o **mysql_upgrade** é encerrado. Esta opção está habilitada por padrão; para desabilitar a verificação, use `--skip-version-check`.

* `--write-binlog`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do Diretório</td> </tr></tbody></table>

  Por padrão, o binary logging pelo **mysql_upgrade** está desabilitado. Invoque o programa com `--write-binlog` se você quiser que suas ações sejam escritas no binary log.

  Quando o server está sendo executado com global transaction identifiers (GTIDs) habilitados (`gtid_mode=ON`), não habilite o binary logging pelo **mysql_upgrade**.