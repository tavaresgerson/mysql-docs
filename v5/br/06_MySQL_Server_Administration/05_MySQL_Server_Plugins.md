## 5.5 Plugins do MySQL Server

O MySQL suporta uma API de plugin que permite a criação de plugins do servidor. Os plugins podem ser carregados na inicialização do servidor ou carregados e descarregados durante a execução sem a necessidade de reiniciar o servidor. Os plugins suportados por essa interface incluem, entre outros, motores de armazenamento, tabelas `INFORMATION_SCHEMA`, plugins de parser de texto completo, suporte a particionamento e extensões do servidor.

As distribuições do MySQL incluem vários plugins que implementam extensões de servidor:

* Plugins para autenticação de tentativas de conexão de clientes com o MySQL Server. Os plugins estão disponíveis para vários protocolos de autenticação. Veja a Seção 6.2.13, “Autenticação Plugável”.

* Um plugin de controle de conexão que permite que os administradores introduzam um atraso crescente após um certo número de tentativas consecutivas de conexão de cliente falha. Veja a Seção 6.4.2, “Plugins de Controle de Conexão”.

* Um plugin de validação de senha implementa políticas de força de senha e avalia a força das senhas potenciais. Veja a Seção 6.4.3, “O Plugin de Validação de Senha”.

* Os plugins de replicação semiescronizada implementam uma interface para as capacidades de replicação que permitem que a fonte prossiga enquanto pelo menos uma réplica responder a cada transação. Veja a Seção 16.3.9, “Replicação semiescronizada”.

* A Replicação em Grupo permite que você crie um serviço MySQL altamente disponível distribuído em um grupo de instâncias do servidor MySQL, com consistência de dados, detecção e resolução de conflitos e serviços de participação em grupo, tudo integrado. Veja o Capítulo 17, *Replicação em Grupo*.

* A Edição Empresarial do MySQL inclui um plugin de pool de threads que gerencia os threads de conexão para aumentar o desempenho do servidor, gerenciando eficientemente os threads de execução de instruções para um grande número de conexões de clientes. Veja a Seção 5.5.3, “MySQL Enterprise Thread Pool”.

* A Edição Empresarial do MySQL inclui um plugin de auditoria para monitoramento e registro de atividade de conexão e consulta. Veja a Seção 6.4.5, “Auditoria Empresarial do MySQL”.

* A Edição Empresarial do MySQL inclui um plugin de firewall que implementa um firewall de nível de aplicação para permitir que os administradores de banco de dados permitam ou negam a execução de declarações SQL com base na correspondência com listas de padrões de declarações aceitos. Veja a Seção 6.4.6, “Firewall Empresarial do MySQL”.

* Um plugin de reescrita de consulta examina as declarações recebidas pelo MySQL Server e, possivelmente, as reescreve antes de o servidor executá-las. Veja a Seção 5.5.4, “O plugin de reescrita de consulta Rewriter”.

* Tokens de versão permite a criação e sincronização em torno de tokens do servidor que as aplicações podem usar para evitar o acesso a dados incorretos ou desatualizados. Os Tokens de versão são baseados em uma biblioteca de plugins que implementa um plugin `version_tokens` e um conjunto de funções carregáveis. Veja a Seção 5.5.5, “Tokens de versão”.

* Os plugins de cartela de identificação fornecem armazenamento seguro para informações sensíveis. Veja a Seção 6.4.4, “O Keyring do MySQL”.

* O X Plugin estende o MySQL Server para que ele possa funcionar como um banco de documentos. Executar o X Plugin permite que o MySQL Server comunique-se com clientes usando o Protocolo X, que foi projetado para expor as capacidades de armazenamento compatíveis com ACID do MySQL como um banco de documentos. Veja a Seção 19.4, “X Plugin”.

* Os plugins de teste de servidores de serviços de rede testam os serviços do servidor. Para informações sobre esses plugins, consulte a seção Plugins para Serviços de Plugin de Teste da documentação do MySQL Server Doxygen, disponível em https://dev.mysql.com/doc/index-other.html.

As seções a seguir descrevem como instalar e desinstalar plugins, e como determinar em tempo de execução quais plugins estão instalados e obter informações sobre eles. Para informações sobre a escrita de plugins, consulte a API do Plugin MySQL.

### 5.5.1 Instalar e desinstalar plugins

Os plugins do servidor devem ser carregados no servidor antes que possam ser usados. O MySQL suporta o carregamento de plugins no início e no runtime do servidor. Também é possível controlar o estado de ativação dos plugins carregados no início e descarregá-los no runtime.

Enquanto um plugin estiver carregado, as informações sobre ele estarão disponíveis conforme descrito na Seção 5.5.2, “Obtenção de Informações do Plugin do Servidor”.

* Instalar plugins
* Controlar o estado de ativação do plugin
* Desinstalar plugins

#### Instalação de Plugins

Antes que um plugin de servidor possa ser usado, ele deve ser instalado usando um dos seguintes métodos. Nas descrições, *`plugin_name`* representa um nome de plugin, como `innodb`, `csv` ou `validate_password`.

* Plugins embutidos
* Plugins registrados na tabela de sistema mysql.plugin
* Plugins com nomes com opções de linha de comando
* Plugins instalados com a declaração de INSTALAR PLUGIN

##### Plugins integrados

Um plugin embutido é conhecido automaticamente pelo servidor. Por padrão, o servidor habilita o plugin na inicialização. Alguns plugins embutidos permitem que isso seja alterado com a opção `--plugin_name[=activation_state]`.

##### Plugins registrados na tabela de sistema mysql.plugin

A tabela do sistema `mysql.plugin` serve como um registro de plugins (outros que não os plugins embutidos, que não precisam ser registrados). Durante a sequência normal de inicialização, o servidor carrega plugins registrados na tabela. Por padrão, para um plugin carregado a partir da tabela `mysql.plugin`, o servidor também habilita o plugin. Isso pode ser alterado com a opção `--plugin_name[=activation_state]`.

Se o servidor for iniciado com a opção `--skip-grant-tables`, os plugins registrados na tabela `mysql.plugin` não são carregados e ficam indisponíveis.

##### Plugins com nomes com opções de linha de comando

Um plugin localizado em um arquivo de biblioteca de plugins pode ser carregado na inicialização do servidor com as opções `--plugin-load`, `--plugin-load-add` ou `--early-plugin-load`. Normalmente, para um plugin carregado na inicialização, o servidor também habilita o plugin. Isso pode ser alterado com a opção `--plugin_name[=activation_state]`.

As opções `--plugin-load` e `--plugin-load-add` carregam plugins após os plugins e motores de armazenamento integrados terem sido inicializados durante a sequência de inicialização do servidor. A opção `--early-plugin-load` é usada para carregar plugins que devem estar disponíveis antes da inicialização dos plugins e motores de armazenamento integrados.

O valor de cada opção de carregamento de plugin é uma lista separada por ponto e vírgula de valores de *`plugin_library`* e *`name`*`=`*`plugin_library`* e cada *`plugin_library`* é o nome de um arquivo de biblioteca que contém código de plugin, e cada *`name`* é o nome de um plugin a ser carregado. Se uma biblioteca de plugin é nomeada sem qualquer nome de plugin anterior, o servidor carrega todos os plugins na biblioteca. Com um nome de plugin anterior, o servidor carrega apenas o plugin nomeado da biblioteca. O servidor procura arquivos de biblioteca de plugin no diretório nomeado pela variável de sistema `plugin_dir`.

As opções de carregamento de plugins não registram nenhum plugin na tabela `mysql.plugin`. Para reinicializações subsequentes, o servidor carrega o plugin novamente apenas se `--plugin-load`, `--plugin-load-add` ou `--early-plugin-load` for fornecido novamente. Isso significa que a opção produz uma operação de instalação de plugin única que persiste para uma única invocação do servidor.

`--plugin-load`, `--plugin-load-add` e `--early-plugin-load` permitem que plugins sejam carregados mesmo quando `--skip-grant-tables` é fornecido (o que faz com que o servidor ignore a tabela `mysql.plugin`). `--plugin-load`, `--plugin-load-add` e `--early-plugin-load` também permitem que plugins sejam carregados no início que não podem ser carregados no tempo real.

A opção `--plugin-load-add` complementa a opção `--plugin-load`:

* Cada instância de `--plugin-load` redefiniu o conjunto de plugins a serem carregados ao iniciar, enquanto `--plugin-load-add` adiciona um plugin ou plugins ao conjunto de plugins a serem carregados sem redefinir o conjunto atual. Consequentemente, se forem especificadas várias instâncias de `--plugin-load`, apenas a última se aplica. Com várias instâncias de `--plugin-load-add`, todas elas se aplicam.

* O formato do argumento é o mesmo que para `--plugin-load`, mas múltiplas instâncias de `--plugin-load-add` podem ser usadas para evitar especificar um grande conjunto de plugins como um único argumento `--plugin-load` longo e complicado.

* `--plugin-load-add` pode ser dado na ausência de `--plugin-load`, mas qualquer instância de `--plugin-load-add` que apareça antes de `--plugin-load` não tem efeito porque `--plugin-load` redefiniu o conjunto de plugins a serem carregados.

Por exemplo, essas opções:

```sql
--plugin-load=x --plugin-load-add=y
```

são equivalentes a essas opções:

```sql
--plugin-load-add=x --plugin-load-add=y
```

e também são equivalentes a esta opção:

```sql
--plugin-load="x;y"
```

Mas essas opções:

```sql
--plugin-load-add=y --plugin-load=x
```

são equivalentes a esta opção:

```sql
--plugin-load=x
```

##### Plugins instalados com a declaração de INSTALAR PLUGIN

Um plugin localizado em um arquivo de biblioteca de plugins pode ser carregado em tempo de execução com a declaração `INSTALL PLUGIN`. A declaração também registra o plugin na tabela `mysql.plugin` para fazer com que o servidor o carregue em reinicializações subsequentes. Por essa razão, `INSTALL PLUGIN` requer o privilégio `INSERT` para a tabela `mysql.plugin`.

O nome de arquivo da biblioteca de plugins depende da sua plataforma. Sufixos comuns são `.so` para sistemas Unix e Unix-like, `.dll` para Windows.

Exemplo: A opção `--plugin-load-add` instala um plugin no início da inicialização do servidor. Para instalar um plugin chamado `myplugin` a partir de um arquivo de biblioteca de plugins chamado `somepluglib.so`, use essas linhas em um arquivo `my.cnf`:

```sql
[mysqld]
plugin-load-add=myplugin=somepluglib.so
```

Neste caso, o plugin não está registrado em `mysql.plugin`. Reiniciar o servidor sem a opção `--plugin-load-add` faz com que o plugin não seja carregado no início.

Alternativamente, a declaração `INSTALL PLUGIN` faz com que o servidor carregue o código do plugin a partir do arquivo da biblioteca no momento da execução:

```sql
INSTALL PLUGIN myplugin SONAME 'somepluglib.so';
```

`INSTALL PLUGIN` também causa o registro de plugin "permanente": O plugin está listado na tabela `mysql.plugin` para garantir que o servidor o carregue em reinicializações subsequentes.

Muitos plugins podem ser carregados tanto no início do servidor quanto no runtime. No entanto, se um plugin for projetado de tal forma que ele deva ser carregado e inicializado durante o início do servidor, as tentativas de carregá-lo no runtime usando `INSTALL PLUGIN` produzem um erro:

```sql
mysql> INSTALL PLUGIN myplugin SONAME 'somepluglib.so';
ERROR 1721 (HY000): Plugin 'myplugin' is marked as not dynamically
installable. You have to stop the server to install it.
```

Neste caso, você deve usar `--plugin-load`, `--plugin-load-add` ou `--early-plugin-load`.

Se um plugin for nomeado tanto usando a opção `--plugin-load`, `--plugin-load-add` ou `--early-plugin-load` e (como resultado de uma declaração anterior `INSTALL PLUGIN` na tabela `mysql.plugin`, o servidor começa, mas escreve essas mensagens no log de erro:

```sql
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

```sql
[mysqld]
csv=ON
blackhole=FORCE
archive=OFF
```

O formato de opção `--enable-plugin_name` é sinônimo de `--plugin_name=ON`. Os formatos de opção `--disable-plugin_name` e `--skip-plugin_name` são sinônimos de `--plugin_name=OFF`.

Se um plugin for desativado, explicitamente com `OFF` ou implicitamente porque foi habilitado com `ON`, mas não se inicializa, aspectos da operação do servidor que exigem a alteração do plugin. Por exemplo, se o plugin implementa um mecanismo de armazenamento, as tabelas existentes para o mecanismo de armazenamento se tornam inacessíveis, e as tentativas de criar novas tabelas para o mecanismo de armazenamento resultam em tabelas que usam o mecanismo de armazenamento padrão, a menos que o modo SQL `NO_ENGINE_SUBSTITUTION` seja habilitado para causar um erro em vez disso.

Desativar um plugin pode exigir ajustes em outras opções. Por exemplo, se você iniciar o servidor usando `--skip-innodb` para desativar `InnoDB`, outras opções de `innodb_xxx` provavelmente precisarão ser omitidas na inicialização. Além disso, como `InnoDB` é o motor de armazenamento padrão, ele não pode ser iniciado a menos que você especifique outro motor de armazenamento disponível com `--default_storage_engine`. Você também deve definir `--default_tmp_storage_engine`.

#### Desinstalando plugins

No momento da execução, a declaração `UNINSTALL PLUGIN` desabilita e desinstala um plugin conhecido pelo servidor. A declaração descarrega o plugin e o remove da tabela do sistema `mysql.plugin`, se estiver registrada lá. Por esse motivo, a declaração `UNINSTALL PLUGIN` requer o privilégio `DELETE` para a tabela `mysql.plugin`. Com o plugin não mais registrado na tabela, o servidor não carrega o plugin durante os reinícios subsequentes.

`UNINSTALL PLUGIN` pode descarregar um plugin, independentemente de ter sido carregado em tempo de execução com `INSTALL PLUGIN` ou na inicialização com uma opção de carregamento de plugin, sujeito a estas condições:

* Não pode descarregar plugins que são construídos no servidor. Esses podem ser identificados como aqueles que têm um nome de biblioteca de `NULL` na saída do `INFORMATION_SCHEMA.PLUGINS` ou `SHOW PLUGINS`.

* Não pode descarregar plugins para os quais o servidor foi iniciado com `--plugin_name=FORCE_PLUS_PERMANENT`, o que impede a descarregamento do plugin em tempo de execução. Esses plugins podem ser identificados a partir da coluna `LOAD_OPTION` da tabela Schema de Informações `PLUGINS`.

Para desinstalar um plugin que atualmente é carregado na inicialização do servidor com uma opção de carregamento de plugin, use este procedimento.

1. Remova das opções relacionadas ao plugin do arquivo `my.cnf`.

2. Reinicie o servidor.
3. Os plugins são normalmente instalados usando uma opção de carregamento de plugins na inicialização ou com `INSTALL PLUGIN` no runtime, mas não ambos. No entanto, remover opções de um plugin do arquivo `my.cnf` pode não ser suficiente para desinstalá-lo se, em algum momento, `INSTALL PLUGIN` também tiver sido usado. Se o plugin ainda aparecer na saída de `INFORMATION_SCHEMA.PLUGINS` ou `SHOW PLUGINS`, use `UNINSTALL PLUGIN` para removê-lo da tabela `mysql.plugin`. Em seguida, reinicie o servidor novamente.

### 5.5.2 Obter informações do plugin do servidor

Existem várias maneiras de determinar quais plugins estão instalados no servidor:

* A tabela do esquema de informações `PLUGINS` contém uma linha para cada plugin carregado. Qualquer um que tenha um valor `PLUGIN_LIBRARY` de `NULL` é construído e não pode ser descarregado.

  ```sql
  mysql> SELECT * FROM INFORMATION_SCHEMA.PLUGINS\G
  *************************** 1. row ***************************
             PLUGIN_NAME: binlog
          PLUGIN_VERSION: 1.0
           PLUGIN_STATUS: ACTIVE
             PLUGIN_TYPE: STORAGE ENGINE
     PLUGIN_TYPE_VERSION: 50158.0
          PLUGIN_LIBRARY: NULL
  PLUGIN_LIBRARY_VERSION: NULL
           PLUGIN_AUTHOR: MySQL AB
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
           PLUGIN_AUTHOR: Innobase Oy
      PLUGIN_DESCRIPTION: Supports transactions, row-level locking,
                          and foreign keys
          PLUGIN_LICENSE: GPL
             LOAD_OPTION: ON
  ...
  ```

* A declaração `SHOW PLUGINS` exibe uma linha para cada plugin carregado. Qualquer um que tenha um valor `Library` de `NULL` é construído e não pode ser descarregado.

  ```sql
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

* A tabela `mysql.plugin` mostra quais plugins foram registrados com `INSTALL PLUGIN`. A tabela contém apenas nomes de plugins e nomes de arquivos de biblioteca, portanto, não fornece tanta informação quanto a tabela `PLUGINS` ou a declaração `SHOW PLUGINS`.

### 5.5.3 Piscina de Fuso de Tarefas da MySQL Enterprise

Nota

O MySQL Enterprise Thread Pool é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para saber mais sobre produtos comerciais, <https://www.mysql.com/products/>.

A Edição Empresarial do MySQL inclui o MySQL Enterprise Thread Pool, implementado usando um plugin de servidor. O modelo padrão de manipulação de threads no MySQL Server executa instruções usando um thread por conexão de cliente. À medida que mais clientes se conectam ao servidor e executam instruções, o desempenho geral se degrada. O plugin de pool de threads fornece um modelo alternativo de manipulação de threads projetado para reduzir o custo e melhorar o desempenho. O plugin implementa um pool de threads que aumenta o desempenho do servidor, gerenciando eficientemente os threads de execução de instruções para um grande número de conexões de clientes.

O pool de threads resolve vários problemas do modelo que usa uma thread por conexão:

* Muitas pilhas de fios tornam os caches da CPU quase inúteis em cargas de trabalho de execução altamente paralelas. O pool de fios promove a reutilização da pilha de fios para minimizar a pegada do cache da CPU.

* Com muitos fios executando em paralelo, o custo de alternância de contexto é alto. Isso também apresenta um desafio para o planejador do sistema operacional. O grupo de fios controla o número de fios ativos para manter o paralelismo dentro do servidor MySQL em um nível que ele pode lidar e que é apropriado para o host do servidor no qual o MySQL está sendo executado.

* Muitas transações executando em paralelo aumentam a disputa por recursos. Em `InnoDB`, isso aumenta o tempo gasto mantendo mutxes centrais. O grupo de threads controla quando as transações começam para garantir que não sejam executadas em paralelo demasiadas.

#### Recursos adicionais

Seção A.15, “Perguntas frequentes sobre o MySQL 5.7: MySQL Enterprise Thread Pool”

#### 5.5.3.1 Elementos do Pool de Fios

O MySQL Enterprise Thread Pool compreende esses elementos:

* Um arquivo de biblioteca de plugins implementa um plugin para o código do pool de threads, bem como várias tabelas de monitoramento associadas que fornecem informações sobre a operação do pool de threads.

Para uma descrição detalhada de como o pool de threads funciona, consulte a Seção 5.5.3.3, “Operação do Pool de Threads”.

As tabelas `INFORMATION_SCHEMA` são denominadas `TP_THREAD_STATE`, `TP_THREAD_GROUP_STATE` e `TP_THREAD_GROUP_STATS`. Essas tabelas fornecem informações sobre a operação do pool de threads. Para mais informações, consulte a Seção 24.5, “TABELAS DO SCHEMA DE INFORMAÇÃO DO POOL DE CORRENTE”.

* Várias variáveis do sistema estão relacionadas ao pool de threads. A variável de sistema `thread_handling` tem um valor de `loaded-dynamically` quando o servidor carrega com sucesso o plugin do pool de threads.

As outras variáveis relacionadas ao sistema são implementadas pelo plugin de pool de threads e não estão disponíveis a menos que este seja ativado. Para informações sobre o uso dessas variáveis, consulte a Seção 5.5.3.3, “Operação do Pool de Threads”, e a Seção 5.5.3.4, “Ajuste do Pool de Threads”.

* O Schema de Desempenho possui instrumentos que exibem informações sobre o pool de threads e podem ser usados para investigar o desempenho operacional. Para identificá-los, use esta consulta:

  ```sql
  SELECT * FROM performance_schema.setup_instruments
  WHERE NAME LIKE '%thread_pool%';
  ```

Para mais informações, consulte o Capítulo 25, *MySQL Performance Schema*.

#### 5.5.3.2 Instalação do Pool de Fios

Esta seção descreve como instalar o MySQL Enterprise Thread Pool. Para informações gerais sobre a instalação de plugins, consulte a Seção 5.5.1, “Instalando e Desinstalando Plugins”.

Para ser utilizável pelo servidor, o arquivo da biblioteca de plugins deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin, definindo o valor de `plugin_dir` na inicialização do servidor.

O nome de arquivo da biblioteca de plugins é `thread_pool`. O sufixo do nome do arquivo difere de acordo com a plataforma (por exemplo, `.so` para sistemas Unix e Unix-like, `.dll` para Windows).

Para habilitar a capacidade de pool de threads, carregue os plugins que serão usados, iniciando o servidor com a opção `--plugin-load-add`. Por exemplo, se você nomear apenas o arquivo da biblioteca de plugins, o servidor carregará todos os plugins que ele contém (ou seja, o plugin de pool de threads e todas as tabelas `INFORMATION_SCHEMA`). Para fazer isso, coloque essas linhas no arquivo `my.cnf` do servidor, ajustando o sufixo `.so` para sua plataforma, conforme necessário:

```sql
[mysqld]
plugin-load-add=thread_pool.so
```

Isso é equivalente a carregar todos os plugins do pool de threads, nomeando-os individualmente:

```sql
[mysqld]
plugin-load-add=thread_pool=thread_pool.so
plugin-load-add=tp_thread_state=thread_pool.so
plugin-load-add=tp_thread_group_state=thread_pool.so
plugin-load-add=tp_thread_group_stats=thread_pool.so
```

Se desejar, pode carregar plugins individuais a partir do arquivo da biblioteca. Para carregar o plugin de pool de threads, mas não as tabelas `INFORMATION_SCHEMA`, use uma opção como esta:

```sql
[mysqld]
plugin-load-add=thread_pool=thread_pool.so
```

Para carregar o plugin de pilha de threads e apenas a tabela `TP_THREAD_STATE` `INFORMATION_SCHEMA`, use opções como esta:

```sql
[mysqld]
plugin-load-add=thread_pool=thread_pool.so
plugin-load-add=tp_thread_state=thread_pool.so
```

Nota

Se você não carregar todas as tabelas `INFORMATION_SCHEMA`, alguns ou todos os gráficos do pool de threads do MySQL Enterprise Monitor ficarão vazios.

Para verificar a instalação do plugin, examine a tabela Schema de Informações `PLUGINS` ou use a declaração `SHOW PLUGINS` (consulte Seção 5.5.2, “Obtenção de Informações do Plugin do Servidor”). Por exemplo:

```sql
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

#### 5.5.3.3 Operação do Pool de Fios

O pool de threads consiste em vários grupos de threads, cada um dos quais gerencia um conjunto de conexões de cliente. À medida que as conexões são estabelecidas, o pool de threads as atribui aos grupos de threads de forma round-robin.

O pool de fios exibe variáveis do sistema que podem ser usadas para configurar sua operação:

* `thread_pool_algorithm`: O algoritmo de concorrência a ser utilizado para a programação.

* `thread_pool_high_priority_connection`: Como agendar a execução de uma declaração para uma sessão.

* `thread_pool_max_unused_threads`: Quantos fios de sono permitir.

* `thread_pool_prio_kickup_timer`: Quanto tempo antes o pool de threads move uma declaração aguardando execução da fila de baixa prioridade para a fila de alta prioridade.

* `thread_pool_size`: O número de grupos de fios no conjunto de fios. Este é o parâmetro mais importante que controla o desempenho do conjunto de fios.

* `thread_pool_stall_limit`: O tempo antes de uma declaração de execução é considerado parado.

Para configurar o número de grupos de threads, use a variável de sistema `thread_pool_size`. O número padrão de grupos é 16. Para obter orientações sobre como definir essa variável, consulte a Seção 5.5.3.4, “Ajustes do Pool de Threads”.

O número máximo de threads por grupo é de 4096 (ou 4095 em alguns sistemas onde uma thread é usada internamente).

O pool de fios separa conexões e fios, portanto, não há uma relação fixa entre conexões e os fios que executam as declarações recebidas dessas conexões. Isso difere do modelo padrão de manipulação de fios que associa um fio a uma conexão, de modo que um determinado fio executa todas as declarações de sua conexão.

O pool de threads tenta garantir um máximo de uma thread executando em cada grupo a qualquer momento, mas, às vezes, permite que mais threads sejam executadas temporariamente para obter o melhor desempenho:

* Cada grupo de fios tem um fio de ouvinte que escuta as declarações recebidas das conexões atribuídas ao grupo. Quando uma declaração chega, o grupo de fios ou executa imediatamente, ou coloca-a em fila para execução posterior:

A execução imediata ocorre se a declaração for a única que é recebida e não houver declarações em fila ou que estejam sendo executadas no momento.

O acúmulo de tarefas ocorre se a declaração não puder começar a ser executada imediatamente.

* Se a execução imediata ocorrer, o thread de escuta a executa. (Isso significa que, temporariamente, nenhum thread do grupo está ouvindo.) Se a declaração terminar rapidamente, o thread executando retorna para ouvir declarações. Caso contrário, o pool de threads considera a declaração como travada e inicia outro thread como um thread de escuta (criando-o, se necessário). Para garantir que nenhum grupo de threads seja bloqueado por declarações travadas, o pool de threads tem um thread de fundo que monitora regularmente os estados dos grupos de threads.

Ao usar o fio de escuta para executar uma declaração que pode começar imediatamente, não é necessário criar um fio adicional se a declaração terminar rapidamente. Isso garante a execução mais eficiente possível no caso de um número baixo de threads concorrentes.

Quando o plugin de pool de threads é iniciado, ele cria uma thread por grupo (a thread do ouvinte), além da thread de fundo. Threads adicionais são criadas conforme necessário para executar as instruções.

* O valor da variável de sistema `thread_pool_stall_limit` determina o significado de “terminam rapidamente” no item anterior. O tempo padrão antes que os threads sejam considerados parados é de 60 ms, mas pode ser ajustado para um máximo de 6 s. Este parâmetro é configurável para permitir que você encontre um equilíbrio adequado para a carga de trabalho do servidor. Valores de espera curtos permitem que os threads comecem mais rapidamente. Valores curtos também são melhores para evitar situações de deadlock. Valores de espera longos são úteis para cargas de trabalho que incluem declarações de longa duração, para evitar iniciar muitas novas declarações enquanto as atuais são executadas.

* O pool de threads foca em limitar o número de declarações concorrentes de execução curta. Antes que uma declaração em execução atinja o tempo de espera, ela impede que outras declarações comecem a ser executadas. Se a declaração for executada após o tempo de espera, ela é permitida para continuar, mas não impede mais que outras declarações comecem. Dessa forma, o pool de threads tenta garantir que, em cada grupo de threads, nunca haja mais de uma declaração de execução curta, embora possa haver várias declarações de execução longa. Não é desejável permitir que declarações de execução longa impeçam outras declarações de serem executadas, porque não há limite para a quantidade de espera que pode ser necessária. Por exemplo, em uma fonte de replicação, um thread que está enviando eventos de log binário para uma replica efetivamente corre para sempre.

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

#### 5.5.3.4 Ajuste do Pool de Fios

Esta seção fornece diretrizes sobre como definir as variáveis do sistema de pool de threads para o melhor desempenho, medido usando uma métrica como transações por segundo.

`thread_pool_size` é o parâmetro mais importante que controla o desempenho do pool de threads. Ele só pode ser definido na inicialização do servidor. Nossa experiência em testar o pool de threads indica o seguinte:

* Se o motor de armazenamento primário for `InnoDB`, o ajuste ótimo `thread_pool_size` provavelmente estará entre 16 e 36, com os valores ótimos mais comuns tendendo a estar entre 24 e 36. Não vimos nenhuma situação em que o ajuste tenha sido ótimo além de 36. Pode haver casos especiais em que um valor menor que 16 é ótimo.

Para cargas de trabalho como DBT2 e Sysbench, o valor ótimo para `InnoDB` parece ser geralmente em torno de 36. Para cargas de trabalho muito intensivas em escrita, o ajuste ótimo pode, às vezes, ser menor.

* Se o motor de armazenamento primário for o `MyISAM`, o ajuste `thread_pool_size` deve ser bastante baixo. O desempenho ótimo é frequentemente observado com valores de 4 a 8. Valores mais altos tendem a ter um impacto ligeiramente negativo, mas não dramático, no desempenho.

Outra variável do sistema, `thread_pool_stall_limit`, é importante para o tratamento de declarações bloqueadas e de longa duração. Se todas as chamadas que bloqueiam o MySQL Server forem reportadas para o pool de threads, ele sempre saberá quando os threads de execução estão bloqueados. No entanto, isso nem sempre é verdade. Por exemplo, os blocos podem ocorrer em código que não foi instrumentado com callbacks do pool de threads. Para tais casos, o pool de threads deve ser capaz de identificar os threads que parecem estar bloqueados. Isso é feito por meio de um tempo de espera que pode ser ajustado usando a variável de sistema `thread_pool_stall_limit`, cujo valor é medido em unidades de 10 ms. Este parâmetro garante que o servidor não fique completamente bloqueado. O valor de `thread_pool_stall_limit` tem um limite superior de 6 segundos para evitar o risco de um servidor em deadlock.

`thread_pool_stall_limit` também permite que o pool de threads gere instruções de longa duração. Se uma instrução de longa duração fosse permitida para bloquear um grupo de threads, todas as outras conexões atribuídas ao grupo seriam bloqueadas e não poderiam iniciar a execução até que a instrução de longa duração fosse concluída. No pior dos casos, isso pode levar horas ou até dias.

O valor de `thread_pool_stall_limit` deve ser escolhido de tal forma que as declarações que executam mais tempo do que seu valor sejam consideradas travadas. As declarações travadas geram um monte de overhead extra, pois envolvem trocas de contexto extras e, em alguns casos, até mesmo criação de threads extras. Por outro lado, definir o parâmetro `thread_pool_stall_limit` muito alto significa que as declarações de longa duração bloqueiam um número de declarações de curta duração por mais tempo do que o necessário. Valores de espera curtos permitem que os threads comecem mais rapidamente. Valores curtos também são melhores para evitar situações de deadlock. Valores de espera longos são úteis para cargas de trabalho que incluem declarações de longa duração, para evitar começar muitas novas declarações enquanto as atuais executam.

Suponha que um servidor execute uma carga de trabalho onde 99,9% das declarações são concluídas em 100 ms, mesmo quando o servidor está carregado, e as declarações restantes levam entre 100 ms e 2 horas, distribuídas de forma bastante uniforme. Neste caso, faria sentido definir `thread_pool_stall_limit` para 10 (10 × 10 ms = 100 ms). O valor padrão de 6 (60 ms) é adequado para servidores que executam principalmente declarações muito simples.

O parâmetro `thread_pool_stall_limit` pode ser alterado em tempo de execução para permitir que você encontre um equilíbrio adequado para a carga de trabalho do servidor. Supondo que a tabela `TP_THREAD_GROUP_STATS` esteja habilitada, você pode usar a seguinte consulta para determinar a fração de declarações executadas que ficaram paralisadas:

```sql
SELECT SUM(STALLED_QUERIES_EXECUTED) / SUM(QUERIES_EXECUTED)
FROM INFORMATION_SCHEMA.TP_THREAD_GROUP_STATS;
```

Esse número deve ser o menor possível. Para diminuir a probabilidade de declarações ficarem paralisadas, aumente o valor de `thread_pool_stall_limit`.

Quando uma declaração chega, qual é o máximo de tempo que ela pode ser adiada antes de realmente começar a ser executada? Suponha que as seguintes condições se apliquem:

* Há 200 declarações em fila na fila de baixa prioridade.
* Há 10 declarações em fila na fila de alta prioridade.
* `thread_pool_prio_kickup_timer` está definido em 10000 (10 segundos).

* `thread_pool_stall_limit` está definido para 100 (1 segundo).

No pior dos casos, as 10 declarações de alta prioridade representam 10 transações que continuam sendo executadas por um longo tempo. Assim, no pior dos casos, nenhuma declaração é movida para a fila de alta prioridade porque ela já contém declarações aguardando execução. Após 10 segundos, a nova declaração se torna elegível para ser movida para a fila de alta prioridade. No entanto, antes que ela possa ser movida, todas as declarações antes dela também devem ser movidas. Isso pode levar outros 2 segundos, porque no máximo 100 declarações por segundo são movidas para a fila de alta prioridade. Agora, quando a declaração atinge a fila de alta prioridade, pode haver potencialmente muitas declarações em execução. No pior dos casos, cada uma delas fica parada e leva 1 segundo para cada declaração antes da próxima declaração ser recuperada da fila de alta prioridade. Assim, neste cenário, leva-se 222 segundos antes que a nova declaração comece a ser executada.

Este exemplo mostra um caso extremo para uma aplicação. Como lidar com isso depende da aplicação. Se a aplicação tiver requisitos elevados em relação ao tempo de resposta, ela deve, provavelmente, restringir os usuários em um nível mais alto. Caso contrário, ela pode usar os parâmetros de configuração do pool de threads para definir algum tipo de tempo de espera máximo.

### 5.5.4 O Plugin de Reescrita de Pergunta Rewriter

O MySQL suporta plugins de reescrita de consulta que podem examinar e, possivelmente, modificar as declarações SQL recebidas pelo servidor antes de executá-las. Veja Plugins de reescrita de consulta.

As distribuições do MySQL incluem um plugin de reescrita de consulta postparse chamado `Rewriter` e scripts para instalação do plugin e seus elementos associados. Esses elementos trabalham juntos para fornecer a capacidade de reescrita `SELECT`:

* Um plugin do lado do servidor chamado `Rewriter` examina as declarações `SELECT` e pode reescrevê-las, com base em sua cache de regras de reescrita de memória. As declarações `SELECT` e `SELECT` independentes e as declarações `SELECT` em declarações preparadas estão sujeitas à reescrita. As declarações `SELECT` que ocorrem dentro das definições de visão ou programas armazenados não estão sujeitas à reescrita.

* O plugin `Rewriter` utiliza um banco de dados denominado `query_rewrite`, que contém uma tabela denominada `rewrite_rules`. A tabela fornece armazenamento persistente para as regras que o plugin usa para decidir se deve reescrever declarações. Os usuários se comunicam com o plugin modificando o conjunto de regras armazenadas nesta tabela. O plugin se comunica com os usuários definindo a coluna `message` das linhas da tabela.

* O banco de dados `query_rewrite` contém um procedimento armazenado chamado `flush_rewrite_rules()` que carrega o conteúdo da tabela de regras no plugin.

* Uma função carregável denominada `load_rewrite_rules()` é usada pelo procedimento armazenado `flush_rewrite_rules()`.

* O plugin `Rewriter` expõe variáveis do sistema que permitem a configuração do plugin e variáveis de status que fornecem informações operacionais em tempo de execução.

As seções a seguir descrevem como instalar e usar o plugin `Rewriter`, e fornecem informações de referência para seus elementos associados.

#### 5.5.4.1 Instalar ou Desinstalar o Plugin de Reescrita de Consulta Rewriter

Nota

Se instalado, o plugin `Rewriter` gera algum overhead mesmo quando desativado. Para evitar esse overhead, não instale o plugin a menos que você planeje usá-lo.

Para instalar ou desinstalar o plugin de reescrita da consulta `Rewriter`, escolha o script apropriado localizado no diretório `share` da sua instalação do MySQL:

* `install_rewriter.sql`: Escolha este script para instalar o plugin `Rewriter` e seus elementos associados.

* `uninstall_rewriter.sql`: Escolha este script para desinstalar o plugin `Rewriter` e seus elementos associados.

Execute o script escolhido da seguinte forma:

```sql
$> mysql -u root -p < install_rewriter.sql
Enter password: (enter root password here)
```

O exemplo aqui usa o script de instalação `install_rewriter.sql`. Substitua `uninstall_rewriter.sql` se você estiver desinstalando o plugin.

Executar um script de instalação deve instalar e habilitar o plugin. Para verificar isso, conecte-se ao servidor e execute a seguinte declaração:

```sql
mysql> SHOW GLOBAL VARIABLES LIKE 'rewriter_enabled';
+------------------+-------+
| Variable_name    | Value |
+------------------+-------+
| rewriter_enabled | ON    |
+------------------+-------+
```

Para obter instruções de uso, consulte a Seção 5.5.4.2, “Usando o Plugin de Reescritura de Consulta de Reescritura”. Para informações de referência, consulte a Seção 5.5.4.3, “Referência do Plugin de Reescritura de Consulta de Reescritura”.

#### 5.5.4.2 Usando o Plugin de Reescrita de Consulta Rewriter

Para habilitar ou desabilitar o plugin, habilite ou desabilite a variável de sistema `rewriter_enabled`. Por padrão, o plugin `Rewriter` está habilitado quando você o instala (consulte Seção 5.5.4.1, “Instalando ou Desinstalando o Plugin de Reescritura de Reescritura de Consulta”). Para definir o estado inicial do plugin explicitamente, você pode definir a variável na inicialização do servidor. Por exemplo, para habilitar o plugin em um arquivo de opção, use essas linhas:

```sql
[mysqld]
rewriter_enabled=ON
```

É também possível habilitar ou desabilitar o plugin em tempo de execução:

```sql
SET GLOBAL rewriter_enabled = ON;
SET GLOBAL rewriter_enabled = OFF;
```

Supondo que o plugin `Rewriter` esteja habilitado, ele examina e, possivelmente, modifica cada declaração `SELECT` recebida pelo servidor. O plugin determina se deve reescrever as declarações com base em sua cache de regras de reescrita de memória, que são carregadas a partir da tabela `rewrite_rules` no banco de dados `query_rewrite`.

* Adicionar Regras de Reescrita
* Como o Alinhamento de Declarações Funciona
* Reescrita de Declarações Preparadas
* Informações Operacionais do Plugin Reescritor
* Uso de Conjuntos de Caracteres no Plugin Reescritor

##### Adicionar regras de reescrita

Para adicionar regras para o plugin `Rewriter`, adicione linhas à tabela `rewrite_rules`, então invoque o procedimento armazenado `flush_rewrite_rules()` para carregar as regras da tabela para o plugin. O exemplo a seguir cria uma regra simples para corresponder a declarações que selecionam um único valor literal:

```sql
INSERT INTO query_rewrite.rewrite_rules (pattern, replacement)
VALUES('SELECT ?', 'SELECT ? + 1');
```

O conteúdo da tabela resultante parece assim:

```sql
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

```sql
mysql> CALL query_rewrite.flush_rewrite_rules();
```

Dica

Se suas regras de reescrita não estiverem funcionando corretamente, certifique-se de que você carregou novamente a tabela de regras, chamando `flush_rewrite_rules()`.

Quando o plugin lê cada regra da tabela de regras, ele calcula uma forma normalizada (digestão de declaração) a partir do padrão e um valor de hash de digestão, e usa-os para atualizar as colunas `normalized_pattern` e `pattern_digest`:

```sql
mysql> SELECT * FROM query_rewrite.rewrite_rules\G
*************************** 1. row ***************************
                id: 1
           pattern: SELECT ?
  pattern_database: NULL
       replacement: SELECT ? + 1
           enabled: YES
           message: NULL
    pattern_digest: 46b876e64cd5c41009d91c754921f1d4
normalized_pattern: select ?
```

Para informações sobre a digestão de declarações, declarações normalizadas e valores de hash de digestão, consulte a Seção 25.10, “Digestas de declarações do Schema de desempenho”.

Se uma regra não puder ser carregada devido a algum erro, chamar `flush_rewrite_rules()` produz um erro:

```sql
mysql> CALL query_rewrite.flush_rewrite_rules();
ERROR 1644 (45000): Loading of some rule(s) failed.
```

Quando isso ocorre, o plugin escreve uma mensagem de erro na coluna `message` da linha da regra para comunicar o problema. Verifique a tabela `rewrite_rules` para linhas com valores na coluna `message` que não são `NULL`. Isso ajudará a identificar quais problemas existem.

Os padrões utilizam a mesma sintaxe que as instruções preparadas (consulte a Seção 13.5.1, “Instrução PREPARE”). Dentro de um modelo de padrão, os caracteres `?` atuam como marcadores de parâmetro que correspondem a valores de dados. Os caracteres `?` não devem ser fechados entre aspas. Os marcadores de parâmetro podem ser usados apenas onde os valores de dados devem aparecer, e não podem ser usados para palavras-chave SQL, identificadores, funções, etc. O plugin analisa uma instrução para identificar os valores literais (conforme definido na Seção 9.1, “Valores Literais”), então você pode colocar um marcador de parâmetro no lugar de qualquer valor literal.

Assim como o padrão, a substituição pode conter caracteres `?`. Para uma declaração que corresponde a um modelo de padrão, o plugin a reescreve, substituindo os marcadores de parâmetro `?` na substituição usando valores de dados correspondentes aos marcadores correspondentes no padrão. O resultado é uma cadeia de declaração completa. O plugin pede ao servidor para analisá-la e retorna o resultado ao servidor como a representação da declaração reescrita.

Depois de adicionar e carregar a regra, verifique se a reescrita ocorre de acordo com a correspondência dos enunciados ao padrão da regra:

```sql
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

```sql
mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Note
   Code: 1105
Message: Query 'SELECT 10' rewritten to 'SELECT 10 + 1' by a query rewrite plugin
```

Para habilitar ou desabilitar uma regra existente, modifique sua coluna `enabled` e recarregue a tabela no plugin. Para desabilitar a regra 1:

```sql
UPDATE query_rewrite.rewrite_rules SET enabled = 'NO' WHERE id = 1;
CALL query_rewrite.flush_rewrite_rules();
```

Isso permite que você desative uma regra sem removê-la da tabela.

Para reativar a regra 1:

```sql
UPDATE query_rewrite.rewrite_rules SET enabled = 'YES' WHERE id = 1;
CALL query_rewrite.flush_rewrite_rules();
```

A tabela `rewrite_rules` contém uma coluna `pattern_database` que a tabela `Rewriter` utiliza para corresponder a nomes de tabela que não são qualificados com o nome do banco de dados:

* Os nomes de tabela qualificados nas declarações correspondem aos nomes qualificados no padrão se os nomes de banco de dados e de tabela correspondentes forem idênticos.

* Os nomes de tabela não qualificados em declarações correspondem a nomes não qualificados no padrão apenas se o banco de dados padrão for o mesmo que `pattern_database` e os nomes de tabela forem idênticos.

Suponha que uma tabela chamada `appdb.users` tenha uma coluna chamada `id` e que as aplicações sejam esperadas para selecionar linhas da tabela usando uma consulta de um desses formulários, onde a segunda pode ser usada quando `appdb` é o banco de dados padrão:

```sql
SELECT * FROM users WHERE appdb.id = id_value;
SELECT * FROM users WHERE id = id_value;
```

Suponha também que a coluna `id` seja renomeada para `user_id` (talvez a tabela precise ser modificada para adicionar outro tipo de ID e seja necessário indicar mais especificamente qual tipo de ID a coluna `id` representa).

A mudança significa que as aplicações devem se referir a `user_id` em vez de `id` na cláusula `WHERE`, mas as aplicações antigas que não podem ser atualizadas não funcionam mais corretamente. O plugin `Rewriter` pode resolver esse problema, correspondendo e reescrevendo as declarações problemáticas. Para corresponder à declaração `SELECT * FROM appdb.users WHERE id = value` e reescrevê-la como `SELECT * FROM appdb.users WHERE user_id = value`, você pode inserir uma linha representando uma regra de substituição na tabela de regras de reescrita. Se você também deseja corresponder a este `SELECT` usando o nome da tabela não qualificada, também é necessário adicionar uma regra explícita. Usando `?` como um localizador de valor, as duas declarações `INSERT` necessárias parecem assim:

```sql
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

```sql
CALL query_rewrite.flush_rewrite_rules();
```

`Rewriter` usa a primeira regra para corresponder a declarações que utilizam o nome da tabela qualificada, e a segunda para corresponder a declarações que utilizam o nome não qualificado. A segunda regra funciona apenas quando `appdb` é o banco de dados padrão.

##### Como o Alinhamento de Declarações Funciona

O plugin `Rewriter` utiliza resumos de declarações e valores de hash de digestão para combinar declarações recebidas com regras de reescrita em etapas. A variável de sistema `max_digest_length` determina o tamanho do buffer usado para calcular resumos de declarações. Valores maiores permitem a computação de resumos que distinguem declarações mais longas. Valores menores utilizam menos memória, mas aumentam a probabilidade de declarações mais longas colidirem com o mesmo valor de digestão.

O plugin combina cada declaração com as regras de reescrita da seguinte forma:

1. Calcule o valor do hash do digest da declaração e compare-o com os valores de hash do digest da regra. Isso está sujeito a falsos positivos, mas serve como um teste de rejeição rápida.

2. Se o valor do hash do resumo de declaração corresponder a qualquer valor de hash de resumo de padrão, alinhe a forma normalizada (digest do resumo da declaração) da declaração com a forma normalizada dos padrões de regras de correspondência.

3. Se a declaração normalizada corresponder a uma regra, compare os valores literais na declaração e no padrão. Um caractere `?` no padrão corresponde a qualquer valor literal na declaração. Se a declaração prepara uma declaração `SELECT`, o `?` no padrão também corresponde ao `?` na declaração. Caso contrário, os valores literais correspondentes devem ser os mesmos.

Se várias regras corresponderem a uma declaração, não é determinado qual plugin usa para reescrever a declaração.

Se um padrão contiver mais marcadores do que a substituição, o plugin descarta os valores de dados em excesso. Se um padrão contiver menos marcadores do que a substituição, é um erro. O plugin percebe isso quando a tabela de regras é carregada, escreve uma mensagem de erro na coluna `message` da linha da regra para comunicar o problema e define a variável de status `Rewriter_reload_error` para `ON`.

##### Reescrita de declarações preparadas

As declarações preparadas são reescritas no momento de análise (ou seja, quando são preparadas), e não quando são executadas posteriormente.

As declarações preparadas diferem das declarações não preparadas porque podem conter caracteres `?` como marcadores de parâmetro. Para corresponder a um `?` em uma declaração preparada, um padrão `Rewriter` deve conter `?` na mesma localização. Suponha que uma regra de reescrita tenha este padrão:

```sql
SELECT ?, 3
```

A tabela a seguir mostra várias declarações preparadas `SELECT` e se o padrão de regra corresponde a elas.

<table summary="How the Rewriter plugin matches prepared statements against the pattern SELECT ?,3."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Declaração preparada</th> <th>Whether Pattern Matches Statement</th> </tr></thead><tbody><tr> <td><code>PREPARE s AS 'SELECT 3, 3'</code></td> <td>Yes</td> </tr><tr> <td><code>PREPARE s AS 'SELECT ?, 3'</code></td> <td>Yes</td> </tr><tr> <td><code>PREPARE s AS 'SELECT 3, ?'</code></td> <td>No</td> </tr><tr> <td><code>PREPARE s AS 'SELECT ?, ?'</code></td> <td>No</td> </tr></tbody></table>

##### Informações Operacionais do Plugin de Reescritor

O plugin `Rewriter` disponibiliza informações sobre sua operação por meio de várias variáveis de status:

```sql
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

Para descrições dessas variáveis, consulte a Seção 5.5.4.3.4, “Variáveis de status do plugin de reescrita de consulta do Rewriter”.

Quando você carrega a tabela de regras ao chamar o procedimento armazenado `flush_rewrite_rules()`, se ocorrer um erro em alguma regra, a declaração `CALL` produz um erro, e o plugin define a variável de status `Rewriter_reload_error` como `ON`:

```sql
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

#### 5.5.4.3 Referência ao Plugin de Reescrita de Consulta de Reescritor

A discussão a seguir serve como referência para esses elementos associados ao plugin de reescrita da consulta `Rewriter`:

* A tabela de regras `Rewriter` no banco de dados `query_rewrite`

* `Rewriter` procedimentos e funções
* `Rewriter` variáveis do sistema e de status

##### 5.5.4.3.1 Tabela de Regras do Plugin de Reescrita de Consulta de Reescritor

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

##### 5.5.4.3.2 Procedimentos e funções do plugin de reescrita de consultas de reescritor

A operação do plugin `Rewriter` utiliza um procedimento armazenado que carrega a tabela de regras em seu cache de memória, e uma função auxiliar carregável. Em operação normal, os usuários invocam apenas o procedimento armazenado. A função é destinada a ser invocada pelo procedimento armazenado, não diretamente pelos usuários.

* `flush_rewrite_rules()`

Este procedimento armazenado usa a função `load_rewrite_rules()` para carregar o conteúdo da tabela `rewrite_rules` no cache `Rewriter` de memória.

Chamar `flush_rewrite_rules()` implica em `COMMIT`.

Invoque este procedimento após modificar a tabela de regras para fazer com que o plugin atualize seu cache com o novo conteúdo da tabela. Se ocorrerem erros, o plugin define a coluna `message` para as linhas de regra apropriadas na tabela e define a variável de status `Rewriter_reload_error` para `ON`.

* `load_rewrite_rules()`

Essa função é uma rotina auxiliar usada pelo procedimento armazenado `flush_rewrite_rules()`.

##### 5.5.4.3.3 Sistema de Plugin de Reescritura de Consulta de Reescritura de Variáveis de Sistema

O plugin de reescrita de consulta `Rewriter` suporta as seguintes variáveis de sistema. Essas variáveis estão disponíveis apenas se o plugin estiver instalado (consulte Seção 5.5.4.1, “Instalando ou Desinstalando o Plugin de Reescrita de Consulta de Reescrita”).

* `rewriter_enabled`

  <table frame="box" rules="all" summary="Properties for rewriter_enabled"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>rewriter_enabled</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valid Values</th> <td><code>OFF</code></td> </tr></tbody></table>

Se o plugin de reescrita da consulta `Rewriter` está habilitado.

* `rewriter_verbose`

  <table frame="box" rules="all" summary="Properties for rewriter_verbose"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>rewriter_verbose</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr></tbody></table>

Para uso interno.

##### 5.5.4.3.4 Variáveis de status do plugin de reescrita de consulta de reescritor

O plugin de reescrita de consulta `Rewriter` suporta as seguintes variáveis de status. Essas variáveis estão disponíveis apenas se o plugin estiver instalado (consulte Seção 5.5.4.1, “Instalando ou Desinstalando o Plugin de Reescrita de Consulta de Reescrita”).

* `Rewriter_number_loaded_rules`

O número de regras de reescrita de plugins de reescrita carregadas com sucesso da tabela `rewrite_rules` para a memória para uso pelo plugin `Rewriter`.

* `Rewriter_number_reloads`

O número de vezes que a tabela `rewrite_rules` foi carregada no cache de memória utilizado pelo plugin `Rewriter`.

* `Rewriter_number_rewritten_queries`

O número de consultas reescritas pelo plugin de reescrita de consultas `Rewriter` desde que foi carregado.

* `Rewriter_reload_error`

Se ocorreu um erro na última vez que a tabela `rewrite_rules` foi carregada no cache de memória utilizado pelo plugin `Rewriter`. Se o valor for `OFF`, não ocorreu erro. Se o valor for `ON`, ocorreu um erro; verifique a coluna `message` da tabela `rewriter_rules` em busca de mensagens de erro.

### 5.5.5 Tokens de versão

O MySQL inclui Tokens de Versão, uma funcionalidade que permite a criação e sincronização de tokens de servidor que as aplicações podem usar para evitar o acesso a dados incorretos ou desatualizados.

A interface dos Tokens de versão tem essas características:

* Tokens de versão são pares que consistem em um nome que serve como chave ou identificador, mais um valor.

* Os tokens de versão podem ser bloqueados. Uma aplicação pode usar bloqueios de token para indicar a outras aplicações que cooperam que os tokens estão em uso e não devem ser modificados.

* As listas de tokens de versão são estabelecidas por servidor (por exemplo, para especificar a atribuição do servidor ou o estado operacional). Além disso, uma aplicação que se comunica com um servidor pode registrar sua própria lista de tokens que indicam o estado que o servidor deve estar. Uma declaração SQL enviada pela aplicação para um servidor que não está no estado necessário produz um erro. Esse é um sinal para a aplicação de que ela deve procurar um servidor diferente no estado necessário para receber a declaração SQL.

As seções a seguir descrevem os elementos dos Tokens de Versão, discutem como instalá-los e usá-los, e fornecem informações de referência sobre seus elementos.

#### 5.5.5.1 Tokens de versão Elementos

Version Tokens é baseado em uma biblioteca de plugins que implementa esses elementos:

* Um plugin do lado do servidor chamado `version_tokens` contém a lista de tokens de versão associados ao servidor e se inscreve em notificações para eventos de execução de declarações. O plugin `version_tokens` usa a API do plugin de auditoria para monitorar declarações recebidas dos clientes e combina a lista de tokens de versão específicos para cada sessão do cliente com a lista de tokens de versão do servidor. Se houver uma correspondência, o plugin permite que a declaração passe e o servidor continua a processá-la. Caso contrário, o plugin retorna um erro ao cliente e a declaração falha.

* Um conjunto de funções carregáveis oferece uma API em nível SQL para manipulação e inspeção da lista de tokens de versão do servidor mantidos pelo plugin. O privilégio `SUPER` é necessário para chamar qualquer uma das funções de Token de Versão.

* Uma variável do sistema permite que os clientes especifiquem a lista de tokens de versão que registram o estado do servidor necessário. Se o servidor tiver um estado diferente quando um cliente envia uma declaração, o cliente receberá um erro.

#### 5.5.5.2 Instalar ou desinstalar tokens de versão

Nota

Se instalado, o Version Tokens exige alguns custos adicionais. Para evitar esses custos, não o instale a menos que você planeje usá-lo.

Esta seção descreve como instalar ou desinstalar Tokens de versão, que é implementado em um arquivo de biblioteca de plugins que contém um plugin e funções carregáveis. Para informações gerais sobre como instalar ou desinstalar plugins e funções carregáveis, consulte Seção 5.5.1, “Instalando e Desinstalando Plugins”, e Seção 5.6.1, “Instalando e Desinstalando Funções Carregáveis”.

Para ser utilizável pelo servidor, o arquivo da biblioteca de plugins deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin, definindo o valor de `plugin_dir` na inicialização do servidor.

O nome de arquivo da biblioteca de plugins é `version_tokens`. O sufixo do nome do arquivo difere de acordo com a plataforma (por exemplo, `.so` para sistemas Unix e Unix-like, `.dll` para Windows).

Para instalar o plugin e as funções de Version Tokens, use as declarações `INSTALL PLUGIN` e `CREATE FUNCTION`, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```sql
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

```sql
UNINSTALL PLUGIN version_tokens;
DROP FUNCTION version_tokens_set;
DROP FUNCTION version_tokens_show;
DROP FUNCTION version_tokens_edit;
DROP FUNCTION version_tokens_delete;
DROP FUNCTION version_tokens_lock_shared;
DROP FUNCTION version_tokens_lock_exclusive;
DROP FUNCTION version_tokens_unlock;
```

#### 5.5.5.3 Uso de Tokens de Versão

Antes de usar Tokens de versão, instale-o de acordo com as instruções fornecidas na Seção 5.5.5.2, “Instalando ou Desinstalando Tokens de versão”.

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

Quando o Version Tokens é inicializado em um servidor específico, a lista de tokens da versão do servidor está vazia. A manutenção da lista de tokens é realizada ao chamar funções. O privilégio `SUPER` é necessário para chamar qualquer uma das funções do Token de Versão, portanto, a modificação da lista de tokens deve ser realizada por uma aplicação de gerenciamento ou administrativa que tenha esse privilégio.

Suponha que um aplicativo de gestão comunique-se com um conjunto de servidores que são consultados por clientes para acessar bancos de dados de funcionários e produtos (denominados `emp` e `prod`, respectivamente). Todos os servidores têm permissão para processar solicitações de recuperação de dados, mas apenas alguns deles têm permissão para fazer atualizações no banco de dados. Para lidar com isso de forma específica para o banco de dados, o aplicativo de gestão estabelece uma lista de tokens de versão em cada servidor. Na lista de tokens para um servidor específico, os nomes dos tokens representam os nomes dos bancos de dados e os valores dos tokens são `read` ou `write`, dependendo se o banco de dados deve ser usado de forma somente leitura ou se pode realizar leituras e escritas.

As aplicações do cliente registram uma lista de tokens de versão que exigem que o servidor corresponda, definindo uma variável do sistema. A definição da variável ocorre de forma específica para cada cliente, portanto, diferentes clientes podem registrar diferentes requisitos. Por padrão, a lista de tokens do cliente está vazia, o que corresponde a qualquer lista de tokens do servidor. Quando um cliente define sua lista de tokens como um valor não vazio, a correspondência pode ser bem-sucedida ou falhar, dependendo da lista de tokens da versão do servidor.

Para definir a lista de tokens da versão para um servidor, o aplicativo de gerenciamento chama a função `version_tokens_set()`. (Existem também funções para modificar e exibir a lista de tokens, descritas mais adiante.) Por exemplo, o aplicativo pode enviar essas declarações para um grupo de três servidores:

Servidor 1:

```sql
mysql> SELECT version_tokens_set('emp=read;prod=read');
+------------------------------------------+
| version_tokens_set('emp=read;prod=read') |
+------------------------------------------+
| 2 version tokens set.                    |
+------------------------------------------+
```

Servidor 2:

```sql
mysql> SELECT version_tokens_set('emp=write;prod=read');
+-------------------------------------------+
| version_tokens_set('emp=write;prod=read') |
+-------------------------------------------+
| 2 version tokens set.                     |
+-------------------------------------------+
```

Servidor 3:

```sql
mysql> SELECT version_tokens_set('emp=read;prod=write');
+-------------------------------------------+
| version_tokens_set('emp=read;prod=write') |
+-------------------------------------------+
| 2 version tokens set.                     |
+-------------------------------------------+
```

A lista de tokens em cada caso é especificada como uma lista de pares `name=value` separados por ponto e vírgula. Os valores da lista de tokens resultantes resultam nesses mapeamentos do servidor:

* Qualquer servidor aceita leituras para qualquer banco de dados.
* Apenas o servidor 2 aceita atualizações para o banco de dados `emp`.

* Apenas o servidor 3 aceita atualizações para o banco de dados `prod`.

Além de atribuir uma lista de tokens de versão a cada servidor, o aplicativo de gerenciamento também mantém um cache que reflete as atribuições dos servidores.

Antes de se comunicar com os servidores, um aplicativo cliente entra em contato com o aplicativo de gerenciamento e recupera informações sobre as atribuições dos servidores. Em seguida, o cliente seleciona um servidor com base nessas atribuições. Suponha que um cliente queira realizar leituras e escritas no banco de dados `emp`. Com base nas atribuições anteriores, apenas o servidor 2 se qualifica. O cliente se conecta ao servidor 2 e registra seus requisitos de servidor lá, definindo sua variável de sistema `version_tokens_session`:

```sql
mysql> SET @@SESSION.version_tokens_session = 'emp=write';
```

Para declarações subsequentes enviadas pelo cliente para o servidor 2, o servidor compara sua própria lista de tokens da versão com a lista do cliente para verificar se elas correspondem. Se sim, as declarações são executadas normalmente:

```sql
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

```sql
mysql> SELECT version_tokens_edit('emp=write');
+----------------------------------+
| version_tokens_edit('emp=write') |
+----------------------------------+
| 1 version tokens updated.        |
+----------------------------------+
```

Servidor 2:

```sql
mysql> SELECT version_tokens_edit('emp=read');
+---------------------------------+
| version_tokens_edit('emp=read') |
+---------------------------------+
| 1 version tokens updated.       |
+---------------------------------+
```

`version_tokens_edit()` modifica os tokens nomeados na lista de tokens do servidor e deixa outros tokens inalterados.

Na próxima vez que o cliente envia uma declaração para o servidor 2, sua própria lista de tokens não corresponde mais à lista de tokens do servidor e ocorre um erro:

```sql
mysql> UPDATE emp.employee SET salary = salary * 1.1 WHERE id = 4982;
ERROR 3136 (42000): Version token mismatch for emp. Correct value read
```

Nesse caso, o cliente deve entrar em contato com o aplicativo de gerenciamento para obter informações atualizadas sobre as atribuições do servidor, selecionar um novo servidor e enviar a declaração falha para o novo servidor.

Nota

Cada cliente deve cooperar com o Version Tokens enviando apenas declarações de acordo com a lista de tokens que ele registra em um servidor específico. Por exemplo, se um cliente registra uma lista de tokens como `'emp=read'`, não há nada no Version Tokens que impeça o cliente de enviar atualizações para o banco de dados `emp`. O próprio cliente deve abster-se de fazer isso.

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

```sql
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

```sql
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

```sql
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

```sql
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

```sql
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

As funções de bloqueio de Tokens de versão são baseadas no serviço de bloqueio descrito na Seção 5.5.6.1, “O Serviço de Bloqueio”, e, portanto, têm a mesma semântica para bloqueios compartilhados e exclusivos. (Version Tokens usa as rotinas de serviço de bloqueio integradas ao servidor, não a interface da função do serviço de bloqueio, portanto, essas funções não precisam ser instaladas para usar Version Tokens.) Bloqueios adquiridos por Version Tokens usam um namespace de serviço de bloqueio de `version_token_locks`. Bloqueios de serviço de bloqueio podem ser monitorados usando o Schema de Desempenho, portanto, isso também é verdadeiro para os bloqueios de Version Tokens. Para detalhes, consulte Monitoramento do Serviço de Bloqueio.

Para as funções de bloqueio de Tokens de Versão, os argumentos do nome do token são usados exatamente conforme especificado. Espaços em branco ao redor não são ignorados e os caracteres `=` e `;` são permitidos. Isso ocorre porque os Tokens de Versão simplesmente passam os nomes dos tokens a serem bloqueados como é para o serviço de bloqueio.

#### 5.5.5.4 Referência de Tokens de Versão

A discussão a seguir serve como referência para esses elementos de Tokens de Versão:

* Funções dos Tokens de Versão
* Variáveis de Sistema dos Tokens de Versão

##### Tokens de versão Funções

A biblioteca de plugins Version Tokens inclui vários tipos de funções. Um conjunto de funções permite que a lista de tokens de versão do servidor seja manipulada e inspecionada. Outro conjunto de funções permite que os tokens de versão sejam bloqueados e desbloqueados. O privilégio `SUPER` é necessário para invocar qualquer função de Tokens de Versão.

As funções a seguir permitem a criação, alteração, remoção e inspeção da lista de tokens de versão do servidor. A interpretação dos argumentos *`name_list`* e *`token_list`* (incluindo o tratamento de espaços em branco) ocorre conforme descrito na Seção 5.5.5.3, “Usando Tokens de Versão”, que fornece detalhes sobre a sintaxe para especificar tokens, bem como exemplos adicionais.

* `version_tokens_delete(name_list)`

Exclui tokens da lista de tokens de versão do servidor usando o argumento *`name_list`* e retorna uma string binária que indica o resultado da operação. *`name_list`* é uma lista de nomes de tokens de versão separados por ponto e vírgula para excluir.

  ```sql
  mysql> SELECT version_tokens_delete('tok1;tok3');
  +------------------------------------+
  | version_tokens_delete('tok1;tok3') |
  +------------------------------------+
  | 2 version tokens deleted.          |
  +------------------------------------+
  ```

Um argumento de `NULL` é tratado como uma string vazia, que não tem efeito na lista de tokens.

`version_tokens_delete()` exclui os tokens nomeados em seu argumento, se eles existirem. (Não é um erro excluir tokens não existentes.) Para limpar a lista de tokens inteiramente sem saber quais tokens estão na lista, passe `NULL` ou uma string que não contenha tokens para `version_tokens_set()`:

  ```sql
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

  ```sql
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

  ```sql
  mysql> SELECT version_tokens_set('tok1=value1;tok2=value2');
  +-----------------------------------------------+
  | version_tokens_set('tok1=value1;tok2=value2') |
  +-----------------------------------------------+
  | 2 version tokens set.                         |
  +-----------------------------------------------+
  ```

* `version_tokens_show()`

Retorna a lista de tokens de versão do servidor como uma string binária contendo uma lista separada por ponto e vírgula de pares `name=value`.

  ```sql
  mysql> SELECT version_tokens_show();
  +--------------------------+
  | version_tokens_show()    |
  +--------------------------+
  | tok2=value2;tok1=value1; |
  +--------------------------+
  ```

As funções a seguir permitem que os tokens de versão sejam bloqueados e desbloqueados:

* `version_tokens_lock_exclusive(token_name[, token_name] ..., timeout)`

Adquire blocos exclusivos em uma ou mais tokens de versão, especificados pelo nome como strings, expirando com um erro se os blocos não forem adquiridos dentro do valor de tempo de espera especificado.

  ```sql
  mysql> SELECT version_tokens_lock_exclusive('lock1', 'lock2', 10);
  +-----------------------------------------------------+
  | version_tokens_lock_exclusive('lock1', 'lock2', 10) |
  +-----------------------------------------------------+
  |                                                   1 |
  +-----------------------------------------------------+
  ```

* `version_tokens_lock_shared(token_name[, token_name] ..., timeout)`

Adquire blocos de fechamento compartilhados em um ou mais tokens de versão, especificados por nome como strings, expirando com um erro se os blocos não forem adquiridos dentro do valor de tempo de espera especificado.

  ```sql
  mysql> SELECT version_tokens_lock_shared('lock1', 'lock2', 10);
  +--------------------------------------------------+
  | version_tokens_lock_shared('lock1', 'lock2', 10) |
  +--------------------------------------------------+
  |                                                1 |
  +--------------------------------------------------+
  ```

* `version_tokens_unlock()`

Libera todos os bloqueios que foram adquiridos durante a sessão atual usando `version_tokens_lock_exclusive()` e `version_tokens_lock_shared()`.

  ```sql
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

* As funções de bloqueio de tokens de versão são baseadas no serviço de bloqueio descrito na Seção 5.5.6.1, “O Serviço de Bloqueio”.

##### Sistema de Tokens de Versão Variáveis

As Versões Tokens suportam as seguintes variáveis de sistema. Essas variáveis não estão disponíveis a menos que o plugin Versões Tokens esteja instalado (consulte Seção 5.5.5.2, “Instalando ou Desinstalando Versões Tokens”).

Variáveis do sistema:

* `version_tokens_session`

  <table frame="box" rules="all" summary="Properties for version_tokens_session"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--version-tokens-session=value</code></td> </tr><tr><th>System Variable</th> <td><code>version_tokens_session</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>NULL</code></td> </tr></tbody></table>

O valor da sessão desta variável especifica a lista de tokens da versão do cliente e indica os tokens que a sessão do cliente exige que a lista de tokens da versão do servidor tenha.

Se a variável `version_tokens_session` for `NULL` (padrão) ou tiver um valor vazio, qualquer lista de tokens de versão do servidor corresponde. (Na prática, um valor vazio desativa os requisitos de correspondência.)

Se a variável `version_tokens_session` tiver um valor não vazio, qualquer desalinhamento entre seu valor e a lista de tokens da versão do servidor resulta em um erro para qualquer declaração que a sessão envie ao servidor. Um desalinhamento ocorre sob essas condições:

+ Um nome de token no valor `version_tokens_session` não está presente na lista de tokens do servidor. Neste caso, ocorre um erro `ER_VTOKEN_PLUGIN_TOKEN_NOT_FOUND`.

+ Um valor de token na `version_tokens_session` difere do valor do token correspondente na lista de tokens do servidor. Neste caso, ocorre um erro `ER_VTOKEN_PLUGIN_TOKEN_MISMATCH`.

Não é uma incompatibilidade que a lista de tokens da versão do servidor inclua um token que não esteja nomeado no valor `version_tokens_session`.

Suponha que um aplicativo de gerenciamento tenha definido a lista de tokens do servidor da seguinte forma:

  ```sql
  mysql> SELECT version_tokens_set('tok1=a;tok2=b;tok3=c');
  +--------------------------------------------+
  | version_tokens_set('tok1=a;tok2=b;tok3=c') |
  +--------------------------------------------+
  | 3 version tokens set.                      |
  +--------------------------------------------+
  ```

Um cliente registra os tokens que exige que o servidor corresponda, definindo seu valor `version_tokens_session`. Em seguida, para cada declaração subsequente enviada pelo cliente, o servidor verifica sua lista de tokens contra o valor do cliente `version_tokens_session` e produz um erro se houver uma discrepância:

  ```sql
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

  ```sql
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

  ```sql
  mysql> SELECT 1;
  +---+
  | 1 |
  +---+
  | 1 |
  +---+
  ```

* `version_tokens_session_number`

<table frame="box" rules="all" summary="Properties for version_tokens_session_number">
<col style="width: 30%"/>
<col style="width: 70%"/>
<tbody>
<tr>
<th>Command-Line Format</th>
<td><code>--version-tokens-session-number=#</code></td>
</tr>
<tr>
<th>System Variable</th>
<td><code>version_tokens_session_number</code></td>
</tr>
<tr>
<th>Scope</th>
<td>Global, Session</td>
</tr>
<tr>
<th>Dynamic</th>
<td>No</td>
</tr>
<tr>
<th>Type</th>
<td>Integer</td>
</tr>
<tr>
<th>Default Value</th>
<td><code>0</code></td>
</tr>
</tbody>
</table>

Esta variável é para uso interno.

### 5.5.6 Serviços de Plugin do MySQL

Os plugins do servidor MySQL têm acesso aos "serviços de plugin" do servidor. A interface dos serviços de plugin complementa a API do plugin, expondo funcionalidades do servidor que os plugins podem chamar. Para informações sobre como escrever serviços de plugin para desenvolvedores, consulte Serviços do MySQL para Plugins. As seções a seguir descrevem os serviços de plugin disponíveis nos níveis de SQL e C.

#### 5.5.6.1 O Serviço de Fechamento

As distribuições do MySQL fornecem uma interface de bloqueio acessível em dois níveis:

* No nível SQL, como um conjunto de funções carregáveis que cada uma corresponde a chamadas às rotinas de serviço.

* Como uma interface em linguagem C, pode ser chamada como um serviço de plugin a partir de plugins de servidor ou funções carregáveis.

Para informações gerais sobre os serviços de plugins, consulte a Seção 5.5.6, “Serviços de plugins MySQL”. Para informações gerais sobre funções carregáveis, consulte Adicionar uma função carregável.

A interface de bloqueio possui essas características:

* As chaves têm três atributos: Espaço de nome de chave, nome da chave e modo de chave:

Os bloqueios são identificados pela combinação de nome de espaço de nome e nome do bloqueio. O espaço de nome permite que diferentes aplicativos usem os mesmos nomes de bloqueio sem colidir ao criar blocos em espaços de nome separados. Por exemplo, se os aplicativos A e B usam os namespaces `ns1` e `ns2`, respectivamente, cada aplicativo pode usar os nomes de bloqueio `lock1` e `lock2` sem interferir com o outro aplicativo.

+ Um modo de bloqueio é de leitura ou de escrita. As bloqueadoras de leitura são compartilhadas: se uma sessão tiver uma bloqueadora de leitura em um identificador de bloqueio dado, outras sessões podem adquirir uma bloqueadora de leitura no mesmo identificador. As bloqueadoras de escrita são exclusivas: se uma sessão tiver uma bloqueadora de escrita em um identificador de bloqueio dado, outras sessões não podem adquirir uma bloqueadora de leitura ou de escrita no mesmo identificador.

* Os nomes de namespace e bloqueio devem ser não `NULL`, não vazios e ter um comprimento máximo de 64 caracteres. Um namespace ou nome de bloqueio especificado como `NULL`, a string vazia ou uma string com mais de 64 caracteres resulta em um erro `ER_LOCKING_SERVICE_WRONG_NAME`.

* A interface de bloqueio trata o nome do namespace e o nome do bloqueio como strings binárias, portanto, as comparações são sensíveis ao caso.

* A interface de bloqueio oferece funções para adquirir e liberar bloqueios. Não é necessário privilégio especial para chamar essas funções. A verificação de privilégio é responsabilidade do aplicativo que faz a chamada.

* As esperas por bloqueios podem ser realizadas se não estiverem disponíveis imediatamente. As chamadas de aquisição de bloqueios levam um valor de timeout inteiro que indica quantos segundos devem ser esperados para adquirir blocos antes de desistir. Se o timeout for atingido sem aquisição bem-sucedida de bloqueios, ocorre um erro `ER_LOCKING_SERVICE_TIMEOUT`. Se o timeout for 0, não há espera e a chamada produz um erro se os blocos não puderem ser adquiridos imediatamente.

* A interface de bloqueio detecta impasse entre chamadas de aquisição de bloqueio em diferentes sessões. Neste caso, o serviço de bloqueio escolhe um chamador e termina sua solicitação de aquisição de bloqueio com um erro `ER_LOCKING_SERVICE_DEADLOCK`. Este erro não faz com que as transações sejam revertidas. Para escolher uma sessão em caso de impasse, o serviço de bloqueio prefere sessões que possuem blocos de leitura em detrimento de sessões que possuem blocos de escrita.

* Uma sessão pode adquirir múltiplos bloqueios com uma única chamada de aquisição de bloqueio. Para uma chamada específica, a aquisição de bloqueio é atômica: a chamada é bem-sucedida se todos os bloqueios forem adquiridos. Se a aquisição de qualquer bloqueio falhar, a chamada não adquire nenhum bloqueio e falha, tipicamente com um erro `ER_LOCKING_SERVICE_TIMEOUT` ou `ER_LOCKING_SERVICE_DEADLOCK`.

* Uma sessão pode adquirir múltiplos bloqueios para o mesmo identificador de bloqueio (combinação de namespace e nome de bloqueio). Essas instâncias de bloqueio podem ser blocos de leitura, blocos de escrita ou uma mistura de ambos.

* As chaves adquiridas dentro de uma sessão são liberadas explicitamente ao chamar uma função de liberação de chaves, ou implicitamente quando a sessão é encerrada (normalmente ou anormalmente). As chaves não são liberadas quando as transações são confirmadas ou revertidas.

* Dentro de uma sessão, todas as chaves para um namespace dado são liberadas juntas.

A interface fornecida pelo serviço de bloqueio é distinta daquela fornecida por `GET_LOCK()` e funções SQL relacionadas (consulte a Seção 12.14, “Funções de bloqueio”). Por exemplo, `GET_LOCK()` não implementa namespaces e fornece apenas bloqueios exclusivos, não bloqueios de leitura e escrita distintos.

##### 5.5.6.1.1 A Interface do Serviço de Fechamento C

Esta seção descreve como usar a interface do serviço de bloqueio em linguagem C. Para usar a interface da função do serviço de bloqueio, consulte a Seção 5.5.6.1.2, “A Interface da Função do Serviço de Bloqueio”. Para obter informações gerais sobre a interface do serviço de bloqueio, consulte a Seção 5.5.6, “O Serviço de Bloqueio”. Para informações gerais sobre os serviços de plugin, consulte a Seção 5.5.6, “Serviços de Plugin do MySQL”.

Os arquivos de origem que utilizam o serviço de bloqueio devem incluir este arquivo de cabeçalho:

```sql
#include <mysql/service_locking.h>
```

Para adquirir um ou mais bloqueios, chame esta função:

```sql
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

* `lock_type`: O modo de bloqueio, seja `LOCKING_SERVICE_READ` ou `LOCKING_SERVICE_WRITE` para adquirir bloqueios de leitura ou escrita, respectivamente.

* `lock_timeout`: Um número inteiro de segundos para esperar para adquirir as chaves antes de desistir.

Para liberar bloqueados adquiridos para um namespace específico, chame esta função:

```sql
int mysql_release_locking_service_locks(MYSQL_THD opaque_thd,
                                        const char* lock_namespace);
```

Os argumentos têm esses significados:

* `opaque_thd`: Um controle de fio. Se especificado como `NULL`, o controle do fio do thread atual é usado.

* `lock_namespace`: Uma cadeia de caracteres terminada por nulo que indica o espaço de nomes de bloqueio.

As chaves adquiridas ou aguardadas pelo serviço de bloqueio podem ser monitoradas no nível SQL usando o Gerador de Desempenho. Para obter detalhes, consulte Monitoramento do Serviço de Bloqueio.

##### 5.5.6.1.2 A Interface da Função de Serviço de Acionamento

Esta seção descreve como usar a interface do serviço de bloqueio fornecida por suas funções carregáveis. Para usar a interface em linguagem C, consulte a Seção 5.5.6.1.1, “A Interface do Serviço de Bloqueio em C”. Para informações gerais sobre a interface do serviço de bloqueio, consulte a Seção 5.5.6.1, “O Serviço de Bloqueio”. Para informações gerais sobre funções carregáveis, consulte Adicionando uma Função Carregável.

* Instalar ou desinstalar a interface da função de serviço de bloqueio * Usar a interface da função de serviço de bloqueio * Monitoramento do serviço de bloqueio * Referência da função da interface do serviço de bloqueio

###### Instalar ou desinstalar a interface da função de serviço de bloqueio

Os serviços de bloqueio descritos na Seção 5.5.6.1.1, “A Interface C do Serviço de Bloqueio”, não precisam ser instalados, pois estão embutidos no servidor. O mesmo não se aplica às funções carregáveis que mapeiam chamadas para as rotinas de serviço: as funções devem ser instaladas antes do uso. Esta seção descreve como fazer isso. Para informações gerais sobre a instalação de funções carregáveis, consulte a Seção 5.6.1, “Instalando e Desinstalando Funções Carregáveis”.

As funções de serviço de bloqueio são implementadas em um arquivo de biblioteca de plugins localizado no diretório denominado pela variável de sistema `plugin_dir`. O nome do arquivo base é `locking_service`. O sufixo do nome do arquivo difere por plataforma (por exemplo, `.so` para sistemas Unix e Unix-like, `.dll` para Windows).

Para instalar as funções de serviço de bloqueio, use a declaração `CREATE FUNCTION`, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```sql
CREATE FUNCTION service_get_read_locks RETURNS INT
  SONAME 'locking_service.so';
CREATE FUNCTION service_get_write_locks RETURNS INT
  SONAME 'locking_service.so';
CREATE FUNCTION service_release_locks RETURNS INT
  SONAME 'locking_service.so';
```

Se as funções forem usadas em um servidor de fonte de replicação, instale-as em todos os servidores replicados também, para evitar problemas de replicação.

Uma vez instalado, as funções permanecem instaladas até serem desinstaladas. Para removê-las, use a declaração `DROP FUNCTION`:

```sql
DROP FUNCTION service_get_read_locks;
DROP FUNCTION service_get_write_locks;
DROP FUNCTION service_release_locks;
```

###### Usando a Interface da Função de Serviço de Acionamento

Antes de usar as funções do serviço de bloqueio, instale-as de acordo com as instruções fornecidas em Instalar ou Desinstalar a Interface da Função de Serviço de Bloqueio.

Para adquirir um ou mais bloqueios de leitura, chame esta função:

```sql
mysql> SELECT service_get_read_locks('mynamespace', 'rlock1', 'rlock2', 10);
+---------------------------------------------------------------+
| service_get_read_locks('mynamespace', 'rlock1', 'rlock2', 10) |
+---------------------------------------------------------------+
|                                                             1 |
+---------------------------------------------------------------+
```

O primeiro argumento é o namespace do bloqueio. O último argumento é um tempo de espera inteiro que indica quantos segundos devem ser esperados para adquirir os bloqueios antes de desistir. Os argumentos entre eles são os nomes dos bloqueios.

Para o exemplo que acabou de ser mostrado, a função obtém bloqueios com identificadores de bloqueio `(mynamespace, rlock1)` e `(mynamespace, rlock2)`.

Para adquirir bloqueios de escrita em vez de bloqueios de leitura, chame esta função:

```sql
mysql> SELECT service_get_write_locks('mynamespace', 'wlock1', 'wlock2', 10);
+----------------------------------------------------------------+
| service_get_write_locks('mynamespace', 'wlock1', 'wlock2', 10) |
+----------------------------------------------------------------+
|                                                              1 |
+----------------------------------------------------------------+
```

Neste caso, os identificadores de bloqueio são `(mynamespace, wlock1)` e `(mynamespace, wlock2)`.

Para liberar todos os bloqueios de um namespace, use esta função:

```sql
mysql> SELECT service_release_locks('mynamespace');
+--------------------------------------+
| service_release_locks('mynamespace') |
+--------------------------------------+
|                                    1 |
+--------------------------------------+
```

Cada função de bloqueio retorna um valor não nulo para sucesso. Se a função falhar, ocorre um erro. Por exemplo, o seguinte erro ocorre porque os nomes de bloqueio não podem ser vazios:

```sql
mysql> SELECT service_get_read_locks('mynamespace', '', 10);
ERROR 3131 (42000): Incorrect locking service lock name ''.
```

Uma sessão pode adquirir múltiplos bloqueios para o mesmo identificador de bloqueio. Desde que uma sessão diferente não tenha um bloqueio de escrita para um identificador, a sessão pode adquirir qualquer número de blocos de leitura ou escrita. Cada solicitação de bloqueio para o identificador adquire um novo bloqueio. As seguintes declarações adquirem três blocos de escrita com o mesmo identificador, em seguida, três blocos de leitura para o mesmo identificador:

```sql
SELECT service_get_write_locks('ns', 'lock1', 'lock1', 'lock1', 0);
SELECT service_get_read_locks('ns', 'lock1', 'lock1', 'lock1', 0);
```

Se você examinar a tabela do Schema de desempenho `metadata_locks` neste momento, você descobrirá que a sessão possui seis bloqueios distintos com o mesmo identificador `(ns, lock1)`. (Para detalhes, consulte Monitoramento do serviço de bloqueio.)

Como a sessão mantém pelo menos um bloqueio de escrita em `(ns, lock1)`, nenhuma outra sessão pode adquirir um bloqueio para ele, seja de leitura ou de escrita. Se a sessão tivesse apenas blocos de leitura para o identificador, outras sessões poderiam adquirir blocos de leitura para ele, mas não blocos de escrita.

As chaves para uma única chamada de aquisição de chave são adquiridas de forma atômica, mas a atinência não se estende a chamadas múltiplas. Assim, para uma declaração como a seguinte, onde `service_get_write_locks()` é chamada uma vez por linha do conjunto de resultados, a atinência se mantém para cada chamada individual, mas não para a declaração como um todo:

```sql
SELECT service_get_write_locks('ns', 'lock1', 'lock2', 0) FROM t1 WHERE ... ;
```

Cuidado

Como o serviço de bloqueio retorna um bloqueio separado para cada solicitação bem-sucedida para um identificador de bloqueio dado, é possível que uma única declaração adquira um grande número de blocos. Por exemplo:

```sql
INSERT INTO ... SELECT service_get_write_locks('ns', t1.col_name, 0) FROM t1;
```

Esses tipos de declarações podem ter certos efeitos adversos. Por exemplo, se a declaração falhar em meio caminho e for revertida, as chaves adquiridas até o ponto de falha ainda existem. Se a intenção é que haja uma correspondência entre as linhas inseridas e as chaves adquiridas, essa intenção não é satisfeita. Além disso, se é importante que as chaves sejam concedidas em uma certa ordem, esteja ciente de que a ordem do conjunto de resultados pode diferir dependendo do plano de execução que o otimizador escolhe. Por essas razões, pode ser melhor limitar as aplicações a uma única chamada de aquisição de chave por declaração.

###### Monitoramento do Serviço de Fechamento

O serviço de bloqueio é implementado usando o framework de bloqueio de metadados do MySQL Server, então você monitora os bloqueios do serviço de bloqueio adquiridos ou esperados examinando a tabela do Gerador de Desempenho `metadata_locks`.

Primeiro, habilite o instrumento de bloqueio de metadados:

```sql
mysql> UPDATE performance_schema.setup_instruments SET ENABLED = 'YES'
    -> WHERE NAME = 'wait/lock/metadata/sql/mdl';
```

Em seguida, adquira algumas chaves e verifique o conteúdo da tabela `metadata_locks`:

```sql
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

As fechaduras de serviço de bloqueio têm um valor `OBJECT_TYPE` de `LOCKING SERVICE`. Isso é distinto, por exemplo, das fechaduras adquiridas com a função `GET_LOCK()`, que têm um `OBJECT_TYPE` de `USER LEVEL LOCK`.

O nome do namespace, nome e modo do bloqueio aparecem nas colunas `OBJECT_SCHEMA`, `OBJECT_NAME` e `LOCK_TYPE`. Os bloqueios de leitura e escrita têm os valores `LOCK_TYPE` de `SHARED` e `EXCLUSIVE`, respectivamente.

O valor `LOCK_STATUS` é `GRANTED` para um bloqueio adquirido, `PENDING` para um bloqueio que está sendo aguardado. Você vê `PENDING` se uma sessão detém um bloqueio de escrita e outra sessão está tentando adquirir um bloqueio com o mesmo identificador.

###### Referência de função da interface do serviço de bloqueio

A interface SQL para o serviço de bloqueio implementa as funções carregáveis descritas nesta seção. Para exemplos de uso, consulte Usando a Interface de Função do Serviço de Bloqueio.

As funções compartilham essas características:

* O valor de retorno não é nulo para sucesso. Caso contrário, ocorre um erro.

* Os nomes de namespace e de bloqueio devem ser não `NULL`, não vazios e ter um comprimento máximo de 64 caracteres.

* Os valores de tempo de espera devem ser números inteiros que indicam quantos segundos esperar para adquirir blocos antes de desistir com um erro. Se o tempo de espera for 0, não há espera e a função produz um erro se os blocos não puderem ser adquiridos imediatamente.

Essas funções de serviço de bloqueio estão disponíveis:

* `service_get_read_locks(namespace, lock_name[, lock_name] ..., timeout)`

Adquire um ou mais bloqueios de leitura (compartilhado) no namespace fornecido usando os nomes de bloqueio fornecidos, expirando com um erro se os bloqueios não forem adquiridos dentro do valor de tempo de espera fornecido.

* `service_get_write_locks(namespace, lock_name[, lock_name] ..., timeout)`

Adquire um ou mais bloqueios de escrita (exclusivos) no namespace fornecido usando os nomes de bloqueio fornecidos, expirando com um erro se os bloqueios não forem adquiridos dentro do valor de tempo de espera fornecido.

* `service_release_locks(namespace)`

Para o namespace dado, libere todas as chaves de acesso que foram adquiridas dentro da sessão atual usando `service_get_read_locks()` e `service_get_write_locks()`.

Não é um erro não haver trancas no espaço de nome.

#### 5.5.6.2 O Serviço de Chaveiro

O MySQL Server suporta um serviço de chave de segurança que permite que os componentes internos do servidor e os plugins armazenem informações sensíveis de forma segura para recuperação posterior. As distribuições do MySQL fornecem uma interface de chave de segurança que é acessível em dois níveis:

* No nível SQL, como um conjunto de funções carregáveis que cada uma corresponde a chamadas às rotinas de serviço.

* Como uma interface em linguagem C, pode ser chamada como um serviço de plugin a partir de plugins de servidor ou funções carregáveis.

Esta seção descreve como usar as funções do serviço de chaveiro para armazenar, recuperar e remover chaves no keystore de chaveiro MySQL. Para informações sobre a interface SQL que usa funções, consulte a Seção 6.4.4.8, “Funções de gerenciamento de chave de chaveiro de propósito geral”. Para informações gerais sobre o chaveiro, consulte a Seção 6.4.4, “O chaveiro MySQL”.

O serviço de chaveiro usa qualquer plugin de chaveiro subjacente que esteja habilitado, se houver. Se nenhum plugin de chaveiro estiver habilitado, as chamadas do serviço de chaveiro falham.

Um "registro" no keystore consiste em dados (a própria chave) e um identificador único através do qual a chave é acessada. O identificador tem duas partes:

* `key_id`: O ID ou nome chave. Os valores `key_id` que começam com `mysql_` são reservados pelo MySQL Server.

* `user_id`: O ID de usuário efetivo da sessão. Se não houver contexto de usuário, este valor pode ser `NULL`. O valor não precisa ser realmente um "usuário"; o significado depende do aplicativo.

As funções que implementam a interface da função de chave de segurança passam o valor de `CURRENT_USER()` como o valor de `user_id` para as funções do serviço de chave de segurança.

Os serviços de chaveiros têm essas características em comum:

* Cada função retorna 0 para sucesso, 1 para falha.
* Os argumentos `key_id` e `user_id` formam uma combinação única que indica qual chave no conjunto de chaves deve ser usada.

* O argumento `key_type` fornece informações adicionais sobre a chave, como seu método de criptografia ou uso pretendido.

* As funções do serviço de chave tratam os IDs de chave, nomes de usuário, tipos e valores como strings binárias, portanto, as comparações são sensíveis ao caso. Por exemplo, os IDs de `MyKey` e `mykey` referem-se a chaves diferentes.

Essas funções de serviço de chaveiro estão disponíveis:

* `my_key_fetch()`

Desobfusa e recupera uma chave do chaveiro, juntamente com seu tipo. A função aloca a memória para os buffers usados para armazenar a chave e o tipo de chave retornados. O chamador deve zerar ou obfusar a memória quando ela não for mais necessária, e depois liberá-la.

Sintaxe:

  ```sql
  my_bool my_key_fetch(const char *key_id, const char **key_type,
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

Gera uma nova chave aleatória de um tipo e comprimento determinados e a armazena no chaveiro. A chave tem um comprimento de `key_len` e está associada ao identificador formado por `key_id` e `user_id`. Os valores de tipo e comprimento devem ser consistentes com os valores suportados pelo plugin do chaveiro subjacente. Veja a Seção 6.4.4.6, “Tipos e comprimentos de chave suportados no chaveiro”.

Sintaxe:

  ```sql
  my_bool my_key_generate(const char *key_id, const char *key_type,
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

  ```sql
  my_bool my_key_remove(const char *key_id, const char* user_id)
  ```

Argumentos:

+ `key_id`, `user_id`: Strings terminadas por nulo que, como um par, formam um identificador único para a chave a ser removida.

Valor de retorno:

Retorna 0 para sucesso, 1 para falha.

* `my_key_store()`

Oculta e armazena uma chave no chaveiro.

Sintaxe:

  ```sql
  my_bool my_key_store(const char *key_id, const char *key_type,
                       const char* user_id, void *key, size_t key_len)
  ```

Argumentos:

+ `key_id`, `user_id`: Strings terminadas por nulo que, como um par, formam um identificador único para a chave a ser armazenada.

+ `key_type`: Uma cadeia de caracteres terminada por nulo que fornece informações adicionais sobre a chave.

+ `key`: O buffer contendo os dados chave a serem armazenados.

+ `key_len`: O tamanho em bytes do buffer `key`.

Valor de retorno:

Retorna 0 para sucesso, 1 para falha.

