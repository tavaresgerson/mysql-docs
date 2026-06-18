### 2.8.7 Opções de configuração de fonte do MySQL

O programa **CMake** oferece um grande controle sobre como você configura uma distribuição de código-fonte do MySQL. Normalmente, você faz isso usando opções na linha de comando do **CMake**. Para obter informações sobre as opções suportadas pelo **CMake**, execute qualquer um desses comandos no diretório de código-fonte de nível superior:

```
$> cmake . -LH

$> ccmake .
```

Você também pode afetar o **CMake** usando certas variáveis de ambiente. Veja a Seção 6.9, “Variáveis de Ambiente”.

Para opções binárias, o valor pode ser especificado como `1` ou `ON` para habilitar a opção, ou como `0` ou `OFF` para desabilitar a opção.

Muitas opções configuram padrões de compilação que podem ser substituídos na inicialização do servidor. Por exemplo, as opções `CMAKE_INSTALL_PREFIX`, `MYSQL_TCP_PORT` e `MYSQL_UNIX_ADDR` que configuram a localização do diretório de instalação padrão, o número da porta TCP/IP e o arquivo de soquete Unix podem ser alteradas na inicialização do servidor com as opções `--basedir`, `--port` e `--socket` para o **mysqld**. Quando aplicável, as descrições das opções de configuração indicam a opção de inicialização correspondente do **mysqld**.

As seções a seguir fornecem mais informações sobre as opções do **CMake**.

- Referência de Opções do CMake
- Opções Gerais
- Opções de disposição da instalação
- Opções do Motor de Armazenamento
- Opções de recursos
- Ferramentas do compilador
- Opções do CMake para compilar o NDB Cluster

#### Referência de Opções do CMake

A tabela a seguir mostra as opções disponíveis do **CMake**. Na coluna `Default`, `PREFIX` representa o valor da opção `CMAKE_INSTALL_PREFIX`, que especifica o diretório de base de instalação. Esse valor é usado como localização pai para várias das subdiretórios de instalação.

**Tabela 2.14 Referência de Opções de Configuração de Fonte do MySQL (CMake)**

<table summary="Opções do CMake que estão disponíveis para configurar o MySQL ao compilar a partir da fonte."><thead><tr><th scope="col">Formulários</th> <th scope="col">Descrição</th> <th scope="col">Padrão</th> <th scope="col">Introduzido</th> <th scope="col">Removido</th> </tr></thead><tbody><tr><th>[[PH_HTML_CODE_<code>PREFIX/lib</code>]</th> <td>Se deve habilitar a geração da seção .gdb_index nos binários</td> <td></td> <td>8.0.18</td> <td></td> </tr><tr><th>[[PH_HTML_CODE_<code>PREFIX/lib</code>]</th> <td>Use as mesmas opções de compilação das versões oficiais</td> <td></td> <td></td> <td></td> </tr><tr><th>[[PH_HTML_CODE_<code>PREFIX/man</code>]</th> <td>Pacote as bibliotecas de tempo de execução com os pacotes MSI e Zip do servidor para Windows</td> <td>[[PH_HTML_CODE_<code>INSTALL_MYSQLKEYRINGDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[PH_HTML_CODE_<code>platform specific</code>]</th> <td>Tipo de construção a ser produzido</td> <td>[[PH_HTML_CODE_<code>INSTALL_MYSQLSHAREDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[PH_HTML_CODE_<code>PREFIX/share</code>]</th> <td>Bandeiras para Compilador C++</td> <td></td> <td></td> <td></td> </tr><tr><th>[[PH_HTML_CODE_<code>INSTALL_MYSQLTESTDIR</code>]</th> <td>Bandeiras para Compilador C</td> <td></td> <td></td> <td></td> </tr><tr><th>[[PH_HTML_CODE_<code>PREFIX/mysql-test</code>]</th> <td>Diretório de base de instalação</td> <td>[[PH_HTML_CODE_<code>INSTALL_PKGCONFIGDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>BUILD_CONFIG</code><code>PREFIX/lib</code>]</th> <td>Comentários sobre o ambiente de compilação</td> <td></td> <td></td> <td></td> </tr><tr><th>[[<code>BUILD_CONFIG</code><code>PREFIX/lib</code>]</th> <td>Comentários sobre o ambiente de compilação para uso pelo mysqld</td> <td></td> <td>8.0.14</td> <td></td> </tr><tr><th>[[<code>BUILD_CONFIG</code><code>PREFIX/man</code>]</th> <td>Compressar seções de depuração de executaveis binários</td> <td>[[<code>BUILD_CONFIG</code><code>INSTALL_MYSQLKEYRINGDIR</code>]</td> <td>8.0.22</td> <td></td> </tr><tr><th>[[<code>BUILD_CONFIG</code><code>platform specific</code>]</th> <td>Se a construção do pacote produz um único arquivo</td> <td>[[<code>BUILD_CONFIG</code><code>INSTALL_MYSQLSHAREDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>BUILD_CONFIG</code><code>PREFIX/share</code>]</th> <td>O conjunto de caracteres padrão do servidor</td> <td>[[<code>BUILD_CONFIG</code><code>INSTALL_MYSQLTESTDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>BUILD_CONFIG</code><code>PREFIX/mysql-test</code>]</th> <td>A colagem padrão do servidor</td> <td>[[<code>BUILD_CONFIG</code><code>INSTALL_PKGCONFIGDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>BUNDLE_RUNTIME_LIBRARIES</code><code>PREFIX/lib</code>]</th> <td>Excluir a instrumentação da condição do Schema de Desempenho</td> <td>[[<code>BUNDLE_RUNTIME_LIBRARIES</code><code>PREFIX/lib</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>BUNDLE_RUNTIME_LIBRARIES</code><code>PREFIX/man</code>]</th> <td>Exclua a instrumentação de bloqueio de dados do esquema de desempenho</td> <td>[[<code>BUNDLE_RUNTIME_LIBRARIES</code><code>INSTALL_MYSQLKEYRINGDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>BUNDLE_RUNTIME_LIBRARIES</code><code>platform specific</code>]</th> <td>Exclua a instrumentação de erro de esquema de desempenho do servidor</td> <td>[[<code>BUNDLE_RUNTIME_LIBRARIES</code><code>INSTALL_MYSQLSHAREDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>BUNDLE_RUNTIME_LIBRARIES</code><code>PREFIX/share</code>]</th> <td>Excluir a instrumentação do arquivo do Schema de Desempenho</td> <td>[[<code>BUNDLE_RUNTIME_LIBRARIES</code><code>INSTALL_MYSQLTESTDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>BUNDLE_RUNTIME_LIBRARIES</code><code>PREFIX/mysql-test</code>]</th> <td>Excluir a instrumentação de inatividade do Schema de desempenho</td> <td>[[<code>BUNDLE_RUNTIME_LIBRARIES</code><code>INSTALL_PKGCONFIGDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>OFF</code><code>PREFIX/lib</code>]</th> <td>Excluir a instrumentação de memória do Schema de desempenho</td> <td>[[<code>OFF</code><code>PREFIX/lib</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>OFF</code><code>PREFIX/man</code>]</th> <td>Excluir a instrumentação de metadados do Schema de Desempenho</td> <td>[[<code>OFF</code><code>INSTALL_MYSQLKEYRINGDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>OFF</code><code>platform specific</code>]</th> <td>Excluir a instrumentação do mutex do Schema de desempenho</td> <td>[[<code>OFF</code><code>INSTALL_MYSQLSHAREDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>OFF</code><code>PREFIX/share</code>]</th> <td>Exclua as declarações do esquema de desempenho preparadas</td> <td>[[<code>OFF</code><code>INSTALL_MYSQLTESTDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>OFF</code><code>PREFIX/mysql-test</code>]</th> <td>Exclua a instrumentação do esquema de desempenho rwlock</td> <td>[[<code>OFF</code><code>INSTALL_PKGCONFIGDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>CMAKE_BUILD_TYPE</code><code>PREFIX/lib</code>]</th> <td>Excluir a instrumentação de soquete do Schema de Desempenho</td> <td>[[<code>CMAKE_BUILD_TYPE</code><code>PREFIX/lib</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>CMAKE_BUILD_TYPE</code><code>PREFIX/man</code>]</th> <td>Excluir a instrumentação de programas armazenados do Schema de desempenho</td> <td>[[<code>CMAKE_BUILD_TYPE</code><code>INSTALL_MYSQLKEYRINGDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>CMAKE_BUILD_TYPE</code><code>platform specific</code>]</th> <td>Excluir a instrumentação da etapa do Schema de Desempenho</td> <td>[[<code>CMAKE_BUILD_TYPE</code><code>INSTALL_MYSQLSHAREDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>CMAKE_BUILD_TYPE</code><code>PREFIX/share</code>]</th> <td>Excluir a instrumentação da declaração do Schema de Desempenho</td> <td>[[<code>CMAKE_BUILD_TYPE</code><code>INSTALL_MYSQLTESTDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>CMAKE_BUILD_TYPE</code><code>PREFIX/mysql-test</code>]</th> <td>Exclua a instrumentação de declarações _digest do Schema de Desempenho</td> <td>[[<code>CMAKE_BUILD_TYPE</code><code>INSTALL_PKGCONFIGDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>RelWithDebInfo</code><code>PREFIX/lib</code>]</th> <td>Excluir a instrumentação da tabela do Schema de Desempenho</td> <td>[[<code>RelWithDebInfo</code><code>PREFIX/lib</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>RelWithDebInfo</code><code>PREFIX/man</code>]</th> <td>Exclua a instrumentação de fio do esquema de desempenho</td> <td>[[<code>RelWithDebInfo</code><code>INSTALL_MYSQLKEYRINGDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>RelWithDebInfo</code><code>platform specific</code>]</th> <td>Exclua a instrumentação de transações do esquema de desempenho</td> <td>[[<code>RelWithDebInfo</code><code>INSTALL_MYSQLSHAREDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>RelWithDebInfo</code><code>PREFIX/share</code>]</th> <td>Não construa bibliotecas compartilhadas, compile código dependente de posição</td> <td>[[<code>RelWithDebInfo</code><code>INSTALL_MYSQLTESTDIR</code>]</td> <td></td> <td>8.0.18</td> </tr><tr><th>[[<code>RelWithDebInfo</code><code>PREFIX/mysql-test</code>]</th> <td>Se você deve baixar a biblioteca Boost</td> <td>[[<code>RelWithDebInfo</code><code>INSTALL_PKGCONFIGDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>CMAKE_CXX_FLAGS</code><code>PREFIX/lib</code>]</th> <td>Tempo de espera em segundos para baixar a biblioteca Boost</td> <td>[[<code>CMAKE_CXX_FLAGS</code><code>PREFIX/lib</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>CMAKE_CXX_FLAGS</code><code>PREFIX/man</code>]</th> <td>Se ativar ou não a opção LOCAL para LOAD DATA</td> <td>[[<code>CMAKE_CXX_FLAGS</code><code>INSTALL_MYSQLKEYRINGDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>CMAKE_CXX_FLAGS</code><code>platform specific</code>]</th> <td>Se habilitar ou não o código de perfilamento de consultas</td> <td>[[<code>CMAKE_CXX_FLAGS</code><code>INSTALL_MYSQLSHAREDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>CMAKE_CXX_FLAGS</code><code>PREFIX/share</code>]</th> <td>Se você quer baixar arquivos opcionais</td> <td>[[<code>CMAKE_CXX_FLAGS</code><code>INSTALL_MYSQLTESTDIR</code>]</td> <td></td> <td>8.0.26</td> </tr><tr><th>[[<code>CMAKE_CXX_FLAGS</code><code>PREFIX/mysql-test</code>]</th> <td>Se habilitar ou não as variáveis de sistema InnoDB experimentais</td> <td>[[<code>CMAKE_CXX_FLAGS</code><code>INSTALL_PKGCONFIGDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>CMAKE_C_FLAGS</code><code>PREFIX/lib</code>]</th> <td>Se incluir suporte para gcov</td> <td></td> <td></td> <td></td> </tr><tr><th>[[<code>CMAKE_C_FLAGS</code><code>PREFIX/lib</code>]</th> <td>Ative o gprof (apenas para compilações otimizadas do Linux)</td> <td>[[<code>CMAKE_C_FLAGS</code><code>PREFIX/man</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>CMAKE_C_FLAGS</code><code>INSTALL_MYSQLKEYRINGDIR</code>]</th> <td>Se colorir a saída do compilador</td> <td>[[<code>CMAKE_C_FLAGS</code><code>platform specific</code>]</td> <td>8.0.33</td> <td></td> </tr><tr><th>[[<code>CMAKE_C_FLAGS</code><code>INSTALL_MYSQLSHAREDIR</code>]</th> <td>Se deve forçar uma compilação local</td> <td>[[<code>CMAKE_C_FLAGS</code><code>PREFIX/share</code>]</td> <td>8.0.14</td> <td></td> </tr><tr><th>[[<code>CMAKE_C_FLAGS</code><code>INSTALL_MYSQLTESTDIR</code>]</th> <td>Se permitir compiladores não suportados</td> <td>[[<code>CMAKE_C_FLAGS</code><code>PREFIX/mysql-test</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>CMAKE_C_FLAGS</code><code>INSTALL_PKGCONFIGDIR</code>]</th> <td>Se deve gerar dados de otimização guiados por perfil</td> <td>[[<code>CMAKE_INSTALL_PREFIX</code><code>PREFIX/lib</code>]</td> <td>8.0.19</td> <td></td> </tr><tr><th>[[<code>CMAKE_INSTALL_PREFIX</code><code>PREFIX/lib</code>]</th> <td>Se usar dados de otimização guiados por perfil</td> <td>[[<code>CMAKE_INSTALL_PREFIX</code><code>PREFIX/man</code>]</td> <td>8.0.19</td> <td></td> </tr><tr><th>[[<code>CMAKE_INSTALL_PREFIX</code><code>INSTALL_MYSQLKEYRINGDIR</code>]</th> <td>Ative o módulo de rastreamento de memória do esquema de desempenho para funções de alocação de memória usadas no armazenamento dinâmico de tipos superalinhados</td> <td>[[<code>CMAKE_INSTALL_PREFIX</code><code>platform specific</code>]</td> <td>8.0.26</td> <td></td> </tr><tr><th>[[<code>CMAKE_INSTALL_PREFIX</code><code>INSTALL_MYSQLSHAREDIR</code>]</th> <td>Com -DBUILD_CONFIG=mysql_release, ignore libaio check</td> <td>[[<code>CMAKE_INSTALL_PREFIX</code><code>PREFIX/share</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>CMAKE_INSTALL_PREFIX</code><code>INSTALL_MYSQLTESTDIR</code>]</th> <td>Diretório de executáveis do usuário</td> <td>[[<code>CMAKE_INSTALL_PREFIX</code><code>PREFIX/mysql-test</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>CMAKE_INSTALL_PREFIX</code><code>INSTALL_PKGCONFIGDIR</code>]</th> <td>Diretório de documentação</td> <td>[[<code>/usr/local/mysql</code><code>PREFIX/lib</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>/usr/local/mysql</code><code>PREFIX/lib</code>]</th> <td>Diretório do arquivo README</td> <td>[[<code>/usr/local/mysql</code><code>PREFIX/man</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>/usr/local/mysql</code><code>INSTALL_MYSQLKEYRINGDIR</code>]</th> <td>Diretório de arquivos de cabeçalho</td> <td>[[<code>/usr/local/mysql</code><code>platform specific</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>/usr/local/mysql</code><code>INSTALL_MYSQLSHAREDIR</code>]</th> <td>Diretório de arquivos de informações</td> <td>[[<code>/usr/local/mysql</code><code>PREFIX/share</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>/usr/local/mysql</code><code>INSTALL_MYSQLTESTDIR</code>]</th> <td>Selecionar o layout de instalação pré-definido</td> <td>[[<code>/usr/local/mysql</code><code>PREFIX/mysql-test</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>/usr/local/mysql</code><code>INSTALL_PKGCONFIGDIR</code>]</th> <td>Diretório de arquivos da biblioteca</td> <td>[[<code>PREFIX/lib</code>]]</td> <td></td> <td></td> </tr><tr><th>[[<code>COMPILATION_COMMENT</code><code>PREFIX/lib</code>]</th> <td>Diretório de páginas do manual</td> <td>[[<code>PREFIX/man</code>]]</td> <td></td> <td></td> </tr><tr><th>[[<code>INSTALL_MYSQLKEYRINGDIR</code>]]</th> <td>Diretório para o arquivo de dados do plugin keyring_file</td> <td>[[<code>platform specific</code>]]</td> <td></td> <td></td> </tr><tr><th>[[<code>INSTALL_MYSQLSHAREDIR</code>]]</th> <td>Diretório de dados compartilhados</td> <td>[[<code>PREFIX/share</code>]]</td> <td></td> <td></td> </tr><tr><th>[[<code>INSTALL_MYSQLTESTDIR</code>]]</th> <td>diretório mysql-test</td> <td>[[<code>PREFIX/mysql-test</code>]]</td> <td></td> <td></td> </tr><tr><th>[[<code>INSTALL_PKGCONFIGDIR</code>]]</th> <td>Diretório para o arquivo pkg-config mysqlclient.pc</td> <td>[[<code>COMPILATION_COMMENT_SERVER</code><code>PREFIX/lib</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>COMPILATION_COMMENT_SERVER</code><code>PREFIX/lib</code>]</th> <td>Diretório de plugins</td> <td>[[<code>COMPILATION_COMMENT_SERVER</code><code>PREFIX/man</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>COMPILATION_COMMENT_SERVER</code><code>INSTALL_MYSQLKEYRINGDIR</code>]</th> <td>Instalação do diretório de biblioteca privada</td> <td></td> <td>8.0.18</td> <td></td> </tr><tr><th>[[<code>COMPILATION_COMMENT_SERVER</code><code>platform specific</code>]</th> <td>Diretório de execução do servidor</td> <td>[[<code>COMPILATION_COMMENT_SERVER</code><code>INSTALL_MYSQLSHAREDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>COMPILATION_COMMENT_SERVER</code><code>PREFIX/share</code>]</th> <td>valor padrão de secure_file_priv</td> <td>[[<code>COMPILATION_COMMENT_SERVER</code><code>INSTALL_MYSQLTESTDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>COMPILATION_COMMENT_SERVER</code><code>PREFIX/mysql-test</code>]</th> <td>diretório de instalação aclocal/mysql.m4</td> <td>[[<code>COMPILATION_COMMENT_SERVER</code><code>INSTALL_PKGCONFIGDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>COMPRESS_DEBUG_SECTIONS</code><code>PREFIX/lib</code>]</th> <td>Se você deseja instalar bibliotecas estáticas</td> <td>[[<code>COMPRESS_DEBUG_SECTIONS</code><code>PREFIX/lib</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>COMPRESS_DEBUG_SECTIONS</code><code>PREFIX/man</code>]</th> <td>Diretório de arquivos de suporte extra</td> <td>[[<code>COMPRESS_DEBUG_SECTIONS</code><code>INSTALL_MYSQLKEYRINGDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>COMPRESS_DEBUG_SECTIONS</code><code>platform specific</code>]</th> <td>Se deve ou não randomizar a ordem dos símbolos no mysqld binary</td> <td>[[<code>COMPRESS_DEBUG_SECTIONS</code><code>INSTALL_MYSQLSHAREDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>COMPRESS_DEBUG_SECTIONS</code><code>PREFIX/share</code>]</th> <td>Valor da semente para a opção LINK_RANDOMIZE</td> <td>[[<code>COMPRESS_DEBUG_SECTIONS</code><code>INSTALL_MYSQLTESTDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>COMPRESS_DEBUG_SECTIONS</code><code>PREFIX/mysql-test</code>]</th> <td>Índices máximos por tabela</td> <td>[[<code>COMPRESS_DEBUG_SECTIONS</code><code>INSTALL_PKGCONFIGDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>OFF</code><code>PREFIX/lib</code>]</th> <td>Caminho para memcached; obsoleto</td> <td>[[<code>OFF</code><code>PREFIX/lib</code>]</td> <td></td> <td>8.0.23</td> </tr><tr><th>[[<code>OFF</code><code>PREFIX/man</code>]</th> <td>Ative a análise de código MSVC.</td> <td>[[<code>OFF</code><code>INSTALL_MYSQLKEYRINGDIR</code>]</td> <td>8.0.33</td> <td></td> </tr><tr><th>[[<code>OFF</code><code>platform specific</code>]</th> <td>Tipo de mútuo InnoDB</td> <td>[[<code>OFF</code><code>INSTALL_MYSQLSHAREDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>OFF</code><code>PREFIX/share</code>]</th> <td>Número de porta TCP/IP usado pelo X Plugin</td> <td>[[<code>OFF</code><code>INSTALL_MYSQLTESTDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>OFF</code><code>PREFIX/mysql-test</code>]</th> <td>Arquivo de socket Unix usado pelo Plugin X</td> <td>[[<code>OFF</code><code>INSTALL_PKGCONFIGDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>CPACK_MONOLITHIC_INSTALL</code><code>PREFIX/lib</code>]</th> <td>Diretório de dados</td> <td></td> <td></td> <td></td> </tr><tr><th>[[<code>CPACK_MONOLITHIC_INSTALL</code><code>PREFIX/lib</code>]</th> <td>Se ativar ou não o ambiente de desenvolvimento específico para o mantenedor do MySQL</td> <td>[[<code>CPACK_MONOLITHIC_INSTALL</code><code>PREFIX/man</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>CPACK_MONOLITHIC_INSTALL</code><code>INSTALL_MYSQLKEYRINGDIR</code>]</th> <td>Nome do projeto do Windows/macOS</td> <td>[[<code>CPACK_MONOLITHIC_INSTALL</code><code>platform specific</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>CPACK_MONOLITHIC_INSTALL</code><code>INSTALL_MYSQLSHAREDIR</code>]</th> <td>Número de porta TCP/IP</td> <td>[[<code>CPACK_MONOLITHIC_INSTALL</code><code>PREFIX/share</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>CPACK_MONOLITHIC_INSTALL</code><code>INSTALL_MYSQLTESTDIR</code>]</th> <td>Arquivo de soquete Unix</td> <td>[[<code>CPACK_MONOLITHIC_INSTALL</code><code>PREFIX/mysql-test</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>CPACK_MONOLITHIC_INSTALL</code><code>INSTALL_PKGCONFIGDIR</code>]</th> <td>Faça com que as ferramentas do NDB sejam vinculadas dinamicamente ao ndbclient</td> <td></td> <td>8.0.22</td> <td></td> </tr><tr><th>[[<code>OFF</code><code>PREFIX/lib</code>]</th> <td>ODBC inclui diretório</td> <td></td> <td></td> <td></td> </tr><tr><th>[[<code>OFF</code><code>PREFIX/lib</code>]</th> <td>Diretório da biblioteca ODBC</td> <td></td> <td></td> <td></td> </tr><tr><th>[[<code>OFF</code><code>PREFIX/man</code>]</th> <td>Se você deseja ou não suportar o rastreamento do otimizador</td> <td></td> <td></td> <td></td> </tr><tr><th>[[<code>OFF</code><code>INSTALL_MYSQLKEYRINGDIR</code>]</th> <td>Se otimizar as construções de desinfetante</td> <td>[[<code>OFF</code><code>platform specific</code>]</td> <td>8.0.34</td> <td></td> </tr><tr><th>[[<code>OFF</code><code>INSTALL_MYSQLSHAREDIR</code>]</th> <td>Tenha cuidado extra para criar um resultado de construção independente da localização e do horário da construção</td> <td></td> <td></td> <td></td> </tr><tr><th>[[<code>OFF</code><code>PREFIX/share</code>]</th> <td>Se deve mostrar avisos de compilador suprimidos e não falhar com -Werror.</td> <td>[[<code>OFF</code><code>INSTALL_MYSQLTESTDIR</code>]</td> <td>8.0.30</td> <td></td> </tr><tr><th>[[<code>OFF</code><code>PREFIX/mysql-test</code>]</th> <td>Diretório de arquivos de opção</td> <td></td> <td></td> <td></td> </tr><tr><th>[[<code>OFF</code><code>INSTALL_PKGCONFIGDIR</code>]</th> <td>Diretório para arquivos PID no systemd</td> <td>[[<code>DEFAULT_CHARSET</code><code>PREFIX/lib</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>DEFAULT_CHARSET</code><code>PREFIX/lib</code>]</th> <td>Nome do serviço MySQL no systemd</td> <td>[[<code>DEFAULT_CHARSET</code><code>PREFIX/man</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>DEFAULT_CHARSET</code><code>INSTALL_MYSQLKEYRINGDIR</code>]</th> <td>valor padrão de tmpdir</td> <td></td> <td></td> <td></td> </tr><tr><th>[[<code>DEFAULT_CHARSET</code><code>platform specific</code>]</th> <td>Se usar o linkador GNU gold</td> <td>[[<code>DEFAULT_CHARSET</code><code>INSTALL_MYSQLSHAREDIR</code>]</td> <td></td> <td>8.0.31</td> </tr><tr><th>[[<code>DEFAULT_CHARSET</code><code>PREFIX/share</code>]</th> <td>Se usar o linkador LLVM lld</td> <td>[[<code>DEFAULT_CHARSET</code><code>INSTALL_MYSQLTESTDIR</code>]</td> <td>8.0.16</td> <td></td> </tr><tr><th>[[<code>DEFAULT_CHARSET</code><code>PREFIX/mysql-test</code>]</th> <td>Se desabilitar a inlining de funções</td> <td>[[<code>DEFAULT_CHARSET</code><code>INSTALL_PKGCONFIGDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>utf8mb4</code><code>PREFIX/lib</code>]</th> <td>Não construa o servidor; uso interno apenas</td> <td>[[<code>utf8mb4</code><code>PREFIX/lib</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>utf8mb4</code><code>PREFIX/man</code>]</th> <td>Exclua o motor de armazenamento xxx da construção</td> <td></td> <td></td> <td></td> </tr><tr><th>[[<code>utf8mb4</code><code>INSTALL_MYSQLKEYRINGDIR</code>]</th> <td>Caminho para Ant para construir o wrapper do GCS Java</td> <td></td> <td></td> <td></td> </tr><tr><th>[[<code>utf8mb4</code><code>platform specific</code>]</th> <td>Ative o AddressSanitizer</td> <td>[[<code>utf8mb4</code><code>INSTALL_MYSQLSHAREDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>utf8mb4</code><code>PREFIX/share</code>]</th> <td>Ative a bandeira Clang -fsanitize-address-use-after-scope AddressSanitizer</td> <td>[[<code>utf8mb4</code><code>INSTALL_MYSQLTESTDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>utf8mb4</code><code>PREFIX/mysql-test</code>]</th> <td>Ativado automaticamente se houver plugins de autenticação de servidor correspondentes construídos</td> <td></td> <td>8.0.26</td> <td></td> </tr><tr><th>[[<code>utf8mb4</code><code>INSTALL_PKGCONFIGDIR</code>]</th> <td>Se deve relatar um erro se os plugins de autenticação LDAP não puderem ser construídos</td> <td>[[<code>DEFAULT_COLLATION</code><code>PREFIX/lib</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>DEFAULT_COLLATION</code><code>PREFIX/lib</code>]</th> <td>Construa o plugin de autenticação PAM</td> <td>[[<code>DEFAULT_COLLATION</code><code>PREFIX/man</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>DEFAULT_COLLATION</code><code>INSTALL_MYSQLKEYRINGDIR</code>]</th> <td>Localização do kit de desenvolvimento de software da Amazon Web Services</td> <td></td> <td></td> <td></td> </tr><tr><th>[[<code>DEFAULT_COLLATION</code><code>platform specific</code>]</th> <td>Localização das fontes do Boost Library</td> <td></td> <td></td> <td></td> </tr><tr><th>[[<code>DEFAULT_COLLATION</code><code>INSTALL_MYSQLSHAREDIR</code>]</th> <td>Em sistemas Linux, gere um ID de compilação único</td> <td>[[<code>DEFAULT_COLLATION</code><code>PREFIX/share</code>]</td> <td>8.0.31</td> <td></td> </tr><tr><th>[[<code>DEFAULT_COLLATION</code><code>INSTALL_MYSQLTESTDIR</code>]</th> <td>Use libevent empacotado ao construir ndbmemcache; obsoleto</td> <td>[[<code>DEFAULT_COLLATION</code><code>PREFIX/mysql-test</code>]</td> <td></td> <td>8.0.23</td> </tr><tr><th>[[<code>DEFAULT_COLLATION</code><code>INSTALL_PKGCONFIGDIR</code>]</th> <td>Use o memcached empacotado ao construir ndbmemcache; obsoleto</td> <td>[[<code>utf8mb4_0900_ai_ci</code><code>PREFIX/lib</code>]</td> <td></td> <td>8.0.23</td> </tr><tr><th>[[<code>utf8mb4_0900_ai_ci</code><code>PREFIX/lib</code>]</th> <td>Classe a ser usada ao criar o Conector do MySQL Cluster para Java. O padrão é uma string vazia.</td> <td>[[<code>utf8mb4_0900_ai_ci</code><code>PREFIX/man</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>utf8mb4_0900_ai_ci</code><code>INSTALL_MYSQLKEYRINGDIR</code>]</th> <td>Construir uma estrutura de rastreamento de protocolos no lado do cliente</td> <td>[[<code>utf8mb4_0900_ai_ci</code><code>platform specific</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>utf8mb4_0900_ai_ci</code><code>INSTALL_MYSQLSHAREDIR</code>]</th> <td>Localização da biblioteca curl</td> <td></td> <td></td> <td></td> </tr><tr><th>[[<code>utf8mb4_0900_ai_ci</code><code>PREFIX/share</code>]</th> <td>Se incluir suporte para depuração</td> <td>[[<code>utf8mb4_0900_ai_ci</code><code>INSTALL_MYSQLTESTDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>utf8mb4_0900_ai_ci</code><code>PREFIX/mysql-test</code>]</th> <td>Se usar as opções de compilador padrão</td> <td>[[<code>utf8mb4_0900_ai_ci</code><code>INSTALL_PKGCONFIGDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>DISABLE_PSI_COND</code><code>PREFIX/lib</code>]</th> <td>Se usar o conjunto de recursos padrão</td> <td>[[<code>DISABLE_PSI_COND</code><code>PREFIX/lib</code>]</td> <td></td> <td>8.0.22</td> </tr><tr><th>[[<code>DISABLE_PSI_COND</code><code>PREFIX/man</code>]</th> <td>Se adicionar o direito 'get-task-allow' a todos os executáveis no macOS para gerar um dump de núcleo em caso de uma parada inesperada do servidor</td> <td>[[<code>DISABLE_PSI_COND</code><code>INSTALL_MYSQLKEYRINGDIR</code>]</td> <td>8.0.30</td> <td></td> </tr><tr><th>[[<code>DISABLE_PSI_COND</code><code>platform specific</code>]</th> <td>Qual biblioteca libedit/editline usar</td> <td>[[<code>DISABLE_PSI_COND</code><code>INSTALL_MYSQLSHAREDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>DISABLE_PSI_COND</code><code>PREFIX/share</code>]</th> <td>Ative a injeção de erros no motor de armazenamento NDB. Não deve ser usado para criar binários destinados à produção.</td> <td>[[<code>DISABLE_PSI_COND</code><code>INSTALL_MYSQLTESTDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>DISABLE_PSI_COND</code><code>PREFIX/mysql-test</code>]</th> <td>Tipo de suporte da biblioteca FIDO</td> <td>[[<code>DISABLE_PSI_COND</code><code>INSTALL_PKGCONFIGDIR</code>]</td> <td>8.0.27</td> <td></td> </tr><tr><th>[[<code>OFF</code><code>PREFIX/lib</code>]</th> <td>Caminho para a distribuição do googlemock</td> <td></td> <td></td> <td>8.0.26</td> </tr><tr><th>[[<code>OFF</code><code>PREFIX/lib</code>]</th> <td>Tipo de suporte da UTI</td> <td>[[<code>OFF</code><code>PREFIX/man</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>OFF</code><code>INSTALL_MYSQLKEYRINGDIR</code>]</th> <td>Se incluir suporte adicional de depuração para o InnoDB.</td> <td>[[<code>OFF</code><code>platform specific</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>OFF</code><code>INSTALL_MYSQLSHAREDIR</code>]</th> <td>Se deve gerar bibliotecas compartilhadas do memcached.</td> <td>[[<code>OFF</code><code>PREFIX/share</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>OFF</code><code>INSTALL_MYSQLTESTDIR</code>]</th> <td>Se você deseja vincular com -ljemalloc</td> <td>[[<code>OFF</code><code>PREFIX/mysql-test</code>]</td> <td>8.0.16</td> <td></td> </tr><tr><th>[[<code>OFF</code><code>INSTALL_PKGCONFIGDIR</code>]</th> <td>Construa o programa de teste do chaveiro</td> <td>[[<code>DISABLE_PSI_DATA_LOCK</code><code>PREFIX/lib</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>DISABLE_PSI_DATA_LOCK</code><code>PREFIX/lib</code>]</th> <td>Qual biblioteca libevent usar</td> <td>[[<code>DISABLE_PSI_DATA_LOCK</code><code>PREFIX/man</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>DISABLE_PSI_DATA_LOCK</code><code>INSTALL_MYSQLKEYRINGDIR</code>]</th> <td>Se incluir suporte para libwrap (wrappers TCP)</td> <td>[[<code>DISABLE_PSI_DATA_LOCK</code><code>platform specific</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>DISABLE_PSI_DATA_LOCK</code><code>INSTALL_MYSQLSHAREDIR</code>]</th> <td>Se deve habilitar a ferramenta LOCK_ORDER</td> <td>[[<code>DISABLE_PSI_DATA_LOCK</code><code>PREFIX/share</code>]</td> <td>8.0.17</td> <td></td> </tr><tr><th>[[<code>DISABLE_PSI_DATA_LOCK</code><code>INSTALL_MYSQLTESTDIR</code>]</th> <td>Se deve executar o LeakSanitizer, sem o AddressSanitizer</td> <td>[[<code>DISABLE_PSI_DATA_LOCK</code><code>PREFIX/mysql-test</code>]</td> <td>8.0.16</td> <td></td> </tr><tr><th>[[<code>DISABLE_PSI_DATA_LOCK</code><code>INSTALL_PKGCONFIGDIR</code>]</th> <td>Ative o otimizador de tempo de link</td> <td>[[<code>OFF</code><code>PREFIX/lib</code>]</td> <td>8.0.13</td> <td></td> </tr><tr><th>[[<code>OFF</code><code>PREFIX/lib</code>]</th> <td>Tipo de suporte da biblioteca LZ4</td> <td>[[<code>OFF</code><code>PREFIX/man</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>OFF</code><code>INSTALL_MYSQLKEYRINGDIR</code>]</th> <td>Tipo de suporte da biblioteca LZMA</td> <td>[[<code>OFF</code><code>platform specific</code>]</td> <td></td> <td>8.0.16</td> </tr><tr><th>[[<code>OFF</code><code>INSTALL_MYSQLSHAREDIR</code>]</th> <td>Compila o MeCab</td> <td></td> <td></td> <td></td> </tr><tr><th>[[<code>OFF</code><code>PREFIX/share</code>]</th> <td>Ative o MemorySanitizer</td> <td>[[<code>OFF</code><code>INSTALL_MYSQLTESTDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>OFF</code><code>PREFIX/mysql-test</code>]</th> <td>Ative o rastreamento de vazamento de memória do Visual Studio CRT</td> <td>[[<code>OFF</code><code>INSTALL_PKGCONFIGDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>DISABLE_PSI_ERROR</code><code>PREFIX/lib</code>]</th> <td>Se desabilitar o Protocolo X</td> <td>[[<code>DISABLE_PSI_ERROR</code><code>PREFIX/lib</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>DISABLE_PSI_ERROR</code><code>PREFIX/man</code>]</th> <td>Construa o MySQL NDB Cluster, incluindo o motor de armazenamento NDB e todos os programas NDB</td> <td>[[<code>DISABLE_PSI_ERROR</code><code>INSTALL_MYSQLKEYRINGDIR</code>]</td> <td>8.0.31</td> <td></td> </tr><tr><th>[[<code>DISABLE_PSI_ERROR</code><code>platform specific</code>]</th> <td>Construa programas de exemplo de API.</td> <td>[[<code>DISABLE_PSI_ERROR</code><code>INSTALL_MYSQLSHAREDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>DISABLE_PSI_ERROR</code><code>PREFIX/share</code>]</th> <td>NDB 8.0.30 e versões anteriores: Construa o motor de armazenamento NDB. NDB 8.0.31 e versões posteriores: Desatualizado; use WITH_NDB em vez disso</td> <td>[[<code>DISABLE_PSI_ERROR</code><code>INSTALL_MYSQLTESTDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>DISABLE_PSI_ERROR</code><code>PREFIX/mysql-test</code>]</th> <td>Antes da versão 8.0.31 do NDB, isso era para uso interno apenas. NDB 8.0.31 e versões posteriores: ativação (apenas) da inclusão do mecanismo de armazenamento NDBCLUSTER</td> <td>[[<code>DISABLE_PSI_ERROR</code><code>INSTALL_PKGCONFIGDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>OFF</code><code>PREFIX/lib</code>]</th> <td>Construa o binário do nó de dados multithreading</td> <td>[[<code>OFF</code><code>PREFIX/lib</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>OFF</code><code>PREFIX/man</code>]</th> <td>Produza uma compilação de depuração para testes ou solução de problemas.</td> <td>[[<code>OFF</code><code>INSTALL_MYSQLKEYRINGDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>OFF</code><code>platform specific</code>]</th> <td>Ative a construção do suporte Java e ClusterJ. Ativado por padrão. Suportado apenas no MySQL Cluster.</td> <td>[[<code>OFF</code><code>INSTALL_MYSQLSHAREDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>OFF</code><code>PREFIX/share</code>]</th> <td>Porta padrão usada por um servidor de gerenciamento construído com esta opção. Se esta opção não foi usada para construí-lo, a porta padrão do servidor de gerenciamento é 1186.</td> <td>[[<code>OFF</code><code>INSTALL_MYSQLTESTDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>OFF</code><code>PREFIX/mysql-test</code>]</th> <td>Inclua os programas de teste da API NDB.</td> <td>[[<code>OFF</code><code>INSTALL_PKGCONFIGDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>DISABLE_PSI_FILE</code><code>PREFIX/lib</code>]</th> <td>Definir a política de alocação de memória NUMA</td> <td></td> <td></td> <td></td> </tr><tr><th>[[<code>DISABLE_PSI_FILE</code><code>PREFIX/lib</code>]</th> <td>Para bandeiras geralmente usadas para pacotes RPM/DEB, se devem adicioná-las a compilações autônomas nessas plataformas</td> <td></td> <td>8.0.26</td> <td></td> </tr><tr><th>[[<code>DISABLE_PSI_FILE</code><code>PREFIX/man</code>]</th> <td>Para uso interno; pode não funcionar conforme o esperado em todas as circunstâncias. Em vez disso, os usuários devem usar WITH_NDBCLUSTER</td> <td></td> <td>8.0.13</td> <td>8.0.31</td> </tr><tr><th>[[<code>DISABLE_PSI_FILE</code><code>INSTALL_MYSQLKEYRINGDIR</code>]</th> <td>Qual pacote do Protocol Buffers usar</td> <td>[[<code>DISABLE_PSI_FILE</code><code>platform specific</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>DISABLE_PSI_FILE</code><code>INSTALL_MYSQLSHAREDIR</code>]</th> <td>Se construir plugins para o ciclo de desenvolvimento rápido</td> <td>[[<code>DISABLE_PSI_FILE</code><code>PREFIX/share</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>DISABLE_PSI_FILE</code><code>INSTALL_MYSQLTESTDIR</code>]</th> <td>Tipo de suporte do RapidJSON</td> <td>[[<code>DISABLE_PSI_FILE</code><code>PREFIX/mysql-test</code>]</td> <td>8.0.13</td> <td></td> </tr><tr><th>[[<code>DISABLE_PSI_FILE</code><code>INSTALL_PKGCONFIGDIR</code>]</th> <td>Tipo de suporte da biblioteca RE2</td> <td>[[<code>OFF</code><code>PREFIX/lib</code>]</td> <td></td> <td>8.0.18</td> </tr><tr><th>[[<code>OFF</code><code>PREFIX/lib</code>]</th> <td>Se construir o MySQL Router</td> <td>[[<code>OFF</code><code>PREFIX/man</code>]</td> <td>8.0.16</td> <td></td> </tr><tr><th>[[<code>OFF</code><code>INSTALL_MYSQLKEYRINGDIR</code>]</th> <td>Uso interno apenas</td> <td></td> <td></td> <td></td> </tr><tr><th>[[<code>OFF</code><code>platform specific</code>]</th> <td>Tipo de suporte SSL</td> <td>[[<code>OFF</code><code>INSTALL_MYSQLSHAREDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>OFF</code><code>PREFIX/share</code>]</th> <td>Ative a instalação dos arquivos de suporte do systemd</td> <td>[[<code>OFF</code><code>INSTALL_MYSQLTESTDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>OFF</code><code>PREFIX/mysql-test</code>]</th> <td>Ative informações de depuração adicionais do systemd</td> <td>[[<code>OFF</code><code>INSTALL_PKGCONFIGDIR</code>]</td> <td>8.0.22</td> <td></td> </tr><tr><th>[[<code>DISABLE_PSI_IDLE</code><code>PREFIX/lib</code>]</th> <td>Defina o valor do sistema das opções da biblioteca que não foi definido explicitamente</td> <td>[[<code>DISABLE_PSI_IDLE</code><code>PREFIX/lib</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>DISABLE_PSI_IDLE</code><code>PREFIX/man</code>]</th> <td>Se você deseja vincular com -ltcmalloc. O BUNDLED é compatível apenas com o Linux</td> <td>[[<code>DISABLE_PSI_IDLE</code><code>INSTALL_MYSQLKEYRINGDIR</code>]</td> <td>8.0.22</td> <td></td> </tr><tr><th>[[<code>DISABLE_PSI_IDLE</code><code>platform specific</code>]</th> <td>Plugin para rastrear o protocolo de teste</td> <td>[[<code>DISABLE_PSI_IDLE</code><code>INSTALL_MYSQLSHAREDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>DISABLE_PSI_IDLE</code><code>PREFIX/share</code>]</th> <td>Ative o ThreadSanitizer</td> <td>[[<code>DISABLE_PSI_IDLE</code><code>INSTALL_MYSQLTESTDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>DISABLE_PSI_IDLE</code><code>PREFIX/mysql-test</code>]</th> <td>Habilitar o Sanitizador de Comportamento Indefinido</td> <td>[[<code>DISABLE_PSI_IDLE</code><code>INSTALL_PKGCONFIGDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>OFF</code><code>PREFIX/lib</code>]</th> <td>Compilar o MySQL com testes unitários</td> <td>[[<code>OFF</code><code>PREFIX/lib</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>OFF</code><code>PREFIX/man</code>]</th> <td>Ative o suporte unixODBC</td> <td>[[<code>OFF</code><code>INSTALL_MYSQLKEYRINGDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>OFF</code><code>platform specific</code>]</th> <td>Se compilar em arquivos de cabeçalho do Valgrind</td> <td>[[<code>OFF</code><code>INSTALL_MYSQLSHAREDIR</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>OFF</code><code>PREFIX/share</code>]</th> <td>Caminho para o diretório que contém o jemalloc.dll</td> <td></td> <td>8.0.29</td> <td></td> </tr><tr><th>[[<code>OFF</code><code>INSTALL_MYSQLTESTDIR</code>]</th> <td>Tipo de suporte do zlib</td> <td>[[<code>OFF</code><code>PREFIX/mysql-test</code>]</td> <td></td> <td></td> </tr><tr><th>[[<code>OFF</code><code>INSTALL_PKGCONFIGDIR</code>]</th> <td>Tipo de suporte zstd</td> <td>[[<code>DISABLE_PSI_MEMORY</code><code>PREFIX/lib</code>]</td> <td>8.0.18</td> <td></td> </tr><tr><th>[[<code>DISABLE_PSI_MEMORY</code><code>PREFIX/lib</code>]</th> <td>Compile o mecanismo de armazenamento xxx staticamente no servidor</td> <td></td> <td></td> <td></td> </tr></tbody></table>

#### Opções Gerais

- `-DBUILD_CONFIG=mysql_release`

  Essa opção configura uma distribuição de fonte com as mesmas opções de compilação usadas pela Oracle para produzir distribuições binárias para as versões oficiais do MySQL.

- `-DWITH_BUILD_ID=bool`

  Nos sistemas Linux, gera um ID de compilação único que é usado como o valor da variável de sistema `build_id` e escrito no log do servidor MySQL ao iniciar. Defina esta opção para `OFF` para desabilitar este recurso.

  Adicionada no MySQL 8.0.31, essa opção não tem efeito em plataformas que não sejam Linux.

- `-DBUNDLE_RUNTIME_LIBRARIES=bool`

  Se incluir as bibliotecas de tempo de execução nos pacotes MSI e Zip do servidor para o Windows.

- `-DCMAKE_BUILD_TYPE=type`

  O tipo de construção a ser produzido:

  - `RelWithDebInfo`: Habilitar otimizações e gerar informações de depuração. Este é o tipo de compilação padrão do MySQL.

  - `Release`: Habilitar otimizações, mas omitir informações de depuração para reduzir o tamanho da compilação. Este tipo de compilação foi adicionado no MySQL 8.0.13.

  - `Debug`: Desative as otimizações e gere informações de depuração. Este tipo de compilação também é usado se a opção `WITH_DEBUG` estiver habilitada. Ou seja, `-DWITH_DEBUG=1` tem o mesmo efeito que `-DCMAKE_BUILD_TYPE=Debug`.

  Os valores das opções `None` e `MinSizeRel` não são suportados.

- `-DCPACK_MONOLITHIC_INSTALL=bool`

  Esta opção afeta se a operação **fazer pacote** produz vários arquivos de pacote de instalação ou um único arquivo. Se desativada, a operação produz vários arquivos de pacote de instalação, o que pode ser útil se você quiser instalar apenas um subconjunto de uma instalação completa do MySQL. Se ativada, ela produz um único arquivo para instalar tudo.

- `-DFORCE_INSOURCE_BUILD=bool`

  Define se deve forçar uma compilação local. As compilações fora da fonte são recomendadas, pois permitem múltiplas compilações a partir da mesma fonte e a limpeza pode ser realizada rapidamente removendo o diretório de compilação. Para forçar uma compilação local, invocando o **CMake** com `-DFORCE_INSOURCE_BUILD=ON`.

- `-DFORCE_COLORED_OUTPUT=bool`

  Define se a saída colorida do compilador deve ser habilitada para **gcc** e **clang** ao compilar na linha de comando. A configuração padrão é `OFF`.

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

- `-DINSTALL_LAYOUT=name`

  Selecione um layout de instalação pré-definido:

  - `STANDALONE`: O mesmo layout utilizado para os pacotes `.tar.gz` e `.zip`. Este é o padrão.

  - `RPM`: Layout semelhante aos pacotes RPM.

  - `SVR4`: Estrutura do pacote Solaris.

  - `DEB`: Estrutura do pacote DEB (experimental).

  Você pode selecionar um layout predefinido, mas modificar os locais de instalação de componentes individuais especificando outras opções. Por exemplo:

  ```
  cmake . -DINSTALL_LAYOUT=SVR4 -DMYSQL_DATADIR=/var/mysql/data
  ```

  O valor `INSTALL_LAYOUT` determina o valor padrão das variáveis de sistema `secure_file_priv`, `keyring_encrypted_file_data` e `keyring_file_data`. Consulte as descrições dessas variáveis nas Seções 7.1.8, “Variáveis de Sistema do Servidor”, e 8.4.4.19, “Variáveis de Sistema do Keychain”.

- `-DINSTALL_LIBDIR=dir_name`

  Onde instalar os arquivos da biblioteca.

- `-DINSTALL_MANDIR=dir_name`

  Onde instalar as páginas de manual.

- `-DINSTALL_MYSQLKEYRINGDIR=dir_path`

  O diretório padrão a ser usado como local do arquivo de dados do plugin `keyring_file`. O valor padrão é específico da plataforma e depende do valor da opção `INSTALL_LAYOUT` **CMake**. Veja a descrição da variável de sistema `keyring_file_data` na Seção 7.1.8, “Variáveis do Sistema do Servidor”.

- `-DINSTALL_MYSQLSHAREDIR=dir_name`

  Onde instalar arquivos de dados compartilhados.

- `-DINSTALL_MYSQLTESTDIR=dir_name`

  Onde instalar o diretório `mysql-test`. Para suprimir a instalação deste diretório, defina explicitamente a opção para o valor vazio (`-DINSTALL_MYSQLTESTDIR=`).

- `-DINSTALL_PKGCONFIGDIR=dir_name`

  O diretório onde o arquivo `mysqlclient.pc` deve ser instalado para uso pelo **pkg-config**. O valor padrão é `INSTALL_LIBDIR/pkgconfig`, a menos que `INSTALL_LIBDIR` termine com `/mysql`, caso em que esse é removido primeiro.

- `-DINSTALL_PLUGINDIR=dir_name`

  O local do diretório do plugin.

  Esse valor pode ser definido na inicialização do servidor com a opção `--plugin_dir`.

- `-DINSTALL_PRIV_LIBDIR=dir_name`

  O diretório da biblioteca dinâmica.

  **Local padrão.** Para compilações RPM, é `/usr/lib64/mysql/private/`, para DEB é `/usr/lib/mysql/private/` e para TAR é `lib/private/`.

  **Protobuf.** Como este é um local privado, o carregador (como `ld-linux.so` no Linux) pode não encontrar os arquivos `libprotobuf.so` sem ajuda. Para orientar o carregador, `RPATH=$ORIGIN/../$INSTALL_PRIV_LIBDIR` é adicionado a **mysqld** e **mysqlxtest**. Isso funciona na maioria dos casos, mas ao usar o recurso Grupo de Recursos, **mysqld** é `setsuid`, e o carregador ignora qualquer `RPATH` que contenha `$ORIGIN`. Para superar isso, um caminho completo explícito para o diretório é definido nas versões DEB e RPM de **mysqld**, já que o destino alvo é conhecido. Para instalações em tarball, é necessário fazer o reparo de **mysqld** com uma ferramenta como **patchelf**.

  Essa opção foi adicionada no MySQL 8.0.18.

- `-DINSTALL_SBINDIR=dir_name`

  Onde instalar o servidor **mysqld**.

- `-DINSTALL_SECURE_FILE_PRIVDIR=dir_name`

  O valor padrão para a variável de sistema `secure_file_priv`. O valor padrão é específico da plataforma e depende do valor da opção `INSTALL_LAYOUT` **CMake**. Consulte a descrição da variável de sistema `secure_file_priv` na Seção 7.1.8, “Variáveis de sistema do servidor”.

- `-DINSTALL_SHAREDIR=dir_name`

  Onde instalar `aclocal/mysql.m4`.

- `-DINSTALL_STATIC_LIBRARIES=bool`

  Se deve instalar bibliotecas estáticas. O padrão é `ON`. Se definido como `OFF`, esses arquivos de biblioteca não são instalados: `libmysqlclient.a`, `libmysqlservices.a`.

- `-DINSTALL_SUPPORTFILESDIR=dir_name`

  Onde instalar arquivos de suporte adicionais.

- `-DLINK_RANDOMIZE=bool`

  Se os símbolos devem ser aleatoriamente ordenados no binário do **mysqld**. O padrão é `OFF`. Esta opção deve ser habilitada apenas para fins de depuração.

- `-DLINK_RANDOMIZE_SEED=val`

  Valor da semente para a opção `LINK_RANDOMIZE`. O valor é uma string. O padrão é `mysql`, uma escolha arbitrária.

- `-DMYSQL_DATADIR=dir_name`

  O local do diretório de dados do MySQL.

  Esse valor pode ser definido na inicialização do servidor com a opção `--datadir`.

- `-DODBC_INCLUDES=dir_name`

  A localização do diretório ODBC pode ser usada durante a configuração do Connector/ODBC.

- `-DODBC_LIB_DIR=dir_name`

  O diretório da biblioteca ODBC, que pode ser usado durante a configuração do Connector/ODBC.

- `-DSYSCONFDIR=dir_name`

  Diretório padrão do arquivo de opção `my.cnf`.

  Essa localização não pode ser definida na inicialização do servidor, mas você pode iniciar o servidor com um arquivo de opção específico usando a opção `--defaults-file=file_name`, onde `file_name` é o nome completo do caminho do arquivo.

- `-DSYSTEMD_PID_DIR=dir_name`

  O nome do diretório onde o arquivo PID será criado quando o MySQL for gerenciado pelo systemd. O padrão é `/var/run/mysqld`; esse valor pode ser alterado implicitamente de acordo com o valor `INSTALL_LAYOUT`.

  Esta opção é ignorada, a menos que `WITH_SYSTEMD` esteja habilitado.

- `-DSYSTEMD_SERVICE_NAME=name`

  O nome do serviço MySQL a ser usado quando o MySQL é gerenciado pelo **systemd**. O padrão é `mysqld`; esse valor pode ser alterado implicitamente de acordo com o valor `INSTALL_LAYOUT`.

  Esta opção é ignorada, a menos que `WITH_SYSTEMD` esteja habilitado.

- `-DTMPDIR=dir_name`

  O local padrão a ser usado para a variável de sistema `tmpdir`. Se não for especificado, o valor será o padrão `P_tmpdir` em `<stdio.h>`.

#### Opções do Motor de Armazenamento

Os motores de armazenamento são construídos como plugins. Você pode criar um plugin como um módulo estático (compilado no servidor) ou um módulo dinâmico (construído como uma biblioteca dinâmica que deve ser instalada no servidor usando a instrução `INSTALL PLUGIN` ou a opção `--plugin-load` antes que ele possa ser usado). Alguns plugins podem não suportar a construção estática ou dinâmica.

Os motores `InnoDB`, `MyISAM`, `MERGE`, `MEMORY` e `CSV` são obrigatórios (sempre compilados no servidor) e não precisam ser instalados explicitamente.

Para compilar um mecanismo de armazenamento staticamente no servidor, use `-DWITH_engine_STORAGE_ENGINE=1`. Alguns valores `engine` permitidos são `ARCHIVE`, `BLACKHOLE`, `EXAMPLE` e `FEDERATED`. Exemplos:

```
-DWITH_ARCHIVE_STORAGE_ENGINE=1
-DWITH_BLACKHOLE_STORAGE_ENGINE=1
```

Para construir o MySQL com suporte para o NDB Cluster, use a opção `WITH_NDB`. (*NDB 8.0.30 e versões anteriores*: Use `WITH_NDBCLUSTER`.)

Nota

Não é possível compilar sem o suporte do Performance Schema. Se quiser compilar sem tipos específicos de instrumentação, isso pode ser feito com as seguintes opções do **CMake**:

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

Para excluir um mecanismo de armazenamento da compilação, use `-DWITH_engine_STORAGE_ENGINE=0`. Exemplos:

```
-DWITH_ARCHIVE_STORAGE_ENGINE=0
-DWITH_EXAMPLE_STORAGE_ENGINE=0
-DWITH_FEDERATED_STORAGE_ENGINE=0
```

É também possível excluir um mecanismo de armazenamento da compilação usando `-DWITHOUT_engine_STORAGE_ENGINE=1` (mas `-DWITH_engine_STORAGE_ENGINE=0` é preferível). Exemplos:

```
-DWITHOUT_ARCHIVE_STORAGE_ENGINE=1
-DWITHOUT_EXAMPLE_STORAGE_ENGINE=1
-DWITHOUT_FEDERATED_STORAGE_ENGINE=1
```

Se nem o `-DWITH_engine_STORAGE_ENGINE` nem o `-DWITHOUT_engine_STORAGE_ENGINE` forem especificados para um determinado motor de armazenamento, o motor é construído como um módulo compartilhado ou excluído se não puder ser construído como um módulo compartilhado.

#### Opções de recursos

- `-DADD_GDB_INDEX=bool`

  Esta opção determina se a geração de uma seção `.gdb_index` nos binários deve ser habilitada, o que acelera o carregamento deles em um depurador. A opção está desabilitada por padrão. O linkador **lld** é usado e está desabilitado. Ele não tem efeito se um linkador diferente de **lld** ou **GNU gold** for usado.

  Essa opção foi adicionada no MySQL 8.0.18.

- `-DCOMPILATION_COMMENT=string`

  Um comentário descritivo sobre o ambiente de compilação. A partir do MySQL 8.0.14, o **mysqld** usa `COMPILATION_COMMENT_SERVER`. Outros programas continuam a usar `COMPILATION_COMMENT`.

- `-DCOMPRESS_DEBUG_SECTIONS=bool`

  Se comprimir as seções de depuração de execuções binárias (apenas no Linux). A compressão das seções de depuração das execuções salva espaço, mas aumenta o tempo de CPU durante o processo de compilação.

  O padrão é `OFF`. Se esta opção não for definida explicitamente, mas a variável de ambiente `COMPRESS_DEBUG_SECTIONS` estiver definida, a opção terá seu valor dessa variável.

  Essa opção foi adicionada no MySQL 8.0.22.

- `-DCOMPILATION_COMMENT_SERVER=string`

  Um comentário descritivo sobre o ambiente de compilação para uso pelo **mysqld** (por exemplo, para definir a variável de sistema `version_comment`). Esta opção foi adicionada no MySQL 8.0.14. Antes do 8.0.14, o servidor usa `COMPILATION_COMMENT`.

- `-DDEFAULT_CHARSET=charset_name`

  O conjunto de caracteres do servidor. Por padrão, o MySQL usa o conjunto de caracteres `utf8mb4`.

  `charset_name` pode ser um dos `binary`, `armscii8`, `ascii`, `big5`, `cp1250`, `cp1251`, `cp1256`, `cp1257`, `cp850`, `cp852`, `cp866`, `cp932`, `dec8`, `eucjpms`, `euckr`, `gb2312`, `gbk`, `geostd8`, `greek`, `hebrew`, `hp8`, `keybcs2`, `koi8r`, `koi8u`, `latin1`, `latin2`, `latin5`, `latin7`, `macce`, `macroman`, `sjis`, `swe7`, `tis620`, `ucs2`, `ujis`, `utf8mb3`, `utf8mb4`, `utf16`, `utf16le`, `utf32`.

  Esse valor pode ser definido na inicialização do servidor com a opção `--character-set-server`.

- `-DDEFAULT_COLLATION=collation_name`

  A collation do servidor. Por padrão, o MySQL usa `utf8mb4_0900_ai_ci`. Use a instrução `SHOW COLLATION` para determinar quais collation estão disponíveis para cada conjunto de caracteres.

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

  Se deve excluir a instrumentação do resumo das declarações do Schema de Desempenho. O padrão é `OFF` (incluir).

- `-DDISABLE_PSI_TABLE=bool`

  Se deve excluir a instrumentação da tabela do Schema de Desempenho. O padrão é `OFF` (incluir).

- `-DDISABLE_SHARED=bool`

  Se desabilitar a construção de bibliotecas compartilhadas e a compilação de código dependente da posição. O padrão é `OFF` (compilar código independente da posição).

  Esta opção não é usada e foi removida no MySQL 8.0.18.

- `-DDISABLE_PSI_PS=bool`

  Exclua a instrumentação das instâncias de declarações preparadas do Schema de Desempenho. O padrão é `OFF` (incluir).

- `-DDISABLE_PSI_THREAD=bool`

  Exclua a instrumentação de fio do Schema de Desempenho. O padrão é `OFF` (incluir).

  Desative apenas os threads ao compilar sem instrumentação, pois outras instrumentações dependem dos threads.

- `-DDISABLE_PSI_TRANSACTION=bool`

  Exclua a instrumentação de transações do Schema de Desempenho. O padrão é `OFF` (incluir).

- `-DDISABLE_PSI_DATA_LOCK=bool`

  Exclua a instrumentação de bloqueio de dados do esquema de desempenho. O padrão é `OFF` (incluir).

- `-DDISABLE_PSI_ERROR=bool`

  Exclua a instrumentação do erro de esquema de desempenho do servidor. O padrão é `OFF` (incluir).

- `-DDOWNLOAD_BOOST=bool`

  Se deve baixar a biblioteca Boost. O padrão é `OFF`.

  Consulte a opção `WITH_BOOST` para uma discussão adicional sobre o uso do Boost.

- `-DDOWNLOAD_BOOST_TIMEOUT=seconds`

  O tempo de espera em segundos para o download da biblioteca Boost. O valor padrão é de 600 segundos.

  Consulte a opção `WITH_BOOST` para uma discussão adicional sobre o uso do Boost.

- `-DENABLE_DOWNLOADS=bool`

  Se deseja baixar arquivos opcionais. Por exemplo, com essa opção ativada, o **CMake** baixa a distribuição do Google Test, que é usada pela suíte de testes para executar testes unitários, ou Ant e JUnit, necessários para a construção do wrapper do GCS Java.

  A partir do MySQL 8.0.26, as distribuições de código-fonte do MySQL incluem o código-fonte do Google Test, usado para executar testes unitários. Consequentemente, a partir dessa versão, as opções `WITH_GMOCK` e `ENABLE_DOWNLOADS` do **CMake** são removidas e ignoradas se especificadas.

- `-DENABLE_EXPERIMENTAL_SYSVARS=bool`

  Se deve habilitar as variáveis de sistema `InnoDB` experimentais. As variáveis de sistema experimentais são destinadas a desenvolvedores do MySQL, devem ser usadas apenas em um ambiente de desenvolvimento ou teste e podem ser removidas sem aviso prévio em uma futura versão do MySQL. Para obter informações sobre variáveis de sistema experimentais, consulte `/storage/innobase/handler/ha_innodb.cc` no repositório de código-fonte do MySQL. As variáveis de sistema experimentais podem ser identificadas pesquisando por “PLUGIN\_VAR\_EXPERIMENTAL”.

- `-DENABLE_GCOV=bool`

  Se incluir o suporte ao **gcov** (apenas para Linux).

- `-DENABLE_GPROF=bool`

  Se você deseja habilitar o **gprof** (apenas para compilações otimizadas do Linux).

- `-DENABLED_LOCAL_INFILE=bool`

  Esta opção controla a capacidade `LOCAL` integrada por padrão para a biblioteca de clientes MySQL. Os clientes que não fazem ajustes explícitos, portanto, têm a capacidade `LOCAL` desativada ou ativada de acordo com a configuração `ENABLED_LOCAL_INFILE` especificada no momento da construção do MySQL.

  Por padrão, a biblioteca do cliente nas distribuições binárias do MySQL é compilada com o `ENABLED_LOCAL_INFILE` desativado. Se você compilar o MySQL a partir do código-fonte, configure-o com o `ENABLED_LOCAL_INFILE` desativado ou ativado, dependendo se os clientes que não fazem acordos explícitos devem ter a capacidade `LOCAL` desativada ou ativada, respectivamente.

  `ENABLED_LOCAL_INFILE` controla a configuração padrão da capacidade `LOCAL` do lado do cliente. Para o servidor, a variável de sistema `local_infile` controla a capacidade `LOCAL` do lado do servidor. Para forçar explicitamente o servidor a recusar ou permitir as instruções `LOAD DATA LOCAL` (independentemente de como os programas e bibliotecas do cliente são configurados no momento da compilação ou execução), inicie o **mysqld** com `--local-infile` desativado ou ativado, respectivamente. `local_infile` também pode ser definido em tempo de execução. Veja a Seção 8.1.6, “Considerações de Segurança para LOAD DATA LOCAL”.

- `-DENABLED_PROFILING=bool`

  Se ativar ou não o código de perfilamento de consultas (para as instruções `SHOW PROFILE` e `SHOW PROFILES`).

- `-DFORCE_UNSUPPORTED_COMPILER=bool`

  Por padrão, o **CMake** verifica as versões mínimas dos compiladores suportados. Para desabilitar essa verificação, use `-DFORCE_UNSUPPORTED_COMPILER=ON`.

- `-DFPROFILE_GENERATE=bool`

  Se deve gerar dados de otimização guiada por perfil (PGO). Esta opção está disponível para experimentar o PGO com o GCC. Consulte `cmake/fprofile.cmake` na distribuição de código-fonte do MySQL para obter informações sobre o uso de `FPROFILE_GENERATE` e `FPROFILE_USE`. Estas opções foram testadas com o GCC 8 e 9.

  Essa opção foi adicionada no MySQL 8.0.19.

- `-DFPROFILE_USE=bool`

  Se usar dados de otimização guiada por perfil (PGO). Esta opção está disponível para experimentar o PGO com o GCC. Consulte o arquivo `cmake/fprofile.cmake` em uma distribuição de código-fonte MySQL para obter informações sobre o uso de `FPROFILE_GENERATE` e `FPROFILE_USE`. Estas opções foram testadas com o GCC 8 e 9.

  Ativação de `FPROFILE_USE` também ativa `WITH_LTO`.

  Essa opção foi adicionada no MySQL 8.0.19.

- `-DHAVE_PSI_MEMORY_INTERFACE=bool`

  Se deve habilitar o módulo de rastreamento de memória do esquema de desempenho para funções de alocação de memória (funções da biblioteca `ut::aligned_name`), usadas no armazenamento dinâmico de tipos sobrealinhados.

- `-DIGNORE_AIO_CHECK=bool`

  Se a opção `-DBUILD_CONFIG=mysql_release` for fornecida no Linux, a biblioteca `libaio` deve ser vinculada por padrão. Se você não tiver `libaio` ou não quiser instalá-la, pode suprimir a verificação para ela especificando `-DIGNORE_AIO_CHECK=1`.

- `-DMAX_INDEXES=num`

  O número máximo de índices por tabela. O padrão é 64. O máximo é 255. Valores menores que 64 são ignorados e o padrão de 64 é usado.

- `-DMYSQL_MAINTAINER_MODE=bool`

  Se habilitar ou não um ambiente de desenvolvimento específico para o mantenedor do MySQL. Se habilitado, essa opção faz com que os avisos do compilador se tornem erros.

- `-DWITH_DEVELOPER_ENTITLEMENTS=bool`

  Se deve adicionar o direito `get-task-allow` a todos os executáveis para gerar um dump de núcleo no caso de uma parada inesperada do servidor.

  No macOS 11+, os core dumps são limitados aos processos com o direito `com.apple.security.get-task-allow`, que essa opção do CMake habilita. O direito permite que outros processos se conectem e leiam/modifiquem a memória dos processos e permite que o `--core-file` funcione conforme o esperado.

  Essa opção foi adicionada no MySQL 8.0.30.

- `-DMUTEX_TYPE=type`

  O tipo de mutex usado por `InnoDB`. As opções incluem:

  - `event`: Use muts de eventos. Este é o valor padrão e a implementação original do mut \[`InnoDB`].

  - `sys`: Use mútues POSIX em sistemas UNIX. Use objetos `CRITICAL_SECTION` em sistemas Windows, se disponíveis.

  - `futex`: Use futexes Linux em vez de variáveis de condição para agendar threads de espera.

- `-DMYSQLX_TCP_PORT=port_num`

  O número do porto no qual o X Plugin escuta as conexões TCP/IP. O padrão é 33060.

  Esse valor pode ser definido na inicialização do servidor com a variável de sistema `mysqlx_port`.

- `-DMYSQLX_UNIX_ADDR=file_name`

  O caminho do arquivo de soquete Unix no qual o servidor escuta as conexões de soquete do Plugin X. Este deve ser um nome de caminho absoluto. O padrão é `/tmp/mysqlx.sock`.

  Esse valor pode ser definido na inicialização do servidor com a variável de sistema `mysqlx_port`.

- `-DMYSQL_PROJECT_NAME=name`

  Para Windows ou macOS, o nome do projeto a ser incorporado no nome do arquivo do projeto.

- `-DMYSQL_TCP_PORT=port_num`

  O número do porto no qual o servidor escuta as conexões TCP/IP. O padrão é 3306.

  Esse valor pode ser definido na inicialização do servidor com a opção `--port`.

- `-DMYSQL_UNIX_ADDR=file_name`

  O caminho do arquivo de soquete Unix no qual o servidor escuta as conexões de soquete. Este deve ser um nome de caminho absoluto. O padrão é `/tmp/mysql.sock`.

  Esse valor pode ser definido na inicialização do servidor com a opção `--socket`.

- `-DOPTIMIZER_TRACE=bool`

  Se deseja ou não suportar o rastreamento do otimizador. Consulte a Seção 10.15, “Rastreamento do Otimizador”.

- `-DREPRODUCIBLE_BUILD=bool`

  Para compilações em sistemas Linux, essa opção controla se é necessário ter mais cuidado para criar um resultado de compilação independente da localização e do horário da compilação.

  Essa opção foi adicionada no MySQL 8.0.11. A partir do MySQL 8.0.12, ela é padrão para as compilações `RelWithDebInfo`.

- `-DSHOW_SUPPRESSED_COMPILER_WARNINGS=bool`

  Mostre avisos de compilador suprimidos e faça isso sem falhar com `-Werror`. A configuração padrão é `OFF`.

  Essa opção foi adicionada no MySQL 8.0.30.

- `-DUSE_LD_GOLD=bool`

  O suporte ao encadeador **gold** do GNU foi removido no MySQL 8.0.31; essa opção do CMake também foi removida.

  O **CMake** faz com que o processo de compilação se ligue ao **gold** do GNU linker se ele estiver disponível e não estiver explicitamente desativado. Para desabilitar o uso desse linker, especifique a opção `-DUSE_LD_GOLD=OFF`.

- `-DUSE_LD_LLD=bool`

  O **CMake** faz com que o processo de compilação faça a vinculação usando o **lld** do LLVM para o Clang, se estiver disponível e não estiver explicitamente desativado. Para desabilitar o uso desse link, especifique a opção `-DUSE_LD_LLD=OFF`.

  Essa opção foi adicionada no MySQL 8.0.16.

- `-DWIN_DEBUG_NO_INLINE=bool`

  Se desabilitar a inlining de funções no Windows. O padrão é `OFF` (inlining ativado).

- `-DWITH_ANT=path_name`

  Defina o caminho para o Ant, necessário ao construir o wrapper do GCS Java. Defina `WITH_ANT` para o caminho de um diretório onde o pacote tar ou o arquivo descompactado do Ant está salvo. Quando `WITH_ANT` não estiver definido ou estiver definido com o valor especial `system`, o processo de construção assume que um binário `ant` existe em `$PATH`.

- `-DWITH_ASAN=bool`

  Se deve habilitar o AddressSanitizer, para os compiladores que o suportam. O padrão é `OFF`.

- `-DWITH_ASAN_SCOPE=bool`

  Se deve habilitar a bandeira `-fsanitize-address-use-after-scope` AddressSanitizer do Clang para detecção de uso após escopo. O padrão é desativado. Para usar essa opção, `-DWITH_ASAN` também deve ser habilitado.

- `-DWITH_AUTHENTICATION_CLIENT_PLUGINS=bool`

  Esta opção é habilitada automaticamente se algum plugin de autenticação de servidor correspondente for construído. Seu valor, portanto, depende de outras opções do **CMake** e não deve ser definido explicitamente.

  Essa opção foi adicionada no MySQL 8.0.26.

- `-DWITH_AUTHENTICATION_LDAP=bool`

  Se deve relatar um erro se os plugins de autenticação LDAP não puderem ser construídos:

  - Se essa opção estiver desativada (o padrão), os plugins LDAP serão construídos se os arquivos de cabeçalho e as bibliotecas necessárias forem encontrados. Se não forem, o **CMake** exibirá uma nota sobre isso.

  - Se essa opção estiver habilitada, a falta de encontrar o arquivo de cabeçalho e as bibliotecas necessárias faz com que o CMake produza um erro, impedindo a construção do servidor.

  Para obter informações sobre autenticação LDAP, consulte a Seção 8.4.1.7, “Autenticação Pluggable LDAP”.

- `-DWITH_AUTHENTICATION_PAM=bool`

  Se você deseja construir o plugin de autenticação PAM, para os repositórios de origem que incluem esse plugin. (Consulte a Seção 8.4.1.5, “Autenticação Conectada ao PAM”.) Se essa opção for especificada e o plugin não puder ser compilado, a construção falhará.

- `-DWITH_AWS_SDK=path_name`

  O local do kit de desenvolvimento de software do Amazon Web Services.

- `-DWITH_BOOST=path_name`

  A biblioteca Boost é necessária para construir o MySQL. Essas opções do **CMake** permitem controlar a localização da fonte da biblioteca e se ela deve ser baixada automaticamente:

  - `-DWITH_BOOST=path_name` especifica a localização do diretório da biblioteca Boost. É também possível especificar a localização do Boost configurando a variável de ambiente `BOOST_ROOT` ou `WITH_BOOST`.

    `-DWITH_BOOST=system` também é permitido e indica que a versão correta do Boost está instalada no host de compilação na localização padrão. Nesse caso, a versão instalada do Boost é usada em vez de qualquer versão incluída em uma distribuição de código-fonte do MySQL.

  - `-DDOWNLOAD_BOOST=bool` especifica se o código-fonte do Boost deve ser baixado se ele não estiver presente na localização especificada. O padrão é `OFF`.

  - `-DDOWNLOAD_BOOST_TIMEOUT=seconds` o tempo de espera em segundos para baixar a biblioteca Boost. O valor padrão é de 600 segundos.

  Por exemplo, se você normalmente constrói o MySQL colocando a saída do objeto no subdiretório `bld` da árvore de origem do MySQL, você pode construir com o Boost da seguinte maneira:

  ```
  mkdir bld
  cd bld
  cmake .. -DDOWNLOAD_BOOST=ON -DWITH_BOOST=$HOME/my_boost
  ```

  Isso faz com que o Boost seja baixado no diretório `my_boost` sob seu diretório de casa. Se a versão do Boost necessária já estiver lá, nenhum download é feito. Se a versão do Boost necessária mudar, a versão mais recente é baixada.

  Se o Boost já estiver instalado localmente e o compilador encontrar os arquivos de cabeçalho do Boost por conta própria, pode não ser necessário especificar as opções anteriores do **CMake**. No entanto, se a versão do Boost necessária pelo MySQL mudar e a versão instalada localmente não tiver sido atualizada, você pode ter problemas de compilação. O uso das opções do **CMake** deve permitir uma compilação bem-sucedida.

  Com as configurações acima que permitem o download do Boost em um local especificado, quando a versão do Boost necessária for alterada, você precisará remover a pasta `bld`, recriá-la e realizar novamente a etapa **cmake**. Caso contrário, a nova versão do Boost pode não ser baixada e a compilação pode falhar.

- `-DWITH_CLIENT_PROTOCOL_TRACING=bool`

  Se deve incluir o framework de rastreamento de protocolos no lado do cliente na biblioteca do cliente. Por padrão, essa opção está habilitada.

  Para obter informações sobre como escrever plugins de registro de protocolo de clientes, consulte Escrever plugins de registro de protocolo.

  Veja também a opção `WITH_TEST_TRACE_PLUGIN`.

- `-DWITH_CURL=curl_type`

  A localização da biblioteca `curl`. `curl_type` pode ser `system` (use a biblioteca do sistema `curl`) ou um nome de caminho para a biblioteca `curl`.

- `-DWITH_DEBUG=bool`

  Se incluir suporte para depuração.

  Configurar o MySQL com suporte de depuração permite que você use a opção `--debug="d,parser_debug"` ao iniciar o servidor. Isso faz com que o analisador Bison, usado para processar instruções SQL, armazene uma trilha do analisador na saída padrão de erro do servidor. Normalmente, essa saída é escrita no log de erro.

  A verificação de depuração para o mecanismo de armazenamento `InnoDB` é definida em `UNIV_DEBUG` e está disponível quando o suporte de depuração é compilado com a opção `WITH_DEBUG`. Quando o suporte de depuração é compilado, a opção de configuração `innodb_sync_debug` pode ser usada para habilitar ou desabilitar a verificação de depuração de sincronização `InnoDB`.

  Ativação de `WITH_DEBUG` também habilita o Debug Sync. Esta funcionalidade é usada para testes e depuração. Quando habilitada, o Debug Sync é desativado por padrão durante a execução. Para ativá-lo, inicie o **mysqld** com a opção `--debug-sync-timeout=N`, onde `N` é um valor de tempo limite maior que 0. (O valor padrão é 0, que desativa o Debug Sync.) `N` se torna o tempo limite padrão para pontos de sincronização individuais.

  A verificação de depuração para o mecanismo de armazenamento `InnoDB` está disponível quando o suporte de depuração é compilado com a opção `WITH_DEBUG`.

  Para uma descrição da funcionalidade Debug Sync e de como usar os pontos de sincronização, consulte MySQL Internals: Test Synchronization.

- `-DWITH_DEFAULT_FEATURE_SET=bool`

  Se usar as bandeiras do `cmake/build_configurations/feature_set.cmake`. Esta opção foi removida no MySQL 8.0.22.

- `-DWITH_EDITLINE=value`

  Qual biblioteca `libedit`/`editline` usar. Os valores permitidos são `bundled` (padrão) e `system`.

- `-DWITH_FIDO=fido_type`

  O plugin de autenticação `authentication_fido` é implementado usando uma biblioteca FIDO (consulte a Seção 8.4.1.11, “FIDO Pluggable Authentication”). A opção `WITH_FIDO` indica a origem do suporte FIDO:

  - `bundled`: Use a biblioteca FIDO incluída na distribuição. Isso é o padrão.

    A partir do MySQL 8.0.30, o MySQL inclui a versão `fido2` 1.8.0. (As versões anteriores usavam `fido2` 1.5.0).

  - `system`: Use a biblioteca do sistema FIDO.

  `WITH_FIDO` está desativado (definido como `none`) se todos os plugins de autenticação estiverem desativados.

  Essa opção foi adicionada no MySQL 8.0.27.

- `-DWITH_GMOCK=path_name`

  O caminho para a distribuição do googlemock, para uso com testes unitários baseados no Google Test. O valor da opção é o caminho para o arquivo zip da distribuição. Alternativamente, defina a variável de ambiente `WITH_GMOCK` com o nome do caminho. Também é possível usar `-DENABLE_DOWNLOADS=1`, para que o CMake faça o download da distribuição do GitHub.

  Se você construir o MySQL sem os testes unitários do Google Test (configurando sem `WITH_GMOCK`), o CMake exibe uma mensagem indicando como baixá-lo.

  A partir da versão 8.0.26 do MySQL, as distribuições de código-fonte do MySQL incluem o código-fonte do Google Test. Consequentemente, a partir dessa versão, as opções CMake `WITH_GMOCK` e `ENABLE_DOWNLOADS` são removidas e ignoradas se especificadas.

- `-DWITH_ICU={icu_type|path_name}`

  O MySQL utiliza os Componentes Internacionais para Unicode (ICU) para suportar operações de expressão regular. A opção `WITH_ICU` indica o tipo de suporte do ICU a ser incluído ou o nome do caminho para a instalação do ICU a ser usada.

  - `icu_type` pode ser um dos seguintes valores:

    - `bundled`: Use a biblioteca ICU incluída na distribuição. Esta é a opção padrão e a única suportada para o Windows.

    - `system`: Use a biblioteca ICU do sistema.

  - `path_name` é o nome do caminho para a instalação do ICU a ser utilizada. Isso pode ser preferível ao uso do valor `icu_type` de `system`, pois pode evitar que o CMake detecte e use uma versão mais antiga ou incorreta do ICU instalada no sistema. (Outra maneira permitida de fazer a mesma coisa é definir `WITH_ICU` para `system` e definir a opção `CMAKE_PREFIX_PATH` para `path_name`.)

- `-DWITH_INNODB_EXTRA_DEBUG=bool`

  Se incluir suporte adicional para depuração do InnoDB.

  Ativação de `WITH_INNODB_EXTRA_DEBUG` habilita verificações de depuração adicionais do InnoDB. Esta opção só pode ser ativada quando `WITH_DEBUG` está ativado.

- `-DWITH_INNODB_MEMCACHED=bool`

  Se deve gerar as bibliotecas compartilhadas do memcached (`libmemcached.so` e `innodb_engine.so`).

- `-DWITH_JEMALLOC=bool`

  Se deseja vincular com `-ljemalloc`. Se ativado, as rotinas internas `malloc()`, `calloc()`, `realloc()` e `free()` são desativadas. O padrão é `OFF`.

  `WITH_JEMALLOC` e `WITH_TCMALLOC` são mutuamente exclusivos.

  Essa opção foi adicionada no MySQL 8.0.16.

- `-DWITH_KEYRING_TEST=bool`

  Se deve construir o programa de teste que acompanha o plugin `keyring_file`. O padrão é `OFF`. O código-fonte do arquivo de teste está localizado no diretório `plugin/keyring/keyring-test`.

- `-DWITH_LIBEVENT=string`

  Qual biblioteca `libevent` usar. Os valores permitidos são `bundled` (padrão) e `system`. Antes do MySQL 8.0.21, se você especificar `system`, a biblioteca da `libevent` do sistema é usada, se estiver presente, e ocorre um erro caso contrário. No MySQL 8.0.21 e versões posteriores, se `system` for especificado e nenhuma biblioteca da `libevent` do sistema puder ser encontrada, um erro ocorrerá independentemente, e a biblioteca `libevent` incluída não será usada.

  A biblioteca `libevent` é necessária pelo memcached `InnoDB`, X Plugin e MySQL Router.

- `-DWITH_LIBWRAP=bool`

  Se incluir o suporte para `libwrap` (encaminhadores TCP).

- `-DWITH_LOCK_ORDER=bool`

  Se ativar ou desativar a ferramenta LOCK\_ORDER. Por padrão, essa opção está desativada e as compilações do servidor não contêm ferramentas. Se a ferramenta estiver ativada, a ferramenta LOCK\_ORDER estará disponível e poderá ser usada conforme descrito na Seção 7.9.3, “A Ferramenta LOCK\_ORDER”.

  Nota

  Com a opção `WITH_LOCK_ORDER` habilitada, as compilações do MySQL exigem o programa **flex**.

  Essa opção foi adicionada no MySQL 8.0.17.

- `-DWITH_LSAN=bool`

  Se deve executar o LeakSanitizer, sem o AddressSanitizer. O padrão é `OFF`.

  Essa opção foi adicionada no MySQL 8.0.16.

- `-DWITH_LTO=bool`

  Se deve habilitar o otimizador de tempo de ligação, se o compilador o suportar. O padrão é `OFF` a menos que `FPROFILE_USE` esteja habilitado.

  Essa opção foi adicionada no MySQL 8.0.13.

- `-DWITH_LZ4=lz4_type`

  A opção `WITH_LZ4` indica a origem do suporte do `zlib`:

  - `bundled`: Use a biblioteca `lz4` incluída na distribuição. Isso é o padrão.

  - `system`: Use a biblioteca do sistema `lz4`. Se `WITH_LZ4` estiver definido para este valor, o utilitário **lz4\_decompress** não será construído. Nesse caso, o comando **lz4** do sistema pode ser usado.

- `-DWITH_LZMA=lzma_type`

  O tipo de suporte da biblioteca LZMA a ser incluído. `lzma_type` pode ser um dos seguintes valores:

  - `bundled`: Use a biblioteca LZMA incluída na distribuição. Isso é o padrão.

  - `system`: Use a biblioteca LZMA do sistema.

  Essa opção foi removida no MySQL 8.0.16.

- `-DWITH_MECAB={disabled|system|path_name}`

  Use esta opção para compilar o analisador MeCab. Se você instalou o MeCab no diretório de instalação padrão, defina `-DWITH_MECAB=system`. A opção `system` se aplica a instalações do MeCab realizadas a partir de fontes ou de binários usando um utilitário de gerenciamento de pacotes nativo. Se você instalou o MeCab em um diretório de instalação personalizado, especifique o caminho para a instalação do MeCab, por exemplo, `-DWITH_MECAB=/opt/mecab`. Se a opção `system` não funcionar, especificar o caminho da instalação do MeCab deve funcionar em todos os casos.

  Para informações relacionadas, consulte a Seção 14.9.9, “Plugin do Parser de Texto Completo MeCab”.

- `-DWITH_MSAN=bool`

  Se você deseja habilitar o MemorySanitizer, para os compiladores que o suportam. O padrão é desativado.

  Para que essa opção tenha efeito quando ativada, todas as bibliotecas vinculadas ao MySQL também devem ter sido compiladas com a opção ativada.

- `-DWITH_MSCRT_DEBUG=bool`

  Se deve habilitar o rastreamento de vazamentos de memória do Visual Studio CRT. O padrão é `OFF`.

- `-DMSVC_CPPCHECK=bool`

  Se deve habilitar a análise de código do MSVC. O padrão é `OFF`.

- `-DWITH_MYSQLX=bool`

  Se você deseja criar com suporte para o X Plugin. O padrão é `ON`. Veja o Capítulo 22, *Usando o MySQL como um repositório de documentos*.

- `-DWITH_NUMA=bool`

  Defina explicitamente a política de alocação de memória NUMA. O **CMake** define o valor padrão `WITH_NUMA` com base no suporte ao `NUMA` da plataforma atual. Para plataformas sem suporte NUMA, o **CMake** se comporta da seguinte forma:

  - Sem a opção NUMA (o caso normal), o **CMake** continua normalmente, produzindo apenas este aviso: biblioteca NUMA ausente ou versão necessária não disponível.

  - Com `-DWITH_NUMA=ON`, o **CMake** interrompe com este erro: biblioteca NUMA ausente ou versão necessária não disponível.

- `-DWITH_PACKAGE_FLAGS=bool`

  Para bandeiras normalmente usadas para pacotes RPM e Debian, se devem adicioná-las a compilações autônomas nessas plataformas. O padrão é `ON` para compilações não de depuração.

  Essa opção foi adicionada no MySQL 8.0.26.

- `-DWITH_PROTOBUF=protobuf_type`

  Qual pacote do Protocol Buffers usar. `protobuf_type` pode ser um dos seguintes valores:

  - `bundled`: Use o pacote incluído na distribuição. Isso é o padrão. Opcionalmente, use `INSTALL_PRIV_LIBDIR` para modificar o diretório da biblioteca dinâmica Protobuf.

  - `system`: Use o pacote instalado no sistema.

  Outros valores são ignorados, com fallback para `bundled`.

- `-DWITH_RAPID=bool`

  Se você deseja criar os plugins do ciclo de desenvolvimento rápido. Quando ativado, um diretório `rapid` é criado na árvore de compilação, contendo esses plugins. Quando desativado, nenhum diretório `rapid` é criado na árvore de compilação. O padrão é `ON`, a menos que o diretório `rapid` seja removido da árvore de origem, caso em que o padrão se torna `OFF`.

- `-DWITH_RAPIDJSON=rapidjson_type`

  O tipo de suporte da biblioteca RapidJSON a ser incluído. `rapidjson_type` pode ser um dos seguintes valores:

  - `bundled`: Use a biblioteca RapidJSON incluída na distribuição. Isso é o padrão.

  - `system`: Use a biblioteca do sistema RapidJSON. É necessária a versão 1.1.0 ou superior.

  Essa opção foi adicionada no MySQL 8.0.13.

- `-DWITH_RE2=re2_type`

  O tipo de suporte da biblioteca RE2 a ser incluído. `re2_type` pode ser um dos seguintes valores:

  - `bundled`: Use a biblioteca RE2 incluída na distribuição. Isso é o padrão.

  - `system`: Use a biblioteca do sistema RE2.

  A partir do MySQL 8.0.18, o MySQL não usa mais a biblioteca RE2, e essa opção foi removida.

- `-DWITH_ROUTER=bool`

  Se construir o MySQL Router. O padrão é `ON`.

  Essa opção foi adicionada no MySQL 8.0.16.

- `-DWITH_SASL=value`

  Uso interno apenas. Esta opção foi adicionada na versão 8.0.20. Não é suportada no Windows.

- `-DWITH_SSL={ssl_type`|`path_name`}

  Para o suporte de conexões criptografadas, entropia para geração de números aleatórios e outras operações relacionadas à criptografia, o MySQL deve ser construído usando uma biblioteca SSL. Esta opção especifica qual biblioteca SSL deve ser usada.

  - `ssl_type` pode ser um dos seguintes valores:

    - `system`: Use a biblioteca OpenSSL do sistema. Isso é o padrão.

      No macOS e no Windows, usar `system` configura o MySQL para ser compilado como se o CMake tivesse sido invocado com `path_name` apontando para uma biblioteca OpenSSL instalada manualmente. Isso ocorre porque eles não têm bibliotecas SSL do sistema. No macOS, *brew install openssl* é instalado em `/usr/local/opt/openssl` para que `system` possa encontrá-lo. No Windows, ele verifica `%ProgramFiles%/OpenSSL`, `%ProgramFiles%/OpenSSL-Win32`, `%ProgramFiles%/OpenSSL-Win64`, `C:/OpenSSL`, `C:/OpenSSL-Win32` e `C:/OpenSSL-Win64`.

    - `yes`: Este é um sinônimo de `system`.

    - `opensslversion`: (*MySQL 8.0.30 e versões posteriores:*) Use um pacote de sistema OpenSSL alternativo, como `openssl11` no EL7, ou `openssl3` no EL8.

      Os plugins de autenticação, como LDAP e Kerberos, estão desativados, pois não suportam essas versões alternativas do OpenSSL.

  - `path_name` é o nome do caminho para a instalação do OpenSSL a ser utilizada. Isso pode ser preferível ao uso do valor `ssl_type` de `system` porque pode evitar que o CMake detecte e use uma versão mais antiga ou incorreta do OpenSSL instalada no sistema. (Outra maneira permitida de fazer a mesma coisa é definir `WITH_SSL` para `system` e definir a opção `CMAKE_PREFIX_PATH` para `path_name`.)

  Para obter informações adicionais sobre a configuração da biblioteca SSL, consulte a Seção 2.8.6, “Configurando o Suporte à Biblioteca SSL”.

- `-DWITH_SYSTEMD=bool`

  Se habilitar ou não a instalação dos arquivos de suporte do **systemd**. Por padrão, essa opção está desabilitada. Quando habilitada, os arquivos de suporte do **systemd** são instalados, e scripts como o **mysqld\_safe** e o script de inicialização System V não são instalados. Em plataformas onde o **systemd** não está disponível, a habilitação de `WITH_SYSTEMD` resulta em um erro do **CMake**.

  Para obter mais informações sobre o uso do **systemd**, consulte a Seção 2.5.9, “Gerenciamento do servidor MySQL com o systemd”. Essa seção também inclui informações sobre a especificação de opções que não estão especificadas de outra forma nos grupos de opções `[mysqld_safe]`. Como o **mysqld\_safe** não está instalado quando o **systemd** é usado, essas opções devem ser especificadas de outra forma.

- `-DWITH_SYSTEM_LIBS=bool`

  Esta opção serve como uma opção de "guarda-chuva" para definir o valor `system` de qualquer uma das seguintes opções do **CMake** que não sejam definidas explicitamente: `WITH_CURL`, `WITH_EDITLINE`, `WITH_FIDO`, `WITH_ICU`, `WITH_LIBEVENT`, `WITH_LZ4`, `WITH_LZMA`, `WITH_PROTOBUF`, `WITH_RE2`, `WITH_SSL`, `WITH_ZSTD`.

  `WITH_ZLIB` foi incluído aqui antes do MySQL 8.0.30.

- `-DWITH_SYSTEMD_DEBUG=bool`

  Se deve produzir informações de depuração adicionais do **systemd**, para plataformas nas quais o **systemd** é usado para executar o MySQL. O padrão é `OFF`.

  Essa opção foi adicionada no MySQL 8.0.22.

- `-DWITH_TCMALLOC=bool`

  Se deseja vincular com `-ltcmalloc`. Se ativado, as rotinas internas `malloc()`, `calloc()`, `realloc()` e `free()` são desativadas. O padrão é `OFF`.

  A partir do MySQL 8.0.38, uma biblioteca `tcmalloc` é incluída no código-fonte; você pode fazer com que a compilação use a versão incluída configurando essa opção para `BUNDLED`. `BUNDLED` é suportado apenas em sistemas Linux.

  `WITH_TCMALLOC` e `WITH_JEMALLOC` são mutuamente exclusivos.

  Essa opção foi adicionada no MySQL 8.0.22.

- `-DWITH_TEST_TRACE_PLUGIN=bool`

  Se deve construir o plugin de registro de traçado de protocolo de teste (veja Usar o plugin de registro de traçado de protocolo de teste). Por padrão, essa opção está desabilitada. Ativação dessa opção não tem efeito a menos que a opção `WITH_CLIENT_PROTOCOL_TRACING` esteja habilitada. Se o MySQL estiver configurado com ambas as opções habilitadas, a biblioteca de clientes `libmysqlclient` é construída com o plugin de registro de traçado de protocolo de teste integrado e todos os clientes padrão do MySQL carregam o plugin. No entanto, mesmo quando o plugin de teste está habilitado, ele não tem efeito por padrão. O controle do plugin é concedido usando variáveis de ambiente; veja Usar o plugin de registro de traçado de protocolo de teste.

  Nota

  Não habilite a opção `WITH_TEST_TRACE_PLUGIN` se você quiser usar seus próprios plugins de registro de protocolo, pois apenas um desses plugins pode ser carregado de cada vez e ocorrerá um erro para tentativas de carregar um segundo. Se você já construiu o MySQL com o plugin de registro de protocolo de teste habilitado para ver como ele funciona, você deve reconstruir o MySQL sem ele antes de poder usar seus próprios plugins.

  Para obter informações sobre como escrever plugins de registro, consulte Escrever plugins de registro de protocolo.

- `-DWITH_TSAN=bool`

  Se você deseja habilitar o ThreadSanitizer, para os compiladores que o suportam. O padrão é desativado.

- `-DWITH_UBSAN=bool`

  Se você deseja habilitar o Sanitizer de Comportamento Indeterminado, para os compiladores que o suportam. O padrão é desativado.

- `-DWITH_UNIT_TESTS={ON|OFF}`

  Se habilitado, compile o MySQL com testes unitários. O padrão é `ON` a menos que o servidor não esteja sendo compilado.

- `-DWITH_UNIXODBC=1`

  Habilita o suporte unixODBC, para o Connector/ODBC.

- `-DWITH_VALGRIND=bool`

  Se compilar os arquivos de cabeçalho do Valgrind, que expõe a API do Valgrind ao código do MySQL. O padrão é `OFF`.

  Para gerar uma compilação de depuração compatível com o Valgrind, `-DWITH_VALGRIND=1` normalmente é combinado com `-DWITH_DEBUG=1`. Veja Configuração de Compilação de Depuração.

- `-DWITH_WIN_JEMALLOC=string`

  No Windows, forneça um caminho para um diretório que contenha `jemalloc.dll` para habilitar a funcionalidade do jemalloc. O sistema de compilação copia `jemalloc.dll` para o mesmo diretório que `mysqld.exe` e/ou `mysqld-debug.exe` e utiliza-o para operações de gerenciamento de memória. As funções de memória padrão são usadas se `jemalloc.dll` não for encontrado ou não exportar as funções necessárias. Uma mensagem de log de nível INFORMÁTICO registra se o jemalloc é encontrado e utilizado ou

  Esta opção está habilitada para os binários oficiais do MySQL para Windows.

  Essa opção foi adicionada no MySQL 8.0.29.

- `-DWITH_ZLIB=zlib_type`

  Algumas funcionalidades exigem que o servidor seja construído com suporte a bibliotecas de compressão, como as funções `COMPRESS()` e `UNCOMPRESS()`, e a compressão do protocolo cliente/servidor. A opção `WITH_ZLIB` indica a origem do suporte a `zlib`:

  Em MYSQL 8.0.32 e versões posteriores, a versão mínima suportada do `zlib` é 1.2.13.

  - `bundled`: Use a biblioteca `zlib` incluída na distribuição. Isso é o padrão.

  - `system`: Use a biblioteca do sistema `zlib`. Se `WITH_ZLIB` estiver definido para este valor, o utilitário **zlib\_decompress** não será construído. Nesse caso, o comando **openssl zlib** do sistema pode ser usado.

- `-DWITH_ZSTD=zstd_type`

  A compressão de conexão usando o algoritmo `zstd` (veja a Seção 6.2.8, “Controle de Compressão de Conexão”) exige que o servidor seja construído com suporte à biblioteca `zstd`. A opção `WITH_ZSTD` indica a origem do suporte a `zstd`:

  - `bundled`: Use a biblioteca `zstd` incluída na distribuição. Isso é o padrão.

  - `system`: Use a biblioteca do sistema `zstd`.

  Essa opção foi adicionada no MySQL 8.0.18.

- `-DWITHOUT_SERVER=bool`

  Se deseja construir sem o MySQL Server. O padrão é OFF, o que constrói o servidor.

  Isso é considerado uma opção experimental; é preferível construir com o servidor.

  Essa opção também impede a construção do motor de armazenamento `NDB` ou de quaisquer binários `NDB`, incluindo programas de gerenciamento e de nó de dados.

#### Ferramentas do compilador

- `-DCMAKE_C_FLAGS="flags`"

  Bandeiras para o compilador C.

- `-DCMAKE_CXX_FLAGS="flags`"

  Ferramentas para o compilador C++.

- `-DWITH_DEFAULT_COMPILER_OPTIONS=bool`

  Se deve usar as bandeiras de `cmake/build_configurations/compiler_options.cmake`.

  Nota

  Todas as bandeiras de otimização são cuidadosamente escolhidas e testadas pela equipe de construção do MySQL. Sobrepor elas pode levar a resultados inesperados e é feito por sua conta e risco.

- `-DOPTIMIZE_SANITIZER_BUILDS=bool`

  Se adicionar `-O1 -fno-inline` às compilações do sanitizador. O padrão é `ON`.

Para especificar suas próprias flags do compilador C e C++, para as flags que não afetam a otimização, use as opções `CMAKE_C_FLAGS` e `CMAKE_CXX_FLAGS` do CMake.

Ao fornecer suas próprias flags do compilador, você pode querer especificar `CMAKE_BUILD_TYPE` também.

Por exemplo, para criar uma versão de 32 bits em uma máquina Linux de 64 bits, faça o seguinte:

```
$> mkdir build
$> cd build
$> cmake .. -DCMAKE_C_FLAGS=-m32 \
  -DCMAKE_CXX_FLAGS=-m32 \
  -DCMAKE_BUILD_TYPE=RelWithDebInfo
```

Se você definir flags que afetam a otimização (`-Onumber`), você deve definir as opções `CMAKE_C_FLAGS_build_type` e/ou `CMAKE_CXX_FLAGS_build_type`, onde `build_type` corresponde ao valor `CMAKE_BUILD_TYPE`. Para especificar uma otimização diferente para o tipo de compilação padrão (`RelWithDebInfo`), defina as opções `CMAKE_C_FLAGS_RELWITHDEBINFO` e `CMAKE_CXX_FLAGS_RELWITHDEBINFO`. Por exemplo, para compilar no Linux com `-O3` e com símbolos de depuração, faça o seguinte:

```
$> cmake .. -DCMAKE_C_FLAGS_RELWITHDEBINFO="-O3 -g" \
  -DCMAKE_CXX_FLAGS_RELWITHDEBINFO="-O3 -g"
```

#### Opções do CMake para compilar o NDB Cluster

Para compilar com suporte para NDB Cluster, você pode usar `-DWITH_NDB`, o que faz com que a compilação inclua o motor de armazenamento NDB e todos os programas NDB. Esta opção está habilitada por padrão. Para evitar a compilação do plugin do motor de armazenamento NDB, use `-DWITH_NDBCLUSTER_STORAGE_ENGINE=OFF`. Outros aspectos da compilação podem ser controlados usando as outras opções listadas nesta seção.

As seguintes opções se aplicam ao compilar as fontes do MySQL com suporte ao NDB Cluster.

- `-DMEMCACHED_HOME=dir_name`

  O suporte ao memcached `NDB` foi removido no NDB 8.0.23; portanto, essa opção não é mais suportada para a construção do `NDB` nesta ou em versões posteriores.

- `-DNDB_UTILS_LINK_DYNAMIC={ON|OFF}`

  Controla se as utilidades do NDB, como o **ndb\_drop\_table**, são vinculadas ao `ndbclient` estaticamente (`OFF`) ou dinamicamente (`ON`). O `OFF` (vinculação estática) é o padrão. Normalmente, a vinculação estática é usada ao compilar essas utilidades para evitar problemas com o `LD_LIBRARY_PATH`, ou quando múltiplas versões do `ndbclient` estão instaladas. Esta opção é destinada à criação de imagens Docker e, possivelmente, a outros casos em que o ambiente de destino está sujeito a um controle preciso e é desejável reduzir o tamanho da imagem.

  Adicionado na NDB 8.0.22.

- `-DWITH_BUNDLED_LIBEVENT={ON|OFF}`

  O suporte ao memcached `NDB` foi removido no NDB 8.0.23; portanto, essa opção não é mais suportada para a construção do `NDB` nesta ou em versões posteriores.

- `-DWITH_BUNDLED_MEMCACHED={ON|OFF}`

  O suporte ao memcached `NDB` foi removido no NDB 8.0.23; portanto, essa opção não é mais suportada para a construção do `NDB` nesta ou em versões posteriores.

- `-DWITH_CLASSPATH=path`

  Define o caminho de classe para a construção do Conector MySQL NDB Cluster para Java. O padrão é vazio. Esta opção é ignorada se `-DWITH_NDB_JAVA=OFF` for usado.

- `-DWITH_ERROR_INSERT={ON|OFF}`

  Habilita a injeção de erros no kernel `NDB`. Apenas para testes; não é destinado ao uso na construção de binários de produção. O padrão é `OFF`.

- `-DWITH_NDB={ON|OFF}`

  Construa o MySQL NDB Cluster; construa o plugin NDB e todos os programas do NDB Cluster.

  Adicionado na NDB 8.0.31.

- `-DWITH_NDBAPI_EXAMPLES={ON|OFF}`

  Construa programas de exemplo da API NDB em `storage/ndb/ndbapi-examples/`. Consulte Exemplos da API NDB para obter informações sobre eles.

- `-DWITH_NDBCLUSTER_STORAGE_ENGINE={ON|OFF}`

  *NDB 8.0.30 e versões anteriores*: Para uso interno apenas; pode não funcionar sempre conforme o esperado. Para construir com suporte ao `NDB`, use `WITH_NDBCLUSTER` em vez disso.

  *NDB 8.0.31 e versões posteriores*: Controla (somente) se o mecanismo de armazenamento `NDBCLUSTER` está incluído na compilação; `WITH_NDB` habilita essa opção automaticamente, portanto, é recomendável que você use `WITH_NDB` em vez disso.

- `-DWITH_NDBCLUSTER={ON|OFF}` (DESCONTINUADA)

  Construa e faça o link de suporte para o mecanismo de armazenamento `NDB` no **mysqld**.

  Esta opção está desatualizada a partir da NDB 8.0.31 e está sujeita à eventual remoção; use `WITH_NDB` em vez disso.

- `-DWITH_NDBMTD={ON|OFF}`

  Construa o executável do nó de dados multithreading \*\*ndbmtd"). O padrão é `ON`.

- `-DWITH_NDB_DEBUG={ON|OFF}`

  Ative a construção das versões de depuração dos binários do NDB Cluster. Isso é `OFF` por padrão.

- `-DWITH_NDB_JAVA={ON|OFF}`

  Ative a construção do NDB Cluster com suporte a Java, incluindo suporte para ClusterJ (consulte o Conector do NDB Cluster do MySQL para Java).

  Esta opção é `ON` por padrão. Se você não deseja compilar o NDB Cluster com suporte ao Java, você deve desabilitar explicitamente especificando `-DWITH_NDB_JAVA=OFF` ao executar o **CMake**. Caso contrário, se o Java não for encontrado, a configuração da compilação falhará.

- `-DWITH_NDB_PORT=port`

  Faz com que o servidor de gerenciamento do NDB Cluster (**ndb\_mgmd**) que é construído para usar este `port` por padrão. Se esta opção não for definida, o servidor de gerenciamento resultante tenta usar a porta 1186 por padrão.

- `-DWITH_NDB_TEST={ON|OFF}`

  Se habilitado, inclua um conjunto de programas de teste da API NDB. O padrão é `OFF`.

- `-DWITH_PLUGIN_NDBCLUSTER={ON|OFF}`

  Para uso interno apenas; pode não funcionar sempre conforme o esperado. Esta opção foi removida no NDB 8.0.31; use `WITH_NDB` em vez disso para construir o MySQL NDB Cluster. (*NDB 8.0.30 e versões anteriores*: Use `WITH_NDBCLUSTER`.)
