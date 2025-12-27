## 12.1 Conjuntos de Caracteres e Cotações em Geral

Um conjunto de caracteres é um conjunto de símbolos e codificações. Uma cotação é um conjunto de regras para comparar caracteres em um conjunto de caracteres. Vamos deixar a distinção clara com um exemplo de um conjunto de caracteres imaginário.

Suponha que temos um alfabeto com quatro letras: `A`, `B`, `a`, `b`. Damos a cada letra um número: `A` = 0, `B` = 1, `a` = 2, `b` = 3. A letra `A` é um símbolo, o número 0 é a *codificação* para `A`, e a combinação de todas as quatro letras e suas codificações é um *conjunto de caracteres*.

Suponha que queremos comparar dois valores de string, `A` e `B`. A maneira mais simples de fazer isso é olhar para as codificações: 0 para `A` e 1 para `B`. Como 0 é menor que 1, dizemos que `A` é menor que `B`. O que acabamos de fazer é aplicar uma cotação ao nosso conjunto de caracteres. A cotação é um conjunto de regras (apenas uma regra neste caso): “comparar as codificações”. Chamamos essa mais simples de todas as possíveis cotasções de uma cotação binária.

Mas e se quisermos dizer que as letras minúsculas e maiúsculas são equivalentes? Então teríamos pelo menos duas regras: (1) tratar as letras minúsculas `a` e `b` como equivalentes a `A` e `B`; (2) então comparar as codificações. Chamamos isso de uma cotação insensível ao caso. É um pouco mais complexo do que uma cotação binária.

Na vida real, a maioria dos conjuntos de caracteres tem muitos caracteres: não apenas `A` e `B`, mas inteiros alfabetos, às vezes múltiplos alfabetos ou sistemas de escrita orientais com milhares de caracteres, além de muitos símbolos especiais e sinais de pontuação. Na vida real, a maioria das collation também tem muitas regras, não apenas para distinguir entre maiúsculas e minúsculas, mas também para distinguir acentos (um “acento” é uma marca anexada a um caractere, como no alemão `Ö`), e para mapeamentos de múltiplos caracteres (como a regra de que `Ö` = `OE` em uma das duas collation alemãs).

O MySQL pode fazer essas coisas por você:

* Armazenar strings usando uma variedade de conjuntos de caracteres.
* Comparar strings usando uma variedade de collation.
* Misturar strings com diferentes conjuntos de caracteres ou collation no mesmo servidor, na mesma base de dados ou até mesmo na mesma tabela.

* Habilitar a especificação de conjunto de caracteres e collation em qualquer nível.

Para usar essas funcionalidades de forma eficaz, você deve saber quais conjuntos de caracteres e collation estão disponíveis, como alterar os padrões e como eles afetam o comportamento dos operadores e funções de string.