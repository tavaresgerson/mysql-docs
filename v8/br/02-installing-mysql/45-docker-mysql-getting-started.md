#### 2.5.6.1 Etapas básicas para a implantação do MySQL Server com o Docker

Advertência

As imagens do MySQL Docker mantidas pela equipe do MySQL são construídas especificamente para plataformas Linux. Outras plataformas não são suportadas, e os usuários que usam essas imagens do MySQL Docker nelas o fazem por sua conta e risco. Veja a discussão aqui para algumas limitações conhecidas para executar esses contêineres em sistemas operacionais não-Linux.

- Descarregar uma imagem do Docker do servidor MySQL
- Iniciar uma instância do servidor MySQL
- Conexão ao servidor MySQL a partir do contêiner
- Acesso ao shell de contêiner
- Parar e excluir um contêiner MySQL
- Atualizar um contêiner do servidor MySQL
- Mais tópicos sobre a implantação do MySQL Server com o Docker

##### Descarregar uma imagem do Docker do servidor MySQL

Importância

- Para usuários do MySQL Enterprise Edition \*: É necessária uma assinatura para usar as imagens do Docker para o MySQL Enterprise Edition. As assinaturas funcionam por um modelo de Bring Your Own License; veja \[Como comprar produtos e serviços MySQL] para detalhes.

Fazer o download da imagem do servidor em uma etapa separada não é estritamente necessário; no entanto, executar esta etapa antes de criar seu contêiner do Docker garante que sua imagem local esteja atualizada. Para fazer o download da imagem da Edição Comunitária do MySQL do \[Oracle Container Registry (OCR) ], execute este comando:

```
docker pull container-registry.oracle.com/mysql/community-server:tag
```

O `tag` é o rótulo para a versão da imagem que você deseja extrair (por exemplo, `8.4`, ou `9.5`, ou `latest`). Se `:tag` for omitido, o rótulo `latest` é usado, e a imagem para a última versão do GA (que é a última versão de inovação) do MySQL Community Server é baixada.

Para baixar a imagem MySQL Enterprise Edition do OCR, você precisa primeiro aceitar o contrato de licença no OCR e fazer login no repositório do container com o seu cliente Docker. Siga estas etapas:

- Visite o OCR em <https://container-registry.oracle.com/> e escolha MySQL.
- Na lista de repositórios MySQL, escolha `enterprise-server`.
- Se você ainda não fez login no OCR, clique no botão Sign in à direita da página e, em seguida, insira suas credenciais de conta Oracle quando solicitado.
- Siga as instruções à direita da página para aceitar o contrato de licença.
- Faça login no OCR com o seu cliente de contêiner usando, por exemplo, o comando `docker login`:

  ```
  # docker login container-registry.oracle.com
  Username: Oracle-Account-ID
  Password: password
  Login successful.
  ```

Baixe a imagem do Docker para MySQL Enterprise Edition do OCR com este comando:

```
docker pull  container-registry.oracle.com/mysql/enterprise-server:tag
```

Para baixar a imagem MySQL Enterprise Edition do site \[My Oracle Support] (<https://support.oracle.com/>), acesse o site, faça login na sua conta Oracle e execute as seguintes etapas quando estiver na página de destino:

- Selecione a aba Patches and Updates.
- Vá para a região de Pesquisa de Patch e, na guia Pesquisa, mude para a subtabula Produto ou Família (Avançado).
- Insira MySQL Server no campo Produto e o número de versão desejado no campo Release.
- Utilize as listas suspensas para filtros adicionais para selecionar Descriptioncontains, e digite Docker no campo de texto.

  A figura a seguir mostra as configurações de pesquisa para a imagem MySQL Enterprise Edition para MySQL Server 8.0:

  ![Diagram showing search settings for MySQL Enterprise image](images/docker-search2.png)
- Clique no botão Pesquisar e, na lista de resultados, selecione a versão desejada e clique no botão Baixar.
- Na caixa de diálogo Download de arquivo que aparece, clique e baixe o arquivo `.zip` para a imagem do Docker.

Desbloqueie o arquivo `.zip` baixado para obter a bola de alcatrão no interior (`mysql-enterprise-server-version.tar`), e carregue a imagem executando este comando:

```
docker load -i mysql-enterprise-server-version.tar
```

Você pode listar as imagens do Docker baixadas com este comando:

```
$> docker images
REPOSITORY                                             TAG       IMAGE ID       CREATED        SIZE
container-registry.oracle.com/mysql/community-server   latest    1d9c2219ff69   2 months ago   496MB
```

##### Iniciar uma instância do servidor MySQL

Para iniciar um novo contêiner Docker para um servidor MySQL, use o seguinte comando:

```
docker run --name=container_name  --restart on-failure -d image_name:tag
```

`image_name` é o nome da imagem a ser usada para iniciar o contêiner; veja Downloading a MySQL Server Docker Image para mais informações.

A opção `--name`, para fornecer um nome personalizado para o contêiner do servidor, é opcional; se nenhum nome de contêiner for fornecido, um aleatório é gerado.

A opção `--restart` é para configurar a política de reinicialização \[<https://docs.docker.com/config/containers/start-containers-automatically/>] para o seu contêiner; ela deve ser definida para o valor `on-failure`, para permitir o suporte ao reinicio do servidor dentro de uma sessão do cliente (o que acontece, por exemplo, quando a instrução RESTART é executada por um cliente ou durante a configuração de uma instância de cluster InnoDB). Com o suporte ao reinicio ativado, emitir um reinicio dentro de uma sessão do cliente faz com que o servidor e o contêiner parem e depois reiniciem.

Por exemplo, para iniciar um novo contêiner Docker para o MySQL Community Server, use este comando:

```
docker run --name=mysql1 --restart on-failure -d container-registry.oracle.com/mysql/community-server:latest
```

Para iniciar um novo contêiner do Docker para o MySQL Enterprise Server com uma imagem do Docker baixada do OCR, use este comando:

```
docker run --name=mysql1 --restart on-failure -d container-registry.oracle.com/mysql/enterprise-server:latest
```

Para iniciar um novo contêiner do Docker para o MySQL Enterprise Server com uma imagem do Docker baixada do My Oracle Support, use este comando:

```
docker run --name=mysql1 --restart on-failure -d mysql/enterprise-server:latest
```

Se a imagem do Docker do nome e da tag especificados não tiver sido baixada por um comando anterior do `docker pull` ou do `docker run`, a imagem será agora baixada. Inicialização para o contêiner começa, e o contêiner aparece na lista de contêineres em execução quando você executa o comando do **docker ps**. Por exemplo:

```
$> docker ps
CONTAINER ID   IMAGE                                                         COMMAND                  CREATED          STATUS                    PORTS                       NAMES
4cd4129b3211   container-registry.oracle.com/mysql/community-server:latest   "/entrypoint.sh mysq…"   8 seconds ago    Up 7 seconds (health: starting)   3306/tcp, 33060-33061/tcp   mysql1
```

A inicialização do contêiner pode levar algum tempo. Quando o servidor está pronto para uso, o `STATUS` do contêiner na saída do comando **docker ps** muda de `(health: starting)` para `(healthy)`.

A opção `-d` usada no comando `docker run` acima faz com que o contêiner seja executado em segundo plano. Use este comando para monitorar a saída do contêiner:

```
docker logs mysql1
```

Uma vez terminada a inicialização, a saída do comando conterá a senha aleatória gerada para o usuário raiz; verifique a senha com, por exemplo, este comando:

```
$> docker logs mysql1 2>&1 | grep GENERATED
GENERATED ROOT PASSWORD: Axegh3kAJyDLaRuBemecis&EShOs
```

##### Conexão ao servidor MySQL a partir do contêiner

Uma vez que o servidor esteja pronto, você pode executar o cliente `mysql` dentro do contêiner do MySQL Server que você acabou de iniciar e conectá-lo ao MySQL Server. Use o comando **docker exec -it** para iniciar um cliente `mysql` dentro do contêiner do Docker que você iniciou, como o seguinte:

```
docker exec -it mysql1 mysql -uroot -p
```

Quando solicitado, insira a senha raiz gerada (veja a última etapa em Iniciar uma Instância do Servidor MySQL acima sobre como encontrar a senha). Como a opção `MYSQL_ONETIME_PASSWORD` é verdadeira por padrão, depois de conectar um cliente `mysql` ao servidor, você deve redefinir a senha raiz do servidor emitindo esta instrução:

```
mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'password';
```

Substitua `password` pela senha de sua escolha. Uma vez que a senha for redefinida, o servidor estará pronto para uso.

##### Acesso ao shell de contêiner

Para ter acesso do shell ao seu contêiner do MySQL Server, use o comando **docker exec -it** para iniciar um shell bash dentro do contêiner:

```
$> docker exec -it mysql1 bash
bash-4.2#
```

Você pode então executar comandos do Linux dentro do contêiner. Por exemplo, para ver o conteúdo no diretório de dados do servidor dentro do contêiner, use este comando:

```
bash-4.2# ls /var/lib/mysql
auto.cnf    ca.pem	     client-key.pem  ib_logfile0  ibdata1  mysql       mysql.sock.lock	   private_key.pem  server-cert.pem  sys
ca-key.pem  client-cert.pem  ib_buffer_pool  ib_logfile1  ibtmp1   mysql.sock  performance_schema  public_key.pem   server-key.pem
```

##### Parar e excluir um contêiner MySQL

Para parar o contêiner MySQL Server que criamos, use este comando:

```
docker stop mysql1
```

**docker stop** envia um sinal SIGTERM para o processo `mysqld`, para que o servidor seja desligado graciosamente.

Observe também que quando o processo principal de um contêiner ( \*\* mysqld \*\* no caso de um contêiner do MySQL Server) é interrompido, o contêiner do Docker é interrompido automaticamente.

Para reiniciar o contêiner do MySQL Server:

```
docker start mysql1
```

Para parar e reiniciar o contêiner do MySQL Server com um único comando:

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

Se você quiser que o volume do Docker para o diretório de dados do servidor seja excluído ao mesmo tempo, adicione a opção `-v` ao comando **docker rm**.

##### Atualizar um contêiner do servidor MySQL

Importância

- Antes de executar qualquer atualização para o MySQL, siga cuidadosamente as instruções no Capítulo 3, *Atualização do MySQL*. Entre outras instruções discutidas lá, é especialmente importante fazer backup do seu banco de dados antes da atualização.
- As instruções nesta secção exigem que os dados e a configuração do servidor tenham sido mantidos no host. Ver Persisting Data and Configuration Changes para mais detalhes.

Siga estas etapas para atualizar uma instalação do Docker do MySQL 8.4 para 9.5:

- Parar o servidor MySQL 8.4 (o nome do contêiner é `mysql84` neste exemplo):

  ```
  docker stop mysql84
  ```
- Baixe a imagem do Docker do servidor MySQL 9.5. Veja as instruções em Baixar uma imagem do Docker do servidor MySQL. Certifique-se de usar a tag correta para o MySQL 9.5.
- Iniciar um novo contêiner do MySQL 9.5 Docker (nomeado `mysql95` neste exemplo) com os dados e configuração do servidor antigos (com modificações apropriadas se necessário  ver Capítulo 3, \* Atualização do MySQL\*) que foram persistentes no host (por montagem de ligação neste exemplo). Para o servidor comunitário do MySQL, execute este comando:

  ```
  docker run --name=mysql84 \
     --mount type=bind,src=/path-on-host-machine/my.cnf,dst=/etc/my.cnf \
     --mount type=bind,src=/path-on-host-machine/datadir,dst=/var/lib/mysql \
     -d container-registry.oracle.com/mysql/community-server:9.5
  ```

  Se necessário, ajuste `container-registry.oracle.com/mysql/community-server` para o nome de imagem corretopor exemplo, substitua-o por `container-registry.oracle.com/mysql/enterprise-server` para imagens da MySQL Enterprise Edition baixadas do OCR, ou `mysql/enterprise-server` para imagens da MySQL Enterprise Edition baixadas do My Oracle Support.
- Você pode verificar o status do servidor usando o comando **docker ps** (veja Starting a MySQL Server Instance para saber como fazer isso).

Siga as mesmas etapas para atualização dentro da série 9.5 (ou seja, da versão 9.5. `x` para 9.5. `y`): pare o contêiner original e inicie um novo com uma imagem mais nova nos dados e configuração do servidor antigo. Se você usou a tag 9.5 ou a tag `latest` ao iniciar seu contêiner original e agora há uma nova versão do MySQL 9.5 que você deseja atualizar, você deve primeiro puxar a imagem para a nova versão com o comando:

```
docker pull container-registry.oracle.com/mysql/community-server:9.5
```

Você pode então atualizar iniciando um \* novo \* contêiner com a mesma tag nos dados e configuração antigos (ajuste o nome da imagem se você estiver usando o MySQL Enterprise Edition; veja Downloading a MySQL Server Docker Image):

```
docker run --name=mysql84new \
   --mount type=bind,src=/path-on-host-machine/my.cnf,dst=/etc/my.cnf \
   --mount type=bind,src=/path-on-host-machine/datadir,dst=/var/lib/mysql \
-d container-registry.oracle.com/mysql/community-server:9.5
```

##### Mais tópicos sobre a implantação do MySQL Server com o Docker

Para mais tópicos sobre a implantação do MySQL Server com o Docker, como configuração do servidor, dados e configuração persistentes, registro de erros do servidor e variáveis de ambiente de contêiner, consulte a Seção 2.5.6.2, "Mais tópicos sobre a implantação do MySQL Server com o Docker".
