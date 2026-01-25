### 4.5.7 mysqlshow — Exibir Informações de Database, Table e Column

O cliente **mysqlshow** pode ser usado para ver rapidamente quais Databases existem, suas Tables, ou as Columns ou Indexes de uma Table.

O **mysqlshow** fornece uma interface de linha de comando para várias instruções SQL `SHOW`. Consulte a Seção 13.7.5, “Instruções SHOW”. A mesma informação pode ser obtida usando essas instruções diretamente. Por exemplo, você pode emiti-las a partir do programa cliente **mysql**.

Invoque **mysqlshow** desta forma:

```sql
mysqlshow [options] [db_name [tbl_name [col_name]
```

* Se nenhum Database for fornecido, uma lista de nomes de Databases é exibida.
* Se nenhuma Table for fornecida, todas as Tables correspondentes no Database são exibidas.

* Se nenhuma Column for fornecida, todas as Columns e tipos de Column correspondentes na Table são exibidas.

A saída exibe apenas os nomes daqueles Databases, Tables ou Columns para os quais você possui privilégios.

Se o último argumento contiver caracteres curinga (wildcard) de shell ou SQL (`*`, `?`, `%`, ou `_`), apenas os nomes que correspondem ao curinga são exibidos. Se um nome de Database contiver sublinhados (underscores), eles devem ser escapados com uma barra invertida (alguns shells Unix exigem duas) para obter uma lista das Tables ou Columns apropriadas. Os caracteres `*` e `?` são convertidos nos caracteres curinga SQL `%` e `_`. Isso pode causar alguma confusão ao tentar exibir as Columns de uma Table com um `_` no nome, porque, neste caso, o **mysqlshow** mostra apenas os nomes das Tables que correspondem ao padrão. Isso é facilmente resolvido adicionando um `%` extra por último na linha de comando como um argumento separado.

O **mysqlshow** suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysqlshow]` e `[client]` de um arquivo de opções. Para informações sobre arquivos de opções usados por programas MySQL, consulte a Seção 4.2.2.2, “Usando Arquivos de Opções”.

**Tabela 4.19 Opções do mysqlshow**

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para mysqlshow."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th>Nome da Opção</th> <th>Descrição</th> <th>Introduzido</th> <th>Obsoleto</th> </tr></thead><tbody><tr><th>--bind-address</th> <td>Usar a interface de rede especificada para conectar-se ao MySQL Server</td> <td></td> <td></td> </tr><tr><th>--character-sets-dir</th> <td>Diretório onde os character sets podem ser encontrados</td> <td></td> <td></td> </tr><tr><th>--compress</th> <td>Compactar todas as informações enviadas entre o client e o server</td> <td></td> <td></td> </tr><tr><th>--count</th> <td>Exibir o número de rows por Table</td> <td></td> <td></td> </tr><tr><th>--debug</th> <td>Escrever log de debugging</td> <td></td> <td></td> </tr><tr><th>--debug-check</th> <td>Imprimir informação de debugging quando o programa é encerrado</td> <td></td> <td></td> </tr><tr><th>--debug-info</th> <td>Imprimir informação de debugging, estatísticas de memória e CPU quando o programa é encerrado</td> <td></td> <td></td> </tr><tr><th>--default-auth</th> <td>Plugin de autenticação a ser usado</td> <td></td> <td></td> </tr><tr><th>--default-character-set</th> <td>Especificar character set padrão</td> <td></td> <td></td> </tr><tr><th>--defaults-extra-file</th> <td>Ler arquivo de opções nomeado além dos arquivos de opções usuais</td> <td></td> <td></td> </tr><tr><th>--defaults-file</th> <td>Ler apenas o arquivo de opções nomeado</td> <td></td> <td></td> </tr><tr><th>--defaults-group-suffix</th> <td>Valor do sufixo do grupo de opções</td> <td></td> <td></td> </tr><tr><th>--enable-cleartext-plugin</th> <td>Habilitar plugin de autenticação cleartext</td> <td>5.7.10</td> <td></td> </tr><tr><th>--get-server-public-key</th> <td>Solicitar chave pública RSA do server</td> <td>5.7.23</td> <td></td> </tr><tr><th>--help</th> <td>Exibir mensagem de ajuda e sair</td> <td></td> <td></td> </tr><tr><th>--host</th> <td>Host onde o MySQL Server está localizado</td> <td></td> <td></td> </tr><tr><th>--keys</th> <td>Exibir Indexes da Table</td> <td></td> <td></td> </tr><tr><th>--login-path</th> <td>Ler opções de login path de .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th>--no-defaults</th> <td>Não ler arquivos de opções</td> <td></td> <td></td> </tr><tr><th>--password</th> <td>Password a ser usado ao conectar-se ao server</td> <td></td> <td></td> </tr><tr><th>--pipe</th> <td>Conectar ao server usando named pipe (somente Windows)</td> <td></td> <td></td> </tr><tr><th>--plugin-dir</th> <td>Diretório onde os plugins estão instalados</td> <td></td> <td></td> </tr><tr><th>--port</th> <td>Número da porta TCP/IP para conexão</td> <td></td> <td></td> </tr><tr><th>--print-defaults</th> <td>Imprimir opções padrão</td> <td></td> <td></td> </tr><tr><th>--protocol</th> <td>Protocolo de transporte a ser usado</td> <td></td> <td></td> </tr><tr><th>--secure-auth</th> <td>Não enviar passwords ao server em formato antigo (pré-4.1)</td> <td></td> <td>Sim</td> </tr><tr><th>--server-public-key-path</th> <td>Nome do caminho para o arquivo contendo a chave pública RSA</td> <td>5.7.23</td> <td></td> </tr><tr><th>--shared-memory-base-name</th> <td>Nome da shared-memory para conexões de shared-memory (somente Windows)</td> <td></td> <td></td> </tr><tr><th>--show-table-type</th> <td>Exibir uma Column indicando o tipo de Table</td> <td></td> <td></td> </tr><tr><th>--socket</th> <td>Arquivo de socket Unix ou named pipe Windows a ser usado</td> <td></td> <td></td> </tr><tr><th>--ssl</th> <td>Habilitar criptografia de conexão</td> <td></td> <td></td> </tr><tr><th>--ssl-ca</th> <td>Arquivo que contém a lista de Autoridades Certificadoras SSL confiáveis</td> <td></td> <td></td> </tr><tr><th>--ssl-capath</th> <td>Diretório que contém arquivos de certificado de Autoridade Certificadora SSL confiáveis</td> <td></td> <td></td> </tr><tr><th>--ssl-cert</th> <td>Arquivo que contém certificado X.509</td> <td></td> <td></td> </tr><tr><th>--ssl-cipher</th> <td>Ciphers permitidos para criptografia de conexão</td> <td></td> <td></td> </tr><tr><th>--ssl-crl</th> <td>Arquivo que contém listas de revogação de certificado</td> <td></td> <td></td> </tr><tr><th>--ssl-crlpath</th> <td>Diretório que contém arquivos de lista de revogação de certificado</td> <td></td> <td></td> </tr><tr><th>--ssl-key</th> <td>Arquivo que contém chave X.509</td> <td></td> <td></td> </tr><tr><th>--ssl-mode</th> <td>Estado de segurança desejado da conexão com o server</td> <td>5.7.11</td> <td></td> </tr><tr><th>--ssl-verify-server-cert</th> <td>Verificar nome do host contra a identidade Common Name do certificado do server</td> <td></td> <td></td> </tr><tr><th>--status</th> <td>Exibir informação extra sobre cada Table</td> <td></td> <td></td> </tr><tr><th>--tls-version</th> <td>Protocolos TLS permitidos para conexões criptografadas</td> <td>5.7.10</td> <td></td> </tr><tr><th>--user</th> <td>Nome do user MySQL a ser usado ao conectar-se ao server</td> <td></td> <td></td> </tr><tr><th>--verbose</th> <td>Modo Verbose</td> <td></td> <td></td> </tr><tr><th>--version</th> <td>Exibir informação de versão e sair</td> <td></td> <td></td> </tr></tbody></table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Exibe uma mensagem de ajuda e sai.

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Em um computador com múltiplas interfaces de rede, use esta opção para selecionar qual interface usar para conectar-se ao MySQL server.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  O diretório onde os character sets estão instalados. Consulte a Seção 10.15, “Configuração de Character Set”.

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Propriedades para compress"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Compacta todas as informações enviadas entre o client e o server, se possível. Consulte a Seção 4.2.6, “Controle de Compressão de Conexão”.

* `--count`

  <table frame="box" rules="all" summary="Propriedades para count"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--count</code></td> </tr></tbody></table>

  Exibe o número de rows por Table. Isso pode ser lento para Tables que não sejam `MyISAM`.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Propriedades para debug"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--debug[=debug_options]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>d:t:o</code></td> </tr></tbody></table>

  Escreve um log de debugging. Uma string *`debug_options`* típica é `d:t:o,file_name`. O padrão é `d:t:o`.

  Esta opção está disponível apenas se o MySQL foi compilado usando `WITH_DEBUG`. Os binários de release do MySQL fornecidos pela Oracle *não* são compilados usando esta opção.

* `--debug-check`

  <table frame="box" rules="all" summary="Propriedades para debug-check"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--debug-check</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Imprime algumas informações de debugging quando o programa é encerrado.

  Esta opção está disponível apenas se o MySQL foi compilado usando `WITH_DEBUG`. Os binários de release do MySQL fornecidos pela Oracle *não* são compilados usando esta opção.

* `--debug-info`

  <table frame="box" rules="all" summary="Propriedades para debug-info"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--debug-info</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Imprime informações de debugging e estatísticas de uso de memória e CPU quando o programa é encerrado.

  Esta opção está disponível apenas se o MySQL foi compilado usando `WITH_DEBUG`. Os binários de release do MySQL fornecidos pela Oracle *não* são compilados usando esta opção.

* `--default-character-set=charset_name`

  <table frame="box" rules="all" summary="Propriedades para default-character-set"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--default-character-set=charset_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Usa *`charset_name`* como o character set padrão. Consulte a Seção 10.15, “Configuração de Character Set”.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Uma dica sobre qual plugin de autenticação do lado do client deve ser usado. Consulte a Seção 6.2.13, “Autenticação Plugável”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Lê este arquivo de opções após o arquivo de opções global, mas (no Unix) antes do arquivo de opções do user. Se o arquivo não existir ou for inacessível, ocorre um erro. Se *`file_name`* não for um nome de caminho absoluto, ele é interpretado em relação ao diretório atual.

  Para informações adicionais sobre esta e outras opções de arquivos de opções, consulte a Seção 4.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opções”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Usa apenas o arquivo de opções fornecido. Se o arquivo não existir ou for inacessível, ocorre um erro. Se *`file_name`* não for um nome de caminho absoluto, ele é interpretado em relação ao diretório atual.

  Exceção: Mesmo com `--defaults-file`, os programas cliente leem `.mylogin.cnf`.

  Para informações adicionais sobre esta e outras opções de arquivos de opções, consulte a Seção 4.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opções”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Lê não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo *`str`*. Por exemplo, **mysqlshow** normalmente lê os grupos `[client]` e `[mysqlshow]`. Se esta opção for fornecida como `--defaults-group-suffix=_other`, **mysqlshow** também lê os grupos `[client_other]` e `[mysqlshow_other]`.

  Para informações adicionais sobre esta e outras opções de arquivos de opções, consulte a Seção 4.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opções”.

* `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Habilita o plugin de autenticação cleartext `mysql_clear_password`. (Consulte a Seção 6.4.1.6, “Autenticação Plugável Cleartext do Lado do Client”.)

  Esta opção foi adicionada no MySQL 5.7.10.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Solicita ao server a chave pública RSA que ele usa para a troca de password baseada em par de chaves. Esta opção se aplica a clients que se conectam ao server usando uma conta que se autentica com o plugin de autenticação `caching_sha2_password`. Para conexões feitas por tais contas, o server não envia a chave pública para o client, a menos que solicitado. A opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de password baseada em RSA não for necessária, como é o caso quando o client se conecta ao server usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

  Para informações sobre o plugin `caching_sha2_password`, consulte a Seção 6.4.1.4, “Autenticação Plugável Caching SHA-2”.

  A opção `--get-server-public-key` foi adicionada no MySQL 5.7.23.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Conecta-se ao MySQL server no host fornecido.

* `--keys`, `-k`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Exibe os Indexes da Table.

* `--login-path=name`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Lê opções do login path nomeado no arquivo de login path `.mylogin.cnf`. Um “login path” é um grupo de opções que contém opções que especificam a qual MySQL server conectar e como qual conta autenticar. Para criar ou modificar um arquivo de login path, use o utilitário **mysql_config_editor**. Consulte a Seção 4.6.6, “mysql_config_editor — Utilitário de Configuração MySQL”.

  Para informações adicionais sobre esta e outras opções de arquivos de opções, consulte a Seção 4.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opções”.

* `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Não lê nenhum arquivo de opções. Se a inicialização do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para impedir que elas sejam lidas.

  A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que os passwords sejam especificados de forma mais segura do que na linha de comando, mesmo quando `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql_config_editor**. Consulte a Seção 4.6.6, “mysql_config_editor — Utilitário de Configuração MySQL”.

  Para informações adicionais sobre esta e outras opções de arquivos de opções, consulte a Seção 4.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opções”.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  O password da conta MySQL usada para conectar-se ao server. O valor do password é opcional. Se não for fornecido, **mysqlshow** solicitará um. Se fornecido, não deve haver *espaço* entre `--password=` ou `-p` e o password que o segue. Se nenhuma opção de password for especificada, o padrão é não enviar password.

  Especificar um password na linha de comando deve ser considerado inseguro. Para evitar fornecer o password na linha de comando, use um arquivo de opções. Consulte a Seção 6.1.2.1, “Diretrizes do Usuário Final para Segurança de Password”.

  Para especificar explicitamente que não há password e que **mysqlshow** não deve solicitá-lo, use a opção `--skip-password`.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  No Windows, conecta-se ao server usando um named pipe. Esta opção se aplica apenas se o server foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de named pipe. Além disso, o user que faz a conexão deve ser membro do grupo Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  O diretório no qual procurar por plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o **mysqlshow** não o encontrar. Consulte a Seção 6.2.13, “Autenticação Plugável”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Para conexões TCP/IP, o número da porta a ser usado.

* `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Imprime o nome do programa e todas as opções que ele obtém dos arquivos de opções.

  Para informações adicionais sobre esta e outras opções de arquivos de opções, consulte a Seção 4.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opções”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  O Protocolo de transporte a ser usado para conectar-se ao server. É útil quando os outros parâmetros de conexão normalmente resultam no uso de um Protocolo diferente do desejado. Para detalhes sobre os valores permitidos, consulte a Seção 4.2.5, “Protocolos de Transporte de Conexão”.

* `--secure-auth`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Não envia passwords ao server no formato antigo (pré-4.1). Isso impede conexões, exceto para servers que usam o formato de password mais recente.

  A partir do MySQL 5.7.5, esta opção está obsoleta (deprecated); espera-se que seja removida em um release futuro do MySQL. Ela está sempre habilitada e tentar desabilitá-la (`--skip-secure-auth`, `--secure-auth=0`) produz um erro. Antes do MySQL 5.7.5, esta opção era habilitada por padrão, mas podia ser desabilitada.

  Nota

  Passwords que usam o método de hashing pré-4.1 são menos seguras do que passwords que usam o método de hashing de password nativo e devem ser evitados. Passwords pré-4.1 estão obsoletos e o suporte a eles foi removido no MySQL 5.7.5. Para instruções de upgrade de conta, consulte a Seção 6.4.1.3, “Migrando de Hashing de Password Pré-4.1 e o Plugin mysql_old_password”.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  O nome do caminho para um arquivo em formato PEM contendo uma cópia do lado do client da chave pública exigida pelo server para troca de password baseada em par de chaves RSA. Esta opção se aplica a clients que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de password baseada em RSA não for usada, como é o caso quando o client se conecta ao server usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

  Para `sha256_password`, esta opção se aplica apenas se o MySQL foi compilado usando OpenSSL.

  Para informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 6.4.1.5, “Autenticação Plugável SHA-256”, e a Seção 6.4.1.4, “Autenticação Plugável Caching SHA-2”.

  A opção `--server-public-key-path` foi adicionada no MySQL 5.7.23.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  No Windows, o nome da shared-memory a ser usado para conexões feitas usando shared memory a um server local. O valor padrão é `MYSQL`. O nome da shared-memory é case-sensitive.

  Esta opção se aplica apenas se o server foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de shared-memory.

* `--show-table-type`, `-t`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Exibe uma Column indicando o tipo de Table, como em `SHOW FULL TABLES`. O tipo é `BASE TABLE` ou `VIEW`.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  Para conexões com `localhost`, o arquivo Unix socket a ser usado ou, no Windows, o nome do named pipe a ser usado.

  No Windows, esta opção se aplica apenas se o server foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de named pipe. Além disso, o user que faz a conexão deve ser membro do grupo Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--ssl*`

  Opções que começam com `--ssl` especificam se a conexão com o server deve usar criptografia e indicam onde encontrar chaves e certificados SSL. Consulte Opções de Comando para Conexões Criptografadas.

* `--status`, `-i`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  Exibe informação extra sobre cada Table.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolos separados por vírgulas. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 6.3.2, “Protocolos e Ciphers TLS para Conexão Criptografada”.

  Esta opção foi adicionada no MySQL 5.7.10.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  O nome do user da conta MySQL a ser usada para conectar-se ao server.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  Modo Verbose. Imprime mais informações sobre o que o programa faz. Esta opção pode ser usada múltiplas vezes para aumentar a quantidade de informação.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  Exibe informação de versão e sai.