### 10.8.6 Exemplos do Efeito de Collation

**Exemplo 1: Ordenando Umlauts Alemães**

Suponha que a coluna `X` na tabela `T` tenha estes valores de coluna `latin1`:

```sql
Muffler
Müller
MX Systems
MySQL
```

Suponha também que os valores da coluna sejam recuperados usando a seguinte instrução:

```sql
SELECT X FROM T ORDER BY X COLLATE collation_name;
```

A tabela a seguir mostra a ordem resultante dos valores se usarmos `ORDER BY` com diferentes collations.

<table summary="Um exemplo do efeito de collation, conforme descrito no texto anterior. A tabela mostra a ordem resultante dos valores para três collations (latin1_swedish_ci, latin1_german1_ci, latin1_german2_ci) ao usar ORDER BY."><col style="width: 30%"/><col style="width: 30%"/><col style="width: 30%"/><thead><tr> <th><code>latin1_swedish_ci</code></th> <th><code>latin1_german1_ci</code></th> <th><code>latin1_german2_ci</code></th> </tr></thead><tbody><tr> <th>Muffler</th> <td>Muffler</td> <td>Müller</td> </tr><tr> <th>MX Systems</th> <td>Müller</td> <td>Muffler</td> </tr><tr> <th>Müller</th> <td>MX Systems</td> <td>MX Systems</td> </tr><tr> <th>MySQL</th> <td>MySQL</td> <td>MySQL</td> </tr> </tbody></table>

O caractere que causa as diferentes ordens de classificação (sort orders) neste exemplo é o U com dois pontos sobre ele (`ü`), que os alemães chamam de "U-umlaut".

* A primeira coluna mostra o resultado do `SELECT` usando a regra de collation Sueca/Finlandesa, que diz que o U-umlaut é classificado (sorts) com Y.

* A segunda coluna mostra o resultado do `SELECT` usando a regra Alemã DIN-1, que diz que o U-umlaut é classificado (sorts) com U.

* A terceira coluna mostra o resultado do `SELECT` usando a regra Alemã DIN-2, que diz que o U-umlaut é classificado (sorts) com UE.

**Exemplo 2: Pesquisando por Umlauts Alemães**

Suponha que você tenha três tabelas que diferem apenas pelo conjunto de caracteres e pela collation usados:

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

Duas das collations acima têm uma igualdade `A = Ä`, e uma não tem tal igualdade (`latin1_german2_ci`). Por esse motivo, você obterá estes resultados nas comparações:

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

Isso não é um bug, mas sim uma consequência das propriedades de ordenação (sorting properties) de `latin1_german1_ci` e `utf8_unicode_ci` (a ordenação mostrada é feita de acordo com o padrão Alemão DIN 5007).