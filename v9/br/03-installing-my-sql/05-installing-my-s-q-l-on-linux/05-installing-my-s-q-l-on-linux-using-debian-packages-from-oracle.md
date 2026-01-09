### 2.5.5 Instalando o MySQL no Linux Usando Pacotes do Oracle no Debian

O Oracle fornece pacotes do Debian para instalar o MySQL em sistemas Linux semelhantes ao Debian. Os pacotes estão disponíveis por meio de dois canais diferentes:

[Repositório do MySQL APT](https://dev.mysql.com/downloads/repo/apt/). Esse é o método preferido para instalar o MySQL em sistemas semelhantes ao Debian, pois oferece uma maneira simples e conveniente de instalar e atualizar os produtos do MySQL. Para detalhes, consulte a Seção 2.5.2, “Instalando o MySQL no Linux Usando o Repositório do MySQL APT”.

[Área de Download da Zona de Desenvolvimento do MySQL](https://dev.mysql.com/downloads/). Para detalhes, consulte a Seção 2.1.3, “Como Obter o MySQL”. Abaixo estão algumas informações sobre os pacotes do Debian disponíveis lá e as instruções para instalá-los:

  + Vários pacotes do Debian são fornecidos na Zona de Desenvolvimento do MySQL para instalar diferentes componentes do MySQL nas plataformas atuais do Debian e Ubuntu. O método preferido é usar o pacote em formato de tarball, que contém os pacotes necessários para uma configuração básica do MySQL. Os pacotes em formato de tarball têm nomes no formato `mysql-server_MVER-DVER_CPU.deb-bundle.tar`. *`MVER`* é a versão do MySQL e *`DVER`* é a versão da distribuição Linux. O valor *`CPU`* indica o tipo ou família de processador para a qual o pacote foi construído, conforme mostrado na tabela a seguir:

    **Tabela 2.14 Identificadores de Pacotes de Instalação do MySQL Debian e Ubuntu CPU**

<table><thead><tr> <th><em class="replaceable"><code>CPU</code></em> Value</th> <th>Tipo ou Família de Processador Proposto</th> </tr></thead><tbody><tr> <td><code>i386</code></td> <td>Processador Pentium ou superior, 32 bits</td> </tr><tr> <td><code>amd64</code></td> <td>Processador x86 de 64 bits</td> </tr></tbody></table>

  + Após baixar o arquivo tar, descompacte-o com o seguinte comando:

    ```
    $> tar -xvf mysql-server_MVER-DVER_CPU.deb-bundle.tar
    ```

  + Você pode precisar instalar a biblioteca `libaio` se ela não estiver presente no seu sistema:

    ```
    $> sudo apt-get install libaio1
    ```

  + Preconfigure o pacote do servidor MySQL com o seguinte comando:

    ```
    $> sudo dpkg-preconfigure mysql-community-server_*.deb
    ```

    Você será solicitado a fornecer uma senha para o usuário root para a instalação do MySQL. Você também pode ser solicitado outras perguntas sobre a instalação.

  + Importante

    Certifique-se de lembrar a senha do root que você definiu. Usuários que desejam definir uma senha mais tarde podem deixar o campo de senha em branco na caixa de diálogo e apenas pressionar OK; nesse caso, o acesso de root ao servidor é autenticado usando o Plugin de Autenticação de Credenciais Peer do Socket MySQL para conexões que utilizam um arquivo de socket Unix. Você pode definir a senha do root mais tarde usando **mysql_secure_installation**.

  + Para uma instalação básica do servidor MySQL, instale o pacote de arquivos comuns do banco de dados, o pacote cliente, o metapacote cliente, o pacote servidor e o metapacote servidor (naquela ordem); você pode fazer isso com um único comando:

    ```
    $> sudo dpkg -i mysql-{common,community-client-plugins,community-client-core,community-client,client,community-server-core,community-server,server}_*.deb
    ```

    Há também pacotes com `server-core` e `client-core` nos nomes dos pacotes. Esses contêm binários apenas e são instalados automaticamente pelos pacotes padrão. Instalar esses pacotes por si só não resulta em uma configuração MySQL funcional.

Se você estiver sendo avisado sobre dependências não atendidas pelo **dpkg** (como libmecab2), você pode corrigi-las usando o **apt-get**:

```
    sudo apt-get -f install
    ```

Aqui estão os locais onde os arquivos são instalados no sistema:

- Todos os arquivos de configuração (como `my.cnf`) estão em `/etc/mysql`

- Todos os binários, bibliotecas, cabeçalhos, etc., estão em `/usr/bin` e `/usr/sbin`

- O diretório de dados está em `/var/lib/mysql`

Observação

Distribuições Debian do MySQL também são fornecidas por outros fornecedores. Esteja ciente de que elas podem diferir das construídas pela Oracle em termos de recursos, capacidades e convenções (incluindo configuração de comunicação), e que as instruções neste manual não se aplicam necessariamente à instalação delas. As instruções do fornecedor devem ser consultadas.