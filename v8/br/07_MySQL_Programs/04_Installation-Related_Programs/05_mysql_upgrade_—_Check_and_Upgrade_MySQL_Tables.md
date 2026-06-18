### 6.4.5 mysql\_upgrade — Verificar e atualizar tabelas do MySQL

Nota

A partir do MySQL 8.0.16, o servidor MySQL executa as tarefas de atualização anteriormente gerenciadas pelo **mysql\_upgrade** (para detalhes, consulte a Seção 3.4, “O que o processo de atualização do MySQL atualiza”). Consequentemente, o **mysql\_upgrade** não é mais necessário e está desatualizado a partir dessa versão; espere que ele seja removido em uma versão futura do MySQL. Como o **mysql\_upgrade** não executa mais as tarefas de atualização, ele sai com o status 0 incondicionalmente.

Cada vez que você atualizar o MySQL, você deve executar o **mysql\_upgrade**, que procura incompatibilidades com o servidor MySQL atualizado:

- Ele atualiza as tabelas do sistema no esquema `mysql` para que você possa aproveitar novos privilégios ou capacidades que possam ter sido adicionados.

- Ele atualiza o esquema de Performance Schema, `INFORMATION_SCHEMA` e `sys`.

- Ele examina os esquemas dos usuários.

Se o **mysql\_upgrade** detectar uma possível incompatibilidade em uma tabela, ele realiza uma verificação da tabela e, se problemas forem encontrados, tenta reparar a tabela. Se a tabela não puder ser reparada, consulte a Seção 3.14, “Reestruturação ou reparo de tabelas ou índices”, para estratégias de reparo manual de tabelas.

O **mysql\_upgrade** comunica diretamente com o servidor MySQL, enviando-lhe as instruções SQL necessárias para realizar uma atualização.

Cuidado

Você deve sempre fazer backup da sua instalação atual do MySQL *antes* de realizar uma atualização. Veja a Seção 9.2, “Métodos de Backup de Banco de Dados”.

Algumas incompatibilidades de atualização podem exigir um tratamento especial *antes* de atualizar sua instalação do MySQL e executar o **mysql\_upgrade**. Consulte o Capítulo 3, *Atualizando o MySQL*, para obter instruções sobre como determinar se tais incompatibilidades se aplicam à sua instalação e como lidar com elas.

Use o **mysql\_upgrade** da seguinte forma:

1. Certifique-se de que o servidor está em funcionamento.

2. Invoque o **mysql\_upgrade** para atualizar as tabelas do sistema no esquema `mysql` e verifique e repare as tabelas em outros esquemas:

   ```
   mysql_upgrade [options]
   ```

3. Pare o servidor e reinicie-o para que quaisquer alterações nas tabelas do sistema sejam aplicadas.

Se você tiver várias instâncias do servidor MySQL a serem atualizadas, invocando **mysql\_upgrade** com os parâmetros de conexão apropriados para se conectar a cada um dos servidores desejados. Por exemplo, com servidores rodando no host local nas portas 3306 a 3308, atualize cada um deles conectando-se à porta apropriada:

```
mysql_upgrade --protocol=tcp -P 3306 [other_options]
mysql_upgrade --protocol=tcp -P 3307 [other_options]
mysql_upgrade --protocol=tcp -P 3308 [other_options]
```

Para conexões de host local em Unix, a opção `--protocol=tcp` força uma conexão usando TCP/IP em vez do arquivo de socket do Unix.

Por padrão, o **mysql\_upgrade** é executado como o usuário `root` do MySQL. Se a senha `root` expirar quando você executar o **mysql\_upgrade**, ele exibirá uma mensagem indicando que sua senha expirou e que o **mysql\_upgrade** falhou como resultado. Para corrigir isso, redefina a senha `root` para que ela não expire e execute o **mysql\_upgrade** novamente. Primeiro, conecte-se ao servidor como `root`:

```
$> mysql -u root -p
Enter password: ****  <- enter root password here
```

Redefinir a senha usando `ALTER USER`:

```
mysql> ALTER USER USER() IDENTIFIED BY 'root-password';
```

Em seguida, saia do **mysql** e execute novamente o **mysql\_upgrade**:

```
$> mysql_upgrade [options]
```

Nota

Se você executar o servidor com a variável de sistema `disabled_storage_engines` definida para desabilitar determinados motores de armazenamento (por exemplo, `MyISAM`), o **mysql\_upgrade** pode falhar com um erro como este:

```
mysql_upgrade: [ERROR] 3161: Storage engine MyISAM is disabled
(Table creation is disallowed).
```

Para lidar com isso, reinicie o servidor com o `disabled_storage_engines` desativado. Depois disso, você deve conseguir executar o **mysql\_upgrade** com sucesso. Após isso, reinicie o servidor com o `disabled_storage_engines` definido para seu valor original.

A menos que invocado com a opção `--upgrade-system-tables`, o **mysql\_upgrade** processa todas as tabelas em todos os esquemas de usuário conforme necessário. A verificação da tabela pode levar muito tempo para ser concluída. Cada tabela é bloqueada e, portanto, indisponível para outras sessões enquanto está sendo processada. As operações de verificação e reparo podem ser demoradas, especialmente para tabelas grandes. A verificação da tabela usa a opção `FOR UPGRADE` da instrução `CHECK TABLE`. Para obter detalhes sobre o que essa opção implica, consulte a Seção 15.7.3.2, “Instrução CHECK TABLE”.

**mysql\_upgrade** marca todas as tabelas verificadas e reparadas com o número atual da versão do MySQL. Isso garante que, na próxima vez que você executar **mysql\_upgrade** com a mesma versão do servidor, seja possível determinar se há necessidade de verificar ou reparar novamente uma determinada tabela.

O **mysql\_upgrade** salva o número da versão do MySQL em um arquivo chamado `mysql_upgrade_info` no diretório de dados. Isso é usado para verificar rapidamente se todas as tabelas foram verificadas para essa versão, para que a verificação de tabelas possa ser ignorada. Para ignorar esse arquivo e realizar a verificação independentemente, use a opção `--force`.

Nota

O arquivo `mysql_upgrade_info` está desatualizado; espere-se que ele seja removido em uma versão futura do MySQL.

O **mysql\_upgrade** verifica as linhas da tabela `mysql.user` do sistema e, para qualquer linha com uma coluna `plugin` vazia, define essa coluna para `'mysql_native_password'` se as credenciais usarem um formato de hash compatível com esse plugin. As linhas com um hash de senha anterior à versão 4.1 devem ser atualizadas manualmente.

O **mysql\_upgrade** não atualiza o conteúdo das tabelas de fuso horário ou das tabelas de ajuda. Para obter instruções de atualização, consulte a Seção 7.1.15, “Suporte ao Fuso Horário do MySQL Server”, e a Seção 7.1.17, “Suporte ao Ajuda no Servidor”.

A menos que invocado com a opção `--skip-sys-schema`, o **mysql\_upgrade** instala o esquema `sys` se ele não estiver instalado e o atualiza para a versão atual caso contrário. Um erro ocorre se um esquema `sys` existir, mas não tiver nenhuma vista `version`, assumindo que sua ausência indica um esquema criado pelo usuário:

```
A sys schema exists with no sys.version view. If
you have a user created sys schema, this must be renamed for the
upgrade to succeed.
```

Para fazer a atualização neste caso, remova ou renomeie primeiro o esquema existente `sys`.

O **mysql\_upgrade** suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysql_upgrade]` e `[client]` de um arquivo de opções. Para obter informações sobre os arquivos de opções usados pelos programas do MySQL, consulte a Seção 6.2.2.2, “Usando arquivos de opções”.

**Tabela 6.11 Opções de mysql\_upgrade**

<table summary="Opções de linha de comando disponíveis para mysql_upgrade."><thead><tr><th scope="col">Nome da Opção</th> <th scope="col">Descrição</th> <th scope="col">Introduzido</th> <th scope="col">Desatualizado</th> </tr></thead><tbody><tr><th>--bind-address</th> <td>Use a interface de rede especificada para se conectar ao servidor MySQL</td> <td></td> <td></td> </tr><tr><th>--sets-de-caracteres-dir</th> <td>Diretório onde os conjuntos de caracteres são instalados</td> <td></td> <td></td> </tr><tr><th>--compress</th> <td>Compressar todas as informações enviadas entre o cliente e o servidor</td> <td></td> <td>8.0.18</td> </tr><tr><th>--algoritmos de compressão</th> <td>Algoritmos de compressão permitidos para conexões com o servidor</td> <td>8.0.18</td> <td></td> </tr><tr><th>--debug</th> <td>Escreva o log de depuração</td> <td></td> <td></td> </tr><tr><th>--debug-check</th> <td>Imprimir informações de depuração quando o programa sai</td> <td></td> <td></td> </tr><tr><th>--debug-info</th> <td>Imprimir informações de depuração, memória e estatísticas da CPU quando o programa sai</td> <td></td> <td></td> </tr><tr><th>--default-auth</th> <td>Plugin de autenticação a ser usado</td> <td></td> <td></td> </tr><tr><th>--default-character-set</th> <td>Especifique o conjunto de caracteres padrão</td> <td></td> <td></td> </tr><tr><th>--defaults-extra-file</th> <td>Leia o arquivo de opção nomeado, além dos arquivos de opção usuais</td> <td></td> <td></td> </tr><tr><th>--defaults-file</th> <td>Arquivo de opção de leitura apenas nomeado</td> <td></td> <td></td> </tr><tr><th>--defaults-group-suffix</th> <td>Valor do sufixo do grupo de opções</td> <td></td> <td></td> </tr><tr><th>--force</th> <td>Forçar a execução mesmo que o mysql_upgrade já tenha sido executado para a versão atual do MySQL</td> <td></td> <td></td> </tr><tr><th>--get-server-public-key</th> <td>Solicitar chave pública RSA do servidor</td> <td></td> <td></td> </tr><tr><th>--help</th> <td>Exibir mensagem de ajuda e sair</td> <td></td> <td></td> </tr><tr><th>--host</th> <td>Anfitrião no qual o servidor MySQL está localizado</td> <td></td> <td></td> </tr><tr><th>--login-path</th> <td>Leia as opções de caminho de login a partir de .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th>--max-allowed-packet</th> <td>Comprimento máximo do pacote para enviar ou receber do servidor</td> <td></td> <td></td> </tr><tr><th>--net-buffer-length</th> <td>Tamanho do buffer para comunicação TCP/IP e socket</td> <td></td> <td></td> </tr><tr><th>--no-defaults</th> <td>Não ler arquivos de opção</td> <td></td> <td></td> </tr><tr><th>--senha</th> <td>Senha para usar ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th>--pipe</th> <td>Conecte-se ao servidor usando o pipe nomeado (apenas Windows)</td> <td></td> <td></td> </tr><tr><th>--plugin-dir</th> <td>Diretório onde os plugins são instalados</td> <td></td> <td></td> </tr><tr><th>--port</th> <td>Número de porta TCP/IP para a conexão</td> <td></td> <td></td> </tr><tr><th>--print-defaults</th> <td>Opções padrão de impressão</td> <td></td> <td></td> </tr><tr><th>--protocolo</th> <td>Protocolo de transporte a ser utilizado</td> <td></td> <td></td> </tr><tr><th>--server-public-key-path</th> <td>Nome do caminho para o arquivo que contém a chave pública RSA</td> <td></td> <td></td> </tr><tr><th>--shared-memory-base-name</th> <td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td> <td></td> <td></td> </tr><tr><th>--skip-sys-schema</th> <td>Não instale ou atualize o sys schema</td> <td></td> <td></td> </tr><tr><th>--socket</th> <td>Arquivo de soquete Unix ou tubo nomeado do Windows a ser usado</td> <td></td> <td></td> </tr><tr><th>--ssl-ca</th> <td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th>--ssl-capath</th> <td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th>--ssl-cert</th> <td>Arquivo que contém o certificado X.509</td> <td></td> <td></td> </tr><tr><th>--ssl-cipher</th> <td>Cifras permitidas para criptografia de conexão</td> <td></td> <td></td> </tr><tr><th>--ssl-crl</th> <td>Arquivo que contém listas de revogação de certificados</td> <td></td> <td></td> </tr><tr><th>--ssl-crlpath</th> <td>Diretório que contém arquivos de lista de revogação de certificados</td> <td></td> <td></td> </tr><tr><th>--ssl-fips-mode</th> <td>Se deve habilitar o modo FIPS no lado do cliente</td> <td></td> <td>8.0.34</td> </tr><tr><th>--ssl-chave</th> <td>Arquivo que contém a chave X.509</td> <td></td> <td></td> </tr><tr><th>--ssl-mode</th> <td>Estado de segurança desejado da conexão com o servidor</td> <td></td> <td></td> </tr><tr><th>--ssl-session-data</th> <td>Arquivo que contém dados da sessão SSL</td> <td>8.0.29</td> <td></td> </tr><tr><th>--ssl-session-data-continue-on-failed-reuse</th> <td>Se estabelecer conexões se a reutilização da sessão falhar</td> <td>8.0.29</td> <td></td> </tr><tr><th>--tls-ciphersuites</th> <td>Cifras TLSv1.3 permitidas para conexões criptografadas</td> <td>8.0.16</td> <td></td> </tr><tr><th>--tls-version</th> <td>Protocolos TLS permitidos para conexões criptografadas</td> <td></td> <td></td> </tr><tr><th>--upgrade-system-tables</th> <td>Atualize apenas as tabelas do sistema, não os esquemas do usuário</td> <td></td> <td></td> </tr><tr><th>--user</th> <td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th>--verbose</th> <td>Modo verbosos</td> <td></td> <td></td> </tr><tr><th>--version-check</th> <td>Verifique a versão correta do servidor</td> <td></td> <td></td> </tr><tr><th>--write-binlog</th> <td>Escreva todas as declarações no log binário</td> <td></td> <td></td> </tr><tr><th>--zstd-compression-level</th> <td>Nível de compressão para conexões com servidores que utilizam compressão zstd</td> <td>8.0.18</td> <td></td> </tr></tbody></table>

- `--help`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  Exiba uma breve mensagem de ajuda e saia.

- `--bind-address=ip_address`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>

  Em um computador com várias interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao servidor MySQL.

- `--character-sets-dir=dir_name`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  O diretório onde os conjuntos de caracteres são instalados. Consulte a Seção 12.15, “Configuração de Conjunto de Caracteres”.

- `--compress`, `-C`

  <table summary="Propriedades para comprimir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.18</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  Compressa todas as informações enviadas entre o cliente e o servidor, se possível. Consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

  A partir do MySQL 8.0.18, essa opção está desatualizada. Espere que ela seja removida em uma versão futura do MySQL. Consulte Configurando a Compressão de Conexão Legado.

- `--compression-algorithms=value`

  <table summary="Propriedades para algoritmos de compressão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compression-algorithms=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.18</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code>uncompressed</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>zlib</code>]]</p><p class="valid-value">[[<code>zstd</code>]]</p><p class="valid-value">[[<code>uncompressed</code>]]</p></td> </tr></tbody></table>

  Os algoritmos de compressão permitidos para conexões ao servidor. Os algoritmos disponíveis são os mesmos da variável de sistema `protocol_compression_algorithms`. O valor padrão é `uncompressed`.

  Para obter mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

  Essa opção foi adicionada no MySQL 8.0.18.

- `--debug[=debug_options]`, `-# [debug_options]`

  <table summary="Propriedades para depuração"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--debug[=#]</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>d:t:O,/tmp/mysql_upgrade.trace</code>]]</td> </tr></tbody></table>

  Escreva um log de depuração. Uma string típica `debug_options` é `d:t:o,file_name`. O padrão é `d:t:O,/tmp/mysql_upgrade.trace`.

- `--debug-check`

  <table summary="Propriedades para verificação de depuração"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--debug-check</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>

  Imprima algumas informações de depuração quando o programa sair.

- `--debug-info`, `-T`

  <table summary="Propriedades para debug-info"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--debug-info</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>

  Imprima informações de depuração, estatísticas de uso de memória e CPU quando o programa sair.

- `--default-auth=plugin`

  <table summary="Propriedades para autenticação padrão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>

  Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Veja a Seção 8.2.17, “Autenticação Personalizável”.

- `--default-character-set=charset_name`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>0

  Use `charset_name` como o conjunto de caracteres padrão. Veja a Seção 12.15, “Configuração do Conjunto de Caracteres”.

- `--defaults-extra-file=file_name`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>1

  Leia este arquivo de opção após o arquivo de opção global, mas (no Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se `file_name` não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--defaults-file=file_name`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>2

  Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou estiver inacessível, ocorrerá um erro. Se `file_name` não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--defaults-group-suffix=str`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>3

  Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de `str`. Por exemplo, **mysql\_upgrade** normalmente lê os grupos `[client]` e `[mysql_upgrade]`. Se esta opção for dada como `--defaults-group-suffix=_other`, **mysql\_upgrade** também lê os grupos `[client_other]` e `[mysql_upgrade_other]`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--force`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>4

  Ignore o arquivo `mysql_upgrade_info` e force a execução mesmo que o **mysql\_upgrade** já tenha sido executado para a versão atual do MySQL.

- `--get-server-public-key`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>5

  Peça à rede o par de chaves públicas necessário para a troca de senhas com base em pares de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

  Para obter informações sobre o plugin `caching_sha2_password`, consulte a Seção 8.4.1.2, “Cacheamento de Autenticação Conectada a SHA-2”.

- `--host=host_name`, `-h host_name`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>6

  Conecte-se ao servidor MySQL no host fornecido.

- `--login-path=name`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>7

  Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam para qual servidor MySQL se conectar e qual conta autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql\_config\_editor**. Veja a Seção 6.6.7, “mysql\_config\_editor — Utilitário de Configuração MySQL”.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--max-allowed-packet=value`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>8

  O tamanho máximo do buffer para a comunicação cliente/servidor. O valor padrão é de 24 MB. Os valores mínimo e máximo são de 4 KB e 2 GB.

- `--net-buffer-length=value`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>9

  O tamanho inicial do buffer para a comunicação cliente/servidor. O valor padrão é de 1 MB a 1 KB. Os valores mínimo e máximo são de 4 KB e 16 MB.

- `--no-defaults`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>0

  Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para impedir que sejam lidas.

  A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar o `.mylogin.cnf`, use o utilitário **mysql\_config\_editor**. Veja a Seção 6.6.7, “mysql\_config\_editor — Utilitário de Configuração do MySQL”.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--password[=password]`, `-p[password]`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>1

  A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysql\_upgrade** solicitará uma senha. Se for fornecida, não deve haver **espaço** entre `--password=` ou `-p` e a senha que o segue. Se nenhuma opção de senha for especificada, o padrão é não enviar senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Consulte a Seção 8.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

  Para especificar explicitamente que não há senha e que o **mysql\_upgrade** não deve solicitar uma senha, use a opção `--skip-password`.

- `--pipe`, `-W`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>2

  No Windows, conecte-se ao servidor usando um tubo nomeado. Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por tubo nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

- `--plugin-dir=dir_name`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>3

  O diretório onde procurar por plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o **mysql\_upgrade** não encontrá-lo. Veja a Seção 8.2.17, “Autenticação Personalizável”.

- `--port=port_num`, `-P port_num`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>4

  Para conexões TCP/IP, o número de porta a ser usado.

- `--print-defaults`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>5

  Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção.

- `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>6

  O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de um protocolo diferente do que você deseja. Para obter detalhes sobre os valores permitidos, consulte a Seção 6.2.7, “Protocolos de Transporte de Conexão”.

- `--server-public-key-path=file_name`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>7

  O nome do caminho de um arquivo no formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senhas com par de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

  Para `sha256_password`, esta opção só se aplica se o MySQL foi construído usando o OpenSSL.

  Para obter informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 8.4.1.3, “Autenticação Conectada a SHA-256”, e a Seção 8.4.1.2, “Cache de Autenticação Conectada a SHA-2”.

- `--shared-memory-base-name=name`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>8

  Em Windows, o nome de memória compartilhada a ser usado para conexões feitas usando memória compartilhada para um servidor local. O valor padrão é \[\[`MYSQL`]. O nome de memória compartilhada é sensível a maiúsculas e minúsculas.

  Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

- `--skip-sys-schema`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>9

  Por padrão, o **mysql\_upgrade** instala o esquema `sys` se ele não estiver instalado e, caso contrário, o atualiza para a versão atual. A opção `--skip-sys-schema` suprime esse comportamento.

- `--socket=path`, `-S path`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>0

  Para conexões ao `localhost`, o arquivo de socket Unix a ser usado ou, no Windows, o nome do tubo nomeado a ser usado.

  No Windows, essa opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de canal nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

- `--ssl*`

  As opções que começam com `--ssl` especificam se você deseja se conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Consulte Opções de comando para conexões criptografadas.

- `--ssl-fips-mode={OFF|ON|STRICT}`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>1

  Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere de outras opções `--ssl-xxx` porque não é usada para estabelecer conexões criptografadas, mas sim para determinar quais operações criptográficas devem ser permitidas. Veja a Seção 8.8, “Suporte FIPS”.

  Estes valores `--ssl-fips-mode` são permitidos:

  - `OFF`: Desative o modo FIPS.
  - `ON`: Habilitar o modo FIPS.
  - `STRICT`: Habilitar o modo FIPS "estricto".

  Nota

  Se o Módulo de Objeto FIPS OpenSSL não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Nesse caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente emita um aviso na inicialização e opere no modo não FIPS.

  A partir do MySQL 8.0.34, essa opção está desatualizada. Espera-se que ela seja removida em uma versão futura do MySQL.

- `--tls-ciphersuites=ciphersuite_list`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>2

  As sequências de cifra permitidas para conexões criptografadas que utilizam TLSv1.3. O valor é uma lista de um ou mais nomes de sequências de cifra separados por vírgula. As sequências de cifra que podem ser nomeadas para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para obter detalhes, consulte a Seção 8.3.2, “Protocolos e cifra de conexão criptografada TLS”.

  Essa opção foi adicionada no MySQL 8.0.16.

- `--tls-version=protocol_list`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>3

  Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolos separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para obter detalhes, consulte a Seção 8.3.2, “Protocolos e cifra TLS de conexão criptografada”.

- `--upgrade-system-tables`, `-s`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>4

  Atualize apenas as tabelas do sistema no esquema `mysql`, não atualize os esquemas de usuários.

- `--user=user_name`, `-u user_name`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>5

  O nome de usuário da conta MySQL a ser usado para se conectar ao servidor. O nome de usuário padrão é `root`.

- `--verbose`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>6

  Modo verbose. Imprima mais informações sobre o que o programa faz.

- `--version-check`, `-k`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>7

  Verifique a versão do servidor ao qual o **mysql\_upgrade** está se conectando para verificar se é a mesma versão para a qual o **mysql\_upgrade** foi construído. Se não for, o **mysql\_upgrade** sai. Esta opção está habilitada por padrão; para desabilitar a verificação, use `--skip-version-check`.

- `--write-binlog`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>8

  Por padrão, o registro binário pelo **mysql\_upgrade** está desativado. Inicie o programa com `--write-binlog` se quiser que suas ações sejam registradas no log binário.

  Quando o servidor estiver rodando com identificadores de transações globais (GTIDs) habilitados (`gtid_mode=ON`), não habilite o registro binário pelo **mysql\_upgrade**.

- `--zstd-compression-level=level`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>9

  O nível de compressão a ser usado para conexões com o servidor que utilizam o algoritmo de compressão `zstd`. Os níveis permitidos variam de 1 a 22, com valores maiores indicando níveis crescentes de compressão. O nível de compressão padrão `zstd` é 3. A configuração do nível de compressão não afeta conexões que não utilizam a compressão `zstd`.

  Para obter mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

  Essa opção foi adicionada no MySQL 8.0.18.
