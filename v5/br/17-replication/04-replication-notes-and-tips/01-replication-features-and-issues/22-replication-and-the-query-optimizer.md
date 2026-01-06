#### 16.4.1.22 Replicação e o otimizador de consultas

É possível que os dados da fonte e da replica se tornem diferentes se uma declaração for escrita de maneira que a modificação dos dados seja não determinística; ou seja, deixada ao critério do otimizador de consultas. (Em geral, essa não é uma boa prática, mesmo fora da replicação.) Exemplos de declarações não determinísticas incluem as declarações `DELETE` ou `UPDATE` que usam `LIMIT` sem a cláusula `ORDER BY`; consulte Seção 16.4.1.17, “Replicação e LIMIT” para uma discussão detalhada sobre isso.
