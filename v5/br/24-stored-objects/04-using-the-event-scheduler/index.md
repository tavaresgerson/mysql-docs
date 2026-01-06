## 23.4 Usando o Agendamento de Eventos

23.4.1 Visão geral do Agendamento de Eventos

23.4.2 Configuração do Agendador de Eventos

23.4.3 Sintaxe de eventos

23.4.4 Metadados do evento

23.4.5 Status do Cronômetro de Eventos

23.4.6 O Agendamento de Eventos e Permissões do MySQL

O Agendamento de Eventos do MySQL gerencia a programação e execução de eventos, ou seja, tarefas que são executadas de acordo com um cronograma. A discussão a seguir aborda o Agendamento de Eventos e é dividida nas seguintes seções:

- A Seção 23.4.1, “Visão Geral do Cronômetro de Eventos”, fornece uma introdução e uma visão conceitual dos Eventos do MySQL.

- A Seção 23.4.3, “Sintaxe de Eventos”, discute as instruções SQL para criar, alterar e excluir eventos do MySQL.

- A seção 23.4.4, “Metadados do evento”, mostra como obter informações sobre eventos e como essas informações são armazenadas pelo MySQL Server.

- A seção 23.4.6, “O Agendamento de Eventos e os Privilegios do MySQL”, discute os privilégios necessários para trabalhar com eventos e as ramificações que os eventos têm em relação aos privilégios durante a execução.

As rotinas armazenadas exigem a tabela `event` no banco de dados `mysql`. Esta tabela é criada durante o procedimento de instalação do MySQL 5.7. Se você estiver atualizando para o MySQL 5.7 a partir de uma versão anterior, certifique-se de atualizar suas tabelas de concessão para garantir que a tabela `event` exista. Consulte a Seção 2.10, “Atualizando o MySQL”.

### Recursos adicionais

- Há algumas restrições sobre o uso de eventos; veja a Seção 23.8, “Restrições sobre Programas Armazenados”.

- O registro binário para eventos ocorre conforme descrito na Seção 23.7, “Registro Binário de Programas Armazenados”.

- Você também pode achar os [Fóruns de Usuários do MySQL](https://forums.mysql.com/list.php?20) úteis.
