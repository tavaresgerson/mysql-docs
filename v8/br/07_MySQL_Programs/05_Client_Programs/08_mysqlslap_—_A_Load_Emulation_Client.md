### 6.5.8 mysqlslap — Um cliente de emulação de carga

O **mysqlslap** é um programa de diagnóstico projetado para emular a carga de clientes para um servidor MySQL e para relatar o tempo de cada etapa. Ele funciona como se vários clientes estivessem acessando o servidor.

Invoque o **mysqlslap** da seguinte forma:

```
mysqlslap [options]
```

Algumas opções, como `--create` ou `--query`, permitem que você especifique uma string contendo uma instrução SQL ou um arquivo contendo instruções. Se você especificar um arquivo, por padrão, ele deve conter uma instrução por linha. (Ou seja, o delimitador de instrução implícito é o caractere de nova linha.) Use a opção `--delimiter` para especificar um delimitador diferente, o que permite especificar instruções que se estendem por várias linhas ou colocar várias instruções em uma única linha. Você não pode incluir comentários em um arquivo; o **mysqlslap** não os entende.

O **mysqlslap** funciona em três etapas:

1. Crie o esquema, a tabela e, opcionalmente, quaisquer programas ou dados armazenados para uso no teste. Esta etapa utiliza uma única conexão com o cliente.

2. Execute o teste de carga. Esta etapa pode usar muitas conexões de clientes.

3. Limpe (desconecte, descarte a tabela, se especificada). Esta etapa utiliza uma única conexão com o cliente.

Exemplos:

Forneça suas próprias instruções SQL de criação e consulta, com 50 clientes realizando consultas e 200 seleções para cada uma (insira o comando em uma única linha):

```
mysqlslap --delimiter=";"
  --create="CREATE TABLE a (b int);INSERT INTO a VALUES (23)"
  --query="SELECT * FROM a" --concurrency=50 --iterations=200
```

Deixe o **mysqlslap** criar a instrução SQL da consulta com uma tabela de duas colunas `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") e três colunas `VARCHAR`. Use cinco clientes fazendo consultas 20 vezes cada. Não crie a tabela nem insira os dados (ou seja, use o esquema e os dados do teste anterior):

```
mysqlslap --concurrency=5 --iterations=20
  --number-int-cols=2 --number-char-cols=3
  --auto-generate-sql
```

Informe ao programa para carregar as instruções SQL de criação, inserção e consulta dos arquivos especificados, onde o arquivo `create.sql` tem múltiplas instruções de criação de tabelas delimitadas por `';'` e múltiplas instruções de inserção delimitadas por `';'`. O arquivo `--query` deve conter múltiplas consultas delimitadas por `';'`. Execute todas as instruções de carregamento, depois execute todas as consultas no arquivo de consulta com cinco clientes (cinco vezes cada):

```
mysqlslap --concurrency=5
  --iterations=5 --query=query.sql --create=create.sql
  --delimiter=";"
```

O **mysqlslap** suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysqlslap]` e `[client]` de um arquivo de opções. Para obter informações sobre os arquivos de opções usados pelos programas do MySQL, consulte a Seção 6.2.2.2, “Usando arquivos de opções”.

**Tabela 6.19 Opções mysqlslap**

<table summary="Opções de linha de comando disponíveis para mysqlslap."><thead><tr><th scope="col">Nome da Opção</th> <th scope="col">Descrição</th> <th scope="col">Introduzido</th> <th scope="col">Desatualizado</th> </tr></thead><tbody><tr><th>--auto-gerar-sql</th> <td>Gerar instruções SQL automaticamente quando elas não são fornecidas em arquivos ou usando opções de comando</td> <td></td> <td></td> </tr><tr><th>--auto-gerar-sql-adicionar-autoincremento</th> <td>Adicione a coluna AUTO_INCREMENT às tabelas geradas automaticamente</td> <td></td> <td></td> </tr><tr><th>--auto-gerar-sql-execute-número</th> <td>Especifique quantos pedidos devem ser gerados automaticamente</td> <td></td> <td></td> </tr><tr><th>--auto-gerar-sql-guid-primary</th> <td>Adicione uma chave primária baseada em GUID a tabelas geradas automaticamente</td> <td></td> <td></td> </tr><tr><th>--auto-gerar-tipo-de-carga-sql</th> <td>Especifique o tipo de carga de teste</td> <td></td> <td></td> </tr><tr><th>--auto-gerar-sql-índices-secundários</th> <td>Especifique quantos índices secundários serão adicionados às tabelas geradas automaticamente</td> <td></td> <td></td> </tr><tr><th>--auto-gerar-sql-número-de-consulta-único</th> <td>Quantas consultas diferentes devem ser geradas para testes automáticos?</td> <td></td> <td></td> </tr><tr><th>--auto-gerar-sql-número-único-de-escrita</th> <td>Quantas consultas diferentes para gerar para --auto-generate-sql-write-number?</td> <td></td> <td></td> </tr><tr><th>--auto-gerar-sql-escrever-número</th> <td>Quantas inserções de linha devem ser realizadas em cada fio</td> <td></td> <td></td> </tr><tr><th>--commit</th> <td>Quantas declarações executar antes de comprometer</td> <td></td> <td></td> </tr><tr><th>--compress</th> <td>Compressar todas as informações enviadas entre o cliente e o servidor</td> <td></td> <td>8.0.18</td> </tr><tr><th>--algoritmos de compressão</th> <td>Algoritmos de compressão permitidos para conexões com o servidor</td> <td>8.0.18</td> <td></td> </tr><tr><th>--concorrência</th> <td>Número de clientes a serem simulados ao emitir a instrução SELECT</td> <td></td> <td></td> </tr><tr><th>--criar</th> <td>Arquivo ou cadeia de caracteres contendo a declaração a ser usada para criar a tabela</td> <td></td> <td></td> </tr><tr><th>--create-schema</th> <td>Esquema para executar os testes</td> <td></td> <td></td> </tr><tr><th>--csv</th> <td>Gerar a saída no formato de valores separados por vírgula</td> <td></td> <td></td> </tr><tr><th>--debug</th> <td>Escreva o log de depuração</td> <td></td> <td></td> </tr><tr><th>--debug-check</th> <td>Imprimir informações de depuração quando o programa sai</td> <td></td> <td></td> </tr><tr><th>--debug-info</th> <td>Imprimir informações de depuração, memória e estatísticas da CPU quando o programa sai</td> <td></td> <td></td> </tr><tr><th>--default-auth</th> <td>Plugin de autenticação a ser usado</td> <td></td> <td></td> </tr><tr><th>--defaults-extra-file</th> <td>Leia o arquivo de opção nomeado, além dos arquivos de opção usuais</td> <td></td> <td></td> </tr><tr><th>--defaults-file</th> <td>Arquivo de opção de leitura apenas nomeado</td> <td></td> <td></td> </tr><tr><th>--defaults-group-suffix</th> <td>Valor do sufixo do grupo de opções</td> <td></td> <td></td> </tr><tr><th>--delimiter</th> <td>Separador a ser usado em declarações SQL</td> <td></td> <td></td> </tr><tr><th>--detach</th> <td>Desconecte (feche e reabra) cada conexão após cada N de declarações</td> <td></td> <td></td> </tr><tr><th>--enable-cleartext-plugin</th> <td>Habilitar o plugin de autenticação em texto claro</td> <td></td> <td></td> </tr><tr><th>--motor</th> <td>Motor de armazenamento a ser usado para criar a tabela</td> <td></td> <td></td> </tr><tr><th>--get-server-public-key</th> <td>Solicitar chave pública RSA do servidor</td> <td></td> <td></td> </tr><tr><th>--help</th> <td>Exibir mensagem de ajuda e sair</td> <td></td> <td></td> </tr><tr><th>--host</th> <td>Anfitrião no qual o servidor MySQL está localizado</td> <td></td> <td></td> </tr><tr><th>--iterações</th> <td>Número de vezes para executar os testes</td> <td></td> <td></td> </tr><tr><th>--login-path</th> <td>Leia as opções de caminho de login a partir de .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th>--no-defaults</th> <td>Não ler arquivos de opção</td> <td></td> <td></td> </tr><tr><th>--no-drop</th> <td>Não descarte nenhum esquema criado durante a execução do teste</td> <td></td> <td></td> </tr><tr><th>--número-de-colunas-de-caracteres</th> <td>Número de colunas VARCHAR a serem usadas se --auto-generate-sql for especificado</td> <td></td> <td></td> </tr><tr><th>--número-int-cols</th> <td>Número de colunas INT a serem usadas se --auto-generate-sql for especificado</td> <td></td> <td></td> </tr><tr><th>--número-de-consultas</th> <td>Limite cada cliente a aproximadamente esse número de consultas</td> <td></td> <td></td> </tr><tr><th>--only-print</th> <td>Não conecte-se aos bancos de dados. O mysqlslap só imprime o que teria feito</td> <td></td> <td></td> </tr><tr><th>--senha</th> <td>Senha para usar ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th>--senha1</th> <td>Primeira senha de autenticação multifator a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th>--senha2</th> <td>Segunda senha de autenticação multifator a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th>--senha3</th> <td>Terceira senha de autenticação multifator a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th>--pipe</th> <td>Conecte-se ao servidor usando o pipe nomeado (apenas Windows)</td> <td></td> <td></td> </tr><tr><th>--plugin-dir</th> <td>Diretório onde os plugins são instalados</td> <td></td> <td></td> </tr><tr><th>--port</th> <td>Número de porta TCP/IP para a conexão</td> <td></td> <td></td> </tr><tr><th>--post-query</th> <td>Arquivo ou cadeia de caracteres contendo a declaração a ser executada após a conclusão dos testes</td> <td></td> <td></td> </tr><tr><th>--post-system</th> <td>String para executar usando system() após os testes terem sido concluídos</td> <td></td> <td></td> </tr><tr><th>--pre-query</th> <td>Arquivo ou cadeia de caracteres contendo a declaração a ser executada antes de executar os testes</td> <td></td> <td></td> </tr><tr><th>--pre-sistema</th> <td>String a ser executada usando system() antes de executar os testes</td> <td></td> <td></td> </tr><tr><th>--print-defaults</th> <td>Opções padrão de impressão</td> <td></td> <td></td> </tr><tr><th>--protocolo</th> <td>Protocolo de transporte a ser utilizado</td> <td></td> <td></td> </tr><tr><th>--query</th> <td>Arquivo ou string contendo a instrução SELECT a ser usada para recuperar dados</td> <td></td> <td></td> </tr><tr><th>--server-public-key-path</th> <td>Nome do caminho para o arquivo que contém a chave pública RSA</td> <td></td> <td></td> </tr><tr><th>--shared-memory-base-name</th> <td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td> <td></td> <td></td> </tr><tr><th>--silencioso</th> <td>Modo silencioso</td> <td></td> <td></td> </tr><tr><th>--socket</th> <td>Arquivo de soquete Unix ou tubo nomeado do Windows a ser usado</td> <td></td> <td></td> </tr><tr><th>--sql-mode</th> <td>Definir o modo SQL para a sessão do cliente</td> <td></td> <td></td> </tr><tr><th>--ssl-ca</th> <td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th>--ssl-capath</th> <td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th>--ssl-cert</th> <td>Arquivo que contém o certificado X.509</td> <td></td> <td></td> </tr><tr><th>--ssl-cipher</th> <td>Cifras permitidas para criptografia de conexão</td> <td></td> <td></td> </tr><tr><th>--ssl-crl</th> <td>Arquivo que contém listas de revogação de certificados</td> <td></td> <td></td> </tr><tr><th>--ssl-crlpath</th> <td>Diretório que contém arquivos de lista de revogação de certificados</td> <td></td> <td></td> </tr><tr><th>--ssl-fips-mode</th> <td>Se deve habilitar o modo FIPS no lado do cliente</td> <td></td> <td>8.0.34</td> </tr><tr><th>--ssl-chave</th> <td>Arquivo que contém a chave X.509</td> <td></td> <td></td> </tr><tr><th>--ssl-mode</th> <td>Estado de segurança desejado da conexão com o servidor</td> <td></td> <td></td> </tr><tr><th>--ssl-session-data</th> <td>Arquivo que contém dados da sessão SSL</td> <td>8.0.29</td> <td></td> </tr><tr><th>--ssl-session-data-continue-on-failed-reuse</th> <td>Se estabelecer conexões se a reutilização da sessão falhar</td> <td>8.0.29</td> <td></td> </tr><tr><th>--tls-ciphersuites</th> <td>Cifras TLSv1.3 permitidas para conexões criptografadas</td> <td>8.0.16</td> <td></td> </tr><tr><th>--tls-version</th> <td>Protocolos TLS permitidos para conexões criptografadas</td> <td></td> <td></td> </tr><tr><th>--user</th> <td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th>--verbose</th> <td>Modo verbosos</td> <td></td> <td></td> </tr><tr><th>--version</th> <td>Exibir informações da versão e sair</td> <td></td> <td></td> </tr><tr><th>--zstd-compression-level</th> <td>Nível de compressão para conexões com servidores que utilizam compressão zstd</td> <td>8.0.18</td> <td></td> </tr></tbody></table>

- `--help`, `-?`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  Exiba uma mensagem de ajuda e saia.

- `--auto-generate-sql`, `-a`

  <table summary="Propriedades para auto-gerar-sql"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>

  Gerar instruções SQL automaticamente quando elas não são fornecidas em arquivos ou usando opções de comando.

- `--auto-generate-sql-add-autoincrement`

  <table summary="Propriedades para auto-gerar-sql-add-autoincrement"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-add-autoincrement</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>

  Adicione uma coluna `AUTO_INCREMENT` às tabelas geradas automaticamente.

- `--auto-generate-sql-execute-number=N`

  <table summary="Propriedades para auto-gerar-sql-execute-número"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-execute-number=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  Especifique quantos pedidos devem ser gerados automaticamente.

- `--auto-generate-sql-guid-primary`

  <table summary="Propriedades para auto-gerar-sql-guid-primary"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-guid-primary</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>

  Adicione uma chave primária baseada em GUID às tabelas geradas automaticamente.

- `--auto-generate-sql-load-type=type`

  <table summary="Propriedades para auto-gerar-sql-load-type"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-load-type=type</code>]]</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>mixed</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>read</code>]]</p><p class="valid-value">[[<code>write</code>]]</p><p class="valid-value">[[<code>key</code>]]</p><p class="valid-value">[[<code>update</code>]]</p><p class="valid-value">[[<code>mixed</code>]]</p></td> </tr></tbody></table>

  Especifique o tipo de carga de teste. Os valores permitidos são `read` (tabelas de varredura), `write` (inserir em tabelas), `key` (ler chaves primárias), `update` (atualizar chaves primárias) ou `mixed` (meias inserções, seleções de varredura). O padrão é `mixed`.

- `--auto-generate-sql-secondary-indexes=N`

  <table summary="Propriedades para auto-gerar-sql-secondary-indexes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-secondary-indexes=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr></tbody></table>

  Especifique quantos índices secundários serão adicionados às tabelas geradas automaticamente. Por padrão, nenhum é adicionado.

- `--auto-generate-sql-unique-query-number=N`

  <table summary="Propriedades para auto-gerar-sql-número-de-consulta-único"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-unique-query-number=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>10</code>]]</td> </tr></tbody></table>

  Quantas consultas diferentes você deseja gerar para testes automáticos. Por exemplo, se você executar um teste `key` que realiza 1000 seleções, você pode usar essa opção com um valor de 1000 para executar 1000 consultas únicas, ou com um valor de 50 para realizar 50 seleções diferentes. O valor padrão é 10.

- `--auto-generate-sql-unique-write-number=N`

  <table summary="Propriedades para auto-gerar-sql-número-único-de-escrita"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-unique-write-number=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>10</code>]]</td> </tr></tbody></table>

  Quantas consultas diferentes para gerar para `--auto-generate-sql-write-number`. O padrão é 10.

- `--auto-generate-sql-write-number=N`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>0

  Quantas inserções de linha devem ser realizadas. O padrão é 100.

- `--commit=N`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>1

  Quantas declarações executar antes de comprometer. O padrão é 0 (nenhuma comissão é feita).

- `--compress`, `-C`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>2

  Compressa todas as informações enviadas entre o cliente e o servidor, se possível. Consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

  A partir do MySQL 8.0.18, essa opção está desatualizada. Espere que ela seja removida em uma versão futura do MySQL. Consulte Configurando a Compressão de Conexão Legado.

- `--compression-algorithms=value`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>3

  Os algoritmos de compressão permitidos para conexões ao servidor. Os algoritmos disponíveis são os mesmos da variável de sistema `protocol_compression_algorithms`. O valor padrão é `uncompressed`.

  Para obter mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

  Essa opção foi adicionada no MySQL 8.0.18.

- `--concurrency=N`, `-c N`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>4

  O número de clientes paralelos a serem simulados.

- `--create=value`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>5

  O arquivo ou a cadeia de caracteres que contém a declaração a ser usada para criar a tabela.

- `--create-schema=value`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>6

  O esquema no qual os testes serão executados.

  Nota

  Se a opção `--auto-generate-sql` também for fornecida, o **mysqlslap** exclui o esquema no final da execução do teste. Para evitar isso, use também a opção `--no-drop`.

- `--csv[=file_name]`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>7

  Gerar a saída no formato de valores separados por vírgula. A saída vai para o arquivo nomeado ou para a saída padrão se nenhum arquivo for fornecido.

- `--debug[=debug_options]`, `-# [debug_options]`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>8

  Escreva um log de depuração. Uma string típica `debug_options` é `d:t:o,file_name`. O padrão é `d:t:o,/tmp/mysqlslap.trace`.

  Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

- `--debug-check`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>9

  Imprima algumas informações de depuração quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

- `--debug-info`, `-T`

  <table summary="Propriedades para auto-gerar-sql"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>0

  Imprima informações de depuração, estatísticas de uso de memória e CPU quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

- `--default-auth=plugin`

  <table summary="Propriedades para auto-gerar-sql"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>1

  Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Veja a Seção 8.2.17, “Autenticação Personalizável”.

- `--defaults-extra-file=file_name`

  <table summary="Propriedades para auto-gerar-sql"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>2

  Leia este arquivo de opção após o arquivo de opção global, mas (no Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se `file_name` não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--defaults-file=file_name`

  <table summary="Propriedades para auto-gerar-sql"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>3

  Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou estiver inacessível, ocorrerá um erro. Se `file_name` não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Exceção: Mesmo com `--defaults-file`, os programas de cliente leem `.mylogin.cnf`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--defaults-group-suffix=str`

  <table summary="Propriedades para auto-gerar-sql"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>4

  Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de `str`. Por exemplo, **mysqlslap** normalmente lê os grupos `[client]` e `[mysqlslap]`. Se esta opção for dada como `--defaults-group-suffix=_other`, **mysqlslap** também lê os grupos `[client_other]` e `[mysqlslap_other]`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--delimiter=str`, `-F str`

  <table summary="Propriedades para auto-gerar-sql"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>5

  O delimitador a ser usado em declarações SQL fornecidas em arquivos ou usando opções de comando.

- `--detach=N`

  <table summary="Propriedades para auto-gerar-sql"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>6

  Desconecte (feche e reabra) cada conexão após cada declaração `N`. O padrão é 0 (as conexões não são desconectadas).

- `--enable-cleartext-plugin`

  <table summary="Propriedades para auto-gerar-sql"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>7

  Ative o plugin de autenticação de texto claro `mysql_clear_password`. (Consulte a Seção 8.4.1.4, “Autenticação Pluggable de Texto Claro do Cliente”).

- `--engine=engine_name`, `-e engine_name`

  <table summary="Propriedades para auto-gerar-sql"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>8

  O mecanismo de armazenamento a ser usado para criar tabelas.

- `--get-server-public-key`

  <table summary="Propriedades para auto-gerar-sql"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>9

  Peça à rede o par de chaves RSA que ela usa para a troca de senhas baseada em pares de chaves. Esta opção se aplica a clientes que se conectam à rede usando uma conta que autentica com o plugin de autenticação `caching_sha2_password`. Para conexões por contas que não autenticam com esse plugin, o servidor não envia a chave pública para o cliente, a menos que seja solicitado. A opção é ignorada para contas que não autenticam com esse plugin. Também é ignorada se a troca de senha baseada em RSA não for necessária, como é o caso quando o cliente se conecta à rede usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

  Para obter informações sobre o plugin `caching_sha2_password`, consulte a Seção 8.4.1.2, “Cacheamento de Autenticação Conectada a SHA-2”.

- `--host=host_name`, `-h host_name`

  <table summary="Propriedades para auto-gerar-sql-add-autoincrement"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-add-autoincrement</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>0

  Conecte-se ao servidor MySQL no host fornecido.

- `--iterations=N`, `-i N`

  <table summary="Propriedades para auto-gerar-sql-add-autoincrement"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-add-autoincrement</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>1

  O número de vezes que os testes devem ser executados.

- `--login-path=name`

  <table summary="Propriedades para auto-gerar-sql-add-autoincrement"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-add-autoincrement</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>2

  Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam para qual servidor MySQL se conectar e qual conta autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql\_config\_editor**. Veja a Seção 6.6.7, “mysql\_config\_editor — Utilitário de Configuração MySQL”.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--no-drop`

  <table summary="Propriedades para auto-gerar-sql-add-autoincrement"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-add-autoincrement</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>3

  Impedir que o **mysqlslap** elimine qualquer esquema criado durante a execução do teste.

- `--no-defaults`

  <table summary="Propriedades para auto-gerar-sql-add-autoincrement"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-add-autoincrement</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>4

  Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para impedir que sejam lidas.

  A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar o `.mylogin.cnf`, use o utilitário **mysql\_config\_editor**. Veja a Seção 6.6.7, “mysql\_config\_editor — Utilitário de Configuração do MySQL”.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--number-char-cols=N`, `-x N`

  <table summary="Propriedades para auto-gerar-sql-add-autoincrement"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-add-autoincrement</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>5

  O número de colunas `VARCHAR` a serem usadas se `--auto-generate-sql` for especificado.

- `--number-int-cols=N`, `-y N`

  <table summary="Propriedades para auto-gerar-sql-add-autoincrement"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-add-autoincrement</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>6

  O número de colunas `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") a serem usadas se `--auto-generate-sql` for especificado.

- `--number-of-queries=N`

  <table summary="Propriedades para auto-gerar-sql-add-autoincrement"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-add-autoincrement</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>7

  Limite cada cliente a aproximadamente esse número de consultas. O contagem de consultas leva em consideração o delimitador da declaração. Por exemplo, se você invocar o **mysqlslap** da seguinte forma, o delimitador `;` é reconhecido, de modo que cada instância da string de consulta é contada como duas consultas. Como resultado, 5 linhas (e não 10) são inseridas.

  ```
  mysqlslap --delimiter=";" --number-of-queries=10
            --query="use test;insert into t values(null)"
  ```

- `--only-print`

  <table summary="Propriedades para auto-gerar-sql-add-autoincrement"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-add-autoincrement</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>8

  Não conecte-se aos bancos de dados. O **mysqlslap** apenas imprime o que teria feito.

- `--password[=password]`, `-p[password]`

  <table summary="Propriedades para auto-gerar-sql-add-autoincrement"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-add-autoincrement</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>9

  A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysqlslap** solicitará uma senha. Se for fornecida, não deve haver **espaço** entre `--password=` ou `-p` e a senha que o segue. Se nenhuma opção de senha for especificada, o padrão é não enviar a senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Consulte a Seção 8.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

  Para especificar explicitamente que não há senha e que o **mysqlslap** não deve solicitar uma senha, use a opção `--skip-password`.

- `--password1[=pass_val]`

  A senha para o fator de autenticação multifator 1 da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysqlslap** solicitará uma senha. Se for fornecida, não deve haver **espaço** entre `--password1=` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar nenhuma senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Consulte a Seção 8.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

  Para especificar explicitamente que não há senha e que o **mysqlslap** não deve solicitar uma senha, use a opção `--skip-password1`.

  `--password1` e `--password` são sinônimos, assim como `--skip-password1` e `--skip-password`.

- `--password2[=pass_val]`

  A senha para o fator de autenticação multifator 2 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica do `--password1`; consulte a descrição dessa opção para obter detalhes.

- `--password3[=pass_val]`

  A senha para o fator de autenticação multifator 3 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica do `--password1`; consulte a descrição dessa opção para obter detalhes.

- `--pipe`, `-W`

  <table summary="Propriedades para auto-gerar-sql-execute-número"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-execute-number=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>0

  No Windows, conecte-se ao servidor usando um tubo nomeado. Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por tubo nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

- `--plugin-dir=dir_name`

  <table summary="Propriedades para auto-gerar-sql-execute-número"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-execute-number=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>1

  O diretório onde procurar por plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o **mysqlslap** não encontrá-lo. Veja a Seção 8.2.17, “Autenticação Personalizável”.

- `--port=port_num`, `-P port_num`

  <table summary="Propriedades para auto-gerar-sql-execute-número"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-execute-number=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>2

  Para conexões TCP/IP, o número de porta a ser usado.

- `--post-query=value`

  <table summary="Propriedades para auto-gerar-sql-execute-número"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-execute-number=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>3

  O arquivo ou a cadeia de caracteres que contém a instrução a ser executada após a conclusão dos testes. Essa execução não é contabilizada para fins de cronometragem.

- `--post-system=str`

  <table summary="Propriedades para auto-gerar-sql-execute-número"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-execute-number=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>4

  A cadeia a ser executada usando `system()` após a conclusão dos testes. Essa execução não é contabilizada para fins de cronometragem.

- `--pre-query=value`

  <table summary="Propriedades para auto-gerar-sql-execute-número"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-execute-number=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>5

  O arquivo ou a cadeia de caracteres que contém a instrução a ser executada antes de executar os testes. Essa execução não é contabilizada para fins de cronometragem.

- `--pre-system=str`

  <table summary="Propriedades para auto-gerar-sql-execute-número"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-execute-number=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>6

  A cadeia de caracteres a ser executada usando `system()` antes de executar os testes. Essa execução não é contabilizada para fins de cronometragem.

- `--print-defaults`

  <table summary="Propriedades para auto-gerar-sql-execute-número"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-execute-number=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>7

  Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table summary="Propriedades para auto-gerar-sql-execute-número"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-execute-number=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>8

  O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de um protocolo diferente do que você deseja. Para obter detalhes sobre os valores permitidos, consulte a Seção 6.2.7, “Protocolos de Transporte de Conexão”.

- `--query=value`, `-q value`

  <table summary="Propriedades para auto-gerar-sql-execute-número"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-execute-number=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>9

  O arquivo ou a cadeia de caracteres que contém a declaração `SELECT` a ser usada para recuperar dados.

- `--server-public-key-path=file_name`

  <table summary="Propriedades para auto-gerar-sql-guid-primary"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-guid-primary</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>0

  O nome do caminho de um arquivo no formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senhas com par de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

  Para `sha256_password`, esta opção só se aplica se o MySQL foi construído usando o OpenSSL.

  Para obter informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 8.4.1.3, “Autenticação Conectada a SHA-256”, e a Seção 8.4.1.2, “Cache de Autenticação Conectada a SHA-2”.

- `--shared-memory-base-name=name`

  <table summary="Propriedades para auto-gerar-sql-guid-primary"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-guid-primary</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>1

  Em Windows, o nome de memória compartilhada a ser usado para conexões feitas usando memória compartilhada para um servidor local. O valor padrão é \[\[`MYSQL`]. O nome de memória compartilhada é sensível a maiúsculas e minúsculas.

  Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

- `--silent`, `-s`

  <table summary="Propriedades para auto-gerar-sql-guid-primary"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-guid-primary</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>2

  Modo silencioso. Sem saída.

- `--socket=path`, `-S path`

  <table summary="Propriedades para auto-gerar-sql-guid-primary"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-guid-primary</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>3

  Para conexões ao `localhost`, o arquivo de socket Unix a ser usado ou, no Windows, o nome do tubo nomeado a ser usado.

  No Windows, essa opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de canal nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

- `--sql-mode=mode`

  <table summary="Propriedades para auto-gerar-sql-guid-primary"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-guid-primary</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>4

  Defina o modo SQL para a sessão do cliente.

- `--ssl*`

  As opções que começam com `--ssl` especificam se você deseja se conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Consulte Opções de comando para conexões criptografadas.

- `--ssl-fips-mode={OFF|ON|STRICT}`

  <table summary="Propriedades para auto-gerar-sql-guid-primary"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-guid-primary</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>5

  Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere de outras opções `--ssl-xxx` porque não é usada para estabelecer conexões criptografadas, mas sim para determinar quais operações criptográficas devem ser permitidas. Veja a Seção 8.8, “Suporte FIPS”.

  Estes valores `--ssl-fips-mode` são permitidos:

  - `OFF`: Desative o modo FIPS.
  - `ON`: Habilitar o modo FIPS.
  - `STRICT`: Habilitar o modo FIPS "estricto".

  Nota

  Se o Módulo de Objeto FIPS OpenSSL não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Nesse caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente emita um aviso na inicialização e opere no modo não FIPS.

  A partir do MySQL 8.0.34, essa opção está desatualizada. Espera-se que ela seja removida em uma versão futura do MySQL.

- `--tls-ciphersuites=ciphersuite_list`

  <table summary="Propriedades para auto-gerar-sql-guid-primary"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-guid-primary</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>6

  As sequências de cifra permitidas para conexões criptografadas que utilizam TLSv1.3. O valor é uma lista de um ou mais nomes de sequências de cifra separados por vírgula. As sequências de cifra que podem ser nomeadas para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para obter detalhes, consulte a Seção 8.3.2, “Protocolos e cifra de conexão criptografada TLS”.

  Essa opção foi adicionada no MySQL 8.0.16.

- `--tls-version=protocol_list`

  <table summary="Propriedades para auto-gerar-sql-guid-primary"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-guid-primary</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>7

  Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolos separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para obter detalhes, consulte a Seção 8.3.2, “Protocolos e cifra TLS de conexão criptografada”.

- `--user=user_name`, `-u user_name`

  <table summary="Propriedades para auto-gerar-sql-guid-primary"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-guid-primary</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>8

  O nome de usuário da conta MySQL a ser usado para se conectar ao servidor.

- `--verbose`, `-v`

  <table summary="Propriedades para auto-gerar-sql-guid-primary"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-guid-primary</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>9

  Modo verbose. Imprima mais informações sobre o que o programa faz. Esta opção pode ser usada várias vezes para aumentar a quantidade de informações.

- `--version`, `-V`

  <table summary="Propriedades para auto-gerar-sql-load-type"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-load-type=type</code>]]</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>mixed</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>read</code>]]</p><p class="valid-value">[[<code>write</code>]]</p><p class="valid-value">[[<code>key</code>]]</p><p class="valid-value">[[<code>update</code>]]</p><p class="valid-value">[[<code>mixed</code>]]</p></td> </tr></tbody></table>0

  Exibir informações da versão e sair.

- `--zstd-compression-level=level`

  <table summary="Propriedades para auto-gerar-sql-load-type"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-load-type=type</code>]]</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>mixed</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>read</code>]]</p><p class="valid-value">[[<code>write</code>]]</p><p class="valid-value">[[<code>key</code>]]</p><p class="valid-value">[[<code>update</code>]]</p><p class="valid-value">[[<code>mixed</code>]]</p></td> </tr></tbody></table>1

  O nível de compressão a ser usado para conexões com o servidor que utilizam o algoritmo de compressão `zstd`. Os níveis permitidos variam de 1 a 22, com valores maiores indicando níveis crescentes de compressão. O nível de compressão padrão `zstd` é 3. A configuração do nível de compressão não afeta conexões que não utilizam a compressão `zstd`.

  Para obter mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

  Essa opção foi adicionada no MySQL 8.0.18.
