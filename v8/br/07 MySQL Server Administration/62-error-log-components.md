### 7.5.3 Componentes do Log de Erros

Esta seção descreve as características dos componentes individuais do log de erros. Para informações gerais sobre a configuração do registro de erros, consulte a Seção 7.4.2, “O Log de Erros”.

Um componente de log pode ser um filtro ou um destino (escritor):

* Um filtro processa eventos de log, para adicionar, remover ou modificar campos de evento, ou para excluir eventos completamente. Os eventos resultantes são passados para o próximo componente de log na lista de componentes habilitados.
* Um destino é um destino (escritor) para eventos de log. Tipicamente, um destino processa eventos de log em mensagens de log que têm um formato específico e escreve essas mensagens para sua saída associada, como um arquivo ou o log do sistema. Um destino também pode escrever na tabela do Schema de Desempenho `error_log`; consulte a Seção 29.12.22.2, “A Tabela `error_log’”. Os eventos passam inalterados para o próximo componente de log na lista de componentes habilitados (ou seja, embora um destino formate os eventos para produzir mensagens de saída, ele não modifica os eventos conforme eles passam internamente para o próximo componente).

A variável de sistema `log_error_services` lista os componentes de log habilitados. Componentes não mencionados na lista são desabilitados. `log_error_services` também carrega implicitamente os componentes de log de erros se eles ainda não estiverem carregados. Para mais informações, consulte a Seção 7.4.2.1, “Configuração do Log de Erros”.

As seções a seguir descrevem componentes de log individuais, agrupados por tipo de componente:

* Componentes de Filtro do Log de Erros
* Componentes de Destino do Log de Erros

* O nome do componente e seu propósito.
* Se o componente é embutido ou precisa ser carregado. Para um componente carregável, a descrição especifica o URN a ser usado se o componente for carregado ou descarregado explicitamente com as instruções `INSTALAR COMPONENTE` e `DESINSTALAR COMPONENTE`. Para componentes de log de erro carregados implicitamente, é necessário apenas o nome do componente. Para mais informações, consulte a Seção 7.4.2.1, “Configuração do Log de Erro”.
* Se o componente pode ser listado várias vezes no valor `log_error_services`.
* Para um componente de destino, o destino para o qual o componente escreve a saída.
* Para um componente de destino, se ele suporta uma interface para a tabela do Schema de Desempenho `error_log`.

#### Filtrar Componentes de Log de Erro

Componentes de filtro de log de erro implementam o filtro de eventos do log de erro. Se nenhum componente de filtro estiver habilitado, nenhum filtro ocorrerá.

Qualquer componente de filtro habilitado afeta os eventos de log apenas para componentes listados posteriormente no valor `log_error_services`. Em particular, para qualquer componente de sink de log listado em `log_error_services` anteriormente a qualquer componente de filtro, nenhum filtro de evento de log ocorrerá.

##### O Componente `log_filter_internal`

* Propósito: Implementa o filtro com base na prioridade do evento de log e no código de erro, em combinação com as variáveis de sistema `log_error_verbosity` e `log_error_suppression_list`. Consulte a Seção 7.4.2.5, “Filtragem de Log de Erro Baseada em Prioridade (`log_filter_internal`)”).
* URN: Este componente é embutido e não precisa ser carregado.
* Permitidos múltiplos usos: Não.

Se `log_filter_internal` estiver desabilitado, `log_error_verbosity` e `log_error_suppression_list` não terão efeito.

##### O Componente `log_filter_dragnet`

* Propósito: Implementa o filtro com base nas regras definidas pelo conjunto de variáveis de sistema `dragnet.log_error_filter_rules`. Consulte a Seção 7.4.2.6, “Filtragem de Log de Erro Baseada em Regras (`log_filter_dragnet`)”).
* URN: `file://component_log_filter_dragnet`
* Permitidos múltiplos usos: Não.

#### Componentes de Sink de Log de Erro

Os componentes de destino do log de erro são os escritores que implementam a saída do log de erro. Se nenhum componente de destino de log de erro estiver habilitado, nenhuma saída de log ocorrerá.

Algumas descrições dos componentes de destino de log de erro referem-se ao destino padrão do log de erro. Este é o console ou um arquivo e é indicado pelo valor da variável de sistema `log_error`, determinada conforme descrito na Seção 7.4.2.2, “Configuração do Destino Padrão do Log de Erro”.

##### O Componente `log_sink_internal`

* Propósito: Implementa o formato de saída de mensagem de log de erro tradicional.
* URN: Este componente é embutido e não precisa ser carregado.
* Permissão para múltiplos usos: Não.
* Destino de saída: Escreve no destino padrão de log de erro.
* Suporte do Schema de Desempenho: Escreve na tabela `error_log`. Fornece um analisador para ler arquivos de log de erro criados por instâncias anteriores do servidor.

##### O Componente `log_sink_json`

* Propósito: Implementa o registro de logs de erro no formato JSON. Veja a Seção 7.4.2.7, “Registro de Erros no Formato JSON”.
* URN: `file://component_log_sink_json`
* Permissão para múltiplos usos: Sim.
* Destino de saída: Este sink determina seu destino de saída com base no destino padrão de log de erro, que é dado pela variável de sistema `log_error`:

  + Se `log_error` nomeia um arquivo, o sink baseia o nome do arquivo de saída nesse nome de arquivo, mais um sufixo numerado `.NN.json`, com *`NN`* começando em
    00. Por exemplo, se `log_error` é *`file_name`*, instâncias sucessivas de `log_sink_json` nomeadas no valor `log_error_services` escrevem em `file_name.00.json`, `file_name.01.json`, e assim por diante.
  + Se `log_error` é `stderr`, o sink escreve na console. Se `log_sink_json` for nomeado várias vezes no valor `log_error_services`, todos eles escrevem na console, o que provavelmente não é útil.
* Suporte do Schema de Desempenho: Escreve na tabela `error_log`. Fornece um analisador para ler arquivos de log de erro criados por instâncias anteriores do servidor.

##### O Componente `log_sink_syseventlog`

* Objetivo: Implementa o registro de erros no log do sistema. Este é o Log de Eventos no Windows e o `syslog` em sistemas Unix e similares. Consulte a Seção 7.4.2.8, “Registro de Erros no Log do Sistema”.
* URN: `file://component_log_sink_syseventlog`
* Permissão para múltiplos usos: Não.
* Destino de saída: Escreve no log do sistema. Não usa o destino padrão do log de erros.
* Suporte ao Schema de Desempenho: Não escreve na tabela `error_log`. Não fornece um analisador para ler arquivos de log de erros criados por instâncias anteriores do servidor.

##### O Componente `log_sink_test`

* Objetivo: Destinado para uso interno na escrita de casos de teste, não para uso em produção.
* URN: `file://component_log_sink_test`

Propriedades do sink, como se múltiplos usos são permitidos e o destino de saída, não são especificadas para `log_sink_test` porque, como mencionado, é para uso interno. Como tal, seu comportamento está sujeito a alterações a qualquer momento.