### 2.5.5 Instalar MySQL no Linux usando Pacotes Debian da Oracle

A Oracle fornece pacotes Debian para a instalação do MySQL em sistemas Debian ou Linux semelhantes ao Debian.

- O Repositório MySQL APT. Este é o método preferido para instalar o MySQL em sistemas semelhantes ao Debian, pois fornece uma maneira simples e conveniente de instalar e atualizar produtos MySQL.
- A Área de Download da MySQL Developer Zone. Para mais detalhes, veja a Seção 2.1.3, "Como Obter o MySQL". A seguir estão algumas informações sobre os pacotes Debian disponíveis lá e as instruções para instalá-los:

  - Vários pacotes Debian são fornecidos na MySQL Developer Zone para instalar diferentes componentes do MySQL nas atuais plataformas Debian e Ubuntu. O método preferido é usar o pacote de tarball, que contém os pacotes necessários para uma configuração básica do MySQL. Os pacotes de tarball têm nomes no formato de `mysql-server_MVER-DVER_CPU.deb-bundle.tar`. \* `MVER` \* é a versão do MySQL e \* `DVER` \* é a versão da distribuição Linux. O valor \* `CPU` \* indica o tipo de processador ou família para a qual o pacote é construído, conforme mostrado na tabela a seguir:

    **Tabela 2.14 Pacotes de Instalação MySQL Debian e Ubuntu Identificadores de CPU**

    <table><col style="width: 25%"/><col style="width: 75%"/><thead><tr> <th><em>[[<code>CPU</code>]]</em>Valor</th> <th>Tipo ou família de processador pretendido</th> </tr></thead><tbody><tr> <td>[[<code>i386</code>]]</td> <td>Processador Pentium ou superior, de 32 bits</td> </tr><tr> <td>[[<code>amd64</code>]]</td> <td>Processador x86 de 64 bits</td> </tr></tbody></table>
  - Depois de descarregar a bola de alcatrão, desembale-a com o seguinte comando:

    ```
    $> tar -xvf mysql-server_MVER-DVER_CPU.deb-bundle.tar
    ```
  - Você pode precisar instalar a biblioteca `libaio` se ela ainda não estiver presente em seu sistema:

    ```
    $> sudo apt-get install libaio1
    ```
  - Preconfigure o pacote do servidor MySQL com o seguinte comando:

    ```
    $> sudo dpkg-preconfigure mysql-community-server_*.deb
    ```

    Você é solicitado a fornecer uma senha para o usuário raiz para a sua instalação do MySQL. Você também pode ser perguntado outras perguntas sobre a instalação.

    Importância

    Certifique-se de que você se lembra da senha raiz que você definiu. Os usuários que desejam definir uma senha mais tarde podem deixar o campo de senha em branco na caixa de diálogo e apenas pressionar OK; nesse caso, o acesso raiz ao servidor é autenticado usando o Plugin de Autenticação Peer-Credential do Socket MySQL para conexões usando um arquivo de socket do Unix. Você pode definir a senha raiz mais tarde usando `mysql_secure_installation`.
  - Para uma instalação básica do servidor MySQL, instale o pacote de arquivos comuns do banco de dados, o pacote do cliente, o metapackage do cliente, o pacote do servidor e o metapackage do servidor (nessa ordem); você pode fazer isso com um único comando:

    ```
    $> sudo dpkg -i mysql-{common,community-client-plugins,community-client-core,community-client,client,community-server-core,community-server,server}_*.deb
    ```

    Há também pacotes com `server-core` e `client-core` nos nomes dos pacotes. Estes contêm apenas binários e são instalados automaticamente pelos pacotes padrão. Instalar-os por si só não resulta em uma configuração de MySQL funcional.

    Se você está sendo avisado de dependências não atendidas por `dpkg` (como libmecab2), você pode corrigi-las usando `apt-get`:

    ```
    sudo apt-get -f install
    ```

    Aqui estão os arquivos instalados no sistema:

    - Todos os arquivos de configuração (como `my.cnf`) estão em `/etc/mysql`
    - Todos os binários, bibliotecas, cabeçalhos, etc., estão sob `/usr/bin` e `/usr/sbin`
    - O diretório de dados está em `/var/lib/mysql`

::: info Note

As distribuições Debian do MySQL também são fornecidas por outros fornecedores. Esteja ciente de que elas podem diferir daquelas construídas pela Oracle em recursos, recursos e convenções (incluindo configuração de comunicação), e que as instruções neste manual não se aplicam necessariamente à instalação delas. As instruções do fornecedor devem ser consultadas em vez disso.

:::
