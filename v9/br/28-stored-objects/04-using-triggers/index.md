## 27.4 Usando gatilhos

27.4.1 Sintaxe e exemplos de gatilhos

27.4.2 Metadados do gatilho

Um gatilho é um objeto de banco de dados nomeado que está associado a uma tabela e que é ativado quando um evento específico ocorre na tabela. Alguns usos para gatilhos são realizar verificações de valores a serem inseridos em uma tabela ou realizar cálculos com valores envolvidos em uma atualização.

Um gatilho é definido para ser ativado quando uma instrução insere, atualiza ou exclui linhas na tabela associada. Essas operações de linha são eventos de gatilho. Por exemplo, linhas podem ser inseridas por instruções `INSERT` ou `LOAD DATA`, e um gatilho de inserção é ativado para cada linha inserida. Um gatilho pode ser configurado para ser ativado antes ou depois do evento do gatilho. Por exemplo, você pode ter um gatilho ativado antes de cada linha inserida em uma tabela ou depois de cada linha atualizada.

Importante

Os gatilhos do MySQL são ativados apenas para alterações feitas em tabelas por instruções SQL. Isso inclui alterações em tabelas base que subjazem a visualizações atualizáveis. Os gatilhos não são ativados para alterações em tabelas feitas por APIs que não transmitem instruções SQL para o MySQL Server. Isso significa que os gatilhos não são ativados por atualizações feitas usando a API `NDB`.

Os gatilhos não são ativados por alterações nas tabelas `INFORMATION_SCHEMA` ou `performance_schema`. Essas tabelas são, na verdade, visualizações e gatilhos não são permitidos em visualizações.

As seções a seguir descrevem a sintaxe para criar e descartar gatilhos, mostram alguns exemplos de como usá-los e indicam como obter metadados do gatilho.

### Recursos adicionais

[Fóruns do Usuário do MySQL](https://forums.mysql.com/list.php?20) úteis ao trabalhar com gatilhos.

* Para respostas a perguntas frequentes comuns sobre gatilhos no MySQL, consulte a Seção A.5, “MySQL 9.5 FAQ: Gatilhos”.

* Existem algumas restrições sobre o uso de gatilhos; veja a Seção 27.10, “Restrições sobre Programas Armazenados”.

* O registro binário para gatilhos ocorre conforme descrito na Seção 27.9, “Registro Binário de Programas Armazenados”.