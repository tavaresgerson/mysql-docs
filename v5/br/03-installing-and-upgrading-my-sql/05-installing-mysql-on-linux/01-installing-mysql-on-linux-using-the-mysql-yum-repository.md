### 2.5.1 Instalar o MySQL no Linux usando o repositório Yum do MySQL

O repositório [MySQL Yum](https://dev.mysql.com/downloads/repo/yum/) para Oracle Linux, Red Hat Enterprise Linux e CentOS fornece pacotes RPM para instalar o servidor MySQL, o cliente MySQL, o MySQL Workbench, o MySQL Utilities, o MySQL Router, o MySQL Shell, o Connector/ODBC, o Connector/Python e outros (nem todos os pacotes estão disponíveis para todas as distribuições; consulte Instalação de Produtos e Componentes Adicionais do MySQL com o Yum para obter detalhes).

#### Antes de começar

Como um software popular de código aberto, o MySQL, na sua forma original ou reembalada, é amplamente instalado em muitos sistemas de várias fontes, incluindo diferentes sites de download de software, repositórios de software, e assim por diante. As instruções seguintes assumem que o MySQL não está já instalado no seu sistema usando um pacote RPM distribuído por terceiros; se não for esse o caso, siga as instruções dadas na Seção 2.10.5, “Atualizando o MySQL com o Repositório Yum do MySQL” ou na Seção 2.5.2, “Substituindo uma Distribuição de Terceiros do MySQL Usando o Repositório Yum do MySQL”.

#### Passos para uma nova instalação do MySQL

Siga os passos abaixo para instalar a versão mais recente do MySQL da GA com o repositório MySQL Yum:

1. #### Adicionar o repositório MySQL Yum

   Primeiro, adicione o repositório MySQL Yum à lista de repositórios do seu sistema. Essa é uma operação única, que pode ser realizada instalando um RPM fornecido pelo MySQL. Siga estes passos:

   1. Acesse a página de Download do Repositório Yum MySQL (<https://dev.mysql.com/downloads/repo/yum/>) na Zona de Desenvolvimento MySQL.

   2. Selecione e baixe o pacote de lançamento para sua plataforma.

   3. Instale o pacote de lançamento baixado com o seguinte comando, substituindo *`platform-and-version-specific-package-name`* pelo nome do pacote RPM baixado:

      ```shell
      $> sudo yum localinstall platform-and-version-specific-package-name.rpm
      ```

      Para um sistema baseado no EL6, o comando é na forma de:

      ```shell
      $> sudo yum localinstall mysql57-community-release-el6-{version-number}.noarch.rpm
      ```

      Para um sistema baseado no EL7:

      ```shell
      $> sudo yum localinstall mysql57-community-release-el7-{version-number}.noarch.rpm
      ```

      Para um sistema baseado no EL8:

      ```shell
      $> sudo yum localinstall mysql57-community-release-el8-{version-number}.noarch.rpm
      ```

      Para Fedora:

      O MySQL 5.7 não suporta o Fedora; o suporte foi removido no MySQL 5.7.30. Para obter detalhes, consulte os anúncios de término de suporte do produto MySQL ([MySQL Product Support EOL Announcements](https://www.mysql.com/support/eol-notice.html)).

      O comando de instalação adiciona o repositório MySQL Yum à lista de repositórios do seu sistema e baixa a chave GnuPG para verificar a integridade dos pacotes de software. Consulte a Seção 2.1.4.2, “Verificação de Assinatura Usando GnuPG”, para obter detalhes sobre a verificação de chaves GnuPG.

      Você pode verificar se o repositório MySQL Yum foi adicionado com sucesso pelo seguinte comando:

      ```shell
      $> yum repolist enabled | grep "mysql.*-community.*"
      ```

   ::: info Nota
   Depois que o repositório MySQL Yum estiver habilitado no seu sistema, qualquer atualização em todo o sistema pelo comando **yum update** atualiza os pacotes do MySQL no seu sistema e substitui quaisquer pacotes de terceiros nativos, se o Yum encontrar substitutos para eles no repositório MySQL Yum; veja a Seção 2.10.5, “Atualizando o MySQL com o Repositório MySQL Yum” e, para uma discussão sobre alguns efeitos possíveis disso no seu sistema, veja Atualizando as Bibliotecas de Cliente Compartilhadas.
   :::

2. #### Selecionando uma Série de Lançamento

   Ao usar o repositório MySQL Yum, a série GA mais recente (atualmente MySQL 5.7) é selecionada para instalação por padrão. Se isso é o que você deseja, você pode pular para o próximo passo, Instalar o MySQL.

   Dentro do repositório MySQL Yum, diferentes séries de lançamento do MySQL Community Server são hospedadas em subrepositórios diferentes. O subrepositório para a última série GA (atualmente MySQL 5.7) é ativado por padrão, e os subrepositórios para todas as outras séries (por exemplo, a série MySQL 5.6) são desativados por padrão. Use este comando para ver todos os subrepositórios no repositório MySQL Yum e ver quais deles estão ativados ou desativados:

   ```bash
   $> yum repolist all | grep mysql
   ```

   Para instalar a versão mais recente da última série GA, não é necessário fazer nenhuma configuração. Para instalar a versão mais recente de uma série específica que não seja a última série GA, desative o subrepositório para a última série GA e ative o subrepositório para a série específica antes de executar o comando de instalação. Se sua plataforma suportar o **yum-config-manager**, você pode fazer isso executando esses comandos, que desativam o subrepositório para a série 5.7 e ativam o de 5.6:

   ```shell
   $> sudo yum-config-manager --disable mysql57-community
   $> sudo yum-config-manager --enable mysql56-community
   ```

   Para plataformas Fedora:

   ```shell
   $> sudo dnf config-manager --disable mysql57-community
   $> sudo dnf config-manager --enable mysql56-community
   ```

   Além de usar o comando **yum-config-manager** ou **dnf config-manager**, você também pode selecionar uma série de lançamento editando manualmente o arquivo `/etc/yum.repos.d/mysql-community.repo`. Esta é uma entrada típica para um subrepositório de uma série de lançamento no arquivo:

   ```
   [mysql57-community]
   name=MySQL 5.7 Community Server
   baseurl=http://repo.mysql.com/yum/mysql-5.7-community/el/6/$basearch/
   enabled=1
   gpgcheck=1
   gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql
   ```

   Encontre a entrada para a subrepositório que você deseja configurar e edite a opção `enabled`. Especifique `enabled=0` para desabilitar um subrepositório ou `enabled=1` para habilitar um subrepositório. Por exemplo, para instalar o MySQL 5.6, certifique-se de que `enabled=0` está especificado para a entrada acima do subrepositório para o MySQL 5.7, e que `enabled=1` está especificado para a entrada da série 5.6:

   ```
   # Enable to use MySQL 5.6
   [mysql56-community]
   name=MySQL 5.6 Community Server
   baseurl=http://repo.mysql.com/yum/mysql-5.6-community/el/6/$basearch/
   enabled=1
   gpgcheck=1
   gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql
   ```

   Você deve habilitar apenas um subrepositório para uma série de lançamentos de cada vez. Quando subrepositórios para mais de uma série de lançamentos são habilitados, a série mais recente é usada pelo Yum.

   Verifique se os subrepositórios corretos foram habilitados e desabilitados executando o seguinte comando e verificando sua saída:

   ```shell
   $> yum repolist enabled | grep mysql
   ```

3. #### Desativando o módulo MySQL padrão

   (Apenas para sistemas EL8) Sistemas baseados em EL8, como RHEL8 e Oracle Linux 8, incluem um módulo MySQL que está habilitado por padrão. A menos que este módulo seja desativado, ele mascara os pacotes fornecidos pelos repositórios do MySQL. Para desabilitar o módulo incluído e tornar os pacotes do repositório do MySQL visíveis, use o seguinte comando (para sistemas habilitados para dnf, substitua **yum** no comando por **dnf**):

   ```shell
   $> sudo yum module disable mysql
   ```

4. #### Instalando o MySQL

   Instale o MySQL pelo seguinte comando:

   ```shell
   $> sudo yum install mysql-community-server
   ```

   Isso instala o pacote para o servidor MySQL (`mysql-community-server`) e também os pacotes para os componentes necessários para executar o servidor, incluindo pacotes para o cliente (`mysql-community-client`), as mensagens de erro comuns e os conjuntos de caracteres para cliente e servidor (`mysql-community-common`) e as bibliotecas de cliente compartilhadas (`mysql-community-libs`).

5. #### Começando o servidor MySQL

   Inicie o servidor MySQL com o seguinte comando:

   ```shell
   $> sudo service mysqld start
   Starting mysqld:[ OK ]
   ```

   Você pode verificar o status do servidor MySQL com o seguinte comando:

   ```shell
   $> sudo service mysqld status
   mysqld (pid 3066) is running.
   ```

Ao inicializar o servidor pela primeira vez, o seguinte acontece, dado que o diretório de dados do servidor está vazio:

- O servidor foi inicializado.
- Os arquivos de certificado e chave SSL são gerados no diretório de dados.
- `validate_password` está instalado e ativado.
- Uma conta de superusuário `'root'@'localhost` é criada. Uma senha para o superusuário é definida e armazenada no arquivo de log de erro. Para revelá-la, use o seguinte comando:

  ```shell
  $> sudo grep 'temporary password' /var/log/mysqld.log
  ```

  Crie uma nova senha de root o mais rápido possível, iniciando sessão com a senha temporária gerada, e defina uma senha personalizada para a conta de superusuário:

  ```shell
  $> mysql -uroot -p
  ```

  ```shell
  mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass4!';
  ```

  ::: info Nota
  `validate_password` está instalado por padrão. A política de senha padrão implementada pelo `validate_password` exige que as senhas contenham pelo menos uma letra maiúscula, uma letra minúscula, um dígito e um caractere especial, e que o comprimento total da senha seja de pelo menos 8 caracteres.
  :::

Para obter mais informações sobre os procedimentos pós-instalação, consulte a Seção 2.9, “Configuração e Teste Pós-Instalação”.

::: info Nota

*Informações de compatibilidade para plataformas baseadas no EL7:* Os seguintes pacotes RPM dos repositórios de software nativo das plataformas são incompatíveis com o pacote do repositório Yum do MySQL que instala o servidor MySQL. Uma vez que você tenha instalado o MySQL usando o repositório Yum do MySQL, não poderá instalar esses pacotes (e vice-versa).

- `akonadi-mysql`
::: 

#### Instalando produtos e componentes adicionais do MySQL com o Yum

Você pode usar o Yum para instalar e gerenciar componentes individuais do MySQL. Alguns desses componentes estão hospedados em sub-repositórios do repositório Yum do MySQL: por exemplo, os Conectores MySQL estão disponíveis no sub-repositório MySQL Connectors Community, e o MySQL Workbench está disponível no MySQL Tools Community. Você pode usar o seguinte comando para listar os pacotes de todos os componentes MySQL disponíveis para sua plataforma a partir do repositório Yum do MySQL:

```shell
$> sudo yum --disablerepo=\* --enablerepo='mysql*-community*' list available
```

Instale quaisquer pacotes de sua escolha com o comando a seguir, substituindo *`package-name`* pelo nome do pacote:

```shell
$> sudo yum install package-name
```

Por exemplo, para instalar o MySQL Workbench no Fedora:

```shell
$> sudo dnf install mysql-workbench-community
```

Para instalar as bibliotecas de cliente compartilhadas:

```shell
$> sudo yum install mysql-community-libs
```

#### Atualizando o MySQL com o Yum

Além da instalação, você também pode realizar atualizações para produtos e componentes do MySQL usando o repositório MySQL Yum. Consulte a Seção 2.10.5, “Atualizando o MySQL com o repositório MySQL Yum”, para obter detalhes.
