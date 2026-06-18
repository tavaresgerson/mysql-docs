#### 13.4.2.4 Classe de curva

Um `Curve` é uma geometria unidimensional, geralmente representada por uma sequência de pontos. Subclasses específicas de `Curve` definem o tipo de interpolação entre os pontos. `Curve` é uma classe não instanciável.

**`Curve` Propriedades**

- Um `Curve` tem as coordenadas de seus pontos.

- Um `Curve` é definido como uma geometria unidimensional.

- Um `Curve` é simples se não passar pelo mesmo ponto duas vezes, com a exceção de que uma curva ainda pode ser simples se os pontos de início e fim forem os mesmos.

- Um `Curve` é fechado se seu ponto de início for igual ao seu ponto final.

- A fronteira de um `Curve` fechado é vazia.

- A fronteira de um `Curve` não fechado consiste em seus dois pontos finais.

- Um `Curve` que é simples e fechado é um `LinearRing`.
