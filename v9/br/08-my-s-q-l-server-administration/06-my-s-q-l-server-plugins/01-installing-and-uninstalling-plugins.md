### 7.6.1 Instalação e Desinstalação de Plugins

Os plugins do servidor devem ser carregados no servidor antes que possam ser usados. O MySQL suporta o carregamento de plugins durante o início e o funcionamento do servidor. Também é possível controlar o estado de ativação dos plugins carregados durante o início e descarregá-los durante o funcionamento.

Enquanto um plugin está carregado, as informações sobre ele estão disponíveis conforme descrito na Seção 7.6.2, “Obtendo Informações de Plugins do Servidor”.

* Instalação de Plugins
* Controle do Estado de Ativação do Plugin
* Desinstalação de Plugins
* Plugins e Funções Carregáveis

#### Instalação de Plugins

Antes que um plugin do servidor possa ser usado, ele deve ser instalado usando um dos seguintes métodos. Nas descrições, *`plugin_name`* representa um nome de plugin, como `innodb`, `csv` ou `validate_password`.

* Plugins Iniciais
* Plugins Registrados na Tabela de Sistema `mysql.plugin`
* Plugins Nomeados com Opções de Linha de Comando
* Plugins Instalados com a Instrução `INSTALL PLUGIN`

##### Plugins Iniciais

Um plugin inicial é conhecido pelo servidor automaticamente. Por padrão, o servidor habilita o plugin durante o início. Alguns plugins iniciais permitem que isso seja alterado com a opção `--plugin_name[=activation_state]`.

##### Plugins Registrados na Tabela de Sistema `mysql.plugin`

A tabela de sistema `mysql.plugin` serve como um registro de plugins (exceto plugins iniciais, que não precisam ser registrados). Durante a sequência normal de inicialização, o servidor carrega os plugins registrados na tabela. Por padrão, para um plugin carregado da tabela `mysql.plugin`, o servidor também habilita o plugin. Isso pode ser alterado com a opção `--plugin_name[=activation_state]`.

Se o servidor for iniciado com a opção `--skip-grant-tables`, os plugins registrados na tabela `mysql.plugin` não são carregados e não estão disponíveis.

##### Plugins com Opções de Linha de Comando

Nota

`--early-plugin-load` está desatualizado e está sujeito à remoção em uma versão futura do MySQL. Consulte a descrição desta opção para obter mais informações.

Um plugin localizado em um arquivo de biblioteca de plugins pode ser carregado no início do servidor com as opções `--plugin-load`, `--plugin-load-add` ou `--early-plugin-load`. Normalmente, para um plugin carregado no início, o servidor também habilita o plugin. Isso pode ser alterado com a opção `--plugin_name[=activation_state]`.

As opções `--plugin-load` e `--plugin-load-add` carregam plugins após os plugins integrados e os motores de armazenamento terem sido inicializados durante a sequência de inicialização do servidor. A opção `--early-plugin-load` é usada para carregar plugins que devem estar disponíveis antes da inicialização dos plugins integrados e dos motores de armazenamento.

O valor de cada opção de carregamento de plugins é uma lista separada por ponto-e-vírgula de valores de *`plugin_library`* e *`name`*`=`*`plugin_library`* . Cada *`plugin_library`* é o nome de um arquivo de biblioteca que contém o código do plugin, e cada *`name`* é o nome de um plugin a ser carregado. Se uma biblioteca de plugins for nomeada sem nenhum nome de plugin anterior, o servidor carrega todos os plugins da biblioteca. Com um nome de plugin anterior, o servidor carrega apenas o plugin nomeado da biblioteca. O servidor procura por arquivos de biblioteca de plugins no diretório nomeado pela variável de sistema `plugin_dir`.

As opções de carregamento de plugins não registram nenhum plugin na tabela `mysql.plugin`. Para reinicializações subsequentes, o servidor carrega o plugin novamente apenas se `--plugin-load`, `--plugin-load-add` ou `--early-plugin-load` for dado novamente. Ou seja, a opção produz uma operação de instalação de plugin única que persiste para uma única invocação do servidor.

`--plugin-load`, `--plugin-load-add` e `--early-plugin-load` permitem que os plugins sejam carregados mesmo quando `--skip-grant-tables` é fornecido (o que faz com que o servidor ignore a tabela `mysql.plugin`). `--plugin-load`, `--plugin-load-add` e `--early-plugin-load` também permitem que plugins sejam carregados no início, que não podem ser carregados em tempo de execução.

A opção `--plugin-load-add` complementa a opção `--plugin-load`:

* Cada instância de `--plugin-load` redefere o conjunto de plugins a serem carregados no início, enquanto `--plugin-load-add` adiciona um plugin ou plugins ao conjunto de plugins a serem carregados sem redefinir o conjunto atual. Consequentemente, se várias instâncias de `--plugin-load` forem especificadas, apenas a última se aplica. Com várias instâncias de `--plugin-load-add`, todas elas se aplicam.

* O formato do argumento é o mesmo que para `--plugin-load`, mas várias instâncias de `--plugin-load-add` podem ser usadas para evitar especificar um grande conjunto de plugins como um único argumento longo e complicado de `--plugin-load`.

* `--plugin-load-add` pode ser fornecido na ausência de `--plugin-load`, mas qualquer instância de `--plugin-load-add` que apareça antes de `--plugin-load` não tem efeito porque `--plugin-load` redefere o conjunto de plugins a serem carregados.

Por exemplo, essas opções:

```
--plugin-load=x --plugin-load-add=y
```

são equivalentes a essas opções:

```
--plugin-load-add=x --plugin-load-add=y
```

e também são equivalentes a esta opção:

```
--plugin-load="x;y"
```

Mas essas opções:

```
--plugin-load-add=y --plugin-load=x
```

são equivalentes a esta opção:

```
--plugin-load=x
```

Um plugin localizado em um arquivo de biblioteca de plugins pode ser carregado em tempo de execução com a instrução `INSTALL PLUGIN`. A instrução também registra o plugin na tabela `mysql.plugin` para fazer com que o servidor o carregue em reinicializações subsequentes. Por essa razão, `INSTALL PLUGIN` requer o privilégio `INSERT` para a tabela `mysql.plugin`.

O nome base do arquivo de biblioteca de plugins depende da sua plataforma. Sufixos comuns são `.so` para sistemas Unix e Unix-like, `.dll` para Windows.

Exemplo: A opção `--plugin-load-add` instala um plugin na inicialização do servidor. Para instalar um plugin chamado `myplugin` a partir de um arquivo de biblioteca de plugins chamado `somepluglib.so`, use essas linhas em um arquivo `my.cnf`:

```
[mysqld]
plugin-load-add=myplugin=somepluglib.so
```

Neste caso, o plugin não está registrado na `mysql.plugin`. Reiniciar o servidor sem a opção `--plugin-load-add` faz com que o plugin não seja carregado na inicialização.

Alternativamente, a instrução `INSTALL PLUGIN` faz com que o servidor carregue o código do plugin a partir do arquivo de biblioteca em tempo de execução:

```
INSTALL PLUGIN myplugin SONAME 'somepluglib.so';
```

`INSTALL PLUGIN` também causa o registro permanente do plugin: O plugin está listado na tabela `mysql.plugin` para garantir que o servidor o carregue em reinicializações subsequentes.

Muitos plugins podem ser carregados tanto na inicialização do servidor quanto em tempo de execução. No entanto, se um plugin é projetado para ser carregado e inicializado durante a inicialização do servidor, tentativas de carregá-lo em tempo de execução usando `INSTALL PLUGIN` produzem um erro:

```
mysql> INSTALL PLUGIN myplugin SONAME 'somepluglib.so';
ERROR 1721 (HY000): Plugin 'myplugin' is marked as not dynamically
installable. You have to stop the server to install it.
```

Nota

`--early-plugin-load` está desatualizado e sujeito à remoção em uma versão futura do MySQL. Consulte a descrição desta opção para obter mais informações.

Neste caso, você deve usar `--plugin-load`, `--plugin-load-add` ou `--early-plugin-load`.

Se um plugin for nomeado tanto com a opção `--plugin-load`, `--plugin-load-add` ou `--early-plugin-load` e (como resultado de uma declaração anterior `INSTALL PLUGIN` na tabela `mysql.plugin`), o servidor inicia, mas escreve essas mensagens no log de erro:

```
[ERROR] Function 'plugin_name' already exists
[Warning] Couldn't load plugin named 'plugin_name'
with soname 'plugin_object_file'.
```

#### Controlando o Estado de Ativação do Plugin

Se o servidor souber sobre um plugin quando ele inicia (por exemplo, porque o plugin é nomeado com a opção `--plugin-load-add` ou está registrado na tabela `mysql.plugin`), o servidor carrega e habilita o plugin por padrão. É possível controlar o estado de ativação de um plugin usando a opção de inicialização `--plugin_name[=activation_state]`, onde *`plugin_name`* é o nome do plugin a ser afetado, como `innodb`, `csv` ou `validate_password`. Como com outras opções, hífens e sublinhados são intercambiáveis nos nomes das opções. Além disso, os valores do estado de ativação não são sensíveis ao caso. Por exemplo, `--my_plugin=ON` e `--my-plugin=on` são equivalentes.

* `--plugin_name=OFF`

  Diz ao servidor para desativar o plugin.

* `--plugin_name[=ON]`

  Diz ao servidor para habilitar o plugin. (Especificar a opção como `--plugin_name` sem um valor tem o mesmo efeito.) Se o plugin não conseguir se inicializar, o servidor é executado com o plugin desativado.

* `--plugin_name=FORCE`

  Diz ao servidor para habilitar o plugin, mas se a inicialização do plugin falhar, o servidor não inicia. Em outras palavras, essa opção força o servidor a ser executado com o plugin habilitado ou não no todo.

* `--plugin_name=FORCE_PLUS_PERMANENT`

  Como `FORCE`, mas além disso impede que o plugin seja descarregado em tempo de execução. Se um usuário tentar fazer isso com `UNINSTALL PLUGIN`, ocorre um erro.

Os estados de ativação do plugin são visíveis na coluna `LOAD_OPTION` da tabela `PLUGINS` do Schema de Informações.

Suponha que `CSV`, `BLACKHOLE` e `ARCHIVE` sejam motores de armazenamento plugáveis integrados e que você queira que o servidor os carregue ao inicializar, sob as seguintes condições: O servidor é permitido funcionar se a inicialização de `CSV` falhar, deve exigir que a inicialização de `BLACKHOLE` seja bem-sucedida e deve desabilitar `ARCHIVE`. Para isso, use essas linhas em um arquivo de opção:

```
[mysqld]
csv=ON
blackhole=FORCE
archive=OFF
```

O formato da opção `--enable-plugin_name` é sinônimo de `--plugin_name=ON`. Os formatos das opções `--disable-plugin_name` e `--skip-plugin_name` são sinônimos de `--plugin_name=OFF`.

Se um plugin for desativado, explicitamente com `OFF` ou implicitamente porque foi habilitado com `ON` mas não consegue se inicializar, aspectos da operação do servidor que requerem o plugin mudam. Por exemplo, se o plugin implementa um motor de armazenamento, as tabelas existentes para o motor de armazenamento tornam-se inacessíveis, e tentativas de criar novas tabelas para o motor de armazenamento resultam em tabelas que usam o motor de armazenamento padrão, a menos que o modo SQL `NO_ENGINE_SUBSTITUTION` seja habilitado para causar um erro em vez disso.

Desativar um plugin pode exigir ajustes em outras opções.

#### Desinstalação de Plugins

Em tempo de execução, a instrução `UNINSTALL PLUGIN` desabilita e desinstala um plugin conhecido pelo servidor. A instrução descarrega o plugin e o remove da tabela `mysql.plugin` do sistema, se estiver registrada lá. Por essa razão, a instrução `UNINSTALL PLUGIN` requer o privilégio `DELETE` para a tabela `mysql.plugin`. Com o plugin não mais registrado na tabela, o servidor não carrega o plugin durante reinicializações subsequentes.

`UNINSTALL PLUGIN` pode descarregar um plugin independentemente de ele ter sido carregado em tempo de execução com `INSTALL PLUGIN` ou ao inicializar com uma opção de carregamento de plugin, sob as seguintes condições:

* Não é possível desinstalar plugins que estão integrados ao servidor. Esses podem ser identificados como aqueles que têm um nome de biblioteca de `NULL` na saída da tabela do Schema de Informações `PLUGINS` ou `SHOW PLUGINS`.

* Não é possível desinstalar plugins para os quais o servidor foi iniciado com `--plugin_name=FORCE_PLUS_PERMANENT`, o que impede a desinstalação do plugin em tempo de execução. Esses podem ser identificados pela coluna `LOAD_OPTION` da tabela `PLUGINS`.

Para desinstalar um plugin que está atualmente carregado no início do servidor com uma opção de carregamento de plugin, use este procedimento.

1. Remova de arquivo `my.cnf` quaisquer opções e variáveis de sistema relacionadas ao plugin. Se alguma variável de sistema do plugin tiver sido persistente para o arquivo `mysqld-auto.cnf`, remova-as usando `RESET PERSIST var_name` para cada uma para removê-la.

2. Reinicie o servidor.
3. Normalmente, os plugins são instalados usando uma opção de carregamento de plugin no início ou com `INSTALL PLUGIN` em tempo de execução, mas não ambos. No entanto, remover opções de um plugin do arquivo `my.cnf` pode não ser suficiente para desinstá-lo se, em algum momento, `INSTALL PLUGIN` também tiver sido usado. Se o plugin ainda aparecer na saída de `PLUGINS` ou `SHOW PLUGINS`, use `UNINSTALL PLUGIN` para removê-lo da tabela `mysql.plugin`. Em seguida, reinicie o servidor novamente.

#### Plugins e Funções Carregáveis

Quando instalado, um plugin também pode instalar automaticamente funções carregáveis relacionadas. Se assim for, o plugin, quando desinstalado, também desinstala automaticamente essas funções.