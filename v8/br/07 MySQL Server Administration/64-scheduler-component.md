### 7.5.5 Componente de programação

::: info Note

O componente `scheduler` está incluído no MySQL Enterprise Edition, um produto comercial. Para saber mais sobre produtos comerciais, consulte \[<https://www.mysql.com/products/]{><https://www.mysql.com/products/}>.

:::

O componente `scheduler` fornece uma implementação do serviço `mysql_scheduler` que permite que aplicativos, componentes ou plugins configurem, executem e desconfigurem tarefas a cada \* `N` \* segundos. Por exemplo, o plugin do servidor `audit_log` chama o componente `scheduler` em sua inicialização e configura um flush regular e recorrente de seu cache de memória (veja Ativando a tarefa de flush do log de auditoria).

- Propósito: Implementa a variável de sistema `component_scheduler.enabled` que controla se o agendador está executando ativamente tarefas. Na inicialização, o componente `scheduler` registra a tabela `performance_schema.component_scheduler_tasks`, que lista as tarefas atualmente agendadas e alguns dados de tempo de execução sobre cada uma delas.
- \[`file://component_scheduler`]

Para instruções de instalação, ver secção 7.5.1, "Instalação e desinstalação de componentes".

O componente `scheduler` implementa o serviço usando estes elementos:

- Uma fila de prioridade das tarefas agendadas inativas registradas, ordenadas pela próxima vez em que serão executadas (em ordem ascendente).
- Uma lista das tarefas registadas e ativas.
- Uma linha de fundo que:

  - Dorme se não houver tarefas ou se a tarefa principal precisar de mais tempo para ser executada.
  - Compila uma lista das tarefas que precisam ser executadas, as move da fila inativa, as adiciona à fila ativa e executa cada tarefa individualmente.
  - Depois de executar a lista de tarefas, remove as tarefas da lista ativa, adiciona-as à lista inativa e calcula a próxima vez que precisam ser executadas.

Quando um chamador invoca o serviço `mysql_scheduler.create()`, ele cria uma nova instância de tarefa agendada para adicionar à fila, que sinaliza o semáforo do thread de fundo. Um endereço para a nova tarefa é devolvido ao chamador. O código de chamada deve manter esse endereço e a referência do serviço para o serviço de agendamento até chamar o serviço `mysql_scheduler.destroy()`. Quando o chamador invoca `destroy()` e passa no endereço recebido do `create()`, o serviço aguarda que a tarefa se torne inativa (se estiver em execução) e, em seguida, remove-a da fila inativa.

O serviço de componente chama cada chamada de retorno fornecida pelo aplicativo (ponteiro de função) no mesmo thread do agendador, um de cada vez e em ordem ascendente, com base no tempo que cada um requer para ser executado.

Os desenvolvedores que desejam incorporar capacidades de agendamento de fila em um aplicativo, componente ou plugin devem consultar o arquivo `mysql_scheduler.h` em uma distribuição de origem MySQL.
