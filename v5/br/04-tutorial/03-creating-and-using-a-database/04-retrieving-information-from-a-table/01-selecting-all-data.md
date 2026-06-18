#### 3.3.4.1 Selecionando todos os dados

A forma mais simples de `SELECT` recupera tudo de uma tabela:

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

Este formulário de `SELECT` usa `*`, que é uma abreviação para “selecionar todas as colunas”. Isso é útil se você quiser revisar toda a tabela, por exemplo, depois de ter carregado os dados iniciais. Por exemplo, você pode achar que a data de nascimento de Bowser não parece certa. Consultando seus papéis de pedigree originais, você descobre que o ano correto de nascimento deve ser 1989, e não 1979.

Existem pelo menos duas maneiras de resolver isso:

- Edita o arquivo `pet.txt` para corrigir o erro, depois esvazia a tabela e recarregá-la usando `DELETE` e `LOAD DATA`:

  ```sql
  mysql> DELETE FROM pet;
  mysql> LOAD DATA LOCAL INFILE '/path/pet.txt' INTO TABLE pet;
  ```

  No entanto, se você fizer isso, também deve reintroduzir o registro do Puffball.

- Conserte apenas o registro errôneo com uma declaração `UPDATE`:

  ```sql
  mysql> UPDATE pet SET birth = '1989-08-31' WHERE name = 'Bowser';
  ```

  As alterações no `UPDATE` alteram apenas o registro em questão e não exigem que você recarregue a tabela.
