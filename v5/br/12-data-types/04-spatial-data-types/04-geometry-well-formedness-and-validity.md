### 11.4.4 Bem-Formação e Validade de Geometrias

Para valores de geometry, o MySQL distingue entre os conceitos de sintaticamente bem-formado e geometricamente válido.

Uma geometry é sintaticamente bem-formada se satisfizer condições como as listadas a seguir (esta lista não é exaustiva):

* Linestrings devem ter pelo menos dois pontos
* Polygons devem ter pelo menos um ring
* Rings de Polygon devem ser fechados (o primeiro e o último ponto são iguais)
* Rings de Polygon devem ter pelo menos 4 pontos (o polygon mínimo é um triângulo onde o primeiro e o último ponto são iguais)

* Collections não devem estar vazias (exceto `GeometryCollection`)

Uma geometry é geometricamente válida se for sintaticamente bem-formada e satisfizer condições como as listadas a seguir (esta lista não é exaustiva):

* Polygons não devem ser auto-interceptados
* Rings interiores de Polygon devem estar dentro do ring exterior
* Multipolygons não devem ter polygons sobrepostos

Funções espaciais falham se uma geometry não for sintaticamente bem-formada. Funções de importação espacial que analisam valores WKT ou WKB levantam um erro quando há tentativas de criar uma geometry que não é sintaticamente bem-formada. A bem-formação sintática também é verificada em tentativas de armazenar geometries em tabelas.

É permitido inserir, selecionar e atualizar geometries geometricamente inválidas, mas elas devem ser sintaticamente bem-formadas. Devido ao custo computacional, o MySQL não verifica explicitamente a validade geométrica. Computações espaciais podem detectar alguns casos de geometries inválidas e levantar um erro, mas também podem retornar um resultado indefinido sem detectar a invalidade. Aplicações que exigem geometries geometricamente válidas devem verificá-las usando a função `ST_IsValid()`.