#### 8.2.4.2. Otimizando declarações UPDATE

Uma declaração de atualização é otimizada como uma consulta `SELECT` com o overhead adicional de uma escrita. A velocidade da escrita depende da quantidade de dados sendo atualizados e do número de índices que estão sendo atualizados. Os índices que não são alterados não são atualizados.

Outra maneira de obter atualizações rápidas é adiar as atualizações e depois fazer muitas atualizações em sequência mais tarde. Realizar várias atualizações ao mesmo tempo é muito mais rápido do que fazer uma de cada vez, se você bloquear a tabela.

Para uma tabela `MyISAM` que usa o formato de linha dinâmico, atualizar uma linha para um comprimento total mais longo pode dividir a linha. Se você fizer isso com frequência, é muito importante usar `OPTIMIZE TABLE` ocasionalmente. Veja a Seção 13.7.2.4, “Instrução OPTIMIZE TABLE”.
