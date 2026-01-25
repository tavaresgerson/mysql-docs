### 8.10.3 O Query Cache do MySQL

8.10.3.1 Como o Query Cache Opera

8.10.3.2 Opções SELECT do Query Cache

8.10.3.3 Configuração do Query Cache

8.10.3.4 Status e Manutenção do Query Cache

Note

O query cache está descontinuado (deprecated) a partir do MySQL 5.7.20 e foi removido no MySQL 8.0.

O query cache armazena o texto de uma instrução `SELECT` juntamente com o resultado correspondente que foi enviado ao cliente. Se uma instrução idêntica for recebida posteriormente, o servidor recupera os resultados do query cache em vez de analisar (parsing) e executar a instrução novamente. O query cache é compartilhado entre sessões, de modo que um conjunto de resultados (result set) gerado por um cliente pode ser enviado em resposta à mesma Query emitida por outro cliente.

O query cache pode ser útil em um ambiente onde você tem tables que não mudam com muita frequência e para as quais o servidor recebe muitas Queries idênticas. Esta é uma situação típica para muitos Web servers que geram muitas páginas dinâmicas com base no conteúdo do Database.

O query cache não retorna dados obsoletos. Quando tables são modificadas, quaisquer entradas relevantes no query cache são descarregadas (flushed).

Note

O query cache não funciona em um ambiente onde você tem múltiplos servidores **mysqld** atualizando as mesmas tables `MyISAM`.

O query cache é usado para prepared statements sob as condições descritas na Seção 8.10.3.1, “Como o Query Cache Opera”.

Note

O query cache não é suportado para partitioned tables e é automaticamente desabilitado para Queries que envolvem partitioned tables. O query cache não pode ser habilitado para tais Queries.

A seguir, alguns dados de desempenho para o query cache. Estes resultados foram gerados pela execução do pacote de benchmark do MySQL em um sistema Linux Alpha 2×500MHz com 2GB de RAM e um query cache de 64MB.

* Se todas as Queries que você está realizando forem simples (como selecionar uma linha de uma table com uma linha), mas ainda assim diferirem de modo que as Queries não possam ser armazenadas em cache, a sobrecarga (overhead) por ter o query cache ativo é de 13%. Isso pode ser considerado o pior cenário. Na vida real, as Queries tendem a ser muito mais complicadas, de modo que a sobrecarga normalmente é significativamente menor.

* As buscas por uma única linha em uma table de linha única são 238% mais rápidas com o query cache do que sem ele. Isso pode ser considerado próximo ao ganho de velocidade mínimo esperado para uma Query que é armazenada em cache.

Para desabilitar o query cache na inicialização do servidor, defina a variável de sistema `query_cache_size` como 0. Ao desabilitar o código do query cache, não há sobrecarga perceptível.

O query cache oferece o potencial para uma melhoria substancial de desempenho, mas não assuma que ele o faça em todas as circunstâncias. Com algumas configurações de query cache ou cargas de trabalho (server workloads), você pode realmente ver uma diminuição no desempenho:

* Tenha cautela ao dimensionar o query cache de forma excessivamente grande, o que aumenta a sobrecarga (overhead) necessária para manter o cache, possivelmente excedendo o benefício de habilitá-lo. Tamanhos na casa das dezenas de megabytes são geralmente benéficos. Tamanhos na casa das centenas de megabytes podem não ser.

* A carga de trabalho do servidor (Server workload) tem um efeito significativo na eficiência do query cache. Uma mistura de Queries consistindo quase inteiramente de um conjunto fixo de instruções `SELECT` é muito mais propensa a se beneficiar da habilitação do cache do que uma mistura em que instruções `INSERT` frequentes causam invalidação contínua dos resultados no cache. Em alguns casos, uma solução alternativa (workaround) é usar a opção `SQL_NO_CACHE` para evitar que os resultados sequer entrem no cache para instruções `SELECT` que usam tables modificadas frequentemente. (Veja a Seção 8.10.3.2, “Opções SELECT do Query Cache”.)

Para verificar se a habilitação do query cache é benéfica, teste a operação do seu servidor MySQL com o cache habilitado e desabilitado. Em seguida, reteste periodicamente, pois a eficiência do query cache pode mudar à medida que a carga de trabalho do servidor (server workload) se altera.