#### 2.5.6.2 Mais tópicos sobre a implantação do MySQL Server com o Docker

::: info Note

A maioria dos seguintes comandos de exemplo tem `container-registry.oracle.com/mysql/community-server` como a imagem do Docker sendo usada (como com os comandos `docker pull` e `docker run`); mude isso se sua imagem for de outro repositóriopor exemplo, substitua-a por `container-registry.oracle.com/mysql/enterprise-server` para imagens da MySQL Enterprise Edition baixadas do Oracle Container Registry (OCR), ou `mysql/enterprise-server` para imagens da MySQL Enterprise Edition baixadas do \[My Oracle Support] (<https://support.oracle.com/>).

:::

- A instalação otimizada do MySQL para o Docker
- Configurar o servidor MySQL
- Mudanças persistentes de dados e de configuração
- Execução de scripts adicionais de inicialização
- Conectar-se ao MySQL a partir de um aplicativo em outro contêiner do Docker
- Registro de erro do servidor
- Usando o MySQL Enterprise Backup com o Docker
- Usando mysqldump com Docker
- Problemas conhecidos
- Variáveis de ambiente do docker

##### A instalação otimizada do MySQL para o Docker

As imagens do Docker para o MySQL são otimizadas para o tamanho do código, o que significa que elas incluem apenas componentes cruciais que devem ser relevantes para a maioria dos usuários que executam instâncias do MySQL em contêineres do Docker.

- Apenas um número limitado de binários está incluído.
- Todos os binários são despojados; eles não contêm informações de depuração.

Quaisquer atualizações de software ou instalações que os usuários realizem no contêiner Docker (incluindo os componentes MySQL) podem entrar em conflito com a instalação otimizada do MySQL criada pela imagem do Docker. A Oracle não fornece suporte para produtos MySQL executados em tal contêiner alterado ou um contêiner criado a partir de uma imagem do Docker alterada.

##### Configurar o servidor MySQL

Quando você inicia o contêiner do MySQL Docker, você pode passar as opções de configuração para o servidor através do comando `docker run`. Por exemplo:

```
docker run --name mysql1 -d container-registry.oracle.com/mysql/community-server:tag --character-set-server=utf8mb4 --collation-server=utf8mb4_col
```

O comando inicia o MySQL Server com `utf8mb4` como o conjunto de caracteres padrão e `utf8mb4_col` como a coleta padrão para bancos de dados.

Outra maneira de configurar o MySQL Server é preparar um arquivo de configuração e montá-lo no local do arquivo de configuração do servidor dentro do contêiner.

##### Mudanças persistentes de dados e de configuração

Os contêineres Docker são, em princípio, efêmeros, e qualquer dado ou configuração deve ser perdido se o contêiner for excluído ou corrompido (ver discussões aqui). \[volumes docker] fornece um mecanismo para persistir os dados criados dentro de um contêiner Docker.

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

A saída mostra que o diretório de origem `/var/lib/docker/volumes/4f2d463cfc4bdd4baebcb098c97d7da3337195ed2c6572bc0b89f7e845d27652/_data`, no qual os dados são persistentes no host, foi montado em `/var/lib/mysql`, o diretório de dados do servidor dentro do contêiner.

Outra maneira de preservar os dados é fazer bind-mount a um diretório host usando a opção `--mount` ao criar o contêiner. A mesma técnica pode ser usada para persistir a configuração do servidor. O seguinte comando cria um contêiner do MySQL Server e faz bind-mount tanto ao diretório de dados quanto ao arquivo de configuração do servidor:

```
docker run --name=mysql1 \
--mount type=bind,src=/path-on-host-machine/my.cnf,dst=/etc/my.cnf \
--mount type=bind,src=/path-on-host-machine/datadir,dst=/var/lib/mysql \
-d container-registry.oracle.com/mysql/community-server:tag
```

O comando monta `path-on-host-machine/my.cnf` em `/etc/my.cnf` (o arquivo de configuração do servidor dentro do contêiner), e `path-on-host-machine/datadir` em `/var/lib/mysql` (o diretório de dados dentro do contêiner). As seguintes condições devem ser atendidas para que a montagem de ligação funcione:

- O arquivo de configuração `path-on-host-machine/my.cnf` já deve existir, e deve conter a especificação para iniciar o servidor pelo usuário `mysql`:

  ```
  [mysqld]
  user=mysql
  ```

  Também pode incluir outras opções de configuração do servidor no ficheiro.
- O diretório de dados `path-on-host-machine/datadir` já deve existir. Para que a inicialização do servidor aconteça, o diretório deve estar vazio. Você também pode montar um diretório preenchido com dados e iniciar o servidor com ele; no entanto, você deve se certificar de iniciar o contêiner do Docker com a mesma configuração do servidor que criou os dados, e quaisquer arquivos ou diretórios de host necessários são montados ao iniciar o contêiner.

##### Execução de scripts adicionais de inicialização

Se houver qualquer script de `.sh` ou `.sql` que você queira executar no banco de dados imediatamente após a criação, você pode colocá-los em um diretório host e, em seguida, montar o diretório em `/docker-entrypoint-initdb.d/` dentro do contêiner. Por exemplo:

```
docker run --name=mysql1 \
--mount type=bind,src=/path-on-host-machine/scripts/,dst=/docker-entrypoint-initdb.d/ \
-d container-registry.oracle.com/mysql/community-server:tag
```

##### Conectar-se ao MySQL a partir de um aplicativo em outro contêiner do Docker

Ao configurar uma rede Docker, você pode permitir que vários contêineres Docker se comuniquem entre si, para que um aplicativo cliente em outro contêiner Docker possa acessar o MySQL Server no contêiner do servidor. Primeiro, crie uma rede Docker:

```
docker network create my-custom-net
```

Então, quando você está criando e iniciando o servidor e os contêineres do cliente, use a opção `--network` para colocá-los na rede que você criou. Por exemplo:

```
docker run --name=mysql1 --network=my-custom-net -d container-registry.oracle.com/mysql/community-server
```

```
docker run --name=myapp1 --network=my-custom-net -d myapp
```

O contêiner `myapp1` pode então se conectar ao contêiner `mysql1` com o nome de host `mysql1` e vice-versa, pois o Docker configura automaticamente um DNS para os nomes de contêiner dados. No exemplo a seguir, executamos o cliente `mysql` a partir do contêiner `myapp1` para se conectar ao host `mysql1` em seu próprio contêiner:

```
docker exec -it myapp1 mysql --host=mysql1 --user=myuser --password
```

Para outras técnicas de rede para contêineres, consulte a seção \[Docker container networking] (<https://docs.docker.com/engine/userguide/networking/>) na Documentação do Docker.

##### Registro de erro do servidor

Quando o MySQL Server é iniciado pela primeira vez com o seu contêiner de servidor, um log de erro do servidor NÃO é gerado se uma das seguintes condições for verdadeira:

- Um arquivo de configuração do servidor do host foi montado, mas o arquivo não contém a variável de sistema `log_error` (ver Persisting Data and Configuration Changes on bind-mounting a server configuration file).
- Um arquivo de configuração do servidor do host não foi montado, mas a variável de ambiente do Docker `MYSQL_LOG_CONSOLE` é `true` (que é o estado padrão da variável para os contêineres do servidor MySQL 8.4). O log de erro do MySQL Server é então redirecionado para `stderr`, para que o log de erro vá para o log do contêiner do Docker e seja visualizado usando o comando **docker logs `mysqld-container`**.

Para fazer o MySQL Server gerar um log de erro quando qualquer uma das duas condições for verdadeira, use a opção `--log-error` para configurar o servidor para gerar o log de erro em um local específico dentro do contêiner. Para persistir o log de erro, monte um arquivo host no local do log de erro dentro do contêiner, conforme explicado em Persisting Data and Configuration Changes. No entanto, você deve garantir que seu MySQL Server dentro de seu contêiner tenha acesso de gravação ao arquivo host montado.

##### Usando o MySQL Enterprise Backup com o Docker

O MySQL Enterprise Backup é um utilitário de backup comercialmente licenciado para o MySQL Server, disponível com o MySQL Enterprise Edition.

No exemplo a seguir, assumimos que você já tem um servidor MySQL em execução em um contêiner Docker (veja Seção 2.5.6.1, "Passos Básicos para Implantação do Servidor MySQL com o Docker" sobre como iniciar uma instância do Servidor MySQL com o Docker). Para que o MySQL Enterprise Backup faça backup do Servidor MySQL, ele deve ter acesso ao diretório de dados do servidor. Isso pode ser alcançado, por exemplo, ligando e montando um diretório host no diretório de dados do Servidor MySQL ao iniciar o servidor:

```
docker run --name=mysqlserver \
--mount type=bind,src=/path-on-host-machine/datadir/,dst=/var/lib/mysql \
-d mysql/enterprise-server:8.4
```

Com este comando, o MySQL Server é iniciado com uma imagem Docker da MySQL Enterprise Edition, e o diretório host \* `/path-on-host-machine/datadir/` \* foi montado no diretório de dados do servidor (`/var/lib/mysql`) dentro do contêiner do servidor. Também assumimos que, depois que o servidor foi iniciado, os privilégios necessários também foram configurados para o MySQL Enterprise Backup acessar o servidor (veja Grant MySQL Privileges to Backup Administrator, para detalhes). Use as seguintes etapas para fazer backup e restaurar uma instância do MySQL Server.

Para fazer backup de uma instância do MySQL Server em execução em um contêiner do Docker usando o MySQL Enterprise Backup com o Docker, siga os passos listados aqui:

1. No mesmo host onde o contêiner do MySQL Server está em execução, inicie outro contêiner com uma imagem do MySQL Enterprise Edition para executar um backup com o comando `backup-to-image`. Forneça acesso ao diretório de dados do servidor usando o bind mount que criamos na última etapa. Também, monte um diretório host (`/path-on-host-machine/backups/` neste exemplo) na pasta de armazenamento para backups no contêiner (`/data/backups` no exemplo) para persistir os backups que estamos criando. Aqui está um comando de exemplo para esta etapa, no qual o MySQL Enterprise Backup é iniciado com uma imagem do Docker baixada do \[My Oracle Support] (<https://support.oracle.com/>):

   ```
   $> docker run \
   --mount type=bind,src=/path-on-host-machine/datadir/,dst=/var/lib/mysql \
   --mount type=bind,src=/path-on-host-machine/backups/,dst=/data/backups \
   --rm mysql/enterprise-server:8.4 \
   mysqlbackup -umysqlbackup -ppassword --backup-dir=/tmp/backup-tmp --with-timestamp \
   --backup-image=/data/backups/db.mbi backup-to-image
   ```

   É importante verificar o final da saída por **mysqlbackup** para se certificar de que o backup foi concluído com sucesso.
2. O contêiner sai assim que o trabalho de backup é terminado e, com a opção `--rm` usada para iniciá-lo, ele é removido depois de sair. Um backup de imagem foi criado e pode ser encontrado no diretório host montado na última etapa para armazenar backups, como mostrado aqui:

   ```
   $> ls /tmp/backups
   db.mbi
   ```

Para restaurar uma instância do MySQL Server em um contêiner do Docker usando o MySQL Enterprise Backup com o Docker, siga os passos listados aqui:

1. Parar o contêiner do servidor MySQL, que também para o servidor MySQL em execução dentro:

   ```
   docker stop mysqlserver
   ```
2. No host, apague todo o conteúdo da montagem de ligação para o diretório de dados do MySQL Server:

   ```
   rm -rf /path-on-host-machine/datadir/*
   ```
3. Inicie um contêiner com uma imagem do MySQL Enterprise Edition para executar a restauração com o comando `copy-back-and-apply-log`. Bind-mount o diretório de dados do servidor e a pasta de armazenamento para os backups, como o que fizemos quando fizemos o backup do servidor:

   ```
   $> docker run \
   --mount type=bind,src=/path-on-host-machine/datadir/,dst=/var/lib/mysql \
   --mount type=bind,src=/path-on-host-machine/backups/,dst=/data/backups \
   --rm mysql/enterprise-server:8.4 \
   mysqlbackup --backup-dir=/tmp/backup-tmp --with-timestamp \
   --datadir=/var/lib/mysql --backup-image=/data/backups/db.mbi copy-back-and-apply-log

   mysqlbackup completed OK! with 3 warnings
   ```

   O contêiner sai com a mensagem " `mysqlbackup completed OK!` " uma vez terminado o trabalho de backup e, com a opção `--rm` usada ao iniciá-lo, ele é removido depois de sair.
4. Reinicie o contêiner do servidor, que também reinicia o servidor restaurado, usando o seguinte comando:

   ```
   docker restart mysqlserver
   ```

   Ou, inicie um novo servidor MySQL no diretório de dados restaurado, como mostrado aqui:

   ```
   docker run --name=mysqlserver2 \
   --mount type=bind,src=/path-on-host-machine/datadir/,dst=/var/lib/mysql \
   -d mysql/enterprise-server:8.4
   ```

   Faça login no servidor para verificar se o servidor está em execução com os dados restaurados.

##### Usando `mysqldump` com o Docker

Além de usar o MySQL Enterprise Backup para fazer backup de um servidor MySQL em execução em um contêiner Docker, você pode executar um backup lógico do seu servidor usando o utilitário `mysqldump`, executado dentro de um contêiner Docker.

As instruções a seguir assumem que você já tem um servidor MySQL em execução em um contêiner Docker e, quando o contêiner foi iniciado pela primeira vez, um diretório host \* `/path-on-host-machine/datadir/` \* foi montado no diretório de dados do servidor `/var/lib/mysql` (consulte a ligação e montagem de um diretório host no diretório de dados do servidor MySQL para detalhes), que contém o arquivo de soquete Unix pelo qual \*\* mysqldump \*\* e \*\* mysql \*\* podem se conectar ao servidor. Também assumimos que, depois que o servidor foi iniciado, um usuário com os privilégios apropriados (`admin` neste exemplo) foi criado, com o qual \*\* mysqldump \*\* pode acessar o servidor. Use as seguintes etapas para fazer backup e restaurar dados do MySQL Server:

- Fazer backup de dados do MySQL Server usando `mysqldump` com o Docker\*:

1. No mesmo host onde o contêiner do MySQL Server está em execução, inicie outro contêiner com uma imagem do MySQL Server para executar um backup com o utilitário `mysqldump` (consulte a documentação do utilitário para suas funcionalidades, opções e limitações). Forneça acesso ao diretório de dados do servidor com a montagem de ligação \* `/path-on-host-machine/datadir/` *. Também, monte um diretório de host (* `/path-on-host-machine/backups/` \* neste exemplo) em uma pasta de armazenamento para backups dentro do contêiner (`/data/backups` é usado neste exemplo) para persistir os backups que você está criando. Aqui está um comando de exemplo para fazer backup de todos os bancos de dados no servidor usando esta configuração:

   ```
   $> docker run --entrypoint "/bin/sh" \
   --mount type=bind,src=/path-on-host-machine/datadir/,dst=/var/lib/mysql \
   --mount type=bind,src=/path-on-host-machine/backups/,dst=/data/backups \
   --rm container-registry.oracle.com/mysql/community-server:8.4 \
   -c "mysqldump -uadmin --password='password' --all-databases > /data/backups/all-databases.sql"
   ```

   No comando, a opção `--entrypoint` é usada para que o shell do sistema seja invocado após o contêiner ser iniciado, e a opção `-c` é usada para especificar o comando `mysqldump` a ser executado no shell, cuja saída é redirecionada para o arquivo `all-databases.sql` no diretório de backup.
2. O contêiner sai quando o trabalho de backup é terminado e, com a opção `--rm` usada para iniciá-lo, ele é removido depois de sair. Um backup lógico foi criado e pode ser encontrado no diretório host montado para armazenar o backup, como mostrado aqui:

   ```
   $> ls /path-on-host-machine/backups/
   all-databases.sql
   ```

*Restaurar dados do MySQL Server usando `mysqldump` com o Docker*:

1. Certifique-se de ter um servidor MySQL em execução em um contêiner, no qual você deseja que seus dados de backup sejam restaurados.
2. Inicie um contêiner com uma imagem do MySQL Server para executar a restauração com um cliente `mysql`. Bind-mount diretório de dados do servidor, bem como a pasta de armazenamento que contém o seu backup:

   ```
   $> docker run  \
   --mount type=bind,src=/path-on-host-machine/datadir/,dst=/var/lib/mysql \
   --mount type=bind,src=/path-on-host-machine/backups/,dst=/data/backups \
   --rm container-registry.oracle.com/mysql/community-server:8.4 \
   mysql -uadmin --password='password' -e "source /data/backups/all-databases.sql"
   ```

   O contêiner sai quando o trabalho de backup é terminado e, com a opção `--rm` usada ao iniciá-lo, ele é removido depois de sair.
3. Faça login no servidor para verificar se os dados restaurados estão agora no servidor.

##### Problemas conhecidos

- Ao usar a variável do sistema do servidor `audit_log_file` para configurar o nome do arquivo de registro de auditoria, use o modificador de opção `loose` com ele; caso contrário, o Docker não pode iniciar o servidor.

##### Variáveis de ambiente do docker

Quando você cria um contêiner do MySQL Server, você pode configurar a instância do MySQL usando a opção `--env` (forma abreviada `-e`) e especificando uma ou mais variáveis de ambiente. Nenhuma inicialização do servidor é executada se o diretório de dados montado não estiver vazio, caso em que a configuração de qualquer uma dessas variáveis não tem efeito (veja Dados persistentes e alterações de configuração), e nenhum conteúdo existente do diretório, incluindo as configurações do servidor, são modificadas durante a inicialização do contêiner.

As variáveis de ambiente que podem ser usadas para configurar uma instância do MySQL estão listadas aqui:

- As variáveis booleanas incluindo `MYSQL_RANDOM_ROOT_PASSWORD`, `MYSQL_ONETIME_PASSWORD`, `MYSQL_ALLOW_EMPTY_PASSWORD` e `MYSQL_LOG_CONSOLE` são feitas verdadeiras ao configurá-las com qualquer string de comprimentos diferentes de zero. Portanto, configurá-las, por exemplo, 0, false ou no não as torna falsas, mas na verdade as torna verdadeiras.
- `MYSQL_RANDOM_ROOT_PASSWORD`: Quando esta variável é verdadeira (que é o seu estado padrão, a menos que `MYSQL_ROOT_PASSWORD` esteja definido ou `MYSQL_ALLOW_EMPTY_PASSWORD` esteja definido como verdadeiro), uma senha aleatória para o usuário raiz do servidor é gerada quando o contêiner do Docker é iniciado. A senha é impressa no `stdout` do contêiner e pode ser encontrada olhando para o log do contêiner (veja Iniciando uma Instância do Servidor MySQL).
- `MYSQL_ONETIME_PASSWORD`: Quando a variável é verdadeira (que é seu estado padrão, a menos que `MYSQL_ROOT_PASSWORD` seja definido ou `MYSQL_ALLOW_EMPTY_PASSWORD` seja definido como verdadeiro), a senha do usuário raiz é definida como expirada e deve ser alterada antes que o MySQL possa ser usado normalmente.
- `MYSQL_DATABASE`: Esta variável permite especificar o nome de um banco de dados a ser criado na inicialização da imagem. Se um nome de usuário e uma senha são fornecidos com `MYSQL_USER` e `MYSQL_PASSWORD`, o usuário é criado e concedido acesso de superusuário a este banco de dados (correspondente a `GRANT ALL`). O banco de dados especificado é criado por uma instrução CREATE DATABASE IF NOT EXIST, de modo que a variável não tem efeito se o banco de dados já existir.
- `MYSQL_USER`, `MYSQL_PASSWORD`: Essas variáveis são usadas em conjunto para criar um usuário e definir a senha desse usuário, e o usuário recebe permissões de superusuário para o banco de dados especificado pela variável `MYSQL_DATABASE`.

::: info Note

Não há necessidade de usar este mecanismo para criar o superusuário raiz, que é criado por padrão com a senha definida por qualquer um dos mecanismos discutidos nas descrições para `MYSQL_ROOT_PASSWORD` e `MYSQL_RANDOM_ROOT_PASSWORD`, a menos que `MYSQL_ALLOW_EMPTY_PASSWORD` seja verdadeiro.

:::

- `MYSQL_ROOT_HOST`: Por padrão, o MySQL cria a conta `'root'@'localhost'` . Esta conta só pode ser conectada a partir do interior do contêiner, como descrito em Conectar-se ao servidor MySQL a partir do interior do contêiner. Para permitir conexões de raiz de outros hosts, defina esta variável de ambiente. Por exemplo, o valor `172.17.0.1`, que é o IP do gateway do Docker padrão, permite conexões da máquina host que executa o contêiner. A opção aceita apenas uma entrada, mas são permitidos wildcards (por exemplo, `MYSQL_ROOT_HOST=172.*.*.*` ou `MYSQL_ROOT_HOST=%`).
- `MYSQL_LOG_CONSOLE`: Quando a variável é verdadeira (que é seu estado padrão para contêineres de servidor MySQL 8.4), o log de erro do MySQL Server é redirecionado para `stderr`, de modo que o log de erro vai para o log do contêiner do Docker e é visível usando o comando **docker logs `mysqld-container`** .

::: info Note

A variável não tem efeito se um ficheiro de configuração do servidor do host foi montado (ver Persisting Data and Configuration Changes on bind-mounting a configuration file).

:::

- `MYSQL_ROOT_PASSWORD`: Esta variável especifica uma senha que é definida para a conta raiz do MySQL.

Advertência

Definir a senha do usuário raiz do MySQL na linha de comando não é seguro. Como alternativa para especificar a senha explicitamente, você pode definir a variável com um caminho de arquivo de contêiner para um arquivo de senha e, em seguida, montar um arquivo de seu host que contém a senha no caminho de arquivo de contêiner. Isso ainda não é muito seguro, pois a localização do arquivo de senha ainda está exposta. É preferível usar as configurações padrão de `MYSQL_RANDOM_ROOT_PASSWORD` e `MYSQL_ONETIME_PASSWORD` sendo ambas verdadeiras.

- `MYSQL_ALLOW_EMPTY_PASSWORD`. Configure-o para true para permitir que o contêiner seja iniciado com uma senha em branco para o usuário root.

Advertência

Definir esta variável como true não é seguro, pois deixará sua instância MySQL completamente desprotegida, permitindo que qualquer pessoa obtenha acesso completo de superusuário. É preferível usar as configurações padrão de `MYSQL_RANDOM_ROOT_PASSWORD` e `MYSQL_ONETIME_PASSWORD` sendo ambas verdadeiras.
