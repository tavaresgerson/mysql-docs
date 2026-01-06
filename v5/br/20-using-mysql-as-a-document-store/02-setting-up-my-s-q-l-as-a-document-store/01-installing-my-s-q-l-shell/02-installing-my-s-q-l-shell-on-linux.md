#### 19.2.1.2 Instalar o MySQL Shell no Linux

Nota

Os pacotes de instalação do MySQL Shell estão disponíveis apenas para um número limitado de distribuições Linux e apenas para sistemas de 64 bits.

Para as distribuições Linux suportadas, a maneira mais fácil de instalar o MySQL Shell no Linux é usar o [repositório MySQL APT](https://dev.mysql.com/downloads/repo/apt/) ou o [repositório MySQL Yum](https://dev.mysql.com/downloads/repo/yum/). Para sistemas que não utilizam os repositórios MySQL, o MySQL Shell também pode ser baixado e instalado diretamente.

##### Instalando o MySQL Shell com o Repositório MySQL APT

Para as distribuições Linux suportadas pelo [repositório MySQL APT](https://dev.mysql.com/downloads/repo/apt/), siga um dos caminhos abaixo:

- Se você ainda não tem o repositório [MySQL APT](https://dev.mysql.com/downloads/repo/apt/) como um repositório de software no seu sistema, faça o seguinte:

  - Siga os passos descritos em Adicionar o repositório MySQL APT, prestando atenção especial ao seguinte:

    - Durante a instalação do pacote de configuração, quando solicitado na caixa de diálogo para configurar o repositório, certifique-se de escolher MySQL 5.7 (que é a opção padrão) como a série de lançamento desejada e habilite o componente MySQL Preview Packages.

    - Certifique-se de não pular o passo de atualização das informações do pacote para o repositório MySQL APT:

      ```sql
      sudo apt-get update
      ```

  - Instale o MySQL Shell com este comando:

    ```sql
    sudo apt-get install mysql-shell
    ```

- Se você já tiver o repositório [MySQL APT](https://dev.mysql.com/downloads/repo/apt/) como um repositório de software no seu sistema, faça o seguinte:

  - Atualize as informações do pacote de atualização para o repositório MySQL APT:

    ```sql
    sudo apt-get update
    ```

  - Atualize o pacote de configuração do repositório MySQL APT com o seguinte comando:

    ```sql
    sudo apt-get install mysql-apt-config
    ```

    Quando solicitado na caixa de diálogo para configurar o repositório, certifique-se de escolher MySQL 5.7 (que é a opção padrão) como a série de lançamento desejada e habilite o componente MySQL Preview Packages.

  - Instale o MySQL Shell com este comando:

    ```sql
    sudo apt-get install mysql-shell
    ```

##### Instalando o MySQL Shell com o Repositório Yum do MySQL

Para as distribuições Linux suportadas pelo [repositório MySQL Yum](https://dev.mysql.com/downloads/repo/yum/), siga estes passos para instalar o MySQL Shell:

- Faça uma das seguintes ações:

  - Se você já tiver o repositório [MySQL Yum](https://dev.mysql.com/downloads/repo/yum/) como um repositório de software no seu sistema e o repositório foi configurado com o pacote de lançamento novo `mysql57-community-release`, pule para o próximo passo (“Ative o subrepositório de Ferramentas de MySQL Preview\...”).

  - Se você já tem o repositório [MySQL Yum](https://dev.mysql.com/downloads/repo/yum/) como um repositório de software no seu sistema, mas configurou o repositório com o pacote de versão antiga `mysql-community-release`, o mais fácil é instalar o MySQL Shell reconfigurando primeiro o repositório MySQL Yum com o novo pacote `mysql57-community-release`. Para fazer isso, você precisa remover primeiro o pacote de versão antigo, com o seguinte comando:

    ```sql
    sudo yum remove mysql-community-release
    ```

    Para sistemas com dnf habilitados, faça o seguinte:

    ```sql
    sudo dnf erase mysql-community-release
    ```

    Em seguida, siga os passos fornecidos na seção Adicionando o repositório Yum do MySQL para instalar o novo pacote de lançamento, `mysql57-community-release`.

  - Se você ainda não tem o [repositório MySQL Yum](https://dev.mysql.com/downloads/repo/yum/) como um repositório de software no seu sistema, siga os passos descritos em Adicionar o repositório MySQL Yum.

- Ative a subrepositório de visualização de Ferramentas MySQL. Você pode fazer isso editando manualmente o arquivo `/etc/yum.repos.d/mysql-community.repo`. Este é um exemplo da entrada padrão do subrepositório no arquivo (a entrada `baseurl` no seu arquivo pode parecer diferente, dependendo da sua distribuição Linux):

  ```sql
  [mysql-tools-preview]
  name=MySQL Tools Preview
  baseurl=http://repo.mysql.com/yum/mysql-tools-preview/el/6/$basearch/
  enabled=0
  gpgcheck=1
  gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql
  ```

  Altere a entrada `enabled=0` para `enabled=1` para habilitar a subrepositório.

- Instale o MySQL Shell com este comando:

  ```sql
  sudo yum install mysql-shell
  ```

  Para sistemas com dnf habilitados, faça o seguinte:

  ```sql
  sudo dnf install mysql-shell
  ```

##### Instalando o MySQL Shell a partir de Downloads Diretos da Zona de Desenvolvimento do MySQL

RPM, Debian e pacotes de origem para instalar o MySQL Shell também estão disponíveis para download em [Baixar MySQL Shell](https://dev.mysql.com/downloads/shell/).
