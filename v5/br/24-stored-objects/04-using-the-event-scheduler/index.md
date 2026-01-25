## 23.4 Usando o Event Scheduler

23.4.1 Visão Geral do Event Scheduler

23.4.2 Configuração do Event Scheduler

23.4.3 Sintaxe de Eventos

23.4.4 Metadados de Eventos

23.4.5 Status do Event Scheduler

23.4.6 O Event Scheduler e os Privilégios do MySQL

O MySQL Event Scheduler gerencia o agendamento e a execução de events, ou seja, tarefas que são executadas de acordo com um agendamento. A discussão a seguir abrange o Event Scheduler e está dividida nas seguintes seções:

* A Seção 23.4.1, “Visão Geral do Event Scheduler”, fornece uma introdução e uma visão conceitual dos MySQL Events.

* A Seção 23.4.3, “Sintaxe de Eventos”, discute as instruções SQL para criar, alterar e descartar MySQL Events.

* A Seção 23.4.4, “Metadados de Eventos”, mostra como obter informações sobre events e como essas informações são armazenadas pelo MySQL Server.

* A Seção 23.4.6, “O Event Scheduler e os Privilégios do MySQL”, discute os privilégios necessários para trabalhar com events e as ramificações que os events possuem em relação aos privilégios durante a execução.

Stored routines requerem a tabela `event` no database `mysql`. Esta tabela é criada durante o procedimento de instalação do MySQL 5.7. Se você estiver atualizando para o MySQL 5.7 a partir de uma versão anterior, certifique-se de atualizar suas grant tables para garantir que a tabela `event` exista. Consulte a Seção 2.10, “Atualizando o MySQL”.

### Recursos Adicionais

* Existem algumas restrições no uso de events; consulte a Seção 23.8, “Restrições em Stored Programs”.

* O Binary logging para events ocorre conforme descrito na Seção 23.7, “Binary Logging de Stored Programs”.

* Você também pode achar os [Fóruns de Usuários do MySQL](https://forums.mysql.com/list.php?20) úteis.