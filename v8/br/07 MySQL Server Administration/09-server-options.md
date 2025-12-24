### 7.1.7 Opções de comando do servidor

Quando você inicia o servidor `mysqld`, você pode especificar opções de programa usando qualquer um dos métodos descritos na Seção 6.2.2, Especificar Opções de Programa. Os métodos mais comuns são fornecer opções em um arquivo de opções ou na linha de comando. No entanto, na maioria dos casos, é desejável garantir que o servidor use as mesmas opções a cada vez que ele é executado. A melhor maneira de garantir isso é listá-las em um arquivo de opções. Veja Seção 6.2.2.2, Usar Arquivos de Opção. Essa seção também descreve o formato e a sintaxe do arquivo de opções.

`mysqld` lê opções dos grupos `[mysqld]` e `[server]`. **mysqld\_safe** lê opções dos grupos `[mysqld]`, `[server]`, `[mysqld_safe]`, e `[safe_mysqld]`. `mysql.server` lê opções dos grupos `[mysqld]` e `[mysql.server]`.

`mysqld` aceita muitas opções de comando. Para um breve resumo, execute este comando:

```
mysqld --help
```

Para ver a lista completa, use este comando:

```
mysqld --verbose --help
```

Alguns dos itens na lista são na verdade variáveis do sistema que podem ser definidas na inicialização do servidor. Estes podem ser exibidos no tempo de execução usando a instrução `SHOW VARIABLES`. Alguns itens exibidos pelo comando `mysqld` anterior não aparecem na saída `SHOW VARIABLES`; isso é porque são apenas opções e não variáveis do sistema.

A lista a seguir mostra algumas das opções de servidor mais comuns. Opções adicionais são descritas em outras seções:

- Opções que afetam a segurança: ver secção 8.1.4, "Opções e variáveis mysqld relacionadas com a segurança".
- Opções relacionadas com SSL: consulte Opções de comando para conexões criptografadas.
- Opções de controlo do registo binário: Ver secção 7.4.4, "O registo binário".
- Opções relacionadas com a replicação: ver secção 19.1.6, "Opções e variáveis de replicação e registo binário".
- Opções para o carregamento de plug-ins, tais como motores de armazenamento conectáveis: Ver secção 7.6.1, "Instalar e desinstalar plug-ins".
- Opções específicas para motores de armazenamento específicos: Ver secção 17.14, "Opções de inicialização do InnoDB e variáveis do sistema" e secção 18.2.1, "Opções de inicialização do MyISAM".

Algumas opções controlam o tamanho de buffers ou caches. Para um determinado buffer, o servidor pode precisar alocar estruturas de dados internas. Essas estruturas geralmente são alocadas a partir da memória total alocada ao buffer, e a quantidade de espaço necessária pode ser dependente da plataforma. Isso significa que quando você atribui um valor a uma opção que controla o tamanho de um buffer, a quantidade de espaço realmente disponível pode diferir do valor atribuído. Em alguns casos, a quantidade pode ser menor do que o valor atribuído. Também é possível que o servidor ajuste um valor para cima. Por exemplo, se você atribuir um valor de 0 a uma opção para a qual o valor mínimo é 1024, o servidor define o valor para 1024.

Os valores para os tamanhos de buffer, comprimentos e tamanhos de pilha são dados em bytes, salvo indicação em contrário.

Algumas opções tomam valores de nome de arquivo. A menos que especificado de outra forma, o local padrão do arquivo é o diretório de dados se o valor for um nome de caminho relativo. Para especificar o local explicitamente, use um nome de caminho absoluto. Suponha que o diretório de dados seja `/var/mysql/data`. Se uma opção de valor de arquivo for dada como um nome de caminho relativo, ela estará localizada em `/var/mysql/data`. Se o valor for um nome de caminho absoluto, sua localização será dada pelo nome do caminho.

Você também pode definir os valores das variáveis do sistema do servidor na inicialização do servidor usando nomes de variáveis como opções. Para atribuir um valor a uma variável do sistema do servidor, use uma opção da forma `--var_name=value`. Por exemplo, `--sort_buffer_size=384M` define a variável `sort_buffer_size` para um valor de 384MB.

Quando você atribui um valor a uma variável, o MySQL pode corrigir automaticamente o valor para ficar dentro de um determinado intervalo, ou ajustar o valor para o valor mais próximo permitido se apenas certos valores são permitidos.

Para restringir o valor máximo para o qual uma variável do sistema pode ser definida no tempo de execução com a instrução `SET`, especifique esse máximo usando uma opção do formulário `--maximum-var_name=value` na inicialização do servidor.

Você pode alterar os valores da maioria das variáveis do sistema no tempo de execução com a instrução `SET`.

A secção 7.1.8, "Variaveis do sistema do servidor", fornece uma descrição completa de todas as variáveis e informações adicionais para configurá-las na inicialização e no tempo de execução do servidor.

- `--help`, `-?`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

Exibir uma mensagem de ajuda curta e sair. Use as opções `--verbose` e `--help` para ver a mensagem completa.

- `--allow-suspicious-udfs`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--allow-suspicious-udfs[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Esta opção controla se as funções carregáveis que têm apenas um símbolo `xxx` para a função principal podem ser carregadas. Por padrão, a opção está desativada e apenas as funções carregáveis que têm pelo menos um símbolo auxiliar podem ser carregadas; isso impede tentativas de carregamento de funções de arquivos de objetos compartilhados que não os que contêm funções legítimas.

- `--ansi`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--ansi</code>]]</td> </tr></tbody></table>

Use a sintaxe SQL padrão (ANSI) em vez da sintaxe MySQL. Para um controle mais preciso sobre o modo SQL do servidor, use a opção `--sql-mode` em vez disso. Veja Seção 1.7, MySQL Standards Compliance, e Seção 7.1.11, Server SQL Modes.

- `--basedir=dir_name`, `-b dir_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--basedir=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>basedir</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Nome do diretório</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>parent of mysqld installation directory</code>]]</td> </tr></tbody></table>

O caminho para o diretório de instalação do MySQL. Esta opção define a variável do sistema `basedir`.

O executável do servidor determina seu próprio nome de caminho completo na inicialização e usa o pai do diretório no qual ele está localizado como o valor padrão `basedir`. Isso, por sua vez, permite que o servidor use esse `basedir` ao procurar informações relacionadas ao servidor, como o `share` diretório que contém mensagens de erro.

- `--check-table-functions=value`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--check-table-functions=value</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Enumeração</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>ABORT</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>WARN</code>]]</p><p>[[<code>ABORT</code>]]</p></td> </tr></tbody></table>

Ao executar uma atualização do servidor, analisamos o dicionário de dados em busca de funções usadas em restrições de tabela e outras expressões, incluindo expressões `DEFAULT` , expressões de particionamento e colunas virtuais. É possível que uma mudança no comportamento da função faça com que ele levante um erro na nova versão do servidor, onde nenhum erro desse tipo ocorreu antes, caso em que a tabela não pode ser aberta. Esta opção fornece uma escolha de como lidar com tais problemas, de acordo com qual dos dois valores mostrados aqui é usado:

- `WARN`: Registre um aviso para cada tabela que não pode ser aberta.
- `ABORT`: Também registra um aviso; além disso, a atualização é interrompida. Este é o padrão. Para um valor suficientemente alto de `--log-error-verbosity`, ele também registra uma nota com uma definição de tabela simplificada listando apenas as expressões que potencialmente contêm funções SQL.

O comportamento padrão é abortar a atualização, para que o usuário possa corrigir o problema usando a versão mais antiga do servidor, antes de atualizar para a mais nova. Use `WARN` para continuar a atualização no modo interativo enquanto relata quaisquer problemas.

A opção `--check-table-functions` foi introduzida no MySQL 8.4.5.

- `--chroot=dir_name`, `-r dir_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--chroot=dir_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do diretório</td> </tr></tbody></table>

Coloque o servidor `mysqld` em um ambiente fechado durante a inicialização usando a chamada de sistema `chroot()`. Esta é uma medida de segurança recomendada. O uso desta opção limita um pouco `LOAD DATA` e `SELECT ... INTO OUTFILE`.

- `--console`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--console</code>]]</td> </tr><tr><th>Específicos da plataforma</th> <td>Vidros</td> </tr></tbody></table>

(Só no Windows.) Faça com que o destino padrão do log de erros seja o console. Isso afeta os sinks de log que baseiam seu próprio destino de saída no destino padrão. Veja Seção 7.4.2, The Error Log. `mysqld` não fecha a janela do console se essa opção for usada.

`--console` tem precedência sobre `--log-error` se ambos forem dados.

- `--core-file`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--core-file</code>]]</td> </tr></tbody></table>

Quando esta opção é usada, escrever um arquivo de núcleo se `mysqld` morre; nenhum argumento é necessário (ou aceito). O nome e a localização do arquivo de núcleo é dependente do sistema. No Linux, um arquivo de núcleo chamado `core.pid` é escrito no diretório de trabalho atual do processo, que para `mysqld` é o diretório de dados. `pid` representa o ID do processo do processo do servidor. No macOS, um arquivo de núcleo chamado `core.pid` é escrito no diretório `/cores`. No Solaris, use o comando **coreadm** para especificar onde escrever o arquivo de núcleo e como nomeá-lo.

Para alguns sistemas, para obter um arquivo de núcleo, você também deve especificar a opção `--core-file-size` para **mysqld\_safe**. Veja Seção 6.3.2, mysqld\_safe  MySQL Server Startup Script. Em alguns sistemas, como o Solaris, você não obtém um arquivo de núcleo se estiver usando também a opção `--user`. Pode haver restrições ou limitações adicionais. Por exemplo, pode ser necessário executar **ulimit -c unlimited** antes de iniciar o servidor. Consulte a documentação do sistema.

A variável `innodb_buffer_pool_in_core_file` pode ser usada para reduzir o tamanho dos arquivos do núcleo em sistemas operacionais que o suportam.

- `--daemonize`, `-D`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--daemonize[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Esta opção faz com que o servidor seja executado como um daemon tradicional, permitindo que ele funcione com sistemas operacionais que usam systemd para controle de processos.

`--daemonize` é mutuamente exclusivo com `--initialize` e `--initialize-insecure`.

Se o servidor for iniciado usando a opção `--daemonize` e não estiver conectado a um dispositivo tty, uma opção de registro de erro padrão de `--log-error=""` é usada na ausência de uma opção de registro explícita, para direcionar a saída de erro para o arquivo de registro padrão.

`-D` é um sinônimo de `--daemonize`.

- `--datadir=dir_name`, `-h dir_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--datadir=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>datadir</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Nome do diretório</td> </tr></tbody></table>

O caminho para o diretório de dados do servidor MySQL. Esta opção define a variável de sistema `datadir`. Veja a descrição dessa variável.

- `--debug[=debug_options]`, `-# [debug_options]`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--debug[=debug_option<code>debug</code></code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>debug</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor padrão (Unix)</th> <td>[[<code>d:t:i:o,/tmp/mysqld.trace</code>]]</td> </tr><tr><th>Valor padrão (Windows)</th> <td>[[<code>d:t:i:O,\mysqld.trace</code>]]</td> </tr></tbody></table>

Se o MySQL está configurado com a opção `-DWITH_DEBUG=1` `CMake`, você pode usar essa opção para obter um arquivo de rastreamento do que `mysqld` está fazendo. Uma string `debug_options` típica é `d:t:o,file_name`. O padrão é `d:t:i:o,/tmp/mysqld.trace` no Unix e `d:t:i:O,\mysqld.trace` no Windows.

O uso de `-DWITH_DEBUG=1` para configurar o MySQL com suporte de depuração permite que você use a opção `--debug="d,parser_debug"` quando você inicia o servidor. Isso faz com que o analisador Bison que é usado para processar instruções SQL para despejar um rastreamento do analisador para a saída de erro padrão do servidor. Normalmente, esta saída é escrita para o log de erro.

Esta opção pode ser dada várias vezes. Valores que começam com \[`+`] ou \[`-`] são adicionados ou subtraídos do valor anterior. Por exemplo, \[`--debug=T`] \[`--debug=+P`] define o valor para \[`P:T`].

Para mais informações, ver secção 7.9.4, "O pacote DBUG".

- `--debug-sync-timeout[=N]`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--debug-sync-timeout[=#]</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr></tbody></table>

Controla se a facilidade Debug Sync para testes e depuração está ativada. O uso de Debug Sync requer que o MySQL seja configurado com a opção `-DWITH_DEBUG=ON` `CMake` (veja Seção 2.8.7, Opções de Configuração de Fonte do MySQL); caso contrário, esta opção não está disponível. O valor da opção é um tempo limite em segundos. O valor padrão é 0, o que desativa o Debug Sync. Para ativá-lo, especifique um valor maior que 0; este valor também se torna o tempo limite padrão para pontos de sincronização individuais. Se a opção for dada sem um valor, o tempo limite é definido em 300 segundos.

Para uma descrição da facilidade de Debug Sync e como usar pontos de sincronização, consulte MySQL Internals: Test Synchronization.

- `--default-time-zone=timezone`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--default-time-zone=name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Defina o fuso horário padrão do servidor. Esta opção define a variável de sistema global `time_zone`. Se esta opção não for dada, o fuso horário padrão é o mesmo que o fuso horário do sistema (dado pelo valor da variável de sistema `system_time_zone`).

A variável `system_time_zone` difere da `time_zone`. Embora possam ter o mesmo valor, a última variável é usada para inicializar o fuso horário para cada cliente que se conecta.

- `--defaults-extra-file=file_name`

Leia este arquivo de opção após o arquivo de opção global, mas (em Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou for inacessível, ocorre um erro. Se \* `file_name` \* não for um nome de caminho absoluto, ele é interpretado em relação ao diretório atual. Esta deve ser a primeira opção na linha de comando se for usada.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--defaults-file=file_name`

Leia apenas o arquivo de opção dado. Se o arquivo não existir ou for inacessível, ocorre um erro. Se `file_name` não for um nome de caminho absoluto, ele é interpretado em relação ao diretório atual.

Exceção: Mesmo com `--defaults-file`, `mysqld` lê `mysqld-auto.cnf`.

::: info Note

Esta deve ser a primeira opção na linha de comando se for usada, exceto que se o servidor for iniciado com as opções `--defaults-file` e `--install` (ou `--install-manual`), `--install` (ou `--install-manual`) deve ser a primeira.

:::

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--defaults-group-suffix=str`

Leia não apenas os grupos de opções usuais, mas também os grupos com os nomes usuais e um sufixo de \* `str` \*. Por exemplo, \*\* mysqld \*\* normalmente lê o grupo `[mysqld]` . Se esta opção for dada como `--defaults-group-suffix=_other`, \*\* mysqld \*\* também lê o grupo `[mysqld_other]`.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--early-plugin-load=plugin_list`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--early-plugin-load=plugin_list</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>empty string</code>]]</td> </tr></tbody></table>

Esta opção diz ao servidor quais plugins devem ser carregados antes de carregar os plugins integrados obrigatórios e antes da inicialização do motor de armazenamento. O carregamento antecipado é suportado apenas para plugins compilados com `PLUGIN_OPT_ALLOW_EARLY`. Se várias `--early-plugin-load` opções forem dadas, apenas a última será aplicada.

O valor da opção é uma lista separada por pontos e vírgulas de \* `plugin_library` \* e \* `name` \* `=` \* `plugin_library` \* valores. Cada \* `plugin_library` \* é o nome de um arquivo de biblioteca que contém código de plugin, e cada \* `name` \* é o nome de um plugin para carregar. Se uma biblioteca de plugin é nomeada sem qualquer nome de plugin anterior, o servidor carrega todos os plugins na biblioteca. Com um nome de plugin anterior, o servidor carrega apenas o plugin nomeado da biblioteca. O servidor procura arquivos de biblioteca de plugins no diretório nomeado pela variável do sistema `plugin_dir`.

Por exemplo, se os plugins nomeados `myplug1` e `myplug2` estão contidos nos arquivos da biblioteca de plugins `myplug1.so` e `myplug2.so`, use esta opção para executar um carregamento precoce do plugin:

```
mysqld --early-plugin-load="myplug1=myplug1.so;myplug2=myplug2.so"
```

As citações cercam o valor do argumento porque, de outra forma, alguns intérpretes de comando interpretam o ponto-e-vírgula (\[`;`]]) como um caractere especial. (Por exemplo, as shells do Unix tratam-no como um terminador de comando.)

Cada plugin nomeado é carregado cedo para uma única invocação de `mysqld` apenas. Após uma reinicialização, o plugin não é carregado cedo a menos que `--early-plugin-load` seja usado novamente.

Se o servidor for iniciado usando `--initialize` ou `--initialize-insecure`, os plugins especificados por `--early-plugin-load` não serão carregados.

Se o servidor é executado com `--help`, os plugins especificados por `--early-plugin-load` são carregados, mas não inicializados. Este comportamento garante que as opções do plugin são exibidas na mensagem de ajuda.

A criptografia do espaço de tabelas `InnoDB` depende do MySQL Keyring para o gerenciamento de chaves de criptografia, e o plugin de keyring a ser usado deve ser carregado antes da inicialização do mecanismo de armazenamento para facilitar a recuperação de tabelas criptografadas. Por exemplo, os administradores que desejam que o plugin `keyring_okv` seja carregado no início devem usar `--early-plugin-load` com o valor de opção apropriado (como `keyring_okv.so` em sistemas Unix e Unix-like ou `keyring_okv.dll` no Windows).

Para informações sobre a criptografia de tablespace, veja Seção 17.13, InnoDB Data-at-Rest Encryption. Para informações gerais sobre o carregamento de plugins, veja Seção 7.6.1, Instalar e Desinstalar Plugins.

::: info Note

Para o MySQL Keyring, essa opção é usada apenas quando o keystore é gerenciado com um plugin de keyring. Se o gerenciamento do keystore usar um componente de keyring em vez de um plugin, especifique o carregamento do componente usando um arquivo de manifesto; veja Seção 8.4.4.2, Instalação do Componente de Keyring.

:::

- `--exit-info[=flags]`, `-T [flags]`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--exit-info[=flags]</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr></tbody></table>

Esta é uma máscara de bits de diferentes bandeiras que você pode usar para depurar o servidor `mysqld`. Não use esta opção a menos que você saiba *exatamente* o que ela faz!

- `--external-locking`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--external-locking[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Ativar bloqueio externo (bloqueio do sistema), que é desativado por padrão. Se você usar essa opção em um sistema no qual o `lockd` não funciona completamente (como o Linux), é fácil para o `mysqld` bloquear.

Para desativar o bloqueio externo explicitamente, use `--skip-external-locking`.

O bloqueio externo afeta apenas o acesso à tabela `MyISAM`.Para mais informações, incluindo as condições sob as quais ele pode e não pode ser usado, consulte a Seção 10.11.5, Ferramento externo.

- `--flush`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--flush[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>flush</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Flush (sincronizar) todas as alterações no disco após cada instrução SQL. Normalmente, o MySQL faz uma gravação de todas as alterações no disco somente após cada instrução SQL e deixa o sistema operacional lidar com a sincronização no disco. Veja Seção B.3.3.3, "O que fazer se o MySQL continuar a falhar".

::: info Note

Se `--flush` for especificado, o valor de `flush_time` não importa e as alterações em `flush_time` não têm efeito no comportamento do flush.

:::

- `--gdb`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--gdb[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Instale um manipulador de interrupção para `SIGINT` (necessário para parar `mysqld` com `^C` para definir breakpoints) e desative o rastreamento de pilha e o manuseio de arquivos do núcleo. Veja Seção 7.9.1.4, Debugging mysqld em gdb.

No Windows, essa opção também suprime o forking que é usado para implementar a instrução `RESTART`: Forking permite que um processo atue como um monitor para o outro, que atua como o servidor. No entanto, o forking torna mais difícil determinar o processo do servidor para se conectar para depuração, então iniciar o servidor com `--gdb` suprime o forking. Para um servidor iniciado com essa opção, `RESTART` simplesmente sai e não é reiniciado.

Em configurações não de depuração, `--no-monitor` pode ser usado para suprimir o processo de bifurcação do monitor.

- `--initialize`, `-I`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--initialize[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Esta opção é usada para inicializar uma instalação do MySQL criando o diretório de dados e preenchendo as tabelas no esquema do sistema `mysql`.

Esta opção limita os efeitos de, ou não é compatível com, um número de outras opções de inicialização para o servidor MySQL. Alguns dos problemas mais comuns deste tipo são observados aqui:

- Recomendamos fortemente, ao inicializar o diretório de dados com `--initialize`, que você não especifique opções adicionais além de `--datadir`, outras opções usadas para definir locais de diretório como `--basedir`, e possivelmente `--user`, se necessário. Opções para o servidor MySQL em execução podem ser especificadas ao iniciá-lo uma vez que a inicialização tenha sido concluída e `mysqld` tenha sido desligado. Isso também se aplica ao usar `--initialize-insecure` em vez de `--initialize`.
- Quando o servidor é iniciado com `--initialize`, algumas funcionalidades não estão disponíveis que limitam as instruções permitidas em qualquer arquivo nomeado pela variável do sistema `init_file`.
- A opção `--ndbcluster` é ignorada quando usada em conjunto com `--initialize`.
- `--initialize` é mutuamente exclusivo com `--bootstrap` e `--daemonize`.

Os itens da lista anterior também se aplicam ao inicializar o servidor usando a opção `--initialize-insecure`.

- `--initialize-insecure`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--initialize-insecure[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Esta opção é usada para inicializar uma instalação do MySQL criando o diretório de dados e preenchendo as tabelas no esquema do sistema `mysql`. Esta opção implica `--initialize`, e as mesmas restrições e limitações se aplicam; para mais informações, consulte a descrição dessa opção e a Seção 2.9.1, Initializando o Diretório de Dados.

Advertência

Esta opção cria um usuário MySQL `root` com uma senha vazia, que é insegura. Por esta razão, não a use em produção sem definir essa senha manualmente. Veja Post-Initialization root Password Assignment, para informações sobre como fazer isso.

- `--innodb-xxx`

  Defina uma opção para o motor de armazenamento `InnoDB`. As opções `InnoDB` estão listadas na Seção 17.14, Opções de inicialização do InnoDB e Variaveis do sistema.

- `--install [service_name]`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--install [service_name]</code>]]</td> </tr><tr><th>Específicos da plataforma</th> <td>Vidros</td> </tr></tbody></table>

  (Somente Windows) Instale o servidor como um serviço do Windows que começa automaticamente durante a inicialização do Windows. O nome do serviço padrão é `MySQL` se não for dado nenhum valor `service_name`. Para mais informações, consulte a Seção 2.3.3.8, Início do MySQL como um Serviço do Windows.

  ::: info Note

  Se o servidor é iniciado com as opções `--defaults-file` e `--install`, `--install` deve ser o primeiro.

  :::

- `--install-manual [service_name]`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--install-manual [service_name]</code>]]</td> </tr><tr><th>Específicos da plataforma</th> <td>Vidros</td> </tr></tbody></table>

  (Somente Windows) Instale o servidor como um serviço do Windows que deve ser iniciado manualmente. Ele não inicia automaticamente durante a inicialização do Windows. O nome do serviço padrão é `MySQL` se nenhum valor `service_name` for dado. Para mais informações, consulte a Seção 2.3.3.8, Instalar o MySQL como um Serviço do Windows.

  ::: info Note

  Se o servidor é iniciado com as opções `--defaults-file` e `--install-manual`, `--install-manual` deve ser o primeiro.

  :::

- `--large-pages`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--large-pages[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>large_pages</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Específicos da plataforma</th> <td>Linux (em inglês)</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Algumas arquiteturas de hardware / sistema operacional suportam páginas de memória maiores do que o padrão (geralmente 4KB). A implementação real deste suporte depende do hardware e do sistema operacional subjacentes.

O MySQL suporta a implementação do Linux de suporte de páginas grandes (que é chamado HugeTLB no Linux). Veja a Seção 10.12.3.3, "Enabling Large Page Support". Para o suporte do Solaris de páginas grandes, veja a descrição da opção `--super-large-pages`.

`--large-pages` está desativado por padrão.

- `--lc-messages=locale_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--lc-messages=name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>lc_messages</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>en_US</code>]]</td> </tr></tbody></table>

O local a ser usado para mensagens de erro. O padrão é `en_US`. O servidor converte o argumento em um nome de idioma e combina-o com o valor de `--lc-messages-dir` para produzir a localização para o arquivo de mensagem de erro. Veja Seção 12.12,  Configuração da linguagem da mensagem de erro.

- `--lc-messages-dir=dir_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--lc-messages-dir=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>lc_messages_dir</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Nome do diretório</td> </tr></tbody></table>

O diretório onde as mensagens de erro estão localizadas. O servidor usa o valor juntamente com o valor de `--lc-messages` para produzir a localização para o arquivo da mensagem de erro. Veja Seção 12.12,  Configuração da linguagem da mensagem de erro.

- `--local-service`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--local-service</code>]]</td> </tr></tbody></table>

(Somente Windows) Uma opção `--local-service` após o nome do serviço faz com que o servidor seja executado usando a conta `LocalService` do Windows que tem privilégios de sistema limitados. Se ambos `--defaults-file` e `--local-service` forem dados após o nome do serviço, eles podem estar em qualquer ordem. Veja Seção 2.3.3.8, Início do MySQL como um Serviço Windows.

- `--log-error[=file_name]`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--log-error[=file_nam<code>log_error</code></code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>log_error</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr></tbody></table>

Defina o destino padrão do log de erro para o arquivo nomeado. Isso afeta sinks de log que baseiam seu próprio destino de saída no destino padrão. Veja Seção 7.4.2, O Log de Erro.

Se a opção não nomeia nenhum arquivo, o destino padrão do registro de erros em Unix e sistemas semelhantes a Unix é um arquivo chamado `host_name.err` no diretório de dados. O destino padrão no Windows é o mesmo, a menos que a opção `--pid-file` seja especificada. Nesse caso, o nome do arquivo é o nome do arquivo de base PID com um sufixo de `.err` no diretório de dados.

Se a opção nomear um arquivo, o destino padrão é esse arquivo (com um sufixo `.err` adicionado se o nome não tiver sufixo), localizado sob o diretório de dados, a menos que um nome de caminho absoluto seja dado para especificar um local diferente.

Se a saída do log de erros não puder ser redirecionada para o arquivo de log de erros, ocorre um erro e a inicialização falha.

No Windows, `--console` tem precedência sobre `--log-error` se ambos forem dados. Neste caso, o destino padrão do registro de erros é o console em vez de um arquivo.

- `--log-isam[=file_name]`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--log-isam[=file_name]</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr></tbody></table>

Registre todas as alterações do `MyISAM` neste arquivo (usado apenas quando depurar o `MyISAM`).

- `--log-raw`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--log-raw[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>log_raw</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

As senhas em certas instruções escritas no registro de consulta geral, registro de consulta lenta e registro binário são reescritas pelo servidor para não ocorrer literalmente em texto simples. A reescritura de senhas pode ser suprimida para o registro de consulta geral iniciando o servidor com a opção `--log-raw`. Esta opção pode ser útil para fins de diagnóstico, para ver o texto exato das instruções recebidas pelo servidor, mas por razões de segurança não é recomendada para uso em produção.

Se um plugin de reescrita de consulta for instalado, a opção `--log-raw` afeta o registro de instruções da seguinte forma:

- Sem `--log-raw`, o servidor registra a instrução retornada pelo plugin de reescrita de consulta. Isso pode diferir da instrução recebida.
- Com `--log-raw`, o servidor registra a instrução original como recebida.

Para obter mais informações, ver a secção 8.1.2.3, "Padrões de acesso e registo".

- `--log-short-format`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--log-short-format[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Registre menos informações no registo de consultas lentas, se este tiver sido ativado.

- `--log-tc=file_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--log-tc=file_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>tc.log</code>]]</td> </tr></tbody></table>

O nome do arquivo de log do coordenador de transações mapeado na memória (para transações XA que afetam vários mecanismos de armazenamento quando o log binário é desativado). O nome padrão é `tc.log`. O arquivo é criado sob o diretório de dados se não for fornecido como um nome de caminho completo. Esta opção não é usada.

- `--log-tc-size=size`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--log-tc-size=#</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>6 * page size</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>6 * page size</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>

O tamanho em bytes do log do coordenador de transacções mapeado na memória. Os valores padrão e mínimos são 6 vezes o tamanho da página, e o valor deve ser um múltiplo do tamanho da página.

- `--memlock`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--memlock[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Bloqueie o processo `mysqld` na memória. Esta opção pode ajudar se você tiver um problema em que o sistema operacional está causando `mysqld` para trocar para disco.

O `--memlock` funciona em sistemas que suportam a chamada de sistema `mlockall()`; isso inclui o Solaris, a maioria das distribuições Linux que usam um kernel 2.4 ou superior e talvez outros sistemas Unix. Em sistemas Linux, você pode dizer se o `mlockall()` (e, portanto, essa opção) é suportado ou não verificando se ele está definido no arquivo do sistema `mman.h`, assim:

```
$> grep mlockall /usr/include/sys/mman.h
```

Se `mlockall()` for suportado, você deve ver na saída do comando anterior algo como o seguinte:

```
extern int mlockall (int __flags) __THROW;
```

Importância

O uso desta opção pode exigir que você execute o servidor como `root`, o que, por razões de segurança, normalmente não é uma boa idéia. Veja Seção 8.1.5, "Como executar o MySQL como um usuário normal".

No Linux e talvez em outros sistemas, você pode evitar a necessidade de executar o servidor como `root` alterando o arquivo `limits.conf`.

Você não deve usar esta opção em um sistema que não suporta a chamada de sistema `mlockall()`; se você fizer isso, é muito provável que `mysqld` saia assim que você tentar iniciá-lo.

- `--myisam-block-size=N`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--myisam-block-size=#</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>1024</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1024</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>16384</code>]]</td> </tr></tbody></table>

O tamanho do bloco a ser usado para páginas de índice `MyISAM`.

- `--mysql-native-password`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--mysql-native-password={OFF|ON}</code>]]</td> </tr><tr><th>Depreciado</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Ativar o plug-in de autenticação `mysql_native_password`, que está desativado por padrão no MySQL 8.4.

Para obter mais informações, ver a secção 8.4.1.1, "Autenticação nativa conectável".

- `--no-defaults`

Não leia nenhum arquivo de opções. Se o programa não for iniciado devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para impedi-las de serem lidas. Esta deve ser a primeira opção na linha de comando, se for usada.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--no-monitor`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--no-monitor[={OFF|ON}]</code>]]</td> </tr><tr><th>Específicos da plataforma</th> <td>Vidros</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Esta opção suprime o forking que é usado para implementar a instrução `RESTART`: Forking permite que um processo atue como um monitor para o outro, que atua como o servidor. Para um servidor iniciado com esta opção, `RESTART` simplesmente sai e não é reiniciado.

- `--performance-schema-xxx`

  Configurar uma opção de esquema de desempenho.
- `--plugin-load=plugin_list`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--plugin-load=plugin_list</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Esta opção diz ao servidor para carregar os plugins nomeados na inicialização. Se várias opções de `--plugin-load` são dadas, apenas a última se aplica. Plugins adicionais para carregar podem ser especificados usando opções de `--plugin-load-add`.

O valor da opção é uma lista separada por pontos e vírgulas de \* `plugin_library` \* e \* `name` \* `=` \* `plugin_library` \* valores. Cada \* `plugin_library` \* é o nome de um arquivo de biblioteca que contém código de plugin, e cada \* `name` \* é o nome de um plugin para carregar. Se uma biblioteca de plugin é nomeada sem qualquer nome de plugin anterior, o servidor carrega todos os plugins na biblioteca. Com um nome de plugin anterior, o servidor carrega apenas o plugin nomeado da biblioteca. O servidor procura arquivos de biblioteca de plugins no diretório nomeado pela variável do sistema `plugin_dir`.

Por exemplo, se os plugins nomeados `myplug1` e `myplug2` estão contidos nos arquivos da biblioteca de plugins `myplug1.so` e `myplug2.so`, use esta opção para executar um carregamento precoce do plugin:

```
mysqld --plugin-load="myplug1=myplug1.so;myplug2=myplug2.so"
```

As citações cercam o valor do argumento porque, de outra forma, alguns intérpretes de comando interpretam o ponto-e-vírgula (\[`;`]]) como um caractere especial. (Por exemplo, as shells do Unix tratam-no como um terminador de comando.)

Cada plugin nomeado é carregado para uma única invocação de `mysqld` apenas. Após uma reinicialização, o plugin não é carregado a menos que `--plugin-load` seja usado novamente. Isto é em contraste com `INSTALL PLUGIN`, que adiciona uma entrada à tabela `mysql.plugins` para fazer com que o plugin seja carregado para cada inicialização normal do servidor.

Durante a sequência de inicialização normal, o servidor determina quais plugins devem ser carregados lendo a tabela de sistema `mysql.plugins`. Se o servidor for iniciado com a opção `--skip-grant-tables`, os plugins registrados na tabela `mysql.plugins` não serão carregados e não estarão disponíveis. `--plugin-load` permite que os plugins sejam carregados mesmo quando `--skip-grant-tables` é dado. `--plugin-load` também permite que os plugins sejam carregados na inicialização que não podem ser carregados no tempo de execução.

Esta opção não define uma variável do sistema correspondente. A saída de `SHOW PLUGINS` fornece informações sobre os plugins carregados. Informações mais detalhadas podem ser encontradas na tabela de Esquema de Informações `PLUGINS`.

Para obter informações adicionais sobre o carregamento de plugins, consulte a Seção 7.6.1, "Instalar e Desinstalar Plugins".

- `--plugin-load-add=plugin_list`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--plugin-load-add=plugin_list</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Esta opção complementa a `--plugin-load` opção. `--plugin-load-add` adiciona um plugin ou plugins para o conjunto de plugins a serem carregados na inicialização. O formato do argumento é o mesmo que para `--plugin-load`. `--plugin-load-add` pode ser usado para evitar especificar um grande conjunto de plugins como um único argumento `--plugin-load` longo e difícil de manusear.

`--plugin-load-add` pode ser dado na ausência de `--plugin-load`, mas qualquer instância de `--plugin-load-add` que apareça antes de `--plugin-load` não tem efeito porque `--plugin-load` redefine o conjunto de plugins para carregar. Em outras palavras, essas opções:

```
--plugin-load=x --plugin-load-add=y
```

são equivalentes a esta opção:

```
--plugin-load="x;y"
```

Mas estas opções:

```
--plugin-load-add=y --plugin-load=x
```

são equivalentes a esta opção:

```
--plugin-load=x
```

Esta opção não define uma variável do sistema correspondente. A saída de `SHOW PLUGINS` fornece informações sobre os plugins carregados. Informações mais detalhadas podem ser encontradas na tabela de Esquema de Informações `PLUGINS`.

Para obter informações adicionais sobre o carregamento de plugins, consulte a Seção 7.6.1, "Instalar e Desinstalar Plugins".

- `--plugin-xxx`

Especifica uma opção que pertence a um plug-in de servidor. Por exemplo, muitos motores de armazenamento podem ser construídos como plug-ins, e para esses motores, as opções para eles podem ser especificadas com um prefixo `--plugin`. Assim, a opção `--innodb-file-per-table` para `InnoDB` pode ser especificada como `--plugin-innodb-file-per-table`.

Para opções booleanas que podem ser ativadas ou desativadas, o prefixo `--skip` e outros formatos alternativos também são suportados (ver Seção 6.2.2.4, Modificadores de Opção de Programa). Por exemplo, `--skip-plugin-innodb-file-per-table` desativa `innodb-file-per-table`.

A lógica para o prefixo `--plugin` é que ele permite que as opções do plugin sejam especificadas de forma inequívoca se houver um conflito de nome com uma opção de servidor embutido. Por exemplo, se um escritor de plugin nomear um plugin sql e implementar uma opção mode, o nome da opção pode ser `--sql-mode`, o que entrará em conflito com a opção embutida do mesmo nome. Nesses casos, as referências ao nome conflituoso são resolvidas em favor da opção embutida. Para evitar a ambiguidade, os usuários podem especificar a opção do plugin como `--plugin-sql-mode`. O uso do prefixo `--plugin` para opções do plugin é recomendado para evitar qualquer questão de ambiguidade.

- `--port=port_num`, `-P port_num`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--port=port_num</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>port</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>3306</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>

O número de porta a ser usado ao ouvir para conexões TCP/IP. Em sistemas Unix e semelhantes a Unix, o número de porta deve ser 1024 ou superior, a menos que o servidor seja iniciado pelo usuário do sistema operacional `root`. A configuração desta opção em 0 faz com que o valor padrão seja usado.

- `--port-open-timeout=num`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--port-open-timeout=#</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>0</code>]]</td> </tr></tbody></table>

Em alguns sistemas, quando o servidor é parado, a porta TCP/IP pode não estar disponível imediatamente. Se o servidor for reiniciado rapidamente depois, sua tentativa de reabrir a porta pode falhar. Esta opção indica quantos segundos o servidor deve esperar para que a porta TCP/IP se torne livre se não puder ser aberta. O padrão é não esperar.

- `--print-defaults`

Imprima o nome do programa e todas as opções que ele obtém dos arquivos de opções. Os valores de senha são mascarados. Esta deve ser a primeira opção na linha de comando, se for usada, exceto que pode ser usada imediatamente após `--defaults-file` ou `--defaults-extra-file`.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--remove [service_name]`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--remove [service_name]</code>]]</td> </tr><tr><th>Específicos da plataforma</th> <td>Vidros</td> </tr></tbody></table>

  (Somente Windows) Remover um serviço MySQL Windows. O nome do serviço padrão é `MySQL` se não for dado nenhum valor `service_name`. Para mais informações, consulte a Seção 2.3.3.8, Início do MySQL como um Serviço Windows.
- `--safe-user-create`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--safe-user-create[={OFF|ON}]</code>]]</td> </tr><tr><th>Depreciado</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Se esta opção estiver habilitada, um usuário não pode criar novos usuários do MySQL usando a instrução `GRANT` a menos que o usuário tenha o privilégio `INSERT` para a tabela do sistema `mysql.user` ou qualquer coluna na tabela. Se você quiser que um usuário tenha a capacidade de criar novos usuários que tenham os privilégios que o usuário tem o direito de conceder, você deve conceder ao usuário o seguinte privilégio:

```
GRANT INSERT(user) ON mysql.user TO 'user_name'@'host_name';
```

Isso garante que o usuário não possa alterar diretamente nenhuma coluna de privilégios, mas tem que usar a instrução `GRANT` para dar privilégios a outros usuários.

- `--skip-grant-tables`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--skip-grant-tables[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Esta opção afeta a sequência de inicialização do servidor:

- `--skip-grant-tables` faz com que o servidor não leia as tabelas de concessão no esquema do sistema `mysql`, e assim inicie sem usar o sistema de privilégios. Isso dá a qualquer pessoa com acesso ao servidor \* acesso irrestrito a todos os bancos de dados \*.

```
Because starting the server with `--skip-grant-tables` disables authentication checks, the server also disables remote connections in that case by enabling `skip_networking`.
```

```
To cause a server started with `--skip-grant-tables` to load the grant tables at runtime, perform a privilege-flushing operation, which can be done in these ways:

- Issue a MySQL `FLUSH PRIVILEGES` statement after connecting to the server.
- Execute a **mysqladmin flush-privileges** or `mysqladmin reload` command from the command line.

Privilege flushing might also occur implicitly as a result of other actions performed after startup, thus causing the server to start using the grant tables. For example, the server flushes the privileges if it performs an upgrade during the startup sequence.
```

- `--skip-grant-tables` desativa o rastreamento de logon falhado e o bloqueio temporário da conta porque esses recursos dependem das tabelas de concessão.
- `--skip-grant-tables` faz com que o servidor não carregue certos outros objetos registrados no dicionário de dados ou no esquema do sistema `mysql`:

```
- Scheduled events installed using `CREATE EVENT` and registered in the `events` data dictionary table.
```

```
- Plugins installed using `INSTALL PLUGIN` and registered in the `mysql.plugin` system table.

  To cause plugins to be loaded even when using `--skip-grant-tables`, use the  `--plugin-load` or  `--plugin-load-add` option.
- Loadable functions installed using `CREATE FUNCTION` and registered in the `mysql.func` system table.

 `--skip-grant-tables` does *not* suppress loading during startup of components.
```

- `--skip-grant-tables` faz com que a variável do sistema `disabled_storage_engines` não tenha efeito.

* `--skip-new`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--skip-new</code>]]</td> </tr><tr><th>Depreciado</th> <td>Sim , sim .</td> </tr></tbody></table>

Esta opção desativa (o que costumava ser considerado) novos comportamentos possivelmente inseguros. Ele resulta nestas configurações: `delay_key_write=OFF`, `concurrent_insert=NEVER`, `automatic_sp_privileges=OFF`. Ele também faz com que `OPTIMIZE TABLE` seja mapeado para `ALTER TABLE` para motores de armazenamento para os quais `OPTIMIZE TABLE` não é suportado.

Esta opção está desatualizada e sujeita a remoção em uma versão futura.

- `--skip-show-database`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--skip-show-database</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>skip_show_database</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Esta opção define a variável de sistema `skip_show_database` que controla quem tem permissão para usar a instrução `SHOW DATABASES`.

- `--skip-stack-trace`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--skip-stack-trace</code>]]</td> </tr></tbody></table>

Não escreva traços de pilha. Esta opção é útil quando você está executando `mysqld` sob um depurador. Em alguns sistemas, você também deve usar esta opção para obter um arquivo de núcleo. Veja Seção 7.9, "Debugging MySQL".

- `--slow-start-timeout=timeout`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--slow-start-timeout=#</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>15000</code>]]</td> </tr></tbody></table>

Esta opção controla o tempo de espera do gerenciador de controle de serviços do Windows. O valor é o número máximo de milissegundos que o gerenciador de controle de serviços espera antes de tentar matar o serviço windows durante a inicialização. O valor padrão é 15000 (15 segundos). Se o serviço MySQL demorar muito para iniciar, você pode precisar aumentar este valor. Um valor de 0 significa que não há tempo de espera.

- `--socket=path`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--socket={file_name|pipe_name}</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>socket</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor padrão (Windows)</th> <td>[[<code>MySQL</code>]]</td> </tr><tr><th>Valor padrão (outras)</th> <td>[[<code>/tmp/mysql.sock</code>]]</td> </tr></tbody></table>

No Unix, esta opção especifica o arquivo de soquete do Unix a ser usado ao ouvir conexões locais. O valor padrão é `/tmp/mysql.sock`. Se esta opção for dada, o servidor cria o arquivo no diretório de dados, a menos que seja dado um nome de caminho absoluto para especificar um diretório diferente. No Windows, a opção especifica o nome do tubo a ser usado ao ouvir conexões locais que usam um tubo nomeado. O valor padrão é `MySQL` (não sensível a maiúsculas e minúsculas).

- \[`--sql-mode=value[,value[,value...]]`]{server-options.html#option\_mysqld\_sql-mode}

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[PH_HTML_CODE_<code>NO_BACKSLASH_ESCAPES</code>]</td> </tr><tr><th>Variável do sistema</th> <td>[[PH_HTML_CODE_<code>NO_BACKSLASH_ESCAPES</code>]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[PH_HTML_CODE_<code>NO_ENGINE_SUBSTITUTION</code>] Sugestão Aplica</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Conjunto</td> </tr><tr><th>Valor por defeito</th> <td>[[PH_HTML_CODE_<code>NO_UNSIGNED_SUBTRACTION</code>]</td> </tr><tr><th>Valores válidos</th> <td><p>[[PH_HTML_CODE_<code>NO_ZERO_DATE</code>]</p><p>[[PH_HTML_CODE_<code>NO_ZERO_IN_DATE</code>]</p><p>[[PH_HTML_CODE_<code>ONLY_FULL_GROUP_BY</code>]</p><p>[[PH_HTML_CODE_<code>PAD_CHAR_TO_FULL_LENGTH</code>]</p><p>[[PH_HTML_CODE_<code>PIPES_AS_CONCAT</code>]</p><p>[[PH_HTML_CODE_<code>REAL_AS_FLOAT</code>]</p><p>[[<code>NO_BACKSLASH_ESCAPES</code>]]</p><p>[[<code>sql_mode</code><code>NO_BACKSLASH_ESCAPES</code>]</p><p>[[<code>NO_ENGINE_SUBSTITUTION</code>]]</p><p>[[<code>NO_UNSIGNED_SUBTRACTION</code>]]</p><p>[[<code>NO_ZERO_DATE</code>]]</p><p>[[<code>NO_ZERO_IN_DATE</code>]]</p><p>[[<code>ONLY_FULL_GROUP_BY</code>]]</p><p>[[<code>PAD_CHAR_TO_FULL_LENGTH</code>]]</p><p>[[<code>PIPES_AS_CONCAT</code>]]</p><p>[[<code>REAL_AS_FLOAT</code>]]</p><p>[[<code>SET_VAR</code><code>NO_BACKSLASH_ESCAPES</code>]</p><p>[[<code>SET_VAR</code><code>NO_BACKSLASH_ESCAPES</code>]</p><p>[[<code>SET_VAR</code><code>NO_ENGINE_SUBSTITUTION</code>]</p></td> </tr></tbody></table>

  Configurar o modo SQL. Ver Secção 7.1.11, "Server SQL Modes".

  ::: info Note

  Os programas de instalação do MySQL podem configurar o modo SQL durante o processo de instalação.

  Se o modo SQL difere do padrão ou do que você espera, verifique se há uma configuração em um arquivo de opções que o servidor lê no início.

  :::
- `--standalone`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--standalone</code>]]</td> </tr><tr><th>Específicos da plataforma</th> <td>Vidros</td> </tr></tbody></table>

Disponível apenas no Windows; instrui o servidor MySQL para não ser executado como um serviço.

- `--super-large-pages`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--super-large-pages[={OFF|ON}]</code>]]</td> </tr><tr><th>Específicos da plataforma</th> <td>Solaris</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

O uso padrão de páginas grandes no MySQL tenta usar o maior tamanho suportado, até 4MB. No Solaris, um recurso de "super páginas grandes" permite o uso de páginas de até 256MB. Este recurso está disponível para plataformas SPARC recentes. Ele pode ser ativado ou desativado usando a opção `--super-large-pages` ou `--skip-super-large-pages`.

- `--symbolic-links`, `--skip-symbolic-links`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--symbolic-links[={OFF|ON}]</code>]]</td> </tr><tr><th>Depreciado</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Ativar ou desativar o suporte de links simbólicos. No Unix, ativar links simbólicos significa que você pode vincular um arquivo de índice ou arquivo de dados `MyISAM` a outro diretório com a opção `INDEX DIRECTORY` ou `DATA DIRECTORY` da instrução `CREATE TABLE`. Se você excluir ou renomear a tabela, os arquivos aos quais seus links simbólicos apontam também serão excluídos ou renomeados. Veja Seção 10.12.2.2, Using Symbolic Links for MyISAM Tables on Unix.

::: info Note

O suporte ao link simbólico, juntamente com a opção `--symbolic-links` que o controla, está desatualizado; você deve esperar que ele seja removido em uma versão futura do MySQL. Além disso, a opção está desativada por padrão. A variável de sistema `have_symlink` relacionada também está desatualizada; espere que seja removida em uma versão futura do MySQL.

:::

Esta opção não tem significado no Windows.

- `--sysdate-is-now`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--sysdate-is-now[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

`SYSDATE()` por padrão retorna a hora em que ele é executado, e não a hora em que a instrução em que ocorre começa a ser executada. Isso difere do comportamento de `NOW()`. Esta opção faz com que `SYSDATE()` seja um sinônimo de `NOW()`. Para informações sobre as implicações para o registro binário e replicação, consulte a descrição de `SYSDATE()` na Seção 14.7,  Funções de Data e Tempo e para `SET TIMESTAMP` na Seção 7.1.8,  Variabilidades do Sistema do Servidor.

- `--tc-heuristic-recover={COMMIT|ROLLBACK}`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--tc-heuristic-recover=name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Enumeração</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>COMMIT</code>]]</p><p>[[<code>ROLLBACK</code>]]</p></td> </tr></tbody></table>

A decisão de utilizar uma recuperação heurística manual.

Se uma opção `--tc-heuristic-recover` for especificada, o servidor sairá independentemente de a recuperação heurística manual ser bem-sucedida.

Em sistemas com mais de um motor de armazenamento capaz de commit de duas fases, a opção `ROLLBACK` não é segura e faz com que a recuperação pare com o seguinte erro:

```
[ERROR] --tc-heuristic-recover rollback
strategy is not safe on systems with more than one 2-phase-commit-capable
storage engine. Aborting crash recovery.
```

- `--transaction-isolation=level`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--transaction-isolation=name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>transaction_isolation</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Enumeração</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>REPEATABLE-READ</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>READ-UNCOMMITTED</code>]]</p><p>[[<code>READ-COMMITTED</code>]]</p><p>[[<code>REPEATABLE-READ</code>]]</p><p>[[<code>SERIALIZABLE</code>]]</p></td> </tr></tbody></table>

Define o nível de isolamento da transação padrão. O valor `level` pode ser `READ-UNCOMMITTED`, `READ-COMMITTED`, `REPEATABLE-READ`, ou `SERIALIZABLE`.

O nível de isolamento de transação padrão também pode ser definido no tempo de execução usando a instrução `SET TRANSACTION` ou definindo a variável de sistema `transaction_isolation`.

- `--transaction-read-only`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--transaction-read-only[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>transaction_read_only</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Define o modo de acesso de transação padrão. Por padrão, o modo de somente leitura está desativado, portanto o modo é de leitura/escrita.

Para definir o modo de acesso de transação padrão no tempo de execução, use a instrução `SET TRANSACTION` ou defina a variável de sistema `transaction_read_only`.

- `--tmpdir=dir_name`, `-t dir_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--tmpdir=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>tmpdir</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Nome do diretório</td> </tr></tbody></table>

O caminho do diretório a ser usado para criar arquivos temporários. Pode ser útil se o seu diretório padrão `/tmp` reside em uma partição que é muito pequena para armazenar tabelas temporárias. Esta opção aceita vários caminhos que são usados de forma round-robin. Os caminhos devem ser separados por caracteres de ponto e vírgula (`:`) no Unix e caracteres de ponto e vírgula (`;`) no Windows.

O `--tmpdir` pode ser um local não-permanente, como um diretório em um sistema de arquivos baseado em memória ou um diretório que é limpo quando o servidor hospedeiro é reiniciado. Se o servidor MySQL estiver agindo como uma réplica, e você estiver usando um local não-permanente para o `--tmpdir`, considere definir um diretório temporário diferente para a réplica usando a variável do sistema `replica_load_tmpdir`. Para uma réplica, os arquivos temporários usados para replicar as instruções `LOAD DATA` são armazenados neste diretório, então com um local permanente eles podem sobreviver às reinicializações da máquina, embora a replicação possa continuar após uma reinicialização se os arquivos temporários forem removidos.

Para mais informações sobre o local de armazenamento dos ficheiros temporários, ver Secção B.3.3.5, "Onde o MySQL armazena ficheiros temporários".

- `--upgrade=value`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--upgrade=value</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Enumeração</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>AUTO</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>AUTO</code>]]</p><p>[[<code>NONE</code>]]</p><p>[[<code>MINIMAL</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

Esta opção controla se e como o servidor executa uma atualização automática na inicialização.

- Etapa 1: Atualização do dicionário de dados.

  Esta etapa atualiza:

  - As tabelas do dicionário de dados no esquema `mysql`. Se a versão real do dicionário de dados for inferior à versão esperada atual, o servidor atualiza o dicionário de dados. Se não puder ou for impedido de fazê-lo, o servidor não poderá ser executado.
  - O Esquema de Desempenho e o `INFORMATION_SCHEMA`.
- Passo 2: Atualização do servidor.

  Esta etapa inclui todas as outras tarefas de atualização. Se os dados de instalação existentes tiverem uma versão MySQL menor do que o servidor espera, ela deve ser atualizada:

  - As tabelas do sistema no esquema \[`mysql`] (as restantes tabelas não pertencentes ao dicionário de dados).
  - O `sys` esquema.
  - Esquemas de utilizador.

Para detalhes sobre as etapas de atualização 1 e 2, consulte a Seção 3.4, "O que o processo de atualização do MySQL atualiza".

São permitidos os seguintes valores de opção \[`--upgrade`]:

- `AUTO`

  O servidor executa uma atualização automática de qualquer coisa que achar desatualizada (passos 1 e 2). Esta é a ação padrão se `--upgrade` não for especificada explicitamente.
- `NONE`

  O servidor não executa etapas de atualização automática durante o processo de inicialização (salta as etapas 1 e 2). Como este valor de opção impede uma atualização do dicionário de dados, o servidor sai com um erro se o dicionário de dados for desatualizado:

  ```
  [ERROR] [MY-013381] [Server] Server shutting down because upgrade is
  required, yet prohibited by the command line option '--upgrade=NONE'.
  [ERROR] [MY-010334] [Server] Failed to initialize DD Storage Engine
  [ERROR] [MY-010020] [Server] Data Dictionary initialization failed.
  ```
- `MINIMAL`

  O servidor atualiza o dicionário de dados, o Esquema de Desempenho e o `INFORMATION_SCHEMA`, se necessário (etapa 1). Note que após uma atualização com esta opção, a Replicação de Grupo não pode ser iniciada, porque as tabelas do sistema das quais dependem os internos de replicação não são atualizadas e a funcionalidade reduzida também pode ser aparente em outras áreas.
- `FORCE`

  O servidor atualiza o dicionário de dados, o Esquema de Desempenho e o `INFORMATION_SCHEMA`, se necessário (etapa 1). Além disso, o servidor força uma atualização de tudo o mais (etapa 2).

  `FORCE` é útil para forçar a ação da etapa 2 a ser executada se o servidor achar que não é necessário. Por exemplo, você pode acreditar que uma tabela do sistema está faltando ou danificada e deseja forçar um reparo.

A tabela a seguir resume as ações tomadas pelo servidor para cada valor de opção.

  <table><col style="width: 20%"/><col style="width: 30%"/><col style="width: 30%"/><thead><tr> <th scope="col">Valor da opção</th> <th scope="col">Servidor executa o passo 1?</th> <th scope="col">Servidor executa o passo 2?</th> </tr></thead><tbody><tr> <th>[[<code>AUTO</code>]]</th> <td>Se necessário</td> <td>Se necessário</td> </tr><tr> <th>[[<code>NONE</code>]]</th> <td>Não .</td> <td>Não .</td> </tr><tr> <th>[[<code>MINIMAL</code>]]</th> <td>Se necessário</td> <td>Não .</td> </tr><tr> <th>[[<code>FORCE</code>]]</th> <td>Se necessário</td> <td>Sim , sim .</td> </tr></tbody></table>* [[`--user={user_name|user_id}`]], [[`-u {user_name|user_id}`]]

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--user=name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Execute o servidor `mysqld` como o usuário com o nome `user_name` ou o ID de usuário numérico `user_id`. (Usuário neste contexto refere-se a uma conta de login do sistema, não um usuário MySQL listado nas tabelas de concessão.)

Esta opção é obrigatória quando se inicia `mysqld` como `root`. O servidor muda sua ID de usuário durante sua sequência de inicialização, fazendo com que ele seja executado como esse usuário em particular em vez de como `root`.

Para evitar uma possível brecha de segurança em que um usuário adiciona uma opção `--user=root` a um arquivo `my.cnf` (fazendo com que o servidor seja executado como `root`), `mysqld` usa apenas a primeira opção `--user` especificada e produz um aviso se houver várias opções `--user`. As opções em `/etc/my.cnf` e `$MYSQL_HOME/my.cnf` são processadas antes das opções de linha de comando, por isso é recomendado que você coloque uma opção `--user` em `/etc/my.cnf` e especifique um valor diferente de `root`. A opção em `/etc/my.cnf` é encontrada antes de qualquer outra opção `--user`, o que garante que o servidor seja executado como um usuário diferente de `root`, e que um aviso se qualquer outra opção `--user` for encontrada.

- `--validate-config`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--validate-config[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Validar a configuração de inicialização do servidor. Se não forem encontrados erros, o servidor termina com um código de saída de 0. Se for encontrado um erro, o servidor exibe uma mensagem de diagnóstico e termina com um código de saída de 1. Mensagens de aviso e de informação também podem ser exibidas, dependendo do valor `log_error_verbosity`, mas não produzem terminação de validação imediata ou um código de saída de 1.

- `--validate-user-plugins[={OFF|ON}]`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--validate-user-plugins[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>

Se esta opção estiver habilitada (o padrão), o servidor verifica cada conta de usuário e produz um aviso se forem encontradas condições que tornem a conta inutilizável:

- A conta requer um plugin de autenticação que não está carregado.
- A conta requer o plug-in de autenticação `sha256_password` (obsoleto) ou `caching_sha2_password` mas o servidor foi iniciado sem SSL nem RSA habilitados como exigido pelo plugin.

A habilitação de `--validate-user-plugins` retarda a inicialização do servidor e `FLUSH PRIVILEGES`. Se você não precisar da verificação adicional, você pode desativar essa opção na inicialização para evitar a diminuição do desempenho.

- `--verbose`, `-v`

Use esta opção com a opção `--help` para obter ajuda detalhada.

- `--version`, `-V`

Informações de versão e saída.
