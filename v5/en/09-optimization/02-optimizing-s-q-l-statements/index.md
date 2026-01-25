## 8.2 Otimizando Instruções SQL

8.2.1 Otimizando Instruções SELECT

8.2.2 Otimizando Subqueries, Derived Tables e Referências a View

8.2.3 Otimizando Queries INFORMATION_SCHEMA

8.2.4 Otimizando Instruções de Alteração de Dados

8.2.5 Otimizando Privilégios de Database

8.2.6 Outras Dicas de Otimização

A lógica central de uma aplicação de Database é executada por meio de instruções SQL, sejam elas emitidas diretamente por um interpretador ou submetidas em segundo plano (behind the scenes) por meio de uma API. As diretrizes de tuning nesta seção ajudam a acelerar todos os tipos de aplicações MySQL. As diretrizes cobrem operações SQL que leem e gravam dados, o overhead em segundo plano para operações SQL em geral e operações usadas em cenários específicos, como o monitoramento de Database.