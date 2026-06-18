## 17.20 Plugin InnoDB memcached

17.20.1 Benefícios do Plugin memcached do InnoDB

17.20.2 Arquitetura do memcached InnoDB

17.20.3 Configurando o Plugin InnoDB memcached

17.20.4 InnoDB memcached Suporte a múltiplas consultas get e Range Query

17.20.5 Considerações de segurança para o plugin InnoDB memcached

17.20.6 Escrevendo Aplicativos para o Plugin memcached do InnoDB

17.20.7 O Plugin e a Replicação do memcached do InnoDB

17.20.8 Interiores do Plugin memcached do InnoDB

17.20.9 Solução de problemas do plugin InnoDB memcached

Importante

O plugin `InnoDB` **memcached** foi removido no MySQL 8.3.0 e foi descontinuado no MySQL 8.0.22.

O plugin `InnoDB` **memcached** (`daemon_memcached`) fornece um daemon **memcached** integrado que armazena e recupera dados automaticamente de tabelas `InnoDB`, transformando o servidor MySQL em um "armazenamento de chave-valor" rápido. Em vez de formular consultas em SQL, você pode usar operações simples `get`, `set` e `incr` que evitam o overhead de desempenho associado à análise e construção de um plano de otimização de consulta em SQL. Você também pode acessar as mesmas tabelas `InnoDB` através do SQL para conveniência, consultas complexas, operações em massa e outras vantagens do software de banco de dados tradicional.

Essa interface de “estilo NoSQL” utiliza a API do **memcached** para acelerar as operações de banco de dados, permitindo que o `InnoDB` gerencie o cache de memória usando seu mecanismo de pool de buffers. Os dados modificados por operações do **memcached**, como `add`, `set` e `incr`, são armazenados em disco, nas tabelas do `InnoDB`. A combinação da simplicidade do **memcached** e da confiabilidade e consistência do `InnoDB` oferece aos usuários o melhor de ambos os mundos, conforme explicado na Seção 17.20.1, “Benefícios do Plugin InnoDB memcached”. Para uma visão geral arquitetônica, consulte a Seção 17.20.2, “Arquitetura InnoDB memcached”.
