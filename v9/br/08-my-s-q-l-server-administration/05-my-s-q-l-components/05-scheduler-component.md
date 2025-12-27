### 7.5.5 Componentente de Cronograma

Nota

O componente `scheduler` está incluído na Edição Empresarial do MySQL, um produto comercial. Para obter mais informações sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

O componente `scheduler` fornece uma implementação do serviço `mysql_scheduler` que permite que aplicativos, componentes ou plugins configurem, executem e desconfigurem tarefas a cada *`N`* segundos. Por exemplo, o plugin do servidor `audit_log` chama o componente `scheduler` em sua inicialização e configura um esvaziamento regular e recorrente de seu cache de memória (veja Habilitar a Tarefa de Esvaziamento do Log de Auditoria).

* Propósito: Implementa a variável de sistema `component_scheduler.enabled` que controla se o cronograma está executando tarefas ativamente. Na inicialização, o componente `scheduler` registra a tabela `performance_schema.component_scheduler_tasks`, que lista as tarefas agendadas atualmente e alguns dados de execução sobre cada uma.

* URN: `file://component_scheduler`

Para instruções de instalação, consulte a Seção 7.5.1, “Instalando e Desinstalando Componentes”.

O componente `scheduler` implementa o serviço usando esses elementos:

* Uma fila de espera das tarefas agendadas, inativas, ordenadas pelo próximo momento de execução (em ordem crescente).

* Uma lista das tarefas registradas, ativas.
* Um fio de fundo que:

  + Dorme se não houver tarefas ou se a tarefa superior precisar de mais tempo para ser executada. Ele acorda periodicamente para verificar se é hora de encerrar.

  + Compila uma lista das tarefas que precisam ser executadas, move-as da fila inativa, adiciona-as à fila ativa e executa cada tarefa individualmente.

  + Após executar a lista de tarefas, remove as tarefas da lista ativa, adiciona-as à lista inativa e calcula o próximo momento em que precisam ser executadas.

Quando um chamador invoca o serviço `mysql_scheduler.create()`, ele cria uma nova instância de tarefa agendada para adicionar à fila, o que sinaliza o semaforo do thread de fundo. Um handle para a nova tarefa é retornado ao chamador. O código de chamada deve manter esse handle e a referência do serviço ao serviço de agendamento até após a chamada ao serviço `mysql_scheduler.destroy()`. Quando o chamador invoca `destroy()` e passa o handle que recebeu do `create()`, o serviço aguarda que a tarefa fique inativa (se estiver em execução) e, em seguida, a remove da fila inativa.

O serviço de componente chama cada callback fornecido pelo aplicativo (ponteiro de função) no mesmo thread do scheduler, um de cada vez e em ordem crescente, com base no tempo que cada um requer para ser executado.

Os desenvolvedores que desejam incorporar capacidades de agendamento de filas em uma aplicação, componente ou plugin devem consultar o arquivo `mysql_scheduler.h` em uma distribuição de código-fonte do MySQL.