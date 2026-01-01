### 1.6.3 Como o MySQL lida com restrições

1.6.3.1 Restrições de índice de chave primária e índice único

1.6.3.2 Restrições de Chave Estrangeira

1.6.3.3 Restrições para dados inválidos

1.6.3.4 Restrições de ENUM e SET

O MySQL permite que você trabalhe tanto com tabelas transacionais que permitem o cancelamento, quanto com tabelas não transacionais que não permitem. Por isso, o tratamento de restrições é um pouco diferente no MySQL em comparação com outros SGBDs. Devemos lidar com o caso em que você inseriu ou atualizou muitas linhas em uma tabela não transacional para a qual as alterações não podem ser desfeitas quando ocorre um erro.

A filosofia básica é que o MySQL Server tenta gerar um erro para qualquer coisa que ele possa detectar durante a análise de uma instrução a ser executada e tenta recuperar de quaisquer erros que ocorram durante a execução da instrução. Fazemos isso na maioria dos casos, mas ainda não para todos.

As opções que o MySQL tem quando ocorre um erro são parar a instrução no meio ou recuperar o melhor possível do problema e continuar. Por padrão, o servidor segue o segundo caminho. Isso significa, por exemplo, que o servidor pode forçar valores inválidos para os valores válidos mais próximos.

Existem várias opções de modo SQL disponíveis para oferecer maior controle sobre o tratamento de valores de dados inválidos e sobre a continuidade da execução da instrução ou o cancelamento quando ocorrem erros. Com essas opções, você pode configurar o MySQL Server para agir de uma maneira mais tradicional, semelhante a outros SGBDs que rejeitam entradas inadequadas. O modo SQL pode ser definido globalmente na inicialização do servidor para afetar todos os clientes. Clientes individuais podem definir o modo SQL em tempo de execução, o que permite que cada cliente selecione o comportamento mais apropriado para suas necessidades. Consulte a Seção 5.1.10, “Modos SQL do Servidor”.

As seções a seguir descrevem como o MySQL Server lida com diferentes tipos de restrições.
