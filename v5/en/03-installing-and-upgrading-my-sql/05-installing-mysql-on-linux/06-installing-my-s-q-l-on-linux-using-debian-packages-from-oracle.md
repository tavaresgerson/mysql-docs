### 2.5.6 Instalando o MySQL no Linux Usando Pacotes Debian da Oracle

A Oracle fornece pacotes Debian para instalar o MySQL em sistemas Linux Debian ou semelhantes ao Debian. Os pacotes estão disponíveis por meio de dois canais diferentes:

* O [MySQL APT Repository](https://dev.mysql.com/downloads/repo/apt/). Este é o método preferido para instalar o MySQL em sistemas semelhantes ao Debian, pois fornece uma maneira simples e conveniente de instalar e atualizar produtos MySQL. Para detalhes, consulte a Seção 2.5.3, “Instalando o MySQL no Linux Usando o MySQL APT Repository”.

* A [MySQL Developer Zone's Download Area](https://dev.mysql.com/downloads/). Para detalhes, consulte a Seção 2.1.3, “Como Obter o MySQL”. A seguir, algumas informações sobre os pacotes Debian disponíveis lá e as instruções para instalá-los:

  + Vários pacotes Debian são fornecidos na MySQL Developer Zone para instalar diferentes componentes do MySQL em várias plataformas Debian ou Ubuntu. O método preferido é usar o *bundle* tarball, que contém os pacotes necessários para uma configuração básica do MySQL. Os *bundles* tarball possuem nomes no formato `mysql-server_MVER-DVER_CPU.deb-bundle.tar`. *`MVER`* é a versão do MySQL e *`DVER`* é a versão da distribuição Linux. O valor *`CPU`* indica o tipo ou família de processador para o qual o pacote foi construído, conforme mostrado na tabela a seguir:

    **Tabela 2.13 Identificadores de CPU de Pacotes de Instalação MySQL Debian e Ubuntu**

    <table><thead><tr> <th><em><code>CPU</code></em> Valor</th> <th>Tipo ou Família de Processador Pretendida</th> </tr></thead><tbody><tr> <td><code>i386</code></td> <td>Processador Pentium ou superior, 32 bit</td> </tr><tr> <td><code>amd64</code></td> <td>Processador x86 de 64 bit</td> </tr></tbody></table>

  + Após baixar o tarball, desempacote-o com o seguinte comando:

    ```sql
    $> tar -xvf mysql-server_MVER-DVER_CPU.deb-bundle.tar
    ```

  + Você pode precisar instalar a biblioteca `libaio` se ela ainda não estiver presente em seu sistema:

    ```sql
    $> sudo apt-get install libaio1
    ```

  + Pré-configure o pacote do MySQL server com o seguinte comando:

    ```sql
    $> sudo dpkg-preconfigure mysql-community-server_*.deb
    ```

    Será solicitado que você forneça uma senha para o usuário root de sua instalação MySQL. Outras perguntas relativas à instalação também podem ser feitas.

    **Importante**

    Certifique-se de memorizar a senha de root que você definiu. Usuários que desejam definir uma senha mais tarde podem deixar o campo de senha em branco na caixa de diálogo e apenas pressionar OK; nesse caso, o acesso de root ao server é autenticado usando o MySQL Socket Peer-Credential Authentication Plugin para conexões que utilizam um arquivo Unix socket. Você pode definir a senha de root mais tarde usando **mysql_secure_installation**.

  + Para uma instalação básica do MySQL server, instale o pacote de arquivos comuns do Database, o pacote client, o metapacote client, o pacote server e o metapacote server (nessa ordem); você pode fazer isso com um único comando:

    ```sql
    $> sudo dpkg -i mysql-{common,community-client,client,community-server,server}_*.deb
    ```

    Se você for avisado sobre dependências não resolvidas pelo **dpkg**, você pode corrigi-las usando o **apt-get**:

    ```sql
    sudo apt-get -f install
    ```

    Veja onde os arquivos são instalados no sistema:

    - Todos os arquivos de configuração (como `my.cnf`) estão em `/etc/mysql`

    - Todos os binários, libraries, headers, etc., estão em `/usr/bin` e `/usr/sbin`

    - O diretório de dados é `/var/lib/mysql`

**Nota**

Distribuições Debian do MySQL também são fornecidas por outros fornecedores. Esteja ciente de que elas podem diferir daquelas construídas pela Oracle em recursos, capacidades e convenções (incluindo configuração de comunicação), e que as instruções neste manual não se aplicam necessariamente à instalação delas. As instruções do fornecedor devem ser consultadas.