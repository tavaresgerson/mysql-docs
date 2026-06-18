#### 11.4.2.10 Classe MultiCurve

Um `MultiCurve` é uma *geometry collection* composta por elementos `Curve`. `MultiCurve` é uma classe não instanciável.

**Propriedades de MultiCurve**

* Um `MultiCurve` é uma *geometry* unidimensional.

* Um `MultiCurve` é simples se e somente se todos os seus elementos forem simples; as únicas interseções entre quaisquer dois elementos ocorrem em pontos que estão nos limites de ambos os elementos.

* O limite de um `MultiCurve` é obtido aplicando a "regra de união mod 2" (também conhecida como "regra ímpar-par"): Um ponto está no limite de um `MultiCurve` se estiver nos limites de um número ímpar de elementos `Curve`.

* Um `MultiCurve` é fechado se todos os seus elementos forem fechados.

* O limite de um `MultiCurve` fechado está sempre vazio.