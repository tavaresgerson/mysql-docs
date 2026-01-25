### 12.4.1 Precedência de Operadores

As precedências de operadores são mostradas na lista a seguir, da precedência mais alta para a mais baixa. Operadores que são mostrados juntos em uma linha têm a mesma precedência.

```sql
INTERVAL
BINARY, COLLATE
!
- (unary minus), ~ (unary bit inversion)
^
*, /, DIV, %, MOD
-, +
<<, >>
&
|
= (comparison), <=>, >=, >, <=, <, <>, !=, IS, LIKE, REGEXP, IN
BETWEEN, CASE, WHEN, THEN, ELSE
NOT
AND, &&
XOR
OR, ||
= (assignment), :=
```

A precedência de `=` depende se ele é usado como um comparison operator (`=`) ou como um assignment operator (`=`). Quando usado como um comparison operator, ele tem a mesma precedência que `<=>`, `>=`, `>`, `<=`, `<`, `<>`, `!=`, `IS`, `LIKE`, `REGEXP` e `IN()`. Quando usado como um assignment operator, ele tem a mesma precedência que `:=`. A Seção 13.7.4.1, “SET Syntax for Variable Assignment”, e a Seção 9.4, “User-Defined Variables”, explicam como o MySQL determina qual interpretação de `=` deve ser aplicada.

Para operadores que ocorrem no mesmo nível de precedência dentro de uma expressão, a avaliação prossegue da esquerda para a direita, com a exceção de que as atribuições avaliam da direita para a esquerda.

A precedência e o significado de alguns operadores dependem do SQL mode:

* Por padrão, `||` é um operador `OR` lógico. Com `PIPES_AS_CONCAT` habilitado, `||` é uma concatenação de strings, com uma precedência entre `^` e os unary operators.

* Por padrão, `!` tem uma precedência maior que `NOT`. Com `HIGH_NOT_PRECEDENCE` habilitado, `!` e `NOT` têm a mesma precedência.

Veja a Seção 5.1.10, “Server SQL Modes”.

A precedência dos operadores determina a ordem de avaliação dos termos em uma expressão. Para anular esta ordem e agrupar termos explicitamente, utilize parênteses. Por exemplo:

```sql
mysql> SELECT 1+2*3;
        -> 7
mysql> SELECT (1+2)*3;
        -> 9
```