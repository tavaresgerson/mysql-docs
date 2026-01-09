#### 6.6.4.4 Outras opções do myisamchk

O **myisamchk** suporta as seguintes opções para ações além de verificações e reparos de tabelas:

* `--analyze`, `-a`

  <table frame="box" rules="all" summary="Propriedades para analisar"><tbody><tr><th>Formato de linha de comando</th> <td><code>--analyze</code></td> </tr></tbody></table>

  Analise a distribuição dos valores-chave. Isso melhora o desempenho das junções ao permitir que o otimizador de junção escolha melhor a ordem em que as tabelas devem ser unidas e quais índices devem ser usados. Para obter informações sobre a distribuição dos valores-chave, use o comando **myisamchk --description --verbose *`tbl_name`*** ou a instrução `SHOW INDEX FROM tbl_name`.

* `--block-search=offset`, `-b offset`

  <table frame="box" rules="all" summary="Propriedades para block-search"><tbody><tr><th>Formato de linha de comando</th> <td><code>--block-search=offset</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  Encontre o registro ao qual um bloco no intervalo especificado pelo valor de offset pertence.

* `--description`, `-d`

  <table frame="box" rules="all" summary="Propriedades para descrição"><tbody><tr><th>Formato de linha de comando</th> <td><code>--description</code></td> </tr></tbody></table>

  Imprima algumas informações descritivas sobre a tabela. Especificar a opção `--verbose` uma ou duas vezes produz informações adicionais. Veja a Seção 6.6.4.5, “Obtendo informações da tabela com o myisamchk”.

* `--set-auto-increment[=value]`, `-A[value]`
* `--set-auto-increment-table[=table_name]`, `-A[table_name]`

  <table frame="box" rules="all" summary="Propriedades para set-auto-increment"><tbody><tr><th>Formato de linha de comando</th> <td><code>--set-auto-increment[=value]</code> ou <code>--set-auto-increment-table[=table_name]</code></td> </tr></tbody></table>

  Defina o autoincremento para uma tabela específica. O valor padrão é 1.

Forçar a numeração `AUTO_INCREMENT` para novos registros começar com o valor especificado (ou um valor maior, se houver registros existentes com valores `AUTO_INCREMENT` desse tamanho). Se o valor *`valor`* não for especificado, os números `AUTO_INCREMENT` para novos registros começam com o maior valor atualmente na tabela, mais um.

* `--sort-index`, `-S`

  <table frame="box" rules="all" summary="Propriedades para sort-index"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--sort-index</code></td> </tr></tbody></table>

  Ordenar os blocos da árvore de índice em ordem de alto para baixo. Isso otimiza os buscas e torna as varreduras da tabela que usam índices mais rápidas.

* `--sort-records=N`, `-R N`

  <table frame="box" rules="all" summary="Propriedades para sort-records"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--sort-records=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  Ordenar registros de acordo com um índice particular. Isso torna seus dados muito mais localizados e pode acelerar operações de `SELECT` e `ORDER BY` baseadas em intervalo que usam esse índice. (A primeira vez que você usa essa opção para ordenar uma tabela, ela pode ser muito lenta.) Para determinar os números de índice de uma tabela, use `SHOW INDEX`, que exibe os índices de uma tabela na mesma ordem que o **myisamchk** os vê. Os índices são numerados a partir de 1.

  Se as chaves não forem compactadas (`PACK_KEYS=0`), elas têm o mesmo comprimento, então, quando o **myisamchk** ordena e move os registros, ele apenas sobrescreve os deslocamentos de registro no índice. Se as chaves forem compactadas (`PACK_KEYS=1`), o **myisamchk** deve descompactuar os blocos de chave primeiro, então recriar os índices e descompactuar os blocos de chave novamente. (Neste caso, recriar índices é mais rápido do que atualizar os deslocamentos para cada índice.)