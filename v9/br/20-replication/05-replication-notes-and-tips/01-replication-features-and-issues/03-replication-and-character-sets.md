#### 19.5.1.3 Replicação e Conjuntos de Caracteres

O seguinte se aplica à replicação entre servidores MySQL que utilizam conjuntos de caracteres diferentes:

* Se a fonte tiver bancos de dados com um conjunto de caracteres diferente do valor global `character_set_server`, você deve projetar suas instruções `CREATE TABLE` de modo que elas não dependam implicitamente do conjunto de caracteres padrão do banco de dados. Uma boa solução é declarar o conjunto de caracteres e a collation explicitamente nas instruções `CREATE TABLE`.