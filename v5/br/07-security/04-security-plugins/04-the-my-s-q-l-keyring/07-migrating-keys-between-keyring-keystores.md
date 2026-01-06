#### 6.4.4.7 Migrar chaves entre os keystores do Keychain

Uma migração de chaveiro copia as chaves de um keystore para outro, permitindo que um DBA mude uma instalação do MySQL para um keystore diferente. Uma operação de migração bem-sucedida tem este resultado:

- O keystore de destino contém as chaves que ele tinha antes da migração, além das chaves do keystore de origem.

- A chave de origem do cofre de segurança permanece a mesma antes e depois da migração (porque as chaves são copiadas, não movidas).

Se uma chave a ser copiada já existir no keystore de destino, ocorrerá um erro e o keystore de destino será restaurado ao seu estado anterior à migração.

As seções a seguir discutem as características das migrações offline e online e descrevem como realizar as migrações.

- Migração de Chaves Offline e Online
- Migração de Chave Usando um Servidor de Migração
- Migração de Chave que Implica em Múltiplos Servidores em Execução

##### Migração de chaves offline e online

Uma migração chave está offline ou online:

- Migração offline: Para uso quando você tem certeza de que nenhum servidor em execução no host local está usando o keystore de origem ou destino. Nesse caso, a operação de migração pode copiar as chaves do keystore de origem para o destino sem a possibilidade de um servidor em execução modificar o conteúdo do keystore durante a operação.

- Migração online: Para uso quando um servidor em execução no host local está usando o keystore de origem ou destino. Nesse caso, é necessário tomar cuidado para evitar que o servidor atualize os keystores durante a migração. Isso envolve conectar-se ao servidor em execução e instruí-lo a pausar as operações do keyring para que as chaves possam ser copiadas com segurança do keystore de origem para o destino. Quando a cópia de chaves estiver concluída, o servidor em execução é autorizado a retomar as operações do keyring.

Ao planejar uma migração chave, use esses pontos para decidir se ela deve ser offline ou online:

- Não realize migração offline envolvendo um keystore que esteja sendo usado por um servidor em execução.

- Para interromper as operações do gerenciador de chaves durante uma migração online, é necessário se conectar ao servidor em execução e definir sua variável de sistema global `keyring_operations` para `OFF` antes da cópia da chave e `ON` após a cópia da chave. Isso tem várias implicações:

  - `keyring_operations` foi introduzido no MySQL 5.7.21, portanto, a migração online só é possível se o servidor em execução for do MySQL 5.7.21 ou superior. Se o servidor em execução for mais antigo, você deve interromper, realizar uma migração offline e reiniciá-lo. Todas as instruções de migração em outros lugares que se referem a `keyring_operations` estão sujeitas a essa condição.

  - A conta usada para se conectar ao servidor em execução deve ter o privilégio `SUPER` necessário para modificar `keyring_operations`.

  - Para uma migração online, a operação de migração cuida de habilitar e desabilitar `keyring_operations` no servidor em execução. Se a operação de migração sair anormalmente (por exemplo, se for encerrada forçadamente), é possível que `keyring_operations` permaneça desabilitada no servidor em execução, impedindo que ele realize operações de chaveiro. Nesse caso, pode ser necessário se conectar ao servidor em execução e habilitar manualmente `keyring_operations` usando esta declaração:

    ```sql
    SET GLOBAL keyring_operations = ON;
    ```

- A migração de chaves online permite pausar as operações do conjunto de chaves em um único servidor em execução. Para realizar uma migração se vários servidores em execução estiverem usando os estojos de chaves envolvidos, use o procedimento descrito em Migração de Chaves que Envolve Múltiplos Servidores em Execução.

##### Migração chave Usando um servidor de migração

A partir do MySQL 5.7.21, um servidor MySQL se torna um servidor de migração se for invocado em um modo operacional especial que suporta migração de chaves. Um servidor de migração não aceita conexões de clientes. Em vez disso, ele funciona apenas por tempo suficiente para migrar as chaves e, em seguida, sai. Um servidor de migração relata erros para o console (a saída padrão de erro).

Para realizar uma operação de migração de chave usando um servidor de migração, determine as opções de migração de chave necessárias para especificar quais plugins ou componentes do conjunto de chaves estão envolvidos e se a migração é offline ou online:

- Para indicar os plugins de chave de segurança de origem e destino, especifique essas opções:

  - `--keyring-migration-source`: O plugin de chave de origem que gerencia as chaves a serem migradas.

  - `--keyring-migration-destination`: O plugin de chaveiro de destino para onde as chaves migradas serão copiadas.

  Essas opções indicam ao servidor que ele deve executar no modo de migração de chaves. Para operações de migração de chaves, ambas as opções são obrigatórias. Os plugins de origem e destino devem ser diferentes, e o servidor de migração deve suportar ambos os plugins.

- Para uma migração offline, não são necessárias opções adicionais de migração de chaves.

- Para uma migração online, alguns servidores em execução estão atualmente usando o keystore de origem ou destino. Para invocar o servidor de migração, especifique opções adicionais de migração de chaves que indiquem como se conectar ao servidor em execução. Isso é necessário para que o servidor de migração possa se conectar ao servidor em execução e pedir que ele pause o uso do keyring durante a operação de migração.

  O uso de qualquer uma das seguintes opções indica uma migração online:

  - `--keyring-migration-host`: O host onde o servidor está sendo executado. Este é sempre o host local, pois o servidor de migração pode migrar chaves apenas entre keystores gerenciados por plugins locais.

  - `--keyring-migration-user`, `--keyring-migration-password`: As credenciais da conta a serem usadas para se conectar ao servidor em execução.

  - `--keyring-migration-port`: Para conexões TCP/IP, o número de porta para se conectar ao servidor em execução.

  - `--keyring-migration-socket`: Para conexões por arquivo de socket Unix ou tubo nomeado do Windows, o arquivo de socket ou o tubo nomeado para se conectar ao servidor em execução.

Para obter informações adicionais sobre as principais opções de migração, consulte Seção 6.4.4.11, “Opções de comando do Keychain”.

Inicie o servidor de migração com as opções de migração chave, indicando os keystores de origem e destino e se a migração é offline ou online, possivelmente com outras opções. Mantenha as seguintes considerações em mente:

- Podem ser necessárias outras opções de servidor, como parâmetros de configuração para os dois plugins de chaveira. Por exemplo, se `keyring_file` for o arquivo de origem ou destino, você deve definir a variável de sistema `keyring_file_data` se o local do arquivo de dados da chaveira não for o local padrão. Podem ser necessárias outras opções que não sejam de chaveira também. Uma maneira de especificar essas opções é usando `--defaults-file` para nomear um arquivo de opções que contenha as opções necessárias.

- O servidor de migração espera que os valores das opções de nome de caminho sejam caminhos completos. Os nomes de caminho relativos podem não ser resolvidos conforme o esperado.

- O usuário que invoca um servidor no modo de migração de chaves não deve ser o usuário do sistema operacional `root`, a menos que a opção `--user` seja especificada com um nome de usuário que não seja `root` para executar o servidor como esse usuário.

- O usuário que executa um servidor no modo de migração de chaves deve ter permissão para ler e escrever qualquer arquivo de chave local, como o arquivo de dados de um plugin baseado em arquivos.

  Se você invocar o servidor de migração a partir de uma conta de sistema diferente da normalmente usada para executar o MySQL, ele pode criar diretórios ou arquivos de chaveiros inacessíveis ao servidor durante o funcionamento normal. Suponha que o **mysqld** normalmente execute como o usuário do sistema `mysql`, mas você invocar o servidor de migração enquanto estiver logado como `isabel`. Quaisquer novos diretórios ou arquivos criados pelo servidor de migração são de propriedade de `isabel`. O início subsequente falha quando um servidor executado como o usuário do sistema `mysql` tenta acessar objetos do sistema de arquivos de propriedade de `isabel`.

  Para evitar esse problema, inicie o servidor de migração como usuário do sistema operacional `root` e forneça uma opção `--user=user_name` (server-options.html#option\_mysqld\_user), onde *`user_name`* é a conta do sistema normalmente usada para executar o MySQL. Alternativamente, após a migração, examine os objetos do sistema de arquivos relacionados ao keyring e, se necessário, mude sua propriedade e permissões usando **chown**, **chmod** ou comandos semelhantes, para que os objetos sejam acessíveis ao servidor em execução.

Exemplo de linha de comando para migração offline (insira o comando em uma única linha):

```sql
mysqld --defaults-file=/usr/local/mysql/etc/my.cnf
  --keyring-migration-source=keyring_file.so
  --keyring-migration-destination=keyring_encrypted_file.so
  --keyring_encrypted_file_password=password
```

Exemplo de linha de comando para migração online:

```sql
mysqld --defaults-file=/usr/local/mysql/etc/my.cnf
  --keyring-migration-source=keyring_file.so
  --keyring-migration-destination=keyring_encrypted_file.so
  --keyring_encrypted_file_password=password
  --keyring-migration-host=127.0.0.1
  --keyring-migration-user=root
  --keyring-migration-password=root_password
```

O servidor de migração principal realiza uma operação de migração da seguinte forma:

1. (Apenas migração online) Conecte-se ao servidor em execução usando as opções de conexão.

2. (Apenas migração online) Desative `keyring_operations` no servidor em execução.

3. Carregue os plugins de chave de registro de origem e destino.

4. Copie as chaves do keystore de origem para o destino.

5. Descarregue os plugins do chaveiro.

6. (Apenas migração online) Ative `keyring_operations` no servidor em execução.

7. (Apenas migração online) Desconecte-se do servidor em execução.

Se ocorrer um erro durante a migração de chaves, o keystore de destino é restaurado ao seu estado anterior à migração.

Importante

Para uma operação de migração online, o servidor de migração cuida de habilitar e desabilitar `keyring_operations` no servidor em execução. Se o servidor de migração sair abruptamente (por exemplo, se for encerrado forçadamente), é possível que `keyring_operations` permaneça desabilitado no servidor em execução, impedindo que ele realize operações de chaveiro. Nesse caso, pode ser necessário se conectar ao servidor em execução e habilitar manualmente `keyring_operations` usando esta declaração:

```sql
SET GLOBAL keyring_operations = ON;
```

Após a operação bem-sucedida de migração de chave online, o servidor em execução pode precisar ser reiniciado:

- Se o servidor em execução estava usando o keystore de origem antes da migração e deve continuar a usá-lo após a migração, ele não precisa ser reiniciado após a migração.

- Se o servidor em execução estava usando o keystore de destino antes da migração e deve continuar a usá-lo após a migração, ele deve ser reiniciado após a migração para carregar todas as chaves migradas para o keystore de destino.

- Se o servidor em execução estava usando o keystore de origem antes da migração, mas deve usar o keystore de destino após a migração, ele deve ser reconfigurado para usar o keystore de destino e reiniciado. Nesse caso, esteja ciente de que, embora o servidor em execução esteja parado de modificar o keystore de origem durante a migração em si, ele não estará parado durante o intervalo entre a migração e o reinício subsequente. Deve-se ter cuidado para que o servidor não modifique o keystore de origem durante esse intervalo, pois quaisquer alterações não serão refletidas no keystore de destino.

##### Migração chave envolvendo múltiplos servidores em execução

A migração de chaves online permite pausar as operações do conjunto de chaves em um único servidor em execução. Para realizar uma migração se vários servidores em execução estiverem usando os estojos de chaves envolvidos, use o seguinte procedimento:

1. Conecte-se manualmente a cada servidor em execução e defina `keyring_operations=OFF`. Isso garante que nenhum servidor em execução esteja usando o keystore de origem ou destino e atende à condição necessária para a migração offline.

2. Use um servidor de migração para realizar uma migração de chave offline para cada servidor em pausa.

3. Conecte-se manualmente a cada servidor em execução e defina `keyring_operations=ON`.

Todos os servidores em execução devem suportar a variável de sistema `keyring_operations`. Qualquer servidor que não o faça deve ser desligado antes da migração e reiniciado depois.
