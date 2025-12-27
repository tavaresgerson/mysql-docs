### 2.8.7 Opções de Configuração de Fonte do MySQL

O programa `CMake` oferece um grande controle sobre como você configura uma distribuição de fonte do MySQL. Normalmente, você faz isso usando opções na linha de comando do `CMake`. Para obter informações sobre as opções suportadas pelo `CMake`, execute qualquer um desses comandos no diretório de fonte de nível superior:

```
$> cmake . -LH

$> ccmake .
```

Você também pode afetar o `CMake` usando certas variáveis de ambiente. Veja a Seção 6.9, “Variáveis de Ambiente”.

Para opções booleanas, o valor pode ser especificado como `1` ou `ON` para habilitar a opção, ou como `0` ou `OFF` para desabilitar a opção.

Muitas opções configuram padrões de tempo de compilação que podem ser sobrescritos na inicialização do servidor. Por exemplo, as opções `CMAKE_INSTALL_PREFIX`, `MYSQL_TCP_PORT` e `MYSQL_UNIX_ADDR` que configuram a localização padrão do diretório de instalação, o número de porta TCP/IP e o arquivo de socket Unix podem ser alteradas na inicialização do servidor com as opções  `--basedir`, `--port` e `--socket` para o `mysqld`. Onde aplicável, as descrições das opções de configuração indicam a opção de inicialização correspondente do `mysqld`.

As seções a seguir fornecem mais informações sobre as opções do `CMake`.

*  Referência de Opções do CMake
*  Opções Gerais
*  Opções de Layout de Instalação
*  Opções de Engrenagens de Armazenamento
*  Opções de Recursos
*  Ferramentas de Compilação
*  Opções do CMake para Compilar o NDB Cluster

#### Referência de Opções do CMake

A tabela a seguir mostra as opções do `CMake` disponíveis. Na coluna `Default`, `PREFIX` representa o valor da opção `CMAKE_INSTALL_PREFIX`, que especifica o diretório de base de instalação. Esse valor é usado como a localização pai para vários dos subdiretórios de instalação.

**Tabela 2.15 Referência de Opções de Configuração de Fonte do MySQL (CMake)**

System library directory</td> <td></td> </tr><tr><th><code>WITH_SYSTEM_PATH</code></th> <td>System path directory</td> <td></td> </tr><tr><th><code>WITH_SYSTEM_USER</code></th> <td>System user directory</td> <td></td> </tr><tr><th><code>WITH_SYSTEM_USER_DIR</code></th> <td>System user directory</td> <td></td> </tr><tr><th><code>WITH_SYSTEM_USER_LOG</code></th> <td>System user log directory</td> <td></td> </tr><tr><th><code>WITH_SYSTEM_USER_LOG_DIR</code></th> <td>System user log directory</td> <td></td> </tr><tr><th><code>WITH_SYSTEM_USER_LOG_FILE</code></th> <td>System user log file</td> <td></td> </tr><tr><th><code>WITH_SYSTEM_USER_LOG_FILE_DIR</code></th> <td>System user log file directory</td> <td></td> </tr><tr><th><code>WITH_SYSTEM_USER_LOG_FILE_NAME</code></th> <td>System user log file name</td> <td></td> </tr><tr><th><code>WITH_SYSTEM_USER_LOG_FILE_PATH</code></th> <td>System user log file path</td> <td></td> </tr><tr><th><code>WITH_SYSTEM_USER_LOG_PATH</code></th> <td>System user log path</td> <td></td> </tr><tr><th><code>WITH_SYSTEM_USER_LOG_USER</code></th> <td>System user log user</td> <td></td> </tr><tr><th><code>WITH_SYSTEM_USER_LOG_USER_DIR</code></th> <td>System user log user directory</td> <td></td> </tr><tr><th><code>WITH_SYSTEM_USER_LOG_USER_LOG_DIR</code></th> <td>System user log user log directory</td> <td></td> </tr><tr><th><code>WITH_SYSTEM_USER_LOG_USER_LOG_FILE</code></th> <td>System user log user log file</td> <td></td> </tr><tr><th><code>WITH_SYSTEM_USER_LOG_USER_LOG_FILE_DIR</code></th> <td>System user log user log file directory</td> <td></td> </tr><tr><th><code>WITH_SYSTEM_USER_LOG_USER_LOG_FILE_NAME</code></th> <td>System user log user log file name</td> <td></td> </tr><tr><th><code>WITH_SYSTEM_USER_LOG_USER_LOG_FILE_PATH</code></th> <td>System user log user log file path</td> <td></td> </tr><tr><th><code>WITH_SYSTEM_USER_LOG_USER_LOG_USER</code></th> <td>System user log user</td> <td></td> </tr><tr><th><code>WITH_SYSTEM_USER_LOG_USER_LOG_USER_DIR</code></th> <td>System user log user directory</td> <td></td> </tr><tr><th><code>WITH_SYSTEM_USER_LOG_USER_LOG_USER_LOG_FILE</code></th> <td>System user log user log file</td> <td></td> </tr><tr><th><code>WITH_SYSTEM_USER_LOG_USER_LOG_USER_LOG_FILE_DIR</code></th> <td>System user log user log file directory</td> <td></td> </tr><tr><th><code>WITH_SYSTEM_USER_LOG_USER_LOG_USER_LOG_FILE_NAME</code></th> <td>System user log user log file name</td> <td></td> </tr><tr><th><code>WITH_SYSTEM_USER_LOG_USER_LOG_USER_LOG_FILE_PATH</code></th> <td>System user log user log file path</td> <td></td> </tr><tr><th><code>WITH_SYSTEM_USER_LOG_USER_LOG_USER_LOG_USER</code></th> <td>System user log user</td> <td></td> </tr><tr><th><code>WITH_SYSTEM_USER_LOG_USER_LOG_USER_LOG_USER_DIR</code></th> <td>System user log user directory</td> <td></td> </tr><tr><th><code>WITH_SYSTEM_USER_LOG_USER_LOG_USER_LOG_FILE_USER</code></th> <td>System user log user</td> <td></td> </tr><tr><th><code>WITH_SYSTEM_USER_LOG_USER_LOG_USER_LOG_FILE_USER_DIR</code></th> <td>System user log user directory</td> <td></td> </tr><tr><th><code>WITH_SYSTEM_USER_LOG_USER_LOG_USER_LOG_FILE_USER_LOG_FILE</code></th> <td>System user log user log file</td> <td></td> </tr><tr><th><code>WITH_SYSTEM_USER_LOG_USER_LOG_USER_LOG_FILE_USER_LOG_FILE_DIR</code></th> <td>System user log user log file directory</td> <td></td> </tr><tr><th><code>WITH_SYSTEM_USER_LOG_USER_LOG_USER_LOG_FILE_USER_LOG_FILE_NAME</code></th> <td>System user log user log file name</td> <td></td> </tr><tr><th><code>WITH_SYSTEM_USER_LOG_USER_LOG_USER_LOG_FILE_USER_LOG_FILE_PATH</code></th> <td>System user log user log file path</td> <td></td>

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

  Esta opção afeta se a operação `make package` produz vários arquivos de pacote de instalação ou um único arquivo. Se desabilitada, a operação produz vários arquivos de pacote de instalação, o que pode ser útil se você quiser instalar apenas um subconjunto de uma instalação completa do MySQL. Se habilitada, produz um único arquivo para instalar tudo.
* `-DFORCE_INSOURCE_BUILD=bool`

  Define se for forçado uma compilação in-source. As compilações fora da fonte são recomendadas, pois permitem múltiplas compilações a partir da mesma fonte e a limpeza pode ser realizada rapidamente removendo o diretório de compilação. Para forçar uma compilação in-source, inicie o `CMake` com `-DFORCE_INSOURCE_BUILD=ON`.
* `-DFORCE_COLORED_OUTPUT=bool`

Define se a saída colorida do compilador deve ser habilitada para `gcc` e `clang` ao compilar na linha de comando. A configuração padrão é `OFF`.

#### Opções de Layout de Instalação

A opção `CMAKE_INSTALL_PREFIX` indica o diretório de instalação base. Outras opções com nomes na forma `INSTALL_xxx` que indicam os locais dos componentes são interpretadas em relação ao prefixo e seus valores são caminhos relativos. Seus valores não devem incluir o prefixo.

*  `-DCMAKE_INSTALL_PREFIX=dir_name`

  O diretório de instalação base.

  Esse valor pode ser definido no início do servidor usando a opção `--basedir`.
*  `-DINSTALL_BINDIR=dir_name`

  Onde instalar programas de usuário.
*  `-DINSTALL_DOCDIR=dir_name`

  Onde instalar a documentação.
*  `-DINSTALL_DOCREADMEDIR=dir_name`

  Onde instalar os arquivos `README`.
*  `-DINSTALL_INCLUDEDIR=dir_name`

  Onde instalar os arquivos de cabeçalho.
*  `-DINSTALL_INFODIR=dir_name`

  Onde instalar os arquivos Info.
*  `-DINSTALL_LAYOUT=name`

  Selecionar um layout de instalação predefinido:

  + `STANDALONE`: O mesmo layout usado para pacotes `.tar.gz` e `.zip`. Esse é o padrão.
  + `RPM`: Layout semelhante aos pacotes RPM.
  + `SVR4`: Layout de pacotes Solaris.
  + `DEB`: Layout de pacotes DEB (experimental).

  Você pode selecionar um layout predefinido, mas modificar os locais de instalação individuais dos componentes especificando outras opções. Por exemplo:

  ```
  cmake . -DINSTALL_LAYOUT=SVR4 -DMYSQL_DATADIR=/var/mysql/data
  ```

  O valor `INSTALL_LAYOUT` determina o valor padrão da variável de sistema `secure_file_priv`. Consulte a descrição dessa variável na Seção 7.1.8, “Variáveis do Sistema do Servidor”.
*  `-DINSTALL_LIBDIR=dir_name`

  Onde instalar arquivos de biblioteca.
*  `-DINSTALL_MANDIR=dir_name`

  Onde instalar páginas do manual.
*  `-DINSTALL_MYSQLSHAREDIR=dir_name`

  Onde instalar arquivos de dados compartilhados.
*  `-DINSTALL_MYSQLTESTDIR=dir_name`

Onde instalar o diretório `mysql-test`. Para suprimir a instalação deste diretório, defina explicitamente a opção para o valor vazio `-DINSTALL_MYSQLTESTDIR=`.
*  `-DINSTALL_PKGCONFIGDIR=dir_name`

  O diretório onde instalar o arquivo `mysqlclient.pc` para uso pelo `pkg-config`. O valor padrão é `INSTALL_LIBDIR/pkgconfig`, a menos que `INSTALL_LIBDIR` termine com `/mysql`, caso em que isso é removido primeiro.
*  `-DINSTALL_PLUGINDIR=dir_name`

  A localização do diretório de plugins.

  Este valor pode ser definido no início do servidor com a opção `--plugin_dir`.
*  `-DINSTALL_PRIV_LIBDIR=dir_name`

  A localização do diretório de bibliotecas dinâmicas.

  **Local padrão.** Para construções RPM, este é `/usr/lib64/mysql/private/`, para DEB é `/usr/lib/mysql/private/`, e para TAR é `lib/private/`.

  **Protobuf.** Como este é um local privado, o carregador (como `ld-linux.so` no Linux) pode não encontrar os arquivos `libprotobuf.so` sem ajuda. Para orientar o carregador, `RPATH=$ORIGIN/../$INSTALL_PRIV_LIBDIR` é adicionado a `mysqld` e `mysqlxtest`. Isso funciona na maioria dos casos, mas ao usar o recurso de Grupo de Recursos, `mysqld` é `setuid`, e o carregador ignora qualquer `RPATH` que contenha `$ORIGIN`. Para superar isso, um caminho completo explícito para o diretório é definido nas versões DEB e RPM de `mysqld`, já que o destino alvo é conhecido. Para instalações em arquivos TAR, é necessário fazer o patch de `mysqld` com uma ferramenta como `patchelf`.
*  `-DINSTALL_SBINDIR=dir_name`

  Onde instalar o servidor `mysqld`.
*  `-DINSTALL_SECURE_FILE_PRIVDIR=dir_name`

  O valor padrão para a variável de sistema `secure_file_priv`. O valor padrão é específico da plataforma e depende do valor da opção `INSTALL_LAYOUT` do `CMake`; veja a descrição da variável de sistema `secure_file_priv` na Seção 7.1.8, “Variáveis de Sistema do Servidor”.
*  `-DINSTALL_SHAREDIR=dir_name`

  Onde instalar `aclocal/mysql.m4`.
*  `-DINSTALL_STATIC_LIBRARIES=bool`

Se instalar bibliotecas estáticas. O padrão é `ON`. Se definido como `OFF`, esses arquivos de biblioteca não são instalados: `libmysqlclient.a`, `libmysqlservices.a`.
*  `-DINSTALL_SUPPORTFILESDIR=dir_name`

  Onde instalar arquivos de suporte adicionais.
*  `-DLINK_RANDOMIZE=bool`

  Se randomizar a ordem dos símbolos no binário `mysqld`. O padrão é `OFF`. Esta opção deve ser habilitada apenas para fins de depuração.
*  `-DLINK_RANDOMIZE_SEED=val`

  Valor de semente para a opção `LINK_RANDOMIZE`. O valor é uma string. O padrão é `mysql`, uma escolha arbitrária.
*  `-DMYSQL_DATADIR=dir_name`

  A localização do diretório de dados do MySQL.

  Este valor pode ser definido na inicialização do servidor com a opção `--datadir`.
*  `-DODBC_INCLUDES=dir_name`

  A localização do diretório de inclusões ODBC, que pode ser usado durante a configuração do Connector/ODBC.
*  `-DODBC_LIB_DIR=dir_name`

  A localização do diretório de bibliotecas ODBC, que pode ser usado durante a configuração do Connector/ODBC.
*  `-DSYSCONFDIR=dir_name`

  O diretório do arquivo de opção `my.cnf` padrão.

  Este local não pode ser definido na inicialização do servidor, mas você pode iniciar o servidor com um arquivo de opção específico usando a opção `--defaults-file=file_name`, onde `file_name` é o nome completo do arquivo.
*  `-DSYSTEMD_PID_DIR=dir_name`

  O nome do diretório em que o arquivo de PID será criado quando o MySQL for gerenciado pelo systemd. O padrão é `/var/run/mysqld`; este valor pode ser alterado implicitamente de acordo com o valor de `INSTALL_LAYOUT`.

  Esta opção é ignorada a menos que `WITH_SYSTEMD` esteja habilitado.
*  `-DSYSTEMD_SERVICE_NAME=name`

  O nome do serviço MySQL a ser usado quando o MySQL for gerenciado pelo `systemd`. O padrão é `mysqld`; este valor pode ser alterado implicitamente de acordo com o valor de `INSTALL_LAYOUT`.

  Esta opção é ignorada a menos que `WITH_SYSTEMD` esteja habilitado.
*  `-DTMPDIR=dir_name`

  A localização padrão a ser usada para a variável de sistema `tmpdir`. Se não especificado, o valor é definido como `P_tmpdir` em `<stdio.h>`.

#### Opções de Motores de Armazenamento

Os motores de armazenamento são construídos como plugins. Você pode construir um plugin como um módulo estático (compilado no servidor) ou um módulo dinâmico (construído como uma biblioteca dinâmica que deve ser instalada no servidor usando a instrução `INSTALL PLUGIN` ou a opção `--plugin-load` antes de poder ser usado). Alguns plugins podem não suportar a construção estática ou dinâmica.

Os motores `InnoDB`, `MyISAM`, `MERGE`, `MEMORY` e `CSV` são obrigatórios (sempre compilados no servidor) e não precisam ser instalados explicitamente.

Para compilar um motor de armazenamento staticamente no servidor, use `-DWITH_engine_STORAGE_ENGINE=1`. Alguns valores de *`engine`* permitidos são `ARCHIVE`, `BLACKHOLE`, `EXAMPLE` e `FEDERATED`. Exemplos:

```
-DWITH_ARCHIVE_STORAGE_ENGINE=1
-DWITH_BLACKHOLE_STORAGE_ENGINE=1
```

Para compilar o MySQL com suporte para o NDB Cluster, use a opção `WITH_NDB`.

::: info Nota

Não é possível compilar sem suporte ao Schema de Desempenho. Se for desejado compilar sem tipos específicos de instrumentação, isso pode ser feito com as seguintes opções `CMake`:

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

:::

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

Se nenhuma das opções `-DWITH_engine_STORAGE_ENGINE` ou `-DWITHOUT_engine_STORAGE_ENGINE` for especificada para um motor de armazenamento dado, o motor é construído como um módulo compartilhado, ou excluído se não puder ser construído como um módulo compartilhado.

#### Opções de Recursos

*  `-DADD_GDB_INDEX=bool`

  Esta opção determina se a geração de uma seção `.gdb_index` nos binários deve ser habilitada, o que torna o carregamento deles em um depurador mais rápido. A opção está desabilitada por padrão. O linkador `lld` é usado e é desabilitado se um linkador diferente de `lld` ou `gold` do GNU for usado.
*  `-DCOMPILATION_COMMENT=string`

Um comentário descritivo sobre o ambiente de compilação. Enquanto o `mysqld` usa `COMPILATION_COMMENT_SERVER`, outros programas usam `COMPILATION_COMMENT`.
*  `-DCOMPRESS_DEBUG_SECTIONS=bool`

  Se comprimir as seções de depuração de execuções binárias (apenas no Linux). A compressão das seções de depuração de execuções salva espaço em detrimento do tempo adicional de CPU durante o processo de compilação.

  O padrão é `OFF`. Se esta opção não for definida explicitamente, mas a variável de ambiente `COMPRESS_DEBUG_SECTIONS` for definida, a opção assume seu valor dessa variável.
*  `-DCOMPILATION_COMMENT_SERVER=string`

  Um comentário descritivo sobre o ambiente de compilação para uso pelo `mysqld` (por exemplo, para definir a variável de sistema `version_comment`). Programas diferentes do servidor usam `COMPILATION_COMMENT`.
*  `-DDEFAULT_CHARSET=charset_name`

  O conjunto de caracteres do servidor. Por padrão, o MySQL usa o conjunto de caracteres `utf8mb4`.

  `charset_name`* pode ser um dos valores `binary`, `armscii8`, `ascii`, `big5`, `cp1250`, `cp1251`, `cp1256`, `cp1257`, `cp850`, `cp852`, `cp866`, `cp932`, `dec8`, `eucjpms`, `euckr`, `gb2312`, `gbk`, `geostd8`, `greek`, `hebrew`, `hp8`, `keybcs2`, `koi8r`, `koi8u`, `latin1`, `latin2`, `latin5`, `latin7`, `macce`, `macroman`, `sjis`, `swe7`, `tis620`, `ucs2`, `ujis`, `utf8mb3`, `utf8mb4`, `utf16`, `utf16le`, `utf32`.

  Este valor pode ser definido no início do servidor com a opção `--character-set-server`.
*  `-DDEFAULT_COLLATION=collation_name`

  O conjunto de collation do servidor. Por padrão, o MySQL usa `utf8mb4_0900_ai_ci`. Use a instrução `SHOW COLLATION` para determinar quais collation estão disponíveis para cada conjunto de caracteres.

  Este valor pode ser definido no início do servidor com a opção `--collation_server`.
*  `-DDISABLE_PSI_COND=bool`

  Se excluir a instrumentação de condição do Performance Schema. O padrão é `OFF` (incluir).
*  `-DDISABLE_PSI_FILE=bool`

  Se excluir a instrumentação de arquivo do Performance Schema. O padrão é `OFF` (incluir).
*  `-DDISABLE_PSI_IDLE=bool`

Se deseja excluir a instrumentação de inatividade do Schema de Desempenho. O padrão é `OFF` (incluir).
*  `-DDISABLE_PSI_MEMORY=bool`

  Se deseja excluir a instrumentação de memória do Schema de Desempenho. O padrão é `OFF` (incluir).
*  `-DDISABLE_PSI_METADATA=bool`

  Se deseja excluir a instrumentação de metadados do Schema de Desempenho. O padrão é `OFF` (incluir).
*  `-DDISABLE_PSI_MUTEX=bool`

  Se deseja excluir a instrumentação de mutex do Schema de Desempenho. O padrão é `OFF` (incluir).
*  `-DDISABLE_PSI_RWLOCK=bool`

  Se deseja excluir a instrumentação de rwlock do Schema de Desempenho. O padrão é `OFF` (incluir).
*  `-DDISABLE_PSI_SOCKET=bool`

  Se deseja excluir a instrumentação de socket do Schema de Desempenho. O padrão é `OFF` (incluir).
*  `-DDISABLE_PSI_SP=bool`

  Se deseja excluir a instrumentação de programas armazenados do Schema de Desempenho. O padrão é `OFF` (incluir).
*  `-DDISABLE_PSI_STAGE=bool`

  Se deseja excluir a instrumentação de estágio do Schema de Desempenho. O padrão é `OFF` (incluir).
*  `-DDISABLE_PSI_STATEMENT=bool`

  Se deseja excluir a instrumentação de declaração do Schema de Desempenho. O padrão é `OFF` (incluir).
*  `-DDISABLE_PSI_STATEMENT_DIGEST=bool`

  Se deseja excluir a instrumentação de digest de declaração do Schema de Desempenho. O padrão é `OFF` (incluir).
*  `-DDISABLE_PSI_TABLE=bool`

  Se deseja excluir a instrumentação de tabela do Schema de Desempenho. O padrão é `OFF` (incluir).
*  `-DDISABLE_PSI_PS=bool`

  Excluir a instrumentação de instâncias de declarações preparadas do Schema de Desempenho. O padrão é `OFF` (incluir).
*  `-DDISABLE_PSI_THREAD=bool`

  Excluir a instrumentação de thread do Schema de Desempenho. O padrão é `OFF` (incluir).

  Desabilitar apenas os threads ao compilar sem nenhuma instrumentação, pois outras instrumentações dependem dos threads.
*  `-DDISABLE_PSI_TRANSACTION=bool`

  Excluir a instrumentação de transação do Schema de Desempenho. O padrão é `OFF` (incluir).
*  `-DDISABLE_PSI_DATA_LOCK=bool`

Exclua a instrumentação do bloqueio de dados do esquema de desempenho. O padrão é `OFF` (incluir).
*  `-DDISABLE_PSI_ERROR=bool`

Exclua a instrumentação de erros do servidor do esquema de desempenho. O padrão é `OFF` (incluir).
*  `-DENABLE_EXPERIMENTAL_SYSVARS=bool`

Se habilitar as variáveis de sistema experimentais do `InnoDB`. As variáveis de sistema experimentais são destinadas a desenvolvedores do MySQL, devem ser usadas apenas em ambientes de desenvolvimento ou teste e podem ser removidas sem aviso prévio em uma futura versão do MySQL. Para obter informações sobre as variáveis de sistema experimentais, consulte `/storage/innobase/handler/ha_innodb.cc` no repositório de código-fonte do MySQL. As variáveis de sistema experimentais podem ser identificadas pesquisando `PLUGIN_VAR_EXPERIMENTAL`.
*  `-DENABLE_GCOV=bool`

Se incluir o suporte **gcov** (apenas Linux).
*  `-DENABLE_GPROF=bool`

Se habilitar o **gprof** (apenas compilações otimizadas para Linux).
*  `-DENABLED_LOCAL_INFILE=bool`

Esta opção controla a capacidade `LOCAL` integrada ao cliente da biblioteca MySQL. Os clientes que não fazem arranjos explícitos, portanto, têm a capacidade `LOCAL` desabilitada ou habilitada de acordo com a configuração `ENABLED_LOCAL_INFILE` especificada no momento da compilação do MySQL.

Por padrão, a biblioteca do cliente nas distribuições binárias do MySQL é compilada com `ENABLED_LOCAL_INFILE` desabilitada. Se você compilar o MySQL a partir do código-fonte, configure-o com `ENABLED_LOCAL_INFILE` desabilitada ou habilitada com base se os clientes que não fazem arranjos explícitos devem ter a capacidade `LOCAL` desabilitada ou habilitada, respectivamente.

`ENABLED_LOCAL_INFILE` controla o padrão para a capacidade `LOCAL` no lado do cliente. Para o servidor, a variável de sistema `local_infile` controla a capacidade `LOCAL` no lado do servidor. Para forçar explicitamente o servidor a recusar ou permitir as instruções `LOAD DATA LOCAL` (independentemente de como os programas e bibliotecas do cliente forem configurados no momento da compilação ou execução), inicie o `mysqld` com `--local-infile` desativado ou ativado, respectivamente. O `local_infile` também pode ser definido em tempo de execução. Veja a Seção 8.1.6, “Considerações de Segurança para LOAD DATA LOCAL”.
*  `-DENABLED_PROFILING=bool`

  Se habilitar o código de perfilagem de consultas (para as instruções `SHOW PROFILE` e `SHOW PROFILES`).
*  `-DFORCE_UNSUPPORTED_COMPILER=bool`

  Por padrão, o `CMake` verifica as versões mínimas dos compiladores suportados; para desabilitar essa verificação, use `-DFORCE_UNSUPPORTED_COMPILER=ON`.
*  `-DFPROFILE_GENERATE=bool`

  Se gerar dados de otimização guiada por perfil (PGO). Esta opção está disponível para experimentar com PGO com o GCC. Veja o arquivo `cmake/fprofile.cmake` na distribuição de código-fonte do MySQL para obter informações sobre o uso de `FPROFILE_GENERATE` e `FPROFILE_USE`. Essas opções foram testadas com o GCC 8 e 9.
*  `-DFPROFILE_USE=bool`

  Se usar dados de otimização guiada por perfil (PGO). Esta opção está disponível para experimentar com PGO com o GCC. Veja o arquivo `cmake/fprofile.cmake` em uma distribuição de código-fonte do MySQL para obter informações sobre o uso de `FPROFILE_GENERATE` e `FPROFILE_USE`. Essas opções foram testadas com o GCC 8 e 9.

  Ativação de `FPROFILE_USE` também ativa `WITH_LTO`.
*  `-DHAVE_PSI_MEMORY_INTERFACE=bool`

  Se habilitar o módulo de rastreamento de memória do esquema de desempenho para funções de alocação de memória (`ut::aligned_name` funções da biblioteca) usadas no armazenamento dinâmico de tipos sobrealinhados.
*  `-DIGNORE_AIO_CHECK=bool`

Se a opção `-DBUILD_CONFIG=mysql_release` for fornecida no Linux, a biblioteca `libaio` deve ser vinculada por padrão. Se você não tiver `libaio` ou não quiser instalá-lo, pode suprimir a verificação para ele especificando `-DIGNORE_AIO_CHECK=1`.
*  `-DMAX_INDEXES=num`

  O número máximo de índices por tabela. O padrão é 64. O máximo é 255. Valores menores que 64 são ignorados e o padrão de 64 é usado.
*  `-DMYSQL_MAINTAINER_MODE=bool`

  Se habilitar o ambiente de desenvolvimento específico para o maintainer do MySQL. Se habilitado, esta opção faz com que as avisos do compilador se tornem erros.
*  `-DWITH_DEVELOPER_ENTITLEMENTS=bool`

  Se adicionar o direito `get-task-allow` a todos os executáveis para gerar um dump de núcleo no caso de uma parada inesperada do servidor.

  No macOS 11+, os dumps de núcleo são limitados a processos com o direito `com.apple.security.get-task-allow`, que esta opção do CMake habilita. O direito permite que outros processos se acomodem e leiam/modifiquem a memória dos processos e permite que o `--core-file` funcione como esperado.
*  `-DMUTEX_TYPE=type`

  O tipo de mutex usado pelo `InnoDB`. As opções incluem:

  + `event`: Use mutexes de evento. Este é o valor padrão e a implementação original do mutex `InnoDB`.
  + `sys`: Use mutexes POSIX em sistemas UNIX. Use objetos `CRITICAL_SECTION` em Windows, se disponível.
  + `futex`: Use futexes Linux em vez de variáveis de condição para agendar threads em espera.
*  `-DMYSQLX_TCP_PORT=port_num`

  O número de porta no qual o Plugin X escuta por conexões TCP/IP. O padrão é 33060.

  Este valor pode ser definido no início do servidor com a variável de sistema `mysqlx_port`.
*  `-DMYSQLX_UNIX_ADDR=file_name`

  O caminho do arquivo de soquete Unix no qual o servidor escuta por conexões de soquete do Plugin X. Este deve ser um nome de caminho absoluto. O padrão é `/tmp/mysqlx.sock`.

  Este valor pode ser definido no início do servidor com a variável de sistema `mysqlx_port`.
*  `-DMYSQL_PROJECT_NAME=name`

Para Windows ou macOS, o nome do projeto a ser incorporado no nome do arquivo do projeto.
*  `-DMYSQL_TCP_PORT=port_num`

  O número de porta no qual o servidor escuta conexões TCP/IP. O padrão é 3306.

  Esse valor pode ser definido na inicialização do servidor com a opção `--port`.
*  `-DMYSQL_UNIX_ADDR=file_name`

  O caminho do arquivo de socket Unix no qual o servidor escuta conexões de socket. Esse caminho deve ser um nome de caminho absoluto. O padrão é `/tmp/mysql.sock`.

  Esse valor pode ser definido na inicialização do servidor com a opção `--socket`.
*  `-DOPTIMIZER_TRACE=bool`

  Se suportar o rastreamento do otimizador. Consulte a Seção 10.15, “Rastrear o Otimizador”.
*  `-DREPRODUCIBLE_BUILD=bool`

  Para builds em sistemas Linux, essa opção controla se deve ter cuidado extra para criar um resultado de build independente da localização e do tempo da build.

  Essa opção tem o valor padrão `ON` para builds `RelWithDebInfo`.
*  `-DSHOW_SUPPRESSED_COMPILER_WARNINGS=bool`

  Mostrar avisos de compilador suprimidos e fazê-lo sem falhar com `-Werror`. O padrão é `OFF`.
*  `-DWIN_DEBUG_NO_INLINE=bool`

  Se desabilitar a inlining de funções no Windows. O padrão é `OFF` (inlining habilitado).
*  `-DWITH_LD=string`

  O `CMake` usa o linkador padrão por padrão. Opcionalmente, passe `lld` ou `mold` para especificar um linkador alternativo. `mold` deve ser versão 2 ou superior.

  Essa opção pode ser usada em sistemas baseados em Linux, exceto o Enterprise Linux, que sempre usa o linkador `ld`.

  ::: info Nota

  Anteriormente, a opção `USE_LD_LLD` poderia ser usada para habilitar (o padrão) ou desabilitar explicitamente o linkador `lld` do LLVM para o Clang. No MySQL 8.3, `USE_LD_LLD` foi removida.

  :::
*  `-DWITH_ANT=path_name`

  Defina o caminho para o Ant, necessário ao construir o wrapper GCS Java. Defina `WITH_ANT` com o caminho de um diretório onde o pacote tarball do Ant ou o arquivo descompactado é salvo. Quando `WITH_ANT` não é definido ou é definido com o valor especial `system`, o processo de build assume que um binário `ant` existe no `$PATH`.

Se habilitar o AddressSanitizer, para os compiladores que o suportam. O padrão é `OFF`.
*  `-DWITH_ASAN_SCOPE=bool`

  Se habilitar a bandeira `-fsanitize-address-use-after-scope` do Clang para detecção de uso após escopo. O padrão é desativado. Para usar essa opção, `-DWITH_ASAN` também deve ser habilitado.
*  `-DWITH_AUTHENTICATION_CLIENT_PLUGINS=bool`

  Essa opção é habilitada automaticamente se forem compilados os plugins de autenticação do servidor correspondentes. Seu valor depende de outras opções do `CMake` e não deve ser definido explicitamente.
*  `-DWITH_AUTHENTICATION_LDAP=bool`

  Se reportar um erro se os plugins de autenticação LDAP não puderem ser compilados:

  + Se essa opção for desativada (o padrão), os plugins LDAP são compilados se os arquivos de cabeçalho e bibliotecas necessários forem encontrados. Se não forem, o `CMake` exibe uma nota sobre isso.
  + Se essa opção for habilitada, a falta de encontrar o arquivo de cabeçalho e as bibliotecas necessárias faz com que o `CMake` produza um erro, impedindo a construção do servidor.
*  `-DWITH_AUTHENTICATION_PAM=bool`

  Se construir o plugin de autenticação PAM, para os repositórios de código-fonte que incluem esse plugin. (Veja a Seção 8.4.1.5, “Autenticação PAM Pluggable”.) Se essa opção for especificada e o plugin não puder ser compilado, a construção falha.
*  `-DWITH_AWS_SDK=path_name`

  A localização do kit de desenvolvimento de software da Amazon Web Services.
*  `-DWITH_CLIENT_PROTOCOL_TRACING=bool`

  Se construir a estrutura de rastreamento de protocolo do lado do cliente na biblioteca do cliente. Por padrão, essa opção está habilitada.

  Para obter informações sobre como escrever plugins de cliente de rastreamento de protocolo, consulte  Escrevendo Plugins de Rastreamento de Protocolo.

  Veja também a opção `WITH_TEST_TRACE_PLUGIN`.
*  `-DWITH_CURL=curl_type`

  A localização da biblioteca `curl`. *`curl_type`* pode ser `system` (use a biblioteca `curl` do sistema), um nome de caminho para a biblioteca `curl`, `no`|`off`|`none` para desabilitar o suporte ao curl, ou `bundled` para usar a distribuição de curl empacotada em `extra/curl/`.
*  `-DWITH_DEBUG=bool`

Incluir suporte de depuração.

Configurar o MySQL com suporte de depuração permite que você use a opção `--debug="d,parser_debug"`, ao iniciar o servidor. Isso faz com que o analisador Bison, que é usado para processar instruções SQL, armazene uma traça do analisador na saída de erro padrão do servidor. Normalmente, essa saída é escrita no log de erro.

A verificação de sincronização do debug para o mecanismo de armazenamento `InnoDB` é definida em `UNIV_DEBUG` e está disponível quando o suporte de depuração é compilado com a opção `WITH_DEBUG`. Quando o suporte de depuração é compilado, a opção de configuração `innodb_sync_debug` pode ser usada para habilitar ou desabilitar a verificação de debug de sincronização do `InnoDB`.

Habilitar `WITH_DEBUG` também habilita o Debug Sync. Essa facilidade é usada para testes e depuração. Quando compilado, o Debug Sync é desabilitado por padrão no runtime. Para ativá-lo, inicie o `mysqld` com a opção `--debug-sync-timeout=N`, onde *`N`* é um valor de timeout maior que 0. (O valor padrão é 0, o que desabilita o Debug Sync.) *`N`* se torna o timeout padrão para pontos de sincronização individuais.

A verificação de sincronização do debug para o mecanismo de armazenamento `InnoDB` está disponível quando o suporte de depuração é compilado com a opção `WITH_DEBUG`.

Para uma descrição da facilidade Debug Sync e de como usar pontos de sincronização, consulte MySQL Internals: Test Synchronization.
*  `-DWITH_EDITLINE=value`

  Qual biblioteca `libedit`/`editline` usar. Os valores permitidos são `bundled` (o padrão) e `system`.
*  `-DWITH_ICU={icu_type|path_name}`

  O MySQL usa Componentes Internacionais para Unicode (ICU) para suportar operações de expressão regular. A opção `WITH_ICU` indica o tipo de suporte ICU a incluir ou o nome do caminho da instalação do ICU a ser usado.

  + *`icu_type`* pode ser um dos seguintes valores:

- `bundled`: Use a biblioteca ICU empacotada com a distribuição. Este é o padrão e é a única opção suportada para o Windows.
  + *`path_name`* é o nome do caminho para a instalação do ICU a ser usada. Isso pode ser preferível ao usar o valor *`icu_type`* de `system` porque pode evitar que o CMake detecte e use uma versão mais antiga ou incorreta do ICU instalada no sistema. (Outra maneira permitida de fazer a mesma coisa é definir `WITH_ICU` para `system` e definir a opção `CMAKE_PREFIX_PATH` para *`path_name`*.)
*  `-DWITH_INNODB_EXTRA_DEBUG=bool`

  Se incluir suporte extra para depuração do InnoDB.

  Ativação de `WITH_INNODB_EXTRA_DEBUG` aciona verificações de depuração extras do InnoDB. Esta opção só pode ser habilitada quando `WITH_DEBUG` está habilitado.
*  `-DWITH_JEMALLOC=bool`

  Se vincular com `-ljemalloc`. Se habilitado, as rotinas integradas `malloc()`, `calloc()`, `realloc()`, e `free()` são desabilitadas. O padrão é `OFF`.

   `WITH_JEMALLOC` e `WITH_TCMALLOC` são mutuamente exclusivos.
*  `-DWITH_LIBEVENT=string`

  Qual biblioteca `libevent` usar. Os valores permitidos são `bundled` (padrão) e `system`. Se `system` for especificado e nenhuma biblioteca `libevent` do sistema puder ser encontrada, um erro ocorrerá independentemente, e a biblioteca `libevent` empacotada não é usada.

  A biblioteca `libevent` é necessária pelo X Plugin e pelo MySQL Router.
*  `-DWITH_LIBWRAP=bool`

  Se incluir suporte para `libwrap` (envoltórios TCP).
*  `-DWITH_LOCK_ORDER=bool`

  Se habilitar a ferramenta LOCK_ORDER. Por padrão, esta opção está desabilitada e as compilações do servidor não contêm ferramentas. Se a ferramenta for habilitada, a ferramenta LOCK_ORDER estará disponível e pode ser usada conforme descrito na Seção 7.9.3, “A Ferramenta LOCK_ORDER”.

  ::: info Nota

  Com a opção `WITH_LOCK_ORDER` habilitada, as compilações do MySQL requerem o programa `flex`.

  :::

Se habilitar o otimizador de link-time, se o compilador o suportar. O padrão é `OFF`, a menos que `FPROFILE_USE` esteja habilitado.
*  `-DWITH_LZ4=lz4_type`

  A opção `WITH_LZ4` indica a fonte do suporte ao `zlib`:

  + `bundled`: Use a biblioteca `lz4` incluída na distribuição. Este é o padrão.
  + `system`: Use a biblioteca `lz4` do sistema.
*  `-DWITH_MECAB={disabled|system|path_name}`

  Use esta opção para compilar o analisador MeCab. Se você instalou o MeCab no diretório de instalação padrão, defina `-DWITH_MECAB=system`. A opção `system` aplica-se a instalações do MeCab realizadas a partir de fontes ou de binários usando uma ferramenta de gerenciamento de pacotes nativa. Se você instalou o MeCab em um diretório de instalação personalizado, especifique o caminho para a instalação do MeCab, por exemplo, `-DWITH_MECAB=/opt/mecab`. Se a opção `system` não funcionar, especificar o caminho de instalação do MeCab deve funcionar em todos os casos.

*  `-DWITH_MSAN=bool`

  Se habilitar o MemorySanitizer, para compiladores que o suportam. O padrão é `OFF`.

  Para que esta opção tenha efeito se habilitada, todas as bibliotecas vinculadas ao MySQL também devem ter sido compiladas com a opção habilitada.
*  `-DWITH_MSCRT_DEBUG=bool`

  Se habilitar a rastreamento de vazamentos de memória do CRT do Visual Studio. O padrão é `OFF`.
*  `-DMSVC_CPPCHECK=bool`

  Se habilitar a análise de código do MSVC. O padrão é `ON`.
*  `-DWITH_MYSQLX=bool`

  Se compilar com suporte para o Plugin X. O padrão é `ON`. Veja  Capítulo 22, *Usando o MySQL como uma Armazenamento de Documentos*.
*  `-DWITH_NUMA=bool`

  Defina explicitamente a política de alocação de memória NUMA. O `CMake` define o valor padrão `WITH_NUMA` com base se a plataforma atual tem suporte `NUMA`. Para plataformas sem suporte `NUMA`, o `CMake` se comporta da seguinte forma:

+ Sem a opção NUMA (o caso normal), o `CMake` continua normalmente, produzindo apenas este aviso: biblioteca NUMA ausente ou versão exigida não disponível.
+ Com `-DWITH_NUMA=ON`, o `CMake` interrompe com este erro: biblioteca NUMA ausente ou versão exigida não disponível.
*  `-DWITH_PACKAGE_FLAGS=bool`

  Para as flags tipicamente usadas para pacotes RPM e Debian, se devem ser adicionadas às compilações independentes nessas plataformas. O padrão é `ON` para compilações não de depuração.
*  `-DWITH_PROTOBUF=protobuf_type`

  Qual pacote de Protocol Buffers usar. *`protobuf_type`* pode ser um dos seguintes valores:

  + `bundled`: Use o pacote empacotado com a distribuição. Este é o padrão. Opcionalmente, use `INSTALL_PRIV_LIBDIR` para modificar o diretório dinâmico da biblioteca Protobuf.
  + `system`: Use o pacote instalado no sistema.
  
Outros valores são ignorados, com um fallback para `bundled`.
*  `-DWITH_RAPID=bool`

  Se devem ser compiladas as extensões do ciclo de desenvolvimento rápido. Quando habilitado, um diretório `rapid` é criado na árvore de compilação contendo essas extensões. Quando desabilitado, nenhum diretório `rapid` é criado na árvore de compilação. O padrão é `ON`, a menos que o diretório `rapid` seja removido da árvore de origem, caso em que o padrão se torna `OFF`.
*  `-DWITH_RAPIDJSON=rapidjson_type`

  O tipo de suporte da biblioteca RapidJSON a ser incluído. *`rapidjson_type`* pode ser um dos seguintes valores:

  + `bundled`: Use a biblioteca RapidJSON empacotada com a distribuição. Este é o padrão.
  + `system`: Use a biblioteca RapidJSON do sistema. A versão 1.1.0 ou posterior é necessária.
*  `-DWITH_ROUTER=bool`

  Se devem ser compiladas as extensões do MySQL Router. O padrão é `ON`.
*  `-DWITH_SASL=value`

  Uso interno apenas. Não suportado no Windows.
*  `-DWITH_SSL={ssl_type|path_name}`

  Para suporte de conexões criptografadas, entropia para geração de números aleatórios e outras operações relacionadas à criptografia, o MySQL deve ser compilado usando uma biblioteca SSL. Esta opção especifica qual biblioteca SSL usar.

+ `ssl_type` pode ser um dos seguintes valores:

    - `system`: Use a biblioteca OpenSSL do sistema. Este é o valor padrão.

      No macOS e no Windows, usar `system` configura o MySQL para ser compilado como se o CMake tivesse sido invocado com `path_name` apontando para uma biblioteca OpenSSL instalada manualmente. Isso ocorre porque eles não têm bibliotecas SSL do sistema. No macOS, *brew install openssl* é instalado em `/usr/local/opt/openssl` para que `system` possa encontrá-lo. No Windows, ele verifica `%ProgramFiles%/OpenSSL`, `%ProgramFiles%/OpenSSL-Win32`, `%ProgramFiles%/OpenSSL-Win64`, `C:/OpenSSL`, `C:/OpenSSL-Win32` e `C:/OpenSSL-Win64`.
    - `yes`: Este é um sinônimo de `system`.
    - `opensslversion`: Use um pacote de sistema OpenSSL alternativo, como `openssl11` no EL7, ou `openssl3` (ou `openssl3-fips`) no EL8.

      Plugins de autenticação, como LDAP e Kerberos, são desativados, pois não suportam essas versões alternativas do OpenSSL.
  + `path_name` é o nome do caminho para a instalação do OpenSSL a ser usada. Isso pode ser preferível ao usar o valor `system` de `ssl_type`, pois pode impedir que o CMake detecte e use uma versão do OpenSSL mais antiga ou incorreta instalada no sistema. (Outra maneira permitida de fazer a mesma coisa é definir `WITH_SSL` para `system` e definir a opção `CMAKE_PREFIX_PATH` para `path_name`.)

*  `-DWITH_SHOW_PARSE_TREE=bool`

  Habilita o suporte para `SHOW PARSE_TREE` no servidor, usado apenas em desenvolvimento e depuração. Não é usado para builds de lançamento ou suportado em produção.
*  `-DWITH_SYSTEMD=bool`

  Se habilitar a instalação de arquivos de suporte `systemd`. Por padrão, esta opção está desabilitada. Quando habilitada, os arquivos de suporte `systemd` são instalados, e scripts como `mysqld_safe` e o script de inicialização System V não são instalados. Em plataformas onde `systemd` não está disponível, habilitar `WITH_SYSTEMD` resulta em um erro do `CMake`.

Quando o servidor foi construído usando essa opção, o MySQL inclui todas as mensagens do `systemd` no log de erro do servidor (veja a Seção 7.4.2, “O Log de Erro”).

Para obter mais informações sobre o uso do `systemd`, consulte a Seção 2.5.9, “Gerenciamento do Servidor MySQL com systemd”. Essa seção também inclui informações sobre a especificação de opções que não são especificadas explicitamente nos grupos de opções `[mysqld_safe]`. Como o `mysqld_safe` não é instalado quando o `systemd` é usado, essas opções devem ser especificadas de outra forma.
*  `-DWITH_SYSTEM_LIBS=bool`

Esta opção serve como uma opção “guarda-chuva” para definir o valor `system` de qualquer uma das seguintes opções do `CMake` que não são definidas explicitamente: `WITH_CURL`, `WITH_EDITLINE`, `WITH_ICU`, `WITH_LIBEVENT`, `WITH_LZ4`, `WITH_LZMA`, `WITH_PROTOBUF`, `WITH_RE2`, `WITH_SSL`, `WITH_ZLIB`, `WITH_ZSTD`.
*  `-DWITH_SYSTEMD_DEBUG=bool`

Se produzir informações de depuração adicionais do `systemd`, para plataformas em que o `systemd` é usado para executar o MySQL. O padrão é `OFF`.
*  `-DWITH_TCMALLOC=bool`

Se vincular com `-ltcmalloc`. Se habilitado, as rotinas integradas `malloc()`, `calloc()`, `realloc()` e `free()` são desabilitadas. O padrão é `OFF`.

A partir do MySQL 8.4.1, uma biblioteca `tcmalloc` é incluída na fonte; você pode fazer com que a compilação use a versão incluída configurando essa opção para `BUNDLED`. `BUNDLED` é suportado apenas em sistemas Linux.

`WITH_TCMALLOC` e `WITH_JEMALLOC` são mutuamente exclusivas.
*  `-DWITH_TEST_TRACE_PLUGIN=bool`

Se deseja construir o plugin de registro de protocolo de teste do cliente (consulte Usar o plugin de registro de protocolo de teste). Por padrão, essa opção está desabilitada. Ativação dessa opção não tem efeito, a menos que a opção `WITH_CLIENT_PROTOCOL_TRACING` esteja habilitada. Se o MySQL estiver configurado com ambas as opções habilitadas, a biblioteca de clientes `libmysqlclient` será construída com o plugin de registro de protocolo de teste embutido e todos os clientes padrão do MySQL carregarão o plugin. No entanto, mesmo quando o plugin de teste estiver habilitado, ele não tem efeito por padrão. O controle do plugin é concedido usando variáveis de ambiente; consulte Usar o plugin de registro de protocolo de teste.

::: info Nota

Não habilite a opção `WITH_TEST_TRACE_PLUGIN` se quiser usar seus próprios plugins de registro de protocolo, pois apenas um desses plugins pode ser carregado por vez e ocorrerá um erro para tentativas de carregar um segundo. Se você já construiu o MySQL com o plugin de registro de protocolo de teste habilitado para ver como ele funciona, você deve reconstruir o MySQL sem ele antes de poder usar seus próprios plugins.

:::

Para informações sobre como escrever plugins de registro, consulte Escrever plugins de registro de protocolo.
* `-DWITH_TSAN=bool`

Se deseja habilitar o ThreadSanitizer, para compiladores que o suportam. O padrão é desativado.
* `-DWITH_UBSAN=bool`

Se deseja habilitar o Undefined Behavior Sanitizer, para compiladores que o suportam. O padrão é desativado.
* `-DWITH_UNIT_TESTS={ON|OFF}`

Se habilitado, compile o MySQL com testes unitários. O padrão é `ON`, a menos que o servidor não esteja sendo compilado.
* `-DWITH_UNIXODBC=1`

Habilita o suporte unixODBC, para Connector/ODBC.
* `-DWITH_VALGRIND=bool`

Se deseja compilar os arquivos de cabeçalho do Valgrind, que expõe a API do Valgrind ao código do MySQL. O padrão é `OFF`.

Para gerar uma compilação de depuração consciente do Valgrind, `-DWITH_VALGRIND=1` normalmente é combinado com `-DWITH_DEBUG=1`. Consulte Construção de configurações de depuração.
* `-DWITH_WIN_JEMALLOC=string`

Em Windows, forneça um caminho para um diretório que contenha `jemalloc.dll` para habilitar a funcionalidade do jemalloc. O sistema de compilação copia `jemalloc.dll` para o mesmo diretório que `mysqld.exe` e/ou `mysqld-debug.exe` e utiliza-o para operações de gerenciamento de memória. As funções de memória padrão são usadas se `jemalloc.dll` não for encontrado ou não exportar as funções necessárias. Uma mensagem de log de nível INFORMÁTICO registra se o jemalloc é encontrado e usado ou não.

Esta opção está habilitada para os binários oficiais do MySQL para Windows.
*  `-DWITH_ZLIB=zlib_type`

Algumas funcionalidades exigem que o servidor seja compilado com suporte à biblioteca de compressão, como as funções `COMPRESS()` e `UNCOMPRESS()`, e a compressão do protocolo cliente/servidor. A opção `WITH_ZLIB` indica a fonte do suporte ao `zlib`:

A versão mínima suportada do `zlib` é 1.2.13.

+ `bundled`: Use a biblioteca `zlib` incluída na distribuição. Este é o padrão.
+ `system`: Use a biblioteca `zlib` do sistema.
*  `-DWITH_ZSTD=zstd_type`

A compressão da conexão usando o algoritmo `zstd` (consulte a Seção 6.2.8, “Controle de Compressão de Conexão”) requer que o servidor seja compilado com suporte à biblioteca `zstd`. A opção `WITH_ZSTD` indica a fonte do suporte ao `zstd`:

+ `bundled`: Use a biblioteca `zstd` incluída na distribuição. Este é o padrão.
+ `system`: Use a biblioteca `zstd` do sistema.
*  `-DWITHOUT_SERVER=bool`

Se compilar sem o MySQL Server. O padrão é OFF, o que compilará o servidor.

Esta é considerada uma opção experimental; é preferível compilar com o servidor.

Esta opção também impede a compilação do motor de armazenamento `NDB` ou de quaisquer binários `NDB`, incluindo programas de gerenciamento e nó de dados.

#### Finais do Compilador

*  `-DCMAKE_C_FLAGS="flags"`

Finais para o compilador C.
*  `-DCMAKE_CXX_FLAGS="flags"`

Finais para o compilador C++.
*  `-DWITH_DEFAULT_COMPILER_OPTIONS=bool`

Se usar as flags do `cmake/build_configurations/compiler_options.cmake`.

::: info Nota

Todas as flags de otimização são cuidadosamente escolhidas e testadas pela equipe de compilação do MySQL. A supressão delas pode levar a resultados inesperados e é feita por sua conta e risco.

:::

*  `-DOPTIMIZE_SANITIZER_BUILDS=bool`

Se adicionar `-O1 -fno-inline` às compilações do sanitizador. O padrão é `ON`.

Para especificar suas próprias flags do compilador C e C++, para flags que não afetam a otimização, use as opções `CMAKE_C_FLAGS` e `CMAKE_CXX_FLAGS` do CMake.

Ao fornecer suas próprias flags do compilador, você pode querer especificar `CMAKE_BUILD_TYPE` também.

Por exemplo, para criar uma compilação de versão de 32 bits em uma máquina Linux de 64 bits, faça isso:

```
$> mkdir build
$> cd build
$> cmake .. -DCMAKE_C_FLAGS=-m32 
  -DCMAKE_CXX_FLAGS=-m32 
  -DCMAKE_BUILD_TYPE=RelWithDebInfo
```

Se você definir flags que afetam a otimização ( `-Onumber` ), você deve definir as opções `CMAKE_C_FLAGS_build_type` e/ou `CMAKE_CXX_FLAGS_build_type`, onde `build_type` corresponde ao valor de `CMAKE_BUILD_TYPE`. Para especificar uma otimização diferente para o tipo de compilação padrão (`RelWithDebInfo`), defina as opções `CMAKE_C_FLAGS_RELWITHDEBINFO` e `CMAKE_CXX_FLAGS_RELWITHDEBINFO`. Por exemplo, para compilar no Linux com `-O3` e com símbolos de depuração, faça isso:

```
$> cmake .. -DCMAKE_C_FLAGS_RELWITHDEBINFO="-O3 -g" 
  -DCMAKE_CXX_FLAGS_RELWITHDEBINFO="-O3 -g"
```

#### Opções do CMake para Compilar o NDB Cluster

Para compilar com suporte para o NDB Cluster, você pode usar `-DWITH_NDB`, o que faz com que a compilação inclua o motor de armazenamento NDB e todos os programas NDB. Esta opção está habilitada por padrão. Para evitar a compilação do plugin do motor de armazenamento NDB, use `-DWITH_NDBCLUSTER_STORAGE_ENGINE=OFF`. Outros aspectos da compilação podem ser controlados usando as outras opções listadas nesta seção.

As seguintes opções se aplicam ao compilar as fontes do MySQL com suporte para o NDB Cluster.

*  `-DNDB_UTILS_LINK_DYNAMIC={ON|OFF}`

Controla se as utilidades do NDB, como `ndb_drop_table`, são vinculadas ao `ndbclient` de forma estática (`OFF`) ou dinâmica (`ON`); a vinculação estática (`OFF`) é a padrão. Normalmente, a vinculação estática é usada ao compilar essas utilidades para evitar problemas com o `LD_LIBRARY_PATH` ou quando múltiplas versões do `ndbclient` estão instaladas. Esta opção é destinada à criação de imagens Docker e, possivelmente, outros casos em que o ambiente de destino está sujeito a um controle preciso e é desejável reduzir o tamanho da imagem.
*  `-DWITH_CLASSPATH=caminho`

  Define o caminho do classpath para a construção do Conector do NDB Cluster do MySQL para Java. O padrão é vazio. Esta opção é ignorada se `-DWITH_NDB_JAVA=OFF` for usada.
*  `-DWITH_ERROR_INSERT={ON|OFF}`

  Habilita a injeção de erros no kernel `NDB`. Apenas para testes; não é destinado ao uso na construção de binários de produção. O padrão é `OFF`.
*  `-DWITH_NDB={ON|OFF}`

  Construir o MySQL NDB Cluster; construir o plugin NDB e todos os programas do NDB Cluster.
*  `-DWITH_NDBAPI_EXAMPLES={ON|OFF}`

  Construir programas de exemplo do API NDB em `storage/ndb/ndbapi-examples/`. Consulte Exemplos do API NDB para informações sobre esses.
*  `-DWITH_NDBCLUSTER_STORAGE_ENGINE={ON|OFF}`

  Controla (apenas) se o motor de armazenamento `NDBCLUSTER` é incluído na construção; `WITH_NDB` habilita essa opção automaticamente, portanto, é recomendável que você use `WITH_NDB` em vez disso.
*  `-DWITH_NDBCLUSTER={ON|OFF}` (DESUSO)

  Construir e vincular o suporte para o motor de armazenamento `NDB` no `mysqld`.

  Esta opção está desatualizada e sujeita à eventual remoção; use `WITH_NDB` em vez disso.
*  `-DWITH_NDBMTD={ON|OFF}`

  Construir o executável do nó de dados multithread `ndbmtd`. O padrão é `ON`.
*  `-DWITH_NDB_DEBUG={ON|OFF}`

  Habilitar a construção das versões de depuração dos binários do NDB Cluster. Isso é `OFF` por padrão.
*  `-DWITH_NDB_JAVA={ON|OFF}`

  Habilitar a construção do NDB Cluster com suporte para Java, incluindo suporte para ClusterJ (consulte Conector do NDB Cluster do MySQL para Java).

Esta opção está ativada por padrão. Se você não deseja compilar o NDB Cluster com suporte ao Java, deve desabilitá-lo explicitamente especificando `-DWITH_NDB_JAVA=OFF` ao executar o `CMake`. Caso contrário, se o Java não for encontrado, a configuração da compilação falha.
*  `-DWITH_NDB_PORT=port`

  Faz com que o servidor de gerenciamento do NDB Cluster (`ndb_mgmd`) que é compilado use essa `port` por padrão. Se esta opção não for definida, o servidor de gerenciamento resultante tenta usar a porta 1186 por padrão.
*  `-DWITH_NDB_TEST={ON|OFF}`

  Se ativado, inclua um conjunto de programas de teste da API NDB. O padrão é `OFF`.
*  `-DWITH_NDB_TLS_SEARCH_PATH=path`

  Defina o caminho padrão pesquisado pelo `ndb_sign_keys` e outros programas `NDB` para arquivos de certificados e chaves TLS.

  O padrão para plataformas Windows é `$HOMEDIR/ndb-tls`; para outras plataformas, como Linux, é `$HOME/ndb-tls`.