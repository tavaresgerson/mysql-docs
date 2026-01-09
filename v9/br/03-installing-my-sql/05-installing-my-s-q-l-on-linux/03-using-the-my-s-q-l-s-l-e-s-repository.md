### 2.5.3 Usando o Repositório MySQL SLES

O repositório MySQL SLES fornece pacotes RPM para instalar e gerenciar o servidor MySQL, o cliente e outros componentes no SUSE Enterprise Linux Server. Esta seção contém informações sobre como obter e instalar esses pacotes.

#### Adicionando o Repositório MySQL SLES

Adicione ou atualize o repositório oficial MySQL SLES na lista de repositórios do seu sistema:

**Observação**

A parte inicial do nome do arquivo de configuração, como `mysql84`, descreve a série MySQL padrão que está habilitada para instalação. Neste caso, o subrepositório para o MySQL 8.4 LTS está habilitado por padrão. Ele também contém outras versões de subrepositórios, como o MySQL 8.0 e a série de inovação do MySQL. O MySQL 9.5 é o lançamento de inovação atual.

##### Instalação de um Novo Repositório MySQL

Se o repositório MySQL ainda não estiver presente no sistema, então:

1. Vá para a página de download do repositório MySQL SLES em <https://dev.mysql.com/downloads/repo/suse/>.

2. Selecione e baixe o pacote de lançamento para a versão do SLES.
3. Instale o pacote de lançamento baixado com o seguinte comando, substituindo *`package-name`* pelo nome do pacote baixado:

   ```
   $> sudo rpm -Uvh package-name.rpm
   ```

   Por exemplo, para instalar o pacote do SLES 15, onde *`#`* indica o número de lançamento dentro de uma versão como `15-1`:

   ```
   $> sudo rpm -Uvh mysql84-community-release-sl15-#.noarch.rpm
   ```

##### Atualizar uma Instalação de Repositório MySQL Existente

Se uma versão mais antiga já estiver presente, atualize-a:

* ``` $> sudo zypper update mysql84-community-release
  ```
* Embora isso não seja necessário para cada lançamento do MySQL, ele atualiza as informações do repositório do MySQL para incluir as informações atuais. Por exemplo,
  `mysql84-community-release-sl15-7.noarch.rpm`
  é o primeiro arquivo de configuração do repositório SUSE 15 que adiciona
  a trilha de lançamento de inovação que começa com MySQL 8.1.
  series.

#### Selecionando uma Série de Lançamento

Dentro do repositório SLES do MySQL, diferentes séries de lançamento do
MySQL Community Server são hospedadas em subrepositórios diferentes.
O subrepositório para a série de correções de bugs mais recente (atualmente MySQL
8.4) está habilitado por padrão, e os
subrepositórios para todas as outras séries estão desabilitados. Use este
comando para ver todos os subrepositórios no repositório SLES do MySQL e para ver quais deles estão habilitados ou desabilitados:

```
$> zypper repos | grep mysql.*community
```

A trilha de inovação está disponível para SLES 15 com entradas como
`mysql-innovation-community`.

Para instalar o lançamento mais recente de uma série específica, antes
de executar o comando de instalação, certifique-se de que o subrepositório
para a série que você deseja está habilitado e os subrepositórios para
outras séries estão desabilitados. Por exemplo, em SLES 15, para desabilitar os
subrepositórios para o servidor e ferramentas MySQL 8.4, que estão habilitados por padrão, use o seguinte:

```
$> sudo zypper modifyrepo -d mysql-8.4-lts-community $> sudo zypper modifyrepo -d mysql-tools-community
```

Em seguida, habilite os subrepositórios para a série de lançamento que você deseja.
Por exemplo, para habilitar a trilha de inovação em SLES 15 que instala o MySQL 9.5:

```
$> sudo zypper modifyrepo -e mysql-innovation-community $> sudo zypper modifyrepo -e mysql-tools-innovation-community
```

Você só deve habilitar um subrepositório para uma série de lançamento de cada vez.

Verifique se os subrepositórios corretos foram habilitados executando o seguinte comando e verificando sua saída:

```
$> zypper repos -E | grep mysql.*community

 7 | mysql-connectors-community       | MySQL Connectors Community                  | Yes     | (r ) Yes  | No 10 | mysql-innovation-community       | MySQL Innovation Release Community Server   | Yes     | (r ) Yes  | No 16 | mysql-tools-innovation-community | MySQL Tools Innovation Community            | Yes     | ( p) Yes  | No
```

Depois disso, use o seguinte comando para atualizar as informações do repositório para o subrepositório habilitado:

```
$> sudo zypper refresh
```

#### Instalando o MySQL com o Zypper

Com o repositório oficial do MySQL habilitado, instale o MySQL Server:

```
$> sudo zypper install mysql-community-server
```

Isso instala o pacote para o servidor MySQL, bem como outros
paquetes necessários.

#### Iniciando o Servidor MySQL

Inicie o servidor MySQL com o seguinte comando:

```
$> systemctl start mysql
```

Você pode verificar o status do servidor MySQL com o seguinte
comando:

```
$> systemctl status mysql
```

Se o sistema operacional estiver habilitado para systemd, os comandos padrão
**systemctl** (ou, como alternativa,
**service** com os argumentos invertidos)
como **stop**, **start**,
**status** e **restart** devem
ser usados para gerenciar o serviço do servidor MySQL. O
serviço `mysql` está habilitado por padrão e inicia ao reiniciar o sistema. Veja a Seção 2.5.9, “Gerenciando o Servidor MySQL com systemd” para
informações adicionais.

*Inicialização do Servidor MySQL:* Quando o servidor é iniciado pela primeira vez, o servidor é inicializado e o
que acontece (se o diretório de dados do servidor estiver vazio
quando o processo de inicialização começar):

* Os arquivos de certificado SSL e chave são gerados no diretório de dados.
* O plugin [validate_password
  plugin](validate-password.html "8.4.4 O Componente de Validação de Senha") é instalado e habilitado.
* Uma conta de superusuário `'root'@'localhost'` é
  criada. Uma senha para o superusuário é definida e armazenada no
  arquivo de log de erro. Para revelá-la, use o seguinte comando:

  ```
  $> sudo grep 'temporary password' /var/log/mysql/mysqld.log
  ```

  Altere a senha do root o mais rápido possível, iniciando sessão com a senha
  gerada e temporária e definindo uma senha personalizada para a conta de
  superusuário:

  ```
  $> mysql -uroot -p
  ```

  ```
  mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass4!';
  ```

Nota

O plugin `validate_password` do MySQL é instalado por padrão. Isso exigirá que as senhas contenham pelo menos uma letra maiúscula, uma letra minúscula, um dígito e um caractere especial, e que o comprimento total da senha seja de pelo menos 8 caracteres.

Você pode parar o servidor MySQL com o seguinte comando:

```
$> sudo systemctl stop mysql
```

#### Instalando Produtos e Componentes Adicionais do MySQL

Você pode instalar mais componentes do MySQL. Liste os subrepositórios no repositório SLES do MySQL com o seguinte comando:

```
$> zypper repos | grep mysql.*community
```

Use o seguinte comando para listar os pacotes para os componentes do MySQL disponíveis para um determinado subrepositório, alterando *`subrepo-name`* pelo nome do
subrepositório que você está interessado:

```
$> zypper packages subrepo-name
```

Instale os pacotes de sua escolha com o seguinte comando, substituindo *`package-name`* pelo nome do
pacote (você pode precisar habilitar primeiro o subrepositório para o pacote, usando o mesmo método para selecionar um subrepositório para uma série de lançamentos específica, conforme descrito em Selecionando uma Série de Lançamentos):

```
$> sudo zypper install package-name
```

Por exemplo, para instalar a suíte de benchmarks do MySQL a partir do subrepositório para a série de lançamentos que você já habilitou:

```
$> sudo zypper install mysql-community-bench
```

#### Atualizando o MySQL com o Repositório SLES do MySQL

Observação

* Antes de realizar qualquer atualização no MySQL, siga cuidadosamente as instruções no Capítulo 3, *Atualizando o MySQL*. Entre outras instruções discutidas lá, é especialmente importante fazer backup de sua base de dados antes da atualização.

Use o repositório MySQL SLES para realizar uma atualização local (ou seja, substituir a versão antiga do servidor e, em seguida, executar a nova versão usando os arquivos de dados antigos) para sua instalação do MySQL seguindo estes passos (eles assumem que você instalou o MySQL com o repositório MySQL SLES; se não for esse o caso, siga as instruções em
Substituindo o MySQL instalado por um RPM de outras fontes):

1. ##### Selecionando uma Série de Alvo

   Durante uma operação de atualização, por padrão, o repositório MySQL SLES atualiza o MySQL para a versão mais recente na série de lançamento que você escolheu durante a instalação (consulte
   Selecionando uma Série de Lançamento
   para detalhes), o que significa. Por exemplo, uma instalação de série LTS, como 8.4,
   *não* será atualizada para uma série de inovação,
   como 9.5. Para atualizar para outra
   série de lançamento, você precisa primeiro desabilitar o subrepositório
   para a série que foi selecionada (por padrão, ou por
   você mesmo) e habilitar o subrepositório para sua série de
   alvo. Para fazer isso, siga as instruções gerais dadas em
   Selecionando uma Série de Lançamento.

   Como regra geral, para atualizar de uma série de lançamento para
   outra, vá para a próxima série em vez de pular uma
   série.

   Importante

   A atualização local do MySQL não é suportada pelo repositório MySQL SLES. Siga as instruções em
   Capítulo 4, *Atualizando o MySQL*.
2. ##### Atualizando o MySQL

   Atualize o MySQL e seus componentes pelo seguinte comando:

   ```
   $> sudo zypper update mysql-community-server
   ```

   Alternativamente, você pode atualizar o MySQL dizendo ao Zypper para
   atualizar tudo no seu sistema (isso pode levar
   consideravelmente mais tempo):

   ```
   $> sudo zypper update
   ```

   Você também pode atualizar apenas um componente específico. Use o seguinte
   comando para listar todos os pacotes instalados do repositório MySQL SLES:

```
$> zypper packages -i | grep mysql-.*community
```

Após identificar o nome do pacote do componente da sua
escolha, atualize o pacote com o seguinte comando, substituindo
*`package-name`* pelo nome do pacote:

```
$> sudo zypper update package-name
```

#### Substituindo o MySQL Instalado por um RPM de Outras Fontes

RPMs para instalar o MySQL Community Server e seus componentes
podem ser baixados do MySQL, seja a partir da
[MySQL Developer Zone](https://dev.mysql.com/downloads/),
do repositório de software nativo do SLES, ou do repositório do SLES do MySQL. Os RPMs dessas fontes podem ser diferentes e podem instalar e configurar o MySQL de maneiras diferentes.

Se você instalou o MySQL com RPMs da MySQL Developer Zone ou do repositório de software nativo do SLES e deseja substituir a instalação usando o RPM do repositório do SLES do MySQL, siga estes passos:

1. Faça backup de sua base de dados para evitar perda de dados. Veja
   Capítulo 9, *Backup e Recuperação* sobre como fazer isso.
2. Parar o seu MySQL Server, se estiver em execução. Se o servidor estiver
   em execução como serviço, você pode pará-lo com o seguinte
   comando:

   ```
   $> systemctl stop mysql
   ```
3. Siga os passos dados para
   Adicionar o Repositório do SLES do MySQL.
4. Siga os passos dados para
   Selecionar uma Série de Lançamento.
5. Siga os passos dados para
   Instalar o MySQL com o Zypper.
   Você será perguntado se deseja substituir os pacotes antigos
   pelos novos; por exemplo:

   ```
   Problem: mysql-community-server-5.6.22-2.sles11.x86_64 requires mysql-community-client = 5.6.22-2.sles11, but this requirement cannot be provided uninstallable providers: mysql-community-client-5.6.22-2.sles11.x86_64[mysql56-community] Solution 1: replacement of mysql-client-5.5.31-0.7.10.x86_64 with mysql-community-client-5.6.22-2.sles11.x86_64 Solution 2: do not install mysql-community-server-5.6.22-2.sles11.x86_64 Solution 3: break mysql-community-server-5.6.22-2.sles11.x86_64 by ignoring some of its dependencies

   Choose from above solutions by number or cancel [1/2/3/c] (c)
   ```

   Escolha a opção “substituição”
   (“Solução 1” no exemplo) para terminar sua
   instalação a partir do repositório do SLES do MySQL.

#### Instalando o MySQL NDB Cluster Usando o Repositório do SLES
```
$> sudo zypper modifyrepo -d mysql-8.4-lts-community
```ZxHMLxuP6a```
$> sudo zypper modifyrepo -e mysql-cluster-8.4-community
```aA7vD05iu2```
$> zypper repos -E | grep mysql.*community 10 | mysql-cluster-8.4-community | MySQL Cluster 8.4 Community | Yes     | No
```578vor93JY```
$> sudo zypper refresh
```SZZ6XF30sF```
  $> sudo zypper install mysql-cluster-community-server
  ```KQdJzK4iny```
  $> sudo zypper install mysql-cluster-community-management-server
  ```vpB6aqZ8cZ```
  $> sudo zypper install mysql-cluster-community-data-node
  ```KdY8I6kX8q```

Para instalar mais componentes do NDB Cluster, consulte
Instalando Produtos e Componentes Adicionais do MySQL NDB Cluster.

Consulte a Seção 25.3.3, “Configuração Inicial do NDB Cluster” sobre
como configurar o MySQL NDB Cluster e
a Seção 25.3.4, “Inicialização Inicial do NDB Cluster” sobre
como iniciá-lo pela primeira vez.

#### Instalando Produtos e Componentes Adicionais do MySQL NDB Cluster

Você pode usar o Zypper para instalar componentes individuais e produtos adicionais do MySQL NDB Cluster a partir do repositório SLES do MySQL. Para fazer isso, assumindo que você já tem o repositório SLES do MySQL na lista de repositórios do seu sistema (se não, siga os Passos 1 e 2 de
Instalando o MySQL NDB Cluster Usando o Repositório SLES),
siga os mesmos passos descritos em
Instalando Produtos e Componentes Adicionais do MySQL NDB Cluster.

Nota

*Problema conhecido:* Atualmente, nem todos os
componentes necessários para executar a suíte de testes do MySQL NDB Cluster são
instalados automaticamente quando você instala o pacote de suíte de testes
(`mysql-cluster-community-test`).
Instale os seguintes pacotes com **zypper
install** antes de executar a suíte de testes:

* `mysql-cluster-community-auto-installer`
* `mysql-cluster-community-management-server`
* `mysql-cluster-community-data-node`
* `mysql-cluster-community-memcached`
* `mysql-cluster-community-java`
* `mysql-cluster-community-ndbclient-devel`