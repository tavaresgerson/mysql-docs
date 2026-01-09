### 10.8.6 Exemplos do efeito da cotação

**Exemplo 1: Ordenação de Umlauts Alemães**

Suponha que a coluna `X` na tabela `T` tenha esses valores de coluna `latin1`:

```sql
Muffler
Müller
MX Systems
MySQL
```

Suponha também que os valores da coluna sejam recuperados usando a seguinte declaração:

```sql
SELECT X FROM T ORDER BY X COLLATE collation_name;
```

A tabela a seguir mostra a ordem resultante dos valores se usarmos `ORDER BY` com diferentes colatações.

<table summary="Um exemplo do efeito da ordenação, conforme descrito no texto anterior. A tabela mostra a ordem resultante dos valores para três ordenações (latin1_swedish_ci, latin1_german1_ci, latin1_german2_ci) ao usar o comando ORDER BY."><col style="width: 30%"/><col style="width: 30%"/><col style="width: 30%"/><thead><tr> <th>[[<code>latin1_swedish_ci</code>]]</th> <th>[[<code>latin1_german1_ci</code>]]</th> <th>[[<code>latin1_german2_ci</code>]]</th> </tr></thead><tbody><tr> <th>Silenciador</th> <td>Silenciador</td> <td>Müller</td> </tr><tr> <th>MX Systems</th> <td>Müller</td> <td>Silenciador</td> </tr><tr> <th>Müller</th> <td>MX Systems</td> <td>MX Systems</td> </tr><tr> <th>MySQL</th> <td>MySQL</td> <td>MySQL</td> </tr></tbody></table>

O caractere que causa as diferentes ordens de classificação neste exemplo é o U com dois pontos sobre ele (`ü`), que os alemães chamam de "U-umlaut".

- A primeira coluna mostra o resultado da consulta `SELECT` usando a regra de ordenação sueca/finlandesa, que diz que a letra com tilde (U-umlaut) é ordenada antes da letra Y.

- A segunda coluna mostra o resultado da consulta usando a regra DIN-1 alemã, que diz que o U-umlaut é classificado com U.

- A terceira coluna mostra o resultado da consulta `SELECT` usando a regra DIN-2 alemã, que diz que o U-umlaut é classificado com UE.

**Exemplo 2: Procurando por Umlauts Alemães**

Suponha que você tenha três tabelas que diferem apenas pelo conjunto de caracteres e pela ordem de classificação utilizados:

```sql
mysql> SET NAMES utf8;
mysql> CREATE TABLE german1 (
         c CHAR(10)
       ) CHARACTER SET latin1 COLLATE latin1_german1_ci;
mysql> CREATE TABLE german2 (
         c CHAR(10)
       ) CHARACTER SET latin1 COLLATE latin1_german2_ci;
mysql> CREATE TABLE germanutf8 (
         c CHAR(10)
       ) CHARACTER SET utf8 COLLATE utf8_unicode_ci;
```

Cada tabela contém dois registros:

```sql
mysql> INSERT INTO german1 VALUES ('Bar'), ('Bär');
mysql> INSERT INTO german2 VALUES ('Bar'), ('Bär');
mysql> INSERT INTO germanutf8 VALUES ('Bar'), ('Bär');
```

Dois dos colchetes acima têm uma igualdade `A = Ä`, e um não tem essa igualdade (`latin1_german2_ci`). Por isso, você receberá esses resultados nas comparações:

```sql
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

Isso não é um erro, mas sim uma consequência das propriedades de ordenação de `latin1_german1_ci` e `utf8_unicode_ci` (a ordenação mostrada é feita de acordo com o padrão alemão DIN 5007).
