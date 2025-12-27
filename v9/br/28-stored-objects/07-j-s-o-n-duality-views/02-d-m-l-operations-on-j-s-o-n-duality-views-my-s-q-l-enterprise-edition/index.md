### 27.7.2 Operações DML em Visualizações de Dualidade JSON (Edição Empresarial do MySQL)

27.7.2.1 Exemplos de Operações DML em Visualizações de Dualidade JSON

27.7.2.2 Visualizações de Dualidade JSON—Concorrência

27.7.2.3 Requisitos para Operações DML e Annotações de Tabela

27.7.2.4 Limitações em Operações DML

Na Edição Empresarial do MySQL, as operações DML são suportadas em visualizações de dualidade JSON. O DML permite operações `INSERT`, `UPDATE` e `DELETE` sem problemas diretamente em documentos JSON amigáveis ao desenvolvedor, garantindo a consistência dos dados através do esquema relacional subjacente.

As operações DML em visualizações de dualidade JSON envolvem várias etapas orquestradas que trabalham juntas:

* Validação do documento: A visualização de dualidade JSON valida automaticamente o documento JSON de entrada para sintaxe correta e garante que ele corresponda ao esquema esperado.

* Conversão de tipo: Os tipos de dados JSON são mapeados de forma transparente para tipos de dados do banco de dados.

* Geração de sub-instruções: A visualização de dualidade JSON descompõe e gera as operações DML necessárias direcionadas às tabelas base normalizadas.

* Execução da sub-instrução: A etapa final é a execução das sub-instruções DML sequenciadas como uma única operação atômica.

* Controle de concorrência otimista: Como medida preventiva adicional, a visualização de dualidade JSON previne operações de leitura/escrita conflitantes em chamadas REST sem estado.

As visualizações de dualidade JSON introduzem tags de modificação, que são anotações que especificam a operação pretendida (`INSERT`, `UPDATE` ou `DELETE`) em cada objeto/sub-objeto JSON. Se as tags de modificação não forem especificadas, o objeto ou sub-objeto é tratado como de leitura apenas, e as operações DML não são permitidas. Esse sistema orientado para intenção é vital para:

* Prevenir mudanças de dados acidentalmente.
* Implementar regras de negócios em todos os níveis (raiz, singleton, aninhado).

* Tornar as operações explícitas e audíveis.

A inserção de objetos para visualizações de dualidade JSON em tabelas de referência a si mesmas e em tabelas de referência circularmente é suportada.

As declarações geradas para operações DML em visualizações de dualidade JSON são executadas como declarações subseqüentes de operações DML na visualização.

A execução de declarações subseqüentes não utiliza nenhum tipo de bloqueio de metadados ou bloqueio de linha.

Se qualquer declaração subseqüente falhar, todas as declarações subseqüentes são revertidas.

Para uma coluna projetada com `AUTO_INCREMENT`, um valor para a coluna deve ser especificado explicitamente. Se não for o caso, deve ser possível deduzir o valor da coluna a partir da condição de junção; caso contrário, a operação é rejeitada com um erro.

Para a execução de todas as declarações subseqüentes geradas, os gatilhos definidos nas tabelas base de uma visualização de dualidade JSON são executados.

Para as tabelas base de visualizações de dualidade JSON vinculadas por restrições referenciais, a execução de declarações subseqüentes inclui a execução de quaisquer ações referenciais de chave estrangeira que possam ser definidas; a falha de uma operação de cascata de chave estrangeira causa a rejeição da operação DML com um erro.

As operações DML em visualizações de dualidade JSON e suas declarações subseqüentes são replicadas de forma consistente. Se a execução de qualquer declaração subseqüente falhar, quaisquer outras declarações subseqüentes que fazem parte desta operação não são replicadas.

Você deve estar ciente de que uma declaração `INSERT`, `UPDATE` ou `DELETE` em uma visualização de dualidade pode levar a múltiplas operações de inserção, atualização ou exclusão nas tabelas base da visualização.

Um documento JSON que é usado como entrada para operações de modificação de dados é validado para garantir que seu esquema corresponda ao de um documento JSON gerado pela visualização de dualidade JSON.