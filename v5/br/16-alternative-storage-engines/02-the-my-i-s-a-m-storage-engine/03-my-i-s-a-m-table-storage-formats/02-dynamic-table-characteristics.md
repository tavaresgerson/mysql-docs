#### 15.2.3.2 Características de Tabelas Dinâmicas

O formato de armazenamento dinâmico é usado se uma tabela `MyISAM` contiver quaisquer colunas de comprimento variável (`VARCHAR`, `VARBINARY`, `BLOB` ou `TEXT`), ou se a tabela foi criada com a opção de tabela `ROW_FORMAT=DYNAMIC`.

O formato dinâmico é um pouco mais complexo do que o formato estático porque cada linha tem um cabeçalho que indica seu comprimento. Uma linha pode se tornar fragmentada (armazenada em partes não contíguas) quando é alongada como resultado de um update.

Você pode usar `OPTIMIZE TABLE` ou **myisamchk -r** para desfragmentar uma tabela. Se você tiver colunas de comprimento fixo que acessa ou altera frequentemente em uma tabela que também contém algumas colunas de comprimento variável, pode ser uma boa ideia mover as colunas de comprimento variável para outras tabelas apenas para evitar a fragmentação.

Tabelas de formato dinâmico possuem estas características:

* Todas as colunas string são dinâmicas, exceto aquelas com um comprimento inferior a quatro.

* Cada linha é precedida por um bitmap que indica quais colunas contêm a string vazia (para colunas string) ou zero (para colunas numéricas). Isso não inclui colunas que contenham valores `NULL`. Se uma coluna string tiver um comprimento de zero após a remoção de espaços à direita (trailing space removal), ou se uma coluna numérica tiver um valor de zero, ela é marcada no bitmap e não é salva em disco. Strings não vazias são salvas como um byte de comprimento mais o conteúdo da string.

* Colunas `NULL` exigem espaço adicional na linha para registrar se seus valores são `NULL`. Cada coluna `NULL` ocupa um bit extra, arredondado para o byte mais próximo.

* Geralmente, é necessário muito menos espaço em disco do que para tabelas de comprimento fixo.

* Cada linha usa apenas o espaço necessário. No entanto, se uma linha se tornar maior, ela é dividida em tantas partes quantas forem necessárias, resultando em fragmentação de linha (row fragmentation). Por exemplo, se você fizer um update em uma linha com informações que estendam o comprimento da linha, a linha se torna fragmentada. Neste caso, você pode ter que executar `OPTIMIZE TABLE` ou **myisamchk -r** de tempos em tempos para melhorar a performance. Use **myisamchk -ei** para obter estatísticas da tabela.

* Mais difícil de reconstruir do que tabelas de formato estático após uma falha (crash), porque as linhas podem ser fragmentadas em muitas partes e links (fragmentos) podem estar ausentes.

* O comprimento esperado da linha para linhas de tamanho dinâmico é calculado usando a seguinte expressão:

  ```sql
  3
  + (number of columns + 7) / 8
  + (number of char columns)
  + (packed size of numeric columns)
  + (length of strings)
  + (number of NULL columns + 7) / 8
  ```

Há uma penalidade de 6 bytes para cada link. Uma linha dinâmica é ligada (linked) sempre que um update causa um aumento no tamanho da linha. Cada novo link tem pelo menos 20 bytes, então o próximo aumento provavelmente irá para o mesmo link. Caso contrário, outro link é criado. Você pode encontrar o número de links usando **myisamchk -ed**. Todos os links podem ser removidos com `OPTIMIZE TABLE` ou **myisamchk -r**.