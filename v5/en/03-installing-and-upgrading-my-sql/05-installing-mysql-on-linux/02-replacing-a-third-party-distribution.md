### 2.5.2 Substituindo uma Distribution de Terceiros do MySQL Usando o MySQL Yum Repository

Para plataformas suportadas baseadas em Yum (consulte a Seção 2.5.1, “Installing MySQL on Linux Using the MySQL Yum Repository”, para uma lista), você pode substituir uma Distribution de terceiros do MySQL pela GA release mais recente (atualmente da série MySQL 5.7) do MySQL Yum Repository. Dependendo de como sua Distribution de terceiros do MySQL foi instalada, há diferentes passos a seguir:

#### Substituindo uma Distribution Nativa de Terceiros do MySQL

Se você instalou uma Distribution de terceiros do MySQL a partir de um software repository nativo (ou seja, um software repository fornecido pela sua própria Distribution Linux), siga estes passos:

1. #### Fazendo Backup do Seu Database

   Para evitar perda de dados, sempre faça Backup do seu Database antes de tentar substituir sua instalação MySQL usando o MySQL Yum Repository. Consulte o Capítulo 7, *Backup and Recovery*, sobre como fazer Backup do seu Database.

2. #### Adicionando o MySQL Yum Repository

   Adicione o MySQL Yum Repository à lista de Repositories do seu sistema seguindo as instruções fornecidas em Adicionando o MySQL Yum Repository.

3. #### Substituindo a Distribution Nativa de Terceiros por um Yum Update ou um DNF Upgrade

   Por design, o MySQL Yum Repository substitui seu MySQL nativo de terceiros pela GA release mais recente (atualmente da série MySQL 5.7) do MySQL Yum Repository quando você executa um comando **yum update** no sistema, ou um **yum update mysql-server**.

Após atualizar o MySQL usando o Yum Repository, as aplicações compiladas com versões mais antigas das shared client libraries devem continuar a funcionar. No entanto, *se você deseja recompilar aplicações e vinculá-las dinamicamente com as libraries atualizadas*, consulte Upgrading the Shared Client Libraries, para algumas considerações especiais.

#### Substituindo uma Distribution Não Nativa de Terceiros do MySQL

Se você instalou uma Distribution de terceiros do MySQL a partir de um software repository não nativo (ou seja, um software repository não fornecido pela sua própria Distribution Linux), siga estes passos:

1. #### Fazendo Backup do Seu Database

   Para evitar perda de dados, sempre faça Backup do seu Database antes de tentar substituir sua instalação MySQL usando o MySQL Yum Repository. Consulte o Capítulo 7, *Backup and Recovery*, sobre como fazer Backup do seu Database.

2. #### Impedindo que o Yum Receba Pacotes MySQL de Repositories Não Nativos de Terceiros

   Antes de poder usar o MySQL Yum Repository para instalar o MySQL, você deve impedir que seu sistema receba pacotes MySQL de quaisquer Yum Repositories não nativos de terceiros.

   Por exemplo, se você instalou o MariaDB usando o seu próprio software repository, obtenha uma lista dos pacotes MariaDB instalados usando o seguinte comando:

   ```sql
   $> yum list installed mariadb\*
   MariaDB-common.i686                      10.0.4-1                       @mariadb
   MariaDB-compat.i686                      10.0.4-1                       @mariadb
   MariaDB-server.i686                      10.0.4-1                       @mariadb
   ```

   Da saída do comando, podemos identificar os pacotes instalados (`MariaDB-common`, `MariaDB-compat` e `MariaDB-server`) e sua origem (um software repository não nativo chamado `mariadb`).

   Como outro exemplo, se você instalou o Percona usando o seu próprio software repository, obtenha uma lista dos pacotes Percona instalados usando o seguinte comando:

   ```sql
   $> yum list installed Percona\*
   Percona-Server-client-55.i686     5.5.39-rel36.0.el6          @percona-release-i386
   Percona-Server-server-55.i686     5.5.39-rel36.0.el6          @percona-release-i386
   Percona-Server-shared-55.i686     5.5.39-rel36.0.el6          @percona-release-i386
   percona-release.noarch            0.1-3                       @/percona-release-0.1-3.noarch
   ```

   Da saída do comando, podemos identificar os pacotes instalados (`Percona-Server-client`, `Percona-Server-server`, `Percona-Server-shared` e `percona-release.noarch`) e sua origem (um software repository não nativo chamado `percona-release`).

   Se você não tiver certeza de qual fork de MySQL de terceiros você instalou, este comando deve revelá-lo e listar os pacotes RPM instalados para ele, bem como o third-party Repository que fornece os pacotes:

   ```sql
   $> yum --disablerepo=\* provides mysql\*
   ```

   O próximo passo é impedir que o Yum receba pacotes do Repository não nativo. Se o utilitário **yum-config-manager** for suportado em sua plataforma, você pode, por exemplo, usar este comando para interromper a entrega do MariaDB:

   ```sql
   $> sudo yum-config-manager --disable mariadb
   ```

   Use este comando para interromper a entrega do Percona:

   ```sql
   $> sudo yum-config-manager --disable percona-release
   ```

   Você pode realizar a mesma tarefa removendo a entrada para o software repository existente em um dos arquivos de Repository sob o diretório `/etc/yum.repos.d/`. É assim que a entrada geralmente se parece para o MariaDB:

   ```sql
   [mariadb] name = MariaDB
    baseurl = [base URL for repository]
    gpgkey = [URL for GPG key]
    gpgcheck =1
   ```

   A entrada é geralmente encontrada no arquivo `/etc/yum.repos.d/MariaDB.repo` para MariaDB — exclua o arquivo, ou remova a entrada dele (ou do arquivo em que você a encontrar).

   Note

   Este passo não é necessário para uma instalação que foi configurada com um pacote de release do Yum Repository (como o Percona), se você for remover o pacote de release (`percona-release.noarch` para Percona), conforme mostrado no comando de desinstalação para Percona no Passo 3 abaixo.

3. #### Desinstalando a Distribution Não Nativa de Terceiros do MySQL

   A Distribution de MySQL não nativa de terceiros deve primeiro ser desinstalada antes que você possa usar o MySQL Yum Repository para instalar o MySQL. Para os pacotes MariaDB encontrados no Passo 2 acima, desinstale-os com o seguinte comando:

   ```sql
   $> sudo yum remove MariaDB-common MariaDB-compat MariaDB-server
   ```

   Para os pacotes Percona que encontramos no Passo 2 acima:

   ```sql
   $> sudo yum remove Percona-Server-client-55 Percona-Server-server-55 \
     Percona-Server-shared-55.i686 percona-release
   ```

4. #### Instalando o MySQL com o MySQL Yum Repository

   Em seguida, instale o MySQL com o MySQL Yum Repository seguindo as instruções fornecidas na Seção 2.5.1, “Installing MySQL on Linux Using the MySQL Yum Repository”: .

   Importante

   Se você optou por substituir sua Distribution de MySQL de terceiros por uma versão mais recente do MySQL do MySQL Yum Repository, lembre-se de executar **mysql_upgrade** após o Server iniciar, para verificar e possivelmente resolver quaisquer incompatibilidades entre os dados antigos e o software atualizado. O **mysql_upgrade** também executa outras funções; consulte a Seção 4.4.7, “mysql_upgrade — Check and Upgrade MySQL Tables” para obter detalhes.

   *Para plataformas baseadas em EL7:* Consulte Compatibility Information for EL7-based platforms.