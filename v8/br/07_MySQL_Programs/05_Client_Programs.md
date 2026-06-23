## 6.5 Programas para clientes

Esta seção descreve os programas de cliente que se conectam ao servidor MySQL.

### 6.5.1 mysql — O cliente de linha de comando MySQL

**mysql** é um shell SQL simples com capacidade de edição de linha de entrada. Ele suporta uso interativo e não interativo. Quando usado interativamente, os resultados das consultas são apresentados em um formato de tabela ASCII. Quando usado não interativamente (por exemplo, como um filtro), o resultado é apresentado em formato de separação por tabulação. O formato de saída pode ser alterado usando opções de comando.

Se você tiver problemas devido à memória insuficiente para conjuntos de resultados grandes, use a opção `--quick`. Isso obriga o **mysql** a recuperar os resultados do servidor uma linha de cada vez, em vez de recuperar todo o conjunto de resultados e bufferá-lo na memória antes de exibí-lo. Isso é feito retornando o conjunto de resultados usando a função `mysql_use_result()` da API C no cliente/biblioteca do servidor em vez de `mysql_store_result()`.

Nota

Como alternativa, o MySQL Shell oferece acesso à X DevAPI. Para obter detalhes, consulte o MySQL Shell 8.0.

Usar o **mysql** é muito fácil. Invoque-o a partir do prompt do seu interpretador de comandos da seguinte forma:

```
mysql db_name
```

Ou:

```
mysql --user=user_name --password db_name
```

Neste caso, você precisará inserir sua senha em resposta ao prompt que o **mysql** exibe:

```
Enter password: your_password
```

Em seguida, digite uma declaração SQL, termine-a com `;`, `\g` ou `\G` e pressione Enter.

Teclar **Control+C** interrompe a declaração atual, se houver uma, ou, caso contrário, anula qualquer linha de entrada parcial.

Você pode executar instruções SQL em um arquivo de script (arquivo de lote) da seguinte forma:

```
mysql db_name < script.sql > output.tab
```

No Unix, o cliente **mysql** registra as declarações executadas interativamente em um arquivo de histórico. Veja a Seção 6.5.1.3, “Registro do cliente mysql”.

#### 6.5.1.1 Opções do cliente do MySQL

O **mysql** suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysql]` e `[client]` de um arquivo de opções. Para informações sobre arquivos de opções usados por programas do MySQL, consulte a Seção 6.2.2.2, “Usando arquivos de opções”.

**Tabela 6.12 Opções do cliente do MySQL**

<table frame="box" rules="all" summary="Command-line options available for the mysql client."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Introduced</th> <th scope="col">Deprecated</th> </tr></thead><tbody><tr><th scope="row">--authentication-oci-client-config-profile</th> <td>Nome do perfil OCI definido no arquivo de configuração OCI a ser usado</td> <td>8.0.33</td> <td></td> </tr><tr><th scope="row">--auto-rehash</th> <td>Enable automatic rehashing</td> <td></td> <td></td> </tr><tr><th scope="row">--auto-vertical-output</th> <td>Ative a exibição automática do conjunto de resultados vertical</td> <td></td> <td></td> </tr><tr><th scope="row">--batch</th> <td>Não use o arquivo de histórico</td> <td></td> <td></td> </tr><tr><th scope="row">--binary-as-hex</th> <td>Exibir valores binários em notação hexadecimal</td> <td></td> <td></td> </tr><tr><th scope="row">--binary-mode</th> <td>Disable \r\n - to - \n translation and treatment of \0 as end-of-query</td> <td></td> <td></td> </tr><tr><th scope="row">--bind-address</th> <td>Use a interface de rede especificada para se conectar ao servidor MySQL</td> <td></td> <td></td> </tr><tr><th scope="row">--character-sets-dir</th> <td>Diretório onde os conjuntos de caracteres são instalados</td> <td></td> <td></td> </tr><tr><th scope="row">--column-names</th> <td>Escreva os nomes das colunas nos resultados</td> <td></td> <td></td> </tr><tr><th scope="row">--column-type-info</th> <td>Exibir metadados do conjunto de resultados</td> <td></td> <td></td> </tr><tr><th scope="row">--commands</th> <td>Habilitar ou desabilitar o processamento de comandos do cliente local do MySQL</td> <td>8.0.43</td> <td></td> </tr><tr><th scope="row">--comments</th> <td>Se deve manter ou remover comentários em declarações enviadas ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--compress</th> <td>Compressar todas as informações enviadas entre o cliente e o servidor</td> <td></td> <td>8.0.18</td> </tr><tr><th scope="row">--compression-algorithms</th> <td>Algoritmos de compressão permitidos para conexões ao servidor</td> <td>8.0.18</td> <td></td> </tr><tr><th scope="row">--connect-expired-password</th> <td>Indique ao servidor que o cliente pode lidar com o modo sandbox de senha expirada</td> <td></td> <td></td> </tr><tr><th scope="row">--connect-timeout</th> <td>Número de segundos antes do tempo limite de conexão</td> <td></td> <td></td> </tr><tr><th scope="row">--database</th> <td>O banco de dados a ser utilizado</td> <td></td> <td></td> </tr><tr><th scope="row">--debug</th> <td>Escreva o log de depuração; é suportado apenas se o MySQL foi construído com suporte de depuração</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-check</th> <td>Imprimir informações de depuração quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-info</th> <td>Imprimir informações de depuração, memória e estatísticas de CPU quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row">--default-auth</th> <td>Plugin de autenticação a ser utilizado</td> <td></td> <td></td> </tr><tr><th scope="row">--default-character-set</th> <td>Especificar o conjunto de caracteres padrão</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-extra-file</th> <td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-file</th> <td>Arquivo de opção de leitura apenas nomeado</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-group-suffix</th> <td>Valor do sufixo do grupo de opções</td> <td></td> <td></td> </tr><tr><th scope="row">--delimiter</th> <td>Defina o delimitador de declaração</td> <td></td> <td></td> </tr><tr><th scope="row">--dns-srv-name</th> <td>Use a pesquisa DNS SRV para obter informações sobre o host</td> <td>8.0.22</td> <td></td> </tr><tr><th scope="row">--enable-cleartext-plugin</th> <td>Habilitar o plugin de autenticação de texto claro</td> <td></td> <td></td> </tr><tr><th scope="row">--execute</th> <td>Execute a declaração e saia</td> <td></td> <td></td> </tr><tr><th scope="row">--fido-register-factor</th> <td>Multifactor authentication factors for which registration must be done</td> <td>8.0.27</td> <td>8.0.35</td> </tr><tr><th scope="row">--force</th> <td>Continue mesmo que ocorra um erro SQL</td> <td></td> <td></td> </tr><tr><th scope="row">--get-server-public-key</th> <td>Solicitar chave pública RSA do servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--help</th> <td>Exibir mensagem de ajuda e sair</td> <td></td> <td></td> </tr><tr><th scope="row">--histignore</th> <td>Padrões que especificam quais declarações devem ser ignoradas para o registro</td> <td></td> <td></td> </tr><tr><th scope="row">--host</th> <td>Anfitrião no qual o servidor MySQL está localizado</td> <td></td> <td></td> </tr><tr><th scope="row">--html</th> <td>Produce HTML output</td> <td></td> <td></td> </tr><tr><th scope="row">--ignore-spaces</th> <td>Ignore espaços após os nomes das funções</td> <td></td> <td></td> </tr><tr><th scope="row">--init-command</th> <td>Instrução SQL para executar após a conexão</td> <td></td> <td></td> </tr><tr><th scope="row">--line-numbers</th> <td>Escreva números de linha para erros</td> <td></td> <td></td> </tr><tr><th scope="row">--load-data-local-dir</th> <td>Diretório para arquivos nomeados em declarações LOAD DATA LOCAL</td> <td>8.0.21</td> <td></td> </tr><tr><th scope="row">--local-infile</th> <td>Ative ou desative a capacidade LOCAL para LOAD DATA</td> <td></td> <td></td> </tr><tr><th scope="row">--login-path</th> <td>Leia as opções de caminho de login a partir de .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th scope="row">--max-allowed-packet</th> <td>Comprimento máximo do pacote para enviar ou receber do servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--max-join-size</th> <td>O limite automático para as linhas em uma junção ao usar --safe-updates</td> <td></td> <td></td> </tr><tr><th scope="row">--named-commands</th> <td>Habilitar comandos mysql nomeados</td> <td></td> <td></td> </tr><tr><th scope="row">--net-buffer-length</th> <td>Buffer size for TCP/IP and socket communication</td> <td></td> <td></td> </tr><tr><th scope="row">--network-namespace</th> <td>Specify network namespace</td> <td>8.0.22</td> <td></td> </tr><tr><th scope="row">--no-auto-rehash</th> <td>Disable automatic rehashing</td> <td></td> <td></td> </tr><tr><th scope="row">--no-beep</th> <td>Não emita um sinal sonoro quando ocorrerem erros</td> <td></td> <td></td> </tr><tr><th scope="row">--no-defaults</th> <td>Não leia arquivos de opção</td> <td></td> <td></td> </tr><tr><th scope="row">--oci-config-file</th> <td>Define um local alternativo para o arquivo de configuração do Oracle Cloud Infrastructure CLI.</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--one-database</th> <td>Ignorar declarações, exceto as para o banco de dados padrão nomeado na linha de comando</td> <td></td> <td></td> </tr><tr><th scope="row">--pager</th> <td>Use o comando fornecido para a saída da consulta de paginação</td> <td></td> <td></td> </tr><tr><th scope="row">--password</th> <td>Senha para usar ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--password1</th> <td>Primeira senha de autenticação multifatorial a usar ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password2</th> <td>Segunda senha de autenticação multifatorial a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password3</th> <td>Terceira senha de autenticação multifatorial a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--pipe</th> <td>Conecte-se ao servidor usando um tubo nomeado (apenas Windows)</td> <td></td> <td></td> </tr><tr><th scope="row">--plugin-authentication-kerberos-client-mode</th> <td>Permitir autenticação pluggable GSSAPI através da biblioteca MIT Kerberos no Windows</td> <td>8.0.32</td> <td></td> </tr><tr><th scope="row">--plugin-dir</th> <td>Diretório onde os plugins são instalados</td> <td></td> <td></td> </tr><tr><th scope="row">--port</th> <td>TCP/IP port number for connection</td> <td></td> <td></td> </tr><tr><th scope="row">--print-defaults</th> <td>Print default options</td> <td></td> <td></td> </tr><tr><th scope="row">--prompt</th> <td>Defina o prompt no formato especificado</td> <td></td> <td></td> </tr><tr><th scope="row">--protocol</th> <td>Protocolo de transporte a ser utilizado</td> <td></td> <td></td> </tr><tr><th scope="row">--quick</th> <td>Não cache cada resultado da consulta</td> <td></td> <td></td> </tr><tr><th scope="row">--raw</th> <td>Escreva os valores da coluna sem conversão de escape</td> <td></td> <td></td> </tr><tr><th scope="row">--reconnect</th> <td>Se a conexão com o servidor for perdida, tente reconectar automaticamente</td> <td></td> <td></td> </tr><tr><th scope="row">--safe-updates, --i-am-a-dummy</th> <td>Permitir apenas declarações de UPDATE e DELETE que especifiquem valores de chave</td> <td></td> <td></td> </tr><tr><th scope="row">--select-limit</th> <td>O limite automático para as declarações SELECT ao usar --safe-updates</td> <td></td> <td></td> </tr><tr><th scope="row">--server-public-key-path</th> <td>Nome do caminho para o arquivo que contém a chave pública RSA</td> <td></td> <td></td> </tr><tr><th scope="row">--shared-memory-base-name</th> <td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td> <td></td> <td></td> </tr><tr><th scope="row">--show-warnings</th> <td>Mostre avisos após cada declaração, se houver alguma</td> <td></td> <td></td> </tr><tr><th scope="row">--sigint-ignore</th> <td>Ignorar sinais SIGINT (tipicamente o resultado de digitar Control+C)</td> <td></td> <td></td> </tr><tr><th scope="row">--silent</th> <td>Silent mode</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-auto-rehash</th> <td>Disable automatic rehashing</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-column-names</th> <td>Não escreva nomes de colunas nos resultados</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-line-numbers</th> <td>Pular números de linha para erros</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-named-commands</th> <td>Desative comandos do MySQL nomeados</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-pager</th> <td>Disable paging</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-reconnect</th> <td>Disable reconnecting</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-system-command</th> <td>Disable system (\!) command</td> <td>8.0.40</td> <td></td> </tr><tr><th scope="row">--socket</th> <td>Arquivo de socket Unix ou tubo nomeado do Windows a ser usado</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-ca</th> <td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-capath</th> <td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cert</th> <td>Arquivo que contém o certificado X.509</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cipher</th> <td>Cifras permitidas para criptografia de conexão</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crl</th> <td>Arquivo que contém listas de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crlpath</th> <td>Diretório que contém arquivos de lista de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-fips-mode</th> <td>Se deve habilitar o modo FIPS no lado do cliente</td> <td></td> <td>8.0.34</td> </tr><tr><th scope="row">--ssl-key</th> <td>Arquivo que contém a chave X.509</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-mode</th> <td>Estado de segurança desejado da conexão com o servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-session-data</th> <td>Arquivo que contém dados da sessão SSL</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--ssl-session-data-continue-on-failed-reuse</th> <td>Se estabelecer conexões se a reutilização da sessão falhar</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--syslog</th> <td>Registre declarações interativas no syslog</td> <td></td> <td></td> </tr><tr><th scope="row">--system-command</th> <td>Enable or disable system (\!) command</td> <td>8.0.40</td> <td></td> </tr><tr><th scope="row">--table</th> <td>Exibir a saída em formato tabular</td> <td></td> <td></td> </tr><tr><th scope="row">--tee</th> <td>Adicione uma cópia do resultado a um arquivo nomeado</td> <td></td> <td></td> </tr><tr><th scope="row">--tls-ciphersuites</th> <td>Cifras TLSv1.3 permitidas para conexões criptografadas</td> <td>8.0.16</td> <td></td> </tr><tr><th scope="row">--tls-version</th> <td>Protocolos TLS permitidos para conexões criptografadas</td> <td></td> <td></td> </tr><tr><th scope="row">--unbuffered</th> <td>Esvazie o buffer após cada consulta</td> <td></td> <td></td> </tr><tr><th scope="row">--user</th> <td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--verbose</th> <td>Verbose mode</td> <td></td> <td></td> </tr><tr><th scope="row">--version</th> <td>Exibir informações da versão e sair</td> <td></td> <td></td> </tr><tr><th scope="row">--vertical</th> <td>Imprimir linhas de saída de consulta verticalmente (uma linha por valor de coluna)</td> <td></td> <td></td> </tr><tr><th scope="row">--wait</th> <td>Se a conexão não puder ser estabelecida, espere e tente novamente em vez de abortar</td> <td></td> <td></td> </tr><tr><th scope="row">--xml</th> <td>Produce XML output</td> <td></td> <td></td> </tr><tr><th scope="row">--zstd-compression-level</th> <td>Nível de compressão para conexões ao servidor que utilizam compressão zstd</td> <td>8.0.18</td> <td></td> </tr></tbody></table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Exibir uma mensagem de ajuda e sair.

* `--authentication-oci-client-config-profile`

  <table frame="box" rules="all" summary="Properties for authentication-oci-client-config-profile"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-oci-client-config-profile=profileName</code></td> </tr><tr><th>Introduced</th> <td>8.0.33</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

Especifique o nome do perfil de configuração do OCI a ser usado. Se não estiver definido, o perfil padrão é usado.

* `--auto-rehash`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>

Ative a rehashing automática. Esta opção está ativada por padrão, o que permite a conclusão de nomes de banco de dados, tabela e coluna. Use `--disable-auto-rehash` para desativar a rehashing. Isso faz com que o **mysql** comece mais rápido, mas você deve emitir o comando `rehash` ou seu atalho `\#` se você deseja usar a conclusão de nomes.

Para completar um nome, insira a primeira parte e pressione Tab. Se o nome não for ambíguo, o **mysql** o completa. Caso contrário, você pode pressionar Tab novamente para ver os nomes possíveis que começam com o que você digitou até agora. A conclusão não ocorre se não houver um banco de dados padrão.

Nota

Essa funcionalidade requer um cliente MySQL que foi compilado com a biblioteca **readline**. Normalmente, a biblioteca **readline** não está disponível no Windows.

* `--auto-vertical-output`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>

Se os conjuntos de resultados forem muito largos para a janela atual, exiba-os verticalmente. Caso contrário, use o formato tabular normal. (Isso se aplica a declarações terminadas por `;` ou `\G`.).

* `--batch`, `-B`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--batch</code></td> </tr></tbody></table>

Imprima os resultados usando a tecla tab como separador de coluna, com cada linha em uma nova linha. Com esta opção, o **mysql** não usa o arquivo de histórico.

O modo de lote resulta em saída não tabular e escapamento de caracteres especiais. O escapamento pode ser desativado usando o modo bruto; consulte a descrição da opção `--raw`.

* `--binary-as-hex`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Valor padrão (≥ 8.0.19)</th> <td><code>FALSE in noninteractive mode</code></td> </tr><tr><th>Valor padrão (≤ 8.0.18)</th> <td><code>FALSE</code></td> </tr></tbody></table>

Quando esta opção é dada, o **mysql** exibe dados binários usando notação hexadecimal (`0xvalue`). Isso ocorre independentemente do formato geral de exibição de saída ser tabular, vertical, HTML ou XML.

`--binary-as-hex` quando ativado afeta a exibição de todas as cadeias binárias, incluindo aquelas retornadas por funções como `CHAR()` e `UNHEX()`. O exemplo a seguir demonstra isso usando o código ASCII para `A` (65 decimal, 41 hexadecimal):

+ `--binary-as-hex` desativado:

    ```
    mysql> SELECT CHAR(0x41), UNHEX('41');
    +------------+-------------+
    | CHAR(0x41) | UNHEX('41') |
    +------------+-------------+
    | A          | A           |
    +------------+-------------+
    ```

+ `--binary-as-hex` ativado:

    ```
    mysql> SELECT CHAR(0x41), UNHEX('41');
    +------------------------+--------------------------+
    | CHAR(0x41)             | UNHEX('41')              |
    +------------------------+--------------------------+
    | 0x41                   | 0x41                     |
    +------------------------+--------------------------+
    ```

Para escrever uma expressão de cadeia binária de forma que ela seja exibida como uma cadeia de caracteres, independentemente de `--binary-as-hex` estar habilitado, use essas técnicas:

+ A função `CHAR()` possui uma cláusula `USING charset`:

    ```
    mysql> SELECT CHAR(0x41 USING utf8mb4);
    +--------------------------+
    | CHAR(0x41 USING utf8mb4) |
    +--------------------------+
    | A                        |
    +--------------------------+
    ```

+ De forma mais geral, use `CONVERT()` para converter uma expressão em um conjunto de caracteres específico:

    ```
    mysql> SELECT CONVERT(UNHEX('41') USING utf8mb4);
    +------------------------------------+
    | CONVERT(UNHEX('41') USING utf8mb4) |
    +------------------------------------+
    | A                                  |
    +------------------------------------+
    ```

A partir do MySQL 8.0.19, quando o **mysql** opera no modo interativo, essa opção é habilitada por padrão. Além disso, a saída do comando `status` (ou `\s`) inclui essa linha quando a opção é habilitada implicitamente ou explicitamente:

  ```
  Binary data as: Hexadecimal
  ```

Para desativar a notação hexadecimal, use `--skip-binary-as-hex`

* `--binary-mode`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-mode</code></td> </tr></tbody></table>

Esta opção ajuda ao processar a saída do **mysqlbinlog** que pode conter valores `BLOB`. Por padrão, o **mysql** traduz `\r\n` em strings de declaração para `\n` e interpreta `\0` como o terminador da declaração. `--binary-mode` desativa ambos os recursos. Também desativa todos os comandos do **mysql**, exceto `charset` e `delimiter` no modo não interativo (para entrada canalizada para o **mysql** ou carregada usando o comando `source`).

(*MySQL 8.0.43 e posterior: [*`--binary-mode`], quando habilitado, faz com que o servidor ignore qualquer configuração para [*`--commands`].

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

Em um computador com várias interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao servidor MySQL.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

O diretório onde os conjuntos de caracteres são instalados. Veja a Seção 12.15, “Configuração de Conjunto de Caracteres”.

* `--column-names`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>0

Escreva os nomes das colunas nos resultados.

* `--column-type-info`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>1

Exibir metadados do conjunto de resultados. Essas informações correspondem ao conteúdo das estruturas de dados C API `MYSQL_FIELD`. Veja Estruturas de dados básicas da API C.

* `--commands`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>2

Se você deseja habilitar ou desabilitar o processamento de comandos do cliente local do **mysql**. Definir essa opção para `FALSE` desabilita esse processamento e tem os efeitos listados aqui:

+ Os seguintes comandos do cliente **mysql** são desativados:

- `charset` (`/C` permanece ativado)

- `clear`
- `connect`
- `edit`
- `ego`
- `exit`
- `go`
- `help`
- `nopager`
- `notee`
- `nowarning`
- `pager`
- `print`
- `prompt`
- `query_attributes`
- `quit`
- `rehash`
- `resetconnection`
- `ssl_session_data_print`
- `source`
- `status`
- `system`
- `tee`
- `\u` (`use` é passado para o servidor)

- `warnings`
  + Os comandos `\C` e `delimiter` permanecem ativados.

+ A opção `--system-command` é ignorada e não tem efeito.

Esta opção não tem efeito quando `--binary-mode` está habilitado.

Quando o `--commands` está habilitado, é possível desabilitar (apenas) o comando do sistema usando a opção `--system-command`.

Essa opção foi adicionada no MySQL 8.0.43.

* `--comments`, `-c`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>3

Se deve remover ou preservar comentários em declarações enviadas ao servidor. O padrão é `--skip-comments` (remover comentários), habilite com `--comments` (preservar comentários).

Nota

O cliente **mysql** sempre passa dicas de otimização ao servidor, independentemente de esta opção ser dada.

Observação: a remoção de comentários está desatualizada. Espera-se que esse recurso e as opções para controlá-lo sejam removidos em uma versão futura do MySQL.

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>4

Compressa todas as informações enviadas entre o cliente e o servidor, se possível. Veja a Seção 6.2.8, “Controle de Compressão de Conexão”.

A partir do MySQL 8.0.18, essa opção é desatualizada. A espera é que ela seja removida em uma versão futura do MySQL. Veja Configurando Compressão de Conexão Legada.

* `--compression-algorithms=value`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>5

Os algoritmos de compressão permitidos para conexões ao servidor. Os algoritmos disponíveis são os mesmos que para a variável de sistema `protocol_compression_algorithms`. O valor padrão é `uncompressed`.

Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

Essa opção foi adicionada no MySQL 8.0.18.

* `--connect-expired-password`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>6

Indique ao servidor que o cliente pode lidar com o modo sandbox se a conta usada para se conectar tiver uma senha expirada. Isso pode ser útil para invocções não interativas do **mysql**, pois normalmente o servidor desconecta clientes não interativos que tentam se conectar usando uma conta com uma senha expirada. (Veja a Seção 8.2.16, “Tratamento do servidor de senhas expiradas”.)

* `--connect-timeout=value`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>7

O número de segundos antes do tempo limite de conexão. (O valor padrão é `0`.)

* `--database=db_name`, `-D db_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>8

O banco de dados a ser usado. Isso é útil principalmente em um arquivo de opção.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>9

Escreva um registro de depuração. Uma string típica *`debug_options`* é `d:t:o,file_name`. O padrão é `d:t:o,/tmp/mysql.trace`.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--debug-check`

  <table frame="box" rules="all" summary="Properties for authentication-oci-client-config-profile"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-oci-client-config-profile=profileName</code></td> </tr><tr><th>Introduced</th> <td>8.0.33</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>0

Imprima algumas informações de depuração quando o programa sair.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--debug-info`, `-T`

  <table frame="box" rules="all" summary="Properties for authentication-oci-client-config-profile"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-oci-client-config-profile=profileName</code></td> </tr><tr><th>Introduced</th> <td>8.0.33</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>1

Imprimir informações de depuração e estatísticas de uso de memória e CPU quando o programa sai.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for authentication-oci-client-config-profile"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-oci-client-config-profile=profileName</code></td> </tr><tr><th>Introduced</th> <td>8.0.33</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>2

Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Veja a Seção 8.2.17, “Autenticação substituível”.

* `--default-character-set=charset_name`

  <table frame="box" rules="all" summary="Properties for authentication-oci-client-config-profile"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-oci-client-config-profile=profileName</code></td> </tr><tr><th>Introduced</th> <td>8.0.33</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>3

Use *`charset_name`* como o conjunto de caracteres padrão para o cliente e a conexão.

Essa opção pode ser útil se o sistema operacional usar um conjunto de caracteres e o cliente **mysql** por padrão usar outro. Nesse caso, a saída pode ser formatada incorretamente. Geralmente, você pode corrigir esses problemas usando essa opção para forçar o cliente a usar o conjunto de caracteres do sistema em vez disso.

Para mais informações, consulte a Seção 12.4, “Conjunto de caracteres de conexão e codificações”, e a Seção 12.15, “Configuração do conjunto de caracteres”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for authentication-oci-client-config-profile"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-oci-client-config-profile=profileName</code></td> </tr><tr><th>Introduced</th> <td>8.0.33</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>4

Leia este arquivo de opção após o arquivo de opção global, mas (em Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for authentication-oci-client-config-profile"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-oci-client-config-profile=profileName</code></td> </tr><tr><th>Introduced</th> <td>8.0.33</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>5

Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Exceção: Mesmo com `--defaults-file`, os programas de cliente leem `.mylogin.cnf`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for authentication-oci-client-config-profile"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-oci-client-config-profile=profileName</code></td> </tr><tr><th>Introduced</th> <td>8.0.33</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>6

Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, **mysql** normalmente lê os grupos `[client]` e `[mysql]`. Se esta opção for dada como `--defaults-group-suffix=_other`, **mysql** também lê os grupos `[client_other]` e `[mysql_other]`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--delimiter=str`

  <table frame="box" rules="all" summary="Properties for authentication-oci-client-config-profile"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-oci-client-config-profile=profileName</code></td> </tr><tr><th>Introduced</th> <td>8.0.33</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>7

Defina o delimitador de declaração. O padrão é o caractere ponto e vírgula (`;`).

* `--disable-named-commands`

Desative comandos nomeados. Use apenas o formulário `\*` ou use comandos nomeados apenas no início de uma linha que termina com um ponto e vírgula (`;`). O **mysql** começa com esta opção *ativada* por padrão. No entanto, mesmo com esta opção, os comandos de formato longo ainda funcionam a partir da primeira linha. Veja a Seção 6.5.1.2, “Comandos do cliente do mysql”.

* `--dns-srv-name=name`

  <table frame="box" rules="all" summary="Properties for authentication-oci-client-config-profile"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-oci-client-config-profile=profileName</code></td> </tr><tr><th>Introduced</th> <td>8.0.33</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>8

Especifica o nome de um registro DNS SRV que determina os hosts candidatos a serem usados para estabelecer uma conexão com um servidor MySQL. Para informações sobre o suporte DNS SRV no MySQL, consulte a Seção 6.2.6, “Conectando-se ao servidor usando registros DNS SRV”.

Suponha que o DNS esteja configurado com essas informações SRV para o domínio `example.com`:

  ```
  Name                     TTL   Class   Priority Weight Port Target
  _mysql._tcp.example.com. 86400 IN SRV  0        5      3306 host1.example.com
  _mysql._tcp.example.com. 86400 IN SRV  0        10     3306 host2.example.com
  _mysql._tcp.example.com. 86400 IN SRV  10       5      3306 host3.example.com
  _mysql._tcp.example.com. 86400 IN SRV  20       5      3306 host4.example.com
  ```

Para usar esse registro DNS SRV, invoque o **mysql** da seguinte forma:

  ```
  mysql --dns-srv-name=_mysql._tcp.example.com
  ```

O **mysql** tenta, então, estabelecer uma conexão com cada servidor do grupo até que uma conexão bem-sucedida seja estabelecida. Uma falha na conexão ocorre apenas se não for possível estabelecer uma conexão com qualquer um dos servidores. Os valores de prioridade e peso no registro DNS SRV determinam a ordem em que os servidores devem ser tentados.

Quando invocado com `--dns-srv-name`, o **mysql** tenta estabelecer conexões TCP apenas.

A opção `--dns-srv-name` tem precedência sobre a opção `--host` se ambas forem fornecidas. A opção `--dns-srv-name` faz com que o estabelecimento da conexão use a função da API C `mysql_real_connect_dns_srv()` em vez de `mysql_real_connect()`. No entanto, se o comando `connect` for usado subsequentemente no runtime e especificar um argumento de nome de host, esse nome de host tem precedência sobre qualquer opção `--dns-srv-name` fornecida na **mysql** ao especificar um registro DNS SRV.

Essa opção foi adicionada no MySQL 8.0.22.

* `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Properties for authentication-oci-client-config-profile"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-oci-client-config-profile=profileName</code></td> </tr><tr><th>Introduced</th> <td>8.0.33</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>9

Ative o plugin de autenticação de texto claro `mysql_clear_password`. (Veja a Seção 8.4.1.4, “Autenticação de Texto Claro Plugável do Lado do Cliente”).

* `--execute=statement`, `-e statement`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>0

Execute a declaração e saia. O formato de saída padrão é como o produzido com `--batch`. Veja a Seção 6.2.2.1, “Usando opções na linha de comando”, para alguns exemplos. Com esta opção, o **mysql** não usa o arquivo de histórico.

* `--fido-register-factor=value`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>1

Nota

A partir do MySQL 8.0.35, essa opção é desatualizada e está sujeita à remoção em uma versão futura do MySQL.

O fator ou fatores para os quais o registro do dispositivo FIDO deve ser realizado. Este valor de opção deve ser um único valor ou dois valores separados por vírgulas. Cada valor deve ser 2 ou 3, portanto, os valores permitidos da opção são `'2'`, `'3'`, `'2,3'` e `'3,2'`.

Por exemplo, uma conta que requer registro para um 3º fator de autenticação invoca o cliente **mysql** da seguinte forma:

  ```
  mysql --user=user_name --fido-register-factor=3
  ```

Uma conta que requer registro para um segundo e terceiro fator de autenticação invoca o cliente **mysql** da seguinte forma:

  ```
  mysql --user=user_name --fido-register-factor=2,3
  ```

Se o registro for bem-sucedido, uma conexão é estabelecida. Se houver um fator de autenticação com um registro pendente, a conexão é colocada no modo de registro pendente ao tentar se conectar ao servidor. Nesse caso, desconecte e reconecte com o valor correto do `--fido-register-factor` para completar o registro.

O registro é um processo de dois passos, que compreende os passos *iniciar o registro* e *terminar o registro*. O passo de início do registro executa a seguinte declaração:

  ```
  ALTER USER user factor INITIATE REGISTRATION
  ```

A declaração retorna um conjunto de resultados contendo um desafio de 32 bytes, o nome do usuário e o ID da parte dependente (consulte `authentication_fido_rp_id`).

A etapa de registro final executa esta declaração:

  ```
  ALTER USER user factor FINISH REGISTRATION SET CHALLENGE_RESPONSE AS 'auth_string'
  ```

A declaração completa o registro e envia as seguintes informações ao servidor como parte do *`auth_string`*: dados do autenticador, um certificado de atestação opcional no formato X.509 e uma assinatura.

As etapas de iniciação e registro devem ser realizadas em uma única conexão, pois o desafio recebido pelo cliente durante a etapa de iniciação é salvo no manipulador de conexão do cliente. O registro falharia se a etapa de registro fosse realizada por uma conexão diferente. A opção `--fido-register-factor` executa as etapas de iniciação e registro, o que evita o cenário de falha descrito acima e impede a necessidade de executar as declarações de iniciação e registro (alter-user.html "15.7.1.1 ALTER USER Statement") manualmente.

A opção `--fido-register-factor` está disponível apenas para o cliente **mysql** e o MySQL Shell. Outros programas de cliente MySQL não o suportam.

Para informações relacionadas, consulte o uso da autenticação FIDO.

* `--force`, `-f`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>2

Continue mesmo se ocorrer um erro SQL.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>3

Peça ao servidor a chave pública necessária para a troca de senha baseada em par de chaves RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

Para informações sobre o plugin `caching_sha2_password`, consulte a Seção 8.4.1.2, “Cacheamento de Autenticação Alterável SHA-2”.

* `--histignore`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>4

Uma lista com um ou mais padrões separados por vírgula que especificam as declarações a serem ignoradas para fins de registro. Esses padrões são adicionados à lista de padrões padrão (`"*IDENTIFIED*:*PASSWORD*"`). O valor especificado para esta opção afeta o registro de declarações escritas no arquivo de histórico e em `syslog`, se a opção `--syslog` for fornecida. Para mais informações, consulte a Seção 6.5.1.3, “Registro do cliente do MySQL”.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>5

Conecte-se ao servidor MySQL no host fornecido.

A opção `--dns-srv-name` tem precedência sobre a opção `--host` se ambas forem fornecidas. `--dns-srv-name` faz com que o estabelecimento da conexão use a função da API C `mysql_real_connect_dns_srv()` em vez de `mysql_real_connect()`. No entanto, se o comando `connect` for usado subsequentemente no runtime e especificar um argumento de nome de host, esse nome de host tem precedência sobre qualquer opção `--dns-srv-name` fornecida ao iniciar o **mysql** para especificar um registro DNS SRV.

* `--html`, `-H`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>6

Produza a saída HTML.

* `--ignore-spaces`, `-i`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>7

Ignore espaços após os nomes das funções. O efeito disso é descrito na discussão para o modo `IGNORE_SPACE` SQL (consulte Seção 7.1.11, “Modos SQL do servidor”).

* `--init-command=str`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>8

Uma única instrução SQL para executar após a conexão com o servidor. Se o auto-reconexão estiver habilitada, a instrução é executada novamente após a reconexão ocorrer.

* `--line-numbers`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>9

Escreva números de linha para erros. Desative isso com `--skip-line-numbers`.

* `--load-data-local-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>0

Esta opção afeta a capacidade `LOCAL` do lado do cliente para operações `LOAD DATA`. Especifica o diretório em que os arquivos nomeados nas declarações [`LOAD DATA LOCAL`(load-data.html "15.2.9 LOAD DATA Statement") devem estar localizados. O efeito de `--load-data-local-dir` depende se o carregamento de dados `LOCAL` está habilitado ou desabilitado:

+ Se o carregamento de dados do `LOCAL` estiver habilitado, seja por padrão na biblioteca do cliente MySQL ou especificando `--local-infile[=1]`, a opção `--load-data-local-dir` é ignorada.

+ Se o carregamento de dados do `LOCAL` estiver desativado, seja por padrão na biblioteca do cliente MySQL ou especificando `--local-infile=0`, a opção `--load-data-local-dir` se aplica.

Quando o `--load-data-local-dir` se aplica, o valor da opção designa o diretório em que os arquivos de dados locais devem estar localizados. A comparação do nome do caminho do diretório e do nome do caminho dos arquivos a serem carregados é sensível ao caso, independentemente da sensibilidade ao caso do sistema de arquivos subjacente. Se o valor da opção for a string vazia, ele não nomeia nenhum diretório, com o resultado de que nenhum arquivo é permitido para carregamento de dados locais.

Por exemplo, para desabilitar explicitamente o carregamento de dados locais, exceto para arquivos localizados no diretório `/my/local/data`, invoque o **mysql** da seguinte forma:

  ```
  mysql --local-infile=0 --load-data-local-dir=/my/local/data
  ```

Quando ambos os `--local-infile` e `--load-data-local-dir` são fornecidos, a ordem em que são fornecidos não importa.

O uso bem-sucedido de operações de carga `LOCAL` dentro do **mysql** também exige que o servidor permita a carga local; veja a Seção 8.1.6, “Considerações de segurança para CARGA LOCAL”

A opção `--load-data-local-dir` foi adicionada no MySQL 8.0.21.

* `--local-infile[={0|1}]`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>1

Por padrão, a capacidade `LOCAL` para `LOAD DATA` é determinada pelo padrão compilado na biblioteca do cliente MySQL. Para habilitar ou desabilitar explicitamente o carregamento de dados `LOCAL`, use a opção `--local-infile`. Quando não é fornecida nenhuma valor, a opção habilita o carregamento de dados `LOCAL`. Quando fornecida como `--local-infile=0` ou `--local-infile=1`, a opção desabilita ou habilita o carregamento de dados `LOCAL`.

Se a capacidade `LOCAL` estiver desativada, a opção `--load-data-local-dir` pode ser usada para permitir o carregamento local restrito de arquivos localizados em um diretório designado.

O uso bem-sucedido de operações de carga `LOCAL` dentro do **mysql** também exige que o servidor permita a carga local; veja a Seção 8.1.6, “Considerações de segurança para CARGA LOCAL”

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>2

Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam para qual servidor MySQL se conectar e qual conta se autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql_config_editor**. Veja a Seção 6.6.7, “mysql_config_editor — Utilitário de Configuração MySQL”.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--max-allowed-packet=value`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>3

O tamanho máximo do buffer para comunicação cliente/servidor. O padrão é 16 MB, o máximo é 1 GB.

* `--max-join-size=value`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>4

O limite automático para linhas em uma junção ao usar `--safe-updates`. (O valor padrão é 1.000.000.)

* `--named-commands`, `-G`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>5

Ative comandos com nome **mysql**. Os comandos de formato longo são permitidos, não apenas comandos de formato curto. Por exemplo, `quit` e `\q` são reconhecidos. Use `--skip-named-commands` para desabilitar comandos com nome. Veja a Seção 6.5.1.2, “Comandos do cliente mysql”.

* `--net-buffer-length=value`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>6

O tamanho do buffer para comunicação TCP/IP e socket. (O valor padrão é 16 KB.)

* `--network-namespace=name`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>7

O espaço de rede a ser usado para conexões TCP/IP. Se omitido, a conexão usa o espaço de rede padrão (global). Para informações sobre namespaces de rede, consulte a Seção 7.1.14, “Suporte a Namespace de Rede”.

Essa opção foi adicionada no MySQL 8.0.22. Ela está disponível apenas em plataformas que implementam suporte ao namespace de rede.

* `--no-auto-rehash`, `-A`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>8

Isso tem o mesmo efeito que `--skip-auto-rehash`. Veja a descrição para `--auto-rehash`.

* `--no-beep`, `-b`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>9

Não emita um sinal sonoro quando ocorrerem erros.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--batch</code></td> </tr></tbody></table>0

Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para evitar que elas sejam lidas.

A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql_config_editor**. Veja a Seção 6.6.7, “mysql_config_editor — Ferramenta de Configuração do MySQL”.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--one-database`, `-o`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--batch</code></td> </tr></tbody></table>1

Ignore as declarações, exceto aquelas que ocorrem enquanto o banco de dados padrão é o nomeado na linha de comando. Esta opção é rudimentar e deve ser usada com cuidado. O filtro de declaração é baseado apenas em declarações `USE`.

Inicialmente, o **mysql** executa as instruções no input porque especificar um banco de dados *`db_name`* na linha de comando é equivalente a inserir [[`USE db_name`](use.html "15.8.4 USE Statement")] no início do input. Em seguida, para cada declaração `USE` encontrada, o **mysql** aceita ou rejeita as seguintes declarações, dependendo se o nome do banco de dados especificado é o mesmo da linha de comando. O conteúdo das declarações é irrelevante.

Suponha que **mysql** seja invocado para processar este conjunto de declarações:

  ```
  DELETE FROM db2.t2;
  USE db2;
  DROP TABLE db1.t1;
  CREATE TABLE db1.t1 (i INT);
  USE db1;
  INSERT INTO t1 (i) VALUES(1);
  CREATE TABLE db2.t1 (j INT);
  ```

Se a linha de comando for [**mysql --force --one-database db1**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client"), o **mysql** trata a entrada da seguinte forma:

+ A declaração `DELETE` é executada porque o banco de dados padrão é `db1`, embora a declaração nomeie uma tabela em um banco de dados diferente.

+ As declarações `DROP TABLE` e `CREATE TABLE` não são executadas porque o banco de dados padrão não é `db1`, embora as declarações nomeiem uma tabela em `db1`.

As declarações `INSERT` e `CREATE TABLE` são executadas porque o banco de dados padrão é `db1`, embora a declaração `CREATE TABLE` nomeie uma tabela em um banco de dados diferente.

* `--pager[=command]`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--batch</code></td> </tr></tbody></table>2

Use o comando fornecido para a saída da consulta de paginação. Se o comando for omitido, o gerenciador padrão é o valor da variável de ambiente `PAGER`. Os gerenciadores válidos são **less**, **more**, **cat [> filename]**, e assim por diante. Esta opção só funciona em Unix e apenas no modo interativo. Para desabilitar a paginação, use `--skip-pager`. A Seção 6.5.1.2, “Comandos do cliente do MySQL”, discute a paginação de saída mais a fundo.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--batch</code></td> </tr></tbody></table>3

A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysql** solicitará uma senha. Se for fornecida, não deve haver *espaço* entre `--password=` ou `-p` e a senha que a segue. Se não for especificado nenhum tipo de senha, o padrão é não enviar senha.

Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Veja a Seção 8.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

Para especificar explicitamente que não há senha e que o **mysql** não deve solicitar uma senha, use a opção `--skip-password`.

* `--password1[=pass_val]`

A senha para o fator de autenticação multifatorial 1 da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysql** solicitará uma senha. Se for fornecida, não deve haver **espaço** entre `--password1=` e a senha que a segue. Se não for especificado nenhum tipo de senha, o padrão é não enviar senha.

Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Veja a Seção 8.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

Para especificar explicitamente que não há senha e que o **mysql** não deve solicitar uma senha, use a opção `--skip-password1`.

`--password1` e `--password` são sinônimos, assim como `--skip-password1` e `--skip-password`.

* `--password2[=pass_val]`

A senha para o fator de autenticação multifatorial 2 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica para `--password1`; consulte a descrição dessa opção para obter detalhes.

* `--password3[=pass_val]`

A senha para o fator de autenticação multifatorial 3 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica para `--password1`; consulte a descrição dessa opção para obter detalhes.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--batch</code></td> </tr></tbody></table>4

Em Windows, conecte-se ao servidor usando um tubo nomeado. Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por tubo nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--plugin-authentication-kerberos-client-mode=value`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--batch</code></td> </tr></tbody></table>5

Em Windows, o plugin de autenticação `authentication_kerberos_client` suporta essa opção do plugin. Ele fornece dois valores possíveis que o usuário do cliente pode definir em tempo de execução: `SSPI` e `GSSAPI`.

O valor padrão para a opção do plugin do lado do cliente usa a Interface de Suporte de Segurança (SSPI), que é capaz de adquirir credenciais do cache de memória do Windows. Alternativamente, o usuário do cliente pode selecionar um modo que suporte a Interface de Programa de Aplicação de Serviço de Segurança Genérico (GSSAPI) através da biblioteca MIT Kerberos no Windows. O GSSAPI é capaz de adquirir credenciais armazenadas previamente geradas usando o comando **kinit**.

Para mais informações, consulte [Comandos para clientes Windows no modo GSSAPI][(kerberos-pluggable-authentication.html#kerberos-usage-win-gssapi-client-commands)].

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--batch</code></td> </tr></tbody></table>6

O diretório onde procurar plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o **mysql** não o encontrar. Veja a Seção 8.2.17, “Autenticação Conectada”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--batch</code></td> </tr></tbody></table>7

Para conexões TCP/IP, o número de porta a ser utilizado.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--batch</code></td> </tr></tbody></table>8

Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--prompt=format_str`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--batch</code></td> </tr></tbody></table>9

Defina o prompt no formato especificado. O padrão é `mysql>`. As sequências especiais que o prompt pode conter são descritas na Seção 6.5.1.2, "Comandos do cliente do MySQL".

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Valor padrão (≥ 8.0.19)</th> <td><code>FALSE in noninteractive mode</code></td> </tr><tr><th>Valor padrão (≤ 8.0.18)</th> <td><code>FALSE</code></td> </tr></tbody></table>0

O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de outro protocolo que não o desejado. Para obter detalhes sobre os valores permitidos, consulte a Seção 6.2.7, “Protocolos de Transporte de Conexão”.

* `--quick`, `-q`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Valor padrão (≥ 8.0.19)</th> <td><code>FALSE in noninteractive mode</code></td> </tr><tr><th>Valor padrão (≤ 8.0.18)</th> <td><code>FALSE</code></td> </tr></tbody></table>1

Não cache cada resultado da consulta, imprima cada linha conforme ela é recebida. Isso pode tornar o servidor mais lento se o resultado for suspenso. Com esta opção, o **mysql** não usa o arquivo de histórico.

Por padrão, o **mysql** recupera todas as linhas de resultado antes de produzir qualquer saída; ao armazená-las, calcula um comprimento máximo de coluna em execução a partir do valor real de cada coluna em sucessão. Ao imprimir a saída, ele usa esse máximo para formatá-la. Quando `--quick` é especificado, o **mysql** não tem as linhas para as quais calcular o comprimento antes de começar, e, portanto, usa o comprimento máximo. No exemplo a seguir, a tabela `t1` tem uma única coluna do tipo `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") e contendo 4 linhas. A saída padrão tem 9 caracteres de largura; essa largura é igual ao número máximo de caracteres em qualquer um dos valores das colunas nas linhas retornadas (5), mais 2 caracteres cada para os espaços usados como preenchimento e os caracteres `|` usados como delimitadores de coluna). A saída ao usar a opção `--quick` tem 25 caracteres de largura; essa é igual ao número de caracteres necessários para representar `-9223372036854775808`, que é o valor mais longo possível que pode ser armazenado em uma coluna (assinada) `BIGINT`, ou 19 caracteres, mais os 4 caracteres usados para preenchimento e delimitadores de coluna. A diferença pode ser vista aqui:

  ```
  $> mysql -t test -e "SELECT * FROM t1"
  +-------+
  | c1    |
  +-------+
  |   100 |
  |  1000 |
  | 10000 |
  |    10 |
  +-------+

  $> mysql --quick -t test -e "SELECT * FROM t1"
  +----------------------+
  | c1                   |
  +----------------------+
  |                  100 |
  |                 1000 |
  |                10000 |
  |                   10 |
  +----------------------+
  ```

* `--raw`, `-r`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Valor padrão (≥ 8.0.19)</th> <td><code>FALSE in noninteractive mode</code></td> </tr><tr><th>Valor padrão (≤ 8.0.18)</th> <td><code>FALSE</code></td> </tr></tbody></table>2

Para a saída tabular, o "boxeamento" ao redor das colunas permite que um valor de uma coluna seja distinguido de outro. Para a saída não tabular (como a produzida em modo de lote ou quando a opção `--batch` ou `--silent` é dada), os caracteres especiais são escamados na saída para que possam ser identificados facilmente. Novo linha, tab, `NUL` e barra invertida são escritos como `\n`, `\t`, `\0` e `\\`. A opção `--raw` desabilita esse escapagem de caracteres.

O exemplo a seguir demonstra a saída tabular versus não tabular e o uso do modo bruto para desabilitar a fuga de caracteres:

  ```
  % mysql
  mysql> SELECT CHAR(92);
  +----------+
  | CHAR(92) |
  +----------+
  | \        |
  +----------+

  % mysql -s
  mysql> SELECT CHAR(92);
  CHAR(92)
  \\

  % mysql -s -r
  mysql> SELECT CHAR(92);
  CHAR(92)
  \
  ```

* `--reconnect`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Valor padrão (≥ 8.0.19)</th> <td><code>FALSE in noninteractive mode</code></td> </tr><tr><th>Valor padrão (≤ 8.0.18)</th> <td><code>FALSE</code></td> </tr></tbody></table>3

Se a conexão com o servidor for perdida, tente reconectar automaticamente. Uma única tentativa de reconexão é feita a cada vez que a conexão é perdida. Para suprimir o comportamento de reconexão, use `--skip-reconnect`.

* `--safe-updates`, `--i-am-a-dummy`, `-U`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Valor padrão (≥ 8.0.19)</th> <td><code>FALSE in noninteractive mode</code></td> </tr><tr><th>Valor padrão (≤ 8.0.18)</th> <td><code>FALSE</code></td> </tr></tbody></table>4

Se esta opção estiver habilitada, as declarações `UPDATE` e `DELETE` que não utilizam uma chave na cláusula `WHERE` ou na cláusula `LIMIT` produzem um erro. Além disso, restrições são colocadas nas declarações `SELECT` que produzem (ou são estimadas para produzir) conjuntos de resultados muito grandes. Se você definiu esta opção em um arquivo de opções, pode usar `--skip-safe-updates` na linha de comando para sobrescrevê-la. Para obter mais informações sobre esta opção, consulte "Usando o modo de atualizações seguras (--safe-updates)".

* `--select-limit=value`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Valor padrão (≥ 8.0.19)</th> <td><code>FALSE in noninteractive mode</code></td> </tr><tr><th>Valor padrão (≤ 8.0.18)</th> <td><code>FALSE</code></td> </tr></tbody></table>5

O limite automático para declarações `SELECT` ao usar `--safe-updates`. (O valor padrão é 1.000.)

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Valor padrão (≥ 8.0.19)</th> <td><code>FALSE in noninteractive mode</code></td> </tr><tr><th>Valor padrão (≤ 8.0.18)</th> <td><code>FALSE</code></td> </tr></tbody></table>6

O nome do caminho de um arquivo em formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senha baseada em par de chaves RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

Para `sha256_password`, esta opção só se aplica se o MySQL foi construído usando OpenSSL.

Para informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 8.4.1.3, “Autenticação substituível SHA-256”, e a Seção 8.4.1.2, “Cache de autenticação substituível SHA-2”.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Valor padrão (≥ 8.0.19)</th> <td><code>FALSE in noninteractive mode</code></td> </tr><tr><th>Valor padrão (≤ 8.0.18)</th> <td><code>FALSE</code></td> </tr></tbody></table>7

Em Windows, o nome de memória compartilhada a ser usado para conexões feitas usando memória compartilhada a um servidor local. O valor padrão é `MYSQL`. O nome de memória compartilhada é sensível a maiúsculas e minúsculas.

Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

* `--show-warnings`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Valor padrão (≥ 8.0.19)</th> <td><code>FALSE in noninteractive mode</code></td> </tr><tr><th>Valor padrão (≤ 8.0.18)</th> <td><code>FALSE</code></td> </tr></tbody></table>8

Se houver alguma advertência, ela deve ser exibida após cada declaração. Esta opção se aplica ao modo interativo e ao modo em lote.

* `--sigint-ignore`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Valor padrão (≥ 8.0.19)</th> <td><code>FALSE in noninteractive mode</code></td> </tr><tr><th>Valor padrão (≤ 8.0.18)</th> <td><code>FALSE</code></td> </tr></tbody></table>9

Ignore os sinais `SIGINT` (normalmente o resultado da digitação de **Control+C**).

Sem essa opção, ao digitar **Control+C**, o texto atual é interrompido, se houver um, ou qualquer linha de entrada parcial é cancelada, caso contrário.

* `--silent`, `-s`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-mode</code></td> </tr></tbody></table>0

Modo silencioso. Produzir menos saída. Esta opção pode ser dada várias vezes para produzir cada vez menos saída.

Essa opção resulta em um formato de saída não tabular e na fuga de caracteres especiais. A fuga pode ser desativada usando o modo bruto; consulte a descrição da opção `--raw`.

* `--skip-column-names`, `-N`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-mode</code></td> </tr></tbody></table>1

Não escreva nomes de colunas nos resultados. O uso desta opção faz com que a saída seja alinhada à direita, como mostrado aqui:

  ```
  $> echo "SELECT * FROM t1" | mysql -t test
  +-------+
  | c1    |
  +-------+
  | a,c,d |
  | c     |
  +-------+
  $> echo "SELECT * FROM t1" | ./mysql -uroot -Nt test
  +-------+
  | a,c,d |
  |     c |
  +-------+
  ```

* `--skip-line-numbers`, `-L`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-mode</code></td> </tr></tbody></table>2

Não escreva números de linha para erros. Útil quando você deseja comparar arquivos de resultado que incluem mensagens de erro.

* `--skip-system-command`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-mode</code></td> </tr></tbody></table>3

Desabilita o comando `system` (`\!`). É equivalente a `--system-command=OFF`.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-mode</code></td> </tr></tbody></table>4

Para conexões a `localhost`, o arquivo de socket Unix a ser usado, ou, no Windows, o nome do tubo nomeado a ser usado.

Em Windows, esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de canal nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--ssl*`

As opções que começam com `--ssl` especificam se deve conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Consulte Opções de comando para conexões criptografadas.

* `--ssl-fips-mode={OFF|ON|STRICT}`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-mode</code></td> </tr></tbody></table>5

Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere de outras opções `--ssl-xxx` porque não é usada para estabelecer conexões criptografadas, mas sim para determinar quais operações criptográficas devem ser permitidas. Veja a Seção 8.8, “Suporte FIPS”.

Esses valores `--ssl-fips-mode` são permitidos:

+ `OFF`: Desabilitar o modo FIPS.  
  + `ON`: Habilitar o modo FIPS.  
  + `STRICT`: Habilitar o modo FIPS "strict".

Nota

Se o Módulo de Objeto FIPS OpenSSL não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Neste caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente produza um aviso na inicialização e opere no modo não FIPS.

A partir do MySQL 8.0.34, essa opção é desatualizada. A espera é que ela seja removida em uma versão futura do MySQL.

* `--syslog`, `-j`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-mode</code></td> </tr></tbody></table>6

Essa opção faz com que o **mysql** envie declarações interativas para a facilidade de registro do sistema. Em Unix, isso é `syslog`; em Windows, é o Diário de eventos do Windows. O destino onde as mensagens registradas aparecem é dependente do sistema. Em Linux, o destino é frequentemente o arquivo `/var/log/messages`.

Aqui está uma amostra de saída gerada no Linux usando `--syslog`. Essa saída é formatada para melhor legibilidade; cada mensagem registrada na verdade ocupa uma única linha.

  ```
  Mar  7 12:39:25 myhost MysqlClient[20824]:
    SYSTEM_USER:'oscar', MYSQL_USER:'my_oscar', CONNECTION_ID:23,
    DB_SERVER:'127.0.0.1', DB:'--', QUERY:'USE test;'
  Mar  7 12:39:28 myhost MysqlClient[20824]:
    SYSTEM_USER:'oscar', MYSQL_USER:'my_oscar', CONNECTION_ID:23,
    DB_SERVER:'127.0.0.1', DB:'test', QUERY:'SHOW TABLES;'
  ```

Para mais informações, consulte a Seção 6.5.1.3, “Registro do cliente do MySQL”.

* `--system-command[={ON|OFF}]`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-mode</code></td> </tr></tbody></table>7

Ative ou desative o comando `system` (`\!`). Quando esta opção é desativada, seja pelo comando `--system-command=OFF` ou pelo `--skip-system-command`, o comando `system` é rejeitado com um erro.

(*MySQL 8.0.43 e posterior: `--commands`, quando desativado (definido como `FALSE`, o servidor ignora qualquer configuração para esta opção.

* `--table`, `-t`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-mode</code></td> </tr></tbody></table>8

Exibir a saída em formato de tabela. Esse é o padrão para uso interativo, mas pode ser usado para produzir saída em tabela em modo em lote.

* `--tee=file_name`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-mode</code></td> </tr></tbody></table>9

Adicione uma cópia do resultado ao arquivo fornecido. Esta opção funciona apenas no modo interativo. A Seção 6.5.1.2, “Comandos do cliente do MySQL”, discute mais sobre os arquivos tee.

* `--tls-ciphersuites=ciphersuite_list`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>0

As sequências de cifra permitidas para conexões criptografadas que utilizam TLSv1.3. O valor é uma lista de um ou mais nomes de sequência de cifra separados por vírgula. As sequências de cifra que podem ser nomeadas para esta opção dependem da biblioteca SSL utilizada para compilar o MySQL. Para obter detalhes, consulte a Seção 8.3.2, “Protocolos e cifras de conexão criptografada TLS”.

Essa opção foi adicionada no MySQL 8.0.16.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>1

Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolo separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, “Protocolos e cifras TLS de conexão criptografada”.

* `--unbuffered`, `-n`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>2

Limpe o buffer após cada consulta.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>3

O nome de usuário da conta MySQL a ser usado para se conectar ao servidor.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>4

Modo verbose. Produza mais saída sobre o que o programa faz. Esta opção pode ser dada várias vezes para produzir cada vez mais saída. (Por exemplo, `-v -v -v` produz o formato de saída da tabela mesmo no modo em lote.)

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>5

Exibir informações da versão e sair.

* `--vertical`, `-E`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>6

Imprimir linhas de saída de consulta verticalmente (uma linha por valor de coluna). Sem esta opção, você pode especificar saída vertical para declarações individuais terminando-as com `\G`.

* `--wait`, `-w`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>7

Se a conexão não puder ser estabelecida, espere e tente novamente, em vez de abortar.

* `--xml`, `-X`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>8

Produza a saída XML.

  ```
  <field name="column_name">NULL</field>
  ```

A saída quando `--xml` é usada com **mysql** corresponde à do **mysqldump** `--xml`. Consulte a Seção 6.5.4, “mysqldump — Um programa de backup de banco de dados”, para obter detalhes.

A saída XML também utiliza um espaço de nome XML, conforme mostrado aqui:

  ```
  $> mysql --xml -uroot -e "SHOW VARIABLES LIKE 'version%'"
  <?xml version="1.0"?>

  <resultset statement="SHOW VARIABLES LIKE 'version%'" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <row>
  <field name="Variable_name">version</field>
  <field name="Value">5.0.40-debug</field>
  </row>

  <row>
  <field name="Variable_name">version_comment</field>
  <field name="Value">Source distribution</field>
  </row>

  <row>
  <field name="Variable_name">version_compile_machine</field>
  <field name="Value">i686</field>
  </row>

  <row>
  <field name="Variable_name">version_compile_os</field>
  <field name="Value">suse-linux-gnu</field>
  </row>
  </resultset>
  ```

* `--zstd-compression-level=level`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>9

O nível de compressão a ser usado para conexões ao servidor que utilizam o algoritmo de compressão `zstd`. Os níveis permitidos são de 1 a 22, com valores maiores indicando níveis crescentes de compressão. O nível de compressão padrão `zstd` é 3. O ajuste do nível de compressão não afeta as conexões que não utilizam compressão `zstd`.

Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

Essa opção foi adicionada no MySQL 8.0.18.

#### 6.5.1.2 Comandos do cliente do MySQL

**mysql** envia cada instrução SQL que você emite para o servidor a ser executada. Há também um conjunto de comandos que **mysql** interpreta por si mesmo. Para obter uma lista desses comandos, digite `help` ou `\h` no prompt `mysql>`:

```
mysql> help

List of all MySQL commands:
Note that all text commands must be first on line and end with ';'
?         (\?) Synonym for `help'.
clear     (\c) Clear the current input statement.
connect   (\r) Reconnect to the server. Optional arguments are db and host.
delimiter (\d) Set statement delimiter.
edit      (\e) Edit command with $EDITOR.
ego       (\G) Send command to mysql server, display result vertically.
exit      (\q) Exit mysql. Same as quit.
go        (\g) Send command to mysql server.
help      (\h) Display this help.
nopager   (\n) Disable pager, print to stdout.
notee     (\t) Don't write into outfile.
pager     (\P) Set PAGER [to_pager]. Print the query results via PAGER.
print     (\p) Print current command.
prompt    (\R) Change your mysql prompt.
quit      (\q) Quit mysql.
rehash    (\#) Rebuild completion hash.
source    (\.) Execute an SQL script file. Takes a file name as an argument.
status    (\s) Get status information from the server.
system    (\!) Execute a system shell command.
tee       (\T) Set outfile [to_outfile]. Append everything into given
               outfile.
use       (\u) Use another database. Takes database name as argument.
charset   (\C) Switch to another charset. Might be needed for processing
               binlog with multi-byte charsets.
warnings  (\W) Show warnings after every statement.
nowarning (\w) Don't show warnings after every statement.
resetconnection(\x) Clean session context.
query_attributes Sets string parameters (name1 value1 name2 value2 ...)
for the next query to pick up.
ssl_session_data_print Serializes the current SSL session data to stdout
or file.

For server side help, type 'help contents'
```

Se o **mysql** for invocado com a opção `--binary-mode`, todos os comandos do **mysql** serão desativados, exceto `charset` e `delimiter` no modo não interativo (para entrada canalizada para o **mysql** ou carregada usando o comando `source`). A partir do MySQL 8.0.43, a opção `--commands` pode ser usada para habilitar ou desabilitar todos os comandos, exceto `/C`, `delimiter` e `use`.

Cada comando tem uma forma longa e uma forma curta. A forma longa não é sensível ao caso; a forma curta é. A forma longa pode ser seguida por um terminador opcional por ponto e vírgula, mas a forma curta não deve.

O uso de comandos de formato curto dentro de comentários de várias linhas `/* ... */` não é suportado. Os comandos de formato curto funcionam dentro de comentários de versão de linha única `/*! ... */`, assim como os comentários de otimizador-sinal, que são armazenados em definições de objeto. Se houver preocupação de que os comentários de otimizador-sinal possam ser armazenados em definições de objeto de modo que os arquivos de depuração, quando re carregados com `mysql`, resultem na execução desses comandos, invocando **mysql** com a opção `--binary-mode` ou usando um cliente de re carregamento diferente de **mysql**.

* `help [arg]`, `\h [arg]`, `\? [arg]`, `? [arg]`

Exibir uma mensagem de ajuda que lista os comandos **mysql** disponíveis.

Se você fornecer um argumento para o comando `help`, o **mysql** o usa como uma string de pesquisa para acessar a ajuda do lado do servidor a partir do conteúdo do Manual de Referência do MySQL. Para mais informações, consulte a Seção 6.5.1.4, “Ajuda do lado do cliente e do servidor do mysql”.

* `charset charset_name`, `\C charset_name`

Altere o conjunto de caracteres padrão e emita uma declaração `SET NAMES`. Isso permite que o conjunto de caracteres permaneça sincronizado no cliente e no servidor se o **mysql** for executado com o auto-reconexão habilitada (o que não é recomendado), porque o conjunto de caracteres especificado é usado para reconexões.

* `clear`, `\c`

Limpe a entrada atual. Use isso se você mudar de ideia sobre a execução da declaração que você está inserindo.

* `connect [db_name [host_name]]`, `\r [db_name [host_name]]`

Reconnecte-se ao servidor. Os argumentos opcionais para o nome do banco de dados e o nome do host podem ser fornecidos para especificar o banco de dados padrão ou o host onde o servidor está sendo executado. Se omitidos, os valores atuais são usados.

Se o comando `connect` especificar um argumento de nome de host, esse host terá precedência sobre qualquer opção `--dns-srv-name` dada na inicialização do **mysql** para especificar um registro DNS SRV.

* `delimiter str`, `\d str`

Altere a string que o **mysql** interpreta como o separador entre as declarações SQL. O padrão é o caractere ponto e vírgula (`;`).

A string de delimitador pode ser especificada como um argumento não citado ou citado na linha de comando do comando `delimiter`. A citação pode ser feita com uma única citação (`'`), uma dupla citação (`"`), ou o caractere de barra invertida (`` ` ``) characters. To include a quote within a quoted string, either quote the string with a different quote character or escape the quote with a backslash (`\). Deve-se evitar o uso de barra invertida fora de strings citadas, pois é o caractere de escape para MySQL. Para um argumento não citado, o delimitador é lido até o primeiro espaço ou até o final da linha. Para um argumento citado, o delimitador é lido até a citação correspondente na linha.

**mysql** interpreta instâncias da cadeia de delimitador como um delimitador de declaração em qualquer lugar que ocorra, exceto dentro de strings citadas. Tenha cuidado ao definir um delimitador que possa ocorrer dentro de outras palavras. Por exemplo, se você definir o delimitador como `X`, não é possível usar a palavra `INDEX` em declarações. **mysql** interpreta isso como `INDE` seguido pelo delimitador `X`.

Quando o delimitador reconhecido pelo **mysql** é definido como algo diferente do padrão de `;`, as instâncias desse caractere são enviadas ao servidor sem interpretação. No entanto, o próprio servidor ainda interpreta `;` como um delimitador de declaração e processa as declarações conforme necessário. Esse comportamento no lado do servidor entra em jogo para a execução de múltiplas declarações (veja Suporte para Execução de Múltiplas Declarações) e para a análise do corpo de procedimentos e funções armazenadas, gatilhos e eventos (veja Seção 27.1, “Definindo Programas Armazenados”).

* `edit`, `\e`

Edita a declaração de entrada atual. O **mysql** verifica os valores das variáveis de ambiente `EDITOR` e `VISUAL` para determinar qual editor usar. O editor padrão é **vi** se nenhuma das variáveis for definida.

O comando `edit` funciona apenas no Unix.

* `ego`, `\G`

Envie a declaração atual para o servidor a ser executado e exiba o resultado usando o formato vertical.

* `exit`, `\q`

Saia de **mysql**.

* `go`, `\g`

Envie a declaração atual para o servidor a ser executado.

* `nopager`, `\n`

Desative a exibição de páginas de saída. Consulte a descrição para `pager`.

O comando `nopager` funciona apenas no Unix.

* `notee`, `\t`

Desative a cópia de saída para o arquivo tee. Consulte a descrição para `tee`.

* `nowarning`, `\w`

Desative a exibição de avisos após cada declaração.

* `pager [command]`, `\P [command]`

Ative a exibição de páginas de saída. Ao usar a opção `--pager` ao invocar o **mysql**, é possível navegar ou pesquisar resultados de consulta em modo interativo com programas Unix, como **less**, **more** ou qualquer outro programa semelhante. Se você não especificar nenhum valor para a opção, o **mysql** verifica o valor da variável de ambiente `PAGER` e define o pager para essa opção. A funcionalidade de pager funciona apenas em modo interativo.

A exibição de páginas de saída pode ser habilitada interativamente com o comando `pager` e desabilitada com `nopager`. O comando aceita um argumento opcional; se fornecido, o programa de exibição de páginas é definido para isso. Sem argumento, o pager é definido para o pager que foi definido na linha de comando, ou `stdout` se nenhum pager foi especificado.

A exibição de páginas de saída funciona apenas no Unix porque usa a função `popen()`, que não existe no Windows. Para o Windows, a opção `tee` pode ser usada em vez disso para salvar a saída da consulta, embora não seja tão conveniente quanto `pager` para navegar pela saída em algumas situações.

* `print`, `\p`

Imprima a declaração de entrada atual sem executá-la.

* `prompt [str]`, `\R [str]`

Reconfigure o prompt **mysql** para a string fornecida. As sequências de caracteres especiais que podem ser usadas no prompt são descritas mais adiante nesta seção.

Se você especificar o comando `prompt` sem argumento, o **mysql** redefiniu o prompt para o padrão de `mysql>`.

* `query_attributes name value [name value ...]`

Defina atributos de consulta que se aplicam à próxima consulta enviada ao servidor. Para discussão sobre o propósito e o uso de atributos de consulta, consulte a Seção 11.6, “Atributos de consulta”.

O comando `query_attributes` segue estas regras:

+ O formato e as regras de citação para os nomes e valores dos atributos são os mesmos do comando `delimiter`.

+ O comando permite até 32 pares de nome/valor de atributo. Os nomes e valores podem ter até 1024 caracteres. Se um nome for dado sem um valor, ocorre um erro.

+ Se vários comandos `query_attributes` forem emitidos antes da execução da consulta, apenas o último comando se aplica. Após enviar a consulta, o **mysql** limpa o conjunto de atributos.

+ Se vários atributos forem definidos com o mesmo nome, as tentativas de recuperar o valor do atributo terão um resultado indefinido.

+ Um atributo definido com um nome vazio não pode ser recuperado pelo nome.

+ Se uma reconexão ocorrer enquanto o **mysql** executa a consulta, o **mysql** restaura os atributos após a reconexão, para que a consulta possa ser executada novamente com os mesmos atributos.

* `quit`, `\q`

Saia de **mysql**.

* `rehash`, `\#`

Recrie o hash de conclusão que permite a conclusão do nome do banco de dados, tabela e coluna enquanto você está digitando declarações. (Veja a descrição da opção `--auto-rehash`.

* `resetconnection`, `\x`

Reinicie a conexão para limpar o estado da sessão. Isso inclui a limpeza de quaisquer atributos de consulta atuais definidos usando o comando `query_attributes`.

A redefinição de uma conexão tem efeitos semelhantes ao `mysql_change_user()` ou a um auto-reconexão, exceto que a conexão não é fechada e reaberta, e a reautenticação não é feita. Veja mysql_change_user() e Controle de Reconexão Automática.

Este exemplo mostra como `resetconnection` limpa um valor mantido no estado da sessão:

  ```
  mysql> SELECT LAST_INSERT_ID(3);
  +-------------------+
  | LAST_INSERT_ID(3) |
  +-------------------+
  |                 3 |
  +-------------------+

  mysql> SELECT LAST_INSERT_ID();
  +------------------+
  | LAST_INSERT_ID() |
  +------------------+
  |                3 |
  +------------------+

  mysql> resetconnection;

  mysql> SELECT LAST_INSERT_ID();
  +------------------+
  | LAST_INSERT_ID() |
  +------------------+
  |                0 |
  +------------------+
  ```

* `source file_name`, `\. file_name`

Leia o arquivo nomeado e execute as declarações contidas nele. Em Windows, especifique os separadores de nome de caminho como `/` ou `\\`.

Os caracteres de citação são considerados parte do próprio nome do arquivo. Para obter os melhores resultados, o nome não deve incluir caracteres de espaço.

* `ssl_session_data_print [file_name]`

Pega, serializa e, opcionalmente, armazena os dados da sessão de uma conexão bem-sucedida. O nome do arquivo e os argumentos opcionais podem ser fornecidos para especificar o arquivo para armazenar os dados serializados da sessão. Se omitido, os dados da sessão são impressos em `stdout`.

Se a sessão MySQL estiver configurada para reutilização, os dados da sessão do arquivo são deserializados e fornecidos ao comando `connect` para reconectar. Quando a sessão é reutilizada com sucesso, o comando `status` contém uma linha que mostra `SSL session reused: true`, enquanto o cliente permanece reconectado ao servidor.

* `status`, `\s`

Forneça informações de status sobre a conexão e o servidor que você está usando. Se você estiver executando com `--safe-updates` habilitado, `status` também imprime os valores das variáveis **mysql** que afetam suas consultas.

* `system command`, `\! command`

Execute o comando fornecido usando o interpretador de comandos padrão.

Antes do MySQL 8.0.19, o comando `system` só funciona no Unix. A partir do 8.0.19, ele também funciona no Windows.

Em MySQL 8.0.40 e versões posteriores, esse comando pode ser desativado ao iniciar o cliente com `--system-command=OFF` ou `--skip-system-command`.

* `tee [file_name]`, `\T [file_name]`

Ao usar a opção `--tee` ao invocar o **mysql**, você pode registrar declarações e suas saídas. Todos os dados exibidos na tela são anexados a um arquivo especificado. Isso também pode ser muito útil para fins de depuração. O **mysql** esvazia os resultados para o arquivo após cada declaração, logo antes de imprimir sua próxima solicitação. A funcionalidade Tee funciona apenas no modo interativo.

Você pode habilitar esse recurso interativamente com o comando `tee`. Sem um parâmetro, o arquivo anterior é usado. O arquivo `tee` pode ser desativado com o comando `notee`. Executar `tee` novamente reativa o registro.

* `use db_name`, `\u db_name`

Use *`db_name`* como o banco de dados padrão.

* `warnings`, `\W`

Ative a exibição de avisos após cada declaração (se houver alguma).

Aqui estão alguns conselhos sobre o comando `pager`:

* Você pode usá-lo para escrever em um arquivo e os resultados vão apenas para o arquivo:

  ```
  mysql> pager cat > /tmp/log.txt
  ```

Você também pode passar quaisquer opções para o programa que você deseja usar como seu pager:

  ```
  mysql> pager less -n -i -S
  ```

* No exemplo anterior, observe a opção `-S`. Você pode achar muito útil para navegar em resultados de consulta ampla. Às vezes, um conjunto de resultados muito amplo é difícil de ler na tela. A opção `-S` para **menos** pode tornar o conjunto de resultados muito mais legível, pois você pode rolar-o horizontalmente usando as teclas seta para a esquerda e seta para a direita. Você também pode usar `-S` interativamente dentro de **menos** para ligar e desligar o modo de navegação horizontal. Para mais informações, leia a página do manual do **menos**:

  ```
  man less
  ```

As opções `-F` e `-X` podem ser usadas com **menos** para fazer com que ela saia se a saída cabe em um único ecrã, o que é conveniente quando não é necessário rolar:

  ```
  mysql> pager less -n -i -S -F -X
  ```

* Você pode especificar comandos de página muito complexos para manipulação da saída da consulta:

  ```
  mysql> pager cat | tee /dr1/tmp/res.txt \
            | tee /dr2/tmp/res2.txt | less -n -i -S
  ```

Neste exemplo, o comando enviaria os resultados da consulta para dois arquivos em dois diretórios diferentes em dois sistemas de arquivos diferentes montados em `/dr1` e `/dr2`, mas ainda exibisse os resultados na tela usando **less**.

Você também pode combinar as funções `tee` e `pager`. Tenha um arquivo `tee` habilitado e `pager` definido como **menos**, e você poderá navegar pelos resultados usando o programa **less** e ainda ter tudo anexado em um arquivo ao mesmo tempo. A diferença entre o Unix `tee` usado com o comando `pager` e o comando interno `tee` do **mysql** é que o interno `tee` funciona mesmo se você não tiver o **tee** do Unix disponível. O interno `tee` também registra tudo o que é impresso na tela, enquanto o **tee** do Unix usado com `pager` não registra tanto. Além disso, o registro de arquivo `tee` pode ser ligado e desligado interativamente dentro do **mysql**. Isso é útil quando você quer registrar algumas consultas em um arquivo, mas não outras.

O comando `prompt` reconfigura o prompt padrão `mysql>`. A string para definir o prompt pode conter as seguintes sequências especiais.

<table summary="prompt command options that are used to configure the mysql&gt; prompt."><col style="width: 15%"/><col style="width: 75%"/><thead><tr> <th>Option</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><code>\C</code></td> <td>O identificador atual da conexão</td> </tr><tr> <td><code>\c</code></td> <td>Um contador que incrementa para cada declaração que você emite</td> </tr><tr> <td><code>\D</code></td> <td>A data atual completa</td> </tr><tr> <td><code>\d</code></td> <td>O banco de dados padrão</td> </tr><tr> <td><code>\h</code></td> <td>O servidor host</td> </tr><tr> <td><code>\l</code></td> <td>O delimitador atual</td> </tr><tr> <td><code>\m</code></td> <td>Minutos do horário atual</td> </tr><tr> <td><code>\n</code></td> <td>Um caractere de nova linha</td> </tr><tr> <td><code>\O</code></td> <td>O mês atual no formato de três letras (Jan, Feb, …)</td> </tr><tr> <td><code>\o</code></td> <td>O mês atual em formato numérico</td> </tr><tr> <td><code>\P</code></td> <td>am/pm</td> </tr><tr> <td><code>\p</code></td> <td>O port atual TCP/IP ou arquivo de soquete</td> </tr><tr> <td><code>\R</code></td> <td>O horário atual, em hora militar de 24 horas (0–23)</td> </tr><tr> <td><code>\r</code></td> <td>O horário atual, horário padrão de 12 horas (1–12)</td> </tr><tr> <td><code>\S</code></td> <td>Ponto e vírgula</td> </tr><tr> <td><code>\s</code></td> <td>Segundos do horário atual</td> </tr><tr> <td><code>\T</code></td> <td>Imprima um asterisco (<code>*</code>) se a sessão atual estiver dentro de um bloco de transação (a partir do MySQL 8.0.28)</td> </tr><tr> <td><code>\t</code></td> <td>Um caractere de tabulação</td> </tr><tr> <td><code>\U</code></td> <td><p>Seu completo<code><em class="replaceable"><code>user_name</code></em>@<em class="replaceable"><code>host_name</code></em></code>nome da conta</p></td> </tr><tr> <td><code>\u</code></td> <td>Seu nome de usuário</td> </tr><tr> <td><code>\v</code></td> <td>A versão do servidor</td> </tr><tr> <td><code>\w</code></td> <td>O dia atual da semana no formato de três letras (Seg, Ter, etc.)</td> </tr><tr> <td><code>\Y</code></td> <td>O ano atual, quatro algarismos</td> </tr><tr> <td><code>\y</code></td> <td>O ano atual, dois algarismos</td> </tr><tr> <td><code>_</code></td> <td>Um espaço</td> </tr><tr> <td><code>\ </code></td> <td>Um espaço (um espaço segue o backslash)</td> </tr><tr> <td><code>\'</code></td> <td>Citação única</td> </tr><tr> <td><code>\"</code></td> <td>Citação dupla</td> </tr><tr> <td><code>\\</code></td> <td>Literalmente<code>\</code>caractere barra invertida</td> </tr><tr> <td><code>\<em class="replaceable"><code>x</code></em></code></td> <td><p> <em class="replaceable"><code>x</code></em>, para qualquer “<em class="replaceable"><code>x</code></em>“não listado acima</p></td> </tr></tbody></table>

Você pode definir o prompt de várias maneiras:

* *Use uma variável de ambiente.* Você pode definir a variável de ambiente `MYSQL_PS1` como uma string de prompt. Por exemplo:

  ```
  export MYSQL_PS1="(\u@\h) [\d]> "
  ```

* *Use uma opção de linha de comando.* Você pode definir a opção `--prompt` na linha de comando para **mysql**. Por exemplo:

  ```
  $> mysql --prompt="(\u@\h) [\d]> "
  (user@host) [database]>
  ```

* *Use um arquivo de opção.* Você pode definir a opção `prompt` no grupo `[mysql]` de qualquer arquivo de opção do MySQL, como `/etc/my.cnf` ou o arquivo `.my.cnf` no seu diretório doméstico. Por exemplo:

  ```
  [mysql]
  prompt=(\\u@\\h) [\\d]>\_
  ```

Neste exemplo, observe que os backslashes estão duplicados. Se você definir o prompt usando a opção `prompt` em um arquivo de opções, é aconselhável duplicar os backslashes ao usar as opções de prompt especiais. Há alguma sobreposição no conjunto de opções de prompt permitidas e no conjunto de sequências de escape especiais que são reconhecidas em arquivos de opções. (As regras para sequências de escape em arquivos de opções estão listadas na Seção 6.2.2.2, “Usando Arquivos de Opções.”) A sobreposição pode causar problemas se você usar backslashes simples. Por exemplo, `\s` é interpretado como um espaço, em vez de como o valor atual de segundos. O exemplo a seguir mostra como definir um prompt dentro de um arquivo de opções para incluir a hora atual no formato `hh:mm:ss>`:

  ```
  [mysql]
  prompt="\\r:\\m:\\s> "
  ```

* *Defina o prompt interativamente.* Você pode alterar o prompt interativamente usando o comando `prompt` (ou `\R`). Por exemplo:

  ```
  mysql> prompt (\u@\h) [\d]>_
  PROMPT set to '(\u@\h) [\d]>_'
  (user@host) [database]>
  (user@host) [database]> prompt
  Returning to default PROMPT of mysql>
  mysql>
  ```

#### 6.5.1.3 Registro do cliente do MySQL

O cliente **mysql** pode realizar esses tipos de registro para declarações executadas interativamente:

* No Unix, o **mysql** escreve as declarações em um arquivo de histórico. Por padrão, esse arquivo é chamado `.mysql_history` no seu diretório doméstico. Para especificar um arquivo diferente, defina o valor da variável de ambiente `MYSQL_HISTFILE`.

* Em todas as plataformas, se a opção `--syslog` for fornecida, o **mysql** escreve as declarações na facilidade de registro do sistema. Em Unix, isso é `syslog`; em Windows, é o Diário de Eventos do Windows. O destino onde as mensagens registradas aparecem é dependente do sistema. Em Linux, o destino é frequentemente o arquivo `/var/log/messages`.

A discussão a seguir descreve características que se aplicam a todos os tipos de registro e fornece informações específicas para cada tipo de registro.

* Como o registro ocorre
* Controle do arquivo de histórico
* Características do registro syslog

##### Como o registro ocorre

Para cada destino de registro habilitado, o registro de declarações ocorre da seguinte forma:

* As declarações são registradas apenas quando executadas interativamente. As declarações são não interativas, por exemplo, quando lidas a partir de um arquivo ou de uma tubulação. É também possível suprimir o registro de declarações usando a opção `--batch` ou `--execute`.

* As declarações são ignoradas e não registradas se corresponderem a qualquer padrão na lista de "ignorar". Esta lista é descrita mais adiante.

* **mysql** registra cada linha de declaração não ignorada e não vazia individualmente.

* Se uma declaração não ignorada abranger várias linhas (excluindo o delimitador final), o **mysql** concatena as linhas para formar a declaração completa, mapeia as novas linhas em espaços e registra o resultado, além de um delimitador.

Consequentemente, uma declaração de entrada que se estende por várias linhas pode ser registrada duas vezes. Considere este exemplo de entrada:

```
mysql> SELECT
    -> 'Today is'
    -> ,
    -> CURDATE()
    -> ;
```

Neste caso, o **mysql** registra as linhas “SELECT”, “'Hoje é'”, “,”, “CURDATE()” e “;” à medida que as lê. Ele também registra a declaração completa, após mapear `SELECT\n'Today is'\n,\nCURDATE()` para `SELECT 'Today is' , CURDATE()`, além de um delimitador. Assim, essas linhas aparecem na saída registrada:

```
SELECT
'Today is'
,
CURDATE()
;
SELECT 'Today is' , CURDATE();
```

O **mysql** ignora, para fins de registro, as declarações que correspondem a qualquer padrão na lista de "ignorar". Por padrão, a lista de padrões é `"*IDENTIFIED*:*PASSWORD*"`, para ignorar declarações que se referem a senhas. A correspondência de padrões não é case-sensitive. Dentro dos padrões, dois caracteres são especiais:

* `?` corresponde a qualquer caracter único.
* `*` corresponde a qualquer sequência de zero ou mais caracteres.

Para especificar padrões adicionais, use a opção `--histignore` ou defina a variável de ambiente `MYSQL_HISTIGNORE`. (Se ambos forem especificados, o valor da opção tem precedência.) O valor deve ser uma lista de um ou mais padrões separados por vírgula, que são anexados à lista de padrões padrão.

Os padrões especificados na linha de comando podem precisar ser citados ou escapados para evitar que o interpretador de comandos os trate de forma especial. Por exemplo, para suprimir o registro para as declarações `UPDATE` e `DELETE`, além das declarações que se referem a senhas, invoque o **mysql** da seguinte forma:

```
mysql --histignore="*UPDATE*:*DELETE*"
```

##### Controlar o arquivo de histórico

O arquivo `.mysql_history` deve ser protegido com um modo de acesso restritivo, pois informações sensíveis podem ser escritas nele, como o texto das instruções SQL que contêm senhas. Veja a Seção 8.1.2.1, “Diretrizes para o Usuário Final sobre Segurança de Senhas”. As declarações no arquivo são acessíveis a partir do cliente **mysql** quando a tecla **seta para cima** é usada para lembrar o histórico. Veja Desabilitar Histórico Interativo.

Se você não quiser manter um arquivo de histórico, primeiro remova `.mysql_history` se ele existir. Em seguida, use uma das seguintes técnicas para impedir que ele seja criado novamente:

* Defina a variável de ambiente `MYSQL_HISTFILE` para `/dev/null`. Para fazer com que essa configuração seja aplicada a cada login, coloque-a em um dos arquivos de inicialização do seu shell.

* Crie `.mysql_history` como um link simbólico para `/dev/null`; isso precisa ser feito apenas uma vez:

  ```
  ln -s /dev/null $HOME/.mysql_history
  ```

##### Características de registro syslog

Se a opção `--syslog` for fornecida, o **mysql** escreve declarações interativas na facilidade de registro do sistema. O registro de mensagens tem as seguintes características.

O registro ocorre no nível de “informação”. Isso corresponde à prioridade `LOG_INFO` para `syslog` no Unix/Linux `syslog` e ao `EVENTLOG_INFORMATION_TYPE` para o Registro de Eventos do Windows. Consulte a documentação do seu sistema para a configuração da sua capacidade de registro.

O tamanho da mensagem é limitado a 1024 bytes.

As mensagens consistem no identificador `MysqlClient` seguido por esses valores:

* `SYSTEM_USER`

O nome do usuário do sistema operacional (nome de login) ou `--` se o usuário for desconhecido.

* `MYSQL_USER`

O nome do usuário do MySQL (especificado com a opção `--user`) ou `--` se o usuário for desconhecido.

* `CONNECTION_ID`:

O identificador de conexão do cliente. Isso é o mesmo que o valor da função `CONNECTION_ID()` dentro da sessão.

* `DB_SERVER`

O servidor host ou `--` se o host for desconhecido.

* `DB`

O banco de dados padrão ou `--` se nenhum banco de dados tiver sido selecionado.

* `QUERY`

O texto da declaração registrada.

Aqui está uma amostra de saída gerada no Linux usando `--syslog`. Essa saída é formatada para melhor legibilidade; cada mensagem registrada na verdade ocupa uma única linha.

```
Mar  7 12:39:25 myhost MysqlClient[20824]:
  SYSTEM_USER:'oscar', MYSQL_USER:'my_oscar', CONNECTION_ID:23,
  DB_SERVER:'127.0.0.1', DB:'--', QUERY:'USE test;'
Mar  7 12:39:28 myhost MysqlClient[20824]:
  SYSTEM_USER:'oscar', MYSQL_USER:'my_oscar', CONNECTION_ID:23,
  DB_SERVER:'127.0.0.1', DB:'test', QUERY:'SHOW TABLES;'
```

#### 6.5.1.4 Ajuda no lado do servidor do cliente do MySQL

```
mysql> help search_string
```

Se você fornecer um argumento para o comando `help`, o **mysql** usa-o como uma string de pesquisa para acessar a ajuda do lado do servidor a partir do conteúdo do Manual de Referência do MySQL. O funcionamento adequado deste comando requer que as tabelas de ajuda no banco de dados `mysql` sejam inicializadas com informações sobre os tópicos de ajuda (consulte Seção 7.1.17, “Suporte de Ajuda do Lado do Servidor”).

Se não houver correspondência para a string de pesquisa, a pesquisa falha:

```
mysql> help me

Nothing found
Please try to run 'help contents' for a list of all accessible topics
```

Use o **conteúdo de ajuda** para ver uma lista das categorias de ajuda:

```
mysql> help contents
You asked for help about help category: "Contents"
For more information, type 'help <item>', where <item> is one of the
following categories:
   Account Management
   Administration
   Data Definition
   Data Manipulation
   Data Types
   Functions
   Functions and Modifiers for Use with GROUP BY
   Geographic Features
   Language Structure
   Plugins
   Storage Engines
   Stored Routines
   Table Maintenance
   Transactions
   Triggers
```

Se a string de busca corresponder a vários itens, o **mysql** exibe uma lista de tópicos correspondentes:

```
mysql> help logs
Many help items for your request exist.
To make a more specific request, please type 'help <item>',
where <item> is one of the following topics:
   SHOW
   SHOW BINARY LOGS
   SHOW ENGINE
   SHOW LOGS
```

Use um tópico como cadeia de pesquisa para ver a entrada de ajuda para esse tópico:

```
mysql> help show binary logs
Name: 'SHOW BINARY LOGS'
Description:
Syntax:
SHOW BINARY LOGS
SHOW MASTER LOGS

Lists the binary log files on the server. This statement is used as
part of the procedure described in [purge-binary-logs], that shows how
to determine which logs can be purged.
```

```
mysql> SHOW BINARY LOGS;
+---------------+-----------+-----------+
| Log_name      | File_size | Encrypted |
+---------------+-----------+-----------+
| binlog.000015 |    724935 | Yes       |
| binlog.000016 |    733481 | Yes       |
+---------------+-----------+-----------+
```

A string de busca pode conter os caracteres de comodinho `%` e `_`. Estes têm o mesmo significado que para operações de correspondência de padrões realizadas com o operador `LIKE`. Por exemplo, `HELP rep%` retorna uma lista de tópicos que começam com `rep`:

```
mysql> HELP rep%
Many help items for your request exist.
To make a more specific request, please type 'help <item>',
where <item> is one of the following
topics:
   REPAIR TABLE
   REPEAT FUNCTION
   REPEAT LOOP
   REPLACE
   REPLACE FUNCTION
```

#### 6.5.1.5 Executando instruções SQL a partir de um arquivo de texto

O cliente **mysql** é tipicamente usado interativamente, assim:

```
mysql db_name
```

No entanto, também é possível colocar suas declarações SQL em um arquivo e, em seguida, dizer ao **mysql** para ler sua entrada desse arquivo. Para fazer isso, crie um arquivo de texto *`text_file`* que contenha as declarações que você deseja executar. Em seguida, invoque o **mysql** como mostrado aqui:

```
mysql db_name < text_file
```

Se você colocar uma declaração `USE db_name` como a primeira declaração no arquivo, não é necessário especificar o nome do banco de dados na linha de comando:

```
mysql < text_file
```

Se você já está executando o **mysql**, pode executar um arquivo de script SQL usando o comando `source` ou o comando `\.`:

```
mysql> source file_name
mysql> \. file_name
```

Às vezes, você pode querer que seu script mostre informações de progresso ao usuário. Para isso, você pode inserir declarações como esta:

```
SELECT '<info_to_display>' AS ' ';
```

A declaração exibida exibe `<info_to_display>`.

Você também pode invocar o **mysql** com a opção `--verbose`, o que faz com que cada declaração seja exibida antes do resultado que ela produz.

O **mysql** ignora os caracteres da marca de ordem de bytes Unicode (BOM) no início dos arquivos de entrada. Anteriormente, ele os lia e os enviava para o servidor, resultando em um erro de sintaxe. A presença de um BOM não faz com que o **mysql** mude seu conjunto de caracteres padrão. Para fazer isso, invoque o **mysql** com uma opção como `--default-character-set=utf8mb4`.

Para mais informações sobre o modo em lote, consulte a Seção 5.5, “Usando o mysql em modo em lote”.

#### 6.5.1.6 Dicas do cliente do MySQL

Esta seção fornece informações sobre técnicas para uso mais eficaz do **mysql** e sobre o comportamento operacional do **mysql**.

* Edição de linha de entrada * Desativação do Histórico Interativo * Suporte a Unicode no Windows * Exibição dos resultados da consulta verticalmente * Uso do modo de atualizações seguras (--safe-updates)") * Desativação do auto-reconexão do mysql * Parser do cliente mysql versus parser do servidor

Edição de linha de entrada

O **mysql** suporta edição de linha de entrada, o que permite modificar a linha de entrada atual no local ou recuperar linhas de entrada anteriores. Por exemplo, as teclas **seta para a esquerda** e **seta para a direita** movem-se horizontalmente dentro da linha de entrada atual, e as teclas **seta para cima** e **seta para baixo** movem-se para cima e para baixo através do conjunto de linhas previamente inseridas. **Backspace** exclui o caractere antes do cursor e, ao digitar novos caracteres, eles são inseridos na posição do cursor. Para inserir a linha, pressione **Enter**.

Em Windows, as sequências de teclas de edição são as mesmas que são suportadas para edição de comandos em janelas de console. Em Unix, as sequências de teclas dependem da biblioteca de entrada usada para construir o **mysql** (por exemplo, a biblioteca `libedit` ou `readline`).

A documentação para as bibliotecas `libedit` e `readline` está disponível online. Para alterar o conjunto de sequências de teclas permitidas por uma biblioteca de entrada específica, defina as vinculações de teclas no arquivo de inicialização da biblioteca. Este é um arquivo no seu diretório doméstico: `.editrc` para `libedit` e `.inputrc` para `readline`.

Por exemplo, em `libedit`, **Control+W** exclui tudo antes da posição atual do cursor e **Control+U** exclui toda a linha. Em `readline`, **Control+W** exclui a palavra antes do cursor e **Control+U** exclui tudo antes da posição atual do cursor. Se o **mysql** foi construído usando `libedit`, um usuário que prefira o comportamento do `readline` para essas duas teclas pode colocar as seguintes linhas no arquivo `.editrc` (criando o arquivo, se necessário):

```
bind "^W" ed-delete-prev-word
bind "^U" vi-kill-line-prev
```

Para ver o conjunto atual de vinculações de teclas, coloque temporariamente uma linha que diga apenas `bind` no final de `.editrc`. O **mysql** exibe as vinculações quando ele começa.

##### Desativando Histórico Interativo

A tecla **seta para cima** permite que você relembre as linhas de entrada das sessões atuais e anteriores. Nos casos em que um console é compartilhado, esse comportamento pode ser inadequado. O **mysql** suporta a desativação do histórico interativo parcialmente ou totalmente, dependendo da plataforma do host.

No Windows, o histórico é armazenado na memória. **Alt+F7** exclui todas as linhas de entrada armazenadas na memória do buffer de histórico atual. Também exclui a lista de números sequenciais na frente das linhas de entrada exibidas com **F7** e recuperadas (por número) com **F9**. Novas linhas de entrada inseridas após pressionar **Alt+F7** repopulam o buffer de histórico atual. A limpeza do buffer não impede o registro no Visualizador de Eventos do Windows, se a opção `--syslog` foi usada para iniciar o **mysql**. A fechamento da janela da consola também limpa o buffer de histórico atual.

Para desativar o histórico interativo no Unix, primeiro exclua o arquivo `.mysql_history`, se ele existir (as entradas anteriores são recuperadas caso contrário). Em seguida, inicie o **mysql** com a opção `--histignore="*"` para ignorar todas as novas linhas de entrada. Para reativar o comportamento de recall (e registro) novamente, reinicie o **mysql** sem a opção.

Se você impedir que o arquivo `.mysql_history` seja criado (veja Controlando o arquivo de histórico) e usar `--histignore="*"` para iniciar o cliente **mysql**, a facilidade de recall interativa do histórico será totalmente desativada. Alternativamente, se você omitir a opção `--histignore`, poderá recuperar as linhas de entrada inseridas durante a sessão atual.

Suporte Unicode no Windows

O Windows fornece APIs baseadas em UTF-16LE para leitura e escrita no console; o cliente **mysql** para o Windows é capaz de usar essas APIs. O instalador do Windows cria um item no menu do MySQL com o nome `MySQL command line client - Unicode`. Esse item invoca o cliente **mysql** com propriedades definidas para se comunicar através do console com o servidor MySQL usando Unicode.

Para aproveitar esse suporte manualmente, execute o **mysql** em um console que use uma fonte Unicode compatível e defina o conjunto de caracteres padrão para um conjunto de caracteres Unicode que seja compatível com a comunicação com o servidor:

1. Abra uma janela de console. 2. Vá às propriedades da janela do console, selecione a aba de fonte e escolha Lucida Console ou outra fonte Unicode compatível. Isso é necessário porque as janelas do console começam, por padrão, usando uma fonte de raster DOS que é inadequada para Unicode.

3. Execute o **mysql.exe** com a opção `--default-character-set=utf8mb4` (ou `utf8mb3`). Esta opção é necessária porque `utf16le` é um dos conjuntos de caracteres que não podem ser usados como conjunto de caracteres do cliente. Veja Conjuntos de caracteres do cliente impermissíveis.

Com essas mudanças, o **mysql** usa as APIs do Windows para se comunicar com o console usando UTF-16LE e se comunicar com o servidor usando UTF-8. (O item do menu mencionado anteriormente define a fonte e o conjunto de caracteres como descrito anteriormente.)

Para evitar esses passos toda vez que você executar o **mysql**, você pode criar um atalho que invoque o **mysql.exe**. O atalho deve definir a fonte do console como Lucida Console ou outra fonte Unicode compatível e passar a opção `--default-character-set=utf8mb4` (ou `utf8mb3`) para o **mysql.exe**.

Como alternativa, crie um atalho que configure apenas a fonte do console e defina o conjunto de caracteres no grupo `[mysql]` do seu arquivo `my.ini`:

```
[mysql]
default-character-set=utf8mb4   # or utf8mb3
```

##### Exibir os resultados da consulta verticalmente

Alguns resultados de consulta são muito mais legíveis quando exibidos verticalmente, em vez do formato usual de tabela horizontal. As consultas podem ser exibidas verticalmente terminando a consulta com \G em vez de um ponto e vírgula. Por exemplo, valores de texto mais longos que incluem novas linhas são frequentemente muito mais fáceis de ler com saída vertical:

```
mysql> SELECT * FROM mails WHERE LENGTH(txt) < 300 LIMIT 300,1\G
*************************** 1. row ***************************
  msg_nro: 3068
     date: 2000-03-01 23:29:50
time_zone: +0200
mail_from: Jones
    reply: jones@example.com
  mail_to: "John Smith" <smith@example.com>
      sbj: UTF-8
      txt: >>>>> "John" == John Smith writes:

John> Hi.  I think this is a good idea.  Is anyone familiar
John> with UTF-8 or Unicode? Otherwise, I'll put this on my
John> TODO list and see what happens.

Yes, please do that.

Regards,
Jones
     file: inbox-jani-1
     hash: 190402944
1 row in set (0.09 sec)
```

##### Usando o Modo de Atualizações Seguras (--safe-updates)

Para iniciantes, uma opção de inicialização útil é `--safe-updates` (ou `--i-am-a-dummy`, que tem o mesmo efeito). O modo de atualizações seguras é útil para casos em que você pode ter emitido uma declaração `UPDATE` ou `DELETE`, mas esqueceu a cláusula `WHERE` que indica quais linhas devem ser modificadas. Normalmente, tais declarações atualizam ou excluem todas as linhas da tabela. Com `--safe-updates`, você pode modificar linhas apenas especificando os valores da chave que as identificam, ou uma cláusula `LIMIT`, ou ambas. Isso ajuda a evitar acidentes. O modo de atualizações seguras também restringe declarações `SELECT` que produzem (ou são estimadas para produzir) conjuntos de resultados muito grandes.

A opção `--safe-updates` faz com que o **mysql** execute a seguinte instrução quando se conecta ao servidor MySQL, para definir os valores da sessão das variáveis de sistema `sql_safe_updates`, `sql_select_limit` e `max_join_size`:

```
SET sql_safe_updates=1, sql_select_limit=1000, max_join_size=1000000;
```

A declaração `SET` afeta o processamento de declarações da seguinte forma:

* Habilitar `sql_safe_updates` faz com que as declarações `UPDATE` e `DELETE` gerem um erro se elas não especificar uma restrição de chave na cláusula `WHERE`, ou fornecerem uma cláusula `LIMIT`, ou ambas. Por exemplo:

  ```
  UPDATE tbl_name SET not_key_column=val WHERE key_column=val;

  UPDATE tbl_name SET not_key_column=val LIMIT 1;
  ```

* Definindo `sql_select_limit` para 1.000, o servidor limita todos os conjuntos de resultados `SELECT` a 1.000 linhas, a menos que a declaração inclua uma cláusula `LIMIT`.

* Definindo `max_join_size` para 1.000.000, as declarações de múltiplas tabelas `SELECT` geram um erro se o servidor estimar que deve examinar mais de 1.000.000 de combinações de linhas.

Para especificar limites de conjunto de resultados diferentes de 1.000 e 1.000.000, você pode substituir os valores padrão usando as opções `--select-limit` e `--max-join-size` ao invocar o **mysql**:

```
mysql --safe-updates --select-limit=500 --max-join-size=10000
```

É possível que as declarações `UPDATE` e `DELETE` produzam um erro no modo de atualizações seguras, mesmo com uma chave especificada na cláusula `WHERE`, se o otimizador decidir não usar o índice na coluna da chave:

* O acesso à faixa no índice não pode ser usado se o uso de memória exceder o permitido pela variável de sistema `range_optimizer_max_mem_size`. O otimizador, então, volta a um varrimento de tabela. Veja Limitar o uso de memória para otimização de faixa.

* Se as comparações principais requerem conversão de tipo, o índice pode não ser usado (consulte a Seção 10.3.1, “Como o MySQL usa índices”). Suponha que uma coluna de string indexada `c1` seja comparada a um valor numérico usando `WHERE c1 = 2222`. Para tais comparações, o valor da string é convertido em um número e os operandos são comparados numericamente (consulte a Seção 14.3, “Conversão de tipo na avaliação da expressão”), impedindo o uso do índice. Se o modo de atualizações seguras estiver habilitado, ocorre um erro.

A partir do MySQL 8.0.13, o modo safe-updates também inclui esses comportamentos:

* As declarações `EXPLAIN` com `UPDATE` e `DELETE` não produzem erros de atualização segura. Isso permite o uso de `EXPLAIN` mais `SHOW WARNINGS` para ver por que um índice não é usado, o que pode ser útil em casos como quando ocorre uma violação `range_optimizer_max_mem_size` ou conversão de tipo e o otimizador não usa um índice, mesmo que uma coluna chave tenha sido especificada na cláusula `WHERE`.

* Quando ocorre um erro de atualizações de segurança, a mensagem de erro inclui o primeiro diagnóstico que foi produzido, para fornecer informações sobre o motivo do erro. Por exemplo, a mensagem pode indicar que o valor `range_optimizer_max_mem_size` foi excedido ou ocorreu uma conversão de tipo, o que pode impedir o uso de um índice.

* Para apagamentos e atualizações em várias tabelas, um erro é gerado com atualizações seguras habilitadas apenas se qualquer tabela de destino usar uma varredura de tabela.

##### Desabilitar o Auto-Reconexão do mysql

Se o cliente **mysql** perder sua conexão com o servidor enquanto envia uma declaração, ele imediatamente e automaticamente tenta reconectar-se ao servidor e enviar a declaração novamente. No entanto, mesmo que o **mysql** tenha sucesso na reconexão, sua primeira conexão terminou e todos os objetos e configurações da sua sessão anterior são perdidos: tabelas temporárias, o modo de autocommit e as variáveis definidas pelo usuário e de sessão. Além disso, qualquer transação atual é revertida. Esse comportamento pode ser perigoso para você, como no exemplo seguinte, onde o servidor foi desligado e reiniciado entre a primeira e a segunda declarações sem que você soubesse:

```
mysql> SET @a=1;
Query OK, 0 rows affected (0.05 sec)

mysql> INSERT INTO t VALUES(@a);
ERROR 2006: MySQL server has gone away
No connection. Trying to reconnect...
Connection id:    1
Current database: test

Query OK, 1 row affected (1.30 sec)

mysql> SELECT * FROM t;
+------+
| a    |
+------+
| NULL |
+------+
1 row in set (0.05 sec)
```

A variável de usuário `@a` foi perdida com a conexão e, após a reconexão, ela está indefinida. Se é importante que o **mysql** termine com um erro se a conexão tiver sido perdida, você pode iniciar o cliente **mysql** com a opção `--skip-reconnect`.

Para mais informações sobre a auto-reconexão e seu efeito sobre as informações de estado quando ocorre uma reconexão, consulte o Controle Automático de Reconexão.

##### Parser do cliente MySQL versus Parser do servidor

O cliente **mysql** utiliza um analisador no lado do cliente que não é um duplicado do analisador completo utilizado pelo servidor **mysqld** no lado do servidor. Isso pode levar a diferenças no tratamento de certas construções. Exemplos:

* O analisador de servidor trata as cadeias delimitadas por caracteres `"` como identificadores, em vez de como cadeias simples, se o modo SQL `ANSI_QUOTES` estiver habilitado.

O analisador de cliente **mysql** não leva em conta o modo SQL `ANSI_QUOTES`. Ele trata as strings delimitadas por `"`, `'` e `` ` ANSI_QUOTES` quando a opção é habilitada.

* Nos comentários de `/*! ... */` e `/*+ ... */`, o analisador de clientes **mysql** interpreta comandos de formato curto **mysql**. O analisador do servidor não os interpreta, pois esses comandos não têm significado no lado do servidor.

Se for desejável que o **mysql** não interprete comandos de curta forma dentro dos comentários, uma solução parcial é usar a opção `--binary-mode`, que faz com que todos os comandos do **mysql** sejam desativados, exceto `\C` e `\d` no modo não interativo (para entrada canalizada para o **mysql** ou carregada usando o comando `source`).

### 6.5.2 mysqladmin — Um programa de administração do servidor MySQL

**mysqladmin** é um cliente para realizar operações administrativas. Você pode usá-lo para verificar a configuração do servidor e o status atual, criar e descartar bancos de dados, entre outros.

Invoque o **mysqladmin** da seguinte forma:

```
mysqladmin [options] command [command-arg] [command [command-arg]] ...
```

O **mysqladmin** suporta os seguintes comandos. Alguns dos comandos exigem um argumento após o nome do comando.

* `create db_name`

Crie um novo banco de dados chamado *`db_name`*.

* `debug`

Antes do MySQL 8.0.20, informe ao servidor para escrever informações de depuração no log de erro. O usuário conectado deve ter o privilégio `SUPER`. O formato e o conteúdo dessas informações estão sujeitos a alterações.

Isso inclui informações sobre o Agendamento de Eventos. Veja a Seção 27.4.5, “Status do Agendamento de Eventos”.

* `drop db_name`

Exclua o banco de dados denominado *`db_name`* e todas as suas tabelas.

* `extended-status`

Exiba as variáveis de status do servidor e seus valores.

* `flush-hosts`

Limpe todas as informações no cache do host. Veja a Seção 7.1.12.3, “Consultas de DNS e o cache do host”.

* `flush-logs [log_type ...]`

Limpe todos os registros.

O comando **mysqladmin flush-logs** permite que tipos de log opcionais sejam fornecidos, para especificar quais logs devem ser esvaziados. Seguindo o comando `flush-logs`, você pode fornecer uma lista de um ou mais dos seguintes tipos de log, separados por espaço: `binary`, `engine`, `error`, `general`, `relay`, `slow`. Esses correspondem aos tipos de log que podem ser especificados para a declaração SQL [`FLUSH LOGS`(flush.html#flush-logs)].

* `flush-privileges`

Recarregue as tabelas de subsídios (mesma que `reload`).

* `flush-status`

Variáveis de status claras.

* `flush-tables`

Limpe todas as tabelas.

* `flush-threads`

Limpe o cache do fio.

* `kill id,id,...`

Mate os threads do servidor. Se vários valores de ID de thread forem fornecidos, não deve haver espaços na lista.

Para matar os threads pertencentes a outros usuários, o usuário conectado deve ter o privilégio `CONNECTION_ADMIN` (ou o privilégio descontinuado `SUPER`).

* `password new_password`

Defina uma nova senha. Isso altera a senha para *`new_password`* para a conta que você usa com **mysqladmin** para se conectar ao servidor. Assim, da próxima vez que você invocar **mysqladmin** (ou qualquer outro programa cliente) usando a mesma conta, você deve especificar a nova senha.

Aviso

Definir uma senha usando **mysqladmin** deve ser considerado *inseguro*. Em alguns sistemas, sua senha se torna visível para programas de status do sistema, como o **ps**, que podem ser invocados por outros usuários para exibir linhas de comando. Os clientes MySQL geralmente sobrescrevem o argumento da senha de linha de comando durante sua sequência de inicialização. No entanto, ainda há um breve intervalo durante o qual o valor é visível. Além disso, em alguns sistemas, essa estratégia de sobrescrita é ineficaz e a senha permanece visível para o **ps**. (Sistemas Unix SystemV e talvez outros estão sujeitos a esse problema.)

Se o valor *`new_password`* contiver espaços ou outros caracteres especiais para o seu interpretador de comandos, você precisa colocá-lo entre aspas. Em Windows, certifique-se de usar aspas duplas em vez de aspas simples; as aspas simples não são removidas da senha, mas sim interpretadas como parte da senha. Por exemplo:

  ```
  mysqladmin password "my new password"
  ```

A nova senha pode ser omitida após o comando `password`. Neste caso, o **mysqladmin** solicita o valor da senha, o que permite evitar a especificação da senha na linha de comando. O omitir o valor da senha deve ser feito apenas se `password` for o último comando na linha de comando do **mysqladmin**. Caso contrário, o próximo argumento é considerado como senha.

Cuidado

Não use este comando se o servidor foi iniciado com a opção `--skip-grant-tables`. Não há alteração de senha aplicada. Isso é verdade mesmo se você preceder o comando `password` com `flush-privileges` na mesma linha de comando para reativar as tabelas de concessão, porque a operação de varredura ocorre após a conexão. No entanto, você pode usar **mysqladmin flush-privileges** para reativar as tabelas de concessão e, em seguida, usar um comando separado **mysqladmin password** para alterar a senha.

* `ping`

Verifique se o servidor está disponível. O status de retorno do **mysqladmin** é 0 se o servidor estiver em execução, 1 se não estiver. Isso é 0 mesmo em caso de um erro como `Access denied`, porque isso significa que o servidor está em execução, mas recusou a conexão, o que é diferente do servidor não estar em execução.

* `processlist`

Mostre uma lista de threads de servidor ativo. Isso é como a saída da declaração `SHOW PROCESSLIST`(show-processlist.html "15.7.7.29 SHOW PROCESSLIST Statement"). Se a opção `--verbose` for dada, a saída é como a de `SHOW FULL PROCESSLIST`(show-processlist.html "15.7.7.29 SHOW PROCESSLIST Statement"). (Veja a Seção 15.7.7.29, “Declaração SHOW PROCESSLIST”.)

* `reload`

Recarregue as tabelas de subsídios.

* `refresh`

Limpe todas as tabelas e feche e abra os arquivos de registro.

* `shutdown`

Pare o servidor.

* `start-replica`

Comece a replicação em um servidor replica. Use este comando a partir do MySQL 8.0.26.

* `start-slave`

Comece a replicação em um servidor replica. Use este comando antes do MySQL 8.0.26.

* `status`

Exibir uma breve mensagem de status do servidor.

* `stop-replica`

Parar a replicação em um servidor de replicação. Use este comando a partir do MySQL 8.0.26.

* `stop-slave`

Pare a replicação em um servidor de replicação. Use este comando antes do MySQL 8.0.26.

* `variables`

Exiba as variáveis do sistema do servidor e seus valores.

* `version`

Exibir informações da versão do servidor.

Todos os comandos podem ser abreviados para qualquer prefixo único. Por exemplo:

```
$> mysqladmin proc stat
+----+-------+-----------+----+---------+------+-------+------------------+
| Id | User  | Host      | db | Command | Time | State | Info             |
+----+-------+-----------+----+---------+------+-------+------------------+
| 51 | jones | localhost |    | Query   | 0    |       | show processlist |
+----+-------+-----------+----+---------+------+-------+------------------+
Uptime: 1473624  Threads: 1  Questions: 39487
Slow queries: 0  Opens: 541  Flush tables: 1
Open tables: 19  Queries per second avg: 0.0268
```

O resultado do comando **mysqladmin status** exibe os seguintes valores:

* `Uptime`

O número de segundos que o servidor MySQL está em execução.

* `Threads`

O número de threads ativas (clientes).

* `Questions`

O número de perguntas (consultas) dos clientes desde que o servidor foi iniciado.

* `Slow queries`

O número de consultas que levaram mais de `long_query_time` segundos. Veja a Seção 7.4.5, “O Log de Consulta Lenta”.

* `Opens`

O número de tabelas que o servidor abriu.

* `Flush tables`

O número de comandos `flush-*`, `refresh` e `reload` que o servidor executou.

* `Open tables`

O número de tabelas que estão abertas atualmente.

Se você executar **mysqladmin shutdown** ao se conectar a um servidor local usando um arquivo de socket Unix, o **mysqladmin** aguarda até que o arquivo de ID de processo do servidor seja removido, para garantir que o servidor tenha sido desligado corretamente.

O **mysqladmin** suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysqladmin]` e `[client]` de um arquivo de opções. Para informações sobre arquivos de opções usados por programas do MySQL, consulte a Seção 6.2.2.2, “Usando arquivos de opções”.

**Tabela 6.13 Opções mysqladmin**

<table frame="box" rules="all" summary="Command-line options available for mysqladmin."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Introduced</th> <th scope="col">Deprecated</th> </tr></thead><tbody><tr><th scope="row">--bind-address</th> <td>Use a interface de rede especificada para se conectar ao servidor MySQL</td> <td></td> <td></td> </tr><tr><th scope="row">--character-sets-dir</th> <td>Diretório onde os conjuntos de caracteres podem ser encontrados</td> <td></td> <td></td> </tr><tr><th scope="row">--compress</th> <td>Compressar todas as informações enviadas entre o cliente e o servidor</td> <td></td> <td>8.0.18</td> </tr><tr><th scope="row">--compression-algorithms</th> <td>Algoritmos de compressão permitidos para conexões ao servidor</td> <td>8.0.18</td> <td></td> </tr><tr><th scope="row">--connect-timeout</th> <td>Número de segundos antes do tempo limite de conexão</td> <td></td> <td></td> </tr><tr><th scope="row">--count</th> <td>Número de iterações para realizar a execução repetida do comando</td> <td></td> <td></td> </tr><tr><th scope="row">--debug</th> <td>Write debugging log</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-check</th> <td>Imprimir informações de depuração quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-info</th> <td>Imprimir informações de depuração, memória e estatísticas de CPU quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row">--default-auth</th> <td>Plugin de autenticação a ser utilizado</td> <td></td> <td></td> </tr><tr><th scope="row">--default-character-set</th> <td>Especificar o conjunto de caracteres padrão</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-extra-file</th> <td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-file</th> <td>Arquivo de opção de leitura apenas nomeado</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-group-suffix</th> <td>Valor do sufixo do grupo de opções</td> <td></td> <td></td> </tr><tr><th scope="row">--enable-cleartext-plugin</th> <td>Habilitar o plugin de autenticação de texto claro</td> <td></td> <td></td> </tr><tr><th scope="row">--force</th> <td>Continue mesmo que ocorra um erro SQL</td> <td></td> <td></td> </tr><tr><th scope="row">--get-server-public-key</th> <td>Solicitar chave pública RSA do servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--help</th> <td>Exibir mensagem de ajuda e sair</td> <td></td> <td></td> </tr><tr><th scope="row">--host</th> <td>Anfitrião no qual o servidor MySQL está localizado</td> <td></td> <td></td> </tr><tr><th scope="row">--login-path</th> <td>Leia as opções de caminho de login a partir de .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th scope="row">--no-beep</th> <td>Não emita um sinal sonoro quando ocorrerem erros</td> <td></td> <td></td> </tr><tr><th scope="row">--no-defaults</th> <td>Não leia arquivos de opção</td> <td></td> <td></td> </tr><tr><th scope="row">--password</th> <td>Senha para usar ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--password1</th> <td>Primeira senha de autenticação multifatorial a usar ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password2</th> <td>Segunda senha de autenticação multifatorial a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password3</th> <td>Terceira senha de autenticação multifatorial a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--pipe</th> <td>Conecte-se ao servidor usando um tubo nomeado (apenas Windows)</td> <td></td> <td></td> </tr><tr><th scope="row">--plugin-dir</th> <td>Diretório onde os plugins são instalados</td> <td></td> <td></td> </tr><tr><th scope="row">--port</th> <td>TCP/IP port number for connection</td> <td></td> <td></td> </tr><tr><th scope="row">--print-defaults</th> <td>Print default options</td> <td></td> <td></td> </tr><tr><th scope="row">--protocol</th> <td>Protocolo de transporte a ser utilizado</td> <td></td> <td></td> </tr><tr><th scope="row">--relative</th> <td>Mostre a diferença entre os valores atuais e anteriores quando usado com a opção --sleep</td> <td></td> <td></td> </tr><tr><th scope="row">--server-public-key-path</th> <td>Nome do caminho para o arquivo que contém a chave pública RSA</td> <td></td> <td></td> </tr><tr><th scope="row">--shared-memory-base-name</th> <td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td> <td></td> <td></td> </tr><tr><th scope="row">--show-warnings</th> <td>Mostrar avisos após a execução da declaração</td> <td></td> <td></td> </tr><tr><th scope="row">--shutdown-timeout</th> <td>Número máximo de segundos para esperar o desligamento do servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--silent</th> <td>Silent mode</td> <td></td> <td></td> </tr><tr><th scope="row">--sleep</th> <td>Execute comandos repetidamente, dormindo por segundos de atraso entre eles</td> <td></td> <td></td> </tr><tr><th scope="row">--socket</th> <td>Arquivo de socket Unix ou tubo nomeado do Windows a ser usado</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-ca</th> <td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-capath</th> <td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cert</th> <td>Arquivo que contém o certificado X.509</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cipher</th> <td>Cifras permitidas para criptografia de conexão</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crl</th> <td>Arquivo que contém listas de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crlpath</th> <td>Diretório que contém arquivos de lista de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-fips-mode</th> <td>Se deve habilitar o modo FIPS no lado do cliente</td> <td></td> <td>8.0.34</td> </tr><tr><th scope="row">--ssl-key</th> <td>Arquivo que contém a chave X.509</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-mode</th> <td>Estado de segurança desejado da conexão com o servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-session-data</th> <td>Arquivo que contém dados da sessão SSL</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--ssl-session-data-continue-on-failed-reuse</th> <td>Se estabelecer conexões se a reutilização da sessão falhar</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--tls-ciphersuites</th> <td>Cifras TLSv1.3 permitidas para conexões criptografadas</td> <td>8.0.16</td> <td></td> </tr><tr><th scope="row">--tls-version</th> <td>Protocolos TLS permitidos para conexões criptografadas</td> <td></td> <td></td> </tr><tr><th scope="row">--user</th> <td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--verbose</th> <td>Verbose mode</td> <td></td> <td></td> </tr><tr><th scope="row">--version</th> <td>Exibir informações da versão e sair</td> <td></td> <td></td> </tr><tr><th scope="row">--vertical</th> <td>Imprimir linhas de saída de consulta verticalmente (uma linha por valor de coluna)</td> <td></td> <td></td> </tr><tr><th scope="row">--wait</th> <td>Se a conexão não puder ser estabelecida, espere e tente novamente em vez de abortar</td> <td></td> <td></td> </tr><tr><th scope="row">--zstd-compression-level</th> <td>Nível de compressão para conexões ao servidor que utilizam compressão zstd</td> <td>8.0.18</td> <td></td> </tr></tbody></table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Exibir uma mensagem de ajuda e sair.

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

Em um computador com várias interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao servidor MySQL.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

O diretório onde os conjuntos de caracteres são instalados. Veja a Seção 12.15, “Configuração de Conjunto de Caracteres”.

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

Compressa todas as informações enviadas entre o cliente e o servidor, se possível. Veja a Seção 6.2.8, “Controle de Compressão de Conexão”.

A partir do MySQL 8.0.18, essa opção é desatualizada. A espera é que ela seja removida em uma versão futura do MySQL. Veja Configurando Compressão de Conexão Legada.

* `--compression-algorithms=value`

  <table frame="box" rules="all" summary="Properties for compression-algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compression-algorithms=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>uncompressed</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>zlib</code></p><p class="valid-value"><code>zstd</code></p><p class="valid-value"><code>uncompressed</code></p></td> </tr></tbody></table>

Os algoritmos de compressão permitidos para conexões ao servidor. Os algoritmos disponíveis são os mesmos que para a variável de sistema `protocol_compression_algorithms`. O valor padrão é `uncompressed`.

Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

Essa opção foi adicionada no MySQL 8.0.18.

* `--connect-timeout=value`

  <table frame="box" rules="all" summary="Properties for connect-timeout"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-timeout=value</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>43200</code></td> </tr></tbody></table>

O número máximo de segundos antes do tempo limite de conexão. O valor padrão é 43200 (12 horas).

* `--count=N`, `-c N`

  <table frame="box" rules="all" summary="Properties for count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--count=#</code></td> </tr></tbody></table>

O número de iterações para realizar a execução repetida do comando se a opção `--sleep` for fornecida.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Properties for debug"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug[=debug_options]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>d:t:o,/tmp/mysqladmin.trace</code></td> </tr></tbody></table>

Escreva um registro de depuração. Uma string típica *`debug_options`* é `d:t:o,file_name`. O padrão é `d:t:o,/tmp/mysqladmin.trace`.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--debug-check`

  <table frame="box" rules="all" summary="Properties for debug-check"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug-check</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

Imprima algumas informações de depuração quando o programa sair.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--debug-info`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>0

Imprimir informações de depuração e estatísticas de uso de memória e CPU quando o programa sai.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>1

Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Veja a Seção 8.2.17, “Autenticação substituível”.

* `--default-character-set=charset_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>2

Use *`charset_name`* como o conjunto de caracteres padrão. Veja a Seção 12.15, “Configuração do Conjunto de Caracteres”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>3

Leia este arquivo de opção após o arquivo de opção global, mas (em Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>4

Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Exceção: Mesmo com `--defaults-file`, os programas de cliente leem `.mylogin.cnf`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>5

Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, **mysqladmin** normalmente lê os grupos `[client]` e `[mysqladmin]`. Se esta opção for dada como `--defaults-group-suffix=_other`, **mysqladmin** também lê os grupos `[client_other]` e `[mysqladmin_other]`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>6

Ative o plugin de autenticação de texto claro `mysql_clear_password`. (Veja a Seção 8.4.1.4, “Autenticação de Texto Claro Plugável do Lado do Cliente”).

* `--force`, `-f`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>7

Não peça confirmação para o comando `drop db_name`. Com vários comandos, continue mesmo que ocorra um erro.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>8

Solicitar a chave pública necessária para a troca de senha baseada em par de chaves RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

Para informações sobre o plugin `caching_sha2_password`, consulte a Seção 8.4.1.2, “Cacheamento de Autenticação SHA-2 Pluggable”.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>9

Conecte-se ao servidor MySQL no host fornecido.

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>0

Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam para qual servidor MySQL se conectar e qual conta se autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql_config_editor**. Veja a Seção 6.6.7, “mysql_config_editor — Utilitário de Configuração MySQL”.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--no-beep`, `-b`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>1

Suprima o sinal sonoro de alerta que é emitido por padrão para erros, como falha na conexão com o servidor.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>2

Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para impedir que elas sejam lidas.

A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar o `.mylogin.cnf`, use o utilitário **mysql_config_editor**. Veja a Seção 6.6.7, “mysql_config_editor — Ferramenta de Configuração do MySQL”.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>3

A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecida, o **mysqladmin** solicitará uma senha. Se for fornecida, não deve haver *espaço* entre `--password=` ou `-p` e a senha que a segue. Se não for especificado nenhum tipo de opção de senha, o padrão é não enviar senha.

Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Veja a Seção 8.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

Para especificar explicitamente que não há senha e que o **mysqladmin** não deve solicitar uma senha, use a opção `--skip-password`.

* `--password1[=pass_val]`

A senha para o fator de autenticação multifatorial 1 da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysql** solicitará uma senha. Se for fornecida, não deve haver **espaço** entre `--password1=` e a senha que a segue. Se não for especificado nenhuma opção de senha, o padrão é não enviar senha.

Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Veja a Seção 8.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

Para especificar explicitamente que não há senha e que o **mysqladmin** não deve solicitar uma senha, use a opção `--skip-password1`.

`--password1` e `--password` são sinônimos, assim como `--skip-password1` e `--skip-password`.

* `--password2[=pass_val]`

A senha para o fator de autenticação multifatorial 2 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica para `--password1`; consulte a descrição dessa opção para obter detalhes.

* `--password3[=pass_val]`

A senha para o fator de autenticação multifatorial 3 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica para `--password1`; consulte a descrição dessa opção para obter detalhes.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>4

Em Windows, conecte-se ao servidor usando um tubo nomeado. Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por tubo nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>5

O diretório onde procurar plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o **mysqladmin** não o encontrar. Veja a Seção 8.2.17, “Autenticação Conectada”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>6

Para conexões TCP/IP, o número de porta a ser utilizado.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>7

Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>8

O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de outro protocolo que não o desejado. Para obter detalhes sobre os valores permitidos, consulte a Seção 6.2.7, “Protocolos de Transporte de Conexão”.

* `--relative`, `-r`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>9

Mostre a diferença entre os valores atuais e anteriores quando usado com a opção `--sleep`. Esta opção só funciona com o comando `extended-status`.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>0

O nome do caminho de um arquivo em formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senha com base em par de chave RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

Para `sha256_password`, esta opção só se aplica se o MySQL foi construído usando OpenSSL.

Para informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 8.4.1.3, “Autenticação substituível SHA-256”, e a Seção 8.4.1.2, “Cache de autenticação substituível SHA-2”.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>1

Em Windows, o nome de memória compartilhada a ser usado para conexões feitas usando memória compartilhada a um servidor local. O valor padrão é [[`MYSQL`]. O nome de memória compartilhada é sensível ao caso.

Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

* `--show-warnings`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>2

Mostrar avisos resultantes da execução de declarações enviadas ao servidor.

* `--shutdown-timeout=value`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>3

O número máximo de segundos para esperar o desligamento do servidor. O valor padrão é 3600 (1 hora).

* `--silent`, `-s`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>4

Saia silenciosamente se não conseguir estabelecer uma conexão com o servidor.

* `--sleep=delay`, `-i delay`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>5

Execute comandos repetidamente, dormindo por *`delay`* segundos entre eles. A opção `--count` determina o número de iterações. Se `--count` não for fornecido, o **mysqladmin** executa comandos indefinidamente até ser interrompido.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>6

Para conexões a `localhost`, o arquivo de socket Unix a ser usado, ou, no Windows, o nome do tubo nomeado a ser usado.

Em Windows, esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de canal nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--ssl*`

As opções que começam com `--ssl` especificam se deve conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Consulte Opções de comando para conexões criptografadas.

* `--ssl-fips-mode={OFF|ON|STRICT}`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>7

Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere de outras opções `--ssl-xxx` porque não é usada para estabelecer conexões criptografadas, mas sim para determinar quais operações criptográficas devem ser permitidas. Veja a Seção 8.8, “Suporte FIPS”.

Esses valores `--ssl-fips-mode` são permitidos:

+ `OFF`: Desabilitar o modo FIPS.  
  + `ON`: Habilitar o modo FIPS.  
  + `STRICT`: Habilitar o modo FIPS "estricto".

Nota

Se o Módulo de Objeto FIPS OpenSSL não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Neste caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente produza um aviso na inicialização e opere no modo não FIPS.

A partir do MySQL 8.0.34, essa opção é desatualizada. A espera é que ela seja removida em uma versão futura do MySQL.

* `--tls-ciphersuites=ciphersuite_list`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>8

As sequências de cifra permitidas para conexões criptografadas que utilizam TLSv1.3. O valor é uma lista de um ou mais nomes de sequência de cifra separados por vírgula. As sequências de cifra que podem ser nomeadas para esta opção dependem da biblioteca SSL utilizada para compilar o MySQL. Para obter detalhes, consulte a Seção 8.3.2, “Protocolos e cifras de conexão criptografada TLS”.

Essa opção foi adicionada no MySQL 8.0.16.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>9

Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolo separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, “Protocolos e cifras TLS de conexão criptografada”.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>0

O nome de usuário da conta MySQL a ser usado para se conectar ao servidor.

Se você estiver usando o plugin `Rewriter` com MySQL 8.0.31 ou posterior, você deve conceder a este usuário o privilégio `SKIP_QUERY_REWRITE`.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>1

Modo detalhado. Imprima mais informações sobre o que o programa faz.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>2

Exibir informações da versão e sair.

* `--vertical`, `-E`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>3

Imprima a saída verticalmente. Isso é semelhante ao `--relative`, mas imprime a saída verticalmente.

* `--wait[=count]`, `-w[count]`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>4

Se a conexão não puder ser estabelecida, espere e tente novamente em vez de abortar. Se um valor *`count`* for fornecido, ele indica o número de vezes para tentar novamente. O padrão é uma vez.

* `--zstd-compression-level=level`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>5

O nível de compressão a ser usado para conexões ao servidor que utilizam o algoritmo de compressão `zstd`. Os níveis permitidos são de 1 a 22, com valores maiores indicando níveis crescentes de compressão. O nível de compressão padrão `zstd` é 3. O ajuste do nível de compressão não afeta as conexões que não utilizam compressão `zstd`.

Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

Essa opção foi adicionada no MySQL 8.0.18.

### 6.5.3 mysqlcheck — Um programa de manutenção de tabela

O cliente **mysqlcheck** realiza a manutenção de tabelas: ele verifica, repara, otimiza ou analisa as tabelas.

Cada tabela é bloqueada e, portanto, indisponível para outras sessões enquanto está sendo processada, embora, para operações de verificação, a tabela seja bloqueada com um bloqueio `READ` apenas (consulte a Seção 15.3.6, “Instruções LOCK TABLES e UNLOCK TABLES”, para mais informações sobre os bloqueios `READ` e `WRITE`). As operações de manutenção de tabela podem ser demoradas, especialmente para tabelas grandes. Se você usar a opção `--databases` ou `--all-databases` para processar todas as tabelas em uma ou mais bancos de dados, uma invocação do **mysqlcheck** pode levar um longo tempo. (Isso também é verdadeiro para o procedimento de atualização do MySQL se ele determinar que a verificação de tabela é necessária, pois processa as tabelas da mesma maneira.)

O **mysqlcheck** deve ser usado quando o servidor **mysqld** estiver em execução, o que significa que você não precisa parar o servidor para realizar a manutenção da tabela.

O **mysqlcheck** utiliza as instruções SQL `CHECK TABLE`, `REPAIR TABLE`, `ANALYZE TABLE` e `OPTIMIZE TABLE` de uma maneira conveniente para o usuário. Ele determina quais instruções devem ser usadas para a operação que você deseja realizar e, em seguida, envia as instruções ao servidor para execução. Para obter detalhes sobre quais motores de armazenamento cada declaração funciona, consulte as descrições dessas declarações na Seção 15.7.3, “Declarações de Manutenção de Tabela”.

Nem todas as engines de armazenamento necessariamente suportam todas as quatro operações de manutenção. Nesses casos, uma mensagem de erro é exibida. Por exemplo, se `test.t` é uma tabela `MEMORY`, uma tentativa de verificá-la produz este resultado:

```
$> mysqlcheck test t
test.t
note     : The storage engine for the table doesn't support check
```

Se o **mysqlcheck** não conseguir reparar uma tabela, consulte a Seção 3.14, “Reestruturação ou reparação de tabelas ou índices”, para estratégias de reparo manual de tabelas. Esse é o caso, por exemplo, das tabelas `InnoDB`, que podem ser verificadas com `CHECK TABLE`, mas não reparadas com `REPAIR TABLE`.

Cuidado

É melhor fazer um backup de uma tabela antes de realizar uma operação de reparo de tabela; em algumas circunstâncias, a operação pode causar perda de dados. As possíveis causas incluem, mas não estão limitadas a, erros do sistema de arquivos.

Existem três maneiras gerais de invocar o **mysqlcheck**:

```
mysqlcheck [options] db_name [tbl_name ...]
mysqlcheck [options] --databases db_name ...
mysqlcheck [options] --all-databases
```

Se você não nomear nenhuma tabela após *`db_name`* ou se você usar a opção `--databases` ou `--all-databases`, os bancos inteiros são verificados.

**mysqlcheck** possui uma característica especial em comparação com outros programas de cliente. O comportamento padrão de verificação de tabelas (`--check`) pode ser alterado renomeando o binário. Se você deseja ter uma ferramenta que repare as tabelas por padrão, basta fazer uma cópia de **mysqlcheck** chamada **mysqlrepair**, ou fazer um link simbólico para **mysqlcheck** chamado **mysqlrepair**. Se você invocar **mysqlrepair**, ele reparará as tabelas.

Os nomes mostrados na tabela a seguir podem ser usados para alterar o comportamento padrão do **mysqlcheck**.

<table summary="Command names that can be used to change mysqlcheck default behavior."><col style="width: 25%"/><col style="width: 75%"/><thead><tr> <th>Command</th> <th>Significado</th> </tr></thead><tbody><tr> <td>mysqlrepair</td> <td>A opção padrão é<code>--repair</code></td> </tr><tr> <td>mysqlanalyze</td> <td>A opção padrão é<code>--analyze</code></td> </tr><tr> <td>mysqloptimize</td> <td>A opção padrão é<code>--optimize</code></td> </tr></tbody></table>

O **mysqlcheck** suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysqlcheck]` e `[client]` de um arquivo de opções. Para informações sobre arquivos de opções usados por programas MySQL, consulte a Seção 6.2.2.2, “Usando arquivos de opções”.

**Tabela 6.14 Opções do mysqlcheck**

<table frame="box" rules="all" summary="Command-line options available for mysqlcheck."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Introduced</th> <th scope="col">Deprecated</th> </tr></thead><tbody><tr><th scope="row">--all-databases</th> <td>Verifique todas as tabelas em todos os bancos de dados</td> <td></td> <td></td> </tr><tr><th scope="row">--all-in-1</th> <td>Execute uma única declaração para cada banco de dados que nomeia todas as tabelas desse banco de dados</td> <td></td> <td></td> </tr><tr><th scope="row">--analyze</th> <td>Analyze the tables</td> <td></td> <td></td> </tr><tr><th scope="row">--auto-repair</th> <td>Se uma tabela verificada estiver corrompida, corrija-a automaticamente</td> <td></td> <td></td> </tr><tr><th scope="row">--bind-address</th> <td>Use a interface de rede especificada para se conectar ao servidor MySQL</td> <td></td> <td></td> </tr><tr><th scope="row">--character-sets-dir</th> <td>Diretório onde os conjuntos de caracteres são instalados</td> <td></td> <td></td> </tr><tr><th scope="row">--check</th> <td>Verifique as tabelas em busca de erros</td> <td></td> <td></td> </tr><tr><th scope="row">--check-only-changed</th> <td>Verifique apenas as tabelas que foram alteradas desde a última verificação</td> <td></td> <td></td> </tr><tr><th scope="row">--check-upgrade</th> <td>Invoque a consulta CHECK TABLE com a opção FOR UPGRADE</td> <td></td> <td></td> </tr><tr><th scope="row">--compress</th> <td>Compressar todas as informações enviadas entre o cliente e o servidor</td> <td></td> <td>8.0.18</td> </tr><tr><th scope="row">--compression-algorithms</th> <td>Algoritmos de compressão permitidos para conexões ao servidor</td> <td>8.0.18</td> <td></td> </tr><tr><th scope="row">--databases</th> <td>Interprete todos os argumentos como nomes de banco de dados</td> <td></td> <td></td> </tr><tr><th scope="row">--debug</th> <td>Write debugging log</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-check</th> <td>Imprimir informações de depuração quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-info</th> <td>Imprimir informações de depuração, memória e estatísticas de CPU quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row">--default-auth</th> <td>Plugin de autenticação a ser utilizado</td> <td></td> <td></td> </tr><tr><th scope="row">--default-character-set</th> <td>Especificar o conjunto de caracteres padrão</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-extra-file</th> <td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-file</th> <td>Arquivo de opção de leitura apenas nomeado</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-group-suffix</th> <td>Valor do sufixo do grupo de opções</td> <td></td> <td></td> </tr><tr><th scope="row">--enable-cleartext-plugin</th> <td>Habilitar o plugin de autenticação de texto claro</td> <td></td> <td></td> </tr><tr><th scope="row">--extended</th> <td>Verifique e conserte mesas</td> <td></td> <td></td> </tr><tr><th scope="row">--fast</th> <td>Verifique apenas as tabelas que não foram fechadas corretamente</td> <td></td> <td></td> </tr><tr><th scope="row">--force</th> <td>Continue mesmo que ocorra um erro SQL</td> <td></td> <td></td> </tr><tr><th scope="row">--get-server-public-key</th> <td>Solicitar chave pública RSA do servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--help</th> <td>Exibir mensagem de ajuda e sair</td> <td></td> <td></td> </tr><tr><th scope="row">--host</th> <td>Anfitrião no qual o servidor MySQL está localizado</td> <td></td> <td></td> </tr><tr><th scope="row">--login-path</th> <td>Leia as opções de caminho de login a partir de .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th scope="row">--medium-check</th> <td>Faça uma verificação que seja mais rápida do que uma operação --extended</td> <td></td> <td></td> </tr><tr><th scope="row">--no-defaults</th> <td>Não leia arquivos de opção</td> <td></td> <td></td> </tr><tr><th scope="row">--optimize</th> <td>Optimize the tables</td> <td></td> <td></td> </tr><tr><th scope="row">--password</th> <td>Senha para usar ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--password1</th> <td>Primeira senha de autenticação multifatorial a usar ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password2</th> <td>Segunda senha de autenticação multifatorial a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password3</th> <td>Terceira senha de autenticação multifatorial a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--pipe</th> <td>Conecte-se ao servidor usando um tubo nomeado (apenas Windows)</td> <td></td> <td></td> </tr><tr><th scope="row">--plugin-dir</th> <td>Diretório onde os plugins são instalados</td> <td></td> <td></td> </tr><tr><th scope="row">--port</th> <td>TCP/IP port number for connection</td> <td></td> <td></td> </tr><tr><th scope="row">--print-defaults</th> <td>Print default options</td> <td></td> <td></td> </tr><tr><th scope="row">--protocol</th> <td>Protocolo de transporte a ser utilizado</td> <td></td> <td></td> </tr><tr><th scope="row">--quick</th> <td>O método mais rápido de verificação</td> <td></td> <td></td> </tr><tr><th scope="row">--repair</th> <td>Realize uma reparação que possa consertar quase tudo, exceto chaves únicas que não são únicas</td> <td></td> <td></td> </tr><tr><th scope="row">--server-public-key-path</th> <td>Nome do caminho para o arquivo que contém a chave pública RSA</td> <td></td> <td></td> </tr><tr><th scope="row">--shared-memory-base-name</th> <td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td> <td></td> <td></td> </tr><tr><th scope="row">--silent</th> <td>Silent mode</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-database</th> <td>Omitar este banco de dados das operações realizadas</td> <td></td> <td></td> </tr><tr><th scope="row">--socket</th> <td>Arquivo de socket Unix ou tubo nomeado do Windows a ser usado</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-ca</th> <td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-capath</th> <td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cert</th> <td>Arquivo que contém o certificado X.509</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cipher</th> <td>Cifras permitidas para criptografia de conexão</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crl</th> <td>Arquivo que contém listas de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crlpath</th> <td>Diretório que contém arquivos de lista de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-fips-mode</th> <td>Se deve habilitar o modo FIPS no lado do cliente</td> <td></td> <td>8.0.34</td> </tr><tr><th scope="row">--ssl-key</th> <td>Arquivo que contém a chave X.509</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-mode</th> <td>Estado de segurança desejado da conexão com o servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-session-data</th> <td>Arquivo que contém dados da sessão SSL</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--ssl-session-data-continue-on-failed-reuse</th> <td>Se estabelecer conexões se a reutilização da sessão falhar</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--tables</th> <td>Supra a opção --databases ou -B</td> <td></td> <td></td> </tr><tr><th scope="row">--tls-ciphersuites</th> <td>Cifras TLSv1.3 permitidas para conexões criptografadas</td> <td>8.0.16</td> <td></td> </tr><tr><th scope="row">--tls-version</th> <td>Protocolos TLS permitidos para conexões criptografadas</td> <td></td> <td></td> </tr><tr><th scope="row">--use-frm</th> <td>Para operações de reparo em tabelas MyISAM</td> <td></td> <td></td> </tr><tr><th scope="row">--user</th> <td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--verbose</th> <td>Verbose mode</td> <td></td> <td></td> </tr><tr><th scope="row">--version</th> <td>Exibir informações da versão e sair</td> <td></td> <td></td> </tr><tr><th scope="row">--write-binlog</th> <td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td> <td></td> <td></td> </tr><tr><th scope="row">--zstd-compression-level</th> <td>Nível de compressão para conexões ao servidor que utilizam compressão zstd</td> <td>8.0.18</td> <td></td> </tr></tbody></table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Exibir uma mensagem de ajuda e sair.

* `--all-databases`, `-A`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>

Verifique todas as tabelas em todos os bancos de dados. Isso é o mesmo que usar a opção `--databases` e nomear todos os bancos de dados na linha de comando, exceto que os bancos de dados `INFORMATION_SCHEMA` e `performance_schema` não são verificados. Eles podem ser verificados explicitamente nomeando-os com a opção `--databases`.

* `--all-in-1`, `-1`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-in-1</code></td> </tr></tbody></table>

Em vez de emitir uma declaração para cada tabela, execute uma única declaração para cada banco de dados que nomeia todas as tabelas desse banco de dados que serão processadas.

* `--analyze`, `-a`

  <table frame="box" rules="all" summary="Properties for analyze"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--analyze</code></td> </tr></tbody></table>

Analise as tabelas.

* `--auto-repair`

  <table frame="box" rules="all" summary="Properties for auto-repair"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-repair</code></td> </tr></tbody></table>

Se uma tabela verificada estiver corrompida, corrija-a automaticamente. Qualquer reparo necessário é feito após todas as tabelas terem sido verificadas.

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

Em um computador com várias interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao servidor MySQL.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

O diretório onde os conjuntos de caracteres são instalados. Veja a Seção 12.15, “Configuração de Conjunto de Caracteres”.

* `--check`, `-c`

  <table frame="box" rules="all" summary="Properties for check"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--check</code></td> </tr></tbody></table>

Verifique as tabelas em busca de erros. Essa é a operação padrão.

* `--check-only-changed`, `-C`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Introduced</th> <th scope="col">Deprecated</th> </tr></thead><tbody><tr><th scope="row">--all-databases</th> <td>Verifique todas as tabelas em todos os bancos de dados</td> <td></td> <td></td> </tr><tr><th scope="row">--all-in-1</th> <td>Execute uma única declaração para cada banco de dados que nomeia todas as tabelas desse banco de dados</td> <td></td> <td></td> </tr><tr><th scope="row">--analyze</th> <td>Analyze the tables</td> <td></td> <td></td> </tr><tr><th scope="row">--auto-repair</th> <td>Se uma tabela verificada estiver corrompida, corrija-a automaticamente</td> <td></td> <td></td> </tr><tr><th scope="row">--bind-address</th> <td>Use a interface de rede especificada para se conectar ao servidor MySQL</td> <td></td> <td></td> </tr><tr><th scope="row">--character-sets-dir</th> <td>Diretório onde os conjuntos de caracteres são instalados</td> <td></td> <td></td> </tr><tr><th scope="row">--check</th> <td>Verifique as tabelas em busca de erros</td> <td></td> <td></td> </tr><tr><th scope="row">--check-only-changed</th> <td>Verifique apenas as tabelas que foram alteradas desde a última verificação</td> <td></td> <td></td> </tr><tr><th scope="row">--check-upgrade</th> <td>Invoque a consulta CHECK TABLE com a opção FOR UPGRADE</td> <td></td> <td></td> </tr><tr><th scope="row">--compress</th> <td>Compressar todas as informações enviadas entre o cliente e o servidor</td> <td></td> <td>8.0.18</td> </tr><tr><th scope="row">--compression-algorithms</th> <td>Algoritmos de compressão permitidos para conexões ao servidor</td> <td>8.0.18</td> <td></td> </tr><tr><th scope="row">--databases</th> <td>Interprete todos os argumentos como nomes de banco de dados</td> <td></td> <td></td> </tr><tr><th scope="row">--debug</th> <td>Write debugging log</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-check</th> <td>Imprimir informações de depuração quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-info</th> <td>Imprimir informações de depuração, memória e estatísticas de CPU quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row">--default-auth</th> <td>Plugin de autenticação a ser utilizado</td> <td></td> <td></td> </tr><tr><th scope="row">--default-character-set</th> <td>Especificar o conjunto de caracteres padrão</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-extra-file</th> <td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-file</th> <td>Arquivo de opção de leitura apenas nomeado</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-group-suffix</th> <td>Valor do sufixo do grupo de opções</td> <td></td> <td></td> </tr><tr><th scope="row">--enable-cleartext-plugin</th> <td>Habilitar o plugin de autenticação de texto claro</td> <td></td> <td></td> </tr><tr><th scope="row">--extended</th> <td>Verifique e conserte mesas</td> <td></td> <td></td> </tr><tr><th scope="row">--fast</th> <td>Verifique apenas as tabelas que não foram fechadas corretamente</td> <td></td> <td></td> </tr><tr><th scope="row">--force</th> <td>Continue mesmo que ocorra um erro SQL</td> <td></td> <td></td> </tr><tr><th scope="row">--get-server-public-key</th> <td>Solicitar chave pública RSA do servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--help</th> <td>Exibir mensagem de ajuda e sair</td> <td></td> <td></td> </tr><tr><th scope="row">--host</th> <td>Anfitrião no qual o servidor MySQL está localizado</td> <td></td> <td></td> </tr><tr><th scope="row">--login-path</th> <td>Leia as opções de caminho de login a partir de .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th scope="row">--medium-check</th> <td>Faça uma verificação que seja mais rápida do que uma operação --extended</td> <td></td> <td></td> </tr><tr><th scope="row">--no-defaults</th> <td>Não leia arquivos de opção</td> <td></td> <td></td> </tr><tr><th scope="row">--optimize</th> <td>Optimize the tables</td> <td></td> <td></td> </tr><tr><th scope="row">--password</th> <td>Senha para usar ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--password1</th> <td>Primeira senha de autenticação multifatorial a usar ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password2</th> <td>Segunda senha de autenticação multifatorial a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password3</th> <td>Terceira senha de autenticação multifatorial a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--pipe</th> <td>Conecte-se ao servidor usando um tubo nomeado (apenas Windows)</td> <td></td> <td></td> </tr><tr><th scope="row">--plugin-dir</th> <td>Diretório onde os plugins são instalados</td> <td></td> <td></td> </tr><tr><th scope="row">--port</th> <td>TCP/IP port number for connection</td> <td></td> <td></td> </tr><tr><th scope="row">--print-defaults</th> <td>Print default options</td> <td></td> <td></td> </tr><tr><th scope="row">--protocol</th> <td>Protocolo de transporte a ser utilizado</td> <td></td> <td></td> </tr><tr><th scope="row">--quick</th> <td>O método mais rápido de verificação</td> <td></td> <td></td> </tr><tr><th scope="row">--repair</th> <td>Realize uma reparação que possa consertar quase tudo, exceto chaves únicas que não são únicas</td> <td></td> <td></td> </tr><tr><th scope="row">--server-public-key-path</th> <td>Nome do caminho para o arquivo que contém a chave pública RSA</td> <td></td> <td></td> </tr><tr><th scope="row">--shared-memory-base-name</th> <td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td> <td></td> <td></td> </tr><tr><th scope="row">--silent</th> <td>Silent mode</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-database</th> <td>Omitar este banco de dados das operações realizadas</td> <td></td> <td></td> </tr><tr><th scope="row">--socket</th> <td>Arquivo de socket Unix ou tubo nomeado do Windows a ser usado</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-ca</th> <td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-capath</th> <td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cert</th> <td>Arquivo que contém o certificado X.509</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cipher</th> <td>Cifras permitidas para criptografia de conexão</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crl</th> <td>Arquivo que contém listas de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crlpath</th> <td>Diretório que contém arquivos de lista de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-fips-mode</th> <td>Se deve habilitar o modo FIPS no lado do cliente</td> <td></td> <td>8.0.34</td> </tr><tr><th scope="row">--ssl-key</th> <td>Arquivo que contém a chave X.509</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-mode</th> <td>Estado de segurança desejado da conexão com o servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-session-data</th> <td>Arquivo que contém dados da sessão SSL</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--ssl-session-data-continue-on-failed-reuse</th> <td>Se estabelecer conexões se a reutilização da sessão falhar</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--tables</th> <td>Supra a opção --databases ou -B</td> <td></td> <td></td> </tr><tr><th scope="row">--tls-ciphersuites</th> <td>Cifras TLSv1.3 permitidas para conexões criptografadas</td> <td>8.0.16</td> <td></td> </tr><tr><th scope="row">--tls-version</th> <td>Protocolos TLS permitidos para conexões criptografadas</td> <td></td> <td></td> </tr><tr><th scope="row">--use-frm</th> <td>Para operações de reparo em tabelas MyISAM</td> <td></td> <td></td> </tr><tr><th scope="row">--user</th> <td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--verbose</th> <td>Verbose mode</td> <td></td> <td></td> </tr><tr><th scope="row">--version</th> <td>Exibir informações da versão e sair</td> <td></td> <td></td> </tr><tr><th scope="row">--write-binlog</th> <td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td> <td></td> <td></td> </tr><tr><th scope="row">--zstd-compression-level</th> <td>Nível de compressão para conexões ao servidor que utilizam compressão zstd</td> <td>8.0.18</td> <td></td> </tr></tbody></table>0

Verifique apenas as tabelas que foram alteradas desde a última verificação ou que não foram fechadas corretamente.

* `--check-upgrade`, `-g`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Introduced</th> <th scope="col">Deprecated</th> </tr></thead><tbody><tr><th scope="row">--all-databases</th> <td>Verifique todas as tabelas em todos os bancos de dados</td> <td></td> <td></td> </tr><tr><th scope="row">--all-in-1</th> <td>Execute uma única declaração para cada banco de dados que nomeia todas as tabelas desse banco de dados</td> <td></td> <td></td> </tr><tr><th scope="row">--analyze</th> <td>Analyze the tables</td> <td></td> <td></td> </tr><tr><th scope="row">--auto-repair</th> <td>Se uma tabela verificada estiver corrompida, corrija-a automaticamente</td> <td></td> <td></td> </tr><tr><th scope="row">--bind-address</th> <td>Use a interface de rede especificada para se conectar ao servidor MySQL</td> <td></td> <td></td> </tr><tr><th scope="row">--character-sets-dir</th> <td>Diretório onde os conjuntos de caracteres são instalados</td> <td></td> <td></td> </tr><tr><th scope="row">--check</th> <td>Verifique as tabelas em busca de erros</td> <td></td> <td></td> </tr><tr><th scope="row">--check-only-changed</th> <td>Verifique apenas as tabelas que foram alteradas desde a última verificação</td> <td></td> <td></td> </tr><tr><th scope="row">--check-upgrade</th> <td>Invoque a consulta CHECK TABLE com a opção FOR UPGRADE</td> <td></td> <td></td> </tr><tr><th scope="row">--compress</th> <td>Compressar todas as informações enviadas entre o cliente e o servidor</td> <td></td> <td>8.0.18</td> </tr><tr><th scope="row">--compression-algorithms</th> <td>Algoritmos de compressão permitidos para conexões ao servidor</td> <td>8.0.18</td> <td></td> </tr><tr><th scope="row">--databases</th> <td>Interprete todos os argumentos como nomes de banco de dados</td> <td></td> <td></td> </tr><tr><th scope="row">--debug</th> <td>Write debugging log</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-check</th> <td>Imprimir informações de depuração quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-info</th> <td>Imprimir informações de depuração, memória e estatísticas de CPU quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row">--default-auth</th> <td>Plugin de autenticação a ser utilizado</td> <td></td> <td></td> </tr><tr><th scope="row">--default-character-set</th> <td>Especificar o conjunto de caracteres padrão</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-extra-file</th> <td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-file</th> <td>Arquivo de opção de leitura apenas nomeado</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-group-suffix</th> <td>Valor do sufixo do grupo de opções</td> <td></td> <td></td> </tr><tr><th scope="row">--enable-cleartext-plugin</th> <td>Habilitar o plugin de autenticação de texto claro</td> <td></td> <td></td> </tr><tr><th scope="row">--extended</th> <td>Verifique e conserte mesas</td> <td></td> <td></td> </tr><tr><th scope="row">--fast</th> <td>Verifique apenas as tabelas que não foram fechadas corretamente</td> <td></td> <td></td> </tr><tr><th scope="row">--force</th> <td>Continue mesmo que ocorra um erro SQL</td> <td></td> <td></td> </tr><tr><th scope="row">--get-server-public-key</th> <td>Solicitar chave pública RSA do servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--help</th> <td>Exibir mensagem de ajuda e sair</td> <td></td> <td></td> </tr><tr><th scope="row">--host</th> <td>Anfitrião no qual o servidor MySQL está localizado</td> <td></td> <td></td> </tr><tr><th scope="row">--login-path</th> <td>Leia as opções de caminho de login a partir de .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th scope="row">--medium-check</th> <td>Faça uma verificação que seja mais rápida do que uma operação --extended</td> <td></td> <td></td> </tr><tr><th scope="row">--no-defaults</th> <td>Não leia arquivos de opção</td> <td></td> <td></td> </tr><tr><th scope="row">--optimize</th> <td>Optimize the tables</td> <td></td> <td></td> </tr><tr><th scope="row">--password</th> <td>Senha para usar ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--password1</th> <td>Primeira senha de autenticação multifatorial a usar ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password2</th> <td>Segunda senha de autenticação multifatorial a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password3</th> <td>Terceira senha de autenticação multifatorial a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--pipe</th> <td>Conecte-se ao servidor usando um tubo nomeado (apenas Windows)</td> <td></td> <td></td> </tr><tr><th scope="row">--plugin-dir</th> <td>Diretório onde os plugins são instalados</td> <td></td> <td></td> </tr><tr><th scope="row">--port</th> <td>TCP/IP port number for connection</td> <td></td> <td></td> </tr><tr><th scope="row">--print-defaults</th> <td>Print default options</td> <td></td> <td></td> </tr><tr><th scope="row">--protocol</th> <td>Protocolo de transporte a ser utilizado</td> <td></td> <td></td> </tr><tr><th scope="row">--quick</th> <td>O método mais rápido de verificação</td> <td></td> <td></td> </tr><tr><th scope="row">--repair</th> <td>Realize uma reparação que possa consertar quase tudo, exceto chaves únicas que não são únicas</td> <td></td> <td></td> </tr><tr><th scope="row">--server-public-key-path</th> <td>Nome do caminho para o arquivo que contém a chave pública RSA</td> <td></td> <td></td> </tr><tr><th scope="row">--shared-memory-base-name</th> <td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td> <td></td> <td></td> </tr><tr><th scope="row">--silent</th> <td>Silent mode</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-database</th> <td>Omitar este banco de dados das operações realizadas</td> <td></td> <td></td> </tr><tr><th scope="row">--socket</th> <td>Arquivo de socket Unix ou tubo nomeado do Windows a ser usado</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-ca</th> <td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-capath</th> <td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cert</th> <td>Arquivo que contém o certificado X.509</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cipher</th> <td>Cifras permitidas para criptografia de conexão</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crl</th> <td>Arquivo que contém listas de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crlpath</th> <td>Diretório que contém arquivos de lista de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-fips-mode</th> <td>Se deve habilitar o modo FIPS no lado do cliente</td> <td></td> <td>8.0.34</td> </tr><tr><th scope="row">--ssl-key</th> <td>Arquivo que contém a chave X.509</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-mode</th> <td>Estado de segurança desejado da conexão com o servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-session-data</th> <td>Arquivo que contém dados da sessão SSL</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--ssl-session-data-continue-on-failed-reuse</th> <td>Se estabelecer conexões se a reutilização da sessão falhar</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--tables</th> <td>Supra a opção --databases ou -B</td> <td></td> <td></td> </tr><tr><th scope="row">--tls-ciphersuites</th> <td>Cifras TLSv1.3 permitidas para conexões criptografadas</td> <td>8.0.16</td> <td></td> </tr><tr><th scope="row">--tls-version</th> <td>Protocolos TLS permitidos para conexões criptografadas</td> <td></td> <td></td> </tr><tr><th scope="row">--use-frm</th> <td>Para operações de reparo em tabelas MyISAM</td> <td></td> <td></td> </tr><tr><th scope="row">--user</th> <td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--verbose</th> <td>Verbose mode</td> <td></td> <td></td> </tr><tr><th scope="row">--version</th> <td>Exibir informações da versão e sair</td> <td></td> <td></td> </tr><tr><th scope="row">--write-binlog</th> <td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td> <td></td> <td></td> </tr><tr><th scope="row">--zstd-compression-level</th> <td>Nível de compressão para conexões ao servidor que utilizam compressão zstd</td> <td>8.0.18</td> <td></td> </tr></tbody></table>1

Invoque `CHECK TABLE` com a opção `FOR UPGRADE` para verificar as tabelas quanto a incompatibilidades com a versão atual do servidor.

* `--compress`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Introduced</th> <th scope="col">Deprecated</th> </tr></thead><tbody><tr><th scope="row">--all-databases</th> <td>Verifique todas as tabelas em todos os bancos de dados</td> <td></td> <td></td> </tr><tr><th scope="row">--all-in-1</th> <td>Execute uma única declaração para cada banco de dados que nomeia todas as tabelas desse banco de dados</td> <td></td> <td></td> </tr><tr><th scope="row">--analyze</th> <td>Analyze the tables</td> <td></td> <td></td> </tr><tr><th scope="row">--auto-repair</th> <td>Se uma tabela verificada estiver corrompida, corrija-a automaticamente</td> <td></td> <td></td> </tr><tr><th scope="row">--bind-address</th> <td>Use a interface de rede especificada para se conectar ao servidor MySQL</td> <td></td> <td></td> </tr><tr><th scope="row">--character-sets-dir</th> <td>Diretório onde os conjuntos de caracteres são instalados</td> <td></td> <td></td> </tr><tr><th scope="row">--check</th> <td>Verifique as tabelas em busca de erros</td> <td></td> <td></td> </tr><tr><th scope="row">--check-only-changed</th> <td>Verifique apenas as tabelas que foram alteradas desde a última verificação</td> <td></td> <td></td> </tr><tr><th scope="row">--check-upgrade</th> <td>Invoque a consulta CHECK TABLE com a opção FOR UPGRADE</td> <td></td> <td></td> </tr><tr><th scope="row">--compress</th> <td>Compressar todas as informações enviadas entre o cliente e o servidor</td> <td></td> <td>8.0.18</td> </tr><tr><th scope="row">--compression-algorithms</th> <td>Algoritmos de compressão permitidos para conexões ao servidor</td> <td>8.0.18</td> <td></td> </tr><tr><th scope="row">--databases</th> <td>Interprete todos os argumentos como nomes de banco de dados</td> <td></td> <td></td> </tr><tr><th scope="row">--debug</th> <td>Write debugging log</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-check</th> <td>Imprimir informações de depuração quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-info</th> <td>Imprimir informações de depuração, memória e estatísticas de CPU quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row">--default-auth</th> <td>Plugin de autenticação a ser utilizado</td> <td></td> <td></td> </tr><tr><th scope="row">--default-character-set</th> <td>Especificar o conjunto de caracteres padrão</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-extra-file</th> <td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-file</th> <td>Arquivo de opção de leitura apenas nomeado</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-group-suffix</th> <td>Valor do sufixo do grupo de opções</td> <td></td> <td></td> </tr><tr><th scope="row">--enable-cleartext-plugin</th> <td>Habilitar o plugin de autenticação de texto claro</td> <td></td> <td></td> </tr><tr><th scope="row">--extended</th> <td>Verifique e conserte mesas</td> <td></td> <td></td> </tr><tr><th scope="row">--fast</th> <td>Verifique apenas as tabelas que não foram fechadas corretamente</td> <td></td> <td></td> </tr><tr><th scope="row">--force</th> <td>Continue mesmo que ocorra um erro SQL</td> <td></td> <td></td> </tr><tr><th scope="row">--get-server-public-key</th> <td>Solicitar chave pública RSA do servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--help</th> <td>Exibir mensagem de ajuda e sair</td> <td></td> <td></td> </tr><tr><th scope="row">--host</th> <td>Anfitrião no qual o servidor MySQL está localizado</td> <td></td> <td></td> </tr><tr><th scope="row">--login-path</th> <td>Leia as opções de caminho de login a partir de .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th scope="row">--medium-check</th> <td>Faça uma verificação que seja mais rápida do que uma operação --extended</td> <td></td> <td></td> </tr><tr><th scope="row">--no-defaults</th> <td>Não leia arquivos de opção</td> <td></td> <td></td> </tr><tr><th scope="row">--optimize</th> <td>Optimize the tables</td> <td></td> <td></td> </tr><tr><th scope="row">--password</th> <td>Senha para usar ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--password1</th> <td>Primeira senha de autenticação multifatorial a usar ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password2</th> <td>Segunda senha de autenticação multifatorial a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password3</th> <td>Terceira senha de autenticação multifatorial a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--pipe</th> <td>Conecte-se ao servidor usando um tubo nomeado (apenas Windows)</td> <td></td> <td></td> </tr><tr><th scope="row">--plugin-dir</th> <td>Diretório onde os plugins são instalados</td> <td></td> <td></td> </tr><tr><th scope="row">--port</th> <td>TCP/IP port number for connection</td> <td></td> <td></td> </tr><tr><th scope="row">--print-defaults</th> <td>Print default options</td> <td></td> <td></td> </tr><tr><th scope="row">--protocol</th> <td>Protocolo de transporte a ser utilizado</td> <td></td> <td></td> </tr><tr><th scope="row">--quick</th> <td>O método mais rápido de verificação</td> <td></td> <td></td> </tr><tr><th scope="row">--repair</th> <td>Realize uma reparação que possa consertar quase tudo, exceto chaves únicas que não são únicas</td> <td></td> <td></td> </tr><tr><th scope="row">--server-public-key-path</th> <td>Nome do caminho para o arquivo que contém a chave pública RSA</td> <td></td> <td></td> </tr><tr><th scope="row">--shared-memory-base-name</th> <td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td> <td></td> <td></td> </tr><tr><th scope="row">--silent</th> <td>Silent mode</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-database</th> <td>Omitar este banco de dados das operações realizadas</td> <td></td> <td></td> </tr><tr><th scope="row">--socket</th> <td>Arquivo de socket Unix ou tubo nomeado do Windows a ser usado</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-ca</th> <td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-capath</th> <td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cert</th> <td>Arquivo que contém o certificado X.509</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cipher</th> <td>Cifras permitidas para criptografia de conexão</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crl</th> <td>Arquivo que contém listas de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crlpath</th> <td>Diretório que contém arquivos de lista de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-fips-mode</th> <td>Se deve habilitar o modo FIPS no lado do cliente</td> <td></td> <td>8.0.34</td> </tr><tr><th scope="row">--ssl-key</th> <td>Arquivo que contém a chave X.509</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-mode</th> <td>Estado de segurança desejado da conexão com o servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-session-data</th> <td>Arquivo que contém dados da sessão SSL</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--ssl-session-data-continue-on-failed-reuse</th> <td>Se estabelecer conexões se a reutilização da sessão falhar</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--tables</th> <td>Supra a opção --databases ou -B</td> <td></td> <td></td> </tr><tr><th scope="row">--tls-ciphersuites</th> <td>Cifras TLSv1.3 permitidas para conexões criptografadas</td> <td>8.0.16</td> <td></td> </tr><tr><th scope="row">--tls-version</th> <td>Protocolos TLS permitidos para conexões criptografadas</td> <td></td> <td></td> </tr><tr><th scope="row">--use-frm</th> <td>Para operações de reparo em tabelas MyISAM</td> <td></td> <td></td> </tr><tr><th scope="row">--user</th> <td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--verbose</th> <td>Verbose mode</td> <td></td> <td></td> </tr><tr><th scope="row">--version</th> <td>Exibir informações da versão e sair</td> <td></td> <td></td> </tr><tr><th scope="row">--write-binlog</th> <td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td> <td></td> <td></td> </tr><tr><th scope="row">--zstd-compression-level</th> <td>Nível de compressão para conexões ao servidor que utilizam compressão zstd</td> <td>8.0.18</td> <td></td> </tr></tbody></table>2

Compressa todas as informações enviadas entre o cliente e o servidor, se possível. Veja a Seção 6.2.8, “Controle de Compressão de Conexão”.

A partir do MySQL 8.0.18, essa opção é desatualizada. A espera é que ela seja removida em uma versão futura do MySQL. Veja Configurando Compressão de Conexão Legada.

* `--compression-algorithms=value`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Introduced</th> <th scope="col">Deprecated</th> </tr></thead><tbody><tr><th scope="row">--all-databases</th> <td>Verifique todas as tabelas em todos os bancos de dados</td> <td></td> <td></td> </tr><tr><th scope="row">--all-in-1</th> <td>Execute uma única declaração para cada banco de dados que nomeia todas as tabelas desse banco de dados</td> <td></td> <td></td> </tr><tr><th scope="row">--analyze</th> <td>Analyze the tables</td> <td></td> <td></td> </tr><tr><th scope="row">--auto-repair</th> <td>Se uma tabela verificada estiver corrompida, corrija-a automaticamente</td> <td></td> <td></td> </tr><tr><th scope="row">--bind-address</th> <td>Use a interface de rede especificada para se conectar ao servidor MySQL</td> <td></td> <td></td> </tr><tr><th scope="row">--character-sets-dir</th> <td>Diretório onde os conjuntos de caracteres são instalados</td> <td></td> <td></td> </tr><tr><th scope="row">--check</th> <td>Verifique as tabelas em busca de erros</td> <td></td> <td></td> </tr><tr><th scope="row">--check-only-changed</th> <td>Verifique apenas as tabelas que foram alteradas desde a última verificação</td> <td></td> <td></td> </tr><tr><th scope="row">--check-upgrade</th> <td>Invoque a consulta CHECK TABLE com a opção FOR UPGRADE</td> <td></td> <td></td> </tr><tr><th scope="row">--compress</th> <td>Compressar todas as informações enviadas entre o cliente e o servidor</td> <td></td> <td>8.0.18</td> </tr><tr><th scope="row">--compression-algorithms</th> <td>Algoritmos de compressão permitidos para conexões ao servidor</td> <td>8.0.18</td> <td></td> </tr><tr><th scope="row">--databases</th> <td>Interprete todos os argumentos como nomes de banco de dados</td> <td></td> <td></td> </tr><tr><th scope="row">--debug</th> <td>Write debugging log</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-check</th> <td>Imprimir informações de depuração quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-info</th> <td>Imprimir informações de depuração, memória e estatísticas de CPU quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row">--default-auth</th> <td>Plugin de autenticação a ser utilizado</td> <td></td> <td></td> </tr><tr><th scope="row">--default-character-set</th> <td>Especificar o conjunto de caracteres padrão</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-extra-file</th> <td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-file</th> <td>Arquivo de opção de leitura apenas nomeado</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-group-suffix</th> <td>Valor do sufixo do grupo de opções</td> <td></td> <td></td> </tr><tr><th scope="row">--enable-cleartext-plugin</th> <td>Habilitar o plugin de autenticação de texto claro</td> <td></td> <td></td> </tr><tr><th scope="row">--extended</th> <td>Verifique e conserte mesas</td> <td></td> <td></td> </tr><tr><th scope="row">--fast</th> <td>Verifique apenas as tabelas que não foram fechadas corretamente</td> <td></td> <td></td> </tr><tr><th scope="row">--force</th> <td>Continue mesmo que ocorra um erro SQL</td> <td></td> <td></td> </tr><tr><th scope="row">--get-server-public-key</th> <td>Solicitar chave pública RSA do servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--help</th> <td>Exibir mensagem de ajuda e sair</td> <td></td> <td></td> </tr><tr><th scope="row">--host</th> <td>Anfitrião no qual o servidor MySQL está localizado</td> <td></td> <td></td> </tr><tr><th scope="row">--login-path</th> <td>Leia as opções de caminho de login a partir de .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th scope="row">--medium-check</th> <td>Faça uma verificação que seja mais rápida do que uma operação --extended</td> <td></td> <td></td> </tr><tr><th scope="row">--no-defaults</th> <td>Não leia arquivos de opção</td> <td></td> <td></td> </tr><tr><th scope="row">--optimize</th> <td>Optimize the tables</td> <td></td> <td></td> </tr><tr><th scope="row">--password</th> <td>Senha para usar ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--password1</th> <td>Primeira senha de autenticação multifatorial a usar ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password2</th> <td>Segunda senha de autenticação multifatorial a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password3</th> <td>Terceira senha de autenticação multifatorial a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--pipe</th> <td>Conecte-se ao servidor usando um tubo nomeado (apenas Windows)</td> <td></td> <td></td> </tr><tr><th scope="row">--plugin-dir</th> <td>Diretório onde os plugins são instalados</td> <td></td> <td></td> </tr><tr><th scope="row">--port</th> <td>TCP/IP port number for connection</td> <td></td> <td></td> </tr><tr><th scope="row">--print-defaults</th> <td>Print default options</td> <td></td> <td></td> </tr><tr><th scope="row">--protocol</th> <td>Protocolo de transporte a ser utilizado</td> <td></td> <td></td> </tr><tr><th scope="row">--quick</th> <td>O método mais rápido de verificação</td> <td></td> <td></td> </tr><tr><th scope="row">--repair</th> <td>Realize uma reparação que possa consertar quase tudo, exceto chaves únicas que não são únicas</td> <td></td> <td></td> </tr><tr><th scope="row">--server-public-key-path</th> <td>Nome do caminho para o arquivo que contém a chave pública RSA</td> <td></td> <td></td> </tr><tr><th scope="row">--shared-memory-base-name</th> <td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td> <td></td> <td></td> </tr><tr><th scope="row">--silent</th> <td>Silent mode</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-database</th> <td>Omitar este banco de dados das operações realizadas</td> <td></td> <td></td> </tr><tr><th scope="row">--socket</th> <td>Arquivo de socket Unix ou tubo nomeado do Windows a ser usado</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-ca</th> <td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-capath</th> <td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cert</th> <td>Arquivo que contém o certificado X.509</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cipher</th> <td>Cifras permitidas para criptografia de conexão</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crl</th> <td>Arquivo que contém listas de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crlpath</th> <td>Diretório que contém arquivos de lista de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-fips-mode</th> <td>Se deve habilitar o modo FIPS no lado do cliente</td> <td></td> <td>8.0.34</td> </tr><tr><th scope="row">--ssl-key</th> <td>Arquivo que contém a chave X.509</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-mode</th> <td>Estado de segurança desejado da conexão com o servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-session-data</th> <td>Arquivo que contém dados da sessão SSL</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--ssl-session-data-continue-on-failed-reuse</th> <td>Se estabelecer conexões se a reutilização da sessão falhar</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--tables</th> <td>Supra a opção --databases ou -B</td> <td></td> <td></td> </tr><tr><th scope="row">--tls-ciphersuites</th> <td>Cifras TLSv1.3 permitidas para conexões criptografadas</td> <td>8.0.16</td> <td></td> </tr><tr><th scope="row">--tls-version</th> <td>Protocolos TLS permitidos para conexões criptografadas</td> <td></td> <td></td> </tr><tr><th scope="row">--use-frm</th> <td>Para operações de reparo em tabelas MyISAM</td> <td></td> <td></td> </tr><tr><th scope="row">--user</th> <td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--verbose</th> <td>Verbose mode</td> <td></td> <td></td> </tr><tr><th scope="row">--version</th> <td>Exibir informações da versão e sair</td> <td></td> <td></td> </tr><tr><th scope="row">--write-binlog</th> <td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td> <td></td> <td></td> </tr><tr><th scope="row">--zstd-compression-level</th> <td>Nível de compressão para conexões ao servidor que utilizam compressão zstd</td> <td>8.0.18</td> <td></td> </tr></tbody></table>3

Os algoritmos de compressão permitidos para conexões ao servidor. Os algoritmos disponíveis são os mesmos que para a variável de sistema `protocol_compression_algorithms`. O valor padrão é `uncompressed`.

Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

Essa opção foi adicionada no MySQL 8.0.18.

* `--databases`, `-B`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Introduced</th> <th scope="col">Deprecated</th> </tr></thead><tbody><tr><th scope="row">--all-databases</th> <td>Verifique todas as tabelas em todos os bancos de dados</td> <td></td> <td></td> </tr><tr><th scope="row">--all-in-1</th> <td>Execute uma única declaração para cada banco de dados que nomeia todas as tabelas desse banco de dados</td> <td></td> <td></td> </tr><tr><th scope="row">--analyze</th> <td>Analyze the tables</td> <td></td> <td></td> </tr><tr><th scope="row">--auto-repair</th> <td>Se uma tabela verificada estiver corrompida, corrija-a automaticamente</td> <td></td> <td></td> </tr><tr><th scope="row">--bind-address</th> <td>Use a interface de rede especificada para se conectar ao servidor MySQL</td> <td></td> <td></td> </tr><tr><th scope="row">--character-sets-dir</th> <td>Diretório onde os conjuntos de caracteres são instalados</td> <td></td> <td></td> </tr><tr><th scope="row">--check</th> <td>Verifique as tabelas em busca de erros</td> <td></td> <td></td> </tr><tr><th scope="row">--check-only-changed</th> <td>Verifique apenas as tabelas que foram alteradas desde a última verificação</td> <td></td> <td></td> </tr><tr><th scope="row">--check-upgrade</th> <td>Invoque a consulta CHECK TABLE com a opção FOR UPGRADE</td> <td></td> <td></td> </tr><tr><th scope="row">--compress</th> <td>Compressar todas as informações enviadas entre o cliente e o servidor</td> <td></td> <td>8.0.18</td> </tr><tr><th scope="row">--compression-algorithms</th> <td>Algoritmos de compressão permitidos para conexões ao servidor</td> <td>8.0.18</td> <td></td> </tr><tr><th scope="row">--databases</th> <td>Interprete todos os argumentos como nomes de banco de dados</td> <td></td> <td></td> </tr><tr><th scope="row">--debug</th> <td>Write debugging log</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-check</th> <td>Imprimir informações de depuração quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-info</th> <td>Imprimir informações de depuração, memória e estatísticas de CPU quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row">--default-auth</th> <td>Plugin de autenticação a ser utilizado</td> <td></td> <td></td> </tr><tr><th scope="row">--default-character-set</th> <td>Especificar o conjunto de caracteres padrão</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-extra-file</th> <td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-file</th> <td>Arquivo de opção de leitura apenas nomeado</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-group-suffix</th> <td>Valor do sufixo do grupo de opções</td> <td></td> <td></td> </tr><tr><th scope="row">--enable-cleartext-plugin</th> <td>Habilitar o plugin de autenticação de texto claro</td> <td></td> <td></td> </tr><tr><th scope="row">--extended</th> <td>Verifique e conserte mesas</td> <td></td> <td></td> </tr><tr><th scope="row">--fast</th> <td>Verifique apenas as tabelas que não foram fechadas corretamente</td> <td></td> <td></td> </tr><tr><th scope="row">--force</th> <td>Continue mesmo que ocorra um erro SQL</td> <td></td> <td></td> </tr><tr><th scope="row">--get-server-public-key</th> <td>Solicitar chave pública RSA do servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--help</th> <td>Exibir mensagem de ajuda e sair</td> <td></td> <td></td> </tr><tr><th scope="row">--host</th> <td>Anfitrião no qual o servidor MySQL está localizado</td> <td></td> <td></td> </tr><tr><th scope="row">--login-path</th> <td>Leia as opções de caminho de login a partir de .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th scope="row">--medium-check</th> <td>Faça uma verificação que seja mais rápida do que uma operação --extended</td> <td></td> <td></td> </tr><tr><th scope="row">--no-defaults</th> <td>Não leia arquivos de opção</td> <td></td> <td></td> </tr><tr><th scope="row">--optimize</th> <td>Optimize the tables</td> <td></td> <td></td> </tr><tr><th scope="row">--password</th> <td>Senha para usar ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--password1</th> <td>Primeira senha de autenticação multifatorial a usar ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password2</th> <td>Segunda senha de autenticação multifatorial a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password3</th> <td>Terceira senha de autenticação multifatorial a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--pipe</th> <td>Conecte-se ao servidor usando um tubo nomeado (apenas Windows)</td> <td></td> <td></td> </tr><tr><th scope="row">--plugin-dir</th> <td>Diretório onde os plugins são instalados</td> <td></td> <td></td> </tr><tr><th scope="row">--port</th> <td>TCP/IP port number for connection</td> <td></td> <td></td> </tr><tr><th scope="row">--print-defaults</th> <td>Print default options</td> <td></td> <td></td> </tr><tr><th scope="row">--protocol</th> <td>Protocolo de transporte a ser utilizado</td> <td></td> <td></td> </tr><tr><th scope="row">--quick</th> <td>O método mais rápido de verificação</td> <td></td> <td></td> </tr><tr><th scope="row">--repair</th> <td>Realize uma reparação que possa consertar quase tudo, exceto chaves únicas que não são únicas</td> <td></td> <td></td> </tr><tr><th scope="row">--server-public-key-path</th> <td>Nome do caminho para o arquivo que contém a chave pública RSA</td> <td></td> <td></td> </tr><tr><th scope="row">--shared-memory-base-name</th> <td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td> <td></td> <td></td> </tr><tr><th scope="row">--silent</th> <td>Silent mode</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-database</th> <td>Omitar este banco de dados das operações realizadas</td> <td></td> <td></td> </tr><tr><th scope="row">--socket</th> <td>Arquivo de socket Unix ou tubo nomeado do Windows a ser usado</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-ca</th> <td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-capath</th> <td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cert</th> <td>Arquivo que contém o certificado X.509</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cipher</th> <td>Cifras permitidas para criptografia de conexão</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crl</th> <td>Arquivo que contém listas de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crlpath</th> <td>Diretório que contém arquivos de lista de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-fips-mode</th> <td>Se deve habilitar o modo FIPS no lado do cliente</td> <td></td> <td>8.0.34</td> </tr><tr><th scope="row">--ssl-key</th> <td>Arquivo que contém a chave X.509</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-mode</th> <td>Estado de segurança desejado da conexão com o servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-session-data</th> <td>Arquivo que contém dados da sessão SSL</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--ssl-session-data-continue-on-failed-reuse</th> <td>Se estabelecer conexões se a reutilização da sessão falhar</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--tables</th> <td>Supra a opção --databases ou -B</td> <td></td> <td></td> </tr><tr><th scope="row">--tls-ciphersuites</th> <td>Cifras TLSv1.3 permitidas para conexões criptografadas</td> <td>8.0.16</td> <td></td> </tr><tr><th scope="row">--tls-version</th> <td>Protocolos TLS permitidos para conexões criptografadas</td> <td></td> <td></td> </tr><tr><th scope="row">--use-frm</th> <td>Para operações de reparo em tabelas MyISAM</td> <td></td> <td></td> </tr><tr><th scope="row">--user</th> <td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--verbose</th> <td>Verbose mode</td> <td></td> <td></td> </tr><tr><th scope="row">--version</th> <td>Exibir informações da versão e sair</td> <td></td> <td></td> </tr><tr><th scope="row">--write-binlog</th> <td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td> <td></td> <td></td> </tr><tr><th scope="row">--zstd-compression-level</th> <td>Nível de compressão para conexões ao servidor que utilizam compressão zstd</td> <td>8.0.18</td> <td></td> </tr></tbody></table>4

Processar todas as tabelas nos bancos de dados nomeados. Normalmente, o **mysqlcheck** trata o argumento de nome no comando de linha como um nome de banco de dados e quaisquer nomes subsequentes como nomes de tabela. Com esta opção, ele trata todos os argumentos de nome como nomes de banco de dados.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Introduced</th> <th scope="col">Deprecated</th> </tr></thead><tbody><tr><th scope="row">--all-databases</th> <td>Verifique todas as tabelas em todos os bancos de dados</td> <td></td> <td></td> </tr><tr><th scope="row">--all-in-1</th> <td>Execute uma única declaração para cada banco de dados que nomeia todas as tabelas desse banco de dados</td> <td></td> <td></td> </tr><tr><th scope="row">--analyze</th> <td>Analyze the tables</td> <td></td> <td></td> </tr><tr><th scope="row">--auto-repair</th> <td>Se uma tabela verificada estiver corrompida, corrija-a automaticamente</td> <td></td> <td></td> </tr><tr><th scope="row">--bind-address</th> <td>Use a interface de rede especificada para se conectar ao servidor MySQL</td> <td></td> <td></td> </tr><tr><th scope="row">--character-sets-dir</th> <td>Diretório onde os conjuntos de caracteres são instalados</td> <td></td> <td></td> </tr><tr><th scope="row">--check</th> <td>Verifique as tabelas em busca de erros</td> <td></td> <td></td> </tr><tr><th scope="row">--check-only-changed</th> <td>Verifique apenas as tabelas que foram alteradas desde a última verificação</td> <td></td> <td></td> </tr><tr><th scope="row">--check-upgrade</th> <td>Invoque a consulta CHECK TABLE com a opção FOR UPGRADE</td> <td></td> <td></td> </tr><tr><th scope="row">--compress</th> <td>Compressar todas as informações enviadas entre o cliente e o servidor</td> <td></td> <td>8.0.18</td> </tr><tr><th scope="row">--compression-algorithms</th> <td>Algoritmos de compressão permitidos para conexões ao servidor</td> <td>8.0.18</td> <td></td> </tr><tr><th scope="row">--databases</th> <td>Interprete todos os argumentos como nomes de banco de dados</td> <td></td> <td></td> </tr><tr><th scope="row">--debug</th> <td>Write debugging log</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-check</th> <td>Imprimir informações de depuração quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-info</th> <td>Imprimir informações de depuração, memória e estatísticas de CPU quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row">--default-auth</th> <td>Plugin de autenticação a ser utilizado</td> <td></td> <td></td> </tr><tr><th scope="row">--default-character-set</th> <td>Especificar o conjunto de caracteres padrão</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-extra-file</th> <td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-file</th> <td>Arquivo de opção de leitura apenas nomeado</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-group-suffix</th> <td>Valor do sufixo do grupo de opções</td> <td></td> <td></td> </tr><tr><th scope="row">--enable-cleartext-plugin</th> <td>Habilitar o plugin de autenticação de texto claro</td> <td></td> <td></td> </tr><tr><th scope="row">--extended</th> <td>Verifique e conserte mesas</td> <td></td> <td></td> </tr><tr><th scope="row">--fast</th> <td>Verifique apenas as tabelas que não foram fechadas corretamente</td> <td></td> <td></td> </tr><tr><th scope="row">--force</th> <td>Continue mesmo que ocorra um erro SQL</td> <td></td> <td></td> </tr><tr><th scope="row">--get-server-public-key</th> <td>Solicitar chave pública RSA do servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--help</th> <td>Exibir mensagem de ajuda e sair</td> <td></td> <td></td> </tr><tr><th scope="row">--host</th> <td>Anfitrião no qual o servidor MySQL está localizado</td> <td></td> <td></td> </tr><tr><th scope="row">--login-path</th> <td>Leia as opções de caminho de login a partir de .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th scope="row">--medium-check</th> <td>Faça uma verificação que seja mais rápida do que uma operação --extended</td> <td></td> <td></td> </tr><tr><th scope="row">--no-defaults</th> <td>Não leia arquivos de opção</td> <td></td> <td></td> </tr><tr><th scope="row">--optimize</th> <td>Optimize the tables</td> <td></td> <td></td> </tr><tr><th scope="row">--password</th> <td>Senha para usar ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--password1</th> <td>Primeira senha de autenticação multifatorial a usar ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password2</th> <td>Segunda senha de autenticação multifatorial a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password3</th> <td>Terceira senha de autenticação multifatorial a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--pipe</th> <td>Conecte-se ao servidor usando um tubo nomeado (apenas Windows)</td> <td></td> <td></td> </tr><tr><th scope="row">--plugin-dir</th> <td>Diretório onde os plugins são instalados</td> <td></td> <td></td> </tr><tr><th scope="row">--port</th> <td>TCP/IP port number for connection</td> <td></td> <td></td> </tr><tr><th scope="row">--print-defaults</th> <td>Print default options</td> <td></td> <td></td> </tr><tr><th scope="row">--protocol</th> <td>Protocolo de transporte a ser utilizado</td> <td></td> <td></td> </tr><tr><th scope="row">--quick</th> <td>O método mais rápido de verificação</td> <td></td> <td></td> </tr><tr><th scope="row">--repair</th> <td>Realize uma reparação que possa consertar quase tudo, exceto chaves únicas que não são únicas</td> <td></td> <td></td> </tr><tr><th scope="row">--server-public-key-path</th> <td>Nome do caminho para o arquivo que contém a chave pública RSA</td> <td></td> <td></td> </tr><tr><th scope="row">--shared-memory-base-name</th> <td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td> <td></td> <td></td> </tr><tr><th scope="row">--silent</th> <td>Silent mode</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-database</th> <td>Omitar este banco de dados das operações realizadas</td> <td></td> <td></td> </tr><tr><th scope="row">--socket</th> <td>Arquivo de socket Unix ou tubo nomeado do Windows a ser usado</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-ca</th> <td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-capath</th> <td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cert</th> <td>Arquivo que contém o certificado X.509</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cipher</th> <td>Cifras permitidas para criptografia de conexão</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crl</th> <td>Arquivo que contém listas de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crlpath</th> <td>Diretório que contém arquivos de lista de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-fips-mode</th> <td>Se deve habilitar o modo FIPS no lado do cliente</td> <td></td> <td>8.0.34</td> </tr><tr><th scope="row">--ssl-key</th> <td>Arquivo que contém a chave X.509</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-mode</th> <td>Estado de segurança desejado da conexão com o servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-session-data</th> <td>Arquivo que contém dados da sessão SSL</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--ssl-session-data-continue-on-failed-reuse</th> <td>Se estabelecer conexões se a reutilização da sessão falhar</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--tables</th> <td>Supra a opção --databases ou -B</td> <td></td> <td></td> </tr><tr><th scope="row">--tls-ciphersuites</th> <td>Cifras TLSv1.3 permitidas para conexões criptografadas</td> <td>8.0.16</td> <td></td> </tr><tr><th scope="row">--tls-version</th> <td>Protocolos TLS permitidos para conexões criptografadas</td> <td></td> <td></td> </tr><tr><th scope="row">--use-frm</th> <td>Para operações de reparo em tabelas MyISAM</td> <td></td> <td></td> </tr><tr><th scope="row">--user</th> <td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--verbose</th> <td>Verbose mode</td> <td></td> <td></td> </tr><tr><th scope="row">--version</th> <td>Exibir informações da versão e sair</td> <td></td> <td></td> </tr><tr><th scope="row">--write-binlog</th> <td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td> <td></td> <td></td> </tr><tr><th scope="row">--zstd-compression-level</th> <td>Nível de compressão para conexões ao servidor que utilizam compressão zstd</td> <td>8.0.18</td> <td></td> </tr></tbody></table>5

Escreva um registro de depuração. Uma string típica *`debug_options`* é `d:t:o,file_name`. O padrão é `d:t:o`.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--debug-check`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Introduced</th> <th scope="col">Deprecated</th> </tr></thead><tbody><tr><th scope="row">--all-databases</th> <td>Verifique todas as tabelas em todos os bancos de dados</td> <td></td> <td></td> </tr><tr><th scope="row">--all-in-1</th> <td>Execute uma única declaração para cada banco de dados que nomeia todas as tabelas desse banco de dados</td> <td></td> <td></td> </tr><tr><th scope="row">--analyze</th> <td>Analyze the tables</td> <td></td> <td></td> </tr><tr><th scope="row">--auto-repair</th> <td>Se uma tabela verificada estiver corrompida, corrija-a automaticamente</td> <td></td> <td></td> </tr><tr><th scope="row">--bind-address</th> <td>Use a interface de rede especificada para se conectar ao servidor MySQL</td> <td></td> <td></td> </tr><tr><th scope="row">--character-sets-dir</th> <td>Diretório onde os conjuntos de caracteres são instalados</td> <td></td> <td></td> </tr><tr><th scope="row">--check</th> <td>Verifique as tabelas em busca de erros</td> <td></td> <td></td> </tr><tr><th scope="row">--check-only-changed</th> <td>Verifique apenas as tabelas que foram alteradas desde a última verificação</td> <td></td> <td></td> </tr><tr><th scope="row">--check-upgrade</th> <td>Invoque a consulta CHECK TABLE com a opção FOR UPGRADE</td> <td></td> <td></td> </tr><tr><th scope="row">--compress</th> <td>Compressar todas as informações enviadas entre o cliente e o servidor</td> <td></td> <td>8.0.18</td> </tr><tr><th scope="row">--compression-algorithms</th> <td>Algoritmos de compressão permitidos para conexões ao servidor</td> <td>8.0.18</td> <td></td> </tr><tr><th scope="row">--databases</th> <td>Interprete todos os argumentos como nomes de banco de dados</td> <td></td> <td></td> </tr><tr><th scope="row">--debug</th> <td>Write debugging log</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-check</th> <td>Imprimir informações de depuração quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-info</th> <td>Imprimir informações de depuração, memória e estatísticas de CPU quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row">--default-auth</th> <td>Plugin de autenticação a ser utilizado</td> <td></td> <td></td> </tr><tr><th scope="row">--default-character-set</th> <td>Especificar o conjunto de caracteres padrão</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-extra-file</th> <td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-file</th> <td>Arquivo de opção de leitura apenas nomeado</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-group-suffix</th> <td>Valor do sufixo do grupo de opções</td> <td></td> <td></td> </tr><tr><th scope="row">--enable-cleartext-plugin</th> <td>Habilitar o plugin de autenticação de texto claro</td> <td></td> <td></td> </tr><tr><th scope="row">--extended</th> <td>Verifique e conserte mesas</td> <td></td> <td></td> </tr><tr><th scope="row">--fast</th> <td>Verifique apenas as tabelas que não foram fechadas corretamente</td> <td></td> <td></td> </tr><tr><th scope="row">--force</th> <td>Continue mesmo que ocorra um erro SQL</td> <td></td> <td></td> </tr><tr><th scope="row">--get-server-public-key</th> <td>Solicitar chave pública RSA do servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--help</th> <td>Exibir mensagem de ajuda e sair</td> <td></td> <td></td> </tr><tr><th scope="row">--host</th> <td>Anfitrião no qual o servidor MySQL está localizado</td> <td></td> <td></td> </tr><tr><th scope="row">--login-path</th> <td>Leia as opções de caminho de login a partir de .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th scope="row">--medium-check</th> <td>Faça uma verificação que seja mais rápida do que uma operação --extended</td> <td></td> <td></td> </tr><tr><th scope="row">--no-defaults</th> <td>Não leia arquivos de opção</td> <td></td> <td></td> </tr><tr><th scope="row">--optimize</th> <td>Optimize the tables</td> <td></td> <td></td> </tr><tr><th scope="row">--password</th> <td>Senha para usar ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--password1</th> <td>Primeira senha de autenticação multifatorial a usar ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password2</th> <td>Segunda senha de autenticação multifatorial a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password3</th> <td>Terceira senha de autenticação multifatorial a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--pipe</th> <td>Conecte-se ao servidor usando um tubo nomeado (apenas Windows)</td> <td></td> <td></td> </tr><tr><th scope="row">--plugin-dir</th> <td>Diretório onde os plugins são instalados</td> <td></td> <td></td> </tr><tr><th scope="row">--port</th> <td>TCP/IP port number for connection</td> <td></td> <td></td> </tr><tr><th scope="row">--print-defaults</th> <td>Print default options</td> <td></td> <td></td> </tr><tr><th scope="row">--protocol</th> <td>Protocolo de transporte a ser utilizado</td> <td></td> <td></td> </tr><tr><th scope="row">--quick</th> <td>O método mais rápido de verificação</td> <td></td> <td></td> </tr><tr><th scope="row">--repair</th> <td>Realize uma reparação que possa consertar quase tudo, exceto chaves únicas que não são únicas</td> <td></td> <td></td> </tr><tr><th scope="row">--server-public-key-path</th> <td>Nome do caminho para o arquivo que contém a chave pública RSA</td> <td></td> <td></td> </tr><tr><th scope="row">--shared-memory-base-name</th> <td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td> <td></td> <td></td> </tr><tr><th scope="row">--silent</th> <td>Silent mode</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-database</th> <td>Omitar este banco de dados das operações realizadas</td> <td></td> <td></td> </tr><tr><th scope="row">--socket</th> <td>Arquivo de socket Unix ou tubo nomeado do Windows a ser usado</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-ca</th> <td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-capath</th> <td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cert</th> <td>Arquivo que contém o certificado X.509</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cipher</th> <td>Cifras permitidas para criptografia de conexão</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crl</th> <td>Arquivo que contém listas de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crlpath</th> <td>Diretório que contém arquivos de lista de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-fips-mode</th> <td>Se deve habilitar o modo FIPS no lado do cliente</td> <td></td> <td>8.0.34</td> </tr><tr><th scope="row">--ssl-key</th> <td>Arquivo que contém a chave X.509</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-mode</th> <td>Estado de segurança desejado da conexão com o servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-session-data</th> <td>Arquivo que contém dados da sessão SSL</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--ssl-session-data-continue-on-failed-reuse</th> <td>Se estabelecer conexões se a reutilização da sessão falhar</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--tables</th> <td>Supra a opção --databases ou -B</td> <td></td> <td></td> </tr><tr><th scope="row">--tls-ciphersuites</th> <td>Cifras TLSv1.3 permitidas para conexões criptografadas</td> <td>8.0.16</td> <td></td> </tr><tr><th scope="row">--tls-version</th> <td>Protocolos TLS permitidos para conexões criptografadas</td> <td></td> <td></td> </tr><tr><th scope="row">--use-frm</th> <td>Para operações de reparo em tabelas MyISAM</td> <td></td> <td></td> </tr><tr><th scope="row">--user</th> <td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--verbose</th> <td>Verbose mode</td> <td></td> <td></td> </tr><tr><th scope="row">--version</th> <td>Exibir informações da versão e sair</td> <td></td> <td></td> </tr><tr><th scope="row">--write-binlog</th> <td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td> <td></td> <td></td> </tr><tr><th scope="row">--zstd-compression-level</th> <td>Nível de compressão para conexões ao servidor que utilizam compressão zstd</td> <td>8.0.18</td> <td></td> </tr></tbody></table>6

Imprima algumas informações de depuração quando o programa sair.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--debug-info`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Introduced</th> <th scope="col">Deprecated</th> </tr></thead><tbody><tr><th scope="row">--all-databases</th> <td>Verifique todas as tabelas em todos os bancos de dados</td> <td></td> <td></td> </tr><tr><th scope="row">--all-in-1</th> <td>Execute uma única declaração para cada banco de dados que nomeia todas as tabelas desse banco de dados</td> <td></td> <td></td> </tr><tr><th scope="row">--analyze</th> <td>Analyze the tables</td> <td></td> <td></td> </tr><tr><th scope="row">--auto-repair</th> <td>Se uma tabela verificada estiver corrompida, corrija-a automaticamente</td> <td></td> <td></td> </tr><tr><th scope="row">--bind-address</th> <td>Use a interface de rede especificada para se conectar ao servidor MySQL</td> <td></td> <td></td> </tr><tr><th scope="row">--character-sets-dir</th> <td>Diretório onde os conjuntos de caracteres são instalados</td> <td></td> <td></td> </tr><tr><th scope="row">--check</th> <td>Verifique as tabelas em busca de erros</td> <td></td> <td></td> </tr><tr><th scope="row">--check-only-changed</th> <td>Verifique apenas as tabelas que foram alteradas desde a última verificação</td> <td></td> <td></td> </tr><tr><th scope="row">--check-upgrade</th> <td>Invoque a consulta CHECK TABLE com a opção FOR UPGRADE</td> <td></td> <td></td> </tr><tr><th scope="row">--compress</th> <td>Compressar todas as informações enviadas entre o cliente e o servidor</td> <td></td> <td>8.0.18</td> </tr><tr><th scope="row">--compression-algorithms</th> <td>Algoritmos de compressão permitidos para conexões ao servidor</td> <td>8.0.18</td> <td></td> </tr><tr><th scope="row">--databases</th> <td>Interprete todos os argumentos como nomes de banco de dados</td> <td></td> <td></td> </tr><tr><th scope="row">--debug</th> <td>Write debugging log</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-check</th> <td>Imprimir informações de depuração quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-info</th> <td>Imprimir informações de depuração, memória e estatísticas de CPU quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row">--default-auth</th> <td>Plugin de autenticação a ser utilizado</td> <td></td> <td></td> </tr><tr><th scope="row">--default-character-set</th> <td>Especificar o conjunto de caracteres padrão</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-extra-file</th> <td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-file</th> <td>Arquivo de opção de leitura apenas nomeado</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-group-suffix</th> <td>Valor do sufixo do grupo de opções</td> <td></td> <td></td> </tr><tr><th scope="row">--enable-cleartext-plugin</th> <td>Habilitar o plugin de autenticação de texto claro</td> <td></td> <td></td> </tr><tr><th scope="row">--extended</th> <td>Verifique e conserte mesas</td> <td></td> <td></td> </tr><tr><th scope="row">--fast</th> <td>Verifique apenas as tabelas que não foram fechadas corretamente</td> <td></td> <td></td> </tr><tr><th scope="row">--force</th> <td>Continue mesmo que ocorra um erro SQL</td> <td></td> <td></td> </tr><tr><th scope="row">--get-server-public-key</th> <td>Solicitar chave pública RSA do servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--help</th> <td>Exibir mensagem de ajuda e sair</td> <td></td> <td></td> </tr><tr><th scope="row">--host</th> <td>Anfitrião no qual o servidor MySQL está localizado</td> <td></td> <td></td> </tr><tr><th scope="row">--login-path</th> <td>Leia as opções de caminho de login a partir de .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th scope="row">--medium-check</th> <td>Faça uma verificação que seja mais rápida do que uma operação --extended</td> <td></td> <td></td> </tr><tr><th scope="row">--no-defaults</th> <td>Não leia arquivos de opção</td> <td></td> <td></td> </tr><tr><th scope="row">--optimize</th> <td>Optimize the tables</td> <td></td> <td></td> </tr><tr><th scope="row">--password</th> <td>Senha para usar ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--password1</th> <td>Primeira senha de autenticação multifatorial a usar ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password2</th> <td>Segunda senha de autenticação multifatorial a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password3</th> <td>Terceira senha de autenticação multifatorial a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--pipe</th> <td>Conecte-se ao servidor usando um tubo nomeado (apenas Windows)</td> <td></td> <td></td> </tr><tr><th scope="row">--plugin-dir</th> <td>Diretório onde os plugins são instalados</td> <td></td> <td></td> </tr><tr><th scope="row">--port</th> <td>TCP/IP port number for connection</td> <td></td> <td></td> </tr><tr><th scope="row">--print-defaults</th> <td>Print default options</td> <td></td> <td></td> </tr><tr><th scope="row">--protocol</th> <td>Protocolo de transporte a ser utilizado</td> <td></td> <td></td> </tr><tr><th scope="row">--quick</th> <td>O método mais rápido de verificação</td> <td></td> <td></td> </tr><tr><th scope="row">--repair</th> <td>Realize uma reparação que possa consertar quase tudo, exceto chaves únicas que não são únicas</td> <td></td> <td></td> </tr><tr><th scope="row">--server-public-key-path</th> <td>Nome do caminho para o arquivo que contém a chave pública RSA</td> <td></td> <td></td> </tr><tr><th scope="row">--shared-memory-base-name</th> <td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td> <td></td> <td></td> </tr><tr><th scope="row">--silent</th> <td>Silent mode</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-database</th> <td>Omitar este banco de dados das operações realizadas</td> <td></td> <td></td> </tr><tr><th scope="row">--socket</th> <td>Arquivo de socket Unix ou tubo nomeado do Windows a ser usado</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-ca</th> <td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-capath</th> <td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cert</th> <td>Arquivo que contém o certificado X.509</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cipher</th> <td>Cifras permitidas para criptografia de conexão</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crl</th> <td>Arquivo que contém listas de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crlpath</th> <td>Diretório que contém arquivos de lista de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-fips-mode</th> <td>Se deve habilitar o modo FIPS no lado do cliente</td> <td></td> <td>8.0.34</td> </tr><tr><th scope="row">--ssl-key</th> <td>Arquivo que contém a chave X.509</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-mode</th> <td>Estado de segurança desejado da conexão com o servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-session-data</th> <td>Arquivo que contém dados da sessão SSL</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--ssl-session-data-continue-on-failed-reuse</th> <td>Se estabelecer conexões se a reutilização da sessão falhar</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--tables</th> <td>Supra a opção --databases ou -B</td> <td></td> <td></td> </tr><tr><th scope="row">--tls-ciphersuites</th> <td>Cifras TLSv1.3 permitidas para conexões criptografadas</td> <td>8.0.16</td> <td></td> </tr><tr><th scope="row">--tls-version</th> <td>Protocolos TLS permitidos para conexões criptografadas</td> <td></td> <td></td> </tr><tr><th scope="row">--use-frm</th> <td>Para operações de reparo em tabelas MyISAM</td> <td></td> <td></td> </tr><tr><th scope="row">--user</th> <td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--verbose</th> <td>Verbose mode</td> <td></td> <td></td> </tr><tr><th scope="row">--version</th> <td>Exibir informações da versão e sair</td> <td></td> <td></td> </tr><tr><th scope="row">--write-binlog</th> <td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td> <td></td> <td></td> </tr><tr><th scope="row">--zstd-compression-level</th> <td>Nível de compressão para conexões ao servidor que utilizam compressão zstd</td> <td>8.0.18</td> <td></td> </tr></tbody></table>7

Imprimir informações de depuração e estatísticas de uso de memória e CPU quando o programa sai.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--default-character-set=charset_name`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Introduced</th> <th scope="col">Deprecated</th> </tr></thead><tbody><tr><th scope="row">--all-databases</th> <td>Verifique todas as tabelas em todos os bancos de dados</td> <td></td> <td></td> </tr><tr><th scope="row">--all-in-1</th> <td>Execute uma única declaração para cada banco de dados que nomeia todas as tabelas desse banco de dados</td> <td></td> <td></td> </tr><tr><th scope="row">--analyze</th> <td>Analyze the tables</td> <td></td> <td></td> </tr><tr><th scope="row">--auto-repair</th> <td>Se uma tabela verificada estiver corrompida, corrija-a automaticamente</td> <td></td> <td></td> </tr><tr><th scope="row">--bind-address</th> <td>Use a interface de rede especificada para se conectar ao servidor MySQL</td> <td></td> <td></td> </tr><tr><th scope="row">--character-sets-dir</th> <td>Diretório onde os conjuntos de caracteres são instalados</td> <td></td> <td></td> </tr><tr><th scope="row">--check</th> <td>Verifique as tabelas em busca de erros</td> <td></td> <td></td> </tr><tr><th scope="row">--check-only-changed</th> <td>Verifique apenas as tabelas que foram alteradas desde a última verificação</td> <td></td> <td></td> </tr><tr><th scope="row">--check-upgrade</th> <td>Invoque a consulta CHECK TABLE com a opção FOR UPGRADE</td> <td></td> <td></td> </tr><tr><th scope="row">--compress</th> <td>Compressar todas as informações enviadas entre o cliente e o servidor</td> <td></td> <td>8.0.18</td> </tr><tr><th scope="row">--compression-algorithms</th> <td>Algoritmos de compressão permitidos para conexões ao servidor</td> <td>8.0.18</td> <td></td> </tr><tr><th scope="row">--databases</th> <td>Interprete todos os argumentos como nomes de banco de dados</td> <td></td> <td></td> </tr><tr><th scope="row">--debug</th> <td>Write debugging log</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-check</th> <td>Imprimir informações de depuração quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-info</th> <td>Imprimir informações de depuração, memória e estatísticas de CPU quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row">--default-auth</th> <td>Plugin de autenticação a ser utilizado</td> <td></td> <td></td> </tr><tr><th scope="row">--default-character-set</th> <td>Especificar o conjunto de caracteres padrão</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-extra-file</th> <td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-file</th> <td>Arquivo de opção de leitura apenas nomeado</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-group-suffix</th> <td>Valor do sufixo do grupo de opções</td> <td></td> <td></td> </tr><tr><th scope="row">--enable-cleartext-plugin</th> <td>Habilitar o plugin de autenticação de texto claro</td> <td></td> <td></td> </tr><tr><th scope="row">--extended</th> <td>Verifique e conserte mesas</td> <td></td> <td></td> </tr><tr><th scope="row">--fast</th> <td>Verifique apenas as tabelas que não foram fechadas corretamente</td> <td></td> <td></td> </tr><tr><th scope="row">--force</th> <td>Continue mesmo que ocorra um erro SQL</td> <td></td> <td></td> </tr><tr><th scope="row">--get-server-public-key</th> <td>Solicitar chave pública RSA do servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--help</th> <td>Exibir mensagem de ajuda e sair</td> <td></td> <td></td> </tr><tr><th scope="row">--host</th> <td>Anfitrião no qual o servidor MySQL está localizado</td> <td></td> <td></td> </tr><tr><th scope="row">--login-path</th> <td>Leia as opções de caminho de login a partir de .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th scope="row">--medium-check</th> <td>Faça uma verificação que seja mais rápida do que uma operação --extended</td> <td></td> <td></td> </tr><tr><th scope="row">--no-defaults</th> <td>Não leia arquivos de opção</td> <td></td> <td></td> </tr><tr><th scope="row">--optimize</th> <td>Optimize the tables</td> <td></td> <td></td> </tr><tr><th scope="row">--password</th> <td>Senha para usar ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--password1</th> <td>Primeira senha de autenticação multifatorial a usar ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password2</th> <td>Segunda senha de autenticação multifatorial a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password3</th> <td>Terceira senha de autenticação multifatorial a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--pipe</th> <td>Conecte-se ao servidor usando um tubo nomeado (apenas Windows)</td> <td></td> <td></td> </tr><tr><th scope="row">--plugin-dir</th> <td>Diretório onde os plugins são instalados</td> <td></td> <td></td> </tr><tr><th scope="row">--port</th> <td>TCP/IP port number for connection</td> <td></td> <td></td> </tr><tr><th scope="row">--print-defaults</th> <td>Print default options</td> <td></td> <td></td> </tr><tr><th scope="row">--protocol</th> <td>Protocolo de transporte a ser utilizado</td> <td></td> <td></td> </tr><tr><th scope="row">--quick</th> <td>O método mais rápido de verificação</td> <td></td> <td></td> </tr><tr><th scope="row">--repair</th> <td>Realize uma reparação que possa consertar quase tudo, exceto chaves únicas que não são únicas</td> <td></td> <td></td> </tr><tr><th scope="row">--server-public-key-path</th> <td>Nome do caminho para o arquivo que contém a chave pública RSA</td> <td></td> <td></td> </tr><tr><th scope="row">--shared-memory-base-name</th> <td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td> <td></td> <td></td> </tr><tr><th scope="row">--silent</th> <td>Silent mode</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-database</th> <td>Omitar este banco de dados das operações realizadas</td> <td></td> <td></td> </tr><tr><th scope="row">--socket</th> <td>Arquivo de socket Unix ou tubo nomeado do Windows a ser usado</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-ca</th> <td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-capath</th> <td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cert</th> <td>Arquivo que contém o certificado X.509</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cipher</th> <td>Cifras permitidas para criptografia de conexão</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crl</th> <td>Arquivo que contém listas de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crlpath</th> <td>Diretório que contém arquivos de lista de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-fips-mode</th> <td>Se deve habilitar o modo FIPS no lado do cliente</td> <td></td> <td>8.0.34</td> </tr><tr><th scope="row">--ssl-key</th> <td>Arquivo que contém a chave X.509</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-mode</th> <td>Estado de segurança desejado da conexão com o servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-session-data</th> <td>Arquivo que contém dados da sessão SSL</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--ssl-session-data-continue-on-failed-reuse</th> <td>Se estabelecer conexões se a reutilização da sessão falhar</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--tables</th> <td>Supra a opção --databases ou -B</td> <td></td> <td></td> </tr><tr><th scope="row">--tls-ciphersuites</th> <td>Cifras TLSv1.3 permitidas para conexões criptografadas</td> <td>8.0.16</td> <td></td> </tr><tr><th scope="row">--tls-version</th> <td>Protocolos TLS permitidos para conexões criptografadas</td> <td></td> <td></td> </tr><tr><th scope="row">--use-frm</th> <td>Para operações de reparo em tabelas MyISAM</td> <td></td> <td></td> </tr><tr><th scope="row">--user</th> <td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--verbose</th> <td>Verbose mode</td> <td></td> <td></td> </tr><tr><th scope="row">--version</th> <td>Exibir informações da versão e sair</td> <td></td> <td></td> </tr><tr><th scope="row">--write-binlog</th> <td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td> <td></td> <td></td> </tr><tr><th scope="row">--zstd-compression-level</th> <td>Nível de compressão para conexões ao servidor que utilizam compressão zstd</td> <td>8.0.18</td> <td></td> </tr></tbody></table>8

Use *`charset_name`* como o conjunto de caracteres padrão. Veja a Seção 12.15, “Configuração do Conjunto de Caracteres”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Introduced</th> <th scope="col">Deprecated</th> </tr></thead><tbody><tr><th scope="row">--all-databases</th> <td>Verifique todas as tabelas em todos os bancos de dados</td> <td></td> <td></td> </tr><tr><th scope="row">--all-in-1</th> <td>Execute uma única declaração para cada banco de dados que nomeia todas as tabelas desse banco de dados</td> <td></td> <td></td> </tr><tr><th scope="row">--analyze</th> <td>Analyze the tables</td> <td></td> <td></td> </tr><tr><th scope="row">--auto-repair</th> <td>Se uma tabela verificada estiver corrompida, corrija-a automaticamente</td> <td></td> <td></td> </tr><tr><th scope="row">--bind-address</th> <td>Use a interface de rede especificada para se conectar ao servidor MySQL</td> <td></td> <td></td> </tr><tr><th scope="row">--character-sets-dir</th> <td>Diretório onde os conjuntos de caracteres são instalados</td> <td></td> <td></td> </tr><tr><th scope="row">--check</th> <td>Verifique as tabelas em busca de erros</td> <td></td> <td></td> </tr><tr><th scope="row">--check-only-changed</th> <td>Verifique apenas as tabelas que foram alteradas desde a última verificação</td> <td></td> <td></td> </tr><tr><th scope="row">--check-upgrade</th> <td>Invoque a consulta CHECK TABLE com a opção FOR UPGRADE</td> <td></td> <td></td> </tr><tr><th scope="row">--compress</th> <td>Compressar todas as informações enviadas entre o cliente e o servidor</td> <td></td> <td>8.0.18</td> </tr><tr><th scope="row">--compression-algorithms</th> <td>Algoritmos de compressão permitidos para conexões ao servidor</td> <td>8.0.18</td> <td></td> </tr><tr><th scope="row">--databases</th> <td>Interprete todos os argumentos como nomes de banco de dados</td> <td></td> <td></td> </tr><tr><th scope="row">--debug</th> <td>Write debugging log</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-check</th> <td>Imprimir informações de depuração quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-info</th> <td>Imprimir informações de depuração, memória e estatísticas de CPU quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row">--default-auth</th> <td>Plugin de autenticação a ser utilizado</td> <td></td> <td></td> </tr><tr><th scope="row">--default-character-set</th> <td>Especificar o conjunto de caracteres padrão</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-extra-file</th> <td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-file</th> <td>Arquivo de opção de leitura apenas nomeado</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-group-suffix</th> <td>Valor do sufixo do grupo de opções</td> <td></td> <td></td> </tr><tr><th scope="row">--enable-cleartext-plugin</th> <td>Habilitar o plugin de autenticação de texto claro</td> <td></td> <td></td> </tr><tr><th scope="row">--extended</th> <td>Verifique e conserte mesas</td> <td></td> <td></td> </tr><tr><th scope="row">--fast</th> <td>Verifique apenas as tabelas que não foram fechadas corretamente</td> <td></td> <td></td> </tr><tr><th scope="row">--force</th> <td>Continue mesmo que ocorra um erro SQL</td> <td></td> <td></td> </tr><tr><th scope="row">--get-server-public-key</th> <td>Solicitar chave pública RSA do servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--help</th> <td>Exibir mensagem de ajuda e sair</td> <td></td> <td></td> </tr><tr><th scope="row">--host</th> <td>Anfitrião no qual o servidor MySQL está localizado</td> <td></td> <td></td> </tr><tr><th scope="row">--login-path</th> <td>Leia as opções de caminho de login a partir de .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th scope="row">--medium-check</th> <td>Faça uma verificação que seja mais rápida do que uma operação --extended</td> <td></td> <td></td> </tr><tr><th scope="row">--no-defaults</th> <td>Não leia arquivos de opção</td> <td></td> <td></td> </tr><tr><th scope="row">--optimize</th> <td>Optimize the tables</td> <td></td> <td></td> </tr><tr><th scope="row">--password</th> <td>Senha para usar ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--password1</th> <td>Primeira senha de autenticação multifatorial a usar ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password2</th> <td>Segunda senha de autenticação multifatorial a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password3</th> <td>Terceira senha de autenticação multifatorial a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--pipe</th> <td>Conecte-se ao servidor usando um tubo nomeado (apenas Windows)</td> <td></td> <td></td> </tr><tr><th scope="row">--plugin-dir</th> <td>Diretório onde os plugins são instalados</td> <td></td> <td></td> </tr><tr><th scope="row">--port</th> <td>TCP/IP port number for connection</td> <td></td> <td></td> </tr><tr><th scope="row">--print-defaults</th> <td>Print default options</td> <td></td> <td></td> </tr><tr><th scope="row">--protocol</th> <td>Protocolo de transporte a ser utilizado</td> <td></td> <td></td> </tr><tr><th scope="row">--quick</th> <td>O método mais rápido de verificação</td> <td></td> <td></td> </tr><tr><th scope="row">--repair</th> <td>Realize uma reparação que possa consertar quase tudo, exceto chaves únicas que não são únicas</td> <td></td> <td></td> </tr><tr><th scope="row">--server-public-key-path</th> <td>Nome do caminho para o arquivo que contém a chave pública RSA</td> <td></td> <td></td> </tr><tr><th scope="row">--shared-memory-base-name</th> <td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td> <td></td> <td></td> </tr><tr><th scope="row">--silent</th> <td>Silent mode</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-database</th> <td>Omitar este banco de dados das operações realizadas</td> <td></td> <td></td> </tr><tr><th scope="row">--socket</th> <td>Arquivo de socket Unix ou tubo nomeado do Windows a ser usado</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-ca</th> <td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-capath</th> <td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cert</th> <td>Arquivo que contém o certificado X.509</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cipher</th> <td>Cifras permitidas para criptografia de conexão</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crl</th> <td>Arquivo que contém listas de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crlpath</th> <td>Diretório que contém arquivos de lista de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-fips-mode</th> <td>Se deve habilitar o modo FIPS no lado do cliente</td> <td></td> <td>8.0.34</td> </tr><tr><th scope="row">--ssl-key</th> <td>Arquivo que contém a chave X.509</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-mode</th> <td>Estado de segurança desejado da conexão com o servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-session-data</th> <td>Arquivo que contém dados da sessão SSL</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--ssl-session-data-continue-on-failed-reuse</th> <td>Se estabelecer conexões se a reutilização da sessão falhar</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--tables</th> <td>Supra a opção --databases ou -B</td> <td></td> <td></td> </tr><tr><th scope="row">--tls-ciphersuites</th> <td>Cifras TLSv1.3 permitidas para conexões criptografadas</td> <td>8.0.16</td> <td></td> </tr><tr><th scope="row">--tls-version</th> <td>Protocolos TLS permitidos para conexões criptografadas</td> <td></td> <td></td> </tr><tr><th scope="row">--use-frm</th> <td>Para operações de reparo em tabelas MyISAM</td> <td></td> <td></td> </tr><tr><th scope="row">--user</th> <td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--verbose</th> <td>Verbose mode</td> <td></td> <td></td> </tr><tr><th scope="row">--version</th> <td>Exibir informações da versão e sair</td> <td></td> <td></td> </tr><tr><th scope="row">--write-binlog</th> <td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td> <td></td> <td></td> </tr><tr><th scope="row">--zstd-compression-level</th> <td>Nível de compressão para conexões ao servidor que utilizam compressão zstd</td> <td>8.0.18</td> <td></td> </tr></tbody></table>9

Leia este arquivo de opção após o arquivo de opção global, mas (em Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>0

Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Exceção: Mesmo com `--defaults-file`, os programas de cliente leem `.mylogin.cnf`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>1

Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, **mysqlcheck** normalmente lê os grupos `[client]` e `[mysqlcheck]`. Se esta opção for dada como `--defaults-group-suffix=_other`, **mysqlcheck** também lê os grupos `[client_other]` e `[mysqlcheck_other]`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--extended`, `-e`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>2

Se você estiver usando essa opção para verificar tabelas, isso garante que elas sejam 100% consistentes, mas leva um longo tempo.

Se você estiver usando essa opção para reparar tabelas, ela executa uma reparação estendida que pode não apenas levar um longo tempo para ser executada, mas também pode gerar muitas linhas de lixo!

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>3

Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Veja a Seção 8.2.17, “Autenticação substituível”.

* `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>4

Ative o plugin de autenticação de texto claro `mysql_clear_password`. (Veja a Seção 8.4.1.4, “Autenticação de Texto Claro Plugável do Lado do Cliente”).

* `--fast`, `-F`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>5

Verifique apenas as tabelas que não foram fechadas corretamente.

* `--force`, `-f`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>6

Continue mesmo se ocorrer um erro SQL.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>7

Solicitar a chave pública necessária para a troca de senha baseada em par de chaves RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

Para informações sobre o plugin `caching_sha2_password`, consulte a Seção 8.4.1.2, “Cacheamento de Autenticação SHA-2 Pluggable”.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>8

Conecte-se ao servidor MySQL no host fornecido.

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>9

Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam para qual servidor MySQL se conectar e qual conta se autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql_config_editor**. Veja a Seção 6.6.7, “mysql_config_editor — Utilitário de Configuração MySQL”.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--medium-check`, `-m`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>0

Faça uma verificação que seja mais rápida do que uma operação `--extended`. Isso encontra apenas 99,99% de todos os erros, o que deve ser suficiente na maioria dos casos.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>1

Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para impedir que elas sejam lidas.

A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql_config_editor**. Veja a Seção 6.6.7, “mysql_config_editor — Ferramenta de Configuração do MySQL”.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--optimize`, `-o`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>2

Otimize as tabelas.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>3

A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysqlcheck** solicita uma senha. Se for fornecida, não deve haver *espaço* entre `--password=` ou `-p` e a senha que a segue. Se não for especificado nenhum tipo de senha, o padrão é não enviar senha.

Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Veja a Seção 8.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

Para especificar explicitamente que não há senha e que o **mysqlcheck** não deve solicitar uma senha, use a opção `--skip-password`.

* `--password1[=pass_val]`

A senha para o fator de autenticação multifatorial 1 da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysqlcheck** solicita uma senha. Se for fornecida, não deve haver **espaço** entre `--password1=` e a senha que a segue. Se não for especificado nenhum tipo de senha, o padrão é não enviar senha.

Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Veja a Seção 8.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

Para especificar explicitamente que não há senha e que o **mysqlcheck** não deve solicitar uma senha, use a opção `--skip-password1`.

`--password1` e `--password` são sinônimos, assim como `--skip-password1` e `--skip-password`.

* `--password2[=pass_val]`

A senha para o fator de autenticação multifatorial 2 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica para `--password1`; consulte a descrição dessa opção para obter detalhes.

* `--password3[=pass_val]`

A senha para o fator de autenticação multifatorial 3 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica para `--password1`; consulte a descrição dessa opção para obter detalhes.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>4

Em Windows, conecte-se ao servidor usando um tubo nomeado. Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por tubo nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>5

O diretório onde procurar plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o **mysqlcheck** não o encontrar. Veja a Seção 8.2.17, “Autenticação Conectada”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>6

Para conexões TCP/IP, o número de porta a ser utilizado.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>7

Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>8

O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de outro protocolo que não o desejado. Para obter detalhes sobre os valores permitidos, consulte a Seção 6.2.7, “Protocolos de Transporte de Conexão”.

* `--quick`, `-q`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>9

Se você estiver usando essa opção para verificar tabelas, isso impede que a verificação analise as linhas para verificar links incorretos. Esse é o método de verificação mais rápido.

Se você estiver usando essa opção para reparar tabelas, ela tenta reparar apenas a árvore de índice. Esse é o método de reparo mais rápido.

* `--repair`, `-r`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-in-1</code></td> </tr></tbody></table>0

Realize uma reparação que possa consertar quase tudo, exceto chaves únicas que não são únicas.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-in-1</code></td> </tr></tbody></table>1

O nome do caminho de um arquivo em formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senha com base em par de chave RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

Para `sha256_password`, esta opção só se aplica se o MySQL foi construído usando OpenSSL.

Para informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 8.4.1.3, “Autenticação substituível SHA-256”, e a Seção 8.4.1.2, “Cache de autenticação substituível SHA-2”.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-in-1</code></td> </tr></tbody></table>2

Em Windows, o nome de memória compartilhada a ser usado para conexões feitas usando memória compartilhada a um servidor local. O valor padrão é `MYSQL`. O nome de memória compartilhada é sensível a maiúsculas e minúsculas.

Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

* `--silent`, `-s`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-in-1</code></td> </tr></tbody></table>3

Modo silencioso. Imprima apenas as mensagens de erro.

* `--skip-database=db_name`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-in-1</code></td> </tr></tbody></table>4

Não inclua o banco de dados nomeado (sensível a maiúsculas e minúsculas) nas operações realizadas pelo **mysqlcheck**.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-in-1</code></td> </tr></tbody></table>5

Para conexões a `localhost`, o arquivo de socket Unix a ser usado, ou, no Windows, o nome do tubo nomeado a ser usado.

Em Windows, esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de canal nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--ssl*`

As opções que começam com `--ssl` especificam se deve conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Consulte Opções de comando para conexões criptografadas.

* `--ssl-fips-mode={OFF|ON|STRICT}`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-in-1</code></td> </tr></tbody></table>6

Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere de outras opções `--ssl-xxx` porque não é usada para estabelecer conexões criptografadas, mas sim para determinar quais operações criptográficas devem ser permitidas. Veja a Seção 8.8, “Suporte FIPS”.

Esses valores `--ssl-fips-mode` são permitidos:

+ `OFF`: Desabilitar o modo FIPS.  
  + `ON`: Habilitar o modo FIPS.  
  + `STRICT`: Habilitar o modo FIPS "estricto".

Nota

Se o Módulo de Objeto OpenSSL FIPS não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Neste caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente produza um aviso na inicialização e opere no modo não FIPS.

A partir do MySQL 8.0.34, essa opção é desatualizada. A espera é que ela seja removida em uma versão futura do MySQL.

* `--tables`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-in-1</code></td> </tr></tbody></table>7

Supraponha a opção `--databases` ou `-B`. Todos os argumentos de nome que seguem a opção são considerados como nomes de tabela.

* `--tls-ciphersuites=ciphersuite_list`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-in-1</code></td> </tr></tbody></table>8

As sequências de cifra permitidas para conexões criptografadas que utilizam TLSv1.3. O valor é uma lista de um ou mais nomes de sequência de cifra separados por vírgula. As sequências de cifra que podem ser nomeadas para esta opção dependem da biblioteca SSL utilizada para compilar o MySQL. Para obter detalhes, consulte a Seção 8.3.2, “Protocolos e cifras de conexão criptografada TLS”.

Essa opção foi adicionada no MySQL 8.0.16.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-in-1</code></td> </tr></tbody></table>9

Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolo separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, “Protocolos e cifras TLS de conexão criptografada”.

* `--use-frm`

  <table frame="box" rules="all" summary="Properties for analyze"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--analyze</code></td> </tr></tbody></table>0

Para operações de reparo em tabelas de `MyISAM`, obtenha a estrutura da tabela do dicionário de dados para que a tabela possa ser reparada mesmo que o cabeçalho `.MYI` esteja corrompido.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for analyze"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--analyze</code></td> </tr></tbody></table>1

O nome de usuário da conta MySQL a ser usado para se conectar ao servidor.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for analyze"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--analyze</code></td> </tr></tbody></table>2

Modo detalhado. Imprima informações sobre as várias etapas da operação do programa.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for analyze"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--analyze</code></td> </tr></tbody></table>3

Exibir informações da versão e sair.

* `--write-binlog`

  <table frame="box" rules="all" summary="Properties for analyze"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--analyze</code></td> </tr></tbody></table>4

Esta opção é ativada por padrão, para que as declarações `ANALYZE TABLE`, `OPTIMIZE TABLE` e `REPAIR TABLE` geradas pelo **mysqlcheck** sejam escritas no log binário. Use `--skip-write-binlog` para fazer com que `NO_WRITE_TO_BINLOG` seja adicionado às declarações para que elas não sejam registradas. Use o `--skip-write-binlog` quando essas declarações não devem ser enviadas para réplicas ou executadas ao usar os logs binários para recuperação a partir de backup.

* `--zstd-compression-level=level`

  <table frame="box" rules="all" summary="Properties for analyze"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--analyze</code></td> </tr></tbody></table>5

O nível de compressão a ser usado para conexões ao servidor que utilizam o algoritmo de compressão `zstd`. Os níveis permitidos são de 1 a 22, com valores maiores indicando níveis crescentes de compressão. O nível de compressão padrão `zstd` é 3. O ajuste do nível de compressão não afeta as conexões que não utilizam a compressão `zstd`.

Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

Essa opção foi adicionada no MySQL 8.0.18.

### 6.5.4 mysqldump — Um programa de backup de banco de dados

A ferramenta de cliente **mysqldump** realiza backups lógicos, produzindo um conjunto de declarações SQL que podem ser executadas para reproduzir as definições originais dos objetos do banco de dados e os dados das tabelas. Ela descarrega um ou mais bancos de dados MySQL para backup ou transferência para outro servidor SQL. O comando **mysqldump** também pode gerar saída em formato CSV, outro texto delimitado ou XML.

Dica

Considere o uso dos utilitários de dump do MySQL Shell, que oferecem descarregamento paralelo com múltiplos fios, compressão de arquivos e exibição de informações de progresso, além de recursos na nuvem, como o armazenamento de streaming de Objeto da Infraestrutura da Oracle Cloud e verificações e modificações de compatibilidade do MySQL HeatWave. Os descarregamentos podem ser facilmente importados em uma instância do MySQL Server ou em um Sistema de Banco de Dados MySQL HeatWave usando os utilitários de carregamento de dump do MySQL Shell. As instruções de instalação do MySQL Shell podem ser encontradas aqui.

* Considerações sobre desempenho e escalabilidade
* Sintaxe de invocação
* Sintaxe de opção - Resumo alfabético
* Opções de conexão
* Opções de arquivo de opção
* Opções DDL
* Opções de depuração
* Opções de ajuda
* Opções de internacionalização
* Opções de replicação
* Opções de formato
* Opções de filtragem
* Opções de desempenho
* Opções transacionais
* Grupos de opções
* Exemplos
* Restrições

O **mysqldump** requer pelo menos o privilégio `SELECT` para tabelas descarregadas, `SHOW VIEW` para visualizações descarregadas, `TRIGGER` para gatilhos descarregados, `LOCK TABLES` se a opção `--single-transaction` não for usada, `PROCESS` (a partir do MySQL 8.0.21) se a opção `--no-tablespaces` não for usada, e (a partir do MySQL 8.0.32) o privilégio `RELOAD` ou `FLUSH_TABLES` com `--single-transaction` se ambos `gtid_mode=ON` e `gtid_purged=ON|AUTO` forem usados. Algumas opções podem exigir outros privilégios, conforme observado nas descrições das opções.

Para recarregar um arquivo de depuração, você deve ter os privilégios necessários para executar as declarações que ele contém, como os privilégios apropriados `CREATE` para objetos criados por essas declarações.

A saída do **mysqldump** pode incluir declarações `ALTER DATABASE` que alteram a codificação de dados do banco de dados. Essas declarações podem ser usadas ao fazer o dumping de programas armazenados para preservar suas codificações de caracteres. Para recarregar um arquivo de dumping que contenha tais declarações, é necessário o privilégio `ALTER` para o banco de dados afetado.

Nota

Um dump feito usando o PowerShell no Windows com redirecionamento de saída cria um arquivo com codificação UTF-16:

```
mysqldump [options] > dump.sql
```

No entanto, o UTF-16 não é permitido como um conjunto de caracteres de conexão (veja Conjuntos de caracteres de cliente impermissíveis), então o arquivo de depuração não pode ser carregado corretamente. Para contornar esse problema, use a opção `--result-file`, que cria a saída no formato ASCII:

```
mysqldump [options] --result-file=dump.sql
```

Não é recomendado carregar um arquivo de dump quando GTIDs estão habilitados no servidor (`gtid_mode=ON`), se o seu arquivo de dump incluir tabelas do sistema. O **mysqldump** emite instruções DML para as tabelas do sistema que utilizam o mecanismo de armazenamento não transacional MyISAM, e essa combinação não é permitida quando GTIDs estão habilitados.

#### Considerações sobre desempenho e escalabilidade

As vantagens do `mysqldump` incluem a conveniência e flexibilidade de visualizar ou até mesmo editar a saída antes da restauração. Você pode clonar bancos de dados para trabalho de desenvolvimento e DBA, ou produzir pequenas variações de um banco de dados existente para testes. Não é destinado como uma solução rápida ou escalável para fazer backup de grandes quantidades de dados. Com tamanhos de dados grandes, mesmo que o passo de backup leve um tempo razoável, restaurar os dados pode ser muito lento, pois a reprodução das declarações SQL envolve I/O de disco para inserção, criação de índices, e assim por diante.

Para backups e restaurações em larga escala, um backup físico é mais apropriado, para copiar os arquivos de dados em seu formato original, para que possam ser restaurados rapidamente.

Se suas tabelas são principalmente tabelas `InnoDB` ou se você tem uma mistura de tabelas `InnoDB` e `MyISAM`, considere usar o **mysqlbackup**, que está disponível como parte do MySQL Enterprise. Esta ferramenta oferece alto desempenho para backups de `InnoDB` com mínima interrupção; também pode fazer backup de tabelas de `MyISAM` e outros motores de armazenamento; também oferece várias opções convenientes para acomodar diferentes cenários de backup. Veja a Seção 32.1, “Visão geral do backup do MySQL Enterprise”.

O **mysqldump** pode recuperar e drenar o conteúdo da tabela linha por linha, ou pode recuperar todo o conteúdo de uma tabela e bufferá-lo na memória antes de drená-lo. O bufferamento na memória pode ser um problema se você estiver drenando tabelas grandes. Para drenar tabelas linha por linha, use a opção `--quick` (ou `--opt`, que habilita `--quick`). A opção `--opt` (e, portanto, `--quick`) é habilitada por padrão, então para habilitar o bufferamento de memória, use `--skip-quick`.

Se você estiver usando uma versão recente do **mysqldump** para gerar um dump que será carregado em um servidor MySQL muito antigo, use a opção `--skip-opt` em vez da opção `--opt` ou `--extended-insert`.

Para obter informações adicionais sobre o **mysqldump**, consulte a Seção 9.4, “Usando mysqldump para backups”.

#### Sintaxe de Invocação

Existem, em geral, três maneiras de usar o **mysqldump**: para drenar um conjunto de uma ou mais tabelas, um conjunto de uma ou mais bancos de dados completos ou um servidor MySQL inteiro, conforme mostrado aqui:

```
mysqldump [options] db_name [tbl_name ...]
mysqldump [options] --databases db_name ...
mysqldump [options] --all-databases
```

Para descartar bancos de dados inteiros, não dê nome a nenhuma tabela após *`db_name`*, ou use a opção `--databases` ou `--all-databases`.

Para ver uma lista das opções que sua versão do **mysqldump** suporta, execute o comando **mysqldump** `--help`.

#### Sintaxe de opção - Resumo alfabético

O **mysqldump** suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysqldump]` e `[client]` de um arquivo de opções. Para informações sobre arquivos de opções usados por programas MySQL, consulte a Seção 6.2.2.2, “Usando arquivos de opções”.

**Tabela 6.15 Opções mysqldump**

<table frame="box" rules="all" summary="Command-line options available for mysqldump."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Introduced</th> <th scope="col">Deprecated</th> </tr></thead><tbody><tr><th scope="row">--add-drop-database</th> <td>Adicione a declaração DROP DATABASE antes de cada declaração CREATE DATABASE</td> <td></td> <td></td> </tr><tr><th scope="row">--add-drop-table</th> <td>Adicione a declaração DROP TABLE antes de cada declaração CREATE TABLE</td> <td></td> <td></td> </tr><tr><th scope="row">--add-drop-trigger</th> <td>Adicione a declaração DROP TRIGGER antes de cada declaração CREATE TRIGGER</td> <td></td> <td></td> </tr><tr><th scope="row">--add-locks</th> <td>Cerque cada dump de tabela com as instruções LOCK TABLES e UNLOCK TABLES</td> <td></td> <td></td> </tr><tr><th scope="row">--all-databases</th> <td>Exclua todas as tabelas em todos os bancos de dados</td> <td></td> <td></td> </tr><tr><th scope="row">--allow-keywords</th> <td>Permitir a criação de nomes de colunas que sejam palavras-chave</td> <td></td> <td></td> </tr><tr><th scope="row">--apply-replica-statements</th> <td>Incluir STOP REPLICA antes da declaração CHANGE REPLICATION SOURCE TO e START REPLICA no final do resultado</td> <td>8.0.26</td> <td></td> </tr><tr><th scope="row">--apply-slave-statements</th> <td>Incluir STOP SLAVE antes da declaração CHANGE MASTER e START SLAVE no final da saída</td> <td></td> <td>8.0.26</td> </tr><tr><th scope="row">--bind-address</th> <td>Use a interface de rede especificada para se conectar ao servidor MySQL</td> <td></td> <td></td> </tr><tr><th scope="row">--character-sets-dir</th> <td>Diretório onde os conjuntos de caracteres são instalados</td> <td></td> <td></td> </tr><tr><th scope="row">--column-statistics</th> <td>Escreva declarações de ANALYZE TABLE para gerar histogramas de estatísticas</td> <td></td> <td></td> </tr><tr><th scope="row">--comments</th> <td>Adicione comentários ao arquivo de descarte</td> <td></td> <td></td> </tr><tr><th scope="row">--compact</th> <td>Produza uma saída mais compacta</td> <td></td> <td></td> </tr><tr><th scope="row">--compatible</th> <td>Produza uma saída mais compatível com outros sistemas de banco de dados ou com servidores MySQL mais antigos.</td> <td></td> <td></td> </tr><tr><th scope="row">--complete-insert</th> <td>Use declarações completas de INSERT que incluam os nomes das colunas</td> <td></td> <td></td> </tr><tr><th scope="row">--compress</th> <td>Compressar todas as informações enviadas entre o cliente e o servidor</td> <td></td> <td>8.0.18</td> </tr><tr><th scope="row">--compression-algorithms</th> <td>Algoritmos de compressão permitidos para conexões ao servidor</td> <td>8.0.18</td> <td></td> </tr><tr><th scope="row">--create-options</th> <td>Incluir todas as opções de tabela específicas do MySQL nos comandos CREATE TABLE</td> <td></td> <td></td> </tr><tr><th scope="row">--databases</th> <td>Interprete todos os argumentos de nome como nomes de banco de dados</td> <td></td> <td></td> </tr><tr><th scope="row">--debug</th> <td>Write debugging log</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-check</th> <td>Imprimir informações de depuração quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-info</th> <td>Imprimir informações de depuração, memória e estatísticas de CPU quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row">--default-auth</th> <td>Plugin de autenticação a ser utilizado</td> <td></td> <td></td> </tr><tr><th scope="row">--default-character-set</th> <td>Especificar o conjunto de caracteres padrão</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-extra-file</th> <td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-file</th> <td>Arquivo de opção de leitura apenas nomeado</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-group-suffix</th> <td>Valor do sufixo do grupo de opções</td> <td></td> <td></td> </tr><tr><th scope="row">--delete-master-logs</th> <td>Em um servidor de fonte de replicação, exclua os logs binários após realizar a operação de dump</td> <td></td> <td>8.0.26</td> </tr><tr><th scope="row">--delete-source-logs</th> <td>Em um servidor de fonte de replicação, exclua os logs binários após realizar a operação de dump</td> <td>8.0.26</td> <td></td> </tr><tr><th scope="row">--disable-keys</th> <td>Para cada tabela, rode as instruções INSERT com instruções para desabilitar e habilitar chaves</td> <td></td> <td></td> </tr><tr><th scope="row">--dump-date</th> <td>Incluir a data do dump como comentário de "Dump completado em" se a opção --comments for fornecida</td> <td></td> <td></td> </tr><tr><th scope="row">--dump-replica</th> <td>Incluir a declaração CHANGE REPLICATION SOURCE TO que lista as coordenadas de log binário da fonte do replica.</td> <td>8.0.26</td> <td></td> </tr><tr><th scope="row">--dump-slave</th> <td>Incluir a declaração CHANGE MASTER que lista as coordenadas de log binário da fonte da replica</td> <td></td> <td>8.0.26</td> </tr><tr><th scope="row">--enable-cleartext-plugin</th> <td>Habilitar o plugin de autenticação de texto claro</td> <td></td> <td></td> </tr><tr><th scope="row">--events</th> <td>Eventos de descarte de bancos de dados descartados</td> <td></td> <td></td> </tr><tr><th scope="row">--extended-insert</th> <td>Use a sintaxe de inserção de várias linhas</td> <td></td> <td></td> </tr><tr><th scope="row">--fields-enclosed-by</th> <td>Esta opção é usada com a opção --tab e tem o mesmo significado que a cláusula correspondente para LOAD DATA</td> <td></td> <td></td> </tr><tr><th scope="row">--fields-escaped-by</th> <td>Esta opção é usada com a opção --tab e tem o mesmo significado que a cláusula correspondente para LOAD DATA</td> <td></td> <td></td> </tr><tr><th scope="row">--fields-optionally-enclosed-by</th> <td>Esta opção é usada com a opção --tab e tem o mesmo significado que a cláusula correspondente para LOAD DATA</td> <td></td> <td></td> </tr><tr><th scope="row">--fields-terminated-by</th> <td>Esta opção é usada com a opção --tab e tem o mesmo significado que a cláusula correspondente para LOAD DATA</td> <td></td> <td></td> </tr><tr><th scope="row">--flush-logs</th> <td>Limpe os arquivos de registro do servidor MySQL antes de iniciar o dump</td> <td></td> <td></td> </tr><tr><th scope="row">--flush-privileges</th> <td>Emita uma declaração FLUSH PRIVILEGES após descartar o banco de dados mysql</td> <td></td> <td></td> </tr><tr><th scope="row">--force</th> <td>Continue mesmo que um erro SQL ocorra durante um dump de tabela</td> <td></td> <td></td> </tr><tr><th scope="row">--get-server-public-key</th> <td>Solicitar chave pública RSA do servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--help</th> <td>Exibir mensagem de ajuda e sair</td> <td></td> <td></td> </tr><tr><th scope="row">--hex-blob</th> <td>Armazene colunas binárias usando notação hexadecimal</td> <td></td> <td></td> </tr><tr><th scope="row">--host</th> <td>Anfitrião no qual o servidor MySQL está localizado</td> <td></td> <td></td> </tr><tr><th scope="row">--ignore-error</th> <td>Ignore specified errors</td> <td></td> <td></td> </tr><tr><th scope="row">--ignore-table</th> <td>Não descarte a mesa dada</td> <td></td> <td></td> </tr><tr><th scope="row">--include-master-host-port</th> <td>Include MASTER_HOST/MASTER_PORT options in CHANGE MASTER statement produced with --dump-slave</td> <td></td> <td>8.0.26</td> </tr><tr><th scope="row">--include-source-host-port</th> <td>Include SOURCE_HOST and SOURCE_PORT options in CHANGE REPLICATION SOURCE TO statement produced with --dump-replica</td> <td>8.0.26</td> <td></td> </tr><tr><th scope="row">--insert-ignore</th> <td>Escreva INSERT IGNORE em vez de declarações INSERT</td> <td></td> <td></td> </tr><tr><th scope="row">--lines-terminated-by</th> <td>Esta opção é usada com a opção --tab e tem o mesmo significado que a cláusula correspondente para LOAD DATA</td> <td></td> <td></td> </tr><tr><th scope="row">--lock-all-tables</th> <td>Bloquear todas as tabelas em todos os bancos de dados</td> <td></td> <td></td> </tr><tr><th scope="row">--lock-tables</th> <td>Bloquear todas as tabelas antes de fazer o dumping</td> <td></td> <td></td> </tr><tr><th scope="row">--log-error</th> <td>Adicione avisos e erros a um arquivo nomeado</td> <td></td> <td></td> </tr><tr><th scope="row">--login-path</th> <td>Leia as opções de caminho de login a partir de .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th scope="row">--master-data</th> <td>Escreva o nome e a posição do arquivo de registro binário na saída</td> <td></td> <td>8.0.26</td> </tr><tr><th scope="row">--max-allowed-packet</th> <td>Comprimento máximo do pacote para enviar ou receber do servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--mysqld-long-query-time</th> <td>Valor da sessão para o limite de consulta lenta</td> <td>8.0.30</td> <td></td> </tr><tr><th scope="row">--net-buffer-length</th> <td>Buffer size for TCP/IP and socket communication</td> <td></td> <td></td> </tr><tr><th scope="row">--network-timeout</th> <td>Aumente os tempos de espera da rede para permitir descargas maiores de tabelas</td> <td></td> <td></td> </tr><tr><th scope="row">--no-autocommit</th> <td>Envolva as instruções INSERT para cada tabela descarregada dentro de SET autocommit = 0 e as instruções COMMIT</td> <td></td> <td></td> </tr><tr><th scope="row">--no-create-db</th> <td>Não escreva declarações CREATE DATABASE</td> <td></td> <td></td> </tr><tr><th scope="row">--no-create-info</th> <td>Não escreva declarações CREATE TABLE que recriem cada tabela descarregada</td> <td></td> <td></td> </tr><tr><th scope="row">--no-data</th> <td>Não despeje o conteúdo da mesa</td> <td></td> <td></td> </tr><tr><th scope="row">--no-defaults</th> <td>Não leia arquivos de opção</td> <td></td> <td></td> </tr><tr><th scope="row">--no-set-names</th> <td>Same as --skip-set-charset</td> <td></td> <td></td> </tr><tr><th scope="row">--no-tablespaces</th> <td>Não escreva quaisquer declarações de CREATE LOGFILE GROUP ou CREATE TABLESPACE no output</td> <td></td> <td></td> </tr><tr><th scope="row">--opt</th> <td>Abreviação para --add-drop-table --add-locks --create-options --disable-keys --extended-insert --lock-tables --quick --set-charset</td> <td></td> <td></td> </tr><tr><th scope="row">--order-by-primary</th> <td>Exclua as linhas de cada tabela, ordenadas por sua chave primária ou pelo seu primeiro índice único.</td> <td></td> <td></td> </tr><tr><th scope="row">--password</th> <td>Senha para usar ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--password1</th> <td>Primeira senha de autenticação multifatorial a usar ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password2</th> <td>Segunda senha de autenticação multifatorial a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password3</th> <td>Terceira senha de autenticação multifatorial a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--pipe</th> <td>Conecte-se ao servidor usando um tubo nomeado (apenas Windows)</td> <td></td> <td></td> </tr><tr><th scope="row">--plugin-authentication-kerberos-client-mode</th> <td>Permitir autenticação pluggable GSSAPI através da biblioteca MIT Kerberos no Windows</td> <td>8.0.32</td> <td></td> </tr><tr><th scope="row">--plugin-dir</th> <td>Diretório onde os plugins são instalados</td> <td></td> <td></td> </tr><tr><th scope="row">--port</th> <td>TCP/IP port number for connection</td> <td></td> <td></td> </tr><tr><th scope="row">--print-defaults</th> <td>Print default options</td> <td></td> <td></td> </tr><tr><th scope="row">--protocol</th> <td>Protocolo de transporte a ser utilizado</td> <td></td> <td></td> </tr><tr><th scope="row">--quick</th> <td>Recuperar linhas de uma tabela do servidor uma linha de cada vez</td> <td></td> <td></td> </tr><tr><th scope="row">--quote-names</th> <td>Identifique os identificadores de citação dentro de caracteres de backtick</td> <td></td> <td></td> </tr><tr><th scope="row">--replace</th> <td>Escreva declarações REPLACE em vez de declarações INSERT</td> <td></td> <td></td> </tr><tr><th scope="row">--result-file</th> <td>Saída direta para um arquivo específico</td> <td></td> <td></td> </tr><tr><th scope="row">--routines</th> <td>Armazene rotinas armazenadas (procedimentos e funções) de bancos de dados descartados</td> <td></td> <td></td> </tr><tr><th scope="row">--server-public-key-path</th> <td>Nome do caminho para o arquivo que contém a chave pública RSA</td> <td></td> <td></td> </tr><tr><th scope="row">--set-charset</th> <td>Add SET NAMES default_character_set to output</td> <td></td> <td></td> </tr><tr><th scope="row">--set-gtid-purged</th> <td>Whether to add SET @@GLOBAL.GTID_PURGED to output</td> <td></td> <td></td> </tr><tr><th scope="row">--shared-memory-base-name</th> <td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td> <td></td> <td></td> </tr><tr><th scope="row">--show-create-skip-secondary-engine</th> <td>Exclua a cláusula SECONDARY ENGINE dos comandos CREATE TABLE</td> <td>8.0.18</td> <td></td> </tr><tr><th scope="row">--single-transaction</th> <td>Emita uma declaração BEGIN SQL antes de drenar dados do servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-add-drop-table</th> <td>Não adicione uma declaração DROP TABLE antes de cada declaração CREATE TABLE</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-add-locks</th> <td>Não adicione bloqueios</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-comments</th> <td>Não adicione comentários ao arquivo de descarte</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-compact</th> <td>Não produza uma saída mais compacta</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-disable-keys</th> <td>Não desative as teclas</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-extended-insert</th> <td>Turn off extended-insert</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-generated-invisible-primary-key</th> <td>Não inclua chaves primárias primárias invisíveis geradas no arquivo de dump</td> <td>8.0.30</td> <td></td> </tr><tr><th scope="row">--skip-opt</th> <td>Desative as opções definidas por --opt</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-quick</th> <td>Não retorne linhas de uma tabela do servidor uma linha de cada vez</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-quote-names</th> <td>Não cite identificadores</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-set-charset</th> <td>Não escreva a declaração SET NAMES</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-triggers</th> <td>Não descarte gatilhos</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-tz-utc</th> <td>Turn off tz-utc</td> <td></td> <td></td> </tr><tr><th scope="row">--socket</th> <td>Arquivo de socket Unix ou tubo nomeado do Windows a ser usado</td> <td></td> <td></td> </tr><tr><th scope="row">--source-data</th> <td>Escreva o nome e a posição do arquivo de registro binário na saída</td> <td>8.0.26</td> <td></td> </tr><tr><th scope="row">--ssl-ca</th> <td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-capath</th> <td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cert</th> <td>Arquivo que contém o certificado X.509</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cipher</th> <td>Cifras permitidas para criptografia de conexão</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crl</th> <td>Arquivo que contém listas de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crlpath</th> <td>Diretório que contém arquivos de lista de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-fips-mode</th> <td>Se deve habilitar o modo FIPS no lado do cliente</td> <td></td> <td>8.0.34</td> </tr><tr><th scope="row">--ssl-key</th> <td>Arquivo que contém a chave X.509</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-mode</th> <td>Estado de segurança desejado da conexão com o servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-session-data</th> <td>Arquivo que contém dados da sessão SSL</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--ssl-session-data-continue-on-failed-reuse</th> <td>Se estabelecer conexões se a reutilização da sessão falhar</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--tab</th> <td>Produza arquivos de dados separados por tabulação</td> <td></td> <td></td> </tr><tr><th scope="row">--tables</th> <td>Supraposição da opção --databases ou -B</td> <td></td> <td></td> </tr><tr><th scope="row">--tls-ciphersuites</th> <td>Cifras TLSv1.3 permitidas para conexões criptografadas</td> <td>8.0.16</td> <td></td> </tr><tr><th scope="row">--tls-version</th> <td>Protocolos TLS permitidos para conexões criptografadas</td> <td></td> <td></td> </tr><tr><th scope="row">--triggers</th> <td>Triggers de descarte para cada tabela descartada</td> <td></td> <td></td> </tr><tr><th scope="row">--tz-utc</th> <td>Add SET TIME_ZONE='+00:00' to dump file</td> <td></td> <td></td> </tr><tr><th scope="row">--user</th> <td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--verbose</th> <td>Verbose mode</td> <td></td> <td></td> </tr><tr><th scope="row">--version</th> <td>Exibir informações da versão e sair</td> <td></td> <td></td> </tr><tr><th scope="row">--where</th> <td>Exclua apenas as linhas selecionadas pela condição WHERE dada</td> <td></td> <td></td> </tr><tr><th scope="row">--xml</th> <td>Produce XML output</td> <td></td> <td></td> </tr><tr><th scope="row">--zstd-compression-level</th> <td>Nível de compressão para conexões ao servidor que utilizam compressão zstd</td> <td>8.0.18</td> <td></td> </tr></tbody></table>

#### Opções de conexão

O comando **mysqldump** faz login em um servidor MySQL para extrair informações. As seguintes opções especificam como se conectar ao servidor MySQL, seja na mesma máquina ou em um sistema remoto.

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

Em um computador com várias interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao servidor MySQL.

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

Compressa todas as informações enviadas entre o cliente e o servidor, se possível. Veja a Seção 6.2.8, “Controle de Compressão de Conexão”.

A partir do MySQL 8.0.18, essa opção é desatualizada. A espera é que ela seja removida em uma versão futura do MySQL. Veja Configurando Compressão de Conexão Legada.

* `--compression-algorithms=value`

  <table frame="box" rules="all" summary="Properties for compression-algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compression-algorithms=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>uncompressed</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>zlib</code></p><p class="valid-value"><code>zstd</code></p><p class="valid-value"><code>uncompressed</code></p></td> </tr></tbody></table>

Os algoritmos de compressão permitidos para conexões ao servidor. Os algoritmos disponíveis são os mesmos que para a variável de sistema `protocol_compression_algorithms`. O valor padrão é `uncompressed`.

Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

Essa opção foi adicionada no MySQL 8.0.18.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Veja a Seção 8.2.17, “Autenticação substituível”.

* `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Properties for enable-cleartext-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

Ative o plugin de autenticação de texto claro `mysql_clear_password`. (Veja a Seção 8.4.1.4, “Autenticação de Texto Claro Plugável do Lado do Cliente”).

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Properties for get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>

Solicitar a chave pública necessária para a troca de senha baseada em par de chaves RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

Para informações sobre o plugin `caching_sha2_password`, consulte a Seção 8.4.1.2, “Cacheamento de Autenticação Alterável SHA-2”.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>

Arraste os dados do servidor MySQL para o host fornecido. O host padrão é `localhost`.

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam para qual servidor MySQL se conectar e qual conta se autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql_config_editor**. Veja a Seção 6.6.7, “mysql_config_editor — Utilitário de Configuração MySQL”.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecida, o **mysqldump** solicitará uma senha. Se for fornecida, não deve haver *espaço* entre `--password=` ou `-p` e a senha que a segue. Se não for especificado nenhum tipo de opção de senha, o padrão é não enviar senha.

Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Veja a Seção 8.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

Para especificar explicitamente que não há senha e que o **mysqldump** não deve solicitar uma senha, use a opção `--skip-password`.

* `--password1[=pass_val]`

A senha para o fator de autenticação multifatorial 1 da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysqldump** solicita uma senha. Se for fornecida, não deve haver **espaço** entre `--password1=` e a senha que a segue. Se não for especificado nenhum tipo de senha, o padrão é não enviar senha.

Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Veja a Seção 8.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

Para especificar explicitamente que não há senha e que o **mysqldump** não deve solicitar uma senha, use a opção `--skip-password1`.

`--password1` e `--password` são sinônimos, assim como `--skip-password1` e `--skip-password`.

* `--password2[=pass_val]`

A senha para o fator de autenticação multifatorial 2 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica para `--password1`; consulte a descrição dessa opção para obter detalhes.

* `--password3[=pass_val]`

A senha para o fator de autenticação multifatorial 3 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica para `--password1`; consulte a descrição dessa opção para obter detalhes.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>0

Em Windows, conecte-se ao servidor usando um tubo nomeado. Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por tubo nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--plugin-authentication-kerberos-client-mode=value`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>1

Em Windows, o plugin de autenticação `authentication_kerberos_client` suporta essa opção do plugin. Ele fornece dois valores possíveis que o usuário do cliente pode definir em tempo de execução: `SSPI` e `GSSAPI`.

O valor padrão para a opção do plugin do lado do cliente usa a Interface de Suporte de Segurança (SSPI), que é capaz de adquirir credenciais do cache de memória do Windows. Alternativamente, o usuário do cliente pode selecionar um modo que suporte a Interface de Programa de Aplicação de Serviço de Segurança Genérico (GSSAPI) através da biblioteca MIT Kerberos no Windows. O GSSAPI é capaz de adquirir credenciais armazenadas previamente geradas usando o comando **kinit**.

Para mais informações, consulte [Comandos para clientes Windows no modo GSSAPI][(kerberos-pluggable-authentication.html#kerberos-usage-win-gssapi-client-commands)].

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>2

O diretório onde procurar plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o **mysqldump** não o encontrar. Veja a Seção 8.2.17, “Autenticação Conectada”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>3

Para conexões TCP/IP, o número de porta a ser utilizado.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>4

O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de outro protocolo que não o desejado. Para obter detalhes sobre os valores permitidos, consulte a Seção 6.2.7, “Protocolos de Transporte de Conexão”.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>5

O nome do caminho de um arquivo em formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senha com base em par de chave RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

Para `sha256_password`, esta opção só se aplica se o MySQL foi construído usando OpenSSL.

Para informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 8.4.1.3, “Autenticação substituível SHA-256”, e a Seção 8.4.1.2, “Cache de autenticação substituível SHA-2”.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>6

Para conexões a `localhost`, o arquivo de socket Unix a ser usado, ou, no Windows, o nome do tubo nomeado a ser usado.

Em Windows, esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de canal nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--ssl*`

As opções que começam com `--ssl` especificam se deve conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Consulte Opções de comando para conexões criptografadas.

* `--ssl-fips-mode={OFF|ON|STRICT}`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>7

Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere de outras opções `--ssl-xxx` porque não é usada para estabelecer conexões criptografadas, mas sim para determinar quais operações criptográficas devem ser permitidas. Veja a Seção 8.8, “Suporte FIPS”.

Esses valores `--ssl-fips-mode` são permitidos:

+ `OFF`: Desabilitar o modo FIPS.  
  + `ON`: Habilitar o modo FIPS.  
  + `STRICT`: Habilitar o modo FIPS "strict".

Nota

Se o Módulo de Objeto FIPS OpenSSL não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Neste caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente produza um aviso na inicialização e opere no modo não FIPS.

A partir do MySQL 8.0.34, essa opção é desatualizada. A espera é que ela seja removida em uma versão futura do MySQL.

* `--tls-ciphersuites=ciphersuite_list`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>8

As sequências de cifra permitidas para conexões criptografadas que utilizam TLSv1.3. O valor é uma lista de um ou mais nomes de sequência de cifra separados por vírgula. As sequências de cifra que podem ser nomeadas para esta opção dependem da biblioteca SSL utilizada para compilar o MySQL. Para obter detalhes, consulte a Seção 8.3.2, “Protocolos e cifras de conexão criptografada TLS”.

Essa opção foi adicionada no MySQL 8.0.16.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>9

Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolo separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, “Protocolos e cifras TLS de conexão criptografada”.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>0

O nome de usuário da conta MySQL a ser usado para se conectar ao servidor.

Se você estiver usando o plugin `Rewriter` com MySQL 8.0.31 ou posterior, você deve conceder a este usuário o privilégio `SKIP_QUERY_REWRITE`.

* `--zstd-compression-level=level`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>1

O nível de compressão a ser usado para conexões ao servidor que utilizam o algoritmo de compressão `zstd`. Os níveis permitidos são de 1 a 22, com valores maiores indicando níveis crescentes de compressão. O nível de compressão padrão `zstd` é 3. O ajuste do nível de compressão não afeta as conexões que não utilizam compressão `zstd`.

Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

Essa opção foi adicionada no MySQL 8.0.18.

#### Opções de Arquivo Opções

Essas opções são usadas para controlar quais arquivos de opção devem ser lidos.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>2

Leia este arquivo de opção após o arquivo de opção global, mas (em Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>3

Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Exceção: Mesmo com `--defaults-file`, os programas de cliente leem `.mylogin.cnf`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>4

Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, o **mysqldump** normalmente lê os grupos `[client]` e `[mysqldump]`. Se esta opção for dada como `--defaults-group-suffix=_other`, o **mysqldump** também lê os grupos `[client_other]` e `[mysqldump_other]`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>5

Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para impedir que elas sejam lidas.

A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar o `.mylogin.cnf`, use o utilitário **mysql_config_editor**. Veja a Seção 6.6.7, “mysql_config_editor — Ferramenta de Configuração do MySQL”.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>6

Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

#### Opções de DDL

Os cenários de uso do **mysqldump** incluem configurar uma nova instância completa do MySQL (incluindo tabelas de banco de dados) e substituir dados em uma instância existente por bancos de dados e tabelas existentes. As seguintes opções permitem especificar quais coisas devem ser desmontadas e configuradas ao restaurar um dump, codificando várias declarações DDL no arquivo de dump.

* `--add-drop-database`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>7

Escreva uma declaração `DROP DATABASE` antes de cada declaração `CREATE DATABASE`(create-database.html "15.1.12 CREATE DATABASE Statement"). Esta opção é tipicamente usada em conjunto com a opção `--all-databases` ou `--databases`, pois nenhuma declaração `CREATE DATABASE` é escrita a menos que uma dessas opções seja especificada.

Nota

No MySQL 8.0, o esquema `mysql` é considerado um esquema do sistema que não pode ser excluído por usuários finais. Se `--add-drop-database` for usado com `--add-drop-database` ou com `--all-databases` onde a lista de esquemas a serem excluídos inclui `mysql`, o arquivo de dump contém uma declaração `` DROP DATABASE `mysql` `` que causa um erro quando o arquivo de dump é carregado novamente.

Em vez disso, para usar `--add-drop-database`, use `--databases` com uma lista de esquemas a serem descartados, onde a lista não inclui `mysql`.

* `--add-drop-table`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>8

Escreva uma declaração `DROP TABLE` antes de cada declaração `CREATE TABLE`.

* `--add-drop-trigger`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>9

Escreva uma declaração `DROP TRIGGER` antes de cada declaração `CREATE TRIGGER`(create-trigger.html "15.1.22 CREATE TRIGGER Statement").

* `--all-tablespaces`, `-Y`

  <table frame="box" rules="all" summary="Properties for compression-algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compression-algorithms=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>uncompressed</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>zlib</code></p><p class="valid-value"><code>zstd</code></p><p class="valid-value"><code>uncompressed</code></p></td> </tr></tbody></table>0

Adiciona a um dump de tabela todas as instruções SQL necessárias para criar quaisquer espaços de tabela utilizados por uma tabela `NDB`. Essas informações não estão incluídas de outra forma na saída do **mysqldump**. Esta opção atualmente é relevante apenas para tabelas do NDB Cluster.

* `--no-create-db`, `-n`

  <table frame="box" rules="all" summary="Properties for compression-algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compression-algorithms=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>uncompressed</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>zlib</code></p><p class="valid-value"><code>zstd</code></p><p class="valid-value"><code>uncompressed</code></p></td> </tr></tbody></table>1

Suprima as declarações `CREATE DATABASE` que, de outra forma, estão incluídas na saída se a opção `--databases` ou `--all-databases` for dada.

* `--no-create-info`, `-t`

  <table frame="box" rules="all" summary="Properties for compression-algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compression-algorithms=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>uncompressed</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>zlib</code></p><p class="valid-value"><code>zstd</code></p><p class="valid-value"><code>uncompressed</code></p></td> </tr></tbody></table>2

Não escreva declarações `CREATE TABLE` que criem cada tabela descarregada.

Nota

Essa opção *não* exclui declarações que criam grupos de arquivos de registro ou espaços de tabela do **mysqldump** do resultado; no entanto, você pode usar a opção `--no-tablespaces` para esse propósito.

* `--no-tablespaces`, `-y`

  <table frame="box" rules="all" summary="Properties for compression-algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compression-algorithms=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>uncompressed</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>zlib</code></p><p class="valid-value"><code>zstd</code></p><p class="valid-value"><code>uncompressed</code></p></td> </tr></tbody></table>3

Essa opção suprime todas as declarações `CREATE LOGFILE GROUP`(create-logfile-group.html "15.1.16 CREATE LOGFILE GROUP Statement") e `CREATE TABLESPACE`(create-tablespace.html "15.1.21 CREATE TABLESPACE Statement") na saída do **mysqldump**.

* `--replace`

  <table frame="box" rules="all" summary="Properties for compression-algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compression-algorithms=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>uncompressed</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>zlib</code></p><p class="valid-value"><code>zstd</code></p><p class="valid-value"><code>uncompressed</code></p></td> </tr></tbody></table>4

Escreva declarações `REPLACE` em vez de declarações `INSERT`.

#### Opções de depuração

As seguintes opções imprimem informações de depuração, codificam informações de depuração no arquivo de depuração ou permitem que a operação de depuração prossiga, independentemente dos problemas potenciais.

* `--allow-keywords`

  <table frame="box" rules="all" summary="Properties for compression-algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compression-algorithms=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>uncompressed</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>zlib</code></p><p class="valid-value"><code>zstd</code></p><p class="valid-value"><code>uncompressed</code></p></td> </tr></tbody></table>5

Permite a criação de nomes de colunas que são palavras-chave. Isso funciona prefixando cada nome de coluna com o nome da tabela.

* `--comments`, `-i`

  <table frame="box" rules="all" summary="Properties for compression-algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compression-algorithms=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>uncompressed</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>zlib</code></p><p class="valid-value"><code>zstd</code></p><p class="valid-value"><code>uncompressed</code></p></td> </tr></tbody></table>6

Escreva informações adicionais no arquivo de dump, como a versão do programa, a versão do servidor e o host. Esta opção é ativada por padrão. Para suprimir essas informações adicionais, use `--skip-comments`.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Properties for compression-algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compression-algorithms=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>uncompressed</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>zlib</code></p><p class="valid-value"><code>zstd</code></p><p class="valid-value"><code>uncompressed</code></p></td> </tr></tbody></table>7

Escreva um registro de depuração. Uma string típica *`debug_options`* é `d:t:o,file_name`. O valor padrão é `d:t:o,/tmp/mysqldump.trace`.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--debug-check`

  <table frame="box" rules="all" summary="Properties for compression-algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compression-algorithms=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>uncompressed</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>zlib</code></p><p class="valid-value"><code>zstd</code></p><p class="valid-value"><code>uncompressed</code></p></td> </tr></tbody></table>8

Imprima algumas informações de depuração quando o programa sair.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--debug-info`

  <table frame="box" rules="all" summary="Properties for compression-algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compression-algorithms=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>uncompressed</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>zlib</code></p><p class="valid-value"><code>zstd</code></p><p class="valid-value"><code>uncompressed</code></p></td> </tr></tbody></table>9

Imprimir informações de depuração e estatísticas de uso de memória e CPU quando o programa sai.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--dump-date`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>0

Se a opção `--comments` for fornecida, o **mysqldump** produz um comentário no final do dump da seguinte forma:

  ```
  -- Dump completed on DATE
  ```

No entanto, as datas que causam arquivos de descarte tomados em diferentes momentos parecem ser diferentes, mesmo que os dados sejam, de outra forma, idênticos. `--dump-date` e `--skip-dump-date` controlam se a data é adicionada ao comentário. A opção padrão é `--dump-date` (inclua a data no comentário). `--skip-dump-date` suprime a impressão da data.

* `--force`, `-f`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>1

Ignore todos os erros; continue mesmo que um erro SQL ocorra durante um dump de tabela.

Uma utilização desta opção é fazer com que o **mysqldump** continue a ser executado mesmo quando ele encontrar uma visão que se tornou inválida porque a definição se refere a uma tabela que foi eliminada. Sem `--force`, o **mysqldump** sai com uma mensagem de erro. Com `--force`, o **mysqldump** imprime a mensagem de erro, mas também escreve um comentário SQL contendo a definição da visão na saída do dump e continua a ser executado.

Se a opção `--ignore-error` também for dada para ignorar erros específicos, a `--force` tem precedência.

* `--log-error=file_name`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>2

Registre as advertências e erros, anexando-os ao arquivo nomeado. O padrão é não registrar nada.

* `--skip-comments`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>3

Veja a descrição para a opção `--comments`.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>4

Modo detalhado. Imprima mais informações sobre o que o programa faz.

#### Opções de Ajuda

As opções a seguir exibem informações sobre o próprio comando **mysqldump**.

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>5

Exibir uma mensagem de ajuda e sair.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>6

Exibir informações da versão e sair.

#### Opções de internacionalização

As opções a seguir alteram a forma como o comando **mysqldump** representa dados de caracteres com configurações de idioma nacional.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>7

O diretório onde os conjuntos de caracteres são instalados. Veja a Seção 12.15, “Configuração de Conjunto de Caracteres”.

* `--default-character-set=charset_name`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>8

Use *`charset_name`* como o conjunto de caracteres padrão. Veja a Seção 12.15, “Configuração do Conjunto de Caracteres”. Se não for especificado nenhum conjunto de caracteres, o **mysqldump** usa `utf8mb4`.

* `--no-set-names`, `-N`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>9

Desativa o ajuste `--set-charset`, da mesma forma que especificar `--skip-set-charset`.

* `--set-charset`

  <table frame="box" rules="all" summary="Properties for enable-cleartext-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>0

Escreva `SET NAMES default_character_set`(set-names.html "15.7.6.3 SET NAMES Statement") na saída. Esta opção é ativada por padrão. Para suprimir a declaração `SET NAMES`, use `--skip-set-charset`.

#### Opções de Replicação

O comando **mysqldump** é frequentemente usado para criar uma instância vazia ou uma instância que inclua dados em um servidor de replicação em uma configuração de replicação. As seguintes opções se aplicam ao descarte e ao restabelecimento de dados em servidores de origem de replicação e réplicas.

* `--apply-replica-statements`

  <table frame="box" rules="all" summary="Properties for enable-cleartext-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>1

A partir do MySQL 8.0.26, use `--apply-replica-statements`, e antes do MySQL 8.0.26, use `--apply-slave-statements`. Ambas as opções têm o mesmo efeito. Para um dump de replica produzido com a opção `--dump-replica` ou `--dump-slave`, as opções adicionam uma declaração [`STOP REPLICA`](stop-replica.html "15.4.2.8 STOP REPLICA Statement") (ou antes do MySQL 8.0.22, [`STOP SLAVE`](stop-slave.html "15.4.2.9 STOP SLAVE Statement")) antes da declaração com as coordenadas do log binário, e uma declaração [`START REPLICA`](start-replica.html "15.4.2.6 START REPLICA Statement") no final da saída.

* `--apply-slave-statements`

  <table frame="box" rules="all" summary="Properties for enable-cleartext-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>2

Use esta opção antes do MySQL 8.0.26 em vez de `--apply-replica-statements`. Ambas as opções têm o mesmo efeito.

* `--delete-source-logs`

  <table frame="box" rules="all" summary="Properties for enable-cleartext-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>3

A partir do MySQL 8.0.26, use `--delete-source-logs`, e antes do MySQL 8.0.26, use `--delete-master-logs`. Ambas as opções têm o mesmo efeito. Em um servidor de origem de replicação, as opções apagam os registros binários enviando uma declaração `PURGE BINARY LOGS` para o servidor após realizar a operação de dump. As opções exigem o privilégio `RELOAD`, bem como privilégios suficientes para executar essa declaração. As opções habilitam automaticamente `--source-data` ou `--master-data` automaticamente.

* `--delete-master-logs`

  <table frame="box" rules="all" summary="Properties for enable-cleartext-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>4

Use esta opção antes do MySQL 8.0.26 em vez de `--delete-source-logs`. Ambas as opções têm o mesmo efeito.

* `--dump-replica[=value]`

  <table frame="box" rules="all" summary="Properties for enable-cleartext-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>5

A partir do MySQL 8.0.26, use `--dump-replica`, e antes do MySQL 8.0.26, use `--dump-slave`. Ambas as opções têm o mesmo efeito. As opções são semelhantes a `--source-data`, exceto que são usadas para drenar um servidor replica que produza um arquivo de dump que pode ser usado para configurar outro servidor como uma replica que tenha a mesma fonte do servidor drenado. As opções fazem com que a saída do dump inclua uma declaração `CHANGE REPLICATION SOURCE TO` (do MySQL 8.0.23) ou declaração (change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement")`CHANGE MASTER TO`(change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") (antes do MySQL 8.0.23) que indica as coordenadas do log binário (nome do arquivo e posição) da fonte da replica drenada. A declaração `CHANGE REPLICATION SOURCE TO` lê os valores de `Relay_Master_Log_File` e `Exec_Master_Log_Pos` da saída [`SHOW REPLICA STATUS`(show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement") e os usa para `SOURCE_LOG_FILE` e `SOURCE_LOG_POS`, respectivamente. Essas são as coordenadas do servidor fonte da replica de onde a replica começa a replicar.

Nota

Inconsistências na sequência de transações do log de relevo que foram executadas podem causar o uso da posição errada. Consulte a Seção 19.5.1.34, “Replicação e Inconsistências de Transações”, para obter mais informações.

`--dump-replica` ou `--dump-slave` faz com que as coordenadas da fonte sejam usadas em vez das do servidor descarregado, como é feito pela opção `--source-data` ou `--master-data`. Além disso, especificar esta opção faz com que a opção `--source-data` ou `--master-data` seja substituída, se usada, e efetivamente ignorada.

Aviso

`--dump-replica` ou `--dump-slave` não devem ser utilizados se o servidor onde o dump vai ser aplicado usa `gtid_mode=ON` e `SOURCE_AUTO_POSITION=1` ou `MASTER_AUTO_POSITION=1`.

O valor da opção é tratado da mesma maneira que para `--source-data`. Definir sem valor ou 1 faz com que a declaração (change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") (do MySQL 8.0.23) ou a declaração `CHANGE MASTER TO` (antes do MySQL 8.0.23) seja escrita no dump. Definir 2 faz com que a declaração seja escrita, mas encapsulada em comentários SQL. Tem o mesmo efeito que `--source-data` em termos de habilitação ou desabilitação de outras opções e na forma como o bloqueio é tratado.

`--dump-replica` ou `--dump-slave` faz com que o **mysqldump** pare o fio de replicação SQL antes do dump e o reinicie novamente depois.

`--dump-replica` ou `--dump-slave` envia uma declaração [`SHOW REPLICA STATUS`(show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement") ao servidor para obter informações, portanto, eles exigem privilégios suficientes para executar essa declaração.

As opções `--apply-replica-statements` e `--include-source-host-port` podem ser usadas em conjunto com `--dump-replica` ou `--dump-slave`.

* `--dump-slave[=value]`

  <table frame="box" rules="all" summary="Properties for enable-cleartext-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>6

Use esta opção antes do MySQL 8.0.26 em vez de `--dump-replica`. Ambas as opções têm o mesmo efeito.

* `--include-source-host-port`

  <table frame="box" rules="all" summary="Properties for enable-cleartext-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>7

A partir do MySQL 8.0.26, use `--include-source-host-port`, e antes do MySQL 8.0.26, use `--include-master-host-port`. Ambas as opções têm o mesmo efeito. As opções adicionam as opções `SOURCE_HOST` | `MASTER_HOST` e `SOURCE_PORT` | `MASTER_PORT` para o nome do host e o número de porta TCP/IP da fonte da replica, à declaração `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou à declaração [`CHANGE MASTER TO`](change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") (antes do MySQL 8.0.23) em um dump de replica produzido com a opção `--dump-replica` ou `--dump-slave`.

* `--include-master-host-port`

  <table frame="box" rules="all" summary="Properties for enable-cleartext-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>8

Use esta opção antes do MySQL 8.0.26 em vez de `--include-source-host-port`. Ambas as opções têm o mesmo efeito.

* `--source-data[=value]`

  <table frame="box" rules="all" summary="Properties for enable-cleartext-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>9

A partir do MySQL 8.0.26, use `--source-data`, e antes do MySQL 8.0.26, use `--master-data`. Ambas as opções têm o mesmo efeito. As opções são usadas para drenar um servidor de fonte de replicação para produzir um arquivo de dump que pode ser usado para configurar outro servidor como uma réplica da fonte. As opções fazem com que a saída do dump inclua uma declaração `CHANGE REPLICATION SOURCE TO` (do MySQL 8.0.23) ou declaração (change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement")(change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") (antes do MySQL 8.0.23) que indica as coordenadas do log binário (nome do arquivo e posição) do servidor descartado. Essas são as coordenadas do servidor de fonte de replicação de onde a réplica deve começar a replicar após carregar o arquivo de dump na réplica.

Se o valor da opção for 2, a declaração `CHANGE REPLICATION SOURCE TO`(change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") | `CHANGE MASTER TO` é escrita como um comentário SQL, e, portanto, é informativa apenas; ela não tem efeito quando o arquivo de implantação é carregado novamente. Se o valor da opção for 1, a declaração não é escrita como um comentário e tem efeito quando o arquivo de implantação é carregado novamente. Se nenhum valor de opção for especificado, o valor padrão é 1.

`--source-data` e `--master-data` enviam uma declaração `SHOW MASTER STATUS` ao servidor para obter informações, portanto, eles requerem privilégios suficientes para executar essa declaração. Esta opção também requer o privilégio `RELOAD` e o log binário deve estar habilitado.

`--source-data` e `--master-data` desativam automaticamente `--lock-tables`. Eles também ativam `--lock-all-tables`, a menos que `--single-transaction` também seja especificado, no qual caso, uma bloqueio de leitura global é adquirido apenas por um curto período no início do dump (veja a descrição para `--single-transaction`). Em todos os casos, qualquer ação nos logs acontece no momento exato do dump.

É também possível configurar uma replica ao descartar uma replica existente da fonte, usando a opção `--dump-replica` ou `--dump-slave`, que substitui `--source-data` e `--master-data` e faz com que eles sejam ignorados.

* `--master-data[=value]`

  <table frame="box" rules="all" summary="Properties for get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>0

Use esta opção antes do MySQL 8.0.26 em vez de `--source-data`. Ambas as opções têm o mesmo efeito.

* `--set-gtid-purged=value`

  <table frame="box" rules="all" summary="Properties for get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>1

Esta opção é para servidores que utilizam replicação baseada em GTID (`gtid_mode=ON`). Ela controla a inclusão de uma declaração `SET @@GLOBAL.gtid_purged` na saída do dump, que atualiza o valor de `gtid_purged` em um servidor onde o arquivo de dump é recarregado, para adicionar o GTID definido da variável de sistema `gtid_executed` do servidor de origem. `gtid_purged` contém os GTIDs de todas as transações que foram aplicadas no servidor, mas não existem em nenhum arquivo de log binário no servidor. Portanto, o **mysqldump** adiciona os GTIDs para as transações que foram executadas no servidor de origem, para que o servidor de destino registre essas transações como aplicadas, embora não as tenha em seus logs binários. `--set-gtid-purged` também controla a inclusão de uma declaração `SET @@SESSION.sql_log_bin=0`, que desativa o registro binário enquanto o arquivo de dump está sendo recarregado. Esta declaração impede que novos GTIDs sejam gerados e atribuídos às transações no arquivo de dump à medida que são executadas, para que os GTIDs originais das transações sejam usados.

Se você não definir a opção `--set-gtid-purged`, o padrão é que uma declaração `SET @@GLOBAL.gtid_purged` seja incluída na saída do dump se GTIDs estiverem habilitados no servidor que você está fazendo backup, e o conjunto de GTIDs no valor global da variável de sistema `gtid_executed` não estiver vazio. Uma declaração `SET @@SESSION.sql_log_bin=0` também é incluída se GTIDs estiverem habilitados no servidor.

Você pode substituir o valor de `gtid_purged` com um conjunto de GTID especificado, ou adicionar um sinal de mais (+) à declaração para anexar um conjunto de GTID especificado ao conjunto de GTID que já é mantido por `gtid_purged`. A declaração `SET @@GLOBAL.gtid_purged` registrada pelo **mysqldump** inclui um sinal de mais (`+`) em um comentário específico da versão, de modo que o MySQL adicione o conjunto de GTID do arquivo de implantação ao valor existente de `gtid_purged`.

É importante notar que o valor que é incluído pelo **mysqldump** para a declaração `SET @@GLOBAL.gtid_purged` inclui os GTIDs de todas as transações no conjunto `gtid_executed` no servidor, mesmo aquelas que alteraram partes suprimidas do banco de dados, ou outros bancos de dados no servidor que não foram incluídos em um dump parcial. Isso pode significar que, após o valor do `gtid_purged` ter sido atualizado no servidor onde o arquivo de dump é reinterpretado, os GTIDs estão presentes e não se relacionam com nenhum dado no servidor alvo. Se você não reinterprete mais arquivos de dump no servidor alvo, os GTIDs estranhos não causam problemas com a futura operação do servidor, mas tornam mais difícil comparar ou conciliar os conjuntos de GTIDs em diferentes servidores na topologia de replicação. Se você reinterprete mais um arquivo de dump no servidor alvo que contém os mesmos GTIDs (por exemplo, outro dump parcial do mesmo servidor de origem), qualquer declaração `SET @@GLOBAL.gtid_purged` no segundo arquivo de dump falha. Neste caso, ou remova a declaração manualmente antes de reinterprete o arquivo de dump, ou produza o arquivo de dump sem a declaração.

Antes do MySQL 8.0.32: O uso desta opção com a opção `--single-transaction` pode levar a inconsistências na saída. Se `--set-gtid-purged=ON` for necessário, pode ser usado com `--lock-all-tables`, mas isso pode impedir consultas paralelas enquanto o **mysqldump** está sendo executado.

Se a declaração `SET @@GLOBAL.gtid_purged` não produzir o resultado desejado no servidor alvo, você pode excluir a declaração da saída ou (a partir do MySQL 8.0.17) incluí-la, mas comentá-la para que não seja executada automaticamente. Você também pode incluir a declaração, mas editá-la manualmente no arquivo de dump para obter o resultado desejado.

Os possíveis valores para a opção `--set-gtid-purged` são os seguintes:

`AUTO` :   O valor padrão. Se GTIDs estiverem habilitados no servidor que está fazendo o backup e `gtid_executed` não estiver vazio, `SET @@GLOBAL.gtid_purged` é adicionado ao resultado, contendo o conjunto de GTIDs de `gtid_executed`. Se GTIDs estiverem habilitados, `SET @@SESSION.sql_log_bin=0` é adicionado ao resultado. Se GTIDs não estiverem habilitados no servidor, as declarações não são adicionadas ao resultado.

`OFF` :   `SET @@GLOBAL.gtid_purged` não é adicionado à saída, e `SET @@SESSION.sql_log_bin=0` não é adicionado à saída. Para um servidor onde os GTIDs não são utilizados, use esta opção ou `AUTO`. Use esta opção apenas para um servidor onde os GTIDs são utilizados se você tiver certeza de que o conjunto de GTIDs necessário já está presente em `gtid_purged` no servidor de destino e não deve ser alterado, ou se você planeja identificar e adicionar manualmente quaisquer GTIDs ausentes.

`ON` :   Se os GTIDs estiverem habilitados no servidor que você está fazendo backup, `SET @@GLOBAL.gtid_purged` é adicionado ao resultado (a menos que `gtid_executed` esteja vazio), e `SET @@SESSION.sql_log_bin=0` é adicionado ao resultado. Um erro ocorre se você definir esta opção, mas os GTIDs não estiverem habilitados no servidor. Para um servidor onde os GTIDs estão em uso, use esta opção ou `AUTO`, a menos que você esteja certo de que os GTIDs em `gtid_executed` não são necessários no servidor de destino.

`COMMENTED` : Disponível a partir do MySQL 8.0.17. Se GTIDs estiverem habilitados no servidor que você está fazendo backup, `SET @@GLOBAL.gtid_purged` é adicionado ao resultado (a menos que `gtid_executed` esteja vazio), mas ele é comentado. Isso significa que o valor de `gtid_executed` está disponível no resultado, mas nenhuma ação é realizada automaticamente quando o arquivo de dump é carregado novamente. `SET @@SESSION.sql_log_bin=0` é adicionado ao resultado, e ele não é comentado. Com `COMMENTED`, você pode controlar o uso do conjunto `gtid_executed` manualmente ou por meio de automação. Por exemplo, você pode preferir fazer isso se estiver migrando dados para outro servidor que já tem diferentes bancos de dados ativos.

#### Opções de formato

As opções a seguir especificam como representar todo o arquivo de depuração ou certos tipos de dados no arquivo de depuração. Elas também controlam se certas informações opcionais são escritas no arquivo de depuração.

* `--compact`

  <table frame="box" rules="all" summary="Properties for get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>2

Produza uma saída mais compacta. Esta opção habilita as opções `--skip-add-drop-table`, `--skip-add-locks`, `--skip-comments`, `--skip-disable-keys` e `--skip-set-charset`.

* `--compatible=name`

  <table frame="box" rules="all" summary="Properties for get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>3

Produza uma saída mais compatível com outros sistemas de banco de dados ou com servidores MySQL mais antigos. O único valor permitido para esta opção é `ansi`, que tem o mesmo significado que a opção correspondente para definir o modo SQL do servidor. Veja a Seção 7.1.11, “Modos SQL do servidor”.

* `--complete-insert`, `-c`

  <table frame="box" rules="all" summary="Properties for get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>4

Utilize declarações completas do `INSERT` que incluam os nomes das colunas.

* `--create-options`

  <table frame="box" rules="all" summary="Properties for get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>5

Inclua todas as opções de tabela específicas do MySQL nas declarações `CREATE TABLE`.

* `--fields-terminated-by=...`, `--fields-enclosed-by=...`, `--fields-optionally-enclosed-by=...`, `--fields-escaped-by=...`

  <table frame="box" rules="all" summary="Properties for get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>6

  <table frame="box" rules="all" summary="Properties for get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>7

  <table frame="box" rules="all" summary="Properties for get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>8

  <table frame="box" rules="all" summary="Properties for get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>9

Essas opções são usadas com a opção `--tab` e têm o mesmo significado das cláusulas correspondentes `FIELDS` para `LOAD DATA`. Veja a Seção 15.2.9, “Instrução LOAD DATA”.

* `--hex-blob`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>0

Arraste colunas binárias usando notação hexadecimal (por exemplo, `'abc'` se torna `0x616263`). Os tipos de dados afetados são os tipos `BINARY`, `VARBINARY`, `BLOB` `BIT`, todos os tipos de dados espaciais e outros tipos de dados não binários quando usados com o conjunto de caracteres `binary`(charset-binary-set.html "12.10.8 The Binary Character Set").

A opção `--hex-blob` é ignorada quando o `--tab` é usado.

* `--lines-terminated-by=...`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>1

Esta opção é usada com a opção `--tab` e tem o mesmo significado que a cláusula correspondente `LINES` para `LOAD DATA`. Veja a Seção 15.2.9, “Instrução LOAD DATA”.

* `--quote-names`, `-Q`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>2

Identificador de citações (como nomes de banco de dados, tabela e coluna) dentro de `` ` ` characters. If the ` ANSI_QUOTES ` SQL mode is enabled, identifiers are quoted within ` `` characters. This option is enabled by default. It can be disabled with `--skip-quote-names `, but this option should be given after any option such as `--compatible ` that may enable `--quote-names`.

* `--result-file=file_name`, `-r file_name`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>3

Saída direta para o arquivo nomeado. O arquivo de resultado é criado e seus conteúdos anteriores são sobrescritos, mesmo que um erro ocorra durante a geração do dump.

Essa opção deve ser usada no Windows para evitar que os caracteres de nova linha `\n` sejam convertidos em sequências de retorno de carro/nova linha `\r\n`.

* `--show-create-skip-secondary-engine=value`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>4

Exclui a cláusula `SECONDARY ENGINE` das declarações de `CREATE TABLE`. Isso é feito habilitando a variável de sistema `show_create_table_skip_secondary_engine` durante a operação de dump. Alternativamente, você pode habilitar a variável de sistema `show_create_table_skip_secondary_engine` antes de usar o **mysqldump**.

Essa opção foi adicionada no MySQL 8.0.18. Tentativa de uma operação **mysqldump** com a opção `--show-create-skip-secondary-engine` em uma versão anterior ao MySQL 8.0.18 que não suporta a variável `show_create_table_skip_secondary_engine` causa um erro.

* `--tab=dir_name`, `-T dir_name`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>5

Produza arquivos de dados no formato de texto separados por tabulação. Para cada tabela descarregada, o **mysqldump** cria um arquivo `tbl_name.sql` que contém a declaração [`CREATE TABLE`](create-table.html "15.1.20 CREATE TABLE Statement") que cria a tabela, e o servidor escreve um arquivo `tbl_name.txt` que contém seus dados. O valor da opção é o diretório em que os arquivos serão escritos.

Nota

Essa opção deve ser usada apenas quando o **mysqldump** é executado na mesma máquina que o servidor **mysqld**. Como o servidor cria os arquivos `*.txt` no diretório que você especifica, o diretório deve ser legível pelo servidor e a conta do MySQL que você usa deve ter o privilégio `FILE`. Como o **mysqldump** cria `*.sql` no mesmo diretório, ele deve ser legível pela conta de login do seu sistema.

Por padrão, os arquivos de dados `.txt` são formatados usando caracteres de tabulação entre os valores das colunas e uma nova linha no final de cada linha. O formato pode ser especificado explicitamente usando as opções `--fields-xxx` e `--lines-terminated-by`.

Os valores das colunas são convertidos para o conjunto de caracteres especificado pela opção `--default-character-set`.

* `--tz-utc`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>6

Esta opção permite que as colunas `TIMESTAMP` sejam descarregadas e recarregadas entre servidores em diferentes fusos horários. O **mysqldump** define seu fuso horário de conexão como UTC e adiciona `SET TIME_ZONE='+00:00'` ao arquivo de dump. Sem esta opção, as colunas `TIMESTAMP` são descarregadas e recarregadas nos fusos horários locais dos servidores de origem e destino, o que pode causar alterações nos valores se os servidores estiverem em diferentes fusos horários. `--tz-utc` também protege contra mudanças devido ao horário de verão. `--tz-utc` é habilitado por padrão. Para desabilitá-lo, use `--skip-tz-utc`.

* `--xml`, `-X`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>7

Escreva a saída do dump como XML bem formado.

**`NULL`, `'NULL'` e Valores Vazios**: Para uma coluna denominada *`column_name`*, o valor `NULL`, uma string vazia e o valor da string `'NULL'` são distinguidos um do outro na saída gerada por esta opção da seguinte forma.

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>8

A saída do cliente **mysql** quando executado usando a opção `--xml` também segue as regras anteriores. (Veja a Seção 6.5.1.1, “Opções do cliente mysql”.)

A saída XML do **mysqldump** inclui o espaço de nomes XML, conforme mostrado aqui:

  ```
  $> mysqldump --xml -u root world City
  <?xml version="1.0"?>
  <mysqldump xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <database name="world">
  <table_structure name="City">
  <field Field="ID" Type="int(11)" Null="NO" Key="PRI" Extra="auto_increment" />
  <field Field="Name" Type="char(35)" Null="NO" Key="" Default="" Extra="" />
  <field Field="CountryCode" Type="char(3)" Null="NO" Key="" Default="" Extra="" />
  <field Field="District" Type="char(20)" Null="NO" Key="" Default="" Extra="" />
  <field Field="Population" Type="int(11)" Null="NO" Key="" Default="0" Extra="" />
  <key Table="City" Non_unique="0" Key_name="PRIMARY" Seq_in_index="1" Column_name="ID"
  Collation="A" Cardinality="4079" Null="" Index_type="BTREE" Comment="" />
  <options Name="City" Engine="MyISAM" Version="10" Row_format="Fixed" Rows="4079"
  Avg_row_length="67" Data_length="273293" Max_data_length="18858823439613951"
  Index_length="43008" Data_free="0" Auto_increment="4080"
  Create_time="2007-03-31 01:47:01" Update_time="2007-03-31 01:47:02"
  Collation="latin1_swedish_ci" Create_options="" Comment="" />
  </table_structure>
  <table_data name="City">
  <row>
  <field name="ID">1</field>
  <field name="Name">Kabul</field>
  <field name="CountryCode">AFG</field>
  <field name="District">Kabol</field>
  <field name="Population">1780000</field>
  </row>

  ...

  <row>
  <field name="ID">4079</field>
  <field name="Name">Rafah</field>
  <field name="CountryCode">PSE</field>
  <field name="District">Rafah</field>
  <field name="Population">92020</field>
  </row>
  </table_data>
  </database>
  </mysqldump>
  ```

#### Opções de Filtragem

As seguintes opções controlam quais tipos de objetos do esquema são escritos no arquivo de depuração: por categoria, como gatilhos ou eventos; por nome, por exemplo, escolhendo quais bancos de dados e tabelas devem ser depurados; ou até mesmo filtrando linhas dos dados da tabela usando uma cláusula `WHERE`.

* `--all-databases`, `-A`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>9

Descarte todas as tabelas em todos os bancos de dados. Isso é o mesmo que usar a opção `--databases` e nomear todos os bancos de dados na linha de comando.

Nota

Consulte a descrição do `--add-drop-database` para obter informações sobre uma incompatibilidade dessa opção com o `--all-databases`.

Antes do MySQL 8.0, as opções `--routines` e `--events` para **mysqldump** e **mysqlpump** não eram necessárias para incluir rotinas e eventos armazenados ao usar a opção `--all-databases`: O dump incluía o banco de dados do sistema `mysql`, e, portanto, também as tabelas `mysql.proc` e `mysql.event` que contêm definições de rotinas e eventos armazenados. A partir do MySQL 8.0, as tabelas `mysql.event` e `mysql.proc` não são usadas. As definições dos objetos correspondentes são armazenadas em tabelas do dicionário de dados, mas essas tabelas não são feitas parte do dump. Para incluir rotinas e eventos armazenados em um dump feito usando `--all-databases`, use as opções `--routines` e `--events` explicitamente.

* `--databases`, `-B`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>0

Arraste vários bancos de dados. Normalmente, o **mysqldump** trata o argumento de nome do primeiro na linha de comando como um nome de banco de dados e os nomes seguintes como nomes de tabela. Com esta opção, ele trata todos os argumentos de nome como nomes de banco de dados. As declarações `CREATE DATABASE` (create-database.html "15.1.12 CREATE DATABASE Statement") e `USE` são incluídas na saída antes de cada novo banco de dados.

Essa opção pode ser usada para descartar o banco de dados `performance_schema`, que normalmente não é descartado mesmo com a opção `--all-databases`. (Use também a opção `--skip-lock-tables`.

Nota

Consulte a descrição do `--add-drop-database` para obter informações sobre uma incompatibilidade dessa opção com o `--databases`.

* `--events`, `-E`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>1

Inclua eventos do Agendamento de Eventos para os bancos de dados descartados na saída. Esta opção requer os privilégios `EVENT` para esses bancos de dados.

A saída gerada usando `--events` contém declarações `CREATE EVENT` para criar os eventos.

* `--ignore-error=error[,error]...`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>2

Ignore os erros especificados. O valor da opção é uma lista de números separados por vírgula que especificam os erros a serem ignorados durante a execução do **mysqldump**. Se a opção `--force` também for dada para ignorar todos os erros, a `--force` prevalece.

* `--ignore-table=db_name.tbl_name`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>3

Não descarte a tabela fornecida, que deve ser especificada usando tanto os nomes do banco de dados quanto da tabela. Para ignorar várias tabelas, use esta opção várias vezes. Esta opção também pode ser usada para ignorar visualizações.

* `--no-data`, `-d`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>4

Não escreva nenhuma informação da linha da tabela (ou seja, não descarte o conteúdo da tabela). Isso é útil se você deseja descarregar apenas a declaração `CREATE TABLE` da tabela (por exemplo, para criar uma cópia vazia da tabela carregando o arquivo de descarte).

* `--routines`, `-R`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>5

Inclua rotinas armazenadas (procedimentos e funções) para os bancos de dados descartados na saída. Esta opção requer o privilégio global `SELECT`.

A saída gerada usando `--routines` contém as declarações `CREATE PROCEDURE` e `CREATE FUNCTION` para criar as rotinas.

* `--skip-generated-invisible-primary-key`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>6

Esta opção está disponível a partir do MySQL 8.0.30 e faz com que as chaves primárias invisíveis geradas sejam excluídas da saída. Para mais informações, consulte a Seção 15.1.20.11, “Chaves primárias invisíveis geradas”.

* `--tables`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>7

Supraponha a opção `--databases` ou `-B`. O **mysqldump** considera todos os argumentos de nome que seguem a opção como nomes de tabela.

* `--triggers`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>8

Inclua gatilhos para cada tabela descarregada na saída. Esta opção é ativada por padrão; desative-a com `--skip-triggers`.

Para poder descartar os gatilhos de uma tabela, você deve ter o privilégio `TRIGGER` para a tabela.

Múltiplos gatilhos são permitidos. O **mysqldump** exibe os gatilhos na ordem de ativação, para que, quando o arquivo de dump é carregado novamente, os gatilhos sejam criados na mesma ordem de ativação. No entanto, se um arquivo de dump do **mysqldump** contiver múltiplos gatilhos para uma tabela que tenham o mesmo evento de gatilho e hora de ação, ocorrerá um erro para tentativas de carregar o arquivo de dump em um servidor mais antigo que não suporte múltiplos gatilhos. (Para uma solução alternativa, consulte as Notas de Desempenho; você pode converter os gatilhos para serem compatíveis com servidores mais antigos.)

* `--where='where_condition'`, `-w 'where_condition'`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>9

Exclua apenas as linhas selecionadas pela condição dada `WHERE`. Aspas ao redor da condição são obrigatórias se ela contiver espaços ou outros caracteres especiais para o interpretador do comando.

Exemplos:

  ```
  --where="user='jimf'"
  -w"userid>1"
  -w"userid<1"
  ```

#### Opções de desempenho

As seguintes opções são as mais relevantes para o desempenho, especialmente das operações de restauração. Para conjuntos de dados grandes, a operação de restauração (processando as declarações `INSERT` no arquivo de dump) é a parte que mais consome tempo. Quando é urgente restaurar os dados rapidamente, planeje e teste o desempenho desta etapa com antecedência. Para tempos de restauração medidos em horas, você pode preferir uma solução de backup e restauração alternativa, como o MySQL Enterprise Backup para bancos de dados `InnoDB` e de uso misto.

O desempenho também é afetado pelas opções de [transação][(mysqldump.html#mysqldump-transaction-options "Transactional Options")], principalmente para a operação de descarte.

* `--column-statistics`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>0

Adicione as declarações `ANALYZE TABLE` ao resultado para gerar estatísticas de histograma para tabelas descarregadas quando o arquivo de descarregamento é carregado novamente. Esta opção é desativada por padrão porque a geração de histograma para tabelas grandes pode levar um longo tempo.

* `--disable-keys`, `-K`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>1

Para cada tabela, rode as declarações `INSERT` com as declarações `/*!40000 ALTER TABLE tbl_name DISABLE KEYS */;` e `/*!40000 ALTER TABLE tbl_name ENABLE KEYS */;`. Isso torna o carregamento do arquivo de depuração mais rápido, pois os índices são criados após todas as linhas serem inseridas. Esta opção é eficaz apenas para índices não únicos das tabelas `MyISAM`.

* `--extended-insert`, `-e`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>2

Escreva declarações `INSERT` usando sintaxe de várias linhas que inclua várias listas `VALUES`. Isso resulta em um arquivo de depuração menor e acelera as inserções quando o arquivo é carregado novamente.

* `--insert-ignore`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>3

Escreva declarações `INSERT IGNORE`(insert.html "15.2.7 INSERT Statement") em vez de declarações `INSERT`.

* `--max-allowed-packet=value`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>4

O tamanho máximo do buffer para comunicação cliente/servidor. O padrão é 24 MB, o máximo é 1 GB.

Nota

O valor desta opção é específico para o **mysqldump** e não deve ser confundido com a variável de sistema `max_allowed_packet` do servidor MySQL; o valor do servidor não pode ser excedido por um único pacote do **mysqldump**, independentemente de qualquer configuração para a opção **mysqldump**, mesmo que esta última seja maior.

* `--mysqld-long-query-time=value`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>5

Defina o valor da sessão da variável de sistema `long_query_time`. Use esta opção, que está disponível a partir do MySQL 8.0.30, se você deseja aumentar o tempo permitido para consultas do **mysqldump** antes que elas sejam registradas no arquivo de log de consultas lentas. O **mysqldump** realiza uma varredura completa da tabela, o que significa que suas consultas podem frequentemente exceder o ajuste global `long_query_time` que é útil para consultas regulares. O ajuste global padrão é de 10 segundos.

Você pode usar `--mysqld-long-query-time` para especificar um valor de sessão de 0 (o que significa que todas as consultas do **mysqldump** são registradas no log de consultas lentas) para 31536000, que é 365 dias em segundos. Para a opção do **mysqldump**, você só pode especificar segundos inteiros. Quando você não especifica essa opção, o ajuste global do servidor se aplica às consultas do **mysqldump**.

* `--net-buffer-length=value`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>6

O tamanho inicial do buffer para a comunicação cliente/servidor. Ao criar declarações `INSERT` de várias linhas (como com a opção `--extended-insert` ou `--opt`, o **mysqldump** cria linhas com até `--net-buffer-length` bytes de comprimento. Se você aumentar essa variável, certifique-se de que a variável de sistema do servidor MySQL `net_buffer_length` tenha um valor pelo menos desse tamanho.

* `--network-timeout`, `-M`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>7

Ative a possibilidade de drenar grandes tabelas definindo `--max-allowed-packet` no seu valor máximo e configurando os tempos de espera para leitura e escrita na rede em um valor grande. Esta opção é ativada por padrão. Para desativá-la, use `--skip-network-timeout`.

* `--opt`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>8

Esta opção, habilitada por padrão, é uma abreviação da combinação de `--add-drop-table` `--add-locks` `--create-options` `--disable-keys` `--extended-insert` `--lock-tables` `--quick` `--set-charset`. Ela oferece uma operação de descarte rápida e produz um arquivo de descarte que pode ser carregado novamente em um servidor MySQL rapidamente.

Como a opção `--opt` é habilitada por padrão, você só especifica sua oposta, a `--skip-opt` para desativar várias configurações padrão. Consulte a discussão sobre os grupos de opções (mysqldump.html#mysqldump-option-groups "Option Groups") para obter informações sobre a ativação ou desativação seletiva de um subconjunto das opções afetadas por `--opt`.

* `--quick`, `-q`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>9

Esta opção é útil para descartar tabelas grandes. Ela obriga o **mysqldump** a recuperar linhas de uma tabela do servidor uma linha de cada vez, em vez de recuperar o conjunto completo de linhas e bufferá-lo na memória antes de escrevê-lo.

* `--skip-opt`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>00

Veja a descrição para a opção `--opt`.

#### Opções Transacionais

As seguintes opções sacrificam o desempenho da operação de descarte em prol da confiabilidade e consistência dos dados exportados.

* `--add-locks`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>01

Certifique-se de que cada dump de tabela esteja envolto em `LOCK TABLES`][(lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements") e [`UNLOCK TABLES`][(lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements") declarações. Isso resulta em inserções mais rápidas quando o arquivo de dump é carregado novamente. Veja a Seção 10.2.5.1, “Otimizando declarações INSERT”.

* `--flush-logs`, `-F`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>02

Limpe os arquivos de registro do servidor MySQL antes de iniciar o dump. Esta opção requer o privilégio `RELOAD`. Se você usar esta opção em combinação com a opção `--all-databases`, os registros são limpos *para cada banco de dados dumpado*. A exceção é quando você usa `--lock-all-tables`, `--source-data` ou `--master-data`, ou `--single-transaction`. Nesses casos, os registros são limpos apenas uma vez, correspondendo ao momento em que todas as tabelas são bloqueadas por `FLUSH TABLES WITH READ LOCK`. Se você deseja que seu dump e o esvaziamento do log aconteçam exatamente no mesmo momento, você deve usar `--flush-logs` juntamente com `--lock-all-tables`, `--source-data` ou `--master-data`, ou `--single-transaction`.

* `--flush-privileges`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>03

Adicione uma declaração `FLUSH PRIVILEGES` à saída do dump após o dumping do banco de dados `mysql`. Esta opção deve ser usada sempre que o dump contenha o banco de dados `mysql` e qualquer outro banco de dados que dependa dos dados do banco de dados `mysql` para uma restauração adequada.

Porque o arquivo de depuração contém uma declaração `FLUSH PRIVILEGES`(flush.html#flush-privileges), a recarga do arquivo requer privilégios suficientes para executar essa declaração.

Nota

Para atualizações do MySQL 5.7 ou superior a versões mais antigas, não use `--flush-privileges`. Para instruções de atualização neste caso, consulte a Seção 3.5, “Alterações no MySQL 8.0”.

* `--lock-all-tables`, `-x`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>04

Bloquear todas as tabelas em todos os bancos de dados. Isso é alcançado ao adquirir um bloqueio de leitura global pelo período de todo o dump. Esta opção desativa automaticamente `--single-transaction` e `--lock-tables`.

* `--lock-tables`, `-l`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>05

Para cada banco de dados descartado, bloqueie todas as tabelas que serão descartadas. As tabelas são bloqueadas com `READ LOCAL` para permitir inserções concorrentes no caso das tabelas `MyISAM`. Para tabelas transacionais, como `InnoDB`, `--single-transaction` é uma opção muito melhor do que `--lock-tables`, pois não precisa bloquear as tabelas.

Como o `--lock-tables` bloqueia as tabelas para cada banco de dados separadamente, esta opção não garante que as tabelas no arquivo de dump estejam logicamente consistentes entre os bancos de dados. As tabelas em diferentes bancos de dados podem ser descarregadas em estados completamente diferentes.

Algumas opções, como `--opt`, habilitam automaticamente `--lock-tables`. Se você deseja ignorar isso, use `--skip-lock-tables` no final da lista de opções.

* `--no-autocommit`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>06

Envolva as declarações `INSERT` para cada tabela descarregada dentro das declarações `SET autocommit = 0` e `COMMIT`.

* `--order-by-primary`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>07

Exclua as linhas de cada tabela, ordenadas por sua chave primária ou pelo seu primeiro índice único, se tal índice existir. Isso é útil ao descartar uma tabela `MyISAM` que será carregada em uma tabela `InnoDB`, mas faz com que a operação de descarte leve consideravelmente mais tempo.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>08

Em Windows, o nome de memória compartilhada a ser usado para conexões feitas usando memória compartilhada a um servidor local. O valor padrão é `MYSQL`. O nome de memória compartilhada é sensível a maiúsculas e minúsculas.

Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

* `--single-transaction`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>09

Esta opção define o modo de isolamento de transação para `REPEATABLE READ` e envia uma declaração SQL `START TRANSACTION`(commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") ao servidor antes de drenar os dados. É útil apenas com tabelas transacionais, como `InnoDB`, porque, então, drenar o estado consistente do banco de dados no momento em que `START TRANSACTION`(commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") foi emitido sem bloquear quaisquer aplicativos.

O privilégio `RELOAD` ou `FLUSH_TABLES` é necessário com `--single-transaction` se ambos os `gtid_mode=ON` e `gtid_purged=ON|AUTO` estiverem presentes. Esse requisito foi adicionado no MySQL 8.0.32.

Ao usar essa opção, você deve ter em mente que apenas as tabelas `InnoDB` são descarregadas em um estado consistente. Por exemplo, quaisquer tabelas `MyISAM` ou `MEMORY` descarregadas ao usar essa opção ainda podem mudar de estado.

Enquanto um `--single-transaction` está em processo, para garantir um arquivo de depuração válido (conteúdo correto da tabela e coordenadas do log binário), nenhuma outra conexão deve usar as seguintes declarações: `ALTER TABLE`, `CREATE TABLE`, `DROP TABLE`, `RENAME TABLE`, `TRUNCATE TABLE`. Uma leitura consistente não é isolada dessas declarações, então o uso delas em uma tabela a ser depurada pode causar o `SELECT` que é realizado pelo **mysqldump** para recuperar o conteúdo da tabela e obter conteúdos incorretos ou falhar.

A opção `--single-transaction` e a opção `--lock-tables` são mutuamente exclusivas, pois [`LOCK TABLES`(lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements") faz com que quaisquer transações pendentes sejam comprometidas implicitamente.

Antes da versão 8.0.32: Não era recomendado usar `--single-transaction` junto com a opção `--set-gtid-purged`, pois isso poderia levar a inconsistências na saída do **mysqldump**.

Para descartar tabelas grandes, combine a opção `--single-transaction` com a opção `--quick`.

#### Grupos de Opções

* A opção `--opt` ativa várias configurações que trabalham juntas para realizar uma operação de descarte rápido. Todas essas configurações estão ativadas por padrão, porque `--opt` está ativada por padrão. Assim, você raramente, ou nunca, especifica `--opt`. Em vez disso, você pode desativar essas configurações como um grupo, especificando `--skip-opt`, e, opcionalmente, reativar certas configurações, especificando as opções associadas posteriormente na linha de comando.

* A opção `--compact` desativa várias configurações que controlam se as declarações e comentários opcionais aparecem na saída. Novamente, você pode seguir esta opção com outras opções que reativam certas configurações, ou ativar todas as configurações usando o formulário `--skip-compact`.

Quando você habilita ou desabilita seletivamente o efeito de uma opção de grupo, a ordem é importante, pois as opções são processadas da primeira à última. Por exemplo, `--disable-keys` `--lock-tables` `--skip-opt` não teria o efeito pretendido; é o mesmo que `--skip-opt` por si só.

#### Exemplos

Para fazer um backup de um banco de dados inteiro:

```
mysqldump db_name > backup-file.sql
```

Para carregar o arquivo de depuração de volta no servidor:

```
mysql db_name < backup-file.sql
```

Outra maneira de recarregar o arquivo de depuração:

```
mysql -e "source /path-to-backup/backup-file.sql" db_name
```

O **mysqldump** também é muito útil para preencher bancos de dados copiando dados de um servidor MySQL para outro:

```
mysqldump --opt db_name | mysql --host=remote_host -C db_name
```

Você pode descartar vários bancos de dados com um comando:

```
mysqldump --databases db_name1 [db_name2 ...] > my_databases.sql
```

Para descartar todos os bancos de dados, use a opção `--all-databases`:

```
mysqldump --all-databases > all_databases.sql
```

Para as tabelas do `InnoDB`, o **mysqldump** oferece uma maneira de fazer um backup online:

```
mysqldump --all-databases --master-data --single-transaction > all_databases.sql
```

Ou, no MySQL 8.0.26 e versões posteriores:

```
mysqldump --all-databases --source-data --single-transaction > all_databases.sql
```

Este backup adquire um bloqueio de leitura global em todas as tabelas (usando `FLUSH TABLES WITH READ LOCK`) no início do dump. Assim que esse bloqueio é adquirido, as coordenadas do log binário são lidas e o bloqueio é liberado. Se declarações de atualização longas estiverem em execução quando a declaração `FLUSH` é emitida, o servidor MySQL pode ficar parado até que essas declarações terminem. Após isso, o dump se torna livre de bloqueio e não interfere em leituras e escritas nas tabelas. Se as declarações de atualização que o servidor MySQL recebe forem curtas (em termos de tempo de execução), o período inicial de bloqueio não deve ser perceptível, mesmo com muitas atualizações.

Para a recuperação em um ponto no tempo (também conhecida como “roll-forward”, quando você precisa restaurar um backup antigo e refazer as alterações que ocorreram desde esse backup), muitas vezes é útil rotular o log binário (ver Seção 7.4.4, “O Log Binário”) ou, pelo menos, conhecer as coordenadas do log binário para as quais o dump corresponde:

```
mysqldump --all-databases --master-data=2 > all_databases.sql
```

Ou, no MySQL 8.0.26 e versões posteriores:

```
mysqldump --all-databases --source-data=2 > all_databases.sql
```

Ou:

```
mysqldump --all-databases --flush-logs --master-data=2 > all_databases.sql
```

Ou, no MySQL 8.0.26 e versões posteriores:

```
mysqldump --all-databases --flush-logs --source-data=2 > all_databases.sql
```

A opção `--source-data` ou `--master-data` pode ser usada simultaneamente com a opção `--single-transaction`, que oferece uma maneira conveniente de fazer um backup online adequado para uso antes da recuperação ponto a ponto, se as tabelas forem armazenadas usando o mecanismo de armazenamento `InnoDB`.

Para mais informações sobre fazer backups, consulte a Seção 9.2, “Métodos de backup de banco de dados”, e a Seção 9.3, “Exemplo de estratégia de backup e recuperação”.

* Para selecionar o efeito de `--opt` exceto por algumas funcionalidades, use a opção `--skip` para cada funcionalidade. Para desativar inserções extensas e buffer de memória, use `--opt` `--skip-extended-insert` `--skip-quick`. (Na verdade, `--skip-extended-insert` `--skip-quick` é suficiente porque `--opt` está ativado por padrão.)

* Para reverter `--opt` para todas as funcionalidades, exceto a desativação de índices e bloqueio de tabelas, use `--skip-opt` `--disable-keys` `--lock-tables`.

#### Restrições

O **mysqldump** não devolve o esquema `performance_schema` ou `sys` por padrão. Para devolve-los, nomeie-os explicitamente na linha de comando. Também pode nomeá-los com a opção `--databases`. Para `performance_schema`, também use a opção `--skip-lock-tables`.

O **mysqldump** não daria o esquema `INFORMATION_SCHEMA`.

O **mysqldump** não daria `InnoDB` `CREATE TABLESPACE` (create-tablespace.html "15.1.21 CREATE TABLESPACE Statement") declarações.

O **mysqldump** não daria o dump do banco de dados de informação do NDB Cluster `ndbinfo`.

O **mysqldump** inclui declarações para recriar as tabelas `general_log` e `slow_query_log` para os dumps do banco de dados `mysql`. O conteúdo das tabelas de log não é descartado.

Se você encontrar problemas ao fazer backup de visualizações devido a privilégios insuficientes, consulte a Seção 27.9, “Restrições em visualizações”, para uma solução alternativa.

### 6.5.5 mysqlimport — Um programa de importação de dados

O cliente **mysqlimport** fornece uma interface de linha de comando para a instrução SQL `LOAD DATA` (load-data.html "15.2.9 LOAD DATA Statement"). A maioria das opções do **mysqlimport** corresponde diretamente a cláusulas da sintaxe do `LOAD DATA`. Veja a Seção 15.2.9, “Instrução LOAD DATA”.

Invoque **mysqlimport** da seguinte forma:

```
mysqlimport [options] db_name textfile1 [textfile2 ...]
```

Para cada arquivo de texto nomeado na linha de comando, o **mysqlimport** remove qualquer extensão do nome do arquivo e usa o resultado para determinar o nome da tabela na qual os conteúdos do arquivo serão importados. Por exemplo, os arquivos com os nomes `patient.txt`, `patient.text` e `patient` seriam todos importados em uma tabela chamada `patient`.

O **mysqlimport** suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysqlimport]` e `[client]` de um arquivo de opções. Para informações sobre arquivos de opções usados por programas MySQL, consulte a Seção 6.2.2.2, “Usando arquivos de opções”.

**Tabela 6.16 Opções de mysqlimport**

<table frame="box" rules="all" summary="Command-line options available for mysqlimport."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Introduced</th> <th scope="col">Deprecated</th> </tr></thead><tbody><tr><th scope="row">--bind-address</th> <td>Use a interface de rede especificada para se conectar ao servidor MySQL</td> <td></td> <td></td> </tr><tr><th scope="row">--character-sets-dir</th> <td>Diretório onde os conjuntos de caracteres podem ser encontrados</td> <td></td> <td></td> </tr><tr><th scope="row">--columns</th> <td>Esta opção aceita uma lista de nomes de colunas separados por vírgula como seu valor</td> <td></td> <td></td> </tr><tr><th scope="row">--compress</th> <td>Compressar todas as informações enviadas entre o cliente e o servidor</td> <td></td> <td>8.0.18</td> </tr><tr><th scope="row">--compression-algorithms</th> <td>Algoritmos de compressão permitidos para conexões ao servidor</td> <td>8.0.18</td> <td></td> </tr><tr><th scope="row">--debug</th> <td>Write debugging log</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-check</th> <td>Imprimir informações de depuração quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-info</th> <td>Imprimir informações de depuração, memória e estatísticas de CPU quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row">--default-auth</th> <td>Plugin de autenticação a ser utilizado</td> <td></td> <td></td> </tr><tr><th scope="row">--default-character-set</th> <td>Especificar o conjunto de caracteres padrão</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-extra-file</th> <td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-file</th> <td>Arquivo de opção de leitura apenas nomeado</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-group-suffix</th> <td>Valor do sufixo do grupo de opções</td> <td></td> <td></td> </tr><tr><th scope="row">--delete</th> <td>Esvazie a tabela antes de importar o arquivo de texto</td> <td></td> <td></td> </tr><tr><th scope="row">--enable-cleartext-plugin</th> <td>Habilitar o plugin de autenticação de texto claro</td> <td></td> <td></td> </tr><tr><th scope="row">--fields-enclosed-by</th> <td>Esta opção tem o mesmo significado que a cláusula correspondente para LOAD DATA</td> <td></td> <td></td> </tr><tr><th scope="row">--fields-escaped-by</th> <td>Esta opção tem o mesmo significado que a cláusula correspondente para LOAD DATA</td> <td></td> <td></td> </tr><tr><th scope="row">--fields-optionally-enclosed-by</th> <td>Esta opção tem o mesmo significado que a cláusula correspondente para LOAD DATA</td> <td></td> <td></td> </tr><tr><th scope="row">--fields-terminated-by</th> <td>Esta opção tem o mesmo significado que a cláusula correspondente para LOAD DATA</td> <td></td> <td></td> </tr><tr><th scope="row">--force</th> <td>Continue mesmo que ocorra um erro SQL</td> <td></td> <td></td> </tr><tr><th scope="row">--get-server-public-key</th> <td>Solicitar chave pública RSA do servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--help</th> <td>Exibir mensagem de ajuda e sair</td> <td></td> <td></td> </tr><tr><th scope="row">--host</th> <td>Anfitrião no qual o servidor MySQL está localizado</td> <td></td> <td></td> </tr><tr><th scope="row">--ignore</th> <td>Veja a descrição para a opção --replace</td> <td></td> <td></td> </tr><tr><th scope="row">--ignore-lines</th> <td>Ignore as primeiras N linhas do arquivo de dados</td> <td></td> <td></td> </tr><tr><th scope="row">--lines-terminated-by</th> <td>Esta opção tem o mesmo significado que a cláusula correspondente para LOAD DATA</td> <td></td> <td></td> </tr><tr><th scope="row">--local</th> <td>Leia arquivos de entrada localmente do host do cliente</td> <td></td> <td></td> </tr><tr><th scope="row">--lock-tables</th> <td>Bloquear todas as tabelas para escrita antes de processar quaisquer arquivos de texto</td> <td></td> <td></td> </tr><tr><th scope="row">--login-path</th> <td>Leia as opções de caminho de login a partir de .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th scope="row">--low-priority</th> <td>Use LOW_PRIORITY when loading the table</td> <td></td> <td></td> </tr><tr><th scope="row">--no-defaults</th> <td>Não leia arquivos de opção</td> <td></td> <td></td> </tr><tr><th scope="row">--password</th> <td>Senha para usar ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--password1</th> <td>Primeira senha de autenticação multifatorial a usar ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password2</th> <td>Segunda senha de autenticação multifatorial a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password3</th> <td>Terceira senha de autenticação multifatorial a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--pipe</th> <td>Conecte-se ao servidor usando um tubo nomeado (apenas Windows)</td> <td></td> <td></td> </tr><tr><th scope="row">--plugin-dir</th> <td>Diretório onde os plugins são instalados</td> <td></td> <td></td> </tr><tr><th scope="row">--port</th> <td>TCP/IP port number for connection</td> <td></td> <td></td> </tr><tr><th scope="row">--print-defaults</th> <td>Print default options</td> <td></td> <td></td> </tr><tr><th scope="row">--protocol</th> <td>Protocolo de transporte a ser utilizado</td> <td></td> <td></td> </tr><tr><th scope="row">--replace</th> <td>As opções --replace e --ignore controlam o tratamento das linhas de entrada que duplicam linhas existentes com valores de chave únicos.</td> <td></td> <td></td> </tr><tr><th scope="row">--server-public-key-path</th> <td>Nome do caminho para o arquivo que contém a chave pública RSA</td> <td></td> <td></td> </tr><tr><th scope="row">--shared-memory-base-name</th> <td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td> <td></td> <td></td> </tr><tr><th scope="row">--silent</th> <td>Produza a saída apenas quando ocorrerem erros</td> <td></td> <td></td> </tr><tr><th scope="row">--socket</th> <td>Arquivo de socket Unix ou tubo nomeado do Windows a ser usado</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-ca</th> <td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-capath</th> <td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cert</th> <td>Arquivo que contém o certificado X.509</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cipher</th> <td>Cifras permitidas para criptografia de conexão</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crl</th> <td>Arquivo que contém listas de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crlpath</th> <td>Diretório que contém arquivos de lista de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-fips-mode</th> <td>Se deve habilitar o modo FIPS no lado do cliente</td> <td></td> <td>8.0.34</td> </tr><tr><th scope="row">--ssl-key</th> <td>Arquivo que contém a chave X.509</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-mode</th> <td>Estado de segurança desejado da conexão com o servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-session-data</th> <td>Arquivo que contém dados da sessão SSL</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--ssl-session-data-continue-on-failed-reuse</th> <td>Se estabelecer conexões se a reutilização da sessão falhar</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--tls-ciphersuites</th> <td>Cifras TLSv1.3 permitidas para conexões criptografadas</td> <td>8.0.16</td> <td></td> </tr><tr><th scope="row">--tls-version</th> <td>Protocolos TLS permitidos para conexões criptografadas</td> <td></td> <td></td> </tr><tr><th scope="row">--use-threads</th> <td>Número de fios para carregamento de arquivos em paralelo</td> <td></td> <td></td> </tr><tr><th scope="row">--user</th> <td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--verbose</th> <td>Verbose mode</td> <td></td> <td></td> </tr><tr><th scope="row">--version</th> <td>Exibir informações da versão e sair</td> <td></td> <td></td> </tr><tr><th scope="row">--zstd-compression-level</th> <td>Nível de compressão para conexões ao servidor que utilizam compressão zstd</td> <td>8.0.18</td> <td></td> </tr></tbody></table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Exibir uma mensagem de ajuda e sair.

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

Em um computador com várias interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao servidor MySQL.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

O diretório onde os conjuntos de caracteres são instalados. Veja a Seção 12.15, “Configuração de Conjunto de Caracteres”.

* `--columns=column_list`, `-c column_list`

  <table frame="box" rules="all" summary="Properties for columns"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>

Esta opção recebe uma lista de nomes de coluna separados por vírgula como seu valor. A ordem dos nomes de coluna indica como combinar as colunas do arquivo de dados com as colunas da tabela.

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

Compressa todas as informações enviadas entre o cliente e o servidor, se possível. Veja a Seção 6.2.8, “Controle de Compressão de Conexão”.

A partir do MySQL 8.0.18, essa opção é desatualizada. A espera é que ela seja removida em uma versão futura do MySQL. Veja Configurando Compressão de Conexão Legada.

* `--compression-algorithms=value`

  <table frame="box" rules="all" summary="Properties for compression-algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compression-algorithms=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>uncompressed</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>zlib</code></p><p class="valid-value"><code>zstd</code></p><p class="valid-value"><code>uncompressed</code></p></td> </tr></tbody></table>

Os algoritmos de compressão permitidos para conexões ao servidor. Os algoritmos disponíveis são os mesmos que para a variável de sistema `protocol_compression_algorithms`. O valor padrão é `uncompressed`.

Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

Essa opção foi adicionada no MySQL 8.0.18.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Properties for debug"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug[=debug_options]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>d:t:o</code></td> </tr></tbody></table>

Escreva um registro de depuração. Uma string típica *`debug_options`* é `d:t:o,file_name`. O padrão é `d:t:o`.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--debug-check`

  <table frame="box" rules="all" summary="Properties for debug-check"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug-check</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

Imprima algumas informações de depuração quando o programa sair.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--debug-info`

  <table frame="box" rules="all" summary="Properties for debug-info"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug-info</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

Imprimir informações de depuração e estatísticas de uso de memória e CPU quando o programa sai.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--default-character-set=charset_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>0

Use *`charset_name`* como o conjunto de caracteres padrão. Veja a Seção 12.15, “Configuração do Conjunto de Caracteres”.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>1

Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Veja a Seção 8.2.17, “Autenticação substituível”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>2

Leia este arquivo de opção após o arquivo de opção global, mas (em Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>3

Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Exceção: Mesmo com `--defaults-file`, os programas de cliente leem `.mylogin.cnf`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>4

Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, **mysqlimport** normalmente lê os grupos `[client]` e `[mysqlimport]`. Se esta opção for dada como `--defaults-group-suffix=_other`, **mysqlimport** também lê os grupos `[client_other]` e `[mysqlimport_other]`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--delete`, `-D`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>5

Limpe a tabela antes de importar o arquivo de texto.

* `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>6

Ative o plugin de autenticação de texto claro `mysql_clear_password`. (Veja a Seção 8.4.1.4, “Autenticação de Texto Claro Plugável do Lado do Cliente”).

* `--fields-terminated-by=...`, `--fields-enclosed-by=...`, `--fields-optionally-enclosed-by=...`, `--fields-escaped-by=...`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>7

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>8

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>9

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>0

Essas opções têm o mesmo significado das cláusulas correspondentes para `LOAD DATA`. Veja a Seção 15.2.9, “Instrução LOAD DATA”.

* `--force`, `-f`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>1

Ignore os erros. Por exemplo, se uma tabela para um arquivo de texto não existir, continue processando quaisquer arquivos restantes. Sem `--force`, o **mysqlimport** sai se uma tabela não existir.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>2

Solicitar a chave pública necessária para a troca de senha baseada em par de chaves RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

Para informações sobre o plugin `caching_sha2_password`, consulte a Seção 8.4.1.2, “Cacheamento de Autenticação Alterável SHA-2”.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>3

Importe os dados para o servidor MySQL no host fornecido. O host padrão é `localhost`.

* `--ignore`, `-i`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>4

Veja a descrição para a opção `--replace`.

* `--ignore-lines=N`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>5

Ignore as primeiras linhas *`N`* do arquivo de dados.

* `--lines-terminated-by=...`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>6

Esta opção tem o mesmo significado que a cláusula correspondente para `LOAD DATA`. Por exemplo, para importar arquivos do Windows que têm linhas terminadas com pares de retorno de carro/retorno de linha, use `--lines-terminated-by="\r\n"`. (Você pode precisar duplicar as barras invertidas, dependendo das convenções de fuga do seu interpretador de comandos.) Veja a Seção 15.2.9, “Instrução LOAD DATA”.

* `--local`, `-L`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>7

Por padrão, os arquivos são lidos pelo servidor no host do servidor. Com esta opção, o **mysqlimport** lê arquivos de entrada localmente no host do cliente.

O uso bem-sucedido de operações de carregamento `LOCAL` dentro do **mysqlimport** também exige que o servidor permita o carregamento local; veja a Seção 8.1.6, “Considerações de segurança para CARREGAR DADOS LOCAL”

* `--lock-tables`, `-l`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>8

Bloquear *todas* as tabelas para escrita antes de processar quaisquer arquivos de texto. Isso garante que todas as tabelas estejam sincronizadas no servidor.

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>9

Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam para qual servidor MySQL se conectar e qual conta se autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql_config_editor**. Veja a Seção 6.6.7, “mysql_config_editor — Utilitário de Configuração MySQL”.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--low-priority`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>0

Use `LOW_PRIORITY` ao carregar a tabela. Isso afeta apenas os motores de armazenamento que usam bloqueio apenas em nível de tabela (como `MyISAM`, `MEMORY` e `MERGE`).

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>1

Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para evitar que elas sejam lidas.

A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql_config_editor**. Veja a Seção 6.6.7, “mysql_config_editor — Ferramenta de Configuração do MySQL”.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>2

A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecida, o **mysqlimport** solicita uma senha. Se for fornecida, não deve haver **espaço** entre `--password=` ou `-p` e a senha que a segue. Se não for especificado nenhum tipo de senha, o padrão é não enviar senha.

Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Veja a Seção 8.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

Para especificar explicitamente que não há senha e que o **mysqlimport** não deve solicitar uma senha, use a opção `--skip-password`.

* `--password1[=pass_val]`

A senha para o fator de autenticação multifatorial 1 da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysqlimport** solicita uma senha. Se for fornecida, não deve haver **espaço** entre `--password1=` e a senha que a segue. Se não for especificado nenhum tipo de senha, o padrão é não enviar senha.

Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Veja a Seção 8.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

Para especificar explicitamente que não há senha e que o **mysqlimport** não deve solicitar uma senha, use a opção `--skip-password1`.

`--password1` e `--password` são sinônimos, assim como `--skip-password1` e `--skip-password`.

* `--password2[=pass_val]`

A senha para o fator de autenticação multifatorial 2 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica para `--password1`; consulte a descrição dessa opção para obter detalhes.

* `--password3[=pass_val]`

A senha para o fator de autenticação multifatorial 3 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica para `--password1`; consulte a descrição dessa opção para obter detalhes.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>3

Em Windows, conecte-se ao servidor usando um tubo nomeado. Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por tubo nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>4

O diretório onde procurar plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o **mysqlimport** não o encontrar. Veja a Seção 8.2.17, “Autenticação Conectada”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>5

Para conexões TCP/IP, o número de porta a ser utilizado.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>6

Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>7

O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de outro protocolo que não o desejado. Para obter detalhes sobre os valores permitidos, consulte a Seção 6.2.7, “Protocolos de Transporte de Conexão”.

* `--replace`, `-r`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>8

As opções `--replace` e `--ignore` controlam o tratamento das linhas de entrada que duplicam linhas existentes em valores de chave únicos. Se você especificar `--replace`, as novas linhas substituem as linhas existentes que têm o mesmo valor de chave única. Se você especificar `--ignore`, as linhas de entrada que duplicam uma linha existente em um valor de chave única são ignoradas. Se você não especificar nenhuma dessas opções, um erro ocorre quando um valor de chave duplicado é encontrado, e o resto do arquivo de texto é ignorado.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>9

O nome do caminho de um arquivo em formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senha com base em par de chave RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

Para `sha256_password`, esta opção só se aplica se o MySQL foi construído usando OpenSSL.

Para informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 8.4.1.3, “Autenticação substituível SHA-256”, e a Seção 8.4.1.2, “Cache de autenticação substituível SHA-2”.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Properties for columns"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>0

Em Windows, o nome de memória compartilhada a ser usado para conexões feitas usando memória compartilhada a um servidor local. O valor padrão é `MYSQL`. O nome de memória compartilhada é sensível a maiúsculas e minúsculas.

Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

* `--silent`, `-s`

  <table frame="box" rules="all" summary="Properties for columns"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>1

Modo silencioso. Produza a saída apenas quando ocorrerem erros.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for columns"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>2

Para conexões a `localhost`, o arquivo de socket Unix a ser usado, ou, no Windows, o nome do tubo nomeado a ser usado.

Em Windows, esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de canal nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--ssl*`

As opções que começam com `--ssl` especificam se deve conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Consulte Opções de comando para conexões criptografadas.

* `--ssl-fips-mode={OFF|ON|STRICT}`

  <table frame="box" rules="all" summary="Properties for columns"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>3

Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere de outras opções `--ssl-xxx` porque não é usada para estabelecer conexões criptografadas, mas sim para determinar quais operações criptográficas devem ser permitidas. Veja a Seção 8.8, “Suporte FIPS”.

Esses valores `--ssl-fips-mode` são permitidos:

+ `OFF`: Desabilitar o modo FIPS.  
  + `ON`: Habilitar o modo FIPS.  
  + `STRICT`: Habilitar o modo FIPS "strict".

Nota

Se o Módulo de Objeto FIPS OpenSSL não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Neste caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente produza um aviso na inicialização e opere no modo não FIPS.

A partir do MySQL 8.0.34, essa opção é desatualizada. A espera é que ela seja removida em uma versão futura do MySQL.

* `--tls-ciphersuites=ciphersuite_list`

  <table frame="box" rules="all" summary="Properties for columns"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>4

As sequências de cifra permitidas para conexões criptografadas que utilizam TLSv1.3. O valor é uma lista de um ou mais nomes de sequência de cifra separados por vírgula. As sequências de cifra que podem ser nomeadas para esta opção dependem da biblioteca SSL utilizada para compilar o MySQL. Para obter detalhes, consulte a Seção 8.3.2, “Protocolos e cifras de conexão criptografada TLS”.

Essa opção foi adicionada no MySQL 8.0.16.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for columns"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>5

Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolo separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, “Protocolos e cifras TLS de conexão criptografada”.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for columns"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>6

O nome de usuário da conta MySQL a ser usado para se conectar ao servidor.

* `--use-threads=N`

  <table frame="box" rules="all" summary="Properties for columns"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>7

Carregue arquivos em paralelo usando *`N`* threads.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for columns"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>8

Modo detalhado. Imprima mais informações sobre o que o programa faz.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for columns"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>9

Exibir informações da versão e sair.

* `--zstd-compression-level=level`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>0

O nível de compressão a ser usado para conexões ao servidor que utilizam o algoritmo de compressão `zstd`. Os níveis permitidos são de 1 a 22, com valores maiores indicando níveis crescentes de compressão. O nível de compressão padrão `zstd` é 3. O ajuste do nível de compressão não afeta as conexões que não utilizam compressão `zstd`.

Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

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

### 6.5.6 mysqlpump — Um programa de backup de banco de dados

* Sintaxe de Invocação do mysqlpump
* Resumo das Opções do mysqlpump
* Descrições das Opções do mysqlpump
* Seleção de Objetos do mysqlpump
* Processamento Paralelo do mysqlpump
* Restrições do mysqlpump

A ferramenta de utilitário cliente **mysqlpump** realiza backups lógicos, produzindo um conjunto de declarações SQL que podem ser executadas para reproduzir as definições originais dos objetos do banco de dados e os dados das tabelas. Ela descarrega um ou mais bancos de dados MySQL para backup ou transferência para outro servidor SQL.

Nota

O **mysqlpump** é descontinuado a partir do MySQL 8.0.34; espere que ele seja removido em uma versão futura do MySQL. Você pode usar programas do MySQL como **mysqldump** e o MySQL Shell para realizar backups lógicos, drenar bancos de dados e tarefas semelhantes, em vez disso.

Dica

Considere o uso dos utilitários de dump do MySQL Shell, que oferecem descarregamento paralelo com múltiplos fios, compressão de arquivos e exibição de informações de progresso, além de recursos na nuvem, como o armazenamento de streaming de Objeto da Infraestrutura da Oracle Cloud e verificações e modificações de compatibilidade do MySQL HeatWave. Os descarregamentos podem ser facilmente importados em uma instância do MySQL Server ou em um Sistema de Banco de Dados MySQL HeatWave usando os utilitários de carregamento de dump do MySQL Shell. As instruções de instalação do MySQL Shell podem ser encontradas aqui.

As características do **mysqlpump** incluem:

* Processamento paralelo de bancos de dados e de objetos dentro dos bancos de dados, para acelerar o processo de dump

* Melhor controle sobre quais bancos de dados e objetos de banco de dados (tabelas, programas armazenados, contas de usuário) devem ser descarregados

* Descarte de contas de usuários como declarações de gestão de contas (`CREATE USER`, `GRANT`) e não como inserções no banco de dados do sistema `mysql`

* Capacidade de criar saída comprimida * Indicador de progresso (os valores são estimativas) * Para recarga do arquivo de depuração, criação de índice secundário mais rápida para as tabelas `InnoDB` adicionando índices após as linhas serem inseridas

Nota

O **mysqlpump** utiliza recursos do MySQL introduzidos no MySQL 5.7 e, portanto, assume o uso com MySQL 5.7 ou superior.

O **mysqlpump** requer pelo menos o privilégio `SELECT` para tabelas descarregadas, `SHOW VIEW` para visualizações descarregadas, `TRIGGER` para gatilhos descarregados e `LOCK TABLES` se a opção `--single-transaction` não for usada. O privilégio `SELECT` no banco de dados do sistema `mysql` é necessário para descarregar definições de usuário. Algumas opções podem exigir outros privilégios, conforme indicado nas descrições das opções.

Para recarregar um arquivo de depuração, você deve ter os privilégios necessários para executar as declarações que ele contém, como os privilégios apropriados `CREATE` para objetos criados por essas declarações.

Nota

Um dump feito usando o PowerShell no Windows com redirecionamento de saída cria um arquivo com codificação UTF-16:

```
mysqlpump [options] > dump.sql
```

No entanto, o UTF-16 não é permitido como um conjunto de caracteres de conexão (consulte a Seção 12.4, “Conjunto de caracteres de conexão e colagens”), então o arquivo de depuração não pode ser carregado corretamente. Para contornar esse problema, use a opção `--result-file`, que cria a saída no formato ASCII:

```
mysqlpump [options] --result-file=dump.sql
```

#### Sintaxe de Invocação do mysqlpump

Por padrão, o **mysqlpump** exibe todos os bancos de dados (com certas exceções mencionadas na restrição do mysqlpump). Para especificar explicitamente esse comportamento, use a opção `--all-databases`:

```
mysqlpump --all-databases
```

Para descartar um único banco de dados ou certas tabelas nesse banco de dados, nomeie o banco de dados na linha de comando, opcionalmente seguido pelos nomes das tabelas:

```
mysqlpump db_name
mysqlpump db_name tbl_name1 tbl_name2 ...
```

Para tratar todos os argumentos de nome como nomes de banco de dados, use a opção `--databases`:

```
mysqlpump --databases db_name1 db_name2 ...
```

Por padrão, o **mysqlpump** não densa as definições das contas de usuário, mesmo que você faça o dump do banco de dados do sistema `mysql` que contém as tabelas de concessão. Para drenar o conteúdo das tabelas de concessão como definições lógicas na forma de declarações `CREATE USER` e `GRANT`, use a opção `--users` e suprima todo o dumping do banco de dados:

```
mysqlpump --exclude-databases=% --users
```

No comando anterior, `%` é um caractere curinga que corresponde a todos os nomes de banco de dados para a opção `--exclude-databases`.

O **mysqlpump** suporta várias opções para incluir ou excluir bancos de dados, tabelas, programas armazenados e definições de usuário. Veja Seleção de Objeto do mysqlpump.

Para recarregar um arquivo de dump, execute as instruções que ele contém. Por exemplo, use o cliente **mysql**:

```
mysqlpump [options] > dump.sql
mysql < dump.sql
```

A discussão a seguir fornece exemplos adicionais de uso do **mysqlpump**.

Para ver uma lista das opções que o **mysqlpump** suporta, execute o comando **mysqlpump --help**.

#### Resumo da Opção mysqlpump

O **mysqlpump** suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysqlpump]` e `[client]` de um arquivo de opções. (Antes do MySQL 8.0.20, o **mysqlpump** lia o grupo `[mysql_dump]` em vez de `[mysqlpump]`. A partir do 8.0.20, `[mysql_dump]` ainda é aceito, mas é descontinuado.) Para informações sobre arquivos de opções usados por programas MySQL, consulte a Seção 6.2.2.2, “Usando arquivos de opções”.

**Tabela 6.17 Opções do mysqlpump**

<table frame="box" rules="all" summary="Command-line options available for mysqlpump."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Introduced</th> <th scope="col">Deprecated</th> </tr></thead><tbody><tr><th scope="row">--add-drop-database</th> <td>Adicione a declaração DROP DATABASE antes de cada declaração CREATE DATABASE</td> <td></td> <td></td> </tr><tr><th scope="row">--add-drop-table</th> <td>Adicione a declaração DROP TABLE antes de cada declaração CREATE TABLE</td> <td></td> <td></td> </tr><tr><th scope="row">--add-drop-user</th> <td>Adicione a declaração DROP USER antes de cada declaração CREATE USER</td> <td></td> <td></td> </tr><tr><th scope="row">--add-locks</th> <td>Cerque cada dump de tabela com as instruções LOCK TABLES e UNLOCK TABLES</td> <td></td> <td></td> </tr><tr><th scope="row">--all-databases</th> <td>Dump all databases</td> <td></td> <td></td> </tr><tr><th scope="row">--bind-address</th> <td>Use a interface de rede especificada para se conectar ao servidor MySQL</td> <td></td> <td></td> </tr><tr><th scope="row">--character-sets-dir</th> <td>Diretório onde os conjuntos de caracteres são instalados</td> <td></td> <td></td> </tr><tr><th scope="row">--column-statistics</th> <td>Escreva declarações de ANALYZE TABLE para gerar histogramas de estatísticas</td> <td></td> <td></td> </tr><tr><th scope="row">--complete-insert</th> <td>Use declarações completas de INSERT que incluam os nomes das colunas</td> <td></td> <td></td> </tr><tr><th scope="row">--compress</th> <td>Compressar todas as informações enviadas entre o cliente e o servidor</td> <td></td> <td>8.0.18</td> </tr><tr><th scope="row">--compress-output</th> <td>Output compression algorithm</td> <td></td> <td></td> </tr><tr><th scope="row">--compression-algorithms</th> <td>Algoritmos de compressão permitidos para conexões ao servidor</td> <td>8.0.18</td> <td></td> </tr><tr><th scope="row">--databases</th> <td>Interprete todos os argumentos de nome como nomes de banco de dados</td> <td></td> <td></td> </tr><tr><th scope="row">--debug</th> <td>Write debugging log</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-check</th> <td>Imprimir informações de depuração quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-info</th> <td>Imprimir informações de depuração, memória e estatísticas de CPU quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row">--default-auth</th> <td>Plugin de autenticação a ser utilizado</td> <td></td> <td></td> </tr><tr><th scope="row">--default-character-set</th> <td>Especificar o conjunto de caracteres padrão</td> <td></td> <td></td> </tr><tr><th scope="row">--default-parallelism</th> <td>Número padrão de threads para processamento paralelo</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-extra-file</th> <td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-file</th> <td>Arquivo de opção de leitura apenas nomeado</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-group-suffix</th> <td>Valor do sufixo do grupo de opções</td> <td></td> <td></td> </tr><tr><th scope="row">--defer-table-indexes</th> <td>Para recarregar, adiar a criação do índice até depois de carregar as linhas da tabela</td> <td></td> <td></td> </tr><tr><th scope="row">--events</th> <td>Eventos de descarte de bancos de dados descartados</td> <td></td> <td></td> </tr><tr><th scope="row">--exclude-databases</th> <td>Bases de dados a excluir do dump</td> <td></td> <td></td> </tr><tr><th scope="row">--exclude-events</th> <td>Eventos a serem excluídos do descarte</td> <td></td> <td></td> </tr><tr><th scope="row">--exclude-routines</th> <td>Rotinas para excluir do dump</td> <td></td> <td></td> </tr><tr><th scope="row">--exclude-tables</th> <td>Tabelas para excluir do dump</td> <td></td> <td></td> </tr><tr><th scope="row">--exclude-triggers</th> <td>Triggers para excluir do dump</td> <td></td> <td></td> </tr><tr><th scope="row">--exclude-users</th> <td>Usuários a serem excluídos do descarte</td> <td></td> <td></td> </tr><tr><th scope="row">--extended-insert</th> <td>Use a sintaxe de inserção de várias linhas</td> <td></td> <td></td> </tr><tr><th scope="row">--get-server-public-key</th> <td>Solicitar chave pública RSA do servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--help</th> <td>Exibir mensagem de ajuda e sair</td> <td></td> <td></td> </tr><tr><th scope="row">--hex-blob</th> <td>Armazene colunas binárias usando notação hexadecimal</td> <td></td> <td></td> </tr><tr><th scope="row">--host</th> <td>Anfitrião no qual o servidor MySQL está localizado</td> <td></td> <td></td> </tr><tr><th scope="row">--include-databases</th> <td>Bases de dados a incluir no dump</td> <td></td> <td></td> </tr><tr><th scope="row">--include-events</th> <td>Eventos a incluir no lixo</td> <td></td> <td></td> </tr><tr><th scope="row">--include-routines</th> <td>Rotinas a incluir no lixo</td> <td></td> <td></td> </tr><tr><th scope="row">--include-tables</th> <td>Tabelas a incluir no dump</td> <td></td> <td></td> </tr><tr><th scope="row">--include-triggers</th> <td>Triggers a incluir no dump</td> <td></td> <td></td> </tr><tr><th scope="row">--include-users</th> <td>Usuários a incluir no dump</td> <td></td> <td></td> </tr><tr><th scope="row">--insert-ignore</th> <td>Escreva INSERT IGNORE em vez de declarações INSERT</td> <td></td> <td></td> </tr><tr><th scope="row">--log-error-file</th> <td>Adicione avisos e erros a um arquivo nomeado</td> <td></td> <td></td> </tr><tr><th scope="row">--login-path</th> <td>Leia as opções de caminho de login a partir de .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th scope="row">--max-allowed-packet</th> <td>Comprimento máximo do pacote para enviar ou receber do servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--net-buffer-length</th> <td>Buffer size for TCP/IP and socket communication</td> <td></td> <td></td> </tr><tr><th scope="row">--no-create-db</th> <td>Não escreva declarações CREATE DATABASE</td> <td></td> <td></td> </tr><tr><th scope="row">--no-create-info</th> <td>Não escreva declarações CREATE TABLE que recriem cada tabela descarregada</td> <td></td> <td></td> </tr><tr><th scope="row">--no-defaults</th> <td>Não leia arquivos de opção</td> <td></td> <td></td> </tr><tr><th scope="row">--parallel-schemas</th> <td>Specify schema-processing parallelism</td> <td></td> <td></td> </tr><tr><th scope="row">--password</th> <td>Senha para usar ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--password1</th> <td>Primeira senha de autenticação multifatorial a usar ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password2</th> <td>Segunda senha de autenticação multifatorial a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password3</th> <td>Terceira senha de autenticação multifatorial a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--plugin-dir</th> <td>Diretório onde os plugins são instalados</td> <td></td> <td></td> </tr><tr><th scope="row">--port</th> <td>TCP/IP port number for connection</td> <td></td> <td></td> </tr><tr><th scope="row">--print-defaults</th> <td>Print default options</td> <td></td> <td></td> </tr><tr><th scope="row">--protocol</th> <td>Protocolo de transporte a ser utilizado</td> <td></td> <td></td> </tr><tr><th scope="row">--replace</th> <td>Escreva declarações REPLACE em vez de declarações INSERT</td> <td></td> <td></td> </tr><tr><th scope="row">--result-file</th> <td>Saída direta para um arquivo específico</td> <td></td> <td></td> </tr><tr><th scope="row">--routines</th> <td>Armazene rotinas armazenadas (procedimentos e funções) de bancos de dados descartados</td> <td></td> <td></td> </tr><tr><th scope="row">--server-public-key-path</th> <td>Nome do caminho para o arquivo que contém a chave pública RSA</td> <td></td> <td></td> </tr><tr><th scope="row">--set-charset</th> <td>Add SET NAMES default_character_set to output</td> <td></td> <td></td> </tr><tr><th scope="row">--set-gtid-purged</th> <td>Whether to add SET @@GLOBAL.GTID_PURGED to output</td> <td></td> <td></td> </tr><tr><th scope="row">--single-transaction</th> <td>Tabelas de descarte dentro de uma única transação</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-definer</th> <td>Omitar as cláusulas DEFINER e SQL SECURITY das declarações CREATE de vista e programas armazenados</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-dump-rows</th> <td>Não descarte linhas de tabela</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-generated-invisible-primary-key</th> <td>Não descarte informações sobre chaves primárias primárias invisíveis geradas</td> <td>8.0.30</td> <td></td> </tr><tr><th scope="row">--socket</th> <td>Arquivo de socket Unix ou tubo nomeado do Windows a ser usado</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-ca</th> <td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-capath</th> <td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cert</th> <td>Arquivo que contém o certificado X.509</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cipher</th> <td>Cifras permitidas para criptografia de conexão</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crl</th> <td>Arquivo que contém listas de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crlpath</th> <td>Diretório que contém arquivos de lista de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-fips-mode</th> <td>Se deve habilitar o modo FIPS no lado do cliente</td> <td></td> <td>8.0.34</td> </tr><tr><th scope="row">--ssl-key</th> <td>Arquivo que contém a chave X.509</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-mode</th> <td>Estado de segurança desejado da conexão com o servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-session-data</th> <td>Arquivo que contém dados da sessão SSL</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--ssl-session-data-continue-on-failed-reuse</th> <td>Se estabelecer conexões se a reutilização da sessão falhar</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--tls-ciphersuites</th> <td>Cifras TLSv1.3 permitidas para conexões criptografadas</td> <td>8.0.16</td> <td></td> </tr><tr><th scope="row">--tls-version</th> <td>Protocolos TLS permitidos para conexões criptografadas</td> <td></td> <td></td> </tr><tr><th scope="row">--triggers</th> <td>Triggers de descarte para cada tabela descartada</td> <td></td> <td></td> </tr><tr><th scope="row">--tz-utc</th> <td>Add SET TIME_ZONE='+00:00' to dump file</td> <td></td> <td></td> </tr><tr><th scope="row">--user</th> <td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--users</th> <td>Dump user accounts</td> <td></td> <td></td> </tr><tr><th scope="row">--version</th> <td>Exibir informações da versão e sair</td> <td></td> <td></td> </tr><tr><th scope="row">--watch-progress</th> <td>Display progress indicator</td> <td></td> <td></td> </tr><tr><th scope="row">--zstd-compression-level</th> <td>Nível de compressão para conexões ao servidor que utilizam compressão zstd</td> <td>8.0.18</td> <td></td> </tr></tbody></table>

#### mysqlpump Descrições de opção

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Exibir uma mensagem de ajuda e sair.

* `--add-drop-database`

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>

Escreva uma declaração `DROP DATABASE` antes de cada declaração `CREATE DATABASE`(create-database.html "15.1.12 CREATE DATABASE Statement").

Nota

No MySQL 8.0, o esquema `mysql` é considerado um esquema do sistema que não pode ser excluído por usuários finais. Se `--add-drop-database` for usado com `--all-databases` ou com `--databases` onde a lista de esquemas a serem descarregados inclui `mysql`, o arquivo de descarregamento contém uma declaração `` DROP DATABASE `mysql` `` que causa um erro quando o arquivo de descarregamento é carregado novamente.

Em vez disso, para usar `--add-drop-database`, use `--databases` com uma lista de esquemas a serem descartados, onde a lista não inclui `mysql`.

* `--add-drop-table`

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>

Escreva uma declaração `DROP TABLE` antes de cada declaração `CREATE TABLE`.

* `--add-drop-user`

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>

Escreva uma declaração `DROP USER` antes de cada declaração `CREATE USER`.

* `--add-locks`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>

Certifique-se de que cada dump de tabela esteja envolto em `LOCK TABLES`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements") e [`UNLOCK TABLES`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements") declarações. Isso resulta em inserções mais rápidas quando o arquivo de dump é carregado novamente. Veja a Seção 10.2.5.1, “Otimizando declarações INSERT”.

Esta opção não funciona com paralelismo porque as declarações `INSERT` de diferentes tabelas podem ser intercaladas e [[`UNLOCK TABLES`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements") após o fim dos registros inseridos para uma tabela podem liberar os bloqueios em tabelas para as quais os registros permanecem.

`--add-locks` e `--single-transaction` são mutuamente exclusivos.

* `--all-databases`, `-A`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>

Descarte todos os bancos de dados (com certas exceções mencionadas nas restrições do mysqlpump). Esse é o comportamento padrão, a menos que outro seja especificado explicitamente.

`--all-databases` e `--databases` são mutuamente exclusivos.

Nota

Consulte a descrição do `--add-drop-database` para obter informações sobre uma incompatibilidade dessa opção com o `--all-databases`.

Antes do MySQL 8.0, as opções `--routines` e `--events` para **mysqldump** e **mysqlpump** não eram necessárias para incluir rotinas e eventos armazenados ao usar a opção `--all-databases`: O dump incluía o banco de dados do sistema `mysql`, e, portanto, também as tabelas `mysql.proc` e `mysql.event` que contêm definições de rotinas e eventos armazenados. A partir do MySQL 8.0, as tabelas `mysql.event` e `mysql.proc` não são usadas. As definições dos objetos correspondentes são armazenadas em tabelas do dicionário de dados, mas essas tabelas não são feitas parte do dump. Para incluir rotinas e eventos armazenados em um dump feito usando `--all-databases`, use as opções `--routines` e `--events` explicitamente.

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

Em um computador com várias interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao servidor MySQL.

* `--character-sets-dir=path`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

O diretório onde os conjuntos de caracteres são instalados. Veja a Seção 12.15, “Configuração de Conjunto de Caracteres”.

* `--column-statistics`

  <table frame="box" rules="all" summary="Properties for column-statistics"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--column-statistics</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

Adicione as declarações `ANALYZE TABLE` ao resultado para gerar estatísticas de histograma para tabelas descarregadas quando o arquivo de descarregamento é carregado novamente. Esta opção é desativada por padrão porque a geração de histograma para tabelas grandes pode levar um longo tempo.

* `--complete-insert`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>0

Escreva declarações completas do `INSERT` que incluam os nomes das colunas.

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>1

Compressa todas as informações enviadas entre o cliente e o servidor, se possível. Veja a Seção 6.2.8, “Controle de Compressão de Conexão”.

A partir do MySQL 8.0.18, essa opção é desatualizada. A espera é que ela seja removida em uma versão futura do MySQL. Veja Configurando Compressão de Conexão Legada.

* `--compress-output=algorithm`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>2

Por padrão, o **mysqlpump** não comprime a saída. Esta opção especifica a compressão da saída usando o algoritmo especificado. Os algoritmos permitidos são `LZ4` e `ZLIB`.

Para descomprimir a saída comprimida, você deve ter um utilitário apropriado. Se os comandos do sistema **lz4** e **openssl zlib** não estiverem disponíveis, as distribuições do MySQL incluem os utilitários **lz4_decompress** e **zlib_decompress** que podem ser usados para descomprimir a saída do **mysqlpump** que foi comprimida usando as opções `--compress-output=LZ4` e `--compress-output=ZLIB`. Para mais informações, consulte a Seção 6.8.1, “lz4_decompress — Descomprima saída comprimida mysqlpump do LZ4”, e a Seção 6.8.3, “zlib_decompress — Descomprima saída comprimida mysqlpump do ZLIB”.

* `--compression-algorithms=value`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>3

Os algoritmos de compressão permitidos para conexões ao servidor. Os algoritmos disponíveis são os mesmos que para a variável de sistema `protocol_compression_algorithms`. O valor padrão é `uncompressed`.

Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

Essa opção foi adicionada no MySQL 8.0.18.

* `--databases`, `-B`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>4

Normalmente, o **mysqlpump** trata o argumento de nome no comando de linha como um nome de banco de dados e quaisquer nomes subsequentes como nomes de tabela. Com esta opção, ele trata todos os argumentos de nome como nomes de banco de dados. As declarações `CREATE DATABASE` são incluídas na saída antes de cada novo banco de dados.

`--all-databases` e `--databases` são mutuamente exclusivos.

Nota

Consulte a descrição do `--add-drop-database` para obter informações sobre uma incompatibilidade dessa opção com o `--databases`.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>5

Escreva um registro de depuração. Uma string típica *`debug_options`* é `d:t:o,file_name`. O padrão é `d:t:O,/tmp/mysqlpump.trace`.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--debug-check`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>6

Imprima algumas informações de depuração quando o programa sair.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--debug-info`, `-T`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>7

Imprimir informações de depuração e estatísticas de uso de memória e CPU quando o programa sai.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>8

Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Veja a Seção 8.2.17, “Autenticação substituível”.

* `--default-character-set=charset_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>9

Use *`charset_name`* como o conjunto de caracteres padrão. Veja a Seção 12.15, “Configuração do Conjunto de Caracteres”. Se não for especificado nenhum conjunto de caracteres, o **mysqlpump** usa `utf8mb4`.

* `--default-parallelism=N`

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>0

O número padrão de threads para cada fila de processamento paralelo. O padrão é 2.

A opção `--parallel-schemas` também afeta o paralelismo e pode ser usada para substituir o número padrão de threads. Para mais informações, consulte o processamento paralelo do mysqlpump.

Com `--default-parallelism=0` e sem as opções de `--parallel-schemas`, o **mysqlpump** funciona como um processo monolínio e não cria filas.

Com o paralelismo ativado, é possível que a saída de diferentes bancos de dados seja interligada.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>1

Leia este arquivo de opção após o arquivo de opção global, mas (em Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>2

Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Exceção: Mesmo com `--defaults-file`, os programas de cliente leem `.mylogin.cnf`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>3

Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, o **mysqlpump** normalmente lê os grupos `[client]` e `[mysqlpump]`. Se esta opção for dada como `--defaults-group-suffix=_other`, o **mysqlpump** também lê os grupos `[client_other]` e `[mysqlpump_other]`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--defer-table-indexes`

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>4

Na saída de dump, adiar a criação do índice para cada tabela até que suas linhas tenham sido carregadas. Isso funciona para todos os motores de armazenamento, mas para `InnoDB` aplica-se apenas para índices secundários.

Esta opção é ativada por padrão; use `--skip-defer-table-indexes` para desativá-la.

* `--events`

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>5

Inclua eventos do Agendamento de Eventos para os bancos de dados descarregados na saída. O descarregamento de eventos requer os privilégios `EVENT` para esses bancos de dados.

A saída gerada ao usar `--events` contém declarações `CREATE EVENT` para criar os eventos.

Esta opção é ativada por padrão; use `--skip-events` para desativá-la.

* `--exclude-databases=db_list`

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>6

Não descarte os bancos de dados em *`db_list`*, que é uma lista de um ou mais nomes de banco de dados separados por vírgula. Múltiplas instâncias desta opção são aditivas. Para mais informações, consulte Seleção de Objeto mysqlpump.

* `--exclude-events=event_list`

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>7

Não descarte os bancos de dados em *`event_list`*, que é uma lista de um ou mais nomes de eventos separados por vírgula. Múltiplas instâncias desta opção são aditivas. Para mais informações, consulte Seleção de Objeto mysqlpump.

* `--exclude-routines=routine_list`

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>8

Não descarte os eventos em *`routine_list`*, que é uma lista de um ou mais nomes de rotinas (procedimento armazenado ou função) separados por vírgula. Múltiplas instâncias desta opção são aditivas. Para mais informações, consulte Seleção de Objeto mysqlpump.

* `--exclude-tables=table_list`

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>9

Não descarte as tabelas em *`table_list`*, que é uma lista de um ou mais nomes de tabela separados por vírgula. Múltiplas instâncias desta opção são aditivas. Para mais informações, consulte Seleção de Objeto mysqlpump.

* `--exclude-triggers=trigger_list`

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>0

Não descarte os gatilhos em *`trigger_list`*, que é uma lista de um ou mais nomes de gatilho separados por vírgula. Instâncias múltiplas desta opção são aditivas. Para mais informações, consulte Seleção de Objeto mysqlpump.

* `--exclude-users=user_list`

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>1

Não descarte as contas do usuário em *`user_list`*, que é uma lista de um ou mais nomes de contas separados por vírgula. Múltiplas instâncias desta opção são aditivas. Para mais informações, consulte Seleção de Objeto mysqlpump.

* `--extended-insert=N`

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>2

Escreva declarações `INSERT` usando sintaxe de várias linhas que inclua várias listas `VALUES`. Isso resulta em um arquivo de depuração menor e acelera as inserções quando o arquivo é carregado novamente.

O valor da opção indica o número de linhas a serem incluídas em cada declaração `INSERT`. O padrão é 250. Um valor de 1 produz uma declaração `INSERT` por linha de tabela.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>3

Peça ao servidor a chave pública necessária para a troca de senha baseada em par de chaves RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

Para informações sobre o plugin `caching_sha2_password`, consulte a Seção 8.4.1.2, “Cacheamento de Autenticação Alterável SHA-2”.

* `--hex-blob`

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>4

Arraste colunas binárias usando notação hexadecimal (por exemplo, `'abc'` se torna `0x616263`). Os tipos de dados afetados são os tipos `BINARY`, `VARBINARY`, `BLOB` e `BIT`, todos os tipos de dados espaciais e outros tipos de dados não binários quando usados com o conjunto de caracteres `binary`(charset-binary-set.html "12.10.8 The Binary Character Set").

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>5

Arraste dados do servidor MySQL para o host fornecido.

* `--include-databases=db_list`

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>6

Descarte os bancos de dados em *`db_list`*, que é uma lista de um ou mais nomes de bancos de dados separados por vírgula. O dump inclui todos os objetos nos bancos de dados nomeados. Múltiplas instâncias desta opção são aditivas. Para mais informações, consulte Seleção de Objeto mysqlpump.

* `--include-events=event_list`

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>7

Descarte os eventos em *`event_list`*, que é uma lista de um ou mais nomes de eventos separados por vírgula. Múltiplas instâncias desta opção são aditivas. Para mais informações, consulte Seleção de Objeto mysqlpump.

* `--include-routines=routine_list`

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>8

Descarte as rotinas em *`routine_list`*, que é uma lista de um ou mais nomes de rotinas (procedimento armazenado ou função) separados por vírgula. Múltiplas instâncias desta opção são aditivas. Para mais informações, consulte Seleção de Objeto mysqlpump.

* `--include-tables=table_list`

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>9

Descarte as tabelas em *`table_list`*, que é uma lista de um ou mais nomes de tabela separados por vírgula. Múltiplas instâncias desta opção são aditivas. Para mais informações, consulte Seleção de Objeto mysqlpump.

* `--include-triggers=trigger_list`

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>0

Descarte os gatilhos em *`trigger_list`*, que é uma lista de um ou mais nomes de gatilho separados por vírgula. Instâncias múltiplas desta opção são aditivas. Para mais informações, consulte Seleção de Objeto mysqlpump.

* `--include-users=user_list`

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>1

Descarte as contas de usuário em *`user_list`*, que é uma lista de um ou mais nomes de usuário separados por vírgula. Múltiplas instâncias desta opção são aditivas. Para mais informações, consulte Seleção de Objeto mysqlpump.

* `--insert-ignore`

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>2

Escreva declarações `INSERT IGNORE` em vez de declarações `INSERT`.

* `--log-error-file=file_name`

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>3

Registre as advertências e erros anexando-os ao arquivo nomeado. Se esta opção não for fornecida, o **mysqlpump** escreve advertências e erros na saída padrão de erro.

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>4

Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam para qual servidor MySQL se conectar e qual conta se autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql_config_editor**. Veja a Seção 6.6.7, “mysql_config_editor — Utilitário de Configuração MySQL”.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--max-allowed-packet=N`

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>5

O tamanho máximo do buffer para comunicação cliente/servidor. O padrão é 24 MB, o máximo é 1 GB.

* `--net-buffer-length=N`

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>6

O tamanho inicial do buffer para a comunicação cliente/servidor. Ao criar declarações `INSERT` de várias linhas (como com a opção `--extended-insert`, o **mysqlpump** cria linhas com até *`N`* bytes de comprimento. Se você usar esta opção para aumentar o valor, certifique-se de que a variável de sistema do servidor MySQL `net_buffer_length` tenha um valor pelo menos desse tamanho.

* `--no-create-db`

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>7

Suprima quaisquer declarações `CREATE DATABASE` que possam ser incluídas na saída, caso contrário.

* `--no-create-info`, `-t`

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>8

Não escreva declarações `CREATE TABLE` que criem cada tabela descarregada.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>9

Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para evitar que elas sejam lidas.

A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql_config_editor**. Veja a Seção 6.6.7, “mysql_config_editor — Ferramenta de Configuração do MySQL”.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--parallel-schemas=[N:]db_list`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>0

Crie uma fila para processar os bancos de dados em *`db_list`*, que é uma lista de um ou mais nomes de bancos de dados separados por vírgula. Se *`N`* for fornecido, a fila usa os threads de *`N`*. Se *`N`* não for fornecido, a opção `--default-parallelism` determina o número de threads da fila.

Múltiplas instâncias desta opção criam múltiplas filas. O **mysqlpump** também cria uma fila padrão para usar em bancos de dados que não são nomeados em nenhuma opção do `--parallel-schemas`, e para drenar definições de usuário se as opções do comando as selecionarem. Para mais informações, consulte o Processamento paralelo do mysqlpump.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>1

A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecida, o **mysqlpump** solicitará uma senha. Se for fornecida, não deve haver **espaço** entre `--password=` ou `-p` e a senha que a segue. Se não for especificado nenhum tipo de senha, o padrão é não enviar senha.

Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Veja a Seção 8.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

Para especificar explicitamente que não há senha e que o **mysqlpump** não deve solicitar uma senha, use a opção `--skip-password`.

* `--password1[=pass_val]`

A senha para o fator de autenticação multifatorial 1 da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysqlpump** solicita uma senha. Se for fornecida, não deve haver **espaço** entre `--password1=` e a senha que a segue. Se não for especificado nenhum tipo de senha, o padrão é não enviar senha.

Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Veja a Seção 8.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

Para especificar explicitamente que não há senha e que o **mysqlpump** não deve solicitar uma senha, use a opção `--skip-password1`.

`--password1` e `--password` são sinônimos, assim como `--skip-password1` e `--skip-password`.

* `--password2[=pass_val]`

A senha para o fator de autenticação multifatorial 2 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica para `--password1`; consulte a descrição dessa opção para obter detalhes.

* `--password3[=pass_val]`

A senha para o fator de autenticação multifatorial 3 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica para `--password1`; consulte a descrição dessa opção para obter detalhes.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>2

O diretório onde procurar plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o **mysqlpump** não o encontrar. Veja a Seção 8.2.17, “Autenticação Conectada”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>3

Para conexões TCP/IP, o número de porta a ser utilizado.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>4

Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>5

O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de outro protocolo que não o desejado. Para obter detalhes sobre os valores permitidos, consulte a Seção 6.2.7, “Protocolos de Transporte de Conexão”.

* `--replace`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>6

Escreva declarações `REPLACE` em vez de declarações `INSERT`.

* `--result-file=file_name`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>7

Saída direta para o arquivo nomeado. O arquivo de resultado é criado e seus conteúdos anteriores são sobrescritos, mesmo que um erro ocorra durante a geração do dump.

Essa opção deve ser usada no Windows para evitar que os caracteres de nova linha `\n` sejam convertidos em sequências de retorno de carro/nova linha `\r\n`.

* `--routines`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>8

Inclua rotinas armazenadas (procedimentos e funções) para os bancos de dados descartados na saída. Esta opção requer o privilégio global `SELECT`.

A saída gerada usando `--routines` contém as declarações `CREATE PROCEDURE` e `CREATE FUNCTION` para criar as rotinas.

Esta opção é ativada por padrão; use `--skip-routines` para desativá-la.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>9

O nome do caminho de um arquivo em formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senha com base em par de chave RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

Para `sha256_password`, esta opção só se aplica se o MySQL foi construído usando OpenSSL.

Para informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 8.4.1.3, “Autenticação substituível SHA-256”, e a Seção 8.4.1.2, “Cache de autenticação substituível SHA-2”.

* `--set-charset`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>0

Escreva `SET NAMES default_character_set`(set-names.html "15.7.6.3 SET NAMES Statement") na saída.

Esta opção é ativada por padrão. Para desativá-la e suprimir a declaração `SET NAMES`, use `--skip-set-charset`.

* `--set-gtid-purged=value`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>1

Essa opção permite o controle sobre as informações de ID de transação global (GTID) escritas no arquivo de depuração, indicando se deve adicionar uma declaração `SET @@GLOBAL.gtid_purged` (set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") na saída. Essa opção também pode causar a escrita de uma declaração na saída que desabilita o registro binário enquanto o arquivo de depuração está sendo recarregado.

A tabela a seguir mostra os valores de opção permitidos. O valor padrão é `AUTO`.

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>2

A opção `--set-gtid-purged` tem o seguinte efeito no registro binário quando o arquivo de depuração é carregado novamente:

+ `--set-gtid-purged=OFF`: `SET @@SESSION.SQL_LOG_BIN=0;` não é adicionado ao resultado.

+ `--set-gtid-purged=ON`: `SET @@SESSION.SQL_LOG_BIN=0;` é adicionado ao resultado.

+ `--set-gtid-purged=AUTO`: `SET @@SESSION.SQL_LOG_BIN=0;` é adicionado ao resultado se GTIDs estiverem habilitados no servidor que você está fazendo backup (ou seja, se `AUTO` avaliar para `ON`).

* `--single-transaction`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>3

Esta opção define o modo de isolamento de transação para `REPEATABLE READ` e envia uma declaração SQL `START TRANSACTION` (commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") ao servidor antes de drenar os dados. É útil apenas com tabelas transacionais, como `InnoDB`, porque, então, drenar o estado consistente do banco de dados no momento em que `START TRANSACTION` (commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") foi emitido sem bloquear quaisquer aplicativos.

Ao usar essa opção, você deve ter em mente que apenas as tabelas `InnoDB` são descarregadas em um estado consistente. Por exemplo, quaisquer tabelas `MyISAM` ou `MEMORY` descarregadas ao usar essa opção ainda podem mudar de estado.

Enquanto um `--single-transaction` está em processo, para garantir um arquivo de depuração válido (conteúdo correto da tabela e coordenadas do log binário), nenhuma outra conexão deve usar as seguintes declarações: `ALTER TABLE`, `CREATE TABLE`, `DROP TABLE`, `RENAME TABLE`, `TRUNCATE TABLE`. Uma leitura consistente não é isolada dessas declarações, então o uso delas em uma tabela a ser depurada pode causar o `SELECT` que é realizado pelo **mysqlpump** para recuperar o conteúdo da tabela e obter conteúdos incorretos ou falhar.

`--add-locks` e `--single-transaction` são mutuamente exclusivos.

* `--skip-definer`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>4

Omita as cláusulas `DEFINER` e `SQL SECURITY` das declarações `CREATE` para visualizações e programas armazenados. O arquivo de depuração, quando recarregado, cria objetos que utilizam os valores padrão `DEFINER` e `SQL SECURITY`. Veja a Seção 27.6, “Controle de acesso a objetos armazenados”.

* `--skip-dump-rows`, `-d`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>5

Não descarte as linhas da tabela.

* `--skip-generated-invisible-primary-key`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>6

Esta opção está disponível a partir do MySQL 8.0.30 e faz com que as chaves primárias invisíveis geradas (GIPKs) sejam excluídas do dump. Consulte a Seção 15.1.20.11, "Chaves primárias invisíveis geradas", para obter mais informações sobre as GIPKs e o modo GIPK.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>7

Para conexões a `localhost`, o arquivo de socket Unix a ser usado, ou, no Windows, o nome do tubo nomeado a ser usado.

Em Windows, esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de canal nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--ssl*`

As opções que começam com `--ssl` especificam se deve conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Consulte Opções de comando para conexões criptografadas.

* `--ssl-fips-mode={OFF|ON|STRICT}`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>8

Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere de outras opções `--ssl-xxx` porque não é usada para estabelecer conexões criptografadas, mas sim para determinar quais operações criptográficas devem ser permitidas. Veja a Seção 8.8, “Suporte FIPS”.

Esses valores `--ssl-fips-mode` são permitidos:

+ `OFF`: Desabilitar o modo FIPS.  
  + `ON`: Habilitar o modo FIPS.  
  + `STRICT`: Habilitar o modo FIPS "strict".

Nota

Se o Módulo de Objeto FIPS OpenSSL não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Neste caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente produza um aviso na inicialização e opere no modo não FIPS.

A partir do MySQL 8.0.34, essa opção é desatualizada. A espera é que ela seja removida em uma versão futura do MySQL.

* `--tls-ciphersuites=ciphersuite_list`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>9

As sequências de cifra permitidas para conexões criptografadas que utilizam TLSv1.3. O valor é uma lista de um ou mais nomes de sequência de cifra separados por vírgula. As sequências de cifra que podem ser nomeadas para esta opção dependem da biblioteca SSL utilizada para compilar o MySQL. Para obter detalhes, consulte a Seção 8.3.2, “Protocolos e cifras de conexão criptografada TLS”.

Essa opção foi adicionada no MySQL 8.0.16.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>0

Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolo separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, “Protocolos e cifras TLS de conexão criptografada”.

* `--triggers`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>1

Inclua gatilhos para cada tabela descarregada na saída.

Esta opção é ativada por padrão; use `--skip-triggers` para desativá-la.

* `--tz-utc`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>2

Essa opção permite que as colunas `TIMESTAMP` sejam descarregadas e recarregadas entre servidores em diferentes fusos horários. O **mysqlpump** define seu fuso horário de conexão como UTC e adiciona `SET TIME_ZONE='+00:00'` ao arquivo de dump. Sem essa opção, as colunas `TIMESTAMP` são descarregadas e recarregadas nos fusos horários locais dos servidores de origem e destino, o que pode causar alterações nos valores se os servidores estiverem em diferentes fusos horários. `--tz-utc` também protege contra mudanças devido ao horário de verão.

Esta opção é ativada por padrão; use `--skip-tz-utc` para desativá-la.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>3

O nome de usuário da conta MySQL a ser usado para se conectar ao servidor.

Se você estiver usando o plugin `Rewriter` com MySQL 8.0.31 ou posterior, você deve conceder a este usuário o privilégio `SKIP_QUERY_REWRITE`.

* `--users`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>4

Armazene as contas de usuário como definições lógicas na forma de declarações `CREATE USER` e `GRANT`.

As definições do usuário são armazenadas nas tabelas de concessão no banco de dados do sistema `mysql`. Por padrão, o **mysqlpump** não inclui as tabelas de concessão nos backups do banco de dados `mysql`. Para drenar o conteúdo das tabelas de concessão como definições lógicas, use a opção `--users` e suprima todos os backups do banco de dados:

  ```
  mysqlpump --exclude-databases=% --users
  ```

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>5

Exibir informações da versão e sair.

* `--watch-progress`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>6

Exiba periodicamente um indicador de progresso que forneça informações sobre o número de tabelas, linhas e outros objetos concluídos e o total.

Esta opção é ativada por padrão; use `--skip-watch-progress` para desativá-la.

* `--zstd-compression-level=level`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>7

O nível de compressão a ser usado para conexões ao servidor que utilizam o algoritmo de compressão `zstd`. Os níveis permitidos são de 1 a 22, com valores maiores indicando níveis crescentes de compressão. O nível de compressão padrão `zstd` é 3. O ajuste do nível de compressão não afeta as conexões que não utilizam compressão `zstd`.

Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

Essa opção foi adicionada no MySQL 8.0.18.

#### Seleção de Objeto mysqlpump

O **mysqlpump** possui um conjunto de opções de inclusão e exclusão que permitem a filtragem de vários tipos de objetos e fornecem controle flexível sobre quais objetos devem ser descarregados:

* `--include-databases` e `--exclude-databases` se aplicam a bancos de dados e a todos os objetos dentro deles.

* `--include-tables` e `--exclude-tables` se aplicam a tabelas. Essas opções também afetam gatilhos associados a tabelas, a menos que as opções específicas do gatilho sejam fornecidas.

* `--include-triggers` e `--exclude-triggers` se aplicam a gatilhos.

* `--include-routines` e `--exclude-routines` se aplicam a procedimentos e funções armazenadas. Se uma opção de rotina corresponder a um nome de procedimento armazenado, ela também corresponderá a uma função armazenada com o mesmo nome.

* `--include-events` e `--exclude-events` se aplicam a eventos do Agendamento de Eventos.

* `--include-users` e `--exclude-users` se aplicam a contas de usuário.

Qualquer opção de inclusão ou exclusão pode ser dada várias vezes. O efeito é aditivo. A ordem dessas opções não importa.

O valor de cada opção de inclusão e exclusão é uma lista de nomes separados por vírgula do tipo de objeto apropriado. Por exemplo:

```
--exclude-databases=test,world
--include-tables=customer,invoice
```

Os caracteres especiais são permitidos nos nomes dos objetos:

* `%` corresponde a qualquer sequência de zero ou mais caracteres.

* `_` corresponde a qualquer caracter único.

Por exemplo, `--include-tables=t%,__tmp` corresponde a todos os nomes de tabela que começam com `t` e todos os nomes de tabela de cinco caracteres que terminam com `tmp`.

Para os usuários, um nome especificado sem uma parte de host é interpretado com um host implícito de `%`. Por exemplo, `u1` e `u1@%` são equivalentes. Esta é a mesma equivalência que se aplica no MySQL em geral (veja Seção 8.2.4, “Especificação de nomes de conta”).

As opções de inclusão e exclusão interagem da seguinte forma:

* Por padrão, sem opções de inclusão ou exclusão, o **mysqlpump** exibe todos os bancos de dados (com certas exceções mencionadas na restrição do mysqlpump).

* Se as opções de inclusão forem fornecidas na ausência de opções de exclusão, apenas os objetos nomeados como incluídos serão descarregados.

* Se as opções de exclusão forem fornecidas na ausência de opções de inclusão, todos os objetos serão descarregados, exceto aqueles nomeados como excluídos.

* Se as opções de inclusão e exclusão forem fornecidas, todos os objetos nomeados como excluídos e não nomeados como incluídos não serão descarregados. Todos os outros objetos serão descarregados.

Se várias bases de dados estão sendo descarregadas, é possível nomear tabelas, gatilhos e rotinas em uma base de dados específica qualificando os nomes dos objetos com o nome da base de dados. O comando a seguir descarrega as bases de dados `db1` e `db2`, mas exclui as tabelas `db1.t1` e `db2.t2`:

```
mysqlpump --include-databases=db1,db2 --exclude-tables=db1.t1,db2.t2
```

As opções a seguir fornecem formas alternativas de especificar quais bancos de dados devem ser descarregados:

* A opção `--all-databases` descarta todos os bancos de dados (com certas exceções mencionadas nas restrições do mysqlpump). É equivalente a não especificar nenhuma opção de objeto (a ação padrão do **mysqlpump** é descartar tudo).

`--include-databases=%` é semelhante a `--all-databases`, mas seleciona todas as bases de dados para dumping, mesmo aquelas que são exceções para `--all-databases`.

* A opção `--databases` faz com que o **mysqlpump** trate todos os argumentos de nome como nomes de bancos a serem descarregados. É equivalente a uma opção `--include-databases` que nomeia os mesmos bancos.

#### mysqlpump Processamento Paralelo

O **mysqlpump** pode usar paralelismo para alcançar processamento concorrente. Você pode selecionar a concorrência entre bancos de dados (para drenar vários bancos de dados simultaneamente) e dentro dos bancos de dados (para drenar vários objetos de um banco de dados dado simultaneamente).

Por padrão, o **mysqlpump** configura uma fila com dois threads. Você pode criar filas adicionais e controlar o número de threads atribuídas a cada uma delas, incluindo a fila padrão:

* `--default-parallelism=N` especifica o número padrão de threads usadas para cada fila. Na ausência desta opção, *`N`* é 2.

A fila padrão sempre usa o número padrão de threads. As filas adicionais usam o número padrão de threads, a menos que você especifique o contrário.

* `--parallel-schemas=[N:]db_list` configura uma fila de processamento para drenar os bancos de dados nomeados em *`db_list`* e especifica opcionalmente quantos threads a fila usa. *`db_list` é uma lista de nomes de bancos de dados separados por vírgula. Se o argumento da opção começar com `N:`, a fila usa *`N`* threads. Caso contrário, a opção `--default-parallelism` determina o número de threads da fila.

Múltiplas instâncias da opção `--parallel-schemas` criam múltiplas filas.

Os nomes na lista do banco de dados são permitidos conter os mesmos caracteres de substituição `%` e `_` suportados para opções de filtragem (veja Seleção de Objeto mysqlpump).

O **mysqlpump** usa a fila padrão para processar quaisquer bancos de dados que não sejam explicitamente nomeados com a opção `--parallel-schemas`, e para drenar as definições de usuário se as opções do comando as selecionarem.

Em geral, com várias filas, o **mysqlpump** utiliza o paralelismo entre os conjuntos de bancos de dados processados pelas filas, para drenar vários bancos de dados simultaneamente. Para uma fila que utiliza vários threads, o **mysqlpump** utiliza o paralelismo dentro dos bancos de dados, para drenar vários objetos de um banco de dados dado simultaneamente. Pode ocorrer exceções; por exemplo, o **mysqlpump** pode bloquear as filas enquanto obtém listas de objetos dos servidores nos bancos de dados.

Com o paralelismo ativado, é possível intercalar a saída de diferentes bancos de dados. Por exemplo, as declarações `INSERT` de várias tabelas descarregadas em paralelo podem ser intercaladas; as declarações não são escritas em qualquer ordem específica. Isso não afeta a recarga porque as declarações de saída qualificam os nomes dos objetos com os nomes dos bancos de dados ou são precedidas por declarações `USE` conforme necessário.

A granularidade para paralelismo é um único objeto de banco de dados. Por exemplo, uma única tabela não pode ser descarregada em paralelo usando vários threads.

Exemplos:

```
mysqlpump --parallel-schemas=db1,db2 --parallel-schemas=db3
```

O **mysqlpump** configura uma fila para processar `db1` e `db2`, outra fila para processar `db3`, e uma fila padrão para processar todos os outros bancos de dados. Todas as filas utilizam dois threads.

```
mysqlpump --parallel-schemas=db1,db2 --parallel-schemas=db3
          --default-parallelism=4
```

Isto é o mesmo que o exemplo anterior, exceto que todas as filas utilizam quatro threads.

```
mysqlpump --parallel-schemas=5:db1,db2 --parallel-schemas=3:db3
```

A fila para `db1` e `db2` usa cinco threads, a fila para `db3` usa três threads, e a fila padrão usa o padrão de duas threads.

Como um caso especial, com `--default-parallelism=0` e sem opções de `--parallel-schemas`, o **mysqlpump** funciona como um processo monolínio e não cria filas.

#### mysqlpump Restrições

O **mysqlpump** não densa o esquema `performance_schema`, `ndbinfo` ou `sys` por padrão. Para drenar qualquer um desses, nomeie-os explicitamente na linha de comando. Você também pode nomeá-los com a opção `--databases` ou `--include-databases`.

O **mysqlpump** não densa o esquema `INFORMATION_SCHEMA`.

O **mysqlpump** não densa as declarações `InnoDB` [`CREATE TABLESPACE`](create-tablespace.html "15.1.21 CREATE TABLESPACE Statement")

O **mysqlpump** exibe contas de usuários em forma lógica usando as declarações `CREATE USER` e `GRANT` (por exemplo, quando você usa a opção `--include-users` ou `--users`). Por esse motivo, os backups do banco de dados do sistema `mysql` não incluem, por padrão, as tabelas de concessão que contêm definições de usuário: `user`, `db`, `tables_priv`, `columns_priv`, `procs_priv` ou `proxies_priv`. Para fazer backup de qualquer uma das tabelas de concessão, nomeie o banco de dados `mysql` seguido pelos nomes das tabelas:

```
mysqlpump mysql user db ...
```

### 6.5.7 mysqlshow — Exibir informações de banco de dados, tabela e coluna

O cliente **mysqlshow** pode ser usado para ver rapidamente quais bancos de dados existem, suas tabelas ou as colunas ou índices de uma tabela.

O **mysqlshow** fornece uma interface de linha de comando para várias instruções SQL `SHOW`. Veja a Seção 15.7.7, “Instruções SHOW”. As mesmas informações podem ser obtidas usando essas instruções diretamente. Por exemplo, você pode executá-las a partir do programa cliente **mysql**.

Invoque o **mysqlshow** da seguinte forma:

```
mysqlshow [options] [db_name [tbl_name [col_name]]]
```

* Se não for fornecida uma base de dados, uma lista de nomes de bases de dados é exibida. * Se não for fornecida uma tabela, todas as tabelas correspondentes na base de dados são exibidas.

* Se não for fornecida nenhuma coluna, todas as colunas e tipos de coluna correspondentes na tabela são exibidos.

A saída exibe apenas os nomes dos bancos de dados, tabelas ou colunas para os quais você tem alguns privilégios.

Se o último argumento contiver caracteres de comodinho de shell ou SQL (`*`, `?`, `%` ou `_`), apenas os nomes que são correspondidos pelo comodinho são mostrados. Se um nome de banco de dados contiver quaisquer sublinhados, esses devem ser escapados com uma barra invertida (algumas cartilhas Unix requerem duas) para obter uma lista das tabelas ou colunas adequadas. Os caracteres `*` e `?` são convertidos em caracteres de comodinho SQL `%` e `_`. Isso pode causar alguma confusão quando você tenta exibir as colunas de uma tabela com um `_` no nome, porque, neste caso, **mysqlshow** mostra apenas os nomes de tabela que correspondem ao padrão. Isso é facilmente corrigido adicionando um último `%` na linha de comando como um argumento separado.

O **mysqlshow** suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysqlshow]` e `[client]` de um arquivo de opções. Para informações sobre arquivos de opções usados por programas do MySQL, consulte a Seção 6.2.2.2, “Usando arquivos de opções”.

**Tabela 6.18 Opções mysqlshow**

<table frame="box" rules="all" summary="Command-line options available for mysqlshow."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Introduced</th> <th scope="col">Deprecated</th> </tr></thead><tbody><tr><th scope="row">--bind-address</th> <td>Use a interface de rede especificada para se conectar ao servidor MySQL</td> <td></td> <td></td> </tr><tr><th scope="row">--character-sets-dir</th> <td>Diretório onde os conjuntos de caracteres podem ser encontrados</td> <td></td> <td></td> </tr><tr><th scope="row">--compress</th> <td>Compressar todas as informações enviadas entre o cliente e o servidor</td> <td></td> <td>8.0.18</td> </tr><tr><th scope="row">--compression-algorithms</th> <td>Algoritmos de compressão permitidos para conexões ao servidor</td> <td>8.0.18</td> <td></td> </tr><tr><th scope="row">--count</th> <td>Mostre o número de linhas por tabela</td> <td></td> <td></td> </tr><tr><th scope="row">--debug</th> <td>Write debugging log</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-check</th> <td>Imprimir informações de depuração quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-info</th> <td>Imprimir informações de depuração, memória e estatísticas de CPU quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row">--default-auth</th> <td>Plugin de autenticação a ser utilizado</td> <td></td> <td></td> </tr><tr><th scope="row">--default-character-set</th> <td>Especificar o conjunto de caracteres padrão</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-extra-file</th> <td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-file</th> <td>Arquivo de opção de leitura apenas nomeado</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-group-suffix</th> <td>Valor do sufixo do grupo de opções</td> <td></td> <td></td> </tr><tr><th scope="row">--enable-cleartext-plugin</th> <td>Habilitar o plugin de autenticação de texto claro</td> <td></td> <td></td> </tr><tr><th scope="row">--get-server-public-key</th> <td>Solicitar chave pública RSA do servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--help</th> <td>Exibir mensagem de ajuda e sair</td> <td></td> <td></td> </tr><tr><th scope="row">--host</th> <td>Anfitrião no qual o servidor MySQL está localizado</td> <td></td> <td></td> </tr><tr><th scope="row">--keys</th> <td>Show table indexes</td> <td></td> <td></td> </tr><tr><th scope="row">--login-path</th> <td>Leia as opções de caminho de login a partir de .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th scope="row">--no-defaults</th> <td>Não leia arquivos de opção</td> <td></td> <td></td> </tr><tr><th scope="row">--password</th> <td>Senha para usar ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--password1</th> <td>Primeira senha de autenticação multifatorial a usar ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password2</th> <td>Segunda senha de autenticação multifatorial a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password3</th> <td>Terceira senha de autenticação multifatorial a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--pipe</th> <td>Conecte-se ao servidor usando um tubo nomeado (apenas Windows)</td> <td></td> <td></td> </tr><tr><th scope="row">--plugin-dir</th> <td>Diretório onde os plugins são instalados</td> <td></td> <td></td> </tr><tr><th scope="row">--port</th> <td>TCP/IP port number for connection</td> <td></td> <td></td> </tr><tr><th scope="row">--print-defaults</th> <td>Print default options</td> <td></td> <td></td> </tr><tr><th scope="row">--protocol</th> <td>Protocolo de transporte a ser utilizado</td> <td></td> <td></td> </tr><tr><th scope="row">--server-public-key-path</th> <td>Nome do caminho para o arquivo que contém a chave pública RSA</td> <td></td> <td></td> </tr><tr><th scope="row">--shared-memory-base-name</th> <td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td> <td></td> <td></td> </tr><tr><th scope="row">--show-table-type</th> <td>Mostre uma coluna indicando o tipo de tabela</td> <td></td> <td></td> </tr><tr><th scope="row">--socket</th> <td>Arquivo de socket Unix ou tubo nomeado do Windows a ser usado</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-ca</th> <td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-capath</th> <td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cert</th> <td>Arquivo que contém o certificado X.509</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cipher</th> <td>Cifras permitidas para criptografia de conexão</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crl</th> <td>Arquivo que contém listas de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crlpath</th> <td>Diretório que contém arquivos de lista de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-fips-mode</th> <td>Se deve habilitar o modo FIPS no lado do cliente</td> <td></td> <td>8.0.34</td> </tr><tr><th scope="row">--ssl-key</th> <td>Arquivo que contém a chave X.509</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-mode</th> <td>Estado de segurança desejado da conexão com o servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-session-data</th> <td>Arquivo que contém dados da sessão SSL</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--ssl-session-data-continue-on-failed-reuse</th> <td>Se estabelecer conexões se a reutilização da sessão falhar</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--status</th> <td>Exibir informações extras sobre cada tabela</td> <td></td> <td></td> </tr><tr><th scope="row">--tls-ciphersuites</th> <td>Cifras TLSv1.3 permitidas para conexões criptografadas</td> <td>8.0.16</td> <td></td> </tr><tr><th scope="row">--tls-version</th> <td>Protocolos TLS permitidos para conexões criptografadas</td> <td></td> <td></td> </tr><tr><th scope="row">--user</th> <td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--verbose</th> <td>Verbose mode</td> <td></td> <td></td> </tr><tr><th scope="row">--version</th> <td>Exibir informações da versão e sair</td> <td></td> <td></td> </tr><tr><th scope="row">--zstd-compression-level</th> <td>Nível de compressão para conexões ao servidor que utilizam compressão zstd</td> <td>8.0.18</td> <td></td> </tr></tbody></table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Exibir uma mensagem de ajuda e sair.

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

Em um computador com várias interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao servidor MySQL.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

O diretório onde os conjuntos de caracteres são instalados. Veja a Seção 12.15, “Configuração de Conjunto de Caracteres”.

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

Compressa todas as informações enviadas entre o cliente e o servidor, se possível. Veja a Seção 6.2.8, “Controle de Compressão de Conexão”.

A partir do MySQL 8.0.18, essa opção é desatualizada. A espera é que ela seja removida em uma versão futura do MySQL. Veja Configurando Compressão de Conexão Legada.

* `--compression-algorithms=value`

  <table frame="box" rules="all" summary="Properties for compression-algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compression-algorithms=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>uncompressed</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>zlib</code></p><p class="valid-value"><code>zstd</code></p><p class="valid-value"><code>uncompressed</code></p></td> </tr></tbody></table>

Os algoritmos de compressão permitidos para conexões ao servidor. Os algoritmos disponíveis são os mesmos que para a variável de sistema `protocol_compression_algorithms`. O valor padrão é `uncompressed`.

Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

Essa opção foi adicionada no MySQL 8.0.18.

* `--count`

  <table frame="box" rules="all" summary="Properties for count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--count</code></td> </tr></tbody></table>

Mostre o número de linhas por tabela. Isso pode ser lento para tabelas que não são `MyISAM`.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Properties for debug"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug[=debug_options]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>d:t:o</code></td> </tr></tbody></table>

Escreva um registro de depuração. Uma string típica *`debug_options`* é `d:t:o,file_name`. O padrão é `d:t:o`.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--debug-check`

  <table frame="box" rules="all" summary="Properties for debug-check"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug-check</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

Imprima algumas informações de depuração quando o programa sair.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--debug-info`

  <table frame="box" rules="all" summary="Properties for debug-info"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug-info</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

Imprimir informações de depuração e estatísticas de uso de memória e CPU quando o programa sai.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--default-character-set=charset_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>0

Use *`charset_name`* como o conjunto de caracteres padrão. Veja a Seção 12.15, “Configuração do Conjunto de Caracteres”.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>1

Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Veja a Seção 8.2.17, “Autenticação substituível”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>2

Leia este arquivo de opção após o arquivo de opção global, mas (em Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>3

Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Exceção: Mesmo com `--defaults-file`, os programas de cliente leem `.mylogin.cnf`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>4

Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, **mysqlshow** normalmente lê os grupos `[client]` e `[mysqlshow]`. Se esta opção for dada como `--defaults-group-suffix=_other`, **mysqlshow** também lê os grupos `[client_other]` e `[mysqlshow_other]`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>5

Ative o plugin de autenticação de texto claro `mysql_clear_password`. (Veja a Seção 8.4.1.4, “Autenticação de Texto Claro Plugável do Lado do Cliente”).

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>6

Peça ao servidor a chave pública RSA que ele usa para a troca de senha baseada em par de chaves. Esta opção se aplica a clientes que se conectam ao servidor usando uma conta que se autentica com o plugin de autenticação `caching_sha2_password`. Para conexões por contas desse tipo, o servidor não envia a chave pública ao cliente, a menos que seja solicitado. A opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha baseada em RSA não for necessária, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

Para informações sobre o plugin `caching_sha2_password`, consulte a Seção 8.4.1.2, “Cacheamento de Autenticação Alterável SHA-2”.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>7

Conecte-se ao servidor MySQL no host fornecido.

* `--keys`, `-k`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>8

Mostrar índices de tabela.

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>9

Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam para qual servidor MySQL se conectar e qual conta se autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql_config_editor**. Veja a Seção 6.6.7, “mysql_config_editor — Utilitário de Configuração MySQL”.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>0

Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para impedir que elas sejam lidas.

A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql_config_editor**. Veja a Seção 6.6.7, “mysql_config_editor — Ferramenta de Configuração do MySQL”.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>1

A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysqlshow** solicita uma senha. Se for fornecida, não deve haver espaço entre `--password=` ou `-p` e a senha que a segue. Se não for especificado nenhum tipo de senha, o padrão é não enviar senha.

Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Veja a Seção 8.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

Para especificar explicitamente que não há senha e que o **mysqlshow** não deve solicitar uma senha, use a opção `--skip-password`.

* `--password1[=pass_val]`

A senha para o fator de autenticação multifatorial 1 da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysqlshow** solicita uma senha. Se for fornecida, não deve haver **espaço** entre `--password1=` e a senha que a segue. Se não for especificado nenhum tipo de opção de senha, o padrão é não enviar senha.

Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Veja a Seção 8.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

Para especificar explicitamente que não há senha e que o **mysqlshow** não deve solicitar uma senha, use a opção `--skip-password1`.

`--password1` e `--password` são sinônimos, assim como `--skip-password1` e `--skip-password`.

* `--password2[=pass_val]`

A senha para o fator de autenticação multifatorial 2 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica para `--password1`; consulte a descrição dessa opção para obter detalhes.

* `--password3[=pass_val]`

A senha para o fator de autenticação multifatorial 3 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica para `--password1`; consulte a descrição dessa opção para obter detalhes.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>2

Em Windows, conecte-se ao servidor usando um tubo nomeado. Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por tubo nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>3

O diretório onde procurar plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o **mysqlshow** não o encontrar. Veja a Seção 8.2.17, “Autenticação Conectada”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>4

Para conexões TCP/IP, o número de porta a ser utilizado.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>5

Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>6

O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de outro protocolo que não o desejado. Para obter detalhes sobre os valores permitidos, consulte a Seção 6.2.7, “Protocolos de Transporte de Conexão”.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>7

O nome do caminho de um arquivo em formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senha com base em par de chave RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

Para `sha256_password`, esta opção só se aplica se o MySQL foi construído usando OpenSSL.

Para informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 8.4.1.3, “Autenticação substituível SHA-256”, e a Seção 8.4.1.2, “Cache de autenticação substituível SHA-2”.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>8

Em Windows, o nome de memória compartilhada a ser usado para conexões feitas usando memória compartilhada a um servidor local. O valor padrão é `MYSQL`. O nome de memória compartilhada é sensível a maiúsculas e minúsculas.

Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

* `--show-table-type`, `-t`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>9

Mostre uma coluna indicando o tipo de tabela, como em `SHOW FULL TABLES`(show-tables.html "15.7.7.39 SHOW TABLES Statement"). O tipo é `BASE TABLE` ou `VIEW`.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>0

Para conexões a `localhost`, o arquivo de socket Unix a ser usado, ou, no Windows, o nome do tubo nomeado a ser usado.

Em Windows, esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de canal nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--ssl*`

As opções que começam com `--ssl` especificam se deve conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Consulte Opções de comando para conexões criptografadas.

* `--ssl-fips-mode={OFF|ON|STRICT}`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>1

Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere de outras opções `--ssl-xxx` porque não é usada para estabelecer conexões criptografadas, mas sim para determinar quais operações criptográficas devem ser permitidas. Veja a Seção 8.8, “Suporte FIPS”.

Esses valores `--ssl-fips-mode` são permitidos:

+ `OFF`: Desabilitar o modo FIPS.  
  + `ON`: Habilitar o modo FIPS.  
  + `STRICT`: Habilitar o modo FIPS "strict".

Nota

Se o Módulo de Objeto FIPS OpenSSL não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Neste caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente produza um aviso na inicialização e opere no modo não FIPS.

A partir do MySQL 8.0.34, essa opção é desatualizada. A espera é que ela seja removida em uma versão futura do MySQL.

* `--status`, `-i`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>2

Exibir informações extras sobre cada tabela.

* `--tls-ciphersuites=ciphersuite_list`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>3

As sequências de cifra permitidas para conexões criptografadas que utilizam TLSv1.3. O valor é uma lista de um ou mais nomes de sequência de cifra separados por vírgula. As sequências de cifra que podem ser nomeadas para esta opção dependem da biblioteca SSL utilizada para compilar o MySQL. Para obter detalhes, consulte a Seção 8.3.2, “Protocolos e cifras de conexão criptografada TLS”.

Essa opção foi adicionada no MySQL 8.0.16.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>4

Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolo separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, “Protocolos e cifras TLS de conexão criptografada”.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>5

O nome de usuário da conta MySQL a ser usado para se conectar ao servidor.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>6

Modo detalhado. Imprima mais informações sobre o que o programa faz. Essa opção pode ser usada várias vezes para aumentar a quantidade de informações.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>7

Exibir informações da versão e sair.

* `--zstd-compression-level=level`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>8

O nível de compressão a ser usado para conexões ao servidor que utilizam o algoritmo de compressão `zstd`. Os níveis permitidos são de 1 a 22, com valores maiores indicando níveis crescentes de compressão. O nível de compressão padrão `zstd` é 3. O ajuste do nível de compressão não afeta as conexões que não utilizam compressão `zstd`.

Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

Essa opção foi adicionada no MySQL 8.0.18.

### 6.5.8 mysqlslap — Um cliente de emulação de carga

O **mysqlslap** é um programa de diagnóstico projetado para emular a carga de clientes para um servidor MySQL e relatar o tempo de cada etapa. Funciona como se vários clientes estivessem acessando o servidor.

Invoque o **mysqlslap** da seguinte forma:

```
mysqlslap [options]
```

Algumas opções, como `--create` ou `--query`, permitem que você especifique uma string contendo uma declaração SQL ou um arquivo contendo declarações. Se você especificar um arquivo, por padrão, ele deve conter uma declaração por linha. (Ou seja, o delimitador de declaração implícito é o caractere de nova linha.) Use a opção `--delimiter` para especificar um delimitador diferente, o que permite que você especifique declarações que abrangem várias linhas ou coloque várias declarações em uma única linha. Não é possível incluir comentários em um arquivo; o **mysqlslap** não os entende.

**mysqlslap** é executado em três etapas:

1. Crie esquema, tabela e, opcionalmente, quaisquer programas ou dados armazenados para uso no teste. Esta etapa utiliza uma única conexão de cliente.

2. Execute o teste de carga. Esta etapa pode usar muitas conexões do cliente.

3. Limpe (desconecte, descarte a tabela, se especificado). Esta etapa utiliza uma única conexão do cliente.

Exemplos:

Forneça suas próprias instruções de criação e consulta SQL, com 50 clientes fazendo consultas e 200 seleções para cada uma (insira o comando em uma única linha):

```
mysqlslap --delimiter=";"
  --create="CREATE TABLE a (b int);INSERT INTO a VALUES (23)"
  --query="SELECT * FROM a" --concurrency=50 --iterations=200
```

Peça que o **mysqlslap** construa a declaração SQL da consulta com uma tabela com duas colunas `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT) e três colunas `VARCHAR`. Use cinco clientes fazendo consultas 20 vezes cada um. Não crie a tabela ou insira os dados (ou seja, use o esquema e os dados do teste anterior):

```
mysqlslap --concurrency=5 --iterations=20
  --number-int-cols=2 --number-char-cols=3
  --auto-generate-sql
```

Informe ao programa para carregar as declarações SQL de criação, inserção e consulta dos arquivos especificados, onde o arquivo `create.sql` tem várias declarações de criação de tabela delimitadas por `';'` e várias declarações de inserção delimitadas por `';'`. O arquivo `--query` deve conter várias consultas delimitadas por `';'`. Execute todas as declarações de carregamento, em seguida, execute todas as consultas no arquivo de consulta com cinco clientes (cinco vezes cada):

```
mysqlslap --concurrency=5
  --iterations=5 --query=query.sql --create=create.sql
  --delimiter=";"
```

O **mysqlslap** suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysqlslap]` e `[client]` de um arquivo de opções. Para informações sobre arquivos de opções usados por programas do MySQL, consulte a Seção 6.2.2.2, “Usando arquivos de opções”.

**Tabela 6.19 Opções mysqlslap**

<table frame="box" rules="all" summary="Command-line options available for mysqlslap."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Introduced</th> <th scope="col">Deprecated</th> </tr></thead><tbody><tr><th scope="row">--auto-generate-sql</th> <td>Gerar declarações SQL automaticamente quando elas não são fornecidas em arquivos ou usando opções de comando</td> <td></td> <td></td> </tr><tr><th scope="row">--auto-generate-sql-add-autoincrement</th> <td>Add AUTO_INCREMENT column to automatically generated tables</td> <td></td> <td></td> </tr><tr><th scope="row">--auto-generate-sql-execute-number</th> <td>Especifique quantos pedidos devem ser gerados automaticamente</td> <td></td> <td></td> </tr><tr><th scope="row">--auto-generate-sql-guid-primary</th> <td>Adicione uma chave primária baseada em GUID a tabelas geradas automaticamente</td> <td></td> <td></td> </tr><tr><th scope="row">--auto-generate-sql-load-type</th> <td>Especifique o tipo de carga de teste</td> <td></td> <td></td> </tr><tr><th scope="row">--auto-generate-sql-secondary-indexes</th> <td>Especifique quantos índices secundários devem ser adicionados às tabelas geradas automaticamente</td> <td></td> <td></td> </tr><tr><th scope="row">--auto-generate-sql-unique-query-number</th> <td>Quantas consultas diferentes devem ser geradas para testes automáticos</td> <td></td> <td></td> </tr><tr><th scope="row">--auto-generate-sql-unique-write-number</th> <td>Quantas consultas diferentes devem ser geradas para --auto-generate-sql-write-number</td> <td></td> <td></td> </tr><tr><th scope="row">--auto-generate-sql-write-number</th> <td>Quantas inserções de linha devem ser realizadas em cada fio</td> <td></td> <td></td> </tr><tr><th scope="row">--commit</th> <td>Quantas declarações executar antes de comprometer</td> <td></td> <td></td> </tr><tr><th scope="row">--compress</th> <td>Compressar todas as informações enviadas entre o cliente e o servidor</td> <td></td> <td>8.0.18</td> </tr><tr><th scope="row">--compression-algorithms</th> <td>Algoritmos de compressão permitidos para conexões ao servidor</td> <td>8.0.18</td> <td></td> </tr><tr><th scope="row">--concurrency</th> <td>Número de clientes a simular ao emitir a declaração SELECT</td> <td></td> <td></td> </tr><tr><th scope="row">--create</th> <td>Arquivo ou cadeia que contém a declaração a ser usada para criar a tabela</td> <td></td> <td></td> </tr><tr><th scope="row">--create-schema</th> <td>Esquema no qual os testes serão executados</td> <td></td> <td></td> </tr><tr><th scope="row">--csv</th> <td>Gerar saída no formato de valores separados por vírgula</td> <td></td> <td></td> </tr><tr><th scope="row">--debug</th> <td>Write debugging log</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-check</th> <td>Imprimir informações de depuração quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-info</th> <td>Imprimir informações de depuração, memória e estatísticas de CPU quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row">--default-auth</th> <td>Plugin de autenticação a ser utilizado</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-extra-file</th> <td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-file</th> <td>Arquivo de opção de leitura apenas nomeado</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-group-suffix</th> <td>Valor do sufixo do grupo de opções</td> <td></td> <td></td> </tr><tr><th scope="row">--delimiter</th> <td>Separador a ser usado em declarações SQL</td> <td></td> <td></td> </tr><tr><th scope="row">--detach</th> <td>Desconecte (abra e feche) cada conexão após cada N de declarações</td> <td></td> <td></td> </tr><tr><th scope="row">--enable-cleartext-plugin</th> <td>Habilitar o plugin de autenticação de texto claro</td> <td></td> <td></td> </tr><tr><th scope="row">--engine</th> <td>Motor de armazenamento a ser usado para criar a tabela</td> <td></td> <td></td> </tr><tr><th scope="row">--get-server-public-key</th> <td>Solicitar chave pública RSA do servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--help</th> <td>Exibir mensagem de ajuda e sair</td> <td></td> <td></td> </tr><tr><th scope="row">--host</th> <td>Anfitrião no qual o servidor MySQL está localizado</td> <td></td> <td></td> </tr><tr><th scope="row">--iterations</th> <td>Número de vezes para executar os testes</td> <td></td> <td></td> </tr><tr><th scope="row">--login-path</th> <td>Leia as opções de caminho de login a partir de .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th scope="row">--no-defaults</th> <td>Não leia arquivos de opção</td> <td></td> <td></td> </tr><tr><th scope="row">--no-drop</th> <td>Não descarte nenhum esquema criado durante a execução do teste</td> <td></td> <td></td> </tr><tr><th scope="row">--number-char-cols</th> <td>Número de colunas VARCHAR a serem usadas se --auto-generate-sql for especificado</td> <td></td> <td></td> </tr><tr><th scope="row">--number-int-cols</th> <td>Número de colunas INT a serem usadas se --auto-generate-sql for especificado</td> <td></td> <td></td> </tr><tr><th scope="row">--number-of-queries</th> <td>Limite cada cliente a aproximadamente esse número de consultas</td> <td></td> <td></td> </tr><tr><th scope="row">--only-print</th> <td>Não conecte-se aos bancos de dados. mysqlslap só imprime o que teria feito</td> <td></td> <td></td> </tr><tr><th scope="row">--password</th> <td>Senha para usar ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--password1</th> <td>Primeira senha de autenticação multifatorial a usar ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password2</th> <td>Segunda senha de autenticação multifatorial a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password3</th> <td>Terceira senha de autenticação multifatorial a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--pipe</th> <td>Conecte-se ao servidor usando um tubo nomeado (apenas Windows)</td> <td></td> <td></td> </tr><tr><th scope="row">--plugin-dir</th> <td>Diretório onde os plugins são instalados</td> <td></td> <td></td> </tr><tr><th scope="row">--port</th> <td>TCP/IP port number for connection</td> <td></td> <td></td> </tr><tr><th scope="row">--post-query</th> <td>Arquivo ou cadeia contendo a declaração a ser executada após a conclusão dos testes</td> <td></td> <td></td> </tr><tr><th scope="row">--post-system</th> <td>String para executar usando system() após os testes terem sido concluídos</td> <td></td> <td></td> </tr><tr><th scope="row">--pre-query</th> <td>Arquivo ou cadeia contendo a declaração a ser executada antes de executar os testes</td> <td></td> <td></td> </tr><tr><th scope="row">--pre-system</th> <td>String para executar usando system() antes de executar os testes</td> <td></td> <td></td> </tr><tr><th scope="row">--print-defaults</th> <td>Print default options</td> <td></td> <td></td> </tr><tr><th scope="row">--protocol</th> <td>Protocolo de transporte a ser utilizado</td> <td></td> <td></td> </tr><tr><th scope="row">--query</th> <td>Arquivo ou cadeia contendo a declaração SELECT a ser usada para recuperar dados</td> <td></td> <td></td> </tr><tr><th scope="row">--server-public-key-path</th> <td>Nome do caminho para o arquivo que contém a chave pública RSA</td> <td></td> <td></td> </tr><tr><th scope="row">--shared-memory-base-name</th> <td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td> <td></td> <td></td> </tr><tr><th scope="row">--silent</th> <td>Silent mode</td> <td></td> <td></td> </tr><tr><th scope="row">--socket</th> <td>Arquivo de socket Unix ou tubo nomeado do Windows a ser usado</td> <td></td> <td></td> </tr><tr><th scope="row">--sql-mode</th> <td>Definir o modo SQL para a sessão do cliente</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-ca</th> <td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-capath</th> <td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cert</th> <td>Arquivo que contém o certificado X.509</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cipher</th> <td>Cifras permitidas para criptografia de conexão</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crl</th> <td>Arquivo que contém listas de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crlpath</th> <td>Diretório que contém arquivos de lista de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-fips-mode</th> <td>Se deve habilitar o modo FIPS no lado do cliente</td> <td></td> <td>8.0.34</td> </tr><tr><th scope="row">--ssl-key</th> <td>Arquivo que contém a chave X.509</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-mode</th> <td>Estado de segurança desejado da conexão com o servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-session-data</th> <td>Arquivo que contém dados da sessão SSL</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--ssl-session-data-continue-on-failed-reuse</th> <td>Se estabelecer conexões se a reutilização da sessão falhar</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--tls-ciphersuites</th> <td>Cifras TLSv1.3 permitidas para conexões criptografadas</td> <td>8.0.16</td> <td></td> </tr><tr><th scope="row">--tls-version</th> <td>Protocolos TLS permitidos para conexões criptografadas</td> <td></td> <td></td> </tr><tr><th scope="row">--user</th> <td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--verbose</th> <td>Verbose mode</td> <td></td> <td></td> </tr><tr><th scope="row">--version</th> <td>Exibir informações da versão e sair</td> <td></td> <td></td> </tr><tr><th scope="row">--zstd-compression-level</th> <td>Nível de compressão para conexões ao servidor que utilizam compressão zstd</td> <td>8.0.18</td> <td></td> </tr></tbody></table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Exibir uma mensagem de ajuda e sair.

* `--auto-generate-sql`, `-a`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

Gerar declarações SQL automaticamente quando elas não são fornecidas em arquivos ou usando opções de comando.

* `--auto-generate-sql-add-autoincrement`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

Adicione uma coluna `AUTO_INCREMENT` às tabelas geradas automaticamente.

* `--auto-generate-sql-execute-number=N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

Especifique quantos pedidos devem ser gerados automaticamente.

* `--auto-generate-sql-guid-primary`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

Adicione uma chave primária baseada em GUID a tabelas geradas automaticamente.

* `--auto-generate-sql-load-type=type`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-load-type"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-load-type=type</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>mixed</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>read</code></p><p class="valid-value"><code>write</code></p><p class="valid-value"><code>key</code></p><p class="valid-value"><code>update</code></p><p class="valid-value"><code>mixed</code></p></td> </tr></tbody></table>

Especifique o tipo de carga de teste. Os valores permitidos são `read` (tabelas de varredura), `write` (inserir em tabelas), `key` (ler chaves primárias), `update` (atualizar chaves primárias) ou `mixed` (metade de inserções, metade de seleções de varredura). O padrão é `mixed`.

* `--auto-generate-sql-secondary-indexes=N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-secondary-indexes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-secondary-indexes=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr></tbody></table>

Especifique quantos índices secundários devem ser adicionados às tabelas geradas automaticamente. Por padrão, nenhum é adicionado.

* `--auto-generate-sql-unique-query-number=N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-unique-query-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-unique-query-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>10</code></td> </tr></tbody></table>

Quantas consultas diferentes devem ser geradas para testes automáticos. Por exemplo, se você executar um teste `key` que realiza 1000 seleções, você pode usar essa opção com um valor de 1000 para executar 1000 consultas únicas, ou com um valor de 50 para realizar 50 seleções diferentes. O padrão é 10.

* `--auto-generate-sql-unique-write-number=N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-unique-write-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-unique-write-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>10</code></td> </tr></tbody></table>

Quantas consultas diferentes devem ser geradas para `--auto-generate-sql-write-number`. O padrão é 10.

* `--auto-generate-sql-write-number=N`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>0

Quantos insertos de linha devem ser realizados. O padrão é 100.

* `--commit=N`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>1

Quantas declarações executar antes de comprometer. O padrão é 0 (nenhuma comissão é feita).

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>2

Compressa todas as informações enviadas entre o cliente e o servidor, se possível. Veja a Seção 6.2.8, “Controle de Compressão de Conexão”.

A partir do MySQL 8.0.18, essa opção é desatualizada. A espera é que ela seja removida em uma versão futura do MySQL. Veja Configurando Compressão de Conexão Legada.

* `--compression-algorithms=value`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>3

Os algoritmos de compressão permitidos para conexões ao servidor. Os algoritmos disponíveis são os mesmos que para a variável de sistema `protocol_compression_algorithms`. O valor padrão é `uncompressed`.

Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

Essa opção foi adicionada no MySQL 8.0.18.

* `--concurrency=N`, `-c N`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>4

O número de clientes paralelos a serem simulados.

* `--create=value`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>5

O arquivo ou a cadeia que contém a declaração a ser usada para criar a tabela.

* `--create-schema=value`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>6

O esquema no qual os testes devem ser executados.

Nota

Se a opção `--auto-generate-sql` também for fornecida, o **mysqlslap** descarta o esquema no final da execução do teste. Para evitar isso, use também a opção `--no-drop`.

* `--csv[=file_name]`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>7

Gerar a saída no formato de valores separados por vírgula. A saída vai para o arquivo nomeado, ou para a saída padrão se nenhum arquivo for dado.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>8

Escreva um registro de depuração. Uma string típica *`debug_options`* é `d:t:o,file_name`. O padrão é `d:t:o,/tmp/mysqlslap.trace`.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--debug-check`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>9

Imprima algumas informações de depuração quando o programa sair.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--debug-info`, `-T`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>0

Imprimir informações de depuração e estatísticas de uso de memória e CPU quando o programa sai.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>1

Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Veja a Seção 8.2.17, “Autenticação substituível”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>2

Leia este arquivo de opção após o arquivo de opção global, mas (em Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>3

Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Exceção: Mesmo com `--defaults-file`, os programas de cliente leem `.mylogin.cnf`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>4

Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, **mysqlslap** normalmente lê os grupos `[client]` e `[mysqlslap]`. Se esta opção for dada como `--defaults-group-suffix=_other`, **mysqlslap** também lê os grupos `[client_other]` e `[mysqlslap_other]`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--delimiter=str`, `-F str`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>5

O delimitador a ser usado em declarações SQL fornecidas em arquivos ou usando opções de comando.

* `--detach=N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>6

Desconecte (abra e feche novamente) cada conexão após cada declaração *`N`*. O padrão é 0 (as conexões não são desconectadas).

* `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>7

Ative o plugin de autenticação de texto claro `mysql_clear_password`. (Veja a Seção 8.4.1.4, “Autenticação de Texto Claro Plugável do Lado do Cliente”).

* `--engine=engine_name`, `-e engine_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>8

O mecanismo de armazenamento a ser usado para criar tabelas.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>9

Peça ao servidor a chave pública RSA que ele usa para a troca de senha baseada em par de chaves. Esta opção se aplica a clientes que se conectam ao servidor usando uma conta que se autentica com o plugin de autenticação `caching_sha2_password`. Para conexões por contas desse tipo, o servidor não envia a chave pública ao cliente, a menos que seja solicitado. A opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha baseada em RSA não for necessária, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

Para informações sobre o plugin `caching_sha2_password`, consulte a Seção 8.4.1.2, “Cacheamento de Autenticação Alterável SHA-2”.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>0

Conecte-se ao servidor MySQL no host fornecido.

* `--iterations=N`, `-i N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>1

O número de vezes em que os testes devem ser realizados.

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>2

Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam para qual servidor MySQL se conectar e qual conta se autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql_config_editor**. Veja a Seção 6.6.7, “mysql_config_editor — Utilitário de Configuração MySQL”.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--no-drop`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>3

Evite que o **mysqlslap** elimine qualquer esquema que ele crie durante a execução do teste.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>4

Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para impedir que elas sejam lidas.

A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql_config_editor**. Veja a Seção 6.6.7, “mysql_config_editor — Ferramenta de Configuração do MySQL”.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--number-char-cols=N`, `-x N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>5

O número de colunas `VARCHAR` a serem utilizadas, se `--auto-generate-sql` for especificado.

* `--number-int-cols=N`, `-y N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>6

O número de colunas `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") a serem usadas se `--auto-generate-sql` for especificado.

* `--number-of-queries=N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>7

Limite cada cliente a aproximadamente esse número de consultas. O contagem de consultas leva em consideração o delimitador da declaração. Por exemplo, se você invocar o **mysqlslap** da seguinte forma, o delimitador `;` é reconhecido para que cada instância da string de consulta seja contada como duas consultas. Como resultado, 5 linhas (e não 10) são inseridas.

  ```
  mysqlslap --delimiter=";" --number-of-queries=10
            --query="use test;insert into t values(null)"
  ```

* `--only-print`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>8

Não conecte-se aos bancos de dados. **mysqlslap** apenas imprime o que teria feito.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>9

A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecida, o **mysqlslap** solicitará uma senha. Se for fornecida, não deve haver *espaço* entre `--password=` ou `-p` e a senha que a segue. Se não for especificado nenhum tipo de opção de senha, o padrão é não enviar senha.

Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Veja a Seção 8.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

Para especificar explicitamente que não há senha e que o **mysqlslap** não deve solicitar uma senha, use a opção `--skip-password`.

* `--password1[=pass_val]`

A senha para o fator de autenticação multifatorial 1 da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysqlslap** solicita uma senha. Se for fornecida, não deve haver **espaço** entre `--password1=` e a senha que a segue. Se não for especificado nenhum tipo de opção de senha, o padrão é não enviar senha.

Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Veja a Seção 8.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

Para especificar explicitamente que não há senha e que o **mysqlslap** não deve solicitar uma senha, use a opção `--skip-password1`.

`--password1` e `--password` são sinônimos, assim como `--skip-password1` e `--skip-password`.

* `--password2[=pass_val]`

A senha para o fator de autenticação multifatorial 2 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica para `--password1`; consulte a descrição dessa opção para obter detalhes.

* `--password3[=pass_val]`

A senha para o fator de autenticação multifatorial 3 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica para `--password1`; consulte a descrição dessa opção para detalhes.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>0

Em Windows, conecte-se ao servidor usando um tubo nomeado. Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por tubo nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>1

O diretório onde procurar plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o **mysqlslap** não o encontrar. Veja a Seção 8.2.17, “Autenticação Conectada”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>2

Para conexões TCP/IP, o número de porta a ser utilizado.

* `--post-query=value`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>3

O arquivo ou a cadeia que contém a declaração a ser executada após a conclusão dos testes. Essa execução não é contada para fins de cronometragem.

* `--post-system=str`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>4

A cadeia a ser executada usando `system()` após a conclusão dos testes. Essa execução não é contada para fins de cronometragem.

* `--pre-query=value`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>5

O arquivo ou a cadeia de caracteres que contém a declaração a ser executada antes de executar os testes. Essa execução não é contada para fins de cronometragem.

* `--pre-system=str`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>6

A cadeia de caracteres a ser executada usando `system()` antes de executar os testes. Essa execução não é contada para fins de cronometragem.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>7

Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>8

O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de outro protocolo que não o desejado. Para obter detalhes sobre os valores permitidos, consulte a Seção 6.2.7, “Protocolos de Transporte de Conexão”.

* `--query=value`, `-q value`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>9

O arquivo ou a cadeia de caracteres que contém a declaração `SELECT` a ser usada para recuperar dados.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>0

O nome do caminho de um arquivo em formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senha com base em par de chave RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

Para `sha256_password`, esta opção só se aplica se o MySQL foi construído usando OpenSSL.

Para informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 8.4.1.3, “Autenticação substituível SHA-256”, e a Seção 8.4.1.2, “Cache de autenticação substituível SHA-2”.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>1

Em Windows, o nome de memória compartilhada a ser usado para conexões feitas usando memória compartilhada a um servidor local. O valor padrão é `MYSQL`. O nome de memória compartilhada é sensível a maiúsculas e minúsculas.

Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

* `--silent`, `-s`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>2

Modo silencioso. Sem saída.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>3

Para conexões a `localhost`, o arquivo de socket Unix a ser usado, ou, no Windows, o nome do tubo nomeado a ser usado.

Em Windows, esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de canal nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--sql-mode=mode`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>4

Defina o modo SQL para a sessão do cliente.

* `--ssl*`

As opções que começam com `--ssl` especificam se deve conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Consulte Opções de comando para conexões criptografadas.

* `--ssl-fips-mode={OFF|ON|STRICT}`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>5

Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere de outras opções `--ssl-xxx` porque não é usada para estabelecer conexões criptografadas, mas sim para determinar quais operações criptográficas devem ser permitidas. Veja a Seção 8.8, “Suporte FIPS”.

Esses valores `--ssl-fips-mode` são permitidos:

+ `OFF`: Desabilitar o modo FIPS.  
  + `ON`: Habilitar o modo FIPS.  
  + `STRICT`: Habilitar o modo FIPS "strict".

Nota

Se o Módulo de Objeto FIPS OpenSSL não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Neste caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente produza um aviso na inicialização e opere no modo não FIPS.

A partir do MySQL 8.0.34, essa opção é desatualizada. A espera é que ela seja removida em uma versão futura do MySQL.

* `--tls-ciphersuites=ciphersuite_list`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>6

As sequências de cifra permitidas para conexões criptografadas que utilizam TLSv1.3. O valor é uma lista de um ou mais nomes de sequência de cifra separados por vírgula. As sequências de cifra que podem ser nomeadas para esta opção dependem da biblioteca SSL utilizada para compilar o MySQL. Para obter detalhes, consulte a Seção 8.3.2, “Protocolos e cifras de conexão criptografada TLS”.

Essa opção foi adicionada no MySQL 8.0.16.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>7

Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolo separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, “Protocolos e cifras TLS de conexão criptografada”.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>8

O nome de usuário da conta MySQL a ser usado para se conectar ao servidor.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>9

Modo detalhado. Imprima mais informações sobre o que o programa faz. Essa opção pode ser usada várias vezes para aumentar a quantidade de informações.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-load-type"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-load-type=type</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>mixed</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>read</code></p><p class="valid-value"><code>write</code></p><p class="valid-value"><code>key</code></p><p class="valid-value"><code>update</code></p><p class="valid-value"><code>mixed</code></p></td> </tr></tbody></table>0

Exibir informações da versão e sair.

* `--zstd-compression-level=level`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-load-type"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-load-type=type</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>mixed</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>read</code></p><p class="valid-value"><code>write</code></p><p class="valid-value"><code>key</code></p><p class="valid-value"><code>update</code></p><p class="valid-value"><code>mixed</code></p></td> </tr></tbody></table>1

O nível de compressão a ser usado para conexões ao servidor que utilizam o algoritmo de compressão `zstd`. Os níveis permitidos são de 1 a 22, com valores maiores indicando níveis crescentes de compressão. O nível de compressão padrão `zstd` é 3. O ajuste do nível de compressão não afeta as conexões que não utilizam compressão `zstd`.

Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

Essa opção foi adicionada no MySQL 8.0.18.