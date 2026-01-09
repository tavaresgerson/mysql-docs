### 7.1.7 Opções de Comando do Servidor

Ao iniciar o servidor **mysqld**, você pode especificar opções de programa usando qualquer um dos métodos descritos na Seção 6.2.2, “Especificando Opções de Programa”. Os métodos mais comuns são fornecer opções em um arquivo de opções ou na linha de comando. No entanto, na maioria dos casos, é desejável garantir que o servidor use as mesmas opções cada vez que for executado. A melhor maneira de garantir isso é listá-las em um arquivo de opções. Veja a Seção 6.2.2.2, “Usando Arquivos de Opções”. Essa seção também descreve o formato e a sintaxe dos arquivos de opções.

**mysqld** lê opções dos grupos `[mysqld]` e `[server]`. **mysqld_safe** lê opções dos grupos `[mysqld]`, `[server]`, `[mysqld_safe]` e `[safe_mysqld]`. **mysql.server** lê opções dos grupos `[mysqld]` e `[mysql.server]`.

**mysqld** aceita muitas opções de comando. Para um resumo breve, execute este comando:

```
mysqld --help
```

Para ver a lista completa, use este comando:

```
mysqld --verbose --help
```

Alguns dos itens na lista são, na verdade, variáveis de sistema que podem ser definidas no início do servidor. Essas podem ser exibidas em tempo de execução usando a instrução `SHOW VARIABLES`. Alguns itens exibidos pelo comando **mysqld** anterior não aparecem na saída do `SHOW VARIABLES`; isso ocorre porque são opções e não variáveis de sistema.

A lista a seguir mostra algumas das opções de servidor mais comuns. Opções adicionais são descritas em outras seções:

* Opções que afetam a segurança: Veja a Seção 8.1.4, “Opções e Variáveis mysqld Relacionadas à Segurança”.
* Opções relacionadas ao SSL: Veja Opções de Comando para Conexões Encriptadas.
* Opções de controle de log binário: Veja a Seção 7.4.4, “O Log Binário”.
* Opções relacionadas à replicação: Veja a Seção 19.1.6, “Opções e Variáveis de Log Binário e Replicação”.

* Opções para carregar plugins, como motores de armazenamento plugáveis: Consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

* Opções específicas para motores de armazenamento particulares: Consulte a Seção 17.14, “Opções de Inicialização do InnoDB e Variáveis de Sistema” e a Seção 18.2.1, “Opções de Inicialização do MyISAM”.

Algumas opções controlam o tamanho dos buffers ou caches. Para um buffer dado, o servidor pode precisar alocar estruturas de dados internas. Essas estruturas são tipicamente alocadas a partir da memória total alocada ao buffer, e a quantidade de espaço necessária pode depender da plataforma. Isso significa que, quando você atribui um valor a uma opção que controla o tamanho de um buffer, a quantidade de espaço realmente disponível pode diferir do valor atribuído. Em alguns casos, a quantidade pode ser menor que o valor atribuído. Também é possível que o servidor ajuste um valor para cima. Por exemplo, se você atribuir um valor de 0 a uma opção para a qual o valor mínimo é 1024, o servidor define o valor para 1024.

Os valores para tamanhos de buffers, comprimentos e tamanhos de pilhas são fornecidos em bytes, a menos que especificado de outra forma.

Algumas opções aceitam valores de nomes de arquivos. A menos que especificado de outra forma, a localização padrão do arquivo é o diretório de dados se o valor for um nome de caminho relativo. Para especificar a localização explicitamente, use um nome de caminho absoluto. Suponha que o diretório de dados seja `/var/mysql/data`. Se uma opção com valor de arquivo for dada como um nome de caminho relativo, ela está localizada sob `/var/mysql/data`. Se o valor for um nome de caminho absoluto, sua localização é conforme o nome do caminho.

Você também pode definir os valores das variáveis do sistema do servidor no momento do início do servidor usando nomes de variáveis como opções. Para atribuir um valor a uma variável do sistema do servidor, use uma opção do formato `--var_name=valor`. Por exemplo, `--sort_buffer_size=384M` define a variável `sort_buffer_size` para um valor de 384MB.

Quando você atribui um valor a uma variável, o MySQL pode corrigir automaticamente o valor para permanecer dentro de um determinado intervalo ou ajustar o valor para o valor mais próximo permitido, se apenas certos valores forem permitidos.

Para restringir o valor máximo ao qual uma variável do sistema pode ser definida em tempo de execução com a instrução `SET`, especifique esse máximo usando uma opção do formato `--maximum-var_name=valor` no momento do início do servidor.

Você pode alterar os valores da maioria das variáveis do sistema em tempo de execução com a instrução `SET`. Consulte a Seção 15.7.6.1, “Sintaxe SET para Atribuição de Variáveis”.

A Seção 7.1.8, “Variáveis do Sistema do Servidor”, fornece uma descrição completa de todas as variáveis e informações adicionais para configurá-las no momento do início do servidor e em tempo de execução. Para informações sobre alterar variáveis do sistema, consulte a Seção 7.1.1, “Configurando o Servidor”.

* `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Exibir uma mensagem de ajuda curta e sair. Use as opções `--verbose` e `--help` para ver a mensagem completa.

* `--allow-suspicious-udfs`

<table frame="box" rules="all" summary="Propriedades para permitir-udfs-suspeito">
  <tr><th>Formato de linha de comando</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr>
  <tr><th>Tipo</th> <td>Booleano</td> </tr>
  <tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr>
  </tbody></table>

  Esta opção controla se funções carregáveis que têm apenas um símbolo `xxx` para a função principal podem ser carregadas. Por padrão, a opção está desativada e apenas funções carregáveis que têm pelo menos um símbolo auxiliar podem ser carregadas; isso previne tentativas de carregar funções de arquivos de objeto compartilhado que não contenham funções legítimas. Veja Precauções de segurança para funções carregáveis.

* `--ansi`

  <table frame="box" rules="all" summary="Propriedades para ansi">
    <tr><th>Formato de linha de comando</th> <td><code>--ansi</code></td> </tr>
  </tbody></table>

  Use a sintaxe SQL padrão (ANSI) em vez da sintaxe MySQL. Para um controle mais preciso sobre o modo SQL do servidor, use a opção `--sql-mode` em vez disso. Veja Seção 1.7, “Conformidade com os Padrões MySQL”, e Seção 7.1.11, “Modos SQL do servidor”.

* `--basedir=dir_name`, `-b dir_name`

<table frame="box" rules="all" summary="Propriedades para basedir">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--basedir=dir_name</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code><a class="link" href="server-system-variables.html#sysvar_basedir">basedir</a></code></td>
  </tr>
  <tr>
    <th>Âmbito</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmica</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hinta de Configuração de Variáveis"><code>SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do diretório</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>parent of mysqld installation directory</code></td>
  </tr>
</table>

  O caminho para o diretório de instalação do MySQL. Esta opção define a variável de sistema `basedir`.

  O executável do servidor determina seu próprio nome completo no momento do início e usa o pai do diretório em que está localizado como o valor padrão de `basedir`. Isso, por sua vez, permite que o servidor use esse `basedir` ao procurar informações relacionadas ao servidor, como o diretório `share` que contém mensagens de erro.

* `--check-table-functions=value`

<table frame="box" rules="all" summary="Propriedades para funções de tabela de verificação">
  <tr><th>Formato de Linha de Comando</th> <td><code>--check-table-functions=valor</code></td> </tr>
  <tr><th>Tipo</th> <td>Enumeração</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>ABORT</code></td> </tr>
  <tr><th>Valores Válidos</th> <td><p class="valid-value"><code>WARN</code></p><p class="valid-value"><code>ABORT</code></p></td> </tr>
</table>

  Ao realizar uma atualização do servidor, fazemos uma varredura do dicionário de dados para funções usadas em restrições de tabela e outras expressões, incluindo expressões `DEFAULT`, expressões de particionamento e colunas virtuais. É possível que uma mudança no comportamento da função cause um erro na nova versão do servidor, onde nenhum erro ocorreu antes, caso em que a tabela não pode ser aberta. Esta opção oferece uma escolha sobre como lidar com tais problemas, de acordo com o qual dos dois valores mostrados aqui é usado:

  + `WARN`: Registra um aviso para cada tabela que não pode ser aberta.

  + `ABORT`: Também registra um aviso; além disso, a atualização é interrompida. Este é o padrão. Para um valor suficientemente alto de `--log-error-verbosity`, também registra uma nota com uma definição de tabela simplificada listando apenas aquelas expressões que potencialmente contêm funções SQL.

  O comportamento padrão é abortar a atualização, para que o usuário possa corrigir o problema usando a versão mais antiga do servidor, antes de atualizar para a versão mais nova. Use `WARN` para continuar a atualização no modo interativo enquanto relata quaisquer problemas.

* `--chroot=nome_diretório`, `-r nome_diretório`

<table frame="box" rules="all" summary="Propriedades para chroot">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--chroot=nome_diretorio</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do diretório</td>
  </tr>
  </tbody>
</table>

  Coloque o servidor **mysqld** em um ambiente fechado durante a inicialização usando a chamada de sistema `chroot()`. Esta é uma medida de segurança recomendada. O uso desta opção limita um pouco os comandos `LOAD DATA` e `SELECT ... INTO OUTFILE`.

* `--console`

  <table frame="box" rules="all" summary="Propriedades para console">
    <tr>
      <th>Formato de Linha de Comando</th>
      <td><code>--console</code></td>
    </tr>
    <tr>
      <th>Plataforma Específica</th>
      <td>Windows</td>
    </tr>
  </tbody>
  </table>

  (Apenas para Windows.) Faça com que o destino padrão do log de erro seja a console. Isso afeta os sinks de log que baseiam seu próprio destino de saída no destino padrão. Veja a Seção 7.4.2, “O Log de Erros”. O **mysqld** não fecha a janela da console se esta opção for usada.

`--console` tem precedência sobre `--log-error` se ambas forem fornecidas.

* `--core-file`

  <table frame="box" rules="all" summary="Propriedades para core-file">
    <tr>
      <th>Formato de Linha de Comando</th>
      <td><code>--core-file</code></td>
    </tr>
  </tbody>
  </table>

Quando esta opção é usada, escreva um arquivo de núcleo se o **mysqld** morrer; não são necessários (ou aceitos) argumentos. O nome e a localização do arquivo de núcleo dependem do sistema. No Linux, um arquivo de núcleo chamado `core.pid` é escrito no diretório de trabalho atual do processo, que, para o **mysqld**, é o diretório de dados. *`pid`* representa o ID de processo do processo do servidor. No macOS, um arquivo de núcleo chamado `core.pid` é escrito no diretório `/cores`. No Solaris, use o comando **coreadm** para especificar onde escrever o arquivo de núcleo e como nomeá-lo.

Para alguns sistemas, para obter um arquivo de núcleo, você também deve especificar a opção `--core-file-size` para **mysqld\_safe**. Consulte a Seção 6.3.2, “mysqld\_safe — Script de Inicialização do Servidor MySQL”. Em alguns sistemas, como o Solaris, você não obtém um arquivo de núcleo se também estiver usando a opção `--user`. Pode haver restrições ou limitações adicionais. Por exemplo, pode ser necessário executar **ulimit -c unlimited** antes de iniciar o servidor. Consulte a documentação do seu sistema.

A variável `innodb_buffer_pool_in_core_file` pode ser usada para reduzir o tamanho dos arquivos de núcleo em sistemas operacionais que a suportam. Para mais informações, consulte a Seção 17.8.3.7, “Excluindo ou Incluindo Páginas do Buffer Pool em Arquivos de Núcleo”.

* `--daemonize`, `-D`

  <table frame="box" rules="all" summary="Propriedades para daemonize"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--daemonize[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Essa opção faz com que o servidor seja executado como um daemon tradicional, permitindo que ele trabalhe com sistemas operacionais que usam o systemd para controle de processos. Para mais informações, consulte a Seção 2.5.9, “Gerenciamento do Servidor MySQL com o systemd”.

`--daemonize` é mutuamente exclusivo de `--initialize` e `--initialize-insecure`.

Se o servidor for iniciado usando a opção `--daemonize` e não estiver conectado a um dispositivo tty, uma opção padrão de registro de erros de `--log-error=""` é usada na ausência de uma opção de registro explícita, para direcionar a saída de erros para o arquivo de log padrão.

`-D` é um sinônimo de `--daemonize`.

* `--datadir=dir_name`, `-h dir_name`

  <table frame="box" rules="all" summary="Propriedades para datadir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--datadir=dir_name</code></td> </tr><tr><th>Variável do Sistema</th> <td><code><a class="link" href="server-system-variables.html#sysvar_datadir">datadir</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Dicas de Configuração de Variáveis"><code>SET_VAR</code></a></code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  O caminho para o diretório de dados do servidor MySQL. Esta opção define a variável de sistema `datadir`. Veja a descrição dessa variável.

* `--debug[=debug_options]`, `-# [debug_options]`

<table frame="box" rules="all" summary="Propriedades para permitir-udfs-suspeito">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Booleano</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>OFF</code></td>
  </tr>
  </tbody>
</table>

Se o MySQL estiver configurado com a opção **CMake** `-DWITH_DEBUG=1`, você pode usar essa opção para obter um arquivo de registro do que o **mysqld** está fazendo. Uma string típica de *`debug_options`* é `d:t:o,file_name`. O padrão é `d:t:i:o,/tmp/mysqld.trace` no Unix e `d:t:i:O,\mysqld.trace` no Windows.

Usar `-DWITH_DEBUG=1` para configurar o MySQL com suporte de depuração permite que você use a opção `--debug="d,parser_debug"` ao iniciar o servidor. Isso faz com que o analisador Bison, que é usado para processar instruções SQL, descarregue um registro do analisador na saída de erro padrão do servidor. Normalmente, essa saída é escrita no log de erro.

Essa opção pode ser dada várias vezes. Valores que começam com `+` ou `-` são adicionados ou subtraídos do valor anterior. Por exemplo, `--debug=T` `--debug=+P` define o valor para `P:T`.

Para mais informações, consulte a Seção 7.9.4, “O Pacote DBUG”.

* `--debug-sync-timeout[=N]`

Controla se a funcionalidade Debug Sync para testes e depuração está habilitada. O uso do Debug Sync requer que o MySQL seja configurado com a opção `-DWITH_DEBUG=ON` do **CMake** (consulte a Seção 2.8.7, “Opções de Configuração de Código-Fonte do MySQL”); caso contrário, essa opção não está disponível. O valor da opção é um tempo de espera em segundos. O valor padrão é 0, o que desabilita o Debug Sync. Para ativá-lo, especifique um valor maior que 0; esse valor também se torna o tempo de espera padrão para os pontos de sincronização individuais. Se a opção for fornecida sem um valor, o tempo de espera é definido para 300 segundos.

Para uma descrição da funcionalidade Debug Sync e de como usar pontos de sincronização, consulte MySQL Internals: Test Synchronization.

* `--default-time-zone=timezone`

  <table frame="box" rules="all" summary="Propriedades para allow-suspicious-udfs"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Defina a zona horária padrão do servidor. Esta opção define a variável de sistema `time_zone`. Se esta opção não for fornecida, a zona horária padrão é a mesma da zona horária do sistema (dados pelo valor da variável de sistema `system_time_zone`.

  A variável `system_time_zone` difere da `time_zone`. Embora possam ter o mesmo valor, a última variável é usada para inicializar a zona horária para cada cliente que se conecta. Consulte a Seção 7.1.15, “Suporte à Zona Horária do Servidor MySQL”.

* `--defaults-extra-file=file_name`

Leia este arquivo de opções após o arquivo de opções globais, mas (no Unix) antes do arquivo de opções do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual. Isso deve ser a primeira opção na linha de comando se for usada.

Para obter informações adicionais sobre isso e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opções”.

* `--defaults-file=file_name`

Leia apenas o arquivo de opções fornecido. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Exceção: Mesmo com `--defaults-file`, o **mysqld** lê o `mysqld-auto.cnf`.

Nota

Isso deve ser a primeira opção na linha de comando se for usada, exceto que se o servidor for iniciado com as opções `--defaults-file` e `--install` (ou `--install-manual`), `--install` (ou `--install-manual`) deve ser a primeira.

Para obter informações adicionais sobre isso e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opções”.

* `--defaults-group-suffix=str`

Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, o **mysqld** normalmente lê o grupo `[mysqld]`. Se esta opção for dada como `--defaults-group-suffix=_other`, o **mysqld** também lê o grupo `[mysqld_other]`.

Para obter informações adicionais sobre isso e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opções”.

* `--early-plugin-load=plugin_list`

<table frame="box" rules="all" summary="Propriedades para permitir-udfs-suspeito">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Booleano</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>OFF</code></td>
  </tr>
  </tbody>
</table>

  Nota

  Esta opção está desatualizada e, ao iniciar o servidor com ela, é gerado um aviso. Isso faz parte de um processo contínuo para substituir todos os plugins do MySQL por componentes do MySQL. Se você ainda não o fez, deve migrar de quaisquer plugins que esteja usando para os componentes equivalentes, onde estes estão disponíveis; isso se aplica especialmente aos plugins de chaveira, que agora estão desatualizados. Para mais informações, consulte a Seção 8.4.5.1, “Componentes de Chaveira Versus Plugins de Chaveira”.

  Esta opção indica ao servidor quais plugins carregar antes de carregar plugins embutidos obrigatórios e antes da inicialização do mecanismo de armazenamento. O carregamento antecipado é suportado apenas para plugins compilados com `PLUGIN_OPT_ALLOW_EARLY`. Se várias opções `--early-plugin-load` forem fornecidas, apenas a última se aplica.

  O valor da opção é uma lista separada por ponto e vírgula de valores de *`plugin_library`*, valores de `name=plugin_library` ou ambos. Cada *`plugin_library`* é o nome de um arquivo de biblioteca que contém o código do plugin, e cada *`name`* é o nome de um plugin a ser carregado. Se uma biblioteca de plugin for nomeada sem qualquer nome de plugin anterior, o servidor carrega todos os plugins da biblioteca. Com um nome de plugin anterior, o servidor carrega apenas o plugin nomeado da biblioteca. O servidor procura por arquivos de biblioteca de plugin no diretório nomeado pela variável de sistema `plugin_dir`.

Por exemplo, se os plugins chamados `myplug1` e `myplug2` estiverem contidos nos arquivos de biblioteca de plugins `myplug1.so` e `myplug2.so`, use esta opção para realizar um carregamento inicial do plugin:

```
  mysqld --early-plugin-load="myplug1=myplug1.so;myplug2=myplug2.so"
  ```

Aspas cercam o valor do argumento porque, caso contrário, alguns interpretadores de comandos interpretam ponto e vírgula (`;`) como um caractere especial. (Por exemplo, as shells Unix o tratam como um marcador de fim de comando.)

Cada plugin nomeado é carregado precocemente para uma única invocação do **mysqld**. Após um reinício, o plugin não é carregado precocemente, a menos que `--early-plugin-load` seja usado novamente.

Se o servidor for iniciado usando `--initialize` ou `--initialize-insecure`, os plugins especificados por `--early-plugin-load` não são carregados.

Se o servidor for executado com `--help`, os plugins especificados por `--early-plugin-load` são carregados, mas não inicializados. Esse comportamento garante que as opções do plugin sejam exibidas na mensagem de ajuda.

A criptografia do espaço de tabelas `InnoDB` depende do Keychain MySQL para a gestão de chaves de criptografia, e o plugin keychain deve ser carregado antes da inicialização do mecanismo de armazenamento para facilitar a recuperação do `InnoDB` para tabelas criptografadas. Por exemplo, administradores que desejam que o plugin `keyring_okv` seja carregado no início devem usar `--early-plugin-load` com o valor da opção apropriado (como `keyring_okv.so` em sistemas Unix e Unix-like ou `keyring_okv.dll` em sistemas Windows).

Para informações sobre a criptografia do espaço de tabelas `InnoDB`, consulte a Seção 17.13, “Criptografia de Dados em Armazenamento do `InnoDB`”. Para informações gerais sobre o carregamento de plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

Nota

Para o Keychain do MySQL, essa opção é usada apenas quando o keystore é gerenciado com um plugin de keychain. Se a gestão do keystore usar um componente de keychain em vez de um plugin, especifique a carga do componente usando um arquivo de manifesto; veja a Seção 8.4.5.2, “Instalação do Componente do Keychain”.

* `--exit-info[=flags]`, `-T [flags]`

  <table frame="box" rules="all" summary="Propriedades para allow-suspicious-udfs"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  É uma máscara de bits de diferentes flags que você pode usar para depurar o servidor **mysqld**. Não use essa opção a menos que você saiba *exatamente* o que ela faz!

* `--external-locking`

  <table frame="box" rules="all" summary="Propriedades para allow-suspicious-udfs"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Ative o bloqueio externo (bloqueio do sistema), que está desativado por padrão. Se você usar essa opção em um sistema em que o `lockd` não funciona totalmente (como no Linux), é fácil para o **mysqld** entrar em um deadlock.

  Para desativar o bloqueio externo explicitamente, use `--skip-external-locking`.

  O bloqueio externo afeta apenas o acesso a tabelas `MyISAM`. Para mais informações, incluindo as condições sob as quais ele pode e não pode ser usado, consulte a Seção 10.11.5, “Bloqueio Externo”.

* `--flush`

<table frame="box" rules="all" summary="Propriedades para permitir-udfs-suspeito"><tr><th>Formato de linha de comando</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></table>

Limpe (sincronize) todas as alterações no disco após cada instrução SQL. Normalmente, o MySQL escreve todas as alterações no disco apenas após cada instrução SQL e deixa o sistema operacional lidar com a sincronização no disco. Veja a Seção B.3.3.3, “O que fazer se o MySQL continuar a falhar”.

Nota

Se `--flush` for especificado, o valor de `flush_time` não importa e as alterações em `flush_time` não têm efeito no comportamento de flush.

* `--gdb`

<table frame="box" rules="all" summary="Propriedades para permitir-udfs-suspeito"><tr><th>Formato de linha de comando</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></table>

Instale um manipulador de interrupção para `SIGINT` (necessário para parar o **mysqld** com `^C` para definir pontos de interrupção) e desative o rastreamento de pilha e o gerenciamento de arquivos de núcleo. Veja a Seção 7.9.1.4, “Depuração do mysqld no gdb”.

Em sistemas Windows, essa opção também suprime o fork utilizado para implementar a instrução `RESTART`: o fork permite que um processo atue como monitor do outro, que atua como servidor. No entanto, o fork dificulta a determinação do processo do servidor para se conectar para depuração, então iniciar o servidor com `--gdb` suprime o fork. Para um servidor iniciado com essa opção, `RESTART` simplesmente encerra e não reinicia.

Em configurações não de depuração, `--no-monitor` pode ser usado para suprimir o fork do processo monitor.

* `--initialize`, `-I`

  <table frame="box" rules="all" summary="Propriedades para allow-suspicious-udfs"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Essa opção é usada para inicializar uma instalação do MySQL criando o diretório de dados e preenchendo as tabelas no esquema do sistema `mysql`. Para mais informações, consulte a Seção 2.9.1, “Inicializando o Diretório de Dados”.

  Essa opção limita os efeitos de, ou não é compatível com, vários outros opções de inicialização do servidor MySQL. Algumas das questões mais comuns desse tipo são mencionadas aqui:

Recomendamos fortemente, ao inicializar o diretório de dados com `--initialize`, que você não especifique outras opções além de `--datadir`, outras opções usadas para definir localizações de diretórios, como `--basedir`, e possivelmente `--user`, se necessário. As opções para o servidor MySQL em execução podem ser especificadas ao iniciá-lo após a inicialização ter sido concluída e o **mysqld** ter sido desligado. Isso também se aplica ao uso de `--initialize-insecure` em vez de `--initialize`.

+ Quando o servidor é iniciado com `--initialize`, algumas funcionalidades estão indisponíveis, o que limita as instruções permitidas em qualquer arquivo nomeado pela variável de sistema `init_file`. Para mais informações, consulte a descrição dessa variável. Além disso, a variável de sistema `disabled_storage_engines` não tem efeito.

+ A opção `--ndbcluster` é ignorada quando usada juntamente com `--initialize`.

+ `--initialize` é mutuamente exclusivo de `--bootstrap` e `--daemonize`.

Os itens na lista anterior também se aplicam ao inicializar o servidor usando a opção `--initialize-insecure`.

* `--initialize-insecure`

  <table frame="box" rules="all" summary="Propriedades para allow-suspicious-udfs"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Esta opção é usada para inicializar uma instalação do MySQL criando o diretório de dados e preenchendo as tabelas no esquema do sistema `mysql`. Esta opção implica em `--initialize`, e as mesmas restrições e limitações se aplicam; para mais informações, consulte a descrição dessa opção e a Seção 2.9.1, “Inicializando o Diretório de Dados”.

Aviso

Esta opção cria um usuário `root` do MySQL com uma senha vazia, o que é inseguro. Por esse motivo, não a use em produção sem definir essa senha manualmente. Consulte a Seção 2.3.3.8, “Inicializando o MySQL como um Serviço do Windows”, para obter informações sobre como fazer isso.

* `--innodb-xxx`

  Defina uma opção para o motor de armazenamento `InnoDB`. As opções `InnoDB` estão listadas na Seção 17.14, “Opções de Inicialização do InnoDB e Variáveis de Sistema”.

* `--install [nome_do_serviço]`

  <table frame="box" rules="all" summary="Propriedades para ansi"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--ansi</code></td> </tr></tbody></table>

  (Apenas para Windows) Instale o servidor como um serviço do Windows que inicia automaticamente durante o início do Windows. O nome padrão do serviço é `MySQL` se nenhum valor de *`nome_do_serviço`* for fornecido. Para mais informações, consulte a Seção 2.3.3.8, “Inicializando o MySQL como um Serviço do Windows”.

Nota

Se o servidor for iniciado com as opções `--defaults-file` e `--install`, `--install` deve ser a primeira.

* `--install-manual [nome_do_serviço]`

  <table frame="box" rules="all" summary="Propriedades para ansi"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--ansi</code></td> </tr></tbody></table>

(Apenas para Windows) Instale o servidor como um serviço do Windows que deve ser iniciado manualmente. Ele não é iniciado automaticamente durante o início do Windows. O nome do serviço padrão é `MySQL` se não for fornecido o valor *`service_name`*. Para mais informações, consulte a Seção 2.3.3.8, “Iniciar o MySQL como um Serviço do Windows”.

Nota

Se o servidor for iniciado com as opções `--defaults-file` e `--install-manual`, `--install-manual` deve ser a primeira opção.

* `--large-pages`

  <table frame="box" rules="all" summary="Propriedades para ansi"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--ansi</code></td> </tr></tbody></table>

  Algumas arquiteturas de hardware/sistema operacional suportam páginas de memória maiores que o padrão (geralmente 4KB). A implementação real deste suporte depende do hardware e do sistema operacional subjacentes. Aplicações que realizam muitos acessos de memória podem obter melhorias de desempenho ao usar páginas grandes devido à redução de erros no Buffer de Busca de Tradução (TLB).

  O MySQL suporta a implementação do Linux de suporte a páginas grandes (que é chamada de HugeTLB no Linux). Consulte a Seção 10.12.3.3, “Habilitar Suporte a Páginas Grandes”. Para o suporte de grandes páginas no Solaris, consulte a descrição da opção `--super-large-pages`.

  `--large-pages` está desativado por padrão.

* `--lc-messages=locale_name`

  <table frame="box" rules="all" summary="Propriedades para ansi"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--ansi</code></td> </tr></tbody></table>

O local a ser usado para mensagens de erro. O padrão é `en_US`. O servidor converte o argumento em um nome de idioma e o combina com o valor de `--lc-messages-dir` para produzir a localização do arquivo de mensagem de erro. Veja a Seção 12.12, “Definindo o Idioma da Mensagem de Erro”.

* `--lc-messages-dir=nome_do_diretório`

  <table frame="box" rules="all" summary="Propriedades para ansi"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--ansi</code></td> </tr></tbody></table>

  O diretório onde as mensagens de erro estão localizadas. O servidor usa o valor junto com o valor de `--lc-messages` para produzir a localização do arquivo de mensagem de erro. Veja a Seção 12.12, “Definindo o Idioma da Mensagem de Erro”.

* `--local-service`

  <table frame="box" rules="all" summary="Propriedades para ansi"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--ansi</code></td> </tr></tbody></table>

  (Apenas no Windows) Uma opção `--local-service` após o nome do serviço faz com que o servidor seja executado usando a conta `LocalService` do Windows que tem privilégios de sistema limitados. Se `--defaults-file` e `--local-service` forem fornecidos após o nome do serviço, eles podem estar em qualquer ordem. Veja a Seção 2.3.3.8, “Iniciando o MySQL como um Serviço do Windows”.

* `--log-diagnostic[=valor]`

  <table frame="box" rules="all" summary="Propriedades para ansi"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--ansi</code></td> </tr></tbody></table>

Defina o nome do arquivo de log de diagnóstico para este valor com o sufixo `.diag` se o servidor for iniciado com `--log-diagnostic-enable`; caso contrário, não terá efeito. O nome padrão do arquivo de log de diagnóstico é `nome_do_host.diag`.

  Apenas para uso interno. Disponível apenas se o servidor for construído usando `-DWITH_LOG_DIAGNOSTIC`.

* `--log-diagnostic-enable[=valor]`

  <table frame="box" rules="all" summary="Propriedades para ansi"><tbody><tr><th>Formato de linha de comando</th> <td><code>--ansi</code></td> </tr></tbody></table>

  Ative o registro de diagnóstico.

  Apenas para uso interno. Disponível apenas se o servidor for construído usando `-DWITH_LOG_DIAGNOSTIC`.

* `--log-error[=nome_do_arquivo]`

  <table frame="box" rules="all" summary="Propriedades para ansi"><tbody><tr><th>Formato de linha de comando</th> <td><code>--ansi</code></td> </tr></tbody></table>

  Defina o destino padrão do log de erro para o arquivo nomeado. Isso afeta os sinks de log que baseiam seu próprio destino de saída no destino padrão. Veja a Seção 7.4.2, “O Log de Erro”.

  Se a opção não especificar nenhum arquivo, o destino padrão do log de erro em sistemas Unix e Unix-like é um arquivo chamado `nome_do_host.err` no diretório de dados. O destino padrão em Windows é o mesmo, a menos que a opção `--pid-file` seja especificada. Nesse caso, o nome do arquivo é o nome de base do arquivo de PID com um sufixo de `.err` no diretório de dados.

  Se a opção especificar um arquivo, o destino padrão é esse arquivo (com o sufixo `.err` adicionado se o nome não tiver sufixo), localizado sob o diretório de dados, a menos que um nome de caminho absoluto seja fornecido para especificar uma localização diferente.

Se a saída do log de erro não puder ser redirecionada para o arquivo de log de erro, ocorrerá um erro e a inicialização falhará.

No Windows, `--console` tem precedência sobre `--log-error` se ambos forem fornecidos. Nesse caso, o destino padrão do log de erro é a consola, e não um arquivo.

* `--log-isam[=file_name]`

  <table frame="box" rules="all" summary="Propriedades para ansi"><tr><th>Formato de linha de comando</th> <td><code>--ansi</code></td> </tr></table>

  Registre todas as alterações no `MyISAM` neste arquivo (usado apenas durante a depuração do `MyISAM`).

* `--log-raw`

  <table frame="box" rules="all" summary="Propriedades para basedir"><tr><th>Formato de linha de comando</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Variável do sistema</th> <td><code><a class="link" href="server-system-variables.html#sysvar_basedir">basedir</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code>SET_VAR</code></a> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome de diretório</td> </tr><tr><th>Valor padrão</th> <td><code>parent of mysqld installation directory</code></td> </tr></table>

As senhas em determinadas declarações escritas no log de consulta geral, no log de consultas lentas e no log binário são reescritas pelo servidor para não ocorrerem literalmente em texto simples. A reescrita de senhas pode ser suprimida para o log de consulta geral iniciando o servidor com a opção `--log-raw`. Esta opção pode ser útil para fins de diagnóstico, para ver o texto exato das declarações recebidas pelo servidor, mas, por razões de segurança, não é recomendada para uso em produção.

Se um plugin de reescrita de consultas estiver instalado, a opção `--log-raw` afeta o registro de declarações da seguinte forma:

+ Sem `--log-raw`, o servidor registra a declaração devolvida pelo plugin de reescrita de consultas. Isso pode diferir da declaração recebida.

+ Com `--log-raw`, o servidor registra a declaração original recebida.

Para mais informações, consulte a Seção 8.1.2.3, “Senhas e Registro”.

* `--log-short-format`

<table frame="box" rules="all" summary="Propriedades para basedir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Variável do Sistema</th> <td><code><a class="link" href="server-system-variables.html#sysvar_basedir">basedir</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Dicas de Configuração de Variáveis"><code>SET_VAR</code></a> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome de diretório</td> </tr><tr><th>Valor Padrão</th> <td><code>parent of mysqld installation directory</code></td> </tr></tbody></table>

Registre menos informações no log de consultas lentas, se ele tiver sido ativado.

* `--log-tc=file_name`

<table frame="box" rules="all" summary="Propriedades para basedir">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--basedir=dir_name</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code><a class="link" href="server-system-variables.html#sysvar_basedir">basedir</a></code></td>
  </tr>
  <tr>
    <th>Âmbito</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code>SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do diretório</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>parent of mysqld installation directory</code></td>
  </tr>
</table>
2

O nome do arquivo de log do coordenador de transações mapeado à memória (para transações XA que afetam múltiplos motores de armazenamento quando o log binário está desativado). O nome padrão é `tc.log`. O arquivo é criado no diretório de dados, se não for fornecido como um nome de caminho completo. Esta opção não é usada.

* `--log-tc-size=size`

<table frame="box" rules="all" summary="Propriedades para basedir">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--basedir=dir_name</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code><a class="link" href="server-system-variables.html#sysvar_basedir">basedir</a></code></td>
  </tr>
  <tr>
    <th>Âmbito</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code>SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do diretório</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>parent of mysqld installation directory</code></td>
  </tr>
</table>
3. O tamanho em bytes do log do coordenador de transações mapeado à memória. Os valores padrão e mínimos são 6 vezes o tamanho da página, e o valor deve ser um múltiplo do tamanho da página.

* `--memlock`

<table frame="box" rules="all" summary="Propriedades para basedir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Variável do sistema</th> <td><code><a class="link" href="server-system-variables.html#sysvar_basedir">basedir</a></code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dica de sintaxe para <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Dica de configuração de variáveis"><code>SET_VAR</a></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td><code>parent of mysqld installation directory</code></td> </tr></tbody></table>

  Bloquear o processo **mysqld** na memória. Esta opção pode ajudar se você tiver um problema em que o sistema operacional está fazendo o **mysqld** trocar para o disco.

  A opção `--memlock` funciona em sistemas que suportam a chamada de sistema `mlockall()`; isso inclui Solaris, a maioria das distribuições Linux que usam um kernel 2.4 ou superior e talvez outros sistemas Unix. Em sistemas Linux, você pode verificar se `mlockall()` (e, portanto, esta opção) é suportado verificando se está definido no arquivo `mman.h` do sistema, da seguinte forma:

  ```
  $> grep mlockall /usr/include/sys/mman.h
  ```

  Se `mlockall()` for suportado, você deve ver na saída do comando anterior algo como o seguinte:

  ```
  extern int mlockall (int __flags) __THROW;
  ```

  Importante

  O uso desta opção pode exigir que você execute o servidor como `root`, o que, por razões de segurança, normalmente não é uma boa ideia. Veja a Seção 8.1.5, “Como executar o MySQL como um usuário normal”.

Em Linux e talvez em outros sistemas, você pode evitar a necessidade de executar o servidor como `root` alterando o arquivo `limits.conf`. Consulte as notas sobre o limite de memlock na Seção 10.12.3.3, “Habilitar Suporte a Páginas Grandes”.

Você não deve usar essa opção em um sistema que não suporte a chamada de sistema `mlockall`; se você o fizer, é muito provável que o **mysqld** saia imediatamente assim que você tentar iniciá-lo.

* `--myisam-block-size=N`

  <table frame="box" rules="all" summary="Propriedades para basedir"><tr><th>Formato de Linha de Comando</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Variável do Sistema</th> <td><code><a class="link" href="server-system-variables.html#sysvar_basedir">basedir</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Configuração de Variáveis"><code>SET_VAR</code></a> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome de diretório</td> </tr><tr><th>Valor Padrão</th> <td><code>parent of mysqld installation directory</code></td> </tr></tbody></table>

  O tamanho de bloco a ser usado para páginas de índice `MyISAM`.

* `--no-defaults`

  Não leia nenhum arquivo de opção. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opção, o `--no-defaults` pode ser usado para impedir que sejam lidas. Isso deve ser a primeira opção na linha de comando se for usado.

  Para obter informações adicionais sobre essa e outras opções de arquivos de opção, consulte a Seção 6.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opção”.

* `--no-monitor`

<table frame="box" rules="all" summary="Propriedades para basedir">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--basedir=dir_name</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code><a class="link" href="server-system-variables.html#sysvar_basedir">basedir</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmica</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hinta de Configuração de Variáveis"><code>SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome de diretório</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>parent of mysqld installation directory</code></td>
  </tr>
</table>
(Apenas para Windows). Esta opção suprime o forking que é usado para implementar a instrução `RESTART`: o forking permite que um processo atue como monitor do outro, que atua como o servidor. Para um servidor iniciado com esta opção, `RESTART` simplesmente sai e não reinicia.

* `--performance-schema-xxx`

  Configure uma opção do Schema de Desempenho. Para detalhes, consulte a Seção 29.14, “Opções de Comando do Schema de Desempenho”.

* `--plugin-load=plugin_list`

<table frame="box" rules="all" summary="Propriedades para basedir">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--basedir=dir_name</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code><a class="link" href="server-system-variables.html#sysvar_basedir">basedir</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hinta de Configuração de Variáveis"><code>SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do diretório</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>parent of mysqld installation directory</code></td>
  </tr>
</table>

  Esta opção indica ao servidor que deve carregar os plugins nomeados no momento do início. Se forem fornecidas várias opções `--plugin-load`, apenas a última se aplica. Plugins adicionais a serem carregados podem ser especificados usando opções `--plugin-load-add`.

  O valor da opção é uma lista separada por ponto-e-vírgula de valores de *`plugin_library`* e *`name`*=`*`plugin_library*`. Cada *`plugin_library`* é o nome de um arquivo de biblioteca que contém o código do plugin, e cada *`name`* é o nome de um plugin a ser carregado. Se uma biblioteca de plugin for nomeada sem qualquer nome de plugin anterior, o servidor carrega todos os plugins da biblioteca. Com um nome de plugin anterior, o servidor carrega apenas o plugin nomeado da biblioteca. O servidor procura por arquivos de biblioteca de plugin no diretório nomeado pela variável de sistema `plugin_dir`.

  Por exemplo, se os plugins chamados `myplug1` e `myplug2` estiverem contidos nos arquivos de biblioteca de plugins `myplug1.so` e `myplug2.so`, use esta opção para realizar um carregamento de plugin antecipado:

  ```
  mysqld --plugin-load="myplug1=myplug1.so;myplug2=myplug2.so"
  ```

As citações cercam o valor do argumento porque, caso contrário, alguns interpretadores de comandos interpretam o ponto e vírgula (`;`) como um caractere especial. (Por exemplo, as caixas de comandos do Unix o tratam como um terminal de comando.)

Cada plugin nomeado é carregado apenas para uma única invocação do **mysqld**. Após um reinício, o plugin não é carregado, a menos que a opção `--plugin-load` seja usada novamente. Isso contrasta com `INSTALL PLUGIN`, que adiciona uma entrada na tabela `mysql.plugins` para fazer com que o plugin seja carregado para cada inicialização normal do servidor.

Durante a sequência de inicialização normal, o servidor determina quais plugins carregar lendo a tabela de sistema `mysql.plugins`. Se o servidor for iniciado com a opção `--skip-grant-tables`, os plugins registrados na tabela `mysql.plugins` não são carregados e estão indisponíveis. `--plugin-load` habilita o carregamento de plugins mesmo quando `--skip-grant-tables` é fornecido. `--plugin-load` também habilita o carregamento de plugins na inicialização que não podem ser carregados em tempo de execução.

Esta opção não define uma variável de sistema correspondente. A saída do `SHOW PLUGINS` fornece informações sobre os plugins carregados. Informações mais detalhadas podem ser encontradas na tabela do esquema de informações `PLUGINS`. Veja a Seção 7.6.2, “Obtendo Informações de Plugins do Servidor”.

Para informações adicionais sobre o carregamento de plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

* `--plugin-load-add=plugin_list`

<table frame="box" rules="all" summary="Propriedades para basedir">
  <tr>
    <th>Formato de Linha de Comando</th> <td><code>--basedir=dir_name</code></td> </tr>
    <tr>
      <th>Variável do Sistema</th> <td><code><a class="link" href="server-system-variables.html#sysvar_basedir">basedir</a></code></td> </tr>
    </tr>
    <tr>
      <th>Alcance</th> <td>Global</td> </tr>
    </tr>
    <tr>
      <th>Dinâmico</th> <td>Não</td> </tr>
    </tr>
    <tr>
      <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code>SET_VAR</a></th> <td>Não</td> </tr>
    </tr>
    <tr>
      <th>Tipo</th> <td>Nome do diretório</td> </tr>
    </tr>
    <tr>
      <th>Valor Padrão</th> <td><code>parent of mysqld installation directory</code></td> </tr>
  </table>

  Esta opção complementa a opção `--plugin-load`. `--plugin-load-add` adiciona um plugin ou plugins ao conjunto de plugins a serem carregados no início. O formato do argumento é o mesmo que para `--plugin-load`. `--plugin-load-add` pode ser usado para evitar especificar um grande conjunto de plugins como um único argumento longo e complicado `--plugin-load`.

  `--plugin-load-add` pode ser usado na ausência de `--plugin-load`, mas qualquer instância de `--plugin-load-add` que apareça antes de `--plugin-load` não tem efeito porque `--plugin-load` redefini o conjunto de plugins a serem carregados. Em outras palavras, essas opções:

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

Esta opção não define uma variável de sistema correspondente. A saída do comando `SHOW PLUGINS` fornece informações sobre os plugins carregados. Informações mais detalhadas podem ser encontradas na tabela do esquema de informações `PLUGINS`. Veja a Seção 7.6.2, “Obtendo Informações de Plugins do Servidor”.

Para informações adicionais sobre o carregamento de plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

* `--plugin-xxx`

Especifica uma opção que pertence a um plugin do servidor. Por exemplo, muitos motores de armazenamento podem ser construídos como plugins, e para esses motores, as opções para eles podem ser especificadas com o prefixo `--plugin`. Assim, a opção `--innodb-file-per-table` para o `InnoDB` pode ser especificada como `--plugin-innodb-file-per-table`.

Para opções booleanas que podem ser habilitadas ou desabilitadas, o prefixo `--skip` e outros formatos alternativos são suportados também (veja a Seção 6.2.2.4, “Modificadores de Opção do Programa”). Por exemplo, `--skip-plugin-innodb-file-per-table` desabilita `innodb-file-per-table`.

A razão para o prefixo `--plugin` é que ele permite que as opções do plugin sejam especificadas de forma inequívoca se houver um conflito de nome com uma opção do servidor embutida. Por exemplo, se um escritor de plugins nomear um plugin “sql” e implementar uma opção “mode”, o nome da opção pode ser `--sql-mode`, o que entraria em conflito com a opção embutida do mesmo nome. Nesses casos, as referências ao nome em conflito são resolvidas em favor da opção embutida. Para evitar a ambiguidade, os usuários podem especificar a opção do plugin como `--plugin-sql-mode`. O uso do prefixo `--plugin` para opções de plugin é recomendado para evitar qualquer questão de ambiguidade.

* `--port=port_num`, `-P port_num`

<table frame="box" rules="all" summary="Propriedades para basedir">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--basedir=nome_do_diretório</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code><a class="link" href="server-system-variables.html#sysvar_basedir">basedir</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmica</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do diretório</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>parent of mysqld installation directory</code></td>
  </tr>
</table>

  O número de porta a ser usado ao ouvir conexões TCP/IP. Em sistemas Unix e Unix-like, o número de porta deve ser 1024 ou maior, a menos que o servidor seja iniciado pelo usuário do sistema operacional `root`. Definir essa opção para 0 faz com que o valor padrão seja usado.

* `--port-open-timeout=num`

  <table frame="box" rules="all" summary="Propriedades para funções de verificação de tabelas">
    <tr>
      <th>Formato de Linha de Comando</th>
      <td><code>--check-table-functions=valor</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>Enumeração</td>
    </tr>
    <tr>
      <th>Valor Padrão</th>
      <td><code>ABORT</code></td>
    </tr>
    <tr>
      <th>Valores Válidos</th>
      <td><p class="valid-value"><code>WARN</code></p><p class="valid-value"><code>ABORT</code></p></td>
    </tr>
  </table>

Em alguns sistemas, quando o servidor é parado, a porta TCP/IP pode não ficar disponível imediatamente. Se o servidor for reiniciado rapidamente depois disso, sua tentativa de reabrir a porta pode falhar. Esta opção indica quantos segundos o servidor deve esperar para que a porta TCP/IP fique livre se não puder ser aberta. O padrão é não esperar.

* `--print-defaults`

  Imprima o nome do programa e todas as opções que ele recebe de arquivos de opções. Os valores das senhas são mascarados. Isso deve ser a primeira opção na linha de comando se for usada, exceto que pode ser usada imediatamente após `--defaults-file` ou `--defaults-extra-file`.

  Para obter informações adicionais sobre esta e outras opções de arquivos de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opções”.

* `--remove [nome_do_serviço]`

  <table frame="box" rules="all" summary="Propriedades para funções de tabela de verificação"><tbody><tr><th>Formato de linha de comando</th> <td><code>--check-table-functions=valor</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td><code>ABORT</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>WARN</code></p><p class="valid-value"><code>ABORT</code></p></td> </tr></tbody></table>

  (Apenas no Windows) Remova um serviço MySQL no Windows. O nome do serviço padrão é `MySQL` se nenhum valor de *`service_name`* for fornecido. Para mais informações, consulte a Seção 2.3.3.8, “Iniciar o MySQL como um serviço do Windows”.

* `--safe-user-create`

<table frame="box" rules="all" summary="Propriedades para funções de tabela de verificação"><tr><th>Formato de linha de comando</th> <td><code>--check-table-functions=valor</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td><code>ABORT</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>WARN</code></p><p class="valid-value"><code>ABORT</code></p></td> </tr></table>

  Se esta opção estiver habilitada, um usuário não poderá criar novos usuários do MySQL usando a instrução `GRANT`, a menos que o usuário tenha o privilégio `INSERT` para a tabela de sistema `mysql.user` ou qualquer coluna na tabela. Se você quiser que um usuário tenha a capacidade de criar novos usuários que tenham esses privilégios, o usuário deve conceder o seguinte privilégio:

  ```
  GRANT INSERT(user) ON mysql.user TO 'user_name'@'host_name';
  ```

  Isso garante que o usuário não possa alterar diretamente as colunas de privilégio, mas deve usar a instrução `GRANT` para conceder privilégios a outros usuários.

* `--skip-grant-tables`

  <table frame="box" rules="all" summary="Propriedades para funções de tabela de verificação"><tr><th>Formato de linha de comando</th> <td><code>--check-table-functions=valor</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td><code>ABORT</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>WARN</code></p><p class="valid-value"><code>ABORT</code></p></td> </tr></table>

  Esta opção afeta a sequência de inicialização do servidor:

`--skip-grant-tables` faz com que o servidor não leia as tabelas de concessão no esquema de sistema `mysql`, e, assim, comece sem usar o sistema de privilégios. Isso dá a qualquer pessoa com acesso ao servidor *acesso ilimitado a todas as bases de dados*.

Como iniciar o servidor com `--skip-grant-tables` desabilita as verificações de autenticação, o servidor também desabilita as conexões remotas nesse caso, ativando `skip_networking`.

Para fazer com que um servidor iniciado com `--skip-grant-tables` carregue as tabelas de concessão em tempo de execução, execute uma operação de limpeza de privilégios, que pode ser feita da seguinte maneira:

- Emita uma declaração `FLUSH PRIVILEGES` do MySQL após se conectar ao servidor.

- Execute um comando **mysqladmin flush-privileges** ou **mysqladmin reload** a partir da linha de comando.

A limpeza de privilégios também pode ocorrer implicitamente como resultado de outras ações realizadas após o início, fazendo com que o servidor comece a usar as tabelas de concessão. Por exemplo, o servidor limpa os privilégios se realizar uma atualização durante a sequência de inicialização.

`--skip-grant-tables` desabilita o rastreamento de logins falhos e o bloqueio temporário de contas, porque essas capacidades dependem das tabelas de concessão. Veja a Seção 8.2.15, “Gestão de Senhas”.

`--skip-grant-tables` faz com que o servidor não carregue certos outros objetos registrados no dicionário de dados ou no esquema de sistema `mysql`:

- Eventos agendados instalados usando `CREATE EVENT` e registrados na tabela de dicionário de dados `events`.

- Plugins instalados usando `INSTALL PLUGIN` e registrados na tabela de sistema `mysql.plugin`.

Para fazer com que os plugins sejam carregados mesmo quando usando `--skip-grant-tables`, use a opção `--plugin-load` ou `--plugin-load-add`.

- Funções carregáveis instaladas usando `CREATE FUNCTION` e registradas na tabela de sistema `mysql.func`.

`--skip-grant-tables` *não* suprime o carregamento durante o inicialização de componentes.

+ `--skip-grant-tables` faz com que a variável de sistema `disabled_storage_engines` não tenha efeito.

* `--skip-new`

<table frame="box" rules="all" summary="Propriedades para funções de verificação de tabelas"><tbody><tr><th>Formato de linha de comando</th> <td><code>--check-table-functions=value</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td><code>ABORT</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>WARN</code></p><p class="valid-value"><code>ABORT</code></p></td> </tr></tbody></table>

Esta opção desabilita (o que costumava ser considerado) novos comportamentos, possivelmente inseguros. Isso resulta nestas configurações: `delay_key_write=OFF`, `concurrent_insert=NEVER`, `automatic_sp_privileges=OFF`. Também faz com que `OPTIMIZE TABLE` seja mapeado para `ALTER TABLE` para motores de armazenamento para os quais `OPTIMIZE TABLE` não é suportado.

Esta opção é desatualizada e está sujeita à remoção em uma futura versão.

* `--skip-show-database`

<table frame="box" rules="all" summary="Propriedades para funções de verificação de tabelas">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--check-table-functions=valor</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Enumeração</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>ABORT</code></td>
  </tr>
  <tr>
    <th>Valores Válidos</th>
    <td><p class="valid-value"><code>WARN</code></p><p class="valid-value"><code>ABORT</code></p></td>
  </tr>
</table>

  Esta opção define a variável de sistema `skip_show_database` que controla quem tem permissão para usar a instrução `SHOW DATABASES`. Consulte a Seção 7.1.8, “Variáveis de Sistema do Servidor”.

* `--skip-stack-trace`

  <table frame="box" rules="all" summary="Propriedades para funções de verificação de tabelas">
    <tr>
      <th>Formato de Linha de Comando</th>
      <td><code>--check-table-functions=valor</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>Enumeração</td>
    </tr>
    <tr>
      <th>Valor Padrão</th>
      <td><code>ABORT</code></td>
    </tr>
    <tr>
      <th>Valores Válidos</th>
      <td><p class="valid-value"><code>WARN</code></p><p class="valid-value"><code>ABORT</code></p></td>
    </tr>
  </table>

  Não escreva traços de pilha. Esta opção é útil quando você está executando o **mysqld** sob um depurador. Em alguns sistemas, você também deve usar esta opção para obter um arquivo de núcleo. Consulte a Seção 7.9, “Depuração do MySQL”.

* `--slow-start-timeout=timeout`

<table frame="box" rules="all" summary="Propriedades para funções de verificação de tabelas">
  <tr><th>Formato de Linha de Comando</th> <td><code>--check-table-functions=valor</code></td> </tr>
  <tr><th>Tipo</th> <td>Enumeração</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>ABORT</code></td> </tr>
  <tr><th>Valores Válidos</th> <td><p class="valid-value"><code>WARN</code></p><p class="valid-value"><code>ABORT</code></p></td> </tr>
</table>

No Unix, essa opção especifica o arquivo de socket Unix a ser usado ao ouvir conexões locais. O valor padrão é `/tmp/mysql.sock`. Se essa opção for fornecida, o servidor cria o arquivo no diretório de dados, a menos que um nome de caminho absoluto seja fornecido para especificar um diretório diferente. No Windows, a opção especifica o nome de pipe a ser usado ao ouvir conexões locais que usam um pipe nomeado. O valor padrão é `MySQL` (não case-sensitive).

[`--sql-mode=value[,value[,value...]]`](server-options.html#option_mysqld_sql-mode)

  <table frame="box" rules="all" summary="Propriedades para funções de verificação de tabelas"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--check-table-functions=value</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ABORT</code></td> </tr><tr><th>Valores Válidos</th> <td><p class="valid-value"><code>WARN</code></p><p class="valid-value"><code>ABORT</code></p></td> </tr></tbody></table>

  Defina o modo SQL. Veja a Seção 7.1.11, “Modos SQL do Servidor”.

  Nota

  Os programas de instalação do MySQL podem configurar o modo SQL durante o processo de instalação.

  Se o modo SQL for diferente do padrão ou do que você espera, verifique se há uma configuração em um arquivo de opção que o servidor lê ao inicializar.

* `--standalone`

  <table frame="box" rules="all" summary="Propriedades para chroot"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--chroot=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome de diretório</td> </tr></tbody></table>

  Disponível apenas no Windows; instrui o servidor MySQL a não ser executado como serviço.

* `--super-large-pages`

<table frame="box" rules="all" summary="Propriedades para chroot"><tbody><tr><th>Formato de linha de comando</th> <td><code>--chroot=nome_diretorio</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  O uso padrão de páginas grandes no MySQL tenta usar o maior tamanho suportado, até 4 MB. Sob o Solaris, uma funcionalidade de "páginas super grandes" permite o uso de páginas de até 256 MB. Esta funcionalidade está disponível para plataformas SPARC recentes. Pode ser habilitada ou desabilitada usando a opção `--super-large-pages` ou `--skip-super-large-pages`.

* `--symbolic-links`, `--skip-symbolic-links`

  <table frame="box" rules="all" summary="Propriedades para chroot"><tbody><tr><th>Formato de linha de comando</th> <td><code>--chroot=nome_diretorio</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  Habilitar ou desabilitar o suporte a links simbólicos. No Unix, habilitar links simbólicos significa que você pode vincular um arquivo de índice ou arquivo de dados `MyISAM` a outro diretório com a opção `INDEX DIRECTORY` ou `DATA DIRECTORY` da instrução `CREATE TABLE`. Se você excluir ou renomear a tabela, os arquivos a que seus links simbólicos apontam também são excluídos ou renomeados. Veja a Seção 10.12.2.2, “Usando Links Simbólicos para Tabelas MyISAM no Unix”.

  Nota

  O suporte a links simbólicos, juntamente com a opção `--symbolic-links` que o controla, é desatualizado; você deve esperar que ele seja removido em uma versão futura do MySQL. Além disso, a opção é desabilitada por padrão. A variável de sistema relacionada `have_symlink` também é desatualizada; espere que ela seja removida em uma versão futura do MySQL.

  Esta opção não tem significado no Windows.

* `--sysdate-is-now`

<table frame="box" rules="all" summary="Propriedades para chroot"><tr><th>Formato de linha de comando</th> <td><code>--chroot=nome_diretorio</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></table>

`SYSDATE()` por padrão retorna a hora em que ele é executado, e não a hora em que a instrução em que ele ocorre começa a ser executada. Isso difere do comportamento de `NOW()`. Esta opção faz com que `SYSDATE()` seja um sinônimo de `NOW()`. Para informações sobre as implicações para o registro binário e a replicação, consulte a descrição para `SYSDATE()` na Seção 14.7, “Funções de Data e Hora” e para `SET TIMESTAMP` na Seção 7.1.8, “Variáveis do Sistema do Servidor”.

* `--tc-heuristic-recover={COMMIT|ROLLBACK}`

<table frame="box" rules="all" summary="Propriedades para chroot"><tr><th>Formato de linha de comando</th> <td><code>--chroot=nome_diretorio</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></table>

A decisão de usar em uma recuperação heurística manual.

Se uma opção `--tc-heuristic-recover` for especificada, o servidor sai, independentemente de a recuperação heurística manual ter sucesso.

Em sistemas com mais de um mecanismo de armazenamento capaz de commit de duas fases, a opção `ROLLBACK` não é segura e faz com que a recuperação seja interrompida com o seguinte erro:

```
  [ERROR] --tc-heuristic-recover rollback
  strategy is not safe on systems with more than one 2-phase-commit-capable
  storage engine. Aborting crash recovery.
  ```

* `--transaction-isolation=level`

<table frame="box" rules="all" summary="Propriedades para chroot"><tr><th>Formato de linha de comando</th> <td><code>--chroot=nome_diretorio</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></table>

Define o nível padrão de isolamento de transação. O valor `level` pode ser `READ-UNCOMMITTED`, `READ-COMMITTED`, `REPEATABLE-READ` ou `SERIALIZABLE`. Consulte a Seção 15.3.7, “Instrução SET TRANSACTION”.

O nível padrão de isolamento de transação também pode ser definido em tempo de execução usando a instrução `SET TRANSACTION` ou configurando a variável de sistema `transaction_isolation`.

* `--transaction-read-only`

  <table frame="box" rules="all" summary="Propriedades para chroot"><tbody><tr><th>Formato de linha de comando</th> <td><code>--chroot=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  Define o modo padrão de acesso de transação. Por padrão, o modo de leitura-only está desativado, então o modo é leitura/escrita.

  Para definir o modo padrão de acesso de transação em tempo de execução, use a instrução `SET TRANSACTION` ou configure a variável de sistema `transaction_read_only`. Consulte a Seção 15.3.7, “Instrução SET TRANSACTION”.

* `--tmpdir=dir_name`, `-t dir_name`

  <table frame="box" rules="all" summary="Propriedades para chroot"><tbody><tr><th>Formato de linha de comando</th> <td><code>--chroot=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  O caminho do diretório a ser usado para criar arquivos temporários. Isso pode ser útil se o diretório padrão `/tmp` estiver em uma partição que é muito pequena para conter tabelas temporárias. Esta opção aceita vários caminhos que são usados de forma rotativa. Os caminhos devem ser separados por caracteres colchetes (`) no Unix e por pontos e vírgulas (`;`) no Windows.

`--tmpdir` pode ser um local não permanente, como um diretório em um sistema de arquivos baseado em memória ou um diretório que é limpo quando o host do servidor é reiniciado. Se o servidor MySQL estiver atuando como uma replica e você estiver usando um local não permanente para `--tmpdir`, considere definir um diretório temporário diferente para a replica usando a variável de sistema `replica_load_tmpdir`. Para uma replica, os arquivos temporários usados para replicar as instruções `LOAD DATA` são armazenados neste diretório, então, com um local permanente, eles podem sobreviver a reinicializações de máquina, embora a replicação possa continuar após um reinício se os arquivos temporários tiverem sido removidos.

Para mais informações sobre o local de armazenamento dos arquivos temporários, consulte a Seção B.3.3.5, “Onde o MySQL Armazena Arquivos Temporários”.

* `--upgrade=value`

  <table frame="box" rules="all" summary="Propriedades para chroot"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--chroot=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  Esta opção controla se e como o servidor realiza uma atualização automática no início. A atualização automática envolve dois passos:

  + Passo 1: Atualização do dicionário de dados.

    Este passo atualiza:

    - As tabelas do dicionário de dados no esquema `mysql`. Se a versão real do dicionário de dados for menor que a versão esperada atual, o servidor atualiza o dicionário de dados. Se não puder, ou for impedido de fazê-lo, o servidor não pode ser executado.

    - O Schema de Desempenho e `INFORMATION_SCHEMA`.

  + Passo 2: Atualização do servidor.

    Este passo compreende todas as outras tarefas de atualização. Se os dados da instalação existentes tiverem uma versão MySQL menor que a esperada pelo servidor, eles devem ser atualizados:

- As tabelas do sistema no esquema `mysql` (as tabelas restantes que não são do dicionário de dados).

- O esquema `sys`.
- Esquemas de usuários.

Para obter detalhes sobre as etapas de atualização 1 e 2, consulte a Seção 3.4, “O que a atualização do processo MySQL atualiza”.

Estes valores da opção `--upgrade` são permitidos:

+ `AUTO`

O servidor realiza uma atualização automática de qualquer coisa que ele encontrar como desatualizada (etapas 1 e 2). Esta é a ação padrão se `--upgrade` não for especificada explicitamente.

+ `NONE`

O servidor não realiza etapas de atualização automática durante o processo de inicialização (pula as etapas 1 e 2). Como este valor de opção impede uma atualização do dicionário de dados, o servidor sai com um erro se o dicionário de dados for encontrado como desatualizado:

```
    [ERROR] [MY-013381] [Server] Server shutting down because upgrade is
    required, yet prohibited by the command line option '--upgrade=NONE'.
    [ERROR] [MY-010334] [Server] Failed to initialize DD Storage Engine
    [ERROR] [MY-010020] [Server] Data Dictionary initialization failed.
    ```

+ `MINIMAL`

O servidor atualiza o dicionário de dados, o Schema de Desempenho e o `INFORMATION_SCHEMA`, se necessário (etapa 1). Observe que, após uma atualização com esta opção, a Replicação de Grupo não pode ser iniciada, porque as tabelas do sistema nas quais o interno da replicação depende não são atualizadas, e a funcionalidade reduzida também pode ser aparente em outras áreas.

+ `FORCE`

O servidor atualiza o dicionário de dados, o Schema de Desempenho e o `INFORMATION_SCHEMA`, se necessário (etapa 1). Além disso, o servidor força uma atualização de tudo o mais (etapa 2). Espere que a inicialização do servidor leve mais tempo com esta opção, porque o servidor verifica todos os objetos em todos os esquemas.

`FORCE` é útil para forçar que as ações da etapa 2 sejam realizadas se o servidor achar que elas não são necessárias. Por exemplo, você pode acreditar que uma tabela do sistema está faltando ou foi danificada e deseja forçar uma reparação.

A tabela a seguir resume as ações realizadas pelo servidor para cada valor de opção.

<table frame="box" rules="all" summary="Propriedades para chroot"><tbody><tr><th>Formato de linha de comando</th> <td><code>--chroot=nome_diretorio</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

* `--user={nome_usuario|ID_usuario}`, `-u {nome_usuario|ID_usuario}`

  <table frame="box" rules="all" summary="Propriedades para console"><tbody><tr><th>Formato de linha de comando</th> <td><code>--console</code></td> </tr><tr><th>Especifica plataforma</th> <td>Windows</td> </tr></tbody></table>

  Execute o servidor **mysqld** como o usuário com o nome *`nome_usuario`* ou o ID de usuário numérico *`ID_usuario`*. (“Usuário” neste contexto se refere a uma conta de login do sistema, não a um usuário MySQL listado nas tabelas de concessão.)

  Esta opção é *obrigatória* ao iniciar o **mysqld** como `root`. O servidor altera seu ID de usuário durante sua sequência de inicialização, fazendo com que ele execute como esse usuário específico em vez de como `root`. Veja a Seção 8.1.1, “Diretrizes de segurança”.

  Para evitar um possível buraco de segurança onde um usuário adiciona uma opção `--user=root` a um arquivo `my.cnf` (causando assim que o servidor execute como `root`), o **mysqld** usa apenas a primeira opção `--user` especificada e produz um aviso se houver múltiplas opções `--user`. As opções em `/etc/my.cnf` e `$MYSQL_HOME/my.cnf` são processadas antes das opções de linha de comando, portanto, recomenda-se que você coloque uma opção `--user` em `/etc/my.cnf` e especifique um valor diferente de `root`. A opção em `/etc/my.cnf` é encontrada antes de quaisquer outras opções `--user`, o que garante que o servidor execute como um usuário diferente de `root`, e que um aviso seja gerado se qualquer outra opção `--user` for encontrada.

* `--validate-config`

<table frame="box" rules="all" summary="Propriedades para console"><tbody><tr><th>Formato de linha de comando</th> <td><code>--console</code></td> </tr><tr><th>Específico da plataforma</th> <td>Windows</td> </tr></tbody></table>

  Valide a configuração de inicialização do servidor. Se não forem encontrados erros, o servidor termina com um código de saída de 0. Se um erro for encontrado, o servidor exibe uma mensagem de diagnóstico e termina com um código de saída de 1. Mensagens de aviso e informações também podem ser exibidas, dependendo do valor de `log_error_verbosity`, mas não produzem a interrupção imediata da validação ou um código de saída de 1. Para mais informações, consulte a Seção 7.1.3, “Validação da Configuração do Servidor”.

* `--validate-user-plugins[={OFF|ON}]`

  <table frame="box" rules="all" summary="Propriedades para console"><tbody><tr><th>Formato de linha de comando</th> <td><code>--console</code></td> </tr><tr><th>Específico da plataforma</th> <td>Windows</td> </tr></tbody></table>

  Se esta opção estiver habilitada (padrão), o servidor verifica cada conta de usuário e produz um aviso se forem encontradas condições que tornariam a conta inutilizável:

  + A conta requer um plugin de autenticação que não está carregado.

  + A conta requer o plugin de autenticação `sha256_password` (desatualizado) ou `caching_sha2_password`, mas o servidor foi iniciado sem SSL ou RSA habilitados conforme exigido pelo plugin.

  Habilitar `--validate-user-plugins` desacelera a inicialização do servidor e `FLUSH PRIVILEGES`. Se você não precisar da verificação adicional, pode desabilitar esta opção na inicialização para evitar a redução do desempenho.

* `--verbose`, `-v`

Use esta opção com a opção `--help` para obter ajuda detalhada.

* `--version`, `-V`

  Exibir informações da versão e sair.