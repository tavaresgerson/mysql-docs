#### 5.3.4.1 Selecção de todos os dados

A forma mais simples de `SELECT` recupera tudo de uma tabela:

```
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

Esta forma de `SELECT` usa `*`, que é uma abreviação para select all columns. Isso é útil se você quiser rever sua tabela inteira, por exemplo, depois de ter carregado seu conjunto de dados inicial. Por exemplo, você pode pensar que a data de nascimento de Bowser não parece muito correta. Consultando seus documentos originais de pedigree, você descobre que o ano de nascimento correto deve ser 1989, não 1979.

Há pelo menos duas maneiras de resolver isto:

- Edite o arquivo `pet.txt` para corrigir o erro, então esvazie a tabela e recarregue-a usando `DELETE` e `LOAD DATA`:

  ```
  mysql> DELETE FROM pet;
  mysql> LOAD DATA LOCAL INFILE 'pet.txt' INTO TABLE pet;
  ```

  No entanto, se fizer isso, também deve voltar a entrar no registo para o Puffball.
- Corrigir apenas o registro errôneo com uma instrução `UPDATE`:

  ```
  mysql> UPDATE pet SET birth = '1989-08-31' WHERE name = 'Bowser';
  ```

  O `UPDATE` altera apenas o registro em questão e não requer que você recarregue a tabela.

Há uma exceção ao princípio de que `SELECT *` seleciona todas as colunas. Se uma tabela contém colunas invisíveis, `*` não as inclui. Para mais informações, consulte a Seção 15.1.20.10, Colunas Invisíveis.
