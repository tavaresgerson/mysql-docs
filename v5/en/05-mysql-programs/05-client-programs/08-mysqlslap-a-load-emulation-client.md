### 4.5.8 mysqlslap — Um Cliente de Emulação de Carga

O **mysqlslap** é um programa de diagnóstico projetado para emular a carga de clientes em um servidor MySQL e relatar o tempo de cada estágio. Ele funciona como se múltiplos clientes estivessem acessando o servidor.

Invoque o **mysqlslap** desta forma:

```sql
mysqlslap [options]
```

Algumas opções, como `--create` ou `--query`, permitem que você especifique uma string contendo uma instrução SQL ou um arquivo contendo instruções. Se você especificar um arquivo, por padrão ele deve conter uma instrução por linha. (Ou seja, o delimitador implícito da instrução é o caractere de nova linha.) Use a opção `--delimiter` para especificar um delimitador diferente, o que permite especificar instruções que se estendem por várias linhas ou colocar múltiplas instruções em uma única linha. Você não pode incluir comentários em um arquivo; o **mysqlslap** não os reconhece.

O **mysqlslap** é executado em três estágios:

1. Criação do schema, table e, opcionalmente, quaisquer stored programs ou dados a serem usados para o teste. Este estágio usa uma única conexão de cliente.

2. Execução do teste de carga (load test). Este estágio pode usar muitas conexões de cliente.

3. Limpeza (desconectar, DROP TABLE se especificado). Este estágio usa uma única conexão de cliente.

Exemplos:

Forneça suas próprias instruções SQL de CREATE e QUERY, com 50 clientes consultando e 200 SELECTs para cada um (digite o comando em uma única linha):

```sql
mysqlslap --delimiter=";"
  --create="CREATE TABLE a (b int);INSERT INTO a VALUES (23)"
  --query="SELECT * FROM a" --concurrency=50 --iterations=200
```

Permita que o **mysqlslap** construa a instrução SQL de QUERY com uma TABLE de duas colunas `INT` (INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT) e três colunas `VARCHAR`. Use cinco clientes consultando 20 vezes cada. Não crie a TABLE nem insira os dados (ou seja, use o schema e os dados do teste anterior):

```sql
mysqlslap --concurrency=5 --iterations=20
  --number-int-cols=2 --number-char-cols=3
  --auto-generate-sql
```

Instrua o programa a carregar as instruções SQL de CREATE, INSERT e QUERY dos arquivos especificados, onde o arquivo `create.sql` possui múltiplas instruções de criação de TABLE delimitadas por `';'` e múltiplas instruções INSERT delimitadas por `';'`. O arquivo `--query` possui múltiplas QUERYs delimitadas por `';'`. Execute todas as instruções de carga (load statements) e, em seguida, execute todas as QUERYs no arquivo de QUERY com cinco clientes (cinco vezes cada):

```sql
mysqlslap --concurrency=5
  --iterations=5 --query=query.sql --create=create.sql
  --delimiter=";"
```

O **mysqlslap** suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysqlslap]` e `[client]` de um arquivo de opções. Para obter informações sobre arquivos de opções usados pelos programas MySQL, consulte a Seção 4.2.2.2, “Usando Arquivos de Opções”.

**Tabela 4.20 Opções do mysqlslap**

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para o mysqlslap."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th>Nome da Opção</th> <th>Descrição</th> <th>Introduzida</th> <th>Obsoleta</th> </tr></thead><tbody><tr><th>--auto-generate-sql</th> <td>Gera instruções SQL automaticamente quando não são fornecidas em arquivos ou usando opções de comando</td> <td></td> <td></td> </tr><tr><th>--auto-generate-sql-add-autoincrement</th> <td>Adiciona coluna AUTO_INCREMENT a TABLEs geradas automaticamente</td> <td></td> <td></td> </tr><tr><th>--auto-generate-sql-execute-number</th> <td>Especifica quantas QUERYs gerar automaticamente</td> <td></td> <td></td> </tr><tr><th>--auto-generate-sql-guid-primary</th> <td>Adiciona uma Primary Key baseada em GUID a TABLEs geradas automaticamente</td> <td></td> <td></td> </tr><tr><th>--auto-generate-sql-load-type</th> <td>Especifica o tipo de carga de teste (load type)</td> <td></td> <td></td> </tr><tr><th>--auto-generate-sql-secondary-indexes</th> <td>Especifica quantos Secondary Indexes adicionar a TABLEs geradas automaticamente</td> <td></td> <td></td> </tr><tr><th>--auto-generate-sql-unique-query-number</th> <td>Quantas QUERYs diferentes gerar para testes automáticos</td> <td></td> <td></td> </tr><tr><th>--auto-generate-sql-unique-write-number</th> <td>Quantas QUERYs diferentes gerar para --auto-generate-sql-write-number</td> <td></td> <td></td> </tr><tr><th>--auto-generate-sql-write-number</th> <td>Quantas inserções de linha (row INSERTs) executar em cada Thread</td> <td></td> <td></td> </tr><tr><th>--commit</th> <td>Quantas instruções executar antes de COMMIT</td> <td></td> <td></td> </tr><tr><th>--compress</th> <td>Compacta todas as informações enviadas entre o cliente e o servidor</td> <td></td> <td></td> </tr><tr><th>--concurrency</th> <td>Número de clientes para simular ao emitir a instrução SELECT</td> <td></td> <td></td> </tr><tr><th>--create</th> <td>Arquivo ou string contendo a instrução a ser usada para criar a TABLE</td> <td></td> <td></td> </tr><tr><th>--create-schema</th> <td>Schema no qual executar os testes</td> <td></td> <td></td> </tr><tr><th>--csv</th> <td>Gera a saída no formato de valores separados por vírgula (comma-separated values)</td> <td></td> <td></td> </tr><tr><th>--debug</th> <td>Escreve log de debugging</td> <td></td> <td></td> </tr><tr><th>--debug-check</th> <td>Imprime informações de debugging quando o programa é encerrado</td> <td></td> <td></td> </tr><tr><th>--debug-info</th> <td>Imprime informações de debugging, memória e estatísticas de CPU quando o programa é encerrado</td> <td></td> <td></td> </tr><tr><th>--default-auth</th> <td>Plugin de autenticação a ser usado</td> <td></td> <td></td> </tr><tr><th>--defaults-extra-file</th> <td>Lê o arquivo de opções nomeado além dos arquivos de opções usuais</td> <td></td> <td></td> </tr><tr><th>--defaults-file</th> <td>Lê apenas o arquivo de opções nomeado</td> <td></td> <td></td> </tr><tr><th>--defaults-group-suffix</th> <td>Valor do sufixo do grupo de opções</td> <td></td> <td></td> </tr><tr><th>--delimiter</th> <td>Delimitador a ser usado em instruções SQL</td> <td></td> <td></td> </tr><tr><th>--detach</th> <td>Desanexa (fecha e reabre) cada conexão após cada N instruções</td> <td></td> <td></td> </tr><tr><th>--enable-cleartext-plugin</th> <td>Habilita o plugin de autenticação cleartext</td> <td></td> <td></td> </tr><tr><th>--engine</th> <td>Storage Engine a ser usado para criar a TABLE</td> <td></td> <td></td> </tr><tr><th>--get-server-public-key</th> <td>Solicita a chave pública RSA do servidor</td> <td>5.7.23</td> <td></td> </tr><tr><th>--help</th> <td>Exibe mensagem de ajuda e sai</td> <td></td> <td></td> </tr><tr><th>--host</th> <td>Host onde o servidor MySQL está localizado</td> <td></td> <td></td> </tr><tr><th>--iterations</th> <td>Número de vezes para executar os testes</td> <td></td> <td></td> </tr><tr><th>--login-path</th> <td>Lê opções de login path de .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th>--no-defaults</th> <td>Não lê arquivos de opções</td> <td></td> <td></td> </tr><tr><th>--no-drop</th> <td>Não executa DROP em nenhum schema criado durante a execução do teste</td> <td></td> <td></td> </tr><tr><th>--number-char-cols</th> <td>Número de colunas VARCHAR a serem usadas se --auto-generate-sql for especificado</td> <td></td> <td></td> </tr><tr><th>--number-int-cols</th> <td>Número de colunas INT a serem usadas se --auto-generate-sql for especificado</td> <td></td> <td></td> </tr><tr><th>--number-of-queries</th> <td>Limita cada cliente a aproximadamente este número de QUERYs</td> <td></td> <td></td> </tr><tr><th>--only-print</th> <td>Não se conecta a Databases. O mysqlslap apenas imprime o que teria feito</td> <td></td> <td></td> </tr><tr><th>--password</th> <td>Senha a ser usada ao conectar-se ao servidor</td> <td></td> <td></td> </tr><tr><th>--pipe</th> <td>Conecta-se ao servidor usando named pipe (somente Windows)</td> <td></td> <td></td> </tr><tr><th>--plugin-dir</th> <td>Diretório onde os plugins estão instalados</td> <td></td> <td></td> </tr><tr><th>--port</th> <td>Número da porta TCP/IP para conexão</td> <td></td> <td></td> </tr><tr><th>--post-query</th> <td>Arquivo ou string contendo a instrução a ser executada após a conclusão dos testes</td> <td></td> <td></td> </tr><tr><th>--post-system</th> <td>String a ser executada usando system() após a conclusão dos testes</td> <td></td> <td></td> </tr><tr><th>--pre-query</th> <td>Arquivo ou string contendo a instrução a ser executada antes de executar os testes</td> <td></td> <td></td> </tr><tr><th>--pre-system</th> <td>String a ser executada usando system() antes de executar os testes</td> <td></td> <td></td> </tr><tr><th>--print-defaults</th> <td>Imprime as opções padrão</td> <td></td> <td></td> </tr><tr><th>--protocol</th> <td>Protocolo de transporte a ser usado</td> <td></td> <td></td> </tr><tr><th>--query</th> <td>Arquivo ou string contendo a instrução SELECT a ser usada para recuperar dados</td> <td></td> <td></td> </tr><tr><th>--secure-auth</th> <td>Não envia senhas ao servidor no formato antigo (pré-4.1)</td> <td></td> <td>Sim</td> </tr><tr><th>--server-public-key-path</th> <td>Nome do caminho para o arquivo contendo a chave pública RSA</td> <td>5.7.23</td> <td></td> </tr><tr><th>--shared-memory-base-name</th> <td>Nome da shared-memory para conexões shared-memory (somente Windows)</td> <td></td> <td></td> </tr><tr><th>--silent</th> <td>Modo silencioso</td> <td></td> <td></td> </tr><tr><th>--socket</th> <td>Arquivo socket Unix ou named pipe Windows a ser usado</td> <td></td> <td></td> </tr><tr><th>--sql-mode</th> <td>Define o SQL mode para a sessão do cliente</td> <td></td> <td></td> </tr><tr><th>--ssl</th> <td>Habilita a criptografia da conexão</td> <td></td> <td></td> </tr><tr><th>--ssl-ca</th> <td>Arquivo que contém a lista de Certificate Authorities SSL confiáveis</td> <td></td> <td></td> </tr><tr><th>--ssl-capath</th> <td>Diretório que contém arquivos de certificado de Certificate Authority SSL confiáveis</td> <td></td> <td></td> </tr><tr><th>--ssl-cert</th> <td>Arquivo que contém o certificado X.509</td> <td></td> <td></td> </tr><tr><th>--ssl-cipher</th> <td>Cifras permitidas para criptografia de conexão</td> <td></td> <td></td> </tr><tr><th>--ssl-crl</th> <td>Arquivo que contém listas de revogação de certificado</td> <td></td> <td></td> </tr><tr><th>--ssl-crlpath</th> <td>Diretório que contém arquivos de lista de revogação de certificado</td> <td></td> <td></td> </tr><tr><th>--ssl-key</th> <td>Arquivo que contém a chave X.509</td> <td></td> <td></td> </tr><tr><th>--ssl-mode</th> <td>Estado de segurança desejado da conexão com o servidor</td> <td>5.7.11</td> <td></td> </tr><tr><th>--ssl-verify-server-cert</th> <td>Verifica o nome do Host contra a identidade Common Name do certificado do servidor</td> <td></td> <td></td> </tr><tr><th>--tls-version</th> <td>Protocolos TLS permitidos para conexões criptografadas</td> <td>5.7.10</td> <td></td> </tr><tr><th>--user</th> <td>Nome de usuário MySQL a ser usado ao conectar-se ao servidor</td> <td></td> <td></td> </tr><tr><th>--verbose</th> <td>Modo verbose</td> <td></td> <td></td> </tr><tr><th>--version</th> <td>Exibe informações da versão e sai</td> <td></td> <td></td> </tr></tbody></table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Exibe uma mensagem de ajuda e sai.

* `--auto-generate-sql`, `-a`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Gera instruções SQL automaticamente quando elas não são fornecidas em arquivos ou usando opções de comando.

* `--auto-generate-sql-add-autoincrement`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql-add-autoincrement"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Adiciona uma coluna `AUTO_INCREMENT` a TABLEs geradas automaticamente.

* `--auto-generate-sql-execute-number=N`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql-execute-number"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  Especifica quantas QUERYs gerar automaticamente.

* `--auto-generate-sql-guid-primary`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql-guid-primary"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Adiciona uma Primary Key baseada em GUID a TABLEs geradas automaticamente.

* `--auto-generate-sql-load-type=type`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql-load-type"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql-load-type=type</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>mixed</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>read</code></p><p><code>write</code></p><p><code>key</code></p><p><code>update</code></p><p><code>mixed</code></p></td> </tr></tbody></table>

  Especifica o tipo de carga de teste (load type). Os valores permitidos são `read` (varredura de TABLEs), `write` (INSERT em TABLEs), `key` (leitura de Primary Keys), `update` (UPDATE de Primary Keys) ou `mixed` (metade INSERTs, metade SELECTs de varredura). O padrão é `mixed`.

* `--auto-generate-sql-secondary-indexes=N`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql-secondary-indexes"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql-secondary-indexes=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Padrão</th> <td><code>0</code></td> </tr></tbody></table>

  Especifica quantos Secondary Indexes adicionar a TABLEs geradas automaticamente. Por padrão, nenhum é adicionado.

* `--auto-generate-sql-unique-query-number=N`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql-unique-query-number"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql-unique-query-number=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Padrão</th> <td><code>10</code></td> </tr></tbody></table>

  Quantas QUERYs diferentes gerar para testes automáticos. Por exemplo, se você executar um teste `key` que realiza 1000 SELECTs, você pode usar esta opção com o valor 1000 para executar 1000 QUERYs únicas, ou com o valor 50 para executar 50 SELECTs diferentes. O padrão é 10.

* `--auto-generate-sql-unique-write-number=N`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql-unique-write-number"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql-unique-write-number=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Padrão</th> <td><code>10</code></td> </tr></tbody></table>

  Quantas QUERYs diferentes gerar para `--auto-generate-sql-write-number`. O padrão é 10.

* `--auto-generate-sql-write-number=N`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Quantas inserções de linha (row INSERTs) executar. O padrão é 100.

* `--commit=N`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Quantas instruções executar antes de COMMIT. O padrão é 0 (nenhum COMMIT é feito).

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Compacta todas as informações enviadas entre o cliente e o servidor, se possível. Consulte a Seção 4.2.6, “Controle de Compressão de Conexão”.

* `--concurrency=N`, `-c N`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  O número de clientes paralelos a serem simulados.

* `--create=value`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  O arquivo ou string contendo a instrução a ser usada para criar a TABLE.

* `--create-schema=value`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  O schema no qual executar os testes.

  Note

  Se a opção `--auto-generate-sql` também for fornecida, o **mysqlslap** executa DROP no schema ao final da execução do teste. Para evitar isso, use também a opção `--no-drop`.

* `--csv[=file_name]`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Gera a saída no formato de valores separados por vírgula (comma-separated values). A saída vai para o arquivo nomeado, ou para a saída padrão (standard output) se nenhum arquivo for fornecido.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Escreve um log de debugging. Uma string *`debug_options`* típica é `d:t:o,file_name`. O padrão é `d:t:o,/tmp/mysqlslap.trace`.

  Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando esta opção.

* `--debug-check`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Imprime algumas informações de debugging quando o programa é encerrado.

  Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando esta opção.

* `--debug-info`, `-T`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Imprime informações de debugging e estatísticas de uso de memória e CPU quando o programa é encerrado.

  Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando esta opção.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Uma dica sobre qual plugin de autenticação do lado do cliente usar. Consulte a Seção 6.2.13, “Autenticação Plugável”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Lê este arquivo de opções após o arquivo de opções global, mas (no Unix) antes do arquivo de opções do usuário. Se o arquivo não existir ou estiver inacessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opções”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Usa apenas o arquivo de opções fornecido. Se o arquivo não existir ou estiver inacessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Exceção: Mesmo com `--defaults-file`, os programas cliente leem `.mylogin.cnf`.

  Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opções”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Lê não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo *`str`*. Por exemplo, o **mysqlslap** normalmente lê os grupos `[client]` e `[mysqlslap]`. Se esta opção for fornecida como `--defaults-group-suffix=_other`, o **mysqlslap** também lê os grupos `[client_other]` e `[mysqlslap_other]`.

  Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opções”.

* `--delimiter=str`, `-F str`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  O delimitador a ser usado nas instruções SQL fornecidas em arquivos ou usando opções de comando.

* `--detach=N`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Desanexa (fecha e reabre) cada conexão após cada *`N`* instruções. O padrão é 0 (as conexões não são desanexadas).

* `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Habilita o plugin de autenticação cleartext `mysql_clear_password`. (Consulte a Seção 6.4.1.6, “Autenticação Plugável Cleartext do Lado do Cliente”.)

* `--engine=engine_name`, `-e engine_name`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  O Storage Engine a ser usado para criar TABLEs.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Solicita ao servidor a chave pública RSA que ele usa para a troca de senha baseada em par de chaves. Esta opção se aplica a clientes que se conectam ao servidor usando uma conta que se autentica com o plugin de autenticação `caching_sha2_password`. Para conexões feitas por tais contas, o servidor não envia a chave pública ao cliente, a menos que seja solicitada. A opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha baseada em RSA não for necessária, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecida e especificar um arquivo de chave pública válido, ela terá precedência sobre `--get-server-public-key`.

  Para obter informações sobre o plugin `caching_sha2_password`, consulte a Seção 6.4.1.4, “Autenticação Plugável SHA-2 com Caching”.

  A opção `--get-server-public-key` foi adicionada no MySQL 5.7.23.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Conecta-se ao servidor MySQL no Host fornecido.

* `--iterations=N`, `-i N`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql-add-autoincrement"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  O número de vezes para executar os testes.

* `--login-path=name`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql-add-autoincrement"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Lê opções do login path nomeado no arquivo de login path `.mylogin.cnf`. Um “login path” é um grupo de opções contendo opções que especificam a qual servidor MySQL conectar e com qual conta autenticar. Para criar ou modificar um arquivo de login path, use o utilitário **mysql_config_editor**. Consulte a Seção 4.6.6, “mysql_config_editor — Utilitário de Configuração MySQL”.

  Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opções”.

* `--no-drop`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql-add-autoincrement"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Impede que o **mysqlslap** execute DROP em qualquer schema que ele crie durante a execução do teste.

* `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql-add-autoincrement"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Não lê arquivos de opções. Se a inicialização do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para impedir que sejam lidas.

  A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de forma mais segura do que na linha de comando, mesmo quando `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql_config_editor**. Consulte a Seção 4.6.6, “mysql_config_editor — Utilitário de Configuração MySQL”.

  Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opções”.

* `--number-char-cols=N`, `-x N`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql-add-autoincrement"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  O número de colunas `VARCHAR` a serem usadas se `--auto-generate-sql` for especificado.

* `--number-int-cols=N`, `-y N`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql-add-autoincrement"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  O número de colunas `INT` (INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT) a serem usadas se `--auto-generate-sql` for especificado.

* `--number-of-queries=N`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql-add-autoincrement"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Limita cada cliente a aproximadamente esse número de QUERYs. A contagem de QUERYs leva em consideração o delimitador de instrução. Por exemplo, se você invocar o **mysqlslap** da seguinte forma, o delimitador `;` é reconhecido de modo que cada instância da string de QUERY conte como duas QUERYs. Como resultado, 5 linhas (não 10) são inseridas.

  ```sql
  mysqlslap --delimiter=";" --number-of-queries=10
            --query="use test;insert into t values(null)"
  ```

* `--only-print`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql-add-autoincrement"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Não se conecta a Databases. O **mysqlslap** apenas imprime o que teria feito.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql-add-autoincrement"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  A senha da conta MySQL usada para conectar-se ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysqlslap** solicitará um. Se fornecido, *não deve haver espaço* entre `--password=` ou `-p` e a senha seguinte. Se nenhuma opção de senha for especificada, o padrão é não enviar senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opções. Consulte a Seção 6.1.2.1, “Diretrizes para o Usuário Final para Segurança de Senhas”.

  Para especificar explicitamente que não há senha e que o **mysqlslap** não deve solicitá-la, use a opção `--skip-password`.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql-add-autoincrement"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  No Windows, conecta-se ao servidor usando um named pipe. Esta opção se aplica somente se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por named pipe. Além disso, o usuário que faz a conexão deve ser um membro do grupo Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql-execute-number"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  O diretório onde procurar plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o **mysqlslap** não o encontrar. Consulte a Seção 6.2.13, “Autenticação Plugável”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql-execute-number"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  Para conexões TCP/IP, o número da porta a ser usado.

* `--post-query=value`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql-execute-number"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  O arquivo ou string contendo a instrução a ser executada após a conclusão dos testes. Esta execução não é contabilizada para fins de medição de tempo (timing).

* `--post-system=str`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql-execute-number"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  A string a ser executada usando `system()` após a conclusão dos testes. Esta execução não é contabilizada para fins de medição de tempo (timing).

* `--pre-query=value`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql-execute-number"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  O arquivo ou string contendo a instrução a ser executada antes de executar os testes. Esta execução não é contabilizada para fins de medição de tempo (timing).

* `--pre-system=str`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql-execute-number"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  A string a ser executada usando `system()` antes de executar os testes. Esta execução não é contabilizada para fins de medição de tempo (timing).

* `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql-execute-number"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  Imprime o nome do programa e todas as opções que ele obtém dos arquivos de opções.

  Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opções”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql-execute-number"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  O protocolo de transporte a ser usado para conectar-se ao servidor. É útil quando os outros parâmetros de conexão normalmente resultariam no uso de um protocolo diferente daquele que você deseja. Para detalhes sobre os valores permitidos, consulte a Seção 4.2.5, “Protocolos de Transporte de Conexão”.

* `--query=value`, `-q value`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql-execute-number"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  O arquivo ou string contendo a instrução `SELECT` a ser usada para recuperar dados.

* `--secure-auth`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql-execute-number"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  Não envia senhas ao servidor no formato antigo (pré-4.1). Isso impede conexões, exceto para servidores que usam o formato de senha mais recente.

  A partir do MySQL 5.7.5, esta opção está obsoleta (deprecated); espere que seja removida em um futuro lançamento do MySQL. Ela está sempre habilitada e tentar desabilitá-la (`--skip-secure-auth`, `--secure-auth=0`) produz um erro. Antes do MySQL 5.7.5, esta opção era habilitada por padrão, mas podia ser desabilitada.

  Note

  Senhas que usam o método de hashing pré-4.1 são menos seguras do que senhas que usam o método nativo de hashing de senha e devem ser evitadas. Senhas pré-4.1 estão obsoletas e o suporte para elas foi removido no MySQL 5.7.5. Para instruções de atualização de conta, consulte a Seção 6.4.1.3, “Migrando do Hashing de Senha Pré-4.1 e do Plugin mysql_old_password”.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql-guid-primary"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  O nome do caminho para um arquivo em formato PEM contendo uma cópia do lado do cliente da chave pública exigida pelo servidor para a troca de senha baseada em par de chaves RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecida e especificar um arquivo de chave pública válido, ela terá precedência sobre `--get-server-public-key`.

  Para `sha256_password`, esta opção se aplica somente se o MySQL foi construído usando OpenSSL.

  Para obter informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 6.4.1.5, “Autenticação Plugável SHA-256”, e a Seção 6.4.1.4, “Autenticação Plugável SHA-2 com Caching”.

  A opção `--server-public-key-path` foi adicionada no MySQL 5.7.23.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql-guid-primary"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  No Windows, o nome da shared-memory a ser usado para conexões feitas usando shared memory para um servidor local. O valor padrão é `MYSQL`. O nome da shared-memory diferencia maiúsculas de minúsculas.

  Esta opção se aplica somente se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões por shared memory.

* `--silent`, `-s`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql-guid-primary"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Modo silencioso (Silent mode). Sem saída.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql-guid-primary"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Para conexões a `localhost`, o arquivo socket Unix a ser usado ou, no Windows, o nome do named pipe a ser usado.

  No Windows, esta opção se aplica somente se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por named pipe. Além disso, o usuário que faz a conexão deve ser um membro do grupo Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--sql-mode=mode`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql-guid-primary"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Define o SQL mode para a sessão do cliente.

* `--ssl*`

  Opções que começam com `--ssl` especificam se deve haver conexão com o servidor usando criptografia e indicam onde encontrar chaves e certificados SSL. Consulte Opções de Comando para Conexões Criptografadas.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql-guid-primary"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolos separados por vírgulas. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 6.3.2, “Protocolos TLS e Cifras de Conexão Criptografada”.

  Esta opção foi adicionada no MySQL 5.7.10.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql-guid-primary"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  O nome de usuário (user name) da conta MySQL a ser usado para conectar-se ao servidor.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql-guid-primary"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Modo verbose. Imprime mais informações sobre o que o programa faz. Esta opção pode ser usada múltiplas vezes para aumentar a quantidade de informação.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Propriedades para auto-generate-sql-guid-primary"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Exibe informações da versão e sai.