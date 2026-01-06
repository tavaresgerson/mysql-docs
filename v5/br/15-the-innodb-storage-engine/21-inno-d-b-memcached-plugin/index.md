## 14.21 Plugin InnoDB memcached

14.21.1 Benefícios do Plugin memcached do InnoDB

14.21.2 Arquitetura do memcached InnoDB

14.21.3 Configurando o Plugin InnoDB memcached

14.21.4 Considerações de segurança para o plugin InnoDB memcached

14.21.5 Escrevendo Aplicativos para o Plugin InnoDB memcached

14.21.6 O Plugin e a Replicação do memcached do InnoDB

14.21.7 Interiores do Plugin memcached do InnoDB

14.21.8 Solução de problemas do plugin InnoDB memcached

O plugin `InnoDB **memcached**` (`daemon_memcached`) fornece um daemon **memcached** integrado que armazena e recupera dados automaticamente das tabelas `InnoDB`, transformando o servidor MySQL em um "armazenamento de chave-valor" rápido. Em vez de formular consultas em SQL, você pode usar operações simples `get`, `set` e `incr` que evitam o overhead de desempenho associado à análise e construção de uma consulta do SQL. Você também pode acessar as mesmas tabelas `InnoDB` através do SQL para conveniência, consultas complexas, operações em massa e outras vantagens do software de banco de dados tradicional.

Essa interface de “estilo NoSQL” utiliza a API do **memcached** para acelerar as operações de banco de dados, permitindo que o `InnoDB` gerencie o cache de memória usando seu mecanismo de pool de buffers. Os dados modificados por operações do **memcached**, como `add`, `set` e `incr`, são armazenados em disco, nas tabelas do `InnoDB`. A combinação da simplicidade do **memcached** e da confiabilidade e consistência do `InnoDB` oferece aos usuários o melhor de ambos os mundos, conforme explicado na Seção 14.21.1, “Benefícios do Plugin InnoDB memcached”. Para uma visão geral da arquitetura, consulte a Seção 14.21.2, “Arquitetura InnoDB memcached”.
