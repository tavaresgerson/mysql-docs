### 7.9.3 A Ferramenta LOCK\_ORDER

O servidor MySQL é uma aplicação multithread que utiliza inúmeros primitivos internos de bloqueio e relacionados a bloqueios, como mutexes, rwlocks (incluindo prlocks e sxlocks), condições e arquivos. Dentro do servidor, o conjunto de objetos relacionados a bloqueios muda com a implementação de novos recursos e refatoração de código para melhorias de desempenho. Como em qualquer aplicação multithread que utiliza primitivos de bloqueio, há sempre o risco de encontrar um impasse durante a execução quando múltiplos bloqueios são mantidos simultaneamente. Para o MySQL, o efeito de um impasse é catastrófico, causando uma perda completa do serviço.

Para habilitar a detecção de impasses de aquisição de bloqueio e a garantia de que a execução em tempo real esteja livre deles, o MySQL suporta a ferramenta `LOCK_ORDER`. Isso permite definir um gráfico de dependência de ordem de bloqueio como parte do design do servidor e a verificação em tempo real do servidor para garantir que a aquisição de bloqueio seja acíclica e que as trajetórias de execução cumpram o gráfico.

Esta seção fornece informações sobre o uso da ferramenta `LOCK_ORDER`, mas apenas em um nível básico. Para detalhes completos, consulte a seção Ordem de Bloqueio da documentação do MySQL Server Doxygen, disponível em https://dev.mysql.com/doc/index-other.html.

A ferramenta `LOCK_ORDER` é destinada ao depuração do servidor, não para uso em produção.

Para usar a ferramenta `LOCK_ORDER`, siga este procedimento:

1. Construa o MySQL a partir da fonte, configurando-o com a opção `-DWITH_LOCK_ORDER=ON` do **CMake** para que a construção inclua a ferramenta `LOCK_ORDER`.

Nota

Com a opção `WITH_LOCK_ORDER` habilitada, as construções do MySQL requerem o programa **flex**.

2. Para executar o servidor com a ferramenta `LOCK_ORDER` habilitada, habilite a variável de sistema `lock_order` durante a inicialização do servidor. Várias outras variáveis de sistema para a configuração do `LOCK_ORDER` também estão disponíveis.

3. Para o funcionamento da suíte de testes do MySQL, o **mysql-test-run.pl** tem uma opção `--lock-order` que controla se a ferramenta `LOCK_ORDER` deve ser habilitada durante a execução do caso de teste.

As variáveis de sistema descritas a seguir configuram a operação da ferramenta `LOCK_ORDER`, assumindo que o MySQL foi construído para incluir a ferramenta `LOCK_ORDER`. A variável principal é `lock_order`, que indica se a ferramenta `LOCK_ORDER` deve ser habilitada em tempo de execução:

* Se `lock_order` estiver desabilitado (o padrão), nenhuma outra variável de sistema `LOCK_ORDER` terá efeito.

* Se `lock_order` estiver habilitado, as outras variáveis de sistema configuram quais recursos do `LOCK_ORDER` devem ser habilitados.

Observação

Em geral, pretende-se que a ferramenta `LOCK_ORDER` seja configurada executando o **mysql-test-run.pl** com a opção `--lock-order`, e que o **mysql-test-run.pl** defina as variáveis de sistema `LOCK_ORDER` com os valores apropriados.

Todas as variáveis de sistema `LOCK_ORDER` devem ser definidas durante a inicialização do servidor. Em tempo de execução, seus valores são visíveis, mas não podem ser alterados.

Algumas variáveis de sistema existem em pares, como `lock_order_debug_loop` e `lock_order_trace_loop`. Para tais pares, as variáveis são distinguidas da seguinte forma quando a condição com a qual estão associadas ocorre:

* Se a variável `_debug_` estiver habilitada, uma asserção de depuração é levantada.

* Se a variável `_trace_` estiver habilitada, um erro é impresso nos logs.

**Tabela 7.13 Resumo das Variáveis de Sistema LOCK\_ORDER**

<table frame="box" rules="all" summary="Referência para as variáveis do sistema LOCK_ORDER.">
<col style="width: 40%"/><col style="width: 20%"/><col align="center" style="width: 20%"/>
<thead><tr><th scope="col">Nome da Variável</th> <th scope="col">Tipo da Variável</th> <th scope="col">Alcance da Variável</th> </tr></thead><tbody><tr><th scope="row"><a class="link" href="lock-order-tool.html#sysvar_lock_order">lock_order</a></th> <td>Boolean</td> <td>Global</td> </tr><tr><th scope="row"><a class="link" href="lock-order-tool.html#sysvar_lock_order_debug_loop">lock_order_debug_loop</a></th> <td>Boolean</td> <td>Global</td> </tr><tr><th scope="row"><a class="link" href="lock-order-tool.html#sysvar_lock_order_debug_missing_arc">lock_order_debug_missing_arc</a></th> <td>Boolean</td> <td>Global</td> </tr><tr><th scope="row"><a class="link" href="lock-order-tool.html#sysvar_lock_order_debug_missing_key">lock_order_debug_missing_key</a></th> <td>Boolean</td> <td>Global</td> </tr><tr><th scope="row"><a class="link" href="lock-order-tool.html#sysvar_lock_order_debug_missing_unlock">lock_order_debug_missing_unlock</a></th> <td>Boolean</td> <td>Global</td> </tr><tr><th scope="row"><a class="link" href="lock-order-tool.html#sysvar_lock_order_dependencies">lock_order_dependencies</a></th> <td>Nome do arquivo</td> <td>Global</td> </tr><tr><th scope="row"><a class="link" href="lock-order-tool.html#sysvar_lock_order_extra_dependencies">lock_order_extra_dependencies</a></th> <td>Nome do arquivo</td> <td>Global</td> </tr><tr><th scope="row"><a class="link" href="lock-order-tool.html#sysvar_lock_order_output_directory">lock_order_output_directory</a></th> <td>Nome de diretório</td> <td>Global</td> </tr><tr><th scope="row"><a class="link" href="lock-order-tool.html#sysvar_lock_order_print_txt">lock_order_print_txt</a></th> <td>Boolean</td> <td>Global</td> </tr><tr><th scope="row"><a class="link" href="lock-order-tool.html#sysvar_lock_order_trace_loop">lock_order_trace_loop</a></th> <td>Boolean</td> <td>Global</td> </tr><tr><th scope="row"><a class="link" href="lock-order-tool.html#sysvar_lock_order_trace_missing_arc">lock_order_trace_missing_arc</a></th> <td>Boolean</td> <td>Global</td> </tr><tr><th scope="row"><a class="link" href="lock-order-tool.html#sysvar_lock_order_trace_missing_key">lock_order_trace_missing_key</a></th> <td>Boolean</td> <td>Global</td> </tr><tr><th scope="row"><a class="link" href="lock-order-tool.html#sysvar_lock_order_trace_missing_unlock">lock_order_trace_missing_unlock</a></th> <td>Boolean</td> <td>Global</td> </tr></tbody></table>

* `lock_order`

  <table frame="box" rules="all" summary="Propriedades para `lock_order`"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--lock-order[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="lock-order-tool.html#sysvar_lock_order">lock_order</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hinta de Configuração de Variável"><code class="literal">SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">OFF</code></td> </tr></tbody></table>

  Se habilitar ou desabilitar a ferramenta `LOCK_ORDER` em tempo de execução. Se `lock_order` estiver desativado (o padrão), nenhuma outra variável do sistema `LOCK_ORDER` terá efeito. Se `lock_order` estiver ativado, as outras variáveis do sistema configuram quais recursos do `LOCK_ORDER` serão habilitados.

  Se `lock_order` estiver ativado, um erro será exibido se o servidor encontrar uma sequência de aquisição de bloqueio que não foi declarada no gráfico de ordem de bloqueio.

* `lock_order_debug_loop`

<table frame="box" rules="all" summary="Propriedades para lock_order_debug_loop">
  <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--lock-order-debug-loop[={OFF|ON}]</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="lock-order-tool.html#sysvar_lock_order_debug_loop">lock_order_debug_loop</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hinta de Configuração de Variável"><code class="literal">SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Booleano</td> </tr>
  <tr><th>Valor Padrão</th> <td><code class="literal">OFF</code></td> </tr>
</table>

  Se a ferramenta `LOCK_ORDER` causa uma falha de asserção de depuração quando ela encontra uma dependência que é marcada como um loop no gráfico de ordem de bloqueio.

* `lock_order_debug_missing_arc`

<table frame="box" rules="all" summary="Propriedades para lock_order_debug_missing_arc">
  <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--lock-order-debug-missing-arc[={OFF|ON}]</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="lock-order-tool.html#sysvar_lock_order_debug_missing_arc">lock_order_debug_missing_arc</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hinta de Configuração de Variáveis">SET_VAR</a> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Booleano</td> </tr>
  <tr><th>Valor Padrão</th> <td><code class="literal">OFF</code></td> </tr>
</table>

  Se a ferramenta LOCK\_ORDER causa uma falha de asserção de depuração quando encontra uma dependência que não é declarada no gráfico de ordem de bloqueio.

* `lock_order_debug_missing_key`

<table frame="box" rules="all" summary="Propriedades para lock_order_debug_missing_key">
  <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--lock-order-debug-missing-key[={OFF|ON}]</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="lock-order-tool.html#sysvar_lock_order_debug_missing_key">lock_order_debug_missing_key</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hinta de Configuração de Variáveis"><code class="literal">SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Booleano</td> </tr>
  <tr><th>Valor Padrão</th> <td><code class="literal">OFF</code></td> </tr>
</table>

  Se a ferramenta `LOCK_ORDER` causar uma falha de asserção de depuração quando encontrar um objeto que não está corretamente instrumentado com o Schema de Desempenho.

* `lock_order_debug_missing_unlock`

<table frame="box" rules="all" summary="Propriedades para lock_order_debug_missing_unlock">
  <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--lock-order-debug-missing-unlock[={OFF|ON}]</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="lock-order-tool.html#sysvar_lock-order-debug-missing-unlock">lock-order-debug-missing-unlock</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hinta de Definição de Variável"><code class="literal">SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Booleano</td> </tr>
  <tr><th>Valor Padrão</th> <td><code class="literal">OFF</code></td> </tr>
</table>

  Se a ferramenta `LOCK_ORDER` causa uma falha de asserção de depuração quando encontra um bloqueio que é destruído enquanto ainda está sendo mantido.

* `lock_order_dependencies`

<table frame="box" rules="all" summary="Propriedades para lock_order_dependencies">
  <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--lock-order-dependencies=nome_do_arquivo</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="lock-order-tool.html#sysvar_lock_order_dependencies">lock_order_dependencies</a></code></td> </tr>
  <tr><th>Âmbito</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hinta de Configuração de Variáveis"><code class="literal">SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Nome do arquivo</td> </tr>
  <tr><th>Valor Padrão</th> <td><code class="literal">string vazia</code></td> </tr>
</table>

  O caminho para o arquivo `lock_order_dependencies.txt` que define o gráfico de dependência de ordem de bloqueio do servidor.

  É permitido não especificar dependências. Um gráfico de dependência vazio é usado neste caso.

* `lock_order_extra_dependencies`

<table frame="box" rules="all" summary="Propriedades para lock_order_extra_dependencies">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code class="literal">--lock-order-extra-dependencies=nome_do_arquivo</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code class="literal"><a class="link" href="lock-order-tool.html#sysvar_lock_order_extra_dependencies">lock_order_extra_dependencies</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de definição de variável"><code class="literal">SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code class="literal">string vazia</code></td>
  </tr>
</table>

  O caminho para um arquivo contendo dependências adicionais para o gráfico de dependências de lock-order. Isso é útil para alterar o gráfico de dependências do servidor primário, definido no arquivo `lock_order_dependencies.txt`, com dependências adicionais que descrevem o comportamento do código de terceiros. (A alternativa é modificar o próprio `lock_order_dependencies.txt`, o que não é aconselhável.)

  Se essa variável não for definida, nenhum arquivo secundário é usado.

* `lock_order_output_directory`

<table frame="box" rules="all" summary="Propriedades para lock_order_output_directory">
  <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--lock-order-output-directory=dir_name</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="lock-order-tool.html#sysvar_lock-order-output-directory">lock-order-output-directory</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hinta de Configuração de Variáveis"><code class="literal">SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Nome do diretório</td> </tr>
  <tr><th>Valor Padrão</th> <td><code class="literal">string vazia</code></td> </tr>
</table>

  O diretório onde a ferramenta `LOCK_ORDER` escreve seus logs. Se essa variável não for definida, o valor padrão é o diretório atual.

* `lock_order_print_txt`

<table frame="box" rules="all" summary="Propriedades para lock_order_print_txt">
  <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--lock-order-print-txt[={OFF|ON}]</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="lock-order-tool.html#sysvar_lock_order_print_txt">lock_order_print_txt</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Booleano</td> </tr>
  <tr><th>Valor Padrão</th> <td><code class="literal">OFF</code></td> </tr>
</table>

  Se a ferramenta `LOCK_ORDER` realiza uma análise de gráfico de ordem de bloqueio e imprime um relatório textual. O relatório inclui quaisquer ciclos de aquisição de bloqueio detectados.

* `lock_order_trace_loop`

  <table frame="box" rules="all" summary="Propriedades para lock_order">
    <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--lock-order[={OFF|ON}]</code></td> </tr>
    <tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="lock-order-tool.html#sysvar_lock_order">lock_order</a></code></td> </tr>
    <tr><th>Alcance</th> <td>Global</td> </tr>
    <tr><th>Dinâmico</th> <td>Não</td> </tr>
    <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
    <tr><th>Tipo</th> <td>Booleano</td> </tr>
    <tr><th>Valor Padrão</th> <td><code class="literal">OFF</code></td> </tr>
  </table>0

Se a ferramenta `LOCK_ORDER` imprime uma traça no arquivo de log quando encontra uma dependência que é marcada como um ciclo no gráfico de ordem de bloqueio.

* `lock_order_trace_missing_arc`

  <table frame="box" rules="all" summary="Propriedades para lock_order"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--lock-order[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="lock-order-tool.html#sysvar_lock_order">lock_order</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hinta de Configuração de Variáveis"><code class="literal">SET_VAR</code></a> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">OFF</code></td> </tr></tbody></table>1

  Se a ferramenta `LOCK_ORDER` imprime uma traça no arquivo de log quando encontra uma dependência que não é declarada no gráfico de ordem de bloqueio.

* `lock_order_trace_missing_key`

<table frame="box" rules="all" summary="Propriedades para lock_order">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code class="literal">--lock-order[={OFF|ON}]</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code class="literal"><a class="link" href="lock-order-tool.html#sysvar_lock_order">lock_order</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de definição de variável"><code class="literal">SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Booleano</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code class="literal">OFF</code></td>
  </tr>
  </tbody></table>
2

  Se a ferramenta `LOCK_ORDER` imprime uma traça no arquivo de log quando encontra um objeto que não está corretamente instrumentado com o Schema de Desempenho.

* `lock_order_trace_missing_unlock`

  <table frame="box" rules="all" summary="Propriedades para lock_order">
    <tr>
      <th>Formato de Linha de Comando</th>
      <td><code class="literal">--lock-order[={OFF|ON}]</code></td>
    </tr>
    <tr>
      <th>Variável do Sistema</th>
      <td><code class="literal"><a class="link" href="lock-order-tool.html#sysvar_lock_order">lock_order</a></code></td>
    </tr>
    <tr>
      <th>Alcance</th>
      <td>Global</td>
    </tr>
    <tr>
      <th>Dinâmico</th>
      <td>Não</td>
    </tr>
    <tr>
      <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de definição de variável"><code class="literal">SET_VAR</a></code> Aplica-se</th>
      <td>Não</td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>Booleano</td>
    </tr>
    <tr>
      <th>Valor Padrão</th>
      <td><code class="literal">OFF</code></td>
    </tr>
  </tbody></table>
3

Se a ferramenta `LOCK_ORDER` imprime uma traça no arquivo de log quando encontra um bloqueio que é destruído enquanto ainda está sendo mantido.