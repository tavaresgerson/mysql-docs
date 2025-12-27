### 7.9.3 A Ferramenta `LOCK_ORDER`

O servidor MySQL é uma aplicação multithread que utiliza inúmeros primitivos internos de bloqueio e relacionados a bloqueios, como mutexes, rwlocks (incluindo prlocks e sxlocks), condições e arquivos. Dentro do servidor, o conjunto de objetos relacionados a bloqueios muda com a implementação de novos recursos e refatoração de código para melhorias de desempenho. Como em qualquer aplicação multithread que utiliza primitivos de bloqueio, há sempre o risco de encontrar um impasse durante a execução quando múltiplos bloqueios são mantidos simultaneamente. Para o MySQL, o efeito de um impasse é catastrófico, causando uma perda completa do serviço.

Para habilitar a detecção de impasses de aquisição de bloqueio e a garantia de que a execução em tempo real esteja livre deles, o MySQL suporta a ferramenta `LOCK_ORDER`. Isso permite definir um gráfico de dependência de ordem de bloqueio como parte do design do servidor e a verificação em tempo real do servidor para garantir que a aquisição de bloqueio seja acíclica e que as trajetórias de execução cumpram o gráfico.

Esta seção fornece informações sobre o uso da ferramenta `LOCK_ORDER`, mas apenas em um nível básico. Para detalhes completos, consulte a seção Ordem de Bloqueio da documentação do MySQL Server Doxygen, disponível em https://dev.mysql.com/doc/index-other.html.

A ferramenta `LOCK_ORDER` é destinada ao depuração do servidor, não para uso em produção.

Para usar a ferramenta `LOCK_ORDER`, siga este procedimento:

1. Construa o MySQL a partir da fonte, configurando-o com a opção `-DWITH_LOCK_ORDER=ON` do `CMake` para que a compilação inclua a ferramenta `LOCK_ORDER`.

   ::: info Nota

   Com a opção  `WITH_LOCK_ORDER` habilitada, a compilação do MySQL requer o programa `flex`.

   :::

2. Para executar o servidor com a ferramenta `LOCK_ORDER` habilitada, habilite a variável de sistema `lock_order` no início do servidor. Várias outras variáveis de sistema para configuração de `LOCK_ORDER` também estão disponíveis.
3. Para o funcionamento da suíte de testes do MySQL, o `mysql-test-run.pl` tem uma opção `--lock-order` que controla se a ferramenta `LOCK_ORDER` deve ser habilitada durante a execução do caso de teste.

As variáveis de sistema descritas a seguir configuram o funcionamento da ferramenta `LOCK_ORDER`, assumindo que o MySQL foi construído para incluir a ferramenta `LOCK_ORDER`. A variável principal é `lock_order`, que indica se a ferramenta `LOCK_ORDER` deve ser habilitada em tempo de execução:

* Se `lock_order` estiver desabilitado (o padrão), nenhuma outra variável de sistema `LOCK_ORDER` terá efeito.
* Se `lock_order` estiver habilitado, as outras variáveis de sistema configuram quais recursos da ferramenta `LOCK_ORDER` devem ser habilitados.

::: info Nota

Em geral, pretende-se que a ferramenta `LOCK_ORDER` seja configurada executando `mysql-test-run.pl` com a opção `--lock-order`, e que o `mysql-test-run.pl` defina as variáveis de sistema `LOCK_ORDER` com os valores apropriados.

:::

Todas as variáveis de sistema `LOCK_ORDER` devem ser definidas no início da inicialização do servidor. Em tempo de execução, seus valores são visíveis, mas não podem ser alterados.

Algumas variáveis de sistema existem em pares, como `lock_order_debug_loop` e `lock_order_trace_loop`. Para tais pares, as variáveis são distinguidas da seguinte forma quando a condição com a qual estão associadas ocorre:

* Se a variável `_debug_` estiver habilitada, uma asserção de depuração é levantada.
* Se a variável `_trace_` estiver habilitada, um erro é impresso nos logs.

**Tabela 7.8 Resumo das Variáveis de Sistema `LOCK_ORDER`**

<table>
   <thead>
      <tr>
         <th>Nome da Variável</th>
         <th>Tipo da Variável</th>
         <th>Âmbito da Variável</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <th><code>lock_order</code></th>
         <td>Booleano</td>
         <td>Global</td>
      </tr>
      <tr>
         <th><code>lock_order_debug_loop</code></th>
         <td>Booleano</td>
         <td>Global</td>
      </tr>
      <tr>
         <th><code>lock_order_debug_missing_arc</code></th>
         <td>Booleano</td>
         <td>Global</td>
      </tr>
      <tr>
         <th><code>lock_order_debug_missing_key</code></th>
         <td>Booleano</td>
         <td>Global</td>
      </tr>
      <tr>
         <th><code>lock_order_debug_missing_unlock</code></th>
         <td>Booleano</td>
         <td>Global</td>
      </tr>
      <tr>
         <th><code>lock_order_dependencies</code></th>
         <td>Nome do arquivo</td>
         <td>Global</td>
      </tr>
      <tr>
         <th><code>lock_order_extra_dependencies</code></th>
         <td>Nome do arquivo</td>
         <td>Global</td>
      </tr>
      <tr>
         <th><code>lock_order_output_directory</code></th>
         <td>Nome de diretório</td>
         <td>Global</td>
      </tr>
      <tr>
         <th><code>lock_order_print_txt</code></th>
         <td>Booleano</td>
         <td>Global</td>
      </tr>
      <tr>
         <th><code>lock_order_trace_loop</code></th>
         <td>Booleano</td>
         <td>Global</td>
      </tr>
      <tr>
         <th><code>lock_order_trace_missing_arc</code></th>
         <td>Booleano</td>
         <td>Global</td>
      </tr>
      <tr>
         <th><code>lock_order_trace_missing_key</code></th>
         <td>Booleano</td>
         <td>Global</td>
      </tr>
      <tr>
         <th><code>lock_order_trace_missing_unlock</code></th>
         <td>Booleano</td>
         <td>Global</td>
      </tr>
   </tbody>
</table>

*  `lock_order`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--lock-order[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>lock_order</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Se habilitar ou desabilitar a ferramenta `LOCK_ORDER` no tempo de execução. Se `lock_order` estiver desativado (o padrão), nenhuma outra variável de sistema `LOCK_ORDER` terá efeito. Se `lock_order` estiver ativado, as outras variáveis de sistema configuram quais recursos do `LOCK_ORDER` serão ativados.

  Se `lock_order` estiver ativado, um erro será exibido se o servidor encontrar uma sequência de aquisição de bloqueio que não foi declarada no gráfico de ordem de bloqueio.
*  `lock_order_debug_loop`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--lock-order-debug-loop[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>lock_order_debug_loop</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Se a ferramenta `LOCK_ORDER` causa uma falha de asserção de depuração quando encontra uma dependência marcada como um loop no gráfico de ordem de bloqueio.
*  `lock_order_debug_missing_arc`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--lock-order-debug-missing-arc[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>lock_order_debug_missing_arc</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Se a ferramenta LOCK_ORDER causar uma falha de asserção de depuração quando encontrar uma dependência que não está declarada no gráfico de ordem de bloqueio.
* `lock_order_debug_missing_key`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--lock-order-debug-missing-key[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>lock_order_debug_missing_key</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Aplicação da dica <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Se a ferramenta `LOCK_ORDER` causar uma falha de asserção de depuração quando encontrar um objeto que não está corretamente instrumentado com o Schema de Desempenho.
* `lock_order_debug_missing_unlock`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--lock-order-debug-missing-unlock[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>lock_order_debug_missing_unlock</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Aplicação da dica <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Se a ferramenta `LOCK_ORDER` causar uma falha de asserção de depuração quando encontrar um bloqueio que é destruído enquanto ainda está sendo mantido.
* `lock_order_dependencies`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--lock-order-dependencies=nome_do_arquivo</code></td> </tr><tr><th>Variável do sistema</th> <td><code>lock_order_dependencies</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Aplicação da dica <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>string vazia</code></td> </tr></tbody></table>

O caminho para o arquivo `lock_order_dependencies.txt`, que define o gráfico de dependências de ordem de bloqueio do servidor.

É permitido não especificar dependências. Um gráfico de dependências vazio é usado nesse caso.
*  `lock_order_extra_dependencies`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--lock-order-extra-dependencies=nome_do_arquivo</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>lock_order_extra_dependencies</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>string vazia</code></td> </tr></tbody></table>

  O caminho para um arquivo contendo dependências adicionais para o gráfico de dependências de ordem de bloqueio. Isso é útil para alterar o gráfico de dependências do servidor primário, definido no arquivo `lock_order_dependencies.txt`, com dependências adicionais que descrevem o comportamento do código de terceiros. (A alternativa é modificar o próprio `lock_order_dependencies.txt`, o que não é aconselhável.)

  Se essa variável não for definida, nenhum arquivo secundário é usado.
*  `lock_order_output_directory`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--lock-order-output-directory=nome_do_diretório</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>lock_order_output_directory</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor Padrão</th> <td><code>string vazia</code></td> </tr></tbody></table>

  O diretório onde a ferramenta `LOCK_ORDER` escreve seus logs. Se essa variável não for definida, o padrão é o diretório atual.
*  `lock_order_print_txt`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--lock-order-print-txt[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>lock_order_print_txt</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Se a ferramenta `LOCK_ORDER` realiza uma análise de gráfico de ordem de bloqueio e imprime um relatório textual. O relatório inclui quaisquer ciclos de aquisição de bloqueio detectados.
*  `lock_order_trace_loop`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--lock-order-trace-loop[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>lock_order_trace_loop</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Se a ferramenta `LOCK_ORDER` imprime uma traça no arquivo de log quando encontra uma dependência marcada como um loop no gráfico de ordem de bloqueio.
*  `lock_order_trace_missing_arc`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--lock-order-trace-missing-arc[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>lock_order_trace_missing_arc</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Se a ferramenta `LOCK_ORDER` imprime uma traça no arquivo de log quando encontra uma dependência que não é declarada no gráfico de ordem de bloqueio.
*  `lock_order_trace_missing_key`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--lock-order-trace-missing-key[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>lock_order_trace_missing_key</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Se a ferramenta `LOCK_ORDER` imprime uma traça no arquivo de log quando encontra um objeto que não está corretamente instrumentado com o Schema de Desempenho.
*  `lock_order_trace_missing_unlock`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--lock-order-trace-missing-unlock[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>lock_order_trace_missing_unlock</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Se a ferramenta `LOCK_ORDER` imprime uma traça no arquivo de log quando encontra um bloqueio que é destruído enquanto ainda está sendo mantido.