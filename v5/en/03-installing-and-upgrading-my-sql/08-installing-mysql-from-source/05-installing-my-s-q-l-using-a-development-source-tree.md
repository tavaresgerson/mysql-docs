### 2.8.5 Instalando MySQL Usando uma Árvore de Código-Fonte de Desenvolvimento

Esta seção descreve como instalar o MySQL a partir do código-fonte de desenvolvimento mais recente, que está hospedado no [GitHub](https://github.com/). Para obter o código-fonte do MySQL Server a partir deste serviço de hospedagem de repositório, você pode configurar um repositório Git local do MySQL.

No [GitHub](https://github.com/), o MySQL Server e outros projetos MySQL são encontrados na página [MySQL](https://github.com/mysql). O projeto MySQL Server é um único repositório que contém *branches* para diversas séries do MySQL.

* Pré-requisitos para Instalação a partir do Código-Fonte de Desenvolvimento
* Configurando um Repositório Git do MySQL

#### Pré-requisitos para Instalação a partir do Código-Fonte de Desenvolvimento

Para instalar o MySQL a partir de uma árvore de código-fonte de desenvolvimento, seu sistema deve satisfazer os requisitos de ferramentas listados na Seção 2.8.2, “Pré-requisitos de Instalação a Partir do Código-Fonte”.

#### Configurando um Repositório Git do MySQL

Para configurar um repositório Git do MySQL em sua máquina:

1. Clone o repositório Git do MySQL para sua máquina. O comando a seguir clona o repositório Git do MySQL para um diretório chamado `mysql-server`. O *download* inicial pode levar algum tempo para ser concluído, dependendo da velocidade da sua conexão.

   ```sql
   $> git clone https://github.com/mysql/mysql-server.git
   Cloning into 'mysql-server'...
   remote: Counting objects: 1198513, done.
   remote: Total 1198513 (delta 0), reused 0 (delta 0), pack-reused 1198513
   Receiving objects: 100% (1198513/1198513), 1.01 GiB | 7.44 MiB/s, done.
   Resolving deltas: 100% (993200/993200), done.
   Checking connectivity... done.
   Checking out files: 100% (25510/25510), done.
   ```

2. Quando a operação de *clone* for concluída, o conteúdo do seu repositório Git local do MySQL será semelhante ao seguinte:

   ```sql
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

3. Use o comando **git branch -r** para visualizar os *remote tracking branches* (branches de rastreamento remoto) para o repositório MySQL.

   ```sql
   ~/mysql-server> git branch -r
     origin/5.7
     origin/8.0
     origin/HEAD -> origin/trunk
     origin/cluster-7.4
     origin/cluster-7.5
     origin/cluster-7.6
     origin/trunk
   ```

4. Para visualizar o *branch* que está em *checkout* no seu repositório local, execute o comando **git branch**. Ao clonar o repositório Git do MySQL, o *branch* mais recente do MySQL é feito *checkout* automaticamente. O asterisco identifica o *branch* ativo.

   ```sql
   ~/mysql-server$ git branch
   * trunk
   ```

5. Para fazer o *checkout* de um *branch* anterior do MySQL, execute o comando **git checkout**, especificando o nome do *branch*. Por exemplo, para fazer o *checkout* do *branch* MySQL 5.7:

   ```sql
   ~/mysql-server$ git checkout 5.7
   Checking out files: 100% (9600/9600), done.
   Branch 5.7 set up to track remote branch 5.7 from origin.
   Switched to a new branch '5.7'
   ```

6. Para obter alterações feitas após sua configuração inicial do repositório Git do MySQL, mude para o *branch* que você deseja atualizar e execute o comando **git pull**:

   ```sql
   ~/mysql-server$ git checkout 8.0
   ~/mysql-server$ git pull
   ```

   Para examinar o *commit history* (histórico de *commits*), use o comando **git log**:

   ```sql
   ~/mysql-server$ git log
   ```

   Você também pode navegar pelo histórico de *commits* e pelo código-fonte no site [MySQL](https://github.com/mysql) do GitHub.

   Se você vir alterações ou código sobre os quais tenha dúvidas, pergunte no [MySQL Community Slack](https://mysqlcommunity.slack.com/).

7. Depois de clonar o repositório Git do MySQL e ter feito o *checkout* do *branch* que deseja *buildar* (compilar), você pode *buildar* o MySQL Server a partir do código-fonte. As instruções são fornecidas na Seção 2.8.4, “Instalando MySQL Usando uma Distribuição de Código-Fonte Padrão”, exceto pela parte sobre a obtenção e descompactação da distribuição, que deve ser ignorada.

   Tenha cuidado ao instalar um *build* de uma árvore de código-fonte de distribuição em uma máquina de produção. O comando de instalação pode sobrescrever sua instalação de *release* ativa. Se você já tem o MySQL instalado e não deseja sobrescrevê-lo, execute o **CMake** com valores para as opções `CMAKE_INSTALL_PREFIX`, `MYSQL_TCP_PORT` e `MYSQL_UNIX_ADDR` diferentes daqueles usados pelo seu servidor de produção. Para obter informações adicionais sobre como evitar que vários servidores interfiram uns nos outros, consulte a Seção 5.7, “Executando Múltiplas Instâncias MySQL em Uma Máquina”.

   Teste sua nova instalação de forma rigorosa. Por exemplo, tente fazer com que novos recursos *crashem*. Comece executando **make test**. Consulte The MySQL Test Suite.