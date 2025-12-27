#### 10.10.2.3 Estratégia de Inserção no Ponto Médio

Por padrão, o sistema de gerenciamento de cache de chaves usa uma estratégia LRU simples para escolher os blocos de cache de chaves a serem removidos, mas também suporta um método mais sofisticado chamado estratégia de inserção no ponto médio.

Ao usar a estratégia de inserção no ponto médio, a cadeia LRU é dividida em duas partes: uma sublista quente e uma sublista morna. O ponto de divisão entre as duas partes não é fixo, mas o sistema de gerenciamento de cache de chaves cuida para que a parte quente não seja “muito curta”, sempre contendo pelo menos `key_cache_division_limit` por cento dos blocos do cache de chaves. `key_cache_division_limit` é um componente das variáveis estruturadas do cache de chaves, então seu valor é um parâmetro que pode ser definido por cache.

Quando um bloco de índice é lido de uma tabela para o cache de chaves, ele é colocado no final da sublista quente. Após um certo número de acessos (acessos ao bloco), ele é promovido para a sublista quente. Atualmente, o número de acessos necessários para promover um bloco (3) é o mesmo para todos os blocos de índice.

Um bloco promovido para a sublista quente é colocado no final da lista. O bloco então circula dentro dessa sublista. Se o bloco permanecer no início da sublista por um tempo suficientemente longo, ele é demitido para a sublista quente. Esse tempo é determinado pelo valor do componente `key_cache_age_threshold` do cache de chaves.

O valor do limiar prescreve que, para um cache de chaves contendo *`N`* blocos, o bloco no início da sublista quente não acessado nas últimas `N * key_cache_age_threshold / 100` acessos deve ser movido para o início da sublista quente. Ele então se torna o primeiro candidato à remoção, porque os blocos para substituição sempre são tomados do início da sublista quente.

A estratégia de inserção no ponto médio permite que você mantenha blocos mais valiosos sempre no cache. Se você prefere usar a estratégia LRU simples, deixe o valor de `key_cache_division_limit` definido para o seu valor padrão de 100.

A estratégia de inserção no ponto médio ajuda a melhorar o desempenho quando a execução de uma consulta que requer uma varredura do índice efetivamente expulsa todos os blocos do índice correspondentes a nós de B-tree de alto nível valiosos. Para evitar isso, você deve usar uma estratégia de inserção no ponto médio com o `key_cache_division_limit` definido para muito menos que 100. Então, nós valiosos frequentemente atingidos também são preservados na sublista quente durante uma operação de varredura do índice.