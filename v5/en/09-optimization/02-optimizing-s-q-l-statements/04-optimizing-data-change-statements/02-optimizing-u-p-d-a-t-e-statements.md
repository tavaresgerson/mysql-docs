#### 8.2.4.2 Otimizando Comandos UPDATE

Um comando `UPDATE` é otimizado como uma `SELECT Query` com a sobrecarga adicional de uma operação de escrita (`write`). A velocidade da operação de escrita (`write`) depende da quantidade de dados sendo atualizados e do número de `Indexes` que são atualizados. `Indexes` que não são alterados não são atualizados.

Outra forma de obter `updates` rápidos é atrasar as atualizações e, em seguida, executar muitos `updates` em sequência posteriormente. Executar múltiplos `updates` em conjunto é muito mais rápido do que fazer um de cada vez se você fizer o `Lock` da tabela.

Para uma tabela `MyISAM` que usa o formato de linha dinâmico, a atualização de uma linha para um comprimento total maior pode dividir a linha. Se você fizer isso com frequência, é muito importante usar `OPTIMIZE TABLE` ocasionalmente. Consulte a Seção 13.7.2.4, “`OPTIMIZE TABLE` Statement”.