#### 8.4.5.14 Migração de Chaves entre Armazenamentos de Chaves de Armazenamento de Chaves

A migração de chaves copia as chaves de um armazenamento de chaves para outro, permitindo que um DBA mude uma instalação do MySQL para um armazenamento de chaves diferente. Uma operação de migração bem-sucedida tem este resultado:

* O armazenamento de chaves de destino contém as chaves que tinha antes da migração, além das chaves do armazenamento de chaves de origem.

* O armazenamento de chaves de origem permanece o mesmo antes e depois da migração (porque as chaves são copiadas, não movidas).

Se uma chave a ser copiada já existir no armazenamento de chaves de destino, ocorre um erro e o armazenamento de chaves de destino é restaurado ao seu estado pré-migração.

O armazenamento de chaves gerencia os armazenamentos de chaves usando componentes de armazenamento de chaves e plugins de armazenamento de chaves. Isso se aplica à estratégia de migração porque a maneira como os armazenamentos de chaves de origem e destino são gerenciados determina o procedimento para realizar um determinado tipo de migração de chaves:

* Migração de um plugin de armazenamento de chaves para outro: O servidor MySQL tem um modo operacional que fornece essa capacidade.

* Migração de um plugin de armazenamento de chaves para um componente de armazenamento de chaves: O servidor MySQL tem um modo operacional que fornece essa capacidade.

* Migração de um componente de armazenamento de chaves para outro: O utilitário **mysql_migrate_keyring** fornece essa capacidade.

* Migração de um componente de armazenamento de chaves para um plugin de armazenamento de chaves: O servidor MySQL tem um modo operacional que fornece essa capacidade.

As seções a seguir discutem as características das migrações de chaves offline e online e descrevem como realizar migrações.

* Migração de Chaves Offline e Online
* Migração de Chaves Usando um Servidor de Migração
* Migração de Chaves Usando o Utilitário mysql_migrate_keyring
* Migração de Chaves que Envolvem Vários Servidores em Execução

* Migração offline: Para uso quando você tem certeza de que nenhum servidor em execução no host local está usando o keystore de origem ou destino. Neste caso, a operação de migração pode copiar chaves do keystore de origem para o destino sem a possibilidade de um servidor em execução modificar o conteúdo do keystore durante a operação.

* Migração online: Para uso quando um servidor em execução no host local está usando o keystore de origem. Neste caso, é necessário tomar cuidado para evitar que esse servidor atualize os keystores durante a migração. Isso envolve se conectar ao servidor em execução e instruí-lo a pausar as operações do keyring para que as chaves possam ser copiadas com segurança do keystore de origem para o destino. Quando a cópia de chaves estiver completa, o servidor em execução é autorizado a retomar as operações do keyring.

Ao planejar uma migração de chaves, use esses pontos para decidir se ela deve ser offline ou online:

* Não realize uma migração offline envolvendo um keystore que esteja sendo usado por um servidor em execução.

* A pausa nas operações do keyring durante uma migração online é realizada conectando-se ao servidor em execução e definindo sua variável de sistema global `keyring_operations` para `OFF` antes da cópia de chaves e `ON` após a cópia de chaves. Isso tem várias implicações:

  + `keyring_operations` foi introduzido no MySQL 5.7.21, então a migração online é possível apenas se o servidor em execução for do MySQL 5.7.21 ou superior. Se o servidor em execução for mais antigo, você deve pará-lo, realizar uma migração offline e reiniciá-lo. Todas as instruções de migração em outros lugares que se referem a `keyring_operations` estão sujeitas a essa condição.

+ A conta usada para se conectar ao servidor em execução deve ter os privilégios necessários para modificar `keyring_operations`. Esses privilégios são `ENCRYPTION_KEY_ADMIN`, além de `SYSTEM_VARIABLES_ADMIN` ou o privilégio desatualizado `SUPER`.

  + Se uma operação de migração online sair anormalmente (por exemplo, se for encerrada forçadamente), é possível que `keyring_operations` permaneça desativado no servidor em execução, impedindo que ele realize operações de keyring. Nesse caso, pode ser necessário se conectar ao servidor em execução e habilitar `keyring_operations` manualmente usando essa instrução:

    ```
    SET GLOBAL keyring_operations = ON;
    ```

* A migração de chaves online permite pausar as operações de keyring em um único servidor em execução. Para realizar uma migração se vários servidores em execução estiverem usando os estojos de chaves envolvidos, use o procedimento descrito em Migração de Chaves que Envolve Vários Servidores em Execução.

##### Migração de Chaves Usando um Servidor de Migração

Nota

A migração de chaves online usando um servidor de migração só é suportada se o servidor em execução permitir conexões de soquete ou conexões TCP/IP usando TLS; não é suportada quando, por exemplo, o servidor está rodando em uma plataforma Windows e permite apenas conexões de memória compartilhada.

Um servidor MySQL se torna um servidor de migração se for invocado em um modo operacional especial que suporte a migração de chaves. Um servidor de migração não aceita conexões de clientes. Em vez disso, ele funciona apenas por tempo suficiente para migrar as chaves e, em seguida, encerra. Um servidor de migração relata erros para a console (a saída padrão de erro).

Um servidor de migração suporta esses tipos de migração:

* Migração de um plugin de keyring para outro.
* Migração de um plugin de keyring para um componente de keyring.
* Migração de um componente de keyring para um plugin de keyring.

Um servidor de migração não suporta a migração de um componente de chave para outro. Para esse tipo de migração, consulte a Migração de Chaves Usando o Ferramenta mysql_migrate_keyring.

Para realizar uma operação de migração de chave usando um servidor de migração, determine as opções de migração de chave necessárias para especificar quais plugins ou componentes de chave estão envolvidos e se a migração é offline ou online:

* Para indicar o plugin de chave de origem e o plugin ou componente de chave de destino, especifique essas opções:

  + `--keyring-migration-source`: O componente ou plugin de chave de origem que gerencia as chaves a serem migradas.

  + `--keyring-migration-destination`: O plugin ou componente de chave de destino para o qual as chaves migradas devem ser copiadas.

  + `--keyring-migration-to-component`: Esta opção é necessária se o destino for um componente de chave.

  + `--keyring-migration-from-component`: Esta opção é necessária se a fonte for um componente de chave.

As opções `--keyring-migration-source` e `--keyring-migration-destination` indicam ao servidor que ele deve executar no modo de migração de chave. Para operações de migração de chave, ambas as opções são obrigatórias. Cada plugin ou componente é especificado usando o nome do arquivo de biblioteca, incluindo qualquer extensão específica da plataforma, como `.so` ou `.dll`. A fonte e o destino devem ser diferentes, e o servidor de migração deve suportá-los.

* Para uma migração offline, não são necessárias opções adicionais de migração de chave.

* Para uma migração online, alguns servidores em execução estão atualmente usando o keystore de origem ou destino. Para invocar o servidor de migração, especifique opções adicionais de migração de chaves que indiquem como se conectar ao servidor em execução. Isso é necessário para que o servidor de migração possa se conectar ao servidor em execução e pedir que ele pause o uso do keyring durante a operação de migração.

O uso de qualquer uma das seguintes opções indica uma migração online:

+ `--keyring-migration-host`: O host onde o servidor em execução está localizado. Isso é sempre o host local porque o servidor de migração pode migrar chaves apenas entre keystores gerenciados por plugins e componentes locais.

+ `--keyring-migration-user`, `--keyring-migration-password`: As credenciais de conta a serem usadas para se conectar ao servidor em execução.

+ `--keyring-migration-port`: Para conexões TCP/IP, o número de porta para se conectar no servidor em execução.

+ `--keyring-migration-socket`: Para conexões de arquivo de socket Unix ou tubos nomeados do Windows, o arquivo de socket ou tubo nomeado para se conectar no servidor em execução.

Para obter detalhes adicionais sobre as opções de migração de chaves, consulte a Seção 8.4.5.18, “Opções de comando do keyring”.

Inicie o servidor de migração com opções de migração de chaves que indiquem os keystores de origem e destino e se a migração é offline ou online, possivelmente com outras opções. Mantenha as seguintes considerações em mente:

* Pode ser necessário outras opções de servidor; outras opções não relacionadas ao keyring também podem ser necessárias. Uma maneira de especificar essas opções é usando `--defaults-file` para nomear um arquivo de opção que contenha as opções necessárias.

+ O servidor de migração não deve ser iniciado com seu próprio conjunto de chaves. Isso significa que o `--defaults-file` não deve apontar para o mesmo arquivo de opções que é usado para iniciar o servidor em execução, se ele contiver uma linha como `early-plugin-load=keyring_file.so`. Em vez disso, ele deve apontar para um arquivo separado que contenha apenas as opções relevantes para a migração.

  + Se estiver migrando de um plugin para um componente, o arquivo de manifesto do componente (`mysqld.my`) não deve estar presente no diretório `bin`. Embora a configuração do componente (por exemplo, `component_keyring_file.cnf` no diretório do plugin) deve estar presente no diretório `bin`, para que o novo conjunto de chaves possa ser preenchido. Após a migração estar concluída, adicione o arquivo de manifesto ao diretório e reinicie o servidor MySQL, para que o servidor comece a usar o novo conjunto de chaves.

* O servidor de migração espera que os valores das opções de nome de caminho sejam caminhos completos. Nomes de caminho relativos podem não ser resolvidos conforme esperado.

* O usuário que invoca um servidor no modo de migração de chaves não deve ser o usuário do sistema operacional `root`, a menos que a opção `--user` seja especificada com um nome de usuário que não seja `root` para executar o servidor como esse usuário.

* O usuário no qual um servidor em modo de migração de chaves é executado deve ter permissão para ler e escrever quaisquer arquivos de conjunto de chaves locais, como o arquivo de dados para um plugin baseado em arquivos.

Se você invocar o servidor de migração a partir de uma conta de sistema diferente da normalmente usada para executar o MySQL, ele pode criar diretórios ou arquivos de chaveiros inacessíveis ao servidor durante o funcionamento normal. Suponha que o **mysqld** normalmente execute como o usuário do sistema `mysql`, mas você invocar o servidor de migração enquanto estiver logado como `isabel`. Quaisquer novos diretórios ou arquivos criados pelo servidor de migração são de propriedade de `isabel`. O início subsequente falha quando um servidor executado como o usuário do sistema `mysql` tenta acessar objetos do sistema de arquivos de propriedade de `isabel`.

Para evitar esse problema, inicie o servidor de migração como o usuário do sistema `root` e forneça uma opção `--user=user_name`, onde *`user_name`* é a conta de sistema normalmente usada para executar o MySQL. Alternativamente, após a migração, examine os objetos do sistema de arquivos relacionados ao chaveiro e mude sua propriedade e permissões, se necessário, usando **chown**, **chmod** ou comandos semelhantes, para que os objetos sejam acessíveis ao servidor em execução.

Exemplo de linha de comando para migração offline entre dois plugins de chaveiro (insira o comando em uma única linha):

```
mysqld --defaults-file=/usr/local/mysql/etc/my.cnf
  --keyring-migration-source=keyring_okv.so
  --keyring-migration-destination=keyring_aws.so
```

Exemplo de linha de comando para migração online entre dois plugins de chaveiro:

```
mysqld --defaults-file=/usr/local/mysql/etc/my.cnf
  --keyring-migration-source=keyring_okv.so
  --keyring-migration-destination=keyring_aws.so
  --keyring-migration-host=127.0.0.1
  --keyring-migration-user=root
  --keyring-migration-password=root_password
```

Para realizar uma migração quando o destino é um componente de chaveiro em vez de um plugin de chaveiro, especifique a opção `--keyring-migration-to-component` e nomeie o componente como o valor da opção `--keyring-migration-destination`.

Exemplo de linha de comando para migração offline de um plugin de chaveiro para um componente de chaveiro:

```
mysqld --defaults-file=/usr/local/mysql/etc/my.cnf
  --keyring-migration-to-component
  --keyring-migration-source=keyring_okv.so
  --keyring-migration-destination=component_keyring_encrypted_file.so
```

Observe que, neste caso, nenhum valor `keyring_encrypted_file_password` é especificado. A senha do arquivo de dados do componente está listada no arquivo de configuração do componente.

Exemplo de linha de comando para migração online de um plugin de chaveiro para um componente de chaveiro:

```
mysqld --defaults-file=/usr/local/mysql/etc/my.cnf
  --keyring-migration-to-component
  --keyring-migration-source=keyring_okv.so
  --keyring-migration-destination=component_keyring_encrypted_file.so
  --keyring-migration-host=127.0.0.1
  --keyring-migration-user=root
  --keyring-migration-password=root_password
```

Para realizar uma migração quando a fonte for um componente de chaveiro e não um plugin de chaveiro, especifique a opção `--keyring-migration-from-component` e nomeie o componente como o valor da opção `--keyring-migration-source`.

Exemplo de linha de comando para migração offline de um componente de chaveiro para um plugin de chaveiro:

```
mysqld --defaults-file=/usr/local/mysql/etc/my.cnf
  --keyring-migration-from-component
  --keyring-migration-source=component_keyring_file.so
  --keyring-migration-destination=keyring_okv.so
  --keyring-okv-conf-dir=/usr/local/mysql/mysql-keyring-okv
```

Exemplo de linha de comando para migração online de um componente de chaveiro para um plugin de chaveiro:

```
mysqld --defaults-file=/usr/local/mysql/etc/my.cnf
  --keyring-migration-from-component
  --keyring-migration-source=component_keyring_file.so
  --keyring-migration-destination=keyring_okv.so
  --keyring-okv-conf-dir=/usr/local/mysql/mysql-keyring-okv
  --keyring-migration-host=127.0.0.1
  --keyring-migration-user=root
  --keyring-migration-password=root_password
```

O servidor de migração de chaves realiza uma operação de migração da seguinte forma:

1. (Migração online apenas) Conecte-se ao servidor em execução usando as opções de conexão.

2. (Migração online apenas) Desabilite `keyring_operations` no servidor em execução.

3. Carregue as bibliotecas de plugins ou componentes de chaveiro para os keystores de origem e destino.

4. Copie as chaves do keystore de origem para o destino.

5. Descarregue as bibliotecas de plugins ou componentes de chaveiro para os keystores de origem e destino.

6. (Migração online apenas) Habilite `keyring_operations` no servidor em execução.

7. (Migração online apenas) Desconecte-se do servidor em execução.

Se ocorrer um erro durante a migração de chaves, o keystore de destino é restaurado ao seu estado pré-migração.

Após uma operação de migração de chaves online bem-sucedida, o servidor em execução pode precisar ser reiniciado:

* Se o servidor em execução estava usando o keystore de origem antes da migração e deve continuar a usá-lo após a migração, ele não precisa ser reiniciado após a migração.

* Se o servidor em execução estava usando o keystore de destino antes da migração e deve continuar a usá-lo após a migração, ele deve ser reiniciado após a migração para carregar todas as chaves migradas para o keystore de destino.

* Se o servidor em execução estava usando o keystore de origem antes da migração, mas deve usar o keystore de destino após a migração, ele deve ser reconfigurado para usar o keystore de destino e reiniciado. Nesse caso, esteja ciente de que, embora o servidor em execução esteja pausado para modificar o keystore de origem durante a migração em si, ele não está pausado durante o intervalo entre a migração e o reinício subsequente. Deve-se ter cuidado para que o servidor não modifique o keystore de origem durante esse intervalo, pois quaisquer alterações não serão refletidas no keystore de destino.

##### Migração de Chaves Usando o Ferramenta mysql_migrate_keyring

A ferramenta **mysql_migrate_keyring** migra chaves de um componente de keyring para outro. Ela não suporta migrações que envolvam plugins de keyring. Para esse tipo de migração, use um servidor MySQL operando no modo de migração de chave; veja Migração de Chaves Usando um Servidor de Migração.

Para realizar uma operação de migração de chave usando **mysql_migrate_keyring**, determine as opções de migração de chave necessárias para especificar quais componentes de keyring estão envolvidos e se a migração é offline ou online:

* Para indicar os componentes de keyring de origem e destino e sua localização, especifique essas opções:

  + `--source-keyring`: O componente de keyring de origem que gerencia as chaves a serem migradas.

  + `--destination-keyring`: O componente de keyring de destino para o qual as chaves migradas devem ser copiadas.

  + `--component-dir`: O diretório contendo arquivos de biblioteca de componentes de keyring. Esse é tipicamente o valor da variável de sistema `plugin_dir` do servidor MySQL local.

Todas as três opções são obrigatórias. Cada nome de componente do chaveiro é o nome de um arquivo de biblioteca de componentes especificado sem qualquer extensão específica da plataforma, como `.so` ou `.dll`. Por exemplo, para usar o componente para o qual o arquivo de biblioteca é `component_keyring_file.so`, especifique a opção como `--source-keyring=component_keyring_file`. A fonte e o destino devem ser diferentes, e **mysql_migrate_keyring** deve suportar ambos.

* Para uma migração offline, não são necessárias opções adicionais.

* Para uma migração online, alguns servidores em execução estão atualmente usando o keystore de origem ou destino. Neste caso, especifique a opção `--online-migration` para indicar uma migração online. Além disso, especifique opções de conexão indicando como se conectar ao servidor em execução, para que **mysql_migrate_keyring** possa se conectar a ele e dizer-lhe para pausar o uso do chaveiro durante a operação de migração.

A opção `--online-migration` é comumente usada em conjunto com opções de conexão como estas:

+ `--host`: O host onde o servidor em execução está localizado. Este é sempre o host local porque **mysql_migrate_keyring** pode migrar chaves apenas entre keystores gerenciados por componentes locais.

+ `--user`, `--password`: As credenciais de conta a serem usadas para se conectar ao servidor em execução.

+ `--port`: Para conexões TCP/IP, o número de porta para se conectar no servidor em execução.

+ `--socket`: Para conexões de arquivo de socket Unix ou tubos nomeados do Windows, o arquivo de socket ou tubo nomeado para se conectar no servidor em execução.

Para descrições de todas as opções disponíveis, consulte a Seção 6.6.8, “mysql_migrate_keyring — Ferramenta de Migração de Chaves do Chaveiro”.

Inicie o **mysql_migrate_keyring** com opções que indiquem os keystores de origem e destino e se a migração é offline ou online, possivelmente com outras opções. Tenha em mente as seguintes considerações:

* O usuário que invoca **mysql_migrate_keyring** não deve ser o usuário do sistema `root`.

* O usuário que invoca **mysql_migrate_keyring** deve ter permissão para ler e escrever quaisquer arquivos de keystore local, como o arquivo de dados de um plugin baseado em arquivos.

Se você invocar **mysql_migrate_keyring** a partir de uma conta de sistema diferente da normalmente usada para executar o MySQL, isso pode criar diretórios ou arquivos de keystore inacessíveis ao servidor durante o funcionamento normal. Suponha que **mysqld** normalmente execute como o usuário do sistema `mysql`, mas você invoque **mysql_migrate_keyring** enquanto estiver logado como `isabel`. Quaisquer novos diretórios ou arquivos criados por **mysql_migrate_keyring** são de propriedade de `isabel`. O início subsequente falha quando um servidor executado como o usuário do sistema `mysql` tenta acessar objetos do sistema de arquivos de propriedade de `isabel`.

Para evitar esse problema, invocar **mysql_migrate_keyring** como o usuário do sistema `mysql`. Alternativamente, após a migração, examine os objetos do sistema de arquivos relacionados ao keystore e mude sua propriedade e permissões, se necessário, usando **chown**, **chmod** ou comandos semelhantes, para que os objetos sejam acessíveis ao servidor em execução.

Suponha que você queira migrar chaves de `component_keyring_file` para `component_keyring_encrypted_file`, e que o servidor local armazene seus arquivos de biblioteca de componentes de keystore em `/usr/local/mysql/lib/plugin`.

Se nenhum servidor em execução estiver usando o keystore, uma migração offline é permitida. Inicie **mysql_migrate_keyring** da seguinte forma (entre com o comando em uma única linha):

```
mysql_migrate_keyring
  --component-dir=/usr/local/mysql/lib/plugin
  --source-keyring=component_keyring_file
  --destination-keyring=component_keyring_encrypted_file
```

Se um servidor em execução estiver usando o chaveiro, você deve realizar uma migração online. Nesse caso, a opção `--online-migration` deve ser fornecida, juntamente com quaisquer opções de conexão necessárias para especificar qual servidor conectar e a conta MySQL a ser usada.

O comando a seguir realiza uma migração online. Ele se conecta ao servidor local usando uma conexão TCP/IP e a conta `admin`. O comando solicita uma senha, que você deve inserir quando solicitado:

```
mysql_migrate_keyring
  --component-dir=/usr/local/mysql/lib/plugin
  --source-keyring=component_keyring_file
  --destination-keyring=component_keyring_encrypted_file
  --online-migration --host=127.0.0.1 --user=admin --password
```

**mysql_migrate_keyring** realiza uma operação de migração da seguinte forma:

1. (Migração online apenas) Conecte-se ao servidor em execução usando as opções de conexão.

2. (Migração online apenas) Desabilite `keyring_operations` no servidor em execução.

3. Carregue as bibliotecas de componentes do chaveiro para os keystores de origem e destino.

4. Copie as chaves do keystore de origem para o destino.

5. Descarregue as bibliotecas de componentes do chaveiro para os keystores de origem e destino.

6. (Migração online apenas) Habilite `keyring_operations` no servidor em execução.

7. (Migração online apenas) Desconecte-se do servidor em execução.

Se ocorrer um erro durante a migração de chaves, o keystore de destino será restaurado ao seu estado pré-migração.

Após uma operação de migração de chaves online bem-sucedida, o servidor em execução pode precisar ser reiniciado:

* Se o servidor em execução estava usando o keystore de origem antes da migração e deve continuar a usá-lo após a migração, ele não precisa ser reiniciado após a migração.

* Se o servidor em execução estava usando o keystore de destino antes da migração e deve continuar a usá-lo após a migração, ele deve ser reiniciado após a migração para carregar todas as chaves migradas para o keystore de destino.

* Se o servidor em execução estava usando o keystore de origem antes da migração, mas deve usar o keystore de destino após a migração, ele deve ser reconfigurado para usar o keystore de destino e reiniciado. Nesse caso, esteja ciente de que, embora o servidor em execução esteja em pausa para modificar o keystore de origem durante a migração em si, ele não estará em pausa durante o intervalo entre a migração e o reinício subsequente. Deve-se ter cuidado para que o servidor não modifique o keystore de origem durante esse intervalo, pois quaisquer alterações não serão refletidas no keystore de destino.

##### Migração de Chaves que Envolve Vários Servidores em Execução

A migração online de chaves permite a pausa das operações do keyring em um único servidor em execução. Para realizar uma migração se vários servidores em execução estiverem usando os keystores envolvidos, use este procedimento:

1. Conecte-se a cada servidor em execução manualmente e defina `keyring_operations=OFF`. Isso garante que nenhum servidor em execução esteja usando o keystore de origem ou de destino e atende à condição necessária para a migração offline.

2. Use um servidor de migração ou **mysql_migrate_keyring** para realizar uma migração de chave offline para cada servidor parado.

3. Conecte-se a cada servidor em execução manualmente e defina `keyring_operations=ON`.

Todos os servidores em execução devem suportar a variável de sistema `keyring_operations`. Qualquer servidor que não o faça deve ser parado antes da migração e reiniciado depois.