## 14.21 Plugin memcached do InnoDB

14.21.1 Benefícios do Plugin memcached do InnoDB

14.21.2 Arquitetura do memcached do InnoDB

14.21.3 Configurando o Plugin memcached do InnoDB

14.21.4 Considerações de Segurança para o Plugin memcached do InnoDB

14.21.5 Escrevendo Aplicações para o Plugin memcached do InnoDB

14.21.6 O Plugin memcached do InnoDB e a Replication

14.21.7 Componentes Internos do Plugin memcached do InnoDB

14.21.8 Solução de Problemas (Troubleshooting) do Plugin memcached do InnoDB

O plugin **memcached** do `InnoDB` (`daemon_memcached`) fornece um daemon **memcached** integrado que armazena e recupera dados automaticamente de tabelas `InnoDB`, transformando o servidor MySQL em um rápido "key-value store". Em vez de formular Queries em SQL, você pode usar operações simples de `get`, `set` e `incr` que evitam a sobrecarga de performance associada ao parsing de SQL e à construção de um plano de otimização de Query. Você também pode acessar as mesmas tabelas `InnoDB` através de SQL para conveniência, Queries complexas, operações em massa (bulk operations) e outros pontos fortes de software de Database tradicional.

Essa interface "estilo NoSQL" utiliza a **memcached** API para acelerar operações de Database, permitindo que o `InnoDB` lide com o caching de memória usando seu mecanismo de Buffer Pool. Dados modificados através de operações **memcached**, como `add`, `set` e `incr`, são armazenados em disco, em tabelas `InnoDB`. A combinação da simplicidade do **memcached** com a confiabilidade e consistência do `InnoDB` fornece aos usuários o melhor dos dois mundos, conforme explicado na Seção 14.21.1, "Benefícios do Plugin memcached do InnoDB". Para uma visão geral da arquitetura, consulte a Seção 14.21.2, "Arquitetura do memcached do InnoDB".