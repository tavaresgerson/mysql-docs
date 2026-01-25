### 12.21.3 Tratamento de Expressões

Com matemática de precisão, números de valor exato são usados conforme fornecidos sempre que possível. Por exemplo, números em comparações são usados exatamente como fornecidos, sem alteração de valor. No modo SQL estrito, para um `INSERT` em uma coluna com um tipo de dado exato (`DECIMAL` - DECIMAL, NUMERIC") ou integer), um número é inserido com seu valor exato se estiver dentro do intervalo da coluna. Ao ser recuperado, o valor deve ser o mesmo que foi inserido. (Se o modo SQL estrito não estiver habilitado, o truncamento para `INSERT` é permitido.)

O tratamento de uma expressão numérica depende do tipo de valores que ela contém:

* Se quaisquer valores aproximados estiverem presentes, a expressão é aproximada e é avaliada usando arithmetic de floating-point.

* Se nenhum valor aproximado estiver presente, a expressão contém apenas valores exatos. Se qualquer valor exato contiver uma parte fracionária (um valor após o ponto decimal), a expressão será avaliada usando arithmetic exata de `DECIMAL` - DECIMAL, NUMERIC") e terá uma precisão de 65 dígitos. O termo "exato" está sujeito aos limites do que pode ser representado em binário. Por exemplo, `1.0/3.0` pode ser aproximado em notação decimal como `.333...`, mas não escrito como um número exato, então `(1.0/3.0)*3.0` não é avaliado exatamente como `1.0`.

* Caso contrário, a expressão contém apenas valores integer. A expressão é exata e avaliada usando arithmetic de integer e possui uma precisão idêntica à de `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") (64 bits).

Se uma expressão numérica contiver quaisquer strings, elas são convertidas para valores de floating-point de precisão dupla e a expressão é aproximada.

Os Inserts em colunas numéricas são afetados pelo modo SQL, que é controlado pela variável de sistema `sql_mode`. (Consulte Seção 5.1.10, “Server SQL Modes”.) A discussão a seguir menciona o modo estrito (selecionado pelos valores de modo `STRICT_ALL_TABLES` ou `STRICT_TRANS_TABLES`) e `ERROR_FOR_DIVISION_BY_ZERO`. Para ativar todas as restrições, você pode simplesmente usar o modo `TRADITIONAL`, que inclui ambos os valores de modo estrito e `ERROR_FOR_DIVISION_BY_ZERO`:

```sql
SET sql_mode='TRADITIONAL';
```

Se um número é inserido em uma coluna de tipo exato (`DECIMAL` - DECIMAL, NUMERIC") ou integer), ele é inserido com seu valor exato se estiver dentro do range e da precisão da coluna.

Se o valor tiver muitos dígitos na parte fracionária, o arredondamento (rounding) ocorre e uma nota é gerada. O arredondamento é feito conforme descrito na Seção 12.21.4, “Rounding Behavior”. O truncamento devido ao arredondamento da parte fracionária não é um error, mesmo no modo estrito.

Se o valor tiver muitos dígitos na parte inteira, ele é muito grande (fora de range) e é tratado da seguinte forma:

* Se o modo estrito não estiver habilitado, o valor é truncado para o valor legal mais próximo e um warning é gerado.

* Se o modo estrito estiver habilitado, ocorre um error de overflow.

Para literais `DECIMAL` - DECIMAL, NUMERIC"), além do limite de precisão de 65 dígitos, existe um limite para o tamanho do texto do literal. Se o valor exceder aproximadamente 80 caracteres, resultados inesperados podem ocorrer. Por exemplo:

```sql
mysql> SELECT
       CAST(0000000000000000000000000000000000000000000000000000000000000000000000000000000020.01 AS DECIMAL(15,2)) as val;
+------------------+
| val              |
+------------------+
| 9999999999999.99 |
+------------------+
1 row in set, 2 warnings (0.00 sec)

mysql> SHOW WARNINGS;
+---------+------+----------------------------------------------+
| Level   | Code | Message                                      |
+---------+------+----------------------------------------------+
| Warning | 1292 | Truncated incorrect DECIMAL value: '20'      |
| Warning | 1264 | Out of range value for column 'val' at row 1 |
+---------+------+----------------------------------------------+
2 rows in set (0.00 sec)
```

Underflow não é detectado, portanto, o tratamento de underflow é indefinido.

Para inserts de strings em colunas numéricas, a conversão de string para número é tratada da seguinte forma se a string tiver conteúdo não numérico:

* Uma string que não começa com um número não pode ser usada como um número e produz um error no modo estrito, ou um warning caso contrário. Isso inclui a string vazia.

* Uma string que começa com um número pode ser convertida, mas a porção final não numérica é truncada. Se a porção truncada contiver algo além de espaços, isso produz um error no modo estrito, ou um warning caso contrário.

Por padrão, a divisão por zero produz um resultado `NULL` e nenhum warning. Ao definir o modo SQL apropriadamente, a divisão por zero pode ser restringida.

Com o modo SQL `ERROR_FOR_DIVISION_BY_ZERO` habilitado, o MySQL trata a divisão por zero de forma diferente:

* Se o modo estrito não estiver habilitado, ocorre um warning.
* Se o modo estrito estiver habilitado, inserts e updates envolvendo divisão por zero são proibidos e ocorre um error.

Em outras palavras, inserts e updates envolvendo expressões que realizam divisão por zero podem ser tratados como errors, mas isso requer `ERROR_FOR_DIVISION_BY_ZERO` em adição ao modo estrito.

Suponha que tenhamos esta instrução:

```sql
INSERT INTO t SET i = 1/0;
```

Isto é o que acontece para combinações dos modos strict e `ERROR_FOR_DIVISION_BY_ZERO`.

<table summary="O que acontece para combinações dos modos strict e ERROR_FOR_DIVISION_BY_ZERO."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Valor de <code>sql_mode</code></th> <th>Resultado</th> </tr></thead><tbody><tr> <td><code>''</code> (Padrão)</td> <td>Nenhum warning, nenhum error; <code>i</code> é definido como <code>NULL</code>.</td> </tr><tr> <td>strict</td> <td>Nenhum warning, nenhum error; <code>i</code> é definido como <code>NULL</code>.</td> </tr><tr> <td><code>ERROR_FOR_DIVISION_BY_ZERO</code></td> <td>Warning, nenhum error; <code>i</code> é definido como <code>NULL</code>.</td> </tr><tr> <td>strict,<code>ERROR_FOR_DIVISION_BY_ZERO</code></td> <td>Condição de Error; nenhuma linha é inserida.</td> </tr></tbody></table>