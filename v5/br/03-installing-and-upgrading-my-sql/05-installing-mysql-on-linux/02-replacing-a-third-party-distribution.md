### 2.5.2 Substituindo uma Distribuição de Terceiros do MySQL Usando o Repositório Yum do MySQL

Para plataformas baseadas no Yum suportadas (consulte a Seção 2.5.1, “Instalando o MySQL no Linux Usando o Repositório Yum do MySQL”, para uma lista), você pode substituir uma distribuição de terceiros do MySQL pela versão GA mais recente (da série MySQL 5.7 atualmente) do repositório Yum do MySQL. De acordo com a maneira como sua distribuição de terceiros do MySQL foi instalada, existem diferentes etapas a seguir:

#### Substituindo uma distribuição de terceiros nativa do MySQL

Se você instalou uma distribuição de MySQL de terceiros a partir de um repositório de software nativo (ou seja, um repositório de software fornecido pela sua própria distribuição Linux), siga estes passos:

1. #### Fazer backup do seu banco de dados

   Para evitar a perda de dados, sempre faça backup do seu banco de dados antes de tentar substituir a instalação do MySQL usando o repositório MySQL Yum. Veja o Capítulo 7, *Backup e Recuperação*, sobre como fazer backup do seu banco de dados.

2. #### Adicionar o repositório MySQL Yum

   Adicione o repositório MySQL Yum à lista de repositórios do seu sistema seguindo as instruções fornecidas em Adicionar o repositório MySQL Yum.

3. #### Substituindo a Distribuição Terceira Native por uma Atualização do Yum ou uma Atualização do DNF

   Por padrão, o repositório MySQL Yum substitui o MySQL nativo de terceiros pelo lançamento GA mais recente (da série MySQL 5.7 atualmente) do repositório MySQL Yum quando você executa o comando **yum update** no sistema ou **yum update mysql-server**.

Após atualizar o MySQL usando o repositório Yum, as aplicações compiladas com versões mais antigas das bibliotecas de cliente compartilhadas devem continuar funcionando. No entanto, *se você quiser recompilar as aplicações e vinculá-las dinamicamente às bibliotecas atualizadas*, consulte Atualizando as Bibliotecas de Cliente Compartilhadas, para algumas considerações especiais.

#### Substituindo uma distribuição de terceiros não nativa do MySQL

Se você instalou uma distribuição de MySQL de terceiros a partir de um repositório de software não nativo (ou seja, um repositório de software não fornecido pela sua própria distribuição Linux), siga estes passos:

1. #### Fazer backup do seu banco de dados

   Para evitar a perda de dados, sempre faça backup do seu banco de dados antes de tentar substituir a instalação do MySQL usando o repositório MySQL Yum. Veja o Capítulo 7, *Backup e Recuperação*, sobre como fazer backup do seu banco de dados.

2. #### Parar o Yum de receber pacotes MySQL de repositórios de terceiros, não nativos

   Antes de poder usar o repositório MySQL Yum para instalar o MySQL, você deve impedir que o sistema receba pacotes MySQL de quaisquer repositórios Yum de terceiros que não sejam nativos.

   Por exemplo, se você instalou o MariaDB usando o próprio repositório de software, obtenha uma lista dos pacotes instalados do MariaDB usando o seguinte comando:

   ```shell
   $> yum list installed mariadb\*
   MariaDB-common.i686                      10.0.4-1                       @mariadb
   MariaDB-compat.i686                      10.0.4-1                       @mariadb
   MariaDB-server.i686                      10.0.4-1                       @mariadb
   ```

   Pelo resultado do comando, podemos identificar os pacotes instalados (`MariaDB-common`, `MariaDB-compat` e `MariaDB-server`) e sua origem (um repositório de software não nativo chamado `mariadb`).

   Como outro exemplo, se você instalou o Percona usando seu próprio repositório de software, obtenha uma lista dos pacotes instalados do Percona usando o seguinte comando:

   ```shell
   $> yum list installed Percona\*
   Percona-Server-client-55.i686     5.5.39-rel36.0.el6          @percona-release-i386
   Percona-Server-server-55.i686     5.5.39-rel36.0.el6          @percona-release-i386
   Percona-Server-shared-55.i686     5.5.39-rel36.0.el6          @percona-release-i386
   percona-release.noarch            0.1-3                       @/percona-release-0.1-3.noarch
   ```

   Pelo resultado do comando, podemos identificar os pacotes instalados (`Percona-Server-client`, `Percona-Server-server`, `Percona-Server-shared` e `percona-release.noarch`) e sua origem (um repositório de software não nativo chamado `percona-release`).

   Se você não tiver certeza de qual fork do MySQL de terceiros está instalado, este comando deve revelá-lo e listar os pacotes RPM instalados para ele, bem como o repositório de terceiros que fornece os pacotes:

   ```sql
   $> yum --disablerepo=\* provides mysql\*
   ```

   O próximo passo é impedir que o Yum receba pacotes do repositório não nativo. Se o utilitário **yum-config-manager** for suportado na sua plataforma, você pode, por exemplo, usar este comando para interromper a entrega da MariaDB:

   ```shell
   $> sudo yum-config-manager --disable mariadb
   ```

   Use este comando para interromper a entrega do Percona:

   ```shell
   $> sudo yum-config-manager --disable percona-release
   ```

   Você pode realizar a mesma tarefa removendo a entrada para o repositório de software existente em um dos arquivos de repositório na pasta `/etc/yum.repos.d/`. É assim que a entrada geralmente parece para o MariaDB:

   ```
   [mariadb] name = MariaDB
    baseurl = [base URL for repository]
    gpgkey = [URL for GPG key]
    gpgcheck =1
   ```

   A entrada geralmente é encontrada no arquivo `/etc/yum.repos.d/MariaDB.repo` para o MariaDB — exclua o arquivo ou remova a entrada dele (ou do arquivo em que você encontrar a entrada).

   ::: info Nota
   Essa etapa não é necessária para uma instalação configurada com um pacote de versão do repositório Yum (como o Percona), se você vai remover o pacote de versão (`percona-release.noarch` para o Percona), conforme mostrado no comando de desinstalação para o Percona no Passo 3 abaixo.
   :::

3. #### Desinstalação da Distribuição de Terceiros Não Nativos do MySQL

   A distribuição de terceiros do MySQL não nativa deve ser desinstalada primeiro antes que você possa usar o repositório MySQL Yum para instalar o MySQL. Para os pacotes do MariaDB encontrados no Passo 2 acima, desinstale-os com o seguinte comando:

   ```shell
   $> sudo yum remove MariaDB-common MariaDB-compat MariaDB-server
   ```

   Para os pacotes Percona que encontramos no Passo 2 acima:

   ```shell
   $> sudo yum remove Percona-Server-client-55 Percona-Server-server-55 \
     Percona-Server-shared-55.i686 percona-release
   ```

4. #### Instalando o MySQL com o Repositório MySQL Yum

   Em seguida, instale o MySQL com o repositório MySQL Yum seguindo as instruções fornecidas na Seção 2.5.1, “Instalando o MySQL no Linux Usando o Repositório MySQL Yum”: .

   Importante

   Se você optou por substituir sua distribuição MySQL de terceiros por uma versão mais recente do MySQL do repositório MySQL Yum, lembre-se de executar o **mysql_upgrade** após o servidor ser iniciado, para verificar e possivelmente resolver quaisquer incompatibilidades entre os dados antigos e o software atualizado. O **mysql_upgrade** também realiza outras funções; consulte a Seção 4.4.7, “mysql_upgrade — Verificar e Atualizar Tabelas MySQL”, para obter detalhes.

   *Para plataformas baseadas no EL7:* Consulte as Informações de Compatibilidade para plataformas baseadas no EL7.
