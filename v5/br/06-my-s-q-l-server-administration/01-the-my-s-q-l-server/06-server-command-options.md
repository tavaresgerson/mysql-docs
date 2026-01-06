### 5.1.6 Opções de comando do servidor

Ao iniciar o servidor **mysqld**, você pode especificar opções de programa usando qualquer um dos métodos descritos na Seção 4.2.2, “Especificação de Opções de Programa”. Os métodos mais comuns são fornecer opções em um arquivo de opções ou na linha de comando. No entanto, na maioria dos casos, é desejável garantir que o servidor use as mesmas opções cada vez que for executado. A melhor maneira de garantir isso é listá-las em um arquivo de opções. Veja Seção 4.2.2.2, “Uso de Arquivos de Opções”. Essa seção também descreve o formato e a sintaxe do arquivo de opções.

**mysqld** lê opções dos grupos `[mysqld]` e `[server]`. **mysqld\_safe** lê opções dos grupos `[mysqld]`, `[server]`, `[mysqld_safe]` e `[safe_mysqld]`. **mysql.server** lê opções dos grupos `[mysqld]` e `[mysql.server]`.

Um servidor MySQL embutido geralmente lê as opções dos grupos `[server]`, `[embedded]` e `[xxxxx_SERVER]`, onde *`xxxxx`* é o nome do aplicativo no qual o servidor está embutido.

**mysqld** aceita muitas opções de comando. Para um breve resumo, execute este comando:

```sql
mysqld --help
```

Para ver a lista completa, use este comando:

```sql
mysqld --verbose --help
```

Alguns dos itens da lista são, na verdade, variáveis do sistema que podem ser definidas na inicialização do servidor. Essas variáveis podem ser exibidas em tempo de execução usando a instrução `SHOW VARIABLES`. Alguns itens exibidos pelo comando anterior **mysqld** não aparecem na saída de `SHOW VARIABLES`; isso ocorre porque são opções e não variáveis do sistema.

A lista a seguir mostra algumas das opções de servidor mais comuns. Outras opções são descritas em outras seções:

- Opções que afetam a segurança: Consulte Seção 6.1.4, “Opções e variáveis de mysqld relacionadas à segurança”.

- Opções relacionadas ao SSL: Consulte Opções de comando para conexões criptografadas.

- Opções de controle do log binário: Consulte Seção 5.4.4, “O Log Binário”.

- Opções relacionadas à replicação: Consulte Seção 16.1.6, “Opções e variáveis de replicação e registro binário”.

- Opções para carregar plugins, como motores de armazenamento plugáveis: Consulte Seção 5.5.1, “Instalando e Desinstalando Plugins”.

- Opções específicas para motores de armazenamento particulares: Consulte Seção 14.15, “Opções de inicialização do InnoDB e variáveis de sistema” e Seção 15.2.1, “Opções de inicialização do MyISAM”.

Algumas opções controlam o tamanho dos buffers ou caches. Para um buffer específico, o servidor pode precisar alocar estruturas de dados internas. Essas estruturas são tipicamente alocadas a partir da memória total alocada ao buffer, e a quantidade de espaço necessária pode depender da plataforma. Isso significa que, quando você atribui um valor a uma opção que controla o tamanho de um buffer, a quantidade de espaço realmente disponível pode diferir do valor atribuído. Em alguns casos, a quantidade pode ser menor que o valor atribuído. Também é possível que o servidor ajuste um valor para cima. Por exemplo, se você atribuir um valor de 0 a uma opção para a qual o valor mínimo é 1024, o servidor define o valor para 1024.

Os valores para tamanhos de tampão, comprimentos e tamanhos de pilha são fornecidos em bytes, a menos que especificado de outra forma.

Algumas opções aceitam valores de nome de arquivo. A menos que especificado de outra forma, a localização padrão do arquivo é o diretório de dados, se o valor for um nome de caminho relativo. Para especificar a localização explicitamente, use um nome de caminho absoluto. Suponha que o diretório de dados seja `/var/mysql/data`. Se uma opção com valor de arquivo for fornecida como um nome de caminho relativo, ela estará localizada em `/var/mysql/data`. Se o valor for um nome de caminho absoluto, sua localização será conforme o nome do caminho fornecido.

Você também pode definir os valores das variáveis do sistema do servidor no momento do início do servidor usando nomes de variáveis como opções. Para atribuir um valor a uma variável do sistema do servidor, use uma opção do formato `--var_name=value`. Por exemplo, `--sort_buffer_size=384M` define a variável `sort_buffer_size` para um valor de 384MB.

Quando você atribui um valor a uma variável, o MySQL pode corrigir automaticamente o valor para permanecer dentro de um determinado intervalo ou ajustar o valor para o valor mais próximo permitido, se apenas certos valores forem permitidos.

Para restringir o valor máximo ao qual uma variável de sistema pode ser definida em tempo de execução com a instrução `SET`, especifique esse valor máximo usando uma opção da forma `--maximum-var_name=value` no início do servidor.

Você pode alterar os valores da maioria das variáveis do sistema em tempo de execução com a instrução `SET`. Veja Seção 13.7.4.1, “Sintaxe SET para Atribuição de Variáveis”.

Seção 5.1.7, “Variáveis do Sistema do Servidor”, fornece uma descrição completa de todas as variáveis e informações adicionais para configurá-las durante o início e o funcionamento do servidor. Para obter informações sobre a alteração de variáveis do sistema, consulte Seção 5.1.1, “Configurando o Servidor”.

- `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--help</code>]]</td> </tr></tbody></table>

  Exiba uma breve mensagem de ajuda e saia. Use as opções `--verbose` e `--help` para ver a mensagem completa.

- `--allow-suspicious-udfs`

  <table frame="box" rules="all" summary="Propriedades para permitir-udfs-suspeito"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--allow-suspicious-udfs[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">OFF</code>]]</td> </tr></tbody></table>

  Esta opção controla se funções carregáveis que têm apenas um símbolo `xxx` para a função principal podem ser carregadas. Por padrão, a opção está desativada e apenas funções carregáveis que têm pelo menos um símbolo auxiliar podem ser carregadas; isso previne tentativas de carregar funções de arquivos de objeto compartilhado que não contenham funções legítimas. Consulte Precauções de segurança de funções carregáveis.

- `--ansi`

  <table frame="box" rules="all" summary="Propriedades para ansi"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ansi</code>]]</td> </tr></tbody></table>

  Use a sintaxe SQL padrão (ANSI) em vez da sintaxe MySQL. Para um controle mais preciso sobre o modo SQL do servidor, use a opção `--sql-mode` em vez disso. Veja Seção 1.6, “Conformidade com Padrões MySQL” e Seção 5.1.10, “Modos SQL do Servidor”.

- `--basedir=dir_name`, `-b dir_name`

  <table frame="box" rules="all" summary="Propriedades para basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--basedir=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal"><a class="link" href="server-system-variables.html#sysvar_basedir">basedir</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">configuration-dependent default</code>]]</td> </tr></tbody></table>

  O caminho para o diretório de instalação do MySQL. Esta opção define a variável de sistema `basedir`.

- `--bootstrap`

  <table frame="box" rules="all" summary="Propriedades para bootstrap"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--bootstrap</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr></tbody></table>

  Essa opção é usada pelo programa **mysql\_install\_db** para criar as tabelas de privilégios do MySQL sem precisar iniciar um servidor MySQL completo.

  Nota

  **mysql\_install\_db** está desatualizado porque sua funcionalidade foi integrada ao **mysqld**, o servidor MySQL. Consequentemente, a opção de servidor `--bootstrap` que **mysql\_install\_db** passa para **mysqld** também está desatualizada. Para inicializar uma instalação do MySQL, inicie o **mysqld** com a opção `--initialize` ou `--initialize-insecure`. Para obter mais informações, consulte Seção 2.9.1, “Inicializando o diretório de dados”. Espere que **mysql\_install\_db** e a opção de servidor `--bootstrap` sejam removidos em uma futura versão do MySQL.

  `--bootstrap` é mutuamente exclusiva de `--daemonize`, `--initialize` e `--initialize-insecure`.

  Os identificadores de transações globais (GTIDs) não são desativados quando o `--bootstrap` é usado. O `--bootstrap` foi usado (Bug #20980271). Veja Seção 16.1.3, “Replicação com Identificadores de Transações Globais”.

  Quando o servidor opera no modo bootstap, algumas funcionalidades não estão disponíveis, o que limita as declarações permitidas em qualquer arquivo nomeado pela variável de sistema `init_file`. Para obter mais informações, consulte a descrição dessa variável. Além disso, a variável de sistema `disabled_storage_engines` não tem efeito.

- `--character-set-client-handshake`

  <table frame="box" rules="all" summary="Propriedades para handshake de cliente de conjunto de caracteres"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-set-client-handshake[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">ON</code>]]</td> </tr></tbody></table>

  Não ignore as informações sobre o conjunto de caracteres enviadas pelo cliente. Para ignorar as informações do cliente e usar o conjunto de caracteres padrão do servidor, use `--skip-character-set-client-handshake`; isso faz com que o MySQL se comporte como o MySQL 4.0.

- `--chroot=dir_name`, `-r dir_name`

  <table frame="box" rules="all" summary="Propriedades para chroot"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--chroot=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  Coloque o servidor **mysqld** em um ambiente fechado durante a inicialização usando a chamada de sistema `chroot()`. Esta é uma medida de segurança recomendada. O uso desta opção limita um pouco a opção `LOAD DATA` e `SELECT ... INTO OUTFILE`.

- `--console`

  <table frame="box" rules="all" summary="Propriedades para console"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--console</code>]]</td> </tr><tr><th>Específico da plataforma</th> <td>Windows</td> </tr></tbody></table>

  (Apenas para Windows.) Escreva o log de erro em `stderr` e `stdout` (o console). O **mysqld** não fecha a janela do console se essa opção for usada.

  `--console` tem precedência sobre `--log-error` se ambas forem fornecidas. (No MySQL 5.5 e 5.6, isso é invertido: `--log-error` tem precedência sobre `--console` se ambas forem fornecidas.)

- `--core-file`

  <table frame="box" rules="all" summary="Propriedades para arquivo de núcleo"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--core-file</code>]]</td> </tr></tbody></table>

  Quando esta opção for usada, escreva um arquivo de núcleo se o **mysqld** falhar; não são necessários (ou aceitos) argumentos. O nome e a localização do arquivo de núcleo dependem do sistema. No Linux, um arquivo de núcleo chamado `core.pid` é escrito no diretório de trabalho atual do processo, que, para o **mysqld**, é o diretório de dados. *`pid`* representa o ID do processo do processo do servidor. No macOS, um arquivo de núcleo chamado `core.pid` é escrito no diretório `/cores`. No Solaris, use o comando **coreadm** para especificar onde escrever o arquivo de núcleo e como nomeá-lo.

  Para alguns sistemas, para obter um arquivo de núcleo, você também deve especificar a opção `--core-file-size` para **mysqld\_safe**. Veja Seção 4.3.2, “mysqld\_safe — Script de inicialização do servidor MySQL”. Em alguns sistemas, como o Solaris, você não obtém um arquivo de núcleo se estiver usando também a opção `--user`. Pode haver restrições ou limitações adicionais. Por exemplo, pode ser necessário executar **ulimit -c unlimited** antes de iniciar o servidor. Consulte a documentação do seu sistema.

- `--daemonize`

  <table frame="box" rules="all" summary="Propriedades para daemonizar"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--daemonize[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">OFF</code>]]</td> </tr></tbody></table>

  Essa opção faz com que o servidor seja executado como um daemon tradicional, permitindo que ele trabalhe com sistemas operacionais que usam o systemd para controle de processos. Para mais informações, consulte Seção 2.5.10, “Gerenciamento do servidor MySQL com o systemd”.

  `--daemonize` é mutuamente exclusiva de `--bootstrap`, `--initialize` e `--initialize-insecure`.

- `--datadir=dir_name`, `-h dir_name`

  <table frame="box" rules="all" summary="Propriedades para permitir-udfs-suspeito"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--allow-suspicious-udfs[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">OFF</code>]]</td> </tr></tbody></table>0

  O caminho para o diretório de dados do servidor MySQL. Esta opção define a variável de sistema `datadir`. Veja a descrição dessa variável.

- `--debug[=opções_de_depuração]`, `-# [opções_de_depuração]`

  <table frame="box" rules="all" summary="Propriedades para permitir-udfs-suspeito"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--allow-suspicious-udfs[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">OFF</code>]]</td> </tr></tbody></table>1

  Se o MySQL estiver configurado com a opção **CMake** `-DWITH_DEBUG=1`, você pode usar essa opção para obter um arquivo de registro do que o **mysqld** está fazendo. Uma string típica de *`debug_options`* é `d:t:o,nome_do_arquivo`. O padrão é `d:t:i:o,/tmp/mysqld.trace` no Unix e `d:t:i:O,\mysqld.trace` no Windows.

  Usar `-DWITH_DEBUG=1` para configurar o MySQL com suporte de depuração permite que você use a opção `--debug="d,parser_debug"` ao iniciar o servidor. Isso faz com que o analisador Bison, que é usado para processar instruções SQL, armazene uma traça do analisador na saída de erro padrão do servidor. Normalmente, essa saída é escrita no log de erro.

  Esta opção pode ser dada várias vezes. Os valores que começam com `+` ou `-` são adicionados ou subtraídos do valor anterior. Por exemplo, `--debug=T` `--debug=+P` define o valor para `P:T`.

  Para mais informações, consulte Seção 5.8.3, “O pacote DBUG”.

- `--debug-sync-timeout[=N]`

  <table frame="box" rules="all" summary="Propriedades para permitir-udfs-suspeito"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--allow-suspicious-udfs[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">OFF</code>]]</td> </tr></tbody></table>2

  Controla se a funcionalidade Debug Sync para testes e depuração está habilitada. O uso do Debug Sync requer que o MySQL seja configurado com a opção **CMake** `-DWITH_DEBUG=ON` (consulte Seção 2.8.7, “Opções de Configuração de Fonte do MySQL”). Se o Debug Sync não for compilado, essa opção não estará disponível. O valor da opção é um tempo de espera em segundos. O valor padrão é 0, o que desabilita o Debug Sync. Para ativá-lo, especifique um valor maior que 0; esse valor também se torna o tempo de espera padrão para os pontos de sincronização individuais. Se a opção for fornecida sem um valor, o tempo de espera é definido para 300 segundos.

  Para uma descrição da funcionalidade Debug Sync e de como usar os pontos de sincronização, consulte MySQL Internals: Test Synchronization.

- `--default-time-zone=timezone`

  <table frame="box" rules="all" summary="Propriedades para permitir-udfs-suspeito"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--allow-suspicious-udfs[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">OFF</code>]]</td> </tr></tbody></table>3

  Defina o fuso horário do servidor padrão. Esta opção define a variável de sistema global `time_zone`. Se esta opção não for fornecida, o fuso horário padrão será o mesmo do fuso horário do sistema (dado pelo valor da variável de sistema `system_time_zone`.

  A variável `system_time_zone` difere da variável `time_zone`. Embora possam ter o mesmo valor, a última variável é usada para inicializar o fuso horário para cada cliente que se conecta. Veja Seção 5.1.13, “Suporte ao Fuso Horário do MySQL Server”.

- `--defaults-extra-file=nome_do_arquivo`

  Leia este arquivo de opção após o arquivo de opção global, mas (no Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou estiver inacessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual. Isso deve ser a primeira opção na linha de comando, se for usada.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opção”.

- `--defaults-file=nome_do_arquivo`

  Leia apenas o arquivo de opção fornecido. Se o arquivo não existir ou estiver inacessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Nota

  Esta deve ser a primeira opção na linha de comando, se for usada, exceto que, se o servidor for iniciado com as opções `--defaults-file` e `--install` (ou `--install-manual`), a opção `--install` (ou `--install-manual`) deve ser a primeira.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opção”.

- `--defaults-group-suffix=str`

  Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, **mysqld** normalmente lê o grupo `[mysqld]`. Se esta opção for dada como `--defaults-group-suffix=_other`, **mysqld** também lê o grupo `[mysqld_other]`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opção”.

- `--des-key-file=nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para permitir-udfs-suspeito"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--allow-suspicious-udfs[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">OFF</code>]]</td> </tr></tbody></table>4

  Leia as chaves DES padrão deste arquivo. Essas chaves são usadas pelas funções [`DES_ENCRYPT()`](https://docs.php.net/en/manual/encryption-functions.html#function_des-encrypt) e [`DES_DECRYPT()`](https://docs.php.net/en/manual/encryption-functions.html#function_des-decrypt).

  Nota

  As funções [`DES_ENCRYPT()`](https://pt.wikipedia.org/wiki/DES#Fun%C3%A7%C3%B3es_de_criptografia) e [`DES_DECRYPT()`](https://pt.wikipedia.org/wiki/DES#Fun%C3%A7%C3%B3es_de_criptografia) estão desatualizadas no MySQL 5.7, são removidas no MySQL 8.0 e não devem mais ser usadas. Consequentemente, [`--des-key-file`](https://pt.wikipedia.org/wiki/MySQL#Op%C3%A7%C3%B5es_do_servidor) também está desatualizada e é removida no MySQL 8.0.

- `--disable-partition-engine-check`

  <table frame="box" rules="all" summary="Propriedades para permitir-udfs-suspeito"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--allow-suspicious-udfs[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">OFF</code>]]</td> </tr></tbody></table>5

  Se desabilitar a verificação de inicialização para tabelas com particionamento não nativo.

  A partir do MySQL 5.7.17, o manipulador de particionamento genérico no servidor MySQL é desatualizado e será removido no MySQL 8.0, quando o mecanismo de armazenamento usado para uma determinada tabela for esperado fornecer seu próprio manipulador de particionamento (“nativo”). Atualmente, apenas os mecanismos de armazenamento `InnoDB` e `NDB` fazem isso.

  O uso de tabelas com particionamento não nativo resulta em um aviso `ER_WARN_DEPRECATED_SYNTAX`. No MySQL 5.7.17 a 5.7.20, o servidor realiza automaticamente uma verificação no início para identificar tabelas que usam particionamento não nativo; para quaisquer que sejam encontradas, o servidor escreve uma mensagem em seu log de erro. Para desabilitar essa verificação, use a opção `--disable-partition-engine-check`. No MySQL 5.7.21 e versões posteriores, essa verificação *não* é realizada; nessas versões, você deve iniciar o servidor com `--disable-partition-engine-check=false`, se desejar que o servidor verifique tabelas que usam o manipulador de particionamento genérico (Bug #85830, Bug #25846957).

  O uso de tabelas com particionamento não nativo resulta em um aviso `ER_WARN_DEPRECATED_SYNTAX`. Além disso, o servidor realiza uma verificação ao iniciar para identificar tabelas que usam particionamento não nativo; para qualquer uma encontrada, o servidor escreve uma mensagem em seu log de erro. Para desabilitar essa verificação, use a opção `--disable-partition-engine-check`.

  Para se preparar para a migração para o MySQL 8.0, qualquer tabela com particionamento não nativo deve ser alterada para usar um mecanismo que ofereça particionamento nativo ou ser desparticionada. Por exemplo, para alterar uma tabela para `InnoDB`, execute a seguinte instrução:

  ```sql
  ALTER TABLE table_name ENGINE = INNODB;
  ```

- `--early-plugin-load=plugin_list`

  <table frame="box" rules="all" summary="Propriedades para permitir-udfs-suspeito"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--allow-suspicious-udfs[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">OFF</code>]]</td> </tr></tbody></table>6

  Essa opção indica ao servidor quais plugins devem ser carregados antes de carregar os plugins embutidos obrigatórios e antes da inicialização do mecanismo de armazenamento. O carregamento antecipado é suportado apenas para plugins compilados com `PLUGIN_OPT_ALLOW_EARLY`. Se forem fornecidas várias opções de `--early-plugin-load` (server-options.html#option\_mysqld\_early-plugin-load), apenas a última opção será aplicada.

  O valor da opção é uma lista separada por ponto e vírgula de valores de *`plugin_library`* e *`name`*=`*`plugin\_library\*`. Cada *`plugin\_library`* é o nome de um arquivo de biblioteca que contém o código do plugin, e cada *`name`* é o nome de um plugin a ser carregado. Se uma biblioteca de plugin tiver o nome sem nenhum nome de plugin anterior, o servidor carrega todos os plugins da biblioteca. Com um nome de plugin anterior, o servidor carrega apenas o plugin nomeado da biblioteca. O servidor procura por arquivos de biblioteca de plugin no diretório nomeado pela variável de sistema [`plugin\_dir\`]\(server-system-variables.html#sysvar\_plugin\_dir).

  Por exemplo, se os plugins chamados `myplug1` e `myplug2` estiverem contidos nos arquivos de biblioteca de plugins `myplug1.so` e `myplug2.so`, use esta opção para realizar um carregamento antecipado do plugin:

  ```sql
  mysqld --early-plugin-load="myplug1=myplug1.so;myplug2=myplug2.so"
  ```

  Aspas cercam o valor do argumento porque, caso contrário, alguns interpretadores de comandos interpretam o ponto e vírgula (`;`) como um caractere especial. (Por exemplo, as caixas de texto do Unix o tratam como um finalizador de comando.)

  Cada plugin nomeado é carregado precocemente apenas para uma única invocação de **mysqld**. Após um reinício, o plugin não é carregado precocemente, a menos que a opção `--early-plugin-load` seja usada novamente.

  Se o servidor for iniciado usando `--initialize` ou `--initialize-insecure`, os plugins especificados por `--early-plugin-load` não são carregados.

  Se o servidor for executado com `--help`, os plugins especificados por `--early-plugin-load` são carregados, mas não inicializados. Esse comportamento garante que as opções do plugin sejam exibidas na mensagem de ajuda.

  A criptografia do espaço de tabelas `InnoDB` depende do Keyring do MySQL para a gestão de chaves de criptografia, e o plugin keyring deve ser carregado antes da inicialização do mecanismo de armazenamento para facilitar a recuperação do `InnoDB` para tabelas criptografadas. Por exemplo, os administradores que desejam que o plugin `keyring_file` seja carregado no início devem usar `--early-plugin-load` com o valor da opção apropriado (como `keyring_file.so` em sistemas Unix e similares ou `keyring_file.dll` em sistemas Windows).

  Importante

  No MySQL 5.7.11, o valor padrão de `--early-plugin-load` é o nome do arquivo da biblioteca do plugin `keyring_file`, fazendo com que o plugin seja carregado por padrão. No MySQL 5.7.12 e versões superiores, o valor padrão de `--early-plugin-load` é vazio; para carregar o plugin `keyring_file`, você deve especificar explicitamente a opção com um nome de valor que nomeie o arquivo da biblioteca do plugin `keyring_file`.

  Essa alteração no valor padrão de `--early-plugin-load` introduz uma incompatibilidade para a criptografia do espaço de tabelas `InnoDB` em atualizações de 5.7.11 para 5.7.12 ou versões superiores. Os administradores que criptografaram os espaços de tabelas `InnoDB` devem tomar medidas explícitas para garantir o carregamento contínuo do plugin keyring: Inicie o servidor com uma opção `--early-plugin-load` que nomeie o arquivo da biblioteca do plugin. Para obter informações adicionais, consulte Seção 6.4.4.1, “Instalação do Plugin keyring”.

  Para obter informações sobre a criptografia do espaço de tabelas `InnoDB`, consulte Seção 14.14, “Criptografia de Dados em Repouso do InnoDB”. Para informações gerais sobre o carregamento de plugins, consulte Seção 5.5.1, “Instalando e Desinstalando Plugins”.

- `--exit-info[=flags]`, `-T [flags]`

  <table frame="box" rules="all" summary="Propriedades para permitir-udfs-suspeito"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--allow-suspicious-udfs[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">OFF</code>]]</td> </tr></tbody></table>7

  Este é um bitmask de diferentes flags que você pode usar para depurar o servidor **mysqld**. Não use esta opção a menos que você saiba *exatamente* o que ela faz!

- `--external-locking`

  <table frame="box" rules="all" summary="Propriedades para permitir-udfs-suspeito"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--allow-suspicious-udfs[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">OFF</code>]]</td> </tr></tbody></table>8

  Ative o bloqueio externo (bloqueio do sistema), que está desativado por padrão. Se você usar essa opção em um sistema em que o `lockd` não funciona perfeitamente (como o Linux), é fácil que o **mysqld** fique em um impasse.

  Para desabilitar o bloqueio externo explicitamente, use `--skip-external-locking`.

  O bloqueio externo afeta apenas o acesso à tabela \`MyISAM. Para obter mais informações, incluindo as condições em que ele pode e não pode ser usado, consulte Seção 8.11.5, “Bloqueio Externo”.

- `--flush`

  <table frame="box" rules="all" summary="Propriedades para permitir-udfs-suspeito"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--allow-suspicious-udfs[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">OFF</code>]]</td> </tr></tbody></table>9

  Limpe (sincronize) todas as alterações no disco após cada instrução SQL. Normalmente, o MySQL realiza uma gravação de todas as alterações no disco apenas após cada instrução SQL e permite que o sistema operacional gere a sincronização com o disco. Veja Seção B.3.3.3, “O que fazer se o MySQL continuar a falhar”.

  Nota

  Se `--flush` for especificado, o valor de `flush_time` não importa e alterações no `flush_time` não afetam o comportamento do flush.

- `--gdb`

  <table frame="box" rules="all" summary="Propriedades para ansi"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ansi</code>]]</td> </tr></tbody></table>0

  Instale um manipulador de interrupção para `SIGINT` (necessário para parar o **mysqld** com `^C` para definir pontos de interrupção) e desative o rastreamento de pilha e o gerenciamento de arquivos de núcleo. Veja Seção 5.8.1.4, “Depuração do mysqld no gdb”.

- `--ignore-db-dir=nome_do_diretório`

  <table frame="box" rules="all" summary="Propriedades para ansi"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ansi</code>]]</td> </tr></tbody></table>1

  Essa opção indica ao servidor que ignore o nome do diretório fornecido para fins da instrução `SHOW DATABASES` ou das tabelas do `INFORMATION_SCHEMA`. Por exemplo, se uma configuração do MySQL localizar o diretório de dados na raiz de um sistema de arquivos no Unix, o sistema pode criar um diretório `lost+found` lá que o servidor deve ignorar. Iniciar o servidor com `--ignore-db-dir=lost+found` faz com que esse nome não seja listado como uma base de dados.

  Para especificar mais de um nome, use essa opção várias vezes, uma vez para cada nome. Especificar a opção com um valor vazio (ou seja, como `--ignore-db-dir=`) reescreve a lista de diretórios para a lista vazia.

  As instâncias desta opção fornecidas ao iniciar o servidor são usadas para definir a variável de sistema `ignore_db_dirs`.

  Esta opção foi descontinuada no MySQL 5.7. Com a introdução do dicionário de dados no MySQL 8.0, ela se tornou supérflua e foi removida nessa versão.

- `--initialize`

  <table frame="box" rules="all" summary="Propriedades para ansi"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ansi</code>]]</td> </tr></tbody></table>2

  Esta opção é usada para inicializar uma instalação do MySQL criando o diretório de dados e preenchendo as tabelas no banco de dados do sistema `mysql`. Para mais informações, consulte Seção 2.9.1, “Inicializando o Diretório de Dados”.

  Essa opção limita os efeitos de, ou não é compatível com, várias outras opções de inicialização para o servidor MySQL. Alguns dos problemas mais comuns desse tipo são mencionados aqui:

  - Recomendamos fortemente, ao inicializar o diretório de dados com `--initialize`, que você não especifique outras opções além de `--datadir`, outras opções usadas para definir localizações de diretórios, como `--basedir`, e possivelmente `--user`, se necessário. As opções para o servidor MySQL em execução podem ser especificadas ao iniciá-lo após a inicialização ter sido concluída e o **mysqld** ter sido desligado. Isso também se aplica ao uso de `--initialize-insecure` em vez de `--initialize`.

  - Quando o servidor é iniciado com `--initialize`, algumas funcionalidades ficam indisponíveis, o que limita as instruções permitidas em qualquer arquivo nomeado pela variável de sistema `init_file`. Para obter mais informações, consulte a descrição dessa variável. Além disso, a variável de sistema `disabled_storage_engines` não tem efeito.

  - A opção `--ndbcluster` é ignorada quando usada juntamente com `--initialize`.

  - `--initialize` é mutuamente exclusiva com `--bootstrap` e `--daemonize`.

  Os itens da lista anterior também se aplicam ao inicializar o servidor usando a opção `--initialize-insecure`.

- `--initialize-insecure`

  <table frame="box" rules="all" summary="Propriedades para ansi"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ansi</code>]]</td> </tr></tbody></table>3

  Esta opção é usada para inicializar uma instalação do MySQL criando o diretório de dados e preenchendo as tabelas no banco de dados do sistema `mysql`. Esta opção implica em `--initialize`, e as mesmas restrições e limitações se aplicam; para mais informações, consulte a descrição dessa opção e Seção 2.9.1, “Inicializando o Diretório de Dados”.

  Aviso

  Essa opção cria um usuário `root` do MySQL com uma senha vazia, o que é inseguro. Por esse motivo, não use essa opção em produção sem definir essa senha manualmente. Consulte Atribuição da senha do root após a inicialização para obter informações sobre como fazer isso.

- `--innodb-xxx`

  Defina uma opção para o mecanismo de armazenamento `InnoDB`. As opções do `InnoDB` estão listadas em Seção 14.15, “Opções de inicialização do InnoDB e variáveis de sistema”.

- `--install [nome_do_serviço]`

  <table frame="box" rules="all" summary="Propriedades para ansi"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ansi</code>]]</td> </tr></tbody></table>4

  (Apenas para Windows) Instale o servidor como um serviço do Windows que seja iniciado automaticamente durante o início do Windows. O nome do serviço padrão é `MySQL` se não for fornecido o valor *`service_name`*. Para mais informações, consulte Seção 2.3.4.8, “Iniciar o MySQL como um serviço do Windows”.

  Nota

  Se o servidor for iniciado com as opções `--defaults-file` e `--install`, a opção `--install` deve ser a primeira.

- `--install-manual [nome_do_serviço]`

  <table frame="box" rules="all" summary="Propriedades para ansi"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ansi</code>]]</td> </tr></tbody></table>5

  (Apenas para Windows) Instale o servidor como um serviço do Windows que deve ser iniciado manualmente. Ele não é iniciado automaticamente durante o início do Windows. O nome do serviço padrão é `MySQL` se não for fornecido o valor *`service_name`*. Para mais informações, consulte Seção 2.3.4.8, “Iniciar o MySQL como um Serviço do Windows”.

  Nota

  Se o servidor for iniciado com as opções `--defaults-file` e `--install-manual`, a opção `--install-manual` deve ser a primeira.

- `--language=nome_do_idioma, -L nome_do_idioma`

  <table frame="box" rules="all" summary="Propriedades para ansi"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ansi</code>]]</td> </tr></tbody></table>6

  A linguagem a ser usada para mensagens de erro. *`lang_name`* pode ser fornecido como o nome da linguagem ou como o nome completo do caminho para o diretório onde os arquivos de linguagem estão instalados. Veja Seção 10.12, “Definindo a Linguagem da Mensagem de Erro”.

  `--lc-messages-dir` (server-options.html#option\_mysqld\_lc-messages) e `--lc-messages` (server-options.html#option\_mysqld\_lc-messages) devem ser usados em vez de `--language` (server-options.html#option\_mysqld\_language), que está desatualizado (e tratado como sinônimo de `--lc-messages-dir` (server-options.html#option\_mysqld\_lc-messages)). Você deve esperar que a opção `--language` (server-options.html#option\_mysqld\_language) seja removida em uma futura versão do MySQL.

- `--large-pages`

  <table frame="box" rules="all" summary="Propriedades para ansi"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ansi</code>]]</td> </tr></tbody></table>7

  Algumas arquiteturas de hardware/sistema operacional suportam páginas de memória maiores que o padrão (geralmente 4 KB). A implementação real deste suporte depende do hardware e do sistema operacional subjacentes. Aplicações que realizam muitos acessos à memória podem obter melhorias de desempenho ao usar páginas grandes devido à redução de erros no Buffer de Busca de Tradução (TLB).

  O MySQL suporta a implementação do Linux do suporte a páginas grandes (que é chamado de HugeTLB no Linux). Veja Seção 8.12.4.3, “Habilitar Suporte a Páginas Grandes”. Para suporte a páginas grandes no Solaris, consulte a descrição da opção `--super-large-pages` (server-options.html#option\_mysqld\_super-large-pages).

  `--large-pages` está desativado por padrão.

- `--lc-messages=nome_do_idioma`

  <table frame="box" rules="all" summary="Propriedades para ansi"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ansi</code>]]</td> </tr></tbody></table>8

  O local a ser usado para mensagens de erro. O padrão é `en_US`. O servidor converte o argumento em um nome de idioma e o combina com o valor de `--lc-messages-dir` para produzir a localização do arquivo de mensagem de erro. Veja Seção 10.12, “Definindo o Idioma da Mensagem de Erro”.

- `--lc-messages-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para ansi"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ansi</code>]]</td> </tr></tbody></table>9

  O diretório onde as mensagens de erro estão localizadas. O servidor usa o valor juntamente com o valor de `--lc-messages` para determinar a localização do arquivo de mensagem de erro. Veja Seção 10.12, “Definindo o Idioma da Mensagem de Erro”.

- `--local-service`

  <table frame="box" rules="all" summary="Propriedades para basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--basedir=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal"><a class="link" href="server-system-variables.html#sysvar_basedir">basedir</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">configuration-dependent default</code>]]</td> </tr></tbody></table>0

  (Apenas para Windows) A opção `--local-service` após o nome do serviço faz com que o servidor seja executado usando a conta `LocalService` do Windows, que tem privilégios de sistema limitados. Se `--defaults-file` e `--local-service` forem fornecidos após o nome do serviço, eles podem ser usados em qualquer ordem. Veja Seção 2.3.4.8, “Iniciando o MySQL como um Serviço do Windows”.

- `--log-error[=nome_do_arquivo]`

  <table frame="box" rules="all" summary="Propriedades para basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--basedir=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal"><a class="link" href="server-system-variables.html#sysvar_basedir">basedir</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">configuration-dependent default</code>]]</td> </tr></tbody></table>1

  Escreva o log de erros e as mensagens de inicialização neste arquivo. Consulte Seção 5.4.2, “O Log de Erros”.

  Se a opção não especificar nenhum arquivo, o nome do arquivo de log de erro em sistemas Unix e Unix-like é `host_name.err` no diretório de dados. O nome do arquivo no Windows é o mesmo, a menos que a opção `--pid-file` seja especificada. Nesse caso, o nome do arquivo é o nome de base do arquivo de PID com um sufixo de `.err` no diretório de dados.

  Se a opção nomear um arquivo, o arquivo de log de erro terá esse nome (com o sufixo `.err` adicionado se o nome não tiver sufixo), localizado sob o diretório de dados, a menos que um nome de caminho absoluto seja fornecido para especificar uma localização diferente.

  No Windows, `--console` tem precedência sobre `--log-error` se ambas forem fornecidas. Nesse caso, o servidor escreve o log de erro na consola em vez de em um arquivo. (No MySQL 5.5 e 5.6, isso é invertido: `--log-error` tem precedência sobre `--console` se ambas forem fornecidas.)

- `--log-isam[=nome_do_arquivo]`

  <table frame="box" rules="all" summary="Propriedades para basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--basedir=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal"><a class="link" href="server-system-variables.html#sysvar_basedir">basedir</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">configuration-dependent default</code>]]</td> </tr></tbody></table>2

  Registre todas as alterações do `MyISAM` neste arquivo (usado apenas durante a depuração do `MyISAM`).

- `--log-raw`

  <table frame="box" rules="all" summary="Propriedades para basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--basedir=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal"><a class="link" href="server-system-variables.html#sysvar_basedir">basedir</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">configuration-dependent default</code>]]</td> </tr></tbody></table>3

  As senhas em certas declarações escritas no log de consulta geral, no log de consultas lentas e no log binário são reescritas pelo servidor para não ocorrerem literalmente em texto simples. A reescrita de senhas pode ser suprimida para o log de consulta geral iniciando o servidor com a opção `--log-raw`. Esta opção pode ser útil para fins de diagnóstico, para ver o texto exato das declarações recebidas pelo servidor, mas, por razões de segurança, não é recomendada para uso em produção.

  Se um plugin de reescrita de consultas estiver instalado, a opção `--log-raw` afeta o registro de declarações da seguinte forma:

  - Sem `--log-raw`, o servidor registra a declaração devolvida pelo plugin de reescrita de consultas. Isso pode diferir da declaração recebida.

  - Com `--log-raw`, o servidor registra a declaração original conforme recebida.

  Para mais informações, consulte Seção 6.1.2.3, “Senhas e Registro de Ações”.

- `--log-short-format`

  <table frame="box" rules="all" summary="Propriedades para basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--basedir=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal"><a class="link" href="server-system-variables.html#sysvar_basedir">basedir</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">configuration-dependent default</code>]]</td> </tr></tbody></table>4

  Registre menos informações no registro de consultas lentas, se ele tiver sido ativado.

- `--log-tc=nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--basedir=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal"><a class="link" href="server-system-variables.html#sysvar_basedir">basedir</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">configuration-dependent default</code>]]</td> </tr></tbody></table>5

  O nome do arquivo de log do coordenador de transação mapeado à memória (para transações XA que afetam múltiplos mecanismos de armazenamento quando o log binário está desativado). O nome padrão é `tc.log`. O arquivo é criado no diretório de dados, se não for fornecido como um nome de caminho completo. Esta opção não é usada.

- `--log-tc-size=tamanho`

  <table frame="box" rules="all" summary="Propriedades para basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--basedir=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal"><a class="link" href="server-system-variables.html#sysvar_basedir">basedir</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">configuration-dependent default</code>]]</td> </tr></tbody></table>6

  O tamanho, em bytes, do log do coordenador de transações mapeado à memória. Os valores padrão e mínimos são 6 vezes o tamanho da página, e o valor deve ser um múltiplo do tamanho da página. (Antes do MySQL 5.7.21, o tamanho padrão é de 24 KB.)

- `--log-warnings[=nível]`, `-W [nível]`

  <table frame="box" rules="all" summary="Propriedades para basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--basedir=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal"><a class="link" href="server-system-variables.html#sysvar_basedir">basedir</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">configuration-dependent default</code>]]</td> </tr></tbody></table>7

  Nota

  A variável de sistema `log_error_verbosity` é preferida e deve ser usada em vez da opção `--log-warnings` ou da variável de sistema `log_warnings`. Para mais informações, consulte as descrições de `log_error_verbosity` e `log_warnings`. A opção de linha de comando `--log-warnings` e a variável de sistema `log_warnings` são desatualizadas; espere-se que sejam removidas em uma futura versão do MySQL.

  Se deve produzir mensagens de aviso adicionais no log de erros. Esta opção está habilitada por padrão. Para desabilitá-la, use `--log-warnings=0`. Especificar a opção sem um valor de *`level`* incrementa o valor atual em 1. O servidor registra mensagens sobre instruções que são inseguras para o registro baseado em instruções se o valor for maior que 0. Conexões abortadas e erros de acesso negado para novas tentativas de conexão são registrados se o valor for maior que 1. Veja Seção B.3.2.9, “Erros de Comunicação e Conexões Abortadas”.

- `--memlock`

  <table frame="box" rules="all" summary="Propriedades para basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--basedir=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal"><a class="link" href="server-system-variables.html#sysvar_basedir">basedir</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">configuration-dependent default</code>]]</td> </tr></tbody></table>8

  Bloquear o processo **mysqld** na memória. Esta opção pode ajudar se você tiver um problema em que o sistema operacional está fazendo com que o **mysqld** troque para o disco.

  `--memlock` funciona em sistemas que suportam a chamada de sistema `mlockall()`; isso inclui Solaris, a maioria das distribuições Linux que usam um kernel 2.4 ou superior e talvez outros sistemas Unix. Em sistemas Linux, você pode verificar se o `mlockall()` (e, portanto, essa opção) é suportado verificando se ele está definido ou não no arquivo `mman.h` do sistema, da seguinte maneira:

  ```sql
  $> grep mlockall /usr/include/sys/mman.h
  ```

  Se o `mlockall()` for suportado, você deve ver na saída do comando anterior algo como o seguinte:

  ```sql
  extern int mlockall (int __flags) __THROW;
  ```

  Importante

  O uso desta opção pode exigir que você execute o servidor como `root`, o que, por razões de segurança, normalmente não é uma boa ideia. Veja Seção 6.1.5, “Como executar o MySQL como um usuário normal”.

  Em Linux e talvez em outros sistemas, você pode evitar a necessidade de executar o servidor como `root` alterando o arquivo `limits.conf`. Consulte as notas sobre o limite de memlock na Seção 8.12.4.3, “Habilitar Suporte a Páginas Grandes”.

  Você não deve usar essa opção em um sistema que não suporte a chamada de sistema `mlockall()`; se você fizer isso, o **mysqld** provavelmente encerrará assim que você tentar iniciá-lo.

- `--myisam-block-size=N`

  <table frame="box" rules="all" summary="Propriedades para basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--basedir=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal"><a class="link" href="server-system-variables.html#sysvar_basedir">basedir</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">configuration-dependent default</code>]]</td> </tr></tbody></table>9

  O tamanho do bloco a ser usado para as páginas de índice do `MyISAM`.

- `--no-defaults`

  Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, o `--no-defaults` pode ser usado para impedir que sejam lidas. Isso deve ser a primeira opção na linha de comando se for usado.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opção”.

- `--old-style-user-limits`

  <table frame="box" rules="all" summary="Propriedades para bootstrap"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--bootstrap</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr></tbody></table>0

  Ative os limites de recursos de usuário de estilo antigo. (Antes do MySQL 5.0.3, os limites de recursos da conta eram contados separadamente para cada host a partir do qual um usuário se conectava, em vez de por linha de conta na tabela `user`.) Veja Seção 6.2.16, “Definir Limites de Recursos de Conta”.

- `--partition[=valor]`

  <table frame="box" rules="all" summary="Propriedades para bootstrap"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--bootstrap</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr></tbody></table>1

  Habilita ou desabilita o suporte à partição definida pelo usuário no MySQL Server.

  Esta opção foi descontinuada no MySQL 5.7.16 e foi removida no MySQL 8.0, pois, no MySQL 8.0, o mecanismo de particionamento é substituído pelo particionamento nativo, que não pode ser desativado.

- `--performance-schema-xxx`

  Configure uma opção do Schema de Desempenho. Para obter detalhes, consulte Seção 25.14, “Opções de Comando do Schema de Desempenho”.

- `--plugin-load=plugin_list`

  <table frame="box" rules="all" summary="Propriedades para bootstrap"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--bootstrap</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr></tbody></table>2

  Essa opção indica ao servidor que carregue os plugins nomeados ao iniciar. Se forem fornecidas várias opções de `--plugin-load` (server-options.html#option\_mysqld\_plugin-load), apenas a última se aplica. Plugins adicionais para carregar podem ser especificados usando as opções `--plugin-load-add` (server-options.html#option\_mysqld\_plugin-load-add).

  O valor da opção é uma lista separada por ponto e vírgula de valores de *`plugin_library`* e *`name`*=`*`plugin\_library\*`. Cada *`plugin\_library`* é o nome de um arquivo de biblioteca que contém o código do plugin, e cada *`name`* é o nome de um plugin a ser carregado. Se uma biblioteca de plugin tiver o nome sem nenhum nome de plugin anterior, o servidor carrega todos os plugins da biblioteca. Com um nome de plugin anterior, o servidor carrega apenas o plugin nomeado da biblioteca. O servidor procura por arquivos de biblioteca de plugin no diretório nomeado pela variável de sistema [`plugin\_dir\`]\(server-system-variables.html#sysvar\_plugin\_dir).

  Por exemplo, se os plugins chamados `myplug1` e `myplug2` estiverem contidos nos arquivos de biblioteca de plugins `myplug1.so` e `myplug2.so`, use esta opção para realizar um carregamento antecipado do plugin:

  ```sql
  mysqld --plugin-load="myplug1=myplug1.so;myplug2=myplug2.so"
  ```

  Aspas cercam o valor do argumento porque, caso contrário, alguns interpretadores de comandos interpretam o ponto e vírgula (`;`) como um caractere especial. (Por exemplo, as caixas de texto do Unix o tratam como um finalizador de comando.)

  Cada plugin nomeado é carregado apenas para uma única invocação de **mysqld**. Após um reinício, o plugin não é carregado, a menos que a opção `--plugin-load` seja usada novamente. Isso contrasta com `[INSTALL PLUGIN]` (install-plugin.html), que adiciona uma entrada à tabela `mysql.plugins` para fazer com que o plugin seja carregado em todas as inicializações normais do servidor.

  Durante a sequência normal de inicialização, o servidor determina quais plugins carregar lendo a tabela de sistema `mysql.plugins`. Se o servidor for iniciado com a opção `--skip-grant-tables`, os plugins registrados na tabela `mysql.plugins` não são carregados e estão indisponíveis. A opção `--plugin-load` permite que os plugins sejam carregados mesmo quando a opção `--skip-grant-tables` é fornecida. A opção `--plugin-load` também permite que plugins sejam carregados durante a inicialização que não podem ser carregados em tempo de execução.

  Esta opção não define uma variável de sistema correspondente. A saída de `SHOW PLUGINS` fornece informações sobre os plugins carregados. Informações mais detalhadas podem ser encontradas na tabela do esquema de informações `PLUGINS`. Veja Seção 5.5.2, “Obtendo Informações de Plugins do Servidor”.

  Para obter informações adicionais sobre o carregamento de plugins, consulte Seção 5.5.1, “Instalando e Desinstalando Plugins”.

- `--plugin-load-add=plugin_list`

  <table frame="box" rules="all" summary="Propriedades para bootstrap"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--bootstrap</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr></tbody></table>3

  Esta opção complementa a opção `--plugin-load`. `--plugin-load-add` adiciona um plugin ou plugins ao conjunto de plugins a serem carregados ao iniciar. O formato do argumento é o mesmo do `--plugin-load`. `--plugin-load-add` pode ser usado para evitar a especificação de um grande conjunto de plugins como um único argumento longo e complicado do `--plugin-load`.

  `--plugin-load-add` pode ser fornecido na ausência de `--plugin-load`, mas qualquer instância de `--plugin-load-add` que aparecer antes de `--plugin-load` não terá efeito, porque `--plugin-load` redefini o conjunto de plugins a serem carregados. Em outras palavras, essas opções:

  ```sql
  --plugin-load=x --plugin-load-add=y
  ```

  são equivalentes a esta opção:

  ```sql
  --plugin-load="x;y"
  ```

  Mas essas opções:

  ```sql
  --plugin-load-add=y --plugin-load=x
  ```

  são equivalentes a esta opção:

  ```sql
  --plugin-load=x
  ```

  Esta opção não define uma variável de sistema correspondente. A saída de `SHOW PLUGINS` fornece informações sobre os plugins carregados. Informações mais detalhadas podem ser encontradas na tabela do esquema de informações `PLUGINS`. Veja Seção 5.5.2, “Obtendo Informações de Plugins do Servidor”.

  Para obter informações adicionais sobre o carregamento de plugins, consulte Seção 5.5.1, “Instalando e Desinstalando Plugins”.

- `--plugin-xxx`

  Especifica uma opção que pertence a um plugin do servidor. Por exemplo, muitos motores de armazenamento podem ser construídos como plugins, e para esses motores, as opções para eles podem ser especificadas com o prefixo `--plugin`. Assim, a opção `--innodb-file-per-table` para o `InnoDB` pode ser especificada como `--plugin-innodb-file-per-table`.

  Para opções booleanas que podem ser habilitadas ou desabilitadas, o prefixo `--skip` e outros formatos alternativos são suportados também (veja Seção 4.2.2.4, “Modificadores de Opção do Programa”). Por exemplo, `--skip-plugin-innodb-file-per-table` desabilita `innodb-file-per-table`.

  A justificativa para o prefixo `--plugin` é que ele permite especificar opções de plugin de forma inequívoca, caso haja um conflito de nome com uma opção de servidor embutida. Por exemplo, se um escritor de plugin nomear um plugin como “sql” e implementar uma opção “mode”, o nome da opção pode ser `--sql-mode`, o que entraria em conflito com a opção embutida do mesmo nome. Nesses casos, as referências ao nome em conflito são resolvidas em favor da opção embutida. Para evitar a ambiguidade, os usuários podem especificar a opção de plugin como `--plugin-sql-mode`. O uso do prefixo `--plugin` para opções de plugin é recomendado para evitar qualquer questão de ambiguidade.

- `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Propriedades para bootstrap"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--bootstrap</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr></tbody></table>4

  O número de porta a ser usado ao ouvir conexões TCP/IP. Em sistemas Unix e Unix-like, o número de porta deve ser 1024 ou superior, a menos que o servidor seja iniciado pelo usuário do sistema operacional `root`. Definir esta opção para 0 faz com que o valor padrão seja usado.

- `--port-open-timeout=num`

  <table frame="box" rules="all" summary="Propriedades para bootstrap"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--bootstrap</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr></tbody></table>5

  Em alguns sistemas, quando o servidor é desligado, a porta TCP/IP pode não ficar disponível imediatamente. Se o servidor for reiniciado rapidamente depois disso, sua tentativa de reabrir a porta pode falhar. Esta opção indica quantos segundos o servidor deve esperar para que a porta TCP/IP fique livre, caso não consiga ser aberta. O padrão é não esperar.

- `--print-defaults`

  Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opções. Os valores da senha são mascarados. Isso deve ser a primeira opção na linha de comando, exceto que pode ser usado imediatamente após `--defaults-file` ou `--defaults-extra-file`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opção”.

- `--remove [nome_do_serviço]`

  <table frame="box" rules="all" summary="Propriedades para bootstrap"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--bootstrap</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr></tbody></table>6

  (Apenas para Windows) Remova um serviço do MySQL no Windows. O nome padrão do serviço é `MySQL` se não for fornecido o valor *`service_name`*. Para obter mais informações, consulte Seção 2.3.4.8, “Iniciar o MySQL como um serviço do Windows”.

- `--safe-user-create`

  <table frame="box" rules="all" summary="Propriedades para bootstrap"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--bootstrap</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr></tbody></table>7

  Se essa opção estiver habilitada, um usuário não poderá criar novos usuários MySQL usando a instrução `GRANT` a menos que o usuário tenha o privilégio `INSERT` para a tabela de sistema `mysql.user` ou qualquer coluna na tabela. Se você deseja que um usuário tenha a capacidade de criar novos usuários que tenham esses privilégios, o usuário tem o direito de conceder, você deve conceder ao usuário o seguinte privilégio:

  ```sql
  GRANT INSERT(user) ON mysql.user TO 'user_name'@'host_name';
  ```

  Isso garante que o usuário não possa alterar diretamente as colunas de privilégio, mas deve usar a instrução `GRANT` para conceder privilégios a outros usuários.

- `--skip-grant-tables`

  <table frame="box" rules="all" summary="Propriedades para bootstrap"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--bootstrap</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr></tbody></table>8

  Esta opção afeta a sequência de inicialização do servidor:

  - `--skip-grant-tables` faz com que o servidor não leia as tabelas de concessão no banco de dados do sistema `mysql`, e, assim, comece sem usar o sistema de privilégios. Isso dá a qualquer pessoa com acesso ao servidor *acesso ilimitado a todos os bancos de dados*.

    Para fazer com que um servidor iniciado com `--skip-grant-tables` carregue as tabelas de concessão no tempo de execução, execute uma operação de limpeza de privilégios, que pode ser feita das seguintes maneiras:

    - Emita uma declaração MySQL `FLUSH PRIVILEGES` após se conectar ao servidor.

    - Execute o comando **mysqladmin flush-privileges** ou **mysqladmin reload** a partir da linha de comando.

    O esvaziamento de privilégios também pode ocorrer implicitamente como resultado de outras ações realizadas após a inicialização, fazendo com que o servidor comece a usar as tabelas de concessão. Por exemplo, o **mysql\_upgrade** esvazia os privilégios durante o procedimento de atualização.

  - `--skip-grant-tables` faz com que o servidor não carregue certos outros objetos registrados no banco de dados do sistema `mysql`:

    - Os plugins instalados usando `INSTALL PLUGIN` e registrados na tabela de sistema `mysql.plugin`.

      Para fazer com que os plugins sejam carregados mesmo quando estiver usando `--skip-grant-tables`, use a opção `--plugin-load` ou `--plugin-load-add`.

    - Eventos agendados instalados usando `CREATE EVENT` e registrados na tabela do sistema `mysql.event`.

    - Funções carregáveis instaladas usando `CREATE FUNCTION` e registradas na tabela de sistema `mysql.func`.

  - `--skip-grant-tables` faz com que a variável de sistema `disabled_storage_engines` não tenha efeito.

- `--skip-host-cache`

  <table frame="box" rules="all" summary="Propriedades para bootstrap"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--bootstrap</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr></tbody></table>9

  Desative o uso do cache de host interno para uma resolução mais rápida de nomes para IPs. Com o cache desativado, o servidor realiza uma pesquisa DNS toda vez que um cliente se conecta.

  O uso de `--skip-host-cache` é semelhante a definir a variável de sistema `host_cache_size` para 0, mas `host_cache_size` é mais flexível porque também pode ser usado para redimensionar, habilitar ou desabilitar o cache do host em tempo de execução, não apenas no início do servidor.

  Iniciar o servidor com `--skip-host-cache` não impede alterações no valor de `host_cache_size` durante a execução, mas essas alterações não têm efeito e o cache não é reativado, mesmo que `host_cache_size` seja definido como maior que 0.

  Para obter mais informações sobre como o cache do host funciona, consulte Seção 5.1.11.2, “Consultas DNS e o Cache do Host”.

- `--skip-innodb`

  Desative o mecanismo de armazenamento `InnoDB`. Neste caso, como o mecanismo de armazenamento padrão é `InnoDB` (innodb-storage-engine.html), o servidor não pode ser iniciado a menos que você também use `--default-storage-engine` (server-system-variables.html#sysvar\_default\_storage\_engine) e `--default-tmp-storage-engine` (server-system-variables.html#sysvar\_default\_tmp\_storage\_engine) para definir o padrão para outros mecanismos tanto para tabelas permanentes quanto `TEMPORARY`.

  O mecanismo de armazenamento `InnoDB` não pode ser desativado, e a opção `--skip-innodb` está desatualizada e não tem efeito. Seu uso resulta em um aviso. Espere que essa opção seja removida em uma futura versão do MySQL.

- `--skip-new`

  <table frame="box" rules="all" summary="Propriedades para handshake de cliente de conjunto de caracteres"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-set-client-handshake[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">ON</code>]]</td> </tr></tbody></table>0

  Essa opção desativa (o que costumava ser considerado) novos comportamentos, possivelmente inseguros. Isso resulta nestas configurações: `delay_key_write=OFF`, `concurrent_insert=NEVER`, `automatic_sp_privileges=OFF`. Também faz com que `OPTIMIZE TABLE` seja mapeado para `ALTER TABLE` para os motores de armazenamento para os quais `OPTIMIZE TABLE` não é suportado.

- `--skip-partition`

  <table frame="box" rules="all" summary="Propriedades para handshake de cliente de conjunto de caracteres"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-set-client-handshake[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">ON</code>]]</td> </tr></tbody></table>1

  Desabilita a partição definida pelo usuário. As tabelas particionadas podem ser visualizadas usando `SHOW TABLES` ou consultando a tabela do Schema de Informações `TABLES`, mas não podem ser criadas ou modificadas, nem os dados nessas tabelas podem ser acessados. Todas as colunas específicas de partição na tabela do Schema de Informações `PARTITIONS` exibem `NULL`.

  Como o `DROP TABLE` remove os arquivos de definição da tabela (`.frm`), essa declaração funciona em tabelas particionadas, mesmo quando a opção está desativada. No entanto, a declaração não remove as definições de partição associadas a tabelas particionadas nesses casos. Por essa razão, você deve evitar a remoção de tabelas particionadas com a partição desativada ou tomar medidas para remover manualmente os arquivos `.par` órfãos (se presentes).

  Nota

  No MySQL 5.7, os arquivos de definição de partição (`.par`) não são mais criados para tabelas `InnoDB` particionadas. Em vez disso, as definições de partição são armazenadas no dicionário de dados interno do `InnoDB`. Os arquivos de definição de partição (`.par`) continuam sendo usados para tabelas `MyISAM` particionadas.

  Esta opção foi descontinuada no MySQL 5.7.16 e foi removida no MySQL 8.0, pois, no MySQL 8.0, o mecanismo de particionamento é substituído pelo particionamento nativo, que não pode ser desativado.

- `--skip-show-database`

  <table frame="box" rules="all" summary="Propriedades para handshake de cliente de conjunto de caracteres"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-set-client-handshake[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">ON</code>]]</td> </tr></tbody></table>2

  Essa opção define a variável de sistema `skip_show_database`, que controla quem tem permissão para usar a instrução `SHOW DATABASES`. Veja Seção 5.1.7, “Variáveis de Sistema do Servidor”.

- `--skip-stack-trace`

  <table frame="box" rules="all" summary="Propriedades para handshake de cliente de conjunto de caracteres"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-set-client-handshake[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">ON</code>]]</td> </tr></tbody></table>3

  Não escreva traços de pilha. Esta opção é útil quando você está executando o **mysqld** sob um depurador. Em alguns sistemas, você também deve usar esta opção para obter um arquivo de núcleo. Veja Seção 5.8, “Depuração do MySQL”.

- `--slow-start-timeout=timeout`

  <table frame="box" rules="all" summary="Propriedades para handshake de cliente de conjunto de caracteres"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-set-client-handshake[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">ON</code>]]</td> </tr></tbody></table>4

  Esta opção controla o tempo de espera do gerenciador de controle de serviços do Windows para o início do serviço. O valor é o número máximo de milissegundos que o gerenciador de controle de serviços do Windows espera antes de tentar interromper o serviço do MySQL durante o início. O valor padrão é 15000 (15 segundos). Se o serviço MySQL demorar muito para iniciar, você pode precisar aumentar esse valor. Um valor de 0 significa que não há tempo de espera.

- `--socket=caminho`

  <table frame="box" rules="all" summary="Propriedades para handshake de cliente de conjunto de caracteres"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-set-client-handshake[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">ON</code>]]</td> </tr></tbody></table>5

  No Unix, essa opção especifica o arquivo de soquete Unix a ser usado ao ouvir conexões locais. O valor padrão é `/tmp/mysql.sock`. Se essa opção for fornecida, o servidor cria o arquivo no diretório de dados, a menos que um nome de caminho absoluto seja fornecido para especificar um diretório diferente. No Windows, a opção especifica o nome do tubo a ser usado ao ouvir conexões locais que usam um tubo nomeado. O valor padrão é `MySQL` (não case-sensitive).

- [`--sql-mode=valor[,valor[,valor...]]`](server-options.html#opção_mysqld_sql-mode)

  <table frame="box" rules="all" summary="Propriedades para handshake de cliente de conjunto de caracteres"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-set-client-handshake[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">ON</code>]]</td> </tr></tbody></table>6

  Defina o modo SQL. Consulte Seção 5.1.10, “Modos SQL do servidor”.

  Nota

  Os programas de instalação do MySQL podem configurar o modo SQL durante o processo de instalação. Se o modo SQL for diferente do padrão ou do que você espera, verifique se há uma configuração em um arquivo de opção que o servidor lê ao iniciar.

- `--ssl`, `--skip-ssl`

  <table frame="box" rules="all" summary="Propriedades para handshake de cliente de conjunto de caracteres"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-set-client-handshake[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">ON</code>]]</td> </tr></tbody></table>7

  A opção `--ssl` especifica que o servidor permite, mas não exige, conexões criptografadas. Esta opção está habilitada por padrão.

  `--ssl` pode ser especificado na forma negada como `--skip-ssl` ou um sinônimo (`--ssl=OFF`, `--disable-ssl`). Neste caso, a opção especifica que o servidor *não* permite conexões criptografadas, independentemente das configurações das variáveis de sistema `tls_xxx` e `ssl_xxx`.

  Para obter mais informações sobre como configurar se o servidor permite que os clientes se conectem usando SSL e para saber onde encontrar as chaves e certificados SSL, consulte Seção 6.3.1, “Configurando o MySQL para usar conexões criptografadas”, que também descreve as capacidades do servidor para autogeração e autodescoberta de arquivos de certificado e chave. Considere definir pelo menos as variáveis de sistema `ssl_cert` e `ssl_key` no lado do servidor e a opção `--ssl-ca` (ou `--ssl-capath`) no lado do cliente.

- `--standalone`

  <table frame="box" rules="all" summary="Propriedades para handshake de cliente de conjunto de caracteres"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-set-client-handshake[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">ON</code>]]</td> </tr></tbody></table>8

  Disponível apenas no Windows; instrui o servidor MySQL a não ser executado como serviço.

- `--super-large-pages`

  <table frame="box" rules="all" summary="Propriedades para handshake de cliente de conjunto de caracteres"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-set-client-handshake[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">ON</code>]]</td> </tr></tbody></table>9

  O uso padrão de páginas grandes no MySQL tenta usar o tamanho maior suportado, até 4 MB. Sob o Solaris, um recurso de "páginas super grandes" permite o uso de páginas de até 256 MB. Esse recurso está disponível para plataformas SPARC recentes. Ele pode ser ativado ou desativado usando as opções `--super-large-pages` ou `--skip-super-large-pages`.

- `--symbolic-links`, `--skip-symbolic-links`

  <table frame="box" rules="all" summary="Propriedades para chroot"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--chroot=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>0

  Ative ou desative o suporte a links simbólicos. No Unix, ativar links simbólicos significa que você pode vincular um arquivo de índice `MyISAM` ou um arquivo de dados a outro diretório com a opção `DIR_ÍNDICE` ou `DIR_DADOS` da instrução `CREATE TABLE`. Se você excluir ou renomear a tabela, os arquivos a que seus links simbólicos apontam também serão excluídos ou renomeados. Veja Seção 8.12.3.2, “Usando Links Simbólicos para Tabelas MyISAM no Unix”.

  Esta opção não tem significado no Windows.

- `--sysdate-is-now`

  <table frame="box" rules="all" summary="Propriedades para chroot"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--chroot=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>1

  `SYSDATE()` por padrão retorna a hora em que é executado, e não a hora em que a instrução na qual ocorre começa a ser executada. Isso difere do comportamento de `NOW()`. Esta opção faz com que `SYSDATE()` seja sinônimo de `NOW()`. Para informações sobre as implicações para o registro binário e a replicação, consulte a descrição para `SYSDATE()` em Seção 12.7, “Funções de Data e Hora” e para `SET TIMESTAMP` em Seção 5.1.7, “Variáveis do Sistema do Servidor”.

- `--tc-heuristic-recover={COMMIT|ROLLBACK}`

  <table frame="box" rules="all" summary="Propriedades para chroot"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--chroot=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>2

  A decisão de usar uma recuperação heurística manual.

  Se a opção `--tc-heuristic-recover` for especificada, o servidor será encerrado, independentemente de a recuperação heurística manual ter sucesso ou

  Em sistemas com mais de um mecanismo de armazenamento capaz de commit de duas fases, a opção `ROLLBACK` não é segura e faz com que a recuperação seja interrompida com o seguinte erro:

  ```sql
  [ERROR] --tc-heuristic-recover rollback
  strategy is not safe on systems with more than one 2-phase-commit-capable
  storage engine. Aborting crash recovery.
  ```

- `--temp-pool`

  <table frame="box" rules="all" summary="Propriedades para chroot"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--chroot=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>3

  Esta opção é ignorada, exceto no Linux. No Linux, ela faz com que a maioria dos arquivos temporários criados pelo servidor use um pequeno conjunto de nomes, em vez de um nome único para cada novo arquivo. Isso resolve um problema no kernel do Linux relacionado à criação de muitos novos arquivos com nomes diferentes. Com o comportamento antigo, o Linux parece estar “vazando” memória, porque está sendo alocado para o cache de entradas de diretório em vez do cache de disco.

  A partir do MySQL 5.7.18, essa opção é desaconselhada e será removida no MySQL 8.0.

- `--transaction-isolation=level`

  <table frame="box" rules="all" summary="Propriedades para chroot"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--chroot=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>4

  Define o nível padrão de isolamento de transação. O valor `level` pode ser `READ-UNCOMMITTED`, `READ-COMMITTED`, `REPEATABLE-READ` ou `SERIALIZABLE`. Consulte Seção 13.3.6, “Instrução SET TRANSACTION”.

  O nível de isolamento de transação padrão também pode ser definido em tempo de execução usando a instrução `SET TRANSACTION` ou configurando a variável de sistema `tx_isolation` (ou, a partir do MySQL 5.7.20, `transaction_isolation`).

- `--transaction-read-only`

  <table frame="box" rules="all" summary="Propriedades para chroot"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--chroot=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>5

  Define o modo de acesso padrão para transações. Por padrão, o modo apenas de leitura está desativado, portanto, o modo é leitura/escrita.

  Para definir o modo de acesso de transações padrão em tempo de execução, use a instrução `SET TRANSACTION` ou defina a variável de sistema `tx_read_only` (ou, a partir do MySQL 5.7.20, `transaction_read_only`). Veja Seção 13.3.6, “Instrução SET TRANSACTION”.

- `--tmpdir=dir_name`, `-t dir_name`

  <table frame="box" rules="all" summary="Propriedades para chroot"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--chroot=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>6

  O caminho do diretório a ser usado para criar arquivos temporários. Isso pode ser útil se o diretório padrão `/tmp` estiver em uma partição que é muito pequena para armazenar tabelas temporárias. Esta opção aceita vários caminhos que são usados de forma rotativa. Os caminhos devem ser separados por colchetes (`:`) no Unix e por pontos e vírgulas (`;`) no Windows.

  `--tmpdir` pode ser uma localização não permanente, como um diretório em um sistema de arquivos baseado em memória ou um diretório que é limpo quando o host do servidor é reiniciado. Se o servidor MySQL estiver atuando como uma replica e você estiver usando uma localização não permanente para `--tmpdir`, considere definir um diretório temporário diferente para a replica usando a variável de sistema `slave_load_tmpdir`. Para uma replica de replicação, os arquivos temporários usados para replicar as instruções `LOAD DATA` são armazenados neste diretório, então, com uma localização permanente, eles podem sobreviver a reinicializações de máquina, embora a replicação possa continuar após um reinício se os arquivos temporários tiverem sido removidos.

  Para obter mais informações sobre o local de armazenamento de arquivos temporários, consulte Seção B.3.3.5, “Onde o MySQL armazena arquivos temporários”.

- `--user={user_name|user_id}`, `-u {user_name|user_id}`

  <table frame="box" rules="all" summary="Propriedades para chroot"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--chroot=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>7

  Execute o servidor **mysqld** como o usuário com o nome *`user_name`* ou o ID de usuário numérico *`user_id`*. (“Usuário” neste contexto se refere a uma conta de login do sistema, não a um usuário MySQL listado nas tabelas de concessão.)

  Esta opção é **obrigatória** ao iniciar o **mysqld** como `root`. O servidor altera seu ID de usuário durante a sequência de inicialização, fazendo com que ele execute como esse usuário específico em vez de como `root`. Veja Seção 6.1.1, “Diretrizes de Segurança”.

  Para evitar uma possível falha de segurança onde um usuário adiciona uma opção `--user=root` a um arquivo `my.cnf` (causando assim o servidor a rodar como `root`), o **mysqld** usa apenas a primeira opção `--user` especificada e emite uma mensagem de aviso se houver várias opções `--user` (server-options.html#option\_mysqld\_user). As opções em `/etc/my.cnf` e `$MYSQL_HOME/my.cnf` são processadas antes das opções de linha de comando, portanto, recomenda-se que você coloque uma opção `--user` em `/etc/my.cnf` e especifique um valor diferente de `root`. A opção em `/etc/my.cnf` é encontrada antes de qualquer outra opção `--user` (server-options.html#option\_mysqld\_user), o que garante que o servidor execute como um usuário diferente de `root` e que uma mensagem de aviso seja emitida se qualquer outra opção `--user` for encontrada.

- `--validate-user-plugins[={OFF|ON}]`

  <table frame="box" rules="all" summary="Propriedades para chroot"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--chroot=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>8

  Se essa opção estiver habilitada (padrão), o servidor verifica cada conta de usuário e emite um aviso se forem encontradas condições que tornem a conta inutilizável:

  - A conta requer um plugin de autenticação que não está carregado.

  - A conta exige o plugin de autenticação `sha256_password`, mas o servidor foi iniciado sem SSL ou RSA habilitados, conforme exigido por este plugin.

  Ativação de `--validate-user-plugins` desacelera a inicialização do servidor e `FLUSH PRIVILEGES`. Se você não precisar da verificação adicional, pode desabilitar essa opção no início para evitar a redução do desempenho.

- `--verbose`, `-v`

  Use esta opção com a opção `--help` para obter ajuda detalhada.

- `--version`, `-V`

  Exibir informações da versão e sair.
