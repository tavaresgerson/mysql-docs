## 10.1 Character Sets e Collations em Geral

Um Character Set é um conjunto de símbolos e codificações. Um Collation é um conjunto de regras para comparar caracteres em um Character Set. Vamos deixar a distinção clara com um exemplo de um Character Set imaginário.

Suponha que tenhamos um alfabeto com quatro letras: `A`, `B`, `a`, `b`. Atribuímos um número a cada letra: `A` = 0, `B` = 1, `a` = 2, `b` = 3. A letra `A` é um símbolo, o número 0 é a *codificação* (*encoding*) para `A`, e a combinação de todas as quatro letras e suas codificações é um Character Set.

Suponha que queremos comparar dois valores de string, `A` e `B`. A maneira mais simples de fazer isso é observar as codificações: 0 para `A` e 1 para `B`. Como 0 é menor que 1, dizemos que `A` é menor que `B`. O que acabamos de fazer foi aplicar um Collation ao nosso Character Set. O Collation é um conjunto de regras (apenas uma regra neste caso): “compare as codificações.” Chamamos este, o mais simples de todos os possíveis Collations, de *binary collation* (collation binária).

Mas e se quisermos dizer que as letras minúsculas e maiúsculas são equivalentes? Então teríamos pelo menos duas regras: (1) tratar as letras minúsculas `a` e `b` como equivalentes a `A` e `B`; (2) em seguida, comparar as codificações. Chamamos isso de *case-insensitive collation* (collation que não diferencia maiúsculas de minúsculas). É um pouco mais complexo do que um *binary collation*.

Na vida real, a maioria dos Character Sets possui muitos caracteres: não apenas `A` e `B`, mas alfabetos inteiros, por vezes múltiplos alfabetos ou sistemas de escrita orientais com milhares de caracteres, juntamente com muitos símbolos especiais e sinais de pontuação. Também na vida real, a maioria dos Collations possui muitas regras, não apenas para saber se devem distinguir maiúsculas de minúsculas (*lettercase*), mas também para saber se devem distinguir acentos (um “acento” é uma marca anexada a um caractere, como o `Ö` em alemão), e para mapeamentos de múltiplos caracteres (como a regra de que `Ö` = `OE` em um dos dois Collations alemães).

O MySQL pode fazer o seguinte por você:

*   Armazenar strings usando uma variedade de Character Sets.
*   Comparar strings usando uma variedade de Collations.
*   Misturar strings com diferentes Character Sets ou Collations no mesmo *server*, no mesmo *Database*, ou até mesmo na mesma *Table*.
*   Permitir a especificação de Character Set e Collation em qualquer nível.

Para usar esses recursos de forma eficaz, você deve saber quais Character Sets e Collations estão disponíveis, como alterar os padrões (*defaults*), e como eles afetam o comportamento dos operadores e funções de *string*.