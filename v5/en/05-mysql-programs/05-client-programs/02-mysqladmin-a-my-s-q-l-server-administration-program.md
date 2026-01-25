### 4.5.2 mysqladmin — Um Programa de Administração do Servidor MySQL

O **mysqladmin** é um cliente para a execução de operações administrativas. Você pode usá-lo para verificar a configuração e o status atual do servidor, para criar e remover Databases, e muito mais.

Invoque o **mysqladmin** desta forma:

```sql
mysqladmin [options] command [command-arg] [command [command-arg ...
```

O **mysqladmin** suporta os seguintes comandos. Alguns dos comandos aceitam um argumento após o nome do comando.

* `create db_name`

  Cria um novo Database chamado *`db_name`*.

* `debug`

  Informa ao servidor para escrever informações de debug no log de erro. O usuário conectado deve ter o privilégio `SUPER`. O formato e o conteúdo desta informação estão sujeitos a alterações.

  Isso inclui informações sobre o Event Scheduler. Consulte a Seção 23.4.5, “Status do Event Scheduler”.

* `drop db_name`

  Exclui o Database chamado *`db_name`* e todas as suas tabelas.

* `extended-status`

  Exibe as Status Variables do servidor e seus valores.

* `flush-hosts`

  Libera todas as informações no Host Cache. Consulte a Seção 5.1.11.2, “Consultas DNS e o Host Cache”.

* `flush-logs [log_type ...]`

  Libera todos os logs.

  O comando **mysqladmin flush-logs** permite que tipos de log opcionais sejam fornecidos, para especificar quais logs liberar. Seguindo o comando `flush-logs`, você pode fornecer uma lista separada por espaços de um ou mais dos seguintes tipos de log: `binary`, `engine`, `error`, `general`, `relay`, `slow`. Estes correspondem aos tipos de log que podem ser especificados para a instrução SQL `FLUSH LOGS`.

* `flush-privileges`

  Recarrega as grant tables (o mesmo que `reload`).

* `flush-status`

  Limpa as Status Variables.

* `flush-tables`

  Libera todas as tabelas.

* `flush-threads`

  Libera o Thread Cache.

* `kill id,id,...`

  Encerra Threads do servidor. Se múltiplos valores de ID de Thread forem fornecidos, não deve haver espaços na lista.

  Para encerrar Threads pertencentes a outros usuários, o usuário conectado deve ter o privilégio `SUPER`.

* `old-password new_password`

  Isto é semelhante ao comando `password`, mas armazena a senha usando o formato antigo (pré-4.1) de hashing de senha. (Consulte a Seção 6.1.2.4, “Hashing de Senha no MySQL”.)

  Este comando foi removido no MySQL 5.7.5.

* `password new_password`

  Define uma nova senha. Isso altera a senha para *`new_password`* para a conta que você usa com **mysqladmin** para se conectar ao servidor. Assim, na próxima vez que você invocar **mysqladmin** (ou qualquer outro programa cliente) usando a mesma conta, você deve especificar a nova senha.

  Aviso

  Definir uma senha usando **mysqladmin** deve ser considerado *inseguro*. Em alguns sistemas, sua senha se torna visível para programas de status do sistema, como **ps**, que podem ser invocados por outros usuários para exibir linhas de comando. Clientes MySQL geralmente sobrescrevem o argumento da senha na linha de comando com zeros durante sua sequência de inicialização. No entanto, ainda há um breve intervalo durante o qual o valor é visível. Além disso, em alguns sistemas, esta estratégia de sobrescrita é ineficaz e a senha permanece visível para **ps**. (Sistemas Unix SystemV e talvez outros estão sujeitos a este problema.)

  Se o valor *`new_password`* contiver espaços ou outros caracteres que são especiais para o seu interpretador de comandos, você precisará envolvê-lo em aspas. No Windows, certifique-se de usar aspas duplas em vez de aspas simples; aspas simples não são removidas da senha, mas sim interpretadas como parte dela. Por exemplo:

```sql
  mysqladmin password "my new password"
  ```

  A nova senha pode ser omitida após o comando `password`. Neste caso, o **mysqladmin** solicita o valor da senha, o que permite que você evite especificar a senha na linha de comando. Omitir o valor da senha deve ser feito apenas se `password` for o comando final na linha de comando do **mysqladmin**. Caso contrário, o próximo argumento é considerado a senha.

  Cuidado

  Não use este comando se o servidor foi iniciado com a opção `--skip-grant-tables`. Nenhuma alteração de senha é aplicada. Isso é verdade mesmo se você preceder o comando `password` com `flush-privileges` na mesma linha de comando para reativar as grant tables, pois a operação de flush ocorre após a sua conexão. No entanto, você pode usar **mysqladmin flush-privileges** para reativar a grant table e, em seguida, usar um comando **mysqladmin password** separado para alterar a senha.

* `ping`

  Verifica se o servidor está disponível. O status de retorno do **mysqladmin** é 0 se o servidor estiver em execução, e 1 se não estiver. Este valor é 0 mesmo no caso de um erro como `Access denied`, porque isso significa que o servidor está em execução, mas recusou a conexão, o que é diferente do servidor não estar em execução.

* `processlist`

  Mostra uma lista de Threads ativas do servidor. Isso é semelhante à saída da instrução `SHOW PROCESSLIST`. Se a opção `--verbose` for fornecida, a saída será como a de `SHOW FULL PROCESSLIST`. (Consulte a Seção 13.7.5.29, “Instrução SHOW PROCESSLIST”.)

* `reload`

  Recarrega as grant tables.

* `refresh`

  Libera todas as tabelas e fecha e abre arquivos de log.

* `shutdown`

  Para o servidor.

* `start-slave`

  Inicia a replicação em um servidor réplica.

* `status`

  Exibe uma mensagem curta de Status do servidor.

* `stop-slave`

  Para a replicação em um servidor réplica.

* `variables`

  Exibe as System Variables do servidor e seus valores.

* `version`

  Exibe informações de versão do servidor.

Todos os comandos podem ser abreviados para qualquer prefixo exclusivo. Por exemplo:

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

  O número de Threads ativas (clientes).

* `Questions`

  O número de Questions (Queries) de clientes desde que o servidor foi iniciado.

* `Slow queries`

  O número de Queries que levaram mais de `long_query_time` segundos. Consulte a Seção 5.4.5, “O Log de Slow Query”.

* `Opens`

  O número de tabelas que o servidor abriu.

* `Flush tables`

  O número de comandos `flush-*`, `refresh` e `reload` que o servidor executou.

* `Open tables`

  O número de tabelas que estão atualmente abertas.

Se você executar **mysqladmin shutdown** ao se conectar a um servidor local usando um arquivo de Unix socket, o **mysqladmin** aguarda até que o arquivo de ID de processo do servidor seja removido, para garantir que o servidor parou corretamente.

O **mysqladmin** suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysqladmin]` e `[client]` de um arquivo de opção. Para obter informações sobre arquivos de opção usados por programas MySQL, consulte a Seção 4.2.2.2, “Usando Arquivos de Opção”.

**Tabela 4.14 Opções do mysqladmin**

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para mysqladmin."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th>Nome da Opção</th> <th>Descrição</th> <th>Introduzido</th> <th>Obsoleto</th> </tr></thead><tbody><tr><th>--bind-address</th> <td>Use a interface de rede especificada para conectar-se ao MySQL Server</td> <td></td> <td></td> </tr><tr><th>--character-sets-dir</th> <td>Diretório onde os character sets podem ser encontrados</td> <td></td> <td></td> </tr><tr><th>--compress</th> <td>Compacta todas as informações enviadas entre o cliente e o servidor</td> <td></td> <td></td> </tr><tr><th>--connect-timeout</th> <td>Número de segundos antes do timeout de conexão</td> <td></td> <td></td> </tr><tr><th>--count</th> <td>Número de iterações para execução repetida de comandos</td> <td></td> <td></td> </tr><tr><th>--debug</th> <td>Escreve o log de debug</td> <td></td> <td></td> </tr><tr><th>--debug-check</th> <td>Imprime informações de debug quando o programa é encerrado</td> <td></td> <td></td> </tr><tr><th>--debug-info</th> <td>Imprime informações de debug, memória e estatísticas de CPU quando o programa é encerrado</td> <td></td> <td></td> </tr><tr><th>--default-auth</th> <td>Plugin de autenticação a ser usado</td> <td></td> <td></td> </tr><tr><th>--default-character-set</th> <td>Especifica o character set padrão</td> <td></td> <td></td> </tr><tr><th>--defaults-extra-file</th> <td>Lê o arquivo de opção nomeado, além dos arquivos de opção usuais</td> <td></td> <td></td> </tr><tr><th>--defaults-file</th> <td>Lê apenas o arquivo de opção nomeado</td> <td></td> <td></td> </tr><tr><th>--defaults-group-suffix</th> <td>Valor do sufixo do grupo de opções</td> <td></td> <td></td> </tr><tr><th>--enable-cleartext-plugin</th> <td>Habilita o plugin de autenticação cleartext</td> <td></td> <td></td> </tr><tr><th>--force</th> <td>Continua mesmo se ocorrer um erro SQL</td> <td></td> <td></td> </tr><tr><th>--get-server-public-key</th> <td>Solicita a chave pública RSA do servidor</td> <td>5.7.23</td> <td></td> </tr><tr><th>--help</th> <td>Exibe mensagem de ajuda e sai</td> <td></td> <td></td> </tr><tr><th>--host</th> <td>Host onde o MySQL server está localizado</td> <td></td> <td></td> </tr><tr><th>--login-path</th> <td>Lê opções de login path a partir de .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th>--no-beep</th> <td>Não emite som de bipe quando ocorrem erros</td> <td></td> <td></td> </tr><tr><th>--no-defaults</th> <td>Não lê arquivos de opção</td> <td></td> <td></td> </tr><tr><th>--password</th> <td>Senha a ser usada ao conectar-se ao servidor</td> <td></td> <td></td> </tr><tr><th>--pipe</th> <td>Conecta-se ao servidor usando named pipe (somente Windows)</td> <td></td> <td></td> </tr><tr><th>--plugin-dir</th> <td>Diretório onde os plugins estão instalados</td> <td></td> <td></td> </tr><tr><th>--port</th> <td>Número da porta TCP/IP para conexão</td> <td></td> <td></td> </tr><tr><th>--print-defaults</th> <td>Imprime as opções padrão</td> <td></td> <td></td> </tr><tr><th>--protocol</th> <td>Protocolo de transporte a ser usado</td> <td></td> <td></td> </tr><tr><th>--relative</th> <td>Mostra a diferença entre os valores atual e anterior quando usado com a opção --sleep</td> <td></td> <td></td> </tr><tr><th>--secure-auth</th> <td>Não envia senhas ao servidor no formato antigo (pré-4.1)</td> <td></td> <td>Sim</td> </tr><tr><th>--server-public-key-path</th> <td>Nome do caminho para o arquivo contendo a chave pública RSA</td> <td>5.7.23</td> <td></td> </tr><tr><th>--shared-memory-base-name</th> <td>Nome da shared memory para conexões de shared memory (somente Windows)</td> <td></td> <td></td> </tr><tr><th>--show-warnings</th> <td>Mostra warnings após a execução da instrução</td> <td></td> <td></td> </tr><tr><th>--shutdown-timeout</th> <td>O número máximo de segundos para aguardar o shutdown do servidor</td> <td></td> <td></td> </tr><tr><th>--silent</th> <td>Modo silencioso</td> <td></td> <td></td> </tr><tr><th>--sleep</th> <td>Executa comandos repetidamente, dormindo por 'delay' segundos entre eles</td> <td></td> <td></td> </tr><tr><th>--socket</th> <td>Arquivo de Unix socket ou named pipe do Windows a ser usado</td> <td></td> <td></td> </tr><tr><th>--ssl</th> <td>Habilita a criptografia da conexão</td> <td></td> <td></td> </tr><tr><th>--ssl-ca</th> <td>Arquivo que contém a lista de Certificate Authorities SSL confiáveis</td> <td></td> <td></td> </tr><tr><th>--ssl-capath</th> <td>Diretório que contém arquivos de certificado de Certificate Authority SSL confiáveis</td> <td></td> <td></td> </tr><tr><th>--ssl-cert</th> <td>Arquivo que contém certificado X.509</td> <td></td> <td></td> </tr><tr><th>--ssl-cipher</th> <td>Cifras permitidas para criptografia de conexão</td> <td></td> <td></td> </tr><tr><th>--ssl-crl</th> <td>Arquivo que contém listas de revogação de certificados</td> <td></td> <td></td> </tr><tr><th>--ssl-crlpath</th> <td>Diretório que contém arquivos de lista de revogação de certificados</td> <td></td> <td></td> </tr><tr><th>--ssl-key</th> <td>Arquivo que contém a chave X.509</td> <td></td> <td></td> </tr><tr><th>--ssl-mode</th> <td>Estado de segurança desejado da conexão com o servidor</td> <td>5.7.11</td> <td></td> </tr><tr><th>--ssl-verify-server-cert</th> <td>Verifica o nome do host em relação à identidade Common Name do certificado do servidor</td> <td></td> <td></td> </tr><tr><th>--tls-version</th> <td>Protocolos TLS permitidos para conexões criptografadas</td> <td>5.7.10</td> <td></td> </tr><tr><th>--user</th> <td>Nome de usuário MySQL a ser usado ao conectar-se ao servidor</td> <td></td> <td></td> </tr><tr><th>--verbose</th> <td>Modo verboso</td> <td></td> <td></td> </tr><tr><th>--version</th> <td>Exibe informações de versão e sai</td> <td></td> <td></td> </tr><tr><th>--vertical</th> <td>Imprime linhas de saída de Query verticalmente (uma linha por valor de coluna)</td> <td></td> <td></td> </tr><tr><th>--wait</th> <td>Se a conexão não puder ser estabelecida, aguarda e tenta novamente em vez de abortar</td> <td></td> <td></td> </tr></tbody></table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Exibe uma mensagem de ajuda e sai.

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Em um computador com múltiplas interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao MySQL server.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  O diretório onde os character sets estão instalados. Consulte a Seção 10.15, “Configuração de Character Set”.

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Propriedades para compress"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Compacta todas as informações enviadas entre o cliente e o servidor, se possível. Consulte a Seção 4.2.6, “Controle de Compressão de Conexão”.

* `--connect-timeout=value`

  <table frame="box" rules="all" summary="Propriedades para connect-timeout"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--connect-timeout=value</code></td> </tr><tr><th>Tipo</th> <td>Numeric</td> </tr><tr><th>Valor Padrão</th> <td><code>43200</code></td> </tr></tbody></table>

  O número máximo de segundos antes do timeout da conexão. O valor padrão é 43200 (12 horas).

* `--count=N`, `-c N`

  <table frame="box" rules="all" summary="Propriedades para count"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--count=#</code></td> </tr></tbody></table>

  O número de iterações a serem feitas para execução repetida de comandos se a opção `--sleep` for fornecida.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Propriedades para debug"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--debug[=debug_options]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>d:t:o,/tmp/mysqladmin.trace</code></td> </tr></tbody></table>

  Escreve um log de debug. Uma string *`debug_options`* típica é `d:t:o,file_name`. O padrão é `d:t:o,/tmp/mysqladmin.trace`.

  Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando esta opção.

* `--debug-check`

  <table frame="box" rules="all" summary="Propriedades para debug-check"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--debug-check</code></td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Imprime algumas informações de debug quando o programa é encerrado.

  Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando esta opção.

* `--debug-info`

  <table frame="box" rules="all" summary="Propriedades para debug-info"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--debug-info</code></td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Imprime informações de debug e estatísticas de uso de memória e CPU quando o programa é encerrado.

  Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando esta opção.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Uma dica sobre qual plugin de autenticação do lado do cliente usar. Consulte a Seção 6.2.13, “Autenticação Plugável”.

* `--default-character-set=charset_name`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Usa *`charset_name`* como o character set padrão. Consulte a Seção 10.15, “Configuração de Character Set”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Lê este arquivo de opção após o arquivo de opção global, mas (no Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou for inacessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para informações adicionais sobre esta e outras opções de arquivos de opção, consulte a Seção 4.2.2.3, “Opções de Linha de Comando que Afetam o Manuseio de Arquivos de Opção”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Usa apenas o arquivo de opção fornecido. Se o arquivo não existir ou for inacessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Exceção: Mesmo com `--defaults-file`, programas cliente leem `.mylogin.cnf`.

  Para informações adicionais sobre esta e outras opções de arquivos de opção, consulte a Seção 4.2.2.3, “Opções de Linha de Comando que Afetam o Manuseio de Arquivos de Opção”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Lê não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, o **mysqladmin** normalmente lê os grupos `[client]` e `[mysqladmin]`. Se esta opção for fornecida como `--defaults-group-suffix=_other`, o **mysqladmin** também lerá os grupos `[client_other]` e `[mysqladmin_other]`.

  Para informações adicionais sobre esta e outras opções de arquivos de opção, consulte a Seção 4.2.2.3, “Opções de Linha de Comando que Afetam o Manuseio de Arquivos de Opção”.

* `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Habilita o plugin de autenticação cleartext `mysql_clear_password`. (Consulte a Seção 6.4.1.6, “Autenticação Plugável Cleartext do Lado do Cliente”).

* `--force`, `-f`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Não solicita confirmação para o comando `drop db_name`. Com múltiplos comandos, continua mesmo que ocorra um erro.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Solicita ao servidor a chave pública necessária para a troca de senha baseada em par de chaves RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública, a menos que seja solicitada. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

  Para obter informações sobre o plugin `caching_sha2_password`, consulte a Seção 6.4.1.4, “Autenticação Plugável Caching SHA-2”.

  A opção `--get-server-public-key` foi adicionada no MySQL 5.7.23.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Conecta-se ao MySQL server no host fornecido.

* `--login-path=name`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Lê opções do login path nomeado no arquivo de login path `.mylogin.cnf`. Um “login path” é um grupo de opções que especificam a qual MySQL server se conectar e com qual conta autenticar. Para criar ou modificar um arquivo de login path, use o utilitário **mysql_config_editor**. Consulte a Seção 4.6.6, “mysql_config_editor — Utilitário de Configuração do MySQL”.

  Para informações adicionais sobre esta e outras opções de arquivos de opção, consulte a Seção 4.2.2.3, “Opções de Linha de Comando que Afetam o Manuseio de Arquivos de Opção”.

* `--no-beep`, `-b`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Suprime o bipe de aviso que é emitido por padrão para erros, como uma falha ao conectar-se ao servidor.

* `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Não lê nenhum arquivo de opção. Se a inicialização do programa falhar devido à leitura de opções desconhecidas de um arquivo de opção, `--no-defaults` pode ser usado para impedir que sejam lidas.

  A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de forma mais segura do que na linha de comando, mesmo quando `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql_config_editor**. Consulte a Seção 4.6.6, “mysql_config_editor — Utilitário de Configuração do MySQL”.

  Para informações adicionais sobre esta e outras opções de arquivos de opção, consulte a Seção 4.2.2.3, “Opções de Linha de Comando que Afetam o Manuseio de Arquivos de Opção”.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysqladmin** solicitará uma. Se fornecido, não deve haver *nenhum espaço* entre `--password=` ou `-p` e a senha que o segue. Se nenhuma opção de senha for especificada, o padrão é não enviar nenhuma senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Consulte a Seção 6.1.2.1, “Diretrizes do Usuário Final para Segurança de Senha”.

  Para especificar explicitamente que não há senha e que **mysqladmin** não deve solicitá-la, use a opção `--skip-password`.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  No Windows, conecta-se ao servidor usando um named pipe. Esta opção se aplica apenas se o servidor foi iniciado com a System Variable `named_pipe` habilitada para suportar conexões de named pipe. Além disso, o usuário que faz a conexão deve ser membro do grupo Windows especificado pela System Variable `named_pipe_full_access_group`.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  O diretório no qual procurar por plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o **mysqladmin** não o encontrar. Consulte a Seção 6.2.13, “Autenticação Plugável”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Para conexões TCP/IP, o número da porta a ser usado.

* `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Imprime o nome do programa e todas as opções que ele obtém dos arquivos de opção.

  Para informações adicionais sobre esta e outras opções de arquivos de opção, consulte a Seção 4.2.2.3, “Opções de Linha de Comando que Afetam o Manuseio de Arquivos de Opção”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  O protocolo de transporte a ser usado para conectar-se ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de um protocolo diferente do desejado. Para detalhes sobre os valores permitidos, consulte a Seção 4.2.5, “Protocolos de Transporte de Conexão”.

* `--relative`, `-r`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Mostra a diferença entre os valores atual e anterior quando usado com a opção `--sleep`. Esta opção funciona apenas com o comando `extended-status`.

* `--show-warnings`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Mostra warnings resultantes da execução de instruções enviadas ao servidor.

* `--secure-auth`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  Não envia senhas ao servidor no formato antigo (pré-4.1). Isso impede conexões, exceto para servidores que usam o formato de senha mais recente.

  A partir do MySQL 5.7.5, esta opção está obsoleta; espere que seja removida em uma futura versão do MySQL. Ela está sempre habilitada e tentar desabilitá-la (`--skip-secure-auth`, `--secure-auth=0`) produz um erro. Antes do MySQL 5.7.5, esta opção estava habilitada por padrão, mas podia ser desabilitada.

  Nota

  Senhas que usam o método de hashing pré-4.1 são menos seguras do que senhas que usam o método nativo de hashing de senha e devem ser evitadas. Senhas pré-4.1 estão obsoletas e o suporte a elas foi removido no MySQL 5.7.5. Para instruções de atualização de conta, consulte a Seção 6.4.1.3, “Migrando do Hashing de Senha Pré-4.1 e do Plugin mysql_old_password”.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  O nome do caminho para um arquivo no formato PEM contendo uma cópia do lado do cliente da chave pública exigida pelo servidor para a troca de senha baseada em par de chaves RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

  Para `sha256_password`, esta opção se aplica apenas se o MySQL foi construído usando OpenSSL.

  Para obter informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 6.4.1.5, “Autenticação Plugável SHA-256” e a Seção 6.4.1.4, “Autenticação Plugável Caching SHA-2”.

  A opção `--server-public-key-path` foi adicionada no MySQL 5.7.23.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  No Windows, o nome da shared memory a ser usado para conexões feitas usando shared memory para um servidor local. O valor padrão é `MYSQL`. O nome da shared memory diferencia maiúsculas de minúsculas.

  Esta opção se aplica apenas se o servidor foi iniciado com a System Variable `shared_memory` habilitada para suportar conexões de shared memory.

* `--shutdown-timeout=value`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  O número máximo de segundos para aguardar o shutdown do servidor. O valor padrão é 3600 (1 hora).

* `--silent`, `-s`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  Sai silenciosamente se uma conexão com o servidor não puder ser estabelecida.

* `--sleep=delay`, `-i delay`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  Executa comandos repetidamente, dormindo por *`delay`* segundos entre as execuções. A opção `--count` determina o número de iterações. Se `--count` não for fornecido, o **mysqladmin** executa comandos indefinidamente até ser interrompido.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  Para conexões a `localhost`, o arquivo de Unix socket a ser usado ou, no Windows, o nome do named pipe a ser usado.

  No Windows, esta opção se aplica apenas se o servidor foi iniciado com a System Variable `named_pipe` habilitada para suportar conexões de named pipe. Além disso, o usuário que faz a conexão deve ser membro do grupo Windows especificado pela System Variable `named_pipe_full_access_group`.

* `--ssl*`

  Opções que começam com `--ssl` especificam se deve ser usada criptografia para conectar-se ao servidor e indicam onde encontrar chaves e certificados SSL. Consulte Opções de Comando para Conexões Criptografadas.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolo separados por vírgulas. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 6.3.2, “Protocolos e Cifras TLS de Conexão Criptografada”.

  Esta opção foi adicionada no MySQL 5.7.10.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  O nome de usuário da conta MySQL a ser usada para se conectar ao servidor.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  Modo verboso. Imprime mais informações sobre o que o programa está fazendo.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Propriedades para compress"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Exibe informações de versão e sai.

* `--vertical`, `-E`

  <table frame="box" rules="all" summary="Propriedades para compress"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Imprime a saída verticalmente. Isso é semelhante a `--relative`, mas imprime a saída verticalmente.

* `--wait[=count]`, `-w[count]`

  <table frame="box" rules="all" summary="Propriedades para compress"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Se a conexão não puder ser estabelecida, aguarda e tenta novamente em vez de abortar. Se um valor *`count`* for fornecido, ele indica o número de vezes a tentar novamente. O padrão é uma vez.