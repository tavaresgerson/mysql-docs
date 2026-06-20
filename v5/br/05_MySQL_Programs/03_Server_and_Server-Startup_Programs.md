## 4.3 Servidor e programas de inicialização do servidor

Esta seção descreve o `mysqld`, o servidor MySQL e vários programas que são usados para iniciar o servidor.

### 4.3.1 mysqld — O servidor MySQL

`mysqld`, também conhecido como MySQL Server, é um único programa multithread que faz a maior parte do trabalho em uma instalação do MySQL. Ele não gera processos adicionais. O MySQL Server gerencia o acesso ao diretório de dados do MySQL que contém bancos de dados e tabelas. O diretório de dados também é o local padrão para outras informações, como arquivos de log e arquivos de status.

Nota

Alguns pacotes de instalação contêm uma versão de depuração do servidor chamada **mysqld-debug**. Invoque essa versão em vez de `mysqld` para suporte de depuração, verificação de alocação de memória e suporte a arquivos de rastreamento (consulte Seção 5.8.1.2, “Criando arquivos de rastreamento”).

Quando o servidor MySQL é iniciado, ele escuta as conexões de rede dos programas de cliente e gerencia o acesso aos bancos de dados em nome desses clientes.

O programa `mysqld` tem muitas opções que podem ser especificadas na inicialização. Para uma lista completa das opções, execute este comando:

```sql
mysqld --verbose --help
```

O MySQL Server também possui um conjunto de variáveis de sistema que afetam sua operação conforme ela é executada. As variáveis de sistema podem ser definidas na inicialização do servidor e muitas delas podem ser alteradas em tempo de execução para efetuar uma reconfiguração dinâmica do servidor. O MySQL Server também possui um conjunto de variáveis de status que fornecem informações sobre sua operação. Você pode monitorar essas variáveis de status para acessar as características de desempenho em tempo de execução.

Para uma descrição completa das opções de comando do MySQL Server, das variáveis do sistema e das variáveis de status, consulte a Seção 5.1, "O MySQL Server". Para informações sobre a instalação do MySQL e a configuração inicial, consulte o Capítulo 2, *Instalando e Atualizando o MySQL*.

### 4.3.2 `mysqld_safe` — Script de inicialização do MySQL Server

`mysqld_safe` é a maneira recomendada para iniciar um servidor `mysqld` no Unix. `mysqld_safe` adiciona algumas funcionalidades de segurança, como reiniciar o servidor quando ocorre um erro e registrar informações de execução em um log de erro. Uma descrição do registro de erros é dada mais adiante nesta seção.

Nota

Para algumas plataformas Linux, a instalação do MySQL a partir de pacotes RPM ou Debian inclui suporte do systemd para gerenciar o início e o desligamento do servidor MySQL. Nessas plataformas, `mysqld_safe` não é instalado porque é desnecessário. Para mais informações, consulte a Seção 2.5.10, “Gerenciamento do servidor MySQL com o systemd”.

Uma implicação da não utilização de `mysqld_safe` em plataformas que utilizam systemd para gerenciamento de servidor é que o uso de seções `[mysqld_safe]` ou `[safe_mysqld]` em arquivos de opção não é suportado e pode levar a comportamento inesperado.

`mysqld_safe` tenta iniciar um executável chamado `mysqld`. Para substituir o comportamento padrão e especificar explicitamente o nome do servidor que você deseja executar, especifique uma opção `--mysqld` ou `--mysqld-version` para `mysqld_safe`. Você também pode usar `--ledir` para indicar o diretório onde `mysqld_safe` deve procurar o servidor.

Muitas das opções para `mysqld_safe` são as mesmas das opções para `mysqld`. Veja a Seção 5.1.6, “Opções de comando do servidor”.

Opções desconhecidas para `mysqld_safe` são passadas para `mysqld` se elas forem especificadas na string de comando, mas ignoradas se forem especificadas no grupo `[mysqld_safe]` de um arquivo de opções. Veja a Seção 4.2.2.2, “Usando arquivos de opções”.

`mysqld_safe` lê todas as opções das seções `[mysqld]`, `[server]` e `[mysqld_safe]` nos arquivos de opções. Por exemplo, se você especificar uma seção `[mysqld]` assim, `mysqld_safe` encontra e usa a opção `--log-error`:

```sql
[mysqld]
log-error=error.log
```

Para compatibilidade reversa, `mysqld_safe` também lê as seções de `[safe_mysqld]`, mas para ser atual, você deve renomear essas seções para `[mysqld_safe]`.

`mysqld_safe` aceita opções na string de comando e em arquivos de opção, conforme descrito na tabela a seguir. Para informações sobre arquivos de opção usados por programas MySQL, consulte a Seção 4.2.2.2, “Usando arquivos de opção”.

**Tabela 4.6 `mysqld_safe` Opções**

<table frame="box" rules="all" summary="Command-line options available for mysqld_safe.">
<col style="width: 27%"/>
<col style="width: 50%"/>
<col style="width: 11%"/>
<col style="width: 11%"/>
<thead>
<tr>
<th>Option Name</th>
<th>Description</th>
<th>Introduced</th>
<th>Deprecated</th>
</tr>
</thead>
<tbody>
<tr>
<th><code>--basedir</code></th>
<td>Caminho para o diretório de instalação do MySQL</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--core-file-size</code></th>
<td>Tamanho do arquivo do núcleo que o mysqld deve ser capaz de criar</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--datadir</code></th>
<td>Caminho para o diretório de dados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-extra-file</code></th>
<td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-file</code></th>
<td>Arquivo de opção de leitura apenas nomeado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--help</code></th>
<td>Exibir mensagem de ajuda e sair</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ledir</code></th>
<td>Caminho para o diretório onde o servidor está localizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--log-error</code></th>
<td>Escreva o log de erro em um arquivo nomeado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--malloc-lib</code></th>
<td>Biblioteca malloc alternativa a ser usada para mysqld</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--mysqld</code></th>
<td>Nome do programa do servidor para iniciar (no diretório ledir)</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--mysqld-safe-log-timestamps</code></th>
<td>Timestamp format for logging</td>
<td>5.7.11</td>
<td></td>
</tr>
<tr>
<th><code>--mysqld-version</code></th>
<td>Sufixo para o nome do programa do servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--nice</code></th>
<td>Use um programa agradável para definir a prioridade de agendamento do servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--no-defaults</code></th>
<td>Não leia arquivos de opção</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--open-files-limit</code></th>
<td>Número de arquivos que o mysqld deve ser capaz de abrir</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--pid-file</code></th>
<td>Nome do caminho do arquivo de ID do processo do servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--plugin-dir</code></th>
<td>Diretório onde os plugins são instalados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--port</code></th>
<td>Port number on which to listen for TCP/IP connections</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--skip-kill-mysqld</code></th>
<td>Não tente matar processos de mysqld errantes</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--skip-syslog</code></th>
<td>Não escreva mensagens de erro no syslog; use o arquivo de registro de erro</td>
<td></td>
<td>Sim</td>
</tr>
<tr>
<th><code>--socket</code></th>
<td>Ficheiro de soquete para ouvir conexões de soquete Unix</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--syslog</code></th>
<td>Write error messages to syslog</td>
<td></td>
<td>Yes</td>
</tr>
<tr>
<th><code>--syslog-tag</code></th>
<td>Sufixo de etiqueta para mensagens escritas para syslog</td>
<td></td>
<td>Sim</td>
</tr>
<tr>
<th><code>--timezone</code></th>
<td>Defina a variável de ambiente de fuso horário TZ para o valor nomeado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--user</code></th>
<td>Run mysqld as user having name user_name or numeric user ID user_id</td>
<td></td>
<td></td>
</tr>
</tbody>
</table>

* `--help`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Exibir uma mensagem de ajuda e sair.

* `--basedir=dir_name`

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

O caminho para o diretório de instalação do MySQL.

* `--core-file-size=size`

  <table frame="box" rules="all" summary="Properties for core-file-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--core-file-size=size</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  <table frame="box" rules="all" summary="Properties for core-file-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--core-file-size=size</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

O tamanho do arquivo de núcleo que o `mysqld` deve ser capaz de criar. O valor da opção é passado para **ulimit -c**.

* `--datadir=dir_name`

  <table frame="box" rules="all" summary="Properties for datadir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--datadir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  <table frame="box" rules="all" summary="Properties for datadir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--datadir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

O caminho para o diretório de dados.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>0

Leia este arquivo de opção em adição aos arquivos de opção usuais. Se o arquivo não existir ou não for acessível, o servidor sai com um erro. Se *`file_name`* não for um nome de caminho absoluto, ele é interpretado em relação ao diretório atual. Isso deve ser a primeira opção na string de comando se for usada.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>1

Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou não for acessível, o servidor sai com um erro. Se *`file_name`* não for um nome de caminho absoluto, ele é interpretado em relação ao diretório atual. Isso deve ser a primeira opção na string de comando se for usada.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--ledir=dir_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>2

Se o `mysqld_safe` não conseguir encontrar o servidor, use esta opção para indicar o nome do caminho para o diretório onde o servidor está localizado.

A partir do MySQL 5.7.17, essa opção é aceita apenas na string de comando, não em arquivos de opção. Em plataformas que utilizam o systemd, o valor pode ser especificado no valor de `MYSQLD_OPTS`. Veja a Seção 2.5.10, “Gerenciando o servidor MySQL com o systemd”.

* `--log-error=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>3

Escreva o log de erro no arquivo fornecido. Veja a Seção 5.4.2, “O Log de Erro”.

* `--mysqld-safe-log-timestamps`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>4

Esta opção controla o formato dos timestamps na saída de logs produzida pelo `mysqld_safe`. A lista a seguir descreve os valores permitidos. Para qualquer outro valor, o `mysqld_safe` registra um aviso e utiliza o formato do `UTC`.

+ `UTC`, `utc`

Formato ISO 8601 UTC (mesmo que `--log_timestamps=UTC` para o servidor). Este é o padrão.

+ `SYSTEM`, `system`

Formato de hora local ISO 8601 (mesmo que `--log_timestamps=SYSTEM` para o servidor).

+ `HYPHEN`, `hyphen`

*`YY-MM-DD h:mm:ss`* formato, como em `mysqld_safe` para MySQL 5.6.

+ `LEGACY`, `legacy`

*`YYMMDD hh:mm:ss`* formato, como em `mysqld_safe` antes do MySQL 5.6.

Essa opção foi adicionada no MySQL 5.7.11.

* `--malloc-lib=[lib_name]`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>5

O nome da biblioteca a ser usado para alocação de memória em vez da biblioteca do sistema `malloc()`. A partir do MySQL 5.7.15, o valor da opção deve ser um dos diretórios `/usr/lib`, `/usr/lib64`, `/usr/lib/i386-linux-gnu` ou `/usr/lib/x86_64-linux-gnu`. Antes do MySQL 5.7.15, qualquer biblioteca pode ser usada especificando seu nome de caminho, mas há um formulário de atalho para habilitar o uso da biblioteca `tcmalloc` que é fornecida com as distribuições binárias do MySQL para Linux no MySQL 5.7. É possível que o formulário de atalho não funcione em determinadas configurações, nesse caso, você deve especificar um nome de caminho.

Nota

A partir do MySQL 5.7.13, as distribuições do MySQL não incluem mais a biblioteca `tcmalloc`.

A opção `--malloc-lib` funciona modificando o valor do ambiente `LD_PRELOAD` para afetar o link dinâmico, permitindo que o carregador encontre a biblioteca de alocação de memória quando o `mysqld` é executado:

+ Se a opção não for fornecida, ou for fornecida sem um valor (`--malloc-lib=`), `LD_PRELOAD` não é modificado e não há tentativa de usar `tcmalloc`.

+ Antes do MySQL 5.7.31, se a opção for fornecida como `--malloc-lib=tcmalloc`, `mysqld_safe` procura uma biblioteca `tcmalloc` em `/usr/lib` e, em seguida, no local do MySQL `pkglibdir` (por exemplo, `/usr/local/mysql/lib` ou o que for apropriado). Se `tmalloc` for encontrado, seu nome de caminho é adicionado ao início do valor `LD_PRELOAD` para `mysqld`. Se `tcmalloc` não for encontrado, `mysqld_safe` interrompe com um erro.

A partir do MySQL 5.7.31, `tcmalloc` não é um valor permitido para a opção `--malloc-lib`.

+ Se a opção for fornecida como `--malloc-lib=/path/to/some/library`, esse caminho completo é adicionado ao início do valor `LD_PRELOAD`. Se o caminho completo apontar para um arquivo inexistente ou ilegível, `mysqld_safe` abortará com um erro.

+ Para casos em que `mysqld_safe` adiciona um nome de caminho a `LD_PRELOAD`, ele adiciona o caminho ao início de qualquer valor existente que a variável já tenha.

Nota

Em sistemas que gerenciam o servidor usando systemd, `mysqld_safe` não está disponível. Em vez disso, especifique a biblioteca de alocação definindo `LD_PRELOAD` em `/etc/sysconfig/mysql`.

Os usuários do Linux podem usar o `libtcmalloc_minimal.so` incluído em pacotes binários, adicionando essas strings ao arquivo `my.cnf`:

  ```sql
  [mysqld_safe]
  malloc-lib=tcmalloc
  ```

Essas strings também são suficientes para usuários em qualquer plataforma que tenham instalado um pacote `tcmalloc` em `/usr/lib`. Para usar uma biblioteca específica `tcmalloc`, especifique seu nome completo. Exemplo:

  ```sql
  [mysqld_safe]
  malloc-lib=/opt/lib/libtcmalloc_minimal.so
  ```

* `--mysqld=prog_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>6

O nome do programa do servidor (no diretório `ledir`) que você deseja iniciar. Esta opção é necessária se você usar a distribuição binária do MySQL, mas tiver o diretório de dados fora da distribuição binária. Se o `mysqld_safe` não conseguir encontrar o servidor, use a opção `--ledir` para indicar o nome do caminho para o diretório onde o servidor está localizado.

A partir do MySQL 5.7.15, essa opção é aceita apenas na string de comando, não em arquivos de opção. Em plataformas que utilizam o systemd, o valor pode ser especificado no valor de `MYSQLD_OPTS`. Veja a Seção 2.5.10, “Gerenciando o servidor MySQL com o systemd”.

* `--mysqld-version=suffix`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>7

Esta opção é semelhante à opção `--mysqld`, mas você especifica apenas o sufixo para o nome do programa do servidor. O nome base é assumido como sendo `mysqld`. Por exemplo, se você usar `--mysqld-version=debug`, `mysqld_safe` inicia o programa **mysqld-debug** no diretório `ledir`. Se o argumento para `--mysqld-version` estiver vazio, `mysqld_safe` usa `mysqld` no diretório `ledir`.

A partir do MySQL 5.7.15, essa opção é aceita apenas na string de comando, não em arquivos de opção. Em plataformas que utilizam o systemd, o valor pode ser especificado no valor de `MYSQLD_OPTS`. Veja a Seção 2.5.10, “Gerenciando o servidor MySQL com o systemd”.

* `--nice=priority`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>8

Use o programa `nice` para definir a prioridade de agendamento do servidor no valor fornecido.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>9

Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para impedir que sejam lidas. Isso deve ser a primeira opção na string de comando se for usada.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--open-files-limit=count`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>0

O número de arquivos que o `mysqld` deve ser capaz de abrir. O valor da opção é passado para **ulimit -n**.

Nota

Você deve começar `mysqld_safe` como `root` para que isso funcione corretamente.

* `--pid-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

O nome do caminho que `mysqld` deve usar para seu arquivo de ID de processo.

De MySQL 5.7.2 para 5.7.17, `mysqld_safe` tem seu próprio arquivo de ID de processo, que é sempre chamado `mysqld_safe.pid` e localizado no diretório de dados do MySQL.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

O nome do caminho do diretório do plugin.

* `--port=port_num`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

O número de porta que o servidor deve usar ao ouvir conexões TCP/IP. O número de porta deve ser 1024 ou superior, a menos que o servidor seja iniciado pelo usuário do sistema operacional `root`.

* `--skip-kill-mysqld`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Não tente matar processos de `mysqld` soltos no início. Esta opção só funciona no Linux.

* `--socket=path`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

O arquivo de socket Unix que o servidor deve usar ao ouvir conexões locais.

* `--syslog`, `--skip-syslog`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

`--syslog` envia mensagens de erro para `syslog` em sistemas que suportam o programa **logger**. `--skip-syslog` suprime o uso de `syslog`; as mensagens são escritas em um arquivo de registro de erro.

Quando o `syslog` é usado para registro de erros, a facilidade/gravidade `daemon.err` é usada para todas as mensagens de log.

O uso dessas opções para controlar o registro do `mysqld` é desaconselhável a partir do MySQL 5.7.5. Use a variável de sistema do servidor `log_syslog` em vez disso. Para controlar a facilidade, use a variável de sistema do servidor `log_syslog_facility`. Veja a Seção 5.4.2.3, “Registro de Erros no Log do Sistema”.

* `--syslog-tag=tag`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Para a contabilização em `syslog`, as mensagens de `mysqld_safe` e `mysqld` são escritas com identificadores de `mysqld_safe` e `mysqld`, respectivamente. Para especificar um sufixo para os identificadores, use `--syslog-tag=tag`, que modifica os identificadores para serem `mysqld_safe-tag` e `mysqld-tag`.

A utilização desta opção para controlar o registro do `mysqld` é desaconselhada a partir do MySQL 5.7.5. Utilize a variável de sistema do servidor `log_syslog_tag` em vez disso. Consulte a Seção 5.4.2.3, “Registro de Erros no Log do Sistema”.

* `--timezone=timezone`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Defina a variável de ambiente de fuso horário `TZ` para o valor da opção fornecida. Consulte a documentação do seu sistema operacional para os formatos de especificação de fuso horário legal.

* `--user={user_name|user_id}`

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>0

Execute o servidor `mysqld` como o usuário com o nome *`user_name`* ou o ID de usuário numérico *`user_id`*. (“Usuário” neste contexto se refere a uma conta de login do sistema, não a um usuário MySQL listado nas tabelas de concessão.)

Se você executar `mysqld_safe` com a opção `--defaults-file` ou `--defaults-extra-file` para nomear um arquivo de opção, a opção deve ser a primeira fornecida na string de comando ou o arquivo de opção não é usado. Por exemplo, este comando não usa o arquivo de opção nomeado:

```sql
mysql> mysqld_safe --port=port_num --defaults-file=file_name
```

Em vez disso, use o seguinte comando:

```sql
mysql> mysqld_safe --defaults-file=file_name --port=port_num
```

O script `mysqld_safe` é escrito de forma que ele normalmente possa iniciar um servidor que foi instalado a partir de uma fonte ou uma distribuição binária do MySQL, embora esses tipos de distribuições geralmente instalem o servidor em locais ligeiramente diferentes. (Veja a Seção 2.1.5, “Layouts de Instalação”.) `mysqld_safe` espera que uma das seguintes condições seja verdadeira:

* O servidor e os bancos de dados podem ser encontrados em relação ao diretório de trabalho (o diretório a partir do qual o `mysqld_safe` é invocado). Para distribuições binárias, o `mysqld_safe` procura nos diretórios `bin` e `data` do seu diretório de trabalho. Para distribuições de fonte, ele procura nos diretórios `libexec` e `var`. Esta condição deve ser atendida se você executar o `mysqld_safe` do seu diretório de instalação do MySQL (por exemplo, `/usr/local/mysql` para uma distribuição binária).

* Se o servidor e os bancos de dados não puderem ser encontrados em relação ao diretório de trabalho, `mysqld_safe` tenta localizá-los por nomes de caminho absolutos. Os locais típicos são `/usr/local/libexec` e `/usr/local/var`. Os locais reais são determinados pelos valores configurados na distribuição no momento em que foi construída. Eles devem estar corretos se o MySQL estiver instalado na localização especificada no momento da configuração.

Como o `mysqld_safe` tenta encontrar o servidor e os bancos de dados em relação ao seu próprio diretório de trabalho, você pode instalar uma distribuição binária do MySQL em qualquer lugar, desde que você execute o `mysqld_safe` a partir do diretório de instalação do MySQL:

```sql
cd mysql_installation_directory
bin/mysqld_safe &
```

Se o `mysqld_safe` falhar, mesmo quando invocado a partir do diretório de instalação do MySQL, especifique as opções `--ledir` e `--datadir` para indicar os diretórios nos quais o servidor e os bancos de dados estão localizados no seu sistema.

`mysqld_safe` tenta usar os utilitários de sistema de **sono** e **data** para determinar quantas vezes por segundo ele tentou iniciar. Se esses utilitários estiverem presentes e os inícios tentados por segundo forem maiores que 5, `mysqld_safe` aguarda 1 segundo completo antes de iniciar novamente. Isso visa prevenir o uso excessivo da CPU em caso de falhas repetidas. (Bug #11761530, Bug #54035)

Quando você usa `mysqld_safe` para iniciar `mysqld`, `mysqld_safe` organiza para que as mensagens de erro (e de aviso) de si mesmo e de `mysqld` vão para o mesmo destino.

Existem várias opções de `mysqld_safe` para controlar o destino dessas mensagens:

* `--log-error=file_name`: Escreva mensagens de erro para o arquivo de erro nomeado.

* `--syslog`: Escreva mensagens de erro para `syslog` em sistemas que suportam o programa **logger**.

* `--skip-syslog`: Não escreva mensagens de erro para `syslog`. As mensagens são escritas no arquivo de log de erro padrão (`host_name.err` no diretório de dados), ou em um arquivo nomeado se a opção `--log-error` for dada.

Se nenhuma dessas opções for fornecida, o padrão é `--skip-syslog`.

Quando o `mysqld_safe` escreve uma mensagem, os avisos são enviados para o destino de registro (`syslog` ou o arquivo de registro de erro) e `stdout`. Os erros são enviados para o destino de registro e `stderr`.

Nota

O controle da `mysqld` de registro a partir de `mysqld_safe` é descontinuado a partir do MySQL 5.7.5. Use o suporte nativo do servidor para `syslog` em vez disso. Para mais informações, consulte a Seção 5.4.2.3, “Registro de erro no log do sistema”.

### 4.3.3 mysql.server — Script de inicialização do servidor MySQL

As distribuições do MySQL em sistemas Unix e semelhantes incluem um script chamado **mysql.server**, que inicia o servidor MySQL usando `mysqld_safe`. Ele pode ser usado em sistemas como Linux e Solaris que utilizam diretórios de execução de estilo System V para iniciar e parar serviços do sistema. Também é usado pelo Item de Inicialização do macOS para MySQL.

**mysql.server** é o nome do script utilizado na árvore de código-fonte do MySQL. O nome instalado pode ser diferente (por exemplo, `mysqld` ou **mysql**). Na discussão a seguir, ajuste o nome **mysql.server** conforme necessário para o seu sistema.

Nota

Para algumas plataformas Linux, a instalação do MySQL a partir de pacotes RPM ou Debian inclui suporte do systemd para gerenciar o início e o desligamento do servidor MySQL. Nessas plataformas, **mysql.server** e `mysqld_safe` não são instalados porque são desnecessários. Para mais informações, consulte a Seção 2.5.10, “Gerenciamento do servidor MySQL com o systemd”.

Para iniciar ou parar o servidor manualmente usando o script **mysql.server**, invóvel-o a partir da string de comando com os argumentos `start` ou `stop`:

```sql
mysql.server start
mysql.server stop
```

**mysql.server** muda a localização para o diretório de instalação do MySQL, e então invoca `mysqld_safe`. Para executar o servidor como um usuário específico, adicione uma opção apropriada `user` ao grupo `[mysqld]` do arquivo de opção global `/etc/my.cnf`, conforme mostrado mais adiante nesta seção. (É possível que você precise editar **mysql.server** se você instalou uma distribuição binária do MySQL em um local não padrão. Modifique-o para alterar a localização para o diretório apropriado antes de executar `mysqld_safe`. Se você fizer isso, sua versão modificada de **mysql.server** pode ser sobrescrita se você atualizar o MySQL no futuro; faça uma cópia da sua versão editada que você pode reinstalar.)

**mysql.server stop** para o servidor enviando um sinal para ele. Você também pode parar o servidor manualmente executando **mysqladmin shutdown**.

Para iniciar e parar o MySQL automaticamente em seu servidor, você deve adicionar comandos de início e parada nos locais apropriados em seus arquivos `/etc/rc*`:

* Se você usar o pacote RPM do servidor Linux (`MySQL-server-VERSION.rpm`), ou uma instalação de pacote nativo do Linux, o script **mysql.server** pode ser instalado no diretório `/etc/init.d` com o nome `mysqld` ou `mysql`. Consulte a Seção 2.5.5, “Instalando MySQL no Linux Usando Pacotes RPM da Oracle”, para mais informações sobre os pacotes RPM do Linux.

* Se você instalar o MySQL a partir de uma distribuição de fonte ou usando um formato de distribuição binária que não instale o **mysql.server** automaticamente, você pode instalar o script manualmente. Ele pode ser encontrado no diretório `support-files` sob o diretório de instalação do MySQL ou em um ramo de fonte do MySQL. Copie o script para o diretório `/etc/init.d` com o nome **mysql** e torne-o executável:

  ```sql
  cp mysql.server /etc/init.d/mysql
  chmod +x /etc/init.d/mysql
  ```

Após instalar o script, os comandos necessários para ativá-lo e executá-lo no início do sistema dependem do seu sistema operacional. No Linux, você pode usar o **chkconfig**:

  ```sql
  chkconfig --add mysql
  ```

Em alguns sistemas Linux, o seguinte comando também parece ser necessário para habilitar completamente o script **mysql**:

  ```sql
  chkconfig --level 345 mysql on
  ```

* Em FreeBSD, os scripts de inicialização geralmente devem ir em `/usr/local/etc/rc.d/`. Instale o script `mysql.server` como `/usr/local/etc/rc.d/mysql.server.sh` para habilitar a inicialização automática. A página manual `rc(8)` afirma que os scripts neste diretório são executados apenas se seu nome de base corresponder ao padrão de nome de arquivo de shell `*.sh`. Quaisquer outros arquivos ou diretórios presentes dentro do diretório são ignorados silenciosamente.

* Como alternativa à configuração anterior, alguns sistemas operacionais também usam `/etc/rc.local` ou `/etc/init.d/boot.local` para iniciar serviços adicionais no momento do arranque. Para iniciar o MySQL usando esse método, adicione um comando como o seguinte ao arquivo de inicialização apropriado:

  ```sql
  /bin/sh -c 'cd /usr/local/mysql; ./bin/mysqld_safe --user=mysql &'
  ```

* Para outros sistemas, consulte a documentação do seu sistema operacional para saber como instalar scripts de inicialização.

O **mysql.server** lê opções dos seções `[mysql.server]` e `[mysqld]` dos arquivos de opções. Por compatibilidade com versões anteriores, ele também lê as seções `[mysql_server]`, mas para ser atualizado, você deve renomear essas seções para `[mysql.server]`.

Você pode adicionar opções para **mysql.server** em um arquivo global `/etc/my.cnf`. Um arquivo típico `my.cnf` pode parecer assim:

```sql
[mysqld]
datadir=/usr/local/mysql/var
socket=/var/tmp/mysql.sock
port=3306
user=mysql

[mysql.server]
basedir=/usr/local/mysql
```

O script **mysql.server** suporta as opções mostradas na tabela a seguir. Se especificadas, elas *devem* ser colocadas em um arquivo de opções, não na string de comando. **mysql.server** suporta apenas `start` e `stop` como argumentos de string de comando.

**Tabela 4.7 Opções de arquivo de opção mysql.server**

<table frame="box" rules="all" summary="Option-file options available for mysql.server."><col align="left" style="width: 20%"/><col align="left" style="width: 70%"/><col align="left" style="width: 10%"/><thead><tr><th>Option Name</th> <th>Description</th> <th>Type</th> </tr></thead><tbody><tr><th><code>basedir</code></th> <td>Caminho para o diretório de instalação do MySQL</td> <td>Nome do diretório</td> </tr><tr><th><code>datadir</code></th> <td>Caminho para o diretório de dados do MySQL</td> <td>Nome do diretório</td> </tr><tr><th><code>pid-file</code></th> <td>Arquivo no qual o servidor deve escrever seu ID de processo</td> <td>Nome do arquivo</td> </tr><tr><th><code>service-startup-timeout</code></th> <td>Quanto tempo esperar para o servidor ser iniciado</td> <td>Integer</td> </tr></tbody></table>

* `basedir=dir_name`

O caminho para o diretório de instalação do MySQL.

* `datadir=dir_name`

O caminho para o diretório de dados do MySQL.

* `pid-file=file_name`

O nome do caminho do arquivo no qual o servidor deve escrever seu ID de processo. O servidor cria o arquivo no diretório de dados, a menos que um nome de caminho absoluto seja fornecido para especificar um diretório diferente.

Se esta opção não for fornecida, o **mysql.server** utiliza um valor padrão de `host_name.pid`. O valor do arquivo PID passado para `mysqld_safe` substitui qualquer valor especificado no grupo de arquivos de opção `[mysqld_safe]`. Como o **mysql.server** lê o grupo de arquivos de opção `[mysqld]`, mas não o grupo `[mysqld_safe]`, você pode garantir que `mysqld_safe` receba o mesmo valor quando invocado a partir do **mysql.server** como quando invocado manualmente, colocando a mesma configuração `pid-file` nos grupos `[mysqld_safe]` e `[mysqld]`.

* `service-startup-timeout=seconds`

Quanto tempo em segundos esperar para a confirmação da inicialização do servidor. Se o servidor não iniciar dentro desse tempo, o **mysql.server** sai com um erro. O valor padrão é 900. Um valor de 0 significa não esperar em absoluto para a inicialização. Valores negativos significam esperar para sempre (sem tempo limite).

### 4.3.4 mysqld_multi — Gerenciar múltiplos servidores MySQL

`mysqld_multi` é projetado para gerenciar vários processos `mysqld` que escutam conexões em diferentes arquivos de soquete Unix e portas TCP/IP. Ele pode iniciar ou parar servidores, ou relatar seu status atual.

Nota

Para algumas plataformas Linux, a instalação do MySQL a partir de pacotes RPM ou Debian inclui suporte do systemd para gerenciar o início e o desligamento do servidor MySQL. Nessas plataformas, `mysqld_multi` não é instalado porque é desnecessário. Para informações sobre o uso do systemd para gerenciar múltiplas instâncias do MySQL, consulte a Seção 2.5.10, “Gerenciando o servidor MySQL com o systemd”.

`mysqld_multi` procura por grupos nomeados `[mysqldN]` em `my.cnf` (ou no arquivo nomeado pela opção `--defaults-file`). *`N`* pode ser qualquer número inteiro positivo. Este número é referido na discussão a seguir como o número do grupo de opção, ou *`GNR`*. Os números de grupo distinguem os grupos de opção entre si e são usados como argumentos para `mysqld_multi` para especificar quais servidores você deseja iniciar, parar ou obter um relatório de status para. As opções listadas nesses grupos são as mesmas que você usaria no grupo `[mysqld]` usado para iniciar `mysqld`. (Veja, por exemplo, Seção 2.9.5, “Iniciando e Parando o MySQL Automaticamente”.) No entanto, ao usar vários servidores, é necessário que cada um use seu próprio valor para opções como o arquivo de socket Unix e o número do port TCP/IP. Para mais informações sobre quais opções devem ser únicas por servidor em um ambiente com vários servidores, consulte Seção 5.7, “Executando Múltiplas Instâncias do MySQL em Uma Máquina”.

Para invocar `mysqld_multi`, use a seguinte sintaxe:

```sql
mysqld_multi [options] {start|stop|reload|report} [GNR[,GNR] ...]
```

`start`, `stop`, `reload` (parar e reiniciar) e `report` indicam qual operação realizar. Você pode realizar a operação designada para um único servidor ou múltiplos servidores, dependendo da lista *`GNR`* que segue o nome da opção. Se não houver lista, `mysqld_multi` realiza a operação para todos os servidores no arquivo de opção.

Cada valor *`GNR`* representa um número de grupo de opções ou uma faixa de números de grupo. O valor deve ser o número no final do nome do grupo no arquivo de opções. Por exemplo, o *`GNR`* para um grupo com o nome `[mysqld17]` é `17`. Para especificar uma faixa de números, separe os primeiros e últimos números com uma barra. O valor *`GNR`* `10-13` representa os grupos `[mysqld10]` até `[mysqld13]`. Múltiplos grupos ou faixas de grupos podem ser especificados na string de comando, separados por vírgulas. Não deve haver caracteres de espaço em branco (espaços ou tabs) na lista *`GNR`*; qualquer coisa após um caractere de espaço em branco é ignorada.

Este comando inicia um servidor único usando o grupo de opções `[mysqld17]`:

```sql
mysqld_multi start 17
```

Este comando para de vários servidores, usando grupos de opções `[mysqld8]` e `[mysqld10]` através de `[mysqld13]`:

```sql
mysqld_multi stop 8,10-13
```

Para um exemplo de como você pode configurar um arquivo de opção, use este comando:

```sql
mysqld_multi --example
```

`mysqld_multi` busca arquivos de opção da seguinte forma:

* Com `--no-defaults`, nenhum arquivo de opção é lido.

  <table frame="box" rules="all" summary="Properties for no-defaults"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--no-defaults</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>false</code></td> </tr></tbody></table>

* Com `--defaults-file=file_name`, apenas o arquivo nomeado é lido.

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=filename</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

* Caso contrário, os arquivos de opção na lista padrão de locais são lidos, incluindo qualquer arquivo nomeado pela opção `--defaults-extra-file=file_name`, se for fornecida. (Se a opção for fornecida várias vezes, o último valor é usado.)

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=filename</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Para obter informações adicionais sobre essas e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

Os arquivos de opção lidos são pesquisados para os grupos de opções `[mysqld_multi]` e `[mysqldN]`. O grupo `[mysqld_multi]` pode ser usado para opções para o próprio `mysqld_multi`. Os grupos `[mysqldN]` podem ser usados para opções passadas para instâncias específicas de `mysqld`.

Os grupos `[mysqld]` ou `[mysqld_safe]` podem ser usados para opções comuns lidas por todas as instâncias de `mysqld` ou `mysqld_safe`. Você pode especificar uma opção `--defaults-file=file_name` para usar um arquivo de configuração diferente para essa instância, nesse caso, os grupos `[mysqld]` ou `[mysqld_safe]` desse arquivo são usados para essa instância.

`mysqld_multi` suporta as seguintes opções.

* `--help`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>false</code></td> </tr></tbody></table>

Exibir uma mensagem de ajuda e sair.

* `--example`

  <table frame="box" rules="all" summary="Properties for example"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--example</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>false</code></td> </tr></tbody></table>

Exibir um arquivo de opção de amostra.

* `--log=file_name`

  <table frame="box" rules="all" summary="Properties for log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log=path</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>/var/log/mysqld_multi.log</code></td> </tr></tbody></table>

Especifique o nome do arquivo de registro. Se o arquivo existir, a saída do registro será anexada a ele.

* `--mysqladmin=prog_name`

  <table frame="box" rules="all" summary="Properties for mysqladmin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqladmin=file</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

O binário **mysqladmin** a ser usado para parar os servidores.

* `--mysqld=prog_name`

  <table frame="box" rules="all" summary="Properties for mysqld"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqld=file</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

O binário `mysqld` a ser utilizado. Note que você pode especificar `mysqld_safe` como o valor para esta opção também. Se você usar `mysqld_safe` para iniciar o servidor, pode incluir as opções `mysqld` ou `ledir` no grupo de opções correspondente `[mysqldN]`. Essas opções indicam o nome do servidor que `mysqld_safe` deve iniciar e o nome do caminho do diretório onde o servidor está localizado. (Veja as descrições dessas opções na Seção 4.3.2, “`mysqld_safe` — Script de Inicialização do Servidor MySQL”.) Exemplo:

  ```sql
  [mysqld38]
  mysqld = mysqld-debug
  ledir  = /opt/local/mysql/libexec
  ```

* `--no-log`

  <table frame="box" rules="all" summary="Properties for no-log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--no-log</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>false</code></td> </tr></tbody></table>

Imprima as informações do log para `stdout` em vez do arquivo de log. Por padrão, a saída vai para o arquivo de log.

* `--password=password`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

A senha da conta MySQL a ser usada ao invocar o **mysqladmin**. Observe que o valor da senha não é opcional para esta opção, ao contrário de outros programas do MySQL.

* `--silent`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=filename</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>0

Modo silencioso; desative as advertências.

* `--tcp-ip`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=filename</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>1

Conecte-se a cada servidor MySQL através da porta TCP/IP em vez do arquivo de soquete Unix. (Se um arquivo de soquete estiver faltando, o servidor ainda pode estar em execução, mas apenas acessível através da porta TCP/IP.) Por padrão, as conexões são feitas usando o arquivo de soquete Unix. Esta opção afeta as operações `stop` e `report`.

* `--user=user_name`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=filename</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>2

O nome de usuário da conta MySQL a ser usado ao invocar o **mysqladmin**.

* `--verbose`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=filename</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>3

Seja mais verbose.

* `--version`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=filename</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>4

Exibir informações da versão e sair.

Algumas notas sobre `mysqld_multi`:

* **Mais importante**: Antes de usar `mysqld_multi`, certifique-se de que você entende os significados das opções que são passadas para os servidores `mysqld` e *por que* você gostaria de ter processos separados `mysqld`. Esteja atento aos perigos de usar vários servidores `mysqld` com o mesmo diretório de dados. Use diretórios de dados separados, a menos que você *saiba* o que está fazendo. Iniciar vários servidores com o mesmo diretório de dados *não* lhe dá desempenho extra em um sistema baseado em threads. Veja a Seção 5.7, “Executando várias instâncias do MySQL em uma única máquina”.

Importante

Certifique-se de que o diretório de dados para cada servidor seja totalmente acessível à conta Unix na qual o processo específico `mysqld` é iniciado. *Não* use a conta Unix *`root`* para isso, a menos que você saiba o que está fazendo. Veja a Seção 6.1.5, “Como executar o MySQL como um usuário normal”.

* Certifique-se de que a conta do MySQL usada para parar os servidores `mysqld` (com o programa **mysqladmin**) tenha o mesmo nome de usuário e senha para cada servidor. Além disso, certifique-se de que a conta tenha o privilégio `SHUTDOWN`. Se os servidores que você deseja gerenciar tiverem nomes de usuário ou senhas diferentes para as contas administrativas, você pode querer criar uma conta em cada servidor que tenha o mesmo nome de usuário e senha. Por exemplo, você pode configurar uma conta comum `multi_admin` executando os seguintes comandos para cada servidor:

  ```sql
  $> mysql -u root -S /tmp/mysql.sock -p
  Enter password:
  mysql> CREATE USER 'multi_admin'@'localhost' IDENTIFIED BY 'multipass';
  mysql> GRANT SHUTDOWN ON *.* TO 'multi_admin'@'localhost';
  ```

Veja a Seção 6.2, “Controle de Acesso e Gerenciamento de Conta”. Você precisa fazer isso para cada servidor `mysqld`. Altere os parâmetros de conexão apropriadamente ao se conectar a cada um deles. Observe que a parte do nome de conta que contém o nome do host deve permitir que você se conecte como `multi_admin` no host onde você deseja executar `mysqld_multi`.

* O arquivo do socket Unix e o número da porta TCP/IP devem ser diferentes para cada `mysqld`. (Alternativamente, se o host tiver múltiplos endereços de rede, você pode definir a variável de sistema `bind_address` para fazer com que servidores diferentes ouçam diferentes interfaces.)

* A opção `--pid-file` é muito importante se você estiver usando `mysqld_safe` para iniciar `mysqld` (por exemplo, `--mysqld=mysqld_safe`) Cada `mysqld` deve ter seu próprio arquivo de ID de processo. A vantagem de usar `mysqld_safe` em vez de `mysqld` é que `mysqld_safe` monitora seu processo `mysqld` e o reinicia se o processo terminar devido a um sinal enviado usando `kill -9` ou por outros motivos, como uma falha de segmentação.

* Você pode querer usar a opção `--user` para `mysqld`, mas para fazer isso, você precisa executar o script `mysqld_multi` como o superusuário do Unix (`root`). Ter a opção no arquivo de opções não importa; você apenas recebe um aviso se não for o superusuário e os processos `mysqld` são iniciados sob sua própria conta do Unix.

O exemplo a seguir mostra como você pode configurar um arquivo de opções para uso com `mysqld_multi`. A ordem em que os programas `mysqld` são iniciados ou interrompidos depende da ordem em que eles aparecem no arquivo de opções. Os números dos grupos não precisam formar uma sequência ininterrupta. Os primeiros e os cinco grupos `[mysqldN]` foram intencionalmente omitidos do exemplo para ilustrar que você pode ter "lacunas" no arquivo de opções. Isso lhe dá mais flexibilidade.

```sql
# This is an example of a my.cnf file for mysqld_multi.
# Usually this file is located in home dir ~/.my.cnf or /etc/my.cnf

[mysqld_multi]
mysqld     = /usr/local/mysql/bin/mysqld_safe
mysqladmin = /usr/local/mysql/bin/mysqladmin
user       = multi_admin
password   = my_password

[mysqld2]
socket     = /tmp/mysql.sock2
port       = 3307
pid-file   = /usr/local/mysql/data2/hostname.pid2
datadir    = /usr/local/mysql/data2
language   = /usr/local/mysql/share/mysql/english
user       = unix_user1

[mysqld3]
mysqld     = /path/to/mysqld_safe
ledir      = /path/to/mysqld-binary/
mysqladmin = /path/to/mysqladmin
socket     = /tmp/mysql.sock3
port       = 3308
pid-file   = /usr/local/mysql/data3/hostname.pid3
datadir    = /usr/local/mysql/data3
language   = /usr/local/mysql/share/mysql/swedish
user       = unix_user2

[mysqld4]
socket     = /tmp/mysql.sock4
port       = 3309
pid-file   = /usr/local/mysql/data4/hostname.pid4
datadir    = /usr/local/mysql/data4
language   = /usr/local/mysql/share/mysql/estonia
user       = unix_user3

[mysqld6]
socket     = /tmp/mysql.sock6
port       = 3311
pid-file   = /usr/local/mysql/data6/hostname.pid6
datadir    = /usr/local/mysql/data6
language   = /usr/local/mysql/share/mysql/japanese
user       = unix_user4
```

Veja a Seção 4.2.2.2, “Usando arquivos de opção”.

