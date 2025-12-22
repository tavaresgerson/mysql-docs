### 7.6.1 Instalação e Desinstalação de Plugins

Os plugins do servidor devem ser carregados no servidor antes de poderem ser usados. O MySQL suporta o carregamento de plugins na inicialização e no tempo de execução do servidor. Também é possível controlar o estado de ativação de plugins carregados na inicialização e descarregá-los no tempo de execução.

Enquanto um plugin está carregado, as informações sobre ele estão disponíveis conforme descrito na Seção 7.6.2, "Obtenção de Informações do Plugin do Servidor".

- Instalação de Plugins
- Controle do estado de ativação do plugin
- Desinstalar Plugins
- Plugins e Funções Carregáveis

#### Instalação de Plugins

Antes que um plugin de servidor possa ser usado, ele deve ser instalado usando um dos seguintes métodos. Nas descrições, \* `plugin_name` \* significa um nome de plugin como `innodb`, `csv`, ou `validate_password`.

- Plugins integrados
- Plugins registados na tabela de sistema mysql.plugin
- Plugins nomeados com opções de linha de comando
- Plugins instalados com a instrução INSTALL PLUGIN

##### Plugins integrados

Um plugin incorporado é conhecido pelo servidor automaticamente. Por padrão, o servidor habilita o plugin na inicialização. Alguns plugins incorporados permitem que isso seja alterado com a opção `--plugin_name[=activation_state]`.

##### Plugins registados na tabela de sistema mysql.plugin

A tabela de sistema `mysql.plugin` serve como um registro de plugins (exceto plugins integrados, que não precisam ser registrados). Durante a sequência de inicialização normal, o servidor carrega plugins registrados na tabela. Por padrão, para um plugin carregado a partir da tabela `mysql.plugin`, o servidor também habilita o plugin. Isso pode ser alterado com a opção `--plugin_name[=activation_state]`.

Se o servidor é iniciado com a opção `--skip-grant-tables`, os plugins registrados na tabela `mysql.plugin` não são carregados e não estão disponíveis.

##### Plugins nomeados com opções de linha de comando

Um plugin localizado em um arquivo de biblioteca de plugins pode ser carregado na inicialização do servidor com a opção `--plugin-load`, `--plugin-load-add`, ou `--early-plugin-load`.

As opções `--plugin-load` e `--plugin-load-add` carregam plugins após os plugins integrados e os motores de armazenamento terem sido inicializados durante a sequência de inicialização do servidor. A opção `--early-plugin-load` é usada para carregar plugins que devem estar disponíveis antes da inicialização de plugins integrados e motores de armazenamento.

O valor de cada opção de carregamento de plugins é uma lista separada por vírgula de valores \* `plugin_library` \* e \* `name` \* `=` \* `plugin_library` \*. Cada \* `plugin_library` \* é o nome de um arquivo de biblioteca que contém o código do plugin, e cada \* `name` \* é o nome de um plugin para carregar. Se uma biblioteca de plugins é nomeada sem nenhum nome de plugin anterior, o servidor carrega todos os plugins na biblioteca. Com um nome de plugin anterior, o servidor carrega apenas o plugin nomeado da biblioteca. O servidor procura arquivos de biblioteca de plugins no diretório nomeado pela variável do sistema `plugin_dir`.

As opções de carregamento de plugins não registam nenhum plugin na tabela `mysql.plugin`. Para reinicializações subsequentes, o servidor carrega o plugin novamente somente se for dado novamente `--plugin-load`, `--plugin-load-add` ou `--early-plugin-load`. Ou seja, a opção produz uma operação de instalação de plugins de uma única vez que persiste para uma única invocação do servidor.

`--plugin-load`, `--plugin-load-add`, e `--early-plugin-load` permitem que os plugins sejam carregados mesmo quando `--skip-grant-tables` é dado (o que faz com que o servidor ignore a tabela `mysql.plugin`). `--plugin-load`, `--plugin-load-add`, e `--early-plugin-load` também permitem que os plugins sejam carregados na inicialização que não podem ser carregados no tempo de execução.

A opção `--plugin-load-add` complementa a `--plugin-load`:

- Cada instância de `--plugin-load` redefine o conjunto de plugins para carregar no início, enquanto `--plugin-load-add` adiciona um ou mais plugins ao conjunto de plugins a serem carregados sem redefinir o conjunto atual. Consequentemente, se várias instâncias de `--plugin-load` são especificadas, apenas a última se aplica. Com várias instâncias de `--plugin-load-add`, todas elas se aplicam.
- O formato do argumento é o mesmo que para `--plugin-load`, mas várias instâncias de `--plugin-load-add` podem ser usadas para evitar especificar um grande conjunto de plugins como um único argumento `--plugin-load`.
- `--plugin-load-add` pode ser dado na ausência de `--plugin-load`, mas qualquer instância de `--plugin-load-add` que apareça antes de `--plugin-load` não tem efeito porque `--plugin-load` redefine o conjunto de plugins para carregar.

Por exemplo, estas opções:

```
--plugin-load=x --plugin-load-add=y
```

São equivalentes a estas opções:

```
--plugin-load-add=x --plugin-load-add=y
```

e são igualmente equivalentes a esta opção:

```
--plugin-load="x;y"
```

Mas estas opções:

```
--plugin-load-add=y --plugin-load=x
```

são equivalentes a esta opção:

```
--plugin-load=x
```

##### Plugins instalados com a instrução INSTALL PLUGIN

Um plugin localizado em um arquivo de biblioteca de plugins pode ser carregado no tempo de execução com a instrução `INSTALL PLUGIN`. A instrução também registra o plugin na tabela `mysql.plugin` para fazer com que o servidor o carregue em reinicializações subsequentes. Por esta razão, `INSTALL PLUGIN` requer o privilégio `INSERT` para a tabela `mysql.plugin`.

O nome da base de arquivos da biblioteca de plugins depende da sua plataforma.

Exemplo: A opção `--plugin-load-add` instala um plugin na inicialização do servidor. Para instalar um plugin chamado `myplugin` de um arquivo de biblioteca de plugins chamado `somepluglib.so`, use estas linhas em um arquivo `my.cnf`:

```
[mysqld]
plugin-load-add=myplugin=somepluglib.so
```

Neste caso, o plugin não está registrado no `mysql.plugin`. Reiniciar o servidor sem a opção `--plugin-load-add` faz com que o plugin não seja carregado na inicialização.

Alternativamente, a instrução `INSTALL PLUGIN` faz com que o servidor carregue o código do plugin do arquivo da biblioteca no tempo de execução:

```
INSTALL PLUGIN myplugin SONAME 'somepluglib.so';
```

`INSTALL PLUGIN` também causa o registro de plugin permanente: O plugin é listado na tabela `mysql.plugin` para garantir que o servidor o carregue nas reinicializações subsequentes.

Muitos plugins podem ser carregados no início do servidor ou no tempo de execução. No entanto, se um plugin é projetado de tal forma que ele deve ser carregado e inicializado durante o início do servidor, as tentativas de carregá-lo no tempo de execução usando `INSTALL PLUGIN` produzem um erro:

```
mysql> INSTALL PLUGIN myplugin SONAME 'somepluglib.so';
ERROR 1721 (HY000): Plugin 'myplugin' is marked as not dynamically
installable. You have to stop the server to install it.
```

Neste caso, você deve usar `--plugin-load`, `--plugin-load-add`, ou `--early-plugin-load`.

Se um plugin é nomeado usando uma opção `--plugin-load`, `--plugin-load-add`, ou `--early-plugin-load` e (como resultado de uma instrução `INSTALL PLUGIN` anterior) na tabela `mysql.plugin`, o servidor inicia, mas escreve essas mensagens para o registro de erros:

```
[ERROR] Function 'plugin_name' already exists
[Warning] Couldn't load plugin named 'plugin_name'
with soname 'plugin_object_file'.
```

#### Controle do estado de ativação do plugin

Se o servidor sabe sobre um plugin quando ele é iniciado (por exemplo, porque o plugin é nomeado usando uma opção `--plugin-load-add` ou está registrado na tabela `mysql.plugin`), o servidor carrega e habilita o plugin por padrão. É possível controlar o estado de ativação para tal plugin usando uma opção de inicialização `--plugin_name[=activation_state]`, onde \* `plugin_name` \* é o nome do plugin para afetar, como `innodb`, `csv`, ou `validate_password`.

- `--plugin_name=OFF`

  Diz ao servidor para desativar o plugin. Usando esta opção, você pode desativar, por exemplo, o plug-in depreciado `mysql_native_password` na inicialização do servidor.
- `--plugin_name[=ON]`

  Indica ao servidor para habilitar o plugin. (Especificar a opção como `--plugin_name` sem um valor tem o mesmo efeito.) Se o plugin falhar na inicialização, o servidor será executado com o plugin desativado.
- `--plugin_name=FORCE`

  Diz ao servidor para habilitar o plugin, mas se a inicialização do plugin falhar, o servidor não será iniciado. Em outras palavras, esta opção força o servidor a executar com o plugin habilitado ou
- `--plugin_name=FORCE_PLUS_PERMANENT`

  Como `FORCE`, mas além disso impede que o plugin seja descarregado no tempo de execução. Se um usuário tentar fazê-lo com `UNINSTALL PLUGIN`, ocorre um erro.

Os estados de ativação do plugin são visíveis na coluna `LOAD_OPTION` da tabela do Esquema de Informações `PLUGINS`.

Suponha que `CSV`, `BLACKHOLE`, e `ARCHIVE` sejam motores de armazenamento conectáveis e que você queira que o servidor os carregue na inicialização, sujeito a estas condições: O servidor está autorizado a rodar se a inicialização de `CSV` falhar, deve exigir que a inicialização de `BLACKHOLE` tenha sucesso, e deve desativar `ARCHIVE`. Para isso, use estas linhas em um arquivo de opções:

```
[mysqld]
csv=ON
blackhole=FORCE
archive=OFF
```

O formato de opção `--enable-plugin_name` é um sinônimo de `--plugin_name=ON`. Os formatos de opção `--disable-plugin_name` e `--skip-plugin_name` são sinônimos de `--plugin_name=OFF`.

Por exemplo, se o plugin implementa um mecanismo de armazenamento, as tabelas existentes para o mecanismo de armazenamento tornam-se inacessíveis e as tentativas de criar novas tabelas para o mecanismo de armazenamento resultam em tabelas que usam o mecanismo de armazenamento padrão, a menos que o modo SQL seja habilitado para causar um erro.

A desativação de um plugin pode exigir o ajuste de outras opções.

#### Desinstalar Plugins

No tempo de execução, a instrução `UNINSTALL PLUGIN` desativa e desinstala um plugin conhecido pelo servidor. A instrução descarrega o plugin e o remove da tabela de sistema `mysql.plugin`, se estiver registrado lá. Por esta razão, a instrução `UNINSTALL PLUGIN` requer o privilégio `DELETE` para a tabela `mysql.plugin`. Com o plugin não mais registrado na tabela, o servidor não carrega o plugin durante reinicializações subsequentes.

O `UNINSTALL PLUGIN` pode descarregar um plugin independentemente de ter sido carregado no tempo de execução com o `INSTALL PLUGIN` ou na inicialização com uma opção de carregamento de plugin, sujeito a estas condições:

- Ele não pode descarregar plugins que estão embutidos no servidor. Estes podem ser identificados como aqueles que têm um nome de biblioteca de `NULL` na saída da tabela de esquema de informação `PLUGINS` ou `SHOW PLUGINS`.
- Ele não pode descarregar plugins para os quais o servidor foi iniciado com `--plugin_name=FORCE_PLUS_PERMANENT`, o que impede o descarregamento do plugin no tempo de execução. Estes podem ser identificados a partir da coluna `LOAD_OPTION` da tabela `PLUGINS`.

Para desinstalar um plugin que está atualmente carregado na inicialização do servidor com uma opção de carregamento de plugin, use este procedimento.

1. Remova do arquivo `my.cnf` quaisquer opções e variáveis do sistema relacionadas ao plugin. Se quaisquer variáveis do sistema do plugin foram persistentes no arquivo `mysqld-auto.cnf`, remova-as usando `RESET PERSIST var_name` para removê-lo.
2. Reinicie o servidor.
3. Os plugins normalmente são instalados usando uma opção de carregamento de plugins no início ou com o `INSTALL PLUGIN` no tempo de execução, mas não ambos. No entanto, a remoção de opções para um plugin do arquivo `my.cnf` pode não ser suficiente para desinstala-lo se em algum momento `INSTALL PLUGIN` também foi usado. Se o plugin ainda aparecer na saída de `PLUGINS` ou `SHOW PLUGINS`, use `UNINSTALL PLUGIN` para removê-lo da tabela `mysql.plugin`. Em seguida, reinicie o servidor novamente.

#### Plugins e Funções Carregáveis

Um plugin quando instalado também pode instalar automaticamente funções carregáveis relacionadas.
