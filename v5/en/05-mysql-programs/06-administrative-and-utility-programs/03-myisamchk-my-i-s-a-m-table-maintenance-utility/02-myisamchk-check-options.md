#### 4.6.3.2 Opções de Verificação do myisamchk

O **myisamchk** suporta as seguintes opções para operações de verificação de tabela:

* `--check`, `-c`

  <table frame="box" rules="all" summary="Propriedades para check"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--check</code></td> </tr></tbody></table>

  Verifica a tabela em busca de erros. Esta é a operação padrão se você não especificar nenhuma opção que selecione explicitamente um tipo de operação.

* `--check-only-changed`, `-C`

  <table frame="box" rules="all" summary="Propriedades para check-only-changed"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--check-only-changed</code></td> </tr></tbody></table>

  Verifica apenas as tabelas que foram alteradas desde a última verificação.

* `--extend-check`, `-e`

  <table frame="box" rules="all" summary="Propriedades para extend-check"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--extend-check</code></td> </tr></tbody></table>

  Verifica a tabela minuciosamente. Isso é consideravelmente lento se a tabela tiver muitos Indexes. Esta opção deve ser usada apenas em casos extremos. Normalmente, o **myisamchk** ou **myisamchk --medium-check** deve ser capaz de determinar se há erros na tabela.

  Se você estiver usando o `--extend-check` e tiver bastante memória, definir a variável `key_buffer_size` para um valor grande ajuda a operação de reparo a ser executada mais rapidamente.

  Consulte também a descrição desta opção nas opções de reparo de tabela.

  Para uma descrição do formato de saída, consulte a Seção 4.6.3.5, “Obtendo Informações da Tabela com myisamchk”.

* `--fast`, `-F`

  <table frame="box" rules="all" summary="Propriedades para fast"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--fast</code></td> </tr></tbody></table>

  Verifica apenas as tabelas que não foram fechadas corretamente.

* `--force`, `-f`

  <table frame="box" rules="all" summary="Propriedades para force"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--force</code></td> </tr></tbody></table>

  Executa uma operação de reparo automaticamente se o **myisamchk** encontrar quaisquer erros na tabela. O tipo de reparo é o mesmo especificado com a opção `--recover` ou `-r`.

* `--information`, `-i`

  <table frame="box" rules="all" summary="Propriedades para information"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--information</code></td> </tr></tbody></table>

  Imprime estatísticas informativas sobre a tabela que está sendo verificada.

* `--medium-check`, `-m`

  <table frame="box" rules="all" summary="Propriedades para medium-check"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--medium-check</code></td> </tr></tbody></table>

  Executa uma verificação que é mais rápida do que a operação `--extend-check`. Isso encontra apenas 99,99% de todos os erros, o que deve ser suficiente na maioria dos casos.

* `--read-only`, `-T`

  <table frame="box" rules="all" summary="Propriedades para read-only"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--read-only</code></td> </tr></tbody></table>

  Não marca a tabela como verificada. Isso é útil se você usar o **myisamchk** para verificar uma tabela que está em uso por alguma outra aplicação que não utiliza Locking, como o **mysqld** quando executado com external locking desabilitado.

* `--update-state`, `-U`

  <table frame="box" rules="all" summary="Propriedades para update-state"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--update-state</code></td> </tr></tbody></table>

  Armazena informações no arquivo `.MYI` para indicar quando a tabela foi verificada e se ela crashou. Isso deve ser usado para obter o benefício total da opção `--check-only-changed`, mas você não deve usar esta opção se o servidor **mysqld** estiver usando a tabela e você o estiver executando com external locking desabilitado.