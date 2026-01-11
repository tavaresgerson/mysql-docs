## 4.1 Visão geral dos programas do MySQL

Há muitos programas diferentes em uma instalação do MySQL. Esta seção fornece uma breve visão geral deles. Seções posteriores fornecem uma descrição mais detalhada de cada um, com exceção dos programas do NDB Cluster. A descrição de cada programa indica sua sintaxe de invocação e as opções que ele suporta. A seção 21.5, “Programas do NDB Cluster”, descreve programas específicos para o NDB Cluster.

A maioria das distribuições do MySQL inclui todos esses programas, exceto aqueles que são específicos da plataforma. (Por exemplo, os scripts de inicialização do servidor não são usados no Windows.) A exceção é que as distribuições RPM são mais especializadas. Há um RPM para o servidor, outro para programas de cliente, e assim por diante. Se você parece estar faltando um ou mais programas, consulte o Capítulo 2, *Instalando e Atualizando o MySQL*, para obter informações sobre os tipos de distribuições e o que elas contêm. Pode ser que você tenha uma distribuição que não inclui todos os programas e precise instalar um pacote adicional.

Cada programa do MySQL tem muitas opções diferentes. A maioria dos programas oferece uma opção `--help` que você pode usar para obter uma descrição das diferentes opções do programa. Por exemplo, tente **mysql --help**.

Você pode substituir os valores padrão das opções dos programas MySQL especificando opções na linha de comando ou em um arquivo de opções. Consulte a Seção 4.2, “Usando Programas MySQL”, para obter informações gerais sobre como invocar programas e especificar opções de programas.

O servidor MySQL, **mysqld**, é o programa principal que realiza a maior parte do trabalho em uma instalação do MySQL. O servidor é acompanhado por vários scripts relacionados que o ajudam a iniciar e parar o servidor:

- **mysqld**

  O daemon SQL (ou seja, o servidor MySQL). Para usar programas cliente, o **mysqld** deve estar em execução, pois os clientes obtêm acesso às bases de dados conectando-se ao servidor. Veja a Seção 4.3.1, “mysqld — O Servidor MySQL”.

- **mysqld_safe**

  Um script de inicialização do servidor. O **mysqld_safe** tenta iniciar o **mysqld**. Veja a Seção 4.3.2, “mysqld_safe — Script de inicialização do servidor MySQL”.

- **mysql.server**

  Um script de inicialização do servidor. Este script é usado em sistemas que utilizam diretórios de execução no estilo System V, contendo scripts que iniciam serviços do sistema para níveis de execução específicos. Ele invoca o **mysqld_safe** para iniciar o servidor MySQL. Veja a Seção 4.3.3, “mysql.server — Script de inicialização do servidor MySQL”.

- **mysqld_multi**

  Um script de inicialização de servidor que pode iniciar ou parar vários servidores instalados no sistema. Veja a Seção 4.3.4, “mysqld_multi — Gerenciar múltiplos servidores MySQL”.

Vários programas realizam operações de configuração durante a instalação ou atualização do MySQL:

- **comp_err**

  Este programa é usado durante o processo de compilação/instalação do MySQL. Ele compila arquivos de mensagens de erro a partir dos arquivos de origem de erro. Veja a Seção 4.4.1, “comp_err — Compilar arquivo de mensagem de erro do MySQL”.

- **mysql_install_db**

  Este programa inicializa o diretório de dados do MySQL, cria o banco de dados `mysql` e inicializa suas tabelas de concessão com privilégios padrão, e configura o espaço de tabela do sistema `InnoDB`. Ele é geralmente executado apenas uma vez, ao primeiro instalar o MySQL em um sistema. Veja a Seção 4.4.2, “mysql_install_db — Inicializar o Diretório de Dados do MySQL”, e a Seção 2.9, “Configuração e Teste Pós-Instalação”.

- **mysql_plugin**

  Este programa configura os plugins do servidor MySQL. Veja a Seção 4.4.3, “mysql_plugin — Configurar plugins do servidor MySQL”.

- **mysql_secure_installation**

  Este programa permite melhorar a segurança da sua instalação do MySQL. Consulte a Seção 4.4.4, “mysql_secure_installation — Melhorar a Segurança da Instalação do MySQL”.

- **mysql_ssl_rsa_setup**

  Este programa cria os arquivos de certificado SSL e chave, bem como os arquivos de par de chaves RSA necessários para suportar conexões seguras, caso esses arquivos estejam ausentes. Os arquivos criados pelo **mysql_ssl_rsa_setup** podem ser usados para conexões seguras utilizando SSL ou RSA. Consulte a Seção 4.4.5, “mysql_ssl_rsa_setup — Criar arquivos SSL/RSA”.

- **mysql_tzinfo_to_sql**

  Este programa carrega as tabelas de fuso horário no banco de dados `mysql` usando o conteúdo do banco de dados host system zoneinfo (o conjunto de arquivos que descrevem os fusos horários). Veja a Seção 4.4.6, “mysql_tzinfo_to_sql — Carregar as Tabelas de Fuso Horário”.

- **mysql_upgrade**

  Este programa é usado após uma operação de atualização do MySQL. Ele atualiza as tabelas de concessão com quaisquer alterações feitas em versões mais recentes do MySQL e verifica as tabelas quanto a incompatibilidades e as corrige, se necessário. Veja a Seção 4.4.7, “mysql_upgrade — Verificar e Atualizar Tabelas do MySQL”.

Programas de cliente MySQL que se conectam ao servidor MySQL:

- **mysql**

  A ferramenta de linha de comando para inserir instruções SQL interativamente ou executá-las a partir de um arquivo em modo batch. Consulte a Seção 4.5.1, “mysql — O cliente de linha de comando do MySQL”.

- **mysqladmin**

  Um cliente que realiza operações administrativas, como criar ou excluir bancos de dados, recarregar as tabelas de concessão, limpar as tabelas no disco e reabrir os arquivos de log. O **mysqladmin** também pode ser usado para recuperar informações de versão, processo e status do servidor. Veja a Seção 4.5.2, “mysqladmin — Um programa de administração do servidor MySQL”.

- **mysqlcheck**

  Um cliente de manutenção de tabelas que verifica, conserta, analisa e otimiza tabelas. Veja a Seção 4.5.3, “mysqlcheck — Um Programa de Manutenção de Tabelas”.

- **mysqldump**

  Um cliente que salva um banco de dados MySQL em um arquivo como SQL, texto ou XML. Veja a Seção 4.5.4, “mysqldump — Um programa de backup de banco de dados”.

- **mysqlimport**

  Um cliente que importa arquivos de texto em suas tabelas respectivas usando `LOAD DATA`. Veja a Seção 4.5.5, “mysqlimport — Um programa de importação de dados”.

- **mysqlpump**

  Um cliente que salva um banco de dados MySQL em um arquivo como SQL. Veja a Seção 4.5.6, “mysqlpump — Um programa de backup de banco de dados”.

- **mysqlsh**

  O MySQL Shell é um cliente e editor de código avançado para o MySQL Server. Veja o MySQL Shell 8.0. Além das funcionalidades SQL fornecidas, semelhantes às do **mysql**, o MySQL Shell oferece capacidades de script para JavaScript e Python e inclui APIs para trabalhar com o MySQL. O X DevAPI permite que você trabalhe com dados relacionais e de documentos, veja o Capítulo 19, *Usando o MySQL como um Armazenamento de Documentos*. O AdminAPI permite que você trabalhe com o InnoDB Cluster, veja MySQL AdminAPI.

- **mysqlshow**

  Um cliente que exibe informações sobre bancos de dados, tabelas, colunas e índices. Veja a Seção 4.5.7, “mysqlshow — Exibir informações de banco de dados, tabela e coluna”.

- **mysqlslap**

  Um cliente projetado para emular a carga de clientes de um servidor MySQL e relatar o tempo de cada etapa. Funciona como se vários clientes estivessem acessando o servidor. Veja a Seção 4.5.8, “mysqlslap — Um Cliente de Emulação de Carga”.

Programas administrativos e utilitários do MySQL:

- **innochecksum**

  Uma ferramenta de verificação de checksum de arquivo offline do InnoDB. Veja a Seção 4.6.1, “innochecksum — Ferramenta de Verificação de Checksum de Arquivo Offline do InnoDB”.

- **myisam_ftdump**

  Uma ferramenta que exibe informações sobre índices de texto completo em tabelas `MyISAM`. Veja a Seção 4.6.2, “myisam_ftdump — Exibir informações de índice de texto completo”.

- **myisamchk**

  Uma ferramenta para descrever, verificar, otimizar e reparar tabelas `MyISAM`. Veja a Seção 4.6.3, “myisamchk — Ferramenta de Manutenção de Tabelas MyISAM”.

- **myisamlog**

  Uma ferramenta que processa o conteúdo de um arquivo de log `MyISAM`. Veja a Seção 4.6.4, “myisamlog — Exibir o conteúdo do arquivo de log MyISAM”.

- **myisampack**

  Uma ferramenta que comprime as tabelas `MyISAM` para criar tabelas somente de leitura menores. Veja a Seção 4.6.5, “myisampack — Gerar tabelas MyISAM comprimidas e somente de leitura”.

- **mysql_config_editor**

  Uma ferramenta que permite armazenar credenciais de autenticação em um arquivo seguro e criptografado de caminho de login chamado `.mylogin.cnf`. Veja a Seção 4.6.6, “mysql_config_editor — Ferramenta de Configuração do MySQL”.

- **mysqlbinlog**

  Uma ferramenta para ler declarações de um log binário. O log de declarações executadas contidas nos arquivos de log binário pode ser usado para ajudar a recuperar de um travamento. Veja a Seção 4.6.7, “mysqlbinlog — Ferramenta para Processar Arquivos de Log Binário”.

- **mysqldumpslow**

  Uma ferramenta para ler e resumir o conteúdo de um log de consultas lentas. Veja a Seção 4.6.8, “mysqldumpslow — Resumir arquivos de log de consultas lentas”.

Ferramentas de desenvolvimento de programas do MySQL:

- **mysql_config**

  Um script de shell que gera os valores de opção necessários durante a compilação de programas do MySQL. Veja a Seção 4.7.1, “mysql_config — Exibir Opções para Compilação de Clientes”.

- **my_print_defaults**

  Uma ferramenta que mostra quais opções estão presentes nos grupos de opções dos arquivos de opções. Veja a Seção 4.7.2, “my_print_defaults — Exibir opções de arquivos de opções”.

- **resolve_stack_dump**

  Um programa utilitário que resolve um dump de histórico de pilha numérico em símbolos. Veja a Seção 4.7.3, “resolve_stack_dump — Resolva o Dump de Histórico de Pilha Numérico em Símbolos”.

Serviços diversos:

- **lz4_decompress**

  Uma ferramenta que descomprime a saída do **mysqlpump** que foi criada usando compressão LZ4. Veja a Seção 4.8.1, “lz4_decompress — Descomprima a saída do mysqlpump comprimida com LZ4”.

- **perror**

  Uma ferramenta que exibe o significado dos códigos de erro do sistema ou do MySQL. Veja a Seção 4.8.2, “perror — Exibir informações do erro do MySQL”.

- **“replace**

  Um programa utilitário que realiza a substituição de strings no texto de entrada. Veja a Seção 4.8.3, “replace — Um utilitário de substituição de strings”.

- **resolveip**

  Um programa utilitário que resolve um nome de host para um endereço IP ou vice-versa. Veja a Seção 4.8.4, “resolveip — Resolva nome de host para endereço IP ou vice-versa”.

- **zlib_decompress**

  Uma ferramenta que descomprime a saída do **mysqlpump** que foi criada usando a compressão ZLIB. Veja a Seção 4.8.5, “zlib_decompress — Descomprima a saída comprimida do mysqlpump com ZLIB”.

A Oracle Corporation também fornece a ferramenta de interface gráfica MySQL Workbench, que é usada para administrar servidores e bancos de dados MySQL, criar, executar e avaliar consultas, e migrar esquemas e dados de outros sistemas de gerenciamento de banco de dados relacionais para uso com o MySQL.

Os programas clientes do MySQL que se comunicam com o servidor usando a biblioteca cliente/servidor do MySQL utilizam as seguintes variáveis de ambiente.

<table>
   <thead>
      <tr>
         <th>Variável de ambiente</th>
         <th>Significado</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td><code>MYSQL_UNIX_PORT</code></td>
         <td>O arquivo de socket Unix padrão; usado para conexões a <code>localhost</code></td>
      </tr>
      <tr>
         <td><code>MYSQL_TCP_PORT</code></td>
         <td>O número de porta padrão; usado para conexões TCP/IP</td>
      </tr>
      <tr>
         <td><code>MYSQL_PWD</code></td>
         <td>A senha padrão</td>
      </tr>
      <tr>
         <td><code>MYSQL_DEBUG</code></td>
         <td>Opções de rastreamento de debug ao depurar</td>
      </tr>
      <tr>
         <td><code>TMPDIR</code></td>
         <td>O diretório onde as tabelas e arquivos temporários são criados</td>
      </tr>
   </tbody>
</table>

Para uma lista completa das variáveis de ambiente usadas pelos programas do MySQL, consulte a Seção 4.9, “Variáveis de Ambiente”.

O uso de `MYSQL_PWD` é inseguro. Consulte a Seção 6.1.2.1, “Diretrizes para o Usuário Final sobre Segurança de Senhas”.
