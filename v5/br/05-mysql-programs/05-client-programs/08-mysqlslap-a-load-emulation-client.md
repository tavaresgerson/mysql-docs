### 4.5.8 mysqlslap — Um cliente de emulação de carga

O **mysqlslap** é um programa de diagnóstico projetado para emular a carga de clientes para um servidor MySQL e para relatar o tempo de cada etapa. Ele funciona como se vários clientes estivessem acessando o servidor.

Invoque o **mysqlslap** da seguinte forma:

```sql
mysqlslap [options]
```

Algumas opções, como `--create` ou `--query`, permitem que você especifique uma string contendo uma instrução SQL ou um arquivo contendo instruções. Se você especificar um arquivo, por padrão, ele deve conter uma instrução por linha. (Ou seja, o delimitador de instrução implícito é o caractere de nova linha.) Use a opção `--delimiter` para especificar um delimitador diferente, o que permite especificar instruções que se estendem por várias linhas ou colocar várias instruções em uma única linha. Você não pode incluir comentários em um arquivo; o **mysqlslap** não os entende.

O **mysqlslap** funciona em três etapas:

1. Crie o esquema, a tabela e, opcionalmente, quaisquer programas ou dados armazenados para uso no teste. Esta etapa utiliza uma única conexão com o cliente.

2. Execute o teste de carga. Esta etapa pode usar muitas conexões de clientes.

3. Limpe (desconecte, descarte a tabela, se especificada). Esta etapa utiliza uma única conexão com o cliente.

Exemplos:

Forneça suas próprias instruções SQL de criação e consulta, com 50 clientes realizando consultas e 200 seleções para cada uma (insira o comando em uma única linha):

```sql
mysqlslap --delimiter=";"
  --create="CREATE TABLE a (b int);INSERT INTO a VALUES (23)"
  --query="SELECT * FROM a" --concurrency=50 --iterations=200
```

Deixe o **mysqlslap** criar a instrução SQL da consulta com uma tabela com duas colunas `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") e três colunas `VARCHAR`. Use cinco clientes fazendo consultas 20 vezes cada. Não crie a tabela nem insira os dados (ou seja, use o esquema e os dados do teste anterior):

```sql
mysqlslap --concurrency=5 --iterations=20
  --number-int-cols=2 --number-char-cols=3
  --auto-generate-sql
```

Informe ao programa para carregar as instruções SQL de criação, inserção e consulta dos arquivos especificados, onde o arquivo `create.sql` tem múltiplas declarações de criação de tabelas delimitadas por `;'` e múltiplas declarações de inserção delimitadas por `;`. O arquivo `--query` tem múltiplas consultas delimitadas por `;`. Execute todas as declarações de carregamento, depois execute todas as consultas no arquivo de consulta com cinco clientes (cinco vezes cada):

```sql
mysqlslap --concurrency=5
  --iterations=5 --query=query.sql --create=create.sql
  --delimiter=";"
```

O **mysqlslap** suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysqlslap]` e `[client]` de um arquivo de opções. Para obter informações sobre os arquivos de opções usados pelos programas MySQL, consulte a Seção 4.2.2.2, “Usando arquivos de opções”.

**Tabela 4.20 Opções mysqlslap**

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para mysqlslap."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Nome da Opção</th> <th scope="col">Descrição</th> <th scope="col">Introduzido</th> <th scope="col">Desatualizado</th> </tr></thead><tbody><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_auto-generate-sql">--auto-gerar-sql</a></th> <td>Gerar instruções SQL automaticamente quando elas não são fornecidas em arquivos ou usando opções de comando</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_auto-generate-sql-add-autoincrement">--auto-gerar-sql-adicionar-autoincremento</a></th> <td>Adicione a coluna AUTO_INCREMENT às tabelas geradas automaticamente</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_auto-generate-sql-execute-number">--auto-gerar-sql-execute-número</a></th> <td>Especifique quantos pedidos devem ser gerados automaticamente</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_auto-generate-sql-guid-primary">--auto-gerar-sql-guid-primary</a></th> <td>Adicione uma chave primária baseada em GUID a tabelas geradas automaticamente</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_auto-generate-sql-load-type">--auto-gerar-tipo-de-carga-sql</a></th> <td>Especifique o tipo de carga de teste</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_auto-generate-sql-secondary-indexes">--auto-gerar-sql-índices-secundários</a></th> <td>Especifique quantos índices secundários serão adicionados às tabelas geradas automaticamente</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_auto-generate-sql-unique-query-number">--auto-gerar-sql-número-de-consulta-único</a></th> <td>Quantas consultas diferentes devem ser geradas para testes automáticos?</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_auto-generate-sql-unique-write-number">--auto-gerar-sql-número-único-de-escrita</a></th> <td>Quantas consultas diferentes para gerar para --auto-generate-sql-write-number?</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_auto-generate-sql-write-number">--auto-gerar-sql-escrever-número</a></th> <td>Quantas inserções de linha devem ser realizadas em cada fio</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_commit">--commit</a></th> <td>Quantas declarações executar antes de comprometer</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_compress">--compress</a></th> <td>Compressar todas as informações enviadas entre o cliente e o servidor</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_concurrency">--concorrência</a></th> <td>Número de clientes a serem simulados ao emitir a instrução SELECT</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_create">--criar</a></th> <td>Arquivo ou cadeia de caracteres contendo a declaração a ser usada para criar a tabela</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_create-schema">--create-schema</a></th> <td>Esquema para executar os testes</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_csv">--csv</a></th> <td>Gerar a saída no formato de valores separados por vírgula</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_debug">--debug</a></th> <td>Escreva o log de depuração</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_debug-check">--debug-check</a></th> <td>Imprimir informações de depuração quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_debug-info">--debug-info</a></th> <td>Imprimir informações de depuração, memória e estatísticas da CPU quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_default-auth">--default-auth</a></th> <td>Plugin de autenticação a ser usado</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_defaults-extra-file">--defaults-extra-file</a></th> <td>Leia o arquivo de opção nomeado, além dos arquivos de opção usuais</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_defaults-file">--defaults-file</a></th> <td>Arquivo de opção de leitura apenas nomeado</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_defaults-group-suffix">--defaults-group-suffix</a></th> <td>Valor do sufixo do grupo de opções</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_delimiter">--delimiter</a></th> <td>Separador a ser usado em declarações SQL</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_detach">--detach</a></th> <td>Desconecte (feche e reabra) cada conexão após cada N de declarações</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_enable-cleartext-plugin">--enable-cleartext-plugin</a></th> <td>Habilitar o plugin de autenticação em texto claro</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_engine">--motor</a></th> <td>Motor de armazenamento a ser usado para criar a tabela</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_get-server-public-key">--get-server-public-key</a></th> <td>Solicitar chave pública RSA do servidor</td> <td>5.7.23</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_help">--help</a></th> <td>Exibir mensagem de ajuda e sair</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_host">--host</a></th> <td>Anfitrião no qual o servidor MySQL está localizado</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_iterations">--iterações</a></th> <td>Número de vezes para executar os testes</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_login-path">--login-path</a></th> <td>Leia as opções de caminho de login a partir de .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_no-defaults">--no-defaults</a></th> <td>Não ler arquivos de opção</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_no-drop">--no-drop</a></th> <td>Não descarte nenhum esquema criado durante a execução do teste</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_number-char-cols">--número-de-colunas-de-caracteres</a></th> <td>Número de colunas VARCHAR a serem usadas se --auto-generate-sql for especificado</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_number-int-cols">--número-int-cols</a></th> <td>Número de colunas INT a serem usadas se --auto-generate-sql for especificado</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_number-of-queries">--número-de-consultas</a></th> <td>Limite cada cliente a aproximadamente esse número de consultas</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_only-print">--only-print</a></th> <td>Não conecte-se aos bancos de dados. O mysqlslap só imprime o que teria feito</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_password">--senha</a></th> <td>Senha para usar ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_pipe">--pipe</a></th> <td>Conecte-se ao servidor usando o pipe nomeado (apenas Windows)</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_plugin-dir">--plugin-dir</a></th> <td>Diretório onde os plugins são instalados</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_port">--port</a></th> <td>Número de porta TCP/IP para a conexão</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_post-query">--post-query</a></th> <td>Arquivo ou cadeia de caracteres contendo a declaração a ser executada após a conclusão dos testes</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_post-system">--post-system</a></th> <td>String para executar usando system() após os testes terem sido concluídos</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_pre-query">--pre-query</a></th> <td>Arquivo ou cadeia de caracteres contendo a declaração a ser executada antes de executar os testes</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_pre-system">--pre-sistema</a></th> <td>String a ser executada usando system() antes de executar os testes</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_print-defaults">--print-defaults</a></th> <td>Opções padrão de impressão</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_protocol">--protocolo</a></th> <td>Protocolo de transporte a ser utilizado</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_query">--query</a></th> <td>Arquivo ou string contendo a instrução SELECT a ser usada para recuperar dados</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_secure-auth">--secure-auth</a></th> <td>Não envie senhas para o servidor no formato antigo (pré-4.1)</td> <td></td> <td>Sim</td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_server-public-key-path">--server-public-key-path</a></th> <td>Nome do caminho para o arquivo que contém a chave pública RSA</td> <td>5.7.23</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_shared-memory-base-name">--shared-memory-base-name</a></th> <td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_silent">--silencioso</a></th> <td>Modo silencioso</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_socket">--socket</a></th> <td>Arquivo de soquete Unix ou tubo nomeado do Windows a ser usado</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_sql-mode">--sql-mode</a></th> <td>Definir o modo SQL para a sessão do cliente</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_ssl">--ssl</a></th> <td>Ative a criptografia de conexão</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_ssl">--ssl-ca</a></th> <td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_ssl">--ssl-capath</a></th> <td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_ssl">--ssl-cert</a></th> <td>Arquivo que contém o certificado X.509</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_ssl">--ssl-cipher</a></th> <td>Cifras permitidas para criptografia de conexão</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_ssl">--ssl-crl</a></th> <td>Arquivo que contém listas de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_ssl">--ssl-crlpath</a></th> <td>Diretório que contém arquivos de lista de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_ssl">--ssl-chave</a></th> <td>Arquivo que contém a chave X.509</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_ssl">--ssl-mode</a></th> <td>Estado de segurança desejado da conexão com o servidor</td> <td>5.7.11</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_ssl">--ssl-verify-server-cert</a></th> <td>Verifique o nome do host contra a identidade do Nome comum do certificado do servidor</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_tls-version">--tls-version</a></th> <td>Protocolos TLS permitidos para conexões criptografadas</td> <td>5.7.10</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_user">--user</a></th> <td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_verbose">--verbose</a></th> <td>Modo verbosos</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_version">--version</a></th> <td>Exibir informações da versão e sair</td> <td></td> <td></td> </tr></tbody></table>

- `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  Exiba uma mensagem de ajuda e saia.

- `--auto-generate-sql`, `-a`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>

  Gerar instruções SQL automaticamente quando elas não são fornecidas em arquivos ou usando opções de comando.

- `--auto-generate-sql-add-autoincrement`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-add-autoincrement"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-add-autoincrement</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>

  Adicione uma coluna `AUTO_INCREMENT` às tabelas geradas automaticamente.

- `--auto-generate-sql-execute-number=N`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-execute-número"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-execute-number=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  Especifique quantos pedidos devem ser gerados automaticamente.

- `--auto-generate-sql-guid-primary`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-guid-primary"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-guid-primary</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>

  Adicione uma chave primária baseada em GUID às tabelas geradas automaticamente.

- `--auto-generate-sql-load-type=tipo`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-load-type"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-load-type=type</code>]]</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>mixed</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>read</code>]]</p><p class="valid-value">[[<code>write</code>]]</p><p class="valid-value">[[<code>key</code>]]</p><p class="valid-value">[[<code>update</code>]]</p><p class="valid-value">[[<code>mixed</code>]]</p></td> </tr></tbody></table>

  Especifique o tipo de carga de teste. Os valores permitidos são `read` (escanear tabelas), `write` (inserir em tabelas), `key` (ler chaves primárias), `update` (atualizar chaves primárias) ou `mixed` (metade de inserções, metade de seleções de varredura). O padrão é `mixed`.

- `--auto-generate-sql-secondary-indexes=N`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-secondary-indexes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-secondary-indexes=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr></tbody></table>

  Especifique quantos índices secundários serão adicionados às tabelas geradas automaticamente. Por padrão, nenhum é adicionado.

- `--auto-generate-sql-unique-query-number=N`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-número-de-consulta-único"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-unique-query-number=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>10</code>]]</td> </tr></tbody></table>

  Quantas consultas diferentes você deseja gerar para testes automáticos. Por exemplo, se você executar um teste `chave` que realiza 1000 seleções, você pode usar essa opção com um valor de 1000 para executar 1000 consultas únicas, ou com um valor de 50 para realizar 50 seleções diferentes. O valor padrão é 10.

- `--auto-generate-sql-unique-write-number=N`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-número-único-de-escrita"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-unique-write-number=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>10</code>]]</td> </tr></tbody></table>

  Quantas consultas diferentes devem ser geradas para `--auto-generate-sql-write-number`. O padrão é 10.

- `--auto-generate-sql-write-number=N`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>0

  Quantas inserções de linha devem ser realizadas. O padrão é 100.

- `--commit=N`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>1

  Quantas declarações executar antes de comprometer. O padrão é 0 (nenhuma comissão é feita).

- `--compress`, `-C`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>2

  Compressa todas as informações enviadas entre o cliente e o servidor, se possível. Consulte a Seção 4.2.6, “Controle de Compressão de Conexão”.

- `--concurrency=N`, `-c N`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>3

  O número de clientes paralelos a serem simulados.

- `--create=valor`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>4

  O arquivo ou a cadeia de caracteres que contém a declaração a ser usada para criar a tabela.

- `--create-schema=valor`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>5

  O esquema no qual os testes serão executados.

  Nota

  Se a opção `--auto-generate-sql` também for fornecida, o **mysqlslap** exclui o esquema no final da execução do teste. Para evitar isso, use também a opção `--no-drop`.

- `--csv[=nome_do_arquivo]`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>6

  Gerar a saída no formato de valores separados por vírgula. A saída vai para o arquivo nomeado ou para a saída padrão se nenhum arquivo for fornecido.

- `--debug[=opções_de_depuração]`, `-# [opções_de_depuração]`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>7

  Escreva um log de depuração. Uma string típica de *`debug_options`* é `d:t:o,nome_do_arquivo`. O padrão é `d:t:o,/tmp/mysqlslap.trace`.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.

- `--debug-check`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>8

  Imprima algumas informações de depuração quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.

- `--debug-info`, `-T`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>9

  Imprima informações de depuração, estatísticas de uso de memória e CPU quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.

- `--default-auth=plugin`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>0

  Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Veja a Seção 6.2.13, “Autenticação Personalizável”.

- `--defaults-extra-file=nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>1

  Leia este arquivo de opção após o arquivo de opção global, mas (no Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--defaults-file=nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>2

  Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou estiver inacessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Exceção: Mesmo com `--defaults-file`, os programas cliente leem `.mylogin.cnf`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>3

  Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, **mysqlslap** normalmente lê os grupos `[client]` e `[mysqlslap]`. Se esta opção for dada como `--defaults-group-suffix=_other`, **mysqlslap** também lê os grupos `[client_other]` e `[mysqlslap_other]`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--delimiter=str`, `-F str`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>4

  O delimitador a ser usado em declarações SQL fornecidas em arquivos ou usando opções de comando.

- `--detach=N`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>5

  Desconecte (feche e reabra) cada conexão após cada declaração *`N`*. O padrão é 0 (as conexões não são desconectadas).

- `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>6

  Ative o plugin de autenticação de texto claro `mysql_clear_password`. (Consulte a Seção 6.4.1.6, “Autenticação Pluggable de Texto Claro no Cliente”.)

- `--engine=engine_name`, `-e engine_name`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>7

  O mecanismo de armazenamento a ser usado para criar tabelas.

- `--get-server-public-key`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>8

  Peça à rede o par de chaves RSA que ela usa para a troca de senhas baseada em pares de chaves. Esta opção se aplica a clientes que se conectam à rede usando uma conta que autentica com o plugin de autenticação `caching_sha2_password`. Para conexões por contas desse tipo, a rede não envia a chave pública ao cliente, a menos que seja solicitado. A opção é ignorada para contas que não autenticam com esse plugin. Também é ignorada se a troca de senha baseada em RSA não for necessária, como é o caso quando o cliente se conecta à rede usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

  Para obter informações sobre o plugin `caching_sha2_password`, consulte a Seção 6.4.1.4, “Cacheamento de Autenticação Conectada SHA-2”.

  A opção `--get-server-public-key` foi adicionada no MySQL 5.7.23.

- `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>9

  Conecte-se ao servidor MySQL no host fornecido.

- `--iterations=N`, `-i N`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-add-autoincrement"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-add-autoincrement</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>0

  O número de vezes que os testes devem ser executados.

- `--login-path=nome`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-add-autoincrement"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-add-autoincrement</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>1

  Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam qual servidor MySQL conectar e qual conta autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql\_config\_editor**. Veja a Seção 4.6.6, “mysql\_config\_editor — Utilitário de Configuração MySQL”.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--no-drop`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-add-autoincrement"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-add-autoincrement</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>2

  Impedir que o **mysqlslap** elimine qualquer esquema criado durante a execução do teste.

- `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-add-autoincrement"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-add-autoincrement</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>3

  Não leia nenhum arquivo de opções. Se a inicialização do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, o `--no-defaults` pode ser usado para impedir que sejam lidas.

  A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se ele existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql\_config\_editor**. Veja a Seção 4.6.6, “mysql\_config\_editor — Ferramenta de Configuração do MySQL”.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--number-char-cols=N`, `-x N`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-add-autoincrement"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-add-autoincrement</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>4

  O número de colunas `VARCHAR` a serem usadas se `--auto-generate-sql` for especificado.

- `--number-int-cols=N`, `-y N`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-add-autoincrement"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-add-autoincrement</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>5

  O número de colunas `INT` (INTEIRO), INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") a serem usadas se `--auto-generate-sql` for especificado.

- `--número-de-consultas=N`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-add-autoincrement"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-add-autoincrement</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>6

  Limite cada cliente a aproximadamente esse número de consultas. O contagem de consultas leva em consideração o delimitador da declaração. Por exemplo, se você invocar **mysqlslap** da seguinte forma, o delimitador `;` é reconhecido para que cada instância da string de consulta seja contada como duas consultas. Como resultado, 5 linhas (e não 10) são inseridas.

  ```sql
  mysqlslap --delimiter=";" --number-of-queries=10
            --query="use test;insert into t values(null)"
  ```

- `--only-print`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-add-autoincrement"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-add-autoincrement</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>7

  Não conecte-se aos bancos de dados. O **mysqlslap** apenas imprime o que teria feito.

- `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-add-autoincrement"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-add-autoincrement</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>8

  A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysqlslap** solicitará uma senha. Se for fornecida, não deve haver **espaço** entre `--password=` ou `-p` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar a senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Consulte a Seção 6.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

  Para especificar explicitamente que não há senha e que o **mysqlslap** não deve solicitar uma senha, use a opção `--skip-password`.

- `--pipe`, `-W`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-add-autoincrement"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-add-autoincrement</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>9

  No Windows, conecte-se ao servidor usando um tubo nomeado. Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por tubo nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

- `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-execute-número"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-execute-number=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>0

  O diretório onde procurar por plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o **mysqlslap** não encontrá-lo. Veja a Seção 6.2.13, “Autenticação Personalizável”.

- `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-execute-número"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-execute-number=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>1

  Para conexões TCP/IP, o número de porta a ser usado.

- `--post-query=valor`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-execute-número"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-execute-number=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>2

  O arquivo ou a cadeia de caracteres que contém a instrução a ser executada após a conclusão dos testes. Essa execução não é contabilizada para fins de cronometragem.

- `--post-system=str`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-execute-número"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-execute-number=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>3

  A cadeia de caracteres a ser executada usando `system()` após a conclusão dos testes. Essa execução não é contabilizada para fins de cronometragem.

- `--pre-query=valor`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-execute-número"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-execute-number=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>4

  O arquivo ou a cadeia de caracteres que contém a instrução a ser executada antes de executar os testes. Essa execução não é contabilizada para fins de cronometragem.

- `--pre-system=str`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-execute-número"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-execute-number=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>5

  A cadeia de caracteres a ser executada usando `system()` antes de executar os testes. Essa execução não é contabilizada para fins de cronometragem.

- `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-execute-número"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-execute-number=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>6

  Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-execute-número"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-execute-number=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>7

  O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de um protocolo diferente do que você deseja. Para obter detalhes sobre os valores permitidos, consulte a Seção 4.2.5, “Protocolos de Transporte de Conexão”.

- `--query=valor`, `-q valor`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-execute-número"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-execute-number=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>8

  O arquivo ou a cadeia de caracteres que contém a instrução `SELECT` a ser usada para recuperar dados.

- `--secure-auth`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-execute-número"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-execute-number=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>9

  Não envie senhas para o servidor no formato antigo (pré-4.1). Isso impede conexões, exceto para servidores que usam o formato de senha mais recente.

  A partir do MySQL 5.7.5, essa opção é desaconselhada; espere-se que ela seja removida em uma futura versão do MySQL. Ela está sempre habilitada e tentar desabilitá-la (`--skip-secure-auth`, `--secure-auth=0`) produz um erro. Antes do MySQL 5.7.5, essa opção está habilitada por padrão, mas pode ser desabilitada.

  Nota

  Senhas que usam o método de hashing pré-4.1 são menos seguras do que senhas que usam o método de hashing de senha nativo e devem ser evitadas. Senhas pré-4.1 são desaconselhadas e o suporte para elas foi removido no MySQL 5.7.5. Para instruções de atualização de conta, consulte a Seção 6.4.1.3, “Migrando para fora do hashing de senha pré-4.1 e do plugin mysql\_old\_password”.

- `--server-public-key-path=nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-guid-primary"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-guid-primary</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>0

  O nome do caminho de um arquivo no formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senhas com par de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

  Para `sha256_password`, essa opção só se aplica se o MySQL foi construído usando o OpenSSL.

  Para obter informações sobre os módulos `sha256_password` e `caching_sha2_password`, consulte a Seção 6.4.1.5, “Autenticação com Pluggable SHA-256” e a Seção 6.4.1.4, “Cache de Autenticação com Pluggable SHA-2”.

  A opção `--server-public-key-path` foi adicionada no MySQL 5.7.23.

- `--shared-memory-base-name=nome`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-guid-primary"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-guid-primary</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>1

  Em Windows, o nome de memória compartilhada a ser usado para conexões feitas usando memória compartilhada com um servidor local. O valor padrão é `MYSQL`. O nome de memória compartilhada é case-sensitive.

  Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

- `--silent`, `-s`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-guid-primary"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-guid-primary</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>2

  Modo silencioso. Sem saída.

- `--socket=caminho`, `-S caminho`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-guid-primary"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-guid-primary</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>3

  Para conexões ao `localhost`, o arquivo de socket Unix a ser usado ou, no Windows, o nome do tubo nomeado a ser usado.

  No Windows, essa opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por named pipe. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

- `--sql-mode=mode`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-guid-primary"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-guid-primary</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>4

  Defina o modo SQL para a sessão do cliente.

- `--ssl*`

  As opções que começam com `--ssl` especificam se você deseja se conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Consulte Opções de comando para conexões criptografadas.

- `--tls-version=lista_protocolos`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-guid-primary"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-guid-primary</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>5

  Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolos separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para obter detalhes, consulte a Seção 6.3.2, “Protocolos e cifra TLS de conexão criptografada”.

  Essa opção foi adicionada no MySQL 5.7.10.

- `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-guid-primary"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-guid-primary</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>6

  O nome de usuário da conta MySQL a ser usado para se conectar ao servidor.

- `--verbose`, `-v`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-guid-primary"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-guid-primary</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>7

  Modo verbose. Imprima mais informações sobre o que o programa faz. Esta opção pode ser usada várias vezes para aumentar a quantidade de informações.

- `--version`, `-V`

  <table frame="box" rules="all" summary="Propriedades para auto-gerar-sql-guid-primary"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-generate-sql-guid-primary</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>8

  Exibir informações da versão e sair.
