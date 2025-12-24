### 1.7.3 Como o MySQL lida com restrições

O MySQL permite que você trabalhe tanto com tabelas transacionais que permitem o rollback quanto com tabelas não transacionais que não o permitem. Por isso, o manuseio de restrições é um pouco diferente no MySQL do que em outros DBMSs. Devemos lidar com o caso quando você inseriu ou atualizou muitas linhas em uma tabela não transacional para a qual as alterações não podem ser revertidas quando ocorre um erro.

A filosofia básica é que o MySQL Server tenta produzir um erro para qualquer coisa que ele possa detectar ao analisar uma instrução a ser executada, e tenta se recuperar de quaisquer erros que ocorram durante a execução da instrução.

As opções que o MySQL tem quando ocorre um erro são parar a instrução no meio ou recuperar o melhor possível do problema e continuar. Por padrão, o servidor segue o último curso. Isso significa, por exemplo, que o servidor pode coagir valores inválidos para os valores válidos mais próximos.

Várias opções de modo SQL estão disponíveis para fornecer maior controle sobre o manuseio de valores de dados errados e se deve continuar a execução de instruções ou abortar quando ocorrem erros. Usando essas opções, você pode configurar o MySQL Server para atuar de uma forma mais tradicional que é como outros DBMSs que rejeitam a entrada inadequada. O modo SQL pode ser definido globalmente na inicialização do servidor para afetar todos os clientes. Clientes individuais podem definir o modo SQL no tempo de execução, o que permite a cada cliente selecionar o comportamento mais apropriado para seus requisitos.

As seções a seguir descrevem como o MySQL Server lida com diferentes tipos de restrições.
