### 5.1.7 Variáveis de Sistema do Servidor

O servidor MySQL mantém muitas variáveis de sistema que afetam sua operação. A maioria das variáveis de sistema pode ser configurada na inicialização do server usando opções na linha de comando ou em um arquivo de opções. A maioria delas pode ser alterada dinamicamente em tempo de execução usando a instrução [`SET`](set-variable.html "13.7.4.1 Sintaxe SET para Atribuição de Variável"), o que permite modificar a operação do server sem precisar pará-lo e reiniciá-lo. Algumas variáveis são somente leitura, e seus valores são determinados pelo ambiente do sistema, pela forma como o MySQL está instalado no sistema, ou possivelmente pelas opções usadas para compilar o MySQL. A maioria das variáveis de sistema tem um valor padrão, mas existem exceções, incluindo variáveis somente leitura. Você também pode usar valores de variáveis de sistema em expressões.

Em tempo de execução, definir um valor de variável de sistema global requer o privilégio [`SUPER`](privileges-provided.html#priv_super). Definir um valor de variável de sistema de sessão normalmente não requer privilégios especiais e pode ser feito por qualquer usuário, embora haja exceções. Para mais informações, consulte a [Seção 5.1.8.1, “Privilégios de Variável de Sistema”](system-variable-privileges.html "5.1.8.1 Privilégios de Variável de Sistema").

Existem várias maneiras de ver os nomes e valores das variáveis de sistema:

* Para ver os valores que um server utiliza com base em seus padrões compilados e quaisquer arquivos de opções que ele leia, use este comando:

  ```sql
  mysqld --verbose --help
  ```

* Para ver os valores que um server utiliza com base apenas em seus padrões compilados, ignorando as configurações em quaisquer arquivos de opções, use este comando:

  ```sql
  mysqld --no-defaults --verbose --help
  ```

* Para ver os valores atuais usados por um server em execução, use a instrução [`SHOW VARIABLES`](show-variables.html "13.7.5.39 Instrução SHOW VARIABLES") ou as tabelas de variáveis de sistema do Performance Schema. Consulte a [Seção 25.12.13, “Tabelas de Variáveis de Sistema do Performance Schema”](performance-schema-system-variable-tables.html "25.12.13 Tabelas de Variáveis de Sistema do Performance Schema").

Esta seção fornece uma descrição de cada variável de sistema. Para uma tabela de resumo de variáveis de sistema, consulte a [Seção 5.1.4, “Referência de Variáveis de Sistema do Servidor”](server-system-variable-reference.html "5.1.4 Referência de Variáveis de Sistema do Servidor"). Para mais informações sobre a manipulação de variáveis de sistema, consulte a [Seção 5.1.8, “Usando Variáveis de Sistema”](using-system-variables.html "5.1.8 Usando Variáveis de Sistema").

Para informações adicionais sobre variáveis de sistema, consulte estas seções:

* [Seção 5.1.8, “Usando Variáveis de Sistema”](using-system-variables.html "5.1.8 Usando Variáveis de Sistema”), discute a sintaxe para configurar e exibir valores de variáveis de sistema.

* [Seção 5.1.8.2, “Variáveis de Sistema Dinâmicas”](dynamic-system-variables.html "5.1.8.2 Variáveis de Sistema Dinâmicas"), lista as variáveis que podem ser configuradas em tempo de execução.

* Informações sobre o ajuste fino (tuning) de variáveis de sistema podem ser encontradas na [Seção 5.1.1, “Configurando o Servidor”](server-configuration.html "5.1.1 Configurando o Servidor").

* [Seção 14.15, “Opções de Inicialização e Variáveis de Sistema do InnoDB”](innodb-parameters.html "14.15 Opções de Inicialização e Variáveis de Sistema do InnoDB”), lista as variáveis de sistema do `InnoDB`.

* [Seção 21.4.3.9.2, “Variáveis de Sistema do NDB Cluster”](mysql-cluster-options-variables.html#mysql-cluster-system-variables "21.4.3.9.2 Variáveis de Sistema do NDB Cluster”), lista as variáveis de sistema que são específicas do NDB Cluster.

* Para informações sobre variáveis de sistema do server específicas para replication, consulte a [Seção 16.1.6, “Opções e Variáveis de Replication e Binary Logging”](replication-options.html "16.1.6 Opções e Variáveis de Replication e Binary Logging").

Nota

Algumas das descrições das variáveis a seguir referem-se a "habilitar" ou "desabilitar" uma variável. Essas variáveis podem ser habilitadas com a instrução [`SET`](set-variable.html "13.7.4.1 Sintaxe SET para Atribuição de Variável") configurando-as para `ON` ou `1`, ou desabilitadas configurando-as para `OFF` ou `0`. Variáveis booleanas podem ser configuradas na inicialização com os valores `ON`, `TRUE`, `OFF` e `FALSE` (sem distinção entre maiúsculas e minúsculas), bem como `1` e `0`. Consulte a [Seção 4.2.2.4, “Modificadores de Opções de Programa”](option-modifiers.html "4.2.2.4 Modificadores de Opções de Programa").

Algumas variáveis de sistema controlam o tamanho de buffers ou caches. Para um determinado buffer, o server pode precisar alocar estruturas de dados internas. Essas estruturas tipicamente são alocadas a partir da memória total alocada ao buffer, e a quantidade de espaço necessária pode depender da plataforma. Isso significa que, ao atribuir um valor a uma variável de sistema que controla o tamanho de um buffer, a quantidade de espaço realmente disponível pode diferir do valor atribuído. Em alguns casos, a quantidade pode ser menor que o valor atribuído. Também é possível que o server ajuste um valor para cima. Por exemplo, se você atribuir o valor 0 a uma variável cujo valor mínimo é 1024, o server define o valor para 1024.

Os valores para tamanhos de buffer, comprimentos e tamanhos de stack são dados em bytes, a menos que especificado de outra forma.

Nota

Algumas descrições de variáveis de sistema incluem um tamanho de bloco (block size), caso em que um valor que não seja um múltiplo inteiro do tamanho de bloco declarado é arredondado para baixo para o próximo múltiplo inferior do tamanho de bloco antes de ser armazenado pelo server, ou seja, para [`FLOOR(valor)`](mathematical-functions.html#function_floor) `* block_size`.

*Exemplo*: Suponha que o tamanho de bloco para uma determinada variável seja dado como 4096, e você defina o valor da variável como 100000 (assumimos que o valor máximo da variável é maior que este número). Como 100000 / 4096 = 24.4140625, o server baixa automaticamente o valor para 98304 (24 \* 4096) antes de armazená-lo.

Em alguns casos, o máximo declarado para uma variável é o máximo permitido pelo parser do MySQL, mas não é um múltiplo exato do tamanho de bloco. Nesses casos, o máximo efetivo é o próximo múltiplo inferior do tamanho de bloco.

*Exemplo*: O valor máximo de uma variável de sistema é mostrado como 4294967295 (232-1), e seu tamanho de bloco é 1024. 4294967295 / 1024 = 4194303.9990234375, então se você definir esta variável para o seu máximo declarado, o valor realmente armazenado é 4194303 \* 1024 = 4294966272.

Algumas variáveis de sistema aceitam nomes de arquivo. A menos que especificado de outra forma, a localização padrão do arquivo é o diretório de dados se o valor for um nome de caminho relativo. Para especificar a localização explicitamente, use um nome de caminho absoluto. Suponha que o diretório de dados seja `/var/mysql/data`. Se uma variável com valor de arquivo for dada como um nome de caminho relativo, ela estará localizada em `/var/mysql/data`. Se o valor for um nome de caminho absoluto, sua localização será conforme o nome de caminho.

* [`authentication_windows_log_level`](server-system-variables.html#sysvar_authentication_windows_log_level)

  <table frame="box" rules="all" summary="Propriedades para authentication_windows_log_level"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-windows-log-level=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>authentication_windows_log_level</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>2</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4</code></td> </tr></thead></table>

  Esta variável está disponível apenas se o plugin de autenticação do Windows `authentication_windows` estiver habilitado e o código de debugging estiver habilitado. Consulte a [Seção 6.4.1.8, “Autenticação Plugável do Windows”](windows-pluggable-authentication.html "6.4.1.8 Autenticação Plugável do Windows").

  Esta variável define o nível de logging para o plugin de autenticação do Windows. A tabela a seguir mostra os valores permitidos.

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem logging</td> </tr><tr> <td>1</td> <td>Log apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Log mensagens de nível 1 e mensagens de warning</td> </tr><tr> <td>3</td> <td>Log mensagens de nível 2 e notas de informação</td> </tr><tr> <td>4</td> <td>Log mensagens de nível 3 e mensagens de debug</td> </tr></tbody></table>

* [`authentication_windows_use_principal_name`](server-system-variables.html#sysvar_authentication_windows_use_principal_name)

  <table frame="box" rules="all" summary="Propriedades para authentication_windows_use_principal_name"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>

  Esta variável está disponível apenas se o plugin de autenticação do Windows `authentication_windows` estiver habilitado. Consulte a [Seção 6.4.1.8, “Autenticação Plugável do Windows”](windows-pluggable-authentication.html "6.4.1.8 Autenticação Plugável do Windows").

  Um client que se autentica usando a função `InitSecurityContext()` deve fornecer uma string identificando o service ao qual ele se conecta (*`targetName`*). O MySQL usa o principal name (UPN) da conta sob a qual o server está em execução. O UPN tem o formato `user_id@computer_name` e não precisa ser registrado em nenhum lugar para ser usado. Este UPN é enviado pelo server no início do handshake de autenticação.

  Esta variável controla se o server envia o UPN no desafio inicial. Por padrão, a variável está habilitada. Por razões de segurança, ela pode ser desabilitada para evitar o envio do nome da conta do server para um client como cleartext. Se a variável estiver desabilitada, o server sempre envia um byte `0x00` no primeiro desafio, o client não especifica *`targetName`*, e como resultado, a autenticação NTLM é usada.

  Se o server falhar em obter seu UPN (o que acontece principalmente em ambientes que não suportam autenticação Kerberos), o UPN não é enviado pelo server e a autenticação NTLM é usada.

* [`autocommit`](server-system-variables.html#sysvar_autocommit)

  <table frame="box" rules="all" summary="Propriedades para autocommit"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--autocommit[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>autocommit</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>

  O modo autocommit. Se definido como 1, todas as mudanças em uma table entram em vigor imediatamente. Se definido como 0, você deve usar [`COMMIT`](commit.html "13.3.1 Instruções START TRANSACTION, COMMIT e ROLLBACK") para aceitar uma transaction ou [`ROLLBACK`](commit.html "13.3.1 Instruções START TRANSACTION, COMMIT e ROLLBACK") para cancelá-la. Se [`autocommit`](server-system-variables.html#sysvar_autocommit) for 0 e você mudá-lo para 1, o MySQL executa um [`COMMIT`](commit.html "13.3.1 Instruções START TRANSACTION, COMMIT e ROLLBACK") automático de qualquer transaction aberta. Outra forma de iniciar uma transaction é usar uma instrução [`START TRANSACTION`](commit.html "13.3.1 Instruções START TRANSACTION, COMMIT e ROLLBACK") ou [`BEGIN`](commit.html "13.3.1 Instruções START TRANSACTION, COMMIT e ROLLBACK"). Consulte a [Seção 13.3.1, “Instruções START TRANSACTION, COMMIT e ROLLBACK”](commit.html "13.3.1 Instruções START TRANSACTION, COMMIT e ROLLBACK").

  Por padrão, as conexões de client iniciam com [`autocommit`](server-system-variables.html#sysvar_autocommit) definido como 1. Para fazer com que os clients iniciem com um padrão de 0, defina o valor global de [`autocommit`](server-system-variables.html#sysvar_autocommit) iniciando o server com a opção [`--autocommit=0`](server-system-variables.html#sysvar_autocommit). Para definir a variável usando um arquivo de opções, inclua estas linhas:

  ```sql
  [mysqld]
  autocommit=0
  ```

* [`automatic_sp_privileges`](server-system-variables.html#sysvar_automatic_sp_privileges)

  <table frame="box" rules="all" summary="Propriedades para automatic_sp_privileges"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--automatic-sp-privileges[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>automatic_sp_privileges</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>

  Quando esta variável tem o valor 1 (o padrão), o server concede automaticamente os privilégios [`EXECUTE`](privileges-provided.html#priv_execute) e [`ALTER ROUTINE`](privileges-provided.html#priv_alter-routine) ao criador de uma stored routine, se o usuário ainda não puder executar e alterar ou descartar a routine. (O privilégio [`ALTER ROUTINE`](privileges-provided.html#priv_alter-routine) é necessário para descartar a routine.) O server também descarta automaticamente esses privilégios do criador quando a routine é descartada. Se [`automatic_sp_privileges`](server-system-variables.html#sysvar_automatic_sp_privileges) for 0, o server não adiciona ou descarta esses privilégios automaticamente.

  O criador de uma routine é a conta usada para executar a instrução `CREATE` para ela. Esta pode não ser a mesma conta nomeada como `DEFINER` na definição da routine.

  Se você iniciar o [**mysqld**](mysqld.html "4.3.1 mysqld — O Servidor MySQL") com [`--skip-new`](server-options.html#option_mysqld_skip-new), [`automatic_sp_privileges`](server-system-variables.html#sysvar_automatic_sp_privileges) é definido como `OFF`.

  Consulte também a [Seção 23.2.2, “Stored Routines e Privilégios MySQL”](stored-routines-privileges.html "23.2.2 Stored Routines e Privilégios MySQL").

* [`auto_generate_certs`](server-system-variables.html#sysvar_auto_generate_certs)

  <table frame="box" rules="all" summary="Propriedades para auto_generate_certs"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-certs[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>auto_generate_certs</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>

  Esta variável está disponível se o server foi compilado usando OpenSSL (consulte a [Seção 6.3.4, “Capacidades Dependentes da Biblioteca SSL”](ssl-libraries.html "6.3.4 Capacidades Dependentes da Biblioteca SSL")). Ela controla se o server gera automaticamente arquivos de chave e certificado SSL no diretório de dados, se eles ainda não existirem.

  Na inicialização, o server gera automaticamente arquivos de chave e certificado SSL de server-side e client-side no diretório de dados se a variável de sistema [`auto_generate_certs`](server-system-variables.html#sysvar_auto_generate_certs) estiver habilitada, nenhuma opção SSL além de [`--ssl`](server-options.html#option_mysqld_ssl) for especificada, e os arquivos SSL de server-side estiverem faltando no diretório de dados. Esses arquivos habilitam conexões seguras de client usando SSL; consulte a [Seção 6.3.1, “Configurando o MySQL para Usar Conexões Criptografadas”](using-encrypted-connections.html "6.3.1 Configurando o MySQL para Usar Conexões Criptografadas").

  Para mais informações sobre a geração automática de arquivos SSL, incluindo nomes e características de arquivos, consulte a [Seção 6.3.3.1, “Criando Certificados e Chaves SSL e RSA usando MySQL”](creating-ssl-rsa-files-using-mysql.html "6.3.3.1 Criando Certificados e Chaves SSL e RSA usando MySQL").

  A variável de sistema [`sha256_password_auto_generate_rsa_keys`](server-system-variables.html#sysvar_sha256_password_auto_generate_rsa_keys) está relacionada, mas controla a geração automática de arquivos de par de chaves RSA necessários para a troca segura de password usando RSA em conexões não criptografadas.

* [`avoid_temporal_upgrade`](server-system-variables.html#sysvar_avoid_temporal_upgrade)

  <table frame="box" rules="all" summary="Propriedades para avoid_temporal_upgrade"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--avoid-temporal-upgrade[={OFF|ON}]</code></td> </tr><tr><th>Obsoleta</th> <td>Sim</td> </tr><tr><th>Variável de Sistema</th> <td><code>avoid_temporal_upgrade</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></thead></table>

  Esta variável controla se o [`ALTER TABLE`](alter-table.html "13.1.8 Instrução ALTER TABLE") atualiza implicitamente colunas temporais encontradas no formato anterior a 5.6.4 (colunas [`TIME`](time.html "11.2.3 O Tipo TIME"), [`DATETIME`](datetime.html "11.2.2 Os Tipos DATE, DATETIME e TIMESTAMP") e [`TIMESTAMP`](datetime.html "11.2.2 Os Tipos DATE, DATETIME e TIMESTAMP") sem suporte para precisão de segundos fracionários). A atualização dessas colunas requer uma reconstrução da table, o que impede qualquer uso de alterações rápidas que possam ser aplicadas à operação a ser realizada.

  Esta variável está desabilitada por padrão. Habilitá-la faz com que o [`ALTER TABLE`](alter-table.html "13.1.8 Instrução ALTER TABLE") não reconstrua colunas temporais e, assim, possa tirar proveito de possíveis alterações rápidas.

  Esta variável está obsoleta; espere que seja removida em uma futura release do MySQL.

* [`back_log`](server-system-variables.html#sysvar_back_log)

  <table frame="box" rules="all" summary="Propriedades para back_log"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--back-log=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>back_log</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa dimensionamento automático; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></thead></table>

  O número de solicitações de connection pendentes que o MySQL pode ter. Isso entra em jogo quando o Thread principal do MySQL recebe muitas solicitações de connection em um tempo muito curto. Leva algum tempo (embora muito pouco) para o Thread principal verificar a connection e iniciar um novo Thread. O valor [`back_log`](server-system-variables.html#sysvar_back_log) indica quantas solicitações podem ser empilhadas durante este curto período antes que o MySQL pare momentaneamente de responder a novas solicitações. Você precisa aumentar isso apenas se esperar um grande número de connections em um curto período de tempo.

  Em outras palavras, este valor é o tamanho da fila de escuta para conexões TCP/IP de entrada. Seu sistema operacional tem seu próprio limite para o tamanho desta fila. A página de manual para a chamada de sistema Unix `listen()` deve ter mais detalhes. Verifique a documentação do seu SO para o valor máximo desta variável. [`back_log`](server-system-variables.html#sysvar_back_log) não pode ser definido acima do limite do seu sistema operacional.

  O valor padrão é baseado na seguinte fórmula, limitado a 900:

  ```sql
  50 + (max_connections / 5)
  ```

* [`basedir`](server-system-variables.html#sysvar_basedir)

  <table frame="box" rules="all" summary="Propriedades para basedir"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>basedir</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do Diretório</td> </tr><tr><th>Valor Padrão</th> <td><code>default dependente da configuração</code></td> </tr></thead></table>

  O caminho para o diretório base da instalação do MySQL.

* [`big_tables`](server-system-variables.html#sysvar_big_tables)

  <table frame="box" rules="all" summary="Propriedades para big_tables"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--big-tables[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>big_tables</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></thead></table>

  Se habilitado, o server armazena todas as temporary tables em disco em vez de na memória. Isso impede a maioria dos erros `The table tbl_name is full` para operações [`SELECT`](select.html "13.2.9 Instrução SELECT") que requerem uma large temporary table, mas também atrasa Querys para as quais tables em memória seriam suficientes.

  O valor padrão para novas connections é `OFF` (usar temporary tables em memória). Normalmente, nunca deve ser necessário habilitar esta variável, pois o server é capaz de lidar com large result sets automaticamente, usando memória para small temporary tables e alternando para tables baseadas em disco conforme necessário.

* [`bind_address`](server-system-variables.html#sysvar_bind_address)

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem logging</td> </tr><tr> <td>1</td> <td>Log apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Log mensagens de nível 1 e mensagens de warning</td> </tr><tr> <td>3</td> <td>Log mensagens de nível 2 e notas de informação</td> </tr><tr> <td>4</td> <td>Log mensagens de nível 3 e mensagens de debug</td> </tr></tbody></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_log_level`. A tradução do texto continua abaixo.)*

  O server MySQL escuta em um único socket de rede para conexões TCP/IP. Este socket está ligado a um único address, mas é possível que um address seja mapeado para múltiplas interfaces de rede. Para especificar um address, defina [`bind_address=addr`](server-system-variables.html#sysvar_bind_address) na inicialização do server, onde *`addr`* é um address IPv4 ou IPv6 ou um host name. Se *`addr`* for um host name, o server resolve o nome para um IP address e se liga a esse address. Se um host name resolver para múltiplos IP addresses, o server usa o primeiro address IPv4 se houver algum, ou o primeiro address IPv6 caso contrário.

  O server trata diferentes tipos de addresses da seguinte forma:

  + Se o address for `*`, o server aceita conexões TCP/IP em todas as interfaces IPv4 do host do server e, se o host do server suportar IPv6, em todas as interfaces IPv6. Use este address para permitir conexões IPv4 e IPv6 em todas as interfaces do server. Este valor é o padrão.

  + Se o address for `0.0.0.0`, o server aceita conexões TCP/IP em todas as interfaces IPv4 do host do server.

  + Se o address for `::`, o server aceita conexões TCP/IP em todas as interfaces IPv4 e IPv6 do host do server.

  + Se o address for um address mapeado para IPv4, o server aceita conexões TCP/IP para esse address, tanto no formato IPv4 quanto IPv6. Por exemplo, se o server estiver ligado a `::ffff:127.0.0.1`, os clients podem se conectar usando `--host=127.0.0.1` ou `--host=::ffff:127.0.0.1`.

  + Se o address for um address IPv4 ou IPv6 "regular" (como `127.0.0.1` ou `::1`), o server aceita conexões TCP/IP apenas para esse address IPv4 ou IPv6.

  Se a ligação ao address falhar, o server produz um erro e não inicia.

  Se você pretende ligar o server a um address específico, certifique-se de que a table de sistema `mysql.user` contenha uma conta com privilégios administrativos que você possa usar para se conectar a esse address. Caso contrário, você não poderá desligar o server. Por exemplo, se você ligar o server a `*`, você pode se conectar a ele usando todas as contas existentes. Mas se você ligar o server a `::1`, ele aceita conexões apenas nesse address. Nesse caso, primeiro certifique-se de que a conta `'root'@'::1'` esteja presente na table `mysql.user` para que você ainda possa se conectar ao server para desligá-lo.

  Esta variável não tem efeito para o embedded server (`libmysqld`) e não é visível dentro do embedded server.

* [`block_encryption_mode`](server-system-variables.html#sysvar_block_encryption_mode)

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem logging</td> </tr><tr> <td>1</td> <td>Log apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Log mensagens de nível 1 e mensagens de warning</td> </tr><tr> <td>3</td> <td>Log mensagens de nível 2 e notas de informação</td> </tr><tr> <td>4</td> <td>Log mensagens de nível 3 e mensagens de debug</td> </tr></tbody></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_log_level`. A tradução do texto continua abaixo.)*

  Esta variável controla o modo de block encryption para algoritmos baseados em bloco, como AES. Ela afeta a encryption para [`AES_ENCRYPT()`](encryption-functions.html#function_aes-encrypt) e [`AES_DECRYPT()`](encryption-functions.html#function_aes-decrypt).

  [`block_encryption_mode`](server-system-variables.html#sysvar_block_encryption_mode) assume um valor no formato `aes-keylen-mode`, onde *`keylen`* é o comprimento da chave em bits e *`mode`* é o modo de encryption. O valor não distingue maiúsculas de minúsculas. Os valores *`keylen`* permitidos são 128, 192 e 256. Os modos de encryption permitidos dependem se o MySQL foi compilado usando OpenSSL ou yaSSL:

  + Para OpenSSL, os valores *`mode`* permitidos são: `ECB`, `CBC`, `CFB1`, `CFB8`, `CFB128`, `OFB`

  + Para yaSSL, os valores *`mode`* permitidos são: `ECB`, `CBC`

  Por exemplo, esta instrução faz com que as funções de encryption AES usem um comprimento de chave de 256 bits e o modo CBC:

  ```sql
  SET block_encryption_mode = 'aes-256-cbc';
  ```

  Ocorre um erro para tentativas de definir [`block_encryption_mode`](server-system-variables.html#sysvar_block_encryption_mode) para um valor que contenha um comprimento de chave não suportado ou um modo que a biblioteca SSL não suporte.

* [`bulk_insert_buffer_size`](server-system-variables.html#sysvar_bulk_insert_buffer_size)

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem logging</td> </tr><tr> <td>1</td> <td>Log apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Log mensagens de nível 1 e mensagens de warning</td> </tr><tr> <td>3</td> <td>Log mensagens de nível 2 e notas de informação</td> </tr><tr> <td>4</td> <td>Log mensagens de nível 3 e mensagens de debug</td> </tr></tbody></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_log_level`. A tradução do texto continua abaixo.)*

  O `MyISAM` usa um cache especial em forma de árvore para tornar as bulk inserts mais rápidas para [`INSERT ... SELECT`](insert-select.html "13.2.5.1 Instrução INSERT ... SELECT"), `INSERT ... VALUES (...), (...), ...` e [`LOAD DATA`](load-data.html "13.2.6 Instrução LOAD DATA") ao adicionar dados a tables não vazias. Esta variável limita o tamanho da árvore de cache em bytes por Thread. Defini-la como 0 desabilita esta otimização. O valor padrão é 8MB.

* [`character_set_client`](server-system-variables.html#sysvar_character_set_client)

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem logging</td> </tr><tr> <td>1</td> <td>Log apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Log mensagens de nível 1 e mensagens de warning</td> </tr><tr> <td>3</td> <td>Log mensagens de nível 2 e notas de informação</td> </tr><tr> <td>4</td> <td>Log mensagens de nível 3 e mensagens de debug</td> </tr></tbody></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_log_level`. A tradução do texto continua abaixo.)*

  O character set para instruções que chegam do client. O valor de sessão desta variável é definido usando o character set solicitado pelo client quando ele se conecta ao server. (Muitos clients suportam uma opção `--default-character-set` para permitir que este character set seja especificado explicitamente. Consulte também a [Seção 10.4, “Character Sets e Collation de Conexão”](charset-connection.html "10.4 Character Sets e Collation de Conexão").) O valor global da variável é usado para definir o valor de sessão em casos em que o valor solicitado pelo client é desconhecido ou não está disponível, ou o server está configurado para ignorar as solicitações do client:

  + O client solicita um character set não conhecido pelo server. Por exemplo, um client habilitado para japonês solicita `sjis` ao se conectar a um server não configurado com suporte a `sjis`.

  + O client é de uma versão do MySQL anterior ao MySQL 4.1 e, portanto, não solicita um character set.

  + O [**mysqld**](mysqld.html "4.3.1 mysqld — O Servidor MySQL") foi iniciado com a opção [`--skip-character-set-client-handshake`](server-options.html#option_mysqld_character-set-client-handshake), o que o faz ignorar a configuração do character set do client. Isso reproduz o comportamento do MySQL 4.0 e é útil caso você deseje fazer upgrade do server sem fazer upgrade de todos os clients.

  Alguns character sets não podem ser usados como character set do client. Tentar usá-los como valor de [`character_set_client`](server-system-variables.html#sysvar_character_set_client) produz um erro. Consulte [Character Sets de Client Não Permitidos](charset-connection.html#charset-connection-impermissible-client-charset "Character Sets de Client Não Permitidos").

* [`character_set_connection`](server-system-variables.html#sysvar_character_set_connection)

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem logging</td> </tr><tr> <td>1</td> <td>Log apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Log mensagens de nível 1 e mensagens de warning</td> </tr><tr> <td>3</td> <td>Log mensagens de nível 2 e notas de informação</td> </tr><tr> <td>4</td> <td>Log mensagens de nível 3 e mensagens de debug</td> </tr></tbody></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_log_level`. A tradução do texto continua abaixo.)*

  O character set usado para literais especificados sem um introducer de character set e para conversão de número para string. Para informações sobre introducers, consulte a [Seção 10.3.8, “Introducers de Character Set”](charset-introducer.html "10.3.8 Introducers de Character Set").

* [`character_set_database`](server-system-variables.html#sysvar_character_set_database)

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem logging</td> </tr><tr> <td>1</td> <td>Log apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Log mensagens de nível 1 e mensagens de warning</td> </tr><tr> <td>3</td> <td>Log mensagens de nível 2 e notas de informação</td> </tr><tr> <td>4</td> <td>Log mensagens de nível 3 e mensagens de debug</td> </tr></tbody></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_log_level`. A tradução do texto continua abaixo.)*

  O character set usado pelo Database padrão. O server define esta variável sempre que o Database padrão muda. Se não houver um Database padrão, a variável tem o mesmo valor que [`character_set_server`](server-system-variables.html#sysvar_character_set_server).

  As variáveis de sistema globais [`character_set_database`](server-system-variables.html#sysvar_character_set_database) e [`collation_database`](server-system-variables.html#sysvar_collation_database) estão obsoletas no MySQL 5.7; espere que sejam removidas em uma futura versão do MySQL.

  A atribuição de um valor às variáveis de sistema de sessão [`character_set_database`](server-system-variables.html#sysvar_character_set_database) e [`collation_database`](server-system-variables.html#sysvar_collation_database) está obsoleta no MySQL 5.7 e as atribuições produzem um warning. Você deve esperar que as variáveis de sessão se tornem somente leitura em uma futura versão do MySQL e as atribuições produzam um erro, enquanto ainda for possível acessar as variáveis de sessão para determinar o character set e a collation do Database padrão.

* [`character_set_filesystem`](server-system-variables.html#sysvar_character_set_filesystem)

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem logging</td> </tr><tr> <td>1</td> <td>Log apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Log mensagens de nível 1 e mensagens de warning</td> </tr><tr> <td>3</td> <td>Log mensagens de nível 2 e notas de informação</td> </tr><tr> <td>4</td> <td>Log mensagens de nível 3 e mensagens de debug</td> </tr></tbody></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_log_level`. A tradução do texto continua abaixo.)*

  O character set do file system. Esta variável é usada para interpretar literais de string que se referem a nomes de arquivos, como nas instruções [`LOAD DATA`](load-data.html "13.2.6 Instrução LOAD DATA") e [`SELECT ... INTO OUTFILE`](select-into.html "13.2.9.1 Instrução SELECT ... INTO") e a função [`LOAD_FILE()`](string-functions.html#function_load-file). Tais nomes de arquivo são convertidos de [`character_set_client`](server-system-variables.html#sysvar_character_set_client) para [`character_set_filesystem`](server-system-variables.html#sysvar_character_set_filesystem) antes que a tentativa de abertura do arquivo ocorra. O valor padrão é `binary`, o que significa que nenhuma conversão ocorre. Para sistemas nos quais nomes de arquivos multibyte são permitidos, um valor diferente pode ser mais apropriado. Por exemplo, se o sistema representa nomes de arquivos usando UTF-8, defina [`character_set_filesystem`](server-system-variables.html#sysvar_character_set_filesystem) como `'utf8mb4'`.

* [`character_set_results`](server-system-variables.html#sysvar_character_set_results)

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem logging</td> </tr><tr> <td>1</td> <td>Log apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Log mensagens de nível 1 e mensagens de warning</td> </tr><tr> <td>3</td> <td>Log mensagens de nível 2 e notas de informação</td> </tr><tr> <td>4</td> <td>Log mensagens de nível 3 e mensagens de debug</td> </tr></tbody></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_log_level`. A tradução do texto continua abaixo.)*

  O character set usado para retornar resultados de Query ao client. Isso inclui dados de resultado, como valores de coluna, metadata de resultado, como nomes de coluna, e mensagens de erro.

* [`character_set_server`](server-system-variables.html#sysvar_character_set_server)

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem logging</td> </tr><tr> <td>1</td> <td>Log apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Log mensagens de nível 1 e mensagens de warning</td> </tr><tr> <td>3</td> <td>Log mensagens de nível 2 e notas de informação</td> </tr><tr> <td>4</td> <td>Log mensagens de nível 3 e mensagens de debug</td> </tr></tbody></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_log_level`. A tradução do texto continua abaixo.)*

  O character set padrão do server. Consulte a [Seção 10.15, “Configuração do Character Set”](charset-configuration.html "10.15 Configuração do Character Set"). Se você definir esta variável, você também deve definir [`collation_server`](server-system-variables.html#sysvar_collation_server) para especificar a collation para o character set.

* [`character_set_system`](server-system-variables.html#sysvar_character_set_system)

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem logging</td> </tr><tr> <td>1</td> <td>Log apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Log mensagens de nível 1 e mensagens de warning</td> </tr><tr> <td>3</td> <td>Log mensagens de nível 2 e notas de informação</td> </tr><tr> <td>4</td> <td>Log mensagens de nível 3 e mensagens de debug</td> </tr></tbody></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_log_level`. A tradução do texto continua abaixo.)*

  O character set usado pelo server para armazenar identifiers. O valor é sempre `utf8`.

* [`character_sets_dir`](server-system-variables.html#sysvar_character_sets_dir)

  <table frame="box" rules="all" summary="Propriedades para authentication_windows_use_principal_name"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_use_principal_name`.)*

  O diretório onde os character sets estão instalados. Consulte a [Seção 10.15, “Configuração do Character Set”](charset-configuration.html "10.15 Configuração do Character Set").

* [`check_proxy_users`](server-system-variables.html#sysvar_check_proxy_users)

  <table frame="box" rules="all" summary="Propriedades para authentication_windows_use_principal_name"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_use_principal_name`.)*

  Alguns plugins de autenticação implementam mapeamento de proxy user para si mesmos (por exemplo, os plugins de autenticação PAM e Windows). Outros plugins de autenticação não suportam proxy users por padrão. Destes, alguns podem solicitar que o próprio server MySQL mapeie proxy users de acordo com os privilégios de proxy concedidos: `mysql_native_password`, `sha256_password`.

  Se a variável de sistema [`check_proxy_users`](server-system-variables.html#sysvar_check_proxy_users) estiver habilitada, o server executa o mapeamento de proxy user para quaisquer plugins de autenticação que façam tal solicitação. No entanto, também pode ser necessário habilitar variáveis de sistema específicas do plugin para aproveitar o suporte ao mapeamento de proxy user do server:

  + Para o plugin `mysql_native_password`, habilite [`mysql_native_password_proxy_users`](server-system-variables.html#sysvar_mysql_native_password_proxy_users).

  + Para o plugin `sha256_password`, habilite [`sha256_password_proxy_users`](server-system-variables.html#sysvar_sha256_password_proxy_users).

  Para informações sobre user proxying, consulte a [Seção 6.2.14, “Proxy Users”](proxy-users.html "6.2.14 Proxy Users").

* [`collation_connection`](server-system-variables.html#sysvar_collation_connection)

  <table frame="box" rules="all" summary="Propriedades para authentication_windows_use_principal_name"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_use_principal_name`.)*

  A collation do character set da connection. [`collation_connection`](server-system-variables.html#sysvar_collation_connection) é importante para comparações de strings literais. Para comparações de strings com valores de coluna, [`collation_connection`](server-system-variables.html#sysvar_collation_connection) não importa, pois as colunas têm sua própria collation, que tem uma precedência de collation mais alta (consulte a [Seção 10.8.4, “Coercibilidade de Collation em Expressões”](charset-collation-coercibility.html "10.8.4 Coercibilidade de Collation em Expressões")).

* [`collation_database`](server-system-variables.html#sysvar_collation_database)

  <table frame="box" rules="all" summary="Propriedades para authentication_windows_use_principal_name"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_use_principal_name`.)*

  A collation usada pelo Database padrão. O server define esta variável sempre que o Database padrão muda. Se não houver um Database padrão, a variável tem o mesmo valor que [`collation_server`](server-system-variables.html#sysvar_collation_server).

  As variáveis de sistema globais [`character_set_database`](server-system-variables.html#sysvar_character_set_database) e [`collation_database`](server-system-variables.html#sysvar_collation_database) estão obsoletas no MySQL 5.7; espere que sejam removidas em uma futura versão do MySQL.

  A atribuição de um valor às variáveis de sistema de sessão [`character_set_database`](server-system-variables.html#sysvar_character_set_database) e [`collation_database`](server-system-variables.html#sysvar_collation_database) está obsoleta no MySQL 5.7 e as atribuições produzem um warning. Espere que as variáveis de sessão se tornem somente leitura em uma futura versão do MySQL e as atribuições produzam um erro, enquanto ainda for possível acessar as variáveis de sessão para determinar o character set e a collation do Database padrão.

* [`collation_server`](server-system-variables.html#sysvar_collation_server)

  <table frame="box" rules="all" summary="Propriedades para authentication_windows_use_principal_name"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_use_principal_name`.)*

  A collation padrão do server. Consulte a [Seção 10.15, “Configuração do Character Set”](charset-configuration.html "10.15 Configuração do Character Set").

* [`completion_type`](server-system-variables.html#sysvar_completion_type)

  <table frame="box" rules="all" summary="Propriedades para authentication_windows_use_principal_name"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_use_principal_name`.)*

  O tipo de conclusão de transaction. Esta variável pode assumir os valores mostrados na tabela a seguir. A variável pode ser atribuída usando os nomes ou os valores inteiros correspondentes.

  <table frame="box" rules="all" summary="Propriedades para authentication_windows_use_principal_name"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_use_principal_name`.)*

  [`completion_type`](server-system-variables.html#sysvar_completion_type) afeta transactions que começam com [`START TRANSACTION`](commit.html "13.3.1 Instruções START TRANSACTION, COMMIT e ROLLBACK") ou [`BEGIN`](commit.html "13.3.1 Instruções START TRANSACTION, COMMIT e ROLLBACK") e terminam com [`COMMIT`](commit.html "13.3.1 Instruções START TRANSACTION, COMMIT e ROLLBACK") ou [`ROLLBACK`](commit.html "13.3.1 Instruções START TRANSACTION, COMMIT e ROLLBACK"). Não se aplica a commits implícitos resultantes da execução das instruções listadas na [Seção 13.3.3, “Instruções que Causam um Commit Implícito”](implicit-commit.html "13.3.3 Instruções que Causam um Commit Implícito"). Também não se aplica a [`XA COMMIT`](xa-statements.html "13.3.7.1 Instruções SQL de Transaction XA"), [`XA ROLLBACK`](xa-statements.html "13.3.7.1 Instruções SQL de Transaction XA"), ou quando [`autocommit=1`](server-system-variables.html#sysvar_autocommit).

* [`concurrent_insert`](server-system-variables.html#sysvar_concurrent_insert)

  <table frame="box" rules="all" summary="Propriedades para authentication_windows_use_principal_name"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_use_principal_name`.)*

  Se `AUTO` (o padrão), o MySQL permite que as instruções [`INSERT`](insert.html "13.2.5 Instrução INSERT") e [`SELECT`](select.html "13.2.9 Instrução SELECT") sejam executadas concurrentemente para tables `MyISAM` que não têm blocos livres no meio do arquivo de dados.

  Esta variável pode assumir os valores mostrados na tabela a seguir. A variável pode ser atribuída usando os nomes ou os valores inteiros correspondentes.

  <table frame="box" rules="all" summary="Propriedades para authentication_windows_use_principal_name"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_use_principal_name`.)*

  Se você iniciar o [**mysqld**](mysqld.html "4.3.1 mysqld — O Servidor MySQL") com [`--skip-new`](server-options.html#option_mysqld_skip-new), [`concurrent_insert`](server-system-variables.html#sysvar_concurrent_insert) é definido como `NEVER`.

  Consulte também a [Seção 8.11.3, “Concurrent Inserts”](concurrent-inserts.html "8.11.3 Concurrent Inserts").

* [`connect_timeout`](server-system-variables.html#sysvar_connect_timeout)

  <table frame="box" rules="all" summary="Propriedades para authentication_windows_use_principal_name"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_use_principal_name`.)*

  O número de segundos que o server [**mysqld**](mysqld.html "4.3.1 mysqld — O Servidor MySQL") espera por um pacote de connection antes de responder com `Bad handshake`. O valor padrão é 10 segundos.

  Aumentar o valor de [`connect_timeout`](server-system-variables.html#sysvar_connect_timeout) pode ajudar se os clients frequentemente encontrarem erros no formato `Lost connection to MySQL server at 'XXX', system error: errno`.

* [`core_file`](server-system-variables.html#sysvar_core_file)

  <table frame="box" rules="all" summary="Propriedades para autocommit"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--autocommit[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>autocommit</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `autocommit`.)*

  Se deve ser escrito um core file se o server sair inesperadamente. Esta variável é definida pela opção [`--core-file`](server-options.html#option_mysqld_core-file).

* [`datadir`](server-system-variables.html#sysvar_datadir)

  <table frame="box" rules="all" summary="Propriedades para autocommit"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--autocommit[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>autocommit</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `autocommit`.)*

  O caminho para o diretório de dados do server MySQL. Caminhos relativos são resolvidos em relação ao diretório atual. Se você espera que o server seja iniciado automaticamente (ou seja, em contextos para os quais você não pode assumir qual é o diretório atual), é melhor especificar o valor de [`datadir`](server-system-variables.html#sysvar_datadir) como um caminho absoluto.

* [`date_format`](server-system-variables.html#sysvar_date_format)

  Esta variável não é usada. Está obsoleta e será removida no MySQL 8.0.

* [`datetime_format`](server-system-variables.html#sysvar_datetime_format)

  Esta variável não é usada. Está obsoleta e será removida no MySQL 8.0.

* [`debug`](server-system-variables.html#sysvar_debug)

  <table frame="box" rules="all" summary="Propriedades para autocommit"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--autocommit[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>autocommit</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `autocommit`.)*

  Esta variável indica as configurações atuais de debugging. Ela está disponível apenas para servers construídos com suporte a debugging. O valor inicial vem do valor das instâncias da opção [`--debug`](server-options.html#option_mysqld_debug) fornecida na inicialização do server. Os valores global e de sessão podem ser definidos em tempo de execução.

  A definição do valor de sessão desta variável de sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a [Seção 5.1.8.1, “Privilégios de Variável de Sistema”](system-variable-privileges.html "5.1.8.1 Privilégios de Variável de Sistema").

  Atribuir um valor que começa com `+` ou `-` faz com que o valor seja adicionado ou subtraído do valor atual:

  ```sql
  mysql> SET debug = 'T';
  mysql> SELECT @@debug;
  +---------+
  | @@debug |
  +---------+
  | T       |
  +---------+

  mysql> SET debug = '+P';
  mysql> SELECT @@debug;
  +---------+
  | @@debug |
  +---------+
  | P:T     |
  +---------+

  mysql> SET debug = '-P';
  mysql> SELECT @@debug;
  +---------+
  | @@debug |
  +---------+
  | T       |
  +---------+
  ```

  Para mais informações, consulte a [Seção 5.8.3, “O Pacote DBUG”](dbug-package.html "5.8.3 O Pacote DBUG").

* [`debug_sync`](server-system-variables.html#sysvar_debug_sync)

  <table frame="box" rules="all" summary="Propriedades para autocommit"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--autocommit[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>autocommit</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `autocommit`.)*

  Esta variável é a interface de usuário para o recurso Debug Sync. O uso do Debug Sync requer que o MySQL seja configurado com a opção **CMake** [`-DWITH_DEBUG=ON`](source-configuration-options.html#option_cmake_with_debug) (consulte a [Seção 2.8.7, “Opções de Configuração de Fonte do MySQL”](source-configuration-options.html "2.8.7 Opções de Configuração de Fonte do MySQL")); caso contrário, esta variável de sistema não está disponível.

  O valor da variável global é somente leitura e indica se o recurso está habilitado. Por padrão, o Debug Sync está desabilitado e o valor de [`debug_sync`](server-system-variables.html#sysvar_debug_sync) é `OFF`. Se o server for iniciado com [`--debug-sync-timeout=N`](server-options.html#option_mysqld_debug-sync-timeout), onde *`N`* é um valor de timeout maior que 0, o Debug Sync é habilitado e o valor de [`debug_sync`](server-system-variables.html#sysvar_debug_sync) é `ON - current signal` seguido pelo nome do signal. Além disso, *`N`* se torna o timeout padrão para pontos de sincronização individuais.

  O valor da sessão pode ser lido por qualquer usuário e tem o mesmo valor que a variável global. O valor da sessão pode ser definido para controlar os pontos de sincronização.

  A definição do valor de sessão desta variável de sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a [Seção 5.1.8.1, “Privilégios de Variável de Sistema”](system-variable-privileges.html "5.1.8.1 Privilégios de Variável de Sistema").

  Para uma descrição do recurso Debug Sync e como usar pontos de sincronização, consulte a [Documentação Doxygen do MySQL Server](/doc/index-other.html).

* [`default_authentication_plugin`](server-system-variables.html#sysvar_default_authentication_plugin)

  <table frame="box" rules="all" summary="Propriedades para autocommit"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--autocommit[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>autocommit</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `autocommit`.)*

  O plugin de autenticação padrão. Estes valores são permitidos:

  + `mysql_native_password`: Usar passwords nativas do MySQL; consulte a [Seção 6.4.1.1, “Autenticação Plugável Nativa”](native-pluggable-authentication.html "6.4.1.1 Autenticação Plugável Nativa").

  + `sha256_password`: Usar passwords SHA-256; consulte a [Seção 6.4.1.5, “Autenticação Plugável SHA-256”](sha256-pluggable-authentication.html "6.4.1.5 Autenticação Plugável SHA-256").

  Note

  Se esta variável tiver um valor diferente de `mysql_native_password`, clients anteriores ao MySQL 5.5.7 não podem se conectar porque, dos plugins de autenticação padrão permitidos, eles entendem apenas o protocolo de autenticação `mysql_native_password`.

  O valor de [`default_authentication_plugin`](server-system-variables.html#sysvar_default_authentication_plugin) afeta estes aspectos da operação do server:

  + Ele determina qual plugin de autenticação o server atribui a novas contas criadas pelas instruções [`CREATE USER`](create-user.html "13.7.1.2 Instrução CREATE USER") e [`GRANT`](grant.html "13.7.1.4 Instrução GRANT") que não especificam explicitamente um plugin de autenticação.

  + A variável de sistema [`old_passwords`](server-system-variables.html#sysvar_old_passwords) afeta o password hashing para contas que usam o plugin de autenticação `mysql_native_password` ou `sha256_password`. Se o plugin de autenticação padrão for um desses plugins, o server define [`old_passwords`](server-system-variables.html#sysvar_old_passwords) na inicialização para o valor exigido pelo método de password hashing do plugin.

  + Para uma conta criada com qualquer uma das seguintes instruções, o server associa a conta ao plugin de autenticação padrão e atribui à conta o password fornecido, hashed conforme exigido por esse plugin:

    ```sql
    CREATE USER ... IDENTIFIED BY 'cleartext password';
    GRANT ...  IDENTIFIED BY 'cleartext password';
    ```

  + Para uma conta criada com qualquer uma das seguintes instruções, o server associa a conta ao plugin de autenticação padrão e atribui à conta o password hash fornecido, se o password hash tiver o formato exigido pelo plugin:

    ```sql
    CREATE USER ... IDENTIFIED BY PASSWORD 'encrypted password';
    GRANT ...  IDENTIFIED BY PASSWORD 'encrypted password';
    ```

    Se o password hash não estiver no formato exigido pelo plugin de autenticação padrão, a instrução falha.

* [`default_password_lifetime`](server-system-variables.html#sysvar_default_password_lifetime)

  <table frame="box" rules="all" summary="Propriedades para autocommit"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--autocommit[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>autocommit</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `autocommit`.)*

  Esta variável define a política global de expiração automática de password. O valor padrão de [`default_password_lifetime`](server-system-variables.html#sysvar_default_password_lifetime) é 0, o que desabilita a expiração automática de password. Se o valor de [`default_password_lifetime`](server-system-variables.html#sysvar_default_password_lifetime) for um inteiro positivo *`N`*, ele indica o tempo de vida permitido do password; os passwords devem ser alterados a cada *`N`* dias.

  A política global de expiração de password pode ser substituída conforme desejado para contas individuais usando as opções de expiração de password da instrução [`ALTER USER`](alter-user.html "13.7.1.1 Instrução ALTER USER"). Consulte a [Seção 6.2.11, “Gerenciamento de Password”](password-management.html "6.2.11 Gerenciamento de Password").

  Note

  Antes do MySQL 5.7.11, o valor padrão de [`default_password_lifetime`](server-system-variables.html#sysvar_default_password_lifetime) é 360 (passwords devem ser alterados aproximadamente uma vez por ano). Para essas versões, esteja ciente de que, se você não fizer alterações na variável [`default_password_lifetime`](server-system-variables.html#sysvar_default_password_lifetime) ou em contas de usuário individuais, todos os passwords de usuário expirarão após 360 dias, e todas as contas de usuário começarão a ser executadas em modo restrito quando isso acontecer. Clients (que são efetivamente usuários) que se conectam ao server receberão um erro indicando que o password deve ser alterado: `ERROR 1820 (HY000): You must reset your password using ALTER USER statement before executing this statement.`

  No entanto, isso é fácil de ser ignorado por clients que se conectam automaticamente ao server, como conexões feitas a partir de scripts. Para evitar que tais clients parem de funcionar repentinamente devido a um password expirado, certifique-se de alterar as configurações de expiração de password para esses clients, assim:

  ```sql
  ALTER USER 'script'@'localhost' PASSWORD EXPIRE NEVER;
  ```

  Alternativamente, defina a variável [`default_password_lifetime`](server-system-variables.html#sysvar_default_password_lifetime) como `0`, desabilitando assim a expiração automática de password para todos os usuários.

* [`default_storage_engine`](server-system-variables.html#sysvar_default_storage_engine)

  <table frame="box" rules="all" summary="Propriedades para autocommit"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--autocommit[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>autocommit</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `autocommit`.)*

  O storage engine padrão para tables. Consulte o [Capítulo 15, *Alternative Storage Engines*](storage-engines.html "Chapter 15 Alternative Storage Engines"). Esta variável define o storage engine apenas para tables permanentes. Para definir o storage engine para tables `TEMPORARY`, defina a variável de sistema [`default_tmp_storage_engine`](server-system-variables.html#sysvar_default_tmp_storage_engine). Consulte também a discussão sobre essa variável em relação aos valores possíveis.

  Para ver quais storage engines estão disponíveis e habilitados, use a instrução [`SHOW ENGINES`](show-engines.html "13.7.5.16 Instrução SHOW ENGINES") ou Query a table `INFORMATION_SCHEMA` [`ENGINES`](information-schema-engines-table.html "24.3.7 A Tabela INFORMATION_SCHEMA ENGINES").

  Se você desabilitar o storage engine padrão na inicialização do server, você deve definir o engine padrão tanto para tables permanentes quanto para tables `TEMPORARY` para um engine diferente ou o server não poderá iniciar.

* [`default_tmp_storage_engine`](server-system-variables.html#sysvar_default_tmp_storage_engine)

  <table frame="box" rules="all" summary="Propriedades para autocommit"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--autocommit[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>autocommit</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `autocommit`.)*

  O storage engine padrão para tables `TEMPORARY` (criadas com [`CREATE TEMPORARY TABLE`](create-table.html "13.1.18 Instrução CREATE TABLE")). Para definir o storage engine para tables permanentes, defina a variável de sistema [`default_storage_engine`](server-system-variables.html#sysvar_default_storage_engine). Consulte também a discussão sobre essa variável em relação aos valores possíveis.

  Se você desabilitar o storage engine padrão na inicialização do server, você deve definir o engine padrão tanto para tables permanentes quanto para tables `TEMPORARY` para um engine diferente ou o server não poderá iniciar.

* [`default_week_format`](server-system-variables.html#sysvar_default_week_format)

  <table frame="box" rules="all" summary="Propriedades para autocommit"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--autocommit[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>autocommit</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `autocommit`.)*

  O valor de modo padrão a ser usado para a função [`WEEK()`](date-and-time-functions.html#function_week). Consulte a [Seção 12.7, “Funções de Data e Hora”](date-and-time-functions.html "12.7 Funções de Data e Hora").

* [`delay_key_write`](server-system-variables.html#sysvar_delay_key_write)

  <table frame="box" rules="all" summary="Propriedades para autocommit"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--autocommit[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>autocommit</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `autocommit`.)*

  Esta variável especifica como usar key writes atrasadas. Ela se aplica apenas a tables `MyISAM`. A escrita atrasada de chave faz com que os key buffers não sejam descarregados entre as writes. Consulte também a [Seção 15.2.1, “Opções de Inicialização do MyISAM”](myisam-start.html "15.2.1 Opções de Inicialização do MyISAM").

  Esta variável pode ter um dos seguintes valores para afetar o manuseio da opção de table `DELAY_KEY_WRITE` que pode ser usada em instruções [`CREATE TABLE`](create-table.html "13.1.18 Instrução CREATE TABLE").

  <table frame="box" rules="all" summary="Propriedades para automatic_sp_privileges"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--automatic-sp-privileges[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>automatic_sp_privileges</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `automatic_sp_privileges`.)*

  Note

  Se você definir esta variável como `ALL`, você não deve usar tables `MyISAM` de dentro de outro programa (como outro MySQL server ou [**myisamchk**](myisamchk.html "4.6.3 myisamchk — Utilitário de Manutenção de Tabela MyISAM")) quando as tables estiverem em uso. Fazer isso leva à index corruption.

  Se `DELAY_KEY_WRITE` estiver habilitado para uma table, o key buffer não é descarregado para a table em cada atualização de Index, mas apenas quando a table é fechada. Isso acelera muito as writes em keys, mas se você usar este recurso, você deve adicionar verificação automática de todas as tables `MyISAM` iniciando o server com a variável de sistema [`myisam_recover_options`](server-system-variables.html#sysvar_myisam_recover_options) definida (por exemplo, `myisam_recover_options='BACKUP,FORCE'`). Consulte a [Seção 5.1.7, “Variáveis de Sistema do Servidor”](server-system-variables.html "5.1.7 Variáveis de Sistema do Servidor") e a [Seção 15.2.1, “Opções de Inicialização do MyISAM”](myisam-start.html "15.2.1 Opções de Inicialização do MyISAM").

  Se você iniciar o [**mysqld**](mysqld.html "4.3.1 mysqld — O Servidor MySQL") com [`--skip-new`](server-options.html#option_mysqld_skip-new), [`delay_key_write`](server-system-variables.html#sysvar_delay_key_write) é definido como `OFF`.

  Aviso

  Se você habilitar o external locking com [`--external-locking`](server-options.html#option_mysqld_external-locking), não há proteção contra index corruption para tables que usam key writes atrasadas.

* [`delayed_insert_limit`](server-system-variables.html#sysvar_delayed_insert_limit)

  <table frame="box" rules="all" summary="Propriedades para automatic_sp_privileges"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--automatic-sp-privileges[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>automatic_sp_privileges</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `automatic_sp_privileges`.)*

  Esta variável de sistema está obsoleta (porque inserts `DELAYED` não são suportadas); espere que seja removida em uma futura release.

* [`delayed_insert_timeout`](server-system-variables.html#sysvar_delayed_insert_timeout)

  <table frame="box" rules="all" summary="Propriedades para automatic_sp_privileges"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--automatic-sp-privileges[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>automatic_sp_privileges</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `automatic_sp_privileges`.)*

  Esta variável de sistema está obsoleta (porque inserts `DELAYED` não são suportadas); espere que seja removida em uma futura release.

* [`delayed_queue_size`](server-system-variables.html#sysvar_delayed_queue_size)

  <table frame="box" rules="all" summary="Propriedades para automatic_sp_privileges"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--automatic-sp-privileges[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>automatic_sp_privileges</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `automatic_sp_privileges`.)*

  Esta variável de sistema está obsoleta (porque inserts `DELAYED` não são suportadas); espere que seja removida em uma futura release.

* [`disabled_storage_engines`](server-system-variables.html#sysvar_disabled_storage_engines)

  <table frame="box" rules="all" summary="Propriedades para automatic_sp_privileges"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--automatic-sp-privileges[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>automatic_sp_privileges</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `automatic_sp_privileges`.)*

  Esta variável indica quais storage engines não podem ser usados para criar tables ou tablespaces. Por exemplo, para evitar a criação de novas tables `MyISAM` ou `FEDERATED`, inicie o server com estas linhas no arquivo de opções do server:

  ```sql
  [mysqld]
  disabled_storage_engines="MyISAM,FEDERATED"
  ```

  Por padrão, [`disabled_storage_engines`](server-system-variables.html#sysvar_disabled_storage_engines) está vazio (nenhum engine desabilitado), mas pode ser definido como uma lista separada por vírgulas de um ou mais engines (sem distinção entre maiúsculas e minúsculas). Qualquer engine nomeado no valor não pode ser usado para criar tables ou tablespaces com [`CREATE TABLE`](create-table.html "13.1.18 Instrução CREATE TABLE") ou [`CREATE TABLESPACE`](create-tablespace.html "13.1.19 Instrução CREATE TABLESPACE"), e não pode ser usado com [`ALTER TABLE ... ENGINE`](alter-table.html "13.1.8 Instrução ALTER TABLE") ou [`ALTER TABLESPACE ... ENGINE`](alter-tablespace.html "13.1.9 Instrução ALTER TABLESPACE") para alterar o storage engine de tables ou tablespaces existentes. Tentativas de fazê-lo resultam em um erro [`ER_DISABLED_STORAGE_ENGINE`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_disabled_storage_engine).

  [`disabled_storage_engines`](server-system-variables.html#sysvar_disabled_storage_engines) não restringe outras instruções DDL para tables existentes, como [`CREATE INDEX`](create-index.html "13.1.14 Instrução CREATE INDEX"), [`TRUNCATE TABLE`](truncate-table.html "13.1.34 Instrução TRUNCATE TABLE"), [`ANALYZE TABLE`](analyze-table.html "13.7.2.1 Instrução ANALYZE TABLE"), [`DROP TABLE`](drop-table.html "13.1.29 Instrução DROP TABLE") ou [`DROP TABLESPACE`](drop-tablespace.html "13.1.30 Instrução DROP TABLESPACE"). Isso permite uma transição suave para que tables ou tablespaces existentes que usam um engine desabilitado possam ser migrados para um engine permitido por meios como [`ALTER TABLE ... ENGINE permitted_engine`](alter-table.html "13.1.8 Instrução ALTER TABLE").

  É permitido definir a variável de sistema [`default_storage_engine`](server-system-variables.html#sysvar_default_storage_engine) ou [`default_tmp_storage_engine`](server-system-variables.html#sysvar_default_tmp_storage_engine) para um storage engine que está desabilitado. Isso pode fazer com que os aplicativos se comportem de forma errática ou falhem, embora isso possa ser uma técnica útil em um ambiente de desenvolvimento para identificar aplicativos que usam engines desabilitados, para que possam ser modificados.

  [`disabled_storage_engines`](server-system-variables.html#sysvar_disabled_storage_engines) é desabilitado e não tem efeito se o server for iniciado com qualquer uma destas opções: [`--bootstrap`](server-options.html#option_mysqld_bootstrap), [`--initialize`](server-options.html#option_mysqld_initialize), [`--initialize-insecure`](server-options.html#option_mysqld_initialize-insecure), [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables).

  Note

  A definição de [`disabled_storage_engines`](server-system-variables.html#sysvar_disabled_storage_engines) pode causar um problema com [**mysql_upgrade**](mysql-upgrade.html "4.4.7 mysql_upgrade — Verifica e Atualiza Tabelas MySQL"). Para detalhes, consulte a [Seção 4.4.7, “mysql_upgrade — Verifica e Atualiza Tabelas MySQL”](mysql-upgrade.html "4.4.7 mysql_upgrade — Verifica e Atualiza Tabelas MySQL").

* [`disconnect_on_expired_password`](server-system-variables.html#sysvar_disconnect_on_expired_password)

  <table frame="box" rules="all" summary="Propriedades para automatic_sp_privileges"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--automatic-sp-privileges[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>automatic_sp_privileges</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `automatic_sp_privileges`.)*

  Esta variável controla como o server lida com clients com passwords expirados:

  + Se o client indicar que pode lidar com passwords expirados, o valor de [`disconnect_on_expired_password`](server-system-variables.html#sysvar_disconnect_on_expired_password) é irrelevante. O server permite que o client se conecte, mas o coloca em modo sandbox.

  + Se o client não indicar que pode lidar com passwords expirados, o server lida com o client de acordo com o valor de [`disconnect_on_expired_password`](server-system-variables.html#sysvar_disconnect_on_expired_password):

    - Se [`disconnect_on_expired_password`](server-system-variables.html#sysvar_disconnect_on_expired_password) estiver habilitado, o server desconecta o client.

    - Se [`disconnect_on_expired_password`](server-system-variables.html#sysvar_disconnect_on_expired_password) estiver desabilitado, o server permite que o client se conecte, mas o coloca em modo sandbox.

  Para mais informações sobre a interação das configurações de client e server relacionadas ao manuseio de password expirado, consulte a [Seção 6.2.12, “Manuseio de Passwords Expirados pelo Servidor”](expired-password-handling.html "6.2.12 Manuseio de Passwords Expirados pelo Servidor").

* [`div_precision_increment`](server-system-variables.html#sysvar_div_precision_increment)

  <table frame="box" rules="all" summary="Propriedades para automatic_sp_privileges"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--automatic-sp-privileges[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>automatic_sp_privileges</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `automatic_sp_privileges`.)*

  Esta variável indica o número de dígitos pelos quais aumentar a escala do resultado das operações de divisão realizadas com o operator [`/`](arithmetic-functions.html#operator_divide). O valor padrão é 4. Os valores mínimo e máximo são 0 e 30, respectivamente. O exemplo a seguir ilustra o efeito de aumentar o valor padrão.

  ```sql
  mysql> SELECT 1/7;
  +--------+
  | 1/7    |
  +--------+
  | 0.1429 |
  +--------+
  mysql> SET div_precision_increment = 12;
  mysql> SELECT 1/7;
  +----------------+
  | 1/7            |
  +----------------+
  | 0.142857142857 |
  +----------------+
  ```

* [`end_markers_in_json`](server-system-variables.html#sysvar_end_markers_in_json)

  <table frame="box" rules="all" summary="Propriedades para automatic_sp_privileges"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--automatic-sp-privileges[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>automatic_sp_privileges</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `automatic_sp_privileges`.)*

  Se a saída JSON do optimizer deve adicionar end markers. Consulte a [Seção 8.15.9, “A Variável de Sistema end_markers_in_json”](end-markers-in-json-system-variable.html "8.15.9 A Variável de Sistema end_markers_in_json").

* [`eq_range_index_dive_limit`](server-system-variables.html#sysvar_eq_range_index_dive_limit)

  <table frame="box" rules="all" summary="Propriedades para automatic_sp_privileges"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--automatic-sp-privileges[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>automatic_sp_privileges</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `automatic_sp_privileges`.)*

  Esta variável indica o número de equality ranges em uma condição de comparação de igualdade quando o optimizer deve alternar do uso de index dives para index statistics ao estimar o número de linhas qualificadas. Aplica-se à avaliação de expressões que têm qualquer uma destas formas equivalentes, onde o optimizer usa um Index não exclusivo para procurar valores de *`col_name`*:

  ```sql
  col_name IN(val1, ..., valN)
  col_name = val1 OR ... OR col_name = valN
  ```

  Em ambos os casos, a expressão contém *`N`* equality ranges. O optimizer pode fazer estimativas de linha usando index dives ou index statistics. Se [`eq_range_index_dive_limit`](server-system-variables.html#sysvar_eq_range_index_dive_limit) for maior que 0, o optimizer usa index statistics existentes em vez de index dives se houver [`eq_range_index_dive_limit`](server-system-variables.html#sysvar_eq_range_index_dive_limit) ou mais equality ranges. Assim, para permitir o uso de index dives para até *`N`* equality ranges, defina [`eq_range_index_dive_limit`](server-system-variables.html#sysvar_eq_range_index_dive_limit) como *`N`* + 1. Para desabilitar o uso de index statistics e sempre usar index dives independentemente de *`N`*, defina [`eq_range_index_dive_limit`](server-system-variables.html#sysvar_eq_range_index_dive_limit) como 0.

  Para mais informações, consulte [Otimização de Equality Range de Comparações com Muitos Valores](range-optimization.html#equality-range-optimization "Otimização de Equality Range de Comparações com Muitos Valores").

  Para atualizar as table index statistics para obter as melhores estimativas, use [`ANALYZE TABLE`](analyze-table.html "13.7.2.1 Instrução ANALYZE TABLE").

* [`error_count`](server-system-variables.html#sysvar_error_count)

  O número de erros que resultaram da última instrução que gerou mensagens. Esta variável é somente leitura. Consulte a [Seção 13.7.5.17, “Instrução SHOW ERRORS”](show-errors.html "13.7.5.17 Instrução SHOW ERRORS").

* [`event_scheduler`](server-system-variables.html#sysvar_event_scheduler)

  <table frame="box" rules="all" summary="Propriedades para automatic_sp_privileges"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--automatic-sp-privileges[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>automatic_sp_privileges</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `automatic_sp_privileges`.)*

  Esta variável habilita ou desabilita, e inicia ou para, o Event Scheduler. Os valores de status possíveis são `ON`, `OFF` e `DISABLED`. Desligar o Event Scheduler (`OFF`) não é o mesmo que desabilitar o Event Scheduler, o que requer definir o status como `DISABLED`. Esta variável e seus efeitos na operação do Event Scheduler são discutidos em mais detalhes na [Seção 23.4.2, “Configuração do Agendador de Eventos”](events-configuration.html "23.4.2 Configuração do Agendador de Eventos").

* [`explicit_defaults_for_timestamp`](server-system-variables.html#sysvar_explicit_defaults_for_timestamp)

  <table frame="box" rules="all" summary="Propriedades para auto_generate_certs"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-certs[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>auto_generate_certs</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `auto_generate_certs`.)*

  Esta variável de sistema determina se o server habilita certos comportamentos não padrão para valores padrão e manuseio de valor `NULL` em colunas [`TIMESTAMP`](datetime.html "11.2.2 Os Tipos DATE, DATETIME e TIMESTAMP"). Por padrão, [`explicit_defaults_for_timestamp`](server-system-variables.html#sysvar_explicit_defaults_for_timestamp) está desabilitado, o que habilita os comportamentos não padrão.

  Se [`explicit_defaults_for_timestamp`](server-system-variables.html#sysvar_explicit_defaults_for_timestamp) estiver desabilitado, o server habilita os comportamentos não padrão e lida com colunas [`TIMESTAMP`](datetime.html "11.2.2 Os Tipos DATE, DATETIME e TIMESTAMP") da seguinte forma:

  + Colunas [`TIMESTAMP`](datetime.html "11.2.2 Os Tipos DATE, DATETIME e TIMESTAMP") não declaradas explicitamente com o atributo `NULL` são automaticamente declaradas com o atributo `NOT NULL`. A atribuição de um valor `NULL` a tal coluna é permitida e define a coluna para o timestamp atual.

  + A primeira coluna [`TIMESTAMP`](datetime.html "11.2.2 Os Tipos DATE, DATETIME e TIMESTAMP") em uma table, se não for declarada explicitamente com o atributo `NULL` ou um atributo `DEFAULT` ou `ON UPDATE` explícito, é automaticamente declarada com os atributos `DEFAULT CURRENT_TIMESTAMP` e `ON UPDATE CURRENT_TIMESTAMP`.

  + Colunas [`TIMESTAMP`](datetime.html "11.2.2 Os Tipos DATE, DATETIME e TIMESTAMP") seguintes à primeira, se não forem declaradas explicitamente com o atributo `NULL` ou um atributo `DEFAULT` explícito, são automaticamente declaradas como `DEFAULT '0000-00-00 00:00:00'` (o timestamp "zero"). Para linhas inseridas que não especificam um valor explícito para tal coluna, a coluna recebe `'0000-00-00 00:00:00'` e nenhum warning ocorre.

    Dependendo se o modo SQL estrito ou o modo SQL [`NO_ZERO_DATE`](sql-mode.html#sqlmode_no_zero_date) estiver habilitado, um valor padrão de `'0000-00-00 00:00:00'` pode ser inválido. Esteja ciente de que o modo SQL [`TRADITIONAL`](sql-mode.html#sqlmode_traditional) inclui o modo estrito e [`NO_ZERO_DATE`](sql-mode.html#sqlmode_no_zero_date). Consulte a [Seção 5.1.10, “Modos SQL do Servidor”](sql-mode.html "5.1.10 Modos SQL do Servidor").

  Os comportamentos não padrão recém-descritos estão obsoletos; espere que sejam removidos em uma futura release do MySQL.

  Se [`explicit_defaults_for_timestamp`](server-system-variables.html#sysvar_explicit_defaults_for_timestamp) estiver habilitado, o server desabilita os comportamentos não padrão e lida com colunas [`TIMESTAMP`](datetime.html "11.2.2 Os Tipos DATE, DATETIME e TIMESTAMP") da seguinte forma:

  + Não é possível atribuir um valor `NULL` a uma coluna [`TIMESTAMP`](datetime.html "11.2.2 Os Tipos DATE, DATETIME e TIMESTAMP") para defini-la para o timestamp atual. Para atribuir o timestamp atual, defina a coluna para [`CURRENT_TIMESTAMP`](date-and-time-functions.html#function_current-timestamp) ou um sinônimo como [`NOW()`](date-and-time-functions.html#function_now).

  + Colunas [`TIMESTAMP`](datetime.html "11.2.2 Os Tipos DATE, DATETIME e TIMESTAMP") não declaradas explicitamente com o atributo `NOT NULL` são automaticamente declaradas com o atributo `NULL` e permitem valores `NULL`. Atribuir um valor `NULL` a tal coluna a define como `NULL`, não como o timestamp atual.

  + Colunas [`TIMESTAMP`](datetime.html "11.2.2 Os Tipos DATE, DATETIME e TIMESTAMP") declaradas com o atributo `NOT NULL` não permitem valores `NULL`. Para inserts que especificam `NULL` para tal coluna, o resultado é um erro para uma insert de linha única se o modo SQL estrito estiver habilitado, ou `'0000-00-00 00:00:00'` é inserido para inserts de múltiplas linhas com o modo SQL estrito desabilitado. Em nenhum caso a atribuição de um valor `NULL` à coluna a define para o timestamp atual.

  + Colunas [`TIMESTAMP`](datetime.html "11.2.2 Os Tipos DATE, DATETIME e TIMESTAMP") declaradas explicitamente com o atributo `NOT NULL` e sem um atributo `DEFAULT` explícito são tratadas como não tendo valor padrão. Para linhas inseridas que não especificam um valor explícito para tal coluna, o resultado depende do modo SQL. Se o modo SQL estrito estiver habilitado, ocorre um erro. Se o modo SQL estrito não estiver habilitado, a coluna é declarada com o padrão implícito de `'0000-00-00 00:00:00'` e ocorre um warning. Isso é semelhante à forma como o MySQL trata outros tipos temporais como [`DATETIME`](datetime.html "11.2.2 Os Tipos DATE, DATETIME e TIMESTAMP").

  + Nenhuma coluna [`TIMESTAMP`](datetime.html "11.2.2 Os Tipos DATE, DATETIME e TIMESTAMP") é declarada automaticamente com os atributos `DEFAULT CURRENT_TIMESTAMP` ou `ON UPDATE CURRENT_TIMESTAMP`. Esses atributos devem ser explicitamente especificados.

  + A primeira coluna [`TIMESTAMP`](datetime.html "11.2.2 Os Tipos DATE, DATETIME e TIMESTAMP") em uma table não é tratada de forma diferente das colunas [`TIMESTAMP`](datetime.html "11.2.2 Os Tipos DATE, DATETIME e TIMESTAMP") seguintes à primeira.

  Se [`explicit_defaults_for_timestamp`](server-system-variables.html#sysvar_explicit_defaults_for_timestamp) estiver desabilitado na inicialização do server, este warning aparece no error log:

  ```sql
  [Warning] TIMESTAMP with implicit DEFAULT value is deprecated.
  Please use --explicit_defaults_for_timestamp server option (see
  documentation for more details).
  ```

  Conforme indicado pelo warning, para desabilitar os comportamentos não padrão obsoletos, habilite a variável de sistema [`explicit_defaults_for_timestamp`](server-system-variables.html#sysvar_explicit_defaults_for_timestamp) na inicialização do server.

  Note

  [`explicit_defaults_for_timestamp`](server-system-variables.html#sysvar_explicit_defaults_for_timestamp) está obsoleta porque seu único propósito é permitir o controle sobre comportamentos [`TIMESTAMP`](datetime.html "11.2.2 Os Tipos DATE, DATETIME e TIMESTAMP") obsoletos que serão removidos em uma futura release do MySQL. Quando a remoção desses comportamentos ocorrer, [`explicit_defaults_for_timestamp`](server-system-variables.html#sysvar_explicit_defaults_for_timestamp) não terá mais propósito, e você pode esperar que ela também seja removida.

  Para informações adicionais, consulte a [Seção 11.2.6, “Inicialização e Atualização Automática para TIMESTAMP e DATETIME”](timestamp-initialization.html "11.2.6 Inicialização e Atualização Automática para TIMESTAMP e DATETIME").

* [`external_user`](server-system-variables.html#sysvar_external_user)

  <table frame="box" rules="all" summary="Propriedades para auto_generate_certs"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-certs[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>auto_generate_certs</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `auto_generate_certs`.)*

  O nome de usuário externo usado durante o processo de autenticação, conforme definido pelo plugin usado para autenticar o client. Com a autenticação nativa (built-in) do MySQL, ou se o plugin não definir o valor, esta variável é `NULL`. Consulte a [Seção 6.2.14, “Proxy Users”](proxy-users.html "6.2.14 Proxy Users").

* [`flush`](server-system-variables.html#sysvar_flush)

  <table frame="box" rules="all" summary="Propriedades para auto_generate_certs"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-certs[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>auto_generate_certs</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `auto_generate_certs`.)*

  Se `ON`, o server descarrega (sincroniza) todas as mudanças para o disco após cada instrução SQL. Normalmente, o MySQL realiza uma write de todas as mudanças para o disco apenas após cada instrução SQL e permite que o sistema operacional lide com a sincronização para o disco. Consulte a [Seção B.3.3.3, “O Que Fazer Se o MySQL Continuar Travando”](crashing.html "B.3.3.3 O Que Fazer Se o MySQL Continuar Travando"). Esta variável é definida como `ON` se você iniciar o [**mysqld**](mysqld.html "4.3.1 mysqld — O Servidor MySQL") com a opção [`--flush`](server-options.html#option_mysqld_flush).

  Note

  Se [`flush`](server-system-variables.html#sysvar_flush) estiver habilitado, o valor de [`flush_time`](server-system-variables.html#sysvar_flush_time) não importa e as mudanças em [`flush_time`](server-system-variables.html#sysvar_flush_time) não têm efeito no comportamento de flush.

* [`flush_time`](server-system-variables.html#sysvar_flush_time)

  <table frame="box" rules="all" summary="Propriedades para auto_generate_certs"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-certs[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>auto_generate_certs</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `auto_generate_certs`.)*

  Se este valor for definido como diferente de zero, todas as tables são fechadas a cada [`flush_time`](server-system-variables.html#sysvar_flush_time) segundos para liberar recursos e sincronizar dados não descarregados para o disco. Esta opção é melhor usada apenas em sistemas com recursos mínimos.

  Note

  Se [`flush`](server-system-variables.html#sysvar_flush) estiver habilitado, o valor de [`flush_time`](server-system-variables.html#sysvar_flush_time) não importa e as mudanças em [`flush_time`](server-system-variables.html#sysvar_flush_time) não têm efeito no comportamento de flush.

* [`foreign_key_checks`](server-system-variables.html#sysvar_foreign_key_checks)

  <table frame="box" rules="all" summary="Propriedades para auto_generate_certs"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-certs[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>auto_generate_certs</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `auto_generate_certs`.)*

  Se definido como 1 (o padrão), as foreign key constraints são verificadas. Se definido como 0, as foreign key constraints são ignoradas, com algumas exceções. Ao recriar uma table que foi descartada, um erro é retornado se a definição da table não estiver em conformidade com as foreign key constraints que referenciam a table. Da mesma forma, uma operação [`ALTER TABLE`](alter-table.html "13.1.8 Instrução ALTER TABLE") retorna um erro se uma definição de foreign key estiver incorretamente formada. Para mais informações, consulte a [Seção 13.1.18.5, “FOREIGN KEY Constraints”](create-table-foreign-keys.html "13.1.18.5 FOREIGN KEY Constraints").

  Definir esta variável tem o mesmo efeito em tables [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") que tem em tables `InnoDB`. Normalmente, você deixa esta configuração habilitada durante a operação normal, para impor a [referential integrity](glossary.html#glos_referential_integrity "referential integrity"). Desabilitar a verificação de foreign key pode ser útil para recarregar tables `InnoDB` em uma ordem diferente da exigida por seus relacionamentos pai/filho. Consulte a [Seção 13.1.18.5, “FOREIGN KEY Constraints”](create-table-foreign-keys.html "13.1.18.5 FOREIGN KEY Constraints").

  Definir `foreign_key_checks` como 0 também afeta as instruções de definição de dados: [`DROP SCHEMA`](drop-database.html "13.1.22 Instrução DROP DATABASE") descarta um schema mesmo que ele contenha tables que tenham foreign keys referenciadas por tables fora do schema, e [`DROP TABLE`](drop-table.html "13.1.29 Instrução DROP TABLE") descarta tables que tenham foreign keys referenciadas por outras tables.

  Note

  Definir `foreign_key_checks` como 1 não aciona uma varredura dos dados da table existente. Portanto, as linhas adicionadas à table enquanto [`foreign_key_checks=0`](server-system-variables.html#sysvar_foreign_key_checks) não são verificadas quanto à consistência.

  O descarte de um Index exigido por uma foreign key constraint não é permitido, mesmo com `foreign_key_checks=0`. A foreign key constraint deve ser removida antes de descartar o Index (Bug #70260).

* [`ft_boolean_syntax`](server-system-variables.html#sysvar_ft_boolean_syntax)

  <table frame="box" rules="all" summary="Propriedades para auto_generate_certs"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-certs[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>auto_generate_certs</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `auto_generate_certs`.)*

  A lista de operators suportados por full-text searches booleanas realizadas usando `IN BOOLEAN MODE`. Consulte a [Seção 12.9.2, “Buscas Full-Text Booleanas”](fulltext-boolean.html "12.9.2 Buscas Full-Text Booleanas").

  O valor padrão da variável é `'+ -><()~*:""&|'`. As regras para alterar o valor são as seguintes:

  + A função do Operator é determinada pela posição dentro da string.

  + O valor de substituição deve ter 14 caracteres.
  + Cada caractere deve ser um caractere ASCII não alfanumérico.
  + O primeiro ou o segundo caractere deve ser um espaço.
  + Não são permitidas duplicatas, exceto os operators de citação de frase nas posições 11 e 12. Esses dois caracteres não precisam ser os mesmos, mas são os únicos dois que podem ser.

  + As posições 10, 13 e 14 (que por padrão são definidas como `:`, `&` e `|`) são reservadas para futuras extensões.

* [`ft_max_word_len`](server-system-variables.html#sysvar_ft_max_word_len)

  <table frame="box" rules="all" summary="Propriedades para auto_generate_certs"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-certs[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>auto_generate_certs</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `auto_generate_certs`.)*

  O comprimento máximo da palavra a ser incluída em um Index `FULLTEXT` do `MyISAM`.

  Note

  Indexes `FULLTEXT` em tables `MyISAM` devem ser reconstruídos após alterar esta variável. Use `REPAIR TABLE tbl_name QUICK`.

* [`ft_min_word_len`](server-system-variables.html#sysvar_ft_min_word_len)

  <table frame="box" rules="all" summary="Propriedades para auto_generate_certs"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-certs[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>auto_generate_certs</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `auto_generate_certs`.)*

  O comprimento mínimo da palavra a ser incluída em um Index `FULLTEXT` do `MyISAM`.

  Note

  Indexes `FULLTEXT` em tables `MyISAM` devem ser reconstruídos após alterar esta variável. Use `REPAIR TABLE tbl_name QUICK`.

* [`ft_query_expansion_limit`](server-system-variables.html#sysvar_ft_query_expansion_limit)

  <table frame="box" rules="all" summary="Propriedades para auto_generate_certs"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-certs[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>auto_generate_certs</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `auto_generate_certs`.)*

  O número de top matches a serem usados para full-text searches realizadas usando `WITH QUERY EXPANSION`.

* [`ft_stopword_file`](server-system-variables.html#sysvar_ft_stopword_file)

  <table frame="box" rules="all" summary="Propriedades para auto_generate_certs"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-certs[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>auto_generate_certs</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `auto_generate_certs`.)*

  O arquivo do qual ler a lista de stopwords para full-text searches em tables `MyISAM`. O server procura o arquivo no diretório de dados, a menos que um nome de caminho absoluto seja fornecido para especificar um diretório diferente. Todas as palavras do arquivo são usadas; comentários *não* são honrados. Por padrão, uma lista built-in de stopwords é usada (conforme definida no arquivo `storage/myisam/ft_static.c`). Definir esta variável como string vazia (`''`) desabilita a filtragem de stopword. Consulte também a [Seção 12.9.4, “Stopwords Full-Text”](fulltext-stopwords.html "12.9.4 Stopwords Full-Text").

  Note

  Indexes `FULLTEXT` em tables `MyISAM` devem ser reconstruídos após alterar esta variável ou o conteúdo do arquivo de stopword. Use `REPAIR TABLE tbl_name QUICK`.

* [`general_log`](server-system-variables.html#sysvar_general_log)

  <table frame="box" rules="all" summary="Propriedades para avoid_temporal_upgrade"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--avoid-temporal-upgrade[={OFF|ON}]</code></td> </tr><tr><th>Obsoleta</th> <td>Sim</td> </tr><tr><th>Variável de Sistema</th> <td><code>avoid_temporal_upgrade</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `avoid_temporal_upgrade`.)*

  Se o general Query log está habilitado. O valor pode ser 0 (ou `OFF`) para desabilitar o log ou 1 (ou `ON`) para habilitar o log. O destino para a saída do log é controlado pela variável de sistema [`log_output`](server-system-variables.html#sysvar_log_output); se esse valor for `NONE`, nenhuma entrada de log é escrita, mesmo se o log estiver habilitado.

* [`general_log_file`](server-system-variables.html#sysvar_general_log_file)

  <table frame="box" rules="all" summary="Propriedades para avoid_temporal_upgrade"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--avoid-temporal-upgrade[={OFF|ON}]</code></td> </tr><tr><th>Obsoleta</th> <td>Sim</td> </tr><tr><th>Variável de Sistema</th> <td><code>avoid_temporal_upgrade</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `avoid_temporal_upgrade`.)*

  O nome do arquivo de general Query log. O valor padrão é `host_name.log`, mas o valor inicial pode ser alterado com a opção [`--general_log_file`](server-system-variables.html#sysvar_general_log_file).

* [`group_concat_max_len`](server-system-variables.html#sysvar_group_concat_max_len)

  <table frame="box" rules="all" summary="Propriedades para avoid_temporal_upgrade"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--avoid-temporal-upgrade[={OFF|ON}]</code></td> </tr><tr><th>Obsoleta</th> <td>Sim</td> </tr><tr><th>Variável de Sistema</th> <td><code>avoid_temporal_upgrade</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `avoid_temporal_upgrade`.)*

  O comprimento máximo permitido do resultado em bytes para a função [`GROUP_CONCAT()`](aggregate-functions.html#function_group-concat). O padrão é 1024.

* [`have_compress`](server-system-variables.html#sysvar_have_compress)

  `YES` se a biblioteca de compressão `zlib` estiver disponível para o server, `NO` caso contrário. Caso contrário, as funções [`COMPRESS()`](encryption-functions.html#function_compress) e [`UNCOMPRESS()`](encryption-functions.html#function_uncompress) não podem ser usadas.

* [`have_crypt`](server-system-variables.html#sysvar_have_crypt)

  `YES` se a chamada de sistema `crypt()` estiver disponível para o server, `NO` caso contrário. Caso contrário, a função [`ENCRYPT()`](encryption-functions.html#function_encrypt) não pode ser usada.

  Note

  A função [`ENCRYPT()`](encryption-functions.html#function_encrypt) está obsoleta no MySQL 5.7, será removida em uma futura release do MySQL e não deve mais ser usada. (Para hashing unidirecional, considere usar [`SHA2()`](encryption-functions.html#function_sha2) em vez disso.) Consequentemente, [`have_crypt`](server-system-variables.html#sysvar_have_crypt) também está obsoleta; espere que seja removida em uma futura release.

* [`have_dynamic_loading`](server-system-variables.html#sysvar_have_dynamic_loading)

  `YES` se o [**mysqld**](mysqld.html "4.3.1 mysqld — O Servidor MySQL") suportar carregamento dinâmico de plugins, `NO` caso contrário. Se o valor for `NO`, você não pode usar opções como `--plugin-load` para carregar plugins na inicialização do server, ou a instrução [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 Instrução INSTALL PLUGIN") para carregar plugins em tempo de execução.

* [`have_geometry`](server-system-variables.html#sysvar_have_geometry)

  `YES` se o server suportar tipos de dados espaciais, `NO` caso contrário.

* [`have_openssl`](server-system-variables.html#sysvar_have_openssl)

  Esta variável é um sinônimo para [`have_ssl`](server-system-variables.html#sysvar_have_ssl).

* [`have_profiling`](server-system-variables.html#sysvar_have_profiling)

  `YES` se a capacidade de statement profiling estiver presente, `NO` caso contrário. Se presente, a variável de sistema `profiling` controla se esta capacidade está habilitada ou desabilitada. Consulte a [Seção 13.7.5.31, “Instrução SHOW PROFILES”](show-profiles.html "13.7.5.31 Instrução SHOW PROFILES").

  Esta variável está obsoleta; espere que seja removida em uma futura release do MySQL.

* [`have_query_cache`](server-system-variables.html#sysvar_have_query_cache)

  `YES` se o [**mysqld**](mysqld.html "4.3.1 mysqld — O Servidor MySQL") suportar o Query cache, `NO` caso contrário.

  Note

  O Query cache está obsoleto a partir do MySQL 5.7.20 e é removido no MySQL 8.0. A obsolescência inclui [`have_query_cache`](server-system-variables.html#sysvar_have_query_cache).

* [`have_rtree_keys`](server-system-variables.html#sysvar_have_rtree_keys)

  `YES` se os Indexes `RTREE` estiverem disponíveis, `NO` caso contrário. (Estes são usados para spatial indexes em tables `MyISAM`.)

* [`have_ssl`](server-system-variables.html#sysvar_have_ssl)

  <table frame="box" rules="all" summary="Propriedades para avoid_temporal_upgrade"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--avoid-temporal-upgrade[={OFF|ON}]</code></td> </tr><tr><th>Obsoleta</th> <td>Sim</td> </tr><tr><th>Variável de Sistema</th> <td><code>avoid_temporal_upgrade</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `avoid_temporal_upgrade`.)*

  `YES` se o [**mysqld**](mysqld.html "4.3.1 mysqld — O Servidor MySQL") suportar conexões SSL, `DISABLED` se o server foi compilado com suporte SSL, mas não foi iniciado com as opções de connection-encryption apropriadas. Para mais informações, consulte a [Seção 2.8.6, “Configurando o Suporte à Biblioteca SSL”](source-ssl-library-configuration.html "2.8.6 Configurando o Suporte à Biblioteca SSL").

* [`have_statement_timeout`](server-system-variables.html#sysvar_have_statement_timeout)

  <table frame="box" rules="all" summary="Propriedades para avoid_temporal_upgrade"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--avoid-temporal-upgrade[={OFF|ON}]</code></td> </tr><tr><th>Obsoleta</th> <td>Sim</td> </tr><tr><th>Variável de Sistema</th> <td><code>avoid_temporal_upgrade</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `avoid_temporal_upgrade`.)*

  Se o recurso de timeout de execução de instrução está disponível (consulte [Otimizador Hints de Tempo de Execução de Instrução](optimizer-hints.html#optimizer-hints-execution-time "Otimizador Hints de Tempo de Execução de Instrução")). O valor pode ser `NO` se o Thread de background usado por este recurso não puder ser inicializado.

* [`have_symlink`](server-system-variables.html#sysvar_have_symlink)

  `YES` se o suporte a symbolic link estiver habilitado, `NO` caso contrário. Isso é exigido no Unix para suporte das opções de table `DATA DIRECTORY` e `INDEX DIRECTORY`. Se o server for iniciado com a opção [`--skip-symbolic-links`](server-options.html#option_mysqld_symbolic-links), o valor é `DISABLED`.

  Esta variável não tem significado no Windows.

* [`host_cache_size`](server-system-variables.html#sysvar_host_cache_size)

  <table frame="box" rules="all" summary="Propriedades para avoid_temporal_upgrade"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--avoid-temporal-upgrade[={OFF|ON}]</code></td> </tr><tr><th>Obsoleta</th> <td>Sim</td> </tr><tr><th>Variável de Sistema</th> <td><code>avoid_temporal_upgrade</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `avoid_temporal_upgrade`.)*

  O server MySQL mantém um host cache em memória que contém informações de host name e IP address do client e é usado para evitar lookups de Domain Name System (DNS); consulte a [Seção 5.1.11.2, “Lookups de DNS e o Host Cache”](host-cache.html "5.1.11.2 Lookups de DNS e o Host Cache").

  A variável [`host_cache_size`](server-system-variables.html#sysvar_host_cache_size) controla o tamanho do host cache, bem como o tamanho da table [`host_cache`](performance-schema-host-cache-table.html "25.12.16.1 A Tabela host_cache") do Performance Schema que expõe o conteúdo do cache. Definir [`host_cache_size`](server-system-variables.html#sysvar_host_cache_size) tem estes efeitos:

  + Definir o tamanho para 0 desabilita o host cache. Com o cache desabilitado, o server executa um lookup de DNS toda vez que um client se conecta.

  + Alterar o tamanho em tempo de execução causa uma operação implícita de flush do host cache que limpa o host cache, trunca a table [`host_cache`](performance-schema-host-cache-table.html "25.12.16.1 A Tabela host_cache") e desbloqueia quaisquer hosts bloqueados.

  O valor padrão é dimensionado automaticamente para 128, mais 1 para um valor de [`max_connections`](server-system-variables.html#sysvar_max_connections) até 500, mais 1 para cada incremento de 20 acima de 500 no valor de [`max_connections`](server-system-variables.html#sysvar_max_connections), limitado a 2000.

  Usar a opção [`--skip-host-cache`](server-options.html#option_mysqld_skip-host-cache) é semelhante a definir a variável de sistema `host_cache_size` para 0, mas `host_cache_size` é mais flexível porque também pode ser usada para redimensionar, habilitar e desabilitar o host cache em tempo de execução, não apenas na inicialização do server.

  Iniciar o server com [`--skip-host-cache`](server-options.html#option_mysqld_skip-host-cache) não impede alterações em tempo de execução no valor de `host_cache_size`, mas tais alterações não têm efeito e o cache não é reabilitado mesmo se `host_cache_size` for definido como maior que 0.

  A definição da variável de sistema `host_cache_size` em vez da opção [`--skip-host-cache`](server-options.html#option_mysqld_skip-host-cache) é preferida pelas razões dadas no parágrafo anterior. Além disso, a opção `--skip-host-cache` está obsoleta no MySQL 8.0 e sua remoção é esperada em uma futura versão do MySQL.

* [`hostname`](server-system-variables.html#sysvar_hostname)

  <table frame="box" rules="all" summary="Propriedades para avoid_temporal_upgrade"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--avoid-temporal-upgrade[={OFF|ON}]</code></td> </tr><tr><th>Obsoleta</th> <td>Sim</td> </tr><tr><th>Variável de Sistema</th> <td><code>avoid_temporal_upgrade</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `avoid_temporal_upgrade`.)*

  O server define esta variável para o host name do server na inicialização.

* [`identity`](server-system-variables.html#sysvar_identity)

  Esta variável é um sinônimo para a variável [`last_insert_id`](server-system-variables.html#sysvar_last_insert_id). Ela existe para compatibilidade com outros Database systems. Você pode ler seu valor com `SELECT @@identity` e defini-lo usando `SET identity`.

* [`ignore_db_dirs`](server-system-variables.html#sysvar_ignore_db_dirs)

  <table frame="box" rules="all" summary="Propriedades para avoid_temporal_upgrade"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--avoid-temporal-upgrade[={OFF|ON}]</code></td> </tr><tr><th>Obsoleta</th> <td>Sim</td> </tr><tr><th>Variável de Sistema</th> <td><code>avoid_temporal_upgrade</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `avoid_temporal_upgrade`.)*

  Uma lista de nomes separados por vírgulas que não são considerados como diretórios de Database no diretório de dados. O valor é definido a partir de quaisquer instâncias de [`--ignore-db-dir`](server-options.html#option_mysqld_ignore-db-dir) fornecidas na inicialização do server.

  A partir do MySQL 5.7.11, [`--ignore-db-dir`](server-options.html#option_mysqld_ignore-db-dir) pode ser usado no momento da inicialização do diretório de dados com [**mysqld --initialize**](mysqld.html "4.3.1 mysqld — O Servidor MySQL") para especificar diretórios que o server deve ignorar para fins de avaliação se um diretório de dados existente é considerado vazio. Consulte a [Seção 2.9.1, “Inicializando o Diretório de Dados”](data-directory-initialization.html "2.9.1 Inicializando o Diretório de Dados").

  Esta variável de sistema está obsoleta no MySQL 5.7. Com a introdução do data dictionary no MySQL 8.0, ela se tornou supérflua e foi removida nessa versão.

* [`init_connect`](server-system-variables.html#sysvar_init_connect)

  <table frame="box" rules="all" summary="Propriedades para avoid_temporal_upgrade"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--avoid-temporal-upgrade[={OFF|ON}]</code></td> </tr><tr><th>Obsoleta</th> <td>Sim</td> </tr><tr><th>Variável de Sistema</th> <td><code>avoid_temporal_upgrade</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `avoid_temporal_upgrade`.)*

  Uma string a ser executada pelo server para cada client que se conecta. A string consiste em uma ou mais instruções SQL, separadas por caracteres de ponto e vírgula.

  Para usuários que têm o privilégio [`SUPER`](privileges-provided.html#priv_super), o conteúdo de [`init_connect`](server-system-variables.html#sysvar_init_connect) não é executado. Isso é feito para que um valor errôneo para [`init_connect`](server-system-variables.html#sysvar_init_connect) não impeça todos os clients de se conectarem. Por exemplo, o valor pode conter uma instrução que tenha um syntax error, fazendo com que as conexões do client falhem. Não executar [`init_connect`](server-system-variables.html#sysvar_init_connect) para usuários que têm o privilégio [`SUPER`](privileges-provided.html#priv_super) permite que eles abram uma connection e corrijam o valor de [`init_connect`](server-system-variables.html#sysvar_init_connect).

  A partir do MySQL 5.7.22, a execução de [`init_connect`](server-system-variables.html#sysvar_init_connect) é ignorada para qualquer client user com um password expirado. Isso é feito porque tal usuário não pode executar instruções arbitrárias, e assim a execução de [`init_connect`](server-system-variables.html#sysvar_init_connect) falha, deixando o client incapaz de se conectar. Ignorar a execução de [`init_connect`](server-system-variables.html#sysvar_init_connect) permite que o usuário se conecte e altere o password.

  O server descarta quaisquer result sets produzidos por instruções no valor de [`init_connect`](server-system-variables.html#sysvar_init_connect).

* [`init_file`](server-system-variables.html#sysvar_init_file)

  <table frame="box" rules="all" summary="Propriedades para avoid_temporal_upgrade"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--avoid-temporal-upgrade[={OFF|ON}]</code></td> </tr><tr><th>Obsoleta</th> <td>Sim</td> </tr><tr><th>Variável de Sistema</th> <td><code>avoid_temporal_upgrade</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `avoid_temporal_upgrade`.)*

  Se especificado, esta variável nomeia um arquivo contendo instruções SQL a serem lidas e executadas durante o processo de inicialização. Cada instrução deve estar em uma única linha e não deve incluir comentários.

  Se o server for iniciado com qualquer uma das opções [`--bootstrap`](server-options.html#option_mysqld_bootstrap), [`--initialize`](server-options.html#option_mysqld_initialize) ou [`--initialize-insecure`](server-options.html#option_mysqld_initialize-insecure), ele opera em modo bootstrap e algumas funcionalidades não estão disponíveis, o que limita as instruções permitidas no arquivo. Isso inclui instruções relacionadas ao gerenciamento de contas (como [`CREATE USER`](create-user.html "13.7.1.2 Instrução CREATE USER") ou [`GRANT`](grant.html "13.7.1.4 Instrução GRANT")), replication e global transaction identifiers. Consulte a [Seção 16.1.3, “Replication com Global Transaction Identifiers”](replication-gtids.html "16.1.3 Replication com Global Transaction Identifiers").

* `innodb_xxx`

  As variáveis de sistema do [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") estão listadas na [Seção 14.15, “Opções de Inicialização e Variáveis de Sistema do InnoDB”](innodb-parameters.html "14.15 Opções de Inicialização e Variáveis de Sistema do InnoDB”). Essas variáveis controlam muitos aspectos do storage, uso de memória e padrões de I/O para tables `InnoDB`, e são especialmente importantes agora que o `InnoDB` é o storage engine padrão.

* [`insert_id`](server-system-variables.html#sysvar_insert_id)

  O valor a ser usado pela seguinte instrução [`INSERT`](insert.html "13.2.5 Instrução INSERT") ou [`ALTER TABLE`](alter-table.html "13.1.8 Instrução ALTER TABLE") ao inserir um valor `AUTO_INCREMENT`. Isso é usado principalmente com o binary log.

* [`interactive_timeout`](server-system-variables.html#sysvar_interactive_timeout)

  <table frame="box" rules="all" summary="Propriedades para back_log"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--back-log=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>back_log</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa dimensionamento automático; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `back_log`.)*

  O número de segundos que o server espera por atividade em uma connection interativa antes de fechá-la. Um client interativo é definido como um client que usa a opção `CLIENT_INTERACTIVE` para [`mysql_real_connect()`](/doc/c-api/5.7/en/mysql-real-connect.html). Consulte também [`wait_timeout`](server-system-variables.html#sysvar_wait_timeout).

* [`internal_tmp_disk_storage_engine`](server-system-variables.html#sysvar_internal_tmp_disk_storage_engine)

  <table frame="box" rules="all" summary="Propriedades para back_log"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--back-log=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>back_log</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa dimensionamento automático; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `back_log`.)*

  O storage engine para internal temporary tables em disco (consulte a [Seção 8.4.4, “Uso de Internal Temporary Table no MySQL”](internal-temporary-tables.html "8.4.4 Uso de Internal Temporary Table no MySQL")). Os valores permitidos são `MYISAM` e `INNODB` (o padrão).

  O [optimizer](glossary.html#glos_optimizer "optimizer") usa o storage engine definido por [`internal_tmp_disk_storage_engine`](server-system-variables.html#sysvar_internal_tmp_disk_storage_engine) para internal temporary tables em disco.

  Ao usar [`internal_tmp_disk_storage_engine=INNODB`](server-system-variables.html#sysvar_internal_tmp_disk_storage_engine) (o padrão), as Querys que geram internal temporary tables em disco que excedem os [limites de linha ou coluna do InnoDB](innodb-limits.html "14.23 InnoDB Limits") retornam erros de Row size too large ou Too many columns. A solução alternativa é definir [`internal_tmp_disk_storage_engine`](server-system-variables.html#sysvar_internal_tmp_disk_storage_engine) como `MYISAM`.

* [`join_buffer_size`](server-system-variables.html#sysvar_join_buffer_size)

  <table frame="box" rules="all" summary="Propriedades para back_log"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--back-log=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>back_log</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa dimensionamento automático; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `back_log`.)*

  O tamanho mínimo do buffer que é usado para plain index scans, range index scans e JOINs que não usam Indexes e, portanto, executam full table scans. Normalmente, a melhor maneira de obter JOINs rápidas é adicionar Indexes. Aumente o valor de [`join_buffer_size`](server-system-variables.html#sysvar_join_buffer_size) para obter um full join mais rápido quando a adição de Indexes não for possível. Um join buffer é alocado para cada full join entre duas tables. Para um JOIN complexo entre várias tables para as quais Indexes não são usados, múltiplos join buffers podem ser necessários.

  O padrão é 256KB. A configuração máxima permitida para [`join_buffer_size`](server-system-variables.html#sysvar_join_buffer_size) é 4GB−1. Valores maiores são permitidos para plataformas de 64 bits (exceto Windows de 64 bits, para o qual valores grandes são truncados para 4GB−1 com um warning). O tamanho de bloco é 128, e um valor que não é um múltiplo exato do tamanho de bloco é arredondado para baixo para o próximo múltiplo inferior do tamanho de bloco pelo MySQL Server antes de armazenar o valor para a variável de sistema. O parser permite valores até o valor máximo de inteiro sem sinal para a plataforma (4294967295 ou 232−1 para um sistema de 32 bits, 18446744073709551615 ou 264−1 para um sistema de 64 bits), mas o máximo real é um tamanho de bloco inferior.

  A menos que um algoritmo Block Nested-Loop ou Batched Key Access seja usado, não há ganho em definir o buffer maior do que o necessário para conter cada linha correspondente, e todos os JOINs alocam pelo menos o tamanho mínimo, portanto, tenha cuidado ao definir esta variável para um valor grande globalmente. É melhor manter a configuração global pequena e alterar a configuração da sessão para um valor maior apenas em sessões que estão fazendo JOINs grandes. O tempo de alocação de memória pode causar quedas substanciais de performance se o tamanho global for maior do que o necessário pela maioria das Querys que o utilizam.

  Quando o Block Nested-Loop é usado, um join buffer maior pode ser benéfico até o ponto em que todas as colunas necessárias de todas as linhas na primeira table são armazenadas no join buffer. Isso depende da Query; o tamanho ideal pode ser menor do que o necessário para manter todas as linhas da primeira table.

  Quando o Batched Key Access é usado, o valor de [`join_buffer_size`](server-system-variables.html#sysvar_join_buffer_size) define o tamanho do batch de keys em cada solicitação ao storage engine. Quanto maior o buffer, mais acesso sequencial é feito à table do lado direito de uma operação JOIN, o que pode melhorar significativamente a performance.

  Para informações adicionais sobre join buffering, consulte a [Seção 8.2.1.6, “Algoritmos de Nested-Loop Join”](nested-loop-joins.html "8.2.1.6 Algoritmos de Nested-Loop Join"). Para informações sobre Batched Key Access, consulte a [Seção 8.2.1.11, “Block Nested-Loop e Batched Key Access Joins”](bnl-bka-optimization.html "8.2.1.11 Block Nested-Loop e Batched Key Access Joins").

* [`keep_files_on_create`](server-system-variables.html#sysvar_keep_files_on_create)

  <table frame="box" rules="all" summary="Propriedades para back_log"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--back-log=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>back_log</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa dimensionamento automático; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `back_log`.)*

  Se uma table `MyISAM` for criada sem a opção `DATA DIRECTORY`, o arquivo `.MYD` é criado no diretório do Database. Por padrão, se o `MyISAM` encontrar um arquivo `.MYD` existente neste caso, ele o sobrescreve. O mesmo se aplica aos arquivos `.MYI` para tables criadas sem a opção `INDEX DIRECTORY`. Para suprimir este comportamento, defina a variável [`keep_files_on_create`](server-system-variables.html#sysvar_keep_files_on_create) como `ON` (1), caso em que o `MyISAM` não sobrescreve arquivos existentes e retorna um erro. O valor padrão é `OFF` (0).

  Se uma table `MyISAM` for criada com uma opção `DATA DIRECTORY` ou `INDEX DIRECTORY` e um arquivo `.MYD` ou `.MYI` existente for encontrado, o MyISAM sempre retorna um erro. Ele não sobrescreve um arquivo no diretório especificado.

* [`key_buffer_size`](server-system-variables.html#sysvar_key_buffer_size)

  <table frame="box" rules="all" summary="Propriedades para back_log"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--back-log=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>back_log</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa dimensionamento automático; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `back_log`.)*

  Os Index blocks para tables `MyISAM` são armazenados em buffer e são compartilhados por todos os Threads. [`key_buffer_size`](server-system-variables.html#sysvar_key_buffer_size) é o tamanho do buffer usado para Index blocks. O key buffer também é conhecido como key cache.

  A configuração mínima permitida é 0, mas você não pode definir [`key_buffer_size`](server-system-variables.html#sysvar_key_buffer_size) para 0 dinamicamente. Uma configuração de 0 descarta o key cache, o que não é permitido em tempo de execução. A definição de [`key_buffer_size`](server-system-variables.html#sysvar_key_buffer_size) para 0 é permitida apenas na inicialização, caso em que o key cache não é inicializado. Alterar a configuração de [`key_buffer_size`](server-system-variables.html#sysvar_key_buffer_size) em tempo de execução de um valor de 0 para um valor não zero permitido inicializa o key cache.

  [`key_buffer_size`](server-system-variables.html#sysvar_key_buffer_size) pode ser aumentado ou diminuído apenas em incrementos ou múltiplos de 4096 bytes. Aumentar ou diminuir a configuração por um valor não conforme produz um warning e trunca a configuração para um valor conforme.

  A configuração máxima permitida para [`key_buffer_size`](server-system-variables.html#sysvar_key_buffer_size) é 4GB−1 em plataformas de 32 bits. Valores maiores são permitidos para plataformas de 64 bits. O tamanho máximo efetivo pode ser menor, dependendo da sua RAM física disponível e dos limites de RAM por processo impostos pelo seu sistema operacional ou plataforma de hardware. O valor desta variável indica a quantidade de memória solicitada. Internamente, o server aloca o máximo de memória possível até essa quantidade, mas a alocação real pode ser menor.

  Você pode aumentar o valor para obter um melhor manuseio de Index para todas as reads e múltiplas writes; em um sistema cuja função principal é executar o MySQL usando o storage engine [`MyISAM`](myisam-storage-engine.html "15.2 O Storage Engine MyISAM"), 25% da memória total da máquina é um valor aceitável para esta variável. No entanto, você deve estar ciente de que, se você tornar o valor muito grande (por exemplo, mais de 50% da memória total da máquina), seu sistema pode começar a fazer page swapping e ficar extremamente lento. Isso ocorre porque o MySQL depende do sistema operacional para realizar o file system caching para data reads, então você deve deixar algum espaço para o file system cache. Você também deve considerar os requisitos de memória de quaisquer outros storage engines que você possa estar usando além do [`MyISAM`](myisam-storage-engine.html "15.2 O Storage Engine MyISAM").

  Para ainda mais velocidade ao escrever muitas linhas ao mesmo tempo, use [`LOCK TABLES`](lock-tables.html "13.3.5 Instruções LOCK TABLES e UNLOCK TABLES"). Consulte a [Seção 8.2.4.1, “Otimizando Instruções INSERT”](insert-optimization.html "8.2.4.1 Otimizando Instruções INSERT").

  Você pode verificar a performance do key buffer emitindo uma instrução [`SHOW STATUS`](show-status.html "13.7.5.35 Instrução SHOW STATUS") e examinando as variáveis de status [`Key_read_requests`](server-status-variables.html#statvar_Key_read_requests), [`Key_reads`](server-status-variables.html#statvar_Key_reads), [`Key_write_requests`](server-status-variables.html#statvar_Key_write_requests) e [`Key_writes`](server-status-variables.html#statvar_Key_writes). (Consulte a [Seção 13.7.5, “Instruções SHOW”](show.html "13.7.5 Instruções SHOW").) A razão `Key_reads/Key_read_requests` deve ser normalmente menor que 0.01. A razão `Key_writes/Key_write_requests` geralmente está próxima de 1 se você estiver usando principalmente updates e deletes, mas pode ser muito menor se você tende a fazer updates que afetam muitas linhas ao mesmo tempo ou se você estiver usando a opção de table `DELAY_KEY_WRITE`.

  A fração do key buffer em uso pode ser determinada usando [`key_buffer_size`](server-system-variables.html#sysvar_key_buffer_size) em conjunto com a variável de status [`Key_blocks_unused`](server-status-variables.html#statvar_Key_blocks_unused) e o tamanho do bloco do buffer, que está disponível a partir da variável de sistema [`key_cache_block_size`](server-system-variables.html#sysvar_key_cache_block_size):

  ```sql
  1 - ((Key_blocks_unused * key_cache_block_size) / key_buffer_size)
  ```

  Este valor é uma aproximação porque algum espaço no key buffer é alocado internamente para estruturas administrativas. Fatores que influenciam a quantidade de overhead para essas estruturas incluem o tamanho do bloco e o tamanho do pointer. À medida que o tamanho do bloco aumenta, a porcentagem do key buffer perdida para overhead tende a diminuir. Blocos maiores resultam em um número menor de operações de read (porque mais keys são obtidas por read), mas, inversamente, um aumento nas reads de keys que não são examinadas (se nem todas as keys em um bloco forem relevantes para uma Query).

  É possível criar múltiplos key caches `MyISAM`. O limite de tamanho de 4GB se aplica a cada cache individualmente, não como um grupo. Consulte a [Seção 8.10.2, “O MyISAM Key Cache”](myisam-key-cache.html "8.10.2 O MyISAM Key Cache").

* [`key_cache_age_threshold`](server-system-variables.html#sysvar_key_cache_age_threshold)

  <table frame="box" rules="all" summary="Propriedades para back_log"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--back-log=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>back_log</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa dimensionamento automático; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `back_log`.)*

  Este valor controla a despromoção de buffers da sublista hot de um key cache para a sublista warm. Valores mais baixos fazem com que a despromoção aconteça mais rapidamente. O valor mínimo é 100. O valor padrão é 300. Consulte a [Seção 8.10.2, “O MyISAM Key Cache”](myisam-key-cache.html "8.10.2 O MyISAM Key Cache").

* [`key_cache_block_size`](server-system-variables.html#sysvar_key_cache_block_size)

  <table frame="box" rules="all" summary="Propriedades para back_log"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--back-log=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>back_log</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa dimensionamento automático; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `back_log`.)*

  O tamanho em bytes dos blocos no key cache. O valor padrão é 1024. Consulte a [Seção 8.10.2, “O MyISAM Key Cache”](myisam-key-cache.html "8.10.2 O MyISAM Key Cache").

* [`key_cache_division_limit`](server-system-variables.html#sysvar_key_cache_division_limit)

  <table frame="box" rules="all" summary="Propriedades para back_log"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--back-log=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>back_log</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa dimensionamento automático; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `back_log`.)*

  O ponto de divisão entre as sublistas hot e warm da lista de buffer do key cache. O valor é a porcentagem da lista de buffer a ser usada para a sublista warm. Os valores permitidos variam de 1 a 100. O valor padrão é 100. Consulte a [Seção 8.10.2, “O MyISAM Key Cache”](myisam-key-cache.html "8.10.2 O MyISAM Key Cache").

* [`large_files_support`](server-system-variables.html#sysvar_large_files_support)

  <table frame="box" rules="all" summary="Propriedades para back_log"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--back-log=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>back_log</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa dimensionamento automático; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `back_log`.)*

  Se o [**mysqld**](mysqld.html "4.3.1 mysqld — O Servidor MySQL") foi compilado com opções para large file support.

* [`large_pages`](server-system-variables.html#sysvar_large_pages)

  <table frame="box" rules="all" summary="Propriedades para back_log"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--back-log=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>back_log</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa dimensionamento automático; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `back_log`.)*

  Se o suporte a large page está habilitado (através da opção [`--large-pages`](server-options.html#option_mysqld_large-pages)). Consulte a [Seção 8.12.4.3, “Habilitando o Suporte a Large Page”](large-page-support.html "8.12.4.3 Habilitando o Suporte a Large Page").

* [`large_page_size`](server-system-variables.html#sysvar_large_page_size)

  <table frame="box" rules="all" summary="Propriedades para basedir"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>basedir</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do Diretório</td> </tr><tr><th>Valor Padrão</th> <td><code>default dependente da configuração</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `basedir`.)*

  Se o suporte a large page estiver habilitado, isso mostra o tamanho das páginas de memória. Large memory pages são suportadas apenas no Linux; em outras plataformas, o valor desta variável é sempre 0. Consulte a [Seção 8.12.4.3, “Habilitando o Suporte a Large Page”](large-page-support.html "8.12.4.3 Habilitando o Suporte a Large Page").

* [`last_insert_id`](server-system-variables.html#sysvar_last_insert_id)

  O valor a ser retornado de [`LAST_INSERT_ID()`](information-functions.html#function_last-insert-id). Isso é armazenado no binary log quando você usa [`LAST_INSERT_ID()`](information-functions.html#function_last-insert-id) em uma instrução que atualiza uma table. Definir esta variável não atualiza o valor retornado pela função C API [`mysql_insert_id()`](/doc/c-api/5.7/en/mysql-insert-id.html).

* [`lc_messages`](server-system-variables.html#sysvar_lc_messages)

  <table frame="box" rules="all" summary="Propriedades para basedir"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>basedir</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do Diretório</td> </tr><tr><th>Valor Padrão</th> <td><code>default dependente da configuração</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `basedir`.)*

  O locale a ser usado para mensagens de erro. O padrão é `en_US`. O server converte o argumento para um nome de idioma e o combina com o valor de [`lc_messages_dir`](server-system-variables.html#sysvar_lc_messages_dir) para produzir a localização do arquivo de mensagem de erro. Consulte a [Seção 10.12, “Definindo o Idioma da Mensagem de Erro”](error-message-language.html "10.12 Definindo o Idioma da Mensagem de Erro").

* [`lc_messages_dir`](server-system-variables.html#sysvar_lc_messages_dir)

  <table frame="box" rules="all" summary="Propriedades para basedir"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>basedir</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do Diretório</td> </tr><tr><th>Valor Padrão</th> <td><code>default dependente da configuração</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `basedir`.)*

  O diretório onde as mensagens de erro estão localizadas. O server usa o valor juntamente com o valor de [`lc_messages`](server-system-variables.html#sysvar_lc_messages) para produzir a localização do arquivo de mensagem de erro. Consulte a [Seção 10.12, “Definindo o Idioma da Mensagem de Erro”](error-message-language.html "10.12 Definindo o Idioma da Mensagem de Erro").

* [`lc_time_names`](server-system-variables.html#sysvar_lc_time_names)

  <table frame="box" rules="all" summary="Propriedades para basedir"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>basedir</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do Diretório</td> </tr><tr><th>Valor Padrão</th> <td><code>default dependente da configuração</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `basedir`.)*

  Esta variável especifica o locale que controla o idioma usado para exibir nomes e abreviações de dias e meses. Esta variável afeta a saída das funções [`DATE_FORMAT()`](date-and-time-functions.html#function_date-format), [`DAYNAME()`](date-and-time-functions.html#function_dayname) e [`MONTHNAME()`](date-and-time-functions.html#function_monthname). Nomes de Locale são valores no estilo POSIX, como `'ja_JP'` ou `'pt_BR'`. O valor padrão é `'en_US'`, independentemente da configuração de locale do seu sistema. Para mais informações, consulte a [Seção 10.16, “Suporte a Locale do Servidor MySQL”](locale-support.html "10.16 Suporte a Locale do Servidor MySQL").

* [`license`](server-system-variables.html#sysvar_license)

  <table frame="box" rules="all" summary="Propriedades para basedir"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>basedir</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do Diretório</td> </tr><tr><th>Valor Padrão</th> <td><code>default dependente da configuração</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `basedir`.)*

  O tipo de license que o server possui.

* [`local_infile`](server-system-variables.html#sysvar_local_infile)

  <table frame="box" rules="all" summary="Propriedades para basedir"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>basedir</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do Diretório</td> </tr><tr><th>Valor Padrão</th> <td><code>default dependente da configuração</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `basedir`.)*

  Esta variável controla a capacidade `LOCAL` do server-side para instruções [`LOAD DATA`](load-data.html "13.2.6 Instrução LOAD DATA"). Dependendo da configuração de [`local_infile`](server-system-variables.html#sysvar_local_infile), o server recusa ou permite o carregamento local de dados por clients que têm `LOCAL` habilitado no client side.

  Para fazer com que o server recuse ou permita explicitamente instruções [`LOAD DATA LOCAL`](load-data.html "13.2.6 Instrução LOAD DATA") (independentemente de como os programas e bibliotecas client são configurados em tempo de compilação ou execução), inicie o [**mysqld**](mysqld.html "4.3.1 mysqld — O Servidor MySQL") com [`local_infile`](server-system-variables.html#sysvar_local_infile) desabilitado ou habilitado, respectivamente. [`local_infile`](server-system-variables.html#sysvar_local_infile) também pode ser definido em tempo de execução. Para mais informações, consulte a [Seção 6.1.6, “Considerações de Segurança para LOAD DATA LOCAL”](load-data-local-security.html "6.1.6 Considerações de Segurança para LOAD DATA LOCAL").

* [`lock_wait_timeout`](server-system-variables.html#sysvar_lock_wait_timeout)

  <table frame="box" rules="all" summary="Propriedades para basedir"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>basedir</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do Diretório</td> </tr><tr><th>Valor Padrão</th> <td><code>default dependente da configuração</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `basedir`.)*

  Esta variável especifica o timeout em segundos para tentativas de adquirir metadata locks. Os valores permitidos variam de 1 a 31536000 (1 ano). O padrão é 31536000.

  Este timeout se aplica a todas as instruções que usam metadata locks. Isso inclui operações DML e DDL em tables, views, stored procedures e stored functions, bem como as instruções [`LOCK TABLES`](lock-tables.html "13.3.5 Instruções LOCK TABLES e UNLOCK TABLES"), [`FLUSH TABLES WITH READ LOCK`](flush.html#flush-tables-with-read-lock) e [`HANDLER`](handler.html "13.2.4 Instrução HANDLER").

  Este timeout não se aplica a acessos implícitos a tables de sistema no Database `mysql`, como grant tables modificadas por instruções [`GRANT`](grant.html "13.7.1.4 Instrução GRANT") ou [`REVOKE`](revoke.html "13.7.1.6 Instrução REVOKE") ou instruções de log de table. O timeout se aplica a tables de sistema acessadas diretamente, como com [`SELECT`](select.html "13.2.9 Instrução SELECT") ou [`UPDATE`](update.html "13.2.11 Instrução UPDATE").

  O valor do timeout se aplica separadamente para cada tentativa de metadata lock. Uma determinada instrução pode exigir mais de um Lock, então é possível que a instrução bloqueie por mais tempo do que o valor de [`lock_wait_timeout`](server-system-variables.html#sysvar_lock_wait_timeout) antes de relatar um erro de timeout. Quando ocorre o lock timeout, [`ER_LOCK_WAIT_TIMEOUT`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_lock_wait_timeout) é relatado.

  [`lock_wait_timeout`](server-system-variables.html#sysvar_lock_wait_timeout) não se aplica a delayed inserts, que sempre são executadas com um timeout de 1 ano. Isso é feito para evitar timeouts desnecessários, pois uma sessão que emite uma insert atrasada não recebe notificação de timeouts de insert atrasada.

* [`locked_in_memory`](server-system-variables.html#sysvar_locked_in_memory)

  <table frame="box" rules="all" summary="Propriedades para basedir"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>basedir</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do Diretório</td> </tr><tr><th>Valor Padrão</th> <td><code>default dependente da configuração</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `basedir`.)*

  Se o [**mysqld**](mysqld.html "4.3.1 mysqld — O Servidor MySQL") foi bloqueado na memória com [`--memlock`](server-options.html#option_mysqld_memlock).

* [`log_error`](server-system-variables.html#sysvar_log_error)

  <table frame="box" rules="all" summary="Propriedades para basedir"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>basedir</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do Diretório</td> </tr><tr><th>Valor Padrão</th> <td><code>default dependente da configuração</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `basedir`.)*

  O destino de saída do error log. Se o destino for o console, o valor é `stderr`. Caso contrário, o destino é um arquivo e o valor de [`log_error`](server-system-variables.html#sysvar_log_error) é o nome do arquivo. Consulte a [Seção 5.4.2, “O Error Log”](error-log.html "5.4.2 O Error Log").

* [`log_error_verbosity`](server-system-variables.html#sysvar_log_error_verbosity)

  <table frame="box" rules="all" summary="Propriedades para basedir"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>basedir</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do Diretório</td> </tr><tr><th>Valor Padrão</th> <td><code>default dependente da configuração</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `basedir`.)*

  A verbosidade do server ao escrever mensagens de erro, warning e note no error log. A tabela a seguir mostra os valores permitidos. O padrão é 3.

  <table frame="box" rules="all" summary="Propriedades para big_tables"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--big-tables[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>big_tables</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `big_tables`.)*

  [`log_error_verbosity`](server-system-variables.html#sysvar_log_error_verbosity) foi adicionada no MySQL 5.7.2. Ela é preferida e deve ser usada em vez da variável de sistema mais antiga [`log_warnings`](server-system-variables.html#sysvar_log_warnings). Consulte a descrição de [`log_warnings`](server-system-variables.html#sysvar_log_warnings) para obter informações sobre como essa variável se relaciona com [`log_error_verbosity`](server-system-variables.html#sysvar_log_error_verbosity). Em particular, atribuir um valor a [`log_warnings`](server-system-variables.html#sysvar_log_warnings) atribui um valor a [`log_error_verbosity`](server-system-variables.html#sysvar_log_error_verbosity) e vice-versa.

* [`log_output`](server-system-variables.html#sysvar_log_output)

  <table frame="box" rules="all" summary="Propriedades para big_tables"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--big-tables[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>big_tables</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `big_tables`.)*

  O destino ou destinos para a saída do general Query log e do slow Query log. O valor é uma lista de uma ou mais palavras separadas por vírgulas, escolhidas entre `TABLE`, `FILE` e `NONE`. `TABLE` seleciona o logging para as tables [`general_log`](server-system-variables.html#sysvar_general_log) e `slow_log` no Database de sistema `mysql`. `FILE` seleciona o logging para arquivos de log. `NONE` desabilita o logging. Se `NONE` estiver presente no valor, ele tem precedência sobre quaisquer outras palavras que estejam presentes. `TABLE` e `FILE` podem ser fornecidos para selecionar ambos os destinos de saída de log.

  Esta variável seleciona os destinos de saída do log, mas não habilita a saída do log. Para fazer isso, habilite as variáveis de sistema [`general_log`](server-system-variables.html#sysvar_general_log) e [`slow_query_log`](server-system-variables.html#sysvar_slow_query_log). Para logging `FILE`, as variáveis de sistema [`general_log_file`](server-system-variables.html#sysvar_general_log_file) e [`slow_query_log_file`](server-system-variables.html#sysvar_slow_query_log_file) determinam as localizações do arquivo de log. Para mais informações, consulte a [Seção 5.4.1, “Selecionando Destinos de Saída para General Query Log e Slow Query Log”](log-destinations.html "5.4.1 Selecionando Destinos de Saída para General Query Log e Slow Query Log").

* [`log_queries_not_using_indexes`](server-system-variables.html#sysvar_log_queries_not_using_indexes)

  <table frame="box" rules="all" summary="Propriedades para big_tables"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--big-tables[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>big_tables</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `big_tables`.)*

  Se você habilitar esta variável com o slow Query log habilitado, Querys que devem recuperar todas as linhas são logadas. Consulte a [Seção 5.4.5, “O Slow Query Log”](slow-query-log.html "5.4.5 O Slow Query Log"). Esta opção não significa necessariamente que nenhum Index é usado. Por exemplo, uma Query que usa uma full index scan usa um Index, mas seria logada porque o Index não limitaria o número de linhas.

* [`log_slow_admin_statements`](server-system-variables.html#sysvar_log_slow_admin_statements)

  <table frame="box" rules="all" summary="Propriedades para big_tables"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--big-tables[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>big_tables</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `big_tables`.)*

  Inclui slow administrative statements nas instruções escritas no slow Query log. Instruções administrativas incluem [`ALTER TABLE`](alter-table.html "13.1.8 Instrução ALTER TABLE"), [`ANALYZE TABLE`](analyze-table.html "13.7.2.1 Instrução ANALYZE TABLE"), [`CHECK TABLE`](check-table.html "13.7.2.2 Instrução CHECK TABLE"), [`CREATE INDEX`](create-index.html "13.1.14 Instrução CREATE INDEX"), [`DROP INDEX`](drop-index.html "13.1.25 Instrução DROP INDEX"), [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 Instrução OPTIMIZE TABLE") e [`REPAIR TABLE`](repair-table.html "13.7.2.5 Instrução REPAIR TABLE").

* [`log_syslog`](server-system-variables.html#sysvar_log_syslog)

  <table frame="box" rules="all" summary="Propriedades para big_tables"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--big-tables[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>big_tables</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `big_tables`.)*

  Se a saída do error log deve ser escrita no system log. Este é o Event Log no Windows e `syslog` em sistemas Unix e semelhantes ao Unix. O valor padrão é específico da plataforma:

  + No Windows, a saída do Event Log é habilitada por padrão.
  + Em sistemas Unix e semelhantes ao Unix, a saída do `syslog` é desabilitada por padrão.

  Independentemente do padrão, [`log_syslog`](server-system-variables.html#sysvar_log_syslog) pode ser definido explicitamente para controlar a saída em qualquer plataforma suportada.

  O controle de saída do system log é distinto de enviar a saída de erro para um arquivo ou console. A saída de erro pode ser direcionada para um arquivo ou console, além de ou em vez do system log, conforme desejado. Consulte a [Seção 5.4.2, “O Error Log”](error-log.html "5.4.2 O Error Log").

* [`log_syslog_facility`](server-system-variables.html#sysvar_log_syslog_facility)

  <table frame="box" rules="all" summary="Propriedades para big_tables"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--big-tables[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>big_tables</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `big_tables`.)*

  A facility para a saída do error log escrita no `syslog` (que tipo de programa está enviando a mensagem). Esta variável não tem efeito a menos que a variável de sistema [`log_syslog`](server-system-variables.html#sysvar_log_syslog) esteja habilitada. Consulte a [Seção 5.4.2.3, “Registro de Erros no System Log”](error-log-syslog.html "5.4.2.3 Registro de Erros no System Log").

  Os valores permitidos podem variar por sistema operacional; consulte a documentação do `syslog` do seu sistema.

  Esta variável não existe no Windows.

* [`log_syslog_include_pid`](server-system-variables.html#sysvar_log_syslog_include_pid)

  <table frame="box" rules="all" summary="Propriedades para big_tables"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--big-tables[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>big_tables</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `big_tables`.)*

  Se deve incluir o processo ID do server em cada linha de saída do error log escrita no `syslog`. Esta variável não tem efeito a menos que a variável de sistema [`log_syslog`](server-system-variables.html#sysvar_log_syslog) esteja habilitada. Consulte a [Seção 5.4.2.3, “Registro de Erros no System Log”](error-log-syslog.html "5.4.2.3 Registro de Erros no System Log").

  Esta variável não existe no Windows.

* [`log_syslog_tag`](server-system-variables.html#sysvar_log_syslog_tag)

  <table frame="box" rules="all" summary="Propriedades para big_tables"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--big-tables[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>big_tables</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `big_tables`.)*

  A tag a ser adicionada ao server identifier na saída do error log escrita no `syslog`. Esta variável não tem efeito a menos que a variável de sistema [`log_syslog`](server-system-variables.html#sysvar_log_syslog) esteja habilitada. Consulte a [Seção 5.4.2.3, “Registro de Erros no System Log”](error-log-syslog.html "5.4.2.3 Registro de Erros no System Log").

  Por padrão, o server identifier é `mysqld` sem tag. Se um valor de tag de *`tag`* for especificado, ele é anexado ao server identifier com um hífen inicial, resultando em um identifier de `mysqld-tag`.

  No Windows, para usar uma tag que ainda não existe, o server deve ser executado a partir de uma conta com privilégios de Administrator, para permitir a criação de uma entrada de registry para a tag. Privilégios elevados não são necessários se a tag já existir.

* [`log_timestamps`](server-system-variables.html#sysvar_log_timestamps)

  <table frame="box" rules="all" summary="Propriedades para big_tables"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--big-tables[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>big_tables</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `big_tables`.)*

  Esta variável controla o time zone dos timestamps em mensagens escritas no error log, e em general Query log e slow Query log mensagens escritas em arquivos. Não afeta o time zone das mensagens do general Query log e slow Query log escritas em tables (`mysql.general_log`, `mysql.slow_log`). As linhas recuperadas dessas tables podem ser convertidas do time zone do sistema local para qualquer time zone desejado com [`CONVERT_TZ()`](date-and-time-functions.html#function_convert-tz) ou definindo a variável de sistema de sessão [`time_zone`](server-system-variables.html#sysvar_time_zone).

  Os valores permitidos de [`log_timestamps`](server-system-variables.html#sysvar_log_timestamps) são `UTC` (o padrão) e `SYSTEM` (time zone do sistema local).

  Timestamps são escritos usando o formato ISO 8601 / RFC 3339: `YYYY-MM-DDThh:mm:ss.uuuuuu` mais um valor final de `Z` significando Zulu time (UTC) ou `±hh:mm` (um offset de UTC).

* [`log_throttle_queries_not_using_indexes`](server-system-variables.html#sysvar_log_throttle_queries_not_using_indexes)

  <table frame="box" rules="all" summary="Propriedades para big_tables"><thead><tr><th>Formato de Linha de Comando</th> <td><code>--big-tables[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>big_tables</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></thead></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `big_tables`.)*

  Se [`log_queries_not_using_indexes`](server-system-variables.html#sysvar_log_queries_not_using_indexes) estiver habilitado, a variável [`log_throttle_queries_not_using_indexes`](server-system-variables.html#sysvar_log_throttle_queries_not_using_indexes) limita o número de tais Querys por minuto que podem ser escritas no slow Query log. Um valor de 0 (o padrão) significa “sem limite”. Para mais informações, consulte a [Seção 5.4.5, “O Slow Query Log”](slow-query-log.html "5.4.5 O Slow Query Log").

* [`log_warnings`](server-system-variables.html#sysvar_log_warnings)

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem logging</td> </tr><tr> <td>1</td> <td>Log apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Log mensagens de nível 1 e mensagens de warning</td> </tr><tr> <td>3</td> <td>Log mensagens de nível 2 e notas de informação</td> </tr><tr> <td>4</td> <td>Log mensagens de nível 3 e mensagens de debug</td> </tr></tbody></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_log_level`. A tradução do texto continua abaixo.)*

  Se deve produzir mensagens de warning adicionais para o error log. A partir do MySQL 5.7.2, os itens de informação anteriormente regidos por [`log_warnings`](server-system-variables.html#sysvar_log_warnings) são regidos por [`log_error_verbosity`](server-system-variables.html#sysvar_log_error_verbosity), que é preferido e deve ser usado em vez da variável de sistema mais antiga [`log_warnings`](server-system-variables.html#sysvar_log_warnings). (A variável de sistema [`log_warnings`](server-system-variables.html#sysvar_log_warnings) e a opção de linha de comando [`--log-warnings`](server-options.html#option_mysqld_log-warnings) estão obsoletas; espere que sejam removidas em uma futura release do MySQL.)

  [`log_warnings`](server-system-variables.html#sysvar_log_warnings) é habilitado por padrão (o padrão é 1 antes do MySQL 5.7.2, 2 a partir do 5.7.2). Para desabilitá-lo, defina-o como 0. Se o valor for maior que 0, o server loga mensagens sobre instruções que são inseguras para statement-based logging. Se o valor for maior que 1, o server loga conexões abortadas e erros de access-denied para novas tentativas de connection. Consulte a [Seção B.3.2.9, “Erros de Comunicação e Conexões Abortadas”](communication-errors.html "B.3.2.9 Erros de Comunicação e Conexões Abortadas").

  Se você usa replication, é recomendado habilitar esta variável definindo-a como maior que 0, para obter mais informações sobre o que está acontecendo, como mensagens sobre falhas de rede e reconexões.

  Se um replica server for iniciado com [`log_warnings`](server-system-variables.html#sysvar_log_warnings) habilitado, a replica imprime mensagens no error log para fornecer informações sobre seu status, como o binary log e relay log coordinates onde ele inicia seu job, quando está mudando para outro relay log, quando reconecta após uma desconexão e assim por diante.

  Atribuir um valor a [`log_warnings`](server-system-variables.html#sysvar_log_warnings) atribui um valor a [`log_error_verbosity`](server-system-variables.html#sysvar_log_error_verbosity) e vice-versa. As variáveis estão relacionadas da seguinte forma:

  + A supressão de todos os itens de [`log_warnings`](server-system-variables.html#sysvar_log_warnings), alcançada com [`log_warnings=0`](server-system-variables.html#sysvar_log_warnings), é alcançada com [`log_error_verbosity=1`](server-system-variables.html#sysvar_log_error_verbosity) (apenas erros).

  + Itens impressos para [`log_warnings=1`](server-system-variables.html#sysvar_log_warnings) ou contagem superior como warnings e são impressos para [`log_error_verbosity=2`](server-system-variables.html#sysvar_log_error_verbosity) ou superior.

  + Itens impressos para [`log_warnings=2`](server-system-variables.html#sysvar_log_warnings) contam como notes e são impressos para [`log_error_verbosity=3`](server-system-variables.html#sysvar_log_error_verbosity).

  A partir do MySQL 5.7.2, o nível de log padrão é controlado por [`log_error_verbosity`](server-system-variables.html#sysvar_log_error_verbosity), que tem um padrão de 3. Além disso, o padrão para [`log_warnings`](server-system-variables.html#sysvar_log_warnings) muda de 1 para 2, o que corresponde a [`log_error_verbosity=3`](server-system-variables.html#sysvar_log_error_verbosity). Para alcançar um nível de logging semelhante ao padrão anterior, defina [`log_error_verbosity=2`](server-system-variables.html#sysvar_log_error_verbosity).

  No MySQL 5.7.2 e superior, o uso de [`log_warnings`](server-system-variables.html#sysvar_log_warnings) ainda é permitido, mas mapeia para o uso de [`log_error_verbosity`](server-system-variables.html#sysvar_log_error_verbosity) da seguinte forma:

  + Definir [`log_warnings=0`](server-system-variables.html#sysvar_log_warnings) é equivalente a [`log_error_verbosity=1`](server-system-variables.html#sysvar_log_error_verbosity) (apenas erros).

  + Definir [`log_warnings=1`](server-system-variables.html#sysvar_log_warnings) é equivalente a [`log_error_verbosity=2`](server-system-variables.html#sysvar_log_error_verbosity) (erros, warnings).

  + Definir [`log_warnings=2`](server-system-variables.html#sysvar_log_warnings) (ou superior) é equivalente a [`log_error_verbosity=3`](server-system-variables.html#sysvar_log_error_verbosity) (erros, warnings, notes), e o server define [`log_warnings`](server-system-variables.html#sysvar_log_warnings) para 2 se um valor maior for especificado.

* [`long_query_time`](server-system-variables.html#sysvar_long_query_time)

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem logging</td> </tr><tr> <td>1</td> <td>Log apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Log mensagens de nível 1 e mensagens de warning</td> </tr><tr> <td>3</td> <td>Log mensagens de nível 2 e notas de informação</td> </tr><tr> <td>4</td> <td>Log mensagens de nível 3 e mensagens de debug</td> </tr></tbody></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_log_level`. A tradução do texto continua abaixo.)*

  Se uma Query demorar mais do que este número de segundos, o server incrementa a variável de status [`Slow_queries`](server-status-variables.html#statvar_Slow_queries). Se o slow Query log estiver habilitado, a Query é logada no arquivo de slow Query log. Este valor é medido em tempo real, não em tempo de CPU, então uma Query que está abaixo do threshold em um sistema levemente carregado pode estar acima do threshold em um sistema fortemente carregado. Os valores mínimo e padrão de [`long_query_time`](server-system-variables.html#sysvar_long_query_time) são 0 e 10, respectivamente. O máximo é 31536000, que são 365 dias em segundos. O valor pode ser especificado com uma resolução de microssegundos. Consulte a [Seção 5.4.5, “O Slow Query Log”](slow-query-log.html "5.4.5 O Slow Query Log").

  Valores menores desta variável resultam em mais instruções sendo consideradas long-running, com o resultado de que mais espaço é necessário para o slow Query log. Para valores muito pequenos (menos de um segundo), o log pode crescer bastante em pouco tempo. Aumentar o número de instruções consideradas long-running também pode resultar em falsos positivos para o alerta "excessive Number of Long Running Processes" no MySQL Enterprise Monitor, especialmente se o Group Replication estiver habilitado. Por estas razões, valores muito pequenos devem ser usados apenas em ambientes de teste ou, em ambientes de produção, apenas por um curto período.

* [`low_priority_updates`](server-system-variables.html#sysvar_low_priority_updates)

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem logging</td> </tr><tr> <td>1</td> <td>Log apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Log mensagens de nível 1 e mensagens de warning</td> </tr><tr> <td>3</td> <td>Log mensagens de nível 2 e notas de informação</td> </tr><tr> <td>4</td> <td>Log mensagens de nível 3 e mensagens de debug</td> </tr></tbody></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_log_level`. A tradução do texto continua abaixo.)*

  Se definido como `1`, todas as instruções [`INSERT`](insert.html "13.2.5 Instrução INSERT"), [`UPDATE`](update.html "13.2.11 Instrução UPDATE"), [`DELETE`](delete.html "13.2.2 Instrução DELETE") e `LOCK TABLE WRITE` esperam até que não haja [`SELECT`](select.html "13.2.9 Instrução SELECT") ou `LOCK TABLE READ` pendente na table afetada. O mesmo efeito pode ser obtido usando `{INSERT | REPLACE | DELETE | UPDATE} LOW_PRIORITY ...` para diminuir a priority de apenas uma Query. Esta variável afeta apenas storage engines que usam apenas table-level locking (como `MyISAM`, `MEMORY` e `MERGE`). Consulte a [Seção 8.11.2, “Problemas de Table Locking”](table-locking.html "8.11.2 Problemas de Table Locking").

* [`lower_case_file_system`](server-system-variables.html#sysvar_lower_case_file_system)

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem logging</td> </tr><tr> <td>1</td> <td>Log apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Log mensagens de nível 1 e mensagens de warning</td> </tr><tr> <td>3</td> <td>Log mensagens de nível 2 e notas de informação</td> </tr><tr> <td>4</td> <td>Log mensagens de nível 3 e mensagens de debug</td> </tr></tbody></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_log_level`. A tradução do texto continua abaixo.)*

  Esta variável descreve a case sensitivity dos nomes de arquivo no file system onde o diretório de dados está localizado. `OFF` significa que os nomes de arquivo diferenciam maiúsculas de minúsculas (case-sensitive), `ON` significa que não diferenciam (case-insensitive). Esta variável é somente leitura porque reflete um atributo do file system e defini-la não teria efeito no file system.

* [`lower_case_table_names`](server-system-variables.html#sysvar_lower_case_table_names)

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem logging</td> </tr><tr> <td>1</td> <td>Log apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Log mensagens de nível 1 e mensagens de warning</td> </tr><tr> <td>3</td> <td>Log mensagens de nível 2 e notas de informação</td> </tr><tr> <td>4</td> <td>Log mensagens de nível 3 e mensagens de debug</td> </tr></tbody></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_log_level`. A tradução do texto continua abaixo.)*

  Se definido como 0, os nomes de table são armazenados conforme especificado e as comparações diferenciam maiúsculas de minúsculas (case-sensitive). Se definido como 1, os nomes de table são armazenados em minúsculas no disco e as comparações não diferenciam maiúsculas de minúsculas (case-insensitive). Se definido como 2, os nomes de table são armazenados conforme fornecido, mas comparados em minúsculas. Esta opção também se aplica a nomes de Database e aliases de table. Para detalhes adicionais, consulte a [Seção 9.2.3, “Case Sensitivity de Identifier”](identifier-case-sensitivity.html "9.2.3 Case Sensitivity de Identifier").

  O valor padrão desta variável depende da plataforma (consulte [`lower_case_file_system`](server-system-variables.html#sysvar_lower_case_file_system)). No Linux e em outros sistemas semelhantes ao Unix, o padrão é `0`. No Windows, o valor padrão é `1`. No macOS, o valor padrão é `2`. No Linux (e em outros sistemas semelhantes ao Unix), definir o valor como `2` não é suportado; o server força o valor para `0`.

  Você *não* deve definir [`lower_case_table_names`](server-system-variables.html#sysvar_lower_case_table_names) como 0 se estiver executando o MySQL em um sistema onde o diretório de dados reside em um file system que não diferencia maiúsculas de minúsculas (como no Windows ou macOS). É uma combinação não suportada que pode resultar em uma condição de hang ao executar uma operação `INSERT INTO ... SELECT ... FROM tbl_name` com a caixa de letra errada de *`tbl_name`*. Com o `MyISAM`, acessar nomes de table usando caixas de letras diferentes pode causar Index corruption.

  Uma mensagem de erro é impressa e o server sai se você tentar iniciar o server com [`--lower_case_table_names=0`](server-system-variables.html#sysvar_lower_case_table_names) em um file system que não diferencia maiúsculas de minúsculas.

  A configuração desta variável afeta o comportamento das opções de filtragem de replication em relação à case sensitivity. Para mais informações, consulte a [Seção 16.2.5, “Como os Servidores Avaliam as Regras de Filtragem de Replication”](replication-rules.html "16.2.5 Como os Servidores Avaliam as Regras de Filtragem de Replication").

* [`max_allowed_packet`](server-system-variables.html#sysvar_max_allowed_packet)

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem logging</td> </tr><tr> <td>1</td> <td>Log apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Log mensagens de nível 1 e mensagens de warning</td> </tr><tr> <td>3</td> <td>Log mensagens de nível 2 e notas de informação</td> </tr><tr> <td>4</td> <td>Log mensagens de nível 3 e mensagens de debug</td> </tr></tbody></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_log_level`. A tradução do texto continua abaixo.)*

  O tamanho máximo de um packet ou de qualquer string gerada/intermediária, ou de qualquer parâmetro enviado pela função C API [`mysql_stmt_send_long_data()`](/doc/c-api/5.7/en/mysql-stmt-send-long-data.html). O padrão é 4MB.

  O buffer de message de packet é inicializado para [`net_buffer_length`](server-system-variables.html#sysvar_net_buffer_length) bytes, mas pode crescer até [`max_allowed_packet`](server-system-variables.html#sysvar_max_allowed_packet) bytes quando necessário. Este valor por padrão é pequeno, para capturar packets grandes (possivelmente incorretos).

  Você deve aumentar este valor se estiver usando large [`BLOB`](blob.html "11.3.4 Os Tipos BLOB e TEXT") columns ou long strings. Deve ser tão grande quanto o maior [`BLOB`](blob.html "11.3.4 Os Tipos BLOB e TEXT") que você deseja usar. O limite de protocolo para [`max_allowed_packet`](server-system-variables.html#sysvar_max_allowed_packet) é 1GB. O valor deve ser um múltiplo de 1024; não múltiplos são arredondados para baixo para o múltiplo mais próximo.

  Ao alterar o tamanho do message buffer alterando o valor da variável [`max_allowed_packet`](server-system-variables.html#sysvar_max_allowed_packet), você também deve alterar o buffer size no client side se o seu programa client permitir. O valor padrão de [`max_allowed_packet`](server-system-variables.html#sysvar_max_allowed_packet) built-in na biblioteca client é 1GB, mas programas client individuais podem substituir isso. Por exemplo, [**mysql**](mysql.html "4.5.1 mysql — O Cliente de Linha de Comando MySQL") e [**mysqldump**](mysqldump.html "4.5.4 mysqldump — Um Programa de Backup de Database") têm padrões de 16MB e 24MB, respectivamente. Eles também permitem que você altere o valor do client-side definindo [`max_allowed_packet`](server-system-variables.html#sysvar_max_allowed_packet) na linha de comando ou em um arquivo de opções.

  O valor da sessão desta variável é somente leitura. O client pode receber até tantos bytes quanto o valor da sessão. No entanto, o server não pode enviar ao client mais bytes do que o valor global atual de [`max_allowed_packet`](server-system-variables.html#sysvar_max_allowed_packet). (O valor global pode ser menor do que o valor da sessão se o valor global for alterado após o client se conectar.)

* [`max_connect_errors`](server-system-variables.html#sysvar_max_connect_errors)

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem logging</td> </tr><tr> <td>1</td> <td>Log apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Log mensagens de nível 1 e mensagens de warning</td> </tr><tr> <td>3</td> <td>Log mensagens de nível 2 e notas de informação</td> </tr><tr> <td>4</td> <td>Log mensagens de nível 3 e mensagens de debug</td> </tr></tbody></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_log_level`. A tradução do texto continua abaixo.)*

  Após [`max_connect_errors`](server-system-variables.html#sysvar_max_connect_errors) solicitações de connection sucessivas de um host serem interrompidas sem uma connection bem-sucedida, o server bloqueia esse host de novas conexões. Se uma connection de um host for estabelecida com sucesso em menos de [`max_connect_errors`](server-system-variables.html#sysvar_max_connect_errors) tentativas após uma connection anterior ter sido interrompida, a contagem de erros para o host é zerada. Para desbloquear hosts bloqueados, descarregue o host cache; consulte [Descarregando o Host Cache](host-cache.html#host-cache-flushing "Descarregando o Host Cache").

* [`max_connections`](server-system-variables.html#sysvar_max_connections)

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem logging</td> </tr><tr> <td>1</td> <td>Log apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Log mensagens de nível 1 e mensagens de warning</td> </tr><tr> <td>3</td> <td>Log mensagens de nível 2 e notas de informação</td> </tr><tr> <td>4</td> <td>Log mensagens de nível 3 e mensagens de debug</td> </tr></tbody></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_log_level`. A tradução do texto continua abaixo.)*

  O número máximo permitido de client connections simultâneas. O valor máximo efetivo é o menor entre o valor efetivo de [`open_files_limit`](server-system-variables.html#sysvar_open_files_limit) `- 810` e o valor realmente definido para `max_connections`.

  Para mais informações, consulte a [Seção 5.1.11.1, “Interfaces de Conexão”](connection-interfaces.html "5.1.11.1 Interfaces de Conexão").

* [`max_delayed_threads`](server-system-variables.html#sysvar_max_delayed_threads)

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem logging</td> </tr><tr> <td>1</td> <td>Log apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Log mensagens de nível 1 e mensagens de warning</td> </tr><tr> <td>3</td> <td>Log mensagens de nível 2 e notas de informação</td> </tr><tr> <td>4</td> <td>Log mensagens de nível 3 e mensagens de debug</td> </tr></tbody></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_log_level`. A tradução do texto continua abaixo.)*

  Esta variável de sistema está obsoleta (porque inserts `DELAYED` não são suportadas); espere que seja removida em uma futura release.

* [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length)

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem logging</td> </tr><tr> <td>1</td> <td>Log apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Log mensagens de nível 1 e mensagens de warning</td> </tr><tr> <td>3</td> <td>Log mensagens de nível 2 e notas de informação</td> </tr><tr> <td>4</td> <td>Log mensagens de nível 3 e mensagens de debug</td> </tr></tbody></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_log_level`. A tradução do texto continua abaixo.)*

  O número máximo de bytes de memória reservado por sessão para o cálculo de normalized statement digests. Uma vez que essa quantidade de espaço é usada durante o cálculo do digest, ocorre truncation: nenhum token adicional de uma instrução parseada é coletado ou entra em seu valor de digest. Instruções que diferem apenas após essa quantidade de bytes de tokens parseados produzem o mesmo normalized statement digest e são consideradas idênticas se comparadas ou se agregadas para digest statistics.

  O comprimento usado para calcular um normalized statement digest é a soma do comprimento do normalized statement digest e do comprimento do statement digest. Como o comprimento do statement digest é sempre 64, quando o valor de `max_digest_length` é 1024 (o padrão), o comprimento máximo para uma instrução SQL normalizada antes que ocorra truncation é 1024 - 64 = 960 bytes.

  Aviso

  Definir [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) como zero desabilita a produção de digest, o que também desabilita a funcionalidade do server que requer digests, como o MySQL Enterprise Firewall.

  Diminuir o valor de [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) reduz o uso de memória, mas faz com que o valor de digest de mais instruções se torne indistinguível se elas diferirem apenas no final. Aumentar o valor permite que instruções mais longas sejam distinguidas, mas aumenta o uso de memória, particularmente para workloads que envolvem um grande número de sessões simultâneas (o server aloca [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) bytes por sessão).

  O parser usa esta variável de sistema como um limite para o comprimento máximo de normalized statement digests que ele calcula. O Performance Schema, se rastrear statement digests, faz uma cópia do valor do digest, usando a variável de sistema [`performance_schema_max_digest_length`](performance-schema-system-variables.html#sysvar_performance_schema_max_digest_length) como um limite para o comprimento máximo de digests que ele armazena. Consequentemente, se [`performance_schema_max_digest_length`](performance-schema-system-variables.html#sysvar_performance_schema_max_digest_length) for menor que [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length), os valores de digest armazenados no Performance Schema são truncados em relação aos valores de digest originais.

  Para mais informações sobre statement digesting, consulte a [Seção 25.10, “Statement Digests do Performance Schema”](performance-schema-statement-digests.html "25.10 Statement Digests do Performance Schema").

* [`max_error_count`](server-system-variables.html#sysvar_max_error_count)

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem logging</td> </tr><tr> <td>1</td> <td>Log apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Log mensagens de nível 1 e mensagens de warning</td> </tr><tr> <td>3</td> <td>Log mensagens de nível 2 e notas de informação</td> </tr><tr> <td>4</td> <td>Log mensagens de nível 3 e mensagens de debug</td> </tr></tbody></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_log_level`. A tradução do texto continua abaixo.)*

  O número máximo de mensagens de erro, warning e information a serem armazenadas para exibição pelas instruções [`SHOW ERRORS`](show-errors.html "13.7.5.17 Instrução SHOW ERRORS") e [`SHOW WARNINGS`](show-warnings.html "13.7.5.40 Instrução SHOW WARNINGS"). Este é o mesmo que o número de condition areas na diagnostics area e, portanto, o número de condições que podem ser inspecionadas por [`GET DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 Instrução GET DIAGNOSTICS").

* [`max_execution_time`](server-system-variables.html#sysvar_max_execution_time)

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem logging</td> </tr><tr> <td>1</td> <td>Log apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Log mensagens de nível 1 e mensagens de warning</td> </tr><tr> <td>3</td> <td>Log mensagens de nível 2 e notas de informação</td> </tr><tr> <td>4</td> <td>Log mensagens de nível 3 e mensagens de debug</td> </tr></tbody></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_log_level`. A tradução do texto continua abaixo.)*

  O timeout de execução para instruções [`SELECT`](select.html "13.2.9 Instrução SELECT"), em milissegundos. Se o valor for 0, os timeouts não estão habilitados.

  [`max_execution_time`](server-system-variables.html#sysvar_max_execution_time) se aplica da seguinte forma:

  + O valor global de [`max_execution_time`](server-system-variables.html#sysvar_max_execution_time) fornece o padrão para o valor da sessão para novas conexões. O valor da sessão se aplica a execuções de `SELECT` executadas dentro da sessão que não incluem um optimizer hint [`MAX_EXECUTION_TIME(N)`](optimizer-hints.html#optimizer-hints-execution-time "Otimizador Hints de Tempo de Execução de Instrução") ou para as quais *`N`* é 0.

  + [`max_execution_time`](server-system-variables.html#sysvar_max_execution_time) se aplica a instruções [`SELECT`](select.html "13.2.9 Instrução SELECT") somente leitura. As instruções que não são somente leitura são aquelas que invocam uma stored function que modifica dados como side effect.

  + [`max_execution_time`](server-system-variables.html#sysvar_max_execution_time) é ignorado para instruções [`SELECT`](select.html "13.2.9 Instrução SELECT") em stored programs.

* [`max_heap_table_size`](server-system-variables.html#sysvar_max_heap_table_size)

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem logging</td> </tr><tr> <td>1</td> <td>Log apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Log mensagens de nível 1 e mensagens de warning</td> </tr><tr> <td>3</td> <td>Log mensagens de nível 2 e notas de informação</td> </tr><tr> <td>4</td> <td>Log mensagens de nível 3 e mensagens de debug</td> </tr></tbody></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_log_level`. A tradução do texto continua abaixo.)*

  Esta variável define o tamanho máximo para o qual as tables `MEMORY` criadas pelo usuário podem crescer. O valor da variável é usado para calcular os valores de `MAX_ROWS` da table `MEMORY`.

  Definir esta variável não tem efeito em nenhuma table `MEMORY` existente, a menos que a table seja recriada com uma instrução como [`CREATE TABLE`](create-table.html "13.1.18 Instrução CREATE TABLE") ou alterada com [`ALTER TABLE`](alter-table.html "13.1.8 Instrução ALTER TABLE") ou [`TRUNCATE TABLE`](truncate-table.html "13.1.34 Instrução TRUNCATE TABLE"). Um restart do server também define o tamanho máximo das tables `MEMORY` existentes para o valor global de [`max_heap_table_size`](server-system-variables.html#sysvar_max_heap_table_size).

  Esta variável também é usada em conjunto com [`tmp_table_size`](server-system-variables.html#sysvar_tmp_table_size) para limitar o tamanho de internal in-memory tables. Consulte a [Seção 8.4.4, “Uso de Internal Temporary Table no MySQL”](internal-temporary-tables.html "8.4.4 Uso de Internal Temporary Table no MySQL").

  `max_heap_table_size` não é replicada. Consulte a [Seção 16.4.1.20, “Replication e Tabelas MEMORY”](replication-features-memory.html "16.4.1.20 Replication e Tabelas MEMORY") e a [Seção 16.4.1.37, “Replication e Variáveis”](replication-features-variables.html "16.4.1.37 Replication e Variáveis") para mais informações.

* [`max_insert_delayed_threads`](server-system-variables.html#sysvar_max_insert_delayed_threads)

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem logging</td> </tr><tr> <td>1</td> <td>Log apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Log mensagens de nível 1 e mensagens de warning</td> </tr><tr> <td>3</td> <td>Log mensagens de nível 2 e notas de informação</td> </tr><tr> <td>4</td> <td>Log mensagens de nível 3 e mensagens de debug</td> </tr></tbody></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_log_level`. A tradução do texto continua abaixo.)*

  Esta variável é um sinônimo para [`max_delayed_threads`](server-system-variables.html#sysvar_max_delayed_threads).

  Esta variável de sistema está obsoleta (porque inserts `DELAYED` não são suportadas); espere que seja removida em uma futura release.

* [`max_join_size`](server-system-variables.html#sysvar_max_join_size)

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem logging</td> </tr><tr> <td>1</td> <td>Log apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Log mensagens de nível 1 e mensagens de warning</td> </tr><tr> <td>3</td> <td>Log mensagens de nível 2 e notas de informação</td> </tr><tr> <td>4</td> <td>Log mensagens de nível 3 e mensagens de debug</td> </tr></tbody></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_log_level`. A tradução do texto continua abaixo.)*

  Não permite instruções que provavelmente precisam examinar mais de [`max_join_size`](server-system-variables.html#sysvar_max_join_size) linhas (para instruções de table única) ou combinações de linhas (para instruções de múltiplas tables) ou que provavelmente farão mais de [`max_join_size`](server-system-variables.html#sysvar_max_join_size) disk seeks. Ao definir este valor, você pode capturar instruções onde keys não são usadas corretamente e que provavelmente levariam muito tempo. Defina-o se seus usuários tendem a realizar JOINs que não têm uma cláusula `WHERE`, que levam muito tempo ou que retornam milhões de linhas. Para mais informações, consulte [Usando o Modo Safe-Updates (--safe-updates)](mysql-tips.html#safe-updates "Usando o Modo Safe-Updates (--safe-updates)").

  Definir esta variável para um valor diferente de `DEFAULT` redefine o valor de [`sql_big_selects`](server-system-variables.html#sysvar_sql_big_selects) para `0`. Se você definir o valor de [`sql_big_selects`](server-system-variables.html#sysvar_sql_big_selects) novamente, a variável [`max_join_size`](server-system-variables.html#sysvar_max_join_size) será ignorada.

  Se um Query result estiver no Query cache, nenhuma verificação de tamanho de resultado é realizada, pois o resultado foi previamente computado e não sobrecarrega o server enviá-lo ao client.

* [`max_length_for_sort_data`](server-system-variables.html#sysvar_max_length_for_sort_data)

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem logging</td> </tr><tr> <td>1</td> <td>Log apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Log mensagens de nível 1 e mensagens de warning</td> </tr><tr> <td>3</td> <td>Log mensagens de nível 2 e notas de informação</td> </tr><tr> <td>4</td> <td>Log mensagens de nível 3 e mensagens de debug</td> </tr></tbody></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_log_level`. A tradução do texto continua abaixo.)*

  O cutoff no tamanho dos valores de Index que determina qual algoritmo `filesort` usar. Consulte a [Seção 8.2.1.14, “Otimização ORDER BY”](order-by-optimization.html "8.2.1.14 Otimização ORDER BY").

* [`max_points_in_geometry`](server-system-variables.html#sysvar_max_points_in_geometry)

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem logging</td> </tr><tr> <td>1</td> <td>Log apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Log mensagens de nível 1 e mensagens de warning</td> </tr><tr> <td>3</td> <td>Log mensagens de nível 2 e notas de informação</td> </tr><tr> <td>4</td> <td>Log mensagens de nível 3 e mensagens de debug</td> </tr></tbody></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_log_level`. A tradução do texto continua abaixo.)*

  O valor máximo do argumento *`points_per_circle`* para a função [`ST_Buffer_Strategy()`](spatial-operator-functions.html#function_st-buffer-strategy).

* [`max_prepared_stmt_count`](server-system-variables.html#sysvar_max_prepared_stmt_count)

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem logging</td> </tr><tr> <td>1</td> <td>Log apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Log mensagens de nível 1 e mensagens de warning</td> </tr><tr> <td>3</td> <td>Log mensagens de nível 2 e notas de informação</td> </tr><tr> <td>4</td> <td>Log mensagens de nível 3 e mensagens de debug</td> </tr></tbody></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_log_level`. A tradução do texto continua abaixo.)*

  Esta variável limita o número total de prepared statements no server. Ela pode ser usada em ambientes onde existe o potencial de ataques de denial-of-service baseados em esgotar a memória do server preparando um grande número de statements. Se o valor for definido como menor que o número atual de prepared statements, as statements existentes não são afetadas e podem ser usadas, mas nenhuma nova statement pode ser preparada até que o número atual caia abaixo do limite. Definir o valor para 0 desabilita prepared statements.

* [`max_seeks_for_key`](server-system-variables.html#sysvar_max_seeks_for_key)

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem logging</td> </tr><tr> <td>1</td> <td>Log apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Log mensagens de nível 1 e mensagens de warning</td> </tr><tr> <td>3</td> <td>Log mensagens de nível 2 e notas de informação</td> </tr><tr> <td>4</td> <td>Log mensagens de nível 3 e mensagens de debug</td> </tr></tbody></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_log_level`. A tradução do texto continua abaixo.)*

  Limita o número máximo assumido de seeks ao procurar linhas com base em uma key. O optimizer do MySQL assume que não mais do que este número de key seeks é necessário ao procurar linhas correspondentes em uma table por meio da varredura de um Index, independentemente da cardinalidade real do Index (consulte a [Seção 13.7.5.22, “Instrução SHOW INDEX”](show-index.html "13.7.5.22 Instrução SHOW INDEX")). Ao definir isso para um valor baixo (digamos, 100), você pode forçar o MySQL a preferir Indexes em vez de table scans.

* [`max_sort_length`](server-system-variables.html#sysvar_max_sort_length)

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem logging</td> </tr><tr> <td>1</td> <td>Log apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Log mensagens de nível 1 e mensagens de warning</td> </tr><tr> <td>3</td> <td>Log mensagens de nível 2 e notas de informação</td> </tr><tr> <td>4</td> <td>Log mensagens de nível 3 e mensagens de debug</td> </tr></tbody></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_log_level`. A tradução do texto continua abaixo.)*

  O número de bytes a serem usados ao ordenar valores de dados. O server usa apenas os primeiros [`max_sort_length`](server-system-variables.html#sysvar_max_sort_length) bytes de cada valor e ignora o resto. Consequentemente, valores que diferem apenas após os primeiros [`max_sort_length`](server-system-variables.html#sysvar_max_sort_length) bytes são comparados como iguais para operações `GROUP BY`, `ORDER BY` e `DISTINCT`.

  Aumentar o valor de [`max_sort_length`](server-system-variables.html#sysvar_max_sort_length) pode exigir o aumento do valor de [`sort_buffer_size`](server-system-variables.html#sysvar_sort_buffer_size) também. Para detalhes, consulte a [Seção 8.2.1.14, “Otimização ORDER BY”](order-by-optimization.html "8.2.1.14 Otimização ORDER BY").

* [`max_sp_recursion_depth`](server-system-variables.html#sysvar_max_sp_recursion_depth)

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem logging</td> </tr><tr> <td>1</td> <td>Log apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Log mensagens de nível 1 e mensagens de warning</td> </tr><tr> <td>3</td> <td>Log mensagens de nível 2 e notas de informação</td> </tr><tr> <td>4</td> <td>Log mensagens de nível 3 e mensagens de debug</td> </tr></tbody></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_log_level`. A tradução do texto continua abaixo.)*

  O número de vezes que qualquer stored procedure pode ser chamada recursivamente. O valor padrão para esta opção é 0, o que desabilita completamente a recursão em stored procedures. O valor máximo é 255.

  A recursão de stored procedure aumenta a demanda por Thread stack space. Se você aumentar o valor de [`max_sp_recursion_depth`](server-system-variables.html#sysvar_max_sp_recursion_depth), pode ser necessário aumentar o Thread stack size aumentando o valor de [`thread_stack`](server-system-variables.html#sysvar_thread_stack) na inicialização do server.

* [`max_tmp_tables`](server-system-variables.html#sysvar_max_tmp_tables)

  Esta variável não é usada. Está obsoleta e será removida no MySQL 8.0.

* [`max_user_connections`](server-system-variables.html#sysvar_max_user_connections)

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem logging</td> </tr><tr> <td>1</td> <td>Log apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Log mensagens de nível 1 e mensagens de warning</td> </tr><tr> <td>3</td> <td>Log mensagens de nível 2 e notas de informação</td> </tr><tr> <td>4</td> <td>Log mensagens de nível 3 e mensagens de debug</td> </tr></tbody></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_log_level`. A tradução do texto continua abaixo.)*

  O número máximo de conexões simultâneas permitidas para qualquer conta de usuário MySQL. Um valor de 0 (o padrão) significa "sem limite".

  Esta variável tem um valor global que pode ser definido na inicialização do server ou em tempo de execução. Ela também tem um valor de sessão somente leitura que indica o limite efetivo de conexões simultâneas que se aplica à conta associada à sessão atual. O valor da sessão é inicializado da seguinte forma:

  + Se a conta de usuário tiver um limite de recurso `MAX_USER_CONNECTIONS` diferente de zero, o valor de sessão [`max_user_connections`](server-system-variables.html#sysvar_max_user_connections) é definido para esse limite.

  + Caso contrário, o valor de sessão [`max_user_connections`](server-system-variables.html#sysvar_max_user_connections) é definido para o valor global.

  Os limites de recurso de conta são especificados usando a instrução [`CREATE USER`](create-user.html "13.7.1.2 Instrução CREATE USER") ou [`ALTER USER`](alter-user.html "13.7.1.1 Instrução ALTER USER"). Consulte a [Seção 6.2.16, “Definindo Limites de Recursos de Conta”](user-resources.html "6.2.16 Definindo Limites de Recursos de Conta").

* [`max_write_lock_count`](server-system-variables.html#sysvar_max_write_lock_count)

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem logging</td> </tr><tr> <td>1</td> <td>Log apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Log mensagens de nível 1 e mensagens de warning</td> </tr><tr> <td>3</td> <td>Log mensagens de nível 2 e notas de informação</td> </tr><tr> <td>4</td> <td>Log mensagens de nível 3 e mensagens de debug</td> </tr></tbody></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_log_level`. A tradução do texto continua abaixo.)*

  Após este número de write locks, permite que algumas solicitações de read lock pendentes sejam processadas no meio. As solicitações de write lock têm priority mais alta do que as solicitações de read lock. No entanto, se [`max_write_lock_count`](server-system-variables.html#sysvar_max_write_lock_count) for definido para algum valor baixo (digamos, 10), as solicitações de read lock podem ser preferidas em relação às solicitações de write lock pendentes se as solicitações de read lock já tiverem sido preteridas em favor de 10 solicitações de write lock. Normalmente, este comportamento não ocorre porque [`max_write_lock_count`](server-system-variables.html#sysvar_max_write_lock_count) por padrão tem um valor muito grande.

* `mecab_rc_file`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem logging</td> </tr><tr> <td>1</td> <td>Log apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Log mensagens de nível 1 e mensagens de warning</td> </tr><tr> <td>3</td> <td>Log mensagens de nível 2 e notas de informação</td> </tr><tr> <td>4</td> <td>Log mensagens de nível 3 e mensagens de debug</td> </tr></tbody></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_log_level`. A tradução do texto continua abaixo.)*

  A opção `mecab_rc_file` é usada ao configurar o parser full-text MeCab.

  A opção `mecab_rc_file` define o caminho para o arquivo de configuração `mecabrc`, que é o arquivo de configuração para o MeCab. A opção é somente leitura e só pode ser definida na inicialização. O arquivo de configuração `mecabrc` é necessário para inicializar o MeCab.

  Para informações sobre o parser full-text MeCab, consulte a [Seção 12.9.9, “Plugin Parser Full-Text MeCab”](fulltext-search-mecab.html "12.9.9 Plugin Parser Full-Text MeCab").

  Para informações sobre as opções que podem ser especificadas no arquivo de configuração `mecabrc` do MeCab, consulte a [Documentação do MeCab](http://mecab.googlecode.com/svn/trunk/mecab/doc/index.html) no site do [Google Developers](https://code.google.com/).

* [`metadata_locks_cache_size`](server-system-variables.html#sysvar_metadata_locks_cache_size)

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem logging</td> </tr><tr> <td>1</td> <td>Log apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Log mensagens de nível 1 e mensagens de warning</td> </tr><tr> <td>3</td> <td>Log mensagens de nível 2 e notas de informação</td> </tr><tr> <td>4</td> <td>Log mensagens de nível 3 e mensagens de debug</td> </tr></tbody></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_log_level`. A tradução do texto continua abaixo.)*

  O tamanho do cache de metadata locks. O server usa este cache para evitar a criação e destruição de objetos de sincronização. Isso é particularmente útil em sistemas onde tais operações são caras, como o Windows XP.

  No MySQL 5.7.4, as alterações na implementação do metadata locking tornam esta variável desnecessária e, portanto, ela está obsoleta; espere que seja removida em uma futura release do MySQL.

* [`metadata_locks_hash_instances`](server-system-variables.html#sysvar_metadata_locks_hash_instances)

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem logging</td> </tr><tr> <td>1</td> <td>Log apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Log mensagens de nível 1 e mensagens de warning</td> </tr><tr> <td>3</td> <td>Log mensagens de nível 2 e notas de informação</td> </tr><tr> <td>4</td> <td>Log mensagens de nível 3 e mensagens de debug</td> </tr></tbody></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_log_level`. A tradução do texto continua abaixo.)*

  O conjunto de metadata locks pode ser particionado em hashes separados para permitir que conexões que acessam diferentes objetos usem diferentes locking hashes e reduzam a contention. A variável de sistema [`metadata_locks_hash_instances`](server-system-variables.html#sysvar_metadata_locks_hash_instances) especifica o número de hashes (padrão 8).

  No MySQL 5.7.4, as alterações na implementação do metadata locking tornam esta variável desnecessária e, portanto, ela está obsoleta; espere que seja removida em uma futura release do MySQL.

* [`min_examined_row_limit`](server-system-variables.html#sysvar_min_examined_row_limit)

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem logging</td> </tr><tr> <td>1</td> <td>Log apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Log mensagens de nível 1 e mensagens de warning</td> </tr><tr> <td>3</td> <td>Log mensagens de nível 2 e notas de informação</td> </tr><tr> <td>4</td> <td>Log mensagens de nível 3 e mensagens de debug</td> </tr></tbody></table>
  *(Nota do tradutor: esta tabela está incorreta na fonte e repete o conteúdo de `authentication_windows_log_level`. A tradução do texto continua abaixo.)*

  Querys que examinam menos do que este número de linhas não são logadas no slow Query log.

* [`multi_range_count`](server-system-variables.html#sysvar_multi_range_count)

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem logging</td> </tr><tr> <td>1</td> <td>Log apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>