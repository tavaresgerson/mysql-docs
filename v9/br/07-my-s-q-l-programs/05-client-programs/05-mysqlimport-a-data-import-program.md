### 6.5.5 mysqlimport — Um Programa de Importação de Dados

O cliente **mysqlimport** fornece uma interface de linha de comando para a instrução SQL `LOAD DATA`. A maioria das opções do **mysqlimport** corresponde diretamente a cláusulas da sintaxe `LOAD DATA`. Consulte a Seção 15.2.9, “Instrução LOAD DATA”.

Invoque **mysqlimport** da seguinte forma:

```
mysqlimport [options] db_name textfile1 [textfile2 ...]
```

Para cada arquivo de texto nomeado na linha de comando, o **mysqlimport** remove qualquer extensão do nome do arquivo e usa o resultado para determinar o nome da tabela na qual o conteúdo do arquivo será importado. Por exemplo, os arquivos com os nomes `patient.txt`, `patient.text` e `patient` seriam todos importados em uma tabela chamada `patient`.

O **mysqlimport** suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysqlimport]` e `[client]` de um arquivo de opções. Para obter informações sobre os arquivos de opções usados pelos programas MySQL, consulte a Seção 6.2.2.2, “Usando Arquivos de Opções”.

**Tabela 6.14 Opções do mysqlimport**

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para mysqlimport.">
<tr><th>Nome da opção</th><th>Descrição</th></tr>
<tr><td><a class="link" href="mysqlimport.html#option_mysqlimport_bind-address">--bind-address</a></td><td>Use a interface de rede especificada para se conectar ao servidor MySQL</td></tr>
<tr><td><a class="link" href="mysqlimport.html#option_mysqlimport_character-sets-dir">--character-sets-dir</a></td><td>Diretório onde os conjuntos de caracteres podem ser encontrados</td></tr>
<tr><td><a class="link" href="mysqlimport.html#option_mysqlimport_columns">--columns</a></td><td>Esta opção recebe uma lista de nomes de colunas separada por vírgula como seu valor</td></tr>
<tr><td><a class="link" href="mysqlimport.html#option_mysqlimport_compress">--compress</a></td><td>Compressar todas as informações enviadas entre o cliente e o servidor</td></tr>
<tr><td><a class="link" href="mysqlimport.html#option_mysqlimport_compression-algorithms">--compression-algorithms</a></td><td>Algoritmos de compressão permitidos para conexões com o servidor</td></tr>
<tr><td><a class="link" href="mysqlimport.html#option_mysqlimport_debug">--debug</a></td><td>Escrever o log de depuração</td></tr>
<tr><td><a class="link" href="mysqlimport.html#option_mysqlimport_debug-check">--debug-check</a></td><td>Imprimir informações de depuração quando o programa sai</td></tr>
<tr><td><a class="link" href="mysqlimport.html#option_mysqlimport_debug-info">--debug-info</a></td><td>Imprimir informações de depuração, estatísticas de memória e CPU quando o programa sai</td></tr>
<tr><td><a class="link" href="mysqlimport.html#option_mysqlimport_default-character-set">--default-character-set</a></td><td>Especificar o conjunto de caracteres padrão</td></tr>
<tr><td><a class="link" href="mysqlimport.html#option_mysqlimport_defaults-extra-file">--defaults-extra-file</a></td><td>Ler o arquivo de opções nomeadas em vez dos arquivos de opções usuais</td></tr>
<tr><td><a class="link" href="mysqlimport.html#option_mysqlimport_defaults-file">--defaults-file</a></td><td>Ler apenas o arquivo de opções nomeadas</td></tr>
<tr><td><a class="link" href="mysqlimport.html#option_mysqlimport_defaults-group-suffix">--defaults-group-suffix</a></td><td>Valor do sufixo do grupo de opções</td></tr>
<tr><td><a class="link" href="mysqlimport.html#option_mysqlimport_delete">--delete</a></td><td>Limpar a tabela antes de importar o arquivo de texto</td></tr>
<tr><td><a class="link" href="mysqlimport.html#option_mysqlimport_enable-cleartext-plugin">--enable-cleartext-plugin</a></td><td>Ativar o plugin de autenticação sem criptografia</td></tr>
<tr><td><a class="link" href="mysqlimport.html#option_mysqlimport_fields">--fields-enclosed-by</a></td><td>Esta opção tem o mesmo significado que a cláusula correspondente para LOAD DATA</td></tr>
<tr><td><a class="link" href="mysqlimport.html#option_mysqlimport_fields">--fields-escaped-by</a></td><td>Esta opção tem o mesmo significado que a cláusula correspondente para LOAD DATA</td></tr>
<tr><td><a class="link" href="mysqlimport.html#option_mysqlimport_fields">--fields-optionally-enclosed-by</a></td><td>Esta opção tem o mesmo significado que a cláusula correspondente para LOAD DATA</td></tr>
<tr><td><a class="link" href="mysqlimport.html#option_mysqlimport_fields">--fields-terminated-by</a></td><td>Esta opção tem o mesmo significado que a cláusula correspondente para LOAD DATA</td></tr>
<tr><td><a class="link" href="mysqlimport.html#option_mysqlimport_force">--force</a></td><td>Continuar mesmo se ocorrer um erro SQL</td></tr>
<tr><td><a class="link" href="mysqlimport.html#option_mysqlimport_get-server-public-key">

* `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tr><th>Formato de linha de comando</th> <td><code class="literal">--help</code></td> </tr></table>

  Exibir uma mensagem de ajuda e sair.

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tr><th>Formato de linha de comando</th> <td><code class="literal">--bind-address=ip_address</code></td> </tr></table>

  Em um computador com múltiplas interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao servidor MySQL.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tr><th>Formato de linha de comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[nenhuma]</code></td> </tr></table>

  O diretório onde os conjuntos de caracteres estão instalados. Consulte a Seção 12.15, “Configuração de Conjunto de Caracteres”.

* `--columns=column_list`, `-c column_list`

  <table frame="box" rules="all" summary="Propriedades para columns"><tr><th>Formato de linha de comando</th> <td><code class="literal">--columns=column_list</code></td> </tr></table>

  Esta opção aceita uma lista de nomes de colunas separados por vírgula como seu valor. A ordem dos nomes de colunas indica como corresponder as colunas do arquivo de dados às colunas da tabela.

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
</table>

  Compressar todas as informações enviadas entre o cliente e o servidor, se possível. Consulte a Seção 6.2.8, “Controle de compressão de conexão”.

  Esta opção está desatualizada. Espera-se que seja removida em uma versão futura do MySQL. Consulte Configurando a compressão de conexão legada.

* `--compression-algorithms=value`

  <table frame="box" rules="all" summary="Propriedades para compression-algorithms">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code class="literal">--compression-algorithms=value</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>Conjunto</td>
    </tr>
    <tr>
      <th>Valor padrão</th>
      <td><code class="literal">uncompressed</code></td>
    </tr>
    <tr>
      <th>Valores válidos</th>
      <td><p class="valid-value"><code class="literal">zlib</code></p><p class="valid-value"><code class="literal">zstd</code></p><p class="valid-value"><code class="literal">uncompressed</code></p></td>
    </tr>
  </table>

  Os algoritmos de compressão permitidos para conexões com o servidor. Os algoritmos disponíveis são os mesmos da variável de sistema `protocol_compression_algorithms`. O valor padrão é `uncompressed`.

  Para mais informações, consulte a Seção 6.2.8, “Controle de compressão de conexão”.

* `--debug[=debug_options]`, `-# [debug_options]`

<table frame="box" rules="all" summary="Propriedades para depuração">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code class="literal">--debug[=opções_de_depuração]</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code class="literal">d:t:o</code></td>
  </tr>
  </tbody>
</table>

  Escreva um log de depuração. Uma string típica de `opções_de_depuração` é `d:t:o,nome_do_arquivo`. O padrão é `d:t:o`.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.

* `--debug-check`

  <table frame="box" rules="all" summary="Propriedades para debug-check"><col style="width: 30%"/><col style="width: 70%"/>
    <tbody>
      <tr>
        <th>Formato de Linha de Comando</th>
        <td><code class="literal">--debug-check</code></td>
      </tr>
      <tr>
        <th>Tipo</th>
        <td>Booleano</td>
      </tr>
      <tr>
        <th>Valor Padrão</th>
        <td><code class="literal">FALSE</code></td>
      </tr>
    </tbody>
  </table>

  Imprima algumas informações de depuração quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.

* `--debug-info`

  <table frame="box" rules="all" summary="Propriedades para debug-info"><col style="width: 30%"/><col style="width: 70%"/>
    <tbody>
      <tr>
        <th>Formato de Linha de Comando</th>
        <td><code class="literal">--debug-info</code></td>
      </tr>
      <tr>
        <th>Tipo</th>
        <td>Booleano</td>
      </tr>
      <tr>
        <th>Valor Padrão</th>
        <td><code class="literal">FALSE</code></td>
      </tr>
    </tbody>
  </table>

  Imprima informações de depuração e estatísticas de uso de memória e CPU quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.

* `--default-character-set=charset_name`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--help</code></td> </tr></tbody></table>0

  Use *`charset_name`* como o conjunto de caracteres padrão. Veja a Seção 12.15, “Configuração de Conjunto de Caracteres”.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--help</code></td> </tr></tbody></table>1

  Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Veja a Seção 8.2.17, “Autenticação Personalizável”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--help</code></td> </tr></tbody></table>2

  Leia este arquivo de opções após o arquivo de opções globais, mas (no Unix) antes do arquivo de opções do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, veja a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opções”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--help</code></td> </tr></tbody></table>3

Use apenas o arquivo de opções fornecido. Se o arquivo não existir ou estiver inacessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Exceção: Mesmo com `--defaults-file`, os programas cliente leem `.mylogin.cnf`.

Para obter informações adicionais sobre isso e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opções”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Propriedades de ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--help</code></td> </tr></tbody></table>4

  Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, **mysqlimport** normalmente lê os grupos `[client]` e `[mysqlimport]` . Se esta opção for fornecida como `--defaults-group-suffix=_other`, **mysqlimport** também lê os grupos `[client_other]` e `[mysqlimport_other]` .

  Para obter informações adicionais sobre isso e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opções”.

* `--delete`, `-D`

  <table frame="box" rules="all" summary="Propriedades de ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--help</code></td> </tr></tbody></table>5

  Limpe a tabela antes de importar o arquivo de texto.

* `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Propriedades de ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--help</code></td> </tr></tbody></table>6

Ative o plugin de autenticação de texto claro `mysql_clear_password`. (Veja a Seção 8.4.1.3, “Autenticação Pluggable de Texto Claro no Lado do Cliente”).

* `--fields-terminated-by=...`, `--fields-enclosed-by=...`, `--fields-optionally-enclosed-by=...`, `--fields-escaped-by=...`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--help</code></td> </tr></tbody></table>7

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--help</code></td> </tr></tbody></table>8

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--help</code></td> </tr></tbody></table>9

  <table frame="box" rules="all" summary="Propriedades para bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--bind-address=ip_address</code></td> </tr></tbody></table>0

  Essas opções têm o mesmo significado das cláusulas correspondentes para `LOAD DATA`. Veja a Seção 15.2.9, “Instrução LOAD DATA”.

* `--force`, `-f`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--bind-address=ip_address</code></td> </tr></tbody></table>1

  Ignorar erros. Por exemplo, se uma tabela para um arquivo de texto não existir, continue processando os arquivos restantes. Sem `--force`, o **mysqlimport** sai se uma tabela não existir.

* `--get-server-public-key`

<table frame="box" rules="all" summary="Propriedades para endereço de vinculação">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code class="literal">--bind-address=ip_address</code></td>
  </tr>
</table>2

  Solicitar ao servidor a chave pública necessária para a troca de senha baseada em par de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha baseada em RSA não for usada, como no caso de o cliente se conectar ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

  Para informações sobre o plugin `caching_sha2_password`, consulte a Seção 8.4.1.1, “Cacheamento de Autenticação Desbloqueada SHA-2”.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Propriedades para endereço de vinculação">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code class="literal">--bind-address=ip_address</code></td>
    </tr>
  </table>3

  Importar dados para o servidor MySQL no host fornecido. O host padrão é `localhost`.

* `--ignore`, `-i`

  <table frame="box" rules="all" summary="Propriedades para endereço de vinculação">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code class="literal">--bind-address=ip_address</code></td>
    </tr>
  </table>4

  Consulte a descrição da opção `--replace`.

* `--ignore-lines=N`

<table frame="box" rules="all" summary="Propriedades para bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--bind-address=ip_address</code></td> </tr></tbody></table>5

  Ignore as primeiras *`N`* linhas do arquivo de dados.

* `--lines-terminated-by=...`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--bind-address=ip_address</code></td> </tr></tbody></table>6

  Esta opção tem o mesmo significado que a cláusula correspondente para `LOAD DATA`. Por exemplo, para importar arquivos do Windows que têm linhas terminadas por pares de retorno de carro/rodapé, use `--lines-terminated-by="\r\n"`. (Você pode precisar duplicar as barras invertidas, dependendo das convenções de escape do seu interpretador de comandos.) Veja a Seção 15.2.9, “Instrução LOAD DATA”.

* `--local`, `-L`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--bind-address=ip_address</code></td> </tr></tbody></table>7

  Por padrão, os arquivos são lidos pelo servidor no host do servidor. Com esta opção, o **mysqlimport** lê arquivos de entrada localmente no host do cliente.

  O uso bem-sucedido de operações de carregamento `LOCAL` dentro do **mysqlimport** também requer que o servidor permita o carregamento local; veja a Seção 8.1.6, “Considerações de segurança para LOAD DATA LOCAL”

* `--lock-tables`, `-l`

<table frame="box" rules="all" summary="Propriedades para bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--bind-address=ip_address</code></td> </tr></tbody></table>8

  Bloquear *todas* as tabelas para escrita antes de processar arquivos de texto. Isso garante que todas as tabelas estejam sincronizadas no servidor.

* `--login-path=nome`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--bind-address=ip_address</code></td> </tr></tbody></table>9

  Ler opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam qual servidor MySQL conectar e qual conta autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql\_config\_editor**. Veja a Seção 6.6.7, “mysql\_config\_editor — Utilitário de Configuração MySQL”.

  Para obter informações adicionais sobre essa e outras opções de arquivos de opções, veja a Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opções”.

* `--no-login-paths`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></tbody></table>0

  Ignorar a leitura de opções do arquivo de caminho de login.

  Veja `--login-path` para informações relacionadas.

Para obter informações adicionais sobre esta e outras opções de arquivo de configuração, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o gerenciamento de arquivos de configuração”.

* `--low-priority`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></tbody></table>1

  Use `LOW_PRIORITY` ao carregar a tabela. Isso afeta apenas os motores de armazenamento que usam apenas bloqueio de nível de tabela (como `MyISAM`, `MEMORY` e `MERGE`).

* `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></tbody></table>2

  Não leia nenhum arquivo de configuração. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de configuração, o `--no-defaults` pode ser usado para evitar que sejam lidas.

  A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql\_config\_editor**. Veja a Seção 6.6.7, “mysql\_config\_editor — Ferramenta de configuração MySQL”.

  Para obter informações adicionais sobre esta e outras opções de arquivo de configuração, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o gerenciamento de arquivos de configuração”.

* `--password[=senha]` ou `-p[senha]`

<table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></tbody></table>3

  A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysqlimport** solicitará uma. Se fornecida, não deve haver *espaço* entre `--password=` ou `-p` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar a senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Veja a Seção 8.1.2.1, “Diretrizes para o Usuário Final sobre Segurança de Senhas”.

  Para especificar explicitamente que não há senha e que o **mysqlimport** não deve solicitar uma, use a opção `--skip-password`.

* `--password1[=pass_val]`

  A senha para o fator de autenticação multifator 1 da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysqlimport** solicitará uma. Se fornecida, não deve haver *espaço* entre `--password1=` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar a senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Veja a Seção 8.1.2.1, “Diretrizes para o Usuário Final sobre Segurança de Senhas”.

  Para especificar explicitamente que não há senha e que o **mysqlimport** não deve solicitar uma, use a opção `--skip-password1`.

`--password1` e `--password` são sinônimos, assim como `--skip-password1` e `--skip-password`.

* `--password2[=pass_val]`

  A senha para o fator de autenticação multifator 2 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica de `--password1`; consulte a descrição dessa opção para detalhes.

* `--password3[=pass_val]`

  A senha para o fator de autenticação multifator 3 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica de `--password1`; consulte a descrição dessa opção para detalhes.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></tbody></table>4

  No Windows, conecte-se ao servidor usando um pipe nomeado. Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por pipe nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></tbody></table>5

O diretório onde procurar por plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o **mysqlimport** não encontrá-lo. Veja a Seção 8.2.17, “Autenticação Personalizável”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></tbody></table>6

  Para conexões TCP/IP, o número de porta a ser usado.

* `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></tbody></table>7

  Imprima o nome do programa e todas as opções que ele obtém de arquivos de opção.

  Para informações adicionais sobre esta e outras opções de arquivos de opção, veja a Seção 6.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opção”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></tbody></table>8

O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de um protocolo diferente do que você deseja. Para obter detalhes sobre os valores permitidos, consulte a Seção 6.2.7, “Protocolos de Transporte de Conexão”.

* `--replace`, `-r`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></table>9

  As opções `--replace` e `--ignore` controlam o tratamento de linhas de entrada que duplicam linhas existentes com valores de chave únicos. Se você especificar `--replace`, novas linhas substituem linhas existentes que têm o mesmo valor de chave único. Se você especificar `--ignore`, linhas de entrada que duplicam uma linha existente com um valor de chave único são ignoradas. Se você não especificar nenhuma das opções, um erro ocorre quando um valor de chave duplicado é encontrado, e o resto do arquivo de texto é ignorado.

* `--server-public-key-path=nome_arquivo`

  <table frame="box" rules="all" summary="Propriedades para columns"><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--columns=lista_colunas</code></td> </tr></tbody></table>0

O nome do caminho de um arquivo no formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senhas baseada em pares de chaves RSA. Esta opção aplica-se a clientes que autenticam-se com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não autenticam-se com um desses plugins. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

Para `sha256_password`, esta opção só se aplica se o MySQL foi compilado usando OpenSSL.

Para informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 8.4.1.2, “Autenticação Personalizável SHA-256”, e a Seção 8.4.1.1, “Autenticação Personalizável SHA-2”.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Propriedades para colunas"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--columns=column_list</code></td> </tr></tbody></table>1

  Em Windows, o nome do compartilhamento de memória a ser usado para conexões feitas usando compartilhamento de memória a um servidor local. O valor padrão é `MYSQL`. O nome do compartilhamento de memória é case-sensitive.

  Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de compartilhamento de memória.

* `--silent`, `-s`

  <table frame="box" rules="all" summary="Propriedades para colunas"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--columns=column_list</code></td> </tr></tbody></table>2

Modo silencioso. Produza saída apenas quando ocorrer erros.

* `--socket=caminho`, `-S caminho`

  <table frame="box" rules="all" summary="Propriedades para colunas"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--columns=column_list</code></td> </tr></tbody></table>3

  Para conexões com `localhost`, o arquivo de socket Unix a ser usado ou, no Windows, o nome do pipe nomeado a ser usado.

  No Windows, esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por pipe nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--ssl*`

  Opções que começam com `--ssl` especificam se conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Veja Opções de comando para conexões criptografadas.

* `--ssl-fips-mode={OFF|ON|STRICT}`

  <table frame="box" rules="all" summary="Propriedades para colunas"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--columns=column_list</code></td> </tr></tbody></table>4

  Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere de outras opções `--ssl-xxx` porque não é usada para estabelecer conexões criptografadas, mas sim para afetar quais operações criptográficas devem ser permitidas. Veja Seção 8.8, “Suporte FIPS”.

  Estes valores de `--ssl-fips-mode` são permitidos:

  + `OFF`: Desabilitar o modo FIPS.
  + `ON`: Habilitar o modo FIPS.
  + `STRICT`: Habilitar o modo FIPS “estricto”.

  Nota

Se o Módulo de Objeto OpenSSL FIPS não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Nesse caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente emita uma mensagem de aviso ao iniciar e opere no modo não FIPS.

Esta opção está desatualizada. Espera-se que seja removida em uma versão futura do MySQL.

* `--tls-ciphersuites=ciphersuite_list`

  <table frame="box" rules="all" summary="Propriedades para colunas"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--columns=column_list</code></td> </tr></tbody></table>5

  As ciphersuites permitidas para conexões criptografadas que usam TLSv1.3. O valor é uma lista de um ou mais nomes de ciphersuites separados por vírgula. Os ciphersuites que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, “Protocolos e Ciphers TLS de Conexão Criptografada”.

* `--tls-sni-servername=server_name`

  <table frame="box" rules="all" summary="Propriedades para colunas"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--columns=column_list</code></td> </tr></tbody></table>6

  Quando especificada, o nome é passado para a biblioteca de API C `libmysqlclient` usando a opção `MYSQL_OPT_TLS_SNI_SERVERNAME` de `mysql_options()`. O nome do servidor não é case-sensitive. Para mostrar qual nome de servidor o cliente especificou para a sessão atual, se houver, verifique a variável `Tls_sni_server_name`.

  A Indicação de Nome do Servidor (SNI) é uma extensão do protocolo TLS (o OpenSSL deve ser compilado com extensões TLS para que esta opção funcione). A implementação do MySQL da SNI representa apenas o lado do cliente.

* `--tls-version=protocol_list`

<table frame="box" rules="all" summary="Propriedades para colunas">
  <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--columns=column_list</code></td> </tr>
</table>7

  Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolos separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, “Protocolos e cifra TLS de Conexão Encriptada”.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Propriedades para colunas">
    <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--columns=column_list</code></td> </tr>
  </table>8

  O nome de usuário da conta MySQL a ser usado para se conectar ao servidor.

* `--use-threads=N`

  <table frame="box" rules="all" summary="Propriedades para compress">
    <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--compress[={OFF|ON}]</code></td> </tr>
    <tr><th>Desatualizado</th> <td>Sim</td> </tr>
    <tr><th>Tipo</th> <td>Booleano</td> </tr>
    <tr><th>Valor Padrão</th> <td><code class="literal">OFF</code></td> </tr>
  </table>9

  Carregar arquivos em paralelo usando *`N`* threads.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Propriedades para compress">
    <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--compress[={OFF|ON}]</code></td> </tr>
    <tr><th>Deprecated</th> <td>Sim</td> </tr>
    <tr><th>Tipo</th> <td>Booleano</td> </tr>
    <tr><th>Valor Padrão</th> <td><code class="literal">OFF</code></td> </tr>
  </table>0

  Modo de verbosidade. Imprima mais informações sobre o que o programa faz.

* `--version`, `-V`

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
</table>1

  Exibir informações da versão e sair.

* `--zstd-compression-level=level`

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
  </table>2

  O nível de compressão a ser usado para conexões com o servidor que utilizam o algoritmo de compressão `zstd`. Os níveis permitidos são de 1 a 22, com valores maiores indicando níveis de compressão crescentes. O nível de compressão padrão `zstd` é 3. O ajuste do nível de compressão não tem efeito em conexões que não utilizam compressão `zstd`.

Para mais informações, consulte a Seção 6.2.8, “Controle de compressão de conexão”.

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