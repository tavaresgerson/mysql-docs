#### 1.7.3.3 Restrições ENUM e SET

As colunas `ENUM` e `SET` fornecem uma maneira eficiente de definir colunas que podem conter apenas um determinado conjunto de valores.

A menos que o modo estrito esteja desativado (não recomendado), a definição de uma coluna `ENUM` ou `SET` atua como uma restrição sobre os valores inseridos na coluna. Um erro ocorre para valores que não satisfazem estas condições:

- Um valor `ENUM` deve ser um dos valores listados na definição da coluna, ou o seu equivalente numérico interno. O valor não pode ser o valor de erro (ou seja, 0 ou a string vazia). Para uma coluna definida como `ENUM('a','b','c')`, valores como `''`, `'d'` ou `'ax'` são inválidos e são rejeitados.
- Um valor `SET` deve ser a cadeia vazia ou um valor que consiste apenas dos valores listados na definição da coluna separados por vírgulas. Para uma coluna definida como `SET('a','b','c')`, valores como `'d'` ou `'a,b,c,d'` são inválidos e são rejeitados.

Erros para valores inválidos podem ser suprimidos no modo estrito se você usar `INSERT IGNORE` ou `UPDATE IGNORE`. Neste caso, um aviso é gerado em vez de um erro. Para `ENUM`, o valor é inserido como o membro de erro (`0`). Para `SET`, o valor é inserido como dado, exceto que quaisquer substrings inválidas são excluídas. Por exemplo, `'a,x,b,y'` resulta em um valor de `'a,b'`.
