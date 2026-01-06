## 23.3 Usando gatilhos

23.3.1 Sintaxe e exemplos de gatilho

23.3.2 Metadados do gatilho

Um gatilho é um objeto de banco de dados nomeado que está associado a uma tabela e que é ativado quando um evento específico ocorre na tabela. Alguns usos dos gatilhos são realizar verificações de valores a serem inseridos em uma tabela ou realizar cálculos sobre os valores envolvidos em uma atualização.

Um gatilho é definido para ser ativado quando uma declaração insere, atualiza ou exclui linhas na tabela associada. Essas operações de linha são eventos de gatilho. Por exemplo, as linhas podem ser inseridas por declarações `INSERT` ou `LOAD DATA`, e um gatilho de inserção é ativado para cada linha inserida. Um gatilho pode ser configurado para ser ativado antes ou depois do evento do gatilho. Por exemplo, você pode ter um gatilho ativado antes de cada linha inserida em uma tabela ou depois de cada linha atualizada.

Importante

Os gatilhos do MySQL são ativados apenas para alterações feitas em tabelas por instruções SQL. Isso inclui alterações em tabelas base que sustentam visualizações atualizáveis. Os gatilhos não são ativados para alterações em tabelas feitas por APIs que não transmitem instruções SQL para o MySQL Server. Isso significa que os gatilhos não são ativados por atualizações feitas usando a API `NDB`.

Os gatilhos não são ativados por alterações nas tabelas `INFORMATION_SCHEMA` ou `performance_schema`. Essas tabelas são, na verdade, visualizações e gatilhos não são permitidos em visualizações.

As seções a seguir descrevem a sintaxe para criar e descartar gatilhos, mostram alguns exemplos de como usá-los e indicam como obter metadados de gatilhos.

### Recursos adicionais

- Você pode achar os [Fóruns de Usuários do MySQL](https://forums.mysql.com/list.php?20) úteis ao trabalhar com gatilhos.

- Para respostas a perguntas frequentes sobre gatilhos no MySQL, consulte a Seção A.5, “Perguntas frequentes do MySQL 5.7: gatilhos”.

- Há algumas restrições sobre o uso de gatilhos; veja a Seção 23.8, “Restrições sobre Programas Armazenados”.

- O registro binário para gatilhos ocorre conforme descrito na Seção 23.7, “Registro Binário de Programas Armazenados”.
