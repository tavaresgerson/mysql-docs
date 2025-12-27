## Cache de Objetos de Dicionário

O cache de objetos de dicionário é um cache global compartilhado que armazena objetos de dicionário de dados acessados anteriormente na memória para permitir a reutilização de objetos e minimizar o I/O de disco. Semelhante a outros mecanismos de cache usados pelo MySQL, o cache de objetos de dicionário utiliza uma estratégia de evicção baseada em LRU (Least Recently Used) para remover objetos menos recentemente usados da memória.

O cache de objetos de dicionário é composto por partições de cache que armazenam diferentes tipos de objetos. Alguns limites de tamanho de partição de cache são configuráveis, enquanto outros são hardcoded.

* **partição de cache de definição de tablespace**: Armazena objetos de definição de tablespace. A opção `tablespace_definition_cache` define um limite para o número de objetos de definição de tablespace que podem ser armazenados no cache de objetos de dicionário. O valor padrão é 256.

* **partição de cache de definição de schema**: Armazena objetos de definição de schema. A opção `schema_definition_cache` define um limite para o número de objetos de definição de schema que podem ser armazenados no cache de objetos de dicionário. O valor padrão é 256.

* **partição de cache de definição de table**: Armazena objetos de definição de table. O limite de objetos é definido pelo valor de `max_connections`, que tem um valor padrão de 151.

A partição de cache de definição de table existe em paralelo com a cache de definição de table que é configurada usando a opção de configuração `table_definition_cache`. Ambos os caches armazenam definições de tabelas, mas servem partes diferentes do servidor MySQL. Os objetos em um cache não dependem da existência de objetos no outro.

* **partição de cache de definição de programas armazenados**: Armazena objetos de definição de programas armazenados. A opção `stored_program_definition_cache` define um limite para o número de objetos de definição de programas armazenados que podem ser armazenados na cache do objeto de dicionário. O valor padrão é 256.

  A partição de cache de definição de programas armazenados existe em paralelo com as caches de procedimentos armazenados e funções armazenadas que são configuradas usando a opção `stored_program_cache`.

  A opção `stored_program_cache` define um limite superior flexível para o número de procedimentos ou funções armazenadas na cache por conexão, e o limite é verificado cada vez que uma conexão executa um procedimento ou função armazenado. A partição de cache de definição de programas armazenados, por outro lado, é uma cache compartilhada que armazena objetos de definição de programas armazenados para outros propósitos. A existência de objetos na partição de cache de definição de programas armazenados não depende da existência de objetos na cache de procedimentos armazenados ou na cache de funções armazenadas, e vice-versa.

* **partição de cache de definição de conjuntos de caracteres**: Armazena objetos de definição de conjuntos de caracteres e tem um limite de objeto codificado em hardcode de 256.

* **partição de cache de definição de colunas**: Armazena objetos de definição de colunas e tem um limite de objeto codificado em hardcode de 256.

Para obter informações sobre os valores válidos para as opções de configuração da cache do objeto de dicionário, consulte a Seção 7.1.8, “Variáveis do Sistema do Servidor”.