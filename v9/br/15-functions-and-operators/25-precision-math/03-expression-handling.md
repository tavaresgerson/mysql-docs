### 14.25.3 Manipulação de Expressões

Com matemática precisa, números exatos são usados como dados sempre que possível. Por exemplo, os números em comparações são usados exatamente como dados, sem alteração de valor. No modo SQL rigoroso, para `INSERT` em uma coluna com um tipo de dados exato (`DECIMAL` - DECIMAL, NUMERIC") ou inteiro), um número é inserido com seu valor exato se estiver dentro do intervalo da coluna. Ao ser recuperado, o valor deve ser o mesmo que o inserido. (Se o modo SQL rigoroso não estiver habilitado, a truncação para `INSERT` é permitida.)

A manipulação de uma expressão numérica depende do tipo de valores que a expressão contém:

* Se houver valores aproximados, a expressão é aproximada e é avaliada usando aritmética de ponto flutuante.

* Se não houver valores aproximados, a expressão contém apenas valores exatos. Se qualquer valor exato contiver uma parte fracionária (um valor após o ponto decimal), a expressão é avaliada usando aritmética `DECIMAL` - DECIMAL, NUMERIC") exata e tem uma precisão de 65 dígitos. O termo “exato” está sujeito aos limites do que pode ser representado em binário. Por exemplo, `1.0/3.0` pode ser aproximado em notação decimal como `.333...`, mas não escrito como um número exato, então `(1.0/3.0)*3.0` não avalia exatamente `1.0`.

* Caso contrário, a expressão contém apenas valores inteiros. A expressão é exata e é avaliada usando aritmética inteira e tem uma precisão igual à de `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") (64 bits).

Se uma expressão numérica contiver strings, elas são convertidas em valores de ponto flutuante de dupla precisão e a expressão é aproximada.

As inserções em colunas numéricas são afetadas pelo modo SQL, que é controlado pela variável de sistema `sql_mode`. (Veja a Seção 7.1.11, “Modos SQL do Servidor”.) A discussão a seguir menciona o modo estrito (selecionado pelos valores de modo `STRICT_ALL_TABLES` ou `STRICT_TRANS_TABLES`) e `ERROR_FOR_DIVISION_BY_ZERO`. Para ativar todas as restrições, você pode simplesmente usar o modo `TRADITIONAL`, que inclui tanto os valores de modo estrito quanto `ERROR_FOR_DIVISION_BY_ZERO`:

```
SET sql_mode='TRADITIONAL';
```

Se um número for inserido em uma coluna de tipo exato (`DECIMAL` - DECIMAL, NUMERIC") ou inteiro), ele será inserido com seu valor exato se estiver dentro do intervalo e precisão da coluna.

Se o valor tiver muitas casas decimais na parte fracionária, ocorrerá arredondamento e será gerado uma nota. O arredondamento é feito conforme descrito na Seção 14.25.4, “Comportamento de Arredondamento”. A truncação devido ao arredondamento da parte fracionária não é um erro, mesmo no modo estrito.

Se o valor tiver muitas casas decimais na parte inteira, ele é muito grande (fora de faixa) e é tratado da seguinte forma:

* Se o modo estrito não estiver habilitado, o valor é truncado para o valor legal mais próximo e um aviso é gerado.

* Se o modo estrito estiver habilitado, ocorre um erro de estouro.

O subfluxo não é detectado, portanto, o tratamento do subfluxo é indefinido.

Para inserções de strings em colunas numéricas, a conversão de string para número é tratada da seguinte forma se a string tiver conteúdo não numérico:

* Uma string que não começa com um número não pode ser usada como número e produz um erro no modo estrito, ou um aviso caso contrário. Isso inclui a string vazia.

* Uma string que começa com um número pode ser convertida, mas a parte não numérica final é truncada. Se a parte truncada contiver algo além de espaços, isso produz um erro no modo estrito, ou um aviso caso contrário.

Por padrão, a divisão por zero produz um resultado de `NULL` e sem aviso. Ao definir o modo SQL apropriadamente, a divisão por zero pode ser restringida.

Com o modo `ERROR_FOR_DIVISION_BY_ZERO` habilitado, o MySQL lida com a divisão por zero de maneira diferente:

* Se o modo rigoroso não estiver habilitado, um aviso ocorre.
* Se o modo rigoroso estiver habilitado, as inserções e atualizações que envolvem a divisão por zero são proibidas e um erro ocorre.

Em outras palavras, as inserções e atualizações que envolvem expressões que realizam a divisão por zero podem ser tratadas como erros, mas isso requer `ERROR_FOR_DIVISION_BY_ZERO` além do modo rigoroso.

Suponha que tenhamos esta declaração:

```
INSERT INTO t SET i = 1/0;
```

É isso que acontece para combinações de modos rigoroso e `ERROR_FOR_DIVISION_BY_ZERO`.

<table summary="O que acontece com combinações dos modos strict e ERROR_FOR_DIVISION_BY_ZERO."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th><a class="link" href="server-system-variables.html#sysvar_sql_mode"><code class="literal">sql_mode</code></a> Valor</th> <th>Resultado</th> </tr></thead><tbody><tr> <td><code class="literal">''</code> (Padrão)</td> <td>Sem aviso, sem erro; <code class="literal">i</code> é definido como <code class="literal">NULL</code>.</td> </tr><tr> <td>strict</td> <td>Sem aviso, sem erro; <code class="literal">i</code> é definido como <code class="literal">NULL</code>.</td> </tr><tr> <td><a class="link" href="sql-mode.html#sqlmode_error_for_division_by_zero"><code class="literal">ERROR_FOR_DIVISION_BY_ZERO</code></a></td> <td>Aviso, sem erro; <code class="literal">i</code> é definido como <code class="literal">NULL</code>.</td> </tr><tr> <td>strict,<a class="link" href="sql-mode.html#sqlmode_error_for_division_by_zero"><code class="literal">ERROR_FOR_DIVISION_BY_ZERO</code></a></td> <td>Condição de erro; nenhuma linha é inserida.</td> </tr></tbody></table>