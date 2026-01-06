### 11.4.8 Otimização da Análise Espacial

Para tabelas `MyISAM` e `InnoDB`, as operações de pesquisa em colunas que contêm dados espaciais podem ser otimizadas usando índices `SPATIAL`. As operações mais comuns são:

- Consultas de ponto que buscam todos os objetos que contêm um ponto dado

- Região: consultas que buscam todos os objetos que se sobrepõem a uma determinada região

O MySQL utiliza **R-Trees com divisão quadrática** para índices **SPATIAL** em colunas espaciais. Um índice **SPATIAL** é construído usando o retângulo de delimitação mínima (MBR) de uma geometria. Para a maioria das geometrias, o MBR é um retângulo mínimo que envolve as geometrias. Para linhas horizontais ou verticais, o MBR é um retângulo degenerado na linha. Para um ponto, o MBR é um retângulo degenerado no ponto.

É também possível criar índices normais em colunas espaciais. Em um índice não `SPATIAL`, você deve declarar um prefixo para qualquer coluna espacial, exceto para colunas `POINT`.

`MyISAM` e `InnoDB` suportam tanto índices `SPATIAL` quanto não `SPATIAL`. Outros motores de armazenamento suportam índices não `SPATIAL`, conforme descrito na Seção 13.1.14, “Instrução CREATE INDEX”.
