#### 7.6.4.3 Rewrite Query Rewrite Plugin Referência

A discussão a seguir serve como referência a esses elementos associados ao plugin de reescrita de consulta `Rewriter`:

- A tabela de regras do `Rewriter` na base de dados do `query_rewrite`
- \[`Rewriter`] procedimentos e funções
- \[`Rewriter`] sistema e variáveis de estado

##### 7.6.4.3.1 Query Rewriter Rewrite Plugin Regras de Tabela

A tabela `rewrite_rules` no banco de dados `query_rewrite` fornece armazenamento persistente para as regras que o plugin `Rewriter` usa para decidir se deve reescrever instruções.

Os usuários se comunicam com o plugin modificando o conjunto de regras armazenadas nesta tabela. O plugin comunica informações aos usuários definindo a coluna `message` da tabela.

::: info Note

A tabela de regras é carregada no plugin pelo procedimento armazenado `flush_rewrite_rules`. A menos que esse procedimento tenha sido chamado após a modificação mais recente da tabela, o conteúdo da tabela não corresponde necessariamente ao conjunto de regras que o plugin está usando.

:::

A tabela `rewrite_rules` tem estas colunas:

- `id`

  O ID da regra. Esta coluna é a chave primária da tabela. Pode usar o ID para identificar de forma única qualquer regra.
- `pattern`

  O modelo que indica o padrão para instruções que a regra corresponde. Use `?` para representar marcadores de parâmetros que correspondem a valores de dados.
- `pattern_database`

  O banco de dados usado para combinar nomes de tabela não qualificados em instruções. Nomes de tabela qualificados em instruções correspondem a nomes qualificados no padrão se o banco de dados e os nomes de tabela correspondentes forem idênticos. Nomes de tabela não qualificados em instruções correspondem a nomes não qualificados no padrão apenas se o banco de dados padrão for o mesmo que `pattern_database` e os nomes de tabela forem idênticos.
- `replacement`

  O modelo que indica como reescrever instruções correspondentes ao valor da coluna `pattern`. Use `?` para representar marcadores de parâmetros que correspondem aos valores de dados. Em instruções reescritas, o plugin substitui os marcadores de parâmetros `?` em `replacement` usando valores de dados correspondentes aos marcadores correspondentes em `pattern`.
- `enabled`

  Se a regra está habilitada. Operações de carregamento (executadas invocando o procedimento armazenado `flush_rewrite_rules()`) carregam a regra da tabela no `Rewriter` cache em memória somente se esta coluna for `YES`.

  Esta coluna torna possível desativar uma regra sem removê-la: Defina a coluna para um valor diferente de `YES` e recarregue a tabela no plugin.
- `message`

  O plugin usa esta coluna para se comunicar com os usuários. Se nenhum erro ocorrer quando a tabela de regras é carregada na memória, o plugin define a coluna `message` para `NULL`. Um valor diferente de `NULL` indica um erro e o conteúdo da coluna é a mensagem de erro. Erros podem ocorrer nestas circunstâncias:

  - O padrão ou a substituição é uma instrução SQL incorreta que produz erros de sintaxe.
  - A substituição contém mais marcadores de parâmetros do que o padrão.

  Se ocorrer um erro de carregamento, o plugin também define a variável de status `Rewriter_reload_error` para `ON`.
- `pattern_digest`

  Esta coluna é usada para depuração e diagnóstico. Se a coluna existe quando a tabela de regras é carregada na memória, o plugin a atualiza com o resumo de padrões. Esta coluna pode ser útil se você estiver tentando determinar por que algumas instruções não conseguem ser reescritas.
- `normalized_pattern`

  Esta coluna é usada para depuração e diagnóstico. Se a coluna existe quando a tabela de regras é carregada na memória, o plugin atualiza-a com a forma normalizada do padrão. Esta coluna pode ser útil se você estiver tentando determinar por que algumas instruções não conseguem ser reescritas.

##### 7.6.4.3.2 Rewriter Query Rewrite Plugin Procedimentos e Funções

A operação do plug-in \[`Rewriter`] usa um procedimento armazenado que carrega a tabela de regras em seu cache de memória e uma função de carregamento auxiliar.

- `flush_rewrite_rules()`

Este procedimento armazenado usa a função `load_rewrite_rules()` para carregar o conteúdo da tabela `rewrite_rules` no cache `Rewriter` na memória.

Chamando `flush_rewrite_rules()` implica `COMMIT`.

Se ocorrer algum erro, o plugin define a coluna `message` para as linhas de regras apropriadas na tabela e define a variável de status `Rewriter_reload_error` para `ON`.

- `load_rewrite_rules()`

Esta função é uma rotina auxiliar usada pelo procedimento armazenado `flush_rewrite_rules()`.

##### 7.6.4.3.3 Rewriter Query Rewrite Plugin Variables do sistema

O plug-in de reescrita de consultas do `Rewriter` suporta as seguintes variáveis do sistema. Estas variáveis estão disponíveis apenas se o plug-in estiver instalado (ver Seção 7.6.4.1, Instalar ou Desinstalar o Plugin de Reescrita de Consultas do Rewriter).

- `rewriter_enabled`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>rewriter_enabled</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Se o plug-in de reescrita de consulta `Rewriter` está ativado.

- `rewriter_enabled_for_threads_without_privilege_checks`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>rewriter_enabled_for_threads_without_privilege_checks</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Se aplicar reescritas para threads de replicação que executam com verificação de privilégios desativados. Se definido como `OFF`, tais reescritas são ignoradas. Requer o privilégio `SYSTEM_VARIABLES_ADMIN` ou `SUPER` para definir.

Esta variável não tem efeito se `rewriter_enabled` é `OFF`.

- `rewriter_verbose`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>rewriter_verbose</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr></tbody></table>

Para uso interno.

##### 7.6.4.3.4 Reescrever Query Reescrever Plugin Status Variables

O plug-in de reescrita de consultas do `Rewriter` suporta as seguintes variáveis de status. Estas variáveis estão disponíveis apenas se o plugin estiver instalado (ver Seção 7.6.4.1, Instalar ou Desinstalar o Plugin de Reescrita de Consultas do Rewriter).

- `Rewriter_number_loaded_rules`

O número de regras de reescrita de plugins reescritos carregadas com sucesso da tabela `rewrite_rules` para a memória para uso pelo plugin `Rewriter`.

- `Rewriter_number_reloads`

O número de vezes que a tabela `rewrite_rules` foi carregada no cache em memória usado pelo plugin `Rewriter`.

- `Rewriter_number_rewritten_queries`

O número de consultas reescritas pelo plug-in de reescrita de consultas `Rewriter` desde que foi carregado.

- `Rewriter_reload_error`

Se ocorreu um erro na última vez que a tabela `rewrite_rules` foi carregada no cache em memória usado pelo plugin `Rewriter`. Se o valor for `OFF`, nenhum erro ocorreu. Se o valor for `ON`, um erro ocorreu; verifique a coluna `message` da tabela `rewriter_rules` para mensagens de erro.
