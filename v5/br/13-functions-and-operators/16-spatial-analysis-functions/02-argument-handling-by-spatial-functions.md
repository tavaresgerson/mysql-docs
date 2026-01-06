### 12.16.2 Tratamento de argumentos por funções espaciais

Os valores espaciais, ou geometrias, possuem as propriedades descritas na Seção 11.4.2.2, “Classe de Geometria”. A discussão a seguir lista as características gerais de manipulação de argumentos de funções espaciais. Funções ou grupos de funções específicas podem ter características adicionais ou diferentes de manipulação de argumentos, conforme discutido nas seções onde essas descrições de funções ocorrem. Quando isso for verdade, essas descrições têm precedência sobre a discussão geral aqui.

As funções espaciais são definidas apenas para valores de geometria válidos. Consulte a Seção 11.4.4, “Formação e validade da geometria”.

O identificador de referência espacial (SRID) de uma geometria identifica o espaço de coordenadas no qual a geometria é definida. No MySQL, o valor SRID é um inteiro associado ao valor da geometria. O valor máximo utilizável do SRID é 232−1. Se for fornecido um valor maior, apenas os 32 bits inferiores são utilizados.

No MySQL, todos os cálculos são feitos assumindo SRID 0, independentemente do valor real do SRID. O SRID 0 representa um plano cartesiano plano infinito sem unidades atribuídas aos seus eixos. No futuro, os cálculos podem usar os valores de SRID especificados. Para garantir o comportamento do SRID 0, crie valores de geometria usando SRID 0. O SRID 0 é o padrão para novos valores de geometria se nenhum SRID for especificado.

Os valores de geometria produzidos por qualquer função espacial herdam o SRID dos argumentos de geometria.

As diretrizes do Consórcio de Geoprocessamento Aberto exigem que os polígonos de entrada já estejam fechados, portanto, polígonos abertos são rejeitados como inválidos, em vez de serem fechados.

O tratamento de coleções de geometrias vazias é o seguinte: uma coleção de geometrias de entrada WKT vazia pode ser especificada como `'GEOMETRYCOLLECTION()'`. Esse também é o WKT de saída resultante de uma operação espacial que produz uma coleção de geometrias vazia.

Durante a análise de uma coleção de geometrias aninhadas, a coleção é unificada e seus componentes básicos são usados em várias operações de SIG para calcular resultados. Isso oferece maior flexibilidade aos usuários, pois não é necessário se preocupar com a unicidade dos dados de geometria. Coleções de geometrias aninhadas podem ser geradas a partir de chamadas de função de SIG aninhadas sem precisar ser explicitamente unidas primeiro.
