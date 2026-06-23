## 6.7 Ferramentas de Desenvolvimento de Programas

Esta seção descreve algumas utilidades que você pode achar úteis ao desenvolver programas do MySQL.

Em scripts de shell, você pode usar o programa **my_print_defaults** para analisar arquivos de opções e ver quais opções seriam usadas por um programa específico. O exemplo a seguir mostra a saída que **my_print_defaults** pode produzir quando solicitado a mostrar as opções encontradas nos grupos `[client]` e `[mysql]`:

```
$> my_print_defaults client mysql
--port=3306
--socket=/tmp/mysql.sock
--no-auto-rehash
```

Nota para desenvolvedores: O tratamento de arquivos de opções é implementado na biblioteca de clientes em C simplesmente processando todas as opções no grupo ou grupos apropriados antes de quaisquer argumentos de linha de comando. Isso funciona bem para programas que usam a última instância de uma opção que é especificada várias vezes. Se você tem um programa em C ou C++ que trata opções especificadas várias vezes dessa maneira, mas que não lê arquivos de opções, você precisa adicionar apenas duas linhas para dar a ele essa capacidade. Verifique o código-fonte de qualquer um dos clientes padrão do MySQL para ver como fazer isso.

Várias outras interfaces de linguagem para o MySQL são baseadas na biblioteca de clientes C, e algumas delas fornecem uma maneira de acessar o conteúdo do arquivo de opções. Isso inclui Perl e Python. Para obter detalhes, consulte a documentação da interface que você prefere.

### 6.7.1 mysql_config — Exibir opções para compilar clientes

**mysql_config** fornece informações úteis para compilar seu cliente MySQL e conectá-lo ao MySQL. É um script de shell, portanto, está disponível apenas em sistemas Unix e semelhantes ao Unix.

Nota

O **pkg-config** pode ser usado como uma alternativa ao **mysql_config** para obter informações, como as opções do compilador ou as bibliotecas de ligação necessárias para compilar aplicativos MySQL. Para mais informações, consulte Construindo programas de clientes de API C usando pkg-config.

**mysql_config** suporta as seguintes opções.

* `--cflags`

Indicadores do compilador C para encontrar arquivos de inclusão e definições críticas do compilador usadas ao compilar a biblioteca `libmysqlclient`. As opções devolvidas estão ligadas ao compilador específico que foi usado quando a biblioteca foi criada e podem entrar em conflito com as configurações do seu próprio compilador. Use `--include` para opções mais portáteis que contêm apenas caminhos de inclusão.

* `--cxxflags`

Como `--cflags`, mas para as opções do compilador C++.

* `--include`

Opções do compilador para encontrar arquivos de MySQL incluem.

* `--libs`

Bibliotecas e opções necessárias para vincular com a biblioteca do cliente MySQL.

* `--libs_r`

Bibliotecas e opções necessárias para vincular com a biblioteca de cliente MySQL segura para múltiplos fios. No MySQL 8.0, todas as bibliotecas de cliente são seguras para múltiplos fios, portanto, essa opção não precisa ser usada. A opção `--libs` pode ser usada em todos os casos.

* `--plugindir`

O nome padrão do caminho do diretório do plugin, definido ao configurar o MySQL.

* `--port`

O número de porta TCP/IP padrão, definido ao configurar o MySQL.

* `--socket`

O arquivo padrão de socket Unix, definido ao configurar o MySQL.

* `--variable=var_name`

Exiba o valor da variável de configuração nomeada. Os valores permitidos de *`var_name`* são `pkgincludedir` (o diretório do arquivo de cabeçalho), `pkglibdir` (o diretório da biblioteca) e `plugindir` (o diretório do plugin).

* `--version`

Número da versão para a distribuição MySQL.

Se você invocar **mysql_config** sem opções, ele exibe uma lista de todas as opções que ele suporta, e seus valores:

```
$> mysql_config
Usage: /usr/local/mysql/bin/mysql_config [options]
Options:
  --cflags         [-I/usr/local/mysql/include/mysql -mcpu=pentiumpro]
  --cxxflags       [-I/usr/local/mysql/include/mysql -mcpu=pentiumpro]
  --include        [-I/usr/local/mysql/include/mysql]
  --libs           [-L/usr/local/mysql/lib/mysql -lmysqlclient
                    -lpthread -lm -lrt -lssl -lcrypto -ldl]
  --libs_r         [-L/usr/local/mysql/lib/mysql -lmysqlclient_r
                    -lpthread -lm -lrt -lssl -lcrypto -ldl]
  --plugindir      [/usr/local/mysql/lib/plugin]
  --socket         [/tmp/mysql.sock]
  --port           [3306]
  --version        [5.8.0-m17]
  --variable=VAR   VAR is one of:
          pkgincludedir [/usr/local/mysql/include]
          pkglibdir     [/usr/local/mysql/lib]
          plugindir     [/usr/local/mysql/lib/plugin]
```

Você pode usar **mysql_config** em uma linha de comando usando barras duplas para incluir a saída que ele produz para opções específicas. Por exemplo, para compilar e vincular um programa cliente MySQL, use **mysql_config** da seguinte forma:

```
gcc -c `mysql_config --cflags` progname.c
gcc -o progname progname.o `mysql_config --libs`
```

### 6.7.2 my_print_defaults — Opções de exibição a partir de arquivos de opção

**my_print_defaults** exibe as opções que estão presentes nos grupos de opções dos arquivos de opções. A saída indica quais opções são usadas pelos programas que leem os grupos de opções especificados. Por exemplo, o programa **mysqlcheck** lê os grupos de opções `[mysqlcheck]` e `[client]`. Para ver quais opções estão presentes nesses grupos nos arquivos de opções padrão, invoque **my_print_defaults** da seguinte forma:

```
$> my_print_defaults mysqlcheck client
--user=myusername
--password=password
--host=localhost
```

A saída consiste em opções, uma por linha, na forma como elas seriam especificadas na linha de comando.

**my_print_defaults** suporta as seguintes opções.

* `--help`, `-?`

Exibir uma mensagem de ajuda e sair.

* `--config-file=file_name`, `--defaults-file=file_name`, `-c file_name`

Leia apenas o arquivo de opção fornecido.

* `--debug=debug_options`, `-# debug_options`

Escreva um registro de depuração. Uma string típica *`debug_options`* é `d:t:o,file_name`. O padrão é `d:t:o,/tmp/my_print_defaults.trace`.

* `--defaults-extra-file=file_name`, `--extra-file=file_name`, `-e file_name`

Leia este arquivo de opção após o arquivo de opção global, mas (em Unix) antes do arquivo de opção do usuário.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-group-suffix=suffix`, `-g suffix`

Além dos grupos mencionados na linha de comando, leia grupos que tenham o sufixo especificado.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--login-path=name`, `-l name`

Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam para qual servidor MySQL se conectar e qual conta se autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql_config_editor**. Veja a Seção 6.6.7, “mysql_config_editor — Utilitário de Configuração MySQL”.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--no-defaults`, `-n`

Retorne uma string vazia.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--show`, `-s`

**my_print_defaults** mascara as senhas por padrão. Use esta opção para exibir as senhas como texto claro.

* `--verbose`, `-v`

Modo detalhado. Imprima mais informações sobre o que o programa faz.

* `--version`, `-V`

Exibir informações da versão e sair.