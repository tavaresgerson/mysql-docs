### 2.5.5 Instalando o MySQL no Linux Usando Pacotes do Oracle para Debian

A Oracle fornece pacotes do Debian para instalar o MySQL em sistemas Linux semelhantes ao Debian. Os pacotes estão disponíveis por meio de dois canais diferentes:

* O Repositório APT do MySQL. Este é o método preferido para instalar o MySQL em sistemas semelhantes ao Debian, pois oferece uma maneira simples e conveniente de instalar e atualizar os produtos MySQL. Para detalhes, consulte a Seção 2.5.2, “Instalando o MySQL no Linux Usando o Repositório APT do MySQL”.
* A Área de Download da Zona de Desenvolvimento do MySQL. Para detalhes, consulte a Seção 2.1.3, “Como Obter o MySQL”. A seguir, estão algumas informações sobre os pacotes do Debian disponíveis lá e as instruções para instalá-los:

  + Vários pacotes do Debian são fornecidos na Zona de Desenvolvimento do MySQL para instalar diferentes componentes do MySQL nas plataformas atuais do Debian e do Ubuntu. O método preferido é usar o pacote em formato tarball, que contém os pacotes necessários para uma configuração básica do MySQL. Os pacotes em tarball têm nomes no formato `mysql-server_MVER-DVER_CPU.deb-bundle.tar`. *`MVER`* é a versão do MySQL e *`DVER`* é a versão da distribuição Linux. O valor *`CPU`* indica o tipo ou família de processador para a qual o pacote foi construído, conforme mostrado na tabela a seguir:

    **Tabela 2.14 Pacotes de Instalação do MySQL Debian e Ubuntu Identificadores de CPU**

    <table><col style="width: 25%"/><col style="width: 75%"/><thead><tr> <th><em><code>CPU</code></em> Value</th> <th>Tipo ou Família de Processador Destinado</th> </tr></thead><tbody><tr> <td><code>i386</code></td> <td>Processador Pentium ou melhor, 32 bits</td> </tr><tr> <td><code>amd64</code></td> <td>Processador x86 de 64 bits</td> </tr></tbody></table>
  + Após baixar o tarball, descompacte-o com o seguinte comando:

    ```
    $> tar -xvf mysql-server_MVER-DVER_CPU.deb-bundle.tar
    ```
  + Você pode precisar instalar a biblioteca `libaio` se ela não estiver presente em seu sistema:

    ```
    $> sudo apt-get install libaio1
    ```
  + Preconfigure o pacote do servidor MySQL com o seguinte comando:

Você é solicitado a fornecer uma senha para o usuário root para sua instalação do MySQL. Você também pode ser perguntado outras perguntas sobre a instalação.

Importante

Certifique-se de lembrar a senha do root que você definiu. Usuários que desejam definir uma senha mais tarde podem deixar o campo de senha em branco na caixa de diálogo e apenas pressionar OK; nesse caso, o acesso do root ao servidor é autenticado usando o Plugin de Autenticação de Credenciais Peer-Credential do MySQL Socket para conexões que usam um arquivo de socket Unix. Você pode definir a senha do root mais tarde usando `mysql_secure_installation`.

+ Para uma instalação básica do servidor MySQL, instale o pacote de arquivos comuns do banco de dados, o pacote cliente, o metapacote cliente, o pacote servidor e o metapacote servidor (naquela ordem); você pode fazer isso com um único comando:

    ```
    $> sudo dpkg-preconfigure mysql-community-server_*.deb
    ```

    Há também pacotes com `server-core` e `client-core` nos nomes dos pacotes. Esses contêm binários apenas e são instalados automaticamente pelos pacotes padrão. Instalar eles por si só não resulta em uma configuração MySQL funcional.

    Se você estiver sendo avisado sobre dependências não atendidas pelo `dpkg` (como libmecab2), você pode corrigi-las usando `apt-get`:

    ```
    $> sudo dpkg -i mysql-{common,community-client-plugins,community-client-core,community-client,client,community-server-core,community-server,server}_*.deb
    ```

    Aqui estão os locais onde os arquivos são instalados no sistema:

    - Todos os arquivos de configuração (como `my.cnf`) estão em `/etc/mysql`
    - Todos os binários, bibliotecas, cabeçalhos, etc., estão em `/usr/bin` e `/usr/sbin`
    - O diretório de dados está em `/var/lib/mysql`

::: info Nota

Distribuições Debian do MySQL também são fornecidas por outros fornecedores. Esteja ciente de que elas podem diferir das construídas pela Oracle em termos de recursos, capacidades e convenções (incluindo configuração de comunicação), e que as instruções neste manual não se aplicam necessariamente à instalação delas. As instruções do fornecedor devem ser consultadas.

:::