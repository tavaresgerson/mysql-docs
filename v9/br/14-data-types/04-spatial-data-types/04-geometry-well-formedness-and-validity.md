### 13.4.4 Geometria Formação e Validade

Para os valores de geometria, o MySQL distingue entre os conceitos de sintaticamente bem formado e geometricamente válido.

Uma geometria é sintaticamente bem formada se atender a condições como as desta (não exaustiva) lista:

* Linhas têm pelo menos dois pontos
* Polígonos têm pelo menos um anel
* Aros de polígonos são fechados (primeiro e último pontos iguais)
* Aros de polígonos têm pelo menos 4 pontos (polígono mínimo é um triângulo com primeiro e último pontos iguais)

* Coleções não estão vazias (exceto `GeometryCollection`)

Uma geometria é geometricamente válida se for sintaticamente bem formada e atender a condições como as desta (não exaustiva) lista:

* Polígonos não são auto-interseccionais
* Aros internos de polígonos estão dentro do anel externo
* Multipolígonos não têm polígonos sobrepostos

As funções espaciais falham se uma geometria não for sintaticamente bem formada. As funções de importação espacial que parsem valores WKT ou WKB levantam um erro para tentativas de criar uma geometria que não seja sintaticamente bem formada. A formação sintática bem formada também é verificada para tentativas de armazenar geometrias em tabelas.

É permitido inserir, selecionar e atualizar geometrias geometricamente inválidas, mas elas devem ser sintaticamente bem formadas. Devido ao custo computacional, o MySQL não verifica explicitamente a validade geométrica. As computações espaciais podem detectar alguns casos de geometrias inválidas e levantar um erro, mas também podem retornar um resultado indefinido sem detectar a invalidade. Aplicações que exigem geometrias geometricamente válidas devem verificá-las usando a função `ST_IsValid()`.