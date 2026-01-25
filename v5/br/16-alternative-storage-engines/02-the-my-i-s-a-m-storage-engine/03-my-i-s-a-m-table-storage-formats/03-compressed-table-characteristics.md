#### 15.2.3.3 Características de Tabelas Comprimidas

O formato de armazenamento comprimido é um formato somente leitura (`read-only`) que é gerado com a ferramenta **myisampack**. Tabelas comprimidas podem ser descomprimidas com **myisamchk**.

Tabelas comprimidas possuem as seguintes características:

* Tabelas comprimidas ocupam muito pouco espaço em disco. Isso minimiza o uso de disco, o que é útil ao usar discos lentos (como CD-ROMs).

* Cada linha é comprimida separadamente, então há muito pouco `overhead` de acesso. O cabeçalho para uma linha ocupa de um a três `bytes`, dependendo da maior linha da tabela. Cada coluna é comprimida de forma diferente. Geralmente, há uma `Huffman tree` diferente para cada coluna. Alguns dos tipos de compressão são:

  + Compressão de espaço de sufixo.
  + Compressão de espaço de prefixo.
  + Números com valor zero são armazenados usando um `bit`.
  + Se os valores em uma coluna `integer` tiverem um pequeno intervalo (`range`), a coluna é armazenada usando o menor tipo possível. Por exemplo, uma coluna `BIGINT` (oito `bytes`) pode ser armazenada como uma coluna `TINYINT` (um `byte`) se todos os seus valores estiverem no intervalo de `-128` a `127`.

  + Se uma coluna tiver apenas um pequeno conjunto de valores possíveis, o `data type` é convertido para `ENUM`.

  + Uma coluna pode usar qualquer combinação dos tipos de compressão precedentes.

* Pode ser usada para linhas de comprimento fixo (`fixed-length`) ou comprimento dinâmico (`dynamic-length`).

Note

Enquanto uma tabela comprimida é somente leitura (`read only`), e, portanto, você não pode atualizar ou adicionar linhas na tabela, as operações DDL (`Data Definition Language`) ainda são válidas. Por exemplo, você ainda pode usar `DROP` para descartar a tabela, e `TRUNCATE TABLE` para esvaziar a tabela.