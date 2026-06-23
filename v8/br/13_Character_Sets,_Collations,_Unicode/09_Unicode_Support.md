## 12.9 Suporte a Unicode

O Padrão Unicode inclui caracteres do Plano Multilíngue Básico (BMP) e caracteres suplementares que se encontram fora do BMP. Esta seção descreve o suporte para Unicode no MySQL. Para informações sobre o próprio Padrão Unicode, visite o site do [Consórcio Unicode][(http://www.unicode.org/)].

Os caracteres BMP têm essas características:

* Seus valores de ponto de código estão entre 0 e 65535 (ou `U+0000` e `U+FFFF`).

* Eles podem ser codificados em uma codificação de comprimento variável, usando 8, 16 ou 24 bits (1 a 3 bytes).

* Eles podem ser codificados em uma codificação de comprimento fixo usando 16 bits (2 bytes).

* São suficientes para quase todos os caracteres em idiomas importantes.

Os caracteres suplementares estão fora do BMP:

* Seus valores de ponto de código estão entre `U+10000` e `U+10FFFF`).

* O suporte Unicode para caracteres suplementares exige conjuntos de caracteres que tenham um alcance fora dos caracteres BMP e, portanto, ocupem mais espaço do que os caracteres BMP (até 4 bytes por caractere).

O método UTF-8 (Formato de Transformação Unicode com unidades de 8 bits) para codificação de dados Unicode é implementado de acordo com o RFC 3629, que descreve sequências de codificação que variam de um a quatro bytes. A ideia do UTF-8 é que vários caracteres Unicode são codificados usando sequências de bytes de diferentes comprimentos:

* As letras latinas básicas, dígitos e sinais de pontuação utilizam um byte.

* A maioria das letras de escrita europeias e do Oriente Médio cabem em uma sequência de 2 bytes: letras latinas estendidas (com tilde, macron, agudo, grave e outros acentos), cirílico, grego, armênio, hebraico, árabe, siríaco e outros.

* Os ideogramas coreanos, chineses e japoneses utilizam sequências de 3 ou 4 bytes.

O MySQL suporta esses conjuntos de caracteres Unicode:

* `utf8mb4`: Uma codificação UTF-8 do conjunto de caracteres Unicode, usando de um a quatro bytes por caractere.

* `utf8mb3`: Uma codificação UTF-8 do conjunto de caracteres Unicode usando de um a três bytes por caractere. Este conjunto de caracteres é descontinuado no MySQL 8.0, e você deve usar `utf8mb4` em vez disso.

* `utf8`: Um alias para `utf8mb3`. No MySQL 8.0, este alias é desatualizado; use `utf8mb4` em vez disso. `utf8` é esperado em uma versão futura para se tornar um alias para `utf8mb4`.

* `ucs2`: A codificação UCS-2 do conjunto de caracteres Unicode usando dois bytes por caractere. Desatualizada no MySQL 8.0.28; você deve esperar que o suporte a este conjunto de caracteres seja removido em uma versão futura.

* `utf16`: O codificação UTF-16 para o conjunto de caracteres Unicode que utiliza dois ou quatro bytes por caractere. Como `ucs2`, mas com uma extensão para caracteres suplementares.

* `utf16le`: O codificação UTF-16LE para o conjunto de caracteres Unicode. Como `utf16`, mas little-endian em vez de big-endian.

* `utf32`: A codificação UTF-32 para o conjunto de caracteres Unicode, usando quatro bytes por caractere.

Nota

O conjunto de caracteres `utf8mb3` é desatualizado e você deve esperar que ele seja removido em um lançamento futuro do MySQL. Por favor, use `utf8mb4` em vez disso. `utf8` atualmente é um alias para `utf8mb3`, mas agora é desatualizado como tal, e `utf8` é esperado que, posteriormente, se torne uma referência para `utf8mb4`. A partir do MySQL 8.0.28, `utf8mb3` também é exibido no lugar de `utf8` em colunas de tabelas do Schema de Informações e na saída das declarações SQL `SHOW`.

Além disso, no MySQL 8.0.30, todas as colatões que usam o prefixo `utf8_` são renomeadas usando o prefixo `utf8mb3_`.

Para evitar ambiguidades sobre o significado de `utf8`, considere especificar explicitamente `utf8mb4` para referências de conjunto de caracteres.

A Tabela 12.2, “Características gerais do conjunto de caracteres Unicode”, resume as características gerais dos conjuntos de caracteres Unicode suportados pelo MySQL.

**Tabela 12.2 Características gerais do conjunto de caracteres Unicode**

<table summary="General characteristics of Unicode character sets."><col style="width: 20%"/><col style="width: 40%"/><col style="width: 40%"/><thead><tr> <th scope="col">Conjunto de caracteres</th> <th scope="col">Caracteres suportados</th> <th scope="col">Armazenamento necessário por caractere</th> </tr></thead><tbody><tr> <th scope="row"><code>utf8mb3</code>,<code>utf8</code>(descontinuado)</th> <td>Apenas BMP</td> <td>1, 2 ou 3 bytes</td> </tr><tr> <th scope="row"><code>ucs2</code></th> <td>BMP only</td> <td>2 bytes</td> </tr><tr> <th scope="row"><code>utf8mb4</code></th> <td>BMP e suplementar</td> <td>1, 2, 3 ou 4 bytes</td> </tr><tr> <th scope="row"><code>utf16</code></th> <td>BMP e suplementar</td> <td>2 ou 4 bytes</td> </tr><tr> <th scope="row"><code>utf16le</code></th> <td>BMP e suplementar</td> <td>2 ou 4 bytes</td> </tr><tr> <th scope="row"><code>utf32</code></th> <td>BMP and supplementary</td> <td>4 bytes</td> </tr></tbody></table>

Os caracteres fora do BMP são comparados como `REPLACEMENT CHARACTER` e convertidos para `'?'` quando convertidos para um conjunto de caracteres Unicode que suporta apenas caracteres do BMP (`utf8mb3` ou `ucs2`).

Se você usar conjuntos de caracteres que suportam caracteres suplementares e, portanto, são “mais amplos” do que os conjuntos de caracteres `utf8mb3` e `ucs2` que só suportam BMP, há potenciais problemas de incompatibilidade para suas aplicações; veja a Seção 12.9.8, “Conversão entre conjuntos de caracteres Unicode de 3 bytes e 4 bytes”. Essa seção também descreve como converter tabelas do (3-byte) `utf8mb3` para o (4-byte) `utf8mb4`, e quais restrições podem ser aplicadas ao fazer isso.

Um conjunto semelhante de ordenações está disponível para a maioria dos conjuntos de caracteres Unicode. Por exemplo, cada um deles tem uma ordenação dinamarquesa, cujos nomes são `utf8mb4_danish_ci`, `utf8mb3_danish_ci` (descontinuada), `utf8_danish_ci` (descontinuada), `ucs2_danish_ci`, `utf16_danish_ci` e `utf32_danish_ci`. A exceção é `utf16le`, que tem apenas duas ordenações. Para informações sobre ordenações Unicode e suas propriedades diferenciadoras, incluindo propriedades de ordenação para caracteres suplementares, consulte a Seção 12.10.1, “Sistemas de Caracteres Unicode”.

A implementação do MySQL de UCS-2, UTF-16 e UTF-32 armazena caracteres na ordem de bytes big-endian e não usa uma marca de ordem de bytes (BOM) no início dos valores. Outros sistemas de banco de dados podem usar a ordem de bytes little-endian ou uma BOM. Nesses casos, a conversão dos valores precisa ser realizada ao transferir dados entre esses sistemas e o MySQL. A implementação do UTF-16LE é little-endian.

O MySQL não utiliza BOM para valores UTF-8.

Os aplicativos do cliente que se comunicam com o servidor usando Unicode devem definir o conjunto de caracteres do cliente de acordo (por exemplo, emitindo uma declaração `SET NAMES 'utf8mb4'`). Alguns conjuntos de caracteres não podem ser usados como conjunto de caracteres do cliente. Tentar usá-los com [`SET NAMES`](set-names.html "15.7.6.3 SET NAMES Statement") ou [`SET CHARACTER SET`](set-character-set.html "15.7.6.2 SET CHARACTER SET Statement") produz um erro. Veja Conjuntos de caracteres do cliente impermissíveis.

As seções a seguir fornecem informações adicionais sobre os conjuntos de caracteres Unicode no MySQL.

### 12.9.1 Conjunto de Caracteres utf8mb4 (Codificação Unicode UTF-8 de 4 bytes)

O conjunto de caracteres `utf8mb4` tem essas características:

* Suporta BMP e caracteres suplementares.
* Requer um máximo de quatro bytes por caractere multibyte.

`utf8mb4` contrasta com o conjunto de caracteres `utf8mb3`, que suporta apenas caracteres BMP e utiliza um máximo de três bytes por caractere:

* Para um caractere BMP, `utf8mb4` e `utf8mb3` têm características de armazenamento idênticas: os mesmos valores de código, mesma codificação, mesma extensão.

* Para um caractere suplementar, o `utf8mb4` requer quatro bytes para armazená-lo, enquanto o `utf8mb3` não pode armazenar o caractere de forma alguma. Ao converter as colunas `utf8mb3` para `utf8mb4`, você não precisa se preocupar em converter caracteres suplementares, pois não há nenhum.

`utf8mb4` é um superconjunto de `utf8mb3`, portanto, para uma operação como a concatenação a seguir, o resultado tem o conjunto de caracteres `utf8mb4` e a ordenação de `utf8mb4_col`:

```
SELECT CONCAT(utf8mb3_col, utf8mb4_col);
```

Da mesma forma, a seguinte comparação na cláusula `WHERE` funciona de acordo com a ordenação de `utf8mb4_col`:

```
SELECT * FROM utf8mb3_tbl, utf8mb4_tbl
WHERE utf8mb3_tbl.utf8mb3_col = utf8mb4_tbl.utf8mb4_col;
```

Para obter informações sobre o armazenamento de tipos de dados relacionados a conjuntos de caracteres multibytes, consulte os Requisitos de Armazenamento de Tipo de String.

### 12.9.2 O conjunto de caracteres utf8mb3 (codificação Unicode UTF-8 de 3 bytes)

O conjunto de caracteres `utf8mb3` tem essas características:

* Suporta apenas caracteres BMP (sem suporte para caracteres suplementares)

* Requer no máximo três bytes por caractere multibyte.

Aplicações que utilizam dados UTF-8, mas que exigem suporte para caracteres adicionais, devem usar `utf8mb4` em vez de `utf8mb3` (consulte a Seção 12.9.1, “O conjunto de caracteres utf8mb4 (codificação Unicode de UTF-8 de 4 bytes”)”).

Exatamente o mesmo conjunto de caracteres está disponível em `utf8mb3` e `ucs2`. Isso significa que eles têm o mesmo repertório.

Nota

O conjunto de caracteres recomendado para o MySQL é `utf8mb4`. Todas as novas aplicações devem usar `utf8mb4`.

O conjunto de caracteres `utf8mb3` é desatualizado. `utf8mb3` continua sendo suportado durante a vida útil das séries de releases do MySQL 8.0.x e subsequentes LTS, bem como no MySQL 8.0.

Espere que o `utf8mb3` seja removido em uma versão futura do MySQL.

Como a mudança de conjuntos de caracteres pode ser uma tarefa complexa e demorada, você deve começar a se preparar para essa mudança agora, usando `utf8mb4` para novos aplicativos. Para obter orientações na conversão de aplicativos existentes que utilizam utfmb3, consulte a Seção 12.9.8, “Conversão entre conjuntos de caracteres Unicode de 3 bytes e 4 bytes”.

`utf8mb3` pode ser usado em cláusulas de `CHARACTER SET`, e `utf8mb3_collation_substring` em cláusulas de `COLLATE`, onde *`collation_substring`* é `bin`, `czech_ci`, `danish_ci`, `esperanto_ci`, `estonian_ci`, e assim por diante. Por exemplo:

```
CREATE TABLE t (s1 CHAR(1)) CHARACTER SET utf8mb3;
SELECT * FROM t WHERE s1 COLLATE utf8mb3_general_ci = 'x';
DECLARE x VARCHAR(5) CHARACTER SET utf8mb3 COLLATE utf8mb3_danish_ci;
SELECT CAST('a' AS CHAR CHARACTER SET utf8mb4) COLLATE utf8mb4_czech_ci;
```

Antes do MySQL 8.0.29, as instâncias de `utf8mb3` em declarações eram convertidas para `utf8`. No MySQL 8.0.30 e versões posteriores, o inverso é verdadeiro, de modo que em declarações como `SHOW CREATE TABLE` ou `SELECT CHARACTER_SET_NAME FROM INFORMATION_SCHEMA.COLUMNS` ou `SELECT COLLATION_NAME FROM INFORMATION_SCHEMA.COLUMNS`, os usuários veem o nome do conjunto de caracteres ou da correção pré-fixado com `utf8mb3` ou `utf8mb3_`.

`utf8mb3` também é válido (mas desatualizado) em contextos que não são cláusulas de `CHARACTER SET`. Por exemplo:

```
mysqld --character-set-server=utf8mb3
```

```
SET NAMES 'utf8mb3'; /* and other SET statements that have similar effect */
SELECT _utf8mb3 'a';
```

Para obter informações sobre o armazenamento de tipos de dados relacionados a conjuntos de caracteres multibytes, consulte os Requisitos de Armazenamento de Tipo de String.

### 12.9.3 O conjunto de caracteres utf8 (alias descontinuado para utf8mb3)

`utf8` foi usado pelo MySQL no passado como um alias para o conjunto de caracteres `utf8mb3`, mas esse uso já é desaconselhado; no MySQL 8.0, as declarações e colunas dos conjuntos de tabelas `INFORMATION_SCHEMA` mostram `utf8mb3` em vez disso. Para mais informações, consulte a Seção 12.9.2, “O conjunto de caracteres utf8mb3 (codificação Unicode UTF-8 de 3 bytes)”).

Nota

O conjunto de caracteres recomendado para o MySQL é `utf8mb4`. Todas as novas aplicações devem usar `utf8mb4`.

O conjunto de caracteres `utf8mb3` é desatualizado. `utf8mb3` continua sendo suportado para a vida útil das séries de releases LTS do MySQL 8.0.x e seguintes, bem como no MySQL 8.0.

Espere que o `utf8mb3` seja removido em uma futura versão principal do MySQL.

Como a mudança de conjuntos de caracteres pode ser uma tarefa complexa e demorada, você deve começar a se preparar para essa mudança agora, usando `utf8mb4` para novos aplicativos. Para obter orientações na conversão de aplicativos existentes que utilizam utfmb3, consulte a Seção 12.9.8, “Conversão entre conjuntos de caracteres Unicode de 3 bytes e 4 bytes”.

### 12.9.4 O Conjunto de Caracteres ucs2 (Codificação Unicode UCS-2)

Nota

O conjunto de caracteres `ucs2` é descontinuado no MySQL 8.0.28; espere que ele seja removido em um lançamento futuro do MySQL. Por favor, use `utf8mb4` em vez disso.

No UCS-2, cada caractere é representado por um código Unicode de 2 bytes, com o byte mais significativo primeiro. Por exemplo: `LATIN CAPITAL LETTER A` tem o código `0x0041` e é armazenado como uma sequência de 2 bytes: `0x00 0x41`. `CYRILLIC SMALL LETTER YERU` (Unicode `0x044B`) é armazenado como uma sequência de 2 bytes: `0x04 0x4B`. Para caracteres Unicode e seus códigos, consulte o site do [Consórcio Unicode][(http://www.unicode.org/)].

O conjunto de caracteres `ucs2` tem essas características:

* Suporta apenas caracteres BMP (sem suporte para caracteres suplementares)

* Usa uma codificação de 16 bits de comprimento fixo e requer dois bytes por caractere.

### 12.9.5 O conjunto de caracteres utf16 (codificação Unicode UTF-16)

O conjunto de caracteres `utf16` é o conjunto de caracteres `ucs2`, com uma extensão que permite a codificação de caracteres suplementares:

* Para um caractere BMP, `utf16` e `ucs2` têm características de armazenamento idênticas: os mesmos valores de código, mesma codificação, mesma extensão.

* Para um caractere suplementar, `utf16` tem uma sequência especial para representar o caractere usando 32 bits. Isso é chamado de mecanismo de "surrogate": Para um número maior que `0xffff`, tome 10 bits e adicione-os a `0xd800` e coloque-os na primeira palavra de 16 bits, tome mais 10 bits e adicione-os a `0xdc00` e coloque-os na próxima palavra de 16 bits. Consequentemente, todos os caracteres suplementares requerem 32 bits, onde os primeiros 16 bits são um número entre `0xd800` e `0xdbff`, e os últimos 16 bits são um número entre `0xdc00` e `0xdfff`. Exemplos estão na Seção [15.5 Área de Surrogates](http://www.unicode.org/versions/Unicode4.0.0/ch15.pdf) do documento Unicode 4.0.

Como o `utf16` suporta substitutos e o `ucs2` não, há um controle de validade que se aplica apenas em `utf16`: Você não pode inserir um substituto superior sem um inferior, ou vice-versa. Por exemplo:

```
INSERT INTO t (ucs2_column) VALUES (0xd800); /* legal */
INSERT INTO t (utf16_column)VALUES (0xd800); /* illegal */
```

Não há verificação de validade para caracteres que são tecnicamente válidos, mas não são verdadeiros Unicode (ou seja, caracteres que o Unicode considera como "pontos de código não atribuídos" ou caracteres de "uso privado" ou até mesmo "ilegais", como `0xffff`). Por exemplo, como o `U+F8FF` é o logotipo da Apple, isso é legal:

```
INSERT INTO t (utf16_column)VALUES (0xf8ff); /* legal */
```

Não se pode esperar que esses personagens signifiquem a mesma coisa para todos.

Como o MySQL deve permitir o caso pior (que um caractere exija quatro bytes), o comprimento máximo de uma coluna ou índice `utf16` é apenas metade do comprimento máximo para uma coluna ou índice `ucs2`. Por exemplo, o comprimento máximo de uma chave de índice de tabela `MEMORY` é de 3072 bytes, então essas declarações criam tabelas com os índices mais longos permitidos para as colunas `ucs2` e `utf16`:

```
CREATE TABLE tf (s1 VARCHAR(1536) CHARACTER SET ucs2) ENGINE=MEMORY;
CREATE INDEX i ON tf (s1);
CREATE TABLE tg (s1 VARCHAR(768) CHARACTER SET utf16) ENGINE=MEMORY;
CREATE INDEX i ON tg (s1);
```

### 12.9.6 O conjunto de caracteres utf16le (codificação Unicode UTF-16LE)

Isto é o mesmo que `utf16`, mas é little-endian e não big-endian.

### 12.9.7 O conjunto de caracteres utf32 (codificação Unicode UTF-32)

O conjunto de caracteres `utf32` tem comprimento fixo (como `ucs2` e ao contrário de `utf16`). `utf32` usa 32 bits para cada caractere, ao contrário de `ucs2` (que usa 16 bits para cada caractere) e ao contrário de `utf16` (que usa 16 bits para alguns caracteres e 32 bits para outros).

`utf32` ocupa o dobro do espaço de `ucs2` e mais espaço do que `utf16`, mas `utf32` tem a mesma vantagem de `ucs2` de ser previsível para armazenamento: O número de bytes necessários para `utf32` é igual ao número de caracteres vezes

4. Além disso, ao contrário de `utf16`, não há truques para codificação em `utf32`, portanto, o valor armazenado é igual ao valor do código.

Para demonstrar como essa última vantagem é útil, aqui está um exemplo que mostra como determinar um valor de `utf8mb4` dado o valor do código `utf32`:

```
/* Assume code value = 100cc LINEAR B WHEELED CHARIOT */
CREATE TABLE tmp (utf32_col CHAR(1) CHARACTER SET utf32,
                  utf8mb4_col CHAR(1) CHARACTER SET utf8mb4);
INSERT INTO tmp VALUES (0x000100cc,NULL);
UPDATE tmp SET utf8mb4_col = utf32_col;
SELECT HEX(utf32_col),HEX(utf8mb4_col) FROM tmp;
```

O MySQL é muito tolerante em relação à adição de caracteres Unicode não atribuídos ou caracteres da área de uso privado. Na verdade, há apenas um controle de validade para `utf32`: Nenhum valor de código pode ser maior que `0x10ffff`. Por exemplo, isso é ilegal:

```
INSERT INTO t (utf32_column) VALUES (0x110000); /* illegal */
```

### 12.9.8 Conversão entre conjuntos de caracteres Unicode de 3 bytes e 4 bytes

Esta seção descreve os problemas que você pode enfrentar ao converter dados de caracteres entre os conjuntos de caracteres `utf8mb3` e `utf8mb4`.

Nota

Essa discussão se concentra principalmente na conversão entre `utf8mb3` e `utf8mb4`, mas princípios semelhantes se aplicam à conversão entre o conjunto de caracteres `ucs2` e conjuntos de caracteres como `utf16` ou `utf32`.

Os conjuntos de caracteres `utf8mb3` e `utf8mb4` diferem da seguinte forma:

* `utf8mb3` suporta apenas caracteres no Plano Multilíngue Básico (BMP). `utf8mb4` suporta adicionalmente caracteres suplementares que estão fora do BMP.

* `utf8mb3` utiliza no máximo três bytes por caractere. `utf8mb4` utiliza no máximo quatro bytes por caractere.

Nota

Essa discussão se refere aos nomes dos conjuntos de caracteres `utf8mb3` e `utf8mb4` para ser explícito ao se referir a dados de conjuntos de caracteres UTF-8 de 3 bytes e 4 bytes.

Uma vantagem de converter de `utf8mb3` para `utf8mb4` é que isso permite que as aplicações usem caracteres suplementares. Uma compensação é que isso pode aumentar os requisitos de espaço de armazenamento de dados.

Em termos de conteúdo de tabela, a conversão de `utf8mb3` para `utf8mb4` não apresenta problemas:

* Para um caractere BMP, `utf8mb4` e `utf8mb3` têm características de armazenamento idênticas: os mesmos valores de código, mesma codificação, mesma extensão.

* Para um caractere suplementar, o `utf8mb4` requer quatro bytes para armazená-lo, enquanto o `utf8mb3` não pode armazenar o caractere de forma alguma. Ao converter as colunas `utf8mb3` para `utf8mb4`, você não precisa se preocupar em converter caracteres suplementares, pois não há nenhum.

Em termos de estrutura de tabela, essas são as principais incompatibilidades potenciais:

* Para os tipos de dados de caracteres de comprimento variável (`VARCHAR` e os tipos `TEXT`), o comprimento máximo permitido em caracteres é menor para as colunas `utf8mb4` do que para as colunas `utf8mb3`.

* Para todos os tipos de dados de caracteres (os tipos `CHAR`, `VARCHAR` e o tipo `TEXT`), o número máximo de caracteres que podem ser indexados é menor para as colunas `utf8mb4` do que para as colunas `utf8mb3`.

Consequentemente, para converter tabelas de `utf8mb3` para `utf8mb4`, pode ser necessário alterar algumas definições de coluna ou índice.

As tabelas podem ser convertidas de `utf8mb3` para `utf8mb4` usando [`ALTER TABLE`](alter-table.html "15.1.9 ALTER TABLE Statement"). Suponha que uma tabela tenha esta definição:

```
CREATE TABLE t1 (
  col1 CHAR(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  col2 CHAR(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL
) CHARACTER SET utf8mb3;
```

A seguinte declaração converte `t1` para usar `utf8mb4`:

```
ALTER TABLE t1
  DEFAULT CHARACTER SET utf8mb4,
  MODIFY col1 CHAR(10)
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  MODIFY col2 CHAR(10)
    CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL;
```

O problema ao converter de `utf8mb3` para `utf8mb4` é que o comprimento máximo de uma coluna ou chave de índice não muda em termos de *bytes*. Portanto, é menor em termos de *caracteres* porque o comprimento máximo de um caractere é de quatro bytes em vez de três. Para os tipos de dados `CHAR`, `VARCHAR` e `TEXT`, fique atento a esses problemas ao converter suas tabelas MySQL:

* Verifique todas as definições das colunas `utf8mb3` e certifique-se de que elas não excedam o comprimento máximo para o motor de armazenamento.

* Verifique todos os índices nas colunas de `utf8mb3` e certifique-se de que eles não excedam o comprimento máximo para o motor de armazenamento. Às vezes, o máximo pode mudar devido a melhorias no motor de armazenamento.

Se as condições anteriores se aplicarem, você deve reduzir o comprimento definido das colunas ou índices, ou continuar usando `utf8mb3` em vez de `utf8mb4`.

Aqui estão alguns exemplos em que mudanças estruturais podem ser necessárias:

Uma coluna `TINYTEXT` pode conter até 255 bytes, portanto, pode conter até 85 caracteres de 3 bytes ou 63 caracteres de 4 bytes. Suponha que você tenha uma coluna `TINYTEXT` que usa `utf8mb3`, mas deve ser capaz de conter mais de 63 caracteres. Você não pode convertê-la para `utf8mb4`, a menos que também mude o tipo de dados para um tipo mais longo, como `TEXT`.

Da mesma forma, uma coluna muito longa `VARCHAR` pode precisar ser alterada para um dos tipos mais longos `TEXT` se você quiser convertê-la de `utf8mb3` para `utf8mb4`.

* `InnoDB` tem um comprimento máximo de índice de 767 bytes para tabelas que utilizam o formato de linha `COMPACT` ou `REDUNDANT`, portanto, para as colunas `utf8mb3` ou `utf8mb4`, você pode indexar um máximo de 255 ou 191 caracteres, respectivamente. Se você atualmente tem colunas `utf8mb3` com índices maiores que 191 caracteres, você deve indexar um número menor de caracteres.

Em uma tabela `InnoDB` que utiliza o formato de linha `COMPACT` ou `REDUNDANT`, essas definições de coluna e índice são legais:

  ```
  col1 VARCHAR(500) CHARACTER SET utf8mb3, INDEX (col1(255))
  ```

Para usar `utf8mb4` em vez disso, o índice deve ser menor:

  ```
  col1 VARCHAR(500) CHARACTER SET utf8mb4, INDEX (col1(191))
  ```

Nota

Para as tabelas `InnoDB` que utilizam o formato de linha `COMPRESSED` ou `DYNAMIC`, são permitidos prefixos de chave de índice (glossary.html#glos_index_prefix "index prefix") com mais de 767 bytes (até 3072 bytes). As tabelas criadas com esses formatos de linha permitem indexar um máximo de 1024 ou 768 caracteres para as colunas `utf8mb3` ou `utf8mb4`, respectivamente. Para informações relacionadas, consulte a Seção 17.22, “Limites do InnoDB” e Formato de Linha Dinâmico.

Os tipos de alterações anteriores provavelmente só serão necessários se você tiver colunas ou índices muito longos. Caso contrário, você poderá converter suas tabelas de `utf8mb3` para `utf8mb4` sem problemas, usando `ALTER TABLE` conforme descrito anteriormente.

Os itens a seguir resumem outras possíveis incompatibilidades:

* `SET NAMES 'utf8mb4'` faz com que o conjunto de caracteres de 4 bytes seja usado para conjuntos de caracteres de conexão. Enquanto não forem enviados caracteres de 4 bytes do servidor, não deve haver problemas. Caso contrário, as aplicações que esperam receber um máximo de três bytes por caractere podem ter problemas. Por outro lado, as aplicações que esperam enviar caracteres de 4 bytes devem garantir que o servidor os entenda.

* Para a replicação, se conjuntos de caracteres que suportam caracteres suplementares devem ser usados na fonte, todas as réplicas também devem compreendê-los.

Além disso, tenha em mente o princípio geral de que, se uma tabela tiver definições diferentes na fonte e na replica, isso pode levar a resultados inesperados. Por exemplo, as diferenças na máxima comprimento da chave do índice tornam arriscado o uso de `utf8mb3` na fonte e `utf8mb4` na replica.

Se você tiver convertido para `utf8mb4`, `utf16`, `utf16le` ou `utf32`, e depois decidir voltar para `utf8mb3` ou `ucs2` (por exemplo, para desfazer uma versão mais antiga do MySQL), essas considerações se aplicam:

Os dados de `utf8mb3` e `ucs2` não devem apresentar problemas.

* O servidor deve ser recente o suficiente para reconhecer definições que se referem ao conjunto de caracteres a partir do qual você está convertendo.

* Para definições de objeto que se referem ao conjunto de caracteres `utf8mb4`, você pode descartá-las com **mysqldump** antes de fazer o downgrade, edite o arquivo de dump para alterar as instâncias de `utf8mb4` para `utf8`, e recarregue o arquivo no servidor mais antigo, desde que não haja caracteres de 4 bytes nos dados. O servidor mais antigo verá `utf8` no arquivo de dump das definições de objetos e criará novos objetos que usam o conjunto de caracteres (3-byte) `utf8`.