## 6.1 Visão Geral dos Programas do MySQL

Existem muitos programas diferentes em uma instalação do MySQL. Esta seção fornece uma breve visão geral deles. Seções posteriores fornecem uma descrição mais detalhada de cada um, com exceção dos programas do NDB Cluster. A descrição de cada programa indica sua sintaxe de invocação e as opções que ele suporta. A seção 25.5, “Programas do NDB Cluster”, descreve programas específicos para o NDB Cluster.

A maioria das distribuições do MySQL inclui todos esses programas, exceto aqueles programas que são específicos da plataforma. (Por exemplo, os scripts de inicialização do servidor não são usados no Windows.) A exceção é que as distribuições RPM são mais especializadas. Há um RPM para o servidor, outro para programas cliente, e assim por diante. Se você parece estar faltando um ou mais programas, consulte o Capítulo 2, *Instalando o MySQL*, para informações sobre os tipos de distribuições e o que elas contêm. Pode ser que você tenha uma distribuição que não inclui todos os programas e precise instalar um pacote adicional.

Cada programa do MySQL aceita muitas opções diferentes. A maioria dos programas fornece uma opção `--help` que você pode usar para obter uma descrição das diferentes opções do programa. Por exemplo, tente  `mysql --help`.

Você pode substituir os valores padrão das opções dos programas do MySQL especificando opções na linha de comando ou em um arquivo de opções. Consulte a Seção 6.2, “Usando Programas do MySQL”, para informações gerais sobre como invocar programas e especificar opções de programas.

O servidor MySQL, `mysqld`, é o programa principal que faz a maior parte do trabalho em uma instalação do MySQL. O servidor é acompanhado por vários scripts relacionados que o auxiliam no início e no término do servidor:

`mysqld`: O daemon de SQL (ou seja, o servidor MySQL). Para usar programas cliente, o `mysqld` deve estar em execução, porque os clientes obtêm acesso às bases de dados conectando-se ao servidor.

`mysqld_safe`: Um script de inicialização do servidor. `mysqld_safe` tenta iniciar o `mysqld`.

`mysql.server`: Um script de inicialização do servidor. Este script é usado em sistemas que utilizam diretórios de execução estilo System V, contendo scripts que iniciam serviços do sistema para níveis de execução específicos. Ele invoca o `mysqld_safe` para iniciar o servidor MySQL.

`mysqld_multi`: Um script de inicialização do servidor que pode iniciar ou parar vários servidores instalados no sistema.

Vários programas realizam operações de configuração durante a instalação ou atualização do MySQL:

`comp_err`: Este programa é usado durante o processo de compilação/instalação do MySQL. Ele compila arquivos de mensagens de erro a partir dos arquivos de origem de erro.

`mysql_secure_installation`: Este programa permite que você melhore a segurança da sua instalação do MySQL. Veja a Seção 6.4.2, “mysql_secure_installation — Improve MySQL Installation Security”.

`mysql_tzinfo_to_sql`: Este programa carrega as tabelas de fuso horário no banco de dados `mysql` usando o conteúdo do banco de dados de zoneinfo do sistema hospedeiro (o conjunto de arquivos que descrevem fusos horários).

Programas clientes do MySQL que se conectam ao servidor MySQL:

`mysql`: A ferramenta de linha de comando para inserir instruções SQL interativamente ou executá-las a partir de um arquivo em modo batch.

`mysqladmin`: Um cliente que realiza operações administrativas, como criar ou excluir bancos de dados, recarregar as tabelas de concessão, esvaziar tabelas para disco e reabrir arquivos de log. O `mysqladmin` também pode ser usado para recuperar informações de versão, processo e status do servidor. Veja a Seção 6.5.2, “mysqladmin — A MySQL Server Administration Program”.

`mysqlcheck`: Um cliente de manutenção de tabelas que verifica, conserta, analisa e otimiza tabelas. Veja a Seção 6.5.3, “mysqlcheck — A Table Maintenance Program”.

`mysqldump`: Um cliente que salva um banco de dados MySQL em um arquivo como SQL, texto ou XML.

`mysqlimport`: Um cliente que importa arquivos de texto em suas tabelas respectivas usando `LOAD DATA`.

`mysqlsh`: O MySQL Shell é um cliente e editor de código avançado para o MySQL Server. Veja  MySQL Shell 8.4. Além das funcionalidades SQL fornecidas, semelhante ao `mysql`, o MySQL Shell oferece capacidades de script para JavaScript e Python e inclui APIs para trabalhar com o MySQL. O X DevAPI permite que você trabalhe com dados relacionais e de documentos, veja Capítulo 22, *Usando o MySQL como um Armazenamento de Documentos*. O AdminAPI permite que você trabalhe com o InnoDB Cluster, veja MySQL AdminAPI.

`mysqlshow`: Um cliente que exibe informações sobre bancos de dados, tabelas, colunas e índices. Veja  Seção 6.5.6, “`mysqlshow` — Exibir Informações de Banco de Dados, Tabela e Coluna”.

`mysqlslap`: Um cliente projetado para emular a carga de clientes para um servidor MySQL e relatar o tempo de cada etapa. Funciona como se vários clientes estivessem acessando o servidor. Veja Seção 6.5.7, “`mysqlslap` — Um Cliente de Emulação de Carga”.

Programas administrativos e utilitários do MySQL:

`innochecksum`: Uma ferramenta de verificação de checksum de arquivo offline `InnoDB`. Veja  Seção 6.6.2, “`innochecksum` — Ferramenta de Verificação de Checksum de Arquivo `InnoDB`”.

`myisam_ftdump`: Uma ferramenta que exibe informações sobre índices de texto completo em tabelas `MyISAM`. Veja Seção 6.6.3, “`myisam_ftdump` — Exibir Informações de Índice de Texto Completo”.

`myisamchk`: Uma ferramenta para descrever, verificar, otimizar e reparar tabelas `MyISAM`. Veja Seção 6.6.4, “myisamchk — Ferramenta de Manutenção de Tabelas `MyISAM`”.

`myisamlog`: Uma ferramenta que processa o conteúdo de um arquivo de log `MyISAM`. Veja Seção 6.6.5, “`myisamlog` — Exibir Conteúdo do Arquivo de Log `MyISAM`”.

`myisampack`: Uma ferramenta que comprime tabelas `MyISAM` para produzir tabelas somente leitura menores. Veja Seção 6.6.6, “`myisampack` — Gerar Tabelas `MyISAM` Compridas e Só Leitura”.

`mysql_config_editor`: Uma ferramenta que permite que você armazene credenciais de autenticação em um arquivo de caminho de login seguro e criptografado chamado `.mylogin.cnf`. Veja Seção 6.6.7, “`mysql_config_editor` — Ferramenta de Configuração do MySQL”.

`mysql_migrate_keyring`: Uma ferramenta para migrar chaves entre um componente de chaveiro e outro. Consulte a Seção 6.6.8, “`mysql_migrate_keyring` — Ferramenta de Migração de Chaves de Chaveiro”.

`mysqlbinlog`: Uma ferramenta para ler declarações de um log binário. O log de declarações executadas contidas nos arquivos de log binário pode ser usado para ajudar a recuperar de um travamento. Consulte a Seção 6.6.9, “`mysqlbinlog` — Ferramenta para Processamento de Arquivos de Log Binário”.

`mysqldumpslow`: Uma ferramenta para ler e resumir o conteúdo de um log de consultas lentas. Consulte a Seção 6.6.10, “`mysqldumpslow` — Resumir Arquivos de Log de Consultas Lentas”.

Ferramentas de desenvolvimento de programas do MySQL:

`mysql_config`: Um script de shell que produz os valores de opção necessários ao compilar programas MySQL. Consulte a Seção 6.7.1, “`mysql_config` — Exibir Opções para Compilação de Clientes”.

`my_print_defaults`: Uma ferramenta que mostra quais opções estão presentes em grupos de opções de arquivos de opção. Consulte a Seção 6.7.2, “`my_print_defaults` — Exibir Opções de Arquivos de Opção”.

Ferramentas diversas:

`perror`: Uma ferramenta que exibe o significado dos códigos de erro do sistema ou do MySQL. Consulte a Seção 6.8.1, “`perror` — Exibir Informações de Mensagens de Erro do MySQL”.

A Oracle Corporation também fornece a ferramenta de interface gráfica MySQL Workbench, que é usada para administrar servidores e bancos de dados MySQL, para criar, executar e avaliar consultas, e para migrar esquemas e dados de outros sistemas de gerenciamento de banco de dados relacionais para uso com o MySQL.

Os programas de cliente do MySQL que se comunicam com o servidor usando a biblioteca cliente/servidor do MySQL usam as seguintes variáveis de ambiente.

<table><thead><tr> <th>Variável de Ambiente</th> <th>Significado</th> </tr></thead><tbody><tr> <td><code>MYSQL_UNIX_PORT</code></td> <td>O arquivo de socket Unix padrão; usado para conexões com <code>localhost</code></td> </tr><tr> <td><code>MYSQL_TCP_PORT</code></td> <td>O número de porta padrão; usado para conexões TCP/IP</td> </tr><tr> <td><code>MYSQL_DEBUG</code></td> <td>Opções de registro de depuração durante a depuração</td> </tr><tr> <td><code>TMPDIR</code></td> <td>O diretório onde as tabelas e arquivos temporários são criados</td> </tr></tbody></table>

Para uma lista completa das variáveis de ambiente usadas pelos programas MySQL, consulte a Seção 6.9, “Variáveis de Ambiente”.