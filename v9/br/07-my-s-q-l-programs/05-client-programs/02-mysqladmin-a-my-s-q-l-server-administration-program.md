### 6.5.2 mysqladmin — Um programa de administração do servidor MySQL

O **mysqladmin** é um cliente para realizar operações administrativas. Você pode usá-lo para verificar a configuração do servidor e seu status atual, criar e excluir bancos de dados, entre outros.

Inicie o **mysqladmin** da seguinte forma:

```
mysqladmin [options] command [command-arg] [command [command-arg]] ...
```

O **mysqladmin** suporta os seguintes comandos. Alguns comandos aceitam um argumento após o nome do comando.

* `create db_name`

  Cria um novo banco de dados chamado *`db_name`*.

* `debug`

  Diz ao servidor para escrever informações de depuração no log de erro. O usuário conectado deve ter o privilégio `SUPER`. O formato e o conteúdo dessas informações estão sujeitos a alterações.

  Isso inclui informações sobre o Agendamento de Eventos. Veja a Seção 27.5.5, “Status do Agendamento de Eventos”.

* `drop db_name`

  Exclui o banco de dados chamado *`db_name`* e todas as tabelas dele.

* `extended-status`

  Exibe as variáveis de status do servidor e seus valores.

* `flush-hosts`

  Limpa todas as informações no cache de hosts. Veja a Seção 7.1.12.3, “Consultas DNS e o Cache de Hosts”.

* `flush-logs [log_type ...]`

  Limpa todos os logs.

  O comando **mysqladmin flush-logs** permite que tipos de log opcionais sejam fornecidos para especificar quais logs serão limpos. Após o comando `flush-logs`, você pode fornecer uma lista separada por espaço de um ou mais dos seguintes tipos de log: `binary`, `engine`, `error`, `general`, `relay`, `slow`. Esses correspondem aos tipos de log que podem ser especificados para a instrução SQL `FLUSH LOGS`.

* `flush-privileges`

  Recarregar as tabelas de concessão (mesmo que `reload`).

  Desatualizado e gera uma mensagem de aviso; você deve esperar que este comando seja removido em uma versão futura do MySQL.

* `flush-status`

  Limpa as variáveis de status.

* `flush-tables`

  Limpa todas as tabelas.

* `kill id,id,...`

Mate os threads do servidor. Se vários valores de ID de thread forem fornecidos, não deve haver espaços na lista.

Para matar threads pertencentes a outros usuários, o usuário conectado deve ter o privilégio `CONNECTION_ADMIN` (ou o desatualizado privilégio `SUPER`).

* `senha nova_senha`

  Defina uma nova senha. Isso altera a senha para *`nova_senha`* para a conta que você usa com **mysqladmin** para se conectar ao servidor. Assim, da próxima vez que você invocar **mysqladmin** (ou qualquer outro programa cliente) usando a mesma conta, você deve especificar a nova senha.

  Aviso

  Definir uma senha usando **mysqladmin** deve ser considerado *inseguro*. Em alguns sistemas, sua senha se torna visível para programas de status do sistema, como **ps** que podem ser invocados por outros usuários para exibir linhas de comando. Os clientes MySQL geralmente sobrescrevem o argumento de senha da linha de comando com zeros durante sua sequência de inicialização. No entanto, ainda há um breve intervalo durante o qual o valor é visível. Além disso, em alguns sistemas, essa estratégia de sobrescrita é ineficaz e a senha permanece visível para **ps**. (Sistemas Unix SystemV e talvez outros estão sujeitos a esse problema.)

  Se o valor de *`nova_senha`* contiver espaços ou outros caracteres especiais para o seu interpretador de comandos, você precisa colocá-lo entre aspas. No Windows, certifique-se de usar aspas duplas em vez de aspas simples; as aspas simples não são removidas da senha, mas sim interpretadas como parte da senha. Por exemplo:

  ```
  mysqladmin password "my new password"
  ```

A nova senha pode ser omitida após o comando `password`. Nesse caso, o **mysqladmin** solicita o valor da senha, permitindo que você evite especificar a senha na linha de comando. O valor da senha deve ser omitido apenas se o comando `password` for o último comando na linha de comando do **mysqladmin**. Caso contrário, o próximo argumento é considerado como a senha.

Cuidado

Não use este comando se o servidor foi iniciado com a opção `--skip-grant-tables`. Nenhuma alteração na senha é aplicada. Isso vale mesmo se você preceder o comando `password` com `flush-privileges` na mesma linha de comando para reativar as tabelas de concessão, pois a operação de varredura ocorre após a conexão. No entanto, você pode usar **mysqladmin flush-privileges** para reativar as tabelas de concessão e, em seguida, usar um comando separado do **mysqladmin password** para alterar a senha.

* `ping`

  Verifique se o servidor está disponível. O status de retorno do **mysqladmin** é 0 se o servidor estiver em execução, 1 se não estiver. Isso é 0 mesmo em caso de um erro, como `Access denied`, porque isso significa que o servidor está em execução, mas recusou a conexão, o que é diferente do servidor não estar em execução.

* `processlist`

  Mostre uma lista de threads de servidor ativos. Isso é como a saída da instrução `SHOW PROCESSLIST`. Se a opção `--verbose` for fornecida, a saída é como a de `SHOW FULL PROCESSLIST`. (Veja a Seção 15.7.7.32, “Instrução SHOW PROCESSLIST”.)

* `reload`

  Recarregar as tabelas de concessão.

  Desatualizado e gera uma advertência; você deve esperar que este comando seja removido em uma versão futura do MySQL.

* `refresh`

  Varredura de todos os bancos de dados e fecha e abre os arquivos de log.

  A varredura de privilégios por este comando é desatualizada; você deve esperar que este comportamento seja removido em uma versão futura do MySQL.

* `shutdown`

  Parar o servidor.

* `start-replica`

  Iniciar a replicação em um servidor replica.

* `start-slave`

  Este é um alias desatualizado para start-replica.

* `status`

  Exibir uma breve mensagem de status do servidor.

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

O resultado do comando **mysqladmin status** exibe os seguintes valores:

* `Uptime`

  O número de segundos que o servidor MySQL está em execução.

* `Threads`

  O número de threads ativos (clientes).

* `Questions`

  O número de perguntas (consultas) dos clientes desde que o servidor foi iniciado.

* `Slow queries`

  O número de consultas que levaram mais de `long_query_time` segundos. Veja a Seção 7.4.5, “O Log de Consultas Lentas”.

* `Opens`

  O número de tabelas que o servidor abriu.

* `Flush tables`

  O número de comandos `flush-*`, `refresh` e `reload` que o servidor executou.

* `Open tables`

  O número de tabelas que atualmente estão abertas.

Se você executar **mysqladmin shutdown** ao se conectar a um servidor local usando um arquivo de socket Unix, o **mysqladmin** aguarda até que o arquivo de ID de processo do servidor seja removido, para garantir que o servidor tenha parado corretamente.

O **mysqladmin** suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysqladmin]` e `[client]` de um arquivo de opções. Para informações sobre arquivos de opções usados por programas MySQL, veja a Seção 6.2.2.2, “Usando Arquivos de Opções”.

**Tabela 6.11 Opções do mysqladmin**

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para mysqladmin">
<tr><th>Nome da opção</th> <th>Descrição</th></tr>
<tr><td><a class="link" href="mysqladmin.html#option_mysqladmin_bind-address">--bind-address</a></td> <td>Utilize a interface de rede especificada para se conectar ao servidor MySQL</td></tr>
<tr><td><a class="link" href="mysqladmin.html#option_mysqladmin_character-sets-dir">--character-sets-dir</a></td> <td>Diretório onde os conjuntos de caracteres podem ser encontrados</td></tr>
<tr><td><a class="link" href="mysqladmin.html#option_mysqladmin_compress">--compress</a></td> <td>Compressar todas as informações enviadas entre o cliente e o servidor</td></tr>
<tr><td><a class="link" href="mysqladmin.html#option_mysqladmin_compression-algorithms">--compression-algorithms</a></td> <td>Algoritmos de compressão permitidos para conexões com o servidor</td></tr>
<tr><td><a class="link" href="mysqladmin.html#option_mysqladmin_connect-timeout">--connect-timeout</a></td> <td>Número de segundos antes do timeout da conexão</td></tr>
<tr><td><a class="link" href="mysqladmin.html#option_mysqladmin_count">--count</a></td> <td>Número de iterações para executar o comando repetidamente</td></tr>
<tr><td><a class="link" href="mysqladmin.html#option_mysqladmin_debug">--debug</a></td> <td>Escrever o log de depuração</td></tr>
<tr><td><a class="link" href="mysqladmin.html#option_mysqladmin_debug-check">--debug-check</a></td> <td>Imprimir informações de depuração quando o programa sai</td></tr>
<tr><td><a class="link" href="mysqladmin.html#option_mysqladmin_debug-info">--debug-info</a></td> <td>Imprimir informações de depuração, estatísticas de memória e CPU quando o programa sai</td></tr>
<tr><td><a class="link" href="mysqladmin.html#option_mysqladmin_default-auth">--default-auth</a></td> <td>Plugin de autenticação a usar</td></tr>
<tr><td><a class="link" href="mysqladmin.html#option_mysqladmin_default-character-set">--default-character-set</a></td> <td>Especificar o conjunto de caracteres padrão</td></tr>
<tr><td><a class="link" href="mysqladmin.html#option_mysqladmin_defaults-extra-file">--defaults-extra-file</a></td> <td>Ler o arquivo de opções nomeado adicionalmente aos arquivos de opções usuais</td></tr>
<tr><td><a class="link" href="mysqladmin.html#option_mysqladmin_defaults-file">--defaults-file</a></td> <td>Ler apenas o arquivo de opções nomeado</td></tr>
<tr><td><a class="link" href="mysqladmin.html#option_mysqladmin_defaults-group-suffix">--defaults-group-suffix</a></td> <td>Valor do sufixo do grupo de opções</td></tr>
<tr><td><a class="link" href="mysqladmin.html#option_mysqladmin_enable-cleartext-plugin">--enable-cleartext-plugin</a></td> <td>Ativar o plugin de autenticação sem criptografia</td></tr>
<tr><td><a class="link" href="mysqladmin.html#option_mysqladmin_force">--force</a></td> <td>Continuar mesmo se ocorrer um erro SQL</td></tr>
<tr><td><a class="link" href="mysqladmin.html#option_mysqladmin_get-server-public-key">--get-server-public-key</a></td> <td>Solicitar a chave pública do servidor RSA</td></tr>
<tr><td><a class="link" href="mysqladmin.html#option_mysqladmin_help">--help</a></td> <td>Mostrar a mensagem de ajuda e sair</td></tr>
<tr><td><a class="link" href="mysqladmin.html#option_mysqladmin_host">--host</a></td> <td>Host em que o servidor MySQL está localizado</td></tr>
<tr><td><a class="link" href="mysqladmin.

* `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--help</code></td> </tr></table>

  Exibir uma mensagem de ajuda e sair.

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--bind-address=ip_address</code></td> </tr></table>

  Em um computador com múltiplas interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao servidor MySQL.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></table>

  O diretório onde os conjuntos de caracteres estão instalados. Consulte a Seção 12.15, “Configuração de Conjunto de Caracteres”.

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Propriedades para compress"><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--compress[={OFF|ON}]</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">OFF</code></td> </tr></table>

  Compressar todas as informações enviadas entre o cliente e o servidor, se possível. Consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

Esta opção está desatualizada. Espera-se que ela seja removida em uma versão futura do MySQL. Veja Configurando Compressão de Conexão Legado.

* `--compression-algorithms=valor`

  <table frame="box" rules="all" summary="Propriedades para compression-algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--compression-algorithms=valor</code></td> </tr><tr><th>Tipo</th> <td>Definível</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">não comprimido</code></td> </tr><tr><th>Valores Válidos</th> <td><p class="valid-value"><code class="literal">zlib</code></p><p class="valid-value"><code class="literal">zstd</code></p><p class="valid-value"><code class="literal">não comprimido</code></p></td> </tr></tbody></table>

  Os algoritmos de compressão permitidos para conexões com o servidor. Os algoritmos disponíveis são os mesmos da variável de sistema `protocol_compression_algorithms`. O valor padrão é `não comprimido`.

  Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

* `--connect-timeout=valor`

  <table frame="box" rules="all" summary="Propriedades para connect-timeout"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--connect-timeout=valor</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">43200</code></td> </tr></tbody></table>

  O número máximo de segundos antes do tempo limite de conexão. O valor padrão é 43200 (12 horas).

* `--count=N`, `-c N`

<table frame="box" rules="all" summary="Propriedades para contagem">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code class="literal">--count=#</code></td>
  </tr>
</table>

  O número de iterações para executar o comando repetidamente se a opção `--sleep` for fornecida.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Propriedades para debug">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code class="literal">--debug[=debug_options]</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>String</td>
    </tr>
    <tr>
      <th>Valor padrão</th>
      <td><code class="literal">d:t:o,/tmp/mysqladmin.trace</code></td>
    </tr>
  </tbody>
</table>

  Escreva um log de depuração. Uma string típica de `debug_options` é `d:t:o,nome_do_arquivo`. O valor padrão é `d:t:o,/tmp/mysqladmin.trace`.

  Esta opção está disponível apenas se o MySQL for compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.

* `--debug-check`

  <table frame="box" rules="all" summary="Propriedades para debug-check">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code class="literal">--debug-check</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>Boolean</td>
    </tr>
    <tr>
      <th>Valor padrão</th>
      <td><code class="literal">FALSE</code></td>
    </tr>
  </tbody>
</table>

  Imprima algumas informações de depuração quando o programa sair.

  Esta opção está disponível apenas se o MySQL for compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.

* `--debug-info`

<table frame="box" rules="all" summary="Propriedades para ajuda">
  <tr><th>Formato de linha de comando</th> <td><code class="literal">--help</code></td> </tr>
</table>0

Imprima informações de depuração e estatísticas de uso de memória e CPU quando o programa sair.

Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de liberação do MySQL fornecidos pela Oracle *não* são compilados com esta opção.

* `--default-auth=plugin`

<table frame="box" rules="all" summary="Propriedades para ajuda">
  <tr><th>Formato de linha de comando</th> <td><code class="literal">--help</code></td> </tr>
</table>1

Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Consulte a Seção 8.2.17, “Autenticação Personalizável”.

* `--default-character-set=charset_name`

<table frame="box" rules="all" summary="Propriedades para ajuda">
  <tr><th>Formato de linha de comando</th> <td><code class="literal">--help</code></td> </tr>
</table>2

Use *`charset_name`* como o conjunto de caracteres padrão. Consulte a Seção 12.15, “Configuração do Conjunto de Caracteres”.

* `--defaults-extra-file=file_name`

<table frame="box" rules="all" summary="Propriedades para ajuda">
  <tr><th>Formato de linha de comando</th> <td><code class="literal">--help</code></td> </tr>
</table>3

Leia este arquivo de opção após o arquivo de opção global, mas (no Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opções”.

* `--defaults-file=nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--help</code></td> </tr></tbody></table>4

  Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou estiver inacessível, ocorrerá um erro. Se *`nome_do_arquivo`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Exceção: Mesmo com `--defaults-file`, os programas cliente leem `.mylogin.cnf`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opções”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--help</code></td> </tr></tbody></table>5

  Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, **mysqladmin** normalmente lê os grupos `[client]` e `[mysqladmin]`. Se esta opção for fornecida como `--defaults-group-suffix=_other`, **mysqladmin** também lê os grupos `[client_other]` e `[mysqladmin_other]`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opções”.

* `--enable-cleartext-plugin`

<table frame="box" rules="all" summary="Propriedades de ajuda">
  <tr><th>Formato de linha de comando</th> <td><code class="literal">--help</code></td> </tr>
</table>6

  Ative o plugin de autenticação de texto claro `mysql_clear_password`. (Veja a Seção 8.4.1.3, “Autenticação Pluggable de Texto Claro do Cliente”).

* `--force`, `-f`

<table frame="box" rules="all" summary="Propriedades de ajuda">
  <tr><th>Formato de linha de comando</th> <td><code class="literal">--help</code></td> </tr>
</table>7

  Não peça confirmação para o comando `drop db_name`. Com múltiplos comandos, continue mesmo que ocorra um erro.

* `--get-server-public-key`

<table frame="box" rules="all" summary="Propriedades de ajuda">
  <tr><th>Formato de linha de comando</th> <td><code class="literal">--help</code></td> </tr>
</table>8

  Peça à servidor a chave pública necessária para a troca de senha baseada em par de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

  Para informações sobre o plugin `caching_sha2_password`, consulte a Seção 8.4.1.1, “Autenticação Pluggable SHA-2”.

* `--host=host_name`, `-h host_name`

Conecte-se ao servidor MySQL no host fornecido.

* `--login-path=nome`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--bind-address=ip_address</code></td> </tr></tbody></table>0

  Leia opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam para qual servidor MySQL se conectar e com qual conta se autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql\_config\_editor**. Veja a Seção 6.6.7, “mysql\_config\_editor — Ferramenta de configuração do MySQL”.

  Para obter informações adicionais sobre isso e outras opções de arquivos de opções, veja a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opções”.

* `--no-login-paths`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--bind-address=ip_address</code></td> </tr></tbody></table>1

  Ignora a leitura de opções do arquivo de caminho de login.

  Veja `--login-path` para informações relacionadas.

  Para obter informações adicionais sobre isso e outras opções de arquivos de opções, veja a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opções”.

* `--no-beep`, `-b`

<table frame="box" rules="all" summary="Propriedades para bind-address">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code class="literal">--bind-address=ip_address</code></td>
  </tr>
</table>
2

  Substitua o sinal de alerta que é emitido por padrão para erros como a falha em se conectar ao servidor.

* `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para bind-address">
    <tr>
      <th>Formato de Linha de Comando</th>
      <td><code class="literal">--bind-address=ip_address</code></td>
    </tr>
  </table>
3

  Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para evitar que sejam lidas.

  A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql\_config\_editor**. Veja a Seção 6.6.7, “mysql\_config\_editor — Ferramenta de Configuração do MySQL”.

  Para obter informações adicionais sobre esta e outras opções de arquivos de opções, consulte a Seção 6.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opções”.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Propriedades para bind-address">
    <tr>
      <th>Formato de Linha de Comando</th>
      <td><code class="literal">--bind-address=ip_address</code></td>
    </tr>
  </table>
4

A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysqladmin** solicitará uma senha. Se for fornecida, não deve haver **espaço** entre `--password=` ou `-p` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar a senha.

Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Consulte a Seção 8.1.2.1, “Diretrizes do Usuário Final para Segurança de Senhas”.

Para especificar explicitamente que não há senha e que o **mysqladmin** não deve solicitar uma senha, use a opção `--skip-password`.

* `--password1[=pass_val]`

  A senha para o fator de autenticação multifator 1 da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysql** solicitará uma senha. Se for fornecida, não deve haver **espaço** entre `--password1=` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar a senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Consulte a Seção 8.1.2.1, “Diretrizes do Usuário Final para Segurança de Senhas”.

  Para especificar explicitamente que não há senha e que o **mysqladmin** não deve solicitar uma senha, use a opção `--skip-password1`.

  `--password1` e `--password` são sinônimos, assim como `--skip-password1` e `--skip-password`.

* `--password2[=pass_val]`

  A senha para o fator de autenticação multifator 2 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica da opção `--password1`; consulte a descrição dessa opção para detalhes.

* `--password3[=pass_val]`

A senha para o fator de autenticação multifator 3 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica da opção `--password1`; consulte a descrição dessa opção para obter detalhes.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--bind-address=ip_address</code></td> </tr></tbody></table>5

  Em Windows, conecte-se ao servidor usando um pipe nomeado. Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por pipe nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--bind-address=ip_address</code></td> </tr></tbody></table>6

  O diretório onde procurar por plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o **mysqladmin** não o encontrar. Consulte a Seção 8.2.17, “Autenticação Personalizável”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--bind-address=ip_address</code></td> </tr></tbody></table>7

  Para conexões TCP/IP, o número de porta a ser usado.

<table frame="box" rules="all" summary="Propriedades para bind-address">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code class="literal">--bind-address=ip_address</code></td>
  </tr>
</table>8

  Imprima o nome do programa e todas as opções que ele obtém de arquivos de opções.

  Para obter informações adicionais sobre isso e outras opções de arquivos de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opções”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Propriedades para bind-address">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code class="literal">--bind-address=ip_address</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>String</td>
    </tr>
    <tr>
      <th>Valor padrão</th>
      <td><code class="literal">[none]</code></td>
    </tr>
  </table>9

  O protocolo de transporte a ser usado para conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de um protocolo diferente do que você deseja. Para detalhes sobre os valores permitidos, consulte a Seção 6.2.7, “Protocolos de transporte de conexão”.

* `--relative`, `-r`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code class="literal">--character-sets-dir=caminho</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>String</td>
    </tr>
    <tr>
      <th>Valor padrão</th>
      <td><code class="literal">[none]</code></td>
    </tr>
  </table>0

  Mostre a diferença entre os valores atuais e anteriores quando usado com a opção `--sleep`. Esta opção funciona apenas com o comando `extended-status`.

* `--server-public-key-path=nome_do_arquivo`

<table frame="box" rules="all" summary="Propriedades para character-sets-dir">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code class="literal">--character-sets-dir=caminho</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code class="literal">[nenhum]</code></td>
  </tr>
  </tbody>
</table>1

  O nome do caminho de um arquivo no formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senhas com par de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=nome_do_arquivo` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

  Para `sha256_password`, esta opção aplica-se apenas se o MySQL foi compilado usando OpenSSL.

  Para informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 8.4.1.2, “Autenticação Personalizável SHA-256”, e a Seção 8.4.1.1, “Autenticação Personalizável SHA-2”.

* `--shared_memory_base_name=nome`

Em Windows, o nome de memória compartilhada a ser usado para conexões feitas usando memória compartilhada a um servidor local. O valor padrão é `MYSQL`. O nome de memória compartilhada é sensível a maiúsculas e minúsculas.

Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

* `--show-warnings`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></tbody></table>3

  Mostrar avisos resultantes da execução de instruções enviadas ao servidor.

* `--shutdown-timeout=valor`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></tbody></table>4

  O número máximo de segundos para esperar pelo desligamento do servidor. O valor padrão é 3600 (1 hora).

* `--silent`, `-s`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></tbody></table>5

  Sair silenciosamente se uma conexão com o servidor não puder ser estabelecida.

* `--sleep=delay`, `-i delay`

<table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></tbody></table>6

  Execute comandos repetidamente, dormindo por *`delay`* segundos entre eles. A opção `--count` determina o número de iterações. Se `--count` não for fornecida, o **mysqladmin** executa comandos indefinidamente até ser interrompido.

* `--socket=caminho`, `-S caminho`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></tbody></table>7

  Para conexões com `localhost`, o arquivo de socket Unix a ser usado ou, no Windows, o nome do pipe nomeado a ser usado.

  No Windows, esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por pipe nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--ssl*`

  Opções que começam com `--ssl` especificam se conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Veja Opções de comando para conexões criptografadas.

* `--ssl-fips-mode={OFF|ON|STRICT}`

<table frame="box" rules="all" summary="Propriedades para character-sets-dir">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code class="literal">--character-sets-dir=caminho</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code class="literal">[nenhum]</code></td>
  </tr>
  </tbody>
</table>9

  Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere de outras opções `--ssl-xxx` porque não é usada para estabelecer conexões criptografadas, mas sim para afetar quais operações criptográficas devem ser permitidas. Veja a Seção 8.8, “Suporte FIPS”.

  Estes valores de `--ssl-fips-mode` são permitidos:

  + `OFF`: Desabilitar o modo FIPS.
  + `ON`: Habilitar o modo FIPS.
  + `STRICT`: Habilitar o modo FIPS “estricto”.

  Observação

  Se o Módulo de Objeto FIPS do OpenSSL não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Nesse caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente produza um aviso na inicialização e opere no modo não FIPS.

  Esta opção está desatualizada. Espere que ela seja removida em uma versão futura do MySQL.

* `--tls-ciphersuites=lista_suites_de_cifras`

As sequências de cifra permitidas para conexões criptografadas que utilizam TLSv1.3. O valor é uma lista de um ou mais nomes de sequências de cifra separados por vírgula. As sequências de cifra que podem ser nomeadas para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, “Protocolos e cifra TLS de Conexão Encriptada”.

* `--tls-sni-servername=server_name`

  <table frame="box" rules="all" summary="Propriedades para compressão">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code class="literal">--compress[={OFF|ON}]</code></td>
    </tr>
    <tr>
      <th>Desatualizado</th>
      <td>Sim</td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>Booleano</td>
    </tr>
    <tr>
      <th>Valor padrão</th>
      <td><code class="literal">OFF</code></td>
    </tr>
  </tbody>
  </table>0

  Quando especificado, o nome é passado para a biblioteca de API C `libmysqlclient` usando a opção `MYSQL_OPT_TLS_SNI_SERVERNAME` de `mysql_options()`. O nome do servidor não é case-sensitive. Para mostrar qual nome do servidor o cliente especificou para a sessão atual, se houver, verifique a variável `Tls_sni_server_name`.

  A Indicação de Nome do Servidor (SNI) é uma extensão do protocolo TLS (o OpenSSL deve ser compilado com extensões TLS para que esta opção funcione). A implementação do MySQL do SNI representa apenas o lado do cliente.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Propriedades para compressão">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code class="literal">--compress[={OFF|ON}]</code></td>
    </tr>
    <tr>
      <th>Desatualizado</th>
      <td>Sim</td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>Booleano</td>
    </tr>
    <tr>
      <th>Valor padrão</th>
      <td><code class="literal">OFF</code></td>
    </tr>
  </tbody>
  </table>1

Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolos separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, “Protocolos e cifra TLS de conexão criptografada”.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Propriedades para compressão"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--compress[={OFF|ON}]</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">OFF</code></td> </tr></tbody></table>2

  O nome de usuário da conta MySQL a ser usado para se conectar ao servidor.

  Se você estiver usando o plugin `Rewriter`, conceda a este usuário o privilégio `SKIP_QUERY_REWRITE`.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Propriedades para compressão"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--compress[={OFF|ON}]</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">OFF</code></td> </tr></tbody></table>3

  Modo de verbosidade. Imprima mais informações sobre o que o programa faz.

* `--version`, `-V`

<table frame="box" rules="all" summary="Propriedades para compressão">
  <tr><th>Formato de linha de comando</th> <td><code class="literal">--compress[={OFF|ON}]</code></td> </tr>
  <tr><th>Desatualizado</th> <td>Sim</td> </tr>
  <tr><th>Tipo</th> <td>Booleano</td> </tr>
  <tr><th>Valor padrão</th> <td><code class="literal">OFF</code></td> </tr>
</table>4

  Exibir informações de versão e sair.

* `--vertical`, `-E`

  <table frame="box" rules="all" summary="Propriedades para compressão">
    <tr><th>Formato de linha de comando</th> <td><code class="literal">--compress[={OFF|ON}]</code></td> </tr>
    <tr><th>Desatualizado</th> <td>Sim</td> </tr>
    <tr><th>Tipo</th> <td>Booleano</td> </tr>
    <tr><th>Valor padrão</th> <td><code class="literal">OFF</code></td> </tr>
  </table>5

  Imprimir a saída verticalmente. Isso é semelhante a `--relative`, mas imprime a saída verticalmente.

* `--wait[=count]`, `-w[count]`

  <table frame="box" rules="all" summary="Propriedades para compressão">
    <tr><th>Formato de linha de comando</th> <td><code class="literal">--compress[={OFF|ON}]</code></td> </tr>
    <tr><th>Desatualizado</th> <td>Sim</td> </tr>
    <tr><th>Tipo</th> <td>Booleano</td> </tr>
    <tr><th>Valor padrão</th> <td><code class="literal">OFF</code></td> </tr>
  </table>6

  Se a conexão não puder ser estabelecida, aguarde e tente novamente em vez de abortar. Se um valor de *`count`* for fornecido, ele indica o número de vezes para tentar novamente. O valor padrão é uma vez.

* `--zstd-compression-level=level`

<table frame="box" rules="all" summary="Propriedades para compressão">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code class="literal">--compress[={OFF|ON}]</code></td>
  </tr>
  <tr>
    <th>Desatualizado</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Booleano</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code class="literal">OFF</code></td>
  </tr>
</table>7

  O nível de compressão a ser usado para conexões ao servidor que utilizam o algoritmo de compressão `zstd`. Os níveis permitidos são de 1 a 22, com valores maiores indicando níveis crescentes de compressão. O nível de compressão padrão do `zstd` é 3. O ajuste do nível de compressão não tem efeito em conexões que não utilizam compressão `zstd`.

  Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.