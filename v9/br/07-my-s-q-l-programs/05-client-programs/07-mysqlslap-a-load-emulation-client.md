### 6.5.7 mysqlslap — Um Cliente de Emulação de Carga

O **mysqlslap** é um programa de diagnóstico projetado para emular a carga de clientes para um servidor MySQL e para relatar o tempo de cada etapa. Ele funciona como se vários clientes estivessem acessando o servidor.

Inicie o **mysqlslap** da seguinte forma:

```
mysqlslap [options]
```

Algumas opções, como `--create` ou `--query`, permitem especificar uma string contendo uma instrução SQL ou um arquivo contendo instruções. Se você especificar um arquivo, por padrão, ele deve conter uma instrução por linha. (Ou seja, o delimitador implícito é o caractere de nova linha.) Use a opção `--delimiter` para especificar um delimitador diferente, o que permite especificar instruções que se estendem por várias linhas ou colocar várias instruções em uma única linha. Você não pode incluir comentários em um arquivo; o **mysqlslap** não os entende.

O **mysqlslap** executa em três etapas:

1. Crie o esquema, a tabela e, opcionalmente, quaisquer programas ou dados armazenados a serem usados para o teste. Esta etapa usa uma única conexão de cliente.

2. Execute o teste de carga. Esta etapa pode usar muitas conexões de cliente.

3. Limpe (desconecte, exclua a tabela, se especificada). Esta etapa usa uma única conexão de cliente.

Exemplos:

Forneça suas próprias instruções SQL de criação e consulta, com 50 clientes fazendo consultas e 200 seleções para cada (insira o comando em uma única linha):

```
mysqlslap --delimiter=";"
  --create="CREATE TABLE a (b int);INSERT INTO a VALUES (23)"
  --query="SELECT * FROM a" --concurrency=50 --iterations=200
```

Deixe o **mysqlslap** construir a instrução SQL de consulta com uma tabela de duas colunas `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") e três colunas `VARCHAR`. Use cinco clientes fazendo consultas 20 vezes cada. Não crie a tabela ou insira os dados (ou seja, use o esquema e os dados do teste anterior):

```
mysqlslap --concurrency=5 --iterations=20
  --number-int-cols=2 --number-char-cols=3
  --auto-generate-sql
```

Diga ao programa para carregar as instruções SQL de criação, inserção e consulta dos arquivos especificados, onde o arquivo `create.sql` tem múltiplas instruções de criação de tabelas delimitadas por `';'` e múltiplas instruções de inserção delimitadas por `';'`. O arquivo `--query` deve conter múltiplas consultas delimitadas por `';'`. Execute todas as instruções de carregamento, depois execute todas as consultas no arquivo de consultas com cinco clientes (cinco vezes cada):

```
mysqlslap --concurrency=5
  --iterations=5 --query=query.sql --create=create.sql
  --delimiter=";"
```

O **mysqlslap** suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysqlslap]` e `[client]` de um arquivo de opções. Para informações sobre arquivos de opções usados por programas MySQL, consulte a Seção 6.2.2.2, “Usando Arquivos de Opções”.

**Tabela 6.16 Opções mysqlslap**

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para mysqlslap">
<tr><th>Nome da opção</th> <th>Descrição</th> </tr>
<tr><td>--auto-generate-sql</td> <td>Gerar declarações SQL automaticamente quando não são fornecidas em arquivos ou usando opções de comando</td> </tr>
<tr><td>--auto-generate-sql-add-autoincrement</td> <td>Adicionar uma chave primária com base em AUTO_INCREMENT para tabelas geradas automaticamente</td> </tr>
<tr><td>--auto-generate-sql-execute-number</td> <td>Especificar quantas consultas devem ser geradas automaticamente</td> </tr>
<tr><td>--auto-generate-sql-guid-primary</td> <td>Adicionar uma chave GUID-based primária para tabelas geradas automaticamente</td> </tr>
<tr><td>--auto-generate-sql-load-type</td> <td>Especificar o tipo de carga para testes</td> </tr>
<tr><td>--auto-generate-sql-secondary-indexes</td> <td>Especificar quantas índices secundários devem ser adicionados às tabelas geradas automaticamente</td> </tr>
<tr><td>--unique-query-number</td> <td>Número de consultas diferentes para testes automáticos</td> </tr>
<tr><td>--unique-write-number</td> <td>Número de consultas diferentes para --auto-generate-sql-write-number</td> </tr>
<tr><td>--write-number</td> <td>Número de inserções de linhas em cada thread</td> </tr>
<tr><td>--commit</td> <td>Número de declarações a executar antes do commit</td> </tr>
<tr><td>--compress</td> <td>Compressar todas as informações enviadas entre o cliente e o servidor</td> </tr>
<tr><td>--compression-algorithms</td> <td>Algoritmos de compressão permitidos para conexões com o servidor</td> </tr>
<tr><td>--concurrency</td> <td>Número de clientes para simular ao emitir a declaração SELECT</td> </tr>
<tr><td>--create</td> <td>Arquivo ou cadeia de caracteres contendo a declaração a usar para criar a tabela</td> </tr>
<tr><td>--create-schema</td> <td>Schema em que os testes serão executados</td> </tr>
<tr><td>--csv</td> <td>Gerar saída em formato de vírgula separada</td> </tr>
<tr><td>--debug</td> <td>Escrever log de depuração</td> </tr>
<tr><td><a class="link" href="mysqlslap.html#option

* `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr></table>

  Exibir uma mensagem de ajuda e sair.

* `--auto-generate-sql`, `-a`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql"><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></table>

  Gerar declarações SQL automaticamente quando elas não são fornecidas em arquivos ou usando opções de comando.

* `--auto-generate-sql-add-autoincrement`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql-add-autoincrement"><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></table>

  Adicionar uma coluna `AUTO_INCREMENT` às tabelas geradas automaticamente.

* `--auto-generate-sql-execute-number=N`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql-execute-number"><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  Especificar quantas consultas devem ser geradas automaticamente.

* `--auto-generate-sql-guid-primary`

<table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-guid-primary">
  <tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr>
  <tr><th>Tipo</th> <td>Booleano</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr>
</table>

  Adicione uma chave primária baseada em GUID para tabelas geradas automaticamente.

* `--auto-generate-sql-load-type=type`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-load-type">
    <tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql-load-type=type</code></td> </tr>
    <tr><th>Tipo</th> <td>Enumeração</td> </tr>
    <tr><th>Valor Padrão</th> <td><code>mixed</code></td> </tr>
    <tr><th>Valores Válidos</th> <td><p><code>read</code></p><p><code>write</code></p><p><code>key</code></p><p><code>update</code></p><p><code>mixed</code></p></td> </tr>
  </table>

  Especifique o tipo de carga de teste. Os valores permitidos são `read` (escanear tabelas), `write` (inserir em tabelas), `key` (ler chaves primárias), `update` (atualizar chaves primárias) ou `mixed` (metade de inserções, metade de seleções de varredura). O valor padrão é `mixed`.

* `--auto-generate-sql-secondary-indexes=N`

<table frame="box" rules="all" summary="Propriedades para auto-gerar índices secundários SQL"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql-secondary-indexes=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>0</code></td> </tr></tbody></table>

  Especifique quantos índices secundários serão adicionados às tabelas geradas automaticamente. Por padrão, nenhum é adicionado.

* `--auto-generate-sql-unique-query-number=N`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar `--auto-generate-sql-unique-query-number`"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql-unique-query-number=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>10</code></td> </tr></tbody></table>

  Quantas consultas diferentes serão geradas para testes automáticos. Por exemplo, se você executar um teste `chave` que realiza 1000 seleções, você pode usar essa opção com um valor de 1000 para executar 1000 consultas únicas, ou com um valor de 50 para realizar 50 seleções diferentes. O valor padrão é 10.

* `--auto-generate-sql-unique-write-number=N`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar `--auto-generate-sql-unique-write-number`"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql-unique-write-number=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>10</code></td> </tr></tbody></table>

  Quantas consultas diferentes serão geradas para `--auto-generate-sql-write-number`. O valor padrão é 10.

* `--auto-generate-sql-write-number=N`

  <table frame="box" rules="all" summary="Propriedades de ajuda"><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></table>

  Quantas inserções de linha de dados devem ser realizadas. O valor padrão é 100.

* `--commit=N`

  <table frame="box" rules="all" summary="Propriedades de ajuda"><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></table>

  Quantas instruções devem ser executadas antes do commit. O valor padrão é 0 (não são realizadas comitis).

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Propriedades de ajuda"><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></table>

  Compressar todas as informações enviadas entre o cliente e o servidor, se possível. Consulte a Seção 6.2.8, “Controle de compressão de conexão”.

  Esta opção está desatualizada. Espera-se que seja removida em uma versão futura do MySQL. Consulte Configurando a compressão de conexão legada.

* `--compression-algorithms=valor`

  <table frame="box" rules="all" summary="Propriedades de ajuda"><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></table>

  Os algoritmos de compressão permitidos para conexões com o servidor. Os algoritmos disponíveis são os mesmos da variável de sistema `protocol_compression_algorithms`. O valor padrão é `uncompressed`.

  Para mais informações, consulte a Seção 6.2.8, “Controle de compressão de conexão”.

* `--concurrency=N`, `-c N`

<table frame="box" rules="all" summary="Propriedades de ajuda"><tr><th>Formato de linha de comando</th><td><code>--help</code></td> </tr></table>

Número de clientes paralelos a serem simulados.

* `--create=valor`

<table frame="box" rules="all" summary="Propriedades de ajuda"><tr><th>Formato de linha de comando</th><td><code>--help</code></td> </tr></table>

O arquivo ou a string que contém a declaração a ser usada para criar a tabela.

* `--create-schema=valor`

<table frame="box" rules="all" summary="Propriedades de ajuda"><tr><th>Formato de linha de comando</th><td><code>--help</code></td> </tr></table>

O esquema no qual os testes serão executados.

Observação

Se a opção `--auto-generate-sql` também for fornecida, o **mysqlslap** excluirá o esquema no final da execução do teste. Para evitar isso, use também a opção `--no-drop`.

* `--csv[=nome_do_arquivo]`

<table frame="box" rules="all" summary="Propriedades de ajuda"><tr><th>Formato de linha de comando</th><td><code>--help</code></td> </tr></table>

Gerar a saída no formato de valores separados por vírgula. A saída é enviada para o arquivo nomeado ou para a saída padrão, se nenhum arquivo for fornecido.

* `--debug[=opções_de_depuração]`, `-# [opções_de_depuração]`

<table frame="box" rules="all" summary="Propriedades de ajuda"><tr><th>Formato de linha de comando</th><td><code>--help</code></td> </tr></table>

Escreva um log de depuração. Uma string típica de `debug_options` é `d:t:o,nome_do_arquivo`. O padrão é `d:t:o,/tmp/mysqlslap.trace`.

Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de liberação do MySQL fornecidos pela Oracle *não* são compilados com esta opção.

* `--debug-check`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Imprima algumas informações de depuração quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de liberação do MySQL fornecidos pela Oracle *não* são compilados com esta opção.

* `--debug-info`, `-T`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Imprima informações de depuração e estatísticas de uso de memória e CPU quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de liberação do MySQL fornecidos pela Oracle *não* são compilados com esta opção.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

Uma dica sobre qual plugin de autenticação do lado do cliente usar. Veja a Seção 8.2.17, “Autenticação Personalizável”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Leia este arquivo de opções após o arquivo de opções globais, mas (no Unix) antes do arquivo de opções do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opções”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Use apenas o arquivo de opções fornecido. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Exceção: Mesmo com `--defaults-file`, os programas cliente leem `.mylogin.cnf`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opções”.

* `--defaults-group-suffix=str`

<table frame="box" rules="all" summary="Propriedades para auto-gerar-sql">
  <tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql</code></td> </tr>
  <tr><th>Tipo</th> <td>Booleano</td> </tr>
  <tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr>
  <tr><th></th></tr>
</table>

  Leia não apenas os grupos de opções habituais, mas também grupos com os nomes habituais e um sufixo de *`str`*. Por exemplo, **mysqlslap** normalmente lê os grupos `[client]` e `[mysqlslap]` . Se esta opção for dada como `--defaults-group-suffix=_other`, **mysqlslap** também lê os grupos `[client_other]` e `[mysqlslap_other]` .

  Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opções”.

* `--delimiter=str`, `-F str`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql">
    <tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql</code></td> </tr>
    <tr><th>Tipo</th> <td>Booleano</td> </tr>
    <tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr>
    <tr><th></th></tr>
  </table>

  O delimitador a ser usado em declarações SQL fornecidas em arquivos ou usando opções de comando.

* `--detach=N`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql">
    <tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql</code></td> </tr>
    <tr><th>Tipo</th> <td>Booleano</td> </tr>
    <tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr>
    <tr><th></th></tr>
  </table>

Desconecte (feche e reabra) cada conexão após cada declaração *`N`*. O padrão é 0 (as conexões não são desconectadas).

* `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Ative o plugin de autenticação de texto claro `mysql_clear_password`. (Veja a Seção 8.4.1.3, “Autenticação de texto claro plugável do lado do cliente”.)

* `--engine=engine_name`, `-e engine_name`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  O motor de armazenamento a ser usado para criar tabelas.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

Solicitar a chave pública RSA que o servidor usa para a troca de senhas baseada em pares de chaves. Esta opção aplica-se a clientes que se conectam ao servidor usando uma conta que autentica com o plugin de autenticação `caching_sha2_password`. Para conexões por tais contas, o servidor não envia a chave pública ao cliente a menos que seja solicitado. A opção é ignorada para contas que não autenticam com esse plugin. Também é ignorada se a troca de senha baseada em RSA não for necessária, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

Para informações sobre o plugin `caching_sha2_password`, consulte a Seção 8.4.1.1, “Caching SHA-2 Pluggable Authentication”.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql-add-autoincrement"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Conectar-se ao servidor MySQL no host fornecido.

* `--iterations=N`, `-i N`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql-add-autoincrement"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  O número de vezes que as teses serão executadas.

* `--login-path=nome`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-add-autoincrement"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam qual servidor MySQL conectar e qual conta autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql_config_editor**. Veja a Seção 6.6.7, “mysql_config_editor — Utilitário de Configuração MySQL”.

  Para informações adicionais sobre isso e outras opções de arquivos de opções, veja a Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opções”.

* `--no-caminhos-de-login`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-add-autoincrement"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Ignora a leitura de opções do arquivo de caminho de login.

  Veja `--login-path` para informações relacionadas.

  Para informações adicionais sobre isso e outras opções de arquivos de opções, veja a Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opções”.

* `--no-drop`

<table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-add-autoincrement"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Evite que o **mysqlslap** elimine qualquer esquema criado durante a execução do teste.

* `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-add-autoincrement"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Não leia nenhum arquivo de opção. Se a inicialização do programa falhar devido à leitura de opções desconhecidas de um arquivo de opção, o `--no-defaults` pode ser usado para evitar que sejam lidas.

  A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql_config_editor**. Veja a Seção 6.6.7, “mysql_config_editor — Ferramenta de configuração do MySQL”.

  Para obter informações adicionais sobre esta e outras opções de arquivos de opção, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opção”.

* `--number-char-cols=N`, `-x N`

<table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-add-autoincrement">
  <tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr>
  <tr><th>Tipo</th> <td>Booleano</td> </tr>
  <tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr>
</table>

  O número de colunas `VARCHAR` a serem usadas se `--auto-generate-sql` for especificado.

* `--number-int-cols=N`, `-y N`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-add-autoincrement">
    <tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr>
    <tr><th>Tipo</th> <td>Booleano</td> </tr>
    <tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr>
  </table>

  O número de colunas `INT` (INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT) a serem usadas se `--auto-generate-sql` for especificado.

* `--number-of-queries=N`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-add-autoincrement">
    <tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr>
    <tr><th>Tipo</th> <td>Booleano</td> </tr>
    <tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr>
  </table>

  Limitar cada cliente a aproximadamente quantas consultas. O contagem de consultas leva em consideração o delimitador da instrução. Por exemplo, se você invocar **mysqlslap** da seguinte forma, o delimitador `;` é reconhecido para que cada instância da string de consulta seja contada como duas consultas. Como resultado, 5 linhas (e não 10) são inseridas.

  ```
  mysqlslap --delimiter=";" --number-of-queries=10
            --query="use test;insert into t values(null)"
  ```

* `--only-print`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-add-autoincrement"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Não conecte-se aos bancos de dados. O **mysqlslap** só imprime o que teria feito.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-execute-number"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysqlslap** solicitará uma senha. Se for fornecida, não deve haver *espaço* entre `--password=` ou `-p` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar a senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opções. Veja a Seção 8.1.2.1, “Diretrizes do Usuário Final para Segurança da Senha”.

  Para especificar explicitamente que não há senha e que o **mysqlslap** não deve solicitar uma, use a opção `--skip-password`.

* `--password1[=pass_val]`

A senha para o fator de autenticação multifatorial 1 da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysqlslap** solicitará uma senha. Se for fornecida, não deve haver **espaço** entre `--password1=` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar a senha.

Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opções. Veja a Seção 8.1.2.1, “Diretrizes para o Usuário Final sobre Segurança de Senhas”.

Para especificar explicitamente que não há senha e que o **mysqlslap** não deve solicitar uma senha, use a opção `--skip-password1`.

`--password1` e `--password` são sinônimos, assim como `--skip-password1` e `--skip-password`.

* `--password2[=pass_val]`

  A senha para o fator de autenticação multifatorial 2 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica da opção `--password1`; consulte a descrição dessa opção para detalhes.

* `--password3[=pass_val]`

  A senha para o fator de autenticação multifatorial 3 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica da opção `--password1`; consulte a descrição dessa opção para detalhes.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-número-de-execução-sql"><tr><th>Formato na Linha de Comando</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

Em Windows, conecte-se ao servidor usando um tubo nomeado. Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por tubo nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-número-de-execução-sql"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  O diretório onde procurar por plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o **mysqlslap** não o encontrar. Veja a Seção 8.2.17, “Autenticação Personalizável”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-número-de-execução-sql"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  Para conexões TCP/IP, o número de porta a ser usado.

* `--post-query=value`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-número-de-execução-sql"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  O arquivo ou a string contendo a instrução a ser executada após os testes terem sido concluídos. Esta execução não é contada para fins de temporização.

* `--post-system=str`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-número-de-execução-sql"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  A string a ser executada usando `system()` após os testes terem sido concluídos. Essa execução não é contada para fins de temporização.

* `--pre-query=value`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-número-de-execução-sql"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  O arquivo ou a string contendo a declaração a ser executada antes de executar os testes. Essa execução não é contada para fins de temporização.

* `--pre-system=str`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-número-de-execução-sql"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  A string a ser executada usando `system()` antes de executar os testes. Essa execução não é contada para fins de temporização.

* `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-número-de-execução-sql"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção.

Para obter informações adicionais sobre isso e outras opções de arquivos de opção, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opção”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql-execute-number"><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></table>

  O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de um protocolo diferente do que você deseja. Para detalhes sobre os valores permitidos, consulte a Seção 6.2.7, “Protocolos de transporte de conexão”.

* `--query=value`, `-q value`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql-guid-primary"><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></table>

  O arquivo ou a string que contém a instrução `SELECT` a ser usada para recuperar dados.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql-guid-primary"><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></table>

O nome do caminho de um arquivo no formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senhas com par de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

Para `sha256_password`, esta opção só se aplica se o MySQL foi compilado usando OpenSSL.

Para informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 8.4.1.2, “Autenticação Personalizável SHA-256” e a Seção 8.4.1.1, “Autenticação Personalizável SHA-2”.

* `--shared-memory-base-name=name`

<table frame="box" rules="all" summary="Propriedades para auto-generate-sql-guid-primary"><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></table>

  Em Windows, o nome da memória compartilhada a ser usado para conexões feitas usando memória compartilhada para um servidor local. O valor padrão é `MYSQL`. O nome da memória compartilhada é sensível a maiúsculas e minúsculas.

  Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões com memória compartilhada.

* `--silent`, `-s`

<table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-guid-primary">
  <tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr>
  <tr><th>Tipo</th> <td>Booleano</td> </tr>
  <tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr>
</table>
3

Modo silencioso. Sem saída.

* `--socket=caminho`, `-S caminho`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-guid-primary">
    <tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr>
    <tr><th>Tipo</th> <td>Booleano</td> </tr>
    <tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr>
  </table>
4

Para conexões com `localhost`, o arquivo de socket Unix a ser usado ou, em Windows, o nome do pipe nomeado a ser usado.

Em Windows, esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por pipe nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--sql-mode=modo`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-guid-primary">
    <tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr>
    <tr><th>Tipo</th> <td>Booleano</td> </tr>
    <tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr>
  </table>
5

Defina o modo SQL para a sessão do cliente.

* `--ssl*`

As opções que começam com `--ssl` especificam se conectar ao servidor usando criptografia e indicam onde encontrar chaves e certificados SSL. Veja Opções de Comando para Conexões Criptografadas.

* `--ssl-fips-mode={OFF|ON|STRICT}`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql-guid-primary"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere de outras opções `--ssl-xxx` porque não é usada para estabelecer conexões criptografadas, mas sim para afetar quais operações criptográficas devem ser permitidas. Veja Seção 8.8, “Suporte FIPS”.

  Esses valores de `--ssl-fips-mode` são permitidos:

  + `OFF`: Desabilitar o modo FIPS.
  + `ON`: Habilitar o modo FIPS.
  + `STRICT`: Habilitar o modo FIPS “estricto”.

  Observação

  Se o Módulo de Objeto FIPS OpenSSL não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Nesse caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente produza um aviso na inicialização e opere no modo não FIPS.

  Esta opção está desatualizada. Espere que ela seja removida em uma versão futura do MySQL.

* `--tls-ciphersuites=ciphersuite_list`

<table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-guid-primary"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  As suíte de cifra permitidas para conexões criptografadas que usam TLSv1.3. O valor é uma lista de um ou mais nomes de suíte de cifra separados por vírgula. As suíte de cifra que podem ser nomeadas para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, “Protocolos e suíte de cifra TLS de Conexão Criptografada”.

* `--tls-sni-servername=server_name`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-guid-primary"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Quando especificado, o nome é passado para a biblioteca de API C `libmysqlclient` usando a opção `MYSQL_OPT_TLS_SNI_SERVERNAME` de `mysql_options()`. O nome do servidor não é case-sensitive. Para mostrar qual nome do servidor o cliente especificou para a sessão atual, se houver, verifique a variável `Tls_sni_server_name`.

  A Indicação de Nome do Servidor (SNI) é uma extensão do protocolo TLS (o OpenSSL deve ser compilado com extensões TLS para que esta opção funcione). A implementação do SNI do MySQL representa apenas o lado do cliente.

* `--tls-version=lista_protocolos`

<table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-guid-primary">
  <tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr>
  <tr><th>Tipo</th> <td>Booleano</td> </tr>
  <tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr>
</table>

Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolos separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, “Protocolos e cifra TLS de conexão criptografada”.

* `--user=nome_do_usuario`, `-u nome_do_usuario`

<table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-load-type">
  <tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql-load-type=tipo</code></td> </tr>
  <tr><th>Tipo</th> <td>Enumeração</td> </tr>
  <tr><th>Valor padrão</th> <td><code>mixed</code></td> </tr>
  <tr><th>Valores válidos</th> <td><p><code>read</code></p><p><code>write</code></p><p><code>key</code></p><p><code>update</code></p><p><code>mixed</code></p></td> </tr>
</table>

0

O nome de usuário da conta MySQL a ser usado para se conectar ao servidor.

* `--verbose`, `-v`

<table frame="box" rules="all" summary="Propriedades para auto-gerar-tipo-de-carga-sql"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql-load-type=type</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td><code>mixed</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>read</code></p><p><code>write</code></p><p><code>key</code></p><p><code>update</code></p><p><code>mixed</code></p></td> </tr></tbody></table>

  Modo detalhado. Imprima mais informações sobre o que o programa faz. Esta opção pode ser usada várias vezes para aumentar a quantidade de informações.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-tipo-de-carga-sql"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql-load-type=type</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td><code>mixed</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>read</code></p><p><code>write</code></p><p><code>key</code></p><p><code>update</code></p><p><code>mixed</code></p></td> </tr></tbody></table>

  Exibir informações da versão e sair.

* `--zstd-compression-level=level`

<table frame="box" rules="all" summary="Propriedades para o tipo de carga de autogeração de SQL">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--auto-generate-sql-load-type=type</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Enumeração</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>mixed</code></td>
  </tr>
  <tr>
    <th>Valores válidos</th>
    <td><p><code>read</code></p><p><code>write</code></p><p><code>key</code></p><p><code>update</code></p><p><code>mixed</code></p></td>
  </tr>
</table>

  O nível de compressão a ser usado para conexões ao servidor que utilizam o algoritmo de compressão `zstd`. Os níveis permitidos variam de 1 a 22, com valores maiores indicando níveis crescentes de compressão. O nível de compressão padrão do `zstd` é 3. O ajuste do nível de compressão não tem efeito em conexões que não utilizam compressão `zstd`.

  Para mais informações, consulte a Seção 6.2.8, “Controle de compressão de conexão”.