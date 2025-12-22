### 7.5.3 Componentes do registo de erros

Esta secção descreve as características dos componentes individuais do registo de erros.

Um componente de registo pode ser um filtro ou um sumidouro:

- Um filtro processa eventos de log, para adicionar, remover ou modificar campos de eventos, ou para excluir eventos inteiramente. Os eventos resultantes passam para o próximo componente de log na lista de componentes habilitados.
- Um sink é um destino (escritor) para eventos de log. Tipicamente, um sink processa eventos de log em mensagens de log que têm um formato particular e escreve essas mensagens em sua saída associada, como um arquivo ou o log do sistema. Um sink também pode escrever para a tabela de Performance Schema `error_log`; veja Seção 29.12.22.2, The error\_log Table. Os eventos passam não modificados para o próximo log do componente na lista de componentes habilitados (ou seja, embora um sink formate eventos para produzir mensagens de saída, ele não modifica eventos à medida que passam internamente para o próximo componente).

A variável de sistema `log_error_services` lista os componentes de log ativados. Componentes não nomeados na lista são desativados. `log_error_services` também carrega implícitamente os componentes de log de erro se eles ainda não estiverem carregados. Para mais informações, consulte a Seção 7.4.2.1, Error Log Configuration.

As secções seguintes descrevem os componentes individuais do registo, agrupados por tipo de componente:

- Componentes do Registro de Erros de Filtro
- Componentes do Registro de Erros de Sincronização

As descrições dos componentes incluem os seguintes tipos de informações:

- Nome do componente e finalidade prevista.
- Se o componente é incorporado ou deve ser carregado. Para um componente carregável, a descrição especifica o URN a ser usado se explicitamente carregando ou descarregando o componente com as instruções `INSTALL COMPONENT` e `UNINSTALL COMPONENT`. Implicitamente carregando componentes de log de erro requer apenas o nome do componente. Para mais informações, consulte a Seção 7.4.2.1, Error Log Configuration.
- Se o componente pode ser listado várias vezes no valor `log_error_services`.
- No caso de um componente de lavatório, o destino para o qual o componente escreve a saída.
- Para um componente de lavatório, se ele suporta uma interface para a tabela de esquema de desempenho `error_log`.

#### Componentes do Registro de Erros de Filtro

Os componentes de filtro de registro de erros implementam a filtragem de eventos de registro de erros. Se nenhum componente de filtro estiver habilitado, nenhuma filtragem ocorre.

Qualquer componente de filtro habilitado afeta os eventos de log apenas para os componentes listados mais tarde no valor `log_error_services`.

##### O componente log\_filter\_internal

- Propósito: Implementa filtragem com base na prioridade do evento de registro e no código de erro, em combinação com as variáveis do sistema `log_error_verbosity` e `log_error_suppression_list`.
- URN: Este componente é incorporado e não necessita de ser carregado.
- Utilizações múltiplas permitidas:

Se `log_filter_internal` estiver desativado, `log_error_verbosity` e `log_error_suppression_list` não terão efeito.

##### O componente log\_filter\_dragnet

- Propósito: Implementa a filtragem com base nas regras definidas pela configuração da variável do sistema `dragnet.log_error_filter_rules`.
- \[`file://component_log_filter_dragnet`]
- Utilizações múltiplas permitidas:

#### Componentes do Registro de Erros de Sincronização

Componentes de sink de log de erro são escritores que implementam a saída de log de erro. Se nenhum componente de sink estiver habilitado, nenhuma saída de log ocorre.

Algumas descrições de componentes do sink referem-se ao destino padrão do log de erros. Este é o console ou um arquivo e é indicado pelo valor da variável do sistema `log_error`, determinada conforme descrito na Seção 7.4.2.2, Default Error Log Destination Configuration.

##### Componente log\_sink\_internal

- Propósito: Implementa o formato tradicional de saída de mensagens de registo de erros.
- URN: Este componente é incorporado e não necessita de ser carregado.
- Utilizações múltiplas permitidas:
- Destino de saída: Escreve para o destino padrão do registo de erros.
- Suporte de esquema de desempenho: Escreve para a tabela `error_log`. Fornece um analisador para ler arquivos de registro de erros criados por instâncias de servidor anteriores.

##### O componente log\_sink\_json

- Objetivo: Implementa o registo de erros no formato JSON. Ver secção 7.4.2.7, "Registo de erros no formato JSON".
- \[`file://component_log_sink_json`]
- Utilizações múltiplas permitidas: Sim.
- Destino de saída: Este sumidouro determina seu destino de saída com base no destino de registro de erro padrão, que é dado pela variável de sistema `log_error`:

  - Se `log_error` nomeia um arquivo, o sink baseia a nomeação do arquivo de saída nesse nome de arquivo, mais um sufixo `.NN.json` numerado, com `NN` começando em 00. Por exemplo, se `log_error` é `file_name`, sucessivas instâncias de `log_sink_json` nomeadas no valor `log_error_services` escrevem para `file_name.00.json`, `file_name.01.json`, e assim por diante.
  - Se `log_error` é `stderr`, o sink escreve para o console. Se `log_sink_json` é nomeado várias vezes no valor `log_error_services`, todos eles escrevem para o console, o que provavelmente não é útil.
- Suporte de esquema de desempenho: Escreve para a tabela `error_log`. Fornece um analisador para ler arquivos de registro de erros criados por instâncias de servidor anteriores.

##### O componente log\_sink\_syseventlog

- Propósito: Implementa o registo de erros no registo de sistema. Este é o Registo de Eventos no Windows, e `syslog` em Unix e sistemas semelhantes ao Unix. Ver Seção 7.4.2.8, Registo de erros no registo de sistema.
- \[`file://component_log_sink_syseventlog`]
- Utilizações múltiplas permitidas:
- Destino de saída: Escreve para o log do sistema. Não usa o destino de log de erro padrão.
- Suporte de esquema de desempenho: Não escreve para a tabela `error_log`. Não fornece um analisador para ler arquivos de registro de erros criados por instâncias de servidor anteriores.

##### O componente log\_sink\_test

- Finalidade: destinado a utilização interna em casos de ensaio por escrito, não para utilização na produção.
- \[`file://component_log_sink_test`]

As propriedades do sink, como se os usos múltiplos são permitidos e o destino de saída não são especificados para o `log_sink_test` porque, como mencionado, é para uso interno. Como tal, seu comportamento está sujeito a mudanças a qualquer momento.
