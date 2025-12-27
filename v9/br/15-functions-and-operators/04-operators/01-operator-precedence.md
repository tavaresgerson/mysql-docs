### 14.4.1 Precedência dos Operadores

A precedência dos operadores é mostrada na seguinte lista, da maior precedência para a menor. Operadores que são mostrados juntos em uma linha têm a mesma precedência.

```
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
= (comparison), <=>, >=, >, <=, <, <>, !=, IS, LIKE, REGEXP, IN, MEMBER OF
BETWEEN, CASE, WHEN, THEN, ELSE
NOT
AND, &&
XOR
OR, ||
= (assignment), :=
```

A precedência de `=` depende se é usado como operador de comparação (`=`) ou como operador de atribuição (`=`). Quando usado como operador de comparação, tem a mesma precedência que `<=>`, `>=`, `>`, `<=`, `<`, `<>`, `!=`, `IS`, `LIKE`, `REGEXP` e `IN()`. Quando usado como operador de atribuição, tem a mesma precedência que `:=`. A Seção 15.7.6.1, “Sintaxe de Definição de Variáveis”, e a Seção 11.4, “Variáveis Definidas pelo Usuário”, explicam como o MySQL determina qual interpretação de `=` deve ser aplicada.

Para operadores que ocorrem no mesmo nível de precedência dentro de uma expressão, a avaliação prossegue da esquerda para a direita, com a exceção de que as atribuições são avaliadas da direita para a esquerda.

A precedência e o significado de alguns operadores dependem do modo SQL:

* Por padrão, `||` é um operador lógico `OR`. Com `PIPES_AS_CONCAT` habilitado, `||` é concatenação de strings, com uma precedência entre `^` e os operadores unários.

* Por padrão, `!` tem uma precedência maior que `NOT`. Com `HIGH_NOT_PRECEDENCE` habilitado, `!` e `NOT` têm a mesma precedência.

Veja a Seção 7.1.11, “Modos SQL do Servidor”.

A precedência dos operadores determina a ordem de avaliação dos termos em uma expressão. Para ignorar essa ordem e agrupar os termos explicitamente, use parênteses. Por exemplo:

```
mysql> SELECT 1+2*3;
        -> 7
mysql> SELECT (1+2)*3;
        -> 9
```