## 13.6 Valores Padrão de Tipo de Dados

As especificações de tipo de dados podem ter valores padrão explícitos ou implícitos.

Uma cláusula `valor padrão` em uma especificação de tipo de dados indica explicitamente um valor padrão para uma coluna. Exemplos:

```
CREATE TABLE t1 (
  i     INT DEFAULT -1,
  c     VARCHAR(10) DEFAULT '',
  price DOUBLE(16,2) DEFAULT 0.00
);
```

`SERIAL DEFAULT VALUE` é um caso especial. Na definição de uma coluna inteira, é um alias para `NOT NULL AUTO_INCREMENT UNIQUE`.

Alguns aspectos do tratamento da cláusula `DEFAULT` explícita são dependentes da versão, conforme descrito a seguir.

* Tratamento Explicito da Cláusula `DEFAULT`
* Tratamento Implícito da Cláusula `DEFAULT`

### Tratamento Explicito da Cláusula `DEFAULT`

O valor padrão especificado em uma cláusula `DEFAULT` pode ser uma constante literal ou uma expressão. Com uma exceção, coloque valores de expressão padrão entre parênteses para distingui-los de valores padrão de constante literal. Exemplos:

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

A exceção é que, para colunas `TIMESTAMP` e `DATETIME`, você pode especificar a função `CURRENT_TIMESTAMP` como padrão, sem colocar parênteses. Veja a Seção 13.2.5, “Inicialização e Atualização Automáticas para TIMESTAMP e DATETIME”.

Os tipos de dados `BLOB`, `TEXT`, `GEOMETRY` e `JSON` podem ter um valor padrão atribuído apenas se o valor for escrito como uma expressão, mesmo que o valor da expressão seja uma constante:

* Isso é permitido (constante padrão especificada como expressão):

  ```
  CREATE TABLE t2 (b BLOB DEFAULT ('abc'));
  ```
* Isso produz um erro (constante padrão não especificada como expressão):

  ```
  CREATE TABLE t2 (b BLOB DEFAULT 'abc');
  ```

Os valores padrão de expressão devem seguir as seguintes regras. Um erro ocorre se uma expressão contiver construções não permitidas.

* Literais, funções embutidas (tanto determinísticas quanto não determinísticas) e operadores são permitidos.

  ::: info Nota

  O motor de armazenamento  `NDBCLUSTER` suporta valores padrão de constante literal, mas não valores padrão de expressão. Veja a Seção 25.2.7.1, “Não Conformidade com a Sintaxe SQL no NDB Cluster”, para mais informações.

:::
* Subconsultas, parâmetros, variáveis, funções armazenadas e funções carregáveis não são permitidas.
* O valor padrão de uma expressão não pode depender de uma coluna que tenha o atributo `AUTO_INCREMENT`.
* O valor padrão de uma expressão para uma coluna pode referenciar outras colunas da tabela, com a exceção de que as referências a colunas geradas ou colunas com valores padrão de expressão devem ser para colunas que ocorrem anteriormente na definição da tabela. Ou seja, os valores padrão de expressão não podem conter referências para frente a colunas geradas ou colunas com valores padrão de expressão.

A restrição de ordenação também se aplica ao uso de `ALTER TABLE` para reorganizar as colunas da tabela. Se a tabela resultante tivesse um valor padrão de expressão que contenha uma referência para frente a uma coluna gerada ou coluna com um valor padrão de expressão, a instrução falhará. ::: info Nota

Se qualquer componente de um valor padrão de expressão depender do modo SQL, resultados diferentes podem ocorrer para diferentes usos da tabela, a menos que o modo SQL seja o mesmo durante todos os usos.


:::

Para `CREATE TABLE ... LIKE` e `CREATE TABLE ... SELECT`, a tabela de destino preserva os valores padrão de expressão da tabela original.

Se um valor padrão de expressão se referir a uma função não determinística, qualquer instrução que faça com que a expressão seja avaliada é insegura para a replicação baseada em instruções. Isso inclui instruções como `INSERT` e `UPDATE`. Nesta situação, se o registro binário estiver desativado, a instrução é executada normalmente. Se o registro binário estiver ativado e o `binlog_format` estiver definido como `STATEMENT`, a instrução é registrada e executada, mas uma mensagem de aviso é escrita no log de erro, porque as réplicas podem divergir. Quando o `binlog_format` estiver definido como `MIXED` ou `ROW`, a instrução é executada normalmente.

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

No entanto, o uso de `DEFAULT(col_name)` para especificar o valor padrão para uma coluna nomeada é permitido apenas para colunas que têm um valor padrão literal, não para colunas que têm um valor padrão de expressão.

Nem todos os motores de armazenamento permitem valores padrão de expressão. Para aqueles que não o fazem, ocorre um erro `ER_UNSUPPORTED_ACTION_ON_DEFAULT_VAL_GENERATED`.

Se um valor padrão avalia para um tipo de dados diferente do tipo declarado da coluna, ocorre uma coerção implícita para o tipo declarado de acordo com as regras usuais de conversão de tipos do MySQL. Veja a Seção 14.3, “Conversão de Tipo na Avaliação de Expressões”.

### Tratamento de Padrão Implícito

Se uma especificação de tipo de dados não incluir um valor explícito de `DEFAULT`, o MySQL determina o valor padrão da seguinte forma:

Se a coluna pode assumir `NULL` como um valor, a coluna é definida com uma cláusula explícita `DEFAULT NULL`.

Se a coluna não pode assumir `NULL` como um valor, o MySQL define a coluna sem uma cláusula `DEFAULT`.

Para a entrada de dados em uma coluna `NOT NULL` que não tem uma cláusula `DEFAULT` explícita, se uma declaração `INSERT` ou `REPLACE` não incluir um valor para a coluna, ou uma declaração `UPDATE` definir a coluna para `NULL`, o MySQL trata a coluna de acordo com o modo SQL em vigor no momento:

* Se o modo SQL rigoroso estiver habilitado, um erro ocorre para tabelas transacionais e a declaração é revertida. Para tabelas não transacionais, um erro ocorre, mas se isso acontecer para a segunda ou linha subsequente de uma declaração de várias linhas, as linhas anteriores são inseridas.
* Se o modo rigoroso não estiver habilitado, o MySQL define a coluna para o valor padrão implícito para o tipo de dados da coluna.

Suponha que uma tabela `t` seja definida da seguinte forma:

```
CREATE TABLE t (i INT NOT NULL);
```

Neste caso, `i` não tem um valor padrão explícito, então, no modo estrito, cada uma das seguintes declarações produz um erro e nenhuma linha é inserida. Quando não se usa o modo estrito, apenas a terceira declaração produz um erro; o valor padrão implícito é inserido para as duas primeiras declarações, mas a terceira falha porque `DEFAULT(i)` não pode produzir um valor:

```4ExFUKhIZy
Veja a Seção 7.1.11, “Modos SQL do Servidor”.
Para uma tabela específica, a declaração `SHOW CREATE TABLE` exibe quais colunas têm uma cláusula `DEFAULT` explícita.
Os valores padrão implícitos são definidos da seguinte forma:
* Para tipos numéricos, o valor padrão é `0`, com a exceção de que, para tipos inteiros ou de ponto flutuante declarados com o atributo `AUTO_INCREMENT`, o valor padrão é o próximo valor na sequência.
* Para tipos de data e hora, exceto `TIMESTAMP`, o valor padrão é o valor apropriado “zero” para o tipo. Isso também é verdadeiro para `TIMESTAMP` se a variável de sistema `explicit_defaults_for_timestamp` estiver habilitada (veja a Seção 7.1.8, “Variáveis de Sistema do Servidor”). Caso contrário, para a primeira coluna `TIMESTAMP` em uma tabela, o valor padrão é a data e hora atuais. Veja a Seção 13.2, “Tipos de Dados de Data e Hora”.
* Para tipos de string, exceto `ENUM`, o valor padrão é a string vazia. Para `ENUM`, o valor padrão é o primeiro valor de enumeração.