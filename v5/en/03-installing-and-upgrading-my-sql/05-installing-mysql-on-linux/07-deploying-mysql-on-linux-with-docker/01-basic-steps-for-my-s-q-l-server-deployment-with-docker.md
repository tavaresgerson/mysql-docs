#### 2.5.7.1 Passos Básicos para o Deploy do MySQL Server com Docker

Aviso

As imagens Docker do MySQL mantidas pela equipe MySQL são construídas especificamente para plataformas Linux. Outras plataformas não são suportadas, e os usuários que utilizam essas imagens Docker do MySQL nelas o fazem por sua conta e risco. Consulte a discussão [aqui](https://github.com/docker-library/mysql/issues/115#issuecomment-257404416) para algumas limitações conhecidas ao executar esses containers em sistemas operacionais que não sejam Linux.

* Download de uma Imagem Docker do MySQL Server
* Inicializando uma Instância do MySQL Server
* Conectando ao MySQL Server de Dentro do Container
* Acesso ao Shell do Container
* Parando e Deletando um Container MySQL
* Fazendo Upgrade de um Container do MySQL Server
* Mais Tópicos sobre o Deploy do MySQL Server com Docker

##### Download de uma Imagem Docker do MySQL Server

Importante

*Para usuários do MySQL Enterprise Edition*: É necessária uma assinatura para usar as imagens Docker do MySQL Enterprise Edition. As assinaturas funcionam pelo modelo "Traga Sua Própria Licença" (Bring Your Own License); consulte [Como Comprar Produtos e Serviços MySQL](https://www.mysql.com/buy-mysql/) para obter detalhes.

O download da imagem do servidor em uma etapa separada não é estritamente necessário; no entanto, realizar esta etapa antes de criar seu container Docker garante que sua imagem local esteja atualizada. Para baixar a imagem do MySQL Community Edition, execute este comando:

```sql
docker pull mysql/mysql-server:tag
```

A *`tag`* é o rótulo da versão da imagem que você deseja puxar (por exemplo, `5.6`, `5.7`, `8.0` ou `latest`). Se **`:tag`** for omitida, o rótulo `latest` é usado, e a imagem para a versão GA (General Availability) mais recente do MySQL Community Server é baixada. Consulte a lista de tags para as versões disponíveis na [página mysql/mysql-server no Docker Hub](https://hub.docker.com/r/mysql/mysql-server/tags/).

Para baixar a imagem do MySQL Community Edition a partir do Oracle Container Registry (OCR), execute este comando:

```sql
docker pull container-registry.oracle.com/mysql/mysql-server:tag
```

Para baixar a imagem do MySQL Enterprise Edition a partir do OCR, você precisa primeiro aceitar o acordo de licença no OCR e fazer login no repositório de containers com seu cliente Docker:

* Visite o OCR em <https://container-registry.oracle.com/> e escolha MySQL.

* Na lista de repositórios MySQL, escolha `enterprise-server`.

* Se você ainda não fez login no OCR, clique no botão Sign in (Entrar) no lado direito da página e, em seguida, insira suas credenciais de conta Oracle quando solicitado.

* Siga as instruções no lado direito da página para aceitar o acordo de licença.

* Faça login no OCR com seu cliente Docker (o comando `docker`) usando o comando `docker login`:

  ```sql
  # docker login container-registry.oracle.com
  Username: Oracle-Account-ID
  Password: password
  Login successful.
  ```

Baixe a imagem Docker para o MySQL Enterprise Edition do OCR com este comando:

```sql
docker pull  container-registry.oracle.com/mysql/enterprise-server:tag
```

Existem diferentes escolhas para **`tag`**, correspondendo a diferentes versões de imagens Docker do MySQL fornecidas pelo OCR:

* `8.0`, `8.0.x` (*`x`* é o número da versão mais recente na série 8.0), `latest`: MySQL 8.0, o GA mais recente

* `5.7`, `5.7.y` (*`y`* é o número da versão mais recente na série 5.7): MySQL 5.7

Para baixar a imagem do MySQL Enterprise Edition, visite o site [My Oracle Support](https://support.oracle.com/), faça login na sua conta Oracle e execute estas etapas após chegar à página inicial:

* Selecione a aba Patches and Updates (Patches e Atualizações).
* Vá para a região Patch Search (Pesquisa de Patch) e, na aba Search (Pesquisa), mude para a sub-aba Product or Family (Advanced) (Produto ou Família (Avançado)).

* Insira “MySQL Server” para o campo Product (Produto) e o número da versão desejada no campo Release (Lançamento).

* Use os menus suspensos para filtros adicionais para selecionar Description—contains (Descrição—contém) e insira “Docker” no campo de texto.

  A figura a seguir mostra as configurações de pesquisa para uma imagem do MySQL Enterprise Edition:

  ![Diagrama mostrando configurações de pesquisa para imagem do MySQL Enterprise](images/docker-search2.png)

* Clique no botão Search (Pesquisar) e, na lista de resultados, selecione a versão desejada e clique no botão Download (Baixar).

* Na caixa de diálogo File Download (Download de Arquivo) que aparece, clique e baixe o arquivo `.zip` para a imagem Docker.

Descompacte o arquivo `.zip` baixado para obter o tarball interno (`mysql-enterprise-server-version.tar`) e, em seguida, carregue a imagem executando este comando:

```sql
docker load -i mysql-enterprise-server-version.tar
```

Você pode listar as imagens Docker baixadas com este comando:

```sql
$> docker images
REPOSITORY           TAG                 IMAGE ID            CREATED             SIZE
mysql/mysql-server   latest              3157d7f55f8d        4 weeks ago         241MB
```

##### Inicializando uma Instância do MySQL Server

Para iniciar um novo container Docker para um MySQL Server, use o seguinte comando:

```sql
docker run --name=container_name -d image_name:tag
```

O nome da imagem pode ser obtido usando o comando **docker images**, conforme explicado em Download de uma Imagem Docker do MySQL Server. A opção `--name`, para fornecer um nome personalizado para o container do seu servidor, é opcional; se nenhum nome de container for fornecido, um nome aleatório será gerado.

Por exemplo, para iniciar um novo container Docker para o MySQL Community Server, use este comando:

```sql
docker run --name=mysql1 -d mysql/mysql-server:5.7
```

Para iniciar um novo container Docker para o MySQL Enterprise Server com uma imagem Docker baixada do OCR, use este comando:

```sql
docker run --name=mysql1 -d container-registry.oracle.com/mysql/enterprise-server:5.7
```

Para iniciar um novo container Docker para o MySQL Enterprise Server com uma imagem Docker baixada do My Oracle Support, use este comando:

```sql
docker run --name=mysql1 -d mysql/enterprise-server:5.7
```

Se a imagem Docker do nome e tag especificados não tiver sido baixada por um comando **docker pull** ou **docker run** anterior, a imagem será baixada agora. A inicialização para o container começa, e o container aparece na lista de containers em execução quando você executa o comando **docker ps**. Por exemplo:

```sql
$> docker ps
CONTAINER ID   IMAGE                COMMAND                  CREATED             STATUS                              PORTS                NAMES
a24888f0d6f4   mysql/mysql-server   "/entrypoint.sh my..."   14 seconds ago      Up 13 seconds (health: starting)    3306/tcp, 33060/tcp  mysql1
```

A inicialização do container pode levar algum tempo. Quando o server estiver pronto para uso, o `STATUS` do container na saída do comando **docker ps** muda de `(health: starting)` para `(healthy)`.

A opção `-d` usada no comando **docker run** acima faz com que o container seja executado em segundo plano. Use este comando para monitorar a saída do container:

```sql
docker logs mysql1
```

Assim que a inicialização for concluída, a saída do comando conterá a senha aleatória gerada para o usuário root; verifique a senha com, por exemplo, este comando:

```sql
$> docker logs mysql1 2>&1 | grep GENERATED
GENERATED ROOT PASSWORD: Axegh3kAJyDLaRuBemecis&EShOs
```

##### Conectando ao MySQL Server de Dentro do Container

Assim que o server estiver pronto, você pode executar o cliente **mysql** dentro do container do MySQL Server que você acabou de iniciar e conectá-lo ao MySQL Server. Use o comando **docker exec -it** para iniciar um cliente **mysql** dentro do container Docker que você iniciou, como o seguinte:

```sql
docker exec -it mysql1 mysql -uroot -p
```

Quando solicitado, insira a senha root gerada (consulte a última etapa em Inicializando uma Instância do MySQL Server acima sobre como encontrar a senha). Como a opção `MYSQL_ONETIME_PASSWORD` é verdadeira por padrão, depois de conectar um cliente **mysql** ao server, você deve redefinir a senha root do server emitindo esta instrução:

```sql
mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'password';
```

Substitua *`password`* pela senha de sua escolha. Assim que a senha for redefinida, o server estará pronto para uso.

##### Acesso ao Shell do Container

Para ter acesso ao shell do seu container do MySQL Server, use o comando **docker exec -it** para iniciar um shell bash dentro do container:

```sql
$> docker exec -it mysql1 bash
bash-4.2#
```

Você pode então executar comandos Linux dentro do container. Por exemplo, para visualizar o conteúdo no data directory do server dentro do container, use este comando:

```sql
bash-4.2# ls /var/lib/mysql
auto.cnf    ca.pem	     client-key.pem  ib_logfile0  ibdata1  mysql       mysql.sock.lock	   private_key.pem  server-cert.pem  sys
ca-key.pem  client-cert.pem  ib_buffer_pool  ib_logfile1  ibtmp1   mysql.sock  performance_schema  public_key.pem   server-key.pem
```

##### Parando e Deletando um Container MySQL

Para parar o container do MySQL Server que criamos, use este comando:

```sql
docker stop mysql1
```

**docker stop** envia um sinal SIGTERM para o processo **mysqld**, para que o server seja desligado de forma graciosa (gracefully).

Observe também que quando o processo principal de um container (**mysqld** no caso de um container do MySQL Server) é interrompido, o container Docker para automaticamente.

Para iniciar o container do MySQL Server novamente:

```sql
docker start mysql1
```

Para parar e iniciar novamente o container do MySQL Server com um único comando:

```sql
docker restart mysql1
```

Para deletar o container MySQL, pare-o primeiro e, em seguida, use o comando **docker rm**:

```sql
docker stop mysql1
```

```sql
docker rm mysql1
```

Se você quiser que o Docker volume para o data directory do server seja deletado ao mesmo tempo, adicione a opção `-v` ao comando **docker rm**.

##### Fazendo Upgrade de um Container do MySQL Server

Importante

* Antes de realizar qualquer upgrade para o MySQL, siga cuidadosamente as instruções na Seção 2.10, “Fazendo Upgrade do MySQL”. Entre outras instruções discutidas lá, é especialmente importante fazer backup do seu Database antes do upgrade.

* As instruções nesta seção exigem que os dados e a configuração do server tenham sido persistidos no host. Consulte Persistência de Dados e Alterações de Configuração para obter detalhes.

Siga estas etapas para fazer upgrade de uma instalação Docker do MySQL 5.6 para 5.7:

* Pare o MySQL 5.6 Server (o nome do container é `mysql56` neste exemplo):

  ```sql
  docker stop mysql56
  ```

* Baixe a imagem Docker do MySQL 5.7 Server. Consulte as instruções em Download de uma Imagem Docker do MySQL Server; certifique-se de usar a tag correta para o MySQL 5.7.

* Inicie um novo container Docker do MySQL 5.7 (nomeado `mysql57` neste exemplo) com os dados e a configuração do server antigo (com as modificações adequadas, se necessário — consulte a Seção 2.10, “Fazendo Upgrade do MySQL”) que foram persistidos no host (por [bind-mounting](https://docs.docker.com/engine/reference/commandline/service_create/#add-bind-mounts-or-volumes) neste exemplo). Para o MySQL Community Server, execute este comando:

  ```sql
  docker run --name=mysql57 \
     --mount type=bind,src=/path-on-host-machine/my.cnf,dst=/etc/my.cnf \
     --mount type=bind,src=/path-on-host-machine/datadir,dst=/var/lib/mysql \
     -d mysql/mysql-server:5.7
  ```

  Se necessário, ajuste `mysql/mysql-server` para o nome de imagem correto — por exemplo, substitua-o por `container-registry.oracle.com/mysql/enterprise-server` para imagens do MySQL Enterprise Edition baixadas do OCR, ou `mysql/enterprise-server` para imagens do MySQL Enterprise Edition baixadas do [My Oracle Support](https://support.oracle.com/).

* Aguarde a conclusão da inicialização do server. Você pode verificar o status do server usando o comando **docker ps** (consulte Inicializando uma Instância do MySQL Server para saber como fazer isso).

* Execute o utilitário mysql_upgrade no container do MySQL 5.7 Server:

  ```sql
  docker exec -it mysql57 mysql_upgrade -uroot -p
  ```

  Quando solicitado, insira a senha root do seu antigo MySQL 5.6 Server.

* Conclua o upgrade reiniciando o container do MySQL 5.7 Server:

  ```sql
  docker restart mysql57
  ```

##### Mais Tópicos sobre o Deploy do MySQL Server com Docker

Para mais tópicos sobre o deploy do MySQL Server com Docker, como configuração do server, persistência de dados e configuração, log de erros do server e variáveis de ambiente do container, consulte a Seção 2.5.7.2, “Mais Tópicos sobre o Deploy do MySQL Server com Docker”.