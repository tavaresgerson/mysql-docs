### 2.5.1 Instalando o MySQL no Linux Usando o Repositório Yum do MySQL

O [repositório Yum do MySQL](https://dev.mysql.com/downloads/repo/yum/) para o Oracle Linux, Red Hat Enterprise Linux, CentOS e Fedora fornece pacotes RPM para instalar o servidor MySQL, o cliente, o MySQL Workbench, os Utilitários MySQL, o MySQL Router, o MySQL Shell, o Connector/ODBC, o Connector/Python e assim por diante (nem todos os pacotes estão disponíveis para todas as distribuições; consulte Instalar Produtos e Componentes Adicionais do MySQL com o Yum para detalhes).

#### Antes de Começar

Como um software popular de código aberto, o MySQL, na sua forma original ou reembalada, é amplamente instalado em muitos sistemas de várias fontes, incluindo diferentes sites de download de software, repositórios de software e assim por diante. As instruções seguintes assumem que o MySQL não está já instalado no seu sistema usando um pacote RPM distribuído por terceiros; se não for o caso, siga as instruções fornecidas em Substituindo uma Distribuição Terceira Native do MySQL.

::: info Nota

Os nomes dos arquivos de pacote RPM da configuração do repositório começam com `mysql84`, que descreve a série MySQL que é habilitada por padrão para instalação. Neste caso, a subrepositória MySQL 8.4 LTS é habilitada por padrão. Ela também contém outras versões de subrepositórios, como MySQL 8.0 e a Série de Inovação MySQL, que são desabilitadas por padrão.

:::

#### Passos para uma Instalação Nova do MySQL

Siga estes passos para escolher e instalar os produtos MySQL mais recentes:

1. #### Adicionando o Repositório Yum do MySQL

Adicione o repositório Yum do MySQL à lista de repositórios do seu sistema. Isso é tipicamente uma operação única que é realizada instalando o pacote RPM fornecido pelo MySQL. Siga estes passos:

1. **Baixe-o da página do Repositório Yum do MySQL** (<https://dev.mysql.com/downloads/repo/yum/>) na Zona de Desenvolvimento do MySQL.
2. **Selecione e baixe o pacote de lançamento para sua plataforma.**
3. **Instale o pacote de lançamento baixado.** O formato do arquivo do pacote é:

	```
	mysql84-community-release-{platform}-{version-number}.noarch.rpm
	```

* *`mysql84`*: Indica a versão do MySQL que está habilitada por padrão. Neste caso, o MySQL 8.4 está habilitado por padrão, e tanto o MySQL 8.0 quanto a série de inovação do MySQL estão disponíveis, mas desabilitadas por padrão.
* *`{platform}`*: O código da plataforma, como `el7`, `el8`, `el9`, `fc41` ou `fc42`. O `'`el'` representa o Enterprise Linux, `'`fc'` para o Fedora, e termina com o número da versão base da plataforma.
* *`{version-number}`*: Versão da configuração do repositório do MySQL RPM, pois eles recebem atualizações ocasionais.

	Instale o RPM que você baixou para o seu sistema, por exemplo:

	```bash
	$> sudo yum localinstall mysql84-community-release-{platform}-{version-number}.noarch.rpm
	```

	O comando de instalação adiciona o repositório Yum do MySQL à lista de repositórios do seu sistema e baixa a chave GnuPG para verificar a integridade dos pacotes de software. Veja a Seção 2.1.4.2, “Verificação de Assinatura Usando GnuPG” para detalhes sobre a verificação de chave GnuPG.

	Você pode verificar se o repositório Yum do MySQL foi adicionado e habilitado com sucesso pelo seguinte comando (para sistemas com `dnf` habilitado, substitua `yum` no comando por `dnf`):

	```
	$> yum repolist enabled | grep mysql.*-community
	```

	Exemplo de saída:

	```
	mysql-8.4-lts-community               MySQL 8.4 LTS Community Server
	mysql-tools-8.4-lts-community            MySQL Tools 8.4 LTS Community
	```

	Isso também demonstra que a versão mais recente do MySQL LTS está habilitada por padrão. Os métodos para escolher uma série de lançamento diferente, como a trilha de inovação (que hoje é 9.5) ou uma série anterior (como o MySQL 8.0), são descritos abaixo.
  
	::: info Nota

	Uma vez que o repositório Yum do MySQL é habilitado no seu sistema, qualquer atualização em nível de sistema pelo comando **yum update** (ou **dnf upgrade** para sistemas com `dnf` habilitado) atualiza os pacotes do MySQL no seu sistema e substitui quaisquer pacotes de terceiros nativos, se o Yum encontrar substitutos para eles no repositório Yum do MySQL; veja a Seção 3.8, “Atualizando o MySQL com o Repositório Yum do MySQL”, para uma discussão sobre alguns efeitos possíveis disso no seu sistema, veja Atualizando as Bibliotecas de Cliente Compartilhadas.
	
	:::

2. #### Selecionando uma Série de Lançamento

	Ao usar o repositório MySQL Yum, a série de correções de bugs mais recente (atualmente MySQL 8.4) é selecionada para instalação por padrão. Se isso é o que você deseja, você pode pular para o próximo passo, Instalar o MySQL.

	Dentro do repositório MySQL Yum, cada série de lançamentos do MySQL Community Server é hospedada em um subrepositório diferente. O subrepositório para a série LTS mais recente (atualmente MySQL 8.4) é ativado por padrão, e os subrepositórios para todas as outras séries (por exemplo, MySQL 8.0 e a série MySQL Innovation) são desativados por padrão. Use este comando para ver todos os subrepositórios relacionados ao MySQL disponíveis (para sistemas habilitados para `dnf`, substitua `yum` no comando por `dnf`):

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

	Para instalar o lançamento mais recente de uma série específica diferente da série LTS mais recente, desative o subrepositório de bugs para a série LTS mais recente e ative o subrepositório para a série específica antes de executar o comando de instalação. Se sua plataforma suportar o comando **yum-config-manager** ou **dnf config-manager**, você pode fazer isso emitindo os seguintes comandos para desativar o subrepositório para a série 8.4 e ativar o para a série 8.0:

	```
	$> sudo yum-config-manager --disable mysql-8.4-lts-community
	$> sudo yum-config-manager --enable  mysql80-community
	```

	Para plataformas habilitadas para `dnf`:

	```
	$> sudo dnf config-manager --disable mysql-8.4-lts-community
	$> sudo dnf config-manager --enable mysql80-community
	```

	Em vez de usar os comandos config-manager, você pode editar manualmente o arquivo `/etc/yum.repos.d/mysql-community.repo`, alternando a opção `enabled`. Por exemplo, uma entrada padrão típica para EL8:

	```
	[mysql-8.4-lts-community]
	name=MySQL 8.4 LTS Community Server
	baseurl=http://repo.mysql.com/yum/mysql-8.4-community/el/8/$basearch/
	enabled=1
	gpgcheck=1
	gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql-2023
	```

	Encontre a entrada para o subrepositório que você deseja configurar e edite a opção `enabled`. Especifique `enabled=0` para desativar um subrepositório ou `enabled=1` para ativar um subrepositório. Por exemplo, para instalar a partir da trilha de inovação do MySQL, certifique-se de ter `enabled=0` para as entradas de subrepositório 8.4 e ter `enabled=1` para as entradas de inovação:

	```
	[mysql80-community]
	name=MySQL 8.0 Community Server
	baseurl=http://repo.mysql.com/yum/mysql-8.0-community/el/8/$basearch
	enabled=1
	gpgcheck=1
	gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql-2023
	```

	Você só deve habilitar subrepositórios para uma série de lançamento de cada vez.

Verifique se os subrepositórios corretos foram habilitados e desabilitados executando o seguinte comando e verificando sua saída (para sistemas habilitados para `dnf`, substitua `yum` no comando por `dnf`):

	```
	$> yum repolist enabled | grep mysql
	```

3. #### Desabilitando o Módulo Padrão do MySQL

	(`EL8` sistemas apenas) Sistemas baseados em EL8, como RHEL8 e Oracle Linux 8, incluem um módulo MySQL que está habilitado por padrão. A menos que este módulo seja desabilitado, ele mascara pacotes fornecidos pelos repositórios do MySQL. Para desabilitar o módulo incluído e tornar os pacotes do repositório do MySQL visíveis, use o seguinte comando (para sistemas habilitados para `dnf`, substitua `yum` no comando por `dnf`):

	```
	$> sudo yum module disable mysql
	```

4. #### Instalando o MySQL

	Instale o MySQL pelo seguinte comando (para sistemas habilitados para `dnf`, substitua `yum` no comando por `dnf`):

	```
	$> sudo yum install mysql-community-server
	```

	Isso instala o pacote para o servidor MySQL (`mysql-community-server`) e também pacotes para os componentes necessários para executar o servidor, incluindo pacotes para o cliente (`mysql-community-client`), os mensagens de erro comuns e os conjuntos de caracteres para cliente e servidor (`mysql-community-common`) e as bibliotecas de cliente compartilhadas (`mysql-community-libs`).

5. #### Iniciando o Servidor MySQL

	Inicie o servidor MySQL com o seguinte comando:

	```
	$> systemctl start mysqld
	```

	Você pode verificar o status do servidor MySQL com o seguinte comando:

	```bash
	$> systemctl status mysqld
	```

	Se o sistema operacional estiver habilitado para systemd, os comandos padrão `systemctl` (ou, alternativamente, `service` com os argumentos invertidos) como `stop`, `start`, `status` e `restart` devem ser usados para gerenciar o serviço do servidor MySQL. O serviço `mysqld` está habilitado por padrão e inicia ao reiniciar o sistema.
	
	No início da inicialização do servidor, o seguinte acontece, dado que o diretório de dados do servidor está vazio:

* O servidor é inicializado.
* Os arquivos de certificado SSL e chave são gerados no diretório de dados.
* O `validate_password` é instalado e habilitado.
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

  ::: info Nota

  O `validate_password` é instalado por padrão. A política de senha padrão implementada pelo `validate_password` exige que as senhas contenham pelo menos uma letra maiúscula, uma letra minúscula, um dígito e um caractere especial, e que o comprimento total da senha seja de pelo menos 8 caracteres.

  :::

Para obter mais informações sobre os procedimentos pós-instalação, consulte a Seção 2.9, “Configuração e Teste Pós-Instalação”.

::: info Nota

*Informações de Compatibilidade para Plataformas Baseadas em EL7:* Os seguintes pacotes RPM dos repositórios de software nativo das plataformas são incompatíveis com o pacote do repositório Yum de MySQL que instala o servidor MySQL. Uma vez que você tenha instalado o MySQL usando o repositório Yum de MySQL, não poderá instalar esses pacotes (e vice-versa).

* `akonadi-mysql`

#### Instalando Produtos e Componentes Adicionais do MySQL com Yum

Você pode usar o Yum para instalar e gerenciar componentes individuais do MySQL. Alguns desses componentes estão hospedados em sub-repositórios do repositório Yum de MySQL: por exemplo, os Conectadores MySQL estão disponíveis no sub-repositório MySQL Connectors Community, e o MySQL Workbench no MySQL Tools Community. Você pode usar o seguinte comando para listar os pacotes para todos os componentes MySQL disponíveis para sua plataforma do repositório Yum de MySQL (para sistemas habilitados para `dnf`, substitua `yum` no comando por `dnf`):

```
$> sudo yum --disablerepo=* --enablerepo='mysql*-community*' list available
```

Instale os pacotes de sua escolha com o seguinte comando, substituindo `nome-do-pacote` pelo nome do pacote (para sistemas com suporte a `dnf`, substitua `yum` no comando por `dnf`):

```
$> sudo yum install package-name
```

Por exemplo, para instalar o MySQL Workbench no Fedora:

```
$> sudo dnf install mysql-workbench-community
```

Para instalar as bibliotecas de cliente compartilhadas (para sistemas com suporte a `dnf`, substitua `yum` por `dnf` no comando):

```
$> sudo yum install mysql-community-libs
```

#### Atualizando o MySQL com o Yum

Além da instalação, você também pode realizar atualizações para produtos e componentes do MySQL usando o repositório MySQL Yum. Veja a Seção 3.8, *Atualizando o MySQL com o Repositório MySQL Yum*, para detalhes.

#### Substituindo uma Distribuição Terceira Native do MySQL

Se você instalou uma distribuição terceirizada do MySQL de um repositório de software nativo (ou seja, um repositório de software fornecido pela sua própria distribuição Linux), siga estes passos:

1. #### Fazendo Backup do Seu Banco de Dados

   Para evitar a perda de dados, sempre faça backup do seu banco de dados antes de tentar substituir sua instalação do MySQL usando o repositório MySQL Yum. Veja o Capítulo 9, *Backup e Recuperação*, sobre como fazer backup do seu banco de dados.
2. #### Adicionando o Repositório MySQL Yum

   Adicione o repositório MySQL Yum à lista de repositórios do seu sistema seguindo as instruções dadas em Adicionando o Repositório MySQL Yum.
3. #### Substituindo a Distribuição Terceira Native pelo MySQL com uma Atualização do Yum ou uma Atualização do DNF

   Por design, o repositório MySQL Yum substitui sua MySQL nativa e terceirizada pelo último lançamento de correção de bugs do repositório MySQL Yum quando você executa um comando `yum update` (ou `dnf upgrade` para sistemas habilitados para `dnf`) no sistema, ou um `yum update mysql-server` (ou `dnf upgrade mysql-server` para sistemas habilitados para `dnf`).

Após atualizar o MySQL usando o repositório Yum, as aplicações compiladas com versões mais antigas das bibliotecas cliente compartilhadas devem continuar funcionando. No entanto, *se você quiser recompilar as aplicações e vinculá-las dinamicamente às bibliotecas atualizadas*, consulte Atualizando as Bibliotecas Cliente Compartilhadas, para algumas considerações especiais.

::: info Nota

*Para plataformas baseadas no EL7:* Consulte Informações de Compatibilidade para plataformas baseadas no EL7.

:::