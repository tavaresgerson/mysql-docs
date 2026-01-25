### 4.5.5 mysqlimport — Um Programa de Importação de Dados

O cliente **mysqlimport** fornece uma interface de linha de comando para a instrução SQL `LOAD DATA`. A maioria das opções do **mysqlimport** corresponde diretamente às cláusulas da sintaxe `LOAD DATA`. Consulte a Seção 13.2.6, “Instrução LOAD DATA”.

Invoque o **mysqlimport** desta forma:

```sql
mysqlimport [options] db_name textfile1 [textfile2 ...]
```

Para cada arquivo de texto nomeado na linha de comando, o **mysqlimport** remove qualquer extensão do nome do arquivo e usa o resultado para determinar o nome da table na qual o conteúdo do arquivo será importado. Por exemplo, arquivos nomeados `patient.txt`, `patient.text` e `patient` seriam todos importados para uma table nomeada `patient`.

O **mysqlimport** suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysqlimport]` e `[client]` de um arquivo de opções. Para informações sobre arquivos de opções usados por programas MySQL, consulte a Seção 4.2.2.2, “Usando Arquivos de Opções”.

**Tabela 4.17 Opções do mysqlimport**

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para mysqlimport."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th>Nome da Opção</th> <th>Descrição</th> <th>Introduzida</th> <th>Descontinuada</th> </tr></thead><tbody><tr><th>--bind-address</th> <td>Usar a interface de rede especificada para conectar ao MySQL Server</td> <td></td> <td></td> </tr><tr><th>--character-sets-dir</th> <td>Diretório onde os character sets podem ser encontrados</td> <td></td> <td></td> </tr><tr><th>--columns</th> <td>Esta opção aceita uma lista de nomes de colunas separados por vírgula como seu valor</td> <td></td> <td></td> </tr><tr><th>--compress</th> <td>Comprime todas as informações enviadas entre o client e o server</td> <td></td> <td></td> </tr><tr><th>--debug</th> <td>Escreve o log de debugging</td> <td></td> <td></td> </tr><tr><th>--debug-check</th> <td>Imprime informações de debugging quando o programa é encerrado</td> <td></td> <td></td> </tr><tr><th>--debug-info</th> <td>Imprime informações de debugging, estatísticas de memória e CPU quando o programa é encerrado</td> <td></td> <td></td> </tr><tr><th>--default-auth</th> <td>Plugin de Authentication a ser usado</td> <td></td> <td></td> </tr><tr><th>--default-character-set</th> <td>Especificar o character set padrão</td> <td></td> <td></td> </tr><tr><th>--defaults-extra-file</th> <td>Lê o arquivo de opções nomeado, além dos arquivos de opções usuais</td> <td></td> <td></td> </tr><tr><th>--defaults-file</th> <td>Lê apenas o arquivo de opções nomeado</td> <td></td> <td></td> </tr><tr><th>--defaults-group-suffix</th> <td>Valor do sufixo do grupo de opções</td> <td></td> <td></td> </tr><tr><th>--delete</th> <td>Esvaziar a table antes de importar o arquivo de texto</td> <td></td> <td></td> </tr><tr><th>--enable-cleartext-plugin</th> <td>Habilita o plugin de authentication cleartext</td> <td>5.7.10</td> <td></td> </tr><tr><th>--fields-enclosed-by</th> <td>Esta opção tem o mesmo significado que a cláusula correspondente para LOAD DATA</td> <td></td> <td></td> </tr><tr><th>--fields-escaped-by</th> <td>Esta opção tem o mesmo significado que a cláusula correspondente para LOAD DATA</td> <td></td> <td></td> </tr><tr><th>--fields-optionally-enclosed-by</th> <td>Esta opção tem o mesmo significado que a cláusula correspondente para LOAD DATA</td> <td></td> <td></td> </tr><tr><th>--fields-terminated-by</th> <td>Esta opção tem o mesmo significado que a cláusula correspondente para LOAD DATA</td> <td></td> <td></td> </tr><tr><th>--force</th> <td>Continua mesmo se ocorrer um erro SQL</td> <td></td> <td></td> </tr><tr><th>--get-server-public-key</th> <td>Solicita a public key RSA do server</td> <td>5.7.23</td> <td></td> </tr><tr><th>--help</th> <td>Exibe a mensagem de ajuda e sai</td> <td></td> <td></td> </tr><tr><th>--host</th> <td>Host onde o MySQL server está localizado</td> <td></td> <td></td> </tr><tr><th>--ignore</th> <td>Veja a descrição para a opção --replace</td> <td></td> <td></td> </tr><tr><th>--ignore-lines</th> <td>Ignora as primeiras N linhas do arquivo de dados</td> <td></td> <td></td> </tr><tr><th>--lines-terminated-by</th> <td>Esta opção tem o mesmo significado que a cláusula correspondente para LOAD DATA</td> <td></td> <td></td> </tr><tr><th>--local</th> <td>Lê arquivos de input localmente a partir do host client</td> <td></td> <td></td> </tr><tr><th>--lock-tables</th> <td>Aplica Lock em todas as tables para escrita antes de processar quaisquer arquivos de texto</td> <td></td> <td></td> </tr><tr><th>--login-path</th> <td>Lê as opções de login path de .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th>--low-priority</th> <td>Usa LOW_PRIORITY ao carregar a table</td> <td></td> <td></td> </tr><tr><th>--no-defaults</th> <td>Não lê nenhum arquivo de opções</td> <td></td> <td></td> </tr><tr><th>--password</th> <td>Password a ser usada ao conectar ao server</td> <td></td> <td></td> </tr><tr><th>--pipe</th> <td>Conecta ao server usando named pipe (somente Windows)</td> <td></td> <td></td> </tr><tr><th>--plugin-dir</th> <td>Diretório onde os plugins estão instalados</td> <td></td> <td></td> </tr><tr><th>--port</th> <td>Número da port TCP/IP para conexão</td> <td></td> <td></td> </tr><tr><th>--print-defaults</th> <td>Imprime as opções padrão</td> <td></td> <td></td> </tr><tr><th>--protocol</th> <td>Protocolo de transporte a ser usado</td> <td></td> <td></td> </tr><tr><th>--replace</th> <td>As opções --replace e --ignore controlam o tratamento de linhas de input que duplicam linhas existentes com base em valores de Primary Key únicas</td> <td></td> <td></td> </tr><tr><th>--secure-auth</th> <td>Não envia passwords para o server no formato antigo (pré-4.1)</td> <td></td> <td>Sim</td> </tr><tr><th>--server-public-key-path</th> <td>Nome do Path para o arquivo contendo a public key RSA</td> <td>5.7.23</td> <td></td> </tr><tr><th>--shared-memory-base-name</th> <td>Nome da shared-memory para conexões de shared-memory (somente Windows)</td> <td></td> <td></td> </tr><tr><th>--silent</th> <td>Produz output apenas quando ocorrem erros</td> <td></td> <td></td> </tr><tr><th>--socket</th> <td>Arquivo Unix socket ou named pipe do Windows a ser usado</td> <td></td> <td></td> </tr><tr><th>--ssl</th> <td>Habilita a encryption da conexão</td> <td></td> <td></td> </tr><tr><th>--ssl-ca</th> <td>Arquivo que contém a lista de Certificate Authorities SSL confiáveis</td> <td></td> <td></td> </tr><tr><th>--ssl-capath</th> <td>Diretório que contém os arquivos de certificado da Certificate Authority SSL confiável</td> <td></td> <td></td> </tr><tr><th>--ssl-cert</th> <td>Arquivo que contém o certificado X.509</td> <td></td> <td></td> </tr><tr><th>--ssl-cipher</th> <td>Ciphers permitidos para a encryption da conexão</td> <td></td> <td></td> </tr><tr><th>--ssl-crl</th> <td>Arquivo que contém as listas de revogação de certificado</td> <td></td> <td></td> </tr><tr><th>--ssl-crlpath</th> <td>Diretório que contém os arquivos de lista de revogação de certificado</td> <td></td> <td></td> </tr><tr><th>--ssl-key</th> <td>Arquivo que contém a key X.509</td> <td></td> <td></td> </tr><tr><th>--ssl-mode</th> <td>Estado de segurança desejado da conexão com o server</td> <td>5.7.11</td> <td></td> </tr><tr><th>--ssl-verify-server-cert</th> <td>Verifica o nome do host em relação à identidade Common Name do certificado do server</td> <td></td> <td></td> </tr><tr><th>--tls-version</th> <td>Protocolos TLS permitidos para conexões encriptadas</td> <td>5.7.10</td> <td></td> </tr><tr><th>--use-threads</th> <td>Número de threads para carregamento paralelo de arquivos</td> <td></td> <td></td> </tr><tr><th>--user</th> <td>Nome do user MySQL a ser usado ao conectar ao server</td> <td></td> <td></td> </tr><tr><th>--verbose</th> <td>Modo verbose</td> <td></td> <td></td> </tr><tr><th>--version</th> <td>Exibe informações de versão e sai</td> <td></td> <td></td> </tr></tbody></table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Exibe uma mensagem de ajuda e sai.

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Em um computador com múltiplas interfaces de rede, use esta opção para selecionar qual interface usar para conectar ao MySQL server.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  O diretório onde os character sets estão instalados. Consulte a Seção 10.15, “Configuração de Character Set”.

* `--columns=column_list`, `-c column_list`

  <table frame="box" rules="all" summary="Propriedades para columns"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>

  Esta opção aceita uma lista de nomes de colunas separados por vírgula como seu valor. A ordem dos nomes das colunas indica como combinar as colunas do arquivo de dados com as colunas da table.

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Propriedades para compress"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Comprime todas as informações enviadas entre o client e o server, se possível. Consulte a Seção 4.2.6, “Controle de Compression de Conexão”.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Propriedades para debug"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--debug[=debug_options]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>d:t:o</code></td> </tr></tbody></table>

  Escreve um log de debugging. Uma string *`debug_options`* típica é `d:t:o,file_name`. O padrão é `d:t:o`.

  Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando esta opção.

* `--debug-check`

  <table frame="box" rules="all" summary="Propriedades para debug-check"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--debug-check</code></td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Imprime algumas informações de debugging quando o programa é encerrado.

  Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando esta opção.

* `--debug-info`

  <table frame="box" rules="all" summary="Propriedades para debug-info"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--debug-info</code></td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Imprime informações de debugging e estatísticas de uso de memória e CPU quando o programa é encerrado.

  Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando esta opção.

* `--default-character-set=charset_name`

  <table frame="box" rules="all" summary="Propriedades para default-character-set"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--default-character-set=charset_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Usa *`charset_name`* como o character set padrão. Consulte a Seção 10.15, “Configuração de Character Set”.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Uma dica sobre qual plugin de authentication no lado do client usar. Consulte a Seção 6.2.13, “Pluggable Authentication”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Lê este arquivo de opções após o arquivo de opções global, mas (no Unix) antes do arquivo de opções do user. Se o arquivo não existir ou estiver inacessível, ocorrerá um erro. Se *`file_name`* não for um nome de Path absoluto, ele será interpretado em relação ao diretório atual.

  Para informações adicionais sobre esta e outras opções de arquivos de opções, consulte a Seção 4.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opções”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Usa apenas o arquivo de opções fornecido. Se o arquivo não existir ou estiver inacessível, ocorrerá um erro. Se *`file_name`* não for um nome de Path absoluto, ele será interpretado em relação ao diretório atual.

  Exceção: Mesmo com `--defaults-file`, os programas client leem `.mylogin.cnf`.

  Para informações adicionais sobre esta e outras opções de arquivos de opções, consulte a Seção 4.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opções”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Lê não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, o **mysqlimport** normalmente lê os grupos `[client]` e `[mysqlimport]`. Se esta opção for fornecida como `--defaults-group-suffix=_other`, o **mysqlimport** também lê os grupos `[client_other]` e `[mysqlimport_other]`.

  Para informações adicionais sobre esta e outras opções de arquivos de opções, consulte a Seção 4.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opções”.

* `--delete`, `-D`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Esvazia a table antes de importar o arquivo de texto.

* `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Habilita o plugin de authentication cleartext `mysql_clear_password`. (Consulte a Seção 6.4.1.6, “Client-Side Cleartext Pluggable Authentication”.)

  Esta opção foi adicionada no MySQL 5.7.10.

* `--fields-terminated-by=...`, `--fields-enclosed-by=...`, `--fields-optionally-enclosed-by=...`, `--fields-escaped-by=...`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Estas opções têm o mesmo significado que as cláusulas correspondentes para `LOAD DATA`. Consulte a Seção 13.2.6, “Instrução LOAD DATA”.

* `--force`, `-f`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Ignora erros. Por exemplo, se uma table para um arquivo de texto não existir, continua processando quaisquer arquivos restantes. Sem `--force`, o **mysqlimport** é encerrado se uma table não existir.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Solicita ao server a public key necessária para a troca de password baseada no par de keys RSA. Esta opção se aplica a clients que se autenticam com o plugin de authentication `caching_sha2_password`. Para esse plugin, o server não envia a public key, a menos que seja solicitada. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de password baseada em RSA não for usada, como é o caso quando o client se conecta ao server usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de public key válido, ele terá precedência sobre `--get-server-public-key`.

  Para informações sobre o plugin `caching_sha2_password`, consulte a Seção 6.4.1.4, “Caching SHA-2 Pluggable Authentication”.

  A opção `--get-server-public-key` foi adicionada no MySQL 5.7.23.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Importa dados para o MySQL server no host fornecido. O host padrão é `localhost`.

* `--ignore`, `-i`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Consulte a descrição para a opção `--replace`.

* `--ignore-lines=N`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Ignora as primeiras *`N`* linhas do arquivo de dados.

* `--lines-terminated-by=...`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Esta opção tem o mesmo significado que a cláusula correspondente para `LOAD DATA`. Por exemplo, para importar arquivos do Windows que têm linhas terminadas com pares de carriage return/linefeed, use `--lines-terminated-by="\r\n"`. (Você pode precisar duplicar as barras invertidas, dependendo das convenções de escaping do seu interpretador de comando.) Consulte a Seção 13.2.6, “Instrução LOAD DATA”.

* `--local`, `-L`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Por padrão, os arquivos são lidos pelo server no host do server. Com esta opção, o **mysqlimport** lê os arquivos de input localmente no host client.

  O uso bem-sucedido de operações de load `LOCAL` dentro do **mysqlimport** também exige que o server permita o carregamento local; consulte a Seção 6.1.6, “Considerações de Segurança para LOAD DATA LOCAL”.

* `--lock-tables`, `-l`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Aplica Lock em *todas* as tables para escrita antes de processar quaisquer arquivos de texto. Isso garante que todas as tables estejam sincronizadas no server.

* `--login-path=name`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Lê opções do login path nomeado no arquivo de login path `.mylogin.cnf`. Um “login path” é um grupo de opções contendo opções que especificam a qual MySQL server conectar e com qual conta autenticar. Para criar ou modificar um arquivo de login path, use a utilidade **mysql_config_editor**. Consulte a Seção 4.6.6, “mysql_config_editor — Utilitário de Configuração do MySQL”.

  Para informações adicionais sobre esta e outras opções de arquivos de opções, consulte a Seção 4.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opções”.

* `--low-priority`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Usa `LOW_PRIORITY` ao carregar a table. Isso afeta apenas storage engines que usam apenas Lock de nível de table (como `MyISAM`, `MEMORY` e `MERGE`).

* `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Não lê nenhum arquivo de opções. Se a inicialização do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para evitar que elas sejam lidas.

  A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que passwords sejam especificadas de uma forma mais segura do que na linha de comando, mesmo quando `--no-defaults` é usado. Para criar `.mylogin.cnf`, use a utilidade **mysql_config_editor**. Consulte a Seção 4.6.6, “mysql_config_editor — Utilitário de Configuração do MySQL”.

  Para informações adicionais sobre esta e outras opções de arquivos de opções, consulte a Seção 4.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opções”.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  A password da conta MySQL usada para conectar ao server. O valor da password é opcional. Se não for fornecido, o **mysqlimport** solicita uma. Se fornecido, não deve haver *espaço* entre `--password=` ou `-p` e a password subsequente. Se nenhuma opção de password for especificada, o padrão é não enviar password.

  Especificar uma password na linha de comando deve ser considerado inseguro. Para evitar fornecer a password na linha de comando, use um arquivo de opções. Consulte a Seção 6.1.2.1, “Diretrizes para Usuários Finais sobre Segurança de Password”.

  Para especificar explicitamente que não há password e que o **mysqlimport** não deve solicitar uma, use a opção `--skip-password`.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  No Windows, conecta ao server usando um named pipe. Esta opção se aplica apenas se o server foi iniciado com a system variable `named_pipe` habilitada para suportar conexões named-pipe. Além disso, o user que faz a conexão deve ser membro do grupo do Windows especificado pela system variable `named_pipe_full_access_group`.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  O diretório no qual procurar por plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de authentication, mas o **mysqlimport** não o encontrar. Consulte a Seção 6.2.13, “Pluggable Authentication”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Para conexões TCP/IP, o número da port a ser usado.

* `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Imprime o nome do programa e todas as opções que ele obtém dos arquivos de opções.

  Para informações adicionais sobre esta e outras opções de arquivos de opções, consulte a Seção 4.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opções”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  O protocolo de transporte a ser usado para conectar ao server. É útil quando os outros parâmetros de conexão normalmente resultam no uso de um protocolo diferente do desejado. Para detalhes sobre os valores permitidos, consulte a Seção 4.2.5, “Protocolos de Transporte de Conexão”.

* `--replace`, `-r`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  As opções `--replace` e `--ignore` controlam o tratamento de linhas de input que duplicam linhas existentes com base em valores de Primary Key únicas. Se você especificar `--replace`, novas linhas substituem as linhas existentes que têm o mesmo valor de Primary Key única. Se você especificar `--ignore`, as linhas de input que duplicam uma linha existente com base em um valor de Primary Key única são ignoradas. Se você não especificar nenhuma das opções, ocorrerá um erro quando um valor de key duplicado for encontrado, e o restante do arquivo de texto será ignorado.

* `--secure-auth`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Não envia passwords para o server no formato antigo (pré-4.1). Isso impede conexões, exceto para servers que usam o formato de password mais recente.

  A partir do MySQL 5.7.5, esta opção está descontinuada; espere que ela seja removida em um futuro lançamento do MySQL. Ela está sempre habilitada e a tentativa de desabilitá-la (`--skip-secure-auth`, `--secure-auth=0`) produz um erro. Antes do MySQL 5.7.5, esta opção é habilitada por padrão, mas pode ser desabilitada.

  Note

  Passwords que usam o método de hashing pré-4.1 são menos seguras do que passwords que usam o método de hashing de password nativo e devem ser evitadas. Passwords pré-4.1 estão descontinuadas e o suporte a elas foi removido no MySQL 5.7.5. Para instruções de atualização de conta, consulte a Seção 6.4.1.3, “Migrando do Hashing de Password Pré-4.1 e do Plugin mysql_old_password”.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  O nome do Path para um arquivo no formato PEM contendo uma cópia do lado do client da public key exigida pelo server para a troca de password baseada em par de keys RSA. Esta opção se aplica a clients que se autenticam com o plugin de authentication `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de password baseada em RSA não for usada, como é o caso quando o client se conecta ao server usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de public key válido, ele terá precedência sobre `--get-server-public-key`.

  Para `sha256_password`, esta opção se aplica apenas se o MySQL foi construído usando OpenSSL.

  Para informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 6.4.1.5, “SHA-256 Pluggable Authentication”, e a Seção 6.4.1.4, “Caching SHA-2 Pluggable Authentication”.

  A opção `--server-public-key-path` foi adicionada no MySQL 5.7.23.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Propriedades para columns"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>

  No Windows, o nome da shared-memory a ser usado para conexões feitas usando shared memory para um server local. O valor padrão é `MYSQL`. O nome da shared-memory é case-sensitive.

  Esta opção se aplica apenas se o server foi iniciado com a system variable `shared_memory` habilitada para suportar conexões shared-memory.

* `--silent`, `-s`

  <table frame="box" rules="all" summary="Propriedades para columns"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>

  Modo silent. Produz output apenas quando ocorrem erros.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Propriedades para columns"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>

  Para conexões a `localhost`, o arquivo Unix socket a ser usado ou, no Windows, o nome do named pipe a ser usado.

  No Windows, esta opção se aplica apenas se o server foi iniciado com a system variable `named_pipe` habilitada para suportar conexões named-pipe. Além disso, o user que faz a conexão deve ser membro do grupo do Windows especificado pela system variable `named_pipe_full_access_group`.

* `--ssl*`

  Opções que começam com `--ssl` especificam se deve conectar ao server usando encryption e indicam onde encontrar keys e certificados SSL. Consulte Opções de Comando para Conexões Encriptadas.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Propriedades para columns"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>

  Os protocolos TLS permitidos para conexões encriptadas. O valor é uma lista de um ou mais nomes de protocolo separados por vírgulas. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 6.3.2, “Protocolos TLS e Ciphers de Conexão Encriptada”.

  Esta opção foi adicionada no MySQL 5.7.10.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Propriedades para columns"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>

  O nome do user MySQL a ser usado para conectar ao server.

* `--use-threads=N`

  <table frame="box" rules="all" summary="Propriedades para columns"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>

  Carrega arquivos em paralelo usando *`N`* threads.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Propriedades para columns"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>

  Modo verbose. Imprime mais informações sobre o que o programa faz.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Propriedades para columns"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>

  Exibe informações de versão e sai.

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
