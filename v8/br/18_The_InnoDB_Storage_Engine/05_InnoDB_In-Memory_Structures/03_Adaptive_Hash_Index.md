### 17.5.3 Índice de Hash Adaptativo

O índice de hash adaptável permite que o `InnoDB` funcione mais como um banco de dados em memória em sistemas com combinações apropriadas de carga de trabalho e memória suficiente para o pool de buffers, sem sacrificar as funcionalidades transacionais ou a confiabilidade. O índice de hash adaptável é ativado pela variável `innodb_adaptive_hash_index`, ou desativado no início do servidor pela `--skip-innodb-adaptive-hash-index`.

Com base no padrão observado das pesquisas, um índice de hash é construído usando um prefixo da chave do índice. O prefixo pode ter qualquer comprimento, e pode ser que apenas alguns valores na árvore B apareçam no índice de hash. Os índices de hash são construídos sob demanda para as páginas do índice que são acessadas com frequência.

Se uma tabela cabe quase inteiramente na memória principal, um índice de hash acelera as consultas ao permitir a busca direta de qualquer elemento, transformando o valor do índice em um tipo de ponteiro. O `InnoDB` possui um mecanismo que monitora as pesquisas de índice. Se o `InnoDB` perceber que as consultas poderiam se beneficiar da construção de um índice de hash, ele faz isso automaticamente.

Com algumas cargas de trabalho, a aceleração das consultas de índice de hash geralmente supera o trabalho extra para monitorar as consultas de índice e manter a estrutura do índice de hash. O acesso ao índice de hash adaptável pode, às vezes, se tornar uma fonte de contenção em cargas de trabalho pesadas, como várias junções concorrentes. As consultas com operadores `LIKE` e wildcards `%` também tendem a não se beneficiar. Para cargas de trabalho que não se beneficiam do índice de hash adaptável, desabilitá-lo reduz o overhead de desempenho desnecessário. Como é difícil prever antecipadamente se o índice de hash adaptável é apropriado para um sistema e uma carga de trabalho em particular, considere executar benchmarks com ele habilitado e desabilitado.

O recurso de índice de hash adaptável está particionado. Cada índice está vinculado a uma partição específica, e cada partição é protegida por um bloqueio separado. A partição é controlada pela variável `innodb_adaptive_hash_index_parts`. A variável `innodb_adaptive_hash_index_parts` é definida como 8 por padrão. O valor máximo é 512.

Você pode monitorar o uso e a concorrência do índice de hash adaptativo na seção `SEMAPHORES` do output `SHOW ENGINE INNODB STATUS`. Se houver vários threads aguardando por latches rw-criados em `btr0sea.c`, considere aumentar o número de partições do índice de hash adaptativo ou desativar o índice de hash adaptativo.

Para obter informações sobre as características de desempenho dos índices de hash, consulte a Seção 10.3.9, “Comparação entre Índices B-Tree e Hash”.
