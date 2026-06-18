### 7.5.5 Componente do Agendamento

Nota

O componente `scheduler` está incluído na Edição Empresarial do MySQL, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

A partir do MySQL 8.0.34, o componente `scheduler` fornece uma implementação do serviço `mysql_scheduler` que permite que aplicativos, componentes ou plugins configurem, executem e desconfigurem tarefas a cada `N` segundos. Por exemplo, o plugin de servidor `audit_log` chama o componente `scheduler` em sua inicialização e configura um esvaziamento regular e recorrente de seu cache de memória (veja Habilitar a Tarefa de Esvaziamento do Log de Auditoria).

- Objetivo: Implementa a variável de sistema `component_scheduler.enabled`, que controla se o agendamento está executando tarefas ativamente. Ao iniciar, o componente `scheduler` registra a tabela `performance_schema.component_scheduler_tasks`, que lista as tarefas agendadas atualmente e alguns dados de execução de cada uma.

- URN: `file://component_scheduler`

Para obter instruções de instalação, consulte a Seção 7.5.1, “Instalando e Desinstalando Componentes”.

O componente `scheduler` implementa o serviço usando esses elementos:

- Uma fila prioritária das tarefas agendadas registradas e inativas, classificadas pelo próximo horário de execução (em ordem crescente).

- Uma lista das tarefas registradas e ativas.

- Um fio de fundo que:

  - Ele dorme se não houver tarefas ou se a tarefa principal precisar de mais tempo para ser executada. Ele acorda periodicamente para verificar se é hora de encerrar.

  - Compila uma lista das tarefas que precisam ser executadas, move-as da fila inativa, adiciona-as à fila ativa e executa cada tarefa individualmente.

  - Após executar a lista de tarefas, remova as tarefas da lista ativa, adicione-as à lista inativa e calcule a próxima vez que elas precisam ser executadas.

Quando um chamador invoca o serviço `mysql_scheduler.create()`, ele cria uma nova instância de tarefa agendada para adicionar à fila, o que sinaliza o semaforo do thread em segundo plano. Um handle para a nova tarefa é retornado ao chamador. O código de chamada deve manter esse handle e a referência do serviço ao serviço de agendamento até após a chamada ao serviço `mysql_scheduler.destroy()`. Quando o chamador invoca `destroy()` e passa o handle que recebeu de `create()`, o serviço aguarda que a tarefa fique inativa (se estiver em execução) e, em seguida, a remove da fila inativa.

O serviço de componente chama cada chamada de retorno fornecida pelo aplicativo (ponteiro de função) no mesmo fio do agendador, uma de cada vez e em ordem crescente, com base no tempo que cada uma leva para ser executada.

Os desenvolvedores que desejam incorporar capacidades de agendamento e fila em um aplicativo, componente ou plugin devem consultar o arquivo `mysql_scheduler.h` em uma distribuição de código-fonte MySQL.
