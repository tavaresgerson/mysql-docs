#### 6.6.4.4 Outras opções do `myisamchk`

O `myisamchk` suporta as seguintes opções para ações além de verificações e reparos de tabelas:

*  `--analyze`, `-a`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--analyze</code></td> </tr></tbody></table>

  Analise a distribuição dos valores chave. Isso melhora o desempenho das junções ao permitir que o otimizador de junção escolha melhor a ordem em que as tabelas devem ser unidas e quais índices devem ser usados. Para obter informações sobre a distribuição dos valores chave, use o comando `myisamchk --description --verbose 'tbl_name'` ou a declaração `SHOW INDEX FROM tbl_name`.
*  `--block-search=offset`, `-b offset`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--block-search=offset</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  Encontre o registro ao qual um bloco no valor especificado pertence.
*  `--description`, `-d`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--description</code></td> </tr></tbody></table>

  Imprima algumas informações descritivas sobre a tabela. Especificar a opção `--verbose` uma ou duas vezes produz informações adicionais. Veja a Seção 6.6.4.5, “Obtendo informações da tabela com myisamchk”.
*  `--set-auto-increment[=value]`, `-A[value]`

  Forçar a numeração `AUTO_INCREMENT` para novos registros a começar no valor especificado (ou maior, se houver registros existentes com valores `AUTO_INCREMENT` dessa magnitude). Se *`value`* não for especificado, os números `AUTO_INCREMENT` para novos registros começam com o maior valor atualmente na tabela, mais um.
*  `--sort-index`, `-S`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--sort-index</code></td> </tr></tbody></table>

  Ordem os blocos da árvore de índices em ordem de alta para baixa. Isso otimiza os buscas e torna as varreduras da tabela que usam índices mais rápidas.
*  `--sort-records=N`, `-R N`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--sort-records=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

Organize os registros de acordo com um índice específico. Isso torna seus dados muito mais localizados e pode acelerar operações de `SELECT` e `ORDER BY` baseadas em intervalo que utilizam esse índice. (A primeira vez que você usar essa opção para ordenar uma tabela, ela pode ser muito lenta.) Para determinar os números de índice de uma tabela, use `SHOW INDEX`, que exibe os índices de uma tabela na mesma ordem que o `myisamchk` os vê. Os índices são numerados a partir do 1.

Se as chaves não forem compactadas (`PACK_KEYS=0`), elas têm o mesmo comprimento, então, quando o `myisamchk` ordena e move os registros, ele apenas sobrescreve os deslocamentos de registro no índice. Se as chaves forem compactadas (`PACK_KEYS=1`), o `myisamchk` deve descompactuar os blocos de chave primeiro, depois recriar os índices e descompactuar os blocos de chave novamente. (Neste caso, recriar os índices é mais rápido do que atualizar os deslocamentos para cada índice.)