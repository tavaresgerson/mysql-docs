### 5.5.1 Instalando e Desinstalando Plugins

Plugins do Server devem ser carregados no Server antes de poderem ser usados. O MySQL suporta o carregamento de *plugins* no *startup* (inicialização) do Server e em *runtime* (tempo de execução). Também é possível controlar o estado de ativação dos *plugins* carregados no *startup* e descarregá-los em *runtime*.

Enquanto um *plugin* está carregado, informações sobre ele estão disponíveis conforme descrito na [Seção 5.5.2, “Obtendo Informações de Plugin do Server”](obtaining-plugin-information.html "5.5.2 Obtendo Informações de Plugin do Server").

* [Instalando Plugins](plugin-loading.html#server-plugin-installing "Installing Plugins")
* [Controlando o Estado de Ativação do Plugin](plugin-loading.html#server-plugin-activating "Controlling Plugin Activation State")
* [Desinstalando Plugins](plugin-loading.html#server-plugin-uninstalling "Uninstalling Plugins")

#### Instalando Plugins

Antes que um *plugin* do Server possa ser usado, ele deve ser instalado usando um dos seguintes métodos. Nas descrições, *`plugin_name`* representa um nome de *plugin*, como `innodb`, `csv` ou `validate_password`.

* [Plugins Integrados (Built-in)](plugin-loading.html#server-plugin-installing-built-in "Built-in Plugins")
* [Plugins Registrados na Tabela de Sistema mysql.plugin](plugin-loading.html#server-plugin-installing-system-table "Plugins Registered in the mysql.plugin System Table")
* [Plugins Nomeados com Opções de Linha de Comando](plugin-loading.html#server-plugin-installing-command-line "Plugins Named with Command-Line Options")
* [Plugins Instalados com a Declaração INSTALL PLUGIN](plugin-loading.html#server-plugin-installing-install-plugin "Plugins Installed with the INSTALL PLUGIN Statement")

##### Plugins Integrados (Built-in)

Um *plugin built-in* é reconhecido pelo Server automaticamente. Por padrão, o Server habilita o *plugin* no *startup*. Alguns *plugins built-in* permitem que isso seja alterado com a opção `--plugin_name[=activation_state]`.

##### Plugins Registrados na Tabela de Sistema mysql.plugin

A tabela de sistema `mysql.plugin` serve como um registro de *plugins* (diferentes dos *plugins built-in*, que não precisam ser registrados). Durante a sequência normal de *startup*, o Server carrega os *plugins* registrados na tabela. Por padrão, para um *plugin* carregado da tabela `mysql.plugin`, o Server também o habilita. Isso pode ser alterado com a opção `--plugin_name[=activation_state]`.

Se o Server for iniciado com a opção [`--skip-grant-tables`], os *plugins* registrados na tabela `mysql.plugin` não são carregados e ficam indisponíveis.

##### Plugins Nomeados com Opções de Linha de Comando

Um *plugin* localizado em um arquivo de biblioteca de *plugins* pode ser carregado no *startup* do Server com a opção [`--plugin-load`], [`--plugin-load-add`] ou [`--early-plugin-load`]. Normalmente, para um *plugin* carregado no *startup*, o Server também o habilita. Isso pode ser alterado com a opção `--plugin_name[=activation_state]`.

As opções [`--plugin-load`] e [`--plugin-load-add`] carregam *plugins* após os *plugins built-in* e os *storage engines* terem sido inicializados durante a sequência de *startup* do Server. A opção [`--early-plugin-load`] é usada para carregar *plugins* que devem estar disponíveis antes da inicialização de *plugins built-in* e *storage engines*.

O valor de cada opção de carregamento de *plugin* é uma lista separada por ponto e vírgula de valores *`plugin_library`* e *`name`*`=`*`plugin_library`*. Cada *`plugin_library`* é o nome de um arquivo de biblioteca que contém o código do *plugin*, e cada *`name`* é o nome de um *plugin* a ser carregado. Se uma biblioteca de *plugin* for nomeada sem nenhum nome de *plugin* precedente, o Server carrega todos os *plugins* na biblioteca. Com um nome de *plugin* precedente, o Server carrega apenas o *plugin* nomeado da biblioteca. O Server procura por arquivos de biblioteca de *plugins* no diretório nomeado pela variável de sistema [`plugin_dir`].

As opções de carregamento de *plugin* não registram nenhum *plugin* na tabela `mysql.plugin`. Para reinicializações subsequentes, o Server carrega o *plugin* novamente apenas se [`--plugin-load`], [`--plugin-load-add`] ou [`--early-plugin-load`] for fornecido novamente. Ou seja, a opção produz uma operação de instalação de *plugin* única que persiste por uma única invocação do Server.

[`--plugin-load`], [`--plugin-load-add`] e [`--early-plugin-load`] permitem que *plugins* sejam carregados mesmo quando [`--skip-grant-tables`] é fornecido (o que faz com que o Server ignore a tabela `mysql.plugin`). Essas opções também permitem que *plugins* sejam carregados no *startup* que não podem ser carregados em *runtime*.

A opção [`--plugin-load-add`] complementa a opção [`--plugin-load`]:

* Cada instância de [`--plugin-load`] redefine o conjunto de *plugins* a serem carregados no *startup*, enquanto [`--plugin-load-add`] adiciona um ou mais *plugins* ao conjunto de *plugins* a serem carregados sem redefinir o conjunto atual. Consequentemente, se múltiplas instâncias de [`--plugin-load`] forem especificadas, apenas a última se aplica. Com múltiplas instâncias de [`--plugin-load-add`], todas elas se aplicam.

* O formato do argumento é o mesmo que para [`--plugin-load`], mas múltiplas instâncias de [`--plugin-load-add`] podem ser usadas para evitar especificar um grande conjunto de *plugins* como um único argumento longo e complicado [`--plugin-load`].

* [`--plugin-load-add`] pode ser fornecido na ausência de [`--plugin-load`], mas qualquer instância de [`--plugin-load-add`] que apareça antes de [`--plugin-load`] não tem efeito porque [`--plugin-load`] redefine o conjunto de *plugins* a serem carregados.

Por exemplo, estas opções:

```sql
--plugin-load=x --plugin-load-add=y
```

são equivalentes a estas opções:

```sql
--plugin-load-add=x --plugin-load-add=y
```

e também são equivalentes a esta opção:

```sql
--plugin-load="x;y"
```

Mas estas opções:

```sql
--plugin-load-add=y --plugin-load=x
```

são equivalentes a esta opção:

```sql
--plugin-load=x
```

##### Plugins Instalados com a Declaração INSTALL PLUGIN

Um *plugin* localizado em um arquivo de biblioteca de *plugins* pode ser carregado em *runtime* com a declaração [`INSTALL PLUGIN`]. A declaração também registra o *plugin* na tabela `mysql.plugin` para fazer com que o Server o carregue em reinicializações subsequentes. Por esta razão, [`INSTALL PLUGIN`] requer o privilégio [`INSERT`] para a tabela `mysql.plugin`.

O nome base do arquivo da biblioteca de *plugin* depende da sua plataforma. Sufixos comuns são `.so` para sistemas Unix e similares a Unix, e `.dll` para Windows.

Exemplo: A opção [`--plugin-load-add`] instala um *plugin* no *startup* do Server. Para instalar um *plugin* chamado `myplugin` a partir de um arquivo de biblioteca de *plugin* chamado `somepluglib.so`, use estas linhas em um arquivo `my.cnf`:

```sql
[mysqld]
plugin-load-add=myplugin=somepluglib.so
```

Neste caso, o *plugin* não é registrado em `mysql.plugin`. Reiniciar o Server sem a opção [`--plugin-load-add`] faz com que o *plugin* não seja carregado no *startup*.

Alternativamente, a declaração [`INSTALL PLUGIN`] faz com que o Server carregue o código do *plugin* do arquivo de biblioteca em *runtime*:

```sql
INSTALL PLUGIN myplugin SONAME 'somepluglib.so';
```

[`INSTALL PLUGIN`] também causa o registro “permanente” do *plugin*: O *plugin* é listado na tabela `mysql.plugin` para garantir que o Server o carregue em reinicializações subsequentes.

Muitos *plugins* podem ser carregados tanto no *startup* do Server quanto em *runtime*. No entanto, se um *plugin* for projetado de modo que deva ser carregado e inicializado durante o *startup* do Server, tentativas de carregá-lo em *runtime* usando [`INSTALL PLUGIN`] produzem um erro:

```sql
mysql> INSTALL PLUGIN myplugin SONAME 'somepluglib.so';
ERROR 1721 (HY000): Plugin 'myplugin' is marked as not dynamically
installable. You have to stop the server to install it.
```

Neste caso, você deve usar [`--plugin-load`], [`--plugin-load-add`] ou [`--early-plugin-load`].

Se um *plugin* for nomeado tanto usando uma opção de carregamento de *plugin* quanto (como resultado de uma declaração [`INSTALL PLUGIN`] anterior) na tabela `mysql.plugin`, o Server inicia, mas escreve estas mensagens no *error log*:

```sql
[ERROR] Function 'plugin_name' already exists
[Warning] Couldn't load plugin named 'plugin_name'
with soname 'plugin_object_file'.
```

#### Controlando o Estado de Ativação do Plugin

Se o Server souber de um *plugin* ao iniciar (por exemplo, porque o *plugin* é nomeado usando uma opção [`--plugin-load-add`] ou está registrado na tabela `mysql.plugin`), o Server carrega e habilita o *plugin* por padrão. É possível controlar o estado de ativação para tal *plugin* usando uma opção de *startup* `--plugin_name[=activation_state]`, onde *`plugin_name`* é o nome do *plugin* a ser afetado, como `innodb`, `csv` ou `validate_password`. Assim como em outras opções, traços e sublinhados são intercambiáveis nos nomes das opções. Além disso, os valores do estado de ativação não diferenciam maiúsculas de minúsculas. Por exemplo, `--my_plugin=ON` e `--my-plugin=on` são equivalentes.

* `--plugin_name=OFF`

  Informa ao Server para desabilitar o *plugin*. Isso pode não ser possível para certos *plugins built-in*, como `mysql_native_password`.

* `--plugin_name[=ON]`

  Informa ao Server para habilitar o *plugin*. (Especificar a opção como `--plugin_name` sem um valor tem o mesmo efeito.) Se o *plugin* falhar ao inicializar, o Server executa com o *plugin* desabilitado.

* `--plugin_name=FORCE`

  Informa ao Server para habilitar o *plugin*, mas se a inicialização do *plugin* falhar, o Server não inicia. Em outras palavras, esta opção força o Server a rodar com o *plugin* habilitado ou a não rodar.

* `--plugin_name=FORCE_PLUS_PERMANENT`

  Semelhante a `FORCE`, mas, adicionalmente, impede que o *plugin* seja descarregado em *runtime*. Se um usuário tentar fazê-lo com [`UNINSTALL PLUGIN`], um erro ocorrerá.

Os estados de ativação do *plugin* são visíveis na coluna `LOAD_OPTION` da tabela [`PLUGINS`] do Information Schema.

Suponha que `CSV`, `BLACKHOLE` e `ARCHIVE` sejam *storage engines pluggables built-in* e que você queira que o Server os carregue no *startup*, sujeitos a estas condições: O Server é permitido a rodar se a inicialização de `CSV` falhar, deve exigir que a inicialização de `BLACKHOLE` seja bem-sucedida e deve desabilitar `ARCHIVE`. Para realizar isso, use estas linhas em um arquivo de opções:

```sql
[mysqld]
csv=ON
blackhole=FORCE
archive=OFF
```

O formato de opção `--enable-plugin_name` é um sinônimo para `--plugin_name=ON`. Os formatos de opção `--disable-plugin_name` e `--skip-plugin_name` são sinônimos para `--plugin_name=OFF`.

Se um *plugin* for desabilitado, seja explicitamente com `OFF` ou implicitamente porque foi habilitado com `ON`, mas falhou ao inicializar, aspectos da operação do Server que requerem o *plugin* mudam. Por exemplo, se o *plugin* implementar um *storage engine*, as tabelas existentes para esse *storage engine* tornam-se inacessíveis, e as tentativas de criar novas tabelas para ele resultam em tabelas que usam o *default storage engine*, a menos que o modo SQL [`NO_ENGINE_SUBSTITUTION`] esteja habilitado para fazer com que um erro ocorra em vez disso.

Desabilitar um *plugin* pode exigir ajustes em outras opções. Por exemplo, se você iniciar o Server usando [`--skip-innodb`] para desabilitar [`InnoDB`], outras opções `innodb_xxx` provavelmente precisarão ser omitidas no *startup*. Além disso, como [`InnoDB`] é o *default storage engine*, ele não pode iniciar a menos que você especifique outro *storage engine* disponível com [`--default_storage_engine`]. Você também deve configurar [`--default_tmp_storage_engine`].

#### Desinstalando Plugins

Em *runtime*, a declaração [`UNINSTALL PLUGIN`] desabilita e desinstala um *plugin* conhecido pelo Server. A declaração descarrega o *plugin* e o remove da tabela de sistema `mysql.plugin`, se estiver registrado lá. Por esta razão, a declaração [`UNINSTALL PLUGIN`] requer o privilégio [`DELETE`] para a tabela `mysql.plugin`. Com o *plugin* não mais registrado na tabela, o Server não carrega o *plugin* durante reinicializações subsequentes.

[`UNINSTALL PLUGIN`] pode descarregar um *plugin* independentemente de ter sido carregado em *runtime* com [`INSTALL PLUGIN`] ou no *startup* com uma opção de carregamento de *plugin*, sujeito a estas condições:

* Não pode descarregar *plugins* que são *built in* no Server. Estes podem ser identificados como aqueles que têm um nome de biblioteca `NULL` na saída de [`INFORMATION_SCHEMA.PLUGINS`] ou [`SHOW PLUGINS`].

* Não pode descarregar *plugins* para os quais o Server foi iniciado com `--plugin_name=FORCE_PLUS_PERMANENT`, o que impede o descarregamento do *plugin* em *runtime*. Estes podem ser identificados a partir da coluna `LOAD_OPTION` da tabela [`PLUGINS`] do Information Schema.

Para desinstalar um *plugin* que está atualmente carregado no *startup* do Server com uma opção de carregamento de *plugin*, use este procedimento.

1. Remova do arquivo `my.cnf` quaisquer opções relacionadas ao *plugin*.

2. Reinicie o Server.
3. Normalmente, os *plugins* são instalados usando uma opção de carregamento de *plugin* no *startup* ou com [`INSTALL PLUGIN`] em *runtime*, mas não ambos. No entanto, remover as opções de um *plugin* do arquivo `my.cnf` pode não ser suficiente para desinstalá-lo se em algum momento [`INSTALL PLUGIN`] também tiver sido usado. Se o *plugin* ainda aparecer na saída de [`INFORMATION_SCHEMA.PLUGINS`] ou [`SHOW PLUGINS`], use [`UNINSTALL PLUGIN`] para removê-lo da tabela `mysql.plugin`. Em seguida, reinicie o Server novamente.