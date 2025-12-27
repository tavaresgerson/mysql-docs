### 12.3.9 Exemplos de Atribuição de Conjunto de Caracteres e Cotações

Os exemplos seguintes mostram como o MySQL determina os valores padrão de conjunto de caracteres e cotação.

**Exemplo 1: Definição de Tabela e Coluna**

```
CREATE TABLE t1
(
    c1 CHAR(10) CHARACTER SET latin1 COLLATE latin1_german1_ci
) DEFAULT CHARACTER SET latin2 COLLATE latin2_bin;
```

Aqui temos uma coluna com um conjunto de caracteres `latin1` e uma cotação `latin1_german1_ci`. A definição é explícita, então é simples. Observe que não há problema em armazenar uma coluna `latin1` em uma tabela `latin2`.

**Exemplo 2: Definição de Tabela e Coluna**

```
CREATE TABLE t1
(
    c1 CHAR(10) CHARACTER SET latin1
) DEFAULT CHARACTER SET latin1 COLLATE latin1_danish_ci;
```

Desta vez, temos uma coluna com um conjunto de caracteres `latin1` e uma cotação padrão. Embora possa parecer natural, a cotação padrão não é tirada do nível da tabela. Em vez disso, como a cotação padrão para `latin1` é sempre `latin1_swedish_ci`, a cotação da coluna `c1` é `latin1_swedish_ci` (não `latin1_danish_ci`).

**Exemplo 3: Definição de Tabela e Coluna**

```
CREATE TABLE t1
(
    c1 CHAR(10)
) DEFAULT CHARACTER SET latin1 COLLATE latin1_danish_ci;
```

Temos uma coluna com um conjunto de caracteres padrão e uma cotação padrão. Neste caso, o MySQL verifica o nível da tabela para determinar o conjunto de caracteres e a cotação da coluna. Consequentemente, o conjunto de caracteres da coluna `c1` é `latin1` e sua cotação é `latin1_danish_ci`.

**Exemplo 4: Definição de Banco de Dados, Tabela e Coluna**

```
CREATE DATABASE d1
    DEFAULT CHARACTER SET latin2 COLLATE latin2_czech_cs;
USE d1;
CREATE TABLE t1
(
    c1 CHAR(10)
);
```

Criamos uma coluna sem especificar seu conjunto de caracteres e cotação. Também não especificamos um conjunto de caracteres e uma cotação no nível da tabela. Neste caso, o MySQL verifica o nível do banco de dados para determinar as configurações da tabela, que, consequentemente, se tornam as configurações da coluna.) Consequentemente, o conjunto de caracteres da coluna `c1` é `latin2` e sua cotação é `latin2_czech_cs`.