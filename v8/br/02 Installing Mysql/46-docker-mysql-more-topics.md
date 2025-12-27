#### 2.5.6.2 Mais tópicos sobre a implantação do servidor MySQL com o Docker

::: info Nota

A maioria dos comandos de amostra a seguir usa `container-registry.oracle.com/mysql/community-server` como a imagem Docker utilizada (como nos comandos `docker pull` e `docker run`); mude isso se a imagem for de outro repositório — por exemplo, substitua por `container-registry.oracle.com/mysql/enterprise-server` para imagens da MySQL Enterprise Edition baixadas do Oracle Container Registry (OCR), ou `mysql/enterprise-server` para imagens da MySQL Enterprise Edition baixadas do [My Oracle Support](https://support.oracle.com/).

:::

*  A instalação MySQL otimizada para o Docker
*  Configurando o servidor MySQL
*  Persistindo alterações de dados e configuração
*  Executando scripts de inicialização adicionais
*  Conectando-se ao MySQL a partir de um aplicativo em outro contêiner Docker
*  Diário de erros do servidor
*  Usando o backup do MySQL Enterprise com o Docker
*  Usando o mysqldump com o Docker
*  Problemas conhecidos
*  Variáveis de ambiente do Docker

##### A instalação MySQL otimizada para o Docker

As imagens Docker para MySQL são otimizadas para o tamanho do código, o que significa que incluem apenas componentes cruciais que são esperados para ser relevantes para a maioria dos usuários que executam instâncias do MySQL em contêineres Docker. Uma instalação Docker do MySQL é diferente de uma instalação comum, não Docker, nos seguintes aspectos:

* Apenas um número limitado de binários é incluído.
* Todos os binários são removidos; eles não contêm informações de depuração. Aviso

Quaisquer atualizações ou instalações de software que os usuários realizarem no contêiner Docker (incluindo aquelas para componentes do MySQL) podem entrar em conflito com a instalação MySQL otimizada criada pela imagem Docker. A Oracle não fornece suporte para produtos MySQL que estejam em um contêiner alterado ou em um contêiner criado a partir de uma imagem Docker alterada.

##### Configurando o servidor MySQL

Ao iniciar o contêiner MySQL Docker, você pode passar opções de configuração para o servidor através do comando `docker run`. Por exemplo:

```
docker run --name mysql1 -d container-registry.oracle.com/mysql/community-server:tag --character-set-server=utf8mb4 --collation-server=utf8mb4_col
```

O comando inicia o servidor MySQL com `utf8mb4` como conjunto de caracteres padrão e `utf8mb4_col` como collation padrão para bancos de dados.

Outra maneira de configurar o servidor MySQL é preparar um arquivo de configuração e montá-lo na localização do arquivo de configuração do servidor dentro do contêiner. Veja Persistência de Dados e Alterações de Configuração para detalhes.

##### Persistência de Dados e Alterações de Configuração

Os contêineres Docker são, em princípio, efêmeros, e qualquer dado ou configuração deve ser perdido se o contêiner for excluído ou corrompido (veja discussões aqui). [Volumes Docker](https://docs.docker.com/engine/admin/volumes/volumes/) fornece um mecanismo para persistir dados criados dentro de um contêiner Docker. Na sua inicialização, o contêiner do servidor MySQL cria um volume Docker para o diretório de dados do servidor. A saída JSON do comando `docker inspect` no contêiner inclui uma chave `Mount`, cujo valor fornece informações sobre o volume do diretório de dados:

```
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

A saída mostra que o diretório de origem `/var/lib/docker/volumes/4f2d463cfc4bdd4baebcb098c97d7da3337195ed2c6572bc0b89f7e845d27652/_data`, no qual os dados são persistidos no host, foi montado em `/var/lib/mysql`, o diretório de dados do servidor dentro do contêiner.

Outra maneira de preservar dados é vincular um diretório do host usando a opção `--mount` ao criar o contêiner. A mesma técnica pode ser usada para persistir a configuração do servidor. O comando a seguir cria um contêiner do servidor MySQL e vincula tanto o diretório de dados quanto o arquivo de configuração do servidor:

```
docker run --name=mysql1 \
--mount type=bind,src=/path-on-host-machine/my.cnf,dst=/etc/my.cnf \
--mount type=bind,src=/path-on-host-machine/datadir,dst=/var/lib/mysql \
-d container-registry.oracle.com/mysql/community-server:tag
```

O comando monta `path-on-host-machine/my.cnf` em `/etc/my.cnf` (o arquivo de configuração do servidor dentro do contêiner) e `path-on-host-machine/datadir` em `/var/lib/mysql` (o diretório de dados dentro do contêiner). As seguintes condições devem ser atendidas para que o montagem por vinculação funcione:

* O arquivo de configuração `path-on-host-machine/my.cnf` deve já existir e conter a especificação para iniciar o servidor pelo usuário `mysql`:

  ```
  [mysqld]
  user=mysql
  ```

  Você também pode incluir outras opções de configuração do servidor no arquivo.
* O diretório de dados `path-on-host-machine/datadir` deve já existir. Para que a inicialização do servidor aconteça, o diretório deve estar vazio. Você também pode montar um diretório pré-preenchido com dados e iniciar o servidor com ele; no entanto, você deve garantir que inicie o contêiner Docker com a mesma configuração do servidor que criou os dados, e quaisquer arquivos ou diretórios do host necessários sejam montados ao iniciar o contêiner.

##### Executar Scripts de Inicialização Adicionais

Se houver quaisquer scripts `.sh` ou `.sql` que você queira executar no banco de dados imediatamente após ele ter sido criado, você pode colocá-los em um diretório do host e, em seguida, montar o diretório em `/docker-entrypoint-initdb.d/` dentro do contêiner. Por exemplo:

```
docker run --name=mysql1 \
--mount type=bind,src=/path-on-host-machine/scripts/,dst=/docker-entrypoint-initdb.d/ \
-d container-registry.oracle.com/mysql/community-server:tag
```

##### Conectar-se ao MySQL a partir de uma Aplicação em Outro Contêiner Docker

Configurando uma rede Docker, você pode permitir que vários contêineres Docker se comuniquem entre si, para que um aplicativo cliente em outro contêiner Docker possa acessar o Servidor MySQL no contêiner do servidor. Primeiro, crie uma rede Docker:

```
docker network create my-custom-net
```

Então, ao criar e iniciar os contêineres do servidor e do cliente, use a opção `--network` para colocá-los na rede que você criou. Por exemplo:

```
docker run --name=mysql1 --network=my-custom-net -d container-registry.oracle.com/mysql/community-server
```

```
docker run --name=myapp1 --network=my-custom-net -d myapp
```

O contêiner `myapp1` pode então se conectar ao contêiner `mysql1` com o nome de host `mysql1` e vice-versa, pois o Docker configura automaticamente um DNS para os nomes de contêineres fornecidos. No exemplo a seguir, executamos o cliente `mysql` dentro do contêiner `myapp1` para se conectar ao host `mysql1` em seu próprio contêiner:

```
docker exec -it myapp1 mysql --host=mysql1 --user=myuser --password
```

Para outras técnicas de rede para contêineres, consulte a seção [Docker container networking](https://docs.docker.com/engine/userguide/networking/) nas Documentações do Docker.

##### Log de erro do servidor

Quando o Servidor MySQL é iniciado pela primeira vez com o contêiner do servidor, um log de erro do servidor NÃO é gerado se uma das seguintes condições for verdadeira:

* Um arquivo de configuração do servidor do host foi montado, mas o arquivo não contém a variável de sistema `log_error` (consulte Persisting Data and Configuration Changes on bind-mounting a server configuration file).
* Um arquivo de configuração do servidor do host não foi montado, mas a variável de ambiente Docker `MYSQL_LOG_CONSOLE` é `true` (que é o estado padrão da variável para contêineres de servidor MySQL 8.4). O log de erro do Servidor MySQL é então redirecionado para `stderr`, de modo que o log de erro vá para o log do contêiner Docker e seja visível usando o comando `docker logs mysqld-container`.

Para fazer o Servidor MySQL gerar um log de erro quando uma das duas condições for verdadeira, use a opção `--log-error` para configurar o servidor para gerar o log de erro em um local específico dentro do contêiner. Para persistir o log de erro, monte um arquivo do host no local do log de erro dentro do contêiner, conforme explicado em Persisting Data and Configuration Changes. No entanto, você deve garantir que o seu Servidor MySQL dentro do seu contêiner tenha acesso de escrita ao arquivo do host montado.

##### Usando o Backup do MySQL Enterprise com o Docker

O MySQL Enterprise Backup é uma ferramenta de backup com licença comercial para o MySQL Server, disponível com a Edição Empresarial do MySQL. O MySQL Enterprise Backup está incluído na instalação do Docker da Edição Empresarial do MySQL.

No exemplo a seguir, assumimos que você já tem um MySQL Server rodando em um contêiner Docker. Para que o MySQL Enterprise Backup faça o backup do MySQL Server, ele deve ter acesso ao diretório de dados do servidor. Isso pode ser alcançado, por exemplo, montando um diretório hospedeiro no diretório de dados do MySQL Server ao iniciar o servidor:

```
docker run --name=mysqlserver \
--mount type=bind,src=/path-on-host-machine/datadir/,dst=/var/lib/mysql \
-d mysql/enterprise-server:8.4
```

Com este comando, o MySQL Server é iniciado com uma imagem do Docker da Edição Empresarial do MySQL, e o diretório hospedeiro `/caminho-na-máquina-hospedeira/datadir/` foi montado no diretório de dados do servidor (`/var/lib/mysql`) dentro do contêiner do servidor. Também assumimos que, após o servidor ter sido iniciado, os privilégios necessários também foram configurados para que o MySQL Enterprise Backup possa acessar o servidor (consulte Grant MySQL Privileges to Backup Administrator, para detalhes). Use as etapas a seguir para fazer o backup e restaurar uma instância do MySQL Server.

Para fazer o backup de uma instância do MySQL Server rodando em um contêiner Docker usando o MySQL Enterprise Backup com Docker, siga as etapas listadas aqui:

1. No mesmo host onde o contêiner do MySQL Server está rodando, inicie outro contêiner com uma imagem da Edição Empresarial do MySQL para realizar um backup com o comando `backup-to-image` do MySQL Enterprise Backup. Forneça acesso ao diretório de dados do servidor usando o monte de vinculação que criamos no passo anterior. Além disso, monte um diretório hospedeiro (`/caminho-na-máquina-hospedeira/backups/` neste exemplo) no diretório de armazenamento para backups no contêiner (`/data/backups` no exemplo) para persistir os backups que estamos criando. Aqui está um comando de amostra para essa etapa, no qual o MySQL Enterprise Backup é iniciado com uma imagem do Docker baixada do [My Oracle Support](https://support.oracle.com):

   ```
   $> docker run \
   --mount type=bind,src=/path-on-host-machine/datadir/,dst=/var/lib/mysql \
   --mount type=bind,src=/path-on-host-machine/backups/,dst=/data/backups \
   --rm mysql/enterprise-server:8.4 \
   mysqlbackup -umysqlbackup -ppassword --backup-dir=/tmp/backup-tmp --with-timestamp \
   --backup-image=/data/backups/db.mbi backup-to-image
   ```

É importante verificar o final da saída do `mysqlbackup` para garantir que o backup tenha sido concluído com sucesso.
2. O contêiner sai quando o trabalho de backup estiver concluído, e, com a opção `--rm` usada para iniciá-lo, ele é removido após sair. Uma cópia de segurança da imagem foi criada e pode ser encontrada no diretório do host montado no último passo para armazenamento de backups, conforme mostrado aqui:

   ```
   $> ls /tmp/backups
   db.mbi
   ```

Para restaurar uma instância do servidor MySQL em um contêiner Docker usando o MySQL Enterprise Backup com Docker, siga os passos listados aqui:

1. Pare o contêiner do servidor MySQL, que também para o servidor MySQL em execução:

   ```
   docker stop mysqlserver
   ```
2. No host, exclua todo o conteúdo no ponto de montagem de vinculação para o diretório de dados do MySQL Server:

   ```
   rm -rf /path-on-host-machine/datadir/*
   ```
3. Inicie um contêiner com uma imagem da Edição Empresarial do MySQL para realizar a restauração com o comando de backup do MySQL Enterprise `copy-back-and-apply-log`. Vincule o diretório de dados do servidor e a pasta de armazenamento para os backups, como fizemos ao fazer o backup do servidor:

   ```
   $> docker run \
   --mount type=bind,src=/path-on-host-machine/datadir/,dst=/var/lib/mysql \
   --mount type=bind,src=/path-on-host-machine/backups/,dst=/data/backups \
   --rm mysql/enterprise-server:8.4 \
   mysqlbackup --backup-dir=/tmp/backup-tmp --with-timestamp \
   --datadir=/var/lib/mysql --backup-image=/data/backups/db.mbi copy-back-and-apply-log

   mysqlbackup completed OK! with 3 warnings
   ```

   O contêiner sai com a mensagem ``mysqlbackup completou OK!`` assim que o trabalho de backup estiver concluído, e, com a opção `--rm` usada ao iniciá-lo, ele é removido após sair.
4. Reinicie o contêiner do servidor, que também reinicia o servidor restaurado, usando o seguinte comando:

   ```
   docker restart mysqlserver
   ```

   Ou, inicie um novo servidor MySQL no diretório de dados restaurado, conforme mostrado aqui:

   ```
   docker run --name=mysqlserver2 \
   --mount type=bind,src=/path-on-host-machine/datadir/,dst=/var/lib/mysql \
   -d mysql/enterprise-server:8.4
   ```

   Faça login no servidor para verificar se o servidor está em execução com os dados restaurados.

##### Usando `mysqldump` com Docker

Além de usar o MySQL Enterprise Backup para fazer backup de um servidor MySQL em execução em um contêiner Docker, você pode realizar uma cópia de segurança lógica do seu servidor usando o utilitário `mysqldump`, executado dentro de um contêiner Docker.

As instruções a seguir assumem que você já tem um servidor MySQL rodando em um contêiner Docker e, quando o contêiner foi iniciado pela primeira vez, um diretório hoste *`/caminho-na-máquina-hoste/datadir/`* foi montado no diretório de dados do servidor `/var/lib/mysql` (veja como montar um diretório hoste por meio de bind-mounting no diretório de dados do Servidor MySQL para obter detalhes), que contém o arquivo de soquete Unix pelo qual `mysqldump` e `mysql` podem se conectar ao servidor. Também assumimos que, após o servidor ter sido iniciado, um usuário com os devidos privilégios (`admin` neste exemplo) foi criado, com o qual `mysqldump` pode acessar o servidor. Use as etapas a seguir para fazer backup e restaurar os dados do Servidor MySQL:

*Fazendo backup dos dados do Servidor MySQL usando `mysqldump` com Docker*:

1. No mesmo host onde o contêiner do Servidor MySQL está rodando, inicie outro contêiner com uma imagem do Servidor MySQL para realizar um backup com o utilitário `mysqldump` (veja a documentação do utilitário para sua funcionalidade, opções e limitações). Forneça acesso ao diretório de dados do servidor montando `/caminho-na-máquina-hoste/datadir/` por meio de bind-mounting. Além disso, monte um diretório hoste (`/caminho-na-máquina-hoste/backups/` neste exemplo) em uma pasta de armazenamento para backups dentro do contêiner (`/data/backups` é usado neste exemplo) para persistir os backups que você está criando. Aqui está um comando de amostra para fazer backup de todas as bases de dados no servidor usando esta configuração:

   ```
   $> docker run --entrypoint "/bin/sh" \
   --mount type=bind,src=/path-on-host-machine/datadir/,dst=/var/lib/mysql \
   --mount type=bind,src=/path-on-host-machine/backups/,dst=/data/backups \
   --rm container-registry.oracle.com/mysql/community-server:8.4 \
   -c "mysqldump -uadmin --password='password' --all-databases > /data/backups/all-databases.sql"
   ```

   No comando, a opção `--entrypoint` é usada para que o shell do sistema seja invocado após o contêiner ser iniciado, e a opção `-c` é usada para especificar o comando `mysqldump` a ser executado no shell, cuja saída é redirecionada para o arquivo `all-databases.sql` no diretório de backup.
2. O contêiner sai uma vez que o trabalho de backup é concluído e, com a opção `--rm` usada para iniciá-lo, ele é removido após sair. Um backup lógico foi criado e pode ser encontrado no diretório hoste montado para armazenar o backup, como mostrado aqui:

   ```
   $> ls /path-on-host-machine/backups/
   all-databases.sql
   ```

*Restauração de dados do MySQL Server usando `mysqldump` com Docker*:

1. Certifique-se de que o MySQL Server esteja em execução em um contêiner, no qual você deseja restaurar os dados de backup.
2. Inicie um contêiner com uma imagem do MySQL Server para realizar a restauração com um cliente `mysql`. Vincule o diretório de dados do servidor, bem como a pasta de armazenamento que contém seu backup:

   ```
   $> docker run  \
   --mount type=bind,src=/path-on-host-machine/datadir/,dst=/var/lib/mysql \
   --mount type=bind,src=/path-on-host-machine/backups/,dst=/data/backups \
   --rm container-registry.oracle.com/mysql/community-server:8.4 \
   mysql -uadmin --password='password' -e "source /data/backups/all-databases.sql"
   ```

   O contêiner sai quando o trabalho de backup estiver concluído e, com a opção `--rm` usada ao iniciá-lo, ele é removido após sair.
3. Faça login no servidor para verificar se os dados restaurados estão agora no servidor.

##### Problemas Conhecidos

* Ao usar a variável de sistema do servidor `audit_log_file` para configurar o nome do arquivo de log de auditoria, use o modificador de opção `loose` com ele; caso contrário, o Docker não pode iniciar o servidor.
* Quando você cria um contêiner do MySQL Server, pode configurar a instância do MySQL usando a opção `--env` (forma abreviada `-e`) e especificar uma ou mais variáveis de ambiente. Não é realizada nenhuma inicialização do servidor se o diretório de dados montado não estiver vazio, caso em que definir qualquer uma dessas variáveis não tem efeito (veja Persistência de Mudanças de Dados e Configuração), e nenhum conteúdo existente do diretório, incluindo as configurações do servidor, é modificado durante o inicialização do contêiner.
* As variáveis de ambiente que podem ser usadas para configurar uma instância do MySQL estão listadas aqui:

* As variáveis lógicas, incluindo `MYSQL_RANDOM_ROOT_PASSWORD`, `MYSQL_ONETIME_PASSWORD`, `MYSQL_ALLOW_EMPTY_PASSWORD` e `MYSQL_LOG_CONSOLE`, são definidas como verdadeiras ao serem configuradas com qualquer string de comprimento não nulo. Portanto, definí-las, por exemplo, para “0”, “false” ou “no” não as torna falsas, mas sim verdadeiras. Esse é um problema conhecido.
* `MYSQL_RANDOM_ROOT_PASSWORD`: Quando essa variável está definida como verdadeira (o que é seu estado padrão, a menos que `MYSQL_ROOT_PASSWORD` seja definido ou `MYSQL_ALLOW_EMPTY_PASSWORD` seja definido como verdadeiro), uma senha aleatória para o usuário root do servidor é gerada quando o contêiner Docker é iniciado. A senha é impressa no `stdout` do contêiner e pode ser encontrada ao analisar o log do contêiner (veja  Iniciando uma Instância do Servidor MySQL).
* `MYSQL_ONETIME_PASSWORD`: Quando a variável está definida como verdadeira (o que é seu estado padrão, a menos que `MYSQL_ROOT_PASSWORD` seja definido ou `MYSQL_ALLOW_EMPTY_PASSWORD` seja definido como verdadeiro), a senha do usuário root é definida como expirada e deve ser alterada antes que o MySQL possa ser usado normalmente.
* `MYSQL_DATABASE`: Essa variável permite especificar o nome de um banco de dados a ser criado na inicialização da imagem. Se um nome de usuário e uma senha forem fornecidos com `MYSQL_USER` e `MYSQL_PASSWORD`, o usuário é criado e recebe permissões de superusuário para esse banco de dados (correspondente a `GRANT ALL`). O banco de dados especificado é criado por meio de uma instrução CREATE DATABASE IF NOT EXIST, para que a variável não tenha efeito se o banco de dados já existir.
* `MYSQL_USER`, `MYSQL_PASSWORD`: Essas variáveis são usadas em conjunto para criar um usuário e definir a senha desse usuário, e o usuário recebe permissões de superusuário para o banco de dados especificado pela variável `MYSQL_DATABASE`. Tanto `MYSQL_USER` quanto `MYSQL_PASSWORD` são necessários para que um usuário seja criado—se qualquer uma das duas variáveis não for definida, a outra é ignorada. Se ambas as variáveis forem definidas, mas `MYSQL_DATABASE` não, o usuário é criado sem quaisquer privilégios.

  ::: info Nota
English:
* The boolean variables including `MYSQL_RANDOM_ROOT_PASSWORD`, `MYSQL_ONETIME_PASSWORD`, `MYSQL_ALLOW_EMPTY_PASSWORD` and `MYSQL_LOG_CONSOLE` are made true by setting them with any strings of nonzero lengths. Therefore, setting them to, for example, “0”, “false” or “no” does not make them false, but actually makes them true. This is a known issue.
* `MYSQL_RANDOM_ROOT_PASSWORD`: When this variable is true (which is its default state, unless `MYSQL_ROOT_PASSWORD` is set or `MYSQL_ALLOW_EMPTY_PASSWORD` is set to true), a random password for the server's root user is generated when the Docker container is started. The password is printed to `stdout` of the container and can be found by looking at the container’s log (see  Starting a MySQL Server Instance).
* `MYSQL_ONETIME_PASSWORD`: When the variable is true (which is its default state, unless `MYSQL_ROOT_PASSWORD` is set or `MYSQL_ALLOW_EMPTY_PASSWORD` is set to true), the root user's password is set as expired and must be changed before MySQL can be used normally.
* `MYSQL_DATABASE`: This variable allows you to specify the name of a database to be created on image startup. If a user name and a password are supplied with `MYSQL_USER` and `MYSQL_PASSWORD`, the user is created and granted superuser access to this database (corresponding to `GRANT ALL`). The specified database is created by a CREATE DATABASE IF NOT EXIST statement, so that the variable has no effect if the database already exists.
* `MYSQL_USER`, `MYSQL_PASSWORD`: These variables are used in conjunction to create a user and set that user's password, and the user is granted superuser permissions for the database specified by the `MYSQL_DATABASE` variable. Both `MYSQL_USER` and `MYSQL_PASSWORD` are required for a user to be created—if any of the two variables is not set, the other is ignored. If both variables are set but `MYSQL_DATABASE` is not, the user is created without any privileges.

Não é necessário usar esse mecanismo para criar o superusuário raiz, que é criado por padrão com a senha definida por um dos mecanismos discutidos nas descrições para `MYSQL_ROOT_PASSWORD` e `MYSQL_RANDOM_ROOT_PASSWORD`, a menos que `MYSQL_ALLOW_EMPTY_PASSWORD` seja `true`.

  :::

* `MYSQL_ROOT_HOST`: Por padrão, o MySQL cria a conta `'root'@'localhost'`. Essa conta só pode ser conectada a partir do interior do contêiner, conforme descrito em Conectar ao servidor MySQL a partir do contêiner. Para permitir conexões de root de outros hosts, defina essa variável de ambiente. Por exemplo, o valor `172.17.0.1`, que é o IP padrão do gateway do Docker, permite conexões da máquina host que executa o contêiner. A opção aceita apenas uma entrada, mas os caracteres curinga são permitidos (por exemplo, `MYSQL_ROOT_HOST=172.*.*.*` ou `MYSQL_ROOT_HOST=%`).
* `MYSQL_LOG_CONSOLE`: Quando a variável é `true` (o que é seu estado padrão para contêineres de servidor MySQL 8.4), o log de erro do servidor MySQL é redirecionado para `stderr`, para que o log de erro vá para o log do contêiner do Docker e seja visível usando o comando `docker logs mysqld-container`.

  ::: info Nota

  A variável não tem efeito se um arquivo de configuração do servidor do host tiver sido montado (consulte Persistindo alterações de dados e configuração no mapeamento de configuração por bind).

  :::

* `MYSQL_ROOT_PASSWORD`: Esta variável especifica uma senha definida para a conta raiz do MySQL.

  Aviso

Definir a senha do usuário root do MySQL na linha de comando é inseguro. Como alternativa para especificar a senha explicitamente, você pode definir a variável com o caminho de um arquivo de contêiner para um arquivo de senha, e depois montar um arquivo do seu host que contenha a senha no caminho do arquivo de contêiner. Isso ainda não é muito seguro, pois a localização do arquivo de senha ainda está exposta. É preferível usar as configurações padrão de `MYSQL_RANDOM_ROOT_PASSWORD` e `MYSQL_ONETIME_PASSWORD` sendo ambas verdadeiras.
* `MYSQL_ALLOW_EMPTY_PASSWORD`. Defina para true para permitir que o contêiner seja iniciado com uma senha em branco para o usuário root.

Aviso

Definir essa variável para true é inseguro, porque vai deixar sua instância do MySQL completamente desprotegida, permitindo que qualquer pessoa obtenha acesso completo de superusuário. É preferível usar as configurações padrão de `MYSQL_RANDOM_ROOT_PASSWORD` e `MYSQL_ONETIME_PASSWORD` sendo ambas verdadeiras.