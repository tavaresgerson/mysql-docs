### 6.5.5 mysqlimport — Um programa de importação de dados

O cliente **mysqlimport** fornece uma interface de linha de comando para a instrução SQL `LOAD DATA`. A maioria das opções do **mysqlimport** corresponde diretamente a cláusulas da sintaxe do `LOAD DATA`. Veja a Seção 15.2.9, “Instrução LOAD DATA”.

Invoque **mysqlimport** da seguinte forma:

```
mysqlimport [options] db_name textfile1 [textfile2 ...]
```

Para cada arquivo de texto nomeado na linha de comando, o **mysqlimport** remove qualquer extensão do nome do arquivo e usa o resultado para determinar o nome da tabela na qual os conteúdos do arquivo serão importados. Por exemplo, arquivos com os nomes `patient.txt`, `patient.text` e `patient` seriam todos importados em uma tabela chamada `patient`.

O **mysqlimport** suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysqlimport]` e `[client]` de um arquivo de opções. Para obter informações sobre os arquivos de opções usados pelos programas MySQL, consulte a Seção 6.2.2.2, “Usando arquivos de opções”.

**Tabela 6.16 Opções de mysqlimport**

<table summary="Opções de linha de comando disponíveis para mysqlimport."><thead><tr><th scope="col">Nome da Opção</th> <th scope="col">Descrição</th> <th scope="col">Introduzido</th> <th scope="col">Desatualizado</th> </tr></thead><tbody><tr><th>--bind-address</th> <td>Use a interface de rede especificada para se conectar ao servidor MySQL</td> <td></td> <td></td> </tr><tr><th>--sets-de-caracteres-dir</th> <td>Diretório onde os conjuntos de caracteres podem ser encontrados</td> <td></td> <td></td> </tr><tr><th>--colunas</th> <td>Esta opção aceita uma lista de nomes de colunas separados por vírgula como seu valor</td> <td></td> <td></td> </tr><tr><th>--compress</th> <td>Compressar todas as informações enviadas entre o cliente e o servidor</td> <td></td> <td>8.0.18</td> </tr><tr><th>--algoritmos de compressão</th> <td>Algoritmos de compressão permitidos para conexões com o servidor</td> <td>8.0.18</td> <td></td> </tr><tr><th>--debug</th> <td>Escreva o log de depuração</td> <td></td> <td></td> </tr><tr><th>--debug-check</th> <td>Imprimir informações de depuração quando o programa sai</td> <td></td> <td></td> </tr><tr><th>--debug-info</th> <td>Imprimir informações de depuração, memória e estatísticas da CPU quando o programa sai</td> <td></td> <td></td> </tr><tr><th>--default-auth</th> <td>Plugin de autenticação a ser usado</td> <td></td> <td></td> </tr><tr><th>--default-character-set</th> <td>Especifique o conjunto de caracteres padrão</td> <td></td> <td></td> </tr><tr><th>--defaults-extra-file</th> <td>Leia o arquivo de opção nomeado, além dos arquivos de opção usuais</td> <td></td> <td></td> </tr><tr><th>--defaults-file</th> <td>Arquivo de opção de leitura apenas nomeado</td> <td></td> <td></td> </tr><tr><th>--defaults-group-suffix</th> <td>Valor do sufixo do grupo de opções</td> <td></td> <td></td> </tr><tr><th>--delete</th> <td>Esvazie a tabela antes de importar o arquivo de texto</td> <td></td> <td></td> </tr><tr><th>--enable-cleartext-plugin</th> <td>Habilitar o plugin de autenticação em texto claro</td> <td></td> <td></td> </tr><tr><th>--campos-cercados-por</th> <td>Esta opção tem o mesmo significado que a cláusula correspondente para LOAD DATA</td> <td></td> <td></td> </tr><tr><th>--campos-escavados-por</th> <td>Esta opção tem o mesmo significado que a cláusula correspondente para LOAD DATA</td> <td></td> <td></td> </tr><tr><th>--campos opcionalmente delimitados por</th> <td>Esta opção tem o mesmo significado que a cláusula correspondente para LOAD DATA</td> <td></td> <td></td> </tr><tr><th>--campos-terminados-por</th> <td>Esta opção tem o mesmo significado que a cláusula correspondente para LOAD DATA</td> <td></td> <td></td> </tr><tr><th>--force</th> <td>Continue mesmo que ocorra um erro SQL</td> <td></td> <td></td> </tr><tr><th>--get-server-public-key</th> <td>Solicitar chave pública RSA do servidor</td> <td></td> <td></td> </tr><tr><th>--help</th> <td>Exibir mensagem de ajuda e sair</td> <td></td> <td></td> </tr><tr><th>--host</th> <td>Anfitrião no qual o servidor MySQL está localizado</td> <td></td> <td></td> </tr><tr><th>--ignore</th> <td>Veja a descrição da opção --replace</td> <td></td> <td></td> </tr><tr><th>--ignore-lines</th> <td>Ignore as primeiras N linhas do arquivo de dados</td> <td></td> <td></td> </tr><tr><th>--lines-terminated-by</th> <td>Esta opção tem o mesmo significado que a cláusula correspondente para LOAD DATA</td> <td></td> <td></td> </tr><tr><th>--local</th> <td>Ler arquivos de entrada localmente a partir do host do cliente</td> <td></td> <td></td> </tr><tr><th>--lock-tables</th> <td>Bloquear todas as tabelas para escrita antes de processar quaisquer arquivos de texto</td> <td></td> <td></td> </tr><tr><th>--login-path</th> <td>Leia as opções de caminho de login a partir de .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th>--baixa prioridade</th> <td>Use LOW_PRIORITY ao carregar a tabela</td> <td></td> <td></td> </tr><tr><th>--no-defaults</th> <td>Não ler arquivos de opção</td> <td></td> <td></td> </tr><tr><th>--senha</th> <td>Senha para usar ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th>--senha1</th> <td>Primeira senha de autenticação multifator a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th>--senha2</th> <td>Segunda senha de autenticação multifator a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th>--senha3</th> <td>Terceira senha de autenticação multifator a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th>--pipe</th> <td>Conecte-se ao servidor usando o pipe nomeado (apenas Windows)</td> <td></td> <td></td> </tr><tr><th>--plugin-dir</th> <td>Diretório onde os plugins são instalados</td> <td></td> <td></td> </tr><tr><th>--port</th> <td>Número de porta TCP/IP para a conexão</td> <td></td> <td></td> </tr><tr><th>--print-defaults</th> <td>Opções padrão de impressão</td> <td></td> <td></td> </tr><tr><th>--protocolo</th> <td>Protocolo de transporte a ser utilizado</td> <td></td> <td></td> </tr><tr><th>--replace</th> <td>As opções --replace e --ignore controlam o tratamento das linhas de entrada que duplicam linhas existentes com valores de chave únicos.</td> <td></td> <td></td> </tr><tr><th>--server-public-key-path</th> <td>Nome do caminho para o arquivo que contém a chave pública RSA</td> <td></td> <td></td> </tr><tr><th>--shared-memory-base-name</th> <td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td> <td></td> <td></td> </tr><tr><th>--silencioso</th> <td>Produza a saída apenas quando ocorrerem erros</td> <td></td> <td></td> </tr><tr><th>--socket</th> <td>Arquivo de soquete Unix ou tubo nomeado do Windows a ser usado</td> <td></td> <td></td> </tr><tr><th>--ssl-ca</th> <td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th>--ssl-capath</th> <td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th>--ssl-cert</th> <td>Arquivo que contém o certificado X.509</td> <td></td> <td></td> </tr><tr><th>--ssl-cipher</th> <td>Cifras permitidas para criptografia de conexão</td> <td></td> <td></td> </tr><tr><th>--ssl-crl</th> <td>Arquivo que contém listas de revogação de certificados</td> <td></td> <td></td> </tr><tr><th>--ssl-crlpath</th> <td>Diretório que contém arquivos de lista de revogação de certificados</td> <td></td> <td></td> </tr><tr><th>--ssl-fips-mode</th> <td>Se deve habilitar o modo FIPS no lado do cliente</td> <td></td> <td>8.0.34</td> </tr><tr><th>--ssl-chave</th> <td>Arquivo que contém a chave X.509</td> <td></td> <td></td> </tr><tr><th>--ssl-mode</th> <td>Estado de segurança desejado da conexão com o servidor</td> <td></td> <td></td> </tr><tr><th>--ssl-session-data</th> <td>Arquivo que contém dados da sessão SSL</td> <td>8.0.29</td> <td></td> </tr><tr><th>--ssl-session-data-continue-on-failed-reuse</th> <td>Se estabelecer conexões se a reutilização da sessão falhar</td> <td>8.0.29</td> <td></td> </tr><tr><th>--tls-ciphersuites</th> <td>Cifras TLSv1.3 permitidas para conexões criptografadas</td> <td>8.0.16</td> <td></td> </tr><tr><th>--tls-version</th> <td>Protocolos TLS permitidos para conexões criptografadas</td> <td></td> <td></td> </tr><tr><th>--use-threads</th> <td>Número de threads para carregamento paralelo de arquivos</td> <td></td> <td></td> </tr><tr><th>--user</th> <td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th>--verbose</th> <td>Modo verbosos</td> <td></td> <td></td> </tr><tr><th>--version</th> <td>Exibir informações da versão e sair</td> <td></td> <td></td> </tr><tr><th>--zstd-compression-level</th> <td>Nível de compressão para conexões com servidores que utilizam compressão zstd</td> <td>8.0.18</td> <td></td> </tr></tbody></table>

- `--help`, `-?`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  Exiba uma mensagem de ajuda e saia.

- `--bind-address=ip_address`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>

  Em um computador com várias interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao servidor MySQL.

- `--character-sets-dir=dir_name`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  O diretório onde os conjuntos de caracteres são instalados. Consulte a Seção 12.15, “Configuração de Conjunto de Caracteres”.

- `--columns=column_list`, `-c column_list`

  <table summary="Propriedades para colunas"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--columns=column_list</code>]]</td> </tr></tbody></table>

  Esta opção aceita uma lista de nomes de colunas separados por vírgula como seu valor. A ordem dos nomes de colunas indica como corresponder as colunas do arquivo de dados às colunas da tabela.

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

  <table summary="Propriedades para depuração"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--debug[=debug_option<code>d:t:o</code></code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>d:t:o</code>]]</td> </tr></tbody></table>

  Escreva um log de depuração. Uma string típica `debug_options` é `d:t:o,file_name`. O padrão é `d:t:o`.

  Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

- `--debug-check`

  <table summary="Propriedades para verificação de depuração"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--debug-check</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>

  Imprima algumas informações de depuração quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

- `--debug-info`

  <table summary="Propriedades para debug-info"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--debug-info</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>

  Imprima informações de depuração, estatísticas de uso de memória e CPU quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

- `--default-character-set=charset_name`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>0

  Use `charset_name` como o conjunto de caracteres padrão. Veja a Seção 12.15, “Configuração do Conjunto de Caracteres”.

- `--default-auth=plugin`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>1

  Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Veja a Seção 8.2.17, “Autenticação Personalizável”.

- `--defaults-extra-file=file_name`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>2

  Leia este arquivo de opção após o arquivo de opção global, mas (no Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se `file_name` não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--defaults-file=file_name`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>3

  Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou estiver inacessível, ocorrerá um erro. Se `file_name` não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Exceção: Mesmo com `--defaults-file`, os programas de cliente leem `.mylogin.cnf`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--defaults-group-suffix=str`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>4

  Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de `str`. Por exemplo, **mysqlimport** normalmente lê os grupos `[client]` e `[mysqlimport]`. Se esta opção for dada como `--defaults-group-suffix=_other`, **mysqlimport** também lê os grupos `[client_other]` e `[mysqlimport_other]`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--delete`, `-D`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>5

  Esvazie a tabela antes de importar o arquivo de texto.

- `--enable-cleartext-plugin`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>6

  Ative o plugin de autenticação de texto claro `mysql_clear_password`. (Consulte a Seção 8.4.1.4, “Autenticação Pluggable de Texto Claro do Cliente”).

- `--fields-terminated-by=...`, `--fields-enclosed-by=...`, `--fields-optionally-enclosed-by=...`, `--fields-escaped-by=...`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>7

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>8

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>9

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>0

  Essas opções têm o mesmo significado das cláusulas correspondentes para `LOAD DATA`. Veja a Seção 15.2.9, “Instrução LOAD DATA”.

- `--force`, `-f`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>1

  Ignore os erros. Por exemplo, se uma tabela para um arquivo de texto não existir, continue processando os arquivos restantes. Sem `--force`, o **mysqlimport** sai se uma tabela não existir.

- `--get-server-public-key`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>2

  Peça à rede o par de chaves públicas necessário para a troca de senhas com base em pares de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

  Para obter informações sobre o plugin `caching_sha2_password`, consulte a Seção 8.4.1.2, “Cacheamento de Autenticação Conectada a SHA-2”.

- `--host=host_name`, `-h host_name`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>3

  Importe os dados para o servidor MySQL no host fornecido. O host padrão é `localhost`.

- `--ignore`, `-i`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>4

  Veja a descrição da opção `--replace`.

- `--ignore-lines=N`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>5

  Ignore as primeiras linhas `N` do arquivo de dados.

- `--lines-terminated-by=...`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>6

  Esta opção tem o mesmo significado que a cláusula correspondente para `LOAD DATA`. Por exemplo, para importar arquivos do Windows que têm linhas terminadas com pares de retorno de carro/pula de linha, use `--lines-terminated-by="\r\n"`. (Você pode precisar duplicar as barras invertidas, dependendo das convenções de escape do seu interpretador de comandos.) Veja a Seção 15.2.9, “Instrução LOAD DATA”.

- `--local`, `-L`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>7

  Por padrão, os arquivos são lidos pelo servidor no host do servidor. Com esta opção, o **mysqlimport** lê os arquivos de entrada localmente no host do cliente.

  O uso bem-sucedido de operações de carregamento `LOCAL` dentro do **mysqlimport** também exige que o servidor permita o carregamento local; consulte a Seção 8.1.6, “Considerações de segurança para LOAD DATA LOCAL”

- `--lock-tables`, `-l`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>8

  Bloquear *todas* as tabelas para escrita antes de processar quaisquer arquivos de texto. Isso garante que todas as tabelas estejam sincronizadas no servidor.

- `--login-path=name`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>9

  Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam para qual servidor MySQL se conectar e qual conta autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql\_config\_editor**. Veja a Seção 6.6.7, “mysql\_config\_editor — Utilitário de Configuração MySQL”.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--low-priority`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>0

  Use `LOW_PRIORITY` ao carregar a tabela. Isso afeta apenas os motores de armazenamento que usam apenas bloqueio de nível de tabela (como `MyISAM`, `MEMORY` e `MERGE`).

- `--no-defaults`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>1

  Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para impedir que sejam lidas.

  A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar o `.mylogin.cnf`, use o utilitário **mysql\_config\_editor**. Veja a Seção 6.6.7, “mysql\_config\_editor — Utilitário de Configuração do MySQL”.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--password[=password]`, `-p[password]`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>2

  A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysqlimport** solicitará uma senha. Se for fornecida, não deve haver **espaço** entre `--password=` ou `-p` e a senha que o segue. Se nenhuma opção de senha for especificada, o padrão é não enviar a senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Consulte a Seção 8.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

  Para especificar explicitamente que não há senha e que o **mysqlimport** não deve solicitar uma senha, use a opção `--skip-password`.

- `--password1[=pass_val]`

  A senha para o fator de autenticação multifator 1 da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysqlimport** solicitará uma senha. Se for fornecida, não deve haver **espaço** entre `--password1=` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar nenhuma senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Consulte a Seção 8.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

  Para especificar explicitamente que não há senha e que o **mysqlimport** não deve solicitar uma senha, use a opção `--skip-password1`.

  `--password1` e `--password` são sinônimos, assim como `--skip-password1` e `--skip-password`.

- `--password2[=pass_val]`

  A senha para o fator de autenticação multifator 2 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica do `--password1`; consulte a descrição dessa opção para obter detalhes.

- `--password3[=pass_val]`

  A senha para o fator de autenticação multifator 3 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica do `--password1`; consulte a descrição dessa opção para obter detalhes.

- `--pipe`, `-W`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>3

  No Windows, conecte-se ao servidor usando um tubo nomeado. Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por tubo nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

- `--plugin-dir=dir_name`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>4

  O diretório onde procurar por plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o **mysqlimport** não encontrá-lo. Veja a Seção 8.2.17, “Autenticação Personalizável”.

- `--port=port_num`, `-P port_num`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>5

  Para conexões TCP/IP, o número de porta a ser usado.

- `--print-defaults`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>6

  Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>7

  O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de um protocolo diferente do que você deseja. Para obter detalhes sobre os valores permitidos, consulte a Seção 6.2.7, “Protocolos de Transporte de Conexão”.

- `--replace`, `-r`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>8

  As opções `--replace` e `--ignore` controlam o tratamento das linhas de entrada que duplicam linhas existentes com valores de chave únicos. Se você especificar `--replace`, novas linhas substituem as linhas existentes que têm o mesmo valor de chave única. Se você especificar `--ignore`, as linhas de entrada que duplicam uma linha existente com um valor de chave única são ignoradas. Se você não especificar nenhuma dessas opções, um erro ocorre quando um valor de chave duplicado é encontrado, e o resto do arquivo de texto é ignorado.

- `--server-public-key-path=file_name`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>9

  O nome do caminho de um arquivo no formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senhas com par de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

  Para `sha256_password`, esta opção só se aplica se o MySQL foi construído usando o OpenSSL.

  Para obter informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 8.4.1.3, “Autenticação Conectada a SHA-256”, e a Seção 8.4.1.2, “Cache de Autenticação Conectada a SHA-2”.

- `--shared-memory-base-name=name`

  <table summary="Propriedades para colunas"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--columns=column_list</code>]]</td> </tr></tbody></table>0

  Em Windows, o nome de memória compartilhada a ser usado para conexões feitas usando memória compartilhada para um servidor local. O valor padrão é \[\[`MYSQL`]. O nome de memória compartilhada é sensível a maiúsculas e minúsculas.

  Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

- `--silent`, `-s`

  <table summary="Propriedades para colunas"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--columns=column_list</code>]]</td> </tr></tbody></table>1

  Modo silencioso. Produza a saída apenas quando ocorrerem erros.

- `--socket=path`, `-S path`

  <table summary="Propriedades para colunas"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--columns=column_list</code>]]</td> </tr></tbody></table>2

  Para conexões ao `localhost`, o arquivo de socket Unix a ser usado ou, no Windows, o nome do tubo nomeado a ser usado.

  No Windows, essa opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de canal nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

- `--ssl*`

  As opções que começam com `--ssl` especificam se você deseja se conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Consulte Opções de comando para conexões criptografadas.

- `--ssl-fips-mode={OFF|ON|STRICT}`

  <table summary="Propriedades para colunas"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--columns=column_list</code>]]</td> </tr></tbody></table>3

  Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere de outras opções `--ssl-xxx` porque não é usada para estabelecer conexões criptografadas, mas sim para determinar quais operações criptográficas devem ser permitidas. Veja a Seção 8.8, “Suporte FIPS”.

  Estes valores `--ssl-fips-mode` são permitidos:

  - `OFF`: Desative o modo FIPS.
  - `ON`: Habilitar o modo FIPS.
  - `STRICT`: Habilitar o modo FIPS "estricto".

  Nota

  Se o Módulo de Objeto FIPS OpenSSL não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Nesse caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente emita um aviso na inicialização e opere no modo não FIPS.

  A partir do MySQL 8.0.34, essa opção está desatualizada. Espera-se que ela seja removida em uma versão futura do MySQL.

- `--tls-ciphersuites=ciphersuite_list`

  <table summary="Propriedades para colunas"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--columns=column_list</code>]]</td> </tr></tbody></table>4

  As sequências de cifra permitidas para conexões criptografadas que utilizam TLSv1.3. O valor é uma lista de um ou mais nomes de sequências de cifra separados por vírgula. As sequências de cifra que podem ser nomeadas para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para obter detalhes, consulte a Seção 8.3.2, “Protocolos e cifra de conexão criptografada TLS”.

  Essa opção foi adicionada no MySQL 8.0.16.

- `--tls-version=protocol_list`

  <table summary="Propriedades para colunas"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--columns=column_list</code>]]</td> </tr></tbody></table>5

  Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolos separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para obter detalhes, consulte a Seção 8.3.2, “Protocolos e cifra TLS de conexão criptografada”.

- `--user=user_name`, `-u user_name`

  <table summary="Propriedades para colunas"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--columns=column_list</code>]]</td> </tr></tbody></table>6

  O nome de usuário da conta MySQL a ser usado para se conectar ao servidor.

- `--use-threads=N`

  <table summary="Propriedades para colunas"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--columns=column_list</code>]]</td> </tr></tbody></table>7

  Carregue arquivos em paralelo usando `N` threads.

- `--verbose`, `-v`

  <table summary="Propriedades para colunas"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--columns=column_list</code>]]</td> </tr></tbody></table>8

  Modo verbose. Imprima mais informações sobre o que o programa faz.

- `--version`, `-V`

  <table summary="Propriedades para colunas"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--columns=column_list</code>]]</td> </tr></tbody></table>9

  Exibir informações da versão e sair.

- `--zstd-compression-level=level`

  <table summary="Propriedades para comprimir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.18</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>0

  O nível de compressão a ser usado para conexões com o servidor que utilizam o algoritmo de compressão `zstd`. Os níveis permitidos variam de 1 a 22, com valores maiores indicando níveis crescentes de compressão. O nível de compressão padrão `zstd` é 3. A configuração do nível de compressão não afeta conexões que não utilizam a compressão `zstd`.

  Para obter mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

  Essa opção foi adicionada no MySQL 8.0.18.

Aqui está uma sessão de exemplo que demonstra o uso do **mysqlimport**:

```
$> mysql -e 'CREATE TABLE imptest(id INT, n VARCHAR(30))' test
$> ed
a
100     Max Sydow
101     Count Dracula
.
w imptest.txt
32
q
$> od -c imptest.txt
0000000   1   0   0  \t   M   a   x       S   y   d   o   w  \n   1   0
0000020   1  \t   C   o   u   n   t       D   r   a   c   u   l   a  \n
0000040
$> mysqlimport --local test imptest.txt
test.imptest: Records: 2  Deleted: 0  Skipped: 0  Warnings: 0
$> mysql -e 'SELECT * FROM imptest' test
+------+---------------+
| id   | n             |
+------+---------------+
|  100 | Max Sydow     |
|  101 | Count Dracula |
+------+---------------+
```
