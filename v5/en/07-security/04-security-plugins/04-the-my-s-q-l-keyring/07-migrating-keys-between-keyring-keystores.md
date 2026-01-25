#### 6.4.4.7 Migrando Keys Entre Keystores do Keyring

Uma `migration` de `keyring` copia `keys` de um `keystore` para outro, permitindo que um DBA mude uma instalação MySQL para um `keystore` diferente. Uma operação de `migration` bem-sucedida resulta no seguinte:

* O `keystore` de destino contém as `keys` que possuía antes da `migration`, mais as `keys` do `keystore` de origem.

* O `keystore` de origem permanece o mesmo antes e depois da `migration` (porque as `keys` são copiadas, não movidas).

Se uma `key` a ser copiada já existir no `keystore` de destino, ocorrerá um erro e o `keystore` de destino será restaurado ao seu estado pré-`migration`.

As seções a seguir discutem as características das `migrations offline` e `online` e descrevem como realizá-las.

* [Migrations de Key Offline e Online](keyring-key-migration.html#keyring-key-migration-offline-online "Migrations de Key Offline e Online")
* [Migration de Key Usando um Migration Server](keyring-key-migration.html#keyring-key-migration-using-migration-server "Migration de Key Usando um Migration Server")
* [Migration de Key Envolvendo Múltiplos Servers em Execução](keyring-key-migration.html#keyring-key-migration-multiple-running-servers "Migration de Key Envolvendo Múltiplos Servers em Execução")

##### Migrations de Key Offline e Online

Uma `migration` de `key` pode ser `offline` ou `online`:

* Migration Offline: Para uso quando houver certeza de que nenhum `server` em execução no `host` local está usando o `keystore` de origem ou de destino. Neste caso, a operação de `migration` pode copiar `keys` do `keystore` de origem para o destino sem a possibilidade de um `server` em execução modificar o conteúdo do `keystore` durante a operação.

* Migration Online: Para uso quando um `server` em execução no `host` local estiver usando o `keystore` de origem ou de destino. Neste caso, deve-se tomar cuidado para evitar que esse `server` atualize os `keystores` durante a `migration`. Isso envolve conectar-se ao `server` em execução e instruí-lo a pausar as operações do `keyring` para que as `keys` possam ser copiadas com segurança do `keystore` de origem para o destino. Quando a cópia das `keys` estiver completa, o `server` em execução é permitido a retomar as operações do `keyring`.

Ao planejar uma `key migration`, use os seguintes pontos para decidir se ela deve ser `offline` ou `online`:

* Não execute `migration offline` envolvendo um `keystore` que esteja em uso por um `server` em execução.

* A pausa das operações de `keyring` durante uma `migration online` é realizada conectando-se ao `server` em execução e definindo sua `System Variable` global [`keyring_operations`](keyring-system-variables.html#sysvar_keyring_operations) como `OFF` antes da cópia das `keys` e como `ON` após a cópia. Isso tem várias implicações:

  + [`keyring_operations`](keyring-system-variables.html#sysvar_keyring_operations) foi introduzida no MySQL 5.7.21, portanto, a `migration online` só é possível se o `server` em execução for do MySQL 5.7.21 ou superior. Se o `server` em execução for mais antigo, você deve pará-lo, realizar uma `migration offline` e reiniciá-lo. Todas as instruções de `migration` que fazem referência a [`keyring_operations`](keyring-system-variables.html#sysvar_keyring_operations) estão sujeitas a esta condição.

  + A conta usada para conectar-se ao `server` em execução deve ter o `privilege` [`SUPER`](privileges-provided.html#priv_super) necessário para modificar [`keyring_operations`](keyring-system-variables.html#sysvar_keyring_operations).

  + Para uma `migration online`, a operação de `migration` se encarrega de habilitar e desabilitar [`keyring_operations`](keyring-system-variables.html#sysvar_keyring_operations) no `server` em execução. Se a operação de `migration` for encerrada de forma anormal (por exemplo, se for terminada à força), é possível que [`keyring_operations`](keyring-system-variables.html#sysvar_keyring_operations) permaneça desabilitada no `server` em execução, deixando-o incapaz de executar operações de `keyring`. Neste caso, pode ser necessário conectar-se ao `server` em execução e habilitar [`keyring_operations`](keyring-system-variables.html#sysvar_keyring_operations) manualmente usando esta instrução:

    ```sql
    SET GLOBAL keyring_operations = ON;
    ```

* A `key migration online` prevê a pausa das operações de `keyring` em um único `server` em execução. Para realizar uma `migration` se múltiplos `servers` em execução estiverem usando os `keystores` envolvidos, use o procedimento descrito em [Migration de Key Envolvendo Múltiplos Servers em Execução](keyring-key-migration.html#keyring-key-migration-multiple-running-servers "Migration de Key Envolvendo Múltiplos Servers em Execução").

##### Migration de Key Usando um Migration Server

A partir do MySQL 5.7.21, um `MySQL Server` se torna um `migration server` se invocado em um modo operacional especial que suporta a `key migration`. Um `migration server` não aceita conexões de `client`. Em vez disso, ele é executado apenas o tempo suficiente para migrar `keys`, e depois é encerrado. Um `migration server` reporta erros para o console (o `standard error output`).

Para realizar uma operação de `key migration` usando um `migration server`, determine as opções de `key migration` necessárias para especificar quais `plugins` ou componentes de `keyring` estão envolvidos e se a `migration` é `offline` ou `online`:

* Para indicar os `plugins` de `keyring` de origem e destino, especifique estas opções:

  + [`--keyring-migration-source`](keyring-options.html#option_mysqld_keyring-migration-source): O `keyring plugin` de origem que gerencia as `keys` a serem migradas.

  + [`--keyring-migration-destination`](keyring-options.html#option_mysqld_keyring-migration-destination): O `keyring plugin` de destino para o qual as `keys` migradas devem ser copiadas.

  Estas opções indicam ao `server` para executar no modo de `key migration`. Para operações de `key migration`, ambas as opções são obrigatórias. Os `plugins` de origem e destino devem ser diferentes, e o `migration server` deve suportar ambos os `plugins`.

* Para uma `migration offline`, nenhuma opção adicional de `key migration` é necessária.

* Para uma `migration online`, algum `server` em execução está atualmente usando o `keystore` de origem ou de destino. Para invocar o `migration server`, especifique opções adicionais de `key migration` que indiquem como conectar-se ao `server` em execução. Isso é necessário para que o `migration server` possa se conectar ao `server` em execução e instruí-lo a pausar o uso do `keyring` durante a operação de `migration`.

  O uso de qualquer uma das seguintes opções significa uma `migration online`:

  + [`--keyring-migration-host`](keyring-options.html#option_mysqld_keyring-migration-host): O `host` onde o `server` em execução está localizado. Este é sempre o `host` local, porque o `migration server` pode migrar `keys` apenas entre `keystores` gerenciados por `plugins` locais.

  + [`--keyring-migration-user`](keyring-options.html#option_mysqld_keyring-migration-user), [`--keyring-migration-password`](keyring-options.html#option_mysqld_keyring-migration-password): As `credentials` de conta a serem usadas para conectar-se ao `server` em execução.

  + [`--keyring-migration-port`](keyring-options.html#option_mysqld_keyring-migration-port): Para conexões TCP/IP, o número da `port` para conectar-se no `server` em execução.

  + [`--keyring-migration-socket`](keyring-options.html#option_mysqld_keyring-migration-socket): Para arquivos `socket` Unix ou conexões de `named pipe` Windows, o arquivo `socket` ou `named pipe` para conectar-se no `server` em execução.

Para detalhes adicionais sobre as opções de `key migration`, consulte [Section 6.4.4.11, “Keyring Command Options”](keyring-options.html "6.4.4.11 Keyring Command Options").

Inicie o `migration server` com opções de `key migration` que indiquem os `keystores` de origem e destino e se a `migration` é `offline` ou `online`, possivelmente com outras opções. Mantenha as seguintes considerações em mente:

* Outras opções do `server` podem ser necessárias, como parâmetros de configuração para os dois `keyring plugins`. Por exemplo, se `keyring_file` for a origem ou o destino, você deve definir a `System Variable` [`keyring_file_data`](keyring-system-variables.html#sysvar_keyring_file_data) se a localização do arquivo de dados do `keyring` não for o local padrão. Outras opções não relacionadas ao `keyring` também podem ser necessárias. Uma maneira de especificar essas opções é usando [`--defaults-file`](option-file-options.html#option_general_defaults-file) para nomear um arquivo de opções que contenha as opções necessárias.

* O `migration server` espera que os valores das opções de nome de caminho sejam caminhos completos (`full paths`). Nomes de caminho relativos podem não ser resolvidos como você espera.

* O usuário que invoca um `server` no modo de `key-migration` não deve ser o usuário `root` do `Operating System`, a menos que a opção [`--user`](server-options.html#option_mysqld_user) seja especificada com um nome de usuário diferente de `root` para executar o `server` como esse usuário.

* O usuário sob o qual um `server` no modo de `key-migration` é executado deve ter permissão para ler e escrever quaisquer arquivos `keyring` locais, como o arquivo de dados para um `plugin` baseado em arquivo.

  Se você invocar o `migration server` a partir de uma conta de `System` diferente daquela normalmente usada para executar o MySQL, ele pode criar diretórios ou arquivos de `keyring` que são inacessíveis ao `server` durante a operação normal. Suponha que [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") normalmente seja executado como o usuário `mysql` do `Operating System`, mas você invoca o `migration server` enquanto está logado como `isabel`. Quaisquer novos diretórios ou arquivos criados pelo `migration server` serão de propriedade de `isabel`. A inicialização subsequente falha quando um `server` executado como o usuário `mysql` do `Operating System` tenta acessar objetos do `file system` de propriedade de `isabel`.

  Para evitar este problema, inicie o `migration server` como o usuário `root` do `Operating System` e forneça uma opção [`--user=user_name`](server-options.html#option_mysqld_user), onde *`user_name`* é a conta de `system` normalmente usada para executar o MySQL. Alternativamente, após a `migration`, examine os objetos do `file system` relacionados ao `keyring` e altere sua propriedade e permissões, se necessário, usando **chown**, **chmod**, ou comandos semelhantes, para que os objetos sejam acessíveis ao `server` em execução.

Exemplo de linha de comando para `migration offline` (digite o comando em uma única linha):

```sql
mysqld --defaults-file=/usr/local/mysql/etc/my.cnf
  --keyring-migration-source=keyring_file.so
  --keyring-migration-destination=keyring_encrypted_file.so
  --keyring_encrypted_file_password=password
```

Exemplo de linha de comando para `migration online`:

```sql
mysqld --defaults-file=/usr/local/mysql/etc/my.cnf
  --keyring-migration-source=keyring_file.so
  --keyring-migration-destination=keyring_encrypted_file.so
  --keyring_encrypted_file_password=password
  --keyring-migration-host=127.0.0.1
  --keyring-migration-user=root
  --keyring-migration-password=root_password
```

O `key migration server` executa uma operação de `migration` da seguinte forma:

1. (Apenas `migration online`) Conecta-se ao `server` em execução usando as opções de conexão.

2. (Apenas `migration online`) Desabilita [`keyring_operations`](keyring-system-variables.html#sysvar_keyring_operations) no `server` em execução.

3. Carrega os `keyring plugins` de origem e destino.
4. Copia `keys` do `keystore` de origem para o destino.
5. Descarrega os `keyring plugins`.
6. (Apenas `migration online`) Habilita [`keyring_operations`](keyring-system-variables.html#sysvar_keyring_operations) no `server` em execução.

7. (Apenas `migration online`) Desconecta-se do `server` em execução.

Se ocorrer um erro durante a `key migration`, o `keystore` de destino é restaurado ao seu estado pré-`migration`.

Importante

Para uma operação de `migration online`, o `migration server` se encarrega de habilitar e desabilitar [`keyring_operations`](keyring-system-variables.html#sysvar_keyring_operations) no `server` em execução. Se o `migration server` for encerrado de forma anormal (por exemplo, se for terminado à força), é possível que [`keyring_operations`](keyring-system-variables.html#sysvar_keyring_operations) permaneça desabilitada no `server` em execução, deixando-o incapaz de executar operações de `keyring`. Neste caso, pode ser necessário conectar-se ao `server` em execução e habilitar [`keyring_operations`](keyring-system-variables.html#sysvar_keyring_operations) manualmente usando esta instrução:

```sql
SET GLOBAL keyring_operations = ON;
```

Após uma operação de `key migration online` bem-sucedida, o `server` em execução pode precisar ser reiniciado:

* Se o `server` em execução estava usando o `keystore` de origem antes da `migration` e deve continuar a usá-lo após a `migration`, ele não precisa ser reiniciado após a `migration`.

* Se o `server` em execução estava usando o `keystore` de destino antes da `migration` e deve continuar a usá-lo após a `migration`, ele deve ser reiniciado após a `migration` para carregar todas as `keys` migradas para o `keystore` de destino.

* Se o `server` em execução estava usando o `keystore` de origem antes da `migration`, mas deve usar o `keystore` de destino após a `migration`, ele deve ser reconfigurado para usar o `keystore` de destino e ser reiniciado. Neste caso, esteja ciente de que, embora o `server` em execução seja pausado de modificar o `keystore` de origem durante a `migration` em si, ele não é pausado durante o intervalo entre a `migration` e o reinício subsequente. Deve-se tomar cuidado para que o `server` não modifique o `keystore` de origem durante este intervalo, pois quaisquer alterações desse tipo não serão refletidas no `keystore` de destino.

##### Migration de Key Envolvendo Múltiplos Servers em Execução

A `key migration online` prevê a pausa das operações de `keyring` em um único `server` em execução. Para realizar uma `migration` se múltiplos `servers` em execução estiverem usando os `keystores` envolvidos, use este procedimento:

1. Conecte-se a cada `server` em execução manualmente e defina [`keyring_operations=OFF`](keyring-system-variables.html#sysvar_keyring_operations). Isso garante que nenhum `server` em execução esteja usando o `keystore` de origem ou de destino e satisfaz a condição necessária para `migration offline`.

2. Use um `migration server` para realizar uma `key migration offline` para cada `server` pausado.

3. Conecte-se a cada `server` em execução manualmente e defina [`keyring_operations=ON`](keyring-system-variables.html#sysvar_keyring_operations).

Todos os `servers` em execução devem suportar a `System Variable` [`keyring_operations`](keyring-system-variables.html#sysvar_keyring_operations). Qualquer `server` que não suporte deve ser parado antes da `migration` e reiniciado depois.