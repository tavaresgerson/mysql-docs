#### 8.4.2.4 Usando PROCEDURE ANALYSE

`ANALYSE([max_elements[,max_memory)`

Nota

`PROCEDURE ANALYSE()` está descontinuado a partir do MySQL 5.7.18 e foi removido no MySQL 8.0.

`ANALYSE()` examina o resultado de uma Query e retorna uma análise dos resultados, sugerindo tipos de dados ideais para cada coluna, o que pode ajudar a reduzir os tamanhos das tabelas. Para obter esta análise, anexe `PROCEDURE ANALYSE` ao final de uma instrução `SELECT`:

```sql
SELECT ... FROM ... WHERE ... PROCEDURE ANALYSE([max_elements,[max_memory)
```

Por exemplo:

```sql
SELECT col1, col2 FROM table1 PROCEDURE ANALYSE(10, 2000);
```

Os resultados mostram algumas estatísticas para os valores retornados pela Query e propõem um tipo de dado ideal para as colunas. Isso pode ser útil para verificar suas tabelas existentes ou após importar novos dados. Você pode precisar tentar configurações diferentes para os argumentos, para que `PROCEDURE ANALYSE()` não sugira o tipo de dado `ENUM` quando ele não for apropriado.

Os argumentos são opcionais e são usados da seguinte forma:

* *`max_elements`* (padrão 256) é o número máximo de valores distintos que `ANALYSE()` observa por coluna. Isso é usado por `ANALYSE()` para verificar se o tipo de dado ideal deve ser do tipo `ENUM`; se houver mais de *`max_elements`* valores distintos, então `ENUM` não é um tipo sugerido.

* *`max_memory`* (padrão 8192) é a quantidade máxima de memória que `ANALYSE()` deve alocar por coluna ao tentar encontrar todos os valores distintos.

Uma cláusula `PROCEDURE` não é permitida em uma instrução `UNION`.