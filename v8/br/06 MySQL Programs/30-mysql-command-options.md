#### 6.5.1.1 Opções do Cliente do mysql

`mysql` suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysql]` e `[client]` de um arquivo de opções. Para informações sobre arquivos de opções usados por programas MySQL, consulte a Seção 6.2.2.2, Using Option Files.

**Tabela 6.10 Opções do cliente mysql**

<table><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Nome da opção</th> <th>Descrição</th> </tr></thead><tbody><tr><td>- Configuração do perfil do cliente.</td> <td>Nome do perfil OCI definido no ficheiro de configuração OCI a utilizar</td> </tr><tr><td>- Refazer automaticamente .</td> <td>Ativar o recache automático</td> </tr><tr><td>- - Auto-vertical-saída</td> <td>Ativar exibição automática de resultados verticais</td> </tr><tr><td>- lote</td> <td>Não utilize arquivo de histórico</td> </tr><tr><td>--binário-como-hex</td> <td>Mostrar valores binários em notação hexadecimal</td> </tr><tr><td>--modo binário</td> <td>Desativar \r\n - para \n tradução e tratamento de \0 como fim de consulta</td> </tr><tr><td>- Endereço de ligação</td> <td>Usar interface de rede especificada para se conectar ao MySQL Server</td> </tr><tr><td>--conjuntos de caracteres-dir</td> <td>Diretório onde são instalados conjuntos de caracteres</td> </tr><tr><td>--Nomes de colunas</td> <td>Escrever nomes de colunas nos resultados</td> </tr><tr><td>--column-type-info</td> <td>Exibir metadados do conjunto de resultados</td> </tr><tr><td>--comandos</td> <td>Ativar ou desativar o processamento de comandos de cliente mysql locais</td> </tr><tr><td>--comentários</td> <td>Manter ou retirar comentários em instruções enviadas ao servidor</td> </tr><tr><td>--comprimir</td> <td>Comprimir todas as informações enviadas entre o cliente e o servidor</td> </tr><tr><td>Algoritmos de compressão</td> <td>Algoritmos de compressão permitidos para ligações ao servidor</td> </tr><tr><td>--connect-expired-password</td> <td>Indicar ao servidor que o cliente pode lidar com o modo de sandbox de senha expirada</td> </tr><tr><td>--connect-timeout</td> <td>Número de segundos antes do tempo limite de conexão</td> </tr><tr><td>--base de dados</td> <td>Base de dados a utilizar</td> </tr><tr><td>--debug</td> <td>Registro de gravação de depuração; suportado apenas se o MySQL foi construído com suporte de depuração</td> </tr><tr><td>--debug-check</td> <td>Imprimir informações de depuração quando o programa sair</td> </tr><tr><td>--debug-info</td> <td>Imprimir informações de depuração, memória e estatísticas da CPU quando o programa sai</td> </tr><tr><td>--default-auth</td> <td>Plugin de autenticação a usar</td> </tr><tr><td>--default-character-set</td> <td>Especificar o conjunto de caracteres padrão</td> </tr><tr><td>--defaults-extra-file</td> <td>Leia arquivo de opção nomeado além dos arquivos de opção habituais</td> </tr><tr><td>--defaults-file</td> <td>Arquivo de opções nomeadas somente para leitura</td> </tr><tr><td>--defaults-group-suffix</td> <td>Valor do sufixo do grupo de opções</td> </tr><tr><td>- Delimitador</td> <td>Defina o delimitador de instruções</td> </tr><tr><td>--dns-srv-nome</td> <td>Utilize a pesquisa DNS SRV para obter informações sobre o host</td> </tr><tr><td>- Plug-in de texto claro</td> <td>Ativar o plug-in de autenticação de texto claro</td> </tr><tr><td>- Executar</td> <td>Executar a instrução e sair</td> </tr><tr><td>- Força</td> <td>Continuar mesmo que ocorra um erro SQL</td> </tr><tr><td>--get-server-public-key</td> <td>Solicitar a chave pública RSA do servidor</td> </tr><tr><td>- Ajuda .</td> <td>Mostrar mensagem de ajuda e sair</td> </tr><tr><td>- Desconheço-o.</td> <td>Padrões que especificam quais instruções devem ser ignoradas para registo</td> </tr><tr><td>- Hospedeiro</td> <td>Host em que o servidor MySQL está localizado</td> </tr><tr><td>- HTML</td> <td>Produzir saída HTML</td> </tr><tr><td>- ignorar espaços</td> <td>Ignorar espaços após nomes de função</td> </tr><tr><td>--init-comando</td> <td>Instrução SQL a ser executada após a conexão</td> </tr><tr><td>--init-command-add</td> <td>Adicionar uma instrução SQL adicional para executar após conectar ou reconectar ao servidor MySQL</td> </tr><tr><td>--números de linha</td> <td>Escrever números de linha para erros</td> </tr><tr><td>--load-data-local-dir</td> <td>Diretório para arquivos nomeados em instruções LOAD DATA LOCAL</td> </tr><tr><td>-- local-infile</td> <td>Ativar ou desativar a capacidade LOCAL para LOAD DATA</td> </tr><tr><td>--login-path</td> <td>Leia as opções de caminho de login em .mylogin.cnf</td> </tr><tr><td>- Pacote máximo permitido</td> <td>Comprimento máximo do pacote a enviar ou receber do servidor</td> </tr><tr><td>-- tamanho máximo da articulação</td> <td>O limite automático para linhas em uma junção ao usar --safe-updates</td> </tr><tr><td>--nominados-comandos</td> <td>Ativar comandos mysql nomeados</td> </tr><tr><td>- comprimento de tampão líquido</td> <td>Tamanho do buffer para comunicação TCP/IP e soquete</td> </tr><tr><td>--espaço de nomes de rede</td> <td>Especificar o espaço de nomes da rede</td> </tr><tr><td>- Sem auto-refazer.</td> <td>Desativar o recache automático</td> </tr><tr><td>- Não há sinal.</td> <td>Não apite quando ocorrerem erros</td> </tr><tr><td>- Não há padrões</td> <td>Não ler arquivos de opções</td> </tr><tr><td>--não-login-caminhos</td> <td>Não ler os caminhos de login no arquivo de caminho de login</td> </tr><tr><td>--oci-config-file</td> <td>Define um local alternativo para o ficheiro de configuração CLI da Oracle Cloud Infrastructure.</td> </tr><tr><td>-- uma base de dados</td> <td>Ignorar instruções exceto aquelas para o banco de dados padrão nomeado na linha de comando</td> </tr><tr><td>- ... pager</td> <td>Utilize o comando dado para a saída de pesquisa de paginação</td> </tr><tr><td>--senha</td> <td>Senha para usar quando se conectar ao servidor</td> </tr><tr><td>- Senha 1</td> <td>Primeira senha de autenticação multifator a usar ao se conectar ao servidor</td> </tr><tr><td>- Senha 2</td> <td>Segunda senha de autenticação multifator a usar ao se conectar ao servidor</td> </tr><tr><td>- Senha 3</td> <td>Terceira senha de autenticação multifator a utilizar quando se conectar ao servidor</td> </tr><tr><td>- Tubo.</td> <td>Conectar-se ao servidor usando o nome do tubo (somente Windows)</td> </tr><tr><td>--plugin-authentication-kerberos-client-mode</td> <td>Permitir autenticação plugável GSSAPI através da biblioteca Kerberos do MIT no Windows</td> </tr><tr><td>--plugin-authentication-web-authn-client-preserve-privacy</td> <td>Permitir que o usuário escolha uma chave para ser usada para asserção</td> </tr><tr><td>--plugin-dir</td> <td>Diretório onde os plugins estão instalados</td> </tr><tr><td>- Porto</td> <td>Número de porta TCP/IP para conexão</td> </tr><tr><td>- Impressão padrão</td> <td>Opções padrão de impressão</td> </tr><tr><td>- Prompt</td> <td>Defina o prompt para o formato especificado</td> </tr><tr><td>- Protocolo</td> <td>Protocolo de transporte a utilizar</td> </tr><tr><td>- Rápido.</td> <td>Não armazenar em cache cada resultado da consulta</td> </tr><tr><td>- em bruto</td> <td>Escrever valores de coluna sem conversão de escape</td> </tr><tr><td>- Reconectar.</td> <td>Se a conexão com o servidor for perdida, tente se reconectar automaticamente</td> </tr><tr><td>- Factor de registo</td> <td>Fatores de autenticação por múltiplos fatores que devem ser registados</td> </tr><tr><td>- actualizações de segurança, - sou um idiota.</td> <td>Permitir apenas instruções UPDATE e DELETE que especificam valores-chave</td> </tr><tr><td>--select-limit</td> <td>O limite automático para instruções SELECT ao usar --safe-updates</td> </tr><tr><td>--server-chave pública-caminho</td> <td>Nome do caminho para o ficheiro que contém a chave pública RSA</td> </tr><tr><td>--shared-memory-base-name</td> <td>Nome de memória partilhada para conexões de memória partilhada (somente Windows)</td> </tr><tr><td>- Alertas de exibição</td> <td>Mostrar avisos após cada instrução se houver algum</td> </tr><tr><td>--sigint-ignore</td> <td>Ignorar sinais SIGINT (normalmente o resultado da digitação de Control+C)</td> </tr><tr><td>- Silêncio.</td> <td>Modo silencioso</td> </tr><tr><td>- Esquecer-auto-refazer</td> <td>Desativar o recache automático</td> </tr><tr><td>--nomes de colunas de omissão</td> <td>Não escrever nomes de colunas nos resultados</td> </tr><tr><td>- números de linha de omissão</td> <td>Salte números de linha para erros</td> </tr><tr><td>--skip-named-commands</td> <td>Desativar os comandos mysql nomeados</td> </tr><tr><td>- Esqueça o pager.</td> <td>Desativar a chamada</td> </tr><tr><td>- Esquecer-reconectar</td> <td>Desativar a reconexão</td> </tr><tr><td>--skip-sistema-comando</td> <td>Desativar o comando sistema (\!)</td> </tr><tr><td>- Soquete</td> <td>Arquivo de soquete do Unix ou tubo nomeado do Windows para usar</td> </tr><tr><td>- O quê?</td> <td>Arquivo que contém lista de autoridades de certificação SSL confiáveis</td> </tr><tr><td>--ssl-capath</td> <td>Diretório que contém ficheiros de certificados SSL confiáveis</td> </tr><tr><td>--ssl-cert</td> <td>Arquivo que contém o certificado X.509</td> </tr><tr><td>--SSL-cifrado</td> <td>Códigos permitidos para a encriptação da ligação</td> </tr><tr><td>--ssl-crl</td> <td>Arquivo que contém listas de revogação de certificados</td> </tr><tr><td>--ssl-crlpath</td> <td>Diretório que contém ficheiros de lista de revogação de certificado</td> </tr><tr><td>--ssl-fips-modo</td> <td>Ativar o modo FIPS do lado do cliente</td> </tr><tr><td>--ssl-chave</td> <td>Arquivo que contém a chave X.509</td> </tr><tr><td>- Modo SSL</td> <td>Estado de segurança desejado da ligação ao servidor</td> </tr><tr><td>--ssl-data-de-sessão</td> <td>Arquivo que contém dados de sessão SSL</td> </tr><tr><td>--ssl-session-data-continue-on-failed-reuse</td> <td>Estabelecer conexões se a reutilização da sessão falhar</td> </tr><tr><td>--syslog</td> <td>Registro de instruções interativas para syslog</td> </tr><tr><td>--comando de sistema</td> <td>Ativar ou desativar o comando sistema (\!)</td> </tr><tr><td>-- tabela</td> <td>Exibir a saída em formato de tabela</td> </tr><tr><td>- Chávena</td> <td>Anexar uma cópia da saída ao arquivo nomeado</td> </tr><tr><td>--telemetria_cliente</td> <td>Ativa o cliente de telemetria.</td> </tr><tr><td>--otel_bsp_max_export_batch_size</td> <td>Ver variável OTEL_BSP_MAX_EXPORT_BATCH_SIZE.</td> </tr><tr><td>--hotel_bsp_max_queue_size</td> <td>Ver variável OTEL_BSP_MAX_QUEUE_SIZE.</td> </tr><tr><td>--hotel_bsp_plano_delay</td> <td>Ver variável OTEL_BSP_SCHEDULE_DELAY.</td> </tr><tr><td>--otel_exporter_otlp_traces_certificates</td> <td>Não em uso neste momento, reservado para desenvolvimento futuro.</td> </tr><tr><td>--hotel_exporter_otlp_traces_client_certificates</td> <td>Não em uso neste momento, reservado para desenvolvimento futuro.</td> </tr><tr><td>--otel_exporter_otlp_traces_client_key</td> <td>Não em uso neste momento, reservado para desenvolvimento futuro.</td> </tr><tr><td>--otel_exporter_otlp_traces_compressão</td> <td>Tipo de compressão</td> </tr><tr><td>--otel_exporter_otlp_traces_endpoint</td> <td>Ponto final de exportação de rastreamento</td> </tr><tr><td>--hotel_exporter_otlp_traces_headers</td> <td>Pares chave-valor a utilizar como cabeçalhos associados a solicitações HTTP</td> </tr><tr><td>--otel_exporter_otlp_traces_protocol</td> <td>Protocolo de transporte OTLP</td> </tr><tr><td>--otel_exporter_otlp_traces_timeout</td> <td>Tempo de espera do exportador OLTP para cada lote de exportação</td> </tr><tr><td>Ajuda de hotel.</td> <td>Quando ativado, as impressões ajudam nas opções do telemetry_client.</td> </tr><tr><td>--hotel_log_level</td> <td>Controles que registros de opentelemetry são impressos nos registros do servidor</td> </tr><tr><td>- atributos de recurso de hotel</td> <td>Ver a variável OpenTelemetry correspondente OTEL_RESOURCE_ATTRIBUTES.</td> </tr><tr><td>- Hotel-traça</td> <td>Esta variável do sistema controla a recolha ou não de traços de telemetria.</td> </tr><tr><td>--tls-ciphersuites</td> <td>Suítes de encriptação TLSv1.3 permitidas para conexões criptografadas</td> </tr><tr><td>--tls-sni-nome do servidor</td> <td>Nome do servidor fornecido pelo cliente</td> </tr><tr><td>- Versão TLS</td> <td>Protocolos TLS admissíveis para ligações encriptadas</td> </tr><tr><td>- Sem tampão.</td> <td>Limpe o buffer depois de cada consulta</td> </tr><tr><td>-- utilizador</td> <td>Nome do usuário do MySQL para usar quando se conectar ao servidor</td> </tr><tr><td>- Verbosos.</td> <td>Modo Verbose</td> </tr><tr><td>- versão</td> <td>Informações de versão de exibição e saída</td> </tr><tr><td>--vertical</td> <td>Imprimir as linhas de saída da consulta verticalmente (uma linha por valor de coluna)</td> </tr><tr><td>- Espere.</td> <td>Se a conexão não pode ser estabelecida, esperar e tentar novamente em vez de abortar</td> </tr><tr><td>--xml</td> <td>Produzir saída XML</td> </tr><tr><td>--zstd-nível de compressão</td> <td>Nível de compressão para conexões com servidor que usam compressão zstd</td> </tr></tbody></table>

- `--help`, `-?`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

Mostra uma mensagem de ajuda e sai.

- `--authentication-oci-client-config-profile`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--authentication-oci-client-config-profile=profileName</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Especifique o nome do perfil de configuração OCI a utilizar. Se não estiver definido, será utilizado o perfil por defeito.

- `--auto-rehash`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--auto-rehash</code>]]</td> </tr><tr><th>Desativado por</th> <td>[[<code>skip-auto-rehash</code>]]</td> </tr></tbody></table>

Ativar o cache automático. Esta opção está ativada por padrão, o que habilita o preenchimento do nome do banco de dados, da tabela e da coluna. Use `--disable-auto-rehash` para desativar o cache. Isso faz com que o `mysql` inicie mais rápido, mas você deve emitir o comando `rehash` ou seu atalho `\#` se quiser usar o preenchimento do nome.

Para completar um nome, digite a primeira parte e pressione Tab. Se o nome for inequívoco, `mysql` o completa. Caso contrário, você pode pressionar Tab novamente para ver os possíveis nomes que começam com o que você digitou até agora. A conclusão não ocorre se não houver um banco de dados padrão.

::: info Note

Este recurso requer um cliente MySQL compilado com a biblioteca **readline**. Tipicamente, a biblioteca **readline** não está disponível no Windows.

:::

- `--auto-vertical-output`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--auto-vertical-output</code>]]</td> </tr></tbody></table>

Cause result sets to be displayed vertically if they are too wide for the current window, and using normal tabular format otherwise. (Isso se aplica a instruções terminadas por `;` ou `\G`.)

- `--batch`, `-B`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--batch</code>]]</td> </tr></tbody></table>

Imprima resultados usando a aba como o separador de colunas, com cada linha em uma nova linha. Com esta opção, `mysql` não usa o arquivo de histórico.

O modo de lote resulta em formato de saída não tabular e escape de caracteres especiais. O escape pode ser desativado usando o modo bruto; veja a descrição para a opção `--raw`.

- `--binary-as-hex`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--binary-as-hex</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>FALSE in noninteractive mode</code>]]</td> </tr></tbody></table>

Quando esta opção é dada, `mysql` exibe dados binários usando notação hexadecimal (`0xvalue`). Isso ocorre se o formato de exibição de saída geral é tabular, vertical, HTML ou XML.

O exemplo a seguir demonstra isso usando o código ASCII para PH3 (65 decimal, 41 hexadecimal):

- `--binary-as-hex` desativado:

````
```
````

````
mysql> SELECT CHAR(0x41), UNHEX('41');
+------------+-------------+
| CHAR(0x41) | UNHEX('41') |
+------------+-------------+
| A          | A           |
+------------+-------------+
```
````

- \[`--binary-as-hex`]] habilitado:

````
```
````

````
mysql> SELECT CHAR(0x41), UNHEX('41');
+------------------------+--------------------------+
| CHAR(0x41)             | UNHEX('41')              |
+------------------------+--------------------------+
| 0x41                   | 0x41                     |
+------------------------+--------------------------+
```
````

Para escrever uma expressão de string binária de modo que ela seja exibida como uma string de caracteres independentemente de \[`--binary-as-hex`] estar ativada, use estas técnicas:

- A função `CHAR()` tem uma cláusula `USING charset`:

  ```
  mysql> SELECT CHAR(0x41 USING utf8mb4);
  +--------------------------+
  | CHAR(0x41 USING utf8mb4) |
  +--------------------------+
  | A                        |
  +--------------------------+
  ```
- Mais geralmente, use `CONVERT()` para converter uma expressão em um determinado conjunto de caracteres:

  ```
  mysql> SELECT CONVERT(UNHEX('41') USING utf8mb4);
  +------------------------------------+
  | CONVERT(UNHEX('41') USING utf8mb4) |
  +------------------------------------+
  | A                                  |
  +------------------------------------+
  ```

Além disso, a saída do comando `status` (ou `\s`) inclui esta linha quando a opção está ativada de forma implícita ou explícita:

```
Binary data as: Hexadecimal
```

Para desativar a notação hexadecimal, use `--skip-binary-as-hex`

- `--binary-mode`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--binary-mode</code>]]</td> </tr></tbody></table>

Esta opção ajuda no processamento de **mysqlbinlog** de saída que pode conter valores de PH\_CODE. Por padrão, `mysql` traduz `\r\n` em cadeias de instruções para `\n` e interpreta `\0` como o terminador de instruções. `--binary-mode` desativa ambos os recursos. Também desativa todos os comandos `mysql` exceto `charset` e `delimiter` no modo não interativo (para entrada canalizada para `mysql` ou carregada usando o comando `source`).

(*MySQL 8.4.6 e posterior:*) `--binary-mode`, quando ativado, faz com que o servidor ignore qualquer configuração para `--commands` .

- `--bind-address=ip_address`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>

Em um computador com várias interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao servidor MySQL.

- `--character-sets-dir=dir_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--character-sets-dir=dir_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do diretório</td> </tr></tbody></table>

O diretório onde estão instalados os conjuntos de caracteres.

- `--column-names`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--column-names</code>]]</td> </tr></tbody></table>

Escreva os nomes das colunas nos resultados.

- `--column-type-info`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--column-type-info</code>]]</td> </tr></tbody></table>

Esta informação corresponde ao conteúdo das estruturas de dados da C API `MYSQL_FIELD`.

- `--commands`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--commands</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>TRUE</code>]]</td> </tr></tbody></table>

Ativar ou desativar o processamento de comandos locais do cliente `mysql`. A definição desta opção para `FALSE` desativa esse processamento e tem os efeitos listados aqui:

- Os seguintes comandos do cliente mysql estão desativados:

  - `charset` (`/C` permanece habilitado)
  - `clear`
  - `connect`
  - `edit`
  - `ego`
  - `exit`
  - `go`
  - `help`
  - `nopager`
  - `notee`
  - `nowarning`
  - `pager`
  - `print`
  - `prompt`
  - `query_attributes`
  - `quit`
  - `rehash`
  - `resetconnection`
  - `ssl_session_data_print`
  - `source`
  - `status`
  - `system`
  - `tee`
  - `\u` (`use` é passado para o servidor)
  - `warnings`
- Os comandos `\C` e `delimiter` permanecem habilitados.
- A opção `--system-command` é ignorada e não tem efeito.

Esta opção não tem efeito quando `--binary-mode` está habilitado.

Quando `--commands` está habilitado, é possível desativar (apenas) o comando do sistema usando a opção `--system-command`.

Esta opção foi adicionada no MySQL 8.4.6.

- `--comments`, `-c`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--comments</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>TRUE</code>]]</td> </tr></tbody></table>

Se deve preservar ou remover comentários em instruções enviadas para o servidor. O padrão é preservá-los; para removê-los, inicie `mysql` com `--skip-comments`.

::: info Note

O cliente `mysql` sempre passa sugestões de otimizador para o servidor, independentemente de essa opção ser dada.

A remoção de comentários é depreciada. Espere que este recurso e as opções para controlá-lo sejam removidos em uma futura versão do MySQL.

:::

- `--compress`, `-C`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Depreciado</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Se possível, comprimir todas as informações enviadas entre o cliente e o servidor.

Esta opção está desatualizada. Espera-se que seja removida em uma versão futura do MySQL. Veja Configurar a Compressão de Conexão Legada.

- `--compression-algorithms=value`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--compression-algorithms=value</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Conjunto</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>uncompressed</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>zlib</code>]]</p><p class="valid-value">[[<code>zstd</code>]]</p><p class="valid-value">[[<code>uncompressed</code>]]</p></td> </tr></tbody></table>

Os algoritmos de compressão permitidos para conexões com o servidor. Os algoritmos disponíveis são os mesmos que para a variável do sistema `protocol_compression_algorithms`. O valor padrão é `uncompressed`.

Para mais informações, ver ponto 6.2.8, "Controlo da compressão da ligação".

- `--connect-expired-password`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--connect-expired-password</code>]]</td> </tr></tbody></table>

Indicar ao servidor que o cliente pode lidar com o modo sandbox se a conta usada para se conectar tiver uma senha expirada. Isso pode ser útil para invocações não interativas do `mysql` porque normalmente o servidor desconecta os clientes não interativos que tentam se conectar usando uma conta com uma senha expirada. (Veja Seção 8.2.16, Server Handling of Expired Passwords.)

- `--connect-timeout=value`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--connect-timeout=value</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>0</code>]]</td> </tr></tbody></table>

O número de segundos antes do tempo limite de conexão. (O valor padrão é `0`.)

- `--database=db_name`, `-D db_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--database=dbname</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

A base de dados a utilizar. Isto é útil principalmente num ficheiro de opções.

- `--debug[=debug_options]`, `-# [debug_options]`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--debug[=debug_option<code>d:t:o,/tmp/mysql.trace</code></code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>d:t:o,/tmp/mysql.trace</code>]]</td> </tr></tbody></table>

Escreva um log de depuração. Uma string típica `debug_options` é `d:t:o,file_name`. O padrão é `d:t:o,/tmp/mysql.trace`.

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

- `--default-character-set=charset_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--default-character-set=charset_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Use `charset_name` como o conjunto de caracteres padrão para o cliente e a conexão.

Esta opção pode ser útil se o sistema operacional usa um conjunto de caracteres e o cliente `mysql` por padrão usa outro. Neste caso, a saída pode ser formatada incorretamente. Você geralmente pode corrigir tais problemas usando esta opção para forçar o cliente a usar o conjunto de caracteres do sistema em vez disso.

Para obter mais informações, ver Secção 12.4, "Conjuntos de caracteres de ligação e collações" e Secção 12.15, "Configuração de conjuntos de caracteres".

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

Leia não apenas os grupos de opções usuais, mas também os grupos com os nomes usuais e um sufixo de \* `str` *. Por exemplo, \*\* mysql \*\* normalmente lê os grupos `[client]` e `[mysql]`. Se esta opção for dada como `--defaults-group-suffix=_other`, \*\* mysql*\* também lê os grupos `[client_other]` e `[mysql_other]`.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--delimiter=str`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--delimiter=str</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>;</code>]]</td> </tr></tbody></table>

Defina o delimitador de instruções. O padrão é o caractere ponto e vírgula (`;`).

- `--disable-named-commands`

Desativar comandos nomeados. Use apenas o formulário `\*`, ou use comandos nomeados apenas no início de uma linha que termina com um ponto e vírgula (`;`). `mysql` começa com esta opção \* habilitada\* por padrão. No entanto, mesmo com esta opção, os comandos de formato longo ainda funcionam a partir da primeira linha. Veja Seção 6.5.1.2, mysql Client Commands.

- `--dns-srv-name=name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--dns-srv-name=name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Especifica o nome de um registro DNS SRV que determina os hosts candidatos a serem usados para estabelecer uma conexão com um servidor MySQL.

Suponha que o DNS esteja configurado com esta informação SRV para o domínio `example.com`:

```
Name                     TTL   Class   Priority Weight Port Target
_mysql._tcp.example.com. 86400 IN SRV  0        5      3306 host1.example.com
_mysql._tcp.example.com. 86400 IN SRV  0        10     3306 host2.example.com
_mysql._tcp.example.com. 86400 IN SRV  10       5      3306 host3.example.com
_mysql._tcp.example.com. 86400 IN SRV  20       5      3306 host4.example.com
```

Para usar esse registro DNS SRV, invoque `mysql` assim:

```
mysql --dns-srv-name=_mysql._tcp.example.com
```

`mysql` então tenta uma conexão com cada servidor no grupo até que uma conexão bem sucedida seja estabelecida. Uma falha de conexão ocorre somente se uma conexão não puder ser estabelecida com qualquer um dos servidores. Os valores de prioridade e peso no registro DNS SRV determinam a ordem em que os servidores devem ser tentados.

Quando invocado com `--dns-srv-name`, `mysql` tenta estabelecer apenas conexões TCP.

A `--dns-srv-name` opção tem precedência sobre a `--host` opção se ambos são dados. `--dns-srv-name` faz com que a conexão estabelecimento de usar a `mysql_real_connect_dns_srv()` C API função em vez de `mysql_real_connect()`. No entanto, se o `connect` comando é posteriormente usado no tempo de execução e especifica um argumento de nome de host, que o nome de host tem precedência sobre qualquer `--dns-srv-name` opção dada no `mysql` inicialização para especificar um registro DNS SRV.

- `--enable-cleartext-plugin`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--enable-cleartext-plugin</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>

Ativar o plug-in de autenticação de texto transparente `mysql_clear_password` (ver Seção 8.4.1.4, Client-Side Cleartext Pluggable Authentication.)

- `--execute=statement`, `-e statement`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--execute=statement</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Execute a instrução e desligue. O formato de saída padrão é como o produzido com `--batch`. Veja a Seção 6.2.2.1, "Usar Opções na Linha de Comando", para alguns exemplos. Com esta opção, `mysql` não usa o arquivo de histórico.

- `--force`, `-f`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--force</code>]]</td> </tr></tbody></table>

Continuar mesmo se ocorrer um erro SQL.

- `--get-server-public-key`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--get-server-public-key</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr></tbody></table>

Solicitar do servidor a chave pública necessária para a troca de senhas baseada em pares de chaves RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senhas baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` é dado e especifica um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

Para obter informações sobre o plug-in `caching_sha2_password`, consulte a Seção 8.4.1.2, Caching SHA-2 Pluggable Authentication.

- `--histignore`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--histignore=pattern_list</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Uma lista de um ou mais padrões separados por dois pontos especificando instruções a serem ignoradas para fins de registro. Esses padrões são adicionados à lista padrão padrão (`"*IDENTIFIED*:*PASSWORD*"`). O valor especificado para esta opção afeta o registro de instruções escritas no arquivo de histórico, e para `syslog` se a opção `--syslog` for dada. Para mais informações, consulte a Seção 6.5.1.3, mysql Client Logging.

- `--host=host_name`, `-h host_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--host=host_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>localhost</code>]]</td> </tr></tbody></table>

Conecte-se ao servidor MySQL no host dado.

A `--dns-srv-name` opção tem precedência sobre a `--host` opção se ambos são dados. `--dns-srv-name` faz com que a conexão estabelecimento de usar a `mysql_real_connect_dns_srv()` C API função em vez de `mysql_real_connect()`. No entanto, se o `connect` comando é posteriormente usado no tempo de execução e especifica um argumento de nome de host, que o nome de host tem precedência sobre qualquer `--dns-srv-name` opção dada no `mysql` inicialização para especificar um registro DNS SRV.

- `--html`, `-H`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--html</code>]]</td> </tr></tbody></table>

Produzir saída HTML.

- `--ignore-spaces`, `-i`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--ignore-spaces</code>]]</td> </tr></tbody></table>

Ignore os espaços após os nomes das funções. O efeito disso é descrito na discussão para o `IGNORE_SPACE` modo SQL (ver Seção 7.1.11, Server SQL Modes).

- `--init-command=str`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--init-command=str</code>]]</td> </tr></tbody></table>

Uma única instrução SQL para ser executada após a conexão com o servidor. Se a reconexão automática estiver ativada, a instrução será executada novamente após a reconexão ocorrer. A definição redefine instruções existentes definidas por ela ou `init-command-add`.

- `--init-command-add=str`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--init-command-add=str</code>]]</td> </tr></tbody></table>

Adicionar uma instrução SQL adicional para executar após a conexão ou reconexão ao servidor MySQL. É utilizável sem `--init-command` mas não tem efeito se usado antes dele porque `init-command` redefine a lista de comandos para chamar.

- `--line-numbers`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--line-numbers</code>]]</td> </tr><tr><th>Desativado por</th> <td>[[<code>skip-line-numbers</code>]]</td> </tr></tbody></table>

Escreva números de linha para erros. Desative isso com `--skip-line-numbers`.

- `--load-data-local-dir=dir_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--load-data-local-dir=dir_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do diretório</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>empty string</code>]]</td> </tr></tbody></table>

Esta opção afeta a capacidade de `LOCAL` do lado do cliente para `LOAD DATA` operações. Especifica o diretório no qual os arquivos nomeados em `LOAD DATA LOCAL` instruções devem ser localizados. O efeito de `--load-data-local-dir` depende se o carregamento de dados `LOCAL` é ativado ou desativado:

- Se o carregamento de dados `LOCAL` estiver habilitado, por padrão na biblioteca do cliente MySQL ou especificando `--local-infile[=1]`, a opção `--load-data-local-dir` é ignorada.
- Se o carregamento de dados `LOCAL` for desativado, por padrão na biblioteca do cliente MySQL ou especificando `--local-infile=0`, a opção `--load-data-local-dir` será aplicada.

Quando `--load-data-local-dir` é aplicado, o valor da opção designa o diretório no qual os arquivos de dados locais devem estar localizados. A comparação do nome do caminho do diretório e o nome do caminho dos arquivos a serem carregados é sensível a maiúsculas e minúsculas, independentemente da sensibilidade de maiúsculas e minúsculas do sistema de arquivos subjacente. Se o valor da opção é a string vazia, ele não nomeia nenhum diretório, com o resultado de que nenhum arquivo é permitido para o carregamento de dados locais.

Por exemplo, para desativar explicitamente o carregamento de dados locais, exceto para arquivos localizados no diretório `/my/local/data`, invoque `mysql` assim:

```
mysql --local-infile=0 --load-data-local-dir=/my/local/data
```

Quando ambos os `--local-infile` e `--load-data-local-dir` são dados, a ordem em que eles são dados não importa.

O uso bem-sucedido de operações de carga de `LOCAL` dentro do `mysql` também requer que o servidor permita o carregamento local; ver Seção 8.1.6, "Considerações de segurança para LOAD DATA LOCAL"

- `--local-infile[={0|1}]`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--local-infile[={0|1}]</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>

Por padrão, a capacidade de `LOCAL` para `LOAD DATA` é determinada pelo padrão compilado na biblioteca do cliente MySQL. Para habilitar ou desativar o carregamento de dados de `LOCAL` explicitamente, use a opção `--local-infile`. Quando dada sem valor, a opção permite o carregamento de dados de `LOCAL`. Quando dada como `--local-infile=0` ou `--local-infile=1`, a opção desativa ou habilita o carregamento de dados de `LOCAL`.

Se a capacidade `LOCAL` estiver desativada, a opção `--load-data-local-dir` pode ser usada para permitir o carregamento local restrito de arquivos localizados em um diretório designado.

O uso bem-sucedido de operações de carga de `LOCAL` dentro do `mysql` também requer que o servidor permita o carregamento local; ver Seção 8.1.6, "Considerações de segurança para LOAD DATA LOCAL"

- `--login-path=name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--login-path=name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Leia opções do caminho de login nomeado no arquivo de caminho de login. Um caminho de login é um grupo de opções que contém opções que especificam a qual servidor MySQL se conectar e qual conta autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql\_config\_editor**. Veja Seção 6.6.7, mysql\_config\_editor  MySQL Configuration Utility.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--no-login-paths`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--no-login-paths</code>]]</td> </tr></tbody></table>

Salta opções de leitura do arquivo de caminho de login.

Ver `--login-path` para informações relacionadas.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--max-allowed-packet=value`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--max-allowed-packet=value</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>16777216</code>]]</td> </tr></tbody></table>

O tamanho máximo do buffer para comunicação cliente/servidor. O padrão é 16MB, o máximo é 1GB.

- `--max-join-size=value`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--max-join-size=value</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>1000000</code>]]</td> </tr></tbody></table>

O limite automático para linhas em uma junção ao usar `--safe-updates`. (Valor padrão é 1,000,000.)

- `--named-commands`, `-G`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--named-commands</code>]]</td> </tr><tr><th>Desativado por</th> <td>[[<code>skip-named-commands</code>]]</td> </tr></tbody></table>

Ativar comandos com nome `mysql`. Os comandos de formato longo são permitidos, não apenas os comandos de formato curto. Por exemplo, `quit` e `\q` são reconhecidos. Use `--skip-named-commands` para desativar comandos com nome. Veja Seção 6.5.1.2, mysql Client Commands.

- `--net-buffer-length=value`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--net-buffer-length=value</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>16384</code>]]</td> </tr></tbody></table>

O tamanho do buffer para comunicação TCP/IP e soquete (valor padrão é 16KB).

- `--network-namespace=name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--network-namespace=name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

O espaço de nomes de rede a ser usado para conexões TCP/IP. Se omitido, a conexão usa o espaço de nomes padrão (global). Para informações sobre espaços de nomes de rede, consulte a Seção 7.1.14, Suporte de Espaço de Nomes de Rede.

Esta opção está disponível apenas em plataformas que implementam suporte ao espaço de nomes de rede.

- `--no-auto-rehash`, `-A`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--no-auto-rehash</code>]]</td> </tr><tr><th>Depreciado</th> <td>Sim , sim .</td> </tr></tbody></table>

Isto tem o mesmo efeito que o `--skip-auto-rehash`. Veja a descrição para o `--auto-rehash`.

- `--no-beep`, `-b`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--no-beep</code>]]</td> </tr></tbody></table>

Não aperte o sinal de alarme quando ocorrerem erros.

- `--no-defaults`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--no-defaults</code>]]</td> </tr></tbody></table>

Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para impedi-las de serem lidas.

A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma forma mais segura do que na linha de comando, mesmo quando `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql\_config\_editor**. Veja Seção 6.6.7, mysql\_config\_editor  MySQL Configuration Utility.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--oci-config-file=PATH`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--oci-config-file</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code></code>]]</td> </tr></tbody></table>

Caminho alternativo para o arquivo de configuração do Oracle Cloud Infrastructure CLI. Especifique o local do arquivo de configuração. Se o seu perfil padrão existente for o correto, você não precisa especificar esta opção. No entanto, se você tiver um arquivo de configuração existente, com vários perfis ou um padrão diferente do contrato de arrendamento do usuário com o qual deseja se conectar, especifique esta opção.

- `--one-database`, `-o`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--one-database</code>]]</td> </tr></tbody></table>

Ignorar instruções exceto aquelas que ocorrem enquanto o banco de dados padrão é o nomeado na linha de comando. Esta opção é rudimentar e deve ser usada com cuidado. A filtragem de instruções é baseada apenas em instruções `USE`.

Inicialmente, `mysql` executa instruções na entrada porque especificar um banco de dados `db_name` na linha de comando é equivalente a inserir `USE db_name` no início da entrada. Em seguida, para cada instrução `USE` encontrada, `mysql` aceita ou rejeita as seguintes instruções dependendo se o banco de dados nomeado é o da linha de comando. O conteúdo das instruções é irrelevante.

Suponha que `mysql` é invocado para processar este conjunto de instruções:

```
DELETE FROM db2.t2;
USE db2;
DROP TABLE db1.t1;
CREATE TABLE db1.t1 (i INT);
USE db1;
INSERT INTO t1 (i) VALUES(1);
CREATE TABLE db2.t1 (j INT);
```

Se a linha de comando é **mysql --force --one-database db1**, `mysql` lida com a entrada da seguinte forma:

- A instrução `DELETE` é executada porque o banco de dados padrão é `db1`, mesmo que a instrução nomeie uma tabela em um banco de dados diferente.
- As instruções `DROP TABLE` e `CREATE TABLE` não são executadas porque o banco de dados padrão não é `db1`, mesmo que as instruções nomeiem uma tabela em `db1`.
- As instruções `INSERT` e `CREATE TABLE` são executadas porque o banco de dados padrão é `db1`, mesmo que a instrução `CREATE TABLE` nomeie uma tabela em um banco de dados diferente.

* `--pager[=command]`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--pager[=comman<code>skip-pager</code></code>]]</td> </tr><tr><th>Desativado por</th> <td>[[<code>skip-pager</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Se o comando for omitido, o pager padrão é o valor da variável de ambiente `PAGER`. Os pagers válidos são **less**, **more**, **cat \[> filename]**, e assim por diante. Esta opção funciona apenas no Unix e apenas no modo interativo. Para desativar o paging, use `--skip-pager`. Seção 6.5.1.2, mysql Client Commands, discute o paging de saída mais adiante.

- `--password[=password]`, `-p[password]`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--password[=password]</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, `mysql` solicita um. Se for fornecido, deve haver \* nenhum espaço \* entre `--password=` ou `-p` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar senha.

A especificação de uma senha na linha de comando deve ser considerada insegura. Para evitar a indicação da senha na linha de comando, use um arquivo de opções. Veja a Seção 8.1.2.1, "Diretrizes do Usuário Final para a Segurança de Senhas".

Para especificar explicitamente que não há senha e que `mysql` não deve solicitar uma, use a opção `--skip-password`.

- `--password1[=pass_val]`

A senha para o fator de autenticação multifator 1 da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, `mysql` solicita um. Se for fornecido, deve haver \* nenhum espaço \* entre `--password1=` e a senha que o segue. Se nenhuma opção de senha for especificada, o padrão é não enviar senha.

A especificação de uma senha na linha de comando deve ser considerada insegura. Para evitar a indicação da senha na linha de comando, use um arquivo de opções. Veja a Seção 8.1.2.1, "Diretrizes do Usuário Final para a Segurança de Senhas".

Para especificar explicitamente que não há senha e que `mysql` não deve solicitar uma, use a opção `--skip-password1`.

`--password1` e `--password` são sinônimos, assim como `--skip-password1` e `--skip-password`.

- `--password2[=pass_val]`

A senha para o fator de autenticação multifator 2 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica de `--password1`; veja a descrição dessa opção para detalhes.

- `--password3[=pass_val]`

A senha para o fator de autenticação multifator 3 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica para `--password1`; veja a descrição dessa opção para detalhes.

- `--pipe`, `-W`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--pipe</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

No Windows, conecte-se ao servidor usando um tubo nomeado. Esta opção se aplica apenas se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de tubo nomeado. Além disso, o usuário que faz a conexão deve ser um membro do grupo Windows especificado pela variável de sistema `named_pipe_full_access_group`.

- `--plugin-authentication-kerberos-client-mode=value`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--plugin-authentication-kerberos-client-mode</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>SSPI</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>GSSAPI</code>]]</p><p class="valid-value">[[<code>SSPI</code>]]</p></td> </tr></tbody></table>

No Windows, o plug-in de autenticação `authentication_kerberos_client` suporta esta opção de plug-in. Ele fornece dois valores possíveis que o usuário do cliente pode definir no tempo de execução: `SSPI` e `GSSAPI`.

O valor padrão para a opção do plugin do lado do cliente usa a Security Support Provider Interface (SSPI), que é capaz de adquirir credenciais do cache da memória interna do Windows. Alternativamente, o usuário do cliente pode selecionar um modo que suporte a Generic Security Service Application Program Interface (GSSAPI) através da biblioteca MIT Kerberos no Windows. GSSAPI é capaz de adquirir credenciais em cache geradas anteriormente usando o comando **kinit**.

Para mais informações, consulte Comando para Clientes do Windows no Modo GSSAPI.

- `--plugin-authentication-webauthn-client-preserve-privacy={OFF|ON}`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--plugin-authentication-webauthn-client-preserve-privacy</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Determina como assertions são enviadas para o servidor no caso de haver mais de uma credencial descoberta armazenada para um determinado RP ID (um nome exclusivo dado ao servidor da parte dependente, que é o servidor MySQL). Se o dispositivo FIDO2 contiver múltiplas chaves residentes para um determinado RP ID, esta opção permite ao usuário escolher uma chave a ser usada para assertion. Ele fornece dois valores possíveis que o usuário do cliente pode definir. O valor padrão é `OFF`. Se definido como `OFF`, o desafio é assinado por todas as credenciais disponíveis para um determinado RP ID e todas as assinaturas são enviadas para o servidor. Se definido como `ON`, o usuário é solicitado a escolher a credencial a ser usada para assinatura.

::: info Note

Esta opção não tem efeito se o dispositivo não suportar o recurso de chave residente.

:::

Para mais informações, ver a secção 8.4.1.11, "WebAuthn Pluggable Authentication".

- `--plugin-dir=dir_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--plugin-dir=dir_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do diretório</td> </tr></tbody></table>

O diretório no qual procurar plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas `mysql` não o encontrar. Veja Seção 8.2.17, Autenticação Pluggable.

- `--port=port_num`, `-P port_num`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--port=port_num</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>3306</code>]]</td> </tr></tbody></table>

Para as ligações TCP/IP, o número de porta a utilizar.

- `--print-defaults`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--print-defaults</code>]]</td> </tr></tbody></table>

Imprima o nome do programa e todas as opções que ele obtém de arquivos de opções.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--prompt=format_str`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--prompt=format_str</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>mysql&gt;</code>]]</td> </tr></tbody></table>

Configure o prompt no formato especificado. O padrão é `mysql>`. As sequências especiais que o prompt pode conter são descritas na Seção 6.5.1.2, mysql Client Commands.

- `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--protocol=type</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>[see tex<code>TCP</code></code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>TCP</code>]]</p><p class="valid-value">[[<code>SOCKET</code>]]</p><p class="valid-value">[[<code>PIPE</code>]]</p><p class="valid-value">[[<code>MEMORY</code>]]</p></td> </tr></tbody></table>

O protocolo de transporte a utilizar para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam na utilização de um protocolo diferente daquele desejado.

- `--quick`, `-q`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--quick</code>]]</td> </tr></tbody></table>

Não guarde em cache cada resultado da consulta, imprima cada linha conforme recebida. Isso pode retardar o servidor se a saída for suspensa. Com essa opção, `mysql` não usa o arquivo de histórico.

Por padrão, `mysql` capta todas as linhas de resultado antes de produzir qualquer saída; enquanto as armazena, calcula um comprimento máximo de coluna em execução a partir do valor real de cada coluna em sucessão. Ao imprimir a saída, ele usa esse máximo para formatá-la. Quando `--quick` é especificado, `mysql` não tem as linhas para calcular o comprimento antes de iniciar, e assim usa o comprimento máximo. No exemplo a seguir, a tabela `t1` tem uma única coluna do tipo `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") e contendo 4 linhas. A saída padrão é de 9 caracteres de largura; esta é igual ao número máximo de caracteres em qualquer dos valores das colunas nas linhas (5), mais 2 para cada um dos caracteres usados como espaços e os \[\[CO`|`]] caracteres delimitadores, e assim usa o comprimento máximo. A opção \[\[COPH

```
$> mysql -t test -e "SELECT * FROM t1"
+-------+
| c1    |
+-------+
|   100 |
|  1000 |
| 10000 |
|    10 |
+-------+

$> mysql --quick -t test -e "SELECT * FROM t1"
+----------------------+
| c1                   |
+----------------------+
|                  100 |
|                 1000 |
|                10000 |
|                   10 |
+----------------------+
```

- `--raw`, `-r`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--raw</code>]]</td> </tr></tbody></table>

Para a saída tabular, o boxing em torno das colunas permite que um valor de coluna seja distinguido de outro. Para a saída não-tabular (como é produzida em modo de lote ou quando a opção `--batch` ou `--silent` é dada), caracteres especiais são escapados na saída para que possam ser facilmente identificados. Newline, tab, `NUL`, e backslash são escritos como `\n`, `\t`, `\0`, e `\\`. A opção `--raw` desativa esta fuga de caracteres.

O exemplo a seguir demonstra a saída tabular versus não-tabular e o uso do modo bruto para desativar a fuga:

```
% mysql
mysql> SELECT CHAR(92);
+----------+
| CHAR(92) |
+----------+
| \        |
+----------+

% mysql -s
mysql> SELECT CHAR(92);
CHAR(92)
\\

% mysql -s -r
mysql> SELECT CHAR(92);
CHAR(92)
\
```

- `--reconnect`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--reconnect</code>]]</td> </tr><tr><th>Desativado por</th> <td>[[<code>skip-reconnect</code>]]</td> </tr></tbody></table>

Se a conexão com o servidor for perdida, tente se reconectar automaticamente. Uma única tentativa de reconexão é feita cada vez que a conexão for perdida. Para suprimir o comportamento de reconexão, use `--skip-reconnect`.

- `--register-factor=value`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--register-factor=value</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

O fator ou fatores para os quais o registro do dispositivo FIDO/FIDO2 deve ser realizado antes que a autenticação baseada no dispositivo WebAuthn possa ser usada. Este valor de opção deve ser um único valor, ou dois valores separados por vírgulas. Cada valor deve ser 2 ou 3, então os valores de opção permitidos são `'2'`, `'3'`, `'2,3'` e `'3,2'`.

Por exemplo, uma conta que requer registro para um terceiro fator de autenticação invoca o cliente `mysql` da seguinte forma:

```
mysql --user=user_name --register-factor=3
```

Uma conta que requer registro para o segundo e terceiro fatores de autenticação invoca o cliente `mysql` da seguinte forma:

```
mysql --user=user_name --register-factor=2,3
```

Se o registro for bem-sucedido, uma conexão é estabelecida. Se houver um fator de autenticação com um registro pendente, uma conexão é colocada no modo de registro pendente ao tentar se conectar ao servidor. Neste caso, desconecte e reconecte com o valor `--register-factor` correto para concluir o registro.

O registo é um processo de duas etapas que compreende as etapas de "iniciar registo" e "terminar registo".

```
ALTER USER user factor INITIATE REGISTRATION
```

A instrução retorna um conjunto de resultados contendo um desafio de 32 bytes, o nome do usuário e o ID da parte dependente (ver `authentication_webauthn_rp_id`).

A etapa de registo de acabamento executa esta instrução:

```
ALTER USER user factor FINISH REGISTRATION SET CHALLENGE_RESPONSE AS 'auth_string'
```

A declaração completa o registro e envia as seguintes informações ao servidor como parte do `auth_string`: dados do autenticador, um certificado de atestado opcional no formato X.509 e uma assinatura.

A opção `--register-factor` executa ambas as etapas de inicialização e registro, o que evita o cenário de falha descrito acima e evita ter que executar manualmente as instruções de inicialização e registro `ALTER USER`.

A opção `--register-factor` só está disponível para os clientes `mysql` e MySQL Shell. Outros programas clientes MySQL não o suportam.

Para informações relacionadas, consulte Usando a autenticação WebAuthn.

- `--safe-updates`, `--i-am-a-dummy`, `-U`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td><p class="valid-value">[[<code>--safe-updates</code>]]</p><p class="valid-value">[[<code>--i-am-a-dummy</code>]]</p></td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>

Se esta opção estiver habilitada, as instruções `UPDATE` e `DELETE` que não usam uma chave na cláusula `WHERE` ou na cláusula `LIMIT` produzem um erro. Além disso, restrições são colocadas nas instruções `SELECT` que produzem (ou são estimadas para produzir) conjuntos de resultados muito grandes. Se você tiver definido esta opção em um arquivo de opções, você pode usar `--skip-safe-updates` na linha de comando para substituí-la. Para mais informações sobre esta opção, consulte Usando o Modo de Atualização Segura (Safe-Updates).

- `--select-limit=value`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--select-limit=value</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>1000</code>]]</td> </tr></tbody></table>

O limite automático para as instruções `SELECT` ao usar `--safe-updates`. (O valor padrão é 1.000.)

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

- `--show-warnings`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--show-warnings</code>]]</td> </tr></tbody></table>

Fazer com que avisos sejam exibidos após cada instrução, se houver. Esta opção aplica-se ao modo interativo e ao modo em lote.

- `--sigint-ignore`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--sigint-ignore</code>]]</td> </tr></tbody></table>

Ignore os sinais `SIGINT` (geralmente o resultado da digitação de **Control+C**).

Sem essa opção, digitar **Control+C** interrompe a instrução atual se houver uma, ou cancela qualquer linha de entrada parcial.

- `--silent`, `-s`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--silent</code>]]</td> </tr></tbody></table>

Modo silencioso. Produz menos saída. Esta opção pode ser dada várias vezes para produzir menos e menos saída.

Esta opção resulta em formato de saída não tabular e escape de caracteres especiais. O escape pode ser desativado usando o modo RAW; veja a descrição para a opção `--raw`.

- `--skip-column-names`, `-N`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--skip-column-names</code>]]</td> </tr></tbody></table>

Não escreva nomes de colunas nos resultados. O uso desta opção faz com que a saída seja alinhada à direita, como mostrado aqui:

```
$> echo "SELECT * FROM t1" | mysql -t test
+-------+
| c1    |
+-------+
| a,c,d |
| c     |
+-------+
$> echo "SELECT * FROM t1" | ./mysql -uroot -Nt test
+-------+
| a,c,d |
|     c |
+-------+
```

- `--skip-line-numbers`, `-L`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--skip-line-numbers</code>]]</td> </tr></tbody></table>

Não escreva números de linha para erros. Útil quando você deseja comparar arquivos de resultados que incluem mensagens de erro.

- `--skip-system-command`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--skip-system-command</code>]]</td> </tr></tbody></table>

Desativa o comando `system` (`\!`). É equivalente a `--system-command=OFF`.

- `--socket=path`, `-S path`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--socket={file_name|pipe_name}</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Para conexões com `localhost`, o arquivo de soquete do Unix a ser usado, ou, no Windows, o nome do tubo nomeado a ser usado.

No Windows, essa opção se aplica apenas se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de name-pipe. Além disso, o usuário que faz a conexão deve ser um membro do grupo Windows especificado pela variável de sistema `named_pipe_full_access_group`.

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

- `--syslog`, `-j`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--syslog</code>]]</td> </tr></tbody></table>

Esta opção faz com que o `mysql` envie instruções interativas para o sistema de registro de logs. No Unix, este é o `syslog`; no Windows, é o Windows Event Log. O destino onde as mensagens registradas aparecem é dependente do sistema. No Linux, o destino é geralmente o arquivo `/var/log/messages`.

Aqui está uma amostra de saída gerada no Linux usando `--syslog`.

```
Mar  7 12:39:25 myhost MysqlClient[20824]:
  SYSTEM_USER:'oscar', MYSQL_USER:'my_oscar', CONNECTION_ID:23,
  DB_SERVER:'127.0.0.1', DB:'--', QUERY:'USE test;'
Mar  7 12:39:28 myhost MysqlClient[20824]:
  SYSTEM_USER:'oscar', MYSQL_USER:'my_oscar', CONNECTION_ID:23,
  DB_SERVER:'127.0.0.1', DB:'test', QUERY:'SHOW TABLES;'
```

Para obter mais informações, consulte a secção 6.5.1.3, "MySQL Client Logging".

- `--system-command[={ON|OFF}]`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--system-command[={ON|OFF}]</code>]]</td> </tr><tr><th>Desativado por</th> <td>[[<code>skip-system-command</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>

Ativar ou desativar o comando `system` (`\!`). Quando esta opção é desativada, seja pelo `--system-command=OFF` ou pelo `--skip-system-command`, o comando `system` é rejeitado com um erro.

(*MySQL 8.4.6 e posterior:*) `--commands`, quando desativado (definido como `FALSE`), faz com que o servidor ignore qualquer configuração para esta opção.

- `--table`, `-t`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--table</code>]]</td> </tr></tbody></table>

Exibe a saída no formato de tabela. Este é o padrão para uso interativo, mas pode ser usado para produzir a saída da tabela no modo de lote.

- `--tee=file_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--tee=file_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr></tbody></table>

Anexar uma cópia da saída ao arquivo dado. Esta opção funciona apenas no modo interativo. Seção 6.5.1.2, mysql Client Commands, discute mais arquivos de tee.

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

- `--unbuffered`, `-n`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--unbuffered</code>]]</td> </tr></tbody></table>

Limpe o buffer depois de cada consulta.

- `--user=user_name`, `-u user_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--user=user_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Nome do utilizador da conta MySQL a utilizar para se conectar ao servidor.

- `--verbose`, `-v`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--verbose</code>]]</td> </tr></tbody></table>

Produz mais output sobre o que o programa faz. Esta opção pode ser dada várias vezes para produzir mais e mais output. (Por exemplo, `-v -v -v` produz formato de saída de tabela mesmo no modo de lote.)

- `--version`, `-V`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--version</code>]]</td> </tr></tbody></table>

Informações de versão e saída.

- `--vertical`, `-E`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--vertical</code>]]</td> </tr></tbody></table>

Imprima as linhas de saída da consulta verticalmente (uma linha por valor de coluna). Sem esta opção, você pode especificar a saída vertical para instruções individuais terminando-as com `\G`.

- `--wait`, `-w`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--wait</code>]]</td> </tr></tbody></table>

Se a ligação não puder ser estabelecida, espere e tente novamente em vez de interromper.

- `--xml`, `-X`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--xml</code>]]</td> </tr></tbody></table>

Produzir saída XML.

```
<field name="column_name">NULL</field>
```

A saída quando `--xml` é usado com `mysql` coincide com a de `mysqldump` `--xml`. Veja Seção 6.5.4, mysqldump  Um Programa de Backup de Base de Dados, para detalhes.

A saída XML também usa um espaço de nomes XML, como mostrado aqui:

```
$> mysql --xml -uroot -e "SHOW VARIABLES LIKE 'version%'"
<?xml version="1.0"?>

<resultset statement="SHOW VARIABLES LIKE 'version%'" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
<row>
<field name="Variable_name">version</field>
<field name="Value">5.0.40-debug</field>
</row>

<row>
<field name="Variable_name">version_comment</field>
<field name="Value">Source distribution</field>
</row>

<row>
<field name="Variable_name">version_compile_machine</field>
<field name="Value">i686</field>
</row>

<row>
<field name="Variable_name">version_compile_os</field>
<field name="Value">suse-linux-gnu</field>
</row>
</resultset>
```

- `--zstd-compression-level=level`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--zstd-compression-level=#</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr></tbody></table>

O nível de compressão a usar para conexões com o servidor que usam o algoritmo de compressão `zstd`. Os níveis permitidos são de 1 a 22, com valores maiores indicando níveis crescentes de compressão. O nível de compressão `zstd` padrão é 3. A configuração do nível de compressão não tem efeito em conexões que não usam a compressão `zstd`.

Para mais informações, ver ponto 6.2.8, "Controlo da compressão da ligação".

- `telemetry_client`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--telemetry_client</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Ativa o plugin do cliente de telemetria (apenas Linux).

Para mais informações, ver Capítulo 35, "Telemetria".
