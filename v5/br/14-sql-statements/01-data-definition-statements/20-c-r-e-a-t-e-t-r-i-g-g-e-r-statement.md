### 13.1.20 Declaração CREATE TRIGGER

```sql
CREATE
    [DEFINER = user]
    TRIGGER trigger_name
    trigger_time trigger_event
    ON tbl_name FOR EACH ROW
    [trigger_order]
    trigger_body

trigger_time: { BEFORE | AFTER }

trigger_event: { INSERT | UPDATE | DELETE }

trigger_order: { FOLLOWS | PRECEDES } other_trigger_name
```

Essa declaração cria um novo gatilho. Um gatilho é um objeto de banco de dados nomeado que está associado a uma tabela e que é ativado quando um evento específico ocorre para a tabela. O gatilho se torna associado à tabela chamada *`tbl_name`*, que deve se referir a uma tabela permanente. Você não pode associar um gatilho a uma tabela `TEMPORARY` ou a uma visão.

Os nomes dos gatilhos existem no espaço de nome do esquema, o que significa que todos os gatilhos devem ter nomes únicos dentro de um esquema. Os gatilhos em diferentes esquemas podem ter o mesmo nome.

Esta seção descreve a sintaxe de `CREATE TRIGGER`. Para uma discussão adicional, consulte Seção 23.3.1, “Sintaxe e Exemplos de Trigêmeos”.

`CREATE TRIGGER` requer o privilégio `TRIGGER` para a tabela associada ao gatilho. Se a cláusula `DEFINER` estiver presente, os privilégios necessários dependem do valor do *`user`*, conforme discutido na Seção 23.6, “Controle de Acesso a Objetos Armazenados”. Se o registro binário estiver habilitado, o `CREATE TRIGGER` pode exigir o privilégio `SUPER`, conforme discutido na Seção 23.7, “Registro Binário de Programas Armazenados”.

A cláusula `DEFINER` determina o contexto de segurança a ser utilizado ao verificar os privilégios de acesso no momento da ativação do gatilho, conforme descrito mais adiante nesta seção.

*`trigger_time`* é o tempo de ação do gatilho. Pode ser `BEFORE` ou `AFTER` para indicar que o gatilho é ativado antes ou depois de cada linha a ser modificada.

Os verificações básicas de valores de coluna ocorrem antes da ativação do gatilho, portanto, você não pode usar gatilhos `BEFORE` para converter valores inadequados para o tipo de coluna em valores válidos.

*`trigger_event`* indica o tipo de operação que ativa o gatilho. Esses valores de *`trigger_event`* são permitidos:

- O gatilho é ativado sempre que uma nova linha é inserida na tabela (por exemplo, através das instruções `INSERT` (insert.html), `LOAD DATA` (load-data.html) e `REPLACE` (replace.html)).

- `UPDATE`: O gatilho é ativado sempre que uma linha é modificada (por exemplo, através das instruções `UPDATE`).

- `DELETE`: O gatilho é ativado sempre que uma linha é excluída da tabela (por exemplo, através das instruções `DELETE` e `REPLACE`). As instruções `DROP TABLE` e `TRUNCATE TABLE` na tabela *não* ativam este gatilho, porque elas não usam `DELETE`. A eliminação de uma partição também não ativa os gatilhos `DELETE`.

O `trigger_event` não representa um tipo literal de instrução SQL que ativa o gatilho, mas sim um tipo de operação de tabela. Por exemplo, um gatilho de `INSERT` (insert.html) é ativado não apenas para instruções de `INSERT` (insert.html), mas também para instruções de `LOAD DATA` (load-data.html), pois ambas as instruções inserem linhas em uma tabela.

Um exemplo potencialmente confuso disso é a sintaxe `INSERT INTO ... ON DUPLICATE KEY UPDATE ...`: um gatilho `BEFORE INSERT` é ativado para cada linha, seguido por um gatilho `AFTER INSERT` ou ambos os gatilhos `BEFORE UPDATE` e `AFTER UPDATE`, dependendo se havia uma chave duplicada para a linha.

Nota

As ações de chave estrangeira em cascata não ativam gatilhos.

É possível definir múltiplos gatilhos para uma tabela específica que tenham o mesmo evento de gatilho e hora de ação. Por exemplo, você pode ter dois gatilhos `BEFORE UPDATE` para uma tabela. Por padrão, os gatilhos que têm o mesmo evento de gatilho e hora de ação são ativados na ordem em que foram criados. Para alterar a ordem dos gatilhos, especifique uma cláusula `trigger_order` que indique `FOLLOWS` ou `PRECEDES` e o nome de um gatilho existente que também tenha o mesmo evento de gatilho e hora de ação. Com `FOLLOWS`, o novo gatilho é ativado após o gatilho existente. Com `PRECEDES`, o novo gatilho é ativado antes do gatilho existente.

*`trigger_body`* é a instrução a ser executada quando o gatilho é ativado. Para executar várias instruções, use a construção de instrução composta `BEGIN ... END`. Isso também permite que você use as mesmas instruções permitidas dentro de rotinas armazenadas. Veja Seção 13.6.1, “Instrução Composta BEGIN ... END”. Algumas instruções não são permitidas em gatilhos; veja Seção 23.8, “Restrições em Programas Armazenados”.

Dentro do corpo do gatilho, você pode se referir a colunas na tabela do assunto (a tabela associada ao gatilho) usando os aliases `OLD` e `NEW`. `OLD.col_name` refere-se a uma coluna de uma linha existente antes de ser atualizada ou excluída. `NEW.col_name` refere-se à coluna de uma nova linha a ser inserida ou a uma linha existente após ser atualizada.

Os gatilhos não podem usar `NEW.col_name` ou usar `OLD.col_name` para referenciar colunas geradas. Para obter informações sobre colunas geradas, consulte Seção 13.1.18.7, “CREATE TABLE e Colunas Geradas”.

O MySQL armazena o valor da variável de sistema `sql_mode` em vigor quando um gatilho é criado e sempre executa o corpo do gatilho com esse valor em vigor, *independentemente do modo SQL do servidor atual quando o gatilho começa a ser executado*.

A cláusula `DEFINER` especifica a conta MySQL a ser usada ao verificar os privilégios de acesso no momento da ativação do gatilho. Se a cláusula `DEFINER` estiver presente, o valor de *`user`* deve ser uma conta MySQL especificada como `'user_name'@'host_name'`, `CURRENT_USER` ou `CURRENT_USER()`. Os valores de *`user`* permitidos dependem dos privilégios que você possui, conforme discutido na Seção 23.6, “Controle de Acesso a Objetos Armazenados”. Veja também essa seção para obter informações adicionais sobre a segurança dos gatilhos.

Se a cláusula `DEFINER` for omitida, o definidor padrão é o usuário que executa a instrução `CREATE TRIGGER`. Isso é o mesmo que especificar explicitamente `DEFINER = CURRENT_USER`.

O MySQL leva em consideração o usuário `DEFINER` ao verificar os privilégios dos gatilhos da seguinte forma:

- No momento da criação do `CREATE TRIGGER`, o usuário que emite a declaração deve ter o privilégio `TRIGGER`.

- No momento da ativação do gatilho, os privilégios são verificados em relação ao usuário `DEFINER`. Esse usuário deve ter esses privilégios:

  - O privilégio `TRIGGER` para a tabela do sujeito.

  - O privilégio `SELECT` para a tabela do sujeito, se as referências às colunas da tabela ocorrerem usando `OLD.col_name` ou `NEW.col_name` no corpo do gatilho.

  - O privilégio `UPDATE` para a tabela do objeto, se as colunas da tabela forem alvos de atribuições `SET NEW.col_name = value` no corpo do gatilho.

  - Quaisquer outros privilégios normalmente necessários para as declarações executadas pelo gatilho.

Dentro de um corpo de gatilho, a função `CURRENT_USER` retorna a conta usada para verificar privilégios no momento da ativação do gatilho. Essa é a conta `DEFINER`, e não a conta do usuário cujas ações ativaram o gatilho. Para informações sobre auditoria de contas dentro de gatilhos, consulte Seção 6.2.18, “Auditorização de Atividades de Conta Baseada em SQL”.

Se você usar `LOCK TABLES` para bloquear uma tabela que tenha gatilhos, as tabelas usadas dentro do gatilho também serão bloqueadas, conforme descrito em LOCK TABLES e Gatilhos.

Para uma discussão adicional sobre o uso de gatilhos, consulte Seção 23.3.1, “Sintaxe e Exemplos de Gatilhos”.
