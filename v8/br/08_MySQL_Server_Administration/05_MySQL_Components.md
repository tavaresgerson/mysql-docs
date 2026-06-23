## 7.5 Componentes do MySQL

O MySQL Server inclui uma infraestrutura baseada em componentes para ampliar as capacidades do servidor. Um componente oferece serviços que estão disponíveis para o servidor e outros componentes. (Em relação ao uso do serviço, o servidor é um componente, igual a outros componentes.) Os componentes interagem entre si apenas através dos serviços que fornecem.

As distribuições do MySQL incluem vários componentes que implementam extensões de servidor:

* Componentes para configurar o registro de erros. Veja a Seção 7.4.2, “O Log de Erros”, e a Seção 7.5.3, “Componentes do Log de Erros”.

* Um componente para verificar senhas. Veja a Seção 8.4.3, “O componente de validação de senha”.

* Os componentes do cartela de identificação oferecem armazenamento seguro para informações sensíveis. Veja a Seção 8.4.4, “O cartela de identificação MySQL”.

* Um componente que permite que as aplicações adicionem seus próprios eventos de mensagem ao registro de auditoria. Veja a Seção 8.4.6, “O componente de mensagem de auditoria”.

* Um componente que implementa uma função carregável para acessar atributos de consulta. Veja a Seção 11.6, “Atributos de consulta”.

* Um componente para agendamento de tarefas que são executadas ativamente. Veja a Seção 7.5.5, “Componente de Cronograma”.

As variáveis de sistema e status implementadas por um componente são expostas quando o componente é instalado e têm nomes que começam com um prefixo específico do componente. Por exemplo, o componente de filtro de registro de erro `log_filter_dragnet` implementa uma variável de sistema com o nome `log_error_filter_rules`, cujo nome completo é `dragnet.log_error_filter_rules`. Para se referir a essa variável, use o nome completo.

As seções a seguir descrevem como instalar e desinstalar componentes e como determinar em tempo de execução quais componentes estão instalados e obter informações sobre eles.

Para informações sobre a implementação interna dos componentes, consulte a documentação do Doxygen do MySQL Server, disponível em https://dev.mysql.com/doc/index-other.html. Por exemplo, se você pretende escrever seus próprios componentes, essas informações são importantes para entender como os componentes funcionam.

### 7.5.1 Instalar e Desinstalar Componentes

Os componentes devem ser carregados no servidor antes de poderem ser utilizados. O MySQL suporta o carregamento manual de componentes em tempo de execução e o carregamento automático durante a inicialização do servidor.

Enquanto um componente é carregado, as informações sobre ele estão disponíveis conforme descrito na Seção 7.5.2, “Obtenção de Informações sobre o Componente”.

As instruções SQL `INSTALL COMPONENT` e `UNINSTALL COMPONENT` permitem o carregamento e o descarregamento de componentes. Por exemplo:

```
INSTALL COMPONENT 'file://component_validate_password';
UNINSTALL COMPONENT 'file://component_validate_password';
```

Um serviço de carregamento lida com o carregamento e descarregamento de componentes, e também registra os componentes carregados na tabela do sistema `mysql.component`.

As instruções SQL para manipulação de componentes afetam o funcionamento do servidor e a tabela do sistema `mysql.component` da seguinte forma:

* `INSTALL COMPONENT` carrega componentes no servidor. Os componentes tornam-se ativos imediatamente. O serviço de carregamento também registra os componentes carregados na tabela do sistema `mysql.component`. Para reinicializações subsequentes do servidor, o serviço de carregamento carrega quaisquer componentes listados em `mysql.component` durante a sequência de inicialização. Isso ocorre mesmo se o servidor for iniciado com a opção `--skip-grant-tables`. A cláusula opcional `SET` permite definir valores de variáveis do sistema do componente ao instalar componentes.

* `UNINSTALL COMPONENT` desativa componentes e descarrega-os do servidor. O serviço de carregamento também desregistra os componentes da tabela do sistema `mysql.component`, para que o servidor não os carregue mais durante sua sequência de inicialização para reposições subsequentes.

Comparado à declaração correspondente `INSTALL PLUGIN` para plugins de servidor, a declaração `INSTALL COMPONENT` para componentes oferece a vantagem significativa de que não é necessário conhecer qualquer sufixo de nome de arquivo específico da plataforma para nomear o componente. Isso significa que uma declaração `INSTALL COMPONENT` dada pode ser executada uniformemente em todas as plataformas.

Um componente, quando instalado, também pode instalar automaticamente funções relacionadas. Se assim for, o componente, quando desinstalado, também desinstala automaticamente essas funções.

### 7.5.2 Obter informações sobre componentes

A tabela do sistema `mysql.component` contém informações sobre os componentes carregados atualmente e mostra quais componentes foram registrados usando `INSTALL COMPONENT`(install-component.html "15.7.4.3 INSTALL COMPONENT Statement"). Selecionar a tabela mostra quais componentes estão instalados. Por exemplo:

```
mysql> SELECT * FROM mysql.component;
+--------------+--------------------+------------------------------------+
| component_id | component_group_id | component_urn                      |
+--------------+--------------------+------------------------------------+
|            1 |                  1 | file://component_validate_password |
|            2 |                  2 | file://component_log_sink_json     |
+--------------+--------------------+------------------------------------+
```

Os valores `component_id` e `component_group_id` são para uso interno. O `component_urn` é a URN utilizada nas declarações `INSTALL COMPONENT` e `UNINSTALL COMPONENT` para carregar e descarregar o componente.

### 7.5.3 Componentes do Log de Erro

Esta seção descreve as características dos componentes do log de erros individual. Para informações gerais sobre a configuração do registro de erros, consulte a Seção 7.4.2, “O Log de Erros”.

Um componente de registro pode ser um filtro ou um repositório:

* Um filtro processa eventos de log, para adicionar, remover ou modificar campos de evento, ou para excluir eventos inteiramente. Os eventos resultantes passam para o próximo componente de log na lista de componentes habilitados.

* Um sink é um destino (escritor) de eventos de log. Tipicamente, um sink processa eventos de log em mensagens de log que têm um formato específico e escreve essas mensagens em sua saída associada, como um arquivo ou o log do sistema. Um sink também pode escrever na tabela do Schema de desempenho `error_log`; veja Seção 29.12.21.2, “A tabela error_log”. Os eventos passam inalterados para o próximo componente de log na lista de componentes habilitados (ou seja, embora um sink formate os eventos para produzir mensagens de saída, ele não modifica os eventos conforme eles passam internamente para o próximo componente).

O valor da variável de sistema `log_error_services` lista os componentes de log habilitados. Os componentes que não estão listados são desabilitados. A partir do MySQL 8.0.30, `log_error_services` também carrega implicitamente os componentes de log de erro, se ainda não estiverem carregados. Para mais informações, consulte a Seção 7.4.2.1, “Configuração do Log de Erro”.

As seções a seguir descrevem os componentes de log individuais, agrupados por tipo de componente:

* Filtro do Log de Erros Componentes
* Reciclar componentes do Log de Erros

As descrições dos componentes incluem esses tipos de informações:

* O nome do componente e o propósito pretendido.
* Se o componente é construído internamente ou deve ser carregado. Para um componente carregável, a descrição especifica o URN a ser usado se o componente for carregado ou descarregado explicitamente com as declarações `INSTALL COMPONENT` e `UNINSTALL COMPONENT`. Para carregar implicitamente componentes de log de erro, é necessário apenas o nome do componente. Para mais informações, consulte a Seção 7.4.2.1, “Configuração do Log de Erro”.

* Se o componente pode ser listado várias vezes no valor `log_error_services`.

* Para um componente de pia, o destino para o qual o componente escreve a saída.

* Para um componente de pia, se ele suporta uma interface para a tabela do Schema de Desempenho `error_log`.

#### Componentes do Log de Erro do Filtro

Os componentes de filtro do log de erro implementam o filtro de eventos do log de erro. Se nenhum componente de filtro estiver habilitado, não ocorrerá filtragem.

Qualquer componente de filtro habilitado afeta eventos de log apenas para componentes listados posteriormente no valor `log_error_services`. Em particular, para qualquer componente de canal de saída de log listado em `log_error_services` anteriormente a qualquer componente de filtro, não ocorre filtragem de eventos de log.

##### O componente log_filter_internal

* Propósito: Implementa filtragem com base na prioridade do evento do log e no código de erro, em combinação com as variáveis de sistema `log_error_verbosity` e `log_error_suppression_list`. Ver Seção 7.4.2.5, “Filtragem de log de erro com base na prioridade (log_filter_internal)”.

* URN: Este componente é construído e não precisa ser carregado. * Múltiplos usos permitidos:

Se `log_filter_internal` estiver desativado, `log_error_verbosity` e `log_error_suppression_list` não terão efeito.

##### O componente log_filter_dragnet

* Propósito: Implementa filtragem com base nas regras definidas pela variável de sistema `dragnet.log_error_filter_rules`. Veja a Seção 7.4.2.6, “Filtragem de registro de erro baseada em regras (log_filter_dragnet)”.

* URN: `file://component_log_filter_dragnet`
* Múltiplos usos permitidos:

#### Componentes do Log de Erros do Lavatório

Os componentes de canal de registro de erro são escritores que implementam a saída do registro de erro. Se nenhum componente de canal for habilitado, não ocorrerá saída de log.

Algumas descrições de componentes de sink se referem ao destino padrão do log de erro. Este é o console ou um arquivo e é indicado pelo valor da variável de sistema `log_error`, determinada conforme descrito na Seção 7.4.2.2, “Configuração do Destino Padrão do Log de Erro”.

##### O componente log_sink_internal

* Propósito: Implementa o formato tradicional de saída de mensagem de log de erro.

* URN: Este componente é construído e não precisa ser carregado. * Múltiplos usos permitidos: Não. * Destino de saída: Escreve no destino padrão do log de erro.

* Suporte ao esquema de desempenho: Escreve na tabela `error_log`. Fornece um analisador para leitura de arquivos de registro de erro criados por instâncias anteriores do servidor.

##### O componente log_sink_json

* Propósito: Implementa o registro de erros no formato JSON. Veja a Seção 7.4.2.7, “Registro de erros no formato JSON”.

* Permitido múltiplos usos: Sim. * Destino de saída: Este repositório determina seu destino de saída com base no destino padrão do log de erro, que é dado pela variável de sistema `log_error`:

+ Se `log_error` nomeia um arquivo, o arquivo de saída do tanque é baseado nesse nome de arquivo, além de um sufixo numerado `.NN.json`, com *`NN`* começando em

Por exemplo, se `log_error` é *`file_name`*, as instâncias sucessivas de `log_sink_json` nomeadas no valor do `log_error_services` escrevem para `file_name.00.json`, `file_name.01.json`, e assim por diante.

+ Se `log_error` é `stderr`, o retângulo escreve para o console. Se `log_sink_json` é nomeado várias vezes no valor de `log_error_services`, todos eles escrevem para o console, o que provavelmente não é útil.

* Suporte ao esquema de desempenho: Escreve na tabela [[`error_log`]. Fornece um analisador para leitura de arquivos de registro de erro criados por instâncias anteriores do servidor.

##### O componente log_sink_syseventlog

* Propósito: Implementa o registro de erros no log do sistema. Este é o Diálogo de Eventos no Windows e `syslog` em sistemas Unix e similares. Veja a Seção 7.4.2.8, “Registro de Erros no Log do Sistema”.

* URN: `file://component_log_sink_syseventlog`

* Múltiplos usos permitidos: Não. * Destino de saída: Escreve no log do sistema. Não usa o destino padrão do log de erro.

* Suporte ao esquema de desempenho: Não escreve na tabela [[`error_log`]. Não fornece um analisador para leitura de arquivos de registro de erro criados por instâncias anteriores do servidor.

##### O componente log_sink_test

* Propósito: Destinado ao uso interno na escrita de casos de teste, não para uso de produção.

* URN: `file://component_log_sink_test`

Propriedades de pia, como se múltiplos usos são permitidos e o destino da saída não são especificados para `log_sink_test`, porque, como mencionado, é para uso interno. Como tal, seu comportamento está sujeito a mudanças a qualquer momento.

### 7.5.4 Componentes de atributos de consulta

A partir do MySQL 8.0.23, um serviço de componente fornece acesso a atributos de consulta (consulte a Seção 11.6, “Atributos de consulta”). O componente `query_attributes` usa esse serviço para fornecer acesso a atributos de consulta dentro das instruções SQL.

* Propósito: Implementa a função `mysql_query_attribute_string()` que recebe um argumento de nome de atributo e retorna o valor do atributo como uma string, ou `NULL` se o atributo não existir.

* URN: `file://component_query_attributes`

Os desenvolvedores que desejam incorporar o mesmo serviço de componente de atributo de consulta utilizado pelo `query_attributes` devem consultar o arquivo `mysql_query_attributes.h` em uma distribuição de fonte MySQL.

### 7.5.5 Componente do Cronograma

Nota

O componente `scheduler` está incluído na Edição Empresarial do MySQL, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

A partir do MySQL 8.0.34, o componente `scheduler` fornece uma implementação do serviço `mysql_scheduler`, que permite que aplicativos, componentes ou plugins configurem, executem e desconfigurem tarefas a cada *`N`* segundos. Por exemplo, o plugin de servidor `audit_log` chama o componente `scheduler` em sua inicialização e configura um esvaziamento regular e recorrente de sua cache de memória (veja Habilitar a Tarefa de Esvaziamento do Log de Auditoria).

* Propósito: Implementa a variável de sistema `component_scheduler.enabled` que controla se o agendamento está executando tarefas ativamente. Ao iniciar, o componente `scheduler` registra a tabela `performance_schema.component_scheduler_tasks`, que lista as tarefas atualmente agendadas e alguns dados de execução sobre cada uma.

* URN: `file://component_scheduler`

Para obter instruções de instalação, consulte a Seção 7.5.1, “Instalando e Desinstalando Componentes”.

O componente `scheduler` implementa o serviço usando esses elementos:

* Uma fila de prioridade de tarefas agendadas registradas e inativas, ordenadas pela próxima vez que devem ser executadas (em ordem crescente).

* Uma lista das tarefas registradas e ativas. * Um fio de fundo que:

+ Dorme se não houver tarefas ou se a tarefa principal precisar de mais tempo para ser executada. Acorda periodicamente para verificar se é hora de encerrar.

+ Compila uma lista das tarefas que precisam ser executadas, as move da fila inativa, as adiciona à fila ativa e executa cada tarefa individualmente.

+ Após executar a lista de tarefas, remove as tarefas da lista ativa, adiciona-as à lista inativa e calcula a próxima vez que elas precisam ser executadas.

Quando um chamador invoca o serviço `mysql_scheduler.create()`, ele cria uma nova instância de tarefa agendada para adicionar à fila, o que sinaliza o semaforo do thread de fundo. Um handle para a nova tarefa é devolvido ao chamador. O código de chamada deve manter esse handle e a referência do serviço ao serviço de agendamento até após a chamada do serviço `mysql_scheduler.destroy()`. Quando o chamador invoca `destroy()` e passa o handle que recebeu de `create()`, o serviço espera que a tarefa se torne inativa (se estiver em execução) e, em seguida, a remove da fila inativa.

O serviço de componente chama cada callback fornecido pelo aplicativo (ponteiro de função) no mesmo fio do cronômetro, um de cada vez e em ordem crescente, com base no tempo que cada um deles leva para ser executado.

Os desenvolvedores que desejam incorporar capacidades de agendamento e fila em um aplicativo, componente ou plugin devem consultar o arquivo `mysql_scheduler.h` em uma distribuição de fonte MySQL.