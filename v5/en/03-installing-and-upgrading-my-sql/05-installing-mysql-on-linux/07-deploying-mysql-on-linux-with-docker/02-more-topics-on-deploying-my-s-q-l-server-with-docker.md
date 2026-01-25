#### 2.5.7.2 Mais Tópicos sobre Como Implantar o MySQL Server com Docker

Nota

A maioria dos comandos de exemplo abaixo usa `mysql/mysql-server` como o repositório da imagem Docker quando isso precisa ser especificado (como nos comandos **docker pull** e **docker run**); altere isso se sua imagem for de outro repositório — por exemplo, substitua por `container-registry.oracle.com/mysql/enterprise-server` para imagens do MySQL Enterprise Edition baixadas do Oracle Container Registry (OCR), ou `mysql/enterprise-server` para imagens do MySQL Enterprise Edition baixadas do [My Oracle Support](https://support.oracle.com/).

* A Instalação Otimizada do MySQL para Docker
* Configurando o MySQL Server
* Persistindo Dados e Alterações de Configuração
* Executando Scripts de Inicialização Adicionais
* Conectando-se ao MySQL a partir de uma Aplicação em Outro Container Docker
* Log de Erros do Server
* Problemas Conhecidos
* Variáveis de Ambiente Docker

##### A Instalação Otimizada do MySQL para Docker

As imagens Docker para MySQL são otimizadas quanto ao tamanho do código, o que significa que incluem apenas componentes cruciais que são esperados como relevantes para a maioria dos usuários que executam instâncias MySQL em containers Docker. Uma instalação MySQL Docker é diferente de uma instalação comum, não-Docker, nos seguintes aspectos:

* Os binários incluídos são limitados a:

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
* Todos os binários são "stripped" (despojados); eles não contêm informações de debug.

##### Configurando o MySQL Server

Ao iniciar o container Docker do MySQL, você pode passar opções de configuração para o server através do comando **docker run**. Por exemplo:

```sql
docker run --name mysql1 -d mysql/mysql-server:tag --character-set-server=utf8mb4 --collation-server=utf8mb4_col
```

O comando inicia seu MySQL Server com `utf8mb4` como o character set padrão e `utf8mb4_col` como o collation padrão para seus Databases.

Outra maneira de configurar o MySQL Server é preparar um arquivo de configuração e montá-lo no local do arquivo de configuração do server dentro do container. Consulte Persistindo Dados e Alterações de Configuração para detalhes.

##### Persistindo Dados e Alterações de Configuração

Containers Docker são, em princípio, efêmeros, e espera-se que quaisquer dados ou configurações sejam perdidos se o container for excluído ou corrompido (veja discussões [aqui](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/)). No entanto, [volumes Docker](https://docs.docker.com/engine/admin/volumes/volumes/) fornecem um mecanismo para persistir dados criados dentro de um container Docker. Em sua inicialização, o container MySQL Server cria um volume Docker para o diretório de dados do server. A saída JSON para a execução do comando **docker inspect** no container possui uma chave `Mount`, cujo valor fornece informações sobre o volume do diretório de dados:

```sql
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

A saída mostra que a pasta de origem `/var/lib/docker/volumes/4f2d463cfc4bdd4baebcb098c97d7da3337195ed2c6572bc0b89f7e845d27652/_data`, na qual os dados são persistidos no host, foi montada em `/var/lib/mysql`, o diretório de dados do server dentro do container.

Outra maneira de preservar dados é [bind-mount](https://docs.docker.com/engine/reference/commandline/service_create/#add-bind-mounts-or-volumes) um diretório do host usando a opção `--mount` ao criar o container. A mesma técnica pode ser usada para persistir a configuração do server. O comando a seguir cria um container MySQL Server e bind-mounts o diretório de dados e o arquivo de configuração do server:

```sql
docker run --name=mysql1 \
--mount type=bind,src=/path-on-host-machine/my.cnf,dst=/etc/my.cnf \
--mount type=bind,src=/path-on-host-machine/datadir,dst=/var/lib/mysql \
-d mysql/mysql-server:tag
```

O comando monta `path-on-host-machine/my.cnf` em `/etc/my.cnf` (o arquivo de configuração do server dentro do container), e `path-on-host-machine/datadir` em `/var/lib/mysql` (o diretório de dados dentro do container). As seguintes condições devem ser atendidas para que o bind-mounting funcione:

* O arquivo de configuração `path-on-host-machine/my.cnf` já deve existir e deve conter a especificação para iniciar o server usando o usuário `mysql`:

  ```sql
  [mysqld]
  user=mysql
  ```

  Você também pode incluir outras opções de configuração do server no arquivo.

* O diretório de dados `path-on-host-machine/datadir` já deve existir. Para que a inicialização do server ocorra, o diretório deve estar vazio. Você também pode montar um diretório pré-preenchido com dados e iniciar o server com ele; no entanto, você deve garantir que inicie o container Docker com a mesma configuração do server que criou os dados, e que quaisquer arquivos ou diretórios do host necessários sejam montados ao iniciar o container.

##### Executando Scripts de Inicialização Adicionais

Se houver quaisquer scripts `.sh` ou `.sql` que você queira executar no Database imediatamente após sua criação, você pode colocá-los em um diretório do host e, em seguida, montar o diretório em `/docker-entrypoint-initdb.d/` dentro do container. Por exemplo:

```sql
docker run --name=mysql1 \
--mount type=bind,src=/path-on-host-machine/scripts/,dst=/docker-entrypoint-initdb.d/ \
-d mysql/mysql-server:tag
```

##### Conectando-se ao MySQL a partir de uma Aplicação em Outro Container Docker

Ao configurar uma network Docker, você pode permitir que vários containers Docker se comuniquem entre si, de modo que uma aplicação cliente em outro container Docker possa acessar o MySQL Server no container do server. Primeiro, crie uma network Docker:

```sql
docker network create my-custom-net
```

Em seguida, ao criar e iniciar os containers do server e do cliente, use a opção `--network` para colocá-los na network que você criou. Por exemplo:

```sql
docker run --name=mysql1 --network=my-custom-net -d mysql/mysql-server
```

```sql
docker run --name=myapp1 --network=my-custom-net -d myapp
```

O container `myapp1` pode então se conectar ao container `mysql1` com o hostname `mysql1` e vice-versa, pois o Docker configura automaticamente um DNS para os nomes de container fornecidos. No exemplo a seguir, executamos o cliente **`mysql`** de dentro do container `myapp1` para conectar-se ao host `mysql1` em seu próprio container:

```sql
docker exec -it myapp1 mysql --host=mysql1 --user=myuser --password
```

Para outras técnicas de network para containers, consulte a seção [Docker container networking](https://docs.docker.com/engine/userguide/networking/) na Documentação do Docker.

##### Log de Erros do Server

Quando o MySQL Server é iniciado pela primeira vez com seu container server, um log de erros do server NÃO é gerado se qualquer uma das seguintes condições for verdadeira:

* Um arquivo de configuração do server do host foi montado, mas o arquivo não contém a variável de sistema `log_error` (consulte Persistindo Dados e Alterações de Configuração sobre bind-mounting de um arquivo de configuração do server).

* Um arquivo de configuração do server do host não foi montado, mas a variável de ambiente Docker `MYSQL_LOG_CONSOLE` é `true` (o estado padrão da variável para containers MySQL 5.7 server é `false`). O log de erros do MySQL Server é então redirecionado para `stderr`, de modo que o log de erros vá para o log do container Docker e possa ser visualizado usando o comando **docker logs *`mysqld-container`***.

Para fazer com que o MySQL Server gere um log de erros quando qualquer uma das duas condições for verdadeira, use a opção `--log-error` para configurar o server para gerar o log de erros em um local específico dentro do container. Para persistir o log de erros, monte um arquivo do host no local do log de erros dentro do container, conforme explicado em Persistindo Dados e Alterações de Configuração. No entanto, você deve garantir que seu MySQL Server dentro de seu container tenha acesso de escrita ao arquivo do host montado.

##### Problemas Conhecidos

* Ao usar a variável de sistema do server `audit_log_file` para configurar o nome do arquivo de log de auditoria, use o modificador de opção `loose` com ela, ou o Docker não conseguirá iniciar o server.

##### Variáveis de Ambiente Docker

Ao criar um container MySQL Server, você pode configurar a instância MySQL usando a opção `--env` (ou `-e`, abreviadamente) e especificando uma ou mais das seguintes variáveis de ambiente.

Notas

* Nenhuma das variáveis abaixo tem efeito se o diretório de dados que você montar não estiver vazio, pois nenhuma inicialização do server será tentada (consulte Persistindo Dados e Alterações de Configuração para mais detalhes). Quaisquer conteúdos pré-existentes na pasta, incluindo quaisquer configurações antigas do server, não são modificados durante a inicialização do container.

* As variáveis booleanas, incluindo `MYSQL_RANDOM_ROOT_PASSWORD`, `MYSQL_ONETIME_PASSWORD`, `MYSQL_ALLOW_EMPTY_PASSWORD` e `MYSQL_LOG_CONSOLE`, tornam-se true ao serem definidas com quaisquer strings de comprimento diferente de zero. Portanto, defini-las como, por exemplo, "0", "false" ou "no" não as torna false, mas na verdade as torna true. Este é um problema conhecido dos containers MySQL Server.

* `MYSQL_RANDOM_ROOT_PASSWORD`: Quando esta variável é true (o que é seu estado padrão, a menos que `MYSQL_ROOT_PASSWORD` seja definida ou `MYSQL_ALLOW_EMPTY_PASSWORD` seja definida como true), uma senha aleatória para o usuário root do server é gerada quando o container Docker é iniciado. A senha é impressa no `stdout` do container e pode ser encontrada examinando o log do container (consulte Starting a MySQL Server Instance).

* `MYSQL_ONETIME_PASSWORD`: Quando a variável é true (o que é seu estado padrão, a menos que `MYSQL_ROOT_PASSWORD` seja definida ou `MYSQL_ALLOW_EMPTY_PASSWORD` seja definida como true), a senha do usuário root é definida como expirada e deve ser alterada antes que o MySQL possa ser usado normalmente.

* `MYSQL_DATABASE`: Esta variável permite que você especifique o nome de um Database a ser criado na inicialização da imagem. Se um nome de usuário e uma senha forem fornecidos com `MYSQL_USER` e `MYSQL_PASSWORD`, o usuário é criado e recebe acesso de superusuário a este Database (correspondendo a `GRANT ALL`). O Database especificado é criado por uma instrução CREATE DATABASE IF NOT EXIST, de modo que a variável não tem efeito se o Database já existir.

* `MYSQL_USER`, `MYSQL_PASSWORD`: Estas variáveis são usadas em conjunto para criar um usuário e definir a senha desse usuário, e o usuário recebe permissões de superusuário para o Database especificado pela variável `MYSQL_DATABASE`. Ambas `MYSQL_USER` e `MYSQL_PASSWORD` são necessárias para que um usuário seja criado — se alguma das duas variáveis não for definida, a outra é ignorada. Se ambas as variáveis forem definidas, mas `MYSQL_DATABASE` não for, o usuário é criado sem quaisquer privileges.

  Nota

  Não há necessidade de usar este mecanismo para criar o superusuário root, que é criado por padrão com a senha definida por um dos mecanismos discutidos nas descrições de `MYSQL_ROOT_PASSWORD` e `MYSQL_RANDOM_ROOT_PASSWORD`, a menos que `MYSQL_ALLOW_EMPTY_PASSWORD` seja true.

* `MYSQL_ROOT_HOST`: Por padrão, o MySQL cria a conta `'root'@'localhost'`. Esta conta só pode ser conectada de dentro do container, conforme descrito em Connecting to MySQL Server from within the Container. Para permitir conexões root de outros hosts, defina esta variável de ambiente. Por exemplo, o valor `172.17.0.1`, que é o IP do default Docker gateway, permite conexões da máquina host que executa o container. A opção aceita apenas uma entrada, mas curingas são permitidos (por exemplo, `MYSQL_ROOT_HOST=172.*.*.*` ou `MYSQL_ROOT_HOST=%`).

* `MYSQL_LOG_CONSOLE`: Quando a variável é true (o estado padrão da variável para containers MySQL 5.7 server é `false`), o log de erros do MySQL Server é redirecionado para `stderr`, de modo que o log de erros vá para o log do container Docker e possa ser visualizado usando o comando **docker logs *`mysqld-container`***.

  Nota

  A variável não tem efeito se um arquivo de configuração do server do host tiver sido montado (consulte Persistindo Dados e Alterações de Configuração sobre bind-mounting de um arquivo de configuração).

* `MYSQL_ROOT_PASSWORD`: Esta variável especifica uma senha que é definida para a conta root do MySQL.

  Aviso

  Definir a senha do usuário root do MySQL na linha de comando é inseguro. Como alternativa para especificar a senha explicitamente, você pode definir a variável com um caminho de arquivo de container para um arquivo de senha e, em seguida, montar um arquivo do seu host que contenha a senha no caminho do arquivo de container. Isso ainda não é muito seguro, pois o local do arquivo de senha ainda é exposto. É preferível usar as configurações padrão de `MYSQL_RANDOM_ROOT_PASSWORD` e `MYSQL_ONETIME_PASSWORD` ambas sendo true.

* `MYSQL_ALLOW_EMPTY_PASSWORD`. Defina-a como true para permitir que o container seja iniciado com uma senha em branco para o usuário root.

  Aviso

  Definir esta variável como true é inseguro, pois deixará sua instância MySQL completamente desprotegida, permitindo que qualquer pessoa obtenha acesso completo de superusuário. É preferível usar as configurações padrão de `MYSQL_RANDOM_ROOT_PASSWORD` e `MYSQL_ONETIME_PASSWORD` ambas sendo true.