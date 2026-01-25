#### 3.3.4.1 Selecionando Todos os Dados

A forma mais simples de [`SELECT`](select.html "13.2.9 SELECT Statement") recupera tudo de uma tabela:

```sql
mysql> SELECT * FROM pet;
+----------+--------+---------+------+------------+------------+
| name     | owner  | species | sex  | birth      | death      |
+----------+--------+---------+------+------------+------------+
| Fluffy   | Harold | cat     | f    | 1993-02-04 | NULL       |
| Claws    | Gwen   | cat     | m    | 1994-03-17 | NULL       |
| Buffy    | Harold | dog     | f    | 1989-05-13 | NULL       |
| Fang     | Benny  | dog     | m    | 1990-08-27 | NULL       |
| Bowser   | Diane  | dog     | m    | 1979-08-31 | 1995-07-29 |
| Chirpy   | Gwen   | bird    | f    | 1998-09-11 | NULL       |
| Whistler | Gwen   | bird    | NULL | 1997-12-09 | NULL       |
| Slim     | Benny  | snake   | m    | 1996-04-29 | NULL       |
| Puffball | Diane  | hamster | f    | 1999-03-30 | NULL       |
+----------+--------+---------+------+------------+------------+
```

Esta forma de [`SELECT`](select.html "13.2.9 SELECT Statement") usa `*`, que é a abreviação para “selecionar todas as colunas.” Isso é útil se você deseja revisar sua tabela inteira, por exemplo, depois de carregá-la com seu conjunto de dados inicial. Por exemplo, você pode achar que a data de nascimento de Bowser não parece totalmente correta. Consultando seus documentos de pedigree originais, você descobre que o ano de nascimento correto deveria ser 1989, e não 1979.

Existem pelo menos duas maneiras de corrigir isso:

* Edite o arquivo `pet.txt` para corrigir o erro, depois esvazie a tabela e recarregue-a usando [`DELETE`](delete.html "13.2.2 DELETE Statement") e [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement"):

  ```sql
  mysql> DELETE FROM pet;
  mysql> LOAD DATA LOCAL INFILE '/path/pet.txt' INTO TABLE pet;
  ```

  No entanto, se você fizer isso, você também deve reinserir o registro de Puffball.

* Corrija apenas o registro incorreto com uma instrução [`UPDATE`](update.html "13.2.11 UPDATE Statement"):

  ```sql
  mysql> UPDATE pet SET birth = '1989-08-31' WHERE name = 'Bowser';
  ```

  O [`UPDATE`](update.html "13.2.11 UPDATE Statement") altera apenas o registro em questão e não exige que você recarregue a tabela.