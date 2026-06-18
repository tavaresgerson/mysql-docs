## 15.11 Visão Geral da Arquitetura do Storage Engine do MySQL

15.11.1 Arquitetura Pluggable de Storage Engine

15.11.2 A Camada Comum do Servidor de Database

A arquitetura pluggable de storage engine do MySQL permite que um profissional de database selecione um storage engine especializado para uma necessidade de aplicação específica, estando completamente isento da necessidade de gerenciar quaisquer requisitos específicos de codificação da aplicação. A arquitetura do servidor MySQL isola o application programmer e o DBA de todos os detalhes de implementação de baixo nível na camada de storage, fornecendo um modelo de aplicação e uma API consistentes e fáceis. Assim, embora existam diferentes capacidades entre os diversos storage engines, a aplicação é protegida dessas diferenças.

A arquitetura pluggable de storage engine fornece um conjunto padrão de serviços de gerenciamento e suporte que são comuns a todos os storage engines subjacentes. Os próprios storage engines são os componentes do database server que realmente executam ações nos dados subjacentes mantidos no nível do physical server.

Essa arquitetura eficiente e modular oferece grandes benefícios para aqueles que desejam focar especificamente em uma necessidade particular de aplicação — como data warehousing, transaction processing ou situações de high availability — enquanto desfrutam da vantagem de utilizar um conjunto de interfaces e serviços que são independentes de qualquer storage engine específico.

O application programmer e o DBA interagem com o database MySQL através de Connector APIs e camadas de serviço que estão acima dos storage engines. Se mudanças na aplicação geram requisitos que exigem a alteração do storage engine subjacente, ou que um ou mais storage engines sejam adicionados para suportar novas necessidades, nenhuma alteração significativa de codificação (coding) ou processo é necessária para fazer as coisas funcionarem. A arquitetura do servidor MySQL protege a aplicação da complexidade subjacente do storage engine, apresentando uma API consistente e fácil de usar que se aplica a todos os storage engines.