#### 19.2.1.2 Instalando o MySQL Shell no Linux

Nota

Pacotes de instalação para o MySQL Shell estão disponíveis apenas para um número limitado de distribuições Linux e somente para sistemas de 64 bits.

Para as distribuições Linux suportadas, a maneira mais fácil de instalar o MySQL Shell no Linux é usar o [MySQL APT repository](https://dev.mysql.com/downloads/repo/apt/) ou o [MySQL Yum repository](https://dev.mysql.com/downloads/repo/yum/). Para sistemas que não usam os MySQL repositories, o MySQL Shell também pode ser baixado e instalado diretamente.

##### Instalando o MySQL Shell com o MySQL APT Repository

Para distribuições Linux suportadas pelo [MySQL APT repository](https://dev.mysql.com/downloads/repo/apt/), siga um dos caminhos abaixo:

* Se você ainda não tem o [MySQL APT repository](https://dev.mysql.com/downloads/repo/apt/) como um software repository em seu sistema, faça o seguinte:

  + Siga os passos fornecidos em Adicionando o MySQL APT Repository, prestando atenção especial ao seguinte:

    - Durante a instalação do pacote de configuração, quando solicitado na caixa de diálogo para configurar o repository, certifique-se de escolher o MySQL 5.7 (que é a opção padrão) como a série de release desejada e habilite o componente MySQL Preview Packages.

    - Certifique-se de não pular a etapa de atualização das informações do pacote para o MySQL APT repository:

      ```sql
      sudo apt-get update
      ```

  + Instale o MySQL Shell com este comando:

    ```sql
    sudo apt-get install mysql-shell
    ```

* Se você já tem o [MySQL APT repository](https://dev.mysql.com/downloads/repo/apt/) como um software repository em seu sistema, faça o seguinte:

  + Atualize as informações do pacote para o MySQL APT repository:

    ```sql
    sudo apt-get update
    ```

  + Atualize o pacote de configuração do MySQL APT repository com o seguinte comando:

    ```sql
    sudo apt-get install mysql-apt-config
    ```

    Quando solicitado na caixa de diálogo para configurar o repository, certifique-se de escolher o MySQL 5.7 (que é a opção padrão) como a série de release desejada e habilite o componente MySQL Preview Packages.

  + Instale o MySQL Shell com este comando:

    ```sql
    sudo apt-get install mysql-shell
    ```

##### Instalando o MySQL Shell com o MySQL Yum Repository

Para distribuições Linux suportadas pelo [MySQL Yum repository](https://dev.mysql.com/downloads/repo/yum/), siga estes passos para instalar o MySQL Shell:

* Faça um dos seguintes:

  + Se você já tem o [MySQL Yum repository](https://dev.mysql.com/downloads/repo/yum/) como um software repository em seu sistema e o repository foi configurado com o novo pacote de release `mysql57-community-release`, pule para o próximo passo (“Habilite o subrepository MySQL Tools Preview...”).

  + Se você já tem o [MySQL Yum repository](https://dev.mysql.com/downloads/repo/yum/) como um software repository em seu sistema, mas o configurou com o pacote de release antigo `mysql-community-release`, é mais fácil instalar o MySQL Shell reconfigurando primeiro o MySQL Yum repository com o novo pacote `mysql57-community-release`. Para fazer isso, você precisa remover seu pacote de release antigo primeiro, com o seguinte comando:

    ```sql
    sudo yum remove mysql-community-release
    ```

    Para sistemas habilitados para dnf, faça o seguinte:

    ```sql
    sudo dnf erase mysql-community-release
    ```

    Em seguida, siga os passos fornecidos em Adicionando o MySQL Yum Repository para instalar o novo pacote de release, `mysql57-community-release`.

  + Se você ainda não tem o [MySQL Yum repository](https://dev.mysql.com/downloads/repo/yum/) como um software repository em seu sistema, siga os passos fornecidos em Adicionando o MySQL Yum Repository.

* Habilite o subrepository MySQL Tools Preview. Você pode fazer isso editando manualmente o arquivo `/etc/yum.repos.d/mysql-community.repo`. Este é um exemplo da entrada padrão do subrepository no arquivo (a entrada `baseurl` em seu arquivo pode parecer diferente, dependendo da sua distribuição Linux):

  ```sql
  [mysql-tools-preview]
  name=MySQL Tools Preview
  baseurl=http://repo.mysql.com/yum/mysql-tools-preview/el/6/$basearch/
  enabled=0
  gpgcheck=1
  gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql
  ```

  Altere a entrada `enabled=0` para `enabled=1` para habilitar o subrepository.

* Instale o MySQL Shell com este comando:

  ```sql
  sudo yum install mysql-shell
  ```

  Para sistemas habilitados para dnf, faça o seguinte:

  ```sql
  sudo dnf install mysql-shell
  ```

##### Instalando o MySQL Shell a partir de Downloads Diretos da MySQL Developer Zone

Pacotes RPM, Debian e source para instalação do MySQL Shell também estão disponíveis para download em [Download MySQL Shell](https://dev.mysql.com/downloads/shell/).
