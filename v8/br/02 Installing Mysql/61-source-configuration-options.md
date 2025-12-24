### 2.8.7 Opções de configuração de fonte do MySQL

O programa \[`CMake`] fornece uma grande quantidade de controle sobre como você configura uma distribuição de origem do MySQL. Normalmente, você faz isso usando opções na linha de comando \[`CMake`]. Para informações sobre opções suportadas pelo \[`CMake`], execute qualquer um desses comandos no diretório de origem de nível superior:

```
$> cmake . -LH

$> ccmake .
```

Você também pode afetar o `CMake` usando certas variáveis de ambiente.

Para opções booleanas, o valor pode ser especificado como `1` ou `ON` para ativar a opção, ou como `0` ou `OFF` para desativar a opção.

Muitas opções configuram padrões de tempo de compilação que podem ser substituídos na inicialização do servidor. Por exemplo, as opções `CMAKE_INSTALL_PREFIX`, `MYSQL_TCP_PORT`, e `MYSQL_UNIX_ADDR` que configuram a localização padrão do diretório de base de instalação, o número da porta TCP/IP e o arquivo de soquete do Unix podem ser alterados na inicialização do servidor com as opções `--basedir`, `--port`, e `--socket` para `mysqld`. Quando aplicável, as descrições de opções de configuração indicam a opção de inicialização correspondente `mysqld`.

As seções a seguir fornecem mais informações sobre as opções `CMake`.

- Referência à opção de marca
- Opções gerais
- Opções de layout da instalação
- Opções de motor de armazenamento
- Opções de funcionalidade
- Bandeiras do compilador
- CMake Opções para a Compilação de Cluster NDB

#### Referência à opção de marca

A tabela a seguir mostra as opções disponíveis de `CMake`. Na coluna `Default`, `PREFIX` representa o valor da opção `CMAKE_INSTALL_PREFIX`, que especifica o diretório base de instalação. Este valor é usado como o local pai para vários dos subdiretórios de instalação.

\*\*Tabela 2.15 Referência de opção de configuração de origem do MySQL (CMake) \*\*

<table><thead><tr><th>Formato</th> <th>Descrição</th> <th>Parâmetro padrão</th> </tr></thead><tbody><tr><th>[[PH_HTML_CODE_<code>INSTALL_PKGCONFIGDIR</code>]</th> <td>Se permitir a geração da secção [[PH_HTML_CODE_<code>INSTALL_PKGCONFIGDIR</code>] em binários</td> <td></td> </tr><tr><th>[[PH_HTML_CODE_<code>INSTALL_PLUGINDIR</code>]</th> <td>Usar as mesmas opções de compilação que as versões oficiais</td> <td></td> </tr><tr><th>[[PH_HTML_CODE_<code>PREFIX/lib/plugin</code>]</th> <td>Agrega bibliotecas de tempo de execução com pacotes MSI e Zip para Windows</td> <td>[[PH_HTML_CODE_<code>INSTALL_PRIV_LIBDIR</code>]</td> </tr><tr><th>[[PH_HTML_CODE_<code>INSTALL_SBINDIR</code>]</th> <td>Tipo de construção a produzir</td> <td>[[PH_HTML_CODE_<code>PREFIX/bin</code>]</td> </tr><tr><th>[[PH_HTML_CODE_<code>INSTALL_SECURE_FILE_PRIVDIR</code>]</th> <td>Bandeiras para o compilador C++</td> <td></td> </tr><tr><th>[[PH_HTML_CODE_<code>platform specific</code>]</th> <td>Bandeiras para o compilador C</td> <td></td> </tr><tr><th>[[PH_HTML_CODE_<code>INSTALL_SHAREDIR</code>]</th> <td>Diretório da base de instalação</td> <td>[[<code>.gdb_index</code><code>INSTALL_PKGCONFIGDIR</code>]</td> </tr><tr><th>[[<code>.gdb_index</code><code>INSTALL_PKGCONFIGDIR</code>]</th> <td>Comentário sobre o ambiente de compilação</td> <td></td> </tr><tr><th>[[<code>.gdb_index</code><code>INSTALL_PLUGINDIR</code>]</th> <td>Comentário sobre o ambiente de compilação para uso pelo mysqld</td> <td></td> </tr><tr><th>[[<code>.gdb_index</code><code>PREFIX/lib/plugin</code>]</th> <td>Compressar seções de depuração de executáveis binários</td> <td>[[<code>.gdb_index</code><code>INSTALL_PRIV_LIBDIR</code>]</td> </tr><tr><th>[[<code>.gdb_index</code><code>INSTALL_SBINDIR</code>]</th> <td>Se a compilação do pacote produz um único ficheiro</td> <td>[[<code>.gdb_index</code><code>PREFIX/bin</code>]</td> </tr><tr><th>[[<code>.gdb_index</code><code>INSTALL_SECURE_FILE_PRIVDIR</code>]</th> <td>Conjunto de caracteres padrão do servidor</td> <td>[[<code>.gdb_index</code><code>platform specific</code>]</td> </tr><tr><th>[[<code>.gdb_index</code><code>INSTALL_SHAREDIR</code>]</th> <td>A collação padrão do servidor</td> <td>[[<code>BUILD_CONFIG</code><code>INSTALL_PKGCONFIGDIR</code>]</td> </tr><tr><th>[[<code>BUILD_CONFIG</code><code>INSTALL_PKGCONFIGDIR</code>]</th> <td>Excluir a instrumentação das condições do esquema de desempenho</td> <td>[[<code>BUILD_CONFIG</code><code>INSTALL_PLUGINDIR</code>]</td> </tr><tr><th>[[<code>BUILD_CONFIG</code><code>PREFIX/lib/plugin</code>]</th> <td>Excluir a instrumentação de bloqueio de dados do esquema de desempenho</td> <td>[[<code>BUILD_CONFIG</code><code>INSTALL_PRIV_LIBDIR</code>]</td> </tr><tr><th>[[<code>BUILD_CONFIG</code><code>INSTALL_SBINDIR</code>]</th> <td>Excluir a instrumentação de erro do servidor do esquema de desempenho</td> <td>[[<code>BUILD_CONFIG</code><code>PREFIX/bin</code>]</td> </tr><tr><th>[[<code>BUILD_CONFIG</code><code>INSTALL_SECURE_FILE_PRIVDIR</code>]</th> <td>Excluir a instrumentação do ficheiro do esquema de desempenho</td> <td>[[<code>BUILD_CONFIG</code><code>platform specific</code>]</td> </tr><tr><th>[[<code>BUILD_CONFIG</code><code>INSTALL_SHAREDIR</code>]</th> <td>Excluir a instrumentação em vazio do esquema de performance</td> <td>[[<code>BUNDLE_RUNTIME_LIBRARIES</code><code>INSTALL_PKGCONFIGDIR</code>]</td> </tr><tr><th>[[<code>BUNDLE_RUNTIME_LIBRARIES</code><code>INSTALL_PKGCONFIGDIR</code>]</th> <td>Excluir a instrumentação de memória do esquema de desempenho</td> <td>[[<code>BUNDLE_RUNTIME_LIBRARIES</code><code>INSTALL_PLUGINDIR</code>]</td> </tr><tr><th>[[<code>BUNDLE_RUNTIME_LIBRARIES</code><code>PREFIX/lib/plugin</code>]</th> <td>Excluir a instrumentação de metadados do esquema de desempenho</td> <td>[[<code>BUNDLE_RUNTIME_LIBRARIES</code><code>INSTALL_PRIV_LIBDIR</code>]</td> </tr><tr><th>[[<code>BUNDLE_RUNTIME_LIBRARIES</code><code>INSTALL_SBINDIR</code>]</th> <td>Excluir a instrumentação mutex do esquema de desempenho</td> <td>[[<code>BUNDLE_RUNTIME_LIBRARIES</code><code>PREFIX/bin</code>]</td> </tr><tr><th>[[<code>BUNDLE_RUNTIME_LIBRARIES</code><code>INSTALL_SECURE_FILE_PRIVDIR</code>]</th> <td>Excluir declarações preparadas para o esquema de desempenho</td> <td>[[<code>BUNDLE_RUNTIME_LIBRARIES</code><code>platform specific</code>]</td> </tr><tr><th>[[<code>BUNDLE_RUNTIME_LIBRARIES</code><code>INSTALL_SHAREDIR</code>]</th> <td>Excluir a instrumentação de bloqueio do esquema de desempenho</td> <td>[[<code>OFF</code><code>INSTALL_PKGCONFIGDIR</code>]</td> </tr><tr><th>[[<code>OFF</code><code>INSTALL_PKGCONFIGDIR</code>]</th> <td>Excluir a instrumentação do soquete do esquema de desempenho</td> <td>[[<code>OFF</code><code>INSTALL_PLUGINDIR</code>]</td> </tr><tr><th>[[<code>OFF</code><code>PREFIX/lib/plugin</code>]</th> <td>Excluir a instrumentação do programa armazenado no Performance Schema</td> <td>[[<code>OFF</code><code>INSTALL_PRIV_LIBDIR</code>]</td> </tr><tr><th>[[<code>OFF</code><code>INSTALL_SBINDIR</code>]</th> <td>Excluir a instrumentação da fase do esquema de desempenho</td> <td>[[<code>OFF</code><code>PREFIX/bin</code>]</td> </tr><tr><th>[[<code>OFF</code><code>INSTALL_SECURE_FILE_PRIVDIR</code>]</th> <td>Excluir a instrumentação da declaração do esquema de desempenho</td> <td>[[<code>OFF</code><code>platform specific</code>]</td> </tr><tr><th>[[<code>OFF</code><code>INSTALL_SHAREDIR</code>]</th> <td>Excluir declarações de esquema de desempenho_digest instrumentação</td> <td>[[<code>CMAKE_BUILD_TYPE</code><code>INSTALL_PKGCONFIGDIR</code>]</td> </tr><tr><th>[[<code>CMAKE_BUILD_TYPE</code><code>INSTALL_PKGCONFIGDIR</code>]</th> <td>Excluir a instrumentação da tabela do esquema de desempenho</td> <td>[[<code>CMAKE_BUILD_TYPE</code><code>INSTALL_PLUGINDIR</code>]</td> </tr><tr><th>[[<code>CMAKE_BUILD_TYPE</code><code>PREFIX/lib/plugin</code>]</th> <td>Excluir a instrumentação do fio do esquema de desempenho</td> <td>[[<code>CMAKE_BUILD_TYPE</code><code>INSTALL_PRIV_LIBDIR</code>]</td> </tr><tr><th>[[<code>CMAKE_BUILD_TYPE</code><code>INSTALL_SBINDIR</code>]</th> <td>Excluir a instrumentação de transacção do esquema de desempenho</td> <td>[[<code>CMAKE_BUILD_TYPE</code><code>PREFIX/bin</code>]</td> </tr><tr><th>[[<code>CMAKE_BUILD_TYPE</code><code>INSTALL_SECURE_FILE_PRIVDIR</code>]</th> <td>Se habilitar LOCAL para LOAD DATA</td> <td>[[<code>CMAKE_BUILD_TYPE</code><code>platform specific</code>]</td> </tr><tr><th>[[<code>CMAKE_BUILD_TYPE</code><code>INSTALL_SHAREDIR</code>]</th> <td>Ativar o código de perfis de consulta</td> <td>[[<code>RelWithDebInfo</code><code>INSTALL_PKGCONFIGDIR</code>]</td> </tr><tr><th>[[<code>RelWithDebInfo</code><code>INSTALL_PKGCONFIGDIR</code>]</th> <td>Se as variáveis experimentais do sistema InnoDB estão habilitadas</td> <td>[[<code>RelWithDebInfo</code><code>INSTALL_PLUGINDIR</code>]</td> </tr><tr><th>[[<code>RelWithDebInfo</code><code>PREFIX/lib/plugin</code>]</th> <td>Incluir ou não o suporte do gcov</td> <td></td> </tr><tr><th>[[<code>RelWithDebInfo</code><code>INSTALL_PRIV_LIBDIR</code>]</th> <td>Ativar gprof (apenas compilações do Linux otimizadas)</td> <td>[[<code>RelWithDebInfo</code><code>INSTALL_SBINDIR</code>]</td> </tr><tr><th>[[<code>RelWithDebInfo</code><code>PREFIX/bin</code>]</th> <td>Se a saída do compilador deve ser colorida</td> <td>[[<code>RelWithDebInfo</code><code>INSTALL_SECURE_FILE_PRIVDIR</code>]</td> </tr><tr><th>[[<code>RelWithDebInfo</code><code>platform specific</code>]</th> <td>Se forçar uma compilação no código-fonte</td> <td>[[<code>RelWithDebInfo</code><code>INSTALL_SHAREDIR</code>]</td> </tr><tr><th>[[<code>CMAKE_CXX_FLAGS</code><code>INSTALL_PKGCONFIGDIR</code>]</th> <td>Permitir compiladores não suportados</td> <td>[[<code>CMAKE_CXX_FLAGS</code><code>INSTALL_PKGCONFIGDIR</code>]</td> </tr><tr><th>[[<code>CMAKE_CXX_FLAGS</code><code>INSTALL_PLUGINDIR</code>]</th> <td>Se deve gerar dados de otimização guiados por perfis</td> <td>[[<code>CMAKE_CXX_FLAGS</code><code>PREFIX/lib/plugin</code>]</td> </tr><tr><th>[[<code>CMAKE_CXX_FLAGS</code><code>INSTALL_PRIV_LIBDIR</code>]</th> <td>Utilização de dados de otimização guiados por perfis</td> <td>[[<code>CMAKE_CXX_FLAGS</code><code>INSTALL_SBINDIR</code>]</td> </tr><tr><th>[[<code>CMAKE_CXX_FLAGS</code><code>PREFIX/bin</code>]</th> <td>Ativar o módulo de rastreamento de memória de esquema de desempenho para funções de alocação de memória utilizadas em armazenamento dinâmico de tipos sobre-alinhados</td> <td>[[<code>CMAKE_CXX_FLAGS</code><code>INSTALL_SECURE_FILE_PRIVDIR</code>]</td> </tr><tr><th>[[<code>CMAKE_CXX_FLAGS</code><code>platform specific</code>]</th> <td>Com -DBUILD_CONFIG=mysql_release, ignore a verificação libaio</td> <td>[[<code>CMAKE_CXX_FLAGS</code><code>INSTALL_SHAREDIR</code>]</td> </tr><tr><th>[[<code>CMAKE_C_FLAGS</code><code>INSTALL_PKGCONFIGDIR</code>]</th> <td>Diretório de executáveis do usuário</td> <td>[[<code>CMAKE_C_FLAGS</code><code>INSTALL_PKGCONFIGDIR</code>]</td> </tr><tr><th>[[<code>CMAKE_C_FLAGS</code><code>INSTALL_PLUGINDIR</code>]</th> <td>Repertório de documentação</td> <td>[[<code>CMAKE_C_FLAGS</code><code>PREFIX/lib/plugin</code>]</td> </tr><tr><th>[[<code>CMAKE_C_FLAGS</code><code>INSTALL_PRIV_LIBDIR</code>]</th> <td>Directório de arquivos README</td> <td>[[<code>CMAKE_C_FLAGS</code><code>INSTALL_SBINDIR</code>]</td> </tr><tr><th>[[<code>CMAKE_C_FLAGS</code><code>PREFIX/bin</code>]</th> <td>Arquivo de cabeçalho</td> <td>[[<code>CMAKE_C_FLAGS</code><code>INSTALL_SECURE_FILE_PRIVDIR</code>]</td> </tr><tr><th>[[<code>CMAKE_C_FLAGS</code><code>platform specific</code>]</th> <td>Directório de ficheiros de informação</td> <td>[[<code>CMAKE_C_FLAGS</code><code>INSTALL_SHAREDIR</code>]</td> </tr><tr><th>[[<code>CMAKE_INSTALL_PREFIX</code><code>INSTALL_PKGCONFIGDIR</code>]</th> <td>Selecionar layout de instalação predefinido</td> <td>[[<code>CMAKE_INSTALL_PREFIX</code><code>INSTALL_PKGCONFIGDIR</code>]</td> </tr><tr><th>[[<code>CMAKE_INSTALL_PREFIX</code><code>INSTALL_PLUGINDIR</code>]</th> <td>Diretório de arquivos de biblioteca</td> <td>[[<code>CMAKE_INSTALL_PREFIX</code><code>PREFIX/lib/plugin</code>]</td> </tr><tr><th>[[<code>CMAKE_INSTALL_PREFIX</code><code>INSTALL_PRIV_LIBDIR</code>]</th> <td>Guia de páginas manuais</td> <td>[[<code>CMAKE_INSTALL_PREFIX</code><code>INSTALL_SBINDIR</code>]</td> </tr><tr><th>[[<code>CMAKE_INSTALL_PREFIX</code><code>PREFIX/bin</code>]</th> <td>Diretório de dados partilhados</td> <td>[[<code>CMAKE_INSTALL_PREFIX</code><code>INSTALL_SECURE_FILE_PRIVDIR</code>]</td> </tr><tr><th>[[<code>CMAKE_INSTALL_PREFIX</code><code>platform specific</code>]</th> <td>diretório mysql-test</td> <td>[[<code>CMAKE_INSTALL_PREFIX</code><code>INSTALL_SHAREDIR</code>]</td> </tr><tr><th>[[<code>INSTALL_PKGCONFIGDIR</code>]]</th> <td>Diretório para o arquivo mysqlclient.pc pkg-config</td> <td>[[<code>/usr/local/mysql</code><code>INSTALL_PKGCONFIGDIR</code>]</td> </tr><tr><th>[[<code>INSTALL_PLUGINDIR</code>]]</th> <td>Diretório de Plugins</td> <td>[[<code>PREFIX/lib/plugin</code>]]</td> </tr><tr><th>[[<code>INSTALL_PRIV_LIBDIR</code>]]</th> <td>Directório de instalação de biblioteca privada</td> <td></td> </tr><tr><th>[[<code>INSTALL_SBINDIR</code>]]</th> <td>Diretório executável do servidor</td> <td>[[<code>PREFIX/bin</code>]]</td> </tr><tr><th>[[<code>INSTALL_SECURE_FILE_PRIVDIR</code>]]</th> <td>Valor padrão de secure_file_priv</td> <td>[[<code>platform specific</code>]]</td> </tr><tr><th>[[<code>INSTALL_SHAREDIR</code>]]</th> <td>diretório de instalação aclocal/mysql.m4</td> <td>[[<code>COMPILATION_COMMENT</code><code>INSTALL_PKGCONFIGDIR</code>]</td> </tr><tr><th>[[<code>COMPILATION_COMMENT</code><code>INSTALL_PKGCONFIGDIR</code>]</th> <td>Se instalar bibliotecas estáticas</td> <td>[[<code>COMPILATION_COMMENT</code><code>INSTALL_PLUGINDIR</code>]</td> </tr><tr><th>[[<code>COMPILATION_COMMENT</code><code>PREFIX/lib/plugin</code>]</th> <td>Diretório de arquivos de suporte adicionais</td> <td>[[<code>COMPILATION_COMMENT</code><code>INSTALL_PRIV_LIBDIR</code>]</td> </tr><tr><th>[[<code>COMPILATION_COMMENT</code><code>INSTALL_SBINDIR</code>]</th> <td>Se a ordem dos símbolos no sistema binário mysqld deve ser aleatória</td> <td>[[<code>COMPILATION_COMMENT</code><code>PREFIX/bin</code>]</td> </tr><tr><th>[[<code>COMPILATION_COMMENT</code><code>INSTALL_SECURE_FILE_PRIVDIR</code>]</th> <td>Valor de semente para a opção LINK_RANDOMIZE</td> <td>[[<code>COMPILATION_COMMENT</code><code>platform specific</code>]</td> </tr><tr><th>[[<code>COMPILATION_COMMENT</code><code>INSTALL_SHAREDIR</code>]</th> <td>Índices máximos por quadro</td> <td>[[<code>COMPILATION_COMMENT_SERVER</code><code>INSTALL_PKGCONFIGDIR</code>]</td> </tr><tr><th>[[<code>COMPILATION_COMMENT_SERVER</code><code>INSTALL_PKGCONFIGDIR</code>]</th> <td>Ativar a análise do código MSVC.</td> <td>[[<code>COMPILATION_COMMENT_SERVER</code><code>INSTALL_PLUGINDIR</code>]</td> </tr><tr><th>[[<code>COMPILATION_COMMENT_SERVER</code><code>PREFIX/lib/plugin</code>]</th> <td>Tipo InnoDB mutex</td> <td>[[<code>COMPILATION_COMMENT_SERVER</code><code>INSTALL_PRIV_LIBDIR</code>]</td> </tr><tr><th>[[<code>COMPILATION_COMMENT_SERVER</code><code>INSTALL_SBINDIR</code>]</th> <td>Número de porta TCP/IP utilizado pelo X Plugin</td> <td>[[<code>COMPILATION_COMMENT_SERVER</code><code>PREFIX/bin</code>]</td> </tr><tr><th>[[<code>COMPILATION_COMMENT_SERVER</code><code>INSTALL_SECURE_FILE_PRIVDIR</code>]</th> <td>Arquivo de soquete do Unix usado pelo X Plugin</td> <td>[[<code>COMPILATION_COMMENT_SERVER</code><code>platform specific</code>]</td> </tr><tr><th>[[<code>COMPILATION_COMMENT_SERVER</code><code>INSTALL_SHAREDIR</code>]</th> <td>Repertório de dados</td> <td></td> </tr><tr><th>[[<code>COMPRESS_DEBUG_SECTIONS</code><code>INSTALL_PKGCONFIGDIR</code>]</th> <td>Ativar ou não o ambiente de desenvolvimento específico do mantenedor do MySQL</td> <td>[[<code>COMPRESS_DEBUG_SECTIONS</code><code>INSTALL_PKGCONFIGDIR</code>]</td> </tr><tr><th>[[<code>COMPRESS_DEBUG_SECTIONS</code><code>INSTALL_PLUGINDIR</code>]</th> <td>Nome do projeto Windows/macOS</td> <td>[[<code>COMPRESS_DEBUG_SECTIONS</code><code>PREFIX/lib/plugin</code>]</td> </tr><tr><th>[[<code>COMPRESS_DEBUG_SECTIONS</code><code>INSTALL_PRIV_LIBDIR</code>]</th> <td>Número da porta TCP/IP</td> <td>[[<code>COMPRESS_DEBUG_SECTIONS</code><code>INSTALL_SBINDIR</code>]</td> </tr><tr><th>[[<code>COMPRESS_DEBUG_SECTIONS</code><code>PREFIX/bin</code>]</th> <td>Arquivo de soquete Unix</td> <td>[[<code>COMPRESS_DEBUG_SECTIONS</code><code>INSTALL_SECURE_FILE_PRIVDIR</code>]</td> </tr><tr><th>[[<code>COMPRESS_DEBUG_SECTIONS</code><code>platform specific</code>]</th> <td>Fazer com que as ferramentas NDB sejam ligadas dinamicamente ao cliente NDB</td> <td></td> </tr><tr><th>[[<code>COMPRESS_DEBUG_SECTIONS</code><code>INSTALL_SHAREDIR</code>]</th> <td>ODBC inclui diretório</td> <td></td> </tr><tr><th>[[<code>OFF</code><code>INSTALL_PKGCONFIGDIR</code>]</th> <td>Diretório da biblioteca ODBC</td> <td></td> </tr><tr><th>[[<code>OFF</code><code>INSTALL_PKGCONFIGDIR</code>]</th> <td>Se o rastreamento do optimizador deve ser suportado</td> <td></td> </tr><tr><th>[[<code>OFF</code><code>INSTALL_PLUGINDIR</code>]</th> <td>Se otimizar construções de desinfetante</td> <td>[[<code>OFF</code><code>PREFIX/lib/plugin</code>]</td> </tr><tr><th>[[<code>OFF</code><code>INSTALL_PRIV_LIBDIR</code>]</th> <td>Tome cuidado extra para criar um resultado de construção independente de construção local e tempo</td> <td></td> </tr><tr><th>[[<code>OFF</code><code>INSTALL_SBINDIR</code>]</th> <td>Se mostrar avisos de compilador suprimidos e não falhar com -Werror.</td> <td>[[<code>OFF</code><code>PREFIX/bin</code>]</td> </tr><tr><th>[[<code>OFF</code><code>INSTALL_SECURE_FILE_PRIVDIR</code>]</th> <td>Diretório de arquivos de opções</td> <td></td> </tr><tr><th>[[<code>OFF</code><code>platform specific</code>]</th> <td>Directório para arquivo PID sob systemd</td> <td>[[<code>OFF</code><code>INSTALL_SHAREDIR</code>]</td> </tr><tr><th>[[<code>CPACK_MONOLITHIC_INSTALL</code><code>INSTALL_PKGCONFIGDIR</code>]</th> <td>Nome do serviço MySQL sob systemd</td> <td>[[<code>CPACK_MONOLITHIC_INSTALL</code><code>INSTALL_PKGCONFIGDIR</code>]</td> </tr><tr><th>[[<code>CPACK_MONOLITHIC_INSTALL</code><code>INSTALL_PLUGINDIR</code>]</th> <td>Valor padrão de tmpdir</td> <td></td> </tr><tr><th>[[<code>CPACK_MONOLITHIC_INSTALL</code><code>PREFIX/lib/plugin</code>]</th> <td>Se desativar a função inlining</td> <td>[[<code>CPACK_MONOLITHIC_INSTALL</code><code>INSTALL_PRIV_LIBDIR</code>]</td> </tr><tr><th>[[<code>CPACK_MONOLITHIC_INSTALL</code><code>INSTALL_SBINDIR</code>]</th> <td>Não construa o servidor; apenas para uso interno</td> <td>[[<code>CPACK_MONOLITHIC_INSTALL</code><code>PREFIX/bin</code>]</td> </tr><tr><th>[[<code>CPACK_MONOLITHIC_INSTALL</code><code>INSTALL_SECURE_FILE_PRIVDIR</code>]</th> <td>Excluir o motor de armazenamento xxx da construção</td> <td></td> </tr><tr><th>[[<code>CPACK_MONOLITHIC_INSTALL</code><code>platform specific</code>]</th> <td>Caminho para a Ant para a construção do wrapper Java GCS</td> <td></td> </tr><tr><th>[[<code>CPACK_MONOLITHIC_INSTALL</code><code>INSTALL_SHAREDIR</code>]</th> <td>Ativar AddressSanitizer</td> <td>[[<code>OFF</code><code>INSTALL_PKGCONFIGDIR</code>]</td> </tr><tr><th>[[<code>OFF</code><code>INSTALL_PKGCONFIGDIR</code>]</th> <td>Ativar AddressSanitizer -fsanitize-address-use-after-scope Clang flag</td> <td>[[<code>OFF</code><code>INSTALL_PLUGINDIR</code>]</td> </tr><tr><th>[[<code>OFF</code><code>PREFIX/lib/plugin</code>]</th> <td>Ativado automaticamente se qualquer plug-in de autenticação de servidor correspondente estiver construído</td> <td></td> </tr><tr><th>[[<code>OFF</code><code>INSTALL_PRIV_LIBDIR</code>]</th> <td>Se deve ser comunicado um erro se os plugins de autenticação LDAP não puderem ser construídos</td> <td>[[<code>OFF</code><code>INSTALL_SBINDIR</code>]</td> </tr><tr><th>[[<code>OFF</code><code>PREFIX/bin</code>]</th> <td>Construir plugin de autenticação PAM</td> <td>[[<code>OFF</code><code>INSTALL_SECURE_FILE_PRIVDIR</code>]</td> </tr><tr><th>[[<code>OFF</code><code>platform specific</code>]</th> <td>Localização do kit de desenvolvimento de software do Amazon Web Services</td> <td></td> </tr><tr><th>[[<code>OFF</code><code>INSTALL_SHAREDIR</code>]</th> <td>Em sistemas Linux, gerar um ID de compilação único</td> <td>[[<code>DEFAULT_CHARSET</code><code>INSTALL_PKGCONFIGDIR</code>]</td> </tr><tr><th>[[<code>DEFAULT_CHARSET</code><code>INSTALL_PKGCONFIGDIR</code>]</th> <td>Path de classes para usar ao criar o MySQL Cluster Connector para Java. O padrão é uma string vazia.</td> <td>[[<code>DEFAULT_CHARSET</code><code>INSTALL_PLUGINDIR</code>]</td> </tr><tr><th>[[<code>DEFAULT_CHARSET</code><code>PREFIX/lib/plugin</code>]</th> <td>Construir o protocolo de rastreamento do lado do cliente</td> <td>[[<code>DEFAULT_CHARSET</code><code>INSTALL_PRIV_LIBDIR</code>]</td> </tr><tr><th>[[<code>DEFAULT_CHARSET</code><code>INSTALL_SBINDIR</code>]</th> <td>Localização da biblioteca de curl</td> <td></td> </tr><tr><th>[[<code>DEFAULT_CHARSET</code><code>PREFIX/bin</code>]</th> <td>Se incluir suporte para depuração</td> <td>[[<code>DEFAULT_CHARSET</code><code>INSTALL_SECURE_FILE_PRIVDIR</code>]</td> </tr><tr><th>[[<code>DEFAULT_CHARSET</code><code>platform specific</code>]</th> <td>Se usar opções padrão do compilador</td> <td>[[<code>DEFAULT_CHARSET</code><code>INSTALL_SHAREDIR</code>]</td> </tr><tr><th>[[<code>utf8mb4</code><code>INSTALL_PKGCONFIGDIR</code>]</th> <td>Se adicionar o direito "get-task-allow" a todos os executáveis no macOS para gerar um core dump em caso de parada inesperada do servidor</td> <td>[[<code>utf8mb4</code><code>INSTALL_PKGCONFIGDIR</code>]</td> </tr><tr><th>[[<code>utf8mb4</code><code>INSTALL_PLUGINDIR</code>]</th> <td>Qual biblioteca libedit/editline usar</td> <td>[[<code>utf8mb4</code><code>PREFIX/lib/plugin</code>]</td> </tr><tr><th>[[<code>utf8mb4</code><code>INSTALL_PRIV_LIBDIR</code>]</th> <td>Permitir a injeção de erros no motor de armazenamento NDB. Não deve ser utilizado para a construção de binários destinados à produção.</td> <td>[[<code>utf8mb4</code><code>INSTALL_SBINDIR</code>]</td> </tr><tr><th>[[<code>utf8mb4</code><code>PREFIX/bin</code>]</th> <td>Tipo de suporte da UTI</td> <td>[[<code>utf8mb4</code><code>INSTALL_SECURE_FILE_PRIVDIR</code>]</td> </tr><tr><th>[[<code>utf8mb4</code><code>platform specific</code>]</th> <td>Se incluir suporte extra de depuração para InnoDB.</td> <td>[[<code>utf8mb4</code><code>INSTALL_SHAREDIR</code>]</td> </tr><tr><th>[[<code>DEFAULT_COLLATION</code><code>INSTALL_PKGCONFIGDIR</code>]</th> <td>Se deve ligar com -ljemalloc</td> <td>[[<code>DEFAULT_COLLATION</code><code>INSTALL_PKGCONFIGDIR</code>]</td> </tr><tr><th>[[<code>DEFAULT_COLLATION</code><code>INSTALL_PLUGINDIR</code>]</th> <td>Se usar o LLVM ou molde linker</td> <td>[[<code>DEFAULT_COLLATION</code><code>PREFIX/lib/plugin</code>]</td> </tr><tr><th>[[<code>DEFAULT_COLLATION</code><code>INSTALL_PRIV_LIBDIR</code>]</th> <td>Qual biblioteca libevent usar</td> <td>[[<code>DEFAULT_COLLATION</code><code>INSTALL_SBINDIR</code>]</td> </tr><tr><th>[[<code>DEFAULT_COLLATION</code><code>PREFIX/bin</code>]</th> <td>Se incluir suporte para libwrap (wrappers TCP)</td> <td>[[<code>DEFAULT_COLLATION</code><code>INSTALL_SECURE_FILE_PRIVDIR</code>]</td> </tr><tr><th>[[<code>DEFAULT_COLLATION</code><code>platform specific</code>]</th> <td>Ativar ou não a ferramenta LOCK_ORDER</td> <td>[[<code>DEFAULT_COLLATION</code><code>INSTALL_SHAREDIR</code>]</td> </tr><tr><th>[[<code>utf8mb4_0900_ai_ci</code><code>INSTALL_PKGCONFIGDIR</code>]</th> <td>Se executar LeakSanitizer, sem AddressSanitizer</td> <td>[[<code>utf8mb4_0900_ai_ci</code><code>INSTALL_PKGCONFIGDIR</code>]</td> </tr><tr><th>[[<code>utf8mb4_0900_ai_ci</code><code>INSTALL_PLUGINDIR</code>]</th> <td>Ativar o optimizador de tempo de ligação</td> <td>[[<code>utf8mb4_0900_ai_ci</code><code>PREFIX/lib/plugin</code>]</td> </tr><tr><th>[[<code>utf8mb4_0900_ai_ci</code><code>INSTALL_PRIV_LIBDIR</code>]</th> <td>Tipo de suporte à biblioteca LZ4</td> <td>[[<code>utf8mb4_0900_ai_ci</code><code>INSTALL_SBINDIR</code>]</td> </tr><tr><th>[[<code>utf8mb4_0900_ai_ci</code><code>PREFIX/bin</code>]</th> <td>Compila MeCab</td> <td></td> </tr><tr><th>[[<code>utf8mb4_0900_ai_ci</code><code>INSTALL_SECURE_FILE_PRIVDIR</code>]</th> <td>Ativar o MemorySanitizer</td> <td>[[<code>utf8mb4_0900_ai_ci</code><code>platform specific</code>]</td> </tr><tr><th>[[<code>utf8mb4_0900_ai_ci</code><code>INSTALL_SHAREDIR</code>]</th> <td>Ativar o rastreamento de vazamento de memória Visual Studio CRT</td> <td>[[<code>DISABLE_PSI_COND</code><code>INSTALL_PKGCONFIGDIR</code>]</td> </tr><tr><th>[[<code>DISABLE_PSI_COND</code><code>INSTALL_PKGCONFIGDIR</code>]</th> <td>Desativar o protocolo X</td> <td>[[<code>DISABLE_PSI_COND</code><code>INSTALL_PLUGINDIR</code>]</td> </tr><tr><th>[[<code>DISABLE_PSI_COND</code><code>PREFIX/lib/plugin</code>]</th> <td>Construir o MySQL NDB Cluster, incluindo o motor de armazenamento NDB e todos os programas NDB</td> <td>[[<code>DISABLE_PSI_COND</code><code>INSTALL_PRIV_LIBDIR</code>]</td> </tr><tr><th>[[<code>DISABLE_PSI_COND</code><code>INSTALL_SBINDIR</code>]</th> <td>Crie programas de exemplo de API.</td> <td>[[<code>DISABLE_PSI_COND</code><code>PREFIX/bin</code>]</td> </tr><tr><th>[[<code>DISABLE_PSI_COND</code><code>INSTALL_SECURE_FILE_PRIVDIR</code>]</th> <td>NDB 8.0.30 e anterior: Construa o motor de armazenamento NDB. NDB 8.0.31 e posterior: Obsoleto; use WITH_NDB em vez disso</td> <td>[[<code>DISABLE_PSI_COND</code><code>platform specific</code>]</td> </tr><tr><th>[[<code>DISABLE_PSI_COND</code><code>INSTALL_SHAREDIR</code>]</th> <td>Antes da NDB 8.0.31, isso era apenas para uso interno.</td> <td>[[<code>OFF</code><code>INSTALL_PKGCONFIGDIR</code>]</td> </tr><tr><th>[[<code>OFF</code><code>INSTALL_PKGCONFIGDIR</code>]</th> <td>Construir um binário de nó de dados multithreaded</td> <td>[[<code>OFF</code><code>INSTALL_PLUGINDIR</code>]</td> </tr><tr><th>[[<code>OFF</code><code>PREFIX/lib/plugin</code>]</th> <td>Produzir uma compilação de depuração para testes ou solução de problemas.</td> <td>[[<code>OFF</code><code>INSTALL_PRIV_LIBDIR</code>]</td> </tr><tr><th>[[<code>OFF</code><code>INSTALL_SBINDIR</code>]</th> <td>Ativar a construção de suporte Java e ClusterJ. Ativado por padrão. Só suportado no MySQL Cluster.</td> <td>[[<code>OFF</code><code>PREFIX/bin</code>]</td> </tr><tr><th>[[<code>OFF</code><code>INSTALL_SECURE_FILE_PRIVDIR</code>]</th> <td>Porta padrão usada por um servidor de gerenciamento construído com esta opção. Se esta opção não foi usada para construí-lo, a porta padrão do servidor de gerenciamento é 1186.</td> <td>[[<code>OFF</code><code>platform specific</code>]</td> </tr><tr><th>[[<code>OFF</code><code>INSTALL_SHAREDIR</code>]</th> <td>Incluir os programas de teste da API do NDB.</td> <td>[[<code>DISABLE_PSI_DATA_LOCK</code><code>INSTALL_PKGCONFIGDIR</code>]</td> </tr><tr><th>[[<code>DISABLE_PSI_DATA_LOCK</code><code>INSTALL_PKGCONFIGDIR</code>]</th> <td>Caminho padrão usado pelos programas NDB para procurar arquivos de certificado e chave TLS.</td> <td>[[<code>DISABLE_PSI_DATA_LOCK</code><code>INSTALL_PLUGINDIR</code>]</td> </tr><tr><th>[[<code>DISABLE_PSI_DATA_LOCK</code><code>PREFIX/lib/plugin</code>]</th> <td>Definição da política de atribuição de memória NUMA</td> <td></td> </tr><tr><th>[[<code>DISABLE_PSI_DATA_LOCK</code><code>INSTALL_PRIV_LIBDIR</code>]</th> <td>Para as bandeiras normalmente utilizadas para pacotes RPM/DEB, se devem ser adicionadas a compilações independentes nessas plataformas</td> <td></td> </tr><tr><th>[[<code>DISABLE_PSI_DATA_LOCK</code><code>INSTALL_SBINDIR</code>]</th> <td>Que pacote de Protocol Buffers usar</td> <td>[[<code>DISABLE_PSI_DATA_LOCK</code><code>PREFIX/bin</code>]</td> </tr><tr><th>[[<code>DISABLE_PSI_DATA_LOCK</code><code>INSTALL_SECURE_FILE_PRIVDIR</code>]</th> <td>Se construir plugins de ciclo de desenvolvimento rápido</td> <td>[[<code>DISABLE_PSI_DATA_LOCK</code><code>platform specific</code>]</td> </tr><tr><th>[[<code>DISABLE_PSI_DATA_LOCK</code><code>INSTALL_SHAREDIR</code>]</th> <td>Tipo de suporte ao RapidJSON</td> <td>[[<code>OFF</code><code>INSTALL_PKGCONFIGDIR</code>]</td> </tr><tr><th>[[<code>OFF</code><code>INSTALL_PKGCONFIGDIR</code>]</th> <td>Construir ou não Roteador MySQL</td> <td>[[<code>OFF</code><code>INSTALL_PLUGINDIR</code>]</td> </tr><tr><th>[[<code>OFF</code><code>PREFIX/lib/plugin</code>]</th> <td>Apenas para uso interno</td> <td></td> </tr><tr><th>[[<code>OFF</code><code>INSTALL_PRIV_LIBDIR</code>]</th> <td>Suporte para instruções de depuração SHOW PARSE_TREE</td> <td></td> </tr><tr><th>[[<code>OFF</code><code>INSTALL_SBINDIR</code>]</th> <td>Tipo de suporte SSL</td> <td>[[<code>OFF</code><code>PREFIX/bin</code>]</td> </tr><tr><th>[[<code>OFF</code><code>INSTALL_SECURE_FILE_PRIVDIR</code>]</th> <td>Permitir a instalação de arquivos de suporte do systemd</td> <td>[[<code>OFF</code><code>platform specific</code>]</td> </tr><tr><th>[[<code>OFF</code><code>INSTALL_SHAREDIR</code>]</th> <td>Ativar informações adicionais de depuração do sistema</td> <td>[[<code>DISABLE_PSI_ERROR</code><code>INSTALL_PKGCONFIGDIR</code>]</td> </tr><tr><th>[[<code>DISABLE_PSI_ERROR</code><code>INSTALL_PKGCONFIGDIR</code>]</th> <td>Defina o valor de sistema das opções de biblioteca não definidas explicitamente</td> <td>[[<code>DISABLE_PSI_ERROR</code><code>INSTALL_PLUGINDIR</code>]</td> </tr><tr><th>[[<code>DISABLE_PSI_ERROR</code><code>PREFIX/lib/plugin</code>]</th> <td>Se ligar com -ltcmalloc. BUNDLED é suportado apenas no Linux</td> <td>[[<code>DISABLE_PSI_ERROR</code><code>INSTALL_PRIV_LIBDIR</code>]</td> </tr><tr><th>[[<code>DISABLE_PSI_ERROR</code><code>INSTALL_SBINDIR</code>]</th> <td>Construir protocolo de teste plugin de rastreamento</td> <td>[[<code>DISABLE_PSI_ERROR</code><code>PREFIX/bin</code>]</td> </tr><tr><th>[[<code>DISABLE_PSI_ERROR</code><code>INSTALL_SECURE_FILE_PRIVDIR</code>]</th> <td>Ativar o ThreadSanitizer</td> <td>[[<code>DISABLE_PSI_ERROR</code><code>platform specific</code>]</td> </tr><tr><th>[[<code>DISABLE_PSI_ERROR</code><code>INSTALL_SHAREDIR</code>]</th> <td>Ativar Desinfetante de Comportamento Não Definido</td> <td>[[<code>OFF</code><code>INSTALL_PKGCONFIGDIR</code>]</td> </tr><tr><th>[[<code>OFF</code><code>INSTALL_PKGCONFIGDIR</code>]</th> <td>Compilar MySQL com testes unitários</td> <td>[[<code>OFF</code><code>INSTALL_PLUGINDIR</code>]</td> </tr><tr><th>[[<code>OFF</code><code>PREFIX/lib/plugin</code>]</th> <td>Ativar suporte a unixODBC</td> <td>[[<code>OFF</code><code>INSTALL_PRIV_LIBDIR</code>]</td> </tr><tr><th>[[<code>OFF</code><code>INSTALL_SBINDIR</code>]</th> <td>Se deve compilar em arquivos de cabeçalho Valgrind</td> <td>[[<code>OFF</code><code>PREFIX/bin</code>]</td> </tr><tr><th>[[<code>OFF</code><code>INSTALL_SECURE_FILE_PRIVDIR</code>]</th> <td>Caminho para o diretório que contém jemalloc.dll</td> <td></td> </tr><tr><th>[[<code>OFF</code><code>platform specific</code>]</th> <td>Tipo de suporte zlib</td> <td>[[<code>OFF</code><code>INSTALL_SHAREDIR</code>]</td> </tr><tr><th>[[<code>DISABLE_PSI_FILE</code><code>INSTALL_PKGCONFIGDIR</code>]</th> <td>Tipo de suporte zstd</td> <td>[[<code>DISABLE_PSI_FILE</code><code>INSTALL_PKGCONFIGDIR</code>]</td> </tr><tr><th>[[<code>DISABLE_PSI_FILE</code><code>INSTALL_PLUGINDIR</code>]</th> <td>Compilar o motor de armazenamento xxx estaticamente no servidor</td> <td></td> </tr></tbody></table>

#### Opções gerais

- `-DBUILD_CONFIG=mysql_release`

Esta opção configura uma distribuição de origem com as mesmas opções de compilação usadas pela Oracle para produzir distribuições binárias para lançamentos oficiais do MySQL.

- `-DWITH_BUILD_ID=bool`

Em sistemas Linux, gera um ID de compilação exclusivo que é usado como o valor da variável do sistema `build_id` e escrito no log do servidor MySQL na inicialização. Defina esta opção em `OFF` para desativar este recurso.

Esta opção não tem efeito em outras plataformas que não o Linux.

- `-DBUNDLE_RUNTIME_LIBRARIES=bool`

Se as bibliotecas de tempo de execução devem ser agrupadas com os pacotes MSI e Zip do servidor para Windows.

- `-DCMAKE_BUILD_TYPE=type`

Tipo de construção a produzir:

- `RelWithDebInfo`: Ativar otimizações e gerar informações de depuração. Este é o tipo de compilação padrão do MySQL.
- `Release`: Permite otimizações, mas omite informações de depuração para reduzir o tamanho da compilação.
- `Debug`: Desativar otimizações e gerar informações de depuração. Este tipo de compilação também é usado se a opção `WITH_DEBUG` estiver ativada. Isto é, `-DWITH_DEBUG=1` tem o mesmo efeito que `-DCMAKE_BUILD_TYPE=Debug`.

Os valores de opção `None` e `MinSizeRel` não são suportados.

- `-DCPACK_MONOLITHIC_INSTALL=bool`

Esta opção afeta se a operação `make package` produz múltiplos arquivos de pacote de instalação ou um único arquivo. Se desativada, a operação produz múltiplos arquivos de pacote de instalação, o que pode ser útil se você quiser instalar apenas um subconjunto de uma instalação completa do MySQL. Se ativada, produz um único arquivo para instalar tudo.

- `-DFORCE_INSOURCE_BUILD=bool`

Define se forçar uma compilação in-source. Recomenda-se compilações out-of-source, pois permitem várias compilações da mesma fonte, e a limpeza pode ser realizada rapidamente removendo o diretório de compilação. Para forçar uma compilação in-source, invoque `CMake` com `-DFORCE_INSOURCE_BUILD=ON`.

- `-DFORCE_COLORED_OUTPUT=bool`

Define se deve habilitar a saída colorida do compilador para `gcc` e `clang` ao compilar na linha de comando. Defaults para `OFF`.

#### Opções de layout da instalação

A opção `CMAKE_INSTALL_PREFIX` indica o diretório de instalação base. Outras opções com nomes da forma `INSTALL_xxx` que indicam a localização dos componentes são interpretadas em relação ao prefixo e seus valores são nomes de caminho relativos. Seus valores não devem incluir o prefixo.

- `-DCMAKE_INSTALL_PREFIX=dir_name`

O diretório da base de instalação.

Este valor pode ser definido na inicialização do servidor usando a opção `--basedir`.

- `-DINSTALL_BINDIR=dir_name`

Onde instalar programas de utilizador.

- `-DINSTALL_DOCDIR=dir_name`

Onde instalar a documentação.

- `-DINSTALL_DOCREADMEDIR=dir_name`

Onde instalar os arquivos `README`

- `-DINSTALL_INCLUDEDIR=dir_name`

Onde instalar arquivos de cabeçalho.

- `-DINSTALL_INFODIR=dir_name`

Onde instalar os ficheiros de informação.

- `-DINSTALL_LAYOUT=name`

Selecionar um layout de instalação predefinido:

- `STANDALONE`: O mesmo layout usado para os pacotes `.tar.gz` e `.zip`. Este é o padrão.
- `RPM`: Layout semelhante aos pacotes RPM.
- `SVR4`: Layout do pacote Solaris.
- `DEB`: layout de pacotes DEB (experimental).

Você pode selecionar um layout predefinido, mas modificar os locais de instalação de componentes individuais especificando outras opções.

```
cmake . -DINSTALL_LAYOUT=SVR4 -DMYSQL_DATADIR=/var/mysql/data
```

O valor `INSTALL_LAYOUT` determina o valor padrão da variável do sistema `secure_file_priv`.

- `-DINSTALL_LIBDIR=dir_name`

Onde instalar arquivos de biblioteca.

- `-DINSTALL_MANDIR=dir_name`

Onde instalar as páginas do manual.

- `-DINSTALL_MYSQLSHAREDIR=dir_name`

Onde instalar ficheiros de dados partilhados.

- `-DINSTALL_MYSQLTESTDIR=dir_name`

Onde instalar o diretório `mysql-test`. Para suprimir a instalação deste diretório, defina explicitamente a opção para o valor vazio `-DINSTALL_MYSQLTESTDIR=`.

- `-DINSTALL_PKGCONFIGDIR=dir_name`

O diretório no qual instalar o arquivo `mysqlclient.pc` para uso por `pkg-config`. O valor padrão é `INSTALL_LIBDIR/pkgconfig`, a menos que `INSTALL_LIBDIR` termine com `/mysql`, caso em que é removido primeiro.

- `-DINSTALL_PLUGINDIR=dir_name`

A localização do diretório do plugin.

Este valor pode ser definido na inicialização do servidor com a opção `--plugin_dir`.

- `-DINSTALL_PRIV_LIBDIR=dir_name`

A localização do diretório dinâmico da biblioteca.

\*\* Localização padrão. \*\* Para compilações RPM, este é `/usr/lib64/mysql/private/`, para DEB é `/usr/lib/mysql/private/`, e para TAR é `lib/private/`.

\*\* Protobuf. \*\* Como este é um local privado, o carregador (como `ld-linux.so` no Linux) pode não encontrar os arquivos `libprotobuf.so` sem ajuda. Para orientar o carregador, `RPATH=$ORIGIN/../$INSTALL_PRIV_LIBDIR` é adicionado a `mysqld` e `mysqlxtest`. Isso funciona para a maioria dos casos, mas ao usar o recurso de grupo de recursos, `mysqld` é `setsuid`, e o carregador ignora qualquer `RPATH` que contenha `$ORIGIN`. Para superar isso, um caminho completo explícito para o diretório é definido nas versões DEB e RPM do `mysqld`, uma vez que o destino é conhecido. Para tarballs, é necessária a instalação de patches do \[\[PH\_CODE\_CODE\_10]] com uma ferramenta como o `patchelf`.

- `-DINSTALL_SBINDIR=dir_name`

Onde instalar o servidor `mysqld`.

- `-DINSTALL_SECURE_FILE_PRIVDIR=dir_name`

O valor padrão para a variável do sistema `secure_file_priv` O valor padrão é específico da plataforma e depende do valor da opção `INSTALL_LAYOUT` `CMake`; consulte a descrição da variável do sistema `secure_file_priv` na Seção 7.1.8, Variáveis do Sistema do Servidor.

- `-DINSTALL_SHAREDIR=dir_name`

Onde instalar `aclocal/mysql.m4`.

- `-DINSTALL_STATIC_LIBRARIES=bool`

Se instalar bibliotecas estáticas. O padrão é `ON`. Se definido como `OFF`, estes arquivos de biblioteca não são instalados: `libmysqlclient.a`, `libmysqlservices.a`.

- `-DINSTALL_SUPPORTFILESDIR=dir_name`

Onde instalar ficheiros de suporte adicionais.

- `-DLINK_RANDOMIZE=bool`

Se a ordem dos símbolos no `mysqld` binário deve ser aleatória. O padrão é `OFF`. Esta opção deve ser ativada apenas para fins de depuração.

- `-DLINK_RANDOMIZE_SEED=val`

O valor de semente para a opção `LINK_RANDOMIZE` . O valor é uma string. O padrão é `mysql`, uma escolha arbitrária.

- `-DMYSQL_DATADIR=dir_name`

Localização do diretório de dados MySQL.

Este valor pode ser definido na inicialização do servidor com a opção `--datadir`.

- `-DODBC_INCLUDES=dir_name`

A localização do ODBC inclui o diretório, que pode ser utilizado durante a configuração do Connector/ODBC.

- `-DODBC_LIB_DIR=dir_name`

Localização do diretório da biblioteca ODBC, que pode ser utilizado durante a configuração do Connector/ODBC.

- `-DSYSCONFDIR=dir_name`

O diretório padrão do arquivo de opções `my.cnf`.

Esta localização não pode ser definida na inicialização do servidor, mas você pode iniciar o servidor com um determinado arquivo de opção usando a opção `--defaults-file=file_name`, onde `file_name` é o nome completo do caminho para o arquivo.

- `-DSYSTEMD_PID_DIR=dir_name`

O nome do diretório no qual criar o arquivo PID quando o MySQL é gerenciado pelo systemd. O padrão é `/var/run/mysqld`; isso pode ser alterado implicitamente de acordo com o valor `INSTALL_LAYOUT`.

Esta opção é ignorada a menos que o `WITH_SYSTEMD` esteja habilitado.

- `-DSYSTEMD_SERVICE_NAME=name`

O nome do serviço MySQL para usar quando o MySQL é gerenciado por `systemd`. O padrão é `mysqld`; isso pode ser alterado implicitamente de acordo com o valor `INSTALL_LAYOUT`.

Esta opção é ignorada a menos que o `WITH_SYSTEMD` esteja habilitado.

- `-DTMPDIR=dir_name`

A localização padrão a ser usada para a variável do sistema `tmpdir`. Se não especificado, o valor padrão é `P_tmpdir` em `<stdio.h>`.

#### Opções de motor de armazenamento

Os motores de armazenamento são construídos como plugins. Você pode construir um plugin como um módulo estático (compilado no servidor) ou um módulo dinâmico (construído como uma biblioteca dinâmica que deve ser instalada no servidor usando a instrução `INSTALL PLUGIN` ou a opção `--plugin-load` antes de poder ser usada). Alguns plugins podem não suportar construção estática ou dinâmica.

Os motores `InnoDB`, `MyISAM`, `MERGE`, `MEMORY`, e `CSV` são obrigatórios (sempre compilados no servidor) e não precisam ser instalados explicitamente.

Para compilar um motor de armazenamento estaticamente no servidor, use `-DWITH_engine_STORAGE_ENGINE=1`. Alguns valores `engine` permitidos são `ARCHIVE`, `BLACKHOLE`, `EXAMPLE`, e `FEDERATED`.

```
-DWITH_ARCHIVE_STORAGE_ENGINE=1
-DWITH_BLACKHOLE_STORAGE_ENGINE=1
```

Para criar o MySQL com suporte para o NDB Cluster, use a opção `WITH_NDB`.

::: info Note

Não é possível compilar sem o suporte do Performance Schema. Se for desejado compilar sem tipos específicos de instrumentação, isso pode ser feito com as seguintes opções de `CMake`:

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

Para excluir um motor de armazenamento da compilação, use `-DWITH_engine_STORAGE_ENGINE=0`.

```
-DWITH_ARCHIVE_STORAGE_ENGINE=0
-DWITH_EXAMPLE_STORAGE_ENGINE=0
-DWITH_FEDERATED_STORAGE_ENGINE=0
```

Também é possível excluir um motor de armazenamento da compilação usando `-DWITHOUT_engine_STORAGE_ENGINE=1` (mas `-DWITH_engine_STORAGE_ENGINE=0` é preferido).

```
-DWITHOUT_ARCHIVE_STORAGE_ENGINE=1
-DWITHOUT_EXAMPLE_STORAGE_ENGINE=1
-DWITHOUT_FEDERATED_STORAGE_ENGINE=1
```

Se nem `-DWITH_engine_STORAGE_ENGINE` nem `-DWITHOUT_engine_STORAGE_ENGINE` são especificados para um determinado motor de armazenamento, o motor é construído como um módulo compartilhado, ou excluído se não puder ser construído como um módulo compartilhado.

#### Opções de funcionalidade

- `-DADD_GDB_INDEX=bool`

Esta opção determina se deve habilitar a geração de uma seção `.gdb_index` em binários, o que torna o carregamento deles em um depurador mais rápido. A opção é desativada por padrão. O linker `lld` é usado, e é desativado por Ele não tem efeito se um linker diferente do `lld` ou GNU `gold` é usado.

- `-DCOMPILATION_COMMENT=string`

Um comentário descritivo sobre o ambiente de compilação. Enquanto o `mysqld` usa o `COMPILATION_COMMENT_SERVER`, outros programas usam o `COMPILATION_COMMENT`.

- `-DCOMPRESS_DEBUG_SECTIONS=bool`

Se comprimir as seções de depuração de executáveis binários (somente Linux). A compressão de seções de depuração executáveis economiza espaço ao custo de tempo extra da CPU durante o processo de compilação.

O padrão é `OFF`. Se essa opção não for definida explicitamente, mas a variável de ambiente `COMPRESS_DEBUG_SECTIONS` for definida, a opção toma seu valor dessa variável.

- `-DCOMPILATION_COMMENT_SERVER=string`

Um comentário descritivo sobre o ambiente de compilação para uso por `mysqld` (por exemplo, para definir a `version_comment` variável do sistema). Programas que não o servidor usam `COMPILATION_COMMENT`.

- `-DDEFAULT_CHARSET=charset_name`

O conjunto de caracteres do servidor. Por padrão, o MySQL usa o conjunto de caracteres `utf8mb4`.

- O \* CODE\_PH\_0\* pode ser um dos seguintes: \* CODE\_PH\_1 \* CODE\_PH\_2 \* CODE\_PH\_3 \* CODE\_PH\_4 \* CODE\_PH\_5 \* CODE\_PH\_6 \* CODE\_PH\_7 \* CODE\_PH\_8 \* CODE\_PH\_9 \* CODE\_PH\_10 \* CODE\_PH\_11 \* CODE\_PH\_12 \* CODE\_PH\_13 \* CODE\_PH\_14 \* CODE\_PH\_15 \* CODE\_PH\_16 \* CODE\_PH\_17 \* CODE\_PH\_18 \* CODE\_PH\_19 \* CODE\_PH\_20 \* CODE\_PH\_21 \* CODE\_PH\_22 \* CODE\_PH\_23 \* CODE\_PH\_24 \* CODE\_PH\_25 \* CODE\_PH\_10 \* CODE\_PH\_11 \* CODE\_PH\_12 \* CODE\_PH\_13 \* CODE\_PH\_14 \* CODE\_PH\_36 \* CODE\_CODE\_33 \* CODE\_CODE\_33 \* CODE\_CODE

Este valor pode ser definido na inicialização do servidor com a opção `--character-set-server`.

- `-DDEFAULT_COLLATION=collation_name`

A collação do servidor. Por padrão, o MySQL usa `utf8mb4_0900_ai_ci`. Use a instrução `SHOW COLLATION` para determinar quais collações estão disponíveis para cada conjunto de caracteres.

Este valor pode ser definido na inicialização do servidor com a opção `--collation_server`.

- `-DDISABLE_PSI_COND=bool`

Se excluir a instrumentação da condição do esquema de desempenho. O padrão é `OFF` (incluir).

- `-DDISABLE_PSI_FILE=bool`

Se excluir a instrumentação do arquivo de esquema de desempenho. O padrão é `OFF` (incluir).

- `-DDISABLE_PSI_IDLE=bool`

Se deve excluir a instrumentação ociosa do Performance Schema. O padrão é `OFF` (incluir).

- `-DDISABLE_PSI_MEMORY=bool`

Se excluir a instrumentação de memória do Performance Schema. O padrão é `OFF` (incluir).

- `-DDISABLE_PSI_METADATA=bool`

Se excluir a instrumentação de metadados do Performance Schema. O padrão é `OFF` (incluir).

- `-DDISABLE_PSI_MUTEX=bool`

Se excluir a instrumentação de mutex do Performance Schema. O padrão é `OFF` (incluir).

- `-DDISABLE_PSI_RWLOCK=bool`

Se deve excluir a instrumentação de bloqueio do esquema de desempenho. O padrão é `OFF` (incluir).

- `-DDISABLE_PSI_SOCKET=bool`

Se excluir a instrumentação do soquete do esquema de desempenho. O padrão é `OFF` (incluir).

- `-DDISABLE_PSI_SP=bool`

Se excluir a instrumentação do programa armazenado no Performance Schema. O padrão é `OFF` (incluir).

- `-DDISABLE_PSI_STAGE=bool`

Se excluir a instrumentação do estágio do esquema de desempenho. O padrão é `OFF` (incluir).

- `-DDISABLE_PSI_STATEMENT=bool`

Se excluir a instrumentação de instruções do Performance Schema. O padrão é `OFF` (incluir).

- `-DDISABLE_PSI_STATEMENT_DIGEST=bool`

Se deve excluir a instrumentação do resumo de instruções do esquema de desempenho. O padrão é `OFF` (incluir).

- `-DDISABLE_PSI_TABLE=bool`

Se excluir a instrumentação da tabela de esquema de desempenho. O padrão é `OFF` (incluir).

- `-DDISABLE_PSI_PS=bool`

Excluir a instrumentação de instâncias de instruções preparadas do Performance Schema. O padrão é `OFF` (incluir).

- `-DDISABLE_PSI_THREAD=bool`

Excluir a instrumentação do thread do Performance Schema. O padrão é `OFF` (incluir).

Desativar apenas os fios quando se constrói sem qualquer instrumentação, porque outras instrumentações têm uma dependência de fios.

- `-DDISABLE_PSI_TRANSACTION=bool`

Excluir a instrumentação de transação do Esquema de Desempenho. O padrão é `OFF` (incluir).

- `-DDISABLE_PSI_DATA_LOCK=bool`

Excluir a instrumentação de bloqueio de dados do esquema de desempenho. O padrão é `OFF` (incluir).

- `-DDISABLE_PSI_ERROR=bool`

Excluir a instrumentação de erro do servidor de esquema de desempenho. O padrão é `OFF` (incluir).

- `-DENABLE_EXPERIMENTAL_SYSVARS=bool`

Se deve habilitar variáveis experimentais do sistema. As variáveis experimentais do sistema são destinadas àqueles envolvidos no desenvolvimento do MySQL, devem ser usadas apenas em um ambiente de desenvolvimento ou teste, e podem ser removidas sem aviso prévio em uma versão futura do MySQL. Para informações sobre variáveis experimentais do sistema, consulte a `/storage/innobase/handler/ha_innodb.cc` na árvore de fontes do MySQL. As variáveis experimentais do sistema podem ser identificadas pesquisando `PLUGIN_VAR_EXPERIMENTAL`.

- `-DENABLE_GCOV=bool`

Se deve incluir suporte **gcov** (apenas Linux).

- `-DENABLE_GPROF=bool`

Se habilitar **gprof** (somente compilações otimizadas do Linux).

- `-DENABLED_LOCAL_INFILE=bool`

Esta opção controla a capacidade `LOCAL` compilada padrão para a biblioteca do cliente MySQL. Clientes que não fazem arranjos explícitos, portanto, têm a capacidade `LOCAL` desativada ou ativada de acordo com a configuração `ENABLED_LOCAL_INFILE` especificada no tempo de compilação do MySQL.

Por padrão, a biblioteca do cliente em distribuições binárias do MySQL é compilada com o `ENABLED_LOCAL_INFILE` desativado. Se você compilar o MySQL a partir do código-fonte, configure-o com o `ENABLED_LOCAL_INFILE` desativado ou habilitado com base em se os clientes que não fazem arranjos explícitos devem ter a capacidade do `LOCAL` desativada ou habilitada, respectivamente.

Para fazer com que o servidor explicitamente recuse ou permita instruções de código 4 (independentemente de como os programas e bibliotecas do cliente são configurados no tempo de compilação ou no tempo de execução), inicie o código 5 com o código 6 desativado ou ativado, respectivamente. O código 7 também pode ser definido no tempo de execução.

- `-DENABLED_PROFILING=bool`

Se o código de perfis de consulta deve ser habilitado (para as instruções `SHOW PROFILE` e `SHOW PROFILES`).

- `-DFORCE_UNSUPPORTED_COMPILER=bool`

Por padrão, `CMake` verifica as versões mínimas dos compiladores suportados; para desativar esta verificação, use `-DFORCE_UNSUPPORTED_COMPILER=ON`.

- `-DFPROFILE_GENERATE=bool`

Esta opção está disponível para experimentar com PGO com GCC. Veja `cmake/fprofile.cmake` na distribuição de origem do MySQL para informações sobre o uso de `FPROFILE_GENERATE` e `FPROFILE_USE`.

- `-DFPROFILE_USE=bool`

Se usar dados de otimização guiada por perfil (PGO). Esta opção está disponível para experimentar com PGO com GCC. Veja o arquivo `cmake/fprofile.cmake` em uma distribuição de fonte MySQL para informações sobre o uso de `FPROFILE_GENERATE` e `FPROFILE_USE`. Estas opções foram testadas com GCC 8 e 9.

Ativar `FPROFILE_USE` também ativa `WITH_LTO`.

- `-DHAVE_PSI_MEMORY_INTERFACE=bool`

Se o módulo de rastreamento de memória de esquema de desempenho deve ser ativado para funções de alocação de memória (funções de biblioteca `ut::aligned_name`) utilizadas no armazenamento dinâmico de tipos sobrealinhados.

- `-DIGNORE_AIO_CHECK=bool`

Se a opção `-DBUILD_CONFIG=mysql_release` for dada no Linux, a biblioteca `libaio` deve ser vinculada por padrão. Se você não tiver `libaio` ou não quiser instalá-lo, você pode suprimir a verificação especificando `-DIGNORE_AIO_CHECK=1`.

- `-DMAX_INDEXES=num`

O número máximo de índices por tabela. O padrão é 64. O máximo é 255. Valores menores que 64 são ignorados e o padrão de 64 é usado.

- `-DMYSQL_MAINTAINER_MODE=bool`

Se ativar um ambiente de desenvolvimento específico para o mantenedor do MySQL. Se ativada, esta opção faz com que os avisos do compilador se tornem erros.

- `-DWITH_DEVELOPER_ENTITLEMENTS=bool`

Se deve adicionar o direito `get-task-allow` a todos os executáveis para gerar um core dump no caso de uma parada inesperada do servidor.

No macOS 11+, os core dumps estão limitados a processos com o direito `com.apple.security.get-task-allow`, que esta opção CMake habilita. O direito permite que outros processos anexem e leiam/modifiquem a memória de processos, e permite que `--core-file` funcione como esperado.

- `-DMUTEX_TYPE=type`

O tipo de mutex usado por `InnoDB`.

- `event`: Use mutex de eventos. Este é o valor padrão e a implementação original de mutex `InnoDB`.
- `sys`: Use mutex POSIX em sistemas UNIX. Use objetos `CRITICAL_SECTION` no Windows, se disponível.
- `futex`: Use futexes do Linux em vez de variáveis de condição para agendar threads de espera.

* `-DMYSQLX_TCP_PORT=port_num`

O número de porta no qual o X Plugin escuta para conexões TCP/IP. O padrão é 33060.

Este valor pode ser definido na inicialização do servidor com a variável de sistema `mysqlx_port`.

- `-DMYSQLX_UNIX_ADDR=file_name`

O caminho do arquivo do soquete do Unix no qual o servidor escuta as conexões do soquete do X Plugin. Este deve ser um nome de caminho absoluto. O padrão é `/tmp/mysqlx.sock`.

Este valor pode ser definido na inicialização do servidor com a variável de sistema `mysqlx_port`.

- `-DMYSQL_PROJECT_NAME=name`

Para Windows ou macOS, o nome do projecto a incorporar no nome do ficheiro do projecto.

- `-DMYSQL_TCP_PORT=port_num`

O número de porta no qual o servidor escuta para conexões TCP/IP. O padrão é 3306.

Este valor pode ser definido na inicialização do servidor com a opção `--port`.

- `-DMYSQL_UNIX_ADDR=file_name`

O caminho do arquivo de soquete do Unix no qual o servidor escuta para conexões de soquete. Este deve ser um nome de caminho absoluto. O padrão é `/tmp/mysql.sock`.

Este valor pode ser definido na inicialização do servidor com a opção `--socket`.

- `-DOPTIMIZER_TRACE=bool`

Se o rastreamento do optimizador deve ser suportado, ver Secção 10.15, "Rastreamento do optimizador".

- `-DREPRODUCIBLE_BUILD=bool`

Para compilações em sistemas Linux, essa opção controla se deve ter cuidado extra para criar um resultado de compilação independente do local e do tempo de compilação.

Esta opção é padrão para `ON` para `RelWithDebInfo` compilações.

- `-DSHOW_SUPPRESSED_COMPILER_WARNINGS=bool`

Mostrar avisos de compilador suprimidos, e fazê-lo sem falhar com `-Werror`.

- `-DWIN_DEBUG_NO_INLINE=bool`

Se desativar a função de inlining no Windows. O padrão é `OFF` (inlining habilitado).

- `-DWITH_LD=string`

\[`CMake`] usa o linker padrão por padrão. Opcionalmente, passe em \[`lld`]] ou \[`mold`]] para especificar um linker alternativo. \[`mold`]] deve ser a versão 2 ou mais recente.

Esta opção pode ser usada em sistemas baseados em Linux que não o Enterprise Linux, que sempre usa o linker `ld`.

::: info Note

Anteriormente, a opção `USE_LD_LLD` poderia ser usada para habilitar (o padrão) ou desativar explicitamente o linker LLVM `lld` para Clang. No MySQL 8.3, `USE_LD_LLD` foi removido.

:::

- `-DWITH_ANT=path_name`

Defina o caminho para Ant, necessário ao construir o wrapper Java GCS. Defina `WITH_ANT` para o caminho de um diretório onde o tarball Ant ou arquivo descompactado é salvo. Quando `WITH_ANT` não é definido, ou é definido com o valor especial `system`, o processo de compilação assume que um `ant` binário existe em `$PATH`.

- `-DWITH_ASAN=bool`

Se habilitar o AddressSanitizer, para compiladores que o suportam. O padrão é `OFF`.

- `-DWITH_ASAN_SCOPE=bool`

Se deve habilitar o AddressSanitizer `-fsanitize-address-use-after-scope` Clang flag para detecção de uso após o escopo. O padrão está desativado. Para usar esta opção, `-DWITH_ASAN` também deve ser habilitado.

- `-DWITH_AUTHENTICATION_CLIENT_PLUGINS=bool`

Esta opção é ativada automaticamente se qualquer plug-in de autenticação de servidor correspondente for construído. Seu valor depende de outras opções de `CMake` e não deve ser definido explicitamente.

- `-DWITH_AUTHENTICATION_LDAP=bool`

Se deve ser comunicado um erro se os complementos de autenticação LDAP não puderem ser construídos:

- Se esta opção for desativada (o padrão), os plugins LDAP serão criados se os arquivos de cabeçalho e bibliotecas necessários forem encontrados. Se não forem, o `CMake` exibirá uma nota sobre isso.
- Se esta opção estiver habilitada, um fracasso em encontrar o arquivo de cabeçalho e as bibliotecas necessárias faz com que o CMake produza um erro, impedindo a construção do servidor.

* `-DWITH_AUTHENTICATION_PAM=bool`

Se construir o plugin de autenticação PAM, para árvores de origem que incluem este plugin. (Veja Seção 8.4.1.5, PAM Pluggable Authentication.) Se esta opção for especificada e o plugin não puder ser compilado, a compilação falhará.

- `-DWITH_AWS_SDK=path_name`

A localização do kit de desenvolvimento de software da Amazon Web Services.

- `-DWITH_CLIENT_PROTOCOL_TRACING=bool`

Se a estrutura de rastreamento de protocolo do lado do cliente deve ser construída na biblioteca do cliente. Por padrão, esta opção está habilitada.

Para obter informações sobre a escrita de protocolos de rastreamento de plugins de cliente, consulte Writing Protocol Trace Plugins.

Ver também a opção `WITH_TEST_TRACE_PLUGIN`.

- `-DWITH_CURL=curl_type`

A localização da biblioteca `curl`. `curl_type` pode ser `system` (use a biblioteca do sistema `curl`), um nome de caminho para a biblioteca `curl`, `no` para desativar o suporte ao curl, ou `bundled` para usar a distribuição de curl em bundle no `extra/curl/`.

- `-DWITH_DEBUG=bool`

Se deve incluir suporte à depuração.

Configurar o MySQL com suporte de depuração permite que você use a opção `--debug="d,parser_debug"` quando você inicia o servidor. Isso faz com que o analisador Bison que é usado para processar instruções SQL para despejar um rastreamento do analisador para a saída de erro padrão do servidor. Normalmente, esta saída é escrita para o log de erro.

A verificação de depuração de sincronização para o motor de armazenamento `InnoDB` é definida em `UNIV_DEBUG` e está disponível quando o suporte de depuração é compilado usando a opção `WITH_DEBUG`.

Para ativá-lo, inicie o `mysqld` com a opção `--debug-sync-timeout=N`, onde `N` é um valor de tempo de espera maior que 0. (O valor padrão é 0, que desativa o Debug Sync.) `N` torna-se o tempo de espera padrão para os pontos de sincronização individuais.

A verificação de depuração de sincronização para o motor de armazenamento `InnoDB` está disponível quando o suporte de depuração é compilado usando a opção `WITH_DEBUG`.

Para uma descrição da instalação Debug Sync e como usar pontos de sincronização, consulte MySQL Internals: Test Synchronization.

- `-DWITH_EDITLINE=value`

Quais bibliotecas de `libedit`/`editline` usar. Os valores permitidos são `bundled` (o padrão) e `system`.

- `-DWITH_ICU={icu_type|path_name}`

O MySQL usa International Components for Unicode (ICU) para suportar operações de expressão regular. A opção `WITH_ICU` indica o tipo de suporte da ICU a ser incluído ou o nome do caminho para a instalação da ICU a ser usada.

- `icu_type` pode ser um dos seguintes valores:

  - `bundled`: Use a biblioteca ICU incluída com a distribuição. Esta é a opção padrão e é a única opção suportada para o Windows.
  - `system`: Utilize a biblioteca da UTI do sistema.
- `path_name` é o nome do caminho para a instalação da UTI. Isso pode ser preferível ao uso do valor `icu_type` de `system` porque pode impedir que a CMake detecte e use uma versão antiga ou incorreta da UTI instalada no sistema. (Outra maneira permitida de fazer a mesma coisa é definir `WITH_ICU` para `system` e definir a opção `CMAKE_PREFIX_PATH` para `path_name`.)

* `-DWITH_INNODB_EXTRA_DEBUG=bool`

Se deve incluir suporte extra de depuração do InnoDB.

Ativando `WITH_INNODB_EXTRA_DEBUG` se ativam verificações de depuração de erros InnoDB extra. Esta opção só pode ser ativada quando `WITH_DEBUG` está ativado.

- `-DWITH_JEMALLOC=bool`

Se ligar com o `-ljemalloc`. Se ativado, as rotinas integradas `malloc()`, `calloc()`, `realloc()`, e `free()` são desativadas. O padrão é `OFF`.

`WITH_JEMALLOC` e `WITH_TCMALLOC` são mutuamente exclusivas.

- `-DWITH_LIBEVENT=string`

Qual biblioteca `libevent` usar. Os valores permitidos são `bundled` (padrão) e `system`. Se o `system` é especificado e nenhuma biblioteca `libevent` do sistema pode ser encontrada, um erro ocorre independentemente, e o pacote `libevent` não é usado.

A biblioteca `libevent` é requerida pelo Plugin X e pelo Roteador MySQL.

- `-DWITH_LIBWRAP=bool`

Se deve incluir suporte a `libwrap` (wrappers TCP).

- `-DWITH_LOCK_ORDER=bool`

Se a ferramenta LOCK\_ORDER deve ser habilitada. Por padrão, esta opção está desativada e as compilações do servidor não contêm ferramentas. Se a ferramenta estiver habilitada, a ferramenta LOCK\_ORDER está disponível e pode ser usada como descrito na Seção 7.9.3, A Ferramenta LOCK\_ORDER.

::: info Note

Com a opção `WITH_LOCK_ORDER` ativada, as compilações do MySQL requerem o programa `flex`.

:::

- `-DWITH_LSAN=bool`

Se o LeakSanitizer deve ser executado sem o AddressSanitizer. O padrão é `OFF`.

- `-DWITH_LTO=bool`

Se o link-time optimizer deve ser ativado, se o compilador o suportar. O padrão é `OFF` a menos que `FPROFILE_USE` esteja ativado.

- `-DWITH_LZ4=lz4_type`

A opção `WITH_LZ4` indica a fonte de suporte `zlib`:

- `bundled`: Use a biblioteca `lz4` incluída na distribuição.
- `system`: Use a biblioteca do sistema `lz4`.

* `-DWITH_MECAB={disabled|system|path_name}`

Se você instalou o MeCab em um diretório de instalação personalizado, especifique o caminho para a instalação do MeCab, por exemplo, `-DWITH_MECAB=/opt/mecab`. Se a opção `system` não funcionar, especificar o caminho de instalação do MeCab deve funcionar em todos os casos.

- `-DWITH_MSAN=bool`

Se ativar o MemorySanitizer, para compiladores que o suportam. O padrão está desativado.

Para que esta opção tenha efeito se ativada, todas as bibliotecas ligadas ao MySQL também devem ter sido compiladas com a opção ativada.

- `-DWITH_MSCRT_DEBUG=bool`

Se habilitar o rastreamento de vazamento de memória do Visual Studio CRT. O padrão é `OFF`.

- `-DMSVC_CPPCHECK=bool`

Se deve habilitar a análise de código MSVC. O padrão é `ON`.

- `-DWITH_MYSQLX=bool`

Se construir com suporte para X Plugin. O padrão é `ON`. Veja Capítulo 22, *Using MySQL as a Document Store*.

- `-DWITH_NUMA=bool`

Configure explicitamente a política de alocação de memória NUMA. `CMake` define o valor padrão `WITH_NUMA` com base em se a plataforma atual tem `NUMA` suporte. Para plataformas sem suporte NUMA, `CMake` se comporta da seguinte forma:

- Sem opção NUMA (o caso normal), `CMake` continua normalmente, produzindo apenas este aviso: biblioteca NUMA ausente ou versão requerida não disponível.
- Com `-DWITH_NUMA=ON`, `CMake` aborda com este erro: biblioteca NUMA ausente ou versão requerida não disponível.

* `-DWITH_PACKAGE_FLAGS=bool`

Para os flags normalmente usados para pacotes RPM e Debian, se adicioná-los a compilações autônomas nessas plataformas. O padrão é `ON` para compilações não debug.

- `-DWITH_PROTOBUF=protobuf_type`

Qual pacote de Protocol Buffers usar. `protobuf_type` pode ser um dos seguintes valores:

- `bundled`: Use o pacote incluído com a distribuição. Este é o padrão. Opcionalmente use `INSTALL_PRIV_LIBDIR` para modificar o diretório dinâmico da biblioteca Protobuf.
- `system`: Utilize o pacote instalado no sistema.

Outros valores são ignorados, com um fallback para `bundled`.

- `-DWITH_RAPID=bool`

Se construir os plugins de ciclo de desenvolvimento rápido. Quando ativado, um diretório `rapid` é criado na árvore de compilação contendo esses plugins. Quando desativado, nenhum diretório `rapid` é criado na árvore de compilação. O padrão é `ON`, a menos que o diretório `rapid` seja removido da árvore de origem, caso em que o padrão se torna `OFF`.

- `-DWITH_RAPIDJSON=rapidjson_type`

O tipo de suporte de biblioteca RapidJSON a incluir. `rapidjson_type` pode ser um dos seguintes valores:

- `bundled`: Use a biblioteca RapidJSON incluída na distribuição.
- `system`: Use a biblioteca RapidJSON do sistema. É necessária a versão 1.1.0 ou posterior.

* `-DWITH_ROUTER=bool`

Se construir o Roteador MySQL. O padrão é `ON`.

- `-DWITH_SASL=value`

Apenas para uso interno. Não é suportado no Windows.

- `-DWITH_SSL={ssl_type|path_name}`

Para suporte de conexões criptografadas, entropia para geração de números aleatórios e outras operações relacionadas à criptografia, o MySQL deve ser construído usando uma biblioteca SSL.

- \[`ssl_type`]] pode ser um dos seguintes valores:

  - `system`: Use a biblioteca OpenSSL do sistema. Este é o padrão.

    No macOS e no Windows, usar o `system` configura o MySQL para construir como se o CMake fosse invocado com o `path_name` aponta para uma biblioteca OpenSSL instalada manualmente. Isso ocorre porque eles não têm bibliotecas SSL do sistema. No macOS, \*brew install abre as instalações do \[\[SL\_SL]] para o `/usr/local/opt/openssl` para que o `system` possa encontrá-lo. No Windows, ele verifica o `%ProgramFiles%/OpenSSL`, `%ProgramFiles%/OpenSSL-Win32`, `%ProgramFiles%/OpenSSL-Win64`, `C:/OpenSSL`, `C:/OpenSSL-Win32`, e `C:/OpenSSL-Win64`.
  - `yes`: Este é um sinônimo de `system`.
  - `opensslversion`: Use um pacote de sistema OpenSSL alternativo, como `openssl11` no EL7, ou `openssl3` (ou `openssl3-fips`) no EL8.

    Os plugins de autenticação, como LDAP e Kerberos, estão desativados, pois não suportam essas versões alternativas do OpenSSL.
- `path_name` é o nome do caminho para a instalação do OpenSSL a ser usado. Isso pode ser preferível ao uso do valor \* `ssl_type` \* `system` porque pode impedir que a CMake detecte e use uma versão mais antiga ou incorreta do OpenSSL instalada no sistema. (Outra maneira permitida de fazer a mesma coisa é definir `WITH_SSL` para `system` e definir a opção `CMAKE_PREFIX_PATH` para `path_name`.)

* `-DWITH_SHOW_PARSE_TREE=bool`

Permite o suporte para `SHOW PARSE_TREE` no servidor, usado apenas no desenvolvimento e depuração. Não é usado para builds de lançamento ou suportado na produção.

- `-DWITH_SYSTEMD=bool`

Se a instalação de arquivos de suporte do `systemd` deve ser ativada. Por padrão, essa opção está desativada. Quando ativada, os arquivos de suporte do `systemd` são instalados, e scripts como o `mysqld_safe` e o script de inicialização do Sistema V não são instalados. Em plataformas onde o `systemd` não está disponível, ativar o `WITH_SYSTEMD` resulta em um erro do `CMake`.

Quando o servidor foi construído usando esta opção, o MySQL inclui todas as mensagens `systemd` no registro de erros do servidor (ver Seção 7.4.2, The Error Log).

Para obter mais informações sobre o uso de \[`systemd`], consulte a Seção 2.5.9, Gerenciando o MySQL Server com systemd. Essa seção também inclui informações sobre a especificação de opções especificadas de outra forma nos grupos de opções \[`[mysqld_safe]`]. Como \[`mysqld_safe`]] não é instalado quando \[`systemd`]] é usado, essas opções devem ser especificadas de outra maneira.

- `-DWITH_SYSTEM_LIBS=bool`

Esta opção serve como uma opção  guarda-chuva para definir o valor `system` de qualquer uma das seguintes `CMake` opções que não são definidas explicitamente: `WITH_CURL`, `WITH_EDITLINE`, `WITH_ICU`, `WITH_LIBEVENT`, `WITH_LZ4`, `WITH_LZMA`, `WITH_PROTOBUF`, `WITH_RE2`, `WITH_SSL`, `WITH_ZLIB`, `WITH_ZSTD`.

- `-DWITH_SYSTEMD_DEBUG=bool`

Se deve produzir informações adicionais de depuração de `systemd`, para plataformas nas quais `systemd` é usado para executar o MySQL. O padrão é `OFF`.

- `-DWITH_TCMALLOC=bool`

Se ligar com o `-ltcmalloc`. Se ativado, as rotinas integradas `malloc()`, `calloc()`, `realloc()`, e `free()` são desativadas. O padrão é `OFF`.

Começando com o MySQL 8.4.1, uma biblioteca `tcmalloc` está incluída na fonte; você pode fazer com que a compilação use a versão em pacote definindo essa opção para `BUNDLED`. `BUNDLED` é suportado apenas em sistemas Linux.

`WITH_TCMALLOC` e `WITH_JEMALLOC` são mutuamente exclusivas.

- `-DWITH_TEST_TRACE_PLUGIN=bool`

Se construir o plugin do cliente de rastreamento do protocolo de teste (ver Usando o Plugin de rastreamento do protocolo de teste). Por padrão, essa opção está desativada. Ativar essa opção não tem efeito a menos que a opção `WITH_CLIENT_PROTOCOL_TRACING` esteja ativada. Se o MySQL estiver configurado com ambas as opções ativadas, a biblioteca do cliente `libmysqlclient` é criada com o plugin de rastreamento do protocolo de teste incorporado e todos os clientes padrão do MySQL carregam o plugin. No entanto, mesmo quando o plugin de teste está ativado, ele não tem efeito por padrão. O controle sobre o plugin é oferecido usando variáveis de ambiente; veja Usando o Plugin de rastreamento do protocolo de teste.

::: info Note

Não habilite a opção `WITH_TEST_TRACE_PLUGIN` se você quiser usar seus próprios plugins de rastreamento de protocolo, porque apenas um desses plugins pode ser carregado de cada vez e ocorre um erro para tentativas de carregar um segundo. Se você já construiu o MySQL com o plugin de rastreamento de protocolo de teste habilitado para ver como ele funciona, você deve reconstruir o MySQL sem ele antes de poder usar seus próprios plugins.

:::

Para obter informações sobre como escrever plugins de rastreamento, consulte Plugins de rastreamento de protocolo de escrita.

- `-DWITH_TSAN=bool`

Se ativar o ThreadSanitizer, para compiladores que o suportam. O padrão está desativado.

- `-DWITH_UBSAN=bool`

Se ativar o Desinfetador de Comportamento Não Definido, para compiladores que o suportam. O padrão está desativado.

- `-DWITH_UNIT_TESTS={ON|OFF}`

Se ativado, compilar MySQL com testes unitários. O padrão é `ON` a menos que o servidor não esteja sendo compilado.

- `-DWITH_UNIXODBC=1`

Permite o suporte a unixODBC, para Connector/ODBC.

- `-DWITH_VALGRIND=bool`

Se deve compilar nos arquivos de cabeçalho do Valgrind, o que expõe a API do Valgrind ao código MySQL. O padrão é `OFF`.

Para gerar uma compilação de depuração consciente da Valgrind, o `-DWITH_VALGRIND=1` normalmente é combinado com o `-DWITH_DEBUG=1`.

- `-DWITH_WIN_JEMALLOC=string`

No Windows, passe em um caminho para um diretório contendo `jemalloc.dll` para habilitar a funcionalidade jemalloc. O sistema de compilação copia `jemalloc.dll` para o mesmo diretório que `mysqld.exe` e/ou `mysqld-debug.exe` e o utiliza para operações de gerenciamento de memória. Funções de memória padrão são usadas se `jemalloc.dll` não for encontrado ou não exportar as funções necessárias. Uma mensagem de registro de nível INFORMATION registra se o jemalloc é encontrado e usado ou

Esta opção está habilitada para binários oficiais do MySQL para Windows.

- `-DWITH_ZLIB=zlib_type`

Alguns recursos exigem que o servidor seja construído com suporte à biblioteca de compressão, como as funções `COMPRESS()` e `UNCOMPRESS()`, e compressão do protocolo cliente/servidor. A opção `WITH_ZLIB` indica a fonte de suporte `zlib`:

A versão mínima suportada de `zlib` é 1.2.13.

- `bundled`: Use a biblioteca `zlib` incluída na distribuição.
- `system`: Use a biblioteca do sistema `zlib`.

* `-DWITH_ZSTD=zstd_type`

A compressão de conexão usando o algoritmo `zstd` (ver Seção 6.2.8, Connection Compression Control) requer que o servidor seja construído com suporte à biblioteca `zstd`.

- `bundled`: Use a biblioteca `zstd` incluída na distribuição.
- `system`: Use a biblioteca do sistema `zstd`.

* `-DWITHOUT_SERVER=bool`

Se construir sem MySQL Server. O padrão é OFF, que faz construir o servidor.

Esta é considerada uma opção experimental; é preferível construir com o servidor.

Esta opção também impede a construção do `NDB` motor de armazenamento ou qualquer `NDB` binários, incluindo programas de gerenciamento e nó de dados.

#### Bandeiras do compilador

- `-DCMAKE_C_FLAGS="flags`"

Bandeiras para o compilador C.

- `-DCMAKE_CXX_FLAGS="flags`"

Bandeiras para o compilador C++.

- `-DWITH_DEFAULT_COMPILER_OPTIONS=bool`

Se usar as bandeiras de `cmake/build_configurations/compiler_options.cmake`.

::: info Note

Todas as bandeiras de otimização são cuidadosamente escolhidas e testadas pela equipe de construção do MySQL.

:::

- `-DOPTIMIZE_SANITIZER_BUILDS=bool`

Se deve adicionar `-O1 -fno-inline` às compilações de desinfetante. O padrão é `ON`.

Para especificar suas próprias bandeiras de compilador C e C ++, para bandeiras que não afetam a otimização, use as opções `CMAKE_C_FLAGS` e `CMAKE_CXX_FLAGS` CMake.

Ao fornecer seus próprios sinais de compilador, você pode especificar `CMAKE_BUILD_TYPE` também.

Por exemplo, para criar uma versão de lançamento de 32 bits em uma máquina Linux de 64 bits, faça isso:

```
$> mkdir build
$> cd build
$> cmake .. -DCMAKE_C_FLAGS=-m32 
  -DCMAKE_CXX_FLAGS=-m32 
  -DCMAKE_BUILD_TYPE=RelWithDebInfo
```

Se você definir as bandeiras que afetam a otimização (`-Onumber`), você deve definir as opções `CMAKE_C_FLAGS_build_type` e/ou `CMAKE_CXX_FLAGS_build_type`, onde `build_type` corresponde ao valor `CMAKE_BUILD_TYPE`. Para especificar uma otimização diferente para o tipo de compilação padrão (`RelWithDebInfo`), defina as opções `CMAKE_C_FLAGS_RELWITHDEBINFO` e `CMAKE_CXX_FLAGS_RELWITHDEBINFO`. Por exemplo, para compilar no Linux com `-O3` e com símbolos de depuração, faça o seguinte:

```
$> cmake .. -DCMAKE_C_FLAGS_RELWITHDEBINFO="-O3 -g" 
  -DCMAKE_CXX_FLAGS_RELWITHDEBINFO="-O3 -g"
```

#### CMake Opções para a Compilação de Cluster NDB

Para compilar com suporte para NDB Cluster, você pode usar `-DWITH_NDB`, o que faz com que a compilação inclua o motor de armazenamento NDB e todos os programas NDB. Esta opção está habilitada por padrão. Para evitar a compilação do plugin do motor de armazenamento NDB, use `-DWITH_NDBCLUSTER_STORAGE_ENGINE=OFF`. Outros aspectos da compilação podem ser controlados usando as outras opções listadas nesta seção.

As seguintes opções se aplicam ao criar as fontes MySQL com suporte ao cluster NDB.

- `-DNDB_UTILS_LINK_DYNAMIC={ON|OFF}`

Controla se os utilitários NDB, como `ndb_drop_table` estão ligados com `ndbclient` estaticamente (`OFF`) ou dinamicamente (`ON`); `OFF` (ligação estática) é o padrão. Normalmente, a ligação estática é usada ao construí-los para evitar problemas com `LD_LIBRARY_PATH`, ou quando várias versões de `ndbclient` estão instaladas. Esta opção destina-se a criar imagens Docker e possivelmente outros casos em que o ambiente de destino está sujeito a controle preciso e é desejável reduzir o tamanho da imagem.

- `-DWITH_CLASSPATH=path`

Define o caminho de classe para a construção do MySQL NDB Cluster Connector para Java. O padrão é vazio. Esta opção é ignorada se `-DWITH_NDB_JAVA=OFF` é usado.

- `-DWITH_ERROR_INSERT={ON|OFF}`

Permite a injeção de erro no kernel `NDB`. Apenas para testes; não destinado a ser usado na construção de binários de produção. O padrão é `OFF`.

- `-DWITH_NDB={ON|OFF}`

Crie o MySQL NDB Cluster; crie o plug-in NDB e todos os programas do NDB Cluster.

- `-DWITH_NDBAPI_EXAMPLES={ON|OFF}`

Crie programas de exemplo da API do NDB em `storage/ndb/ndbapi-examples/`.

- `-DWITH_NDBCLUSTER_STORAGE_ENGINE={ON|OFF}`

Controla (apenas) se o motor de armazenamento `NDBCLUSTER` está incluído na compilação; `WITH_NDB` habilita essa opção automaticamente, por isso é recomendado que você use `WITH_NDB` em vez disso.

- \[`-DWITH_NDBCLUSTER={ON|OFF}`]] (DEPRECADO)

Construir e vincular em suporte para o motor de armazenamento `NDB` em `mysqld`.

Esta opção está desatualizada e sujeita a eventual remoção; use `WITH_NDB` em vez disso.

- `-DWITH_NDBMTD={ON|OFF}`

Construir o node de dados multithread executável `ndbmtd`. O padrão é `ON`.

- `-DWITH_NDB_DEBUG={ON|OFF}`

Permitir a construção das versões de depuração dos binários do cluster NDB. Este é o `OFF` por padrão.

- `-DWITH_NDB_JAVA={ON|OFF}`

Permitir a construção de Cluster NDB com suporte Java, incluindo suporte para ClusterJ (ver MySQL NDB Cluster Connector para Java).

Esta opção é `ON` por padrão. Se você não deseja compilar o NDB Cluster com suporte ao Java, você deve desativá-lo explicitamente especificando `-DWITH_NDB_JAVA=OFF` ao executar `CMake`. Caso contrário, se o Java não puder ser encontrado, a configuração da compilação falhará.

- `-DWITH_NDB_PORT=port`

Faz com que o servidor de gerenciamento de cluster do NDB (`ndb_mgmd`) que é construído para usar este `port` por padrão. Se esta opção for desativada, o servidor de gerenciamento resultante tentará usar a porta 1186 por padrão.

- `-DWITH_NDB_TEST={ON|OFF}`

Se ativado, inclua um conjunto de programas de teste de API NDB. O padrão é `OFF`.

- `-DWITH_NDB_TLS_SEARCH_PATH=path`

Defina o caminho padrão pesquisado por `ndb_sign_keys` e outros programas `NDB` para arquivos de certificado e chave TLS.

O padrão para plataformas Windows é `$HOMEDIR/ndb-tls`; para outras plataformas, como Linux, é `$HOME/ndb-tls`.
