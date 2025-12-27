### 13.2.5 Inicialização e Atualização Automática para TIMESTAMP e DATETIME

As colunas `TIMESTAMP` e `DATETIME` podem ser inicializadas e atualizadas automaticamente para a data e hora atuais (ou seja, o timestamp atual).

Para qualquer coluna `TIMESTAMP` ou `DATETIME` em uma tabela, você pode atribuir o timestamp atual como o valor padrão, o valor de auto-atualização ou ambos:

* Uma coluna inicializada automaticamente é definida para o timestamp atual para linhas inseridas que não especificam um valor para a coluna.

* Uma coluna atualizada automaticamente é atualizada automaticamente para o timestamp atual quando o valor de qualquer outra coluna na linha for alterado de seu valor atual. Uma coluna atualizada automaticamente permanece inalterada se todas as outras colunas forem definidas com seus valores atuais. Para impedir que uma coluna atualizada automaticamente seja atualizada quando outras colunas são alteradas, defina-a explicitamente com seu valor atual. Para atualizar uma coluna atualizada automaticamente mesmo quando outras colunas não são alteradas, defina-a explicitamente com o valor que ela deve ter (por exemplo, defina-a como `CURRENT_TIMESTAMP`).

Além disso, se a variável de sistema `explicit_defaults_for_timestamp` for desativada, você pode inicializar ou atualizar qualquer coluna `TIMESTAMP` (mas não `DATETIME`) para a data e hora atuais, atribuindo-lhe um valor `NULL`, a menos que tenha sido definida com o atributo `NULL` para permitir valores `NULL`.

Para especificar propriedades automáticas, use as cláusulas `DEFAULT CURRENT_TIMESTAMP` e `ON UPDATE CURRENT_TIMESTAMP` nas definições de colunas. A ordem das cláusulas não importa. Se ambas estiverem presentes em uma definição de coluna, qualquer uma pode ocorrer primeiro. Qualquer um dos sinônimos de `CURRENT_TIMESTAMP` tem o mesmo significado que `CURRENT_TIMESTAMP`. Estes são `CURRENT_TIMESTAMP()`, `NOW()`, `LOCALTIME`, `LOCALTIME()`, `LOCALTIMESTAMP` e `LOCALTIMESTAMP()`.

O uso de `DEFAULT CURRENT_TIMESTAMP` e `ON UPDATE CURRENT_TIMESTAMP` é específico para `TIMESTAMP` e `DATETIME`. A cláusula `DEFAULT` também pode ser usada para especificar um valor padrão (não automático) constante (por exemplo, `DEFAULT 0` ou `DEFAULT '2000-01-01 00:00:00'`).

Nota

Os seguintes exemplos usam `DEFAULT 0`, um valor padrão que pode gerar avisos ou erros, dependendo se o modo SQL rigoroso ou o modo SQL `NO_ZERO_DATE` está habilitado. Tenha em mente que o modo SQL `TRADITIONAL` inclui o modo rigoroso e `NO_ZERO_DATE`. Consulte a Seção 7.1.11, “Modos SQL do Servidor”.

As definições de colunas `TIMESTAMP` ou `DATETIME` podem especificar o timestamp atual para os valores padrão e de atualização automática, para uma, mas não para a outra, ou para nenhuma. Diferentes colunas podem ter diferentes combinações de propriedades automáticas. As seguintes regras descrevem as possibilidades:

* Com `DEFAULT CURRENT_TIMESTAMP` e `ON UPDATE CURRENT_TIMESTAMP`, a coluna tem o timestamp atual para seu valor padrão e é automaticamente atualizado para o timestamp atual.

```
  CREATE TABLE t1 (
    ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    dt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );
  ```

* Com uma cláusula `DEFAULT` mas sem uma cláusula `ON UPDATE CURRENT_TIMESTAMP`, a coluna tem o valor padrão dado e não é automaticamente atualizado para o timestamp atual.

  O padrão depende se a cláusula `DEFAULT` especifica `CURRENT_TIMESTAMP` ou um valor constante. Com `CURRENT_TIMESTAMP`, o padrão é o timestamp atual.

  ```
  CREATE TABLE t1 (
    ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  ```

  Com um valor constante, o padrão é o valor dado. Neste caso, a coluna não tem propriedades automáticas.

  ```
  CREATE TABLE t1 (
    ts TIMESTAMP DEFAULT 0,
    dt DATETIME DEFAULT 0
  );
  ```

* Com uma cláusula `ON UPDATE CURRENT_TIMESTAMP` e uma cláusula `DEFAULT` constante, a coluna é automaticamente atualizada para o timestamp atual e tem o valor padrão constante dado.

  ```
  CREATE TABLE t1 (
    ts TIMESTAMP DEFAULT 0 ON UPDATE CURRENT_TIMESTAMP,
    dt DATETIME DEFAULT 0 ON UPDATE CURRENT_TIMESTAMP
  );
  ```

* Com uma cláusula `ON UPDATE CURRENT_TIMESTAMP`, mas sem a cláusula `DEFAULT`, a coluna é atualizada automaticamente para o timestamp atual, mas não tem o timestamp atual como valor padrão.

O padrão neste caso depende do tipo. `TIMESTAMP` tem um padrão de 0, a menos que seja definido com o atributo `NULL`, caso em que o padrão é `NULL`.

```
  CREATE TABLE t1 (
    ts1 TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,     -- default 0
    ts2 TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP -- default NULL
  );
  ```

`DATETIME` tem um padrão de `NULL`, a menos que seja definido com o atributo `NOT NULL`, caso em que o padrão é 0.

```
  CREATE TABLE t1 (
    dt1 DATETIME ON UPDATE CURRENT_TIMESTAMP,         -- default NULL
    dt2 DATETIME NOT NULL ON UPDATE CURRENT_TIMESTAMP -- default 0
  );
  ```

As colunas `TIMESTAMP` e `DATETIME` não têm propriedades automáticas, a menos que sejam especificadas explicitamente, com esta exceção: Se a variável de sistema `explicit_defaults_for_timestamp` for desativada, a *primeira* coluna `TIMESTAMP` terá tanto `DEFAULT CURRENT_TIMESTAMP` quanto `ON UPDATE CURRENT_TIMESTAMP`, se nenhuma for especificada explicitamente. Para suprimir as propriedades automáticas para a primeira coluna `TIMESTAMP`, use uma das seguintes estratégias:

* Ative a variável de sistema `explicit_defaults_for_timestamp`. Neste caso, as cláusulas `DEFAULT CURRENT_TIMESTAMP` e `ON UPDATE CURRENT_TIMESTAMP` que especificam a inicialização e atualização automáticas estão disponíveis, mas não são atribuídas a nenhuma coluna `TIMESTAMP`, a menos que sejam incluídas explicitamente na definição da coluna.

* Alternativamente, se `explicit_defaults_for_timestamp` estiver desativada, faça uma das seguintes ações:

  + Defina a coluna com uma cláusula `DEFAULT` que especifique um valor padrão constante.

  + Especifique o atributo `NULL`. Isso também faz com que a coluna permita valores `NULL`, o que significa que você não pode atribuir o timestamp atual configurando a coluna para `NULL`. Atribuir `NULL` configura a coluna para `NULL`, não para o timestamp atual. Para atribuir o timestamp atual, configure a coluna para `CURRENT_TIMESTAMP` ou um sinônimo como `NOW()`.

Considere as seguintes definições de tabelas:

```
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

As tabelas têm essas propriedades:

* Na definição de cada coluna `TIMESTAMP`, não há inicialização ou atualização automática.

* As tabelas diferem na forma como a coluna `ts1` lida com valores `NULL`. Para `t1`, `ts1` é `NOT NULL` e atribuir um valor de `NULL` a ela o define como o timestamp atual. Para `t2` e `t3`, `ts1` permite `NULL` e atribuir um valor de `NULL` a ela o define como `NULL`.

* `t2` e `t3` diferem no valor padrão para `ts1`. Para `t2`, `ts1` é definido para permitir `NULL`, então o padrão também é `NULL` na ausência de uma cláusula `DEFAULT`. Para `t3`, `ts1` permite `NULL` mas tem um padrão explícito de 0.

Se uma definição de coluna `TIMESTAMP` ou `DATETIME` inclui um valor explícito de precisão de frações de segundo em qualquer lugar, o mesmo valor deve ser usado em toda a definição da coluna. Isso é permitido:

```
CREATE TABLE t1 (
  ts TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
);
```

Isso não é permitido:

```
CREATE TABLE t1 (
  ts TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(3)
);
```

#### Inicialização do TIMESTAMP e o Atributo NULL

Se a variável de sistema `explicit_defaults_for_timestamp` estiver desativada, as colunas `TIMESTAMP` por padrão são `NOT NULL`, não podem conter valores `NULL` e atribuir `NULL` assegura o timestamp atual. Para permitir que uma coluna `TIMESTAMP` contenha `NULL`, declare-a explicitamente com o atributo `NULL`. Neste caso, o valor padrão também se torna `NULL` a menos que seja sobrescrito com uma cláusula `DEFAULT` que especifique um valor padrão diferente. `DEFAULT NULL` pode ser usado para especificar explicitamente `NULL` como o valor padrão. (Para uma coluna `TIMESTAMP` não declarada com o atributo `NULL`, `DEFAULT NULL` é inválida.) Se uma coluna `TIMESTAMP` permite valores `NULL`, atribuir `NULL` a ela o define como `NULL`, não como o timestamp atual.

A tabela a seguir contém várias colunas `TIMESTAMP` que permitem valores `NULL`:

```
CREATE TABLE t
(
  ts1 TIMESTAMP NULL DEFAULT NULL,
  ts2 TIMESTAMP NULL DEFAULT 0,
  ts3 TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
);
```

Uma coluna `TIMESTAMP` que permite valores `NULL *não* assume o timestamp atual no momento da inserção, exceto sob uma das seguintes condições:

* Seu valor padrão é definido como `CURRENT_TIMESTAMP` e nenhum valor é especificado para a coluna

* `CURRENT_TIMESTAMP` ou qualquer um de seus sinônimos, como `NOW()`, é inserido explicitamente na coluna

Em outras palavras, uma coluna `TIMESTAMP` definida para permitir valores `NULL` se auto-inicializa apenas se sua definição incluir `DEFAULT CURRENT_TIMESTAMP`:

```
CREATE TABLE t (ts TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP);
```

Se a coluna `TIMESTAMP` permitir valores `NULL`, mas sua definição não incluir `DEFAULT CURRENT_TIMESTAMP`, você deve inserir explicitamente um valor correspondente à data e hora atuais. Suponha que as tabelas `t1` e `t2` tenham essas definições:

```
CREATE TABLE t1 (ts TIMESTAMP NULL DEFAULT '0000-00-00 00:00:00');
CREATE TABLE t2 (ts TIMESTAMP NULL DEFAULT NULL);
```

Para definir a coluna `TIMESTAMP` em qualquer uma das tabelas para o timestamp atual no momento da inserção, atribua explicitamente esse valor. Por exemplo:

```
INSERT INTO t2 VALUES (CURRENT_TIMESTAMP);
INSERT INTO t1 VALUES (NOW());
```

Se a variável de sistema `explicit_defaults_for_timestamp` estiver habilitada, as colunas `TIMESTAMP` permitem valores `NULL` apenas se declaradas com o atributo `NULL`. Além disso, as colunas `TIMESTAMP` não permitem atribuir `NULL` para atribuir o timestamp atual, seja declaradas com o atributo `NULL` ou `NOT NULL`. Para atribuir o timestamp atual, defina a coluna para `CURRENT_TIMESTAMP` ou um sinônimo como `NOW()`.