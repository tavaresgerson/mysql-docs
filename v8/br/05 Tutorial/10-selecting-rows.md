#### 5.3.4.2 Selecção de linhas específicas

Como mostrado na seção anterior, é fácil recuperar uma tabela inteira. Apenas omita a cláusula `WHERE` da instrução `SELECT`. Mas normalmente você não quer ver a tabela inteira, especialmente quando ela se torna grande. Em vez disso, você geralmente está mais interessado em responder a uma pergunta específica, caso em que você especifica algumas restrições sobre as informações desejadas. Vamos olhar para algumas consultas de seleção em termos de perguntas sobre seus animais de estimação que eles respondem.

Você pode selecionar apenas linhas específicas da sua tabela. Por exemplo, se você quiser verificar a mudança que você fez na data de nascimento do Bowser, selecione o registro do Bowser assim:

```
mysql> SELECT * FROM pet WHERE name = 'Bowser';
+--------+-------+---------+------+------------+------------+
| name   | owner | species | sex  | birth      | death      |
+--------+-------+---------+------+------------+------------+
| Bowser | Diane | dog     | m    | 1989-08-31 | 1995-07-29 |
+--------+-------+---------+------+------------+------------+
```

A produção confirma que o ano é corretamente registrado como 1989, e não 1979.

As comparações de strings normalmente são case-insensíveis, então você pode especificar o nome como `'bowser'`, `'BOWSER'`, e assim por diante. O resultado da consulta é o mesmo.

Você pode especificar condições em qualquer coluna, não apenas em `name`. Por exemplo, se você quiser saber quais animais nasceram durante ou depois de 1998, teste a coluna `birth`:

```
mysql> SELECT * FROM pet WHERE birth >= '1998-1-1';
+----------+-------+---------+------+------------+-------+
| name     | owner | species | sex  | birth      | death |
+----------+-------+---------+------+------------+-------+
| Chirpy   | Gwen  | bird    | f    | 1998-09-11 | NULL  |
| Puffball | Diane | hamster | f    | 1999-03-30 | NULL  |
+----------+-------+---------+------+------------+-------+
```

Você pode combinar condições, por exemplo, para localizar cães fêmeas:

```
mysql> SELECT * FROM pet WHERE species = 'dog' AND sex = 'f';
+-------+--------+---------+------+------------+-------+
| name  | owner  | species | sex  | birth      | death |
+-------+--------+---------+------+------------+-------+
| Buffy | Harold | dog     | f    | 1989-05-13 | NULL  |
+-------+--------+---------+------+------------+-------+
```

A consulta anterior usa o `AND` operador lógico. Há também um `OR` operador:

```
mysql> SELECT * FROM pet WHERE species = 'snake' OR species = 'bird';
+----------+-------+---------+------+------------+-------+
| name     | owner | species | sex  | birth      | death |
+----------+-------+---------+------+------------+-------+
| Chirpy   | Gwen  | bird    | f    | 1998-09-11 | NULL  |
| Whistler | Gwen  | bird    | NULL | 1997-12-09 | NULL  |
| Slim     | Benny | snake   | m    | 1996-04-29 | NULL  |
+----------+-------+---------+------+------------+-------+
```

Se você usar ambos os operadores, é uma boa ideia usar parênteses para indicar explicitamente como as condições devem ser agrupadas:

```
mysql> SELECT * FROM pet WHERE (species = 'cat' AND sex = 'm')
       OR (species = 'dog' AND sex = 'f');
+-------+--------+---------+------+------------+-------+
| name  | owner  | species | sex  | birth      | death |
+-------+--------+---------+------+------------+-------+
| Claws | Gwen   | cat     | m    | 1994-03-17 | NULL  |
| Buffy | Harold | dog     | f    | 1989-05-13 | NULL  |
+-------+--------+---------+------+------------+-------+
```
