### 1.6.3 Como o MySQL Gerencia Constraints

1.6.3.1 Constraints de PRIMARY KEY e UNIQUE Index

1.6.3.2 Constraints de FOREIGN KEY

1.6.3.3 Constraints em Dados Inválidos

1.6.3.4 Constraints ENUM e SET

O MySQL permite que você trabalhe tanto com tabelas transacionais que permitem Rollback quanto com tabelas não transacionais que não o permitem. Por causa disso, o tratamento de Constraints é um pouco diferente no MySQL em comparação com outros DBMSs. Devemos lidar com a situação em que você inseriu ou atualizou muitas linhas em uma tabela não transacional e as alterações não podem ser revertidas (rolled back) quando um erro ocorre.

A filosofia básica é que o MySQL Server tenta gerar um erro para tudo o que consegue detectar durante o parsing de uma instrução a ser executada e tenta se recuperar de quaisquer erros que ocorram durante a execução dessa instrução. Fazemos isso na maioria dos casos, mas ainda não em todos.

As opções que o MySQL tem quando um erro ocorre são: interromper a instrução no meio ou recuperar-se do problema da melhor forma possível e continuar. Por padrão, o servidor segue o último curso. Isso significa, por exemplo, que o servidor pode coagir valores inválidos para os valores válidos mais próximos.

Várias opções de SQL mode estão disponíveis para fornecer maior controle sobre o tratamento de valores de dados incorretos e sobre a decisão de continuar a execução da instrução ou abortá-la quando ocorrerem erros. Usando essas opções, você pode configurar o MySQL Server para operar de maneira mais tradicional, similar a outros DBMSs que rejeitam input inadequado. O SQL mode pode ser definido globalmente na inicialização do servidor para afetar todos os clients. Clients individuais podem definir o SQL mode em tempo de execução (runtime), o que permite que cada client selecione o comportamento mais adequado aos seus requisitos. Consulte a Seção 5.1.10, “Server SQL Modes”.

As seções a seguir descrevem como o MySQL Server lida com diferentes tipos de Constraints.