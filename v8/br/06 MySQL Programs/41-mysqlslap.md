### 6.5.7 mysqlslap  Um Cliente de Emulação de Carga

**mysqlslap** é um programa de diagnóstico projetado para emular a carga do cliente para um servidor MySQL e relatar o tempo de cada estágio. Ele funciona como se vários clientes estivessem acessando o servidor.

Invocar **mysqlslap** assim:

```
mysqlslap [options]
```

Algumas opções como `--create` ou `--query` permitem especificar uma string contendo uma instrução SQL ou um arquivo contendo instruções. Se você especificar um arquivo, por padrão ele deve conter uma instrução por linha. (Ou seja, o delimitador de instrução implícito é o caractere de nova linha.) Use a opção `--delimiter` para especificar um delimitador diferente, que permite especificar instruções que abrangem várias linhas ou colocar várias instruções em uma única linha. Você não pode incluir comentários em um arquivo; **mysqlslap** não os entende.

**mysqlslap** é executado em três etapas:

1. Criar esquema, tabela e, opcionalmente, quaisquer programas ou dados armazenados para usar no teste.
2. Este estágio pode usar muitas conexões de cliente.
3. Limpeza (desconectar, soltar a tabela se especificado).

Exemplos:

Forneça suas próprias instruções SQL de criação e consulta, com 50 clientes de consulta e 200 seleções para cada um (inserir o comando em uma única linha):

```
mysqlslap --delimiter=";"
  --create="CREATE TABLE a (b int);INSERT INTO a VALUES (23)"
  --query="SELECT * FROM a" --concurrency=50 --iterations=200
```

Deixe **mysqlslap** construir a instrução SQL de consulta com uma tabela de duas colunas `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") e três colunas `VARCHAR`. Use cinco clientes fazendo consultas 20 vezes cada. Não crie a tabela nem insira os dados (ou seja, use o esquema e os dados do teste anterior):

```
mysqlslap --concurrency=5 --iterations=20
  --number-int-cols=2 --number-char-cols=3
  --auto-generate-sql
```

Diga ao programa para carregar as instruções SQL de criação, inserção e consulta dos arquivos especificados, onde o arquivo `create.sql` tem várias instruções de criação de tabela delimitadas por `';'` e várias instruções de inserção delimitadas por `';'`. O arquivo `--query` deve conter várias consultas delimitadas por `';'`. Executar todas as instruções de carregamento, em seguida, executar todas as consultas no arquivo de consulta com cinco clientes (cinco vezes cada):

```
mysqlslap --concurrency=5
  --iterations=5 --query=query.sql --create=create.sql
  --delimiter=";"
```

**mysqlslap** suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysqlslap]` e `[client]` de um arquivo de opções. Para informações sobre arquivos de opções usados por programas MySQL, consulte a Seção 6.2.2.2, Using Option Files.

**Tabela 6.16 Opções de mysqlslap**

<table><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Nome da opção</th> <th>Descrição</th> </tr></thead><tbody><tr><td>--auto-gerar-sql</td> <td>Gerar instruções SQL automaticamente quando não são fornecidas em arquivos ou usando opções de comando</td> </tr><tr><td>--auto-gerar-sql-add-autoincrement</td> <td>Adicionar a coluna AUTO_INCREMENT às tabelas geradas automaticamente</td> </tr><tr><td>--auto-gerar-sql-executar-número</td> <td>Especificar quantas consultas serão geradas automaticamente</td> </tr><tr><td>--auto-gerar-sql-guia-primário</td> <td>Adicionar uma chave primária baseada em GUID às tabelas geradas automaticamente</td> </tr><tr><td>--auto-gerar-sql-carga-tipo</td> <td>Especificar o tipo de carga de ensaio</td> </tr><tr><td>--auto-gerar-sql-índices-secundários</td> <td>Especificar quantos índices secundários adicionar às tabelas geradas automaticamente</td> </tr><tr><td>--auto-gerar-sql-número de consulta-único</td> <td>Quantas consultas diferentes gerar para testes automáticos</td> </tr><tr><td>--auto-gerar-sql-escrever-número único</td> <td>Quantas consultas diferentes para gerar para --auto-generate-sql-write-number</td> </tr><tr><td>--auto-gerar-sql-escrever-número</td> <td>Quantas inserções de linha para executar em cada thread</td> </tr><tr><td>--comprometer-se</td> <td>Quantas instruções para executar antes de cometer</td> </tr><tr><td>--comprimir</td> <td>Comprimir todas as informações enviadas entre o cliente e o servidor</td> </tr><tr><td>Algoritmos de compressão</td> <td>Algoritmos de compressão permitidos para ligações ao servidor</td> </tr><tr><td>--concurrência</td> <td>Número de clientes a simular ao emitir a instrução SELECT</td> </tr><tr><td>- Criar.</td> <td>Arquivo ou cadeia contendo a instrução a ser usada para criar a tabela</td> </tr><tr><td>- Criar esquema</td> <td>Esquema de execução dos ensaios</td> </tr><tr><td>- CSV</td> <td>Gerar saída em formato de valores separados por vírgulas</td> </tr><tr><td>--debug</td> <td>Registro de depuração</td> </tr><tr><td>--debug-check</td> <td>Imprimir informações de depuração quando o programa sair</td> </tr><tr><td>--debug-info</td> <td>Imprimir informações de depuração, memória e estatísticas da CPU quando o programa sai</td> </tr><tr><td>--default-auth</td> <td>Plugin de autenticação a usar</td> </tr><tr><td>--defaults-extra-file</td> <td>Leia arquivo de opção nomeado além dos arquivos de opção habituais</td> </tr><tr><td>--defaults-file</td> <td>Arquivo de opções nomeadas somente para leitura</td> </tr><tr><td>--defaults-group-suffix</td> <td>Valor do sufixo do grupo de opções</td> </tr><tr><td>- Delimitador</td> <td>Delimitador para usar em instruções SQL</td> </tr><tr><td>- Desligar.</td> <td>Desligar (fechar e reabrir) cada conexão após cada N declarações</td> </tr><tr><td>- Plug-in de texto claro</td> <td>Ativar o plug-in de autenticação de texto claro</td> </tr><tr><td>- motor</td> <td>Motor de armazenamento a utilizar para criar a tabela</td> </tr><tr><td>--get-server-public-key</td> <td>Solicitar a chave pública RSA do servidor</td> </tr><tr><td>- Ajuda .</td> <td>Mostrar mensagem de ajuda e sair</td> </tr><tr><td>- Hospedeiro</td> <td>Host em que o servidor MySQL está localizado</td> </tr><tr><td>- Iterações</td> <td>Número de vezes em que devem ser efectuados os ensaios</td> </tr><tr><td>--login-path</td> <td>Leia as opções de caminho de login em .mylogin.cnf</td> </tr><tr><td>- Não há padrões</td> <td>Não ler arquivos de opções</td> </tr><tr><td>- Sem gotas.</td> <td>Não deixe cair qualquer esquema criado durante a execução do teste</td> </tr><tr><td>--não-login-caminhos</td> <td>Não ler os caminhos de login no arquivo de caminho de login</td> </tr><tr><td>- Número de carros.</td> <td>Número de colunas VARCHAR a usar se --auto-generate-sql for especificado</td> </tr><tr><td>--number-int-cols</td> <td>Número de colunas INT a usar se --auto-generate-sql for especificado</td> </tr><tr><td>--número de consultas</td> <td>Limitar cada cliente a aproximadamente este número de consultas</td> </tr><tr><td>- Só para impressão.</td> <td>Não se conecte a bases de dados. mysqlslap apenas imprime o que teria feito</td> </tr><tr><td>--senha</td> <td>Senha para usar quando se conectar ao servidor</td> </tr><tr><td>- Senha 1</td> <td>Primeira senha de autenticação multifator a usar ao se conectar ao servidor</td> </tr><tr><td>- Senha 2</td> <td>Segunda senha de autenticação multifator a usar ao se conectar ao servidor</td> </tr><tr><td>- Senha 3</td> <td>Terceira senha de autenticação multifator a utilizar quando se conectar ao servidor</td> </tr><tr><td>- Tubo.</td> <td>Conectar-se ao servidor usando o nome do tubo (somente Windows)</td> </tr><tr><td>--plugin-dir</td> <td>Diretório onde os plugins estão instalados</td> </tr><tr><td>- Porto</td> <td>Número de porta TCP/IP para conexão</td> </tr><tr><td>- pós-consulta</td> <td>Arquivo ou cadeia contendo a instrução a executar após a conclusão dos testes</td> </tr><tr><td>-- pós-sistema</td> <td>Cadeia a executar utilizando sistema (s) após a conclusão dos testes</td> </tr><tr><td>-- pré-consulta</td> <td>Arquivo ou cadeia contendo a instrução a executar antes de executar os testes</td> </tr><tr><td>-- pré-sistema</td> <td>Cadeia a executar utilizando o sistema antes de executar os testes</td> </tr><tr><td>- Impressão padrão</td> <td>Opções padrão de impressão</td> </tr><tr><td>- Protocolo</td> <td>Protocolo de transporte a utilizar</td> </tr><tr><td>--query</td> <td>Arquivo ou cadeia contendo a instrução SELECT a ser usada para recuperar dados</td> </tr><tr><td>--server-chave pública-caminho</td> <td>Nome do caminho para o ficheiro que contém a chave pública RSA</td> </tr><tr><td>--shared-memory-base-name</td> <td>Nome de memória partilhada para conexões de memória partilhada (somente Windows)</td> </tr><tr><td>- Silêncio.</td> <td>Modo silencioso</td> </tr><tr><td>- Soquete</td> <td>Arquivo de soquete do Unix ou tubo nomeado do Windows para usar</td> </tr><tr><td>--sql-mode</td> <td>Configurar o modo SQL para a sessão do cliente</td> </tr><tr><td>- O quê?</td> <td>Arquivo que contém lista de autoridades de certificação SSL confiáveis</td> </tr><tr><td>--ssl-capath</td> <td>Diretório que contém ficheiros de certificados SSL confiáveis</td> </tr><tr><td>--ssl-cert</td> <td>Arquivo que contém o certificado X.509</td> </tr><tr><td>--SSL-cifrado</td> <td>Códigos permitidos para a encriptação da ligação</td> </tr><tr><td>--ssl-crl</td> <td>Arquivo que contém listas de revogação de certificados</td> </tr><tr><td>--ssl-crlpath</td> <td>Diretório que contém ficheiros de lista de revogação de certificado</td> </tr><tr><td>--ssl-fips-modo</td> <td>Ativar o modo FIPS do lado do cliente</td> </tr><tr><td>--ssl-chave</td> <td>Arquivo que contém a chave X.509</td> </tr><tr><td>- Modo SSL</td> <td>Estado de segurança desejado da ligação ao servidor</td> </tr><tr><td>--ssl-data-de-sessão</td> <td>Arquivo que contém dados de sessão SSL</td> </tr><tr><td>--ssl-session-data-continue-on-failed-reuse</td> <td>Estabelecer conexões se a reutilização da sessão falhar</td> </tr><tr><td>--tls-ciphersuites</td> <td>Suítes de encriptação TLSv1.3 permitidas para conexões criptografadas</td> </tr><tr><td>--tls-sni-nome do servidor</td> <td>Nome do servidor fornecido pelo cliente</td> </tr><tr><td>- Versão TLS</td> <td>Protocolos TLS admissíveis para ligações encriptadas</td> </tr><tr><td>-- utilizador</td> <td>Nome do usuário do MySQL para usar quando se conectar ao servidor</td> </tr><tr><td>- Verbosos.</td> <td>Modo Verbose</td> </tr><tr><td>- versão</td> <td>Informações de versão de exibição e saída</td> </tr><tr><td>--zstd-nível de compressão</td> <td>Nível de compressão para conexões com servidor que usam compressão zstd</td> </tr></tbody></table>

- `--help`, `-?`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

Mostra uma mensagem de ajuda e sai.

- `--auto-generate-sql`, `-a`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--auto-generate-sql</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>

Gerar instruções SQL automaticamente quando não são fornecidas em arquivos ou usando opções de comando.

- `--auto-generate-sql-add-autoincrement`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--auto-generate-sql-add-autoincrement</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>

Adicionar uma coluna `AUTO_INCREMENT` às tabelas geradas automaticamente.

- `--auto-generate-sql-execute-number=N`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--auto-generate-sql-execute-number=#</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr></tbody></table>

Especificar o número de consultas a gerar automaticamente.

- `--auto-generate-sql-guid-primary`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--auto-generate-sql-guid-primary</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>

Adicionar uma chave primária baseada em GUID às tabelas geradas automaticamente.

- `--auto-generate-sql-load-type=type`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--auto-generate-sql-load-type=type</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Enumeração</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>mixed</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>read</code>]]</p><p class="valid-value">[[<code>write</code>]]</p><p class="valid-value">[[<code>key</code>]]</p><p class="valid-value">[[<code>update</code>]]</p><p class="valid-value">[[<code>mixed</code>]]</p></td> </tr></tbody></table>

Especifique o tipo de carga de teste. Os valores permitidos são `read` (tabelas de varredura), `write` (inserir em tabelas), `key` (ler chaves primárias), `update` (atualizar chaves primárias), ou `mixed` (metade inserir, metade selecionar varredura). O padrão é `mixed`.

- `--auto-generate-sql-secondary-indexes=N`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--auto-generate-sql-secondary-indexes=#</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>0</code>]]</td> </tr></tbody></table>

Especifique quantos índices secundários serão adicionados às tabelas geradas automaticamente. Por padrão, nenhum será adicionado.

- `--auto-generate-sql-unique-query-number=N`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--auto-generate-sql-unique-query-number=#</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>10</code>]]</td> </tr></tbody></table>

Quantas consultas diferentes gerar para testes automáticos. Por exemplo, se você executar um teste `key` que executa 1000 seleções, você pode usar essa opção com um valor de 1000 para executar 1000 consultas únicas, ou com um valor de 50 para executar 50 seleções diferentes. O padrão é 10.

- `--auto-generate-sql-unique-write-number=N`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--auto-generate-sql-unique-write-number=#</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>10</code>]]</td> </tr></tbody></table>

Quantas consultas diferentes para gerar para \[`--auto-generate-sql-write-number`]. O padrão é 10.

- `--auto-generate-sql-write-number=N`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--auto-generate-sql-write-number=#</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>100</code>]]</td> </tr></tbody></table>

Quantas inserções de linhas para executar.

- `--commit=N`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--commit=#</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>0</code>]]</td> </tr></tbody></table>

Quantas instruções para executar antes de comprometer. O padrão é 0 (não são realizadas compromesas).

- `--compress`, `-C`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Depreciado</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Se possível, comprimir todas as informações enviadas entre o cliente e o servidor.

Esta opção está desatualizada. Espera-se que seja removida em uma versão futura do MySQL. Veja Configurar a Compressão de Conexão Legada.

- `--compression-algorithms=value`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--compression-algorithms=value</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Conjunto</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>uncompressed</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>zlib</code>]]</p><p class="valid-value">[[<code>zstd</code>]]</p><p class="valid-value">[[<code>uncompressed</code>]]</p></td> </tr></tbody></table>

Os algoritmos de compressão permitidos para conexões com o servidor. Os algoritmos disponíveis são os mesmos que para a variável do sistema `protocol_compression_algorithms`. O valor padrão é `uncompressed`.

Para mais informações, ver ponto 6.2.8, "Controlo da compressão da ligação".

- `--concurrency=N`, `-c N`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--concurrency=#</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr></tbody></table>

O número de clientes paralelos a simular.

- `--create=value`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--create=value</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

O arquivo ou cadeia contendo a instrução a ser usada para criar a tabela.

- `--create-schema=value`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--create-schema=value</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

O esquema de execução dos ensaios.

::: info Note

Se a opção `--auto-generate-sql` também for dada, **mysqlslap** solta o esquema no final da execução do teste. Para evitar isso, use a opção `--no-drop` também.

:::

- `--csv[=file_name]`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--csv=[file]</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr></tbody></table>

Gerar a saída no formato de valores separados por vírgulas. A saída vai para o arquivo nomeado, ou para a saída padrão se nenhum arquivo for fornecido.

- `--debug[=debug_options]`, `-# [debug_options]`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--debug[=debug_option<code>d:t:o,/tmp/mysqlslap.trace</code></code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>d:t:o,/tmp/mysqlslap.trace</code>]]</td> </tr></tbody></table>

Escreva um log de depuração. Uma string típica `debug_options` é `d:t:o,file_name`. O padrão é `d:t:o,/tmp/mysqlslap.trace`.

Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`.

- `--debug-check`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--debug-check</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>

Imprima algumas informações de depuração quando o programa sair.

Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`.

- `--debug-info`, `-T`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--debug-info</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>

Imprima informações de depuração e estatísticas de uso de memória e CPU quando o programa sair.

Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`.

- `--default-auth=plugin`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Uma dica sobre qual plugin de autenticação do lado do cliente usar.

- `--defaults-extra-file=file_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--defaults-extra-file=file_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr></tbody></table>

Leia este arquivo de opção após o arquivo de opção global, mas (em Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou for inacessível, ocorre um erro. Se \* `file_name` \* não for um nome de caminho absoluto, ele é interpretado em relação ao diretório atual.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--defaults-file=file_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--defaults-file=file_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr></tbody></table>

Use apenas o arquivo de opção dado. Se o arquivo não existir ou for inacessível, ocorre um erro. Se `file_name` não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Exceção: Mesmo com `--defaults-file`, os programas cliente lêem `.mylogin.cnf`.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--defaults-group-suffix=str`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--defaults-group-suffix=str</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Leia não apenas os grupos de opções usuais, mas também os grupos com os nomes usuais e um sufixo de \* `str` \*. Por exemplo, \*\* mysqlslap \*\* normalmente lê os grupos `[client]` e `[mysqlslap]` . Se esta opção for dada como `--defaults-group-suffix=_other`, \*\* mysqlslap \*\* também lê os grupos `[client_other]` e `[mysqlslap_other]`.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--delimiter=str`, `-F str`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--delimiter=str</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

O delimitador a utilizar em instruções SQL fornecidas em ficheiros ou utilizando opções de comando.

- `--detach=N`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--detach=#</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>0</code>]]</td> </tr></tbody></table>

Desligar (fechar e reabrir) cada conexão após cada instrução `N`. O padrão é 0 (as conexões não são desligadas).

- `--enable-cleartext-plugin`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--enable-cleartext-plugin</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>

Ativar o plug-in de autenticação de texto transparente `mysql_clear_password` (ver Seção 8.4.1.4, Client-Side Cleartext Pluggable Authentication.)

- `--engine=engine_name`, `-e engine_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--engine=engine_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

O motor de armazenamento para criar tabelas.

- `--get-server-public-key`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--get-server-public-key</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr></tbody></table>

Solicitar do servidor a chave pública RSA que ele usa para troca de senhas baseada em pares de chaves. Esta opção se aplica a clientes que se conectam ao servidor usando uma conta que se autentica com o plugin de autenticação `caching_sha2_password`. Para conexões por tais contas, o servidor não envia a chave pública ao cliente a menos que solicitado. A opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senhas baseada em RSA não for necessária, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` é dado e especifica um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

Para obter informações sobre o plug-in `caching_sha2_password`, consulte a Seção 8.4.1.2, Caching SHA-2 Pluggable Authentication.

- `--host=host_name`, `-h host_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--host=host_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>localhost</code>]]</td> </tr></tbody></table>

Conecte-se ao servidor MySQL no host dado.

- `--iterations=N`, `-i N`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--iterations=#</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr></tbody></table>

O número de vezes em que devem ser efectuados os testes.

- `--login-path=name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--login-path=name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Leia opções do caminho de login nomeado no arquivo de caminho de login. Um caminho de login é um grupo de opções que contém opções que especificam a qual servidor MySQL se conectar e qual conta autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql\_config\_editor**. Veja Seção 6.6.7, mysql\_config\_editor  MySQL Configuration Utility.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--no-login-paths`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--no-login-paths</code>]]</td> </tr></tbody></table>

Salta opções de leitura do arquivo de caminho de login.

Ver `--login-path` para informações relacionadas.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--no-drop`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--no-drop</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>

Impedir que **mysqlslap** deixe de usar qualquer esquema criado durante o teste.

- `--no-defaults`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--no-defaults</code>]]</td> </tr></tbody></table>

Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para impedi-las de serem lidas.

A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma forma mais segura do que na linha de comando, mesmo quando `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql\_config\_editor**. Veja Seção 6.6.7, mysql\_config\_editor  MySQL Configuration Utility.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--number-char-cols=N`, `-x N`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--number-char-cols=#</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr></tbody></table>

O número de colunas de `VARCHAR` a usar se `--auto-generate-sql` for especificado.

- `--number-int-cols=N`, `-y N`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--number-int-cols=#</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr></tbody></table>

O número de colunas "`INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") a utilizar se for especificado `--auto-generate-sql`.

- `--number-of-queries=N`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--number-of-queries=#</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr></tbody></table>

Limite cada cliente a aproximadamente este número de consultas. A contagem de consultas leva em conta o delimitador de instruções. Por exemplo, se você invocar **mysqlslap** como segue, o delimitador `;` é reconhecido de modo que cada instância da string de consulta conta como duas consultas. Como resultado, 5 linhas (não 10) são inseridas.

```
mysqlslap --delimiter=";" --number-of-queries=10
          --query="use test;insert into t values(null)"
```

- `--only-print`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--only-print</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>

Não se conecte a bases de dados. **mysqlslap** apenas imprime o que teria feito.

- `--password[=password]`, `-p[password]`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--password[=password]</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, **mysqlslap** solicita um. Se for fornecido, deve haver \* nenhum espaço \* entre `--password=` ou `-p` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar senha.

A especificação de uma senha na linha de comando deve ser considerada insegura. Para evitar a indicação da senha na linha de comando, use um arquivo de opções. Veja a Seção 8.1.2.1, "Diretrizes do Usuário Final para a Segurança de Senhas".

Para especificar explicitamente que não há senha e que **mysqlslap** não deve solicitar uma, use a opção `--skip-password`.

- `--password1[=pass_val]`

A senha para o fator de autenticação multifator 1 da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, **mysqlslap** solicita um. Se for fornecido, deve haver \* nenhum espaço \* entre `--password1=` e a senha que o segue. Se nenhuma opção de senha for especificada, o padrão é não enviar senha.

A especificação de uma senha na linha de comando deve ser considerada insegura. Para evitar a indicação da senha na linha de comando, use um arquivo de opções. Veja a Seção 8.1.2.1, "Diretrizes do Usuário Final para a Segurança de Senhas".

Para especificar explicitamente que não há senha e que **mysqlslap** não deve solicitar uma, use a opção `--skip-password1`.

`--password1` e `--password` são sinônimos, assim como `--skip-password1` e `--skip-password`.

- `--password2[=pass_val]`

A senha para o fator de autenticação multifator 2 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica de `--password1`; veja a descrição dessa opção para detalhes.

- `--password3[=pass_val]`

A senha para o fator de autenticação multifator 3 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica para `--password1`; veja a descrição dessa opção para detalhes.

- `--pipe`, `-W`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--pipe</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

No Windows, conecte-se ao servidor usando um tubo nomeado. Esta opção se aplica apenas se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de tubo nomeado. Além disso, o usuário que faz a conexão deve ser um membro do grupo Windows especificado pela variável de sistema `named_pipe_full_access_group`.

- `--plugin-dir=dir_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--plugin-dir=dir_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do diretório</td> </tr></tbody></table>

O diretório no qual procurar plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas **mysqlslap** não o encontrar. Veja Seção 8.2.17, Autenticação Pluggable.

- `--port=port_num`, `-P port_num`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--port=port_num</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>3306</code>]]</td> </tr></tbody></table>

Para as ligações TCP/IP, o número de porta a utilizar.

- `--post-query=value`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--post-query=value</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

O arquivo ou a cadeia contendo a instrução a executar após a conclusão dos testes. Esta execução não é contabilizada para efeitos de cronometragem.

- `--post-system=str`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--post-system=str</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

A sequência de comandos a ser executada usando `system()` após os testes terem sido concluídos. Esta execução não é contada para fins de cronometragem.

- `--pre-query=value`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--pre-query=value</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

O arquivo ou a cadeia contendo a instrução a executar antes de executar os testes. Esta execução não é contabilizada para efeitos de cronometragem.

- `--pre-system=str`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--pre-system=str</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

A sequência a ser executada usando `system()` antes de executar os testes. Esta execução não é contada para fins de cronometragem.

- `--print-defaults`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--print-defaults</code>]]</td> </tr></tbody></table>

Imprima o nome do programa e todas as opções que ele obtém de arquivos de opções.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--protocol=type</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>[see tex<code>TCP</code></code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>TCP</code>]]</p><p class="valid-value">[[<code>SOCKET</code>]]</p><p class="valid-value">[[<code>PIPE</code>]]</p><p class="valid-value">[[<code>MEMORY</code>]]</p></td> </tr></tbody></table>

O protocolo de transporte a utilizar para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam na utilização de um protocolo diferente daquele desejado.

- `--query=value`, `-q value`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--query=value</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

O arquivo ou cadeia contendo a instrução `SELECT` a ser usada para recuperar dados.

- `--server-public-key-path=file_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--server-public-key-path=file_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr></tbody></table>

O nome do caminho para um arquivo no formato PEM contendo uma cópia do lado do cliente da chave pública exigida pelo servidor para troca de senhas baseada em pares de chaves RSA. Esta opção se aplica a clientes que se autenticam com o plug-in de autenticação `sha256_password` (obsoleto) ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plug-ins. Também é ignorada se a troca de senhas baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` é dado e especifica um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

Para `sha256_password` (deprecated), esta opção aplica-se apenas se o MySQL foi construído usando OpenSSL.

Para obter informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 8.4.1.3, Autenticação Pluggable SHA-256, e a Seção 8.4.1.2, Cache SHA-2 Pluggable Authentication.

- `--shared-memory-base-name=name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--shared-memory-base-name=name</code>]]</td> </tr><tr><th>Específicos da plataforma</th> <td>Vidros</td> </tr></tbody></table>

No Windows, o nome de memória compartilhada a ser usado para conexões feitas usando memória compartilhada para um servidor local. O valor padrão é `MYSQL`. O nome de memória compartilhada é sensível a maiúscula e minúscula.

Esta opção aplica-se apenas se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

- `--silent`, `-s`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--silent</code>]]</td> </tr></tbody></table>

Modo silencioso, sem saída.

- `--socket=path`, `-S path`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--socket={file_name|pipe_name}</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Para conexões com `localhost`, o arquivo de soquete do Unix a ser usado, ou, no Windows, o nome do tubo nomeado a ser usado.

No Windows, essa opção se aplica apenas se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de name-pipe. Além disso, o usuário que faz a conexão deve ser um membro do grupo Windows especificado pela variável de sistema `named_pipe_full_access_group`.

- `--sql-mode=mode`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--sql-mode=mode</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Defina o modo SQL para a sessão do cliente.

- `--ssl*`

  As opções que começam com `--ssl` especificam se deve se conectar ao servidor usando criptografia e indicam onde encontrar chaves e certificados SSL. Veja Opções de comando para conexões criptografadas.
- `--ssl-fips-mode={OFF|ON|STRICT}`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--ssl-fips-mode={OFF|ON|STRICT}</code>]]</td> </tr><tr><th>Depreciado</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Enumeração</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>STRICT</code>]]</p></td> </tr></tbody></table>

Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere das outras opções `--ssl-xxx` na medida em que não é usada para estabelecer conexões criptografadas, mas sim para afetar quais operações criptográficas devem ser permitidas. Veja Seção 8.8, Suporte FIPS.

São permitidos os seguintes valores de \[`--ssl-fips-mode`]:

- `OFF`: Desativar o modo FIPS.
- `ON`: Ativar o modo FIPS.
- `STRICT`: Ativar o modo FIPS strict.

::: info Note

Se o módulo de objeto OpenSSL FIPS não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Neste caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente produza um aviso na inicialização e funcione no modo não-FIPS.

:::

Esta opção está desatualizada. Espera-se que seja removida em uma versão futura do MySQL.

- `--tls-ciphersuites=ciphersuite_list`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--tls-ciphersuites=ciphersuite_list</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Os ciphersuites permitidos para conexões criptografadas que usam TLSv1.3. O valor é uma lista de um ou mais nomes de ciphersuite separados por duas vírgulas. Os ciphersuites que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, "Protocolos e Cipheres TLS de Conexão Criptografada".

- `--tls-sni-servername=server_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--tls-sni-servername=server_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Quando especificado, o nome é passado para a biblioteca de API C `libmysqlclient` usando a opção `MYSQL_OPT_TLS_SNI_SERVERNAME` de `mysql_options()`. O nome do servidor não é sensível a maiúsculas e minúsculas. Para mostrar qual nome de servidor o cliente especificou para a sessão atual, se houver, verifique a variável de status `Tls_sni_server_name`.

O Server Name Indication (SNI) é uma extensão do protocolo TLS (o OpenSSL deve ser compilado usando extensões TLS para que esta opção funcione).

- `--tls-version=protocol_list`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--tls-version=protocol_list</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td><p class="valid-value">[[<code>TLSv1,TLSv1.1,TLSv1.2,TLSv1.3</code>]] (OpenSSL 1.1.1 ou superior)</p><p class="valid-value">[[<code>TLSv1,TLSv1.1,TLSv1.2</code>]] (caso contrário)</p></td> </tr></tbody></table>

Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolo separados por vírgulas. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, "Protocolos e cifras TLS de conexão criptografada".

- `--user=user_name`, `-u user_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--user=user_name,</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Nome do utilizador da conta MySQL a utilizar para se conectar ao servidor.

- `--verbose`, `-v`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--verbose</code>]]</td> </tr></tbody></table>

Imprima mais informações sobre o que o programa faz. Esta opção pode ser usada várias vezes para aumentar a quantidade de informações.

- `--version`, `-V`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--version</code>]]</td> </tr></tbody></table>

Informações de versão e saída.

- `--zstd-compression-level=level`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--zstd-compression-level=#</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr></tbody></table>

O nível de compressão a usar para conexões com o servidor que usam o algoritmo de compressão `zstd`. Os níveis permitidos são de 1 a 22, com valores maiores indicando níveis crescentes de compressão. O nível de compressão `zstd` padrão é 3. A configuração do nível de compressão não tem efeito em conexões que não usam a compressão `zstd`.

Para mais informações, ver ponto 6.2.8, "Controlo da compressão da ligação".
