## 13.6 Valores padrão do tipo de dados

As especificações de tipo de dados podem ter valores padrão explícitos ou implícitos.

Uma cláusula `DEFAULT value` em uma especificação de tipo de dados indica explicitamente um valor padrão para uma coluna. Exemplos:

```
CREATE TABLE t1 (
  i     INT DEFAULT -1,
  c     VARCHAR(10) DEFAULT '',
  price DOUBLE(16,2) DEFAULT 0.00
);
```

`SERIAL DEFAULT VALUE` é um caso especial. Na definição de uma coluna inteira, é um alias para `NOT NULL AUTO_INCREMENT UNIQUE`.

Alguns aspectos do tratamento explícito da cláusula `DEFAULT` dependem da versão, conforme descrito a seguir.

* Tratamento explícito de valores padrão a partir do MySQL 8.0.13
* Tratamento explícito de valores padrão antes do MySQL 8.0.13
* Tratamento implícito de valores padrão

### Tratamento explícito de falhas padrão a partir do MySQL 8.0.13

O valor padrão especificado em uma cláusula `DEFAULT` pode ser uma constante literal ou uma expressão. Com uma exceção, coloque os valores padrão de expressão dentro de parênteses para distingui-los dos valores padrão de constante literal. Exemplos:

```
CREATE TABLE t1 (
  -- literal defaults
  i INT         DEFAULT 0,
  c VARCHAR(10) DEFAULT '',
  -- expression defaults
  f FLOAT       DEFAULT (RAND() * RAND()),
  b BINARY(16)  DEFAULT (UUID_TO_BIN(UUID())),
  d DATE        DEFAULT (CURRENT_DATE + INTERVAL 1 YEAR),
  p POINT       DEFAULT (Point(0,0)),
  j JSON        DEFAULT (JSON_ARRAY())
);
```

A exceção é que, para as colunas `TIMESTAMP` e `DATETIME`, você pode especificar a função `CURRENT_TIMESTAMP` como padrão, sem encerrar em parênteses. Veja a Seção 13.2.5, “Inicialização e atualização automática para TIMESTAMP e DATETIME”.

Os tipos de dados `BLOB`, `TEXT`, `GEOMETRY` e `JSON` podem receber um valor padrão apenas se o valor for escrito como uma expressão, mesmo que o valor da expressão seja um literal:

* Isso é permitido (padrão literal especificado como expressão):

  ```
  CREATE TABLE t2 (b BLOB DEFAULT ('abc'));
  ```

* Isso produz um erro (padrão literal não especificado como expressão):

  ```
  CREATE TABLE t2 (b BLOB DEFAULT 'abc');
  ```

Os valores padrão de expressão devem seguir as seguintes regras. Um erro ocorre se uma expressão contiver construções não permitidas.

* são permitidos literais, funções embutidas (determinísticos e não determinísticos) e operadores.

Nota

O motor de armazenamento `NDBCLUSTER` suporta valores literais padrão, mas não valores de expressão padrão. Consulte a Seção 25.2.7.1, “Desconhecimento da sintaxe SQL no NDB Cluster”, para obter mais informações.

* Subconsultas, parâmetros, variáveis, funções armazenadas e funções carregáveis não são permitidos.

* Um valor padrão de expressão não pode depender de uma coluna que tenha o atributo `AUTO_INCREMENT`.

* Um valor padrão de expressão para uma coluna pode se referir a outras colunas da tabela, com a exceção de que as referências a colunas geradas ou colunas com valores padrão de expressão devem ser para colunas que ocorrem anteriormente na definição da tabela. Isso significa que os valores padrão de expressão não podem conter referências para frente a colunas geradas ou colunas com valores padrão de expressão.

A restrição de ordenação também se aplica ao uso de `ALTER TABLE` para reorganizar as colunas da tabela. Se a tabela resultante tivesse um valor padrão de expressão que contenha uma referência para uma coluna gerada ou coluna com um valor padrão de expressão, a declaração falha.

Nota

Se qualquer componente do valor padrão de uma expressão depender do modo SQL, podem ocorrer resultados diferentes para diferentes usos da tabela, a menos que o modo SQL seja o mesmo em todos os usos.

Para `CREATE TABLE ... LIKE` e (create-table-like.html "15.1.20.3 CREATE TABLE ... LIKE Statement"), a tabela de destino preserva os valores padrão de expressão da tabela original. Para `CREATE TABLE ... SELECT` e (create-table-select.html "15.1.20.4 CREATE TABLE ... SELECT Statement"), a tabela de destino preserva os valores padrão de expressão da tabela original.

Se o valor padrão de uma expressão se referir a uma função não determinística, qualquer declaração que faça com que a expressão seja avaliada é insegura para a replicação baseada em declarações. Isso inclui declarações como `INSERT` e `UPDATE`. Nessa situação, se o registro binário estiver desativado, a declaração é executada normalmente. Se o registro binário estiver ativado e `binlog_format` estiver definido como `STATEMENT`, a declaração é registrada e executada, mas uma mensagem de aviso é escrita no log de erro, porque os escravos de replicação podem divergir. Quando `binlog_format` estiver definido como `MIXED` ou `ROW`, a declaração é executada normalmente.

Ao inserir uma nova linha, o valor padrão para uma coluna com um valor padrão de expressão pode ser inserido omitindo o nome da coluna ou especificando a coluna como `DEFAULT` (assim como para colunas com valores padrão literais):

```
mysql> CREATE TABLE t4 (uid BINARY(16) DEFAULT (UUID_TO_BIN(UUID())));
mysql> INSERT INTO t4 () VALUES();
mysql> INSERT INTO t4 () VALUES(DEFAULT);
mysql> SELECT BIN_TO_UUID(uid) AS uid FROM t4;
+--------------------------------------+
| uid                                  |
+--------------------------------------+
| f1109174-94c9-11e8-971d-3bf1095aa633 |
| f110cf9a-94c9-11e8-971d-3bf1095aa633 |
+--------------------------------------+
```

No entanto, o uso de `DEFAULT(col_name)` para especificar o valor padrão para uma coluna nomeada é permitido apenas para colunas que têm um valor padrão literal, e não para colunas que têm um valor padrão de expressão.

Nem todos os motores de armazenamento permitem valores padrão de expressão. Para aqueles que não permitem, ocorre um erro `ER_UNSUPPORTED_ACTION_ON_DEFAULT_VAL_GENERATED`.

Se um valor padrão avaliar para um tipo de dados que difere do tipo de coluna declarado, a coerção implícita para o tipo declarado ocorre de acordo com as regras usuais de conversão de tipos do MySQL. Veja a Seção 14.3, “Conversão de Tipo na Avaliação da Expressão”.

### Tratamento explícito de falhas padrão antes do MySQL 8.0.13

Com uma exceção, o valor padrão especificado em uma cláusula `DEFAULT` deve ser uma constante literal; não pode ser uma função ou uma expressão. Isso significa, por exemplo, que você não pode definir o valor padrão de uma coluna de data como o valor de uma função, como `NOW()` ou `CURRENT_DATE`. A exceção é que, para as colunas `TIMESTAMP` e `DATETIME`, você pode especificar `CURRENT_TIMESTAMP` como padrão. Veja a Seção 13.2.5, “Inicialização e Atualização Automática para TIMESTAMP e DATETIME”.

Os tipos de dados `BLOB`, `TEXT`, `GEOMETRY` e `JSON` não podem receber um valor padrão.

Se um valor padrão avaliar para um tipo de dados que difere do tipo de coluna declarado, a coerção implícita para o tipo declarado ocorre de acordo com as regras usuais de conversão de tipos do MySQL. Veja a Seção 14.3, “Conversão de Tipo na Avaliação da Expressão”.

### Tratamento Implicit do Padrão Predefinido

Se uma especificação de tipo de dados não incluir explicitamente o valor `DEFAULT`, o MySQL determina o valor padrão da seguinte forma:

Se a coluna pode aceitar `NULL` como um valor, a coluna é definida com uma cláusula explícita de `DEFAULT NULL`.

Se a coluna não puder aceitar `NULL` como um valor, o MySQL define a coluna sem a cláusula explícita `DEFAULT`.

Para a entrada de dados em uma coluna `NOT NULL` que não possui cláusula explícita `DEFAULT`, se uma declaração `INSERT` ou `REPLACE` não incluir valor para a coluna, ou uma declaração `UPDATE` definir a coluna como `NULL`, o MySQL lida com a coluna de acordo com o modo SQL em vigor naquela época:

* Se o modo SQL rigoroso estiver habilitado, um erro ocorre para tabelas transacionais e a declaração é revertida. Para tabelas não transacionais, ocorre um erro, mas se isso acontecer na segunda ou nas demais linhas de uma declaração com várias linhas, as linhas anteriores são inseridas.

* Se o modo estrito não estiver habilitado, o MySQL define a coluna para o valor padrão implícito para o tipo de dados da coluna.

Suponha que uma tabela `t` seja definida da seguinte forma:

```
CREATE TABLE t (i INT NOT NULL);
```

Neste caso, `i` não tem um padrão explícito, então, em modo estrito, cada uma das seguintes declarações produz um erro e nenhuma linha é inserida. Quando não se usa o modo estrito, apenas a terceira declaração produz um erro; o padrão implícito é inserido para as duas primeiras declarações, mas a terceira falha porque `DEFAULT(i)` não pode produzir um valor:

```
INSERT INTO t VALUES();
INSERT INTO t VALUES(DEFAULT);
INSERT INTO t VALUES(DEFAULT(i));
```

Veja a Seção 7.1.11, “Modos SQL do servidor”.

Para uma tabela específica, a declaração `SHOW CREATE TABLE`(show-create-table.html "15.7.7.10 SHOW CREATE TABLE Statement") exibe quais colunas possuem uma cláusula explícita de `DEFAULT`.

Os defaults implícitos são definidos da seguinte forma:

* Para tipos numéricos, o padrão é `0`, com exceção de que, para tipos inteiros ou de ponto flutuante declarados com o atributo `AUTO_INCREMENT`, o padrão é o próximo valor na sequência.

* Para os tipos de data e hora que não são `TIMESTAMP`, o valor padrão é o apropriado para o tipo. Isso também é verdadeiro para `TIMESTAMP`, se a variável de sistema `explicit_defaults_for_timestamp` estiver habilitada (consulte Seção 7.1.8, “Variáveis do Sistema do Servidor”). Caso contrário, para a primeira coluna `TIMESTAMP` em uma tabela, o valor padrão é a data e hora atuais. Consulte Seção 13.2, “Tipos de Dados de Data e Hora”.

* Para os tipos de cadeia de caracteres que não são `ENUM`, o valor padrão é a cadeia de caracteres vazia. Para `ENUM`, o padrão é o primeiro valor da enumeração.