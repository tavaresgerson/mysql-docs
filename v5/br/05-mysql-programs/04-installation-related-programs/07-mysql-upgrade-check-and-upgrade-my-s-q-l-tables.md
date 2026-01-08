### 4.4.7 mysql\_upgrade — Verificar e atualizar tabelas do MySQL

Cada vez que você atualizar o MySQL, você deve executar o **mysql\_upgrade**, que procura incompatibilidades com o servidor MySQL atualizado:

- Ele atualiza as tabelas do sistema no esquema `mysql` para que você possa aproveitar novos privilégios ou capacidades que possam ter sido adicionadas.

- Ele atualiza o esquema de desempenho e o esquema `sys`.

- Ele examina os esquemas dos usuários.

Se o **mysql\_upgrade** detectar uma possível incompatibilidade em uma tabela, ele realiza uma verificação da tabela e, se problemas forem encontrados, tenta reparar a tabela. Se a tabela não puder ser reparada, consulte a Seção 2.10.12, “Reestruturação ou reparo de tabelas ou índices”, para estratégias de reparo manual de tabelas.

O **mysql\_upgrade** comunica diretamente com o servidor MySQL, enviando-lhe as instruções SQL necessárias para realizar uma atualização.

Importante

No MySQL 5.7.11, o valor padrão de `--early-plugin-load` é o nome do arquivo da biblioteca do plugin `keyring_file`, fazendo com que o plugin seja carregado por padrão. No MySQL 5.7.12 e versões superiores, o valor padrão de `--early-plugin-load` é vazio; para carregar o plugin `keyring_file`, você deve especificar explicitamente a opção com um nome de valor que nomeie o arquivo da biblioteca do plugin `keyring_file`.

A criptografia do espaço de tabelas `InnoDB` exige que o plugin de chave seja carregado antes da inicialização do `InnoDB`, portanto, essa alteração do valor padrão `--early-plugin-load` introduz uma incompatibilidade para atualizações de 5.7.11 para 5.7.12 ou superior. Os administradores que criptografaram os espaços de tabelas `InnoDB` devem tomar medidas explícitas para garantir o carregamento contínuo do plugin de chave: Inicie o servidor com uma opção `--early-plugin-load` que nomeie o arquivo da biblioteca do plugin. Para obter informações adicionais, consulte a Seção 6.4.4.1, “Instalação do Plugin de Chave”.

Importante

Se você atualizar para o MySQL 5.7.2 ou uma versão posterior a partir de uma versão anterior a 5.7.2, uma alteração na tabela `mysql.user` requer uma sequência especial de etapas para realizar uma atualização usando o **mysql\_upgrade**. Para obter detalhes, consulte a Seção 2.10.3, “Alterações no MySQL 5.7”.

Nota

No Windows, você deve executar o **mysql\_upgrade** com privilégios de administrador. Você pode fazer isso executando um Prompt de Comando como Administrador e executando o comando. Se não for feito isso, pode ocorrer que a atualização não seja executada corretamente.

Cuidado

Você deve sempre fazer backup da sua instalação atual do MySQL *antes* de realizar uma atualização. Veja a Seção 7.2, “Métodos de Backup de Banco de Dados”.

Algumas incompatibilidades de atualização podem exigir um tratamento especial *antes* de atualizar sua instalação do MySQL e executar o **mysql\_upgrade**. Consulte a Seção 2.10, “Atualizando o MySQL”, para obter instruções sobre como determinar se tais incompatibilidades se aplicam à sua instalação e como lidar com elas.

Use o **mysql\_upgrade** da seguinte forma:

1. Certifique-se de que o servidor está em funcionamento.

2. Invoque o **mysql\_upgrade** para atualizar as tabelas do sistema no esquema `mysql` e verifique e repare as tabelas em outros esquemas:

   ```sql
   mysql_upgrade [options]
   ```

3. Pare o servidor e reinicie-o para que quaisquer alterações nas tabelas do sistema sejam aplicadas.

Se você tiver várias instâncias do servidor MySQL a serem atualizadas, invocando **mysql\_upgrade** com os parâmetros de conexão apropriados para se conectar a cada um dos servidores desejados. Por exemplo, com servidores rodando no host local nas portas 3306 a 3308, atualize cada um deles conectando-se à porta apropriada:

```sql
mysql_upgrade --protocol=tcp -P 3306 [other_options]
mysql_upgrade --protocol=tcp -P 3307 [other_options]
mysql_upgrade --protocol=tcp -P 3308 [other_options]
```

Para conexões de host local em Unix, a opção `--protocol=tcp` força uma conexão usando TCP/IP em vez do arquivo de socket do Unix.

Por padrão, o **mysql\_upgrade** é executado como o usuário `root` do MySQL. Se a senha do `root` expirar quando você executar o **mysql\_upgrade**, ele exibirá uma mensagem informando que sua senha expirou e que o **mysql\_upgrade** falhou como resultado. Para corrigir isso, redefina a senha do `root` para que ela não expire e execute o **mysql\_upgrade** novamente. Primeiro, conecte-se ao servidor como `root`:

```sql
$> mysql -u root -p
Enter password: ****  <- enter root password here
```

Reinicie a senha usando `ALTER USER`:

```sql
mysql> ALTER USER USER() IDENTIFIED BY 'root-password';
```

Em seguida, saia do **mysql** e execute novamente o **mysql\_upgrade**:

```sql
$> mysql_upgrade [options]
```

Nota

Se você executar o servidor com a variável de sistema `disabled_storage_engines` definida para desabilitar determinados motores de armazenamento (por exemplo, `MyISAM`), o **mysql\_upgrade** pode falhar com um erro como este:

```sql
mysql_upgrade: [ERROR] 3161: Storage engine MyISAM is disabled
(Table creation is disallowed).
```

Para lidar com isso, reinicie o servidor com `disabled_storage_engines` desativado. Depois disso, você deve conseguir executar o **mysql\_upgrade** com sucesso. Após isso, reinicie o servidor com `disabled_storage_engines` definido para seu valor original.

A menos que invocado com a opção `--upgrade-system-tables`, o **mysql\_upgrade** processa todas as tabelas em todos os esquemas de usuário conforme necessário. A verificação da tabela pode levar muito tempo para ser concluída. Cada tabela é bloqueada e, portanto, indisponível para outras sessões enquanto está sendo processada. As operações de verificação e reparo podem ser demoradas, especialmente para tabelas grandes. A verificação da tabela usa a opção `FOR UPGRADE` da instrução `CHECK TABLE`. Para obter detalhes sobre o que essa opção implica, consulte a Seção 13.7.2.2, “Instrução CHECK TABLE”.

**mysql\_upgrade** marca todas as tabelas verificadas e reparadas com o número atual da versão do MySQL. Isso garante que, na próxima vez que você executar **mysql\_upgrade** com a mesma versão do servidor, seja possível determinar se há necessidade de verificar ou reparar novamente uma determinada tabela.

O **mysql\_upgrade** salva o número da versão do MySQL em um arquivo chamado `mysql_upgrade_info` no diretório de dados. Isso é usado para verificar rapidamente se todas as tabelas foram verificadas para essa versão, para que a verificação de tabelas possa ser ignorada. Para ignorar esse arquivo e realizar a verificação independentemente, use a opção `--force`.

O **mysql\_upgrade** verifica as linhas da tabela `mysql.user` e, para qualquer linha com uma coluna `plugin` vazia, define essa coluna para `'mysql_native_password'` ou `'mysql_old_password'` dependendo do formato de hash do valor da coluna `Password`.

O suporte para hashing de senhas pré-4.1 e `mysql_old_password` foi removido, então o **mysql\_upgrade** define valores `plugin` vazios para `'mysql_native_password'` se as credenciais usarem um formato de hash compatível com esse plugin. As linhas com um hash de senha pré-4.1 devem ser atualizadas manualmente. Para instruções de atualização de contas, consulte a Seção 6.4.1.3, “Migrando para fora do hashing de senhas pré-4.1 e do plugin mysql\_old\_password”.

O **mysql\_upgrade** não atualiza o conteúdo das tabelas de fuso horário ou das tabelas de ajuda. Para obter instruções de atualização, consulte a Seção 5.1.13, “Suporte ao Fuso Horário do MySQL Server”, e a Seção 5.1.14, “Suporte ao Ajuda no Servidor”.

A menos que invocado com a opção `--skip-sys-schema`, o **mysql\_upgrade** instala o esquema `sys` se ele não estiver instalado e o atualiza para a versão atual, caso contrário. Um erro ocorre se um esquema `sys` existir, mas não tiver uma visão `version`, assumindo que sua ausência indica um esquema criado pelo usuário:

```sql
A sys schema exists with no sys.version view. If
you have a user created sys schema, this must be renamed for the
upgrade to succeed.
```

Para fazer a atualização neste caso, remova ou renomeie primeiro o esquema existente `sys`.

O **mysql\_upgrade** verifica se as tabelas `InnoDB` particionadas foram criadas usando o manipulador de particionamento genérico e tenta atualizá-las para a particionamento nativo do `InnoDB`. (Bug #76734, Bug #20727344) Você pode atualizar essas tabelas individualmente no cliente **mysql** usando a instrução SQL `ALTER TABLE ... UPGRADE PARTITIONING`.

O **mysql\_upgrade** suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysql_upgrade]` e `[client]` de um arquivo de opções. Para obter informações sobre os arquivos de opções usados pelos programas do MySQL, consulte a Seção 4.2.2.2, “Usando arquivos de opções”.

**Tabela 4.12 Opções do mysql\_upgrade**

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para mysql_upgrade."><col style="width: 31%"/><col style="width: 56%"/><col style="width: 12%"/><thead><tr><th scope="col">Nome da Opção</th> <th scope="col">Descrição</th> <th scope="col">Introduzido</th> </tr></thead><tbody><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_bind-address">--bind-address</a></th> <td>Use a interface de rede especificada para se conectar ao servidor MySQL</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_character-sets-dir">--sets-de-caracteres-dir</a></th> <td>Diretório onde os conjuntos de caracteres são instalados</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_compress">--compress</a></th> <td>Compressar todas as informações enviadas entre o cliente e o servidor</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_debug">--debug</a></th> <td>Escreva o log de depuração</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_debug-check">--debug-check</a></th> <td>Imprimir informações de depuração quando o programa sai</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_debug-info">--debug-info</a></th> <td>Imprimir informações de depuração, memória e estatísticas da CPU quando o programa sai</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_default-auth">--default-auth</a></th> <td>Plugin de autenticação a ser usado</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_default-character-set">--default-character-set</a></th> <td>Especifique o conjunto de caracteres padrão</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_defaults-extra-file">--defaults-extra-file</a></th> <td>Leia o arquivo de opção nomeado, além dos arquivos de opção usuais</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_defaults-file">--defaults-file</a></th> <td>Arquivo de opção de leitura apenas nomeado</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_defaults-group-suffix">--defaults-group-suffix</a></th> <td>Valor do sufixo do grupo de opções</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_force">--force</a></th> <td>Forçar a execução mesmo que o mysql_upgrade já tenha sido executado para a versão atual do MySQL</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_help">--help</a></th> <td>Exibir mensagem de ajuda e sair</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_host">--host</a></th> <td>Anfitrião no qual o servidor MySQL está localizado</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_login-path">--login-path</a></th> <td>Leia as opções de caminho de login a partir de .mylogin.cnf</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_max-allowed-packet">--max-allowed-packet</a></th> <td>Comprimento máximo do pacote para enviar ou receber do servidor</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_net-buffer-length">--net-buffer-length</a></th> <td>Tamanho do buffer para comunicação TCP/IP e socket</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_no-defaults">--no-defaults</a></th> <td>Não ler arquivos de opção</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_password">--senha</a></th> <td>Senha para usar ao se conectar ao servidor</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_pipe">--pipe</a></th> <td>Conecte-se ao servidor usando o pipe nomeado (apenas Windows)</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_plugin-dir">--plugin-dir</a></th> <td>Diretório onde os plugins são instalados</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_port">--port</a></th> <td>Número de porta TCP/IP para a conexão</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_print-defaults">--print-defaults</a></th> <td>Opções padrão de impressão</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_protocol">--protocolo</a></th> <td>Protocolo de transporte a ser utilizado</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_shared-memory-base-name">--shared-memory-base-name</a></th> <td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_skip-sys-schema">--skip-sys-schema</a></th> <td>Não instale ou atualize o sys schema</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_socket">--socket</a></th> <td>Arquivo de soquete Unix ou tubo nomeado do Windows a ser usado</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_ssl">--ssl</a></th> <td>Ative a criptografia de conexão</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_ssl">--ssl-ca</a></th> <td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_ssl">--ssl-capath</a></th> <td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_ssl">--ssl-cert</a></th> <td>Arquivo que contém o certificado X.509</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_ssl">--ssl-cipher</a></th> <td>Cifras permitidas para criptografia de conexão</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_ssl">--ssl-crl</a></th> <td>Arquivo que contém listas de revogação de certificados</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_ssl">--ssl-crlpath</a></th> <td>Diretório que contém arquivos de lista de revogação de certificados</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_ssl">--ssl-chave</a></th> <td>Arquivo que contém a chave X.509</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_ssl">--ssl-mode</a></th> <td>Estado de segurança desejado da conexão com o servidor</td> <td>5.7.11</td> </tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_ssl">--ssl-verify-server-cert</a></th> <td>Verifique o nome do host contra a identidade do Nome comum do certificado do servidor</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_tls-version">--tls-version</a></th> <td>Protocolos TLS permitidos para conexões criptografadas</td> <td>5.7.10</td> </tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_upgrade-system-tables">--upgrade-system-tables</a></th> <td>Atualize apenas as tabelas do sistema, não os esquemas do usuário</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_user">--user</a></th> <td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_verbose">--verbose</a></th> <td>Modo verbosos</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_version-check">--version-check</a></th> <td>Verifique a versão correta do servidor</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_write-binlog">--write-binlog</a></th> <td>Escreva todas as declarações no log binário</td> <td></td> </tr></tbody></table>

- `--help`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  Exiba uma breve mensagem de ajuda e saia.

- `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>

  Em um computador com várias interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao servidor MySQL.

- `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  O diretório onde os conjuntos de caracteres são instalados. Consulte a Seção 10.15, “Configuração de Conjunto de Caracteres”.

- `--compress`, `-C`

  <table frame="box" rules="all" summary="Propriedades para comprimir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  Compressa todas as informações enviadas entre o cliente e o servidor, se possível. Consulte a Seção 4.2.6, “Controle de Compressão de Conexão”.

- `--debug[=opções_de_depuração]`, `-# [opções_de_depuração]`

  <table frame="box" rules="all" summary="Propriedades para depuração"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--debug[=#]</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>d:t:O,/tmp/mysql_upgrade.trace</code>]]</td> </tr></tbody></table>

  Escreva um log de depuração. Uma string típica de *`debug_options`* é `d:t:o,nome_do_arquivo`. O padrão é `d:t:O,/tmp/mysql_upgrade.trace`.

- `--debug-check`

  <table frame="box" rules="all" summary="Propriedades para verificação de depuração"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--debug-check</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>

  Imprima algumas informações de depuração quando o programa sair.

- `--debug-info`, `-T`

  <table frame="box" rules="all" summary="Propriedades para debug-info"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--debug-info</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>

  Imprima informações de depuração, estatísticas de uso de memória e CPU quando o programa sair.

- `--default-auth=plugin`

  <table frame="box" rules="all" summary="Propriedades para autenticação padrão"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Veja a Seção 6.2.13, “Autenticação Personalizável”.

- `--default-character-set=charset_name`

  <table frame="box" rules="all" summary="Propriedades para conjunto de caracteres padrão"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--default-character-set=name</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Use *`charset_name`* como o conjunto de caracteres padrão. Veja a Seção 10.15, “Configuração do Conjunto de Caracteres”.

- `--defaults-extra-file=nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>0

  Leia este arquivo de opção após o arquivo de opção global, mas (no Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--defaults-file=nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>1

  Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou estiver inacessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>2

  Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, **mysql\_upgrade** normalmente lê os grupos `[client]` e `[mysql_upgrade]`. Se esta opção for fornecida como `--defaults-group-suffix=_other`, **mysql\_upgrade** também lê os grupos `[client_other]` e `[mysql_upgrade_other]`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--force`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>3

  Ignore o arquivo `mysql_upgrade_info` e force a execução mesmo que o **mysql\_upgrade** já tenha sido executado para a versão atual do MySQL.

- `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>4

  Conecte-se ao servidor MySQL no host fornecido.

- `--login-path=nome`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>5

  Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam qual servidor MySQL conectar e qual conta autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql\_config\_editor**. Veja a Seção 4.6.6, “mysql\_config\_editor — Utilitário de Configuração MySQL”.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--max-allowed-packet=valor`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>6

  O tamanho máximo do buffer para a comunicação cliente/servidor. O valor padrão é de 24 MB. Os valores mínimo e máximo são de 4 KB e 2 GB.

- `--net-buffer-length=valor`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>7

  O tamanho inicial do buffer para a comunicação cliente/servidor. O valor padrão é de 1 MB a 1 KB. Os valores mínimo e máximo são de 4 KB e 16 MB.

- `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>8

  Não leia nenhum arquivo de opções. Se a inicialização do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, o `--no-defaults` pode ser usado para impedir que sejam lidas.

  A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se ele existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql\_config\_editor**. Veja a Seção 4.6.6, “mysql\_config\_editor — Ferramenta de Configuração do MySQL”.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>9

  A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysql\_upgrade** solicitará uma senha. Se for fornecida, não deve haver **espaço** entre `--password=` ou `-p` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar nenhuma senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Consulte a Seção 6.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

  Para especificar explicitamente que não há senha e que o **mysql\_upgrade** não deve solicitar uma senha, use a opção `--skip-password`.

- `--pipe`, `-W`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>0

  No Windows, conecte-se ao servidor usando um tubo nomeado. Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por tubo nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

- `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>1

  O diretório onde procurar por plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o **mysql\_upgrade** não encontrá-lo. Veja a Seção 6.2.13, “Autenticação Personalizável”.

- `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>2

  Para conexões TCP/IP, o número de porta a ser usado.

- `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>3

  Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção.

- `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>4

  O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de um protocolo diferente do que você deseja. Para obter detalhes sobre os valores permitidos, consulte a Seção 4.2.5, “Protocolos de Transporte de Conexão”.

- `--shared-memory-base-name=nome`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>5

  Em Windows, o nome de memória compartilhada a ser usado para conexões feitas usando memória compartilhada com um servidor local. O valor padrão é `MYSQL`. O nome de memória compartilhada é case-sensitive.

  Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

- `--skip-sys-schema`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>6

  Por padrão, o **mysql\_upgrade** instala o esquema `sys` se ele não estiver instalado e, caso contrário, o atualiza para a versão atual. A opção `--skip-sys-schema` suprime esse comportamento.

- `--socket=caminho`, `-S caminho`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>7

  Para conexões ao `localhost`, o arquivo de socket Unix a ser usado ou, no Windows, o nome do tubo nomeado a ser usado.

  No Windows, essa opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por named pipe. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

- `--ssl*`

  As opções que começam com `--ssl` especificam se você deseja se conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Consulte Opções de comando para conexões criptografadas.

- `--tls-version=lista_protocolos`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>8

  Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolos separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para obter detalhes, consulte a Seção 6.3.2, “Protocolos e cifra TLS de conexão criptografada”.

  Essa opção foi adicionada no MySQL 5.7.10.

- `--upgrade-system-tables`, `-s`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>9

  Atualize apenas as tabelas do sistema no esquema `mysql`, não atualize os esquemas de usuários.

- `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>0

  O nome de usuário da conta MySQL a ser usado para se conectar ao servidor. O nome de usuário padrão é `root`.

- `--verbose`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>1

  Modo verbose. Imprima mais informações sobre o que o programa faz.

- `--version-check`, `-k`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>2

  Verifique a versão do servidor ao qual o **mysql\_upgrade** está se conectando para verificar se é a mesma versão para a qual o **mysql\_upgrade** foi construído. Se não for, o **mysql\_upgrade** sai. Esta opção está habilitada por padrão; para desabilitar a verificação, use `--skip-version-check`.

- `--write-binlog`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>3

  Por padrão, o registro binário pelo **mysql\_upgrade** está desativado. Inicie o programa com `--write-binlog` se quiser que suas ações sejam registradas no log binário.

  Quando o servidor estiver rodando com identificadores de transações globais (GTIDs) habilitados (`gtid_mode=ON`), não habilite o registro binário pelo **mysql\_upgrade**.
