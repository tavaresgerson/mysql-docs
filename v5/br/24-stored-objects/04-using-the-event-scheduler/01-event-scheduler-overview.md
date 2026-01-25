### 23.4.1 Visão Geral do Event Scheduler

Events (Eventos) do MySQL são tarefas que são executadas de acordo com um cronograma (schedule). Portanto, às vezes nos referimos a eles como *scheduled* events (eventos agendados). Ao criar um event, você está criando um objeto de Database nomeado que contém uma ou mais instruções SQL a serem executadas em um ou mais intervalos regulares, começando e terminando em uma data e hora específicas. Conceitualmente, isso é semelhante à ideia do `crontab` do Unix (também conhecido como "cron job") ou do Windows Task Scheduler.

Tarefas agendadas deste tipo também são, por vezes, conhecidas como "temporal triggers" (triggers temporais), o que implica que são objetos acionados pela passagem do tempo. Embora isso esteja essencialmente correto, preferimos usar o termo *events* para evitar confusão com os triggers do tipo discutido na Seção 23.3, “Using Triggers”. Mais especificamente, events não devem ser confundidos com "temporary triggers" (triggers temporários). Enquanto um trigger é um objeto de Database cujas instruções são executadas em resposta a um tipo específico de event que ocorre em uma determinada tabela, um event (agendado) é um objeto cujas instruções são executadas em resposta à passagem de um intervalo de tempo especificado.

Embora não haja previsão no SQL Standard para agendamento de events, existem precedentes em outros sistemas de Database, e você pode notar algumas semelhanças entre essas implementações e aquela encontrada no MySQL Server.

Os Events do MySQL possuem os seguintes recursos e propriedades principais:

* No MySQL, um event é identificado de forma exclusiva pelo seu nome e pelo Schema ao qual está atribuído.

* Um event executa uma ação específica de acordo com um schedule (cronograma). Esta ação consiste em uma instrução SQL, que pode ser uma instrução composta em um bloco `BEGIN ... END`, se desejado (consulte a Seção 13.6, “Compound Statements”). O timing (momento) de um event pode ser de única ocorrência (one-time) ou recorrente. Um event de única ocorrência é executado apenas uma vez. Um event recorrente repete sua ação em um intervalo regular, e o schedule para um event recorrente pode ter uma data e hora de início e/ou fim específicas, ou nenhuma delas. (Por padrão, o schedule de um event recorrente começa assim que é criado e continua indefinidamente, até que seja desativado ou descartado (dropped).)

  Se um event de repetição não terminar dentro do seu intervalo de agendamento, o resultado pode ser múltiplas instâncias do event sendo executadas simultaneamente. Se isso não for desejável, você deve instituir um mecanismo para evitar instâncias simultâneas. Por exemplo, você pode usar a função `GET_LOCK()`, ou locking de linha ou tabela.

* Usuários podem criar, modificar e descartar (drop) scheduled events usando instruções SQL destinadas a esses fins. As instruções de criação e modificação de event sintaticamente inválidas falham com uma mensagem de erro apropriada. *Um usuário pode incluir instruções na ação de um event que exijam privileges que o usuário realmente não possui*. A instrução de criação ou modificação do event é bem-sucedida, mas a ação do event falha. Consulte a Seção 23.4.6, “The Event Scheduler and MySQL Privileges” para obter detalhes.

* Muitas das propriedades de um event podem ser definidas ou modificadas usando instruções SQL. Essas propriedades incluem o nome do event, timing, persistência (ou seja, se ele é preservado após a expiração de seu schedule), status (habilitado ou desabilitado), a ação a ser executada e o Schema ao qual ele está atribuído. Consulte a Seção 13.1.2, “ALTER EVENT Statement”.

  O definer padrão de um event é o usuário que o criou, a menos que o event tenha sido alterado, caso em que o definer é o usuário que emitiu a última instrução `ALTER EVENT` que afetou esse event. Um event pode ser modificado por qualquer usuário que possua o privilege `EVENT` no Database para o qual o event está definido. Consulte a Seção 23.4.6, “The Event Scheduler and MySQL Privileges”.

* A instrução de ação de um event pode incluir a maioria das instruções SQL permitidas em Stored Routines. Para restrições, consulte a Seção 23.8, “Restrictions on Stored Programs”.