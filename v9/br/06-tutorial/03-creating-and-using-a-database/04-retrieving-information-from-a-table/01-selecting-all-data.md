#### 5.3.4.1 Selecionando Todos os Dados

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

Essa forma de `SELECT` usa `*`, que é uma abreviação para "selecionar todas as colunas". Isso é útil se você quiser revisar toda a sua tabela, por exemplo, depois de ter carregado seus dados iniciais. Por exemplo, você pode achar que a data de nascimento de Bowser não parece correta. Consultando seus papéis de pedigree originais, você descobre que o ano correto de nascimento deve ser 1989, e não 1979.

Existem pelo menos duas maneiras de corrigir isso:

* Editar o arquivo `pet.txt` para corrigir o erro, depois esvazie a tabela e recarregue-a usando `DELETE` e `LOAD DATA`:

  ```
  mysql> DELETE FROM pet;
  mysql> LOAD DATA LOCAL INFILE 'pet.txt' INTO TABLE pet;
  ```

  No entanto, se você fizer isso, também precisará reintroduzir o registro de Puffball.

* Corrija apenas o registro errôneo com uma declaração `UPDATE`:

  ```
  mysql> UPDATE pet SET birth = '1989-08-31' WHERE name = 'Bowser';
  ```

  A `UPDATE` altera apenas o registro em questão e não exige que você recarregue a tabela.

Há uma exceção ao princípio de que `SELECT *` seleciona todas as colunas. Se uma tabela contiver colunas invisíveis, `*` não as inclui. Para mais informações, consulte a Seção 15.1.24.10, "Colunas Invisíveis".