### 15.1.23 Criação do Sistema de Referência Espacial

```
CREATE OR REPLACE SPATIAL REFERENCE SYSTEM
    srid srs_attribute ...

CREATE SPATIAL REFERENCE SYSTEM
    [IF NOT EXISTS]
    srid srs_attribute ...

srs_attribute: {
    NAME 'srs_name'
  | DEFINITION 'definition'
  | ORGANIZATION 'org_name' IDENTIFIED BY org_id
  | DESCRIPTION 'description'
}

srid, org_id: 32-bit unsigned integer
```

Esta declaração cria uma definição de sistema de referência espacial (SRS) e armazena-a no dicionário de dados, e requer o privilégio `CREATE_SPATIAL_REFERENCE_SYSTEM` (ou `SUPER`). A entrada do dicionário de dados resultante pode ser inspecionada usando a tabela `ST_SPATIAL_REFERENCE_SYSTEMS` do esquema `INFORMATION_SCHEMA`.

Os valores de SRID devem ser únicos, portanto, se não for especificado `OR REPLACE` ou `IF NOT EXISTS`, ocorrerá um erro se uma definição de SRS com o valor de *`srid`* fornecido já existir.

Com a sintaxe `CREATE OR REPLACE`, qualquer definição de SRS existente com o mesmo valor de SRID é substituída, a menos que o valor de SRID seja usado por alguma coluna em uma tabela existente. Nesse caso, ocorrerá um erro. Por exemplo:

```
mysql> CREATE OR REPLACE SPATIAL REFERENCE SYSTEM 4326 ...;
ERROR 3716 (SR005): Can't modify SRID 4326. There is at
least one column depending on it.
```

Para identificar qual coluna ou colunas usam o SRID, use esta consulta, substituindo 4326 pelo SRID da definição que você está tentando criar:

```
SELECT * FROM INFORMATION_SCHEMA.ST_GEOMETRY_COLUMNS WHERE SRS_ID=4326;
```

Com a sintaxe `CREATE ... IF NOT EXISTS`, qualquer definição de SRS existente com o mesmo valor de SRID faz com que a nova definição seja ignorada e ocorre um aviso.

Os valores de SRID devem estar no intervalo de inteiros sem sinal de 32 bits, com essas restrições:

* SRID 0 é um SRID válido, mas não pode ser usado com `CREATE SPATIAL REFERENCE SYSTEM`.

* Se o valor estiver em um intervalo de SRID reservado, ocorrerá um aviso. Os intervalos reservados são [0, 32767] (reservado pelo EPSG), [60,000,000, 69,999,999] (reservado pelo EPSG) e [2,000,000,000, 2,147,483,647] (reservado pelo MySQL). EPSG significa European Petroleum Survey Group.

* Os usuários não devem criar SRSs com SRIDs nas faixas de valores reservados. Isso aumenta o risco de os SRIDs entrarem em conflito com futuras definições de SRS distribuídas com o MySQL, resultando no sistema não instalar as SRS fornecidas pelo sistema para atualizações do MySQL ou na sobrescrita das SRS definidas pelo usuário.

Os atributos da declaração devem satisfazer essas condições:

* Os atributos podem ser fornecidos em qualquer ordem, mas nenhum atributo pode ser fornecido mais de uma vez.

* Os atributos `NAME` e `DEFINITION` são obrigatórios.

* O valor do atributo `NAME` *`srs_name`* deve ser único. A combinação dos valores dos atributos `ORGANIZATION` *`org_name`* e *`org_id`* deve ser única.

* O valor do atributo `NAME` *`srs_name`* e o valor do atributo `ORGANIZATION` *`org_name`* não podem ser vazios ou começar ou terminar com espaços em branco.

* Os valores de string nas especificações de atributos não podem conter caracteres de controle, incluindo nova linha.

* A tabela a seguir mostra as comprimentos máximos para os valores de atributos de string.

  **Tabela 15.6 CREATE SPATIAL REFERENCE SYSTEM Comprimentos de Atributo de String**

  <table summary="Comprimentos máximos de string para atributos CREATE SPATIAL REFERENCE SYSTEM"><col style="width: 25%"/><col style="width: 50%"/><thead><tr> <th>Atributo</th> <th>Comprimento Máximo (caracteres)</th> </tr></thead><tbody><tr> <td><code>NAME</code></td> <td>80</td> </tr><tr> <td><code>DEFINITION</code></td> <td>4096</td> </tr><tr> <td><code>ORGANIZATION</code></td> <td>256</td> </tr><tr> <td><code>DESCRIPTION</code></td> <td>2048</td> </tr></tbody></table>

Aqui está um exemplo da declaração `CREATE SPATIAL REFERENCE SYSTEM`. O valor `DEFINITION` é reformatado em várias linhas para melhor legibilidade. (Para que a declaração seja válida, o valor deve ser fornecido em uma única linha.)

```
CREATE SPATIAL REFERENCE SYSTEM 4120
NAME 'Greek'
ORGANIZATION 'EPSG' IDENTIFIED BY 4120
DEFINITION
  'GEOGCS["Greek",DATUM["Greek",SPHEROID["Bessel 1841",
  6377397.155,299.1528128,AUTHORITY["EPSG","7004"]],
  AUTHORITY["EPSG","6120"]],PRIMEM["Greenwich",0,
  AUTHORITY["EPSG","8901"]],UNIT["degree",0.017453292519943278,
  AUTHORITY["EPSG","9122"]],AXIS["Lat",NORTH],AXIS["Lon",EAST],
  AUTHORITY["EPSG","4120"]]';
```

A gramática para definições de SRS é baseada na gramática definida no *OpenGIS Implementation Specification: Coordinate Transformation Services*, Revisão 1.00, OGC 01-009, 12 de janeiro de 2001, Seção 7.2. Esta especificação está disponível em <http://www.opengeospatial.org/standards/ct>.

O MySQL incorpora essas mudanças na especificação:

* Apenas a regra de produção `<horz cs>` é implementada (ou seja, SRSs geográficas e projetadas).

* Há uma cláusula `optional`, não padrão, `<authority>` para `<parameter>`. Isso permite reconhecer os parâmetros de projeção por autoridade em vez de nome.

* A especificação não torna as cláusulas `AXIS` obrigatórias nas definições de sistemas de referência espaciais `GEOGCS`. No entanto, se não houver cláusulas `AXIS`, o MySQL não pode determinar se uma definição tem eixos em ordem de latitude-longitude ou longitude-latitude. O MySQL impõe o requisito não padrão de que cada definição `GEOGCS` deve incluir duas cláusulas `AXIS`. Uma deve ser `NORTH` ou `SOUTH`, e a outra `EAST` ou `WEST`. A ordem da cláusula `AXIS` determina se a definição tem eixos em ordem de latitude-longitude ou longitude-latitude.

* As definições de SRS podem não conter novas linhas.

Se uma definição de SRS especificar um código de autoridade para a projeção (o que é recomendado), ocorrerá um erro se a definição estiver faltando parâmetros obrigatórios. Nesse caso, a mensagem de erro indicará qual é o problema. Os métodos de projeção e os parâmetros obrigatórios que o MySQL suporta estão mostrados na Tabela 15.7, “Métodos de Projeção de Sistemas de Referência Espacial Suportáveis”, e na Tabela 15.8, “Parâmetros de Projeção de Sistemas de Referência Espacial”.

A tabela a seguir mostra os métodos de projeção que o MySQL suporta. O MySQL permite métodos de projeção desconhecidos, mas não pode verificar a definição para parâmetros obrigatórios e não pode converter dados espaciais para ou a partir de uma projeção desconhecida. Para explicações detalhadas de como cada projeção funciona, incluindo fórmulas, consulte a Nota de Orientação EPSG 7-2.

**Tabela 15.7 Métodos de Projeção de Sistemas de Referência Espacial Suportáveis**

<table summary="Códigos de projeção, nomes e parâmetros obrigatórios do EPSG suportados.">
<tr>
<th>Código EPSG</th>
<th>Nome da Projeção</th>
<th>Parâmetros Obrigatórios (Códigos EPSG)</th>
</tr>
<tr>
<th>1024</th>
<td>Popular Visualização Pseudo Mercator</td>
<th>8801, 8802, 8806, 8807</th>
</tr>
<tr>
<th>1027</th>
<td>Lambert Azimuthal Equal Area (Spherical)</td>
<th>8801, 8802, 8806, 8807</th>
</tr>
<tr>
<th>1028</th>
<td>Equidistant Cylindrical</td>
<th>8823, 8802, 8806, 8807</th>
</tr>
<tr>
<th>1029</th>
<th>Equidistant Cylindrical (Spherical)</th>
<th>8823, 8802, 8806, 8807</th>
</tr>
<tr>
<th>1041</th>
<th>Krovak (North Orientated)</th>
<th>8811, 8833, 1036, 8818, 8819, 8806, 8807</th>
</tr>
<tr>
<th>1042</th>
<th>Krovak Modified</th>
<th>8811, 8833, 1036, 8818, 8819, 8806, 8807, 8617, 8618, 1026, 1027, 1028, 1029, 1030, 1031, 1032, 1033, 1034, 1035</th>
</tr>
<tr>
<th>1043</th>
<th>Krovak Modified (North Orientated)</th>
<th>8811, 8833, 1036, 8818, 8819, 8806, 8807, 8617, 8618, 1026, 1027, 1028, 1029, 1030, 1031, 1032, 1033, 1034, 1035</th>
</tr>
<tr>
<th>1051</th>
<th>Lambert Conic Conformal (2SP Michigan)</th>
<th>8821, 8822, 8823, 8824, 8826, 8827, 1038</th>
</tr>
<tr>
<th>1052</th>
<th>Colombia Urban</th>
<th>8801, 8802, 8806, 8807, 1039</th>
</tr>
<tr>
<th>9801</th>
<th>Lambert Conic Conformal (1SP)</th>
<th>8801, 8802, 8805, 8806, 8807</th>
</tr>
<tr>
<th>9802</th>
<th>Lambert Conic Conformal (2SP)</th>
<th>8821, 8822, 8823, 8824, 8826, 8827</th>
</tr>
<tr>
<th>9803</th>
<th>Lambert Conic Conformal (2SP Belgium)</th>
<th>8821, 8822, 8823, 8824, 8826, 8827</th>
</tr>
<tr>
<th>9804</th>
<th>Mercator (variant A)</th>
<th>8801, 8802, 8805, 8806, 8807</th>
</tr>
<tr>
<th>9805</th>
<th>Mercator (variant B)</th>
<th>8823, 8802, 8806, 8807</th>
</tr>
<tr>
<th>9806</th>
<th>Cassini-Soldner</th>
<th>8801, 8802, 8806, 8807</th>
</tr>
<tr>
<th>9807</th>
<th>Transverse Mercator</th>

A tabela a seguir mostra os parâmetros de projeção que o MySQL reconhece. O reconhecimento ocorre principalmente pelo código de autoridade. Se não houver código de autoridade, o MySQL recorre à correspondência de strings não sensível ao caso da letra no nome do parâmetro. Para obter detalhes sobre cada parâmetro, consulte-o pelo código no [Registro Online EPSG](https://www.epsg-registry.org).

**Tabela 15.8 Parâmetros de Projeção de Sistema de Referência Espacial**

<table summary="Códigos de projeção do sistema de referência espacial, nomes de fallback e nomes EPSG."><tr><th style="width: 10%">Código EPSG</th><th style="width: 45%">Nome de fallback (Reconhecido pelo MySQL)</th><th style="width: 35%">Nome EPSG</th></tr><tr><td>1026</td><td>c1</td><td>C1</td></tr><tr><td>1027</td><td>c2</td><td>C2</td></tr><tr><td>1028</td><td>c3</td><td>C3</td></tr><tr><td>1029</td><td>c4</td><td>C4</td></tr><tr><td>1030</td><td>c5</td><td>C5</td></tr><tr><td>1031</td><td>c6</td><td>C6</td></tr><tr><td>1032</td><td>c7</td><td>C7</td></tr><tr><td>1033</td><td>c8</td><td>C8</td></tr><tr><td>1034</td><td>c9</td><td>C9</td></tr><tr><td>1035</td><td>c10</td><td>C10</td></tr><tr><td>1036</td><td>azimuth</td><td>Co-latitude do eixo do cone</td></tr><tr><td>1038</td><td>ellipsoid_scale_factor</td><td>Fator de escala do elipsoide</td></tr><tr><td>1039</td><td>projection_plane_height_at_origin</td><td>Altura do plano de projeção no ponto de origem</td></tr><tr><td>8617</td><td>evaluation_point_ordinate_1</td><td>Ordinate 1 do ponto de avaliação</td></tr><tr><td>8618</td><td>evaluation_point_ordinate_2</td><td>Ordinate 2 do ponto de avaliação</td></tr><tr><td>8801</td><td>latitude_of_origin</td><td>Latitude da origem natural</td></tr><tr><td>8802</td><td>central_meridian</td><td>Longitude da origem natural</td></tr><tr><td>8805</td><td>scale_factor</td><td>Fator de escala na origem natural</td></tr><tr><td>8806</td><td>false_easting</td><td>False easting</td></tr><tr><td>8807</td><td>false_northing</td><td>False northing</td></tr><tr><td>8811</td><td>latitude_of_center</td><td>Latitude do centro de projeção</td></tr><tr><td>8812</td><td>longitude_of_center</td><td>Longitude do centro de projeção</td></tr><tr><td>8813</td><td>azimuth</td><td>Azimute da linha inicial</td></tr><tr><td>8814</td><td>rectified_grid_angle</td><td>Ângulo de ajuste da grade retificada</td></tr><tr><td>8815</td><td>scale_factor</td><td>Fator de escala na linha inicial</td></tr><tr><td>8816</td><td>false_easting</td><td>Easting no centro de projeção</td></tr><tr><td>8817</td><td>false_northing</td><