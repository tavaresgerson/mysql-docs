### 2.5.1 Instalar o MySQL no Linux usando o MySQL Yum Repository

O repositório \[MySQL Yum] ((<https://dev.mysql.com/downloads/repo/yum/>) para Oracle Linux, Red Hat Enterprise Linux, CentOS e Fedora fornece pacotes RPM para instalar o servidor MySQL, cliente, MySQL Workbench, Utilities MySQL, Roteador MySQL, MySQL Shell, Connector/ODBC, Connector/Python e assim por diante (nem todos os pacotes estão disponíveis para todas as distribuições; veja Instalar Produtos e Componentes MySQL Adicionais com Yum para detalhes).

#### Antes de começar

Como um software popular de código aberto, o MySQL, em sua forma original ou re-empacotado, é amplamente instalado em muitos sistemas de várias fontes, incluindo diferentes sites de download de software, repositórios de software e assim por diante. As instruções a seguir assumem que o MySQL não está já instalado em seu sistema usando um pacote RPM distribuído por terceiros; se esse não for o caso, siga as instruções dadas em Substituir uma Distribuição Nativa de Terceiros do MySQL.

::: info Note

Repository setup RPM nomes de arquivo começam com `mysql84`, que descreve a série MySQL que é ativada por padrão para a instalação. Neste caso, o subrepositório MySQL 8.4 LTS é ativado por padrão. Ele também contém outras versões de subrepositório, como o MySQL 8.0 e o MySQL Innovation Series, que são desativados por padrão.

:::

#### Passos para uma nova instalação do MySQL

Siga estas etapas para escolher e instalar os mais recentes produtos MySQL:

1. #### Adicionando o Repositório MySQL Yum

   Adicione o repositório MySQL Yum à lista de repositórios do seu sistema. Esta é tipicamente uma operação de uma só vez que é realizada pela instalação do RPM fornecido pelo MySQL. Siga estas etapas:

   1. Faça o download da página MySQL Yum Repository (<https://dev.mysql.com/downloads/repo/yum/>) na MySQL Developer Zone.
   2. Selecione e baixe o pacote de lançamento para sua plataforma.
   3. Instale o pacote de lançamento baixado. O formato do arquivo do pacote é:

      ```
      mysql84-community-release-{platform}-{version-number}.noarch.rpm
      ```

      - `mysql84`: Indica a versão do MySQL que está habilitada por padrão. Neste caso, o MySQL 8.4 está habilitado por padrão, e tanto o MySQL 8.0 quanto a série MySQL Innovation estão disponíveis, mas desativados por padrão.
      - `{platform}`: O código da plataforma, como `el7`, `el8`, `el9`, `fc41`, ou `fc42`. O '`el`' representa o Enterprise Linux, '`fc`' para o Fedora, e termina com o número de versão base da plataforma.
      - `{version-number}`: Versão do RPM de configuração do repositório MySQL, pois eles recebem atualizações ocasionais.

      Instale o RPM que você baixou para o seu sistema, por exemplo:

      ```
      $> sudo yum localinstall mysql84-community-release-{platform}-{version-number}.noarch.rpm
      ```

      O comando de instalação adiciona o repositório MySQL Yum à lista de repositórios do seu sistema e descarrega a chave GnuPG para verificar a integridade dos pacotes de software.

      Você pode verificar se o repositório MySQL Yum foi adicionado e ativado com sucesso pelo seguinte comando (para sistemas habilitados para `dnf`, substitua `yum` no comando por `dnf`):

      ```
      $> yum repolist enabled | grep mysql.*-community
      ```

      Exemplo de saída:

      ```
      mysql-8.4-lts-community               MySQL 8.4 LTS Community Server
      mysql-tools-8.4-lts-community            MySQL Tools 8.4 LTS Community
      ```

      Métodos para escolher uma série de lançamento diferente, como a trilha de inovação (que hoje é 9.5) ou uma série anterior (como MySQL 8.0), são descritos abaixo.

::: info Note

Uma vez que o repositório MySQL Yum esteja habilitado em seu sistema, qualquer atualização em todo o sistema pelo comando \*\* yum update \*\* (ou \*\* dnf upgrade \*\* para sistemas habilitados para `dnf`) atualiza os pacotes MySQL em seu sistema e substitui quaisquer pacotes nativos de terceiros, se o Yum encontrar substituições para eles no repositório MySQL Yum; consulte a Seção 3.8, Upgrading MySQL with the MySQL Yum Repository, para uma discussão sobre alguns possíveis efeitos disso em seu sistema, consulte Upgrading the Shared Client Libraries.

:::

2. #### Selecionando uma série de lançamentos

   Ao usar o repositório MySQL Yum, a mais recente série de correção de bugs (atualmente MySQL 8.4) é selecionada para instalação por padrão.

   Dentro do repositório MySQL Yum, cada série de lançamento do MySQL Community Server é hospedada em um subrepositório diferente. O subrepositório para a última série LTS (atualmente MySQL 8.4) é habilitado por padrão, e os subrepositórios para todas as outras séries (por exemplo, MySQL 8.0 e a série MySQL Innovation) são desativados por padrão. Use este comando para ver todos os subrepositórios relacionados ao MySQL disponíveis (para sistemas habilitados para `dnf`, substitua `yum` no comando por `dnf`):

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

   Para instalar a versão mais recente de uma série específica que não seja a mais recente série LTS, desative o subrepositório de bugs para a mais recente série LTS e ative o subrepositório para a série específica antes de executar o comando de instalação. Se sua plataforma suportar o comando \*\* yum-config-manager \*\* ou \*\* dnf config-manager \*\*, você pode fazer isso emitindo os seguintes comandos para desativar o subrepositório para a série 8.4 e ativar o da série 8.0:

   ```
   $> sudo yum-config-manager --disable mysql-8.4-lts-community
   $> sudo yum-config-manager --enable  mysql80-community
   ```

   Para plataformas habilitadas para `dnf`:

   ```
   $> sudo dnf config-manager --disable mysql-8.4-lts-community
   $> sudo dnf config-manager --enable mysql80-community
   ```

   Em vez de usar os comandos do gerenciador de configuração, você pode editar manualmente o arquivo `/etc/yum.repos.d/mysql-community.repo` alternando a opção `enabled`. Por exemplo, uma entrada padrão típica para EL8:

   ```
   [mysql-8.4-lts-community]
   name=MySQL 8.4 LTS Community Server
   baseurl=http://repo.mysql.com/yum/mysql-8.4-community/el/8/$basearch/
   enabled=1
   gpgcheck=1
   gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql-2023
   ```

   Encontre a entrada para o subrepositório que você deseja configurar e edite a opção `enabled`. Especifique `enabled=0` para desativar um subrepositório ou `enabled=1` para habilitar um subrepositório. Por exemplo, para instalar a partir da faixa de inovação do MySQL, certifique-se de ter `enabled=0` para as entradas do subrepositório do MySQL 8.4 e ter `enabled=1` para as entradas de inovação:

   ```
   [mysql80-community]
   name=MySQL 8.0 Community Server
   baseurl=http://repo.mysql.com/yum/mysql-8.0-community/el/8/$basearch
   enabled=1
   gpgcheck=1
   gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql-2023
   ```

   Você só deve habilitar o subrepositório para uma série de lançamento a qualquer momento.

   Verifique se os subrepositórios corretos foram habilitados e desativados executando o seguinte comando e verificando sua saída (para sistemas habilitados para `dnf` , substitua `yum` no comando por `dnf`):

   ```
   $> yum repolist enabled | grep mysql
   ```
3. #### Desativar o módulo padrão do MySQL

   Para desativar o módulo incluído e tornar os pacotes do repositório MySQL visíveis, use o seguinte comando (para sistemas habilitados para `dnf`, substitua `yum` no comando por `dnf`):

   ```
   $> sudo yum module disable mysql
   ```
4. #### Instalação do MySQL

   Instale o MySQL pelo seguinte comando (para sistemas habilitados para `dnf`, substitua `yum` no comando por `dnf`):

   ```
   $> sudo yum install mysql-community-server
   ```

   Isso instala o pacote para o servidor MySQL (`mysql-community-server`) e também pacotes para os componentes necessários para executar o servidor, incluindo pacotes para o cliente (`mysql-community-client`), as mensagens de erro comuns e conjuntos de caracteres para cliente e servidor (`mysql-community-common`), e as bibliotecas de clientes compartilhados (`mysql-community-libs`).
5. #### Iniciar o servidor MySQL

   Inicie o servidor MySQL com o seguinte comando:

   ```
   $> systemctl start mysqld
   ```

   Pode verificar o estado do servidor MySQL com o seguinte comando:

   ```
   $> systemctl status mysqld
   ```

Se o sistema operacional estiver habilitado, os comandos padrão `systemctl` (ou, alternativamente, `service` com os argumentos invertidos) como `stop`, `start`, `status`, e `restart` devem ser usados para gerenciar o serviço de servidor MySQL. O serviço `mysqld` está habilitado por padrão, e ele começa na reinicialização do sistema.

Na inicialização inicial do servidor, acontece o seguinte, dado que o diretório de dados do servidor está vazio:

- O servidor está iniciado.
- O certificado SSL e os arquivos de chave são gerados no diretório de dados.
- `validate_password` está instalado e ativado.
- Uma conta de superusuário `'root'@'localhost` é criada. Uma senha para o superusuário é definida e armazenada no arquivo de registro de erros. Para revelá-la, use o seguinte comando:

  ```
  $> sudo grep 'temporary password' /var/log/mysqld.log
  ```

  Altere a senha principal o mais rápido possível, fazendo login com a senha temporária gerada e defina uma senha personalizada para a conta de superusuário:

  ```
  $> mysql -uroot -p
  ```

  ```
  mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass4!';
  ```

  ::: info Note

  A política de senha padrão implementada por PH exige que as senhas contenham pelo menos uma letra maiúscula, uma letra minúscula, um dígito e um caractere especial, e que o comprimento total da senha seja de pelo menos 8 caracteres.

  :::

Para mais informações sobre os procedimentos pós-instalação, ver secção 2.9, "Configuração e ensaio pós-instalação".

::: info Note

*Informações de compatibilidade para plataformas baseadas em EL7:* Os seguintes pacotes RPM dos repositórios de software nativos das plataformas são incompatíveis com o pacote do repositório MySQL Yum que instala o servidor MySQL. Uma vez instalado o MySQL usando o repositório MySQL Yum, você não pode instalar esses pacotes (e vice-versa).

- `akonadi-mysql`

:::

#### Instalar produtos e componentes MySQL adicionais com o Yum

Você pode usar o Yum para instalar e gerenciar componentes individuais do MySQL. Alguns desses componentes são hospedados em sub-repositórios do repositório MySQL Yum: por exemplo, os Conectores MySQL são encontrados no sub-repositório MySQL Connectors Community, e o MySQL Workbench na Comunidade de Ferramentas MySQL. Você pode usar o seguinte comando para listar os pacotes para todos os componentes do MySQL disponíveis para sua plataforma a partir do repositório MySQL Yum (para sistemas habilitados para `dnf`), substitua `yum` no comando com `dnf`):

```
$> sudo yum --disablerepo=* --enablerepo='mysql*-community*' list available
```

Instale qualquer pacote de sua escolha com o seguinte comando, substituindo `package-name` pelo nome do pacote (para sistemas habilitados para `dnf` substituir `yum` no comando por `dnf`):

```
$> sudo yum install package-name
```

Por exemplo, para instalar o MySQL Workbench no Fedora:

```
$> sudo dnf install mysql-workbench-community
```

Para instalar as bibliotecas de clientes compartilhados (para sistemas habilitados para `dnf`, substitua `yum` no comando por `dnf`):

```
$> sudo yum install mysql-community-libs
```

#### Notas específicas da plataforma

Apoio ARM

O ARM de 64 bits (`aarch64`) é suportado no Oracle Linux 7 e requer o Oracle Linux 7 Software Collections Repository (`ol7_software_collections`).

```
$> yum-config-manager --enable ol7_software_collections
$> yum install mysql-community-server
```

#### Atualizar o MySQL com o Yum

Além da instalação, você também pode executar atualizações para produtos e componentes do MySQL usando o repositório MySQL Yum. Veja a Seção 3.8, "Atualizar o MySQL com o Repositório MySQL Yum" para detalhes.

#### Substituição de uma distribuição nativa de terceiros do MySQL

Se você instalou uma distribuição de terceiros do MySQL a partir de um repositório de software nativo (ou seja, um repositório de software fornecido por sua própria distribuição Linux), siga estas etapas:

1. #### Fazer backup de sua base de dados

   Para evitar a perda de dados, faça sempre um backup de seu banco de dados antes de tentar substituir sua instalação do MySQL usando o repositório MySQL Yum. Veja o Capítulo 9, \* Backup e Recuperação\*, sobre como fazer o backup de seu banco de dados.
2. #### Adicionando o Repositório MySQL Yum

   Adicione o repositório MySQL Yum à lista de repositórios do seu sistema seguindo as instruções dadas em Adicionar o repositório MySQL Yum.
3. #### Substituir a distribuição nativa de terceiros por uma atualização Yum ou uma atualização DNF

   Por design, o repositório MySQL Yum substitui seu MySQL nativo, de terceiros, com a versão mais recente de correção de bugs do repositório MySQL Yum quando você executa um comando `yum update` (ou `dnf upgrade` para sistemas habilitados para `dnf`) no sistema, ou um `yum update mysql-server` (ou `dnf upgrade mysql-server` para sistemas habilitados para `dnf`).

Após a atualização do MySQL usando o repositório Yum, os aplicativos compilados com versões mais antigas das bibliotecas de clientes compartilhados devem continuar a funcionar. No entanto, \* se você quiser recompilar aplicativos e vinculá-los dinamicamente com as bibliotecas atualizadas, consulte Atualizar as bibliotecas de clientes compartilhados, para algumas considerações especiais.

::: info Note

*Para as plataformas baseadas no EL7:* Ver Informações sobre a compatibilidade para as plataformas baseadas no EL7.

:::
