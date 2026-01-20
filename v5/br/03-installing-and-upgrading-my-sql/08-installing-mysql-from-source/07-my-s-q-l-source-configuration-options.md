### 2.8.7 Opções de configuração de fonte do MySQL

O programa **CMake** oferece um grande controle sobre como você configura uma distribuição de código-fonte do MySQL. Normalmente, você faz isso usando opções na linha de comando do **CMake**. Para obter informações sobre as opções suportadas pelo **CMake**, execute qualquer um desses comandos no diretório de código-fonte de nível superior:

```bash
$> cmake . -LH

$> ccmake .
```

Você também pode afetar o **CMake** usando certas variáveis de ambiente. Veja a Seção 4.9, “Variáveis de Ambiente”.

Para opções booleanas, o valor pode ser especificado como `1` ou `ON` para habilitar a opção, ou como `0` ou `OFF` para desabilitar a opção.

Muitas opções configuram padrões de compilação que podem ser substituídos na inicialização do servidor. Por exemplo, as opções `CMAKE_INSTALL_PREFIX`, `MYSQL_TCP_PORT` e `MYSQL_UNIX_ADDR`, que configuram o diretório de instalação padrão, o número da porta TCP/IP e o arquivo de soquete Unix, podem ser alteradas na inicialização do servidor com as opções `--basedir`, `--port` e `--socket` para o **mysqld**. Quando aplicável, as descrições das opções de configuração indicam a opção de inicialização correspondente do **mysqld**.

As seções a seguir fornecem mais informações sobre as opções do **CMake**.

- Referência de Opções do CMake
- Opções Gerais
- Opções de disposição da instalação
- Opções do Motor de Armazenamento
- Opções de recursos
- Ferramentas do compilador
- Opções do CMake para compilar o NDB Cluster

#### Referência de Opções do CMake

A tabela a seguir mostra as opções disponíveis do **CMake**. Na coluna `Padrão`, `PREFIX` representa o valor da opção `CMAKE_INSTALL_PREFIX`, que especifica o diretório de base de instalação. Esse valor é usado como localização pai para várias das subdiretórios de instalação.

**Tabela 2.14 Referência de Opções de Configuração de Fonte do MySQL (CMake)**

<table>
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
         <td>Use as mesmas opções de compilação das versões oficiais.</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>CMAKE_BUILD_TYPE</code></th>
         <td>Tipo de compilação a ser produzida</td>
         <td><code>RelWithDebInfo</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>CMAKE_CXX_FLAGS</code></th>
         <td>Opções para o compilador C++</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>CMAKE_C_FLAGS</code></th>
         <td>Opções para o compilador C</td>
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
         <td>Se a compilação do pacote produz um único arquivo</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DEFAULT_CHARSET</code></th>
         <td>O conjunto de caracteres padrão do servidor</td>
         <td><code>latin1</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DEFAULT_COLLATION</code></th>
         <td>A ordenação padrão do servidor</td>
         <td><code>latin1_swedish_ci</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_COND</code></th>
         <td>Excluir instrumentação de condição do Performance Schema</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_FILE</code></th>
         <td>Excluir instrumentação de arquivo do Performance Schema</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_IDLE</code></th>
         <td>Excluir instrumentação de ociosidade do Performance Schema</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_MEMORY</code></th>
         <td>Excluir instrumentação de memória do Performance Schema</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_METADATA</code></th>
         <td>Excluir instrumentação de metadados do Performance Schema</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_MUTEX</code></th>
         <td>Excluir instrumentação de mutex do Performance Schema</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_PS</code></th>
         <td>Excluir as instruções preparadas do Performance Schema</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_RWLOCK</code></th>
         <td>Excluir a instrumentação rwlock do Performance Schema</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_SOCKET</code></th>
         <td>Excluir a instrumentação de socket do Performance Schema</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_SP</code></th>
         <td>Excluir a instrumentação de programa armazenado do Performance Schema</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_STAGE</code></th>
         <td>Excluir a instrumentação de estágio do Performance Schema</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_STATEMENT</code></th>
         <td>Excluir a instrumentação de instrução do Performance Schema</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_STATEMENT_DIGEST</code></th>
         <td>Excluir instrumentação de resumo de instruções do Performance Schema</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_TABLE</code></th>
         <td>Excluir instrumentação de tabela do Performance Schema</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_THREAD</code></th>
         <td>Excluir instrumentação de thread do Performance Schema</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_TRANSACTION</code></th>
         <td>Excluir instrumentação de transação do Performance Schema</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DOWNLOAD_BOOST</code></th>
         <td>Indicar se deseja baixar a biblioteca Boost</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DOWNLOAD_BOOST_TIMEOUT</code></th>
         <td>Tempo limite em segundos para baixar a biblioteca Boost</td>
         <td><code>600</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>ENABLED_LOCAL_INFILE</code></th>
         <td>Habilitar LOCAL para LOAD DATA</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>ENABLED_PROFILING</code></th>
         <td>Habilitar código de perfil de consulta</td>
         <td><code>ON</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>ENABLE_DOWNLOADS</code></th>
         <td>Baixar arquivos opcionais</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>ENABLE_DTRACE</code></th>
         <td>Incluir suporte a DTrace</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>ENABLE_GCOV</code></th>
         <td>Incluir suporte a gcov</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>ENABLE_GPROF</code></th>
         <td>Habilitar gprof (somente em builds otimizados para Linux)</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>FORCE_UNSUPPORTED_COMPILER</code></th>
         <td>Permitir compiladores não suportados</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>IGNORE_AIO_CHECK</code></th>
         <td>Com -DBUILD_CONFIG=mysql_release, ignorar verificação de libaio</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTALL_BINDIR</code></th>
         <td>Diretório de executáveis ​​do usuário</td>
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
         <td>Diretório do arquivo README</td>
         <td><code>PREFIX</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTALL_INCLUDEDIR</code></th>
         <td>Diretório do arquivo de cabeçalho</td>
         <td><code>PREFIX/include</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTALL_INFODIR</code></th>
         <td>Diretório do arquivo de informações</td>
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
         <td>Diretório do arquivo de biblioteca</td>
         <td><code>PREFIX/lib</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTALL_MANDIR</code></th>
         <td>Diretório da página do manual</td>
         <td><code>PREFIX/man</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTALL_MYSQLKEYRINGDIR</code></th>
         <td>Diretório do arquivo de dados do plugin keyring_file</td>
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
         <td>Diretório de plugins</td>
         <td><code>PREFIX/lib/plugin</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTALL_SBINDIR</code></th>
         <td>Diretório executável do servidor</td>
         <td><code>PREFIX/bin</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTALL_SCRIPTDIR</code></th>
         <td>Diretório de scripts</td>
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
         <td>Diretório de arquivos de suporte adicionais</td>
         <td><code>PREFIX/support-files</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>MAX_INDEXES</code></th>
         <td>Número máximo de índices por tabela</td>
         <td><code>64</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>MEMCACHED_HOME</code></th>
         <td>Caminho para memcached; obsoleto</td>
         <td><code>[none]</code></td>
         <td></td>
         <td>5.7.33</td>
      </tr>
      <tr>
         <th><code>MUTEX_TYPE</code></th>
         <td>Tipo de mutex InnoDB</td>
         <td><code>event</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>MYSQLX_TCP_PORT</code></th>
         <td>Número da porta TCP/IP usada pelo plugin X</td>
         <td><code>33060</code></td>
         <td>5.7.17</td>
         <td></td>
      </tr>
      <tr>
         <th><code>MYSQLX_UNIX_ADDR</code></th>
         <td>Arquivo de socket Unix usado pelo plugin X</td>
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
         <td>Se deve ativar o ambiente de desenvolvimento específico do mantenedor do MySQL</td>
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
         <td>Arquivo de socket Unix</td>
         <td><code>/tmp/mysql.sock</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>ODBC_INCLUDES</code></th>
         <td>Diretório de inclusão ODBC</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>ODBC_LIB_DIR</code></th>
         <td>Diretório da biblioteca ODBC</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>OPTIMIZER_TRACE</code></th>
         <td>Suporte para rastreamento do otimizador</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>REPRODUCIBLE_BUILD</code></th>
         <td>Cuidado extra para criar um resultado de compilação independente do local e horário da compilação</td>
         <td></td>
         <td>5.7.19</td>
         <td></td>
      </tr>
      <tr>
         <th><code>SUNPRO_CXX_LIBRARY</code></th>
         <td>Biblioteca de link do cliente no Solaris 10+</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>SYSCONFDIR</code></th>
         <td>Diretório do arquivo de opções</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>SYSTEMD_PID_DIR</code></th>
         <td>Diretório para o arquivo PID no systemd</td>
         <td><code>/var/run/mysqld</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>SYSTEMD_SERVICE_NAME</code></th>
         <td>Nome do serviço MySQL no systemd</td>
         <td><code>mysqld</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>TMPDIR</code></th>
         <td>Valor padrão do diretório temporário</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WIN_DEBUG_NO_INLINE</code></th>
         <td>Desativar a incorporação de funções</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITHOUT_SERVER</code></th>
         <td>Não compilar o servidor; uso interno apenas</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITHOUT_xxx_STORAGE_ENGINE</code></th>
         <td>Excluir o mecanismo de armazenamento xxx da compilação</td>
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
         <td>Habilitar o sinalizador Clang -fsanitize-address-use-after-scope do AddressSanitizer</td>
         <td><code>OFF</code></td>
         <td>5.7.21</td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_AUTHENTICATION_LDAP</code></th>
         <td>Relatar erro caso os plugins de autenticação LDAP não possam ser compilados</td>
         <td><code>OFF</code></td>
         <td>5.7.19</td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_AUTHENTICATION_PAM</code></th>
         <td>Compilar o plugin de autenticação PAM</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_AWS_SDK</code></th>
         <td>Localização do kit de desenvolvimento de software da Amazon Web Services</td>
         <td></td>
         <td>5.7.19</td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_BOOST</code></th>
         <td>Localização dos fontes da biblioteca Boost</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_BUNDLED_LIBEVENT</code></th>
         <td>Usar libevent incluído ao compilar ndbmemcache; obsoleto</td>
         <td><code>ON</code></td>
         <td></td>
         <td>5.7.33</td>
      </tr>
      <tr>
         <th><code>WITH_BUNDLED_MEMCACHED</code></th>
         <td>Usar memcached incluído ao compilar ndbmemcache; obsoleto</td>
         <td><code>ON</code></td>
         <td></td>
         <td>5.7.33</td>
      </tr>
      <tr>
         <th><code>WITH_CLASSPATH</code></th>
         <td>Caminho de classe a ser usado ao compilar o MySQL Cluster Connector para Java. O padrão é uma string vazia.</td>
         <td><code></code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_CLIENT_PROTOCOL_TRACING</code></th>
         <td>Criar framework de rastreamento de protocolo do lado do cliente</td>
         <td><code>ON</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_CURL</code></th>
         <td>Localização da biblioteca curl</td>
         <td></td>
         <td>5.7.19</td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_DEBUG</code></th>
         <td>Incluir suporte para depuração</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_DEFAULT_COMPILER_OPTIONS</code></th>
         <td>Usar opções padrão do compilador</td>
         <td><code>ON</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_DEFAULT_FEATURE_SET</code></th>
         <td>Usar conjunto de recursos padrão</td>
         <td><code>ON</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_EDITLINE</code></th>
         <td>Qual biblioteca libedit/editline usar</td>
         <td><code>bundled</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_EMBEDDED_SERVER</code></th>
         <td>Criar servidor embutido</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_EMBEDDED_SHARED_LIBRARY</code></th>
         <td>Criar uma biblioteca compartilhada para servidor embutido</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_ERROR_INSERT</code></th>
         <td>Habilitar injeção de erros no mecanismo de armazenamento NDB. Não deve ser usado para criar binários destinados à produção.</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_EXTRA_CHARSETS</code></th>
         <td>Quais conjuntos de caracteres extras incluir</td>
         <td><code>all</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_GMOCK</code></th>
         <td>Caminho para a distribuição do googlemock</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_INNODB_EXTRA_DEBUG</code></th>
         <td>Incluir suporte extra de depuração para InnoDB.</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_INNODB_MEMCACHED</code></th>
         <td>Gerar bibliotecas compartilhadas do memcached.</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_KEYRING_TEST</code></th>
         <td>Construir o programa de teste do chaveiro</td>
         <td><code>OFF</code></td>
         <td>5.7.11</td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_LDAP</code></th>
         <td>Apenas para uso interno</td>
         <td></td>
         <td>5.7.29</td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_LIBEVENT</code></th>
         <td>Qual biblioteca libevent usar</td>
         <td><code>bundled</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_LIBWRAP</code></th>
         <td>Incluir suporte para libwrap (wrappers TCP)</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_LZ4</code></th>
         <td>Tipo de suporte para biblioteca LZ4</td>
         <td><code>bundled</code></td>
         <td>5.7.14</td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_MECAB</code></th>
         <td>Compilar MeCab</td>
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
         <td>Habilitar rastreamento de vazamento de memória do Visual Studio CRT</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_NDBAPI_EXAMPLES</code></th>
         <td>Criar programas de exemplo da API.</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_NDBCLUSTER</code></th>
         <td>NDB 8.0.30 e versões anteriores: Criar o mecanismo de armazenamento NDB. NDB 8.0.31 e versões posteriores: Obsoleto; use WITH_NDB em vez disso.</td>
         <td><code>ON</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_NDBCLUSTER_STORAGE_ENGINE</code></th>
         <td>Antes do NDB 8.0.31, isso era apenas para uso interno. NDB 8.0.31 e versões posteriores: alterna (apenas) a inclusão do mecanismo de armazenamento NDBCLUSTER.</td>
         <td><code>ON</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_NDBMTD</code></th>
         <td>Criar binário de nó de dados multithread.</td>
         <td><code>ON</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_NDB_BINLOG</code></th>
         <td>Habilitar o registro binário por padrão pelo mysqld.</td>
         <td><code>ON</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_NDB_DEBUG</code></th>
         <td>Gerar uma versão de depuração para testes ou solução de problemas.</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_NDB_JAVA</code></th>
         <td>Habilitar a compilação do suporte a Java e ClusterJ. Habilitado por padrão. Compatível apenas com MySQL Cluster.</td>
         <td><code>ON</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_NDB_PORT</code></th>
         <td>Porta padrão usada por um servidor de gerenciamento criado com esta opção. Se esta opção não foi usada para criá-lo, a porta padrão do servidor de gerenciamento é 1186.</td>
         <td><code>[none]</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_NDB_TEST</code></th>
         <td>Incluir programas de teste da API NDB.</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_NUMA</code></th>
         <td>Definir a política de alocação de memória NUMA.</td>
         <td></td>
         <td>5.7.17</td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_PROTOBUF</code></th>
         <td>Qual pacote Protocol Buffers usar.</td>
         <td><code>bundled</code></td>
         <td>5.7.12</td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_RAPID</code></th>
         <td>Se deve criar plugins para ciclo de desenvolvimento rápido</td>
         <td><code>ON</code></td>
         <td>5.7.12</td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_SASL</code></th>
         <td>Apenas para uso interno</td>
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
         <td>Habilitar a instalação de arquivos de suporte do systemd</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_TEST_TRACE_PLUGIN</code></th>
         <td>Criar plugin de rastreamento de protocolo de teste</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_UBSAN</code></th>
         <td>Habilitar o Sanitizador de Comportamento Indefinido</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_UNIT_TESTS</code></th>
         <td>Compilar MySQL com testes unitários</td>
         <td><code>ON</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_UNIXODBC</code></th>
         <td>Habilitar suporte a unixODBC</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_VALGRIND</code></th>
         <td>Se deve compilar em arquivos de cabeçalho do Valgrind</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_ZLIB</code></th>
         <td>Tipo de suporte a zlib</td>
         <td><code>bundled</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_xxx_STORAGE_ENGINE</code></th>
         <td>Compilar o mecanismo de armazenamento xxx estaticamente no servidor</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
   </tbody>
</table>

#### Opções Gerais

- `-DBUILD_CONFIG=mysql_release`

  Essa opção configura uma distribuição de fonte com as mesmas opções de compilação usadas pela Oracle para produzir distribuições binárias para as versões oficiais do MySQL.

- `-DCMAKE_BUILD_TYPE=tipo`

  O tipo de construção a ser produzido:

  - `RelWithDebInfo`: Habilitar otimizações e gerar informações de depuração. Este é o tipo de compilação padrão do MySQL.

  - `Debug`: Desative as otimizações e gere informações de depuração. Este tipo de compilação também é usado se a opção `WITH_DEBUG` estiver habilitada. Ou seja, `-DWITH_DEBUG=1` tem o mesmo efeito que `-DCMAKE_BUILD_TYPE=Debug`.

- `-DCPACK_MONOLITHIC_INSTALL=bool`

  Esta opção afeta se a operação **fazer pacote** produz vários arquivos de pacote de instalação ou um único arquivo. Se desativada, a operação produz vários arquivos de pacote de instalação, o que pode ser útil se você quiser instalar apenas um subconjunto de uma instalação completa do MySQL. Se ativada, ela produz um único arquivo para instalar tudo.

#### Opções de disposição da instalação

A opção `CMAKE_INSTALL_PREFIX` indica o diretório de instalação base. Outras opções com nomes na forma `INSTALL_xxx` que indicam os locais dos componentes são interpretadas em relação ao prefixo e seus valores são caminhos relativos. Seus valores não devem incluir o prefixo.

- `-DCMAKE_INSTALL_PREFIX=dir_name`

  O diretório de base de instalação.

  Esse valor pode ser definido na inicialização do servidor usando a opção `--basedir`.

- `-DINSTALL_BINDIR=dir_name`

  Onde instalar programas de usuários.

- `-DINSTALL_DOCDIR=dir_name`

  Onde instalar a documentação.

- `-DINSTALL_DOCREADMEDIR=dir_name`

  Onde instalar os arquivos `README`.

- `-DINSTALL_INCLUDEDIR=dir_name`

  Onde instalar os arquivos de cabeçalho.

- `-DINSTALL_INFODIR=dir_name`

  Onde instalar os arquivos Info.

- `-DINSTALL_LAYOUT=nome`

  Selecione um layout de instalação pré-definido:

  - `STANDALONE`: O mesmo layout utilizado para pacotes `.tar.gz` e `.zip`. Este é o padrão.

  - `RPM`: Layout semelhante aos pacotes RPM.

  - `SVR4`: Estrutura de pacotes do Solaris.

  - `DEB`: Estrutura do pacote DEB (experimental).

  Você pode selecionar um layout predefinido, mas modificar os locais de instalação de componentes individuais especificando outras opções. Por exemplo:

  ```bash
  cmake . -DINSTALL_LAYOUT=SVR4 -DMYSQL_DATADIR=/var/mysql/data
  ```

  O valor `INSTALL_LAYOUT` determina o valor padrão das variáveis de sistema `secure_file_priv`, `keyring_encrypted_file_data` e `keyring_file_data`. Consulte as descrições dessas variáveis nas seções 5.1.7, “Variáveis de sistema do servidor”, e 6.4.4.12, “Variáveis de sistema do Keychain”.

- `-DINSTALL_LIBDIR=dir_name`

  Onde instalar os arquivos da biblioteca.

- `-DINSTALL_MANDIR=dir_name`

  Onde instalar as páginas de manual.

- `-DINSTALL_MYSQLKEYRINGDIR=caminho_do_diretório`

  O diretório padrão a ser usado como local do arquivo de dados do plugin `keyring_file`. O valor padrão é específico da plataforma e depende do valor da opção **CMake** `INSTALL_LAYOUT`; consulte a descrição da variável de sistema `keyring_file_data` na Seção 5.1.7, “Variáveis do Sistema do Servidor”.

  Essa opção foi adicionada no MySQL 5.7.11.

- `-DINSTALL_MYSQLSHAREDIR=dir_name`

  Onde instalar arquivos de dados compartilhados.

- `-DINSTALL_MYSQLTESTDIR=dir_name`

  Onde instalar o diretório `mysql-test`. Para suprimir a instalação deste diretório, defina explicitamente a opção para o valor vazio (`-DINSTALL_MYSQLTESTDIR=`).

- `-DINSTALL_PKGCONFIGDIR=dir_name`

  O diretório onde o arquivo `mysqlclient.pc` deve ser instalado para uso pelo **pkg-config**. O valor padrão é `INSTALL_LIBDIR/pkgconfig`, a menos que `INSTALL_LIBDIR` termine com `/mysql`, caso em que isso é removido primeiro.

- `-DINSTALL_PLUGINDIR=dir_name`

  O local do diretório do plugin.

  Esse valor pode ser definido na inicialização do servidor com a opção `--plugin_dir`.

- `-DINSTALL_SBINDIR=dir_name`

  Onde instalar o servidor **mysqld**.

- `-DINSTALL_SCRIPTDIR=dir_name`

  Onde instalar **mysql_install_db**.

- `-DINSTALL_SECURE_FILE_PRIVDIR=nome_do_diretório`

  O valor padrão para a variável de sistema `secure_file_priv`. O valor padrão é específico da plataforma e depende do valor da opção **CMake** `INSTALL_LAYOUT`; consulte a descrição da variável de sistema `secure_file_priv` na Seção 5.1.7, “Variáveis do Sistema do Servidor”.

  Para definir o valor para o servidor embutido `libmysqld`, use `INSTALL_SECURE_FILE_PRIV_EMBEDDEDDIR`.

- `-DINSTALL_SECURE_FILE_PRIV_EMBEDDEDDIR=nome_pasta`

  O valor padrão da variável de sistema `secure_file_priv`, para o servidor integrado `libmysqld`.

  Nota

  A biblioteca de servidor embutida `libmysqld` está desatualizada a partir do MySQL 5.7.19; espere-se que ela seja removida no MySQL 8.0.

- `-DINSTALL_SHAREDIR=dir_name`

  Onde instalar `aclocal/mysql.m4`.

- `-DINSTALL_SUPPORTFILESDIR=dir_name`

  Onde instalar arquivos de suporte adicionais.

- `-DMYSQL_DATADIR=dir_name`

  O local do diretório de dados do MySQL.

  Esse valor pode ser definido na inicialização do servidor com a opção `--datadir`.

- `-DODBC_INCLUDES=dir_name`

  A localização do diretório ODBC pode ser usada durante a configuração do Connector/ODBC.

- `-DODBC_LIB_DIR=dir_name`

  O diretório da biblioteca ODBC, que pode ser usado durante a configuração do Connector/ODBC.

- `-DSYSCONFDIR=dir_name`

  Diretório do arquivo de opção `my.cnf` padrão.

  Essa localização não pode ser definida na inicialização do servidor, mas você pode iniciar o servidor com um arquivo de opção específico usando a opção `--defaults-file=file_name`, onde *`file_name`* é o nome completo do caminho do arquivo.

- `-DSYSTEMD_PID_DIR=dir_name`

  O nome do diretório onde o arquivo PID será criado quando o MySQL for gerenciado pelo systemd. O padrão é `/var/run/mysqld`; esse valor pode ser alterado implicitamente de acordo com o valor `INSTALL_LAYOUT`.

  Esta opção é ignorada, a menos que `WITH_SYSTEMD` esteja habilitado.

- `-DSYSTEMD_SERVICE_NAME=nome`

  O nome do serviço MySQL a ser usado quando o MySQL é gerenciado pelo **systemd**. O padrão é `mysqld`; isso pode ser alterado implicitamente de acordo com o valor `INSTALL_LAYOUT`.

  Esta opção é ignorada, a menos que `WITH_SYSTEMD` esteja habilitado.

- `-DTMPDIR=dir_name`

  O local padrão a ser usado para a variável de sistema `tmpdir`. Se não for especificado, o valor padrão é `P_tmpdir` em `<stdio.h>`.

#### Opções do Motor de Armazenamento

Os motores de armazenamento são construídos como plugins. Você pode criar um plugin como um módulo estático (compilado no servidor) ou um módulo dinâmico (construído como uma biblioteca dinâmica que deve ser instalada no servidor usando a instrução `INSTALL PLUGIN` ou a opção `--plugin-load` antes que ele possa ser usado). Alguns plugins podem não suportar a construção estática ou dinâmica.

Os motores `InnoDB`, `MyISAM`, `MERGE`, `MEMORY` e `CSV` são obrigatórios (sempre compilados no servidor) e não precisam ser instalados explicitamente.

Para compilar um mecanismo de armazenamento staticamente no servidor, use `-DWITH_engine_STORAGE_ENGINE=1`. Alguns valores de *`engine`* permitidos são `ARCHIVE`, `BLACKHOLE`, `EXAMPLE`, `FEDERATED` e `PARTITION` (suporte a partição). Exemplos:

```
-DWITH_ARCHIVE_STORAGE_ENGINE=1
-DWITH_BLACKHOLE_STORAGE_ENGINE=1
```

Para construir o MySQL com suporte para o NDB Cluster, use a opção `WITH_NDBCLUSTER`.

::: info Nota
`WITH_NDBCLUSTER` é suportado apenas ao construir o NDB Cluster usando as fontes do NDB Cluster. Não pode ser usado para habilitar o suporte ao agrupamento em outras árvores de fontes ou distribuições do MySQL. Nas distribuições de fontes do NDB Cluster, ele está habilitado por padrão. Consulte a Seção 21.3.1.4, “Construindo o NDB Cluster a partir da Fonte no Linux”, e a Seção 21.3.2.2, “Compilando e Instalando o NDB Cluster a partir da Fonte no Windows”, para obter mais informações.
:::

::: info Nota
Não é possível compilar sem o suporte do Performance Schema. Se quiser compilar sem tipos específicos de instrumentação, isso pode ser feito com as seguintes opções do **CMake**:

```
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

Por exemplo, para compilar sem instrumentação de mutex, configure o MySQL usando `-DDISABLE_PSI_MUTEX=1`.
:::

Para excluir um mecanismo de armazenamento da compilação, use `-DWITH_engine_STORAGE_ENGINE=0`. Exemplos:

```
-DWITH_EXAMPLE_STORAGE_ENGINE=0
-DWITH_FEDERATED_STORAGE_ENGINE=0
-DWITH_PARTITION_STORAGE_ENGINE=0
```

Também é possível excluir um mecanismo de armazenamento da compilação usando `-DWITHOUT_engine_STORAGE_ENGINE=1` (mas `-DWITH_engine_STORAGE_ENGINE=0` é preferível). Exemplos:

```
-DWITHOUT_EXAMPLE_STORAGE_ENGINE=1
-DWITHOUT_FEDERATED_STORAGE_ENGINE=1
-DWITHOUT_PARTITION_STORAGE_ENGINE=1
```

Se nenhum dos parâmetros `-DWITH_engine_STORAGE_ENGINE` ou `-DWITHOUT_engine_STORAGE_ENGINE` for especificado para um determinado mecanismo de armazenamento, o mecanismo será construído como um módulo compartilhado ou excluído se não puder ser construído como um módulo compartilhado.

#### Opções de recursos

- `-DCOMPILATION_COMMENT=string`

  Um comentário descritivo sobre o ambiente de compilação.

- `-DDEFAULT_CHARSET=charset_name`

  O conjunto de caracteres do servidor. Por padrão, o MySQL usa o conjunto de caracteres `latin1` (`cp1252` para a Europa Ocidental).

  *`charset_name`* pode ser uma das seguintes: `binary`, `armscii8`, `ascii`, `big5`, `cp1250`, `cp1251`, `cp1256`, `cp1257`, `cp850`, `cp852`, `cp866`, `cp932`, `dec8`, `eucjpms`, `euckr`, `gb2312`, `gbk`, `geostd8`, `greek`, `hebrew`, `hp8`, `keybcs2`, `koi8r`, `koi8u`, `latin1`, `latin2`, `latin5`, `latin7`, `macce`, `macroman`, `sjis`, `swe7`, `tis620`, `ucs2`, `ujis`, `utf8`, `utf8mb4`, `utf16`, `utf16le`, `utf32`. Os conjuntos de caracteres permitidos estão listados no arquivo `cmake/character_sets.cmake` como o valor de `CHARSETS_AVAILABLE`.

  Esse valor pode ser definido na inicialização do servidor com a opção `--character-set-server`.

- `-DDEFAULT_COLLATION=collation_name`

  A collation do servidor. Por padrão, o MySQL usa `latin1_swedish_ci`. Use a instrução `SHOW COLLATION` para determinar quais collation estão disponíveis para cada conjunto de caracteres.

  Esse valor pode ser definido na inicialização do servidor com a opção `--collation_server`.

- `-DDISABLE_PSI_COND=bool`

  Se deve excluir a instrumentação da condição do Schema de Desempenho. O padrão é `OFF` (incluir).

- `-DDISABLE_PSI_FILE=bool`

  Se deve excluir a instrumentação do arquivo do Schema de Desempenho. O padrão é `OFF` (incluir).

- `-DDISABLE_PSI_IDLE=bool`

  Se deve excluir a instrumentação de inatividade do Schema de Desempenho. O padrão é `OFF` (incluir).

- `-DDISABLE_PSI_MEMORY=bool`

  Se deve excluir a instrumentação de memória do Schema de Desempenho. O padrão é `OFF` (incluir).

- `-DDISABLE_PSI_METADATA=bool`

  Se deve excluir a instrumentação de metadados do Schema de Desempenho. O padrão é `OFF` (incluir).

- `-DDISABLE_PSI_MUTEX=bool`

  Se deve excluir a instrumentação do mutex do Schema de Desempenho. O padrão é `OFF` (incluir).

- `-DDISABLE_PSI_RWLOCK=bool`

  Se deve excluir a instrumentação do esquema de desempenho rwlock. O padrão é `OFF` (incluir).

- `-DDISABLE_PSI_SOCKET=bool`

  Se deve excluir a instrumentação de soquete do Schema de Desempenho. O padrão é `OFF` (incluir).

- `-DDISABLE_PSI_SP=bool`

  Se deve excluir a instrumentação de programas armazenados do Schema de Desempenho. O padrão é `OFF` (incluir).

- `-DDISABLE_PSI_STAGE=bool`

  Se deve excluir a instrumentação da etapa do Schema de Desempenho. O padrão é `OFF` (incluir).

- `-DDISABLE_PSI_STATEMENT=bool`

  Se deve excluir a instrumentação da declaração do Schema de Desempenho. O padrão é `OFF` (incluir).

- `-DDISABLE_PSI_STATEMENT_DIGEST=bool`

  Se deve excluir a instrumentação do digest do relatório do Schema de Desempenho. O padrão é `OFF` (incluir).

- `-DDISABLE_PSI_TABLE=bool`

  Se deve excluir a instrumentação da tabela do Schema de Desempenho. O padrão é `OFF` (incluir).

- `-DDISABLE_PSI_PS=bool`

  Exclua a instrumentação das instâncias de declarações preparadas do Schema de Desempenho. O padrão é `OFF` (incluir).

- `-DDISABLE_PSI_THREAD=bool`

  Exclua a instrumentação de thread do Schema de Desempenho. O padrão é `OFF` (incluir).

  Desative apenas os threads ao compilar sem instrumentação, pois outras instrumentações dependem dos threads.

- `-DDISABLE_PSI_TRANSACTION=bool`

  Exclua a instrumentação de transações do Schema de Desempenho. O padrão é `OFF` (incluir).

- `-DDOWNLOAD_BOOST=bool`

  Se deve baixar a biblioteca Boost. O padrão é `OFF`.

  Veja a opção `WITH_BOOST` para uma discussão adicional sobre o uso do Boost.

- `-DDOWNLOAD_BOOST_TIMEOUT=segundos`

  O tempo de espera em segundos para o download da biblioteca Boost. O valor padrão é de 600 segundos.

  Veja a opção `WITH_BOOST` para uma discussão adicional sobre o uso do Boost.

- `-DENABLE_DOWNLOADS=bool`

  Se deseja baixar arquivos opcionais. Por exemplo, com essa opção ativada, o **CMake** baixa a distribuição do Google Test que é usada pela suíte de testes para executar testes unitários.

- `-DENABLE_DTRACE=bool`

  Se incluir suporte para as ferramentas de análise DTrace. Para informações sobre o DTrace, consulte a Seção 5.8.4, “Rastreamento do mysqld usando o DTrace”.

  Esta opção está desatualizada porque o suporte ao DTrace está desatualizado no MySQL 5.7 e será removido no MySQL 8.0.

- `-DENABLE_GCOV=bool`

  Se incluir o suporte ao **gcov** (apenas para Linux).

- `-DENABLE_GPROF=bool`

  Se você deseja habilitar o **gprof** (apenas para compilações otimizadas do Linux).

- `-DENABLED_LOCAL_INFILE=bool`

  Esta opção controla a capacidade `LOCAL` integrada por padrão para a biblioteca de clientes MySQL. Os clientes que não fazem ajustes explícitos, portanto, têm a capacidade `LOCAL` desativada ou ativada de acordo com a configuração `ENABLED_LOCAL_INFILE` especificada no momento da construção do MySQL.

  Por padrão, a biblioteca do cliente nas distribuições binárias do MySQL é compilada com `ENABLED_LOCAL_INFILE` desativado. (Antes do MySQL 5.7.6, ele estava ativado por padrão.) Se você compilar o MySQL a partir da fonte, configure-o com `ENABLED_LOCAL_INFILE` desativado ou ativado, dependendo se os clientes que não fazem arranjos explícitos devem ter a capacidade `LOCAL` desativada ou ativada, respectivamente.

  `ENABLED_LOCAL_INFILE` controla o padrão para a capacidade `LOCAL` no lado do cliente. Para o servidor, a variável de sistema `local_infile` controla a capacidade `LOCAL` no lado do servidor. Para forçar explicitamente o servidor a recusar ou permitir as instruções `LOAD DATA LOCAL` (independentemente de como os programas e bibliotecas do cliente forem configurados no momento da construção ou do tempo de execução), inicie o **mysqld** com `--local-infile` desativado ou ativado, respectivamente. `local_infile` também pode ser definido no tempo de execução. Veja a Seção 6.1.6, “Considerações de Segurança para LOAD DATA LOCAL”.

- `-DENABLED_PROFILING=bool`

  Se deve habilitar o código de perfilamento de consultas (para as instruções `SHOW PROFILE` e `SHOW PROFILES`).

- `-DFORCE_UNSUPPORTED_COMPILER=bool`

  Por padrão, o **CMake** verifica as versões mínimas dos compiladores suportados: Visual Studio 2013 (Windows); GCC 4.4 ou Clang 3.3 (Linux); Developer Studio 12.5 (Solaris servidor); Developer Studio 12.2 ou GCC 4.4 (biblioteca de clientes Solaris); Clang 3.3 (macOS), Clang 3.3 (FreeBSD). Para desabilitar essa verificação, use `-DFORCE_UNSUPPORTED_COMPILER=ON`.

- `-DIGNORE_AIO_CHECK=bool`

  Se a opção `-DBUILD_CONFIG=mysql_release` for fornecida no Linux, a biblioteca `libaio` deve ser vinculada por padrão. Se você não tiver `libaio` ou não quiser instalá-lo, pode suprimir a verificação para ele especificando `-DIGNORE_AIO_CHECK=1`.

- `-DMAX_INDEXES=num`

  O número máximo de índices por tabela. O padrão é 64. O máximo é 255. Valores menores que 64 são ignorados e o padrão de 64 é usado.

- `-DMYSQL_MAINTAINER_MODE=bool`

  Se habilitar ou não um ambiente de desenvolvimento específico para o mantenedor do MySQL. Se habilitado, essa opção faz com que os avisos do compilador se tornem erros.

- `-DMUTEX_TYPE=tipo`

  O tipo de mutex usado pelo `InnoDB`. As opções incluem:

  - `event`: Use mútues de evento. Este é o valor padrão e a implementação original do mútuo `InnoDB`.

  - `sys`: Use mútues POSIX em sistemas UNIX. Use objetos `CRITICAL_SECTION` em sistemas Windows, se disponíveis.

  - `futex`: Use futexes do Linux em vez de variáveis de condição para agendar threads em espera.

- `-DMYSQLX_TCP_PORT=port_num`

  O número do porto no qual o X Plugin escuta as conexões TCP/IP. O padrão é 33060.

  Esse valor pode ser definido na inicialização do servidor com a variável de sistema `mysqlx_port`.

- `-DMYSQLX_UNIX_ADDR=nome_do_arquivo`

  O caminho do arquivo de socket Unix no qual o servidor escuta as conexões de socket do plugin X. Este caminho deve ser um nome de caminho absoluto. O padrão é `/tmp/mysqlx.sock`.

  Esse valor pode ser definido na inicialização do servidor com a variável de sistema `mysqlx_port`.

- `-DMYSQL_PROJECT_NAME=nome`

  Para Windows ou macOS, o nome do projeto a ser incorporado no nome do arquivo do projeto.

- `-DMYSQL_TCP_PORT=port_num`

  O número do porto no qual o servidor escuta as conexões TCP/IP. O padrão é 3306.

  Esse valor pode ser definido na inicialização do servidor com a opção `--port`.

- `-DMYSQL_UNIX_ADDR=nome_do_arquivo`

  O caminho do arquivo de socket Unix no qual o servidor escuta as conexões de socket. Este deve ser um nome de caminho absoluto. O padrão é `/tmp/mysql.sock`.

  Esse valor pode ser definido na inicialização do servidor com a opção `--socket`.

- `-DOPTIMIZER_TRACE=bool`

  Se deseja ou não suportar o rastreamento do otimizador. Consulte a Seção 8.15, “Rastreamento do Otimizador”.

- `-DREPRODUCIBLE_BUILD=bool`

  Para compilações em sistemas Linux, essa opção controla se é necessário ter mais cuidado para criar um resultado de compilação independente da localização e do horário da compilação.

  Essa opção foi adicionada no MySQL 5.7.19.

- `-DWIN_DEBUG_NO_INLINE=bool`

  Se desabilitar a inlining de funções no Windows. O padrão é `OFF` (inlining habilitado).

- `-DWITH_ASAN=bool`

  Se você deseja habilitar o AddressSanitizer, para os compiladores que o suportam. O padrão é `OFF`.

- `-DWITH_ASAN_SCOPE=bool`

  Se deve habilitar a bandeira Clang `-fsanitize-address-use-after-scope` do AddressSanitizer para detecção de uso após escopo. O padrão é desativado. Para usar essa opção, também é necessário habilitar `-DWITH_ASAN`.

- `-DWITH_AUTHENTICATION_LDAP=bool`

  Se deve relatar um erro se os plugins de autenticação LDAP não puderem ser construídos:

  - Se essa opção estiver desativada (o padrão), os plugins LDAP serão construídos se os arquivos de cabeçalho e as bibliotecas necessárias forem encontrados. Se não forem, o **CMake** exibirá uma nota sobre isso.

  - Se essa opção estiver habilitada, a falta de encontrar o arquivo de cabeçalho e as bibliotecas necessárias faz com que o CMake produza um erro, impedindo a construção do servidor.

  Para obter informações sobre autenticação LDAP, consulte a Seção 6.4.1.9, “Autenticação Pluggable LDAP”. Esta opção foi adicionada no MySQL 5.7.19.

- `-DWITH_AUTHENTICATION_PAM=bool`

  Se você deseja construir o plugin de autenticação PAM, para os repositórios de origem que incluem esse plugin. (Consulte a Seção 6.4.1.7, “Autenticação Conectada ao PAM”.) Se essa opção for especificada e o plugin não puder ser compilado, a construção falhará.

- `-DWITH_AWS_SDK=caminho_nome`

  O local do kit de desenvolvimento de software do Amazon Web Services.

  Essa opção foi adicionada no MySQL 5.7.19.

- `-DWITH_BOOST=path_name`

  A biblioteca Boost é necessária para construir o MySQL. Essas opções do **CMake** permitem controlar a localização da fonte da biblioteca e se ela deve ser baixada automaticamente:

  - `-DWITH_BOOST=caminho_nome` especifica a localização do diretório da biblioteca Boost. É também possível especificar a localização do Boost configurando a variável de ambiente `BOOST_ROOT` ou `WITH_BOOST`.

    A partir do MySQL 5.7.11, `-DWITH_BOOST=system` também é permitido e indica que a versão correta do Boost está instalada no host de compilação no local padrão. Nesse caso, a versão instalada do Boost é usada em vez de qualquer versão incluída em uma distribuição de fonte do MySQL.

  - `-DDOWNLOAD_BOOST=bool` especifica se o Boost deve ser baixado se ele não estiver presente na localização especificada. O padrão é `OFF`.

  - `-DDOWNLOAD_BOOST_TIMEOUT=segundos` o tempo de espera em segundos para baixar a biblioteca Boost. O valor padrão é de 600 segundos.

  Por exemplo, se você normalmente constrói o MySQL colocando a saída do objeto no subdiretório `bld` da árvore de origem do MySQL, você pode construir com o Boost da seguinte maneira:

  ```shell
  mkdir bld
  cd bld
  cmake .. -DDOWNLOAD_BOOST=ON -DWITH_BOOST=$HOME/my_boost
  ```

  Isso faz com que o Boost seja baixado para o diretório `my_boost` sob seu diretório de casa. Se a versão do Boost necessária já estiver lá, nenhum download é feito. Se a versão do Boost necessária mudar, a versão mais recente é baixada.

  Se o Boost já estiver instalado localmente e o compilador encontrar os arquivos de cabeçalho do Boost por conta própria, pode não ser necessário especificar as opções anteriores do **CMake**. No entanto, se a versão do Boost necessária pelo MySQL mudar e a versão instalada localmente não tiver sido atualizada, você pode ter problemas de compilação. O uso das opções do **CMake** deve permitir uma compilação bem-sucedida.

  Com as configurações acima que permitem o download do Boost em um local especificado, quando a versão do Boost necessária muda, você precisa remover a pasta `bld`, recriá-la e realizar novamente a etapa **cmake**. Caso contrário, a nova versão do Boost pode não ser baixada e a compilação pode falhar.

- `-DWITH_CLIENT_PROTOCOL_TRACING=bool`

  Se deve incluir o framework de rastreamento de protocolos no lado do cliente na biblioteca do cliente. Por padrão, essa opção está habilitada.

  Para obter informações sobre como escrever plugins de registro de protocolo de clientes, consulte Escrever plugins de registro de protocolo.

  Veja também a opção `WITH_TEST_TRACE_PLUGIN`.

- `-DWITH_CURL=curl_type`

  Localização da biblioteca `curl`. *`curl_type`* pode ser `system` (use a biblioteca `curl` do sistema) ou um nome de caminho para a biblioteca `curl`.

  Essa opção foi adicionada no MySQL 5.7.19.

- `-DWITH_DEBUG=bool`

  Se incluir suporte para depuração.

  Configurar o MySQL com suporte de depuração permite que você use a opção `--debug="d,parser_debug"`, quando você inicia o servidor. Isso faz com que o analisador Bison, que é usado para processar instruções SQL, armazene uma trilha do analisador na saída padrão de erro do servidor. Normalmente, essa saída é escrita no log de erro.

  A verificação de depuração para o mecanismo de armazenamento `InnoDB` é definida em `UNIV_DEBUG` e está disponível quando o suporte de depuração é compilado com a opção `WITH_DEBUG`. Quando o suporte de depuração é compilado, a opção de configuração `innodb_sync_debug` pode ser usada para habilitar ou desabilitar a verificação de depuração de sincronização do `InnoDB`.

  A partir do MySQL 5.7.18, a ativação de `WITH_DEBUG` também habilita o Debug Sync. Para uma descrição da funcionalidade Debug Sync e de como usar os pontos de sincronização, consulte MySQL Internals: Test Synchronization.

- `-DWITH_DEFAULT_FEATURE_SET=bool`

  Se usar as bandeiras do `cmake/build_configurations/feature_set.cmake`.

- `-DWITH_EDITLINE=valor`

  Qual biblioteca `libedit`/`editline` usar. Os valores permitidos são `bundled` (padrão) e `system`.

  `WITH_EDITLINE` substitui `WITH_LIBEDIT`, que foi removido.

- `-DWITH_EMBEDDED_SERVER=bool`

  Se deve construir a biblioteca de servidor embutida `libmysqld`.

  ::: info Nota
  A biblioteca de servidor embutida `libmysqld` está desatualizada a partir do MySQL 5.7.17 e foi removida no MySQL 8.0.
  :::

- `-DWITH_EMBEDDED_SHARED_LIBRARY=bool`

  Se deve construir uma biblioteca de servidor embutida `libmysqld` compartilhada.

  ::: info Nota
  A biblioteca de servidor embutida `libmysqld` está desatualizada a partir do MySQL 5.7.17 e foi removida no MySQL 8.0.
  :::

- `-DWITH_EXTRA_CHARSETS=nome`

  Quais conjuntos de caracteres extras incluir:
  + `all`: Todos os conjuntos de caracteres. Este é o padrão.
  + `complex`: Conjuntos de caracteres complexos.
  + `none`: Sem conjuntos de caracteres adicionais.

- `-DWITH_GMOCK=caminho_nome`

  O caminho para a distribuição do googlemock, para uso com testes unitários baseados no Google Test. O valor da opção é o caminho para o arquivo Zip da distribuição. Alternativamente, defina a variável de ambiente `WITH_GMOCK` com o nome do caminho. Também é possível usar `-DENABLE_DOWNLOADS=1`, nesse caso o **CMake** baixa a distribuição do GitHub.

  Se você construir o MySQL sem os testes unitários do Google Test (configurando sem `WITH_GMOCK`), o **CMake** exibe uma mensagem indicando como baixá-lo.

- `-DWITH_INNODB_EXTRA_DEBUG=bool`

  Se incluir suporte adicional para depuração do InnoDB.

  Ativação de `WITH_INNODB_EXTRA_DEBUG` habilita verificações de depuração adicionais do InnoDB. Esta opção só pode ser ativada quando `WITH_DEBUG` está ativado.

- `-DWITH_INNODB_MEMCACHED=bool`

  Se deve gerar as bibliotecas compartilhadas do memcached (`libmemcached.so` e `innodb_engine.so`).

- `-DWITH_KEYRING_TEST=bool`

  Se deve ou não construir o programa de teste que acompanha o plugin `keyring_file`. O padrão é `OFF`. O código-fonte do arquivo de teste está localizado no diretório `plugin/keyring/keyring-test`.

  Essa opção foi adicionada no MySQL 5.7.11.

- `-DWITH_LDAP=valor`

  Uso interno apenas. Esta opção foi adicionada no MySQL 5.7.29.

- `-DWITH_LIBEVENT=string`

  Qual biblioteca `libevent` usar. Os valores permitidos são `bundled` (padrão) e `system`. Antes do MySQL 5.7.31, se você especificar `system`, a biblioteca `libevent` do sistema é usada, se estiver presente, e ocorre um erro caso contrário. No MySQL 5.7.31 e versões posteriores, se `system` for especificado e nenhuma biblioteca `libevent` do sistema puder ser encontrada, um erro ocorrerá independentemente, e a `libevent` empacotada não será usada.

  A biblioteca `libevent` é necessária pelo memcached do `InnoDB` e pelo X Plugin.

- `-DWITH_LIBWRAP=bool`

  Se incluir o suporte para `libwrap` (wrappers TCP).

- `-DWITH_LZ4=lz4_type`

  A opção `WITH_LZ4` indica a origem do suporte ao `zlib`:

  - `bundled`: Use a biblioteca `lz4` incluída na distribuição. Isso é o padrão.

  - `system`: Use a biblioteca `lz4`. Se `WITH_LZ4` estiver definido para esse valor, o utilitário **lz4_decompress** não será construído. Nesse caso, o comando **lz4** do sistema pode ser usado.

- `-DWITH_MECAB={desativado|sistema|nome_caminho}`

  Use esta opção para compilar o analisador MeCab. Se você instalou o MeCab no diretório de instalação padrão, defina `-DWITH_MECAB=system`. A opção `system` se aplica a instalações do MeCab realizadas a partir de fontes ou de binários usando um utilitário de gerenciamento de pacotes nativo. Se você instalou o MeCab em um diretório de instalação personalizado, especifique o caminho para a instalação do MeCab, por exemplo, `-DWITH_MECAB=/opt/mecab`. Se a opção `system` não funcionar, especificar o caminho de instalação do MeCab deve funcionar em todos os casos.

  Para informações relacionadas, consulte a Seção 12.9.9, “Plugin do Parser de Texto Completo MeCab”.

- `-DWITH_MSAN=bool`

  Se você deseja habilitar o MemorySanitizer, para os compiladores que o suportam. O padrão é desativado.

  Para que essa opção tenha efeito quando ativada, todas as bibliotecas vinculadas ao MySQL também devem ter sido compiladas com a opção ativada.

- `-DWITH_MSCRT_DEBUG=bool`

  Se deve habilitar o rastreamento de vazamentos de memória do Visual Studio CRT. O padrão é `OFF`.

- `-DWITH_NUMA=bool`

  Defina explicitamente a política de alocação de memória NUMA. O **CMake** define o valor padrão `WITH_NUMA` com base se a plataforma atual tem suporte para `NUMA`. Para plataformas sem suporte para NUMA, o **CMake** se comporta da seguinte forma:

  - Sem a opção NUMA (o caso normal), o **CMake** continua normalmente, produzindo apenas este aviso: biblioteca NUMA ausente ou versão necessária não disponível.

  - Com `-DWITH_NUMA=ON`, o **CMake** interrompe com este erro: biblioteca NUMA ausente ou versão necessária não disponível.

  Essa opção foi adicionada no MySQL 5.7.17.

- `-DWITH_PROTOBUF=protobuf_type`

  Qual pacote do Protocol Buffers usar. *`protobuf_type`* pode ser um dos seguintes valores:

  - `bundled`: Use o pacote que vem com a distribuição. Isso é o padrão.

  - `system`: Use o pacote instalado no sistema.

  Outros valores são ignorados, com fallback para `bundled`.

  Essa opção foi adicionada no MySQL 5.7.12.

- `-DWITH_RAPID=bool`

  Se construir os plugins do ciclo de desenvolvimento rápido. Quando ativado, um diretório `rapid` é criado na árvore de compilação, contendo esses plugins. Quando desativado, nenhum diretório `rapid` é criado na árvore de compilação. A opção padrão é `ON`, a menos que o diretório `rapid` seja removido da árvore de origem, caso em que a opção padrão se torna `OFF`. Esta opção foi adicionada no MySQL 5.7.12.

- `-DWITH_SASL=valor`

  Uso interno apenas. Esta opção foi adicionada no MySQL 5.7.29. Não é suportada no Windows.

- `-DWITH_SSL={ssl_type`|*`caminho_nome`*}

  Para o suporte de conexões criptografadas, entropia para geração de números aleatórios e outras operações relacionadas à criptografia, o MySQL deve ser construído usando uma biblioteca SSL. Esta opção especifica qual biblioteca SSL deve ser usada.

  - *`ssl_type`* pode ser um dos seguintes valores:

    - `sim`: Use a biblioteca OpenSSL do sistema, se estiver presente, ou a biblioteca incluída na distribuição.

    - `bundled`: Use a biblioteca SSL incluída na distribuição. Este é o valor padrão antes do MySQL 5.7.28. A partir do 5.7.28, este não é mais um valor permitido e o padrão é `system`.

    - `system`: Use a biblioteca OpenSSL do sistema. Isso é o padrão a partir do MySQL 5.7.28.

  - *`path_name`* é o nome do caminho para a instalação do OpenSSL a ser utilizada. Isso pode ser preferível ao uso do valor *`ssl_type`* de `system`, pois pode evitar que o CMake detecte e use uma versão mais antiga ou incorreta do OpenSSL instalada no sistema. (Outra maneira permitida de fazer a mesma coisa é definir `WITH_SSL` para `system` e definir a opção `CMAKE_PREFIX_PATH` para *`path_name`*.)

  Para obter informações adicionais sobre a configuração da biblioteca SSL, consulte a Seção 2.8.6, “Configurando o Suporte à Biblioteca SSL”.

- `-DWITH_SYSTEMD=bool`

  Se deve habilitar a instalação de arquivos de suporte do **systemd**. Por padrão, essa opção está desabilitada. Quando habilitada, os arquivos de suporte do **systemd** são instalados, e scripts como o **mysqld_safe** e o script de inicialização System V não são instalados. Em plataformas onde o **systemd** não está disponível, habilitar `WITH_SYSTEMD` resulta em um erro do **CMake**.

  Para obter mais informações sobre o uso do **systemd**, consulte a Seção 2.5.10, “Gerenciamento do servidor MySQL com o systemd”. Essa seção também inclui informações sobre a especificação de opções que não estão especificadas no grupo de opções `[mysqld_safe]`. Como o **mysqld_safe** não está instalado quando o **systemd** é usado, essas opções devem ser especificadas de outra forma.

- `-DWITH_TEST_TRACE_PLUGIN=bool`

  Se deve construir o plugin de rastreamento do protocolo de teste do cliente (veja Usar o plugin de rastreamento do protocolo de teste). Por padrão, essa opção está desabilitada. Ativação dessa opção não tem efeito a menos que a opção `WITH_CLIENT_PROTOCOL_TRACING` esteja habilitada. Se o MySQL estiver configurado com ambas as opções habilitadas, a biblioteca de clientes `libmysqlclient` será construída com o plugin de rastreamento do protocolo de teste integrado e todos os clientes padrão do MySQL carregarão o plugin. No entanto, mesmo quando o plugin de teste estiver habilitado, ele não tem efeito por padrão. O controle do plugin é concedido usando variáveis de ambiente; veja Usar o plugin de rastreamento do protocolo de teste.

  ::: info Nota
  Não habilite a opção `WITH_TEST_TRACE_PLUGIN` se você quiser usar seus próprios plugins de registro de protocolo, pois apenas um desses plugins pode ser carregado de cada vez e ocorrerá um erro para tentativas de carregar um segundo. Se você já compilou o MySQL com o plugin de registro de protocolo de teste habilitado para ver como ele funciona, você deve recompilar o MySQL sem ele antes de poder usar seus próprios plugins.
  
  Para obter informações sobre como escrever plugins de registro, consulte Escrever plugins de registro de protocolo.
  :::

- `-DWITH_UBSAN=bool`

  Se você deseja habilitar o Sanitizer de Comportamento Indeterminado, para os compiladores que o suportam. O padrão é desativado.

- `-DWITH_UNIT_TESTS={ON|OFF}`

  Se habilitado, compile o MySQL com testes unitários. O padrão é `ON`, a menos que o servidor não esteja sendo compilado.

- `-DWITH_UNIXODBC=1`

  Habilita o suporte unixODBC, para o Connector/ODBC.

- `-DWITH_VALGRIND=bool`

  Se compilar os arquivos de cabeçalho do Valgrind, que expõe a API do Valgrind ao código do MySQL. O padrão é `OFF`.

  Para gerar uma compilação de depuração compatível com o Valgrind, o comando `-DWITH_VALGRIND=1` normalmente é combinado com `-DWITH_DEBUG=1`. Veja Configuração de Compilação de Depuração.

- `-DWITH_ZLIB=zlib_type`

  Algumas funcionalidades exigem que o servidor seja construído com suporte à biblioteca de compressão, como as funções `COMPRESS()` e `UNCOMPRESS()`, e a compressão do protocolo cliente/servidor. A opção `WITH_ZLIB` indica a origem do suporte ao `zlib`:

  - `bundled`: Use a biblioteca `zlib` incluída na distribuição. Isso é o padrão.

  - `system`: Use a biblioteca `zlib` do sistema.

- `-DWITHOUT_SERVER=bool`

  Se deseja construir sem o MySQL Server. O padrão é OFF, o que constrói o servidor.

  Isso é considerado uma opção experimental; é preferível construir com o servidor.

#### Ferramentas do compilador

- `-DCMAKE_C_FLAGS="flags"`

  Bandeiras para o compilador C.

- `-DCMAKE_CXX_FLAGS="flags"`

  Ferramentas para o compilador C++.

- `-DWITH_DEFAULT_COMPILER_OPTIONS=bool`

  Se usar as bandeiras do `cmake/build_configurations/compiler_options.cmake`.

  ::: info Nota
  Todas as bandeiras de otimização são cuidadosamente escolhidas e testadas pela equipe de construção do MySQL. Sobrepor elas pode levar a resultados inesperados e é feito por sua conta e risco.
  :::

- `-DSUNPRO_CXX_LIBRARY="lib_name"`

  Ative a vinculação contra `libCstd` em vez de `stlport4` no Solaris 10 ou versões posteriores. Isso funciona apenas para o código cliente, pois o servidor depende do C++98.

Para especificar suas próprias flags do compilador C e C++ para as flags que não afetam a otimização, use as opções `CMAKE_C_FLAGS` e `CMAKE_CXX_FLAGS` do CMake.

Ao fornecer suas próprias flags do compilador, você pode querer especificar `CMAKE_BUILD_TYPE` também.

Por exemplo, para criar uma versão de 32 bits em uma máquina Linux de 64 bits, faça o seguinte:

```bash
$> mkdir build
$> cd build
$> cmake .. -DCMAKE_C_FLAGS=-m32 \
  -DCMAKE_CXX_FLAGS=-m32 \
  -DCMAKE_BUILD_TYPE=RelWithDebInfo
```

Se você definir flags que afetam a otimização (`-Onumber`), você deve definir as opções `CMAKE_C_FLAGS_build_type` e/ou `CMAKE_CXX_FLAGS_build_type`, onde *`build_type`* corresponde ao valor de `CMAKE_BUILD_TYPE`. Para especificar uma otimização diferente para o tipo de compilação padrão (`RelWithDebInfo`), defina as opções `CMAKE_C_FLAGS_RELWITHDEBINFO` e `CMAKE_CXX_FLAGS_RELWITHDEBINFO`. Por exemplo, para compilar no Linux com `-O3` e com símbolos de depuração, faça o seguinte:

```shell
$> cmake .. -DCMAKE_C_FLAGS_RELWITHDEBINFO="-O3 -g" \
  -DCMAKE_CXX_FLAGS_RELWITHDEBINFO="-O3 -g"
```

#### Opções do CMake para compilar o NDB Cluster

As seguintes opções são para uso ao construir um NDB Cluster com as fontes do NDB Cluster; elas não são atualmente suportadas ao usar fontes da árvore do MySQL 5.7 Server.

- `-DMEMCACHED_HOME=dir_name`

  O suporte ao `NDB` para o memcached foi removido no NDB 7.5.21 e no NDB 7.6.17; portanto, essa opção não é mais suportada para a construção do `NDB` nessas ou em versões posteriores.

- `-DWITH_BUNDLED_LIBEVENT={ON|OFF}`

  O suporte ao `NDB` para o memcached foi removido no NDB 7.5.21 e no NDB 7.6.17, e, portanto, essa opção não é mais suportada para a construção do `NDB` nessas ou em versões posteriores.

- `-DWITH_BUNDLED_MEMCACHED={ON|OFF}`

  O suporte ao `NDB` para o memcached foi removido no NDB 7.5.21 e no NDB 7.6.17, e, portanto, essa opção não é mais suportada para a construção do `NDB` nessas ou em versões posteriores.

- `-DWITH_CLASSPATH=caminho`

  Define o caminho de classe para a construção do Conector MySQL NDB Cluster para Java. O padrão é vazio. Esta opção é ignorada se `-DWITH_NDB_JAVA=OFF` for usada.

- `-DWITH_ERROR_INSERT={ON|OFF}`

  Habilita a injeção de erros no kernel `NDB`. Apenas para testes; não é destinado ao uso na construção de binários de produção. O padrão é `OFF`.

- `-DWITH_NDBAPI_EXAMPLES={ON|OFF}`

  Crie programas de exemplo da API NDB em `storage/ndb/ndbapi-examples/`. Consulte Exemplos da API NDB para obter informações sobre eles.

- `-DWITH_NDBCLUSTER_STORAGE_ENGINE={ON|OFF}`

  Para uso interno apenas; pode não funcionar sempre conforme o esperado. Para construir com suporte `NDB`, use `WITH_NDBCLUSTER` em vez disso.

- `-DWITH_NDBCLUSTER={ON|OFF}`

  Construa e ligue o suporte ao motor de armazenamento `NDB` no **mysqld**. O padrão é `ON`.

- `-DWITH_NDBMTD={ON|OFF}`

  Construa o executável do nó de dados multithreading \*\*ndbmtd"). O padrão é `ON`.

- `-DWITH_NDB_BINLOG={ON|OFF}`

  Ative o registro binário por padrão no **mysqld** construído usando esta opção. `ON` por padrão.

- `-DWITH_NDB_DEBUG={ON|OFF}`

  Ative a construção das versões de depuração dos binários do NDB Cluster. Isso está configurado como `OFF` por padrão.

- `-DWITH_NDB_JAVA={ON|OFF}`

  Ative a construção do NDB Cluster com suporte a Java, incluindo suporte para ClusterJ (consulte o Conector do NDB Cluster do MySQL para Java).

  Esta opção está ativada por padrão. Se você não deseja compilar o NDB Cluster com suporte ao Java, deve desativá-lo explicitamente, especificando `-DWITH_NDB_JAVA=OFF` ao executar o **CMake**. Caso contrário, se o Java não for encontrado, a configuração da compilação falhará.

- `-DWITH_NDB_PORT=port`

  Faz com que o servidor de gerenciamento do NDB Cluster (**ndb_mgmd**) que é construído para usar essa *`port`* por padrão. Se essa opção não for definida, o servidor de gerenciamento resultante tenta usar a porta 1186 por padrão.

- `-DWITH_NDB_TEST={ON|OFF}`

  Se ativado, inclua um conjunto de programas de teste da API NDB. O padrão é `OFF`.
