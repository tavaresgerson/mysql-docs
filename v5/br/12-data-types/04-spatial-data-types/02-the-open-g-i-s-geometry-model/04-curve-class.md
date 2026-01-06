#### 11.4.2.4 Classe de curva

Uma `Curva` é uma geometria unidimensional, geralmente representada por uma sequência de pontos. Subclasses específicas de `Curva` definem o tipo de interpolação entre os pontos. `Curva` é uma classe não instanciável.

**Propriedades da curva**

- Uma `Curva` tem as coordenadas de seus pontos.

- Uma `Curva` é definida como uma geometria unidimensional.

- Uma curva é simples se não passar pelo mesmo ponto duas vezes, com a exceção de que uma curva ainda pode ser simples se os pontos de início e fim forem os mesmos.

- Uma `Curva` é fechada se seu ponto de início for igual ao seu ponto final.

- A borda de uma `Curva` fechada é vazia.

- A borda de uma `Curva` não fechada é composta por seus dois pontos finais.

- Uma `Curva` que é simples e fechada é um `Ring Linear`.
