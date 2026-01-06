## 11.6 Valores padrão do tipo de dados

As especificações de tipos de dados podem ter valores padrão explícitos ou implícitos.

- Tratamento explícito de falhas padrão
- Tratamento padrão implícito

### Tratamento explícito de falhas padrão

Uma cláusula `valor padrão` em uma especificação de tipo de dados indica explicitamente um valor padrão para uma coluna. Exemplos:

```sql
CREATE TABLE t1 (
  i     INT DEFAULT -1,
  c     VARCHAR(10) DEFAULT '',
  price DOUBLE(16,2) DEFAULT '0.00'
);
```

`SERIAL DEFAULT VALUE` é um caso especial. Na definição de uma coluna inteira, é um alias para `NOT NULL AUTO_INCREMENT UNIQUE`.

Com uma exceção, o valor padrão especificado em uma cláusula `DEFAULT` deve ser uma constante literal; não pode ser uma função ou uma expressão. Isso significa, por exemplo, que você não pode definir o valor padrão para uma coluna de data como o valor de uma função como `NOW()` ou `CURRENT_DATE`. A exceção é que, para as colunas `TIMESTAMP` e `DATETIME`, você pode especificar `CURRENT_TIMESTAMP` como o padrão. Veja a Seção 11.2.6, “Inicialização e Atualização Automáticas para TIMESTAMP e DATETIME”.

Os tipos de dados `BLOB`, `TEXT`, `GEOMETRY` e `JSON` não podem ter um valor padrão atribuído.

### Tratamento padrão implícito

Se uma especificação de tipo de dados não incluir um valor `DEFAULT` explícito, o MySQL determina o valor padrão da seguinte forma:

Se a coluna puder aceitar `NULL` como valor, a coluna é definida com uma cláusula `DEFAULT NULL` explícita.

Se a coluna não puder aceitar `NULL` como valor, o MySQL define a coluna sem uma cláusula `DEFAULT` explícita.

Para a entrada de dados em uma coluna `NOT NULL` que não possui uma cláusula `DEFAULT` explícita, se uma instrução `INSERT` ou `REPLACE` não incluir nenhum valor para a coluna, ou se uma instrução `UPDATE` definir a coluna como `NULL`, o MySQL trata a coluna de acordo com o modo SQL em vigor no momento:

- Se o modo SQL rigoroso estiver ativado, um erro ocorrerá para tabelas transacionais e a instrução será revertida. Para tabelas não transacionais, um erro ocorrerá, mas se isso acontecer na segunda ou em uma linha subsequente de uma instrução com várias linhas, quaisquer linhas que antecedam o erro já foram inseridas.

- Se o modo estrito não estiver habilitado, o MySQL define a coluna com o valor padrão implícito para o tipo de dados da coluna.

Suponha que uma tabela `t` seja definida da seguinte forma:

```sql
CREATE TABLE t (i INT NOT NULL);
```

Neste caso, `i` não tem um valor padrão explícito, então, no modo estrito, cada uma das seguintes declarações produz um erro e nenhuma linha é inserida. Quando não se usa o modo estrito, apenas a terceira declaração produz um erro; o valor padrão implícito é inserido para as duas primeiras declarações, mas a terceira falha porque `DEFAULT(i)` não pode produzir um valor:

```sql
INSERT INTO t VALUES();
INSERT INTO t VALUES(DEFAULT);
INSERT INTO t VALUES(DEFAULT(i));
```

Consulte a Seção 5.1.10, “Modos SQL do Servidor”.

Para uma tabela específica, a instrução `SHOW CREATE TABLE` exibe quais colunas têm uma cláusula `DEFAULT` explícita.

Os valores padrão implícitos são definidos da seguinte forma:

- Para os tipos numéricos, o padrão é `0`, com a exceção de que, para os tipos inteiros ou de ponto flutuante declarados com o atributo `AUTO_INCREMENT`, o padrão é o próximo valor na sequência.

- Para os tipos de data e hora que não são `TIMESTAMP`, o valor padrão é o apropriado “zero” para o tipo. Isso também é verdadeiro para `TIMESTAMP` se a variável de sistema `explicit_defaults_for_timestamp` estiver habilitada (consulte a Seção 5.1.7, “Variáveis de Sistema do Servidor”). Caso contrário, para a primeira coluna `TIMESTAMP` em uma tabela, o valor padrão é a data e hora atuais. Consulte a Seção 11.2, “Tipos de Dados de Data e Hora”.

- Para tipos de string que não sejam `ENUM`, o valor padrão é a string vazia. Para `ENUM`, o padrão é o primeiro valor da enumeração.
