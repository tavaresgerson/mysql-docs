#### 2.5.6.1 Passos Básicos para a Implantação do Servidor MySQL com Docker

Aviso

As imagens do Docker do MySQL mantidas pela equipe do MySQL são construídas especificamente para plataformas Linux. Outras plataformas não são suportadas, e os usuários que usam essas imagens do Docker do MySQL nelas estão fazendo isso por conta própria. Veja a discussão aqui para algumas limitações conhecidas para executar esses contêineres em sistemas operacionais não Linux.

*  Baixar uma Imagem do Docker do Servidor MySQL
*  Iniciar uma Instância do Servidor MySQL
*  Conectar-se ao Servidor MySQL do Contêiner
*  Acesso à Shell do Contêiner
*  Parar e Deletar um Contêiner do MySQL
*  Atualizar um Contêiner do Servidor MySQL
*  Mais Tópicos sobre a Implantação do Servidor MySQL com Docker

##### Baixar uma Imagem do Docker do Servidor MySQL

Importante

*Para usuários da Edição Empresarial do MySQL*: Uma assinatura é necessária para usar as imagens do Docker para a Edição Empresarial do MySQL. As assinaturas funcionam com um modelo "Traga Sua Própria Licença"; consulte [Como Comprar Produtos e Serviços do MySQL](https://www.mysql.com/buy-mysql/) para detalhes.

Baixar a imagem do servidor em uma etapa separada não é estritamente necessário; no entanto, realizar essa etapa antes de criar seu contêiner Docker garante que sua imagem local esteja atualizada. Para baixar a imagem da Edição Comunitária do MySQL do [Oracle Container Registry (OCR)](https://container-registry.oracle.com/), execute este comando:

```
docker pull container-registry.oracle.com/mysql/community-server:tag
```

O *`tag`* é o rótulo para a versão da imagem que você deseja baixar (por exemplo, `8.4`, `9.5` ou `latest`). Se **`:tag`** for omitido, o rótulo `latest` é usado, e a imagem para a versão mais recente do MySQL Community Server (que é a versão mais recente de inovação) é baixada.

Para baixar a imagem da Edição Empresarial do MySQL do OCR, você precisa primeiro aceitar o acordo de licença no OCR e fazer login no repositório do contêiner com seu cliente Docker. Siga estes passos:

* Acesse o OCR em <https://container-registry.oracle.com/> e escolha MySQL.
* Na lista de repositórios do MySQL, escolha `enterprise-server`.
* Se você ainda não tiver iniciado sessão no OCR, clique no botão Iniciar sessão à direita da página e, quando solicitado, insira suas credenciais da conta Oracle.
* Siga as instruções à direita da página para aceitar o acordo de licença.
* Faça login no OCR com seu cliente de contêiner usando, por exemplo, o comando `docker login`:

  ```
  # docker login container-registry.oracle.com
  Username: Oracle-Account-ID
  Password: password
  Login successful.
  ```

Descarregue a imagem Docker para a Edição Empresarial do MySQL do OCR com este comando:

```
docker pull container-registry.oracle.com/mysql/enterprise-server:tag
```

Para baixar a imagem da Edição Empresarial do MySQL do site [My Oracle Support](https://support.oracle.com/), acesse o site, faça login na sua conta Oracle e, após chegar na página inicial, siga estes passos:

* Selecione a aba Patches and Updates.
* Vá para a região Patch Search e, na aba Search, mude para a subcategoria Product or Family (Advanced).
* Insira "MySQL Server" no campo Product e o número de versão desejado no campo Release.
* Use os menus suspensivos para filtros adicionais para selecionar Description—contains e insira "Docker" no campo de texto.

A figura a seguir mostra as configurações de pesquisa para a imagem do MySQL Enterprise Edition para o MySQL Server 8.0:

![Diagrama mostrando as configurações de pesquisa para a imagem do MySQL Enterprise](images/docker-search2.png)
* Clique no botão Search e, na lista de resultados, selecione a versão desejada e clique no botão Download.
* Na caixa de diálogo File Download que aparece, clique e faça o download do arquivo `.zip` para a imagem Docker.

Descompacte o arquivo `.zip` baixado para obter o tarball por dentro (`mysql-enterprise-server-version.tar`) e, em seguida, carregue a imagem executando este comando:

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

*`image_name`* é o nome da imagem a ser usada para iniciar o container; consulte Baixar uma imagem Docker do servidor MySQL para obter mais informações.

A opção `--name`, para fornecer um nome personalizado para o seu container do servidor, é opcional; se não for fornecido um nome de container, um nome aleatório é gerado.

A opção `--restart` é para configurar a [política de reinício](https://docs.docker.com/config/containers/start-containers-automatically/) do seu container; deve ser definida para o valor `on-failure`, para habilitar o suporte ao reinício do servidor dentro de uma sessão do cliente (o que acontece, por exemplo, quando a instrução `RESTART` é executada por um cliente ou durante a configuração de uma instância do InnoDB Cluster). Com o suporte ao reinício habilitado, emitir um reinício dentro de uma sessão do cliente faz com que o servidor e o container sejam interrompidos e, em seguida, reiniciados.

Por exemplo, para iniciar um novo container Docker para o Servidor MySQL Community, use este comando:

```
docker run --name=mysql1 --restart on-failure -d container-registry.oracle.com/mysql/community-server:latest
```

Para iniciar um novo container Docker para o Servidor MySQL Enterprise com uma imagem Docker baixada do OCR, use este comando:

```
docker run --name=mysql1 --restart on-failure -d container-registry.oracle.com/mysql/enterprise-server:latest
```

Para iniciar um novo container Docker para o Servidor MySQL Enterprise com uma imagem Docker baixada do My Oracle Support, use este comando:

```
docker run --name=mysql1 --restart on-failure -d mysql/enterprise-server:latest
```

Se a imagem Docker do nome e tag especificados não tiver sido baixada por um comando `docker pull` ou `docker run` anterior, a imagem agora é baixada. A inicialização do container começa, e o container aparece na lista de containers em execução quando você executa o comando `docker ps`. Por exemplo:

```bash
$> docker ps
CONTAINER ID   IMAGE                                                         COMMAND                  CREATED          STATUS                    PORTS                       NAMES
4cd4129b3211   container-registry.oracle.com/mysql/community-server:latest   "/entrypoint.sh mysq…"   8 seconds ago    Up 7 seconds (health: starting)   3306/tcp, 33060-33061/tcp   mysql1
```

A inicialização do container pode levar algum tempo. Quando o servidor estiver pronto para uso, a `STATUS` do container na saída do comando `docker ps` muda de `(health: starting)` para `(healthy)`.

A opção `-d` usada no comando `docker run` acima faz com que o container seja executado em segundo plano. Use este comando para monitorar a saída do container:

```
docker logs mysql1
```SmXVcSDg5m```
$> docker logs mysql1 2>&1 | grep GENERATED
GENERATED ROOT PASSWORD: Axegh3kAJyDLaRuBemecis&EShOs
```CrY6vzZcrR```
docker exec -it mysql1 mysql -uroot -p
```IWAlpyMYQI```
mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'password';
```XYekzSHWrH```
$> docker exec -it mysql1 bash
bash-4.2#
```5hZD0Cvafb```
bash-4.2# ls /var/lib/mysql
auto.cnf    ca.pem	     client-key.pem  ib_logfile0  ibdata1  mysql       mysql.sock.lock	   private_key.pem  server-cert.pem  sys
ca-key.pem  client-cert.pem  ib_buffer_pool  ib_logfile1  ibtmp1   mysql.sock  performance_schema  public_key.pem   server-key.pem
```PAgt4n68R2```
docker stop mysql1
```VggWswPCBU```
docker start mysql1
```IU9T7Y2327```
docker restart mysql1
```sNCXHehzVk```
docker stop mysql1
```i5kQgufnYs```
docker rm mysql1
```klOjuIGSYd```
  docker stop mysql84
  ```UKCLtcVAV4```
  docker run --name=mysql84 \
     --mount type=bind,src=/path-on-host-machine/my.cnf,dst=/etc/my.cnf \
     --mount type=bind,src=/path-on-host-machine/datadir,dst=/var/lib/mysql \
     -d container-registry.oracle.com/mysql/community-server:9.5
  ```roUca5hdAb```
docker pull container-registry.oracle.com/mysql/community-server:9.5
```F4GGYUZYZY```

##### Mais Tópicos sobre a Implantação do Servidor MySQL com Docker

Para mais tópicos sobre a implantação do Servidor MySQL com Docker, como configuração do servidor, persistência de dados e configuração, log de erro do servidor e variáveis de ambiente do contêiner.