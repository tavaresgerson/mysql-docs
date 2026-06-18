### 7.5.3 Componentes do Log de Erros

Esta seção descreve as características dos componentes do log de erros individuais. Para obter informações gerais sobre a configuração do registro de erros, consulte a Seção 7.4.2, “O Log de Erros”.

Um componente de registro pode ser um filtro ou um canal de descarga:

- Um filtro processa eventos de log, para adicionar, remover ou modificar campos de evento ou para excluir eventos inteiramente. Os eventos resultantes são passados para o próximo componente de log na lista de componentes habilitados.

- Um sink é um destino (escritor) de eventos de log. Tipicamente, um sink processa eventos de log em mensagens de log com um formato específico e escreve essas mensagens em sua saída associada, como um arquivo ou o log do sistema. Um sink também pode escrever na tabela do Schema de Desempenho `error_log`; veja a Seção 29.12.21.2, “A tabela error\_log”. Os eventos passam inalterados para o próximo componente de log na lista de componentes habilitados (ou seja, embora um sink formate os eventos para produzir mensagens de saída, ele não modifica os eventos conforme eles passam internamente para o próximo componente).

O valor da variável de sistema `log_error_services` lista os componentes de log habilitados. Os componentes não mencionados na lista estão desabilitados. A partir do MySQL 8.0.30, `log_error_services` também carrega implicitamente os componentes de log de erro, se ainda não estiverem carregados. Para mais informações, consulte a Seção 7.4.2.1, “Configuração do Log de Erro”.

As seções a seguir descrevem os componentes individuais do log, agrupados por tipo de componente:

- Componentes do Log de Erros do Filtro
- Componentes do Log de Erros do Lavabo

As descrições dos componentes incluem esses tipos de informações:

- O nome do componente e o propósito pretendido.

- Se o componente é construído internamente ou precisa ser carregado. Para um componente carregável, a descrição especifica o URN a ser usado se o componente for carregado ou descarregado explicitamente com as instruções `INSTALL COMPONENT` e `UNINSTALL COMPONENT`. Para carregar componentes de log de erro implicitamente, é necessário apenas o nome do componente. Para mais informações, consulte a Seção 7.4.2.1, “Configuração do Log de Erro”.

- Se o componente pode ser listado várias vezes no valor `log_error_services`.

- Para um componente de pia, o destino para o qual o componente escreve a saída.

- Para um componente de pia, se ele suporta uma interface para a tabela do Schema de Desempenho `error_log`.

#### Componentes do Log de Erros do Filtro

Os componentes de filtro do log de erro implementam o filtro de eventos do log de erro. Se nenhum componente de filtro estiver habilitado, não haverá filtragem.

Qualquer componente de filtro habilitado afeta os eventos de log apenas para componentes listados posteriormente no valor `log_error_services`. Em particular, para qualquer componente de destino de log listado em `log_error_services` antes de qualquer componente de filtro, não ocorre filtragem de eventos de log.

##### O componente log\_filter\_internal

- Objetivo: Implementa a filtragem com base na prioridade do evento de log e no código de erro, em combinação com as variáveis de sistema `log_error_verbosity` e `log_error_suppression_list`. Consulte a Seção 7.4.2.5, “Filtragem de Log de Erros Baseada em Prioridade (log\_filter\_internal)”.

- URN: Este componente é integrado e não precisa ser carregado.

- Permitidos múltiplos usos:

Se `log_filter_internal` estiver desativado, `log_error_verbosity` e `log_error_suppression_list` não terão efeito.

##### O componente log\_filter\_dragnet

- Objetivo: Implementa a filtragem com base nas regras definidas pela variável de sistema `dragnet.log_error_filter_rules`. Consulte a Seção 7.4.2.6, “Filtragem do Log de Erros Baseada em Regras (log\_filter\_dragnet)”.

- URN: `file://component_log_filter_dragnet`

- Permitidos múltiplos usos:

#### Componentes do Log de Erros do Lavabo

Os componentes de registro de erros são escritores que implementam a saída do registro de erros. Se nenhum componente de sink estiver habilitado, nenhuma saída de log ocorrerá.

Algumas descrições de componentes de sink referem-se ao destino padrão do log de erro. Esse é o console ou um arquivo e é indicado pelo valor da variável de sistema `log_error`, determinada conforme descrito na Seção 7.4.2.2, “Configuração do Destino Padrão do Log de Erro”.

##### O componente log\_sink\_internal

- Objetivo: Implementa o formato tradicional de saída de mensagens do log de erros.

- URN: Este componente é integrado e não precisa ser carregado.

- Permitidos múltiplos usos:

- Destino de saída: Escreve no destino padrão do log de erro.

- Suporte ao esquema de desempenho: Escreve na tabela `error_log`. Fornece um analisador para ler arquivos de log de erro criados por instâncias anteriores do servidor.

##### O componente log\_sink\_json

- Objetivo: Implementa o registro de erros no formato JSON. Consulte a Seção 7.4.2.7, “Registro de Erros no Formato JSON”.

- URN: `file://component_log_sink_json`

- Permitidos múltiplos usos: Sim.

- Destino de saída: Este sink determina seu destino de saída com base no destino padrão do log de erro, que é fornecido pela variável de sistema `log_error`:

  - Se `log_error` nomeia um arquivo, o arquivo de saída do sink é baseado nesse nome de arquivo, mais um sufixo numerado `.NN.json`, com `NN` começando em

    0. Por exemplo, se `log_error` é `file_name`, instâncias consecutivas de `log_sink_json` nomeadas no valor `log_error_services` escrevem para `file_name.00.json`, `file_name.01.json` e assim por diante.

  - Se `log_error` for `stderr`, o sink escreve no console. Se `log_sink_json` for nomeado várias vezes no valor `log_error_services`, todos eles escrevem no console, o que provavelmente não é útil.

- Suporte ao esquema de desempenho: Escreve na tabela `error_log`. Fornece um analisador para ler arquivos de log de erro criados por instâncias anteriores do servidor.

##### O componente log\_sink\_syseventlog

- Objetivo: Implementa o registro de erros no log do sistema. Este é o Log de Eventos no Windows e `syslog` em sistemas Unix e Unix-like. Consulte a Seção 7.4.2.8, “Registro de Erros no Log do Sistema”.

- URN: `file://component_log_sink_syseventlog`

- Permitidos múltiplos usos:

- Destino de saída: Escreve no log do sistema. Não usa o destino padrão do log de erro.

- Suporte ao esquema de desempenho: Não escreve na tabela `error_log`. Não fornece um analisador para ler arquivos de log de erro criados por instâncias anteriores do servidor.

##### O componente log\_sink\_test

- Propósito: Destinado ao uso interno na escrita de casos de teste, não para uso em produção.

- URN: `file://component_log_sink_test`

As propriedades do `log_sink_test`, como se múltiplos usos são permitidos e o destino da saída, não são especificados, porque, como mencionado, é para uso interno. Como tal, seu comportamento pode ser alterado a qualquer momento.
