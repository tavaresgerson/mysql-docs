### 2.5.3 Usando o Repositório MySQL `SLES`

O repositório `SLES` do MySQL fornece `RPM` pacotes para instalar e gerenciar o servidor, cliente e outros componentes do MySQL no SUSE Enterprise Linux Server. Esta seção contém informações sobre como obter e instalar esses pacotes.

#### Adição do repositório MySQL `SLES`

Adicionar ou atualizar o repositório oficial MySQL `SLES` para a lista de repositórios do seu sistema:

::: info Note

A parte inicial do nome do arquivo de configuração, como `mysql84`, descreve a série padrão do MySQL que está habilitada para a instalação. Neste caso, o subrepositório para o MySQL 8.4 LTS está habilitado por padrão. Ele também contém outras versões de subrepositório, como o MySQL 8.0 e o MySQL Innovation Series.

:::

##### Instalação de novo repositório MySQL

Se o repositório MySQL ainda não estiver presente no sistema, então:

1. Vá para a página de download do repositório MySQL `SLES` em <https://dev.mysql.com/downloads/repo/suse/>.
2. Selecione e baixe o pacote de lançamento para a sua versão `SLES`.
3. Instale o pacote de lançamento baixado com o seguinte comando, substituindo `package-name` pelo nome do pacote baixado:

   ```
   $> sudo `rpM` -Uvh package-name `rpM`
   ```

   Por exemplo, para instalar o `SLES` 15 pacote onde `#` indica o número de versão dentro de uma versão como `15-1`:

   ```
   $> sudo `rpM` -Uvh mysql84-community-release-sl15-#.noarch `rpM`
   ```

##### Atualizar uma instalação de repositório MySQL existente

Se uma versão mais antiga já estiver presente, atualize-a:

- ```$> sudo \[\[PH\_CODE\_0]] atualização mysql84-community-release
  ```
  ```
  ```
- Embora isso não seja necessário para cada versão do MySQL, ele atualiza as informações do repositório do MySQL para incluir as informações atuais. Por exemplo, `mysql84-community-release-sl15-7.noarch `rpM\`\` é o primeiro arquivo de configuração do repositório do SUSE 15 que adiciona a faixa de lançamento de inovação que começa com a série MySQL 8.1.

#### Selecionando uma série de lançamentos

Dentro do repositório `SLES` do MySQL, diferentes séries de versões do MySQL Community Server são hospedadas em diferentes subrepositórios. O subrepositório para a mais recente série de correção de bugs (atualmente o MySQL 8.4) está habilitado por padrão, e os subrepositórios para todas as outras séries estão desativados. Use este comando para ver todos os subrepositórios no repositório `SLES` do MySQL e para ver quais deles estão habilitados ou desativados:

```
$> `zypper` repos | grep mysql.*community
```

A faixa de inovação está disponível para `SLES` 15 com entradas como `mysql-innovation-community`.

Para instalar a versão mais recente de uma série específica, antes de executar o comando de instalação, certifique-se de que o subrepositório para a série desejada está habilitado e os subrepositórios para outras séries estão desativados. Por exemplo, em `SLES` 15, para desativar os subrepositórios para o servidor e ferramentas MySQL 8.4, que estão habilitados por padrão, use o seguinte:

```
$> sudo `zypper` modifyrepo -d mysql-8.4-lts-community $> sudo `zypper` modifyrepo -d mysql-tools-community
```

Em seguida, habilite os subrepositórios para a série de lançamentos que você deseja. Por exemplo, para habilitar a faixa de Inovação em `SLES` 15:

```
$> sudo `zypper` modifyrepo -e mysql-innovation-community $> sudo `zypper` modifyrepo -e mysql-tools-innovation-community
```

Você só deve habilitar um subrepositório para uma série de liberação a qualquer momento.

Verifique se os subrepositórios corretos foram habilitados executando o seguinte comando e verificando sua saída:

```
$> `zypper` repos -E | grep mysql.*community

 7 | mysql-connectors-community       | MySQL Connectors Community                  | Yes     | (r ) Yes  | No 10 | mysql-innovation-community       | MySQL Innovation Release Community Server   | Yes     | (r ) Yes  | No 16 | mysql-tools-innovation-community | MySQL Tools Innovation Community            | Yes     | ( p) Yes  | No
```

Depois disso, use o seguinte comando para atualizar as informações do repositório para o subrepositório habilitado:

```
$> sudo `zypper` refresh
```

#### Instalar MySQL com `Zypper`

Com o repositório oficial MySQL ativado, instale o MySQL Server:

```
$> sudo `zypper` install mysql-community-server
```

Isso instala o pacote para o servidor MySQL, bem como outros pacotes necessários.

#### Iniciar o servidor MySQL

Inicie o servidor MySQL com o seguinte comando:

```
$> systemctl start mysql
```

Pode verificar o estado do servidor MySQL com o seguinte comando:

```
$> systemctl status mysql
```

Se o sistema operacional estiver habilitado, os comandos padrão `systemctl` (ou, alternativamente, `service` com os argumentos invertidos) como `stop`, `start`, `status`, e `restart` devem ser usados para gerenciar o serviço de servidor MySQL. O serviço `mysql` está habilitado por padrão, e ele começa na reinicialização do sistema.

- Inicialização do servidor MySQL:\* Quando o servidor é iniciado pela primeira vez, o servidor é inicializado e o seguinte acontece (se o diretório de dados do servidor estiver vazio quando o processo de inicialização começar):

- O certificado SSL e os ficheiros de chave são gerados no diretório de dados.
- O \[validate\_password\_plugin] (validate-password.html) está instalado e ativado.
- Uma conta de superusuário `'root'@'localhost'` é criada. Uma senha para o superusuário é definida e armazenada no arquivo de registro de erros. Para revelá-la, use o seguinte comando:

  ```
  $> sudo grep 'temporary password' /var/log/mysql/mysqld.log
  ```

  Altere a senha principal o mais rápido possível, fazendo login com a senha temporária gerada e defina uma senha personalizada para a conta de superusuário:

  ```
  $> mysql -uroot -p
  ```

  ```
  mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass4!';
  ```

::: info Note

O plugin `validate_password` do MySQL está instalado por padrão. Isso exigirá que as senhas contenham pelo menos uma letra maiúscula, uma letra minúscula, um dígito e um caractere especial, e que o comprimento total da senha seja de pelo menos 8 caracteres.

:::

Pode parar o servidor MySQL com o seguinte comando:

```
$> sudo systemctl stop mysql
```

#### Instalação de Produtos e Componentes MySQL Adicionais

Você pode instalar mais componentes do MySQL. Liste subrepositórios no repositório do MySQL `SLES` com o seguinte comando:

```
$> `zypper` repos | grep mysql.*community
```

Use o seguinte comando para listar os pacotes para os componentes do MySQL disponíveis para um determinado subrepositório, mudando `subrepo-name` para o nome do subrepositório que você está interessado em:

```
$> `zypper` packages subrepo-name
```

Instale qualquer pacote de sua escolha com o seguinte comando, substituindo `package-name` com o nome do pacote (você pode precisar ativar primeiro o subrepositório para o pacote, usando o mesmo método para selecionar um subrepositório para uma série de lançamento específico descrito em Selecionar uma série de lançamento):

```
$> sudo `zypper` install package-name
```

Por exemplo, para instalar o conjunto de benchmark MySQL a partir do subrepositório para a série de lançamentos que você já ativou:

```
$> sudo `zypper` install mysql-community-bench
```

#### Atualização do MySQL com o Repositório MySQL `SLES`

::: info
Note

- Antes de executar qualquer atualização para o MySQL, siga cuidadosamente as instruções no Capítulo 3, *Atualização do MySQL*. Entre outras instruções discutidas lá, é especialmente importante fazer backup do seu banco de dados antes da atualização.

:::

Use o repositório `SLES` do MySQL para realizar uma atualização no local (ou seja, substituindo a versão antiga do servidor e depois executando a nova versão usando os arquivos de dados antigos) para sua instalação do MySQL seguindo estas etapas (eles assumem que você instalou o MySQL com o repositório `SLES` do MySQL; se esse não for o caso, siga as instruções em Substituir o MySQL instalado por um `RPM` de outras fontes em vez disso):

1. ##### Seleção de uma série de alvo

   Durante uma operação de atualização, por padrão, o repositório `SLES` do MySQL atualiza o MySQL para a versão mais recente da série de lançamentos que você escolheu durante a instalação (veja Seleção de uma série de lançamentos para detalhes), o que significa. Por exemplo, uma instalação de uma série de correção de bugs, como 8.4, \* não \* atualizará para uma série de inovação, como 9.5. Para atualizar para outra série de lançamentos, você precisa primeiro desativar o subrepositório para a série que foi selecionada (por padrão ou por você mesmo) e ativar o subrepositório para sua série de destino. Para fazer isso, siga as instruções gerais dadas em Seleção de uma série de lançamentos.

   Como regra geral, para atualizar de uma série de lançamento para outra, vá para a próxima série em vez de pular uma série.

   Importância

   O repositório `SLES` do MySQL não suporta a degradação in-place do MySQL. Siga as instruções no Capítulo 4, *Downgrading MySQL*.
2. ##### Atualização do MySQL

   Atualizar o MySQL e seus componentes pelo seguinte comando:

   ```
   $> sudo `zypper` update mysql-community-server
   ```

   Alternativamente, você pode atualizar o MySQL dizendo a `Zypper` para atualizar tudo em seu sistema (isso pode levar consideravelmente mais tempo):

   ```
   $> sudo `zypper` update
   ```

Você também pode atualizar apenas um componente específico. Use o seguinte comando para listar todos os pacotes instalados do repositório MySQL:

```
$> `zypper` packages -i | grep mysql-.*community
```

Depois de identificar o nome do pacote do componente de sua escolha, atualize o pacote com o seguinte comando, substituindo `package-name` pelo nome do pacote:

```
$> sudo `zypper` update package-name
```

#### Substituição do MySQL instalado por um `RPM` de outras fontes

Os códigos PH para a instalação do MySQL Community Server e seus componentes podem ser baixados do MySQL, seja da MySQL Developer Zone, do repositório de software nativo do `SLES`, ou do repositório do MySQL `SLES`. Os códigos `RPM` dessas fontes podem ser diferentes, e eles podem instalar e configurar o MySQL de maneiras diferentes.

Se você instalou o MySQL com `RPM`s da MySQL Developer Zone ou o repositório de software nativo do `SLES` e deseja substituir a instalação usando o `RPM` do repositório do MySQL `SLES`, siga estas etapas:

1. Para evitar a perda de dados, faça cópias de segurança da sua base de dados.
2. Pare o seu servidor MySQL, se estiver em execução. Se o servidor estiver em execução como um serviço, você pode pará-lo com o seguinte comando:

   ```
   $> systemctl stop mysql
   ```
3. Siga as etapas dadas para Adicionar o Repositório MySQL `SLES`.
4. Siga os passos indicados para Selecionar uma Série de Lançamento.
5. Siga as etapas dadas para Instalar MySQL com `Zypper`. Será-lhe perguntado se deseja substituir os pacotes antigos pelos novos; por exemplo:

   ```
   Problem: mysql-community-server-5.6.22-2.`sles11`.x86_64 requires mysql-community-client = 5.6.22-2.`sles11`, but this requirement cannot be provided uninstallable providers: mysql-community-client-5.6.22-2.`sles11`.x86_64[mysql56-community] Solution 1: replacement of mysql-client-5.5.31-0.7.10.x86_64 with mysql-community-client-5.6.22-2.`sles11`.x86_64 Solution 2: do not install mysql-community-server-5.6.22-2.`sles11`.x86_64 Solution 3: break mysql-community-server-5.6.22-2.`sles11`.x86_64 by ignoring some of its dependencies

   Choose from above solutions by number or cancel [1/2/3/c] (c)
   ```

   Escolha a opção substituição (Solução 1 no exemplo) para terminar a instalação a partir do repositório MySQL `SLES`.

#### Instalando o cluster MySQL NDB usando o repositório `SLES`

- As instruções a seguir assumem que nem o MySQL Server nem o MySQL NDB Cluster já foram instalados no seu sistema; se esse não for o caso, remova o MySQL Server ou o MySQL NDB Cluster, incluindo todos os seus executáveis, bibliotecas, arquivos de configuração, arquivos de log e diretórios de dados, antes de continuar. No entanto, não há necessidade de remover o pacote de lançamento que você pode ter usado para habilitar o repositório MySQL `SLES` no seu sistema.
- O pacote NDB Cluster Auto-Installer tem uma dependência dos pacotes `python2-crypto` e `python-paramiko`. `Zypper` pode cuidar dessa dependência se o repositório Python estiver habilitado em seu sistema.

#### Selecionando o subrepositório do cluster MySQL NDB

Dentro do repositório `SLES` do MySQL, o MySQL Community Server e o MySQL NDB Cluster são hospedados em subrepositórios diferentes. Por padrão, o subrepositório para a mais recente série de correções de bugs do MySQL Server está habilitado e o subrepositório para o MySQL NDB Cluster está desativado. Para instalar o NDB Cluster, desative o subrepositório para o MySQL Server e habilite o subrepositório para o NDB Cluster. Por exemplo, desative o subrepositório para o MySQL 8.4, que está habilitado por padrão, com o seguinte comando:

```
$> sudo `zypper` modifyrepo -d mysql-8.4-lts-community
```

Em seguida, habilite o subrepositório para o MySQL NDB Cluster:

```
$> sudo `zypper` modifyrepo -e mysql-cluster-8.4-community
```

Verifique se os subrepositórios corretos foram habilitados executando o seguinte comando e verificando sua saída:

```
$> `zypper` repos -E | grep mysql.*community 10 | mysql-cluster-8.4-community | MySQL Cluster 8.4 Community | Yes     | No
```

Depois disso, use o seguinte comando para atualizar as informações do repositório para o subrepositório habilitado:

```
$> sudo `zypper` refresh
```

#### Instalação do cluster MySQL NDB

Para uma instalação mínima do MySQL NDB Cluster, siga estas etapas:

- Instalar os componentes para os nós SQL:

  ```
  $> sudo `zypper` install mysql-cluster-community-server
  ```

  Após a conclusão da instalação, inicie e inicialize o nó SQL seguindo as etapas dadas em Iniciar o Servidor MySQL.

  Se você optar por inicializar o diretório de dados manualmente usando o comando `mysqld --initialize` (veja Seção 2.9.1, Initializando o Diretório de Dados para detalhes), uma senha `root` será gerada e armazenada no registro de erros do nó SQL; veja Iniciar o Servidor MySQL para saber como encontrar a senha e algumas coisas que você precisa saber sobre isso.

- Instalar os ficheiros executáveis para os nós de gestão:

  ```
  $> sudo `zypper` install mysql-cluster-community-management-server
  ```

- Instalar os executáveis para os nós de dados:

  ```
  $> sudo `zypper` install mysql-cluster-community-data-node
  ```

Para instalar mais componentes do Cluster NDB, consulte Instalar Produtos e Componentes MySQL Adicionais.

#### Instalação de produtos e componentes de cluster NDB MySQL adicionais

Você pode usar `Zypper` para instalar componentes individuais e produtos adicionais do MySQL NDB Cluster a partir do repositório `SLES` do MySQL. Para fazer isso, assumindo que você já tem o repositório `SLES` do MySQL na lista de repositórios do seu sistema (se não, siga as etapas 1 e 2 de Instalar o MySQL NDB Cluster Usando o Repositório `SLES`), siga as mesmas etapas dadas em Instalar Produtos e Componentes Adicionais do MySQL NDB Cluster.

::: info Note

*Problema conhecido:* Atualmente, nem todos os componentes necessários para executar o conjunto de testes do MySQL NDB Cluster são instalados automaticamente quando você instala o pacote do conjunto de testes (`mysql-cluster-community-test`). Instale os seguintes pacotes com `zypper install` antes de executar o conjunto de testes:

- `mysql-cluster-community-auto-installer`
- `mysql-cluster-community-management-server`
- `mysql-cluster-community-data-node`
- `mysql-cluster-community-memcached`
- `mysql-cluster-community-java`
- `mysql-cluster-community-ndbclient-devel`

:::
