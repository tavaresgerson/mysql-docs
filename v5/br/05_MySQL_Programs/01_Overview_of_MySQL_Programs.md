## 4.1 Visão geral dos programas do MySQL

Existem muitos programas diferentes em uma instalação do MySQL. Esta seção fornece uma breve visão geral deles. Seções posteriores fornecem uma descrição mais detalhada de cada um, com exceção dos programas do NDB Cluster. A descrição de cada programa indica sua sintaxe de invocação e as opções que ele suporta. A Seção 21.5, “Programas do NDB Cluster”, descreve programas específicos para o NDB Cluster.

A maioria das distribuições do MySQL inclui todos esses programas, exceto aqueles que são específicos para a plataforma. (Por exemplo, os scripts de inicialização do servidor não são usados no Windows.) A exceção é que as distribuições RPM são mais especializadas. Há um RPM para o servidor, outro para programas de cliente, e assim por diante. Se você parece estar faltando um ou mais programas, consulte o Capítulo 2, *Instalando e Atualizando o MySQL*, para obter informações sobre os tipos de distribuições e o que elas contêm. Pode ser que você tenha uma distribuição que não inclui todos os programas e precise instalar um pacote adicional.

Cada programa do MySQL oferece muitas opções diferentes. A maioria dos programas oferece uma opção `--help` que você pode usar para obter uma descrição das diferentes opções do programa. Por exemplo, tente **mysql --help**.

Você pode substituir os valores padrão das opções dos programas MySQL especificando opções na linha de comando ou em um arquivo de opções. Consulte a Seção 4.2, “Usando programas MySQL”, para obter informações gerais sobre como invocar programas e especificar opções de programas.

O servidor MySQL, `mysqld`, é o principal programa que realiza a maior parte do trabalho em uma instalação do MySQL. O servidor é acompanhado por vários scripts relacionados que o ajudam a iniciar e parar o servidor:

* `mysqld`

O daemon SQL (ou seja, o servidor MySQL). Para usar programas de cliente, o `mysqld` deve estar em execução, porque os clientes obtêm acesso aos bancos de dados conectando-se ao servidor. Veja a Seção 4.3.1, “mysqld — O servidor MySQL”.

* `mysqld_safe`

Um script de inicialização do servidor. `mysqld_safe` tenta iniciar `mysqld`. Veja a Seção 4.3.2, “`mysqld_safe` — Script de inicialização do MySQL Server”.

* **mysql.server**

Um script de inicialização de servidor. Este script é usado em sistemas que utilizam diretórios de execução de estilo System V, contendo scripts que iniciam serviços do sistema para níveis de execução específicos. Ele invoca `mysqld_safe` para iniciar o servidor MySQL. Veja a Seção 4.3.3, “mysql.server — Script de inicialização do servidor MySQL”.

* `mysqld_multi`

Um script de inicialização de servidor que pode iniciar ou parar vários servidores instalados no sistema. Veja a Seção 4.3.4, “mysqld_multi — Gerenciar vários servidores MySQL”.

Vários programas realizam operações de configuração durante a instalação ou atualização do MySQL:

* **comp\_err**

Este programa é usado durante o processo de compilação/instalação do MySQL. Ele compila arquivos de mensagens de erro a partir dos arquivos de fonte de erro. Veja a Seção 4.4.1, “comp_err — Arquivo de Mensagem de Erro do MySQL”.

* **mysql\_install\_db**

Este programa inicializa o diretório de dados do MySQL, cria o banco de dados `mysql` e inicializa suas tabelas de concessão com privilégios padrão, e configura o espaço de sistema de tabelas `InnoDB`. Ele é geralmente executado apenas uma vez, quando o MySQL é instalado pela primeira vez em um sistema. Veja a Seção 4.4.2, “mysql\_install\_db — Inicializar o diretório de dados do MySQL”, e a Seção 2.9, “Configuração e teste pós-instalação”.

* **mysql_plugin**

Este programa configura plugins do servidor MySQL. Veja a Seção 4.4.3, “mysql_plugin — Configure plugins do servidor MySQL”.

* `mysql_secure_installation`

Este programa permite melhorar a segurança da sua instalação do MySQL. Veja a Seção 4.4.4, “mysql\_secure\_installation — Melhorar a segurança da instalação do MySQL”.

* `mysql_ssl_rsa_setup`

Este programa cria os arquivos de certificado SSL e chave e os arquivos de par de chave RSA necessários para suportar conexões seguras, se esses arquivos estiverem ausentes. Os arquivos criados por `mysql_ssl_rsa_setup` podem ser usados para conexões seguras usando SSL ou RSA. Veja a Seção 4.4.5, “mysql_ssl_rsa_setup — Crie arquivos SSL/RSA”.

* `mysql_tzinfo_to_sql`

Este programa carrega as tabelas de fuso horário no banco de dados `mysql` usando o conteúdo do banco de dados de zona do sistema hospedeiro (o conjunto de arquivos que descrevem os fusos horários). Veja a Seção 4.4.6, “`mysql_tzinfo_to_sql` — Carregar as Tabelas de Fuso Horário”.

* `mysqld_upgrade`

Este programa é usado após uma operação de atualização do MySQL. Ele atualiza as tabelas de concessão com quaisquer alterações que tenham sido feitas em versões mais recentes do MySQL e verifica as tabelas quanto a incompatibilidades e as repara, se necessário. Veja a Seção 4.4.7, “mysql_upgrade — Verificar e atualizar as tabelas do MySQL”.

Programas de cliente MySQL que se conectam ao servidor MySQL:

* **mysql**

A ferramenta de linha de comando para inserir interativamente instruções SQL ou executá-las a partir de um arquivo em modo em lote. Veja a Seção 4.5.1, “mysql — O cliente de linha de comando do MySQL”.

* **mysqladmin**

Um cliente que realiza operações administrativas, como criar ou descartar bancos de dados, recarregar as tabelas de concessão, limpar as tabelas no disco e reabrir os arquivos de registro. O **mysqladmin** também pode ser usado para recuperar informações de versão, processo e status do servidor. Veja a Seção 4.5.2, “mysqladmin — Um programa de administração do servidor MySQL”.

* **mysqlcheck**

Um cliente de manutenção de tabelas que verifica, repara, analisa e otimiza tabelas. Veja a Seção 4.5.3, “mysqlcheck — Um programa de manutenção de tabelas”.

* **mysqldump**

Um cliente que descarrega um banco de dados MySQL em um arquivo como SQL, texto ou XML. Veja a Seção 4.5.4, “mysqldump — Um programa de backup de banco de dados”.

* **mysqlimport**

Um cliente que importa arquivos de texto em suas tabelas respectivas usando `LOAD DATA`. Veja a Seção 4.5.5, “mysqlimport — Um programa de importação de dados”.

* **mysqlpump**

Um cliente que descarrega um banco de dados MySQL em um arquivo como SQL. Veja a Seção 4.5.6, “mysqlpump — Um programa de backup de banco de dados”.

* **mysqlsh**

O MySQL Shell é um cliente e editor de código avançado para o MySQL Server. Veja o MySQL Shell 8.0. Além da funcionalidade SQL fornecida, semelhante ao **mysql**, o MySQL Shell oferece capacidades de script para JavaScript e Python e inclui APIs para trabalhar com MySQL. O X DevAPI permite que você trabalhe com dados relacionais e de documentos, veja o Capítulo 19, *Usando MySQL como um Armazenamento de Documentos*. O AdminAPI permite que você trabalhe com o InnoDB Cluster, veja MySQL AdminAPI.

* **mysqlshow**

Um cliente que exibe informações sobre bancos de dados, tabelas, colunas e índices. Veja a Seção 4.5.7, “mysqlshow — Exibir informações de banco de dados, tabela e coluna”.

* **mysqlslap**

Um cliente projetado para emular a carga de clientes para um servidor MySQL e relatar o tempo de cada etapa. Funciona como se vários clientes estivessem acessando o servidor. Veja a Seção 4.5.8, “mysqlslap — Um cliente de emulação de carga”.

Programas administrativos e utilitários do MySQL:

* **innochecksum**

Um utilitário de verificação de checksum de arquivo offline `InnoDB`. Veja a Seção 4.6.1, “innochecksum — Utilitário de verificação de checksum de arquivo InnoDB offline”.

* **myisam\_ftdump**

Uma ferramenta que exibe informações sobre índices de texto completo em tabelas de `MyISAM`. Veja a Seção 4.6.2, “myisam\_ftdump — Exibir informações de índice de texto completo”.

* **myisamchk**

Uma ferramenta para descrever, verificar, otimizar e reparar as tabelas `MyISAM`. Veja a Seção 4.6.3, “myisamchk — Ferramenta de manutenção de tabelas MyISAM”.

* **myisamlog**

Uma utilitária que processa o conteúdo de um arquivo de registro `MyISAM`. Veja a Seção 4.6.4, “myisamlog — Exibir o conteúdo do arquivo de registro MyISAM”.

* **myisampack**

Uma utilitária que comprime as tabelas `MyISAM` para produzir tabelas menores e somente de leitura. Veja a Seção 4.6.5, “myisampack — Gerar tabelas MyISAM comprimidas e somente de leitura”.

* **mysql\_config\_editor**

Uma ferramenta que permite armazenar credenciais de autenticação em um arquivo seguro e criptografado de caminho de login chamado `.mylogin.cnf`. Veja a Seção 4.6.6, “mysql\_config\_editor — Ferramenta de Configuração MySQL”.

* **mysqlbinlog**

Uma ferramenta para ler declarações de um log binário. O log de declarações executadas contido nos arquivos de log binário pode ser usado para ajudar a recuperar de um crash. Veja a Seção 4.6.7, “mysqlbinlog — Ferramenta para processar arquivos de log binário”.

* **mysqldumpslow**

Uma ferramenta para ler e resumir o conteúdo de um log de consulta lenta. Veja a Seção 4.6.8, “mysqldumpslow — Resumir arquivos de log de consulta lenta”.

ferramentas de desenvolvimento de programas do MySQL:

* **mysql\_config**

Um script de shell que produz os valores de opção necessários ao compilar programas MySQL. Veja a Seção 4.7.1, “mysql_config — Exibir opções para compilar clientes”.

* **my\_print\_defaults**

Uma ferramenta que mostra quais opções estão presentes nos grupos de opções dos arquivos de opções. Veja a Seção 4.7.2, “my\_print\_defaults — Exibir opções de arquivos de opções”.

* **resolve\_stack\_dump**

Um programa utilitário que resolve um registro de depuração de pilha numérica em símbolos. Veja a Seção 4.7.3, “resolve\_stack\_dump — Resolva o registro de depuração de pilha numérica em símbolos”.

Utilidades diversas:

* **lz4\_decompress**

Uma ferramenta que descomprime a saída do **mysqlpump** que foi criada usando compressão LZ4. Veja a Seção 4.8.1, “lz4_decompress — Descomponha a saída comprimida do mysqlpump LZ4”.

* **perror**

Uma utilitária que exibe o significado dos códigos de erro do sistema ou MySQL. Veja a Seção 4.8.2, “perror — Exibir informações de mensagem de erro do MySQL”.

* **substitua**

Um programa utilitário que realiza substituição de strings no texto de entrada. Veja a Seção 4.8.3, “replace — Um utilitário de substituição de strings”.

* **resolveip**

Um programa utilitário que resolve um nome de host em um endereço IP ou vice-versa. Veja a Seção 4.8.4, “resolveip — Resolva nome de host em endereço IP ou vice-versa”.

* **zlib\_decompress**

Uma ferramenta que descomprime a saída do **mysqlpump** que foi criada usando compressão ZLIB. Veja a Seção 4.8.5, “zlib_decompress — Descomponha a saída compactada ZLIB do mysqlpump”.

A Oracle Corporation também fornece a ferramenta de interface gráfica MySQL Workbench, que é usada para administrar servidores e bancos de dados MySQL, criar, executar e avaliar consultas, e migrar esquemas e dados de outros sistemas de gerenciamento de banco de dados relacionais para uso com MySQL.

Os programas de cliente MySQL que se comunicam com o servidor usando a biblioteca cliente/servidor MySQL utilizam as seguintes variáveis de ambiente.

<table summary="Environment variables used by MySQL client programs that communicate with the server using the MySQL client/server library."><col style="width: 25%"/><col style="width: 75%"/><thead><tr> <th>Environment Variable</th> <th>Significado</th> </tr></thead><tbody><tr> <td><code>MYSQL_UNIX_PORT</code></td> <td>O arquivo padrão de socket Unix; usado para conexões com<code>localhost</code></td> </tr><tr> <td><code>MYSQL_TCP_PORT</code></td> <td>O número de porta padrão; usado para conexões TCP/IP</td> </tr><tr> <td><code>MYSQL_PWD</code></td> <td>A senha padrão</td> </tr><tr> <td><code>MYSQL_DEBUG</code></td> <td>Opções de rastreamento de depuração quando depurando</td> </tr><tr> <td><code>TMPDIR</code></td> <td>O diretório onde as tabelas e arquivos temporários são criados</td> </tr></tbody></table>

Para uma lista completa das variáveis de ambiente usadas pelos programas do MySQL, consulte a Seção 4.9, “Variáveis de ambiente”.

O uso de `MYSQL_PWD` é inseguro. Veja a Seção 6.1.2.1, “Diretrizes para o Usuário Final sobre Segurança de Senhas”.