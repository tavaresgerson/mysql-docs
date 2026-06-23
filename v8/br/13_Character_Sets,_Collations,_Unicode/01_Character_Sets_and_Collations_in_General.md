## 12.1 Conjuntos de caracteres e codificações em geral

Um conjunto de caracteres é um conjunto de símbolos e codificações. Uma ordenação é um conjunto de regras para comparar caracteres em um conjunto de caracteres. Vamos deixar a distinção clara com um exemplo de um conjunto de caracteres imaginário.

Suponha que tenhamos um alfabeto com quatro letras: `A`, `B`, `a`, `b`. Damos a cada letra um número: `A` = 0, `B` = 1, `a` = 2, `b` = 3. A letra `A` é um símbolo, o número 0 é o *codificação* para `A`, e a combinação de todas as quatro letras e seus codificamentos é um *conjunto de caracteres*.

Suponha que queira comparar dois valores de string, `A` e `B`. A maneira mais simples de fazer isso é olhar para as codificações: 0 para `A` e 1 para `B`. Como 0 é menor que 1, dizemos que `A` é menor que `B`. O que acabamos de fazer é aplicar uma ordenação ao nosso conjunto de caracteres. A ordenação é um conjunto de regras (apenas uma regra neste caso): “compare as codificações”. Chamamos a esta mais simples de todas as ordenações possíveis uma ordenação binária.

Mas e se quisermos dizer que as letras minúsculas e maiúsculas são equivalentes? Então teríamos pelo menos duas regras: (1) tratar as letras minúsculas `a` e `b` como equivalentes a `A` e `B`; (2) então comparar as codificações. Chamamos isso de ordenação insensível ao caso. É um pouco mais complexo do que uma ordenação binária.

Na vida real, a maioria dos conjuntos de caracteres tem muitos caracteres: não apenas `A` e `B`, mas alfabetos inteiros, às vezes múltiplos alfabetos ou sistemas de escrita orientais com milhares de caracteres, juntamente com muitos símbolos especiais e marcas de pontuação. Além disso, na vida real, a maioria das codificações tem muitas regras, não apenas para distinguir a maiúscula e minúscula das letras, mas também para distinguir acentos (um “acento” é uma marca anexada a um caractere, como no alemão `Ö`), e para mapeamentos de múltiplos caracteres (como a regra de que `Ö` = `OE` em uma das duas codificações alemãs).

O MySQL pode fazer essas coisas por você:

* Armazene cadeias de caracteres usando uma variedade de conjuntos de caracteres. * Compare cadeias de caracteres usando uma variedade de colatinas. * Misture cadeias de caracteres com diferentes conjuntos de caracteres ou colatinas no mesmo servidor, na mesma base de dados ou até mesmo na mesma tabela.

* Habilite a especificação do conjunto de caracteres e a ordenação em qualquer nível.

Para usar essas funcionalidades de forma eficaz, você deve saber quais conjuntos de caracteres e codificações estão disponíveis, como alterar as configurações padrão e como elas afetam o comportamento dos operadores e funções de cadeia.