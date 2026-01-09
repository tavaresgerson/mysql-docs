### 2.5.1 Instalando o MySQL no Linux Usando o Repositório Yum do MySQL

O [repositório Yum do MySQL](https://dev.mysql.com/downloads/repo/yum/) para o Oracle Linux, Red Hat Enterprise Linux, CentOS e Fedora fornece pacotes RPM para instalar o servidor MySQL, o cliente MySQL, o MySQL Workbench, os MySQL Utilities, o MySQL Router, o MySQL Shell, o Connector/ODBC, o Connector/Python e outros (nem todos os pacotes estão disponíveis para todas as distribuições; consulte Instalar Produtos e Componentes Adicionais do MySQL com o Yum para detalhes).

#### Antes de Começar

Como um software popular de código aberto, o MySQL, na sua forma original ou reembalada, é amplamente instalado em muitos sistemas de várias fontes, incluindo diferentes sites de download de software, repositórios de software e assim por diante. As instruções seguintes assumem que o MySQL não está já instalado no seu sistema usando um pacote RPM distribuído por terceiros; se não for o caso, siga as instruções fornecidas em Substituindo uma Distribuição Terceira Native do MySQL.

Nota

Os nomes dos arquivos de configuração do repositório RPM começam com `mysql84`, que descreve a série MySQL que é habilitada por padrão para instalação. Neste caso, a subrepositório MySQL 8.4 LTS é habilitada por padrão. Ele também contém outras versões de subrepositórios, como MySQL 8.0 e a Série de Inovação do MySQL, que são desabilitadas por padrão. Escolha a série de inovação para instalar o MySQL 9.5.

#### Passos para uma Instalação Nova do MySQL

Siga estes passos para escolher e instalar os produtos MySQL mais recentes:

1. #### Adicionando o Repositório Yum do MySQL

   Adicione o repositório Yum do MySQL à lista de repositórios do seu sistema. Esta é normalmente uma operação única que é realizada instalando o RPM fornecido pelo MySQL. Siga estes passos:

1. Baixe-o a partir da página do Repositório Yum do MySQL (<https://dev.mysql.com/downloads/repo/yum/>) na Zona de Desenvolvimento do MySQL.

2. Selecione e baixe o pacote de lançamento para sua plataforma.

3. Instale o pacote de lançamento baixado. O formato do arquivo do pacote é:

      ```
      mysql84-community-release-{platform}-{version-number}.noarch.rpm
      ```

      * *`mysql84`*: Indica a versão do MySQL que está habilitada por padrão. Neste caso, o MySQL 8.4 está habilitado por padrão, e tanto o MySQL 8.0 quanto a série de inovação do MySQL estão disponíveis, mas desabilitadas por padrão.

      * *`{platform}`*: O código da plataforma, como el7, el8, el9, fc41 ou fc42. O 'el' representa o Enterprise Linux, 'fc' para Fedora, e termina com o número da versão base da plataforma.

      * *`{version-number}`*: A versão da configuração do RPM do repositório do MySQL, pois eles recebem atualizações ocasionais.

Instale o RPM que você baixou para o seu sistema, por exemplo:

```
      $> sudo yum localinstall mysql84-community-release-{platform}-{version-number}.noarch.rpm
      ```

O comando de instalação adiciona o repositório Yum do MySQL à lista de repositórios do seu sistema e baixa a chave GnuPG para verificar a integridade dos pacotes de software. Veja a Seção 2.1.4.2, “Verificação de Assinatura Usando GnuPG” para detalhes sobre a verificação de chave GnuPG.

Você pode verificar se o repositório Yum do MySQL foi adicionado e habilitado com sucesso pelo seguinte comando (para sistemas com dnf habilitado, substitua **yum** no comando por **dnf**):

```
      $> yum repolist enabled | grep mysql.*-community
      ```

Exemplo de saída:

```
      mysql-8.4-lts-community               MySQL 8.4 LTS Community Server
      mysql-tools-8.4-lts-community            MySQL Tools 8.4 LTS Community
      ```

Isso também demonstra que a versão mais recente do MySQL LTS está habilitada por padrão. Os métodos para escolher uma série de lançamento diferente, como a trilha de inovação (que hoje é 9.5) ou uma série anterior (como o MySQL 8.0), são descritos abaixo.

Nota

Uma vez que o repositório MySQL Yum esteja habilitado no seu sistema, qualquer atualização em todo o sistema pelo comando **yum update** (ou **dnf upgrade** para sistemas com dnf habilitado) atualiza os pacotes do MySQL no seu sistema e substitui quaisquer pacotes de terceiros nativos, se o Yum encontrar substitutos para eles no repositório MySQL Yum; consulte a Seção 3.8, “Atualizando o MySQL com o Repositório MySQL Yum”, para uma discussão sobre alguns efeitos possíveis disso no seu sistema, consulte Atualizando as Bibliotecas de Cliente Compartilhadas.

2. #### Selecionando uma Série de Lançamento

   Ao usar o repositório MySQL Yum, a série de correções de bugs mais recente (atualmente MySQL 8.4) é selecionada para instalação por padrão. Se isso é o que você deseja, você pode pular para o próximo passo, Instalando o MySQL.

   Dentro do repositório MySQL Yum, cada série de lançamentos do MySQL Community Server é hospedada em um subrepositório diferente. O subrepositório para a série LTS mais recente (atualmente MySQL 8.4) é habilitado por padrão, e os subrepositórios para todas as outras séries (por exemplo, MySQL 8.0 e a série MySQL Innovation) são desabilitados por padrão. Use este comando para ver todos os subrepositórios relacionados ao MySQL disponíveis (para sistemas com dnf, substitua **yum** no comando por **dnf**):

   ```
   $> yum repolist all | grep mysql
   ```

   Exemplo de saída:

   ```
   mysql-connectors-community                 MySQL Connectors Community   enabled
   mysql-tools-8.4-lts-community               MySQL Tools 8.4 LTS Community        enabled
   mysql-tools-community                      MySQL Tools Community        disabled
   mysql-tools-innovation-community           MySQL Tools Innovation Commu disabled
   mysql-innovation-community                 MySQL Innovation Release Com disabled
   mysql-8.4-lts-community                          MySQL 8.4 Community LTS Server   enabled
   mysql-8.4-lts-community-debuginfo                MySQL 8.4 Community LTS Server - disabled
   mysql-8.4-lts-community-source                   MySQL 8.4 Community LTS Server - disabled
   mysql80-community                        MySQL 8.0 Community Server - disabled
   mysql80-community-debuginfo              MySQL 8.0 Community Server - disabled
   mysql80-community-source                 MySQL 8.0 Community Server - disabled
   ```

   Para instalar o lançamento mais recente de uma série específica diferente da série LTS mais recente, desabilite o subrepositório de correções de bugs para a série LTS mais recente e habilite o subrepositório para a série específica antes de executar o comando de instalação. Se sua plataforma suportar o comando **yum-config-manager** ou **dnf config-manager**, você pode fazer isso emitindo os seguintes comandos para desabilitar o subrepositório para a série 8.4 e habilitar o para a série 8.0:

   ```
   $> sudo yum-config-manager --disable mysql-8.4-lts-community
   $> sudo yum-config-manager --enable  mysql80-community
   ```

   Para plataformas com dnf habilitado:

   ```
   $> sudo dnf config-manager --disable mysql-8.4-lts-community
   $> sudo dnf config-manager --enable mysql80-community
   ```

Em vez de usar os comandos do config-manager, você pode editar manualmente o arquivo `/etc/yum.repos.d/mysql-community.repo`, alternando a opção `enabled`. Por exemplo, uma entrada padrão típica para o EL8:

```
   [mysql-8.4-lts-community]
   name=MySQL 8.4 LTS Community Server
   baseurl=http://repo.mysql.com/yum/mysql-8.4-community/el/8/$basearch/
   enabled=1
   gpgcheck=1
   gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql-2023
   ```

Encontre a entrada para o subrepositório que você deseja configurar e edite a opção `enabled`. Especifique `enabled=0` para desabilitar um subrepositório ou `enabled=1` para habilitar um subrepositório. Por exemplo, para instalar a partir da trilha de inovação do MySQL, certifique-se de que as entradas de subrepositórios do MySQL 8.4 estejam com `enabled=0` e as entradas de inovação estejam com `enabled=1`:

```
   [mysql80-community]
   name=MySQL 8.0 Community Server
   baseurl=http://repo.mysql.com/yum/mysql-8.0-community/el/8/$basearch
   enabled=1
   gpgcheck=1
   gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql-2023
   ```

Você só deve habilitar subrepositórios para uma série de lançamento de cada vez.

Verifique se os subrepositórios corretos foram habilitados e desabilitados executando o seguinte comando e verificando sua saída (para sistemas com dnf habilitado, substitua **yum** no comando por **dnf**):

```
   $> yum repolist enabled | grep mysql
   ```

3. #### Desabilitar o Módulo Padrão do MySQL

   (Apenas sistemas EL8) Sistemas baseados em EL8, como o RHEL8 e o Oracle Linux 8, incluem um módulo MySQL que está habilitado por padrão. A menos que este módulo seja desabilitado, ele mascara pacotes fornecidos pelos repositórios do MySQL. Para desabilitar o módulo incluído e tornar os pacotes do repositório do MySQL visíveis, use o seguinte comando (para sistemas com dnf habilitado, substitua **yum** no comando por **dnf**):

   ```
   $> sudo yum module disable mysql
   ```

4. #### Instalar o MySQL

   Instale o MySQL pelo seguinte comando (para sistemas com dnf habilitado, substitua **yum** no comando por **dnf**):

   ```
   $> sudo yum install mysql-community-server
   ```

Este pacote instala o servidor MySQL (`mysql-community-server`) e também os pacotes necessários para executar o servidor, incluindo pacotes para o cliente (`mysql-community-client`), os conjuntos de mensagens de erro comuns e os conjuntos de caracteres para o cliente e o servidor (`mysql-community-common`) e as bibliotecas de cliente compartilhadas (`mysql-community-libs`).

5. #### Iniciando o Servidor MySQL

Inicie o servidor MySQL com o seguinte comando:

```
   $> systemctl start mysqld
   ```

Você pode verificar o status do servidor MySQL com o seguinte comando:

```
   $> systemctl status mysqld
   ```

Se o sistema operacional estiver habilitado para systemd, os comandos padrão **systemctl** (ou, como alternativa, **service** com os argumentos invertidos) como **stop**, **start**, **status** e **restart** devem ser usados para gerenciar o serviço do servidor MySQL. O serviço `mysqld` está habilitado por padrão e inicia ao reiniciar o sistema. Consulte a Seção 2.5.9, “Gerenciando o Servidor MySQL com systemd” para obter informações adicionais.

No início da inicialização do servidor, o seguinte acontece, dado que o diretório de dados do servidor está vazio:

* O servidor é inicializado.
* Certificados SSL e arquivos de chave são gerados no diretório de dados.

* `validate_password` é instalado e habilitado.

* Uma conta de superusuário `'root'@'localhost'` é criada. Uma senha para o superusuário é definida e armazenada no arquivo de log de erro. Para revelá-la, use o seguinte comando:

  ```
  $> sudo grep 'temporary password' /var/log/mysqld.log
  ```

  Altere a senha do root o mais rápido possível, iniciando sessão com a senha temporária gerada e definindo uma senha personalizada para a conta de superusuário:

  ```
  $> mysql -uroot -p
  ```

  ```
  mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass4!';
  ```

Nota

`validate_password` é instalado por padrão. A política de senha padrão implementada pelo `validate_password` exige que as senhas contenham pelo menos uma letra maiúscula, uma letra minúscula, um dígito e um caractere especial, e que o comprimento total da senha seja de pelo menos 8 caracteres.

Para obter mais informações sobre os procedimentos pós-instalação, consulte a Seção 2.9, “Configuração e Teste Pós-Instalação”.

Nota

*Informações de compatibilidade para plataformas baseadas em EL7:* Os seguintes pacotes RPM dos repositórios de software nativo das plataformas são incompatíveis com o pacote do repositório Yum do MySQL que instala o servidor MySQL. Uma vez que você tenha instalado o MySQL usando o repositório Yum do MySQL, não poderá instalar esses pacotes (e vice-versa).

* akonadi-mysql

#### Instalando Produtos e Componentes Adicionais do MySQL com o Yum

Você pode usar o Yum para instalar e gerenciar componentes individuais do MySQL. Alguns desses componentes estão hospedados em sub-repositórios do repositório Yum do MySQL: por exemplo, os Conectadores MySQL estão disponíveis no sub-repositório MySQL Connectors Community, e o MySQL Workbench no MySQL Tools Community. Você pode usar o seguinte comando para listar os pacotes de todos os componentes MySQL disponíveis para sua plataforma do repositório Yum do MySQL (para sistemas habilitados para dnf, substitua **yum** no comando por **dnf**):

```
$> sudo yum --disablerepo=\* --enablerepo='mysql*-community*' list available
```

Instale os pacotes que desejar com o seguinte comando, substituindo *`package-name`* pelo nome do pacote (para sistemas habilitados para dnf, substitua **yum** no comando por **dnf**):

```
$> sudo yum install package-name
```

Por exemplo, para instalar o MySQL Workbench no Fedora:

```
$> sudo dnf install mysql-workbench-community
```

Para instalar as bibliotecas de cliente compartilhadas (para sistemas habilitados para dnf, substitua **yum** no comando por **dnf**):

```
$> sudo yum install mysql-community-libs
```

#### Notas Específicas para Plataformas

Suporte ARM

O suporte ARM 64-bit (aarch64) é suportado no Oracle Linux 7 e requer o Repositório de Coleções de Software do Oracle Linux 7 (ol7_software_collections). Por exemplo, para instalar o servidor:

```
$> yum-config-manager --enable ol7_software_collections
$> yum install mysql-community-server
```

#### Atualizando o MySQL com o Yum

Além da instalação, você também pode realizar atualizações para os produtos e componentes do MySQL usando o repositório MySQL Yum. Consulte a Seção 3.8, “Atualizando o MySQL com o Repositório MySQL Yum”, para obter detalhes.

#### Substituindo uma Distribuição Terceira Native do MySQL

Se você instalou uma distribuição terceirizada do MySQL de um repositório de software nativo (ou seja, um repositório de software fornecido pela sua própria distribuição Linux), siga estes passos:

1. #### Fazendo Backup do Seu Banco de Dados

Para evitar a perda de dados, sempre faça backup do seu banco de dados antes de tentar substituir sua instalação do MySQL usando o repositório MySQL Yum. Consulte o Capítulo 9, *Backup e Recuperação*, sobre como fazer backup do seu banco de dados.

2. #### Adicionando o Repositório MySQL Yum

Adicione o repositório MySQL Yum à lista de repositórios do seu sistema seguindo as instruções fornecidas em Adicionando o Repositório MySQL Yum.

3. #### Substituindo a Distribuição Terceira Native pelo MySQL com uma Atualização Yum ou uma Atualização DNF

Por design, o repositório MySQL Yum substitui sua MySQL nativa e terceirizada pelo último lançamento de correção de bugs do repositório MySQL Yum quando você executa o comando **yum update** (ou **dnf upgrade** para sistemas com dnf habilitado) no sistema, ou um **yum update mysql-server** (ou **dnf upgrade mysql-server** para sistemas com dnf habilitado).

Após atualizar o MySQL usando o repositório Yum, as aplicações compiladas com versões mais antigas das bibliotecas de cliente compartilhadas devem continuar funcionando. No entanto, *se você quiser recompilar as aplicações e vinculá-las dinamicamente às bibliotecas atualizadas*, consulte Atualizando as Bibliotecas de Cliente Compartilhadas, para algumas considerações especiais.

Nota

*Para plataformas baseadas no EL7:* Consulte as Informações de Compatibilidade para plataformas baseadas no EL7.