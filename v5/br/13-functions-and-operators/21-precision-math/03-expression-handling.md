### 12.21.3 Tratamento de Expressões

Com matemática precisa, números de valor exato são usados sempre que possível. Por exemplo, os números em comparações são usados exatamente como fornecidos, sem alteração de valor. No modo SQL rigoroso, para `INSERT` em uma coluna com um tipo de dados exato (`DECIMAL` - DECIMAL, NUMERIC") ou inteiro), um número é inserido com seu valor exato se estiver dentro do intervalo da coluna. Ao ser recuperado, o valor deve ser o mesmo que o que foi inserido. (Se o modo SQL rigoroso não estiver habilitado, a truncação para `INSERT` é permitida.)

O tratamento de uma expressão numérica depende do tipo de valores que a expressão contém:

- Se houver valores aproximados, a expressão será aproximada e será avaliada usando aritmética de ponto flutuante.

- Se não houver valores aproximados, a expressão contém apenas valores exatos. Se qualquer valor exato contiver uma parte fracionária (um valor após o ponto decimal), a expressão é avaliada usando aritmética exata `DECIMAL` - `DECIMAL`, `NUMERIC") e tem uma precisão de 65 dígitos. O termo “exato” está sujeito aos limites do que pode ser representado em binário. Por exemplo, `1.0/3.0`pode ser aproximado em notação decimal como`.333...`, mas não pode ser escrito como um número exato, então `(1.0/3.0)\*3.0`não avalia exatamente`1.0\`.

- Caso contrário, a expressão contém apenas valores inteiros. A expressão é exata e é avaliada usando aritmética inteira e tem a mesma precisão que `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") (64 bits).

Se uma expressão numérica contiver strings, elas são convertidas em valores de ponto flutuante de dupla precisão e a expressão é aproximada.

Os insertos em colunas numéricas são afetados pelo modo SQL, que é controlado pela variável de sistema `sql_mode`. (Veja a Seção 5.1.10, “Modos SQL do Servidor”.) A discussão a seguir menciona o modo estrito (selecionado pelos valores de modo `STRICT_ALL_TABLES` ou `STRICT_TRANS_TABLES`) e `ERROR_FOR_DIVISION_BY_ZERO`. Para ativar todas as restrições, você pode simplesmente usar o modo `TRADITIONAL`, que inclui tanto os valores do modo estrito quanto `ERROR_FOR_DIVISION_BY_ZERO`:

```sql
SET sql_mode='TRADITIONAL';
```

Se um número for inserido em uma coluna de tipo exato (`DECIMAL` - DECIMAL, NUMERIC") ou inteiro), ele será inserido com seu valor exato se estiver dentro do intervalo e da precisão da coluna.

Se o valor tiver muitas casas decimais na parte fracionária, ocorrerá a arredondagem e será gerada uma nota. A arredondagem é feita conforme descrito na Seção 12.21.4, “Comportamento de Arredondamento”. A truncação devido à arredondagem da parte fracionária não é um erro, mesmo no modo estrito.

Se o valor tiver muitas casas decimais na parte inteira, ele será considerado muito grande (fora do intervalo) e será tratado da seguinte forma:

- Se o modo rigoroso não estiver habilitado, o valor será truncado para o valor legal mais próximo e um aviso será gerado.

- Se o modo rigoroso estiver ativado, ocorrerá um erro de excesso.

Para os literais `DECIMAL` - DECIMAL, NUMERIC") além do limite de precisão de 65 dígitos, há um limite para a quantidade de texto que o literal pode ter. Se o valor exceder aproximadamente 80 caracteres, podem ocorrer resultados inesperados. Por exemplo:

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

O fluxo de retorno não é detectado, portanto, o gerenciamento do fluxo de retorno não está definido.

Para inserções de cadeias de caracteres em colunas numéricas, a conversão de cadeia de caracteres para número é realizada da seguinte forma, se a cadeia de caracteres contiver conteúdo não numérico:

- Uma cadeia que não começa com um número não pode ser usada como um número e produz um erro no modo estrito, ou um aviso caso contrário. Isso inclui a cadeia vazia.

- Uma cadeia que começa com um número pode ser convertida, mas a parte final não numérica é truncada. Se a parte truncada contiver algo além de espaços, isso gera um erro no modo estrito ou uma mensagem de aviso caso contrário.

Por padrão, a divisão por zero produz um resultado de `NULL` e sem aviso. Ao definir o modo SQL apropriadamente, a divisão por zero pode ser restringida.

Com o modo SQL `ERROR_FOR_DIVISION_BY_ZERO` habilitado, o MySQL lida com a divisão por zero de maneira diferente:

- Se o modo rigoroso não estiver ativado, será exibido um aviso.
- Se o modo rigoroso estiver ativado, as inserções e atualizações que envolvem divisão por zero são proibidas e um erro ocorre.

Em outras palavras, os insertos e atualizações que envolvem expressões que realizam divisão por zero podem ser tratados como erros, mas isso requer `ERROR_FOR_DIVISION_BY_ZERO` além do modo estrito.

Suponha que tenhamos esta afirmação:

```sql
INSERT INTO t SET i = 1/0;
```

Isso é o que acontece para combinações dos modos rigoroso e `ERROR_FOR_DIVISION_BY_ZERO`.

<table summary="O que acontece para combinações dos modos STRICT e ERROR_FOR_DIVISION_BY_ZERO."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th><a class="link" href="server-system-variables.html#sysvar_sql_mode">[[<code class="literal">sql_mode</code>]]</a>Valor</th> <th>Resultado</th> </tr></thead><tbody><tr> <td>[[<code class="literal">''</code>]] (Padrão)</td> <td>Sem aviso, sem erro; [[<code class="literal">i</code>]] está definido como [[<code class="literal">NULL</code>]].</td> </tr><tr> <td>estricto</td> <td>Sem aviso, sem erro; [[<code class="literal">i</code>]] está definido como [[<code class="literal">NULL</code>]].</td> </tr><tr> <td><a class="link" href="sql-mode.html#sqlmode_error_for_division_by_zero">[[<code class="literal">ERROR_FOR_DIVISION_BY_ZERO</code>]]</a></td> <td>Aviso, sem erro; [[<code class="literal">i</code>]] está definido como [[<code class="literal">NULL</code>]].</td> </tr><tr> <td>estricto,<a class="link" href="sql-mode.html#sqlmode_error_for_division_by_zero">[[<code class="literal">ERROR_FOR_DIVISION_BY_ZERO</code>]]</a></td> <td>Condição de erro; nenhuma linha foi inserida.</td> </tr></tbody></table>
