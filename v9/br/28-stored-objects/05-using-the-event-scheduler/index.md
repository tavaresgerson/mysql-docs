## 27.5 Usando o Cronograma de Eventos

27.5.1 Visão Geral do Cronograma de Eventos

27.5.2 Configuração do Cronograma de Eventos

27.5.3 Sintaxe de Eventos

27.5.4 Metadados dos Eventos

27.5.5 Status do Cronograma de Eventos

27.5.6 O Cronograma de Eventos e os Privilegios do MySQL

O Cronograma de Eventos do MySQL gerencia a programação e execução de eventos, ou seja, tarefas que são executadas de acordo com um cronograma. A discussão a seguir abrange o Cronograma de Eventos e é dividida nas seguintes seções:

* Seção 27.5.1, “Visão Geral do Cronograma de Eventos”, fornece uma introdução e uma visão conceitual dos Eventos do MySQL.

* Seção 27.5.3, “Sintaxe de Eventos”, discute as instruções SQL para criar, alterar e excluir Eventos do MySQL.

* Seção 27.5.4, “Metadados dos Eventos”, mostra como obter informações sobre os eventos e como essas informações são armazenadas pelo Servidor MySQL.

* Seção 27.5.6, “O Cronograma de Eventos e os Privilegios do MySQL”, discute os privilégios necessários para trabalhar com eventos e as ramificações que os eventos têm em relação aos privilégios durante a execução.

As rotinas armazenadas requerem a tabela `mysql` do dicionário de dados `events` no banco de dados `mysql`. Essa tabela é criada durante o procedimento de instalação do MySQL 9.5. Se você estiver atualizando para o MySQL 9.5 a partir de uma versão anterior, certifique-se de realizar o procedimento de atualização para garantir que o banco de dados do sistema esteja atualizado. Veja o Capítulo 3, *Atualizando o MySQL*.

### Recursos Adicionais

* Existem algumas restrições sobre o uso de eventos; veja a Seção 27.10, “Restrições em Programas Armazenados”.

* O registro binário para eventos ocorre conforme descrito na Seção 27.9, “Registro Binário de Programas Armazenados”.

[Fóruns do Usuário do MySQL](https://forums.mysql.com/list.php?20) para ajudar.