#### 8.4.2.4 Usando a ANÁLISE DE PROCEDIMENTOS

`ANALYSE([max_elements[,max_memory)`

Nota

A função `PROCEDURE ANALYSE()` foi descontinuada a partir do MySQL 5.7.18 e foi removida no MySQL 8.0.

`ANALYSE()` analisa o resultado de uma consulta e retorna uma análise dos resultados que sugere tipos de dados ótimos para cada coluna, o que pode ajudar a reduzir o tamanho da tabela. Para obter essa análise, adicione `PROCEDURE ANALYSE` ao final de uma instrução `SELECT`:

```sql
SELECT ... FROM ... WHERE ... PROCEDURE ANALYSE([max_elements,[max_memory)
```

Por exemplo:

```sql
SELECT col1, col2 FROM table1 PROCEDURE ANALYSE(10, 2000);
```

Os resultados mostram algumas estatísticas dos valores retornados pela consulta e propõem um tipo de dado ótimo para as colunas. Isso pode ser útil para verificar suas tabelas existentes ou após a importação de novos dados. Você pode precisar experimentar diferentes configurações para os argumentos para que o `PROCEDURE ANALYSE()` não sugira o tipo de dado `ENUM` quando não for apropriado.

Os argumentos são opcionais e são usados da seguinte forma:

- *`max_elements`* (padrão 256) é o número máximo de valores distintos que o `ANALYSE()` percebe por coluna. Isso é usado pelo `ANALYSE()` para verificar se o tipo de dados ótimo deve ser do tipo `ENUM`; se houver mais de *`max_elements`* valores distintos, então `ENUM` não é um tipo sugerido.

- *`max_memory`* (padrão 8192) é a quantidade máxima de memória que o `ANALYSE()` deve alocar por coluna enquanto tenta encontrar todos os valores distintos.

Uma cláusula `PROCEDURE` não é permitida em uma declaração `UNION`.
