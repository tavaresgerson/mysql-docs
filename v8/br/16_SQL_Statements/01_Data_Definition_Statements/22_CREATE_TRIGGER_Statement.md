### 15.1.22 Declaração CREATE TRIGGER

```
CREATE
    [DEFINER = user]
    TRIGGER [IF NOT EXISTS] trigger_name
    trigger_time trigger_event
    ON tbl_name FOR EACH ROW
    [trigger_order]
    trigger_body

trigger_time: { BEFORE | AFTER }

trigger_event: { INSERT | UPDATE | DELETE }

trigger_order: { FOLLOWS | PRECEDES } other_trigger_name
```

Essa declaração cria um novo gatilho. Um gatilho é um objeto de banco de dados nomeado que está associado a uma tabela e que é ativado quando um evento específico ocorre para a tabela. O gatilho se torna associado à tabela chamada `tbl_name`, que deve se referir a uma tabela permanente. Você não pode associar um gatilho a uma tabela `TEMPORARY` ou a uma visualização.

Os nomes dos gatilhos existem no espaço de nome do esquema, o que significa que todos os gatilhos devem ter nomes únicos dentro de um esquema. Os gatilhos em diferentes esquemas podem ter o mesmo nome.

`IF NOT EXISTS` impede que um erro ocorra se um gatilho com o mesmo nome, na mesma tabela, existir no mesmo esquema. Esta opção é suportada com `CREATE TRIGGER` a partir do MySQL 8.0.29.

Esta seção descreve a sintaxe do `CREATE TRIGGER`. Para uma discussão adicional, consulte a Seção 27.3.1, “Sintaxe e Exemplos de Trigêmeos”.

`CREATE TRIGGER` exige o privilégio `TRIGGER` para a tabela associada ao gatilho. Se a cláusula `DEFINER` estiver presente, os privilégios necessários dependem do valor `user`, conforme discutido na Seção 27.6, “Controle de Acesso a Objetos Armazenados”. Se o registro binário estiver habilitado, `CREATE TRIGGER` pode exigir o privilégio `SUPER`, conforme discutido na Seção 27.7, “Registro Binário de Programas Armazenados”.

A cláusula `DEFINER` determina o contexto de segurança a ser utilizado ao verificar os privilégios de acesso no momento da ativação do gatilho, conforme descrito mais adiante nesta seção.

`trigger_time` é o tempo de ação do gatilho. Pode ser `BEFORE` ou `AFTER` para indicar que o gatilho é ativado antes ou depois de cada linha a ser modificada.

Os verificações básicas de valores de coluna ocorrem antes da ativação do gatilho, portanto, você não pode usar gatilhos `BEFORE` para converter valores inadequados para o tipo de coluna em valores válidos.

`trigger_event` indica o tipo de operação que ativa o gatilho. Esses valores `trigger_event` são permitidos:

- `INSERT`: O gatilho é ativado sempre que uma nova linha é inserida na tabela (por exemplo, através das instruções `INSERT`, `LOAD DATA` e `REPLACE`).

- `UPDATE`: O gatilho é ativado sempre que uma linha é modificada (por exemplo, através das instruções `UPDATE`).

- `DELETE`: O gatilho é ativado sempre que uma linha é excluída da tabela (por exemplo, através das instruções `DELETE` e `REPLACE`). As instruções `DROP TABLE` e `TRUNCATE TABLE` na tabela *não* ativam este gatilho, porque elas não usam `DELETE`. A remoção de uma partição também não ativa os gatilhos `DELETE`.

O `trigger_event` não representa um tipo literal de instrução SQL que ativa o gatilho tanto quanto representa um tipo de operação de tabela. Por exemplo, um gatilho `INSERT` é ativado não apenas para instruções `INSERT`, mas também para instruções `LOAD DATA`, porque ambas as instruções inserem linhas em uma tabela.

Um exemplo potencialmente confuso disso é a sintaxe `INSERT INTO ... ON DUPLICATE KEY UPDATE ...`: um gatilho `BEFORE INSERT` é ativado para cada linha, seguido por um gatilho `AFTER INSERT` ou ambos os gatilhos `BEFORE UPDATE` e `AFTER UPDATE`, dependendo se havia uma chave duplicada para a linha.

Nota

As ações de chave estrangeira em cascata não ativam gatilhos.

É possível definir múltiplos gatilhos para uma tabela que tenham o mesmo evento de gatilho e hora de ação. Por exemplo, você pode ter dois gatilhos `BEFORE UPDATE` para uma tabela. Por padrão, os gatilhos que têm o mesmo evento de gatilho e hora de ação são ativados na ordem em que foram criados. Para alterar a ordem dos gatilhos, especifique uma cláusula `trigger_order` que indique `FOLLOWS` ou `PRECEDES` e o nome de um gatilho existente que também tenha o mesmo evento de gatilho e hora de ação. Com `FOLLOWS`, o novo gatilho é ativado após o gatilho existente. Com `PRECEDES`, o novo gatilho é ativado antes do gatilho existente.

`trigger_body` é a instrução a ser executada quando o gatilho é ativado. Para executar várias instruções, use a construção de instrução composta `BEGIN ... END`. Isso também permite que você use as mesmas instruções permitidas dentro de rotinas armazenadas. Veja a Seção 15.6.1, “Instrução Composta BEGIN ... END”. Algumas instruções não são permitidas em gatilhos; veja a Seção 27.8, “Restrições em Programas Armazenados”.

Dentro do corpo do gatilho, você pode se referir às colunas da tabela de assunto (a tabela associada ao gatilho) usando os aliases `OLD` e `NEW`. `OLD.col_name` refere-se a uma coluna de uma linha existente antes de ser atualizada ou excluída. `NEW.col_name` refere-se à coluna de uma nova linha a ser inserida ou de uma linha existente após ser atualizada.

Os gatilhos não podem usar `NEW.col_name` ou usar `OLD.col_name` para referenciar colunas geradas. Para obter informações sobre colunas geradas, consulte a Seção 15.1.20.8, “CREATE TABLE e Colunas Geradas”.

O MySQL armazena o valor da variável de sistema `sql_mode` em vigor quando um gatilho é criado e sempre executa o corpo do gatilho com esse valor em vigor, *independentemente do modo SQL do servidor atual quando o gatilho começa a ser executado*.

A cláusula `DEFINER` especifica a conta do MySQL a ser usada ao verificar os privilégios de acesso no momento da ativação do gatilho. Se a cláusula `DEFINER` estiver presente, o valor `user` deve ser uma conta do MySQL especificada como `'user_name'@'host_name'`, `CURRENT_USER` ou `CURRENT_USER()`. Os valores `user` permitidos dependem dos privilégios que você possui, conforme discutido na Seção 27.6, “Controle de Acesso a Objetos Armazenados”. Veja também essa seção para obter informações adicionais sobre a segurança do gatilho.

Se a cláusula `DEFINER` for omitida, o definidor padrão é o usuário que executa a instrução `CREATE TRIGGER`. Isso é o mesmo que especificar explicitamente `DEFINER = CURRENT_USER`.

O MySQL leva em consideração o usuário `DEFINER` ao verificar os privilégios dos gatilhos da seguinte forma:

- No momento `CREATE TRIGGER`, o usuário que emite a declaração deve ter o privilégio `TRIGGER`.

- No momento da ativação do gatilho, os privilégios são verificados em relação ao usuário `DEFINER`. Esse usuário deve ter esses privilégios:

  - O privilégio `TRIGGER` para a tabela do assunto.

  - O privilégio `SELECT` para a tabela do objeto se as referências às colunas da tabela ocorrerem usando `OLD.col_name` ou `NEW.col_name` no corpo do gatilho.

  - O privilégio `UPDATE` para a tabela do objeto, se as colunas da tabela forem alvos de atribuições `SET NEW.col_name = value` no corpo do gatilho.

  - Quaisquer outros privilégios normalmente necessários para as declarações executadas pelo gatilho.

Dentro de um corpo de gatilho, a função `CURRENT_USER` retorna a conta usada para verificar privilégios no momento da ativação do gatilho. Esse é o usuário `DEFINER`, e não o usuário cujas ações causaram a ativação do gatilho. Para obter informações sobre auditoria de usuários dentro dos gatilhos, consulte a Seção 8.2.23, “Auditorização de Atividades de Conta Baseada em SQL”.

Se você usar `LOCK TABLES` para bloquear uma tabela que possui gatilhos, as tabelas usadas dentro do gatilho também serão bloqueadas, conforme descrito em LOCK TABLES e gatilhos.

Para uma discussão adicional sobre o uso de gatilhos, consulte a Seção 27.3.1, “Sintaxe e Exemplos de Gatilhos”.
