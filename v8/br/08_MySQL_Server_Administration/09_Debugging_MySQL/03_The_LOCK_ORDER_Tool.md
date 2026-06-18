### 7.9.3 A Ferramenta LOCK\_ORDER

O servidor MySQL é uma aplicação multithread que utiliza inúmeros primitivos internos de bloqueio e relacionados a bloqueios, como mutexes, rwlocks (incluindo prlocks e sxlocks), condições e arquivos. Dentro do servidor, o conjunto de objetos relacionados a bloqueios muda com a implementação de novos recursos e refatoração de código para melhorias de desempenho. Como em qualquer aplicação multithread que utiliza primitivos de bloqueio, há sempre o risco de encontrar um impasse durante a execução quando múltiplos bloqueios são mantidos simultaneamente. Para o MySQL, o efeito de um impasse é catastrófico, causando uma perda completa do serviço.

A partir do MySQL 8.0.17, para habilitar a detecção de deadlocks de aquisição de bloqueio e a garantia de que a execução em tempo real esteja livre deles, o MySQL suporta a ferramenta `LOCK_ORDER`. Isso permite definir um gráfico de dependência de ordem de bloqueio como parte do design do servidor e a verificação em tempo real do servidor para garantir que a aquisição de bloqueio seja acíclica e que os caminhos de execução estejam em conformidade com o gráfico.

Esta seção fornece informações sobre o uso da ferramenta `LOCK_ORDER`, mas apenas em um nível básico. Para detalhes completos, consulte a seção Ordem de bloqueio da documentação do MySQL Server Doxygen, disponível em <https://dev.mysql.com/doc/index-other.html>.

A ferramenta `LOCK_ORDER` é destinada ao depuração do servidor, e não para uso em produção.

Para usar a ferramenta `LOCK_ORDER`, siga este procedimento:

1. Construa o MySQL a partir da fonte, configurando-o com a opção `-DWITH_LOCK_ORDER=ON` **CMake** para que a compilação inclua as ferramentas `LOCK_ORDER`.

   Nota

   Com a opção `WITH_LOCK_ORDER` habilitada, as compilações do MySQL exigem o programa **flex**.

2. Para executar o servidor com a ferramenta `LOCK_ORDER` habilitada, habilite a variável de sistema `lock_order` no início do servidor. Várias outras variáveis de sistema para a configuração do `LOCK_ORDER` também estão disponíveis.

3. Para o funcionamento da suíte de testes do MySQL, o arquivo **mysql-test-run.pl** possui a opção `--lock-order` que controla se a ferramenta `LOCK_ORDER` deve ser habilitada durante a execução do caso de teste.

As variáveis de sistema descritas a seguir configuram a operação da ferramenta `LOCK_ORDER`. Supondo que o MySQL tenha sido construído para incluir a ferramenta `LOCK_ORDER`. A variável principal é `lock_order`, que indica se a ferramenta `LOCK_ORDER` deve ser habilitada em tempo de execução:

- Se `lock_order` estiver desativado (o padrão), nenhuma outra variável de sistema `LOCK_ORDER` terá efeito.

- Se `lock_order` estiver habilitado, as outras variáveis do sistema configuram quais recursos do `LOCK_ORDER` devem ser habilitados.

Nota

Em geral, pretende-se que a ferramenta `LOCK_ORDER` seja configurada executando o **mysql-test-run.pl** com a opção `--lock-order` e que o **mysql-test-run.pl** defina as variáveis de sistema `LOCK_ORDER` com os valores apropriados.

Todas as variáveis de sistema `LOCK_ORDER` devem ser definidas na inicialização do servidor. Durante o runtime, seus valores são visíveis, mas não podem ser alterados.

Algumas variáveis de sistema existem em pares, como `lock_order_debug_loop` e `lock_order_trace_loop`. Para esses pares, as variáveis são distinguidas da seguinte forma quando a condição com a qual estão associadas ocorre:

- Se a variável `_debug_` estiver habilitada, uma asserção de depuração será lançada.

- Se a variável `_trace_` estiver habilitada, um erro será impresso nos logs.

**Tabela 7.8 Resumo da variável de sistema LOCK\_ORDER**

<table summary="Referência para as variáveis de sistema LOCK_ORDER."><thead><tr><th scope="col">Nome da variável</th> <th scope="col">Tipo variável</th> <th scope="col">Alcance variável</th> </tr></thead><tbody><tr><th>lock_order</th> <td>Boolean</td> <td>Global</td> </tr><tr><th>lock_order_debug_loop</th> <td>Boolean</td> <td>Global</td> </tr><tr><th>lock_order_debug_missing_arc</th> <td>Boolean</td> <td>Global</td> </tr><tr><th>lock_order_debug_missing_key</th> <td>Boolean</td> <td>Global</td> </tr><tr><th>bloquear_ordem_debug_missing_unlock</th> <td>Boolean</td> <td>Global</td> </tr><tr><th>lock_order_dependencies</th> <td>Nome do arquivo</td> <td>Global</td> </tr><tr><th>lock_order_extra_dependencies</th> <td>Nome do arquivo</td> <td>Global</td> </tr><tr><th>lock_order_output_directory</th> <td>Nome do diretório</td> <td>Global</td> </tr><tr><th>lock_order_print_txt</th> <td>Boolean</td> <td>Global</td> </tr><tr><th>bloquear_percurso_do_pedido</th> <td>Boolean</td> <td>Global</td> </tr><tr><th>bloquear_rastrear_ordem_de_ordem_de_arco_ausente</th> <td>Boolean</td> <td>Global</td> </tr><tr><th>lock_order_trace_missing_key</th> <td>Boolean</td> <td>Global</td> </tr><tr><th>bloquear_rastrear_ordem_falta_desbloquear</th> <td>Boolean</td> <td>Global</td> </tr></tbody></table>

- `lock_order`

  <table summary="Propriedades para lock_order"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--lock-order[={OFF|ON}]</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.17</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>lock_order</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  Se ativar ou não a ferramenta `LOCK_ORDER` em tempo de execução. Se `lock_order` estiver desativado (o padrão), nenhuma outra variável de sistema `LOCK_ORDER` terá efeito. Se `lock_order` estiver ativado, as outras variáveis de sistema configuram quais recursos `LOCK_ORDER` devem ser ativados.

  Se `lock_order` estiver ativado, um erro será exibido se o servidor encontrar uma sequência de aquisição de bloqueio que não estiver declarada no gráfico de ordem de bloqueio.

- `lock_order_debug_loop`

  <table summary="Propriedades para lock_order_debug_loop"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--lock-order-debug-loop[={OFF|ON}]</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.17</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>lock_order_debug_loop</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  Se a ferramenta `LOCK_ORDER` causa uma falha na asserção de depuração quando encontra uma dependência marcada como um loop no gráfico de ordem de bloqueio.

- `lock_order_debug_missing_arc`

  <table summary="Propriedades para lock_order_debug_missing_arc"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--lock-order-debug-missing-arc[={OFF|ON}]</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.17</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>lock_order_debug_missing_arc</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  Se a ferramenta `LOCK_ORDER` causa uma falha de asserção de depuração quando encontra uma dependência que não está declarada no gráfico de ordem de bloqueio.

- `lock_order_debug_missing_key`

  <table summary="Propriedades para lock_order_debug_missing_key"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--lock-order-debug-missing-key[={OFF|ON}]</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.17</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>lock_order_debug_missing_key</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  Se a ferramenta `LOCK_ORDER` causa uma falha de asserção de depuração quando encontra um objeto que não está devidamente instrumentado com o Schema de Desempenho.

- `lock_order_debug_missing_unlock`

  <table summary="Propriedades para lock_order_debug_missing_unlock"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--lock-order-debug-missing-unlock[={OFF|ON}]</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.17</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>lock_order_debug_missing_unlock</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  Se a ferramenta `LOCK_ORDER` causa uma falha de asserção de depuração quando encontra um bloqueio que está sendo destruído enquanto ainda está sendo mantido.

- `lock_order_dependencies`

  <table summary="Propriedades para lock_order_dependencies"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--lock-order-dependencies=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.17</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>lock_order_dependencies</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>empty string</code>]]</td> </tr></tbody></table>

  O caminho para o arquivo `lock_order_dependencies.txt` que define o gráfico de dependência da ordem de bloqueio do servidor.

  É permitido não especificar dependências. Nesse caso, é usado um gráfico de dependências vazio.

- `lock_order_extra_dependencies`

  <table summary="Propriedades para lock_order_extra_dependencies"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--lock-order-extra-dependencies=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.17</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>lock_order_extra_dependencies</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>empty string</code>]]</td> </tr></tbody></table>

  O caminho para um arquivo contendo dependências adicionais para o gráfico de dependências de ordem de bloqueio. Isso é útil para alterar o gráfico de dependências do servidor primário, definido no arquivo `lock_order_dependencies.txt`, com dependências adicionais que descrevem o comportamento do código de terceiros. (A alternativa é modificar o próprio `lock_order_dependencies.txt`, o que não é recomendado.)

  Se essa variável não for definida, nenhum arquivo secundário será usado.

- `lock_order_output_directory`

  <table summary="Propriedades para lock_order_output_directory"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--lock-order-output-directory=dir_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.17</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>lock_order_output_directory</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>empty string</code>]]</td> </tr></tbody></table>

  O diretório onde a ferramenta `LOCK_ORDER` escreve seus logs. Se essa variável não for definida, o padrão é o diretório atual.

- `lock_order_print_txt`

  <table summary="Propriedades para lock_order_print_txt"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--lock-order-print-txt[={OFF|ON}]</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.17</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>lock_order_print_txt</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  Se a ferramenta `LOCK_ORDER` realiza uma análise de gráfico de ordem de bloqueio e imprime um relatório textual. O relatório inclui quaisquer ciclos de aquisição de bloqueio detectados.

- `lock_order_trace_loop`

  <table summary="Propriedades para lock_order"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--lock-order[={OFF|ON}]</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.17</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>lock_order</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>0

  Se a ferramenta `LOCK_ORDER` imprime uma traça no arquivo de log quando encontra uma dependência marcada como um ciclo no gráfico de ordem de bloqueio.

- `lock_order_trace_missing_arc`

  <table summary="Propriedades para lock_order"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--lock-order[={OFF|ON}]</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.17</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>lock_order</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>1

  Se a ferramenta `LOCK_ORDER` imprime uma traça no arquivo de log quando encontra uma dependência que não está declarada no gráfico de ordem de bloqueio.

- `lock_order_trace_missing_key`

  <table summary="Propriedades para lock_order"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--lock-order[={OFF|ON}]</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.17</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>lock_order</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>2

  Se a ferramenta `LOCK_ORDER` imprime uma traça no arquivo de log quando encontra um objeto que não está corretamente instrumentado com o Schema de Desempenho.

- `lock_order_trace_missing_unlock`

  <table summary="Propriedades para lock_order"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--lock-order[={OFF|ON}]</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.17</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>lock_order</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>3

  Se a ferramenta `LOCK_ORDER` imprime uma traça no arquivo de log quando encontra um bloqueio que é destruído enquanto ainda está sendo mantido.
