### 6.7.1 `mysql_config`  Opções de exibição para clientes de compilação

`mysql_config` fornece informações úteis para compilar seu cliente MySQL e conectá-lo ao MySQL. É um script de shell, por isso está disponível apenas em sistemas Unix e Unix-like.

::: info Note

**pkg-config** pode ser usado como uma alternativa ao **mysql\_config** para obter informações como bandeiras de compilador ou bibliotecas de links necessárias para compilar aplicativos MySQL. Para mais informações, consulte Building C API Client Programs Using pkg-config.

:::

**mysql\_config** suporta as seguintes opções.

- `--cflags`

As opções retornadas estão ligadas ao compilador específico que foi usado quando a biblioteca foi criada e podem entrar em conflito com as configurações do seu próprio compilador. Use `--include` para opções mais portáteis que contêm apenas caminhos de inclusão.

- `--cxxflags`

Como `--cflags`, mas para bandeiras de compilador C++.

- `--include`

As opções do compilador para encontrar o MySQL incluem arquivos.

- `--libs`

Bibliotecas e opções necessárias para ligar com a biblioteca cliente MySQL.

- `--libs_r`

As bibliotecas e opções necessárias para ligar com a biblioteca cliente MySQL thread-safe. No MySQL 8.4, todas as bibliotecas clientes são thread-safe, então esta opção não precisa ser usada. A opção `--libs` pode ser usada em todos os casos.

- `--plugindir`

Nome do caminho padrão do diretório do plugin, definido ao configurar o MySQL.

- `--port`

O número de porta TCP/IP por defeito, definido ao configurar o MySQL.

- `--socket`

O arquivo de soquete padrão do Unix, definido ao configurar o MySQL.

- `--variable=var_name`

Exibe o valor da variável de configuração nomeada. \* `var_name`\* valores permitidos são `pkgincludedir` (o diretório do arquivo de cabeçalho), `pkglibdir` (o diretório da biblioteca), e `plugindir` (o diretório do plugin).

- `--version`

Número de versão para a distribuição MySQL.

Se você invocar **mysql\_config** sem opções, ele exibe uma lista de todas as opções que ele suporta, e seus valores:

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

Você pode usar **mysql\_config** dentro de uma linha de comando usando backticks para incluir a saída que ele produz para opções específicas. Por exemplo, para compilar e vincular um programa cliente MySQL, use **mysql\_config** da seguinte forma:

```
gcc -c `mysql_config --cflags` progname.c
gcc -o progname progname.o `mysql_config --libs`
```
