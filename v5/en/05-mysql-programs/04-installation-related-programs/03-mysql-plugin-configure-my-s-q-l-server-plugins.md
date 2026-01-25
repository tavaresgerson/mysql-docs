### 4.4.3 mysql_plugin — Configurar Plugins do MySQL Server

Nota

O **mysql_plugin** está obsoleto desde o MySQL 5.7.11 e foi removido no MySQL 8.0. As alternativas incluem carregar Plugins na inicialização do Server usando a opção `--plugin-load` ou `--plugin-load-add`, ou em tempo de execução usando a instrução `INSTALL PLUGIN`.

O utilitário **mysql_plugin** permite que administradores MySQL gerenciem quais Plugins um MySQL Server carrega. Ele fornece uma alternativa para especificar manualmente a opção `--plugin-load` na inicialização do Server ou usar as instruções `INSTALL PLUGIN` e `UNINSTALL PLUGIN` em tempo de execução.

Dependendo se o **mysql_plugin** é invocado para habilitar ou desabilitar Plugins, ele insere ou deleta linhas na tabela `mysql.plugin`, que serve como um registro de Plugin. (Para executar esta operação, o **mysql_plugin** invoca o MySQL Server em modo *bootstrap*. Isso significa que o Server não deve estar em execução.) Para inicializações normais do Server, o Server carrega e habilita automaticamente os Plugins listados em `mysql.plugin`. Para controle adicional sobre a ativação de Plugins, use opções `--plugin_name` nomeadas para Plugins específicos, conforme descrito na Seção 5.5.1, “Installing and Uninstalling Plugins”.

Cada invocação do **mysql_plugin** lê um arquivo de configuração para determinar como configurar os Plugins contidos em um único arquivo de biblioteca de Plugin. Para invocar o **mysql_plugin**, use esta sintaxe:

```sql
mysql_plugin [options] plugin {ENABLE|DISABLE}
```

*`plugin`* é o nome do Plugin a ser configurado. `ENABLE` ou `DISABLE` (sem distinção entre maiúsculas e minúsculas) especificam se os componentes da biblioteca de Plugin nomeada no arquivo de configuração devem ser habilitados ou desabilitados. A ordem dos argumentos *`plugin`* e `ENABLE` ou `DISABLE` não importa.

Por exemplo, para configurar componentes de um arquivo de biblioteca de Plugin chamado `myplugins.so` no Linux ou `myplugins.dll` no Windows, especifique um valor de *`plugin`* como `myplugins`. Suponha que esta biblioteca de Plugin contenha três Plugins, `plugin1`, `plugin2` e `plugin3`, todos os quais devem ser configurados sob o controle do **mysql_plugin**. Por convenção, arquivos de configuração têm o sufixo `.ini` e o mesmo nome base que a biblioteca de Plugin, então o nome de arquivo de configuração padrão para esta biblioteca de Plugin é `myplugins.ini`. O conteúdo do arquivo de configuração é o seguinte:

```sql
myplugins
plugin1
plugin2
plugin3
```

A primeira linha no arquivo `myplugins.ini` é o nome do arquivo da biblioteca, sem qualquer extensão como `.so` ou `.dll`. As linhas restantes são os nomes dos componentes a serem habilitados ou desabilitados. Cada valor no arquivo deve estar em uma linha separada. Linhas em que o primeiro caractere é `'#'` são consideradas comentários e ignoradas.

Para habilitar os Plugins listados no arquivo de configuração, invoque o **mysql_plugin** desta forma:

```sql
mysql_plugin myplugins ENABLE
```

Para desabilitar os Plugins, use `DISABLE` em vez de `ENABLE`.

Ocorre um erro se o **mysql_plugin** não conseguir encontrar o arquivo de configuração ou o arquivo da biblioteca de Plugin, ou se o **mysql_plugin** não conseguir iniciar o MySQL Server.

O **mysql_plugin** suporta as seguintes opções, que podem ser especificadas na Command Line ou no grupo `[mysqld]` de qualquer arquivo de opção. Para opções especificadas em um grupo `[mysqld]`, o **mysql_plugin** reconhece as opções `--basedir`, `--datadir` e `--plugin-dir` e ignora as demais. Para obter informações sobre arquivos de opção usados por programas MySQL, consulte a Seção 4.2.2.2, “Using Option Files”.

**Tabela 4.9 Opções do mysql_plugin**

<table frame="box" rules="all" summary="Command-line options available for mysql_plugin."><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Nome da Opção</th> <th>Descrição</th> </tr></thead><tbody><tr><td>--basedir</td> <td>O Directory base do Server</td> </tr><tr><td>--datadir</td> <td>O Directory de dados do Server</td> </tr><tr><td>--help</td> <td>Exibe a mensagem de ajuda e sai</td> </tr><tr><td>--my-print-defaults</td> <td>Path para o my_print_defaults</td> </tr><tr><td>--mysqld</td> <td>Path para o Server</td> </tr><tr><td>--no-defaults</td> <td>Não ler arquivo de configuração</td> </tr><tr><td>--plugin-dir</td> <td>Directory onde os Plugins estão instalados</td> </tr><tr><td>--plugin-ini</td> <td>O arquivo de configuração do Plugin</td> </tr><tr><td>--print-defaults</td> <td>Mostra os defaults do arquivo de configuração</td> </tr><tr><td>--verbose</td> <td>Modo verboso</td> </tr><tr><td>--version</td> <td>Exibe informações da versão e sai</td> </tr></tbody></table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Exibe uma mensagem de ajuda e sai.

* `--basedir=dir_name`, `-b dir_name`

  <table frame="box" rules="all" summary="Properties for basedir"><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  O Directory base do Server.

* `--datadir=dir_name`, `-d dir_name`

  <table frame="box" rules="all" summary="Properties for datadir"><tbody><tr><th>Command-Line Format</th> <td><code>--datadir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  O Directory de dados do Server.

* `--my-print-defaults=file_name`, `-b file_name`

  <table frame="box" rules="all" summary="Properties for my-print-defaults"><tbody><tr><th>Command-Line Format</th> <td><code>--my-print-defaults=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

  O Path para o programa **my_print_defaults**.

* `--mysqld=file_name`, `-b file_name`

  <table frame="box" rules="all" summary="Properties for mysqld"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqld=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

  O Path para o **mysqld** Server.

* `--no-defaults`, `-p`

  <table frame="box" rules="all" summary="Properties for no-defaults"><tbody><tr><th>Command-Line Format</th> <td><code>--no-defaults</code></td> </tr></tbody></table>

  Não ler valores do arquivo de configuração. Esta opção permite que um administrador ignore a leitura dos defaults do arquivo de configuração.

  Com o **mysql_plugin**, esta opção não precisa ser a primeira na Command Line, diferente da maioria dos outros programas MySQL que suportam `--no-defaults`.

* `--plugin-dir=dir_name`, `-p dir_name`

  <table frame="box" rules="all" summary="Properties for plugin-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--plugin-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  O Directory de Plugin do Server.

* `--plugin-ini=file_name`, `-i file_name`

  <table frame="box" rules="all" summary="Properties for plugin-ini"><tbody><tr><th>Command-Line Format</th> <td><code>--plugin-ini=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

  O arquivo de configuração do **mysql_plugin**. Path names relativos são interpretados em relação ao Directory atual. Se esta opção não for fornecida, o default é `plugin.ini` no Directory de Plugin, onde *`plugin`* é o argumento *`plugin`* na Command Line.

* `--print-defaults`, `-P`

  <table frame="box" rules="all" summary="Properties for print-defaults"><tbody><tr><th>Command-Line Format</th> <td><code>--print-defaults</code></td> </tr></tbody></table>

  Exibe os valores default do arquivo de configuração. Esta opção faz com que o **mysql_plugin** imprima os defaults para `--basedir`, `--datadir` e `--plugin-dir` se eles forem encontrados no arquivo de configuração. Se nenhum valor para uma variável for encontrado, nada é exibido.

  Com o **mysql_plugin**, esta opção não precisa ser a primeira na Command Line, diferente da maioria dos outros programas MySQL que suportam `--print-defaults`.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Modo verboso. Imprime mais informações sobre o que o programa faz. Esta opção pode ser usada múltiplas vezes para aumentar a quantidade de informação.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Exibe informações da versão e sai.