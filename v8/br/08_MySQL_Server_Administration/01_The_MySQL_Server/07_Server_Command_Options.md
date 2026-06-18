### 7.1.7 Opções de comando do servidor

Ao iniciar o servidor **mysqld**, você pode especificar opções de programa usando qualquer um dos métodos descritos na Seção 6.2.2, “Especificando Opções de Programa”. Os métodos mais comuns são fornecer opções em um arquivo de opções ou na linha de comando. No entanto, na maioria dos casos, é desejável garantir que o servidor use as mesmas opções cada vez que for executado. A melhor maneira de garantir isso é listá-las em um arquivo de opções. Veja a Seção 6.2.2.2, “Usando Arquivos de Opções”. Essa seção também descreve o formato e a sintaxe dos arquivos de opções.

O **mysqld** lê opções dos grupos `[mysqld]` e `[server]`. O **mysqld\_safe** lê opções dos grupos `[mysqld]`, `[server]`, `[mysqld_safe]` e `[safe_mysqld]`. O **mysql.server** lê opções dos grupos `[mysqld]` e `[mysql.server]`.

O **mysqld** aceita muitas opções de comando. Para um breve resumo, execute este comando:

```
mysqld --help
```

Para ver a lista completa, use este comando:

```
mysqld --verbose --help
```

Alguns dos itens da lista são, na verdade, variáveis do sistema que podem ser definidas na inicialização do servidor. Essas variáveis podem ser exibidas em tempo de execução usando a instrução `SHOW VARIABLES`. Alguns itens exibidos pelo comando anterior **mysqld** não aparecem na saída do `SHOW VARIABLES`; isso ocorre porque são apenas opções e não variáveis do sistema.

A lista a seguir mostra algumas das opções de servidor mais comuns. Outras opções são descritas em outras seções:

- Opções que afetam a segurança: Consulte a Seção 8.1.4, “Opções e variáveis do mysqld relacionadas à segurança”.

- Opções relacionadas ao SSL: Consulte Opções de comando para conexões criptografadas.

- Opções de controle do log binário: Consulte a Seção 7.4.4, “O Log Binário”.

- Opções relacionadas à replicação: Consulte a Seção 19.1.6, “Opções e variáveis de replicação e registro binário”.

- Opções para carregar plugins, como motores de armazenamento plugáveis: Consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

- Opções específicas para motores de armazenamento particulares: Consulte a Seção 17.14, “Opções de inicialização do InnoDB e variáveis do sistema” e a Seção 18.2.1, “Opções de inicialização do MyISAM”.

Algumas opções controlam o tamanho dos buffers ou caches. Para um buffer específico, o servidor pode precisar alocar estruturas de dados internas. Essas estruturas são tipicamente alocadas a partir da memória total alocada ao buffer, e a quantidade de espaço necessária pode depender da plataforma. Isso significa que, quando você atribui um valor a uma opção que controla o tamanho de um buffer, a quantidade de espaço realmente disponível pode diferir do valor atribuído. Em alguns casos, a quantidade pode ser menor que o valor atribuído. Também é possível que o servidor ajuste um valor para cima. Por exemplo, se você atribuir um valor de 0 a uma opção para a qual o valor mínimo é 1024, o servidor define o valor para 1024.

Os valores para tamanhos de tampão, comprimentos e tamanhos de pilha são fornecidos em bytes, a menos que especificado de outra forma.

Algumas opções aceitam valores de nome de arquivo. A menos que especificado de outra forma, a localização padrão do arquivo é o diretório de dados se o valor for um nome de caminho relativo. Para especificar a localização explicitamente, use um nome de caminho absoluto. Suponha que o diretório de dados seja `/var/mysql/data`. Se uma opção com valor de arquivo for fornecida como um nome de caminho relativo, ela estará localizada sob `/var/mysql/data`. Se o valor for um nome de caminho absoluto, sua localização será conforme o nome do caminho fornecido.

Você também pode definir os valores das variáveis do sistema do servidor no momento do início do servidor usando nomes de variáveis como opções. Para atribuir um valor a uma variável do sistema do servidor, use uma opção do formato `--var_name=value`. Por exemplo, `--sort_buffer_size=384M` define a variável `sort_buffer_size` para um valor de 384MB.

Quando você atribui um valor a uma variável, o MySQL pode corrigir automaticamente o valor para permanecer dentro de um determinado intervalo ou ajustar o valor para o valor mais próximo permitido, se apenas certos valores forem permitidos.

Para restringir o valor máximo ao qual uma variável de sistema pode ser definida em tempo de execução com a instrução `SET`, especifique esse máximo usando uma opção do tipo `--maximum-var_name=value` durante a inicialização do servidor.

Você pode alterar os valores da maioria das variáveis do sistema em tempo de execução com a instrução `SET`. Veja a Seção 15.7.6.1, “Sintaxe SET para atribuição de variáveis”.

A Seção 7.1.8, “Variáveis do Sistema do Servidor”, fornece uma descrição completa de todas as variáveis e informações adicionais para configurá-las durante o início e o funcionamento do servidor. Para obter informações sobre a alteração de variáveis de sistema, consulte a Seção 7.1.1, “Configurando o Servidor”.

- `--help`, `-?`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  Exiba uma breve mensagem de ajuda e saia. Use as opções `--verbose` e `--help` para ver a mensagem completa.

- `--admin-ssl`, `--skip-admin-ssl`

  <table summary="Propriedades para admin-ssl"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl[={OFF|ON}]</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Desatualizado</th> <td>8.0.26</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>

  A opção `--admin-ssl` é semelhante à opção `--ssl`, exceto que ela se aplica à interface de conexão administrativa em vez da interface de conexão principal. Para obter informações sobre essas interfaces, consulte a Seção 7.1.12.1, “Interfaces de Conexão”.

  A opção `--admin-ssl` especifica que o servidor permite, mas não exige, conexões criptografadas na interface administrativa. Esta opção está habilitada por padrão.

  `--admin-ssl` pode ser especificado na forma negada como `--skip-admin-ssl` ou um sinônimo (`--admin-ssl=OFF`, `--disable-admin-ssl`). Neste caso, a opção especifica que o servidor *não* permite conexões criptografadas, independentemente das configurações das variáveis de sistema `admin_tsl_xxx` e `admin_ssl_xxx`.

  A opção `--admin-ssl` tem efeito apenas na inicialização do servidor sobre se a interface administrativa suporta conexões criptografadas. Ela é ignorada e não tem efeito na operação do `ALTER INSTANCE RELOAD TLS` em tempo de execução. Por exemplo, você pode usar `--admin-ssl=OFF` para iniciar a interface administrativa com conexões criptografadas desativadas, depois reconfigurar o TLS e executar `ALTER INSTANCE RELOAD TLS FOR CHANNEL mysql_admin` para habilitar conexões criptografadas em tempo de execução.

  Para obter informações gerais sobre a configuração do suporte à criptografia de conexão, consulte a Seção 8.3.1, “Configurando o MySQL para usar conexões criptografadas”. Essa discussão é escrita para a interface de conexão principal, mas os nomes dos parâmetros são semelhantes para a interface de conexão administrativa. Considere definir pelo menos as variáveis de sistema `admin_ssl_cert` e `admin_ssl_key` no lado do servidor e a opção `--ssl-ca` (ou `--ssl-capath`) no lado do cliente. Para informações adicionais específicas sobre a interface administrativa, consulte Suporte à Interface Administrativa para Conexões Criptografadas.

  Como o suporte para conexões criptografadas está habilitado por padrão, normalmente não é necessário especificar `--admin-ssl`. A partir do MySQL 8.0.26, `--admin-ssl` está desatualizado e está sujeito à remoção em uma versão futura do MySQL. Se desejar desativar as conexões criptografadas, isso pode ser feito sem especificar `--admin-ssl` na forma negada. Defina a variável de sistema `admin_tls_version` no valor vazio para indicar que nenhuma versão do TLS é suportada. Por exemplo, essas linhas no arquivo do servidor `my.cnf` desativam as conexões criptografadas:

  ```
  [mysqld]
  admin_tls_version=''
  ```

- `--allow-suspicious-udfs`

  <table summary="Propriedades para permitir-udfs-suspeito"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--allow-suspicious-udfs[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  Esta opção controla se funções carregáveis que têm apenas o símbolo `xxx` para a função principal podem ser carregadas. Por padrão, a opção está desativada e apenas funções carregáveis que têm pelo menos um símbolo auxiliar podem ser carregadas; isso previne tentativas de carregar funções de arquivos de objeto compartilhado que não contenham funções legítimas. Veja as precauções de segurança para funções carregáveis.

- `--ansi`

  <table summary="Propriedades para ansi"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ansi</code>]]</td> </tr></tbody></table>

  Use a sintaxe SQL padrão (ANSI) em vez da sintaxe MySQL. Para um controle mais preciso sobre o modo SQL do servidor, use a opção `--sql-mode` em vez disso. Veja a Seção 1.6, “Conformidade com Padrões MySQL”, e a Seção 7.1.11, “Modos SQL do Servidor”.

- `--basedir=dir_name`, `-b dir_name`

  <table summary="Propriedades para basedir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--basedir=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>basedir</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>parent of mysqld installation directory</code>]]</td> </tr></tbody></table>

  O caminho para o diretório de instalação do MySQL. Esta opção define a variável de sistema `basedir`.

  O executável do servidor determina seu próprio nome de caminho completo no momento do início e usa o diretório pai em que ele está localizado como o valor padrão do `basedir`. Isso, por sua vez, permite que o servidor use esse `basedir` ao procurar informações relacionadas ao servidor, como o diretório `share` que contém mensagens de erro.

- `--character-set-client-handshake`

  <table summary="Propriedades para handshake de cliente de conjunto de caracteres"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-set-client-handshake[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.35</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>

  Não ignore as informações do conjunto de caracteres enviadas pelo cliente. Para ignorar as informações do cliente e usar o conjunto de caracteres padrão do servidor, use `--skip-character-set-client-handshake`.

  Esta opção foi descontinuada nas versões MySQL 8.0.35 e posteriores do MySQL 8.0, onde um aviso é emitido sempre que ela é usada, e deve ser removida em uma versão futura do MySQL. As aplicações que dependem desta opção devem começar a migrar para fora dela o mais rápido possível.

- `--check-table-functions=value`

  <table summary="Propriedades para funções de tabela de verificação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--check-table-functions=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.42</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ABORT</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>WARN</code>]]</p><p class="valid-value">[[<code>ABORT</code>]]</p></td> </tr></tbody></table>

  Ao realizar uma atualização do servidor, verificamos o dicionário de dados para funções usadas em restrições de tabela e outras expressões, incluindo expressões `DEFAULT`, expressões de particionamento e colunas virtuais. É possível que uma mudança no comportamento da função cause um erro na nova versão do servidor, onde nenhum erro semelhante ocorreu antes, caso em que a tabela não pode ser aberta. Esta opção oferece uma escolha sobre como lidar com tais problemas, de acordo com o qual dos dois valores mostrados aqui é usado:

  - `WARN`: Registre um aviso para cada tabela que não puder ser aberta.

  - `ABORT`: Registra também um aviso; além disso, a atualização é interrompida. Isso é o padrão. Para um valor suficientemente alto de `--log-error-verbosity`, ele também registra uma nota com uma definição de tabela simplificada, listando apenas aquelas expressões que potencialmente contêm funções SQL.

  O comportamento padrão é abortar a atualização, para que o usuário possa corrigir o problema usando a versão mais antiga do servidor, antes de atualizar para a versão mais recente. Use `WARN` para continuar a atualização no modo interativo enquanto relata quaisquer problemas.

  A opção `--check-table-functions` foi introduzida no MySQL 8.0.42.

- `--chroot=dir_name`, `-r dir_name`

  <table summary="Propriedades para chroot"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--chroot=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  Coloque o servidor **mysqld** em um ambiente fechado durante a inicialização usando a chamada de sistema `chroot()`. Esta é uma medida de segurança recomendada. O uso desta opção limita um pouco os `LOAD DATA` e `SELECT ... INTO OUTFILE`.

- `--console`

  <table summary="Propriedades para console"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--console</code>]]</td> </tr><tr><th>Específico da plataforma</th> <td>Windows</td> </tr></tbody></table>

  (Apenas para Windows.) Faça com que o destino padrão do log de erro seja o console. Isso afeta os pontos de destino de log que baseiam seu próprio destino de saída no destino padrão. Veja a Seção 7.4.2, “O Log de Erros”. O **mysqld** não fecha a janela do console se essa opção for usada.

  `--console` tem precedência sobre `--log-error` se ambos forem fornecidos.

- `--core-file`

  <table summary="Propriedades para arquivo de núcleo"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--core-file</code>]]</td> </tr></tbody></table>

  Quando esta opção for usada, escreva um arquivo de núcleo se o **mysqld** falhar; não são necessários (ou aceitos) argumentos. O nome e a localização do arquivo de núcleo dependem do sistema. No Linux, um arquivo de núcleo chamado `core.pid` é escrito no diretório de trabalho atual do processo, que, para o **mysqld**, é o diretório de dados. `pid` representa o ID do processo do processo do servidor. No macOS, um arquivo de núcleo chamado `core.pid` é escrito no diretório `/cores`. No Solaris, use o comando **coreadm** para especificar onde escrever o arquivo de núcleo e como nomeá-lo.

  Para alguns sistemas, para obter um arquivo de núcleo, você também deve especificar a opção `--core-file-size` para **mysqld\_safe**. Veja a Seção 6.3.2, “mysqld\_safe — Script de inicialização do servidor MySQL”. Em alguns sistemas, como o Solaris, você não obtém um arquivo de núcleo se estiver usando também a opção `--user`. Pode haver restrições ou limitações adicionais. Por exemplo, pode ser necessário executar **ulimit -c unlimited** antes de iniciar o servidor. Consulte a documentação do seu sistema.

  A variável `innodb_buffer_pool_in_core_file` pode ser usada para reduzir o tamanho dos arquivos de núcleo em sistemas operacionais que a suportam. Para mais informações, consulte a Seção 17.8.3.7, “Excluindo Páginas do Pool de Buffer dos Arquivos de Núcleo”.

- `--daemonize`, `-D`

  <table summary="Propriedades para admin-ssl"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl[={OFF|ON}]</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Desatualizado</th> <td>8.0.26</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>0

  Essa opção faz com que o servidor seja executado como um daemon tradicional, permitindo que ele trabalhe com sistemas operacionais que usam o systemd para controle de processos. Para mais informações, consulte a Seção 2.5.9, “Gerenciamento do servidor MySQL com o systemd”.

  `--daemonize` é mutuamente exclusiva com `--initialize` e `--initialize-insecure`.

  Se o servidor for iniciado usando a opção `--daemonize` e não estiver conectado a um dispositivo tty, uma opção padrão de registro de erros da opção `--log-error=""` será usada na ausência de uma opção de registro explícita, para direcionar a saída de erros para o arquivo de log padrão.

  `-D` é sinônimo de `--daemonize`.

- `--datadir=dir_name`, `-h dir_name`

  <table summary="Propriedades para admin-ssl"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl[={OFF|ON}]</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Desatualizado</th> <td>8.0.26</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>1

  O caminho para o diretório de dados do servidor MySQL. Esta opção define a variável de sistema `datadir`. Veja a descrição dessa variável.

- `--debug[=debug_options]`, `-# [debug_options]`

  <table summary="Propriedades para admin-ssl"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl[={OFF|ON}]</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Desatualizado</th> <td>8.0.26</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>2

  Se o MySQL estiver configurado com a opção `-DWITH_DEBUG=1` **CMake**, você pode usar essa opção para obter um arquivo de registro do que o **mysqld** está fazendo. Uma string típica `debug_options` é `d:t:o,file_name`. O padrão é `d:t:i:o,/tmp/mysqld.trace` no Unix e `d:t:i:O,\mysqld.trace` no Windows.

  Usar `-DWITH_DEBUG=1` para configurar o MySQL com suporte de depuração permite que você use a opção `--debug="d,parser_debug"` ao iniciar o servidor. Isso faz com que o analisador Bison, que é usado para processar instruções SQL, armazene uma trilha do analisador na saída padrão de erro do servidor. Normalmente, essa saída é escrita no log de erro.

  Esta opção pode ser dada várias vezes. Os valores que começam com `+` ou `-` são adicionados ou subtraídos do valor anterior. Por exemplo, `--debug=T` `--debug=+P` define o valor para `P:T`.

  Para mais informações, consulte a Seção 7.9.4, “O Pacote DBUG”.

- `--debug-sync-timeout[=N]`

  <table summary="Propriedades para admin-ssl"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl[={OFF|ON}]</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Desatualizado</th> <td>8.0.26</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>3

  Controla se a funcionalidade Debug Sync para testes e depuração está habilitada. O uso do Debug Sync requer que o MySQL seja configurado com a opção `-DWITH_DEBUG=ON` **CMake** (consulte a Seção 2.8.7, “Opções de Configuração de Código do MySQL”); caso contrário, essa opção não estará disponível. O valor da opção é um tempo de espera em segundos. O valor padrão é 0, o que desabilita o Debug Sync. Para ativá-lo, especifique um valor maior que 0; esse valor também se torna o tempo de espera padrão para pontos de sincronização individuais. Se a opção for fornecida sem um valor, o tempo de espera é definido para 300 segundos.

  Para uma descrição da funcionalidade Debug Sync e de como usar os pontos de sincronização, consulte MySQL Internals: Test Synchronization.

- `--default-time-zone=timezone`

  <table summary="Propriedades para admin-ssl"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl[={OFF|ON}]</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Desatualizado</th> <td>8.0.26</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>4

  Defina o fuso horário do servidor padrão. Esta opção define a variável de sistema global `time_zone`. Se esta opção não for fornecida, o fuso horário padrão será o mesmo do fuso horário do sistema (dado pelo valor da variável de sistema `system_time_zone`).

  A variável `system_time_zone` difere da `time_zone`. Embora possam ter o mesmo valor, a última variável é usada para inicializar o fuso horário para cada cliente que se conecta. Veja a Seção 7.1.15, “Suporte ao Fuso Horário do MySQL Server”.

- `--defaults-extra-file=file_name`

  Leia este arquivo de opção após o arquivo de opção global, mas (no Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou estiver inacessível, ocorrerá um erro. Se `file_name` não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual. Isso deve ser a primeira opção na linha de comando, se for usada.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--defaults-file=file_name`

  Leia apenas o arquivo de opção fornecido. Se o arquivo não existir ou estiver inacessível, ocorrerá um erro. Se `file_name` não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Exceção: Mesmo com `--defaults-file`, o **mysqld** lê `mysqld-auto.cnf`.

  Nota

  Esta deve ser a primeira opção na linha de comando, se for usada, exceto que, se o servidor for iniciado com as opções `--defaults-file` e `--install` (ou `--install-manual`), `--install` (ou `--install-manual`) deve ser a primeira.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--defaults-group-suffix=str`

  Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de `str`. Por exemplo, **mysqld** normalmente lê o grupo `[mysqld]`. Se esta opção for dada como `--defaults-group-suffix=_other`, **mysqld** também lê o grupo `[mysqld_other]`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--early-plugin-load=plugin_list`

  <table summary="Propriedades para admin-ssl"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl[={OFF|ON}]</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Desatualizado</th> <td>8.0.26</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>5

  Esta opção indica ao servidor quais plugins devem ser carregados antes de carregar os plugins embutidos obrigatórios e antes da inicialização do mecanismo de armazenamento. O carregamento antecipado é suportado apenas para plugins compilados com `PLUGIN_OPT_ALLOW_EARLY`. Se forem fornecidas várias opções `--early-plugin-load`, apenas a última se aplica.

  O valor da opção é uma lista separada por ponto e vírgula de valores de `plugin_library` e *`name``=`*`plugin_library`\*, onde cada `plugin_library` é o nome de um arquivo de biblioteca que contém o código do plugin, e cada `name` é o nome de um plugin a ser carregado. Se uma biblioteca de plugin estiver nomeada sem nenhum nome de plugin anterior, o servidor carrega todos os plugins da biblioteca. Com um nome de plugin anterior, o servidor carrega apenas o plugin nomeado da biblioteca. O servidor procura por arquivos de biblioteca de plugins no diretório nomeado pela variável de sistema `plugin_dir`.

  Por exemplo, se os plugins com os nomes `myplug1` e `myplug2` estiverem contidos nos arquivos da biblioteca de plugins `myplug1.so` e `myplug2.so`, use esta opção para realizar um carregamento antecipado do plugin:

  ```
  mysqld --early-plugin-load="myplug1=myplug1.so;myplug2=myplug2.so"
  ```

  Aspas cercam o valor do argumento porque, caso contrário, alguns interpretadores de comandos interpretam o ponto e vírgula (`;`) como um caractere especial. (Por exemplo, as caixas de texto do Unix o tratam como um marcador de fim de comando.)

  Cada plugin nomeado é carregado precocemente apenas para uma única invocação do **mysqld**. Após um reinício, o plugin não é carregado precocemente, a menos que `--early-plugin-load` seja usado novamente.

  Se o servidor for iniciado usando `--initialize` ou `--initialize-insecure`, os plugins especificados por `--early-plugin-load` não serão carregados.

  Se o servidor for executado com `--help`, os plugins especificados por `--early-plugin-load` são carregados, mas não inicializados. Esse comportamento garante que as opções do plugin sejam exibidas na mensagem de ajuda.

  A criptografia do espaço de tabelas `InnoDB` depende do gerenciamento de chaves de criptografia do MySQL Keyring, e o plugin do chaveiro deve ser carregado antes da inicialização do mecanismo de armazenamento para facilitar a recuperação `InnoDB` de tabelas criptografadas. Por exemplo, os administradores que desejam que o plugin `keyring_file` seja carregado ao iniciar o sistema devem usar `--early-plugin-load` com o valor de opção apropriado (como `keyring_file.so` em sistemas Unix e Unix-like ou `keyring_file.dll` em sistemas Windows).

  Para obter informações sobre a criptografia do espaço de tabelas `InnoDB`, consulte a Seção 17.13, “Criptografia de Dados em Repouso do InnoDB”. Para informações gerais sobre o carregamento de plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

  Nota

  Para o Keyring do MySQL, essa opção é usada apenas quando o keystore é gerenciado com um plugin de chave. Se a gestão do keystore usa um componente de chaveiro em vez de um plugin, especifique a carga do componente usando um arquivo de manifesto; veja a Seção 8.4.4.2, “Instalação do Componente de Chaveiro”.

- `--exit-info[=flags]`, `-T [flags]`

  <table summary="Propriedades para admin-ssl"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl[={OFF|ON}]</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Desatualizado</th> <td>8.0.26</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>6

  Este é um bitmask de diferentes flags que você pode usar para depurar o servidor **mysqld**. Não use esta opção a menos que você saiba *exatamente* o que ela faz!

- `--external-locking`

  <table summary="Propriedades para admin-ssl"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl[={OFF|ON}]</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Desatualizado</th> <td>8.0.26</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>7

  Ative o bloqueio externo (bloqueio do sistema), que está desativado por padrão. Se você usar essa opção em um sistema em que o `lockd` não funciona completamente (como o Linux), é fácil que o **mysqld** fique em um impasse.

  Para desabilitar o bloqueio externo explicitamente, use `--skip-external-locking`.

  O bloqueio externo afeta apenas o acesso à tabela `MyISAM`. Para obter mais informações, incluindo as condições em que ele pode e não pode ser usado, consulte a Seção 10.11.5, “Bloqueio Externo”.

- `--flush`

  <table summary="Propriedades para admin-ssl"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl[={OFF|ON}]</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Desatualizado</th> <td>8.0.26</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>8

  Limpe (sincronize) todas as alterações no disco após cada instrução SQL. Normalmente, o MySQL realiza uma gravação de todas as alterações no disco apenas após cada instrução SQL e permite que o sistema operacional gere a sincronização com o disco. Veja a Seção B.3.3.3, “O que fazer se o MySQL continuar a falhar”.

  Nota

  Se `--flush` for especificado, o valor de `flush_time` não importa e as alterações para `flush_time` não afetam o comportamento de limpeza.

- `--gdb`

  <table summary="Propriedades para admin-ssl"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl[={OFF|ON}]</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Desatualizado</th> <td>8.0.26</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>9

  Instale um manipulador de interrupção para `SIGINT` (necessário para parar o **mysqld** com `^C` para definir pontos de interrupção) e desative o rastreamento de pilha e o gerenciamento de arquivos de núcleo. Veja a Seção 7.9.1.4, “Depuração do mysqld no gdb”.

  No Windows, essa opção também suprime o forking usado para implementar a instrução `RESTART`: o forking permite que um processo atue como monitor para o outro, que atua como o servidor. No entanto, o forking dificulta a determinação do processo do servidor para ser anexado para depuração, então iniciar o servidor com `--gdb` suprime o forking. Para um servidor iniciado com essa opção, `RESTART` simplesmente sai e não reinicia.

  Em configurações não de depuração, `--no-monitor` pode ser usado para suprimir a divisão do processo de monitoramento.

- `--initialize`, `-I`

  <table summary="Propriedades para permitir-udfs-suspeito"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--allow-suspicious-udfs[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>0

  Esta opção é usada para inicializar uma instalação do MySQL criando o diretório de dados e preenchendo as tabelas no esquema de sistema `mysql`. Para mais informações, consulte a Seção 2.9.1, “Inicializando o Diretório de Dados”.

  Essa opção limita os efeitos de, ou não é compatível com, várias outras opções de inicialização para o servidor MySQL. Alguns dos problemas mais comuns desse tipo são mencionados aqui:

  - Recomendamos fortemente que, ao inicializar o diretório de dados com `--initialize`, você não especifique opções adicionais além de `--datadir`, outras opções usadas para definir locais de diretórios, como `--basedir` e, possivelmente, `--user`, se necessário. As opções para o servidor MySQL em execução podem ser especificadas ao iniciá-lo após a inicialização ter sido concluída e o **mysqld** ter sido desligado. Isso também se aplica ao uso de `--initialize-insecure` em vez de `--initialize`.

  - Quando o servidor é iniciado com `--initialize`, algumas funcionalidades ficam indisponíveis, o que limita as declarações permitidas em qualquer arquivo nomeado pela variável de sistema `init_file`. Para obter mais informações, consulte a descrição dessa variável. Além disso, a variável de sistema `disabled_storage_engines` não tem efeito.

  - A opção `--ndbcluster` é ignorada quando usada juntamente com `--initialize`.

  - `--initialize` é mutuamente exclusiva com `--bootstrap` e `--daemonize`.

  Os itens da lista anterior também se aplicam ao inicializar o servidor usando a opção `--initialize-insecure`.

- `--initialize-insecure`

  <table summary="Propriedades para permitir-udfs-suspeito"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--allow-suspicious-udfs[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>1

  Esta opção é usada para inicializar uma instalação do MySQL criando o diretório de dados e preenchendo as tabelas no esquema de sistema `mysql`. Esta opção implica em `--initialize`, e as mesmas restrições e limitações se aplicam; para mais informações, consulte a descrição dessa opção e a Seção 2.9.1, “Inicializando o Diretório de Dados”.

  Aviso

  Essa opção cria um usuário `root` do MySQL com uma senha vazia, o que é inseguro. Por esse motivo, não use essa opção em produção sem definir essa senha manualmente. Consulte a seção Atribuição de senha do root após a inicialização para obter informações sobre como fazer isso.

- `--innodb-xxx`

  Defina uma opção para o mecanismo de armazenamento `InnoDB`. As opções `InnoDB` estão listadas na Seção 17.14, “Opções de inicialização do InnoDB e variáveis de sistema”.

- `--install [service_name]`

  <table summary="Propriedades para permitir-udfs-suspeito"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--allow-suspicious-udfs[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>2

  (Apenas para Windows) Instale o servidor como um serviço do Windows que seja iniciado automaticamente durante o início do Windows. O nome do serviço padrão é `MySQL` se não for fornecido o valor `service_name`. Para obter mais informações, consulte a Seção 2.3.4.8, “Iniciar o MySQL como um serviço do Windows”.

  Nota

  Se o servidor for iniciado com as opções `--defaults-file` e `--install`, `--install` deve ser o primeiro.

- `--install-manual [service_name]`

  <table summary="Propriedades para permitir-udfs-suspeito"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--allow-suspicious-udfs[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>3

  (Apenas para Windows) Instale o servidor como um serviço do Windows que deve ser iniciado manualmente. Ele não é iniciado automaticamente durante o início do Windows. O nome do serviço padrão é `MySQL` se não for fornecido o valor `service_name`. Para mais informações, consulte a Seção 2.3.4.8, “Iniciar o MySQL como um serviço do Windows”.

  Nota

  Se o servidor for iniciado com as opções `--defaults-file` e `--install-manual`, `--install-manual` deve ser o primeiro.

- `--language=lang_name, -L lang_name`

  <table summary="Propriedades para permitir-udfs-suspeito"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--allow-suspicious-udfs[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>4

  A linguagem a ser usada para mensagens de erro. `lang_name` pode ser fornecido como o nome da linguagem ou como o nome completo do caminho para o diretório onde os arquivos de linguagem estão instalados. Veja a Seção 12.12, “Definindo a Linguagem da Mensagem de Erro”.

  `--lc-messages-dir` e `--lc-messages` devem ser usados em vez de `--language`, que está desatualizado (e tratado como sinônimo de `--lc-messages-dir`). Você deve esperar que a opção `--language` seja removida em uma futura versão do MySQL.

- `--large-pages`

  <table summary="Propriedades para permitir-udfs-suspeito"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--allow-suspicious-udfs[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>5

  Algumas arquiteturas de hardware/sistema operacional suportam páginas de memória maiores que o padrão (geralmente 4 KB). A implementação real deste suporte depende do hardware e do sistema operacional subjacentes. Aplicações que realizam muitos acessos à memória podem obter melhorias de desempenho ao usar páginas grandes devido à redução de erros no Buffer de Busca de Tradução (TLB).

  O MySQL suporta a implementação do Linux para suporte a páginas grandes (chamada HugeTLB no Linux). Consulte a Seção 10.12.3.3, “Habilitar Suporte a Páginas Grandes”. Para suporte a páginas grandes no Solaris, consulte a descrição da opção `--super-large-pages`.

  `--large-pages` está desativado por padrão.

- `--lc-messages=locale_name`

  <table summary="Propriedades para permitir-udfs-suspeito"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--allow-suspicious-udfs[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>6

  O local a ser usado para mensagens de erro. O padrão é `en_US`. O servidor converte o argumento em um nome de idioma e o combina com o valor de `--lc-messages-dir` para produzir a localização do arquivo de mensagem de erro. Veja a Seção 12.12, “Definindo o Idioma da Mensagem de Erro”.

- `--lc-messages-dir=dir_name`

  <table summary="Propriedades para permitir-udfs-suspeito"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--allow-suspicious-udfs[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>7

  O diretório onde as mensagens de erro estão localizadas. O servidor usa o valor junto com o valor de `--lc-messages` para determinar a localização do arquivo de mensagem de erro. Veja a Seção 12.12, “Definindo o idioma da mensagem de erro”.

- `--local-service`

  <table summary="Propriedades para permitir-udfs-suspeito"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--allow-suspicious-udfs[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>8

  (Apenas para Windows) Uma opção `--local-service` após o nome do serviço faz com que o servidor seja executado usando a conta `LocalService` do Windows que tem privilégios de sistema limitados. Se ambos `--defaults-file` e `--local-service` forem fornecidos após o nome do serviço, eles podem estar em qualquer ordem. Veja a Seção 2.3.4.8, “Iniciando o MySQL como um Serviço do Windows”.

- `--log-error[=file_name]`

  <table summary="Propriedades para permitir-udfs-suspeito"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--allow-suspicious-udfs[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>9

  Defina o destino padrão do log de erros no arquivo nomeado. Isso afeta os pontos de destino de log que baseiam seu próprio destino de saída no destino padrão. Veja a Seção 7.4.2, “O Log de Erros”.

  Se a opção não especificar nenhum arquivo, o destino padrão do log de erro em sistemas Unix e Unix-like é um arquivo chamado `host_name.err` no diretório de dados. O destino padrão em sistemas Windows é o mesmo, a menos que a opção `--pid-file` seja especificada. Nesse caso, o nome do arquivo é o nome de base do arquivo PID com um sufixo de `.err` no diretório de dados.

  Se a opção nomear um arquivo, o destino padrão é esse arquivo (com o sufixo `.err` adicionado se o nome não tiver sufixo), localizado sob o diretório de dados, a menos que um nome de caminho absoluto seja fornecido para especificar uma localização diferente.

  Se a saída do log de erro não puder ser redirecionada para o arquivo de log de erro, ocorrerá um erro e a inicialização falhará.

  Em Windows, `--console` tem precedência sobre `--log-error` se ambos forem fornecidos. Nesse caso, o destino padrão do log de erro é o console, em vez de um arquivo.

- `--log-isam[=file_name]`

  <table summary="Propriedades para ansi"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ansi</code>]]</td> </tr></tbody></table>0

  Registre todas as alterações de `MyISAM` neste arquivo (usado apenas durante a depuração de `MyISAM`).

- `--log-raw`

  <table summary="Propriedades para ansi"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ansi</code>]]</td> </tr></tbody></table>1

  As senhas em certas declarações escritas no log de consulta geral, no log de consultas lentas e no log binário são reescritas pelo servidor para não ocorrerem literalmente em texto simples. A reescrita de senhas pode ser suprimida para o log de consulta geral iniciando o servidor com a opção `--log-raw`. Esta opção pode ser útil para fins de diagnóstico, para ver o texto exato das declarações recebidas pelo servidor, mas por razões de segurança não é recomendada para uso em produção.

  Se um plugin de reescrita de consulta estiver instalado, a opção `--log-raw` afeta o registro de declarações da seguinte forma:

  - Sem `--log-raw`, o servidor registra a declaração retornada pelo plugin de reescrita de consulta. Isso pode diferir da declaração recebida.

  - Com `--log-raw`, o servidor registra a declaração original como recebida.

  Para obter mais informações, consulte a Seção 8.1.2.3, “Senhas e Registro”.

- `--log-short-format`

  <table summary="Propriedades para ansi"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ansi</code>]]</td> </tr></tbody></table>2

  Registre menos informações no registro de consultas lentas, se ele tiver sido ativado.

- `--log-tc=file_name`

  <table summary="Propriedades para ansi"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ansi</code>]]</td> </tr></tbody></table>3

  O nome do arquivo de log do coordenador de transação mapeado à memória (para transações XA que afetam múltiplos mecanismos de armazenamento quando o log binário está desativado). O nome padrão é `tc.log`. O arquivo é criado no diretório de dados, se não for fornecido como um nome de caminho completo. Esta opção não é usada.

- `--log-tc-size=size`

  <table summary="Propriedades para ansi"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ansi</code>]]</td> </tr></tbody></table>4

  O tamanho, em bytes, do log do coordenador de transações mapeado à memória. Os valores padrão e mínimos são 6 vezes o tamanho da página, e o valor deve ser um múltiplo do tamanho da página.

- `--memlock`

  <table summary="Propriedades para ansi"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ansi</code>]]</td> </tr></tbody></table>5

  Bloquear o processo **mysqld** na memória. Esta opção pode ajudar se você tiver um problema em que o sistema operacional está fazendo com que o **mysqld** troque para o disco.

  `--memlock` funciona em sistemas que suportam a chamada de sistema `mlockall()`; isso inclui Solaris, a maioria das distribuições Linux que usam um kernel 2.4 ou superior e talvez outros sistemas Unix. Em sistemas Linux, você pode verificar se `mlockall()` (e, portanto, essa opção) é suportada verificando se ela está definida no arquivo de sistema `mman.h`, da seguinte forma:

  ```
  $> grep mlockall /usr/include/sys/mman.h
  ```

  Se o `mlockall()` for suportado, você deve ver na saída do comando anterior algo como o seguinte:

  ```
  extern int mlockall (int __flags) __THROW;
  ```

  Importante

  O uso desta opção pode exigir que você execute o servidor como `root`, o que, por razões de segurança, normalmente não é uma boa ideia. Veja a Seção 8.1.5, “Como executar o MySQL como um usuário normal”.

  Em Linux e talvez em outros sistemas, você pode evitar a necessidade de executar o servidor como `root` ao alterar o arquivo `limits.conf`. Consulte as notas sobre o limite de memlock na Seção 10.12.3.3, “Habilitar Suporte a Páginas Grandes”.

  Você não deve usar essa opção em um sistema que não suporte a chamada de sistema `mlockall()`; se você fizer isso, **mysqld** provavelmente encerrará assim que você tentar iniciá-lo.

- `--myisam-block-size=N`

  <table summary="Propriedades para ansi"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ansi</code>]]</td> </tr></tbody></table>6

  O tamanho do bloco a ser usado para as páginas de índice `MyISAM`.

- `--no-defaults`

  Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para impedir que sejam lidas. Isso deve ser a primeira opção na linha de comando se for usado.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--no-dd-upgrade`

  <table summary="Propriedades para ansi"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ansi</code>]]</td> </tr></tbody></table>7

  Nota

  Esta opção foi descontinuada a partir do MySQL 8.0.16. Ela foi substituída pela opção `--upgrade`, que oferece um controle mais preciso sobre o comportamento do dicionário de dados e da atualização do servidor.

  Evite a atualização automática das tabelas do dicionário de dados durante o processo de inicialização do servidor MySQL. Esta opção é normalmente usada ao iniciar o servidor MySQL após uma atualização in-place de uma instalação existente para uma versão mais recente do MySQL, o que pode incluir alterações nas definições das tabelas do dicionário de dados.

  Quando `--no-dd-upgrade` é especificado e o servidor detecta que sua versão esperada do dicionário de dados difere da versão armazenada no próprio dicionário de dados, a inicialização falha com um erro indicando que a atualização do dicionário de dados é proibida;

  ```
  [ERROR] [MY-011091] [Server] Data dictionary upgrade prohibited by the
  command line option '--no_dd_upgrade'.
  [ERROR] [MY-010020] [Server] Data Dictionary initialization failed.
  ```

  Durante uma inicialização normal, a versão do dicionário de dados do servidor é comparada com a versão armazenada no dicionário de dados para determinar se as definições das tabelas do dicionário de dados devem ser atualizadas. Se uma atualização for necessária e suportada, o servidor cria tabelas do dicionário de dados com definições atualizadas, copia os metadados persistentes para as novas tabelas, substitui as tabelas antigas de forma atômica pelas novas e reinicia o dicionário de dados. Se uma atualização não for necessária, a inicialização continua sem atualizar as tabelas do dicionário de dados.

- `--no-monitor`

  <table summary="Propriedades para ansi"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ansi</code>]]</td> </tr></tbody></table>8

  (Apenas para Windows). Esta opção suprime o forking utilizado para implementar a instrução `RESTART`: o forking permite que um processo atue como monitor do outro, que atua como servidor. Para um servidor iniciado com esta opção, `RESTART` simplesmente sai e não reinicia.

  `--no-monitor` não está disponível antes do MySQL 8.0.12. A opção `--gdb` pode ser usada como uma solução alternativa.

- `--old-style-user-limits`

  <table summary="Propriedades para ansi"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ansi</code>]]</td> </tr></tbody></table>9

  Ative os limites de recursos de usuário de estilo antigo. (Antes do MySQL 5.0.3, os limites de recursos da conta eram contados separadamente para cada host a partir do qual um usuário se conectava, em vez de por linha de conta na tabela `user`.) Veja a Seção 8.2.21, “Definindo Limites de Recursos da Conta”.

  Esta opção está desatualizada e, a partir do MySQL 8.0.30, usar essa opção na linha de comando ou em um arquivo de opção faz com que o MySQL emita uma mensagem de aviso. Espere que essa opção seja removida em uma futura versão; você deve verificar seus aplicativos agora para usar `--old-style-user-limits` e remover quaisquer dependências que eles possam ter sobre ela, antes que isso aconteça.

- `--performance-schema-xxx`

  Configure uma opção do Schema de Desempenho. Para obter detalhes, consulte a Seção 29.14, “Opções de Comando do Schema de Desempenho”.

- `--plugin-load=plugin_list`

  <table summary="Propriedades para basedir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--basedir=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>basedir</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>parent of mysqld installation directory</code>]]</td> </tr></tbody></table>0

  Essa opção indica ao servidor que carregue os plugins nomeados ao iniciar. Se forem fornecidas várias opções `--plugin-load`, apenas a última se aplica. Plugins adicionais para carregar podem ser especificados usando opções `--plugin-load-add`.

  O valor da opção é uma lista separada por ponto e vírgula de valores de `plugin_library` e *`name``=`*`plugin_library`\*, onde cada `plugin_library` é o nome de um arquivo de biblioteca que contém o código do plugin, e cada `name` é o nome de um plugin a ser carregado. Se uma biblioteca de plugin estiver nomeada sem nenhum nome de plugin anterior, o servidor carrega todos os plugins da biblioteca. Com um nome de plugin anterior, o servidor carrega apenas o plugin nomeado da biblioteca. O servidor procura por arquivos de biblioteca de plugins no diretório nomeado pela variável de sistema `plugin_dir`.

  Por exemplo, se os plugins com os nomes `myplug1` e `myplug2` estiverem contidos nos arquivos da biblioteca de plugins `myplug1.so` e `myplug2.so`, use esta opção para realizar um carregamento antecipado do plugin:

  ```
  mysqld --plugin-load="myplug1=myplug1.so;myplug2=myplug2.so"
  ```

  Aspas cercam o valor do argumento porque, caso contrário, alguns interpretadores de comandos interpretam o ponto e vírgula (`;`) como um caractere especial. (Por exemplo, as caixas de texto do Unix o tratam como um marcador de fim de comando.)

  Cada plugin nomeado é carregado apenas para uma única invocação do **mysqld**. Após um reinício, o plugin não é carregado a menos que `--plugin-load` seja usado novamente. Isso contrasta com `INSTALL PLUGIN`, que adiciona uma entrada à tabela `mysql.plugins` para fazer com que o plugin seja carregado em todas as inicializações normais do servidor.

  Durante a sequência normal de inicialização, o servidor determina quais plugins serão carregados lendo a tabela de sistema `mysql.plugins`. Se o servidor for iniciado com a opção `--skip-grant-tables`, os plugins registrados na tabela `mysql.plugins` não serão carregados e estarão indisponíveis. `--plugin-load` permite que os plugins sejam carregados mesmo quando `--skip-grant-tables` é fornecido. `--plugin-load` também permite que os plugins sejam carregados na inicialização, que não podem ser carregados em tempo de execução.

  Esta opção não define uma variável de sistema correspondente. A saída de `SHOW PLUGINS` fornece informações sobre os plugins carregados. Informações mais detalhadas podem ser encontradas na tabela do esquema de informações `PLUGINS`. Veja a Seção 7.6.2, “Obtendo Informações de Plugins do Servidor”.

  Para obter informações adicionais sobre o carregamento de plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

- `--plugin-load-add=plugin_list`

  <table summary="Propriedades para basedir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--basedir=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>basedir</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>parent of mysqld installation directory</code>]]</td> </tr></tbody></table>1

  Esta opção complementa a opção `--plugin-load`. `--plugin-load-add` adiciona um plugin ou plugins ao conjunto de plugins a serem carregados ao iniciar. O formato do argumento é o mesmo do `--plugin-load`. `--plugin-load-add` pode ser usado para evitar especificar um grande conjunto de plugins como um único argumento `--plugin-load` longo e complicado.

  `--plugin-load-add` pode ser fornecido na ausência de `--plugin-load`, mas qualquer instância de `--plugin-load-add` que apareça antes de `--plugin-load` não terá efeito, pois `--plugin-load` redefiniria o conjunto de plugins a serem carregados. Em outras palavras, essas opções:

  ```
  --plugin-load=x --plugin-load-add=y
  ```

  são equivalentes a esta opção:

  ```
  --plugin-load="x;y"
  ```

  Mas essas opções:

  ```
  --plugin-load-add=y --plugin-load=x
  ```

  são equivalentes a esta opção:

  ```
  --plugin-load=x
  ```

  Esta opção não define uma variável de sistema correspondente. A saída de `SHOW PLUGINS` fornece informações sobre os plugins carregados. Informações mais detalhadas podem ser encontradas na tabela do esquema de informações `PLUGINS`. Veja a Seção 7.6.2, “Obtendo Informações de Plugins do Servidor”.

  Para obter informações adicionais sobre o carregamento de plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

- `--plugin-xxx`

  Especifica uma opção que pertence a um plugin do servidor. Por exemplo, muitos motores de armazenamento podem ser construídos como plugins, e para esses motores, as opções para eles podem ser especificadas com o prefixo `--plugin`. Assim, a opção `--innodb-file-per-table` para `InnoDB` pode ser especificada como `--plugin-innodb-file-per-table`.

  Para opções binárias que podem ser ativadas ou desativadas, o prefixo `--skip` e outros formatos alternativos são suportados também (veja a Seção 6.2.2.4, “Modificadores de Opção do Programa”). Por exemplo, `--skip-plugin-innodb-file-per-table` desativa `innodb-file-per-table`.

  A justificativa para o prefixo `--plugin` é que ele permite especificar opções de plugin de forma inequívoca, caso haja um conflito de nome com uma opção de servidor embutida. Por exemplo, se um escritor de plugin nomear um plugin como “sql” e implementar uma opção “mode”, o nome da opção pode ser `--sql-mode`, o que entraria em conflito com a opção embutida do mesmo nome. Nesses casos, as referências ao nome em conflito são resolvidas em favor da opção embutida. Para evitar a ambiguidade, os usuários podem especificar a opção do plugin como `--plugin-sql-mode`. O uso do prefixo `--plugin` para opções de plugin é recomendado para evitar qualquer questão de ambiguidade.

- `--port=port_num`, `-P port_num`

  <table summary="Propriedades para basedir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--basedir=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>basedir</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>parent of mysqld installation directory</code>]]</td> </tr></tbody></table>2

  O número de porta a ser usado ao ouvir conexões TCP/IP. Em sistemas Unix e similares, o número de porta deve ser 1024 ou superior, a menos que o servidor seja iniciado pelo usuário do sistema operacional `root`. Definir esta opção para 0 faz com que o valor padrão seja usado.

- `--port-open-timeout=num`

  <table summary="Propriedades para basedir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--basedir=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>basedir</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>parent of mysqld installation directory</code>]]</td> </tr></tbody></table>3

  Em alguns sistemas, quando o servidor é desligado, a porta TCP/IP pode não ficar disponível imediatamente. Se o servidor for reiniciado rapidamente depois disso, sua tentativa de reabrir a porta pode falhar. Esta opção indica quantos segundos o servidor deve esperar para que a porta TCP/IP fique livre, caso não consiga ser aberta. O padrão é não esperar.

- `--print-defaults`

  Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opções. Os valores da senha são mascarados. Isso deve ser a primeira opção na linha de comando, se for usada, exceto que ela pode ser usada imediatamente após `--defaults-file` ou `--defaults-extra-file`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--remove [service_name]`

  <table summary="Propriedades para basedir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--basedir=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>basedir</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>parent of mysqld installation directory</code>]]</td> </tr></tbody></table>4

  (Apenas para Windows) Remova um serviço do MySQL no Windows. O nome padrão do serviço é `MySQL` se não for fornecido o valor `service_name`. Para obter mais informações, consulte a Seção 2.3.4.8, “Iniciar o MySQL como um serviço do Windows”.

- `--safe-user-create`

  <table summary="Propriedades para basedir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--basedir=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>basedir</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>parent of mysqld installation directory</code>]]</td> </tr></tbody></table>5

  Esta opção está desatualizada e será ignorada a partir do MySQL 8.0.11. Para informações relacionadas, consulte Alterações no servidor.

  Se essa opção estiver habilitada, um usuário não poderá criar novos usuários MySQL usando a instrução `GRANT` a menos que o usuário tenha o privilégio `INSERT` para a tabela de sistema `mysql.user` ou qualquer coluna na tabela. Se você deseja que um usuário tenha a capacidade de criar novos usuários que tenham esses privilégios que o usuário tem o direito de conceder, você deve conceder ao usuário o seguinte privilégio:

  ```
  GRANT INSERT(user) ON mysql.user TO 'user_name'@'host_name';
  ```

  Isso garante que o usuário não possa alterar diretamente as colunas de privilégio, mas deve usar a instrução `GRANT` para conceder privilégios a outros usuários.

- `--skip-grant-tables`

  <table summary="Propriedades para basedir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--basedir=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>basedir</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>parent of mysqld installation directory</code>]]</td> </tr></tbody></table>6

  Esta opção afeta a sequência de inicialização do servidor:

  - `--skip-grant-tables` faz com que o servidor não leia as tabelas de concessão no esquema de sistema `mysql`, e, assim, comece sem usar o sistema de privilégios. Isso dá a qualquer pessoa com acesso ao servidor *acesso ilimitado a todas as bases de dados*.

    Como o servidor é iniciado com `--skip-grant-tables`, as verificações de autenticação são desativadas, e, nesse caso, o servidor também desativa as conexões remotas ao ativar `skip_networking`.

    Para fazer com que um servidor iniciado com `--skip-grant-tables` carregue as tabelas de concessão em tempo de execução, execute uma operação de limpeza de privilégios, que pode ser feita das seguintes maneiras:

    - Emita uma instrução MySQL `FLUSH PRIVILEGES` após se conectar ao servidor.

    - Execute o comando **mysqladmin flush-privileges** ou **mysqladmin reload** a partir da linha de comando.

    O esvaziamento de privilégios também pode ocorrer implicitamente como resultado de outras ações realizadas após a inicialização, fazendo com que o servidor comece a usar as tabelas de concessão. Por exemplo, o servidor esvazia os privilégios se realizar uma atualização durante a sequência de inicialização.

  - `--skip-grant-tables` desativa o rastreamento de logins fracassados e o bloqueio temporário de contas, pois essas funcionalidades dependem das tabelas de concessão. Veja a Seção 8.2.15, “Gestão de Senhas”.

  - `--skip-grant-tables` faz com que o servidor não carregue certos outros objetos registrados no dicionário de dados ou no esquema do sistema `mysql`:

    - Eventos agendados instalados usando `CREATE EVENT` e registrados na tabela do dicionário de dados `events`.

    - Plugins instalados usando `INSTALL PLUGIN` e registrados na tabela do sistema `mysql.plugin`.

      Para fazer com que os plugins sejam carregados mesmo ao usar `--skip-grant-tables`, use a opção `--plugin-load` ou `--plugin-load-add`.

    - Funções carregáveis instaladas usando `CREATE FUNCTION` e registradas na tabela do sistema `mysql.func`.

    `--skip-grant-tables` *não* suprime o carregamento durante o inicialização de componentes.

  - `--skip-grant-tables` faz com que a variável de sistema `disabled_storage_engines` não tenha efeito.

- `--skip-host-cache`

  <table summary="Propriedades para basedir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--basedir=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>basedir</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>parent of mysqld installation directory</code>]]</td> </tr></tbody></table>7

  Desative o uso do cache de host interno para uma resolução mais rápida de nomes para IPs. Com o cache desativado, o servidor realiza uma pesquisa DNS toda vez que um cliente se conecta.

  O uso do `--skip-host-cache` é semelhante a definir a variável de sistema `host_cache_size` para 0, mas o `host_cache_size` é mais flexível porque também pode ser usado para redimensionar, habilitar ou desabilitar o cache do host em tempo de execução, não apenas no início do servidor.

  A partir do MySQL 8.0.30, essa opção está desatualizada; você deve usar `SET GLOBAL host_cache_size = 0` em vez disso.

  Iniciar o servidor com `--skip-host-cache` não impede alterações no valor de `host_cache_size` durante a execução, mas essas alterações não têm efeito e o cache não é reativado, mesmo que `host_cache_size` seja definido maior que 0.

  Para obter mais informações sobre como o cache do host funciona, consulte a Seção 7.1.12.3, “Consultas de DNS e o Cache do Host”.

- `--skip-innodb`

  Desative o mecanismo de armazenamento `InnoDB`. Nesse caso, como o mecanismo de armazenamento padrão é `InnoDB`, o servidor não será iniciado a menos que você também use `--default-storage-engine` e `--default-tmp-storage-engine` para definir o padrão para outro mecanismo tanto para tabelas permanentes quanto para `TEMPORARY`.

  O mecanismo de armazenamento `InnoDB` não pode ser desativado, e a opção `--skip-innodb` é desatualizada e não tem efeito. Seu uso resulta em um aviso. Espere que essa opção seja removida em uma futura versão do MySQL.

- `--skip-new`

  <table summary="Propriedades para basedir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--basedir=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>basedir</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>parent of mysqld installation directory</code>]]</td> </tr></tbody></table>8

  Essa opção desativa (o que costumava ser considerado) comportamentos novos, possivelmente inseguros. Isso resulta nestas configurações: `delay_key_write=OFF`, `concurrent_insert=NEVER`, `automatic_sp_privileges=OFF`. Também faz com que `OPTIMIZE TABLE` seja mapeado para `ALTER TABLE` para motores de armazenamento para os quais `OPTIMIZE TABLE` não é suportado.

  Esta opção foi descontinuada a partir do MySQL 8.0.35 e está sujeita à remoção em uma futura versão.

- `--skip-show-database`

  <table summary="Propriedades para basedir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--basedir=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>basedir</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>parent of mysqld installation directory</code>]]</td> </tr></tbody></table>9

  Essa opção define a variável de sistema `skip_show_database`, que controla quem tem permissão para usar a instrução `SHOW DATABASES`. Veja a Seção 7.1.8, “Variáveis de sistema do servidor”.

- `--skip-stack-trace`

  <table summary="Propriedades para handshake de cliente de conjunto de caracteres"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-set-client-handshake[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.35</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>0

  Não escreva traços de pilha. Esta opção é útil quando você está executando o **mysqld** sob um depurador. Em alguns sistemas, você também deve usar esta opção para obter um arquivo de núcleo. Veja a Seção 7.9, “Depuração do MySQL”.

- `--slow-start-timeout=timeout`

  <table summary="Propriedades para handshake de cliente de conjunto de caracteres"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-set-client-handshake[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.35</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>1

  Esta opção controla o tempo de espera do gerenciador de controle de serviços do Windows para o início do serviço. O valor é o número máximo de milissegundos que o gerenciador de controle de serviços do Windows espera antes de tentar interromper o serviço do MySQL durante o início. O valor padrão é 15000 (15 segundos). Se o serviço MySQL demorar muito para iniciar, você pode precisar aumentar esse valor. Um valor de 0 significa que não há tempo de espera.

- `--socket=path`

  <table summary="Propriedades para handshake de cliente de conjunto de caracteres"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-set-client-handshake[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.35</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>2

  No Unix, essa opção especifica o arquivo de soquete Unix a ser usado ao ouvir conexões locais. O valor padrão é `/tmp/mysql.sock`. Se essa opção for fornecida, o servidor cria o arquivo no diretório de dados, a menos que um nome de caminho absoluto seja fornecido para especificar um diretório diferente. No Windows, a opção especifica o nome do tubo a ser usado ao ouvir conexões locais que usam um tubo nomeado. O valor padrão é `MySQL` (não case-sensitive).

- `--sql-mode=value[,value[,value...]]`

  <table summary="Propriedades para handshake de cliente de conjunto de caracteres"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-set-client-handshake[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.35</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>3

  Defina o modo SQL. Consulte a Seção 7.1.11, “Modos SQL do servidor”.

  Nota

  Os programas de instalação do MySQL podem configurar o modo SQL durante o processo de instalação.

  Se o modo SQL for diferente do padrão ou do que você espera, verifique se há uma configuração em um arquivo de opções que o servidor lê ao iniciar.

- `--ssl`, `--skip-ssl`

  <table summary="Propriedades para handshake de cliente de conjunto de caracteres"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-set-client-handshake[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.35</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>4

  A opção `--ssl` especifica que o servidor permite, mas não exige, conexões criptografadas na interface de conexão principal. Esta opção está habilitada por padrão.

  Uma opção semelhante, `--admin-ssl`, é semelhante à `--ssl`, exceto que ela se aplica à interface de conexão administrativa em vez da interface de conexão principal. Para obter informações sobre essas interfaces, consulte a Seção 7.1.12.1, “Interfaces de Conexão”.

  `--ssl` pode ser especificado na forma negada como `--skip-ssl` ou um sinônimo (`--ssl=OFF`, `--disable-ssl`). Neste caso, a opção especifica que o servidor *não* permite conexões criptografadas, independentemente das configurações das variáveis de sistema `tls_xxx` e `ssl_xxx`.

  A opção `--ssl` tem efeito apenas na inicialização do servidor sobre se o servidor suporta conexões criptografadas. Ela é ignorada e não tem efeito na operação do `ALTER INSTANCE RELOAD TLS` em tempo de execução. Por exemplo, você pode usar `--ssl=OFF` para iniciar o servidor com conexões criptografadas desativadas, depois reconfigurar o TLS e executar `ALTER INSTANCE RELOAD TLS` para habilitar conexões criptografadas em tempo de execução.

  Para obter mais informações sobre como configurar se o servidor permite que os clientes se conectem usando SSL e indicar onde encontrar as chaves e certificados SSL, consulte a Seção 8.3.1, “Configurando o MySQL para Usar Conexões Encriptadas”, que também descreve as capacidades do servidor para autogeração e autodescoberta de arquivos de certificado e chave. Considere definir pelo menos as variáveis de sistema `ssl_cert` e `ssl_key` no lado do servidor e a opção `--ssl-ca` (ou `--ssl-capath`) no lado do cliente.

  Como o suporte para conexões criptografadas está habilitado por padrão, normalmente não é necessário especificar `--ssl`. A partir do MySQL 8.0.26, `--ssl` está desatualizado e está sujeito à remoção em uma versão futura do MySQL. Se desejar desativar as conexões criptografadas, isso pode ser feito sem especificar `--ssl` na forma negada. Defina a variável de sistema `tls_version` no valor vazio para indicar que nenhuma versão do TLS é suportada. Por exemplo, essas linhas no arquivo do servidor `my.cnf` desativam as conexões criptografadas:

  ```
  [mysqld]
  tls_version=''
  ```

- `--standalone`

  <table summary="Propriedades para handshake de cliente de conjunto de caracteres"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-set-client-handshake[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.35</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>5

  Disponível apenas no Windows; instrui o servidor MySQL a não ser executado como serviço.

- `--super-large-pages`

  <table summary="Propriedades para handshake de cliente de conjunto de caracteres"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-set-client-handshake[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.35</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>6

  O uso padrão de páginas grandes no MySQL tenta usar o tamanho maior suportado, até 4 MB. Sob o Solaris, um recurso de “páginas super grandes” permite o uso de páginas de até 256 MB. Esse recurso está disponível para plataformas SPARC recentes. Ele pode ser ativado ou desativado usando a opção `--super-large-pages` ou `--skip-super-large-pages`.

- `--symbolic-links`, `--skip-symbolic-links`

  <table summary="Propriedades para handshake de cliente de conjunto de caracteres"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-set-client-handshake[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.35</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>7

  Ative ou desative o suporte a links simbólicos. No Unix, ativar links simbólicos significa que você pode vincular um arquivo de índice `MyISAM` ou um arquivo de dados a outro diretório com a opção `INDEX DIRECTORY` ou `DATA DIRECTORY` da instrução `CREATE TABLE`. Se você excluir ou renomear a tabela, os arquivos a que os links simbólicos apontam também serão excluídos ou renomeados. Veja a Seção 10.12.2.2, “Usando Links Simbólicos para Tabelas MyISAM no Unix”.

  Nota

  O suporte a links simbólicos, juntamente com a opção `--symbolic-links` que o controla, está desatualizado; você deve esperar que ele seja removido em uma versão futura do MySQL. Além disso, a opção está desativada por padrão. A variável de sistema `have_symlink` relacionada também está desatualizada; espere que ela seja removida em uma versão futura do MySQL.

  Esta opção não tem significado no Windows.

- `--sysdate-is-now`

  <table summary="Propriedades para handshake de cliente de conjunto de caracteres"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-set-client-handshake[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.35</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>8

  `SYSDATE()` por padrão retorna a hora em que ele é executado, e não a hora em que a instrução na qual ele ocorre começa a ser executada. Isso difere do comportamento de `NOW()`. Esta opção faz com que `SYSDATE()` seja sinônimo de `NOW()`. Para informações sobre as implicações para o registro binário e a replicação, consulte a descrição para `SYSDATE()` na Seção 14.7, “Funções de Data e Hora” e para `SET TIMESTAMP` na Seção 7.1.8, “Variáveis do Sistema do Servidor”.

- `--tc-heuristic-recover={COMMIT|ROLLBACK}`

  <table summary="Propriedades para handshake de cliente de conjunto de caracteres"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-set-client-handshake[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.35</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>9

  A decisão de usar uma recuperação heurística manual.

  Se uma opção `--tc-heuristic-recover` for especificada, o servidor será encerrado, independentemente de a recuperação heurística manual ter sucesso ou

  Em sistemas com mais de um mecanismo de armazenamento capaz de commit de duas fases, a opção `ROLLBACK` não é segura e faz com que a recuperação seja interrompida com o seguinte erro:

  ```
  [ERROR] --tc-heuristic-recover rollback
  strategy is not safe on systems with more than one 2-phase-commit-capable
  storage engine. Aborting crash recovery.
  ```

- `--transaction-isolation=level`

  <table summary="Propriedades para funções de tabela de verificação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--check-table-functions=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.42</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ABORT</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>WARN</code>]]</p><p class="valid-value">[[<code>ABORT</code>]]</p></td> </tr></tbody></table>0

  Define o nível de isolamento de transação padrão. O valor `level` pode ser `READ-UNCOMMITTED`, `READ-COMMITTED`, `REPEATABLE-READ` ou `SERIALIZABLE`. Consulte a Seção 15.3.7, “Instrução SET TRANSACTION”.

  O nível de isolamento de transação padrão também pode ser definido em tempo de execução usando a instrução `SET TRANSACTION` ou configurando a variável de sistema `transaction_isolation`.

- `--transaction-read-only`

  <table summary="Propriedades para funções de tabela de verificação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--check-table-functions=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.42</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ABORT</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>WARN</code>]]</p><p class="valid-value">[[<code>ABORT</code>]]</p></td> </tr></tbody></table>1

  Define o modo de acesso padrão para transações. Por padrão, o modo apenas de leitura está desativado, portanto, o modo é leitura/escrita.

  Para definir o modo de acesso à transação padrão no tempo de execução, use a instrução `SET TRANSACTION` ou defina a variável de sistema `transaction_read_only`. Consulte a Seção 15.3.7, “Instrução SET TRANSACTION”.

- `--tmpdir=dir_name`, `-t dir_name`

  <table summary="Propriedades para funções de tabela de verificação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--check-table-functions=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.42</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ABORT</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>WARN</code>]]</p><p class="valid-value">[[<code>ABORT</code>]]</p></td> </tr></tbody></table>2

  O caminho do diretório a ser usado para criar arquivos temporários. Isso pode ser útil se o diretório padrão `/tmp` estiver em uma partição que é muito pequena para armazenar tabelas temporárias. Esta opção aceita vários caminhos que são usados de forma rotativa. Os caminhos devem ser separados por colchetes (`:`) no Unix e por pontos e vírgulas (`;`) no Windows.

  `--tmpdir` pode ser um local não permanente, como um diretório em um sistema de arquivos baseado em memória ou um diretório que é limpo quando o host do servidor é reiniciado. Se o servidor MySQL estiver atuando como uma replica e você estiver usando um local não permanente para `--tmpdir`, considere definir um diretório temporário diferente para a replica usando a variável de sistema `replica_load_tmpdir` ou `slave_load_tmpdir`. Para uma replica, os arquivos temporários usados para replicar as instruções `LOAD DATA` são armazenados neste diretório, então, com um local permanente, eles podem sobreviver a reinicializações de máquina, embora a replicação possa continuar após um reinício se os arquivos temporários tiverem sido removidos.

  Para obter mais informações sobre o local de armazenamento de arquivos temporários, consulte a Seção B.3.3.5, “Onde o MySQL armazena arquivos temporários”.

- `--upgrade=value`

  <table summary="Propriedades para funções de tabela de verificação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--check-table-functions=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.42</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ABORT</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>WARN</code>]]</p><p class="valid-value">[[<code>ABORT</code>]]</p></td> </tr></tbody></table>3

  Esta opção controla se o servidor realiza uma atualização automática ao iniciar e como. A atualização automática envolve dois passos:

  - Passo 1: Atualização do dicionário de dados.

    Essa etapa atualiza:

    - As tabelas do dicionário de dados no esquema `mysql`. Se a versão real do dicionário de dados for menor que a versão esperada atual, o servidor atualiza o dicionário de dados. Se não puder, ou não for permitido, o servidor não pode ser executado.

    - O Schema de Desempenho e `INFORMATION_SCHEMA`.

  - Passo 2: Atualização do servidor.

    Essa etapa inclui todas as outras tarefas de atualização. Se os dados de instalação existentes tiverem uma versão MySQL menor do que o servidor espera, eles devem ser atualizados:

    - As tabelas do sistema no esquema `mysql` (as tabelas restantes que não fazem parte do dicionário de dados).

    - O esquema `sys`.

    - Esquemas de usuários.

  Para obter detalhes sobre as etapas de atualização 1 e 2, consulte a Seção 3.4, “O que a atualização do MySQL atualiza”.

  Estes valores de opções `--upgrade` são permitidos:

  - `AUTO`

    O servidor realiza uma atualização automática de qualquer coisa que ele encontrar como desatualizada (passos 1 e 2). Esta é a ação padrão se `--upgrade` não for especificado explicitamente.

  - `NONE`

    O servidor não executa etapas de atualização automática durante o processo de inicialização (pula as etapas 1 e 2). Como esse valor de opção impede uma atualização do dicionário de dados, o servidor sai com um erro se o dicionário de dados for encontrado como estando desatualizado:

    ```
    [ERROR] [MY-013381] [Server] Server shutting down because upgrade is
    required, yet prohibited by the command line option '--upgrade=NONE'.
    [ERROR] [MY-010334] [Server] Failed to initialize DD Storage Engine
    [ERROR] [MY-010020] [Server] Data Dictionary initialization failed.
    ```

  - `MINIMAL`

    O servidor atualiza o dicionário de dados, o Schema de Desempenho e o `INFORMATION_SCHEMA`, se necessário (passo 1). Observe que, após uma atualização com essa opção, a Replicação por Grupo não pode ser iniciada, pois as tabelas do sistema nas quais o interno da replicação depende não são atualizadas, e a funcionalidade reduzida também pode ser aparente em outras áreas.

  - `FORCE`

    O servidor atualiza o dicionário de dados, o Schema de Desempenho e o `INFORMATION_SCHEMA`, se necessário (passo 1). Além disso, o servidor força uma atualização de tudo o mais (passo 2). Espere que o início do servidor demore mais tempo com essa opção, pois o servidor verifica todos os objetos em todos os esquemas.

    `FORCE` é útil para forçar a execução das ações do passo 2 se o servidor achar que elas não são necessárias. Por exemplo, você pode acreditar que uma tabela do sistema está faltando ou foi danificada e querer forçar uma reparação.

  A tabela a seguir resume as ações tomadas pelo servidor para cada valor da opção.

  <table summary="Propriedades para funções de tabela de verificação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--check-table-functions=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.42</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ABORT</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>WARN</code>]]</p><p class="valid-value">[[<code>ABORT</code>]]</p></td> </tr></tbody></table>4

- `--user={user_name|user_id}`, `-u {user_name|user_id}`

  <table summary="Propriedades para funções de tabela de verificação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--check-table-functions=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.42</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ABORT</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>WARN</code>]]</p><p class="valid-value">[[<code>ABORT</code>]]</p></td> </tr></tbody></table>5

  Execute o servidor **mysqld** como o usuário com o nome `user_name` ou o ID de usuário numérico `user_id`. (“Usuário” neste contexto se refere a uma conta de login do sistema, não a um usuário MySQL listado nas tabelas de concessão.)

  Esta opção é **obrigatória** ao iniciar o **mysqld** como `root`. O servidor altera seu ID de usuário durante a sequência de inicialização, fazendo com que ele seja executado como esse usuário específico, em vez de como `root`. Veja a Seção 8.1.1, “Diretrizes de Segurança”.

  Para evitar uma possível falha de segurança onde um usuário adiciona uma opção `--user=root` a um arquivo `my.cnf` (causando assim que o servidor seja executado como `root`), o **mysqld** usa apenas a primeira opção `--user` especificada e produz um aviso se houver múltiplas opções `--user`. As opções em `/etc/my.cnf` e `$MYSQL_HOME/my.cnf` são processadas antes das opções de linha de comando, portanto, recomenda-se que você coloque uma opção `--user` em `/etc/my.cnf` e especifique um valor diferente de `root`. A opção em `/etc/my.cnf` é encontrada antes de qualquer outra opção `--user`, o que garante que o servidor seja executado como um usuário diferente de `root` e que um aviso seja exibido se qualquer outra opção `--user` for encontrada.

- `--validate-config`

  <table summary="Propriedades para funções de tabela de verificação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--check-table-functions=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.42</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ABORT</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>WARN</code>]]</p><p class="valid-value">[[<code>ABORT</code>]]</p></td> </tr></tbody></table>6

  Valide a configuração de inicialização do servidor. Se não forem encontrados erros, o servidor termina com um código de saída de 0. Se um erro for encontrado, o servidor exibe uma mensagem de diagnóstico e termina com um código de saída de 1. Mensagens de aviso e informações também podem ser exibidas, dependendo do valor `log_error_verbosity`, mas não produzem a interrupção imediata da validação ou um código de saída de 1. Para mais informações, consulte a Seção 7.1.3, “Validação da Configuração do Servidor”.

- `--validate-user-plugins[={OFF|ON}]`

  <table summary="Propriedades para funções de tabela de verificação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--check-table-functions=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.42</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ABORT</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>WARN</code>]]</p><p class="valid-value">[[<code>ABORT</code>]]</p></td> </tr></tbody></table>7

  Se essa opção estiver habilitada (padrão), o servidor verifica cada conta de usuário e emite um aviso se forem encontradas condições que tornem a conta inutilizável:

  - A conta requer um plugin de autenticação que não está carregado.

  - A conta exige o plugin de autenticação `sha256_password` ou `caching_sha2_password`, mas o servidor foi iniciado sem SSL ou RSA habilitados, conforme exigido pelo plugin.

  Ativação de `--validate-user-plugins` desacelera a inicialização do servidor e `FLUSH PRIVILEGES`. Se você não precisar da verificação adicional, pode desativar essa opção no início para evitar a redução do desempenho.

- `--verbose`, `-v`

  Use esta opção com a opção `--help` para obter ajuda detalhada.

- `--version`, `-V`

  Exibir informações da versão e sair.
