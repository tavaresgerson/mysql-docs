### 10.3.9 Exemplos de Atribuição de Character Set e Collation

Os exemplos a seguir mostram como o MySQL determina os valores padrão de Character Set e Collation.

**Exemplo 1: Definição de Tabela e Coluna**

```sql
CREATE TABLE t1
(
    c1 CHAR(10) CHARACTER SET latin1 COLLATE latin1_german1_ci
) DEFAULT CHARACTER SET latin2 COLLATE latin2_bin;
```

Aqui temos uma coluna com o Character Set `latin1` e o Collation `latin1_german1_ci`. A definição é explícita, tornando o processo direto. Observe que não há problema em armazenar uma coluna `latin1` em uma tabela `latin2`.

**Exemplo 2: Definição de Tabela e Coluna**

```sql
CREATE TABLE t1
(
    c1 CHAR(10) CHARACTER SET latin1
) DEFAULT CHARACTER SET latin1 COLLATE latin1_danish_ci;
```

Desta vez, temos uma coluna com o Character Set `latin1` e um Collation padrão. Embora possa parecer natural, o Collation padrão não é herdado do nível da tabela. Em vez disso, como o Collation padrão para `latin1` é sempre `latin1_swedish_ci`, a coluna `c1` terá o Collation `latin1_swedish_ci` (e não `latin1_danish_ci`).

**Exemplo 3: Definição de Tabela e Coluna**

```sql
CREATE TABLE t1
(
    c1 CHAR(10)
) DEFAULT CHARACTER SET latin1 COLLATE latin1_danish_ci;
```

Temos uma coluna com um Character Set padrão e um Collation padrão. Nesta circunstância, o MySQL verifica o nível da tabela para determinar o Character Set e o Collation da coluna. Consequentemente, o Character Set para a coluna `c1` é `latin1` e seu Collation é `latin1_danish_ci`.

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

Criamos uma coluna sem especificar seu Character Set e Collation. Também não especificamos um Character Set e um Collation no nível da tabela. Nesta circunstância, o MySQL verifica o nível do Database para determinar as configurações da tabela, que posteriormente se tornam as configurações da coluna. Consequentemente, o Character Set para a coluna `c1` é `latin2` e seu Collation é `latin2_czech_cs`.