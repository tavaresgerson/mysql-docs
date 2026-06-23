## 16.4 Cache de Objeto do Dicionário

O cache de objetos do dicionário é um cache global compartilhado que armazena objetos de dados de dicionário a que se acessou anteriormente na memória para permitir a reutilização de objetos e minimizar o I/O de disco. Semelhante a outros mecanismos de cache utilizados pelo MySQL, o cache de objetos do dicionário utiliza uma estratégia de expulsão baseada em LRU (Least Recently Used) para expulsar os objetos menos recentemente utilizados da memória.

O cache de objetos do dicionário compreende partições de cache que armazenam diferentes tipos de objetos. Alguns limites de tamanho das partições de cache são configuráveis, enquanto outros são codificados de forma fixa.

* **partição de cache de definição de tablespace**: Armazena objetos de definição de tablespace. A opção `tablespace_definition_cache` define um limite para o número de objetos de definição de tablespace que podem ser armazenados na cache do objeto de dicionário. O valor padrão é 256.

* **partição de cache de definição de esquema**: Armazena objetos de definição de esquema. A opção `schema_definition_cache` define um limite para o número de objetos de definição de esquema que podem ser armazenados na cache do objeto de dicionário. O valor padrão é 256.

* **partição de cache de definição de tabela**: Armazena objetos de definição de tabela. O limite do objeto é definido pelo valor de `max_connections`, que tem um valor padrão de 151.

A partição de cache de definição de tabela existe em paralelo com o cache de definição de tabela que é configurado usando a opção de configuração `table_definition_cache`. Ambos os caches armazenam definições de tabela, mas servem partes diferentes do servidor MySQL. Os objetos em um cache não dependem da existência de objetos no outro.

* **partição de cache de definição de programa armazenado**: Armazena objetos de definição de programa armazenado. A opção `stored_program_definition_cache` define um limite para o número de objetos de definição de programa armazenado que podem ser armazenados na cache do objeto de dicionário. O valor padrão é 256.

A partição de cache de definição de programa armazenada existe em paralelo com os caches de procedimentos armazenados e funções armazenadas que são configurados usando a opção `stored_program_cache`.

A opção `stored_program_cache` define um limite superior suave para o número de procedimentos ou funções armazenadas em cache por conexão, e o limite é verificado cada vez que uma conexão executa um procedimento ou função armazenada. A partição de cache de definição de programa armazenado, por outro lado, é um cache compartilhado que armazena objetos de definição de programas armazenados para outros propósitos. A existência de objetos na partição de cache de definição de programa armazenado não depende da existência de objetos na cache de procedimentos armazenados ou na cache de funções armazenadas, e vice-versa.

* **partição de cache de definição de conjunto de caracteres**: Armazena objetos de definição de conjunto de caracteres e tem um limite de objeto codificado em hardcode de 256.

* **partição de cache de definição de collation**: Armazena objetos de definição de collation e tem um limite de objeto codificado em hard que é de 256.

Para obter informações sobre os valores válidos das opções de configuração da cache do objeto do dicionário, consulte a Seção 7.1.8, “Variáveis do sistema do servidor”.