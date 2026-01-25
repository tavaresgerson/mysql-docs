### 2.5.1 Instalando MySQL no Linux Usando o Repositório Yum do MySQL

O [Repositório Yum do MySQL](https://dev.mysql.com/downloads/repo/yum/) para Oracle Linux, Red Hat Enterprise Linux e CentOS fornece pacotes RPM para instalar o MySQL Server, Client, MySQL Workbench, MySQL Utilities, MySQL Router, MySQL Shell, Connector/ODBC, Connector/Python e assim por diante (nem todos os pacotes estão disponíveis para todas as distribuições; veja Instalando Produtos e Componentes Adicionais do MySQL com Yum para detalhes).

#### Antes de Começar

Como um software popular e de código aberto, o MySQL, em sua forma original ou reempacotada, é amplamente instalado em muitos sistemas a partir de diversas fontes, incluindo diferentes sites de download de software, repositórios de software, e assim por diante. As instruções a seguir pressupõem que o MySQL ainda não esteja instalado no seu sistema usando um pacote RPM distribuído por terceiros; se este não for o caso, siga as instruções fornecidas na Seção 2.10.5, “Atualizando MySQL com o Repositório Yum do MySQL” ou na Seção 2.5.2, “Substituindo uma Distribuição de Terceiros do MySQL Usando o Repositório Yum do MySQL”.

#### Passos para uma Instalação Nova do MySQL

Siga os passos abaixo para instalar a versão GA mais recente do MySQL com o Repositório Yum do MySQL:

1. #### Adicionando o Repositório Yum do MySQL

   Primeiro, adicione o Repositório Yum do MySQL à lista de repositórios do seu sistema. Esta é uma operação única, que pode ser realizada instalando um RPM fornecido pelo MySQL. Siga estes passos:

   1. Acesse a página Download MySQL Yum Repository (<https://dev.mysql.com/downloads/repo/yum/>) na MySQL Developer Zone.

   2. Selecione e baixe o pacote de release para sua plataforma.
   3. Instale o pacote de release baixado com o seguinte comando, substituindo *`platform-and-version-specific-package-name`* pelo nome do pacote RPM baixado:

      ```sql
      $> sudo yum localinstall platform-and-version-specific-package-name.rpm
      ```

      Para um sistema baseado em EL6, o comando tem a forma de:

      ```sql
      $> sudo yum localinstall mysql57-community-release-el6-{version-number}.noarch.rpm
      ```

      Para um sistema baseado em EL7:

      ```sql
      $> sudo yum localinstall mysql57-community-release-el7-{version-number}.noarch.rpm
      ```

      Para um sistema baseado em EL8:

      ```sql
      $> sudo yum localinstall mysql57-community-release-el8-{version-number}.noarch.rpm
      ```

      Para Fedora:

      O MySQL 5.7 não oferece suporte ao Fedora; o suporte foi removido no MySQL 5.7.30. Para detalhes, consulte os [MySQL Product Support EOL Announcements](https://www.mysql.com/support/eol-notice.html).

      O comando de instalação adiciona o Repositório Yum do MySQL à lista de repositórios do seu sistema e baixa a chave GnuPG para verificar a integridade dos pacotes de software. Consulte a Seção 2.1.4.2, “Verificação de Assinatura Usando GnuPG” para detalhes sobre a verificação da chave GnuPG.

      Você pode verificar se o Repositório Yum do MySQL foi adicionado com sucesso através do seguinte comando:

      ```sql
      $> yum repolist enabled | grep "mysql.*-community.*"
      ```

   Note

   Uma vez que o Repositório Yum do MySQL esteja habilitado no seu sistema, qualquer atualização em todo o sistema pelo comando **yum update** fará o upgrade dos pacotes MySQL no seu sistema e substituirá quaisquer pacotes nativos de terceiros, se o Yum encontrar substitutos para eles no Repositório Yum do MySQL; consulte a Seção 2.10.5, “Atualizando MySQL com o Repositório Yum do MySQL” e, para uma discussão sobre alguns possíveis efeitos disso no seu sistema, consulte Upgrading the Shared Client Libraries.

2. #### Selecionando uma Série de Lançamento

   Ao usar o Repositório Yum do MySQL, a série GA mais recente (atualmente MySQL 5.7) é selecionada para instalação por padrão. Se for isso que você deseja, você pode pular para o próximo passo, Instalando MySQL.

   Dentro do Repositório Yum do MySQL, diferentes séries de lançamento do MySQL Community Server estão hospedadas em subrepositórios distintos. O subrepositório para a série GA mais recente (atualmente MySQL 5.7) está habilitado por padrão, e os subrepositórios para todas as outras séries (por exemplo, a série MySQL 5.6) estão desabilitados por padrão. Use este comando para ver todos os subrepositórios no Repositório Yum do MySQL, e ver quais deles estão habilitados ou desabilitados:

   ```sql
   $> yum repolist all | grep mysql
   ```

   Para instalar a release mais recente da última série GA, nenhuma configuração é necessária. Para instalar a release mais recente de uma série específica diferente da última série GA, desabilite o subrepositório para a última série GA e habilite o subrepositório para a série específica antes de executar o comando de instalação. Se a sua plataforma suporta o **yum-config-manager**, você pode fazer isso emitindo estes comandos, que desabilitam o subrepositório para a série 5.7 e habilitam o da série 5.6:

   ```sql
   $> sudo yum-config-manager --disable mysql57-community
   $> sudo yum-config-manager --enable mysql56-community
   ```

   Para plataformas Fedora:

   ```sql
   $> sudo dnf config-manager --disable mysql57-community
   $> sudo dnf config-manager --enable mysql56-community
   ```

   Além de usar **yum-config-manager** ou o comando **dnf config-manager**, você também pode selecionar uma série de lançamento editando manualmente o arquivo `/etc/yum.repos.d/mysql-community.repo`. Esta é uma entrada típica para o subrepositório de uma série de lançamento no arquivo:

   ```sql
   [mysql57-community]
   name=MySQL 5.7 Community Server
   baseurl=http://repo.mysql.com/yum/mysql-5.7-community/el/6/$basearch/
   enabled=1
   gpgcheck=1
   gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql
   ```

   Encontre a entrada para o subrepositório que você deseja configurar e edite a opção `enabled`. Especifique `enabled=0` para desabilitar um subrepositório, ou `enabled=1` para habilitar um subrepositório. Por exemplo, para instalar o MySQL 5.6, certifique-se de ter `enabled=0` para a entrada do subrepositório do MySQL 5.7 mencionada acima, e `enabled=1` para a entrada da série 5.6:

   ```sql
   # Enable to use MySQL 5.6
   [mysql56-community]
   name=MySQL 5.6 Community Server
   baseurl=http://repo.mysql.com/yum/mysql-5.6-community/el/6/$basearch/
   enabled=1
   gpgcheck=1
   gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql
   ```

   Você deve habilitar o subrepositório para apenas uma série de lançamento por vez. Quando subrepositórios para mais de uma série de lançamento estão habilitados, a série mais recente é usada pelo Yum.

   Verifique se os subrepositórios corretos foram habilitados e desabilitados executando o seguinte comando e checando sua saída:

   ```sql
   $> yum repolist enabled | grep mysql
   ```

3. #### Desabilitando o Módulo MySQL Padrão

   (Apenas sistemas EL8) Sistemas baseados em EL8, como RHEL8 e Oracle Linux 8, incluem um módulo MySQL que é habilitado por padrão. A menos que este módulo seja desabilitado, ele mascara pacotes fornecidos pelos repositórios do MySQL. Para desabilitar o módulo incluído e tornar visíveis os pacotes do repositório MySQL, use o seguinte comando (para sistemas habilitados para dnf, substitua **yum** no comando por **dnf**):

   ```sql
   $> sudo yum module disable mysql
   ```

4. #### Instalando MySQL

   Instale o MySQL com o seguinte comando:

   ```sql
   $> sudo yum install mysql-community-server
   ```

   Isto instala o pacote para o MySQL Server (`mysql-community-server`) e também pacotes para os componentes necessários para executar o Server, incluindo pacotes para o Client (`mysql-community-client`), as mensagens de erro e conjuntos de caracteres comuns para Client e Server (`mysql-community-common`), e as bibliotecas Client compartilhadas (`mysql-community-libs`).

5. #### Iniciando o MySQL Server

   Inicie o MySQL Server com o seguinte comando:

   ```sql
   $> sudo service mysqld start
   Starting mysqld:[ OK ]
   ```

   Você pode verificar o status do MySQL Server com o seguinte comando:

   ```sql
   $> sudo service mysqld status
   mysqld (pid 3066) is running.
   ```

Na inicialização inicial do Server, o seguinte ocorre, dado que o data directory do Server está vazio:

* O Server é inicializado.
* O certificado SSL e os arquivos de chave são gerados no data directory.

* `validate_password` é instalado e habilitado.

* Uma conta de superusuário `'root'@'localhost` é criada. Uma senha para o superusuário é definida e armazenada no arquivo de log de erro. Para revelá-la, use o seguinte comando:

  ```sql
  $> sudo grep 'temporary password' /var/log/mysqld.log
  ```

  Altere a senha do root o mais rápido possível, fazendo login com a senha temporária gerada e definindo uma senha personalizada para a conta de superusuário:

  ```sql
  $> mysql -uroot -p
  ```

  ```sql
  mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass4!';
  ```

  Note

  `validate_password` é instalado por padrão. A política de senha padrão implementada por `validate_password` exige que as senhas contenham pelo menos uma letra maiúscula, uma letra minúscula, um dígito e um caractere especial, e que o comprimento total da senha seja de pelo menos 8 caracteres.

Para mais informações sobre os procedimentos de pós-instalação, consulte a Seção 2.9, “Configuração e Teste Pós-instalação”.

Note

*Informações de Compatibilidade para plataformas baseadas em EL7:* Os seguintes pacotes RPM dos repositórios de software nativos das plataformas são incompatíveis com o pacote do Repositório Yum do MySQL que instala o MySQL Server. Depois de instalar o MySQL usando o Repositório Yum do MySQL, você não pode instalar estes pacotes (e vice-versa).

* akonadi-mysql

#### Instalando Produtos e Componentes Adicionais do MySQL com Yum

Você pode usar o Yum para instalar e gerenciar componentes individuais do MySQL. Alguns desses componentes estão hospedados em subrepositórios do Repositório Yum do MySQL: por exemplo, os MySQL Connectors podem ser encontrados no subrepositório MySQL Connectors Community, e o MySQL Workbench no MySQL Tools Community. Você pode usar o seguinte comando para listar os pacotes de todos os componentes MySQL disponíveis para sua plataforma a partir do Repositório Yum do MySQL:

```sql
$> sudo yum --disablerepo=\* --enablerepo='mysql*-community*' list available
```

Instale quaisquer pacotes de sua escolha com o seguinte comando, substituindo *`package-name`* pelo nome do pacote:

```sql
$> sudo yum install package-name
```

Por exemplo, para instalar o MySQL Workbench no Fedora:

```sql
$> sudo dnf install mysql-workbench-community
```

Para instalar as bibliotecas Client compartilhadas:

```sql
$> sudo yum install mysql-community-libs
```

#### Atualizando MySQL com Yum

Além da instalação, você também pode realizar atualizações para produtos e componentes MySQL usando o Repositório Yum do MySQL. Consulte a Seção 2.10.5, “Atualizando MySQL com o Repositório Yum do MySQL” para detalhes.
