#### 18.2.3.2 Características de Tabelas Dinâmicas

O formato de armazenamento dinâmico é usado se uma tabela `MyISAM` contiver colunas de comprimento variável (`VARCHAR`, `VARBINARY`, `BLOB` ou `TEXT`), ou se a tabela foi criada com a opção de tabela `ROW_FORMAT=DYNAMIC`.

O formato dinâmico é um pouco mais complexo que o formato estático porque cada linha tem um cabeçalho que indica quanto ela tem de comprimento. Uma linha pode se fragmentar (guardada em pedaços não contíguos) quando ela é feita mais longa como resultado de uma atualização.

Você pode usar `OPTIMIZE TABLE` ou **myisamchk -r** para desfragmentar uma tabela. Se você tiver colunas de comprimento fixo que você acessa ou altera frequentemente em uma tabela que também contém algumas colunas de comprimento variável, pode ser uma boa ideia mover as colunas de comprimento variável para outras tabelas apenas para evitar a fragmentação.

Tabelas de formato dinâmico têm essas características:

* Todas as colunas de string são dinâmicas, exceto aquelas com um comprimento menor que quatro.

* Cada linha é precedida por um bitmap que indica quais colunas contêm a string vazia (para colunas de string) ou zero (para colunas numéricas). Isso não inclui colunas que contêm valores `NULL`. Se uma coluna de string tiver um comprimento de zero após a remoção do espaço final, ou uma coluna numérica tiver um valor de zero, ela é marcada no bitmap e não salva no disco. Strings não vazias são salvas como um byte de comprimento mais o conteúdo da string.

* Colunas `NULL` requerem espaço adicional na linha para registrar se seus valores são `NULL`. Cada coluna `NULL` ocupa um bit extra, arredondado para o byte mais próximo.

* Geralmente, é necessário muito menos espaço em disco do que para tabelas de comprimento fixo.

* Cada linha usa apenas o espaço necessário. No entanto, se uma linha se tornar maior, ela será dividida em tantas partes quanto for necessário, resultando na fragmentação da linha. Por exemplo, se você atualizar uma linha com informações que estendem o comprimento da linha, a linha se tornará fragmentada. Nesse caso, você pode precisar executar `OPTIMIZE TABLE` ou **myisamchk -r** de tempos em tempos para melhorar o desempenho. Use **myisamchk -ei** para obter estatísticas da tabela.

* Mais difícil de reconstruir do que tabelas com formato estático após um crash, porque as linhas podem ser fragmentadas em muitas partes e os links (fragmentos) podem estar ausentes.

* O comprimento esperado da linha para linhas de tamanho dinâmico é calculado usando a seguinte expressão:

  ```
  3
  + (number of columns + 7) / 8
  + (number of char columns)
  + (packed size of numeric columns)
  + (length of strings)
  + (number of NULL columns + 7) / 8
  ```

  Há uma penalidade de 6 bytes por cada link. Uma linha dinâmica é vinculada sempre que uma atualização causa um alargamento da linha. Cada novo link tem pelo menos 20 bytes, então o próximo alargamento provavelmente vai no mesmo link. Se não, outro link é criado. Você pode encontrar o número de links usando **myisamchk -ed**. Todos os links podem ser removidos com `OPTIMIZE TABLE` ou **myisamchk -r**.