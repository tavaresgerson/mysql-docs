### 4.7.1 mysql_config — Exibir Opções para Compilação de Clientes

[**mysql_config**](mysql-config.html "4.7.1 mysql_config — Display Options for Compiling Clients") fornece informações úteis para compilar seu cliente MySQL e conectá-lo ao MySQL. É um shell script, portanto, está disponível apenas em sistemas Unix e similares a Unix.

Nota

A partir do MySQL 5.7.9, o **pkg-config** pode ser usado como uma alternativa ao [**mysql_config**](mysql-config.html "4.7.1 mysql_config — Display Options for Compiling Clients") para obter informações como `compiler flags` ou `link libraries` necessárias para compilar aplicações MySQL. Para mais informações, consulte [Building C API Client Programs Using pkg-config](/doc/c-api/5.7/en/c-api-building-clients-pkg-config.html).

Nota

A partir do MySQL 5.7.4, para distribuições binárias para Solaris, [**mysql_config**](mysql-config.html "4.7.1 mysql_config — Display Options for Compiling Clients") não fornece argumentos para `linking` com a `embedded library`. Para obter argumentos de `linking` para a `embedded library`, use o script **mysql_server_config** em vez disso.

[**mysql_config**](mysql-config.html "4.7.1 mysql_config — Display Options for Compiling Clients") suporta as seguintes opções.

* [`--cflags`](mysql-config.html#option_mysql_config_cflags)

  `C Compiler flags` para encontrar `include files` e `compiler flags` e `defines` críticos usados ao compilar a biblioteca `libmysqlclient`. As opções retornadas estão vinculadas ao `compiler` específico usado quando a biblioteca foi criada e podem entrar em conflito com as configurações do seu próprio `compiler`. Use [`--include`](mysql-config.html#option_mysql_config_include) para opções mais portáteis que contêm apenas `include paths`.

* [`--cxxflags`](mysql-config.html#option_mysql_config_cxxflags)

  Semelhante a [`--cflags`](mysql-config.html#option_mysql_config_cflags), mas para `C++ compiler flags`.

* [`--include`](mysql-config.html#option_mysql_config_include)

  Opções de `compiler` para encontrar `include files` do MySQL.

* [`--libmysqld-libs`](mysql-config.html#option_mysql_config_libmysqld-libs), [`--embedded-libs`](mysql-config.html#option_mysql_config_libmysqld-libs), [`--embedded`](mysql-config.html#option_mysql_config_libmysqld-libs)

  Bibliotecas e opções necessárias para `link` com `libmysqld`, o `embedded server` MySQL.

  Nota

  A `embedded server library` `libmysqld` está obsoleta (deprecated) a partir do MySQL 5.7.19 e foi removida no MySQL 8.0.

* [`--libs`](mysql-config.html#option_mysql_config_libs)

  Bibliotecas e opções necessárias para `link` com a biblioteca cliente MySQL.

* [`--libs_r`](mysql-config.html#option_mysql_config_libs_r)

  Bibliotecas e opções necessárias para `link` com a biblioteca cliente MySQL `thread-safe`. No MySQL 5.7, todas as bibliotecas cliente são `thread-safe`, então esta opção não precisa ser usada. A opção [`--libs`](mysql-config.html#option_mysql_config_libs) pode ser usada em todos os casos.

* [`--plugindir`](mysql-config.html#option_mysql_config_plugindir)

  O nome do caminho do diretório `plugin` padrão, definido ao configurar o MySQL.

* [`--port`](mysql-config.html#option_mysql_config_port)

  O número da `port` TCP/IP padrão, definido ao configurar o MySQL.

* [`--socket`](mysql-config.html#option_mysql_config_socket)

  O arquivo `Unix socket` padrão, definido ao configurar o MySQL.

* [`--variable=var_name`](mysql-config.html#option_mysql_config_variable)

  Exibe o valor da variável de configuração nomeada. Os valores de *`var_name`* permitidos são `pkgincludedir` (o diretório de `header files`), `pkglibdir` (o diretório de biblioteca) e `plugindir` (o diretório de `plugins`).

* [`--version`](mysql-config.html#option_mysql_config_version)

  Número da `version` para a distribuição MySQL.

Se você invocar [**mysql_config**](mysql-config.html "4.7.1 mysql_config — Display Options for Compiling Clients") sem opções, ele exibirá uma lista de todas as opções que ele suporta, e seus valores:

```sql
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
  --version        [5.7.9]
  --libmysqld-libs [-L/usr/local/mysql/lib/mysql -lmysqld
                    -lpthread -lm -lrt -lssl -lcrypto -ldl -lcrypt]
  --variable=VAR   VAR is one of:
          pkgincludedir [/usr/local/mysql/include]
          pkglibdir     [/usr/local/mysql/lib]
          plugindir     [/usr/local/mysql/lib/plugin]
```

Você pode usar [**mysql_config**](mysql-config.html "4.7.1 mysql_config — Display Options for Compiling Clients") dentro de uma linha de comando usando `backticks` para incluir a saída que ele produz para opções específicas. Por exemplo, para compilar e fazer o `link` de um programa cliente MySQL, use [**mysql_config**](mysql-config.html "4.7.1 mysql_config — Display Options for Compiling Clients") da seguinte forma:

```sql
gcc -c `mysql_config --cflags` progname.c
gcc -o progname progname.o `mysql_config --libs`
```
