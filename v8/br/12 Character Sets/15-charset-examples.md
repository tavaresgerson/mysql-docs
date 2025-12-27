### 12.3.9 Exemplos de Conjunto de Caracteres e Atribuição de Codificação

Os exemplos seguintes mostram como o MySQL determina os valores padrão de conjunto de caracteres e codificação.

**Exemplo 1: Definição de Tabela e Coluna**

```
CREATE TABLE t1
(
    c1 CHAR(10) CHARACTER SET latin1 COLLATE latin1_german1_ci
) DEFAULT CHARACTER SET latin2 COLLATE latin2_bin;
```

Aqui temos uma coluna com um conjunto de caracteres `latin1` e uma codificação `latin1_german1_ci`. A definição é explícita, então é direta. Note que não há problema em armazenar uma coluna `latin1` em uma tabela `latin2`.

**Exemplo 2: Definição de Tabela e Coluna**

```
CREATE TABLE t1
(
    c1 CHAR(10) CHARACTER SET latin1
) DEFAULT CHARACTER SET latin1 COLLATE latin1_danish_ci;
```

Desta vez, temos uma coluna com um conjunto de caracteres `latin1` e uma codificação padrão. Embora possa parecer natural, a codificação padrão não é tirada do nível da tabela. Em vez disso, como a codificação padrão para `latin1` é sempre `latin1_swedish_ci`, a codificação da coluna `c1` é `latin1_swedish_ci` (não `latin1_danish_ci`).

**Exemplo 3: Definição de Tabela e Coluna**

```
CREATE TABLE t1
(
    c1 CHAR(10)
) DEFAULT CHARACTER SET latin1 COLLATE latin1_danish_ci;
```

Temos uma coluna com um conjunto de caracteres padrão e uma codificação padrão. Neste caso, o MySQL verifica o nível da tabela para determinar o conjunto de caracteres e a codificação da coluna. Consequentemente, o conjunto de caracteres da coluna `c1` é `latin1` e sua codificação é `latin1_danish_ci`.

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

Criamos uma coluna sem especificar seu conjunto de caracteres e codificação. Também não especificamos um conjunto de caracteres e uma codificação no nível da tabela. Neste caso, o MySQL verifica o nível do banco de dados para determinar as configurações da tabela, que, consequentemente, se tornam as configurações da coluna.) Consequentemente, o conjunto de caracteres da coluna `c1` é `latin2` e sua codificação é `latin2_czech_cs`.