#### 25.3.1.5 Implantação do NDB Cluster com Contenedores Docker

##### Baixar uma imagem Docker do MySQL NDB Cluster

Não é estritamente necessário fazer o download da imagem Docker em uma etapa separada; no entanto, realizar essa etapa antes de criar seus contêineres Docker garante que sua imagem local esteja atualizada. Para fazer o download da imagem MySQL NDB Cluster Community Edition do Oracle Container Registry (OCR), execute o seguinte comando:

```
docker pull container-registry.oracle.com/mysql/community-cluster:tag
```

O `tag` é o rótulo para a versão da imagem que você deseja baixar (por exemplo, `7.5`, `7.6`, `8.0` ou `latest`). Se o rótulo `:tag` for omitido, o rótulo `latest` será usado e a imagem da versão mais recente do MySQL NDB Cluster será baixada.

Você pode listar as imagens Docker baixadas com este comando:

```
$> docker images
REPOSITORY                                              TAG       IMAGE ID       CREATED        SIZE
container-registry.oracle.com/mysql/community-cluster   8.0       d1b28e457ac5   5 weeks ago    636MB
```

Para baixar a imagem do MySQL Cluster comercial do OCR, você precisa aceitar primeiro o acordo de licença. Siga estes passos:

- Visite o OCR em <https://container-registry.oracle.com/> e escolha MySQL.

- Na lista de repositórios do MySQL, escolha `commercial-cluster`.

- Se você ainda não se conectou ao OCR, clique no botão Conectar no lado direito da página e, em seguida, insira suas credenciais da conta Oracle quando solicitado.

- Siga as instruções à direita da página para aceitar o acordo de licença.

Baixe a imagem Docker para o MySQL Commercial Cluster a partir do OCR com este comando:

```
docker pull  container-registry.oracle.com/mysql/commercial-cluster:tag
```

##### Começando um MySQL Cluster com configuração padrão

Primeiro, crie uma rede interna Docker chamada `cluster` para que os containers se comuniquem entre si:

```
docker network create cluster --subnet=192.168.0.0/16
```

Em seguida, inicie o nó de gerenciamento:

```
docker run -d --net=cluster --name=management1 --ip=192.168.0.2 container-registry.oracle.com/mysql/community-cluster ndb_mgmd
```

Em seguida, inicie os dois nós de dados

```
docker run -d --net=cluster --name=ndb1 --ip=192.168.0.3 container-registry.oracle.com/mysql/community-cluster ndbd
```

```
docker run -d --net=cluster --name=ndb2 --ip=192.168.0.4 container-registry.oracle.com/mysql/community-cluster ndbd
```

Por fim, inicie o nó do servidor MySQL:

```
docker run -d --net=cluster --name=mysql1 --ip=192.168.0.10 -e MYSQL_RANDOM_ROOT_PASSWORD=true container-registry.oracle.com/mysql/community-cluster mysqld
```

O servidor é então inicializado com uma senha aleatória, que precisa ser alterada. Pegue a senha do log:

```
docker logs mysql1 2>&1 | grep PASSWORD
```

Se nenhuma senha for retornada pelo comando, o servidor ainda não terminou a inicialização. Aguarde um pouco e tente novamente. Depois de obter a senha, mude-a fazendo login no servidor com o cliente `mysql`:

```
docker exec -it mysql1 mysql -uroot -p
```

Depois de estar no servidor, altere a senha do root com a seguinte declaração:

```
mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'password';
```

Por fim, inicie um contêiner com um cliente de gerenciamento interativo **ndb\_mgm** para monitorar o clúster:

```
$> docker run -it --net=cluster container-registry.oracle.com/mysql/community-cluster ndb_mgm
[Entrypoint] MySQL Docker Image 8.0.43-1.2.10-cluster
[Entrypoint] Starting ndb_mgm
-- NDB Cluster -- Management Client --
```

Execute o comando `SHOW` para imprimir o status do cluster. Você deve ver o seguinte:

```
ndb_mgm> SHOW
Connected to Management Server at: 192.168.0.2:1186
Cluster Configuration
---------------------
[ndbd(NDB)]	2 node(s)
id=2	@192.168.0.3  (mysql-8.0.43-ndb-8.0.43, Nodegroup: 0, *)
id=3	@192.168.0.4  (mysql-8.0.43-ndb-8.0.43, Nodegroup: 0)

[ndb_mgmd(MGM)]	1 node(s)
id=1	@192.168.0.2  (mysql-8.0.43-ndb-8.0.43)

[mysqld(API)]	1 node(s)
id=4	@192.168.0.10  (mysql-8.0.43-ndb-8.0.43)
```

##### Personalização do MySQL Cluster

A imagem padrão do MySQL NDB Cluster inclui dois arquivos de configuração, que também estão disponíveis no repositório do GitHub para o MySQL NDB Cluster

- `/etc/my.cnf`
- `/etc/mysql-cluster.cnf`

Para alterar o cluster (por exemplo, adicionar mais nós ou alterar a configuração da rede), esses arquivos devem ser atualizados. Para obter mais informações, consulte a Seção 25.4.3, “Arquivos de Configuração do Cluster NDB”. Para usar arquivos de configuração personalizados ao iniciar o contêiner, use a bandeira `-v` para carregar arquivos externos. Por exemplo (insira todo o comando na mesma linha):

```
$> docker run -d --net=cluster --name=management1 \
      --ip=192.168.0.2 -v /etc/my.cnf:/etc/my.cnf -v \
      /etc/mysql-cluster.cnf:/etc/mysql-cluster.cnf \
      container-registry.oracle.com/mysql/community-cluster ndb_mgmd
```
