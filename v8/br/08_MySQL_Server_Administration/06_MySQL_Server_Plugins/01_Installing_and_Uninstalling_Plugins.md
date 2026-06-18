### 7.6.1 Instalação e Desinstalação de Plugins

Os plugins do servidor devem ser carregados no servidor antes que possam ser usados. O MySQL suporta o carregamento de plugins durante o início e o funcionamento do servidor. Também é possível controlar o estado de ativação dos plugins carregados durante o início e descarregá-los durante o funcionamento.

Enquanto um plugin estiver carregado, as informações sobre ele estarão disponíveis conforme descrito na Seção 7.6.2, “Obtendo Informações do Plugin do Servidor”.

- Instalando plugins
- Controle do estado de ativação do plugin
- Desinstalação de plugins
- Plugins e Funções Carregáveis

#### Instalando plugins

Antes que um plugin de servidor possa ser usado, ele deve ser instalado usando um dos seguintes métodos. Nas descrições, `plugin_name` representa o nome do plugin, como `innodb`, `csv` ou `validate_password`.

- Plugins integrados
- Plugins registrados na tabela de sistema mysql.plugin
- Plugins com nomes que utilizam opções de linha de comando
- Plugins instalados com a declaração INSTALL PLUGIN

##### Plugins integrados

Um plugin embutido é conhecido automaticamente pelo servidor. Por padrão, o servidor habilita o plugin ao iniciar. Alguns plugins embutidos permitem que isso seja alterado com a opção `--plugin_name[=activation_state]`.

##### Plugins registrados na tabela de sistema mysql.plugin

A tabela do sistema `mysql.plugin` serve como um registro de plugins (exceto os plugins integrados, que não precisam ser registrados). Durante a sequência de inicialização normal, o servidor carrega os plugins registrados na tabela. Por padrão, para um plugin carregado a partir da tabela `mysql.plugin`, o servidor também habilita o plugin. Isso pode ser alterado com a opção `--plugin_name[=activation_state]`.

Se o servidor for iniciado com a opção `--skip-grant-tables`, os plugins registrados na tabela `mysql.plugin` não serão carregados e ficarão indisponíveis.

##### Plugins com nomes que utilizam opções de linha de comando

Um plugin localizado em um arquivo de biblioteca de plugins pode ser carregado na inicialização do servidor com as opções `--plugin-load`, `--plugin-load-add` ou `--early-plugin-load`. Normalmente, para um plugin carregado na inicialização, o servidor também habilita o plugin. Isso pode ser alterado com a opção `--plugin_name[=activation_state]`.

As opções `--plugin-load` e `--plugin-load-add` carregam plugins após os plugins integrados e os motores de armazenamento terem sido inicializados durante a sequência de inicialização do servidor. A opção `--early-plugin-load` é usada para carregar plugins que devem estar disponíveis antes da inicialização dos plugins integrados e dos motores de armazenamento.

O valor de cada opção de carregamento de plugin é uma lista separada por ponto e vírgula de valores de `plugin_library` e *`name``=`*`plugin_library`\*. Cada `plugin_library` é o nome de um arquivo de biblioteca que contém o código do plugin, e cada `name` é o nome de um plugin a ser carregado. Se uma biblioteca de plugin estiver nomeada sem nenhum nome de plugin anterior, o servidor carrega todos os plugins da biblioteca. Com um nome de plugin anterior, o servidor carrega apenas o plugin nomeado da biblioteca. O servidor procura por arquivos de biblioteca de plugins no diretório nomeado pela variável de sistema `plugin_dir`.

As opções de carregamento de plugins não registram nenhum plugin na tabela `mysql.plugin`. Para reinicializações subsequentes, o servidor carrega o plugin novamente apenas se `--plugin-load`, `--plugin-load-add` ou `--early-plugin-load` for fornecido novamente. Ou seja, a opção realiza uma operação de instalação de plugin única que persiste para uma única invocação do servidor.

`--plugin-load`, `--plugin-load-add` e `--early-plugin-load` permitem que os plugins sejam carregados mesmo quando `--skip-grant-tables` é fornecido (o que faz com que o servidor ignore a tabela `mysql.plugin`). `--plugin-load`, `--plugin-load-add` e `--early-plugin-load` também permitem que os plugins sejam carregados no início, que não podem ser carregados em tempo de execução.

A opção `--plugin-load-add` complementa a opção `--plugin-load`:

- Cada instância de `--plugin-load` reinicia o conjunto de plugins para serem carregados ao iniciar, enquanto `--plugin-load-add` adiciona um plugin ou plugins ao conjunto de plugins a serem carregados sem reiniciar o conjunto atual. Consequentemente, se forem especificadas múltiplas instâncias de `--plugin-load`, apenas a última se aplica. Com múltiplas instâncias de `--plugin-load-add`, todas elas se aplicam.

- O formato do argumento é o mesmo do `--plugin-load`, mas múltiplas instâncias do `--plugin-load-add` podem ser usadas para evitar a especificação de um grande conjunto de plugins como um único argumento `--plugin-load` longo e complicado.

- `--plugin-load-add` pode ser fornecido na ausência de `--plugin-load`, mas qualquer instância de `--plugin-load-add` que apareça antes de `--plugin-load` não terá efeito, pois `--plugin-load` redefini o conjunto de plugins a serem carregados.

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

##### Plugins instalados com a declaração INSTALL PLUGIN

Um plugin localizado em um arquivo de biblioteca de plugins pode ser carregado em tempo de execução com a instrução `INSTALL PLUGIN`. A instrução também registra o plugin na tabela `mysql.plugin` para fazer com que o servidor o carregue em reinicializações subsequentes. Por essa razão, `INSTALL PLUGIN` requer o privilégio `INSERT` para a tabela `mysql.plugin`.

O nome de base do arquivo da biblioteca de plugins depende da sua plataforma. Sufixos comuns são `.so` para sistemas Unix e Unix-like, e `.dll` para sistemas Windows.

Exemplo: A opção `--plugin-load-add` instala um plugin ao iniciar o servidor. Para instalar um plugin chamado `myplugin` a partir de um arquivo de biblioteca de plugins chamado `somepluglib.so`, use essas linhas em um arquivo `my.cnf`:

```
[mysqld]
plugin-load-add=myplugin=somepluglib.so
```

Neste caso, o plugin não está registrado em `mysql.plugin`. Reiniciar o servidor sem a opção `--plugin-load-add` faz com que o plugin não seja carregado ao iniciar.

Alternativamente, a declaração `INSTALL PLUGIN` faz com que o servidor carregue o código do plugin a partir do arquivo de biblioteca durante a execução:

```
INSTALL PLUGIN myplugin SONAME 'somepluglib.so';
```

O `INSTALL PLUGIN` também causa o registro permanente do plugin: o plugin é listado na tabela `mysql.plugin` para garantir que o servidor o carregue em reinicializações subsequentes.

Muitos plugins podem ser carregados tanto no início do servidor quanto durante o runtime. No entanto, se um plugin for projetado para ser carregado e inicializado durante o início do servidor, as tentativas de carregá-lo durante o runtime usando `INSTALL PLUGIN` produzem um erro:

```
mysql> INSTALL PLUGIN myplugin SONAME 'somepluglib.so';
ERROR 1721 (HY000): Plugin 'myplugin' is marked as not dynamically
installable. You have to stop the server to install it.
```

Nesse caso, você deve usar `--plugin-load`, `--plugin-load-add` ou `--early-plugin-load`.

Se um plugin for nomeado usando uma opção `--plugin-load`, `--plugin-load-add` ou `--early-plugin-load` e (como resultado de uma declaração anterior `INSTALL PLUGIN` na tabela `mysql.plugin`, o servidor começa, mas escreve essas mensagens no log de erro:

```
[ERROR] Function 'plugin_name' already exists
[Warning] Couldn't load plugin named 'plugin_name'
with soname 'plugin_object_file'.
```

#### Controle do estado de ativação do plugin

Se o servidor souber sobre um plugin quando ele for iniciado (por exemplo, porque o plugin é nomeado usando uma opção `--plugin-load-add` ou está registrado na tabela `mysql.plugin`, o servidor carrega e habilita o plugin por padrão. É possível controlar o estado de ativação para um plugin desse tipo usando uma opção de inicialização `--plugin_name[=activation_state]`, onde `plugin_name` é o nome do plugin a ser afetado, como `innodb`, `csv` ou `validate_password`. Como com outras opções, travessões e sublinhados são intercambiáveis nos nomes das opções. Além disso, os valores do estado de ativação não são sensíveis ao caso. Por exemplo, `--my_plugin=ON` e `--my-plugin=on` são equivalentes.

- `--plugin_name=OFF`

  Instrui o servidor a desativar o plugin. Isso pode não ser possível para certos plugins integrados, como `mysql_native_password`.

- `--plugin_name[=ON]`

  Instrui o servidor a habilitar o plugin. (Especificar a opção como `--plugin_name` sem um valor tem o mesmo efeito.) Se o plugin não conseguir se inicializar, o servidor será executado com o plugin desativado.

- `--plugin_name=FORCE`

  Diz ao servidor para habilitar o plugin, mas, se a inicialização do plugin falhar, o servidor não será iniciado. Em outras palavras, essa opção obriga o servidor a funcionar com o plugin habilitado ou

- `--plugin_name=FORCE_PLUS_PERMANENT`

  Como `FORCE`, mas, além disso, impede que o plugin seja descarregado durante a execução. Se um usuário tentar fazer isso com `UNINSTALL PLUGIN`, ocorrerá um erro.

Os estados de ativação do plugin são visíveis na coluna `LOAD_OPTION` da tabela do esquema de informações `PLUGINS`.

Suponha que `CSV`, `BLACKHOLE` e `ARCHIVE` sejam motores de armazenamento plugáveis integrados e que você queira que o servidor os carregue ao iniciar, sob as seguintes condições: O servidor é permitido funcionar se a inicialização de `CSV` falhar, deve exigir que a inicialização de `BLACKHOLE` seja bem-sucedida e deve desabilitar `ARCHIVE`. Para isso, use essas linhas em um arquivo de opção:

```
[mysqld]
csv=ON
blackhole=FORCE
archive=OFF
```

O formato da opção `--enable-plugin_name` é sinônimo de `--plugin_name=ON`. Os formatos das opções `--disable-plugin_name` e `--skip-plugin_name` são sinônimos de `--plugin_name=OFF`.

Se um plugin estiver desativado, seja explicitamente com `OFF` ou implicitamente porque foi ativado com `ON`, mas não consegue se inicializar, isso afetará aspectos da operação do servidor que exigem a alteração do plugin. Por exemplo, se o plugin implementar um mecanismo de armazenamento, as tabelas existentes para o mecanismo de armazenamento se tornarão inacessíveis, e tentativas de criar novas tabelas para o mecanismo de armazenamento resultarão em tabelas que usam o mecanismo de armazenamento padrão, a menos que o modo SQL `NO_ENGINE_SUBSTITUTION` seja ativado para causar um erro em vez disso.

Desativar um plugin pode exigir ajustes em outras opções. Por exemplo, se você iniciar o servidor usando `--skip-innodb` para desativar `InnoDB`, outras opções de `innodb_xxx` provavelmente também precisam ser omitidas durante o início. Além disso, como `InnoDB` é o motor de armazenamento padrão, ele não pode ser iniciado a menos que você especifique outro motor de armazenamento disponível com `--default_storage_engine`. Você também deve definir `--default_tmp_storage_engine`.

#### Desinstalação de plugins

Durante a execução, a instrução `UNINSTALL PLUGIN` desabilita e desinstala um plugin conhecido pelo servidor. A instrução descarrega o plugin e o remove da tabela do sistema `mysql.plugin`, se estiver registrada lá. Por essa razão, a instrução `UNINSTALL PLUGIN` requer o privilégio `DELETE` para a tabela `mysql.plugin`. Como o plugin não está mais registrado na tabela, o servidor não carrega o plugin durante reinicializações subsequentes.

`UNINSTALL PLUGIN` pode desativar um plugin, independentemente de ele ter sido carregado em tempo de execução com `INSTALL PLUGIN` ou ao iniciar com uma opção de carregamento de plugins, desde que essas condições sejam atendidas:

- Ele não pode descompactar plugins que estão integrados ao servidor. Esses plugins podem ser identificados como aqueles que têm um nome de biblioteca de `NULL` na saída da tabela do Schema de Informações `PLUGINS` ou `SHOW PLUGINS`.

- Não é possível desativar plugins para os quais o servidor foi iniciado com `--plugin_name=FORCE_PLUS_PERMANENT`, o que impede a desativação do plugin em tempo de execução. Esses plugins podem ser identificados na coluna `LOAD_OPTION` da tabela `PLUGINS`.

Para desinstalar um plugin que está carregado no momento do início do servidor com uma opção de carregamento de plugins, use este procedimento.

1. Remova das `my.cnf` qualquer opção e variáveis do sistema relacionadas ao plugin. Se houver variáveis do sistema do plugin persistidas no arquivo `mysqld-auto.cnf`, remova-as usando `RESET PERSIST var_name` para cada uma delas.

2. Reinicie o servidor.

3. Os plugins normalmente são instalados usando uma opção de carregamento de plugins na inicialização ou com `INSTALL PLUGIN` no tempo de execução, mas não ambos. No entanto, remover opções de um plugin do arquivo `my.cnf` pode não ser suficiente para desinstalá-lo se, em algum momento, `INSTALL PLUGIN` também tiver sido usado. Se o plugin ainda aparecer na saída de `PLUGINS` ou `SHOW PLUGINS`, use `UNINSTALL PLUGIN` para removê-lo da tabela `mysql.plugin`. Em seguida, reinicie o servidor novamente.

#### Plugins e Funções Carregáveis

Um plugin, quando instalado, pode também instalar automaticamente funções carregáveis relacionadas. Se assim for, o plugin, quando desinstalado, também desinstala automaticamente essas funções.
