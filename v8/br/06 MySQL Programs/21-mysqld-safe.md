### 6.3.2 mysqld\_safe  Script de inicialização do servidor MySQL

`mysqld_safe` é a maneira recomendada de iniciar um servidor `mysqld` no Unix. `mysqld_safe` adiciona alguns recursos de segurança, como reiniciar o servidor quando ocorre um erro e registrar informações de tempo de execução em um registro de erros.

::: info Note

Para algumas plataformas Linux, a instalação do MySQL a partir de pacotes RPM ou Debian inclui o suporte do systemd para gerenciar a inicialização e o desligamento do servidor MySQL. nessas plataformas, `mysqld_safe` não é instalado porque é desnecessário.

Uma implicação do não uso de `mysqld_safe` em plataformas que usam systemd para gerenciamento de servidor é que o uso de seções `[mysqld_safe]` ou `[safe_mysqld]` em arquivos de opções não é suportado e pode levar a um comportamento inesperado.

:::

`mysqld_safe` tenta iniciar um executável chamado `mysqld`. Para substituir o comportamento padrão e especificar explicitamente o nome do servidor que você deseja executar, especifique uma `--mysqld` ou `--mysqld-version` opção para `mysqld_safe`. Você também pode usar `--ledir` para indicar o diretório onde `mysqld_safe` deve procurar o servidor.

Muitas das opções para `mysqld_safe` são as mesmas que as opções para `mysqld`. Ver Seção 7.1.7, "Opções de comando do servidor".

As opções desconhecidas para `mysqld_safe` são passadas para `mysqld` se forem especificadas na linha de comando, mas ignoradas se forem especificadas no grupo `[mysqld_safe]` de um arquivo de opções.

`mysqld_safe` lê todas as opções das seções `[mysqld]`, `[server]`, e `[mysqld_safe]` em arquivos de opções. Por exemplo, se você especificar uma seção `[mysqld]` como esta, `mysqld_safe` encontra e usa a opção `--log-error`:

```
[mysqld]
log-error=error.log
```

Para compatibilidade com versões anteriores, `mysqld_safe` também lê seções `[safe_mysqld]`, mas para estar atualizado você deve renomear essas seções para `[mysqld_safe]`.

`mysqld_safe` aceita opções na linha de comando e em arquivos de opções, conforme descrito na tabela a seguir. Para informações sobre arquivos de opções usados por programas MySQL, consulte a Seção 6.2.2.2, "Utilizar arquivos de opções".

**Tabela 6.7 opções mysqld\_safe**

<table><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Nome da opção</th> <th>Descrição</th> </tr></thead><tbody><tr><td>- Baseado.</td> <td>Caminho para o diretório de instalação do MySQL</td> </tr><tr><td>--core-file-size</td> <td>Tamanho do arquivo principal que o mysqld deve ser capaz de criar</td> </tr><tr><td>--datadir</td> <td>Caminho para o diretório de dados</td> </tr><tr><td>--defaults-extra-file</td> <td>Leia arquivo de opção nomeado além dos arquivos de opção habituais</td> </tr><tr><td>--defaults-file</td> <td>Arquivo de opções nomeadas somente para leitura</td> </tr><tr><td>- Ajuda .</td> <td>Mostrar mensagem de ajuda e sair</td> </tr><tr><td>--Ledir</td> <td>Caminho para o diretório onde o servidor está localizado</td> </tr><tr><td>--log-error</td> <td>Escrever o registo de erros no ficheiro nomeado</td> </tr><tr><td>- Malloc-lib</td> <td>Biblioteca de malloc alternativa para usar no mysqld</td> </tr><tr><td>- ... mysqld</td> <td>Nome do programa do servidor a ser iniciado (no diretório ledir)</td> </tr><tr><td>--mysqld-safe-log-timestamps</td> <td>Formato de carimbo de hora para registo</td> </tr><tr><td>- Versão mysqld</td> <td>Sufício para o nome do programa do servidor</td> </tr><tr><td>- Muito bem.</td> <td>Use um bom programa para definir a prioridade de agendamento do servidor</td> </tr><tr><td>- Não há padrões</td> <td>Não ler arquivos de opções</td> </tr><tr><td>- Arquivos abertos-limite</td> <td>Número de arquivos que o mysqld deve ser capaz de abrir</td> </tr><tr><td>--pid-arquivo</td> <td>Nome do caminho do ficheiro de identificação do processo do servidor</td> </tr><tr><td>--plugin-dir</td> <td>Diretório onde os plugins estão instalados</td> </tr><tr><td>- Porto</td> <td>Número de porta em que ouvir as conexões TCP/IP</td> </tr><tr><td>- Esquecer-matar-mysqld</td> <td>Não tente matar processos mysqld perdidos</td> </tr><tr><td>--skip-syslog</td> <td>Não escreva mensagens de erro para o syslog; use o arquivo de registo de erros</td> </tr><tr><td>- Soquete</td> <td>Arquivo de soquete no qual ouvir para conexões de soquete Unix</td> </tr><tr><td>--syslog</td> <td>Escrever mensagens de erro para o syslog</td> </tr><tr><td>--syslog-tag</td> <td>Sufixo de tag para mensagens escritas para syslog</td> </tr><tr><td>--zona horária</td> <td>Defina a variável de ambiente do fuso horário TZ para o valor nomeado</td> </tr><tr><td>-- utilizador</td> <td>Executar mysqld como usuário com nome user_name ou ID de usuário numérico user_id</td> </tr></tbody></table>

- `--help`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

Mostra uma mensagem de ajuda e sai.

- `--basedir=dir_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--basedir=dir_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do diretório</td> </tr></tbody></table>

O caminho para o diretório de instalação do MySQL.

- `--core-file-size=size`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--core-file-size=size</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

O tamanho do arquivo central que `mysqld` deve ser capaz de criar. O valor da opção é passado para **ulimit -c**.

::: info Note

A variável `innodb_buffer_pool_in_core_file` pode ser usada para reduzir o tamanho dos arquivos do núcleo em sistemas operacionais que o suportam.

:::

- `--datadir=dir_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--datadir=dir_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do diretório</td> </tr></tbody></table>

O caminho para o diretório de dados.

- `--defaults-extra-file=file_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--defaults-extra-file=file_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr></tbody></table>

Leia este arquivo de opção além dos arquivos de opção usuais. Se o arquivo não existir ou for inacessível, o servidor sairá com um erro. Se \* `file_name` \* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual. Esta deve ser a primeira opção na linha de comando se for usada.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--defaults-file=file_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--defaults-file=file_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr></tbody></table>

Use apenas o arquivo de opção dado. Se o arquivo não existir ou for inacessível, o servidor sairá com um erro. Se \* `file_name` \* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual. Esta deve ser a primeira opção na linha de comando se for usada.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--ledir=dir_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--ledir=dir_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do diretório</td> </tr></tbody></table>

Se `mysqld_safe` não conseguir encontrar o servidor, use esta opção para indicar o nome do caminho para o diretório onde o servidor está localizado.

Esta opção é aceita apenas na linha de comando, não em arquivos de opção. Em plataformas que usam systemd, o valor pode ser especificado no valor de `MYSQLD_OPTS`.

- `--log-error=file_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--log-error=file_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr></tbody></table>

Registre o registo de erros no ficheiro indicado, ver ponto 7.4.2, "Registo de erros".

- `--mysqld-safe-log-timestamps`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--mysqld-safe-log-timestamps=type</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Enumeração</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>utc</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>system</code>]]</p><p class="valid-value">[[<code>hyphen</code>]]</p><p class="valid-value">[[<code>legacy</code>]]</p></td> </tr></tbody></table>

Esta opção controla o formato para os timestamps na saída do log produzido por `mysqld_safe`. A lista a seguir descreve os valores permitidos. Para qualquer outro valor, `mysqld_safe` registra um aviso e usa o formato `UTC`.

- `UTC`, `utc`

  O formato ISO 8601 UTC (igual ao `--log_timestamps=UTC` para o servidor) é o padrão.
- `SYSTEM`, `system`

  Formato de hora local ISO 8601 (igual a `--log_timestamps=SYSTEM` para o servidor).
- `HYPHEN`, `hyphen`

  `YY-MM-DD h:mm:ss` formato, como em `mysqld_safe` para MySQL 5.6.
- `LEGACY`, `legacy`

  `YYMMDD hh:mm:ss` formato, como em `mysqld_safe` antes do MySQL 5.6.

* `--malloc-lib=[lib_name]`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--malloc-lib=[lib-name]</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

O nome da biblioteca a ser usada para alocação de memória em vez da biblioteca do sistema `malloc()`. O valor da opção deve ser um dos diretórios `/usr/lib`, `/usr/lib64`, `/usr/lib/i386-linux-gnu`, ou `/usr/lib/x86_64-linux-gnu`.

A opção `--malloc-lib` funciona modificando o valor do ambiente `LD_PRELOAD` para afetar a vinculação dinâmica para permitir que o carregador encontre a biblioteca de alocação de memória quando `mysqld` é executado:

- Se a opção não for dada, ou for dada sem um valor (`--malloc-lib=`), `LD_PRELOAD` não é modificado e nenhuma tentativa é feita para usar `tcmalloc`.
- Antes do MySQL 8.0.21, se a opção for dada como `--malloc-lib=tcmalloc`, `mysqld_safe` procura uma biblioteca `tcmalloc` em `/usr/lib`. Se `tmalloc` for encontrado, seu nome de caminho é adicionado ao início do valor `LD_PRELOAD` para `mysqld`. Se `tcmalloc` não for encontrado, `mysqld_safe` abortará com um erro.

  A partir do MySQL 8.0.21, `tcmalloc` não é um valor permitido para a opção `--malloc-lib`.
- Se a opção for dada como `--malloc-lib=/path/to/some/library`, esse caminho completo é adicionado ao início do valor `LD_PRELOAD`. Se o caminho completo apontar para um arquivo inexistente ou ilegível, `mysqld_safe` será abortado com um erro.
- Para casos em que `mysqld_safe` adiciona um nome de caminho para `LD_PRELOAD`, ele adiciona o caminho para o início de qualquer valor existente que a variável já tenha.

::: info Note

Em sistemas que gerenciam o servidor usando systemd, `mysqld_safe` não está disponível. Em vez disso, especifique a biblioteca de alocação definindo `LD_PRELOAD` em `/etc/sysconfig/mysql`.

:::

Os usuários do Linux podem usar a biblioteca `libtcmalloc_minimal.so` em qualquer plataforma para a qual um pacote `tcmalloc` esteja instalado no `/usr/lib` adicionando essas linhas ao arquivo `my.cnf`:

```
[mysqld_safe]
malloc-lib=tcmalloc
```

Para usar uma biblioteca específica, especifique o seu nome de caminho completo.

```
[mysqld_safe]
malloc-lib=/opt/lib/libtcmalloc_minimal.so
```

- `--mysqld=prog_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--mysqld=file_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr></tbody></table>

O nome do programa do servidor (no diretório `ledir`) que você deseja iniciar. Esta opção é necessária se você usar a distribuição binária do MySQL, mas tiver o diretório de dados fora da distribuição binária. Se `mysqld_safe` não puder encontrar o servidor, use a opção `--ledir` para indicar o nome do caminho para o diretório onde o servidor está localizado.

Esta opção é aceita apenas na linha de comando, não em arquivos de opção. Em plataformas que usam systemd, o valor pode ser especificado no valor de `MYSQLD_OPTS`.

- `--mysqld-version=suffix`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--mysqld-version=suffix</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Esta opção é semelhante à `--mysqld` opção, mas você especifica apenas o sufixo para o nome do programa do servidor. O nome base é assumido como `mysqld`. Por exemplo, se você usar `--mysqld-version=debug`, `mysqld_safe` inicia o programa **mysqld-debug** no diretório `ledir`. Se o argumento para `--mysqld-version` estiver vazio, `mysqld_safe` usa `mysqld` no diretório `ledir`.

Esta opção é aceita apenas na linha de comando, não em arquivos de opção. Em plataformas que usam systemd, o valor pode ser especificado no valor de `MYSQLD_OPTS`.

- `--nice=priority`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--nice=priority</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr></tbody></table>

Use o programa `nice` para definir a prioridade de agendamento do servidor para o valor dado.

- `--no-defaults`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--no-defaults</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Não leia nenhum arquivo de opções. Se o programa não for iniciado devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para impedi-las de serem lidas. Esta deve ser a primeira opção na linha de comando, se for usada.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--open-files-limit=count`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--open-files-limit=count</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

O número de arquivos que `mysqld` deve ser capaz de abrir. O valor da opção é passado para **ulimit -n**.

::: info Note

Você deve iniciar `mysqld_safe` como `root` para que isso funcione corretamente.

:::

- `--pid-file=file_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--pid-file=file_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr></tbody></table>

O nome do caminho que `mysqld` deve usar para o seu arquivo de ID de processo.

- `--plugin-dir=dir_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--plugin-dir=dir_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do diretório</td> </tr></tbody></table>

O nome do caminho do diretório do plugin.

- `--port=port_num`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--port=number</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr></tbody></table>

O número de porta que o servidor deve usar ao ouvir para conexões TCP / IP. O número de porta deve ser 1024 ou superior, a menos que o servidor seja iniciado pelo usuário do sistema operacional `root`.

- `--skip-kill-mysqld`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--skip-kill-mysqld</code>]]</td> </tr></tbody></table>

Não tente matar os processos errantes `mysqld` na inicialização. Esta opção funciona apenas no Linux.

- `--socket=path`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--socket=file_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr></tbody></table>

O arquivo de soquete do Unix que o servidor deve usar ao ouvir conexões locais.

- `--syslog`, `--skip-syslog`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--syslog</code>]]</td> </tr><tr><th>Depreciado</th> <td>Sim , sim .</td> </tr></tbody></table><table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--skip-syslog</code>]]</td> </tr><tr><th>Depreciado</th> <td>Sim , sim .</td> </tr></tbody></table>

`--syslog` faz com que mensagens de erro sejam enviadas para `syslog` em sistemas que suportam o programa **logger**. `--skip-syslog` suprime o uso de `syslog`; as mensagens são escritas em um arquivo de log de erro.

Quando `syslog` é usado para registro de erros, a facilidade/gravidade `daemon.err` é usada para todas as mensagens de registro.

O uso dessas opções para controlar o registo de `mysqld` é desaproveitado. Para escrever a saída do registo de erros no registo de sistema, use as instruções na Seção 7.4.2.8, Error Logging to the System Log. Para controlar a facilidade, use a variável de sistema do servidor `log_syslog_facility`.

- `--syslog-tag=tag`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--syslog-tag=tag</code>]]</td> </tr><tr><th>Depreciado</th> <td>Sim , sim .</td> </tr></tbody></table>

Para fazer logs em `syslog`, as mensagens de `mysqld_safe` e `mysqld` são escritas com identificadores de `mysqld_safe` e `mysqld`, respectivamente. Para especificar um sufixo para os identificadores, use `--syslog-tag=tag`, que modifica os identificadores para serem `mysqld_safe-tag` e `mysqld-tag`.

O uso desta opção para controlar o registo de `mysqld` é depreciado. Em vez disso, use a variável de sistema do servidor `log_syslog_tag`. Veja a Seção 7.4.2.8, Error Logging to the System Log.

- `--timezone=timezone`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--timezone=timezone</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Defina a variável de ambiente de fuso horário `TZ` para o valor de opção dado. Consulte a documentação do sistema operacional para formatos legais de especificação de fuso horário.

- `--user={user_name|user_id}`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--user={user_name|user_id}</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr></tbody></table>

Execute o servidor `mysqld` como o usuário com o nome `user_name` ou o ID de usuário numérico `user_id`. (Usuário neste contexto refere-se a uma conta de login do sistema, não um usuário MySQL listado nas tabelas de concessão.)

Se você executar `mysqld_safe` com a opção `--defaults-file` ou `--defaults-extra-file` para nomear um arquivo de opção, a opção deve ser a primeira dada na linha de comando ou o arquivo de opção não é usado. Por exemplo, este comando não usa o arquivo de opção nomeado:

```
mysql> mysqld_safe --port=port_num --defaults-file=file_name
```

Em vez disso, use o seguinte comando:

```
mysql> mysqld_safe --defaults-file=file_name --port=port_num
```

O script `mysqld_safe` é escrito de modo que ele normalmente pode iniciar um servidor que foi instalado a partir de uma fonte ou uma distribuição binária do MySQL, mesmo que esses tipos de distribuições normalmente instalem o servidor em locais ligeiramente diferentes. (Veja Seção 2.1.5, "Installation Layouts") `mysqld_safe` espera que uma das seguintes condições seja verdadeira:

- O servidor e os bancos de dados podem ser encontrados em relação ao diretório de trabalho (o diretório a partir do qual `mysqld_safe` é invocado). Para distribuições binárias, `mysqld_safe` procura sob seu diretório de trabalho os diretórios `bin` e `data` . Para distribuições de origem, procura os diretórios `libexec` e `var` . Esta condição deve ser atendida se você executar `mysqld_safe` a partir do seu diretório de instalação do MySQL (por exemplo, `/usr/local/mysql` para uma distribuição binária).
- Se o servidor e os bancos de dados não puderem ser encontrados em relação ao diretório de trabalho, `mysqld_safe` tenta localizá-los por nomes de caminho absolutos. Localizações típicas são `/usr/local/libexec` e `/usr/local/var`.

Como `mysqld_safe` tenta encontrar o servidor e bancos de dados em relação ao seu próprio diretório de trabalho, você pode instalar uma distribuição binária do MySQL em qualquer lugar, desde que você execute `mysqld_safe` a partir do diretório de instalação do MySQL:

```
cd mysql_installation_directory
bin/mysqld_safe &
```

Se `mysqld_safe` falhar, mesmo quando invocado a partir do diretório de instalação do MySQL, especifique as opções `--ledir` e `--datadir` para indicar os diretórios em que o servidor e as bases de dados estão localizados no seu sistema.

`mysqld_safe` tenta usar os utilitários do sistema **sleep** e **date** para determinar quantas vezes por segundo ele tentou iniciar. Se esses utilitários estiverem presentes e as tentativas de inicialização por segundo forem maiores que 5, `mysqld_safe` espera 1 segundo completo antes de iniciar novamente. Isso destina-se a evitar o uso excessivo da CPU em caso de falhas repetidas. (Bug #11761530, Bug #54035)

Quando você usa `mysqld_safe` para iniciar `mysqld`, `mysqld_safe` organiza mensagens de erro (e aviso) de si mesmo e de `mysqld` para ir para o mesmo destino.

Existem várias opções `mysqld_safe` para controlar o destino dessas mensagens:

- `--log-error=file_name`: Escrever mensagens de erro para o arquivo de erro nomeado.
- `--syslog`: Escreva mensagens de erro para `syslog` em sistemas que suportam o programa **logger**.
- `--skip-syslog`: Não escreva mensagens de erro para `syslog`. As mensagens são escritas para o arquivo de registro de erro padrão (`host_name.err` no diretório de dados), ou para um arquivo nomeado se a opção `--log-error` for dada.

Se nenhuma dessas opções for fornecida, o padrão é `--skip-syslog`.

Quando `mysqld_safe` escreve uma mensagem, os avisos vão para o destino de registro (`syslog` ou o arquivo de registro de erros) e `stdout`. Os erros vão para o destino de registro e `stderr`.

::: info Note

Controlar o registro do `mysqld` a partir do `mysqld_safe` está desatualizado. Em vez disso, use o suporte nativo do `syslog` do servidor. Para mais informações, consulte a Seção 7.4.2.8, Error Logging to the System Log.

:::
