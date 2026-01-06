## 15.11 Visão geral da arquitetura do mecanismo de armazenamento do MySQL

15.11.1 Arquitetura de Motor de Armazenamento Desmontável

15.11.1 Camada do Servidor de Banco de Dados Comum

A arquitetura do mecanismo de armazenamento plugável do MySQL permite que um profissional de banco de dados selecione um mecanismo de armazenamento especializado para uma necessidade específica da aplicação, enquanto está completamente protegido da necessidade de gerenciar quaisquer requisitos específicos de codificação da aplicação. A arquitetura do servidor MySQL isola o programador da aplicação e o DBA de todos os detalhes de implementação de nível baixo no nível de armazenamento, fornecendo um modelo e uma API de aplicação consistentes e fáceis. Assim, embora existam diferentes capacidades em diferentes mecanismos de armazenamento, a aplicação está protegida dessas diferenças.

A arquitetura do motor de armazenamento plugável oferece um conjunto padrão de serviços de gerenciamento e suporte que são comuns entre todos os motores de armazenamento subjacentes. Os próprios motores de armazenamento são os componentes do servidor de banco de dados que realmente realizam ações nos dados subjacentes que são mantidos no nível do servidor físico.

Essa arquitetura eficiente e modular oferece enormes benefícios para aqueles que desejam atender especificamente a uma necessidade de aplicação particular, como armazenamento de dados, processamento de transações ou situações de alta disponibilidade, enquanto desfrutam da vantagem de utilizar um conjunto de interfaces e serviços que são independentes de qualquer motor de armazenamento.

O programador de aplicativos e o DBA interagem com o banco de dados MySQL por meio de APIs e camadas de serviço que estão acima dos motores de armazenamento. Se as mudanças no aplicativo exigirem alterações no motor de armazenamento subjacente ou a adição de um ou mais motores de armazenamento para atender a novas necessidades, não são necessárias mudanças significativas no código ou no processo para que tudo funcione. A arquitetura do servidor MySQL protege o aplicativo da complexidade subjacente do motor de armazenamento, apresentando uma API consistente e fácil de usar que se aplica a todos os motores de armazenamento.
