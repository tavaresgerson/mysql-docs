### 6.3.2 `mysqld_safe` — Script de Inicialização do Servidor MySQL

`mysqld_safe` é a maneira recomendada para iniciar um servidor `mysqld` no Unix. `mysqld_safe` adiciona algumas funcionalidades de segurança, como reiniciar o servidor quando ocorre um erro e registrar informações de execução em um log de erro. Uma descrição do registro de erros é dada mais adiante nesta seção.

::: info Nota

Para algumas plataformas Linux, a instalação do MySQL a partir de pacotes RPM ou Debian inclui suporte do systemd para gerenciar a inicialização e o desligamento do servidor MySQL. Nessas plataformas, `mysqld_safe` não é instalado porque é desnecessário. Para mais informações, consulte a Seção 2.5.9, “Gerenciamento do Servidor MySQL com o systemd”.

Uma implicação do não uso de `mysqld_safe` em plataformas que usam o systemd para gerenciamento de servidores é que o uso de seções `[mysqld_safe]` ou `[safe_mysqld]` em arquivos de opção não é suportado e pode levar a comportamentos inesperados.

`mysqld_safe` tenta iniciar um executável chamado `mysqld`. Para sobrescrever o comportamento padrão e especificar explicitamente o nome do servidor que deseja executar, especifique uma opção `--mysqld` ou `--mysqld-version` para `mysqld_safe`. Você também pode usar `--ledir` para indicar o diretório onde `mysqld_safe` deve procurar o servidor.

Muitas das opções para `mysqld_safe` são as mesmas das opções para `mysqld`. Consulte a Seção 7.1.7, “Opções de Comando do Servidor”.

Opções desconhecidas para `mysqld_safe` são passadas para `mysqld` se forem especificadas na linha de comando, mas ignoradas se forem especificadas no grupo `[mysqld_safe]` de um arquivo de opção. Consulte a Seção 6.2.2.2, “Uso de Arquivos de Opção”.

`mysqld_safe` lê todas as opções das seções `[mysqld]`, `[server]` e `[mysqld_safe]` em arquivos de opção. Por exemplo, se você especificar uma seção `[mysqld]` assim, `mysqld_safe` encontra e usa a opção `--log-error`:

```
[mysqld]
log-error=error.log
```

Para compatibilidade com versões anteriores, `mysqld_safe` também lê seções `[safe_mysqld]`, mas para ser atual, você deve renomear tais seções para `[mysqld_safe]`.

`mysqld_safe` aceita opções na linha de comando e em arquivos de opções, conforme descrito na tabela a seguir. Para obter informações sobre os arquivos de opções usados pelos programas MySQL, consulte a Seção 6.2.2.2, “Usando arquivos de opções”.

**Tabela 6.7 Opções de `mysqld_safe`**

<table><thead><tr><th>Nome da Opção</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>--basedir</code></td> <td>Caminho para o diretório de instalação do MySQL</td> </tr><tr><td><code>--core-file-size</code></td> <td>Tamanho do arquivo de núcleo que o mysqld deve ser capaz de criar</td> </tr><tr><td><code>--datadir</code></td> <td>Caminho para o diretório de dados</td> </tr><tr><td><code>--defaults-extra-file</code></td> <td>Leia o arquivo de opção nomeado além dos arquivos de opção usuais</td> </tr><tr><td><code>--defaults-file</code></td> <td>Leia apenas o arquivo de opção nomeado</td> </tr><tr><td><code>--help</code></td> <td>Exibir mensagem de ajuda e sair</td> </tr><tr><td><code>--ledir</code></td> <td>Caminho para o diretório onde o servidor está localizado</td> </tr><tr><td><code>--log-error</code></td> <td>Escrever o log de erro em um arquivo nomeado</td> </tr><tr><td><code>--malloc-lib</code></td> <td>Biblioteca malloc alternativa a ser usada pelo mysqld</td> </tr><tr><td><code>--mysqld</code></td> <td>Nome do programa do servidor a ser iniciado (no diretório ledir)</td> </tr><tr><td><code>--mysqld-safe-log-timestamps</code></td> <td>Formato de data e hora para o registro de logs</td> </tr><tr><td><code>--mysqld-version</code></td> <td>Sufixo para o nome do programa do servidor</td> </tr><tr><td><code>--nice</code></td> <td>Usar o programa nice para definir a prioridade de agendamento do servidor</td> </tr><tr><td><code>--no-defaults</code></td> <td>Não ler arquivos de opção</td> </tr><tr><td><code>--open-files-limit</code></td> <td>Número de arquivos que o mysqld deve ser capaz de abrir</td> </tr><tr><td><code>--pid-file</code></td> <td>Nome do arquivo de ID do processo do servidor</td> </tr><tr><td><code>--plugin-dir</code></td> <td>Diretório onde os plugins estão instalados</td> </tr><tr><td><code>--port</code></td> <td>Número de porta no qual o servidor deve ouvir conexões TCP/IP</td> </tr><tr><td><code>--skip-kill-mysqld</code></td> <td>Não tentar matar processos mysqld soltos</td> </tr><tr><td><code>--skip-syslog</code></td> <td>Não escrever mensagens de erro no syslog; usar o arquivo de log de erro</td> </tr><tr><td><code>--socket</code></td> <td>Arquivo de socket no qual o servidor deve ouvir conexões de socket Unix</td> </tr><tr><td><code>--syslog</code></td> <td>Escrever mensagens de erro no syslog</td> </tr><tr><td><code>--syslog-tag</code></td> <td>Sufixo de tag para mensagens escritas no syslog</td> </tr><tr><td><code>--timezone</code></td> <td>Definir a variável de ambiente TZ para o valor nomeado</td> </tr><tr><td><code>--user</code></td> <td>Executar o mysqld como usuário com o nome <code>user_name</code> ou ID de usuário numérico <code>user_id</code></td> </tr></tbody></table>

*  `--help`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Exibir uma mensagem de ajuda e sair.
*  `--basedir=nome_pasta`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--basedir=nome_pasta</code></td> </tr><tr><th>Tipo</th> <td>Nome da pasta</td> </tr></tbody></table>

  Caminho para o diretório de instalação do MySQL.
*  `--core-file-size=tamanho`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--core-file-size=tamanho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O tamanho do arquivo de núcleo que o `mysqld` deve ser capaz de criar. O valor da opção é passado para `ulimit -c`.

  ::: info Nota

  A variável `innodb_buffer_pool_in_core_file` pode ser usada para reduzir o tamanho dos arquivos de núcleo em sistemas operacionais que a suportam. Para mais informações, consulte  Seção 17.8.3.7, “Excluindo ou incluindo páginas do buffer pool de arquivos de núcleo”.

  :::

*  `--datadir=nome_pasta`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--datadir=nome_pasta</code></td> </tr><tr><th>Tipo</th> <td>Nome da pasta</td> </tr></tbody></table>

  Caminho para o diretório de dados.
*  `--defaults-extra-file=nome_arquivo`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-extra-file=nome_arquivo</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Leia este arquivo de opção adicional aos arquivos de opção usuais. Se o arquivo não existir ou não for acessível, o servidor sai com um erro. Se *`nome_arquivo`* não for um nome de caminho absoluto, ele é interpretado em relação ao diretório atual. Isso deve ser a primeira opção na linha de comando se for usada.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opção, consulte  Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opção”.
*  `--defaults-file=nome_arquivo`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-file=nome_do_arquivo</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Use apenas a opção fornecida. Se o arquivo não existir ou estiver inacessível, o servidor será encerrado com um erro. Se *`nome_do_arquivo`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual. Isso deve ser a primeira opção na linha de comando se for usada.

  Para obter informações adicionais sobre essa e outras opções de arquivo, consulte  Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opção”.
*  `--ledir=nome_diretorio`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--ledir=nome_diretorio</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  Se o `mysqld_safe` não conseguir encontrar o servidor, use esta opção para indicar o nome do caminho do diretório onde o servidor está localizado.

  Esta opção é aceita apenas na linha de comando, não em arquivos de opção. Em plataformas que usam systemd, o valor pode ser especificado no valor de `MYSQLD_OPTS`. Consulte  Seção 2.5.9, “Gerenciamento do servidor MySQL com systemd”.
*  `--log-error=nome_arquivo`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--log-error=nome_arquivo</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Escreva o log de erro no arquivo fornecido. Consulte Seção 7.4.2, “O log de erro”.
*  `--mysqld-safe-log-timestamps`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--mysqld-safe-log-timestamps=tipo</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td><code>utc</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valor_valido"><code>system</code></p><p class="valor_valido"><code>hyphen</code></p><p class="valor_valido"><code>legacy</code></p></td> </tr></tbody></table>

Esta opção controla o formato dos timestamps na saída de log gerada pelo `mysqld_safe`. A lista a seguir descreve os valores permitidos. Para qualquer outro valor, o `mysqld_safe` registra uma mensagem de aviso e usa o formato `UTC`.

  + `UTC`, `utc`

    Formato ISO 8601 `UTC` (mesmo que `--log_timestamps=UTC` para o servidor). Este é o padrão.
  + `SYSTEM`, `system`

    Formato de hora local ISO 8601 (mesmo que `--log_timestamps=SYSTEM` para o servidor).
  + `HYPHEN`, `hyphen`

    Formato `YY-MM-DD h:mm:ss`, como no `mysqld_safe` para o MySQL 5.6.
  + `LEGACY`, `legacy`

    Formato `YYMMDD hh:mm:ss`, como no `mysqld_safe` antes do MySQL 5.6.
*  `--malloc-lib=[lib_name]`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--malloc-lib=[lib-name]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O nome da biblioteca a ser usado para alocação de memória em vez da biblioteca `malloc()` do sistema. O valor da opção deve ser um dos diretórios `/usr/lib`, `/usr/lib64`, `/usr/lib/i386-linux-gnu` ou `/usr/lib/x86_64-linux-gnu`.

  A opção `--malloc-lib` funciona modificando o valor do ambiente `LD_PRELOAD` para afetar o link dinâmico, permitindo que o carregador encontre a biblioteca de alocação de memória quando o `mysqld` é executado:

  + Se a opção não for fornecida ou for fornecida sem um valor (`--malloc-lib=`), o `LD_PRELOAD` não é modificado e não há tentativa de usar o `tcmalloc`.
  + Antes do MySQL 8.0.21, se a opção for fornecida como `--malloc-lib=tcmalloc`, o `mysqld_safe` procura por uma biblioteca `tcmalloc` em `/usr/lib`. Se o `tmalloc` for encontrado, seu nome de caminho é adicionado ao início do valor de `LD_PRELOAD` para o `mysqld`. Se o `tcmalloc` não for encontrado, o `mysqld_safe` aborta com um erro.

A partir do MySQL 8.0.21, `tcmalloc` não é um valor permitido para a opção `--malloc-lib`.
+ Se a opção for fornecida como `--malloc-lib=/caminho/para/algum/biblioteca`, esse caminho completo é adicionado ao início do valor de `LD_PRELOAD`. Se o caminho completo apontar para um arquivo inexistente ou ilegível, o `mysqld_safe` interrompe com um erro.
+ Para casos em que o `mysqld_safe` adiciona um nome de caminho ao `LD_PRELOAD`, ele adiciona o caminho ao início de qualquer valor existente que a variável já tenha.
  
  ::: info Nota

  Em sistemas que gerenciam o servidor usando o systemd, o `mysqld_safe` não está disponível. Em vez disso, especifique a biblioteca de alocação definindo `LD_PRELOAD` em `/etc/sysconfig/mysql`.

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
*  `--mysqld=nome_do_programa`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--mysqld=nome_do_arquivo</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  O nome do programa do servidor (no diretório `ledir`) que você deseja iniciar. Esta opção é necessária se você usar a distribuição binária do MySQL, mas tiver o diretório de dados fora da distribuição binária. Se o `mysqld_safe` não conseguir encontrar o servidor, use a opção `--ledir` para indicar o nome do caminho do diretório onde o servidor está localizado.

  Esta opção é aceita apenas na linha de comando, não em arquivos de opção. Em plataformas que usam o systemd, o valor pode ser especificado no valor de `MYSQLD_OPTS`. Veja a Seção 2.5.9, “Gerenciamento do Servidor MySQL com systemd”.
*  `--mysqld-version=sufixo`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--mysqld-version=sufixo</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

Esta opção é semelhante à opção `--mysqld`, mas você especifica apenas o sufixo para o nome do programa do servidor. O nome base é assumido como `mysqld`. Por exemplo, se você usar `--mysqld-version=debug`, o `mysqld_safe` inicia o programa `mysqld-debug` no diretório `ledir`. Se o argumento para `--mysqld-version` estiver vazio, o `mysqld_safe` usa `mysqld` no diretório `ledir`.

Esta opção é aceita apenas na linha de comando, não em arquivos de opção. Em plataformas que usam systemd, o valor pode ser especificado no valor de `MYSQLD_OPTS`.
*  `--nice=prioridade`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--nice=prioridade</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  Use o programa `nice` para definir a prioridade de agendamento do servidor para o valor fornecido.
*  `--no-defaults`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--no-defaults</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Não leia nenhum arquivo de opção. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opção, `--no-defaults` pode ser usado para evitar que sejam lidas. Isso deve ser a primeira opção na linha de comando se for usado.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opção, consulte a Seção 6.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opção”.
*  `--open-files-limit=count`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--open-files-limit=count</code></td> </tr><tr><th>Tipo</th> <td>Nome de arquivo</td> </tr></tbody></table>

  O número de arquivos que o `mysqld` deve ser capaz de abrir. O valor da opção é passado para `ulimit -n`.

  ::: info Nota

  Você deve iniciar o `mysqld_safe` como `root` para que isso funcione corretamente.

  :::

O nome do caminho que o `mysqld` deve usar para o arquivo de ID de processo.
* `--plugin-dir=dir_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--plugin-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome de diretório</td> </tr></tbody></table>

  O nome do caminho do diretório do plugin.
* `--port=port_num`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--port=número</code></td> </tr><tr><th>Tipo</th> <td>Número</td> </tr></tbody></table>

  O número de porta que o servidor deve usar ao ouvir conexões TCP/IP. O número de porta deve ser 1024 ou maior, a menos que o servidor seja iniciado pelo usuário do sistema operacional `root`.
* `--skip-kill-mysqld`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--skip-kill-mysqld</code></td> </tr></tbody></table>

  Não tente matar processos isolados do `mysqld` no momento do início. Esta opção só funciona no Linux.
* `--socket=caminho`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--socket=nome_arquivo</code></td> </tr><tr><th>Tipo</th> <td>Nome de arquivo</td> </tr></tbody></table>

  O arquivo de socket Unix que o servidor deve usar ao ouvir conexões locais.
* `--syslog`, `--skip-syslog`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--syslog</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr></tbody></table><table><tbody><tr><th>Formato de linha de comando</th> <td><code>--skip-syslog</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr></tbody></table>

   `--syslog` faz com que os erros sejam enviados para o `syslog` em sistemas que suportam o programa `logger`. `--skip-syslog` suprime o uso do `syslog`; as mensagens são escritas em um arquivo de log de erro.

  Quando o `syslog` é usado para registro de erros, a facilidade/gravidade `daemon.err` é usada para todas as mensagens de log.

O uso dessas opções para controlar o registro do `mysqld` está desatualizado. Para gravar a saída do log de erro no log do sistema, use as instruções na Seção 7.4.2.8, “Registro de Erros no Log do Sistema”. Para controlar a facilidade, use a variável de sistema `log_syslog_facility`.
*  `--syslog-tag=tag`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--syslog-tag=tag</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr></tbody></table>

  Para registrar mensagens no `syslog`, as mensagens do `mysqld_safe` e do `mysqld` são escritas com identificadores de `mysqld_safe` e `mysqld`, respectivamente. Para especificar um sufixo para os identificadores, use `--syslog-tag=tag`, que modifica os identificadores para `mysqld_safe-tag` e `mysqld-tag`.

  O uso desta opção para controlar o registro do `mysqld` está desatualizado. Use a variável de sistema `log_syslog_tag` do servidor. Consulte a documentação do seu sistema operacional para os formatos de especificação de fuso horário legal.
*  `--timezone=timezone`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--timezone=timezone</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Defina a variável de ambiente `TZ` para o valor da opção fornecida. Consulte a documentação do seu sistema operacional para os formatos de especificação de fuso horário legal.
*  `--user={user_name|user_id}`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--user={user_name|user_id}</code></td> </tr><tr><th>Tipo</th> <td><code>String</code></td> </tr><tr><th>Tipo</th> <td><code>Numeric</code></td> </tr></tbody></table>

  Execute o servidor `mysqld` como o usuário com o nome *`user_name`* ou o ID de usuário numérico *`user_id`*. (“Usuário” neste contexto se refere a uma conta de login do sistema, não a um usuário MySQL listado nas tabelas de concessão.)

Se você executar `mysqld_safe` com a opção `--defaults-file` ou `--defaults-extra-file` para nomear um arquivo de opções, a opção deve ser a primeira fornecida na linha de comando ou o arquivo de opções não é usado. Por exemplo, este comando não usa o arquivo de opção nomeado:

```
mysql> mysqld_safe --port=port_num --defaults-file=file_name
```

Em vez disso, use o seguinte comando:

```
mysql> mysqld_safe --defaults-file=file_name --port=port_num
```

O script `mysqld_safe` é escrito de forma que ele normalmente possa iniciar um servidor que foi instalado a partir de uma distribuição de fonte ou binária do MySQL, mesmo que esses tipos de distribuições normalmente instalem o servidor em locais ligeiramente diferentes. (Veja a Seção 2.1.5, “Layouts de Instalação”.) O `mysqld_safe` espera que uma das seguintes condições seja verdadeira:

* O servidor e os bancos de dados possam ser encontrados em relação ao diretório de trabalho (o diretório a partir do qual o `mysqld_safe` é invocado). Para distribuições binárias, o `mysqld_safe` procura por diretórios `bin` e `data` em seu diretório de trabalho. Para distribuições de fonte, ele procura por diretórios `libexec` e `var`. Esta condição deve ser atendida se você executar o `mysqld_safe` a partir do diretório de instalação do MySQL (por exemplo, `/usr/local/mysql` para uma distribuição binária).
* Se o servidor e os bancos de dados não puderem ser encontrados em relação ao diretório de trabalho, o `mysqld_safe` tenta localizá-los por nomes de caminho absolutos. Locais típicos são `/usr/local/libexec` e `/usr/local/var`. Os locais reais são determinados pelos valores configurados na distribuição no momento em que foi construída. Eles devem estar corretos se o MySQL estiver instalado na localização especificada no momento da configuração.

Como o `mysqld_safe` tenta encontrar o servidor e os bancos de dados em relação ao seu próprio diretório de trabalho, você pode instalar uma distribuição binária do MySQL em qualquer lugar, desde que execute o `mysqld_safe` a partir do diretório de instalação do MySQL:

```
cd mysql_installation_directory
bin/mysqld_safe &
```

Se o `mysqld_safe` falhar, mesmo quando invocado a partir do diretório de instalação do MySQL, especifique as opções `--ledir` e `--datadir` para indicar os diretórios nos quais o servidor e os bancos de dados estão localizados no seu sistema.

`mysqld_safe` tenta usar as utilidades de sistema `sleep` e `date` para determinar quantas vezes por segundo tentou iniciar. Se essas utilidades estiverem presentes e as tentativas de início por segundo forem maiores que 5, `mysqld_safe` aguarda 1 segundo completo antes de iniciar novamente. Isso visa prevenir o uso excessivo da CPU em caso de falhas repetidas. (Bug `#11761530`, Bug `#54035`)

Quando você usa `mysqld_safe` para iniciar `mysqld`, `mysqld_safe` garante que as mensagens de erro (e de aviso) de si mesmo e de `mysqld` sejam direcionadas para o mesmo destino.

Existem várias opções de `mysqld_safe` para controlar o destino dessas mensagens:

* `--log-error=nome_arquivo`: Escreva mensagens de erro para o arquivo de erro nomeado.
* `--syslog`: Escreva mensagens de erro para o `syslog` em sistemas que suportam o programa `logger`.
* `--skip-syslog`: Não escreva mensagens de erro para o `syslog`. As mensagens são escritas para o arquivo de log de erro padrão (`host_name.err` no diretório de dados) ou para um arquivo nomeado se a opção `--log-error` for fornecida.

Se nenhuma dessas opções for fornecida, o padrão é `--skip-syslog`.

Quando `mysqld_safe` escreve uma mensagem, as observações são direcionadas para o destino de registro (`syslog` ou o arquivo de log de erro) e `stdout`. Os erros são direcionados para o destino de registro e `stderr`.

::: info Nota

O controle do registro do `mysqld` a partir de `mysqld_safe` está desatualizado. Use o suporte nativo de `syslog` do servidor.

:::