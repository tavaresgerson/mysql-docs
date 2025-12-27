#### 6.6.4.2 Opções de Verificação de Tabelas

O `myisamchk` suporta as seguintes opções para operações de verificação de tabelas:

*  `--check`, `-c`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--check</code></td> </tr></tbody></table>

  Verifique a tabela em busca de erros. Esta é a operação padrão se você especificar nenhuma opção que selecione explicitamente um tipo de operação.
*  `--check-only-changed`, `-C`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--check-only-changed</code></td> </tr></tbody></table>

  Verifique apenas tabelas que tenham sido alteradas desde a última verificação.
*  `--extend-check`, `-e`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--extend-check</code></td> </tr></tbody></table>

  Verifique a tabela de forma muito detalhada. Esta opção é bastante lenta se a tabela tiver muitos índices. Esta opção deve ser usada apenas em casos extremos. Normalmente, `myisamchk` ou `myisamchk --medium-check` devem ser capazes de determinar se há algum erro na tabela.

  Se você estiver usando `--extend-check` e tiver muita memória, definir a variável `key_buffer_size` para um valor grande ajuda a operação de reparo a funcionar mais rápido.

  Veja também a descrição desta opção nas opções de reparo de tabela.

  Para uma descrição do formato de saída, consulte a Seção 6.6.4.5, “Obter Informações da Tabela com myisamchk”.
*  `--fast`, `-F`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--fast</code></td> </tr></tbody></table>

  Verifique apenas tabelas que não tenham sido fechadas corretamente.
*  `--force`, `-f`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--force</code></td> </tr></tbody></table>

  Realize automaticamente uma operação de reparo se o `myisamchk` encontrar algum erro na tabela. O tipo de reparo é o mesmo especificado com a opção `--recover` ou `-r`.
*  `--information`, `-i`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--information</code></td> </tr></tbody></table>

  Imprima estatísticas informativas sobre a tabela verificada.
*  `--medium-check`, `-m`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--medium-check</code></td> </tr></tbody></table>

  Faça uma verificação mais rápida do que uma operação `--extend-check`. Isso encontra apenas 99,99% de todos os erros, o que deve ser suficiente na maioria dos casos.
*  `--read-only`, `-T`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--read-only</code></td> </tr></tbody></table>

  Não marque a tabela como verificada. Isso é útil se você usar `myisamchk` para verificar uma tabela que está sendo usada por outro aplicativo que não usa bloqueio, como `mysqld` quando executado com bloqueio externo desativado.
*  `--update-state`, `-U`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--update-state</code></td> </tr></tbody></table>

  Armazene informações no arquivo `.MYI` para indicar quando a tabela foi verificada e se a tabela falhou. Isso deve ser usado para obter o máximo benefício da opção `--check-only-changed`, mas você não deve usar essa opção se o servidor `mysqld` estiver usando a tabela e você estiver executando-o com bloqueio externo desativado.