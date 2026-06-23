## 7.6 Plugins do MySQL Server

O MySQL suporta uma API de plugin que permite a criação de plugins do servidor. Os plugins podem ser carregados na inicialização do servidor ou carregados e descarregados durante a execução sem a necessidade de reiniciar o servidor. Os plugins suportados por essa interface incluem, entre outros, motores de armazenamento, tabelas `INFORMATION_SCHEMA`, plugins de analisador de texto completo e extensões do servidor.

As distribuições do MySQL incluem vários plugins que implementam extensões de servidor:

* Plugins para autenticação de tentativas de conexão de clientes com o MySQL Server. Os plugins estão disponíveis para vários protocolos de autenticação. Veja a Seção 8.2.17, “Autenticação Plugável”.

* Um plugin de controle de conexão que permite que os administradores introduzam um atraso crescente após um certo número de tentativas consecutivas de conexão de cliente falha. Veja a Seção 8.4.2, “Plugins de Controle de Conexão”.

* Um plugin de validação de senha implementa políticas de força de senha e avalia a força das senhas potenciais. Veja a Seção 8.4.3, “O componente de validação de senha”.

* Os plugins de replicação semiescronizada implementam uma interface para as capacidades de replicação que permitem que a fonte prossiga enquanto pelo menos uma réplica responder a cada transação. Veja a Seção 19.4.10, “Replicação semiescronizada”.

* A Replicação em Grupo permite que você crie um serviço MySQL altamente disponível distribuído em um grupo de instâncias do servidor MySQL, com consistência de dados, detecção e resolução de conflitos e serviços de participação em grupo, tudo integrado. Veja o Capítulo 20, *Replicação em Grupo*.

* A Edição Empresarial do MySQL inclui um plugin de pool de threads que gerencia os threads de conexão para aumentar o desempenho do servidor, gerenciando eficientemente os threads de execução de instruções para um grande número de conexões de clientes. Veja a Seção 7.6.3, “MySQL Enterprise Thread Pool”.

* A Edição Empresarial do MySQL inclui um plugin de auditoria para monitoramento e registro de atividade de conexão e consulta. Veja a Seção 8.4.5, “Auditoria Empresarial do MySQL”.

* A Edição Empresarial do MySQL inclui um plugin de firewall que implementa um firewall de nível de aplicação para permitir que os administradores de banco de dados permitam ou negam a execução de declarações SQL com base na correspondência com listas de padrões de declarações aceitos. Veja a Seção 8.4.7, “Firewall Empresarial do MySQL”.

* Os plugins de reescrita de consultas examinam as declarações recebidas pelo MySQL Server e, possivelmente, as reescrevem antes de o servidor executá-las. Veja a Seção 7.6.4, “O plugin de reescrita de consultas reescritor”, e a Seção 7.6.5, “O plugin ddl_rewriter”.

* Tokens de versão permite a criação e sincronização em torno de tokens do servidor que as aplicações podem usar para evitar o acesso a dados incorretos ou desatualizados. Os Tokens de versão são baseados em uma biblioteca de plugins que implementa um plugin `version_tokens` e um conjunto de funções carregáveis. Veja a Seção 7.6.6, “Tokens de versão”.

* Os plugins de cartela de identificação fornecem armazenamento seguro para informações sensíveis. Veja a Seção 8.4.4, “O Keyring do MySQL”.

Em MySQL 8.0.24, o MySQL Keyring começou a transição de plugins para usar a infraestrutura do componente, facilitada pelo plugin chamado `daemon_keyring_proxy_plugin` que atua como uma ponte entre as APIs do plugin e do serviço de componente. Veja a Seção 7.6.8, “O Plugin de Ponte do Proxy Keyring”.

* O X Plugin estende o MySQL Server para que ele possa funcionar como um banco de documentos. Executar o X Plugin permite que o MySQL Server comunique-se com clientes usando o Protocolo X, que foi projetado para expor as capacidades de armazenamento compatíveis com ACID do MySQL como um banco de documentos. Veja a Seção 22.5, “X Plugin”.

* O clone permite a clonagem dos dados `InnoDB` de uma instância local ou remota do servidor MySQL. Veja a Seção 7.6.7, “O Plugin Clone”.

* Os plugins de teste de servidores de serviços de rede testam os serviços do servidor. Para informações sobre esses plugins, consulte a seção Plugins para Serviços de Plugin de Teste da documentação do MySQL Server Doxygen, disponível em https://dev.mysql.com/doc/index-other.html.

As seções a seguir descrevem como instalar e desinstalar plugins, e como determinar em tempo de execução quais plugins estão instalados e obter informações sobre eles. Para informações sobre a escrita de plugins, consulte a API do Plugin MySQL.

### 7.6.1 Instalar e Desinstalar Plugins

Os plugins do servidor devem ser carregados no servidor antes que possam ser usados. O MySQL suporta o carregamento de plugins no início e no runtime do servidor. Também é possível controlar o estado de ativação dos plugins carregados no início e descarregá-los no runtime.

Enquanto um plugin estiver carregado, as informações sobre ele estarão disponíveis conforme descrito na Seção 7.6.2, “Obtenção de Informações do Plugin do Servidor”.

* Instalar plugins
* Controlar o estado de ativação do plugin
* Desinstalar plugins
* Plugins e funções carregáveis

#### Instalação de Plugins

Antes que um plugin de servidor possa ser usado, ele deve ser instalado usando um dos seguintes métodos. Nas descrições, *`plugin_name`* representa um nome de plugin, como `innodb`, `csv` ou `validate_password`.

* Plugins embutidos
* Plugins registrados na tabela de sistema mysql.plugin
* Plugins com nomes com opções de linha de comando
* Plugins instalados com a declaração de INSTALAR PLUGIN

##### Plugins integrados

Um plugin embutido é conhecido automaticamente pelo servidor. Por padrão, o servidor habilita o plugin na inicialização. Alguns plugins embutidos permitem que isso seja alterado com a opção `--plugin_name[=activation_state]`.

##### Plugins registrados na tabela de sistema mysql.plugin

A tabela do sistema `mysql.plugin` serve como um registro de plugins (outros que não os plugins embutidos, que não precisam ser registrados). Durante a sequência normal de inicialização, o servidor carrega os plugins registrados na tabela. Por padrão, para um plugin carregado a partir da tabela `mysql.plugin`, o servidor também habilita o plugin. Isso pode ser alterado com a opção `--plugin_name[=activation_state]`.

Se o servidor for iniciado com a opção `--skip-grant-tables`, os plugins registrados na tabela `mysql.plugin` não são carregados e ficam indisponíveis.

##### Plugins com nomes com opções de linha de comando

Um plugin localizado em um arquivo de biblioteca de plugins pode ser carregado na inicialização do servidor com as opções `--plugin-load`, `--plugin-load-add` ou `--early-plugin-load`. Normalmente, para um plugin carregado na inicialização, o servidor também habilita o plugin. Isso pode ser alterado com a opção `--plugin_name[=activation_state]`.

As opções `--plugin-load` e `--plugin-load-add` carregam plugins após os plugins e motores de armazenamento integrados terem sido inicializados durante a sequência de inicialização do servidor. A opção `--early-plugin-load` é usada para carregar plugins que devem estar disponíveis antes da inicialização dos plugins e motores de armazenamento integrados.

O valor de cada opção de carregamento de plugin é uma lista separada por ponto e vírgula de *`plugin_library`* e *`name`*`=`*`plugin_library`* valores. Cada *`plugin_library`* é o nome de um arquivo de biblioteca que contém código de plugin, e cada *`name`* é o nome de um plugin a ser carregado. Se uma biblioteca de plugin é nomeada sem qualquer nome de plugin anterior, o servidor carrega todos os plugins na biblioteca. Com um nome de plugin anterior, o servidor carrega apenas o plugin nomeado da biblioteca. O servidor procura arquivos de biblioteca de plugin no diretório nomeado pela variável de sistema `plugin_dir`.

As opções de carregamento de plugins não registram nenhum plugin na tabela `mysql.plugin`. Para reinicializações subsequentes, o servidor carrega o plugin novamente apenas se `--plugin-load`, `--plugin-load-add` ou `--early-plugin-load` for fornecido novamente. Isso significa que a opção produz uma operação de instalação de plugin única que persiste para uma única invocação do servidor.

`--plugin-load`, `--plugin-load-add` e `--early-plugin-load` permitem que plugins sejam carregados mesmo quando `--skip-grant-tables` é fornecido (o que faz com que o servidor ignore a tabela `mysql.plugin`). `--plugin-load`, `--plugin-load-add` e `--early-plugin-load` também permitem que plugins sejam carregados no início, que não podem ser carregados no tempo real.

A opção `--plugin-load-add` complementa a opção `--plugin-load`:

* Cada instância de `--plugin-load` redefiniu o conjunto de plugins a serem carregados ao iniciar, enquanto `--plugin-load-add` adiciona um plugin ou plugins ao conjunto de plugins a serem carregados sem redefinir o conjunto atual. Consequentemente, se forem especificadas várias instâncias de `--plugin-load`, apenas a última se aplica. Com várias instâncias de `--plugin-load-add`, todas elas se aplicam.

* O formato do argumento é o mesmo que para `--plugin-load`, mas múltiplas instâncias de `--plugin-load-add` podem ser usadas para evitar especificar um grande conjunto de plugins como um único argumento `--plugin-load` longo e complicado.

* `--plugin-load-add` pode ser dado na ausência de `--plugin-load`, mas qualquer instância de `--plugin-load-add` que apareça antes de `--plugin-load` não tem efeito porque `--plugin-load` redefiniu o conjunto de plugins a serem carregados.

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

##### Plugins instalados com a declaração de INSTALAR PLUGIN

Um plugin localizado em um arquivo de biblioteca de plugins pode ser carregado em tempo de execução com a declaração `INSTALL PLUGIN`. A declaração também registra o plugin na tabela `mysql.plugin` para fazer com que o servidor o carregue em reinicializações subsequentes. Por essa razão, `INSTALL PLUGIN` requer o privilégio `INSERT` para a tabela `mysql.plugin`.

O nome de arquivo da biblioteca de plugins depende da sua plataforma. Sufixos comuns são `.so` para sistemas Unix e Unix-like, `.dll` para Windows.

Exemplo: A opção `--plugin-load-add` instala um plugin no início da inicialização do servidor. Para instalar um plugin chamado `myplugin` a partir de um arquivo de biblioteca de plugins chamado `somepluglib.so`, use essas linhas em um arquivo `my.cnf`:

```
[mysqld]
plugin-load-add=myplugin=somepluglib.so
```

Neste caso, o plugin não está registrado em `mysql.plugin`. Reiniciar o servidor sem a opção `--plugin-load-add` faz com que o plugin não seja carregado no início.

Alternativamente, a declaração `INSTALL PLUGIN` faz com que o servidor carregue o código do plugin a partir do arquivo da biblioteca no momento da execução:

```
INSTALL PLUGIN myplugin SONAME 'somepluglib.so';
```

`INSTALL PLUGIN` também causa o registro de plugin "permanente": O plugin está listado na tabela `mysql.plugin` para garantir que o servidor o carregue em reinicializações subsequentes.

Muitos plugins podem ser carregados tanto no início do servidor quanto no runtime. No entanto, se um plugin for projetado de tal forma que ele deva ser carregado e inicializado durante o início do servidor, as tentativas de carregá-lo no runtime usando `INSTALL PLUGIN`[(install-plugin.html "15.7.4.4 INSTALL PLUGIN Statement") produzem um erro:

```
mysql> INSTALL PLUGIN myplugin SONAME 'somepluglib.so';
ERROR 1721 (HY000): Plugin 'myplugin' is marked as not dynamically
installable. You have to stop the server to install it.
```

Neste caso, você deve usar `--plugin-load`, `--plugin-load-add` ou `--early-plugin-load`.

Se um plugin for nomeado tanto usando uma opção `--plugin-load`, `--plugin-load-add` ou `--early-plugin-load` e (como resultado de uma declaração anterior `INSTALL PLUGIN`(install-plugin.html "15.7.4.4 INSTALL PLUGIN Statement") na tabela `mysql.plugin`, o servidor começa, mas escreve essas mensagens no log de erro:

```
[ERROR] Function 'plugin_name' already exists
[Warning] Couldn't load plugin named 'plugin_name'
with soname 'plugin_object_file'.
```

#### Controle do estado de ativação do plugin

Se o servidor souber sobre um plugin quando ele é iniciado (por exemplo, porque o plugin é nomeado usando uma opção `--plugin-load-add` ou está registrado na tabela `mysql.plugin`, o servidor carrega e habilita o plugin por padrão. É possível controlar o estado de ativação para um plugin desse tipo usando uma opção de inicialização `--plugin_name[=activation_state]`, onde *`plugin_name`* é o nome do plugin que será afetado, como `innodb`, `csv` ou `validate_password`. Como com outras opções, travessões e sublinhados são intercambiáveis nos nomes das opções. Além disso, os valores do estado de ativação não são sensíveis ao caso. Por exemplo, `--my_plugin=ON` e `--my-plugin=on` são equivalentes.

* `--plugin_name=OFF`

Diz ao servidor para desativar o plugin. Isso pode não ser possível para certos plugins integrados, como `mysql_native_password`.

* `--plugin_name[=ON]`

Informe ao servidor para habilitar o plugin. (Especificar a opção como `--plugin_name` sem um valor tem o mesmo efeito.) Se o plugin não conseguir ser inicializado, o servidor é executado com o plugin desativado.

* `--plugin_name=FORCE`

Diz ao servidor para habilitar o plugin, mas, se a inicialização do plugin falhar, o servidor não será iniciado. Em outras palavras, esta opção obriga o servidor a funcionar com o plugin habilitado ou não, de forma alguma.

* `--plugin_name=FORCE_PLUS_PERMANENT`

Como `FORCE`, mas, além disso, impede que o plugin seja descarregado durante a execução. Se um usuário tentar fazer isso com `UNINSTALL PLUGIN`, ocorre um erro.

Os estados de ativação do plugin são visíveis na coluna `LOAD_OPTION` da tabela do Esquema de Informações `PLUGINS`.

Suponha que `CSV`, `BLACKHOLE` e `ARCHIVE` sejam motores de armazenamento plugáveis integrados e que você queira que o servidor os carregue no início, sujeito a essas condições: O servidor é permitido funcionar se a inicialização de `CSV` falhar, deve exigir que a inicialização de `BLACKHOLE` seja bem-sucedida e deve desabilitar `ARCHIVE`. Para isso, use essas linhas em um arquivo de opção:

```
[mysqld]
csv=ON
blackhole=FORCE
archive=OFF
```

O formato de opção `--enable-plugin_name` é sinônimo de `--plugin_name=ON`. Os formatos de opção `--disable-plugin_name` e `--skip-plugin_name` são sinônimos de `--plugin_name=OFF`.

Se um plugin for desativado, explicitamente com `OFF` ou implicitamente porque foi habilitado com `ON`, mas não consegue ser inicializado, aspectos da operação do servidor que exigem a mudança do plugin. Por exemplo, se o plugin implementa um mecanismo de armazenamento, as tabelas existentes para o mecanismo de armazenamento se tornam inacessíveis, e as tentativas de criar novas tabelas para o mecanismo de armazenamento resultam em tabelas que usam o mecanismo de armazenamento padrão, a menos que o modo SQL `NO_ENGINE_SUBSTITUTION` seja habilitado para causar um erro em vez disso.

Desativar um plugin pode exigir ajustes em outras opções. Por exemplo, se você iniciar o servidor usando `--skip-innodb` para desativar `InnoDB`, outras opções de `innodb_xxx` provavelmente também precisarão ser omitidas na inicialização. Além disso, como `InnoDB` é o motor de armazenamento padrão, ele não pode ser iniciado a menos que você especifique outro motor de armazenamento disponível com `--default_storage_engine`. Você também deve definir `--default_tmp_storage_engine`.

#### Desinstalando plugins

No momento da execução, a declaração `UNINSTALL PLUGIN` desabilita e desinstala um plugin conhecido pelo servidor. A declaração descarrega o plugin e o remove da tabela do sistema `mysql.plugin`, se estiver registrada lá. Por esse motivo, a declaração `UNINSTALL PLUGIN` requer o privilégio `DELETE` para a tabela `mysql.plugin`. Com o plugin não mais registrado na tabela, o servidor não carrega o plugin durante os reinícios subsequentes.

`UNINSTALL PLUGIN` pode descarregar um plugin, independentemente de ter sido carregado em tempo de execução com `INSTALL PLUGIN` ou na inicialização com uma opção de carregamento de plugin, sujeito a estas condições:

* Não pode descarregar plugins que são construídos no servidor. Esses podem ser identificados como aqueles que têm um nome de biblioteca de `NULL` na saída da tabela do Esquema de Informação `PLUGINS` ou `SHOW PLUGINS`.

* Não pode descarregar plugins para os quais o servidor foi iniciado com `--plugin_name=FORCE_PLUS_PERMANENT`, o que impede a descarregamento do plugin em tempo de execução. Esses plugins podem ser identificados a partir da coluna `LOAD_OPTION` da tabela `PLUGINS`.

Para desinstalar um plugin que atualmente é carregado na inicialização do servidor com uma opção de carregamento de plugin, use este procedimento.

1. Remova das opções e das variáveis do sistema relacionadas ao plugin do arquivo `my.cnf`. Se houver variáveis do sistema do plugin persistidas no arquivo `mysqld-auto.cnf`, remova-as usando [`RESET PERSIST var_name`](reset-persist.html "15.7.8.7 RESET PERSIST Statement") para cada uma delas.

2. Reinicie o servidor.
3. Os plugins normalmente são instalados usando uma opção de carregamento de plugins na inicialização ou com `INSTALL PLUGIN` (install-plugin.html "15.7.4.4 INSTALL PLUGIN Statement") no runtime, mas não ambos. No entanto, remover opções de um plugin do arquivo `my.cnf` pode não ser suficiente para desinstalá-lo se, em algum momento, `INSTALL PLUGIN` também tiver sido usado. Se o plugin ainda aparecer na saída do `PLUGINS` ou `SHOW PLUGINS`, use `UNINSTALL PLUGIN` para removê-lo da tabela [[`mysql.plugin`]. Em seguida, reinicie o servidor novamente.

#### Plugins e Funções Carregáveis

Um plugin, quando instalado, também pode instalar automaticamente funções relacionadas. Se assim for, o plugin, quando desinstalado, também desinstala automaticamente essas funções.

### 7.6.2 Obter informações sobre o plugin do servidor

Existem várias maneiras de determinar quais plugins estão instalados no servidor:

* A tabela do esquema de informações `PLUGINS` contém uma linha para cada plugin carregado. Qualquer um que tenha um valor `PLUGIN_LIBRARY` de `NULL` é incorporado e não pode ser descarregado.

  ```
  mysql> SELECT * FROM INFORMATION_SCHEMA.PLUGINS\G
  *************************** 1. row ***************************
             PLUGIN_NAME: binlog
          PLUGIN_VERSION: 1.0
           PLUGIN_STATUS: ACTIVE
             PLUGIN_TYPE: STORAGE ENGINE
     PLUGIN_TYPE_VERSION: 50158.0
          PLUGIN_LIBRARY: NULL
  PLUGIN_LIBRARY_VERSION: NULL
           PLUGIN_AUTHOR: Oracle Corporation
      PLUGIN_DESCRIPTION: This is a pseudo storage engine to represent the binlog in a transaction
          PLUGIN_LICENSE: GPL
             LOAD_OPTION: FORCE
  ...
  *************************** 10. row ***************************
             PLUGIN_NAME: InnoDB
          PLUGIN_VERSION: 1.0
           PLUGIN_STATUS: ACTIVE
             PLUGIN_TYPE: STORAGE ENGINE
     PLUGIN_TYPE_VERSION: 50158.0
          PLUGIN_LIBRARY: ha_innodb_plugin.so
  PLUGIN_LIBRARY_VERSION: 1.0
           PLUGIN_AUTHOR: Oracle Corporation
      PLUGIN_DESCRIPTION: Supports transactions, row-level locking,
                          and foreign keys
          PLUGIN_LICENSE: GPL
             LOAD_OPTION: ON
  ...
  ```

* A declaração `SHOW PLUGINS` exibe uma linha para cada plugin carregado. Qualquer um que tenha um valor `Library` de `NULL` é construído e não pode ser descarregado.

  ```
  mysql> SHOW PLUGINS\G
  *************************** 1. row ***************************
     Name: binlog
   Status: ACTIVE
     Type: STORAGE ENGINE
  Library: NULL
  License: GPL
  ...
  *************************** 10. row ***************************
     Name: InnoDB
   Status: ACTIVE
     Type: STORAGE ENGINE
  Library: ha_innodb_plugin.so
  License: GPL
  ...
  ```

* A tabela `mysql.plugin` mostra quais plugins foram registrados com `INSTALL PLUGIN`(install-plugin.html "15.7.4.4 INSTALL PLUGIN Statement"). A tabela contém apenas nomes de plugins e nomes de arquivos de biblioteca, portanto, não fornece tanta informação quanto a tabela `PLUGINS` ou a declaração `SHOW PLUGINS`.

### 7.6.3 Piscina de Fuso de Tarefas da MySQL Enterprise

Nota

O MySQL Enterprise Thread Pool é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para saber mais sobre produtos comerciais, <https://www.mysql.com/products/>.

A Edição Empresarial do MySQL inclui o MySQL Enterprise Thread Pool, implementado usando um plugin de servidor. O modelo padrão de manipulação de threads no MySQL Server executa instruções usando um thread por conexão de cliente. À medida que mais clientes se conectam ao servidor e executam instruções, o desempenho geral se degrada. O plugin de pool de threads fornece um modelo alternativo de manipulação de threads projetado para reduzir o custo e melhorar o desempenho. O plugin implementa um pool de threads que aumenta o desempenho do servidor, gerenciando eficientemente os threads de execução de instruções para um grande número de conexões de clientes.

O pool de threads resolve vários problemas do modelo que usa uma thread por conexão:

* Muitas pilhas de fios tornam os caches da CPU quase inúteis em cargas de trabalho de execução altamente paralelas. O pool de fios promove a reutilização da pilha de fios para minimizar a pegada do cache da CPU.

* Com muitos fios executando em paralelo, o custo de alternância de contexto é alto. Isso também apresenta um desafio para o planejador do sistema operacional. O grupo de fios controla o número de fios ativos para manter o paralelismo dentro do servidor MySQL em um nível que ele pode lidar e que é apropriado para o host do servidor no qual o MySQL está sendo executado.

* Muitas transações executando em paralelo aumentam a disputa por recursos. Em `InnoDB`, isso aumenta o tempo gasto mantendo mutxes centrais. O grupo de threads controla quando as transações começam para garantir que não sejam executadas em paralelo demasiadas.

#### Recursos adicionais

Seção A.15, “Perguntas frequentes sobre o MySQL 8.0: MySQL Enterprise Thread Pool”

#### 7.6.3.1 Elementos do Pool de Fios

O MySQL Enterprise Thread Pool compreende esses elementos:

* Um arquivo de biblioteca de plugins implementa um plugin para o código do pool de threads, além de várias tabelas de monitoramento associadas que fornecem informações sobre a operação do pool de threads:

+ A partir do MySQL 8.0.14, as tabelas de monitoramento são as tabelas do Gerenciador de desempenho; veja a Seção 29.12.16, “Tabelas do Pool de Threads do Gerenciador de desempenho”.

+ Antes do MySQL 8.0.14, as tabelas de monitoramento são as tabelas `INFORMATION_SCHEMA`; veja a Seção 28.5, “Tabelas do Pool de Spool de Informação”.

As tabelas `INFORMATION_SCHEMA` já estão desatualizadas; espera-se que elas sejam removidas em uma versão futura do MySQL. As aplicações devem migrar para as tabelas do Gerador de Desempenho, em vez das tabelas `INFORMATION_SCHEMA`. Por exemplo, se uma aplicação usa esta consulta:

    ```
    SELECT * FROM INFORMATION_SCHEMA.TP_THREAD_STATE;
    ```

O aplicativo deve usar essa consulta em vez disso:

    ```
    SELECT * FROM performance_schema.tp_thread_state;
    ```

Nota

Se você não carregar todas as tabelas de monitoramento, alguns ou todos os gráficos do pool de threads do MySQL Enterprise Monitor podem ficar vazios.

Para uma descrição detalhada de como o pool de threads funciona, consulte a Seção 7.6.3.3, “Operação do Pool de Threads”.

* Várias variáveis do sistema estão relacionadas ao pool de threads. A variável de sistema `thread_handling` tem um valor de `loaded-dynamically` quando o servidor carrega com sucesso o plugin do pool de threads.

As outras variáveis relacionadas ao sistema são implementadas pelo plugin de pool de threads e não estão disponíveis a menos que este seja ativado. Para informações sobre o uso dessas variáveis, consulte a Seção 7.6.3.3, “Operação do Pool de Threads”, e a Seção 7.6.3.4, “Ajuste do Pool de Threads”.

* O Schema de Desempenho possui instrumentos que exibem informações sobre o pool de threads e podem ser usados para investigar o desempenho operacional. Para identificá-los, use esta consulta:

  ```
  SELECT * FROM performance_schema.setup_instruments
  WHERE NAME LIKE '%thread_pool%';
  ```

Para mais informações, consulte o Capítulo 29, *MySQL Performance Schema*.

#### 7.6.3.2 Instalação do Pool de Fios

Esta seção descreve como instalar o MySQL Enterprise Thread Pool. Para informações gerais sobre a instalação de plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

Para ser utilizável pelo servidor, o arquivo da biblioteca de plugins deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin, definindo o valor de `plugin_dir` na inicialização do servidor.

O nome de arquivo da biblioteca de plugins é `thread_pool`. O sufixo do nome do arquivo difere de acordo com a plataforma (por exemplo, `.so` para Unix e sistemas Unix-like, `.dll` para Windows).

* Instalação do Pool de Fios a partir do MySQL 8.0.14
* Instalação do Pool de Fios antes do MySQL 8.0.14

##### Instalação do Pool de Fios a partir do MySQL 8.0.14

Em MySQL 8.0.14 e versões posteriores, as tabelas de monitoramento do pool de threads são tabelas do Gerenciador de desempenho que são carregadas e descarregadas juntamente com o plugin do pool de threads. As versões `INFORMATION_SCHEMA` das tabelas são desatualizadas, mas ainda disponíveis; elas são instaladas conforme as instruções na Instalação do pool de threads antes do MySQL 8.0.14.

Para habilitar a capacidade de pool de threads, carregue o plugin iniciando o servidor com a opção `--plugin-load-add`. Para isso, coloque essas linhas no arquivo do servidor `my.cnf`, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
[mysqld]
plugin-load-add=thread_pool.so
```

Para verificar a instalação do plugin, examine a tabela Schema de Informações `PLUGINS` ou use a declaração `SHOW PLUGINS` (consulte Seção 7.6.2, “Obtenção de Informações do Plugin do Servidor”). Por exemplo:

```
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE 'thread%';
+-----------------------+---------------+
| PLUGIN_NAME           | PLUGIN_STATUS |
+-----------------------+---------------+
| thread_pool           | ACTIVE        |
+-----------------------+---------------+
```

Para verificar se as tabelas de monitoramento do Schema de Desempenho estão disponíveis, examine a tabela do Schema de Informações `TABLES` ou use a declaração `SHOW TABLES`. Por exemplo:

```
mysql> SELECT TABLE_NAME
       FROM INFORMATION_SCHEMA.TABLES
       WHERE TABLE_SCHEMA = 'performance_schema'
       AND TABLE_NAME LIKE 'tp%';
+-----------------------+
| TABLE_NAME            |
+-----------------------+
| tp_thread_group_state |
| tp_thread_group_stats |
| tp_thread_state       |
+-----------------------+
```

Se o servidor carregar o plugin do pool de threads com sucesso, ele define a variável de sistema `thread_handling` para `loaded-dynamically`.

Se o plugin não conseguir se inicializar, verifique o log de erro do servidor em busca de mensagens de diagnóstico.

##### Instalação do Pool de Fios Antes do MySQL 8.0.14

Antes do MySQL 8.0.14, as tabelas de monitoramento do pool de threads são plugins separados do plugin de pool de threads e podem ser instalados separadamente.

Para habilitar a capacidade de pool de threads, carregue os plugins que serão usados, iniciando o servidor com a opção `--plugin-load-add`. Por exemplo, se você nomear apenas o arquivo da biblioteca de plugins, o servidor carregará todos os plugins que ele contém (ou seja, o plugin de pool de threads e todas as tabelas `INFORMATION_SCHEMA`). Para fazer isso, coloque essas linhas no arquivo `my.cnf` do servidor, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
[mysqld]
plugin-load-add=thread_pool.so
```

Isso é equivalente a carregar todos os plugins do pool de threads, nomeando-os individualmente:

```
[mysqld]
plugin-load-add=thread_pool=thread_pool.so
plugin-load-add=tp_thread_state=thread_pool.so
plugin-load-add=tp_thread_group_state=thread_pool.so
plugin-load-add=tp_thread_group_stats=thread_pool.so
```

Se desejar, pode carregar plugins individuais a partir do arquivo da biblioteca. Para carregar o plugin de pool de threads, mas não as tabelas `INFORMATION_SCHEMA`, use uma opção como esta:

```
[mysqld]
plugin-load-add=thread_pool=thread_pool.so
```

Para carregar o plugin de pilha de threads e apenas a tabela `TP_THREAD_STATE` `INFORMATION_SCHEMA`, use opções como esta:

```
[mysqld]
plugin-load-add=thread_pool=thread_pool.so
plugin-load-add=tp_thread_state=thread_pool.so
```

Para verificar a instalação do plugin, examine a tabela Schema de Informações `PLUGINS` ou use a declaração `SHOW PLUGINS` (consulte Seção 7.6.2, “Obtenção de Informações do Plugin do Servidor”). Por exemplo:

```
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE 'thread%' OR PLUGIN_NAME LIKE 'tp%';
+-----------------------+---------------+
| PLUGIN_NAME           | PLUGIN_STATUS |
+-----------------------+---------------+
| thread_pool           | ACTIVE        |
| TP_THREAD_STATE       | ACTIVE        |
| TP_THREAD_GROUP_STATE | ACTIVE        |
| TP_THREAD_GROUP_STATS | ACTIVE        |
+-----------------------+---------------+
```

Se o servidor carregar o plugin do pool de threads com sucesso, ele define a variável de sistema `thread_handling` para `loaded-dynamically`.

Se um plugin não conseguir se inicializar, verifique o log de erro do servidor em busca de mensagens de diagnóstico.

#### 7.6.3.3 Operação do Pool de Fios

O pool de threads consiste em vários grupos de threads, cada um dos quais gerencia um conjunto de conexões de cliente. À medida que as conexões são estabelecidas, o pool de threads as atribui aos grupos de threads de forma round-robin.

O pool de fios exibe variáveis do sistema que podem ser usadas para configurar sua operação:

* `thread_pool_algorithm`: O algoritmo de concorrência a ser utilizado para a programação.

* `thread_pool_dedicated_listeners`: Dedica um fio de escuta em cada grupo de fios para ouvir declarações recebidas de conexões atribuídas ao grupo.

* `thread_pool_high_priority_connection`: Como agendar a execução de uma declaração para uma sessão.

* `thread_pool_max_active_query_threads`: Quantos tópicos ativos por grupo permitir.

* `thread_pool_max_transactions_limit`: O número máximo de transações permitidas pelo plugin de pool de threads.

* `thread_pool_max_unused_threads`: Quantos fios de sono permitir.

* `thread_pool_prio_kickup_timer`: Quanto tempo antes o pool de threads move uma declaração aguardando execução da fila de baixa prioridade para a fila de alta prioridade.

* `thread_pool_query_threads_per_group`: O número de threads de consulta permitidas em um grupo de threads (o padrão é uma única thread de consulta). Considere aumentar o valor se você experimentar tempos de resposta mais lentos devido a transações de longa duração.

* `thread_pool_size`: O número de grupos de fios no conjunto de fios. Este é o parâmetro mais importante que controla o desempenho do conjunto de fios.

* `thread_pool_stall_limit`: O tempo antes de uma declaração de execução é considerado parado.

* `thread_pool_transaction_delay`: O período de atraso antes de iniciar uma nova transação.

Para configurar o número de grupos de threads, use a variável de sistema `thread_pool_size`. O número padrão de grupos é 16. Para obter orientações sobre como definir essa variável, consulte a Seção 7.6.3.4, “Ajustes do Pool de Threads”.

O número máximo de threads por grupo é de 4096 (ou 4095 em alguns sistemas onde uma thread é usada internamente).

O pool de fios separa conexões e fios, portanto, não há uma relação fixa entre conexões e os fios que executam as declarações recebidas dessas conexões. Isso difere do modelo padrão de manipulação de fios que associa um fio a uma conexão, de modo que um determinado fio executa todas as declarações de sua conexão.

Por padrão, o grupo de threads tenta garantir um máximo de uma thread em execução em cada grupo a qualquer momento, mas, às vezes, permite que mais threads sejam executadas temporariamente para obter o melhor desempenho:

* Cada grupo de fios tem um fio de ouvinte que escuta as declarações recebidas das conexões atribuídas ao grupo. Quando uma declaração chega, o grupo de fios ou executa imediatamente, ou coloca-a em fila para execução posterior:

A execução imediata ocorre se a declaração for a única que é recebida e não houver declarações em fila ou que estejam sendo executadas no momento.

A partir do MySQL 8.0.31, a execução imediata pode ser adiada configurando `thread_pool_transaction_delay`, que tem um efeito de controle sobre as transações. Para mais informações, consulte a descrição desta variável na discussão a seguir.

O acúmulo de tarefas ocorre se a instrução não puder começar a ser executada imediatamente devido a tarefas em fila ou em execução simultânea.

* A variável `thread_pool_transaction_delay` especifica um atraso de transação em milissegundos. Os threads do trabalhador dormem pelo período especificado antes de executar uma nova transação.

Um atraso de transação pode ser usado em casos em que transações paralelas afetam o desempenho de outras operações devido a contenção de recursos. Por exemplo, se transações paralelas afetam a criação de índices ou uma operação de redimensionamento de um buffer online, você pode configurar um atraso de transação para reduzir a contenção de recursos enquanto essas operações estão em execução. O atraso tem um efeito de controle sobre as transações.

O ajuste `thread_pool_transaction_delay` não afeta as consultas emitidas a partir de uma conexão privilegiada (uma conexão atribuída ao grupo de threads `Admin`). Essas consultas não estão sujeitas a um atraso de transação configurado.

* Se a execução imediata ocorrer, o thread de escuta a executa. (Isso significa que, temporariamente, nenhum thread do grupo está ouvindo.) Se a declaração terminar rapidamente, o thread executando retorna para ouvir declarações. Caso contrário, o pool de threads considera a declaração como travada e inicia outro thread como um thread de escuta (criando-o, se necessário). Para garantir que nenhum grupo de threads seja bloqueado por declarações travadas, o pool de threads tem um thread de fundo que monitora regularmente os estados dos grupos de threads.

Ao usar o fio de escuta para executar uma declaração que pode começar imediatamente, não é necessário criar um fio adicional se a declaração terminar rapidamente. Isso garante a execução mais eficiente possível no caso de um número baixo de threads concorrentes.

Quando o plugin de pool de threads é iniciado, ele cria uma thread por grupo (a thread do ouvinte), além da thread de fundo. Threads adicionais são criadas conforme necessário para executar as instruções.

* O valor da variável de sistema `thread_pool_stall_limit` determina o significado de “terminam rapidamente” no item anterior. O tempo padrão antes que os threads sejam considerados parados é de 60 ms, mas pode ser ajustado para um máximo de 6 s. Este parâmetro é configurável para permitir que você encontre um equilíbrio adequado para a carga de trabalho do servidor. Valores de espera curtos permitem que os threads comecem mais rapidamente. Valores curtos também são melhores para evitar situações de deadlock. Valores de espera longos são úteis para cargas de trabalho que incluem declarações de longa duração, para evitar iniciar muitas novas declarações enquanto as atuais são executadas.

* Se `thread_pool_max_active_query_threads` for 0, o algoritmo padrão é aplicado conforme descrito anteriormente para determinar o número máximo de threads ativas por grupo. O algoritmo padrão leva em consideração as threads paralisadas e pode permitir temporariamente mais threads ativas. Se `thread_pool_max_active_query_threads` for maior que 0, ele estabelece um limite para o número de threads ativas por grupo.

* O pool de threads foca em limitar o número de declarações concorrentes de execução curta. Antes que uma declaração em execução atinja o tempo de espera, ela impede que outras declarações comecem a ser executadas. Se a declaração for executada após o tempo de espera, ela é permitida para continuar, mas não impede mais que outras declarações comecem. Dessa forma, o pool de threads tenta garantir que, em cada grupo de threads, nunca haja mais de uma declaração de execução curta, embora possa haver várias declarações de execução longa. Não é desejável permitir que declarações de execução longa impeçam outras declarações de serem executadas, porque não há limite para a quantidade de espera que pode ser necessária. Por exemplo, em um servidor de fonte de replicação, um thread que está enviando eventos de log binário para uma replica efetivamente funciona para sempre.

* Uma declaração fica bloqueada se encontrar uma operação de E/S de disco ou um bloqueio de nível de usuário (bloqueio de linha ou bloqueio de tabela). O bloqueio faria com que o grupo de threads se tornasse inutilizado, então há chamadas de volta para o grupo de threads para garantir que o grupo de threads possa imediatamente iniciar um novo thread neste grupo para executar outra declaração. Quando um thread bloqueado retorna, o grupo de threads permite que ele reinicie imediatamente.

* Existem duas filas, uma fila de alta prioridade e uma fila de baixa prioridade. A primeira declaração em uma transação vai para a fila de baixa prioridade. Quaisquer declarações subsequentes para a transação vão para a fila de alta prioridade se a transação estiver em andamento (as declarações para ela já começaram a ser executadas), ou para a fila de baixa prioridade caso contrário. A atribuição da fila pode ser afetada ao habilitar a variável de sistema `thread_pool_high_priority_connection`, o que faz com que todas as declarações em fila para uma sessão vão para a fila de alta prioridade.

As declarações para um motor de armazenamento não transacional, ou para um motor transacional se `autocommit` estiver habilitado, são tratadas como declarações de baixa prioridade, pois, neste caso, cada declaração é uma transação. Assim, dada uma mistura de declarações para as tabelas `InnoDB` e `MyISAM`, o pool de threads prioriza as de `InnoDB` sobre as de `MyISAM`, a menos que `autocommit` esteja habilitado. Com `autocommit` habilitado, todas as declarações têm prioridade baixa.

* Quando o grupo de fios seleciona uma declaração em fila para execução, ele primeiro procura na fila de alta prioridade, depois na fila de baixa prioridade. Se uma declaração for encontrada, ela é removida de sua fila e começa a ser executada.

* Se uma declaração ficar na fila de baixa prioridade por muito tempo, o pool de threads passa para a fila de alta prioridade. O valor da variável de sistema `thread_pool_prio_kickup_timer` controla o tempo antes do movimento. Para cada grupo de threads, no máximo uma declaração por 10 ms (100 por segundo) é movida da fila de baixa prioridade para a fila de alta prioridade.

* O pool de fios reutiliza os fios mais ativos para obter um uso muito melhor dos caches de CPU. Esse é um pequeno ajuste que tem um grande impacto no desempenho.

* Enquanto um fio executa uma declaração de uma conexão do usuário, a instrumentação do Schema de desempenho contabiliza a atividade do fio na conexão do usuário. Caso contrário, o Schema de desempenho contabiliza a atividade no pool de threads.

Aqui estão exemplos de condições sob as quais um grupo de threads pode ter múltiplas threads iniciadas para executar instruções:

* Um fio começa a executar uma declaração, mas funciona o tempo suficiente para ser considerado parado. O grupo de fios permite que outro fio comece a executar outra declaração, mesmo que o primeiro fio ainda esteja executando.

* Um fio começa a executar uma declaração, depois é bloqueado e reporta isso de volta ao grupo de fios. O grupo de fios permite que outro fio comece a executar outra declaração.

* Um fio começa a executar uma declaração, fica bloqueado, mas não relata que está bloqueado porque o bloqueio não ocorre em código que foi instrumentado com callbacks do pool de threads. Neste caso, o fio parece para o grupo de fios que ainda está em execução. Se o bloqueio durar o tempo suficiente para que a declaração seja considerada parada, o grupo permite que outro fio comece a executar outra declaração.

O pool de threads é projetado para ser escalável em um número crescente de conexões. Ele também é projetado para evitar deadlocks que podem surgir ao limitar o número de declarações que estão sendo executadas ativamente. É importante que as threads que não retornem ao pool de threads não impeçam outras declarações de serem executadas, e assim, não causem o pool de threads a ficar em deadlock. Exemplos de tais declarações são os seguintes:

* Declarações de longa duração. Essas levariam a todos os recursos utilizados por apenas algumas declarações e poderiam impedir que todos os outros acessem o servidor.

* Descarte de threads de registro binário que leem o registro binário e o enviam para réplicas. Esse é um tipo de "declaração" de longa duração que funciona por um longo tempo e que não deve impedir que outras declarações sejam executadas.

* Declarações bloqueadas em um bloqueio de linha, bloqueio de tabela, sono ou qualquer outra atividade de bloqueio que não tenha sido reportada de volta ao pool de threads pelo MySQL Server ou por um mecanismo de armazenamento.

Em cada caso, para evitar o impasse, a declaração é movida para a categoria travada quando não é concluída rapidamente, para que o grupo de threads possa permitir que outra declaração comece a ser executada. Com esse design, quando um thread é executado ou fica bloqueado por um período prolongado, o grupo de threads move o thread para a categoria travada e, para o resto da execução da declaração, não impede que outras declarações sejam executadas.

O número máximo de threads que podem ocorrer é a soma de `max_connections` e `thread_pool_size`. Isso pode acontecer em uma situação em que todas as conexões estão em modo de execução e um fio extra é criado por grupo para ouvir mais declarações. Isso não é necessariamente um estado que acontece com frequência, mas é teoricamente possível.

##### Conexões privilegiadas

Quando o limite definido por `thread_pool_max_transactions_limit` é atingido, novas conexões parecem ficar pendentes até que uma ou mais transações existentes sejam concluídas. O mesmo ocorre ao tentar iniciar uma nova transação em uma conexão existente. Se as conexões existentes estiverem bloqueadas ou em execução por um longo período, a única maneira de acessar o servidor é usando uma conexão privilegiada.

Para estabelecer uma conexão privilegiada, o usuário que inicia a conexão deve ter o privilégio `TP_CONNECTION_ADMIN`. Uma conexão privilegiada ignora o limite definido por `thread_pool_max_transactions_limit` e permite conectar ao servidor para aumentar o limite, remover o limite ou interromper as transações em execução. O privilégio `TP_CONNECTION_ADMIN` deve ser concedido explicitamente. Não é concedido a nenhum usuário por padrão.

Uma conexão privilegiada pode executar declarações e iniciar transações, e é atribuída a um grupo de threads designado como o grupo de threads `Admin`.

Ao consultar a tabela `performance_schema.tp_thread_group_stats`, que reporta estatísticas por grupo de thread, as estatísticas do grupo de thread `Admin` são relatadas na última linha do conjunto de resultados. Por exemplo, se `SELECT

* As estatísticas do grupo de threads `performance_schema.tp_thread_group_stats\G` returns 17 rows (one row per thread group), the `Admin` são relatadas na 17ª linha.

#### 7.6.3.4 Ajuste do Pool de Fios

Esta seção fornece diretrizes para determinar a melhor configuração para o desempenho do pool de threads, conforme medido usando uma métrica como transações por segundo.

De grande importância é o número de grupos de fios no pool de fios, que pode ser definido na inicialização do servidor usando a opção `--thread-pool-size`; isso não pode ser alterado em tempo real. Os valores recomendados para essa opção dependem se o motor de armazenamento primário em uso é `InnoDB` ou `MyISAM`:

* Se o motor de armazenamento primário for `InnoDB`, o valor recomendado para o tamanho do pool de threads é o número de núcleos físicos disponíveis na máquina hospedeira, até um máximo de 512.

* Se o motor de armazenamento primário for `MyISAM`, o tamanho do conjunto de threads deve ser bastante baixo. O desempenho ótimo é frequentemente observado com valores de 4 a 8. Valores mais altos tendem a ter um impacto ligeiramente negativo, mas não dramático, no desempenho.

O limite superior do número de transações concorrentes que podem ser processadas pelo plugin de pool de threads é determinado pelo valor de `thread_pool_max_transactions_limit`. O ajuste inicial da recomendação para essa variável do sistema é o número de núcleos físicos vezes 32. Você pode precisar ajustar o valor a partir desse ponto inicial para atender a uma carga de trabalho específica; um limite superior razoável para esse valor é o número máximo de conexões concorrentes esperado; o valor da variável de status `Max_used_connections` pode servir como guia para determinar isso. Uma boa maneira de proceder é começar com `thread_pool_max_transactions_limit` definido para esse valor, depois ajustá-lo para baixo enquanto observa o efeito no desempenho.

O número máximo de threads de consulta permitido em um grupo de threads é determinado pelo valor de `thread_pool_query_threads_per_group`, que pode ser ajustado em tempo real. O produto desse valor e do tamanho do pool de threads é aproximadamente igual ao número total de threads disponíveis para processar consultas. Obter o melhor desempenho geralmente significa encontrar o equilíbrio adequado para sua aplicação entre `thread_pool_query_threads_per_group` e o tamanho do pool de threads. Valores maiores para `thread_pool_query_threads_per_group` tornam menos provável que todas as threads do grupo de threads executem consultas de longa duração simultaneamente, bloqueando as consultas mais curtas quando a carga de trabalho inclui consultas de longa e curta duração. Você deve ter em mente que o custo operacional da operação de monitoramento de conexão para cada grupo de threads aumenta quando se usam valores menores para o tamanho do pool de threads com valores maiores para `thread_pool_query_threads_per_group`. Por essa razão, recomendamos um valor inicial de `2` para `thread_pool_query_threads_per_group`; definir essa variável para um valor menor geralmente não oferece nenhum benefício de desempenho.

Para obter o melhor desempenho em condições normais, também recomendamos que você defina `thread_pool_algorithm` para 1 em alta concorrência.

Além disso, o valor da variável de sistema `thread_pool_stall_limit` determina o tratamento de instruções bloqueadas e de execução longa. Se todas as chamadas que bloqueiam o MySQL Server fossem reportadas para o pool de threads, ele sempre saberia quando os threads de execução estão bloqueados, mas isso nem sempre é verdade. Por exemplo, blocos podem ocorrer em código que não foi instrumentado com callbacks do pool de threads. Para tais casos, o pool de threads deve ser capaz de identificar threads que parecem estar bloqueadas. Isso é feito por meio de um tempo limite determinado pelo valor de `thread_pool_stall_limit`, que garante que o servidor não fique completamente bloqueado. O valor de `thread_pool_stall_limit` representa um número de intervalos de 10 milissegundos, de modo que `600` (o máximo) representa 6 segundos.

`thread_pool_stall_limit` também permite que o pool de threads gere instruções de longa duração. Se uma instrução de longa duração fosse permitida para bloquear um grupo de threads, todas as outras conexões atribuídas ao grupo seriam bloqueadas e não poderiam iniciar a execução até que a instrução de longa duração fosse concluída. No pior dos casos, isso pode levar horas ou até dias.

O valor de `thread_pool_stall_limit` deve ser escolhido de tal forma que as declarações que executam mais tempo do que seu valor sejam consideradas travadas. As declarações travadas geram um monte de overhead extra, pois envolvem trocas de contexto extras e, em alguns casos, até mesmo criação de threads extras. Por outro lado, definir o parâmetro `thread_pool_stall_limit` muito alto significa que as declarações de longa duração bloqueiam um número de declarações de curta duração por mais tempo do que o necessário. Valores de espera curtos permitem que os threads comecem mais rapidamente. Valores curtos também são melhores para evitar situações de deadlock. Valores de espera longos são úteis para cargas de trabalho que incluem declarações de longa duração, para evitar começar muitas novas declarações enquanto as atuais executam.

Suponha que um servidor execute uma carga de trabalho onde 99,9% das declarações são concluídas em 100 ms, mesmo quando o servidor está carregado, e as declarações restantes levam entre 100 ms e 2 horas, distribuídas de forma bastante uniforme. Neste caso, faria sentido definir `thread_pool_stall_limit` para 10 (10 × 10 ms = 100 ms). O valor padrão de 6 (60 ms) é adequado para servidores que executam principalmente declarações muito simples.

O parâmetro `thread_pool_stall_limit` pode ser alterado em tempo de execução para permitir que você encontre um equilíbrio adequado para a carga de trabalho do servidor. Supondo que a tabela `tp_thread_group_stats` esteja habilitada, você pode usar a seguinte consulta para determinar a fração de declarações executadas que ficaram paralisadas:

```
SELECT SUM(STALLED_QUERIES_EXECUTED) / SUM(QUERIES_EXECUTED)
FROM performance_schema.tp_thread_group_stats;
```

Esse número deve ser o menor possível. Para diminuir a probabilidade de declarações ficarem paralisadas, aumente o valor de `thread_pool_stall_limit`.

Quando uma declaração chega, qual é o máximo de tempo que ela pode ser adiada antes de realmente começar a ser executada? Suponha que as seguintes condições se apliquem:

* Há 200 declarações em fila na fila de baixa prioridade.
* Há 10 declarações em fila na fila de alta prioridade.
* `thread_pool_prio_kickup_timer` está definido em 10000 (10 segundos).

* `thread_pool_stall_limit` está definido em 100 (1 segundo).

No pior dos casos, as 10 declarações de alta prioridade representam 10 transações que continuam sendo executadas por um longo tempo. Assim, no pior dos casos, não é possível mover declarações para a fila de alta prioridade, pois ela sempre contém declarações em espera de execução. Após 10 segundos, a nova declaração se torna elegível para ser movida para a fila de alta prioridade. No entanto, antes de poder ser movida, todas as declarações anteriores a ela também devem ser movidas. Isso pode levar outros 2 segundos, pois um máximo de 100 declarações por segundo são movidas para a fila de alta prioridade. Agora, quando a declaração atingir a fila de alta prioridade, pode haver potencialmente muitas declarações em execução. No pior dos casos, cada uma delas fica parada e são necessários 1 segundo para cada declaração antes que a próxima declaração seja recuperada da fila de alta prioridade. Assim, neste cenário, leva-se 222 segundos antes que a nova declaração comece a ser executada.

Este exemplo mostra um caso extremo para uma aplicação. Como lidar com isso depende da aplicação. Se a aplicação tiver requisitos elevados em relação ao tempo de resposta, ela deve, provavelmente, restringir os usuários em um nível mais alto. Caso contrário, ela pode usar os parâmetros de configuração do pool de threads para definir algum tipo de tempo de espera máximo.

### 7.6.4 O Plugin de Reescrita de Pergunta Rewriter

O MySQL suporta plugins de reescrita de consulta que podem examinar e, possivelmente, modificar as declarações SQL recebidas pelo servidor antes de executá-las. Veja Plugins de reescrita de consulta.

As distribuições do MySQL incluem um plugin de reescrita de consulta postparse chamado `Rewriter` e scripts para instalação do plugin e seus elementos associados. Esses elementos trabalham juntos para fornecer capacidade de reescrita de declarações:

* Um plugin do lado do servidor chamado `Rewriter` examina as declarações e pode reescrevê-las, com base em sua cache de memória para regras de reescrita.

* Essas declarações estão sujeitas a reescrita:

+ a partir do MySQL 8.0.12: `SELECT`, `INSERT`, `REPLACE`, `UPDATE` e `DELETE`.

+ Antes do MySQL 8.0.12: apenas `SELECT`.

As declarações independentes e as declarações preparadas estão sujeitas à reescrita. As declarações que ocorrem dentro das definições de visão ou programas armazenados não estão sujeitas à reescrita.

* O plugin `Rewriter` utiliza um banco de dados denominado `query_rewrite`, que contém uma tabela denominada `rewrite_rules`. A tabela fornece armazenamento persistente para as regras que o plugin usa para decidir se deve reescrever declarações. Os usuários se comunicam com o plugin modificando o conjunto de regras armazenadas nesta tabela. O plugin se comunica com os usuários definindo a coluna `message` das linhas da tabela.

* O banco de dados `query_rewrite` contém um procedimento armazenado chamado `flush_rewrite_rules()` que carrega o conteúdo da tabela de regras no plugin.

* Uma função carregável denominada `load_rewrite_rules()` é usada pelo procedimento armazenado `flush_rewrite_rules()`.

* O plugin `Rewriter` expõe variáveis do sistema que permitem a configuração do plugin e variáveis de status que fornecem informações operacionais em tempo de execução. No MySQL 8.0.31 e versões posteriores, este plugin também suporta um privilégio (`SKIP_QUERY_REWRITE`) que protege as consultas de um usuário específico de serem reescritas.

As seções a seguir descrevem como instalar e usar o plugin `Rewriter`, e fornecem informações de referência para seus elementos associados.

#### 7.6.4.1 Instalar ou Desinstalar o Plugin de Reescrita de Consulta Rewriter

Nota

Se instalado, o plugin `Rewriter` gera algum overhead mesmo quando desativado. Para evitar esse overhead, não instale o plugin a menos que você planeje usá-lo.

Para instalar ou desinstalar o plugin de reescrita da consulta `Rewriter`, escolha o script apropriado localizado no diretório `share` da sua instalação do MySQL:

* `install_rewriter.sql`: Escolha este script para instalar o plugin `Rewriter` e seus elementos associados.

* `uninstall_rewriter.sql`: Escolha este script para desinstalar o plugin `Rewriter` e seus elementos associados.

Execute o script escolhido da seguinte forma:

```
$> mysql -u root -p < install_rewriter.sql
Enter password: (enter root password here)
```

O exemplo aqui usa o script de instalação `install_rewriter.sql`. Substitua `uninstall_rewriter.sql` se você estiver desinstalando o plugin.

Executar um script de instalação deve instalar e habilitar o plugin. Para verificar isso, conecte-se ao servidor e execute a seguinte declaração:

```
mysql> SHOW GLOBAL VARIABLES LIKE 'rewriter_enabled';
+------------------+-------+
| Variable_name    | Value |
+------------------+-------+
| rewriter_enabled | ON    |
+------------------+-------+
```

Para instruções de uso, consulte a Seção 7.6.4.2, “Usando o Plugin de Reescritura de Consulta de Reescritura”. Para informações de referência, consulte a Seção 7.6.4.3, “Referência do Plugin de Reescritura de Consulta de Reescritura”.

#### 7.6.4.2 Usando o Plugin de Reescrita de Consulta Rewriter

Para habilitar ou desabilitar o plugin, habilite ou desabilite a variável de sistema `rewriter_enabled`. Por padrão, o plugin `Rewriter` é habilitado quando você o instala (consulte Seção 7.6.4.1, “Instalando ou Desinstalando o Plugin de Reescritura de Reescritura de Consulta”). Para definir o estado inicial do plugin explicitamente, você pode definir a variável na inicialização do servidor. Por exemplo, para habilitar o plugin em um arquivo de opção, use essas linhas:

```
[mysqld]
rewriter_enabled=ON
```

É também possível habilitar ou desabilitar o plugin em tempo de execução:

```
SET GLOBAL rewriter_enabled = ON;
SET GLOBAL rewriter_enabled = OFF;
```

Supondo que o plugin `Rewriter` esteja habilitado, ele examina e, possivelmente, modifica cada declaração reescritível recebida pelo servidor. O plugin determina se as declarações devem ser reescritas com base em sua cache de regras de reescrita de memória, que são carregadas a partir da tabela `rewrite_rules` no banco de dados `query_rewrite`.

Essas declarações estão sujeitas a reescrita:

* a partir do MySQL 8.0.12: `SELECT`, `INSERT`, `REPLACE`, `UPDATE` e `DELETE`.

* Antes do MySQL 8.0.12: apenas `SELECT`.

As declarações independentes e as declarações preparadas estão sujeitas à reescrita. As declarações que ocorrem dentro das definições de visão ou programas armazenados não estão sujeitas à reescrita.

A partir do MySQL 8.0.31, as declarações executadas por usuários com o privilégio `SKIP_QUERY_REWRITE` não são sujeitas a reescrita, desde que a variável de sistema `rewriter_enabled_for_threads_without_privilege_checks` esteja definida como `OFF` (padrão `ON`). Isso pode ser usado para declarações de controle e declarações que devem ser replicadas inalteradas, como as especificadas no `SOURCE_USER` especificado por `CHANGE REPLICATION SOURCE TO`. Isso também é válido para declarações executadas por programas clientes do MySQL, incluindo **mysqlbinlog**, **mysqladmin**, **mysqldump** e **mysqlpump**. Por essa razão, você deve conceder `SKIP_QUERY_REWRITE` à conta de usuário ou contas usadas por essas ferramentas para se conectar ao MySQL.

* Adicionar Regras de Reescrita
* Como o Alinhamento de Declarações Funciona
* Reescrita de Declarações Preparadas
* Informações Operacionais do Plugin Reescritor
* Uso de Conjuntos de Caracteres no Plugin Reescritor

##### Adicionar regras de reescrita

Para adicionar regras para o plugin `Rewriter`, adicione linhas à tabela `rewrite_rules`, em seguida, invocando o procedimento armazenado `flush_rewrite_rules()` para carregar as regras da tabela para o plugin. O exemplo a seguir cria uma regra simples para corresponder a declarações que selecionam um único valor literal:

```
INSERT INTO query_rewrite.rewrite_rules (pattern, replacement)
VALUES('SELECT ?', 'SELECT ? + 1');
```

O conteúdo da tabela resultante parece assim:

```
mysql> SELECT * FROM query_rewrite.rewrite_rules\G
*************************** 1. row ***************************
                id: 1
           pattern: SELECT ?
  pattern_database: NULL
       replacement: SELECT ? + 1
           enabled: YES
           message: NULL
    pattern_digest: NULL
normalized_pattern: NULL
```

A regra especifica um modelo de padrão que indica quais `SELECT` devem ser correspondidos e um modelo de substituição que indica como reescrever as declarações correspondentes. No entanto, adicionar a regra à tabela `rewrite_rules` não é suficiente para fazer com que o plugin `Rewriter` use a regra. Você deve invocar `flush_rewrite_rules()` para carregar o conteúdo da tabela no cache de memória do plugin:

```
mysql> CALL query_rewrite.flush_rewrite_rules();
```

Dica

Se suas regras de reescrita não estiverem funcionando corretamente, certifique-se de que você carregou novamente a tabela de regras, chamando `flush_rewrite_rules()`.

Quando o plugin lê cada regra da tabela de regras, ele calcula uma forma normalizada (digestão de declaração) a partir do padrão e um valor de hash de digestão, e usa-os para atualizar as colunas `normalized_pattern` e `pattern_digest`:

```
mysql> SELECT * FROM query_rewrite.rewrite_rules\G
*************************** 1. row ***************************
                id: 1
           pattern: SELECT ?
  pattern_database: NULL
       replacement: SELECT ? + 1
           enabled: YES
           message: NULL
    pattern_digest: d1b44b0c19af710b5a679907e284acd2ddc285201794bc69a2389d77baedddae
normalized_pattern: select ?
```

Para informações sobre a digestão de declarações, declarações normalizadas e valores de hash de digestão, consulte a Seção 29.10, “Digestas e amostragem de declarações do Schema de desempenho”.

Se uma regra não puder ser carregada devido a algum erro, chamar `flush_rewrite_rules()` produz um erro:

```
mysql> CALL query_rewrite.flush_rewrite_rules();
ERROR 1644 (45000): Loading of some rule(s) failed.
```

Quando isso ocorre, o plugin escreve uma mensagem de erro na coluna `message` da linha da regra para comunicar o problema. Verifique a tabela `rewrite_rules` para linhas com valores na coluna `message` que não são `NULL`. Isso ajudará a identificar quais problemas existem.

Os padrões utilizam a mesma sintaxe que as instruções preparadas (consulte a Seção 15.5.1, “Instrução PREPARE”). Dentro de um modelo de padrão, os caracteres `?` atuam como marcadores de parâmetro que correspondem a valores de dados. Os caracteres `?` não devem ser fechados entre aspas. Os marcadores de parâmetro podem ser usados apenas onde os valores de dados devem aparecer, e não podem ser usados para palavras-chave SQL, identificadores, funções, etc. O plugin analisa uma instrução para identificar os valores literais (conforme definido na Seção 11.1, “Valores Literais”), então você pode colocar um marcador de parâmetro no lugar de qualquer valor literal.

Assim como o padrão, a substituição pode conter caracteres `?`. Para uma declaração que corresponde a um modelo de padrão, o plugin a reescreve, substituindo os marcadores de parâmetro `?` na substituição usando valores de dados correspondentes aos marcadores correspondentes no padrão. O resultado é uma cadeia de declaração completa. O plugin pede ao servidor para analisá-la e retorna o resultado ao servidor como a representação da declaração reescrita.

Depois de adicionar e carregar a regra, verifique se a reescrita ocorre de acordo com a correspondência dos enunciados ao padrão da regra:

```
mysql> SELECT PI();
+----------+
| PI()     |
+----------+
| 3.141593 |
+----------+
1 row in set (0.01 sec)

mysql> SELECT 10;
+--------+
| 10 + 1 |
+--------+
|     11 |
+--------+
1 row in set, 1 warning (0.00 sec)
```

Não ocorre reescrita para a primeira declaração `SELECT`, mas ocorre para a segunda. A segunda declaração ilustra que, quando o plugin `Rewriter` reescreve uma declaração, ele produz uma mensagem de aviso. Para visualizar a mensagem, use `SHOW WARNINGS`:

```
mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Note
   Code: 1105
Message: Query 'SELECT 10' rewritten to 'SELECT 10 + 1' by a query rewrite plugin
```

Uma declaração não precisa ser reescrita para uma declaração do mesmo tipo. O exemplo a seguir carrega uma regra que reescreve as declarações `DELETE` para declarações `UPDATE`:

```
INSERT INTO query_rewrite.rewrite_rules (pattern, replacement)
VALUES('DELETE FROM db1.t1 WHERE col = ?',
       'UPDATE db1.t1 SET col = NULL WHERE col = ?');
CALL query_rewrite.flush_rewrite_rules();
```

Para habilitar ou desabilitar uma regra existente, modifique sua coluna `enabled` e recarregue a tabela no plugin. Para desabilitar a regra 1:

```
UPDATE query_rewrite.rewrite_rules SET enabled = 'NO' WHERE id = 1;
CALL query_rewrite.flush_rewrite_rules();
```

Isso permite que você desative uma regra sem removê-la da tabela.

Para reativar a regra 1:

```
UPDATE query_rewrite.rewrite_rules SET enabled = 'YES' WHERE id = 1;
CALL query_rewrite.flush_rewrite_rules();
```

A tabela `rewrite_rules` contém uma coluna `pattern_database` que a tabela `Rewriter` utiliza para corresponder a nomes de tabela que não são qualificados com o nome do banco de dados:

* Os nomes de tabela qualificados nas declarações correspondem aos nomes qualificados no padrão se os nomes de banco de dados e de tabela correspondentes forem idênticos.

* Os nomes de tabela não qualificados em declarações correspondem a nomes não qualificados no padrão apenas se o banco de dados padrão for o mesmo que `pattern_database` e os nomes de tabela forem idênticos.

Suponha que uma tabela chamada `appdb.users` tenha uma coluna chamada `id` e que as aplicações sejam esperadas para selecionar linhas da tabela usando uma consulta de um desses formulários, onde o segundo pode ser usado quando `appdb` é o banco de dados padrão:

```
SELECT * FROM users WHERE appdb.id = id_value;
SELECT * FROM users WHERE id = id_value;
```

Suponha também que a coluna `id` seja renomeada para `user_id` (talvez a tabela precise ser modificada para adicionar outro tipo de ID e seja necessário indicar mais especificamente qual tipo de ID a coluna `id` representa).

A mudança significa que as aplicações devem se referir a `user_id` em vez de `id` na cláusula `WHERE`, mas as aplicações antigas que não podem ser atualizadas não funcionam mais corretamente. O plugin `Rewriter` pode resolver esse problema, correspondendo e reescrevendo as declarações problemáticas. Para corresponder à declaração `SELECT * FROM appdb.users WHERE id = value` e reescrevê-la como `SELECT * FROM appdb.users WHERE user_id = value`, você pode inserir uma linha representando uma regra de substituição na tabela de regras de reescrita. Se você também deseja corresponder a este `SELECT` usando o nome da tabela não qualificada, também é necessário adicionar uma regra explícita. Usando `?` como um localizador de valor, as duas declarações `INSERT` necessárias parecem assim:

```
INSERT INTO query_rewrite.rewrite_rules
    (pattern, replacement) VALUES(
    'SELECT * FROM appdb.users WHERE id = ?',
    'SELECT * FROM appdb.users WHERE user_id = ?'
    );
INSERT INTO query_rewrite.rewrite_rules
    (pattern, replacement, pattern_database) VALUES(
    'SELECT * FROM users WHERE id = ?',
    'SELECT * FROM users WHERE user_id = ?',
    'appdb'
    );
```

Após adicionar as duas novas regras, execute a seguinte declaração para fazer com que elas entrem em vigor:

```
CALL query_rewrite.flush_rewrite_rules();
```

`Rewriter` usa a primeira regra para corresponder a declarações que utilizam o nome da tabela qualificada, e a segunda para corresponder a declarações que utilizam o nome não qualificado. A segunda regra funciona apenas quando `appdb` é o banco de dados padrão.

##### Como o Alinhamento de Declarações Funciona

O plugin `Rewriter` utiliza resumos de declarações e valores de hash de digestão para combinar declarações recebidas com regras de reescrita em etapas. A variável de sistema `max_digest_length` determina o tamanho do buffer usado para calcular resumos de declarações. Valores maiores permitem a computação de digests que distinguem declarações mais longas. Valores menores utilizam menos memória, mas aumentam a probabilidade de declarações mais longas colidirem com o mesmo valor de digestão.

O plugin combina cada declaração com as regras de reescrita da seguinte forma:

1. Calcule o valor do hash do digest da declaração e compare-o com os valores de hash do digest da regra. Isso está sujeito a falsos positivos, mas serve como um teste de rejeição rápida.

2. Se o valor do hash do resumo de declaração corresponder a qualquer valor de hash de resumo de padrão, alinhe a forma normalizada (digest do resumo da declaração) da declaração com a forma normalizada dos padrões de regras de correspondência.

3. Se a declaração normalizada corresponder a uma regra, compare os valores literais na declaração e no padrão. Um caractere `?` no padrão corresponde a qualquer valor literal na declaração. Se a declaração prepara uma declaração, `?` no padrão também corresponde a `?` na declaração. Caso contrário, os valores literais correspondentes devem ser os mesmos.

Se várias regras corresponderem a uma declaração, não é determinado qual plugin usa para reescrever a declaração.

Se um padrão contiver mais marcadores do que a substituição, o plugin descarta os valores de dados em excesso. Se um padrão contiver menos marcadores do que a substituição, é um erro. O plugin percebe isso quando a tabela de regras é carregada, escreve uma mensagem de erro na coluna `message` da linha da regra para comunicar o problema e define a variável de status `Rewriter_reload_error` para `ON`.

##### Reescrita de declarações preparadas

As declarações preparadas são reescritas no momento de análise (ou seja, quando são preparadas), e não quando são executadas posteriormente.

As declarações preparadas diferem das declarações não preparadas porque podem conter caracteres `?` como marcadores de parâmetro. Para corresponder a um `?` em uma declaração preparada, um padrão `Rewriter` deve conter `?` na mesma localização. Suponha que uma regra de reescrita tenha este padrão:

```
SELECT ?, 3
```

A tabela a seguir mostra várias declarações preparadas do `SELECT` e se o padrão de regra corresponde a elas.

<table summary="How the Rewriter plugin matches prepared statements against the pattern SELECT ?,3."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Declaração preparada</th> <th>Whether Pattern Matches Statement</th> </tr></thead><tbody><tr> <td><code>PREPARE s AS 'SELECT 3, 3'</code></td> <td>Yes</td> </tr><tr> <td><code>PREPARE s AS 'SELECT ?, 3'</code></td> <td>Yes</td> </tr><tr> <td><code>PREPARE s AS 'SELECT 3, ?'</code></td> <td>No</td> </tr><tr> <td><code>PREPARE s AS 'SELECT ?, ?'</code></td> <td>No</td> </tr></tbody></table>

##### Informações Operacionais do Plugin de Reescritor

O plugin `Rewriter` disponibiliza informações sobre sua operação por meio de várias variáveis de status:

```
mysql> SHOW GLOBAL STATUS LIKE 'Rewriter%';
+-----------------------------------+-------+
| Variable_name                     | Value |
+-----------------------------------+-------+
| Rewriter_number_loaded_rules      | 1     |
| Rewriter_number_reloads           | 5     |
| Rewriter_number_rewritten_queries | 1     |
| Rewriter_reload_error             | ON    |
+-----------------------------------+-------+
```

Para descrições dessas variáveis, consulte a Seção 7.6.4.3.4, “Variáveis de status do plugin de reescrita de consulta do Rewriter”.

Quando você carrega a tabela de regras ao chamar o procedimento armazenado `flush_rewrite_rules()`, se ocorrer um erro em alguma regra, a declaração `CALL` produz um erro, e o plugin define a variável de status `Rewriter_reload_error` como `ON`:

```
mysql> CALL query_rewrite.flush_rewrite_rules();
ERROR 1644 (45000): Loading of some rule(s) failed.

mysql> SHOW GLOBAL STATUS LIKE 'Rewriter_reload_error';
+-----------------------+-------+
| Variable_name         | Value |
+-----------------------+-------+
| Rewriter_reload_error | ON    |
+-----------------------+-------+
```

Nesse caso, verifique a tabela `rewrite_rules` para verificar as linhas com valores de coluna `NULL` que não são `message` para ver quais problemas existem.

##### Plugin de Reescritor Uso de Conjuntos de Caracteres

Quando a tabela `rewrite_rules` é carregada no plugin `Rewriter`, o plugin interpreta as declarações usando o valor global atual da variável do sistema `character_set_client`. Se o valor global `character_set_client` for alterado posteriormente, a tabela de regras deve ser recarregada.

Um cliente deve ter um valor de sessão `character_set_client` idêntico ao que era o valor global quando a tabela de regras foi carregada ou se a correspondência de regras não funcionar para esse cliente.

#### 7.6.4.3 Referência ao Plugin de Reescrita de Consulta de Reescritor

A discussão a seguir serve como referência para esses elementos associados ao plugin de reescrita da consulta `Rewriter`:

* A tabela de regras `Rewriter` no banco de dados `query_rewrite`

* `Rewriter` procedimentos e funções
* `Rewriter` variáveis de sistema e status

##### 7.6.4.3.1 Tabela de Regras do Plugin de Reescrita de Consulta de Reescritor

A tabela `rewrite_rules` no banco de dados `query_rewrite` fornece armazenamento persistente para as regras que o plugin `Rewriter` usa para decidir se deve reescrever as declarações.

Os usuários se comunicam com o plugin modificando o conjunto de regras armazenadas nesta tabela. O plugin comunica informações aos usuários definindo a coluna `message` da tabela.

Nota

A tabela de regras é carregada no plugin pelo procedimento armazenado `flush_rewrite_rules`. A menos que esse procedimento tenha sido chamado após a modificação mais recente da tabela, o conteúdo da tabela não necessariamente corresponde ao conjunto de regras que o plugin está usando.

A tabela `rewrite_rules` tem essas colunas:

* `id`

O ID da regra. Essa coluna é a chave primária da tabela. Você pode usar o ID para identificar de forma única qualquer regra.

* `pattern`

O modelo que indica o padrão para as declarações que a regra corresponde. Use `?` para representar marcadores de parâmetro que correspondem a valores de dados.

* `pattern_database`

O banco de dados usado para combinar nomes de tabela não qualificados em declarações. Nomes de tabela qualificados em declarações correspondem a nomes qualificados no padrão se os nomes de banco de dados e tabela correspondentes forem idênticos. Nomes de tabela não qualificados em declarações correspondem a nomes não qualificados no padrão apenas se o banco de dados padrão for o mesmo que `pattern_database` e os nomes de tabela forem idênticos.

* `replacement`

O modelo que indica como reescrever declarações que correspondem ao valor da coluna `pattern`. Use `?` para representar marcadores de parâmetro que correspondem a valores de dados. Em declarações reescritas, o plugin substitui os marcadores de parâmetro `?` em `replacement` usando valores de dados correspondentes aos marcadores correspondentes em `pattern`.

* `enabled`

Se a regra estiver habilitada. As operações de carregamento (realizadas ao invocar o procedimento armazenado `flush_rewrite_rules()`) carregam a regra da tabela para o cache `Rewriter` de memória apenas se esta coluna estiver `YES`.

Essa coluna permite desativar uma regra sem removê-la: defina a coluna para um valor diferente de `YES` e recarregue a tabela no plugin.

* `message`

O plugin utiliza esta coluna para se comunicar com os usuários. Se não ocorrer nenhum erro quando a tabela de regras é carregada na memória, o plugin define a coluna `message` para `NULL`. Um valor que não é `NULL` indica um erro e o conteúdo da coluna é a mensagem de erro. Erros podem ocorrer nessas circunstâncias:

+ Ou o padrão ou a substituição é uma declaração SQL incorreta que produz erros de sintaxe.

+ O substituto contém mais marcadores de parâmetro `?` do que o padrão.

Se ocorrer um erro de carga, o plugin também define a variável de status `Rewriter_reload_error` para `ON`.

* `pattern_digest`

Esta coluna é usada para depuração e diagnóstico. Se a coluna existir quando a tabela de regras é carregada na memória, o plugin a atualiza com o resumo do padrão. Esta coluna pode ser útil se você estiver tentando determinar por que alguma declaração não é reescrita.

* `normalized_pattern`

Esta coluna é usada para depuração e diagnóstico. Se a coluna existir quando a tabela de regras é carregada na memória, o plugin a atualiza com o formato normalizado do padrão. Esta coluna pode ser útil se você estiver tentando determinar por que alguma declaração não é reescrita.

##### 7.6.4.3.2 Procedimentos e funções do plugin de reescrita de consultas de reescritor

A operação do plugin `Rewriter` utiliza um procedimento armazenado que carrega a tabela de regras em seu cache de memória, e uma função auxiliar carregável. Em operação normal, os usuários invocam apenas o procedimento armazenado. A função é destinada a ser invocada pelo procedimento armazenado, não diretamente pelos usuários.

* `flush_rewrite_rules()`

Este procedimento armazenado usa a função `load_rewrite_rules()` para carregar o conteúdo da tabela `rewrite_rules` no cache `Rewriter` de memória.

Chamar `flush_rewrite_rules()` implica em `COMMIT`.

Invoque este procedimento após modificar a tabela de regras para fazer com que o plugin atualize seu cache com o novo conteúdo da tabela. Se ocorrerem erros, o plugin define a coluna `message` para as linhas de regra apropriadas na tabela e define a variável de status `Rewriter_reload_error` para `ON`.

* `load_rewrite_rules()`

Essa função é uma rotina auxiliar usada pelo procedimento armazenado `flush_rewrite_rules()`.

##### 7.6.4.3.3 Sistema de Plugin de Reescritura de Consulta de Reescritura de Variáveis de Sistema

O plugin de reescrita de consulta `Rewriter` suporta as seguintes variáveis de sistema. Essas variáveis estão disponíveis apenas se o plugin estiver instalado (consulte Seção 7.6.4.1, “Instalando ou Desinstalando o Plugin de Reescrita de Consulta de Reescrita”).

* `rewriter_enabled`

  <table frame="box" rules="all" summary="Properties for rewriter_enabled"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>rewriter_enabled</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valid Values</th> <td><code>OFF</code></td> </tr></tbody></table>

Se o plugin de reescrita da consulta `Rewriter` está habilitado.

* `rewriter_enabled_for_threads_without_privilege_checks`

  <table frame="box" rules="all" summary="Properties for rewriter_enabled_for_threads_without_privilege_checks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Introduced</th> <td>8.0.31</td> </tr><tr><th>System Variable</th> <td><code>rewriter_enabled_for_threads_without_privilege_checks</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valid Values</th> <td><code>OFF</code></td> </tr></tbody></table>

Se aplicar reescritas para threads de replicação que executam com verificações de privilégio desativadas. Se configurado para `OFF`, tais reescritas são ignoradas. Requer o privilégio `SYSTEM_VARIABLES_ADMIN` ou privilégio `SUPER` para definir.

Essa variável não tem efeito se `rewriter_enabled` é `OFF`.

* `rewriter_verbose`

  <table frame="box" rules="all" summary="Properties for rewriter_verbose"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>rewriter_verbose</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr></tbody></table>

Para uso interno.

##### 7.6.4.3.4 Variáveis de status do plugin de reescrita de consulta de reescritor

O plugin de reescrita de consulta `Rewriter` suporta as seguintes variáveis de status. Essas variáveis estão disponíveis apenas se o plugin estiver instalado (consulte Seção 7.6.4.1, “Instalando ou Desinstalando o Plugin de Reescrita de Consulta de Reescrita”).

* `Rewriter_number_loaded_rules`

O número de regras de reescrita de plugins de reescrita carregadas com sucesso da tabela `rewrite_rules` para a memória para uso pelo plugin `Rewriter`.

* `Rewriter_number_reloads`

O número de vezes que a tabela `rewrite_rules` foi carregada no cache de memória utilizado pelo plugin `Rewriter`.

* `Rewriter_number_rewritten_queries`

O número de consultas reescritas pelo plugin de reescrita de consultas `Rewriter` desde que foi carregado.

* `Rewriter_reload_error`

Se ocorreu um erro na última vez que a tabela `rewrite_rules` foi carregada no cache de memória utilizado pelo plugin `Rewriter`. Se o valor for `OFF`, não ocorreu erro. Se o valor for `ON`, ocorreu um erro; verifique a coluna `message` da tabela `rewriter_rules` para mensagens de erro.

### 7.6.5 O plugin ddl_rewriter

O MySQL 8.0.16 e superior inclui um plugin `ddl_rewriter` que modifica as declarações `CREATE TABLE` recebidas pelo servidor antes de analisá-las e executá-las. O plugin remove as cláusulas `ENCRYPTION`, `DATA DIRECTORY` e `INDEX DIRECTORY`, o que pode ser útil ao restaurar tabelas a partir de arquivos de dump SQL criados a partir de bancos de dados que estão criptografados ou cujas tabelas estão armazenadas fora do diretório de dados. Por exemplo, o plugin pode permitir a restauração de tais arquivos de dump em uma instância não criptografada ou em um ambiente onde os caminhos fora do diretório de dados não são acessíveis.

Antes de usar o plugin `ddl_rewriter`, instale-o de acordo com as instruções fornecidas na Seção 7.6.5.1, “Instalando ou Desinstalando ddl_rewriter”.

`ddl_rewriter` examina as instruções SQL recebidas pelo servidor antes da análise, reescrevendo-as de acordo com essas condições:

* `ddl_rewriter` considera apenas as declarações `CREATE TABLE`, e apenas se elas forem declarações independentes que ocorrem no início de uma linha de entrada ou no início do texto de uma declaração preparada. `ddl_rewriter` não considera declarações `CREATE TABLE` dentro das definições de programas armazenados. As declarações podem se estender por várias linhas.

* Nas declarações consideradas para reescrita, as instâncias das seguintes cláusulas são reescritas e cada instância é substituída por um único espaço:

+ `ENCRYPTION`  
  + `DATA DIRECTORY` (nos níveis de tabela e partição)

+ `INDEX DIRECTORY` (nos níveis de tabela e partição)

* A reescrita não depende da maiúscula.

Se o `ddl_rewriter` reescrever uma declaração, ele gera um aviso:

```
mysql> CREATE TABLE t (i INT) DATA DIRECTORY '/var/mysql/data';
Query OK, 0 rows affected, 1 warning (0.03 sec)

mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Note
   Code: 1105
Message: Query 'CREATE TABLE t (i INT) DATA DIRECTORY '/var/mysql/data''
         rewritten to 'CREATE TABLE t (i INT) ' by a query rewrite plugin
1 row in set (0.00 sec)
```

Se o log de consulta geral ou o log binário estiver habilitado, o servidor escreve nele as declarações conforme elas aparecem após qualquer reescrita por `ddl_rewriter`.

Quando instalado, o `ddl_rewriter` expõe o instrumento do Schema de Desempenho `memory/rewriter/ddl_rewriter` para o rastreamento do uso da memória do plugin. Veja a Seção 29.12.20.10, “Tabelas de Resumo de Memória”

#### 7.6.5.1 Instalar ou desinstalar o ddl_rewriter

Esta seção descreve como instalar ou desinstalar o plugin `ddl_rewriter`. Para informações gerais sobre como instalar plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

Nota

Se instalado, o plugin `ddl_rewriter` envolve um pouco de sobrecarga mínima mesmo quando desativado. Para evitar essa sobrecarga, instale `ddl_rewriter` apenas pelo período durante o qual você pretende usá-lo.

O caso de uso principal é a modificação de declarações restauradas a partir de arquivos de dump, portanto, o padrão de uso típico é: 1) Instale o plugin; 2) restaure o arquivo ou arquivos de dump; 3) desinstale o plugin.

Para ser utilizável pelo servidor, o arquivo da biblioteca de plugins deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin, definindo o valor de `plugin_dir` na inicialização do servidor.

O nome de arquivo da biblioteca de plugins é `ddl_rewriter`. O sufixo do nome do arquivo difere de acordo com a plataforma (por exemplo, `.so` para sistemas Unix e Unix-like, `.dll` para Windows).

Para instalar o plugin `ddl_rewriter`, use a declaração `INSTALL PLUGIN`, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
INSTALL PLUGIN ddl_rewriter SONAME 'ddl_rewriter.so';
```

Para verificar a instalação do plugin, examine a tabela Schema de Informações `PLUGINS` ou use a declaração `SHOW PLUGINS` (consulte Seção 7.6.2, “Obtenção de Informações do Plugin do Servidor”). Por exemplo:

```
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS, PLUGIN_TYPE
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE 'ddl%';
+--------------+---------------+-------------+
| PLUGIN_NAME  | PLUGIN_STATUS | PLUGIN_TYPE |
+--------------+---------------+-------------+
| ddl_rewriter | ACTIVE        | AUDIT       |
+--------------+---------------+-------------+
```

Como o resultado anterior mostra, `ddl_rewriter` é implementado como um plugin de auditoria.

Se o plugin não conseguir se inicializar, verifique o log de erro do servidor em busca de mensagens de diagnóstico.

Uma vez instalado, conforme descrito anteriormente, `ddl_rewriter` permanece instalado até ser desinstalado. Para removê-lo, use `UNINSTALL PLUGIN`(uninstall-plugin.html "15.7.4.6 UNINSTALL PLUGIN Statement"):

```
UNINSTALL PLUGIN ddl_rewriter;
```

Se o `ddl_rewriter` estiver instalado, você pode usar a opção `--ddl-rewriter` para o início subsequente do servidor para controlar a ativação do plugin `ddl_rewriter`. Por exemplo, para impedir que o plugin seja habilitado em tempo de execução, use esta opção:

```
[mysqld]
ddl-rewriter=OFF
```

#### 7.6.5.2 Opções do Plugin ddl_rewriter

Esta seção descreve as opções de comando que controlam o funcionamento do plugin `ddl_rewriter`. Se os valores especificados no momento do início forem incorretos, o plugin `ddl_rewriter` pode não ser iniciado corretamente e o servidor não o carregará.

Para controlar a ativação do plugin `ddl_rewriter`, use esta opção:

* `--ddl-rewriter[=value]`

  <table frame="box" rules="all" summary="Properties for ddl-rewriter"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ddl-rewriter[=value]</code></td> </tr><tr><th>Introduced</th> <td>8.0.16</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>FORCE</code></p><p class="valid-value"><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

Esta opção controla como o servidor carrega o plugin `ddl_rewriter` no início. Está disponível apenas se o plugin tiver sido registrado anteriormente com `INSTALL PLUGIN` ou estiver carregado com `--plugin-load` ou `--plugin-load-add`. Veja a Seção 7.6.5.1, “Instalando ou Desinstalando ddl_rewriter”.

O valor da opção deve ser um dos disponíveis para opções de carregamento de plugins, conforme descrito na Seção 7.6.1, “Instalando e Desinstalando Plugins”. Por exemplo, `--ddl-rewriter=OFF` desativa o plugin no início do servidor.

### 7.6.6 Tokens de versão

O MySQL inclui Tokens de Versão, uma funcionalidade que permite a criação e sincronização de tokens de servidor que as aplicações podem usar para evitar o acesso a dados incorretos ou desatualizados.

A interface dos Tokens de versão tem essas características:

* Tokens de versão são pares que consistem em um nome que serve como chave ou identificador, mais um valor.

* Os tokens de versão podem ser bloqueados. Uma aplicação pode usar bloqueios de token para indicar a outras aplicações que cooperam que os tokens estão em uso e não devem ser modificados.

* As listas de tokens de versão são estabelecidas por servidor (por exemplo, para especificar a atribuição do servidor ou o estado operacional). Além disso, uma aplicação que se comunica com um servidor pode registrar sua própria lista de tokens que indicam o estado que o servidor deve estar. Uma declaração SQL enviada pela aplicação para um servidor que não está no estado necessário produz um erro. Esse é um sinal para a aplicação de que ela deve procurar um servidor diferente no estado necessário para receber a declaração SQL.

As seções a seguir descrevem os elementos dos Tokens de Versão, discutem como instalá-los e usá-los, e fornecem informações de referência sobre seus elementos.

#### 7.6.6.1 Tokens de versão Elementos

Version Tokens é baseado em uma biblioteca de plugins que implementa esses elementos:

* Um plugin do lado do servidor chamado `version_tokens` contém a lista de tokens de versão associados ao servidor e se inscreve em notificações para eventos de execução de declarações. O plugin `version_tokens` usa a [API do plugin de auditoria](/doc/extending-mysql/8.0/en/plugin-types.html#audit-plugin-type) para monitorar declarações recebidas dos clientes e combina a lista de tokens de versão específicos para cada sessão do cliente com a lista de tokens de versão do servidor. Se houver uma correspondência, o plugin permite que a declaração passe e o servidor continua a processá-la. Caso contrário, o plugin retorna um erro ao cliente e a declaração falha.

* Um conjunto de funções carregáveis oferece uma API em nível SQL para manipulação e inspeção da lista de tokens de versão do servidor mantidos pelo plugin. O privilégio `VERSION_TOKEN_ADMIN` (ou o privilégio descontinuado `SUPER`) é necessário para chamar qualquer uma das funções de Token de Versão.

* Quando o plugin `version_tokens` é carregado, ele define o privilégio dinâmico `VERSION_TOKEN_ADMIN`. Esse privilégio pode ser concedido aos usuários das funções.

* Uma variável do sistema permite que os clientes especifiquem a lista de tokens de versão que registram o estado do servidor necessário. Se o servidor tiver um estado diferente quando um cliente envia uma declaração, o cliente receberá um erro.

#### 7.6.6.2 Instalar ou desinstalar tokens de versão

Nota

Se instalado, o Version Tokens exige alguns custos adicionais. Para evitar esses custos, não o instale a menos que você planeje usá-lo.

Esta seção descreve como instalar ou desinstalar Tokens de versão, que é implementado em um arquivo de biblioteca de plugins que contém um plugin e funções carregáveis. Para informações gerais sobre como instalar ou desinstalar plugins e funções carregáveis, consulte Seção 7.6.1, “Instalando e Desinstalando Plugins”, e Seção 7.7.1, “Instalando e Desinstalando Funções Carregáveis”.

Para ser utilizável pelo servidor, o arquivo da biblioteca de plugins deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin, definindo o valor de `plugin_dir` na inicialização do servidor.

O nome de arquivo da biblioteca de plugins é `version_tokens`. O sufixo do nome do arquivo difere de acordo com a plataforma (por exemplo, `.so` para sistemas Unix e Unix-like, `.dll` para Windows).

Para instalar o plugin e as funções de Version Tokens, use as declarações `INSTALL PLUGIN` e `CREATE FUNCTION`, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
INSTALL PLUGIN version_tokens SONAME 'version_token.so';
CREATE FUNCTION version_tokens_set RETURNS STRING
  SONAME 'version_token.so';
CREATE FUNCTION version_tokens_show RETURNS STRING
  SONAME 'version_token.so';
CREATE FUNCTION version_tokens_edit RETURNS STRING
  SONAME 'version_token.so';
CREATE FUNCTION version_tokens_delete RETURNS STRING
  SONAME 'version_token.so';
CREATE FUNCTION version_tokens_lock_shared RETURNS INT
  SONAME 'version_token.so';
CREATE FUNCTION version_tokens_lock_exclusive RETURNS INT
  SONAME 'version_token.so';
CREATE FUNCTION version_tokens_unlock RETURNS INT
  SONAME 'version_token.so';
```

Você deve instalar as funções para gerenciar a lista de tokens da versão do servidor, mas também deve instalar o plugin, porque as funções não funcionam corretamente sem ele.

Se o plugin e as funções forem usadas em um servidor de fonte de replicação, instale-os em todos os servidores replicados também, para evitar problemas de replicação.

Uma vez instalado, conforme descrito anteriormente, o plugin e as funções permanecem instalados até serem desinstalados. Para removê-los, use as declarações `UNINSTALL PLUGIN` e `DROP FUNCTION`:

```
UNINSTALL PLUGIN version_tokens;
DROP FUNCTION version_tokens_set;
DROP FUNCTION version_tokens_show;
DROP FUNCTION version_tokens_edit;
DROP FUNCTION version_tokens_delete;
DROP FUNCTION version_tokens_lock_shared;
DROP FUNCTION version_tokens_lock_exclusive;
DROP FUNCTION version_tokens_unlock;
```

#### 7.6.6.3 Uso de Tokens de Versão

Antes de usar Tokens de versão, instale-o de acordo com as instruções fornecidas na Seção 7.6.6.2, “Instalando ou Desinstalando Tokens de versão”.

Um cenário em que os Tokens de Versão podem ser úteis é um sistema que acessa uma coleção de servidores MySQL, mas precisa gerenciá-los para fins de balanceamento de carga, monitorando-os e ajustando as atribuições dos servidores de acordo com as mudanças de carga. Esse sistema compreende esses elementos:

* A coleta de servidores MySQL a serem gerenciados. * Uma aplicação administrativa ou de gerenciamento que se comunica com os servidores e os organiza em grupos de alta disponibilidade. Os grupos servem a diferentes propósitos, e os servidores dentro de cada grupo podem ter diferentes atribuições. A atribuição de um servidor dentro de um determinado grupo pode mudar a qualquer momento.

* Aplicativos de clientes que acessam os servidores para recuperar e atualizar dados, escolhendo servidores de acordo com os propósitos atribuídos a eles. Por exemplo, um cliente não deve enviar uma atualização para um servidor somente de leitura.

As versões de tokens permitem que o acesso ao servidor seja gerenciado de acordo com a atribuição, sem que os clientes precisem consultar repetidamente os servidores sobre suas atribuições:

* O aplicativo de gerenciamento realiza atribuições de servidor e estabelece tokens de versão em cada servidor para refletir sua atribuição. O aplicativo armazena essas informações para fornecer um ponto de acesso central para elas.

Se, em algum momento, o aplicativo de gerenciamento precisar alterar uma atribuição de servidor (por exemplo, para mudar de permitir escritas para apenas leitura), ele altera a lista de tokens da versão do servidor e atualiza seu cache.

* Para melhorar o desempenho, as aplicações do cliente obtêm informações de cache do aplicativo de gerenciamento, permitindo que evitem a necessidade de recuperar informações sobre as atribuições do servidor para cada declaração. Com base no tipo de declarações que emite (por exemplo, leituras versus escritas), um cliente seleciona um servidor apropriado e se conecta a ele.

* Além disso, o cliente envia para o servidor seus próprios tokens específicos do cliente para registrar a atribuição que ele requer do servidor. Para cada declaração enviada pelo cliente para o servidor, o servidor compara sua própria lista de tokens com a lista de tokens do cliente. Se a lista de tokens do servidor contiver todos os tokens presentes na lista de tokens do cliente com os mesmos valores, há uma correspondência e o servidor executa a declaração.

Por outro lado, talvez a aplicação de gerenciamento tenha alterado a atribuição do servidor e sua lista de tokens de versão. Neste caso, a nova atribuição do servidor pode não ser compatível com os requisitos do cliente. Uma incompatibilidade de token entre as listas de tokens do servidor e do cliente ocorre e o servidor retorna um erro em resposta à declaração. Isso é uma indicação para o cliente atualizar suas informações de token de versão da cache da aplicação de gerenciamento e selecionar um novo servidor para se comunicar.

A lógica do lado do cliente para detectar erros de token de versão e selecionar um novo servidor pode ser implementada de diferentes maneiras:

* O cliente pode gerenciar todo o registro de token de versão, detecção de incompatibilidade e comutação de conexão.

* A lógica para essas ações pode ser implementada em um conector que gerencia as conexões entre clientes e servidores MySQL. Tal conector pode lidar com a detecção de erros de desajuste e a reenvio de declarações, ou pode passar o erro para o aplicativo e deixar que o aplicativo reenvie a declaração.

O exemplo a seguir ilustra a discussão anterior de forma mais concreta.

Quando o Version Tokens é inicializado em um servidor específico, a lista de tokens da versão do servidor está vazia. A manutenção da lista de tokens é realizada ao chamar funções. O privilégio `VERSION_TOKEN_ADMIN` (ou o privilégio descontinuado `SUPER`) é necessário para chamar qualquer uma das funções do Token de Versão, portanto, a modificação da lista de tokens deve ser feita por uma aplicação de gerenciamento ou administrativa que tenha esse privilégio.

Suponha que um aplicativo de gestão comunique-se com um conjunto de servidores que são consultados por clientes para acessar bancos de dados de funcionários e produtos (denominados `emp` e `prod`, respectivamente). Todos os servidores têm permissão para processar solicitações de recuperação de dados, mas apenas alguns deles têm permissão para fazer atualizações no banco de dados. Para lidar com isso de forma específica para o banco de dados, o aplicativo de gestão estabelece uma lista de tokens de versão em cada servidor. Na lista de tokens para um servidor específico, os nomes dos tokens representam os nomes dos bancos de dados e os valores dos tokens são `read` ou `write`, dependendo se o banco de dados deve ser usado de forma somente leitura ou se pode realizar leituras e escritas.

As aplicações do cliente registram uma lista de tokens de versão que exigem que o servidor corresponda, definindo uma variável do sistema. A definição da variável ocorre de forma específica para cada cliente, portanto, diferentes clientes podem registrar diferentes requisitos. Por padrão, a lista de tokens do cliente está vazia, o que corresponde a qualquer lista de tokens do servidor. Quando um cliente define sua lista de tokens como um valor não vazio, a correspondência pode ser bem-sucedida ou falhar, dependendo da lista de tokens da versão do servidor.

Para definir a lista de tokens de versão para um servidor, o aplicativo de gerenciamento chama a função `version_tokens_set()`. (Existem também funções para modificar e exibir a lista de tokens, descritas mais adiante.) Por exemplo, o aplicativo pode enviar essas declarações para um grupo de três servidores:

Servidor 1:

```
mysql> SELECT version_tokens_set('emp=read;prod=read');
+------------------------------------------+
| version_tokens_set('emp=read;prod=read') |
+------------------------------------------+
| 2 version tokens set.                    |
+------------------------------------------+
```

Servidor 2:

```
mysql> SELECT version_tokens_set('emp=write;prod=read');
+-------------------------------------------+
| version_tokens_set('emp=write;prod=read') |
+-------------------------------------------+
| 2 version tokens set.                     |
+-------------------------------------------+
```

Servidor 3:

```
mysql> SELECT version_tokens_set('emp=read;prod=write');
+-------------------------------------------+
| version_tokens_set('emp=read;prod=write') |
+-------------------------------------------+
| 2 version tokens set.                     |
+-------------------------------------------+
```

A lista de tokens em cada caso é especificada como uma lista de pares `name=value` separados por ponto e vírgula. Os valores resultantes da lista de tokens resultam nestas atribuições de servidor:

* Qualquer servidor aceita leituras para qualquer banco de dados.
* Apenas o servidor 2 aceita atualizações para o banco de dados `emp`.

* Apenas o servidor 3 aceita atualizações para o banco de dados `prod`.

Além de atribuir uma lista de tokens de versão a cada servidor, o aplicativo de gerenciamento também mantém um cache que reflete as atribuições dos servidores.

Antes de se comunicar com os servidores, um aplicativo cliente entra em contato com o aplicativo de gerenciamento e recupera informações sobre as atribuições dos servidores. Em seguida, o cliente seleciona um servidor com base nessas atribuições. Suponha que um cliente queira realizar leituras e escritas no banco de dados `emp`. Com base nas atribuições anteriores, apenas o servidor 2 se qualifica. O cliente se conecta ao servidor 2 e registra seus requisitos de servidor lá, definindo sua variável de sistema `version_tokens_session`:

```
mysql> SET @@SESSION.version_tokens_session = 'emp=write';
```

Para declarações subsequentes enviadas pelo cliente para o servidor 2, o servidor compara sua própria lista de tokens da versão com a lista do cliente para verificar se elas correspondem. Se sim, as declarações são executadas normalmente:

```
mysql> UPDATE emp.employee SET salary = salary * 1.1 WHERE id = 4981;
Query OK, 1 row affected (0.07 sec)
Rows matched: 1  Changed: 1  Warnings: 0

mysql> SELECT last_name, first_name FROM emp.employee WHERE id = 4981;
+-----------+------------+
| last_name | first_name |
+-----------+------------+
| Smith     | Abe        |
+-----------+------------+
1 row in set (0.01 sec)
```

As discrepâncias entre as listas de tokens da versão do servidor e do cliente podem ocorrer de duas maneiras:

* Um nome de token no valor `version_tokens_session` não está presente na lista de tokens do servidor. Nesse caso, ocorre um erro `ER_VTOKEN_PLUGIN_TOKEN_NOT_FOUND`.

* Um valor de token na `version_tokens_session` difere do valor do token correspondente na lista de tokens do servidor. Nesse caso, ocorre um erro `ER_VTOKEN_PLUGIN_TOKEN_MISMATCH`.

Enquanto a atribuição do servidor 2 não mudar, o cliente continua a usá-lo para leituras e escritas. Mas, suponha que o aplicativo de gerenciamento queira alterar as atribuições de servidor, de modo que as escritas para o banco de dados `emp` devem ser enviadas ao servidor 1 em vez do servidor 2. Para fazer isso, ele usa `version_tokens_edit()` para modificar o valor do token `emp` nos dois servidores (e atualiza sua cache de atribuições de servidor):

Servidor 1:

```
mysql> SELECT version_tokens_edit('emp=write');
+----------------------------------+
| version_tokens_edit('emp=write') |
+----------------------------------+
| 1 version tokens updated.        |
+----------------------------------+
```

Servidor 2:

```
mysql> SELECT version_tokens_edit('emp=read');
+---------------------------------+
| version_tokens_edit('emp=read') |
+---------------------------------+
| 1 version tokens updated.       |
+---------------------------------+
```

`version_tokens_edit()` modifica os tokens nomeados na lista de tokens do servidor e deixa outros tokens inalterados.

Na próxima vez que o cliente envia uma declaração para o servidor 2, sua própria lista de tokens não corresponde mais à lista de tokens do servidor e ocorre um erro:

```
mysql> UPDATE emp.employee SET salary = salary * 1.1 WHERE id = 4982;
ERROR 3136 (42000): Version token mismatch for emp. Correct value read
```

Nesse caso, o cliente deve entrar em contato com o aplicativo de gerenciamento para obter informações atualizadas sobre as atribuições do servidor, selecionar um novo servidor e enviar a declaração falha para o novo servidor.

Nota

Cada cliente deve cooperar com o Version Tokens enviando apenas declarações de acordo com a lista de tokens que ele registra em um servidor específico. Por exemplo, se um cliente registra uma lista de tokens como `'emp=read'`, não há nada no Version Tokens que impeça o cliente de enviar atualizações para o banco de dados [[`emp`]. O próprio cliente deve abster-se de fazer isso.

Para cada declaração recebida de um cliente, o servidor usa implicitamente o bloqueio, da seguinte forma:

* Tome um bloqueio compartilhado para cada token nomeado na lista de tokens do cliente (ou seja, no valor `version_tokens_session`)

* Realize a comparação entre as listas de tokens do servidor e do cliente

* Execute a declaração ou produza um erro, dependendo do resultado da comparação

* solte as trancas

O servidor utiliza bloqueios compartilhados para que as comparações para múltiplas sessões possam ocorrer sem bloqueio, ao mesmo tempo em que impede alterações nos tokens para qualquer sessão que tente adquirir um bloqueio exclusivo antes de manipular tokens dos mesmos nomes na lista de tokens do servidor.

O exemplo anterior usa apenas algumas das funções incluídas na biblioteca de plugins Version Tokens, mas há outras. Um conjunto de funções permite que a lista de tokens de versão do servidor seja manipulada e inspecionada. Outro conjunto de funções permite que os tokens de versão sejam bloqueados e desbloqueados.

Essas funções permitem a criação, alteração, remoção e inspeção da lista de tokens de versão do servidor:

* `version_tokens_set()` substitui completamente a lista atual e atribui uma nova lista. O argumento é uma lista separada por ponto e vírgula de pares `name=value`.

* `version_tokens_edit()` permite modificações parciais na lista atual. Pode adicionar novos tokens ou alterar os valores dos tokens existentes. O argumento é uma lista separada por ponto e vírgula de pares `name=value`.

* `version_tokens_delete()` exclui tokens da lista atual. O argumento é uma lista de nomes de tokens separados por ponto e vírgula.

* `version_tokens_show()` exibe a lista atual de tokens. Não aceita argumentos.

Cada uma dessas funções, se bem-sucedida, retorna uma string binária que indica qual ação ocorreu. O exemplo a seguir estabelece a lista de tokens do servidor, a modifica ao adicionar um novo token, exclui alguns tokens e exibe a lista de tokens resultante:

```
mysql> SELECT version_tokens_set('tok1=a;tok2=b');
+-------------------------------------+
| version_tokens_set('tok1=a;tok2=b') |
+-------------------------------------+
| 2 version tokens set.               |
+-------------------------------------+
mysql> SELECT version_tokens_edit('tok3=c');
+-------------------------------+
| version_tokens_edit('tok3=c') |
+-------------------------------+
| 1 version tokens updated.     |
+-------------------------------+
mysql> SELECT version_tokens_delete('tok2;tok1');
+------------------------------------+
| version_tokens_delete('tok2;tok1') |
+------------------------------------+
| 2 version tokens deleted.          |
+------------------------------------+
mysql> SELECT version_tokens_show();
+-----------------------+
| version_tokens_show() |
+-----------------------+
| tok3=c;               |
+-----------------------+
```

As advertências ocorrem se a lista de tokens estiver mal formada:

```
mysql> SELECT version_tokens_set('tok1=a; =c');
+----------------------------------+
| version_tokens_set('tok1=a; =c') |
+----------------------------------+
| 1 version tokens set.            |
+----------------------------------+
1 row in set, 1 warning (0.00 sec)

mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Warning
   Code: 42000
Message: Invalid version token pair encountered. The list provided
         is only partially updated.
1 row in set (0.00 sec)
```

Como mencionado anteriormente, os tokens de versão são definidos usando uma lista de pares `name=value` separados por ponto e vírgula. Considere esta invocação de `version_tokens_set()`:

```
mysql> SELECT version_tokens_set('tok1=b;;; tok2= a = b ; tok1 = 1\'2 3"4')
+---------------------------------------------------------------+
| version_tokens_set('tok1=b;;; tok2= a = b ; tok1 = 1\'2 3"4') |
+---------------------------------------------------------------+
| 3 version tokens set.                                         |
+---------------------------------------------------------------+
```

A versão Tokens interpreta o argumento da seguinte forma:

* Espaços em branco ao redor dos nomes e valores são ignorados. Espaços em branco dentro dos nomes e valores são permitidos. (Para `version_tokens_delete()`, que recebe uma lista de nomes sem valores, os espaços em branco ao redor dos nomes são ignorados.)

* Não há mecanismo de citação. * A ordem dos tokens não é significativa, exceto que, se uma lista de tokens contiver múltiplas instâncias de um nome de token dado, o último valor tem precedência sobre os valores anteriores.

Dadas essas regras, a chamada anterior `version_tokens_set()` resulta em uma lista de tokens com dois tokens: `tok1` tem o valor `1'2 3"4`, e `tok2` tem o valor `a = b`. Para verificar isso, chame `version_tokens_show()`:

```
mysql> SELECT version_tokens_show();
+--------------------------+
| version_tokens_show()    |
+--------------------------+
| tok2=a = b;tok1=1'2 3"4; |
+--------------------------+
```

Se a lista de tokens contém dois tokens, por que o `version_tokens_set()` retornou o valor `3 version tokens set`? Isso ocorreu porque a lista original de tokens continha duas definições para `tok1`, e a segunda definição substituiu a primeira.

As funções de manipulação de tokens Version Tokens colocam essas restrições nos nomes e valores dos tokens:

* Os nomes dos tokens não podem conter os caracteres `=` ou `;` e têm um comprimento máximo de 64 caracteres.

* Os valores dos tokens não podem conter caracteres `;`. O comprimento dos valores é limitado pelo valor da variável do sistema `max_allowed_packet`.

* Tokens da versão tratam os nomes e valores dos tokens como strings binárias, portanto, as comparações são sensíveis ao caso.

A versão Tokens também inclui um conjunto de funções que permitem que os tokens sejam bloqueados e desbloqueados:

* `version_tokens_lock_exclusive()` adquire blocos de versão exclusiva de bloqueio. Ele recebe uma lista de um ou mais nomes de bloqueio e um valor de tempo de espera.

* `version_tokens_lock_shared()` adquire blocos de versão compartilhada de token. Ele recebe uma lista de um ou mais nomes de bloqueio e um valor de tempo de espera.

* `version_tokens_unlock()` libera blocos de versão de tokens (exclusivos e compartilhados). Não aceita argumentos.

Cada função de bloqueio retorna um valor não nulo para sucesso. Caso contrário, ocorre um erro:

```
mysql> SELECT version_tokens_lock_shared('lock1', 'lock2', 0);
+-------------------------------------------------+
| version_tokens_lock_shared('lock1', 'lock2', 0) |
+-------------------------------------------------+
|                                               1 |
+-------------------------------------------------+

mysql> SELECT version_tokens_lock_shared(NULL, 0);
ERROR 3131 (42000): Incorrect locking service lock name '(null)'.
```

O bloqueio usando as funções de bloqueio de Tokens de versão é aconselhável; as aplicações devem concordar em cooperar.

É possível bloquear nomes de tokens não existentes. Isso não cria os tokens.

Nota

As funções de bloqueio de Tokens de versão são baseadas no serviço de bloqueio descrito na Seção 7.6.9.1, “O Serviço de Bloqueio”, e, portanto, têm a mesma semântica para bloqueios compartilhados e exclusivos. (Version Tokens usa as rotinas de serviço de bloqueio integradas ao servidor, não a interface da função do serviço de bloqueio, portanto, essas funções não precisam ser instaladas para usar Version Tokens.) Bloqueios adquiridos por Version Tokens usam um namespace de serviço de bloqueio de `version_token_locks`. Bloqueios de serviço de bloqueio podem ser monitorados usando o Schema de Desempenho, portanto, isso também é verdadeiro para os bloqueios de Version Tokens. Para detalhes, consulte Monitoramento do Serviço de Bloqueio.

Para as funções de bloqueio de Tokens de Versão, os argumentos do nome do token são usados exatamente conforme especificado. Espaços em branco ao redor não são ignorados e os caracteres `=` e `;` são permitidos. Isso ocorre porque os Tokens de Versão simplesmente passam os nomes dos tokens a serem bloqueados como é para o serviço de bloqueio.

#### 7.6.6.4 Referência de Tokens de Versão

A discussão a seguir serve como referência para esses elementos de Tokens de Versão:

* Funções dos Tokens de Versão
* Variáveis de Sistema dos Tokens de Versão

##### Tokens de versão Funções

A biblioteca de plugins Version Tokens inclui vários tipos de funções. Um conjunto de funções permite que a lista de tokens de versão do servidor seja manipulada e inspecionada. Outro conjunto de funções permite que os tokens de versão sejam bloqueados e desbloqueados. O privilégio `VERSION_TOKEN_ADMIN` (ou o privilégio descontinuado `SUPER`) é necessário para invocar qualquer função de Tokens de Versão.

As funções a seguir permitem a criação, alteração, remoção e inspeção da lista de tokens de versão do servidor. A interpretação dos argumentos *`name_list`* e *`token_list`* (incluindo o tratamento de espaços em branco) ocorre conforme descrito na Seção 7.6.6.3, “Usando Tokens de Versão”, que fornece detalhes sobre a sintaxe para especificar tokens, bem como exemplos adicionais.

* `version_tokens_delete(name_list)`

Exclui tokens da lista de tokens de versão do servidor usando o argumento *`name_list`* e retorna uma string binária que indica o resultado da operação. *`name_list`* é uma lista de nomes de tokens de versão separados por ponto e vírgula para excluir.

  ```
  mysql> SELECT version_tokens_delete('tok1;tok3');
  +------------------------------------+
  | version_tokens_delete('tok1;tok3') |
  +------------------------------------+
  | 2 version tokens deleted.          |
  +------------------------------------+
  ```

Um argumento de `NULL` é tratado como uma string vazia, que não tem efeito na lista de tokens.

`version_tokens_delete()` exclui os tokens nomeados em seu argumento, se eles existirem. (Não é um erro excluir tokens não existentes.) Para limpar a lista de tokens inteiramente sem saber quais tokens estão na lista, passe `NULL` ou uma string que não contenha tokens para `version_tokens_set()`:

  ```
  mysql> SELECT version_tokens_set(NULL);
  +------------------------------+
  | version_tokens_set(NULL)     |
  +------------------------------+
  | Version tokens list cleared. |
  +------------------------------+
  mysql> SELECT version_tokens_set('');
  +------------------------------+
  | version_tokens_set('')       |
  +------------------------------+
  | Version tokens list cleared. |
  +------------------------------+
  ```

* `version_tokens_edit(token_list)`

Modifica a lista de tokens de versão do servidor usando o argumento *`token_list`* e retorna uma string binária que indica o resultado da operação. *`token_list`* é uma lista de pares separados por ponto e vírgula `name=value`, especificando o nome de cada token a ser definido e seu valor. Se um token existir, seu valor é atualizado com o valor fornecido. Se um token não existir, ele é criado com o valor fornecido. Se o argumento for `NULL` ou uma string que não contenha tokens, a lista de tokens permanece inalterada.

  ```
  mysql> SELECT version_tokens_set('tok1=value1;tok2=value2');
  +-----------------------------------------------+
  | version_tokens_set('tok1=value1;tok2=value2') |
  +-----------------------------------------------+
  | 2 version tokens set.                         |
  +-----------------------------------------------+
  mysql> SELECT version_tokens_edit('tok2=new_value2;tok3=new_value3');
  +--------------------------------------------------------+
  | version_tokens_edit('tok2=new_value2;tok3=new_value3') |
  +--------------------------------------------------------+
  | 2 version tokens updated.                              |
  +--------------------------------------------------------+
  ```

* `version_tokens_set(token_list)`

Substitui a lista de tokens de versão do servidor pelos tokens definidos no argumento *`token_list`* e retorna uma string binária que indica o resultado da operação. *`token_list`* é uma lista de pares separados por ponto e vírgula `name=value` que especifica o nome de cada token a ser definido e seu valor. Se o argumento for `NULL` ou uma string que não contenha tokens, a lista de tokens é limpa.

  ```
  mysql> SELECT version_tokens_set('tok1=value1;tok2=value2');
  +-----------------------------------------------+
  | version_tokens_set('tok1=value1;tok2=value2') |
  +-----------------------------------------------+
  | 2 version tokens set.                         |
  +-----------------------------------------------+
  ```

* `version_tokens_show()`

Retorna a lista de tokens de versão do servidor como uma string binária contendo uma lista separada por ponto e vírgula de pares `name=value`.

  ```
  mysql> SELECT version_tokens_show();
  +--------------------------+
  | version_tokens_show()    |
  +--------------------------+
  | tok2=value2;tok1=value1; |
  +--------------------------+
  ```

As funções a seguir permitem que os tokens de versão sejam bloqueados e desbloqueados:

* `version_tokens_lock_exclusive(token_name[, token_name] ..., timeout)`(version-tokens-reference.html#function_version-tokens-lock-exclusive)

Adquire blocos exclusivos em uma ou mais tokens de versão, especificados pelo nome como strings, expirando com um erro se os blocos não forem adquiridos dentro do valor de tempo de espera especificado.

  ```
  mysql> SELECT version_tokens_lock_exclusive('lock1', 'lock2', 10);
  +-----------------------------------------------------+
  | version_tokens_lock_exclusive('lock1', 'lock2', 10) |
  +-----------------------------------------------------+
  |                                                   1 |
  +-----------------------------------------------------+
  ```

* `version_tokens_lock_shared(token_name[, token_name] ..., timeout)`(version-tokens-reference.html#function_version-tokens-lock-shared)

Adquire blocos de fechamento compartilhados em um ou mais tokens de versão, especificados por nome como strings, expirando com um erro se os blocos não forem adquiridos dentro do valor de tempo de espera especificado.

  ```
  mysql> SELECT version_tokens_lock_shared('lock1', 'lock2', 10);
  +--------------------------------------------------+
  | version_tokens_lock_shared('lock1', 'lock2', 10) |
  +--------------------------------------------------+
  |                                                1 |
  +--------------------------------------------------+
  ```

* `version_tokens_unlock()`

Libera todos os bloqueios que foram adquiridos durante a sessão atual usando `version_tokens_lock_exclusive()` e `version_tokens_lock_shared()`.

  ```
  mysql> SELECT version_tokens_unlock();
  +-------------------------+
  | version_tokens_unlock() |
  +-------------------------+
  |                       1 |
  +-------------------------+
  ```

As funções de bloqueio compartilham essas características:

* O valor de retorno não é nulo para sucesso. Caso contrário, ocorre um erro.

* Os nomes dos tokens são cadeias de caracteres. * Em contraste com o tratamento de argumentos para as funções que manipulam a lista de tokens do servidor, os espaços em branco que cercam os argumentos do nome do token não são ignorados e os caracteres `=` e `;` são permitidos.

* É possível bloquear nomes de tokens não existentes. Isso não cria os tokens.

* Os valores de tempo de espera são números inteiros não negativos que representam o tempo em segundos para esperar para adquirir bloqueios antes de expirar com um erro. Se o tempo de espera for 0, não há espera e a função produz um erro se os bloqueios não puderem ser adquiridos imediatamente.

* As funções de bloqueio de tokens de versão são baseadas no serviço de bloqueio descrito na Seção 7.6.9.1, “O Serviço de Bloqueio”.

##### Sistema de Tokens de Versão Variáveis

As versões Tokens de versão suportam as seguintes variáveis de sistema. Essas variáveis não estão disponíveis, a menos que o plugin Tokens de versão esteja instalado (consulte Seção 7.6.6.2, “Instalando ou Desinstalando Tokens de versão”).

Variáveis do sistema:

* `version_tokens_session`

  <table frame="box" rules="all" summary="Properties for version_tokens_session"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--version-tokens-session=value</code></td> </tr><tr><th>System Variable</th> <td><code>version_tokens_session</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>NULL</code></td> </tr></tbody></table>

O valor da sessão desta variável especifica a lista de tokens da versão do cliente e indica os tokens que a sessão do cliente exige que a lista de tokens da versão do servidor tenha.

Se a variável `version_tokens_session` for `NULL` (padrão) ou tiver um valor vazio, qualquer lista de tokens da versão do servidor corresponde. (Na prática, um valor vazio desativa os requisitos de correspondência.)

Se a variável `version_tokens_session` tiver um valor não vazio, qualquer desalinhamento entre seu valor e a lista de tokens da versão do servidor resulta em um erro para qualquer declaração que a sessão envie ao servidor. Um desalinhamento ocorre sob essas condições:

+ Um nome de token no valor `version_tokens_session` não está presente na lista de tokens do servidor. Neste caso, ocorre um erro `ER_VTOKEN_PLUGIN_TOKEN_NOT_FOUND`.

+ Um valor de token na `version_tokens_session` difere do valor do token correspondente na lista de tokens do servidor. Neste caso, ocorre um erro `ER_VTOKEN_PLUGIN_TOKEN_MISMATCH`.

Não é uma incompatibilidade que a lista de tokens da versão do servidor inclua um token que não esteja nomeado no valor `version_tokens_session`.

Suponha que um aplicativo de gerenciamento tenha definido a lista de tokens do servidor da seguinte forma:

  ```
  mysql> SELECT version_tokens_set('tok1=a;tok2=b;tok3=c');
  +--------------------------------------------+
  | version_tokens_set('tok1=a;tok2=b;tok3=c') |
  +--------------------------------------------+
  | 3 version tokens set.                      |
  +--------------------------------------------+
  ```

Um cliente registra os tokens que exige que o servidor corresponda, definindo seu valor `version_tokens_session`. Em seguida, para cada declaração subsequente enviada pelo cliente, o servidor verifica sua lista de tokens contra o valor do cliente `version_tokens_session` e produz um erro se houver uma discrepância:

  ```
  mysql> SET @@SESSION.version_tokens_session = 'tok1=a;tok2=b';
  mysql> SELECT 1;
  +---+
  | 1 |
  +---+
  | 1 |
  +---+

  mysql> SET @@SESSION.version_tokens_session = 'tok1=b';
  mysql> SELECT 1;
  ERROR 3136 (42000): Version token mismatch for tok1. Correct value a
  ```

O primeiro `SELECT` é bem-sucedido porque os tokens de cliente `tok1` e `tok2` estão presentes na lista de tokens do servidor e cada token tem o mesmo valor na lista do servidor. O segundo `SELECT` falha porque, embora `tok1` esteja presente na lista de tokens do servidor, ele tem um valor diferente do especificado pelo cliente.

Neste ponto, qualquer declaração enviada pelo cliente falha, a menos que a lista de tokens do servidor mude de forma que ela volte a corresponder. Suponha que o aplicativo de gerenciamento mude a lista de tokens do servidor da seguinte forma:

  ```
  mysql> SELECT version_tokens_edit('tok1=b');
  +-------------------------------+
  | version_tokens_edit('tok1=b') |
  +-------------------------------+
  | 1 version tokens updated.     |
  +-------------------------------+
  mysql> SELECT version_tokens_show();
  +-----------------------+
  | version_tokens_show() |
  +-----------------------+
  | tok3=c;tok1=b;tok2=b; |
  +-----------------------+
  ```

Agora o valor do cliente `version_tokens_session` corresponde à lista de tokens do servidor e o cliente pode, novamente, executar com sucesso as declarações:

  ```
  mysql> SELECT 1;
  +---+
  | 1 |
  +---+
  | 1 |
  +---+
  ```

* `version_tokens_session_number`

  <table frame="box" rules="all" summary="Properties for version_tokens_session_number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--version-tokens-session-number=#</code></td> </tr><tr><th>System Variable</th> <td><code>version_tokens_session_number</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr></tbody></table>

Esta variável é para uso interno.

### 7.6.7 O Plugin de Clone

O plugin de clonagem, introduzido no MySQL 8.0.17, permite clonar dados localmente ou a partir de uma instância remota do servidor MySQL. Os dados clonados são um instantâneo físico dos dados armazenados em `InnoDB` que incluem esquemas, tabelas, espaços de tabela e metadados do dicionário de dados. Os dados clonados compreendem um diretório de dados totalmente funcional, que permite o uso do plugin de clonagem para provisionamento do servidor MySQL.

**Figura 7.1 Operação de Clonagem Local**

![The CLONE LOCAL statement clones the data directory on a local MySQL Server instance to another local directory, which is referred to as the clone directory.](images/clone-local.png)

Uma operação de clonagem local clona dados da instância do servidor MySQL onde a operação de clonagem é iniciada para um diretório no mesmo servidor ou nó onde a instância do servidor MySQL está em execução.

**Figura 7.2 Operação de Clonagem Remota**

![The CLONE INSTANCE statement issued from the local recipient MySQL Server instance clones the data directory from the remote donor MySQL server instance to the data directory on the local recipient MySQL Server instance.](images/clone-remote.png)

Uma operação de clonagem remota envolve uma instância do servidor MySQL local (o “receptor”) onde a operação de clonagem é iniciada e uma instância do servidor MySQL remoto (o “doador”) onde os dados de origem estão localizados. Quando uma operação de clonagem remota é iniciada no receptor, os dados clonados são transferidos pela rede do doador para o receptor. Por padrão, uma operação de clonagem remota remove os dados criados pelo usuário (esquemas, tabelas, espaços de tabela) e logs binários do diretório de dados do receptor antes de clonar os dados do doador. Opcionalmente, você pode clonar dados para um diretório diferente no receptor para evitar a remoção de dados do diretório de dados atual do receptor.

Não há diferença em relação aos dados que são clonados por uma operação de clonagem local em comparação com uma operação de clonagem remota. Ambas as operações clonam o mesmo conjunto de dados.

O plugin de clonagem suporta a replicação. Além de clonar dados, uma operação de clonagem extrai e transfere as coordenadas de replicação do doador e as aplica no receptor, o que permite usar o plugin de clonagem para provisionamento de membros e réplicas da Replicação de Grupo. Usar o plugin de clonagem para provisionamento é consideravelmente mais rápido e eficiente do que replicar um grande número de transações (consulte Seção 7.6.7.7, “Clonagem para Replicação”). Os membros da Replicação de Grupo também podem ser configurados para usar o plugin de clonagem como um método alternativo de recuperação, de modo que os membros escolham automaticamente a maneira mais eficiente de recuperar dados do grupo a partir dos membros de semente. Para mais informações, consulte Seção 20.5.4.2, “Clonagem para Recuperação Distribuída”.

O plugin de clonagem suporta a clonagem de dados criptografados e compactados por página. Consulte a Seção 7.6.7.5, “Clonagem de Dados Criptografados”, e a Seção 7.6.7.6, “Clonagem de Dados Compactados”.

O plugin de clonagem deve ser instalado antes que você possa usá-lo. Para obter instruções de instalação, consulte a Seção 7.6.7.1, “Instalando o Plugin de Clonagem”. Para obter instruções de clonagem, consulte a Seção 7.6.7.2, “Clonando Dados Localmente”, e a Seção 7.6.7.3, “Clonando Dados Remotas”.

Tabelas e instrumentação do esquema de desempenho são fornecidas para monitorar operações de clonagem. Veja a Seção 7.6.7.10, “Monitoramento de operações de clonagem”.

#### 7.6.7.1 Instalar o Plugin Clone

Esta seção descreve como instalar e configurar o plugin de clonagem. Para operações de clonagem remota, o plugin de clonagem deve ser instalado nas instâncias do servidor MySQL do doador e do receptor.

Para informações gerais sobre a instalação ou desinstalação de plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

Para ser utilizável pelo servidor, o arquivo da biblioteca de plugins deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, defina o valor de `plugin_dir` na inicialização do servidor para informar ao servidor a localização do diretório do plugin.

O nome de arquivo da biblioteca de plugins é `mysql_clone.so`. O sufixo do nome do arquivo difere de acordo com a plataforma (por exemplo, `.so` para sistemas Unix e Unix-like, `.dll` para Windows).

Para carregar o plugin no início da inicialização do servidor, use a opção `--plugin-load-add` para nomear o arquivo da biblioteca que o contém. Com este método de carregamento de plugins, a opção deve ser dada toda vez que o servidor é iniciado. Por exemplo, coloque essas linhas em seu arquivo `my.cnf`, ajustando a extensão do nome do arquivo da biblioteca do plugin conforme necessário para sua plataforma. (A extensão do nome do arquivo da biblioteca do plugin depende da sua plataforma. Sufixos comuns são `.so` para sistemas Unix e Unix-like, `.dll` para Windows.)

```
[mysqld]
plugin-load-add=mysql_clone.so
```

Após modificar `my.cnf`, reinicie o servidor para que as novas configurações sejam aplicadas.

Nota

A opção `--plugin-load-add` não pode ser usada para carregar o plugin clone ao reiniciar o servidor durante uma atualização de uma versão anterior do MySQL. Por exemplo, após atualizar binários ou pacotes do MySQL 5.7 para MySQL 8.0, tentar reiniciar o servidor com `plugin-load-add=mysql_clone.so` causa esse erro: [ERROR] [MY-013238] [Servidor] Erro ao instalar o plugin 'clone': Não pode ser instalado durante a atualização. A solução é atualizar o servidor antes de tentar iniciar o servidor com `plugin-load-add=mysql_clone.so`.

Como alternativa, para carregar o plugin no tempo de execução, use esta declaração, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
INSTALL PLUGIN clone SONAME 'mysql_clone.so';
```

`INSTALL PLUGIN` carrega o plugin e também o registra na tabela do sistema `mysql.plugins` para fazer com que o plugin seja carregado em cada inicialização normal do servidor subsequente, sem a necessidade de `--plugin-load-add`.

Para verificar a instalação do plugin, examine a tabela Schema de Informações `PLUGINS` ou use a declaração `SHOW PLUGINS` (consulte Seção 7.6.2, “Obtenção de Informações do Plugin do Servidor”). Por exemplo:

```
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME = 'clone';
+------------------------+---------------+
| PLUGIN_NAME            | PLUGIN_STATUS |
+------------------------+---------------+
| clone                  | ACTIVE        |
+------------------------+---------------+
```

Se o plugin não conseguir se inicializar, verifique o log de erro do servidor em busca de mensagens de diagnóstico relacionadas ao clone ou ao plugin.

Se o plugin tiver sido registrado anteriormente com `INSTALL PLUGIN` ou estiver carregado com `--plugin-load-add`, você pode usar a opção `--clone` na inicialização do servidor para controlar o estado de ativação do plugin. Por exemplo, para carregar o plugin na inicialização e impedir que ele seja removido durante a execução, use essas opções:

```
[mysqld]
plugin-load-add=mysql_clone.so
clone=FORCE_PLUS_PERMANENT
```

Se você deseja impedir que o servidor seja executado sem o plugin de clonagem, use `--clone` com um valor de `FORCE` ou `FORCE_PLUS_PERMANENT` para forçar o fracasso da inicialização do servidor se o plugin não for iniciado com sucesso.

Para mais informações sobre os estados de ativação de plugins, consulte o controle do estado de ativação de plugins.

#### 7.6.7.2 Clonagem de Dados Localmente

O plugin de clonagem suporta a seguinte sintaxe para clonar dados localmente; ou seja, clonar dados do diretório de dados locais do MySQL para outro diretório no mesmo servidor ou nó onde a instância do servidor MySQL está em execução:

```
CLONE LOCAL DATA DIRECTORY [=] 'clone_dir';
```

Para usar a sintaxe `CLONE`, o plugin de clone deve ser instalado. Para obter instruções de instalação, consulte a Seção 7.6.7.1, “Instalando o Plugin de Clone”.

O privilégio `BACKUP_ADMIN` é necessário para executar as instruções `CLONE LOCAL DATA DIRECTORY`](clone.html "15.7.5 CLONE Statement").

```
mysql> GRANT BACKUP_ADMIN ON *.* TO 'clone_user';
```

onde `clone_user` é o usuário do MySQL que realiza a operação de clonagem. O usuário que você seleciona para realizar a operação de clonagem pode ser qualquer usuário do MySQL com o privilégio `BACKUP_ADMIN` em \*.\*.

O exemplo a seguir demonstra a clonagem de dados localmente:

```
mysql> CLONE LOCAL DATA DIRECTORY = '/path/to/clone_dir';
```

onde *`/path/to/clone_dir`* é o caminho completo do diretório local para onde os dados são clonados. É necessário um caminho absoluto, e o diretório especificado (*`clone_dir`*) não deve existir, mas o caminho especificado deve ser um caminho existente. O servidor MySQL deve ter o acesso de escrita necessário para criar o diretório.

Nota

Uma operação de clonagem local não suporta a clonagem de tabelas ou espaços de tabela criados pelo usuário que residem fora do diretório de dados. Tentar clonar tais tabelas ou espaços de tabela causa o seguinte erro: ERRO 1086 (HY000): O arquivo '*`/path/to/tablespace_name.ibd`*' já existe. A clonagem de um espaço de tabela com o mesmo caminho que o espaço de tabela de origem causaria um conflito e, portanto, é proibida.

Todas as outras tabelas criadas pelo usuário `InnoDB` e espaços de tabela, o espaço de tabela do sistema `InnoDB`, logs de reescrita e espaços de tabela de desfazer são clonados para o diretório especificado.

Se desejar, você pode iniciar o servidor MySQL no diretório clonado após a operação de clonagem estar concluída.

```
$> mysqld_safe --datadir=clone_dir
```

onde *`clone_dir`* é o diretório para o qual os dados foram clonados.

Para obter informações sobre o monitoramento do status e do progresso da operação de clonagem, consulte a Seção 7.6.7.10, “Monitoramento de Operações de Clonagem”.

#### 7.6.7.3 Clonagem de Dados Remotas

O plugin de clonagem suporta a seguinte sintaxe para clonar dados remotos; ou seja, clonar dados de uma instância de servidor MySQL remota (o doador) e transferi-los para a instância MySQL onde a operação de clonagem foi iniciada (o destinatário).

```
CLONE INSTANCE FROM 'user'@'host':port
IDENTIFIED BY 'password'
[DATA DIRECTORY [=] 'clone_dir']
[REQUIRE [NO] SSL];
```

onde:

* `user` é o usuário clone na instância do servidor MySQL do doador.

* `password` é a senha `user`.

* `host` é o endereço `hostname` do servidor MySQL do doador. O formato de endereço da versão 6 da Internet Protocol (IPv6) não é suportado. Um alias para o endereço IPv6 pode ser usado em vez disso. Um endereço IPv4 pode ser usado como está.

* `port` é o número `port` do servidor MySQL do doador. (O protocolo X especificado por `mysqlx_port` não é suportado. A conexão com a instância do servidor MySQL do doador através do MySQL Router também não é suportada.)

* `DATA DIRECTORY [=] 'clone_dir'` é uma cláusula opcional usada para especificar um diretório no destinatário para os dados que você está clonando. Use esta opção se você não quiser remover dados criados pelo usuário (esquemas, tabelas, espaços de tabela) e logs binários do diretório de dados do destinatário. É necessário um caminho absoluto e o diretório não pode existir. O servidor MySQL deve ter o acesso de escrita necessário para criar o diretório.

Quando a cláusula opcional `DATA DIRECTORY [=] 'clone_dir'` não é usada, uma operação de clonagem remove os dados criados pelo usuário (esquemas, tabelas, espaços de tabela) e logs binários do diretório de dados do destinatário, clona os novos dados para o diretório de dados do destinatário e reinicia automaticamente o servidor posteriormente.

* `[REQUIRE [NO] SSL]` especifica explicitamente se uma conexão criptografada deve ser usada ou não ao transferir dados clonados pela rede. Um erro é retornado se a especificação explícita não puder ser satisfeita. Se uma cláusula SSL não for especificada, o clone tenta estabelecer uma conexão criptografada por padrão, revertendo para uma conexão insegura se a tentativa de conexão segura falhar. Uma conexão segura é necessária ao clonar dados criptografados, independentemente de esta cláusula ser especificada. Para mais informações, consulte Configurando uma Conexão Criptografada para Clonagem.

Nota

Por padrão, as tabelas criadas pelo usuário `InnoDB` e os espaços de tabelas que residem no diretório de dados da instância do servidor MySQL do doador são clonados para o diretório de dados da instância do servidor MySQL do destinatário. Se a cláusula `DATA DIRECTORY [=] 'clone_dir'` for especificada, elas são clonadas para o diretório especificado.

As tabelas e espaços de tabelas criadas pelo usuário que residem fora do diretório de dados na instância do servidor MySQL do doador são clonadas para o mesmo caminho na instância do servidor MySQL do receptor. Um erro é relatado se uma tabela ou espaço de tabelas já existir.

Por padrão, o espaço de tabelas do sistema `InnoDB`, os registros de reescrita e os espaços de tabelas de desfazer são clonados para os mesmos locais que estão configurados no doador (conforme definido por `innodb_data_home_dir` e `innodb_data_file_path`, `innodb_log_group_home_dir` e `innodb_undo_directory`, respectivamente). Se a cláusula `DATA DIRECTORY [=] 'clone_dir'` for especificada, esses espaços de tabelas e registros são clonados para o diretório especificado.

##### Pré-requisitos para o Clonamento Remoto

Para realizar uma operação de clonagem, o plugin de clonagem deve estar ativo nas instâncias do servidor MySQL do doador e do receptor. Para obter instruções de instalação, consulte a Seção 7.6.7.1, “Instalando o Plugin de Clonagem”.

Um usuário MySQL no doador e no receptor é necessário para executar a operação de clonagem (o "usuário clone").

* Quanto ao doador, o usuário clone requer o privilégio `BACKUP_ADMIN` para acessar e transferir dados do doador e bloquear DDL concorrente durante a operação de clonagem. O DDL concorrente durante a operação de clonagem é bloqueado no doador antes do MySQL 8.0.27. A partir do MySQL 8.0.27, o DDL concorrente é permitido por padrão no doador. Veja a Seção 7.6.7.4, “Clonagem e DDL Concorrente”.

* No destinatário, o usuário clonado requer o privilégio `CLONE_ADMIN` para substituir os dados do destinatário, bloquear DDL no destinatário durante a operação de clonagem e reiniciar automaticamente o servidor. O privilégio `CLONE_ADMIN` inclui os privilégios `BACKUP_ADMIN` e `SHUTDOWN` implicitamente.

As instruções para criar o usuário clonado e conceder os privilégios necessários estão incluídas no exemplo de clonagem remota que segue essas informações prévias.

Os seguintes pré-requisitos são verificados quando a declaração `CLONE INSTANCE`](clone.html "15.7.5 CLONE Statement") é executada:

* O plugin clone é compatível com o MySQL 8.0.17 e versões posteriores. O servidor doador e o servidor receptor devem ser da mesma série do MySQL, como 8.0.37 e 8.0.41. Eles também devem ser da mesma versão de lançamento anterior a 8.0.37.

  ```
  mysql> SHOW VARIABLES LIKE 'version';
   +---------------+--------+
  | Variable_name | Value  |
  +---------------+--------+
  | version       | 8.0.44 |
  +---------------+--------+
  ```

O clonamento de uma instância de servidor MySQL doador para uma instância de servidor MySQL de correção de hotfix da mesma versão e versão é suportado a partir do MySQL 8.0.26.

O clonamento de diferentes versões de ponto dentro de uma série é suportado a partir do MySQL 8.0.37. As restrições anteriores ainda se aplicam a versões mais antigas do que 8.0.37. Por exemplo, não é permitido clonar 8.0.36 para 8.0.42 ou vice-versa.

* As instâncias do servidor MySQL do doador e do receptor devem rodar no mesmo sistema operacional e plataforma. Por exemplo, se a instância doador estiver rodando em uma plataforma Linux de 64 bits, a instância receptora também deve rodar nessa plataforma. Consulte a documentação do seu sistema operacional para obter informações sobre como determinar a plataforma do seu sistema operacional.

* O destinatário deve ter espaço suficiente no disco para os dados clonados. Por padrão, os dados criados pelo usuário (esquemas, tabelas, espaços de tabela) e os registros binários são removidos no destinatário antes da clonagem dos dados do doador, portanto, você só precisa de espaço suficiente para os dados do doador. Se você clonar para um diretório nomeado usando a cláusula `DATA DIRECTORY`, você deve ter espaço suficiente no disco para os dados do destinatário existentes e os dados clonados. Você pode estimar o tamanho dos seus dados, verificando o tamanho do diretório de dados no seu sistema de arquivos e o tamanho de quaisquer espaços de tabela que residem fora do diretório de dados. Ao estimar o tamanho dos dados no doador, lembre-se de que apenas os dados `InnoDB` são clonados. Se você armazenar dados em outros motores de armazenamento, ajuste sua estimativa de tamanho de dados conforme necessário.

* `InnoDB` permite a criação de alguns tipos de tablespace fora do diretório de dados. Se a instância do servidor MySQL do doador tiver tablespace que residem fora do diretório de dados, a operação de clonagem deve ser capaz de acessar esses tablespace. Você pode consultar a tabela Schema de Informações `FILES` para identificar os tablespace que residem fora do diretório de dados. Arquivos que residem fora do diretório de dados têm um caminho totalmente qualificado para um diretório que não é o diretório de dados.

  ```
  mysql> SELECT FILE_NAME FROM INFORMATION_SCHEMA.FILES;
  ```

* Os plugins que estão ativos no doador, incluindo qualquer plugin de chave, também devem estar ativos no destinatário. Você pode identificar plugins ativos emitindo uma declaração `SHOW PLUGINS` ou consultando a tabela do Esquema de Informações `PLUGINS`.

* O doador e o receptor devem ter o mesmo conjunto de caracteres e a mesma contagem de caracteres do servidor MySQL. Para obter informações sobre a configuração do conjunto de caracteres e contagem de caracteres do servidor MySQL, consulte a Seção 12.15, “Configuração de Conjunto de Caracteres”.

* Os mesmos ajustes `innodb_page_size` e `innodb_data_file_path` são necessários tanto no doador quanto no receptor. O ajuste `innodb_data_file_path` no doador e no receptor deve especificar o mesmo número de arquivos de dados de tamanho equivalente. Você pode verificar as configurações variáveis usando a sintaxe [`SHOW VARIABLES`](show-variables.html "15.7.7.41 SHOW VARIABLES Statement").

  ```
  mysql> SHOW VARIABLES LIKE 'innodb_page_size';
  mysql> SHOW VARIABLES LIKE 'innodb_data_file_path';
  ```

* Se estiver clonando dados criptografados ou compactados por página, o sistema de arquivos do doador e do receptor deve ter o mesmo tamanho de bloco. Para dados compactados por página, o sistema de arquivos do receptor deve suportar arquivos esparsos e perfuração de buracos para que a perfuração de buracos ocorra no receptor. Para obter informações sobre essas características e como identificar tabelas e espaços de tabelas que as utilizam, consulte a Seção 7.6.7.5, “Clonagem de Dados Criptografados”, e a Seção 7.6.7.6, “Clonagem de Dados Compactados”. Para determinar o tamanho do bloco do seu sistema de arquivos, consulte a documentação do seu sistema operacional.

* Uma conexão segura é necessária se você estiver clonando dados criptografados. Consulte Configurar uma conexão criptografada para clonagem.

* O ajuste `clone_valid_donor_list` no destinatário deve incluir o endereço do host da instância do servidor MySQL do doador. Você só pode clonar dados de um host na lista de doadores válida. Um usuário MySQL com o privilégio `SYSTEM_VARIABLES_ADMIN` é necessário para configurar essa variável. As instruções para definir a variável `clone_valid_donor_list` são fornecidas no exemplo de clonagem remota que segue esta seção. Você pode verificar o ajuste `clone_valid_donor_list` usando a sintaxe [`SHOW VARIABLES`](show-variables.html "15.7.7.41 SHOW VARIABLES Statement").

  ```
  mysql> SHOW VARIABLES LIKE 'clone_valid_donor_list';
  ```

* Não deve haver nenhuma outra operação de clonagem em execução. Apenas uma única operação de clonagem é permitida de cada vez. Para determinar se uma operação de clonagem está em execução, consulte a tabela `clone_status`. Veja o monitoramento de operações de clonagem usando as tabelas de Clonagem do Schema de Desempenho.

* O plugin de clone transfere dados em pacotes de 1 MB, além de metadados. O valor mínimo necessário `max_allowed_packet` é, portanto, de 2 MB nas instâncias do servidor MySQL do doador e do receptor. Um valor `max_allowed_packet` menor que 2 MB resulta em um erro. Use a seguinte consulta para verificar sua configuração `max_allowed_packet`:

  ```
  mysql> SHOW VARIABLES LIKE 'max_allowed_packet';
  ```

Os seguintes pré-requisitos também se aplicam:

* Os nomes dos arquivos dos espaços de tabela no doador devem ser únicos. Quando os dados são clonados para o receptor, os espaços de tabela, independentemente de sua localização no doador, são clonados para a localização `innodb_undo_directory` no receptor ou para o diretório especificado pela cláusula `DATA DIRECTORY [=] 'clone_dir'`, se usada. Nomes de arquivos de espaço de tabela duplicados no doador não são permitidos por esse motivo. A partir do MySQL 8.0.18, um erro é relatado se nomes de arquivos de espaço de tabela duplicados forem encontrados durante uma operação de clonagem. Antes do MySQL 8.0.18, a clonagem de espaços de tabela de desfazer com o mesmo nome de arquivo poderia resultar em arquivos de espaço de tabela de desfazer sendo sobrescritos no receptor.

Para visualizar os nomes dos arquivos de espaço de desfazer no doador para garantir que eles sejam únicos, consulte `INFORMATION_SCHEMA.FILES`:

  ```
  mysql> SELECT TABLESPACE_NAME, FILE_NAME FROM INFORMATION_SCHEMA.FILES
         WHERE FILE_TYPE LIKE 'UNDO LOG';
  ```

Para obter informações sobre a remoção e adição de arquivos de espaço de desfazer, consulte a Seção 17.6.3.4, “Espaços de desfazer”.

* Por padrão, a instância do servidor MySQL do destinatário é reiniciada (parada e iniciada) automaticamente após a clonagem dos dados. Para que um reinício automático ocorra, um processo de monitoramento deve estar disponível no destinatário para detectar as interrupções do servidor. Caso contrário, a operação de clonagem é interrompida com o seguinte erro após a clonagem dos dados, e a instância do servidor MySQL do destinatário é desligada:

  ```
  ERROR 3707 (HY000): Restart server failed (mysqld is not managed by supervisor process).
  ```

Esse erro não indica uma falha de clonagem. Isso significa que a instância do servidor MySQL do destinatário deve ser iniciada novamente manualmente após a clonagem dos dados. Após iniciar o servidor manualmente, você pode se conectar à instância do servidor MySQL do destinatário e verificar as tabelas de clone do Schema de desempenho para verificar se a operação de clonagem foi concluída com sucesso (consulte Monitoramento de operações de clonagem usando tabelas de clone do Schema de desempenho). A declaração `RESTART` tem o mesmo requisito de processo de monitoramento. Para mais informações, consulte a Seção 15.7.8.8, “Declaração RESTART”. Esse requisito não é aplicável se estiver clonando para um diretório nomeado usando a cláusula `DATA DIRECTORY`, pois um reinício automático não é realizado neste caso.

* Várias variáveis controlam vários aspectos de uma operação de clonagem remota. Antes de realizar uma operação de clonagem remota, revise as variáveis e ajuste as configurações conforme necessário para atender ao seu ambiente de computação. As variáveis de clonagem são definidas na instância do servidor MySQL do destinatário onde a operação de clonagem é executada. Veja a Seção 7.6.7.13, “Variáveis do sistema de clonagem”.

##### Clonagem de Dados Remotas

O exemplo a seguir demonstra a clonagem de dados remotos. Por padrão, uma operação de clonagem remota remove dados criados pelo usuário (esquemas, tabelas, espaços de tabela) e logs binários no destinatário, clona os novos dados para o diretório de dados do destinatário e reinicia o servidor MySQL posteriormente.

O exemplo assume que os pré-requisitos de clonagem remota estão atendidos. Veja Pré-requisitos de Clonagem Remota.

1. Faça login na instância do servidor MySQL do doador com uma conta de usuário administrativa.

1. Crie um usuário clone com o privilégio `BACKUP_ADMIN`.

      ```
      mysql> CREATE USER 'donor_clone_user'@'example.donor.host.com' IDENTIFIED BY 'password';
      mysql> GRANT BACKUP_ADMIN on *.* to 'donor_clone_user'@'example.donor.host.com';
      ```

2. Instale o plugin de clone:

      ```
      mysql> INSTALL PLUGIN clone SONAME 'mysql_clone.so';
      ```

2. Faça login na instância do servidor MySQL do destinatário com uma conta de usuário administrativa.

1. Crie um usuário clone com o privilégio `CLONE_ADMIN`.

      ```
      mysql> CREATE USER 'recipient_clone_user'@'example.recipient.host.com' IDENTIFIED BY 'password';
      mysql> GRANT CLONE_ADMIN on *.* to 'recipient_clone_user'@'example.recipient.host.com';
      ```

2. Instale o plugin de clone:

      ```
      mysql> INSTALL PLUGIN clone SONAME 'mysql_clone.so';
      ```

3. Adicione o endereço do host da instância do servidor MySQL do doador à configuração da variável `clone_valid_donor_list`.

      ```
      mysql> SET GLOBAL clone_valid_donor_list = 'example.donor.host.com:3306';
      ```

3. Faça login no servidor MySQL do destinatário como o usuário clone que você criou anteriormente (`recipient_clone_user'@'example.recipient.host.com`) e execute a instrução `CLONE INSTANCE`](clone.html "15.7.5 CLONE Statement").

   ```
   mysql> CLONE INSTANCE FROM 'donor_clone_user'@'example.donor.host.com':3306
          IDENTIFIED BY 'password';
   ```

Após os dados serem clonados, a instância do servidor MySQL no destinatário é reiniciada automaticamente.

Para obter informações sobre o monitoramento do status e do progresso da operação de clonagem, consulte a Seção 7.6.7.10, “Monitoramento de Operações de Clonagem”.

##### Clonagem em um Diretório Nomeado

Por padrão, uma operação de clonagem remota remove dados criados pelo usuário (esquemas, tabelas, espaços de tabela) e logs binários do diretório de dados do destinatário antes de clonar dados da instância do servidor MySQL do doador. Ao clonar para um diretório nomeado, você pode evitar remover dados do diretório de dados atual do destinatário.

O procedimento para clonar para um diretório nomeado é o mesmo procedimento descrito na Clonagem de Dados Remotas, com uma exceção: a declaração `CLONE INSTANCE`(clone.html "15.7.5 CLONE Statement") deve incluir a cláusula `DATA DIRECTORY`. Por exemplo:

```
mysql> CLONE INSTANCE FROM 'user'@'example.donor.host.com':3306
       IDENTIFIED BY 'password'
       DATA DIRECTORY = '/path/to/clone_dir';
```

É necessário um caminho absoluto e o diretório não pode existir. O servidor MySQL deve ter o acesso de escrita necessário para criar o diretório.

Ao clonar para um diretório nomeado, a instância do servidor MySQL do destinatário não é reiniciada automaticamente após a clonagem dos dados. Se você deseja reiniciar o servidor MySQL no diretório nomeado, você deve fazer isso manualmente:

```
$> mysqld_safe --datadir=/path/to/clone_dir
```

onde *`/path/to/clone_dir`* é o caminho para o diretório nomeado no destinatário.

##### Configurando uma Conexão Encriptada para Clonagem

Você pode configurar uma conexão criptografada para operações de clonagem remota para proteger os dados enquanto eles são clonados pela rede. Uma conexão criptografada é necessária por padrão ao clonar dados criptografados. (consulte Seção 7.6.7.5, “Clonagem de Dados Criptografados”).

As instruções que se seguem descrevem como configurar a instância do servidor MySQL do destinatário para usar uma conexão criptografada. Assume-se que a instância do servidor MySQL do doador já esteja configurada para usar conexões criptografadas. Se não for o caso, consulte a Seção 8.3.1, “Configurando o MySQL para usar Conexões Criptografadas”, para obter instruções de configuração do lado do servidor.

Para configurar a instância do servidor MySQL do destinatário para usar uma conexão criptografada:

1. Disponibilize os certificados e arquivos de chave do servidor MySQL do doador para o host receptor. Distribua os arquivos para o host receptor por meio de um canal seguro ou coloque-os em uma partição montada que seja acessível ao host receptor. Os certificados e arquivos de chave que devem ser disponibilizados incluem:

* `ca.pem`

O arquivo da autoridade de certificação (CA) autoassinada.

* `client-cert.pem`

O arquivo de certificado da chave pública do cliente.

* `client-key.pem`

O arquivo da chave privada do cliente.

2. Configure as seguintes opções de SSL na instância do servidor MySQL do destinatário.

* `clone_ssl_ca`

Especifica o caminho para o arquivo da autoridade de certificação autoassinada (CA).

* `clone_ssl_cert`

Especifica o caminho para o arquivo de certificado da chave pública do cliente.

* `clone_ssl_key`

Especifica o caminho para o arquivo da chave privada do cliente.

Por exemplo:

   ```
   clone_ssl_ca=/path/to/ca.pem
   clone_ssl_cert=/path/to/client-cert.pem
   clone_ssl_key=/path/to/client-key.pem
   ```

3. Para exigir que uma conexão criptografada seja usada, inclua a cláusula `REQUIRE SSL` ao emitir a declaração `CLONE` sobre o destinatário.

   ```
   mysql> CLONE INSTANCE FROM 'user'@'example.donor.host.com':3306
          IDENTIFIED BY 'password'
          DATA DIRECTORY = '/path/to/clone_dir'
          REQUIRE SSL;
   ```

Se uma cláusula SSL não for especificada, o plugin de clonagem tenta estabelecer uma conexão criptografada por padrão, revertendo para uma conexão não criptografada se a tentativa de conexão criptografada falhar.

Nota

Se você estiver clonando dados criptografados, uma conexão criptografada é necessária por padrão, independentemente de a cláusula `REQUIRE SSL` ser especificada. O uso de `REQUIRE NO SSL` causa um erro se você tentar clonar dados criptografados.

#### 7.6.7.4 Clonagem e DDL Concorrente

Antes do MySQL 8.0.27, as operações DDL nas instâncias do servidor MySQL do doador e do receptor, incluindo `TRUNCATE TABLE` e (truncate-table.html "15.1.37 TRUNCATE TABLE Statement"), não são permitidas durante uma operação de clonagem. Essa limitação deve ser considerada ao selecionar as fontes de dados. Uma solução é usar instâncias dedicadas do doador, que podem acomodar operações DDL sendo bloqueadas enquanto os dados são clonados.

Para evitar DDL concorrente durante uma operação de clonagem, uma trava de backup exclusiva é adquirida no doador e no receptor. A variável `clone_ddl_timeout` define o tempo em segundos no doador e no receptor que uma operação de clonagem espera por uma trava de backup. O ajuste padrão é de 300 segundos. Se uma trava de backup não for obtida com o limite de tempo especificado, a operação de clonagem falha com um erro.

A partir do MySQL 8.0.27, o DDL concorrente é permitido por padrão no doador. O suporte ao DDL concorrente no doador é controlado pela variável `clone_block_ddl`. O suporte ao DDL concorrente pode ser habilitado e desabilitado dinamicamente usando uma declaração `SET`.

```
SET GLOBAL clone_block_ddl={OFF|ON}
```

A configuração padrão é `clone_block_ddl=OFF`, que permite DDL concorrente no doador.

Se o efeito de uma operação de DDL concorrente é clonado ou não, depende se a operação de DDL termina antes de a operação de clonagem tomar o snapshot dinâmico.

As operações DDL que não são permitidas durante uma operação de clonagem, independentemente da configuração do `clone_block_ddl`, incluem:

* `ALTER TABLE tbl_name DISCARD TABLESPACE;`

* `ALTER TABLE tbl_name IMPORT TABLESPACE;`

* `ALTER INSTANCE DISABLE INNODB REDO_LOG;`

#### 7.6.7.5 Clonagem de Dados Encriptados

O clonamento de dados criptografados é suportado. Os seguintes requisitos se aplicam:

* Uma conexão segura é necessária ao clonar dados remotos para garantir a transferência segura de chaves de espaço de tabela não criptografadas pela rede. As chaves do espaço de tabela são descriptografadas no doador antes do transporte e re-criptografadas no receptor usando a chave mestre do receptor. Um erro é relatado se uma conexão criptografada não estiver disponível ou se a cláusula `REQUIRE NO SSL` for usada na declaração `CLONE INSTANCE`(clone.html "15.7.5 CLONE Statement"). Para informações sobre a configuração de uma conexão criptografada para clonagem, consulte Configurando uma Conexão Criptografada para Clonagem.

* Ao clonar dados para um diretório de dados local que utiliza uma chave de registro gerenciada localmente, a mesma chave de registro deve ser usada ao iniciar o servidor MySQL no diretório clonado.

* Ao clonar dados para um diretório de dados remoto (o diretório do destinatário) que utiliza uma chave de registro gerenciada localmente, a chave de registro do destinatário deve ser usada ao iniciar o servidor MySQL no diretório clonado.

Nota

Os ajustes das variáveis `innodb_redo_log_encrypt` e `innodb_undo_log_encrypt` não podem ser modificados enquanto uma operação de clonagem está em andamento.

Para informações sobre o recurso de criptografia de dados, consulte a Seção 17.13, “Criptografia de dados em repouso do InnoDB”.

#### 7.6.7.6 Clonagem de dados comprimidos

O clonamento de dados comprimidos por página é suportado. Os seguintes requisitos se aplicam ao clonar dados remotos:

* O sistema de arquivos do destinatário deve suportar arquivos esparsos e perfuração de buracos para que a perfuração de buracos ocorra no destinatário.

* Os sistemas de arquivos do doador e do receptor devem ter o mesmo tamanho de bloco. Se os tamanhos de bloco do sistema de arquivos diferirem, um erro semelhante ao seguinte é relatado: ERRO 3868 (HY000): Clone Configuration FS Block Size: O valor do doador: 114688 é diferente do valor do receptor: 4096.

Para obter informações sobre o recurso de compressão de página, consulte a Seção 17.9.2, “Compressão de página InnoDB”.

#### 7.6.7.7 Clonagem para Replicação

O plugin de clonagem suporta a replicação. Além de clonar dados, uma operação de clonagem extrai as coordenadas de replicação do doador e as transfere para o destinatário, o que permite o uso do plugin de clonagem para provisionamento de membros e réplicas da Replicação do Grupo. Usar o plugin de provisionamento é consideravelmente mais rápido e eficiente do que replicar um grande número de transações.

Os membros da replicação em grupo também podem ser configurados para usar o plugin de clonagem como uma opção para recuperação distribuída, e, nesse caso, os membros que se juntam automaticamente escolhem a maneira mais eficiente de recuperar os dados do grupo a partir dos membros do grupo existentes. Para mais informações, consulte a Seção 20.5.4.2, “Clonagem para Recuperação Distribuída”.

Durante a operação de clonagem, tanto a posição do log binário (nome do arquivo, deslocamento) quanto o conjunto de GTID `gtid_executed` são extraídos e transferidos do servidor de MySQL do doador para o receptor. Esses dados permitem iniciar a replicação em uma posição consistente no fluxo de replicação. Os logs binários e os logs de relevo, que são mantidos em arquivos, não são copiados do doador para o receptor. Para iniciar a replicação, os logs binários necessários para o receptor acompanhar o doador não devem ser apagados entre o momento em que os dados são clonados e o momento em que a replicação é iniciada. Se os logs binários necessários não estiverem disponíveis, um erro de aperto de mão de replicação é relatado. Uma instância clonada deve, portanto, ser adicionada a um grupo de replicação sem atraso excessivo para evitar que os logs binários necessários sejam apagados ou que o novo membro fique significativamente para trás, exigindo mais tempo de recuperação.

* Faça essa consulta em uma instância de servidor MySQL clonada para verificar a posição do log binário que foi transferida para o destinatário:

  ```
  mysql> SELECT BINLOG_FILE, BINLOG_POSITION FROM performance_schema.clone_status;
  ```

* Faça essa consulta em uma instância de servidor MySQL clonada para verificar o GTID `gtid_executed` configurado que foi transferido para o destinatário:

  ```
  mysql> SELECT @@GLOBAL.GTID_EXECUTED;
  ```

Por padrão no MySQL 8.0, os repositórios de metadados de replicação são mantidos em tabelas que são copiadas do doador para o receptor durante a operação de clonagem. Os repositórios de metadados de replicação contêm configurações relacionadas à replicação que podem ser usadas para retomá-la corretamente após a operação de clonagem.

* Em MySQL 8.0.17 e 8.0.18, apenas a tabela `mysql.slave_master_info` (o repositório de metadados de conexão) é copiada.

* A partir do MySQL 8.0.19, as tabelas `mysql.slave_relay_log_info` (repositório de metadados do aplicável) e `mysql.slave_worker_info` (repositório de metadados do trabalhador aplicável) também são copiadas.

Para uma lista do que está incluído em cada tabela, consulte a Seção 19.2.4.2, “Repositórios de metadados de replicação”. Note que, se as configurações `master_info_repository=FILE` e `relay_log_info_repository=FILE` forem usadas no servidor (o que não é o padrão no MySQL 8.0 e é descontinuado), os repositórios de metadados de replicação não serão clonados; eles serão clonados apenas se `TABLE` for definido.

Para clonar para replicação, realize as etapas a seguir:

1. Para um novo membro do grupo para Replicação em grupo, configure primeiro a instância do servidor MySQL para Replicação em grupo, seguindo as instruções na Seção 20.2.1.6, “Adicionando instâncias ao grupo”. Também configure os pré-requisitos para clonagem descritos na Seção 20.5.4.2, “Clonagem para recuperação distribuída”. Quando emitir `START GROUP_REPLICATION` no membro que está se juntando, a operação de clonagem é gerenciada automaticamente pelo Grupo de Replicação, então você não precisa realizar a operação manualmente e não precisa realizar quaisquer etapas de configuração adicionais no membro que está se juntando.

2. Para uma replica em uma topologia de replicação fonte/replica do MySQL, primeiro clone os dados do servidor MySQL do doador para o receptor manualmente. O doador deve ser uma fonte ou replica na topologia de replicação. Para instruções de clonagem, consulte a Seção 7.6.7.3, “Clonagem de Dados Remotas”.

3. Após a operação de clonagem ser concluída com sucesso, se você deseja usar os mesmos canais de replicação no servidor MySQL do receptor que estavam presentes no doador, verifique quais deles podem retomar a replicação automaticamente na topologia de replicação MySQL fonte/replica e quais precisam ser configurados manualmente.

* Para replicação com base em GTID, se o destinatário estiver configurado com `gtid_mode=ON` e tiver sido clonado a partir de um doador com `gtid_mode=ON`, `ON_PERMISSIVE` ou `OFF_PERMISSIVE`, o GTID `gtid_executed` do doador é aplicado no destinatário. Se o destinatário for clonado a partir de uma replica já na topologia, os canais de replicação no destinatário que utilizam posicionamento automático de GTID podem retomar a replicação automaticamente após a operação de clonagem quando o canal é iniciado. Você não precisa realizar nenhuma configuração manual se você apenas quiser usar esses mesmos canais.

* Para a replicação com base na posição do arquivo de registro binário, se o destinatário estiver no MySQL 8.0.17 ou 8.0.18, a posição do registro binário do doador não é aplicada no destinatário, apenas registrada na tabela do Schema de Desempenho `clone_status`. Portanto, os canais de replicação no destinatário que utilizam replicação com base na posição do arquivo de registro binário devem ser configurados manualmente para retomar a replicação após a operação de clonagem. Certifique-se de que esses canais não estejam configurados para iniciar a replicação automaticamente na inicialização do servidor, pois eles ainda não possuem a posição do registro binário e tentam iniciar a replicação desde o início.

* Para a replicação com base na posição do arquivo de registro binário, se o destinatário estiver no MySQL 8.0.19 ou superior, a posição do registro binário do doador é aplicada no destinatário. Os canais de replicação no destinatário que utilizam replicação com base na posição do arquivo de registro binário tentam automaticamente realizar o processo de recuperação do registro de relevo, usando as informações do registro de relevo clonado, antes de reiniciar a replicação. Para uma replica de único fio (`replica_parallel_workers` ou `slave_parallel_workers` é definido como 0), a recuperação do registro de relevo deve ser bem-sucedida na ausência de quaisquer outros problemas, permitindo que o canal retome a replicação sem mais configuração. Para uma replica de vários fios (`replica_parallel_workers` ou `slave_parallel_workers` é maior que 0), a recuperação do registro de relevo provavelmente falhará, pois geralmente não pode ser completada automaticamente. Neste caso, uma mensagem de erro é emitida e você deve configurar o canal manualmente.

4. Se você precisar configurar canais de replicação clonados manualmente ou quiser usar diferentes canais de replicação no destinatário, as instruções a seguir fornecem um resumo e exemplos abreviados para adicionar uma instância do servidor MySQL do destinatário a uma topologia de replicação. Consulte também as instruções detalhadas que se aplicam à sua configuração de replicação.

* Para adicionar uma instância de servidor MySQL de destinatário a uma topologia de replicação MySQL que utiliza transações baseadas em GTID como fonte de dados de replicação, configure a instância conforme necessário, seguindo as instruções na Seção 19.1.3.4, “Configurando a Replicação Usando GTIDs”. Adicione canais de replicação para a instância conforme mostrado no exemplo abreviado a seguir. A declaração `CHANGE REPLICATION SOURCE TO` (change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") (do MySQL 8.0.23) ou a declaração `CHANGE MASTER TO` (antes do MySQL 8.0.23) deve definir o endereço do host e o número de porta da fonte, e a opção `SOURCE_AUTO_POSITION` | `MASTER_AUTO_POSITION` deve ser habilitada, conforme mostrado:

     ```
     mysql> CHANGE MASTER TO MASTER_HOST = 'source_host_name', MASTER_PORT = source_port_num,
            ...
            MASTER_AUTO_POSITION = 1,
            FOR CHANNEL 'setup_channel';
     mysql> START SLAVE USER = 'user_name' PASSWORD = 'password' FOR CHANNEL 'setup_channel';

     Or from MySQL 8.0.22 and 8.0.23:

     mysql> CHANGE SOURCE TO SOURCE_HOST = 'source_host_name', SOURCE_PORT = source_port_num,
            ...
            SOURCE_AUTO_POSITION = 1,
            FOR CHANNEL 'setup_channel';
     mysql> START REPLICA USER = 'user_name' PASSWORD = 'password' FOR CHANNEL 'setup_channel';
     ```

* Para adicionar uma instância de servidor MySQL do destinatário a uma topologia de replicação MySQL que utiliza replicação com base na posição do arquivo de registro binário, configure a instância conforme necessário, seguindo as instruções na Seção 19.1.2, “Configurando a replicação com base na posição do arquivo de registro binário”. Adicione canais de replicação para a instância, conforme mostrado no exemplo abreviado a seguir, usando a posição do registro binário que foi transferida para o destinatário durante a operação de clonagem:

     ```
     mysql> SELECT BINLOG_FILE, BINLOG_POSITION FROM performance_schema.clone_status;
     mysql> CHANGE MASTER TO MASTER_HOST = 'source_host_name', MASTER_PORT = source_port_num,
            ...
            MASTER_LOG_FILE = 'source_log_name',
            MASTER_LOG_POS = source_log_pos,
            FOR CHANNEL 'setup_channel';
     mysql> START SLAVE USER = 'user_name' PASSWORD = 'password' FOR CHANNEL 'setup_channel';

     Or from MySQL 8.0.22 and 8.0.23:

     mysql> SELECT BINLOG_FILE, BINLOG_POSITION FROM performance_schema.clone_status;
     mysql> CHANGE SOURCE TO SOURCE_HOST = 'source_host_name', SOURCE_PORT = source_port_num,
            ...
            SOURCE_LOG_FILE = 'source_log_name',
            SOURCE_LOG_POS = source_log_pos,
            FOR CHANNEL 'setup_channel';
     mysql> START REPLICA USER = 'user_name' PASSWORD = 'password' FOR CHANNEL 'setup_channel';
     ```

#### 7.6.7.8 Diretórios e Arquivos Criados Durante uma Operação de Clonagem

Quando os dados são clonados, os seguintes diretórios e arquivos são criados para uso interno. Eles não devem ser modificados.

* `#clone`: Contém arquivos internos de clone usados pela operação de clonagem. Criado no diretório para o qual os dados são clonados.

* `#ib_archive`: Contém arquivos de registro arquivados internamente, arquivados no doador durante a operação de clonagem.

* Arquivos `*.#clone`: Arquivos temporários criados no destinatário enquanto os dados são removidos do diretório de dados do destinatário e novos dados são clonados durante uma operação de clonagem remota.

#### 7.6.7.9 Gerenciamento de falha na operação de clonagem remota

Esta seção descreve a gestão de falhas em diferentes estágios de uma operação de clonagem.

1. Os pré-requisitos são verificados (consulte Pré-requisitos para Clonagem Remota).

* Se ocorrer um erro durante a verificação prévia, a operação `CLONE INSTANCE`](clone.html "15.7.5 CLONE Statement") reporta um erro.

2. Antes do MySQL 8.0.27, uma bloqueio de backup nos blocos do doador e do receptor impede operações DDL concorrentes. A partir do MySQL 8.0.27, DDL concorrente no doador é bloqueado apenas se a variável `clone_block_ddl` estiver definida como `ON` (a configuração padrão é `OFF`). Veja a Seção 7.6.7.4, “Clonagem e DDL Concorrente”.

* Se a operação de clonagem não conseguir obter um bloqueio DDL dentro do limite de tempo especificado pela variável `clone_ddl_timeout`, um erro é relatado.

Os dados criados pelo usuário (esquemas, tabelas, espaços de tabela) e os registros binários do destinatário são removidos antes de os dados serem clonados para o diretório de dados do destinatário.

* Quando os dados criados pelo usuário e os logs binários são removidos do diretório de dados do destinatário durante uma operação de clonagem remota, os dados não são salvos e podem ser perdidos se ocorrer uma falha. Se os dados forem importantes, um backup deve ser feito antes de iniciar uma operação de clonagem remota.

Para fins informativos, os avisos são impressos no log de erro do servidor para especificar quando a remoção de dados começa e termina:

     ```
     [Warning] [MY-013453] [InnoDB] Clone removing all user data for provisioning:
     Started...

     [Warning] [MY-013453] [InnoDB] Clone removing all user data for provisioning:
     Finished
     ```

Se ocorrer um erro durante a remoção de dados, o destinatário pode ficar com um conjunto parcial de esquemas, tabelas e espaços de tabela que existiam antes da operação de clonagem. Em qualquer momento durante a execução de uma operação de clonagem ou após um erro, o servidor sempre está em um estado consistente.

4. Os dados são clonados a partir do doador. Os dados criados pelo usuário, metadados do dicionário e outros dados do sistema são clonados.

* Se ocorrer um erro durante a clonagem de dados, a operação de clonagem é revertida e todos os dados clonados são removidos. Nesta fase, os dados previamente existentes criados pelo usuário e os registros binários no destinatário também são removidos.

Se esse cenário ocorrer, você pode corrigir a causa do erro e reexecutar a operação de clonagem, ou renunciar à operação de clonagem e restaurar os dados do destinatário a partir de um backup feito antes da operação de clonagem.

5. O servidor é reiniciado automaticamente (aplica-se a operações de clonagem remota que não clonam para um diretório nomeado). Durante a inicialização, as tarefas típicas de inicialização do servidor são realizadas.

* Se o reinício automático do servidor falhar, você pode reiniciar o servidor manualmente para completar a operação de clonagem.

Antes do MySQL 8.0.24, se ocorrer um erro de rede durante uma operação de clonagem, a operação será retomada se o erro for resolvido dentro de cinco minutos. A partir do MySQL 8.0.24, a operação será retomada se o erro for resolvido dentro do tempo especificado pela variável `clone_donor_timeout_after_network_failure`, definida na instância do doador. O ajuste padrão de `clone_donor_timeout_after_network_failure` é de 5 minutos, mas é suportada uma faixa de 0 a 30 minutos. Se a operação não for retomada dentro do tempo alocado, ela será interrompida e retornará um erro, e o doador descartará o instantâneo. Um ajuste de zero faz com que o doador descarte o instantâneo imediatamente quando ocorre um erro de rede. Configurar um tempo de espera mais longo permite mais tempo para resolver problemas de rede, mas também aumenta o tamanho do delta na instância do doador, o que aumenta o tempo de recuperação do clone, bem como o atraso na replicação em casos em que o clone é destinado como membro de uma replica ou grupo de replicação.

Antes do MySQL 8.0.24, os threads do doador usam a configuração `wait_timeout` do MySQL Server ao ouvir comandos do protocolo Clone. Como resultado, uma configuração baixa `wait_timeout` poderia fazer com que uma operação de clonagem remota em andamento por muito tempo excedesse o tempo de espera. A partir do MySQL 8.0.24, o tempo de espera idle do Clone é definido para a configuração padrão `wait_timeout`, que é de 28800 segundos (8 horas).

#### 7.6.7.10 Monitoramento de operações de clonagem

Esta seção descreve as opções para monitorar operações de clonagem.

* Monitoramento de operações de clonagem usando tabelas de esquema de desempenho Clone
* Monitoramento de operações de clonagem usando eventos de estágio do esquema de desempenho
* [Monitoramento de operações de clonagem usando instrumentação de clonagem do esquema de desempenho](clone-plugin-monitoring.html#clone-plugin-performance-schema-instruments "Monitoring Cloning Operations Using Performance Schema Clone Instrumentation")

* A variável de status Com_clone

##### Monitoramento de operações de clonagem usando Tabelas de Clonamento do Schema de Desempenho

Uma operação de clonagem pode levar algum tempo para ser concluída, dependendo da quantidade de dados e de outros fatores relacionados à transferência de dados. Você pode monitorar o status e o progresso de uma operação de clonagem na instância do servidor MySQL do destinatário usando as tabelas do Schema de Desempenho `clone_status` e `clone_progress`.

Nota

As tabelas do esquema de desempenho `clone_status` e `clone_progress` podem ser usadas para monitorar uma operação de clonagem na instância do servidor MySQL do receptor apenas. Para monitorar uma operação de clonagem na instância do servidor MySQL do doador, use os eventos da etapa de clonagem, conforme descrito em Monitoramento de operações de clonagem usando eventos de etapa do esquema de desempenho.

* A tabela `clone_status` fornece o estado da operação de clonagem atual ou da última operação executada. Uma operação de clonagem tem quatro estados possíveis: `Not Started`, `In Progress`, `Completed` e `Failed`.

* A tabela `clone_progress` fornece informações sobre o progresso da operação de clone atual ou da última operação executada, por estágio. Os estágios de uma operação de clonagem incluem `DROP DATA`, `FILE COPY`, `PAGE_COPY`, `REDO_COPY`, `FILE_SYNC`, `RESTART` e `RECOVERY`.

Os privilégios `SELECT` e `EXECUTE` no Schema de Desempenho são necessários para acessar as tabelas de clone do Schema de Desempenho.

Para verificar o estado de uma operação de clonagem:

1. Conecte-se à instância do servidor MySQL do destinatário.
2. Faça uma consulta à tabela `clone_status`:

   ```
   mysql> SELECT STATE FROM performance_schema.clone_status;
   +-----------+
   | STATE     |
   +-----------+
   | Completed |
   +-----------+
   ```

Se ocorrer um erro durante uma operação de clonagem, você pode consultar a tabela `clone_status` para obter informações sobre o erro:

```
mysql> SELECT STATE, ERROR_NO, ERROR_MESSAGE FROM performance_schema.clone_status;
+-----------+----------+---------------+
| STATE     | ERROR_NO | ERROR_MESSAGE |
+-----------+----------+---------------+
| Failed    |      xxx | "xxxxxxxxxxx" |
+-----------+----------+---------------+
```

Para revisar os detalhes de cada etapa de uma operação de clonagem:

1. Conecte-se à instância do servidor MySQL do destinatário.
2. Faça uma consulta à tabela `clone_progress`. Por exemplo, a seguinte consulta fornece dados de estado e hora final para cada etapa da operação de clonagem:

   ```
   mysql> SELECT STAGE, STATE, END_TIME FROM performance_schema.clone_progress;
   +-----------+-----------+----------------------------+
   | stage     | state     | end_time                   |
   +-----------+-----------+----------------------------+
   | DROP DATA | Completed | 2019-01-27 22:45:43.141261 |
   | FILE COPY | Completed | 2019-01-27 22:45:44.457572 |
   | PAGE COPY | Completed | 2019-01-27 22:45:44.577330 |
   | REDO COPY | Completed | 2019-01-27 22:45:44.679570 |
   | FILE SYNC | Completed | 2019-01-27 22:45:44.918547 |
   | RESTART   | Completed | 2019-01-27 22:45:48.583565 |
   | RECOVERY  | Completed | 2019-01-27 22:45:49.626595 |
   +-----------+-----------+----------------------------+
   ```

Para outros pontos de dados de status e progresso de clone que você pode monitorar, consulte a Seção 29.12.19, “Tabelas de Schema de Desempenho Clone”.

##### Monitoramento de operações de clonagem usando eventos de estágio do Schema de desempenho

Uma operação de clonagem pode levar algum tempo para ser concluída, dependendo da quantidade de dados e outros fatores relacionados à transferência de dados. Existem três eventos de estágio para monitorar o progresso de uma operação de clonagem. Cada evento de estágio relata os valores `WORK_COMPLETED` e `WORK_ESTIMATED`. Os valores relatados são revisados à medida que a operação avança.

Esse método de monitoramento de uma operação de clonagem pode ser usado na instância do servidor MySQL do doador ou do receptor.

Em ordem de ocorrência, os eventos da etapa da operação de clonagem incluem:

* `stage/innodb/clone (file copy)`: Indica o progresso da fase de cópia de arquivo da operação de clonagem. As unidades `WORK_ESTIMATED` e `WORK_COMPLETED` são pedaços de arquivo. O número de arquivos a serem transferidos é conhecido no início da fase de cópia de arquivo, e o número de pedaços é estimado com base no número de arquivos. `WORK_ESTIMATED` é definido pelo número de pedaços de arquivo estimados. `WORK_COMPLETED` é atualizado após cada pedaço ser enviado.

* `stage/innodb/clone (page copy)`: Indica o progresso da fase de cópia da página da operação de clonagem. As unidades `WORK_ESTIMATED` e `WORK_COMPLETED` são páginas. Uma vez que a fase de cópia do arquivo é concluída, o número de páginas a serem transferidas é conhecido e `WORK_ESTIMATED` é ajustado para esse valor. `WORK_COMPLETED` é atualizado após cada página ser enviada.

* `stage/innodb/clone (redo copy)`: Indica o progresso da fase de cópia de volta da operação de clonagem. As unidades `WORK_ESTIMATED` e `WORK_COMPLETED` são blocos de cópia de volta. Uma vez que a fase de cópia da página é concluída, o número de blocos de cópia de volta a serem transferidos é conhecido e `WORK_ESTIMATED` é ajustado para esse valor. `WORK_COMPLETED` é atualizado após cada bloco ser enviado.

O exemplo a seguir demonstra como habilitar os instrumentos de evento `stage/innodb/clone%` e as tabelas de consumo relacionadas para monitorar uma operação de clonagem. Para informações sobre os instrumentos de evento de estágio do Schema de Desempenho e os consumidores relacionados, consulte a Seção 29.12.5, “Tabelas de Evento de Estágio do Schema de Desempenho”.

1. Ative os instrumentos `stage/innodb/clone%`:

   ```
   mysql> UPDATE performance_schema.setup_instruments SET ENABLED = 'YES'
          WHERE NAME LIKE 'stage/innodb/clone%';
   ```

2. Ative as tabelas de consumo de eventos de estágio, que incluem `events_stages_current`, `events_stages_history` e `events_stages_history_long`.

   ```
   mysql> UPDATE performance_schema.setup_consumers SET ENABLED = 'YES'
          WHERE NAME LIKE '%stages%';
   ```

3. Execute uma operação de clonagem. Neste exemplo, um diretório de dados local é clonado para um diretório denominado `cloned_dir`.

   ```
   mysql> CLONE LOCAL DATA DIRECTORY = '/path/to/cloned_dir';
   ```

4. Verifique o progresso da operação de clonagem consultando a tabela do Schema de desempenho `events_stages_current`. O evento em andamento mostrado difere dependendo da fase de clonagem que está em andamento. A coluna `WORK_COMPLETED` mostra o trabalho concluído. A coluna `WORK_ESTIMATED` mostra o trabalho necessário no total.

   ```
   mysql> SELECT EVENT_NAME, WORK_COMPLETED, WORK_ESTIMATED FROM performance_schema.events_stages_current
          WHERE EVENT_NAME LIKE 'stage/innodb/clone%';
   +--------------------------------+----------------+----------------+
   | EVENT_NAME                     | WORK_COMPLETED | WORK_ESTIMATED |
   +--------------------------------+----------------+----------------+
   | stage/innodb/clone (redo copy) |              1 |              1 |
   +--------------------------------+----------------+----------------+
   ```

A tabela `events_stages_current` retorna um conjunto vazio se a operação de clonagem tiver sido concluída. Nesse caso, você pode verificar a tabela `events_stages_history` para visualizar os dados do evento da operação concluída. Por exemplo:

   ```
   mysql> SELECT EVENT_NAME, WORK_COMPLETED, WORK_ESTIMATED FROM events_stages_history
          WHERE EVENT_NAME LIKE 'stage/innodb/clone%';
   +--------------------------------+----------------+----------------+
   | EVENT_NAME                     | WORK_COMPLETED | WORK_ESTIMATED |
   +--------------------------------+----------------+----------------+
   | stage/innodb/clone (file copy) |            301 |            301 |
   | stage/innodb/clone (page copy) |              0 |              0 |
   | stage/innodb/clone (redo copy) |              1 |              1 |
   +--------------------------------+----------------+----------------+
   ```

##### Monitoramento de operações de clonagem usando instrumentação de esquema de desempenho Clone

O Schema de desempenho oferece instrumentação para monitoramento avançado do desempenho das operações de clone. Para visualizar a instrumentação de clone disponível e emitir a seguinte consulta:

```
mysql> SELECT NAME,ENABLED FROM performance_schema.setup_instruments
       WHERE NAME LIKE '%clone%';
+---------------------------------------------------+---------+
| NAME                                              | ENABLED |
+---------------------------------------------------+---------+
| wait/synch/mutex/innodb/clone_snapshot_mutex      | NO      |
| wait/synch/mutex/innodb/clone_sys_mutex           | NO      |
| wait/synch/mutex/innodb/clone_task_mutex          | NO      |
| wait/synch/mutex/group_rpl/LOCK_clone_donor_list  | NO      |
| wait/synch/mutex/group_rpl/LOCK_clone_handler_run | NO      |
| wait/synch/mutex/group_rpl/LOCK_clone_query       | NO      |
| wait/synch/mutex/group_rpl/LOCK_clone_read_mode   | NO      |
| wait/synch/cond/group_rpl/COND_clone_handler_run  | NO      |
| wait/io/file/innodb/innodb_clone_file             | YES     |
| stage/innodb/clone (file copy)                    | YES     |
| stage/innodb/clone (redo copy)                    | YES     |
| stage/innodb/clone (page copy)                    | YES     |
| statement/abstract/clone                          | YES     |
| statement/clone/local                             | YES     |
| statement/clone/client                            | YES     |
| statement/clone/server                            | YES     |
| memory/innodb/clone                               | YES     |
| memory/clone/data                                 | YES     |
+---------------------------------------------------+---------+
```

###### Aguarde Instrumentos

Os instrumentos de espera do esquema de desempenho rastreiam eventos que levam tempo. Os instrumentos de espera de clone incluem:

* `wait/synch/mutex/innodb/clone_snapshot_mutex`: Acompanha eventos de espera para o mutxo do snapshot do clone, que sincroniza o acesso ao objeto de snapshot dinâmico (no doador e no receptor) entre vários threads do clone.

* `wait/synch/mutex/innodb/clone_sys_mutex`: Acompanha eventos de espera para o mutex do sistema clone. Há um objeto de sistema clone em uma instância do servidor MySQL. Este mutxo sincroniza o acesso ao objeto do sistema clone no doador e no receptor. É adquirido por threads de clone e outros threads de primeiro plano e de segundo plano.

* `wait/synch/mutex/innodb/clone_task_mutex`: Acompanha eventos de espera para o mutex da tarefa clonada, utilizado para gerenciamento de tarefas clonadas. O `clone_task_mutex` é adquirido por threads clonadas.

* `wait/io/file/innodb/innodb_clone_file`: Registra todas as operações de espera de E/S para os arquivos que o clone opera.

Para informações sobre o monitoramento das esperas dos mutexes `InnoDB`, consulte a Seção 17.16.2, “Monitoramento das esperas dos mutexes InnoDB usando o Gerador de desempenho”. Para informações sobre o monitoramento dos eventos de espera em geral, consulte a Seção 29.12.4, “Tabelas de eventos de espera do Gerador de desempenho”.

###### Instrumentos de palco

Os eventos de esquema de desempenho rastreiam os passos que ocorrem durante o processo de execução de declarações. Os instrumentos de evento de etapa clonados incluem:

* `stage/innodb/clone (file copy)`: Indica o progresso da fase de cópia do arquivo da operação de clonagem.

* `stage/innodb/clone (redo copy)`: Indica o progresso da fase de cópia de volta da operação de clonagem.

* `stage/innodb/clone (page copy)`: Indica o progresso da fase de cópia da página da operação de clonagem.

Para obter informações sobre o monitoramento de operações de clonagem usando eventos de estágio, consulte Monitoramento de operações de clonagem usando eventos de estágio do Schema de desempenho. Para informações gerais sobre o monitoramento de eventos de estágio, consulte Seção 29.12.5, “Tabelas de eventos de estágio do Schema de desempenho”.

###### Instrumentos de declaração

Os eventos de declaração do esquema de desempenho rastreiam a execução das declarações. Quando uma operação de clone é iniciada, os diferentes tipos de declaração rastreados pelos instrumentos de declaração de clone podem ser executados em paralelo. Você pode observar esses eventos de declaração no quadro de eventos do esquema de desempenho. O número de declarações que são executadas depende das configurações de `clone_max_concurrency` e `clone_autotune_concurrency`.

Os instrumentos de declaração de eventos clonados incluem:

* `statement/abstract/clone`: Registra eventos de declaração para qualquer operação de clone antes que ela seja classificada como um tipo de operação local, cliente ou de servidor.

* `statement/clone/local`: Acompanha eventos de declaração de clone para operações de clone locais; gerado quando executa uma declaração `CLONE LOCAL` (clone.html "15.7.5 CLONE Statement").

* `statement/clone/client`: Acompanha eventos de declaração de clonagem remota que ocorrem na instância do servidor MySQL do destinatário; gerado quando executa uma declaração `CLONE INSTANCE` (clone.html "15.7.5 CLONE Statement") no destinatário.

* `statement/clone/server`: Acompanha eventos de declaração de clonagem remota que ocorrem na instância do servidor MySQL do doador; gerado quando executa uma declaração `CLONE INSTANCE` (clone.html "15.7.5 CLONE Statement") no receptor.

Para obter informações sobre o monitoramento de eventos de declaração do Schema de desempenho, consulte a Seção 29.12.6, “Tabelas de Eventos de Declaração do Schema de Desempenho”.

###### Instrumentos de Memória

Os instrumentos de memória do Schema de desempenho rastreiam o uso da memória. Os instrumentos de uso de memória clonada incluem:

* `memory/innodb/clone`: Acompanha a memória alocada por `InnoDB` para o instantâneo dinâmico.

* `memory/clone/data`: Registra a memória alocada pelo plugin de clone durante uma operação de clone.

Para obter informações sobre o monitoramento do uso da memória usando o Gerador de desempenho, consulte a Seção 29.12.20.10, “Tabelas de resumo de memória”.

##### A variável de status Com_clone

A variável de status `Com_clone` fornece um contador de execuções da declaração `CLONE`.

Para mais informações, consulte a discussão sobre as variáveis de contagem de declarações `Com_xxx` na Seção 7.1.10, “Variáveis de Status do Servidor”.

#### 7.6.7.11 Parando uma operação de clonagem

Se necessário, você pode interromper uma operação de clonagem com uma declaração [[`KILL QUERY processlist_id`][(kill.html "15.7.8.4 KILL Statement")]].

No servidor do servidor do destinatário, você pode recuperar o identificador do processo (PID) para uma operação de clonagem da coluna `PID` da tabela `clone_status`.

```
mysql> SELECT * FROM performance_schema.clone_status\G
*************************** 1. row ***************************
             ID: 1
            PID: 8
          STATE: In Progress
     BEGIN_TIME: 2019-07-15 11:58:36.767
       END_TIME: NULL
         SOURCE: LOCAL INSTANCE
    DESTINATION: /path/to/clone_dir/
       ERROR_NO: 0
  ERROR_MESSAGE:
    BINLOG_FILE:
BINLOG_POSITION: 0
  GTID_EXECUTED:
```

Você também pode recuperar o identificador do processo a partir da coluna `ID` da tabela `INFORMATION_SCHEMA` `PROCESSLIST`, a coluna `Id` da saída [`SHOW PROCESSLIST`(show-processlist.html "15.7.7.29 SHOW PROCESSLIST Statement") ou a coluna `PROCESSLIST_ID` da tabela do Schema de Desempenho `threads`. Esses métodos de obtenção das informações do PID podem ser usados no servidor MySQL do doador ou do receptor.

#### 7.6.7.12 Referência de variável de sistema clonada

**Tabela 7.7 Referência de variável do sistema de clone**

<table frame="box" rules="all" summary="Reference for clone command-line options, system variables, and status variables. Clone variables are configured on the recipient MySQL server instance where the cloning operation is executed."><col style="width: 20%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><thead><tr><th scope="col">Name</th> <th scope="col">Cmd-Line</th> <th scope="col">Option File</th> <th scope="col">System Var</th> <th scope="col">Status Var</th> <th scope="col">Var Scope</th> <th scope="col">Dynamic</th> </tr></thead><tbody><tr><th scope="row">clone_autotune_concurrency</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">clone_block_ddl</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">clone_buffer_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">clone_ddl_timeout</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">clone_delay_after_data_drop</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">clone_donor_timeout_after_network_failure</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">clone_enable_compression</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">clone_max_concurrency</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">clone_max_data_bandwidth</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">clone_max_network_bandwidth</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">clone_ssl_ca</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">clone_ssl_cert</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">clone_ssl_key</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">clone_valid_donor_list</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr></tbody></table>

#### 7.6.7.13 Clonar variáveis do sistema

Esta seção descreve as variáveis do sistema que controlam o funcionamento do plugin de clonagem. Se os valores especificados na inicialização estiverem incorretos, o plugin de clonagem pode não ser iniciado corretamente e o servidor não o carregará. Nesse caso, o servidor também pode produzir mensagens de erro para outras configurações de clonagem, pois não as reconhece.

Cada variável do sistema tem um valor padrão. As variáveis do sistema podem ser definidas na inicialização do servidor usando opções na linha de comando ou em um arquivo de opções. Elas podem ser alteradas dinamicamente durante a execução usando a declaração `SET`, que permite modificar o funcionamento do servidor sem precisar parar e reiniciar.

Definir um valor de variável de tempo de execução de sistema global normalmente requer o privilégio `SYSTEM_VARIABLES_ADMIN` (ou o privilégio descontinuado `SUPER`). Para mais informações, consulte a Seção 7.1.9.1, “Privilégios de variáveis de sistema”.

As variáveis de clonagem são configuradas na instância do servidor MySQL do destinatário onde a operação de clonagem é executada.

* `clone_autotune_concurrency`

  <table frame="box" rules="all" summary="Properties for clone_autotune_concurrency"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--clone-autotune-concurrency</code></td> </tr><tr><th>Introduced</th> <td>8.0.17</td> </tr><tr><th>System Variable</th> <td><code>clone_autotune_concurrency</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

Quando `clone_autotune_concurrency` está habilitado (o padrão), os threads adicionais para operações de clonagem remota são gerados dinamicamente para otimizar a velocidade de transferência de dados. O ajuste é aplicável apenas à instância do servidor MySQL do destinatário.

Durante uma operação de clonagem, o número de threads aumenta gradualmente em direção a um alvo de o dobro do número atual de threads. O efeito na velocidade de transferência de dados é avaliado em cada incremento. O processo continua ou para de acordo com as seguintes regras:

+ Se a velocidade de transferência de dados se degrada em mais de 5% com um aumento incremental, o processo é interrompido.

+ Se houver pelo menos uma melhoria de 5% após atingir 25% do alvo, o processo continua. Caso contrário, o processo é interrompido.

+ Se houver pelo menos uma melhoria de 10% após atingir 50% do alvo, o processo continua. Caso contrário, o processo é interrompido.

+ Se houver pelo menos uma melhoria de 25% após atingir o alvo, o processo continua em direção a um novo alvo de o dobro da quantidade atual de fios. Caso contrário, o processo para.

O processo de autoajuste não suporta a diminuição do número de threads.

A variável `clone_max_concurrency` define o número máximo de threads que podem ser geradas.

Se `clone_autotune_concurrency` estiver desativado, `clone_max_concurrency` define o número de threads geradas para uma operação de clonagem remota.

* `clone_buffer_size`

  <table frame="box" rules="all" summary="Properties for clone_buffer_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--clone-buffer-size</code></td> </tr><tr><th>Introduced</th> <td>8.0.17</td> </tr><tr><th>System Variable</th> <td><code>clone_buffer_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>4194304</code></td> </tr><tr><th>Minimum Value</th> <td><code>1048576</code></td> </tr><tr><th>Maximum Value</th> <td><code>268435456</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>

Define o tamanho do buffer intermediário usado ao transferir dados durante uma operação de clonagem local. O valor padrão é de 4 megabítes (MiB). Um tamanho de buffer maior pode permitir que os controladores de dispositivos de E/S obtenham dados em paralelo, o que pode melhorar o desempenho da clonagem.

* `clone_block_ddl`

  <table frame="box" rules="all" summary="Properties for clone_block_ddl"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--clone-block-ddl</code></td> </tr><tr><th>Introduced</th> <td>8.0.27</td> </tr><tr><th>System Variable</th> <td><code>clone_block_ddl</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

Permite um bloqueio exclusivo de backup na instância do servidor MySQL do doador durante uma operação de clonagem, o que bloqueia operações DDL concorrentes no doador. Veja a Seção 7.6.7.4, “Clonagem e DDL Concorrente”.

* `clone_delay_after_data_drop`

  <table frame="box" rules="all" summary="Properties for clone_delay_after_data_drop"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--clone-delay-after-data-drop</code></td> </tr><tr><th>Introduced</th> <td>8.0.29</td> </tr><tr><th>System Variable</th> <td><code>clone_delay_after_data_drop</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>3600</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>

Especifica um período de atraso imediatamente após a remoção de dados existentes na instância do servidor MySQL do destinatário no início de uma operação de clonagem remota. O atraso é destinado a fornecer tempo suficiente para o sistema de arquivos no host do destinatário liberar espaço antes de os dados serem clonados da instância do servidor MySQL do doador. Certos sistemas de arquivos, como o VxFS, liberam o espaço livre de forma assíncrona em um processo de fundo. Nesses sistemas de arquivos, a clonagem de dados muito cedo após a remoção de dados existentes pode resultar em falhas na operação de clonagem devido ao espaço insuficiente. O período máximo de atraso é de 3600 segundos (1 hora). O ajuste padrão é 0 (sem atraso).

Essa variável é aplicável apenas para operação de clonagem remota e é configurada na instância do servidor MySQL do destinatário.

* `clone_ddl_timeout`

  <table frame="box" rules="all" summary="Properties for clone_ddl_timeout"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--clone-ddl-timeout</code></td> </tr><tr><th>Introduced</th> <td>8.0.17</td> </tr><tr><th>System Variable</th> <td><code>clone_ddl_timeout</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>300</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>2592000</code></td> </tr><tr><th>Unit</th> <td>seconds</td> </tr></tbody></table>

O tempo em segundos que uma operação de clonagem espera por um bloqueio de backup. O bloqueio de backup bloqueia DDL concorrente ao executar uma operação de clonagem. Esta configuração é aplicada tanto nas instâncias do servidor MySQL do doador quanto do receptor.

Um valor de 0 significa que a operação de clonagem não aguarda uma bloqueio de backup. Nesse caso, a execução de uma operação de DDL concorrente pode fazer com que a operação de clonagem falhe.

Antes do MySQL 8.0.27, o bloqueio de backup impede operações DDL concorrentes tanto no doador quanto no receptor durante uma operação de clonagem, e uma operação de clonagem não pode prosseguir até que as operações DDL atuais sejam concluídas. A partir do MySQL 8.0.27, o DDL concorrente é permitido no doador durante uma operação de clonagem se a variável `clone_block_ddl` for definida como `OFF` (o padrão). Neste caso, a operação de clonagem não precisa esperar por um bloqueio de backup no doador. Ver Seção 7.6.7.4, “Clonagem e DDL Concorrente”.

* `clone_donor_timeout_after_network_failure`

  <table frame="box" rules="all" summary="Properties for clone_donor_timeout_after_network_failure"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--clone-donor-timeout-after-network-failure</code></td> </tr><tr><th>Introduced</th> <td>8.0.24</td> </tr><tr><th>System Variable</th> <td><code>clone_donor_timeout_after_network_failure</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>30</code></td> </tr><tr><th>Unit</th> <td>minutes</td> </tr></tbody></table>

Define o período de tempo em minutos que o doador permite que o destinatário se reconecte e reinicie uma operação de clonagem após uma falha na rede. Para mais informações, consulte a Seção 7.6.7.9, "Tratamento de falha na operação de clonagem remota".

Essa variável é definida na instância do servidor MySQL do doador. Definí-la na instância do servidor MySQL do destinatário não tem efeito.

* `clone_enable_compression`

  <table frame="box" rules="all" summary="Properties for clone_enable_compression"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--clone-enable-compression</code></td> </tr><tr><th>Introduced</th> <td>8.0.17</td> </tr><tr><th>System Variable</th> <td><code>clone_enable_compression</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

Permite a compressão de dados na camada de rede durante uma operação de clonagem remota. A compressão economiza a largura de banda da rede em detrimento do uso da CPU. A ativação da compressão pode melhorar a taxa de transferência de dados. Esta configuração é aplicada apenas na instância do servidor MySQL do destinatário.

* `clone_max_concurrency`

  <table frame="box" rules="all" summary="Properties for clone_max_concurrency"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--clone-max-concurrency</code></td> </tr><tr><th>Introduced</th> <td>8.0.17</td> </tr><tr><th>System Variable</th> <td><code>clone_max_concurrency</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>16</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>128</code></td> </tr><tr><th>Unit</th> <td>threads</td> </tr></tbody></table>

Define o número máximo de threads concorrentes para uma operação de clonagem remota. O valor padrão é 16. Um número maior de threads pode melhorar o desempenho da clonagem, mas também reduz o número de conexões de clientes permitidas simultaneamente, o que pode afetar o desempenho das conexões de clientes existentes. Esta configuração é aplicada apenas na instância do servidor MySQL do destinatário.

Se `clone_autotune_concurrency` estiver habilitado (o padrão), `clone_max_concurrency` é o número máximo de threads que podem ser geradas dinamicamente para uma operação de clonagem remota. Se `clone_autotune_concurrency` estiver desabilitada, `clone_max_concurrency` define o número de threads geradas para uma operação de clonagem remota.

Uma taxa mínima de transferência de dados de 1 megabit (MiB) por fio é recomendada para operações de clonagem remota. A taxa de transferência de dados para uma operação de clonagem remota é controlada pela variável `clone_max_data_bandwidth`.

* `clone_max_data_bandwidth`

  <table frame="box" rules="all" summary="Properties for clone_max_data_bandwidth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--clone-max-data-bandwidth</code></td> </tr><tr><th>Introduced</th> <td>8.0.17</td> </tr><tr><th>System Variable</th> <td><code>clone_max_data_bandwidth</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr><tr><th>Unit</th> <td>miB/second</td> </tr></tbody></table>

Define a taxa máxima de transferência de dados em megabits (MiB) por segundo para uma operação de clonagem remota. Esta variável ajuda a gerenciar o impacto de desempenho de uma operação de clonagem. Um limite deve ser definido apenas quando a largura de banda de I/O do disco do doador está saturada, afetando o desempenho. Um valor de 0 significa "sem limite", o que permite que as operações de clonagem sejam realizadas na taxa de transferência de dados mais alta possível. Esta configuração é aplicável apenas à instância do servidor MySQL do receptor.

A taxa mínima de transferência de dados é de 1 MiB por segundo, por fio. Por exemplo, se houver 8 fios, a taxa mínima de transferência é de 8 MiB por segundo. A variável `clone_max_concurrency` controla o número máximo de fios gerados para uma operação de clonagem remota.

A taxa de transferência de dados solicitada especificada por `clone_max_data_bandwidth` pode diferir da taxa de transferência de dados real relatada pela coluna `DATA_SPEED` na tabela `performance_schema.clone_progress`. Se a operação de clonagem não está alcançando a taxa de transferência de dados desejada e você tem largura de banda disponível, verifique o uso de I/O no receptor e no doador. Se houver largura de banda subutilizada, o I/O é o gargalo mais provável.

* `clone_max_network_bandwidth`

  <table frame="box" rules="all" summary="Properties for clone_max_network_bandwidth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--clone-max-network-bandwidth</code></td> </tr><tr><th>Introduced</th> <td>8.0.17</td> </tr><tr><th>System Variable</th> <td><code>clone_max_network_bandwidth</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr><tr><th>Unit</th> <td>miB/second</td> </tr></tbody></table>

Especifica a taxa máxima de transferência de rede aproximada em megabits (MiB) por segundo para uma operação de clonagem remota. Esta variável pode ser usada para gerenciar o impacto de desempenho de uma operação de clonagem no largura de banda da rede. Deve ser definida apenas quando a largura de banda da rede está saturada, afetando o desempenho da instância do servidor do doador. Um valor de 0 significa “sem limite”, o que permite a clonagem na taxa de transferência de dados mais alta possível na rede, proporcionando o melhor desempenho. Esta configuração é aplicável apenas à instância do servidor MySQL do receptor.

* `clone_ssl_ca`

  <table frame="box" rules="all" summary="Properties for clone_buffer_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--clone-buffer-size</code></td> </tr><tr><th>Introduced</th> <td>8.0.17</td> </tr><tr><th>System Variable</th> <td><code>clone_buffer_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>4194304</code></td> </tr><tr><th>Minimum Value</th> <td><code>1048576</code></td> </tr><tr><th>Maximum Value</th> <td><code>268435456</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>0

Especifica o caminho para o arquivo da autoridade de certificação (CA). É usado para configurar uma conexão criptografada para uma operação de clonagem remota. Esta configuração configurada no destinatário e usada ao se conectar ao doador.

* `clone_ssl_cert`

  <table frame="box" rules="all" summary="Properties for clone_buffer_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--clone-buffer-size</code></td> </tr><tr><th>Introduced</th> <td>8.0.17</td> </tr><tr><th>System Variable</th> <td><code>clone_buffer_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>4194304</code></td> </tr><tr><th>Minimum Value</th> <td><code>1048576</code></td> </tr><tr><th>Maximum Value</th> <td><code>268435456</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>1

Especifica o caminho do certificado da chave pública. É usado para configurar uma conexão criptografada para uma operação de clonagem remota. Esta configuração é configurada no destinatário e usada ao se conectar ao doador.

* `clone_ssl_key`

  <table frame="box" rules="all" summary="Properties for clone_buffer_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--clone-buffer-size</code></td> </tr><tr><th>Introduced</th> <td>8.0.17</td> </tr><tr><th>System Variable</th> <td><code>clone_buffer_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>4194304</code></td> </tr><tr><th>Minimum Value</th> <td><code>1048576</code></td> </tr><tr><th>Maximum Value</th> <td><code>268435456</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>2

Especifica o caminho do arquivo da chave privada. É usado para configurar uma conexão criptografada para uma operação de clonagem remota. Esta configuração é configurada no destinatário e usada ao se conectar ao doador.

* `clone_valid_donor_list`

  <table frame="box" rules="all" summary="Properties for clone_buffer_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--clone-buffer-size</code></td> </tr><tr><th>Introduced</th> <td>8.0.17</td> </tr><tr><th>System Variable</th> <td><code>clone_buffer_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>4194304</code></td> </tr><tr><th>Minimum Value</th> <td><code>1048576</code></td> </tr><tr><th>Maximum Value</th> <td><code>268435456</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>3

Define endereços de host do doador válidos para operações de clonagem remota. Esta configuração é aplicada na instância do servidor MySQL do destinatário. Uma lista de valores separados por vírgula é permitida no seguinte formato: “`HOST1:PORT1,HOST2:PORT2,HOST3:PORT3`”. Espaços não são permitidos.

A variável `clone_valid_donor_list` adiciona uma camada de segurança ao fornecer controle sobre as fontes dos dados clonados. O privilégio necessário para configurar `clone_valid_donor_list` é diferente do privilégio necessário para executar operações de clonagem remota, o que permite atribuir essas responsabilidades a diferentes papéis. Configurar `clone_valid_donor_list` requer o privilégio `SYSTEM_VARIABLES_ADMIN`, enquanto executar uma operação de clonagem remota requer o privilégio `CLONE_ADMIN`.

O formato de endereço da versão 6 do Protocolo de Internet (IPv6) não é suportado. O formato de endereço da versão 6 do Protocolo de Internet (IPv6) não é suportado. Um alias para o endereço IPv6 pode ser usado em vez disso. Um endereço IPv4 pode ser usado como está.

#### 7.6.7.14 Limitações do Plugin de Clonagem

O plugin de clone está sujeito a essas limitações:

* Uma instância não pode ser clonada a partir de uma série de servidores MySQL diferente. Por exemplo, não é possível clonar entre MySQL 8.0 e MySQL 8.4, mas pode ser clonado dentro de uma série, como MySQL 8.0.37 e MySQL 8.0.42. Antes de 8.0.37, o número da versão também tinha que corresponder, então não é permitido clonar coisas como 8.0.36 para 8.0.42 ou vice-versa

* Antes do MySQL 8.0.27, o DDL no doador e no receptor, incluindo `TRUNCATE TABLE`, não é permitido durante uma operação de clonagem. Essa limitação deve ser considerada ao selecionar fontes de dados. Uma solução é usar instâncias dedicadas do doador, que podem acomodar operações de DDL sendo bloqueadas enquanto os dados são clonados. O DML concorrente é permitido.

A partir do MySQL 8.0.27, o DDL concorrente é permitido por padrão no doador. O suporte para DDL concorrente no doador é controlado pela variável `clone_block_ddl`. Veja a Seção 7.6.7.4, “Clonagem e DDL Concorrente”.

* O clonamento de uma instância de servidor MySQL doador para uma instância de servidor MySQL de correção de hotfix da mesma versão e versão é suportado apenas com o MySQL 8.0.26 e superior.

* Apenas uma única instância do MySQL pode ser clonada de cada vez. A clonagem de múltiplas instâncias do MySQL em uma única operação de clonagem não é suportada.

* O protocolo X especificado por `mysqlx_port` não é suportado para operações de clonagem remota (quando especifica o número de porta do servidor MySQL do doador em uma declaração `CLONE INSTANCE`](clone.html "15.7.5 CLONE Statement")).

* O plugin de clonagem não suporta a clonagem de configurações de servidor MySQL. A instância do servidor MySQL do destinatário mantém sua configuração, incluindo configurações de variáveis de sistema persistentes (consulte Seção 7.1.9.3, “Variáveis de sistema persistentes”.)

* O plugin de clonagem não suporta clonagem de logs binários.
* O plugin de clonagem apenas clona dados armazenados em `InnoDB`. Os dados de outros mecanismos de armazenamento não são clonados. As tabelas `MyISAM` e `CSV` armazenadas em qualquer esquema, incluindo o esquema `sys`, são clonadas como tabelas vazias.

* A conexão com a instância do servidor MySQL do doador através do MySQL Router não é suportada.

* As operações de clonagem local não suportam a clonagem de espaços de tabela gerais que foram criados com um caminho absoluto. Um arquivo de espaço de tabela clonado com o mesmo caminho que o arquivo de espaço de tabela de origem causaria um conflito.

### 7.6.8 O Plugin de Ponte de Proxy do Keyring

O MySQL Keyring originalmente implementou as capacidades do keystore usando plugins do servidor, mas começou a fazer a transição para usar a infraestrutura do componente no MySQL 8.0.24. A transição inclui a revisão da implementação subjacente dos plugins do keyring para usar a infraestrutura do componente. Isso é facilitado usando o plugin chamado `daemon_keyring_proxy_plugin` que atua como uma ponte entre as APIs do plugin e do serviço do componente, e permite que os plugins do keyring continuem a ser usados sem alterações nas características visíveis para o usuário.

`daemon_keyring_proxy_plugin` é construído e não é necessário fazer nada para instalá-lo ou habilitá-lo.

### 7.6.9 Serviços de Plugin do MySQL

Os plugins do servidor MySQL têm acesso aos "serviços de plugin" do servidor. A interface dos serviços de plugin complementa a API do plugin, expondo funcionalidades do servidor que os plugins podem chamar. Para informações sobre como escrever serviços de plugin para desenvolvedores, consulte Serviços do MySQL para Plugins. As seções a seguir descrevem os serviços de plugin disponíveis nos níveis de SQL e C.

#### 7.6.9.1 O Serviço de Fechamento

As distribuições do MySQL fornecem uma interface de bloqueio acessível em dois níveis:

* No nível SQL, como um conjunto de funções carregáveis que cada uma corresponde a chamadas às rotinas de serviço.

* Como uma interface em linguagem C, pode ser chamada como um serviço de plugin a partir de plugins de servidor ou funções carregáveis.

Para informações gerais sobre os serviços de plugins, consulte a Seção 7.6.9, “Serviços de plugins MySQL”. Para informações gerais sobre funções carregáveis, consulte Adicionar uma função carregável.

A interface de bloqueio possui essas características:

* As chaves têm três atributos: Espaço de nome de chave, nome da chave e modo de chave:

Os bloqueios são identificados pela combinação de nome de namespace e nome do bloqueio. O namespace permite que diferentes aplicativos usem os mesmos nomes de bloqueio sem colidir ao criar blocos em namespaces separados. Por exemplo, se os aplicativos A e B usam namespaces de `ns1` e `ns2`, respectivamente, cada aplicativo pode usar os nomes de bloqueio `lock1` e `lock2` sem interferir com o outro aplicativo.

+ Um modo de bloqueio é de leitura ou de escrita. As bloqueadoras de leitura são compartilhadas: se uma sessão tiver uma bloqueadora de leitura em um identificador de bloqueio dado, outras sessões podem adquirir uma bloqueadora de leitura no mesmo identificador. As bloqueadoras de escrita são exclusivas: se uma sessão tiver uma bloqueadora de escrita em um identificador de bloqueio dado, outras sessões não podem adquirir uma bloqueadora de leitura ou de escrita no mesmo identificador.

* Os nomes de namespace e bloqueio devem ser não `NULL`, não vazios e ter um comprimento máximo de 64 caracteres. Um namespace ou nome de bloqueio especificado como `NULL`, a string vazia ou uma string com mais de 64 caracteres resulta em um erro `ER_LOCKING_SERVICE_WRONG_NAME`.

* A interface de bloqueio trata o nome do namespace e o nome do bloqueio como strings binárias, portanto, as comparações são sensíveis ao caso.

* A interface de bloqueio oferece funções para adquirir e liberar bloqueios. Não é necessário privilégio especial para chamar essas funções. A verificação de privilégio é responsabilidade do aplicativo que faz a chamada.

* As esperas por bloqueios podem ser realizadas se não estiverem disponíveis imediatamente. As chamadas de aquisição de bloqueios levam um valor de timeout inteiro que indica quantos segundos devem ser esperados para adquirir blocos antes de desistir. Se o timeout for atingido sem aquisição bem-sucedida de bloqueios, ocorre um erro [[`ER_LOCKING_SERVICE_TIMEOUT`]. Se o timeout for 0, não há espera e a chamada produz um erro se os blocos não puderem ser adquiridos imediatamente.

* A interface de bloqueio detecta impasse entre chamadas de aquisição de bloqueio em diferentes sessões. Neste caso, o serviço de bloqueio escolhe um chamador e termina sua solicitação de aquisição de bloqueio com um erro `ER_LOCKING_SERVICE_DEADLOCK`. Este erro não faz com que as transações sejam revertidas. Para escolher uma sessão em caso de impasse, o serviço de bloqueio prefere sessões que possuem blocos de leitura em detrimento de sessões que possuem blocos de escrita.

* Uma sessão pode adquirir múltiplos bloqueios com uma única chamada de aquisição de bloqueio. Para uma chamada específica, a aquisição de bloqueio é atômica: a chamada tem sucesso se todos os bloqueios forem adquiridos. Se a aquisição de qualquer bloqueio falhar, a chamada não adquire blocos e falha, tipicamente com um erro `ER_LOCKING_SERVICE_TIMEOUT` ou `ER_LOCKING_SERVICE_DEADLOCK`.

* Uma sessão pode adquirir múltiplos bloqueios para o mesmo identificador de bloqueio (combinação de namespace e nome de bloqueio). Essas instâncias de bloqueio podem ser blocos de leitura, blocos de escrita ou uma mistura de ambos.

* As chaves adquiridas dentro de uma sessão são liberadas explicitamente ao chamar uma função de liberação de chaves, ou implicitamente quando a sessão é encerrada (normalmente ou anormalmente). As chaves não são liberadas quando as transações são confirmadas ou revertidas.

* Dentro de uma sessão, todas as chaves para um namespace dado são liberadas juntas.

A interface fornecida pelo serviço de bloqueio é distinta daquela fornecida por `GET_LOCK()` e pelas funções SQL relacionadas (consulte a Seção 14.14, “Funções de bloqueio”). Por exemplo, `GET_LOCK()` não implementa namespaces e fornece apenas bloqueios exclusivos, não bloqueios de leitura e escrita distintos.

##### 7.6.9.1.1 A Interface do Serviço de Fechamento C

Esta seção descreve como usar a interface do serviço de bloqueio em linguagem C. Para usar a interface da função do serviço de bloqueio, consulte a Seção 7.6.9.1.2, “A Interface da Função do Serviço de Bloqueio”. Para informações gerais sobre a interface do serviço de bloqueio, consulte a Seção 7.6.9, “O Serviço de Bloqueio”. Para informações gerais sobre os serviços de plugin, consulte a Seção 7.6.9, “Serviços de Plugin do MySQL”.

Os arquivos de origem que utilizam o serviço de bloqueio devem incluir este arquivo de cabeçalho:

```
#include <mysql/service_locking.h>
```

Para adquirir um ou mais bloqueios, chame esta função:

```
int mysql_acquire_locking_service_locks(MYSQL_THD opaque_thd,
                                        const char* lock_namespace,
                                        const char**lock_names,
                                        size_t lock_num,
                                        enum enum_locking_service_lock_type lock_type,
                                        unsigned long lock_timeout);
```

Os argumentos têm esses significados:

* `opaque_thd`: Um controle de fio. Se especificado como `NULL`, o controle do fio do thread atual é usado.

* `lock_namespace`: Uma cadeia de caracteres terminada por nulo que indica o espaço de nomes de bloqueio.

* `lock_names`: Uma matriz de strings terminadas por nulo que fornece os nomes dos bloqueios a serem adquiridos.

* `lock_num`: O número de nomes na matriz `lock_names`.

* `lock_type`: O modo de bloqueio, seja `LOCKING_SERVICE_READ` ou `LOCKING_SERVICE_WRITE`, para adquirir bloqueios de leitura ou escrita, respectivamente.

* `lock_timeout`: Um número inteiro de segundos para aguardar para adquirir as chaves antes de desistir.

Para liberar bloqueados adquiridos para um namespace específico, chame esta função:

```
int mysql_release_locking_service_locks(MYSQL_THD opaque_thd,
                                        const char* lock_namespace);
```

Os argumentos têm esses significados:

* `opaque_thd`: Um controle de fio. Se especificado como `NULL`, o controle do fio do thread atual é usado.

* `lock_namespace`: Uma cadeia de caracteres terminada por nulo que indica o espaço de nomes de bloqueio.

As chaves adquiridas ou aguardadas pelo serviço de bloqueio podem ser monitoradas no nível SQL usando o Gerador de Desempenho. Para obter detalhes, consulte Monitoramento do Serviço de Bloqueio.

##### 7.6.9.1.2 A Interface da Função de Serviço de Acionamento

Esta seção descreve como usar a interface do serviço de bloqueio fornecida por suas funções carregáveis. Para usar a interface em linguagem C em vez disso, consulte a Seção 7.6.9.1.1, “A Interface do Serviço de Bloqueio em C”. Para informações gerais sobre a interface do serviço de bloqueio, consulte a Seção 7.6.9.1, “O Serviço de Bloqueio”. Para informações gerais sobre funções carregáveis, consulte Adicionando uma Função Carregável.

* Instalar ou desinstalar a interface da função de serviço de bloqueio * Usar a interface da função de serviço de bloqueio * Monitoramento do serviço de bloqueio * Referência da função da interface do serviço de bloqueio

###### Instalar ou desinstalar a interface da função de serviço de bloqueio

Os serviços de bloqueio descritos na Seção 7.6.9.1.1, “A Interface C do Serviço de Bloqueio”, não precisam ser instalados, pois estão embutidos no servidor. O mesmo não se aplica às funções carregáveis que mapeiam chamadas para as rotinas de serviço: as funções devem ser instaladas antes do uso. Esta seção descreve como fazer isso. Para informações gerais sobre a instalação de funções carregáveis, consulte a Seção 7.7.1, “Instalando e Desinstalando Funções Carregáveis”.

As funções de serviço de bloqueio são implementadas em um arquivo de biblioteca de plugins localizado no diretório denominado pela variável de sistema `plugin_dir`. O nome do arquivo base é `locking_service`. O sufixo do nome do arquivo difere por plataforma (por exemplo, `.so` para sistemas Unix e Unix-like, `.dll` para Windows).

Para instalar as funções de serviços de bloqueio, use a declaração `CREATE FUNCTION`, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
CREATE FUNCTION service_get_read_locks RETURNS INT
  SONAME 'locking_service.so';
CREATE FUNCTION service_get_write_locks RETURNS INT
  SONAME 'locking_service.so';
CREATE FUNCTION service_release_locks RETURNS INT
  SONAME 'locking_service.so';
```

Se as funções forem usadas em um servidor de fonte de replicação, instale-as em todos os servidores replicados também, para evitar problemas de replicação.

Uma vez instalado, as funções permanecem instaladas até serem desinstaladas. Para removê-las, use a declaração `DROP FUNCTION`:

```
DROP FUNCTION service_get_read_locks;
DROP FUNCTION service_get_write_locks;
DROP FUNCTION service_release_locks;
```

###### Usando a Interface da Função de Serviço de Acionamento

Antes de usar as funções do serviço de bloqueio, instale-as de acordo com as instruções fornecidas em Instalar ou Desinstalar a Interface da Função de Serviço de Bloqueio.

Para adquirir um ou mais bloqueios de leitura, chame esta função:

```
mysql> SELECT service_get_read_locks('mynamespace', 'rlock1', 'rlock2', 10);
+---------------------------------------------------------------+
| service_get_read_locks('mynamespace', 'rlock1', 'rlock2', 10) |
+---------------------------------------------------------------+
|                                                             1 |
+---------------------------------------------------------------+
```

O primeiro argumento é o namespace do bloqueio. O último argumento é um tempo de espera inteiro que indica quantos segundos devem ser esperados para adquirir os bloqueios antes de desistir. Os argumentos entre eles são os nomes dos bloqueios.

Para o exemplo que acabou de ser mostrado, a função adquire bloqueios com identificadores de bloqueio `(mynamespace, rlock1)` e `(mynamespace, rlock2)`.

Para adquirir bloqueios de escrita em vez de bloqueios de leitura, chame esta função:

```
mysql> SELECT service_get_write_locks('mynamespace', 'wlock1', 'wlock2', 10);
+----------------------------------------------------------------+
| service_get_write_locks('mynamespace', 'wlock1', 'wlock2', 10) |
+----------------------------------------------------------------+
|                                                              1 |
+----------------------------------------------------------------+
```

Neste caso, os identificadores de bloqueio são `(mynamespace, wlock1)` e `(mynamespace, wlock2)`.

Para liberar todos os bloqueios de um namespace, use esta função:

```
mysql> SELECT service_release_locks('mynamespace');
+--------------------------------------+
| service_release_locks('mynamespace') |
+--------------------------------------+
|                                    1 |
+--------------------------------------+
```

Cada função de bloqueio retorna um valor não nulo para sucesso. Se a função falhar, ocorre um erro. Por exemplo, o seguinte erro ocorre porque os nomes de bloqueio não podem ser vazios:

```
mysql> SELECT service_get_read_locks('mynamespace', '', 10);
ERROR 3131 (42000): Incorrect locking service lock name ''.
```

Uma sessão pode adquirir múltiplos bloqueios para o mesmo identificador de bloqueio. Desde que uma sessão diferente não tenha um bloqueio de escrita para um identificador, a sessão pode adquirir qualquer número de blocos de leitura ou escrita. Cada solicitação de bloqueio para o identificador adquire um novo bloqueio. As seguintes declarações adquirem três blocos de escrita com o mesmo identificador, em seguida, três blocos de leitura para o mesmo identificador:

```
SELECT service_get_write_locks('ns', 'lock1', 'lock1', 'lock1', 0);
SELECT service_get_read_locks('ns', 'lock1', 'lock1', 'lock1', 0);
```

Se você examinar a tabela do Schema de desempenho `metadata_locks` neste momento, você deve descobrir que a sessão possui seis bloqueios distintos com o mesmo identificador `(ns, lock1)`. (Para detalhes, consulte Monitoramento do serviço de bloqueio.)

Como a sessão mantém pelo menos um bloqueio de escrita em `(ns, lock1)`, nenhuma outra sessão pode adquirir um bloqueio para ele, seja de leitura ou de escrita. Se a sessão tivesse apenas blocos de leitura para o identificador, outras sessões poderiam adquirir blocos de leitura para ele, mas não blocos de escrita.

As chaves para uma única chamada de aquisição de chave são adquiridas de forma atômica, mas a atonia não se aplica a chamadas múltiplas. Assim, para uma declaração como a seguinte, onde `service_get_write_locks()` é chamada uma vez por linha do conjunto de resultados, a atonia se aplica a cada chamada individual, mas não para a declaração como um todo:

```
SELECT service_get_write_locks('ns', 'lock1', 'lock2', 0) FROM t1 WHERE ... ;
```

Cuidado

Como o serviço de bloqueio retorna um bloqueio separado para cada solicitação bem-sucedida para um identificador de bloqueio dado, é possível que uma única declaração adquira um grande número de blocos. Por exemplo:

```
INSERT INTO ... SELECT service_get_write_locks('ns', t1.col_name, 0) FROM t1;
```

Esses tipos de declarações podem ter certos efeitos adversos. Por exemplo, se a declaração falhar em meio caminho e for revertida, as chaves adquiridas até o ponto de falha ainda existem. Se a intenção é que haja uma correspondência entre as linhas inseridas e as chaves adquiridas, essa intenção não é satisfeita. Além disso, se é importante que as chaves sejam concedidas em uma certa ordem, esteja ciente de que a ordem do conjunto de resultados pode diferir dependendo do plano de execução que o otimizador escolhe. Por essas razões, pode ser melhor limitar as aplicações a uma única chamada de aquisição de chave por declaração.

###### Monitoramento do Serviço de Fechamento

O serviço de bloqueio é implementado usando o framework de bloqueio de metadados do MySQL Server, então você monitora os bloqueios do serviço de bloqueio adquiridos ou esperados examinando a tabela do Schema de Desempenho `metadata_locks`.

Primeiro, habilite o instrumento de bloqueio de metadados:

```
mysql> UPDATE performance_schema.setup_instruments SET ENABLED = 'YES'
    -> WHERE NAME = 'wait/lock/metadata/sql/mdl';
```

Em seguida, adquira algumas chaves e verifique o conteúdo da tabela `metadata_locks`:

```
mysql> SELECT service_get_write_locks('mynamespace', 'lock1', 0);
+----------------------------------------------------+
| service_get_write_locks('mynamespace', 'lock1', 0) |
+----------------------------------------------------+
|                                                  1 |
+----------------------------------------------------+
mysql> SELECT service_get_read_locks('mynamespace', 'lock2', 0);
+---------------------------------------------------+
| service_get_read_locks('mynamespace', 'lock2', 0) |
+---------------------------------------------------+
|                                                 1 |
+---------------------------------------------------+
mysql> SELECT OBJECT_TYPE, OBJECT_SCHEMA, OBJECT_NAME, LOCK_TYPE, LOCK_STATUS
    -> FROM performance_schema.metadata_locks
    -> WHERE OBJECT_TYPE = 'LOCKING SERVICE'\G
*************************** 1. row ***************************
  OBJECT_TYPE: LOCKING SERVICE
OBJECT_SCHEMA: mynamespace
  OBJECT_NAME: lock1
    LOCK_TYPE: EXCLUSIVE
  LOCK_STATUS: GRANTED
*************************** 2. row ***************************
  OBJECT_TYPE: LOCKING SERVICE
OBJECT_SCHEMA: mynamespace
  OBJECT_NAME: lock2
    LOCK_TYPE: SHARED
  LOCK_STATUS: GRANTED
```

As fechaduras de serviço de bloqueio têm um valor `OBJECT_TYPE`. Isso é distinto, por exemplo, das fechaduras adquiridas com a função `GET_LOCK()`, que têm um `OBJECT_TYPE` de `USER LEVEL LOCK`.

O nome do espaço de nomes de bloqueio, nome e modo aparecem nas colunas `OBJECT_SCHEMA`, `OBJECT_NAME` e `LOCK_TYPE`. Os valores de leitura e escrita de bloqueio têm `LOCK_TYPE` de `SHARED` e `EXCLUSIVE`, respectivamente.

O valor `LOCK_STATUS` é `GRANTED` para um bloqueio adquirido, `PENDING` para um bloqueio que está sendo aguardado. Você pode esperar ver `PENDING` se uma sessão tiver um bloqueio de escrita e outra sessão estiver tentando adquirir um bloqueio com o mesmo identificador.

###### Referência de função da interface do serviço de bloqueio

A interface SQL para o serviço de bloqueio implementa as funções carregáveis descritas nesta seção. Para exemplos de uso, consulte Usando a Interface de Função do Serviço de Bloqueio.

As funções compartilham essas características:

* O valor de retorno não é nulo para sucesso. Caso contrário, ocorre um erro.

* Os nomes de namespaces e de bloqueio devem ser não `NULL`, não vazios e ter um comprimento máximo de 64 caracteres.

* Os valores de tempo de espera devem ser números inteiros que indicam quantos segundos esperar para adquirir blocos antes de desistir com um erro. Se o tempo de espera for 0, não há espera e a função produz um erro se os blocos não puderem ser adquiridos imediatamente.

Essas funções de serviço de bloqueio estão disponíveis:

* `service_get_read_locks(namespace, lock_name[, lock_name] ..., timeout)`(locking-service.html#function_service-get-read-locks)

Adquire um ou mais bloqueios de leitura (compartilhado) no namespace fornecido usando os nomes de bloqueio fornecidos, expirando com um erro se os bloqueios não forem adquiridos dentro do valor de tempo de espera fornecido.

* `service_get_write_locks(namespace, lock_name[, lock_name] ..., timeout)`(locking-service.html#function_service-get-write-locks)

Adquire um ou mais bloqueios de escrita (exclusivos) no namespace fornecido usando os nomes de bloqueio fornecidos, expirando com um erro se os bloqueios não forem adquiridos dentro do valor de tempo de espera fornecido.

* `service_release_locks(namespace)`

Para o namespace dado, libere todas as chaves de acesso que foram adquiridas dentro da sessão atual usando `service_get_read_locks()` e `service_get_write_locks()`.

Não é um erro não haver trancas no espaço de nome.

#### 7.6.9.2 O Serviço de Chaveiro

O MySQL Server suporta um serviço de chave de segurança que permite que componentes internos e plugins armazenem informações sensíveis de forma segura para recuperação posterior. As distribuições do MySQL fornecem uma interface de chave de segurança que é acessível em dois níveis:

* No nível SQL, como um conjunto de funções carregáveis que cada uma corresponde a chamadas às rotinas de serviço.

* Como uma interface em linguagem C, pode ser chamada como um serviço de plugin a partir de plugins de servidor ou funções carregáveis.

Esta seção descreve como usar as funções do serviço de chaveiro para armazenar, recuperar e remover chaves no keystore de chaveiro MySQL. Para informações sobre a interface SQL que usa funções, consulte a Seção 8.4.4.15, “Funções de gerenciamento de chave de chaveiro de propósito geral”. Para informações gerais sobre o chaveiro, consulte a Seção 8.4.4, “O chaveiro MySQL”.

O serviço de chaveiro usa qualquer plugin de chaveiro subjacente que esteja habilitado, se houver. Se nenhum plugin de chaveiro estiver habilitado, as chamadas do serviço de chaveiro falham.

Um "registro" no keystore consiste em dados (a própria chave) e um identificador único através do qual a chave é acessada. O identificador tem duas partes:

* `key_id`: O ID ou nome chave. Os valores `key_id` que começam com `mysql_` são reservados pelo MySQL Server.

* `user_id`: O ID de usuário efetivo da sessão. Se não houver contexto de usuário, este valor pode ser `NULL`. O valor não precisa ser realmente um "usuário"; o significado depende do aplicativo.

As funções que implementam a interface da função de chave de segurança passam o valor de `CURRENT_USER()` como o valor de `user_id` para as funções de serviço de chave de segurança.

Os serviços de chaveiros têm essas características em comum:

* Cada função retorna 0 para sucesso, 1 para falha.
* Os argumentos `key_id` e `user_id` formam uma combinação única que indica qual chave no conjunto de chaves deve ser usada.

* O argumento `key_type` fornece informações adicionais sobre a chave, como seu método de criptografia ou uso pretendido.

* As funções do serviço de chave tratam os IDs de chave, nomes de usuário, tipos e valores como strings binárias, portanto, as comparações são sensíveis ao caso. Por exemplo, os IDs de `MyKey` e `mykey` referem-se a chaves diferentes.

Essas funções de serviço de chaveiro estão disponíveis:

* `my_key_fetch()`

Desobfusa e recupera uma chave do chaveiro, juntamente com seu tipo. A função aloca a memória para os buffers usados para armazenar a chave e o tipo de chave retornados. O chamador deve zerar ou obfusar a memória quando ela não for mais necessária, e depois liberá-la.

Sintaxe:

  ```
  bool my_key_fetch(const char *key_id, const char **key_type,
                    const char* user_id, void **key, size_t *key_len)
  ```

Argumentos:

+ `key_id`, `user_id`: Strings terminadas por nulo que, como um par, formam um identificador único que indica qual chave deve ser recuperada.

+ `key_type`: O endereço de um ponteiro de buffer. A função armazena nele um ponteiro para uma string terminada por nulo que fornece informações adicionais sobre a chave (armazenada quando a chave foi adicionada).

+ `key`: O endereço de um ponteiro de buffer. A função armazena nele um ponteiro para o buffer que contém os dados da chave obtidos.

+ `key_len`: O endereço de uma variável na qual a função armazena o tamanho em bytes do buffer `*key`.

Valor de retorno:

Retorna 0 para sucesso, 1 para falha.

* `my_key_generate()`

Gera uma nova chave aleatória de um tipo e comprimento determinados e a armazena no chaveiro. A chave tem um comprimento de `key_len` e está associada ao identificador formado por `key_id` e `user_id`. Os valores de tipo e comprimento devem ser consistentes com os valores suportados pelo plugin do chaveiro subjacente. Veja a Seção 8.4.4.13, “Tipos e comprimentos de chave suportados no chaveiro”.

Sintaxe:

  ```
  bool my_key_generate(const char *key_id, const char *key_type,
                       const char *user_id, size_t key_len)
  ```

Argumentos:

+ `key_id`, `user_id`: Strings terminadas por nulo que, como um par, formam um identificador único para a chave a ser gerada.

+ `key_type`: Uma cadeia de caracteres terminada por nulo que fornece informações adicionais sobre a chave.

+ `key_len`: O tamanho em bytes da chave a ser gerada.

Valor de retorno:

Retorna 0 para sucesso, 1 para falha.

* `my_key_remove()`

Remove uma chave do chaveiro.

Sintaxe:

  ```
  bool my_key_remove(const char *key_id, const char* user_id)
  ```

Argumentos:

+ `key_id`, `user_id`: Strings terminadas por nulo que, como um par, formam um identificador único para a chave a ser removida.

Valor de retorno:

Retorna 0 para sucesso, 1 para falha.

* `my_key_store()`

Oculta e armazena uma chave no chaveiro.

Sintaxe:

  ```
  bool my_key_store(const char *key_id, const char *key_type,
                    const char* user_id, void *key, size_t key_len)
  ```

Argumentos:

+ `key_id`, `user_id`: Strings terminadas por nulo que, como um par, formam um identificador único para a chave a ser armazenada.

+ `key_type`: Uma cadeia de caracteres terminada por nulo que fornece informações adicionais sobre a chave.

+ `key`: O buffer contendo os dados-chave a serem armazenados.

+ `key_len`: O tamanho em bytes do buffer `key`.

Valor de retorno:

Retorna 0 para sucesso, 1 para falha.