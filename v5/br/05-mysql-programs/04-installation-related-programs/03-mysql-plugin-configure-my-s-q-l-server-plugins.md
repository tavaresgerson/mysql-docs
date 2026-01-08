### 4.4.3 mysql\_plugin — Configurar plugins do servidor MySQL

Nota

O **mysql\_plugin** está desatualizado a partir do MySQL 5.7.11 e foi removido no MySQL 8.0. As alternativas incluem carregar plugins no início do servidor usando a opção `--plugin-load` ou `--plugin-load-add`, ou em tempo de execução usando a instrução `INSTALL PLUGIN`.

O utilitário **mysql\_plugin** permite que os administradores do MySQL gerenciem quais plugins um servidor MySQL carrega. Ele oferece uma alternativa para especificar manualmente a opção `--plugin-load` durante o início do servidor ou usar as instruções `INSTALL PLUGIN` e `UNINSTALL PLUGIN` durante a execução.

Dependendo de se **mysql\_plugin** for invocado para habilitar ou desabilitar plugins, ele insere ou exclui linhas na tabela `mysql.plugin`, que serve como um registro de plugins. (Para realizar essa operação, **mysql\_plugin** invoca o servidor MySQL no modo de inicialização. Isso significa que o servidor não deve estar em execução.) Para o início normal do servidor, o servidor carrega e habilita plugins listados em `mysql.plugin` automaticamente. Para controle adicional sobre a ativação do plugin, use as opções `--plugin_name` nomeadas para plugins específicos, conforme descrito na Seção 5.5.1, “Instalando e Desinstalando Plugins”.

Cada invocação de **mysql\_plugin** lê um arquivo de configuração para determinar como configurar os plugins contidos em um único arquivo de biblioteca de plugins. Para invocar **mysql\_plugin**, use a seguinte sintaxe:

```sql
mysql_plugin [options] plugin {ENABLE|DISABLE}
```

*`plugin`* é o nome do plugin a ser configurado. `ENABLE` ou `DISABLE` (não case-sensitive) especifica se os componentes da biblioteca de plugins nomeados no arquivo de configuração devem ser habilitados ou desabilitados. A ordem dos argumentos *`plugin`* e `ENABLE` ou `DISABLE` não importa.

Por exemplo, para configurar componentes de um arquivo de biblioteca de plugins chamado `myplugins.so` no Linux ou `myplugins.dll` no Windows, especifique um valor *`plugin`* de `myplugins`. Suponha que essa biblioteca de plugins contenha três plugins, `plugin1`, `plugin2` e `plugin3`, todos os quais devem ser configurados sob o controle de **mysql\_plugin**. Por convenção, os arquivos de configuração têm um sufixo de `.ini` e o mesmo nome base que a biblioteca de plugins, então o nome padrão do arquivo de configuração para essa biblioteca de plugins é `myplugins.ini`. O conteúdo do arquivo de configuração parece assim:

```sql
myplugins
plugin1
plugin2
plugin3
```

A primeira linha do arquivo `myplugins.ini` é o nome do arquivo da biblioteca, sem nenhuma extensão, como `.so` ou `.dll`. As linhas restantes são os nomes dos componentes que serão habilitados ou desabilitados. Cada valor no arquivo deve estar em uma linha separada. As linhas nas quais o primeiro caractere é `'#'` são consideradas comentários e ignoradas.

Para habilitar os plugins listados no arquivo de configuração, invoque o **mysql\_plugin** da seguinte maneira:

```sql
mysql_plugin myplugins ENABLE
```

Para desativar os plugins, use `DISABLE` em vez de `ENABLE`.

Um erro ocorre se o **mysql\_plugin** não conseguir encontrar o arquivo de configuração ou o arquivo da biblioteca do plugin, ou se o **mysql\_plugin** não conseguir iniciar o servidor MySQL.

O **mysql\_plugin** suporta as seguintes opções, que podem ser especificadas na linha de comando ou no grupo `[mysqld]` de qualquer arquivo de opções. Para opções especificadas em um grupo `[mysqld]`, o **mysql\_plugin** reconhece as opções `--basedir`, `--datadir` e `--plugin-dir` e ignora outras. Para obter informações sobre arquivos de opções usados por programas MySQL, consulte a Seção 4.2.2.2, “Usando arquivos de opções”.

**Tabela 4.9 Opções do mysql\_plugin**

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para mysql_plugin."><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Nome da Opção</th> <th>Descrição</th> </tr></thead><tbody><tr><td><a class="link" href="mysql-plugin.html#option_mysql_plugin_basedir">--basedir</a></td> <td>O diretório de base do servidor</td> </tr><tr><td><a class="link" href="mysql-plugin.html#option_mysql_plugin_datadir">--datadir</a></td> <td>O diretório de dados do servidor</td> </tr><tr><td><a class="link" href="mysql-plugin.html#option_mysql_plugin_help">--help</a></td> <td>Exibir mensagem de ajuda e sair</td> </tr><tr><td><a class="link" href="mysql-plugin.html#option_mysql_plugin_my-print-defaults">--my-print-defaults</a></td> <td>Caminho para my_print_defaults</td> </tr><tr><td><a class="link" href="mysql-plugin.html#option_mysql_plugin_mysqld">--mysqld</a></td> <td>Caminho para o servidor</td> </tr><tr><td><a class="link" href="mysql-plugin.html#option_mysql_plugin_no-defaults">--no-defaults</a></td> <td>Não leia o arquivo de configuração</td> </tr><tr><td><a class="link" href="mysql-plugin.html#option_mysql_plugin_plugin-dir">--plugin-dir</a></td> <td>Diretório onde os plugins são instalados</td> </tr><tr><td><a class="link" href="mysql-plugin.html#option_mysql_plugin_plugin-ini">--plugin-ini</a></td> <td>O arquivo de configuração do plugin</td> </tr><tr><td><a class="link" href="mysql-plugin.html#option_mysql_plugin_print-defaults">--print-defaults</a></td> <td>Mostrar configurações padrão do arquivo de configuração</td> </tr><tr><td><a class="link" href="mysql-plugin.html#option_mysql_plugin_verbose">--verbose</a></td> <td>Modo verbosos</td> </tr><tr><td><a class="link" href="mysql-plugin.html#option_mysql_plugin_version">--version</a></td> <td>Exibir informações da versão e sair</td> </tr></tbody></table>

- `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  Exiba uma mensagem de ajuda e saia.

- `--basedir=dir_name`, `-b dir_name`

  <table frame="box" rules="all" summary="Propriedades para basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--basedir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  O diretório de base do servidor.

- `--datadir=dir_name`, `-d dir_name`

  <table frame="box" rules="all" summary="Propriedades para datadir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--datadir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  O diretório de dados do servidor.

- `--my-print-defaults=nome_do_arquivo`, `-b nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para my-print-defaults"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--my-print-defaults=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  O caminho para o programa **my\_print\_defaults**.

- `--mysqld=nome_do_arquivo`, `-b nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para mysqld"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqld=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  O caminho para o servidor **mysqld**.

- `--no-defaults`, `-p`

  <table frame="box" rules="all" summary="Propriedades sem penalidades"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--no-defaults</code>]]</td> </tr></tbody></table>

  Não leia valores do arquivo de configuração. Esta opção permite que um administrador ignore a leitura dos valores padrão do arquivo de configuração.

  Com o **mysql\_plugin**, essa opção não precisa ser fornecida primeiro na linha de comando, ao contrário da maioria dos outros programas MySQL que suportam `--no-defaults`.

- `--plugin-dir=dir_name`, `-p dir_name`

  <table frame="box" rules="all" summary="Propriedades para plugin-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--plugin-dir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  O diretório de plugins do servidor.

- `--plugin-ini=file_name`, `-i file_name`

  <table frame="box" rules="all" summary="Propriedades para plugin-ini"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--plugin-ini=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  O arquivo de configuração do **mysql\_plugin**. Os nomes de caminho relativos são interpretados em relação ao diretório atual. Se esta opção não for fornecida, o padrão é `plugin.ini` no diretório do plugin, onde *`plugin`* é o argumento *`plugin`* na linha de comando.

- `--print-defaults`, `-P`

  <table frame="box" rules="all" summary="Propriedades para padrões de impressão"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--print-defaults</code>]]</td> </tr></tbody></table>

  Exiba os valores padrão do arquivo de configuração. Esta opção faz com que o **mysql\_plugin** imprima os valores padrão para `--basedir`, `--datadir` e `--plugin-dir` se forem encontrados no arquivo de configuração. Se nenhum valor para uma variável for encontrado, nada será exibido.

  Com o **mysql\_plugin**, essa opção não precisa ser fornecida primeiro na linha de comando, ao contrário da maioria dos outros programas MySQL que suportam `--print-defaults`.

- `--verbose`, `-v`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>0

  Modo verbose. Imprima mais informações sobre o que o programa faz. Esta opção pode ser usada várias vezes para aumentar a quantidade de informações.

- `--version`, `-V`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>1

  Exibir informações da versão e sair.
