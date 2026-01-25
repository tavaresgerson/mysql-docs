### 12.16.2 Manipulação de Argumentos por Funções Espaciais

Valores espaciais, ou *geometries*, possuem as propriedades descritas na Seção 11.4.2.2, “Geometry Class”. A discussão a seguir lista as características gerais de manipulação de argumentos de funções espaciais. Funções específicas ou grupos de funções podem ter características de manipulação de argumentos adicionais ou diferentes, conforme discutido nas seções onde essas descrições de funções ocorrem. Nesses casos, essas descrições têm precedência sobre a discussão geral aqui.

Funções espaciais são definidas apenas para valores de *geometry* válidos. Consulte a Seção 11.4.4, “Geometry Well-Formedness and Validity”.

O identificador de referência espacial (*spatial reference identifier* - *SRID*) de uma *geometry* identifica o espaço de coordenadas no qual a *geometry* está definida. No MySQL, o valor *SRID* é um inteiro associado ao valor da *geometry*. O valor máximo de *SRID* utilizável é $2^{32}-1$. Se um valor maior for fornecido, apenas os 32 bits inferiores são utilizados.

No MySQL, todos os cálculos são realizados assumindo *SRID 0*, independentemente do valor real do *SRID*. O *SRID 0* representa um plano Cartesiano plano infinito sem unidades atribuídas aos seus eixos. No futuro, os cálculos poderão usar os valores de *SRID* especificados. Para garantir o comportamento de *SRID 0*, crie valores de *geometry* usando *SRID 0*. O *SRID 0* é o padrão para novos valores de *geometry* se nenhum *SRID* for especificado.

Valores de *geometry* produzidos por qualquer função espacial herdam o *SRID* dos argumentos de *geometry*.

As diretrizes do *Open Geospatial Consortium* exigem que os polígonos de entrada já estejam fechados, portanto, polígonos não fechados são rejeitados como inválidos em vez de serem fechados.

A manipulação de coleções de *geometry* vazias é a seguinte: Uma coleção de *geometry* de entrada *WKT* vazia pode ser especificada como `'GEOMETRYCOLLECTION()'`. Este é também o *WKT* de saída resultante de uma operação espacial que produz uma coleção de *geometry* vazia.

Durante o *parsing* de uma coleção de *geometry* aninhada, a coleção é nivelada (*flattened*) e seus componentes básicos são usados em várias operações *GIS* para calcular resultados. Isso fornece flexibilidade adicional aos usuários, pois é desnecessário se preocupar com a exclusividade dos dados de *geometry*. Coleções de *geometry* aninhadas podem ser produzidas a partir de chamadas de funções *GIS* aninhadas sem a necessidade de serem explicitamente niveladas primeiro.