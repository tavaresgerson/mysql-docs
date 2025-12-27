#### 13.4.2.10 Classe MultiCurve

Uma `MultiCurve` é uma coleção de geometria composta por elementos `Curve`. A `MultiCurve` é uma classe não instanciável.

**Propriedades da `MultiCurve`**

* Uma `MultiCurve` é uma geometria unidimensional.

* Uma `MultiCurve` é simples se e somente se todos os seus elementos são simples; as únicas interseções entre quaisquer dois elementos ocorrem em pontos que estão nos limites de ambos os elementos.

* A borda de uma `MultiCurve` é obtida aplicando a regra de união "mod 2" (também conhecida como regra "ímpar-par"): um ponto está na borda de uma `MultiCurve` se estiver nos limites de um número ímpar de elementos `Curve`.

* Uma `MultiCurve` é fechada se todos os seus elementos são fechados.

* A borda de uma `MultiCurve` fechada é sempre vazia.