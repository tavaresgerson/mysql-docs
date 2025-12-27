## 18.11 Visão geral da arquitetura do mecanismo de armazenamento do MySQL

18.11.1 Arquitetura de mecanismo de armazenamento plugável

18.11.2 A camada comum do servidor de banco de dados

A arquitetura de mecanismo de armazenamento plugável do MySQL permite que um profissional de banco de dados selecione um mecanismo de armazenamento especializado para uma necessidade específica da aplicação, sendo completamente isento da necessidade de gerenciar quaisquer requisitos específicos de codificação da aplicação. A arquitetura do servidor MySQL isola o programador da aplicação e o DBA de todos os detalhes de implementação de nível baixo no nível de armazenamento, fornecendo um modelo de aplicação e API consistentes e fáceis. Assim, embora existam diferentes capacidades entre diferentes mecanismos de armazenamento, a aplicação é protegida dessas diferenças.

A arquitetura de mecanismo de armazenamento plugável do MySQL é mostrada na Figura 18.3, “Arquitetura do MySQL com Mecanismos de Armazenamento Plugáveis”.

**Figura 18.3 Arquitetura do MySQL com Mecanismos de Armazenamento Plugáveis**

![Diagrama da arquitetura do MySQL mostrando conectores, interfaces, mecanismos de armazenamento plugáveis, o sistema de arquivos com arquivos e logs.](images/mysql-architecture.png)

A arquitetura de mecanismo de armazenamento plugável fornece um conjunto padrão de serviços de gerenciamento e suporte que são comuns entre todos os mecanismos de armazenamento subjacentes. Os próprios mecanismos de armazenamento são os componentes do servidor de banco de dados que realmente realizam ações nos dados subjacentes que são mantidos no nível do servidor físico.

Essa arquitetura eficiente e modular oferece enormes benefícios para aqueles que desejam direcionar especificamente uma necessidade de aplicação particular—como armazenamento de dados, processamento de transações ou situações de alta disponibilidade—enquanto desfrutam da vantagem de utilizar um conjunto de interfaces e serviços que são independentes de qualquer um dos mecanismos de armazenamento.

O programador de aplicativos e o DBA interagem com o banco de dados MySQL por meio de APIs e camadas de serviço que estão acima dos motores de armazenamento. Se as mudanças no aplicativo exigirem alterações no motor de armazenamento subjacente ou a adição de um ou mais motores de armazenamento para atender a novas necessidades, não são necessárias mudanças significativas no código ou no processo para que tudo funcione. A arquitetura do servidor MySQL protege o aplicativo da complexidade subjacente do motor de armazenamento, apresentando uma API consistente e fácil de usar que se aplica a todos os motores de armazenamento.