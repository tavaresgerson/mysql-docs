#### B.3.4.3 Problemas com Valores NULO

O conceito do valor `NULL` é uma fonte comum de confusão para novatos em SQL, que muitas vezes pensam que `NULL` é a mesma coisa que uma string vazia `''`. Isso não é o caso. Por exemplo, as seguintes instruções são completamente diferentes:

```
mysql> INSERT INTO my_table (phone) VALUES (NULL);
mysql> INSERT INTO my_table (phone) VALUES ('');
```

Ambas as instruções inserem um valor na coluna `phone`, mas a primeira insere um valor `NULL` e a segunda insere uma string vazia. O significado da primeira pode ser considerado como “o número de telefone não é conhecido” e o significado da segunda pode ser considerado como “a pessoa é conhecida por não ter telefone, e, portanto, nenhum número de telefone.”

Para ajudar com o tratamento de `NULL`, você pode usar os operadores `IS NULL` e `IS NOT NULL` e a função `IFNULL()`.

Em SQL, o valor `NULL` nunca é verdadeiro em comparação com qualquer outro valor, mesmo `NULL`. Uma expressão que contém `NULL` sempre produz um valor `NULL`, a menos que haja indicação em contrário na documentação dos operadores e funções envolvidos na expressão. Todas as colunas no exemplo a seguir retornam `NULL`:

```
mysql> SELECT NULL, 1+NULL, CONCAT('Invisible',NULL);
```

Para buscar valores de coluna que são `NULL`, você não pode usar uma comparação `expr = NULL`. A seguinte instrução não retorna nenhuma linha, porque `expr = NULL` nunca é verdadeiro para qualquer expressão:

```
mysql> SELECT * FROM my_table WHERE phone = NULL;
```

Para procurar valores `NULL`, você deve usar a comparação `IS NULL`. As seguintes instruções mostram como encontrar o número de telefone `NULL` e o número de telefone vazio:

```
mysql> SELECT * FROM my_table WHERE phone IS NULL;
mysql> SELECT * FROM my_table WHERE phone = '';
```

Veja a Seção 5.3.4.6, “Trabalhando com Valores NULO”, para informações e exemplos adicionais.

Você pode adicionar um índice em uma coluna que pode ter valores `NULL` se estiver usando o motor de armazenamento `MyISAM`, `InnoDB` ou `MEMORY`. Caso contrário, você deve declarar uma coluna indexada `NOT NULL`, e não pode inserir `NULL` na coluna.

Ao ler dados com `LOAD DATA`, colunas vazias ou ausentes são atualizadas com `''`. Para carregar um valor `NULL` em uma coluna, use `\N` no arquivo de dados. A palavra literal `NULL` também pode ser usada em algumas circunstâncias. Veja a Seção 15.2.9, “Instrução LOAD DATA”.

Ao usar `DISTINCT`, `GROUP BY` ou `ORDER BY`, todos os valores `NULL` são considerados iguais.

Ao usar `ORDER BY`, os valores `NULL` são apresentados primeiro, ou por último, se você especificar `DESC` para ordenar em ordem decrescente.

Funções agregadas (grupais), como `COUNT()`, `MIN()` e `SUM()`, ignoram valores `NULL`. A exceção a isso é `COUNT(*)`, que conta linhas e não valores individuais de coluna. Por exemplo, a seguinte declaração produz dois contagem. A primeira é uma contagem do número de linhas na tabela, e a segunda é uma contagem do número de valores `NULL` na coluna `age`:

```
mysql> SELECT COUNT(*), COUNT(age) FROM person;
```

Para alguns tipos de dados, o MySQL lida com valores `NULL` de maneiras especiais. Por exemplo, se você inserir `NULL` em uma coluna inteira ou de ponto flutuante que tem o atributo `AUTO_INCREMENT`, o próximo número na sequência é inserido. Sob certas condições, se você inserir `NULL` em uma coluna `TIMESTAMP`, o horário atual é inserido; esse comportamento depende em parte do modo SQL do servidor (veja a Seção 7.1.11, “Modos SQL do Servidor”) bem como o valor da variável de sistema `explicit_defaults_for_timestamp`.