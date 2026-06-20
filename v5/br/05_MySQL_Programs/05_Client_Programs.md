## 4.5 Programas para clientes

Esta seção descreve os programas de cliente que se conectam ao servidor MySQL.

### 4.5.1 mysql — O cliente de string de comando MySQL

**mysql** é um shell SQL simples com capacidade de edição de string de entrada. Ele suporta uso interativo e não interativo. Quando usado interativamente, os resultados das consultas são apresentados em um formato de tabela ASCII. Quando usado não interativamente (por exemplo, como um filtro), o resultado é apresentado em formato de separação por tabulação. O formato de saída pode ser alterado usando opções de comando.

Se você tiver problemas devido à memória insuficiente para conjuntos de resultados grandes, use a opção `--quick`. Isso obriga o **mysql** a recuperar os resultados do servidor uma string de cada vez, em vez de recuperar todo o conjunto de resultados e bufferá-lo na memória antes de exibí-lo. Isso é feito retornando o conjunto de resultados usando a função C API `mysql_use_result()` no cliente/biblioteca do servidor, em vez de `mysql_store_result()`.

Nota

Como alternativa, o MySQL Shell oferece acesso à X DevAPI. Para obter detalhes, consulte o MySQL Shell 8.0.

Usar o **mysql** é muito fácil. Invoque-o a partir do prompt do seu interpretador de comandos da seguinte forma:

```sql
mysql db_name
```

Ou:

```sql
mysql --user=user_name --password db_name
```

Neste caso, você precisará inserir sua senha em resposta ao prompt que o **mysql** exibe:

```sql
Enter password: your_password
```

Em seguida, digite uma declaração SQL, termine-a com `;`, `\g` ou `\G` e pressione Enter.

Teclar **Control+C** interrompe a declaração atual, se houver uma, ou, caso contrário, anula qualquer string de entrada parcial.

Você pode executar instruções SQL em um arquivo de script (arquivo de lote) da seguinte forma:

```sql
mysql db_name < script.sql > output.tab
```

No Unix, o cliente **mysql** registra as declarações executadas interativamente em um arquivo de histórico. Veja a Seção 4.5.1.3, “Registro do cliente mysql”.

#### 4.5.1.1 Opções do cliente do MySQL

O **mysql** suporta as seguintes opções, que podem ser especificadas na string de comando ou nos grupos `[mysql]` e `[client]` de um arquivo de opções. Para informações sobre arquivos de opções usados por programas do MySQL, consulte a Seção 4.2.2.2, “Usando arquivos de opções”.

**Tabela 4.13 Opções do cliente do MySQL**

<table frame="box" rules="all" summary="Command-line options available for the mysql client.">
<col style="width: 27%"/>
<col style="width: 50%"/>
<col style="width: 11%"/>
<col style="width: 11%"/>
<thead>
<tr>
<th>Option Name</th>
<th>Description</th>
<th>Introduced</th>
<th>Deprecated</th>
</tr>
</thead>
<tbody>
<tr>
<th><code>--auto-rehash</code></th>
<td>Enable automatic rehashing</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--auto-vertical-output</code></th>
<td>Ative a exibição automática do conjunto de resultados vertical</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--batch</code></th>
<td>Não use o arquivo de histórico</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--binary-as-hex</code></th>
<td>Exibir valores binários em notação hexadecimal</td>
<td>5.7.19</td>
<td></td>
</tr>
<tr>
<th><code>--binary-mode</code></th>
<td>Disable \r\n - to - \n translation and treatment of \0 as end-of-query</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--bind-address</code></th>
<td>Use a interface de rede especificada para se conectar ao servidor MySQL</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--character-sets-dir</code></th>
<td>Diretório onde os conjuntos de caracteres são instalados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--column-names</code></th>
<td>Escreva os nomes das colunas nos resultados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--column-type-info</code></th>
<td>Exibir metadados do conjunto de resultados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--commands</code></th>
<td>Habilitar ou desabilitar o processamento de comandos do cliente local do MySQL</td>
<td>5.7.44-ndb-7.6.35</td>
<td></td>
</tr>
<tr>
<th><code>--comments</code></th>
<td>Se deve manter ou remover comentários em declarações enviadas ao servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--compress</code></th>
<td>Compressar todas as informações enviadas entre o cliente e o servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--connect-expired-password</code></th>
<td>Indique ao servidor que o cliente pode lidar com o modo sandbox de senha expirada</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--connect-timeout</code></th>
<td>Número de segundos antes do tempo limite de conexão</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--database</code></th>
<td>O banco de dados a ser utilizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug</code></th>
<td>Escreva o log de depuração; é suportado apenas se o MySQL foi construído com suporte de depuração</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug-check</code></th>
<td>Imprimir informações de depuração quando o programa sai</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug-info</code></th>
<td>Imprimir informações de depuração, memória e estatísticas de CPU quando o programa sai</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--default-auth</code></th>
<td>Plugin de autenticação a ser utilizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--default-character-set</code></th>
<td>Especificar o conjunto de caracteres padrão</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-extra-file</code></th>
<td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-file</code></th>
<td>Arquivo de opção de leitura apenas nomeado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-group-suffix</code></th>
<td>Valor do sufixo do grupo de opções</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--delimiter</code></th>
<td>Defina o delimitador de declaração</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--enable-cleartext-plugin</code></th>
<td>Habilitar o plugin de autenticação de texto claro</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--execute</code></th>
<td>Execute a declaração e saia</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--force</code></th>
<td>Continue mesmo que ocorra um erro SQL</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--get-server-public-key</code></th>
<td>Solicitar chave pública RSA do servidor</td>
<td>5.7.23</td>
<td></td>
</tr>
<tr>
<th><code>--help</code></th>
<td>Exibir mensagem de ajuda e sair</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--histignore</code></th>
<td>Padrões que especificam quais declarações devem ser ignoradas para o registro</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--host</code></th>
<td>Anfitrião no qual o servidor MySQL está localizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--html</code></th>
<td>Produce HTML output</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ignore-spaces</code></th>
<td>Ignore espaços após os nomes das funções</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--init-command</code></th>
<td>Instrução SQL para executar após a conexão</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--line-numbers</code></th>
<td>Escreva números de string para erros</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--local-infile</code></th>
<td>Ative ou desative a capacidade LOCAL para LOAD DATA</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--login-path</code></th>
<td>Leia as opções de caminho de login a partir de .mylogin.cnf</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--max-allowed-packet</code></th>
<td>Comprimento máximo do pacote para enviar ou receber do servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--max-join-size</code></th>
<td>O limite automático para as strings em uma junção ao usar --safe-updates</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--named-commands</code></th>
<td>Habilitar comandos mysql nomeados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--net-buffer-length</code></th>
<td>Buffer size for TCP/IP and socket communication</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--no-auto-rehash</code></th>
<td>Disable automatic rehashing</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--no-beep</code></th>
<td>Não emita um sinal sonoro quando ocorrerem erros</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--no-defaults</code></th>
<td>Não leia arquivos de opção</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--one-database</code></th>
<td>Ignorar declarações, exceto as para o banco de dados padrão nomeado na string de comando</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--pager</code></th>
<td>Use o comando fornecido para a saída da consulta de paginação</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--password</code></th>
<td>Senha para usar ao se conectar ao servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--pipe</code></th>
<td>Conecte-se ao servidor usando um pipe nomeado (apenas Windows)</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--plugin-dir</code></th>
<td>Diretório onde os plugins são instalados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--port</code></th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--print-defaults</code></th>
<td>Print default options</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--prompt</code></th>
<td>Defina o prompt no formato especificado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--protocol</code></th>
<td>Protocolo de transporte a ser utilizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--quick</code></th>
<td>Não cache cada resultado da consulta</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--raw</code></th>
<td>Escreva os valores da coluna sem conversão de escape</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--reconnect</code></th>
<td>Se a conexão com o servidor for perdida, tente reconectar automaticamente</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--safe-updates, --i-am-a-dummy</code></th>
<td>Permitir apenas declarações de UPDATE e DELETE que especifiquem valores de chave</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--secure-auth</code></th>
<td>Não envie senhas para o servidor no formato antigo (pré-4.1)</td>
<td></td>
<td>Sim</td>
</tr>
<tr>
<th><code>--select-limit</code></th>
<td>O limite automático para as declarações SELECT ao usar --safe-updates</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--server-public-key-path</code></th>
<td>Nome do caminho para o arquivo que contém a chave pública RSA</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--shared-memory-base-name</code></th>
<td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--show-warnings</code></th>
<td>Mostre avisos após cada declaração, se houver alguma</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--sigint-ignore</code></th>
<td>Ignorar sinais SIGINT (tipicamente o resultado de digitar Control+C)</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--silent</code></th>
<td>Silent mode</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--skip-auto-rehash</code></th>
<td>Disable automatic rehashing</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--skip-column-names</code></th>
<td>Não escreva nomes de colunas nos resultados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--skip-line-numbers</code></th>
<td>Pular números de string para erros</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--skip-named-commands</code></th>
<td>Desative comandos do MySQL nomeados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--skip-pager</code></th>
<td>Disable paging</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--skip-reconnect</code></th>
<td>Disable reconnecting</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--socket</code></th>
<td>Arquivo de socket Unix ou pipe nomeado do Windows a ser usado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl</code></th>
<td>Enable connection encryption</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-ca</code></th>
<td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-capath</code></th>
<td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-cert</code></th>
<td>Arquivo que contém o certificado X.509</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-cipher</code></th>
<td>Cifras permitidas para criptografia de conexão</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-crl</code></th>
<td>Arquivo que contém listas de revogação de certificados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-crlpath</code></th>
<td>Diretório que contém arquivos de lista de revogação de certificados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-key</code></th>
<td>Arquivo que contém a chave X.509</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-mode</code></th>
<td>Estado de segurança desejado da conexão com o servidor</td>
<td>5.7.11</td>
<td></td>
</tr>
<tr>
<th><code>--ssl-verify-server-cert</code></th>
<td>Verifique o nome do host contra a identidade do Nome comum do certificado do servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--syslog</code></th>
<td>Registre declarações interativas no syslog</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--table</code></th>
<td>Exibir a saída em formato tabular</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--tee</code></th>
<td>Adicione uma cópia do resultado a um arquivo nomeado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--tls-version</code></th>
<td>Protocolos TLS permitidos para conexões criptografadas</td>
<td>5.7.10</td>
<td></td>
</tr>
<tr>
<th><code>--unbuffered</code></th>
<td>Esvazie o buffer após cada consulta</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--user</code></th>
<td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--verbose</code></th>
<td>Verbose mode</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--version</code></th>
<td>Exibir informações da versão e sair</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--vertical</code></th>
<td>Imprimir strings de saída de consulta verticalmente (uma string por valor de coluna)</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--wait</code></th>
<td>Se a conexão não puder ser estabelecida, espere e tente novamente em vez de abortar</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--xml</code></th>
<td>Produce XML output</td>
<td></td>
<td></td>
</tr>
</tbody>
</table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Exibir uma mensagem de ajuda e sair.

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

Imprima os resultados usando a tecla tab como separador de coluna, com cada string em uma nova string. Com esta opção, o **mysql** não usa o arquivo de histórico.

O modo de lote resulta em saída não tabular e escapamento de caracteres especiais. O escapamento pode ser desativado usando o modo bruto; consulte a descrição da opção `--raw`.

* `--binary-as-hex`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

Quando esta opção é dada, o **mysql** exibe dados binários usando notação hexadecimal (`0xvalue`). Isso ocorre independentemente do formato geral de exibição de saída ser tabular, vertical, HTML ou XML.

`--binary-as-hex` quando ativado afeta a exibição de todas as cadeias binárias, incluindo aquelas retornadas por funções como `CHAR()` e `UNHEX()`. O exemplo a seguir demonstra isso usando o código ASCII para `A` (65 decimal, 41 hexadecimal):

+ `--binary-as-hex` desativado:

    ```sql
    mysql> SELECT CHAR(0x41), UNHEX('41');
    +------------+-------------+
    | CHAR(0x41) | UNHEX('41') |
    +------------+-------------+
    | A          | A           |
    +------------+-------------+
    ```

+ `--binary-as-hex` ativado:

    ```sql
    mysql> SELECT CHAR(0x41), UNHEX('41');
    +------------------------+--------------------------+
    | CHAR(0x41)             | UNHEX('41')              |
    +------------------------+--------------------------+
    | 0x41                   | 0x41                     |
    +------------------------+--------------------------+
    ```

Para escrever uma expressão de cadeia binária de modo que ela seja exibida como uma cadeia de caracteres, independentemente de `--binary-as-hex` estar habilitado, use essas técnicas:

+ A função `CHAR()` possui uma cláusula `USING charset`:

    ```sql
    mysql> SELECT CHAR(0x41 USING utf8mb4);
    +--------------------------+
    | CHAR(0x41 USING utf8mb4) |
    +--------------------------+
    | A                        |
    +--------------------------+
    ```

+ De forma mais geral, use `CONVERT()` para converter uma expressão em um conjunto de caracteres específico:

    ```sql
    mysql> SELECT CONVERT(UNHEX('41') USING utf8mb4);
    +------------------------------------+
    | CONVERT(UNHEX('41') USING utf8mb4) |
    +------------------------------------+
    | A                                  |
    +------------------------------------+
    ```

Essa opção foi adicionada no MySQL 5.7.19.

* `--binary-mode`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-mode</code></td> </tr></tbody></table>

Esta opção ajuda ao processar a saída do **mysqlbinlog** que pode conter valores `BLOB`. Por padrão, o **mysql** traduz `\r\n` em strings de declaração para `\n` e interpreta `\0` como o terminador da declaração. `--binary-mode` desativa ambos os recursos. Também desativa todos os comandos do **mysql**, exceto `charset` e `delimiter` no modo não interativo (para entrada canalizada para o **mysql** ou carregada usando o comando `source`).

(*NBD Cluster 7.6.35 e versões posteriores: `--binary-mode`, quando habilitado, faz com que o servidor ignore qualquer configuração para `--commands`.

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

Em um computador com várias interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao servidor MySQL.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

O diretório onde os conjuntos de caracteres são instalados. Veja a Seção 10.15, “Configuração de Conjunto de Caracteres”.

* `--column-names`

  <table frame="box" rules="all" summary="Properties for column-names"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--column-names</code></td> </tr></tbody></table>

Escreva os nomes das colunas nos resultados.

* `--column-type-info`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>0

Exibir metadados do conjunto de resultados. Essas informações correspondem ao conteúdo das estruturas de dados C API `MYSQL_FIELD`. Veja Estruturas de dados básicas da API C.

* `--commands`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>1

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
- `\u` (`use` é passada para o servidor)

- `warnings`
  + Os comandos `\C` e `delimiter` permanecem ativados.

+ A opção `--system-command` é ignorada e não tem efeito.

Esta opção não tem efeito quando o `--binary-mode` está habilitado.

Quando o `--commands` está habilitado, é possível desabilitar (apenas) o comando do sistema usando a opção `--system-command`.

Essa opção foi adicionada no NDB Cluster 7.6.35.

* `--comments`, `-c`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>2

Se deve remover ou preservar comentários em declarações enviadas ao servidor. O padrão é `--skip-comments` (remover comentários), habilite com `--comments` (preservar comentários).

Nota

No MySQL 5.7, o cliente **mysql** sempre passa dicas de otimizador para o servidor, independentemente de esta opção ser dada. Para garantir que as dicas de otimizador não sejam removidas se você estiver usando uma versão mais antiga do cliente **mysql** com uma versão do servidor que entende dicas de otimizador, invoque **mysql** com a opção `--comments`.

O comentário de remoção é desaconselhável a partir do MySQL 5.7.20. Você deve esperar que esse recurso e as opções para controlá-lo sejam removidos em um lançamento futuro do MySQL.

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>3

Compressa todas as informações enviadas entre o cliente e o servidor, se possível. Veja a Seção 4.2.6, “Controle de Compressão de Conexão”.

* `--connect-expired-password`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>4

Indique ao servidor que o cliente pode lidar com o modo sandbox se a conta usada para se conectar tiver uma senha expirada. Isso pode ser útil para invocções não interativas do **mysql**, pois normalmente o servidor desconecta clientes não interativos que tentam se conectar usando uma conta com uma senha expirada. (Veja a Seção 6.2.12, “Tratamento do servidor de senhas expiradas”.)

* `--connect-timeout=value`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>5

O número de segundos antes do tempo limite de conexão. (O valor padrão é `0`.)

* `--database=db_name`, `-D db_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>6

O banco de dados a ser usado. Isso é útil principalmente em um arquivo de opção.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>7

Escreva um registro de depuração. Uma string típica *`debug_options`* é `d:t:o,file_name`. O padrão é `d:t:o,/tmp/mysql.trace`.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--debug-check`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>8

Imprima algumas informações de depuração quando o programa sair.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--debug-info`, `-T`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>9

Imprimir informações de depuração e estatísticas de uso de memória e CPU quando o programa sai.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>0

Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Veja a Seção 6.2.13, “Autenticação substituível”.

* `--default-character-set=charset_name`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>1

Use *`charset_name`* como o conjunto de caracteres padrão para o cliente e a conexão.

Essa opção pode ser útil se o sistema operacional usar um conjunto de caracteres e o cliente **mysql** por padrão usar outro. Nesse caso, a saída pode ser formatada incorretamente. Geralmente, você pode corrigir esses problemas usando essa opção para forçar o cliente a usar o conjunto de caracteres do sistema em vez disso.

Para mais informações, consulte a Seção 10.4, “Conjunto de caracteres de conexão e codificações”, e a Seção 10.15, “Configuração do conjunto de caracteres”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>2

Leia este arquivo de opção após o arquivo de opção global, mas (em Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>3

Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Exceção: Mesmo com `--defaults-file`, os programas de cliente leem `.mylogin.cnf`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>4

Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, **mysql** normalmente lê os grupos `[client]` e `[mysql]`. Se esta opção for dada como `--defaults-group-suffix=_other`, **mysql** também lê os grupos `[client_other]` e `[mysql_other]`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--delimiter=str`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>5

Defina o delimitador de declaração. O padrão é o caractere ponto e vírgula (`;`).

* `--disable-named-commands`

Desative comandos nomeados. Use apenas o formulário `\*` ou use comandos nomeados apenas no início de uma string que termina com um ponto e vírgula (`;`). O *mysql* começa com esta opção *ativada* por padrão. No entanto, mesmo com esta opção, os comandos de formato longo ainda funcionam a partir da primeira string. Veja a Seção 4.5.1.2, “Comandos do cliente do mysql”.

* `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>6

Ative o plugin de autenticação de texto claro `mysql_clear_password`. (Veja a Seção 6.4.1.6, “Autenticação de Texto Claro Plugável do Lado do Cliente”).

* `--execute=statement`, `-e statement`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>7

Execute a declaração e saia. O formato de saída padrão é como o produzido com `--batch`. Veja a Seção 4.2.2.1, “Usando opções na string de comando”, para alguns exemplos. Com esta opção, o **mysql** não usa o arquivo de histórico.

* `--force`, `-f`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>8

Continue mesmo se ocorrer um erro SQL.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>9

Peça ao servidor a chave pública necessária para a troca de senha baseada em par de chaves RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

Para informações sobre o plugin `caching_sha2_password`, consulte a Seção 6.4.1.4, “Cacheamento de Autenticação Alterável SHA-2”.

A opção `--get-server-public-key` foi adicionada no MySQL 5.7.23.

* `--histignore`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>0

Uma lista com um ou mais padrões separados por vírgula que especificam as declarações a serem ignoradas para fins de registro. Esses padrões são adicionados à lista de padrões padrão (`"*IDENTIFIED*:*PASSWORD*"`). O valor especificado para esta opção afeta o registro de declarações escritas no arquivo de histórico e para `syslog` se a opção `--syslog` for fornecida. Para mais informações, consulte a Seção 4.5.1.3, “Registro do cliente do MySQL”.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>1

Conecte-se ao servidor MySQL no host fornecido.

* `--html`, `-H`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>2

Produza a saída HTML.

* `--ignore-spaces`, `-i`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>3

Ignore espaços após os nomes das funções. O efeito disso é descrito na discussão para o modo `IGNORE_SPACE` SQL (consulte Seção 5.1.10, “Modos SQL do servidor”).

* `--init-command=str`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>4

Instrução SQL para executar após a conexão com o servidor. Se o auto-reconexão estiver habilitada, a instrução é executada novamente após a reconexão ocorrer.

* `--line-numbers`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>5

Escreva números de string para erros. Desative isso com `--skip-line-numbers`.

* `--local-infile[={0|1}]`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>6

Por padrão, a capacidade `LOCAL` para `LOAD DATA` é determinada pelo padrão compilado na biblioteca do cliente MySQL. Para habilitar ou desabilitar explicitamente o carregamento de dados `LOCAL`, use a opção `--local-infile`. Quando não é fornecida nenhuma valor, a opção habilita o carregamento de dados `LOCAL`. Quando fornecida como `--local-infile=0` ou `--local-infile=1`, a opção desabilita ou habilita o carregamento de dados [[`LOCAL`].

O uso bem-sucedido de operações de carregamento `LOCAL` dentro do **mysql** também exige que o servidor permita o carregamento local; veja a Seção 6.1.6, “Considerações de segurança para CARREGAR DADOS LOCAL”

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>7

Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam para qual servidor MySQL se conectar e qual conta se autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql\_config\_editor**. Veja a Seção 4.6.6, “mysql\_config\_editor — Utilitário de Configuração MySQL”.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--max-allowed-packet=value`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>8

O tamanho máximo do buffer para comunicação cliente/servidor. O padrão é 16 MB, o máximo é 1 GB.

* `--max-join-size=value`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>9

O limite automático para strings em uma junção ao usar `--safe-updates`. (O valor padrão é 1.000.000.)

* `--named-commands`, `-G`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--batch</code></td> </tr></tbody></table>0

Ative comandos com nome **mysql**. Os comandos de formato longo são permitidos, não apenas comandos de formato curto. Por exemplo, `quit` e `\q` são reconhecidos. Use `--skip-named-commands` para desabilitar comandos com nome. Veja a Seção 4.5.1.2, “Comandos do cliente mysql”.

* `--net-buffer-length=value`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--batch</code></td> </tr></tbody></table>1

O tamanho do buffer para comunicação TCP/IP e socket. (O valor padrão é 16 KB.)

* `--no-auto-rehash`, `-A`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--batch</code></td> </tr></tbody></table>2

Isso tem o mesmo efeito que `--skip-auto-rehash`. Veja a descrição para `--auto-rehash`.

* `--no-beep`, `-b`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--batch</code></td> </tr></tbody></table>3

Não emita um sinal sonoro quando ocorrerem erros.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--batch</code></td> </tr></tbody></table>4

Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para evitar que elas sejam lidas.

A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na string de comando, mesmo quando o `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql\_config\_editor**. Veja a Seção 4.6.6, “mysql\_config\_editor — Ferramenta de Configuração do MySQL”.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--one-database`, `-o`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--batch</code></td> </tr></tbody></table>5

Ignore as declarações, exceto aquelas que ocorrem enquanto o banco de dados padrão é o nomeado na string de comando. Esta opção é rudimentar e deve ser usada com cuidado. O filtro de declaração é baseado apenas em declarações `USE`.

Inicialmente, o **mysql** executa as instruções na entrada porque especificar um banco de dados *`db_name`* na string de comando é equivalente a inserir `USE db_name` no início da entrada. Em seguida, para cada declaração `USE` encontrada, o **mysql** aceita ou rejeita as seguintes declarações, dependendo se o nome do banco de dados especificado é o mesmo da string de comando. O conteúdo das declarações é irrelevante.

Suponha que **mysql** seja invocado para processar este conjunto de declarações:

  ```sql
  DELETE FROM db2.t2;
  USE db2;
  DROP TABLE db1.t1;
  CREATE TABLE db1.t1 (i INT);
  USE db1;
  INSERT INTO t1 (i) VALUES(1);
  CREATE TABLE db2.t1 (j INT);
  ```

Se a string de comando for **mysql --force --one-database db1**, o **mysql** lida com a entrada da seguinte forma:

+ A declaração `DELETE` é executada porque o banco de dados padrão é `db1`, embora a declaração nomeie uma tabela em um banco de dados diferente.

+ As declarações `DROP TABLE` e `CREATE TABLE` não são executadas porque o banco de dados padrão não é `db1`, embora as declarações nomeiem uma tabela em `db1`.

As declarações `INSERT` e `CREATE TABLE` são executadas porque o banco de dados padrão é `db1`, embora a declaração `CREATE TABLE` nomeie uma tabela em um banco de dados diferente.

* `--pager[=command]`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--batch</code></td> </tr></tbody></table>6

Use o comando fornecido para a saída da consulta de paginação. Se o comando for omitido, o gerenciador padrão é o valor da variável de ambiente `PAGER`. Os gerenciadores válidos são **less**, **more**, **cat [> filename]**, e assim por diante. Esta opção só funciona em Unix e apenas no modo interativo. Para desabilitar a paginação, use `--skip-pager`. A Seção 4.5.1.2, “Comandos do cliente do MySQL”, discute a paginação de saída mais a fundo.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--batch</code></td> </tr></tbody></table>7

A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysql** solicitará uma senha. Se for fornecida, não deve haver *espaço* entre `--password=` ou `-p` e a senha que a segue. Se não for especificado nenhum tipo de senha, o padrão é não enviar senha.

Especificar uma senha na string de comando deve ser considerado inseguro. Para evitar fornecer a senha na string de comando, use um arquivo de opção. Consulte a Seção 6.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

Para especificar explicitamente que não há senha e que o **mysql** não deve solicitar uma senha, use a opção `--skip-password`.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--batch</code></td> </tr></tbody></table>8

Em Windows, conecte-se ao servidor usando um pipe nomeado. Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por pipe nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--batch</code></td> </tr></tbody></table>9

O diretório onde procurar plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o **mysql** não o encontrar. Veja a Seção 6.2.13, “Autenticação Conectada”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>0

Para conexões TCP/IP, o número de porta a ser utilizado.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>1

Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--prompt=format_str`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>2

Defina o prompt no formato especificado. O padrão é `mysql>`. As sequências especiais que o prompt pode conter são descritas na Seção 4.5.1.2, "Comandos do cliente do MySQL".

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>3

O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de outro protocolo que não o desejado. Para obter detalhes sobre os valores permitidos, consulte a Seção 4.2.5, “Protocolos de Transporte de Conexão”.

* `--quick`, `-q`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>4

Não cache cada resultado da consulta, imprima cada string conforme ela é recebida. Isso pode tornar o servidor mais lento se o resultado for suspenso. Com esta opção, o **mysql** não usa o arquivo de histórico.

Por padrão, o **mysql** recupera todas as strings de resultado antes de produzir qualquer saída; ao armazená-las, calcula um comprimento máximo de coluna em execução a partir do valor real de cada coluna em sucessão. Ao imprimir a saída, ele usa esse máximo para formatá-la. Quando `--quick` é especificado, o **mysql** não tem as strings para as quais calcular o comprimento antes de começar, e, portanto, usa o comprimento máximo. No exemplo a seguir, a tabela `t1` tem uma única coluna do tipo `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") e contendo 4 strings. A saída padrão tem 9 caracteres de largura; essa largura é igual ao número máximo de caracteres em qualquer um dos valores das colunas nas strings retornadas (5), mais 2 caracteres cada para os espaços usados como preenchimento e os caracteres `|` usados como delimitadores de coluna). A saída ao usar a opção `--quick` tem 25 caracteres de largura; essa é igual ao número de caracteres necessários para representar `-9223372036854775808`, que é o valor mais longo possível que pode ser armazenado em uma coluna (assinada) `BIGINT`, ou 19 caracteres, mais os 4 caracteres usados para preenchimento e delimitadores de coluna. A diferença pode ser vista aqui:

  ```sql
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

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>5

Para a saída tabular, o "boxeamento" ao redor das colunas permite que um valor de coluna seja distinguido de outro. Para a saída não tabular (como a produzida em modo de lote ou quando a opção `--batch` ou `--silent` é dada), caracteres especiais são escamados na saída para que possam ser identificados facilmente. Novo string, tab, `NUL` e barra invertida são escritos como `\n`, `\t`, `\0` e `\\`. A opção `--raw` desabilita este escapagem de caracteres.

O exemplo a seguir demonstra a saída tabular versus não tabular e o uso do modo bruto para desabilitar a fuga de caracteres:

  ```sql
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

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>6

Se a conexão com o servidor for perdida, tente reconectar automaticamente. Uma única tentativa de reconexão é feita a cada vez que a conexão é perdida. Para suprimir o comportamento de reconexão, use `--skip-reconnect`.

* `--safe-updates`, `--i-am-a-dummy`, `-U`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>7

Se esta opção estiver habilitada, as declarações `UPDATE` e `DELETE` que não utilizam uma chave na cláusula `WHERE` ou na cláusula `LIMIT` produzem um erro. Além disso, restrições são colocadas nas declarações `SELECT` que produzem (ou são estimadas para produzir) conjuntos de resultados muito grandes. Se você definiu esta opção em um arquivo de opções, pode usar `--skip-safe-updates` na string de comando para sobrescrevê-la. Para obter mais informações sobre esta opção, consulte "Usando o modo de atualizações seguras (--safe-updates)".

* `--secure-auth`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>8

Não envie senhas para o servidor no formato antigo (pré-4.1). Isso impede conexões, exceto para servidores que usam o formato de senha mais recente.

A partir do MySQL 5.7.5, essa opção é desatualizada; espere que ela seja removida em um lançamento futuro do MySQL. Ela sempre está habilitada e tentar desabilitá-la (`--skip-secure-auth`, `--secure-auth=0`) produz um erro. Antes do MySQL 5.7.5, essa opção está habilitada por padrão, mas pode ser desabilitada.

Nota

As senhas que utilizam o método de hashing pré-4.1 são menos seguras do que as senhas que utilizam o método nativo de hashing de senha e devem ser evitadas. As senhas pré-4.1 são desaconselhadas e o suporte para elas foi removido no MySQL 5.7.5. Para instruções de atualização de conta, consulte a Seção 6.4.1.3, “Migrando para fora do hashing de senha pré-4.1 e do plugin mysql\_old\_password”.

* `--select-limit=value`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>9

O limite automático para as declarações `SELECT` ao usar `--safe-updates`. (O valor padrão é 1.000.)

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-mode</code></td> </tr></tbody></table>0

O nome do caminho de um arquivo em formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senha baseada em par de chaves RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

Para `sha256_password`, esta opção só se aplica se o MySQL foi construído usando OpenSSL.

Para informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 6.4.1.5, “Autenticação substituível SHA-256”, e a Seção 6.4.1.4, “Cache de autenticação substituível SHA-2”.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-mode</code></td> </tr></tbody></table>1

Em Windows, o nome de memória compartilhada a ser usado para conexões feitas usando memória compartilhada a um servidor local. O valor padrão é `MYSQL`. O nome de memória compartilhada é sensível a maiúsculas e minúsculas.

Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

* `--show-warnings`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-mode</code></td> </tr></tbody></table>2

Se houver alguma advertência, ela deve ser exibida após cada declaração. Esta opção se aplica ao modo interativo e ao modo em lote.

* `--sigint-ignore`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-mode</code></td> </tr></tbody></table>3

Ignore os sinais `SIGINT` (normalmente o resultado de digitar **Control+C**).

Sem essa opção, ao digitar **Control+C**, o texto atual é interrompido, se houver um, ou qualquer string de entrada parcial é cancelada, caso contrário.

* `--silent`, `-s`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-mode</code></td> </tr></tbody></table>4

Modo silencioso. Produzir menos saída. Esta opção pode ser dada várias vezes para produzir cada vez menos saída.

Essa opção resulta em um formato de saída não tabular e na fuga de caracteres especiais. A fuga pode ser desativada usando o modo bruto; consulte a descrição da opção `--raw`.

* `--skip-column-names`, `-N`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-mode</code></td> </tr></tbody></table>5

Não escreva nomes de colunas nos resultados. O uso desta opção faz com que a saída seja alinhada à direita, como mostrado aqui:

  ```sql
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

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-mode</code></td> </tr></tbody></table>6

Não escreva números de string para erros. Útil quando você deseja comparar arquivos de resultado que incluem mensagens de erro.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-mode</code></td> </tr></tbody></table>7

Para conexões a `localhost`, o arquivo de socket Unix a ser usado, ou, no Windows, o nome do pipe nomeado a ser usado.

Em Windows, esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de canal nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--ssl*`

As opções que começam com `--ssl` especificam se deve conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Consulte Opções de comando para conexões criptografadas.

* `--syslog`, `-j`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-mode</code></td> </tr></tbody></table>8

Essa opção faz com que o **mysql** envie declarações interativas para a facilidade de registro do sistema. Em Unix, isso é `syslog`; em Windows, é o Registro de Eventos do Windows. O destino onde as mensagens registradas aparecem é dependente do sistema. Em Linux, o destino é frequentemente o arquivo `/var/log/messages`.

Aqui está uma amostra de saída gerada no Linux usando `--syslog`. Essa saída é formatada para melhor legibilidade; cada mensagem registrada na verdade ocupa uma única string.

  ```sql
  Mar  7 12:39:25 myhost MysqlClient[20824]:
    SYSTEM_USER:'oscar', MYSQL_USER:'my_oscar', CONNECTION_ID:23,
    DB_SERVER:'127.0.0.1', DB:'--', QUERY:'USE test;'
  Mar  7 12:39:28 myhost MysqlClient[20824]:
    SYSTEM_USER:'oscar', MYSQL_USER:'my_oscar', CONNECTION_ID:23,
    DB_SERVER:'127.0.0.1', DB:'test', QUERY:'SHOW TABLES;'
  ```

Para mais informações, consulte a Seção 4.5.1.3, “Registro do cliente do MySQL”.

* `--table`, `-t`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-mode</code></td> </tr></tbody></table>9

Exibir a saída em formato de tabela. Esse é o padrão para uso interativo, mas pode ser usado para produzir saída em tabela em modo em lote.

* `--tee=file_name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>0

Adicione uma cópia do resultado ao arquivo fornecido. Esta opção funciona apenas no modo interativo. A Seção 4.5.1.2, “Comandos do cliente do MySQL”, discute mais sobre os arquivos tee.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>1

Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolo separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 6.3.2, “Protocolos e cifras TLS de conexão criptografada”.

Essa opção foi adicionada no MySQL 5.7.10.

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

Imprimir strings de saída de consulta verticalmente (uma string por valor de coluna). Sem essa opção, você pode especificar saída vertical para declarações individuais terminando-as com `\G`.

* `--wait`, `-w`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>7

Se a conexão não puder ser estabelecida, espere e tente novamente, em vez de abortar.

* `--xml`, `-X`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>8

Produza a saída XML.

  ```sql
  <field name="column_name">NULL</field>
  ```

A saída quando `--xml` é usada com **mysql** corresponde à do **mysqldump** `--xml`. Consulte a Seção 4.5.4, “mysqldump — Um programa de backup de banco de dados”, para obter detalhes.

A saída XML também utiliza um espaço de nome XML, conforme mostrado aqui:

  ```sql
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

#### 4.5.1.2 Comandos do cliente do MySQL

**mysql** envia cada instrução SQL que você emite para o servidor a ser executada. Há também um conjunto de comandos que **mysql** interpreta por si mesmo. Para obter uma lista desses comandos, digite `help` ou `\h` no prompt `mysql>`:

```sql
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

For server side help, type 'help contents'
```

Se o **mysql** for invocado com a opção `--binary-mode`, todos os comandos do **mysql** são desativados, exceto `charset` e `delimiter` no modo não interativo (para entrada canalizada para o **mysql** ou carregada usando o comando `source`).

Cada comando tem uma forma longa e uma forma curta. A forma longa não é sensível ao caso; a forma curta é. A forma longa pode ser seguida por um terminador opcional por ponto e vírgula, mas a forma curta não deve.

O uso de comandos de formato curto dentro de comentários `/* ... */` de várias strings não é suportado. Os comandos de formato curto funcionam dentro de comentários de versão `/*! ... */` de uma string, assim como os comentários de dicas de otimização `/*+ ... */`, que são armazenados em definições de objeto. Se houver preocupação de que os comentários de dicas de otimização possam ser armazenados em definições de objeto de modo que os arquivos de depuração, quando re carregados com `mysql`, resultem na execução desses comandos, invocando **mysql** com a opção `--binary-mode` ou usando um cliente de re carregamento diferente de **mysql**.

* `help [arg]`, `\h [arg]`, `\? [arg]`, `? [arg]`

Exibir uma mensagem de ajuda que lista os comandos **mysql** disponíveis.

Se você fornecer um argumento para o comando `help`, o **mysql** o usa como uma string de pesquisa para acessar a ajuda do lado do servidor a partir do conteúdo do Manual de Referência do MySQL. Para mais informações, consulte a Seção 4.5.1.4, “Ajuda do lado do cliente e do servidor do mysql”.

* `charset charset_name`, `\C charset_name`

Altere o conjunto de caracteres padrão e emita uma declaração `SET NAMES`. Isso permite que o conjunto de caracteres permaneça sincronizado no cliente e no servidor se o **mysql** for executado com o auto-reconexão habilitada (o que não é recomendado), porque o conjunto de caracteres especificado é usado para reconexões.

* `clear`, `\c`

Limpe a entrada atual. Use isso se você mudar de ideia sobre a execução da declaração que você está inserindo.

* `connect [db_name [host_name]]`, `\r [db_name [host_name]]`

Reconnecte-se ao servidor. Os argumentos opcionais para o nome do banco de dados e o nome do host podem ser fornecidos para especificar o banco de dados padrão ou o host onde o servidor está sendo executado. Se omitidos, os valores atuais são usados.

* `delimiter str`, `\d str`

Altere a string que o **mysql** interpreta como o separador entre as instruções SQL. O padrão é o caractere ponto e vírgula (`;`).

A string de delimitador pode ser especificada como um argumento não citado ou citado na string de comando do comando `delimiter`. A citação pode ser feita com caractere de aspas simples (`'`), dupla (`"`), ou barra invertida (`` ` ``) characters. To include a quote within a quoted string, either quote the string with a different quote character or escape the quote with a backslash (`\). Deve-se evitar o uso de barra invertida fora de strings citadas, pois é o caractere de escape para MySQL. Para um argumento não citado, o delimitador é lido até o primeiro espaço ou até o final da string. Para um argumento citado, o delimitador é lido até a citação correspondente na string.

**mysql** interpreta instâncias da cadeia de delimitador como um delimitador de declaração em qualquer lugar que ocorra, exceto dentro de strings citadas. Tenha cuidado ao definir um delimitador que possa ocorrer dentro de outras palavras. Por exemplo, se você definir o delimitador como `X`, não é possível usar a palavra `INDEX` em declarações. **mysql** interpreta isso como `INDE` seguido pelo delimitador `X`.

Quando o delimitador reconhecido pelo **mysql** é definido como algo diferente do padrão de `;`, as instâncias desse caractere são enviadas ao servidor sem interpretação. No entanto, o próprio servidor ainda interpreta `;` como um delimitador de declaração e processa as declarações conforme necessário. Esse comportamento no lado do servidor é importante para a execução de múltiplas declarações (consulte Suporte à Execução de Múltiplas Declarações) e para a análise do corpo de procedimentos e funções armazenadas, gatilhos e eventos (consulte Seção 23.1, “Definindo Programas Armazenados”).

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

A exibição de páginas de saída pode ser habilitada interativamente com o comando `pager` e desabilitada com `nopager`. O comando aceita um argumento opcional; se fornecido, o programa de exibição é definido para isso. Sem argumento, o pager é definido para o pager que foi definido na string de comando, ou `stdout` se nenhum pager foi especificado.

A exibição de resultados de consulta funciona apenas no Unix porque usa a função `popen()`, que não existe no Windows. Para o Windows, a opção `tee` pode ser usada em vez disso para salvar a saída da consulta, embora não seja tão conveniente quanto `pager` para navegar pela saída em algumas situações.

* `print`, `\p`

Imprima a declaração de entrada atual sem executá-la.

* `prompt [str]`, `\R [str]`

Reconfigure o prompt **mysql** para a string fornecida. As sequências de caracteres especiais que podem ser usadas no prompt são descritas mais adiante nesta seção.

Se você especificar o comando `prompt` sem argumento, o **mysql** redefine o prompt para o padrão de `mysql>`.

* `quit`, `\q`

Saia de **mysql**.

* `rehash`, `\#`

Recrie o hash de conclusão que permite a conclusão do nome do banco de dados, tabela e coluna enquanto você está digitando declarações. (Veja a descrição da opção `--auto-rehash`.

* `resetconnection`, `\x`

Reinicie a conexão para limpar o estado da sessão.

A redefinição de uma conexão tem efeitos semelhantes ao `mysql_change_user()` ou a um auto-reconexão, exceto que a conexão não é fechada e reaberta, e a reautenticação não é feita. Veja mysql\_change\_user() e Controle de Reconexão Automática.

Este exemplo mostra como `resetconnection` limpa um valor mantido no estado da sessão:

  ```sql
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

* `status`, `\s`

Forneça informações de status sobre a conexão e o servidor que você está usando. Se você estiver executando com `--safe-updates` habilitado, `status` também imprime os valores das variáveis **mysql** que afetam suas consultas.

* `system command`, `\! command`

Execute o comando fornecido usando o interpretador de comandos padrão.

O comando `system` funciona apenas no Unix.

* `tee [file_name]`, `\T [file_name]`

Ao usar a opção `--tee` ao invocar o **mysql**, você pode registrar declarações e suas saídas. Todos os dados exibidos na tela são anexados a um arquivo dado. Isso também pode ser muito útil para fins de depuração. O **mysql** esvazia os resultados para o arquivo após cada declaração, logo antes de imprimir sua próxima solicitação. A funcionalidade Tee funciona apenas no modo interativo.

Você pode habilitar esse recurso interativamente com o comando `tee`. Sem um parâmetro, o arquivo anterior é usado. O arquivo `tee` pode ser desativado com o comando `notee`. Executar `tee` novamente reativa o registro.

* `use db_name`, `\u db_name`

Use *`db_name`* como o banco de dados padrão.

* `warnings`, `\W`

Ative a exibição de avisos após cada declaração (se houver alguma).

Aqui estão alguns conselhos sobre o comando `pager`:

* Você pode usá-lo para escrever em um arquivo e os resultados vão apenas para o arquivo:

  ```sql
  mysql> pager cat > /tmp/log.txt
  ```

Você também pode passar quaisquer opções para o programa que você deseja usar como seu pager:

  ```sql
  mysql> pager less -n -i -S
  ```

* No exemplo anterior, observe a opção `-S`. Você pode achar muito útil para navegar em resultados de consulta ampla. Às vezes, um conjunto de resultados muito amplo é difícil de ler na tela. A opção `-S` para **menos** pode tornar o conjunto de resultados muito mais legível, pois você pode rolar-o horizontalmente usando as teclas seta para a esquerda e seta para a direita. Você também pode usar `-S` interativamente dentro de **less** para ligar e desligar o modo de navegação horizontal. Para mais informações, leia a página do manual do **less**:

  ```sql
  man less
  ```

* As opções `-F` e `-X` podem ser usadas com **menos** para fazer com que ela saia se a saída cabe em um único ecrã, o que é conveniente quando não é necessário rolar:

  ```sql
  mysql> pager less -n -i -S -F -X
  ```

* Você pode especificar comandos de página muito complexos para manipulação da saída da consulta:

  ```sql
  mysql> pager cat | tee /dr1/tmp/res.txt \
            | tee /dr2/tmp/res2.txt | less -n -i -S
  ```

Neste exemplo, o comando enviaria os resultados da consulta para dois arquivos em dois diretórios diferentes em dois sistemas de arquivos diferentes montados em `/dr1` e `/dr2`, mas ainda exibisse os resultados na tela usando **less**.

Você também pode combinar as funções `tee` e `pager`. Tenha um arquivo `tee` habilitado e `pager` definido como **menos**, e você poderá navegar pelos resultados usando o programa **less** e ainda ter tudo anexado em um arquivo ao mesmo tempo. A diferença entre o Unix `tee` usado com o comando `pager` e o comando interno `tee` do **mysql** é que o interno `tee` funciona mesmo se você não tiver o **tee** do Unix disponível. O interno `tee` também registra tudo o que é impresso na tela, enquanto o **tee** do Unix usado com `pager` não registra tanto. Além disso, o registro de arquivo `tee` pode ser ligado e desligado interativamente dentro do **mysql**. Isso é útil quando você quer registrar algumas consultas em um arquivo, mas não outras.

O comando `prompt` reconfigura o prompt padrão `mysql>`. A string para definir o prompt pode conter as seguintes sequências especiais.

<table summary="prompt command options that are used to configure the mysql&gt; prompt."><col style="width: 15%"/><col style="width: 75%"/><thead><tr> <th>Option</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><code>\C</code></td> <td>O identificador atual da conexão</td> </tr><tr> <td><code>\c</code></td> <td>Um contador que incrementa para cada declaração que você emite</td> </tr><tr> <td><code>\D</code></td> <td>A data atual completa</td> </tr><tr> <td><code>\d</code></td> <td>O banco de dados padrão</td> </tr><tr> <td><code>\h</code></td> <td>O servidor host</td> </tr><tr> <td><code>\l</code></td> <td>O delimitador atual</td> </tr><tr> <td><code>\m</code></td> <td>Minutos do horário atual</td> </tr><tr> <td><code>\n</code></td> <td>Um caractere de nova string</td> </tr><tr> <td><code>\O</code></td> <td>O mês atual no formato de três letras (Jan, Feb, …)</td> </tr><tr> <td><code>\o</code></td> <td>O mês atual em formato numérico</td> </tr><tr> <td><code>\P</code></td> <td>am/pm</td> </tr><tr> <td><code>\p</code></td> <td>O port atual TCP/IP ou arquivo de soquete</td> </tr><tr> <td><code>\R</code></td> <td>O horário atual, em hora militar de 24 horas (0–23)</td> </tr><tr> <td><code>\r</code></td> <td>O horário atual, horário padrão de 12 horas (1–12)</td> </tr><tr> <td><code>\S</code></td> <td>Ponto e vírgula</td> </tr><tr> <td><code>\s</code></td> <td>Segundos do horário atual</td> </tr><tr> <td><code>\t</code></td> <td>Um caractere de tabulação</td> </tr><tr> <td><code>\U</code></td> <td>Seu completo<code><code>user_name</code>@<code>host_name</code></code>nome da conta</td> </tr><tr> <td><code>\u</code></td> <td>Seu nome de usuário</td> </tr><tr> <td><code>\v</code></td> <td>A versão do servidor</td> </tr><tr> <td><code>\w</code></td> <td>O dia atual da semana no formato de três letras (Seg, Ter, etc.)</td> </tr><tr> <td><code>\Y</code></td> <td>O ano atual, quatro algarismos</td> </tr><tr> <td><code>\y</code></td> <td>O ano atual, dois algarismos</td> </tr><tr> <td><code>\_</code></td> <td>Um espaço</td> </tr><tr> <td><code>\ </code></td> <td>Um espaço (um espaço segue o backslash)</td> </tr><tr> <td><code>\'</code></td> <td>Citação única</td> </tr><tr> <td><code>\"</code></td> <td>Citação dupla</td> </tr><tr> <td><code>\\</code></td> <td>Literalmente<code>\</code>caractere barra invertida</td> </tr><tr> <td><code>\<code>x</code></code></td> <td> <code>x</code>, para qualquer “<code>x</code>“não listado acima</td> </tr></tbody></table>

Você pode definir o prompt de várias maneiras:

* *Use uma variável de ambiente.* Você pode definir a variável de ambiente `MYSQL_PS1` como uma string de prompt. Por exemplo:

  ```sql
  export MYSQL_PS1="(\u@\h) [\d]> "
  ```

* *Use uma opção de string de comando.* Você pode definir a opção `--prompt` na string de comando para **mysql**. Por exemplo:

  ```sql
  $> mysql --prompt="(\u@\h) [\d]> "
  (user@host) [database]>
  ```

* *Use um arquivo de opção.* Você pode definir a opção `prompt` no grupo `[mysql]` de qualquer arquivo de opção do MySQL, como `/etc/my.cnf` ou o arquivo `.my.cnf` no seu diretório doméstico. Por exemplo:

  ```sql
  [mysql]
  prompt=(\\u@\\h) [\\d]>\\_
  ```

Neste exemplo, observe que os backslashes estão duplicados. Se você definir o prompt usando a opção `prompt` em um arquivo de opções, é aconselhável duplicar os backslashes ao usar as opções de prompt especiais. Há alguma sobreposição no conjunto de opções de prompt permitidas e no conjunto de sequências de escape especiais que são reconhecidas em arquivos de opções. (As regras para sequências de escape em arquivos de opções estão listadas na Seção 4.2.2.2, “Usando Arquivos de Opções”). A sobreposição pode causar problemas se você usar backslashes simples. Por exemplo, `\s` é interpretado como um espaço, em vez de como o valor atual dos segundos. O exemplo a seguir mostra como definir um prompt dentro de um arquivo de opções para incluir a hora atual no formato `hh:mm:ss>`:

  ```sql
  [mysql]
  prompt="\\r:\\m:\\s> "
  ```

* *Defina o prompt interativamente.* Você pode alterar o prompt interativamente usando o comando `prompt` (ou `\R`). Por exemplo:

  ```sql
  mysql> prompt (\u@\h) [\d]>\_
  PROMPT set to '(\u@\h) [\d]>\_'
  (user@host) [database]>
  (user@host) [database]> prompt
  Returning to default PROMPT of mysql>
  mysql>
  ```

#### 4.5.1.3 Registro do cliente do MySQL

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

* **mysql** registra cada string de declaração não ignorada e não vazia individualmente.

* Se uma declaração não ignorada abranger várias strings (excluindo o delimitador final), o **mysql** concatena as strings para formar a declaração completa, mapeia as novas strings em espaços e registra o resultado, além de um delimitador.

Consequentemente, uma declaração de entrada que se estende por várias strings pode ser registrada duas vezes. Considere este exemplo de entrada:

```sql
mysql> SELECT
    -> 'Today is'
    -> ,
    -> CURDATE()
    -> ;
```

Neste caso, o **mysql** registra as strings “SELECT”, “'Hoje é'”, “,”, “CURDATE()” e “;” à medida que as lê. Ele também registra a declaração completa, após mapear `SELECT\n'Today is'\n,\nCURDATE()` para `SELECT 'Today is' , CURDATE()`, além de um delimitador. Assim, essas strings aparecem na saída registrada:

```sql
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

Os padrões especificados na string de comando podem precisar ser citados ou escapados para evitar que o interpretador de comandos os trate de forma especial. Por exemplo, para suprimir o registro para as declarações `UPDATE` e `DELETE`, além das declarações que se referem a senhas, invoque o **mysql** da seguinte forma:

```sql
mysql --histignore="*UPDATE*:*DELETE*"
```

##### Controlar o arquivo de histórico

O arquivo `.mysql_history` deve ser protegido com um modo de acesso restritivo, pois informações sensíveis podem ser escritas nele, como o texto das instruções SQL que contêm senhas. Veja a Seção 6.1.2.1, “Diretrizes para o Usuário Final sobre Segurança de Senhas”. As declarações no arquivo são acessíveis a partir do cliente **mysql** quando a tecla **seta para cima** é usada para lembrar o histórico. Veja Desabilitar Histórico Interativo.

Se você não quiser manter um arquivo de histórico, primeiro remova `.mysql_history` se ele existir. Em seguida, use uma das seguintes técnicas para impedir que ele seja criado novamente:

* Defina a variável de ambiente `MYSQL_HISTFILE` para `/dev/null`. Para fazer com que essa configuração seja aplicada a cada login, coloque-a em um dos arquivos de inicialização do seu shell.

* Crie `.mysql_history` como um link simbólico para `/dev/null`; isso precisa ser feito apenas uma vez:

  ```sql
  ln -s /dev/null $HOME/.mysql_history
  ```

##### Características de registro syslog

Se a opção `--syslog` for fornecida, o **mysql** escreve declarações interativas na facilidade de registro do sistema. O registro de mensagens tem as seguintes características.

O registro ocorre no nível de “informação”. Isso corresponde à prioridade `LOG_INFO` para `syslog` no Unix/Linux `syslog` capacidade e a `EVENTLOG_INFORMATION_TYPE` para o Registro de Eventos do Windows. Consulte a documentação do seu sistema para a configuração da sua capacidade de registro.

O tamanho da mensagem é limitado a 1024 bytes.

As mensagens consistem no identificador `MysqlClient` seguido por esses valores:

* `SYSTEM_USER`

O nome do usuário do sistema operacional (nome de login) ou `--` se o usuário for desconhecido.

* `MYSQL_USER`

O nome do usuário do MySQL (especificado com a opção `--user`) ou `--` se o usuário for desconhecido.

* `CONNECTION_ID`:

O identificador de conexão do cliente. Isso é o mesmo que o valor da função `CONNECTION_ID()` dentro da sessão.

* `DB_SERVER`

O servidor hospedeiro ou `--` se o hospedeiro é desconhecido.

* `DB`

O banco de dados padrão ou `--` se nenhum banco de dados tiver sido selecionado.

* `QUERY`

O texto da declaração registrada.

Aqui está uma amostra de saída gerada no Linux usando `--syslog`. Essa saída é formatada para melhor legibilidade; cada mensagem registrada na verdade ocupa uma única string.

```sql
Mar  7 12:39:25 myhost MysqlClient[20824]:
  SYSTEM_USER:'oscar', MYSQL_USER:'my_oscar', CONNECTION_ID:23,
  DB_SERVER:'127.0.0.1', DB:'--', QUERY:'USE test;'
Mar  7 12:39:28 myhost MysqlClient[20824]:
  SYSTEM_USER:'oscar', MYSQL_USER:'my_oscar', CONNECTION_ID:23,
  DB_SERVER:'127.0.0.1', DB:'test', QUERY:'SHOW TABLES;'
```

#### 4.5.1.4 Ajuda do cliente do MySQL no lado do servidor

```sql
mysql> help search_string
```

Se você fornecer um argumento para o comando `help`, o **mysql** usa-o como uma string de pesquisa para acessar a ajuda do lado do servidor a partir do conteúdo do Manual de Referência do MySQL. O funcionamento adequado deste comando requer que as tabelas de ajuda no banco de dados `mysql` sejam inicializadas com informações sobre os tópicos de ajuda (consulte Seção 5.1.14, “Suporte de Ajuda do Lado do Servidor”).

Se não houver correspondência para a string de pesquisa, a pesquisa falha:

```sql
mysql> help me

Nothing found
Please try to run 'help contents' for a list of all accessible topics
```

Use o **conteúdo de ajuda** para ver uma lista das categorias de ajuda:

```sql
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

```sql
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

```sql
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

```sql
mysql> SHOW BINARY LOGS;
+---------------+-----------+
| Log_name      | File_size |
+---------------+-----------+
| binlog.000015 |    724935 |
| binlog.000016 |    733481 |
+---------------+-----------+
```

A string de busca pode conter os caracteres de comodinho `%` e `_`. Estes têm o mesmo significado que para operações de correspondência de padrões realizadas com o operador `LIKE`. Por exemplo, `HELP rep%` retorna uma lista de tópicos que começam com `rep`:

```sql
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

#### 4.5.1.5 Executando declarações SQL a partir de um arquivo de texto

O cliente **mysql** é tipicamente usado interativamente, assim:

```sql
mysql db_name
```

No entanto, também é possível colocar suas declarações SQL em um arquivo e, em seguida, dizer ao **mysql** para ler sua entrada desse arquivo. Para fazer isso, crie um arquivo de texto *`text_file`* que contenha as declarações que você deseja executar. Em seguida, invoque o **mysql** como mostrado aqui:

```sql
mysql db_name < text_file
```

Se você colocar uma declaração `USE db_name` como a primeira declaração no arquivo, não é necessário especificar o nome do banco de dados na string de comando:

```sql
mysql < text_file
```

Se você já está executando o **mysql**, pode executar um arquivo de script SQL usando o comando `source` ou o comando `\.`:

```sql
mysql> source file_name
mysql> \. file_name
```

Às vezes, você pode querer que seu script mostre informações de progresso ao usuário. Para isso, você pode inserir declarações como esta:

```sql
SELECT '<info_to_display>' AS ' ';
```

A declaração exibida exibe `<info_to_display>`.

Você também pode invocar o **mysql** com a opção `--verbose`, o que faz com que cada declaração seja exibida antes do resultado que ela produz.

O **mysql** ignora os caracteres da marca de ordem de bytes Unicode (BOM) no início dos arquivos de entrada. Anteriormente, ele os lia e os enviava para o servidor, resultando em um erro de sintaxe. A presença de um BOM não faz com que o **mysql** mude seu conjunto de caracteres padrão. Para fazer isso, invoque o **mysql** com uma opção como `--default-character-set=utf8`.

Para mais informações sobre o modo em lote, consulte a Seção 3.5, “Usando o mysql em modo em lote”.

#### 4.5.1.6 Dicas do cliente do MySQL

Esta seção fornece informações sobre técnicas para uso mais eficaz do **mysql** e sobre o comportamento operacional do **mysql**.

* Edição de string de entrada * Desativação do Histórico Interativo * Suporte a Unicode no Windows * Exibição dos resultados da consulta verticalmente * Uso do modo de atualizações seguras (--safe-updates)") * Desativação do auto-reconexão do mysql * Parser do cliente mysql versus parser do servidor

Edição de string de entrada

O **mysql** suporta edição de string de entrada, o que permite modificar a string de entrada atual no local ou recuperar strings de entrada anteriores. Por exemplo, as teclas **seta para a esquerda** e **seta para a direita** movem-se horizontalmente dentro da string de entrada atual, e as teclas **seta para cima** e **seta para baixo** movem-se para cima e para baixo através do conjunto de strings previamente inseridas. **Backspace** exclui o caractere antes do cursor e, ao digitar novos caracteres, eles são inseridos na posição do cursor. Para inserir a string, pressione **Enter**.

Em Windows, as sequências de teclas de edição são as mesmas que são suportadas para edição de comandos em janelas de console. Em Unix, as sequências de teclas dependem da biblioteca de entrada usada para construir o **mysql** (por exemplo, a biblioteca `libedit` ou `readline`).

A documentação para as bibliotecas `libedit` e `readline` está disponível online. Para alterar o conjunto de sequências de teclas permitidas por uma biblioteca de entrada dada, defina ligações de teclas no arquivo de inicialização da biblioteca. Este é um arquivo no seu diretório doméstico: `.editrc` para `libedit` e `.inputrc` para `readline`.

Por exemplo, em `libedit`, **Control+W** exclui tudo antes da posição atual do cursor e **Control+U** exclui toda a string. Em `readline`, **Control+W** exclui a palavra antes do cursor e **Control+U** exclui tudo antes da posição atual do cursor. Se o **mysql** foi construído usando `libedit`, um usuário que prefira o comportamento do `readline` para essas duas teclas pode colocar as seguintes strings no arquivo `.editrc` (criando o arquivo, se necessário):

```sql
bind "^W" ed-delete-prev-word
bind "^U" vi-kill-line-prev
```

Para ver o conjunto atual de vinculações de teclas, coloque temporariamente uma string que diga apenas `bind` no final de `.editrc`. Em seguida, o **mysql** exibe as vinculações quando ele começa.

##### Desativando Histórico Interativo

A tecla **seta para cima** permite que você relembre as strings de entrada das sessões atuais e anteriores. Nos casos em que um console é compartilhado, esse comportamento pode ser inadequado. O **mysql** suporta a desativação do histórico interativo parcialmente ou totalmente, dependendo da plataforma do host.

No Windows, o histórico é armazenado na memória. **Alt+F7** exclui todas as strings de entrada armazenadas na memória do buffer de histórico atual. Também exclui a lista de números sequenciais na frente das strings de entrada exibidas com **F7** e recuperadas (por número) com **F9**. Novas strings de entrada inseridas após pressionar **Alt+F7** repopulam o buffer de histórico atual. A limpeza do buffer não impede o registro no Visualizador de Eventos do Windows, se a opção `--syslog` foi usada para iniciar o **mysql**. A fechamento da janela da consola também limpa o buffer de histórico atual.

Para desativar o histórico interativo no Unix, primeiro exclua o arquivo `.mysql_history`, se ele existir (as entradas anteriores são recuperadas caso contrário). Em seguida, inicie o **mysql** com a opção `--histignore="*"` para ignorar todas as novas strings de entrada. Para reativar o comportamento de recall (e registro) novamente, reinicie o **mysql** sem a opção.

Se você impedir que o arquivo `.mysql_history` seja criado (veja Controlando o arquivo de histórico) e usar `--histignore="*"` para iniciar o cliente **mysql**, a facilidade de recall interativa do histórico será totalmente desativada. Alternativamente, se você omitir a opção `--histignore`, poderá recuperar as strings de entrada inseridas durante a sessão atual.

Suporte Unicode no Windows

O Windows fornece APIs baseadas em UTF-16LE para leitura e escrita no console; o cliente **mysql** para o Windows é capaz de usar essas APIs. O instalador do Windows cria um item no menu do MySQL com o nome `MySQL command line client - Unicode`. Esse item invoca o cliente **mysql** com propriedades definidas para se comunicar através do console com o servidor MySQL usando Unicode.

Para aproveitar esse suporte manualmente, execute o **mysql** em um console que use uma fonte Unicode compatível e defina o conjunto de caracteres padrão para um conjunto de caracteres Unicode que seja compatível com a comunicação com o servidor:

1. Abra uma janela de console. 2. Vá às propriedades da janela do console, selecione a aba de fonte e escolha Lucida Console ou outra fonte Unicode compatível. Isso é necessário porque as janelas do console começam, por padrão, usando uma fonte de raster DOS que é inadequada para Unicode.

3. Execute o **mysql.exe** com a opção `--default-character-set=utf8` (ou `utf8mb4`). Esta opção é necessária porque `utf16le` é um dos conjuntos de caracteres que não podem ser usados como conjunto de caracteres do cliente. Veja Conjuntos de caracteres do cliente impermissíveis.

Com essas mudanças, o **mysql** pode usar as APIs do Windows para se comunicar com o console usando UTF-16LE e se comunicar com o servidor usando UTF-8. (O item do menu mencionado anteriormente define a fonte e o conjunto de caracteres como descrito anteriormente.)

Para evitar esses passos toda vez que você executar o **mysql**, você pode criar um atalho que invoque o **mysql.exe**. O atalho deve definir a fonte do console como Lucida Console ou outra fonte Unicode compatível e passar a opção `--default-character-set=utf8` (ou `utf8mb4`) para o **mysql.exe**.

Como alternativa, crie um atalho que configure apenas a fonte do console e defina o conjunto de caracteres no grupo `[mysql]` do seu arquivo `my.ini`:

```sql
[mysql]
default-character-set=utf8
```

##### Exibir os resultados da consulta verticalmente

Alguns resultados de consulta são muito mais legíveis quando exibidos verticalmente, em vez do formato usual de tabela horizontal. As consultas podem ser exibidas verticalmente terminando a consulta com \G em vez de um ponto e vírgula. Por exemplo, valores de texto mais longos que incluem novas strings são frequentemente muito mais fáceis de ler com saída vertical:

```sql
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

Para iniciantes, uma opção de inicialização útil é `--safe-updates` (ou `--i-am-a-dummy`, que tem o mesmo efeito). O modo de atualizações seguras é útil para casos em que você pode ter emitido uma declaração `UPDATE` ou `DELETE` mas esqueceu a cláusula `WHERE` que indica quais strings devem ser modificadas. Normalmente, tais declarações atualizam ou excluem todas as strings da tabela. Com `--safe-updates`, você pode modificar strings apenas especificando os valores da chave que as identificam, ou uma cláusula `LIMIT`, ou ambas. Isso ajuda a evitar acidentes. O modo de atualizações seguras também restringe declarações `SELECT` que produzem (ou são estimadas para produzir) conjuntos de resultados muito grandes.

A opção `--safe-updates` faz com que o **mysql** execute a seguinte instrução quando se conecta ao servidor MySQL, para definir os valores de sessão das variáveis de sistema `sql_safe_updates`, `sql_select_limit` e `max_join_size`:

```sql
SET sql_safe_updates=1, sql_select_limit=1000, max_join_size=1000000;
```

A declaração `SET` afeta o processamento de declarações da seguinte forma:

* Habilitar `sql_safe_updates` faz com que as declarações `UPDATE` e `DELETE` gerem um erro se elas não especificar uma restrição de chave na cláusula `WHERE`, ou fornecerem uma cláusula `LIMIT`, ou ambas. Por exemplo:

  ```sql
  UPDATE tbl_name SET not_key_column=val WHERE key_column=val;

  UPDATE tbl_name SET not_key_column=val LIMIT 1;
  ```

* Definindo `sql_select_limit` para 1.000, o servidor limita todos os conjuntos de resultados `SELECT` a 1.000 strings, a menos que a declaração inclua uma cláusula `LIMIT`.

* Definindo `max_join_size` para 1.000.000, as declarações de múltiplas tabelas `SELECT` geram um erro se o servidor estimar que deve examinar mais de 1.000.000 de combinações de strings.

Para especificar limites de conjunto de resultados diferentes de 1.000 e 1.000.000, você pode substituir os valores padrão usando as opções `--select-limit` e `--max-join-size` ao invocar o **mysql**:

```sql
mysql --safe-updates --select-limit=500 --max-join-size=10000
```

É possível que as declarações `UPDATE` e `DELETE` produzam um erro no modo de atualizações seguras, mesmo com uma chave especificada na cláusula `WHERE`, se o otimizador decidir não usar o índice na coluna da chave:

* O acesso à faixa no índice não pode ser usado se o uso de memória exceder o permitido pela variável de sistema `range_optimizer_max_mem_size`. O otimizador, então, volta a um varrimento de tabela. Veja Limitar o uso de memória para otimização de faixa.

* Se as comparações principais requerem conversão de tipo, o índice pode não ser usado (consulte a Seção 8.3.1, “Como o MySQL usa índices”). Suponha que uma coluna de string indexada `c1` seja comparada a um valor numérico usando `WHERE c1 = 2222`. Para tais comparações, o valor da string é convertido em um número e os operandos são comparados numericamente (consulte a Seção 12.3, “Conversão de tipo na avaliação da expressão”), impedindo o uso do índice. Se o modo de atualizações seguras estiver habilitado, ocorre um erro.

A partir do MySQL 5.7.25, o modo safe-updates também inclui esses comportamentos:

* As declarações `EXPLAIN` com `UPDATE` e `DELETE` não produzem erros de atualização segura. Isso permite o uso de `EXPLAIN` mais `SHOW WARNINGS` para ver por que um índice não é usado, o que pode ser útil em casos como quando ocorre uma violação `range_optimizer_max_mem_size` ou conversão de tipo e o otimizador não usa um índice, mesmo que uma coluna chave tenha sido especificada na cláusula `WHERE`.

* Quando ocorre um erro de atualizações de segurança, a mensagem de erro inclui o primeiro diagnóstico que foi produzido, para fornecer informações sobre o motivo do erro. Por exemplo, a mensagem pode indicar que o valor `range_optimizer_max_mem_size` foi excedido ou ocorreu uma conversão de tipo, o que pode impedir o uso de um índice.

* Para apagamentos e atualizações em várias tabelas, um erro é gerado com atualizações seguras habilitadas apenas se qualquer tabela de destino usar uma varredura de tabela.

##### Desabilitar o Auto-Reconexão do mysql

Se o cliente **mysql** perder sua conexão com o servidor enquanto envia uma declaração, ele imediatamente e automaticamente tenta reconectar-se ao servidor e enviar a declaração novamente. No entanto, mesmo que o **mysql** tenha sucesso na reconexão, sua primeira conexão terminou e todos os objetos e configurações da sua sessão anterior são perdidos: tabelas temporárias, o modo de autocommit e as variáveis definidas pelo usuário e de sessão. Além disso, qualquer transação atual é revertida. Esse comportamento pode ser perigoso para você, como no exemplo seguinte, onde o servidor foi desligado e reiniciado entre a primeira e a segunda declarações sem que você soubesse:

```sql
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

O cliente **mysql** utiliza um analisador no lado do cliente que não é um duplicado do analisador completo utilizado pelo servidor `mysqld` no lado do servidor. Isso pode levar a diferenças no tratamento de certos construtos. Exemplos:

* O analisador de servidor trata as cadeias delimitadas por caracteres `"` como identificadores, em vez de como cadeias simples, se o modo SQL `ANSI_QUOTES` estiver habilitado.

O analisador de cliente **mysql** não leva em conta o modo SQL `ANSI_QUOTES`. Ele trata as strings delimitadas por `"`, `'` e `` ` ANSI_QUOTES` quando a opção é habilitada.

* Dentro dos comentários de `/*! ... */`, o analisador de clientes **mysql** interpreta comandos **mysql** de forma abreviada. O analisador do servidor não os interpreta, pois esses comandos não têm significado no lado do servidor.

Se for desejável que o **mysql** não interprete comandos de curta forma dentro dos comentários, uma solução parcial é usar a opção `--binary-mode`, que faz com que todos os comandos do **mysql** sejam desativados, exceto `\C` e `\d` no modo não interativo (para entrada canalizada para o **mysql** ou carregada usando o comando `source`).

### 4.5.2 mysqladmin — Um programa de administração do servidor MySQL

**mysqladmin** é um cliente para realizar operações administrativas. Você pode usá-lo para verificar a configuração do servidor e o status atual, criar e descartar bancos de dados, entre outros.

Invoque o **mysqladmin** da seguinte forma:

```sql
mysqladmin [options] command [command-arg] [command [command-arg]] ...
```

O **mysqladmin** suporta os seguintes comandos. Alguns dos comandos exigem um argumento após o nome do comando.

* `create db_name`

Crie um novo banco de dados chamado *`db_name`*.

* `debug`

Informe ao servidor que deve escrever informações de depuração no log de erro. O usuário conectado deve ter o privilégio `SUPER`. O formato e o conteúdo dessas informações estão sujeitos a alterações.

Isso inclui informações sobre o Agendamento de Eventos. Veja a Seção 23.4.5, “Status do Agendamento de Eventos”.

* `drop db_name`

Exclua o banco de dados denominado *`db_name`* e todas as suas tabelas.

* `extended-status`

Exiba as variáveis de status do servidor e seus valores.

* `flush-hosts`

Limpe todas as informações no cache do host. Veja a Seção 5.1.11.2, “Consultas de DNS e o cache do host”.

* `flush-logs [log_type ...]`

Limpe todos os registros.

O comando **mysqladmin flush-logs** permite que tipos de log opcionais sejam fornecidos, para especificar quais logs devem ser esvaziados. Seguindo o comando `flush-logs`, você pode fornecer uma lista de um ou mais dos seguintes tipos de log, separados por espaço: `binary`, `engine`, `error`, `general`, `relay`, `slow`. Esses correspondem aos tipos de log que podem ser especificados para a declaração SQL `FLUSH LOGS`.

* `flush-privileges`

Recarregue as tabelas de subsídios (mesmo que `reload`).

* `flush-status`

Variáveis de status claras.

* `flush-tables`

Limpe todas as tabelas.

* `flush-threads`

Limpe o cache do thread.

* `kill id,id,...`

Mate os threads do servidor. Se vários valores de ID de thread forem fornecidos, não deve haver espaços na lista.

Para matar os threads pertencentes a outros usuários, o usuário conectado deve ter o privilégio `SUPER`.

* `old-password new_password`

Isso é como o comando `password`, mas armazena a senha usando o formato antigo (pré-4.1) de hashing de senha. (Veja a Seção 6.1.2.4, “Hashing de senha no MySQL”.)

Esse comando foi removido no MySQL 5.7.5.

* `password new_password`

Defina uma nova senha. Isso altera a senha para *`new_password`* para a conta que você usa com **mysqladmin** para se conectar ao servidor. Assim, da próxima vez que você invocar **mysqladmin** (ou qualquer outro programa cliente) usando a mesma conta, você deve especificar a nova senha.

Aviso

Definir uma senha usando **mysqladmin** deve ser considerado *inseguro*. Em alguns sistemas, sua senha se torna visível para programas de status do sistema, como o **ps**, que podem ser invocados por outros usuários para exibir strings de comando. Os clientes MySQL geralmente sobrescrevem o argumento da senha de string de comando durante sua sequência de inicialização. No entanto, ainda há um breve intervalo durante o qual o valor é visível. Além disso, em alguns sistemas, essa estratégia de sobrescrita é ineficaz e a senha permanece visível para o **ps**. (Sistemas Unix SystemV e talvez outros estão sujeitos a esse problema.)

Se o valor *`new_password`* contiver espaços ou outros caracteres especiais para o seu interpretador de comandos, você precisa colocá-lo entre aspas. Em Windows, certifique-se de usar aspas duplas em vez de aspas simples; as aspas simples não são removidas da senha, mas sim interpretadas como parte da senha. Por exemplo:

  ```sql
  mysqladmin password "my new password"
  ```

A nova senha pode ser omitida após o comando `password`. Neste caso, o **mysqladmin** solicita o valor da senha, o que permite evitar a especificação da senha na string de comando. O omitindo o valor da senha deve ser feito apenas se `password` é o último comando na string de comando do **mysqladmin**. Caso contrário, o próximo argumento é considerado como senha.

Cuidado

Não use este comando se o servidor foi iniciado com a opção `--skip-grant-tables`. Não há alteração de senha aplicada. Isso é verdade mesmo se você preceder o comando `password` com `flush-privileges` na mesma string de comando para reativar as tabelas de concessão, porque a operação de varredura ocorre após a conexão. No entanto, você pode usar **mysqladmin flush-privileges** para reativar a tabela de concessão e, em seguida, usar um comando separado **mysqladmin password** para alterar a senha.

* `ping`

Verifique se o servidor está disponível. O status de retorno do **mysqladmin** é 0 se o servidor estiver em execução, 1 se não estiver. Isso é 0 mesmo em caso de um erro como `Access denied`, porque isso significa que o servidor está em execução, mas recusou a conexão, o que é diferente do servidor não estar em execução.

* `processlist`

Mostre uma lista de threads de servidor ativo. Isso é como a saída da declaração `SHOW PROCESSLIST`. Se a opção `--verbose` for dada, a saída é como a de `SHOW FULL PROCESSLIST`. (Veja Seção 13.7.5.29, “Declaração SHOW PROCESSLIST”.)

* `reload`

Recarregue as tabelas de subsídios.

* `refresh`

Limpe todas as tabelas e feche e abra os arquivos de registro.

* `shutdown`

Pare o servidor.

* `start-slave`

Comece a replicação em um servidor replica.

* `status`

Exibir uma breve mensagem de status do servidor.

* `stop-slave`

Parar a replicação em um servidor de replicação.

* `variables`

Exiba as variáveis do sistema do servidor e seus valores.

* `version`

Exibir informações da versão do servidor.

Todos os comandos podem ser abreviados para qualquer prefixo único. Por exemplo:

```sql
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

O número de consultas que levaram mais de `long_query_time` segundos. Veja a Seção 5.4.5, “O Log de Consulta Lenta”.

* `Opens`

O número de tabelas que o servidor abriu.

* `Flush tables`

O número de comandos `flush-*`, `refresh` e `reload` que o servidor executou.

* `Open tables`

O número de tabelas que estão abertas atualmente.

Se você executar **mysqladmin shutdown** ao se conectar a um servidor local usando um arquivo de socket Unix, o **mysqladmin** aguarda até que o arquivo de ID de processo do servidor seja removido, para garantir que o servidor tenha sido desligado corretamente.

O **mysqladmin** suporta as seguintes opções, que podem ser especificadas na string de comando ou nos grupos `[mysqladmin]` e `[client]` de um arquivo de opções. Para informações sobre arquivos de opções usados por programas do MySQL, consulte a Seção 4.2.2.2, “Usando arquivos de opções”.

**Tabela 4.14 Opções mysqladmin**

<table frame="box" rules="all" summary="Command-line options available for mysqladmin.">
<col style="width: 27%"/>
<col style="width: 50%"/>
<col style="width: 11%"/>
<col style="width: 11%"/>
<thead>
<tr>
<th>Option Name</th>
<th>Description</th>
<th>Introduced</th>
<th>Deprecated</th>
</tr>
</thead>
<tbody>
<tr>
<th><code>--bind-address</code></th>
<td>Use a interface de rede especificada para se conectar ao servidor MySQL</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--character-sets-dir</code></th>
<td>Diretório onde os conjuntos de caracteres podem ser encontrados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--compress</code></th>
<td>Compressar todas as informações enviadas entre o cliente e o servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--connect-timeout</code></th>
<td>Número de segundos antes do tempo limite de conexão</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--count</code></th>
<td>Número de iterações para realizar a execução repetida do comando</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug</code></th>
<td>Write debugging log</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug-check</code></th>
<td>Imprimir informações de depuração quando o programa sai</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug-info</code></th>
<td>Imprimir informações de depuração, memória e estatísticas de CPU quando o programa sai</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--default-auth</code></th>
<td>Plugin de autenticação a ser utilizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--default-character-set</code></th>
<td>Especificar o conjunto de caracteres padrão</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-extra-file</code></th>
<td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-file</code></th>
<td>Arquivo de opção de leitura apenas nomeado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-group-suffix</code></th>
<td>Valor do sufixo do grupo de opções</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--enable-cleartext-plugin</code></th>
<td>Habilitar o plugin de autenticação de texto claro</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--force</code></th>
<td>Continue mesmo que ocorra um erro SQL</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--get-server-public-key</code></th>
<td>Solicitar chave pública RSA do servidor</td>
<td>5.7.23</td>
<td></td>
</tr>
<tr>
<th><code>--help</code></th>
<td>Exibir mensagem de ajuda e sair</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--host</code></th>
<td>Anfitrião no qual o servidor MySQL está localizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--login-path</code></th>
<td>Leia as opções de caminho de login a partir de .mylogin.cnf</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--no-beep</code></th>
<td>Não emita um sinal sonoro quando ocorrerem erros</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--no-defaults</code></th>
<td>Não leia arquivos de opção</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--password</code></th>
<td>Senha para usar ao se conectar ao servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--pipe</code></th>
<td>Conecte-se ao servidor usando um pipe nomeado (apenas Windows)</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--plugin-dir</code></th>
<td>Diretório onde os plugins são instalados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--port</code></th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--print-defaults</code></th>
<td>Print default options</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--protocol</code></th>
<td>Protocolo de transporte a ser utilizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--relative</code></th>
<td>Mostre a diferença entre os valores atuais e anteriores quando usado com a opção --sleep</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--secure-auth</code></th>
<td>Não envie senhas para o servidor no formato antigo (pré-4.1)</td>
<td></td>
<td>Sim</td>
</tr>
<tr>
<th><code>--server-public-key-path</code></th>
<td>Nome do caminho para o arquivo que contém a chave pública RSA</td>
<td>5.7.23</td>
<td></td>
</tr>
<tr>
<th><code>--shared-memory-base-name</code></th>
<td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--show-warnings</code></th>
<td>Mostrar avisos após a execução da declaração</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--shutdown-timeout</code></th>
<td>Número máximo de segundos para esperar o desligamento do servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--silent</code></th>
<td>Silent mode</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--sleep</code></th>
<td>Execute comandos repetidamente, dormindo por segundos de atraso entre eles</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--socket</code></th>
<td>Arquivo de socket Unix ou pipe nomeado do Windows a ser usado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl</code></th>
<td>Enable connection encryption</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-ca</code></th>
<td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-capath</code></th>
<td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-cert</code></th>
<td>Arquivo que contém o certificado X.509</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-cipher</code></th>
<td>Cifras permitidas para criptografia de conexão</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-crl</code></th>
<td>Arquivo que contém listas de revogação de certificados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-crlpath</code></th>
<td>Diretório que contém arquivos de lista de revogação de certificados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-key</code></th>
<td>Arquivo que contém a chave X.509</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-mode</code></th>
<td>Estado de segurança desejado da conexão com o servidor</td>
<td>5.7.11</td>
<td></td>
</tr>
<tr>
<th><code>--ssl-verify-server-cert</code></th>
<td>Verifique o nome do host contra a identidade do Nome comum do certificado do servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--tls-version</code></th>
<td>Protocolos TLS permitidos para conexões criptografadas</td>
<td>5.7.10</td>
<td></td>
</tr>
<tr>
<th><code>--user</code></th>
<td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--verbose</code></th>
<td>Verbose mode</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--version</code></th>
<td>Exibir informações da versão e sair</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--vertical</code></th>
<td>Imprimir strings de saída de consulta verticalmente (uma string por valor de coluna)</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--wait</code></th>
<td>Se a conexão não puder ser estabelecida, espere e tente novamente em vez de abortar</td>
<td></td>
<td></td>
</tr>
</tbody>
</table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Exibir uma mensagem de ajuda e sair.

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

Em um computador com várias interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao servidor MySQL.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

O diretório onde os conjuntos de caracteres são instalados. Veja a Seção 10.15, “Configuração de Conjunto de Caracteres”.

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

Compressa todas as informações enviadas entre o cliente e o servidor, se possível. Veja a Seção 4.2.6, “Controle de Compressão de Conexão”.

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

  <table frame="box" rules="all" summary="Properties for debug-info"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug-info</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

Imprimir informações de depuração e estatísticas de uso de memória e CPU quando o programa sai.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>0

Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Veja a Seção 6.2.13, “Autenticação substituível”.

* `--default-character-set=charset_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>1

Use *`charset_name`* como o conjunto de caracteres padrão. Veja a Seção 10.15, “Configuração do Conjunto de Caracteres”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>2

Leia este arquivo de opção após o arquivo de opção global, mas (em Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>3

Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Exceção: Mesmo com `--defaults-file`, os programas de cliente leem `.mylogin.cnf`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>4

Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, **mysqladmin** normalmente lê os grupos `[client]` e `[mysqladmin]`. Se esta opção for dada como `--defaults-group-suffix=_other`, **mysqladmin** também lê os grupos `[client_other]` e `[mysqladmin_other]`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>5

Ative o plugin de autenticação de texto claro `mysql_clear_password`. (Veja a Seção 6.4.1.6, “Autenticação de Texto Claro Plugável do Lado do Cliente”).

* `--force`, `-f`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>6

Não peça confirmação para o comando `drop db_name`. Com vários comandos, continue mesmo que ocorra um erro.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>7

Solicitar a chave pública necessária para a troca de senha baseada em par de chaves RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

Para informações sobre o plugin `caching_sha2_password`, consulte a Seção 6.4.1.4, “Cacheamento de Autenticação Alterável SHA-2”.

A opção `--get-server-public-key` foi adicionada no MySQL 5.7.23.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>8

Conecte-se ao servidor MySQL no host fornecido.

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>9

Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam para qual servidor MySQL se conectar e qual conta se autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql\_config\_editor**. Veja a Seção 4.6.6, “mysql\_config\_editor — Utilitário de Configuração MySQL”.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--no-beep`, `-b`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>0

Suprima o sinal sonoro de alerta que é emitido por padrão para erros, como falha na conexão com o servidor.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>1

Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para impedir que elas sejam lidas.

A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na string de comando, mesmo quando o `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql\_config\_editor**. Veja a Seção 4.6.6, “mysql\_config\_editor — Ferramenta de Configuração do MySQL”.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>2

A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecida, o **mysqladmin** solicitará uma senha. Se for fornecida, não deve haver *espaço* entre `--password=` ou `-p` e a senha que a segue. Se não for especificado nenhum tipo de opção de senha, o padrão é não enviar senha.

Especificar uma senha na string de comando deve ser considerado inseguro. Para evitar fornecer a senha na string de comando, use um arquivo de opção. Consulte a Seção 6.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

Para especificar explicitamente que não há senha e que o **mysqladmin** não deve solicitar uma senha, use a opção `--skip-password`.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>3

Em Windows, conecte-se ao servidor usando um pipe nomeado. Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por pipe nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>4

O diretório onde procurar plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o **mysqladmin** não o encontrar. Veja a Seção 6.2.13, “Autenticação Conectada”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>5

Para conexões TCP/IP, o número de porta a ser utilizado.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>6

Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>7

O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de outro protocolo que não o desejado. Para obter detalhes sobre os valores permitidos, consulte a Seção 4.2.5, “Protocolos de Transporte de Conexão”.

* `--relative`, `-r`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>8

Mostre a diferença entre os valores atuais e anteriores quando usado com a opção `--sleep`. Esta opção só funciona com o comando `extended-status`.

* `--show-warnings`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>9

Mostrar avisos resultantes da execução de declarações enviadas ao servidor.

* `--secure-auth`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>0

Não envie senhas para o servidor no formato antigo (pré-4.1). Isso impede conexões, exceto para servidores que usam o formato de senha mais recente.

A partir do MySQL 5.7.5, essa opção é desatualizada; espere que ela seja removida em um lançamento futuro do MySQL. Ela sempre está habilitada e tentar desabilitá-la (`--skip-secure-auth`, `--secure-auth=0`) produz um erro. Antes do MySQL 5.7.5, essa opção está habilitada por padrão, mas pode ser desabilitada.

Nota

As senhas que utilizam o método de hashing pré-4.1 são menos seguras do que as senhas que utilizam o método nativo de hashing de senha e devem ser evitadas. As senhas pré-4.1 são desaconselhadas e o suporte para elas foi removido no MySQL 5.7.5. Para instruções de atualização de conta, consulte a Seção 6.4.1.3, “Migrando para fora do hashing de senha pré-4.1 e do plugin mysql\_old\_password”.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>1

O nome do caminho de um arquivo em formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senha com base em par de chave RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

Para `sha256_password`, esta opção só se aplica se o MySQL foi construído usando OpenSSL.

Para informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 6.4.1.5, “Autenticação substituível SHA-256”, e a Seção 6.4.1.4, “Cache de autenticação substituível SHA-2”.

A opção `--server-public-key-path` foi adicionada no MySQL 5.7.23.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>2

Em Windows, o nome de memória compartilhada a ser usado para conexões feitas usando memória compartilhada a um servidor local. O valor padrão é `MYSQL`. O nome de memória compartilhada é sensível a maiúsculas e minúsculas.

Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

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

Para conexões a `localhost`, o arquivo de socket Unix a ser usado, ou, no Windows, o nome do pipe nomeado a ser usado.

Em Windows, esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de canal nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--ssl*`

As opções que começam com `--ssl` especificam se deve conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Consulte Opções de comando para conexões criptografadas.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>7

Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolo separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 6.3.2, “Protocolos e cifras TLS de conexão criptografada”.

Essa opção foi adicionada no MySQL 5.7.10.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>8

O nome de usuário da conta MySQL a ser usado para se conectar ao servidor.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>9

Modo detalhado. Imprima mais informações sobre o que o programa faz.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>0

Exibir informações da versão e sair.

* `--vertical`, `-E`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>1

Imprima a saída verticalmente. Isso é semelhante a `--relative`, mas imprime a saída verticalmente.

* `--wait[=count]`, `-w[count]`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>2

Se a conexão não puder ser estabelecida, espere e tente novamente em vez de abortar. Se um valor *`count`* for fornecido, ele indica o número de vezes para tentar novamente. O padrão é uma vez.

### 4.5.3 mysqlcheck — Um programa de manutenção de tabela

O cliente **mysqlcheck** realiza a manutenção de tabelas: ele verifica, repara, otimiza ou analisa as tabelas.

Cada tabela é bloqueada e, portanto, indisponível para outras sessões enquanto está sendo processada, embora, para operações de verificação, a tabela seja bloqueada com um bloqueio `READ` apenas (consulte a Seção 13.3.5, “Instruções LOCK TABLES e UNLOCK TABLES”, para mais informações sobre os bloqueios `READ` e `WRITE`). As operações de manutenção de tabela podem ser demoradas, especialmente para tabelas grandes. Se você usar a opção `--databases` ou `--all-databases` para processar todas as tabelas em uma ou mais bancos de dados, uma invocação do **mysqlcheck** pode levar um longo tempo. (Isso também é verdadeiro para o procedimento de atualização do MySQL se ele determinar que a verificação de tabela é necessária, pois processa as tabelas da mesma maneira.)

O **mysqlcheck** deve ser usado quando o servidor `mysqld` estiver em execução, o que significa que você não precisa parar o servidor para realizar a manutenção de tabelas.

O **mysqlcheck** utiliza as instruções SQL `CHECK TABLE`, `REPAIR TABLE`, `ANALYZE TABLE` e `OPTIMIZE TABLE` de uma maneira conveniente para o usuário. Ele determina quais instruções devem ser usadas para a operação que você deseja realizar e, em seguida, envia as instruções ao servidor para execução. Para obter detalhes sobre quais motores de armazenamento cada instrução funciona, consulte as descrições dessas instruções na Seção 13.7.2, “Instruções de Manutenção de Tabela”.

Nem todas as engines de armazenamento necessariamente suportam todas as quatro operações de manutenção. Nesses casos, uma mensagem de erro é exibida. Por exemplo, se `test.t` é uma tabela `MEMORY`, uma tentativa de verificá-la produz este resultado:

```sql
$> mysqlcheck test t
test.t
note     : The storage engine for the table doesn't support check
```

Se o **mysqlcheck** não conseguir reparar uma tabela, consulte a Seção 2.10.12, “Reestruturação ou reparação de tabelas ou índices”, para estratégias de reparo manual de tabelas. Esse é o caso, por exemplo, para as tabelas `InnoDB`, que podem ser verificadas com `CHECK TABLE`, mas não reparadas com `REPAIR TABLE`.

Cuidado

É melhor fazer um backup de uma tabela antes de realizar uma operação de reparo de tabela; em algumas circunstâncias, a operação pode causar perda de dados. As possíveis causas incluem, mas não estão limitadas a, erros do sistema de arquivos.

Existem três maneiras gerais de invocar o **mysqlcheck**:

```sql
mysqlcheck [options] db_name [tbl_name ...]
mysqlcheck [options] --databases db_name ...
mysqlcheck [options] --all-databases
```

Se você não nomear nenhuma tabela após *`db_name`* ou se você usar a opção `--databases` ou `--all-databases`, os bancos inteiros são verificados.

**mysqlcheck** possui uma característica especial em comparação com outros programas de cliente. O comportamento padrão de verificação de tabelas (`--check`) pode ser alterado renomeando o binário. Se você deseja ter uma ferramenta que repare as tabelas por padrão, basta fazer uma cópia de **mysqlcheck** chamada **mysqlrepair**, ou fazer um link simbólico para **mysqlcheck** chamado **mysqlrepair**. Se você invocar **mysqlrepair**, ele reparará as tabelas.

Os nomes mostrados na tabela a seguir podem ser usados para alterar o comportamento padrão do **mysqlcheck**.

<table summary="Command names that can be used to change mysqlcheck default behavior."><col style="width: 25%"/><col style="width: 75%"/><thead><tr> <th>Command</th> <th>Significado</th> </tr></thead><tbody><tr> <td><strong>mysqlrepair</strong></td> <td>A opção padrão é<code>--repair</code></td> </tr><tr> <td><strong>mysqlanalyze</strong></td> <td>A opção padrão é<code>--analyze</code></td> </tr><tr> <td><strong>mysqloptimize</strong></td> <td>A opção padrão é<code>--optimize</code></td> </tr></tbody></table>

O **mysqlcheck** suporta as seguintes opções, que podem ser especificadas na string de comando ou nos grupos `[mysqlcheck]` e `[client]` de um arquivo de opções. Para informações sobre arquivos de opções usados por programas do MySQL, consulte a Seção 4.2.2.2, “Usando arquivos de opções”.

**Tabela 4.15 Opções do mysqlcheck**

<table frame="box" rules="all" summary="Command-line options available for mysqlcheck.">
<col style="width: 27%"/>
<col style="width: 50%"/>
<col style="width: 11%"/>
<col style="width: 11%"/>
<thead>
<tr>
<th>Option Name</th>
<th>Description</th>
<th>Introduced</th>
<th>Deprecated</th>
</tr>
</thead>
<tbody>
<tr>
<th><code>--all-databases</code></th>
<td>Verifique todas as tabelas em todos os bancos de dados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--all-in-1</code></th>
<td>Execute uma única declaração para cada banco de dados que nomeia todas as tabelas desse banco de dados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--analyze</code></th>
<td>Analyze the tables</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--auto-repair</code></th>
<td>Se uma tabela verificada estiver corrompida, corrija-a automaticamente</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--bind-address</code></th>
<td>Use a interface de rede especificada para se conectar ao servidor MySQL</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--character-sets-dir</code></th>
<td>Diretório onde os conjuntos de caracteres são instalados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--check</code></th>
<td>Verifique as tabelas em busca de erros</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--check-only-changed</code></th>
<td>Verifique apenas as tabelas que foram alteradas desde a última verificação</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--check-upgrade</code></th>
<td>Invoque a consulta CHECK TABLE com a opção FOR UPGRADE</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--compress</code></th>
<td>Compressar todas as informações enviadas entre o cliente e o servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--databases</code></th>
<td>Interprete todos os argumentos como nomes de banco de dados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug</code></th>
<td>Write debugging log</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug-check</code></th>
<td>Imprimir informações de depuração quando o programa sai</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug-info</code></th>
<td>Imprimir informações de depuração, memória e estatísticas de CPU quando o programa sai</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--default-auth</code></th>
<td>Plugin de autenticação a ser utilizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--default-character-set</code></th>
<td>Especificar o conjunto de caracteres padrão</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-extra-file</code></th>
<td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-file</code></th>
<td>Arquivo de opção de leitura apenas nomeado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-group-suffix</code></th>
<td>Valor do sufixo do grupo de opções</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--enable-cleartext-plugin</code></th>
<td>Enable cleartext authentication plugin</td>
<td>5.7.10</td>
<td></td>
</tr>
<tr>
<th><code>--extended</code></th>
<td>Verifique e conserte mesas</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--fast</code></th>
<td>Verifique apenas as tabelas que não foram fechadas corretamente</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--fix-db-names</code></th>
<td>Converta os nomes dos bancos de dados para o formato 5.1</td>
<td></td>
<td>Sim</td>
</tr>
<tr>
<th><code>--fix-table-names</code></th>
<td>Converta os nomes das tabelas para o formato 5.1</td>
<td></td>
<td>Sim</td>
</tr>
<tr>
<th><code>--force</code></th>
<td>Continue mesmo que ocorra um erro SQL</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--get-server-public-key</code></th>
<td>Solicitar chave pública RSA do servidor</td>
<td>5.7.23</td>
<td></td>
</tr>
<tr>
<th><code>--help</code></th>
<td>Exibir mensagem de ajuda e sair</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--host</code></th>
<td>Anfitrião no qual o servidor MySQL está localizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--login-path</code></th>
<td>Leia as opções de caminho de login a partir de .mylogin.cnf</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--medium-check</code></th>
<td>Faça uma verificação que seja mais rápida do que uma operação --extended</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--no-defaults</code></th>
<td>Não leia arquivos de opção</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--optimize</code></th>
<td>Optimize the tables</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--password</code></th>
<td>Senha para usar ao se conectar ao servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--pipe</code></th>
<td>Conecte-se ao servidor usando um pipe nomeado (apenas Windows)</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--plugin-dir</code></th>
<td>Diretório onde os plugins são instalados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--port</code></th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--print-defaults</code></th>
<td>Print default options</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--protocol</code></th>
<td>Protocolo de transporte a ser utilizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--quick</code></th>
<td>O método mais rápido de verificação</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--repair</code></th>
<td>Realize uma reparação que possa consertar quase tudo, exceto chaves únicas que não são únicas</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--secure-auth</code></th>
<td>Não envie senhas para o servidor no formato antigo (pré-4.1)</td>
<td></td>
<td>Sim</td>
</tr>
<tr>
<th><code>--server-public-key-path</code></th>
<td>Nome do caminho para o arquivo que contém a chave pública RSA</td>
<td>5.7.23</td>
<td></td>
</tr>
<tr>
<th><code>--shared-memory-base-name</code></th>
<td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--silent</code></th>
<td>Silent mode</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--skip-database</code></th>
<td>Omitar este banco de dados das operações realizadas</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--socket</code></th>
<td>Arquivo de socket Unix ou pipe nomeado do Windows a ser usado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl</code></th>
<td>Enable connection encryption</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-ca</code></th>
<td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-capath</code></th>
<td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-cert</code></th>
<td>Arquivo que contém o certificado X.509</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-cipher</code></th>
<td>Cifras permitidas para criptografia de conexão</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-crl</code></th>
<td>Arquivo que contém listas de revogação de certificados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-crlpath</code></th>
<td>Diretório que contém arquivos de lista de revogação de certificados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-key</code></th>
<td>Arquivo que contém a chave X.509</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-mode</code></th>
<td>Estado de segurança desejado da conexão com o servidor</td>
<td>5.7.11</td>
<td></td>
</tr>
<tr>
<th><code>--ssl-verify-server-cert</code></th>
<td>Verifique o nome do host contra a identidade do Nome comum do certificado do servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--tables</code></th>
<td>Supra a opção --databases ou -B</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--tls-version</code></th>
<td>Protocolos TLS permitidos para conexões criptografadas</td>
<td>5.7.10</td>
<td></td>
</tr>
<tr>
<th><code>--use-frm</code></th>
<td>Para operações de reparo em tabelas MyISAM</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--user</code></th>
<td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--verbose</code></th>
<td>Verbose mode</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--version</code></th>
<td>Exibir informações da versão e sair</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--write-binlog</code></th>
<td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td>
<td></td>
<td></td>
</tr>
</tbody>
</table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Exibir uma mensagem de ajuda e sair.

* `--all-databases`, `-A`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>

Verifique todas as tabelas em todos os bancos de dados. Isso é o mesmo que usar a opção `--databases` e nomear todos os bancos de dados na string de comando, exceto que os bancos de dados `INFORMATION_SCHEMA` e `performance_schema` não são verificados. Eles podem ser verificados explicitamente nomeando-os com a opção `--databases`.

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

O diretório onde os conjuntos de caracteres são instalados. Veja a Seção 10.15, “Configuração de Conjunto de Caracteres”.

* `--check`, `-c`

  <table frame="box" rules="all" summary="Properties for check"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--check</code></td> </tr></tbody></table>

Verifique as tabelas em busca de erros. Essa é a operação padrão.

* `--check-only-changed`, `-C`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck.">
<col style="width: 27%"/>
<col style="width: 50%"/>
<col style="width: 11%"/>
<col style="width: 11%"/>
<thead>
<tr>
<th>Option Name</th>
<th>Description</th>
<th>Introduced</th>
<th>Deprecated</th>
</tr>
</thead>
<tbody>
<tr>
<th><code>--all-databases</code></th>
<td>Verifique todas as tabelas em todos os bancos de dados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--all-in-1</code></th>
<td>Execute uma única declaração para cada banco de dados que nomeia todas as tabelas desse banco de dados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--analyze</code></th>
<td>Analyze the tables</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--auto-repair</code></th>
<td>Se uma tabela verificada estiver corrompida, corrija-a automaticamente</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--bind-address</code></th>
<td>Use a interface de rede especificada para se conectar ao servidor MySQL</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--character-sets-dir</code></th>
<td>Diretório onde os conjuntos de caracteres são instalados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--check</code></th>
<td>Verifique as tabelas em busca de erros</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--check-only-changed</code></th>
<td>Verifique apenas as tabelas que foram alteradas desde a última verificação</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--check-upgrade</code></th>
<td>Invoque a consulta CHECK TABLE com a opção FOR UPGRADE</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--compress</code></th>
<td>Compressar todas as informações enviadas entre o cliente e o servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--databases</code></th>
<td>Interprete todos os argumentos como nomes de banco de dados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug</code></th>
<td>Write debugging log</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug-check</code></th>
<td>Imprimir informações de depuração quando o programa sai</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug-info</code></th>
<td>Imprimir informações de depuração, memória e estatísticas de CPU quando o programa sai</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--default-auth</code></th>
<td>Plugin de autenticação a ser utilizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--default-character-set</code></th>
<td>Especificar o conjunto de caracteres padrão</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-extra-file</code></th>
<td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-file</code></th>
<td>Arquivo de opção de leitura apenas nomeado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-group-suffix</code></th>
<td>Valor do sufixo do grupo de opções</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--enable-cleartext-plugin</code></th>
<td>Enable cleartext authentication plugin</td>
<td>5.7.10</td>
<td></td>
</tr>
<tr>
<th><code>--extended</code></th>
<td>Verifique e conserte mesas</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--fast</code></th>
<td>Verifique apenas as tabelas que não foram fechadas corretamente</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--fix-db-names</code></th>
<td>Converta os nomes dos bancos de dados para o formato 5.1</td>
<td></td>
<td>Sim</td>
</tr>
<tr>
<th><code>--fix-table-names</code></th>
<td>Converta os nomes das tabelas para o formato 5.1</td>
<td></td>
<td>Sim</td>
</tr>
<tr>
<th><code>--force</code></th>
<td>Continue mesmo que ocorra um erro SQL</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--get-server-public-key</code></th>
<td>Solicitar chave pública RSA do servidor</td>
<td>5.7.23</td>
<td></td>
</tr>
<tr>
<th><code>--help</code></th>
<td>Exibir mensagem de ajuda e sair</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--host</code></th>
<td>Anfitrião no qual o servidor MySQL está localizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--login-path</code></th>
<td>Leia as opções de caminho de login a partir de .mylogin.cnf</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--medium-check</code></th>
<td>Faça uma verificação que seja mais rápida do que uma operação --extended</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--no-defaults</code></th>
<td>Não leia arquivos de opção</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--optimize</code></th>
<td>Optimize the tables</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--password</code></th>
<td>Senha para usar ao se conectar ao servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--pipe</code></th>
<td>Conecte-se ao servidor usando um pipe nomeado (apenas Windows)</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--plugin-dir</code></th>
<td>Diretório onde os plugins são instalados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--port</code></th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--print-defaults</code></th>
<td>Print default options</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--protocol</code></th>
<td>Protocolo de transporte a ser utilizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--quick</code></th>
<td>O método mais rápido de verificação</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--repair</code></th>
<td>Realize uma reparação que possa consertar quase tudo, exceto chaves únicas que não são únicas</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--secure-auth</code></th>
<td>Não envie senhas para o servidor no formato antigo (pré-4.1)</td>
<td></td>
<td>Sim</td>
</tr>
<tr>
<th><code>--server-public-key-path</code></th>
<td>Nome do caminho para o arquivo que contém a chave pública RSA</td>
<td>5.7.23</td>
<td></td>
</tr>
<tr>
<th><code>--shared-memory-base-name</code></th>
<td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--silent</code></th>
<td>Silent mode</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--skip-database</code></th>
<td>Omitar este banco de dados das operações realizadas</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--socket</code></th>
<td>Arquivo de socket Unix ou pipe nomeado do Windows a ser usado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl</code></th>
<td>Enable connection encryption</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-ca</code></th>
<td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-capath</code></th>
<td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-cert</code></th>
<td>Arquivo que contém o certificado X.509</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-cipher</code></th>
<td>Cifras permitidas para criptografia de conexão</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-crl</code></th>
<td>Arquivo que contém listas de revogação de certificados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-crlpath</code></th>
<td>Diretório que contém arquivos de lista de revogação de certificados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-key</code></th>
<td>Arquivo que contém a chave X.509</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-mode</code></th>
<td>Estado de segurança desejado da conexão com o servidor</td>
<td>5.7.11</td>
<td></td>
</tr>
<tr>
<th><code>--ssl-verify-server-cert</code></th>
<td>Verifique o nome do host contra a identidade do Nome comum do certificado do servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--tables</code></th>
<td>Supra a opção --databases ou -B</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--tls-version</code></th>
<td>Protocolos TLS permitidos para conexões criptografadas</td>
<td>5.7.10</td>
<td></td>
</tr>
<tr>
<th><code>--use-frm</code></th>
<td>Para operações de reparo em tabelas MyISAM</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--user</code></th>
<td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--verbose</code></th>
<td>Verbose mode</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--version</code></th>
<td>Exibir informações da versão e sair</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--write-binlog</code></th>
<td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td>
<td></td>
<td></td>
</tr>
</tbody>
</table>

Verifique apenas as tabelas que foram alteradas desde a última verificação ou que não foram fechadas corretamente.

* `--check-upgrade`, `-g`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck.">
<col style="width: 27%"/>
<col style="width: 50%"/>
<col style="width: 11%"/>
<col style="width: 11%"/>
<thead>
<tr>
<th>Option Name</th>
<th>Description</th>
<th>Introduced</th>
<th>Deprecated</th>
</tr>
</thead>
<tbody>
<tr>
<th><code>--all-databases</code></th>
<td>Verifique todas as tabelas em todos os bancos de dados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--all-in-1</code></th>
<td>Execute uma única declaração para cada banco de dados que nomeia todas as tabelas desse banco de dados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--analyze</code></th>
<td>Analyze the tables</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--auto-repair</code></th>
<td>Se uma tabela verificada estiver corrompida, corrija-a automaticamente</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--bind-address</code></th>
<td>Use a interface de rede especificada para se conectar ao servidor MySQL</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--character-sets-dir</code></th>
<td>Diretório onde os conjuntos de caracteres são instalados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--check</code></th>
<td>Verifique as tabelas em busca de erros</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--check-only-changed</code></th>
<td>Verifique apenas as tabelas que foram alteradas desde a última verificação</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--check-upgrade</code></th>
<td>Invoque a consulta CHECK TABLE com a opção FOR UPGRADE</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--compress</code></th>
<td>Compressar todas as informações enviadas entre o cliente e o servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--databases</code></th>
<td>Interprete todos os argumentos como nomes de banco de dados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug</code></th>
<td>Write debugging log</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug-check</code></th>
<td>Imprimir informações de depuração quando o programa sai</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug-info</code></th>
<td>Imprimir informações de depuração, memória e estatísticas de CPU quando o programa sai</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--default-auth</code></th>
<td>Plugin de autenticação a ser utilizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--default-character-set</code></th>
<td>Especificar o conjunto de caracteres padrão</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-extra-file</code></th>
<td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-file</code></th>
<td>Arquivo de opção de leitura apenas nomeado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-group-suffix</code></th>
<td>Valor do sufixo do grupo de opções</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--enable-cleartext-plugin</code></th>
<td>Enable cleartext authentication plugin</td>
<td>5.7.10</td>
<td></td>
</tr>
<tr>
<th><code>--extended</code></th>
<td>Verifique e conserte mesas</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--fast</code></th>
<td>Verifique apenas as tabelas que não foram fechadas corretamente</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--fix-db-names</code></th>
<td>Converta os nomes dos bancos de dados para o formato 5.1</td>
<td></td>
<td>Sim</td>
</tr>
<tr>
<th><code>--fix-table-names</code></th>
<td>Converta os nomes das tabelas para o formato 5.1</td>
<td></td>
<td>Sim</td>
</tr>
<tr>
<th><code>--force</code></th>
<td>Continue mesmo que ocorra um erro SQL</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--get-server-public-key</code></th>
<td>Solicitar chave pública RSA do servidor</td>
<td>5.7.23</td>
<td></td>
</tr>
<tr>
<th><code>--help</code></th>
<td>Exibir mensagem de ajuda e sair</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--host</code></th>
<td>Anfitrião no qual o servidor MySQL está localizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--login-path</code></th>
<td>Leia as opções de caminho de login a partir de .mylogin.cnf</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--medium-check</code></th>
<td>Faça uma verificação que seja mais rápida do que uma operação --extended</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--no-defaults</code></th>
<td>Não leia arquivos de opção</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--optimize</code></th>
<td>Optimize the tables</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--password</code></th>
<td>Senha para usar ao se conectar ao servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--pipe</code></th>
<td>Conecte-se ao servidor usando um pipe nomeado (apenas Windows)</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--plugin-dir</code></th>
<td>Diretório onde os plugins são instalados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--port</code></th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--print-defaults</code></th>
<td>Print default options</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--protocol</code></th>
<td>Protocolo de transporte a ser utilizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--quick</code></th>
<td>O método mais rápido de verificação</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--repair</code></th>
<td>Realize uma reparação que possa consertar quase tudo, exceto chaves únicas que não são únicas</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--secure-auth</code></th>
<td>Não envie senhas para o servidor no formato antigo (pré-4.1)</td>
<td></td>
<td>Sim</td>
</tr>
<tr>
<th><code>--server-public-key-path</code></th>
<td>Nome do caminho para o arquivo que contém a chave pública RSA</td>
<td>5.7.23</td>
<td></td>
</tr>
<tr>
<th><code>--shared-memory-base-name</code></th>
<td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--silent</code></th>
<td>Silent mode</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--skip-database</code></th>
<td>Omitar este banco de dados das operações realizadas</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--socket</code></th>
<td>Arquivo de socket Unix ou pipe nomeado do Windows a ser usado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl</code></th>
<td>Enable connection encryption</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-ca</code></th>
<td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-capath</code></th>
<td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-cert</code></th>
<td>Arquivo que contém o certificado X.509</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-cipher</code></th>
<td>Cifras permitidas para criptografia de conexão</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-crl</code></th>
<td>Arquivo que contém listas de revogação de certificados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-crlpath</code></th>
<td>Diretório que contém arquivos de lista de revogação de certificados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-key</code></th>
<td>Arquivo que contém a chave X.509</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-mode</code></th>
<td>Estado de segurança desejado da conexão com o servidor</td>
<td>5.7.11</td>
<td></td>
</tr>
<tr>
<th><code>--ssl-verify-server-cert</code></th>
<td>Verifique o nome do host contra a identidade do Nome comum do certificado do servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--tables</code></th>
<td>Supra a opção --databases ou -B</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--tls-version</code></th>
<td>Protocolos TLS permitidos para conexões criptografadas</td>
<td>5.7.10</td>
<td></td>
</tr>
<tr>
<th><code>--use-frm</code></th>
<td>Para operações de reparo em tabelas MyISAM</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--user</code></th>
<td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--verbose</code></th>
<td>Verbose mode</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--version</code></th>
<td>Exibir informações da versão e sair</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--write-binlog</code></th>
<td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td>
<td></td>
<td></td>
</tr>
</tbody>
</table>

Invoque `CHECK TABLE` com a opção `FOR UPGRADE` para verificar as tabelas quanto a incompatibilidades com a versão atual do servidor. Esta opção habilita automaticamente as opções `--fix-db-names` e `--fix-table-names`.

* `--compress`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck.">
<col style="width: 27%"/>
<col style="width: 50%"/>
<col style="width: 11%"/>
<col style="width: 11%"/>
<thead>
<tr>
<th>Option Name</th>
<th>Description</th>
<th>Introduced</th>
<th>Deprecated</th>
</tr>
</thead>
<tbody>
<tr>
<th><code>--all-databases</code></th>
<td>Verifique todas as tabelas em todos os bancos de dados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--all-in-1</code></th>
<td>Execute uma única declaração para cada banco de dados que nomeia todas as tabelas desse banco de dados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--analyze</code></th>
<td>Analyze the tables</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--auto-repair</code></th>
<td>Se uma tabela verificada estiver corrompida, corrija-a automaticamente</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--bind-address</code></th>
<td>Use a interface de rede especificada para se conectar ao servidor MySQL</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--character-sets-dir</code></th>
<td>Diretório onde os conjuntos de caracteres são instalados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--check</code></th>
<td>Verifique as tabelas em busca de erros</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--check-only-changed</code></th>
<td>Verifique apenas as tabelas que foram alteradas desde a última verificação</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--check-upgrade</code></th>
<td>Invoque a consulta CHECK TABLE com a opção FOR UPGRADE</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--compress</code></th>
<td>Compressar todas as informações enviadas entre o cliente e o servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--databases</code></th>
<td>Interprete todos os argumentos como nomes de banco de dados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug</code></th>
<td>Write debugging log</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug-check</code></th>
<td>Imprimir informações de depuração quando o programa sai</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug-info</code></th>
<td>Imprimir informações de depuração, memória e estatísticas de CPU quando o programa sai</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--default-auth</code></th>
<td>Plugin de autenticação a ser utilizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--default-character-set</code></th>
<td>Especificar o conjunto de caracteres padrão</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-extra-file</code></th>
<td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-file</code></th>
<td>Arquivo de opção de leitura apenas nomeado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-group-suffix</code></th>
<td>Valor do sufixo do grupo de opções</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--enable-cleartext-plugin</code></th>
<td>Enable cleartext authentication plugin</td>
<td>5.7.10</td>
<td></td>
</tr>
<tr>
<th><code>--extended</code></th>
<td>Verifique e conserte mesas</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--fast</code></th>
<td>Verifique apenas as tabelas que não foram fechadas corretamente</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--fix-db-names</code></th>
<td>Converta os nomes dos bancos de dados para o formato 5.1</td>
<td></td>
<td>Sim</td>
</tr>
<tr>
<th><code>--fix-table-names</code></th>
<td>Converta os nomes das tabelas para o formato 5.1</td>
<td></td>
<td>Sim</td>
</tr>
<tr>
<th><code>--force</code></th>
<td>Continue mesmo que ocorra um erro SQL</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--get-server-public-key</code></th>
<td>Solicitar chave pública RSA do servidor</td>
<td>5.7.23</td>
<td></td>
</tr>
<tr>
<th><code>--help</code></th>
<td>Exibir mensagem de ajuda e sair</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--host</code></th>
<td>Anfitrião no qual o servidor MySQL está localizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--login-path</code></th>
<td>Leia as opções de caminho de login a partir de .mylogin.cnf</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--medium-check</code></th>
<td>Faça uma verificação que seja mais rápida do que uma operação --extended</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--no-defaults</code></th>
<td>Não leia arquivos de opção</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--optimize</code></th>
<td>Optimize the tables</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--password</code></th>
<td>Senha para usar ao se conectar ao servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--pipe</code></th>
<td>Conecte-se ao servidor usando um pipe nomeado (apenas Windows)</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--plugin-dir</code></th>
<td>Diretório onde os plugins são instalados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--port</code></th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--print-defaults</code></th>
<td>Print default options</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--protocol</code></th>
<td>Protocolo de transporte a ser utilizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--quick</code></th>
<td>O método mais rápido de verificação</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--repair</code></th>
<td>Realize uma reparação que possa consertar quase tudo, exceto chaves únicas que não são únicas</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--secure-auth</code></th>
<td>Não envie senhas para o servidor no formato antigo (pré-4.1)</td>
<td></td>
<td>Sim</td>
</tr>
<tr>
<th><code>--server-public-key-path</code></th>
<td>Nome do caminho para o arquivo que contém a chave pública RSA</td>
<td>5.7.23</td>
<td></td>
</tr>
<tr>
<th><code>--shared-memory-base-name</code></th>
<td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--silent</code></th>
<td>Silent mode</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--skip-database</code></th>
<td>Omitar este banco de dados das operações realizadas</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--socket</code></th>
<td>Arquivo de socket Unix ou pipe nomeado do Windows a ser usado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl</code></th>
<td>Enable connection encryption</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-ca</code></th>
<td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-capath</code></th>
<td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-cert</code></th>
<td>Arquivo que contém o certificado X.509</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-cipher</code></th>
<td>Cifras permitidas para criptografia de conexão</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-crl</code></th>
<td>Arquivo que contém listas de revogação de certificados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-crlpath</code></th>
<td>Diretório que contém arquivos de lista de revogação de certificados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-key</code></th>
<td>Arquivo que contém a chave X.509</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-mode</code></th>
<td>Estado de segurança desejado da conexão com o servidor</td>
<td>5.7.11</td>
<td></td>
</tr>
<tr>
<th><code>--ssl-verify-server-cert</code></th>
<td>Verifique o nome do host contra a identidade do Nome comum do certificado do servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--tables</code></th>
<td>Supra a opção --databases ou -B</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--tls-version</code></th>
<td>Protocolos TLS permitidos para conexões criptografadas</td>
<td>5.7.10</td>
<td></td>
</tr>
<tr>
<th><code>--use-frm</code></th>
<td>Para operações de reparo em tabelas MyISAM</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--user</code></th>
<td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--verbose</code></th>
<td>Verbose mode</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--version</code></th>
<td>Exibir informações da versão e sair</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--write-binlog</code></th>
<td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td>
<td></td>
<td></td>
</tr>
</tbody>
</table>

Compressa todas as informações enviadas entre o cliente e o servidor, se possível. Veja a Seção 4.2.6, “Controle de Compressão de Conexão”.

* `--databases`, `-B`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck.">
<col style="width: 27%"/>
<col style="width: 50%"/>
<col style="width: 11%"/>
<col style="width: 11%"/>
<thead>
<tr>
<th>Option Name</th>
<th>Description</th>
<th>Introduced</th>
<th>Deprecated</th>
</tr>
</thead>
<tbody>
<tr>
<th><code>--all-databases</code></th>
<td>Verifique todas as tabelas em todos os bancos de dados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--all-in-1</code></th>
<td>Execute uma única declaração para cada banco de dados que nomeia todas as tabelas desse banco de dados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--analyze</code></th>
<td>Analyze the tables</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--auto-repair</code></th>
<td>Se uma tabela verificada estiver corrompida, corrija-a automaticamente</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--bind-address</code></th>
<td>Use a interface de rede especificada para se conectar ao servidor MySQL</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--character-sets-dir</code></th>
<td>Diretório onde os conjuntos de caracteres são instalados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--check</code></th>
<td>Verifique as tabelas em busca de erros</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--check-only-changed</code></th>
<td>Verifique apenas as tabelas que foram alteradas desde a última verificação</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--check-upgrade</code></th>
<td>Invoque a consulta CHECK TABLE com a opção FOR UPGRADE</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--compress</code></th>
<td>Compressar todas as informações enviadas entre o cliente e o servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--databases</code></th>
<td>Interprete todos os argumentos como nomes de banco de dados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug</code></th>
<td>Write debugging log</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug-check</code></th>
<td>Imprimir informações de depuração quando o programa sai</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug-info</code></th>
<td>Imprimir informações de depuração, memória e estatísticas de CPU quando o programa sai</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--default-auth</code></th>
<td>Plugin de autenticação a ser utilizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--default-character-set</code></th>
<td>Especificar o conjunto de caracteres padrão</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-extra-file</code></th>
<td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-file</code></th>
<td>Arquivo de opção de leitura apenas nomeado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-group-suffix</code></th>
<td>Valor do sufixo do grupo de opções</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--enable-cleartext-plugin</code></th>
<td>Enable cleartext authentication plugin</td>
<td>5.7.10</td>
<td></td>
</tr>
<tr>
<th><code>--extended</code></th>
<td>Verifique e conserte mesas</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--fast</code></th>
<td>Verifique apenas as tabelas que não foram fechadas corretamente</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--fix-db-names</code></th>
<td>Converta os nomes dos bancos de dados para o formato 5.1</td>
<td></td>
<td>Sim</td>
</tr>
<tr>
<th><code>--fix-table-names</code></th>
<td>Converta os nomes das tabelas para o formato 5.1</td>
<td></td>
<td>Sim</td>
</tr>
<tr>
<th><code>--force</code></th>
<td>Continue mesmo que ocorra um erro SQL</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--get-server-public-key</code></th>
<td>Solicitar chave pública RSA do servidor</td>
<td>5.7.23</td>
<td></td>
</tr>
<tr>
<th><code>--help</code></th>
<td>Exibir mensagem de ajuda e sair</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--host</code></th>
<td>Anfitrião no qual o servidor MySQL está localizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--login-path</code></th>
<td>Leia as opções de caminho de login a partir de .mylogin.cnf</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--medium-check</code></th>
<td>Faça uma verificação que seja mais rápida do que uma operação --extended</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--no-defaults</code></th>
<td>Não leia arquivos de opção</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--optimize</code></th>
<td>Optimize the tables</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--password</code></th>
<td>Senha para usar ao se conectar ao servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--pipe</code></th>
<td>Conecte-se ao servidor usando um pipe nomeado (apenas Windows)</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--plugin-dir</code></th>
<td>Diretório onde os plugins são instalados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--port</code></th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--print-defaults</code></th>
<td>Print default options</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--protocol</code></th>
<td>Protocolo de transporte a ser utilizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--quick</code></th>
<td>O método mais rápido de verificação</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--repair</code></th>
<td>Realize uma reparação que possa consertar quase tudo, exceto chaves únicas que não são únicas</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--secure-auth</code></th>
<td>Não envie senhas para o servidor no formato antigo (pré-4.1)</td>
<td></td>
<td>Sim</td>
</tr>
<tr>
<th><code>--server-public-key-path</code></th>
<td>Nome do caminho para o arquivo que contém a chave pública RSA</td>
<td>5.7.23</td>
<td></td>
</tr>
<tr>
<th><code>--shared-memory-base-name</code></th>
<td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--silent</code></th>
<td>Silent mode</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--skip-database</code></th>
<td>Omitar este banco de dados das operações realizadas</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--socket</code></th>
<td>Arquivo de socket Unix ou pipe nomeado do Windows a ser usado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl</code></th>
<td>Enable connection encryption</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-ca</code></th>
<td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-capath</code></th>
<td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-cert</code></th>
<td>Arquivo que contém o certificado X.509</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-cipher</code></th>
<td>Cifras permitidas para criptografia de conexão</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-crl</code></th>
<td>Arquivo que contém listas de revogação de certificados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-crlpath</code></th>
<td>Diretório que contém arquivos de lista de revogação de certificados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-key</code></th>
<td>Arquivo que contém a chave X.509</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-mode</code></th>
<td>Estado de segurança desejado da conexão com o servidor</td>
<td>5.7.11</td>
<td></td>
</tr>
<tr>
<th><code>--ssl-verify-server-cert</code></th>
<td>Verifique o nome do host contra a identidade do Nome comum do certificado do servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--tables</code></th>
<td>Supra a opção --databases ou -B</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--tls-version</code></th>
<td>Protocolos TLS permitidos para conexões criptografadas</td>
<td>5.7.10</td>
<td></td>
</tr>
<tr>
<th><code>--use-frm</code></th>
<td>Para operações de reparo em tabelas MyISAM</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--user</code></th>
<td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--verbose</code></th>
<td>Verbose mode</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--version</code></th>
<td>Exibir informações da versão e sair</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--write-binlog</code></th>
<td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td>
<td></td>
<td></td>
</tr>
</tbody>
</table>

Processar todas as tabelas nos bancos de dados nomeados. Normalmente, o **mysqlcheck** trata o argumento de nome no comando de string como um nome de banco de dados e quaisquer nomes subsequentes como nomes de tabela. Com esta opção, ele trata todos os argumentos de nome como nomes de banco de dados.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck.">
<col style="width: 27%"/>
<col style="width: 50%"/>
<col style="width: 11%"/>
<col style="width: 11%"/>
<thead>
<tr>
<th>Option Name</th>
<th>Description</th>
<th>Introduced</th>
<th>Deprecated</th>
</tr>
</thead>
<tbody>
<tr>
<th><code>--all-databases</code></th>
<td>Verifique todas as tabelas em todos os bancos de dados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--all-in-1</code></th>
<td>Execute uma única declaração para cada banco de dados que nomeia todas as tabelas desse banco de dados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--analyze</code></th>
<td>Analyze the tables</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--auto-repair</code></th>
<td>Se uma tabela verificada estiver corrompida, corrija-a automaticamente</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--bind-address</code></th>
<td>Use a interface de rede especificada para se conectar ao servidor MySQL</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--character-sets-dir</code></th>
<td>Diretório onde os conjuntos de caracteres são instalados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--check</code></th>
<td>Verifique as tabelas em busca de erros</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--check-only-changed</code></th>
<td>Verifique apenas as tabelas que foram alteradas desde a última verificação</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--check-upgrade</code></th>
<td>Invoque a consulta CHECK TABLE com a opção FOR UPGRADE</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--compress</code></th>
<td>Compressar todas as informações enviadas entre o cliente e o servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--databases</code></th>
<td>Interprete todos os argumentos como nomes de banco de dados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug</code></th>
<td>Write debugging log</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug-check</code></th>
<td>Imprimir informações de depuração quando o programa sai</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug-info</code></th>
<td>Imprimir informações de depuração, memória e estatísticas de CPU quando o programa sai</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--default-auth</code></th>
<td>Plugin de autenticação a ser utilizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--default-character-set</code></th>
<td>Especificar o conjunto de caracteres padrão</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-extra-file</code></th>
<td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-file</code></th>
<td>Arquivo de opção de leitura apenas nomeado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-group-suffix</code></th>
<td>Valor do sufixo do grupo de opções</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--enable-cleartext-plugin</code></th>
<td>Enable cleartext authentication plugin</td>
<td>5.7.10</td>
<td></td>
</tr>
<tr>
<th><code>--extended</code></th>
<td>Verifique e conserte mesas</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--fast</code></th>
<td>Verifique apenas as tabelas que não foram fechadas corretamente</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--fix-db-names</code></th>
<td>Converta os nomes dos bancos de dados para o formato 5.1</td>
<td></td>
<td>Sim</td>
</tr>
<tr>
<th><code>--fix-table-names</code></th>
<td>Converta os nomes das tabelas para o formato 5.1</td>
<td></td>
<td>Sim</td>
</tr>
<tr>
<th><code>--force</code></th>
<td>Continue mesmo que ocorra um erro SQL</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--get-server-public-key</code></th>
<td>Solicitar chave pública RSA do servidor</td>
<td>5.7.23</td>
<td></td>
</tr>
<tr>
<th><code>--help</code></th>
<td>Exibir mensagem de ajuda e sair</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--host</code></th>
<td>Anfitrião no qual o servidor MySQL está localizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--login-path</code></th>
<td>Leia as opções de caminho de login a partir de .mylogin.cnf</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--medium-check</code></th>
<td>Faça uma verificação que seja mais rápida do que uma operação --extended</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--no-defaults</code></th>
<td>Não leia arquivos de opção</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--optimize</code></th>
<td>Optimize the tables</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--password</code></th>
<td>Senha para usar ao se conectar ao servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--pipe</code></th>
<td>Conecte-se ao servidor usando um pipe nomeado (apenas Windows)</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--plugin-dir</code></th>
<td>Diretório onde os plugins são instalados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--port</code></th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--print-defaults</code></th>
<td>Print default options</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--protocol</code></th>
<td>Protocolo de transporte a ser utilizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--quick</code></th>
<td>O método mais rápido de verificação</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--repair</code></th>
<td>Realize uma reparação que possa consertar quase tudo, exceto chaves únicas que não são únicas</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--secure-auth</code></th>
<td>Não envie senhas para o servidor no formato antigo (pré-4.1)</td>
<td></td>
<td>Sim</td>
</tr>
<tr>
<th><code>--server-public-key-path</code></th>
<td>Nome do caminho para o arquivo que contém a chave pública RSA</td>
<td>5.7.23</td>
<td></td>
</tr>
<tr>
<th><code>--shared-memory-base-name</code></th>
<td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--silent</code></th>
<td>Silent mode</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--skip-database</code></th>
<td>Omitar este banco de dados das operações realizadas</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--socket</code></th>
<td>Arquivo de socket Unix ou pipe nomeado do Windows a ser usado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl</code></th>
<td>Enable connection encryption</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-ca</code></th>
<td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-capath</code></th>
<td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-cert</code></th>
<td>Arquivo que contém o certificado X.509</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-cipher</code></th>
<td>Cifras permitidas para criptografia de conexão</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-crl</code></th>
<td>Arquivo que contém listas de revogação de certificados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-crlpath</code></th>
<td>Diretório que contém arquivos de lista de revogação de certificados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-key</code></th>
<td>Arquivo que contém a chave X.509</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-mode</code></th>
<td>Estado de segurança desejado da conexão com o servidor</td>
<td>5.7.11</td>
<td></td>
</tr>
<tr>
<th><code>--ssl-verify-server-cert</code></th>
<td>Verifique o nome do host contra a identidade do Nome comum do certificado do servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--tables</code></th>
<td>Supra a opção --databases ou -B</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--tls-version</code></th>
<td>Protocolos TLS permitidos para conexões criptografadas</td>
<td>5.7.10</td>
<td></td>
</tr>
<tr>
<th><code>--use-frm</code></th>
<td>Para operações de reparo em tabelas MyISAM</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--user</code></th>
<td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--verbose</code></th>
<td>Verbose mode</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--version</code></th>
<td>Exibir informações da versão e sair</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--write-binlog</code></th>
<td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td>
<td></td>
<td></td>
</tr>
</tbody>
</table>

Escreva um registro de depuração. Uma string típica *`debug_options`* é `d:t:o,file_name`. O padrão é `d:t:o`.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--debug-check`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck.">
<col style="width: 27%"/>
<col style="width: 50%"/>
<col style="width: 11%"/>
<col style="width: 11%"/>
<thead>
<tr>
<th>Option Name</th>
<th>Description</th>
<th>Introduced</th>
<th>Deprecated</th>
</tr>
</thead>
<tbody>
<tr>
<th><code>--all-databases</code></th>
<td>Verifique todas as tabelas em todos os bancos de dados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--all-in-1</code></th>
<td>Execute uma única declaração para cada banco de dados que nomeia todas as tabelas desse banco de dados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--analyze</code></th>
<td>Analyze the tables</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--auto-repair</code></th>
<td>Se uma tabela verificada estiver corrompida, corrija-a automaticamente</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--bind-address</code></th>
<td>Use a interface de rede especificada para se conectar ao servidor MySQL</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--character-sets-dir</code></th>
<td>Diretório onde os conjuntos de caracteres são instalados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--check</code></th>
<td>Verifique as tabelas em busca de erros</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--check-only-changed</code></th>
<td>Verifique apenas as tabelas que foram alteradas desde a última verificação</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--check-upgrade</code></th>
<td>Invoque a consulta CHECK TABLE com a opção FOR UPGRADE</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--compress</code></th>
<td>Compressar todas as informações enviadas entre o cliente e o servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--databases</code></th>
<td>Interprete todos os argumentos como nomes de banco de dados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug</code></th>
<td>Write debugging log</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug-check</code></th>
<td>Imprimir informações de depuração quando o programa sai</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug-info</code></th>
<td>Imprimir informações de depuração, memória e estatísticas de CPU quando o programa sai</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--default-auth</code></th>
<td>Plugin de autenticação a ser utilizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--default-character-set</code></th>
<td>Especificar o conjunto de caracteres padrão</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-extra-file</code></th>
<td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-file</code></th>
<td>Arquivo de opção de leitura apenas nomeado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-group-suffix</code></th>
<td>Valor do sufixo do grupo de opções</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--enable-cleartext-plugin</code></th>
<td>Enable cleartext authentication plugin</td>
<td>5.7.10</td>
<td></td>
</tr>
<tr>
<th><code>--extended</code></th>
<td>Verifique e conserte mesas</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--fast</code></th>
<td>Verifique apenas as tabelas que não foram fechadas corretamente</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--fix-db-names</code></th>
<td>Converta os nomes dos bancos de dados para o formato 5.1</td>
<td></td>
<td>Sim</td>
</tr>
<tr>
<th><code>--fix-table-names</code></th>
<td>Converta os nomes das tabelas para o formato 5.1</td>
<td></td>
<td>Sim</td>
</tr>
<tr>
<th><code>--force</code></th>
<td>Continue mesmo que ocorra um erro SQL</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--get-server-public-key</code></th>
<td>Solicitar chave pública RSA do servidor</td>
<td>5.7.23</td>
<td></td>
</tr>
<tr>
<th><code>--help</code></th>
<td>Exibir mensagem de ajuda e sair</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--host</code></th>
<td>Anfitrião no qual o servidor MySQL está localizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--login-path</code></th>
<td>Leia as opções de caminho de login a partir de .mylogin.cnf</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--medium-check</code></th>
<td>Faça uma verificação que seja mais rápida do que uma operação --extended</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--no-defaults</code></th>
<td>Não leia arquivos de opção</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--optimize</code></th>
<td>Optimize the tables</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--password</code></th>
<td>Senha para usar ao se conectar ao servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--pipe</code></th>
<td>Conecte-se ao servidor usando um pipe nomeado (apenas Windows)</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--plugin-dir</code></th>
<td>Diretório onde os plugins são instalados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--port</code></th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--print-defaults</code></th>
<td>Print default options</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--protocol</code></th>
<td>Protocolo de transporte a ser utilizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--quick</code></th>
<td>O método mais rápido de verificação</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--repair</code></th>
<td>Realize uma reparação que possa consertar quase tudo, exceto chaves únicas que não são únicas</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--secure-auth</code></th>
<td>Não envie senhas para o servidor no formato antigo (pré-4.1)</td>
<td></td>
<td>Sim</td>
</tr>
<tr>
<th><code>--server-public-key-path</code></th>
<td>Nome do caminho para o arquivo que contém a chave pública RSA</td>
<td>5.7.23</td>
<td></td>
</tr>
<tr>
<th><code>--shared-memory-base-name</code></th>
<td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--silent</code></th>
<td>Silent mode</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--skip-database</code></th>
<td>Omitar este banco de dados das operações realizadas</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--socket</code></th>
<td>Arquivo de socket Unix ou pipe nomeado do Windows a ser usado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl</code></th>
<td>Enable connection encryption</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-ca</code></th>
<td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-capath</code></th>
<td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-cert</code></th>
<td>Arquivo que contém o certificado X.509</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-cipher</code></th>
<td>Cifras permitidas para criptografia de conexão</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-crl</code></th>
<td>Arquivo que contém listas de revogação de certificados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-crlpath</code></th>
<td>Diretório que contém arquivos de lista de revogação de certificados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-key</code></th>
<td>Arquivo que contém a chave X.509</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-mode</code></th>
<td>Estado de segurança desejado da conexão com o servidor</td>
<td>5.7.11</td>
<td></td>
</tr>
<tr>
<th><code>--ssl-verify-server-cert</code></th>
<td>Verifique o nome do host contra a identidade do Nome comum do certificado do servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--tables</code></th>
<td>Supra a opção --databases ou -B</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--tls-version</code></th>
<td>Protocolos TLS permitidos para conexões criptografadas</td>
<td>5.7.10</td>
<td></td>
</tr>
<tr>
<th><code>--use-frm</code></th>
<td>Para operações de reparo em tabelas MyISAM</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--user</code></th>
<td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--verbose</code></th>
<td>Verbose mode</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--version</code></th>
<td>Exibir informações da versão e sair</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--write-binlog</code></th>
<td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td>
<td></td>
<td></td>
</tr>
</tbody>
</table>

Imprima algumas informações de depuração quando o programa sair.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--debug-info`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck.">
<col style="width: 27%"/>
<col style="width: 50%"/>
<col style="width: 11%"/>
<col style="width: 11%"/>
<thead>
<tr>
<th>Option Name</th>
<th>Description</th>
<th>Introduced</th>
<th>Deprecated</th>
</tr>
</thead>
<tbody>
<tr>
<th><code>--all-databases</code></th>
<td>Verifique todas as tabelas em todos os bancos de dados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--all-in-1</code></th>
<td>Execute uma única declaração para cada banco de dados que nomeia todas as tabelas desse banco de dados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--analyze</code></th>
<td>Analyze the tables</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--auto-repair</code></th>
<td>Se uma tabela verificada estiver corrompida, corrija-a automaticamente</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--bind-address</code></th>
<td>Use a interface de rede especificada para se conectar ao servidor MySQL</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--character-sets-dir</code></th>
<td>Diretório onde os conjuntos de caracteres são instalados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--check</code></th>
<td>Verifique as tabelas em busca de erros</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--check-only-changed</code></th>
<td>Verifique apenas as tabelas que foram alteradas desde a última verificação</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--check-upgrade</code></th>
<td>Invoque a consulta CHECK TABLE com a opção FOR UPGRADE</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--compress</code></th>
<td>Compressar todas as informações enviadas entre o cliente e o servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--databases</code></th>
<td>Interprete todos os argumentos como nomes de banco de dados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug</code></th>
<td>Write debugging log</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug-check</code></th>
<td>Imprimir informações de depuração quando o programa sai</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug-info</code></th>
<td>Imprimir informações de depuração, memória e estatísticas de CPU quando o programa sai</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--default-auth</code></th>
<td>Plugin de autenticação a ser utilizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--default-character-set</code></th>
<td>Especificar o conjunto de caracteres padrão</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-extra-file</code></th>
<td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-file</code></th>
<td>Arquivo de opção de leitura apenas nomeado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-group-suffix</code></th>
<td>Valor do sufixo do grupo de opções</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--enable-cleartext-plugin</code></th>
<td>Enable cleartext authentication plugin</td>
<td>5.7.10</td>
<td></td>
</tr>
<tr>
<th><code>--extended</code></th>
<td>Verifique e conserte mesas</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--fast</code></th>
<td>Verifique apenas as tabelas que não foram fechadas corretamente</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--fix-db-names</code></th>
<td>Converta os nomes dos bancos de dados para o formato 5.1</td>
<td></td>
<td>Sim</td>
</tr>
<tr>
<th><code>--fix-table-names</code></th>
<td>Converta os nomes das tabelas para o formato 5.1</td>
<td></td>
<td>Sim</td>
</tr>
<tr>
<th><code>--force</code></th>
<td>Continue mesmo que ocorra um erro SQL</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--get-server-public-key</code></th>
<td>Solicitar chave pública RSA do servidor</td>
<td>5.7.23</td>
<td></td>
</tr>
<tr>
<th><code>--help</code></th>
<td>Exibir mensagem de ajuda e sair</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--host</code></th>
<td>Anfitrião no qual o servidor MySQL está localizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--login-path</code></th>
<td>Leia as opções de caminho de login a partir de .mylogin.cnf</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--medium-check</code></th>
<td>Faça uma verificação que seja mais rápida do que uma operação --extended</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--no-defaults</code></th>
<td>Não leia arquivos de opção</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--optimize</code></th>
<td>Optimize the tables</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--password</code></th>
<td>Senha para usar ao se conectar ao servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--pipe</code></th>
<td>Conecte-se ao servidor usando um pipe nomeado (apenas Windows)</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--plugin-dir</code></th>
<td>Diretório onde os plugins são instalados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--port</code></th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--print-defaults</code></th>
<td>Print default options</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--protocol</code></th>
<td>Protocolo de transporte a ser utilizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--quick</code></th>
<td>O método mais rápido de verificação</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--repair</code></th>
<td>Realize uma reparação que possa consertar quase tudo, exceto chaves únicas que não são únicas</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--secure-auth</code></th>
<td>Não envie senhas para o servidor no formato antigo (pré-4.1)</td>
<td></td>
<td>Sim</td>
</tr>
<tr>
<th><code>--server-public-key-path</code></th>
<td>Nome do caminho para o arquivo que contém a chave pública RSA</td>
<td>5.7.23</td>
<td></td>
</tr>
<tr>
<th><code>--shared-memory-base-name</code></th>
<td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--silent</code></th>
<td>Silent mode</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--skip-database</code></th>
<td>Omitar este banco de dados das operações realizadas</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--socket</code></th>
<td>Arquivo de socket Unix ou pipe nomeado do Windows a ser usado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl</code></th>
<td>Enable connection encryption</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-ca</code></th>
<td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-capath</code></th>
<td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-cert</code></th>
<td>Arquivo que contém o certificado X.509</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-cipher</code></th>
<td>Cifras permitidas para criptografia de conexão</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-crl</code></th>
<td>Arquivo que contém listas de revogação de certificados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-crlpath</code></th>
<td>Diretório que contém arquivos de lista de revogação de certificados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-key</code></th>
<td>Arquivo que contém a chave X.509</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-mode</code></th>
<td>Estado de segurança desejado da conexão com o servidor</td>
<td>5.7.11</td>
<td></td>
</tr>
<tr>
<th><code>--ssl-verify-server-cert</code></th>
<td>Verifique o nome do host contra a identidade do Nome comum do certificado do servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--tables</code></th>
<td>Supra a opção --databases ou -B</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--tls-version</code></th>
<td>Protocolos TLS permitidos para conexões criptografadas</td>
<td>5.7.10</td>
<td></td>
</tr>
<tr>
<th><code>--use-frm</code></th>
<td>Para operações de reparo em tabelas MyISAM</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--user</code></th>
<td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--verbose</code></th>
<td>Verbose mode</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--version</code></th>
<td>Exibir informações da versão e sair</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--write-binlog</code></th>
<td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td>
<td></td>
<td></td>
</tr>
</tbody>
</table>

Imprimir informações de depuração e estatísticas de uso de memória e CPU quando o programa sai.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--default-character-set=charset_name`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck.">
<col style="width: 27%"/>
<col style="width: 50%"/>
<col style="width: 11%"/>
<col style="width: 11%"/>
<thead>
<tr>
<th>Option Name</th>
<th>Description</th>
<th>Introduced</th>
<th>Deprecated</th>
</tr>
</thead>
<tbody>
<tr>
<th><code>--all-databases</code></th>
<td>Verifique todas as tabelas em todos os bancos de dados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--all-in-1</code></th>
<td>Execute uma única declaração para cada banco de dados que nomeia todas as tabelas desse banco de dados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--analyze</code></th>
<td>Analyze the tables</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--auto-repair</code></th>
<td>Se uma tabela verificada estiver corrompida, corrija-a automaticamente</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--bind-address</code></th>
<td>Use a interface de rede especificada para se conectar ao servidor MySQL</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--character-sets-dir</code></th>
<td>Diretório onde os conjuntos de caracteres são instalados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--check</code></th>
<td>Verifique as tabelas em busca de erros</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--check-only-changed</code></th>
<td>Verifique apenas as tabelas que foram alteradas desde a última verificação</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--check-upgrade</code></th>
<td>Invoque a consulta CHECK TABLE com a opção FOR UPGRADE</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--compress</code></th>
<td>Compressar todas as informações enviadas entre o cliente e o servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--databases</code></th>
<td>Interprete todos os argumentos como nomes de banco de dados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug</code></th>
<td>Write debugging log</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug-check</code></th>
<td>Imprimir informações de depuração quando o programa sai</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug-info</code></th>
<td>Imprimir informações de depuração, memória e estatísticas de CPU quando o programa sai</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--default-auth</code></th>
<td>Plugin de autenticação a ser utilizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--default-character-set</code></th>
<td>Especificar o conjunto de caracteres padrão</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-extra-file</code></th>
<td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-file</code></th>
<td>Arquivo de opção de leitura apenas nomeado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-group-suffix</code></th>
<td>Valor do sufixo do grupo de opções</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--enable-cleartext-plugin</code></th>
<td>Enable cleartext authentication plugin</td>
<td>5.7.10</td>
<td></td>
</tr>
<tr>
<th><code>--extended</code></th>
<td>Verifique e conserte mesas</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--fast</code></th>
<td>Verifique apenas as tabelas que não foram fechadas corretamente</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--fix-db-names</code></th>
<td>Converta os nomes dos bancos de dados para o formato 5.1</td>
<td></td>
<td>Sim</td>
</tr>
<tr>
<th><code>--fix-table-names</code></th>
<td>Converta os nomes das tabelas para o formato 5.1</td>
<td></td>
<td>Sim</td>
</tr>
<tr>
<th><code>--force</code></th>
<td>Continue mesmo que ocorra um erro SQL</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--get-server-public-key</code></th>
<td>Solicitar chave pública RSA do servidor</td>
<td>5.7.23</td>
<td></td>
</tr>
<tr>
<th><code>--help</code></th>
<td>Exibir mensagem de ajuda e sair</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--host</code></th>
<td>Anfitrião no qual o servidor MySQL está localizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--login-path</code></th>
<td>Leia as opções de caminho de login a partir de .mylogin.cnf</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--medium-check</code></th>
<td>Faça uma verificação que seja mais rápida do que uma operação --extended</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--no-defaults</code></th>
<td>Não leia arquivos de opção</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--optimize</code></th>
<td>Optimize the tables</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--password</code></th>
<td>Senha para usar ao se conectar ao servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--pipe</code></th>
<td>Conecte-se ao servidor usando um pipe nomeado (apenas Windows)</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--plugin-dir</code></th>
<td>Diretório onde os plugins são instalados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--port</code></th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--print-defaults</code></th>
<td>Print default options</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--protocol</code></th>
<td>Protocolo de transporte a ser utilizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--quick</code></th>
<td>O método mais rápido de verificação</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--repair</code></th>
<td>Realize uma reparação que possa consertar quase tudo, exceto chaves únicas que não são únicas</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--secure-auth</code></th>
<td>Não envie senhas para o servidor no formato antigo (pré-4.1)</td>
<td></td>
<td>Sim</td>
</tr>
<tr>
<th><code>--server-public-key-path</code></th>
<td>Nome do caminho para o arquivo que contém a chave pública RSA</td>
<td>5.7.23</td>
<td></td>
</tr>
<tr>
<th><code>--shared-memory-base-name</code></th>
<td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--silent</code></th>
<td>Silent mode</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--skip-database</code></th>
<td>Omitar este banco de dados das operações realizadas</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--socket</code></th>
<td>Arquivo de socket Unix ou pipe nomeado do Windows a ser usado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl</code></th>
<td>Enable connection encryption</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-ca</code></th>
<td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-capath</code></th>
<td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-cert</code></th>
<td>Arquivo que contém o certificado X.509</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-cipher</code></th>
<td>Cifras permitidas para criptografia de conexão</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-crl</code></th>
<td>Arquivo que contém listas de revogação de certificados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-crlpath</code></th>
<td>Diretório que contém arquivos de lista de revogação de certificados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-key</code></th>
<td>Arquivo que contém a chave X.509</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-mode</code></th>
<td>Estado de segurança desejado da conexão com o servidor</td>
<td>5.7.11</td>
<td></td>
</tr>
<tr>
<th><code>--ssl-verify-server-cert</code></th>
<td>Verifique o nome do host contra a identidade do Nome comum do certificado do servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--tables</code></th>
<td>Supra a opção --databases ou -B</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--tls-version</code></th>
<td>Protocolos TLS permitidos para conexões criptografadas</td>
<td>5.7.10</td>
<td></td>
</tr>
<tr>
<th><code>--use-frm</code></th>
<td>Para operações de reparo em tabelas MyISAM</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--user</code></th>
<td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--verbose</code></th>
<td>Verbose mode</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--version</code></th>
<td>Exibir informações da versão e sair</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--write-binlog</code></th>
<td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td>
<td></td>
<td></td>
</tr>
</tbody>
</table>

Use *`charset_name`* como o conjunto de caracteres padrão. Veja a Seção 10.15, “Configuração do Conjunto de Caracteres”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck.">
<col style="width: 27%"/>
<col style="width: 50%"/>
<col style="width: 11%"/>
<col style="width: 11%"/>
<thead>
<tr>
<th>Option Name</th>
<th>Description</th>
<th>Introduced</th>
<th>Deprecated</th>
</tr>
</thead>
<tbody>
<tr>
<th><code>--all-databases</code></th>
<td>Verifique todas as tabelas em todos os bancos de dados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--all-in-1</code></th>
<td>Execute uma única declaração para cada banco de dados que nomeia todas as tabelas desse banco de dados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--analyze</code></th>
<td>Analyze the tables</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--auto-repair</code></th>
<td>Se uma tabela verificada estiver corrompida, corrija-a automaticamente</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--bind-address</code></th>
<td>Use a interface de rede especificada para se conectar ao servidor MySQL</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--character-sets-dir</code></th>
<td>Diretório onde os conjuntos de caracteres são instalados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--check</code></th>
<td>Verifique as tabelas em busca de erros</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--check-only-changed</code></th>
<td>Verifique apenas as tabelas que foram alteradas desde a última verificação</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--check-upgrade</code></th>
<td>Invoque a consulta CHECK TABLE com a opção FOR UPGRADE</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--compress</code></th>
<td>Compressar todas as informações enviadas entre o cliente e o servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--databases</code></th>
<td>Interprete todos os argumentos como nomes de banco de dados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug</code></th>
<td>Write debugging log</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug-check</code></th>
<td>Imprimir informações de depuração quando o programa sai</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug-info</code></th>
<td>Imprimir informações de depuração, memória e estatísticas de CPU quando o programa sai</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--default-auth</code></th>
<td>Plugin de autenticação a ser utilizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--default-character-set</code></th>
<td>Especificar o conjunto de caracteres padrão</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-extra-file</code></th>
<td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-file</code></th>
<td>Arquivo de opção de leitura apenas nomeado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-group-suffix</code></th>
<td>Valor do sufixo do grupo de opções</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--enable-cleartext-plugin</code></th>
<td>Enable cleartext authentication plugin</td>
<td>5.7.10</td>
<td></td>
</tr>
<tr>
<th><code>--extended</code></th>
<td>Verifique e conserte mesas</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--fast</code></th>
<td>Verifique apenas as tabelas que não foram fechadas corretamente</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--fix-db-names</code></th>
<td>Converta os nomes dos bancos de dados para o formato 5.1</td>
<td></td>
<td>Sim</td>
</tr>
<tr>
<th><code>--fix-table-names</code></th>
<td>Converta os nomes das tabelas para o formato 5.1</td>
<td></td>
<td>Sim</td>
</tr>
<tr>
<th><code>--force</code></th>
<td>Continue mesmo que ocorra um erro SQL</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--get-server-public-key</code></th>
<td>Solicitar chave pública RSA do servidor</td>
<td>5.7.23</td>
<td></td>
</tr>
<tr>
<th><code>--help</code></th>
<td>Exibir mensagem de ajuda e sair</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--host</code></th>
<td>Anfitrião no qual o servidor MySQL está localizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--login-path</code></th>
<td>Leia as opções de caminho de login a partir de .mylogin.cnf</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--medium-check</code></th>
<td>Faça uma verificação que seja mais rápida do que uma operação --extended</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--no-defaults</code></th>
<td>Não leia arquivos de opção</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--optimize</code></th>
<td>Optimize the tables</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--password</code></th>
<td>Senha para usar ao se conectar ao servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--pipe</code></th>
<td>Conecte-se ao servidor usando um pipe nomeado (apenas Windows)</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--plugin-dir</code></th>
<td>Diretório onde os plugins são instalados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--port</code></th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--print-defaults</code></th>
<td>Print default options</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--protocol</code></th>
<td>Protocolo de transporte a ser utilizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--quick</code></th>
<td>O método mais rápido de verificação</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--repair</code></th>
<td>Realize uma reparação que possa consertar quase tudo, exceto chaves únicas que não são únicas</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--secure-auth</code></th>
<td>Não envie senhas para o servidor no formato antigo (pré-4.1)</td>
<td></td>
<td>Sim</td>
</tr>
<tr>
<th><code>--server-public-key-path</code></th>
<td>Nome do caminho para o arquivo que contém a chave pública RSA</td>
<td>5.7.23</td>
<td></td>
</tr>
<tr>
<th><code>--shared-memory-base-name</code></th>
<td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--silent</code></th>
<td>Silent mode</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--skip-database</code></th>
<td>Omitar este banco de dados das operações realizadas</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--socket</code></th>
<td>Arquivo de socket Unix ou pipe nomeado do Windows a ser usado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl</code></th>
<td>Enable connection encryption</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-ca</code></th>
<td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-capath</code></th>
<td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-cert</code></th>
<td>Arquivo que contém o certificado X.509</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-cipher</code></th>
<td>Cifras permitidas para criptografia de conexão</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-crl</code></th>
<td>Arquivo que contém listas de revogação de certificados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-crlpath</code></th>
<td>Diretório que contém arquivos de lista de revogação de certificados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-key</code></th>
<td>Arquivo que contém a chave X.509</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-mode</code></th>
<td>Estado de segurança desejado da conexão com o servidor</td>
<td>5.7.11</td>
<td></td>
</tr>
<tr>
<th><code>--ssl-verify-server-cert</code></th>
<td>Verifique o nome do host contra a identidade do Nome comum do certificado do servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--tables</code></th>
<td>Supra a opção --databases ou -B</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--tls-version</code></th>
<td>Protocolos TLS permitidos para conexões criptografadas</td>
<td>5.7.10</td>
<td></td>
</tr>
<tr>
<th><code>--use-frm</code></th>
<td>Para operações de reparo em tabelas MyISAM</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--user</code></th>
<td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--verbose</code></th>
<td>Verbose mode</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--version</code></th>
<td>Exibir informações da versão e sair</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--write-binlog</code></th>
<td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td>
<td></td>
<td></td>
</tr>
</tbody>
</table>

Leia este arquivo de opção após o arquivo de opção global, mas (em Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck.">
<col style="width: 27%"/>
<col style="width: 50%"/>
<col style="width: 11%"/>
<col style="width: 11%"/>
<thead>
<tr>
<th>Option Name</th>
<th>Description</th>
<th>Introduced</th>
<th>Deprecated</th>
</tr>
</thead>
<tbody>
<tr>
<th><code>--all-databases</code></th>
<td>Verifique todas as tabelas em todos os bancos de dados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--all-in-1</code></th>
<td>Execute uma única declaração para cada banco de dados que nomeia todas as tabelas desse banco de dados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--analyze</code></th>
<td>Analyze the tables</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--auto-repair</code></th>
<td>Se uma tabela verificada estiver corrompida, corrija-a automaticamente</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--bind-address</code></th>
<td>Use a interface de rede especificada para se conectar ao servidor MySQL</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--character-sets-dir</code></th>
<td>Diretório onde os conjuntos de caracteres são instalados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--check</code></th>
<td>Verifique as tabelas em busca de erros</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--check-only-changed</code></th>
<td>Verifique apenas as tabelas que foram alteradas desde a última verificação</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--check-upgrade</code></th>
<td>Invoque a consulta CHECK TABLE com a opção FOR UPGRADE</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--compress</code></th>
<td>Compressar todas as informações enviadas entre o cliente e o servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--databases</code></th>
<td>Interprete todos os argumentos como nomes de banco de dados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug</code></th>
<td>Write debugging log</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug-check</code></th>
<td>Imprimir informações de depuração quando o programa sai</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug-info</code></th>
<td>Imprimir informações de depuração, memória e estatísticas de CPU quando o programa sai</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--default-auth</code></th>
<td>Plugin de autenticação a ser utilizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--default-character-set</code></th>
<td>Especificar o conjunto de caracteres padrão</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-extra-file</code></th>
<td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-file</code></th>
<td>Arquivo de opção de leitura apenas nomeado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-group-suffix</code></th>
<td>Valor do sufixo do grupo de opções</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--enable-cleartext-plugin</code></th>
<td>Enable cleartext authentication plugin</td>
<td>5.7.10</td>
<td></td>
</tr>
<tr>
<th><code>--extended</code></th>
<td>Verifique e conserte mesas</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--fast</code></th>
<td>Verifique apenas as tabelas que não foram fechadas corretamente</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--fix-db-names</code></th>
<td>Converta os nomes dos bancos de dados para o formato 5.1</td>
<td></td>
<td>Sim</td>
</tr>
<tr>
<th><code>--fix-table-names</code></th>
<td>Converta os nomes das tabelas para o formato 5.1</td>
<td></td>
<td>Sim</td>
</tr>
<tr>
<th><code>--force</code></th>
<td>Continue mesmo que ocorra um erro SQL</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--get-server-public-key</code></th>
<td>Solicitar chave pública RSA do servidor</td>
<td>5.7.23</td>
<td></td>
</tr>
<tr>
<th><code>--help</code></th>
<td>Exibir mensagem de ajuda e sair</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--host</code></th>
<td>Anfitrião no qual o servidor MySQL está localizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--login-path</code></th>
<td>Leia as opções de caminho de login a partir de .mylogin.cnf</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--medium-check</code></th>
<td>Faça uma verificação que seja mais rápida do que uma operação --extended</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--no-defaults</code></th>
<td>Não leia arquivos de opção</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--optimize</code></th>
<td>Optimize the tables</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--password</code></th>
<td>Senha para usar ao se conectar ao servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--pipe</code></th>
<td>Conecte-se ao servidor usando um pipe nomeado (apenas Windows)</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--plugin-dir</code></th>
<td>Diretório onde os plugins são instalados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--port</code></th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--print-defaults</code></th>
<td>Print default options</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--protocol</code></th>
<td>Protocolo de transporte a ser utilizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--quick</code></th>
<td>O método mais rápido de verificação</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--repair</code></th>
<td>Realize uma reparação que possa consertar quase tudo, exceto chaves únicas que não são únicas</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--secure-auth</code></th>
<td>Não envie senhas para o servidor no formato antigo (pré-4.1)</td>
<td></td>
<td>Sim</td>
</tr>
<tr>
<th><code>--server-public-key-path</code></th>
<td>Nome do caminho para o arquivo que contém a chave pública RSA</td>
<td>5.7.23</td>
<td></td>
</tr>
<tr>
<th><code>--shared-memory-base-name</code></th>
<td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--silent</code></th>
<td>Silent mode</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--skip-database</code></th>
<td>Omitar este banco de dados das operações realizadas</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--socket</code></th>
<td>Arquivo de socket Unix ou pipe nomeado do Windows a ser usado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl</code></th>
<td>Enable connection encryption</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-ca</code></th>
<td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-capath</code></th>
<td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-cert</code></th>
<td>Arquivo que contém o certificado X.509</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-cipher</code></th>
<td>Cifras permitidas para criptografia de conexão</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-crl</code></th>
<td>Arquivo que contém listas de revogação de certificados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-crlpath</code></th>
<td>Diretório que contém arquivos de lista de revogação de certificados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-key</code></th>
<td>Arquivo que contém a chave X.509</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-mode</code></th>
<td>Estado de segurança desejado da conexão com o servidor</td>
<td>5.7.11</td>
<td></td>
</tr>
<tr>
<th><code>--ssl-verify-server-cert</code></th>
<td>Verifique o nome do host contra a identidade do Nome comum do certificado do servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--tables</code></th>
<td>Supra a opção --databases ou -B</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--tls-version</code></th>
<td>Protocolos TLS permitidos para conexões criptografadas</td>
<td>5.7.10</td>
<td></td>
</tr>
<tr>
<th><code>--use-frm</code></th>
<td>Para operações de reparo em tabelas MyISAM</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--user</code></th>
<td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--verbose</code></th>
<td>Verbose mode</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--version</code></th>
<td>Exibir informações da versão e sair</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--write-binlog</code></th>
<td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td>
<td></td>
<td></td>
</tr>
</tbody>
</table>

Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Exceção: Mesmo com `--defaults-file`, os programas de cliente leem `.mylogin.cnf`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, **mysqlcheck** normalmente lê os grupos `[client]` e `[mysqlcheck]`. Se esta opção for dada como `--defaults-group-suffix=_other`, **mysqlcheck** também lê os grupos `[client_other]` e `[mysqlcheck_other]`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--extended`, `-e`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Se você estiver usando essa opção para verificar tabelas, isso garante que elas sejam 100% consistentes, mas leva um longo tempo.

Se você estiver usando essa opção para reparar tabelas, ela executa uma reparação estendida que pode não apenas levar um longo tempo para ser executada, mas também pode gerar muitas strings de lixo!

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Veja a Seção 6.2.13, “Autenticação substituível”.

* `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Ative o plugin de autenticação de texto claro `mysql_clear_password`. (Veja a Seção 6.4.1.6, “Autenticação de Texto Claro Plugável do Lado do Cliente”).

Essa opção foi adicionada no MySQL 5.7.10.

* `--fast`, `-F`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Verifique apenas as tabelas que não foram fechadas corretamente.

* `--fix-db-names`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Converta os nomes dos bancos de dados para o formato 5.1. Apenas os nomes dos bancos de dados que contêm caracteres especiais são afetados.

Essa opção é desaconselhada no MySQL 5.7.6; espera-se que ela seja removida em uma versão futura do MySQL. Se for necessário converter nomes de bancos de dados ou tabelas do MySQL 5.0, uma solução é atualizar uma instalação do MySQL 5.0 para o MySQL 5.1 antes de atualizar para uma versão mais recente.

* `--fix-table-names`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Converta os nomes dos quadros para o formato 5.1. Apenas os nomes dos quadros que contêm caracteres especiais são afetados. Esta opção também se aplica a visualizações.

Essa opção é desaconselhada no MySQL 5.7.6; espera-se que ela seja removida em uma versão futura do MySQL. Se for necessário converter nomes de bancos de dados ou tabelas do MySQL 5.0, uma solução é atualizar uma instalação do MySQL 5.0 para o MySQL 5.1 antes de atualizar para uma versão mais recente.

* `--force`, `-f`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Continue mesmo se ocorrer um erro SQL.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Solicitar a chave pública necessária para a troca de senha baseada em par de chaves RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

Para informações sobre o plugin `caching_sha2_password`, consulte a Seção 6.4.1.4, “Cacheamento de Autenticação Alterável SHA-2”.

A opção `--get-server-public-key` foi adicionada no MySQL 5.7.23.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Conecte-se ao servidor MySQL no host fornecido.

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>

Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam para qual servidor MySQL se conectar e qual conta se autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql\_config\_editor**. Veja a Seção 4.6.6, “mysql\_config\_editor — Utilitário de Configuração MySQL”.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--medium-check`, `-m`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>

Faça uma verificação que seja mais rápida do que uma operação `--extended`. Isso encontra apenas 99,99% de todos os erros, o que deve ser suficiente na maioria dos casos.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>

Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para evitar que elas sejam lidas.

A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na string de comando, mesmo quando o `--no-defaults` é usado. Para criar o `.mylogin.cnf`, use o utilitário **mysql\_config\_editor**. Veja a Seção 4.6.6, “mysql\_config\_editor — Ferramenta de Configuração do MySQL”.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--optimize`, `-o`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>

Otimize as tabelas.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>

A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysqlcheck** solicita uma senha. Se for fornecida, não deve haver *espaço* entre `--password=` ou `-p` e a senha que a segue. Se não for especificado nenhum tipo de senha, o padrão é não enviar senha.

Especificar uma senha na string de comando deve ser considerado inseguro. Para evitar fornecer a senha na string de comando, use um arquivo de opção. Consulte a Seção 6.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

Para especificar explicitamente que não há senha e que o **mysqlcheck** não deve solicitar uma senha, use a opção `--skip-password`.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>

Em Windows, conecte-se ao servidor usando um pipe nomeado. Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por pipe nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>

O diretório onde procurar plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o **mysqlcheck** não o encontrar. Veja a Seção 6.2.13, “Autenticação Conectada”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>

Para conexões TCP/IP, o número de porta a ser utilizado.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>

Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>

O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de outro protocolo que não o desejado. Para obter detalhes sobre os valores permitidos, consulte a Seção 4.2.5, “Protocolos de Transporte de Conexão”.

* `--quick`, `-q`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-in-1</code></td> </tr></tbody></table>

Se você estiver usando essa opção para verificar tabelas, isso impede que a verificação analise as strings para verificar links incorretos. Esse é o método de verificação mais rápido.

Se você estiver usando essa opção para reparar tabelas, ela tenta reparar apenas a árvore de índice. Esse é o método de reparo mais rápido.

* `--repair`, `-r`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-in-1</code></td> </tr></tbody></table>

Realize uma reparação que possa consertar quase tudo, exceto chaves únicas que não são únicas.

* `--secure-auth`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-in-1</code></td> </tr></tbody></table>

Não envie senhas para o servidor no formato antigo (pré-4.1). Isso impede conexões, exceto para servidores que usam o formato de senha mais recente.

A partir do MySQL 5.7.5, essa opção é desatualizada; espere que ela seja removida em um lançamento futuro do MySQL. Ela está sempre habilitada e tentar desabilitá-la (`--skip-secure-auth`, `--secure-auth=0`) produz um erro. Antes do MySQL 5.7.5, essa opção está habilitada por padrão, mas pode ser desabilitada.

Nota

As senhas que utilizam o método de hashing pré-4.1 são menos seguras do que as senhas que utilizam o método nativo de hashing de senha e devem ser evitadas. As senhas pré-4.1 são desaconselhadas e o suporte para elas foi removido no MySQL 5.7.5. Para instruções de atualização de conta, consulte a Seção 6.4.1.3, “Migrando para fora do hashing de senha pré-4.1 e do plugin mysql\_old\_password”.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-in-1</code></td> </tr></tbody></table>

O nome do caminho de um arquivo em formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senha com base em par de chave RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

Para `sha256_password`, esta opção só se aplica se o MySQL foi construído usando OpenSSL.

Para informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 6.4.1.5, “Autenticação substituível SHA-256”, e a Seção 6.4.1.4, “Cache de autenticação substituível SHA-2”.

A opção `--server-public-key-path` foi adicionada no MySQL 5.7.23.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-in-1</code></td> </tr></tbody></table>

Em Windows, o nome de memória compartilhada a ser usado para conexões feitas usando memória compartilhada a um servidor local. O valor padrão é `MYSQL`. O nome de memória compartilhada é sensível a maiúsculas e minúsculas.

Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

* `--silent`, `-s`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-in-1</code></td> </tr></tbody></table>

Modo silencioso. Imprima apenas as mensagens de erro.

* `--skip-database=db_name`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-in-1</code></td> </tr></tbody></table>6

Não inclua o banco de dados nomeado (sensível a maiúsculas e minúsculas) nas operações realizadas pelo **mysqlcheck**.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-in-1</code></td> </tr></tbody></table>

Para conexões a `localhost`, o arquivo de socket Unix a ser usado, ou, no Windows, o nome do pipe nomeado a ser usado.

Em Windows, esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de canal nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--ssl*`

As opções que começam com `--ssl` especificam se deve conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Consulte Opções de comando para conexões criptografadas.

* `--tables`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-in-1</code></td> </tr></tbody></table>

Supraponha a opção `--databases` ou `-B`. Todos os argumentos de nome que seguem a opção são considerados como nomes de tabela.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-in-1</code></td> </tr></tbody></table>

Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolo separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 6.3.2, “Protocolos e cifras TLS de conexão criptografada”.

Essa opção foi adicionada no MySQL 5.7.10.

* `--use-frm`

  <table frame="box" rules="all" summary="Properties for analyze"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--analyze</code></td> </tr></tbody></table>

Para operações de reparo em tabelas de `MyISAM`, obtenha a estrutura da tabela do arquivo [[`.frm`], para que a tabela possa ser reparada mesmo que o cabeçalho `.MYI` esteja corrompido.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for analyze"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--analyze</code></td> </tr></tbody></table>

O nome de usuário da conta MySQL a ser usado para se conectar ao servidor.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for analyze"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--analyze</code></td> </tr></tbody></table>

Modo detalhado. Imprima informações sobre as várias etapas da operação do programa.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for analyze"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--analyze</code></td> </tr></tbody></table>

Exibir informações da versão e sair.

* `--write-binlog`

  <table frame="box" rules="all" summary="Properties for analyze"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--analyze</code></td> </tr></tbody></table>

Esta opção é ativada por padrão, para que as declarações `ANALYZE TABLE`, `OPTIMIZE TABLE` e `REPAIR TABLE` geradas pelo **mysqlcheck** sejam escritas no log binário. Use `--skip-write-binlog` para fazer com que `NO_WRITE_TO_BINLOG` seja adicionado às declarações para que elas não sejam registradas. Use o `--skip-write-binlog` quando essas declarações não devem ser enviadas para réplicas ou executadas ao usar os logs binários para recuperação a partir de backup.

### 4.5.4 mysqldump — Um programa de backup de banco de dados

A ferramenta de cliente **mysqldump** realiza backups lógicos, produzindo um conjunto de declarações SQL que podem ser executadas para reproduzir as definições originais dos objetos do banco de dados e os dados das tabelas. Ela descarrega um ou mais bancos de dados MySQL para backup ou transferência para outro servidor SQL. O comando **mysqldump** também pode gerar saída em formato CSV, outro texto delimitado ou XML.

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

O **mysqldump** requer pelo menos o privilégio `SELECT` para tabelas descarregadas, `SHOW VIEW` para visualizações descarregadas, `TRIGGER` para gatilhos descarregados, `LOCK TABLES` se a opção `--single-transaction` não for usada, e (a partir do MySQL 5.7.31) `PROCESS` se a opção `--no-tablespaces` não for usada. Algumas opções podem exigir outros privilégios, conforme indicado nas descrições das opções.

Para recarregar um arquivo de depuração, você deve ter os privilégios necessários para executar as declarações que ele contém, como os privilégios apropriados `CREATE` para objetos criados por essas declarações.

A saída do **mysqldump** pode incluir declarações `ALTER DATABASE` que alteram a codificação da base de dados. Essas podem ser usadas ao fazer o dumping de programas armazenados para preservar suas codificações de caracteres. Para recarregar um arquivo de dump que contenha tais declarações, é necessário o privilégio `ALTER` para a base de dados afetada.

Nota

Um dump feito usando o PowerShell no Windows com redirecionamento de saída cria um arquivo com codificação UTF-16:

```sql
mysqldump [options] > dump.sql
```

No entanto, o UTF-16 não é permitido como um conjunto de caracteres de conexão (veja Conjuntos de caracteres de cliente impermissíveis), então o arquivo de depuração não pode ser carregado corretamente. Para contornar esse problema, use a opção `--result-file`, que cria a saída no formato ASCII:

```sql
mysqldump [options] --result-file=dump.sql
```

Não é recomendado carregar um arquivo de dump quando GTIDs estão habilitados no servidor (`gtid_mode=ON`), se o seu arquivo de dump incluir tabelas do sistema. O **mysqldump** emite instruções DML para as tabelas do sistema que utilizam o mecanismo de armazenamento não transacional MyISAM, e essa combinação não é permitida quando GTIDs estão habilitados.

#### Considerações sobre desempenho e escalabilidade

As vantagens do `mysqldump` incluem a conveniência e flexibilidade de visualizar ou até mesmo editar a saída antes da restauração. Você pode clonar bancos de dados para trabalho de desenvolvimento e DBA, ou produzir pequenas variações de um banco de dados existente para testes. Não é destinado como uma solução rápida ou escalável para fazer backup de grandes quantidades de dados. Com tamanhos de dados grandes, mesmo que o passo de backup leve um tempo razoável, restaurar os dados pode ser muito lento, pois a reprodução das declarações SQL envolve I/O de disco para inserção, criação de índices, e assim por diante.

Para backup e restauração em larga escala, um backup físico é mais apropriado, para copiar os arquivos de dados em seu formato original que podem ser restaurados rapidamente:

* Se suas tabelas são principalmente tabelas `InnoDB` ou se você tem uma mistura de tabelas `InnoDB` e `MyISAM`, considere usar o comando **mysqlbackup** do produto MySQL Enterprise Backup. (Disponível como parte da assinatura Enterprise.) Ele oferece o melhor desempenho para backups `InnoDB` com mínima interrupção; também pode fazer backup de tabelas de `MyISAM` e outros motores de armazenamento; e oferece várias opções convenientes para acomodar diferentes cenários de backup. Veja a Seção 28.1, “Visão geral do MySQL Enterprise Backup”.

O **mysqldump** pode recuperar e drenar o conteúdo da tabela string por string, ou pode recuperar todo o conteúdo de uma tabela e bufferá-lo na memória antes de drená-lo. O bufferamento na memória pode ser um problema se você estiver drenando tabelas grandes. Para drenar tabelas string por string, use a opção `--quick` (ou `--opt`, que habilita `--quick`). A opção `--opt` (e, portanto, `--quick`) é habilitada por padrão, então para habilitar o bufferamento de memória, use `--skip-quick`.

Se você estiver usando uma versão recente do **mysqldump** para gerar um dump que será carregado em um servidor MySQL muito antigo, use a opção `--skip-opt` em vez da opção `--opt` ou `--extended-insert`.

Para obter informações adicionais sobre o **mysqldump**, consulte a Seção 7.4, “Usando mysqldump para backups”.

#### Sintaxe de Invocação

Existem, em geral, três maneiras de usar o **mysqldump**: para drenar um conjunto de uma ou mais tabelas, um conjunto de uma ou mais bancos de dados completos ou um servidor MySQL inteiro, conforme mostrado aqui:

```sql
mysqldump [options] db_name [tbl_name ...]
mysqldump [options] --databases db_name ...
mysqldump [options] --all-databases
```

Para descartar bancos de dados inteiros, não dê nome a nenhuma tabela após *`db_name`*, ou use a opção `--databases` ou `--all-databases`.

Para ver uma lista das opções que sua versão do **mysqldump** suporta, execute o comando **mysqldump --help**.

#### Sintaxe de opção - Resumo alfabético

O **mysqldump** suporta as seguintes opções, que podem ser especificadas na string de comando ou nos grupos `[mysqldump]` e `[client]` de um arquivo de opções. Para informações sobre arquivos de opções usados por programas MySQL, consulte a Seção 4.2.2.2, “Usando arquivos de opções”.

**Tabela 4.16 Opções do mysqldump**

<table frame="box" rules="all" summary="Command-line options available for mysqldump.">
<col style="width: 27%"/>
<col style="width: 50%"/>
<col style="width: 11%"/>
<col style="width: 11%"/>
<thead>
<tr>
<th>Option Name</th>
<th>Description</th>
<th>Introduced</th>
<th>Deprecated</th>
</tr>
</thead>
<tbody>
<tr>
<th><code>--add-drop-database</code></th>
<td>Adicione a declaração DROP DATABASE antes de cada declaração CREATE DATABASE</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--add-drop-table</code></th>
<td>Adicione a declaração DROP TABLE antes de cada declaração CREATE TABLE</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--add-drop-trigger</code></th>
<td>Adicione a declaração DROP TRIGGER antes de cada declaração CREATE TRIGGER</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--add-locks</code></th>
<td>Cerque cada dump de tabela com as instruções LOCK TABLES e UNLOCK TABLES</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--all-databases</code></th>
<td>Exclua todas as tabelas em todos os bancos de dados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--allow-keywords</code></th>
<td>Permitir a criação de nomes de colunas que sejam palavras-chave</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--apply-slave-statements</code></th>
<td>Incluir STOP SLAVE antes da declaração CHANGE MASTER e START SLAVE no final da saída</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--bind-address</code></th>
<td>Use a interface de rede especificada para se conectar ao servidor MySQL</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--character-sets-dir</code></th>
<td>Diretório onde os conjuntos de caracteres são instalados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--comments</code></th>
<td>Adicione comentários ao arquivo de descarte</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--compact</code></th>
<td>Produza uma saída mais compacta</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--compatible</code></th>
<td>Produza uma saída mais compatível com outros sistemas de banco de dados ou com servidores MySQL mais antigos.</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--complete-insert</code></th>
<td>Use declarações completas de INSERT que incluam os nomes das colunas</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--compress</code></th>
<td>Compressar todas as informações enviadas entre o cliente e o servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--create-options</code></th>
<td>Incluir todas as opções de tabela específicas do MySQL nos comandos CREATE TABLE</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--databases</code></th>
<td>Interprete todos os argumentos de nome como nomes de banco de dados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug</code></th>
<td>Write debugging log</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug-check</code></th>
<td>Imprimir informações de depuração quando o programa sai</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug-info</code></th>
<td>Imprimir informações de depuração, memória e estatísticas de CPU quando o programa sai</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--default-auth</code></th>
<td>Plugin de autenticação a ser utilizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--default-character-set</code></th>
<td>Especificar o conjunto de caracteres padrão</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-extra-file</code></th>
<td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-file</code></th>
<td>Arquivo de opção de leitura apenas nomeado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-group-suffix</code></th>
<td>Valor do sufixo do grupo de opções</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--delete-master-logs</code></th>
<td>Em um servidor de fonte de replicação, exclua os logs binários após realizar a operação de dump</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--disable-keys</code></th>
<td>Para cada tabela, rode as instruções INSERT com instruções para desabilitar e habilitar chaves</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--dump-date</code></th>
<td>Incluir a data do dump como comentário de "Dump completado em" se a opção --comments for fornecida</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--dump-slave</code></th>
<td>Incluir a declaração CHANGE MASTER que lista as coordenadas de log binário da fonte da replica</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--enable-cleartext-plugin</code></th>
<td>Enable cleartext authentication plugin</td>
<td>5.7.10</td>
<td></td>
</tr>
<tr>
<th><code>--events</code></th>
<td>Eventos de descarte de bancos de dados descartados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--extended-insert</code></th>
<td>Use a sintaxe de inserção de várias strings</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--fields-enclosed-by</code></th>
<td>Esta opção é usada com a opção --tab e tem o mesmo significado que a cláusula correspondente para LOAD DATA</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--fields-escaped-by</code></th>
<td>Esta opção é usada com a opção --tab e tem o mesmo significado que a cláusula correspondente para LOAD DATA</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--fields-optionally-enclosed-by</code></th>
<td>Esta opção é usada com a opção --tab e tem o mesmo significado que a cláusula correspondente para LOAD DATA</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--fields-terminated-by</code></th>
<td>Esta opção é usada com a opção --tab e tem o mesmo significado que a cláusula correspondente para LOAD DATA</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--flush-logs</code></th>
<td>Limpe os arquivos de registro do servidor MySQL antes de iniciar o dump</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--flush-privileges</code></th>
<td>Emita uma declaração FLUSH PRIVILEGES após descartar o banco de dados mysql</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--force</code></th>
<td>Continue mesmo que um erro SQL ocorra durante um dump de tabela</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--get-server-public-key</code></th>
<td>Solicitar chave pública RSA do servidor</td>
<td>5.7.23</td>
<td></td>
</tr>
<tr>
<th><code>--help</code></th>
<td>Exibir mensagem de ajuda e sair</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--hex-blob</code></th>
<td>Armazene colunas binárias usando notação hexadecimal</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--host</code></th>
<td>Anfitrião no qual o servidor MySQL está localizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ignore-error</code></th>
<td>Ignore specified errors</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ignore-table</code></th>
<td>Não descarte a mesa dada</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--include-master-host-port</code></th>
<td>Include MASTER_HOST/MASTER_PORT options in CHANGE MASTER statement produced with --dump-slave</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--insert-ignore</code></th>
<td>Escreva INSERT IGNORE em vez de declarações INSERT</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--lines-terminated-by</code></th>
<td>Esta opção é usada com a opção --tab e tem o mesmo significado que a cláusula correspondente para LOAD DATA</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--lock-all-tables</code></th>
<td>Bloquear todas as tabelas em todos os bancos de dados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--lock-tables</code></th>
<td>Bloquear todas as tabelas antes de fazer o dumping</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--log-error</code></th>
<td>Adicione avisos e erros a um arquivo nomeado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--login-path</code></th>
<td>Leia as opções de caminho de login a partir de .mylogin.cnf</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--master-data</code></th>
<td>Escreva o nome e a posição do arquivo de registro binário na saída</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--max-allowed-packet</code></th>
<td>Comprimento máximo do pacote para enviar ou receber do servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--net-buffer-length</code></th>
<td>Buffer size for TCP/IP and socket communication</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--no-autocommit</code></th>
<td>Envolva as instruções INSERT para cada tabela descarregada dentro de SET autocommit = 0 e as instruções COMMIT</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--no-create-db</code></th>
<td>Não escreva declarações CREATE DATABASE</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--no-create-info</code></th>
<td>Não escreva declarações CREATE TABLE que recriem cada tabela descarregada</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--no-data</code></th>
<td>Não despeje o conteúdo da mesa</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--no-defaults</code></th>
<td>Não leia arquivos de opção</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--no-set-names</code></th>
<td>Same as --skip-set-charset</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--no-tablespaces</code></th>
<td>Não escreva quaisquer declarações de CREATE LOGFILE GROUP ou CREATE TABLESPACE no output</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--opt</code></th>
<td>Abreviação para --add-drop-table --add-locks --create-options --disable-keys --extended-insert --lock-tables --quick --set-charset</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--order-by-primary</code></th>
<td>Exclua as strings de cada tabela, ordenadas por sua chave primária ou pelo seu primeiro índice único.</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--password</code></th>
<td>Senha para usar ao se conectar ao servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--pipe</code></th>
<td>Conecte-se ao servidor usando um pipe nomeado (apenas Windows)</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--plugin-dir</code></th>
<td>Diretório onde os plugins são instalados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--port</code></th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--print-defaults</code></th>
<td>Print default options</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--protocol</code></th>
<td>Protocolo de transporte a ser utilizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--quick</code></th>
<td>Recuperar strings de uma tabela do servidor uma string de cada vez</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--quote-names</code></th>
<td>Identifique os identificadores de citação dentro de caracteres de backtick</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--replace</code></th>
<td>Escreva declarações REPLACE em vez de declarações INSERT</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--result-file</code></th>
<td>Saída direta para um arquivo específico</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--routines</code></th>
<td>Armazene rotinas armazenadas (procedimentos e funções) de bancos de dados descartados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--secure-auth</code></th>
<td>Não envie senhas para o servidor no formato antigo (pré-4.1)</td>
<td></td>
<td>Sim</td>
</tr>
<tr>
<th><code>--server-public-key-path</code></th>
<td>Nome do caminho para o arquivo que contém a chave pública RSA</td>
<td>5.7.23</td>
<td></td>
</tr>
<tr>
<th><code>--set-charset</code></th>
<td>Add SET NAMES default_character_set to output</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--set-gtid-purged</code></th>
<td>Whether to add SET @@GLOBAL.GTID_PURGED to output</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--shared-memory-base-name</code></th>
<td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--single-transaction</code></th>
<td>Emita uma declaração BEGIN SQL antes de drenar dados do servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--skip-add-drop-table</code></th>
<td>Não adicione uma declaração DROP TABLE antes de cada declaração CREATE TABLE</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--skip-add-locks</code></th>
<td>Não adicione bloqueios</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--skip-comments</code></th>
<td>Não adicione comentários ao arquivo de descarte</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--skip-compact</code></th>
<td>Não produza uma saída mais compacta</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--skip-disable-keys</code></th>
<td>Não desative as teclas</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--skip-extended-insert</code></th>
<td>Turn off extended-insert</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--skip-mysql-schema</code></th>
<td>Não perca o esquema do mysql</td>
<td>5.7.36</td>
<td></td>
</tr>
<tr>
<th><code>--skip-opt</code></th>
<td>Desative as opções definidas por --opt</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--skip-quick</code></th>
<td>Não retorne strings de uma tabela do servidor uma string de cada vez</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--skip-quote-names</code></th>
<td>Não cite identificadores</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--skip-set-charset</code></th>
<td>Não escreva a declaração SET NAMES</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--skip-triggers</code></th>
<td>Não descarte gatilhos</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--skip-tz-utc</code></th>
<td>Turn off tz-utc</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--socket</code></th>
<td>Arquivo de socket Unix ou pipe nomeado do Windows a ser usado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl</code></th>
<td>Enable connection encryption</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-ca</code></th>
<td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-capath</code></th>
<td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-cert</code></th>
<td>Arquivo que contém o certificado X.509</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-cipher</code></th>
<td>Cifras permitidas para criptografia de conexão</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-crl</code></th>
<td>Arquivo que contém listas de revogação de certificados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-crlpath</code></th>
<td>Diretório que contém arquivos de lista de revogação de certificados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-key</code></th>
<td>Arquivo que contém a chave X.509</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-mode</code></th>
<td>Estado de segurança desejado da conexão com o servidor</td>
<td>5.7.11</td>
<td></td>
</tr>
<tr>
<th><code>--ssl-verify-server-cert</code></th>
<td>Verifique o nome do host contra a identidade do Nome comum do certificado do servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--tab</code></th>
<td>Produza arquivos de dados separados por tabulação</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--tables</code></th>
<td>Supraposição da opção --databases ou -B</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--tls-version</code></th>
<td>Protocolos TLS permitidos para conexões criptografadas</td>
<td>5.7.10</td>
<td></td>
</tr>
<tr>
<th><code>--triggers</code></th>
<td>Triggers de descarte para cada tabela descartada</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--tz-utc</code></th>
<td>Add SET TIME_ZONE='+00:00' to dump file</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--user</code></th>
<td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--verbose</code></th>
<td>Verbose mode</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--version</code></th>
<td>Exibir informações da versão e sair</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--where</code></th>
<td>Exclua apenas as strings selecionadas pela condição WHERE dada</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--xml</code></th>
<td>Produce XML output</td>
<td></td>
<td></td>
</tr>
</tbody>
</table>

#### Opções de conexão

O comando **mysqldump** faz login em um servidor MySQL para extrair informações. As seguintes opções especificam como se conectar ao servidor MySQL, seja na mesma máquina ou em um sistema remoto.

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

Em um computador com várias interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao servidor MySQL.

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

Compressa todas as informações enviadas entre o cliente e o servidor, se possível. Veja a Seção 4.2.6, “Controle de Compressão de Conexão”.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Veja a Seção 6.2.13, “Autenticação substituível”.

* `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Properties for enable-cleartext-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Introduced</th> <td>5.7.10</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

Ative o plugin de autenticação de texto claro `mysql_clear_password`. (Veja a Seção 6.4.1.6, “Autenticação de Texto Claro Plugável do Lado do Cliente”).

Essa opção foi adicionada no MySQL 5.7.10.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Properties for get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Introduced</th> <td>5.7.23</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>

Solicitar a chave pública necessária para a troca de senha baseada em par de chaves RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

Para informações sobre o plugin `caching_sha2_password`, consulte a Seção 6.4.1.4, “Cacheamento de Autenticação SHA-2 Pluggable”.

A opção `--get-server-public-key` foi adicionada no MySQL 5.7.23.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>

Arraste os dados do servidor MySQL para o host fornecido. O host padrão é `localhost`.

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam para qual servidor MySQL se conectar e qual conta se autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql\_config\_editor**. Veja a Seção 4.6.6, “mysql\_config\_editor — Utilitário de Configuração MySQL”.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecida, o **mysqldump** solicitará uma senha. Se for fornecida, não deve haver *espaço* entre `--password=` ou `-p` e a senha que a segue. Se não for especificado nenhum tipo de opção de senha, o padrão é não enviar senha.

Especificar uma senha na string de comando deve ser considerado inseguro. Para evitar fornecer a senha na string de comando, use um arquivo de opção. Consulte a Seção 6.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

Para especificar explicitamente que não há senha e que o **mysqldump** não deve solicitar uma senha, use a opção `--skip-password`.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Properties for pipe"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--pipe</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

Em Windows, conecte-se ao servidor usando um pipe nomeado. Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por pipe nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>0

O diretório onde procurar plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o **mysqldump** não o encontrar. Veja a Seção 6.2.13, “Autenticação Configurável”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>1

Para conexões TCP/IP, o número de porta a ser utilizado.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>2

O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de outro protocolo que não o desejado. Para obter detalhes sobre os valores permitidos, consulte a Seção 4.2.5, “Protocolos de Transporte de Conexão”.

* `--secure-auth`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>3

Não envie senhas para o servidor no formato antigo (pré-4.1). Isso impede conexões, exceto para servidores que usam o formato de senha mais recente.

A partir do MySQL 5.7.5, essa opção é desatualizada; espere que ela seja removida em um lançamento futuro do MySQL. Ela sempre está habilitada e tentar desabilitá-la (`--skip-secure-auth`, `--secure-auth=0`) produz um erro. Antes do MySQL 5.7.5, essa opção está habilitada por padrão, mas pode ser desabilitada.

Nota

As senhas que utilizam o método de hashing pré-4.1 são menos seguras do que as senhas que utilizam o método nativo de hashing de senha e devem ser evitadas. As senhas pré-4.1 são desaconselhadas e o suporte para elas foi removido no MySQL 5.7.5. Para instruções de atualização de conta, consulte a Seção 6.4.1.3, “Migrando para fora do hashing de senha pré-4.1 e do plugin mysql\_old\_password”.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>4

O nome do caminho de um arquivo em formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senha com base em par de chave RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

Para `sha256_password`, esta opção só se aplica se o MySQL foi construído usando OpenSSL.

Para informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 6.4.1.5, “Autenticação substituível SHA-256”, e a Seção 6.4.1.4, “Cache de autenticação substituível SHA-2”.

A opção `--server-public-key-path` foi adicionada no MySQL 5.7.23.

* `--skip-mysql-schema`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>5

Não descarte o esquema `mysql` quando o arquivo de dump for restaurado. Por padrão, o esquema é descartado.

Essa opção foi adicionada no MySQL 5.7.36.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>6

Para conexões a `localhost`, o arquivo de socket Unix a ser usado, ou, no Windows, o nome do pipe nomeado a ser usado.

Em Windows, esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de canal nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--ssl*`

As opções que começam com `--ssl` especificam se deve conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Consulte Opções de comando para conexões criptografadas.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>7

Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolo separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 6.3.2, “Protocolos e cifras TLS de conexão criptografada”.

Essa opção foi adicionada no MySQL 5.7.10.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>8

O nome de usuário da conta MySQL a ser usado para se conectar ao servidor.

#### Opções de Arquivo Opções

Essas opções são usadas para controlar quais arquivos de opção devem ser lidos.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>9

Leia este arquivo de opção após o arquivo de opção global, mas (em Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>0

Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Exceção: Mesmo com `--defaults-file`, os programas de cliente leem `.mylogin.cnf`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>1

Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, o **mysqldump** normalmente lê os grupos `[client]` e `[mysqldump]`. Se esta opção for dada como `--defaults-group-suffix=_other`, o **mysqldump** também lê os grupos `[client_other]` e `[mysqldump_other]`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>2

Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para impedir que elas sejam lidas.

A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na string de comando, mesmo quando o `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql\_config\_editor**. Veja a Seção 4.6.6, “mysql\_config\_editor — Ferramenta de Configuração do MySQL”.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>3

Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

#### Opções de DDL

Os cenários de uso do **mysqldump** incluem configurar uma nova instância completa do MySQL (incluindo tabelas de banco de dados) e substituir dados em uma instância existente por bancos de dados e tabelas existentes. As seguintes opções permitem especificar quais coisas devem ser desmontadas e configuradas ao restaurar um dump, codificando várias declarações DDL no arquivo de dump.

* `--add-drop-database`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>4

Escreva uma declaração `DROP DATABASE` antes de cada declaração `CREATE DATABASE`. Esta opção é tipicamente usada em conjunto com as opções `--all-databases` ou `--databases`, pois nenhuma declaração `CREATE DATABASE` é escrita a menos que uma dessas opções seja especificada.

* `--add-drop-table`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>5

Escreva uma declaração `DROP TABLE` antes de cada declaração `CREATE TABLE`.

* `--add-drop-trigger`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>6

Escreva uma declaração `DROP TRIGGER` antes de cada declaração `CREATE TRIGGER`.

* `--all-tablespaces`, `-Y`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>7

Adiciona a um dump de tabela todas as instruções SQL necessárias para criar quaisquer espaços de tabela utilizados por uma tabela `NDB`. Essas informações não estão incluídas de outra forma na saída do **mysqldump**. Esta opção atualmente é relevante apenas para tabelas do NDB Cluster, que não são suportadas no MySQL 5.7.

* `--no-create-db`, `-n`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>8

Suprima as declarações `CREATE DATABASE` que, de outra forma, estão incluídas na saída se a opção `--databases` ou `--all-databases` for dada.

* `--no-create-info`, `-t`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>9

Não escreva declarações `CREATE TABLE` que criem cada tabela descarregada.

Nota

Essa opção *não* exclui declarações que criam grupos de arquivos de registro ou espaços de tabela do **mysqldump** do resultado; no entanto, você pode usar a opção `--no-tablespaces` para esse propósito.

* `--no-tablespaces`, `-y`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>0

Esta opção suprime todas as declarações `CREATE LOGFILE GROUP` e `CREATE TABLESPACE` na saída do **mysqldump**.

* `--replace`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>1

Escreva declarações `REPLACE` em vez de declarações `INSERT`.

#### Opções de depuração

As seguintes opções imprimem informações de depuração, codificam informações de depuração no arquivo de depuração ou permitem que a operação de depuração prossiga, independentemente dos problemas potenciais.

* `--allow-keywords`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>2

Permite a criação de nomes de colunas que são palavras-chave. Isso funciona prefixando cada nome de coluna com o nome da tabela.

* `--comments`, `-i`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>3

Escreva informações adicionais no arquivo de depuração, como a versão do programa, a versão do servidor e o host. Esta opção é ativada por padrão. Para suprimir essas informações adicionais, use `--skip-comments`.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>4

Escreva um registro de depuração. Uma string típica *`debug_options`* é `d:t:o,file_name`. O valor padrão é `d:t:o,/tmp/mysqldump.trace`.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--debug-check`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>5

Imprima algumas informações de depuração quando o programa sair.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--debug-info`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>6

Imprimir informações de depuração e estatísticas de uso de memória e CPU quando o programa sai.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--dump-date`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>7

Se a opção `--comments` for fornecida, o **mysqldump** produz um comentário no final do dump do seguinte formato:

  ```sql
  -- Dump completed on DATE
  ```

No entanto, as datas que causam arquivos de descarte tomados em diferentes momentos parecem ser diferentes, mesmo que os dados sejam, de outra forma, idênticos. `--dump-date` e `--skip-dump-date` controlam se a data é adicionada ao comentário. A opção padrão é `--dump-date` (inclua a data no comentário). `--skip-dump-date` suprime a impressão da data.

* `--force`, `-f`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>8

Ignore todos os erros; continue mesmo que um erro SQL ocorra durante um dump de tabela.

Uma utilização desta opção é fazer com que o **mysqldump** continue a ser executado mesmo quando ele encontrar uma visão que se tornou inválida porque a definição se refere a uma tabela que foi excluída. Sem `--force`, o **mysqldump** sai com uma mensagem de erro. Com `--force`, o **mysqldump** imprime a mensagem de erro, mas também escreve um comentário SQL contendo a definição da visão na saída do dump e continua a ser executado.

Se a opção `--ignore-error` também for dada para ignorar erros específicos, a `--force` tem precedência.

* `--log-error=file_name`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>9

Registre as advertências e erros, anexando-os ao arquivo nomeado. O padrão é não registrar nada.

* `--skip-comments`

  <table frame="box" rules="all" summary="Properties for enable-cleartext-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Introduced</th> <td>5.7.10</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>0

Veja a descrição para a opção `--comments`.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for enable-cleartext-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Introduced</th> <td>5.7.10</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>1

Modo detalhado. Imprima mais informações sobre o que o programa faz.

#### Opções de Ajuda

As opções a seguir exibem informações sobre o próprio comando **mysqldump**.

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for enable-cleartext-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Introduced</th> <td>5.7.10</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>2

Exibir uma mensagem de ajuda e sair.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for enable-cleartext-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Introduced</th> <td>5.7.10</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>3

Exibir informações da versão e sair.

#### Opções de internacionalização

As opções a seguir alteram a forma como o comando **mysqldump** representa dados de caracteres com configurações de idioma nacional.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for enable-cleartext-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Introduced</th> <td>5.7.10</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>4

O diretório onde os conjuntos de caracteres são instalados. Veja a Seção 10.15, “Configuração de Conjunto de Caracteres”.

* `--default-character-set=charset_name`

  <table frame="box" rules="all" summary="Properties for enable-cleartext-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Introduced</th> <td>5.7.10</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>5

Use *`charset_name`* como o conjunto de caracteres padrão. Veja a Seção 10.15, “Configuração do Conjunto de Caracteres”. Se não for especificado nenhum conjunto de caracteres, o **mysqldump** usa `utf8`.

* `--no-set-names`, `-N`

  <table frame="box" rules="all" summary="Properties for enable-cleartext-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Introduced</th> <td>5.7.10</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>6

Desativa o ajuste `--set-charset`, da mesma forma que especificar `--skip-set-charset`.

* `--set-charset`

  <table frame="box" rules="all" summary="Properties for enable-cleartext-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Introduced</th> <td>5.7.10</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>7

Escreva `SET NAMES default_character_set` na saída. Esta opção é ativada por padrão. Para suprimir a declaração `SET NAMES`, use `--skip-set-charset`.

#### Opções de Replicação

O comando **mysqldump** é frequentemente usado para criar uma instância vazia ou uma instância que inclua dados em um servidor de replicação em uma configuração de replicação. As seguintes opções se aplicam ao descarte e ao restabelecimento de dados em servidores de fonte de replicação e servidores de replicação.

* `--apply-slave-statements`

  <table frame="box" rules="all" summary="Properties for enable-cleartext-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Introduced</th> <td>5.7.10</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>8

Para um dump de replica produzido com a opção `--dump-slave`, adicione uma declaração `STOP SLAVE` antes da declaração `CHANGE MASTER TO` e uma declaração `START SLAVE` no final da saída.

* `--delete-master-logs`

  <table frame="box" rules="all" summary="Properties for enable-cleartext-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Introduced</th> <td>5.7.10</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>9

Em um servidor de replicação de fonte, exclua os logs binários enviando uma declaração `PURGE BINARY LOGS` para o servidor após realizar a operação de dump. Esta opção requer o privilégio `RELOAD`, além de privilégios suficientes para executar essa declaração. Esta opção habilita automaticamente `--master-data`.

* `--dump-slave[=value]`

  <table frame="box" rules="all" summary="Properties for get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Introduced</th> <td>5.7.23</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>0

Esta opção é semelhante a `--master-data`, exceto que é usada para descartar um servidor de replicação e produzir um arquivo de dump que pode ser usado para configurar outro servidor como uma replica que tenha a mesma fonte do servidor descartado. Isso faz com que a saída do dump inclua uma declaração `CHANGE MASTER TO` que indica as coordenadas do log binário (nome do arquivo e posição) da fonte da replica descartada. A declaração `CHANGE MASTER TO` lê os valores de `Relay_Master_Log_File` e `Exec_Master_Log_Pos` da saída de `SHOW SLAVE STATUS` e os usa para `MASTER_LOG_FILE` e `MASTER_LOG_POS`, respectivamente. Essas são as coordenadas do servidor de origem do qual a replica deve começar a replicar.

Nota

As inconsistências na sequência de transações do log de relevo que foram executadas podem causar o uso da posição errada. Consulte a Seção 16.4.1.32, “Replicação e Inconsistências de Transações”, para obter mais informações.

`--dump-slave` faz com que as coordenadas da fonte sejam usadas, em vez das do servidor descarregado, como é feito pela opção `--master-data`. Além disso, especificar essa opção faz com que a opção `--master-data` seja ignorada, se usada, e efetivamente ignorada.

Aviso

Essa opção não deve ser usada se o servidor onde o dump vai ser aplicado usa `gtid_mode=ON` e `MASTER_AUTOPOSITION=1`.

O valor da opção é tratado da mesma maneira que para `--master-data` (definir nenhum valor ou 1 faz com que uma declaração `CHANGE MASTER TO` seja escrita no dump, definir 2 faz com que a declaração seja escrita, mas encapsulada em comentários SQL) e tem o mesmo efeito que `--master-data` em termos de habilitação ou desabilitação de outras opções e na forma como o bloqueio é tratado.

Essa opção faz com que o **mysqldump** pare o thread de replicação do SQL antes do dump e o reinicie novamente depois.

`--dump-slave` envia uma declaração `SHOW SLAVE STATUS` ao servidor para obter informações, portanto, ela requer privilégios suficientes para executar essa declaração.

Em conjunto com `--dump-slave`, as opções `--apply-slave-statements` e `--include-master-host-port` também podem ser utilizadas.

* `--include-master-host-port`

  <table frame="box" rules="all" summary="Properties for get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Introduced</th> <td>5.7.23</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>1

Para a declaração `CHANGE MASTER TO` em um dump de replica produzido com a opção `--dump-slave`, adicione as opções `MASTER_HOST` e `MASTER_PORT` para o nome do host e o número da porta TCP/IP da fonte da replica.

* `--master-data[=value]`

  <table frame="box" rules="all" summary="Properties for get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Introduced</th> <td>5.7.23</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>2

Use esta opção para descartar um servidor de replicação de origem para produzir um arquivo de depuração que pode ser usado para configurar outro servidor como uma réplica da origem. Isso faz com que a saída do dump inclua uma declaração `CHANGE MASTER TO` que indica as coordenadas do log binário (nome do arquivo e posição) do servidor descartado. Essas são as coordenadas do servidor de origem de onde a réplica deve começar a replicar após carregar o arquivo de depuração na réplica.

Se o valor da opção for 2, a declaração `CHANGE MASTER TO` é escrita como um comentário SQL e, portanto, é informativa apenas; ela não tem efeito quando o arquivo de implantação é recarregado. Se o valor da opção for 1, a declaração não é escrita como um comentário e tem efeito quando o arquivo de implantação é recarregado. Se nenhum valor de opção for especificado, o valor padrão é 1.

`--master-data` envia uma declaração `SHOW MASTER STATUS` ao servidor para obter informações, portanto, ela requer privilégios suficientes para executar essa declaração. Esta opção também requer o privilégio `RELOAD` e o log binário deve estar habilitado.

A opção `--master-data` desativa automaticamente `--lock-tables`. Também ativa `--lock-all-tables`, a menos que `--single-transaction` também seja especificado, no qual caso, uma bloqueio de leitura global é adquirido apenas por um curto período no início do descarte (veja a descrição para `--single-transaction`). Em todos os casos, qualquer ação nos logs acontece no momento exato do descarte.

É também possível configurar uma réplica despejando uma réplica existente da fonte, usando a opção `--dump-slave`, que substitui `--master-data` e faz com que ela seja ignorada se ambas as opções forem usadas.

* `--set-gtid-purged=value`

  <table frame="box" rules="all" summary="Properties for get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Introduced</th> <td>5.7.23</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>3

Essa opção permite o controle sobre as informações de ID de transação global (GTID) escritas no arquivo de depuração, indicando se deve adicionar uma declaração `SET @@GLOBAL.gtid_purged` à saída. Essa opção também pode causar a escrita de uma declaração na saída que desabilita o registro binário enquanto o arquivo de depuração está sendo recarregado.

A tabela a seguir mostra os valores de opção permitidos. O valor padrão é `AUTO`.

  <table frame="box" rules="all" summary="Properties for get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Introduced</th> <td>5.7.23</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>4

Um descarte parcial de um servidor que está usando replicação baseada em GTID requer que a opção `--set-gtid-purged={ON|OFF}` seja especificada. Use `ON` se a intenção é implantar uma nova réplica de replicação usando apenas alguns dos dados do servidor descartado. Use `OFF` se a intenção é reparar uma tabela copiando-a dentro de uma topologia. Use `OFF` se a intenção é copiar uma tabela entre topologias de replicação que são disjuntas e que permaneçam assim.

A opção `--set-gtid-purged` tem o seguinte efeito no registro binário quando o arquivo de depuração é carregado novamente:

+ `--set-gtid-purged=OFF`: `SET @@SESSION.SQL_LOG_BIN=0;` não é adicionado ao resultado.

+ `--set-gtid-purged=ON`: `SET @@SESSION.SQL_LOG_BIN=0;` é adicionado ao resultado.

+ `--set-gtid-purged=AUTO`: `SET @@SESSION.SQL_LOG_BIN=0;` é adicionado ao resultado se GTIDs estiverem habilitados no servidor que você está fazendo backup (ou seja, se `AUTO` avalia em `ON`).

Usar esta opção com a opção `--single-transaction` pode levar a inconsistências na saída. Se `--set-gtid-purged=ON` for necessário, pode ser usado com `--lock-all-tables`, mas isso pode impedir consultas paralelas enquanto o **mysqldump** está sendo executado.

Não é recomendado carregar um arquivo de dump quando GTIDs estão habilitados no servidor (`gtid_mode=ON`), se o seu arquivo de dump incluir tabelas do sistema. O **mysqldump** emite instruções DML para as tabelas do sistema que utilizam o mecanismo de armazenamento não transacional MyISAM, e essa combinação não é permitida quando GTIDs estão habilitados. Além disso, esteja ciente de que carregar um arquivo de dump de um servidor com GTIDs habilitados em outro servidor com GTIDs habilitados gera diferentes identificadores de transação.

#### Opções de formato

As opções a seguir especificam como representar todo o arquivo de depuração ou certos tipos de dados no arquivo de depuração. Elas também controlam se certas informações opcionais são escritas no arquivo de depuração.

* `--compact`

  <table frame="box" rules="all" summary="Properties for get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Introduced</th> <td>5.7.23</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>5

Produza uma saída mais compacta. Esta opção habilita as opções `--skip-add-drop-table`, `--skip-add-locks`, `--skip-comments`, `--skip-disable-keys` e `--skip-set-charset`.

* `--compatible=name`

  <table frame="box" rules="all" summary="Properties for get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Introduced</th> <td>5.7.23</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>6

Produza uma saída mais compatível com outros sistemas de banco de dados ou com servidores MySQL mais antigos. O valor de *`name`* pode ser `ansi`, `mysql323`, `mysql40`, `postgresql`, `oracle`, `mssql`, `db2`, `maxdb`, `no_key_options`, `no_table_options` ou `no_field_options`. Para usar vários valores, separe-os por vírgula. Esses valores têm o mesmo significado que as opções correspondentes para definir o modo SQL do servidor. Veja a Seção 5.1.10, “Modos SQL do Servidor”.

Esta opção não garante compatibilidade com outros servidores. Ela apenas habilita os valores do modo SQL que estão atualmente disponíveis para tornar a saída do dump mais compatível. Por exemplo, `--compatible=oracle` não mapeia tipos de dados para tipos Oracle ou usa a sintaxe de comentário Oracle.

* `--complete-insert`, `-c`

  <table frame="box" rules="all" summary="Properties for get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Introduced</th> <td>5.7.23</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>7

Utilize declarações completas do `INSERT` que incluam os nomes das colunas.

* `--create-options`

  <table frame="box" rules="all" summary="Properties for get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Introduced</th> <td>5.7.23</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>8

Inclua todas as opções de tabela específicas do MySQL nas declarações `CREATE TABLE`.

* `--fields-terminated-by=...`, `--fields-enclosed-by=...`, `--fields-optionally-enclosed-by=...`, `--fields-escaped-by=...`

  <table frame="box" rules="all" summary="Properties for get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Introduced</th> <td>5.7.23</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>9

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>0

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>1

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>2

Essas opções são usadas com a opção `--tab` e têm o mesmo significado das cláusulas correspondentes `FIELDS` para `LOAD DATA`. Veja a Seção 13.2.6, “Instrução LOAD DATA”.

* `--hex-blob`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>3

Armazene colunas binárias usando notação hexadecimal (por exemplo, `'abc'` se torna `0x616263`). Os tipos de dados afetados são os tipos `BINARY`, `VARBINARY`, `BLOB` e `BIT`, todos os tipos de dados espaciais e outros tipos de dados não binários quando usados com o conjunto de caracteres `binary`.

A opção `--hex-blob` é ignorada quando o `--tab` é usado.

* `--lines-terminated-by=...`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>4

Esta opção é usada com a opção `--tab` e tem o mesmo significado que a cláusula correspondente `LINES` para `LOAD DATA`. Veja a Seção 13.2.6, “Instrução LOAD DATA”.

* `--quote-names`, `-Q`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>5

Identificador de citações (como nomes de banco de dados, tabela e coluna) dentro de `` `` ` characters. If the ` ANSI_QUOTES ` SQL mode is enabled, identifiers are quoted within ` "` characters. This option is enabled by default. It can be disabled with `--skip-quote-names `, but this option should be given after any option such as `--compatible ` that may enable `--quote-names`.

* `--result-file=file_name`, `-r file_name`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>6

Saída direta para o arquivo nomeado. O arquivo de resultado é criado e seus conteúdos anteriores são sobrescritos, mesmo que um erro ocorra durante a geração do dump.

Essa opção deve ser usada no Windows para evitar que os caracteres de nova string `\n` sejam convertidos em sequências de retorno de carro/nova string `\r\n`.

* `--tab=dir_name`, `-T dir_name`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>7

Produza arquivos de dados no formato de texto separados por tabulação. Para cada tabela descarregada, o **mysqldump** cria um arquivo `tbl_name.sql` que contém a declaração `CREATE TABLE` que cria a tabela, e o servidor escreve um arquivo `tbl_name.txt` que contém seus dados. O valor da opção é o diretório onde os arquivos serão escritos.

Nota

Essa opção deve ser usada apenas quando o **mysqldump** é executado na mesma máquina que o servidor `mysqld`. Como o servidor cria os arquivos `*.txt` no diretório que você especifica, o diretório deve ser legível pelo servidor e a conta do MySQL que você usa deve ter o privilégio `FILE`. Como o **mysqldump** cria `*.sql` no mesmo diretório, ele deve ser legível pela conta de login do seu sistema.

Por padrão, os arquivos de dados `.txt` são formatados usando caracteres de tabulação entre os valores das colunas e uma nova string no final de cada string. O formato pode ser especificado explicitamente usando as opções `--fields-xxx` e `--lines-terminated-by`.

Os valores das colunas são convertidos para o conjunto de caracteres especificado pela opção `--default-character-set`.

* `--tz-utc`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>8

Esta opção permite que as colunas `TIMESTAMP` sejam descarregadas e recarregadas entre servidores em diferentes fusos horários. O **mysqldump** define seu fuso horário de conexão como UTC e adiciona `SET TIME_ZONE='+00:00'` ao arquivo de dump. Sem esta opção, as colunas `TIMESTAMP` são descarregadas e recarregadas nos fusos horários locais dos servidores de origem e destino, o que pode causar alterações nos valores se os servidores estiverem em diferentes fusos horários. `--tz-utc` também protege contra mudanças devido ao horário de verão. `--tz-utc` é habilitado por padrão. Para desabilitá-lo, use `--skip-tz-utc`.

* `--xml`, `-X`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>9

Escreva a saída do dump como XML bem formado.

**`NULL`, `'NULL'` e Valores Vazios**: Para uma coluna denominada *`column_name`*, o valor `NULL`, uma string vazia e o valor da string `'NULL'` são distinguidos um do outro na saída gerada por esta opção da seguinte forma.

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>0

A saída do cliente **mysql** quando executado usando a opção `--xml` também segue as regras anteriores. (Veja a Seção 4.5.1.1, “Opções do cliente mysql”.)

A saída XML do **mysqldump** inclui o espaço de nomes XML, conforme mostrado aqui:

  ```sql
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

As seguintes opções controlam quais tipos de objetos do esquema são escritos no arquivo de depuração: por categoria, como gatilhos ou eventos; por nome, por exemplo, escolhendo quais bancos de dados e tabelas devem ser depurados; ou até mesmo filtrando strings dos dados da tabela usando uma cláusula `WHERE`.

* `--all-databases`, `-A`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>1

Descarte todas as tabelas em todos os bancos de dados. Isso é o mesmo que usar a opção `--databases` e nomear todos os bancos de dados na string de comando.

* `--databases`, `-B`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>2

Arraste várias bases de dados. Normalmente, o **mysqldump** trata o argumento de nome do primeiro na string de comando como um nome de banco de dados e os nomes seguintes como nomes de tabela. Com esta opção, ele trata todos os argumentos de nome como nomes de banco de dados. As declarações `CREATE DATABASE` e `USE` são incluídas na saída antes de cada nova base de dados.

Essa opção pode ser usada para descartar os bancos de dados `INFORMATION_SCHEMA` e `performance_schema`, que normalmente não são descartados mesmo com a opção `--all-databases`. (Use também a opção `--skip-lock-tables`.

* `--events`, `-E`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>3

Inclua eventos do Agendamento de Eventos para os bancos de dados descartados na saída. Esta opção requer os privilégios `EVENT` para esses bancos de dados.

A saída gerada ao usar `--events` contém declarações `CREATE EVENT` para criar os eventos. No entanto, essas declarações não incluem atributos como os timestamps de criação e modificação dos eventos, então, quando os eventos são recarregados, eles são criados com timestamps iguais ao tempo de recarga.

Se você precisar criar eventos com seus atributos de data e hora originais, não use `--events`. Em vez disso, descarregue e recarregue o conteúdo da tabela `mysql.event` diretamente, usando uma conta MySQL que tenha privilégios apropriados para o banco de dados `mysql`.

* `--ignore-error=error[,error]...`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>4

Ignore os erros especificados. O valor da opção é uma lista de números separados por vírgula que especificam os erros a serem ignorados durante a execução do **mysqldump**. Se a opção `--force` também for dada para ignorar todos os erros, a `--force` prevalece.

* `--ignore-table=db_name.tbl_name`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>5

Não descarte a tabela fornecida, que deve ser especificada usando tanto os nomes do banco de dados quanto da tabela. Para ignorar várias tabelas, use esta opção várias vezes. Esta opção também pode ser usada para ignorar visualizações.

* `--no-data`, `-d`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>6

Não escreva nenhuma informação da string da tabela (ou seja, não descarte o conteúdo da tabela). Isso é útil se você deseja descarregar apenas a declaração `CREATE TABLE` da tabela (por exemplo, para criar uma cópia vazia da tabela carregando o arquivo de descarte).

* `--routines`, `-R`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>7

Inclua rotinas armazenadas (procedimentos e funções) para os bancos de dados descartados na saída. Esta opção requer o privilégio `SELECT` para a tabela `mysql.proc`.

A saída gerada ao usar `--routines` contém as declarações `CREATE PROCEDURE` e `CREATE FUNCTION` para criar as rotinas. No entanto, essas declarações não incluem atributos como os timestamps de criação e modificação das rotinas, então, quando as rotinas são recarregadas, elas são criadas com timestamps iguais ao tempo de recarga.

Se você precisar criar rotinas com seus atributos de marcação de tempo originais, não use `--routines`. Em vez disso, descarregue e recarregue o conteúdo da tabela `mysql.proc` diretamente, usando uma conta MySQL que tenha privilégios apropriados para o banco de dados `mysql`.

* `--tables`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>8

Supraponha a opção `--databases` ou `-B`. O **mysqldump** considera todos os argumentos de nome que seguem a opção como nomes de tabela.

* `--triggers`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>9

Inclua gatilhos para cada tabela descarregada na saída. Esta opção é ativada por padrão; desative-a com `--skip-triggers`.

Para poder descartar os gatilhos de uma tabela, você deve ter o privilégio `TRIGGER` para a tabela.

Múltiplos gatilhos são permitidos. O **mysqldump** exibe os gatilhos na ordem de ativação, para que, quando o arquivo de dump é carregado novamente, os gatilhos sejam criados na mesma ordem de ativação. No entanto, se um arquivo de dump do **mysqldump** contiver múltiplos gatilhos para uma tabela que tenham o mesmo evento de gatilho e hora de ação, ocorrerá um erro para tentativas de carregar o arquivo de dump em um servidor mais antigo que não suporte múltiplos gatilhos. (Para uma solução alternativa, consulte a Seção 2.11.3, “Notas de Downgrade”; você pode converter os gatilhos para serem compatíveis com servidores mais antigos.)

* `--where='where_condition'`, `-w 'where_condition'`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>0

Exclua apenas as strings selecionadas pela condição dada `WHERE`. Aspas ao redor da condição são obrigatórias se ela contiver espaços ou outros caracteres especiais para o interpretador do comando.

Exemplos:

  ```sql
  --where="user='jimf'"
  -w"userid>1"
  -w"userid<1"
  ```

#### Opções de desempenho

As seguintes opções são as mais relevantes para o desempenho, especialmente das operações de restauração. Para conjuntos de dados grandes, a operação de restauração (processando as declarações `INSERT` no arquivo de dump) é a parte que mais consome tempo. Quando é urgente restaurar os dados rapidamente, planeje e teste o desempenho desta etapa com antecedência. Para tempos de restauração medidos em horas, você pode preferir uma solução de backup e restauração alternativa, como o MySQL Enterprise Backup para bancos de dados `InnoDB` e de uso misto.

O desempenho também é afetado pelas opções transacionais, principalmente para a operação de dump.

* `--disable-keys`, `-K`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>1

Para cada tabela, rode as declarações `INSERT` com as declarações `/*!40000 ALTER TABLE tbl_name DISABLE KEYS */;` e `/*!40000 ALTER TABLE tbl_name ENABLE KEYS */;`. Isso torna o carregamento do arquivo de depuração mais rápido, pois os índices são criados após todas as strings serem inseridas. Esta opção é eficaz apenas para índices não únicos das tabelas `MyISAM`.

* `--extended-insert`, `-e`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>2

Escreva declarações `INSERT` usando sintaxe de várias strings que inclua várias listas `VALUES`. Isso resulta em um arquivo de depuração menor e acelera as inserções quando o arquivo é carregado novamente.

* `--insert-ignore`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>3

Escreva declarações `INSERT IGNORE` em vez de declarações `INSERT`.

* `--max-allowed-packet=value`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>4

O tamanho máximo do buffer para comunicação cliente/servidor. O padrão é 24 MB, o máximo é 1 GB.

Nota

O valor desta opção é específico para o **mysqldump** e não deve ser confundido com a variável de sistema `max_allowed_packet` do servidor MySQL; o valor do servidor não pode ser excedido por um único pacote do **mysqldump**, independentemente de qualquer configuração para a opção **mysqldump**, mesmo que esta última seja maior.

* `--net-buffer-length=value`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>5

O tamanho inicial do buffer para a comunicação cliente/servidor. Ao criar declarações `INSERT` de várias strings (como com a opção `--extended-insert` ou `--opt`, o **mysqldump** cria strings com até `--net-buffer-length` bytes de comprimento. Se você aumentar essa variável, certifique-se de que a variável de sistema do servidor MySQL `net_buffer_length` tenha um valor pelo menos desse tamanho.

* `--opt`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>6

Esta opção, habilitada por padrão, é uma abreviação da combinação de `--add-drop-table` `--add-locks` `--create-options` `--disable-keys` `--extended-insert` `--lock-tables` `--quick` `--set-charset`. Ela oferece uma operação de descarte rápida e produz um arquivo de descarte que pode ser carregado novamente em um servidor MySQL rapidamente.

Como a opção `--opt` é habilitada por padrão, você só especifica sua oposta, a opção `--skip-opt` para desativar vários ajustes padrão. Consulte a discussão sobre os grupos de opções da opção `mysqldump` para obter informações sobre a ativação ou desativação seletiva de um subconjunto das opções afetadas por `--opt`.

* `--quick`, `-q`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>7

Esta opção é útil para descartar tabelas grandes. Ela obriga o **mysqldump** a recuperar strings de uma tabela do servidor uma string de cada vez, em vez de recuperar o conjunto completo de strings e bufferá-lo na memória antes de escrevê-lo.

* `--skip-opt`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>8

Veja a descrição para a opção `--opt`.

#### Opções Transacionais

As seguintes opções sacrificam o desempenho da operação de descarte em prol da confiabilidade e consistência dos dados exportados.

* `--add-locks`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>9

Certifique-se de que cada dump de tabela esteja envolto em declarações `LOCK TABLES` e `UNLOCK TABLES`. Isso resulta em inserções mais rápidas quando o arquivo de dump é carregado novamente. Veja a Seção 8.2.4.1, “Otimizando declarações INSERT”.

* `--flush-logs`, `-F`

  <table frame="box" rules="all" summary="Properties for pipe"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--pipe</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>0

Limpe os arquivos de registro do servidor MySQL antes de iniciar o dump. Esta opção requer o privilégio `RELOAD`. Se você usar esta opção em combinação com a opção `--all-databases`, os registros são limpos *para cada banco de dados dumpado*. A exceção é quando você usa `--lock-all-tables`, `--master-data` ou `--single-transaction`: Neste caso, os registros são limpos apenas uma vez, correspondendo ao momento em que todas as tabelas são bloqueadas por `FLUSH TABLES WITH READ LOCK`. Se você deseja que seu dump e o flush do log aconteçam exatamente no mesmo momento, você deve usar `--flush-logs` juntamente com `--lock-all-tables`, `--master-data` ou `--single-transaction`.

* `--flush-privileges`

  <table frame="box" rules="all" summary="Properties for pipe"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--pipe</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>1

Adicione uma declaração `FLUSH PRIVILEGES` à saída do dump após o dumping do banco de dados `mysql`. Esta opção deve ser usada sempre que o dump contenha o banco de dados `mysql` e qualquer outro banco de dados que dependa dos dados do banco de dados `mysql` para uma restauração adequada.

Porque o arquivo de depuração contém uma declaração `FLUSH PRIVILEGES`, a recarga do arquivo requer privilégios suficientes para executar essa declaração.

Nota

Para atualizações do MySQL 5.7 ou superior a versões mais antigas, não use `--flush-privileges`. Para obter instruções de atualização neste caso, consulte a Seção 2.10.3, “Alterações no MySQL 5.7”.

* `--lock-all-tables`, `-x`

  <table frame="box" rules="all" summary="Properties for pipe"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--pipe</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>2

Bloquear todas as tabelas em todos os bancos de dados. Isso é alcançado ao adquirir um bloqueio de leitura global pelo período de todo o dump. Esta opção desativa automaticamente `--single-transaction` e `--lock-tables`.

* `--lock-tables`, `-l`

  <table frame="box" rules="all" summary="Properties for pipe"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--pipe</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>3

Para cada banco de dados descartado, bloqueie todas as tabelas que serão descartadas. As tabelas são bloqueadas com `READ LOCAL` para permitir inserções concorrentes no caso das tabelas `MyISAM`. Para tabelas transacionais, como `InnoDB`, `--single-transaction` é uma opção muito melhor do que `--lock-tables`, pois não precisa bloquear as tabelas.

Como o `--lock-tables` bloqueia as tabelas para cada banco de dados separadamente, esta opção não garante que as tabelas no arquivo de dump estejam logicamente consistentes entre os bancos de dados. As tabelas em diferentes bancos de dados podem ser descarregadas em estados completamente diferentes.

Algumas opções, como `--opt`, habilitam automaticamente `--lock-tables`. Se você deseja sobrescrevê-la, use `--skip-lock-tables` no final da lista de opções.

* `--no-autocommit`

  <table frame="box" rules="all" summary="Properties for pipe"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--pipe</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>4

Incorpore as declarações `INSERT` para cada tabela descartada dentro das declarações `SET autocommit = 0` e `COMMIT`.

* `--order-by-primary`

  <table frame="box" rules="all" summary="Properties for pipe"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--pipe</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>5

Exclua as strings de cada tabela, ordenadas por sua chave primária ou pelo seu primeiro índice único, se tal índice existir. Isso é útil ao descartar uma tabela `MyISAM` que será carregada em uma tabela `InnoDB`, mas faz com que a operação de descarte leve consideravelmente mais tempo.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Properties for pipe"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--pipe</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>6

Em Windows, o nome de memória compartilhada a ser usado para conexões feitas usando memória compartilhada a um servidor local. O valor padrão é `MYSQL`. O nome de memória compartilhada é sensível a maiúsculas e minúsculas.

Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

* `--single-transaction`

  <table frame="box" rules="all" summary="Properties for pipe"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--pipe</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>7

Esta opção define o modo de isolamento de transação para `REPEATABLE READ` e envia uma instrução SQL `START TRANSACTION` ao servidor antes de drenar os dados. É útil apenas com tabelas transacionais, como `InnoDB`, porque, então, drenar o estado consistente do banco de dados no momento em que `START TRANSACTION` foi emitido, sem bloquear quaisquer aplicativos.

O privilégio RELOAD ou FLUSH\_TABLES é necessário com `--single-transaction` se ambos gtid\_mode=ON e --set-gtid=purged=ON|AUTO. Esse requisito foi adicionado no MySQL 8.0.32.

Ao usar essa opção, você deve ter em mente que apenas as tabelas `InnoDB` são descarregadas em um estado consistente. Por exemplo, quaisquer tabelas `MyISAM` ou `MEMORY` descarregadas enquanto estiver usando essa opção ainda podem mudar de estado.

Enquanto um descarte `--single-transaction` está em processo, para garantir um arquivo de descarte válido (conteúdo correto das tabelas e coordenadas do log binário), nenhuma outra conexão deve usar as seguintes declarações: `ALTER TABLE`, `CREATE TABLE`, `DROP TABLE`, `RENAME TABLE`, `TRUNCATE TABLE`. Uma leitura consistente não é isolada dessas declarações, então o uso delas em uma tabela a ser descartada pode causar o `SELECT` que é realizado pelo **mysqldump** para recuperar o conteúdo da tabela e obter conteúdos incorretos ou falhar.

A opção `--single-transaction` e a opção `--lock-tables` são mutuamente exclusivas, pois a `LOCK TABLES` faz com que todas as transações pendentes sejam comprometidas implicitamente.

Não é recomendado usar `--single-transaction` juntamente com a opção `--set-gtid-purged`; isso pode levar a inconsistências na saída do **mysqldump**.

Para descartar tabelas grandes, combine a opção `--single-transaction` com a opção `--quick`.

#### Grupos de Opções

* A opção `--opt` ativa vários ajustes que trabalham juntos para realizar uma operação de varredura rápida. Todos esses ajustes estão ativados por padrão, porque `--opt` está ativado por padrão. Assim, você raramente, ou nunca, especifica `--opt`. Em vez disso, você pode desativar esses ajustes como um grupo, especificando `--skip-opt`, e, opcionalmente, reativar certos ajustes especificando as opções associadas posteriormente na string de comando.

* A opção `--compact` desativa várias configurações que controlam se as declarações e comentários opcionais aparecem na saída. Novamente, você pode seguir esta opção com outras opções que reativam certas configurações, ou ativar todas as configurações usando o formulário `--skip-compact`.

Quando você habilita ou desabilita seletivamente o efeito de uma opção de grupo, a ordem é importante, pois as opções são processadas da primeira para a última. Por exemplo, `--disable-keys` `--lock-tables` `--skip-opt` não teria o efeito pretendido; é o mesmo que `--skip-opt` por si só.

#### Exemplos

Para fazer um backup de um banco de dados inteiro:

```sql
mysqldump db_name > backup-file.sql
```

Para carregar o arquivo de depuração de volta no servidor:

```sql
mysql db_name < backup-file.sql
```

Outra maneira de recarregar o arquivo de depuração:

```sql
mysql -e "source /path-to-backup/backup-file.sql" db_name
```

O **mysqldump** também é muito útil para preencher bancos de dados copiando dados de um servidor MySQL para outro:

```sql
mysqldump --opt db_name | mysql --host=remote_host -C db_name
```

Você pode descartar vários bancos de dados com um comando:

```sql
mysqldump --databases db_name1 [db_name2 ...] > my_databases.sql
```

Para descartar todos os bancos de dados, use a opção `--all-databases`:

```sql
mysqldump --all-databases > all_databases.sql
```

Para as tabelas do `InnoDB`, o **mysqldump** oferece uma maneira de fazer um backup online:

```sql
mysqldump --all-databases --master-data --single-transaction > all_databases.sql
```

Este backup adquire um bloqueio de leitura global em todas as tabelas (usando `FLUSH TABLES WITH READ LOCK`) no início do dump. Assim que esse bloqueio é adquirido, as coordenadas do log binário são lidas e o bloqueio é liberado. Se declarações de atualização longas estiverem em execução quando a declaração `FLUSH` é emitida, o servidor MySQL pode ficar parado até que essas declarações terminem. Após isso, o dump se torna livre de bloqueio e não interfere em leituras e escritas nas tabelas. Se as declarações de atualização que o servidor MySQL recebe forem curtas (em termos de tempo de execução), o período inicial de bloqueio não deve ser perceptível, mesmo com muitas atualizações.

Para a recuperação em um ponto no tempo (também conhecida como “roll-forward”, quando você precisa restaurar um backup antigo e refazer as alterações que ocorreram desde esse backup), muitas vezes é útil rotular o log binário (ver Seção 5.4.4, “O Log Binário”) ou, pelo menos, conhecer as coordenadas do log binário para as quais o dump corresponde:

```sql
mysqldump --all-databases --master-data=2 > all_databases.sql
```

Ou:

```sql
mysqldump --all-databases --flush-logs --master-data=2 > all_databases.sql
```

As opções `--master-data` e `--single-transaction` podem ser usadas simultaneamente, o que oferece uma maneira conveniente de fazer um backup online adequado para uso antes da recuperação em um ponto específico, se as tabelas forem armazenadas usando o mecanismo de armazenamento `InnoDB`.

Para mais informações sobre fazer backups, consulte a Seção 7.2, “Métodos de backup de banco de dados”, e a Seção 7.3, “Exemplo de estratégia de backup e recuperação”.

* Para selecionar o efeito de `--opt`, exceto por algumas características, use a opção `--skip` para cada característica. Para desativar inserções extensas e buffer de memória, use `--opt` `--skip-extended-insert` `--skip-quick`. (Na verdade, `--skip-extended-insert` `--skip-quick` é suficiente, pois `--opt` está ativado por padrão.)

* Para reverter `--opt` para todas as funcionalidades, exceto a desativação do índice e o bloqueio da tabela, use `--skip-opt` `--disable-keys` `--lock-tables`.

#### Restrições

O **mysqldump** não devolve o esquema `INFORMATION_SCHEMA`, `performance_schema` ou `sys` por padrão. Para devolve-los, nomeie-os explicitamente na string de comando. Também pode nomeá-los com a opção `--databases`. Para `INFORMATION_SCHEMA` e `performance_schema`, use também a opção `--skip-lock-tables`.

O **mysqldump** não daria o dump do banco de dados de informação do NDB Cluster `ndbinfo`.

O **mysqldump** não daria `InnoDB` `CREATE TABLESPACE` declarações.

O **mysqldump** sempre remove o modo SQL `NO_AUTO_CREATE_USER` porque o `NO_AUTO_CREATE_USER` não é compatível com o MySQL 8.0. Ele permanece removido mesmo ao importar de volta para o MySQL 5.7, o que significa que as rotinas armazenadas podem se comportar de maneira diferente após a restauração de um dump se elas dependerem deste `sql_mode` específico. Ele é removido a partir do **mysqldump** 5.7.24.

Não é recomendado restaurar a partir de um dump feito usando **mysqldump** para um servidor MySQL 5.6.9 ou anterior que tenha GTIDs habilitado. Veja a Seção 16.1.3.6, “Restrições sobre a Replicação com GTIDs”.

O **mysqldump** inclui declarações para recriar as tabelas `general_log` e `slow_query_log` para os dumps do banco de dados `mysql`. O conteúdo das tabelas de log não é descartado.

Se você encontrar problemas ao fazer backup de visualizações devido a privilégios insuficientes, consulte a Seção 23.9, “Restrições em visualizações”, para uma solução alternativa.

### 4.5.5 mysqlimport — Um programa de importação de dados

O cliente **mysqlimport** fornece uma interface de string de comando para a declaração SQL `LOAD DATA`. A maioria das opções do **mysqlimport** corresponde diretamente a cláusulas da sintaxe do `LOAD DATA`. Veja a Seção 13.2.6, “Declaração LOAD DATA”.

Invoque **mysqlimport** da seguinte forma:

```sql
mysqlimport [options] db_name textfile1 [textfile2 ...]
```

Para cada arquivo de texto nomeado na string de comando, o **mysqlimport** remove qualquer extensão do nome do arquivo e usa o resultado para determinar o nome da tabela na qual os conteúdos do arquivo serão importados. Por exemplo, os arquivos com os nomes `patient.txt`, `patient.text` e `patient` seriam todos importados em uma tabela chamada `patient`.

O **mysqlimport** suporta as seguintes opções, que podem ser especificadas na string de comando ou nos grupos `[mysqlimport]` e `[client]` de um arquivo de opções. Para informações sobre arquivos de opções usados por programas MySQL, consulte a Seção 4.2.2.2, “Usando arquivos de opções”.

**Tabela 4.17 Opções de mysqlimport**

<table frame="box" rules="all" summary="Command-line options available for mysqlimport.">
<col style="width: 27%"/>
<col style="width: 50%"/>
<col style="width: 11%"/>
<col style="width: 11%"/>
<thead>
<tr>
<th>Option Name</th>
<th>Description</th>
<th>Introduced</th>
<th>Deprecated</th>
</tr>
</thead>
<tbody>
<tr>
<th><code>--bind-address</code></th>
<td>Use a interface de rede especificada para se conectar ao servidor MySQL</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--character-sets-dir</code></th>
<td>Diretório onde os conjuntos de caracteres podem ser encontrados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--columns</code></th>
<td>Esta opção aceita uma lista de nomes de colunas separados por vírgula como seu valor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--compress</code></th>
<td>Compressar todas as informações enviadas entre o cliente e o servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug</code></th>
<td>Write debugging log</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug-check</code></th>
<td>Imprimir informações de depuração quando o programa sai</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug-info</code></th>
<td>Imprimir informações de depuração, memória e estatísticas de CPU quando o programa sai</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--default-auth</code></th>
<td>Plugin de autenticação a ser utilizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--default-character-set</code></th>
<td>Especificar o conjunto de caracteres padrão</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-extra-file</code></th>
<td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-file</code></th>
<td>Arquivo de opção de leitura apenas nomeado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-group-suffix</code></th>
<td>Valor do sufixo do grupo de opções</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--delete</code></th>
<td>Esvazie a tabela antes de importar o arquivo de texto</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--enable-cleartext-plugin</code></th>
<td>Enable cleartext authentication plugin</td>
<td>5.7.10</td>
<td></td>
</tr>
<tr>
<th><code>--fields-enclosed-by</code></th>
<td>Esta opção tem o mesmo significado que a cláusula correspondente para LOAD DATA</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--fields-escaped-by</code></th>
<td>Esta opção tem o mesmo significado que a cláusula correspondente para LOAD DATA</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--fields-optionally-enclosed-by</code></th>
<td>Esta opção tem o mesmo significado que a cláusula correspondente para LOAD DATA</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--fields-terminated-by</code></th>
<td>Esta opção tem o mesmo significado que a cláusula correspondente para LOAD DATA</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--force</code></th>
<td>Continue mesmo que ocorra um erro SQL</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--get-server-public-key</code></th>
<td>Solicitar chave pública RSA do servidor</td>
<td>5.7.23</td>
<td></td>
</tr>
<tr>
<th><code>--help</code></th>
<td>Exibir mensagem de ajuda e sair</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--host</code></th>
<td>Anfitrião no qual o servidor MySQL está localizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ignore</code></th>
<td>Veja a descrição para a opção --replace</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ignore-lines</code></th>
<td>Ignore as primeiras N strings do arquivo de dados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--lines-terminated-by</code></th>
<td>Esta opção tem o mesmo significado que a cláusula correspondente para LOAD DATA</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--local</code></th>
<td>Leia arquivos de entrada localmente do host do cliente</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--lock-tables</code></th>
<td>Bloquear todas as tabelas para escrita antes de processar quaisquer arquivos de texto</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--login-path</code></th>
<td>Leia as opções de caminho de login a partir de .mylogin.cnf</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--low-priority</code></th>
<td>Use LOW_PRIORITY when loading the table</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--no-defaults</code></th>
<td>Não leia arquivos de opção</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--password</code></th>
<td>Senha para usar ao se conectar ao servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--pipe</code></th>
<td>Conecte-se ao servidor usando um pipe nomeado (apenas Windows)</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--plugin-dir</code></th>
<td>Diretório onde os plugins são instalados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--port</code></th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--print-defaults</code></th>
<td>Print default options</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--protocol</code></th>
<td>Protocolo de transporte a ser utilizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--replace</code></th>
<td>As opções --replace e --ignore controlam o tratamento das strings de entrada que duplicam strings existentes com valores de chave únicos.</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--secure-auth</code></th>
<td>Não envie senhas para o servidor no formato antigo (pré-4.1)</td>
<td></td>
<td>Sim</td>
</tr>
<tr>
<th><code>--server-public-key-path</code></th>
<td>Nome do caminho para o arquivo que contém a chave pública RSA</td>
<td>5.7.23</td>
<td></td>
</tr>
<tr>
<th><code>--shared-memory-base-name</code></th>
<td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--silent</code></th>
<td>Produza a saída apenas quando ocorrerem erros</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--socket</code></th>
<td>Arquivo de socket Unix ou pipe nomeado do Windows a ser usado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl</code></th>
<td>Enable connection encryption</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-ca</code></th>
<td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-capath</code></th>
<td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-cert</code></th>
<td>Arquivo que contém o certificado X.509</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-cipher</code></th>
<td>Cifras permitidas para criptografia de conexão</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-crl</code></th>
<td>Arquivo que contém listas de revogação de certificados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-crlpath</code></th>
<td>Diretório que contém arquivos de lista de revogação de certificados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-key</code></th>
<td>Arquivo que contém a chave X.509</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-mode</code></th>
<td>Estado de segurança desejado da conexão com o servidor</td>
<td>5.7.11</td>
<td></td>
</tr>
<tr>
<th><code>--ssl-verify-server-cert</code></th>
<td>Verifique o nome do host contra a identidade do Nome comum do certificado do servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--tls-version</code></th>
<td>Protocolos TLS permitidos para conexões criptografadas</td>
<td>5.7.10</td>
<td></td>
</tr>
<tr>
<th><code>--use-threads</code></th>
<td>Número de threads para carregamento de arquivos em paralelo</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--user</code></th>
<td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--verbose</code></th>
<td>Verbose mode</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--version</code></th>
<td>Exibir informações da versão e sair</td>
<td></td>
<td></td>
</tr>
</tbody>
</table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Exibir uma mensagem de ajuda e sair.

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

Em um computador com várias interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao servidor MySQL.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

O diretório onde os conjuntos de caracteres são instalados. Veja a Seção 10.15, “Configuração de Conjunto de Caracteres”.

* `--columns=column_list`, `-c column_list`

  <table frame="box" rules="all" summary="Properties for columns"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>

Esta opção recebe uma lista de nomes de coluna separados por vírgula como seu valor. A ordem dos nomes de coluna indica como combinar as colunas do arquivo de dados com as colunas da tabela.

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

Compressa todas as informações enviadas entre o cliente e o servidor, se possível. Veja a Seção 4.2.6, “Controle de Compressão de Conexão”.

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

  <table frame="box" rules="all" summary="Properties for default-character-set"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-character-set=charset_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

Use *`charset_name`* como o conjunto de caracteres padrão. Veja a Seção 10.15, “Configuração do Conjunto de Caracteres”.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>0

Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Veja a Seção 6.2.13, “Autenticação substituível”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>1

Leia este arquivo de opção após o arquivo de opção global, mas (em Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>2

Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Exceção: Mesmo com `--defaults-file`, os programas de cliente leem `.mylogin.cnf`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>3

Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, **mysqlimport** normalmente lê os grupos `[client]` e `[mysqlimport]`. Se esta opção for dada como `--defaults-group-suffix=_other`, **mysqlimport** também lê os grupos `[client_other]` e `[mysqlimport_other]`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--delete`, `-D`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>4

Limpe a tabela antes de importar o arquivo de texto.

* `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>5

Ative o plugin de autenticação de texto claro `mysql_clear_password`. (Veja a Seção 6.4.1.6, “Autenticação de Texto Claro Plugável do Lado do Cliente”).

Essa opção foi adicionada no MySQL 5.7.10.

* `--fields-terminated-by=...`, `--fields-enclosed-by=...`, `--fields-optionally-enclosed-by=...`, `--fields-escaped-by=...`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>6

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>7

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>8

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>9

Essas opções têm o mesmo significado das cláusulas correspondentes para `LOAD DATA`. Veja a Seção 13.2.6, “Instrução LOAD DATA”.

* `--force`, `-f`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>0

Ignore os erros. Por exemplo, se uma tabela para um arquivo de texto não existir, continue processando quaisquer arquivos restantes. Sem `--force`, o **mysqlimport** sai se uma tabela não existir.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>1

Solicitar a chave pública necessária para a troca de senha baseada em par de chaves RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

Para informações sobre o plugin `caching_sha2_password`, consulte a Seção 6.4.1.4, “Cacheamento de Autenticação Alterável SHA-2”.

A opção `--get-server-public-key` foi adicionada no MySQL 5.7.23.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>2

Importe os dados para o servidor MySQL no host fornecido. O host padrão é `localhost`.

* `--ignore`, `-i`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>3

Veja a descrição para a opção `--replace`.

* `--ignore-lines=N`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>4

Ignore as primeiras strings *`N`* do arquivo de dados.

* `--lines-terminated-by=...`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>5

Esta opção tem o mesmo significado que a cláusula correspondente para `LOAD DATA`. Por exemplo, para importar arquivos do Windows que têm strings terminadas com pares de retorno de carro/retorno de string, use `--lines-terminated-by="\r\n"`. (Você pode precisar duplicar as barras invertidas, dependendo das convenções de fuga do seu interpretador de comandos.) Veja a Seção 13.2.6, “Instrução LOAD DATA”.

* `--local`, `-L`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>6

Por padrão, os arquivos são lidos pelo servidor no host do servidor. Com esta opção, o **mysqlimport** lê arquivos de entrada localmente no host do cliente.

O uso bem-sucedido de operações de carregamento `LOCAL` dentro do **mysqlimport** também exige que o servidor permita o carregamento local; veja a Seção 6.1.6, “Considerações de segurança para CARREGAR DADOS LOCAL”

* `--lock-tables`, `-l`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>7

Bloquear *todas* as tabelas para escrita antes de processar quaisquer arquivos de texto. Isso garante que todas as tabelas estejam sincronizadas no servidor.

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>8

Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam para qual servidor MySQL se conectar e qual conta se autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql\_config\_editor**. Veja a Seção 4.6.6, “mysql\_config\_editor — Utilitário de Configuração MySQL”.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--low-priority`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>9

Use `LOW_PRIORITY` ao carregar a tabela. Isso afeta apenas os motores de armazenamento que usam bloqueio apenas em nível de tabela (como `MyISAM`, `MEMORY` e `MERGE`).

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>0

Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para impedir que elas sejam lidas.

A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na string de comando, mesmo quando o `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql\_config\_editor**. Veja a Seção 4.6.6, “mysql\_config\_editor — Ferramenta de Configuração do MySQL”.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>1

A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecida, o **mysqlimport** solicita uma senha. Se for fornecida, não deve haver **espaço** entre `--password=` ou `-p` e a senha que a segue. Se não for especificado nenhum tipo de senha, o padrão é não enviar senha.

Especificar uma senha na string de comando deve ser considerado inseguro. Para evitar fornecer a senha na string de comando, use um arquivo de opção. Consulte a Seção 6.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

Para especificar explicitamente que não há senha e que o **mysqlimport** não deve solicitar uma senha, use a opção `--skip-password`.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>2

Em Windows, conecte-se ao servidor usando um pipe nomeado. Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por pipe nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>3

O diretório onde procurar plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o **mysqlimport** não o encontrar. Veja a Seção 6.2.13, “Autenticação Conectada”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>4

Para conexões TCP/IP, o número de porta a ser utilizado.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>5

Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>6

O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de outro protocolo que não o desejado. Para obter detalhes sobre os valores permitidos, consulte a Seção 4.2.5, “Protocolos de Transporte de Conexão”.

* `--replace`, `-r`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>7

As opções `--replace` e `--ignore` controlam o tratamento das strings de entrada que duplicam strings existentes em valores de chave únicos. Se você especificar `--replace`, as novas strings substituem as strings existentes que têm o mesmo valor de chave única. Se você especificar `--ignore`, as strings de entrada que duplicam uma string existente em um valor de chave única são ignoradas. Se você não especificar nenhuma dessas opções, um erro ocorre quando um valor de chave duplicado é encontrado, e o resto do arquivo de texto é ignorado.

* `--secure-auth`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>8

Não envie senhas para o servidor no formato antigo (pré-4.1). Isso impede conexões, exceto para servidores que usam o formato de senha mais recente.

A partir do MySQL 5.7.5, essa opção é desatualizada; espera-se que ela seja removida em uma versão futura do MySQL. Ela sempre está habilitada e tentar desabilitá-la (`--skip-secure-auth`, `--secure-auth=0`) produz um erro. Antes do MySQL 5.7.5, essa opção está habilitada por padrão, mas pode ser desabilitada.

Nota

As senhas que utilizam o método de hashing pré-4.1 são menos seguras do que as senhas que utilizam o método nativo de hashing de senha e devem ser evitadas. As senhas pré-4.1 são desaconselhadas e o suporte para elas foi removido no MySQL 5.7.5. Para instruções de atualização de conta, consulte a Seção 6.4.1.3, “Migrando para fora do hashing de senha pré-4.1 e do plugin mysql\_old\_password”.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>9

O nome do caminho de um arquivo em formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senha com base em par de chave RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

Para `sha256_password`, esta opção só se aplica se o MySQL foi construído usando OpenSSL.

Para informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 6.4.1.5, “Autenticação substituível SHA-256”, e a Seção 6.4.1.4, “Cache de autenticação substituível SHA-2”.

A opção `--server-public-key-path` foi adicionada no MySQL 5.7.23.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Properties for columns"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>0

Em Windows, o nome de memória compartilhada a ser usado para conexões feitas usando memória compartilhada a um servidor local. O valor padrão é `MYSQL`. O nome de memória compartilhada é sensível a maiúsculas e minúsculas.

Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

* `--silent`, `-s`

  <table frame="box" rules="all" summary="Properties for columns"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>1

Modo silencioso. Produza a saída apenas quando ocorrerem erros.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for columns"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>2

Para conexões a `localhost`, o arquivo de socket Unix a ser usado, ou, no Windows, o nome do pipe nomeado a ser usado.

Em Windows, esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de canal nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--ssl*`

As opções que começam com `--ssl` especificam se deve conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Consulte Opções de comando para conexões criptografadas.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for columns"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>3

Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolo separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 6.3.2, “Protocolos e cifras TLS de conexão criptografada”.

Essa opção foi adicionada no MySQL 5.7.10.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for columns"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>4

O nome de usuário da conta MySQL a ser usado para se conectar ao servidor.

* `--use-threads=N`

  <table frame="box" rules="all" summary="Properties for columns"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>5

Carregue arquivos em paralelo usando *`N`* threads.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for columns"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>6

Modo detalhado. Imprima mais informações sobre o que o programa faz.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for columns"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>7

Exibir informações da versão e sair.

Aqui está uma sessão de exemplo que demonstra o uso do **mysqlimport**:

```sql
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

### 4.5.6 mysqlpump — Um programa de backup de banco de dados

A ferramenta de utilitário cliente **mysqlpump** realiza backups lógicos, produzindo um conjunto de declarações SQL que podem ser executadas para reproduzir as definições originais dos objetos do banco de dados e os dados das tabelas. Ela descarrega um ou mais bancos de dados MySQL para backup ou transferência para outro servidor SQL.

As características do **mysqlpump** incluem:

* Processamento paralelo de bancos de dados e de objetos dentro dos bancos de dados, para acelerar o processo de dump

* Melhor controle sobre quais bancos de dados e objetos de banco de dados (tabelas, programas armazenados, contas de usuário) devem ser descarregados

* descarte de contas de usuários como declarações de gestão de contas (`CREATE USER`, `GRANT`) e não como inserções no banco de dados do sistema `mysql`

* Capacidade de criar saída comprimida * Indicador de progresso (os valores são estimativas) * Para recarga do arquivo de depuração, criação de índice secundário mais rápida para as tabelas `InnoDB` adicionando índices após as strings serem inseridas

O **mysqlpump** requer pelo menos o privilégio `SELECT` para tabelas descarregadas, `SHOW VIEW` para visualizações descarregadas, `TRIGGER` para gatilhos descarregados e `LOCK TABLES` se a opção `--single-transaction` não for usada. O privilégio `SELECT` no banco de dados do sistema `mysql` é necessário para descarregar definições de usuário. Algumas opções podem exigir outros privilégios, conforme indicado nas descrições das opções.

Para recarregar um arquivo de depuração, você deve ter os privilégios necessários para executar as declarações que ele contém, como os privilégios apropriados `CREATE` para objetos criados por essas declarações.

Nota

Um dump feito usando o PowerShell no Windows com redirecionamento de saída cria um arquivo com codificação UTF-16:

```sql
mysqlpump [options] > dump.sql
```

No entanto, o UTF-16 não é permitido como um conjunto de caracteres de conexão (consulte a Seção 10.4, “Conjunto de caracteres de conexão e colagens”), então o arquivo de depuração não é carregado corretamente. Para contornar esse problema, use a opção `--result-file`, que cria a saída no formato ASCII:

```sql
mysqlpump [options] --result-file=dump.sql
```

#### Sintaxe de Invocação do mysqlpump

Por padrão, o **mysqlpump** exibe todos os bancos de dados (com certas exceções mencionadas na restrição do mysqlpump). Para especificar explicitamente esse comportamento, use a opção `--all-databases`:

```sql
mysqlpump --all-databases
```

Para descartar um único banco de dados ou certas tabelas nesse banco de dados, nomeie o banco de dados na string de comando, opcionalmente seguido pelos nomes das tabelas:

```sql
mysqlpump db_name
mysqlpump db_name tbl_name1 tbl_name2 ...
```

Para tratar todos os argumentos de nome como nomes de banco de dados, use a opção `--databases`:

```sql
mysqlpump --databases db_name1 db_name2 ...
```

Por padrão, o **mysqlpump** não densa as definições das contas de usuário, mesmo que você faça o dump do banco de dados do sistema `mysql` que contém as tabelas de concessão. Para drenar o conteúdo das tabelas de concessão como definições lógicas na forma de declarações `CREATE USER` e `GRANT`, use a opção `--users` e suprima todo o dumping do banco de dados:

```sql
mysqlpump --exclude-databases=% --users
```

No comando anterior, `%` é um caractere curinga que corresponde a todos os nomes de banco de dados para a opção `--exclude-databases`.

O **mysqlpump** suporta várias opções para incluir ou excluir bancos de dados, tabelas, programas armazenados e definições de usuário. Veja Seleção de Objeto do mysqlpump.

Para recarregar um arquivo de dump, execute as instruções que ele contém. Por exemplo, use o cliente **mysql**:

```sql
mysqlpump [options] > dump.sql
mysql < dump.sql
```

A discussão a seguir fornece exemplos adicionais de uso do **mysqlpump**.

Para ver uma lista das opções que o **mysqlpump** suporta, execute o comando **mysqlpump --help**.

#### Resumo da Opção mysqlpump

O **mysqlpump** suporta as seguintes opções, que podem ser especificadas na string de comando ou nos grupos `[mysqlpump]` e `[client]` de um arquivo de opções. (Antes do MySQL 5.7.30, o **mysqlpump** lia o grupo `[mysql_dump]` em vez de `[mysqlpump]`. A partir do 5.7.30, `[mysql_dump]` ainda é aceito, mas é descontinuado.) Para informações sobre arquivos de opções usados por programas MySQL, consulte a Seção 4.2.2.2, “Usando arquivos de opções”.

**Tabela 4.18 Opções do mysqlpump**

<table frame="box" rules="all" summary="Command-line options available for mysqlpump.">
<col style="width: 31%"/>
<col style="width: 56%"/>
<col style="width: 12%"/>
<thead>
<tr>
<th>Option Name</th>
<th>Description</th>
<th>Introduced</th>
</tr>
</thead>
<tbody>
<tr>
<th><code>--add-drop-database</code></th>
<td>Adicione a declaração DROP DATABASE antes de cada declaração CREATE DATABASE</td>
<td></td>
</tr>
<tr>
<th><code>--add-drop-table</code></th>
<td>Adicione a declaração DROP TABLE antes de cada declaração CREATE TABLE</td>
<td></td>
</tr>
<tr>
<th><code>--add-drop-user</code></th>
<td>Adicione a declaração DROP USER antes de cada declaração CREATE USER</td>
<td></td>
</tr>
<tr>
<th><code>--add-locks</code></th>
<td>Cerque cada dump de tabela com as instruções LOCK TABLES e UNLOCK TABLES</td>
<td></td>
</tr>
<tr>
<th><code>--all-databases</code></th>
<td>Dump all databases</td>
<td></td>
</tr>
<tr>
<th><code>--bind-address</code></th>
<td>Use a interface de rede especificada para se conectar ao servidor MySQL</td>
<td></td>
</tr>
<tr>
<th><code>--character-sets-dir</code></th>
<td>Diretório onde os conjuntos de caracteres são instalados</td>
<td></td>
</tr>
<tr>
<th><code>--complete-insert</code></th>
<td>Use declarações completas de INSERT que incluam os nomes das colunas</td>
<td></td>
</tr>
<tr>
<th><code>--compress</code></th>
<td>Compressar todas as informações enviadas entre o cliente e o servidor</td>
<td></td>
</tr>
<tr>
<th><code>--compress-output</code></th>
<td>Output compression algorithm</td>
<td></td>
</tr>
<tr>
<th><code>--databases</code></th>
<td>Interprete todos os argumentos de nome como nomes de banco de dados</td>
<td></td>
</tr>
<tr>
<th><code>--debug</code></th>
<td>Write debugging log</td>
<td></td>
</tr>
<tr>
<th><code>--debug-check</code></th>
<td>Imprimir informações de depuração quando o programa sai</td>
<td></td>
</tr>
<tr>
<th><code>--debug-info</code></th>
<td>Imprimir informações de depuração, memória e estatísticas de CPU quando o programa sai</td>
<td></td>
</tr>
<tr>
<th><code>--default-auth</code></th>
<td>Plugin de autenticação a ser utilizado</td>
<td></td>
</tr>
<tr>
<th><code>--default-character-set</code></th>
<td>Especificar o conjunto de caracteres padrão</td>
<td></td>
</tr>
<tr>
<th><code>--default-parallelism</code></th>
<td>Número padrão de threads para processamento paralelo</td>
<td></td>
</tr>
<tr>
<th><code>--defaults-extra-file</code></th>
<td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td>
<td></td>
</tr>
<tr>
<th><code>--defaults-file</code></th>
<td>Arquivo de opção de leitura apenas nomeado</td>
<td></td>
</tr>
<tr>
<th><code>--defaults-group-suffix</code></th>
<td>Valor do sufixo do grupo de opções</td>
<td></td>
</tr>
<tr>
<th><code>--defer-table-indexes</code></th>
<td>Para recarregar, adiar a criação do índice até depois de carregar as strings da tabela</td>
<td></td>
</tr>
<tr>
<th><code>--events</code></th>
<td>Eventos de descarte de bancos de dados descartados</td>
<td></td>
</tr>
<tr>
<th><code>--exclude-databases</code></th>
<td>Bases de dados a excluir do dump</td>
<td></td>
</tr>
<tr>
<th><code>--exclude-events</code></th>
<td>Eventos a serem excluídos do descarte</td>
<td></td>
</tr>
<tr>
<th><code>--exclude-routines</code></th>
<td>Rotinas para excluir do dump</td>
<td></td>
</tr>
<tr>
<th><code>--exclude-tables</code></th>
<td>Tabelas para excluir do dump</td>
<td></td>
</tr>
<tr>
<th><code>--exclude-triggers</code></th>
<td>Triggers para excluir do dump</td>
<td></td>
</tr>
<tr>
<th><code>--exclude-users</code></th>
<td>Usuários a serem excluídos do descarte</td>
<td></td>
</tr>
<tr>
<th><code>--extended-insert</code></th>
<td>Use a sintaxe de inserção de várias strings</td>
<td></td>
</tr>
<tr>
<th><code>--get-server-public-key</code></th>
<td>Solicitar chave pública RSA do servidor</td>
<td>5.7.23</td>
</tr>
<tr>
<th><code>--help</code></th>
<td>Exibir mensagem de ajuda e sair</td>
<td></td>
</tr>
<tr>
<th><code>--hex-blob</code></th>
<td>Armazene colunas binárias usando notação hexadecimal</td>
<td></td>
</tr>
<tr>
<th><code>--host</code></th>
<td>Anfitrião no qual o servidor MySQL está localizado</td>
<td></td>
</tr>
<tr>
<th><code>--include-databases</code></th>
<td>Bases de dados a incluir no dump</td>
<td></td>
</tr>
<tr>
<th><code>--include-events</code></th>
<td>Eventos a incluir no lixo</td>
<td></td>
</tr>
<tr>
<th><code>--include-routines</code></th>
<td>Rotinas a incluir no lixo</td>
<td></td>
</tr>
<tr>
<th><code>--include-tables</code></th>
<td>Tabelas a incluir no dump</td>
<td></td>
</tr>
<tr>
<th><code>--include-triggers</code></th>
<td>Triggers a incluir no dump</td>
<td></td>
</tr>
<tr>
<th><code>--include-users</code></th>
<td>Usuários a incluir no dump</td>
<td></td>
</tr>
<tr>
<th><code>--insert-ignore</code></th>
<td>Escreva INSERT IGNORE em vez de declarações INSERT</td>
<td></td>
</tr>
<tr>
<th><code>--log-error-file</code></th>
<td>Adicione avisos e erros a um arquivo nomeado</td>
<td></td>
</tr>
<tr>
<th><code>--login-path</code></th>
<td>Leia as opções de caminho de login a partir de .mylogin.cnf</td>
<td></td>
</tr>
<tr>
<th><code>--max-allowed-packet</code></th>
<td>Comprimento máximo do pacote para enviar ou receber do servidor</td>
<td></td>
</tr>
<tr>
<th><code>--net-buffer-length</code></th>
<td>Buffer size for TCP/IP and socket communication</td>
<td></td>
</tr>
<tr>
<th><code>--no-create-db</code></th>
<td>Não escreva declarações CREATE DATABASE</td>
<td></td>
</tr>
<tr>
<th><code>--no-create-info</code></th>
<td>Não escreva declarações CREATE TABLE que recriem cada tabela descarregada</td>
<td></td>
</tr>
<tr>
<th><code>--no-defaults</code></th>
<td>Não leia arquivos de opção</td>
<td></td>
</tr>
<tr>
<th><code>--parallel-schemas</code></th>
<td>Specify schema-processing parallelism</td>
<td></td>
</tr>
<tr>
<th><code>--password</code></th>
<td>Senha para usar ao se conectar ao servidor</td>
<td></td>
</tr>
<tr>
<th><code>--plugin-dir</code></th>
<td>Diretório onde os plugins são instalados</td>
<td></td>
</tr>
<tr>
<th><code>--port</code></th>
<td>TCP/IP port number for connection</td>
<td></td>
</tr>
<tr>
<th><code>--print-defaults</code></th>
<td>Print default options</td>
<td></td>
</tr>
<tr>
<th><code>--protocol</code></th>
<td>Protocolo de transporte a ser utilizado</td>
<td></td>
</tr>
<tr>
<th><code>--replace</code></th>
<td>Escreva declarações REPLACE em vez de declarações INSERT</td>
<td></td>
</tr>
<tr>
<th><code>--result-file</code></th>
<td>Saída direta para um arquivo específico</td>
<td></td>
</tr>
<tr>
<th><code>--routines</code></th>
<td>Armazene rotinas armazenadas (procedimentos e funções) de bancos de dados descartados</td>
<td></td>
</tr>
<tr>
<th><code>--secure-auth</code></th>
<td>Não envie senhas para o servidor no formato antigo (pré-4.1)</td>
<td></td>
</tr>
<tr>
<th><code>--server-public-key-path</code></th>
<td>Nome do caminho para o arquivo que contém a chave pública RSA</td>
<td>5.7.23</td>
</tr>
<tr>
<th><code>--set-charset</code></th>
<td>Add SET NAMES default_character_set to output</td>
<td></td>
</tr>
<tr>
<th><code>--set-gtid-purged</code></th>
<td>Whether to add SET @@GLOBAL.GTID_PURGED to output</td>
<td>5.7.18</td>
</tr>
<tr>
<th><code>--single-transaction</code></th>
<td>Tabelas de descarte dentro de uma única transação</td>
<td></td>
</tr>
<tr>
<th><code>--skip-definer</code></th>
<td>Omitar as cláusulas DEFINER e SQL SECURITY das declarações CREATE de vista e programas armazenados</td>
<td></td>
</tr>
<tr>
<th><code>--skip-dump-rows</code></th>
<td>Não descarte strings de tabela</td>
<td></td>
</tr>
<tr>
<th><code>--socket</code></th>
<td>Arquivo de socket Unix ou pipe nomeado do Windows a ser usado</td>
<td></td>
</tr>
<tr>
<th><code>--ssl</code></th>
<td>Enable connection encryption</td>
<td></td>
</tr>
<tr>
<th><code>--ssl-ca</code></th>
<td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td>
<td></td>
</tr>
<tr>
<th><code>--ssl-capath</code></th>
<td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td>
<td></td>
</tr>
<tr>
<th><code>--ssl-cert</code></th>
<td>Arquivo que contém o certificado X.509</td>
<td></td>
</tr>
<tr>
<th><code>--ssl-cipher</code></th>
<td>Cifras permitidas para criptografia de conexão</td>
<td></td>
</tr>
<tr>
<th><code>--ssl-crl</code></th>
<td>Arquivo que contém listas de revogação de certificados</td>
<td></td>
</tr>
<tr>
<th><code>--ssl-crlpath</code></th>
<td>Diretório que contém arquivos de lista de revogação de certificados</td>
<td></td>
</tr>
<tr>
<th><code>--ssl-key</code></th>
<td>Arquivo que contém a chave X.509</td>
<td></td>
</tr>
<tr>
<th><code>--ssl-mode</code></th>
<td>Estado de segurança desejado da conexão com o servidor</td>
<td>5.7.11</td>
</tr>
<tr>
<th><code>--ssl-verify-server-cert</code></th>
<td>Verifique o nome do host contra a identidade do Nome comum do certificado do servidor</td>
<td></td>
</tr>
<tr>
<th><code>--tls-version</code></th>
<td>Protocolos TLS permitidos para conexões criptografadas</td>
<td>5.7.10</td>
</tr>
<tr>
<th><code>--triggers</code></th>
<td>Triggers de descarte para cada tabela descartada</td>
<td></td>
</tr>
<tr>
<th><code>--tz-utc</code></th>
<td>Add SET TIME_ZONE='+00:00' to dump file</td>
<td></td>
</tr>
<tr>
<th><code>--user</code></th>
<td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td>
<td></td>
</tr>
<tr>
<th><code>--users</code></th>
<td>Dump user accounts</td>
<td></td>
</tr>
<tr>
<th><code>--version</code></th>
<td>Exibir informações da versão e sair</td>
<td></td>
</tr>
<tr>
<th><code>--watch-progress</code></th>
<td>Display progress indicator</td>
<td></td>
</tr>
</tbody>
</table>

#### mysqlpump Descrições de opção

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Exibir uma mensagem de ajuda e sair.

* `--add-drop-database`

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>

Escreva uma declaração `DROP DATABASE` antes de cada declaração `CREATE DATABASE`.

* `--add-drop-table`

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>

Escreva uma declaração `DROP TABLE` antes de cada declaração `CREATE TABLE`.

* `--add-drop-user`

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>

Escreva uma declaração `DROP USER` antes de cada declaração `CREATE USER`.

* `--add-locks`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>

Certifique-se de que cada dump de tabela esteja envolto em declarações `LOCK TABLES` e `UNLOCK TABLES`. Isso resulta em inserções mais rápidas quando o arquivo de dump é carregado novamente. Veja a Seção 8.2.4.1, “Otimizando declarações INSERT”.

Esta opção não funciona com paralelismo porque as declarações `INSERT` de diferentes tabelas podem ser intercaladas e `UNLOCK TABLES` após o fim dos insertos de uma tabela pode liberar bloqueios em tabelas para as quais os insertos permanecem.

`--add-locks` e `--single-transaction` são mutuamente exclusivos.

* `--all-databases`, `-A`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>

Descarte todos os bancos de dados (com certas exceções mencionadas nas restrições do mysqlpump). Esse é o comportamento padrão, a menos que outro seja especificado explicitamente.

`--all-databases` e `--databases` são mutuamente exclusivos.

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

Em um computador com várias interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao servidor MySQL.

* `--character-sets-dir=path`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

O diretório onde os conjuntos de caracteres são instalados. Veja a Seção 10.15, “Configuração de Conjunto de Caracteres”.

* `--complete-insert`

  <table frame="box" rules="all" summary="Properties for complete-insert"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--complete-insert</code></td> </tr></tbody></table>

Escreva declarações completas do `INSERT` que incluam os nomes das colunas.

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>0

Compressa todas as informações enviadas entre o cliente e o servidor, se possível. Veja a Seção 4.2.6, “Controle de Compressão de Conexão”.

* `--compress-output=algorithm`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>1

Por padrão, o **mysqlpump** não comprime a saída. Esta opção especifica a compressão da saída usando o algoritmo especificado. Os algoritmos permitidos são `LZ4` e `ZLIB`.

Para descomprimir a saída comprimida, você deve ter um utilitário apropriado. Se os comandos do sistema **lz4** e **openssl zlib** não estiverem disponíveis, a partir do MySQL 5.7.10, as distribuições do MySQL incluem os utilitários **lz4\_decompress** e **zlib\_decompress** que podem ser usados para descomprimir a saída do **mysqlpump** que foi comprimida usando as opções `--compress-output=LZ4` e `--compress-output=ZLIB`. Para mais informações, consulte a Seção 4.8.1, “lz4\_decompress — Descomprima saída comprimida mysqlpump do LZ4”, e a Seção 4.8.5, “zlib\_decompress — Descomprima saída comprimida mysqlpump do ZLIB”.

As alternativas incluem os comandos **lz4** e `openssl` se eles estiverem instalados no seu sistema. Por exemplo, o **lz4** pode descomprimir a saída do `LZ4`:

  ```sql
  lz4 -d input_file output_file
  ```

A saída do `ZLIB` pode ser descomprimida da seguinte forma:

  ```sql
  openssl zlib -d < input_file > output_file
  ```

* `--databases`, `-B`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>2

Normalmente, o **mysqlpump** trata o argumento de nome no comando de string como um nome de banco de dados e quaisquer nomes subsequentes como nomes de tabela. Com esta opção, ele trata todos os argumentos de nome como nomes de banco de dados. As declarações `CREATE DATABASE` são incluídas na saída antes de cada novo banco de dados.

`--all-databases` e `--databases` são mutuamente exclusivos.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>3

Escreva um registro de depuração. Uma string típica *`debug_options`* é `d:t:o,file_name`. O padrão é `d:t:O,/tmp/mysqlpump.trace`.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--debug-check`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>4

Imprima algumas informações de depuração quando o programa sair.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--debug-info`, `-T`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>5

Imprimir informações de depuração e estatísticas de uso de memória e CPU quando o programa sai.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>6

Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Veja a Seção 6.2.13, “Autenticação substituível”.

* `--default-character-set=charset_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>7

Use *`charset_name`* como o conjunto de caracteres padrão. Veja a Seção 10.15, “Configuração do Conjunto de Caracteres”. Se não for especificado nenhum conjunto de caracteres, o **mysqlpump** usa `utf8`.

* `--default-parallelism=N`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>8

O número padrão de threads para cada fila de processamento paralelo. O padrão é 2.

A opção `--parallel-schemas` também afeta o paralelismo e pode ser usada para substituir o número padrão de threads. Para mais informações, consulte o processamento paralelo do mysqlpump.

Com `--default-parallelism=0` e sem as opções de `--parallel-schemas`, o **mysqlpump** funciona como um processo monofila e não cria filas.

Com o paralelismo ativado, é possível que a saída de diferentes bancos de dados seja interligada.

Nota

Antes do MySQL 5.7.11, o uso da opção `--single-transaction` é mutuamente exclusivo com o paralelismo. Para usar `--single-transaction`, desative o paralelismo definindo `--default-parallelism` como 0 e não usando nenhuma instância de `--parallel-schemas`:

  ```sql
  mysqlpump --single-transaction --default-parallelism=0
  ```

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>9

Leia este arquivo de opção após o arquivo de opção global, mas (em Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>0

Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Exceção: Mesmo com `--defaults-file`, os programas de cliente leem `.mylogin.cnf`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>1

Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, o **mysqlpump** normalmente lê os grupos `[client]` e `[mysqlpump]`. Se esta opção for dada como `--defaults-group-suffix=_other`, o **mysqlpump** também lê os grupos `[client_other]` e `[mysqlpump_other]`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--defer-table-indexes`

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>2

Na saída de dump, adiar a criação do índice para cada tabela até que suas strings tenham sido carregadas. Isso funciona para todos os motores de armazenamento, mas para `InnoDB` aplica-se apenas para índices secundários.

Esta opção é ativada por padrão; use `--skip-defer-table-indexes` para desativá-la.

* `--events`

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>3

Inclua eventos do Agendamento de Eventos para os bancos de dados descarregados na saída. O descarregamento de eventos requer os privilégios `EVENT` para esses bancos de dados.

A saída gerada ao usar `--events` contém declarações `CREATE EVENT` para criar os eventos. No entanto, essas declarações não incluem atributos como os timestamps de criação e modificação dos eventos, então, quando os eventos são recarregados, eles são criados com timestamps iguais ao tempo de recarga.

Se você precisar criar eventos com seus atributos de data e hora originais, não use `--events`. Em vez disso, descarregue e recarregue o conteúdo da tabela `mysql.event` diretamente, usando uma conta MySQL que tenha privilégios apropriados para o banco de dados `mysql`.

Esta opção é ativada por padrão; use `--skip-events` para desativá-la.

* `--exclude-databases=db_list`

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>4

Não descarte os bancos de dados em *`db_list`*, que é uma lista de um ou mais nomes de banco de dados separados por vírgula. Múltiplas instâncias desta opção são aditivas. Para mais informações, consulte Seleção de Objeto mysqlpump.

* `--exclude-events=event_list`

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>5

Não descarte os bancos de dados em *`event_list`*, que é uma lista de um ou mais nomes de eventos separados por vírgula. Múltiplas instâncias desta opção são aditivas. Para mais informações, consulte Seleção de Objeto mysqlpump.

* `--exclude-routines=routine_list`

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>6

Não descarte os eventos em *`routine_list`*, que é uma lista de um ou mais nomes de rotinas (procedimento armazenado ou função) separados por vírgula. Múltiplas instâncias desta opção são aditivas. Para mais informações, consulte Seleção de Objeto mysqlpump.

* `--exclude-tables=table_list`

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>7

Não descarte as tabelas em *`table_list`*, que é uma lista de um ou mais nomes de tabela separados por vírgula. Múltiplas instâncias desta opção são aditivas. Para mais informações, consulte Seleção de Objeto mysqlpump.

* `--exclude-triggers=trigger_list`

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>8

Não descarte os gatilhos em *`trigger_list`*, que é uma lista de um ou mais nomes de gatilho separados por vírgula. Instâncias múltiplas desta opção são aditivas. Para mais informações, consulte Seleção de Objeto mysqlpump.

* `--exclude-users=user_list`

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>9

Não descarte as contas do usuário em *`user_list`*, que é uma lista de um ou mais nomes de contas separados por vírgula. Múltiplas instâncias desta opção são aditivas. Para mais informações, consulte Seleção de Objeto mysqlpump.

* `--extended-insert=N`

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>0

Escreva declarações `INSERT` usando sintaxe de várias strings que inclua várias listas `VALUES`. Isso resulta em um arquivo de depuração menor e acelera as inserções quando o arquivo é carregado novamente.

O valor da opção indica o número de strings a serem incluídas em cada declaração `INSERT`. O padrão é 250. Um valor de 1 produz uma declaração `INSERT` por string de tabela.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>1

Solicitar a chave pública necessária para a troca de senha baseada em par de chaves RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

Para informações sobre o plugin `caching_sha2_password`, consulte a Seção 6.4.1.4, “Cacheamento de Autenticação Alterável SHA-2”.

A opção `--get-server-public-key` foi adicionada no MySQL 5.7.23.

* `--hex-blob`

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>2

Arraste colunas binárias usando notação hexadecimal (por exemplo, `'abc'` se torna `0x616263`). Os tipos de dados afetados são os tipos `BINARY`, `VARBINARY`, `BLOB` `BIT`, todos os tipos de dados espaciais e outros tipos de dados não binários quando usados com o conjunto de caracteres `binary`.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>3

Arraste dados do servidor MySQL para o host fornecido.

* `--include-databases=db_list`

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>4

Descarte os bancos de dados em *`db_list`*, que é uma lista de um ou mais nomes de bancos de dados separados por vírgula. O dump inclui todos os objetos nos bancos de dados nomeados. Múltiplas instâncias desta opção são aditivas. Para mais informações, consulte Seleção de Objeto mysqlpump.

* `--include-events=event_list`

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>5

Descarte os eventos em *`event_list`*, que é uma lista de um ou mais nomes de eventos separados por vírgula. Múltiplas instâncias desta opção são aditivas. Para mais informações, consulte Seleção de Objeto mysqlpump.

* `--include-routines=routine_list`

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>6

Descarte as rotinas em *`routine_list`*, que é uma lista de um ou mais nomes de rotinas (procedimento armazenado ou função) separados por vírgula. Múltiplas instâncias desta opção são aditivas. Para mais informações, consulte Seleção de Objeto mysqlpump.

* `--include-tables=table_list`

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>7

Descarte as tabelas em *`table_list`*, que é uma lista de um ou mais nomes de tabela separados por vírgula. Múltiplas instâncias desta opção são aditivas. Para mais informações, consulte Seleção de Objeto mysqlpump.

* `--include-triggers=trigger_list`

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>8

Descarte os gatilhos em *`trigger_list`*, que é uma lista de um ou mais nomes de gatilho separados por vírgula. Múltiplas instâncias desta opção são aditivas. Para mais informações, consulte Seleção de Objeto mysqlpump.

* `--include-users=user_list`

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>9

Descarte as contas de usuário em *`user_list`*, que é uma lista de um ou mais nomes de usuário separados por vírgula. Múltiplas instâncias desta opção são aditivas. Para mais informações, consulte Seleção de Objeto mysqlpump.

* `--insert-ignore`

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>0

Escreva declarações `INSERT IGNORE` em vez de declarações `INSERT`.

* `--log-error-file=file_name`

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>1

Registre as advertências e erros anexando-os ao arquivo nomeado. Se esta opção não for fornecida, o **mysqlpump** escreve advertências e erros na saída padrão de erro.

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>2

Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam para qual servidor MySQL se conectar e qual conta se autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql\_config\_editor**. Veja a Seção 4.6.6, “mysql\_config\_editor — Utilitário de Configuração MySQL”.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--max-allowed-packet=N`

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>3

O tamanho máximo do buffer para comunicação cliente/servidor. O padrão é 24 MB, o máximo é 1 GB.

* `--net-buffer-length=N`

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>4

O tamanho inicial do buffer para a comunicação cliente/servidor. Ao criar declarações `INSERT` de várias strings (como com a opção `--extended-insert`, o **mysqlpump** cria strings com até *`N`* bytes de comprimento. Se você usar esta opção para aumentar o valor, certifique-se de que a variável de sistema do servidor MySQL `net_buffer_length` tenha um valor pelo menos desse tamanho.

* `--no-create-db`

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>5

Suprima quaisquer declarações `CREATE DATABASE` que possam ser incluídas na saída, caso contrário.

* `--no-create-info`, `-t`

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>6

Não escreva declarações `CREATE TABLE` que criem cada tabela descarregada.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>7

Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para impedir que elas sejam lidas.

A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na string de comando, mesmo quando o `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql\_config\_editor**. Veja a Seção 4.6.6, “mysql\_config\_editor — Ferramenta de Configuração do MySQL”.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--parallel-schemas=[N:]db_list`

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>8

Crie uma fila para processar os bancos de dados em *`db_list`*, que é uma lista de um ou mais nomes de bancos de dados separados por vírgula. Se *`N`* for fornecido, a fila usa os threads de *`N`*. Se *`N`* não for fornecido, a opção `--default-parallelism` determina o número de threads da fila.

Múltiplas instâncias desta opção criam múltiplas filas. O **mysqlpump** também cria uma fila padrão para usar em bancos de dados que não são nomeados em nenhuma opção do `--parallel-schemas`, e para drenar definições de usuário se as opções do comando as selecionarem. Para mais informações, consulte o Processamento paralelo do mysqlpump.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>9

A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecida, o **mysqlpump** solicitará uma senha. Se for fornecida, não deve haver **espaço** entre `--password=` ou `-p` e a senha que a segue. Se não for especificado nenhum tipo de senha, o padrão é não enviar senha.

Especificar uma senha na string de comando deve ser considerado inseguro. Para evitar fornecer a senha na string de comando, use um arquivo de opção. Consulte a Seção 6.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

Para especificar explicitamente que não há senha e que o **mysqlpump** não deve solicitar uma senha, use a opção `--skip-password`.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>0

O diretório onde procurar plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o **mysqlpump** não o encontrar. Veja a Seção 6.2.13, “Autenticação Conectada”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>1

Para conexões TCP/IP, o número de porta a ser utilizado.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>2

Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>3

O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de outro protocolo que não o desejado. Para obter detalhes sobre os valores permitidos, consulte a Seção 4.2.5, “Protocolos de Transporte de Conexão”.

* `--replace`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>4

Escreva declarações `REPLACE` em vez de declarações `INSERT`.

* `--result-file=file_name`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>5

Saída direta para o arquivo nomeado. O arquivo de resultado é criado e seus conteúdos anteriores são sobrescritos, mesmo que um erro ocorra durante a geração do dump.

Essa opção deve ser usada no Windows para evitar que os caracteres de nova string `\n` sejam convertidos em sequências de retorno de carro/nova string `\r\n`.

* `--routines`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>6

Inclua rotinas armazenadas (procedimentos e funções) para os bancos de dados descartados na saída. Esta opção requer o privilégio `SELECT` para a tabela `mysql.proc`.

A saída gerada ao usar `--routines` contém as declarações `CREATE PROCEDURE` e `CREATE FUNCTION` para criar as rotinas. No entanto, essas declarações não incluem atributos como os timestamps de criação e modificação das rotinas, então, quando as rotinas são recarregadas, elas são criadas com timestamps iguais ao tempo de recarga.

Se você precisar criar rotinas com seus atributos de marcação de tempo originais, não use `--routines`. Em vez disso, descarregue e recarregue o conteúdo da tabela `mysql.proc` diretamente, usando uma conta MySQL que tenha privilégios apropriados para o banco de dados `mysql`.

Esta opção é ativada por padrão; use `--skip-routines` para desativá-la.

* `--secure-auth`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>7

Não envie senhas para o servidor no formato antigo (pré-4.1). Isso impede conexões, exceto para servidores que usam o formato de senha mais recente.

Essa opção é desatualizada; espere que ela seja removida em uma versão futura do MySQL. Ela sempre está habilitada e tentar desabilitá-la (`--skip-secure-auth`, `--secure-auth=0`) produz um erro.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>8

O nome do caminho de um arquivo em formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senha com base em par de chave RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

Para `sha256_password`, esta opção só se aplica se o MySQL foi construído usando OpenSSL.

Para informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 6.4.1.5, “Autenticação substituível SHA-256”, e a Seção 6.4.1.4, “Cache de autenticação substituível SHA-2”.

A opção `--server-public-key-path` foi adicionada no MySQL 5.7.23.

* `--set-charset`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>9

Escreva `SET NAMES default_character_set` na saída.

Esta opção é ativada por padrão. Para desativá-la e suprimir a declaração `SET NAMES`, use `--skip-set-charset`.

* `--set-gtid-purged=value`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>0

Essa opção permite o controle sobre as informações de ID de transação global (GTID) escritas no arquivo de depuração, indicando se deve adicionar uma declaração `SET @@GLOBAL.gtid_purged` à saída. Essa opção também pode causar a escrita de uma declaração na saída que desabilita o registro binário enquanto o arquivo de depuração está sendo recarregado.

A tabela a seguir mostra os valores de opção permitidos. O valor padrão é `AUTO`.

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>1

A opção `--set-gtid-purged` tem o seguinte efeito no registro binário quando o arquivo de depuração é carregado novamente:

+ `--set-gtid-purged=OFF`: `SET @@SESSION.SQL_LOG_BIN=0;` não é adicionado ao resultado.

+ `--set-gtid-purged=ON`: `SET @@SESSION.SQL_LOG_BIN=0;` é adicionado ao resultado.

+ `--set-gtid-purged=AUTO`: `SET @@SESSION.SQL_LOG_BIN=0;` é adicionado ao resultado se GTIDs estiverem habilitados no servidor que você está fazendo backup (ou seja, se `AUTO` avaliar para `ON`).

Essa opção foi adicionada no MySQL 5.7.18.

* `--single-transaction`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>2

Esta opção define o modo de isolamento de transação para `REPEATABLE READ` e envia uma instrução SQL `START TRANSACTION` ao servidor antes de drenar os dados. É útil apenas com tabelas transacionais, como `InnoDB`, porque, então, drenar o estado consistente do banco de dados no momento em que `START TRANSACTION` foi emitido, sem bloquear quaisquer aplicativos.

Ao usar essa opção, você deve ter em mente que apenas as tabelas `InnoDB` são descarregadas em um estado consistente. Por exemplo, quaisquer tabelas `MyISAM` ou `MEMORY` descarregadas ao usar essa opção ainda podem mudar de estado.

Enquanto um `--single-transaction` está em processo, para garantir um arquivo de depuração válido (conteúdo correto da tabela e coordenadas do log binário), nenhuma outra conexão deve usar as seguintes declarações: `ALTER TABLE`, `CREATE TABLE`, `DROP TABLE`, `RENAME TABLE`, `TRUNCATE TABLE`. Uma leitura consistente não é isolada dessas declarações, então o uso delas em uma tabela a ser depurada pode causar o `SELECT` que é realizado pelo **mysqlpump** para recuperar o conteúdo da tabela e obter conteúdos incorretos ou falhar.

`--add-locks` e `--single-transaction` são mutuamente exclusivos.

Nota

Antes do MySQL 5.7.11, o uso da opção `--single-transaction` é mutuamente exclusivo com o paralelismo. Para usar `--single-transaction`, desative o paralelismo definindo `--default-parallelism` como 0 e não usando nenhuma instância de `--parallel-schemas`:

  ```sql
  mysqlpump --single-transaction --default-parallelism=0
  ```

* `--skip-definer`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>3

Omita as cláusulas `DEFINER` e `SQL SECURITY` das declarações `CREATE` para visualizações e programas armazenados. O arquivo de depuração, quando recarregado, cria objetos que utilizam os valores padrão `DEFINER` e `SQL SECURITY`. Veja a Seção 23.6, “Controle de acesso a objetos armazenados”.

* `--skip-dump-rows`, `-d`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>4

Não descarte as strings da tabela.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>5

Para conexões a `localhost`, o arquivo de socket Unix a ser usado, ou, no Windows, o nome do pipe nomeado a ser usado.

Em Windows, esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de canal nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--ssl*`

As opções que começam com `--ssl` especificam se deve conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Consulte Opções de comando para conexões criptografadas.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>6

Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolo separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 6.3.2, “Protocolos e cifras TLS de conexão criptografada”.

Essa opção foi adicionada no MySQL 5.7.10.

* `--triggers`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>7

Inclua gatilhos para cada tabela descarregada na saída.

Esta opção é ativada por padrão; use `--skip-triggers` para desativá-la.

* `--tz-utc`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>8

Essa opção permite que as colunas `TIMESTAMP` sejam descarregadas e recarregadas entre servidores em diferentes fusos horários. O **mysqlpump** define seu fuso horário de conexão como UTC e adiciona `SET TIME_ZONE='+00:00'` ao arquivo de dump. Sem essa opção, as colunas `TIMESTAMP` são descarregadas e recarregadas nos fusos horários locais dos servidores de origem e destino, o que pode causar alterações nos valores se os servidores estiverem em diferentes fusos horários. `--tz-utc` também protege contra mudanças devido ao horário de verão.

Esta opção é ativada por padrão; use `--skip-tz-utc` para desativá-la.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>9

O nome de usuário da conta MySQL a ser usado para se conectar ao servidor.

* `--users`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>0

Armazene as contas de usuário como definições lógicas na forma de declarações `CREATE USER` e `GRANT`.

As definições do usuário são armazenadas nas tabelas de concessão no banco de dados do sistema `mysql`. Por padrão, o **mysqlpump** não inclui as tabelas de concessão nos backups do banco de dados `mysql`. Para drenar o conteúdo das tabelas de concessão como definições lógicas, use a opção `--users` e suprima todos os backups do banco de dados:

  ```sql
  mysqlpump --exclude-databases=% --users
  ```

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>1

Exibir informações da versão e sair.

* `--watch-progress`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>2

Exiba periodicamente um indicador de progresso que forneça informações sobre o número de tabelas, strings e outros objetos concluídos e o total.

Esta opção é ativada por padrão; use `--skip-watch-progress` para desativá-la.

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

```sql
--exclude-databases=test,world
--include-tables=customer,invoice
```

Os caracteres especiais são permitidos nos nomes dos objetos:

* `%` corresponde a qualquer sequência de zero ou mais caracteres.

* `_` corresponde a qualquer caracter único.

Por exemplo, `--include-tables=t%,__tmp` corresponde a todos os nomes de tabela que começam com `t` e todos os nomes de tabela de cinco caracteres que terminam com `tmp`.

Para os usuários, um nome especificado sem uma parte de host é interpretado com um host implícito de `%`. Por exemplo, `u1` e `u1@%` são equivalentes. Esta é a mesma equivalência que se aplica no MySQL em geral (veja Seção 6.2.4, “Especificação de nomes de conta”).

As opções de inclusão e exclusão interagem da seguinte forma:

* Por padrão, sem opções de inclusão ou exclusão, o **mysqlpump** exibe todos os bancos de dados (com certas exceções mencionadas na restrição do mysqlpump).

* Se as opções de inclusão forem fornecidas na ausência de opções de exclusão, apenas os objetos nomeados como incluídos serão descarregados.

* Se as opções de exclusão forem fornecidas na ausência de opções de inclusão, todos os objetos serão descarregados, exceto aqueles nomeados como excluídos.

* Se as opções de inclusão e exclusão forem fornecidas, todos os objetos nomeados como excluídos e não nomeados como incluídos não serão descarregados. Todos os outros objetos serão descarregados.

Se várias bases de dados estão sendo descarregadas, é possível nomear tabelas, gatilhos e rotinas em uma base de dados específica qualificando os nomes dos objetos com o nome da base de dados. O comando a seguir descarrega as bases de dados `db1` e `db2`, mas exclui as tabelas `db1.t1` e `db2.t2`:

```sql
mysqlpump --include-databases=db1,db2 --exclude-tables=db1.t1,db2.t2
```

As opções a seguir fornecem formas alternativas de especificar quais bancos de dados devem ser descarregados:

* A opção `--all-databases` descarrega todas as bases de dados (com certas exceções mencionadas nas Restrições do mysqlpump). É equivalente a não especificar nenhuma opção de objeto (a ação padrão do **mysqlpump** é descarregar tudo).

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

```sql
mysqlpump --parallel-schemas=db1,db2 --parallel-schemas=db3
```

O **mysqlpump** configura uma fila para processar `db1` e `db2`, outra fila para processar `db3`, e uma fila padrão para processar todos os outros bancos de dados. Todas as filas utilizam dois threads.

```sql
mysqlpump --parallel-schemas=db1,db2 --parallel-schemas=db3
          --default-parallelism=4
```

Isto é o mesmo que o exemplo anterior, exceto que todas as filas utilizam quatro threads.

```sql
mysqlpump --parallel-schemas=5:db1,db2 --parallel-schemas=3:db3
```

A fila para `db1` e `db2` usa cinco threads, a fila para `db3` usa três threads, e a fila padrão usa o padrão de duas threads.

Como um caso especial, com `--default-parallelism=0` e sem opções de `--parallel-schemas`, o **mysqlpump** funciona como um processo monolínio e não cria filas.

Nota

Antes do MySQL 5.7.11, o uso da opção `--single-transaction` é mutuamente exclusivo com o paralelismo. Para usar `--single-transaction`, desative o paralelismo definindo `--default-parallelism` como 0 e não usando nenhuma instância de `--parallel-schemas`:

```sql
mysqlpump --single-transaction --default-parallelism=0
```

#### mysqlpump Restrições

O **mysqlpump** não densa o esquema `INFORMATION_SCHEMA`, `performance_schema`, `ndbinfo` ou `sys` por padrão. Para drenar qualquer um desses, nomeie-os explicitamente na string de comando. Você também pode nomeá-los com a opção `--databases` ou `--include-databases`.

O **mysqlpump** não daria `InnoDB` `CREATE TABLESPACE` declarações.

O **mysqlpump** exibe contas de usuários em forma lógica usando as declarações `CREATE USER` e `GRANT` (por exemplo, quando você usa a opção `--include-users` ou `--users`). Por esse motivo, os backups do banco de dados do sistema `mysql` não incluem, por padrão, as tabelas de concessão que contêm definições de usuário: `user`, `db`, `tables_priv`, `columns_priv`, `procs_priv` ou `proxies_priv`. Para fazer backup de qualquer uma das tabelas de concessão, nomeie o banco de dados `mysql` seguido pelos nomes das tabelas:

```sql
mysqlpump mysql user db ...
```

### 4.5.7 mysqlshow — Exibir informações de banco de dados, tabela e coluna

O cliente **mysqlshow** pode ser usado para ver rapidamente quais bancos de dados existem, suas tabelas ou as colunas ou índices de uma tabela.

O **mysqlshow** fornece uma interface de string de comando para várias instruções SQL `SHOW`. Veja a Seção 13.7.5, “Instruções SHOW”. As mesmas informações podem ser obtidas usando essas instruções diretamente. Por exemplo, você pode executá-las a partir do programa cliente **mysql**.

Invoque o **mysqlshow** da seguinte forma:

```sql
mysqlshow [options] [db_name [tbl_name [col_name]]]
```

* Se não for fornecida uma base de dados, uma lista de nomes de bases de dados é exibida. * Se não for fornecida uma tabela, todas as tabelas correspondentes na base de dados são exibidas.

* Se não for fornecida nenhuma coluna, todas as colunas e tipos de coluna correspondentes na tabela são exibidos.

A saída exibe apenas os nomes dos bancos de dados, tabelas ou colunas para os quais você tem alguns privilégios.

Se o último argumento contiver caracteres de comodinho de shell ou SQL (`*`, `?`, `%` ou `_`), apenas os nomes que são correspondidos pelo comodinho são mostrados. Se um nome de banco de dados contiver quaisquer sublinhados, esses devem ser escapados com uma barra invertida (algumas cartilhas Unix requerem duas) para obter uma lista das tabelas ou colunas adequadas. Os caracteres `*` e `?` são convertidos em caracteres de comodinho SQL `%` e `_`. Isso pode causar alguma confusão quando você tenta exibir as colunas de uma tabela com um `_` no nome, porque, neste caso, **mysqlshow** mostra apenas os nomes de tabela que correspondem ao padrão. Isso é facilmente corrigido adicionando um último `%` na string de comando como um argumento separado.

O **mysqlshow** suporta as seguintes opções, que podem ser especificadas na string de comando ou nos grupos `[mysqlshow]` e `[client]` de um arquivo de opções. Para informações sobre arquivos de opções usados por programas do MySQL, consulte a Seção 4.2.2.2, “Usando arquivos de opções”.

**Tabela 4.19 mysqlshow Opções**

<table frame="box" rules="all" summary="Command-line options available for mysqlshow.">
<col style="width: 27%"/>
<col style="width: 50%"/>
<col style="width: 11%"/>
<col style="width: 11%"/>
<thead>
<tr>
<th>Option Name</th>
<th>Description</th>
<th>Introduced</th>
<th>Deprecated</th>
</tr>
</thead>
<tbody>
<tr>
<th><code>--bind-address</code></th>
<td>Use a interface de rede especificada para se conectar ao servidor MySQL</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--character-sets-dir</code></th>
<td>Diretório onde os conjuntos de caracteres podem ser encontrados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--compress</code></th>
<td>Compressar todas as informações enviadas entre o cliente e o servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--count</code></th>
<td>Mostre o número de strings por tabela</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug</code></th>
<td>Write debugging log</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug-check</code></th>
<td>Imprimir informações de depuração quando o programa sai</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug-info</code></th>
<td>Imprimir informações de depuração, memória e estatísticas de CPU quando o programa sai</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--default-auth</code></th>
<td>Plugin de autenticação a ser utilizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--default-character-set</code></th>
<td>Especificar o conjunto de caracteres padrão</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-extra-file</code></th>
<td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-file</code></th>
<td>Arquivo de opção de leitura apenas nomeado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-group-suffix</code></th>
<td>Valor do sufixo do grupo de opções</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--enable-cleartext-plugin</code></th>
<td>Enable cleartext authentication plugin</td>
<td>5.7.10</td>
<td></td>
</tr>
<tr>
<th><code>--get-server-public-key</code></th>
<td>Solicitar chave pública RSA do servidor</td>
<td>5.7.23</td>
<td></td>
</tr>
<tr>
<th><code>--help</code></th>
<td>Exibir mensagem de ajuda e sair</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--host</code></th>
<td>Anfitrião no qual o servidor MySQL está localizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--keys</code></th>
<td>Show table indexes</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--login-path</code></th>
<td>Leia as opções de caminho de login a partir de .mylogin.cnf</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--no-defaults</code></th>
<td>Não leia arquivos de opção</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--password</code></th>
<td>Senha para usar ao se conectar ao servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--pipe</code></th>
<td>Conecte-se ao servidor usando um pipe nomeado (apenas Windows)</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--plugin-dir</code></th>
<td>Diretório onde os plugins são instalados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--port</code></th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--print-defaults</code></th>
<td>Print default options</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--protocol</code></th>
<td>Protocolo de transporte a ser utilizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--secure-auth</code></th>
<td>Não envie senhas para o servidor no formato antigo (pré-4.1)</td>
<td></td>
<td>Sim</td>
</tr>
<tr>
<th><code>--server-public-key-path</code></th>
<td>Nome do caminho para o arquivo que contém a chave pública RSA</td>
<td>5.7.23</td>
<td></td>
</tr>
<tr>
<th><code>--shared-memory-base-name</code></th>
<td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--show-table-type</code></th>
<td>Mostre uma coluna indicando o tipo de tabela</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--socket</code></th>
<td>Arquivo de socket Unix ou pipe nomeado do Windows a ser usado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl</code></th>
<td>Enable connection encryption</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-ca</code></th>
<td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-capath</code></th>
<td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-cert</code></th>
<td>Arquivo que contém o certificado X.509</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-cipher</code></th>
<td>Cifras permitidas para criptografia de conexão</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-crl</code></th>
<td>Arquivo que contém listas de revogação de certificados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-crlpath</code></th>
<td>Diretório que contém arquivos de lista de revogação de certificados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-key</code></th>
<td>Arquivo que contém a chave X.509</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-mode</code></th>
<td>Estado de segurança desejado da conexão com o servidor</td>
<td>5.7.11</td>
<td></td>
</tr>
<tr>
<th><code>--ssl-verify-server-cert</code></th>
<td>Verifique o nome do host contra a identidade do Nome comum do certificado do servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--status</code></th>
<td>Exibir informações extras sobre cada tabela</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--tls-version</code></th>
<td>Protocolos TLS permitidos para conexões criptografadas</td>
<td>5.7.10</td>
<td></td>
</tr>
<tr>
<th><code>--user</code></th>
<td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--verbose</code></th>
<td>Verbose mode</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--version</code></th>
<td>Exibir informações da versão e sair</td>
<td></td>
<td></td>
</tr>
</tbody>
</table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Exibir uma mensagem de ajuda e sair.

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

Em um computador com várias interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao servidor MySQL.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

O diretório onde os conjuntos de caracteres são instalados. Veja a Seção 10.15, “Configuração de Conjunto de Caracteres”.

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

Compressa todas as informações enviadas entre o cliente e o servidor, se possível. Veja a Seção 4.2.6, “Controle de Compressão de Conexão”.

* `--count`

  <table frame="box" rules="all" summary="Properties for count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--count</code></td> </tr></tbody></table>

Mostre o número de strings por tabela. Isso pode ser lento para tabelas que não são `MyISAM`.

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

  <table frame="box" rules="all" summary="Properties for default-character-set"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-character-set=charset_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

Use *`charset_name`* como o conjunto de caracteres padrão. Veja a Seção 10.15, “Configuração do Conjunto de Caracteres”.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Veja a Seção 6.2.13, “Autenticação substituível”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Leia este arquivo de opção após o arquivo de opção global, mas (em Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Exceção: Mesmo com `--defaults-file`, os programas de cliente leem `.mylogin.cnf`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, **mysqlshow** normalmente lê os grupos `[client]` e `[mysqlshow]`. Se esta opção for dada como `--defaults-group-suffix=_other`, **mysqlshow** também lê os grupos `[client_other]` e `[mysqlshow_other]`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Ative o plugin de autenticação de texto claro `mysql_clear_password`. (Veja a Seção 6.4.1.6, “Autenticação de Texto Claro Plugável do Lado do Cliente”).

Essa opção foi adicionada no MySQL 5.7.10.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Peça ao servidor a chave pública RSA que ele usa para a troca de senha baseada em par de chaves. Esta opção se aplica a clientes que se conectam ao servidor usando uma conta que se autentica com o plugin de autenticação `caching_sha2_password`. Para conexões por contas desse tipo, o servidor não envia a chave pública ao cliente, a menos que seja solicitado. A opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha baseada em RSA não for necessária, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

Para informações sobre o plugin `caching_sha2_password`, consulte a Seção 6.4.1.4, “Cacheamento de Autenticação Alterável SHA-2”.

A opção `--get-server-public-key` foi adicionada no MySQL 5.7.23.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Conecte-se ao servidor MySQL no host fornecido.

* `--keys`, `-k`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Mostrar índices de tabela.

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam para qual servidor MySQL se conectar e qual conta se autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql\_config\_editor**. Veja a Seção 4.6.6, “mysql\_config\_editor — Utilitário de Configuração MySQL”.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para impedir que elas sejam lidas.

A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na string de comando, mesmo quando o `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql\_config\_editor**. Veja a Seção 4.6.6, “mysql\_config\_editor — Ferramenta de Configuração do MySQL”.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysqlshow** solicita uma senha. Se for fornecida, não deve haver espaço entre `--password=` ou `-p` e a senha que a segue. Se não for especificado nenhum tipo de opção de senha, o padrão é não enviar senha.

Especificar uma senha na string de comando deve ser considerado inseguro. Para evitar fornecer a senha na string de comando, use um arquivo de opção. Consulte a Seção 6.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

Para especificar explicitamente que não há senha e que o **mysqlshow** não deve solicitar uma senha, use a opção `--skip-password`.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

Em Windows, conecte-se ao servidor usando um pipe nomeado. Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por pipe nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

O diretório onde procurar plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o **mysqlshow** não o encontrar. Veja a Seção 6.2.13, “Autenticação Conectada”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

Para conexões TCP/IP, o número de porta a ser utilizado.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de outro protocolo que não o desejado. Para obter detalhes sobre os valores permitidos, consulte a Seção 4.2.5, “Protocolos de Transporte de Conexão”.

* `--secure-auth`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

Não envie senhas para o servidor no formato antigo (pré-4.1). Isso impede conexões, exceto para servidores que usam o formato de senha mais recente.

A partir do MySQL 5.7.5, essa opção é desatualizada; espere que ela seja removida em um lançamento futuro do MySQL. Ela sempre está habilitada e tentar desabilitá-la (`--skip-secure-auth`, `--secure-auth=0`) produz um erro. Antes do MySQL 5.7.5, essa opção está habilitada por padrão, mas pode ser desabilitada.

Nota

As senhas que utilizam o método de hashing pré-4.1 são menos seguras do que as senhas que utilizam o método nativo de hashing de senha e devem ser evitadas. As senhas pré-4.1 são desaconselhadas e o suporte para elas foi removido no MySQL 5.7.5. Para instruções de atualização de conta, consulte a Seção 6.4.1.3, “Migrando para fora do hashing de senha pré-4.1 e do plugin mysql\_old\_password”.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

O nome do caminho de um arquivo em formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senha com base em par de chave RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

Para `sha256_password`, esta opção só se aplica se o MySQL foi construído usando OpenSSL.

Para informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 6.4.1.5, “Autenticação substituível SHA-256”, e a Seção 6.4.1.4, “Cache de autenticação substituível SHA-2”.

A opção `--server-public-key-path` foi adicionada no MySQL 5.7.23.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

Em Windows, o nome de memória compartilhada a ser usado para conexões feitas usando memória compartilhada a um servidor local. O valor padrão é `MYSQL`. O nome de memória compartilhada é sensível a maiúsculas e minúsculas.

Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

* `--show-table-type`, `-t`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

Mostre uma coluna indicando o tipo de tabela, como em `SHOW FULL TABLES`. O tipo é `BASE TABLE` ou `VIEW`.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Para conexões a `localhost`, o arquivo de socket Unix a ser usado, ou, no Windows, o nome do pipe nomeado a ser usado.

Em Windows, esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de canal nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--ssl*`

As opções que começam com `--ssl` especificam se deve conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Consulte Opções de comando para conexões criptografadas.

* `--status`, `-i`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Exibir informações extras sobre cada tabela.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolo separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 6.3.2, “Protocolos e cifras TLS de conexão criptografada”.

Essa opção foi adicionada no MySQL 5.7.10.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

O nome de usuário da conta MySQL a ser usado para se conectar ao servidor.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Modo detalhado. Imprima mais informações sobre o que o programa faz. Essa opção pode ser usada várias vezes para aumentar a quantidade de informações.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Exibir informações da versão e sair.

### 4.5.8 mysqlslap — Um cliente de emulação de carga

O **mysqlslap** é um programa de diagnóstico projetado para emular a carga de clientes para um servidor MySQL e relatar o tempo de cada etapa. Funciona como se vários clientes estivessem acessando o servidor.

Invoque o **mysqlslap** da seguinte forma:

```sql
mysqlslap [options]
```

Algumas opções, como `--create` ou `--query`, permitem que você especifique uma string contendo uma declaração SQL ou um arquivo contendo declarações. Se você especificar um arquivo, por padrão, ele deve conter uma declaração por string. (Ou seja, o delimitador de declaração implícito é o caractere de nova string.) Use a opção `--delimiter` para especificar um delimitador diferente, o que permite que você especifique declarações que se estendem por várias strings ou coloque várias declarações em uma única string. Não é possível incluir comentários em um arquivo; o **mysqlslap** não os entende.

**mysqlslap** é executado em três etapas:

1. Crie esquema, tabela e, opcionalmente, quaisquer programas ou dados armazenados para uso no teste. Esta etapa utiliza uma única conexão de cliente.

2. Execute o teste de carga. Esta etapa pode usar muitas conexões do cliente.

3. Limpe (desconecte, descarte a tabela, se especificado). Esta etapa utiliza uma única conexão do cliente.

Exemplos:

Forneça suas próprias instruções de criação e consulta SQL, com 50 clientes fazendo consultas e 200 seleções para cada uma (insira o comando em uma única string):

```sql
mysqlslap --delimiter=";"
  --create="CREATE TABLE a (b int);INSERT INTO a VALUES (23)"
  --query="SELECT * FROM a" --concurrency=50 --iterations=200
```

Peça que o **mysqlslap** construa a declaração SQL da consulta com uma tabela com duas colunas `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT) e três colunas `VARCHAR`. Use cinco clientes fazendo consultas 20 vezes cada um. Não crie a tabela ou insira os dados (ou seja, use o esquema e os dados do teste anterior):

```sql
mysqlslap --concurrency=5 --iterations=20
  --number-int-cols=2 --number-char-cols=3
  --auto-generate-sql
```

Informe ao programa para carregar as declarações SQL de criação, inserção e consulta dos arquivos especificados, onde o arquivo `create.sql` tem várias declarações de criação de tabela delimitadas por `';'` e várias declarações de inserção delimitadas por `';'`. O arquivo `--query` tem várias consultas delimitadas por `';'`. Execute todas as declarações de carregamento, em seguida, execute todas as consultas no arquivo de consulta com cinco clientes (cinco vezes cada):

```sql
mysqlslap --concurrency=5
  --iterations=5 --query=query.sql --create=create.sql
  --delimiter=";"
```

O **mysqlslap** suporta as seguintes opções, que podem ser especificadas na string de comando ou nos grupos `[mysqlslap]` e `[client]` de um arquivo de opções. Para informações sobre arquivos de opções usados por programas do MySQL, consulte a Seção 4.2.2.2, “Usando arquivos de opções”.

**Tabela 4.20 Opções mysqlslap**

<table frame="box" rules="all" summary="Command-line options available for mysqlslap.">
<col style="width: 27%"/>
<col style="width: 50%"/>
<col style="width: 11%"/>
<col style="width: 11%"/>
<thead>
<tr>
<th>Option Name</th>
<th>Description</th>
<th>Introduced</th>
<th>Deprecated</th>
</tr>
</thead>
<tbody>
<tr>
<th><code>--auto-generate-sql</code></th>
<td>Gerar declarações SQL automaticamente quando elas não são fornecidas em arquivos ou usando opções de comando</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--auto-generate-sql-add-autoincrement</code></th>
<td>Add AUTO_INCREMENT column to automatically generated tables</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--auto-generate-sql-execute-number</code></th>
<td>Especifique quantos pedidos devem ser gerados automaticamente</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--auto-generate-sql-guid-primary</code></th>
<td>Adicione uma chave primária baseada em GUID a tabelas geradas automaticamente</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--auto-generate-sql-load-type</code></th>
<td>Especifique o tipo de carga de teste</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--auto-generate-sql-secondary-indexes</code></th>
<td>Especifique quantos índices secundários devem ser adicionados às tabelas geradas automaticamente</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--auto-generate-sql-unique-query-number</code></th>
<td>Quantas consultas diferentes devem ser geradas para testes automáticos</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--auto-generate-sql-unique-write-number</code></th>
<td>Quantas consultas diferentes devem ser geradas para --auto-generate-sql-write-number</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--auto-generate-sql-write-number</code></th>
<td>Quantas inserções de string devem ser realizadas em cada thread</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--commit</code></th>
<td>Quantas declarações executar antes de comprometer</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--compress</code></th>
<td>Compressar todas as informações enviadas entre o cliente e o servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--concurrency</code></th>
<td>Número de clientes a simular ao emitir a declaração SELECT</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--create</code></th>
<td>Arquivo ou cadeia que contém a declaração a ser usada para criar a tabela</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--create-schema</code></th>
<td>Esquema no qual os testes serão executados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--csv</code></th>
<td>Gerar saída no formato de valores separados por vírgula</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug</code></th>
<td>Write debugging log</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug-check</code></th>
<td>Imprimir informações de depuração quando o programa sai</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug-info</code></th>
<td>Imprimir informações de depuração, memória e estatísticas de CPU quando o programa sai</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--default-auth</code></th>
<td>Plugin de autenticação a ser utilizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-extra-file</code></th>
<td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-file</code></th>
<td>Arquivo de opção de leitura apenas nomeado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-group-suffix</code></th>
<td>Valor do sufixo do grupo de opções</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--delimiter</code></th>
<td>Separador a ser usado em declarações SQL</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--detach</code></th>
<td>Desconecte (abra e feche) cada conexão após cada N de declarações</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--enable-cleartext-plugin</code></th>
<td>Habilitar o plugin de autenticação de texto claro</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--engine</code></th>
<td>Motor de armazenamento a ser usado para criar a tabela</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--get-server-public-key</code></th>
<td>Solicitar chave pública RSA do servidor</td>
<td>5.7.23</td>
<td></td>
</tr>
<tr>
<th><code>--help</code></th>
<td>Exibir mensagem de ajuda e sair</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--host</code></th>
<td>Anfitrião no qual o servidor MySQL está localizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--iterations</code></th>
<td>Número de vezes para executar os testes</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--login-path</code></th>
<td>Leia as opções de caminho de login a partir de .mylogin.cnf</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--no-defaults</code></th>
<td>Não leia arquivos de opção</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--no-drop</code></th>
<td>Não descarte nenhum esquema criado durante a execução do teste</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--number-char-cols</code></th>
<td>Número de colunas VARCHAR a serem usadas se --auto-generate-sql for especificado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--number-int-cols</code></th>
<td>Número de colunas INT a serem usadas se --auto-generate-sql for especificado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--number-of-queries</code></th>
<td>Limite cada cliente a aproximadamente esse número de consultas</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--only-print</code></th>
<td>Não conecte-se aos bancos de dados. mysqlslap só imprime o que teria feito</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--password</code></th>
<td>Senha para usar ao se conectar ao servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--pipe</code></th>
<td>Conecte-se ao servidor usando um pipe nomeado (apenas Windows)</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--plugin-dir</code></th>
<td>Diretório onde os plugins são instalados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--port</code></th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--post-query</code></th>
<td>Arquivo ou cadeia contendo a declaração a ser executada após a conclusão dos testes</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--post-system</code></th>
<td>String para executar usando system() após os testes terem sido concluídos</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--pre-query</code></th>
<td>Arquivo ou cadeia contendo a declaração a ser executada antes de executar os testes</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--pre-system</code></th>
<td>String para executar usando system() antes de executar os testes</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--print-defaults</code></th>
<td>Print default options</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--protocol</code></th>
<td>Protocolo de transporte a ser utilizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--query</code></th>
<td>Arquivo ou cadeia contendo a declaração SELECT a ser usada para recuperar dados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--secure-auth</code></th>
<td>Não envie senhas para o servidor no formato antigo (pré-4.1)</td>
<td></td>
<td>Sim</td>
</tr>
<tr>
<th><code>--server-public-key-path</code></th>
<td>Nome do caminho para o arquivo que contém a chave pública RSA</td>
<td>5.7.23</td>
<td></td>
</tr>
<tr>
<th><code>--shared-memory-base-name</code></th>
<td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--silent</code></th>
<td>Silent mode</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--socket</code></th>
<td>Arquivo de socket Unix ou pipe nomeado do Windows a ser usado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--sql-mode</code></th>
<td>Definir o modo SQL para a sessão do cliente</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl</code></th>
<td>Enable connection encryption</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-ca</code></th>
<td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-capath</code></th>
<td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-cert</code></th>
<td>Arquivo que contém o certificado X.509</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-cipher</code></th>
<td>Cifras permitidas para criptografia de conexão</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-crl</code></th>
<td>Arquivo que contém listas de revogação de certificados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-crlpath</code></th>
<td>Diretório que contém arquivos de lista de revogação de certificados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-key</code></th>
<td>Arquivo que contém a chave X.509</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-mode</code></th>
<td>Estado de segurança desejado da conexão com o servidor</td>
<td>5.7.11</td>
<td></td>
</tr>
<tr>
<th><code>--ssl-verify-server-cert</code></th>
<td>Verifique o nome do host contra a identidade do Nome comum do certificado do servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--tls-version</code></th>
<td>Protocolos TLS permitidos para conexões criptografadas</td>
<td>5.7.10</td>
<td></td>
</tr>
<tr>
<th><code>--user</code></th>
<td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--verbose</code></th>
<td>Verbose mode</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--version</code></th>
<td>Exibir informações da versão e sair</td>
<td></td>
<td></td>
</tr>
</tbody>
</table>

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

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-load-type"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-load-type=type</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>mixed</code></td> </tr><tr><th>Valores válidos</th> <td><code>read</code><code>write</code><code>key</code><code>update</code><code>mixed</code></td> </tr></tbody></table>

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

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Quantos insertos de string devem ser realizados. O padrão é 100.

* `--commit=N`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Quantas declarações executar antes de comprometer. O padrão é 0 (nenhuma comissão é feita).

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Compressa todas as informações enviadas entre o cliente e o servidor, se possível. Veja a Seção 4.2.6, “Controle de Compressão de Conexão”.

* `--concurrency=N`, `-c N`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

O número de clientes paralelos a serem simulados.

* `--create=value`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

O arquivo ou a cadeia que contém a declaração a ser usada para criar a tabela.

* `--create-schema=value`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

O esquema no qual os testes devem ser executados.

Nota

Se a opção `--auto-generate-sql` também for fornecida, o **mysqlslap** descarta o esquema no final da execução do teste. Para evitar isso, use também a opção `--no-drop`.

* `--csv[=file_name]`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Gerar a saída no formato de valores separados por vírgula. A saída vai para o arquivo nomeado, ou para a saída padrão se nenhum arquivo for dado.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Escreva um registro de depuração. Uma string típica *`debug_options`* é `d:t:o,file_name`. O padrão é `d:t:o,/tmp/mysqlslap.trace`.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--debug-check`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Imprima algumas informações de depuração quando o programa sair.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--debug-info`, `-T`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Imprimir informações de depuração e estatísticas de uso de memória e CPU quando o programa sai.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Veja a Seção 6.2.13, “Autenticação substituível”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

Leia este arquivo de opção após o arquivo de opção global, mas (em Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Exceção: Mesmo com `--defaults-file`, os programas de cliente leem `.mylogin.cnf`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, **mysqlslap** normalmente lê os grupos `[client]` e `[mysqlslap]`. Se esta opção for dada como `--defaults-group-suffix=_other`, **mysqlslap** também lê os grupos `[client_other]` e `[mysqlslap_other]`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--delimiter=str`, `-F str`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

O delimitador a ser usado em declarações SQL fornecidas em arquivos ou usando opções de comando.

* `--detach=N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

Desconecte (abra e feche novamente) cada conexão após cada declaração *`N`*. O padrão é 0 (as conexões não são desconectadas).

* `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

Ative o plugin de autenticação de texto claro `mysql_clear_password`. (Veja a Seção 6.4.1.6, “Autenticação de Texto Claro Plugável do Lado do Cliente”).

* `--engine=engine_name`, `-e engine_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

O mecanismo de armazenamento a ser usado para criar tabelas.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

Peça ao servidor a chave pública RSA que ele usa para a troca de senha baseada em par de chaves. Esta opção se aplica a clientes que se conectam ao servidor usando uma conta que se autentica com o plugin de autenticação `caching_sha2_password`. Para conexões por contas desse tipo, o servidor não envia a chave pública ao cliente, a menos que seja solicitado. A opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha baseada em RSA não for necessária, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

Para informações sobre o plugin `caching_sha2_password`, consulte a Seção 6.4.1.4, “Cacheamento de Autenticação Alterável SHA-2”.

A opção `--get-server-public-key` foi adicionada no MySQL 5.7.23.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

Conecte-se ao servidor MySQL no host fornecido.

* `--iterations=N`, `-i N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

O número de vezes em que os testes devem ser realizados.

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam para qual servidor MySQL se conectar e qual conta se autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql\_config\_editor**. Veja a Seção 4.6.6, “mysql\_config\_editor — Utilitário de Configuração MySQL”.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--no-drop`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

Evite que o **mysqlslap** elimine qualquer esquema que ele crie durante a execução do teste.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para impedir que elas sejam lidas.

A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na string de comando, mesmo quando o `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql\_config\_editor**. Veja a Seção 4.6.6, “mysql\_config\_editor — Ferramenta de Configuração do MySQL”.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--number-char-cols=N`, `-x N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

O número de colunas `VARCHAR` a serem utilizadas se `--auto-generate-sql` for especificado.

* `--number-int-cols=N`, `-y N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

O número de colunas `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") a serem usadas se `--auto-generate-sql` for especificado.

* `--number-of-queries=N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

Limite cada cliente a aproximadamente esse número de consultas. O contagem de consultas leva em consideração o delimitador da declaração. Por exemplo, se você invocar o **mysqlslap** da seguinte forma, o delimitador `;` é reconhecido para que cada instância da string de consulta seja contada como duas consultas. Como resultado, 5 strings (e não 10) são inseridas.

  ```sql
  mysqlslap --delimiter=";" --number-of-queries=10
            --query="use test;insert into t values(null)"
  ```

* `--only-print`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

Não conecte-se aos bancos de dados. **mysqlslap** apenas imprime o que teria feito.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecida, o **mysqlslap** solicitará uma senha. Se for fornecida, não deve haver *espaço* entre `--password=` ou `-p` e a senha que a segue. Se não for especificado nenhum tipo de opção de senha, o padrão é não enviar senha.

Especificar uma senha na string de comando deve ser considerado inseguro. Para evitar fornecer a senha na string de comando, use um arquivo de opção. Consulte a Seção 6.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

Para especificar explicitamente que não há senha e que o **mysqlslap** não deve solicitar uma senha, use a opção `--skip-password`.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

Em Windows, conecte-se ao servidor usando um pipe nomeado. Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por pipe nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

O diretório onde procurar plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o **mysqlslap** não o encontrar. Veja a Seção 6.2.13, “Autenticação Conectada”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

Para conexões TCP/IP, o número de porta a ser utilizado.

* `--post-query=value`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

O arquivo ou a cadeia que contém a declaração a ser executada após a conclusão dos testes. Essa execução não é contada para fins de cronometragem.

* `--post-system=str`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

A cadeia a ser executada usando `system()` após a conclusão dos testes. Essa execução não é contada para fins de cronometragem.

* `--pre-query=value`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

O arquivo ou a cadeia de caracteres que contém a declaração a ser executada antes de executar os testes. Essa execução não é contada para fins de cronometragem.

* `--pre-system=str`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

A cadeia de caracteres a ser executada usando `system()` antes de executar os testes. Essa execução não é contada para fins de cronometragem.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de outro protocolo que não o desejado. Para obter detalhes sobre os valores permitidos, consulte a Seção 4.2.5, “Protocolos de Transporte de Conexão”.

* `--query=value`, `-q value`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

O arquivo ou a cadeia de caracteres que contém a declaração `SELECT` a ser usada para recuperar dados.

* `--secure-auth`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

Não envie senhas para o servidor no formato antigo (pré-4.1). Isso impede conexões, exceto para servidores que usam o formato de senha mais recente.

A partir do MySQL 5.7.5, essa opção é desatualizada; espere que ela seja removida em um lançamento futuro do MySQL. Ela sempre está habilitada e tentar desabilitá-la (`--skip-secure-auth`, `--secure-auth=0`) produz um erro. Antes do MySQL 5.7.5, essa opção está habilitada por padrão, mas pode ser desabilitada.

Nota

As senhas que utilizam o método de hashing pré-4.1 são menos seguras do que as senhas que utilizam o método nativo de hashing de senha e devem ser evitadas. As senhas pré-4.1 são desaconselhadas e o suporte para elas foi removido no MySQL 5.7.5. Para instruções de atualização de conta, consulte a Seção 6.4.1.3, “Migrando para fora do hashing de senha pré-4.1 e do plugin mysql\_old\_password”.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

O nome do caminho de um arquivo em formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senha com base em par de chave RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

Para `sha256_password`, esta opção só se aplica se o MySQL foi construído usando OpenSSL.

Para informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 6.4.1.5, “Autenticação substituível SHA-256”, e a Seção 6.4.1.4, “Cache de autenticação substituível SHA-2”.

A opção `--server-public-key-path` foi adicionada no MySQL 5.7.23.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

Em Windows, o nome de memória compartilhada a ser usado para conexões feitas usando memória compartilhada a um servidor local. O valor padrão é `MYSQL`. O nome de memória compartilhada é sensível a maiúsculas e minúsculas.

Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

* `--silent`, `-s`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

Modo silencioso. Sem saída.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

Para conexões a `localhost`, o arquivo de socket Unix a ser usado, ou, no Windows, o nome do pipe nomeado a ser usado.

Em Windows, esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de canal nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--sql-mode=mode`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

Defina o modo SQL para a sessão do cliente.

* `--ssl*`

As opções que começam com `--ssl` especificam se deve conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Consulte Opções de comando para conexões criptografadas.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolo separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 6.3.2, “Protocolos e cifras TLS de conexão criptografada”.

Essa opção foi adicionada no MySQL 5.7.10.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

O nome de usuário da conta MySQL a ser usado para se conectar ao servidor.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

Modo detalhado. Imprima mais informações sobre o que o programa faz. Essa opção pode ser usada várias vezes para aumentar a quantidade de informações.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

Exibir informações da versão e sair.

