### 2.8.7 Opções de Configuração da Fonte MySQL

O programa **CMake** oferece um grande controle sobre como você configura uma distribuição de código-fonte (source distribution) do MySQL. Tipicamente, isso é feito usando opções na linha de comando do **CMake**. Para obter informações sobre as opções suportadas pelo **CMake**, execute um destes comandos no diretório raiz do código-fonte (top-level source directory):

```sql
$> cmake . -LH

$> ccmake .
```

Você também pode afetar o **CMake** usando certas environment variables. Consulte a Seção 4.9, “Environment Variables”.

Para opções booleanas, o valor pode ser especificado como `1` ou `ON` para habilitar a opção, ou como `0` ou `OFF` para desabilitar a opção.

Muitas opções configuram defaults de tempo de compilação que podem ser sobrescritos na inicialização do server. Por exemplo, as opções `CMAKE_INSTALL_PREFIX`, `MYSQL_TCP_PORT` e `MYSQL_UNIX_ADDR`, que configuram a localização padrão do diretório base de instalação, o número da porta TCP/IP e o arquivo de socket Unix, podem ser alteradas na inicialização do server com as opções `--basedir`, `--port` e `--socket` para o **mysqld**. Onde aplicável, as descrições das opções de configuração indicam a opção de inicialização do **mysqld** correspondente.

As seções a seguir fornecem mais informações sobre as opções do **CMake**.

* Referência de Opções do CMake
* Opções Gerais
* Opções de Layout de Instalação
* Opções de Storage Engine
* Opções de Funcionalidade
* Compiler Flags
* Opções do CMake para Compilação do NDB Cluster

#### Referência de Opções do CMake

A tabela a seguir mostra as opções disponíveis do **CMake**. Na coluna `Padrão`, `PREFIX` representa o valor da opção `CMAKE_INSTALL_PREFIX`, que especifica o diretório base de instalação. Este valor é usado como a localização pai para vários dos subdiretórios de instalação.

**Tabela 2.14 Referência de Opções de Configuração da Fonte MySQL (CMake)**

<table frame="box" rules="all" summary="Opções do CMake que estão disponíveis para configurar o MySQL ao fazer o build a partir do código-fonte.">
   <col style="width: 30%"/>
   <col style="width: 30%"/>
   <col style="width: 20%"/>
   <col style="width: 10%"/>
   <col style="width: 10%"/>
   <thead>
      <tr>
         <th>Formatos</th>
         <th>Descrição</th>
         <th>Padrão</th>
         <th>Introduzido</th>
         <th>Removido</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <th><code>BUILD_CONFIG</code></th>
         <td>Usar as mesmas opções de build que os lançamentos oficiais</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>CMAKE_BUILD_TYPE</code></th>
         <td>Tipo de build a ser produzido</td>
         <td><code>RelWithDebInfo</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>CMAKE_CXX_FLAGS</code></th>
         <td>Flags para o C++ Compiler</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>CMAKE_C_FLAGS</code></th>
         <td>Flags para o C Compiler</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>CMAKE_INSTALL_PREFIX</code></th>
         <td>Diretório base de instalação</td>
         <td><code>/usr/local/mysql</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>COMPILATION_COMMENT</code></th>
         <td>Comentário sobre o ambiente de compilação</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>CPACK_MONOLITHIC_INSTALL</code></th>
         <td>Se o build do pacote produz um único arquivo</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DEFAULT_CHARSET</code></th>
         <td>O character set padrão do server</td>
         <td><code>latin1</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DEFAULT_COLLATION</code></th>
         <td>O collation padrão do server</td>
         <td><code>latin1_swedish_ci</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_COND</code></th>
         <td>Excluir a instrumentation de condição do Performance Schema</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_FILE</code></th>
         <td>Excluir a instrumentation de arquivo do Performance Schema</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_IDLE</code></th>
         <td>Excluir a instrumentation de idle do Performance Schema</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_MEMORY</code></th>
         <td>Excluir a instrumentation de memória do Performance Schema</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_METADATA</code></th>
         <td>Excluir a instrumentation de metadata do Performance Schema</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_MUTEX</code></th>
         <td>Excluir a instrumentation de mutex do Performance Schema</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_PS</code></th>
         <td>Excluir os prepared statements do Performance Schema</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_RWLOCK</code></th>
         <td>Excluir a instrumentation de rwlock do Performance Schema</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_SOCKET</code></th>
         <td>Excluir a instrumentation de socket do Performance Schema</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_SP</code></th>
         <td>Excluir a instrumentation de stored program do Performance Schema</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_STAGE</code></th>
         <td>Excluir a instrumentation de stage do Performance Schema</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_STATEMENT</code></th>
         <td>Excluir a instrumentation de statement do Performance Schema</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_STATEMENT_DIGEST</code></th>
         <td>Excluir a instrumentation de statements_digest do Performance Schema</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_TABLE</code></th>
         <td>Excluir a instrumentation de table do Performance Schema</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_THREAD</code></th>
         <td>Excluir a instrumentation de thread do Performance Schema</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_TRANSACTION</code></th>
         <td>Excluir a instrumentation de transaction do Performance Schema</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DOWNLOAD_BOOST</code></th>
         <td>Se deve baixar a biblioteca Boost</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DOWNLOAD_BOOST_TIMEOUT</code></th>
         <td>Timeout em segundos para baixar a biblioteca Boost</td>
         <td><code>600</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>ENABLED_LOCAL_INFILE</code></th>
         <td>Se deve habilitar LOCAL para LOAD DATA</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>ENABLED_PROFILING</code></th>
         <td>Se deve habilitar o código de Query profiling</td>
         <td><code>ON</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>ENABLE_DOWNLOADS</code></th>
         <td>Se deve baixar arquivos opcionais</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>ENABLE_DTRACE</code></th>
         <td>Se deve incluir suporte DTrace</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>ENABLE_GCOV</code></th>
         <td>Se deve incluir suporte gcov</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>ENABLE_GPROF</code></th>
         <td>Habilitar gprof (apenas builds Linux otimizados)</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>FORCE_UNSUPPORTED_COMPILER</code></th>
         <td>Se deve permitir Compilers não suportados</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>IGNORE_AIO_CHECK</code></th>
         <td>Com -DBUILD_CONFIG=mysql_release, ignorar a checagem libaio</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTALL_BINDIR</code></th>
         <td>Diretório de executáveis do usuário</td>
         <td><code>PREFIX/bin</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTALL_DOCDIR</code></th>
         <td>Diretório de documentação</td>
         <td><code>PREFIX/docs</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTALL_DOCREADMEDIR</code></th>
         <td>Diretório de arquivo README</td>
         <td><code>PREFIX</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTALL_INCLUDEDIR</code></th>
         <td>Diretório de arquivo Header</td>
         <td><code>PREFIX/include</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTALL_INFODIR</code></th>
         <td>Diretório de arquivo Info</td>
         <td><code>PREFIX/docs</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTALL_LAYOUT</code></th>
         <td>Selecionar layout de instalação predefinido</td>
         <td><code>STANDALONE</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTALL_LIBDIR</code></th>
         <td>Diretório de arquivo Library</td>
         <td><code>PREFIX/lib</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTALL_MANDIR</code></th>
         <td>Diretório de manual page</td>
         <td><code>PREFIX/man</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTALL_MYSQLKEYRINGDIR</code></th>
         <td>Diretório para o arquivo de dados do Plugin keyring_file</td>
         <td><code>platform specific</code></td>
         <td>5.7.11</td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTALL_MYSQLSHAREDIR</code></th>
         <td>Diretório de dados compartilhados</td>
         <td><code>PREFIX/share</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTALL_MYSQLTESTDIR</code></th>
         <td>Diretório mysql-test</td>
         <td><code>PREFIX/mysql-test</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTALL_PKGCONFIGDIR</code></th>
         <td>Diretório para o arquivo pkg-config mysqlclient.pc</td>
         <td><code>INSTALL_LIBDIR/pkgconfig</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTALL_PLUGINDIR</code></th>
         <td>Diretório de Plugin</td>
         <td><code>PREFIX/lib/plugin</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTALL_SBINDIR</code></th>
         <td>Diretório do executável do Server</td>
         <td><code>PREFIX/bin</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTALL_SCRIPTDIR</code></th>
         <td>Diretório de Scripts</td>
         <td><code>PREFIX/scripts</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTALL_SECURE_FILE_PRIVDIR</code></th>
         <td>Valor padrão de secure_file_priv</td>
         <td><code>platform specific</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTALL_SECURE_FILE_PRIV_EMBEDDEDDIR</code></th>
         <td>Valor padrão de secure_file_priv para libmysqld</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTALL_SHAREDIR</code></th>
         <td>Diretório de instalação de aclocal/mysql.m4</td>
         <td><code>PREFIX/share</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTALL_SUPPORTFILESDIR</code></th>
         <td>Diretório de arquivos de suporte extra</td>
         <td><code>PREFIX/support-files</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>MAX_INDEXES</code></th>
         <td>Número máximo de Indexes por table</td>
         <td><code>64</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>MEMCACHED_HOME</code></th>
         <td>Caminho para o memcached; obsoleto</td>
         <td><code>[none]</code></td>
         <td></td>
         <td>5.7.33</td>
      </tr>
      <tr>
         <th><code>MUTEX_TYPE</code></th>
         <td>Tipo de mutex do InnoDB</td>
         <td><code>event</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>MYSQLX_TCP_PORT</code></th>
         <td>Número da porta TCP/IP usada pelo X Plugin</td>
         <td><code>33060</code></td>
         <td>5.7.17</td>
         <td></td>
      </tr>
      <tr>
         <th><code>MYSQLX_UNIX_ADDR</code></th>
         <td>Arquivo de Socket Unix usado pelo X Plugin</td>
         <td><code>/tmp/mysqlx.sock</code></td>
         <td>5.7.15</td>
         <td></td>
      </tr>
      <tr>
         <th><code>MYSQL_DATADIR</code></th>
         <td>Diretório de dados</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>MYSQL_MAINTAINER_MODE</code></th>
         <td>Se deve habilitar o ambiente de desenvolvimento específico para o mantenedor do MySQL</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>MYSQL_PROJECT_NAME</code></th>
         <td>Nome do projeto Windows/macOS</td>
         <td><code>MySQL</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>MYSQL_TCP_PORT</code></th>
         <td>Número da porta TCP/IP</td>
         <td><code>3306</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>MYSQL_UNIX_ADDR</code></th>
         <td>Arquivo de Socket Unix</td>
         <td><code>/tmp/mysql.sock</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>ODBC_INCLUDES</code></th>
         <td>Diretório de includes do ODBC</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>ODBC_LIB_DIR</code></th>
         <td>Diretório da Library ODBC</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>OPTIMIZER_TRACE</code></th>
         <td>Se deve suportar o Optimizer tracing</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>REPRODUCIBLE_BUILD</code></th>
         <td>Tomar cuidado extra para criar um resultado de build independente da localização e do tempo do build</td>
         <td></td>
         <td>5.7.19</td>
         <td></td>
      </tr>
      <tr>
         <th><code>SUNPRO_CXX_LIBRARY</code></th>
         <td>Client link library no Solaris 10+</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>SYSCONFDIR</code></th>
         <td>Diretório de arquivo de opção</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>SYSTEMD_PID_DIR</code></th>
         <td>Diretório para o arquivo PID sob o systemd</td>
         <td><code>/var/run/mysqld</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>SYSTEMD_SERVICE_NAME</code></th>
         <td>Nome do serviço MySQL sob o systemd</td>
         <td><code>mysqld</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>TMPDIR</code></th>
         <td>Valor padrão de tmpdir</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WIN_DEBUG_NO_INLINE</code></th>
         <td>Se deve desabilitar o function inlining</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITHOUT_SERVER</code></th>
         <td>Não fazer o build do server; uso interno apenas</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITHOUT_xxx_STORAGE_ENGINE</code></th>
         <td>Excluir o storage engine xxx do build</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_ASAN</code></th>
         <td>Habilitar AddressSanitizer</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_ASAN_SCOPE</code></th>
         <td>Habilitar a flag AddressSanitizer -fsanitize-address-use-after-scope Clang</td>
         <td><code>OFF</code></td>
         <td>5.7.21</td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_AUTHENTICATION_LDAP</code></th>
         <td>Se deve reportar um erro se os Plugins de autenticação LDAP não puderem ser construídos</td>
         <td><code>OFF</code></td>
         <td>5.7.19</td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_AUTHENTICATION_PAM</code></th>
         <td>Fazer o build do Plugin de autenticação PAM</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_AWS_SDK</code></th>
         <td>Localização do software development kit da Amazon Web Services</td>
         <td></td>
         <td>5.7.19</td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_BOOST</code></th>
         <td>A localização das fontes da biblioteca Boost</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_BUNDLED_LIBEVENT</code></th>
         <td>Usar libevent empacotada ao fazer o build do ndbmemcache; obsoleto</td>
         <td><code>ON</code></td>
         <td></td>
         <td>5.7.33</td>
      </tr>
      <tr>
         <th><code>WITH_BUNDLED_MEMCACHED</code></th>
         <td>Usar memcached empacotado ao fazer o build do ndbmemcache; obsoleto</td>
         <td><code>ON</code></td>
         <td></td>
         <td>5.7.33</td>
      </tr>
      <tr>
         <th><code>WITH_CLASSPATH</code></th>
         <td>Classpath a ser usado ao fazer o build do MySQL Cluster Connector for Java. O padrão é uma string vazia.</td>
         <td><code></code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_CLIENT_PROTOCOL_TRACING</code></th>
         <td>Fazer o build do framework de protocolo tracing do lado do Client</td>
         <td><code>ON</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_CURL</code></th>
         <td>Localização da library curl</td>
         <td></td>
         <td>5.7.19</td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_DEBUG</code></th>
         <td>Se deve incluir suporte a debugging</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_DEFAULT_COMPILER_OPTIONS</code></th>
         <td>Se deve usar as opções padrão do Compiler</td>
         <td><code>ON</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_DEFAULT_FEATURE_SET</code></th>
         <td>Se deve usar o conjunto de funcionalidades padrão</td>
         <td><code>ON</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_EDITLINE</code></th>
         <td>Qual library libedit/editline usar</td>
         <td><code>bundled</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_EMBEDDED_SERVER</code></th>
         <td>Se deve fazer o build do embedded server</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_EMBEDDED_SHARED_LIBRARY</code></th>
         <td>Se deve fazer o build de uma embedded server shared library</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_ERROR_INSERT</code></th>
         <td>Habilitar injeção de erro no storage engine NDB. Não deve ser usado para fazer o build de binários destinados à produção.</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_EXTRA_CHARSETS</code></th>
         <td>Quais character sets extras incluir</td>
         <td><code>all</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_GMOCK</code></th>
         <td>Caminho para a distribuição googlemock</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_INNODB_EXTRA_DEBUG</code></th>
         <td>Se deve incluir suporte extra a debugging para InnoDB.</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_INNODB_MEMCACHED</code></th>
         <td>Se deve gerar shared libraries do memcached.</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_KEYRING_TEST</code></th>
         <td>Fazer o build do programa de teste keyring</td>
         <td><code>OFF</code></td>
         <td>5.7.11</td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_LDAP</code></th>
         <td>Uso interno apenas</td>
         <td></td>
         <td>5.7.29</td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_LIBEVENT</code></th>
         <td>Qual library libevent usar</td>
         <td><code>bundled</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_LIBWRAP</code></th>
         <td>Se deve incluir suporte libwrap (TCP wrappers)</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_LZ4</code></th>
         <td>Tipo de suporte à library LZ4</td>
         <td><code>bundled</code></td>
         <td>5.7.14</td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_MECAB</code></th>
         <td>Compila MeCab</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_MSAN</code></th>
         <td>Habilitar MemorySanitizer</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_MSCRT_DEBUG</code></th>
         <td>Habilitar tracing de memory leak do Visual Studio CRT</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_NDBAPI_EXAMPLES</code></th>
         <td>Fazer o build dos programas de exemplo da API.</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_NDBCLUSTER</code></th>
         <td>NDB 8.0.30 e anteriores: Fazer o build do storage engine NDB. NDB 8.0.31 e posteriores: Obsoleto; usar WITH_NDB em vez disso</td>
         <td><code>ON</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_NDBCLUSTER_STORAGE_ENGINE</code></th>
         <td>Anterior ao NDB 8.0.31, era apenas para uso interno. NDB 8.0.31 e posteriores: alterna (apenas) a inclusão do storage engine NDBCLUSTER</td>
         <td><code>ON</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_NDBMTD</code></th>
         <td>Fazer o build do binário de nó de dados multithreaded</td>
         <td><code>ON</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_NDB_BINLOG</code></th>
         <td>Habilitar binary logging por padrão pelo mysqld.</td>
         <td><code>ON</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_NDB_DEBUG</code></th>
         <td>Produzir um build de debug para teste ou solução de problemas.</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_NDB_JAVA</code></th>
         <td>Habilitar o build de suporte Java e ClusterJ. Habilitado por padrão. Suportado apenas no MySQL Cluster.</td>
         <td><code>ON</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_NDB_PORT</code></th>
         <td>Porta padrão usada por um management server construído com esta opção. Se esta opção não foi usada para construí-lo, a porta padrão do management server é 1186.</td>
         <td><code>[none]</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_NDB_TEST</code></th>
         <td>Incluir programas de teste da NDB API.</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_NUMA</code></th>
         <td>Definir política de alocação de memória NUMA</td>
         <td></td>
         <td>5.7.17</td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_PROTOBUF</code></th>
         <td>Qual pacote Protocol Buffers usar</td>
         <td><code>bundled</code></td>
         <td>5.7.12</td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_RAPID</code></th>
         <td>Se deve fazer o build dos Plugins de ciclo de desenvolvimento rápido</td>
         <td><code>ON</code></td>
         <td>5.7.12</td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_SASL</code></th>
         <td>Uso interno apenas</td>
         <td></td>
         <td>5.7.29</td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_SSL</code></th>
         <td>Tipo de suporte SSL</td>
         <td><code>system</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_SYSTEMD</code></th>
         <td>Habilitar a instalação de arquivos de suporte systemd</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_TEST_TRACE_PLUGIN</code></th>
         <td>Fazer o build do Plugin de protocolo trace de teste</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_UBSAN</code></th>
         <td>Habilitar Undefined Behavior Sanitizer</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_UNIT_TESTS</code></th>
         <td>Compilar MySQL com unit tests</td>
         <td><code>ON</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_UNIXODBC</code></th>
         <td>Habilitar suporte unixODBC</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_VALGRIND</code></th>
         <td>Se deve compilar os header files do Valgrind</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_ZLIB</code></th>
         <td>Tipo de suporte zlib</td>
         <td><code>bundled</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_xxx_STORAGE_ENGINE</code></th>
         <td>Compilar o storage engine xxx estaticamente no server</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
   </tbody>
</table>

#### Opções Gerais

* `-DBUILD_CONFIG=mysql_release`

  Esta opção configura uma distribuição de código-fonte com as mesmas opções de build usadas pela Oracle para produzir distribuições binárias para lançamentos oficiais do MySQL.

* `-DCMAKE_BUILD_TYPE=type`

  O tipo de build a ser produzido:

  + `RelWithDebInfo`: Habilita otimizações e gera debugging information. Este é o tipo de build padrão do MySQL.

  + `Debug`: Desabilita otimizações e gera debugging information. Este tipo de build também é usado se a opção `WITH_DEBUG` estiver habilitada. Ou seja, `-DWITH_DEBUG=1` tem o mesmo efeito que `-DCMAKE_BUILD_TYPE=Debug`.

* `-DCPACK_MONOLITHIC_INSTALL=bool`

  Esta opção afeta se a operação **make package** produz vários arquivos de pacote de instalação ou um único arquivo. Se desabilitada, a operação produz vários arquivos de pacote de instalação, o que pode ser útil se você quiser instalar apenas um subconjunto de uma instalação completa do MySQL. Se habilitada, ela produz um único arquivo para instalar tudo.

#### Opções de Layout de Instalação

A opção `CMAKE_INSTALL_PREFIX` indica o diretório base de instalação. Outras opções com nomes no formato `INSTALL_xxx` que indicam localizações de componentes são interpretadas em relação ao prefixo e seus valores são pathnames relativos. Seus valores não devem incluir o prefixo.

* `-DCMAKE_INSTALL_PREFIX=dir_name`

  O diretório base de instalação.

  Este valor pode ser definido na inicialização do server usando a opção `--basedir`.

* `-DINSTALL_BINDIR=dir_name`

  Onde instalar os programas do usuário.

* `-DINSTALL_DOCDIR=dir_name`

  Onde instalar a documentação.

* `-DINSTALL_DOCREADMEDIR=dir_name`

  Onde instalar os arquivos `README`.

* `-DINSTALL_INCLUDEDIR=dir_name`

  Onde instalar os header files.

* `-DINSTALL_INFODIR=dir_name`

  Onde instalar os arquivos Info.

* `-DINSTALL_LAYOUT=name`

  Seleciona um layout de instalação predefinido:

  + `STANDALONE`: Mesmo layout usado para pacotes `.tar.gz` e `.zip`. Este é o padrão.

  + `RPM`: Layout semelhante a pacotes RPM.
  + `SVR4`: Layout de pacote Solaris.
  + `DEB`: Layout de pacote DEB (experimental).

  Você pode selecionar um layout predefinido, mas modificar as localizações de instalação de componentes individuais especificando outras opções. Por exemplo:

  ```sql
  cmake . -DINSTALL_LAYOUT=SVR4 -DMYSQL_DATADIR=/var/mysql/data
  ```

  O valor `INSTALL_LAYOUT` determina o valor padrão das system variables `secure_file_priv`, `keyring_encrypted_file_data` e `keyring_file_data`. Consulte as descrições dessas variáveis na Seção 5.1.7, “Server System Variables”, e na Seção 6.4.4.12, “Keyring System Variables”.

* `-DINSTALL_LIBDIR=dir_name`

  Onde instalar os library files.

* `-DINSTALL_MANDIR=dir_name`

  Onde instalar as manual pages.

* `-DINSTALL_MYSQLKEYRINGDIR=dir_path`

  O diretório padrão a ser usado como localização do arquivo de dados do Plugin `keyring_file`. O valor padrão é específico da plataforma e depende do valor da opção **CMake** `INSTALL_LAYOUT`; consulte a descrição da system variable `keyring_file_data` na Seção 5.1.7, “Server System Variables”.

  Esta opção foi adicionada no MySQL 5.7.11.

* `-DINSTALL_MYSQLSHAREDIR=dir_name`

  Onde instalar os arquivos de dados compartilhados.

* `-DINSTALL_MYSQLTESTDIR=dir_name`

  Onde instalar o diretório `mysql-test`. Para suprimir a instalação deste diretório, defina explicitamente a opção para o valor vazio (`-DINSTALL_MYSQLTESTDIR=`).

* `-DINSTALL_PKGCONFIGDIR=dir_name`

  O diretório no qual instalar o arquivo `mysqlclient.pc` para uso pelo **pkg-config**. O valor padrão é `INSTALL_LIBDIR/pkgconfig`, a menos que `INSTALL_LIBDIR` termine com `/mysql`, caso em que isso é removido primeiro.

* `-DINSTALL_PLUGINDIR=dir_name`

  A localização do diretório de Plugin.

  Este valor pode ser definido na inicialização do server com a opção `--plugin_dir`.

* `-DINSTALL_SBINDIR=dir_name`

  Onde instalar o **mysqld** server.

* `-DINSTALL_SCRIPTDIR=dir_name`

  Onde instalar o **mysql_install_db**.

* `-DINSTALL_SECURE_FILE_PRIVDIR=dir_name`

  O valor padrão para a system variable `secure_file_priv`. O valor padrão é específico da plataforma e depende do valor da opção **CMake** `INSTALL_LAYOUT`; consulte a descrição da system variable `secure_file_priv` na Seção 5.1.7, “Server System Variables”.

  Para definir o valor para o embedded server `libmysqld`, use `INSTALL_SECURE_FILE_PRIV_EMBEDDEDDIR`.

* `-DINSTALL_SECURE_FILE_PRIV_EMBEDDEDDIR=dir_name`

  O valor padrão para a system variable `secure_file_priv`, para o embedded server `libmysqld`.

  Note

  A embedded server library `libmysqld` está obsoleta a partir do MySQL 5.7.19; espera-se que seja removida no MySQL 8.0.

* `-DINSTALL_SHAREDIR=dir_name`

  Onde instalar `aclocal/mysql.m4`.

* `-DINSTALL_SUPPORTFILESDIR=dir_name`

  Onde instalar arquivos de suporte extra.

* `-DMYSQL_DATADIR=dir_name`

  A localização do diretório de dados do MySQL.

  Este valor pode ser definido na inicialização do server com a opção `--datadir`.

* `-DODBC_INCLUDES=dir_name`

  A localização do diretório de includes do ODBC, que pode ser usado ao configurar o Connector/ODBC.

* `-DODBC_LIB_DIR=dir_name`

  A localização do diretório da library ODBC, que pode ser usado ao configurar o Connector/ODBC.

* `-DSYSCONFDIR=dir_name`

  O diretório padrão do arquivo de opção `my.cnf`.

  Esta localização não pode ser definida na inicialização do server, mas você pode iniciar o server com um determinado arquivo de opção usando a opção `--defaults-file=file_name`, onde *`file_name`* é o pathname completo para o arquivo.

* `-DSYSTEMD_PID_DIR=dir_name`

  O nome do diretório no qual criar o arquivo PID quando o MySQL é gerenciado pelo systemd. O padrão é `/var/run/mysqld`; isso pode ser alterado implicitamente de acordo com o valor `INSTALL_LAYOUT`.

  Esta opção é ignorada a menos que `WITH_SYSTEMD` esteja habilitada.

* `-DSYSTEMD_SERVICE_NAME=name`

  O nome do serviço MySQL a ser usado quando o MySQL é gerenciado pelo **systemd**. O padrão é `mysqld`; isso pode ser alterado implicitamente de acordo com o valor `INSTALL_LAYOUT`.

  Esta opção é ignorada a menos que `WITH_SYSTEMD` esteja habilitada.

* `-DTMPDIR=dir_name`

  A localização padrão a ser usada para a system variable `tmpdir`. Se não especificado, o valor padrão é `P_tmpdir` em `<stdio.h>`.

#### Opções de Storage Engine

Os Storage Engines são construídos como Plugins. Você pode construir um Plugin como um módulo estático (compilado no server) ou um módulo dinâmico (construído como uma dynamic library que deve ser instalada no server usando a instrução `INSTALL PLUGIN` ou a opção `--plugin-load` antes de poder ser usado). Alguns Plugins podem não suportar a construção estática ou dinâmica.

Os Engines `InnoDB`, `MyISAM`, `MERGE`, `MEMORY` e `CSV` são obrigatórios (sempre compilados no server) e não precisam ser instalados explicitamente.

Para compilar um storage engine estaticamente no server, use `-DWITH_engine_STORAGE_ENGINE=1`. Alguns valores *`engine`* permitidos são `ARCHIVE`, `BLACKHOLE`, `EXAMPLE`, `FEDERATED` e `PARTITION` (suporte a Partitioning). Exemplos:

```sql
-DWITH_ARCHIVE_STORAGE_ENGINE=1
-DWITH_BLACKHOLE_STORAGE_ENGINE=1
```

Para fazer o build do MySQL com suporte para NDB Cluster, use a opção `WITH_NDBCLUSTER`.

Note

`WITH_NDBCLUSTER` é suportado apenas ao fazer o build do NDB Cluster usando as fontes do NDB Cluster. Ele não pode ser usado para habilitar o suporte a Cluster em outras source trees ou distribuições do MySQL. Nas distribuições de código-fonte do NDB Cluster, ele é habilitado por padrão. Consulte a Seção 21.3.1.4, “Building NDB Cluster from Source on Linux”, e a Seção 21.3.2.2, “Compiling and Installing NDB Cluster from Source on Windows”, para obter mais informações.

Note

Não é possível compilar sem o suporte ao Performance Schema. Se for desejado compilar sem tipos específicos de instrumentation, isso pode ser feito com as seguintes opções **CMake**:

```sql
DISABLE_PSI_COND
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

Por exemplo, para compilar sem a instrumentation de mutex, configure o MySQL usando `-DDISABLE_PSI_MUTEX=1`.

Para excluir um storage engine do build, use `-DWITH_engine_STORAGE_ENGINE=0`. Exemplos:

```sql
-DWITH_EXAMPLE_STORAGE_ENGINE=0
-DWITH_FEDERATED_STORAGE_ENGINE=0
-DWITH_PARTITION_STORAGE_ENGINE=0
```

Também é possível excluir um storage engine do build usando `-DWITHOUT_engine_STORAGE_ENGINE=1` (mas `-DWITH_engine_STORAGE_ENGINE=0` é preferível). Exemplos:

```sql
-DWITHOUT_EXAMPLE_STORAGE_ENGINE=1
-DWITHOUT_FEDERATED_STORAGE_ENGINE=1
-DWITHOUT_PARTITION_STORAGE_ENGINE=1
```

Se nem `-DWITH_engine_STORAGE_ENGINE` nem `-DWITHOUT_engine_STORAGE_ENGINE` forem especificados para um determinado storage engine, o Engine é construído como um módulo compartilhado, ou excluído se não puder ser construído como um módulo compartilhado.

#### Opções de Funcionalidade

* `-DCOMPILATION_COMMENT=string`

  Um comentário descritivo sobre o ambiente de compilação.

* `-DDEFAULT_CHARSET=charset_name`

  O character set do server. Por padrão, o MySQL usa o character set `latin1` (`cp1252` West European).

  *`charset_name`* pode ser um de `binary`, `armscii8`, `ascii`, `big5`, `cp1250`, `cp1251`, `cp1256`, `cp1257`, `cp850`, `cp852`, `cp866`, `cp932`, `dec8`, `eucjpms`, `euckr`, `gb2312`, `gbk`, `geostd8`, `greek`, `hebrew`, `hp8`, `keybcs2`, `koi8r`, `koi8u`, `latin1`, `latin2`, `latin5`, `latin7`, `macce`, `macroman`, `sjis`, `swe7`, `tis620`, `ucs2`, `ujis`, `utf8`, `utf8mb4`, `utf16`, `utf16le`, `utf32`. Os character sets permitidos estão listados no arquivo `cmake/character_sets.cmake` como o valor de `CHARSETS_AVAILABLE`.

  Este valor pode ser definido na inicialização do server com a opção `--character-set-server`.

* `-DDEFAULT_COLLATION=collation_name`

  O collation do server. Por padrão, o MySQL usa `latin1_swedish_ci`. Use a instrução `SHOW COLLATION` para determinar quais collations estão disponíveis para cada character set.

  Este valor pode ser definido na inicialização do server com a opção `--collation_server`.

* `-DDISABLE_PSI_COND=bool`

  Se deve excluir a instrumentation de condição do Performance Schema. O padrão é `OFF` (incluir).

* `-DDISABLE_PSI_FILE=bool`

  Se deve excluir a instrumentation de arquivo do Performance Schema. O padrão é `OFF` (incluir).

* `-DDISABLE_PSI_IDLE=bool`

  Se deve excluir a instrumentation de idle do Performance Schema. O padrão é `OFF` (incluir).

* `-DDISABLE_PSI_MEMORY=bool`

  Se deve excluir a instrumentation de memória do Performance Schema. O padrão é `OFF` (incluir).

* `-DDISABLE_PSI_METADATA=bool`

  Se deve excluir a instrumentation de metadata do Performance Schema. O padrão é `OFF` (incluir).

* `-DDISABLE_PSI_MUTEX=bool`

  Se deve excluir a instrumentation de mutex do Performance Schema. O padrão é `OFF` (incluir).

* `-DDISABLE_PSI_RWLOCK=bool`

  Se deve excluir a instrumentation de rwlock do Performance Schema. O padrão é `OFF` (incluir).

* `-DDISABLE_PSI_SOCKET=bool`

  Se deve excluir a instrumentation de socket do Performance Schema. O padrão é `OFF` (incluir).

* `-DDISABLE_PSI_SP=bool`

  Se deve excluir a instrumentation de stored program do Performance Schema. O padrão é `OFF` (incluir).

* `-DDISABLE_PSI_STAGE=bool`

  Se deve excluir a instrumentation de stage do Performance Schema. O padrão é `OFF` (incluir).

* `-DDISABLE_PSI_STATEMENT=bool`

  Se deve excluir a instrumentation de statement do Performance Schema. O padrão é `OFF` (incluir).

* `-DDISABLE_PSI_STATEMENT_DIGEST=bool`

  Se deve excluir a instrumentation de statement digest do Performance Schema. O padrão é `OFF` (incluir).

* `-DDISABLE_PSI_TABLE=bool`

  Se deve excluir a instrumentation de table do Performance Schema. O padrão é `OFF` (incluir).

* `-DDISABLE_PSI_PS=bool`

  Excluir a instrumentation de instâncias de prepared statements do Performance Schema. O padrão é `OFF` (incluir).

* `-DDISABLE_PSI_THREAD=bool`

  Excluir a instrumentation de thread do Performance Schema. O padrão é `OFF` (incluir).

  Desabilite threads apenas ao fazer o build sem qualquer instrumentation, porque outras instrumentations têm uma dependência de threads.

* `-DDISABLE_PSI_TRANSACTION=bool`

  Excluir a instrumentation de transaction do Performance Schema. O padrão é `OFF` (incluir).

* `-DDOWNLOAD_BOOST=bool`

  Se deve baixar a biblioteca Boost. O padrão é `OFF`.

  Consulte a opção `WITH_BOOST` para discussão adicional sobre o uso de Boost.

* `-DDOWNLOAD_BOOST_TIMEOUT=seconds`

  O timeout em segundos para baixar a biblioteca Boost. O padrão é 600 segundos.

  Consulte a opção `WITH_BOOST` para discussão adicional sobre o uso de Boost.

* `-DENABLE_DOWNLOADS=bool`

  Se deve baixar arquivos opcionais. Por exemplo, com esta opção habilitada, o **CMake** baixa a distribuição Google Test que é usada pelo test suite para executar unit tests.

* `-DENABLE_DTRACE=bool`

  Se deve incluir suporte para DTrace probes. Para obter informações sobre DTrace, consulte a Seção 5.8.4, “Tracing mysqld Using DTrace”.

  Esta opção está obsoleta porque o suporte ao DTrace está obsoleto no MySQL 5.7 e foi removido no MySQL 8.0.

* `-DENABLE_GCOV=bool`

  Se deve incluir suporte **gcov** (somente Linux).

* `-DENABLE_GPROF=bool`

  Se deve habilitar **gprof** (somente builds Linux otimizados).

* `-DENABLED_LOCAL_INFILE=bool`

  Esta opção controla a capability `LOCAL` compilada por padrão para a client library do MySQL. Clients que não fazem arranjos explícitos, portanto, têm a capability `LOCAL` desabilitada ou habilitada de acordo com a configuração `ENABLED_LOCAL_INFILE` especificada no momento do build do MySQL.

  Por padrão, a client library nas distribuições binárias do MySQL é compilada com `ENABLED_LOCAL_INFILE` desabilitada. (Antes do MySQL 5.7.6, era habilitada por padrão.) Se você compilar o MySQL a partir do código-fonte, configure-o com `ENABLED_LOCAL_INFILE` desabilitada ou habilitada com base no fato de que Clients que não fazem arranjos explícitos devem ter a capability `LOCAL` desabilitada ou habilitada, respectivamente.

  `ENABLED_LOCAL_INFILE` controla o padrão para a capability `LOCAL` do lado do Client. Para o server, a system variable `local_infile` controla a capability `LOCAL` do lado do server. Para fazer com que o server explicitamente recuse ou permita instruções `LOAD DATA LOCAL` (independentemente de como os Client programs e libraries são configurados no tempo de build ou runtime), inicie o **mysqld** com `--local-infile` desabilitada ou habilitada, respectivamente. `local_infile` também pode ser definido em runtime. Consulte a Seção 6.1.6, “Security Considerations for LOAD DATA LOCAL”.

* `-DENABLED_PROFILING=bool`

  Se deve habilitar o código de Query profiling (para as instruções `SHOW PROFILE` e `SHOW PROFILES`).

* `-DFORCE_UNSUPPORTED_COMPILER=bool`

  Por padrão, o **CMake** verifica as versões mínimas dos Compilers suportados: Visual Studio 2013 (Windows); GCC 4.4 ou Clang 3.3 (Linux); Developer Studio 12.5 (Solaris server); Developer Studio 12.2 ou GCC 4.4 (Solaris client library); Clang 3.3 (macOS), Clang 3.3 (FreeBSD). Para desabilitar esta verificação, use `-DFORCE_UNSUPPORTED_COMPILER=ON`.

* `-DIGNORE_AIO_CHECK=bool`

  Se a opção `-DBUILD_CONFIG=mysql_release` for fornecida no Linux, a library `libaio` deve ser linkada por padrão. Se você não tiver `libaio` ou não quiser instalá-la, poderá suprimir a verificação especificando `-DIGNORE_AIO_CHECK=1`.

* `-DMAX_INDEXES=num`

  O número máximo de Indexes por table. O padrão é 64. O máximo é 255. Valores menores que 64 são ignorados e o padrão de 64 é usado.

* `-DMYSQL_MAINTAINER_MODE=bool`

  Se deve habilitar um ambiente de desenvolvimento específico para o mantenedor do MySQL. Se habilitada, esta opção faz com que os warnings do Compiler se tornem errors.

* `-DMUTEX_TYPE=type`

  O tipo de mutex usado pelo `InnoDB`. As opções incluem:

  + `event`: Usar mutexes de event. Este é o valor padrão e a implementação de mutex original do `InnoDB`.

  + `sys`: Usar mutexes POSIX em sistemas UNIX. Usar objetos `CRITICAL_SECTION` no Windows, se disponíveis.

  + `futex`: Usar futexes Linux em vez de condition variables para agendar waiting threads.

* `-DMYSQLX_TCP_PORT=port_num`

  O número da porta na qual o X Plugin escuta por conexões TCP/IP. O padrão é 33060.

  Este valor pode ser definido na inicialização do server com a system variable `mysqlx_port`.

* `-DMYSQLX_UNIX_ADDR=file_name`

  O caminho do arquivo de Socket Unix no qual o server escuta por conexões de Socket do X Plugin. Este deve ser um pathname absoluto. O padrão é `/tmp/mysqlx.sock`.

  Este valor pode ser definido na inicialização do server com a system variable `mysqlx_port`.

* `-DMYSQL_PROJECT_NAME=name`

  Para Windows ou macOS, o nome do projeto a ser incorporado ao nome do arquivo do projeto.

* `-DMYSQL_TCP_PORT=port_num`

  O número da porta na qual o server escuta por conexões TCP/IP. O padrão é 3306.

  Este valor pode ser definido na inicialização do server com a opção `--port`.

* `-DMYSQL_UNIX_ADDR=file_name`

  O caminho do arquivo de Socket Unix no qual o server escuta por conexões de Socket. Este deve ser um pathname absoluto. O padrão é `/tmp/mysql.sock`.

  Este valor pode ser definido na inicialização do server com a opção `--socket`.

* `-DOPTIMIZER_TRACE=bool`

  Se deve suportar o Optimizer tracing. Consulte a Seção 8.15, “Tracing the Optimizer”.

* `-DREPRODUCIBLE_BUILD=bool`

  Para builds em sistemas Linux, esta opção controla se deve-se tomar cuidado extra para criar um resultado de build independente da localização e do tempo do build.

  Esta opção foi adicionada no MySQL 5.7.19.

* `-DWIN_DEBUG_NO_INLINE=bool`

  Se deve desabilitar o function inlining no Windows. O padrão é `OFF` (inlining habilitado).

* `-DWITH_ASAN=bool`

  Se deve habilitar o AddressSanitizer, para Compilers que o suportam. O padrão é `OFF`.

* `-DWITH_ASAN_SCOPE=bool`

  Se deve habilitar a flag Clang AddressSanitizer `-fsanitize-address-use-after-scope` para detecção de use-after-scope. O padrão é off. Para usar esta opção, `-DWITH_ASAN` também deve estar habilitado.

* `-DWITH_AUTHENTICATION_LDAP=bool`

  Se deve reportar um error se os Plugins de autenticação LDAP não puderem ser construídos:

  + Se esta opção estiver desabilitada (o padrão), os Plugins LDAP são construídos se os header files e libraries necessários forem encontrados. Caso contrário, o **CMake** exibe uma nota sobre isso.

  + Se esta opção estiver habilitada, uma falha ao encontrar o header file e as libraries necessárias faz com que o CMake produza um error, impedindo que o server seja construído.

  Para obter informações sobre autenticação LDAP, consulte a Seção 6.4.1.9, “LDAP Pluggable Authentication”. Esta opção foi adicionada no MySQL 5.7.19.

* `-DWITH_AUTHENTICATION_PAM=bool`

  Se deve fazer o build do Plugin de autenticação PAM, para source trees que incluem este Plugin. (Consulte a Seção 6.4.1.7, “PAM Pluggable Authentication”.) Se esta opção for especificada e o Plugin não puder ser compilado, o build falha.

* `-DWITH_AWS_SDK=path_name`

  A localização do software development kit da Amazon Web Services.

  Esta opção foi adicionada no MySQL 5.7.19.

* `-DWITH_BOOST=path_name`

  A biblioteca Boost é necessária para fazer o build do MySQL. Estas opções **CMake** permitem o controle sobre a localização da fonte da library e se ela deve ser baixada automaticamente:

  + `-DWITH_BOOST=path_name` especifica a localização do diretório da library Boost. Também é possível especificar a localização do Boost definindo a environment variable `BOOST_ROOT` ou `WITH_BOOST`.

    A partir do MySQL 5.7.11, `-DWITH_BOOST=system` também é permitido e indica que a versão correta do Boost está instalada no host de compilação na localização padrão. Neste caso, a versão instalada do Boost é usada em vez de qualquer versão incluída em uma distribuição de código-fonte do MySQL.

  + `-DDOWNLOAD_BOOST=bool` especifica se deve baixar a fonte do Boost se ela não estiver presente na localização especificada. O padrão é `OFF`.

  + `-DDOWNLOAD_BOOST_TIMEOUT=seconds` o timeout em segundos para baixar a library Boost. O padrão é 600 segundos.

  Por exemplo, se você normalmente faz o build do MySQL colocando a saída do objeto no subdiretório `bld` do seu source tree do MySQL, você pode fazer o build com o Boost assim:

  ```sql
  mkdir bld
  cd bld
  cmake .. -DDOWNLOAD_BOOST=ON -DWITH_BOOST=$HOME/my_boost
  ```

  Isso faz com que o Boost seja baixado para o diretório `my_boost` sob o seu diretório home. Se a versão Boost necessária já estiver lá, nenhum download será feito. Se a versão Boost necessária mudar, a versão mais recente será baixada.

  Se o Boost já estiver instalado localmente e seu Compiler encontrar os header files do Boost por conta própria, pode não ser necessário especificar as opções **CMake** anteriores. No entanto, se a versão do Boost exigida pelo MySQL mudar e a versão instalada localmente não tiver sido atualizada, você poderá ter problemas de build. O uso das opções **CMake** deve garantir um build bem-sucedido.

  Com as configurações acima que permitem o download do Boost para uma localização especificada, quando a versão Boost necessária muda, você precisa remover a pasta `bld`, recriá-la e realizar a etapa **cmake** novamente. Caso contrário, a nova versão do Boost pode não ser baixada e a compilação pode falhar.

* `-DWITH_CLIENT_PROTOCOL_TRACING=bool`

  Se deve fazer o build do framework de protocolo tracing do lado do Client na client library. Por padrão, esta opção está habilitada.

  Para obter informações sobre como escrever Plugins de protocolo trace do Client, consulte Writing Protocol Trace Plugins.

  Consulte também a opção `WITH_TEST_TRACE_PLUGIN`.

* `-DWITH_CURL=curl_type`

  A localização da library `curl`. *`curl_type`* pode ser `system` (usar a library `curl` do sistema) ou um pathname para a library `curl`.

  Esta opção foi adicionada no MySQL 5.7.19.

* `-DWITH_DEBUG=bool`

  Se deve incluir suporte a debugging.

  Configurar o MySQL com suporte a debugging permite que você use a opção `--debug="d,parser_debug"` ao iniciar o server. Isso faz com que o Bison parser usado para processar as instruções SQL despeje um parser trace para a saída de erro padrão do server. Normalmente, essa saída é gravada no error log.

  A verificação de Sync debug para o storage engine `InnoDB` é definida em `UNIV_DEBUG` e está disponível quando o suporte a debugging é compilado usando a opção `WITH_DEBUG`. Quando o suporte a debugging é compilado, a opção de configuração `innodb_sync_debug` pode ser usada para habilitar ou desabilitar a verificação de sync debug do `InnoDB`.

  A partir do MySQL 5.7.18, habilitar `WITH_DEBUG` também habilita o Debug Sync. Para uma descrição do recurso Debug Sync e como usar synchronization points, consulte MySQL Internals: Test Synchronization.

* `-DWITH_DEFAULT_FEATURE_SET=bool`

  Se deve usar as flags de `cmake/build_configurations/feature_set.cmake`.

* `-DWITH_EDITLINE=value`

  Qual library `libedit`/`editline` usar. Os valores permitidos são `bundled` (o padrão) e `system`.

  `WITH_EDITLINE` substitui `WITH_LIBEDIT`, que foi removido.

* `-DWITH_EMBEDDED_SERVER=bool`

  Se deve fazer o build da embedded server library `libmysqld`.

  Note

  A embedded server library `libmysqld` está obsoleta a partir do MySQL 5.7.17 e foi removida no MySQL 8.0.

* `-DWITH_EMBEDDED_SHARED_LIBRARY=bool`

  Se deve fazer o build de uma shared embedded server library `libmysqld`.

  Note

  A embedded server library `libmysqld` está obsoleta a partir do MySQL 5.7.17 e foi removida no MySQL 8.0.

* `-DWITH_EXTRA_CHARSETS=name`

  Quais character sets extras incluir:

  + `all`: Todos os character sets. Este é o padrão.

  + `complex`: Character sets complexos.
  + `none`: Nenhum character set extra.
* `-DWITH_GMOCK=path_name`

  O caminho para a distribuição googlemock, para uso com unit tests baseados no Google Test. O valor da opção é o caminho para o arquivo Zip da distribuição. Alternativamente, defina a environment variable `WITH_GMOCK` para o pathname. Também é possível usar `-DENABLE_DOWNLOADS=1`, caso em que o **CMake** baixa a distribuição do GitHub.

  Se você fizer o build do MySQL sem os unit tests do Google Test (configurando sem `WITH_GMOCK`), o **CMake** exibirá uma mensagem indicando como baixá-lo.

* `-DWITH_INNODB_EXTRA_DEBUG=bool`

  Se deve incluir suporte extra a debugging do InnoDB.

  Habilitar `WITH_INNODB_EXTRA_DEBUG` ativa verificações extras de debug do InnoDB. Esta opção só pode ser habilitada quando `WITH_DEBUG` estiver habilitada.

* `-DWITH_INNODB_MEMCACHED=bool`

  Se deve gerar shared libraries do memcached (`libmemcached.so` e `innodb_engine.so`).

* `-DWITH_KEYRING_TEST=bool`

  Se deve fazer o build do programa de teste que acompanha o Plugin `keyring_file`. O padrão é `OFF`. O código-fonte do arquivo de teste está localizado no diretório `plugin/keyring/keyring-test`.

  Esta opção foi adicionada no MySQL 5.7.11.

* `-DWITH_LDAP=value`

  Uso interno apenas. Esta opção foi adicionada no MySQL 5.7.29.

* `-DWITH_LIBEVENT=string`

  Qual library `libevent` usar. Os valores permitidos são `bundled` (padrão) e `system`. Antes do MySQL 5.7.31, se você especificar `system`, a library `libevent` do sistema será usada se presente, e ocorrerá um error caso contrário. No MySQL 5.7.31 e posterior, se `system` for especificado e nenhuma library `libevent` do sistema puder ser encontrada, ocorrerá um error de qualquer forma, e a `libevent` empacotada não será usada.

  A library `libevent` é exigida pelo memcached do `InnoDB` e pelo X Plugin.

* `-DWITH_LIBWRAP=bool`

  Se deve incluir suporte `libwrap` (TCP wrappers).

* `-DWITH_LZ4=lz4_type`

  A opção `WITH_LZ4` indica a fonte de suporte `zlib`:

  + `bundled`: Usar a library `lz4` empacotada com a distribuição. Este é o padrão.

  + `system`: Usar a library `lz4` do sistema. Se `WITH_LZ4` for definido com este valor, o utility **lz4_decompress** não é construído. Neste caso, o comando **lz4** do sistema pode ser usado em seu lugar.

* `-DWITH_MECAB={disabled|system|path_name}`

  Use esta opção para compilar o MeCab parser. Se você instalou o MeCab em seu diretório de instalação padrão, defina `-DWITH_MECAB=system`. A opção `system` se aplica a instalações do MeCab realizadas a partir do código-fonte ou de binários usando um utility nativo de gerenciamento de pacotes. Se você instalou o MeCab em um diretório de instalação personalizado, especifique o caminho para a instalação do MeCab, por exemplo, `-DWITH_MECAB=/opt/mecab`. Se a opção `system` não funcionar, especificar o caminho de instalação do MeCab deve funcionar em todos os casos.

  Para informações relacionadas, consulte a Seção 12.9.9, “MeCab Full-Text Parser Plugin”.

* `-DWITH_MSAN=bool`

  Se deve habilitar o MemorySanitizer, para Compilers que o suportam. O padrão é off.

  Para que esta opção tenha efeito se habilitada, todas as libraries linkadas ao MySQL também devem ter sido compiladas com a opção habilitada.

* `-DWITH_MSCRT_DEBUG=bool`

  Se deve habilitar o tracing de memory leak do Visual Studio CRT. O padrão é `OFF`.

* `-DWITH_NUMA=bool`

  Definir explicitamente a política de alocação de memória NUMA. O **CMake** define o valor padrão `WITH_NUMA` com base no suporte NUMA na plataforma atual. Para plataformas sem suporte NUMA, o **CMake** se comporta da seguinte forma:

  + Sem opção NUMA (o caso normal), o **CMake** continua normalmente, produzindo apenas este warning: NUMA library missing or required version not available. (Library NUMA ausente ou versão necessária não disponível.)

  + Com `-DWITH_NUMA=ON`, o **CMake** aborta com este error: NUMA library missing or required version not available. (Library NUMA ausente ou versão necessária não disponível.)

  Esta opção foi adicionada no MySQL 5.7.17.

* `-DWITH_PROTOBUF=protobuf_type`

  Qual pacote Protocol Buffers usar. *`protobuf_type`* pode ser um dos seguintes valores:

  + `bundled`: Usar o pacote empacotado com a distribuição. Este é o padrão.

  + `system`: Usar o pacote instalado no sistema.

  Outros valores são ignorados, com um fallback para `bundled`.

  Esta opção foi adicionada no MySQL 5.7.12.

* `-DWITH_RAPID=bool`

  Se deve fazer o build dos Plugins de ciclo de desenvolvimento rápido. Quando habilitado, um diretório `rapid` é criado na build tree contendo estes Plugins. Quando desabilitado, nenhum diretório `rapid` é criado na build tree. O padrão é `ON`, a menos que o diretório `rapid` seja removido do source tree, caso em que o padrão se torna `OFF`. Esta opção foi adicionada no MySQL 5.7.12.

* `-DWITH_SASL=value`

  Uso interno apenas. Esta opção foi adicionada no MySQL 5.7.29. Não é suportado no Windows.

* `-DWITH_SSL={ssl_type`|*`path_name`*}

  Para suporte de conexões criptografadas, entropy para geração de random number e outras operações relacionadas à criptografia, o MySQL deve ser construído usando uma SSL library. Esta opção especifica qual SSL library usar.

  + *`ssl_type`* pode ser um dos seguintes valores:

    - `yes`: Usar a library OpenSSL do sistema se presente, caso contrário, a library empacotada com a distribuição.

    - `bundled`: Usar a SSL library empacotada com a distribuição. Este é o padrão anterior ao MySQL 5.7.28. A partir do 5.7.28, este não é mais um valor permitido e o padrão é `system`.

    - `system`: Usar a library OpenSSL do sistema. Este é o padrão a partir do MySQL 5.7.28.

  + *`path_name`* é o pathname para a instalação do OpenSSL a ser usada. Isso pode ser preferível a usar o valor *`ssl_type`* de `system` porque pode evitar que o CMake detecte e use uma versão OpenSSL mais antiga ou incorreta instalada no sistema. (Outra maneira permitida de fazer o mesmo é definir `WITH_SSL` como `system` e definir a opção `CMAKE_PREFIX_PATH` como *`path_name`*.)

  Para informações adicionais sobre a configuração da SSL library, consulte a Seção 2.8.6, “Configuring SSL Library Support”.

* `-DWITH_SYSTEMD=bool`

  Se deve habilitar a instalação de arquivos de suporte **systemd**. Por padrão, esta opção está desabilitada. Quando habilitada, os arquivos de suporte **systemd** são instalados, e scripts como **mysqld_safe** e o script de inicialização System V não são instalados. Em plataformas onde o **systemd** não está disponível, habilitar `WITH_SYSTEMD` resulta em um error do **CMake**.

  Para obter mais informações sobre o uso do **systemd**, consulte a Seção 2.5.10, “Managing MySQL Server with systemd”. Essa seção também inclui informações sobre como especificar opções que, de outra forma, seriam especificadas em grupos de opções `[mysqld_safe]`. Como **mysqld_safe** não é instalado quando o **systemd** é usado, tais opções devem ser especificadas de outra forma.

* `-DWITH_TEST_TRACE_PLUGIN=bool`

  Se deve fazer o build do Plugin de protocolo trace do Client de teste (consulte Using the Test Protocol Trace Plugin). Por padrão, esta opção está desabilitada. Habilitar esta opção não tem efeito a menos que a opção `WITH_CLIENT_PROTOCOL_TRACING` esteja habilitada. Se o MySQL for configurado com ambas as opções habilitadas, a client library `libmysqlclient` será construída com o Plugin de protocolo trace de teste embutido, e todos os Clients padrão do MySQL carregarão o Plugin. No entanto, mesmo quando o Plugin de teste está habilitado, ele não tem efeito por padrão. O controle sobre o Plugin é fornecido usando environment variables; consulte Using the Test Protocol Trace Plugin.

  Note

  *Não* habilite a opção `WITH_TEST_TRACE_PLUGIN` se você quiser usar seus próprios Plugins de protocolo trace, porque apenas um desses Plugins pode ser carregado por vez e ocorre um error nas tentativas de carregar um segundo. Se você já fez o build do MySQL com o Plugin de protocolo trace de teste habilitado para ver como funciona, você deve refazer o build do MySQL sem ele antes de poder usar seus próprios Plugins.

  Para obter informações sobre como escrever Plugins de trace, consulte Writing Protocol Trace Plugins.

* `-DWITH_UBSAN=bool`

  Se deve habilitar o Undefined Behavior Sanitizer, para Compilers que o suportam. O padrão é off.

* `-DWITH_UNIT_TESTS={ON|OFF}`

  Se habilitado, compila o MySQL com unit tests. O padrão é `ON`, a menos que o server não esteja sendo compilado.

* `-DWITH_UNIXODBC=1`

  Habilita o suporte unixODBC, para Connector/ODBC.

* `-DWITH_VALGRIND=bool`

  Se deve compilar nos header files do Valgrind, o que expõe a API do Valgrind ao código MySQL. O padrão é `OFF`.

  Para gerar um build de debug com reconhecimento de Valgrind, `-DWITH_VALGRIND=1` é normalmente combinado com `-DWITH_DEBUG=1`. Consulte Building Debug Configurations.

* `-DWITH_ZLIB=zlib_type`

  Algumas funcionalidades exigem que o server seja construído com suporte a compression library, como as funções `COMPRESS()` e `UNCOMPRESS()`, e compression do protocolo client/server. A opção `WITH_ZLIB` indica a fonte de suporte `zlib`:

  + `bundled`: Usar a library `zlib` empacotada com a distribuição. Este é o padrão.

  + `system`: Usar a library `zlib` do sistema.

* `-DWITHOUT_SERVER=bool`

  Se deve fazer o build sem o MySQL Server. O padrão é OFF, que faz o build do server.

  Esta é considerada uma opção experimental; é preferível fazer o build com o server.

#### Compiler Flags

* `-DCMAKE_C_FLAGS="flags`"

  Flags para o C compiler.

* `-DCMAKE_CXX_FLAGS="flags`"

  Flags para o C++ compiler.

* `-DWITH_DEFAULT_COMPILER_OPTIONS=bool`

  Se deve usar as flags de `cmake/build_configurations/compiler_options.cmake`.

  Note

  Todas as flags de otimização são cuidadosamente escolhidas e testadas pela equipe de build do MySQL. Sobrescrevê-las pode levar a resultados inesperados e é feito por sua conta e risco.

* `-DSUNPRO_CXX_LIBRARY="lib_name`"

  Habilita o linking contra `libCstd` em vez de `stlport4` no Solaris 10 ou posterior. Isso funciona apenas para o Client code porque o server depende de C++98.

Para especificar suas próprias flags de C e C++ compiler, para flags que não afetam a otimização, use as opções CMake `CMAKE_C_FLAGS` e `CMAKE_CXX_FLAGS`.

Ao fornecer suas próprias compiler flags, você também pode querer especificar `CMAKE_BUILD_TYPE`.

Por exemplo, para criar um build release de 32 bits em uma máquina Linux de 64 bits, faça o seguinte:

```sql
$> mkdir build
$> cd build
$> cmake .. -DCMAKE_C_FLAGS=-m32 \
  -DCMAKE_CXX_FLAGS=-m32 \
  -DCMAKE_BUILD_TYPE=RelWithDebInfo
```

Se você definir flags que afetam a otimização (`-Onumber`), você deve definir as opções `CMAKE_C_FLAGS_build_type` e/ou `CMAKE_CXX_FLAGS_build_type`, onde *`build_type`* corresponde ao valor `CMAKE_BUILD_TYPE`. Para especificar uma otimização diferente para o tipo de build padrão (`RelWithDebInfo`), defina as opções `CMAKE_C_FLAGS_RELWITHDEBINFO` e `CMAKE_CXX_FLAGS_RELWITHDEBINFO`. Por exemplo, para compilar no Linux com `-O3` e com debug symbols, faça o seguinte:

```sql
$> cmake .. -DCMAKE_C_FLAGS_RELWITHDEBINFO="-O3 -g" \
  -DCMAKE_CXX_FLAGS_RELWITHDEBINFO="-O3 -g"
```

#### Opções do CMake para Compilação do NDB Cluster

As seguintes opções são para uso ao fazer o build do NDB Cluster com as fontes do NDB Cluster; elas não são atualmente suportadas ao usar fontes do MySQL 5.7 Server tree.

* `-DMEMCACHED_HOME=dir_name`

  O suporte a memcached do `NDB` foi removido no NDB 7.5.21 e NDB 7.6.17; portanto, esta opção não é mais suportada para fazer o build do `NDB` nessas ou em versões posteriores.

* `-DWITH_BUNDLED_LIBEVENT={ON|OFF}`

  O suporte a memcached do `NDB` foi removido no NDB 7.5.21 e NDB 7.6.17, e, portanto, esta opção não é mais suportada para fazer o build do `NDB` nessas ou em versões posteriores.

* `-DWITH_BUNDLED_MEMCACHED={ON|OFF}`

  O suporte a memcached do `NDB` foi removido no NDB 7.5.21 e NDB 7.6.17, e, portanto, esta opção não é mais suportada para fazer o build do `NDB` nessas ou em versões posteriores.

* `-DWITH_CLASSPATH=path`

  Define o classpath para fazer o build do MySQL NDB Cluster Connector for Java. O padrão é vazio. Esta opção é ignorada se `-DWITH_NDB_JAVA=OFF` for usado.

* `-DWITH_ERROR_INSERT={ON|OFF}`

  Habilita a injeção de error no kernel `NDB`. Apenas para teste; não se destina ao uso na construção de binários de produção. O padrão é `OFF`.

* `-DWITH_NDBAPI_EXAMPLES={ON|OFF}`

  Faz o build de programas de exemplo da NDB API em `storage/ndb/ndbapi-examples/`. Consulte NDB API Examples, para obter informações sobre eles.

* `-DWITH_NDBCLUSTER_STORAGE_ENGINE={ON|OFF}`

  Apenas para uso interno; pode nem sempre funcionar como esperado. Para fazer o build com suporte `NDB`, use `WITH_NDBCLUSTER` em vez disso.

* `-DWITH_NDBCLUSTER={ON|OFF}`

  Faz o build e o link do suporte para o storage engine `NDB` no **mysqld**. O padrão é `ON`.

* `-DWITH_NDBMTD={ON|OFF}`

  Faz o build do executável de nó de dados multithreaded (**ndbmtd**). O padrão é `ON`.

* `-DWITH_NDB_BINLOG={ON|OFF}`

  Habilita binary logging por padrão no **mysqld** construído usando esta opção. `ON` por padrão.

* `-DWITH_NDB_DEBUG={ON|OFF}`

  Habilita o build das versões de debug dos binários do NDB Cluster. Este é `OFF` por padrão.

* `-DWITH_NDB_JAVA={ON|OFF}`

  Habilita o build do NDB Cluster com suporte Java, incluindo suporte para ClusterJ (consulte MySQL NDB Cluster Connector for Java).

  Esta opção é `ON` por padrão. Se você não deseja compilar o NDB Cluster com suporte Java, você deve desabilitá-lo explicitamente especificando `-DWITH_NDB_JAVA=OFF` ao executar o **CMake**. Caso contrário, se o Java não puder ser encontrado, a configuração do build falhará.

* `-DWITH_NDB_PORT=port`

  Faz com que o NDB Cluster management server (**ndb_mgmd**) que é construído use esta *`port`* por padrão. Se esta opção não for definida, o management server resultante tenta usar a porta 1186 por padrão.

* `-DWITH_NDB_TEST={ON|OFF}`

  Se habilitado, inclui um conjunto de NDB API test programs. O padrão é `OFF`.