### 12.4.1 Prioridade do Operador

As precedências dos operadores são mostradas na lista a seguir, da precedência mais alta para a mais baixa. Os operadores que são mostrados juntos em uma linha têm a mesma precedência.

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

A precedência de `=` depende de ser usado como operador de comparação (`=`) ou como operador de atribuição (`=`). Quando usado como operador de comparação, ele tem a mesma precedência que `<=>`, `>=`, `>`, `<=`, `<`, `<>`, `!=`, `IS`, `LIKE`, `REGEXP` e `IN()`. Quando usado como operador de atribuição, ele tem a mesma precedência que `:=`. A Seção 13.7.4.1, “Sintaxe SET para Atribuição de Variáveis”, e a Seção 9.4, “Variáveis Definidas pelo Usuário”, explicam como o MySQL determina qual interpretação de `=` deve ser aplicada.

Para operadores que ocorrem no mesmo nível de precedência dentro de uma expressão, a avaliação prossegue da esquerda para a direita, com exceção de que as atribuições são avaliadas da direita para a esquerda.

A precedência e o significado de alguns operadores dependem do modo SQL:

- Por padrão, `||` é um operador `OR` lógico. Com `PIPES_AS_CONCAT` habilitado, `||` é concatenação de strings, com precedência entre `^` e os operadores unários.

- Por padrão, o `!` tem precedência maior que o `NOT`. Com `HIGH_NOT_PRECEDENCE` ativado, `!` e `NOT` têm a mesma precedência.

Consulte a Seção 5.1.10, “Modos SQL do Servidor”.

A precedência dos operadores determina a ordem de avaliação dos termos em uma expressão. Para substituir essa ordem e agrupar os termos explicitamente, use parênteses. Por exemplo:

```sql
mysql> SELECT 1+2*3;
        -> 7
mysql> SELECT (1+2)*3;
        -> 9
```
