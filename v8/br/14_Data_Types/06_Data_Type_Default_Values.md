## 13.6 Valores padrão do tipo de dados

As especificações de tipos de dados podem ter valores padrão explícitos ou implícitos.

Uma cláusula `DEFAULT value` em uma especificação de tipo de dados indica explicitamente um valor padrão para uma coluna. Exemplos:

```
CREATE TABLE t1 (
  i     INT DEFAULT -1,
  c     VARCHAR(10) DEFAULT '',
  price DOUBLE(16,2) DEFAULT 0.00
);
```

`SERIAL DEFAULT VALUE` é um caso especial. Na definição de uma coluna inteira, é um alias para `NOT NULL AUTO_INCREMENT UNIQUE`.

Alguns aspectos do tratamento da cláusula explícita `DEFAULT` dependem da versão, conforme descrito a seguir.

- Tratamento explícito de valores padrão a partir do MySQL 8.0.13
- Tratamento explícito de falhas padrão antes do MySQL 8.0.13
- Tratamento padrão implícito

### Tratamento explícito de valores padrão a partir do MySQL 8.0.13

O valor padrão especificado em uma cláusula `DEFAULT` pode ser uma constante literal ou uma expressão. Com uma exceção, coloque os valores padrão de expressões entre parênteses para distingui-los dos valores padrão de constantes literais. Exemplos:

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

A exceção é que, para as colunas `TIMESTAMP` e `DATETIME`, você pode especificar a função `CURRENT_TIMESTAMP` como padrão, sem encerrar em parênteses. Veja a Seção 13.2.5, “Inicialização e Atualização Automática para TIMESTAMP e DATETIME”.

Os tipos de dados `BLOB`, `TEXT`, `GEOMETRY` e `JSON` podem receber um valor padrão apenas se o valor for escrito como uma expressão, mesmo que o valor da expressão seja um literal:

- Isso é permitido (o padrão literal especificado como expressão):

  ```
  CREATE TABLE t2 (b BLOB DEFAULT ('abc'));
  ```

- Isso produz um erro (padrão literal não especificado como expressão):

  ```
  CREATE TABLE t2 (b BLOB DEFAULT 'abc');
  ```

Os valores padrão de expressão devem seguir as seguintes regras. Um erro ocorre se uma expressão contiver construções não permitidas.

- São permitidos literais, funções embutidas (determinísticos e não determinísticos) e operadores.

  Nota

  O mecanismo de armazenamento `NDBCLUSTER` suporta valores literais padrão, mas não valores de expressão padrão. Consulte a Seção 25.2.7.1, “Não conformidade com a sintaxe SQL no NDB Cluster”, para obter mais informações.

- Subconsultas, parâmetros, variáveis, funções armazenadas e funções carregáveis não são permitidas.

- Um valor padrão de expressão não pode depender de uma coluna que tenha o atributo `AUTO_INCREMENT`.

- Um valor padrão de expressão para uma coluna pode se referir a outras colunas da tabela, com a exceção de que as referências a colunas geradas ou colunas com valores padrão de expressão devem ser para colunas que ocorrem anteriormente na definição da tabela. Ou seja, os valores padrão de expressão não podem conter referências para frente a colunas geradas ou colunas com valores padrão de expressão.

  A restrição de ordem também se aplica ao uso de `ALTER TABLE` para reorganizar as colunas da tabela. Se a tabela resultante tiver um valor padrão de expressão que contenha uma referência para uma coluna gerada ou uma coluna com um valor padrão de expressão, a instrução falhará.

Nota

Se o valor padrão de qualquer componente de uma expressão depender do modo SQL, resultados diferentes podem ocorrer para diferentes usos da tabela, a menos que o modo SQL seja o mesmo em todos os usos.

Para `CREATE TABLE ... LIKE` e `CREATE TABLE ... SELECT`, a tabela de destino preserva os valores padrão de expressão da tabela original.

Se o valor padrão de uma expressão se referir a uma função não determinística, qualquer instrução que faça com que a expressão seja avaliada é insegura para a replicação baseada em instruções. Isso inclui instruções como `INSERT` e `UPDATE`. Nessa situação, se o registro binário estiver desativado, a instrução é executada normalmente. Se o registro binário estiver ativado e `binlog_format` estiver definido como `STATEMENT`, a instrução é registrada e executada, mas uma mensagem de aviso é escrita no log de erros, porque os escravos de replicação podem divergir. Quando `binlog_format` estiver definido como `MIXED` ou `ROW`, a instrução é executada normalmente.

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

No entanto, o uso de `DEFAULT(col_name)` para especificar o valor padrão para uma coluna com nome é permitido apenas para colunas que têm um valor padrão literal, e não para colunas que têm um valor padrão de expressão.

Nem todos os motores de armazenamento permitem valores padrão de expressão. Para aqueles que não permitem, ocorre um erro `ER_UNSUPPORTED_ACTION_ON_DEFAULT_VAL_GENERATED`.

Se um valor padrão for avaliado em um tipo de dado diferente do tipo declarado da coluna, a coerção implícita para o tipo declarado ocorre de acordo com as regras usuais de conversão de tipos do MySQL. Veja a Seção 14.3, “Conversão de Tipos na Avaliação de Expressões”.

### Tratamento explícito de falhas padrão antes do MySQL 8.0.13

Com uma exceção, o valor padrão especificado em uma cláusula `DEFAULT` deve ser uma constante literal; não pode ser uma função ou uma expressão. Isso significa, por exemplo, que você não pode definir o valor padrão de uma coluna de data como o valor de uma função como `NOW()` ou `CURRENT_DATE`. A exceção é que, para as colunas `TIMESTAMP` e `DATETIME`, você pode especificar `CURRENT_TIMESTAMP` como o padrão. Veja a Seção 13.2.5, “Inicialização e Atualização Automáticas para TIMESTAMP e DATETIME”.

Os tipos de dados `BLOB`, `TEXT`, `GEOMETRY` e `JSON` não podem receber um valor padrão.

Se um valor padrão for avaliado em um tipo de dado diferente do tipo declarado da coluna, a coerção implícita para o tipo declarado ocorre de acordo com as regras usuais de conversão de tipos do MySQL. Veja a Seção 14.3, “Conversão de Tipos na Avaliação de Expressões”.

### Tratamento padrão implícito

Se uma especificação de tipo de dados não incluir explicitamente o valor `DEFAULT`, o MySQL determina o valor padrão da seguinte forma:

Se a coluna puder aceitar `NULL` como um valor, a coluna é definida com uma cláusula explícita `DEFAULT NULL`.

Se a coluna não puder aceitar `NULL` como um valor, o MySQL define a coluna sem a cláusula explícita `DEFAULT`.

Para a entrada de dados em uma coluna `NOT NULL` que não possui cláusula explícita `DEFAULT`, se uma instrução `INSERT` ou `REPLACE` não incluir valor para a coluna, ou se uma instrução `UPDATE` definir a coluna para `NULL`, o MySQL trata a coluna de acordo com o modo SQL em vigor naquela época:

- Se o modo SQL rigoroso estiver ativado, um erro ocorrerá para tabelas transacionais e a instrução será revertida. Para tabelas não transacionais, um erro ocorrerá, mas se isso acontecer na segunda ou nas linhas subsequentes de uma instrução de várias linhas, as linhas anteriores serão inseridas.

- Se o modo estrito não estiver habilitado, o MySQL define a coluna com o valor padrão implícito para o tipo de dados da coluna.

Suponha que uma tabela `t` seja definida da seguinte forma:

```
CREATE TABLE t (i INT NOT NULL);
```

Neste caso, `i` não tem um valor padrão explícito, então, no modo estrito, cada uma das seguintes declarações produz um erro e nenhuma linha é inserida. Quando não se usa o modo estrito, apenas a terceira declaração produz um erro; o valor padrão implícito é inserido para as duas primeiras declarações, mas a terceira falha porque `DEFAULT(i)` não pode produzir um valor:

```
INSERT INTO t VALUES();
INSERT INTO t VALUES(DEFAULT);
INSERT INTO t VALUES(DEFAULT(i));
```

Consulte a Seção 7.1.11, “Modos SQL do Servidor”.

Para uma tabela específica, a declaração `SHOW CREATE TABLE` exibe quais colunas têm uma cláusula explícita `DEFAULT`.

Os valores padrão implícitos são definidos da seguinte forma:

- Para os tipos numéricos, o padrão é `0`, com a exceção de que, para os tipos inteiros ou de ponto flutuante declarados com o atributo `AUTO_INCREMENT`, o padrão é o próximo valor na sequência.

- Para os tipos de data e hora que não são `TIMESTAMP`, o valor padrão é o apropriado “zero” para o tipo. Isso também é verdadeiro para `TIMESTAMP` se a variável de sistema `explicit_defaults_for_timestamp` estiver habilitada (consulte a Seção 7.1.8, “Variáveis de Sistema do Servidor”). Caso contrário, para a primeira coluna `TIMESTAMP` de uma tabela, o valor padrão é a data e hora atuais. Consulte a Seção 13.2, “Tipos de Dados de Data e Hora”.

- Para tipos de string que não sejam `ENUM`, o valor padrão é a string vazia. Para `ENUM`, o padrão é o primeiro valor da enumeração.
