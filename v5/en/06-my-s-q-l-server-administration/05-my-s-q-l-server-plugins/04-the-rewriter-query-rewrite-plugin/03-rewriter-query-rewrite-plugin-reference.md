#### 5.5.4.3 Referência do Plugin de Reescrita de Query Rewriter

A discussão a seguir serve como referência para estes elementos associados ao plugin de reescrita de Query `Rewriter`:

* A tabela de regras `Rewriter` no Database `query_rewrite`

* Procedimentos e funções `Rewriter`
* Variáveis de sistema e de status `Rewriter`

##### 5.5.4.3.1 Tabela de Regras do Plugin de Reescrita de Query Rewriter

A tabela `rewrite_rules` no Database `query_rewrite` fornece armazenamento persistente para as regras que o plugin `Rewriter` utiliza para decidir se deve reescrever comandos (statements).

Usuários se comunicam com o plugin modificando o conjunto de regras armazenadas nesta tabela. O plugin comunica informações aos usuários configurando a coluna `message` da tabela.

**Nota**

A tabela de regras é carregada no plugin pelo stored procedure `flush_rewrite_rules`. A menos que esse procedure tenha sido chamado após a modificação mais recente da tabela, o conteúdo da tabela não corresponde necessariamente ao conjunto de regras que o plugin está utilizando.

A tabela `rewrite_rules` possui as seguintes colunas:

* `id`

  O ID da regra. Esta coluna é a Primary Key da tabela. Você pode usar o ID para identificar unicamente qualquer regra.

* `pattern`

  O template que indica o Pattern para os statements que a regra corresponde (match). Use `?` para representar marcadores de parâmetro que correspondem a valores de dados.

* `pattern_database`

  O Database usado para corresponder nomes de tabela não qualificados nos statements. Nomes de tabela qualificados nos statements correspondem a nomes qualificados no Pattern se os nomes de Database e tabela correspondentes forem idênticos. Nomes de tabela não qualificados nos statements correspondem a nomes não qualificados no Pattern somente se o Database padrão for o mesmo que `pattern_database` e os nomes das tabelas forem idênticos.

* `replacement`

  O template que indica como reescrever statements que correspondem ao valor da coluna `pattern`. Use `?` para representar marcadores de parâmetro que correspondem a valores de dados. Em statements reescritos, o plugin substitui os marcadores de parâmetro `?` em `replacement` usando valores de dados correspondidos pelos marcadores correspondentes em `pattern`.

* `enabled`

  Indica se a regra está habilitada. As operações de carregamento (realizadas pela invocação do stored procedure `flush_rewrite_rules()`) carregam a regra da tabela para o Cache em memória do `Rewriter` somente se esta coluna for `YES`.

  Esta coluna possibilita desativar uma regra sem removê-la: Defina a coluna para um valor diferente de `YES` e recarregue a tabela no plugin.

* `message`

  O plugin usa esta coluna para se comunicar com os usuários. Se nenhum erro ocorrer quando a tabela de regras for carregada na memória, o plugin define a coluna `message` como `NULL`. Um valor não-`NULL` indica um erro e o conteúdo da coluna é a mensagem de erro. Erros podem ocorrer sob estas circunstâncias:

  + Ou o Pattern ou o Replacement é um comando SQL incorreto que produz erros de sintaxe.

  + O Replacement contém mais marcadores de parâmetro `?` do que o Pattern.

  Se ocorrer um erro de carregamento, o plugin também define a variável de status [`Rewriter_reload_error`](rewriter-query-rewrite-plugin-reference.html#statvar_Rewriter_reload_error) como `ON`.

* `pattern_digest`

  Esta coluna é usada para Debugging e diagnósticos. Se a coluna existir quando a tabela de regras for carregada na memória, o plugin a atualiza com o Pattern Digest. Esta coluna pode ser útil se você estiver tentando determinar por que algum statement falha ao ser reescrito.

* `normalized_pattern`

  Esta coluna é usada para Debugging e diagnósticos. Se a coluna existir quando a tabela de regras for carregada na memória, o plugin a atualiza com a forma normalizada do Pattern. Esta coluna pode ser útil se você estiver tentando determinar por que algum statement falha ao ser reescrito.

##### 5.5.4.3.2 Procedimentos e Funções do Plugin de Reescrita de Query Rewriter

A operação do plugin `Rewriter` utiliza um stored procedure que carrega a tabela de regras em seu Cache em memória, e uma função loadable auxiliar (helper). Em operação normal, os usuários invocam apenas o stored procedure. A função é destinada a ser invocada pelo stored procedure, e não diretamente pelos usuários.

* [`flush_rewrite_rules()`](rewriter-query-rewrite-plugin-reference.html#function_flush-rewrite-rules)

  Este stored procedure usa a função [`load_rewrite_rules()`](rewriter-query-rewrite-plugin-reference.html#function_load-rewrite-rules) para carregar o conteúdo da tabela `rewrite_rules` no Cache em memória do `Rewriter`.

  Chamar `flush_rewrite_rules()` implica em [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements").

  Invoque este procedure após modificar a tabela de regras para fazer com que o plugin atualize seu Cache com o novo conteúdo da tabela. Se ocorrerem erros, o plugin define a coluna `message` para as linhas de regra apropriadas na tabela e define a variável de status [`Rewriter_reload_error`](rewriter-query-rewrite-plugin-reference.html#statvar_Rewriter_reload_error) como `ON`.

* [`load_rewrite_rules()`](rewriter-query-rewrite-plugin-reference.html#function_load-rewrite-rules)

  Esta função é uma rotina auxiliar (helper routine) usada pelo stored procedure [`flush_rewrite_rules()`](rewriter-query-rewrite-plugin-reference.html#function_flush-rewrite-rules).

##### 5.5.4.3.3 Variáveis de Sistema do Plugin de Reescrita de Query Rewriter

O plugin de reescrita de Query `Rewriter` suporta as seguintes variáveis de sistema. Estas variáveis estão disponíveis somente se o plugin estiver instalado (consulte [Section 5.5.4.1, “Installing or Uninstalling the Rewriter Query Rewrite Plugin”](rewriter-query-rewrite-plugin-installation.html "5.5.4.1 Installing or Uninstalling the Rewriter Query Rewrite Plugin")).

* [`rewriter_enabled`](rewriter-query-rewrite-plugin-reference.html#sysvar_rewriter_enabled)

  <table frame="box" rules="all" summary="Propriedades para rewriter_enabled"><tbody><tr><th>Variável de Sistema</th> <td><code>rewriter_enabled</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><code>OFF</code></td> </tr> </tbody></table>

  Indica se o plugin de reescrita de Query `Rewriter` está habilitado.

* [`rewriter_verbose`](rewriter-query-rewrite-plugin-reference.html#sysvar_rewriter_verbose)

  <table frame="box" rules="all" summary="Propriedades para rewriter_verbose"><tbody><tr><th>Variável de Sistema</th> <td><code>rewriter_verbose</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr> </tbody></table>

  Para uso interno.

##### 5.5.4.3.4 Variáveis de Status do Plugin de Reescrita de Query Rewriter

O plugin de reescrita de Query `Rewriter` suporta as seguintes variáveis de status. Estas variáveis estão disponíveis somente se o plugin estiver instalado (consulte [Section 5.5.4.1, “Installing or Uninstalling the Rewriter Query Rewrite Plugin”](rewriter-query-rewrite-plugin-installation.html "5.5.4.1 Installing or Uninstalling the Rewriter Query Rewrite Plugin")).

* [`Rewriter_number_loaded_rules`](rewriter-query-rewrite-plugin-reference.html#statvar_Rewriter_number_loaded_rules)

  O número de regras de reescrita do plugin carregadas com sucesso da tabela `rewrite_rules` para a memória para uso pelo plugin `Rewriter`.

* [`Rewriter_number_reloads`](rewriter-query-rewrite-plugin-reference.html#statvar_Rewriter_number_reloads)

  O número de vezes que a tabela `rewrite_rules` foi carregada no Cache em memória usado pelo plugin `Rewriter`.

* [`Rewriter_number_rewritten_queries`](rewriter-query-rewrite-plugin-reference.html#statvar_Rewriter_number_rewritten_queries)

  O número de Queries reescritas pelo plugin de reescrita de Query `Rewriter` desde que foi carregado.

* [`Rewriter_reload_error`](rewriter-query-rewrite-plugin-reference.html#statvar_Rewriter_reload_error)

  Indica se ocorreu um erro na última vez em que a tabela `rewrite_rules` foi carregada no Cache em memória usado pelo plugin `Rewriter`. Se o valor for `OFF`, nenhum erro ocorreu. Se o valor for `ON`, um erro ocorreu; verifique a coluna `message` da tabela `rewriter_rules` para mensagens de erro.