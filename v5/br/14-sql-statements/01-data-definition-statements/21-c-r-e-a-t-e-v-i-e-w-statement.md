### 13.1.21 Declaração CREATE VIEW

```sql
CREATE
    [OR REPLACE]
    [ALGORITHM = {UNDEFINED | MERGE | TEMPTABLE}]
    [DEFINER = user]
    [SQL SECURITY { DEFINER | INVOKER }]
    VIEW view_name [(column_list)]
    AS select_statement
    [WITH [CASCADED | LOCAL] CHECK OPTION]
```

A instrução `CREATE VIEW` cria uma nova visualização ou substitui uma visualização existente, se a cláusula `OR REPLACE` for fornecida. Se a visualização não existir, `CREATE OR REPLACE VIEW` é a mesma que `CREATE VIEW`. Se a visualização existir, `CREATE OR REPLACE VIEW` a substitui.

Para obter informações sobre as restrições de uso de visualizações, consulte Seção 23.9, “Restrições de visualizações”.

O `declaração_seleção` é uma declaração `SELECT` que fornece a definição da visualização. (Selecionar de uma visualização seleciona, na verdade, usando a declaração `SELECT`.) A `declaração_seleção` pode selecionar de tabelas base ou de outras visualizações.

A definição de visualização é "congelada" no momento da criação e não é afetada por alterações subsequentes nas definições das tabelas subjacentes. Por exemplo, se uma visualização for definida como `SELECT *` em uma tabela, novas colunas adicionadas à tabela mais tarde não se tornam parte da visualização, e colunas excluídas da tabela resultam em um erro ao selecionar a visualização.

A cláusula `ALGORITHM` afeta a forma como o MySQL processa a visualização. As cláusulas `DEFINER` e `SQL SECURITY` especificam o contexto de segurança a ser utilizado ao verificar os privilégios de acesso no momento da invocação da visualização. A cláusula `WITH CHECK OPTION` pode ser usada para restringir as inserções ou atualizações a linhas em tabelas referenciadas pela visualização. Essas cláusulas são descritas mais adiante nesta seção.

A instrução `CREATE VIEW` requer o privilégio `CREATE VIEW` para a visualização, e alguns privilégios para cada coluna selecionada pela instrução `SELECT`. Para colunas usadas em outros lugares na instrução `SELECT`, você deve ter o privilégio `SELECT`. Se a cláusula `OR REPLACE` estiver presente, você também deve ter o privilégio `DROP` para a visualização. Se a cláusula `DEFINER` estiver presente, os privilégios necessários dependem do valor de *`user`*, conforme discutido na Seção 23.6, “Controle de Acesso a Objetos Armazenados”.

Quando uma visualização é referenciada, a verificação de privilégios ocorre conforme descrito mais adiante nesta seção.

Uma visualização pertence a um banco de dados. Por padrão, uma nova visualização é criada no banco de dados padrão. Para criar a visualização explicitamente em um determinado banco de dados, use a sintaxe *`db_name.view_name`* para qualificar o nome da visualização com o nome do banco de dados:

```sql
CREATE VIEW test.v AS SELECT * FROM t;
```

Nomes de tabelas ou visualizações não qualificados na instrução `SELECT` também são interpretados em relação ao banco de dados padrão. Uma visualização pode referenciar tabelas ou visualizações em outros bancos de dados qualificando o nome da tabela ou visualização com o nome do banco de dados apropriado.

Dentro de um banco de dados, as tabelas base e as visualizações compartilham o mesmo espaço de nome, portanto, uma tabela base e uma visualização não podem ter o mesmo nome.

As colunas recuperadas pela instrução `SELECT` podem ser referências simples para colunas de tabelas ou expressões que utilizam funções, valores constantes, operadores e assim por diante.

Uma visualização deve ter nomes de colunas únicos, sem duplicatas, assim como uma tabela base. Por padrão, os nomes das colunas recuperadas pela instrução `SELECT` são usados para os nomes das colunas da visualização. Para definir nomes explícitos para as colunas da visualização, especifique a cláusula opcional *`column_list`* como uma lista de identificadores separados por vírgula. O número de nomes em *`column_list`* deve ser igual ao número de colunas recuperadas pela instrução `SELECT`.

Uma visualização pode ser criada a partir de vários tipos de instruções `SELECT`. Ela pode se referir a tabelas base ou outras visualizações. Ela pode usar junções, `UNION` e subconsultas. A instrução `SELECT` não precisa nem mesmo se referir a nenhuma tabela:

```sql
CREATE VIEW v_today (today) AS SELECT CURRENT_DATE;
```

O exemplo a seguir define uma visualização que seleciona duas colunas de outra tabela, bem como uma expressão calculada a partir dessas colunas:

```sql
mysql> CREATE TABLE t (qty INT, price INT);
mysql> INSERT INTO t VALUES(3, 50);
mysql> CREATE VIEW v AS SELECT qty, price, qty*price AS value FROM t;
mysql> SELECT * FROM v;
+------+-------+-------+
| qty  | price | value |
+------+-------+-------+
|    3 |    50 |   150 |
+------+-------+-------+
```

Uma definição de visualização está sujeita às seguintes restrições:

- A instrução `SELECT` não pode se referir a variáveis do sistema ou variáveis definidas pelo usuário.

- Dentro de um programa armazenado, a instrução `SELECT` não pode se referir a parâmetros do programa ou variáveis locais.

- A instrução `SELECT` não pode se referir a parâmetros de instruções preparadas.

- Qualquer tabela ou vista referida na definição deve existir. Se, após a criação da vista, uma tabela ou vista a que a definição se refere for excluída, o uso da vista resultará em um erro. Para verificar uma definição de vista em busca de problemas desse tipo, use a instrução `CHECK TABLE`.

- A definição não pode se referir a uma tabela `TEMPORARY` e você não pode criar uma visão `TEMPORARY`.

- Você não pode associar um gatilho a uma visualização.

- Os alias para os nomes das colunas na instrução `SELECT` são verificados contra o comprimento máximo da coluna de 64 caracteres (e não o comprimento máximo do alias de 256 caracteres).

O comando `ORDER BY` é permitido em uma definição de visualização, mas é ignorado se você selecionar dados de uma visualização usando uma instrução que tenha seu próprio `ORDER BY`.

Para outras opções ou cláusulas na definição, elas são adicionadas às opções ou cláusulas da declaração que faz referência à vista, mas o efeito é indefinido. Por exemplo, se uma definição de vista inclui uma cláusula `LIMIT`, e você selecionar a partir da vista usando uma declaração que tem sua própria cláusula `LIMIT`, é indefinido qual limite se aplica. Esse mesmo princípio se aplica a opções como `ALL`, `DISTINCT` ou `SQL_SMALL_RESULT` que seguem a palavra-chave `SELECT` e a cláusulas como `INTO`, `FOR UPDATE`, `LOCK IN SHARE MODE` e `PROCEDURE`.

Os resultados obtidos a partir de uma visualização podem ser afetados se você alterar o ambiente de processamento de consultas alterando as variáveis do sistema:

```sql
mysql> CREATE VIEW v (mycol) AS SELECT 'abc';
Query OK, 0 rows affected (0.01 sec)

mysql> SET sql_mode = '';
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT "mycol" FROM v;
+-------+
| mycol |
+-------+
| mycol |
+-------+
1 row in set (0.01 sec)

mysql> SET sql_mode = 'ANSI_QUOTES';
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT "mycol" FROM v;
+-------+
| mycol |
+-------+
| abc   |
+-------+
1 row in set (0.00 sec)
```

As cláusulas `DEFINER` e `SQL SECURITY` determinam qual conta do MySQL usar ao verificar os privilégios de acesso para a visualização quando uma instrução é executada que faz referência à visualização. Os valores válidos das características `SQL SECURITY` são `DEFINER` (o padrão) e `INVOKER`. Esses indicam que os privilégios necessários devem ser mantidos pelo usuário que definiu ou invocou a visualização, respectivamente.

Se a cláusula `DEFINER` estiver presente, o valor de *`user`* deve ser uma conta MySQL especificada como `'user_name'@'host_name'`, `CURRENT_USER` ou `CURRENT_USER()`. Os valores de *`user`* permitidos dependem dos privilégios que você possui, conforme discutido na Seção 23.6, “Controle de Acesso a Objetos Armazenados”. Veja também essa seção para obter informações adicionais sobre a segurança de visualizações.

Se a cláusula `DEFINER` for omitida, o definidor padrão é o usuário que executa a instrução `CREATE VIEW` (create-view\.html). Isso é o mesmo que especificar `DEFINER = CURRENT_USER` explicitamente.

Dentro de uma definição de visualização, a função `CURRENT_USER` retorna o valor `DEFINER` da visualização por padrão. Para visualizações definidas com a característica `SQL SECURITY INVOKER`, `CURRENT_USER` retorna a conta do invocante da visualização. Para informações sobre auditoria de usuários dentro de visualizações, consulte Seção 6.2.18, “Auditorização de Atividades de Conta Baseada em SQL”.

Dentro de uma rotina armazenada que é definida com a característica `SQL SECURITY DEFINER`, `CURRENT_USER` retorna o valor `DEFINER` da rotina. Isso também afeta uma visualização definida dentro de tal rotina, se a definição da visualização contiver um valor `DEFINER` de `CURRENT_USER`.

O MySQL verifica os privilégios de visualização da seguinte forma:

- No momento da definição da visualização, o criador da visualização deve ter os privilégios necessários para usar os objetos de nível superior acessados pela visualização. Por exemplo, se a definição da visualização se refere a colunas de tabela, o criador deve ter algum privilégio para cada coluna na lista de seleção da definição, e o privilégio `SELECT` para cada coluna usada em outro lugar na definição. Se a definição se referir a uma função armazenada, apenas os privilégios necessários para invocar a função podem ser verificados. Os privilégios necessários no momento da invocação da função podem ser verificados apenas conforme ela é executada: Para diferentes invocações, caminhos de execução diferentes dentro da função podem ser tomados.

- O usuário que faz referência a uma visualização deve ter os privilégios apropriados para acessá-la (`SELECT` para selecioná-la, `INSERT` para inseri-la, e assim por diante.)

- Quando uma vista é referenciada, os privilégios dos objetos acessados pela vista são verificados em relação aos privilégios da conta ou invocante `DEFINER`, dependendo se a característica `SQL SECURITY` é `DEFINER` ou `INVOKER`, respectivamente.

- Se a referência a uma vista causar a execução de uma função armazenada, a verificação de privilégios para as instruções executadas dentro da função depende se a característica `SQL SECURITY` da função é `DEFINER` ou `INVOKER`. Se a característica de segurança for `DEFINER`, a função é executada com os privilégios da conta `DEFINER`. Se a característica for `INVOKER`, a função é executada com os privilégios determinados pela característica `SQL SECURITY` da vista.

Exemplo: Uma visualização pode depender de uma função armazenada, e essa função pode invocar outras rotinas armazenadas. Por exemplo, a seguinte visualização invoca uma função armazenada `f()`:

```sql
CREATE VIEW v AS SELECT * FROM t WHERE t.id = f(t.name);
```

Suponha que `f()` contenha uma declaração como esta:

```sql
IF name IS NULL then
  CALL p1();
ELSE
  CALL p2();
END IF;
```

Os privilégios necessários para executar instruções dentro de `f()` precisam ser verificados quando `f()` é executado. Isso pode significar que são necessários privilégios para `p1()` ou `p2()`, dependendo do caminho de execução dentro de `f()`. Esses privilégios devem ser verificados em tempo de execução, e o usuário que deve possuir os privilégios é determinado pelos valores de `SQL SECURITY` da visão `v` e da função `f()`.

As cláusulas `DEFINER` e `SQL SECURITY` para visualizações são extensões do SQL padrão. No SQL padrão, as visualizações são tratadas usando as regras para `SQL SECURITY DEFINER`. O padrão diz que o definidor da visualização, que é o mesmo que o proprietário do esquema da visualização, obtém privilégios aplicáveis à visualização (por exemplo, `SELECT`) e pode concedê-los. O MySQL não tem o conceito de um "proprietário" de esquema, então o MySQL adiciona uma cláusula para identificar o definidor. A cláusula `DEFINER` é uma extensão onde a intenção é ter o que o padrão tem; ou seja, um registro permanente de quem definiu a visualização. É por isso que o valor padrão de `DEFINER` é a conta do criador da visualização.

A cláusula `ALGORITHM` opcional é uma extensão do MySQL para o SQL padrão. Ela afeta a forma como o MySQL processa a visualização. `ALGORITHM` aceita três valores: `MERGE`, `TEMPTABLE` ou `UNDEFINED`. Para mais informações, consulte Seção 23.5.2, “Algoritmos de Processamento de Visualizações”, bem como Seção 8.2.2.4, “Otimização de Tabelas Derivadas e Referências de Visualizações com Merging ou Materialização”.

Algumas visualizações são atualizáveis. Ou seja, você pode usá-las em declarações como `UPDATE`, `DELETE` ou `INSERT` para atualizar o conteúdo da tabela subjacente. Para que uma visualização seja atualizável, deve haver uma relação um-para-um entre as linhas da visualização e as linhas da tabela subjacente. Existem também certas outras construções que tornam uma visualização não atualizável.

Uma coluna gerada em uma visualização é considerada atualizável porque é possível atribuir a ela. No entanto, se tal coluna for atualizada explicitamente, o único valor permitido é `DEFAULT`. Para obter informações sobre colunas geradas, consulte Seção 13.1.18.7, “CREATE TABLE e Colunas Geradas”.

A cláusula `WITH CHECK OPTION` pode ser usada em uma visão atualizável para impedir inserções ou atualizações em linhas, exceto aquelas para as quais a cláusula `WHERE` no *`select_statement`* for verdadeira.

Em uma cláusula `WITH CHECK OPTION` para uma visualização atualizável, as palavras-chave `LOCAL` e `CASCADED` determinam o escopo das verificações de controle quando a visualização é definida em termos de outra visualização. A palavra-chave `LOCAL` restringe a `CHECK OPTION` apenas à visualização que está sendo definida. `CASCADED` faz com que as verificações para visualizações subjacentes sejam avaliadas também. Quando nenhuma das palavras-chave é fornecida, o padrão é `CASCADED`.

Para obter mais informações sobre visualizações atualizáveis e a cláusula `WITH CHECK OPTION`, consulte Seção 23.5.3, “Visualizações Atualizáveis e Inseríveis” e Seção 23.5.4, “A Cláusula VIEW WITH CHECK OPTION”.

Visões criadas antes do MySQL 5.7.3 que contêm `ORDER BY integer` podem resultar em erros no momento da avaliação da visão. Considere essas definições de visão, que usam `ORDER BY` com um número ordinal:

```sql
CREATE VIEW v1 AS SELECT x, y, z FROM t ORDER BY 2;
CREATE VIEW v2 AS SELECT x, 1, z FROM t ORDER BY 2;
```

No primeiro caso, `ORDER BY 2` refere-se a uma coluna nomeada `y`. No segundo caso, refere-se a uma constante 1. Para consultas que selecionam menos de 2 colunas (o número nomeado na cláusula `ORDER BY`), ocorre um erro se o servidor avaliar a visualização usando o algoritmo MERGE. Exemplos:

```sql
mysql> SELECT x FROM v1;
ERROR 1054 (42S22): Unknown column '2' in 'order clause'
mysql> SELECT x FROM v2;
ERROR 1054 (42S22): Unknown column '2' in 'order clause'
```

A partir do MySQL 5.7.3, para lidar com definições de visualizações como essa, o servidor as escreve de maneira diferente no arquivo `.frm` que armazena a definição da visualização. Essa diferença é visível com `SHOW CREATE VIEW`. Anteriormente, o arquivo `.frm` continha isso para a cláusula `ORDER BY 2`:

```sql
For v1: ORDER BY 2
For v2: ORDER BY 2
```

A partir da versão 5.7.3, o arquivo `.frm` contém o seguinte:

```sql
For v1: ORDER BY `t`.`y`
For v2: ORDER BY ''
```

Ou seja, para `v1`, 2 é substituído por uma referência ao nome da coluna referenciada. Para `v2`, 2 é substituído por uma expressão de string constante (a ordenação por uma constante não tem efeito, então a ordenação por qualquer constante funciona).

Se você estiver enfrentando erros de avaliação de visualizações, como os descritos acima, arraste e recarregeer a visualização para que o arquivo `.frm` contenha a representação da visualização atualizada. Alternativamente, para visualizações como `v2` que ordenam por um valor constante, arraste e recarregeer a visualização sem a cláusula `ORDER BY`.
