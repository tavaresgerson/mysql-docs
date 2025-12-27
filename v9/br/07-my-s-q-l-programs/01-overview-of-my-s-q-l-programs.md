## 6.1 Visão geral dos programas do MySQL

Existem muitos programas diferentes em uma instalação do MySQL. Esta seção fornece uma breve visão geral deles. Seções posteriores fornecem uma descrição mais detalhada de cada um, com exceção dos programas do NDB Cluster. A descrição de cada programa indica sua sintaxe de invocação e as opções que ele suporta. A seção 25.5, “Programas do NDB Cluster”, descreve programas específicos para o NDB Cluster.

A maioria das distribuições do MySQL inclui todos esses programas, exceto aqueles programas que são específicos da plataforma. (Por exemplo, os scripts de inicialização do servidor não são usados no Windows.) A exceção é que as distribuições RPM são mais especializadas. Há um RPM para o servidor, outro para programas cliente, e assim por diante. Se você parece estar faltando um ou mais programas, consulte o Capítulo 2, *Instalando o MySQL*, para informações sobre os tipos de distribuições e o que elas contêm. Pode ser que você tenha uma distribuição que não inclui todos os programas e precise instalar um pacote adicional.

Cada programa do MySQL aceita muitas opções diferentes. A maioria dos programas fornece uma opção `--help` que você pode usar para obter uma descrição das diferentes opções do programa. Por exemplo, tente **mysql --help**.

Você pode substituir os valores padrão das opções dos programas do MySQL especificando opções na linha de comando ou em um arquivo de opções. Consulte a Seção 6.2, “Usando os Programas do MySQL”, para informações gerais sobre como invocar programas e especificar opções de programas.

O servidor MySQL, **mysqld**, é o programa principal que faz a maior parte do trabalho em uma instalação do MySQL. O servidor é acompanhado por vários scripts relacionados que o auxiliam no início e no desligamento do servidor:

* **mysqld**

O daemon SQL (ou seja, o servidor MySQL). Para usar programas clientes, o **mysqld** deve estar em execução, pois os clientes obtêm acesso às bases de dados conectando-se ao servidor. Veja a Seção 6.3.1, “mysqld — O Servidor MySQL”.

* **mysqld_safe**

  Um script de inicialização do servidor. O **mysqld_safe** tenta iniciar o **mysqld**. Veja a Seção 6.3.2, “mysqld_safe — Script de Inicialização do Servidor MySQL”.

* **mysql.server**

  Um script de inicialização do servidor. Este script é usado em sistemas que usam diretórios de execução estilo System V contendo scripts que iniciam serviços do sistema para níveis de execução específicos. Ele invoca o **mysqld_safe** para iniciar o servidor MySQL. Veja a Seção 6.3.3, “mysql.server — Script de Inicialização do Servidor MySQL”.

* **mysqld_multi**

  Um script de inicialização do servidor que pode iniciar ou parar vários servidores instalados no sistema. Veja a Seção 6.3.4, “mysqld_multi — Gerenciar Múltiplos Servidores MySQL”.

Vários programas realizam operações de configuração durante a instalação ou atualização do MySQL:

* **comp\_err**

  Este programa é usado durante o processo de compilação/instalação do MySQL. Ele compila arquivos de mensagens de erro a partir dos arquivos de origem de erro. Veja a Seção 6.4.1, “comp\_err — Compilar Arquivo de Mensagem de Erro MySQL”.

* **mysql\_secure\_installation**

  Este programa permite que você melhore a segurança da sua instalação do MySQL. Veja a Seção 6.4.2, “mysql\_secure\_installation — Melhorar a Segurança da Instalação MySQL”.

* **mysql\_tzinfo\_to\_sql**

  Este programa carrega as tabelas de fuso horário no banco de dados `mysql` usando o conteúdo do banco de dados de zoneinfo do sistema hospedeiro (o conjunto de arquivos que descrevem fusos horários). Veja a Seção 6.4.3, “mysql\_tzinfo\_to\_sql — Carregar as Tabelas de Fuso Horário”.

Programas clientes do MySQL que se conectam ao servidor MySQL:

* **mysql**

A ferramenta de linha de comando para inserir instruções SQL interativamente ou executá-las a partir de um arquivo em modo batch. Veja a Seção 6.5.1, “mysql — O Cliente de Linha de Comando do MySQL”.

* **mysqladmin**

  Um cliente que realiza operações administrativas, como criar ou excluir bancos de dados, recarregar as tabelas de concessão, esvaziar tabelas para o disco e reabrir arquivos de log. O **mysqladmin** também pode ser usado para recuperar informações de versão, processo e status do servidor. Veja a Seção 6.5.2, “mysqladmin — Um Programa de Administração do Servidor MySQL”.

* **mysqlcheck**

  Um cliente de manutenção de tabelas que verifica, conserta, analisa e otimiza tabelas. Veja a Seção 6.5.3, “mysqlcheck — Um Programa de Manutenção de Tabelas”.

* **mysqldump**

  Um cliente que salva um banco de dados MySQL em um arquivo como SQL, texto ou XML. Veja a Seção 6.5.4, “mysqldump — Um Programa de Backup de Banco de Dados”.

* **mysqlimport**

  Um cliente que importa arquivos de texto em suas tabelas respectivas usando `LOAD DATA`. Veja a Seção 6.5.5, “mysqlimport — Um Programa de Importação de Dados”.

* **mysqlsh**

  O MySQL Shell é um cliente e editor de código avançado para o MySQL Server. Veja o MySQL Shell 9.5. Além da funcionalidade SQL fornecida, semelhante ao **mysql**, o MySQL Shell oferece capacidades de script para JavaScript e Python e inclui APIs para trabalhar com o MySQL. A X DevAPI permite trabalhar com dados relacionais e de documento, veja o Capítulo 22, *Usando o MySQL como um Armazenamento de Documentos*. AdminAPI permite trabalhar com o InnoDB Cluster, veja MySQL AdminAPI.

* **mysqlshow**

  Um cliente que exibe informações sobre bancos de dados, tabelas, colunas e índices. Veja a Seção 6.5.6, “mysqlshow — Exibir Informações de Banco de Dados, Tabela e Coluna”.

* **mysqlslap**

Um cliente projetado para emular a carga de clientes para um servidor MySQL e relatar o tempo de cada etapa. Funciona como se vários clientes estivessem acessando o servidor. Veja a Seção 6.5.7, “mysqlslap — Um Cliente de Emulação de Carga”.

Programas administrativos e utilitários do MySQL:

* **innochecksum**

  Uma utilitário de verificação de checksum de arquivo offline do `InnoDB`. Veja a Seção 6.6.2, “innochecksum — Utilitário de Verificação de Checksum de Arquivo Offline do `InnoDB`”.

* **myisam\_ftdump**

  Uma utilitário que exibe informações sobre índices de texto completo em tabelas `MyISAM`. Veja a Seção 6.6.3, “myisam\_ftdump — Exibir Informações de Índice de Texto Completo”.

* **myisamchk**

  Uma utilitário para descrever, verificar, otimizar e reparar tabelas `MyISAM`. Veja a Seção 6.6.4, “myisamchk — Utilitário de Manutenção de Tabelas MyISAM”.

* **myisamlog**

  Uma utilitário que processa o conteúdo de um arquivo de log `MyISAM`. Veja a Seção 6.6.5, “myisamlog — Exibir Conteúdo do Arquivo de Log MyISAM”.

* **myisampack**

  Uma utilitário que comprime tabelas `MyISAM` para produzir tabelas menores e apenas de leitura. Veja a Seção 6.6.6, “myisampack — Gerar Tabelas MyISAM Compridas e Apenas de Leitura”.

* **mysql\_config\_editor**

  Uma utilitário que permite armazenar credenciais de autenticação em um arquivo de caminho de login seguro e criptografado chamado `.mylogin.cnf`. Veja a Seção 6.6.7, “mysql\_config\_editor — Utilitário de Configuração MySQL”.

* **mysql\_migrate\_keyring**

  Uma utilitário para migrar chaves entre um componente de chave e outro. Veja a Seção 6.6.8, “mysql\_migrate\_keyring — Utilitário de Migração de Chaves de Chave”.

* **mysqlbinlog**

  Uma utilitário para ler declarações de um log binário. O log de declarações executadas contidas nos arquivos de log binários pode ser usado para ajudar a recuperar de um travamento. Veja a Seção 6.6.9, “mysqlbinlog — Utilitário para Processamento de Arquivos de Log Binários”.

* **mysqldumpslow**

Uma ferramenta para ler e resumir o conteúdo de um log de consultas lentas. Veja a Seção 6.6.10, “mysqldumpslow — Resumir arquivos de log de consultas lentas”.

Ferramentas de desenvolvimento de programas do MySQL:

* **mysql\_config**

  Um script de shell que gera os valores das opções necessários ao compilar programas do MySQL. Veja a Seção 6.7.1, “mysql\_config — Exibir opções para compilar clientes”.

* **my\_print\_defaults**

  Uma ferramenta que mostra quais opções estão presentes em grupos de opções de arquivos de opções. Veja a Seção 6.7.2, “my\_print\_defaults — Exibir opções de arquivos de opções”.

Ferramentas diversas:

* **perror**

  Uma ferramenta que exibe o significado dos códigos de erro do sistema ou do MySQL. Veja a Seção 6.8.1, “perror — Exibir informações de mensagens de erro do MySQL”.

A Oracle Corporation também fornece a ferramenta de interface gráfica MySQL Workbench, que é usada para administrar servidores e bancos de dados do MySQL, criar, executar e avaliar consultas e migrar esquemas e dados de outros sistemas de gerenciamento de banco de dados relacionais para uso com o MySQL.

Os programas clientes do MySQL que se comunicam com o servidor usando a biblioteca cliente/servidor do MySQL usam as seguintes variáveis de ambiente.

<table summary="Variáveis de ambiente usadas por programas clientes do MySQL que se comunicam com o servidor usando a biblioteca cliente/servidor do MySQL."><col style="width: 25%"/><col style="width: 75%"/><thead><tr> <th>Variável de Ambiente</th> <th>Significado</th> </tr></thead><tbody><tr> <td><code class="literal">MYSQL_UNIX_PORT</code></td> <td>O arquivo de socket Unix padrão; usado para conexões com <code class="literal">localhost</code></td> </tr><tr> <td><code class="literal">MYSQL_TCP_PORT</code></td> <td>O número de porta padrão; usado para conexões TCP/IP</td> </tr><tr> <td><code class="literal">MYSQL_DEBUG</code></td> <td>Opções de registro de depuração durante a depuração</td> </tr><tr> <td><code class="literal">TMPDIR</code></td> <td>O diretório onde tabelas e arquivos temporários são criados</td> </tr></tbody></table>

Para uma lista completa das variáveis de ambiente usadas pelos programas do MySQL, consulte a Seção 6.9, “Variáveis de Ambiente”.