### 6.7.1 mysql_config — Opções de Exibição para Compilar Clientes

O **mysql_config** fornece informações úteis para compilar seu cliente MySQL e conectá-lo ao MySQL. É um script de shell, portanto, está disponível apenas em sistemas Unix e similares.

Nota

**pkg-config** pode ser usado como alternativa ao **mysql_config** para obter informações como flags do compilador ou bibliotecas de ligação necessárias para compilar aplicativos MySQL. Para mais informações, consulte Construção de Programas de Clientes de API C Usando pkg-config.

O **mysql_config** suporta as seguintes opções.

* `--cflags`

  Flags do compilador C para encontrar arquivos de inclusão e flags críticos do compilador e definições usadas ao compilar a biblioteca `libmysqlclient`. As opções retornadas estão vinculadas ao compilador específico que foi usado quando a biblioteca foi criada e podem entrar em conflito com as configurações do seu próprio compilador. Use `--include` para opções mais portáteis que contêm apenas caminhos de inclusão.

* `--cxxflags`

  Como `--cflags`, mas para flags do compilador C++.

* `--include`

  Opções do compilador para encontrar arquivos de inclusão MySQL.

* `--libs`

  Bibliotecas e opções necessárias para vincular com a biblioteca de cliente MySQL.

* `--libs_r`

  Bibliotecas e opções necessárias para vincular com a biblioteca de cliente MySQL segura para threads. No MySQL 9.5, todas as bibliotecas de cliente são seguras para threads, portanto, essa opção não precisa ser usada. A opção `--libs` pode ser usada em todos os casos.

* `--plugindir`

  O nome padrão do diretório de plugins, definido ao configurar o MySQL.

* `--port`

  O número padrão do número de porta TCP/IP, definido ao configurar o MySQL.

* `--socket`

  O arquivo de socket Unix padrão, definido ao configurar o MySQL.

* `--variable=var_name`

Exiba o valor da variável de configuração nomeada. Os valores permitidos de `var_name` são `pkgincludedir` (o diretório do arquivo de cabeçalho), `pkglibdir` (o diretório da biblioteca) e `plugindir` (o diretório do plugin).

* `--version`

  Número da versão da distribuição MySQL.

Se você chamar **mysql_config** sem opções, ele exibe uma lista de todas as opções que ele suporta e seus valores:

```
$> mysql_config
Usage: ./mysql_config [OPTIONS]
Compiler: GNU 10.4.0

Options:
  --cflags         [-I/usr/local/mysql/include/mysql]
  --cxxflags       [-I/usr/local/mysql/include/mysql]
  --include        [-I/usr/local/mysql/include/mysql]
  --libs           [-L/usr/local/mysql/lib/mysql -lmysqlclient -lpthread -ldl
                    -lssl  -lcrypto -lresolv -lm -lrt]
  --libs_r         [-L/usr/local/mysql/lib/mysql -lmysqlclient -lpthread -ldl
                    -lssl  -lcrypto -lresolv -lm -lrt]
  --plugindir      [/usr/local/mysql/lib/plugin]
  --socket         [/tmp/mysql.sock]
  --port           [3306]
  --version        [8.4.0]
  --variable=VAR   VAR is one of:
          pkgincludedir [/usr/local/mysql/include]
          pkglibdir     [/usr/local/mysql/lib]
          plugindir     [/usr/local/mysql/lib/plugin]
```

Você pode usar **mysql_config** dentro de uma linha de comando usando aspas para incluir a saída que ele produz para opções específicas. Por exemplo, para compilar e vincular um programa cliente MySQL, use **mysql_config** da seguinte forma:

```
gcc -c `mysql_config --cflags` progname.c
gcc -o progname progname.o `mysql_config --libs`
```