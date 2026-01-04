#### 2.5.7.2 Mais tópicos sobre implantação do servidor MySQL com Docker

::: info Nota
A maioria dos comandos da amostra abaixo tem `mysql/mysql-server` como o repositório da imagem Docker, quando isso precisa ser especificado (como nos comandos **docker pull** e **docker run**); mude isso se sua imagem vier de outro repositório — por exemplo, substitua por `container-registry.oracle.com/mysql/enterprise-server` para imagens da Edição Empresarial do MySQL baixadas do Oracle Container Registry (OCR), ou `mysql/enterprise-server` para imagens da Edição Empresarial do MySQL baixadas do [My Oracle Support](https://support.oracle.com/).
:::

- A Instalação MySQL Otimizada para Docker
- Configurando o servidor MySQL
- Mudanças persistentes de dados e configuração
- Executar scripts de inicialização adicionais
- Conectar-se ao MySQL a partir de uma aplicação em outro contêiner Docker
- Registro de erros do servidor
- Problemas conhecidos
- Variáveis de ambiente do Docker

##### A Instalação MySQL Otimizada para Docker

As imagens Docker para MySQL são otimizadas para o tamanho do código, o que significa que elas incluem apenas os componentes cruciais que são esperados para serem relevantes para a maioria dos usuários que executam instâncias do MySQL em contêineres Docker. Uma instalação do MySQL Docker é diferente de uma instalação comum, não Docker, nos seguintes aspectos:

- Os binários incluídos são limitados a:
  + `/usr/bin/my_print_defaults`
  + `/usr/bin/mysql`
  + `/usr/bin/mysql_config`
  + `/usr/bin/mysql_install_db`
  + `/usr/bin/mysql_tzinfo_to_sql`
  + `/usr/bin/mysql_upgrade`
  + `/usr/bin/mysqladmin`
  + `/usr/bin/mysqlcheck`
  + `/usr/bin/mysqldump`
  + `/usr/bin/mysqlpump`
  + `/usr/sbin/mysqld`
- Todos os binários são desprovidos de informações de depuração; eles não contêm informações de depuração.

##### Configurando o servidor MySQL

Ao iniciar o contêiner MySQL Docker, você pode passar opções de configuração para o servidor através do comando **docker run**. Por exemplo:

```shell
docker run --name mysql1 -d mysql/mysql-server:tag --character-set-server=utf8mb4 --collation-server=utf8mb4_col
```

O comando inicia o servidor MySQL com `utf8mb4` como conjunto de caracteres padrão e `utf8mb4_col` como collation padrão para seus bancos de dados.

Outra maneira de configurar o MySQL Server é preparar um arquivo de configuração e montá-lo no local do arquivo de configuração do servidor dentro do contêiner. Veja Persistência de Dados e Alterações de Configuração para detalhes.

##### Mudanças persistentes de dados e configuração

Os contêineres Docker são, em princípio, efêmeros, e espera-se que quaisquer dados ou configurações sejam perdidos se o contêiner for excluído ou corrompido (veja as discussões [aqui](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/)). No entanto, os [volumes Docker](https://docs.docker.com/engine/admin/volumes/volumes/) fornecem um mecanismo para persistir dados criados dentro de um contêiner Docker. Na sua inicialização, o contêiner do MySQL Server cria um volume Docker para o diretório de dados do servidor. A saída JSON para executar o comando **docker inspect** no contêiner tem uma chave `Mount`, cujo valor fornece informações sobre o volume do diretório de dados:

```shell
$> docker inspect mysql1
...
 "Mounts": [
            {
                "Type": "volume",
                "Name": "4f2d463cfc4bdd4baebcb098c97d7da3337195ed2c6572bc0b89f7e845d27652",
                "Source": "/var/lib/docker/volumes/4f2d463cfc4bdd4baebcb098c97d7da3337195ed2c6572bc0b89f7e845d27652/_data",
                "Destination": "/var/lib/mysql",
                "Driver": "local",
                "Mode": "",
                "RW": true,
                "Propagation": ""
            }
        ],
...
```

A saída mostra que a pasta de origem `/var/lib/docker/volumes/4f2d463cfc4bdd4baebcb098c97d7da33337195ed2c6572bc0b89f7e845d27652/_data`, na qual os dados são persistentes no host, foi montada em `/var/lib/mysql`, o diretório de dados do servidor dentro do contêiner.

Outra maneira de preservar os dados é [ligar-montar](https://docs.docker.com/engine/reference/commandline/service_create/#add-bind-mounts-or-volumes) um diretório do host usando a opção `--mount` ao criar o contêiner. A mesma técnica pode ser usada para persistir a configuração do servidor. O comando a seguir cria um contêiner do MySQL Server e liga-montar tanto o diretório de dados quanto o arquivo de configuração do servidor:

```shell
docker run --name=mysql1 \
--mount type=bind,src=/path-on-host-machine/my.cnf,dst=/etc/my.cnf \
--mount type=bind,src=/path-on-host-machine/datadir,dst=/var/lib/mysql \
-d mysql/mysql-server:tag
```

O comando monta `path-on-host-machine/my.cnf` em `/etc/my.cnf` (o arquivo de configuração do servidor dentro do contêiner) e `path-on-host-machine/datadir` em `/var/lib/mysql` (o diretório de dados dentro do contêiner). As seguintes condições devem ser atendidas para que o montagem por vinculação funcione:

- O arquivo de configuração `path-on-host-machine/my.cnf` já deve existir e deve conter a especificação para iniciar o servidor usando o usuário `mysql`:

  ```shell
  [mysqld]
  user=mysql
  ```

  Você também pode incluir outras opções de configuração do servidor no arquivo.

- O diretório de dados `path-on-host-machine/datadir` já deve existir. Para que a inicialização do servidor ocorra, o diretório deve estar vazio. Você também pode montar um diretório pré-preenchido com dados e iniciar o servidor com ele; no entanto, você deve garantir que inicie o contêiner Docker com a mesma configuração do servidor que criou os dados, e quaisquer arquivos ou diretórios do host necessários devem ser montados ao iniciar o contêiner.

##### Executar scripts de inicialização adicionais

Se houver quaisquer scripts `.sh` ou `.sql` que você queira executar no banco de dados imediatamente após ele ter sido criado, você pode colocá-los em um diretório hospedeiro e, em seguida, montar o diretório em `/docker-entrypoint-initdb.d/` dentro do contêiner. Por exemplo:

```shell
docker run --name=mysql1 \
--mount type=bind,src=/path-on-host-machine/scripts/,dst=/docker-entrypoint-initdb.d/ \
-d mysql/mysql-server:tag
```

##### Conectar-se ao MySQL a partir de uma aplicação em outro contêiner Docker

Ao configurar uma rede Docker, você pode permitir que vários contêineres Docker se comuniquem entre si, para que um aplicativo cliente em outro contêiner Docker possa acessar o servidor MySQL no contêiner do servidor. Primeiro, crie uma rede Docker:

```shell
docker network create my-custom-net
```

Depois, ao criar e iniciar os contêineres do servidor e do cliente, use a opção `--network` para colocá-los na rede que você criou. Por exemplo:

```shell
docker run --name=mysql1 --network=my-custom-net -d mysql/mysql-server
```

```shell
docker run --name=myapp1 --network=my-custom-net -d myapp
```

O contêiner `myapp1` pode então se conectar ao contêiner `mysql1` com o nome de host `mysql1` e vice-versa, pois o Docker configura automaticamente um DNS para os nomes de contêineres fornecidos. No exemplo a seguir, executamos o cliente **`mysql`** do interior do contêiner `myapp1`para se conectar ao host`mysql1\` em seu próprio contêiner:

```shell
docker exec -it myapp1 mysql --host=mysql1 --user=myuser --password
```

Para outras técnicas de rede para containers, consulte a seção [Docker container networking](https://docs.docker.com/engine/userguide/networking/) na documentação do Docker.

##### Registro de erros do servidor

Quando o MySQL Server é iniciado pela primeira vez com o seu contêiner do servidor, um log de erro do servidor NÃO é gerado se uma das seguintes condições for verdadeira:

- Um arquivo de configuração do servidor do host foi montado, mas o arquivo não contém a variável de sistema `log_error` (veja Manter alterações de dados e configuração ao vincular um arquivo de configuração do servidor).

- Um arquivo de configuração do servidor do host não foi montado, mas a variável de ambiente Docker `MYSQL_LOG_CONSOLE` está em `true` (o estado padrão da variável para servidores MySQL 5.7 é `false`). O log de erro do MySQL Server é então redirecionado para `stderr`, de modo que o log de erro vá para o log do contêiner Docker e possa ser visualizado usando o comando **docker logs *`mysqld-container`***.

Para fazer com que o MySQL Server gere um log de erro quando uma das duas condições for verdadeira, use a opção `--log-error` para configurar o servidor para gerar o log de erro em um local específico dentro do contêiner. Para persistir o log de erro, monte um arquivo de host no local do log de erro dentro do contêiner, conforme explicado em Persistência de Mudanças de Dados e Configurações. No entanto, você deve garantir que o seu MySQL Server dentro do contêiner tenha acesso de escrita ao arquivo de host montado.

##### Problemas conhecidos

- Ao usar a variável de sistema do servidor `audit_log_file` para configurar o nome do arquivo de registro de auditoria, use o modificador de opção `loose` com ele, ou o Docker não poderá iniciar o servidor.

##### Variáveis de ambiente do Docker

Ao criar um contêiner do MySQL Server, você pode configurar a instância do MySQL usando a opção `--env` (`-e` em abreviação) e especificando uma ou mais das seguintes variáveis de ambiente.

Notas

- Nenhuma das variáveis abaixo tem efeito se o diretório de dados que você monta não estiver vazio, pois nenhuma inicialização do servidor será realizada (consulte "Manter Mudanças em Dados e Configurações" para mais detalhes). Qualquer conteúdo pré-existente na pasta, incluindo configurações antigas do servidor, não será modificado durante o início do contêiner.

- As variáveis booleanas, incluindo `MYSQL_RANDOM_ROOT_PASSWORD`, `MYSQL_ONETIME_PASSWORD`, `MYSQL_ALLOW_EMPTY_PASSWORD` e `MYSQL_LOG_CONSOLE`, são definidas como verdadeiras ao serem definidas com qualquer string de comprimento não nulo. Portanto, definí-las, por exemplo, para “0”, “false” ou “no” não as torna falsas, mas, na verdade, as torna verdadeiras. Esse é um problema conhecido dos contêineres do MySQL Server.

- `MYSQL_RANDOM_ROOT_PASSWORD`: Quando essa variável estiver definida como verdadeira (o que é seu estado padrão, a menos que `MYSQL_ROOT_PASSWORD` esteja definida ou `MYSQL_ALLOW_EMPTY_PASSWORD` esteja definida como `true`), uma senha aleatória para o usuário root do servidor será gerada quando o contêiner Docker for iniciado. A senha será impressa no `stdout` do contêiner e pode ser encontrada consultando o log do contêiner (veja Como iniciar uma instância do servidor MySQL).

- `MYSQL_ONETIME_PASSWORD`: Quando a variável estiver verdadeira (o que é seu estado padrão, a menos que `MYSQL_ROOT_PASSWORD` esteja definida ou `MYSQL_ALLOW_EMPTY_PASSWORD` esteja definida como verdadeira), a senha do usuário root será definida como expirada e precisará ser alterada antes que o MySQL possa ser usado normalmente.

- `MYSQL_DATABASE`: Esta variável permite que você especifique o nome de um banco de dados a ser criado na inicialização da imagem. Se um nome de usuário e uma senha forem fornecidos com `MYSQL_USER` e `MYSQL_PASSWORD`, o usuário é criado e recebe acesso de superusuário a este banco de dados (correspondente a `GRANT ALL`). O banco de dados especificado é criado por uma instrução `CREATE DATABASE IF NOT EXIST`, de modo que a variável não tenha efeito se o banco de dados já existir.

- `MYSQL_USER`, `MYSQL_PASSWORD`: Essas variáveis são usadas em conjunto para criar um usuário e definir a senha desse usuário, e o usuário recebe permissões de superusuário para o banco de dados especificado pela variável `MYSQL_DATABASE`. Tanto `MYSQL_USER` quanto `MYSQL_PASSWORD` são necessários para que um usuário seja criado — se qualquer uma das duas variáveis não for definida, a outra é ignorada. Se ambas as variáveis forem definidas, mas `MYSQL_DATABASE` não, o usuário será criado sem quaisquer privilégios.

  ::: info Nota
  Não é necessário usar esse mecanismo para criar o superusuário raiz, que é criado por padrão com a senha definida por um dos mecanismos discutidos nas descrições para `MYSQL_ROOT_PASSWORD` e `MYSQL_RANDOM_ROOT_PASSWORD`, a menos que `MYSQL_ALLOW_EMPTY_PASSWORD` seja verdadeiro.
  :::

- `MYSQL_ROOT_HOST`: Por padrão, o MySQL cria a conta `'root'@'localhost'`. Essa conta só pode ser conectada a partir do interior do contêiner, conforme descrito em Conectar ao servidor MySQL dentro do contêiner. Para permitir conexões de root de outros hosts, defina essa variável de ambiente. Por exemplo, o valor `172.17.0.1`, que é o IP padrão do gateway do Docker, permite conexões da máquina host que executa o contêiner. A opção aceita apenas uma entrada, mas caracteres curinga são permitidos (por exemplo, `MYSQL_ROOT_HOST=172.*.*.*` ou `MYSQL_ROOT_HOST=%`).

- `MYSQL_LOG_CONSOLE`: Quando a variável é `true` (o estado padrão da variável para os contêineres do servidor MySQL 5.7 é `false`), o log de erro do MySQL Server é redirecionado para `stderr`, de modo que o log de erro vá para o log do contêiner Docker e possa ser visualizado usando o comando **docker logs *`mysqld-container`***.

  ::: info Nota
  A variável não tem efeito se um arquivo de configuração do servidor do host tiver sido montado (consulte Persistência de alterações de dados e configuração ao vincular um arquivo de configuração).
  :::

- `MYSQL_ROOT_PASSWORD`: Esta variável especifica uma senha definida para a conta raiz do MySQL.

  ::: warning Aviso
  Definir a senha do usuário root do MySQL na linha de comando é inseguro. Como alternativa para especificar a senha explicitamente, você pode definir a variável com um caminho de arquivo de contêiner para um arquivo de senha e, em seguida, montar um arquivo do seu host que contenha a senha no caminho do arquivo de contêiner. Isso ainda não é muito seguro, pois a localização do arquivo de senha ainda está exposta. É preferível usar as configurações padrão de `MYSQL_RANDOM_ROOT_PASSWORD` e `MYSQL_ONETIME_PASSWORD`, ambas como verdadeiras.
  :::

- `MYSQL_ALLOW_EMPTY_PASSWORD`. Defina para `true` para permitir que o contêiner seja iniciado com uma senha em branco para o usuário root.

  ::: warning Aviso
  Definir essa variável para verdadeiro é inseguro, pois deixará sua instância MySQL completamente desprotegida, permitindo que qualquer pessoa obtenha acesso completo como superusuário. É preferível usar as configurações padrão de `MYSQL_RANDOM_ROOT_PASSWORD` e `MYSQL_ONETIME_PASSWORD`, ambas com o valor `true`.
  :::
