### 7.5.3 Componentes do Log de Erros

Esta seção descreve as características dos componentes individuais do log de erros. Para informações gerais sobre a configuração do registro de erros, consulte a Seção 7.4.2, “O Log de Erros”.

Um componente de log pode ser um filtro ou um canal de saída:

* Um filtro processa eventos de log, para adicionar, remover ou modificar campos de evento, ou para excluir eventos completamente. Os eventos resultantes são passados para o próximo componente de log na lista de componentes habilitados.

* Um canal de saída é um destino (escritor) para eventos de log. Tipicamente, um canal de saída processa eventos de log em mensagens de log que têm um formato específico e escreve essas mensagens para sua saída associada, como um arquivo ou o log do sistema. Um canal de saída também pode escrever na tabela `error_log` do Schema de Desempenho; consulte a Seção 29.12.22.3, “A Tabela error_log”. Os eventos passam inalterados para o próximo componente de log na lista de componentes habilitados (ou seja, embora um canal de saída formate os eventos para produzir mensagens de saída, ele não modifica os eventos conforme eles passam internamente para o próximo componente).

A variável de sistema `log_error_services` lista os componentes de log habilitados. Componentes não mencionados na lista são desabilitados. `log_error_services` também carrega implicitamente os componentes de log de erros se eles ainda não estiverem carregados. Para mais informações, consulte a Seção 7.4.2.1, “Configuração do Log de Erros”.

As seções a seguir descrevem componentes de log individuais, agrupados por tipo de componente:

* Componentes de Filtro do Log de Erros
* Componentes de Canal de Saída do Log de Erros

* O nome do componente e seu propósito.
* Se o componente é embutido ou precisa ser carregado. Para um componente carregável, a descrição especifica o URN a ser usado se o componente for carregado ou descarregado explicitamente com as instruções `INSTALL COMPONENT` e `UNINSTALL COMPONENT`. Para componentes de registro de erros carregados implicitamente, é necessário apenas o nome do componente. Para mais informações, consulte a Seção 7.4.2.1, “Configuração do Registro de Erros”.

* Se o componente pode ser listado várias vezes no valor `log_error_services`.

* Para um componente de destino, o destino para o qual o componente escreve a saída.

* Para um componente de destino, se ele suporta uma interface para a tabela `error_log` do Schema de Desempenho.

#### Filtrar Componentes de Registro de Erros

Componentes de filtro de registro de erros implementam a filtragem de eventos do registro de erros. Se nenhum componente de filtro estiver habilitado, nenhuma filtragem ocorre.

Qualquer componente de filtro habilitado afeta os eventos de log apenas para componentes listados posteriormente no valor `log_error_services`. Em particular, para qualquer componente de destino de log listado em `log_error_services` antes de qualquer componente de filtro, não ocorre filtragem de eventos de log.

##### O componente log_filter_internal

* Propósito: Implementa a filtragem com base na prioridade do evento de log e no código de erro, em combinação com as variáveis de sistema `log_error_verbosity` e `log_error_suppression_list`. Consulte a Seção 7.4.2.5, “Filtragem de Registro de Erros Baseada em Prioridade (log_filter_internal”)”).

* URN: Este componente é embutido e não precisa ser carregado.
* Permitidos múltiplos usos: Não.

Se `log_filter_internal` estiver desabilitado, `log_error_verbosity` e `log_error_suppression_list` não terão efeito.

##### O componente log_filter_dragnet

* Finalidade: Implementa a filtragem com base nas regras definidas pelo ajuste da variável de sistema `dragnet.log_error_filter_rules`. Veja a Seção 7.4.2.6, “Filtragem do Log de Erros Baseada em Regras (log_filter_dragnet”)”).

* URN: `file://component_log_filter_dragnet`
* Permitidos múltiplos usos: Não.

#### Componentes de Log de Erros de Recarga

Os componentes de log de erros de recarga são escritores que implementam a saída do log de erros. Se nenhum componente de recarga estiver habilitado, nenhuma saída de log ocorre.

Algumas descrições de componentes de recarga referem-se ao destino padrão do log de erros. Este é o console ou um arquivo e é indicado pelo valor da variável de sistema `log_error`, determinada conforme descrito na Seção 7.4.2.2, “Configuração do Destino Padrão do Log de Erros”.

##### O componente log_sink_internal

* Finalidade: Implementa o formato tradicional de saída de mensagens de log de erros.

* URN: Este componente é embutido e não precisa ser carregado.
* Permitidos múltiplos usos: Não.
* Destino de saída: Escreve no destino de log de erros padrão.

* Suporte do Schema de Desempenho: Escreve na tabela `error_log`. Fornece um analisador para ler arquivos de log de erros criados por instâncias de servidor anteriores.

##### O componente log_sink_json

* Finalidade: Implementa o registro de logs de erros no formato JSON. Veja a Seção 7.4.2.7, “Registro de Erros no Formato JSON”.

* URN: `file://component_log_sink_json`
* Permitidos múltiplos usos: Sim.
* Destino de saída: Este recarga determina seu destino de saída com base no destino padrão do log de erros, que é dado pela variável de sistema `log_error`:

  + Se `log_error` nomeia um arquivo, o recarga baseia a nomenclatura do arquivo de saída nesse nome de arquivo, mais um sufixo numerado `.NN.json`, com *`NN`* começando em

Por exemplo, se `log_error` for `file_name`, instâncias consecutivas de `log_sink_json` nomeadas no valor `log_error_services` escreverão em `file_name.00.json`, `file_name.01.json` e assim por diante.

+ Se `log_error` for `stderr`, o canal de saída escreverá na consola. Se `log_sink_json` for nomeado várias vezes no valor `log_error_services`, todos escreverão na consola, o que provavelmente não é útil.

* Suporte do Schema de Desempenho: Escreve na tabela `error_log`. Fornece um analisador para ler ficheiros de registo de erros criados por instâncias de servidor anteriores.

##### O componente log_sink_syseventlog

* Propósito: Implementa a registação de erros no log de sistema. Este é o Log de Eventos no Windows e `syslog` nos sistemas Unix e Unix-like. Consulte a Seção 7.4.2.8, “Registação de Erros no Log de Sistema”.

* URN: `file://component_log_sink_syseventlog`

* Permitidos múltiplos usos: Não.
* Destino de saída: Escreve no log de sistema. Não utiliza o destino de log de erro padrão.

* Suporte do Schema de Desempenho: Não escreve na tabela `error_log`. Não fornece um analisador para ler ficheiros de registo de erros criados por instâncias de servidor anteriores.

##### O componente log_sink_test

* Propósito: Destinado para uso interno na escrita de casos de teste, não para uso em produção.

* URN: `file://component_log_sink_test`

Propriedades do canal de saída, como se são permitidos múltiplos usos e o destino de saída, não são especificadas para `log_sink_test` porque, como mencionado, é para uso interno. Como tal, o seu comportamento pode ser alterado a qualquer momento.