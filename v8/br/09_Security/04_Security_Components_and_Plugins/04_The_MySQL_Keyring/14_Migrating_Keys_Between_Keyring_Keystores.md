#### 8.4.4.14 Migração de Chaves entre Keystores do Keyring

Uma migração de chaveiros copia as chaves de um keystore para outro, permitindo que um DBA mude uma instalação do MySQL para um keystore diferente. Uma operação de migração bem-sucedida tem este resultado:

- O keystore de destino contém as chaves que ele tinha antes da migração, além das chaves do keystore de origem.

- A chave de origem do cofre de segurança permanece a mesma antes e depois da migração (porque as chaves são copiadas, não movidas).

Se uma chave a ser copiada já existir no keystore de destino, ocorrerá um erro e o keystore de destino será restaurado ao seu estado anterior à migração.

O chaveiro gerencia os keystores usando componentes de chaveiro e plugins de chaveiro. Isso se refere à estratégia de migração, pois a maneira como os keystores de origem e destino são gerenciados determina se um determinado tipo de migração de chave é possível e o procedimento para executá-lo:

- Migração de um plug-in de chave de acesso para outro: O servidor MySQL possui um modo operacional que oferece essa capacidade.

- Migração de um plugin de chave de segurança para um componente de chave de segurança: O servidor MySQL tem um modo operacional que oferece essa capacidade a partir do MySQL 8.0.24.

- Migração de um componente de chave de segurança para outro: A ferramenta **mysql\_migrate\_keyring** oferece essa capacidade. **mysql\_migrate\_keyring** está disponível a partir do MySQL 8.0.24.

- Migração de um componente de chave de segurança para um plugin de chave de segurança: Não há previsão para essa funcionalidade.

As seções a seguir discutem as características das migrações offline e online e descrevem como realizar as migrações.

- Migração de chaves offline e online
- Migração chave Usando um servidor de migração
- Migração chave Usando a Ferramenta mysql\_migrate\_keyring
- Migração chave envolvendo múltiplos servidores em execução

##### Migração de chaves offline e online

Uma migração chave está offline ou online:

- Migração offline: Para uso quando você tem certeza de que nenhum servidor em execução no host local está usando o keystore de origem ou destino. Nesse caso, a operação de migração pode copiar as chaves do keystore de origem para o destino sem a possibilidade de um servidor em execução modificar o conteúdo do keystore durante a operação.

- Migração online: Para uso quando um servidor em execução no host local está usando o keystore de origem. Nesse caso, é necessário tomar cuidado para evitar que o servidor atualize os keystores durante a migração. Isso envolve conectar-se ao servidor em execução e instruí-lo a pausar as operações do keyring para que as chaves possam ser copiadas com segurança do keystore de origem para o destino. Quando a cópia de chaves estiver concluída, o servidor em execução é autorizado a retomar as operações do keyring.

Ao planejar uma migração chave, use esses pontos para decidir se ela deve ser offline ou online:

- Não realize migração offline envolvendo um keystore que esteja sendo usado por um servidor em execução.

- A interrupção das operações do chaveiro durante uma migração online é realizada conectando-se ao servidor em execução e definindo sua variável de sistema global `keyring_operations` para `OFF` antes da cópia da chave e `ON` após a cópia da chave. Isso tem várias implicações:

  - `keyring_operations` foi introduzido no MySQL 5.7.21, portanto, a migração online só é possível se o servidor em execução for do MySQL 5.7.21 ou superior. Se o servidor em execução for mais antigo, você deve interromper, realizar uma migração offline e reiniciá-lo. Todas as instruções de migração em outros lugares que se referem a `keyring_operations` estão sujeitas a essa condição.

  - A conta usada para se conectar ao servidor em execução deve ter os privilégios necessários para modificar `keyring_operations`. Esses privilégios são `ENCRYPTION_KEY_ADMIN`, além de `SYSTEM_VARIABLES_ADMIN` ou o privilégio desatualizado `SUPER`.

  - Se uma operação de migração online sair anormalmente (por exemplo, se for encerrada forçadamente), é possível que o `keyring_operations` permaneça desativado no servidor em execução, impedindo que ele realize operações de chave de segurança. Nesse caso, pode ser necessário se conectar ao servidor em execução e ativar manualmente o `keyring_operations` usando a seguinte instrução:

    ```
    SET GLOBAL keyring_operations = ON;
    ```

- A migração de chaves online permite pausar as operações do conjunto de chaves em um único servidor em execução. Para realizar uma migração se vários servidores em execução estiverem usando os estojos de chaves envolvidos, use o procedimento descrito em Migração de Chaves que Envolve Vários Servidores em Execução.

##### Migração chave Usando um servidor de migração

Nota

A migração de chaves online usando um servidor de migração só é suportada se o servidor em execução permitir conexões de soquete ou conexões TCP/IP usando TLS; não é suportada quando, por exemplo, o servidor está rodando em uma plataforma Windows e permite apenas conexões de memória compartilhada.

Um servidor MySQL se torna um servidor de migração quando invocado em um modo operacional especial que suporta a migração de chaves. Um servidor de migração não aceita conexões de clientes. Em vez disso, ele funciona apenas por tempo suficiente para migrar as chaves e, em seguida, sai. Um servidor de migração relata erros para o console (a saída padrão de erro).

Um servidor de migração suporta esses tipos de migração:

- Migração de um plugin de chave de acesso para outro.
- Migração de um plugin de chave de segurança para um componente de chave de segurança. Essa funcionalidade está disponível a partir do MySQL 8.0.24. Servidores mais antigos só suportam a migração de um plugin de chave de segurança para outro, caso em que as partes dessas instruções que se referem a componentes de chave de segurança não se aplicam.

Um servidor de migração não suporta a migração de um componente de chave para outro. Para esse tipo de migração, consulte Migração de Chaves Usando o Ferramenta mysql\_migrate\_keyring.

Para realizar uma operação de migração de chave usando um servidor de migração, determine as opções de migração de chave necessárias para especificar quais plugins ou componentes do conjunto de chaves estão envolvidos e se a migração é offline ou online:

- Para indicar o plugin de chave de registro de origem e o plugin ou componente de chave de registro de destino, especifique essas opções:

  - `--keyring-migration-source`: O plugin de chave de origem que gerencia as chaves a serem migradas.

  - `--keyring-migration-destination`: O plugin ou componente de chave de destino para o qual as chaves migradas devem ser copiadas.

  - `--keyring-migration-to-component`: Esta opção é necessária se o destino for um componente de chave de segurança em vez de um plugin de chave de segurança.

  As opções `--keyring-migration-source` e `--keyring-migration-destination` indicam ao servidor que ele deve executar no modo de migração de chaves. Para operações de migração de chaves, ambas as opções são obrigatórias. Cada plugin ou componente é especificado usando o nome do arquivo da biblioteca, incluindo qualquer extensão específica da plataforma, como `.so` ou `.dll`. A fonte e o destino devem ser diferentes, e o servidor de migração deve suportá-los.

- Para uma migração offline, não são necessárias opções adicionais de migração de chaves.

- Para uma migração online, alguns servidores em execução estão atualmente usando o keystore de origem ou destino. Para invocar o servidor de migração, especifique opções adicionais de migração de chaves que indiquem como se conectar ao servidor em execução. Isso é necessário para que o servidor de migração possa se conectar ao servidor em execução e pedir que ele pause o uso do keyring durante a operação de migração.

  O uso de qualquer uma das seguintes opções indica uma migração online:

  - `--keyring-migration-host`: O host onde o servidor em execução está localizado. Este é sempre o host local, pois o servidor de migração pode migrar chaves apenas entre os estoques de chaves gerenciados por plugins e componentes locais.

  - `--keyring-migration-user`, `--keyring-migration-password`: As credenciais da conta a serem usadas para se conectar ao servidor em execução.

  - `--keyring-migration-port`: Para conexões TCP/IP, o número da porta para se conectar ao servidor em execução.

  - `--keyring-migration-socket`: Para conexões de arquivo de socket Unix ou de tubo nomeado do Windows, o arquivo de socket ou o tubo nomeado para se conectar ao servidor em execução.

Para obter informações adicionais sobre as principais opções de migração, consulte a Seção 8.4.4.18, “Opções de comando do Keychain”.

Inicie o servidor de migração com as opções de migração chave, indicando os keystores de origem e destino e se a migração é offline ou online, possivelmente com outras opções. Mantenha as seguintes considerações em mente:

- Podem ser necessárias outras opções de servidor, como parâmetros de configuração para os dois plugins de chaveiros. Por exemplo, se `keyring_file` é a origem ou destino, você deve definir a variável de sistema `keyring_file_data` se o local do arquivo de dados do chaveiro não for o local padrão. Podem ser necessárias outras opções que não sejam de chaveiro também. Uma maneira de especificar essas opções é usando `--defaults-file` para nomear um arquivo de opção que contém as opções necessárias.

  - O servidor de migração não deve ser iniciado com seu próprio chaveiro. Isso significa que `--defaults-file` não deve apontar para o mesmo arquivo de opções que é usado para iniciar o servidor em execução, se ele contiver uma linha como `early-plugin-load=keyring_file.so`. Em vez disso, ele deve apontar para um arquivo separado que contenha apenas as opções relevantes para a migração.

  - Se você estiver migrando de um plugin para um componente, o arquivo de manifesto do componente (`mysqld.my`) não deve estar presente no diretório `bin`. No entanto, a configuração do componente (por exemplo, `component_keyring_file.cnf` no diretório do plugin) deve estar presente no diretório `bin`, para que o novo conjunto de chaves possa ser preenchido. Após a migração estar concluída, adicione o arquivo de manifesto ao diretório e reinicie o servidor MySQL, para que o servidor comece a usar o novo conjunto de chaves.

- O servidor de migração espera que os valores das opções de nome de caminho sejam caminhos completos. Os nomes de caminho relativos podem não ser resolvidos conforme o esperado.

- O usuário que invoca um servidor no modo de migração de chaves não deve ser o usuário do sistema operacional `root`, a menos que a opção `--user` seja especificada com um nome de usuário que não seja `root`, para executar o servidor como esse usuário.

- O usuário que executa um servidor no modo de migração de chaves deve ter permissão para ler e escrever qualquer arquivo de chave local, como o arquivo de dados de um plugin baseado em arquivos.

  Se você invocar o servidor de migração a partir de uma conta de sistema diferente daquela normalmente usada para executar o MySQL, ele pode criar diretórios ou arquivos de chaveiros inacessíveis ao servidor durante o funcionamento normal. Suponha que o **mysqld** normalmente execute como o usuário do sistema operacional `mysql`, mas você invocar o servidor de migração enquanto estiver logado como `isabel`. Quaisquer novos diretórios ou arquivos criados pelo servidor de migração são de propriedade de `isabel`. O início subsequente falha quando um servidor executado como o usuário do sistema operacional `mysql` tenta acessar objetos do sistema de arquivos de propriedade de `isabel`.

  Para evitar esse problema, inicie o servidor de migração como usuário do sistema operacional `root` e forneça uma opção `--user=user_name`, onde `user_name` é a conta do sistema normalmente usada para executar o MySQL. Alternativamente, após a migração, examine os objetos do sistema de arquivos relacionados ao keyring e mude sua propriedade e permissões, se necessário, usando **chown**, **chmod** ou comandos semelhantes, para que os objetos sejam acessíveis ao servidor em execução.

Exemplo de linha de comando para migração offline entre dois plugins de chave privada (insira o comando em uma única linha):

```
mysqld --defaults-file=/usr/local/mysql/etc/my.cnf
  --keyring-migration-source=keyring_file.so
  --keyring-migration-destination=keyring_encrypted_file.so
  --keyring_encrypted_file_password=password
```

Exemplo de linha de comando para migração online entre dois plugins de chave:

```
mysqld --defaults-file=/usr/local/mysql/etc/my.cnf
  --keyring-migration-source=keyring_file.so
  --keyring-migration-destination=keyring_encrypted_file.so
  --keyring_encrypted_file_password=password
  --keyring-migration-host=127.0.0.1
  --keyring-migration-user=root
  --keyring-migration-password=root_password
```

Para realizar uma migração quando o destino for um componente de chave de segurança em vez de um plugin de chave de segurança, especifique a opção `--keyring-migration-to-component` e nomeie o componente como o valor da opção `--keyring-migration-destination`.

Exemplo de linha de comando para migração offline de um plugin de chave de registro para um componente de chave de registro:

```
mysqld --defaults-file=/usr/local/mysql/etc/my.cnf
  --keyring-migration-to-component
  --keyring-migration-source=keyring_file.so
  --keyring-migration-destination=component_keyring_encrypted_file.so
```

Observe que, neste caso, nenhum valor `keyring_encrypted_file_password` foi especificado. A senha para o arquivo de dados do componente está listada no arquivo de configuração do componente.

Exemplo de linha de comando para migração online de um plugin de chave de segurança para um componente de chave de segurança:

```
mysqld --defaults-file=/usr/local/mysql/etc/my.cnf
  --keyring-migration-to-component
  --keyring-migration-source=keyring_file.so
  --keyring-migration-destination=component_keyring_encrypted_file.so
  --keyring-migration-host=127.0.0.1
  --keyring-migration-user=root
  --keyring-migration-password=root_password
```

O servidor de migração principal realiza uma operação de migração da seguinte forma:

1. (Apenas migração online) Conecte-se ao servidor em execução usando as opções de conexão.

2. (Apenas migração online) Desative `keyring_operations` no servidor em execução.

3. Carregue as bibliotecas de plugins/componentes de chaveiros de origem e destino.

4. Copie as chaves do keystore de origem para o destino.

5. Descarregue as bibliotecas de plugins/componentes de chaveiros de origem e destino.

6. (Apenas migração online) Habilitar `keyring_operations` no servidor em execução.

7. (Apenas migração online) Desconecte-se do servidor em execução.

Se ocorrer um erro durante a migração de chaves, o keystore de destino é restaurado ao seu estado anterior à migração.

Após a operação bem-sucedida de migração de chave online, o servidor em execução pode precisar ser reiniciado:

- Se o servidor em execução estava usando o keystore de origem antes da migração e deve continuar a usá-lo após a migração, ele não precisa ser reiniciado após a migração.

- Se o servidor em execução estava usando o keystore de destino antes da migração e deve continuar a usá-lo após a migração, ele deve ser reiniciado após a migração para carregar todas as chaves migradas para o keystore de destino.

- Se o servidor em execução estava usando o keystore de origem antes da migração, mas deve usar o keystore de destino após a migração, ele deve ser reconfigurado para usar o keystore de destino e reiniciado. Nesse caso, esteja ciente de que, embora o servidor em execução esteja parado de modificar o keystore de origem durante a migração em si, ele não estará parado durante o intervalo entre a migração e o reinício subsequente. Deve-se ter cuidado para que o servidor não modifique o keystore de origem durante esse intervalo, pois quaisquer alterações não serão refletidas no keystore de destino.

##### Migração chave Usando a Ferramenta mysql\_migrate\_keyring

O utilitário **mysql\_migrate\_keyring** migra chaves de um componente de chaveiro para outro. Ele não suporta migrações que envolvam plugins de chaveiro. Para esse tipo de migração, use um servidor MySQL em modo de migração de chave; veja Migração de Chave Usando um Servidor de Migração.

Para realizar uma operação de migração de chave usando **mysql\_migrate\_keyring**, determine as opções de migração de chave necessárias para especificar quais componentes do gerenciador de chaves estão envolvidos e se a migração é offline ou online:

- Para indicar os componentes do chaveiro de origem e destino e sua localização, especifique essas opções:

  - `--source-keyring`: O componente de chave de origem que gerencia as chaves a serem migradas.

  - `--destination-keyring`: O componente de chave de destino para o qual as chaves migradas devem ser copiadas.

  - `--component-dir`: O diretório que contém os arquivos da biblioteca do componente de chave de segurança. Geralmente, esse é o valor da variável de sistema `plugin_dir` do servidor MySQL local.

  Todas as três opções são obrigatórias. Cada nome de componente do chaveiro é o nome de um arquivo de biblioteca de componentes especificado sem qualquer extensão específica da plataforma, como `.so` ou `.dll`. Por exemplo, para usar o componente para o qual o arquivo da biblioteca é `component_keyring_file.so`, especifique a opção como `--source-keyring=component_keyring_file`. A fonte e o destino devem ser diferentes, e o **mysql\_migrate\_keyring** deve suportar ambos.

- Para uma migração offline, não são necessárias opções adicionais.

- Para uma migração online, alguns servidores em execução estão atualmente usando o keystore de origem ou destino. Nesse caso, especifique a opção `--online-migration` para indicar uma migração online. Além disso, especifique as opções de conexão indicando como se conectar ao servidor em execução, para que o **mysql\_migrate\_keyring** possa se conectar a ele e dizer que deve pausar o uso do keyring durante a operação de migração.

  A opção `--online-migration` é comumente usada em conjunto com opções de conexão, como estas:

  - `--host`: O host onde o servidor em execução está localizado. Este é sempre o host local, pois o **mysql\_migrate\_keyring** pode migrar chaves apenas entre keystores gerenciados por componentes locais.

  - `--user`, `--password`: As credenciais da conta a serem usadas para se conectar ao servidor em execução.

  - `--port`: Para conexões TCP/IP, o número da porta para se conectar ao servidor em execução.

  - `--socket`: Para conexões de arquivo de socket Unix ou de tubo nomeado do Windows, o arquivo de socket ou o tubo nomeado para se conectar ao servidor em execução.

Para descrições de todas as opções disponíveis, consulte a Seção 6.6.8, “mysql\_migrate\_keyring — Ferramenta de migração de chaves do Keyring”.

Inicie o **mysql\_migrate\_keyring** com opções que indiquem os keystores de origem e destino e se a migração é offline ou online, possivelmente com outras opções. Mantenha as seguintes considerações em mente:

- O usuário que invoca **mysql\_migrate\_keyring** não deve ser o usuário do sistema operacional `root`.

- O usuário que invoca **mysql\_migrate\_keyring** deve ter permissão para ler e escrever qualquer arquivo de chaveiro local, como o arquivo de dados de um plugin baseado em arquivos.

  Se você invocar **mysql\_migrate\_keyring** a partir de uma conta de sistema diferente daquela normalmente usada para executar o MySQL, isso pode criar diretórios ou arquivos de chaveiro inacessíveis ao servidor durante o funcionamento normal. Suponha que o **mysqld** normalmente execute como o usuário do sistema operacional `mysql`, mas você invocar **mysql\_migrate\_keyring** enquanto estiver logado como `isabel`. Quaisquer novos diretórios ou arquivos criados pelo **mysql\_migrate\_keyring** são de propriedade de `isabel`. O início subsequente falha quando um servidor executado como o usuário do sistema operacional `mysql` tenta acessar objetos do sistema de arquivos de propriedade de `isabel`.

  Para evitar esse problema, invoque o **mysql\_migrate\_keyring** como o usuário do sistema operacional `mysql`. Alternativamente, após a migração, examine os objetos do sistema de arquivos relacionados ao keychain e mude sua propriedade e permissões, se necessário, usando **chown**, **chmod** ou comandos semelhantes, para que os objetos sejam acessíveis ao servidor em execução.

Suponha que você queira migrar as chaves de `component_keyring_file` para `component_keyring_encrypted_file`, e que o servidor local armazene seus arquivos de biblioteca de componentes de chave pública em `/usr/local/mysql/lib/plugin`.

Se nenhum servidor em execução estiver usando o chaveiro, uma migração offline é permitida. Inicie o **mysql\_migrate\_keyring** da seguinte forma (insira o comando em uma única linha):

```
mysql_migrate_keyring
  --component-dir=/usr/local/mysql/lib/plugin
  --source-keyring=component_keyring_file
  --destination-keyring=component_keyring_encrypted_file
```

Se um servidor em execução estiver usando o chaveiro, você deve realizar uma migração online. Nesse caso, a opção `--online-migration` deve ser fornecida, juntamente com quaisquer opções de conexão necessárias para especificar qual servidor conectar e qual conta do MySQL usar.

O comando a seguir realiza uma migração online. Ele se conecta ao servidor local usando uma conexão TCP/IP e a conta `admin`. O comando solicita uma senha, que você deve inserir quando solicitado:

```
mysql_migrate_keyring
  --component-dir=/usr/local/mysql/lib/plugin
  --source-keyring=component_keyring_file
  --destination-keyring=component_keyring_encrypted_file
  --online-migration --host=127.0.0.1 --user=admin --password
```

O **mysql\_migrate\_keyring** executa uma operação de migração da seguinte forma:

1. (Apenas migração online) Conecte-se ao servidor em execução usando as opções de conexão.

2. (Apenas migração online) Desative `keyring_operations` no servidor em execução.

3. Carregue as bibliotecas de componentes de chaveiros para os keystores de origem e destino.

4. Copie as chaves do keystore de origem para o destino.

5. Descarregue as bibliotecas de componentes de chaveiros para os keystores de origem e destino.

6. (Apenas migração online) Habilitar `keyring_operations` no servidor em execução.

7. (Apenas migração online) Desconecte-se do servidor em execução.

Se ocorrer um erro durante a migração de chaves, o keystore de destino é restaurado ao seu estado anterior à migração.

Após a operação bem-sucedida de migração de chave online, o servidor em execução pode precisar ser reiniciado:

- Se o servidor em execução estava usando o keystore de origem antes da migração e deve continuar a usá-lo após a migração, ele não precisa ser reiniciado após a migração.

- Se o servidor em execução estava usando o keystore de destino antes da migração e deve continuar a usá-lo após a migração, ele deve ser reiniciado após a migração para carregar todas as chaves migradas para o keystore de destino.

- Se o servidor em execução estava usando o keystore de origem antes da migração, mas deve usar o keystore de destino após a migração, ele deve ser reconfigurado para usar o keystore de destino e reiniciado. Nesse caso, esteja ciente de que, embora o servidor em execução esteja parado de modificar o keystore de origem durante a migração em si, ele não estará parado durante o intervalo entre a migração e o reinício subsequente. Deve-se ter cuidado para que o servidor não modifique o keystore de origem durante esse intervalo, pois quaisquer alterações não serão refletidas no keystore de destino.

##### Migração chave envolvendo múltiplos servidores em execução

A migração de chaves online permite pausar as operações do conjunto de chaves em um único servidor em execução. Para realizar uma migração se vários servidores em execução estiverem usando os estojos de chaves envolvidos, use o seguinte procedimento:

1. Conecte-se manualmente a cada servidor em execução e defina `keyring_operations=OFF`. Isso garante que nenhum servidor em execução esteja usando o keystore de origem ou destino e atende à condição necessária para a migração offline.

2. Use um servidor de migração ou **mysql\_migrate\_keyring** para realizar uma migração de chave offline para cada servidor parado.

3. Conecte-se manualmente a cada servidor em execução e defina `keyring_operations=ON`.

Todos os servidores em execução devem suportar a variável de sistema `keyring_operations`. Qualquer servidor que não o faça deve ser desligado antes da migração e reiniciado depois.
