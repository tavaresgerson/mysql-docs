#### 4.6.3.4 Outras opções do myisamchk

O **myisamchk** suporta as seguintes opções para ações além das verificações e reparos de tabelas:

- `--analyze`, `-a`

  <table frame="box" rules="all" summary="Propriedades para análise"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--analyze</code>]]</td> </tr></tbody></table>

  Analise a distribuição dos valores-chave. Isso melhora o desempenho da junção, permitindo que o otimizador de junção escolha melhor a ordem em que as tabelas devem ser unidas e quais índices devem ser usados. Para obter informações sobre a distribuição dos valores-chave, use o comando **myisamchk --description --verbose *`tbl_name`*** ou a instrução `SHOW INDEX FROM tbl_name`.

- `--block-search=offset`, `-b offset`

  <table frame="box" rules="all" summary="Propriedades para pesquisa por bloco"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--block-search=offset</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  Encontre o registro ao qual um bloco com o deslocamento especificado pertence.

- `--description`, `-d`

  <table frame="box" rules="all" summary="Propriedades para descrição"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--description</code>]]</td> </tr></tbody></table>

  Imprima algumas informações descritivas sobre a tabela. Especificar a opção `--verbose` uma ou duas vezes produz informações adicionais. Veja a Seção 4.6.3.5, “Obtendo Informações da Tabela com myisamchk”.

- `--set-auto-increment[=valor]`, `-A[valor]`

  Forçar a numeração `AUTO_INCREMENT` para novos registros começar no valor especificado (ou maior, se houver registros existentes com valores `AUTO_INCREMENT` tão grandes). Se o *`valor`* não for especificado, os números `AUTO_INCREMENT` para novos registros começarão com o maior valor atualmente na tabela, mais um.

- `--sort-index`, `-S`

  <table frame="box" rules="all" summary="Propriedades para índice de classificação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--sort-index</code>]]</td> </tr></tbody></table>

  Sorteie os blocos da árvore de índice em ordem de alto para baixo. Isso otimiza as buscas e torna os varreduras da tabela que usam índices mais rápidas.

- `--sort-records=N`, `-R N`

  <table frame="box" rules="all" summary="Propriedades para registros de classificação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--sort-records=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  Ordene os registros de acordo com um índice específico. Isso torna seus dados muito mais localizados e pode acelerar as operações de `SELECT` e `ORDER BY` baseadas em intervalo que utilizam esse índice. (A primeira vez que você usar essa opção para ordenar uma tabela, ela pode ser muito lenta.) Para determinar os números dos índices de uma tabela, use `SHOW INDEX`, que exibe os índices de uma tabela na mesma ordem que o **myisamchk** os vê. Os índices são numerados a partir do número 1.

  Se as chaves não forem compactadas (`PACK_KEYS=0`), elas terão o mesmo tamanho, então, quando o **myisamchk** ordena e move os registros, ele simplesmente sobrescreve os deslocamentos dos registros no índice. Se as chaves forem compactadas (`PACK_KEYS=1`), o **myisamchk** deve descompactuar os blocos de chave primeiro, depois recriar os índices e descompactuar os blocos de chave novamente. (Neste caso, recriar os índices é mais rápido do que atualizar os deslocamentos para cada índice.)
