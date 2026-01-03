### 2.5.6 Instalar o MySQL no Linux usando pacotes do Debian da Oracle

A Oracle fornece pacotes do Debian para instalar o MySQL em sistemas Debian ou semelhantes ao Debian. Os pacotes estão disponíveis por meio de dois canais diferentes:

- O [Repositório MySQL APT](https://dev.mysql.com/downloads/repo/apt/). Este é o método preferido para instalar o MySQL em sistemas semelhantes ao Debian, pois oferece uma maneira simples e conveniente de instalar e atualizar os produtos do MySQL. Para obter detalhes, consulte a Seção 2.5.3, “Instalando o MySQL no Linux Usando o Repositório MySQL APT”.

- A [Área de Download da MySQL Developer Zone](https://dev.mysql.com/downloads/). Para obter detalhes, consulte a Seção 2.1.3, “Como obter o MySQL”. Abaixo estão algumas informações sobre os pacotes do Debian disponíveis lá e as instruções para instalá-los:

  - Vários pacotes do Debian estão disponíveis na MySQL Developer Zone para instalar diferentes componentes do MySQL em diferentes plataformas Debian ou Ubuntu. O método preferido é usar o pacote em formato tarball, que contém os pacotes necessários para uma configuração básica do MySQL. Os pacotes em formato tarball têm nomes no formato `mysql-server_MVER-DVER_CPU.deb-bundle.tar`. *`MVER`* é a versão do MySQL e *`DVER`* é a versão da distribuição Linux. O valor *`CPU`* indica o tipo ou família de processador para a qual o pacote foi construído, conforme mostrado na tabela a seguir:

  **Tabela 2.13 Pacotes de instalação do MySQL Debian e Ubuntu Identificadores de CPU**

  <table>
    <thead>
      <tr>
        <th>[[<code>CPU</code>]]Valor</th>
        <th>Tipo ou família de processador pretendido</th>
      </tr>
    </thead>
    <tbody>
        <tr>
          <td>[[<code>i386</code>]]</td>
          <td>Processador Pentium ou superior, 32 bits</td>
        </tr>
        <tr>
          <td>[[<code>amd64</code>]]</td>
          <td>Processador x86 de 64 bits</td>
        </tr>
    </tbody>
  </table>

  - Após baixar o tarball, descompacte-o com o seguinte comando:

    ```shell
    $> tar -xvf mysql-server_MVER-DVER_CPU.deb-bundle.tar
    ```

  - Você pode precisar instalar a biblioteca `libaio` se ela ainda não estiver presente no seu sistema:

    ```shell
    $> sudo apt-get install libaio1
    ```

  - Preconfigure o pacote do servidor MySQL com o seguinte comando:

    ```shell
    $> sudo dpkg-preconfigure mysql-community-server_*.deb
    ```

    Você será solicitado a fornecer uma senha para o usuário root para sua instalação do MySQL. Você também pode ser solicitado outras perguntas sobre a instalação.

    Importante

    Certifique-se de lembrar a senha de root que você definiu. Usuários que desejam definir uma senha mais tarde podem deixar o campo de senha em branco na caixa de diálogo e apenas pressionar OK; nesse caso, o acesso de root ao servidor é autenticado usando o Plugin de Autenticação de Credenciais Peer-Socket MySQL para conexões que utilizam um arquivo de socket Unix. Você pode definir a senha de root mais tarde usando **mysql_secure_installation**.

  - Para uma instalação básica do servidor MySQL, instale o pacote de arquivos comuns do banco de dados, o pacote do cliente, o metapacote do cliente, o pacote do servidor e o metapacote do servidor (naquela ordem); você pode fazer isso com um único comando:

    ```shell
    $> sudo dpkg -i mysql-{common,community-client,client,community-server,server}_*.deb
    ```

    Se você está sendo avisado sobre dependências não atendidas pelo **dpkg**, você pode corrigi-las usando o **apt-get**:

    ```shell
    sudo apt-get -f install
    ```

    Aqui estão os locais onde os arquivos são instalados no sistema:

    - Todos os arquivos de configuração (como `my.cnf`) estão em `/etc/mysql`
    - Todos os binários, bibliotecas, cabeçalhos, etc., estão em `/usr/bin` e `/usr/sbin`
    - O diretório de dados é `/var/lib/mysql`

::: info Nota
Distribuições do Debian do MySQL também são fornecidas por outros fornecedores. Tenha em mente que elas podem diferir das construídas pela Oracle em termos de recursos, capacidades e convenções (incluindo configuração de comunicação), e que as instruções neste manual não se aplicam necessariamente à instalação delas. As instruções do fornecedor devem ser consultadas em vez disso.
:::
