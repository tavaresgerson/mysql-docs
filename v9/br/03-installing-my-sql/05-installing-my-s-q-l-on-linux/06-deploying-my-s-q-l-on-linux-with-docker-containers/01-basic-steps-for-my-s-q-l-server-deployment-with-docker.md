#### 2.5.6.1 Passos Básicos para a Implantação do Servidor MySQL com Docker

Aviso

As imagens do Docker do MySQL mantidas pela equipe do MySQL são construídas especificamente para plataformas Linux. Outras plataformas não são suportadas, e os usuários que usam essas imagens do Docker do MySQL nelas estão fazendo isso por conta própria. Veja a discussão aqui para algumas limitações conhecidas para executar esses contêineres em sistemas operacionais não Linux.

* Downloadamento de uma Imagem do Docker do Servidor MySQL
* Início de uma Instância do Servidor MySQL
* Conexão ao Servidor MySQL do Contêiner
* Acesso à Shell do Contêiner
* Parada e Exclusão de um Contêiner do MySQL
* Atualização de um Contêiner do Servidor MySQL
* Mais Tópicos sobre a Implantação do Servidor MySQL com Docker

##### Downloadamento de uma Imagem do Docker do Servidor MySQL

Importante

*Para usuários da Edição Empresarial do MySQL*: Uma assinatura é necessária para usar as imagens do Docker para a Edição Empresarial do MySQL. As assinaturas funcionam com um modelo "Traga Sua Própria Licença"; veja [Como Comprar Produtos e Serviços do MySQL](https://www.mysql.com/buy-mysql/) para detalhes.

O download da imagem do servidor em uma etapa separada não é estritamente necessário; no entanto, realizar essa etapa antes de criar seu contêiner Docker garante que sua imagem local esteja atualizada. Para baixar a imagem da Edição Comunitária do MySQL do [Oracle Container Registry (OCR)](https://container-registry.oracle.com/), execute este comando:

```
docker pull container-registry.oracle.com/mysql/community-server:tag
```

O *`tag`* é o rótulo para a versão da imagem que você deseja baixar (por exemplo, `8.4`, ou `9.5`, ou `latest`). Se **`:tag`** for omitido, o rótulo `latest` é usado, e a imagem para a versão GA mais recente (que é a versão de inovação mais recente) do Servidor Comunitário do MySQL é baixada.

Para baixar a imagem da Edição Empresarial do MySQL do OCR, você precisa primeiro aceitar o acordo de licença no OCR e fazer login no repositório do contêiner com seu cliente Docker. Siga estes passos:

* Visite o OCR em <https://container-registry.oracle.com/> e escolha MySQL.

* Sob a lista de repositórios do MySQL, escolha `enterprise-server`.

* Se você ainda não se conectou ao OCR, clique no botão Conectar à direita da página e, em seguida, insira suas credenciais da conta Oracle quando solicitado.

* Siga as instruções à direita da página para aceitar o acordo de licença.

* Faça login no OCR com seu cliente de contêiner usando, por exemplo, o comando `docker login`:

  ```
  # docker login container-registry.oracle.com
  Username: Oracle-Account-ID
  Password: password
  Login successful.
  ```

Baixe a imagem do Docker para a Edição Empresarial do MySQL do OCR com este comando:

```
docker pull  container-registry.oracle.com/mysql/enterprise-server:tag
```

Para baixar a imagem da Edição Empresarial do MySQL do site [My Oracle Support](https://support.oracle.com/), vá ao site, faça login na sua conta Oracle e, após estar na página inicial, siga estes passos:

* Selecione a aba Patches e Atualizações.
* Vá para a região de Pesquisa de Patch e, na aba Pesquisa, mude para a subcategoria Produto ou Família (Avançado).

* Insira "MySQL Server" no campo Produto e o número de versão desejado no campo Lançamento.

* Use os menus suspensivos para filtros adicionais para selecionar Descrição — contém e insira "Docker" no campo de texto.

A figura a seguir mostra as configurações de pesquisa para a imagem do MySQL Enterprise Edition para o MySQL Server 8.0:

![Diagrama mostrando as configurações de pesquisa para a imagem do MySQL Enterprise](images/docker-search2.png)

* Clique no botão Pesquisar e, na lista de resultados, selecione a versão desejada e clique no botão Baixar.

* Na caixa de diálogo de Download de Arquivo que aparece, clique e faça o download do arquivo `.zip` para a imagem Docker.

Descompacte o arquivo `.zip` baixado para obter o tarball por dentro (`mysql-enterprise-server-version.tar`), e, em seguida, carregue a imagem executando este comando:

```
docker load -i mysql-enterprise-server-version.tar
```

Você pode listar as imagens Docker baixadas com este comando:

```
$> docker images
REPOSITORY                                             TAG       IMAGE ID       CREATED        SIZE
container-registry.oracle.com/mysql/community-server   latest    1d9c2219ff69   2 months ago   496MB
```

##### Iniciando uma Instância do Servidor MySQL

Para iniciar um novo contêiner Docker para um servidor MySQL, use o seguinte comando:

```
docker run --name=container_name  --restart on-failure -d image_name:tag
```

*`image_name`* é o nome da imagem a ser usada para iniciar o contêiner; consulte Baixar uma Imagem Docker do Servidor MySQL para mais informações.

A opção `--name` é opcional para fornecer um nome personalizado para o contêiner do seu servidor; se nenhum nome de contêiner for fornecido, um nome aleatório é gerado.

A opção `--restart` é para configurar a [política de reinício](https://docs.docker.com/config/containers/start-containers-automatically/) para o seu contêiner; deve ser definida para o valor `on-failure`, para habilitar o suporte ao reinício do servidor dentro de uma sessão do cliente (o que acontece, por exemplo, quando a instrução RESTART é executada por um cliente ou durante a configuração de uma instância de InnoDB Cluster). Com o suporte ao reinício habilitado, emitir um reinício dentro de uma sessão do cliente faz com que o servidor e o contêiner sejam interrompidos e, em seguida, reiniciados.

Por exemplo, para iniciar um novo contêiner Docker para o Servidor Comunitário MySQL, use este comando:

```
docker run --name=mysql1 --restart on-failure -d container-registry.oracle.com/mysql/community-server:latest
```

Para iniciar um novo contêiner Docker para o Servidor Empresarial MySQL com uma imagem Docker baixada do OCR, use este comando:

```
docker run --name=mysql1 --restart on-failure -d container-registry.oracle.com/mysql/enterprise-server:latest
```

Para iniciar um novo contêiner Docker para o Servidor Empresarial MySQL com uma imagem Docker baixada do My Oracle Support, use este comando:

```
docker run --name=mysql1 --restart on-failure -d mysql/enterprise-server:latest
```

Se a imagem Docker do nome e da tag especificados não tiver sido baixada por um comando anterior **docker pull** ou **docker run**, a imagem agora está sendo baixada. A inicialização do container começa, e o container aparece na lista de containers em execução quando você executa o comando **docker ps**. Por exemplo:

```
$> docker ps
CONTAINER ID   IMAGE                                                         COMMAND                  CREATED          STATUS                    PORTS                       NAMES
4cd4129b3211   container-registry.oracle.com/mysql/community-server:latest   "/entrypoint.sh mysq…"   8 seconds ago    Up 7 seconds (health: starting)   3306/tcp, 33060-33061/tcp   mysql1
```

A inicialização do container pode levar algum tempo. Quando o servidor estiver pronto para uso, o `STATUS` do container na saída do comando **docker ps** muda de `(health: starting)` para `(healthy)`.

A opção `-d` usada no comando **docker run** acima faz com que o container seja executado em segundo plano. Use este comando para monitorar a saída do container:

```
docker logs mysql1
```

Uma vez que a inicialização esteja concluída, a saída do comando vai conter a senha aleatória gerada para o usuário root; verifique a senha com, por exemplo, este comando:

```
$> docker logs mysql1 2>&1 | grep GENERATED
GENERATED ROOT PASSWORD: Axegh3kAJyDLaRuBemecis&EShOs
```

##### Conectando-se ao Servidor MySQL a partir do Container

Uma vez que o servidor esteja pronto, você pode executar o cliente **mysql** dentro do container do Servidor MySQL que você acabou de iniciar e conectá-lo ao Servidor MySQL. Use o comando **docker exec -it** para iniciar um cliente **mysql** dentro do container Docker que você iniciou, como o seguinte:

```
docker exec -it mysql1 mysql -uroot -p
```

Quando solicitado, insira a senha gerada (consulte a última etapa de Iniciar uma Instância do Servidor MySQL acima sobre como encontrar a senha). Como a opção `MYSQL_ONETIME_PASSWORD` é verdadeira por padrão, após você ter conectado um cliente **mysql** ao servidor, você deve reiniciar a senha do root do servidor emitindo esta declaração:

```
mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'password';
```

Substitua *`password`* pela senha de sua escolha. Uma vez que a senha seja redefinida, o servidor estará pronto para uso.

##### Acesso à Shell do Container

Para ter acesso de shell ao seu contêiner do Servidor MySQL, use o comando **docker exec -it** para iniciar um shell bash dentro do contêiner:

```
$> docker exec -it mysql1 bash
bash-4.2#
```

Você pode então executar comandos Linux dentro do contêiner. Por exemplo, para visualizar o conteúdo do diretório de dados do servidor dentro do contêiner, use este comando:

```
bash-4.2# ls /var/lib/mysql
auto.cnf    ca.pem	     client-key.pem  ib_logfile0  ibdata1  mysql       mysql.sock.lock	   private_key.pem  server-cert.pem  sys
ca-key.pem  client-cert.pem  ib_buffer_pool  ib_logfile1  ibtmp1   mysql.sock  performance_schema  public_key.pem   server-key.pem
```

##### Parando e Excluindo um Contêiner MySQL

Para parar o contêiner do Servidor MySQL que criamos, use este comando:

```
docker stop mysql1
```

**docker stop** envia um sinal SIGTERM ao processo **mysqld**, para que o servidor seja desligado de forma suave.

Observe também que, quando o processo principal de um contêiner (**mysqld** no caso de um contêiner do Servidor MySQL) é parado, o contêiner Docker para automaticamente.

Para reiniciar o contêiner do Servidor MySQL:

```
docker start mysql1
```

Para parar e reiniciar novamente o contêiner do Servidor MySQL com um único comando:

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

Se você deseja que o volume Docker para o diretório de dados do servidor seja excluído ao mesmo tempo, adicione a opção `-v` ao comando **docker rm**.

##### Atualizando um Contêiner do Servidor MySQL

Importante

* Antes de realizar qualquer atualização no MySQL, siga cuidadosamente as instruções no Capítulo 3, *Atualizando o MySQL*. Entre outras instruções discutidas, é especialmente importante fazer backup do seu banco de dados antes da atualização.

* As instruções nesta seção exigem que os dados e configurações do servidor tenham sido persistentes no host. Consulte Persistência de Alterações de Dados e Configurações para detalhes.

Siga estes passos para atualizar uma instalação Docker do MySQL 8.4 para 9.5:

* Pare o servidor MySQL 8.4 (o nome do contêiner é `mysql84` neste exemplo):

  ```
  docker stop mysql84
  ```

* Faça o download da imagem Docker do Servidor MySQL 9.5. Consulte as instruções em Baixar uma imagem Docker de Servidor MySQL. Certifique-se de usar a tag correta para o MySQL 9.5.

[bind-mounting](https://docs.docker.com/engine/reference/commandline/service_create/#add-bind-mounts-or-volumes) neste exemplo). Para o Servidor MySQL Community, execute o seguinte comando:

  ```
  docker run --name=mysql95 \
     --mount type=bind,src=/path-on-host-machine/my.cnf,dst=/etc/my.cnf \
     --mount type=bind,src=/path-on-host-machine/datadir,dst=/var/lib/mysql \
     -d container-registry.oracle.com/mysql/community-server:9.5
  ```

  Se necessário, ajuste `container-registry.oracle.com/mysql/community-server` para o nome correto da imagem — por exemplo, substitua-o por `container-registry.oracle.com/mysql/enterprise-server` para imagens do MySQL Enterprise Edition baixadas do OCR, ou `mysql/enterprise-server` para imagens do MySQL Enterprise Edition baixadas do My Oracle Support.

* Aguarde até que o servidor termine de inicializar. Você pode verificar o status do servidor usando o comando **docker ps** (veja Iniciando uma Instância do Servidor MySQL para saber como fazer isso).

Siga os mesmos passos para a atualização dentro da série 9.5 (ou seja, de lançamento 9.5.*`x`* para 9.5.*`y`*): pare o contêiner original e inicie um novo com uma imagem mais nova nos dados e configuração do servidor antigo. Se você usou a tag 9.5 ou `latest` ao iniciar o seu contêiner original e agora há uma nova versão do MySQL 9.5 para a qual você deseja fazer a atualização, você deve primeiro puxar a imagem para a nova versão com o comando:

```
docker pull container-registry.oracle.com/mysql/community-server:9.5
```

Em seguida, você pode fazer a atualização iniciando um *novo* contêiner com a mesma tag nos dados e configuração antigos (ajuste o nome da imagem se você estiver usando a Edição Empresarial do MySQL; veja Baixar uma imagem Docker de Servidor MySQL):

```
docker run --name=mysql95new \
   --mount type=bind,src=/path-on-host-machine/my.cnf,dst=/etc/my.cnf \
   --mount type=bind,src=/path-on-host-machine/datadir,dst=/var/lib/mysql \
-d container-registry.oracle.com/mysql/community-server:9.5
```

##### Mais tópicos sobre a implantação do Servidor MySQL com Docker

Para mais tópicos sobre a implantação do MySQL Server com o Docker, como configuração do servidor, persistência de dados e configuração, log de erro do servidor e variáveis de ambiente do container, consulte a Seção 2.5.6.2, “Mais tópicos sobre a implantação do MySQL Server com o Docker”.