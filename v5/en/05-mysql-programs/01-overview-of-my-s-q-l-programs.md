## 4.1 Visão Geral dos Programas MySQL

Há muitos programas diferentes em uma instalação MySQL. Esta seção fornece uma breve visão geral deles. Seções posteriores fornecem uma descrição mais detalhada de cada um, com exceção dos programas NDB Cluster. A descrição de cada programa indica sua sintaxe de invocação e as opções que ele suporta. A Seção 21.5, “NDB Cluster Programs”, descreve programas específicos do NDB Cluster.

A maioria das distribuições MySQL inclui todos esses programas, exceto aqueles que são específicos de plataforma. (Por exemplo, os scripts de inicialização do server não são usados no Windows.) A exceção é que as distribuições RPM são mais especializadas. Há um RPM para o server, outro para programas client, e assim por diante. Se você notar a ausência de um ou mais programas, consulte o Capítulo 2, *Installing and Upgrading MySQL*, para obter informações sobre os tipos de distribuição e o que eles contêm. Pode ser que você tenha uma distribuição que não inclua todos os programas e precise instalar um pacote adicional.

Cada programa MySQL aceita muitas opções diferentes. A maioria dos programas fornece uma opção `--help` que você pode usar para obter uma descrição das diferentes opções do programa. Por exemplo, tente **mysql --help**.

Você pode substituir os valores de opção padrão para programas MySQL especificando opções na linha de comando ou em um option file. Consulte a Seção 4.2, “Using MySQL Programs”, para obter informações gerais sobre a invocação de programas e a especificação de opções de programas.

O MySQL server, **mysqld**, é o programa principal que realiza a maior parte do trabalho em uma instalação MySQL. O server é acompanhado por vários scripts relacionados que auxiliam na inicialização e parada do server:

* **mysqld**

  O daemon SQL (ou seja, o MySQL server). Para usar programas client, o **mysqld** deve estar em execução, pois os clients obtêm acesso aos Databases conectando-se ao server. Consulte a Seção 4.3.1, “mysqld — The MySQL Server”.

* **mysqld_safe**

  Um script de inicialização do server. O **mysqld_safe** tenta iniciar o **mysqld**. Consulte a Seção 4.3.2, “mysqld_safe — MySQL Server Startup Script”.

* **mysql.server**

  Um script de inicialização do server. Este script é usado em sistemas que utilizam diretórios de execução no estilo System V contendo scripts que iniciam serviços do sistema para níveis de execução específicos. Ele invoca **mysqld_safe** para iniciar o MySQL server. Consulte a Seção 4.3.3, “mysql.server — MySQL Server Startup Script”.

* **mysqld_multi**

  Um script de inicialização do server que pode iniciar ou parar múltiplos servers instalados no sistema. Consulte a Seção 4.3.4, “mysqld_multi — Manage Multiple MySQL Servers”.

Vários programas executam operações de configuração durante a instalação ou atualização do MySQL:

* **comp_err**

  Este programa é usado durante o processo de build/instalação do MySQL. Ele compila arquivos de mensagens de erro a partir dos arquivos de origem de erro. Consulte a Seção 4.4.1, “comp_err — Compile MySQL Error Message File”.

* **mysql_install_db**

  Este programa inicializa o data directory do MySQL, cria o Database `mysql` e inicializa suas grant tables com privilégios padrão, e configura o tablespace do sistema `InnoDB`. Geralmente, ele é executado apenas uma vez, ao instalar o MySQL pela primeira vez em um sistema. Consulte a Seção 4.4.2, “mysql_install_db — Initialize MySQL Data Directory”, e Seção 2.9, “Postinstallation Setup and Testing”.

* **mysql_plugin**

  Este programa configura plugins do MySQL server. Consulte a Seção 4.4.3, “mysql_plugin — Configure MySQL Server Plugins”.

* **mysql_secure_installation**

  Este programa permite melhorar a segurança da sua instalação MySQL. Consulte a Seção 4.4.4, “mysql_secure_installation — Improve MySQL Installation Security”.

* **mysql_ssl_rsa_setup**

  Este programa cria os arquivos de certificado e chave SSL e os arquivos de par de chaves RSA necessários para suportar conexões seguras, caso esses arquivos estejam ausentes. Os arquivos criados por **mysql_ssl_rsa_setup** podem ser usados para conexões seguras usando SSL ou RSA. Consulte a Seção 4.4.5, “mysql_ssl_rsa_setup — Create SSL/RSA Files”.

* **mysql_tzinfo_to_sql**

  Este programa carrega as tabelas de fuso horário no Database `mysql` usando o conteúdo do Database zoneinfo do sistema host (o conjunto de arquivos que descrevem os fusos horários). Consulte a Seção 4.4.6, “mysql_tzinfo_to_sql — Load the Time Zone Tables”.

* **mysql_upgrade**

  Este programa é usado após uma operação de upgrade do MySQL. Ele atualiza as grant tables com quaisquer alterações feitas em versões mais recentes do MySQL e verifica as tabelas quanto a incompatibilidades, reparando-as se necessário. Consulte a Seção 4.4.7, “mysql_upgrade — Check and Upgrade MySQL Tables”.

Programas client MySQL que se conectam ao MySQL server:

* **mysql**

  A ferramenta de linha de comando para inserir interativamente instruções SQL ou executá-las a partir de um arquivo em modo batch. Consulte a Seção 4.5.1, “mysql — The MySQL Command-Line Client”.

* **mysqladmin**

  Um client que executa operações administrativas, como criar ou descartar Databases, recarregar as grant tables, fazer flush de tabelas para o disco e reabrir log files. O **mysqladmin** também pode ser usado para recuperar informações de versão, processo e status do server. Consulte a Seção 4.5.2, “mysqladmin — A MySQL Server Administration Program”.

* **mysqlcheck**

  Um client de manutenção de tabelas que verifica, repara, analisa e otimiza tabelas. Consulte a Seção 4.5.3, “mysqlcheck — A Table Maintenance Program”.

* **mysqldump**

  Um client que despeja um Database MySQL em um arquivo como SQL, texto ou XML. Consulte a Seção 4.5.4, “mysqldump — A Database Backup Program”.

* **mysqlimport**

  Um client que importa arquivos de texto para suas respectivas tabelas usando `LOAD DATA`. Consulte a Seção 4.5.5, “mysqlimport — A Data Import Program”.

* **mysqlpump**

  Um client que despeja um Database MySQL em um arquivo como SQL. Consulte a Seção 4.5.6, “mysqlpump — A Database Backup Program”.

* **mysqlsh**

  O MySQL Shell é um client avançado e editor de código para o MySQL Server. Consulte MySQL Shell 8.0. Além da funcionalidade SQL fornecida, semelhante ao **mysql**, o MySQL Shell oferece recursos de scripting para JavaScript e Python e inclui APIs para trabalhar com MySQL. O X DevAPI permite trabalhar com dados relacionais e de documentos, consulte o Capítulo 19, *Using MySQL as a Document Store*. O AdminAPI permite trabalhar com o InnoDB Cluster, consulte MySQL AdminAPI.

* **mysqlshow**

  Um client que exibe informações sobre Databases, tabelas, colunas e Indexes. Consulte a Seção 4.5.7, “mysqlshow — Display Database, Table, and Column Information”.

* **mysqlslap**

  Um client projetado para emular o client load para um MySQL server e relatar o tempo de cada estágio. Ele funciona como se múltiplos clients estivessem acessando o server. Consulte a Seção 4.5.8, “mysqlslap — A Load Emulation Client”.

Programas utilitários e administrativos do MySQL:

* **innochecksum**

  Um utilitário de checksum de arquivo offline `InnoDB`. Consulte a Seção 4.6.1, “innochecksum — Offline InnoDB File Checksum Utility”.

* **myisam_ftdump**

  Um utilitário que exibe informações sobre full-text Indexes em tabelas `MyISAM`. Consulte a Seção 4.6.2, “myisam_ftdump — Display Full-Text Index information”.

* **myisamchk**

  Um utilitário para descrever, verificar, otimizar e reparar tabelas `MyISAM`. Consulte a Seção 4.6.3, “myisamchk — MyISAM Table-Maintenance Utility”.

* **myisamlog**

  Um utilitário que processa o conteúdo de um log file `MyISAM`. Consulte a Seção 4.6.4, “myisamlog — Display MyISAM Log File Contents”.

* **myisampack**

  Um utilitário que compacta tabelas `MyISAM` para produzir tabelas read-only menores. Consulte a Seção 4.6.5, “myisampack — Generate Compressed, Read-Only MyISAM Tables”.

* **mysql_config_editor**

  Um utilitário que permite armazenar credenciais de autenticação em um arquivo de login path seguro e criptografado chamado `.mylogin.cnf`. Consulte a Seção 4.6.6, “mysql_config_editor — MySQL Configuration Utility”.

* **mysqlbinlog**

  Um utilitário para ler instruções de um binary log. O log de instruções executadas contido nos arquivos de binary log pode ser usado para auxiliar na recuperação de um crash. Consulte a Seção 4.6.7, “mysqlbinlog — Utility for Processing Binary Log Files”.

* **mysqldumpslow**

  Um utilitário para ler e resumir o conteúdo de um slow query log. Consulte a Seção 4.6.8, “mysqldumpslow — Summarize Slow Query Log Files”.

Utilitários de desenvolvimento de programas MySQL:

* **mysql_config**

  Um script shell que produz os valores de opção necessários ao compilar programas MySQL. Consulte a Seção 4.7.1, “mysql_config — Display Options for Compiling Clients”.

* **my_print_defaults**

  Um utilitário que mostra quais opções estão presentes em option groups de option files. Consulte a Seção 4.7.2, “my_print_defaults — Display Options from Option Files”.

* **resolve_stack_dump**

  Um programa utilitário que resolve um stack trace dump numérico para símbolos. Consulte a Seção 4.7.3, “resolve_stack_dump — Resolve Numeric Stack Trace Dump to Symbols”.

Utilitários diversos:

* **lz4_decompress**

  Um utilitário que descompacta a saída do **mysqlpump** que foi criada usando compressão LZ4. Consulte a Seção 4.8.1, “lz4_decompress — Decompress mysqlpump LZ4-Compressed Output”.

* **perror**

  Um utilitário que exibe o significado de códigos de erro de sistema ou MySQL. Consulte a Seção 4.8.2, “perror — Display MySQL Error Message Information”.

* **replace**

  Um programa utilitário que realiza string replacement no texto de entrada. Consulte a Seção 4.8.3, “replace — A String-Replacement Utility”.

* **resolveip**

  Um programa utilitário que resolve um host name para um IP address ou vice-versa. Consulte a Seção 4.8.4, “resolveip — Resolve Host name to IP Address or Vice Versa”.

* **zlib_decompress**

  Um utilitário que descompacta a saída do **mysqlpump** que foi criada usando compressão ZLIB. Consulte a Seção 4.8.5, “zlib_decompress — Decompress mysqlpump ZLIB-Compressed Output”.

A Oracle Corporation também fornece a ferramenta GUI MySQL Workbench, que é usada para administrar MySQL servers e Databases, para criar, executar e avaliar Queries, e para migrar schemas e dados de outros sistemas de gerenciamento de Database relacionais para uso com MySQL.

Programas client MySQL que se comunicam com o server usando a library client/server MySQL usam as seguintes environment variables.

<table summary="Environment variables used by MySQL client programs that communicate with the server using the MySQL client/server library."><thead><tr> <th>Environment Variable</th> <th>Significado</th> </tr></thead><tbody><tr> <td><code>MYSQL_UNIX_PORT</code></td> <td>O arquivo default de Unix socket; usado para conexões com <code>localhost</code></td> </tr><tr> <td><code>MYSQL_TCP_PORT</code></td> <td>O número default da porta; usado para conexões TCP/IP</td> </tr><tr> <td><code>MYSQL_PWD</code></td> <td>O password default</td> </tr><tr> <td><code>MYSQL_DEBUG</code></td> <td>Opções de Debug trace durante a depuração</td> </tr><tr> <td><code>TMPDIR</code></td> <td>O diretório onde tabelas temporárias e arquivos são criados</td> </tr></tbody></table>

Para uma lista completa das environment variables usadas por programas MySQL, consulte a Seção 4.9, “Environment Variables”.

O uso de `MYSQL_PWD` é inseguro. Consulte a Seção 6.1.2.1, “End-User Guidelines for Password Security”.
