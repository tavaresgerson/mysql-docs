### 7.9.3 A ferramenta PH\_CODE

O servidor MySQL é um aplicativo multithread que usa inúmeros bloqueios internos e primitivos relacionados a bloqueios, como mutexes, rwlocks (incluindo prlocks e sxlocks), condições e arquivos. Dentro do servidor, o conjunto de objetos relacionados a bloqueios muda com a implementação de novos recursos e refatoração de código para melhorias de desempenho. Como em qualquer aplicativo multithread que usa primitivos de bloqueio, há sempre o risco de encontrar um impasse durante a execução quando vários bloqueios são mantidos ao mesmo tempo. Para MySQL, o efeito de um impasse é catastrófico, causando uma perda completa de serviço.

Para permitir a detecção de bloqueios de aquisição de bloqueio e a aplicação de que a execução de tempo de execução está livre deles, o MySQL suporta ferramentas de `LOCK_ORDER` . Isso permite que um gráfico de dependência de ordem de bloqueio seja definido como parte do design do servidor e a verificação de tempo de execução do servidor para garantir que a aquisição de bloqueio seja acíclica e que os caminhos de execução estejam em conformidade com o gráfico.

Esta seção fornece informações sobre o uso da ferramenta `LOCK_ORDER`, mas apenas em um nível básico. Para detalhes completos, consulte a seção de ordem de bloqueio da documentação do MySQL Server Doxygen, disponível em \[<https://dev.mysql.com/doc/index-other.html>] (<https://dev.mysql.com/doc/index-other.html>).

A ferramenta `LOCK_ORDER` destina-se à depuração do servidor, não para uso de produção.

Para usar a ferramenta `LOCK_ORDER`, siga este procedimento:

1. Construa o MySQL a partir do código-fonte, configurando-o com a opção `-DWITH_LOCK_ORDER=ON` `CMake` para que a compilação inclua ferramentas `LOCK_ORDER`.

   ::: info Note

   Com a opção `WITH_LOCK_ORDER` ativada, as compilações do MySQL requerem o programa `flex`.

   :::

2. Para executar o servidor com a ferramenta `LOCK_ORDER` ativada, habilite a variável do sistema `lock_order` na inicialização do servidor. Várias outras variáveis do sistema para a configuração `LOCK_ORDER` também estão disponíveis.

3. Para a operação do conjunto de testes do MySQL, **mysql-test-run.pl** tem uma opção `--lock-order` que controla se deve ativar a ferramenta `LOCK_ORDER` durante a execução do caso de teste.

As variáveis de sistema descritas a seguir configuram a operação da ferramenta `LOCK_ORDER`, assumindo que o MySQL foi construído para incluir a ferramenta `LOCK_ORDER`. A variável primária é `lock_order`, que indica se deve ativar a ferramenta `LOCK_ORDER` no tempo de execução:

- Se `lock_order` for desativado (o padrão), nenhuma outra variável do sistema `LOCK_ORDER` terá qualquer efeito.
- Se `lock_order` estiver ativado, as outras variáveis do sistema configuram quais recursos do `LOCK_ORDER` devem ser ativados.

::: info Note

Em geral, pretende-se que a ferramenta `LOCK_ORDER` seja configurada executando **mysql-test-run.pl** com a opção `--lock-order`, e para **mysql-test-run.pl** definir as variáveis do sistema `LOCK_ORDER` para valores apropriados.

:::

Todas as variáveis do sistema `LOCK_ORDER` devem ser definidas na inicialização do servidor. No tempo de execução, seus valores são visíveis, mas não podem ser alterados.

Algumas variáveis de sistema existem em pares, como `lock_order_debug_loop` e `lock_order_trace_loop`.

- Se a variável `_debug_` estiver ativada, uma afirmação de depuração é levantada.
- Se a variável `_trace_` estiver ativada, um erro será impresso nos logs.

**Quadro 7.8 Resumo das variáveis do sistema LOCK\_ORDER**

<table><col style="width: 40%"/><col style="width: 20%"/><col align="center" style="width: 20%"/><thead><tr><th scope="col">Nome da variável</th> <th scope="col">Tipo de variável</th> <th scope="col">Ámbito de aplicação variável</th> </tr></thead><tbody><tr><th>ordem de bloqueio</th> <td>Número booleano</td> <td>Globalmente</td> </tr><tr><th>bloqueio_ordem_debug_loop</th> <td>Número booleano</td> <td>Globalmente</td> </tr><tr><th>lock_order_debug_missing_arc</th> <td>Número booleano</td> <td>Globalmente</td> </tr><tr><th>chave de bloqueio_ordem_debug_falta</th> <td>Número booleano</td> <td>Globalmente</td> </tr><tr><th>lock_order_debug_missing_unlock</th> <td>Número booleano</td> <td>Globalmente</td> </tr><tr><th>dependências lock_order</th> <td>Nome do ficheiro</td> <td>Globalmente</td> </tr><tr><th>lock_order_extra_dependências</th> <td>Nome do ficheiro</td> <td>Globalmente</td> </tr><tr><th>Lock_order_output_directory</th> <td>Nome do diretório</td> <td>Globalmente</td> </tr><tr><th>bloqueio_ordem_impressão_txt</th> <td>Número booleano</td> <td>Globalmente</td> </tr><tr><th>bloquear_ordenar_ rastrear_laço</th> <td>Número booleano</td> <td>Globalmente</td> </tr><tr><th>"Lock_order_trace_missing_arc" (bloqueio_ordem_trace_arco em falta)</th> <td>Número booleano</td> <td>Globalmente</td> </tr><tr><th>Chave ausente</th> <td>Número booleano</td> <td>Globalmente</td> </tr><tr><th>bloquear_ordenar_traçar_falhar_desbloquear</th> <td>Número booleano</td> <td>Globalmente</td> </tr></tbody></table>

- `lock_order`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--lock-order[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>lock_order</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Se a ferramenta `LOCK_ORDER` deve ser ativada no tempo de execução. Se o `lock_order` estiver desativado (o padrão), nenhuma outra variável do sistema `LOCK_ORDER` terá qualquer efeito. Se o `lock_order` estiver ativado, as outras variáveis do sistema configuram quais recursos do `LOCK_ORDER` devem ser ativados.

Se `lock_order` estiver habilitado, um erro será levantado se o servidor encontrar uma sequência de aquisição de bloqueio que não seja declarada no gráfico de ordem de bloqueio.

- `lock_order_debug_loop`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--lock-order-debug-loop[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>lock_order_debug_loop</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Se a ferramenta `LOCK_ORDER` causa uma falha de afirmação de depuração quando encontra uma dependência sinalizada como um loop no gráfico de ordem de bloqueio.

- `lock_order_debug_missing_arc`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--lock-order-debug-missing-arc[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>lock_order_debug_missing_arc</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Se a ferramenta LOCK\_ORDER causa uma falha de afirmação de depuração quando encontra uma dependência que não é declarada no gráfico de ordem de bloqueio.

- `lock_order_debug_missing_key`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--lock-order-debug-missing-key[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>lock_order_debug_missing_key</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Se a ferramenta `LOCK_ORDER` causa uma falha de afirmação de depuração quando encontra um objeto que não está devidamente instrumentado com o Esquema de Desempenho.

- `lock_order_debug_missing_unlock`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--lock-order-debug-missing-unlock[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>lock_order_debug_missing_unlock</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Se a ferramenta `LOCK_ORDER` causa uma falha de afirmação de depuração quando encontra um bloqueio que é destruído enquanto ainda é mantido.

- `lock_order_dependencies`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--lock-order-dependencies=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>lock_order_dependencies</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>empty string</code>]]</td> </tr></tbody></table>

O caminho para o arquivo `lock_order_dependencies.txt` que define o gráfico de dependência de ordem de bloqueio do servidor.

É permitido não especificar nenhuma dependência. Um gráfico de dependência vazio é usado neste caso.

- `lock_order_extra_dependencies`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--lock-order-extra-dependencies=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>lock_order_extra_dependencies</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>empty string</code>]]</td> </tr></tbody></table>

O caminho para um arquivo contendo dependências adicionais para o gráfico de dependência de ordem de bloqueio. Isso é útil para alterar o gráfico de dependência do servidor primário, definido no arquivo `lock_order_dependencies.txt`, com dependências adicionais descrevendo o comportamento de código de terceiros. (A alternativa é modificar o próprio `lock_order_dependencies.txt`, o que não é recomendado.)

Se esta variável não estiver definida, não será utilizado nenhum ficheiro secundário.

- `lock_order_output_directory`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--lock-order-output-directory=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>lock_order_output_directory</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Nome do diretório</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>empty string</code>]]</td> </tr></tbody></table>

O diretório onde a ferramenta `LOCK_ORDER` escreve seus logs. Se esta variável não for definida, o padrão é o diretório atual.

- `lock_order_print_txt`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--lock-order-print-txt[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>lock_order_print_txt</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Se a ferramenta `LOCK_ORDER` executa uma análise gráfica de ordem de bloqueio e imprime um relatório textual. O relatório inclui quaisquer ciclos de aquisição de bloqueio detectados.

- `lock_order_trace_loop`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--lock-order-trace-loop[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>lock_order_trace_loop</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Se a ferramenta `LOCK_ORDER` imprime um traço no arquivo de log quando encontra uma dependência sinalizada como um loop no gráfico de ordem de bloqueio.

- `lock_order_trace_missing_arc`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--lock-order-trace-missing-arc[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>lock_order_trace_missing_arc</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>

Se a ferramenta `LOCK_ORDER` imprime um traço no arquivo de log quando encontra uma dependência que não é declarada no gráfico de ordem de bloqueio.

- `lock_order_trace_missing_key`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--lock-order-trace-missing-key[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>lock_order_trace_missing_key</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Se a ferramenta `LOCK_ORDER` imprime um traço no arquivo de log quando encontra um objeto que não está devidamente instrumentado com o Esquema de Desempenho.

- `lock_order_trace_missing_unlock`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--lock-order-trace-missing-unlock[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>lock_order_trace_missing_unlock</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>

Se a ferramenta `LOCK_ORDER` imprime um traço no arquivo de log quando encontra um bloqueio que é destruído enquanto ainda está em uso.
