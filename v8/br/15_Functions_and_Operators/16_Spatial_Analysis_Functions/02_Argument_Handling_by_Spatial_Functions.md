### 14.16.2 Tratamento de argumentos por funções espaciais

Os valores espaciais, ou geometrias, possuem as propriedades descritas na Seção 13.4.2.2, “Classe de Geometria”. A discussão a seguir lista as características gerais de manipulação de argumentos de funções espaciais. Funções ou grupos de funções específicas podem ter características adicionais ou diferentes de manipulação de argumentos, conforme discutido nas seções onde essas descrições de funções ocorrem. Quando isso for verdade, essas descrições têm precedência sobre a discussão geral aqui.

As funções espaciais são definidas apenas para valores de geometria válidos. Consulte a Seção 13.4.4, “Formação e validade da geometria”.

Cada valor de geometria está associado a um sistema de referência espacial (SRS), que é um sistema baseado em coordenadas para localização geográfica. Consulte a Seção 13.4.5, “Suporte ao Sistema de Referência Espacial”.

O identificador de referência espacial (SRID) de uma geometria identifica o SRS no qual a geometria é definida. No MySQL, o valor SRID é um inteiro associado ao valor da geometria. O valor máximo utilizável do SRID é 232−1. Se um valor maior for fornecido, apenas os 32 bits inferiores são usados.

O SRID 0 representa um plano cartesiano plano infinito sem unidades atribuídas aos seus eixos. Para garantir o comportamento do SRID 0, crie valores de geometria usando o SRID 0. O SRID 0 é o padrão para novos valores de geometria se nenhum SRID for especificado.

Para cálculos com múltiplos valores de geometria, todos os valores devem estar no mesmo SRS ou ocorrerá um erro. Portanto, funções espaciais que aceitam múltiplos argumentos de geometria exigem que esses argumentos estejam no mesmo SRS. Se uma função espacial retornar `ER_GIS_DIFFERENT_SRIDS`, isso significa que os argumentos de geometria não estavam todos no mesmo SRS. Você deve modificá-los para que tenham o mesmo SRS.

Uma geometria retornada por uma função espacial está no SRS dos argumentos de geometria porque os valores de geometria produzidos por qualquer função espacial herdam o SRID dos argumentos de geometria.

As diretrizes do Consórcio de Geoprocessamento Aberto exigem que os polígonos de entrada já estejam fechados, portanto, polígonos abertos são rejeitados como inválidos, em vez de serem fechados.

No MySQL, a única geometria vazia válida é representada na forma de uma coleção de geometria vazia. O tratamento de coleções de geometria vazias é o seguinte: uma coleção de geometria WKT vazia pode ser especificada como `'GEOMETRYCOLLECTION()'`. Esse é também o WKT de saída resultante de uma operação espacial que produz uma coleção de geometria vazia.

Durante a análise de uma coleção de geometrias aninhadas, a coleção é unificada e seus componentes básicos são usados em várias operações de SIG para calcular resultados. Isso oferece maior flexibilidade aos usuários, pois não é necessário se preocupar com a unicidade dos dados de geometria. Coleções de geometrias aninhadas podem ser geradas a partir de chamadas de função de SIG aninhadas sem precisar ser explicitamente unidas primeiro.
