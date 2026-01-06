#### 11.4.2.10 Classe MultiCurve

Um `MultiCurve` é uma coleção de geometria composta por elementos `Curve`. `MultiCurve` é uma classe não instanciável.

**Propriedades `MultiCurve`**

- Um `MultiCurve` é uma geometria unidimensional.

- Um `MultiCurve` é simples se e somente se todos os seus elementos são simples; as únicas interseções entre quaisquer dois elementos ocorrem em pontos que estão nas bordas de ambos os elementos.

- Uma fronteira `MultiCurve` é obtida aplicando a regra da união `mod 2` (também conhecida como regra de par/ímã): um ponto está na fronteira de uma `MultiCurve` se estiver nas fronteiras de um número ímpar de elementos `Curve`.

- Um `MultiCurve` é fechado se todos seus elementos forem fechados.

- A borda de uma `MultiCurve` fechada é sempre vazia.
