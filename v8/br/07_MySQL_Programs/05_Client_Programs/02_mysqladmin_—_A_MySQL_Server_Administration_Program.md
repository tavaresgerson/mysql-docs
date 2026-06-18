### 6.5.2 mysqladmin — Um programa de administração do servidor MySQL

O **mysqladmin** é um cliente para realizar operações administrativas. Você pode usá-lo para verificar a configuração do servidor e o status atual, criar e excluir bancos de dados e muito mais.

Invoque o **mysqladmin** da seguinte forma:

```
mysqladmin [options] command [command-arg] [command [command-arg]] ...
```

O **mysqladmin** suporta os seguintes comandos. Alguns comandos aceitam um argumento após o nome do comando.

- `create db_name`

  Crie um novo banco de dados chamado `db_name`.

- `debug`

  Antes do MySQL 8.0.20, informe ao servidor para escrever informações de depuração no log de erro. O usuário conectado deve ter o privilégio `SUPER`. O formato e o conteúdo dessas informações estão sujeitos a alterações.

  Isso inclui informações sobre o Agendamento de Eventos. Veja a Seção 27.4.5, “Status do Agendamento de Eventos”.

- `drop db_name`

  Exclua o banco de dados denominado `db_name` e todas as suas tabelas.

- `extended-status`

  Exiba as variáveis de status do servidor e seus valores.

- `flush-hosts`

  Limpe todas as informações no cache do host. Consulte a Seção 7.1.12.3, “Consultas de DNS e o Cache do Host”.

- `flush-logs [log_type ...]`

  Limpe todos os logs.

  O comando **mysqladmin flush-logs** permite que tipos de log opcionais sejam fornecidos, para especificar quais logs devem ser limpos. Após o comando `flush-logs`, você pode fornecer uma lista separada por espaço de um ou mais dos seguintes tipos de log: `binary`, `engine`, `error`, `general`, `relay`, `slow`. Estes correspondem aos tipos de log que podem ser especificados para a instrução SQL `FLUSH LOGS`.

- `flush-privileges`

  Recarregue as tabelas de subsídios (mesmo que `reload`).

- `flush-status`

  Limpe as variáveis de status.

- `flush-tables`

  Limpe todas as tabelas.

- `flush-threads`

  Limpe o cache de threads.

- `kill id,id,...`

  Mate os threads do servidor. Se vários valores de ID de thread forem fornecidos, não deve haver espaços na lista.

  Para matar threads pertencentes a outros usuários, o usuário conectado deve ter o privilégio `CONNECTION_ADMIN` (ou o privilégio desatualizado `SUPER`).

- `password new_password`

  Defina uma nova senha. Isso altera a senha para `new_password` para a conta que você usa com **mysqladmin** para se conectar ao servidor. Assim, da próxima vez que você invocar **mysqladmin** (ou qualquer outro programa cliente) usando a mesma conta, você deve especificar a nova senha.

  Aviso

  Definir uma senha usando **mysqladmin** deve ser considerado *inseguro*. Em alguns sistemas, sua senha fica visível para programas de status do sistema, como o **ps**, que podem ser invocados por outros usuários para exibir linhas de comando. Os clientes MySQL geralmente sobrescrevem o argumento da senha de linha de comando com zeros durante sua sequência de inicialização. No entanto, ainda há um breve intervalo durante o qual o valor fica visível. Além disso, em alguns sistemas, essa estratégia de sobrescrita é ineficaz e a senha permanece visível para o **ps**. (Sistemas Unix SystemV e talvez outros estão sujeitos a esse problema.)

  Se o valor `new_password` contiver espaços ou outros caracteres especiais para o interpretador de comandos, você precisa colocá-lo entre aspas. No Windows, certifique-se de usar aspas duplas em vez de aspas simples; as aspas simples não são removidas da senha, mas sim interpretadas como parte da senha. Por exemplo:

  ```
  mysqladmin password "my new password"
  ```

  A nova senha pode ser omitida após o comando `password`. Nesse caso, o **mysqladmin** solicita o valor da senha, o que permite evitar a especificação da senha na linha de comando. A omissão do valor da senha deve ser feita apenas se `password` for o último comando na linha de comando do **mysqladmin**. Caso contrário, o próximo argumento é considerado como a senha.

  Cuidado

  Não use este comando se o servidor foi iniciado com a opção `--skip-grant-tables`. Não será aplicada nenhuma alteração de senha. Isso é verdade mesmo se você preceder o comando `password` com `flush-privileges` na mesma linha de comando para reativar as tabelas de concessão, porque a operação de varredura ocorre após a conexão. No entanto, você pode usar **mysqladmin flush-privileges** para reativar as tabelas de concessão e, em seguida, usar um comando separado **mysqladmin password** para alterar a senha.

- `ping`

  Verifique se o servidor está disponível. O status de retorno do **mysqladmin** é 0 se o servidor estiver em execução, 1 se não estiver. Isso é 0 mesmo em caso de um erro como `Access denied`, porque isso significa que o servidor está em execução, mas recusou a conexão, o que é diferente do servidor não estar em execução.

- `processlist`

  Mostre uma lista de threads de servidor ativo. Isso é como a saída da instrução `SHOW PROCESSLIST`. Se a opção `--verbose` for fornecida, a saída é como a da instrução `SHOW FULL PROCESSLIST`. (Veja a Seção 15.7.7.29, “Instrução SHOW PROCESSLIST”.)

- `reload`

  Recarregue as tabelas de subsídios.

- `refresh`

  Limpe todas as tabelas e feche e abra os arquivos de registro.

- `shutdown`

  Pare o servidor.

- `start-replica`

  Comece a replicação em um servidor replica. Use este comando a partir do MySQL 8.0.26.

- `start-slave`

  Comece a replicação em um servidor replica. Use este comando antes do MySQL 8.0.26.

- `status`

  Exiba uma breve mensagem de status do servidor.

- `stop-replica`

  Parar a replicação em um servidor replica. Use este comando a partir do MySQL 8.0.26.

- `stop-slave`

  Parar a replicação em um servidor replica. Use este comando antes do MySQL 8.0.26.

- `variables`

  Exiba as variáveis do sistema do servidor e seus valores.

- `version`

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

- `Uptime`

  O número de segundos que o servidor MySQL está em execução.

- `Threads`

  O número de threads ativas (clientes).

- `Questions`

  O número de perguntas (consultas) dos clientes desde que o servidor foi iniciado.

- `Slow queries`

  O número de consultas que levaram mais de `long_query_time` segundos. Veja a Seção 7.4.5, “O Log de Consultas Lentas”.

- `Opens`

  O número de tabelas que o servidor abriu.

- `Flush tables`

  O número de comandos `flush-*`, `refresh` e `reload` que o servidor executou.

- `Open tables`

  O número de tabelas que estão abertas atualmente.

Se você executar **mysqladmin shutdown** ao se conectar a um servidor local usando um arquivo de socket Unix, o **mysqladmin** aguarda até que o arquivo de ID de processo do servidor seja removido, para garantir que o servidor tenha sido desligado corretamente.

O **mysqladmin** suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysqladmin]` e `[client]` de um arquivo de opções. Para obter informações sobre os arquivos de opções usados pelos programas do MySQL, consulte a Seção 6.2.2.2, “Usando arquivos de opções”.

**Tabela 6.13 Opções mysqladmin**

<table summary="Opções de linha de comando disponíveis para mysqladmin."><thead><tr><th scope="col">Nome da Opção</th> <th scope="col">Descrição</th> <th scope="col">Introduzido</th> <th scope="col">Desatualizado</th> </tr></thead><tbody><tr><th>--bind-address</th> <td>Use a interface de rede especificada para se conectar ao servidor MySQL</td> <td></td> <td></td> </tr><tr><th>--sets-de-caracteres-dir</th> <td>Diretório onde os conjuntos de caracteres podem ser encontrados</td> <td></td> <td></td> </tr><tr><th>--compress</th> <td>Compressar todas as informações enviadas entre o cliente e o servidor</td> <td></td> <td>8.0.18</td> </tr><tr><th>--algoritmos de compressão</th> <td>Algoritmos de compressão permitidos para conexões com o servidor</td> <td>8.0.18</td> <td></td> </tr><tr><th>--connect-timeout</th> <td>Número de segundos antes do tempo limite de conexão</td> <td></td> <td></td> </tr><tr><th>--count</th> <td>Número de iterações para executar o comando repetidamente</td> <td></td> <td></td> </tr><tr><th>--debug</th> <td>Escreva o log de depuração</td> <td></td> <td></td> </tr><tr><th>--debug-check</th> <td>Imprimir informações de depuração quando o programa sai</td> <td></td> <td></td> </tr><tr><th>--debug-info</th> <td>Imprimir informações de depuração, memória e estatísticas da CPU quando o programa sai</td> <td></td> <td></td> </tr><tr><th>--default-auth</th> <td>Plugin de autenticação a ser usado</td> <td></td> <td></td> </tr><tr><th>--default-character-set</th> <td>Especifique o conjunto de caracteres padrão</td> <td></td> <td></td> </tr><tr><th>--defaults-extra-file</th> <td>Leia o arquivo de opção nomeado, além dos arquivos de opção usuais</td> <td></td> <td></td> </tr><tr><th>--defaults-file</th> <td>Arquivo de opção de leitura apenas nomeado</td> <td></td> <td></td> </tr><tr><th>--defaults-group-suffix</th> <td>Valor do sufixo do grupo de opções</td> <td></td> <td></td> </tr><tr><th>--enable-cleartext-plugin</th> <td>Habilitar o plugin de autenticação em texto claro</td> <td></td> <td></td> </tr><tr><th>--force</th> <td>Continue mesmo que ocorra um erro SQL</td> <td></td> <td></td> </tr><tr><th>--get-server-public-key</th> <td>Solicitar chave pública RSA do servidor</td> <td></td> <td></td> </tr><tr><th>--help</th> <td>Exibir mensagem de ajuda e sair</td> <td></td> <td></td> </tr><tr><th>--host</th> <td>Anfitrião no qual o servidor MySQL está localizado</td> <td></td> <td></td> </tr><tr><th>--login-path</th> <td>Leia as opções de caminho de login a partir de .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th>--no-beep</th> <td>Não emita um sinal sonoro quando ocorrerem erros</td> <td></td> <td></td> </tr><tr><th>--no-defaults</th> <td>Não ler arquivos de opção</td> <td></td> <td></td> </tr><tr><th>--senha</th> <td>Senha para usar ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th>--senha1</th> <td>Primeira senha de autenticação multifator a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th>--senha2</th> <td>Segunda senha de autenticação multifator a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th>--senha3</th> <td>Terceira senha de autenticação multifator a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th>--pipe</th> <td>Conecte-se ao servidor usando o pipe nomeado (apenas Windows)</td> <td></td> <td></td> </tr><tr><th>--plugin-dir</th> <td>Diretório onde os plugins são instalados</td> <td></td> <td></td> </tr><tr><th>--port</th> <td>Número de porta TCP/IP para a conexão</td> <td></td> <td></td> </tr><tr><th>--print-defaults</th> <td>Opções padrão de impressão</td> <td></td> <td></td> </tr><tr><th>--protocolo</th> <td>Protocolo de transporte a ser utilizado</td> <td></td> <td></td> </tr><tr><th>--relativo</th> <td>Mostre a diferença entre os valores atuais e anteriores quando usado com a opção --sleep</td> <td></td> <td></td> </tr><tr><th>--server-public-key-path</th> <td>Nome do caminho para o arquivo que contém a chave pública RSA</td> <td></td> <td></td> </tr><tr><th>--shared-memory-base-name</th> <td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td> <td></td> <td></td> </tr><tr><th>--show-warnings</th> <td>Mostrar avisos após a execução da declaração</td> <td></td> <td></td> </tr><tr><th>--shutdown-timeout</th> <td>Número máximo de segundos para esperar pelo desligamento do servidor</td> <td></td> <td></td> </tr><tr><th>--silencioso</th> <td>Modo silencioso</td> <td></td> <td></td> </tr><tr><th>-- dormir</th> <td>Execute comandos repetidamente, dormindo por segundos de atraso entre eles</td> <td></td> <td></td> </tr><tr><th>--socket</th> <td>Arquivo de soquete Unix ou tubo nomeado do Windows a ser usado</td> <td></td> <td></td> </tr><tr><th>--ssl-ca</th> <td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th>--ssl-capath</th> <td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th>--ssl-cert</th> <td>Arquivo que contém o certificado X.509</td> <td></td> <td></td> </tr><tr><th>--ssl-cipher</th> <td>Cifras permitidas para criptografia de conexão</td> <td></td> <td></td> </tr><tr><th>--ssl-crl</th> <td>Arquivo que contém listas de revogação de certificados</td> <td></td> <td></td> </tr><tr><th>--ssl-crlpath</th> <td>Diretório que contém arquivos de lista de revogação de certificados</td> <td></td> <td></td> </tr><tr><th>--ssl-fips-mode</th> <td>Se deve habilitar o modo FIPS no lado do cliente</td> <td></td> <td>8.0.34</td> </tr><tr><th>--ssl-chave</th> <td>Arquivo que contém a chave X.509</td> <td></td> <td></td> </tr><tr><th>--ssl-mode</th> <td>Estado de segurança desejado da conexão com o servidor</td> <td></td> <td></td> </tr><tr><th>--ssl-session-data</th> <td>Arquivo que contém dados da sessão SSL</td> <td>8.0.29</td> <td></td> </tr><tr><th>--ssl-session-data-continue-on-failed-reuse</th> <td>Se estabelecer conexões se a reutilização da sessão falhar</td> <td>8.0.29</td> <td></td> </tr><tr><th>--tls-ciphersuites</th> <td>Cifras TLSv1.3 permitidas para conexões criptografadas</td> <td>8.0.16</td> <td></td> </tr><tr><th>--tls-version</th> <td>Protocolos TLS permitidos para conexões criptografadas</td> <td></td> <td></td> </tr><tr><th>--user</th> <td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th>--verbose</th> <td>Modo verbosos</td> <td></td> <td></td> </tr><tr><th>--version</th> <td>Exibir informações da versão e sair</td> <td></td> <td></td> </tr><tr><th>--vertical</th> <td>Imprimir linhas de saída de consulta verticalmente (uma linha por valor da coluna)</td> <td></td> <td></td> </tr><tr><th>--wait</th> <td>Se a conexão não puder ser estabelecida, aguarde e tente novamente, em vez de abortar</td> <td></td> <td></td> </tr><tr><th>--zstd-compression-level</th> <td>Nível de compressão para conexões com servidores que utilizam compressão zstd</td> <td>8.0.18</td> <td></td> </tr></tbody></table>

- `--help`, `-?`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  Exiba uma mensagem de ajuda e saia.

- `--bind-address=ip_address`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>

  Em um computador com várias interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao servidor MySQL.

- `--character-sets-dir=dir_name`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

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

- `--connect-timeout=value`

  <table summary="Propriedades para connect-timeout"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--connect-timeout=value</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>43200</code>]]</td> </tr></tbody></table>

  O número máximo de segundos antes do tempo limite de conexão. O valor padrão é 43200 (12 horas).

- `--count=N`, `-c N`

  <table summary="Propriedades para contagem"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--count=#</code>]]</td> </tr></tbody></table>

  O número de iterações para executar o comando repetidamente se a opção `--sleep` for fornecida.

- `--debug[=debug_options]`, `-# [debug_options]`

  <table summary="Propriedades para depuração"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--debug[=debug_option<code>d:t:o,/tmp/mysqladmin.trace</code></code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>d:t:o,/tmp/mysqladmin.trace</code>]]</td> </tr></tbody></table>

  Escreva um log de depuração. Uma string típica `debug_options` é `d:t:o,file_name`. O padrão é `d:t:o,/tmp/mysqladmin.trace`.

  Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

- `--debug-check`

  <table summary="Propriedades para verificação de depuração"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--debug-check</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>

  Imprima algumas informações de depuração quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

- `--debug-info`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>0

  Imprima informações de depuração, estatísticas de uso de memória e CPU quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

- `--default-auth=plugin`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>1

  Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Veja a Seção 8.2.17, “Autenticação Personalizável”.

- `--default-character-set=charset_name`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>2

  Use `charset_name` como o conjunto de caracteres padrão. Veja a Seção 12.15, “Configuração do Conjunto de Caracteres”.

- `--defaults-extra-file=file_name`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>3

  Leia este arquivo de opção após o arquivo de opção global, mas (no Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se `file_name` não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--defaults-file=file_name`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>4

  Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou estiver inacessível, ocorrerá um erro. Se `file_name` não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Exceção: Mesmo com `--defaults-file`, os programas de cliente leem `.mylogin.cnf`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--defaults-group-suffix=str`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>5

  Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de `str`. Por exemplo, **mysqladmin** normalmente lê os grupos `[client]` e `[mysqladmin]`. Se esta opção for dada como `--defaults-group-suffix=_other`, **mysqladmin** também lê os grupos `[client_other]` e `[mysqladmin_other]`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--enable-cleartext-plugin`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>6

  Ative o plugin de autenticação de texto claro `mysql_clear_password`. (Consulte a Seção 8.4.1.4, “Autenticação Pluggable de Texto Claro do Cliente”).

- `--force`, `-f`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>7

  Não peça confirmação para o comando `drop db_name`. Com múltiplos comandos, continue mesmo que ocorra um erro.

- `--get-server-public-key`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>8

  Peça à rede o par de chaves públicas necessário para a troca de senhas com base em pares de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

  Para obter informações sobre o plugin `caching_sha2_password`, consulte a Seção 8.4.1.2, “Cacheamento de Autenticação Conectada a SHA-2”.

- `--host=host_name`, `-h host_name`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>9

  Conecte-se ao servidor MySQL no host fornecido.

- `--login-path=name`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>0

  Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam para qual servidor MySQL se conectar e qual conta autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql\_config\_editor**. Veja a Seção 6.6.7, “mysql\_config\_editor — Utilitário de Configuração MySQL”.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--no-beep`, `-b`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>1

  Desative o sinal sonoro de alerta que é emitido por padrão para erros como a falha na conexão com o servidor.

- `--no-defaults`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>2

  Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para impedir que sejam lidas.

  A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar o `.mylogin.cnf`, use o utilitário **mysql\_config\_editor**. Veja a Seção 6.6.7, “mysql\_config\_editor — Utilitário de Configuração do MySQL”.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--password[=password]`, `-p[password]`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>3

  A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysqladmin** solicitará uma senha. Se for fornecida, não deve haver **espaço** entre `--password=` ou `-p` e a senha que o segue. Se nenhuma opção de senha for especificada, o padrão é não enviar senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Consulte a Seção 8.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

  Para especificar explicitamente que não há senha e que o **mysqladmin** não deve solicitar uma senha, use a opção `--skip-password`.

- `--password1[=pass_val]`

  A senha para o fator de autenticação multifator 1 da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysql** solicitará uma. Se for fornecido, não deve haver **espaço** entre `--password1=` e a senha que o segue. Se nenhuma opção de senha for especificada, o padrão é não enviar nenhuma senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Consulte a Seção 8.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

  Para especificar explicitamente que não há senha e que o **mysqladmin** não deve solicitar uma senha, use a opção `--skip-password1`.

  `--password1` e `--password` são sinônimos, assim como `--skip-password1` e `--skip-password`.

- `--password2[=pass_val]`

  A senha para o fator de autenticação multifator 2 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica do `--password1`; consulte a descrição dessa opção para obter detalhes.

- `--password3[=pass_val]`

  A senha para o fator de autenticação multifator 3 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica do `--password1`; consulte a descrição dessa opção para obter detalhes.

- `--pipe`, `-W`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>4

  No Windows, conecte-se ao servidor usando um tubo nomeado. Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por tubo nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

- `--plugin-dir=dir_name`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>5

  O diretório onde procurar por plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o **mysqladmin** não encontrá-lo. Veja a Seção 8.2.17, “Autenticação Personalizável”.

- `--port=port_num`, `-P port_num`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>6

  Para conexões TCP/IP, o número de porta a ser usado.

- `--print-defaults`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>7

  Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>8

  O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de um protocolo diferente do que você deseja. Para obter detalhes sobre os valores permitidos, consulte a Seção 6.2.7, “Protocolos de Transporte de Conexão”.

- `--relative`, `-r`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>9

  Mostre a diferença entre os valores atuais e anteriores quando usado com a opção `--sleep`. Esta opção funciona apenas com o comando `extended-status`.

- `--server-public-key-path=file_name`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>0

  O nome do caminho de um arquivo no formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senhas com par de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

  Para `sha256_password`, esta opção só se aplica se o MySQL foi construído usando o OpenSSL.

  Para obter informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 8.4.1.3, “Autenticação Conectada a SHA-256”, e a Seção 8.4.1.2, “Cache de Autenticação Conectada a SHA-2”.

- `--shared-memory-base-name=name`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>1

  Em Windows, o nome de memória compartilhada a ser usado para conexões feitas usando memória compartilhada para um servidor local. O valor padrão é \[\[`MYSQL`]. O nome de memória compartilhada é sensível a maiúsculas e minúsculas.

  Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

- `--show-warnings`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>2

  Mostrar avisos resultantes da execução de declarações enviadas ao servidor.

- `--shutdown-timeout=value`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>3

  O número máximo de segundos para esperar pelo desligamento do servidor. O valor padrão é 3600 (1 hora).

- `--silent`, `-s`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>4

  Saia silenciosamente se não conseguir estabelecer uma conexão com o servidor.

- `--sleep=delay`, `-i delay`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>5

  Execute comandos repetidamente, dormindo por `delay` segundos entre eles. A opção `--count` determina o número de iterações. Se `--count` não for fornecido, o **mysqladmin** executa comandos indefinidamente até ser interrompido.

- `--socket=path`, `-S path`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>6

  Para conexões ao `localhost`, o arquivo de socket Unix a ser usado ou, no Windows, o nome do tubo nomeado a ser usado.

  No Windows, essa opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de canal nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

- `--ssl*`

  As opções que começam com `--ssl` especificam se você deseja se conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Consulte Opções de comando para conexões criptografadas.

- `--ssl-fips-mode={OFF|ON|STRICT}`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>7

  Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere de outras opções `--ssl-xxx` porque não é usada para estabelecer conexões criptografadas, mas sim para determinar quais operações criptográficas devem ser permitidas. Veja a Seção 8.8, “Suporte FIPS”.

  Estes valores `--ssl-fips-mode` são permitidos:

  - `OFF`: Desative o modo FIPS.
  - `ON`: Habilitar o modo FIPS.
  - `STRICT`: Habilitar o modo FIPS "estricto".

  Nota

  Se o Módulo de Objeto FIPS OpenSSL não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Nesse caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente emita um aviso na inicialização e opere no modo não FIPS.

  A partir do MySQL 8.0.34, essa opção está desatualizada. Espera-se que ela seja removida em uma versão futura do MySQL.

- `--tls-ciphersuites=ciphersuite_list`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>8

  As sequências de cifra permitidas para conexões criptografadas que utilizam TLSv1.3. O valor é uma lista de um ou mais nomes de sequências de cifra separados por vírgula. As sequências de cifra que podem ser nomeadas para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para obter detalhes, consulte a Seção 8.3.2, “Protocolos e cifra de conexão criptografada TLS”.

  Essa opção foi adicionada no MySQL 8.0.16.

- `--tls-version=protocol_list`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>9

  Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolos separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para obter detalhes, consulte a Seção 8.3.2, “Protocolos e cifra TLS de conexão criptografada”.

- `--user=user_name`, `-u user_name`

  <table summary="Propriedades para comprimir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.18</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>0

  O nome de usuário da conta MySQL a ser usado para se conectar ao servidor.

  Se você estiver usando o plugin `Rewriter` com o MySQL 8.0.31 ou posterior, você deve conceder este usuário o privilégio `SKIP_QUERY_REWRITE`.

- `--verbose`, `-v`

  <table summary="Propriedades para comprimir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.18</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>1

  Modo verbose. Imprima mais informações sobre o que o programa faz.

- `--version`, `-V`

  <table summary="Propriedades para comprimir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.18</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>2

  Exibir informações da versão e sair.

- `--vertical`, `-E`

  <table summary="Propriedades para comprimir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.18</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>3

  Imprima a saída verticalmente. Isso é semelhante ao `--relative`, mas imprime a saída verticalmente.

- `--wait[=count]`, `-w[count]`

  <table summary="Propriedades para comprimir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.18</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>4

  Se a conexão não puder ser estabelecida, aguarde e tente novamente, em vez de abortar. Se um valor `count` for fornecido, ele indica o número de vezes para tentar novamente. O padrão é uma vez.

- `--zstd-compression-level=level`

  <table summary="Propriedades para comprimir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.18</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>5

  O nível de compressão a ser usado para conexões com o servidor que utilizam o algoritmo de compressão `zstd`. Os níveis permitidos variam de 1 a 22, com valores maiores indicando níveis crescentes de compressão. O nível de compressão padrão `zstd` é 3. A configuração do nível de compressão não afeta conexões que não utilizam a compressão `zstd`.

  Para obter mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

  Essa opção foi adicionada no MySQL 8.0.18.
