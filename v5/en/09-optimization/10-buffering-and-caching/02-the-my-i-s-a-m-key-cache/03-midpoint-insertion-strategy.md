#### 8.10.2.3 Estratégia de Inserção pelo Ponto Médio

Por padrão, o sistema de gerenciamento de key cache usa uma estratégia LRU simples para escolher os blocks de key cache a serem removidos (evicted), mas também suporta um método mais sofisticado chamado estratégia de inserção pelo ponto médio (*midpoint insertion strategy*).

Ao usar a estratégia de inserção pelo ponto médio, a LRU chain é dividida em duas partes: uma *hot sublist* (sublista quente) e uma *warm sublist* (sublista morna). O ponto de divisão entre as duas partes não é fixo, mas o sistema de gerenciamento de key cache garante que a parte *warm* não seja "muito curta", contendo sempre pelo menos `key_cache_division_limit` por cento dos key cache blocks. `key_cache_division_limit` é um componente de variáveis estruturadas do key cache, portanto, seu valor é um parâmetro que pode ser definido por cache.

Quando um index block é lido de uma tabela para o key cache, ele é colocado no final da warm sublist. Após um certo número de *hits* (acessos ao block), ele é promovido para a hot sublist. Atualmente, o número de *hits* exigidos para promover um block (3) é o mesmo para todos os index blocks.

Um block promovido para a hot sublist é colocado no final da lista. O block então circula dentro desta sublista. Se o block permanecer no início da sublista por tempo suficiente, ele é rebaixado (*demoted*) para a warm sublist. Este tempo é determinado pelo valor do componente `key_cache_age_threshold` do key cache.

O valor do threshold (limite) prescreve que, para um key cache contendo *`N`* blocks, o block no início da hot sublist que não foi acessado dentro dos últimos `N * key_cache_age_threshold / 100` *hits* deve ser movido para o início da warm sublist. Ele então se torna o primeiro candidato para remoção (*eviction*), pois os blocks para substituição são sempre retirados do início da warm sublist.

A estratégia de inserção pelo ponto médio permite manter blocks de maior valor sempre no cache. Se você preferir usar a estratégia LRU simples (*plain*), mantenha o valor de `key_cache_division_limit` definido como seu padrão de 100.

A estratégia de inserção pelo ponto médio ajuda a melhorar o performance quando a execução de uma Query que exige um index scan efetivamente empurra para fora do cache todos os index blocks correspondentes a valiosos nós B-tree de alto nível. Para evitar isso, você deve usar uma estratégia de inserção pelo ponto médio com o `key_cache_division_limit` definido para muito menos que 100. Assim, nós valiosos e frequentemente acessados (*frequently hit*) são preservados na hot sublist também durante uma operação de index scan.