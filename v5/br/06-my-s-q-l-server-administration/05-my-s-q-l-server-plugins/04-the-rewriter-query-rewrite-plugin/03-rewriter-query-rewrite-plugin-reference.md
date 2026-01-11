#### 5.5.4.3 Referência do Plugin de Reescrita de Consultas de Reescritor

A discussão a seguir serve como referência para esses elementos associados ao plugin de reescrita de consultas `Rewriter`:

- A tabela de regras de `Rewriter` no banco de dados `query_rewrite`

- Procedimentos e funções de `Rewriter`

- Sistema de `Rewriter` e variáveis de status

##### 5.5.4.3.1 Tabela de Regras do Plugin de Reescrita de Consultas

A tabela `rewrite_rules` no banco de dados `query_rewrite` fornece armazenamento persistente para as regras que o plugin `Rewriter` usa para decidir se deve reescrever declarações.

Os usuários se comunicam com o plugin modificando o conjunto de regras armazenadas nesta tabela. O plugin comunica informações aos usuários definindo a coluna `mensagem` da tabela.

Nota

A tabela de regras é carregada no plugin pelo procedimento armazenado `flush_rewrite_rules`. A menos que esse procedimento tenha sido chamado após a modificação mais recente da tabela, o conteúdo da tabela não corresponde necessariamente ao conjunto de regras que o plugin está usando.

A tabela `rewrite_rules` tem as seguintes colunas:

- `id`

  O ID da regra. Essa coluna é a chave primária da tabela. Você pode usar o ID para identificar de forma única qualquer regra.

- `padrão`

  O modelo que indica o padrão para as declarações que a regra corresponde. Use `?` para representar marcadores de parâmetros que correspondem a valores de dados.

- `pattern_database`

  O banco de dados usado para combinar nomes de tabelas não qualificados em declarações. Nomes de tabelas qualificados em declarações correspondem a nomes qualificados no padrão se os nomes de banco de dados e tabelas correspondentes forem idênticos. Nomes de tabelas não qualificados em declarações correspondem a nomes não qualificados no padrão apenas se o banco de dados padrão for o mesmo que `pattern_database` e os nomes de tabelas forem idênticos.

- "substituição"

  O modelo que indica como reescrever declarações que correspondem ao valor da coluna `pattern`. Use `?` para representar marcadores de parâmetros que correspondem a valores de dados. Nas declarações reescritas, o plugin substitui os marcadores de parâmetros `?` na `replacement` usando valores de dados correspondentes aos marcadores correspondentes em `pattern`.

- `ativado`

  Se a regra estiver habilitada. As operações de carregamento (realizadas ao invocar o procedimento armazenado `flush_rewrite_rules()`) carregam a regra da tabela para o cache em memória `Rewriter` apenas se esta coluna estiver em `YES`.

  Essa coluna permite desativar uma regra sem removê-la: defina a coluna para um valor diferente de `SIM` e recarregue a tabela no plugin.

- `mensagem`

  O plugin usa essa coluna para se comunicar com os usuários. Se não ocorrer nenhum erro ao carregar a tabela de regras na memória, o plugin define a coluna `message` como `NULL`. Um valor que não seja `NULL` indica um erro e o conteúdo da coluna é a mensagem de erro. Erros podem ocorrer nessas circunstâncias:

  - Seja o padrão ou a substituição, é uma instrução SQL incorreta que produz erros de sintaxe.

  - A substituição contém mais marcadores de parâmetro `?` do que o padrão.

  Se ocorrer um erro de carga, o plugin também define a variável de status `Rewriter_reload_error` como `ON`.

- `pattern_digest`

  Esta coluna é usada para depuração e diagnóstico. Se a coluna existir quando a tabela de regras for carregada na memória, o plugin a atualiza com o resumo do padrão. Esta coluna pode ser útil se você estiver tentando determinar por que uma determinada declaração não consegue ser reescrita.

- `padrão normalizado`

  Esta coluna é usada para depuração e diagnóstico. Se a coluna existir quando a tabela de regras for carregada na memória, o plugin a atualiza com o formato normalizado do padrão. Esta coluna pode ser útil se você estiver tentando determinar por que uma declaração não consegue ser reescrita.

##### 5.5.4.3.2 Procedimento e funções do plugin de reescrita de consultas do reescritor

A operação do plugin `Rewriter` utiliza um procedimento armazenado que carrega a tabela de regras em seu cache de memória e uma função auxiliar carregável. Em operação normal, os usuários acionam apenas o procedimento armazenado. A função é destinada a ser acionada pelo procedimento armazenado, e não diretamente pelos usuários.

- [`flush_rewrite_rules()`](https://pt-br.react-query.org/rewriter-query-rewrite-plugin-reference.html#function_flush-rewrite-rules)

  Este procedimento armazenado usa a função `load_rewrite_rules()` para carregar o conteúdo da tabela `rewrite_rules` no cache `Rewriter` de memória.

  Chamar `flush_rewrite_rules()` implica em `COMMIT` (commit.html).

  Invoque este procedimento após modificar a tabela de regras para fazer com que o plugin atualize seu cache com o novo conteúdo da tabela. Se ocorrerem erros, o plugin define a coluna `message` para as linhas de regra apropriadas na tabela e define a variável de status `Rewriter_reload_error` para `ON`.

- [`load_rewrite_rules()`](https://pt-br.react-query-rewriter-plugin.com/ref/rewriter-query-rewrite-plugin-reference.html#function_load-rewrite-rules)

  Essa função é uma rotina auxiliar usada pelo procedimento armazenado `flush_rewrite_rules()`.

##### 5.5.4.3.3 Sistema de Plugin de Reescrita de Consultas de Reescritor Variáveis de Sistema

O plugin de reescrita de consultas `Rewriter` suporta as seguintes variáveis de sistema. Essas variáveis estão disponíveis apenas se o plugin estiver instalado (consulte Seção 5.5.4.1, “Instalando ou Desinstalando o Plugin de Reescrita de Consultas Rewriter”).

- [`rewriter_enabled`](https://pt-br.github.io/query-rewrite-plugin-reference/sysvar_rewriter_enabled/)

  <table frame="box" rules="all" summary="Propriedades para rewriter_enabled"><tbody><tr><th>Variável do sistema</th> <td><code>rewriter_enabled</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><code>OFF</code></td> </tr></tbody></table>

  Se o plugin de reescrita de consultas `Rewriter` está habilitado.

- `rewriter_verbose`

  <table frame="box" rules="all" summary="Propriedades para rewriter_verbose"><tbody><tr><th>Variável do sistema</th> <td><code>rewriter_verbose</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr></tbody></table>

  Para uso interno.

##### 5.5.4.3.4 Variáveis de status do plugin de reescrita de consultas do reescritor

O plugin de reescrita de consultas `Rewriter` suporta as seguintes variáveis de status. Essas variáveis estão disponíveis apenas se o plugin estiver instalado (consulte Seção 5.5.4.1, “Instalando ou Desinstalando o Plugin de Reescrita de Consultas Rewriter”).

- `Reescritor_número_de_regras_carregadas`

  O número de regras de reescrita de plugins de reescrita carregadas com sucesso da tabela `rewrite_rules` para a memória para uso pelo plugin `Rewriter`.

- `Reescritor_número_recargas`

  O número de vezes que a tabela `rewrite_rules` foi carregada no cache de memória usado pelo plugin `Rewriter`.

- `Reescritor_número_de_consultas_reescritas`

  O número de consultas reescritas pelo plugin de reescrita de consultas `Rewriter` desde que foi carregado.

- `Rewriter_reload_error`

  Se ocorreu um erro na última vez que a tabela `rewrite_rules` foi carregada no cache de memória usado pelo plugin `Rewriter`. Se o valor for `OFF`, nenhum erro ocorreu. Se o valor for `ON`, um erro ocorreu; verifique a coluna `message` da tabela `rewriter_rules` para mensagens de erro.
