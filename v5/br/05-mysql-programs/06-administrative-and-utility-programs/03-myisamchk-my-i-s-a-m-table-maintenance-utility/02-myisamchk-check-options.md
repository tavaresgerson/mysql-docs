#### 4.6.3.2 myisamchk Verificar opções

O **myisamchk** suporta as seguintes opções para operações de verificação de tabelas:

- `--check`, `-c`

  <table frame="box" rules="all" summary="Propriedades para verificação"><tbody><tr><th>Formato de linha de comando</th> <td><code>--check</code></td> </tr></tbody></table>

  Verifique a tabela em busca de erros. Esta é a operação padrão se você não especificar nenhuma opção que selecione explicitamente um tipo de operação.

- `--check-only-changed`, `-C`

  <table frame="box" rules="all" summary="Propriedades para verificação apenas de alterações"><tbody><tr><th>Formato de linha de comando</th> <td><code>--check-only-changed</code></td> </tr></tbody></table>

  Verifique apenas as tabelas que foram alteradas desde a última verificação.

- `--extend-check`, `-e`

  <table frame="box" rules="all" summary="Propriedades para extend-check"><tbody><tr><th>Formato de linha de comando</th> <td><code>--extend-check</code></td> </tr></tbody></table>

  Verifique a tabela com muito cuidado. Isso é bastante lento se a tabela tiver muitos índices. Esta opção deve ser usada apenas em casos extremos. Normalmente, **myisamchk** ou **myisamchk --medium-check** devem ser capazes de determinar se há algum erro na tabela.

  Se você estiver usando `--extend-check` e tiver muita memória, definir o valor da variável `key_buffer_size` para um valor grande ajuda a operação de reparo a funcionar mais rápido.

  Veja também a descrição desta opção nas opções de reparo da tabela.

  Para uma descrição do formato de saída, consulte a Seção 4.6.3.5, “Obtendo informações da tabela com myisamchk”.

- `--fast`, `-F`

  <table frame="box" rules="all" summary="Propriedades para rápido"><tbody><tr><th>Formato de linha de comando</th> <td><code>--fast</code></td> </tr></tbody></table>

  Verifique apenas as tabelas que não foram fechadas corretamente.

- `--force`, `-f`

  <table frame="box" rules="all" summary="Propriedades para força"><tbody><tr><th>Formato de linha de comando</th> <td><code>--force</code></td> </tr></tbody></table>

  Realize uma operação de reparo automaticamente se o **myisamchk** encontrar quaisquer erros na tabela. O tipo de reparo é o mesmo especificado com a opção `--recover` ou `-r`.

- `--informação`, `-i`

  <table frame="box" rules="all" summary="Propriedades para informações"><tbody><tr><th>Formato de linha de comando</th> <td><code>--information</code></td> </tr></tbody></table>

  Imprima estatísticas informativas sobre a tabela que está sendo verificada.

- `--medium-check`, `-m`

  <table frame="box" rules="all" summary="Propriedades para médio-controle"><tbody><tr><th>Formato de linha de comando</th> <td><code>--medium-check</code></td> </tr></tbody></table>

  Faça uma verificação mais rápida do que uma operação `--extend-check`. Isso encontra apenas 99,99% de todos os erros, o que deve ser suficiente na maioria dos casos.

- `--read-only`, `-T`

  <table frame="box" rules="all" summary="Propriedades para leitura somente"><tbody><tr><th>Formato de linha de comando</th> <td><code>--read-only</code></td> </tr></tbody></table>

  Não marque a tabela como verificada. Isso é útil se você usar o **myisamchk** para verificar uma tabela que está sendo usada por outro aplicativo que não usa bloqueio, como o **mysqld** quando executado com o bloqueio externo desativado.

- `--update-state`, `-U`

  <table frame="box" rules="all" summary="Propriedades para atualização de estado"><tbody><tr><th>Formato de linha de comando</th> <td><code>--update-state</code></td> </tr></tbody></table>

  Armazene informações no arquivo `.MYI` para indicar quando a tabela foi verificada e se a tabela falhou. Isso deve ser usado para obter o máximo benefício da opção `--check-only-changed`, mas você não deve usar essa opção se o servidor **mysqld** estiver usando a tabela e você estiver executando-o com o bloqueio externo desativado.
