#### 4.6.3.4 Outras Opções do myisamchk

O **myisamchk** suporta as seguintes opções para ações diferentes de verificações e reparos de tabela:

* `--analyze`, `-a`

  <table frame="box" rules="all" summary="Propriedades para analyze"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--analyze</code></td> </tr></tbody></table>

  Analisa a distribuição dos valores de key. Isso melhora a performance do JOIN, permitindo que o otimizador de JOIN escolha melhor a ordem de junção das tabelas e quais Indexes ele deve usar. Para obter informações sobre a distribuição da key, use o comando **myisamchk --description --verbose *`tbl_name`*** ou a instrução `SHOW INDEX FROM tbl_name`.

* `--block-search=offset`, `-b offset`

  <table frame="box" rules="all" summary="Propriedades para block-search"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--block-search=offset</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  Encontra o registro ao qual pertence um bloco no dado offset.

* `--description`, `-d`

  <table frame="box" rules="all" summary="Propriedades para description"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--description</code></td> </tr></tbody></table>

  Imprime algumas informações descritivas sobre a tabela. Especificar a opção `--verbose` uma ou duas vezes produz informações adicionais. Consulte a Seção 4.6.3.5, “Obtendo Informações da Tabela com myisamchk”.

* `--set-auto-increment[=value]`, `-A[value]`

  Força a numeração `AUTO_INCREMENT` para novos registros a começar no valor fornecido (ou superior, se houver registros existentes com valores `AUTO_INCREMENT` grandes como este). Se *`value`* não for especificado, os números `AUTO_INCREMENT` para novos registros começarão com o maior valor atualmente na tabela, mais um.

* `--sort-index`, `-S`

  <table frame="box" rules="all" summary="Propriedades para sort-index"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--sort-index</code></td> </tr></tbody></table>

  Classifica os blocos da árvore de Index em ordem de alta para baixa (high-low order). Isso otimiza as buscas (seeks) e torna mais rápidas as varreduras de tabela (table scans) que usam Indexes.

* `--sort-records=N`, `-R N`

  <table frame="box" rules="all" summary="Propriedades para sort-records"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--sort-records=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  Classifica os registros de acordo com um Index específico. Isso torna seus dados muito mais localizados e pode acelerar operações `SELECT` e `ORDER BY` baseadas em range que usam este Index. (Na primeira vez que você usa esta opção para classificar uma tabela, pode ser muito lento.) Para determinar os números de Index de uma tabela, use `SHOW INDEX`, que exibe os Indexes de uma tabela na mesma ordem que o **myisamchk** os vê. Os Indexes são numerados a partir de 1.

  Se as keys não estiverem empacotadas (`PACK_KEYS=0`), elas terão o mesmo comprimento, então, quando o **myisamchk** classifica e move registros, ele apenas sobrescreve os offsets de registro no Index. Se as keys estiverem empacotadas (`PACK_KEYS=1`), o **myisamchk** deve desempacotar os key blocks primeiro, depois recriar os Indexes e empacotar os key blocks novamente. (Neste caso, recriar Indexes é mais rápido do que atualizar offsets para cada Index.)
