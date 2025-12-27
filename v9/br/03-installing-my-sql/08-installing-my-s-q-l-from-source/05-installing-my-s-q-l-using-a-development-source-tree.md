### 2.8.5 Instalando o MySQL usando uma árvore de código-fonte de desenvolvimento

Esta seção descreve como instalar o MySQL a partir do código-fonte de desenvolvimento mais recente, que está hospedado no [GitHub](https://github.com/). Para obter o código-fonte do MySQL Server deste serviço de hospedagem de repositório, você pode configurar um repositório Git local do MySQL.

No [GitHub](https://github.com/), o MySQL Server e outros projetos MySQL são encontrados na página [MySQL](https://github.com/mysql). O projeto MySQL Server é um único repositório que contém ramos para várias séries do MySQL.

* Pré-requisitos para Instalação a partir de Código-fonte de Desenvolvimento
* Configurando um Repositório Git do MySQL

#### Pré-requisitos para Instalação a partir de Código-fonte de Desenvolvimento

Para instalar o MySQL a partir de uma árvore de código-fonte de desenvolvimento, seu sistema deve atender aos requisitos de ferramentas listados na Seção 2.8.2, “Pré-requisitos de Instalação de Código-fonte”.

#### Configurando um Repositório Git do MySQL

Para configurar um repositório Git do MySQL em sua máquina:

1. Faça o clone do repositório Git do MySQL em sua máquina. O comando a seguir faz o clone do repositório Git do MySQL para um diretório chamado `mysql-server`. O download inicial pode levar algum tempo para ser concluído, dependendo da velocidade da sua conexão.

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

2. Quando a operação de clone for concluída, o conteúdo do seu repositório Git local do MySQL aparecerá semelhante ao seguinte:

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

3. Use o comando **git branch -r** para visualizar os ramos de rastreamento remoto para o repositório MySQL.

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

4. Para visualizar o ramo que está sendo verificado no seu repositório local, execute o comando **git branch**. Quando você faz o clone do repositório Git do MySQL, o ramo MySQL mais recente é verificado automaticamente. O asterisco identifica o ramo ativo.

   ```
   ~/mysql-server$ git branch
   * trunk
   ```

5. Para verificar um ramo anterior do MySQL, execute o comando **git checkout**, especificando o nome do ramo. Por exemplo, para verificar o ramo MySQL 8.0:

   ```
   ~/mysql-server$ git checkout 8.0
   Checking out files: 100% (9600/9600), done.
   Branch 8.0 set up to track remote branch 8.0 from origin.
   Switched to a new branch '8.0'
   ```

6. Para obter as alterações feitas após a configuração inicial do repositório Git do MySQL, mude para o ramo que deseja atualizar e execute o comando **git pull**:

   ```
   ~/mysql-server$ git checkout trunk
   ~/mysql-server$ git pull
   ```

   Para examinar o histórico de commits, use o comando **git log**:

   ```
   ~/mysql-server$ git log
   ```

   Você também pode navegar pelo histórico de commits e pelo código-fonte no site do GitHub [MySQL](https://github.com/mysql).

   Se você vir alterações ou código sobre o qual tem alguma dúvida, pergunte no [MySQL Community Slack](https://mysqlcommunity.slack.com/).

7. Após ter clonado o repositório Git do MySQL e verificado o ramo que deseja construir, você pode construir o MySQL Server a partir do código-fonte. As instruções estão fornecidas na Seção 2.8.4, “Instalando o MySQL usando uma distribuição padrão de fonte”, exceto que você pule a parte sobre a obtenção e o desempacotamento da distribuição.

   Tenha cuidado ao instalar uma construção a partir de uma árvore de fonte de distribuição em uma máquina de produção. O comando de instalação pode sobrescrever a instalação da versão de produção. Se você já tiver o MySQL instalado e não quiser sobrescrevê-lo, execute o **CMake** com valores para as opções `CMAKE_INSTALL_PREFIX`, `MYSQL_TCP_PORT` e `MYSQL_UNIX_ADDR` diferentes daquelas usadas pelo seu servidor de produção. Para obter informações adicionais sobre como evitar que múltiplos servidores interfiram uns com os outros, consulte a Seção 7.8, “Executando múltiplas instâncias do MySQL em uma única máquina”.

   Experimente bastante com sua nova instalação. Por exemplo, tente fazer com que novos recursos falhem. Comece executando **make test**. Veja a Suíte de Testes do MySQL.