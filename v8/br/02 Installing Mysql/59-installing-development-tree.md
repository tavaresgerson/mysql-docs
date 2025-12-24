### 2.8.5 Instalar o MySQL usando uma árvore de origem de desenvolvimento

Esta seção descreve como instalar o MySQL a partir do código-fonte de desenvolvimento mais recente, que é hospedado no GitHub. Para obter o código-fonte do MySQL Server a partir deste serviço de hospedagem de repositório, você pode configurar um repositório Git MySQL local.

No GitHub, o MySQL Server e outros projetos MySQL são encontrados na página MySQL. O projeto MySQL Server é um único repositório que contém ramificações para várias séries MySQL.

- Pré-requisitos para instalação a partir de fonte de desenvolvimento
- Configurar um repositório Git do MySQL

#### Pré-requisitos para instalação a partir de fonte de desenvolvimento

Para instalar o MySQL a partir de uma árvore de origem de desenvolvimento, seu sistema deve satisfazer os requisitos de ferramenta listados na Seção 2.8.2, "Precondições de Instalação de Fonte".

#### Configurar um repositório Git do MySQL

Para configurar um repositório MySQL Git na sua máquina:

1. Clonar o repositório MySQL Git para sua máquina. O comando a seguir clona o repositório MySQL Git para um diretório chamado `mysql-server`. O download inicial pode levar algum tempo para ser concluído, dependendo da velocidade de sua conexão.

   ```
   $> git clone https://github.com/mysql/mysql-server.git
   Cloning into 'mysql-server'...
   remote: Counting objects: 1198513, done.
   remote: Total 1198513 (delta 0), reused 0 (delta 0), pack-reused 1198513
   Receiving objects: 100% (1198513/1198513), 1.01 GiB | 7.44 MiB/s, done.
   Resolving deltas: 100% (993200/993200), done.
   Checking connectivity... done.
   Checking out files: 100% (25510/25510), done.
   ```
2. Quando a operação de clonagem é concluída, o conteúdo do seu repositório Git MySQL local aparece semelhante ao seguinte:

   ```
   ~> cd mysql-server
   ~/mysql-server> ls
   client             extra                mysys              storage
   cmake              include              packaging          strings
   CMakeLists.txt     INSTALL              plugin             support-files
   components         libbinlogevents      README             testclients
   config.h.cmake     libchangestreams     router             unittest
   configure.cmake    libmysql             run_doxygen.cmake  utilities
   Docs               libservices          scripts            VERSION
   Doxyfile-ignored   LICENSE              share              vio
   Doxyfile.in        man                  sql                win
   doxygen_resources  mysql-test           sql-common
   ```
3. Use o comando `git branch -r` para ver os ramos de rastreamento remoto para o repositório MySQL.

   ```
   ~/mysql-server> git branch -r
     origin/5.7
     origin/8.0
     origin/HEAD -> origin/trunk
     origin/cluster-7.4
     origin/cluster-7.5
     origin/cluster-7.6
     origin/trunk
   ```
4. Para visualizar o ramo que está desativado em seu repositório local, emita o comando `git branch`. Quando você clona o repositório Git do MySQL, o ramo mais recente do MySQL é desativado automaticamente. O asterisco identifica o ramo ativo.

   ```
   ~/mysql-server$ git branch
   * trunk
   ```
5. Para verificar um ramo anterior do MySQL, execute o comando `git checkout`, especificando o nome do ramo. Por exemplo, para verificar o ramo do MySQL 8.0:

   ```
   ~/mysql-server$ git checkout 8.0
   Checking out files: 100% (9600/9600), done.
   Branch 8.0 set up to track remote branch 8.0 from origin.
   Switched to a new branch '8.0'
   ```
6. Para obter alterações feitas após a configuração inicial do repositório MySQL Git, mude para o ramo que você deseja atualizar e emita o comando `git pull`:

   ```
   ~/mysql-server$ git checkout trunk
   ~/mysql-server$ git pull
   ```

   Para examinar o histórico de commit, use o comando:

   ```
   ~/mysql-server$ git log
   ```

   Você também pode navegar no histórico de commit e no código-fonte no site do GitHub MySQL.

   Se você ver alterações ou código que você tem uma pergunta sobre, pergunte em \[MySQL Community Slack] (<https://mysqlcommunity.slack.com/>).
7. Depois de ter clonado o repositório Git do MySQL e ter verificado o ramo que você deseja construir, você pode construir o MySQL Server a partir do código-fonte. As instruções são fornecidas na Seção 2.8.4, Instalar o MySQL Usando uma Distribuição de Fonte Padrão, exceto que você salta a parte sobre obter e descompactar a distribuição.

   Tenha cuidado ao instalar uma compilação de uma árvore de origem de distribuição em uma máquina de produção. O comando de instalação pode substituir sua instalação de versão ao vivo. Se você já tiver o MySQL instalado e não quiser substituí-lo, execute `CMake` com valores para as opções `CMAKE_INSTALL_PREFIX`, `MYSQL_TCP_PORT`, e `MYSQL_UNIX_ADDR` diferentes daqueles usados pelo seu servidor de produção. Para informações adicionais sobre como evitar que vários servidores interfiram uns com os outros, consulte a Seção 7.8, Running Multiple MySQL Instances on One Machine.

   Jogue duro com sua nova instalação. Por exemplo, tente fazer novas funcionalidades falharem. Comece executando `make test`. Veja The MySQL Test Suite.
