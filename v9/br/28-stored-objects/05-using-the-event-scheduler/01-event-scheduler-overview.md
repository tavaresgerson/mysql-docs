### 27.5.1 Visão Geral do Cronômetro de Eventos

Eventos do MySQL são tarefas que são executadas de acordo com um cronograma. Portanto, às vezes os chamamos de *eventos agendados*. Ao criar um evento, você está criando um objeto de banco de dados nomeado que contém uma ou mais instruções SQL a serem executadas em intervalos regulares, começando e terminando em uma data e hora específicas. Conceitualmente, isso é semelhante à ideia do `crontab` do Unix (também conhecido como "tarefa cron") ou ao Cron Scheduler do Windows.

Tarefas agendadas desse tipo também são às vezes conhecidas como "disparadores temporais", o que implica que esses são objetos que são acionados pelo passar do tempo. Embora isso seja essencialmente correto, preferimos usar o termo *eventos* para evitar confusão com os disparadores do tipo discutido na Seção 27.4, "Usando Disparadores". Os eventos não devem ser confundidos com "disparadores temporários". Enquanto um disparador é um objeto de banco de dados cujas instruções são executadas em resposta a um tipo específico de evento que ocorre em uma determinada tabela, um (agendado) evento é um objeto cujas instruções são executadas em resposta ao passar de um intervalo de tempo especificado.

Embora não haja disposição no Padrão SQL para agendamento de eventos, existem precedentes em outros sistemas de banco de dados, e você pode notar algumas semelhanças entre essas implementações e as encontradas no MySQL Server.

Eventos do MySQL têm as seguintes principais características e propriedades:

* No MySQL, um evento é identificado de forma única por seu nome e o esquema ao qual ele é atribuído.

* Um evento executa uma ação específica de acordo com um cronograma. Essa ação consiste em uma instrução SQL, que pode ser uma instrução composta em um bloco `BEGIN ... END` se desejado (veja a Seção 15.6, “Sintaxe de Instruções Compostas”). O tempo de execução de um evento pode ser único ou recorrente. Um evento único é executado apenas uma vez. Um evento recorrente repete sua ação em um intervalo regular, e o cronograma de um evento recorrente pode ser atribuído um dia e uma hora de início específicos, um dia e uma hora de término, ambos ou nenhum. (Por padrão, o cronograma de um evento recorrente começa assim que ele é criado e continua indefinidamente, até que seja desativado ou excluído.)

  Se um evento recorrente não terminar dentro de seu intervalo de agendamento, o resultado pode ser várias instâncias do evento sendo executadas simultaneamente. Se isso não for desejado, você deve instituir um mecanismo para impedir instâncias simultâneas. Por exemplo, você pode usar a função `GET_LOCK()` ou o bloqueio de linhas ou tabelas.

* Os usuários podem criar, modificar e excluir eventos agendados usando instruções SQL destinadas a esses propósitos. Instruções de criação e modificação de eventos sintaticamente inválidas falham com uma mensagem de erro apropriada. *Um usuário pode incluir instruções em uma ação de evento que exigem privilégios que o usuário realmente não possui*. A instrução de criação ou modificação do evento é bem-sucedida, mas a ação do evento falha. Veja a Seção 27.5.6, “O Agendamento de Eventos e Privilégios MySQL” para detalhes.

* Muitas das propriedades de um evento podem ser definidas ou modificadas usando instruções SQL. Essas propriedades incluem o nome do evento, o horário, a persistência (ou seja, se ele é preservado após a expiração de seu cronograma), o status (ativado ou desativado), a ação a ser realizada e o esquema ao qual ele é atribuído. Veja a Seção 15.1.3, “Instrução ALTER EVENT”.

  O definidor padrão de um evento é o usuário que criou o evento, a menos que o evento tenha sido alterado, caso em que o definidor é o usuário que emitiu a última instrução `ALTER EVENT` que afetou o evento. Um evento pode ser modificado por qualquer usuário que tenha o privilégio `EVENT` no banco de dados para o qual o evento é definido. Veja a Seção 27.5.6, “O Cronômetro de Eventos e os Privilégios do MySQL”.

* A instrução de ação de um evento pode incluir a maioria das instruções SQL permitidas dentro de rotinas armazenadas. Para restrições, veja a Seção 27.10, “Restrições em Programas Armazenados”.