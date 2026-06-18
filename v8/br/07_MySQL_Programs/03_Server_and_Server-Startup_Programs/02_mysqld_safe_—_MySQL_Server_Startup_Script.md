### 6.3.2 mysqld\_safe — Script de inicialização do servidor MySQL

**mysqld\_safe** é a maneira recomendada para iniciar um servidor **mysqld** no Unix. **mysqld\_safe** adiciona algumas funcionalidades de segurança, como reiniciar o servidor quando ocorre um erro e registrar informações de execução em um log de erro. Uma descrição do registro de erros é dada mais adiante nesta seção.

Nota

Para algumas plataformas Linux, a instalação do MySQL a partir de pacotes RPM ou Debian inclui suporte ao systemd para gerenciar o início e o desligamento do servidor MySQL. Nessas plataformas, o **mysqld\_safe** não é instalado porque é desnecessário. Para obter mais informações, consulte a Seção 2.5.9, “Gerenciamento do Servidor MySQL com o systemd”.

Uma implicação do não uso do **mysqld\_safe** em plataformas que utilizam o systemd para gerenciamento de servidores é que o uso de seções `[mysqld_safe]` ou `[safe_mysqld]` em arquivos de opções não é suportado e pode levar a comportamentos inesperados.

O **mysqld\_safe** tenta iniciar um executável chamado **mysqld**. Para substituir o comportamento padrão e especificar explicitamente o nome do servidor que você deseja executar, especifique uma opção `--mysqld` ou `--mysqld-version` para o **mysqld\_safe**. Você também pode usar `--ledir` para indicar o diretório onde o **mysqld\_safe** deve procurar o servidor.

Muitas das opções para **mysqld\_safe** são as mesmas das opções para **mysqld**. Veja a Seção 7.1.7, “Opções de comando do servidor”.

Opções desconhecidas para o **mysqld\_safe** são passadas para o **mysqld** se forem especificadas na linha de comando, mas ignoradas se forem especificadas no grupo `[mysqld_safe]` de um arquivo de opções. Veja a Seção 6.2.2.2, “Usando arquivos de opções”.

O **mysqld\_safe** lê todas as opções nas seções `[mysqld]`, `[server]` e `[mysqld_safe]` dos arquivos de opções. Por exemplo, se você especificar uma seção `[mysqld]` assim, o **mysqld\_safe** encontra e usa a opção `--log-error`:

```
[mysqld]
log-error=error.log
```

Para compatibilidade reversa, o **mysqld\_safe** também lê seções `[safe_mysqld]`s, mas para ficar atualizado, você deve renomear essas seções para `[mysqld_safe]`.

O **mysqld\_safe** aceita opções na linha de comando e em arquivos de opções, conforme descrito na tabela a seguir. Para obter informações sobre os arquivos de opções usados pelos programas do MySQL, consulte a Seção 6.2.2.2, “Usando arquivos de opções”.

**Tabela 6.7 Opções do mysqld\_safe**

<table summary="Opções de linha de comando disponíveis para mysqld_safe."><thead><tr><th>Nome da Opção</th> <th>Descrição</th> </tr></thead><tbody><tr><td>--basedir</td> <td>Caminho para o diretório de instalação do MySQL</td> </tr><tr><td>--core-file-size</td> <td>Tamanho do arquivo de núcleo que o mysqld deve ser capaz de criar</td> </tr><tr><td>--datadir</td> <td>Caminho para o diretório de dados</td> </tr><tr><td>--defaults-extra-file</td> <td>Leia o arquivo de opção nomeado, além dos arquivos de opção usuais</td> </tr><tr><td>--defaults-file</td> <td>Arquivo de opção de leitura apenas nomeado</td> </tr><tr><td>--help</td> <td>Exibir mensagem de ajuda e sair</td> </tr><tr><td>--ledir</td> <td>Caminho para o diretório onde o servidor está localizado</td> </tr><tr><td>--log-error</td> <td>Escreva o log de erros em um arquivo nomeado</td> </tr><tr><td>--malloc-lib</td> <td>Biblioteca malloc alternativa para usar no mysqld</td> </tr><tr><td>--mysqld</td> <td>Nome do programa do servidor para iniciar (no diretório ledir)</td> </tr><tr><td>--mysqld-safe-log-timestamps</td> <td>Formato de data e hora para registro</td> </tr><tr><td>--mysqld-version</td> <td>Sufixo para o nome do programa do servidor</td> </tr><tr><td>--legal</td> <td>Use um bom programa para definir a prioridade de agendamento do servidor</td> </tr><tr><td>--no-defaults</td> <td>Não ler arquivos de opção</td> </tr><tr><td>--limite-de-arquivos-abertos</td> <td>Número de arquivos que o mysqld deve ser capaz de abrir</td> </tr><tr><td>--pid-file</td> <td>Nome do caminho do arquivo de ID do processo do servidor</td> </tr><tr><td>--plugin-dir</td> <td>Diretório onde os plugins são instalados</td> </tr><tr><td>--port</td> <td>Número de porta para ouvir conexões TCP/IP</td> </tr><tr><td>--skip-kill-mysqld</td> <td>Não tente matar processos de mysqld errantes</td> </tr><tr><td>--skip-syslog</td> <td>Não escreva mensagens de erro no syslog; use o arquivo de log de erro</td> </tr><tr><td>--socket</td> <td>Arquivo de soquete para ouvir conexões de soquete Unix</td> </tr><tr><td>--syslog</td> <td>Escreva mensagens de erro no syslog</td> </tr><tr><td>--syslog-tag</td> <td>Sufixo de etiqueta para mensagens escritas no syslog</td> </tr><tr><td>--timezone</td> <td>Defina a variável de ambiente de fuso horário TZ para o valor nomeado</td> </tr><tr><td>--user</td> <td>Execute o mysqld como usuário com o nome user_name ou ID de usuário numérico user_id</td> </tr></tbody></table>

- `--help`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  Exiba uma mensagem de ajuda e saia.

- `--basedir=dir_name`

  <table summary="Propriedades para basedir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--basedir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  O caminho para o diretório de instalação do MySQL.

- `--core-file-size=size`

  <table summary="Propriedades para tamanho do arquivo de núcleo"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--core-file-size=size</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>

  O tamanho do arquivo de núcleo que o **mysqld** deve ser capaz de criar. O valor da opção é passado para **ulimit -c**.

  Nota

  A variável `innodb_buffer_pool_in_core_file` pode ser usada para reduzir o tamanho dos arquivos de núcleo em sistemas operacionais que a suportam. Para mais informações, consulte a Seção 17.8.3.7, “Excluindo Páginas do Pool de Buffer dos Arquivos de Núcleo”.

- `--datadir=dir_name`

  <table summary="Propriedades para datadir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--datadir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  O caminho para o diretório de dados.

- `--defaults-extra-file=file_name`

  <table summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-extra-file=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Leia este arquivo de opção em adição aos arquivos de opção usuais. Se o arquivo não existir ou estiver inacessível, o servidor sai com um erro. Se `file_name` não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual. Isso deve ser a primeira opção na linha de comando se ela for usada.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--defaults-file=file_name`

  <table summary="Propriedades para arquivo de falhas"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-file=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou estiver inacessível, o servidor sai com um erro. Se `file_name` não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual. Isso deve ser a primeira opção na linha de comando se for usada.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--ledir=dir_name`

  <table summary="Propriedades para ledir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ledir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  Se o **mysqld\_safe** não conseguir encontrar o servidor, use esta opção para indicar o nome do caminho para o diretório onde o servidor está localizado.

  Esta opção é aceita apenas na linha de comando, não em arquivos de opção. Em plataformas que usam o systemd, o valor pode ser especificado no valor de `MYSQLD_OPTS`. Veja a Seção 2.5.9, “Gerenciando o servidor MySQL com o systemd”.

- `--log-error=file_name`

  <table summary="Propriedades para log-error"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-error=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Escreva o log de erro no arquivo fornecido. Veja a Seção 7.4.2, “O Log de Erro”.

- `--mysqld-safe-log-timestamps`

  <table summary="Propriedades para mysqld-safe-log-timestamps"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqld-safe-log-timestamps=type</code>]]</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>utc</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>system</code>]]</p><p class="valid-value">[[<code>hyphen</code>]]</p><p class="valid-value">[[<code>legacy</code>]]</p></td> </tr></tbody></table>

  Esta opção controla o formato dos timestamps na saída de log produzida pelo **mysqld\_safe**. A lista a seguir descreve os valores permitidos. Para qualquer outro valor, o **mysqld\_safe** registra uma mensagem de aviso e usa o formato `UTC`.

  - `UTC`, `utc`

    Formato ISO 8601 UTC (mesmo que `--log_timestamps=UTC` para o servidor). Este é o padrão.

  - `SYSTEM`, `system`

    Formato de hora local ISO 8601 (o mesmo que `--log_timestamps=SYSTEM` para o servidor).

  - `HYPHEN`, `hyphen`

    Formato `YY-MM-DD h:mm:ss`, como no **mysqld\_safe** para MySQL 5.6.

  - `LEGACY`, `legacy`

    Formato `YYMMDD hh:mm:ss`, como no **mysqld\_safe** antes do MySQL 5.6.

- `--malloc-lib=[lib_name]`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>0

  O nome da biblioteca a ser usado para alocação de memória em vez da biblioteca do sistema `malloc()`. O valor da opção deve ser um dos diretórios `/usr/lib`, `/usr/lib64`, `/usr/lib/i386-linux-gnu` ou `/usr/lib/x86_64-linux-gnu`.

  A opção `--malloc-lib` funciona modificando o valor do ambiente `LD_PRELOAD` para afetar o link dinâmico, permitindo que o carregador encontre a biblioteca de alocação de memória quando o **mysqld** estiver em execução:

  - Se a opção não for fornecida ou for fornecida sem um valor (`--malloc-lib=`), `LD_PRELOAD` não é modificado e não há tentativa de usar `tcmalloc`.

  - Antes do MySQL 8.0.21, se a opção for fornecida como `--malloc-lib=tcmalloc`, o **mysqld\_safe** procura por uma biblioteca `tcmalloc` em `/usr/lib`. Se `tmalloc` for encontrado, seu nome de caminho é adicionado ao início do valor `LD_PRELOAD` para **mysqld**. Se `tcmalloc` não for encontrado, o **mysqld\_safe** interrompe com um erro.

    A partir do MySQL 8.0.21, `tcmalloc` não é um valor permitido para a opção `--malloc-lib`.

  - Se a opção for fornecida como `--malloc-lib=/path/to/some/library`, esse caminho completo é adicionado ao início do valor `LD_PRELOAD`. Se o caminho completo apontar para um arquivo inexistente ou ilegível, o **mysqld\_safe** interrompe com um erro.

  - Nos casos em que o **mysqld\_safe** adiciona um nome de caminho ao `LD_PRELOAD`, ele adiciona o caminho ao início de qualquer valor existente que a variável já tenha.

  Nota

  Em sistemas que gerenciam o servidor usando o systemd, **mysqld\_safe** não está disponível. Em vez disso, especifique a biblioteca de alocação definindo `LD_PRELOAD` em `/etc/sysconfig/mysql`.

  Os usuários do Linux podem usar a biblioteca `libtcmalloc_minimal.so` em qualquer plataforma para a qual um pacote `tcmalloc` esteja instalado em `/usr/lib` adicionando essas linhas ao arquivo `my.cnf`:

  ```
  [mysqld_safe]
  malloc-lib=tcmalloc
  ```

  Para usar uma biblioteca específica `tcmalloc`, especifique seu nome completo. Exemplo:

  ```
  [mysqld_safe]
  malloc-lib=/opt/lib/libtcmalloc_minimal.so
  ```

- `--mysqld=prog_name`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>1

  O nome do programa do servidor (no diretório `ledir`), que você deseja iniciar. Esta opção é necessária se você estiver usando a distribuição binária do MySQL, mas tiver o diretório de dados fora da distribuição binária. Se o **mysqld\_safe** não conseguir encontrar o servidor, use a opção `--ledir` para indicar o nome do caminho para o diretório onde o servidor está localizado.

  Esta opção é aceita apenas na linha de comando, não em arquivos de opção. Em plataformas que usam o systemd, o valor pode ser especificado no valor de `MYSQLD_OPTS`. Veja a Seção 2.5.9, “Gerenciando o servidor MySQL com o systemd”.

- `--mysqld-version=suffix`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>2

  Esta opção é semelhante à opção `--mysqld`, mas você especifica apenas o sufixo para o nome do programa do servidor. O nome base é assumido como **mysqld**. Por exemplo, se você usar `--mysqld-version=debug`, **mysqld\_safe** inicia o programa **mysqld-debug** no diretório `ledir`. Se o argumento para `--mysqld-version` estiver vazio, **mysqld\_safe** usa **mysqld** no diretório `ledir`.

  Esta opção é aceita apenas na linha de comando, não em arquivos de opção. Em plataformas que usam o systemd, o valor pode ser especificado no valor de `MYSQLD_OPTS`. Veja a Seção 2.5.9, “Gerenciando o servidor MySQL com o systemd”.

- `--nice=priority`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>3

  Use o programa `nice` para definir a prioridade de agendamento do servidor no valor fornecido.

- `--no-defaults`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>4

  Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para impedir que sejam lidas. Isso deve ser a primeira opção na linha de comando se for usado.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--open-files-limit=count`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>5

  O número de arquivos que o **mysqld** deve ser capaz de abrir. O valor da opção é passado para **ulimit -n**.

  Nota

  Você deve iniciar o **mysqld\_safe** como `root` para que isso funcione corretamente.

- `--pid-file=file_name`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>6

  O nome do caminho que o **mysqld** deve usar para o arquivo de ID de processo.

- `--plugin-dir=dir_name`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>7

  O nome do caminho do diretório do plugin.

- `--port=port_num`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>8

  O número de porta que o servidor deve usar ao ouvir conexões TCP/IP. O número de porta deve ser 1024 ou superior, a menos que o servidor seja iniciado pelo usuário do sistema operacional `root`.

- `--skip-kill-mysqld`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>9

  Não tente matar os processos de **mysqld** soltos durante o arranque. Esta opção só funciona no Linux.

- `--socket=path`

  <table summary="Propriedades para basedir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--basedir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>0

  O arquivo de socket Unix que o servidor deve usar ao ouvir conexões locais.

- `--syslog`, `--skip-syslog`

  <table summary="Propriedades para basedir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--basedir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>1

  <table summary="Propriedades para basedir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--basedir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>2

  `--syslog` envia mensagens de erro para `syslog` em sistemas que suportam o programa **logger**. `--skip-syslog` suprime o uso de `syslog`; as mensagens são escritas em um arquivo de log de erro.

  Quando o `syslog` é usado para registro de erros, a facilidade/gravidade `daemon.err` é usada para todas as mensagens de log.

  O uso dessas opções para controlar o registro do **mysqld** está desatualizado. Para gravar a saída do log de erro no log do sistema, use as instruções na Seção 7.4.2.8, “Registro de Erros no Log do Sistema”. Para controlar a facilidade, use a variável de sistema `log_syslog_facility`.

- `--syslog-tag=tag`

  <table summary="Propriedades para basedir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--basedir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>3

  Para o registro em `syslog`, as mensagens do **mysqld\_safe** e **mysqld** são escritas com identificadores de `mysqld_safe` e `mysqld`, respectivamente. Para especificar um sufixo para os identificadores, use `--syslog-tag=tag`, que modifica os identificadores para serem `mysqld_safe-tag` e `mysqld-tag`.

  A utilização desta opção para controlar o registro do **mysqld** está desaconselhada. Use a variável de sistema `log_syslog_tag` do servidor em vez disso. Consulte a Seção 7.4.2.8, “Registro de Erros no Log do Sistema”.

- `--timezone=timezone`

  <table summary="Propriedades para basedir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--basedir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>4

  Defina a variável de ambiente `TZ` do fuso horário para o valor da opção fornecido. Consulte a documentação do seu sistema operacional para obter os formatos de especificação de fuso horário legal.

- `--user={user_name|user_id}`

  <table summary="Propriedades para basedir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--basedir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>5

  Execute o servidor **mysqld** como o usuário com o nome `user_name` ou o ID de usuário numérico `user_id`. (“Usuário” neste contexto se refere a uma conta de login do sistema, não a um usuário MySQL listado nas tabelas de concessão.)

Se você executar o **mysqld\_safe** com a opção `--defaults-file` ou `--defaults-extra-file` para nomear um arquivo de opções, a opção deve ser a primeira fornecida na linha de comando ou o arquivo de opções não será usado. Por exemplo, este comando não usa o arquivo de opção nomeado:

```
mysql> mysqld_safe --port=port_num --defaults-file=file_name
```

Em vez disso, use o seguinte comando:

```
mysql> mysqld_safe --defaults-file=file_name --port=port_num
```

O script **mysqld\_safe** é escrito de forma que ele possa normalmente iniciar um servidor que foi instalado a partir de uma distribuição de fonte ou binária do MySQL, embora esses tipos de distribuições geralmente instalem o servidor em locais ligeiramente diferentes. (Veja a Seção 2.1.5, “Layouts de Instalação”.) O **mysqld\_safe** espera que uma das seguintes condições seja verdadeira:

- O servidor e os bancos de dados podem ser encontrados em relação ao diretório de trabalho (o diretório a partir do qual o **mysqld\_safe** é invocado). Para distribuições binárias, o **mysqld\_safe** procura nos diretórios `bin` e `data` do seu diretório de trabalho. Para distribuições de código-fonte, ele procura nos diretórios `libexec` e `var`. Esta condição deve ser atendida se você executar o **mysqld\_safe** a partir do diretório de instalação do MySQL (por exemplo, `/usr/local/mysql` para uma distribuição binária).

- Se o servidor e os bancos de dados não puderem ser encontrados em relação ao diretório de trabalho, o **mysqld\_safe** tenta localizá-los por nomes de caminho absolutos. Os locais típicos são `/usr/local/libexec` e `/usr/local/var`. Os locais reais são determinados pelos valores configurados na distribuição no momento em que ela foi construída. Eles devem estar corretos se o MySQL estiver instalado no local especificado na hora da configuração.

Como o **mysqld\_safe** tenta encontrar o servidor e os bancos de dados em relação ao seu próprio diretório de trabalho, você pode instalar uma distribuição binária do MySQL em qualquer lugar, desde que você execute o **mysqld\_safe** a partir do diretório de instalação do MySQL:

```
cd mysql_installation_directory
bin/mysqld_safe &
```

Se o **mysqld\_safe** falhar, mesmo quando invocado a partir do diretório de instalação do MySQL, especifique as opções `--ledir` e `--datadir` para indicar os diretórios nos quais o servidor e os bancos de dados estão localizados no seu sistema.

O **mysqld\_safe** tenta usar as ferramentas de sistema **sleep** e **date** para determinar quantas vezes por segundo ele tentou iniciar. Se essas ferramentas estiverem presentes e as tentativas de início por segundo forem maiores que 5, o **mysqld\_safe** aguarda 1 segundo completo antes de iniciar novamente. Isso visa evitar o uso excessivo da CPU em caso de falhas repetidas. (Bug #11761530, Bug #54035)

Quando você usa **mysqld\_safe** para iniciar o **mysqld**, **mysqld\_safe** garante que as mensagens de erro (e de aviso) do próprio **mysqld** e do **mysqld** sejam direcionadas para o mesmo destino.

Existem várias opções do **mysqld\_safe** para controlar o destino dessas mensagens:

- `--log-error=file_name`: Escreva mensagens de erro no arquivo de erro nomeado.

- `--syslog`: Escreva mensagens de erro para `syslog` em sistemas que suportam o programa **logger**.

- `--skip-syslog`: Não escreva mensagens de erro no `syslog`. As mensagens são escritas no arquivo de log de erro padrão (`host_name.err` no diretório de dados) ou em um arquivo nomeado se a opção `--log-error` for fornecida.

Se nenhuma dessas opções for fornecida, o padrão é `--skip-syslog`.

Quando o **mysqld\_safe** escreve uma mensagem, os avisos são enviados para o destino de registro (`syslog` ou o arquivo de registro de erros) e `stdout`. Os erros são enviados para o destino de registro e `stderr`.

Nota

O controle do registro do **mysqld** a partir do **mysqld\_safe** está desatualizado. Use o suporte nativo do servidor `syslog` em vez disso. Para mais informações, consulte a Seção 7.4.2.8, “Registro de Erros no Log do Sistema”.
