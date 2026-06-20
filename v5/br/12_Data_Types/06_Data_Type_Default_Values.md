## 11.6 Valores padrão do tipo de dados

As especificações de tipo de dados podem ter valores padrão explícitos ou implícitos.

* Tratamento explícito de defeito padrão
* Tratamento implícito de defeito padrão

### Tratamento explícito de falhas padrão

Uma cláusula `DEFAULT value` em uma especificação de tipo de dados indica explicitamente um valor padrão para uma coluna. Exemplos:

```sql
CREATE TABLE t1 (
  i     INT DEFAULT -1,
  c     VARCHAR(10) DEFAULT '',
  price DOUBLE(16,2) DEFAULT '0.00'
);
```

`SERIAL DEFAULT VALUE` é um caso especial. Na definição de uma coluna inteira, é um alias para `NOT NULL AUTO_INCREMENT UNIQUE`.

Com uma exceção, o valor padrão especificado em uma cláusula `DEFAULT` deve ser uma constante literal; não pode ser uma função ou uma expressão. Isso significa, por exemplo, que você não pode definir o valor padrão de uma coluna de data como o valor de uma função, como `NOW()` ou `CURRENT_DATE`. A exceção é que, para as colunas `TIMESTAMP` e `DATETIME`, você pode especificar `CURRENT_TIMESTAMP` como padrão. Veja a Seção 11.2.6, “Inicialização e Atualização Automática para TIMESTAMP e DATETIME”.

Os tipos de dados `BLOB`, `TEXT`, `GEOMETRY` e `JSON` não podem receber um valor padrão.

### Tratamento Implicit do Padrão Predefinido

Se uma especificação de tipo de dados não incluir explicitamente o valor `DEFAULT`, o MySQL determina o valor padrão da seguinte forma:

Se a coluna pode aceitar `NULL` como um valor, a coluna é definida com uma cláusula explícita de `DEFAULT NULL`.

Se a coluna não puder aceitar `NULL` como um valor, o MySQL define a coluna sem a cláusula explícita `DEFAULT`.

Para a entrada de dados em uma coluna `NOT NULL` que não possui cláusula explícita `DEFAULT`, se uma declaração `INSERT` ou `REPLACE` não incluir valor para a coluna, ou uma declaração `UPDATE` definir a coluna como `NULL`, o MySQL lida com a coluna de acordo com o modo SQL em vigor naquela época:

* Se o modo SQL rigoroso estiver habilitado, um erro ocorre para tabelas transacionais e a declaração é revertida. Para tabelas não transacionais, ocorre um erro, mas se isso acontecer na segunda ou nas demais linhas de uma declaração de várias linhas, todas as linhas que precedem o erro já foram inseridas.

* Se o modo estrito não estiver habilitado, o MySQL define a coluna para o valor padrão implícito para o tipo de dados da coluna.

Suponha que uma tabela `t` seja definida da seguinte forma:

```sql
CREATE TABLE t (i INT NOT NULL);
```

Neste caso, `i` não tem um padrão explícito, então, em modo estrito, cada uma das seguintes declarações produz um erro e nenhuma linha é inserida. Quando não se usa o modo estrito, apenas a terceira declaração produz um erro; o padrão implícito é inserido para as duas primeiras declarações, mas a terceira falha porque `DEFAULT(i)` não pode produzir um valor:

```sql
INSERT INTO t VALUES();
INSERT INTO t VALUES(DEFAULT);
INSERT INTO t VALUES(DEFAULT(i));
```

Veja a Seção 5.1.10, “Modos SQL do servidor”.

Para uma tabela específica, a declaração `SHOW CREATE TABLE` (show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement") exibe quais colunas possuem uma cláusula explícita `DEFAULT`.

Os defaults implícitos são definidos da seguinte forma:

* Para os tipos numéricos, o padrão é `0`, com exceção de que, para tipos inteiros ou de ponto flutuante declarados com o atributo `AUTO_INCREMENT`, o padrão é o próximo valor na sequência.

* Para os tipos de data e hora que não são `TIMESTAMP`, o valor padrão é o apropriado para o tipo. Isso também é válido para `TIMESTAMP`, se a variável de sistema `explicit_defaults_for_timestamp` estiver habilitada (consulte Seção 5.1.7, “Variáveis do Sistema do Servidor”). Caso contrário, para a primeira coluna `TIMESTAMP` em uma tabela, o valor padrão é a data e hora atuais. Consulte Seção 11.2, “Tipos de Dados de Data e Hora”.

* Para os tipos de cadeia de caracteres que não são `ENUM`, o valor padrão é a cadeia de caracteres vazia. Para `ENUM`, o padrão é o primeiro valor da enumeração.