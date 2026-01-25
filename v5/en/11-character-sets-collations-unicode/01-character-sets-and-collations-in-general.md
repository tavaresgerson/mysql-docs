## 10.1 Conjuntos de Caracteres e Collations em Geral

Um conjunto de caracteres (character set) é um conjunto de símbolos e codificações. Uma collation é um conjunto de regras para comparar caracteres em um conjunto de caracteres. Vamos deixar a distinção clara com um exemplo de um conjunto de caracteres imaginário.

Suponha que temos um alfabeto com quatro letras: `A`, `B`, `a`, `b`. Damos a cada letra um número: `A` = 0, `B` = 1, `a` = 2, `b` = 3. A letra `A` é um símbolo, o número 0 é a *codificação* (`encoding`) para `A`, e a combinação de todas as quatro letras e suas codificações é um *conjunto de caracteres* (`character set`).

Suponha que queremos comparar dois valores de string, `A` e `B`. A maneira mais simples de fazer isso é olhar para as codificações: 0 para `A` e 1 para `B`. Como 0 é menor que 1, dizemos que `A` é menor que `B`. O que acabamos de fazer é aplicar uma collation ao nosso conjunto de caracteres. A collation é um conjunto de regras (apenas uma regra neste caso): "compare as codificações." Chamamos esta, a mais simples de todas as collations possíveis, de **binary collation** (collation binária).

Mas e se quisermos dizer que as letras minúsculas e maiúsculas são equivalentes? Então teríamos pelo menos duas regras: (1) tratar as letras minúsculas `a` e `b` como equivalentes a `A` e `B`; (2) em seguida, comparar as codificações. Chamamos isso de uma **collation case-insensitive** (collation que não diferencia maiúsculas de minúsculas). É um pouco mais complexa do que uma binary collation.

Na vida real, a maioria dos conjuntos de caracteres tem muitos caracteres: não apenas `A` e `B`, mas alfabetos inteiros, às vezes múltiplos alfabetos ou sistemas de escrita orientais com milhares de caracteres, juntamente com muitos símbolos especiais e sinais de pontuação. Também na vida real, a maioria das collations tem muitas regras, não apenas para saber se deve distinguir maiúsculas/minúsculas, mas também para saber se deve distinguir acentos (um "acento" é uma marca anexada a um caractere, como o `Ö` alemão), e para mapeamentos de múltiplos caracteres (como a regra de que `Ö` = `OE` em uma das duas collations alemãs).

O MySQL pode fazer estas coisas por você:

*   Armazenar strings usando uma variedade de conjuntos de caracteres.
*   Comparar strings usando uma variedade de collations.
*   Misturar strings com diferentes character sets ou collations no mesmo server, no mesmo database ou até mesmo na mesma table.
*   Permitir a especificação de character set e collation em qualquer nível.

Para usar esses recursos de forma eficaz, você deve saber quais character sets e collations estão disponíveis, como alterar os padrões e como eles afetam o comportamento dos operadores e funções de string.