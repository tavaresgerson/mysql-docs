### 6.5.7 `mysqlslap` — Um Cliente de Emulação de Carga

`mysqlslap` é um programa de diagnóstico projetado para emular a carga de clientes para um servidor MySQL e para relatar o tempo de cada etapa. Ele funciona como se vários clientes estivessem acessando o servidor.

Inicie `mysqlslap` da seguinte forma:

```
mysqlslap [options]
```

Algumas opções, como `--create` ou `--query`, permitem especificar uma string contendo uma instrução SQL ou um arquivo contendo instruções. Se você especificar um arquivo, por padrão, ele deve conter uma instrução por linha. (Ou seja, o delimitador implícito é o caractere de nova linha.) Use a opção `--delimiter` para especificar um delimitador diferente, o que permite especificar instruções que se estendem por várias linhas ou colocar várias instruções em uma única linha. Você não pode incluir comentários em um arquivo; o `mysqlslap` não os entende.

`mysqlslap` executa em três etapas:

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

Deixe `mysqlslap` construir a instrução SQL de consulta com uma tabela de duas colunas `INT` (`INTEGER`, `INT`, `SMALLINT`, `TINYINT`, `MEDIUMINT`, `BIGINT`) e três colunas `VARCHAR`. Use cinco clientes fazendo consultas 20 vezes cada. Não crie a tabela ou insira os dados (ou seja, use o esquema e os dados do teste anterior):

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

O `mysqlslap` suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysqlslap]` e `[client]` de um arquivo de opções. Para informações sobre arquivos de opções usados por programas MySQL, consulte a Seção 6.2.2.2, “Usando Arquivos de Opções”.

**Tabela 6.16 Opções `mysqlslap`**

<table>
   <thead>
      <tr>
         <th>Nome da Opção</th>
         <th>Descrição</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td><code>--auto-generate-sql</code></td>
         <td>Gerar declarações SQL automaticamente quando não forem fornecidas em arquivos ou usando opções de comando</td>
      </tr>
      <tr>
         <td><code>--auto-generate-sql-add-autoincrement</code></td>
         <td>Adicionar uma chave primária com base em GUID para tabelas geradas automaticamente</td>
      </tr>
      <tr>
         <td><code>--auto-generate-sql-execute-number</code></td>
         <td>Especificar quantas consultas devem ser geradas automaticamente</td>
      </tr>
      <tr>
         <td><code>--auto-generate-sql-guid-primary</code></td>
         <td>Adicionar uma chave primária baseada em GUID para tabelas geradas automaticamente</td>
      </tr>
      <tr>
         <td><code>--auto-generate-sql-load-type</code></td>
         <td>Especificar o tipo de carga de teste</td>
      </tr>
      <tr>
         <td><code>--auto-generate-sql-secondary-indexes</code></td>
         <td>Especificar quantas índices secundários devem ser adicionados às tabelas geradas automaticamente</td>
      </tr>
      <tr>
         <td><code>--auto-generate-sql-unique-query-number</code></td>
         <td>Quantas consultas diferentes devem ser geradas para testes automáticos</td>
      </tr>
      <tr>
         <td><code>--auto-generate-sql-unique-write-number</code></td>
         <td>Quantas consultas diferentes devem ser geradas para <code>--auto-generate-sql-write-number</code></td>
      </tr>
      <tr>
         <td><code>--auto-generate-sql-write-number</code></td>
         <td>Quantas inserções de linha devem ser realizadas em cada thread</td>
      </tr>
      <tr>
         <td><code>--commit</code></td>
         <td>Quantas declarações devem ser executadas antes do commit</td>
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
         <td><code>--concurrency</code></td>
         <td>Número de clientes a serem simulados ao emitir a declaração <code>SELECT</code></td>
      </tr>
      <tr>
         <td><code>--create</code></td>
         <td>Arquivo ou string contendo a declaração a ser usada para criar a tabela</td>
      </tr>
      <tr>
         <td><code>--create-schema</code></td>
         <td>Schema em que os testes devem ser executados</td>
      </tr>
      <tr>
         <td><code>--csv</code></td>
         <td>Gerar saída no formato de valores separados por vírgula</td>
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
         <td>Imprimir estatísticas de memória e CPU quando o programa sair</td>
      </tr>
      <tr>
         <td><code>--default-auth</code></td>
         <td>Plugin de autenticação a ser usado</td>
      </tr>
      <tr>
         <td><code>--defaults-extra-file</code></td>
         <td>Ler o arquivo de opções adicionais além dos arquivos de opções usuais</td>
      </tr>
      <tr>
         <td><code>--defaults-file</code></td>
         <td>Ler apenas o arquivo de opções</td>
      </tr>
      <tr>
         <td><code>--defaults-group-suffix</code></td>
         <td>Valor do sufixo do grupo de opções</td>
      </tr>
      <tr>
         <td><code>--delimiter</code></td>
         <td>Delimitador a ser usado nas declarações SQL</td>
      </tr>
      <tr>
         <td><code>--detach</code></td>
         <td>Desconectar (fechar e reabrir) cada conexão após cada <code>N</code> declarações</td>
      </tr>
      <tr>
         <td><code>--enable-cleartext-plugin</code></td>
         <td>Ativar o plugin de autenticação sem criptografia</td>
      </tr>
      <tr>
         <td><code>--engine</code></td>
         <td>Motor de armazenamento a ser usado para criar a tabela</td>
      </tr>
      <tr>
         <td><code>--get-server-public-key</code></td>
         <td>Solicitar a chave pública RSA do servidor</td>
      </tr>
      <tr>
         <td><code>--help</code></td>
         <td>Exibir mensagem de ajuda e sair</td>
      </tr>
      <tr>
         <td><code>--host</code></td>
         <td>Servidor no qual o servidor MySQL está localizado</td>
      </tr>


* `--help`, `-?`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Exibir uma mensagem de ajuda e sair.
* `--auto-generate-sql`, `-a`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Gerar declarações SQL automaticamente quando não forem fornecidas em arquivos ou usando opções de comando.
* `--auto-generate-sql-add-autoincrement`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Adicionar uma coluna `AUTO_INCREMENT` a tabelas geradas automaticamente.
* `--auto-generate-sql-execute-number=N`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  Especificar quantas consultas devem ser geradas automaticamente.
* `--auto-generate-sql-guid-primary`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Adicionar uma chave primária baseada em GUID a tabelas geradas automaticamente.
* `--auto-generate-sql-load-type=type`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql-load-type=type</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td><code>mixed</code></td> </tr><tr><th>Valores válidos</th> <td><code>read</code><code>write</code><code>key</code><code>update</code><code>mixed</code></td> </tr></tbody></table>

Especifique o tipo de carga de teste. Os valores permitidos são `read` (escanear tabelas), `write` (inserir em tabelas), `key` (ler chaves primárias), `update` (atualizar chaves primárias) ou `mixed` (metade de inserções, metade de seleções de varredura). O valor padrão é `mixed`.
*  `--auto-generate-sql-secondary-indexes=N`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql-secondary-indexes=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>0</code></td> </tr></tbody></table>

  Especifique quantos índices secundários adicionar aos tabelas geradas automaticamente. Por padrão, nenhum é adicionado.
*  `--auto-generate-sql-unique-query-number=N`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql-unique-query-number=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>10</code></td> </tr></tbody></table>

  Quantas consultas diferentes gerar para testes automáticos. Por exemplo, se você executar um teste `key` que realiza 1000 seleções, você pode usar essa opção com um valor de 1000 para executar 1000 consultas únicas, ou com um valor de 50 para realizar 50 seleções diferentes. O valor padrão é 10.
*  `--auto-generate-sql-unique-write-number=N`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql-unique-write-number=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>10</code></td> </tr></tbody></table>

  Quantas consultas diferentes gerar para `--auto-generate-sql-write-number`. O valor padrão é 10.
*  `--auto-generate-sql-write-number=N`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-sql-write-number=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>100</code></td> </tr></tbody></table>

  Quantas inserções de linha realizar. O valor padrão é 100.
*  `--commit=N`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--commit=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>0</code></td> </tr></tbody></table>

  Quantas instruções executar antes de comprometer. O valor padrão é 0 (nenhuma comissão é feita).
*  `--compress`, `-C`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Compressar todas as informações enviadas entre o cliente e o servidor, se possível. Veja a Seção 6.2.8, “Controle de compressão de conexão”.

  Esta opção está desatualizada. Espera-se que seja removida em uma versão futura do MySQL. Veja Configurando a compressão de conexão legada.
*  `--compression-algorithms=value`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--compression-algorithms=value</code></td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td><code>uncompressed</code></td> </tr><tr><th>Valores válidos</th> <td><code>zlib</code><code>zstd</code><code>uncompressed</code></td> </tr></tbody></table>

  Os algoritmos de compressão permitidos para conexões com o servidor. Os algoritmos disponíveis são os mesmos da variável de sistema `protocol_compression_algorithms`. O valor padrão é `uncompressed`.

  Para mais informações, veja a Seção 6.2.8, “Controle de compressão de conexão”.
*  `--concurrency=N`, `-c N`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--concurrency=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  O número de clientes paralelos a serem simulados.
*  `--create=value`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--create=value</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O arquivo ou a string contendo a instrução a ser usada para criar a tabela.
*  `--create-schema=value`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--create-schema=valor</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O esquema no qual os testes serão executados.

  ::: info Nota

  Se a opção `--auto-generate-sql` também for fornecida, o `mysqlslap` excluirá o esquema no final da execução do teste. Para evitar isso, use também a opção `--no-drop`.

  :::

*  `--csv[=nome_do_arquivo]`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--csv=[arquivo]</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Gerar saída no formato de valores separados por vírgula. A saída vai para o arquivo nomeado ou para a saída padrão se nenhum arquivo for fornecido.
*  `--debug[=opções_de_depuração]`, `-# [opções_de_depuração]`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--debug[=opções_de_depuração]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>d:t:o,/tmp/mysqlslap.trace</code></td> </tr></tbody></table>

  Escrever um log de depuração. Uma string típica de `opções_de_depuração` é `d:t:o,nome_do_arquivo`. O padrão é `d:t:o,/tmp/mysqlslap.trace`.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.
*  `--debug-check`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--debug-check</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Imprimir algumas informações de depuração quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.
*  `--debug-info`, `-T`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--debug-info</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

Imprima informações de depuração e estatísticas de uso de memória e CPU quando o programa sair.

Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.
*  `--default-auth=plugin`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Uma dica sobre qual plugin de autenticação do lado do cliente usar. Consulte  Seção 8.2.17, “Autenticação Personalizável”.
*  `--defaults-extra-file=file_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-extra-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Leia este arquivo de opção após o arquivo de opção global, mas (no Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opção, consulte  Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opção”.
*  `--defaults-file=file_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Exceção: Mesmo com `--defaults-file`, os programas cliente leem `.mylogin.cnf`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opção, consulte  Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opção”.
*  `--defaults-group-suffix=str`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-group-suffix=str</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, `mysqlslap` normalmente lê os grupos `[client]` e `[mysqlslap]` . Se esta opção for dada como `--defaults-group-suffix=_other`, `mysqlslap` também lê os grupos `[client_other]` e `[mysqlslap_other]` .

Para informações adicionais sobre isso e outras opções de arquivo de opção, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opção”.
*  `--delimiter=str`, `-F str`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--delimiter=str</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O delimitador a ser usado em declarações SQL fornecidas em arquivos ou usando opções de comando.
*  `--detach=N`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--detach=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>0</code></td> </tr></tbody></table>

  Desvincule (abra e feche) cada conexão após cada *`N`* declarações. O valor padrão é 0 (as conexões não são desconectadas).
*  `--enable-cleartext-plugin`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Ative o plugin de autenticação de texto claro `mysql_clear_password` (consulte a Seção 8.4.1.4, “Autenticação de texto claro plugável do lado do cliente”).
*  `--engine=engine_name`, `-e engine_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--engine=engine_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O motor de armazenamento a ser usado para criar tabelas.
*  `--get-server-public-key`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr></tbody></table>

Solicitar à servidor a chave pública RSA que ele usa para a troca de senhas baseada em pares de chaves. Esta opção se aplica a clientes que se conectam ao servidor usando uma conta que autentica com o plugin de autenticação `caching_sha2_password`. Para conexões por tais contas, o servidor não envia a chave pública ao cliente a menos que seja solicitado. A opção é ignorada para contas que não autenticam com esse plugin. Também é ignorada se a troca de senha baseada em RSA não for necessária, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

Para informações sobre o plugin `caching_sha2_password`, consulte a Seção 8.4.1.2, “Caching SHA-2 Pluggable Authentication”.*  `--host=host_name`, `-h host_name`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--host=host_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>localhost</code></td> </tr></tbody></table>

Conectar-se ao servidor MySQL no host fornecido.*  `--iterations=N`, `-i N`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--iterations=#</code></td> </tr><tr><th>Tipo</th> <td>Numeric</td> </tr></tbody></table>

O número de vezes que os testes serão executados.*  `--login-path=name`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--login-path=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

Ler opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contêm opções que especificam para qual servidor MySQL se conectar e com qual conta se autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário `mysql_config_editor`. Veja a Seção 6.6.7, “mysql_config_editor — Utilitário de Configuração MySQL”.

Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opções”.
*  `--no-login-paths`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--no-login-paths</code></td> </tr></tbody></table>

  Ignora a leitura de opções do arquivo de caminho de login.

  Consulte `--login-path` para informações relacionadas.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opções”.
*  `--no-drop`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--no-drop</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Impedir que o `mysqlslap` elimine qualquer esquema criado durante a execução do teste.
*  `--no-defaults`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--no-defaults</code></td> </tr></tbody></table>

  Não leia nenhum arquivo de opções. Se o programa falhar ao iniciar devido à leitura de opções desconhecidas de um arquivo de opções, o `--no-defaults` pode ser usado para impedir que sejam lidas.

  A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário `mysql_config_editor`. Consulte a Seção 6.6.7, “mysql_config_editor — Utilitário de configuração do MySQL”.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opções”.
*  `--number-char-cols=N`, `-x N`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--number-char-cols=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  O número de colunas `VARCHAR` a serem usadas se `--auto-generate-sql` for especificado.
*  `--number-int-cols=N`, `-y N`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--number-int-cols=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  O número de colunas `INT` (`INTEGER`, `INT`, `SMALLINT`, `TINYINT`, `MEDIUMINT`, `BIGINT`) a serem usadas se `--auto-generate-sql` for especificado.
*  `--number-of-queries=N`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--number-of-queries=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  Limitar cada cliente a aproximadamente essa quantidade de consultas. O contagem de consultas leva em consideração o delimitador da instrução. Por exemplo, se você invocar o `mysqlslap` da seguinte forma, o delimitador `;` é reconhecido para que cada instância da string de consulta seja contada como duas consultas. Como resultado, 5 linhas (e não 10) são inseridas.

  ```
  mysqlslap --delimiter=";" --number-of-queries=10
            --query="use test;insert into t values(null)"
  ```
*  `--only-print`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--only-print</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Não se conectar aos bancos de dados. O `mysqlslap` apenas imprime o que teria feito.
*  `--password[=password]`, `-p[password]`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--password[=password]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o `mysqlslap` solicitará uma. Se for fornecido, não pode haver *espaço* entre `--password=` ou `-p` e a senha que o segue. Se nenhuma opção de senha for especificada, o padrão é não enviar a senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opções. Veja a Seção 8.1.2.1, “Diretrizes do Usuário Final para Segurança da Senha”.

Para especificar explicitamente que não há senha e que o `mysqlslap` não deve solicitar uma senha, use a opção `--skip-password`.
* `--password1[=pass_val]`

  A senha para o fator de autenticação multifator 1 da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o `mysqlslap` solicitará uma senha. Se for fornecido, não deve haver *espaço* entre `--password1=` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar a senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opções. Veja a Seção 8.1.2.1, “Diretrizes do Usuário Final para Segurança de Senhas”.

  Para especificar explicitamente que não há senha e que o `mysqlslap` não deve solicitar uma senha, use a opção `--skip-password1`.

   `--password1` e `--password` são sinônimos, assim como `--skip-password1` e `--skip-password`.
* `--password2[=pass_val]`

  A senha para o fator de autenticação multifator 2 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica da opção `--password1`; consulte a descrição dessa opção para detalhes.
* `--password3[=pass_val]`

  A senha para o fator de autenticação multifator 3 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica da opção `--password1`; consulte a descrição dessa opção para detalhes.
* `--pipe`, `-W`

  <table><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--pipe</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

No Windows, conecte-se ao servidor usando um tubo nomeado. Esta opção só se aplica se o servidor tiver sido iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por tubo nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.
*  `--plugin-dir=dir_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--plugin-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome de diretório</td> </tr></tbody></table>

  O diretório onde procurar por plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o `mysqlslap` não o encontrar.
*  `--port=port_num`, `-P port_num`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--port=port_num</code></td> </tr><tr><th>Tipo</th> <td>Número</td> </tr><tr><th>Valor padrão</th> <td><code>3306</code></td> </tr></tbody></table>

  Para conexões TCP/IP, o número de porta a ser usado.
*  `--post-query=value`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--post-query=value</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O arquivo ou string contendo a instrução a ser executada após a conclusão dos testes. Esta execução não é contada para fins de temporização.
*  `--post-system=str`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--post-system=str</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  A string a ser executada usando `system()` após a conclusão dos testes. Esta execução não é contada para fins de temporização.
*  `--pre-query=value`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--pre-query=value</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O arquivo ou string contendo a instrução a ser executada antes de executar os testes. Esta execução não é contada para fins de temporização.
*  `--pre-system=str`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--pre-system=str</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  A string a ser executada usando `system()` antes de executar os testes. Essa execução não é contabilizada para fins de temporização.
*  `--print-defaults`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--print-defaults</code></td> </tr></tbody></table>

  Imprima o nome do programa e todas as opções que ele obtém de arquivos de opções.

  Para obter informações adicionais sobre essa e outras opções de arquivos de opções, consulte a Seção 6.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opções”.
*  `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--protocol=type</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[ver texto]</code></td> </tr><tr><th>Valores Válidos</th> <td><code>TCP</code><code>SOCKET</code><code>PIPE</code><code>MEMORY</code></td> </tr></tbody></table>

  O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de um protocolo diferente do que você deseja. Para detalhes sobre os valores permitidos, consulte a Seção 6.2.7, “Protocolos de Transporte de Conexão”.
*  `--query=value`, `-q value`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--query=value</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O arquivo ou string contendo a instrução `SELECT` a ser usada para recuperar dados.
*  `--server-public-key-path=file_name`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--server-public-key-path=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

O nome do caminho de um arquivo no formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senhas baseada em pares de chaves RSA. Esta opção aplica-se a clientes que autenticam-se com o plugin de autenticação `sha256_password` (desatualizado) ou `caching_sha2_password`. Esta opção é ignorada para contas que não autenticam-se com um desses plugins. Também é ignorada se a troca de senhas baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

Para `sha256_password` (desatualizado), esta opção aplica-se apenas se o MySQL foi compilado usando OpenSSL.

Para informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 8.4.1.3, “Autenticação Personalizável SHA-256”, e a Seção 8.4.1.2, “Autenticação Personalizável SHA-2”.
*  `--shared-memory-base-name=name`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--shared-memory-base-name=name</code></td> </tr><tr><th>Plataforma Específica</th> <td>Windows</td> </tr></tbody></table>

  Em Windows, o nome do compartilhamento de memória a ser usado para conexões feitas usando compartilhamento de memória para um servidor local. O valor padrão é `MYSQL`. O nome do compartilhamento de memória é case-sensitive.

  Esta opção aplica-se apenas se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de compartilhamento de memória.
*  `--silent`, `-s`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--silent</code></td> </tr></tbody></table>

  Modo silencioso. Sem saída.
*  `--socket=path`, `-S path`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--socket={file_name|pipe_name}</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Para conexões com `localhost`, o arquivo de socket Unix a ser usado, ou, em Windows, o nome do pipe nomeado a ser usado.

Em Windows, essa opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por named pipe. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.
* `--sql-mode=mode`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--sql-mode=mode</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Defina o modo SQL para a sessão do cliente.
* `--ssl*`

  Opções que começam com `--ssl` especificam se a conexão com o servidor deve ser feita usando criptografia e indicam onde encontrar as chaves e certificados SSL. Veja Opções de comando para conexões criptografadas.
* `--ssl-fips-mode={OFF|ON|STRICT}`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--ssl-fips-mode={OFF|ON|STRICT}</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr><tr><th>Valores válidos</th> <td><code>OFF</code><code>ON</code><code>STRICT</code></td> </tr></tbody></table>

  Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere de outras opções `--ssl-xxx` porque não é usada para estabelecer conexões criptografadas, mas sim para afetar quais operações criptográficas devem ser permitidas. Veja Seção 8.8, “Suporte FIPS”.

  Esses valores de `--ssl-fips-mode` são permitidos:

  + `OFF`: Desabilitar o modo FIPS.
  + `ON`: Habilitar o modo FIPS.
  + `STRICT`: Habilitar o modo FIPS “estricto”.
  
  ::: info Nota

  Se o Módulo de Objeto FIPS OpenSSL não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Nesse caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente produza uma mensagem de aviso no início e opere no modo não FIPS.

  :::

  Esta opção está desatualizada. Espere que ela seja removida em uma versão futura do MySQL.
* `--tls-ciphersuites=ciphersuite_list`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--tls-ciphersuites=lista_de_cifra_suíte</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  As suíte de cifras permitidas para conexões criptografadas que utilizam TLSv1.3. O valor é uma lista de um ou mais nomes de suíte de cifra separados por vírgula. As suíte de cifra que podem ser nomeadas para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para obter detalhes, consulte a Seção 8.3.2, “Protocolos e cifras TLS de Conexão Criptografada”.
*  `--tls-sni-servername=nome_do_servidor`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--tls-sni-servername=nome_do_servidor</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Quando especificado, o nome é passado para a biblioteca de API C `libmysqlclient` usando a opção `MYSQL_OPT_TLS_SNI_SERVERNAME` de `mysql_options()`. O nome do servidor não é case-sensitive. Para mostrar qual nome do servidor o cliente especificou para a sessão atual, se houver, verifique a variável `Tls_sni_server_name`.

  A Indicação de Nome do Servidor (SNI) é uma extensão do protocolo TLS (o OpenSSL deve ser compilado com extensões TLS para que esta opção funcione). A implementação do MySQL do SNI representa apenas o lado do cliente.
*  `--tls-version=lista_de_protocolos`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--tls-version=lista_de_protocolos</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>TLSv1,TLSv1.1,TLSv1.2,TLSv1.3</code> (OpenSSL 1.1.1 ou superior)<code>TLSv1,TLSv1.1,TLSv1.2</code> (caso contrário)</td> </tr></tbody></table>

  Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolo separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para obter detalhes, consulte a Seção 8.3.2, “Protocolos e cifras TLS de Conexão Criptografada”.
*  `--user=nome_do_usuário`, `-u nome_do_usuário`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--user=nome_do_usuário,</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O nome do usuário da conta MySQL a ser usado para se conectar ao servidor.
*  `--verbose`, `-v`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--verbose</code></td> </tr></tbody></table>

  Modo verbose. Imprima mais informações sobre o que o programa faz. Esta opção pode ser usada várias vezes para aumentar a quantidade de informações.
*  `--version`, `-V`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--version</code></td> </tr></tbody></table>

  Exibir informações da versão e sair.
*  `--zstd-compression-level=level`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--zstd-compression-level=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr></tbody></table>

  O nível de compressão a ser usado para conexões ao servidor que utilizam o algoritmo de compressão `zstd`. Os níveis permitidos são de 1 a 22, com valores maiores indicando níveis crescentes de compressão. O nível de compressão padrão é 3. O ajuste do nível de compressão não tem efeito em conexões que não utilizam compressão `zstd`.

Para mais informações, consulte a Seção 6.2.8, “Controle de compressão de conexão”.