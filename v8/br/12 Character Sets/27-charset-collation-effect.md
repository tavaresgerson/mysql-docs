### 12.8.6 Exemplos do Efeito da Cotação

**Exemplo 1: Ordenação de Dígrafos Alemães**

Suponha que a coluna `X` na tabela `T` tenha esses valores de coluna `latin1`:

```
Muffler
Müller
MX Systems
MySQL
```

Suponha também que os valores da coluna sejam recuperados usando a seguinte declaração:

```
SELECT X FROM T ORDER BY X COLLATE collation_name;
```

A tabela a seguir mostra a ordem resultante dos valores se usarmos `ORDER BY` com diferentes cotações.

<table><col style="width: 30%"/><col style="width: 30%"/><col style="width: 30%"/><thead><tr> <th><code>latin1_swedish_ci</code></th> <th><code>latin1_german1_ci</code></th> <th><code>latin1_german2_ci</code></th> </tr></thead><tbody><tr> <th>Muffler</th> <td>Muffler</td> <td>Müller</td> </tr><tr> <th>MX Systems</th> <td>Müller</td> <td>Muffler</td> </tr><tr> <th>Müller</th> <td>MX Systems</td> <td>MX Systems</td> </tr><tr> <th>MySQL</th> <td>MySQL</td> <td>MySQL</td> </tr></tbody></table>

O caractere que causa as diferentes ordens de classificação neste exemplo é `ü` (o dígrafo alemão “U-umlaut”).

* A primeira coluna mostra o resultado da `SELECT` usando a regra de cotação sueca/finlandesa, que diz que o U-umlaut é classificado com Y.
* A segunda coluna mostra o resultado da `SELECT` usando a regra DIN-1 alemã, que diz que o U-umlaut é classificado com U.
* A terceira coluna mostra o resultado da `SELECT` usando a regra DIN-2 alemã, que diz que o U-umlaut é classificado com UE.

**Exemplo 2: Busca por Dígrafos Alemães**

Suponha que você tenha três tabelas que diferem apenas pelo conjunto de caracteres e pela cotação usadas:

```
mysql> SET NAMES utf8mb4;
mysql> CREATE TABLE german1 (
         c CHAR(10)
       ) CHARACTER SET latin1 COLLATE latin1_german1_ci;
mysql> CREATE TABLE german2 (
         c CHAR(10)
       ) CHARACTER SET latin1 COLLATE latin1_german2_ci;
mysql> CREATE TABLE germanutf8 (
         c CHAR(10)
       ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Cada tabela contém dois registros:

```
mysql> INSERT INTO german1 VALUES ('Bar'), ('Bär');
mysql> INSERT INTO german2 VALUES ('Bar'), ('Bär');
mysql> INSERT INTO germanutf8 VALUES ('Bar'), ('Bär');
```

Duas das cotações acima têm uma igualdade `A = Ä`, e uma não tem tal igualdade (`latin1_german2_ci`). Por essa razão, as comparações produzem os resultados mostrados aqui:

```
mysql> SELECT * FROM german1 WHERE c = 'Bär';
+------+
| c    |
+------+
| Bar  |
| Bär  |
+------+
mysql> SELECT * FROM german2 WHERE c = 'Bär';
+------+
| c    |
+------+
| Bär  |
+------+
mysql> SELECT * FROM germanutf8 WHERE c = 'Bär';
+------+
| c    |
+------+
| Bar  |
| Bär  |
+------+
```

Isso não é um erro, mas sim uma consequência das propriedades de classificação de `latin1_german1_ci` e `utf8mb4_unicode_ci` (a classificação mostrada é feita de acordo com o padrão DIN 5007 alemão).