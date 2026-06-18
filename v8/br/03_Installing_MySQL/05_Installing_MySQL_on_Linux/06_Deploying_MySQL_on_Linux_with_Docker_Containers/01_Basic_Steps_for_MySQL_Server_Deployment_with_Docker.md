#### 2.5.6.1 Passos básicos para a implantação do servidor MySQL com o Docker

Aviso

As imagens do Docker do MySQL mantidas pela equipe do MySQL são construídas especificamente para plataformas Linux. Outras plataformas não são suportadas, e os usuários que usam essas imagens do Docker do MySQL nelas estão fazendo isso por conta própria. Veja a discussão aqui para algumas limitações conhecidas para executar esses contêineres em sistemas operacionais não Linux.

- Baixar uma imagem Docker do servidor MySQL
- Começando uma Instância do Servidor MySQL
- Conectando-se ao servidor MySQL a partir do interior do Container
- Acesso à Shell do Contenedor
- Parar e excluir um contêiner MySQL
- Atualizando um contêiner do servidor MySQL
- Mais tópicos sobre a implantação do servidor MySQL com o Docker

##### Baixar uma imagem Docker do servidor MySQL

Importante

*Para usuários da Edição Empresarial do MySQL*: Uma assinatura é necessária para usar as imagens do Docker para a Edição Empresarial do MySQL. As assinaturas funcionam com o modelo "Traga Sua Própria Licença"; consulte Como Comprar Produtos e Serviços do MySQL para obter detalhes.

Não é estritamente necessário fazer o download da imagem do servidor em uma etapa separada; no entanto, realizar essa etapa antes de criar seu contêiner Docker garante que sua imagem local esteja atualizada. Para fazer o download da imagem da MySQL Community Edition do Oracle Container Registry (OCR), execute o seguinte comando:

```
docker pull container-registry.oracle.com/mysql/community-server:tag
```

O `tag` é o rótulo para a versão da imagem que você deseja baixar (por exemplo, `5.7`, `8.0` ou `latest`). Se o rótulo `:tag` for omitido, o rótulo `latest` será usado e a imagem da versão mais recente do MySQL Community Server será baixada.

Para baixar a imagem da Edição Empresarial do MySQL do OCR, você precisa aceitar primeiro o acordo de licença no OCR e fazer login no repositório do contêiner com seu cliente Docker. Siga estes passos:

- Visite o OCR em <https://container-registry.oracle.com/> e escolha MySQL.

- Na lista de repositórios do MySQL, escolha `enterprise-server`.

- Se você ainda não se conectou ao OCR, clique no botão Conectar no lado direito da página e, em seguida, insira suas credenciais da conta Oracle quando solicitado.

- Siga as instruções à direita da página para aceitar o acordo de licença.

- Faça login no OCR com seu cliente de contêiner usando, por exemplo, o comando `docker login`:

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

Para baixar a imagem da Edição Empresarial do MySQL do site do My Oracle Support, acesse o site, faça login na sua conta da Oracle e siga estes passos após chegar na página inicial:

- Selecione a aba Patches e atualizações.

- Vá para a região de Pesquisa de patches e, na guia Pesquisa, mude para a subguia Produto ou Família (Avançado).

- Digite "MySQL Server" no campo Produto e o número da versão desejada no campo Versão.

- Use os menus suspensivos para filtros adicionais para selecionar Descrição — contém e insira “Docker” no campo de texto.

  A figura a seguir mostra as configurações de pesquisa para a imagem da Edição Empresarial do MySQL para o MySQL Server 8.0:

  ![Diagram showing search settings for MySQL Enterprise image](images/docker-search2.png)

- Clique no botão Pesquisar e, na lista de resultados, selecione a versão desejada e clique no botão Baixar.

- Na caixa de diálogo Baixar arquivo que aparecer, clique e baixe o arquivo `.zip` para a imagem do Docker.

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

##### Começando uma Instância do Servidor MySQL

Para iniciar um novo contêiner Docker para um servidor MySQL, use o seguinte comando:

```
docker run --name=container_name  --restart on-failure -d image_name:tag
```

`image_name` é o nome da imagem a ser usada para iniciar o contêiner; consulte Baixar uma imagem Docker do servidor MySQL para obter mais informações.

A opção `--name`, para fornecer um nome personalizado para o seu contêiner do servidor, é opcional; se não for fornecido um nome de contêiner, um nome aleatório será gerado.

A opção `--restart` é para configurar a política de reinício para o seu contêiner; ela deve ser definida para o valor `on-failure`, para habilitar o suporte para o reinício do servidor dentro de uma sessão do cliente (o que acontece, por exemplo, quando a instrução RESTART é executada por um cliente ou durante a configuração de uma instância de cluster InnoDB). Com o suporte para reinício habilitado, emitir um reinício dentro de uma sessão do cliente faz com que o servidor e o contêiner sejam interrompidos e, em seguida, reiniciados. *O suporte para reinício do servidor está disponível para o MySQL 8.0.21 e versões posteriores.*

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

Se a imagem Docker do nome e da tag especificados não tiver sido baixada por um comando anterior **docker pull** ou **docker run**, a imagem agora será baixada. O inicialização do container começa e o container aparecerá na lista de containers em execução quando você executar o comando **docker ps**. Por exemplo:

```
$> docker ps
CONTAINER ID   IMAGE                                                         COMMAND                  CREATED          STATUS                    PORTS                       NAMES
4cd4129b3211   container-registry.oracle.com/mysql/community-server:latest   "/entrypoint.sh mysq…"   8 seconds ago    Up 7 seconds (health: starting)   3306/tcp, 33060-33061/tcp   mysql1
```

A inicialização do contêiner pode levar algum tempo. Quando o servidor estiver pronto para uso, o `STATUS` do contêiner na saída do comando **docker ps** muda de `(health: starting)` para `(healthy)`.

A opção `-d` usada no comando **docker run** acima faz com que o container seja executado em segundo plano. Use este comando para monitorar a saída do container:

```
docker logs mysql1
```

Depois que a inicialização estiver concluída, a saída do comando conterá a senha aleatória gerada para o usuário root; verifique a senha com, por exemplo, este comando:

```
$> docker logs mysql1 2>&1 | grep GENERATED
GENERATED ROOT PASSWORD: Axegh3kAJyDLaRuBemecis&EShOs
```

##### Conectando-se ao servidor MySQL a partir do interior do Container

Depois que o servidor estiver pronto, você pode executar o cliente **mysql** dentro do contêiner do Servidor MySQL que você acabou de iniciar e conectá-lo ao Servidor MySQL. Use o comando **docker exec -it** para iniciar um cliente **mysql** dentro do contêiner Docker que você iniciou, como o seguinte:

```
docker exec -it mysql1 mysql -uroot -p
```

Quando solicitado, insira a senha de raiz gerada (veja o último passo em Iniciar uma Instância do Servidor MySQL acima sobre como encontrar a senha). Como a opção `MYSQL_ONETIME_PASSWORD` é verdadeira por padrão, após você ter conectado um cliente **mysql** ao servidor, você deve reiniciar a senha de raiz do servidor emitindo esta declaração:

```
mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'password';
```

Substitua `password` pela senha de sua escolha. Após a senha ser redefinida, o servidor estará pronto para uso.

##### Acesso à Shell do Contenedor

Para ter acesso à shell do seu contêiner do servidor MySQL, use o comando **docker exec -it** para iniciar uma shell bash dentro do contêiner:

```
$> docker exec -it mysql1 bash
bash-4.2#
```

Você pode, então, executar comandos Linux dentro do contêiner. Por exemplo, para visualizar o conteúdo do diretório de dados do servidor dentro do contêiner, use este comando:

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

O comando **docker stop** envia um sinal SIGTERM ao processo **mysqld**, para que o servidor seja desligado de forma suave.

Observe também que, quando o processo principal de um contêiner (**mysqld** no caso de um contêiner do Servidor MySQL) é interrompido, o contêiner Docker também é interrompido automaticamente.

Para reiniciar o contêiner do MySQL Server:

```
docker start mysql1
```

Para parar e reiniciar o contêiner do servidor MySQL com um único comando:

```
docker restart mysql1
```

Para excluir o contêiner MySQL, primeiro pare-o e, em seguida, use o comando **docker rm**:

```
docker stop mysql1
```

```
docker rm mysql1
```

Se você deseja que o volume Docker do diretório de dados do servidor seja excluído ao mesmo tempo, adicione a opção `-v` ao comando **docker rm**.

##### Atualizando um contêiner do servidor MySQL

Importante

- Antes de realizar qualquer atualização no MySQL, siga cuidadosamente as instruções do Capítulo 3, *Atualizando o MySQL*. Entre outras instruções discutidas, é especialmente importante fazer backup do seu banco de dados antes da atualização.

- As instruções nesta seção exigem que os dados e configurações do servidor tenham sido persistidos no host. Consulte Persistência de Alterações de Dados e Configurações para obter detalhes.

Siga estes passos para atualizar uma instalação do Docker do MySQL 5.7 para 8.0:

- Pare o servidor MySQL 5.7 (o nome do contêiner é `mysql57` neste exemplo):

  ```
  docker stop mysql57
  ```

- Baixe a imagem do Docker do servidor MySQL 8.0. Veja as instruções em Baixar uma imagem do Docker do servidor MySQL. Certifique-se de usar a tag correta para o MySQL 8.0.

- Comece um novo contêiner Docker MySQL 8.0 (nomeado `mysql80` neste exemplo) com os dados e configurações do servidor antigo (com as devidas modificações, se necessário — consulte o Capítulo 3, *Atualizando o MySQL*) que foram persistidos no host (por meio de montagem de vínculo neste exemplo). Para o MySQL Community Server, execute o seguinte comando:

  ```
  docker run --name=mysql80 \
     --mount type=bind,src=/path-on-host-machine/my.cnf,dst=/etc/my.cnf \
     --mount type=bind,src=/path-on-host-machine/datadir,dst=/var/lib/mysql \
     -d container-registry.oracle.com/mysql/community-server:8.0
  ```

  Se necessário, ajuste `container-registry.oracle.com/mysql/community-server` com o nome correto da imagem — por exemplo, substitua-o por `container-registry.oracle.com/mysql/enterprise-server` para imagens da MySQL Enterprise Edition baixadas do OCR, ou `mysql/enterprise-server` para imagens da MySQL Enterprise Edition baixadas do My Oracle Support.

- Aguarde o servidor terminar a inicialização. Você pode verificar o status do servidor usando o comando **docker ps** (veja Como iniciar uma instância do servidor MySQL para saber como fazer isso).

Siga os mesmos passos para a atualização dentro da série 8.0 (ou seja, do lançamento 8.0.`x` para 8.0.`y`): pare o contêiner original e inicie um novo com uma imagem mais recente nos dados e configuração do servidor antigo. Se você usou a tag `8.0` ou `latest` ao iniciar o seu contêiner original e agora há uma nova versão do MySQL 8.0 para a qual você deseja fazer a atualização, você deve primeiro puxar a imagem para a nova versão com o comando:

```
docker pull container-registry.oracle.com/mysql/community-server:8.0
```

Em seguida, você pode fazer a atualização iniciando um *novo* contêiner com a mesma tag nos dados e configuração antigos (ajuste o nome da imagem, se você estiver usando a Edição Empresarial do MySQL; veja Baixar uma Imagem Docker do Servidor MySQL):

```
docker run --name=mysql80new \
   --mount type=bind,src=/path-on-host-machine/my.cnf,dst=/etc/my.cnf \
   --mount type=bind,src=/path-on-host-machine/datadir,dst=/var/lib/mysql \
-d container-registry.oracle.com/mysql/community-server:8.0
```

Nota

*Para MySQL 8.0.15 e versões anteriores:* Você precisa concluir o processo de atualização executando o utilitário mysql\_upgrade no contêiner do Servidor MySQL 8.0 (o passo *não* é necessário para o MySQL 8.0.16 e versões posteriores):

- ```docker exec -it mysql80 mysql_upgrade -uroot -p
  ```

  Quando solicitado, insira a senha de root do seu servidor antigo.
- Finalize a atualização reiniciando o novo contêiner:

  ```
  docker restart mysql80
  ```

##### Mais tópicos sobre a implantação do servidor MySQL com o Docker

Para mais tópicos sobre a implantação do MySQL Server com Docker, como configuração do servidor, persistência de dados e configuração, log de erros do servidor e variáveis de ambiente do container, consulte a Seção 2.5.6.2, “Mais tópicos sobre a implantação do MySQL Server com Docker”.
