## 15.11 Visão geral da arquitetura do mecanismo de armazenamento do MySQL

A arquitetura de motor de armazenamento plugável do MySQL permite que um profissional de banco de dados selecione um motor de armazenamento especializado para uma necessidade específica de aplicação, enquanto está completamente protegido da necessidade de gerenciar quaisquer requisitos específicos de codificação de aplicativos. A arquitetura do servidor MySQL isola o programador de aplicativos e o DBA de todos os detalhes de implementação de nível baixo no nível de armazenamento, fornecendo um modelo e API de aplicativo consistentes e fáceis. Assim, embora existam diferentes capacidades em diferentes motores de armazenamento, o aplicativo é protegido dessas diferenças.

A arquitetura de motor de armazenamento plugável oferece um conjunto padrão de serviços de gerenciamento e suporte que são comuns entre todos os motores de armazenamento subjacentes. Os próprios motores de armazenamento são os componentes do servidor de banco de dados que realmente realizam ações nos dados subjacentes que são mantidos no nível do servidor físico.

Essa arquitetura eficiente e modular oferece enormes benefícios para aqueles que desejam atender especificamente a uma necessidade de aplicação particular, como armazenamento de dados, processamento de transações ou situações de alta disponibilidade, enquanto desfruta da vantagem de utilizar um conjunto de interfaces e serviços que são independentes de qualquer motor de armazenamento.

O programador de aplicativos e o DBA interagem com o banco de dados MySQL por meio de APIs e camadas de serviço que estão acima dos motores de armazenamento. Se as mudanças no aplicativo acarretarem requisitos que exijam a mudança do motor de armazenamento subjacente ou que um ou mais motores de armazenamento sejam adicionados para suportar novas necessidades, não são necessárias mudanças significativas de codificação ou processo para fazer as coisas funcionarem. A arquitetura do servidor MySQL protege o aplicativo da complexidade subjacente do motor de armazenamento, apresentando uma API consistente e fácil de usar que se aplica em todos os motores de armazenamento.

### 15.11.1 Arquitetura de motor de armazenamento intercambiável

O MySQL Server utiliza uma arquitetura de motor de armazenamento plugável que permite que os motores de armazenamento sejam carregados e descarregados de um servidor MySQL em execução.

**Conectar um motor de armazenamento**

Antes que um mecanismo de armazenamento possa ser usado, a biblioteca compartilhada do plugin do mecanismo de armazenamento deve ser carregada no MySQL usando a declaração `INSTALL PLUGIN`. Por exemplo, se o plugin do mecanismo de armazenamento `EXAMPLE` é chamado de `example` e a biblioteca compartilhada é chamada de `ha_example.so`, você carrega-a com a seguinte declaração:

```sql
INSTALL PLUGIN example SONAME 'ha_example.so';
```

Para instalar um motor de armazenamento plugável, o arquivo do plugin deve estar localizado no diretório do plugin MySQL, e o usuário que emite a declaração `INSTALL PLUGIN` deve ter privilégio `INSERT` para a tabela `mysql.plugin`.

A biblioteca compartilhada deve estar localizada no diretório do plugin do servidor MySQL, cujo local é fornecido pela variável de sistema `plugin_dir`.

Desconectar um motor de armazenamento

Para desconectar um motor de armazenamento, use a declaração `UNINSTALL PLUGIN`:

```sql
UNINSTALL PLUGIN example;
```

Se você desconectar um mecanismo de armazenamento que é necessário para tabelas existentes, essas tabelas se tornam inacessíveis, mas ainda estão presentes no disco (onde aplicável). Certifique-se de que não há tabelas usando um mecanismo de armazenamento antes de desconectar o mecanismo de armazenamento.

### 15.11.1 Camada do Servidor de Banco Comum

Um mecanismo de armazenamento plugável MySQL é o componente no servidor de banco de dados MySQL que é responsável por realizar as operações de E/S de dados reais para um banco de dados, além de habilitar e impor determinados conjuntos de recursos que visam uma necessidade específica de uma aplicação. Um dos principais benefícios de usar mecanismos de armazenamento específicos é que você recebe apenas os recursos necessários para uma aplicação específica, e, portanto, tem menos sobrecarga do sistema no banco de dados, com o resultado final sendo mais eficiente e com maior desempenho do banco de dados. Esta é uma das razões pelas quais o MySQL sempre foi conhecido por ter um desempenho tão alto, igualando ou superando bancos de dados monolíticos proprietários em benchmarks padrão da indústria.

Do ponto de vista técnico, quais são alguns dos componentes de infraestrutura de suporte únicos que estão em um motor de armazenamento? Algumas das principais diferenças de recursos incluem:

* Concorrência*: Algumas aplicações têm requisitos de bloqueio mais granulares (como bloqueios em nível de string) do que outras. Escolher a estratégia de bloqueio correta pode reduzir o overhead e, portanto, melhorar o desempenho geral. Esta área também inclui suporte para capacidades como controle de concorrência de múltiplas versões ou leitura de "instantâneo".

* Suporte de transações: Nem todas as aplicações precisam de transações, mas para aquelas que precisam, há requisitos bem definidos, como a conformidade ACID e mais.

* *Integridade referencial*: A necessidade de o servidor impor a integridade referencial de banco de dados relacional através de chaves estrangeiras definidas pelo DDL.

* Armazenamento físico: Isso envolve tudo, desde o tamanho geral da página para tabelas e índices, até o formato usado para armazenar dados no disco físico.

* Suporte ao índice: Diferentes cenários de aplicação tendem a se beneficiar de diferentes estratégias de índice. Cada mecanismo de armazenamento geralmente tem seus próprios métodos de indexação, embora alguns (como índices de árvore B) sejam comuns a quase todos os motores.

* *Caches de memória*: Diferentes aplicativos respondem melhor a algumas estratégias de cache de memória do que a outras, portanto, embora alguns caches de memória sejam comuns a todos os motores de armazenamento (como os usados para conexões de usuário ou o Cache de consulta de alta velocidade do MySQL), outros são definidos de forma única apenas quando um motor de armazenamento específico é utilizado.

* *Ajudas de desempenho*: Isso inclui múltiplos threads de E/S para operações paralelas, concorrência de threads, verificação de ponto de controle de banco de dados, manipulação de inserção em massa e muito mais.

* *Características de alvo diversificadas*: Isso pode incluir suporte para operações geográficas, restrições de segurança para certas operações de manipulação de dados e outras características semelhantes.

Cada conjunto de componentes da infraestrutura de motor de armazenamento plugável é projetado para oferecer um conjunto seletivo de benefícios para uma aplicação particular. Por outro lado, evitar um conjunto de recursos de componentes ajuda a reduzir o overhead desnecessário. É lógico que entender o conjunto de requisitos de uma aplicação particular e selecionar o motor de armazenamento MySQL adequado pode ter um impacto dramático na eficiência e desempenho do sistema como um todo.