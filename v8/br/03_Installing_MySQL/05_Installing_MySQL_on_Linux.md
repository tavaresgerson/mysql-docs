## 2.5 Instalando o MySQL no Linux

O Linux suporta várias soluções diferentes para instalar o MySQL. Recomendamos que você use uma das distribuições da Oracle, para as quais vários métodos de instalação estão disponíveis:

**Tabela 2.8 Métodos de instalação do Linux e informações**

<table><col style="width: 30%"/><col style="width: 30%"/><col style="width: 40%"/><thead><tr> <th scope="col">Type</th> <th scope="col">Setup Method</th> <th scope="col">Additional Information</th> </tr></thead><tbody><tr> <th scope="row">Apt</th> <td>Enable the MySQL Apt repository</td> <td>Documentation</td> </tr><tr> <th scope="row">Yum</th> <td>Enable the MySQL Yum repository</td> <td>Documentation</td> </tr><tr> <th scope="row">Zypper</th> <td>Enable the MySQL SLES repository</td> <td>Documentation</td> </tr><tr> <th scope="row">RPM</th> <td>Download a specific package</td> <td>Documentation</td> </tr><tr> <th scope="row">DEB</th> <td>Download a specific package</td> <td>Documentation</td> </tr><tr> <th scope="row">Generic</th> <td>Download a generic package</td> <td>Documentation</td> </tr><tr> <th scope="row">Source</th> <td>Compile from source</td> <td>Documentation</td> </tr><tr> <th scope="row">Docker</th> <td>Utilize o Oracle Container Registry. Você também pode usar o My Oracle Support para a Edição Empresarial do MySQL.</td> <td>Documentação</td> </tr><tr> <th scope="row">Oracle Unbreakable Linux Network</th> <td>Utilize canais ULN</td> <td>Documentação</td> </tr></tbody></table>

Como alternativa, você pode usar o gerenciador de pacotes do seu sistema para baixar e instalar automaticamente o MySQL com pacotes dos repositórios de software nativo da sua distribuição Linux. Esses pacotes nativos geralmente estão várias versões atrás da versão atualmente disponível. Normalmente, você também não pode instalar versões de inovação, pois elas geralmente não estão disponíveis nos repositórios nativos. Para obter mais informações sobre o uso dos instaladores de pacotes nativos, consulte a Seção 2.5.7, “Instalando MySQL no Linux a partir dos Repositórios de Software Nativo”.

Nota

Para muitas instalações do Linux, você deseja configurar o MySQL para ser iniciado automaticamente quando a máquina é inicializada. Muitas das instalações de pacotes nativos realizam essa operação automaticamente, mas para soluções de fonte, binários e RPM, você pode precisar configurá-la separadamente. O script necessário, **mysql.server**, pode ser encontrado no diretório `support-files` sob o diretório de instalação do MySQL ou em uma árvore de fonte do MySQL. Você pode instalá-lo como `/etc/init.d/mysql` para inicialização e desligamento automáticos do MySQL. Veja a Seção 6.3.3, “mysql.server — Script de inicialização do MySQL Server”.

### 2.5.1 Instalar o MySQL no Linux usando o repositório MySQL Yum

O repositório [MySQL Yum][(https://dev.mysql.com/downloads/repo/yum/)] para Oracle Linux, Red Hat Enterprise Linux, CentOS e Fedora fornece pacotes RPM para instalar o servidor MySQL, o cliente MySQL Workbench, MySQL Utilities, MySQL Router, MySQL Shell, Connector/ODBC, Connector/Python e assim por diante (nem todos os pacotes estão disponíveis para todas as distribuições; consulte Instalando Produtos e Componentes Adicionais do MySQL com Yum para obter detalhes).

#### Antes de começar

Como um software popular de código aberto, o MySQL, na sua forma original ou reembalada, é amplamente instalado em muitos sistemas de várias fontes, incluindo diferentes sites de download de software, repositórios de software, etc. As instruções seguintes assumem que o MySQL não está já instalado no seu sistema usando um pacote RPM distribuído por terceiros; se não for esse o caso, siga as instruções dadas na Seção 3.8, “Atualizando o MySQL com o Repositório Yum do MySQL” ou Substituindo uma Distribuição de Terceiros do MySQL Usando o Repositório Yum do MySQL.

Importante

Configuração do repositório Os nomes dos arquivos RPM começam com `mysql-84-lts-community` para destacar o subrepositório MySQL ativo padrão, que é o MySQL 8.4 atualmente. O MySQL 8.0 deve ser habilitado manualmente via configuração do repositório local para instalar o MySQL 8.0 em vez do MySQL 8.4.

#### Passos para uma nova instalação do MySQL

Siga os passos abaixo para instalar a versão mais recente do GA do MySQL com o repositório MySQL Yum:

1. #### Adicionando o repositório MySQL Yum

Primeiro, adicione o repositório MySQL Yum à lista de repositórios do seu sistema. Essa é uma operação única, que pode ser realizada instalando um RPM fornecido pelo MySQL. Siga estes passos:

1. Vá para a página de Download do Repositório Yum de MySQL (<https://dev.mysql.com/downloads/repo/yum/>) na Zona de Desenvolvimento MySQL.

2. Selecione e baixe o pacote de lançamento para sua plataforma.

3. Instale o pacote de lançamento baixado com o seguinte comando, substituindo *`platform-and-version-specific-package-name`* pelo nome do pacote RPM baixado:

      ```
      $> sudo yum install platform-and-version-specific-package-name.rpm
      ```

Para um sistema baseado em EL6, o comando é na forma de (note o prefixo mysql80 em vez de mysql84 porque os sistemas baseados em EL6 não suportam o MySQL 8.4):

      ```
      $> sudo yum install mysql80-community-release-el6-{version-number}.noarch.rpm
      ```

Para um sistema baseado em EL7:

      ```
      $> sudo yum install mysql84-community-release-el7-{version-number}.noarch.rpm
      ```

Para o EL8 ou posterior, altere `el7` para o número da versão do seu Enterprise Linux.

Para Fedora 41 e 42:

      ```
      $> sudo dnf install mysql84-community-release-fcnn-{rpm-version-number}.noarch.rpm
      ```

Substitua *`nn`* pela versão do Fedora e *`{rpm-version-number}`* pelo número da versão do rpm. Por exemplo, para:

      ```
      mysql84-community-release-fc42-1.noarch.rpm
      ```

O comando de instalação adiciona o repositório MySQL Yum à lista de repositórios do seu sistema e baixa a chave GnuPG para verificar a integridade dos pacotes de software. Consulte a Seção 2.1.4.2, “Verificação de assinatura usando GnuPG”, para obter detalhes sobre a verificação da chave GnuPG.

Você pode verificar se o repositório MySQL Yum foi adicionado com sucesso pelo seguinte comando (para sistemas habilitados para dnf, substitua **yum** no comando por **dnf**):

      ```
      $> yum repolist enabled | grep "mysql.*-community.*"
      ```

Nota

Uma vez que o repositório MySQL Yum esteja habilitado no seu sistema, qualquer atualização de nível de sistema pelo comando **yum update** (ou **dnf upgrade** para sistemas habilitados para dnf) atualiza os pacotes do MySQL no seu sistema e substitui quaisquer pacotes de terceiros nativos, se o Yum encontrar substitutos para eles no repositório MySQL Yum; consulte a Seção 3.8, “Atualizando o MySQL com o Repositório MySQL Yum”, para uma discussão sobre alguns efeitos possíveis disso no seu sistema, consulte Atualizando as Bibliotecas de Cliente Compartilhadas.

2. #### Selecionando uma Série de Lançamento

Ao usar o repositório MySQL Yum, a série LTS mais recente (atualmente MySQL 8.4) é selecionada para instalação por padrão. Se você deseja instalar o MySQL 8.4 em vez do 8.0, ignore este passo.

Dentro do repositório MySQL Yum, diferentes séries de lançamento do MySQL Community Server são hospedadas em diferentes subrepositórios. O subrepositório para a última série GA (atualmente MySQL 8.4) é ativado por padrão, e os subrepositórios para todas as outras séries (por exemplo, a série MySQL 8.0) são desativados por padrão. Use este comando para ver todos os subrepositórios no repositório MySQL Yum e veja quais deles estão ativados ou desativados (para sistemas com dnf, substitua **yum** no comando por **dnf**):

   ```
   $> yum repolist all | grep mysql
   ```

Para instalar a versão mais recente da última série LTS, não é necessário fazer nenhuma configuração. Para instalar a versão mais recente de uma série específica que não seja a última série LTS, desative o subrepositório para a última série LTS e ative o subrepositório para a série específica antes de executar o comando de instalação. Se sua plataforma suportar o **yum-config-manager**, você pode fazer isso emitindo esses comandos, que desativam o subrepositório para a série 8.4 e ativam o para a série 8.0:

   ```
   $> sudo yum-config-manager --disable mysql-8.4-lts-community
   $> sudo yum-config-manager --disable mysql-tools-8.4-lts-community

   $> sudo yum-config-manager --enable mysql80-community
   $> sudo yum-config-manager --enable mysql-tools-community
   ```

Para plataformas com dnf habilitado:

   ```
   $> sudo dnf config-manager --disable mysql-8.4-lts-community
   $> sudo dnf config-manager --disable mysql-tools-8.4-lts-community

   $> sudo dnf config-manager --enable mysql80-community
   $> sudo dnf config-manager --enable mysql-tools-community
   ```

Além de usar o **yum-config-manager** ou o comando **dnf config-manager**, você também pode selecionar uma série de lançamento editando manualmente o arquivo `/etc/yum.repos.d/mysql-community.repo`. Esta é uma entrada típica para um subrepositório do MySQL 8.0:

   ```
   [mysql80-community]
   name=MySQL 8.0 Community Server
   baseurl=http://repo.mysql.com/yum/mysql-8.0-community/el/9/$basearch/
   enabled=1
   gpgcheck=1
   gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql-2023
   ```

Encontre a entrada para a subrepositório que você deseja configurar e edite a opção `enabled`. Especifique `enabled=0` para desabilitar uma subrepositório, ou `enabled=1` para habilitar uma subrepositório. Por exemplo, para instalar o MySQL 8.0, certifique-se de que você tem `enabled=0` para as outras entradas da série MySQL e `enabled=1` para o MySQL 8.0.

Você deve habilitar apenas um subrepositório por série de lançamento de cada vez. Quando subrepositórios para mais de uma série de lançamento são habilitados, o Yum usa a série mais recente.

Verifique se os subrepositórios corretos foram habilitados e desabilitados, executando o seguinte comando e verificando sua saída (para sistemas com dnf habilitado, substitua **yum** no comando por **dnf**):

   ```
   $> yum repolist enabled | grep mysql
   ```

3. #### Desabilitando o módulo MySQL padrão

(Apenas para sistemas EL8) Sistemas baseados em EL8, como RHEL8 e Oracle Linux 8, incluem um módulo MySQL que é ativado por padrão. A menos que este módulo seja desativado, ele mascara os pacotes fornecidos pelos repositórios do MySQL. Para desativar o módulo incluído e tornar os pacotes do repositório do MySQL visíveis, use o seguinte comando (para sistemas habilitados para dnf, substitua **yum** no comando por **dnf**):

   ```
   $> sudo yum module disable mysql
   ```

4. #### Instalação do MySQL

Instale o MySQL pelo seguinte comando (para sistemas com dnf, substitua **yum** no comando por **dnf**):

   ```
   $> sudo yum install mysql-community-server
   ```

Este pacote instala o servidor MySQL (`mysql-community-server`) e também pacotes para os componentes necessários para executar o servidor, incluindo pacotes para o cliente (`mysql-community-client`), as mensagens de erro comuns e os conjuntos de caracteres para cliente e servidor (`mysql-community-common`) e as bibliotecas de cliente compartilhadas (`mysql-community-libs`).

5. #### Iniciando o servidor MySQL

Inicie o servidor MySQL com o seguinte comando:

   ```
   $> systemctl start mysqld
   ```

Você pode verificar o status do servidor MySQL com o seguinte comando:

   ```
   $> systemctl status mysqld
   ```

Se o sistema operacional estiver habilitado para systemd, os comandos padrão **systemctl** (ou, como alternativa, **service** com os argumentos invertidos) como **stop**, **start**, **status** e **restart** devem ser usados para gerenciar o serviço do servidor MySQL. O serviço `mysqld` é habilitado por padrão e é iniciado na reinicialização do sistema. Consulte a Seção 2.5.9, “Gerenciando o servidor MySQL com systemd”, para obter informações adicionais.

Ao inicializar o servidor pela primeira vez, o seguinte acontece, dado que o diretório de dados do servidor está vazio:

* O servidor é inicializado. * Os arquivos de certificado SSL e chave são gerados no diretório de dados.

* `validate_password` está instalado e ativado.

* Uma conta de superusuário `'root'@'localhost` é criada. Uma senha para o superusuário é definida e armazenada no arquivo de registro de erro. Para revelá-la, use o seguinte comando:

  ```
  $> sudo grep 'temporary password' /var/log/mysqld.log
  ```

Troque a senha de raiz o mais rápido possível, iniciando sessão com a senha temporária gerada e definindo uma senha personalizada para a conta do superusuário:

  ```
  $> mysql -uroot -p
  ```

  ```
  mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass4!';
  ```

Nota

`validate_password` é instalado por padrão. A política de senha padrão implementada por `validate_password` exige que as senhas contenham pelo menos uma letra maiúscula, uma letra minúscula, um dígito e um caractere especial, e que o comprimento total da senha seja de pelo menos 8 caracteres.

Para mais informações sobre os procedimentos pós-instalação, consulte a Seção 2.9, “Configuração e Teste Pós-Instalação”.

Nota

*Informações de compatibilidade para plataformas com base no EL7:* Os seguintes pacotes RPM dos repositórios de software nativo das plataformas são incompatíveis com o pacote do repositório MySQL Yum que instala o servidor MySQL. Uma vez que você tenha instalado o MySQL usando o repositório MySQL Yum, não poderá instalar esses pacotes (e vice-versa).

* akonadi-mysql

#### Instalando produtos e componentes adicionais do MySQL com Yum

Você pode usar o Yum para instalar e gerenciar componentes individuais do MySQL. Alguns desses componentes são hospedados em sub-repositórios do repositório Yum do MySQL: por exemplo, os Conectadores MySQL podem ser encontrados no sub-repositório Conectadores MySQL Community, e o MySQL Workbench no MySQL Tools Community. Você pode usar o seguinte comando para listar os pacotes para todos os componentes MySQL disponíveis para sua plataforma a partir do repositório Yum do MySQL (para sistemas habilitados para dnf, substitua **yum** no comando por **dnf**):

```
$> sudo yum --disablerepo=\* --enablerepo='mysql*-community*' list available
```

Instale quaisquer pacotes de sua escolha com o seguinte comando, substituindo *`package-name`* pelo nome do pacote (para sistemas habilitados para dnf, substitua **yum** no comando por **dnf**):

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

#### Notas específicas para a plataforma

Suporte ARM

O ARM de 64 bits (aarch64) é suportado no Oracle Linux 7 e requer o Repositório de Coleções de Software Oracle Linux 7 (ol7_software_collections). Por exemplo, para instalar o servidor:

```
$> yum-config-manager --enable ol7_software_collections
$> yum install mysql-community-server
```

Nota

O ARM de 64 bits (aarch64) é suportado no Oracle Linux 7 a partir do MySQL 8.0.12.

Limitação conhecida

O lançamento 8.0.12 exige que você ajuste o caminho do *libstdc++7* executando `ln -s /opt/oracle/oracle-armtoolset-1/root/usr/lib64 /usr/lib64/gcc7` após executar a etapa `yum install`.

#### Atualizando o MySQL com o Yum

Além da instalação, você também pode realizar atualizações para produtos e componentes do MySQL usando o repositório MySQL Yum. Consulte a Seção 3.8, “Atualizando o MySQL com o repositório MySQL Yum”, para obter detalhes.

### 2.5.2 Instalar o MySQL no Linux usando o repositório do MySQL APT

O repositório APT do MySQL fornece pacotes `deb` para instalar e gerenciar o servidor MySQL, o cliente e outros componentes nas versões atuais do Debian e do Ubuntu.

As instruções para usar o Repositório APT do MySQL estão disponíveis em [Um guia rápido para usar o Repositório APT do MySQL][(/doc/mysql-apt-repo-quick-guide/en/)].

### 2.5.3 Instalar o MySQL no Linux usando o repositório MySQL SLES

O repositório SLES do MySQL fornece pacotes RPM para instalação e gerenciamento do servidor MySQL, cliente e outros componentes no SUSE Enterprise Linux Server.

As instruções para usar o repositório MySQL SLES estão disponíveis em [Um guia rápido para usar o repositório MySQL SLES][(/doc/mysql-sles-repo-quick-guide/en/)].

### 2.5.4 Instalar o MySQL no Linux usando pacotes RPM da Oracle

A maneira recomendada para instalar o MySQL em distribuições Linux baseadas em RPM é usando os pacotes RPM fornecidos pela Oracle. Existem duas fontes para obtê-los, para a Edição Comunitária do MySQL:

* Dos repositórios de software MySQL:

+ O repositório MySQL Yum (consulte a Seção 2.5.1, “Instalando MySQL no Linux usando o repositório Yum MySQL” para detalhes).

+ O repositório SLES do MySQL (consulte a Seção 2.5.3, “Instalando o MySQL no Linux usando o repositório SLES do MySQL”, para detalhes).

* A partir da página [Download MySQL Community Server][(https://dev.mysql.com/downloads/mysql/)] na [MySQL Developer Zone][(https://dev.mysql.com/)].

Nota

As distribuições RPM do MySQL também são fornecidas por outros fornecedores. Esteja ciente de que elas podem diferir das construídas pela Oracle em termos de recursos, capacidades e convenções (incluindo configuração de comunicação), e que as instruções de instalação neste manual não se aplicam necessariamente a elas. As instruções do fornecedor devem ser consultadas em vez disso.

#### Pacotes RPM do MySQL

**Tabela 2.9 Pacotes RPM para a Edição Comunitária do MySQL**

<table frame="all"><col style="width: 35%"/><col style="width: 25%"/><thead><tr> <th>Package Name</th> <th>Resumo</th> </tr></thead><tbody><tr> <td><code>mysql-community-client</code></td> <td>Aplicações e ferramentas de cliente MySQL</td> </tr><tr> <td><code>mysql-community-client-plugins</code></td> <td>Plugins compartilhados para aplicações cliente MySQL</td> </tr><tr> <td><code>mysql-community-common</code></td> <td>Arquivos comuns para bibliotecas de servidor e cliente</td> </tr><tr> <td><code>mysql-community-devel</code></td> <td>Arquivos de cabeçalho de desenvolvimento e bibliotecas para aplicações de cliente de banco de dados MySQL</td> </tr><tr> <td><code>mysql-community-embedded-compat</code></td> <td>Servidor MySQL como uma biblioteca embutida com compatibilidade para aplicações que utilizam a versão 18 da biblioteca</td> </tr><tr> <td><code>mysql-community-icu-data-files</code></td> <td>Pacote MySQL de arquivos de dados ICU necessários para expressões regulares do MySQL</td> </tr><tr> <td><code>mysql-community-libs</code></td> <td>Bibliotecas compartilhadas para aplicações de cliente de banco de dados MySQL</td> </tr><tr> <td><code>mysql-community-libs-compat</code></td> <td>Bibliotecas de compatibilidade compartilhadas para instalações anteriores do MySQL; apenas apresentadas se as versões anteriores do MySQL forem suportadas pela plataforma</td> </tr><tr> <td><code>mysql-community-server</code></td> <td>Servidor de banco de dados e ferramentas relacionadas</td> </tr><tr> <td><code>mysql-community-server-debug</code></td> <td>Debugar binários do servidor e plugins</td> </tr><tr> <td><code>mysql-community-test</code></td> <td>Conjunto de testes para o servidor MySQL</td> </tr><tr> <td><code>mysql-community</code></td> <td>O código-fonte RPM parece semelhante ao mysql-community-8.0.44-1.el7.src.rpm, dependendo do sistema operacional selecionado</td> </tr><tr> <td>Additional *debuginfo* RPMs</td> <td>Há várias<code>debuginfo</code>pacotes: mysql-community-client-debuginfo, mysql-community-libs-debuginfo, mysql-community-server-debug-debuginfo, mysql-community-server-debuginfo e mysql-community-test-debuginfo.</td> </tr></tbody></table>

**Tabela 2.10 Pacotes RPM para a Edição Empresarial do MySQL**

<table frame="all"><col style="width: 35%"/><col style="width: 25%"/><thead><tr> <th>Package Name</th> <th>Resumo</th> </tr></thead><tbody><tr> <td><code>mysql-commercial-backup</code></td> <td>MySQL Enterprise Backup (adicionado em 8.0.11)</td> </tr><tr> <td><code>mysql-commercial-client</code></td> <td>Aplicações e ferramentas de cliente MySQL</td> </tr><tr> <td><code>mysql-commercial-client-plugins</code></td> <td>Plugins compartilhados para aplicações cliente MySQL</td> </tr><tr> <td><code>mysql-commercial-common</code></td> <td>Arquivos comuns para bibliotecas de servidor e cliente</td> </tr><tr> <td><code>mysql-commercial-devel</code></td> <td>Arquivos de cabeçalho de desenvolvimento e bibliotecas para aplicações de cliente de banco de dados MySQL</td> </tr><tr> <td><code>mysql-commercial-embedded-compat</code></td> <td>Servidor MySQL como uma biblioteca embutida com compatibilidade para aplicações que utilizam a versão 18 da biblioteca</td> </tr><tr> <td><code>mysql-commercial-icu-data-files</code></td> <td>Pacote MySQL de arquivos de dados ICU necessários para expressões regulares do MySQL</td> </tr><tr> <td><code>mysql-commercial-libs</code></td> <td>Bibliotecas compartilhadas para aplicações de cliente de banco de dados MySQL</td> </tr><tr> <td><code>mysql-commercial-libs-compat</code></td> <td>Bibliotecas de compatibilidade compartilhadas para instalações anteriores do MySQL; apenas presentes se as versões anteriores do MySQL forem suportadas pela plataforma. A versão das bibliotecas corresponde à versão das bibliotecas instaladas por padrão pela distribuição que você está usando.</td> </tr><tr> <td><code>mysql-commercial-server</code></td> <td>Servidor de banco de dados e ferramentas relacionadas</td> </tr><tr> <td><code>mysql-commercial-test</code></td> <td>Conjunto de testes para o servidor MySQL</td> </tr><tr> <td>Additional *debuginfo* RPMs</td> <td>Há várias<code>debuginfo</code>packages: mysql-commercial-client-debuginfo, mysql-commercial-libs-debuginfo mysql-commercial-server-debug-debuginfo mysql-commercial-server-debuginfo e mysql-commercial-test-debuginfo.</td> </tr></tbody></table>

Os nomes completos para os RPMs têm a seguinte sintaxe:

```
packagename-version-distribution-arch.rpm
```

Os valores *`distribution`* e *`arch`* indicam a distribuição do Linux e o tipo de processador para o qual o pacote foi construído. Consulte a tabela abaixo para listas dos identificadores da distribuição:

**Tabela 2.11 Identificadores de distribuição de pacotes RPM Linux do MySQL**

<table><col style="width: 25%"/><col style="width: 75%"/><thead><tr> <th>Valor de Distribuição</th> <th>Uso pretendido</th> </tr></thead><tbody><tr> <td>el<em class="replaceable"><code>{version}</code></em>onde<em class="replaceable"><code>{version}</code></em>é a principal versão do Enterprise Linux, como<code>el8</code></td> <td>Plataformas baseadas em EL6 (8.0), EL7, EL8, EL9 e EL10 (por exemplo, as versões correspondentes do Oracle Linux, Red Hat Enterprise Linux e CentOS)</td> </tr><tr> <td>fc<em class="replaceable"><code>{version}</code></em>onde<em class="replaceable"><code>{version}</code></em>é a principal versão do Fedora, como<code>fc37</code></td> <td>Fedora 41 e 42</td> </tr><tr> <td><code>sles12</code></td> <td>SUSE Linux Enterprise Server 12</td> </tr></tbody></table>

Para ver todos os arquivos em um pacote RPM (por exemplo, `mysql-community-server`), use o seguinte comando:

```
$> rpm -qpl mysql-community-server-version-distribution-arch.rpm
```

*A discussão no restante desta seção se aplica apenas a um processo de instalação que utiliza os pacotes RPM diretamente baixados da Oracle, em vez de através de um repositório MySQL.*

Existem relações de dependência entre alguns dos pacotes. Se você planeja instalar muitos dos pacotes, talvez queira baixar o arquivo de pacote RPM **tar**, que contém todos os pacotes RPM listados acima, para que você não precise baixá-los separadamente.

Na maioria dos casos, você precisa instalar os pacotes `mysql-community-server`, `mysql-community-client`, `mysql-community-client-plugins`, `mysql-community-libs`, `mysql-community-icu-data-files`, `mysql-community-common` e `mysql-community-libs-compat` para obter uma instalação MySQL funcional e padrão. Para realizar uma instalação padrão e básica, vá para a pasta que contém todos esses pacotes (e, de preferência, sem outros pacotes RPM com nomes semelhantes) e execute o seguinte comando:

```
$> sudo yum install mysql-community-{server,client,client-plugins,icu-data-files,common,libs}-*
```

Substitua **yum** por **zypper** para SLES e por **dnf** para Fedora.

Embora seja muito preferível usar uma ferramenta de gerenciamento de pacotes de alto nível, como o **yum**, para instalar os pacotes, os usuários que preferem comandos diretos de **rpm** podem substituir o comando **yum install** pelo comando **rpm -Uvh**. No entanto, usar **rpm -Uvh** em vez disso torna o processo de instalação mais propenso a falhas, devido a potenciais problemas de dependência que o processo de instalação pode encontrar.

Para instalar apenas os programas do cliente, você pode pular `mysql-community-server` em sua lista de pacotes a serem instalados; execute o seguinte comando:

```
$> sudo yum install mysql-community-{client,client-plugins,common,libs}-*
```

Substitua **yum** por **zypper** para SLES e por **dnf** para Fedora.

Uma instalação padrão do MySQL usando os pacotes RPM resulta em arquivos e recursos criados sob os diretórios do sistema, mostrados na tabela a seguir.

**Tabela 2.12 Estrutura de instalação do MySQL para pacotes RPM do Linux da MySQL Developer Zone**

<table><col style="width: 55%"/><col style="width: 45%"/><thead><tr> <th>Arquivos ou Recursos</th> <th>Location</th> </tr></thead><tbody><tr> <td>Programas e scripts para clientes</td> <td><code>/usr/bin</code></td> </tr><tr> <td>servidor mysqld</td> <td><code>/usr/sbin</code></td> </tr><tr> <td>Arquivo de configuração</td> <td><code>/etc/my.cnf</code></td> </tr><tr> <td>Diretório de dados</td> <td><code>/var/lib/mysql</code></td> </tr><tr> <td>Arquivo de registro de erro</td> <td><p> For RHEL, Oracle Linux, CentOS or Fedora platforms: <code>/var/log/mysqld.log</code> </p><p> For SLES: <code>/var/log/mysql/mysqld.log</code> </p></td> </tr><tr> <td>Valor de<code>secure_file_priv</code></td> <td><code>/var/lib/mysql-files</code></td> </tr><tr> <td>Script de inicialização do Sistema V</td> <td><p> For RHEL, Oracle Linux, CentOS or Fedora platforms: <code>/etc/init.d/mysqld</code> </p><p> For SLES: <code>/etc/init.d/mysql</code> </p></td> </tr><tr> <td>Serviço Systemd</td> <td><p> For RHEL, Oracle Linux, CentOS or Fedora platforms: <code>mysqld</code> </p><p> For SLES: <code>mysql</code> </p></td> </tr><tr> <td>arquivo Pid</td> <td><code> /var/run/mysql/mysqld.pid</code></td> </tr><tr> <td>Soquete</td> <td><code>/var/lib/mysql/mysql.sock</code></td> </tr><tr> <td>Diretório de carteiras de proximidade</td> <td><code>/var/lib/mysql-keyring</code></td> </tr><tr> <td>Páginas do manual do Unix</td> <td><code>/usr/share/man</code></td> </tr><tr> <td>Incluir arquivos (cabeçalho)</td> <td><code>/usr/include/mysql</code></td> </tr><tr> <td>Livrarias</td> <td><code>/usr/lib/mysql</code></td> </tr><tr> <td>Arquivos de suporte diversos (por exemplo, mensagens de erro e arquivos de conjunto de caracteres)</td> <td><code>/usr/share/mysql</code></td> </tr></tbody></table>

A instalação também cria um usuário chamado `mysql` e um grupo chamado `mysql` no sistema.

Notas

* O usuário `mysql` é criado usando as opções `-r` e `-s /bin/false` do comando `useradd`, para que ele não tenha permissões de login no seu host do servidor (consulte [Criando o usuário e o grupo mysql][(/doc/mysql-secure-deployment-guide/8.0/en/secure-deployment-install.html#secure-deployment-mysql-user)] para detalhes). Para alternar para o usuário `mysql` no seu sistema operacional, use a opção `--shell=/bin/bash` para o comando `su`:

  ```
  su - mysql --shell=/bin/bash
  ```

* A instalação de versões anteriores do MySQL usando pacotes mais antigos pode ter criado um arquivo de configuração chamado `/usr/my.cnf`. É altamente recomendável que você examine o conteúdo do arquivo e migre as configurações desejadas para o arquivo `/etc/my.cnf`, e depois remova `/usr/my.cnf`.

O MySQL NÃO é iniciado automaticamente no final do processo de instalação. Para sistemas Red Hat Enterprise Linux, Oracle Linux, CentOS e Fedora, use o seguinte comando para iniciar o MySQL:

```
$> systemctl start mysqld
```

Para sistemas SLES, o comando é o mesmo, mas o nome do serviço é diferente:

```
$> systemctl start mysql
```

Se o sistema operacional estiver habilitado para systemd, os comandos padrão do **systemctl** (ou, como alternativa, **service** com os argumentos invertidos) como **stop**, **start**, **status** e **restart** devem ser usados para gerenciar o serviço do servidor MySQL. O serviço `mysqld` é habilitado por padrão e começa na reinicialização do sistema. Observe que algumas coisas podem funcionar de maneira diferente em plataformas systemd: por exemplo, alterar a localização do diretório de dados pode causar problemas. Consulte a Seção 2.5.9, “Gerenciando o servidor MySQL com systemd”, para obter informações adicionais.

Durante uma instalação de atualização usando pacotes RPM e DEB, se o servidor MySQL estiver em execução quando a atualização ocorrer, o servidor MySQL será parado, a atualização ocorrerá e o servidor MySQL será reiniciado. Uma exceção: se a edição também for alterada durante uma atualização (como de comunidade para comercial ou vice-versa), o servidor MySQL não será reiniciado.

Ao inicializar o servidor pela primeira vez, o seguinte acontece, dado que o diretório de dados do servidor está vazio:

* O servidor é inicializado. * Um certificado SSL e arquivos de chave são gerados no diretório de dados.

* `validate_password` está instalado e ativado.

* Uma conta de superusuário `'root'@'localhost'` é criada. Uma senha para o superusuário é definida e armazenada no arquivo de registro de erro. Para revelá-la, use o seguinte comando para sistemas RHEL, Oracle Linux, CentOS e Fedora:

  ```
  $> sudo grep 'temporary password' /var/log/mysqld.log
  ```

Utilize o seguinte comando para sistemas SLES:

  ```
  $> sudo grep 'temporary password' /var/log/mysql/mysqld.log
  ```

O próximo passo é fazer login com a senha temporária gerada e definir uma senha personalizada para a conta de superusuário:

```
$> mysql -uroot -p
```

```
mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass4!';
```

Nota

`validate_password` é instalado por padrão. A política de senha padrão implementada por `validate_password` exige que as senhas contenham pelo menos uma letra maiúscula, uma letra minúscula, um dígito e um caractere especial, e que o comprimento total da senha seja de pelo menos 8 caracteres.

Se algo der errado durante a instalação, você pode encontrar informações de depuração no arquivo de registro de erro `/var/log/mysqld.log`.

Para algumas distribuições Linux, pode ser necessário aumentar o limite do número de descritores de arquivo disponíveis para o **mysqld**. Consulte a Seção B.3.2.16, “Ficheiro não encontrado e erros semelhantes”

**Instalando bibliotecas de clientes de várias versões do MySQL.** É possível instalar várias versões de bibliotecas de clientes, como no caso em que você deseja manter a compatibilidade com aplicativos mais antigos vinculados a bibliotecas anteriores. Para instalar uma biblioteca de cliente mais antiga, use a opção `--oldpackage` com **rpm**. Por exemplo, para instalar `mysql-community-libs-5.5` em um sistema EL6 que tem `libmysqlclient.21` do MySQL 8.0, use um comando como este:

```
$> rpm --oldpackage -ivh mysql-community-libs-5.5.50-2.el6.x86_64.rpm
```

**Pacote de depuração.** Uma variante especial do MySQL Server compilada com o pacote de depuração foi incluída nos pacotes RPM do servidor. Ela realiza verificações de depuração e alocação de memória e produz um arquivo de rastreamento quando o servidor está em execução. Para usar essa versão de depuração, inicie o MySQL com `/usr/sbin/mysqld-debug`, em vez de iniciá-lo como um serviço ou com `/usr/sbin/mysqld`. Consulte a Seção 7.9.4, “O pacote DBUG”, para as opções de depuração que você pode usar.

Nota

O diretório padrão do plugin para builds de depuração mudou de `/usr/lib64/mysql/plugin` para `/usr/lib64/mysql/plugin/debug` no MySQL 8.0.4. Anteriormente, era necessário alterar `plugin_dir` para `/usr/lib64/mysql/plugin/debug` para builds de depuração.

**Reconstruindo RPMs a partir de SRPMs de origem.** Pacotes de código-fonte SRPM para MySQL estão disponíveis para download. Eles podem ser usados como estão para reconstruir os RPMs do MySQL com a cadeia de ferramentas padrão **rpmbuild**.

### 2.5.5 Instalar o MySQL no Linux usando pacotes do Debian da Oracle

A Oracle fornece pacotes do Debian para instalar o MySQL em sistemas Debian ou Debian-like Linux. Os pacotes estão disponíveis através de dois canais diferentes:

* O [Repositório MySQL APT][(https://dev.mysql.com/downloads/repo/apt/)]. Este é o método preferido para instalar o MySQL em sistemas semelhantes ao Debian, pois oferece uma maneira simples e conveniente de instalar e atualizar produtos MySQL. Para detalhes, consulte a Seção 2.5.2, “Instalando MySQL no Linux usando o Repositório MySQL APT”.

* A Área de Download da [MySQL Developer Zone][(https://dev.mysql.com/downloads/)]. Para detalhes, consulte a Seção 2.1.3, “Como obter o MySQL”. A seguir, estão algumas informações sobre os pacotes Debian disponíveis lá e as instruções para instalá-los:

+ Vários pacotes do Debian são fornecidos na MySQL Developer Zone para instalar diferentes componentes do MySQL nas plataformas Debian e Ubuntu atuais. O método preferido é usar o pacote em formato tarball, que contém os pacotes necessários para uma configuração básica do MySQL. Os pacotes em formato tarball têm nomes no formato `mysql-server_MVER-DVER_CPU.deb-bundle.tar`. *`MVER`* é a versão do MySQL e *`DVER`* é a versão da distribuição Linux. O valor *`CPU`* indica o tipo ou família de processador para a qual o pacote foi construído, conforme mostrado na tabela a seguir:

**Tabela 2.13 Pacotes de instalação do MySQL Debian e Ubuntu Identificadores de CPU**

    <table><col style="width: 25%"/><col style="width: 75%"/><thead><tr> <th><em class="replaceable"><code>CPU</code></em> Value</th> <th>Tipo ou família de processador pretendido</th> </tr></thead><tbody><tr> <td><code>i386</code></td> <td>Pentium processador ou melhor, 32 bits</td> </tr><tr> <td><code>amd64</code></td> <td>processador x86 de 64 bits</td> </tr></tbody></table>

+ Após baixar o tarball, descompacte-o com o seguinte comando:

    ```
    $> tar -xvf mysql-server_MVER-DVER_CPU.deb-bundle.tar
    ```

+ Você pode precisar instalar a biblioteca `libaio` se ela não estiver presente em seu sistema:

    ```
    $> sudo apt-get install libaio1
    ```

+ Preconfigure o pacote do servidor MySQL com o seguinte comando:

    ```
    $> sudo dpkg-preconfigure mysql-community-server_*.deb
    ```

Você é solicitado a fornecer uma senha para o usuário root da sua instalação do MySQL. Você também pode ser solicitado outras perguntas sobre a instalação.

Importante

Certifique-se de lembrar a senha de root que você definiu. Os usuários que desejam definir uma senha posteriormente podem deixar o campo de senha em branco na caixa de diálogo e apenas pressionar OK; nesse caso, o acesso de root ao servidor é autenticado usando o [Plugin de Autenticação de Credenciais Peer de Soquete MySQL][(socket-pluggable-authentication.html "8.4.1.10 Socket Peer-Credential Pluggable Authentication")] para conexões que utilizam um arquivo de socket Unix. Você pode definir a senha de root posteriormente usando **mysql_secure_installation**.

+ Para uma instalação básica do servidor MySQL, instale o pacote de arquivos comuns do banco de dados, o pacote do cliente, o metapacote do cliente, o pacote do servidor e o metapacote do servidor (naquela ordem); você pode fazer isso com um único comando:

    ```
    $> sudo dpkg -i mysql-{common,community-client-plugins,community-client-core,community-client,client,community-server-core,community-server,server}_*.deb
    ```

Existem também pacotes com `server-core` e `client-core` nos nomes dos pacotes. Esses contêm apenas binários e são instalados automaticamente pelos pacotes padrão. Instalar esses pacotes por si só não resulta em uma configuração MySQL funcional.

Se você está sendo avisado sobre dependências não atendidas pelo **dpkg** (como libmecab2), você pode corrigi-las usando o **apt-get**:

    ```
    sudo apt-get -f install
    ```

Aqui estão os locais onde os arquivos são instalados no sistema:

- Todos os arquivos de configuração (como `my.cnf`) estão sob `/etc/mysql`

- Todos os binários, bibliotecas, cabeçalhos, etc., estão sob `/usr/bin` e `/usr/sbin`

- O diretório de dados está em `/var/lib/mysql`

Nota

As distribuições Debian do MySQL também são fornecidas por outros fornecedores. Esteja ciente de que elas podem diferir das construídas pela Oracle em termos de recursos, capacidades e convenções (incluindo configuração de comunicação), e que as instruções neste manual não se aplicam necessariamente à instalação delas. As instruções do fornecedor devem ser consultadas em vez disso.

### 2.5.6. Implantação do MySQL no Linux com Contenedores Docker

Esta seção explica como implantar o MySQL Server usando contêineres Docker.

Embora o cliente `docker` seja usado nas instruções a seguir para fins de demonstração, em geral, as imagens de contêiner do MySQL fornecidas pela Oracle funcionam com qualquer ferramenta de contêiner que esteja em conformidade com a especificação [OCI 1.0][(https://opencontainers.org/posts/announcements/2021-05-04-oci-dist-spec-v1/)].

Aviso

Antes de implantar o MySQL com containers Docker, certifique-se de entender os riscos de segurança de executar containers e mitigá-los adequadamente.

#### 2.5.6.1 Passos básicos para implantação do servidor MySQL com Docker

Aviso

As imagens do Docker do MySQL mantidas pela equipe do MySQL são construídas especificamente para plataformas Linux. Outras plataformas não são suportadas, e os usuários que usam essas imagens do MySQL no Docker nelas estão fazendo isso por sua própria conta e risco. Consulte a discussão aqui (deploy-mysql-nonlinux-docker.html "2.5.6.3 Deploying MySQL on Windows and Other Non-Linux Platforms with Docker") para algumas limitações conhecidas para executar esses contêineres em sistemas operacionais não Linux.

* Baixar uma imagem do Docker do servidor MySQL
* Iniciar uma instância do servidor MySQL
* Conectar-se ao servidor MySQL dentro do contêiner
* Acesso à concha do contêiner
* Parar e excluir um contêiner MySQL
* Atualizar um contêiner do servidor MySQL
* Mais tópicos sobre implantação do servidor MySQL com o Docker

##### Baixar uma imagem do Docker do servidor MySQL

Importante

*Para usuários da Edição Empresarial do MySQL*: Uma assinatura é necessária para usar as imagens do Docker para a Edição Empresarial do MySQL. As assinaturas funcionam com o modelo "Traga Sua Própria Licença"; consulte [Como comprar produtos e serviços do MySQL][(https://www.mysql.com/buy-mysql/)] para obter detalhes.

Não é estritamente necessário fazer o download da imagem do servidor em um passo separado; no entanto, realizar essa etapa antes de criar seu contêiner Docker garante que sua imagem local esteja atualizada. Para fazer o download da imagem da Edição Comunitária do MySQL do [Oracle Container Registry (OCR)][(https://container-registry.oracle.com/)], execute o seguinte comando:

```
docker pull container-registry.oracle.com/mysql/community-server:tag
```

O *`tag` é o rótulo para a versão da imagem que você deseja extrair (por exemplo, `5.7`, `8.0` ou `latest`). Se **`:tag`** for omitido, o rótulo `latest` é usado e a imagem para a versão mais recente do MySQL Community Server é baixada.

Para baixar a imagem da Edição Empresarial do MySQL do OCR, você precisa aceitar primeiro o acordo de licença no OCR e fazer login no repositório do contêiner com seu cliente Docker. Siga estes passos:

* Visite o OCR em <https://container-registry.oracle.com/> e escolha MySQL.

* Na lista de repositórios do MySQL, escolha `enterprise-server`.

* Se você ainda não se conectou ao OCR, clique no botão "Conectar-se" à direita da página e, em seguida, insira as credenciais da sua conta Oracle quando solicitado.

* Siga as instruções à direita da página para aceitar o acordo de licença.

* Faça login no OCR com seu cliente de contêiner usando, por exemplo, o comando `docker login`:

  ```
  # docker login container-registry.oracle.com
  Username: Oracle-Account-ID
  Password: password
  Login successful.
  ```

Baixe a imagem Docker para a Edição Empresarial do MySQL do OCR com este comando:

```
docker pull  container-registry.oracle.com/mysql/enterprise-server:tag
```

Para baixar a imagem da Edição Empresarial do MySQL do site [My Oracle Support][(https://support.oracle.com/)], vá até o site, faça login na sua conta da Oracle e, após chegar na página inicial, realize os passos a seguir:

* Selecione a aba Patches and Updates. * Vá para a região de Pesquisa de patches e, na aba Pesquisa, mude para a subseção Produto ou Família (Avançado).

* Insira “MySQL Server” no campo Produto e o número desejado de versão no campo Versão.

* Use os menus suspensivos para filtros adicionais para selecionar Descrição — contém e insira “Docker” no campo de texto.

A figura a seguir mostra as configurações de pesquisa para a imagem da Edição Empresarial do MySQL para o MySQL Server 8.0:

  ![Diagram showing search settings for MySQL Enterprise image](images/docker-search2.png)

* Clique no botão de Pesquisa e, na lista de resultados, selecione a versão que você deseja e clique no botão Baixar.

* Na caixa de diálogo de Download de arquivo que aparece, clique e faça o download do arquivo `.zip` para a imagem do Docker.

Descompacte o arquivo `.zip` baixado para obter o tarball interno (`mysql-enterprise-server-version.tar`), e, em seguida, carregue a imagem executando o seguinte comando:

```
docker load -i mysql-enterprise-server-version.tar
```

Você pode listar as imagens de Docker descarregadas com este comando:

```
$> docker images
REPOSITORY                                             TAG       IMAGE ID       CREATED        SIZE
container-registry.oracle.com/mysql/community-server   latest    1d9c2219ff69   2 months ago   496MB
```

##### Começando uma Instância do Servidor MySQL

Para iniciar um novo contêiner Docker para um servidor MySQL, use o seguinte comando:

```
docker run --name=container_name  --restart on-failure -d image_name:tag
```

*`image_name`* é o nome da imagem que será usada para iniciar o contêiner; consulte o documento "Baixar uma imagem Docker do servidor MySQL" para mais informações.

A opção `--name`, para fornecer um nome personalizado para o seu contêiner do servidor, é opcional; se não for fornecido nenhum nome de contêiner, um nome aleatório é gerado.

A opção `--restart` é para configurar a política de [reinício](https://docs.docker.com/config/containers/start-containers-automatically/) para o seu contêiner; ela deve ser definida para o valor `on-failure`, para habilitar o suporte ao reinício do servidor dentro de uma sessão do cliente (o que acontece, por exemplo, quando a declaração RESTART é executada por um cliente ou durante a [configuração de uma instância de clúster InnoDB](/doc/mysql-shell/8.0/en/configuring-production-instances.html#configuring-local-instances)). Com o suporte ao reinício habilitado, emitir um reinício dentro de uma sessão do cliente faz com que o servidor e o contêiner parem e, em seguida, reiniciem. *O suporte ao reinício do servidor está disponível para o MySQL 8.0.21 e versões posteriores.*

Por exemplo, para iniciar um novo contêiner Docker para o MySQL Community Server, use este comando:

```
docker run --name=mysql1 --restart on-failure -d container-registry.oracle.com/mysql/community-server:latest
```

Para iniciar um novo contêiner Docker para o MySQL Enterprise Server com uma imagem Docker baixada do OCR, use este comando:

```
docker run --name=mysql1 --restart on-failure -d container-registry.oracle.com/mysql/enterprise-server:latest
```

Para iniciar um novo contêiner Docker para o MySQL Enterprise Server com uma imagem Docker baixada do My Oracle Support, use este comando:

```
docker run --name=mysql1 --restart on-failure -d mysql/enterprise-server:latest
```

Se a imagem Docker do nome e rótulo especificados não tiver sido baixada por um comando anterior **docker pull** ou **docker run**, a imagem agora é baixada. A inicialização do contêiner começa e o contêiner aparece na lista de contêineres em execução quando você executa o comando **docker ps**. Por exemplo:

```
$> docker ps
CONTAINER ID   IMAGE                                                         COMMAND                  CREATED          STATUS                    PORTS                       NAMES
4cd4129b3211   container-registry.oracle.com/mysql/community-server:latest   "/entrypoint.sh mysq…"   8 seconds ago    Up 7 seconds (health: starting)   3306/tcp, 33060-33061/tcp   mysql1
```

A inicialização do contêiner pode levar algum tempo. Quando o servidor estiver pronto para uso, o `STATUS` do contêiner na saída do comando **docker ps** muda de `(health: starting)` para `(healthy)`.

A opção `-d` usada no comando **docker run** acima faz com que o contêiner seja executado em segundo plano. Use este comando para monitorar a saída do contêiner:

```
docker logs mysql1
```

Depois que a inicialização for concluída, a saída do comando vai conter a senha aleatória gerada para o usuário root; verifique a senha com, por exemplo, este comando:

```
$> docker logs mysql1 2>&1 | grep GENERATED
GENERATED ROOT PASSWORD: Axegh3kAJyDLaRuBemecis&EShOs
```

##### Conectando ao servidor MySQL a partir do interior do Container

Assim que o servidor estiver pronto, você pode executar o cliente **mysql** dentro do contêiner do MySQL Server que você acabou de iniciar e conectá-lo ao MySQL Server. Use o comando **docker exec -it** para iniciar um cliente **mysql** dentro do contêiner Docker que você iniciou, como o seguinte:

```
docker exec -it mysql1 mysql -uroot -p
```

Quando solicitado, insira a senha de raiz gerada (consulte o último passo de Começando uma instância do servidor MySQL acima sobre como encontrar a senha). Como a opção `MYSQL_ONETIME_PASSWORD` é verdadeira por padrão, após ter conectado um cliente **mysql** ao servidor, você deve redefinir a senha de raiz do servidor, emitindo esta declaração:

```
mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'password';
```

Substitua *`password`* pela senha que você escolheu. Uma vez que a senha seja redefinida, o servidor estará pronto para uso.

Acesso à Shell de Contêiner

Para ter acesso à concha do seu contêiner do servidor MySQL, use o comando **docker exec -it** para iniciar uma concha bash dentro do contêiner:

```
$> docker exec -it mysql1 bash
bash-4.2#
```

Você pode, então, executar comandos Linux dentro do contêiner. Por exemplo, para visualizar o conteúdo no diretório de dados do servidor dentro do contêiner, use este comando:

```
bash-4.2# ls /var/lib/mysql
auto.cnf    ca.pem	     client-key.pem  ib_logfile0  ibdata1  mysql       mysql.sock.lock	   private_key.pem  server-cert.pem  sys
ca-key.pem  client-cert.pem  ib_buffer_pool  ib_logfile1  ibtmp1   mysql.sock  performance_schema  public_key.pem   server-key.pem
```

##### Parar e excluir um contêiner MySQL

Para parar o contêiner do servidor MySQL que criamos, use este comando:

```
docker stop mysql1
```

O comando **docker stop** envia um sinal SIGTERM ao processo **mysqld**, para que o servidor seja desligado de forma graciosa.

Observe também que, quando o processo principal de um contêiner (**mysqld** no caso de um contêiner do Servidor MySQL) é interrompido, o contêiner Docker é interrompido automaticamente.

Para reiniciar o contêiner do servidor MySQL:

```
docker start mysql1
```

Para parar e começar novamente o contêiner do servidor MySQL com um único comando:

```
docker restart mysql1
```

Para excluir o contêiner MySQL, pare-o primeiro e, em seguida, use o comando **docker rm**:

```
docker stop mysql1
```

```
docker rm mysql1
```

Se você deseja que o [Volume Docker para o diretório de dados do servidor][(docker-mysql-more-topics.html#docker-persisting-data-configuration "Persisting Data and Configuration Changes")] seja excluído ao mesmo tempo, adicione a opção `-v` ao comando **docker rm**.

##### Atualizando um Contenedor de Servidor MySQL

Importante

* Antes de realizar qualquer atualização no MySQL, siga cuidadosamente as instruções do Capítulo 3, *Atualizando o MySQL*. Entre outras instruções discutidas, é especialmente importante fazer backup do seu banco de dados antes da atualização.

* As instruções desta seção exigem que os dados e a configuração do servidor tenham sido persistidos no host. Consulte Persistência de Alterações de Dados e Configuração para obter detalhes.

Siga estes passos para atualizar uma instalação do Docker do MySQL 5.7 para 8.0:

* Parar o servidor MySQL 5.7 (o nome do contêiner é `mysql57` neste exemplo):

  ```
  docker stop mysql57
  ```

* Faça o download da imagem do Docker do servidor MySQL 8.0. Veja as instruções em Baixar uma imagem do Docker do servidor MySQL. Certifique-se de usar a tag correta para o MySQL 8.0.

* Inicie um novo contêiner Docker MySQL 8.0 (nomeado `mysql80` neste exemplo) com os dados e configuração do servidor antigo (com as devidas modificações, se necessário — consulte o Capítulo 3, *Atualizando o MySQL*) que foram persistidos no host (por meio de [bind-mounting][(https://docs.docker.com/engine/reference/commandline/service_create/#add-bind-mounts-or-volumes)]] neste exemplo). Para o MySQL Community Server, execute o seguinte comando:

  ```
  docker run --name=mysql80 \
     --mount type=bind,src=/path-on-host-machine/my.cnf,dst=/etc/my.cnf \
     --mount type=bind,src=/path-on-host-machine/datadir,dst=/var/lib/mysql \
     -d container-registry.oracle.com/mysql/community-server:8.0
  ```

Se necessário, ajuste `container-registry.oracle.com/mysql/community-server` ao nome correto da imagem, por exemplo, substitua-o por `container-registry.oracle.com/mysql/enterprise-server` para imagens da MySQL Enterprise Edition baixadas do OCR, ou `mysql/enterprise-server` para imagens da MySQL Enterprise Edition baixadas do My Oracle Support.

* Aguarde o servidor terminar a inicialização. Você pode verificar o status do servidor usando o comando **docker ps** (veja Como iniciar uma instância do servidor MySQL para saber como fazer isso).

Siga os mesmos passos para a atualização dentro da série 8.0 (ou seja, de 8.0.*`x`* para 8.0.*`y`*): pare o contêiner original e inicie um novo com uma imagem mais nova nos dados e configuração do servidor antigo. Se você usou a tag `8.0` ou `latest` ao iniciar seu contêiner original e agora há uma nova versão do MySQL 8.0 que você deseja atualizar, você deve primeiro puxar a imagem para a nova versão com o comando:

```
docker pull container-registry.oracle.com/mysql/community-server:8.0
```

Em seguida, você pode fazer uma atualização iniciando um *novo* contêiner com a mesma etiqueta nos dados e configuração antigos (ajuste o nome da imagem, se você estiver usando a Edição Empresarial do MySQL; veja Baixar uma imagem Docker do servidor MySQL):

```
docker run --name=mysql80new \
   --mount type=bind,src=/path-on-host-machine/my.cnf,dst=/etc/my.cnf \
   --mount type=bind,src=/path-on-host-machine/datadir,dst=/var/lib/mysql \
-d container-registry.oracle.com/mysql/community-server:8.0
```

Nota

*Para MySQL 8.0.15 e versões anteriores:* Você precisa completar o processo de atualização executando o utilitário mysql_upgrade no contêiner do servidor MySQL 8.0 (o passo *não* é necessário para MySQL 8.0.16 e versões posteriores):

* ``` docker exec -it mysql80 mysql_upgrade -uroot -p
  ```

Quando solicitado, insira a senha de raiz do seu servidor antigo. * Finalize a atualização reiniciando o novo contêiner:

  ```
  docker restart mysql80
  ```

##### Mais tópicos sobre implantação do servidor MySQL com Docker

Para mais tópicos sobre a implantação do MySQL Server com Docker, como configuração do servidor, persistência de dados e configuração, log de erro do servidor e variáveis de ambiente do contêiner, consulte [Seção 2.5.6.2, “Mais tópicos sobre a implantação do MySQL Server com Docker”][(docker-mysql-more-topics.html "2.5.6.2 More Topics on Deploying MySQL Server with Docker")].

#### 2.5.6.2 Mais tópicos sobre a implantação do servidor MySQL com Docker

Nota

A maioria dos comandos a seguir tem `container-registry.oracle.com/mysql/community-server` como a imagem do Docker que está sendo usada (como nos comandos **docker pull** e **docker run**); mude isso se sua imagem vier de outro repositório — por exemplo, substitua-o por `container-registry.oracle.com/mysql/enterprise-server` para imagens da MySQL Enterprise Edition baixadas do Oracle Container Registry (OCR), ou `mysql/enterprise-server` para imagens da MySQL Enterprise Edition baixadas do [My Oracle Support](https://support.oracle.com/).

* Instalação otimizada do MySQL para Docker
* Configurando o servidor MySQL
* Persistência de alterações de dados e configuração
* Execução de scripts de inicialização adicionais
* Conectar-se ao MySQL a partir de uma aplicação em outro contêiner Docker
* Diário de erro do servidor
* Uso do backup do MySQL Enterprise com Docker
* Uso do mysqldump com Docker
* Problemas conhecidos
* Variáveis de ambiente do Docker

##### A Instalação MySQL Otimizada para Docker

As imagens do Docker para MySQL são otimizadas para o tamanho do código, o que significa que elas incluem apenas componentes cruciais que são esperados serem relevantes para a maioria dos usuários que executam instâncias do MySQL em contêineres do Docker. Uma instalação do MySQL do Docker é diferente de uma instalação comum, não do Docker, nos seguintes aspectos:

* Apenas um número limitado de binários são incluídos. * Todos os binários são removidos; eles não contêm informações de depuração.

Aviso

Quaisquer atualizações ou instalações de software que os usuários realizem no contêiner Docker (incluindo aquelas para componentes do MySQL) podem entrar em conflito com a instalação otimizada do MySQL criada pela imagem do Docker. A Oracle não oferece suporte para produtos MySQL que estejam em um contêiner alterado, ou em um contêiner criado a partir de uma imagem alterada do Docker.

##### Configurando o servidor MySQL

Quando você inicia o contêiner MySQL Docker, pode passar opções de configuração para o servidor através do comando **docker run**. Por exemplo:

```
docker run --name mysql1 -d container-registry.oracle.com/mysql/community-server:tag --character-set-server=utf8mb4 --collation-server=utf8mb4_col
```

O comando inicia o servidor MySQL com `utf8mb4` como conjunto de caracteres padrão e `utf8mb4_col` como agregação padrão para bancos de dados.

Outra maneira de configurar o MySQL Server é preparar um arquivo de configuração e montá-lo na localização do arquivo de configuração do servidor dentro do contêiner. Veja Persistindo Dados e Alterações de Configuração para detalhes.

##### Persistência de alterações de dados e configuração

Os contêineres Docker são, em princípio, efêmeros, e espera-se que quaisquer dados ou configurações sejam perdidos se o contêiner for excluído ou corrompido (consulte as discussões [aqui][(https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/)]). [Volumes Docker][(https://docs.docker.com/engine/admin/volumes/volumes/)] fornece um mecanismo para persistir dados criados dentro de um contêiner Docker. Na sua inicialização, o contêiner do servidor MySQL cria um volume Docker para o diretório de dados do servidor. A saída JSON do comando **docker inspect** no contêiner inclui uma chave `Mount`, cujo valor fornece informações sobre o volume do diretório de dados:

```
$> docker inspect mysql1
...
 "Mounts": [
            {
                "Type": "volume",
                "Name": "4f2d463cfc4bdd4baebcb098c97d7da3337195ed2c6572bc0b89f7e845d27652",
                "Source": "/var/lib/docker/volumes/4f2d463cfc4bdd4baebcb098c97d7da3337195ed2c6572bc0b89f7e845d27652/_data",
                "Destination": "/var/lib/mysql",
                "Driver": "local",
                "Mode": "",
                "RW": true,
                "Propagation": ""
            }
        ],
...
```

A saída mostra que o diretório de origem `/var/lib/docker/volumes/4f2d463cfc4bdd4baebcb098c97d7da3337195ed2c6572bc0b89f7e845d27652/_data`, no qual os dados são persistentes no host, foi montado em `/var/lib/mysql`, o diretório de dados do servidor dentro do contêiner.

Outra maneira de preservar os dados é [bind-mount][(https://docs.docker.com/engine/reference/commandline/service_create/#add-bind-mounts-volumes-or-memory-filesystems)] um diretório do host usando a opção `--mount` ao criar o contêiner. A mesma técnica pode ser usada para persistir a configuração do servidor. O comando a seguir cria um contêiner do MySQL Server e bind-mount tanto o diretório de dados quanto o arquivo de configuração do servidor:

```
docker run --name=mysql1 \
--mount type=bind,src=/path-on-host-machine/my.cnf,dst=/etc/my.cnf \
--mount type=bind,src=/path-on-host-machine/datadir,dst=/var/lib/mysql \
-d container-registry.oracle.com/mysql/community-server:tag
```

O comando monta `path-on-host-machine/my.cnf` em `/etc/my.cnf` (o arquivo de configuração do servidor dentro do contêiner) e `path-on-host-machine/datadir` em `/var/lib/mysql` (o diretório de dados dentro do contêiner). As seguintes condições devem ser atendidas para que o montagem por vinculação funcione:

* O arquivo de configuração `path-on-host-machine/my.cnf` já deve existir e deve conter a especificação para iniciar o servidor pelo usuário `mysql`:

  ```
  [mysqld]
  user=mysql
  ```

Você também pode incluir outras opções de configuração do servidor no arquivo.

* O diretório de dados `path-on-host-machine/datadir` já deve existir. Para que a inicialização do servidor aconteça, o diretório deve estar vazio. Você também pode montar um diretório pré-preenchido com dados e iniciar o servidor com ele; no entanto, você deve garantir que inicie o contêiner Docker com a mesma configuração do servidor que criou os dados, e quaisquer arquivos ou diretórios hostis necessários sejam montados ao iniciar o contêiner.

##### Executar scripts de inicialização adicionais

Se houver quaisquer scripts `.sh` ou `.sql` que você queira executar no banco de dados imediatamente após ele ter sido criado, você pode colocá-los em um diretório de hospedagem e, em seguida, montar o diretório em `/docker-entrypoint-initdb.d/` dentro do contêiner. Por exemplo:

```
docker run --name=mysql1 \
--mount type=bind,src=/path-on-host-machine/scripts/,dst=/docker-entrypoint-initdb.d/ \
-d container-registry.oracle.com/mysql/community-server:tag
```

##### Conectar-se ao MySQL a partir de uma aplicação em outro contêiner Docker

Ao configurar uma rede Docker, você pode permitir que vários contêineres Docker se comuniquem entre si, de modo que um aplicativo cliente em outro contêiner Docker possa acessar o servidor MySQL no contêiner do servidor. Primeiro, crie uma rede Docker:

```
docker network create my-custom-net
```

Então, ao criar e iniciar os contêineres do servidor e do cliente, use a opção `--network` para colocá-los na rede que você criou. Por exemplo:

```
docker run --name=mysql1 --network=my-custom-net -d container-registry.oracle.com/mysql/community-server
```

```
docker run --name=myapp1 --network=my-custom-net -d myapp
```

O contêiner `myapp1` pode, então, se conectar ao contêiner `mysql1` com o nome de host `mysql1` e vice-versa, pois o Docker configura automaticamente um DNS para os nomes de contêineres fornecidos. No exemplo a seguir, executamos o cliente **mysql** do interior do contêiner `myapp1` para se conectar ao host `mysql1` em seu próprio contêiner:

```
docker exec -it myapp1 mysql --host=mysql1 --user=myuser --password
```

Para outras técnicas de rede para contêineres, consulte a seção [Rede de rede de contêineres do Docker][(https://docs.docker.com/engine/userguide/networking/)] na documentação do Docker.

##### Diário de erros do servidor

Quando o MySQL Server é iniciado pela primeira vez com o seu contêiner de servidor, um registro de erro do servidor NÃO é gerado se uma das seguintes condições for verdadeira:

* Um arquivo de configuração do servidor do host foi montado, mas o arquivo não contém a variável do sistema `log_error` (consulte Mudanças persistentes de dados e configuração no montagem de um arquivo de configuração de servidor por bind).

* Um arquivo de configuração do servidor do host não foi montado, mas a variável de ambiente do Docker `MYSQL_LOG_CONSOLE` é `true` (que é o estado padrão da variável para contêineres do servidor MySQL 8.0). O log de erro do MySQL Server é então redirecionado para `stderr`, para que o log de erro vá para o log do contêiner do Docker e seja visível usando o comando **docker logs *`mysqld-container`***.

Para fazer o MySQL Server gerar um log de erro quando uma das duas condições for verdadeira, use a opção `--log-error` para [configurar o servidor][(docker-mysql-more-topics.html#docker-configuring-server "Configuring the MySQL Server")] para gerar o log de erro em um local específico dentro do contêiner. Para persistir o log de erro, monte um arquivo de host no local do log de erro dentro do contêiner, conforme explicado em Persistindo Dados e Alterações de Configuração. No entanto, você deve garantir que seu MySQL Server dentro do seu contêiner tenha acesso de escrita ao arquivo de host montado.

##### Usando o MySQL Enterprise Backup com Docker

O MySQL Enterprise Backup é um utilitário de backup com licença comercial para o MySQL Server, disponível com [MySQL Enterprise Edition][(https://www.mysql.com/products/enterprise/)]. O MySQL Enterprise Backup está incluído na instalação do Docker da MySQL Enterprise Edition.

No exemplo a seguir, assumimos que você já tem um servidor MySQL em execução em um contêiner Docker (consulte a Seção 2.5.6.1, “Passos básicos para implantação do servidor MySQL com Docker”, sobre como iniciar uma instância do servidor MySQL com o Docker). Para que o MySQL Enterprise Backup faça o backup do servidor MySQL, ele deve ter acesso ao diretório de dados do servidor. Isso pode ser alcançado, por exemplo, ao (docker-mysql-more-topics.html#docker-persisting-data-configuration "Persisting Data and Configuration Changes") montar um diretório de host no diretório de dados do servidor MySQL quando você iniciar o servidor:

```
docker run --name=mysqlserver \
--mount type=bind,src=/path-on-host-machine/datadir/,dst=/var/lib/mysql \
-d mysql/enterprise-server:8.0
```

Com este comando, o MySQL Server é iniciado com uma imagem Docker da Edição Empresarial do MySQL, e o diretório de host *`/path-on-host-machine/datadir/`* foi montado no diretório de dados do servidor (`/var/lib/mysql`) dentro do contêiner do servidor. Também assumimos que, após o servidor ter sido iniciado, os privilégios necessários também foram configurados para o MySQL Enterprise Backup acessar o servidor (consulte Conceder privilégios ao administrador do backup do MySQL, para detalhes). Use as etapas a seguir para fazer backup e restaurar uma instância do MySQL Server.

Para fazer backup de uma instância do MySQL Server em execução em um contêiner Docker usando o MySQL Enterprise Backup com Docker, siga os passos listados aqui:

1. No mesmo host onde o contêiner do Servidor MySQL está em execução, inicie outro contêiner com uma imagem da Edição Empresarial do MySQL para realizar um backup com o comando MySQL Enterprise Backup `backup-to-image`. Forneça acesso ao diretório de dados do servidor usando o mount de vinculação que criamos no passo anterior. Além disso, monte um diretório de host (*`/path-on-host-machine/backups/`* neste exemplo) na pasta de armazenamento para backups no contêiner (`/data/backups` no exemplo) para persistir os backups que estamos criando. Aqui está um comando de amostra para este passo, no qual o MySQL Enterprise Backup é iniciado com uma imagem Docker baixada do [My Oracle Support][(https://support.oracle.com/)]:

   ```
   $> docker run \
   --mount type=bind,src=/path-on-host-machine/datadir/,dst=/var/lib/mysql \
   --mount type=bind,src=/path-on-host-machine/backups/,dst=/data/backups \
   --rm mysql/enterprise-server:8.0 \
   mysqlbackup -umysqlbackup -ppassword --backup-dir=/tmp/backup-tmp --with-timestamp \
   --backup-image=/data/backups/db.mbi backup-to-image

   [Entrypoint] MySQL Docker Image 8.0.11-1.1.5
   MySQL Enterprise Backup version 8.0.11 Linux-4.1.12-61.1.16.el7uek.x86_64-x86_64 [2018-04-08  07:06:45]
   Copyright (c) 2003, 2018, Oracle and/or its affiliates. All Rights Reserved.

   180921 17:27:25 MAIN    INFO: A thread created with Id '140594390935680'
   180921 17:27:25 MAIN    INFO: Starting with following command line ...
   ...

   -------------------------------------------------------------
      Parameters Summary
   -------------------------------------------------------------
      Start LSN                  : 29615616
      End LSN                    : 29651854
   -------------------------------------------------------------

   mysqlbackup completed OK!
   ```

É importante verificar o final da saída do **mysqlbackup** para garantir que o backup tenha sido concluído com sucesso.

2. O contêiner sai assim que o trabalho de backup for concluído e, com a opção `--rm` usada para iniciá-lo, ele é removido após sair. Uma cópia de segurança de imagem foi criada e pode ser encontrada no diretório do host montado no último passo para armazenamento de backups, conforme mostrado aqui:

   ```
   $> ls /tmp/backups
   db.mbi
   ```

Para restaurar uma instância do servidor MySQL em um contêiner Docker usando o MySQL Enterprise Backup com o Docker, siga os passos listados aqui:

1. Parar o contêiner do servidor MySQL, que também para o servidor MySQL em execução:

   ```
   docker stop mysqlserver
   ```

2. No host, exclua todo o conteúdo no monte de vinculação do diretório de dados do servidor MySQL:

   ```
   rm -rf /path-on-host-machine/datadir/*
   ```

3. Inicie um contêiner com uma imagem do MySQL Enterprise Edition para realizar o restabelecimento com o comando MySQL Enterprise Backup `copy-back-and-apply-log`. Monte o diretório de dados do servidor e a pasta de armazenamento para os backups, como fizemos ao fazer o backup do servidor:

   ```
   $> docker run \
   --mount type=bind,src=/path-on-host-machine/datadir/,dst=/var/lib/mysql \
   --mount type=bind,src=/path-on-host-machine/backups/,dst=/data/backups \
   --rm mysql/enterprise-server:8.0 \
   mysqlbackup --backup-dir=/tmp/backup-tmp --with-timestamp \
   --datadir=/var/lib/mysql --backup-image=/data/backups/db.mbi copy-back-and-apply-log

   [Entrypoint] MySQL Docker Image 8.0.11-1.1.5
   MySQL Enterprise Backup version 8.0.11 Linux-4.1.12-61.1.16.el7uek.x86_64-x86_64 [2018-04-08  07:06:45]
   Copyright (c) 2003, 2018, Oracle and/or its affiliates. All Rights Reserved.

   180921 22:06:52 MAIN    INFO: A thread created with Id '139768047519872'
   180921 22:06:52 MAIN    INFO: Starting with following command line ...
   ...
   180921 22:06:52 PCR1    INFO: We were able to parse ibbackup_logfile up to
             lsn 29680612.
   180921 22:06:52 PCR1    INFO: Last MySQL binlog file position 0 155, file name binlog.000003
   180921 22:06:52 PCR1    INFO: The first data file is '/var/lib/mysql/ibdata1'
                                 and the new created log files are at '/var/lib/mysql'
   180921 22:06:52 MAIN    INFO: No Keyring file to process.
   180921 22:06:52 MAIN    INFO: Apply-log operation completed successfully.
   180921 22:06:52 MAIN    INFO: Full Backup has been restored successfully.

   mysqlbackup completed OK! with 3 warnings
   ```

O contêiner sai assim que o trabalho de backup for concluído e, com a opção `--rm` usada ao iniciá-lo, ele é removido após sair.

4. Reinicie o contêiner do servidor, que também reinicia o servidor restaurado, usando o seguinte comando:

   ```
   docker restart mysqlserver
   ```

Ou, comece um novo servidor MySQL no diretório de dados restaurado, conforme mostrado aqui:

   ```
   docker run --name=mysqlserver2 \
   --mount type=bind,src=/path-on-host-machine/datadir/,dst=/var/lib/mysql \
   -d mysql/enterprise-server:8.0
   ```

Faça login no servidor para verificar se o servidor está em execução com os dados restaurados.

##### Usando **mysqldump** com Docker

Além de usar o MySQL Enterprise Backup para fazer backup de um servidor MySQL que está sendo executado em um contêiner Docker (docker-mysql-more-topics.html#docker-meb "Using MySQL Enterprise Backup with Docker"), você pode realizar um backup lógico do seu servidor usando o utilitário **mysqldump**, executado dentro de um contêiner Docker.

As instruções a seguir pressupõem que você já tem um servidor MySQL em execução em um contêiner Docker e, quando o contêiner foi iniciado pela primeira vez, um diretório hoste *`/path-on-host-machine/datadir/`* foi montado no diretório de dados do servidor `/var/lib/mysql` (consulte [montando um diretório hoste em um diretório de dados do servidor MySQL](docker-mysql-more-topics.html#docker-persisting-data-configuration "Persisting Data and Configuration Changes") para detalhes), que contém o arquivo de soquete Unix pelo qual **mysqldump** e **mysql** podem se conectar ao servidor. Também pressupomos que, após o servidor ter sido iniciado, um usuário com os devidos privilégios (`admin` neste exemplo) tenha sido criado, com o qual **mysqldump** pode acessar o servidor. Use as etapas a seguir para fazer backup e restaurar os dados do servidor MySQL:

*Fazer backup dos dados do servidor MySQL usando **mysqldump** com Docker*:

1. No mesmo host onde o contêiner do Servidor MySQL está em execução, inicie outro contêiner com uma imagem do Servidor MySQL para realizar um backup com o utilitário **mysqldump** (consulte a documentação do utilitário para sua funcionalidade, opções e limitações). Forneça acesso ao diretório de dados do servidor montando o *`/path-on-host-machine/datadir/`* por vinculação. Além disso, monte um diretório de host (*`/path-on-host-machine/backups/`* neste exemplo) em uma pasta de armazenamento para backups dentro do contêiner (`/data/backups` é usado neste exemplo) para persistir os backups que você está criando. Aqui está um comando de amostra para fazer backup de todos os bancos de dados no servidor usando esta configuração:

   ```
   $> docker run --entrypoint "/bin/sh" \
   --mount type=bind,src=/path-on-host-machine/datadir/,dst=/var/lib/mysql \
   --mount type=bind,src=/path-on-host-machine/backups/,dst=/data/backups \
   --rm container-registry.oracle.com/mysql/community-server:8.0 \
   -c "mysqldump -uadmin --password='password' --all-databases > /data/backups/all-databases.sql"
   ```

No comando, a opção `--entrypoint` é usada para que o shell do sistema seja invocado após o início do contêiner, e a opção `-c` é usada para especificar o comando **mysqldump** a ser executado no shell, cuja saída é redirecionada para o arquivo `all-databases.sql` no diretório de backup.

2. O contêiner sai assim que o trabalho de backup for concluído e, com a opção `--rm` usada para iniciá-lo, ele é removido após sair. Um backup lógico foi criado e pode ser encontrado no diretório do host montado para armazenamento do backup, conforme mostrado aqui:

   ```
   $> ls /path-on-host-machine/backups/
   all-databases.sql
   ```

*Restauração de dados do MySQL Server usando **mysqldump** com Docker*:

1. Certifique-se de que você tem um servidor MySQL em execução em um contêiner, no qual você deseja restaurar seus dados de backup.

2. Inicie um contêiner com uma imagem do MySQL Server para realizar o restabelecimento com um cliente **mysql**. Monte o diretório de dados do servidor, bem como a pasta de armazenamento que contém seu backup:

   ```
   $> docker run  \
   --mount type=bind,src=/path-on-host-machine/datadir/,dst=/var/lib/mysql \
   --mount type=bind,src=/path-on-host-machine/backups/,dst=/data/backups \
   --rm container-registry.oracle.com/mysql/community-server:8.0 \
   mysql -uadmin --password='password' -e "source /data/backups/all-databases.sql"
   ```

O contêiner sai assim que o trabalho de backup for concluído e, com a opção `--rm` usada ao iniciá-lo, ele é removido após sair.

3. Faça login no servidor para verificar se os dados restaurados estão agora no servidor.

Problemas conhecidos

* Ao usar a variável de sistema do servidor `audit_log_file` para configurar o nome do arquivo de log de auditoria, use o modificador de opção `loose` com ele; caso contrário, o Docker não poderá iniciar o servidor.

##### Variáveis de ambiente do Docker

Ao criar um contêiner do MySQL Server, você pode configurar a instância do MySQL usando a opção `--env` (forma abreviada `-e`) e especificando uma ou mais variáveis de ambiente. Não é realizada nenhuma inicialização do servidor se o diretório de dados montado não estiver vazio, caso em que definir qualquer uma dessas variáveis não tem efeito (veja Persistindo Dados e Alterações de Configuração), e nenhum conteúdo existente do diretório, incluindo as configurações do servidor, é modificado durante o início do contêiner.

As variáveis de ambiente que podem ser usadas para configurar uma instância do MySQL estão listadas aqui:

* As variáveis booleanas, incluindo `MYSQL_RANDOM_ROOT_PASSWORD`, `MYSQL_ONETIME_PASSWORD`, `MYSQL_ALLOW_EMPTY_PASSWORD` e `MYSQL_LOG_CONSOLE`, são tornadas verdadeiras ao serem definidas com qualquer cadeia de caracteres de comprimento não nulo. Portanto, definí-las, por exemplo, como “0”, “false” ou “no” não as torna falsas, mas na verdade as torna verdadeiras. Este é um problema conhecido.

* `MYSQL_RANDOM_ROOT_PASSWORD`: Quando essa variável é verdadeira (o que é seu estado padrão, a menos que `MYSQL_ROOT_PASSWORD` seja definido ou `MYSQL_ALLOW_EMPTY_PASSWORD` seja definido como verdadeiro), uma senha aleatória para o usuário raiz do servidor é gerada quando o contêiner Docker é iniciado. A senha é impressa em `stdout` do contêiner e pode ser encontrada olhando o log do contêiner (veja Criando uma instância do servidor MySQL).

* `MYSQL_ONETIME_PASSWORD`: Quando a variável é verdadeira (o que é seu estado padrão, a menos que `MYSQL_ROOT_PASSWORD` seja definido ou `MYSQL_ALLOW_EMPTY_PASSWORD` seja definido como verdadeiro), a senha do usuário raiz é definida como expirada e deve ser alterada antes que o MySQL possa ser usado normalmente.

* `MYSQL_DATABASE`: Esta variável permite especificar o nome de um banco de dados a ser criado ao iniciar a imagem. Se um nome de usuário e uma senha forem fornecidos com `MYSQL_USER` e `MYSQL_PASSWORD`, o usuário é criado e concedido acesso de superusuário a este banco de dados (correspondente a `GRANT ALL`). O banco de dados especificado é criado por uma declaração [CREATE DATABASE IF NOT EXIST](create-database.html "15.1.12 CREATE DATABASE Statement"), de modo que a variável não tenha efeito se o banco de dados já existir.

* `MYSQL_USER`, `MYSQL_PASSWORD`: Essas variáveis são usadas em conjunto para criar um usuário e definir a senha desse usuário, e o usuário recebe permissões de superusuário para o banco de dados especificado pela variável `MYSQL_DATABASE`. Tanto `MYSQL_USER` quanto `MYSQL_PASSWORD` são necessários para que um usuário seja criado — se qualquer uma das duas variáveis não for definida, a outra é ignorada. Se ambas as variáveis forem definidas, mas `MYSQL_DATABASE` não for, o usuário será criado sem quaisquer privilégios.

Nota

Não é necessário usar esse mecanismo para criar o superusuário raiz, que é criado por padrão com a senha definida por um dos mecanismos discutidos nas descrições para `MYSQL_ROOT_PASSWORD` e `MYSQL_RANDOM_ROOT_PASSWORD`, a menos que `MYSQL_ALLOW_EMPTY_PASSWORD` seja verdadeiro.

* `MYSQL_ROOT_HOST`: Por padrão, o MySQL cria a conta `'root'@'localhost'`. Essa conta só pode ser conectada a partir do interior do contêiner, conforme descrito em Conectar ao servidor MySQL a partir do interior do contêiner. Para permitir conexões de root de outros hosts, defina essa variável de ambiente. Por exemplo, o valor `172.17.0.1`, que é o IP padrão do gateway do Docker, permite conexões a partir da máquina hospedeira que executa o contêiner. A opção aceita apenas uma entrada, mas os caracteres curinga são permitidos (por exemplo, `MYSQL_ROOT_HOST=172.*.*.*` ou `MYSQL_ROOT_HOST=%`).

* `MYSQL_LOG_CONSOLE`: Quando a variável é verdadeira (o que é seu estado padrão para os contêineres do servidor MySQL 8.0), o log de erro do MySQL Server é redirecionado para `stderr`, para que o log de erro vá para o log do contêiner Docker e seja visualizado usando o comando **docker logs *`mysqld-container`***.

Nota

A variável não tem efeito se um arquivo de configuração do servidor do host tiver sido montado (consulte Persistindo dados e alterações de configuração na montagem de um arquivo de configuração com bind).

* `MYSQL_ROOT_PASSWORD`: Esta variável especifica uma senha definida para a conta de root do MySQL.

Aviso

Definir a senha do usuário raiz do MySQL na linha de comando é inseguro. Como alternativa para especificar a senha explicitamente, você pode definir a variável com um caminho de arquivo de contêiner para um arquivo de senha, e então montar um arquivo do seu host que contenha a senha no caminho do arquivo de contêiner. Isso ainda não é muito seguro, pois a localização do arquivo de senha ainda está exposta. É preferível usar as configurações padrão de `MYSQL_RANDOM_ROOT_PASSWORD` e `MYSQL_ONETIME_PASSWORD`, ambas sendo verdadeiras.

* `MYSQL_ALLOW_EMPTY_PASSWORD`. Defina-o como verdadeiro para permitir que o contêiner seja iniciado com uma senha em branco para o usuário raiz.

Aviso

Definir essa variável como verdadeira é inseguro, pois deixará sua instância MySQL completamente desprotegida, permitindo que qualquer pessoa obtenha acesso completo como superusuário. É preferível usar as configurações padrão de `MYSQL_RANDOM_ROOT_PASSWORD` e `MYSQL_ONETIME_PASSWORD`, ambas como verdadeiras.

#### 2.5.6.3 Implementando o MySQL em Windows e outras Plataformas Não Linux com Docker

Aviso

As imagens do Docker do MySQL fornecidas pela Oracle são construídas especificamente para plataformas Linux. Outras plataformas não são suportadas, e os usuários que executam as imagens do Docker do MySQL da Oracle nelas estão fazendo isso por sua própria conta e risco. Esta seção discute alguns problemas conhecidos para as imagens quando usadas em plataformas que não são Linux.

Problemas conhecidos para usar as imagens do Docker do servidor MySQL da Oracle no Windows incluem:

* Se você estiver montando em bind no diretório de dados MySQL do contêiner (consulte Persistência de alterações de dados e configuração para detalhes), você deve definir a localização do arquivo de soquete do servidor com a opção `--socket` em algum lugar fora do diretório de dados MySQL; caso contrário, o servidor não consegue iniciar. Isso ocorre porque a maneira como o Docker para Windows lida com o montagem de arquivos não permite que um arquivo de host seja montado em bind no arquivo de soquete.

### 2.5.7 Instalar o MySQL no Linux a partir dos repositórios de software nativo

Muitas distribuições Linux incluem uma versão do servidor MySQL, ferramentas de cliente e componentes de desenvolvimento em seus repositórios de software nativos e podem ser instaladas com os sistemas padrão de gerenciamento de pacotes das plataformas. Esta seção fornece instruções básicas para instalar o MySQL usando esses sistemas de gerenciamento de pacotes.

Importante

Os pacotes nativos geralmente estão várias versões atrás da versão atualmente disponível. Além disso, normalmente não é possível instalar versões de marco de desenvolvimento (DMRs), uma vez que essas versões geralmente não estão disponíveis nos repositórios nativos. Antes de prosseguir, recomendamos que você verifique as outras opções de instalação descritas na Seção 2.5, “Instalando o MySQL no Linux”.

As instruções específicas de distribuição são mostradas abaixo:

* **Red Hat Linux, Fedora, CentOS**

Nota

Para várias distribuições do Linux, você pode instalar o MySQL usando o repositório MySQL Yum em vez do repositório de software nativo da plataforma. Consulte a Seção 2.5.1, “Instalando MySQL no Linux usando o repositório MySQL Yum”, para obter detalhes.

Para o Red Hat e distribuições semelhantes, a distribuição MySQL é dividida em vários pacotes separados, `mysql` para as ferramentas do cliente, `mysql-server` para o servidor e ferramentas associadas, e `mysql-libs` para as bibliotecas. As bibliotecas são necessárias se você deseja fornecer conectividade a diferentes idiomas e ambientes, como Perl, Python e outros.

Para instalar, use o comando **yum** para especificar os pacotes que você deseja instalar. Por exemplo:

  ```
  #> yum install mysql mysql-server mysql-libs mysql-server
  Loaded plugins: presto, refresh-packagekit
  Setting up Install Process
  Resolving Dependencies
  --> Running transaction check
  ---> Package mysql.x86_64 0:5.1.48-2.fc13 set to be updated
  ---> Package mysql-libs.x86_64 0:5.1.48-2.fc13 set to be updated
  ---> Package mysql-server.x86_64 0:5.1.48-2.fc13 set to be updated
  --> Processing Dependency: perl-DBD-MySQL for package: mysql-server-5.1.48-2.fc13.x86_64
  --> Running transaction check
  ---> Package perl-DBD-MySQL.x86_64 0:4.017-1.fc13 set to be updated
  --> Finished Dependency Resolution

  Dependencies Resolved

  ================================================================================
   Package               Arch          Version               Repository      Size
  ================================================================================
  Installing:
   mysql                 x86_64        5.1.48-2.fc13         updates        889 k
   mysql-libs            x86_64        5.1.48-2.fc13         updates        1.2 M
   mysql-server          x86_64        5.1.48-2.fc13         updates        8.1 M
  Installing for dependencies:
   perl-DBD-MySQL        x86_64        4.017-1.fc13          updates        136 k

  Transaction Summary
  ================================================================================
  Install       4 Package(s)
  Upgrade       0 Package(s)

  Total download size: 10 M
  Installed size: 30 M
  Is this ok [y/N]: y
  Downloading Packages:
  Setting up and reading Presto delta metadata
  Processing delta metadata
  Package(s) data still to download: 10 M
  (1/4): mysql-5.1.48-2.fc13.x86_64.rpm                    | 889 kB     00:04
  (2/4): mysql-libs-5.1.48-2.fc13.x86_64.rpm               | 1.2 MB     00:06
  (3/4): mysql-server-5.1.48-2.fc13.x86_64.rpm             | 8.1 MB     00:40
  (4/4): perl-DBD-MySQL-4.017-1.fc13.x86_64.rpm            | 136 kB     00:00
  --------------------------------------------------------------------------------
  Total                                           201 kB/s |  10 MB     00:52
  Running rpm_check_debug
  Running Transaction Test
  Transaction Test Succeeded
  Running Transaction
    Installing     : mysql-libs-5.1.48-2.fc13.x86_64                          1/4
    Installing     : mysql-5.1.48-2.fc13.x86_64                               2/4
    Installing     : perl-DBD-MySQL-4.017-1.fc13.x86_64                       3/4
    Installing     : mysql-server-5.1.48-2.fc13.x86_64                        4/4

  Installed:
    mysql.x86_64 0:5.1.48-2.fc13            mysql-libs.x86_64 0:5.1.48-2.fc13
    mysql-server.x86_64 0:5.1.48-2.fc13

  Dependency Installed:
    perl-DBD-MySQL.x86_64 0:4.017-1.fc13

  Complete!
  ```

MySQL e o servidor MySQL devem agora estar instalados. Um arquivo de configuração de amostra é instalado em `/etc/my.cnf`. Para iniciar o servidor MySQL, use **systemctl**:

  ```
  $> systemctl start mysqld
  ```

As tabelas do banco de dados são criadas automaticamente para você, se elas ainda não existirem. No entanto, você deve executar **mysql_secure_installation** para definir as senhas do root em seu servidor.

* **Debian, Ubuntu, Kubuntu**

Nota

Para as versões do Debian e Ubuntu suportadas, o MySQL pode ser instalado usando o [repositório APT do MySQL][(https://dev.mysql.com/downloads/repo/apt/)] em vez do repositório de software nativo da plataforma. Consulte a Seção 2.5.2, “Instalando o MySQL no Linux usando o repositório MySQL APT”, para obter detalhes.

Em Debian e distribuições relacionadas, existem dois pacotes para MySQL em seus repositórios de software, `mysql-client` e `mysql-server`, para os componentes de cliente e servidor, respectivamente. Você deve especificar uma versão explícita, por exemplo, `mysql-client-5.1`, para garantir que você instale a versão do MySQL que deseja.

Para fazer o download e a instalação, incluindo quaisquer dependências, use o comando **apt-get**, especificando os pacotes que você deseja instalar.

Nota

Antes de instalar, certifique-se de que você atualize seus arquivos de índice `apt-get` para garantir que você esteja baixando a versão mais recente disponível.

Nota

O comando **apt-get** instala uma série de pacotes, incluindo o servidor MySQL, a fim de fornecer as ferramentas e o ambiente de aplicação típicos. Isso pode significar que você instala um grande número de pacotes além do pacote principal do MySQL.

Durante a instalação, o banco de dados inicial é criado e você é solicitado a fornecer a senha do root do MySQL (e a confirmação). Um arquivo de configuração é criado em `/etc/mysql/my.cnf`. Um script de inicialização é criado em `/etc/init.d/mysql`.

O servidor já deve estar iniciado. Você pode iniciar e parar manualmente o servidor usando:

  ```
  #> service mysql [start|stop]
  ```

O serviço é adicionado automaticamente aos níveis de execução 2, 3 e 4, com scripts de parada nos níveis de execução única, desligamento e reinício.

### 2.5.8 Instalar o MySQL no Linux com Juju

O framework de implantação Juju suporta a instalação e configuração fácil de servidores MySQL. Para instruções, consulte <https://jujucharms.com/mysql/>.

### 2.5.9 Gerenciando o servidor MySQL com systemd

Se você instalar o MySQL usando um pacote RPM ou Debian nas seguintes plataformas Linux, o início e o desligamento do servidor são gerenciados pelo systemd:

* Plataformas de pacotes RPM:

+ Variantes da Enterprise Linux versão 7 e superior
+ SUSE Linux Enterprise Server 12 e superior
+ Fedora 29 e superior
* Plataformas da família Debian:

+ Plataformas Debian
+ Plataformas Ubuntu

Se você instalar o MySQL a partir de uma distribuição binária genérica em uma plataforma que usa o systemd, você pode configurar manualmente o suporte do systemd para o MySQL seguindo as instruções fornecidas na seção de configuração pós-instalação do [Guia de implantação segura do MySQL][(/doc/mysql-secure-deployment-guide/en/)].

Se você instalar o MySQL a partir de uma distribuição de fonte em uma plataforma que usa o systemd, obtenha suporte para o MySQL do systemd configurando a distribuição usando a opção `-DWITH_SYSTEMD=1` **CMake**. Veja a Seção 2.8.7, “Opções de Configuração de Fonte do MySQL”.

A discussão a seguir abrange esses tópicos:

* Visão geral do systemd
* Configurando o systemd para MySQL
* Configurando múltiplas instâncias do MySQL usando o systemd
* Migrando do mysqld_safe para o systemd

Nota

Em plataformas para as quais o suporte do systemd para MySQL é instalado, scripts como **mysqld_safe** e o script de inicialização System V são desnecessários e não são instalados. Por exemplo, **mysqld_safe** pode lidar com reinicializações do servidor, mas o systemd oferece a mesma capacidade, e faz isso de uma maneira consistente com a gestão de outros serviços, em vez de usar um programa específico para a aplicação.

Uma implicação da não utilização de **mysqld_safe** em plataformas que utilizam o systemd para gerenciamento de servidores é que o uso das seções `[mysqld_safe]` ou `[safe_mysqld]` em arquivos de opção não é suportado e pode levar a comportamento inesperado.

Como o systemd tem a capacidade de gerenciar múltiplas instâncias do MySQL em plataformas para as quais o suporte do systemd para MySQL está instalado, **mysqld_multi** e **mysqld_multi.server** são desnecessários e não são instalados.

#### Visão geral do systemd

O systemd oferece inicialização e desligamento automático do servidor MySQL. Também permite a gestão manual do servidor usando o comando **systemctl**. Por exemplo:

```
$> systemctl {start|stop|restart|status} mysqld
```

Como alternativa, use o comando **service** (com os argumentos invertidos), que é compatível com sistemas System V:

```
$> service mysqld {start|stop|restart|status}
```

Nota

Para o comando **systemctl** (e o comando alternativo **service**), se o nome do serviço MySQL não for `mysqld`, use o nome apropriado. Por exemplo, use `mysql` em vez de `mysqld` em sistemas baseados no Debian e SLES.

O suporte para o systemd inclui esses arquivos:

* `mysqld.service` (plataformas RPM), `mysql.service` (plataformas Debian): arquivo de configuração da unidade de serviço systemd, com detalhes sobre o serviço MySQL.

* `mysqld@.service` (plataformas RPM), `mysql@.service` (plataformas Debian): Como `mysqld.service` ou `mysql.service`, mas utilizado para gerenciar múltiplas instâncias do MySQL.

* `mysqld.tmpfiles.d`: Arquivo contendo informações para suportar o recurso `tmpfiles`. Este arquivo é instalado sob o nome `mysql.conf`.

* `mysqld_pre_systemd` (plataformas RPM), `mysql-system-start` (plataformas Debian): Suporte para o arquivo de unidade. Este script auxilia na criação do arquivo de log de erro apenas se a localização do log corresponder a um padrão (`/var/log/mysql*.log` para plataformas RPM, `/var/log/mysql/*.log` para plataformas Debian). Em outros casos, o diretório do log de erro deve ser legível ou o log de erro deve estar presente e legível para o usuário que executa o processo **mysqld**.

#### Configurando o systemd para MySQL

Para adicionar ou alterar as opções do systemd para o MySQL, esses métodos estão disponíveis:

* Use um arquivo de configuração do systemd localizado. * Configure o systemd para definir variáveis de ambiente para o processo do servidor MySQL.

* Defina a variável `MYSQLD_OPTS` do systemd.

Para usar um arquivo de configuração do systemd localizado, crie o diretório `/etc/systemd/system/mysqld.service.d` se ele não existir. Nesse diretório, crie um arquivo que contenha uma seção `[Service]` listando as configurações desejadas. Por exemplo:

```
[Service]
LimitNOFILE=max_open_files
Nice=nice_level
LimitCore=core_file_limit
Environment="LD_PRELOAD=/path/to/malloc/library"
Environment="TZ=time_zone_setting"
```

A discussão aqui usa `override.conf` como o nome deste arquivo. Novas versões do systemd suportam o seguinte comando, que abre um editor e permite editar o arquivo:

```
systemctl edit mysqld  # RPM platforms
systemctl edit mysql   # Debian platforms
```

Sempre que você criar ou alterar `override.conf`, recarregue a configuração do systemd, depois diga ao systemd para reiniciar o serviço MySQL:

```
systemctl daemon-reload
systemctl restart mysqld  # RPM platforms
systemctl restart mysql   # Debian platforms
```

Com o systemd, o método de configuração `override.conf` deve ser usado para certos parâmetros, em vez de configurações em um grupo `[mysqld]`, `[mysqld_safe]` ou `[safe_mysqld]` em um arquivo de opção MySQL:

* Para alguns parâmetros, deve-se usar `override.conf`, pois o próprio systemd deve conhecer seus valores e não pode ler arquivos de opção do MySQL para obtê-los.

* Os parâmetros que especificam valores que, de outra forma, só podem ser definidos usando opções conhecidas por **mysqld_safe** devem ser especificados usando o systemd, pois não há um parâmetro correspondente ao **mysqld**.

Para obter informações adicionais sobre o uso do systemd em vez de **mysqld_safe**, consulte Migração de mysqld_safe para systemd.

Você pode definir os seguintes parâmetros em `override.conf`:

* Para definir o número de descritores de arquivo disponíveis para o servidor MySQL, use `LimitNOFILE` em `override.conf` em vez da variável de sistema `open_files_limit` para **mysqld** ou a opção `--open-files-limit` para **mysqld_safe**.

* Para definir o tamanho máximo do arquivo do núcleo, use `LimitCore` em `override.conf` em vez da opção `--core-file-size` para **mysqld_safe**.

* Para definir a prioridade de agendamento do servidor MySQL, use `Nice` em `override.conf` em vez da opção `--nice` para **mysqld_safe**.

Alguns parâmetros do MySQL são configurados usando variáveis de ambiente:

* `LD_PRELOAD`: Defina esta variável se o servidor MySQL deve usar uma biblioteca específica de alocação de memória.

* `NOTIFY_SOCKET`: Esta variável de ambiente especifica o socket que o **mysqld** usa para comunicar a notificação de conclusão do início e mudança do status do serviço com o systemd. É definida pelo systemd quando o serviço **mysqld** é iniciado. O serviço **mysqld** lê o ajuste da variável e escreve na localização definida.

Em MySQL 8.0, o **mysqld** usa o tipo de inicialização de processo `Type=notify`. (O `Type=forking` foi usado no MySQL 5.7.) Com o `Type=notify`, o systemd configura automaticamente um arquivo de soquete e exporta o caminho para a variável de ambiente `NOTIFY_SOCKET`.

* `TZ`: Defina esta variável para especificar o fuso horário padrão para o servidor.

Existem várias maneiras de especificar os valores das variáveis de ambiente para uso pelo processo do servidor MySQL gerenciado pelo systemd:

* Use as linhas `Environment` no arquivo [[`override.conf`]. Para a sintaxe, consulte o exemplo na discussão anterior que descreve como usar este arquivo.

* Especifique os valores no arquivo `/etc/sysconfig/mysql` (crie o arquivo se ele não existir). Atribua os valores usando a seguinte sintaxe:

  ```
  LD_PRELOAD=/path/to/malloc/library
  TZ=time_zone_setting
  ```

Após modificar `/etc/sysconfig/mysql`, reinicie o servidor para tornar as alterações eficazes:

  ```
  systemctl restart mysqld  # RPM platforms
  systemctl restart mysql   # Debian platforms
  ```

Para especificar opções para o **mysqld** sem modificar diretamente os arquivos de configuração do systemd, defina ou desdefina a variável `MYSQLD_OPTS` do systemd. Por exemplo:

```
systemctl set-environment MYSQLD_OPTS="--general_log=1"
systemctl unset-environment MYSQLD_OPTS
```

`MYSQLD_OPTS` também pode ser definido no arquivo `/etc/sysconfig/mysql`.

Após modificar o ambiente do systemd, reinicie o servidor para que as alterações sejam efetivas:

```
systemctl restart mysqld  # RPM platforms
systemctl restart mysql   # Debian platforms
```

Para plataformas que utilizam o systemd, o diretório de dados é inicializado se estiver vazio no início do servidor. Isso pode ser um problema se o diretório de dados for um montagem remota que desapareceu temporariamente: o ponto de montagem pareceria ser um diretório de dados vazio, que então seria inicializado como um novo diretório de dados. Para suprimir esse comportamento de inicialização automática, especifique a seguinte linha no arquivo `/etc/sysconfig/mysql` (crie o arquivo se ele não existir):

```
NO_INIT=true
```

#### Configurando múltiplas instâncias do MySQL usando systemd

Esta seção descreve como configurar o systemd para múltiplas instâncias do MySQL.

Nota

Como o systemd tem a capacidade de gerenciar múltiplas instâncias do MySQL em plataformas para as quais o suporte do systemd está instalado, **mysqld_multi** e **mysqld_multi.server** são desnecessários e não são instalados.

Para usar a capacidade de múltiplas instâncias, modifique o arquivo de opção `my.cnf` para incluir a configuração das opções-chave para cada instância. Esses locais de arquivo são típicos:

* `/etc/my.cnf` ou `/etc/mysql/my.cnf` (plataformas RPM)

* `/etc/mysql/mysql.conf.d/mysqld.cnf` (plataformas Debian)

Por exemplo, para gerenciar duas instâncias chamadas `replica01` e `replica02`, adicione algo como este ao arquivo de opções:

Plataformas RPM:

```
[mysqld@replica01]
datadir=/var/lib/mysql-replica01
socket=/var/lib/mysql-replica01/mysql.sock
port=3307
log-error=/var/log/mysqld-replica01.log

[mysqld@replica02]
datadir=/var/lib/mysql-replica02
socket=/var/lib/mysql-replica02/mysql.sock
port=3308
log-error=/var/log/mysqld-replica02.log
```

Plataformas Debian:

```
[mysqld@replica01]
datadir=/var/lib/mysql-replica01
socket=/var/lib/mysql-replica01/mysql.sock
port=3307
log-error=/var/log/mysql/replica01.log

[mysqld@replica02]
datadir=/var/lib/mysql-replica02
socket=/var/lib/mysql-replica02/mysql.sock
port=3308
log-error=/var/log/mysql/replica02.log
```

Os nomes das réplicas mostrados aqui usam `@` como delimitador, porque esse é o único delimitador suportado pelo systemd.

As instâncias são então gerenciadas por comandos normais do systemd, como:

```
systemctl start mysqld@replica01
systemctl start mysqld@replica02
```

Para permitir que as instâncias sejam executadas no momento do boot, faça o seguinte:

```
systemctl enable mysqld@replica01
systemctl enable mysqld@replica02
```

O uso de caracteres curinga também é suportado. Por exemplo, este comando exibe o status de todas as instâncias replicadas:

```
systemctl status 'mysqld@replica*'
```

Para a gestão de múltiplas instâncias do MySQL na mesma máquina, o systemd utiliza automaticamente um arquivo de unidade diferente:

* `mysqld@.service` em vez de `mysqld.service` (plataformas RPM)

* `mysql@.service` em vez de `mysql.service` (plataformas Debian)

No arquivo de unidade, `%I` e `%i` fazem referência ao parâmetro passado após o marcador `@` e são utilizados para gerenciar a instância específica. Para um comando como este:

```
systemctl start mysqld@replica01
```

O systemd inicia o servidor usando um comando como este:

```
mysqld --defaults-group-suffix=@%I ...
```

O resultado é que os grupos de opções `[server]`, `[mysqld]` e `[mysqld@replica01]` são lidos e utilizados para essa instância do serviço.

Nota

Nas plataformas Debian, o AppArmor impede que o servidor leia ou escreva `/var/lib/mysql-replica*`, ou qualquer outra coisa que não seja as localizações padrão. Para resolver isso, você deve personalizar ou desativar o perfil em `/etc/apparmor.d/usr.sbin.mysqld`.

Nota

Nas plataformas Debian, os scripts de embalagem para a desinstalação do MySQL atualmente não podem lidar com instâncias do `mysqld@`. Antes de remover ou atualizar o pacote, você deve parar manualmente quaisquer instâncias extras primeiro.

#### Migrando do mysqld_safe para o systemd

Como o **mysqld_safe** não está instalado em plataformas que utilizam systemd para gerenciar o MySQL, as opções especificadas anteriormente para esse programa (por exemplo, em um grupo de opções `[mysqld_safe]` ou `[safe_mysqld]`) devem ser especificadas de outra maneira:

* Algumas opções do **mysqld_safe** também são compreendidas pelo **mysqld** e podem ser movidas do grupo de opções `[mysqld_safe]` ou `[safe_mysqld]` para o grupo `[mysqld]`. Isso *não* inclui `--pid-file`, `--open-files-limit` ou `--nice`. Para especificar essas opções, use o arquivo systemd `override.conf`, descrito anteriormente.

Nota

Em plataformas do systemd, o uso dos grupos de opções `[mysqld_safe]` e `[safe_mysqld]` não é suportado e pode levar a comportamentos inesperados.

* Para algumas opções do **mysqld_safe**, existem procedimentos alternativos do **mysqld**. Por exemplo, a opção do **mysqld_safe** para habilitar o registro do `syslog` é o `--syslog`, que é desatualizado. Para escrever a saída do log de erro no log do sistema, use as instruções na Seção 7.4.2.8, “Registro de Erros no Log do Sistema”.

* As opções do **mysqld_safe** que não são compreendidas pelo **mysqld** podem ser especificadas em `override.conf` ou em variáveis de ambiente. Por exemplo, com **mysqld_safe**, se o servidor deve usar uma biblioteca específica de alocação de memória, isso é especificado usando a opção `--malloc-lib`. Para instalações que gerenciam o servidor com systemd, organize-se para definir a variável de ambiente `LD_PRELOAD` em vez disso, conforme descrito anteriormente.