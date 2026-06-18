## 11.6 Valores Padrão de Tipos de Dados

As especificações de tipos de dados podem ter valores padrão explícitos ou implícitos.

* Tratamento Explícito de Padrão (Explicit Default Handling)
* Tratamento Implícito de Padrão (Implicit Default Handling)

### Tratamento Explícito de Padrão

Uma cláusula `DEFAULT value` na especificação de um tipo de dado indica explicitamente um valor padrão para uma coluna. Exemplos:

```sql
CREATE TABLE t1 (
  i     INT DEFAULT -1,
  c     VARCHAR(10) DEFAULT '',
  price DOUBLE(16,2) DEFAULT '0.00'
);
```

`SERIAL DEFAULT VALUE` é um caso especial. Na definição de uma coluna inteira, é um alias para `NOT NULL AUTO_INCREMENT UNIQUE`.

Com uma exceção, o valor padrão especificado em uma cláusula `DEFAULT` deve ser uma constante literal; não pode ser uma função ou uma expressão. Isso significa, por exemplo, que você não pode definir o padrão para uma coluna de data como o valor de uma função como `NOW()` ou `CURRENT_DATE`. A exceção é que, para colunas `TIMESTAMP` e `DATETIME`, você pode especificar `CURRENT_TIMESTAMP` como padrão. Consulte a Seção 11.2.6, “Inicialização e Atualização Automática para TIMESTAMP e DATETIME”.

Os tipos de dados `BLOB`, `TEXT`, `GEOMETRY` e `JSON` não podem ter um valor padrão atribuído.

### Tratamento Implícito de Padrão

Se a especificação de um tipo de dado não incluir um valor `DEFAULT` explícito, o MySQL determina o valor padrão da seguinte forma:

Se a coluna puder aceitar `NULL` como um valor, a coluna é definida com uma cláusula `DEFAULT NULL` explícita.

Se a coluna não puder aceitar `NULL` como um valor, o MySQL define a coluna sem uma cláusula `DEFAULT` explícita.

Para a entrada de dados em uma coluna `NOT NULL` que não possui uma cláusula `DEFAULT` explícita, se uma instrução `INSERT` ou `REPLACE` não incluir um valor para a coluna, ou uma instrução `UPDATE` definir a coluna como `NULL`, o MySQL trata a coluna de acordo com o modo SQL em vigor no momento:

* Se o modo SQL estrito estiver ativado, ocorrerá um erro para tabelas transacionais e a instrução será revertida (rolled back). Para tabelas não transacionais, ocorre um erro, mas se isso acontecer para a segunda ou subsequente linha de uma instrução de múltiplas linhas, quaisquer linhas que precederam o erro já foram inseridas.

* Se o modo estrito não estiver ativado, o MySQL define a coluna para o valor padrão implícito para o tipo de dado da coluna.

Suponha que uma tabela `t` seja definida da seguinte forma:

```sql
CREATE TABLE t (i INT NOT NULL);
```

Neste caso, `i` não tem um padrão explícito, então no modo estrito cada uma das seguintes instruções produz um erro e nenhuma linha é inserida. Quando não está usando o modo estrito, apenas a terceira instrução produz um erro; o padrão implícito é inserido para as duas primeiras instruções, mas a terceira falha porque `DEFAULT(i)` não pode produzir um valor:

```sql
INSERT INTO t VALUES();
INSERT INTO t VALUES(DEFAULT);
INSERT INTO t VALUES(DEFAULT(i));
```

Consulte a Seção 5.1.10, “Modos SQL do Servidor”.

Para uma determinada tabela, a instrução `SHOW CREATE TABLE` exibe quais colunas têm uma cláusula `DEFAULT` explícita.

Os padrões implícitos são definidos da seguinte forma:

* Para tipos numéricos, o padrão é `0`, com a exceção de que para tipos inteiros ou de ponto flutuante declarados com o atributo `AUTO_INCREMENT`, o padrão é o próximo valor na sequência.

* Para tipos de data e hora diferentes de `TIMESTAMP`, o padrão é o valor “zero” apropriado para o tipo. Isso também é verdade para `TIMESTAMP` se a variável de sistema `explicit_defaults_for_timestamp` estiver habilitada (consulte a Seção 5.1.7, “Variáveis de Sistema do Servidor”). Caso contrário, para a primeira coluna `TIMESTAMP` em uma tabela, o valor padrão é a data e hora atuais. Consulte a Seção 11.2, “Tipos de Dados de Data e Hora”.

* Para tipos String diferentes de `ENUM`, o valor padrão é a String vazia. Para `ENUM`, o padrão é o primeiro valor de enumeração.