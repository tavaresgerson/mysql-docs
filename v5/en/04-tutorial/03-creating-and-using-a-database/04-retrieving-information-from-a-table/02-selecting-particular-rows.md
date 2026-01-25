#### 3.3.4.2 Selecionando Linhas Específicas

Conforme mostrado na seção anterior, é fácil recuperar uma tabela inteira. Basta omitir a cláusula `WHERE` da instrução [`SELECT`](select.html "13.2.9 SELECT Statement"). Mas, tipicamente, você não desejará ver a tabela inteira, especialmente quando ela se torna grande. Em vez disso, você geralmente está mais interessado em responder a uma pergunta específica, caso em que especifica algumas restrições sobre a informação desejada. Vamos analisar algumas selection Queries em termos de perguntas sobre seus pets que elas podem responder.

Você pode selecionar apenas linhas específicas da sua tabela. Por exemplo, se você deseja verificar a alteração que fez na data de nascimento de Bowser, selecione o registro de Bowser desta forma:

```sql
mysql> SELECT * FROM pet WHERE name = 'Bowser';
+--------+-------+---------+------+------------+------------+
| name   | owner | species | sex  | birth      | death      |
+--------+-------+---------+------+------------+------------+
| Bowser | Diane | dog     | m    | 1989-08-31 | 1995-07-29 |
+--------+-------+---------+------+------------+------------+
```

O output confirma que o ano está registrado corretamente como 1989, e não 1979.

As comparações de String normalmente são case-insensitive (não diferenciam maiúsculas e minúsculas), então você pode especificar o nome como `'bowser'`, `'BOWSER'`, e assim por diante. O resultado da Query é o mesmo.

Você pode especificar condições em qualquer column, não apenas em `name`. Por exemplo, se você deseja saber quais animais nasceram durante ou após 1998, teste a column `birth`:

```sql
mysql> SELECT * FROM pet WHERE birth >= '1998-1-1';
+----------+-------+---------+------+------------+-------+
| name     | owner | species | sex  | birth      | death |
+----------+-------+---------+------+------------+-------+
| Chirpy   | Gwen  | bird    | f    | 1998-09-11 | NULL  |
| Puffball | Diane | hamster | f    | 1999-03-30 | NULL  |
+----------+-------+---------+------+------------+-------+
```

Você pode combinar condições, por exemplo, para localizar cachorros fêmeas:

```sql
mysql> SELECT * FROM pet WHERE species = 'dog' AND sex = 'f';
+-------+--------+---------+------+------------+-------+
| name  | owner  | species | sex  | birth      | death |
+-------+--------+---------+------+------------+-------+
| Buffy | Harold | dog     | f    | 1989-05-13 | NULL  |
+-------+--------+---------+------+------------+-------+
```

A Query anterior usa o operador lógico [`AND`](logical-operators.html#operator_and). Há também um operador [`OR`](logical-operators.html#operator_or):

```sql
mysql> SELECT * FROM pet WHERE species = 'snake' OR species = 'bird';
+----------+-------+---------+------+------------+-------+
| name     | owner | species | sex  | birth      | death |
+----------+-------+---------+------+------------+-------+
| Chirpy   | Gwen  | bird    | f    | 1998-09-11 | NULL  |
| Whistler | Gwen  | bird    | NULL | 1997-12-09 | NULL  |
| Slim     | Benny | snake   | m    | 1996-04-29 | NULL  |
+----------+-------+---------+------+------------+-------+
```

[`AND`](logical-operators.html#operator_and) e [`OR`](logical-operators.html#operator_or) podem ser misturados, embora [`AND`](logical-operators.html#operator_and) tenha precedência maior que [`OR`](logical-operators.html#operator_or). Se você usar ambos os operadores, é uma boa prática usar parênteses para indicar explicitamente como as condições devem ser agrupadas:

```sql
mysql> SELECT * FROM pet WHERE (species = 'cat' AND sex = 'm')
       OR (species = 'dog' AND sex = 'f');
+-------+--------+---------+------+------------+-------+
| name  | owner  | species | sex  | birth      | death |
+-------+--------+---------+------+------------+-------+
| Claws | Gwen   | cat     | m    | 1994-03-17 | NULL  |
| Buffy | Harold | dog     | f    | 1989-05-13 | NULL  |
+-------+--------+---------+------+------------+-------+
```