### 10.3.9 Exemplos de Conjunto de Caracteres e Atribuição de Codificação

Os exemplos a seguir mostram como o MySQL determina os valores padrão de conjunto de caracteres e collation.

**Exemplo 1: Definição de Tabela e Coluna**

```sql
CREATE TABLE t1
(
    c1 CHAR(10) CHARACTER SET latin1 COLLATE latin1_german1_ci
) DEFAULT CHARACTER SET latin2 COLLATE latin2_bin;
```

Aqui temos uma coluna com um conjunto de caracteres `latin1` e uma ordenação `latin1_german1_ci`. A definição é explícita, então é simples. Observe que não há problema em armazenar uma coluna `latin1` em uma tabela `latin2`.

**Exemplo 2: Definição de Tabela e Coluna**

```sql
CREATE TABLE t1
(
    c1 CHAR(10) CHARACTER SET latin1
) DEFAULT CHARACTER SET latin1 COLLATE latin1_danish_ci;
```

Desta vez, temos uma coluna com um conjunto de caracteres `latin1` e uma ordenação padrão. Embora possa parecer natural, a ordenação padrão não é tirada do nível da tabela. Em vez disso, como a ordenação padrão para `latin1` é sempre `latin1_swedish_ci`, a coluna `c1` tem uma ordenação de `latin1_swedish_ci` (não `latin1_danish_ci`).

**Exemplo 3: Definição de Tabela e Coluna**

```sql
CREATE TABLE t1
(
    c1 CHAR(10)
) DEFAULT CHARACTER SET latin1 COLLATE latin1_danish_ci;
```

Temos uma coluna com um conjunto de caracteres padrão e uma ordenação padrão. Nessa circunstância, o MySQL verifica o nível da tabela para determinar o conjunto de caracteres da coluna e a ordenação. Consequentemente, o conjunto de caracteres da coluna `c1` é `latin1` e sua ordenação é `latin1_danish_ci`.

**Exemplo 4: Definição de Banco de Dados, Tabela e Coluna**

```sql
CREATE DATABASE d1
    DEFAULT CHARACTER SET latin2 COLLATE latin2_czech_cs;
USE d1;
CREATE TABLE t1
(
    c1 CHAR(10)
);
```

Criamos uma coluna sem especificar seu conjunto de caracteres e ordenação. Também não estamos especificando um conjunto de caracteres e uma ordenação no nível da tabela. Nessa circunstância, o MySQL verifica o nível do banco de dados para determinar as configurações da tabela, que, posteriormente, se tornam as configurações da coluna.) Consequentemente, o conjunto de caracteres para a coluna `c1` é `latin2` e sua ordenação é `latin2_czech_cs`.
