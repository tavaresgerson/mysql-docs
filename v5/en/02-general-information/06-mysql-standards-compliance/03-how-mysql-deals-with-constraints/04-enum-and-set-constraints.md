#### 1.6.3.4 Restrições ENUM e SET

Colunas `ENUM` e `SET` fornecem uma maneira eficiente de definir colunas que podem conter apenas um determinado conjunto de valores. Consulte a Seção 11.3.5, “O Tipo ENUM”, e a Seção 11.3.6, “O Tipo SET”.

A menos que o *strict mode* esteja desativado (o que não é recomendado, mas consulte a Seção 5.1.10, “Modos SQL do Servidor”), a definição de uma coluna `ENUM` ou `SET` atua como uma restrição sobre os valores inseridos na coluna. Ocorre um erro para valores que não satisfazem estas condições:

* Um valor `ENUM` deve ser um dos listados na definição da coluna, ou o equivalente numérico interno do mesmo. O valor não pode ser o valor de erro (ou seja, 0 ou a *empty string*). Para uma coluna definida como `ENUM('a','b','c')`, valores como `''`, `'d'`, ou `'ax'` são inválidos e são rejeitados.

* Um valor `SET` deve ser a *empty string* ou um valor que consista apenas nos valores listados na definição da coluna, separados por vírgulas. Para uma coluna definida como `SET('a','b','c')`, valores como `'d'` ou `'a,b,c,d'` são inválidos e são rejeitados.

Erros para valores inválidos podem ser suprimidos no *strict mode* se você usar `INSERT IGNORE` ou `UPDATE IGNORE`. Neste caso, um *warning* é gerado em vez de um erro. Para `ENUM`, o valor é inserido como o membro de erro (`0`). Para `SET`, o valor é inserido conforme fornecido, exceto que quaisquer *substrings* inválidas são excluídas. Por exemplo, `'a,x,b,y'` resulta em um valor de `'a,b'`.