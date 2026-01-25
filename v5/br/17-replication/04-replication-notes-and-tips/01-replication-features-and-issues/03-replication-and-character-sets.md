#### 16.4.1.3 Replicação e Character Sets

O seguinte se aplica à replicação entre servidores MySQL que usam diferentes character sets:

* Se a origem (source) tiver databases com um character set diferente do valor global de [`character_set_server`](server-system-variables.html#sysvar_character_set_server), você deve projetar suas instruções [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") para que elas não dependam implicitamente do character set padrão do database. Uma boa solução alternativa é declarar explicitamente o character set e a collation nas instruções [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement").