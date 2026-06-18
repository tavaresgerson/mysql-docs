#### 2.5.6.2 Mais tópicos sobre implantação do servidor MySQL com Docker

Nota

A maioria dos comandos da amostra a seguir tem `container-registry.oracle.com/mysql/community-server` como a imagem do Docker que está sendo usada (como nos comandos **docker pull** e **docker run**); mude isso se sua imagem vier de outro repositório — por exemplo, substitua por `container-registry.oracle.com/mysql/enterprise-server` para imagens da MySQL Enterprise Edition baixadas do Oracle Container Registry (OCR), ou `mysql/enterprise-server` para imagens da MySQL Enterprise Edition baixadas do My Oracle Support.

- A Instalação MySQL Otimizada para Docker
- Configurando o servidor MySQL
- Mudanças persistentes de dados e configuração
- Executar scripts de inicialização adicionais
- Conectar-se ao MySQL a partir de uma aplicação em outro contêiner Docker
- Registro de erros do servidor
- Usando o MySQL Enterprise Backup com Docker
- Usando mysqldump com Docker
- Problemas conhecidos
- Variáveis de ambiente do Docker

##### A Instalação MySQL Otimizada para Docker

As imagens Docker para MySQL são otimizadas para o tamanho do código, o que significa que elas incluem apenas os componentes cruciais que são esperados para serem relevantes para a maioria dos usuários que executam instâncias do MySQL em contêineres Docker. Uma instalação do MySQL Docker é diferente de uma instalação comum, não Docker, nos seguintes aspectos:

- Apenas um número limitado de binários está incluído.
- Todos os binários são desprovidos de informações de depuração; eles não contêm informações de depuração.

Aviso

Quaisquer atualizações ou instalações de software que os usuários realizarem no contêiner Docker (incluindo aquelas para componentes do MySQL) podem entrar em conflito com a instalação otimizada do MySQL criada pela imagem Docker. A Oracle não oferece suporte para produtos MySQL que estejam em um contêiner alterado ou em um contêiner criado a partir de uma imagem Docker alterada.

##### Configurando o servidor MySQL

Ao iniciar o contêiner MySQL Docker, você pode passar opções de configuração para o servidor através do comando **docker run**. Por exemplo:

```
docker run --name mysql1 -d container-registry.oracle.com/mysql/community-server:tag --character-set-server=utf8mb4 --collation-server=utf8mb4_col
```

O comando inicia o servidor MySQL com `utf8mb4` como conjunto de caracteres padrão e `utf8mb4_col` como ordenação padrão para bancos de dados.

Outra maneira de configurar o MySQL Server é preparar um arquivo de configuração e montá-lo no local do arquivo de configuração do servidor dentro do contêiner. Veja Persistência de Dados e Alterações de Configuração para detalhes.

##### Mudanças persistentes de dados e configuração

Os contêineres Docker são, em princípio, efêmeros, e espera-se que quaisquer dados ou configurações sejam perdidos se o contêiner for excluído ou corrompido (veja discussões aqui). Os volumes Docker fornecem um mecanismo para persistir dados criados dentro de um contêiner Docker. Na sua inicialização, o contêiner do Servidor MySQL cria um volume Docker para o diretório de dados do servidor. A saída JSON do comando **docker inspect** no contêiner inclui uma chave `Mount`, cujo valor fornece informações sobre o volume do diretório de dados:

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

Outra maneira de preservar os dados é vincular um diretório do host usando a opção `--mount` ao criar o contêiner. A mesma técnica pode ser usada para persistir a configuração do servidor. O comando a seguir cria um contêiner do MySQL Server e vincula tanto o diretório de dados quanto o arquivo de configuração do servidor:

```
docker run --name=mysql1 \
--mount type=bind,src=/path-on-host-machine/my.cnf,dst=/etc/my.cnf \
--mount type=bind,src=/path-on-host-machine/datadir,dst=/var/lib/mysql \
-d container-registry.oracle.com/mysql/community-server:tag
```

O comando monta `path-on-host-machine/my.cnf` em `/etc/my.cnf` (o arquivo de configuração do servidor dentro do contêiner) e `path-on-host-machine/datadir` em `/var/lib/mysql` (o diretório de dados dentro do contêiner). As seguintes condições devem ser atendidas para que o montagem por vinculação funcione:

- O arquivo de configuração `path-on-host-machine/my.cnf` já deve existir e deve conter a especificação para iniciar o servidor pelo usuário `mysql`:

  ```
  [mysqld]
  user=mysql
  ```

  Você também pode incluir outras opções de configuração do servidor no arquivo.

- O diretório de dados `path-on-host-machine/datadir` já deve existir. Para que a inicialização do servidor ocorra, o diretório deve estar vazio. Você também pode montar um diretório pré-preenchido com dados e iniciar o servidor com ele; no entanto, você deve garantir que inicie o contêiner Docker com a mesma configuração do servidor que criou os dados, e quaisquer arquivos ou diretórios hostis necessários devem ser montados ao iniciar o contêiner.

##### Executar scripts de inicialização adicionais

Se houver quaisquer scripts `.sh` ou `.sql` que você queira executar no banco de dados imediatamente após ele ter sido criado, você pode colocá-los em um diretório de host e, em seguida, montar o diretório em `/docker-entrypoint-initdb.d/` dentro do contêiner. Por exemplo:

```
docker run --name=mysql1 \
--mount type=bind,src=/path-on-host-machine/scripts/,dst=/docker-entrypoint-initdb.d/ \
-d container-registry.oracle.com/mysql/community-server:tag
```

##### Conectar-se ao MySQL a partir de uma aplicação em outro contêiner Docker

Ao configurar uma rede Docker, você pode permitir que vários contêineres Docker se comuniquem entre si, para que um aplicativo cliente em outro contêiner Docker possa acessar o servidor MySQL no contêiner do servidor. Primeiro, crie uma rede Docker:

```
docker network create my-custom-net
```

Depois, ao criar e iniciar os contêineres do servidor e do cliente, use a opção `--network` para colocá-los na rede que você criou. Por exemplo:

```
docker run --name=mysql1 --network=my-custom-net -d container-registry.oracle.com/mysql/community-server
```

```
docker run --name=myapp1 --network=my-custom-net -d myapp
```

O contêiner `myapp1` pode então se conectar ao contêiner `mysql1` com o nome de host `mysql1` e vice-versa, pois o Docker configura automaticamente um DNS para os nomes de contêineres fornecidos. No exemplo a seguir, executamos o cliente **mysql** dentro do contêiner `myapp1` para se conectar ao host `mysql1` em seu próprio contêiner:

```
docker exec -it myapp1 mysql --host=mysql1 --user=myuser --password
```

Para outras técnicas de rede para containers, consulte a seção de rede de containers do Docker na documentação do Docker.

##### Registro de erros do servidor

Quando o MySQL Server é iniciado pela primeira vez com o seu contêiner do servidor, um log de erro do servidor NÃO é gerado se uma das seguintes condições for verdadeira:

- Um arquivo de configuração do servidor do host foi montado, mas o arquivo não contém a variável de sistema `log_error` (veja Mudanças persistentes de dados e configuração no bind-mounting de um arquivo de configuração do servidor).

- Um arquivo de configuração do servidor do host não foi montado, mas a variável de ambiente Docker `MYSQL_LOG_CONSOLE` é `true` (que é o estado padrão da variável para containers do servidor MySQL 8.0). O log de erro do MySQL Server é então redirecionado para `stderr`, para que o log de erro vá para o log do container Docker e seja visível usando o comando **docker logs `mysqld-container`**.

Para fazer com que o MySQL Server gere um log de erro quando uma das duas condições for verdadeira, use a opção `--log-error` para configurar o servidor para gerar o log de erro em um local específico dentro do contêiner. Para persistir o log de erro, monte um arquivo de host no local do log de erro dentro do contêiner, conforme explicado em Persistência de Dados e Alterações de Configuração. No entanto, você deve garantir que o seu MySQL Server dentro do contêiner tenha acesso de escrita ao arquivo de host montado.

##### Usando o MySQL Enterprise Backup com Docker

O MySQL Enterprise Backup é um utilitário de backup com licença comercial para o MySQL Server, disponível com a Edição Empresarial do MySQL. O MySQL Enterprise Backup está incluído na instalação do Docker da Edição Empresarial do MySQL.

No exemplo a seguir, assumimos que você já tem um servidor MySQL rodando em um contêiner Docker (veja a Seção 2.5.6.1, “Passos básicos para implantação do servidor MySQL com Docker”, sobre como iniciar uma instância do servidor MySQL com o Docker). Para que o Backup do MySQL Enterprise faça o backup do servidor MySQL, ele deve ter acesso ao diretório de dados do servidor. Isso pode ser feito, por exemplo, montando um diretório hospedeiro no diretório de dados do servidor MySQL quando você inicia o servidor:

```
docker run --name=mysqlserver \
--mount type=bind,src=/path-on-host-machine/datadir/,dst=/var/lib/mysql \
-d mysql/enterprise-server:8.0
```

Com este comando, o servidor MySQL é iniciado com uma imagem Docker da Edição Empresarial do MySQL, e o diretório do host `/path-on-host-machine/datadir/` foi montado no diretório de dados do servidor (`/var/lib/mysql`) dentro do contêiner do servidor. Também assumimos que, após o servidor ter sido iniciado, os privilégios necessários também foram configurados para o MySQL Enterprise Backup acessar o servidor (consulte Conceder privilégios ao administrador de backup do MySQL, para detalhes). Use as etapas a seguir para fazer backup e restaurar uma instância do servidor MySQL.

Para fazer backup de uma instância do servidor MySQL em execução em um contêiner Docker usando o MySQL Enterprise Backup com Docker, siga os passos listados aqui:

1. No mesmo host onde o contêiner do Servidor MySQL está rodando, inicie outro contêiner com uma imagem da Edição Empresarial do MySQL para realizar um backup com o comando MySQL Enterprise Backup `backup-to-image`. Forneça acesso ao diretório de dados do servidor usando o bind mount que criamos no passo anterior. Além disso, monte um diretório de host (`/path-on-host-machine/backups/` neste exemplo) na pasta de armazenamento para backups no contêiner (`/data/backups` no exemplo) para persistir os backups que estamos criando. Aqui está um comando de exemplo para este passo, no qual o MySQL Enterprise Backup é iniciado com uma imagem Docker baixada do My Oracle Support:

   ```
   $> docker run \
   --mount type=bind,src=/path-on-host-machine/datadir/,dst=/var/lib/mysql \
   --mount type=bind,src=/path-on-host-machine/backups/,dst=/data/backups \
   --rm mysql/enterprise-server:8.0 \
   mysqlbackup -umysqlbackup -ppassword --backup-dir=/tmp/backup-tmp --with-timestamp \
   --backup-image=/data/backups/db.mbi backup-to-image

   [Entrypoint] MySQL Docker Image 8.0.11-1.1.5
   MySQL Enterprise Backup version 8.0.11 Linux-4.1.12-61.1.16.el7uek.x86_64-x86_64 [2018-04-08  07:06:45]
   Copyright (c) 2003, 2018, Oracle and/or its affiliates. All Rights Reserved.

   180921 17:27:25 MAIN    INFO: A thread created with Id '140594390935680'
   180921 17:27:25 MAIN    INFO: Starting with following command line ...
   ...

   -------------------------------------------------------------
      Parameters Summary
   -------------------------------------------------------------
      Start LSN                  : 29615616
      End LSN                    : 29651854
   -------------------------------------------------------------

   mysqlbackup completed OK!
   ```

   É importante verificar o final da saída do **mysqlbackup** para garantir que o backup tenha sido concluído com sucesso.

2. O contêiner sai assim que o trabalho de backup for concluído e, com a opção `--rm` usada para iniciá-lo, ele é removido após sair. Uma cópia de segurança da imagem foi criada e pode ser encontrada no diretório do host montado no passo anterior para armazenamento de backups, conforme mostrado aqui:

   ```
   $> ls /tmp/backups
   db.mbi
   ```

Para restaurar uma instância do servidor MySQL em um contêiner Docker usando o MySQL Enterprise Backup com Docker, siga os passos listados aqui:

1. Pare o contêiner do servidor MySQL, que também para o servidor MySQL em execução:

   ```
   docker stop mysqlserver
   ```

2. No host, exclua todo o conteúdo no ponto de montagem bind para o diretório de dados do servidor MySQL:

   ```
   rm -rf /path-on-host-machine/datadir/*
   ```

3. Comece um contêiner com uma imagem do MySQL Enterprise Edition para realizar o restore com o comando MySQL Enterprise Backup `copy-back-and-apply-log`. Monte o diretório de dados do servidor e a pasta de armazenamento para os backups, como fizemos ao fazer o backup do servidor:

   ```
   $> docker run \
   --mount type=bind,src=/path-on-host-machine/datadir/,dst=/var/lib/mysql \
   --mount type=bind,src=/path-on-host-machine/backups/,dst=/data/backups \
   --rm mysql/enterprise-server:8.0 \
   mysqlbackup --backup-dir=/tmp/backup-tmp --with-timestamp \
   --datadir=/var/lib/mysql --backup-image=/data/backups/db.mbi copy-back-and-apply-log

   [Entrypoint] MySQL Docker Image 8.0.11-1.1.5
   MySQL Enterprise Backup version 8.0.11 Linux-4.1.12-61.1.16.el7uek.x86_64-x86_64 [2018-04-08  07:06:45]
   Copyright (c) 2003, 2018, Oracle and/or its affiliates. All Rights Reserved.

   180921 22:06:52 MAIN    INFO: A thread created with Id '139768047519872'
   180921 22:06:52 MAIN    INFO: Starting with following command line ...
   ...
   180921 22:06:52 PCR1    INFO: We were able to parse ibbackup_logfile up to
             lsn 29680612.
   180921 22:06:52 PCR1    INFO: Last MySQL binlog file position 0 155, file name binlog.000003
   180921 22:06:52 PCR1    INFO: The first data file is '/var/lib/mysql/ibdata1'
                                 and the new created log files are at '/var/lib/mysql'
   180921 22:06:52 MAIN    INFO: No Keyring file to process.
   180921 22:06:52 MAIN    INFO: Apply-log operation completed successfully.
   180921 22:06:52 MAIN    INFO: Full Backup has been restored successfully.

   mysqlbackup completed OK! with 3 warnings
   ```

   O contêiner sai assim que o trabalho de backup for concluído e, com a opção `--rm` usada ao iniciá-lo, ele é removido após sair.

4. Reinicie o contêiner do servidor, que também reinicia o servidor restaurado, usando o seguinte comando:

   ```
   docker restart mysqlserver
   ```

   Ou, inicie um novo servidor MySQL no diretório de dados restaurado, conforme mostrado aqui:

   ```
   docker run --name=mysqlserver2 \
   --mount type=bind,src=/path-on-host-machine/datadir/,dst=/var/lib/mysql \
   -d mysql/enterprise-server:8.0
   ```

   Faça login no servidor para verificar se o servidor está em execução com os dados restaurados.

##### Usando **mysqldump** com Docker

Além de usar o MySQL Enterprise Backup para fazer backup de um servidor MySQL em execução em um contêiner Docker, você pode realizar um backup lógico do seu servidor usando o utilitário **mysqldump**, executado dentro de um contêiner Docker.

As instruções a seguir assumem que você já tem um servidor MySQL rodando em um contêiner Docker e, quando o contêiner foi iniciado pela primeira vez, um diretório hospedeiro `/path-on-host-machine/datadir/` foi montado no diretório de dados do servidor `/var/lib/mysql` (consulte o artigo "Montagem de um diretório hospedeiro em um diretório de dados do MySQL Server" para obter detalhes), que contém o arquivo de soquete Unix pelo qual o **mysqldump** e o **mysql** podem se conectar ao servidor. Também assumimos que, após o servidor ter sido iniciado, um usuário com os devidos privilégios (`admin` neste exemplo) foi criado, com o qual o **mysqldump** pode acessar o servidor. Use as etapas a seguir para fazer backup e restaurar os dados do MySQL Server:

*Fazer backup dos dados do servidor MySQL usando **mysqldump** com Docker*:

1. No mesmo host onde o contêiner do Servidor MySQL está rodando, inicie outro contêiner com uma imagem do Servidor MySQL para realizar um backup com o utilitário **mysqldump** (consulte a documentação do utilitário para conhecer suas funcionalidades, opções e limitações). Forneça acesso ao diretório de dados do servidor montando o `/path-on-host-machine/datadir/` por vinculação. Além disso, monte um diretório do host (`/path-on-host-machine/backups/` neste exemplo) em uma pasta de armazenamento para backups dentro do contêiner (`/data/backups` é usado neste exemplo) para persistir os backups que você está criando. Aqui está um comando de exemplo para fazer backup de todos os bancos de dados no servidor usando essa configuração:

   ```
   $> docker run --entrypoint "/bin/sh" \
   --mount type=bind,src=/path-on-host-machine/datadir/,dst=/var/lib/mysql \
   --mount type=bind,src=/path-on-host-machine/backups/,dst=/data/backups \
   --rm container-registry.oracle.com/mysql/community-server:8.0 \
   -c "mysqldump -uadmin --password='password' --all-databases > /data/backups/all-databases.sql"
   ```

   No comando, a opção `--entrypoint` é usada para invocar o shell do sistema após o início do contêiner, e a opção `-c` é usada para especificar o comando **mysqldump** a ser executado no shell, cuja saída é redirecionada para o arquivo `all-databases.sql` no diretório de backup.

2. O contêiner sai assim que o trabalho de backup for concluído e, com a opção `--rm` usada para iniciá-lo, ele é removido após sair. Um backup lógico foi criado e pode ser encontrado no diretório do host montado para armazenar o backup, conforme mostrado aqui:

   ```
   $> ls /path-on-host-machine/backups/
   all-databases.sql
   ```

*Restauração de dados do MySQL Server usando **mysqldump** com Docker*:

1. Certifique-se de que você tem um servidor MySQL rodando em um contêiner, no qual você deseja restaurar seus dados de backup.

2. Comece um container com uma imagem do MySQL Server para realizar o restauro com um cliente **mysql**. Vincule o diretório de dados do servidor, bem como a pasta de armazenamento que contém seu backup:

   ```
   $> docker run  \
   --mount type=bind,src=/path-on-host-machine/datadir/,dst=/var/lib/mysql \
   --mount type=bind,src=/path-on-host-machine/backups/,dst=/data/backups \
   --rm container-registry.oracle.com/mysql/community-server:8.0 \
   mysql -uadmin --password='password' -e "source /data/backups/all-databases.sql"
   ```

   O contêiner sai assim que o trabalho de backup for concluído e, com a opção `--rm` usada ao iniciá-lo, ele é removido após sair.

3. Faça login no servidor para verificar se os dados restaurados estão agora no servidor.

##### Problemas conhecidos

- Ao usar a variável de sistema do servidor `audit_log_file` para configurar o nome do arquivo de log de auditoria, use o modificador de opção `loose` com ele; caso contrário, o Docker não poderá iniciar o servidor.

##### Variáveis de ambiente do Docker

Ao criar um contêiner do MySQL Server, você pode configurar a instância do MySQL usando a opção `--env` (forma abreviada `-e`) e especificando uma ou mais variáveis de ambiente. Não é realizada nenhuma inicialização do servidor se o diretório de dados montado não estiver vazio, caso em que definir qualquer uma dessas variáveis não tem efeito (veja Persistência de Mudanças de Dados e Configuração), e nenhum conteúdo existente do diretório, incluindo as configurações do servidor, é modificado durante o início do contêiner.

As variáveis de ambiente que podem ser usadas para configurar uma instância do MySQL estão listadas aqui:

- As variáveis lógicas, incluindo `MYSQL_RANDOM_ROOT_PASSWORD`, `MYSQL_ONETIME_PASSWORD`, `MYSQL_ALLOW_EMPTY_PASSWORD` e `MYSQL_LOG_CONSOLE`, são definidas como verdadeiras ao serem definidas com qualquer string de comprimento não nulo. Portanto, definí-las, por exemplo, como “0”, “false” ou “não” não as torna falsas, mas, na verdade, as torna verdadeiras. Esse é um problema conhecido.

- `MYSQL_RANDOM_ROOT_PASSWORD`: Quando essa variável estiver verdadeira (o que é seu estado padrão, a menos que `MYSQL_ROOT_PASSWORD` seja definido ou `MYSQL_ALLOW_EMPTY_PASSWORD` seja definido como verdadeiro), uma senha aleatória para o usuário root do servidor será gerada quando o contêiner Docker for iniciado. A senha será impressa em `stdout` do contêiner e pode ser encontrada olhando o log do contêiner (veja Como iniciar uma instância do servidor MySQL).

- `MYSQL_ONETIME_PASSWORD`: Quando a variável estiver verdadeira (o que é seu estado padrão, a menos que `MYSQL_ROOT_PASSWORD` seja definido ou `MYSQL_ALLOW_EMPTY_PASSWORD` seja definido como verdadeiro), a senha do usuário raiz será definida como expirada e precisará ser alterada antes que o MySQL possa ser usado normalmente.

- `MYSQL_DATABASE`: Esta variável permite que você especifique o nome de um banco de dados a ser criado na inicialização da imagem. Se um nome de usuário e uma senha forem fornecidos com `MYSQL_USER` e `MYSQL_PASSWORD`, o usuário é criado e recebe acesso de superusuário a este banco de dados (correspondente a `GRANT ALL`). O banco de dados especificado é criado por uma instrução CREATE DATABASE IF NOT EXIST, de modo que a variável não tenha efeito se o banco de dados já existir.

- `MYSQL_USER`, `MYSQL_PASSWORD`: Essas variáveis são usadas em conjunto para criar um usuário e definir a senha desse usuário, e o usuário recebe permissões de superusuário para o banco de dados especificado pela variável `MYSQL_DATABASE`. Tanto `MYSQL_USER` quanto `MYSQL_PASSWORD` são necessários para que um usuário seja criado — se qualquer uma das duas variáveis não for definida, a outra é ignorada. Se ambas as variáveis forem definidas, mas `MYSQL_DATABASE` não estiver definida, o usuário será criado sem quaisquer privilégios.

  Nota

  Não é necessário usar esse mecanismo para criar o superusuário raiz, que é criado por padrão com a senha definida por um dos mecanismos discutidos nas descrições para `MYSQL_ROOT_PASSWORD` e `MYSQL_RANDOM_ROOT_PASSWORD`, a menos que `MYSQL_ALLOW_EMPTY_PASSWORD` seja verdadeiro.

- `MYSQL_ROOT_HOST`: Por padrão, o MySQL cria a conta `'root'@'localhost'`. Essa conta só pode ser conectada a partir do interior do contêiner, conforme descrito em Conectar ao servidor MySQL dentro do contêiner. Para permitir conexões de root de outros hosts, defina essa variável de ambiente. Por exemplo, o valor `172.17.0.1`, que é o IP padrão do gateway Docker, permite conexões a partir da máquina host que executa o contêiner. A opção aceita apenas uma entrada, mas caracteres especiais são permitidos (por exemplo, `MYSQL_ROOT_HOST=172.*.*.*` ou `MYSQL_ROOT_HOST=%`).

- `MYSQL_LOG_CONSOLE`: Quando a variável é verdadeira (o que é seu estado padrão para os contêineres do servidor MySQL 8.0), o log de erro do MySQL Server é redirecionado para `stderr`, para que o log de erro vá para o log do contêiner Docker e possa ser visualizado usando o comando **docker logs `mysqld-container`**.

  Nota

  A variável não tem efeito se um arquivo de configuração do servidor do host tiver sido montado (consulte Persistência de alterações de dados e configuração ao vincular um arquivo de configuração).

- `MYSQL_ROOT_PASSWORD`: Esta variável especifica uma senha definida para a conta raiz do MySQL.

  Aviso

  Definir a senha do usuário root do MySQL na linha de comando é inseguro. Como alternativa para especificar a senha explicitamente, você pode definir a variável com um caminho de arquivo de contêiner para um arquivo de senha e, em seguida, montar um arquivo do seu host que contenha a senha no caminho do arquivo de contêiner. Isso ainda não é muito seguro, pois a localização do arquivo de senha ainda está exposta. É preferível usar as configurações padrão de `MYSQL_RANDOM_ROOT_PASSWORD` e `MYSQL_ONETIME_PASSWORD` sendo ambas verdadeiras.

- `MYSQL_ALLOW_EMPTY_PASSWORD`. Defina para verdadeiro para permitir que o contêiner seja iniciado com uma senha em branco para o usuário root.

  Aviso

  Definir essa variável para verdadeiro é inseguro, pois deixará sua instância do MySQL completamente desprotegida, permitindo que qualquer pessoa obtenha acesso completo como superusuário. É preferível usar as configurações padrão de `MYSQL_RANDOM_ROOT_PASSWORD` e `MYSQL_ONETIME_PASSWORD`, ambas com o valor verdadeiro.
