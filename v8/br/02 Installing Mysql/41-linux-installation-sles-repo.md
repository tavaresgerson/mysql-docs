### 2.5.3 Usando o Repositório MySQL `SLES`

O repositório MySQL `SLES` fornece pacotes `RPM` para instalar e gerenciar o servidor MySQL, o cliente e outros componentes no SUSE Enterprise Linux Server. Esta seção contém informações sobre como obter e instalar esses pacotes.

#### Adicionando o Repositório MySQL `SLES`

Adicione ou atualize o repositório oficial MySQL `SLES` na lista de repositórios do seu sistema:

::: info Nota

A parte inicial do nome do arquivo de configuração, como `mysql84`, descreve a série MySQL padrão que está habilitada para instalação. Neste caso, o subrepositório para MySQL 8.4 LTS está habilitado por padrão. Ele também contém outras versões de subrepositórios, como MySQL 8.0 e a Série de Inovação MySQL.

:::

##### Instalação de um Novo Repositório MySQL

Se o repositório MySQL ainda não estiver presente no sistema, então:

1. Vá para a página de download do repositório MySQL `SLES` em <https://dev.mysql.com/downloads/repo/suse/>.
2. Selecione e baixe o pacote de lançamento para a versão do seu `SLES`.
3. Instale o pacote de lançamento baixado com o seguinte comando, substituindo `package-name` pelo nome do pacote baixado:

   ```
   $> sudo `rpM` -Uvh package-name `rpM`
   ```

   Por exemplo, para instalar o pacote `SLES` 15 onde *`#`* indica o número de lançamento dentro de uma versão como `15-1`:

   ```
   $> sudo `rpM` -Uvh mysql84-community-release-sl15-#.noarch `rpM`
   ```

##### Atualizar uma Instalação de Repositório MySQL Existente

Se uma versão mais antiga já estiver presente, então atualize-a:

* ``` $> sudo `zypper` update mysql84-community-release
  ```xmJWS8SYPA```
$> `zypper` repos | grep mysql.*community
```cRr6BaSRyd```
$> sudo `zypper` modifyrepo -d mysql-8.4-lts-community $> sudo `zypper` modifyrepo -d mysql-tools-community
```fvFjUdF3vv```
$> sudo `zypper` modifyrepo -e mysql-innovation-community $> sudo `zypper` modifyrepo -e mysql-tools-innovation-community
```CrTrAWeEsf```
$> `zypper` repos -E | grep mysql.*community

 7 | mysql-connectors-community       | MySQL Connectors Community                  | Yes     | (r ) Yes  | No 10 | mysql-innovation-community       | MySQL Innovation Release Community Server   | Yes     | (r ) Yes  | No 16 | mysql-tools-innovation-community | MySQL Tools Innovation Community            | Yes     | ( p) Yes  | No
```JlCVfxKuPG```
$> sudo `zypper` refresh
```dJDYDIy1WP```
$> sudo `zypper` install mysql-community-server
```UbdNNFUORt```
$> systemctl start mysql
```K0yxeGZXY5```
$> systemctl status mysql
```bpiF1dymxt```
  $> sudo grep 'temporary password' /var/log/mysql/mysqld.log
  ```L5WwIpti8c```
  $> mysql -uroot -p
  ```R34xi9ixx3```
  mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass4!';
  ```M6bHy4dlSY```
$> sudo systemctl stop mysql
```29Sk2aERFz```
$> `zypper` repos | grep mysql.*community
```A0v3LyN9mf```
$> `zypper` packages subrepo-name
```5070XQYTrL```
$> sudo `zypper` install package-name
```YzDC3LySBJ```
$> sudo `zypper` install mysql-community-bench
```X0ngbBDi4w```
   $> sudo `zypper` update mysql-community-server
   ```ryeyeVEdO9```
   $> sudo `zypper` update
   ```qoV734zhpA```
$> `zypper` packages -i | grep mysql-.*community
```zPWU2aBujy```
$> sudo `zypper` update package-name
```nRpjZyqG7m```
   $> systemctl stop mysql
   ```GBs8OXrlf1```
   Problem: mysql-community-server-5.6.22-2.`sles11`.x86_64 requires mysql-community-client = 5.6.22-2.`sles11`, but this requirement cannot be provided uninstallable providers: mysql-community-client-5.6.22-2.`sles11`.x86_64[mysql56-community] Solution 1: replacement of mysql-client-5.5.31-0.7.10.x86_64 with mysql-community-client-5.6.22-2.`sles11`.x86_64 Solution 2: do not install mysql-community-server-5.6.22-2.`sles11`.x86_64 Solution 3: break mysql-community-server-5.6.22-2.`sles11`.x86_64 by ignoring some of its dependencies

   Choose from above solutions by number or cancel [1/2/3/c] (c)
   ```6XhczlKKVw```
$> sudo `zypper` modifyrepo -d mysql-8.4-lts-community
```qfLs294RP7```
$> sudo `zypper` modifyrepo -e mysql-cluster-8.4-community
```tfQoBmXjx7```
$> `zypper` repos -E | grep mysql.*community 10 | mysql-cluster-8.4-community | MySQL Cluster 8.4 Community | Yes     | No
```eWUBLHdqd3```
$> sudo `zypper` refresh
```zG1AFpw4yG```
  $> sudo `zypper` install mysql-cluster-community-server
  ```rtuoxduFHG```
  $> sudo `zypper` install mysql-cluster-community-management-server
  ```cP6wBKoaWN```

Para instalar mais componentes do NDB Cluster, consulte Instalando Produtos e Componentes Adicionais do MySQL NDB Cluster.

#### Instalando Produtos e Componentes Adicionais do MySQL NDB Cluster

Você pode usar o `Zypper` para instalar componentes individuais e produtos adicionais do MySQL NDB Cluster a partir do repositório `SLES` do MySQL. Para fazer isso, assumindo que você já tem o repositório `SLES` do MySQL na lista de repositórios do seu sistema (se não tiver, siga os Passos 1 e 2 de Instalação do MySQL NDB Cluster Usando o Repositório `SLES`), siga os mesmos passos descritos em Instalando Produtos e Componentes Adicionais do MySQL NDB Cluster.

::: info Nota

*Problema conhecido:* Atualmente, nem todos os componentes necessários para executar a suíte de testes do MySQL NDB Cluster são instalados automaticamente quando você instala o pacote da suíte de testes (`mysql-cluster-community-test`). Instale os seguintes pacotes com `zypper install` antes de executar a suíte de testes:

* `mysql-cluster-community-auto-installer`
* `mysql-cluster-community-management-server`
* `mysql-cluster-community-data-node`
* `mysql-cluster-community-memcached`
* `mysql-cluster-community-java`
* `mysql-cluster-community-ndbclient-devel`