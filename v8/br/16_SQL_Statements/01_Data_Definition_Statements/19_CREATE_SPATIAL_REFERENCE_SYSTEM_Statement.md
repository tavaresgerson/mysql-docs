### 15.1.19 Criar o Sistema de Referência Espacial Declaração

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

Essa declaração cria um sistema de referência espacial (SRS) e armazena-o no dicionário de dados. Requer o privilégio `SUPER`. A entrada do dicionário de dados resultante pode ser inspecionada usando a tabela `INFORMATION_SCHEMA` `ST_SPATIAL_REFERENCE_SYSTEMS`.

Os valores do SRID devem ser únicos, portanto, se nem `OR REPLACE` nem `IF NOT EXISTS` forem especificados, ocorrerá um erro se uma definição do SRS com o valor dado de `srid` já existir.

Com a sintaxe `CREATE OR REPLACE`, qualquer definição de SRS existente com o mesmo valor de SRID é substituída, a menos que o valor de SRID seja usado por alguma coluna em uma tabela existente. Nesse caso, ocorre um erro. Por exemplo:

```
mysql> CREATE OR REPLACE SPATIAL REFERENCE SYSTEM 4326 ...;
ERROR 3716 (SR005): Can't modify SRID 4326. There is at
least one column depending on it.
```

Para identificar qual coluna ou quais colunas usam o SRID, use esta consulta, substituindo 4326 pelo SRID da definição que você está tentando criar:

```
SELECT * FROM INFORMATION_SCHEMA.ST_GEOMETRY_COLUMNS WHERE SRS_ID=4326;
```

Com a sintaxe `CREATE ... IF NOT EXISTS`, qualquer definição de SRS existente com o mesmo valor de SRID faz com que a nova definição seja ignorada e um aviso seja exibido.

Os valores de SRID devem estar no intervalo de inteiros sem sinal de 32 bits, com as seguintes restrições:

- O SRID 0 é um SRID válido, mas não pode ser usado com `CREATE SPATIAL REFERENCE SYSTEM`.

- Se o valor estiver em uma faixa de SRID reservada, um aviso será exibido. As faixas reservadas são \[0, 32767] (reservada pelo EPSG), \[60,000,000, 69,999,999] (reservada pelo EPSG) e \[2,000,000,000, 2,147,483,647] (reservada pelo MySQL). EPSG significa European Petroleum Survey Group.

- Os usuários não devem criar SRSs com SRIDs nas faixas reservadas. Isso aumenta o risco de os SRIDs entrarem em conflito com futuras definições de SRS distribuídas com o MySQL, resultando no sistema não instalar as SRS fornecidas pelo sistema para atualizações do MySQL ou na sobrescrita das SRS definidas pelo usuário.

Os atributos da declaração devem satisfazer essas condições:

- Os atributos podem ser fornecidos em qualquer ordem, mas nenhum atributo pode ser fornecido mais de uma vez.

- Os atributos `NAME` e `DEFINITION` são obrigatórios.

- O valor do atributo `NAME` `srs_name` deve ser único. A combinação dos valores dos atributos `ORGANIZATION` `org_name` e `org_id` deve ser única.

- O valor do atributo `NAME` `srs_name` e o valor do atributo `ORGANIZATION` `org_name` não podem ser vazios ou começar ou terminar com espaços em branco.

- Os valores de string nas especificações de atributos não podem conter caracteres de controle, incluindo a nova linha.

- A tabela a seguir mostra as comprimentos máximos para os valores do atributo string.

  **Tabela 15.6 Sistema de Referência Espacial CREATE Atributos de comprimento**

  <table summary="Limites máximos de comprimento do atributo string para o sistema de referência espacial CREATE"><thead><tr> <th>Atributo</th> <th>Comprimento máximo (caracteres)</th> </tr></thead><tbody><tr> <td>[[<code>NAME</code>]]</td> <td>80</td> </tr><tr> <td>[[<code>DEFINITION</code>]]</td> <td>4096</td> </tr><tr> <td>[[<code>ORGANIZATION</code>]]</td> <td>256</td> </tr><tr> <td>[[<code>DESCRIPTION</code>]]</td> <td>2048</td> </tr></tbody></table>

Aqui está um exemplo de uma declaração `CREATE SPATIAL REFERENCE SYSTEM`. O valor `DEFINITION` é reformatado em várias linhas para melhor legibilidade. (Para que a declaração seja válida, o valor deve ser fornecido em uma única linha.)

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

A gramática para definições de SRS é baseada na gramática definida no *Especificação de Implementação OpenGIS: Serviços de Transformação de Coordenadas*, Revisão 1.00, OGC 01-009, 12 de janeiro de 2001, Seção 7.2. Esta especificação está disponível em <http://www.opengeospatial.org/standards/ct>.

O MySQL incorpora essas mudanças na especificação:

- Apenas a regra de produção `<horz cs>` é implementada (ou seja, SRSs geográficas e projetadas).

- Existe uma cláusula opcional, não padrão `<authority>` para `<parameter>`. Isso permite reconhecer os parâmetros de projeção por autoridade em vez de por nome.

- A especificação não torna as cláusulas `AXIS` obrigatórias nas definições do sistema de referência espacial `GEOGCS`. No entanto, se não houver cláusulas `AXIS`, o MySQL não pode determinar se uma definição tem eixos em ordem de latitude-longitude ou longitude-latitude. O MySQL impõe a exigência não padrão de que cada definição `GEOGCS` deve incluir duas cláusulas `AXIS`. Uma deve ser `NORTH` ou `SOUTH`, e a outra `EAST` ou `WEST`. A ordem da cláusula `AXIS` determina se a definição tem eixos em ordem de latitude-longitude ou longitude-latitude.

- As definições do SRS podem não conter novas linhas.

Se uma definição de SRS especificar um código de autoridade para a projeção (o que é recomendado), ocorrerá um erro se a definição estiver faltando parâmetros obrigatórios. Nesse caso, a mensagem de erro indicará qual é o problema. Os métodos de projeção e os parâmetros obrigatórios que o MySQL suporta estão mostrados na Tabela 15.7, “Métodos de Projeção de Sistemas de Referência Espacial Apoiados”, e na Tabela 15.8, “Parâmetros de Projeção de Sistemas de Referência Espacial”.

Para obter informações adicionais sobre a escrita de definições de SRS para o MySQL, consulte Sistemas de Referência Espacial Geográfica no MySQL 8.0 e Sistemas de Referência Espacial Projetada no MySQL 8.0

A tabela a seguir mostra os métodos de projeção suportados pelo MySQL. O MySQL permite métodos de projeção desconhecidos, mas não pode verificar a definição dos parâmetros obrigatórios e não pode converter dados espaciais para ou a partir de uma projeção desconhecida. Para explicações detalhadas de como cada projeção funciona, incluindo fórmulas, consulte a Nota de Orientação EPSG 7-2.

**Tabela 15.7 Métodos de projeção de sistemas de referência espacial suportados**

<table summary="Suporte a códigos de projeção de sistemas de referência espacial, nomes e parâmetros EPSG obrigatórios."><thead><tr> <th scope="col">Código EPSG</th> <th scope="col">Nome da Projeção</th> <th scope="col">Parâmetros obrigatórios (Códigos EPSG)</th> </tr></thead><tbody><tr> <th>1024</th> <td>Visualização Popular Pseudo Mercator</td> <td>8801, 8802, 8806, 8807</td> </tr><tr> <th>1027</th> <td>Lambert Azimutal de Área Igual (Esférica)</td> <td>8801, 8802, 8806, 8807</td> </tr><tr> <th>1028</th> <td>Cilíndrico equidistante</td> <td>8823, 8802, 8806, 8807</td> </tr><tr> <th>1029</th> <th>Cilíndrico (esférico) equidistante</th> <th>8823, 8802, 8806, 8807</th> </tr><tr> <th>1041</th> <th>Krovak (Orientado a Norte)</th> <th>8811, 8833, 1036, 8818, 8819, 8806, 8807</th> </tr><tr> <th>1042</th> <th>Krovak Modificado</th> <th>8811, 8833, 1036, 8818, 8819, 8806, 8807, 8617, 8618, 1026, 1027, 1028, 1029, 1030, 1031, 1032, 1033, 1034, 1035</th> </tr><tr> <th>1043</th> <th>Krovak Modificado (Orientado a Norte)</th> <th>8811, 8833, 1036, 8818, 8819, 8806, 8807, 8617, 8618, 1026, 1027, 1028, 1029, 1030, 1031, 1032, 1033, 1034, 1035</th> </tr><tr> <th>1051</th> <th>Lambert Conic Conformal (2SP Michigan)</th> <th>8821, 8822, 8823, 8824, 8826, 8827, 1038</th> </tr><tr> <th>1052</th> <th>Colômbia Urbana</th> <th>8801, 8802, 8806, 8807, 1039</th> </tr><tr> <th>9801</th> <th>Lambert Conic Conformal (1SP)</th> <th>8801, 8802, 8805, 8806, 8807</th> </tr><tr> <th>9802</th> <th>Lambert Conic Conformal (2SP)</th> <th>8821, 8822, 8823, 8824, 8826, 8827</th> </tr><tr> <th>9803</th> <th>Lambert Conic Conformal (2SP Bélgica)</th> <th>8821, 8822, 8823, 8824, 8826, 8827</th> </tr><tr> <th>9804</th> <th>Mercator (variante A)</th> <th>8801, 8802, 8805, 8806, 8807</th> </tr><tr> <th>9805</th> <th>Mercator (variante B)</th> <th>8823, 8802, 8806, 8807</th> </tr><tr> <th>9806</th> <th>Cassini-Soldner</th> <th>8801, 8802, 8806, 8807</th> </tr><tr> <th>9807</th> <th>Transversal Mercator</th> <th>8801, 8802, 8805, 8806, 8807</th> </tr><tr> <th>9808</th> <th>Transversal Mercator (Orientado para o Sul)</th> <th>8801, 8802, 8805, 8806, 8807</th> </tr><tr> <th>9809</th> <th>Estereógrafo Oblíquo</th> <th>8801, 8802, 8805, 8806, 8807</th> </tr><tr> <th>9810</th> <th>Polar Stereográfico (variante A)</th> <th>8801, 8802, 8805, 8806, 8807</th> </tr><tr> <th>9811</th> <th>Mapa de grade da Nova Zelândia</th> <th>8801, 8802, 8806, 8807</th> </tr><tr> <th>9812</th> <th>Hotine Oblique Mercator (variante A)</th> <th>8811, 8812, 8813, 8814, 8815, 8806, 8807</th> </tr><tr> <th>9813</th> <th>Laborde Oblique Mercator</th> <th>8811, 8812, 8813, 8815, 8806, 8807</th> </tr><tr> <th>9815</th> <th>Hotine Oblique Mercator (variante B)</th> <th>8811, 8812, 8813, 8814, 8815, 8816, 8817</th> </tr><tr> <th>9816</th> <th>Rede de Mineração da Tunísia</th> <th>8821, 8822, 8826, 8827</th> </tr><tr> <th>9817</th> <th>Lambert Conic Near-Conformal</th> <th>8801, 8802, 8805, 8806, 8807</th> </tr><tr> <th>9818</th> <th>American Polyconic</th> <th>8801, 8802, 8806, 8807</th> </tr><tr> <th>9819</th> <th>Krovak</th> <th>8811, 8833, 1036, 8818, 8819, 8806, 8807</th> </tr><tr> <th>9820</th> <th>Lambert Azimutal de Área Igual</th> <th>8801, 8802, 8806, 8807</th> </tr><tr> <th>9822</th> <th>Albers Equal Area</th> <th>8821, 8822, 8823, 8824, 8826, 8827</th> </tr><tr> <th>9824</th> <th>Sistema de grade zonal Transverse Mercator</th> <th>8801, 8830, 8831, 8805, 8806, 8807</th> </tr><tr> <th>9826</th> <th>Lambert Conic Conformal (Orientado a Oeste)</th> <th>8801, 8802, 8805, 8806, 8807</th> </tr><tr> <th>9828</th> <th>Bonne (Orientado a Sul)</th> <th>8801, 8802, 8806, 8807</th> </tr><tr> <th>9829</th> <th>Polar Stereográfico (variante B)</th> <th>8832, 8833, 8806, 8807</th> </tr><tr> <th>9830</th> <th>Polar Stereográfico (variante C)</th> <th>8832, 8833, 8826, 8827</th> </tr><tr> <th>9831</th> <th>Projeção de Guam</th> <th>8801, 8802, 8806, 8807</th> </tr><tr> <th>9832</th> <th>Azimutal equidistante modificado</th> <th>8801, 8802, 8806, 8807</th> </tr><tr> <th>9833</th> <th>Hiperbólica Cassini-Soldner</th> <th>8801, 8802, 8806, 8807</th> </tr><tr> <th>9834</th> <th>Lambert Cilíndrico de Área Igual (Esférico)</th> <th>8823, 8802, 8806, 8807</th> </tr><tr> <th>9835</th> <td>Lambert Cilíndrico de Área Igual</td> <td>8823, 8802, 8806, 8807</td> </tr></tbody></table>

A tabela a seguir mostra os parâmetros de projeção que o MySQL reconhece. O reconhecimento ocorre principalmente pelo código de autoridade. Se não houver um código de autoridade, o MySQL recorre à correspondência de strings não sensível ao caso na nomeação do parâmetro. Para obter detalhes sobre cada parâmetro, consulte-o pelo código no Registro Online EPSG.

**Tabela 15.8 Parâmetros de Projeção do Sistema de Referência Espacial**

<table summary="Códigos de projeção do sistema de referência espacial, nomes de fallback e nomes EPSG."><thead><tr> <th scope="col">Código EPSG</th> <th scope="col">Nome de fallback (reconhecido pelo MySQL)</th> <th scope="col">EPSG Name</th> </tr></thead><tbody><tr> <th>1026</th> <th>c1</th> <th>C1</th> </tr><tr> <th>1027</th> <th>c2</th> <th>C2</th> </tr><tr> <th>1028</th> <th>c3</th> <th>C3</th> </tr><tr> <th>1029</th> <th>c4</th> <th>C4</th> </tr><tr> <th>1030</th> <th>c5</th> <th>C5</th> </tr><tr> <th>1031</th> <th>c6</th> <th>C6</th> </tr><tr> <th>1032</th> <th>c7</th> <th>C7</th> </tr><tr> <th>1033</th> <th>c8</th> <th>C8</th> </tr><tr> <th>1034</th> <th>c9</th> <th>C9</th> </tr><tr> <th>1035</th> <th>c10</th> <th>C10</th> </tr><tr> <th>1036</th> <th>azimute</th> <th>Co-latitude do eixo do cone</th> </tr><tr> <th>1038</th> <th>fator de escala elíptico</th> <th>Fator de escala do elipsoide</th> </tr><tr> <th>1039</th> <th>altura do plano de projeção na origem</th> <th>Altura da origem do plano de projeção</th> </tr><tr> <th>8617</th> <th>ponto_de_avaliação_coordenada_1</th> <th>Ordine 1 do ponto de avaliação</th> </tr><tr> <th>8618</th> <th>ponto_de_avaliação_ordinada_2</th> <th>Ordine 2 de ponto de avaliação</th> </tr><tr> <th>8801</th> <th>latitude_de_origem</th> <th>Latitude de origem natural</th> </tr><tr> <th>8802</th> <th>meridiano central</th> <th>Longitude de origem natural</th> </tr><tr> <th>8805</th> <th>fator_de_escala</th> <th>Fator de escala na origem natural</th> </tr><tr> <th>8806</th> <th>false_easting</th> <th>Estudo falso leste</th> </tr><tr> <th>8807</th> <th>false_northing</th> <th>Falsa latitude norte</th> </tr><tr> <th>8811</th> <th>latitude_do_centro</th> <th>Latitude do centro de projeção</th> </tr><tr> <th>8812</th> <th>longitude_do_centro</th> <th>Longitude do centro de projeção</th> </tr><tr> <th>8813</th> <th>azimute</th> <th>Azimute da linha inicial</th> </tr><tr> <th>8814</th> <th>ângulo de grade corrigido</th> <th>Ângulo de Rede Retificada para Rede Esférica</th> </tr><tr> <th>8815</th> <th>fator_de_escala</th> <th>Fator de escala na linha inicial</th> </tr><tr> <th>8816</th> <th>false_easting</th> <th>Leste no centro de projeção</th> </tr><tr> <th>8817</th> <th>false_northing</th> <th>Norte no centro de projeção</th> </tr><tr> <th>8818</th> <th>pseudo_standard_parallel_1</th> <th>Latitude do paralelo pseudo padrão</th> </tr><tr> <th>8819</th> <th>fator_de_escala</th> <th>Fator de escala em paralelo pseudo padrão</th> </tr><tr> <th>8821</th> <th>latitude_de_origem</th> <th>Latitude de origem falsa</th> </tr><tr> <th>8822</th> <th>meridiano central</th> <th>Longitude de origem falsa</th> </tr><tr> <th>8823</th> <th>standard_parallel_1, standard_parallel1</th> <th>Latitude da 1ª paralelo padrão</th> </tr><tr> <th>8824</th> <th>standard_parallel_2, standard_parallel2</th> <th>Latitude do segundo paralelo padrão</th> </tr><tr> <th>8826</th> <th>false_easting</th> <th>Orientação leste em origem falsa</th> </tr><tr> <th>8827</th> <th>false_northing</th> <th>Norte em origem falsa</th> </tr><tr> <th>8830</th> <th>longitude inicial</th> <th>Longitude inicial</th> </tr><tr> <th>8831</th> <th>zona_largura</th> <th>Largura da zona</th> </tr><tr> <th>8832</th> <th>standard_parallel</th> <th>Latitude do paralelo padrão</th> </tr><tr> <th>8833</th> <td>longitude_do_centro</td> <td>Longitude de origem</td> </tr></tbody></table>
