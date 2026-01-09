### 2.8.7 Opções de Configuração de Fonte do MySQL

O programa **CMake** oferece um grande controle sobre como você configura uma distribuição de fonte do MySQL. Normalmente, você faz isso usando opções na linha de comando do **CMake**. Para obter informações sobre as opções suportadas pelo **CMake**, execute qualquer um desses comandos no diretório de fonte de nível superior:

```
$> cmake . -LH

$> ccmake .
```

Você também pode afetar o **CMake** usando certas variáveis de ambiente. Veja a Seção 6.9, “Variáveis de Ambiente”.

Para opções booleanas, o valor pode ser especificado como `1` ou `ON` para habilitar a opção, ou como `0` ou `OFF` para desabilitar a opção.

Muitas opções configuram padrões de tempo de compilação que podem ser sobrescritos na inicialização do servidor. Por exemplo, as opções `CMAKE_INSTALL_PREFIX`, `MYSQL_TCP_PORT` e `MYSQL_UNIX_ADDR` que configuram a localização do diretório de base de instalação padrão, o número de porta TCP/IP e o arquivo de socket Unix podem ser alteradas na inicialização do servidor com as opções `--basedir`, `--port` e `--socket` para o **mysqld**. Onde aplicável, as descrições das opções de configuração indicam a opção de inicialização correspondente do **mysqld**.

As seções a seguir fornecem mais informações sobre as opções do **CMake**.

* Referência de Opções do CMake
* Opções Gerais
* Opções de Layout de Instalação
* Opções de Motores de Armazenamento
* Opções de Recursos
* Fлагаs do Compilador
* Opções do CMake para Compilar o NDB Cluster

#### Referência de Opções do CMake

A tabela a seguir mostra as opções do **CMake** disponíveis. Na coluna `Default`, `PREFIX` representa o valor da opção `CMAKE_INSTALL_PREFIX`, que especifica o diretório de base de instalação. Esse valor é usado como a localização pai para várias das subdiretórios de instalação.

**Tabela 2.15 Referência de Opções de Configuração de Fonte do MySQL (CMake)**

="literal">PREFIX/bin</code></td> </tr><tr><th><a class="link" href="source-configuration-options.html#option_cmake_install_shareddir"><code>INSTALL_SHAREDIR</code></a></th> <td>Shared library directory</td> <td><code>PREFIX/lib</code></td> </tr><tr><th><a class="link" href="source-configuration-options.html#option_cmake_install_sysvardir"><code>INSTALL_SYSVARDIR</code></a></th> <td>InnoDB system variable directory</td> <td><code>PREFIX/include</code></td> </tr><tr><th><a class="link" href="source-configuration-options.html#option_cmake_install_usrdir"><code>INSTALL_USRDIR</code></a></th> <td>User data directory</td> <td><code>PREFIX</code></td> </tr><tr><th><a class="link" href="source-configuration-options.html#option_cmake_install_usrlocaldir"><code>INSTALL_USRLOCALDIR</code></a></th> <td>User local data directory</td> <td><code>PREFIX/usr</code></td> </tr><tr><th><a class="link" href="source-configuration-options.html#option_cmake_install_usrlocallibdir"><code>INSTALL_USRLOCALLIBDIR</code></a></th> <td>User local library directory</td> <td><code>PREFIX/usr/lib</code></td> </tr><tr><th><a class="link" href="source-configuration-options.html#option_cmake_install_usrlocallibdir_bindir"><code>INSTALL_USRLOCALLIBDIR_BINDIR</code></a></th> <td>User local library directory executable directory</td> <td><code>PREFIX/bin</code></td> </tr><tr><th><a class="link" href="source-configuration-options.html#option_cmake_install_usrlocallibdir_libdir"><code>INSTALL_USRLOCALLIBDIR_LIBDIR</code></a></th> <td>User local library directory library directory</td> <td><code>PREFIX/lib</code></td> </tr><tr><th><a class="link" href="source-configuration-options.html#option_cmake_install_usrlocallibdir_plugindir"><code>INSTALL_USRLOCALLIBDIR_PLUGINDIR</code></a></th> <td>User local library directory plugin directory</td> <td><code>PREFIX/lib/plugin</code></td> </tr><tr><th><a class="link" href="source-configuration-options.html#option_cmake_install_usrlocallibdir_sbindir"><code>INSTALL_USRLOCALLIBDIR_SBINDIR</code></a></th> <td>User local library directory server executable directory</td> <td><code>PREFIX/bin</code></td> </tr><tr><th><a class="link" href="source-configuration-options.html#option_cmake_install_usrlocallibdir_sysvardir"><code>INSTALL_USRLOCALLIBDIR_SYSVARDIR</code></a></th> <td>User local library directory system variable directory</td> <td><code>PREFIX/include</code></td> </tr><tr><th><a class="link" href="source-configuration-options.html#option_cmake_install_usrlocallibdir_usrdir"><code>INSTALL_USRLOCALLIBDIR_USDIR</code></a></th> <td>User local library directory user data directory</td> <td><code>PREFIX</code></td> </tr><tr><th><a class="link" href="source-configuration-options.html#option_cmake_install_usrlocallibdir_usrlocaldir"><code>INSTALL_USRLOCALLIBDIR_USRLOCALDIR</code></a></th> <td>User local library directory user local data directory</td> <td><code>PREFIX/usr</code></td> </tr><tr><th><a class="link" href="source-configuration-options.html#option_cmake_install_usrlocallibdir_usrlocallibdir"><code>INSTALL_USRLOCALLIBDIR_USRLOCALLIBDIR</code></a></th> <td>User local library directory user local library directory</td> <td><code>PREFIX/usr/lib

#### Opções Gerais

* `-DBUILD_CONFIG=mysql_release`

  Esta opção configura uma distribuição de código-fonte com as mesmas opções de compilação usadas pela Oracle para produzir distribuições binárias para as versões oficiais do MySQL.

* `-DWITH_BUILD_ID=bool`

  Em sistemas Linux, gera um ID de compilação único que é usado como o valor da variável de sistema `build_id` e escrito no log do servidor MySQL ao iniciar. Defina esta opção para `OFF` para desativar este recurso.

  Esta opção não tem efeito em plataformas diferentes de Linux.

* `-DBUNDLE_RUNTIME_LIBRARIES=bool`

  Se agrupar as bibliotecas de tempo de execução com os pacotes MSI e Zip do servidor para o Windows.

* `-DCMAKE_BUILD_TYPE=type`

  O tipo de compilação a ser produzido:

  + `RelWithDebInfo`: Habilitar otimizações e gerar informações de depuração. Este é o tipo de compilação MySQL padrão.

  + `Release`: Habilitar otimizações, mas omitir informações de depuração para reduzir o tamanho da compilação.

  + `Debug`: Desabilitar otimizações e gerar informações de depuração. Este tipo de compilação também é usado se a opção `WITH_DEBUG` for habilitada. Ou seja, `-DWITH_DEBUG=1` tem o mesmo efeito que `-DCMAKE_BUILD_TYPE=Debug`.

  Os valores das opções `None` e `MinSizeRel` não são suportados.

* `-DCPACK_MONOLITHIC_INSTALL=bool`

  Esta opção afeta se a operação de **make package** produz vários arquivos de pacote de instalação ou um único arquivo. Se desativada, a operação produz vários arquivos de pacote de instalação, o que pode ser útil se você quiser instalar apenas um subconjunto de uma instalação completa do MySQL. Se ativada, produz um único arquivo para instalar tudo.

* `-DFORCE_INSOURCE_BUILD=bool`

Define se deve forçar uma compilação local. As compilações fora da fonte são recomendadas, pois permitem múltiplas compilações a partir da mesma fonte e a limpeza pode ser realizada rapidamente removendo o diretório de compilação. Para forçar uma compilação local, invoque o **CMake** com `-DFORCE_INSOURCE_BUILD=ON`.

* `-DFORCE_COLORED_OUTPUT=bool`

  Define se deve habilitar a saída colorida do compilador para **gcc** e **clang** ao compilar na linha de comando. A configuração padrão é `OFF`.

#### Opções de Layout de Instalação

A opção `CMAKE_INSTALL_PREFIX` indica o diretório de instalação base. Outras opções com nomes na forma `INSTALL_xxx` que indicam os locais dos componentes são interpretadas em relação ao prefixo e seus valores são caminhos relativos. Seus valores não devem incluir o prefixo.

* `-DCMAKE_INSTALL_PREFIX=dir_name`

  O diretório de instalação base.

  Esse valor pode ser definido no início do servidor usando a opção `--basedir`.

* `-DINSTALL_BINDIR=dir_name`

  Onde instalar programas de usuário.

* `-DINSTALL_DOCDIR=dir_name`

  Onde instalar a documentação.

* `-DINSTALL_DOCREADMEDIR=dir_name`

  Onde instalar os arquivos `README`.

* `-DINSTALL_INCLUDEDIR=dir_name`

  Onde instalar os arquivos de cabeçalho.

* `-DINSTALL_INFODIR=dir_name`

  Onde instalar os arquivos Info.

* `-DINSTALL_LAYOUT=name`

  Selecione um layout de instalação pré-definido:

  + `STANDALONE`: O mesmo layout usado para pacotes `.tar.gz` e `.zip`. Esse é o padrão.

  + `RPM`: Layout semelhante aos pacotes RPM.
  + `SVR4`: Layout de pacote Solaris.
  + `DEB`: Layout de pacote DEB (experimental).

  Você pode selecionar um layout pré-definido, mas modificar os locais de instalação individuais dos componentes especificando outras opções. Por exemplo:

  ```
  cmake . -DINSTALL_LAYOUT=SVR4 -DMYSQL_DATADIR=/var/mysql/data
  ```

O valor `INSTALL_LAYOUT` determina o valor padrão da variável de sistema `secure_file_priv`. Veja a descrição dessa variável na Seção 7.1.8, “Variáveis do Sistema do Servidor”.

* `-DINSTALL_LIBDIR=dir_name`

  Onde instalar os arquivos de biblioteca.

* `-DINSTALL_MANDIR=dir_name`

  Onde instalar as páginas do manual.

* `-DINSTALL_MYSQLSHAREDIR=dir_name`

  Onde instalar os arquivos de dados compartilhados.

* `-DINSTALL_MYSQLTESTDIR=dir_name`

  Onde instalar o diretório `mysql-test`. Para suprimir a instalação desse diretório, defina explicitamente a opção para o valor vazio (`-DINSTALL_MYSQLTESTDIR=`).

* `-DINSTALL_PKGCONFIGDIR=dir_name`

  O diretório onde instalar o arquivo `mysqlclient.pc` para uso pelo **pkg-config**. O valor padrão é `INSTALL_LIBDIR/pkgconfig`, a menos que `INSTALL_LIBDIR` termine com `/mysql`, caso em que isso é removido primeiro.

* `-DINSTALL_PLUGINDIR=dir_name`

  A localização do diretório do plugin.

  Esse valor pode ser definido na inicialização do servidor com a opção `--plugin_dir`.

* `-DINSTALL_PRIV_LIBDIR=dir_name`

  A localização do diretório da biblioteca dinâmica.

  **Local padrão.** Para construções RPM, é `/usr/lib64/mysql/private/`, para DEB é `/usr/lib/mysql/private/`, e para TAR é `lib/private/`.

**Protobuf.** Como este é um local privado, o carregador (como `ld-linux.so` no Linux) pode não encontrar os arquivos `libprotobuf.so` sem ajuda. Para orientar o carregador, `RPATH=$ORIGIN/../$INSTALL_PRIV_LIBDIR` é adicionado a **mysqld** e **mysqlxtest**. Isso funciona na maioria dos casos, mas ao usar o recurso Grupo de Recursos, **mysqld** é configurado com `setuid`, e o carregador ignora qualquer `RPATH` que contenha `$ORIGIN`. Para superar isso, um caminho completo explícito para o diretório é definido nas versões DEB e RPM de **mysqld**, uma vez que o destino conhecido é conhecido. Para instalações em arquivos tar, é necessário fazer o patch de **mysqld** com uma ferramenta como **patchelf**.

* `-DINSTALL_SBINDIR=dir_name`

  Onde instalar o servidor **mysqld**.

* `-DINSTALL_SECURE_FILE_PRIVDIR=dir_name`

  O valor padrão para a variável de sistema `secure_file_priv`. O valor padrão é específico da plataforma e depende do valor da opção `INSTALL_LAYOUT` do **CMake**, veja a descrição da variável de sistema `secure_file_priv` na Seção 7.1.8, “Variáveis de Sistema do Servidor”.

* `-DINSTALL_SHAREDIR=dir_name`

  Onde instalar `aclocal/mysql.m4`.

* `-DINSTALL_STATIC_LIBRARIES=bool`

  Se instalar bibliotecas estáticas. O valor padrão é `ON`. Se definido como `OFF`, esses arquivos de biblioteca não são instalados: `libmysqlclient.a`, `libmysqlservices.a`.

* `-DINSTALL_SUPPORTFILESDIR=dir_name`

  Onde instalar arquivos de suporte extras.

* `-DLINK_RANDOMIZE=bool`

  Se randomizar a ordem dos símbolos no binário **mysqld**. O valor padrão é `OFF`. Esta opção deve ser habilitada apenas para fins de depuração.

* `-DLINK_RANDOMIZE_SEED=val`

  Valor de seed para a opção `LINK_RANDOMIZE`. O valor é uma string. O valor padrão é `mysql`, uma escolha arbitrária.

* `-DMYSQL_DATADIR=dir_name`

  Local do diretório de dados do MySQL.

Esse valor pode ser definido na inicialização do servidor com a opção `--datadir`.

* `-DODBC_INCLUDES=nome_diretorio`

  O local do diretório de inclusões ODBC, que pode ser usado durante a configuração do Connector/ODBC.

* `-DODBC_LIB_DIR=nome_diretório`

  O local do diretório de bibliotecas ODBC, que pode ser usado durante a configuração do Connector/ODBC.

* `-DSYSCONFDIR=nome_diretório`

  O diretório padrão do arquivo de opção `my.cnf`.

  Esse local não pode ser definido na inicialização do servidor, mas você pode iniciar o servidor com um arquivo de opção específico usando a opção `--defaults-file=nome_arquivo`, onde *`nome_arquivo`* é o nome completo do arquivo.

* `-DSYSTEMD_PID_DIR=nome_diretório`

  O nome do diretório em que o arquivo PID será criado quando o MySQL for gerenciado pelo systemd. O padrão é `/var/run/mysqld`; isso pode ser alterado implicitamente de acordo com o valor de `INSTALL_LAYOUT`.

  Essa opção é ignorada a menos que `WITH_SYSTEMD` esteja habilitado.

* `-DSYSTEMD_SERVICE_NAME=nome`

  O nome do serviço MySQL a ser usado quando o MySQL for gerenciado pelo **systemd**. O padrão é `mysqld`; isso pode ser alterado implicitamente de acordo com o valor de `INSTALL_LAYOUT`.

  Essa opção é ignorada a menos que `WITH_SYSTEMD` esteja habilitado.

* `-DTMPDIR=nome_diretório`

  O local padrão a ser usado para a variável de sistema `tmpdir`. Se não for especificado, o valor será o padrão `P_tmpdir` em `<stdio.h>`.

#### Opções de Motores de Armazenamento

Os motores de armazenamento são construídos como plugins. Você pode construir um plugin como um módulo estático (compilado no servidor) ou um módulo dinâmico (construído como uma biblioteca dinâmica que deve ser instalada no servidor usando a instrução `INSTALL PLUGIN` ou a opção `--plugin-load` antes que possa ser usado). Alguns plugins podem não suportar a construção estática ou dinâmica.

Os motores `InnoDB`, `MyISAM`, `MERGE`, `MEMORY` e `CSV` são obrigatórios (sempre compilados no servidor) e não precisam ser instalados explicitamente.

Para compilar um motor de armazenamento staticamente no servidor, use `-DWITH_engine_STORAGE_ENGINE=1`. Alguns valores de *`engine`* permitidos são `ARCHIVE`, `BLACKHOLE`, `EXAMPLE` e `FEDERATED`. Exemplos:

```
-DWITH_ARCHIVE_STORAGE_ENGINE=1
-DWITH_BLACKHOLE_STORAGE_ENGINE=1
```

Para construir o MySQL com suporte para o NDB Cluster, use a opção `WITH_NDB`.

Nota

Não é possível compilar sem suporte ao Schema de Desempenho. Se for desejado compilar sem tipos específicos de instrumentação, isso pode ser feito com as seguintes opções de **CMake**:

```
DISABLE_PSI_COND
DISABLE_PSI_DATA_LOCK
DISABLE_PSI_ERROR
DISABLE_PSI_FILE
DISABLE_PSI_IDLE
DISABLE_PSI_MEMORY
DISABLE_PSI_METADATA
DISABLE_PSI_MUTEX
DISABLE_PSI_PS
DISABLE_PSI_RWLOCK
DISABLE_PSI_SOCKET
DISABLE_PSI_SP
DISABLE_PSI_STAGE
DISABLE_PSI_STATEMENT
DISABLE_PSI_STATEMENT_DIGEST
DISABLE_PSI_TABLE
DISABLE_PSI_THREAD
DISABLE_PSI_TRANSACTION
```

Por exemplo, para compilar sem instrumentação de mutex, configure o MySQL usando `-DDISABLE_PSI_MUTEX=1`.

Para excluir um motor de armazenamento da compilação, use `-DWITH_engine_STORAGE_ENGINE=0`. Exemplos:

```
-DWITH_ARCHIVE_STORAGE_ENGINE=0
-DWITH_EXAMPLE_STORAGE_ENGINE=0
-DWITH_FEDERATED_STORAGE_ENGINE=0
```

Também é possível excluir um motor de armazenamento da compilação usando `-DWITHOUT_engine_STORAGE_ENGINE=1` (mas `-DWITH_engine_STORAGE_ENGINE=0` é preferido). Exemplos:

```
-DWITHOUT_ARCHIVE_STORAGE_ENGINE=1
-DWITHOUT_EXAMPLE_STORAGE_ENGINE=1
-DWITHOUT_FEDERATED_STORAGE_ENGINE=1
```

Se nenhuma das opções `-DWITH_engine_STORAGE_ENGINE` ou `-DWITHOUT_engine_STORAGE_ENGINE` for especificada para um motor de armazenamento dado, o motor é compilado como um módulo compartilhado, ou excluído se não puder ser compilado como um módulo compartilhado.

#### Opções de Recursos

* `-DADD_GDB_INDEX=bool`

  Esta opção determina se a geração de uma seção `.gdb_index` nos binários deve ser habilitada, o que torna o carregamento deles em um depurador mais rápido. A opção está desabilitada por padrão. O **lld** é usado como linker e é desabilitado se outro linker que não **lld** ou **gnu-gold** for usado.

* `-DCOMPILATION_COMMENT=string`

  Um comentário descritivo sobre o ambiente de compilação. Enquanto o **mysqld** usa `COMPILATION_COMMENT_SERVER`, outros programas usam `COMPILATION_COMMENT`.

* `-DCOMPRESS_DEBUG_SECTIONS=bool`

  Se comprometer a comprimir as seções de depuração dos executáveis binários (apenas no Linux). A compressão das seções de depuração dos executáveis economiza espaço, mas aumenta o tempo de processamento da compilação.

  O padrão é `OFF`. Se esta opção não for definida explicitamente, mas a variável de ambiente `COMPRESS_DEBUG_SECTIONS` for definida, a opção assume seu valor dessa variável.

* `-DCOMPILATION_COMMENT_SERVER=string`

  Um comentário descritivo sobre o ambiente de compilação para uso pelo **mysqld** (por exemplo, para definir a variável de sistema `version_comment`). Programas que não são o servidor usam `COMPILATION_COMMENT`.

* `-DDEFAULT_CHARSET=charset_name`

  O conjunto de caracteres do servidor. Por padrão, o MySQL usa o conjunto de caracteres `utf8mb4`.

  `charset_name` pode ser um dos valores `binary`, `armscii8`, `ascii`, `big5`, `cp1250`, `cp1251`, `cp1256`, `cp1257`, `cp850`, `cp852`, `cp866`, `cp932`, `dec8`, `eucjpms`, `euckr`, `gb2312`, `gbk`, `geostd8`, `greek`, `hebrew`, `hp8`, `keybcs2`, `koi8r`, `koi8u`, `latin1`, `latin2`, `latin5`, `latin7`, `macce`, `macroman`, `sjis`, `swe7`, `tis620`, `ucs2`, `ujis`, `utf8mb3`, `utf8mb4`, `utf16`, `utf16le`, `utf32`.

  Esse valor pode ser definido na inicialização do servidor com a opção `--character-set-server`.

* `-DDEFAULT_COLLATION=collation_name`

  O conjunto de caracteres do servidor. Por padrão, o MySQL usa `utf8mb4_0900_ai_ci`. Use a instrução `SHOW COLLATION` para determinar quais conjuntos de caracteres estão disponíveis para cada conjunto de caracteres.

  Esse valor pode ser definido na inicialização do servidor com a opção `--collation_server`.

* `-DDISABLE_PERFSCHEMA=bool`

  Ative todas as opções de compilação `DISABLE_PSI_*`. Isso é o mesmo que definir todas essas opções para `ON`.

  O padrão para `DISABLE_PERFSCHEMA` é `OFF`.

* `-DDISABLE_PSI_COND=bool`

Se deve excluir a instrumentação do esquema de desempenho. O padrão é `OFF` (incluir).

* `-DDISABLE_PSI_FILE=bool`

  Se deve excluir a instrumentação do arquivo do esquema de desempenho. O padrão é `OFF` (incluir).

* `-DDISABLE_PSI_IDLE=bool`

  Se deve excluir a instrumentação do esquema de desempenho em estado de inatividade. O padrão é `OFF` (incluir).

* `-DDISABLE_PSI_MEMORY=bool`

  Se deve excluir a instrumentação do esquema de desempenho de memória. O padrão é `OFF` (incluir).

* `-DDISABLE_PSI_METADATA=bool`

  Se deve excluir a instrumentação do esquema de desempenho de metadados. O padrão é `OFF` (incluir).

* `-DDISABLE_PSI_MUTEX=bool`

  Se deve excluir a instrumentação do esquema de desempenho de mutex. O padrão é `OFF` (incluir).

* `-DDISABLE_PSI_RWLOCK=bool`

  Se deve excluir a instrumentação do esquema de desempenho de rwlock. O padrão é `OFF` (incluir).

* `-DDISABLE_PSI_SOCKET=bool`

  Se deve excluir a instrumentação do esquema de desempenho de socket. O padrão é `OFF` (incluir).

* `-DDISABLE_PSI_SP=bool`

  Se deve excluir a instrumentação do esquema de desempenho de programa armazenado. O padrão é `OFF` (incluir).

* `-DDISABLE_PSI_STAGE=bool`

  Se deve excluir a instrumentação do esquema de desempenho de estágio. O padrão é `OFF` (incluir).

* `-DDISABLE_PSI_STATEMENT=bool`

  Se deve excluir a instrumentação do esquema de desempenho de declaração. O padrão é `OFF` (incluir).

* `-DDISABLE_PSI_STATEMENT_DIGEST=bool`

  Se deve excluir a instrumentação do esquema de desempenho de digest de declaração. O padrão é `OFF` (incluir).

* `-DDISABLE_PSI_TABLE=bool`

  Se deve excluir a instrumentação do esquema de desempenho de tabela. O padrão é `OFF` (incluir).

* `-DDISABLE_PSI_PS=bool`

Exclua as instâncias de instrumentação de declarações do Schema de Desempenho. O padrão é `OFF` (incluir).

* `-DDISABLE_PSI_THREAD=bool`

  Exclua a instrumentação de threads do Schema de Desempenho. O padrão é `OFF` (incluir).

  Desative apenas os threads ao compilar sem qualquer instrumentação, pois outras instrumentações dependem dos threads.

* `-DDISABLE_PSI_TRANSACTION=bool`

  Exclua a instrumentação de transações do Schema de Desempenho. O padrão é `OFF` (incluir).

* `-DDISABLE_PSI_DATA_LOCK=bool`

  Exclua a instrumentação de bloqueio de dados do Schema de Desempenho. O padrão é `OFF` (incluir).

* `-DDISABLE_PSI_ERROR=bool`

  Exclua a instrumentação de erros do servidor do Schema de Desempenho. O padrão é `OFF` (incluir).

* `-DENABLE_EXPERIMENTAL_SYSVARS=bool`

  Se habilitar as variáveis de sistema experimentais `InnoDB`. As variáveis de sistema experimentais são destinadas a desenvolvedores do MySQL, devem ser usadas apenas em ambientes de desenvolvimento ou teste e podem ser removidas sem aviso prévio em uma futura versão do MySQL. Para obter informações sobre as variáveis de sistema experimentais, consulte `/storage/innobase/handler/ha_innodb.cc` no repositório de código-fonte do MySQL. As variáveis de sistema experimentais podem ser identificadas pesquisando por “PLUGIN\_VAR\_EXPERIMENTAL”.

* `-DENABLE_GCOV=bool`

  Se habilitar o suporte **gcov** (apenas Linux).

* `-DENABLE_GPROF=bool`

  Se habilitar o **gprof** (apenas compilações otimizadas para Linux).

* `-DENABLED_LOCAL_INFILE=bool`

  Esta opção controla a capacidade `LOCAL` integrada ao MySQL client library. Os clientes que não fazem arranjos explícitos, portanto, têm a capacidade `LOCAL` desabilitada ou habilitada de acordo com o ajuste `ENABLED_LOCAL_INFILE` especificado no momento da compilação do MySQL.

Por padrão, a biblioteca de clientes nas distribuições binárias do MySQL é compilada com `ENABLED_LOCAL_INFILE` desativado. Se você compilar o MySQL a partir do código-fonte, configure-o com `ENABLED_LOCAL_INFILE` desativado ou ativado, dependendo se os clientes que não fazem arranjos explícitos devem ter a capacidade `LOCAL` desativada ou ativada, respectivamente.

`ENABLED_LOCAL_INFILE` controla o padrão para a capacidade `LOCAL` do lado do cliente. Para o servidor, a variável de sistema `local_infile` controla a capacidade `LOCAL` do lado do servidor. Para forçar explicitamente o servidor a recusar ou permitir as instruções `LOAD DATA LOCAL` (independentemente de como os programas e bibliotecas do cliente são configurados no momento da compilação ou execução), inicie o **mysqld** com `--local-infile` desativado ou ativado, respectivamente. `local_infile` também pode ser definido em tempo de execução. Veja a Seção 8.1.6, “Considerações de Segurança para LOAD DATA LOCAL”.

* `-DENABLED_PROFILING=bool`

  Se habilitar o código de perfilagem de consultas (para as instruções `SHOW PROFILE` e `SHOW PROFILES`).

* `-DFORCE_UNSUPPORTED_COMPILER=bool`

  Por padrão, o **CMake** verifica as versões mínimas dos compiladores suportados; para desabilitar essa verificação, use `-DFORCE_UNSUPPORTED_COMPILER=ON`.

* `-DFPROFILE_GENERATE=bool`

  Se gerar dados de otimização guiada por perfil (PGO). Esta opção está disponível para experimentar com PGO com o GCC. Veja `cmake/fprofile.cmake` na distribuição de código-fonte do MySQL para informações sobre o uso de `FPROFILE_GENERATE` e `FPROFILE_USE`. Essas opções foram testadas com o GCC 8 e 9.

* `-DFPROFILE_USE=bool`

Se usar dados de otimização guiada por perfil (PGO). Esta opção está disponível para experimentar o PGO com o GCC. Consulte o arquivo `cmake/fprofile.cmake` em uma distribuição de código-fonte do MySQL para obter informações sobre o uso de `FPROFILE_GENERATE` e `FPROFILE_USE`. Essas opções foram testadas com o GCC 8 e 9.

Ativação de `FPROFILE_USE` também ativa `WITH_LTO`.

* `-DHAVE_PSI_MEMORY_INTERFACE=bool`

  Se a opção `-DBUILD_CONFIG=mysql_release` for fornecida no Linux, a biblioteca `libaio` deve ser vinculada por padrão. Se você não tiver `libaio` ou não quiser instalá-lo, pode suprimir a verificação para ele especificando `-DIGNORE_AIO_CHECK=1`.

* `-DMAX_INDEXES=num`

  O número máximo de índices por tabela. O padrão é 64. O máximo é 255. Valores menores que 64 são ignorados e o padrão de 64 é usado.

* `-DMYSQL_MAINTAINER_MODE=bool`

  Se a opção `-DBUILD_CONFIG=mysql_release` for fornecida no Linux, a biblioteca `libaio` deve ser vinculada por padrão. Se você não tiver `libaio` ou não quiser instalá-lo, pode suprimir a verificação para ele especificando `-DIGNORE_AIO_CHECK=1`.

* `-DWITH_DEVELOPER_ENTITLEMENTS=bool`

  Se a opção `-DBUILD_CONFIG=mysql_release` for fornecida no Linux, a biblioteca `libaio` deve ser vinculada por padrão. Se você não tiver `libaio` ou não quiser instalá-lo, pode suprimir a verificação para ele especificando `-DIGNORE_AIO_CHECK=1`.

  No macOS 11+, os registros de núcleo são limitados a processos com o direito `com.apple.security.get-task-allow`, que esta opção do CMake habilita. O direito permite que outros processos se acomodem e leiam/modifiquem a memória dos processos e permite que o `--core-file` funcione como esperado.

* `-DMUTEX_TYPE=type`

  O tipo de mutex usado pelo `InnoDB`. As opções incluem:

+ `event`: Use mútues de evento. Este é o valor padrão e a implementação original do mútuo `InnoDB`.

  + `sys`: Use mútuos POSIX em sistemas UNIX. Use objetos `CRITICAL_SECTION` em sistemas Windows, se disponíveis.

  + `futex`: Use futexes Linux em vez de variáveis de condição para agendar threads em espera.

* `-DMYSQLX_TCP_PORT=port_num`

  O número de porta no qual o Plugin X escuta por conexões TCP/IP. O padrão é 33060.

  Este valor pode ser definido na inicialização do servidor com a variável de sistema `mysqlx_port`.

* `-DMYSQLX_UNIX_ADDR=file_name`

  O caminho do arquivo de socket Unix no qual o servidor escuta por conexões de socket do Plugin X. Este deve ser um nome de caminho absoluto. O padrão é `/tmp/mysqlx.sock`.

  Este valor pode ser definido na inicialização do servidor com a variável de sistema `mysqlx_port`.

* `-DMYSQL_PROJECT_NAME=name`

  Para sistemas Windows ou macOS, o nome do projeto a ser incorporado no nome do arquivo do projeto.

* `-DMYSQL_TCP_PORT=port_num`

  O número de porta no qual o servidor escuta por conexões TCP/IP. O padrão é 3306.

  Este valor pode ser definido na inicialização do servidor com a opção `--port`.

* `-DMYSQL_UNIX_ADDR=file_name`

  O caminho do arquivo de socket Unix no qual o servidor escuta por conexões de socket. Este deve ser um nome de caminho absoluto. O padrão é `/tmp/mysql.sock`.

  Este valor pode ser definido na inicialização do servidor com a opção `--socket`.

* `-DOPTIMIZER_TRACE=bool`

  Se suportar o rastreamento do otimizador. Veja a Seção 10.15, “Rastrear o Otimizador”.

* `-DREPRODUCIBLE_BUILD=bool`

  Para builds em sistemas Linux, esta opção controla se deve ter cuidado extra para criar um resultado de build independente da localização e do tempo da build.

  Esta opção tem o valor padrão `ON` para builds `RelWithDebInfo`.

* `-DSHOW_SUPPRESSED_COMPILER_WARNINGS=bool`

Mostre avisos de compilador suprimidos e faça isso sem falhar com `-Werror`. A configuração padrão é `OFF`.

* `-DWIN_DEBUG_NO_INLINE=bool`

  Se desabilitar a inlining de funções no Windows. A configuração padrão é `OFF` (inlining habilitado).

* `-DWITH_LD=string`

  O **CMake** usa o linkeador padrão por padrão. Opcionalmente, passe `lld` ou `mold` para especificar um linkeador alternativo. **mold** deve ser versão 2 ou superior.

  Esta opção pode ser usada em sistemas baseados em Linux, exceto o Enterprise Linux, que sempre usa o linkeador **ld**.

  Nota

  Anteriormente, a opção `USE_LD_LLD` poderia ser usada para habilitar (a configuração padrão) ou desabilitar explicitamente o linkeador **lld** do LLVM para o Clang. No MySQL 8.3, `USE_LD_LLD` foi removida.

* `-DWITH_ANT=caminho_nome`

  Defina o caminho para o Ant, necessário ao construir o wrapper GCS Java. Defina `WITH_ANT` para o caminho de um diretório onde o pacote tarball ou o arquivo descompactado do Ant é salvo. Quando `WITH_ANT` não é definido ou é definido com o valor especial `system`, o processo de construção assume que um binário `ant` existe no `$PATH`.

* `-DWITH_ASAN=bool`

  Se habilitar o AddressSanitizer, para compiladores que o suportam. A configuração padrão é `OFF`.

* `-DWITH_ASAN_SCOPE=bool`

  Se habilitar a bandeira Clang `-fsanitize-address-use-after-scope` do AddressSanitizer para detecção de uso após escopo. A configuração padrão é desativada. Para usar esta opção, `-DWITH_ASAN` também deve ser habilitado.

* `-DWITH_AUTHENTICATION_CLIENT_PLUGINS=bool`

  Esta opção é habilitada automaticamente se quaisquer plugins de autenticação de servidor correspondentes forem compilados. Seu valor depende, portanto, de outras opções do **CMake** e não deve ser definido explicitamente.

* `-DWITH_AUTHENTICATION_LDAP=bool`

  Se reportar um erro se os plugins de autenticação LDAP não puderem ser compilados:

+ Se esta opção estiver desativada (padrão), os plugins de autenticação LDAP serão construídos se os arquivos de cabeçalho e as bibliotecas necessárias forem encontrados. Se não forem, o **CMake** exibe uma nota sobre isso.

+ Se esta opção estiver habilitada, a falta de encontrar o arquivo de cabeçalho e as bibliotecas necessárias faz com que o **CMake** produza um erro, impedindo a construção do servidor.

* `-DWITH_AUTHENTICATION_PAM=bool`

  Se construir o plugin de autenticação PAM, para árvores de código-fonte que incluem este plugin. (Consulte a Seção 8.4.1.4, “Autenticação Personalizável PAM”.) Se esta opção for especificada e o plugin não puder ser compilado, a construção falha.

* `-DWITH_AWS_SDK=caminho_nome`

  A localização do kit de desenvolvimento de software da Amazon Web Services.

* `-DWITH_CLIENT_PROTOCOL_TRACING=bool`

  Se construir a estrutura de rastreamento de protocolo do lado do cliente na biblioteca do cliente. Por padrão, esta opção está habilitada.

  Para obter informações sobre como escrever plugins de rastreamento de protocolo do cliente, consulte Escrevendo Plugins de Rastreamento de Protocolo.

  Veja também a opção `WITH_TEST_TRACE_PLUGIN`.

* `-DWITH_CURL=curl_type`

  A localização da biblioteca `curl`. *`curl_type`* pode ser `system` (use a biblioteca `curl` do sistema), um nome de caminho para a biblioteca `curl`, `no`|`off`|`none` para desabilitar o suporte ao curl, ou `bundled` para usar a distribuição de curl empacotada em `extra/curl/`.

* `-DWITH_DEBUG=bool`

  Se incluir suporte de depuração.

  Configurar o MySQL com suporte de depuração permite que você use a opção `--debug="d,parser_debug"` ao iniciar o servidor. Isso faz com que o analisador Bison usado para processar instruções SQL exiba um rastreamento do analisador na saída de erro padrão do servidor. Normalmente, essa saída é escrita no log de erro.

A verificação de depuração para o mecanismo de armazenamento `InnoDB` é definida em `UNIV_DEBUG` e está disponível quando o suporte de depuração é compilado com a opção `WITH_DEBUG`. Quando o suporte de depuração é compilado, a opção de configuração `innodb_sync_debug` pode ser usada para habilitar ou desabilitar a verificação de depuração de sincronização do `InnoDB`.

Habilitar `WITH_DEBUG` também habilita o Debug Sync. Essa facilidade é usada para testes e depuração. Quando compilado, o Debug Sync é desativado por padrão no runtime. Para ativá-lo, inicie o **mysqld** com a opção `--debug-sync-timeout=N`, onde *`N`* é um valor de timeout maior que 0. (O valor padrão é 0, que desativa o Debug Sync.) *`N`* se torna o timeout padrão para pontos de sincronização individuais.

A verificação de depuração de sincronização para o mecanismo de armazenamento `InnoDB` está disponível quando o suporte de depuração é compilado com a opção `WITH_DEBUG`.

Para uma descrição da facilidade Debug Sync e de como usar pontos de sincronização, consulte MySQL Internals: Test Synchronization.

* `-DWITH_LOG_DIAGNOSTIC`

  Habilitar opções de registro de diagnóstico do servidor (`--log-diagnostic-enable` e `--log-diagnostic`). Apenas para uso interno.

* `-DWITH_EDITLINE=value`

  Qual biblioteca `libedit`/`editline` usar. Os valores permitidos são `bundled` (padrão) e `system`.

* `-DWITH_ICU={icu_type|path_name}`

  O MySQL usa Componentes Internacionais para Unicode (ICU) para suportar operações de expressão regular. A opção `WITH_ICU` indica o tipo de suporte ICU a incluir ou o nome do caminho da instalação do ICU a usar.

  + *`icu_type`* pode ser um dos seguintes valores:

    - `bundled`: Use a biblioteca ICU empacotada com a distribuição. Este é o padrão e é a única opção suportada para Windows.

    - `system`: Use a biblioteca ICU do sistema.

+ *`path_name`* é o nome do caminho para a instalação do ICU a ser utilizada. Isso pode ser preferível ao usar o valor *`icu_type`* de `system` porque pode evitar que o CMake detecte e use uma versão mais antiga ou incorreta do ICU instalada no sistema. (Outra maneira permitida de fazer a mesma coisa é definir `WITH_ICU` para `system` e definir a opção `CMAKE_PREFIX_PATH` para *`path_name`*.)

* `-DWITH_INNODB_EXTRA_DEBUG=bool`

  Se incluir suporte de depuração extra do InnoDB.

  Ativação de `WITH_INNODB_EXTRA_DEBUG` aciona verificações de depuração extra do InnoDB. Esta opção só pode ser habilitada quando `WITH_DEBUG` está habilitada.

* `-DWITH_JEMALLOC=bool`

  Se vincular com `-ljemalloc`. Se habilitada, as rotinas integradas `malloc()`, `calloc()`, `realloc()` e `free()` são desabilitadas. O padrão é `OFF`.

  `WITH_JEMALLOC` e `WITH_TCMALLOC` são mutuamente exclusivos.

* `-DWITH_LIBEVENT=string`

  Qual biblioteca `libevent` usar. Os valores permitidos são `bundled` (padrão) e `system`. Se `system` for especificado e nenhuma biblioteca `libevent` do sistema puder ser encontrada, um erro ocorrerá independentemente, e a biblioteca `libevent` embutida não será usada.

  A biblioteca `libevent` é necessária pelo X Plugin e pelo MySQL Router.

* `-DWITH_LIBWRAP=bool`

  Se incluir suporte de `libwrap` (envoltórios TCP).

* `-DWITH_LOCK_ORDER=bool`

  Se habilitar a ferramenta LOCK\_ORDER. Por padrão, esta opção está desabilitada e as compilações do servidor não contêm ferramentas. Se a ferramenta for habilitada, a ferramenta LOCK\_ORDER estará disponível e pode ser usada conforme descrito na Seção 7.9.3, “A Ferramenta LOCK\_ORDER”.

  Nota

  Com a opção `WITH_LOCK_ORDER` habilitada, as compilações do MySQL requerem o programa **flex**.

* `-DWITH_LSAN=bool`

  Se executar o LeakSanitizer, sem o AddressSanitizer. O padrão é `OFF`.

* `-DWITH_LTO=bool`

Se habilitar o otimizador de link-time, se o compilador o suportar. O padrão é `OFF` a menos que `FPROFILE_USE` esteja habilitado.

* `-DWITH_LZ4=lz4_type`

  A opção `WITH_LZ4` indica a fonte do suporte ao `zlib`:

  + `bundled`: Use a biblioteca `lz4` incluída na distribuição. Esse é o padrão.

  + `system`: Use a biblioteca `lz4` do sistema.

* `-DWITH_MECAB={disabled|system|path_name}`

  Use essa opção para compilar o analisador MeCab. Se você instalou o MeCab no diretório de instalação padrão, defina `-DWITH_MECAB=system`. A opção `system` se aplica a instalações do MeCab realizadas a partir de fontes ou de binários usando uma ferramenta de gerenciamento de pacotes nativa. Se você instalou o MeCab em um diretório de instalação personalizado, especifique o caminho para a instalação do MeCab, por exemplo, `-DWITH_MECAB=/opt/mecab`. Se a opção `system` não funcionar, especificar o caminho de instalação do MeCab deve funcionar em todos os casos.

  Para informações relacionadas, consulte a Seção 14.9.9, “Plugin de Analisador de Texto Completo MeCab”.

* `-DWITH_MSAN=bool`

  Se habilitar o MemorySanitizer, para compiladores que o suportam. O padrão é `OFF`.

  Para que essa opção tenha efeito se habilitada, todas as bibliotecas vinculadas ao MySQL também devem ter sido compiladas com a opção habilitada.

* `-DWITH_MSCRT_DEBUG=bool`

  Se habilitar a rastreamento de vazamentos de memória do CRT do Visual Studio. O padrão é `OFF`.

* `-DMSVC_CPPCHECK=bool`

  Se habilitar a análise de código do MSVC. O padrão é `ON`.

* `-DWITH_MYSQLX=bool`

  Se compilar com suporte para o Plugin X. O padrão é `ON`. Veja o Capítulo 22, *Usando o MySQL como uma Armazenamento de Documentos*.

* `-DWITH_NUMA=bool`

Defina explicitamente a política de alocação de memória NUMA. **CMake** define o valor padrão `WITH_NUMA` com base se a plataforma atual tem suporte para `NUMA`. Para plataformas sem suporte para `NUMA`, **CMake** se comporta da seguinte forma:

  + Sem opção NUMA (o caso normal), **CMake** continua normalmente, produzindo apenas este aviso: Biblioteca NUMA ausente ou versão exigida não disponível.

  + Com `-DWITH_NUMA=ON`, **CMake** interrompe com este erro: Biblioteca NUMA ausente ou versão exigida não disponível.

* `-DWITH_PACKAGE_FLAGS=bool`

  Para flags tipicamente usadas para pacotes RPM e Debian, se adicionar-los às compilações independentes nessas plataformas. O padrão é `ON` para compilações não de depuração.

* `-DWITH_PROTOBUF=protobuf_type`

  Qual pacote de Protocol Buffers usar. *`protobuf_type`* pode ser um dos seguintes valores:

  + `bundled`: Use o pacote empacotado com a distribuição. Este é o padrão. Opcionalmente, use `INSTALL_PRIV_LIBDIR` para modificar o diretório dinâmico da biblioteca Protobuf.

  + `system`: Use o pacote instalado no sistema.

  Outros valores são ignorados, com um fallback para `bundled`.

* `-DWITH_RAPID=bool`

  Se construir os plugins do ciclo de desenvolvimento rápido. Quando habilitado, um diretório `rapid` é criado na árvore de compilação contendo esses plugins. Quando desabilitado, nenhum diretório `rapid` é criado na árvore de compilação. O padrão é `ON`, a menos que o diretório `rapid` seja removido da árvore de origem, no qual caso o padrão se torna `OFF`.

* `-DWITH_RAPIDJSON=rapidjson_type`

  O tipo de suporte da biblioteca RapidJSON a ser incluído. *`rapidjson_type`* pode ser um dos seguintes valores:

  + `bundled`: Use a biblioteca RapidJSON empacotada com a distribuição. Este é o padrão.

  + `system`: Use a biblioteca RapidJSON do sistema. A versão 1.1.0 ou posterior é necessária.

* `-DWITH_ROUTER=bool`

  Se a construção do Router MySQL deve ser habilitada. O padrão é `ON`.

* `-DWITH_SASL=value`

  Uso interno apenas. Não é suportado no Windows.

* `-DWITH_SSL={ssl_type`|*`caminho_nome`*}`

  Para suporte de conexões criptografadas, entropia para geração de números aleatórios e outras operações relacionadas à criptografia, o MySQL deve ser construído usando uma biblioteca SSL. Esta opção especifica qual biblioteca SSL deve ser usada.

  + *`ssl_type`* pode ser um dos seguintes valores:

    - `system`: Use a biblioteca OpenSSL do sistema. Este é o padrão.

      No macOS e no Windows, usar `system` configura o MySQL para ser construído como se o CMake tivesse sido invocado com *`caminho_nome`* apontando para uma biblioteca OpenSSL instalada manualmente. Isso ocorre porque eles não têm bibliotecas SSL do sistema. No macOS, `brew install openssl` instala em `/usr/local/opt/openssl` para que `system` possa encontrá-la. No Windows, ele verifica `%ProgramFiles%/OpenSSL`, `%ProgramFiles%/OpenSSL-Win32`, `%ProgramFiles%/OpenSSL-Win64`, `C:/OpenSSL`, `C:/OpenSSL-Win32` e `C:/OpenSSL-Win64`.

    - `yes`: Este é um sinônimo de `system`.

    - `opensslversion`: Use um pacote de sistema OpenSSL alternativo, como `openssl11` no EL7, ou `openssl3` (ou `openssl3-fips`) no EL8.

      Plugins de autenticação, como LDAP e Kerberos, são desabilitados, pois não suportam essas versões alternativas do OpenSSL.

  + *`caminho_nome`* é o nome do caminho da instalação do OpenSSL a ser usado. Isso pode ser preferível ao usar o valor `system` de *`ssl_type`* porque pode impedir que o CMake detecte e use uma versão do OpenSSL mais antiga ou incorreta instalada no sistema. (Outra maneira permitida de fazer a mesma coisa é definir `WITH_SSL` para `system` e definir a opção `CMAKE_PREFIX_PATH` para *`caminho_nome`*.)

Para obter informações adicionais sobre a configuração da biblioteca SSL, consulte a Seção 2.8.6, “Configurando o Suporte à Biblioteca SSL”.

* `-DWITH_SHOW_PARSE_TREE=bool`

  Habilita o suporte para `SHOW PARSE_TREE` no servidor, usado apenas em desenvolvimento e depuração. Não é usado para builds de lançamento ou suportado em produção.

* `-DWITH_SYSTEMD=bool`

  Se ativar o suporte à instalação de arquivos de **systemd**. Por padrão, essa opção está desabilitada. Quando ativada, os arquivos de suporte a **systemd** são instalados, e os scripts como **mysqld\_safe** e o script de inicialização System V não são instalados. Em plataformas onde **systemd** não está disponível, a ativação de `WITH_SYSTEMD` resulta em um erro do **CMake**.

  Quando o servidor foi construído usando essa opção, o MySQL inclui todas as mensagens de **systemd** no log de erro do servidor (consulte a Seção 7.4.2, “O Log de Erro”).

  Para obter mais informações sobre o uso de **systemd**, consulte a Seção 2.5.9, “Gerenciando o Servidor MySQL com systemd”. Essa seção também inclui informações sobre a especificação de opções que não são especificadas explicitamente nos grupos de opções de `[mysqld_safe]`. Como o **mysqld\_safe** não é instalado quando **systemd** é usado, tais opções devem ser especificadas de outra forma.

* `-DWITH_SYSTEM_LIBS=bool`

  Esta opção serve como uma opção “guarda-chuva” para definir o valor `system` de qualquer uma das seguintes opções do **CMake** que não são definidas explicitamente: `WITH_CURL`, `WITH_EDITLINE`, `WITH_ICU`, `WITH_LIBEVENT`, `WITH_LZ4`, `WITH_LZMA`, `WITH_PROTOBUF`, `WITH_RE2`, `WITH_SSL`, `WITH_ZLIB`, `WITH_ZSTD`.

* `-DWITH_SYSTEMD_DEBUG=bool`

  Se produzir informações de depuração adicionais de **systemd**, para plataformas em que **systemd** é usado para executar o MySQL. O padrão é `OFF`.

* `-DWITH_TCMALLOC=bool`

Se vincular com `-ltcmalloc`. Se habilitado, as rotinas integradas `malloc()`, `calloc()`, `realloc()` e `free()` são desabilitadas. O padrão é `OFF`.

A biblioteca `tcmalloc` é incluída na fonte; você pode fazer com que a compilação use a versão incluída configurando essa opção para `BUNDLED`. `BUNDLED` é suportado apenas em sistemas Linux.

`WITH_TCMALLOC` e `WITH_JEMALLOC` são mutuamente exclusivos.

* `-DWITH_TEST_TRACE_PLUGIN=bool`

  Se vincular com o plugin de registro de protocolo de teste (consulte Usar o Plugin de Registro de Protocolo de Teste). Por padrão, essa opção está desabilitada. Habilitar essa opção não tem efeito a menos que a opção `WITH_CLIENT_PROTOCOL_TRACING` esteja habilitada. Se o MySQL estiver configurado com ambas as opções habilitadas, a biblioteca de cliente `libmysqlclient` será compilada com o plugin de registro de protocolo de teste embutido e todos os clientes padrão do MySQL carregarão o plugin. No entanto, mesmo quando o plugin de teste estiver habilitado, ele não tem efeito por padrão. O controle do plugin é concedido usando variáveis de ambiente; consulte Usar o Plugin de Registro de Protocolo de Teste.

  Nota

  *Não* habilite a opção `WITH_TEST_TRACE_PLUGIN` se você quiser usar seus próprios plugins de registro de protocolo, pois apenas um desses plugins pode ser carregado por vez e ocorrerá um erro para tentativas de carregar um segundo. Se você já compilou o MySQL com o plugin de registro de protocolo de teste habilitado para ver como ele funciona, você deve recompilar o MySQL sem ele antes de poder usar seus próprios plugins.

  Para informações sobre como escrever plugins de registro, consulte Escrevendo Plugins de Registro de Protocolo.

* `-DWITH_TSAN=bool`

  Se habilitar o ThreadSanitizer, para compiladores que o suportam. O padrão é desativado.

* `-DWITH_UBSAN=bool`

  Se habilitar o Undefined Behavior Sanitizer, para compiladores que o suportam. O padrão é desativado.

* `-DWITH_UNIT_TESTS={ON|OFF}`

Se habilitado, compile o MySQL com testes unitários. O padrão é `ON`, a menos que o servidor não esteja sendo compilado.

* `-DWITH_UNIXODBC=1`

  Habilita o suporte unixODBC, para o Connector/ODBC.

* `-DWITH_VALGRIND=bool`

  Se compilar com os arquivos de cabeçalho do Valgrind, que expõe a API do Valgrind ao código do MySQL. O padrão é `OFF`.

  Para gerar uma compilação de depuração consciente do Valgrind, `-DWITH_VALGRIND=1` normalmente é combinado com `-DWITH_DEBUG=1`. Veja Construção de Configurações de Depuração.

* `-DWITH_WIN_JEMALLOC=string`

  Em Windows, passe um caminho para um diretório que contenha `jemalloc.dll` para habilitar a funcionalidade jemalloc. O sistema de compilação copia `jemalloc.dll` para o mesmo diretório que `mysqld.exe` e/ou `mysqld-debug.exe` e utiliza-o para operações de gerenciamento de memória. Funções de memória padrão são usadas se `jemalloc.dll` não for encontrado ou não exportar as funções necessárias. Uma mensagem de log de nível INFORMÁTICO registra se o jemalloc é encontrado e usado ou não.

  Esta opção é habilitada para os binários oficiais do MySQL para Windows.

* `-DWITH_ZLIB=zlib_type`

  Algumas funcionalidades requerem que o servidor seja compilado com suporte à biblioteca de compressão, como as funções `COMPRESS()` e `UNCOMPRESS()` e a compressão do protocolo cliente/servidor. A opção `WITH_ZLIB` indica a fonte do suporte `zlib`:

  A versão mínima suportada do `zlib` é 1.2.13.

  + `bundled`: Use a biblioteca `zlib` empacotada com a distribuição. Este é o padrão.

  + `system`: Use a biblioteca `zlib` do sistema.

* `-DWITH_ZSTD=zstd_type`

  A compressão da conexão usando o algoritmo `zstd` (veja a Seção 6.2.8, “Controle de Compressão de Conexão”) requer que o servidor seja compilado com suporte à biblioteca `zstd`. A opção `WITH_ZSTD` indica a fonte do suporte `zstd`:

+ `bundled`: Use a biblioteca `zstd` incluída na distribuição. Isso é o padrão.

  + `system`: Use a biblioteca `zstd` do sistema.

* `-DWITHOUT_SERVER=bool`

  Se deseja construir sem o servidor MySQL. O padrão é DESATIVADO, o que permite a construção do servidor.

  Essa opção é considerada experimental; é preferível construir com o servidor.

  Essa opção também impede a construção do motor de armazenamento `NDB` ou de quaisquer binários `NDB`, incluindo programas de gerenciamento e de nó de dados.

#### Finais do Compilador

* `-DCMAKE_C_FLAGS="flags"`

  Finais para o compilador C.

* `-DCMAKE_CXX_FLAGS="flags"`

  Finais para o compilador C++.

* `-DWITH_DEFAULT_COMPILER_OPTIONS=bool`

  Se deseja usar os finais de `cmake/build_configurations/compiler_options.cmake`.

  Observação

  Todos os finais de otimização são cuidadosamente escolhidos e testados pela equipe de construção do MySQL. Alterá-los pode levar a resultados inesperados e é feito por sua conta e risco.

* `-DOPTIMIZE_SANITIZER_BUILDS=bool`

  Se deseja adicionar `-O1 -fno-inline` às construções do sanitizador. O padrão é `ON`.

Para especificar seus próprios finais de compilador C e C++, para finais que não afetam a otimização, use as opções CMake `CMAKE_C_FLAGS` e `CMAKE_CXX_FLAGS`.

Ao fornecer seus próprios finais de compilador, você pode querer especificar `CMAKE_BUILD_TYPE` também.

Por exemplo, para criar uma construção de liberação de 32 bits em uma máquina Linux de 64 bits, faça o seguinte:

```
$> mkdir build
$> cd build
$> cmake .. -DCMAKE_C_FLAGS=-m32 \
  -DCMAKE_CXX_FLAGS=-m32 \
  -DCMAKE_BUILD_TYPE=RelWithDebInfo
```

Se você definir flags que afetam a otimização (`-Onumber`), você deve definir as opções `CMAKE_C_FLAGS_build_type` e/ou `CMAKE_CXX_FLAGS_build_type`, onde *`build_type`* corresponde ao valor de `CMAKE_BUILD_TYPE`. Para especificar uma otimização diferente para o tipo de compilação padrão (`RelWithDebInfo`), defina as opções `CMAKE_C_FLAGS_RELWITHDEBINFO` e `CMAKE_CXX_FLAGS_RELWITHDEBINFO`. Por exemplo, para compilar no Linux com `-O3` e com símbolos de depuração, faça isso:

```
$> cmake .. -DCMAKE_C_FLAGS_RELWITHDEBINFO="-O3 -g" \
  -DCMAKE_CXX_FLAGS_RELWITHDEBINFO="-O3 -g"
```

#### Opções do CMake para Compilar o NDB Cluster

Para compilar o MySQL com suporte para o NDB Cluster, você pode usar `-DWITH_NDB`, o que faz com que a compilação inclua o motor de armazenamento NDB e todos os programas NDB. Esta opção está habilitada por padrão. Para evitar a compilação do plugin do motor de armazenamento NDB, use `-DWITH_NDBCLUSTER_STORAGE_ENGINE=OFF`. Outros aspectos da compilação podem ser controlados usando as outras opções listadas nesta seção.

As seguintes opções se aplicam ao compilar as fontes do MySQL com suporte para o NDB Cluster.

* `-DNDB_UTILS_LINK_DYNAMIC={ON|OFF}`

  Controla se as utilidades NDB, como **ndb\_drop\_table**, são vinculadas com o `ndbclient` staticamente (`OFF`) ou dinamicamente (`ON`); `OFF` (vinculação estática) é o padrão. Normalmente, a vinculação estática é usada ao compilar essas utilidades para evitar problemas com `LD_LIBRARY_PATH`, ou quando múltiplas versões do `ndbclient` estão instaladas. Esta opção é destinada à criação de imagens Docker e possivelmente outros casos em que o ambiente de destino está sujeito a controle preciso e é desejável reduzir o tamanho da imagem.

* `-DWITH_CLASSPATH=path`

  Define o classpath para a compilação do Conector MySQL NDB Cluster para Java. O padrão é vazio. Esta opção é ignorada se `-DWITH_NDB_JAVA=OFF` for usada.

* `-DWITH_ERROR_INSERT={ON|OFF}`

Permite a injeção de erros no kernel `NDB`. Apenas para testes; não é destinado ao uso na construção de binários de produção. O padrão é `OFF`.

* `-DWITH_NDB={ON|OFF}`

  Construir o MySQL NDB Cluster; construir o plugin NDB e todos os programas do NDB Cluster.

* `-DWITH_NDBAPI_EXAMPLES={ON|OFF}`

  Construir programas de exemplo da API NDB em `storage/ndb/ndbapi-examples/`. Consulte Exemplos da API NDB para obter informações sobre esses.

* `-DWITH_NDBCLUSTER_STORAGE_ENGINE={ON|OFF}`

  Controla (apenas) se o plugin `ndbcluster` é incluído na construção; `WITH_NDB` habilita essa opção automaticamente, portanto, é recomendável que você use `WITH_NDB` em vez disso.

* `-DWITH_NDBCLUSTER={ON|OFF}` (DESUSO)

  Construir e vincular o suporte para o motor de armazenamento `NDB` no **mysqld**.

  Esta opção está desatualizada e sujeita à eventual remoção; use `WITH_NDB` em vez disso.

* `-DWITH_NDBMTD={ON|OFF}`

  Construir o executável do nó de dados multithread **ndbmtd"). O padrão é `ON`.

* `-DWITH_NDB_DEBUG={ON|OFF}`

  Habilitar a construção das versões de depuração dos binários do NDB Cluster. Isso é `OFF` por padrão.

* `-DWITH_NDB_JAVA={ON|OFF}`

  Habilitar a construção do NDB Cluster com suporte para Java, incluindo suporte para ClusterJ (consulte MySQL NDB Cluster Connector for Java).

  Esta opção é `ON` por padrão. Se você não deseja compilar o NDB Cluster com suporte para Java, deve desabilitar explicitamente especificando `-DWITH_NDB_JAVA=OFF` ao executar o **CMake**. Caso contrário, se o Java não for encontrado, a configuração da construção falha.

* `-DWITH_NDB_PORT=port`

  Faz com que o servidor de gerenciamento do NDB Cluster (**ndb\_mgmd**) que é construído use este *`port`* por padrão. Se esta opção não for definida, o servidor de gerenciamento resultante tenta usar o port 1186 por padrão.

* `-DWITH_NDB_TEST={ON|OFF}`

Se habilitado, inclua um conjunto de programas de teste da API NDB. O padrão é `OFF`.

* `-DWITH_NDB_TLS_SEARCH_PATH=caminho`

  Defina o caminho padrão pesquisado pelo **ndb\_sign\_keys** e outros programas `NDB` para arquivos de certificados e chaves TLS.

  O padrão para plataformas Windows é `$HOMEDIR/ndb-tls`; para outras plataformas, como Linux, é `$HOME/ndb-tls`.