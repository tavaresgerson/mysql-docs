### 14.16.2 Gerenciamento de Argumentos por Funções Espaciais

Os valores espaciais, ou geometrias, possuem as propriedades descritas na Seção 13.4.2.2, “Classe de Geometria”. A discussão a seguir lista as características gerais de gerenciamento de argumentos de funções espaciais. Funções específicas ou grupos de funções podem ter características de gerenciamento de argumentos adicionais ou diferentes, conforme discutido nas seções onde essas descrições de funções ocorrem. Quando isso for verdade, essas descrições têm precedência sobre a discussão geral aqui.

As funções espaciais são definidas apenas para valores de geometria válidos. Veja a Seção 13.4.4, “Formação e Validade da Geometria”.

Cada valor de geometria está associado a um sistema de referência espacial (SRS), que é um sistema baseado em coordenadas para localizações geográficas. Veja a Seção 13.4.5, “Suporte ao Sistema de Referência Espacial”.

O identificador de referência espacial (SRID) de uma geometria identifica o SRS no qual a geometria é definida. No MySQL, o valor SRID é um inteiro associado ao valor da geometria. O valor máximo de SRID utilizável é 232−1. Se um valor maior for fornecido, apenas os 32 bits inferiores são usados.

O SRID 0 representa um plano cartesiano plano infinito sem unidades atribuídas aos seus eixos. Para garantir o comportamento do SRID 0, crie valores de geometria usando SRID 0. SRID 0 é o padrão para novos valores de geometria se nenhum SRID for especificado.

Para cálculos em múltiplos valores de geometria, todos os valores devem estar no mesmo SRS ou ocorrerá um erro. Assim, funções espaciais que aceitam múltiplos argumentos de geometria exigem que esses argumentos estejam no mesmo SRS. Se uma função espacial retornar `ER_GIS_DIFFERENT_SRIDS`, isso significa que os argumentos de geometria não estavam todos no mesmo SRS. Você deve modificá-los para ter o mesmo SRS.

Uma geometria retornada por uma função espacial está no SRS dos argumentos da geometria porque os valores de geometria produzidos por qualquer função espacial herdam o SRID dos argumentos da geometria.

As diretrizes do Open Geospatial Consortium exigem que os polígonos de entrada já estejam fechados, então polígonos abertos são rejeitados como inválidos, em vez de serem fechados.

No MySQL, a única geometria vazia válida é representada na forma de uma coleção de geometria vazia. O tratamento de coleções de geometria vazias é o seguinte: uma coleção de geometria WKT vazia pode ser especificada como `'GEOMETRYCOLLECTION()'`. Isso também é o WKT de saída resultante de uma operação espacial que produz uma coleção de geometria vazia.

Durante a análise de uma coleção de geometria aninhada, a coleção é achatada e seus componentes básicos são usados em várias operações GIS para calcular resultados. Isso oferece flexibilidade adicional aos usuários, pois não é necessário se preocupar com a unicidade dos dados de geometria. Coleções de geometria aninhadas podem ser produzidas a partir de chamadas de função GIS aninhadas sem precisar ser explicitamente achatadas primeiro.