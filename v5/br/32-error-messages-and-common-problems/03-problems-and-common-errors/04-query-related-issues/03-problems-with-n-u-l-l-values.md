#### B.3.4.3 Problemas com valores nulos

O conceito do valor `NULL` é uma fonte comum de confusão para novatos em SQL, que muitas vezes pensam que `NULL` é a mesma coisa que uma string vazia `''`. Isso não é o caso. Por exemplo, as seguintes declarações são completamente diferentes:

```sql
mysql> INSERT INTO my_table (phone) VALUES (NULL);
mysql> INSERT INTO my_table (phone) VALUES ('');
```

Ambas as declarações inserem um valor na coluna `phone`, mas a primeira insere um valor `NULL` e a segunda insere uma string vazia. O significado da primeira pode ser considerado como "o número de telefone não é conhecido" e o significado da segunda pode ser considerado como "a pessoa é conhecida por não ter telefone, e, portanto, não ter número de telefone."

Para ajudar com o tratamento de `NULL`, você pode usar os operadores `IS NULL` (operadores de comparação.html#operador_is-null) e `IS NOT NULL` (operadores de comparação.html#operador_is-not-null) e a função `IFNULL()` (funções de controle de fluxo.html#função_ifnull).

Em SQL, o valor `NULL` nunca é verdadeiro em comparação com qualquer outro valor, mesmo `NULL`. Uma expressão que contém `NULL` sempre produz um valor `NULL`, a menos que haja indicação em contrário na documentação dos operadores e funções envolvidos na expressão. Todas as colunas no exemplo a seguir retornam `NULL`:

```sql
mysql> SELECT NULL, 1+NULL, CONCAT('Invisible',NULL);
```

Para pesquisar valores de coluna que são `NULL`, você não pode usar um teste `expr = NULL`. A seguinte declaração não retorna nenhuma linha, porque `expr = NULL` nunca é verdadeiro para qualquer expressão:

```sql
mysql> SELECT * FROM my_table WHERE phone = NULL;
```

Para procurar por valores `NULL`, você deve usar o teste `[IS NULL]` (operadores de comparação.html#operador_is-null). As seguintes declarações mostram como encontrar o número de telefone `NULL` e o número de telefone vazio:

```sql
mysql> SELECT * FROM my_table WHERE phone IS NULL;
mysql> SELECT * FROM my_table WHERE phone = '';
```

Consulte [Seção 3.3.4.6, “Trabalhando com Valores NULL”](working-with-null.html) para obter informações e exemplos adicionais.

Você pode adicionar um índice em uma coluna que pode ter valores `NULL` se estiver usando o mecanismo de armazenamento `MyISAM`, `InnoDB` ou `MEMORY`. Caso contrário, você deve declarar uma coluna indexada como `NOT NULL` e não pode inserir `NULL` na coluna.

Ao ler dados com [`LOAD DATA`](load-data.html), colunas vazias ou ausentes são atualizadas com `''`. Para carregar um valor `NULL` em uma coluna, use `\N` no arquivo de dados. A palavra literal `NULL` também pode ser usada em algumas circunstâncias. Veja [Seção 13.2.6, “Instrução LOAD DATA”](load-data.html).

Ao usar `DISTINCT`, `GROUP BY` ou `ORDER BY`, todos os valores `NULL` são considerados iguais.

Ao usar `ORDER BY`, os valores `NULL` são apresentados primeiro, ou por último, se você especificar `DESC` para ordenar em ordem decrescente.

As funções agregadas (de grupo), como [`COUNT()`](aggregate-functions.html#function_count), [`MIN()`](aggregate-functions.html#function_min) e [`SUM()`](aggregate-functions.html#function_sum), ignoram os valores `NULL`. A exceção a isso é [`COUNT(*)`](aggregate-functions.html#function_count), que conta as linhas e não os valores individuais das colunas. Por exemplo, a seguinte declaração produz dois contagem. A primeira é uma contagem do número de linhas na tabela, e a segunda é uma contagem do número de valores não `NULL` na coluna `idade`:

```sql
mysql> SELECT COUNT(*), COUNT(age) FROM person;
```

Para alguns tipos de dados, o MySQL lida com valores `NULL` de maneira especial. Por exemplo, se você inserir `NULL` em uma coluna de inteiros ou de ponto flutuante que tenha o atributo `AUTO_INCREMENT`, o próximo número na sequência é inserido. Sob certas condições, se você inserir `NULL` em uma coluna de `[TIMESTAMP](datetime.html)`, o horário e a data atuais são inseridos; esse comportamento depende, em parte, do modo SQL do servidor (veja [Seção 5.1.10, “Modos SQL do Servidor”](sql-mode.html)) e do valor da variável de sistema [`explicit_defaults_for_timestamp`](server-system-variables.html#sysvar_explicit_defaults_for_timestamp).
