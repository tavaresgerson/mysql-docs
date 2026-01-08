### 4.3.2 mysqld_safe — Script de inicialização do servidor MySQL

**mysqld_safe** é a maneira recomendada para iniciar um servidor **mysqld** no Unix. **mysqld_safe** adiciona algumas funcionalidades de segurança, como reiniciar o servidor quando ocorre um erro e registrar informações de execução em um log de erro. Uma descrição do registro de erros é dada mais adiante nesta seção.

Nota

Para algumas plataformas Linux, a instalação do MySQL a partir de pacotes RPM ou Debian inclui suporte ao systemd para gerenciar o início e o desligamento do servidor MySQL. Nessas plataformas, **mysqld_safe** não é instalado porque é desnecessário. Para mais informações, consulte Seção 2.5.10, “Gerenciamento do Servidor MySQL com o systemd”.

Uma implicação do não uso de **mysqld_safe** em plataformas que utilizam o systemd para gerenciamento de servidores é que o uso das seções `[mysqld_safe]` ou `[safe_mysqld]` em arquivos de opções não é suportado e pode levar a comportamentos inesperados.

**mysqld_safe** tenta iniciar um executável chamado **mysqld**. Para substituir o comportamento padrão e especificar explicitamente o nome do servidor que você deseja executar, especifique uma opção `--mysqld` ou `--mysqld-version` para **mysqld_safe**. Você também pode usar a opção `--ledir` para indicar o diretório onde **mysqld_safe** deve procurar o servidor.

Muitas das opções para **mysqld_safe** são as mesmas das opções para **mysqld**. Veja Seção 5.1.6, “Opções de comando do servidor”.

Opções desconhecidas para **mysqld_safe** são passadas para **mysqld** se forem especificadas na linha de comando, mas ignoradas se forem especificadas no grupo `[mysqld_safe]` de um arquivo de opções. Veja Seção 4.2.2.2, “Usando Arquivos de Opções”.

**mysqld_safe** lê todas as opções das seções [**mysqld**], [**server**] e [**mysqld_safe**] nos arquivos de opções. Por exemplo, se você especificar uma seção [**mysqld**] assim, **mysqld_safe** encontra e usa a opção `--log-error`:

```sql
[mysqld]
log-error=error.log
```

Para compatibilidade com versões anteriores, o **mysqld_safe** também lê seções de `[safe_mysqld]`, mas para manter a atualidade, você deve renomear essas seções para `[mysqld_safe]`.

**mysqld_safe** aceita opções na linha de comando e em arquivos de opção, conforme descrito na tabela a seguir. Para informações sobre arquivos de opção usados por programas MySQL, consulte Seção 4.2.2.2, “Usando Arquivos de Opção”.

**Tabela 4.6 Opções do mysqld_safe**

<table>
   <thead>
      <tr>
         <th>Nome da Opção</th>
         <th>Descrição</th>
         <th>Introduzido</th>
         <th>Desatualizado</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <th>--basedir</th>
         <td>Caminho para o diretório de instalação do MySQL</td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th>--core-file-size</th>
         <td>Tamanho do arquivo de núcleo que o mysqld deve ser capaz de criar</td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th>--datadir</th>
         <td>Caminho para o diretório de dados</td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th>--defaults-extra-file</th>
         <td>Leia o arquivo de opção nomeado, além dos arquivos de opção usuais</td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th>--defaults-file</th>
         <td>Arquivo de opção de leitura apenas nomeado</td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th>--help</th>
         <td>Exibir mensagem de ajuda e sair</td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th>--ledir</th>
         <td>Caminho para o diretório onde o servidor está localizado</td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th>--log-error</th>
         <td>Escreva o log de erros em um arquivo nomeado</td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th>--malloc-lib</th>
         <td>Biblioteca malloc alternativa para usar no mysqld</td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th>--mysqld</th>
         <td>Nome do programa do servidor para iniciar (no diretório ledir)</td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th>--mysqld-safe-log-timestamps</th>
         <td>Formato de data e hora para registro</td>
         <td>5.7.11</td>
         <td></td>
      </tr>
      <tr>
         <th>--mysqld-version</th>
         <td>Sufixo para o nome do programa do servidor</td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th>--nice</th>
         <td>Use um bom programa para definir a prioridade de agendamento do servidor</td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th>--no-defaults</th>
         <td>Não ler arquivos de opção</td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th>--limite-de-arquivos-abertos</th>
         <td>Número de arquivos que o mysqld deve ser capaz de abrir</td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th>--pid-file</th>
         <td>Nome do caminho do arquivo de ID do processo do servidor</td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th>--plugin-dir</th>
         <td>Diretório onde os plugins são instalados</td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th>--port</th>
         <td>Número de porta para ouvir conexões TCP/IP</td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th>--skip-kill-mysqld</th>
         <td>Não tente matar processos de mysqld errantes</td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th>--skip-syslog</th>
         <td>Não escreva mensagens de erro no syslog; use o arquivo de log de erro</td>
         <td></td>
         <td>Sim</td>
      </tr>
      <tr>
         <th>--socket</th>
         <td>Arquivo de soquete para ouvir conexões de soquete Unix</td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th>--syslog</th>
         <td>Escreva mensagens de erro no syslog</td>
         <td></td>
         <td>Sim</td>
      </tr>
      <tr>
         <th>--syslog-tag</th>
         <td>Sufixo de etiqueta para mensagens escritas no syslog</td>
         <td></td>
         <td>Sim</td>
      </tr>
      <tr>
         <th>--timezone</th>
         <td>Defina a variável de ambiente de fuso horário TZ para o valor nomeado</td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th>--user</th>
         <td>Execute o mysqld como usuário com o nome user_name ou ID de usuário numérico user_id</td>
         <td></td>
         <td></td>
      </tr>
   </tbody>
</table>

- `--help`

  <table><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  <table><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  Exiba uma mensagem de ajuda e saia.

- `--basedir=nome_do_diretório`

  <table><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--basedir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  <table><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--basedir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  O caminho para o diretório de instalação do MySQL.

- `--core-file-size=tamanho`

  <table><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--core-file-size=size</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  <table><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--core-file-size=size</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O tamanho do arquivo de núcleo que o **mysqld** deve ser capaz de criar. O valor da opção é passado para **ulimit -c**.

- `--datadir=nome_do_diretório`

  <table><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--datadir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  <table><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--datadir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  O caminho para o diretório de dados.

- `--defaults-extra-file=nome_do_arquivo`

  <table><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-extra-file=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  <table><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  Leia este arquivo de opção em adição aos arquivos de opção usuais. Se o arquivo não existir ou estiver inacessível, o servidor sai com um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual. Isso deve ser a primeira opção na linha de comando se ela for usada.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opção”.

- `--defaults-file=nome_do_arquivo`

  <table><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou estiver inacessível, o servidor sai com um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual. Isso deve ser a primeira opção na linha de comando se ela for usada.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opção”.

- `--ledir=nome_do_diretório`

  <table><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  Se o **mysqld_safe** não conseguir encontrar o servidor, use esta opção para indicar o nome do caminho para o diretório onde o servidor está localizado.

  A partir do MySQL 5.7.17, essa opção só é aceita na linha de comando, não em arquivos de opções. Em plataformas que usam o systemd, o valor pode ser especificado no valor de `MYSQLD_OPTS`. Consulte Seção 2.5.10, “Gerenciamento do servidor MySQL com o systemd”.

- `--log-error=nome_do_arquivo`

  <table><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  Escreva o log de erro no arquivo fornecido. Consulte Seção 5.4.2, “O Log de Erro”.

- `--mysqld-safe-log-timestamps`

  <table><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  Esta opção controla o formato dos timestamps na saída de log gerada pelo **mysqld_safe**. A lista a seguir descreve os valores permitidos. Para qualquer outro valor, o **mysqld_safe** registra uma mensagem de aviso e usa o formato `UTC`.

  - `UTC`, `utc`

    Formato ISO 8601 UTC (mesmo que `--log_timestamps=UTC` para o servidor). Este é o padrão.

  - `SYSTEM`, `system`

    Formato de hora local ISO 8601 (mesmo que `--log_timestamps=SYSTEM` para o servidor).

  - `HYPHEN`, `parafuso`

    Formato **YY-MM-DD h:mm:ss**, como em **mysqld_safe** para o MySQL 5.6.

  - `LEGACY`, `legacy`

    Formato **`YYMMDD hh:mm:ss`**, como em **mysqld_safe** antes do MySQL 5.6.

  Essa opção foi adicionada no MySQL 5.7.11.

- `--malloc-lib=[nome_do_biblioteca]`

  <table><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  O nome da biblioteca a ser usado para alocação de memória em vez da biblioteca `malloc()` do sistema. A partir do MySQL 5.7.15, o valor da opção deve ser um dos diretórios `/usr/lib`, `/usr/lib64`, `/usr/lib/i386-linux-gnu` ou `/usr/lib/x86_64-linux-gnu`. Antes do MySQL 5.7.15, qualquer biblioteca pode ser usada especificando seu nome de caminho, mas há uma forma abreviada para habilitar o uso da biblioteca `tcmalloc`, que é fornecida com as distribuições binárias do MySQL para Linux no MySQL 5.7. É possível que a forma abreviada não funcione em determinadas configurações, nesse caso, você deve especificar um nome de caminho.

  ::: info Nota
  A partir da versão 5.7.13 do MySQL, as distribuições do MySQL não incluem mais a biblioteca `tcmalloc`.
  :::

  A opção `--malloc-lib` funciona modificando o valor do ambiente `LD_PRELOAD` para afetar o link dinâmico, permitindo que o carregador encontre a biblioteca de alocação de memória quando o **mysqld** estiver em execução:

  - Se a opção não for fornecida ou for fornecida sem um valor (`--malloc-lib=`), o `LD_PRELOAD` não será modificado e não haverá tentativa de usar o `tcmalloc`.

  - Antes do MySQL 5.7.31, se a opção for fornecida como `--malloc-lib=tcmalloc`, o **mysqld_safe** procura por uma biblioteca `tcmalloc` em `/usr/lib` e, em seguida, na localização do `pkglibdir` do MySQL (por exemplo, `/usr/local/mysql/lib` ou o que for apropriado). Se o `tmalloc` for encontrado, seu nome de caminho é adicionado ao início do valor `LD_PRELOAD` para **mysqld**. Se o `tcmalloc` não for encontrado, o **mysqld_safe** interrompe com um erro.

    A partir do MySQL 5.7.31, `tcmalloc` não é um valor permitido para a opção `--malloc-lib`.

  - Se a opção for fornecida como `--malloc-lib=/caminho/para/alguma/biblioteca`, esse caminho completo é adicionado ao início do valor `LD_PRELOAD`. Se o caminho completo apontar para um arquivo inexistente ou ilegível, o **mysqld_safe** abortará com um erro.

  - Nos casos em que o **mysqld_safe** adiciona um nome de caminho ao `LD_PRELOAD`, ele adiciona o caminho ao início de qualquer valor existente que a variável já tenha.

  Nota

  Em sistemas que gerenciam o servidor usando o systemd, **mysqld_safe** não está disponível. Em vez disso, especifique a biblioteca de alocação definindo `LD_PRELOAD` em `/etc/sysconfig/mysql`.

  Os usuários do Linux podem usar o `libtcmalloc_minimal.so` incluído em pacotes binários adicionando essas linhas ao arquivo `my.cnf`:

  ```
  [mysqld_safe]
  malloc-lib=tcmalloc
  ```

  Essas linhas também são suficientes para usuários em qualquer plataforma que tenham instalado um pacote `tcmalloc` no `/usr/lib`. Para usar uma biblioteca específica do `tcmalloc`, especifique seu nome completo. Exemplo:

  ```
  [mysqld_safe]
  malloc-lib=/opt/lib/libtcmalloc_minimal.so
  ```

- `--mysqld=nome_do_programa`

  <table><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>6

  O nome do programa do servidor (no diretório `ledir`) que você deseja iniciar. Esta opção é necessária se você usar a distribuição binária do MySQL, mas tiver o diretório de dados fora da distribuição binária. Se o **mysqld_safe** não conseguir encontrar o servidor, use a opção `--ledir` para indicar o nome do caminho para o diretório onde o servidor está localizado.

  A partir do MySQL 5.7.15, essa opção só é aceita na linha de comando, não em arquivos de opções. Em plataformas que usam o systemd, o valor pode ser especificado no valor de `MYSQLD_OPTS`. Consulte Seção 2.5.10, “Gerenciamento do servidor MySQL com o systemd”.

- `--mysqld-version=sufixo`

  <table><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>7

  Esta opção é semelhante à opção `--mysqld`, mas você especifica apenas o sufixo para o nome do programa do servidor. O nome base é assumido como **mysqld**. Por exemplo, se você usar `--mysqld-version=debug`, **mysqld_safe** inicia o programa **mysqld-debug** no diretório `ledir`. Se o argumento para `--mysqld-version` estiver vazio, **mysqld_safe** usa **mysqld** no diretório `ledir`.

  A partir do MySQL 5.7.15, essa opção só é aceita na linha de comando, não em arquivos de opções. Em plataformas que usam o systemd, o valor pode ser especificado no valor de `MYSQLD_OPTS`. Consulte Seção 2.5.10, “Gerenciamento do servidor MySQL com o systemd”.

- `--nice=prioridade`

  <table><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>8

  Use o programa `nice` para definir a prioridade de agendamento do servidor para o valor fornecido.

- `--no-defaults`

  <table><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>9

  Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, o `--no-defaults` pode ser usado para impedir que sejam lidas. Isso deve ser a primeira opção na linha de comando se for usado.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opção”.

- `--open-files-limit=número`

  <table><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  O número de arquivos que o **mysqld** deve ser capaz de abrir. O valor da opção é passado para **ulimit -n**.

  Nota

  Você deve iniciar **mysqld_safe** como `root` para que isso funcione corretamente.

- `--pid-file=nome_do_arquivo`

  <table><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  O nome do caminho que **mysqld** deve usar para o arquivo de ID de processo.

  De MySQL 5.7.2 a 5.7.17, o **mysqld_safe** tem seu próprio arquivo de ID de processo, que é sempre chamado `mysqld_safe.pid` e localizado no diretório de dados do MySQL.

- `--plugin-dir=nome_do_diretório`

  <table><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  O nome do caminho do diretório do plugin.

- `--port=port_num`

  <table><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  O número de porta que o servidor deve usar ao ouvir conexões TCP/IP. O número de porta deve ser 1024 ou superior, a menos que o servidor seja iniciado pelo usuário do sistema operacional `root`.

- `--skip-kill-mysqld`

  <table><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  Não tente matar os processos de **mysqld** soltos no momento do arranque. Esta opção só funciona no Linux.

- `--socket=caminho`

  <table><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  O arquivo de socket Unix que o servidor deve usar ao ouvir conexões locais.

- `--syslog`, `--skip-syslog`

  <table><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  <table><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  `--syslog` faz com que as mensagens de erro sejam enviadas para o `syslog` em sistemas que suportam o programa **logger**. `--skip-syslog` suprime o uso do `syslog`; as mensagens são escritas em um arquivo de log de erro.

  Quando o `syslog` é usado para registro de erros, a facilidade/gravidade `daemon.err` é usada para todas as mensagens de log.

  O uso dessas opções para controlar o registro do **mysqld** está desatualizado a partir do MySQL 5.7.5. Use a variável de sistema do servidor `log_syslog` em vez disso. Para controlar a facilidade, use a variável de sistema do servidor `log_syslog_facility`. Veja Seção 5.4.2.3, “Registro de Erros no Log do Sistema”.

- `--syslog-tag=tag`

  <table><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  Para registrar mensagens no `syslog`, as mensagens de **mysqld_safe** e **mysqld** são escritas com identificadores de `mysqld_safe` e `mysqld`, respectivamente. Para especificar um sufixo para os identificadores, use `--syslog-tag=tag`, que modifica os identificadores para `mysqld_safe-tag` e `mysqld-tag`.

  A utilização desta opção para controlar o registro do **mysqld** está desaconselhada a partir do MySQL 5.7.5. Utilize em vez disso a variável de sistema `**log_syslog_tag** do servidor. Consulte Seção 5.4.2.3, “Registro de Erros no Log do Sistema”.

- `--timezone=timezone`

  <table><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  Defina a variável de ambiente `TZ` para o valor da opção fornecida. Consulte a documentação do seu sistema operacional para obter os formatos de especificação de fuso horário legal.

- `--user={nome_do_usuário|id_do_usuário}`

  <table><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--basedir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  Execute o servidor **mysqld** como o usuário com o nome *`user_name`* ou o ID de usuário numérico *`user_id`*. (“Usuário” neste contexto se refere a uma conta de login do sistema, não a um usuário MySQL listado nas tabelas de concessão.)

Se você executar **mysqld_safe** com a opção `--defaults-file` ou `--defaults-extra-file` para nomear um arquivo de opções, a opção deve ser a primeira fornecida na linha de comando ou o arquivo de opções não será usado. Por exemplo, este comando não usa o arquivo de opção nomeado:

```sh
mysql> mysqld_safe --port=port_num --defaults-file=file_name
```

Em vez disso, use o seguinte comando:

```sh
mysql> mysqld_safe --defaults-file=file_name --port=port_num
```

O script **mysqld_safe** é escrito de forma que ele possa normalmente iniciar um servidor que foi instalado a partir de uma distribuição de fonte ou binária do MySQL, embora esses tipos de distribuições geralmente instalem o servidor em locais ligeiramente diferentes. (Veja Seção 2.1.5, “Layouts de Instalação”.) O **mysqld_safe** espera que uma das seguintes condições seja verdadeira:

- O servidor e os bancos de dados podem ser encontrados em relação ao diretório de trabalho (o diretório a partir do qual o **mysqld_safe** é invocado). Para distribuições binárias, o **mysqld_safe** procura nos diretórios `bin` e `data` de seu diretório de trabalho. Para distribuições de código-fonte, ele procura nos diretórios `libexec` e `var`. Esta condição deve ser atendida se você executar o **mysqld_safe** a partir do diretório de instalação do MySQL (por exemplo, `/usr/local/mysql` para uma distribuição binária).

- Se o servidor e os bancos de dados não puderem ser encontrados em relação ao diretório de trabalho, o **mysqld_safe** tenta localizá-los por nomes de caminho absolutos. Os locais típicos são `/usr/local/libexec` e `/usr/local/var`. Os locais reais são determinados pelos valores configurados na distribuição no momento em que ela foi construída. Eles devem estar corretos se o MySQL estiver instalado no local especificado na hora da configuração.

Como o **mysqld_safe** tenta encontrar o servidor e os bancos de dados em relação ao seu próprio diretório de trabalho, você pode instalar uma distribuição binária do MySQL em qualquer lugar, desde que você execute o **mysqld_safe** a partir do diretório de instalação do MySQL:

```sh
cd mysql_installation_directory
bin/mysqld_safe &
```

Se o **mysqld_safe** falhar, mesmo quando invocado a partir do diretório de instalação do MySQL, especifique as opções `--ledir` e `--datadir` para indicar os diretórios nos quais o servidor e os bancos de dados estão localizados no seu sistema.

**mysqld_safe** tenta usar as ferramentas de sistema **sleep** e **date** para determinar quantas vezes por segundo tentou iniciar. Se essas ferramentas estiverem presentes e as tentativas de início por segundo forem maiores que 5, **mysqld_safe** aguarda 1 segundo completo antes de iniciar novamente. Isso visa evitar o uso excessivo da CPU em caso de falhas repetidas. (Bug #11761530, Bug #54035)

Quando você usa **mysqld_safe** para iniciar **mysqld**, **mysqld_safe** garante que as mensagens de erro (e de aviso) de si mesma e do **mysqld** sejam enviadas para o mesmo destino.

Existem várias opções do **mysqld_safe** para controlar o destino dessas mensagens:

- `--log-error=nome_do_arquivo`: Escreva mensagens de erro para o arquivo de erro nomeado.

- `--syslog`: Escreva mensagens de erro no `syslog` em sistemas que suportam o programa **logger**.

- `--skip-syslog`: Não escreva mensagens de erro no `syslog`. As mensagens são escritas no arquivo de log de erro padrão (`host_name.err` no diretório de dados) ou em um arquivo nomeado se a opção `--log-error` for fornecida.

Se nenhuma dessas opções for fornecida, o padrão é `--skip-syslog`.

Quando o **mysqld_safe** escreve uma mensagem, os avisos são enviados para o destino de registro (`syslog` ou o arquivo de log de erro) e `stdout`. Os erros são enviados para o destino de registro e `stderr`.

::: info Nota
O controle do registro do **mysqld** a partir do **mysqld_safe** está desatualizado a partir do MySQL 5.7.5. Use o suporte nativo do servidor ao `syslog` em vez disso. Para mais informações, consulte Seção 5.4.2.3, “Registro de Erros no Log do Sistema”.
:::
