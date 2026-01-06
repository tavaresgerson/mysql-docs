### 4.7.1 mysql\_config — Exibir opções para a compilação de clientes

**mysql\_config** fornece informações úteis para compilar seu cliente MySQL e conectá-lo ao MySQL. É um script de shell, portanto, está disponível apenas em sistemas Unix e similares.

Nota

A partir do MySQL 5.7.9, o **pkg-config** pode ser usado como alternativa ao **mysql\_config** para obter informações, como flags do compilador ou bibliotecas de ligação necessárias para compilar aplicativos do MySQL. Para mais informações, consulte Construção de programas de clientes da API C usando pkg-config.

Nota

A partir do MySQL 5.7.4, para as distribuições binárias para Solaris, o **mysql\_config** não fornece argumentos para a vinculação com a biblioteca embutida. Para obter argumentos de vinculação para a biblioteca embutida, use o script **mysql\_server\_config** em vez disso.

**mysql\_config** suporta as seguintes opções.

- `--cflags`

  Ferramentas de compilação do C para encontrar arquivos de inclusão e flags de compilação críticas e definições usadas ao compilar a biblioteca `libmysqlclient`. As opções devolvidas estão ligadas ao compilador específico que foi usado quando a biblioteca foi criada e podem entrar em conflito com as configurações do seu próprio compilador. Use `--include` para opções mais portáteis que contêm apenas caminhos de inclusão.

- `--cxxflags`

  Como `--cflags`, mas para as opções do compilador C++.

- `--include`

  Opções do compilador para encontrar arquivos de MySQL incluem.

- `--libmysqld-libs`, `--embedded-libs`, `--embedded`

  Bibliotecas e opções necessárias para vincular com `libmysqld`, o servidor MySQL embutido.

  Nota

  A biblioteca de servidor embutida `libmysqld` está desatualizada a partir do MySQL 5.7.19 e foi removida no MySQL 8.0.

- `--libs`

  Bibliotecas e opções necessárias para vincular com a biblioteca do cliente MySQL.

- `--libs_r`

  Bibliotecas e opções necessárias para vincular com a biblioteca de cliente MySQL segura para threads. No MySQL 5.7, todas as bibliotecas de cliente são seguras para threads, portanto, essa opção não precisa ser usada. A opção `--libs` pode ser usada em todos os casos.

- `--plugindir`

  O nome do caminho padrão do diretório do plugin, definido ao configurar o MySQL.

- `--port`

  O número de porta TCP/IP padrão, definido ao configurar o MySQL.

- `--socket`

  O arquivo de socket Unix padrão, definido ao configurar o MySQL.

- `--variable=var_name`

  Exiba o valor da variável de configuração nomeada. Os valores permitidos para *`var_name`* são `pkgincludedir` (o diretório de arquivos de cabeçalho), `pkglibdir` (o diretório de bibliotecas) e `plugindir` (o diretório de plugins).

- `--version`

  Número da versão para a distribuição do MySQL.

Se você invocar **mysql\_config** sem opções, ele exibirá uma lista de todas as opções que ele suporta e seus valores:

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

Você pode usar **mysql\_config** em uma linha de comando usando aspas duplas para incluir a saída que ele produz para opções específicas. Por exemplo, para compilar e vincular um programa cliente MySQL, use **mysql\_config** da seguinte forma:

```sql
gcc -c `mysql_config --cflags` progname.c
gcc -o progname progname.o `mysql_config --libs`
```
