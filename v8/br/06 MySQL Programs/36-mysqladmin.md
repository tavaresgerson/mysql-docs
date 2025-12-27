### 6.5.2 mysqladmin — Um programa de administração do servidor MySQL

O `mysqladmin` é um cliente para realizar operações administrativas. Você pode usá-lo para verificar a configuração do servidor e seu status atual, criar e excluir bancos de dados e muito mais.

Inicie o `mysqladmin` da seguinte forma:

```
mysqladmin [options] command [command-arg] [command [command-arg]] ...
```

O `mysqladmin` suporta os seguintes comandos. Alguns dos comandos aceitam um argumento após o nome do comando.

* `create db_name`

  Crie um novo banco de dados chamado *`db_name`*.
* `debug`

  Informe ao servidor para escrever informações de depuração no log de erro. O usuário conectado deve ter o privilégio `SUPER`. O formato e o conteúdo dessas informações estão sujeitos a alterações.

  Isso inclui informações sobre o Agendamento de Eventos. Veja a Seção 27.4.5, “Status do Agendamento de Eventos”.
* `drop db_name`

  Exclua o banco de dados chamado *`db_name`* e todas as tabelas dele.
* `extended-status`

  Exiba as variáveis de status do servidor e seus valores.
* `flush-hosts`

  Limpe todas as informações no cache de hosts. Veja a Seção 7.1.12.3, “Consultas de DNS e o Cache de Hosts”.
* `flush-logs [log_type ...]`

  Limpe todos os logs.

  O comando `mysqladmin flush-logs` permite que tipos de log opcionais sejam fornecidos para especificar quais logs serão limpos. Após o comando `flush-logs`, você pode fornecer uma lista separada por espaço de um ou mais dos seguintes tipos de log: `binary`, `engine`, `error`, `general`, `relay`, `slow`. Esses correspondem aos tipos de log que podem ser especificados para a instrução `FLUSH LOGS` SQL.
* `flush-privileges`

  Recarregar as tabelas de concessão (mesmo que `reload`).
* `flush-status`

  Limpar as variáveis de status.
* `flush-tables`

  Limpe todas as tabelas.
* `kill id,id,...`

  Apague os threads do servidor. Se vários valores de ID de thread forem fornecidos, não deve haver espaços na lista.

  Para matar threads pertencentes a outros usuários, o usuário conectado deve ter o privilégio `CONNECTION_ADMIN` (ou o privilégio obsoleto `SUPER`).
* `password new_password`


Defina uma nova senha. Isso altera a senha para *`nova_senha`* para a conta que você usa com `mysqladmin` para se conectar ao servidor. Assim, da próxima vez que você invocar `mysqladmin` (ou qualquer outro programa cliente) usando a mesma conta, você deve especificar a nova senha.

Aviso

Definir uma senha usando `mysqladmin` deve ser considerado *inseguro*. Em alguns sistemas, sua senha torna-se visível para programas de status do sistema, como `ps`, que podem ser invocados por outros usuários para exibir linhas de comando. Os clientes MySQL geralmente sobrescrevem o argumento de senha de linha de comando com zeros durante sua sequência de inicialização. No entanto, ainda há um breve intervalo durante o qual o valor é visível. Além disso, em alguns sistemas, essa estratégia de sobrescrita é ineficaz e a senha permanece visível para `ps`. (Sistemas Unix SystemV e talvez outros estão sujeitos a esse problema.)

Se o valor de *`nova_senha`* contiver espaços ou outros caracteres especiais para o seu interpretador de comandos, você precisa colocá-lo entre aspas. No Windows, certifique-se de usar aspas duplas em vez de aspas simples; as aspas simples não são removidas da senha, mas sim interpretadas como parte da senha. Por exemplo:

```
  mysqladmin password "my new password"
  ```

A nova senha pode ser omitida após o comando `password`. Neste caso, `mysqladmin` solicita o valor da senha, o que permite que você evite especificar a senha na linha de comando. Omitir o valor da senha deve ser feito apenas se `password` for o último comando na linha de comando do `mysqladmin`. Caso contrário, o próximo argumento é considerado como a senha.

Cuidado

Não use este comando se o servidor foi iniciado com a opção `--skip-grant-tables`. Não será aplicada nenhuma alteração de senha. Isso é verdade mesmo se você preceder o comando `password` com `flush-privileges` na mesma linha de comando para reativar as tabelas de concessão, porque a operação de varredura ocorre após a conexão. No entanto, você pode usar `mysqladmin flush-privileges` para reativar as tabelas de concessão e, em seguida, usar um comando `mysqladmin password` separado para alterar a senha.
* `ping`

  Verifique se o servidor está disponível. O status de retorno do `mysqladmin` é 0 se o servidor estiver em execução, 1 se não estiver. Isso é 0 mesmo em caso de um erro, como `Access denied`, porque isso significa que o servidor está em execução, mas recusou a conexão, o que é diferente do servidor não estar em execução.
* `processlist`

  Mostre uma lista de threads ativos do servidor. Isso é como a saída da instrução `SHOW PROCESSLIST`. Se a opção `--verbose` for fornecida, a saída é como a de `SHOW FULL PROCESSLIST`.
* `reload`

  Recarregar as tabelas de concessão.
* `refresh`

  Varredura de todas as tabelas e fechamento e abertura de arquivos de log.
* `shutdown`

  Parar o servidor.
* `start-replica`

  Iniciar a replicação em um servidor replica.
* `start-slave`

  Este é um alias desatualizado para start-replica.
* `status`

  Exibir uma mensagem curta de status do servidor.
* `stop-replica`

  Parar a replicação em um servidor replica.
* `stop-slave`

  Este é um alias desatualizado para stop-replica.
* `variables`

  Exibir as variáveis do sistema do servidor e seus valores.
* `version`

  Exibir informações de versão do servidor.

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

O resultado do comando `mysqladmin status` exibe os seguintes valores:

*  `Uptime`

  O número de segundos que o servidor MySQL está em execução.
* `Threads`

  O número de threads ativos (clientes).
*  `Questions`

  O número de perguntas (consultas) de clientes desde que o servidor foi iniciado.
* `Slow queries`

O número de consultas que levaram mais de `long_query_time` segundos. Veja a Seção 7.4.5, “O Log de Consultas Lentas”.
* `Opens`

  O número de tabelas que o servidor abriu.
* `Flush tables`

  O número de comandos `flush-*`, `refresh` e `reload` que o servidor executou.
* `Open tables`

  O número de tabelas que estão atualmente abertas.

Se você executar `mysqladmin shutdown` ao se conectar a um servidor local usando um arquivo de socket Unix, o `mysqladmin` aguarda até que o arquivo de ID de processo do servidor seja removido, para garantir que o servidor tenha sido desligado corretamente.

O `mysqladmin` suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysqladmin]` e `[client]` de um arquivo de opções. Para obter informações sobre as opções usadas pelos programas MySQL, consulte a Seção 6.2.2.2, “Usando Arquivos de Opções”.

**Tabela 6.11 Opções do `mysqladmin`**

<table>
   <thead>
      <tr>
         <th>Nome da Opção</th>
         <th>Descrição</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td><code>--bind-address</code></td>
         <td>Use a interface de rede especificada para se conectar ao servidor MySQL</td>
      </tr>
      <tr>
         <td><code>--character-sets-dir</code></td>
         <td>Diretório onde os conjuntos de caracteres podem ser encontrados</td>
      </tr>
      <tr>
         <td><code>--compress</code></td>
         <td>Compressar todas as informações enviadas entre o cliente e o servidor</td>
      </tr>
      <tr>
         <td><code>--compression-algorithms</code></td>
         <td>Algoritmos de compressão permitidos para conexões com o servidor</td>
      </tr>
      <tr>
         <td><code>--connect-timeout</code></td>
         <td>Número de segundos antes do tempo limite de conexão</td>
      </tr>
      <tr>
         <td><code>--count</code></td>
         <td>Número de iterações para executar comandos repetidamente</td>
      </tr>
      <tr>
         <td><code>--debug</code></td>
         <td>Escrever log de depuração</td>
      </tr>
      <tr>
         <td><code>--debug-check</code></td>
         <td>Imprimir informações de depuração quando o programa sair</td>
      </tr>
      <tr>
         <td><code>--debug-info</code></td>
         <td>Imprimir informações de depuração, memória e estatísticas da CPU quando o programa sair</td>
      </tr>
      <tr>
         <td><code>--default-auth</code></td>
         <td>Plugin de autenticação a ser usado</td>
      </tr>
      <tr>
         <td><code>--default-character-set</code></td>
         <td>Especificar o conjunto de caracteres padrão</td>
      </tr>
      <tr>
         <td><code>--defaults-extra-file</code></td>
         <td>Ler o arquivo de opções nomeadas além dos arquivos de opções usuais</td>
      </tr>
      <tr>
         <td><code>--defaults-file</code></td>
         <td>Ler apenas o arquivo de opções nomeadas</td>
      </tr>
      <tr>
         <td><code>--defaults-group-suffix</code></td>
         <td>Valor do sufixo do grupo de opções</td>
      </tr>
      <tr>
         <td><code>--enable-cleartext-plugin</code></td>
         <td>Habilitar o plugin de autenticação em texto claro</td>
      </tr>
      <tr>
         <td><code>--force</code></td>
         <td>Continuar mesmo se ocorrer um erro SQL</td>
      </tr>
      <tr>
         <td><code>--get-server-public-key</code></td>
         <td>Solicitar a chave pública RSA do servidor</td>
      </tr>
      <tr>
         <td><code>--help</code></td>
         <td>Mostrar mensagem de ajuda e sair</td>
      </tr>
      <tr>
         <td><code>--host</code></td>
         <td>Host em que o servidor MySQL está localizado</td>
      </tr>
      <tr>
         <td><code>--login-path</code></td>
         <td>Ler as opções de caminho de login a partir de .mylogin.cnf</td>
      </tr>
      <tr>
         <td><code>--no-beep</code></td>
         <td>Não emitir um beep quando ocorrer um erro</td>
      </tr>
      <tr>
         <td><code>--no-defaults</code></td>
         <td>Ler nenhum arquivo de opções</td>
      </tr>
      <tr>
         <td><code>--no-login-paths</code></td>
         <td>Não ler caminhos de login do arquivo de caminhos de login</td>
      </tr>
      <tr>
         <td><code>--password</code></td>
         <td>Senha a ser usada ao se conectar ao servidor</td>
      </tr>
      <tr>
         <td><code>--password1</code></td>
         <td>Primeira senha de autenticação multifator a ser usada ao se conectar ao servidor</td>
      </tr>
      <tr>
         <td><code>--password2</code></td>
         <td>Segunda senha de autenticação multifator a ser usada ao se conectar ao servidor</td>
      </tr>
      <tr>
         <td><code>--password3</code></td>
         <td>Terceira senha de autenticação multifator a ser usada ao se conectar ao servidor</td>
      </tr>
      <tr>
         <td><code>--pipe</code></td>
         <td>Conectar-se ao servidor usando um pipe nomeado (apenas Windows)</td>
      </tr>
      <tr>
         <td><code>--plugin-dir</code></td>
         <td>Diretório onde os plugins estão instalados</td>
      </tr>
      <tr>
         <td><code>--port</code></td>
         <td>Número de porta TCP/IP para a conexão</td>
      </tr>
      <tr>
         <td><code>--print-defaults</code></td>
         <td>Imprimir as opções padrão</td>
      </tr>
      <tr>
         <td><code>--protocol</code></td>
         <td>Protocolo de transporte a ser usado</td>
      </tr>
      <tr>
         <td><code>--relative</code></td>
         <td>Mostrar a diferença entre os valores atuais e anteriores quando usado com a opção sleep</td>
      </tr>
      <tr>

* `--help`, `-?`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Exibir uma mensagem de ajuda e sair.
* `--bind-address=ip_address`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Em um computador com múltiplas interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao servidor MySQL.
* `--character-sets-dir=dir_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  O diretório onde os conjuntos de caracteres estão instalados. Consulte a Seção 12.15, “Configuração de Conjunto de Caracteres”.
* `--compress`, `-C`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Compressar todas as informações enviadas entre o cliente e o servidor, se possível. Consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

  Esta opção está desatualizada. Espera-se que seja removida em uma versão futura do MySQL. Consulte Configurando a Compressão de Conexão Legado.
* `--compression-algorithms=value`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--compression-algorithms=value</code></td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td><code>uncompressed</code></td> </tr><tr><th>Valores válidos</th> <td><code>zlib</code></p><code>zstd</code></p><code>uncompressed</code></p></td> </tr></tbody></table>

  Os algoritmos de compressão permitidos para conexões com o servidor. Os algoritmos disponíveis são os mesmos que a variável de sistema `protocol_compression_algorithms`. O valor padrão é `uncompressed`.

Para obter mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.
* `--connect-timeout=valor`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--connect-timeout=valor</code></td> </tr><tr><th>Tipo</th> <td><code>Numérico</code></td> </tr><tr><th>Valor Padrão</th> <td><code>43200</code></td> </tr></tbody></table>

  O número máximo de segundos antes do tempo limite de conexão. O valor padrão é 43200 (12 horas).
* `--count=N`, `-c N`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--count=#</code></td> </tr></tbody></table>

  O número de iterações para executar o comando repetidamente se a opção `--sleep` for fornecida.
* `--debug[=debug_options]`, `-# [debug_options]`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--debug[=debug_options]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>d:t:o,/tmp/mysqladmin.trace</code></td> </tr></tbody></table>

  Escreva um log de depuração. Uma string típica de `debug_options` é `d:t:o,nome_do_arquivo`. O valor padrão é `d:t:o,/tmp/mysqladmin.trace`.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.
* `--debug-check`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--debug-check</code></td> </tr><tr><th>Tipo</th> <td><code>Booleano</code></td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Imprima algumas informações de depuração quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.
* `--debug-info`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--debug-info</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Imprima informações de depuração e estatísticas de uso de memória e CPU quando o programa sair.

Esta opção está disponível apenas se o MySQL foi construído com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle não são construídos com esta opção.
*  `--default-auth=plugin`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Tipo</th> <td><code>String</code></td> </tr></tbody></table>

  Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Consulte  Seção 8.2.17, “Autenticação Personalizável”.
*  `--default-character-set=charset_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--default-character-set=charset_name</code></td> </tr><tr><th>Tipo</th> <td><code>String</code></td> </tr></tbody></table>

  Use *`charset_name`* como o conjunto de caracteres padrão. Consulte  Seção 12.15, “Configuração do Conjunto de Caracteres”.
*  `--defaults-extra-file=file_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-extra-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Leia este arquivo de opção após o arquivo de opção global, mas (no Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opção, consulte  Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opção”.
*  `--defaults-file=file_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Exceção: Mesmo com `--defaults-file`, os programas cliente leem `.mylogin.cnf`.

Para obter informações adicionais sobre essa e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o gerenciamento de arquivos de opções”.
*  `--defaults-group-suffix=str`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-group-suffix=str</code></td> </tr><tr><th>Tipo</th> <td><code>String</code></td> </tr></tbody></table>

  Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de `str`. Por exemplo, o `mysqladmin` normalmente lê os grupos `[client]` e `[mysqladmin]`. Se esta opção for fornecida como `--defaults-group-suffix=_other`, o `mysqladmin` também lê os grupos `[client_other]` e `[mysqladmin_other]`.

  Para obter informações adicionais sobre essa e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o gerenciamento de arquivos de opções”.
*  `--enable-cleartext-plugin`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--enable-cleartext-plugin</code></td> </tr></tbody></table>

  Ative o plugin de autenticação de texto claro `mysql_clear_password` (consulte a Seção 8.4.1.4, “Autenticação de texto claro plugável do lado do cliente”).
*  `--force`, `-f`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--force</code></td> </tr></tbody></table>

  Não peça confirmação para o comando `drop db_name`. Com múltiplos comandos, continue mesmo se ocorrer um erro.
*  `--get-server-public-key`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Tipo</th> <td><code>Boolean</code></td> </tr></tbody></table>

Solicitar a chave pública do servidor necessária para a troca de senhas baseada em pares de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

Para informações sobre o plugin `caching_sha2_password`, consulte a Seção 8.4.1.2, “Cacheamento de Autenticação SHA-2 Pluggable”.*  `--host=host_name`, `-h host_name`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--host=host_name</code></td> </tr><tr><th>Tipo</th> <td><code>String</code></td> </tr><tr><th>Valor Padrão</th> <td><code>localhost</code></td> </tr></tbody></table>

Conectar-se ao servidor MySQL no host fornecido. *  `--login-path=name`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--login-path=name</code></td> </tr><tr><th>Tipo</th> <td><code>String</code></td> </tr></tbody></table>

Ler opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contêm opções que especificam para qual servidor MySQL se conectar e qual conta se autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário `mysql_config_editor`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opções”.*  `--no-login-paths`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--no-login-paths</code></td> </tr></tbody></table>

Ignora a leitura de opções do arquivo de caminho de login.

Consulte `--login-path` para informações relacionadas.

Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opções”.
* `--no-beep`, `-b`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--no-beep</code></td> </tr></tbody></table>

  Substitua o sinal de alerta que é emitido por padrão para erros como a falha em se conectar ao servidor.
* `--no-defaults`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--no-defaults</code></td> </tr></tbody></table>

  Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, o `--no-defaults` pode ser usado para evitar que sejam lidas.

  A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário `mysql_config_editor`. Consulte a Seção 6.6.7, “mysql_config_editor — Ferramenta de configuração do MySQL”.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opções”.
* `--password[=password]`, `-p[password]`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--password[=password]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o `mysqladmin` solicitará uma senha. Se fornecida, não deve haver *espaço* entre `--password=` ou `-p` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar nenhuma senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opções. Consulte a Seção 8.1.2.1, “Diretrizes do usuário final para segurança de senhas”.

Para especificar explicitamente que não há senha e que o `mysqladmin` não deve solicitar uma senha, use a opção `--skip-password`.
* `--password1[=pass_val]`

  A senha para o fator de autenticação multifator 1 da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o `mysql` solicitará uma senha. Se for fornecido, não deve haver *espaço* entre `--password1=` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar a senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opções. Veja a Seção 8.1.2.1, “Diretrizes do Usuário Final para Segurança de Senhas”.

  Para especificar explicitamente que não há senha e que o `mysqladmin` não deve solicitar uma senha, use a opção `--skip-password1`.

   `--password1` e `--password` são sinônimos, assim como `--skip-password1` e `--skip-password`.
* `--password2[=pass_val]`

  A senha para o fator de autenticação multifator 2 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica da opção `--password1`; consulte a descrição dessa opção para detalhes.
* `--password3[=pass_val]`

  A senha para o fator de autenticação multifator 3 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica da opção `--password1`; consulte a descrição dessa opção para detalhes.
* `--pipe`, `-W`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--pipe</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

No Windows, conecte-se ao servidor usando um tubo nomeado. Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por tubo nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.
*  `--plugin-dir=dir_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--plugin-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome de diretório</td> </tr></tbody></table>

  O diretório onde procurar por plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o `mysqladmin` não encontrá-lo. Veja a Seção 8.2.17, “Autenticação Conectada”.
*  `--port=port_num`, `-P port_num`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--port=port_num</code></td> </tr><tr><th>Tipo</th> <td>Número</td> </tr><tr><th>Valor padrão</th> <td><code>3306</code></td> </tr></tbody></table>

  Para conexões TCP/IP, o número de porta a ser usado.
*  `--print-defaults`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--print-defaults</code></td> </tr></tbody></table>

  Imprima o nome do programa e todas as opções que ele obtém de arquivos de opções.

  Para obter informações adicionais sobre esta e outras opções de arquivos de opções, veja  Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opções”.
*  `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--protocol=type</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[ver texto]</code></td> </tr><tr><th>Valores válidos</th> <td><code>TCP</code></p><code>SOCKET</code></p><code>PIPE</code></p><code>MEMORY</code></p></td> </tr></tbody></table>

O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de um protocolo diferente do desejado. Para obter detalhes sobre os valores permitidos, consulte a Seção 6.2.7, “Protocolos de Transporte de Conexão”.
*  `--relative`, `-r`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--relative</code></td> </tr></tbody></table>

  Mostre a diferença entre os valores atuais e anteriores quando usado com a opção `--sleep`. Esta opção só funciona com o comando `extended-status`.
*  `--server-public-key-path=file_name`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--server-public-key-path=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  O nome do caminho de um arquivo no formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senhas com par de chaves RSA. Esta opção aplica-se a clientes que autenticam-se com o plugin de autenticação `sha256_password` (desatualizado) ou `caching_sha2_password`. Esta opção é ignorada para contas que não autenticam-se com um desses plugins. Também é ignorada se a troca de senhas com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

  Para `sha256_password` (desatualizado), esta opção só se aplica se o MySQL foi compilado usando OpenSSL.

  Para obter informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 8.4.1.3, “Autenticação Personalizável SHA-256”, e a Seção 8.4.1.2, “Autenticação Caching SHA-2 Personalizável”.
*  `--shared-memory-base-name=name`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--shared-memory-base-name=name</code></td> </tr><tr><th>Especifica a Plataforma</th> <td>Windows</td> </tr></tbody></table>

Em Windows, o nome de memória compartilhada a ser usado para conexões feitas usando memória compartilhada a um servidor local. O valor padrão é `MYSQL`. O nome de memória compartilhada é case-sensitive.

Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.
*  `--show-warnings`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--show-warnings</code></td> </tr></tbody></table>

  Mostrar avisos resultantes da execução de instruções enviadas ao servidor.
*  `--shutdown-timeout=value`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--shutdown-timeout=segundos</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>3600</code></td> </tr></tbody></table>

  O número máximo de segundos para esperar pelo desligamento do servidor. O valor padrão é 3600 (1 hora).
*  `--silent`, `-s`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--silent</code></td> </tr></tbody></table>

  Sair silenciosamente se uma conexão com o servidor não puder ser estabelecida.
*  `--sleep=delay`, `-i delay`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--sleep=delay</code></td> </tr></tbody></table>

  Executar comandos repetidamente, dormindo por *`delay`* segundos entre eles. A opção `--count` determina o número de iterações. Se `--count` não for fornecido, o `mysqladmin` executa comandos indefinidamente até ser interrompido.
*  `--socket=caminho`, `-S caminho`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--socket={nome_de_arquivo|nome_de_canal_nomeado}</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Para conexões com `localhost`, o arquivo de socket Unix a ser usado, ou, em Windows, o nome do canal nomeado a ser usado.

Em Windows, essa opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por named pipe. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.
* `--ssl*`

  As opções que começam com `--ssl` especificam se a conexão ao servidor deve ser feita usando criptografia e indicam onde encontrar as chaves e certificados SSL. Veja Opções de Comando para Conexões Criptografadas.
*  `--ssl-fips-mode={OFF|ON|STRICT}`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--ssl-fips-mode={OFF|ON|STRICT}</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr><tr><th>Valores Válidos</th> <td><code>OFF</code></p><code>ON</code></p><code>STRICT</code></td> </tr></tbody></table>

  Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere de outras opções `--ssl-xxx` porque não é usada para estabelecer conexões criptografadas, mas sim para afetar quais operações criptográficas devem ser permitidas. Veja Seção 8.8, “Suporte FIPS”.

  Esses valores de `--ssl-fips-mode` são permitidos:

  + `OFF`: Desabilitar o modo FIPS.
  + `ON`: Habilitar o modo FIPS.
  + `STRICT`: Habilitar o modo FIPS “estricto”.
  
  ::: info Nota

  Se o Módulo de Objeto FIPS OpenSSL não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Nesse caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente produza uma mensagem de aviso no início e opere no modo não FIPS.

  :::

  Esta opção está desatualizada. Espere que ela seja removida em uma versão futura do MySQL.
*  `--tls-ciphersuites=ciphersuite_list`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--tls-ciphersuites=ciphersuite_list</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

As suíte de cifra permitidas para conexões criptografadas que utilizam TLSv1.3. O valor é uma lista de um ou mais nomes de suíte de cifra separados por vírgula. As suíte de cifra que podem ser nomeadas para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para obter detalhes, consulte a Seção 8.3.2, “Protocolos e cifra TLS de Conexão Criptografada”.
*  `--tls-sni-servername=server_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--tls-sni-servername=server_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Quando especificado, o nome é passado para a biblioteca de API C `libmysqlclient` usando a opção `MYSQL_OPT_TLS_SNI_SERVERNAME` de `mysql_options()`. O nome do servidor não é case-sensitive. Para mostrar qual nome do servidor o cliente especificou para a sessão atual, se houver, verifique a variável `Tls_sni_server_name`.

  A Indicação de Nome do Servidor (SNI) é uma extensão do protocolo TLS (o OpenSSL deve ser compilado com extensões TLS para que esta opção funcione). A implementação do MySQL do SNI representa apenas o lado do cliente.
*  `--tls-version=lista_protocolos`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--tls-version=lista_protocolos</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>TLSv1,TLSv1.1,TLSv1.2,TLSv1.3</code> (OpenSSL 1.1.1 ou superior)<code>TLSv1,TLSv1.1,TLSv1.2</code> (caso contrário)</td> </tr></tbody></table>

  Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolo separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para obter detalhes, consulte a Seção 8.3.2, “Protocolos e cifra TLS de Conexão Criptografada”.
*  `--user=user_name`, `-u user_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--user=user_name,</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O nome do usuário da conta MySQL a ser usado para se conectar ao servidor.

Se você estiver usando o plugin `Rewriter`, conceda este usuário o privilégio `SKIP_QUERY_REWRITE`.
*  `--verbose`, `-v`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--verbose</code></td> </tr></tbody></table>

  Modo verbose. Imprima mais informações sobre o que o programa faz.
*  `--version`, `-V`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--version</code></td> </tr></tbody></table>

  Exiba informações de versão e saia.
*  `--vertical`, `-E`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--vertical</code></td> </tr></tbody></table>

  Imprima a saída verticalmente. Isso é semelhante a `--relative`, mas imprime a saída verticalmente.
*  `--wait[=count]`, `-w[count]`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--wait</code></td> </tr></tbody></table>

  Se a conexão não puder ser estabelecida, aguarde e tente novamente em vez de abortar. Se um valor de *`count`* for fornecido, ele indica o número de vezes para tentar novamente. O valor padrão é uma vez.
*  `--zstd-compression-level=level`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--zstd-compression-level=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr></tbody></table>

  O nível de compressão a ser usado para conexões com o servidor que usam o algoritmo de compressão `zstd`. Os níveis permitidos são de 1 a 22, com valores maiores indicando níveis crescentes de compressão. O nível de compressão padrão `zstd` é 3. A configuração do nível de compressão não tem efeito em conexões que não usam compressão `zstd`.

  Para mais informações, consulte a Seção 6.2.8, “Controle de compressão de conexão”.