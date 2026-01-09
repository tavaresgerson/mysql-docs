### 6.3.2 mysqld_safe — Script de inicialização do servidor MySQL

O **mysqld_safe** é a maneira recomendada para iniciar um servidor **mysqld** no Unix. O **mysqld_safe** adiciona algumas funcionalidades de segurança, como reiniciar o servidor quando ocorre um erro e registrar informações de execução em um log de erro. Uma descrição do registro de erros é dada mais adiante nesta seção.

Nota

Para algumas plataformas Linux, a instalação do MySQL a partir de pacotes RPM ou Debian inclui suporte ao systemd para gerenciar a inicialização e o desligamento do servidor MySQL. Nessas plataformas, o **mysqld_safe** não é instalado porque é desnecessário. Para mais informações, consulte a Seção 2.5.9, “Gerenciamento do servidor MySQL com o systemd”.

Uma implicação do não uso do **mysqld_safe** em plataformas que usam o systemd para gerenciamento de servidores é que o uso de seções `[mysqld_safe]` ou `[safe_mysqld]` em arquivos de opções não é suportado e pode levar a comportamentos inesperados.

O **mysqld_safe** tenta iniciar um executável chamado **mysqld**. Para sobrescrever o comportamento padrão e especificar explicitamente o nome do servidor que deseja executar, especifique uma opção `--mysqld` ou `--mysqld-version` para o **mysqld_safe**. Você também pode usar `--ledir` para indicar o diretório onde o **mysqld_safe** deve procurar o servidor.

Muitas das opções para o **mysqld_safe** são as mesmas das opções para o **mysqld**. Consulte a Seção 7.1.7, “Opções de comando do servidor”.

Opções desconhecidas para o **mysqld_safe** são passadas para o **mysqld** se forem especificadas na linha de comando, mas ignoradas se forem especificadas no grupo `[mysqld_safe]` de um arquivo de opções. Consulte a Seção 6.2.2.2, “Uso de arquivos de opções”.

**mysqld\_safe** lê todas as opções dos seções `[mysqld]`, `[server]` e `[mysqld_safe]` nos arquivos de opções. Por exemplo, se você especificar uma seção `[mysqld]` assim:

```
[mysqld]
log-error=error.log
```

Para compatibilidade com versões anteriores, **mysqld\_safe** também lê seções `[safe_mysqld]`, mas para ser atual, você deve renomear essas seções para `[mysqld_safe]`.

**mysqld\_safe** aceita opções na linha de comando e nos arquivos de opções, conforme descrito na tabela a seguir. Para informações sobre os arquivos de opções usados pelos programas MySQL, consulte a Seção 6.2.2.2, “Usando arquivos de opções”.

**Tabela 6.7 Opções mysqld\_safe**

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para mysqld_safe.">
<col style="width: 35%"/><col style="width: 64%"/>
<thead><tr><th>Nome da Opção</th> <th>Descrição</th> </tr></thead><tbody><tr><td><a class="link" href="mysqld-safe.html#option_mysqld_safe_basedir">--basedir</a></td> <td>Caminho para o diretório de instalação do MySQL</td> </tr><tr><td><a class="link" href="mysqld-safe.html#option_mysqld_safe_core-file-size">--core-file-size</a></td> <td>Tamanho do arquivo de núcleo que o mysqld deve ser capaz de criar</td> </tr><tr><td><a class="link" href="mysqld-safe.html#option_mysqld_safe_datadir">--datadir</a></td> <td>Caminho para o diretório de dados</td> </tr><tr><td><a class="link" href="mysqld-safe.html#option_mysqld_safe_defaults-extra-file">--defaults-extra-file</a></td> <td>Ler o arquivo de opção nomeado além dos arquivos de opção usuais</td> </tr><tr><td><a class="link" href="mysqld-safe.html#option_mysqld_safe_defaults-file">--defaults-file</a></td> <td>Ler apenas o arquivo de opção nomeado</td> </tr><tr><td><a class="link" href="mysqld-safe.html#option_mysqld_safe_help">--help</a></td> <td>Exibir a mensagem de ajuda e sair</td> </tr><tr><td><a class="link" href="mysqld-safe.html#option_mysqld_safe_ledir">--ledir</a></td> <td>Caminho para o diretório onde o servidor está localizado</td> </tr><tr><td><a class="link" href="mysqld-safe.html#option_mysqld_safe_log-error">--log-error</a></td> <td>Escrever o log de erro em um arquivo nomeado</td> </tr><tr><td><a class="link" href="mysqld-safe.html#option_mysqld_safe_malloc-lib">--malloc-lib</a></td> <td>Biblioteca alternativa de alocação de memória para o mysqld</td> </tr><tr><td><a class="link" href="mysqld-safe.html#option_mysqld_safe_mysqld">--mysqld</a></td> <td>Nome do programa do servidor a ser iniciado (no diretório ledir)</td> </tr><tr><td><a class="link" href="mysqld-safe.html#option_mysqld_safe_mysqld-safe-log-timestamps">--mysqld-safe-log-timestamps</a></td> <td>Formato de data e hora para o log de registro</td> </tr><tr><td><a class="link" href="mysqld-safe.html#option_mysqld_safe_mysqld-version">--mysqld-version</a></td> <td>Sufix para o nome do programa do servidor</td> </tr><tr><td><a class="link" href="mysqld-safe.html#option_mysqld_safe_nice">--nice</a></td> <td>Usar o programa nice para definir a prioridade de agendamento do servidor</td> </tr><tr><td><a class="link" href="mysqld-safe.html#option_mysqld_safe_no-defaults">--no-defaults</a></td> <td>Ler nenhum arquivo de opção</td> </tr><tr><td><a class="link" href="mysqld-safe.html#option_mysqld_safe_open-files-limit">--open-files-limit</a></td> <td>Número de arquivos que o mysqld deve ser capaz de abrir</td> </tr><tr><td><a class="link" href="mysqld-safe.html#option_mysqld_safe_pid-file">--pid-file</a></td> <td>Nome do arquivo de ID do processo do servidor</td> </tr><tr><td><a class="link" href="mysqld-safe.html#option_mysqld_safe_plugin-dir">--plugin-dir</a></td> <td>Diretório onde os plugins são instalados</td> </tr><tr><td><a class="link" href="mysqld-safe.html#option_mysqld_safe_port">--port</a></td> <td>Número de porta no qual ouvir conexões TCP/IP</td> </tr><tr><td><a class="link" href="mysqld-safe.html#option_mysqld_safe_skip-kill-mys

* `--help`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tr><th>Formato de linha de comando</th> <td><code class="literal">--help</code></td> </tr></table>

  Exibir uma mensagem de ajuda e sair.

* `--basedir=nome_dir`

  <table frame="box" rules="all" summary="Propriedades para basedir"><tr><th>Formato de linha de comando</th> <td><code class="literal">--basedir=nome_dir</code></td> </tr><tr><th>Tipo</th> <td>Nome da pasta</td> </tr></table>

  O caminho para o diretório de instalação do MySQL.

* `--core-file-size=tamanho`

  <table frame="box" rules="all" summary="Propriedades para core-file-size"><tr><th>Formato de linha de comando</th> <td><code class="literal">--core-file-size=tamanho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></table>

  O tamanho do arquivo de núcleo que o **mysqld** deve ser capaz de criar. O valor da opção é passado para **ulimit -c**.

  Nota

  A variável `innodb_buffer_pool_in_core_file` pode ser usada para reduzir o tamanho dos arquivos de núcleo em sistemas operacionais que a suportam. Para mais informações, consulte a Seção 17.8.3.7, “Excluindo ou incluindo páginas do buffer pool dos arquivos de núcleo”.

* `--datadir=nome_dir`

  <table frame="box" rules="all" summary="Propriedades para datadir"><tr><th>Formato de linha de comando</th> <td><code class="literal">--datadir=nome_dir</code></td> </tr><tr><th>Tipo</th> <td>Nome da pasta</td> </tr></table>

  O caminho para o diretório de dados.

* `--defaults-extra-file=nome_arquivo`

<table frame="box" rules="all" summary="Propriedades para defaults-extra-file">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code class="literal">--defaults-extra-file=nome_arquivo</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  </tbody>
</table>

Leia este arquivo de opção adicional aos arquivos de opção usuais. Se o arquivo não existir ou não for acessível, o servidor sai com um erro. Se *`nome_arquivo`* não for um nome de caminho absoluto, ele é interpretado em relação ao diretório atual. Isso deve ser a primeira opção na linha de comando se for usada.

Para obter informações adicionais sobre esta e outras opções de arquivo de opção, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opção”.

* `--defaults-file=nome_arquivo`

<table frame="box" rules="all" summary="Propriedades para defaults-file">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code class="literal">--defaults-file=nome_arquivo</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  </tbody>
</table>

Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou não for acessível, o servidor sai com um erro. Se *`nome_arquivo`* não for um nome de caminho absoluto, ele é interpretado em relação ao diretório atual. Isso deve ser a primeira opção na linha de comando se for usada.

Para obter informações adicionais sobre esta e outras opções de arquivo de opção, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opção”.

* `--ledir=nome_diretorio`

<table frame="box" rules="all" summary="Propriedades para ledir">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code class="literal">--ledir=nome_do_diretório</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do diretório</td>
  </tr>
  </tbody>
</table>

Se o **mysqld_safe** não conseguir encontrar o servidor, use esta opção para indicar o nome do caminho para o diretório onde o servidor está localizado.

Esta opção é aceita apenas na linha de comando, não em arquivos de opção. Em plataformas que usam systemd, o valor pode ser especificado no valor de `MYSQLD_OPTS`. Veja a Seção 2.5.9, “Gerenciamento do Servidor MySQL com systemd”.

* `--log-error=nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para log-error">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code class="literal">--log-error=nome_do_arquivo</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>Nome do arquivo</td>
    </tr>
  </tbody>
  </table>

Escreva o log de erro no arquivo especificado. Veja a Seção 7.4.2, “O Log de Erro”.

* `--mysqld-safe-log-timestamps`

  <table frame="box" rules="all" summary="Propriedades para mysqld-safe-log-timestamps">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code class="literal">--mysqld-safe-log-timestamps=tipo</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>Enumeração</td>
    </tr>
    <tr>
      <th>Valor padrão</th>
      <td><code class="literal">utc</code></td>
    </tr>
    <tr>
      <th>Valores válidos</th>
      <td><p class="valid-value"><code class="literal">system</code></p><p class="valid-value"><code class="literal">hyphen</code></p><p class="valid-value"><code class="literal">legacy</code></p></td>
    </tr>
  </tbody>
  </table>

Esta opção controla o formato dos timestamps na saída de log gerada pelo **mysqld\_safe**. A lista a seguir descreve os valores permitidos. Para qualquer outro valor, o **mysqld\_safe** registra uma mensagem de aviso e usa o formato `UTC`.

  + `UTC`, `utc`

    Formato `UTC` do ISO 8601 (mesmo que `--log_timestamps=UTC` para o servidor). Este é o padrão.

  + `SYSTEM`, `system`

    Formato de hora local do ISO 8601 (mesmo que `--log_timestamps=SYSTEM` para o servidor).

  + `HYPHEN`, `hyphen`

    Formato `YY-MM-DD h:mm:ss`, como no **mysqld\_safe** para o MySQL 5.6.

  + `LEGACY`, `legacy`

    Formato `YYMMDD hh:mm:ss`, como no **mysqld\_safe** antes do MySQL 5.6.

* `--malloc-lib=[lib_name]`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--help</code></td> </tr></tbody></table>0

  O nome da biblioteca a ser usada para alocação de memória em vez da biblioteca `malloc()` do sistema. O valor da opção deve ser um dos diretórios `/usr/lib`, `/usr/lib64`, `/usr/lib/i386-linux-gnu` ou `/usr/lib/x86_64-linux-gnu`.

  A opção `--malloc-lib` funciona modificando o valor do ambiente `LD_PRELOAD` para afetar o link dinâmico, permitindo que o carregador encontre a biblioteca de alocação de memória quando o **mysqld** é executado:

  + Se a opção não for fornecida ou for fornecida sem um valor (`--malloc-lib=`), o `LD_PRELOAD` não é modificado e não há tentativa de usar o `tcmalloc`.

  + Antes do MySQL 8.0.21, se a opção for fornecida como `--malloc-lib=tcmalloc`, o **mysqld\_safe** procura por uma biblioteca `tcmalloc` em `/usr/lib`. Se `tmalloc` for encontrado, o nome do caminho é adicionado ao início do valor do `LD_PRELOAD` para o **mysqld**. Se `tcmalloc` não for encontrado, o **mysqld\_safe** aborta com um erro.

A partir do MySQL 8.0.21, `tcmalloc` não é um valor permitido para a opção `--malloc-lib`.

  + Se a opção for fornecida como `--malloc-lib=/caminho/para/algum/biblioteca`, esse caminho completo é adicionado ao início do valor de `LD_PRELOAD`. Se o caminho completo apontar para um arquivo inexistente ou ilegível, o **mysqld_safe** interrompe com um erro.

  + Para casos em que o **mysqld_safe** adiciona um nome de caminho ao `LD_PRELOAD`, ele adiciona o caminho ao início de qualquer valor existente que a variável já tenha.

  Nota

  Em sistemas que gerenciam o servidor usando o systemd, o **mysqld_safe** não está disponível. Em vez disso, especifique a biblioteca de alocação definindo `LD_PRELOAD` em `/etc/sysconfig/mysql`.

  Usuários do Linux podem usar a biblioteca `libtcmalloc_minimal.so` em qualquer plataforma para a qual um pacote `tcmalloc` esteja instalado em `/usr/lib`, adicionando essas linhas ao arquivo `my.cnf`:

  ```
  [mysqld_safe]
  malloc-lib=tcmalloc
  ```

  Para usar uma biblioteca `tcmalloc` específica, especifique seu nome de caminho completo. Exemplo:

  ```
  [mysqld_safe]
  malloc-lib=/opt/lib/libtcmalloc_minimal.so
  ```

* `--mysqld=nome_do_programa`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--help</code></td> </tr></tbody></table>1

  O nome do programa do servidor (no diretório `ledir`) que você deseja iniciar. Esta opção é necessária se você usar a distribuição binária do MySQL, mas tiver o diretório de dados fora da distribuição binária. Se o **mysqld_safe** não conseguir encontrar o servidor, use a opção `--ledir` para indicar o nome do caminho do diretório onde o servidor está localizado.

  Esta opção é aceita apenas na linha de comando, não em arquivos de opção. Em plataformas que usam o systemd, o valor pode ser especificado no valor de `MYSQLD_OPTS`. Veja a Seção 2.5.9, “Gerenciamento do Servidor MySQL com o systemd”.

* `--mysqld-version=sufixo`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--help</code></td> </tr></tbody></table>2

  Esta opção é semelhante à opção `--mysqld`, mas você especifica apenas o sufixo para o nome do programa do servidor. O nome base é assumido como **mysqld**. Por exemplo, se você usar `--mysqld-version=debug`, **mysqld\_safe** inicia o programa **mysqld-debug** no diretório `ledir`. Se o argumento para `--mysqld-version` estiver vazio, **mysqld\_safe** usa **mysqld** no diretório `ledir`.

  Esta opção é aceita apenas na linha de comando, não em arquivos de opção. Em plataformas que usam systemd, o valor pode ser especificado no valor de `MYSQLD_OPTS`. Veja a Seção 2.5.9, “Gerenciamento do Servidor MySQL com systemd”.

* `--nice=prioridade`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--help</code></td> </tr></tbody></table>3

  Use o programa `nice` para definir a prioridade de agendamento do servidor para o valor fornecido.

* `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--help</code></td> </tr></tbody></table>4

  Não leia nenhum arquivo de opção. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opção, `--no-defaults` pode ser usado para evitar que sejam lidas. Isso deve ser a primeira opção na linha de comando se for usado.

Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o gerenciamento de arquivo de opções”.

* `--open-files-limit=count`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--help</code></td> </tr></tbody></table>5

  O número de arquivos que o **mysqld** deve ser capaz de abrir. O valor da opção é passado para **ulimit -n**.

  Nota

  Você deve iniciar o **mysqld\_safe** como `root` para que isso funcione corretamente.

* `--pid-file=file_name`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--help</code></td> </tr></tbody></table>6

  O nome do caminho que o **mysqld** deve usar para seu arquivo de ID de processo.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--help</code></td> </tr></tbody></table>7

  O nome do caminho do diretório do plugin.

* `--port=port_num`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--help</code></td> </tr></tbody></table>8

  O número de porta que o servidor deve usar ao ouvir conexões TCP/IP. O número de porta deve ser 1024 ou maior, a menos que o servidor seja iniciado pelo usuário do sistema operacional `root`.

* `--skip-kill-mysqld`

<table frame="box" rules="all" summary="Propriedades de ajuda">
  <tr><th>Formato de linha de comando</th> <td><code class="literal">--help</code></td> </tr>
</table>
9

  Não tente matar processos isolados de **mysqld** no momento do início. Esta opção só funciona no Linux.

* `--socket=caminho`

  <table frame="box" rules="all" summary="Propriedades de base">
    <tr><th>Formato de linha de comando</th> <td><code class="literal">--basedir=nome_diretorio</code></td> </tr>
    <tr><th>Tipo</th> <td>Nome do diretório</td> </tr>
  </table>
0

  O arquivo de socket Unix que o servidor deve usar ao ouvir conexões locais.

* `--syslog`, `--skip-syslog`

  <table frame="box" rules="all" summary="Propriedades de base">
    <tr><th>Formato de linha de comando</th> <td><code class="literal">--basedir=nome_diretorio</code></td> </tr>
    <tr><th>Tipo</th> <td>Nome do diretório</td> </tr>
  </table>
1

  <table frame="box" rules="all" summary="Propriedades de base">
    <tr><th>Formato de linha de comando</th> <td><code class="literal">--basedir=nome_diretorio</code></td> </tr>
    <tr><th>Tipo</th> <td>Nome do diretório</td> </tr>
  </table>
2

  `--syslog` faz com que mensagens de erro sejam enviadas para o `syslog` em sistemas que suportam o programa **logger**. `--skip-syslog` suprime o uso do `syslog`; as mensagens são escritas em um arquivo de log de erro.

  Quando o `syslog` é usado para registro de erros, a facilidade/gravidade `daemon.err` é usada para todas as mensagens de log.

O uso dessas opções para controlar o registro do **mysqld** está desatualizado. Para gravar a saída do log de erro no log do sistema, use as instruções na Seção 7.4.2.8, “Registro de Erros no Log do Sistema”. Para controlar a facilidade, use a variável de sistema `log_syslog_facility`.

* `--syslog-tag=tag`

  <table frame="box" rules="all" summary="Propriedades para basedir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--basedir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>3

  Para registrar em `syslog`, as mensagens do **mysqld\_safe** e do **mysqld** são escritas com identificadores de `mysqld_safe` e `mysqld`, respectivamente. Para especificar um sufixo para os identificadores, use `--syslog-tag=tag`, que modifica os identificadores para `mysqld_safe-tag` e `mysqld-tag`.

  O uso desta opção para controlar o registro do **mysqld** está desatualizado. Use a variável de sistema `log_syslog_tag` do servidor. Consulte a documentação do seu sistema operacional para os formatos de especificação de fuso horário legais.

* `--timezone=timezone`

  <table frame="box" rules="all" summary="Propriedades para basedir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--basedir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>4

  Defina a variável de ambiente `TZ` para o valor da opção fornecida. Consulte a documentação do seu sistema operacional para os formatos de especificação de fuso horário legais.

* `--user={user_name|user_id}`

<table frame="box" rules="all" summary="Propriedades para basedir"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--basedir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>5

Execute o servidor **mysqld** como o usuário com o nome *`user_name`* ou o ID de usuário numérico *`user_id`*. (“Usuário” neste contexto se refere a uma conta de login do sistema, não a um usuário MySQL listado nas tabelas de concessão.)

Se você executar **mysqld\_safe** com a opção `--defaults-file` ou `--defaults-extra-file` para nomear um arquivo de opções, a opção deve ser a primeira dada na linha de comando ou o arquivo de opções não será usado. Por exemplo, este comando não usa o arquivo de opção nomeado:

```
mysql> mysqld_safe --port=port_num --defaults-file=file_name
```

Em vez disso, use o seguinte comando:

```
mysql> mysqld_safe --defaults-file=file_name --port=port_num
```

O script **mysqld\_safe** é escrito de forma que ele normalmente possa iniciar um servidor que foi instalado a partir de uma distribuição de fonte ou binária do MySQL, mesmo que esses tipos de distribuições normalmente instalem o servidor em locais ligeiramente diferentes. (Veja a Seção 2.1.5, “Layouts de Instalação”.) **mysqld\_safe** espera que uma das seguintes condições seja verdadeira:

* O servidor e os bancos de dados podem ser encontrados em relação ao diretório de trabalho (o diretório a partir do qual o **mysqld\_safe** é invocado). Para distribuições binárias, **mysqld\_safe** procura por diretórios `bin` e `data` em seu diretório de trabalho. Para distribuições de fonte, ele procura por diretórios `libexec` e `var`. Esta condição deve ser atendida se você executar **mysqld\_safe** a partir do diretório de instalação do MySQL (por exemplo, `/usr/local/mysql` para uma distribuição binária).

* Se o servidor e os bancos de dados não puderem ser encontrados em relação ao diretório de trabalho, o **mysqld\_safe** tenta localizá-los por nomes de caminho absolutos. Os locais típicos são `/usr/local/libexec` e `/usr/local/var`. Os locais reais são determinados pelos valores configurados na distribuição no momento em que ela foi construída. Eles devem estar corretos se o MySQL estiver instalado no local especificado na hora da configuração.

Como o **mysqld\_safe** tenta encontrar o servidor e os bancos de dados em relação ao seu próprio diretório de trabalho, você pode instalar uma distribuição binária do MySQL em qualquer lugar, desde que execute o **mysqld\_safe** a partir do diretório de instalação do MySQL:

```
cd mysql_installation_directory
bin/mysqld_safe &
```

Se o **mysqld\_safe** falhar, mesmo quando invocado a partir do diretório de instalação do MySQL, especifique as opções `--ledir` e `--datadir` para indicar os diretórios nos quais o servidor e os bancos de dados estão localizados no seu sistema.

O **mysqld\_safe** tenta usar as utilidades de sistema **sleep** e **date** para determinar quantas vezes por segundo ele tentou iniciar. Se essas utilidades estiverem presentes e as tentativas de início por segundo forem maiores que 5, o **mysqld\_safe** aguarda 1 segundo completo antes de iniciar novamente. Isso é feito para evitar o uso excessivo da CPU em caso de falhas repetidas. (Bug #11761530, Bug #54035)

Quando você usa o **mysqld\_safe** para iniciar o **mysqld**, o **mysqld\_safe** garante que os mensagens de erro (e de aviso) do próprio **mysqld** e do **mysqld** sejam direcionadas para o mesmo destino.

Existem várias opções do **mysqld\_safe** para controlar o destino dessas mensagens:

* `--log-error=nome_do_arquivo`: Escreva mensagens de erro para o arquivo de erro nomeado.

* `--syslog`: Escreva mensagens de erro para o `syslog` em sistemas que suportam o programa **logger**.

* `--skip-syslog`: Não escreva mensagens de erro no `syslog`. As mensagens são escritas no arquivo de log de erro padrão (`host_name.err` no diretório de dados) ou em um arquivo nomeado se a opção `--log-error` for fornecida.

Se nenhuma dessas opções for fornecida, o padrão é `--skip-syslog`.

Quando o **mysqld\_safe** escreve uma mensagem, as notificações são enviadas para o destino de registro (`syslog` ou o arquivo de log de erro) e `stdout`. Erros são enviados para o destino de registro e `stderr`.

Observação

O controle do registro do **mysqld** a partir do **mysqld\_safe** está desatualizado. Use o suporte nativo de `syslog` do servidor. Para mais informações, consulte a Seção 7.4.2.8, “Registro de Erros no Log do Sistema”.