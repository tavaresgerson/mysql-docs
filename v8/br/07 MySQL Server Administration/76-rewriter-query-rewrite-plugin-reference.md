#### 7.6.4.3 Regra do Plugin de Reescrita de Consultas do Reescritor

A discussão a seguir serve como referência para esses elementos associados ao plugin de reescrita de consultas do `Reescritor`:

* A tabela de regras do `Reescritor` no banco de dados `query_rewrite`
* Procedimentos e funções do `Reescritor`
* Variáveis do sistema e status do `Reescritor`

##### 7.6.4.3.1 Tabela de Regras do Plugin de Reescrita de Consultas do Reescritor

A tabela `rewrite_rules` no banco de dados `query_rewrite` fornece armazenamento persistente para as regras que o plugin `Reescritor` usa para decidir se reescreve declarações.

Os usuários se comunicam com o plugin modificando o conjunto de regras armazenadas nesta tabela. O plugin comunica informações aos usuários definindo a coluna `message` da tabela.

::: info Nota

A tabela de regras é carregada no plugin pelo procedimento armazenado `flush_rewrite_rules`. A menos que esse procedimento tenha sido chamado após a modificação mais recente da tabela, o conteúdo da tabela não necessariamente corresponde ao conjunto de regras que o plugin está usando.

:::

A tabela `rewrite_rules` tem as seguintes colunas:

* `id`

  O ID da regra. Esta coluna é a chave primária da tabela. Você pode usar o ID para identificar de forma única qualquer regra.
* `pattern`

  O modelo que indica o padrão para declarações que a regra corresponde. Use `?` para representar marcadores de parâmetros que correspondem a valores de dados.
* `pattern_database`

  O banco de dados usado para corresponder nomes de tabelas não qualificados em declarações. Nomes de tabelas qualificados em declarações correspondem a nomes qualificados no padrão se os nomes de banco de dados e tabelas correspondentes forem idênticos. Nomes de tabelas não qualificados em declarações correspondem a nomes não qualificados no padrão apenas se o banco de dados padrão for o mesmo que `pattern_database` e os nomes de tabelas forem idênticos.
* `replacement`

O modelo que indica como reescrever declarações que correspondem ao valor da coluna `pattern`. Use `?` para representar marcadores de parâmetros que correspondem a valores de dados. Nas declarações reescritas, o plugin substitui os marcadores de parâmetros `?` na `reposição` usando valores de dados correspondentes aos marcadores correspondentes no `pattern`.
* `enabled`

  Se a regra está habilitada. As operações de carregamento (realizadas invocando a procedure armazenada `flush_rewrite_rules()`) carregam a regra da tabela no cache em memória do `Rewriter` apenas se esta coluna for `YES`.

  Esta coluna permite desativar uma regra sem removê-la: Defina a coluna para um valor diferente de `YES` e recarregue a tabela no plugin.
* `message`

  O plugin usa esta coluna para comunicar com os usuários. Se não ocorrer nenhum erro ao carregar a tabela de regras na memória, o plugin define a coluna `message` para `NULL`. Um valor diferente de `NULL` indica um erro e o conteúdo da coluna é a mensagem de erro. Erros podem ocorrer nessas circunstâncias:

  + Ou o padrão ou a reposição é uma declaração SQL incorreta que produz erros de sintaxe.
  + A reposição contém mais marcadores de parâmetros `?` do que o padrão.

  Se ocorrer um erro de carregamento, o plugin também define a variável de status `Rewriter_reload_error` para `ON`.
* `pattern_digest`

  Esta coluna é usada para depuração e diagnóstico. Se a coluna existir quando a tabela de regras for carregada na memória, o plugin a atualiza com o digest do padrão. Esta coluna pode ser útil se você estiver tentando determinar por que alguma declaração não é reescrita.
* `normalized_pattern`

  Esta coluna é usada para depuração e diagnóstico. Se a coluna existir quando a tabela de regras for carregada na memória, o plugin a atualiza com a forma normalizada do padrão. Esta coluna pode ser útil se você estiver tentando determinar por que alguma declaração não é reescrita.

##### 7.6.4.3.2 Procedimentos e Funções do Plugin de Rewriting de Consultas do Rewriter

A operação do plugin `Reescritor` usa um procedimento armazenado que carrega a tabela de regras para seu cache de memória, e uma função auxiliar carregável. Em operação normal, os usuários invocam apenas o procedimento armazenado. A função é destinada a ser invocada pelo procedimento armazenado, não diretamente pelos usuários.

*  `flush_rewrite_rules()`

  Este procedimento armazenado usa a função `load_rewrite_rules()` para carregar o conteúdo da tabela `rewrite_rules` para o cache de memória do `Rewriter`.

  Chamar `flush_rewrite_rules()` implica `COMMIT`.

  Invoque este procedimento após modificar a tabela de regras para fazer com que o plugin atualize seu cache com o novo conteúdo da tabela. Se ocorrer algum erro, o plugin define a coluna `message` para as linhas de regra apropriadas na tabela e define a variável de status `Rewriter_reload_error` para `ON`.
*  `load_rewrite_rules()`

  Esta função é uma rotina auxiliar usada pelo procedimento armazenado `flush_rewrite_rules()`.

##### 7.6.4.3.3 Variáveis de Sistema do Plugin de Rewriting de Consultas do Reescritor

O plugin de reescrita de consultas de `Reescritor` suporta as seguintes variáveis de sistema. Essas variáveis estão disponíveis apenas se o plugin estiver instalado (consulte a Seção 7.6.4.1, “Instalando ou Desinstalando o Plugin de Rewriting de Consultas do Reescritor”).

*  `rewriter_enabled`

  <table><tbody><tr><th>Variável de Sistema</th> <td><code>rewriter_enabled</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><code>OFF</code></td> </tbody></table>

  Se o plugin de reescrita de consultas de `Reescritor` está habilitado.
*  `rewriter_enabled_for_threads_without_privilege_checks`

<table><tbody><tr><th>Variável do Sistema</th> <td><code>rewriter_enabled_for_threads_without_privilege_checks</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><code>OFF</code></td> </tbody></table>

  Se aplicar reescritas para threads de replicação que executam com verificações de privilégios desativadas. Se definido como `OFF`, essas reescritas são ignoradas. Requer o privilégio `SYSTEM_VARIABLES_ADMIN` ou o privilégio `SUPER` para definir.

  Esta variável não tem efeito se `rewriter_enabled` estiver definido como `OFF`.
*  `rewriter_verbose`

  <table><tbody><tr><th>Variável do Sistema</th> <td><code>rewriter_verbose</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tbody></table>

  Para uso interno.

##### 7.6.4.3.4 Variáveis de Status do Plugin de Reescrita de Consultas do Rewriter

O plugin de reescrita de consultas do `Rewriter` suporta as seguintes variáveis de status. Essas variáveis estão disponíveis apenas se o plugin estiver instalado (consulte a Seção 7.6.4.1, “Instalando ou Desinstalando o Plugin de Reescrita de Consultas do Rewriter”).

*  `Rewriter_number_loaded_rules`

  O número de regras de reescrita do plugin de reescrita de consultas carregadas com sucesso da tabela `rewrite_rules` para a memória para uso pelo plugin `Rewriter`.
*  `Rewriter_number_reloads`

  O número de vezes que a tabela `rewrite_rules` foi carregada no cache em memória usado pelo plugin `Rewriter`.
*  `Rewriter_number_rewritten_queries`

  O número de consultas reescritas pelo plugin de reescrita de consultas do `Rewriter` desde que foi carregado.
*  `Rewriter_reload_error`

Se ocorreu um erro na última vez que a tabela `rewrite_rules` foi carregada no cache de memória usado pelo plugin `Rewriter`. Se o valor for `OFF`, nenhum erro ocorreu. Se o valor for `ON`, ocorreu um erro; verifique a coluna `message` da tabela `rewriter_rules` para mensagens de erro.