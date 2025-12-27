### 1.7.3 Como o MySQL lida com restrições

O MySQL permite que você trabalhe tanto com tabelas transacionais que permitem o rollback quanto com tabelas não transacionais que não o permitem. Por isso, o tratamento de restrições é um pouco diferente no MySQL em comparação com outros SGBDs. Devemos lidar com o caso em que você inseriu ou atualizou muitas linhas em uma tabela não transacional para a qual as alterações não podem ser revertidas quando ocorre um erro.

A filosofia básica é que o MySQL Server tenta produzir um erro para qualquer coisa que ele possa detectar durante a análise de uma instrução a ser executada e tenta se recuperar de quaisquer erros que ocorram durante a execução da instrução. Fazemos isso na maioria dos casos, mas ainda não em todos.

As opções que o MySQL tem quando ocorre um erro são parar a instrução no meio ou recuperar o melhor possível do problema e continuar. Por padrão, o servidor segue o segundo curso. Isso significa, por exemplo, que o servidor pode forçar valores inválidos para os valores válidos mais próximos.

Várias opções de modo SQL estão disponíveis para fornecer maior controle sobre o tratamento de valores de dados inválidos e se continuar a execução da instrução ou abortar quando ocorrem erros. Usando essas opções, você pode configurar o MySQL Server para agir de uma maneira mais tradicional, semelhante a outros SGBDs que rejeitam entradas inadequadas. O modo SQL pode ser definido globalmente na inicialização do servidor para afetar todos os clientes. Clientes individuais podem definir o modo SQL em tempo de execução, o que permite que cada cliente selecione o comportamento mais apropriado para suas necessidades. Veja a Seção 7.1.11, “Modos SQL do Servidor”.

As seções seguintes descrevem como o MySQL Server lida com diferentes tipos de restrições.