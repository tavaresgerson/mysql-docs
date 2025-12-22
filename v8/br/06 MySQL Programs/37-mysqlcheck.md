### 6.5.3 mysqlcheck  Um programa de manutenção de tabelas

O cliente `mysqlcheck` realiza a manutenção de tabelas: verifica, repara, otimiza ou analisa tabelas.

Cada tabela está bloqueada e, portanto, não está disponível para outras sessões enquanto está sendo processada, embora para operações de verificação, a tabela seja bloqueada apenas com um bloqueio `READ` (veja Seção 15.3.6, LOCK TABLES e UNLOCK TABLES Statements, para mais informações sobre bloqueios `READ` e `WRITE`). As operações de manutenção da tabela podem ser demoradas, especialmente para tabelas grandes. Se você usar a opção `--databases` ou `--all-databases` para processar todas as tabelas em um ou mais bancos de dados, uma invocação de `mysqlcheck` pode levar muito tempo. (Isso também é verdadeiro para o procedimento de atualização da tabela MySQL se ela determinar que a verificação é necessária porque ela processa tabelas da mesma maneira.)

`mysqlcheck` deve ser usado quando o servidor `mysqld` está em execução, o que significa que você não tem que parar o servidor para executar a manutenção da tabela.

`mysqlcheck` usa as instruções SQL `CHECK TABLE`, `REPAIR TABLE`, `ANALYZE TABLE`, e `OPTIMIZE TABLE` de uma forma conveniente para o usuário. Ele determina quais instruções usar para a operação que você deseja executar, e então envia as instruções para o servidor para serem executadas. Para detalhes sobre quais motores de armazenamento cada instrução funciona, consulte as descrições para essas instruções na Seção 15.7.3, Instruções de Manutenção de Tabela.

Todos os motores de armazenamento não necessariamente suportam todas as quatro operações de manutenção. Nesses casos, uma mensagem de erro é exibida. Por exemplo, se `test.t` é uma tabela `MEMORY`, uma tentativa de verificá-la produz este resultado:

```
$> mysqlcheck test t
test.t
note     : The storage engine for the table doesn't support check
```

Se `mysqlcheck` não conseguir reparar uma tabela, consulte a Seção 3.14, Reconstrução ou Reparação de tabelas ou índices para estratégias manuais de reparo de tabelas. Este é o caso, por exemplo, das tabelas `InnoDB`, que podem ser verificadas com `CHECK TABLE`, mas não reparadas com `REPAIR TABLE`.

Precaução

É melhor fazer um backup de uma tabela antes de executar uma operação de reparo de tabela; sob algumas circunstâncias, a operação pode causar perda de dados.

Existem três maneiras gerais de invocar `mysqlcheck`:

```
mysqlcheck [options] db_name [tbl_name ...]
mysqlcheck [options] --databases db_name ...
mysqlcheck [options] --all-databases
```

Se você não nomear nenhuma tabela após \* `db_name` \* ou se você usar a opção `--databases` ou `--all-databases`, bancos de dados inteiros são verificados.

`mysqlcheck` tem uma característica especial em comparação com outros programas cliente. O comportamento padrão de verificação de tabelas (`--check`) pode ser alterado renomeando o binário. Se você quiser ter uma ferramenta que repare tabelas por padrão, você deve apenas fazer uma cópia de `mysqlcheck` chamado **mysqlrepair**, ou fazer um link simbólico para `mysqlcheck` chamado **mysqlrepair**. Se você invocar **mysqlrepair**, ele repara tabelas.

Os nomes mostrados na tabela a seguir podem ser usados para alterar o comportamento padrão do `mysqlcheck`.

<table><col style="width: 25%"/><col style="width: 75%"/><thead><tr> <th>Comando</th> <th>Significado</th> </tr></thead><tbody><tr> <td><span><strong>Reparação de mysql</strong></span></td> <td>A opção padrão é [[<code class="option">--repair</code>]]</td> </tr><tr> <td><span><strong>mysqlanalyze</strong></span></td> <td>A opção padrão é [[<code class="option">--analyze</code>]]</td> </tr><tr> <td><span><strong>mysqloptimize</strong></span></td> <td>A opção padrão é [[<code class="option">--optimize</code>]]</td> </tr></tbody></table>

`mysqlcheck` suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysqlcheck]` e `[client]` de um arquivo de opções. Para informações sobre arquivos de opções usados por programas MySQL, consulte a Seção 6.2.2.2, Using Option Files.

\*\* Tabela 6.12 Opções de mysqlcheck \*\*

<table><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Nome da opção</th> <th>Descrição</th> </tr></thead><tbody><tr><td>--todas as bases de dados</td> <td>Verificar todas as tabelas em todas as bases de dados</td> </tr><tr><td>- Tudo em um.</td> <td>Executar uma única instrução para cada banco de dados que nomeia todas as tabelas desse banco de dados</td> </tr><tr><td>- Analisar.</td> <td>Analisar as tabelas</td> </tr><tr><td>- Reparação automática</td> <td>Se uma tabela verificada estiver corrompida, corrija-a automaticamente</td> </tr><tr><td>- Endereço de ligação</td> <td>Usar interface de rede especificada para se conectar ao MySQL Server</td> </tr><tr><td>--conjuntos de caracteres-dir</td> <td>Diretório onde são instalados conjuntos de caracteres</td> </tr><tr><td>- Verificar.</td> <td>Verifique se há erros nas tabelas</td> </tr><tr><td>- Verificar apenas alterado.</td> <td>Verifique apenas as tabelas que foram alteradas desde a última verificação</td> </tr><tr><td>- Verificar-upgrade</td> <td>Invocar CHECK TABLE com a opção FOR UPGRADE</td> </tr><tr><td>--comprimir</td> <td>Comprimir todas as informações enviadas entre o cliente e o servidor</td> </tr><tr><td>Algoritmos de compressão</td> <td>Algoritmos de compressão permitidos para ligações ao servidor</td> </tr><tr><td>--bases de dados</td> <td>Interpretar todos os argumentos como nomes de base de dados</td> </tr><tr><td>--debug</td> <td>Registro de depuração</td> </tr><tr><td>--debug-check</td> <td>Imprimir informações de depuração quando o programa sair</td> </tr><tr><td>--debug-info</td> <td>Imprimir informações de depuração, memória e estatísticas da CPU quando o programa sai</td> </tr><tr><td>--default-auth</td> <td>Plugin de autenticação a usar</td> </tr><tr><td>--default-character-set</td> <td>Especificar o conjunto de caracteres padrão</td> </tr><tr><td>--defaults-extra-file</td> <td>Leia arquivo de opção nomeado além dos arquivos de opção habituais</td> </tr><tr><td>--defaults-file</td> <td>Arquivo de opções nomeadas somente para leitura</td> </tr><tr><td>--defaults-group-suffix</td> <td>Valor do sufixo do grupo de opções</td> </tr><tr><td>- Plug-in de texto claro</td> <td>Ativar o plug-in de autenticação de texto claro</td> </tr><tr><td>- ... estendida</td> <td>Tabelas de verificação e reparação</td> </tr><tr><td>- Rápido.</td> <td>Verificar apenas tabelas que não foram fechadas corretamente</td> </tr><tr><td>- Força</td> <td>Continuar mesmo que ocorra um erro SQL</td> </tr><tr><td>--get-server-public-key</td> <td>Solicitar a chave pública RSA do servidor</td> </tr><tr><td>- Ajuda .</td> <td>Mostrar mensagem de ajuda e sair</td> </tr><tr><td>- Hospedeiro</td> <td>Host em que o servidor MySQL está localizado</td> </tr><tr><td>--login-path</td> <td>Leia as opções de caminho de login em .mylogin.cnf</td> </tr><tr><td>- Verificação média.</td> <td>Fazer uma verificação que é mais rápida do que uma operação --extended</td> </tr><tr><td>- Não há padrões</td> <td>Não ler arquivos de opções</td> </tr><tr><td>--não-login-caminhos</td> <td>Não ler os caminhos de login no arquivo de caminho de login</td> </tr><tr><td>- Otimizar</td> <td>Optimizar as tabelas</td> </tr><tr><td>--senha</td> <td>Senha para usar quando se conectar ao servidor</td> </tr><tr><td>- Senha 1</td> <td>Primeira senha de autenticação multifator a usar ao se conectar ao servidor</td> </tr><tr><td>- Senha 2</td> <td>Segunda senha de autenticação multifator a usar ao se conectar ao servidor</td> </tr><tr><td>- Senha 3</td> <td>Terceira senha de autenticação multifator a utilizar quando se conectar ao servidor</td> </tr><tr><td>- Tubo.</td> <td>Conectar-se ao servidor usando o nome do tubo (somente Windows)</td> </tr><tr><td>--plugin-dir</td> <td>Diretório onde os plugins estão instalados</td> </tr><tr><td>- Porto</td> <td>Número de porta TCP/IP para conexão</td> </tr><tr><td>- Impressão padrão</td> <td>Opções padrão de impressão</td> </tr><tr><td>- Protocolo</td> <td>Protocolo de transporte a utilizar</td> </tr><tr><td>- Rápido.</td> <td>O método de verificação mais rápido</td> </tr><tr><td>- Reparação</td> <td>Realizar um reparo que pode corrigir quase tudo exceto chaves únicas que não são únicos</td> </tr><tr><td>--server-chave pública-caminho</td> <td>Nome do caminho para o ficheiro que contém a chave pública RSA</td> </tr><tr><td>--shared-memory-base-name</td> <td>Nome de memória partilhada para conexões de memória partilhada (somente Windows)</td> </tr><tr><td>- Silêncio.</td> <td>Modo silencioso</td> </tr><tr><td>--base de dados de omissão</td> <td>Omitir esta base de dados das operações executadas</td> </tr><tr><td>- Soquete</td> <td>Arquivo de soquete do Unix ou tubo nomeado do Windows para usar</td> </tr><tr><td>- O quê?</td> <td>Arquivo que contém lista de autoridades de certificação SSL confiáveis</td> </tr><tr><td>--ssl-capath</td> <td>Diretório que contém ficheiros de certificados SSL confiáveis</td> </tr><tr><td>--ssl-cert</td> <td>Arquivo que contém o certificado X.509</td> </tr><tr><td>--SSL-cifrado</td> <td>Códigos permitidos para a encriptação da ligação</td> </tr><tr><td>--ssl-crl</td> <td>Arquivo que contém listas de revogação de certificados</td> </tr><tr><td>--ssl-crlpath</td> <td>Diretório que contém ficheiros de lista de revogação de certificado</td> </tr><tr><td>--ssl-fips-modo</td> <td>Ativar o modo FIPS do lado do cliente</td> </tr><tr><td>--ssl-chave</td> <td>Arquivo que contém a chave X.509</td> </tr><tr><td>- Modo SSL</td> <td>Estado de segurança desejado da ligação ao servidor</td> </tr><tr><td>--ssl-data-de-sessão</td> <td>Arquivo que contém dados de sessão SSL</td> </tr><tr><td>--ssl-session-data-continue-on-failed-reuse</td> <td>Estabelecer conexões se a reutilização da sessão falhar</td> </tr><tr><td>-- tabelas</td> <td>Anula a opção --databases ou -B</td> </tr><tr><td>--tls-ciphersuites</td> <td>Suítes de encriptação TLSv1.3 permitidas para conexões criptografadas</td> </tr><tr><td>--tls-sni-nome do servidor</td> <td>Nome do servidor fornecido pelo cliente</td> </tr><tr><td>- Versão TLS</td> <td>Protocolos TLS admissíveis para ligações encriptadas</td> </tr><tr><td>--use-frm</td> <td>Para operações de reparação em tabelas MyISAM</td> </tr><tr><td>-- utilizador</td> <td>Nome do usuário do MySQL para usar quando se conectar ao servidor</td> </tr><tr><td>- Verbosos.</td> <td>Modo Verbose</td> </tr><tr><td>- versão</td> <td>Informações de versão de exibição e saída</td> </tr><tr><td>- Escrever-binlog</td> <td>Log ANALYZE, OPTIMIZE, REPAIR instruções para o log binário. --skip-write-binlog adiciona NO_WRITE_TO_BINLOG a estas instruções</td> </tr><tr><td>--zstd-nível de compressão</td> <td>Nível de compressão para conexões com servidor que usam compressão zstd</td> </tr></tbody></table>

- `--help`, `-?`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

Mostra uma mensagem de ajuda e sai.

- `--all-databases`, `-A`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--all-databases</code>]]</td> </tr></tbody></table>

Verifique todas as tabelas em todos os bancos de dados. Isso é o mesmo que usar a opção `--databases` e nomear todos os bancos de dados na linha de comando, exceto que os bancos de dados `INFORMATION_SCHEMA` e `performance_schema` não são verificados. Eles podem ser verificados nomeando-os explicitamente com a opção `--databases`.

- `--all-in-1`, `-1`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--all-in-1</code>]]</td> </tr></tbody></table>

Em vez de emitir uma instrução para cada tabela, execute uma única instrução para cada banco de dados que nomeie todas as tabelas desse banco de dados a serem processadas.

- `--analyze`, `-a`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--analyze</code>]]</td> </tr></tbody></table>

Analise as tabelas.

- `--auto-repair`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--auto-repair</code>]]</td> </tr></tbody></table>

Se uma tabela verificada estiver corrompida, corrija-a automaticamente.

- `--bind-address=ip_address`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>

Em um computador com várias interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao servidor MySQL.

- `--character-sets-dir=dir_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--character-sets-dir=dir_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do diretório</td> </tr></tbody></table>

O diretório onde estão instalados os conjuntos de caracteres.

- `--check`, `-c`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--check</code>]]</td> </tr></tbody></table>

Verifique se há erros nas tabelas. Esta é a operação padrão.

- `--check-only-changed`, `-C`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--check-only-changed</code>]]</td> </tr></tbody></table>

Verificar apenas as tabelas que tenham sido alteradas desde a última verificação ou que não tenham sido fechadas corretamente.

- `--check-upgrade`, `-g`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--check-upgrade</code>]]</td> </tr></tbody></table>

Invoque `CHECK TABLE` com a opção `FOR UPGRADE` para verificar se as tabelas são incompatíveis com a versão atual do servidor.

- `--compress`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Depreciado</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Se possível, comprimir todas as informações enviadas entre o cliente e o servidor.

Esta opção está desatualizada. Espera-se que seja removida em uma versão futura do MySQL. Veja Configurar a Compressão de Conexão Legada.

- `--compression-algorithms=value`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--compression-algorithms=value</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Conjunto</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>uncompressed</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>zlib</code>]]</p><p class="valid-value">[[<code>zstd</code>]]</p><p class="valid-value">[[<code>uncompressed</code>]]</p></td> </tr></tbody></table>

Os algoritmos de compressão permitidos para conexões com o servidor. Os algoritmos disponíveis são os mesmos que para a variável do sistema `protocol_compression_algorithms`. O valor padrão é `uncompressed`.

Para mais informações, ver ponto 6.2.8, "Controlo da compressão da ligação".

- `--databases`, `-B`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--databases</code>]]</td> </tr></tbody></table>

Processar todas as tabelas nas bases de dados nomeadas. Normalmente, `mysqlcheck` trata o primeiro argumento de nome na linha de comando como um nome de banco de dados e quaisquer nomes seguintes como nomes de tabela. Com esta opção, trata todos os argumentos de nome como nomes de banco de dados.

- `--debug[=debug_options]`, `-# [debug_options]`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--debug[=debug_option<code>d:t:o</code></code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>d:t:o</code>]]</td> </tr></tbody></table>

Escreva um log de depuração. Uma string típica `debug_options` é `d:t:o,file_name`. O padrão é `d:t:o`.

Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`.

- `--debug-check`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--debug-check</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>

Imprima algumas informações de depuração quando o programa sair.

Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`.

- `--debug-info`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--debug-info</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>

Imprima informações de depuração e estatísticas de uso de memória e CPU quando o programa sair.

Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`.

- `--default-character-set=charset_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--default-character-set=charset_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Use `charset_name` como conjunto de caracteres padrão. Ver Seção 12.15, Caracter Set Configuration.

- `--defaults-extra-file=file_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--defaults-extra-file=file_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr></tbody></table>

Leia este arquivo de opção após o arquivo de opção global, mas (em Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou for inacessível, ocorre um erro. Se \* `file_name` \* não for um nome de caminho absoluto, ele é interpretado em relação ao diretório atual.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--defaults-file=file_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--defaults-file=file_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr></tbody></table>

Use apenas o arquivo de opção dado. Se o arquivo não existir ou for inacessível, ocorre um erro. Se `file_name` não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Exceção: Mesmo com `--defaults-file`, os programas cliente lêem `.mylogin.cnf`.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--defaults-group-suffix=str`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--defaults-group-suffix=str</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Leia não apenas os grupos de opções usuais, mas também os grupos com os nomes usuais e um sufixo de \* `str` *. Por exemplo, \*\* mysqlcheck \*\* normalmente lê os grupos `[client]` e `[mysqlcheck]`. Se esta opção for dada como `--defaults-group-suffix=_other`, \*\* mysqlcheck*\* também lê os grupos `[client_other]` e `[mysqlcheck_other]`.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--extended`, `-e`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--extended</code>]]</td> </tr></tbody></table>

Se você estiver usando essa opção para verificar tabelas, ela garante que elas sejam 100% consistentes, mas leva muito tempo.

Se você estiver usando esta opção para reparar tabelas, ele executa uma reparação estendida que pode não só levar um longo tempo para executar, mas pode produzir um monte de linhas de lixo também!

- `--default-auth=plugin`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Uma dica sobre qual plugin de autenticação do lado do cliente usar.

- `--enable-cleartext-plugin`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--enable-cleartext-plugin</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>

Ativar o plug-in de autenticação de texto transparente `mysql_clear_password` (ver Seção 8.4.1.4, Client-Side Cleartext Pluggable Authentication.)

- `--fast`, `-F`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--fast</code>]]</td> </tr></tbody></table>

Verifique apenas as tabelas que não tenham sido fechadas corretamente.

- `--force`, `-f`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--force</code>]]</td> </tr></tbody></table>

Continuar mesmo se ocorrer um erro SQL.

- `--get-server-public-key`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--get-server-public-key</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr></tbody></table>

Solicitar do servidor a chave pública necessária para a troca de senhas baseada em pares de chaves RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senhas baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` é dado e especifica um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

Para obter informações sobre o plug-in `caching_sha2_password`, consulte a Seção 8.4.1.2, Caching SHA-2 Pluggable Authentication.

- `--host=host_name`, `-h host_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--host=host_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>localhost</code>]]</td> </tr></tbody></table>

Conecte-se ao servidor MySQL no host dado.

- `--login-path=name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--login-path=name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Leia opções do caminho de login nomeado no arquivo de caminho de login. Um caminho de login é um grupo de opções que contém opções que especificam a qual servidor MySQL se conectar e qual conta autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql\_config\_editor**. Veja Seção 6.6.7, mysql\_config\_editor  MySQL Configuration Utility.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--no-login-paths`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--no-login-paths</code>]]</td> </tr></tbody></table>

Salta opções de leitura do arquivo de caminho de login.

Ver `--login-path` para informações relacionadas.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--medium-check`, `-m`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--medium-check</code>]]</td> </tr></tbody></table>

Faça uma verificação que seja mais rápida do que uma operação `--extended`. Isso encontra apenas 99,99% de todos os erros, o que deve ser bom o suficiente na maioria dos casos.

- `--no-defaults`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--no-defaults</code>]]</td> </tr></tbody></table>

Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para impedi-las de serem lidas.

A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma forma mais segura do que na linha de comando, mesmo quando `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql\_config\_editor**. Veja Seção 6.6.7, mysql\_config\_editor  MySQL Configuration Utility.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--optimize`, `-o`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--optimize</code>]]</td> </tr></tbody></table>

Optimizar as tabelas.

- `--password[=password]`, `-p[password]`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--password[=password]</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, `mysqlcheck` solicita um. Se for fornecido, deve haver \* nenhum espaço \* entre `--password=` ou `-p` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar senha.

A especificação de uma senha na linha de comando deve ser considerada insegura. Para evitar a indicação da senha na linha de comando, use um arquivo de opções. Veja a Seção 8.1.2.1, "Diretrizes do Usuário Final para a Segurança de Senhas".

Para especificar explicitamente que não há senha e que `mysqlcheck` não deve solicitar uma, use a opção `--skip-password`.

- `--password1[=pass_val]`

A senha para o fator de autenticação multifator 1 da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, `mysqlcheck` solicita um. Se for fornecido, deve haver \* nenhum espaço \* entre `--password1=` e a senha que o segue. Se nenhuma opção de senha for especificada, o padrão é não enviar senha.

A especificação de uma senha na linha de comando deve ser considerada insegura. Para evitar a indicação da senha na linha de comando, use um arquivo de opções. Veja a Seção 8.1.2.1, "Diretrizes do Usuário Final para a Segurança de Senhas".

Para especificar explicitamente que não há senha e que `mysqlcheck` não deve solicitar uma, use a opção `--skip-password1`.

`--password1` e `--password` são sinônimos, assim como `--skip-password1` e `--skip-password`.

- `--password2[=pass_val]`

A senha para o fator de autenticação multifator 2 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica de `--password1`; veja a descrição dessa opção para detalhes.

- `--password3[=pass_val]`

A senha para o fator de autenticação multifator 3 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica para `--password1`; veja a descrição dessa opção para detalhes.

- `--pipe`, `-W`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--pipe</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

No Windows, conecte-se ao servidor usando um tubo nomeado. Esta opção se aplica apenas se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de tubo nomeado. Além disso, o usuário que faz a conexão deve ser um membro do grupo Windows especificado pela variável de sistema `named_pipe_full_access_group`.

- `--plugin-dir=dir_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--plugin-dir=dir_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do diretório</td> </tr></tbody></table>

O diretório em que procurar plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas `mysqlcheck` não o encontrar. Veja Seção 8.2.17, Autenticação Pluggable.

- `--port=port_num`, `-P port_num`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--port=port_num</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>3306</code>]]</td> </tr></tbody></table>

Para as ligações TCP/IP, o número de porta a utilizar.

- `--print-defaults`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--print-defaults</code>]]</td> </tr></tbody></table>

Imprima o nome do programa e todas as opções que ele obtém de arquivos de opções.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--protocol=type</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>[see tex<code>TCP</code></code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>TCP</code>]]</p><p class="valid-value">[[<code>SOCKET</code>]]</p><p class="valid-value">[[<code>PIPE</code>]]</p><p class="valid-value">[[<code>MEMORY</code>]]</p></td> </tr></tbody></table>

O protocolo de transporte a utilizar para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam na utilização de um protocolo diferente daquele desejado.

- `--quick`, `-q`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--quick</code>]]</td> </tr></tbody></table>

Se você estiver usando esta opção para verificar tabelas, ele impede a verificação de verificar as linhas para verificar ligações incorretas. Este é o método de verificação mais rápido.

Se você estiver usando esta opção para reparar tabelas, ele tentará reparar apenas a árvore de índice. Este é o método de reparo mais rápido.

- `--repair`, `-r`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--repair</code>]]</td> </tr></tbody></table>

Realizar um reparo que pode consertar quase tudo, exceto chaves únicas que não são únicas.

- `--server-public-key-path=file_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--server-public-key-path=file_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr></tbody></table>

O nome do caminho para um arquivo no formato PEM contendo uma cópia do lado do cliente da chave pública exigida pelo servidor para troca de senhas baseada em pares de chaves RSA. Esta opção se aplica a clientes que se autenticam com o plug-in de autenticação `sha256_password` (obsoleto) ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plug-ins. Também é ignorada se a troca de senhas baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` é dado e especifica um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

Para `sha256_password` (deprecated), esta opção aplica-se apenas se o MySQL foi construído usando OpenSSL.

Para obter informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 8.4.1.3, Autenticação Pluggable SHA-256, e a Seção 8.4.1.2, Cache SHA-2 Pluggable Authentication.

- `--shared-memory-base-name=name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--shared-memory-base-name=name</code>]]</td> </tr><tr><th>Específicos da plataforma</th> <td>Vidros</td> </tr></tbody></table>

No Windows, o nome de memória compartilhada a ser usado para conexões feitas usando memória compartilhada para um servidor local. O valor padrão é `MYSQL`. O nome de memória compartilhada é sensível a maiúscula e minúscula.

Esta opção aplica-se apenas se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

- `--silent`, `-s`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--silent</code>]]</td> </tr></tbody></table>

Imprimir apenas mensagens de erro.

- `--skip-database=db_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--skip-database=db_name</code>]]</td> </tr></tbody></table>

Não inclua o banco de dados nomeado (sensível a maiúsculas e minúsculas) nas operações realizadas por `mysqlcheck`.

- `--socket=path`, `-S path`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--socket={file_name|pipe_name}</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Para conexões com `localhost`, o arquivo de soquete do Unix a ser usado, ou, no Windows, o nome do tubo nomeado a ser usado.

No Windows, essa opção se aplica apenas se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de name-pipe. Além disso, o usuário que faz a conexão deve ser um membro do grupo Windows especificado pela variável de sistema `named_pipe_full_access_group`.

- `--ssl*`

  As opções que começam com `--ssl` especificam se deve se conectar ao servidor usando criptografia e indicam onde encontrar chaves e certificados SSL. Veja Opções de comando para conexões criptografadas.
- `--ssl-fips-mode={OFF|ON|STRICT}`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--ssl-fips-mode={OFF|ON|STRICT}</code>]]</td> </tr><tr><th>Depreciado</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Enumeração</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>STRICT</code>]]</p></td> </tr></tbody></table>

Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere das outras opções `--ssl-xxx` na medida em que não é usada para estabelecer conexões criptografadas, mas sim para afetar quais operações criptográficas devem ser permitidas. Veja Seção 8.8, Suporte FIPS.

São permitidos os seguintes valores de \[`--ssl-fips-mode`]:

- `OFF`: Desativar o modo FIPS.
- `ON`: Ativar o modo FIPS.
- `STRICT`: Ativar o modo strict FIPS.

Se o módulo de objeto OpenSSL FIPS não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Neste caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente produza um aviso na inicialização e funcione no modo não-FIPS.

:::

Esta opção está desatualizada. Espera-se que seja removida em uma versão futura do MySQL.

- `--tables`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--tables</code>]]</td> </tr></tbody></table>

Sobrescreva a opção `--databases` ou `-B`. Todos os argumentos de nome que seguem a opção são considerados nomes de tabela.

- `--tls-ciphersuites=ciphersuite_list`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--tls-ciphersuites=ciphersuite_list</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Os ciphersuites permitidos para conexões criptografadas que usam TLSv1.3. O valor é uma lista de um ou mais nomes de ciphersuite separados por duas vírgulas. Os ciphersuites que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, "Protocolos e Cipheres TLS de Conexão Criptografada".

- `--tls-sni-servername=server_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--tls-sni-servername=server_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Quando especificado, o nome é passado para a biblioteca de API C `libmysqlclient` usando a opção `MYSQL_OPT_TLS_SNI_SERVERNAME` de `mysql_options()`. O nome do servidor não é sensível a maiúsculas e minúsculas. Para mostrar qual nome de servidor o cliente especificou para a sessão atual, se houver, verifique a variável de status `Tls_sni_server_name`.

O Server Name Indication (SNI) é uma extensão do protocolo TLS (o OpenSSL deve ser compilado usando extensões TLS para que esta opção funcione).

- `--tls-version=protocol_list`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--tls-version=protocol_list</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td><p class="valid-value">[[<code>TLSv1,TLSv1.1,TLSv1.2,TLSv1.3</code>]] (OpenSSL 1.1.1 ou superior)</p><p class="valid-value">[[<code>TLSv1,TLSv1.1,TLSv1.2</code>]] (caso contrário)</p></td> </tr></tbody></table>

Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolo separados por vírgulas. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, "Protocolos e cifras TLS de conexão criptografada".

- `--use-frm`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--use-frm</code>]]</td> </tr></tbody></table>

Para operações de reparo em tabelas `MyISAM`, obtenha a estrutura da tabela do dicionário de dados para que a tabela possa ser reparada mesmo que o cabeçalho `.MYI` esteja corrompido.

- `--user=user_name`, `-u user_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--user=user_name,</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Nome do utilizador da conta MySQL a utilizar para se conectar ao servidor.

- `--verbose`, `-v`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--verbose</code>]]</td> </tr></tbody></table>

Imprimir informações sobre as várias fases de operação do programa.

- `--version`, `-V`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--version</code>]]</td> </tr></tbody></table>

Informações de versão e saída.

- `--write-binlog`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--write-binlog</code>]]</td> </tr></tbody></table>

Esta opção está habilitada por padrão, de modo que as instruções `ANALYZE TABLE`, `OPTIMIZE TABLE`, e `REPAIR TABLE` geradas pelo `mysqlcheck` são escritas no log binário. Use `--skip-write-binlog` para fazer com que `NO_WRITE_TO_BINLOG` seja adicionado às instruções para que elas não sejam registradas. Use o `--skip-write-binlog` quando essas instruções não devem ser enviadas para réplicas ou executadas ao usar os registros binários para recuperação de backup.

- `--zstd-compression-level=level`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--zstd-compression-level=#</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr></tbody></table>

O nível de compressão a usar para conexões com o servidor que usam o algoritmo de compressão `zstd`. Os níveis permitidos são de 1 a 22, com valores maiores indicando níveis crescentes de compressão. O nível de compressão `zstd` padrão é 3. A configuração do nível de compressão não tem efeito em conexões que não usam a compressão `zstd`.

Para mais informações, ver ponto 6.2.8, "Controlo da compressão da ligação".
