#### 15.2.3.3 Características da Tabela Compressa

O formato de armazenamento comprimido é um formato de leitura somente que é gerado com a ferramenta **myisampack**. As tabelas comprimidas podem ser descomprimidos com **myisamchk**.

As tabelas compactadas têm as seguintes características:

- As tabelas compactadas ocupam muito pouco espaço no disco. Isso minimiza o uso do disco, o que é útil ao usar discos lentos (como os CD-ROMs).

- Cada linha é comprimida separadamente, portanto, há muito pouco overhead de acesso. O cabeçalho de uma linha ocupa de um a três bytes, dependendo da linha maior da tabela. Cada coluna é comprimida de maneira diferente. Geralmente, há uma árvore de Huffman diferente para cada coluna. Alguns dos tipos de compressão são:

  - Compressão de espaço de sufixo.

  - Prefixa a compressão de espaço.

  - Os números com valor zero são armazenados usando um bit.

  - Se os valores em uma coluna de inteiro tiverem uma faixa pequena, a coluna é armazenada usando o tipo menor possível. Por exemplo, uma coluna `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") (oito bytes) pode ser armazenada como uma coluna `TINYINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") (um byte) se todos os seus valores estiverem na faixa de `-128` a `127`.

  - Se uma coluna tiver apenas um pequeno conjunto de valores possíveis, o tipo de dados é convertido para `ENUM`.

  - Uma coluna pode usar qualquer combinação dos tipos de compressão anteriores.

- Pode ser usado para linhas de comprimento fixo ou dinâmico.

Nota

Embora uma tabela compactada seja apenas de leitura, e você não possa, portanto, atualizar ou adicionar linhas na tabela, as operações de DDL (Data Definition Language) ainda são válidas. Por exemplo, você ainda pode usar `DROP` para excluir a tabela e `TRUNCATE TABLE` para esvaziar a tabela.
