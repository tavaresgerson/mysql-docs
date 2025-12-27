#### 7.6.4.3 Regra do Plugin de Reescrita de Consultas do Rewriter

A discussão a seguir serve como referência para esses elementos associados ao plugin de reescrita de consultas do `Rewriter`:

* A tabela de regras do `Rewriter` no banco de dados `query_rewrite`
* Procedimentos e funções do `Rewriter`
* Variáveis do sistema e status do `Rewriter`

##### 7.6.4.3.1 Tabela de Regras do Plugin de Reescrita de Consultas do Rewriter

A tabela `rewrite_rules` no banco de dados `query_rewrite` fornece armazenamento persistente para as regras que o plugin `Rewriter` usa para decidir se reescreve as declarações.

Os usuários se comunicam com o plugin modificando o conjunto de regras armazenadas nesta tabela. O plugin comunica informações aos usuários definindo a coluna `message` da tabela.

Observação

A tabela de regras é carregada no plugin pelo procedimento armazenado `flush_rewrite_rules`. A menos que esse procedimento tenha sido chamado após a modificação mais recente da tabela, o conteúdo da tabela não necessariamente corresponde ao conjunto de regras que o plugin está usando.

A tabela `rewrite_rules` tem as seguintes colunas:

* `id`

  O ID da regra. Esta coluna é a chave primária da tabela. Você pode usar o ID para identificar de forma única qualquer regra.

* `pattern`

  O modelo que indica o padrão para as declarações que a regra corresponde. Use `?` para representar marcadores de parâmetros que correspondem a valores de dados.

* `pattern_database`

  O banco de dados usado para corresponder nomes de tabelas não qualificados em declarações. Nomes de tabelas qualificados em declarações correspondem a nomes qualificados no padrão se os nomes de banco de dados e tabelas correspondentes forem idênticos. Nomes de tabelas não qualificados em declarações correspondem a nomes não qualificados no padrão apenas se o banco de dados padrão for o mesmo que `pattern_database` e os nomes de tabelas forem idênticos.

* `replacement`

O modelo que indica como reescrever declarações que correspondem ao valor da coluna `pattern`. Use `?` para representar marcadores de parâmetros que correspondem a valores de dados. Nas declarações reescritas, o plugin substitui os marcadores de parâmetros `?` na `reposição` usando valores de dados correspondentes aos marcadores correspondentes no `pattern`.

* `enabled`

  Se a regra está habilitada. As operações de carregamento (realizadas invocando a procedure armazenada `flush_rewrite_rules()`) carregam a regra da tabela para o cache em memória do `Rewriter` apenas se esta coluna for `YES`.

  Esta coluna permite desativar uma regra sem removê-la: defina a coluna para um valor diferente de `YES` e recarregue a tabela para o plugin.

* `message`

  O plugin usa esta coluna para comunicar com os usuários. Se não ocorrer nenhum erro ao carregar a tabela de regras para a memória, o plugin define a coluna `message` para `NULL`. Um valor diferente de `NULL` indica um erro e o conteúdo da coluna é a mensagem de erro. Erros podem ocorrer nessas circunstâncias:

  + Ou o padrão ou a reposição é uma instrução SQL incorreta que produz erros sintáticos.

  + A reposição contém mais marcadores de parâmetros `?` do que o padrão.

Se ocorrer um erro de carregamento, o plugin também define a variável de status `Rewriter_reload_error` para `ON`.

* `pattern_digest`

  Esta coluna é usada para depuração e diagnóstico. Se a coluna existir quando a tabela de regras for carregada para a memória, o plugin a atualiza com o digest do padrão. Esta coluna pode ser útil se você estiver tentando determinar por que alguma declaração não consegue ser reescrita.

* `normalized_pattern`

Esta coluna é usada para depuração e diagnóstico. Se a coluna existir quando a tabela de regras for carregada na memória, o plugin a atualiza com o formato normalizado do padrão. Essa coluna pode ser útil se você estiver tentando determinar por que uma determinada declaração não consegue ser reescrita.

##### 7.6.4.3.2 Procedimentos e Funções do Plugin de Rewriting de Consultas de Rewriting

A operação do plugin `Rewriter` usa um procedimento armazenado que carrega a tabela de regras em seu cache de memória, e uma função carregável auxiliar. Durante o funcionamento normal, os usuários invocam apenas o procedimento armazenado. A função é destinada a ser invocada pelo procedimento armazenado, e não diretamente pelos usuários.

* `flush_rewrite_rules()`

  Este procedimento armazenado usa a função `load_rewrite_rules()` para carregar o conteúdo da tabela `rewrite_rules` no cache de memória do `Rewriter`.

  Chamar `flush_rewrite_rules()` implica `COMMIT`.

  Invoque este procedimento após modificar a tabela de regras para fazer o plugin atualizar seu cache com o novo conteúdo da tabela. Se ocorrer algum erro, o plugin define a coluna `message` para as linhas de regra apropriadas na tabela e define a variável de status `Rewriter_reload_error` para `ON`.

* `load_rewrite_rules()`

  Esta função é uma rotina auxiliar usada pelo procedimento armazenado `flush_rewrite_rules()`.

##### 7.6.4.3.3 Variáveis de Sistema do Plugin de Rewriting de Consultas de Rewriting

O plugin de reescrita de consultas de reescrita `Rewriter` suporta as seguintes variáveis de sistema. Essas variáveis estão disponíveis apenas se o plugin estiver instalado (veja a Seção 7.6.4.1, “Instalando ou Desinstalando o Plugin de Rewriting de Consultas de Rewriting”).

* `rewriter_enabled`

<table frame="box" rules="all" summary="Propriedades para o plugin de reescrita de consultas `rewriter_enabled`">
  <tr>
    <th>Variável do Sistema</th>
    <td><code class="literal"><a class="link" href="rewriter-query-rewrite-plugin-reference.html#sysvar_rewriter_enabled">rewriter_enabled</a></code></td>
  </tr>
  <tr>
    <th>Âmbito</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Sim</td>
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
    <td><code class="literal">ON</code></td>
  </tr>
  <tr>
    <th>Valores Válidos</th>
    <td><code class="literal">OFF</code></td>
  </tr>
</table>

  Se o plugin de reescrita de consultas `Rewriter` está habilitado.

* `rewriter_enabled_for_threads_without_privilege_checks`

<table frame="box" rules="all" summary="Propriedades para rewriter_enabled_for_threads_without_privilege_checks">
  <tr>
    <th>Variável do Sistema</th>
    <td><code class="literal"><a class="link" href="rewriter-query-rewrite-plugin-reference.html#sysvar_rewriter_enabled_for_threads_without_privilege_checks">rewriter_enabled_for_threads_without_privilege_checks</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmica</th>
    <td>Sim</td>
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
    <td><code class="literal">ON</code></td>
  </tr>
  <tr>
    <th>Valores Válidos</th>
    <td><code class="literal">OFF</code></td>
  </tr>
</table>

  Se aplicar reescritas para threads de replicação que executam com verificações de privilégio desabilitadas. Se definido como `OFF`, essas reescritas são ignoradas. Requer o privilégio `SYSTEM_VARIABLES_ADMIN` ou `SUPER` para definir.

  Esta variável não tem efeito se `rewriter_enabled` estiver definido como `OFF`.

* `rewriter_verbose`

<table frame="box" rules="all" summary="Variáveis de status do plugin de reescrita de consultas do Rewriter">
  <tr><th>Variável do sistema</th> <td><code class="literal"><a class="link" href="rewriter-query-rewrite-plugin-reference.html#sysvar_rewriter_verbose">rewriter_verbose</a></code></td> </tr>
  <tr><th>Âmbito</th> <td>Global</td> </tr>
  <tr><th>Dinâmica</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code class="literal">SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
</table>

  Para uso interno.

##### 7.6.4.3.4 Variáveis de status do plugin de reescrita de consultas do Rewriter

O plugin de reescrita de consultas do Rewriter suporta as seguintes variáveis de status. Essas variáveis estão disponíveis apenas se o plugin estiver instalado (consulte a Seção 7.6.4.1, “Instalando ou Desinstalando o Plugin de Reescrita de Consultas do Rewriter”).

* `Rewriter_number_loaded_rules`

  O número de regras de reescrita do plugin de reescrita de regras que foram carregadas com sucesso da tabela `rewrite_rules` para a memória para uso pelo plugin `Rewriter`.

* `Rewriter_number_reloads`

  O número de vezes que a tabela `rewrite_rules` foi carregada no cache de memória usado pelo plugin `Rewriter`.

* `Rewriter_number_rewritten_queries`

  O número de consultas reescritas pelo plugin de reescrita de consultas do Rewriter desde que ele foi carregado.

* `Rewriter_reload_error`

  Se ocorreu um erro na última vez que a tabela `rewrite_rules` foi carregada no cache de memória usado pelo plugin `Rewriter`. Se o valor for `OFF`, não ocorreu erro. Se o valor for `ON`, ocorreu um erro; verifique a coluna `message` da tabela `rewriter_rules` para mensagens de erro.