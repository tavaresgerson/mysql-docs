#### 6.6.4.2 myisamchk Opções de verificação

`myisamchk` suporta as seguintes opções para operações de verificação de tabela:

- `--check`, `-c`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--check</code>]]</td> </tr></tbody></table>

Verifique se há erros na tabela. Esta é a operação padrão se você não especificar nenhuma opção que selecione um tipo de operação explicitamente.

- `--check-only-changed`, `-C`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--check-only-changed</code>]]</td> </tr></tbody></table>

Verificar apenas as tabelas que tenham sido alteradas desde a última verificação.

- `--extend-check`, `-e`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--extend-check</code>]]</td> </tr></tbody></table>

Verifique a tabela muito cuidadosamente. Isso é bastante lento se a tabela tiver muitos índices. Essa opção deve ser usada apenas em casos extremos. Normalmente, `myisamchk` ou **myisamchk --medium-check** devem ser capazes de determinar se há algum erro na tabela.

Se você estiver usando `--extend-check` e tiver muita memória, definir a variável `key_buffer_size` em um valor grande ajuda a operação de reparo a correr mais rápido.

Ver também a descrição desta opção em Opções de reparação de tabela.

Para uma descrição do formato de saída, ver secção 6.6.4.5, "Obtenção de informações de tabela com myisamchk".

- `--fast`, `-F`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--fast</code>]]</td> </tr></tbody></table>

Verifique apenas as mesas que não foram fechadas corretamente.

- `--force`, `-f`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--force</code>]]</td> </tr></tbody></table>

Faça uma operação de reparo automaticamente se `myisamchk` encontrar algum erro na tabela. O tipo de reparo é o mesmo que o especificado com a opção `--recover` ou `-r`.

- `--information`, `-i`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--information</code>]]</td> </tr></tbody></table>

Imprimir estatísticas informativas sobre a tabela verificada.

- `--medium-check`, `-m`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--medium-check</code>]]</td> </tr></tbody></table>

Faça uma verificação que seja mais rápida do que uma operação `--extend-check`. Isso encontra apenas 99,99% de todos os erros, o que deve ser bom o suficiente na maioria dos casos.

- `--read-only`, `-T`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--read-only</code>]]</td> </tr></tbody></table>

Não marque a tabela como verificada. Isso é útil se você usar `myisamchk` para verificar uma tabela que está em uso por algum outro aplicativo que não usa bloqueio, como `mysqld` quando executado com bloqueio externo desativado.

- `--update-state`, `-U`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--update-state</code>]]</td> </tr></tbody></table>

Armazenar informações no arquivo `.MYI` para indicar quando a tabela foi verificada e se a tabela falhou. Isso deve ser usado para obter o máximo benefício da opção `--check-only-changed`, mas você não deve usar essa opção se o servidor `mysqld` estiver usando a tabela e você estiver executando com bloqueio externo desativado.
