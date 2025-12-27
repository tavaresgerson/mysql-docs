### 17.5.3 Índice Hash Adaptativo

O índice hash adaptativo permite que o `InnoDB` funcione mais como um banco de dados em memória em sistemas com combinações apropriadas de carga de trabalho e memória suficiente para o pool de buffers, sem sacrificar as características transacionais ou a confiabilidade. O índice hash adaptativo é desativado pela variável `innodb_adaptive_hash_index`, ou ativado na inicialização do servidor pelo comando `--innodb-adaptive-hash-index`.

Com base no padrão observado das pesquisas, um índice hash é construído usando um prefixo da chave do índice. O prefixo pode ter qualquer comprimento, e pode ser que apenas alguns valores na árvore B apareçam no índice hash. Os índices hash são construídos sob demanda para as páginas do índice que são acessadas com frequência.

Se uma tabela cabe quase inteiramente na memória principal, um índice hash acelera as consultas ao permitir a busca direta de qualquer elemento, transformando o valor do índice em um tipo de ponteiro. O `InnoDB` tem um mecanismo que monitora as pesquisas de índice. Se o `InnoDB` notar que as consultas poderiam se beneficiar da construção de um índice hash, ele faz isso automaticamente.

Com algumas cargas de trabalho, a aceleração das consultas por meio das pesquisas de índice hash geralmente supera o trabalho extra para monitorar as pesquisas de índice e manter a estrutura do índice hash. O acesso ao índice hash adaptativo pode, às vezes, se tornar uma fonte de contenção em cargas de trabalho pesadas, como múltiplas junções concorrentes. As consultas com operadores `LIKE` e `%` também tendem a não se beneficiar. Para cargas de trabalho que não se beneficiam do índice hash adaptativo, desativá-lo reduz o overhead de desempenho desnecessário. Como é difícil prever antecipadamente se o índice hash adaptativo é apropriado para um sistema e uma carga de trabalho específicos, considere executar benchmarks com ele ativado e desativado.

O recurso de índice de hash adaptável está particionado. Cada índice está vinculado a uma partição específica, e cada partição é protegida por um bloqueio separado. A particionamento é controlado pela variável `innodb_adaptive_hash_index_parts`. A variável `innodb_adaptive_hash_index_parts` é definida como 8 por padrão. O valor máximo é 512.

Você pode monitorar o uso e a concorrência do índice de hash adaptável na seção `SEMAPHORES` do resultado da consulta `SHOW ENGINE INNODB STATUS`. Se houver vários threads aguardando por bloqueios `rw-` criados em `btr0sea.c`, considere aumentar o número de partições do índice de hash adaptável ou desativar o índice de hash adaptável.

Para obter informações sobre as características de desempenho dos índices de hash, consulte a Seção 10.3.9, “Comparação de Índices B-Tree e Hash”.