### 6.5.5 `mysqlimport` — Um Programa de Importação de Dados

O cliente `mysqlimport` fornece uma interface de linha de comando para a instrução SQL `LOAD DATA`. A maioria das opções do `mysqlimport` corresponde diretamente a cláusulas da sintaxe `LOAD DATA`. Consulte a Seção 15.2.9, “Instrução LOAD DATA”.

Invoque `mysqlimport` da seguinte forma:

```
mysqlimport [options] db_name textfile1 [textfile2 ...]
```

Para cada arquivo de texto nomeado na linha de comando, o `mysqlimport` remove qualquer extensão do nome do arquivo e usa o resultado para determinar o nome da tabela na qual o conteúdo do arquivo será importado. Por exemplo, os arquivos nomeados `patient.txt`, `patient.text` e `patient` seriam todos importados em uma tabela chamada `patient`.

O `mysqlimport` suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysqlimport]` e `[client]` de um arquivo de opções. Para informações sobre arquivos de opções usados por programas MySQL, consulte a Seção 6.2.2.2, “Usando Arquivos de Opções”.

**Tabela 6.14 Opções `mysqlimport`**

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
         <td><code>--columns</code></td>
         <td>Esta opção recebe uma lista de nomes de colunas separados por vírgula como seu valor</td>
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
         <td><code>--debug</code></td>
         <td>Escrever o log de depuração</td>
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
         <td>Plugin de autenticação a usar</td>
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
         <td><code>--delete</code></td>
         <td>Limpar a tabela antes de importar o arquivo de texto</td>
      </tr>
      <tr>
         <td><code>--enable-cleartext-plugin</code></td>
         <td>Habilitar o plugin de autenticação em texto claro</td>
      </tr>
      <tr>
         <td><code>--fields-enclosed-by</code></td>
         <td>Esta opção tem o mesmo significado que a cláusula correspondente para <code>LOAD DATA</code></td>
      </tr>
      <tr>
         <td><code>--fields-escaped-by</code></td>
         <td>Esta opção tem o mesmo significado que a cláusula correspondente para <code>LOAD DATA</code></td>
      </tr>
      <tr>
         <td><code>--fields-optionally-enclosed-by</code></td>
         <td>Esta opção tem o mesmo significado que a cláusula correspondente para <code>LOAD DATA</code></td>
      </tr>
      <tr>
         <td><code>--fields-terminated-by</code></td>
         <td>Esta opção tem o mesmo significado que a cláusula correspondente para <code>LOAD DATA</code></td>
      </tr>
      <tr>
         <td><code>--force</code></td>
         <td>Continuar mesmo se ocorrer um erro SQL</td>
      </tr>
      <tr>
         <td><code>--get-server-public-key</code></td>
         <td>Solicitar a chave pública do servidor</td>
      </tr>
      <tr>
         <td><code>--help</code></td>
         <td>Exibir a mensagem de ajuda e sair</td>
      </tr>
      <tr>
         <td><code>--host</code></td>
         <td>O host em que o servidor MySQL está localizado</td>
      </tr>
      <tr>
         <td><code>--ignore</code></td>
         <td>Veja a descrição da opção <code>--replace</code></td>
      </tr>
      <tr>
         <td><code>--ignore-lines</code></td>
         <td>Ignorar as primeiras `N` linhas do arquivo de dados</td>
      </tr>
      <tr>
         <td><code>--lines-terminated-by</code></td>
         <td>Esta opção tem o mesmo significado que a cláusula correspondente para <code>LOAD DATA</code></td>
      </tr>
      <tr>
         <td><code>--local</code></td>
         <td>Ler os arquivos de entrada localmente do host do cliente</td>
      </tr>
      <tr>
         <td><code>--lock-tables</code></td>
         <td>Bloquear todas as tabelas para escrita antes do processamento dos arquivos de texto</td>
      </tr>
      <tr>
         <td><code>--login-path</code></td>
         <td>Ler as opções de caminho de login do arquivo <code>.mylogin.cnf</code></td>
      </tr>
      <tr>
         <td><code>--low-priority</code></td>
         <td>Usar <code>LOW_PRIORITY</code> ao carregar a tabela</td>
      </tr>
      <tr>
         <td><code>--no-defaults</code></td>
         <td>Ler nenhum arquivo

*  `--help`, `-?`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Exibir uma mensagem de ajuda e sair.
*  `--bind-address=ip_address`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Em um computador com múltiplas interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao servidor MySQL.
*  `--character-sets-dir=dir_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  O diretório onde os conjuntos de caracteres estão instalados. Consulte a Seção 12.15, “Configuração de Conjunto de Caracteres”.
*  `--columns=column_list`, `-c column_list`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>

  Esta opção aceita uma lista de nomes de colunas separados por vírgula como seu valor. A ordem dos nomes de colunas indica como corresponder as colunas do arquivo de dados às colunas da tabela.
*  `--compress`, `-C`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Compressar todas as informações enviadas entre o cliente e o servidor, se possível. Consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

  Esta opção está desatualizada. Espere-se que ela seja removida em uma versão futura do MySQL. Consulte Configurando a Compressão de Conexão Legado.
*  `--compression-algorithms=value`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--compression-algorithms=valor</code></td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td><code>não comprimido</code></td> </tr><tr><th>Valores válidos</th> <td><code>zlib</code><code>zstd</code><code>não comprimido</code></td> </tr></tbody></table>

  Os algoritmos de compressão permitidos para conexões com o servidor. Os algoritmos disponíveis são os mesmos da variável de sistema `protocol_compression_algorithms`. O valor padrão é `não comprimido`.

  Para mais informações, consulte a Seção 6.2.8, “Controle de compressão de conexão”.
*  `--debug[=opções_de_debug]`, `-# [opções_de_debug]`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--debug[=opções_de_debug]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>d:t:o</code></td> </tr></tbody></table>

  Escreva um log de depuração. Uma string típica de `opções_de_debug` é `d:t:o,nome_do_arquivo`. O valor padrão é `d:t:o`.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de liberação do MySQL fornecidos pela Oracle *não* são compilados com esta opção.
*  `--debug-check`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--debug-check</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Imprima algumas informações de depuração quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de liberação do MySQL fornecidos pela Oracle *não* são compilados com esta opção.
*  `--debug-info`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--debug-info</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Imprima informações de depuração e estatísticas de uso de memória e CPU quando o programa sair.

Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.
*  `--default-character-set=charset_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--default-character-set=charset_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Use `charset_name` como o conjunto de caracteres padrão. Consulte  Seção 12.15, “Configuração de Conjunto de Caracteres”.
*  `--default-auth=plugin`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Uma dica sobre qual plugin de autenticação do lado do cliente usar. Consulte  Seção 8.2.17, “Autenticação Personalizável”.
*  `--defaults-extra-file=file_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-extra-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Leia este arquivo de opção após o arquivo de opção global, mas (no Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se `file_name` não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opção, consulte  Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opção”.
*  `--defaults-file=file_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se `file_name` não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Exceção: Mesmo com `--defaults-file`, os programas cliente leem `.mylogin.cnf`.

Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opções”.
*  `--defaults-group-suffix=str`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-group-suffix=str</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Leia não apenas os grupos de opções habituais, mas também grupos com os nomes habituais e um sufixo de *`str`*. Por exemplo, o `mysqlimport` normalmente lê os grupos `[client]` e `[mysqlimport]`. Se esta opção for fornecida como `--defaults-group-suffix=_other`, o `mysqlimport` também lê os grupos `[client_other]` e `[mysqlimport_other]`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opções”.
*  `--delete`, `-D`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--delete</code></td> </tr></tbody></table>

  Limpe a tabela antes de importar o arquivo de texto.
*  `--enable-cleartext-plugin`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Ative o plugin de autenticação de texto claro `mysql_clear_password` (consulte a Seção 8.4.1.4, “Autenticação de texto claro plugável do lado do cliente”).
*  `--fields-terminated-by=...`, `--fields-enclosed-by=...`, `--fields-optionally-enclosed-by=...`, `--fields-escaped-by=...`

<table>
   <tbody>
      <tr>
         <th>Formato de linha de comando</th>
         <td><code>--fields-terminated-by=string</code></td>
      </tr>
      <tr>
         <th>Tipo</th>
         <td><code>String</code></td>
      </tr>
   </tbody>
</table>
<table>
   <tbody>
      <tr>
         <th>Formato de linha de comando</th>
         <td><code>--fields-enclosed-by=string</code></td>
      </tr>
      <tr>
         <th>Tipo</th>
         <td><code>String</code></td>
      </tr>
   </tbody>
</table>
<table>
   <tbody>
      <tr>
         <th>Formato de linha de comando</th>
         <td><code>--fields-optionally-enclosed-by=string</code></td>
      </tr>
      <tr>
         <th>Tipo</th>
         <td><code>String</code></td>
      </tr>
   </tbody>
</table>
<table>
   <tbody>
      <tr>
         <th>Formato de linha de comando</th>
         <td><code>--fields-escaped-by</code></td>
      </tr>
      <tr>
         <th>Tipo</th>
         <td><code>String</code></td>
      </tr>
   </tbody>
</table>

  Essas opções têm o mesmo significado das cláusulas correspondentes para `LOAD DATA`. Veja a Seção 15.2.9, “Instrução LOAD DATA”.
*  `--force`, `-f`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--force</code></td> </tr></tbody></table>

  Ignorar erros. Por exemplo, se uma tabela para um arquivo de texto não existir, continue processando quaisquer arquivos restantes. Sem `--force`, o `mysqlimport` sai se uma tabela não existir.
*  `--get-server-public-key`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr></tbody></table>

Solicitar a chave pública do servidor necessária para a troca de senhas baseada em pares de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senhas baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

Para informações sobre o plugin `caching_sha2_password`, consulte a Seção 8.4.1.2, “Cacheamento de Autenticação SHA-2”.*  `--host=host_name`, `-h host_name`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--host=host_name</code></td> </tr><tr><th>Tipo</th> <td><code>String</code></td> </tr><tr><th>Valor Padrão</th> <td><code>localhost</code></td> </tr></tbody></table>

Importar dados para o servidor MySQL no host fornecido. O host padrão é `localhost`.*  `--ignore`, `-i`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--ignore</code></td> </tr></tbody></table>

Consulte a descrição da opção `--replace`.*  `--ignore-lines=N`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--ignore-lines=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

Ignorar as *`N`* primeiras linhas do arquivo de dados.*  `--lines-terminated-by=...`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--lines-terminated-by=string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

Esta opção tem o mesmo significado que a cláusula correspondente para `LOAD DATA`. Por exemplo, para importar arquivos do Windows que têm linhas terminadas por pares de retorno de carro/pula de linha, use `--lines-terminated-by="\r\n"`. (Você pode precisar duplicar as barras invertidas, dependendo das convenções de escape do seu interpretador de comandos.) Veja a Seção 15.2.9, “Instrução LOAD DATA”.
*  `--local`, `-L`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--local</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Por padrão, os arquivos são lidos pelo servidor no host do servidor. Com esta opção, `mysqlimport` lê arquivos de entrada localmente no host do cliente.

  O uso bem-sucedido de operações de carregamento `LOCAL` dentro de `mysqlimport` também requer que o servidor permita o carregamento local;
*  `--lock-tables`, `-l`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--lock-tables</code></td> </tr></tbody></table>

  Bloqueie *todas* as tabelas para escrita antes de processar quaisquer arquivos de texto. Isso garante que todas as tabelas estejam sincronizadas no servidor.
*  `--login-path=name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--login-path=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Leia opções de login do caminho nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contêm opções que especificam para qual servidor MySQL se conectar e com qual conta se autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário `mysql_config_editor`.
*  `--no-login-paths`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--no-login-paths</code></td> </tr></tbody></table>

  Ignora a leitura de opções do arquivo de caminho de login.

  Veja `--login-path` para informações relacionadas.
*  `--low-priority`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--low-priority</code></td> </tr></tbody></table>

Use `LOW_PRIORITY` ao carregar a tabela. Isso afeta apenas os motores de armazenamento que usam apenas bloqueio em nível de tabela (como `MyISAM`, `MEMORY` e `MERGE`).
*  `--no-defaults`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--no-defaults</code></td> </tr></tbody></table>

  Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para evitar que sejam lidas.

  A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário  `mysql_config_editor`.

*  `--password[=password]`, `-p[password]`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--password[=password]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o `mysqlimport` solicitará uma. Se for fornecido, deve haver *nenhum espaço* entre `--password=` ou `-p` e a senha que o segue. Se nenhuma opção de senha for especificada, o padrão é não enviar a senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opções.

  Para especificar explicitamente que não há senha e que o `mysqlimport` não deve solicitar uma, use a opção `--skip-password`.
*  `--password1[=pass_val]`

  A senha para o fator de autenticação multifator 1 da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o `mysqlimport` solicitará uma. Se for fornecido, deve haver *nenhum espaço* entre `--password1=` e a senha que o segue. Se nenhuma opção de senha for especificada, o padrão é não enviar a senha.

Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Veja a Seção 8.1.2.1, “Diretrizes para o Usuário Final sobre Segurança de Senhas”.

Para especificar explicitamente que não há senha e que o `mysqlimport` não deve solicitar uma, use a opção `--skip-password1`.

`--password1` e `--password` são sinônimos, assim como `--skip-password1` e `--skip-password`.
*  `--password2[=pass_val]`

  A senha para o fator de autenticação multifator 2 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica para `--password1`; consulte a descrição dessa opção para detalhes.
*  `--password3[=pass_val]`

  A senha para o fator de autenticação multifator 3 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica para `--password1`; consulte a descrição dessa opção para detalhes.
*  `--pipe`, `-W`

  <table><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--pipe</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Em Windows, conecte-se ao servidor usando um pipe nomeado. Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por pipe nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.
*  `--plugin-dir=dir_name`

  <table><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--plugin-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome de diretório</td> </tr></tbody></table>

  O diretório onde procurar por plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o `mysqlimport` não o encontrar. Veja a Seção 8.2.17, “Autenticação Personalizável”.
*  `--port=port_num`, `-P port_num`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--port=número_de_porta</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>3306</code></td> </tr></tbody></table>

  Para conexões TCP/IP, o número de porta a ser usado.
*  `--print-defaults`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--print-defaults</code></td> </tr></tbody></table>

  Imprima o nome do programa e todas as opções que ele recebe de arquivos de opções.

  Para obter informações adicionais sobre esta e outras opções de arquivos de opções, consulte  Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opções”.
*  `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--protocol=tipo</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[ver texto]</code></td> </tr><tr><th>Valores válidos</th> <td><code>TCP</code><code>SOCKET</code><code>PIPE</code><code>MEMORY</code></td> </tr></tbody></table>

  O protocolo de transporte a ser usado para conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de um protocolo diferente do que você deseja. Para obter detalhes sobre os valores permitidos, consulte Seção 6.2.7, “Protocolos de transporte de conexão”.
*  `--replace`, `-r`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--replace</code></td> </tr></tbody></table>

  As opções `--replace` e `--ignore` controlam o tratamento de linhas de entrada que duplicam linhas existentes com valores de chave únicos. Se você especificar `--replace`, novas linhas substituem linhas existentes que têm o mesmo valor de chave único. Se você especificar `--ignore`, linhas de entrada que duplicam uma linha existente com um valor de chave único são ignoradas. Se você não especificar nenhuma das opções, um erro ocorre quando um valor de chave único é encontrado, e o resto do arquivo de texto é ignorado.
*  `--server-public-key-path=nome_do_arquivo`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--server-public-key-path=nome_do_arquivo</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  O nome do caminho de um arquivo no formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senhas baseada em par de chaves RSA. Esta opção aplica-se a clientes que autenticam-se com o plugin de autenticação `sha256_password` (desatualizado) ou `caching_sha2_password`. Esta opção é ignorada para contas que não autenticam-se com um desses plugins. Também é ignorada se a troca de senhas baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=nome_do_arquivo` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

  Para `sha256_password` (desatualizado), esta opção só se aplica se o MySQL foi compilado usando o OpenSSL.
*  `--shared-memory-base-name=nome`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--shared-memory-base-name=nome</code></td> </tr><tr><th>Plataforma específica</th> <td>Windows</td> </tr></tbody></table>

  Em Windows, o nome da memória compartilhada a ser usado para conexões feitas usando memória compartilhada para um servidor local. O valor padrão é `MYSQL`. O nome da memória compartilhada é case-sensitive.

  Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.
*  `--silent`, `-s`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--silent</code></td> </tr></tbody></table>

  Modo silencioso. Produza saída apenas quando ocorrer erros.
*  `--socket=caminho`, `-S caminho`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--socket={nome_do_arquivo|nome_do_pipe}</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Para conexões com `localhost`, o arquivo de socket Unix a ser usado, ou, em Windows, o nome do pipe nomeado a ser usado.

No Windows, essa opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por named pipe. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.
* `--ssl*`

  As opções que começam com `--ssl` especificam se a conexão ao servidor deve ser feita usando criptografia e indicam onde encontrar as chaves e certificados SSL. Veja Opções de Comando para Conexões Criptografadas.
*  `--ssl-fips-mode={OFF|ON|STRICT}`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--ssl-fips-mode={OFF|ON|STRICT}</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr><tr><th>Valores Válidos</th> <td><code>OFF</code><code>ON</code><code>STRICT</code></td> </tr></tbody></table>

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
*  `--use-threads=N`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--use-threads=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

Carregue arquivos em paralelo usando *`N`* threads.
*  `--verbose`, `-v`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--verbose</code></td> </tr></tbody></table>

Modo verbose. Imprima mais informações sobre o que o programa faz.
*  `--version`, `-V`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--version</code></td> </tr></tbody></table>

Exibir informações da versão e sair.
*  `--zstd-compression-level=level`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--zstd-compression-level=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr></tbody></table>

O nível de compressão a ser usado para conexões ao servidor que utilizam o algoritmo de compressão `zstd`. Os níveis permitidos são de 1 a 22, com valores maiores indicando níveis crescentes de compressão. O nível de compressão padrão é 3. O ajuste do nível de compressão não tem efeito em conexões que não utilizam compressão `zstd`.

Para mais informações, consulte a Seção 6.2.8, “Controle de compressão de conexão”.

Aqui está uma sessão de exemplo que demonstra o uso do `mysqlimport`:

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