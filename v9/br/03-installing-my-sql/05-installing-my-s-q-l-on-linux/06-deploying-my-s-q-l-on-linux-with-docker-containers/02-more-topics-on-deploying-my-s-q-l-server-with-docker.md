#### 2.5.6.2 Mais tópicos sobre a implantação do servidor MySQL com o Docker

Observação

A maioria dos comandos a seguir usa `container-registry.oracle.com/mysql/community-server` como a imagem Docker utilizada (como nos comandos **docker pull** e **docker run**); mude isso se a imagem vier de outro repositório — por exemplo, substitua-o por `container-registry.oracle.com/mysql/enterprise-server` para imagens da Edição Empresarial do MySQL baixadas do Oracle Container Registry (OCR), ou `mysql/enterprise-server` para imagens da Edição Empresarial do MySQL baixadas do [My Oracle Support](https://support.oracle.com/).

* A Instalação MySQL Otimizada para o Docker
* Configurando o Servidor MySQL
* Persistindo Alterações de Dados e Configurações
* Executando Scripts de Inicialização Adicionais
* Conectando-se ao MySQL a partir de uma Aplicação em Outro Contêiner Docker
* Diário de Erros do Servidor
* Usando o Backup do MySQL Enterprise com o Docker
* Usando o mysqldump com o Docker
* Problemas Conhecidos
* Variáveis de Ambiente do Docker

##### A Instalação MySQL Otimizada para o Docker

As imagens Docker para MySQL são otimizadas para o tamanho do código, o que significa que incluem apenas os componentes cruciais que são esperados para ser relevantes para a maioria dos usuários que executam instâncias do MySQL em contêineres Docker. Uma instalação Docker do MySQL é diferente de uma instalação comum, não Docker, nos seguintes aspectos:

* Apenas um número limitado de binários é incluído.
* Todos os binários são removidos; eles não contêm informações de depuração.

Aviso

Quaisquer atualizações ou instalações de software que os usuários realizarem no contêiner Docker (incluindo aquelas para componentes do MySQL) podem entrar em conflito com a instalação otimizada do MySQL criada pela imagem Docker. A Oracle não fornece suporte para produtos MySQL que estejam em um contêiner alterado ou em um contêiner criado a partir de uma imagem Docker alterada.

##### Configurando o Servidor MySQL

Ao iniciar o contêiner Docker MySQL, você pode passar opções de configuração para o servidor através do comando **docker run**. Por exemplo:

```
docker run --name mysql1 -d container-registry.oracle.com/mysql/community-server:tag --character-set-server=utf8mb4 --collation-server=utf8mb4_col
```

O comando inicia o Servidor MySQL com `utf8mb4` como conjunto de caracteres padrão e `utf8mb4_col` como collation padrão para bancos de dados.

Outra maneira de configurar o Servidor MySQL é preparar um arquivo de configuração e montá-lo na localização do arquivo de configuração do servidor dentro do contêiner. Veja Persistência de Dados e Alterações de Configuração para detalhes.

##### Persistência de Dados e Alterações de Configuração

Os contêineres Docker são, em princípio, efêmeros, e espera-se que quaisquer dados ou configurações sejam perdidos se o contêiner for excluído ou corrompido (veja discussões [aqui](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/)). [Volumes Docker](https://docs.docker.com/engine/admin/volumes/volumes/) fornece um mecanismo para persistir dados criados dentro de um contêiner Docker. Na inicialização, o contêiner do Servidor MySQL cria um volume Docker para o diretório de dados do servidor. A saída JSON do comando **docker inspect** no contêiner inclui uma chave `Mount`, cujo valor fornece informações sobre o volume do diretório de dados:

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

Outra maneira de preservar os dados é [ligar](https://docs.docker.com/engine/reference/commandline/service_create/#add-bind-mounts-volumes-or-memory-filesystems) um diretório do host usando a opção `--mount` ao criar o contêiner. A mesma técnica pode ser usada para persistir a configuração do servidor. O comando a seguir cria um contêiner do Servidor MySQL e liga tanto o diretório de dados quanto o arquivo de configuração do servidor:

```
docker run --name=mysql1 \
--mount type=bind,src=/path-on-host-machine/my.cnf,dst=/etc/my.cnf \
--mount type=bind,src=/path-on-host-machine/datadir,dst=/var/lib/mysql \
-d container-registry.oracle.com/mysql/community-server:tag
```

O comando monta `path-on-host-machine/my.cnf` em `/etc/my.cnf` (o arquivo de configuração do servidor dentro do contêiner) e `path-on-host-machine/datadir` em `/var/lib/mysql` (o diretório de dados dentro do contêiner). As seguintes condições devem ser atendidas para que o binding funcione:

* O arquivo de configuração `path-on-host-machine/my.cnf` deve já existir e conter a especificação para iniciar o servidor pelo usuário `mysql`:

  ```
  [mysqld]
  user=mysql
  ```

  Você também pode incluir outras opções de configuração do servidor no arquivo.

* O diretório de dados `path-on-host-machine/datadir` deve já existir. Para que a inicialização do servidor aconteça, o diretório deve estar vazio. Você também pode montar um diretório pré-preenchido com dados e iniciar o servidor com ele; no entanto, você deve garantir que inicie o contêiner Docker com a mesma configuração do servidor que criou os dados, e quaisquer arquivos ou diretórios do host necessários devem ser montados ao iniciar o contêiner.

##### Executando Scripts de Inicialização Adicionais
```
docker run --name=mysql1 \
--mount type=bind,src=/path-on-host-machine/scripts/,dst=/docker-entrypoint-initdb.d/ \
-d container-registry.oracle.com/mysql/community-server:tag
```

Se houver quaisquer scripts `.sh` ou `.sql` que você queira executar no banco de dados imediatamente após ele ter sido criado, você pode colocá-los em um diretório hospedeiro e, em seguida, montar o diretório em `/docker-entrypoint-initdb.d/` dentro do contêiner. Por exemplo:

```
docker network create my-custom-net
```

##### Conectar ao MySQL a partir de uma Aplicação em Outro Contêiner Docker

Configurando uma rede Docker, você pode permitir que vários contêineres Docker se comuniquem entre si, para que um aplicativo cliente em outro contêiner Docker possa acessar o Servidor MySQL no contêiner do servidor. Primeiro, crie uma rede Docker:

```
docker run --name=mysql1 --network=my-custom-net -d container-registry.oracle.com/mysql/community-server
```

Em seguida, ao criar e iniciar os contêineres do servidor e do cliente, use a opção `--network` para colocá-los na rede que você criou. Por exemplo:

```
docker run --name=myapp1 --network=my-custom-net -d myapp
```

```
docker exec -it myapp1 mysql --host=mysql1 --user=myuser --password
```

O contêiner `myapp1` pode então se conectar ao contêiner `mysql1` com o nome de host `mysql1` e vice-versa, pois o Docker configura automaticamente um DNS para os nomes de contêineres fornecidos. No exemplo seguinte, executamos o cliente **mysql** dentro do contêiner `myapp1` para se conectar ao host `mysql1` em seu próprio contêiner:

```
docker run --name=mysqlserver \
--mount type=bind,src=/path-on-host-machine/datadir/,dst=/var/lib/mysql \
-d mysql/enterprise-server:9.5
```

Para outras técnicas de rede para contêineres, consulte a seção [Rede de contêineres Docker](https://docs.docker.com/engine/userguide/networking/) nas Documentações do Docker.

##### Log de Erro do Servidor

Quando o Servidor MySQL é iniciado pela primeira vez com o seu contêiner do servidor, um log de erro do servidor NÃO é gerado se uma das seguintes condições for verdadeira:

* Um arquivo de configuração do servidor do host foi montado, mas o arquivo não contém a variável de sistema `log_error` (veja Persistindo Dados e Alterações de Configuração no bind-mounting de um arquivo de configuração do servidor).

* Um arquivo de configuração do servidor do host não foi montado, mas a variável de ambiente Docker `MYSQL_LOG_CONSOLE` está em `true` (o que é o estado padrão da variável para containers de servidor MySQL 9.5). O log de erro do MySQL Server é então redirecionado para `stderr`, para que o log de erro vá para o log do container Docker e possa ser visualizado usando o comando **docker logs *`mysqld-container`***.

Para fazer o MySQL Server gerar um log de erro quando uma das duas condições for verdadeira, use a opção `--log-error` para configurar o servidor para gerar o log de erro em um local específico dentro do container. Para persistir o log de erro, monte um arquivo do host no local do log de erro dentro do container, conforme explicado em Persistindo Dados e Alterações de Configuração. No entanto, você deve garantir que o seu MySQL Server dentro do seu container tenha acesso de escrita ao arquivo do host montado.

##### Usando o MySQL Enterprise Backup com Docker

O MySQL Enterprise Backup é uma ferramenta de backup com licença comercial para o MySQL Server, disponível com a [MySQL Enterprise Edition](https://www.mysql.com/products/enterprise/). O MySQL Enterprise Backup está incluído na instalação do Docker da MySQL Enterprise Edition.

No exemplo a seguir, assumimos que você já tem um MySQL Server rodando em um container Docker (veja a Seção 2.5.6.1, “Passos Básicos para Implantação do MySQL Server com Docker” sobre como iniciar uma instância do MySQL Server com Docker). Para que o MySQL Enterprise Backup faça o backup do MySQL Server, ele deve ter acesso ao diretório de dados do servidor. Isso pode ser alcançado, por exemplo, montando um diretório do host em um diretório de dados do MySQL Server ao iniciar o servidor:

```
   $> docker run \
   --mount type=bind,src=/path-on-host-machine/datadir/,dst=/var/lib/mysql \
   --mount type=bind,src=/path-on-host-machine/backups/,dst=/data/backups \
   --rm mysql/enterprise-server:9.5 \
   mysqlbackup -umysqlbackup -ppassword --backup-dir=/tmp/backup-tmp --with-timestamp \
   --backup-image=/data/backups/db.mbi backup-to-image
   ```

Com este comando, o servidor MySQL é iniciado com uma imagem do Docker da Edição Empresarial do MySQL, e o diretório host *`/caminho-na-máquina-anfitriã/datadir/`* foi montado no diretório de dados do servidor (`/var/lib/mysql`) dentro do contêiner do servidor. Também assumimos que, após o servidor ter sido iniciado, os privilégios necessários também foram configurados para o MySQL Enterprise Backup acessar o servidor (veja Grant MySQL Privileges to Backup Administrator, para detalhes). Use as etapas a seguir para fazer backup e restaurar uma instância do servidor MySQL.

Para fazer backup de uma instância do servidor MySQL em execução em um contêiner Docker usando o MySQL Enterprise Backup com Docker, siga as etapas listadas aqui:

1. No mesmo host onde o contêiner do servidor MySQL está em execução, inicie outro contêiner com uma imagem da Edição Empresarial do MySQL para realizar um backup com o comando `backup-to-image` do MySQL Enterprise Backup. Forneça acesso ao diretório de dados do servidor usando o bind mount que criamos no passo anterior. Além disso, monte um diretório host (*`/caminho-na-máquina-anfitriã/backups/`* neste exemplo) no diretório de armazenamento para backups no contêiner (`/data/backups` no exemplo) para persistir os backups que estamos criando. Aqui está um comando de amostra para este passo, no qual o MySQL Enterprise Backup é iniciado com uma imagem Docker baixada do [My Oracle Support](https://support.oracle.com):

   ```
   $> ls /tmp/backups
   db.mbi
   ```

   É importante verificar o final da saída pelo **mysqlbackup** para garantir que o backup tenha sido concluído com sucesso.

2. O contêiner sai uma vez que o trabalho de backup é concluído e, com a opção `--rm` usada para iniciá-lo, ele é removido após sair. Um backup de imagem foi criado e pode ser encontrado no diretório host montado no passo anterior para armazenamento de backups, como mostrado aqui:

Para restaurar uma instância do servidor MySQL em um contêiner Docker usando o MySQL Enterprise Backup com Docker, siga os passos listados aqui:

1. Parar o contêiner do servidor MySQL, o que também para o servidor MySQL em execução dentro dele:

   ```
   docker stop mysqlserver
   ```

2. No host, excluir todo o conteúdo no ponto de montagem de vinculação para o diretório de dados do servidor MySQL:

   ```
   rm -rf /path-on-host-machine/datadir/*
   ```

3. Iniciar um contêiner com uma imagem da Edição Empresarial do MySQL para realizar a restauração com o comando `copy-back-and-apply-log` do MySQL Enterprise Backup. Vincular o diretório de dados do servidor e a pasta de armazenamento para os backups, como fizemos ao fazer o backup do servidor:

   ```
   $> docker run \
   --mount type=bind,src=/path-on-host-machine/datadir/,dst=/var/lib/mysql \
   --mount type=bind,src=/path-on-host-machine/backups/,dst=/data/backups \
   --rm mysql/enterprise-server:9.5 \
   mysqlbackup --backup-dir=/tmp/backup-tmp --with-timestamp \
   --datadir=/var/lib/mysql --backup-image=/data/backups/db.mbi copy-back-and-apply-log

   mysqlbackup completed OK! with 3 warnings
   ```

   O contêiner sai com a mensagem " `mysqlbackup completed OK!`" (o backup foi concluído com sucesso) assim que o trabalho de backup for concluído e, com a opção `--rm` usada ao iniciá-lo, ele é removido após sair.

4. Reiniciar o contêiner do servidor, o que também reinicia o servidor restaurado, usando o seguinte comando:

   ```
   docker restart mysqlserver
   ```

   Ou, iniciar um novo servidor MySQL no diretório de dados restaurado, como mostrado aqui:

   ```
   docker run --name=mysqlserver2 \
   --mount type=bind,src=/path-on-host-machine/datadir/,dst=/var/lib/mysql \
   -d mysql/enterprise-server:9.5
   ```

   Faça login no servidor para verificar se o servidor está em execução com os dados restaurados.

##### Usando **mysqldump** com Docker

Além de usar o MySQL Enterprise Backup para fazer backup de um servidor MySQL em execução em um contêiner Docker, você pode realizar um backup lógico do seu servidor usando o utilitário **mysqldump**, executado dentro de um contêiner Docker.

As instruções a seguir assumem que você já tem um servidor MySQL rodando em um contêiner Docker e, quando o contêiner foi iniciado pela primeira vez, um diretório hoste *`/caminho-na-máquina-hoste/datadir/`* foi montado no diretório de dados do servidor `/var/lib/mysql` (veja como montar um diretório hoste por meio de bind-mounting no diretório de dados do Servidor MySQL para obter detalhes), que contém o arquivo de soquete Unix pelo qual **mysqldump** e **mysql** podem se conectar ao servidor. Também assumimos que, após o servidor ter sido iniciado, um usuário com os devidos privilégios (`admin` neste exemplo) foi criado, com o qual **mysqldump** pode acessar o servidor. Use as etapas a seguir para fazer backup e restaurar os dados do Servidor MySQL:

*Fazendo backup dos dados do Servidor MySQL usando **mysqldump** com Docker*:

1. No mesmo host onde o contêiner do Servidor MySQL está rodando, inicie outro contêiner com uma imagem do Servidor MySQL para realizar um backup com o utilitário **mysqldump** (veja a documentação do utilitário para sua funcionalidade, opções e limitações). Forneça acesso ao diretório de dados do servidor montando por bind-mounting *`/caminho-na-máquina-hoste/datadir/`. Além disso, monte um diretório hoste (*`/caminho-na-máquina-hoste/backups/`* neste exemplo) em uma pasta de armazenamento para backups dentro do contêiner (`/data/backups` é usado neste exemplo) para persistir os backups que você está criando. Aqui está um comando de amostra para fazer backup de todas as bases de dados no servidor usando esta configuração:

   ```
   $> docker run --entrypoint "/bin/sh" \
   --mount type=bind,src=/path-on-host-machine/datadir/,dst=/var/lib/mysql \
   --mount type=bind,src=/path-on-host-machine/backups/,dst=/data/backups \
   --rm container-registry.oracle.com/mysql/community-server:9.5 \
   -c "mysqldump -uadmin --password='password' --all-databases > /data/backups/all-databases.sql"
   ```

   No comando, a opção `--entrypoint` é usada para que o shell do sistema seja invocado após o contêiner ser iniciado, e a opção `-c` é usada para especificar o comando **mysqldump** a ser executado no shell, cuja saída é redirecionada para o arquivo `all-databases.sql` no diretório de backup.

2. O contêiner sai quando o trabalho de backup estiver concluído e, com a opção `--rm` usada para iniciá-lo, ele é removido após sair. Um backup lógico foi criado e pode ser encontrado no diretório do host montado para armazenar o backup, conforme mostrado aqui:

   ```
   $> ls /path-on-host-machine/backups/
   all-databases.sql
   ```

* Restaurando dados do servidor MySQL usando **mysqldump** com Docker*:

1. Certifique-se de que um servidor MySQL esteja em execução em um contêiner, no qual você deseja restaurar os dados de backup.

2. Inicie um contêiner com uma imagem do servidor MySQL para realizar a restauração com um cliente **mysql**. Monte o diretório de dados do servidor, bem como a pasta de armazenamento que contém seu backup:

   ```
   $> docker run  \
   --mount type=bind,src=/path-on-host-machine/datadir/,dst=/var/lib/mysql \
   --mount type=bind,src=/path-on-host-machine/backups/,dst=/data/backups \
   --rm container-registry.oracle.com/mysql/community-server:9.5 \
   mysql -uadmin --password='password' -e "source /data/backups/all-databases.sql"
   ```

   O contêiner sai quando o trabalho de backup estiver concluído e, com a opção `--rm` usada para iniciá-lo, ele é removido após sair.

3. Faça login no servidor para verificar se os dados restaurados estão agora no servidor.

##### Problemas Conhecidos

* Ao usar a variável de sistema do servidor `audit_log_file` para configurar o nome do arquivo de log de auditoria, use o modificador de opção `loose` com ele; caso contrário, o Docker não pode iniciar o servidor.

##### Variáveis de Ambiente do Docker

Ao criar um contêiner do servidor MySQL, você pode configurar a instância do MySQL usando a opção `--env` (forma abreviada `-e`) e especificar uma ou mais variáveis de ambiente. Não é realizada nenhuma inicialização do servidor se o diretório de dados montado não estiver vazio, caso em que definir qualquer uma dessas variáveis não tem efeito (veja Persistência de Mudanças de Dados e Configuração), e nenhum conteúdo existente do diretório, incluindo configurações do servidor, é modificado durante o inicialização do contêiner.

As variáveis de ambiente que podem ser usadas para configurar uma instância do MySQL estão listadas aqui:

* As variáveis booleanas, incluindo `MYSQL_RANDOM_ROOT_PASSWORD`, `MYSQL_ONETIME_PASSWORD`, `MYSQL_ALLOW_EMPTY_PASSWORD` e `MYSQL_LOG_CONSOLE`, são definidas como verdadeiras ao serem configuradas com strings de comprimento não nulo. Portanto, definí-las para, por exemplo, “0”, “false” ou “no” não as torna falsas, mas sim verdadeiras. Esse é um problema conhecido.

* `MYSQL_RANDOM_ROOT_PASSWORD`: Quando essa variável está definida como verdadeira (o que é seu estado padrão, a menos que `MYSQL_ROOT_PASSWORD` seja definido ou `MYSQL_ALLOW_EMPTY_PASSWORD` seja definido como verdadeiro), uma senha aleatória para o usuário root do servidor é gerada quando o contêiner Docker é iniciado. A senha é impressa no `stdout` do contêiner e pode ser encontrada olhando para o log do contêiner (veja Como iniciar uma instância do servidor MySQL).

* `MYSQL_ONETIME_PASSWORD`: Quando a variável está definida como verdadeira (o que é seu estado padrão, a menos que `MYSQL_ROOT_PASSWORD` seja definido ou `MYSQL_ALLOW_EMPTY_PASSWORD` seja definido como verdadeiro), a senha do usuário root é definida como expirada e deve ser alterada antes que o MySQL possa ser usado normalmente.

* `MYSQL_DATABASE`: Essa variável permite que você especifique o nome de um banco de dados a ser criado na inicialização da imagem. Se um nome de usuário e uma senha forem fornecidos com `MYSQL_USER` e `MYSQL_PASSWORD`, o usuário é criado e recebe acesso de superusuário a esse banco de dados (correspondente a `GRANT ALL`). O banco de dados especificado é criado por uma instrução CREATE DATABASE IF NOT EXIST, então a variável não tem efeito se o banco de dados já existir.

* `MYSQL_USER`, `MYSQL_PASSWORD`: Essas variáveis são usadas em conjunto para criar um usuário e definir a senha desse usuário, e o usuário recebe permissões de superusuário para o banco de dados especificado pela variável `MYSQL_DATABASE`. Ambas as variáveis `MYSQL_USER` e `MYSQL_PASSWORD` são necessárias para que um usuário seja criado — se qualquer uma das duas variáveis não for definida, a outra é ignorada. Se ambas as variáveis forem definidas, mas `MYSQL_DATABASE` não, o usuário é criado sem quaisquer privilégios.

  Nota

  Não há necessidade de usar esse mecanismo para criar o superusuário root, que é criado por padrão com a senha definida por um dos mecanismos discutidos nas descrições para `MYSQL_ROOT_PASSWORD` e `MYSQL_RANDOM_ROOT_PASSWORD`, a menos que `MYSQL_ALLOW_EMPTY_PASSWORD` seja `true`.

* `MYSQL_ROOT_HOST`: Por padrão, o MySQL cria a conta `'root'@'localhost'`. Essa conta só pode ser conectada a partir do interior do contêiner, conforme descrito em Conectar ao servidor MySQL a partir do interior do contêiner. Para permitir conexões de root de outros hosts, defina essa variável de ambiente. Por exemplo, o valor `172.17.0.1`, que é o IP padrão do gateway do Docker, permite conexões da máquina host que executa o contêiner. A opção aceita apenas uma entrada, mas os caracteres curinga são permitidos (por exemplo, `MYSQL_ROOT_HOST=172.*.*.*` ou `MYSQL_ROOT_HOST=%`).

* `MYSQL_LOG_CONSOLE`: Quando a variável é `true` (o que é seu estado padrão para contêineres do servidor MySQL 9.5), o log de erro do MySQL Server é redirecionado para `stderr`, para que o log de erro vá para o log do contêiner do Docker e seja visível usando o comando **docker logs *`mysqld-container`***.

  Nota

A variável não tem efeito se um arquivo de configuração do servidor do host tiver sido montado (consulte Persistência de alterações de dados e configuração ao vincular um arquivo de configuração).

* `MYSQL_ROOT_PASSWORD`: Esta variável especifica uma senha definida para a conta de root do MySQL.

* `MYSQL_ALLOW_EMPTY_PASSWORD`: Defina para true para permitir que o contêiner seja iniciado com uma senha em branco para o usuário root.

* `MYSQL_ALLOW_EMPTY_PASSWORD`. Defina para true para permitir que o contêiner seja iniciado com uma senha em branco para o usuário root.

Aviso

Definir esta variável para true é inseguro, pois deixará sua instância do MySQL completamente desprotegida, permitindo que qualquer pessoa obtenha acesso completo de superusuário. É preferível usar as configurações padrão de `MYSQL_RANDOM_ROOT_PASSWORD` e `MYSQL_ONETIME_PASSWORD` ambas verdadeiras.