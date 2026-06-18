### 2.8.5 Instalação do MySQL usando uma árvore de fonte de desenvolvimento

Esta seção descreve como instalar o MySQL a partir do código-fonte de desenvolvimento mais recente, que está hospedado no [GitHub](https://github.com/). Para obter o código-fonte do MySQL Server deste serviço de hospedagem de repositório, você pode configurar um repositório Git local do MySQL.

No [GitHub](https://github.com/), o MySQL Server e outros projetos do MySQL estão disponíveis na página [MySQL](https://github.com/mysql). O projeto MySQL Server é um único repositório que contém ramos para várias séries do MySQL.

- Pré-requisitos para instalação a partir da fonte de desenvolvimento
- Configurando um repositório Git MySQL

#### Pré-requisitos para instalação a partir da fonte de desenvolvimento

Para instalar o MySQL a partir de um repositório de desenvolvimento, o sistema deve atender aos requisitos da ferramenta listados na Seção 2.8.2, “Pré-requisitos para instalação de fontes”.

#### Configurando um repositório Git MySQL

Para configurar um repositório Git MySQL em sua máquina:

1. Clone o repositório Git do MySQL em sua máquina. O comando a seguir cloneia o repositório Git do MySQL em um diretório chamado `mysql-server`. O download inicial pode levar algum tempo para ser concluído, dependendo da velocidade da sua conexão.

   ```bash
   $> git clone https://github.com/mysql/mysql-server.git
   Cloning into 'mysql-server'...
   remote: Counting objects: 1198513, done.
   remote: Total 1198513 (delta 0), reused 0 (delta 0), pack-reused 1198513
   Receiving objects: 100% (1198513/1198513), 1.01 GiB | 7.44 MiB/s, done.
   Resolving deltas: 100% (993200/993200), done.
   Checking connectivity... done.
   Checking out files: 100% (25510/25510), done.
   ```

2. Quando a operação de clone for concluída, o conteúdo do seu repositório local do MySQL Git parecerá semelhante ao seguinte:

   ```bash
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

3. Use o comando **git branch -r** para visualizar os ramos de rastreamento remoto do repositório MySQL.

   ```bash
   ~/mysql-server> git branch -r
     origin/5.7
     origin/8.0
     origin/HEAD -> origin/trunk
     origin/cluster-7.4
     origin/cluster-7.5
     origin/cluster-7.6
     origin/trunk
   ```

4. Para visualizar o ramo que está sendo verificado no seu repositório local, execute o comando **git branch**. Ao clonar o repositório Git do MySQL, o ramo MySQL mais recente é verificado automaticamente. O asterisco identifica o ramo ativo.

   ```bash
   ~/mysql-server$ git branch
   * trunk
   ```

5. Para verificar um ramo anterior do MySQL, execute o comando **git checkout**, especificando o nome do ramo. Por exemplo, para verificar o ramo MySQL 5.7:

   ```bash
   ~/mysql-server$ git checkout 5.7
   Checking out files: 100% (9600/9600), done.
   Branch 5.7 set up to track remote branch 5.7 from origin.
   Switched to a new branch '5.7'
   ```

6. Para obter as alterações feitas após a configuração inicial do repositório Git do MySQL, mude para o ramo que deseja atualizar e execute o comando **git pull**:

   ```bash
   ~/mysql-server$ git checkout 8.0
   ~/mysql-server$ git pull
   ```

   Para examinar a história de commits, use o comando **git log**:

   ```bash
   ~/mysql-server$ git log
   ```

   Você também pode navegar pelo histórico de commits e pelo código-fonte no site do GitHub [MySQL](https://github.com/mysql).

   Se você notar alterações ou código sobre o qual tiver alguma dúvida, pergunte no [MySQL Community Slack](https://mysqlcommunity.slack.com/).

7. Depois de clonar o repositório Git do MySQL e ter verificado o ramo que você deseja construir, você pode construir o MySQL Server a partir do código-fonte. As instruções estão fornecidas na Seção 2.8.4, “Instalando o MySQL Usando uma Distribuição de Código-Fonte Padrão”, exceto que você pule a parte sobre a obtenção e o desempacotamento da distribuição.

   Tenha cuidado ao instalar uma compilação de uma árvore de origem da distribuição em uma máquina de produção. O comando de instalação pode sobrescrever a instalação da versão de produção. Se você já tiver o MySQL instalado e não quiser sobrescrevê-lo, execute o **CMake** com valores para as opções `CMAKE_INSTALL_PREFIX`, `MYSQL_TCP_PORT` e `MYSQL_UNIX_ADDR` diferentes dos usados pelo seu servidor de produção. Para obter informações adicionais sobre como evitar que vários servidores interfiram uns com os outros, consulte a Seção 5.7, “Executando múltiplas instâncias do MySQL em uma única máquina”.

   Jogue bastante com sua nova instalação. Por exemplo, tente fazer com que novos recursos falhem. Comece executando **make test**. Veja a Unidade de Testes do MySQL.
