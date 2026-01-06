### 11.4.4 Geometria - Formação e Validade

Para os valores de geometria, o MySQL distingue entre os conceitos de sintaticamente bem formado e geometricamente válido.

Uma geometria é sintaticamente bem formada se atender a condições como as desta (não exaustiva) lista:

- As linhas têm pelo menos dois pontos

- Os polígonos têm pelo menos um anel

- Os anéis poligonais são fechados (o primeiro e o último ponto são iguais)

- Os anéis poligonais têm pelo menos 4 pontos (o polígono mínimo é um triângulo com os primeiros e últimos pontos iguais)

- As coleções não estão vazias (exceto `GeometryCollection`)

Uma geometria é geométricamente válida se for sintaticamente bem formada e satisfazer condições como as desta (não exaustiva) lista:

- Os polígonos não se intersectam mutuamente
- Os anéis internos poligonais estão dentro do anel externo
- Os polígonos multipoligonais não têm polígonos sobrepostos

As funções espaciais falham se uma geometria não for sintaticamente bem formada. As funções de importação espacial que analisam valores WKT ou WKB geram um erro para tentativas de criar uma geometria que não seja sintaticamente bem formada. A formação sintática também é verificada para tentativas de armazenar geometrias em tabelas.

É permitido inserir, selecionar e atualizar geometrias geometricamente inválidas, mas elas devem ser bem formadas sintaticamente. Devido ao custo computacional, o MySQL não verifica explicitamente a validade geométrica. Os cálculos espaciais podem detectar alguns casos de geometrias inválidas e gerar um erro, mas também podem retornar um resultado indefinido sem detectar a invalidade. Aplicações que exigem geometrias válidas geometricamente devem verificá-las usando a função `ST_IsValid()`.
