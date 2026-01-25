### 10.3.9 Exemplos de Atribuição de Character Set e Collation

Os exemplos a seguir mostram como o MySQL determina os valores padrão de character set e collation.

**Exemplo 1: Definição de Tabela e Coluna**

```sql
CREATE TABLE t1
(
    c1 CHAR(10) CHARACTER SET latin1 COLLATE latin1_german1_ci
) DEFAULT CHARACTER SET latin2 COLLATE latin2_bin;
```

Aqui temos uma coluna com o character set `latin1` e a collation `latin1_german1_ci`. A definição é explícita, o que torna isso direto. Note que não há problema em armazenar uma coluna `latin1` em uma tabela `latin2`.

**Exemplo 2: Definição de Tabela e Coluna**

```sql
CREATE TABLE t1
(
    c1 CHAR(10) CHARACTER SET latin1
) DEFAULT CHARACTER SET latin1 COLLATE latin1_danish_ci;
```

Desta vez, temos uma coluna com o character set `latin1` e uma collation padrão. Embora possa parecer natural, a collation padrão não é herdada do nível da tabela. Em vez disso, como a collation padrão para `latin1` é sempre `latin1_swedish_ci`, a coluna `c1` tem uma collation de `latin1_swedish_ci` (não `latin1_danish_ci`).

**Exemplo 3: Definição de Tabela e Coluna**

```sql
CREATE TABLE t1
(
    c1 CHAR(10)
) DEFAULT CHARACTER SET latin1 COLLATE latin1_danish_ci;
```

Temos uma coluna com character set padrão e collation padrão. Nesta circunstância, o MySQL verifica o nível da tabela para determinar o character set e a collation da coluna. Consequentemente, o character set para a coluna `c1` é `latin1` e sua collation é `latin1_danish_ci`.

**Exemplo 4: Definição de Database, Tabela e Coluna**

```sql
CREATE DATABASE d1
    DEFAULT CHARACTER SET latin2 COLLATE latin2_czech_cs;
USE d1;
CREATE TABLE t1
(
    c1 CHAR(10)
);
```

Criamos uma coluna sem especificar seu character set e collation. Também não estamos especificando um character set e uma collation no nível da tabela. Nesta circunstância, o MySQL verifica o nível do Database para determinar as configurações da tabela, que posteriormente se tornam as configurações da coluna. Consequentemente, o character set para a coluna `c1` é `latin2` e sua collation é `latin2_czech_cs`.