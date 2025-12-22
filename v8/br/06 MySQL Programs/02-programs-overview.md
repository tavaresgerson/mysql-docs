## 6.1 Visão geral dos programas MySQL

Existem muitos programas diferentes em uma instalação MySQL. Esta seção fornece uma breve visão geral deles. Seções posteriores fornecem uma descrição mais detalhada de cada um, com exceção dos programas do Cluster NDB. A descrição de cada programa indica sua sintaxe de invocação e as opções que ele suporta. Seção 25.5,  Programas de Cluster NDB, descreve programas específicos para o Cluster NDB.

A maioria das distribuições do MySQL inclui todos esses programas, exceto os programas que são específicos da plataforma. (Por exemplo, os scripts de inicialização do servidor não são usados no Windows.) A exceção é que as distribuições RPM são mais especializadas. Há um RPM para o servidor, outro para os programas do cliente, e assim por diante. Se você parece estar faltando um ou mais programas, consulte o Capítulo 2, *Instalar o MySQL*, para obter informações sobre os tipos de distribuições e o que elas contêm. Pode ser que você tenha uma distribuição que não inclui todos os programas e você precisa instalar um pacote adicional.

Cada programa MySQL tem muitas opções diferentes. A maioria dos programas fornece uma opção `--help` que você pode usar para obter uma descrição das diferentes opções do programa. Por exemplo, tente **mysql --help**.

Você pode substituir os valores de opção padrão para programas MySQL especificando opções na linha de comando ou em um arquivo de opções. Veja a Seção 6.2, "Using MySQL Programs", para informações gerais sobre a invocação de programas e especificar opções de programa.

O servidor MySQL, `mysqld`, é o principal programa que faz a maior parte do trabalho em uma instalação MySQL. O servidor é acompanhado por vários scripts relacionados que ajudam você a iniciar e parar o servidor:

- - O quê?

O demônio SQL (ou seja, o servidor MySQL). Para usar programas cliente, `mysqld` deve estar em execução, porque os clientes ganham acesso aos bancos de dados ao se conectar ao servidor. Veja Seção 6.3.1, mysqld  O Servidor MySQL.

- - Não,

Um script de inicialização do servidor. **mysqld\_safe** tenta iniciar `mysqld`. Ver Seção 6.3.2, mysqld\_safe  MySQL Server Startup Script.

- - mysql.server \*

Um script de inicialização de servidor. Este script é usado em sistemas que usam diretórios de execução de estilo System V contendo scripts que iniciam serviços de sistema para níveis de execução específicos. Ele invoca **mysqld\_safe** para iniciar o servidor MySQL. Veja Seção 6.3.3, mysql.server  MySQL Server Startup Script.

- - Não,

Um script de inicialização de servidor que pode iniciar ou parar vários servidores instalados no sistema. Ver Seção 6.3.4, mysqld\_multi  Gerenciar múltiplos servidores MySQL.

Vários programas executam operações de configuração durante a instalação ou atualização do MySQL:

- - Comp\_err \*

Este programa é usado durante o processo de construção / instalação do MySQL. Ele compila arquivos de mensagem de erro a partir dos arquivos de origem de erro. Veja Seção 6.4.1, comp\_err  Compile MySQL Error Message File.

- - Instalação segura \*

Este programa permite-lhe melhorar a segurança da sua instalação MySQL. Ver Secção 6.4.2, mysql\_secure\_installation  Improve MySQL Installation Security.

- O que é que se passa?

Este programa carrega as tabelas de fusos horários na base de dados `mysql` usando o conteúdo da base de dados zoneinfo do sistema host (o conjunto de arquivos que descrevem fusos horários).

Programas cliente MySQL que se conectam ao servidor MySQL:

- - O quê?

A ferramenta de linha de comando para inserir interativamente instruções SQL ou executá-las a partir de um arquivo em modo de lote. Veja Seção 6.5.1, mysql  The MySQL Command-Line Client.

- - O que é?

Um cliente que executa operações administrativas, como criar ou soltar bancos de dados, recarregar as tabelas de concessão, limpar tabelas no disco e reabrir arquivos de log. `mysqladmin` também pode ser usado para recuperar informações de versão, processo e status do servidor. Veja Seção 6.5.2, mysqladmin  Um programa de administração do servidor MySQL.

- - O quê?

Um cliente de manutenção de tabelas que verifica, repara, analisa e otimiza tabelas.

- Não, não, não,

Um cliente que armazena um banco de dados MySQL em um arquivo como SQL, texto ou XML. Veja Seção 6.5.4, mysqldump  Um Programa de Backup de Base de Dados.

- - O que é que estás a fazer?

Um cliente que importa arquivos de texto em suas respectivas tabelas usando `LOAD DATA`. Ver Seção 6.5.5, mysqlimport  Um Programa de Importação de Dados.

- - O quê? - O quê?

  O MySQL Shell é um cliente avançado e editor de código para o MySQL Server. Veja o MySQL Shell 8.4. Além da funcionalidade SQL fornecida, semelhante ao `mysql`, o MySQL Shell fornece recursos de scripting para JavaScript e Python e inclui APIs para trabalhar com o MySQL.
- - O que é que estás a fazer?

Um cliente que exibe informações sobre bancos de dados, tabelas, colunas e índices. Ver Seção 6.5.6, mysqlshow  Display Database, Table, and Column Information.

- Não, não, não,

Um cliente que é projetado para emular a carga do cliente para um servidor MySQL e relatar o tempo de cada estágio. Ele funciona como se vários clientes estivessem acessando o servidor. Veja Seção 6.5.7, mysqlslap  Um Cliente de Emulação de Carga.

Programas administrativos e utilitários do MySQL:

- - Sumário sem verificação \*

Um utilitário de checksum de arquivo offline `InnoDB`. Veja Seção 6.6.2, innochecksum  Offline InnoDB File Checksum Utility.

- O que é que se passa?

Um utilitário que exibe informações sobre índices de texto completo em tabelas PH. Ver Seção 6.6.3, myisam\_ftdump  Display Full-Text Index information.

- O meu samchk

Um utilitário para descrever, verificar, otimizar e reparar tabelas `MyISAM`. Ver Seção 6.6.4, myisamchk  MyISAM Table-Maintenance Utility.

- O meu "log"

Um utilitário que processa o conteúdo de um ficheiro de registo `MyISAM`. Ver Secção 6.6.5, myisamlog  Display MyISAM Log File Contents.

- O meu saco

Um utilitário que comprime tabelas `MyISAM` para produzir tabelas de somente leitura menores. Ver Seção 6.6.6, myisampack  Gerar tabelas MyISAM comprimidas e somente leitura.

- - mysql\_config\_editor \*

Um utilitário que permite armazenar credenciais de autenticação em um arquivo de caminho de login criptografado e seguro chamado `.mylogin.cnf`. Ver Seção 6.6.7, mysql\_config\_editor  MySQL Configuration Utility.

- - Não, não,

Um utilitário para migrar chaves entre um componente de chaveiro e outro. Ver Seção 6.6.8, mysql\_migrate\_keyring  Keyring Key Migration Utility.

- O que é que se passa?

Um utilitário para leitura de instruções de um log binário. O log de instruções executadas contidas nos arquivos de log binário pode ser usado para ajudar a recuperar de uma falha. Veja Seção 6.6.9, mysqlbinlog  Utilidade para Processamento de Arquivos de Log Binário.

- O meu cérebro está lento.

Um utilitário para ler e resumir o conteúdo de um log de consulta lenta.

Utilidades de desenvolvimento de programas MySQL:

- \*\* mysql\_config\*\*

Um script de shell que produz os valores de opção necessários ao compilar programas MySQL. Ver Seção 6.7.1, mysql\_config  Opções de exibição para compilar clientes.

- \*\* minha\_impressão\_padrão\*\*

Um utilitário que mostra quais as opções presentes nos grupos de opções dos ficheiros de opções.

Utilidades diversas:

- - Perror \*

Um utilitário que exibe o significado de códigos de erro do sistema ou do MySQL. Ver Seção 6.8.1, perror  Display MySQL Error Message Information.

A Oracle Corporation também fornece a ferramenta GUI MySQL Workbench, que é usada para administrar servidores e bancos de dados MySQL, para criar, executar e avaliar consultas e migrar esquemas e dados de outros sistemas de gerenciamento de banco de dados relacionais para uso com o MySQL.

Os programas cliente MySQL que se comunicam com o servidor usando a biblioteca cliente / servidor MySQL usam as seguintes variáveis de ambiente.

<table><col style="width: 25%"/><col style="width: 75%"/><thead><tr> <th>Variabilidade do ambiente</th> <th>Significado</th> </tr></thead><tbody><tr> <td>[[<code>MYSQL_UNIX_PORT</code>]]</td> <td>O arquivo de soquete padrão do Unix; usado para conexões com [[<code>localhost</code>]]</td> </tr><tr> <td>[[<code>MYSQL_TCP_PORT</code>]]</td> <td>Número de porta padrão; utilizado para conexões TCP/IP</td> </tr><tr> <td>[[<code>MYSQL_DEBUG</code>]]</td> <td>Opções de rastreamento de depuração ao depurar</td> </tr><tr> <td>[[<code>TMPDIR</code>]]</td> <td>O diretório onde são criadas tabelas e ficheiros temporários</td> </tr></tbody></table>

Para uma lista completa de variáveis de ambiente usadas por programas MySQL, consulte a Seção 6.9, "Variaveis de Ambiente".
