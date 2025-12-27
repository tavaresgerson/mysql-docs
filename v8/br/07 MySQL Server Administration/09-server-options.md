### 7.1.7 Opções de Comando do Servidor

Ao iniciar o servidor `mysqld`, você pode especificar opções de programa usando qualquer um dos métodos descritos na Seção 6.2.2, “Especificando Opções de Programa”. Os métodos mais comuns são fornecer opções em um arquivo de opções ou na linha de comando. No entanto, na maioria dos casos, é desejável garantir que o servidor use as mesmas opções cada vez que for executado. A melhor maneira de garantir isso é listá-las em um arquivo de opções. Veja a Seção 6.2.2.2, “Usando Arquivos de Opções”. Essa seção também descreve o formato e a sintaxe do arquivo de opções.

`mysqld` lê opções dos grupos `[mysqld]` e `[server]`. `mysqld_safe` lê opções dos grupos `[mysqld]`, `[server]`, `[mysqld_safe]` e `[safe_mysqld]`. `mysql.server` lê opções dos grupos `[mysqld]` e `[mysql.server]`.

`mysqld` aceita muitas opções de comando. Para um resumo breve, execute este comando:

```
mysqld --help
```

Para ver a lista completa, use este comando:

```
mysqld --verbose --help
```

Alguns dos itens na lista são, na verdade, variáveis de sistema que podem ser definidas no início do servidor. Essas podem ser exibidas em tempo de execução usando a instrução `SHOW VARIABLES`. Alguns itens exibidos pelo comando `mysqld` anterior não aparecem na saída de `SHOW VARIABLES`; isso ocorre porque são opções e não variáveis de sistema.

A lista a seguir mostra algumas das opções de servidor mais comuns. Opções adicionais são descritas em outras seções:

* Opções que afetam a segurança: Consulte a Seção 8.1.4, “Opções e variáveis do mysqld relacionadas à segurança”.
* Opções relacionadas ao SSL: Consulte as Opções de comando para conexões criptografadas.
* Opções de controle do log binário: Consulte a Seção 7.4.4, “O log binário”.
* Opções relacionadas à replicação: Consulte a Seção 19.1.6, “Opções e variáveis de log binário e replicação”.
* Opções para carregar plugins, como motores de armazenamento plugáveis: Consulte a Seção 7.6.1, “Instalando e desinstalando plugins”.
* Opções específicas para motores de armazenamento particulares: Consulte a Seção 17.14, “Opções de inicialização do InnoDB e variáveis de sistema” e a Seção 18.2.1, “Opções de inicialização do MyISAM”.

Algumas opções controlam o tamanho dos buffers ou caches. Para um buffer dado, o servidor pode precisar alocar estruturas de dados internas. Essas estruturas são tipicamente alocadas a partir da memória total alocada ao buffer, e a quantidade de espaço necessária pode depender da plataforma. Isso significa que, quando você atribui um valor a uma opção que controla o tamanho de um buffer, a quantidade de espaço realmente disponível pode diferir do valor atribuído. Em alguns casos, a quantidade pode ser menor que o valor atribuído. Também é possível que o servidor ajuste um valor para cima. Por exemplo, se você atribuir um valor de 0 a uma opção para a qual o valor mínimo é 1024, o servidor define o valor para 1024.
Os valores para tamanhos de buffers, comprimentos e tamanhos de pilhas são fornecidos em bytes, a menos que especificado de outra forma.

Algumas opções aceitam valores de nomes de arquivos. A menos que especificado de outra forma, a localização padrão do arquivo é o diretório de dados se o valor for um nome de caminho relativo. Para especificar a localização explicitamente, use um nome de caminho absoluto. Suponha que o diretório de dados seja `/var/mysql/data`. Se uma opção com valor de arquivo for dada como um nome de caminho relativo, ela está localizada em `/var/mysql/data`. Se o valor for um nome de caminho absoluto, sua localização é conforme o nome do caminho.

Você também pode definir os valores das variáveis do sistema do servidor no momento do início do servidor usando nomes de variáveis como opções. Para atribuir um valor a uma variável do sistema do servidor, use uma opção do formato `--var_name=valor`. Por exemplo, `--sort_buffer_size=384M` define a variável `sort_buffer_size` para um valor de 384MB.

Quando você atribui um valor a uma variável, o MySQL pode corrigir automaticamente o valor para permanecer dentro de um determinado intervalo ou ajustar o valor para o valor mais próximo permitido, se apenas certos valores forem permitidos.

Para restringir o valor máximo ao qual uma variável do sistema pode ser definida em tempo de execução com a instrução `SET`, especifique esse máximo usando uma opção do formato `--maximum-var_name=valor` no momento do início do servidor.

Você pode alterar os valores da maioria das variáveis do sistema em tempo de execução com a instrução `SET`. Consulte a Seção 15.7.6.1, “Sintaxe SET para Atribuição de Variáveis”.

A Seção 7.1.8, “Variáveis do Sistema do Servidor”, fornece uma descrição completa de todas as variáveis e informações adicionais para configurá-las no momento do início do servidor e em tempo de execução. Para informações sobre alterar variáveis do sistema, consulte a Seção 7.1.1, “Configurando o Servidor”.

* `--help`, `-?`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Exibir uma mensagem de ajuda curta e sair. Use as opções `--verbose` e `--help` para ver a mensagem completa.
* `--allow-suspicious-udfs`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Esta opção controla se funções carregáveis que têm apenas um símbolo `xxx` para a função principal podem ser carregadas. Por padrão, a opção está desativada e apenas funções carregáveis que têm pelo menos um símbolo auxiliar podem ser carregadas; isso previne tentativas de carregar funções de arquivos de objeto compartilhado, exceto aqueles que contêm funções legítimas. Veja as Precauções de Segurança de Funções Carregáveis.
*  `--ansi`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--ansi</code></td> </tr></tbody></table>

  Use a sintaxe SQL padrão (ANSI) em vez da sintaxe MySQL. Para um controle mais preciso sobre o modo SQL do servidor, use a opção `--sql-mode` em vez disso. Veja a Seção 1.7, “Conformidade com Padrões MySQL” e a Seção 7.1.11, “Modos SQL do Servidor”.
*  `--basedir=dir_name`, `-b dir_name`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>basedir</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome de diretório</td> </tr><tr><th>Valor Padrão</th> <td><code>diretório de instalação do mysqld</code></td> </tr></tbody></table>

  O caminho para o diretório de instalação do MySQL. Esta opção define a variável de sistema `basedir`.

  O executável do servidor determina seu próprio nome de caminho completo no início e usa o pai do diretório em que está localizado como o valor padrão de `basedir`. Isso, por sua vez, permite que o servidor use esse `basedir` ao procurar informações relacionadas ao servidor, como o diretório `share` que contém mensagens de erro.
*  `--check-table-functions=value`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--check-table-functions=valor</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td><code>ABORT</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>WARN</code></p><p><code>ABORT</code></p></td> </tr></tbody></table>

  Ao realizar uma atualização do servidor, verificamos o dicionário de dados para funções usadas em restrições de tabela e outras expressões, incluindo expressões `DEFAULT`, expressões de particionamento e colunas virtuais. É possível que uma mudança no comportamento da função cause um erro na nova versão do servidor, onde nenhum erro ocorreu antes, caso em que a tabela não pode ser aberta. Esta opção oferece uma escolha sobre como lidar com tais problemas, de acordo com o qual dos dois valores mostrados aqui é usado:

  + `WARN`: Registra uma mensagem de aviso para cada tabela que não pode ser aberta.
  + `ABORT`: Também registra uma mensagem de aviso; além disso, a atualização é interrompida. Isso é o padrão. Para um valor suficientemente alto de `--log-error-verbosity`, também registra uma nota com uma definição de tabela simplificada listando apenas aquelas expressões que potencialmente contêm funções SQL.

  O comportamento padrão é abortar a atualização, para que o usuário possa corrigir o problema usando a versão mais antiga do servidor, antes de atualizar para a versão mais nova. Use `WARN` para continuar a atualização no modo interativo enquanto relata quaisquer problemas.

  A opção `--check-table-functions` foi introduzida no MySQL 8.4.5.
*  `--chroot=nome_diretório`, `-r nome_diretório`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--chroot=nome_diretório</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  Coloque o servidor `mysqld` em um ambiente fechado durante o início da inicialização usando a chamada de sistema `chroot()`. Esta é uma medida de segurança recomendada. O uso desta opção limita um pouco `LOAD DATA` e `SELECT ... INTO OUTFILE`.
*  `--console`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--console</code></td> </tr><tr><th>Específico da plataforma</th> <td>Windows</td> </tr></tbody></table>

  (Apenas para Windows.) Faça com que o destino padrão do log de erro seja a console. Isso afeta os pontos de destino de log que baseiam seu próprio destino de saída no destino padrão. Veja a Seção 7.4.2, “O Log de Erros”. O `mysqld` não fecha a janela da console se essa opção for usada.

   `--console` tem precedência sobre `--log-error` se ambas forem fornecidas.
*  `--core-file`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--core-file</code></td> </tr></tbody></table>

  Quando essa opção é usada, escreva um arquivo de núcleo se o `mysqld` morrer; não são necessários (ou aceitos) argumentos. O nome e a localização do arquivo de núcleo dependem do sistema. No Linux, um arquivo de núcleo chamado `core.pid` é escrito no diretório de trabalho atual do processo, que, para o `mysqld`, é o diretório de dados. *`pid`* representa o ID de processo do processo do servidor. No macOS, um arquivo de núcleo chamado `core.pid` é escrito no diretório `/cores`. No Solaris, use o comando **coreadm** para especificar onde escrever o arquivo de núcleo e como nomeá-lo.

  Em alguns sistemas, para obter um arquivo de núcleo, você também deve especificar a opção `--core-file-size` para `mysqld_safe`. Veja a Seção 6.3.2, “mysqld\_safe — Script de Inicialização do Servidor MySQL”. Em alguns sistemas, como o Solaris, você não obtém um arquivo de núcleo se também estiver usando a opção `--user`. Pode haver restrições ou limitações adicionais. Por exemplo, pode ser necessário executar **ulimit -c unlimited** antes de iniciar o servidor. Consulte a documentação do seu sistema.

  A variável `innodb_buffer_pool_in_core_file` pode ser usada para reduzir o tamanho dos arquivos de núcleo em sistemas operacionais que a suportam. Para mais informações, consulte a Seção 17.8.3.7, “Excluindo ou Incluindo Páginas do Pool de Buffer nos Arquivos de Núcleo”.
*  `--daemonize`, `-D`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--daemonize[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Esta opção faz com que o servidor seja executado como um daemon tradicional, que se divide, permitindo que ele trabalhe com sistemas operacionais que usam o systemd para controle de processos. Para mais informações, consulte a Seção 2.5.9, “Gerenciamento do Servidor MySQL com o systemd”.

   `--daemonize` é mutuamente exclusivo de  `--initialize` e `--initialize-insecure`.

  Se o servidor for iniciado usando a opção `--daemonize` e não estiver conectado a um dispositivo tty, uma opção padrão de registro de erros de `--log-error=""` é usada na ausência de uma opção de registro explícita, para direcionar a saída de erros para o arquivo de log padrão.

   `-D` é um sinônimo de `--daemonize`.
*  `--datadir=dir_name`, `-h dir_name`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--datadir=dir_name</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>datadir</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome de diretório</td> </tr></tbody></table>

  O caminho para o diretório de dados do servidor MySQL. Esta opção define a variável do sistema `datadir`. Veja a descrição dessa variável.
*  `--debug[=debug_options]`, `-# [debug_options]`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--debug[=debug_options]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>debug</code></td> </tr><tr><th>Alcance</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão (Unix)</th> <td><code>d:t:i:o,/tmp/mysqld.trace</code></td> </tr><tr><th>Valor Padrão (Windows)</th> <td><code>d:t:i:O,\mysqld.trace</code></td> </tr></tbody></table>

Se o MySQL estiver configurado com a opção `-DWITH_DEBUG=1` do `CMake`, você pode usar essa opção para obter um arquivo de registro do que o `mysqld` está fazendo. Uma string típica de *`debug_options`* é `d:t:o,nome_do_arquivo`. O padrão é `d:t:i:o,/tmp/mysqld.trace` no Unix e `d:t:i:O,\mysqld.trace` no Windows.

Usar `-DWITH_DEBUG=1` para configurar o MySQL com suporte de depuração permite que você use a opção `--debug="d,parser_debug"` ao iniciar o servidor. Isso faz com que o analisador Bison, que é usado para processar declarações SQL, armazene um registro do analisador na saída de erro padrão do servidor. Normalmente, essa saída é escrita no log de erro.

Esta opção pode ser dada várias vezes. Valores que começam com `+` ou `-` são adicionados ou subtraídos do valor anterior. Por exemplo, `--debug=T` `--debug=+P` define o valor para `P:T`.

Para mais informações, consulte a Seção 7.9.4, “O Pacote DBUG”.
*  `--debug-sync-timeout[=N]`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--debug-sync-timeout[=#]</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr></tbody></table>

Controla se a facilidade de Sincronização de Depuração para testes e depuração está habilitada. O uso da Sincronização de Depuração requer que o MySQL esteja configurado com a opção `-DWITH_DEBUG=ON` do `CMake` (consulte a Seção 2.8.7, “Opções de Configuração de Código-Fonte do MySQL”); caso contrário, essa opção não está disponível. O valor da opção é um tempo de espera em segundos. O valor padrão é 0, o que desabilita a Sincronização de Depuração. Para a ativá-la, especifique um valor maior que 0; esse valor também se torna o tempo de espera padrão para pontos de sincronização individuais. Se a opção for dada sem um valor, o tempo de espera é definido para 300 segundos.

Para uma descrição da facilidade de Sincronização de Depuração e como usar pontos de sincronização, consulte MySQL Internals: Test Synchronization.
*  `--default-time-zone=timezone`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--default-time-zone=nome</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

Defina o fuso horário padrão do servidor. Esta opção define a variável de sistema `time_zone`. Se esta opção não for fornecida, o fuso horário padrão será o mesmo do fuso horário do sistema (dado pelo valor da variável de sistema `system_time_zone`.

  A variável `system_time_zone` difere da `time_zone`. Embora possam ter o mesmo valor, a última variável é usada para inicializar o fuso horário para cada cliente que se conecta. Consulte a Seção 7.1.15, “Suporte ao Fuso Horário do Servidor MySQL”.
*  `--defaults-extra-file=file_name`

  Leia este arquivo de opção após o arquivo de opção global, mas (em Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual. Isso deve ser a primeira opção na linha de comando se for usada.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opção, consulte a Seção 6.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opção”.
*  `--defaults-file=file_name`

  Leia apenas o arquivo de opção fornecido. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Exceção: Mesmo com `--defaults-file`, o `mysqld` lê `mysqld-auto.cnf`.

  ::: info Nota

  Isso deve ser a primeira opção na linha de comando se for usada, exceto que se o servidor for iniciado com as opções `--defaults-file` e `--install` (ou `--install-manual`), `--install` (ou `--install-manual`) deve ser a primeira.

  :::

Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, `mysqld` normalmente lê o grupo `[mysqld]`. Se esta opção for dada como `--defaults-group-suffix=_other`, `mysqld` também lê o grupo `[mysqld_other]`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte  Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opções”.
*  `--early-plugin-load=plugin_list`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--early-plugin-load=plugin_list</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>string vazia</code></td> </tr></tbody></table>

  Esta opção indica ao servidor quais plugins carregar antes de carregar plugins embutidos obrigatórios e antes da inicialização do mecanismo de armazenamento. O carregamento antecipado é suportado apenas para plugins compilados com `PLUGIN_OPT_ALLOW_EARLY`. Se várias opções `--early-plugin-load` forem dadas, apenas a última se aplica.

  O valor da opção é uma lista separada por ponto-e-vírgula de *`plugin_library`* e *`name`*`=`*`plugin_library`* valores. Cada *`plugin_library`* é o nome de um arquivo de biblioteca que contém o código do plugin, e cada *`name`* é o nome de um plugin a ser carregado. Se uma biblioteca de plugin for nomeada sem qualquer nome de plugin anterior, o servidor carrega todos os plugins da biblioteca. Com um nome de plugin anterior, o servidor carrega apenas o plugin nomeado da biblioteca. O servidor procura por arquivos de biblioteca de plugins no diretório nomeado pela variável de sistema `plugin_dir`.

  Por exemplo, se os plugins chamados `myplug1` e `myplug2` estiverem contidos nos arquivos de biblioteca de plugins `myplug1.so` e `myplug2.so`, use esta opção para realizar um carregamento antecipado de plugins:

  ```
  mysqld --early-plugin-load="myplug1=myplug1.so;myplug2=myplug2.so"
  ```

  Aspas rodeiam o valor do argumento porque, caso contrário, alguns interpretadores de comandos interpretam ponto-e-vírgula (`;`) como um caractere especial. (Por exemplo, shells Unix o tratam como um caractere de terminação de comando.)

Cada plugin nomeado é carregado precocemente para uma única invocação do `mysqld`. Após um reinício, o plugin não é carregado precocemente, a menos que a opção `--early-plugin-load` seja usada novamente.

Se o servidor for iniciado usando `--initialize` ou `--initialize-insecure`, os plugins especificados por `--early-plugin-load` não são carregados.

Se o servidor for executado com `--help`, os plugins especificados por `--early-plugin-load` são carregados, mas não inicializados. Esse comportamento garante que as opções do plugin sejam exibidas na mensagem de ajuda.

A criptografia do espaço de tabelas `InnoDB` depende do Keychain do MySQL para a gestão das chaves de criptografia, e o plugin keychain deve ser carregado antes da inicialização do mecanismo de armazenamento para facilitar a recuperação do `InnoDB` para tabelas criptografadas. Por exemplo, os administradores que desejam que o plugin `keyring_okv` seja carregado no início devem usar `--early-plugin-load` com o valor apropriado da opção (como `keyring_okv.so` em sistemas Unix e Unix-like ou `keyring_okv.dll` em sistemas Windows).

Para informações sobre a criptografia do espaço de tabelas `InnoDB`, consulte a Seção 17.13, “Criptografia de Dados em Armazenamento do `InnoDB`”. Para informações gerais sobre o carregamento de plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

::: info Nota

Para o Keychain do MySQL, essa opção é usada apenas quando o keystore é gerenciado com um plugin keychain. Se a gestão do keystore usar um componente keychain em vez de um plugin, especifique o carregamento do componente usando um arquivo de manifesto; consulte a Seção 8.4.4.2, “Instalação de Componentes Keychain”.

:::

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--external-locking[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Ative o bloqueio externo (bloqueio do sistema), que está desativado por padrão. Se você usar essa opção em um sistema em que o `lockd` não funciona completamente (como no Linux), é fácil que o `mysqld` fique em um impasse.

  Para desativar o bloqueio externo explicitamente, use `--skip-external-locking`.

  O bloqueio externo afeta apenas o acesso à tabela `MyISAM`. Para mais informações, incluindo as condições em que ele pode e não pode ser usado, consulte a Seção 10.11.5, “Bloqueio Externo”.
*  `--flush`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--flush[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>flush</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da dica `SET_VAR`</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Esvazie (sincronize) todas as alterações no disco após cada instrução SQL. Normalmente, o MySQL escreve todas as alterações no disco apenas após cada instrução SQL e deixa o sistema operacional lidar com a sincronização no disco. Consulte a Seção B.3.3.3, “O que fazer se o MySQL continuar a falhar”.

  ::: info Nota

  Se `--flush` for especificado, o valor de `flush_time` não importa e alterações em `flush_time` não têm efeito no comportamento do esvaziamento.

  :::

*  `--gdb`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--gdb[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Instale um manipulador de interrupção para `SIGINT` (necessário para parar o `mysqld` com `^C` para definir pontos de interrupção) e desative o rastreamento de pilha e o gerenciamento de arquivos de núcleo. Consulte a Seção 7.9.1.4, “Depuração do mysqld no gdb”.

Em sistemas Windows, essa opção também suprime o forking utilizado para implementar a instrução `RESTART`: o forking permite que um processo atue como monitor do outro, que atua como servidor. No entanto, o forking dificulta a determinação do processo do servidor para se conectar para depuração, portanto, iniciar o servidor com `--gdb` suprime o forking. Para um servidor iniciado com essa opção, `RESTART` simplesmente encerra e não reinicia.

Em configurações não de depuração, `--no-monitor` pode ser usado para suprimir o forking do processo de monitor.
* `--initialize`, `-I`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--initialize[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Essa opção é usada para inicializar uma instalação do MySQL criando o diretório de dados e preenchendo as tabelas no esquema do sistema `mysql`. Para mais informações, consulte a Seção 2.9.1, “Inicializando o Diretório de Dados”.

  Essa opção limita os efeitos de, ou não é compatível com, vários outros opções de inicialização do servidor MySQL. Algumas das questões mais comuns desse tipo são mencionadas aqui:

Recomendamos fortemente, ao inicializar o diretório de dados com `--initialize`, que você não especifique outras opções além de `--datadir`, outras opções usadas para definir localizações de diretórios, como `--basedir`, e possivelmente `--user`, se necessário. As opções para o servidor MySQL em execução podem ser especificadas ao iniciá-lo após a inicialização ter sido concluída e o `mysqld` ter sido desligado. Isso também se aplica ao uso de `--initialize-insecure` em vez de `--initialize`.
+ Quando o servidor é iniciado com `--initialize`, algumas funcionalidades estão indisponíveis, o que limita as instruções permitidas em qualquer arquivo nomeado pela variável de sistema `init_file`. Para mais informações, consulte a descrição dessa variável. Além disso, a variável de sistema `disabled_storage_engines` não tem efeito.
+ A opção `--ndbcluster` é ignorada quando usada juntamente com `--initialize`.
+ `--initialize` é mutuamente exclusivo de `--bootstrap` e `--daemonize`.
Os itens na lista anterior também se aplicam ao inicializar o servidor usando a opção `--initialize-insecure`.
* `--initialize-insecure`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--initialize-insecure[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Esta opção é usada para inicializar uma instalação do MySQL criando o diretório de dados e preenchendo as tabelas no esquema de sistema `mysql`. Esta opção implica `--initialize`, e as mesmas restrições e limitações se aplicam; para mais informações, consulte a descrição dessa opção e a Seção 2.9.1, “Inicializando o Diretório de Dados”.

Aviso

Esta opção cria um usuário `root` do MySQL com uma senha vazia, o que é inseguro. Por essa razão, não use essa opção em produção sem definir manualmente essa senha. Consulte a atribuição de senha do usuário `root` após a inicialização para obter informações sobre como fazer isso.
* `--innodb-xxx`

Defina uma opção para o mecanismo de armazenamento `InnoDB`. As opções do `InnoDB` estão listadas na Seção 17.14, “Opções de inicialização do InnoDB e variáveis de sistema”.
* `--install [nome_do_serviço]`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--install [nome_do_serviço]</code></td> </tr><tr><th>Especifica a plataforma</th> <td>Windows</td> </tr></tbody></table>

  (Apenas para Windows) Instale o servidor como um serviço do Windows que inicia automaticamente durante o início do Windows. O nome padrão do serviço é `MySQL` se nenhum valor de *`nome_do_serviço`* for fornecido. Para mais informações, consulte a Seção 2.3.3.8, “Iniciando o MySQL como um serviço do Windows”.

  ::: info Nota

  Se o servidor for iniciado com as opções `--defaults-file` e `--install`, `--install` deve ser a primeira opção.

  :::

* `--install-manual [nome_do_serviço]`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--install-manual [nome_do_serviço]</code></td> </tr><tr><th>Especifica a plataforma</th> <td>Windows</td> </tr></tbody></table>

  (Apenas para Windows) Instale o servidor como um serviço do Windows que deve ser iniciado manualmente. Ele não inicia automaticamente durante o início do Windows. O nome padrão do serviço é `MySQL` se nenhum valor de *`nome_do_serviço`* for fornecido. Para mais informações, consulte a Seção 2.3.3.8, “Iniciando o MySQL como um serviço do Windows”.

  ::: info Nota

  Se o servidor for iniciado com as opções `--defaults-file` e `--install-manual`, `--install-manual` deve ser a primeira opção.

  :::

* `--large-pages`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--large-pages[={OFF|ON}]</code></td> </tr><tr><th>Variável de sistema</th> <td><code>large_pages</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Aplicação da dica <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Especifica a plataforma</th> <td>Linux</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Algumas arquiteturas de hardware/sistema operacional suportam páginas de memória maiores que o padrão (geralmente 4KB). A implementação real deste suporte depende do hardware e do sistema operacional subjacentes. Aplicações que realizam muitos acessos à memória podem obter melhorias de desempenho ao usar páginas grandes devido à redução de erros no Buffer de Busca de Tradução (TLB).

O MySQL suporta a implementação do Linux de suporte a páginas grandes (que é chamada de HugeTLB no Linux). Veja a Seção 10.12.3.3, “Habilitar Suporte a Páginas Grandes”. Para o suporte de páginas grandes do Solaris, consulte a descrição da opção `--super-large-pages`.

`--large-pages` é desativado por padrão.
*  `--lc-messages=nome_idioma`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--lc-messages=nome</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>lc_messages</code></td> </tr><tr><th>Alcance</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>en_US</code></td> </tr></tbody></table>

O idioma a ser usado para mensagens de erro. O padrão é `en_US`. O servidor converte o argumento para um nome de idioma e o combina com o valor de `--lc-messages-dir` para produzir a localização do arquivo de mensagem de erro. Veja a Seção 12.12, “Definir o Idioma da Mensagem de Erro”.
*  `--lc-messages-dir=nome_pasta`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--lc-messages-dir=nome_pasta</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>lc_messages_dir</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Aplicação de Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome de pasta</td> </tr></tbody></table>

O diretório onde as mensagens de erro estão localizadas. O servidor usa o valor juntamente com o valor de `--lc-messages` para determinar a localização do arquivo de mensagem de erro. Veja a Seção 12.12, “Definindo o idioma da mensagem de erro”.
*  `--local-service`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--local-service</code></td> </tr></tbody></table>

  (Apenas no Windows) A opção `--local-service` após o nome do serviço faz com que o servidor seja executado usando a conta `LocalService` do Windows, que tem privilégios de sistema limitados. Se `--defaults-file` e `--local-service` forem fornecidos após o nome do serviço, eles podem ser em qualquer ordem. Veja a Seção 2.3.3.8, “Iniciando o MySQL como um serviço do Windows”.
*  `--log-error[=file_name]`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--log-error[=file_name]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>log_error</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dica <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Defina o destino padrão do log de erro para o arquivo nomeado. Isso afeta os pontos de destino de log que baseiam seu próprio destino de saída no destino padrão. Veja a Seção 7.4.2, “O log de erro”.

  Se a opção não especificar nenhum arquivo, o destino padrão do log de erro em sistemas Unix e Unix-like é um arquivo chamado `host_name.err` no diretório de dados. O destino padrão no Windows é o mesmo, a menos que a opção `--pid-file` seja especificada. Nesse caso, o nome do arquivo é o nome de base do arquivo de PID com um sufixo de `.err` no diretório de dados.

  Se a opção especificar um arquivo, o destino padrão é esse arquivo (com um sufixo `.err` adicionado se o nome não tiver sufixo), localizado sob o diretório de dados, a menos que um nome de caminho absoluto seja fornecido para especificar uma localização diferente.

  Se a saída do log de erro não puder ser redirecionada para o arquivo de log de erro, uma mensagem de erro ocorre e a inicialização falha.

Em Windows, `--console` tem precedência sobre `--log-error` se ambos forem fornecidos. Neste caso, o destino padrão do log de erros é o console, em vez de um arquivo.
*  `--log-isam[=nome_arquivo]`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--log-isam[=nome_arquivo]</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Registre todas as alterações do `MyISAM` neste arquivo (usado apenas durante a depuração do `MyISAM`).
*  `--log-raw`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--log-raw[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>log_raw</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da dica <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  As senhas em certas declarações escritas no log de consultas gerais, no log de consultas lentas e no log binário são reescritas pelo servidor para não ocorrerem literalmente em texto plano. A reescrita de senhas pode ser suprimida para o log de consultas gerais iniciando o servidor com a opção `--log-raw`. Esta opção pode ser útil para fins de diagnóstico, para ver o texto exato das declarações recebidas pelo servidor, mas por razões de segurança não é recomendada para uso em produção.

  Se um plugin de reescrita de consultas estiver instalado, a opção `--log-raw` afeta o registro de declarações da seguinte forma:

  + Sem  `--log-raw`, o servidor registra a declaração devolvida pelo plugin de reescrita de consultas. Isso pode diferir da declaração recebida.
  + Com  `--log-raw`, o servidor registra a declaração original recebida.

  Para mais informações, consulte  Seção 8.1.2.3, “Senhas e Registro”.
*  `--log-short-format`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--log-short-format[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Registre menos informações no log de consultas lentas, se ele tiver sido ativado.
* `--log-tc=nome_do_arquivo`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--log-tc=nome_do_arquivo</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>tc.log</code></td> </tr></tbody></table>

  O nome do arquivo de log do coordenador de transações mapeado à memória (para transações XA que afetam múltiplos mecanismos de armazenamento quando o log binário está desativado). O nome padrão é `tc.log`. O arquivo é criado no diretório de dados, se não for fornecido como um nome de caminho completo. Esta opção não é usada.
* `--log-tc-size=tamanho`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--log-tc-size=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>6 * tamanho_da_página</code></td> </tr><tr><th>Valor mínimo</th> <td><code>6 * tamanho_da_página</code></td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr></tbody></table>

  O tamanho em bytes do log do coordenador de transações mapeado à memória. Os valores padrão e mínimos são 6 vezes o tamanho da página, e o valor deve ser um múltiplo do tamanho da página.
* `--memlock`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--memlock[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Bloquear o processo  `mysqld` na memória. Esta opção pode ajudar se você tiver um problema em que o sistema operacional está fazendo o  `mysqld` trocar para o disco.

`--memlock` funciona em sistemas que suportam a chamada de sistema `mlockall()`; isso inclui Solaris, a maioria das distribuições Linux que usam um kernel 2.4 ou superior e talvez outros sistemas Unix. Em sistemas Linux, você pode verificar se `mlockall()` (e, portanto, essa opção) é suportada verificando se está definida no arquivo `mman.h` do sistema, da seguinte forma:

```
  $> grep mlockall /usr/include/sys/mman.h
  ```

Se `mlockall()` for suportada, você deve ver na saída do comando anterior algo como o seguinte:

```
  extern int mlockall (int __flags) __THROW;
  ```

Importante

O uso desta opção pode exigir que você execute o servidor como `root`, o que, por razões de segurança, normalmente não é uma boa ideia. Veja a Seção 8.1.5, “Como executar o MySQL como um usuário normal”.

Em Linux e talvez em outros sistemas, você pode evitar a necessidade de executar o servidor como `root` alterando o arquivo `limits.conf`. Veja as notas sobre o limite de memlock na Seção 10.12.3.3, “Habilitar suporte a páginas grandes”.

Você não deve usar esta opção em um sistema que não suporte a chamada de sistema `mlockall()`; se você o fizer, o `mysqld` provavelmente encerrará assim que você tentar iniciá-lo.
*  `--myisam-block-size=N`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--myisam-block-size=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>1024</code></td> </tr><tr><th>Valor mínimo</th> <td><code>1024</code></td> </tr><tr><th>Valor máximo</th> <td><code>16384</code></td> </tr></tbody></table>

O tamanho de bloco a ser usado para as páginas de índice `MyISAM`.
*  `--mysql-native-password`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--mysql-native-password={OFF|ON}</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Ative o plugin de autenticação `mysql_native_password`, que está desativado por padrão no MySQL 8.4.

Para obter mais informações, consulte a Seção 8.4.1.1, “Autenticação Puxável Native”.
* `--no-defaults`

  Não leia nenhum arquivo de opção. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opção, `--no-defaults` pode ser usado para impedir que sejam lidas. Isso deve ser a primeira opção na linha de comando se for usada.

  Para obter informações adicionais sobre isso e outras opções de arquivo de opção, consulte a Seção 6.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opção”.
* `--no-monitor`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--no-monitor[={OFF|ON}]</code></td> </tr><tr><th>Plataforma Específica</th> <td>Windows</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  (Apenas para Windows). Esta opção suprime o forking que é usado para implementar a declaração `RESTART`: o forking permite que um processo atue como monitor do outro, que atua como o servidor. Para um servidor iniciado com esta opção, `RESTART` simplesmente sai e não reinicia.
* `--performance-schema-xxx`

  Configure uma opção do Schema de Desempenho. Para detalhes, consulte a Seção 29.14, “Opções de Comando do Schema de Desempenho”.
* `--plugin-load=plugin_list`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--plugin-load=plugin_list</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Esta opção indica ao servidor que carrega os plugins nomeados no início. Se várias opções `--plugin-load` forem fornecidas, apenas a última se aplica. Plugins adicionais a serem carregados podem ser especificados usando as opções `--plugin-load-add`.

O valor da opção é uma lista separada por ponto e vírgula de valores de *`plugin_library`* e *`name`*=`*`plugin_library*`. Cada *`plugin_library`* é o nome de um arquivo de biblioteca que contém o código do plugin, e cada *`name`* é o nome de um plugin a ser carregado. Se uma biblioteca de plugin estiver nomeada sem qualquer nome de plugin anterior, o servidor carrega todos os plugins da biblioteca. Com um nome de plugin anterior, o servidor carrega apenas o plugin nomeado da biblioteca. O servidor procura por arquivos de biblioteca de plugin no diretório nomeado pela variável de sistema `plugin_dir`.

Por exemplo, se os plugins chamados `myplug1` e `myplug2` estiverem contidos nos arquivos de biblioteca de plugin `myplug1.so` e `myplug2.so`, use esta opção para realizar um carregamento de plugin antecipado:

```
  mysqld --plugin-load="myplug1=myplug1.so;myplug2=myplug2.so"
  ```

Aspas rodeiam o valor do argumento porque, caso contrário, alguns interpretadores de comandos interpretam o ponto e vírgula (`;`) como um caractere especial. (Por exemplo, as shells Unix o tratam como um terminal de comando.)

Cada plugin nomeado é carregado apenas para uma invocação única do `mysqld`. Após uma reinicialização, o plugin não é carregado a menos que `--plugin-load` seja usado novamente. Isso contrasta com `INSTALL PLUGIN`, que adiciona uma entrada na tabela `mysql.plugins` para fazer com que o plugin seja carregado para cada inicialização normal do servidor.

Durante a sequência de inicialização normal, o servidor determina quais plugins carregar lendo a tabela de sistema `mysql.plugins`. Se o servidor for iniciado com a opção `--skip-grant-tables`, os plugins registrados na tabela `mysql.plugins` não são carregados e estão indisponíveis. `--plugin-load` permite que plugins sejam carregados mesmo quando `--skip-grant-tables` é fornecido. `--plugin-load` também permite que plugins sejam carregados no início que não podem ser carregados em tempo de execução.

Esta opção não define uma variável de sistema correspondente. A saída de  `SHOW PLUGINS` fornece informações sobre os plugins carregados. Informações mais detalhadas podem ser encontradas na tabela do Esquema de Informações `PLUGINS`. Veja a Seção 7.6.2, “Obtendo Informações de Plugins do Servidor”.

Para obter informações adicionais sobre o carregamento de plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.
* `--plugin-load-add=plugin_list`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--plugin-load-add=plugin_list</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Esta opção complementa a opção `--plugin-load`. `--plugin-load-add` adiciona um ou mais plugins ao conjunto de plugins a serem carregados ao inicializar. O formato do argumento é o mesmo que para `--plugin-load`. `--plugin-load-add` pode ser usado para evitar especificar um grande conjunto de plugins como um único argumento longo e complicado `--plugin-load`.

   `--plugin-load-add` pode ser fornecido na ausência de `--plugin-load`, mas qualquer instância de `--plugin-load-add` que apareça antes de `--plugin-load` não tem efeito porque `--plugin-load` redefreia o conjunto de plugins a serem carregados. Em outras palavras, essas opções:

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

  Esta opção não define uma variável de sistema correspondente. A saída do comando `SHOW PLUGINS` fornece informações sobre os plugins carregados. Informações mais detalhadas podem ser encontradas na tabela do esquema de informações `PLUGINS`. Consulte a Seção 7.6.2, “Obtendo Informações de Plugins do Servidor”.

  Para obter informações adicionais sobre o carregamento de plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.
* `--plugin-xxx`

  Especifica uma opção que pertence a um plugin do servidor. Por exemplo, muitos motores de armazenamento podem ser construídos como plugins, e para tais motores, as opções para eles podem ser especificadas com um prefixo `--plugin`. Assim, a opção `--innodb-file-per-table` para o `InnoDB` pode ser especificada como `--plugin-innodb-file-per-table`.

Para opções booleanas que podem ser habilitadas ou desabilitadas, o prefixo `--skip` e outros formatos alternativos são suportados também (veja a Seção 6.2.2.4, “Modificadores de Opção do Programa”). Por exemplo, `--skip-plugin-innodb-file-per-table` desabilita `innodb-file-per-table`.

A razão para o prefixo `--plugin` é que ele permite especificar opções de plugin de forma inequívoca, caso haja um conflito de nome com uma opção de servidor embutida. Por exemplo, se um escritor de plugin nomear um plugin como “sql” e implementar uma opção “mode”, o nome da opção pode ser `--sql-mode`, o que entraria em conflito com a opção embutida do mesmo nome. Nesses casos, as referências ao nome em conflito são resolvidas em favor da opção embutida. Para evitar a ambiguidade, os usuários podem especificar a opção do plugin como `--plugin-sql-mode`. O uso do prefixo `--plugin` para opções de plugin é recomendado para evitar qualquer dúvida de ambiguidade.
*  `--port=port_num`, `-P port_num`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--port=port_num</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>port</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hint do <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>3306</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  O número de porta a ser usado ao ouvir conexões TCP/IP. Em sistemas Unix e similares, o número de porta deve ser 1024 ou maior, a menos que o servidor seja iniciado pelo usuário do sistema operacional `root`. Definir essa opção para 0 faz com que o valor padrão seja usado.
*  `--port-open-timeout=num`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--port-open-timeout=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>0</code></td> </tbody></table>

Em alguns sistemas, quando o servidor é parado, a porta TCP/IP pode não ficar disponível imediatamente. Se o servidor for reiniciado rapidamente depois disso, sua tentativa de reabrir a porta pode falhar. Esta opção indica quantos segundos o servidor deve esperar para que a porta TCP/IP fique livre se não puder ser aberta. O padrão é não esperar.
* `--print-defaults`

  Imprima o nome do programa e todas as opções que ele obtém de arquivos de opções. Os valores das senhas são mascarados. Esta deve ser a primeira opção na linha de comando se for usada, exceto que pode ser usada imediatamente após `--defaults-file` ou `--defaults-extra-file`.

  Para obter informações adicionais sobre esta e outras opções de arquivos de opções, consulte  Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opções”.
* `--remove [nome_do_serviço]`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--remove [nome_do_serviço]</code></td> </tr><tr><th>Especifica plataforma</th> <td>Windows</td> </tr></tbody></table>

  (Apenas Windows) Remova um serviço MySQL no Windows. O nome padrão do serviço é `MySQL` se nenhum valor de *`nome_do_serviço`* for fornecido. Para mais informações, consulte  Seção 2.3.3.8, “Iniciar o MySQL como um serviço do Windows”.
* `--safe-user-create`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--safe-user-create[={OFF|ON}]</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Se esta opção estiver habilitada, um usuário não pode criar novos usuários MySQL usando a instrução `GRANT` a menos que o usuário tenha o privilégio `INSERT` para a tabela de sistema `mysql.user` ou qualquer coluna na tabela. Se você deseja que um usuário tenha a capacidade de criar novos usuários que tenham esses privilégios que o usuário tem o direito de conceder, você deve conceder ao usuário o seguinte privilégio:

  ```
  GRANT INSERT(user) ON mysql.user TO 'user_name'@'host_name';
  ```

Isso garante que o usuário não possa alterar diretamente as colunas de privilégio, mas deve usar a instrução `GRANT` para conceder privilégios a outros usuários.
*  `--skip-grant-tables`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--skip-grant-tables[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Esta opção afeta a sequência de inicialização do servidor:

  +  `--skip-grant-tables` faz com que o servidor não leia as tabelas de concessão no esquema do sistema `mysql`, e, portanto, inicie sem usar o sistema de privilégios. Isso dá a qualquer pessoa com acesso ao servidor *acesso ilimitado a todas as bases de dados*.

    Como iniciar o servidor com `--skip-grant-tables` desativa as verificações de autenticação, o servidor também desativa as conexões remotas nesse caso, ativando `skip_networking`.

    Para fazer com que um servidor iniciado com `--skip-grant-tables` carregue as tabelas de concessão em tempo de execução, execute uma operação de limpeza de privilégios, que pode ser feita da seguinte maneira:

    - Emite uma instrução `FLUSH PRIVILEGES` do MySQL após se conectar ao servidor.
    - Execute um comando `mysqladmin flush-privileges` ou `mysqladmin reload` da linha de comando.

    A limpeza de privilégios também pode ocorrer implicitamente como resultado de outras ações realizadas após a inicialização, fazendo com que o servidor comece a usar as tabelas de concessão. Por exemplo, o servidor limpa os privilégios se realizar uma atualização durante a sequência de inicialização.
  +  `--skip-grant-tables` desativa o rastreamento de logins falhos e o bloqueio temporário de contas, porque essas capacidades dependem das tabelas de concessão. Veja  Seção 8.2.15, “Gestão de Senhas”.
  +  `--skip-grant-tables` faz com que o servidor não carregue certos outros objetos registrados no dicionário de dados ou no esquema do sistema `mysql`:

- Eventos agendados instalados usando `CREATE EVENT` e registrados na tabela `events` do dicionário de dados.
- Plugins instalados usando `INSTALL PLUGIN` e registrados na tabela `mysql.plugin` do sistema.

Para fazer com que os plugins sejam carregados mesmo quando usar `--skip-grant-tables`, use a opção  `--plugin-load` ou  `--plugin-load-add`.
- Funções carregáveis instaladas usando `CREATE FUNCTION` e registradas na tabela `mysql.func` do sistema.

`--skip-grant-tables` *não* suprime o carregamento durante o inicialização de componentes.
+ `--skip-grant-tables` faz com que a variável de sistema `disabled_storage_engines` não tenha efeito.
* `--skip-new`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--skip-new</code></td> </tr><tr><th>Descontinuado</th> <td>Sim</td> </tr></tbody></table>

Esta opção desabilita (o que costumava ser considerado) comportamentos novos, possivelmente inseguros. Isso resulta nestas configurações: `delay_key_write=OFF`, `concurrent_insert=NEVER`, `automatic_sp_privileges=OFF`. Também faz com que `OPTIMIZE TABLE` seja mapeado para `ALTER TABLE` para motores de armazenamento para os quais `OPTIMIZE TABLE` não é suportado.

Esta opção está desatualizada e sujeita à remoção em uma futura versão.
* `--skip-show-database`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--skip-show-database</code></td> </tr><tr><th>Variável de sistema</th> <td><code>skip_show_database</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Aplicação da dica `SET_VAR`</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Esta opção define a variável de sistema `skip_show_database` que controla quem é permitido usar a instrução `SHOW DATABASES`. Veja a Seção 7.1.8, “Variáveis de sistema do servidor”.
* `--skip-stack-trace`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--skip-stack-trace</code></td> </tr></tbody></table>

Não escreva traços de pilha. Esta opção é útil quando você está executando o `mysqld` sob um depurador. Em alguns sistemas, você também deve usar esta opção para obter um arquivo de núcleo. Veja a Seção 7.9, “Depuração do MySQL”.
* `--slow-start-timeout=timeout`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--slow-start-timeout=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>15000</code></td> </tr></tbody></table>

  Esta opção controla o tempo de espera do gerenciador de serviços do Windows para iniciar o serviço. O valor é o número máximo de milissegundos que o gerenciador de serviços espera antes de tentar interromper o serviço do Windows durante o inicialização. O valor padrão é 15000 (15 segundos). Se o serviço MySQL demorar muito para iniciar, você pode precisar aumentar este valor. Um valor de 0 significa que não há tempo de espera.
* `--socket=caminho`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--socket={nome_de_arquivo|nome_de_canal}</code></td> </tr><tr><th>Variável do sistema</th> <td><code>socket</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dica <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão (Windows)</th> <td><code>MySQL</code></td> </tr><tr><th>Valor padrão (Outros)</th> <td><code>/tmp/mysql.sock</code></td> </tr></tbody></table>

  Em Unix, esta opção especifica o arquivo de soquete Unix a ser usado ao ouvir conexões locais. O valor padrão é `/tmp/mysql.sock`. Se esta opção for fornecida, o servidor cria o arquivo no diretório de dados, a menos que um nome de caminho absoluto seja fornecido para especificar um diretório diferente. Em Windows, a opção especifica o nome do canal a ser usado ao ouvir conexões locais que usam um canal nomeado. O valor padrão é `MySQL` (não case-sensitive).
* `--sql-mode=valor[,valor[,valor...]]`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--sql-mode=nome</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>sql_mode</code></td> </tr><tr><th>Alcance</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Definir</td> </tr><tr><th>Valor Padrão</th> <td><code>ONLY_FULL_GROUP_BY STRICT_TRANS_TABLES NO_ZERO_IN_DATE NO_ZERO_DATE ERROR_FOR_DIVISION_BY_ZERO NO_ENGINE_SUBSTITUTION</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>ALLOW_INVALID_DATES</code></p><p><code>ANSI_QUOTES</code></p><p><code>ERROR_FOR_DIVISION_BY_ZERO</code></p><p><code>HIGH_NOT_PRECEDENCE</code></p><p><code>IGNORE_SPACE</code></p><p><code>NO_AUTO_VALUE_ON_ZERO</code></p><p><code>NO_BACKSLASH_ESCAPES</code></p><p><code>NO_DIR_IN_CREATE</code></p><p><code>NO_ENGINE_SUBSTITUTION</code></p><p><code>NO_UNSIGNED_SUBTRACTION</code></p><p><code>NO_ZERO_DATE</code></p><p><code>NO_ZERO_IN_DATE</code></p><p><code>ONLY_FULL_GROUP_BY</code></p><p><code>PAD_CHAR_TO_FULL_LENGTH</code></p><p><code>PIPES_AS_CONCAT</code></p><p><code>REAL_AS_FLOAT</code></p><p><code>STRICT_ALL_TABLES</code></p><p><code>STRICT_TRANS_TABLES</code></p><p><code>TIME_TRUNCATE_FRACTIONAL</code></p></td> </tr></tbody></table>

  Defina o modo SQL. Consulte  Seção 7.1.11, “Modos SQL do Servidor”.

  ::: info Nota

  Os programas de instalação do MySQL podem configurar o modo SQL durante o processo de instalação.

  Se o modo SQL for diferente do padrão ou do que você espera, verifique se há uma configuração em um arquivo de opção que o servidor lê ao iniciar.

  :::

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--super-large-pages[={OFF|ON}]</code></td> </tr><tr><th>Especifica plataforma</th> <td>Solaris</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  O uso padrão de páginas grandes no MySQL tenta usar o maior tamanho suportado, até 4 MB. Sob o Solaris, um recurso de "páginas super grandes" permite o uso de páginas de até 256 MB. Esse recurso está disponível para plataformas SPARC recentes. Ele pode ser ativado ou desativado usando a opção `--super-large-pages` ou `--skip-super-large-pages`.
*  `--symbolic-links`, `--skip-symbolic-links`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--symbolic-links[={OFF|ON}]</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Ative ou desative o suporte a links simbólicos. No Unix, habilitar links simbólicos significa que você pode vincular um arquivo de índice `MyISAM` ou um arquivo de dados a outro diretório com a opção `INDEX DIRECTORY` ou `DATA DIRECTORY` da instrução `CREATE TABLE`. Se você excluir ou renomear a tabela, os arquivos a que seus links simbólicos apontam também são excluídos ou renomeados. Veja a Seção 10.12.2.2, “Usando links simbólicos para tabelas MyISAM no Unix”.

  ::: info Nota

  O suporte a links simbólicos, juntamente com a opção `--symbolic-links` que o controla, está desatualizado; você deve esperar que ele seja removido em uma versão futura do MySQL. Além disso, a opção está desativada por padrão. A variável de sistema relacionada `have_symlink` também está desatualizada; espere que ela seja removida em uma versão futura do MySQL.

  :::

  Esta opção não tem significado no Windows.
*  `--sysdate-is-now`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--sysdate-is-now[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

`SYSDATE()` por padrão retorna a hora em que é executado, e não a hora em que a instrução na qual ele ocorre começa a ser executada. Isso difere do comportamento de `NOW()`. Esta opção faz com que `SYSDATE()` seja sinônimo de `NOW()`. Para informações sobre as implicações para o registro binário e a replicação, consulte a descrição para `SYSDATE()` na Seção 14.7, “Funções de Data e Hora” e para `SET TIMESTAMP` na Seção 7.1.8, “Variáveis do Sistema do Servidor”.

*  `--tc-heuristic-recover={COMMIT|ROLLBACK}`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--tc-heuristic-recover=nome</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>COMMIT</code></p><p><code>ROLLBACK</code></p></td> </tr></tbody></table>

  A decisão de usar em uma recuperação heurística manual.

  Se uma opção `--tc-heuristic-recover` for especificada, o servidor encerra, independentemente de a recuperação heurística manual ter sucesso.

  Em sistemas com mais de um motor de armazenamento capaz de commit de duas fases, a opção `ROLLBACK` não é segura e faz com que a recuperação seja interrompida com o seguinte erro:

  ```
  [ERROR] --tc-heuristic-recover rollback
  strategy is not safe on systems with more than one 2-phase-commit-capable
  storage engine. Aborting crash recovery.
  ```aynVRCrhxp```
+ `MINIMAL`

O servidor atualiza o dicionário de dados, o Schema de Desempenho e o `INFORMATION_SCHEMA`, se necessário (etapa 1). Observe que, após uma atualização com esta opção, a Replicação de Grupo não pode ser iniciada, porque as tabelas do sistema nas quais dependem os recursos internos da replicação não são atualizadas, e a funcionalidade reduzida também pode ser aparente em outras áreas.
+ `FORCE`

O servidor atualiza o dicionário de dados, o Schema de Desempenho e o `INFORMATION_SCHEMA`, se necessário (etapa 1). Além disso, o servidor força uma atualização de tudo o mais (etapa 2). O tempo de inicialização do servidor pode ser maior com esta opção, pois o servidor verifica todos os objetos em todos os esquemas.

`FORCE` é útil para forçar que as ações da etapa 2 sejam realizadas se o servidor achar que elas não são necessárias. Por exemplo, você pode acreditar que uma tabela do sistema está faltando ou foi danificada e deseja forçar uma reparação.

A tabela a seguir resume as ações realizadas pelo servidor para cada valor de opção.

<table><col style="width: 20%"/><col style="width: 30%"/><col style="width: 30%"/><thead><tr> <th>Opção Valor</th> <th>Servidor executa a Etapa 1?</th> <th>Servidor executa a Etapa 2?</th> </tr></thead><tbody><tr> <th><code>AUTO</code></th> <td>Se necessário</td> <td>Se necessário</td> </tr><tr> <th><code>NONE</code></th> <td>Não</td> <td>Não</td> </tr><tr> <th><code>MINIMAL</code></th> <td>Se necessário</td> <td>Não</td> </tr><tr> <th><code>FORCE</code></th> <td>Se necessário</td> <td>Sim</td> </tr></tbody></table>
*  `--user={user_name|user_id}`, `-u {user_name|user_id}`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--user=nome</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Execute o servidor `mysqld` como o usuário com o nome *`user_name`* ou o ID de usuário numérico *`user_id`*. (“Usuário” neste contexto se refere a uma conta de login do sistema, não a um usuário MySQL listado nas tabelas de concessão.)

  Esta opção é *obrigatória* ao iniciar o `mysqld` como `root`. O servidor altera seu ID de usuário durante sua sequência de inicialização, fazendo com que ele execute como esse usuário específico em vez de como `root`. Veja a Seção 8.1.1, “Diretrizes de segurança”.

  Para evitar uma possível falha de segurança onde um usuário adiciona uma opção `--user=root` a um arquivo `my.cnf` (causando assim que o servidor execute como `root`), o `mysqld` usa apenas a primeira opção `--user` especificada e produz um aviso se houver múltiplas opções `--user`. As opções em `/etc/my.cnf` e `$MYSQL_HOME/my.cnf` são processadas antes das opções de linha de comando, portanto, recomenda-se que você coloque uma opção `--user` em `/etc/my.cnf` e especifique um valor diferente de `root`. A opção em `/etc/my.cnf` é encontrada antes de quaisquer outras opções `--user`, o que garante que o servidor execute como um usuário diferente de `root`, e que um aviso seja gerado se qualquer outra opção `--user` for encontrada.
*  `--validate-config`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--validate-config[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Valide a configuração de inicialização do servidor. Se não forem encontrados erros, o servidor termina com um código de saída de 0. Se um erro for encontrado, o servidor exibe uma mensagem de diagnóstico e termina com um código de saída de 1. Mensagens de aviso e informações também podem ser exibidas, dependendo do valor de `log_error_verbosity`, mas não produzem a interrupção imediata da validação ou um código de saída de 1. Para mais informações, consulte a Seção 7.1.3, “Validação da Configuração do Servidor”.
*  `--validate-user-plugins[={OFF|ON}]`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--validate-user-plugins[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Se esta opção estiver habilitada (o padrão), o servidor verifica cada conta de usuário e exibe um aviso se forem encontradas condições que tornariam a conta inutilizável:

  + A conta requer um plugin de autenticação que não está carregado.
  + A conta requer o plugin de autenticação `sha256_password` (desatualizado) ou `caching_sha2_password`, mas o servidor foi iniciado sem SSL ou RSA habilitados conforme exigido pelo plugin.

  Habilitar `--validate-user-plugins` desacelera a inicialização do servidor e `FLUSH PRIVILEGES`. Se você não precisar da verificação adicional, pode desabilitar essa opção no início para evitar a redução do desempenho.
*  `--verbose`, `-v`

  Use esta opção com a opção  `--help` para obter ajuda detalhada.
*  `--version`, `-V`

  Exibir informações de versão e sair.