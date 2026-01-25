#### B.3.4.3 Problemas com Valores NULL

O conceito do valor `NULL` é uma fonte comum de confusão para novatos em SQL, que frequentemente pensam que `NULL` é a mesma coisa que uma string vazia `''`. Este não é o caso. Por exemplo, as seguintes instruções são completamente diferentes:

```sql
mysql> INSERT INTO my_table (phone) VALUES (NULL);
mysql> INSERT INTO my_table (phone) VALUES ('');
```

Ambas as instruções inserem um valor na coluna `phone`, mas a primeira insere um valor `NULL` e a segunda insere uma string vazia. O significado da primeira pode ser considerado como “o número de telefone não é conhecido” e o significado da segunda pode ser considerado como “sabe-se que a pessoa não possui telefone e, portanto, não possui número de telefone.”

Para auxiliar no tratamento de `NULL`, você pode usar os operadores [`IS NULL`](comparison-operators.html#operator_is-null) e [`IS NOT NULL`](comparison-operators.html#operator_is-not-null) e a função [`IFNULL()`](flow-control-functions.html#function_ifnull).

Em SQL, o valor `NULL` nunca é verdadeiro em comparação com qualquer outro valor, nem mesmo `NULL`. Uma expressão que contém `NULL` sempre produz um valor `NULL`, a menos que seja indicado o contrário na documentação para os operadores e funções envolvidos na expressão. Todas as colunas no exemplo a seguir retornam `NULL`:

```sql
mysql> SELECT NULL, 1+NULL, CONCAT('Invisible',NULL);
```

Para buscar valores de coluna que são `NULL`, você não pode usar um teste `expr = NULL`. A seguinte instrução não retorna linhas, porque `expr = NULL` nunca é verdadeiro para qualquer expressão:

```sql
mysql> SELECT * FROM my_table WHERE phone = NULL;
```

Para procurar por valores `NULL`, você deve usar o teste [`IS NULL`](comparison-operators.html#operator_is-null). As seguintes instruções mostram como encontrar o número de telefone `NULL` e o número de telefone vazio:

```sql
mysql> SELECT * FROM my_table WHERE phone IS NULL;
mysql> SELECT * FROM my_table WHERE phone = '';
```

Veja [Seção 3.3.4.6, “Trabalhando com Valores NULL”](working-with-null.html "3.3.4.6 Working with NULL Values"), para informações e exemplos adicionais.

Você pode adicionar um Index em uma coluna que pode ter valores `NULL` se estiver usando o storage engine `MyISAM`, `InnoDB` ou `MEMORY`. Caso contrário, você deve declarar uma coluna indexada como `NOT NULL`, e não poderá inserir `NULL` na coluna.

Ao ler dados com [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement"), colunas vazias ou ausentes são atualizadas com `''`. Para carregar um valor `NULL` em uma coluna, use `\N` no arquivo de dados. A palavra literal `NULL` também pode ser usada sob certas circunstâncias. Veja [Seção 13.2.6, “LOAD DATA Statement”](load-data.html "13.2.6 LOAD DATA Statement").

Ao usar `DISTINCT`, `GROUP BY` ou `ORDER BY`, todos os valores `NULL` são considerados iguais.

Ao usar `ORDER BY`, os valores `NULL` são apresentados primeiro, ou por último se você especificar `DESC` para ordenar em ordem decrescente.

Funções de agregação (group), como [`COUNT()`](aggregate-functions.html#function_count), [`MIN()`](aggregate-functions.html#function_min) e [`SUM()`](aggregate-functions.html#function_sum) ignoram valores `NULL`. A exceção a isso é [`COUNT(*)`](aggregate-functions.html#function_count), que conta linhas e não valores de colunas individuais. Por exemplo, a seguinte instrução produz duas contagens. A primeira é uma contagem do número de linhas na tabela, e a segunda é uma contagem do número de valores não-`NULL` na coluna `age`:

```sql
mysql> SELECT COUNT(*), COUNT(age) FROM person;
```

Para alguns tipos de dados, o MySQL trata valores `NULL` de maneira especial. Por exemplo, se você inserir `NULL` em uma coluna de inteiro ou ponto flutuante que possui o atributo `AUTO_INCREMENT`, o próximo número na sequência é inserido. Sob certas condições, se você inserir `NULL` em uma coluna [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types"), a data e hora atuais são inseridas; este comportamento depende em parte do SQL mode do servidor (veja [Seção 5.1.10, “Server SQL Modes”](sql-mode.html "5.1.10 Server SQL Modes")), bem como do valor da variável de sistema [`explicit_defaults_for_timestamp`](server-system-variables.html#sysvar_explicit_defaults_for_timestamp).