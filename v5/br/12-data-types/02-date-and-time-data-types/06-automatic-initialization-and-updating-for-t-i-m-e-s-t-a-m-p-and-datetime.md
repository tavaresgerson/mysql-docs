### 11.2.6 Inicialização e Atualização Automática para TIMESTAMP e DATETIME

Colunas `TIMESTAMP` e `DATETIME` podem ser automaticamente inicializadas e atualizadas para a data e hora atuais (ou seja, o current timestamp).

Para qualquer coluna `TIMESTAMP` ou `DATETIME` em uma tabela, você pode atribuir o current timestamp como valor `DEFAULT`, valor de auto-atualização, ou ambos:

* Uma coluna auto-inicializada é definida como o current timestamp para linhas inseridas que não especificam um valor para a coluna.

* Uma coluna auto-atualizada é automaticamente atualizada para o current timestamp quando o valor de qualquer outra coluna na linha é alterado em relação ao seu valor atual. Uma coluna auto-atualizada permanece inalterada se todas as outras colunas forem definidas com seus valores atuais. Para evitar que uma coluna auto-atualizada seja atualizada quando outras colunas mudarem, defina-a explicitamente para o seu valor atual. Para atualizar uma coluna auto-atualizada mesmo quando outras colunas não mudam, defina-a explicitamente para o valor que ela deve ter (por exemplo, defina-a como `CURRENT_TIMESTAMP`).

Além disso, se a variável de sistema `explicit_defaults_for_timestamp` estiver desabilitada, você pode inicializar ou atualizar qualquer coluna `TIMESTAMP` (mas não `DATETIME`) para a data e hora atuais, atribuindo-lhe um valor `NULL`, a menos que tenha sido definida com o atributo `NULL` para permitir valores `NULL`.

Para especificar propriedades automáticas, utilize as cláusulas `DEFAULT CURRENT_TIMESTAMP` e `ON UPDATE CURRENT_TIMESTAMP` nas definições de coluna. A ordem das cláusulas não importa. Se ambas estiverem presentes na definição de uma coluna, qualquer uma delas pode aparecer primeiro. Qualquer um dos sinônimos para `CURRENT_TIMESTAMP` tem o mesmo significado que `CURRENT_TIMESTAMP`. Estes são `CURRENT_TIMESTAMP()`, `NOW()`, `LOCALTIME`, `LOCALTIME()`, `LOCALTIMESTAMP` e `LOCALTIMESTAMP()`.

O uso de `DEFAULT CURRENT_TIMESTAMP` e `ON UPDATE CURRENT_TIMESTAMP` é específico para `TIMESTAMP` e `DATETIME`. A cláusula `DEFAULT` também pode ser usada para especificar um valor DEFAULT constante (não automático) (por exemplo, `DEFAULT 0` ou `DEFAULT '2000-01-01 00:00:00'`).

Note: Os exemplos a seguir usam `DEFAULT 0`, um DEFAULT que pode gerar warnings ou erros dependendo se o strict SQL mode ou o `NO_ZERO_DATE` SQL mode estiverem habilitados. Esteja ciente de que o SQL mode `TRADITIONAL` inclui strict mode e `NO_ZERO_DATE`. Consulte a Seção 5.1.10, “Server SQL Modes”.

Definições de colunas `TIMESTAMP` ou `DATETIME` podem especificar o current timestamp para os valores DEFAULT e de auto-atualização, para um, mas não para o outro, ou para nenhum. Colunas diferentes podem ter diferentes combinações de propriedades automáticas. As seguintes regras descrevem as possibilidades:

* Com `DEFAULT CURRENT_TIMESTAMP` e `ON UPDATE CURRENT_TIMESTAMP`, a coluna tem o current timestamp como seu valor DEFAULT e é automaticamente atualizada para o current timestamp.

  ```sql
  CREATE TABLE t1 (
    ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    dt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );
  ```

* Com uma cláusula `DEFAULT`, mas sem uma cláusula `ON UPDATE CURRENT_TIMESTAMP`, a coluna tem o valor DEFAULT fornecido e não é automaticamente atualizada para o current timestamp.

  O DEFAULT depende se a cláusula `DEFAULT` especifica `CURRENT_TIMESTAMP` ou um valor constante. Com `CURRENT_TIMESTAMP`, o DEFAULT é o current timestamp.

  ```sql
  CREATE TABLE t1 (
    ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  ```

  Com uma constante, o DEFAULT é o valor fornecido. Neste caso, a coluna não possui propriedades automáticas.

  ```sql
  CREATE TABLE t1 (
    ts TIMESTAMP DEFAULT 0,
    dt DATETIME DEFAULT 0
  );
  ```

* Com uma cláusula `ON UPDATE CURRENT_TIMESTAMP` e uma cláusula `DEFAULT` constante, a coluna é automaticamente atualizada para o current timestamp e tem o valor DEFAULT constante fornecido.

  ```sql
  CREATE TABLE t1 (
    ts TIMESTAMP DEFAULT 0 ON UPDATE CURRENT_TIMESTAMP,
    dt DATETIME DEFAULT 0 ON UPDATE CURRENT_TIMESTAMP
  );
  ```

* Com uma cláusula `ON UPDATE CURRENT_TIMESTAMP`, mas sem uma cláusula `DEFAULT`, a coluna é automaticamente atualizada para o current timestamp, mas não tem o current timestamp como seu valor DEFAULT.

  O DEFAULT, neste caso, depende do tipo. `TIMESTAMP` tem um DEFAULT de 0, a menos que seja definido com o atributo `NULL`, caso em que o DEFAULT é `NULL`.

  ```sql
  CREATE TABLE t1 (
    ts1 TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,     -- default 0
    ts2 TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP -- default NULL
  );
  ```

  `DATETIME` tem um DEFAULT de `NULL`, a menos que seja definido com o atributo `NOT NULL`, caso em que o DEFAULT é 0.

  ```sql
  CREATE TABLE t1 (
    dt1 DATETIME ON UPDATE CURRENT_TIMESTAMP,         -- default NULL
    dt2 DATETIME NOT NULL ON UPDATE CURRENT_TIMESTAMP -- default 0
  );
  ```

Colunas `TIMESTAMP` e `DATETIME` não têm propriedades automáticas, a menos que sejam especificadas explicitamente, com esta exceção: Se a variável de sistema `explicit_defaults_for_timestamp` estiver desabilitada, a *primeira* coluna `TIMESTAMP` terá `DEFAULT CURRENT_TIMESTAMP` e `ON UPDATE CURRENT_TIMESTAMP` se nenhum deles for especificado explicitamente. Para suprimir as propriedades automáticas para a primeira coluna `TIMESTAMP`, use uma destas estratégias:

* Habilite a variável de sistema `explicit_defaults_for_timestamp`. Neste caso, as cláusulas `DEFAULT CURRENT_TIMESTAMP` e `ON UPDATE CURRENT_TIMESTAMP` que especificam a inicialização e atualização automáticas estão disponíveis, mas não são atribuídas a nenhuma coluna `TIMESTAMP`, a menos que sejam incluídas explicitamente na definição da coluna.

* Alternativamente, se `explicit_defaults_for_timestamp` estiver desabilitada, faça o seguinte:

  + Defina a coluna com uma cláusula `DEFAULT` que especifique um valor DEFAULT constante.

  + Especifique o atributo `NULL`. Isso também faz com que a coluna permita valores `NULL`, o que significa que você não pode atribuir o current timestamp definindo a coluna como `NULL`. Atribuir `NULL` define a coluna como `NULL`, não o current timestamp. Para atribuir o current timestamp, defina a coluna como `CURRENT_TIMESTAMP` ou um sinônimo como `NOW()`.

Considere estas definições de tabela:

```sql
CREATE TABLE t1 (
  ts1 TIMESTAMP DEFAULT 0,
  ts2 TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ON UPDATE CURRENT_TIMESTAMP);
CREATE TABLE t2 (
  ts1 TIMESTAMP NULL,
  ts2 TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ON UPDATE CURRENT_TIMESTAMP);
CREATE TABLE t3 (
  ts1 TIMESTAMP NULL DEFAULT 0,
  ts2 TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ON UPDATE CURRENT_TIMESTAMP);
```

As tabelas têm estas propriedades:

* Em cada definição de tabela, a primeira coluna `TIMESTAMP` não tem inicialização ou atualização automática.

* As tabelas diferem na forma como a coluna `ts1` lida com valores `NULL`. Para `t1`, `ts1` é `NOT NULL` e atribuir-lhe um valor `NULL` a define como o current timestamp. Para `t2` e `t3`, `ts1` permite `NULL` e atribuir-lhe um valor `NULL` a define como `NULL`.

* `t2` e `t3` diferem no valor DEFAULT para `ts1`. Para `t2`, `ts1` é definida para permitir `NULL`, então o DEFAULT também é `NULL` na ausência de uma cláusula `DEFAULT` explícita. Para `t3`, `ts1` permite `NULL`, mas tem um DEFAULT explícito de 0.

Se uma definição de coluna `TIMESTAMP` ou `DATETIME` incluir um valor explícito de precisão de segundos fracionários em qualquer lugar, o mesmo valor deve ser usado em toda a definição da coluna. Isto é permitido:

```sql
CREATE TABLE t1 (
  ts TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
);
```

Isto não é permitido:

```sql
CREATE TABLE t1 (
  ts TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(3)
);
```

#### Inicialização de TIMESTAMP e o Atributo NULL

Se a variável de sistema `explicit_defaults_for_timestamp` estiver desabilitada, as colunas `TIMESTAMP` são por DEFAULT `NOT NULL`, não podem conter valores `NULL`, e atribuir `NULL` atribui o current timestamp. Para permitir que uma coluna `TIMESTAMP` contenha `NULL`, declare-a explicitamente com o atributo `NULL`. Neste caso, o valor DEFAULT também se torna `NULL`, a menos que seja sobrescrito com uma cláusula `DEFAULT` que especifique um valor DEFAULT diferente. `DEFAULT NULL` pode ser usado para especificar explicitamente `NULL` como o valor DEFAULT. (Para uma coluna `TIMESTAMP` não declarada com o atributo `NULL`, `DEFAULT NULL` é inválido.) Se uma coluna `TIMESTAMP` permitir valores `NULL`, atribuir `NULL` a define como `NULL`, não como o current timestamp.

A tabela a seguir contém várias colunas `TIMESTAMP` que permitem valores `NULL`:

```sql
CREATE TABLE t
(
  ts1 TIMESTAMP NULL DEFAULT NULL,
  ts2 TIMESTAMP NULL DEFAULT 0,
  ts3 TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
);
```

Uma coluna `TIMESTAMP` que permite valores `NULL` *não* assume o current timestamp no momento da inserção, exceto sob uma das seguintes condições:

* Seu valor DEFAULT é definido como `CURRENT_TIMESTAMP` e nenhum valor é especificado para a coluna

* `CURRENT_TIMESTAMP` ou qualquer um dos seus sinônimos, como `NOW()`, é explicitamente inserido na coluna

Em outras palavras, uma coluna `TIMESTAMP` definida para permitir valores `NULL` é auto-inicializada apenas se sua definição incluir `DEFAULT CURRENT_TIMESTAMP`:

```sql
CREATE TABLE t (ts TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP);
```

Se a coluna `TIMESTAMP` permitir valores `NULL`, mas sua definição não incluir `DEFAULT CURRENT_TIMESTAMP`, você deve inserir explicitamente um valor correspondente à data e hora atuais. Suponha que as tabelas `t1` e `t2` tenham estas definições:

```sql
CREATE TABLE t1 (ts TIMESTAMP NULL DEFAULT '0000-00-00 00:00:00');
CREATE TABLE t2 (ts TIMESTAMP NULL DEFAULT NULL);
```

Para definir a coluna `TIMESTAMP` em qualquer uma das tabelas para o current timestamp no momento da inserção, atribua-lhe explicitamente esse valor. Por exemplo:

```sql
INSERT INTO t2 VALUES (CURRENT_TIMESTAMP);
INSERT INTO t1 VALUES (NOW());
```

Se a variável de sistema `explicit_defaults_for_timestamp` estiver habilitada, as colunas `TIMESTAMP` permitem valores `NULL` apenas se declaradas com o atributo `NULL`. Além disso, as colunas `TIMESTAMP` não permitem que a atribuição de `NULL` defina o current timestamp, seja declarada com o atributo `NULL` ou `NOT NULL`. Para atribuir o current timestamp, defina a coluna como `CURRENT_TIMESTAMP` ou um sinônimo como `NOW()`.