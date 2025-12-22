#### 6.6.4.4 Outras opções

`myisamchk` suporta as seguintes opções para ações que não sejam verificações e reparos de tabelas:

- `--analyze`, `-a`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--analyze</code>]]</td> </tr></tbody></table>

Analisar a distribuição dos valores-chave. Isso melhora o desempenho da junção, permitindo que o otimizador de junção escolha melhor a ordem em que se juntar às tabelas e quais índices deve usar. Para obter informações sobre a distribuição de chaves, use um comando **myisamchk --description --verbose `tbl_name`** ou a instrução `SHOW INDEX FROM tbl_name`.

- `--block-search=offset`, `-b offset`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--block-search=offset</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr></tbody></table>

Encontre o registro a que pertence um bloco no deslocamento dado.

- `--description`, `-d`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--description</code>]]</td> </tr></tbody></table>

Especificar a opção `--verbose` uma ou duas vezes produz informações adicionais.

- `--set-auto-increment[=value]`, `-A[value]`

Forçar a numeração `AUTO_INCREMENT` para novos registros a começar no valor dado (ou maior, se houver registros existentes com valores `AUTO_INCREMENT` tão grandes). Se `value` não for especificado, os números `AUTO_INCREMENT` para novos registros começarão com o maior valor atualmente na tabela, mais um.

- `--sort-index`, `-S`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--sort-index</code>]]</td> </tr></tbody></table>

Isso otimiza as buscas e torna as varreduras de tabelas que usam índices mais rápidas.

- `--sort-records=N`, `-R N`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--sort-records=#</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr></tbody></table>

Classificar registros de acordo com um índice específico. Isso torna seus dados muito mais localizados e pode acelerar as operações baseadas em intervalos `SELECT` e `ORDER BY` que usam esse índice. (A primeira vez que você usa essa opção para classificar uma tabela, ela pode ser muito lenta.) Para determinar os números de índice de uma tabela, use `SHOW INDEX`, que exibe os índices de uma tabela na mesma ordem em que `myisamchk` os vê. Os índices são numerados começando com 1.

Se as chaves não estão embaladas (`PACK_KEYS=0`), elas têm o mesmo comprimento, então quando `myisamchk` classifica e move registros, ele apenas sobrescreve offsets de registro no índice. Se as chaves estão embaladas (`PACK_KEYS=1`), `myisamchk` deve desembalar blocos de chave primeiro, depois recriar índices e embalar os blocos de chave novamente. (Neste caso, recriar índices é mais rápido do que atualizar offsets para cada índice.)
