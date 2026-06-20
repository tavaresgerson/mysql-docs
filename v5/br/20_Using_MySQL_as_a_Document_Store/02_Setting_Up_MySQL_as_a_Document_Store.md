## 19.2 Configurando o MySQL como um repositório de documentos

Para usar o MySQL 5.7 como uma loja de documentos, o Plugin X precisa ser instalado. Em seguida, você pode usar o Protocolo X para se comunicar com o servidor. Sem o Plugin X rodando, os clientes do Protocolo X não podem se conectar ao servidor. O Plugin X é fornecido com o MySQL (5.7.12 ou superior) — instalá-lo não envolve um download separado. Esta seção descreve como instalar o Plugin X.

Siga os passos descritos aqui:

1. **Instale ou atualize para MySQL 5.7.12 ou superior.**

Quando a instalação ou atualização for realizada, inicie o servidor. Para obter instruções de inicialização do servidor, consulte [Seção 2.9.2, “Iniciando o Servidor”][(starting-server.html "2.9.2 Starting the Server")].

Nota

O Instalador MySQL permite que você realize este e o próximo passo (Instale o Plugin X) ao mesmo tempo para novas instalações no Microsoft Windows. Na tela Plugin e Extensões, marque a caixa de seleção Habilitar Protocolo X/MySQL como uma Armazenamento de Documentos. Após a instalação, verifique se o Plugin X foi instalado.

2. **Instale o Plugin X.** Uma conta não-raiz pode ser usada para instalar o plugin, desde que a conta tenha o privilégio `INSERT` (privileges-provided.html#priv_insert) para a tabela `mysql.plugin`.

Sempre salve suas configurações de configuração existentes antes de reconfigurar o servidor.

Para instalar o plugin X embutido, faça um dos seguintes:

* Usando o [Instalação MySQL para Windows](mysql-installer.html "2.3.3 MySQL Installer para Windows"):

1. Inicie o Instalador do MySQL para Windows. O painel do Instalador do MySQL é aberto.

2. Clique na ação rápida Reconfigurar para o servidor MySQL. Use Próximo e Voltar para configurar os seguintes itens:

+ Em Contas e papéis, confirme a senha da conta atual `root`.

+ Em Plugin e Extensões, marque a caixa de seleção Habilitar X Protocol/MySQL como uma
          Loja de Documentos. O Instalador MySQL fornece um número de porta padrão e abre a porta do firewall para acesso à rede.

+ Em Aplicar configuração do servidor,
clique em Executar.

+ Clique em Concluir para fechar o Instalador MySQL.

3. [Instale o MySQL Shell](instalando-mysql-shell-windows-quick.html "19.2.1.1 Instalando o MySQL Shell no Microsoft Windows").

* Usando o MySQL Shell:

1. [Instale o MySQL Shell](document-store-shell-install.html "19.2.1 Instalando o MySQL Shell").

2. Abra uma janela de terminal (prompt de comando no Windows) e navegue até o local dos binários do MySQL (por exemplo, `/usr/bin/` no Linux).

3. Execute o seguinte comando:

        ```sql
        mysqlsh -u user -h localhost --classic --dba enableXProtocol
        ```

* Usando o programa MySQL Client:

1. Abra uma janela de terminal (prompt de comando no Windows) e navegue até o local dos binários do MySQL (por exemplo, `/usr/bin/` no Linux).

2. Inicie o cliente de string de comando [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"):

        ```sql
        mysql -u user -p
        ```

3. Emitir a seguinte declaração:

        ```sql
        mysql> INSTALL PLUGIN mysqlx SONAME 'mysqlx.so';
        ```

Substitua `mysqlx.so` por `mysqlx.dll` para Windows.

Importante

O usuário `mysql.session` deve existir
antes que você possa carregar o X Plugin.
`mysql.session` foi adicionado na versão 5.7.19 do MySQL. Se seu dicionário de dados foi inicializado usando uma versão anterior, você deve executar o procedimento `mysqld_upgrade`(mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables"). Se a atualização não for executada, o X Plugin não consegue iniciar com o
mensagem de erro: Houve um erro ao tentar acessar o servidor com o usuário: mysql.session@localhost. Certifique-se de que o usuário está presente no servidor e que o mysql_upgrade foi executado após uma atualização do servidor.

4. [Instale o MySQL Shell](document-store-shell-install.html "19.2.1 Instalando o MySQL Shell").

3. **Verifique se o X Plugin foi instalado.**

Quando o Plugin X é instalado corretamente, ele aparece na lista quando você consulta os plugins ativos no servidor com um dos seguintes comandos:

* Comando do MySQL Shell:

     ```sql
     mysqlsh -u user --sqlc -e "show plugins"
     ```

* Comando do programa do cliente MySQL:

     ```sql
     mysql -u user -p -e "show plugins"
     ```

Se você encontrar problemas com a instalação do X Plugin, ou se deseja saber sobre formas alternativas de instalação, configuração ou desinstalação de plugins do servidor, consulte [Seção 5.5.1, “Instalando e Desinstalando Plugins”][(plugin-loading.html "5.5.1 Installing and Uninstalling Plugins")].

### `mysqlxsys@localhost` Conta do Usuário

A instalação do X Plugin cria uma conta de usuário `mysqlxsys@localhost`. Se, por algum motivo, a criação da conta de usuário falhar, a instalação do X Plugin também falhará. Aqui está uma explicação sobre o que a conta de usuário `mysqlxsys@localhost` é e o que fazer quando sua criação falhar.

O processo de instalação do X Plugin utiliza o usuário `root` do MySQL para criar uma conta interna para o usuário `mysqlxsys@localhost`. A conta `mysqlxsys@localhost` é usada pelo X Plugin para autenticação de usuários externos contra o sistema de conta MySQL e para matar sessões quando solicitado por um usuário privilegiado. A conta `mysqlxsys@localhost` é criada como bloqueada, portanto, não pode ser usada para fazer login por usuários externos. Se, por algum motivo, a conta MySQL `root` não estiver disponível, antes de iniciar a instalação do X Plugin, você deve criar manualmente o usuário `mysqlxsys@localhost` emitindo as seguintes declarações no cliente de string de comando [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"):

```sql
CREATE USER IF NOT EXISTS mysqlxsys@localhost IDENTIFIED WITH
mysql_native_password AS 'password' ACCOUNT LOCK;
GRANT SELECT ON mysql.user TO mysqlxsys@localhost;
GRANT SUPER ON *.* TO mysqlxsys@localhost;
```

### Desinstalando o Plugin X

Se você quiser desinstalar (desativar) o Plugin X, execute a seguinte declaração no cliente de string de comando [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"):

```sql
UNINSTALL PLUGIN mysqlx;
```

Não use o MySQL Shell para emitir a declaração anterior. Ele funciona a partir do MySQL Shell, mas você recebe um erro (código 1130). Além disso, a desinstalação do plugin remove o usuário mysqlxsys.

### 19.2.1 Instalar o MySQL Shell

Esta seção descreve como fazer o download, instalação e início do MySQL Shell, que é uma interface interativa de JavaScript, Python ou SQL que suporta desenvolvimento e administração para o servidor MySQL. O MySQL Shell é um componente que você pode instalar separadamente.

#### Requisitos

O MySQL Shell está disponível no Microsoft Windows, Linux e macOS para plataformas de 64 bits. O MySQL Shell requer que o Plugin embutido esteja ativo. Você pode instalar o plugin do servidor antes ou depois de instalar o MySQL Shell. Para instruções, consulte [Instalando o Plugin X](document-store-setting-up.html#installing-xplugin-linux-quick).

#### 19.2.1.1 Instalar o MySQL Shell no Microsoft Windows

Importante

A versão comunitária do MySQL Shell requer o Visual C++ Redistributable para o Visual Studio 2013 (disponível no [Centro de Download da Microsoft](http://www.microsoft.com/en-us/download/default.aspx)) para funcionar; certifique-se de que ele está instalado no seu sistema Windows antes de instalar o MySQL Shell.

Nota

Atualmente, o MySQL Shell não vem com um instalador MSI. Consulte o procedimento de instalação manual em [Instalando binários do MySQL Shell][(installing-mysql-shell-windows-quick.html#installing-mysql-shell-binaries "Installing MySQL Shell Binaries")].

Para instalar o MySQL Shell no Microsoft Windows usando o instalador MSI, faça o seguinte:

1. Baixe o pacote **Windows (x86, 64 bits),
   MSI Installer** a partir de
   <http://dev.mysql.com/downloads/shell/>.

2. Quando solicitado, clique em Executar. 3. Siga os passos do Assistente de Configuração.

**Figura 19.1 Instalação do MySQL Shell no Windows**

   ![Installation of MySQL Shell on Windows](images/x-installation-mysql-shell-win.png)

Se você instalou o MySQL sem habilitar o Plugin X, então,
mais tarde, decidir que deseja instalar o Plugin X, ou se você está
instalando o MySQL * sem * usar o Instalador MySQL, veja
[Instalando o Plugin X](document-store-setting-up.html#installing-xplugin-linux-quick).

##### Instalar binários do MySQL Shell

Para instalar os binários do MySQL Shell:

1. Descompacte o conteúdo do arquivo Zip para o diretório dos produtos do MySQL, por exemplo, `C:\Program
   Files\MySQL\`.

2. Para poder iniciar o MySQL Shell a partir de um prompt de comando, adicione o diretório bin `C:\Program
   Files\MySQL\mysql-shell-1.0.8-rc-windows-x86-64bit\bin` à variável de sistema `PATH`.

#### 19.2.1.2 Instalar o MySQL Shell no Linux

Nota

Os pacotes de instalação para o MySQL Shell estão disponíveis apenas para um número limitado de distribuições Linux e apenas para sistemas de 64 bits.

Para as distribuições Linux suportadas, a maneira mais fácil de instalar o MySQL Shell no Linux é usar o [repositório MySQL APT](https://dev.mysql.com/downloads/repo/apt/) ou o [repositório MySQL Yum](https://dev.mysql.com/downloads/repo/yum/). Para sistemas que não utilizam os repositórios MySQL, o MySQL Shell também pode ser baixado e instalado diretamente.

##### Instalar o MySQL Shell com o Repositório MySQL APT

Para as distribuições Linux suportadas pelo repositório [MySQL APT](https://dev.mysql.com/downloads/repo/apt/), siga um dos caminhos abaixo:

* Se você ainda não tem o
[repositório MySQL APT](https://dev.mysql.com/downloads/repo/apt/) como um repositório de software em seu sistema, faça o seguinte:

+ Siga os passos fornecidos em
    [Adicionar o repositório MySQL APT](/doc/mysql-apt-repo-quick-guide/pt/#apt-repo-setup), prestando atenção especial ao seguinte:

- Durante a instalação do pacote de configuração, quando solicitado na caixa de diálogo para configurar o repositório, certifique-se de escolher MySQL 5.7 (que é a opção padrão) como a série de lançamento que você deseja e habilite o componente MySQL Preview Packages.

- Certifique-se de não pular o passo de atualização das informações do pacote para o repositório MySQL APT:

      ```sql
      sudo apt-get update
      ```

+ Instale o MySQL Shell com este comando:

    ```sql
    sudo apt-get install mysql-shell
    ```

* Se você já tem o
[repositório MySQL APT](https://dev.mysql.com/downloads/repo/apt/) como um repositório de software em seu sistema, faça o seguinte:

+ Atualize as informações do pacote de atualização para o repositório MySQL APT:

    ```sql
    sudo apt-get update
    ```

+ Atualize o pacote de configuração do repositório MySQL APT
com o seguinte comando:

    ```sql
    sudo apt-get install mysql-apt-config
    ```

Quando solicitado na caixa de diálogo para configurar o repositório, certifique-se de escolher MySQL 5.7 (que é a opção padrão) como a série de lançamento que você deseja e habilite o componente MySQL Preview Packages.

+ Instale o MySQL Shell com este comando:

    ```sql
    sudo apt-get install mysql-shell
    ```

##### Instalar o MySQL Shell com o Repositório MySQL Yum

Para as distribuições Linux suportadas pelo
[repositório MySQL Yum](https://dev.mysql.com/downloads/repo/yum/), siga estes passos para instalar o MySQL Shell:

* Faça uma das seguintes ações:

+ Se você já tem o
[repositório MySQL Yum](https://dev.mysql.com/downloads/repo/yum/) como um repositório de software em seu sistema e o repositório foi configurado com o novo pacote de lançamento
`mysql57-community-release`, pule para o próximo passo ("Habilitar a pré-visualização das Ferramentas MySQL...").

+ Se você já tem o
[repositório MySQL Yum](https://dev.mysql.com/downloads/repo/yum/) como um repositório de software em seu sistema, mas configurou o repositório com o pacote de versão antigo
`mysql-community-release`, é mais fácil instalar o MySQL Shell primeiro, reconfigurando o repositório MySQL Yum com o novo
`mysql57-community-release` pacote.
Para fazer isso, você precisa remover seu pacote de versão antigo primeiro, com o seguinte comando:

    ```sql
    sudo yum remove mysql-community-release
    ```

Para sistemas habilitados para dnf, faça o seguinte:

    ```sql
    sudo dnf erase mysql-community-release
    ```

Em seguida, siga os passos fornecidos em
[Adicionar o repositório MySQL Yum](/doc/mysql-yum-repo-quick-guide/pt/#repo-qg-yum-repo-setup) para instalar o novo pacote de lançamento,
`mysql57-community-release`.

+ Se você ainda não tem o
[MySQL Yum
repo](https://dev.mysql.com/downloads/repo/yum/) como um repositório de software em seu sistema, siga os passos fornecidos em
[Adicionar o repositório MySQL Yum](/doc/mysql-yum-repo-quick-guide/pt/#repo-qg-yum-repo-setup).

* Ative o subrepositório de visualização de Ferramentas MySQL. Você pode fazer isso editando manualmente o arquivo `/etc/yum.repos.d/mysql-community.repo`. Este é um exemplo da entrada padrão do subrepositório no arquivo (a entrada `baseurl` no seu arquivo pode parecer diferente, dependendo da sua distribuição Linux):

  ```sql
  [mysql-tools-preview]
  name=MySQL Tools Preview
  baseurl=http://repo.mysql.com/yum/mysql-tools-preview/el/6/$basearch/
  enabled=0
  gpgcheck=1
  gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql
  ```

Altere a entrada `enabled=0` para
`enabled=1` para habilitar a subrepositório.

* Instale o MySQL Shell com este comando:

  ```sql
  sudo yum install mysql-shell
  ```

Para sistemas habilitados para dnf, faça o seguinte:

  ```sql
  sudo dnf install mysql-shell
  ```

##### Instalar o MySQL Shell a partir de downloads diretos da MySQL Developer Zone

RPM, Debian e pacotes de fonte para instalar o MySQL Shell também estão disponíveis para download em [Baixar MySQL Shell](https://dev.mysql.com/downloads/shell/).

#### 19.2.1.3 Instalar o MySQL Shell no macOS

Para instalar o MySQL Shell no macOS, faça o seguinte:

1. Baixe o pacote a partir de <http://dev.mysql.com/downloads/shell/>.

2. Faça duplo clique no DMG baixado para montá-lo. O Finder será aberto.
3. Faça duplo clique no arquivo `.pkg` mostrado na janela do Finder.

4. Siga os passos do assistente de instalação.

**Figura 19.2 Instalação do MySQL Shell no macOS**

   ![Installation of MySQL Shell on macOS](images/x-installation-mysql-shell-macos-1.png)

5. Quando o instalador terminar, expanda o DMG. (Ele pode ser excluído.)

### 19.2.2 Começando o MySQL Shell

Você precisa de um nome de conta e senha para estabelecer uma sessão usando o MySQL Shell. Substitua *`user`* pelo nome da sua conta.

No mesmo sistema onde a instância do servidor está em execução, abra uma janela de terminal (prompt de comando no Windows) e inicie o MySQL Shell com o seguinte comando:

```sql
mysqlsh --uri user@localhost
```

Você é solicitado a inserir sua senha e, em seguida, isso estabelece uma sessão X.

Para obter instruções para começar a usar o MySQL como um banco de dados, consulte os seguintes guias de início rápido:

* [Guia de Início Rápido: Shell MySQL para JavaScript](/doc/refman/8.0/pt-br/mysql-shell-tutorial-javascript.html)

* [Guia de Início Rápido: Shell MySQL para Python](/doc/refman/8.0/pt-br/mysql-shell-tutorial-python.html)