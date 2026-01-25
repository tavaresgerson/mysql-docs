### 11.4.8 Otimizando Análise Espacial

Para tabelas `MyISAM` e `InnoDB`, as operações de busca em colunas contendo dados espaciais podem ser otimizadas usando `SPATIAL` indexes. As operações mais típicas são:

*   `Point queries` que buscam por todos os objetos que contêm um dado `point`
*   `Region queries` que buscam por todos os objetos que se sobrepõem a uma dada região

O MySQL utiliza **R-Trees with quadratic splitting** para `SPATIAL` indexes em colunas espaciais. Um `SPATIAL` index é construído usando o `minimum bounding rectangle` (MBR) de uma geometria. Para a maioria das geometrias, o MBR é um retângulo mínimo que envolve as geometrias. Para um `linestring` horizontal ou vertical, o MBR é um retângulo degenerado no `linestring`. Para um `point`, o MBR é um retângulo degenerado no `point`.

Também é possível criar `indexes` normais em colunas espaciais. Em um `index` não-`SPATIAL`, você deve declarar um prefixo para qualquer coluna espacial, exceto para colunas `POINT`.

`MyISAM` e `InnoDB` suportam tanto `SPATIAL` quanto `non-SPATIAL` indexes. Outras `storage engines` suportam `non-SPATIAL` indexes, conforme descrito na Seção 13.1.14, “CREATE INDEX Statement”.