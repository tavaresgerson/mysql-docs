### 12.9.7 Adicionando uma Collation Definida pelo Usuário para Indexação Full-Text

Esta seção descreve como adicionar uma Collation definida pelo usuário para buscas Full-Text usando o Parser Full-Text embutido. A Collation de exemplo é semelhante a `latin1_swedish_ci`, mas trata o caractere `'-'` como uma letra em vez de um caractere de pontuação, para que possa ser indexado como um caractere de palavra. Informações gerais sobre como adicionar Collations estão disponíveis na Seção 10.14, “Adicionando uma Collation a um Character Set”; presume-se que você a tenha lido e esteja familiarizado com os arquivos envolvidos.

Para adicionar uma Collation para indexação Full-Text, utilize o procedimento a seguir. As instruções aqui adicionam uma Collation para um Character Set simples, que, conforme discutido na Seção 10.14, “Adicionando uma Collation a um Character Set”, pode ser criado usando um arquivo de configuração que descreve as propriedades do Character Set. Para um Character Set complexo, como o Unicode, crie Collations usando arquivos C source que descrevem as propriedades do Character Set.

1. Adicione uma Collation ao arquivo `Index.xml`. O intervalo permitido de IDs para Collations definidas pelo usuário é dado na Seção 10.14.2, “Escolhendo um Collation ID”. O ID deve estar sem uso, então escolha um valor diferente de 1025 se esse ID já estiver sendo usado no seu sistema.

   ```sql
   <charset name="latin1">
   ...
   <collation name="latin1_fulltext_ci" id="1025"/>
   </charset>
   ```

2. Declare a ordem de classificação (sort order) para a Collation no arquivo `latin1.xml`. Neste caso, a ordem pode ser copiada de `latin1_swedish_ci`:

   ```sql
   <collation name="latin1_fulltext_ci">
   <map>
   00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F
   10 11 12 13 14 15 16 17 18 19 1A 1B 1C 1D 1E 1F
   20 21 22 23 24 25 26 27 28 29 2A 2B 2C 2D 2E 2F
   30 31 32 33 34 35 36 37 38 39 3A 3B 3C 3D 3E 3F
   40 41 42 43 44 45 46 47 48 49 4A 4B 4C 4D 4E 4F
   50 51 52 53 54 55 56 57 58 59 5A 5B 5C 5D 5E 5F
   60 41 42 43 44 45 46 47 48 49 4A 4B 4C 4D 4E 4F
   50 51 52 53 54 55 56 57 58 59 5A 7B 7C 7D 7E 7F
   80 81 82 83 84 85 86 87 88 89 8A 8B 8C 8D 8E 8F
   90 91 92 93 94 95 96 97 98 99 9A 9B 9C 9D 9E 9F
   A0 A1 A2 A3 A4 A5 A6 A7 A8 A9 AA AB AC AD AE AF
   B0 B1 B2 B3 B4 B5 B6 B7 B8 B9 BA BB BC BD BE BF
   41 41 41 41 5C 5B 5C 43 45 45 45 45 49 49 49 49
   44 4E 4F 4F 4F 4F 5D D7 D8 55 55 55 59 59 DE DF
   41 41 41 41 5C 5B 5C 43 45 45 45 45 49 49 49 49
   44 4E 4F 4F 4F 4F 5D F7 D8 55 55 55 59 59 DE FF
   </map>
   </collation>
   ```

3. Modifique o Array `ctype` em `latin1.xml`. Altere o valor correspondente a 0x2D (que é o código para o caractere `'-'`) de 10 (pontuação) para 01 (letra maiúscula). No Array a seguir, este é o elemento na quarta linha abaixo, o terceiro valor a partir do final.

   ```sql
   <ctype>
   <map>
   00
   20 20 20 20 20 20 20 20 20 28 28 28 28 28 20 20
   20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20
   48 10 10 10 10 10 10 10 10 10 10 10 10 01 10 10
   84 84 84 84 84 84 84 84 84 84 10 10 10 10 10 10
   10 81 81 81 81 81 81 01 01 01 01 01 01 01 01 01
   01 01 01 01 01 01 01 01 01 01 01 10 10 10 10 10
   10 82 82 82 82 82 82 02 02 02 02 02 02 02 02 02
   02 02 02 02 02 02 02 02 02 02 02 10 10 10 10 20
   10 00 10 02 10 10 10 10 10 10 01 10 01 00 01 00
   00 10 10 10 10 10 10 10 10 10 02 10 02 00 02 01
   48 10 10 10 10 10 10 10 10 10 10 10 10 10 10 10
   10 10 10 10 10 10 10 10 10 10 10 10 10 10 10 10
   01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01
   01 01 01 01 01 01 01 10 01 01 01 01 01 01 01 02
   02 02 02 02 02 02 02 02 02 02 02 02 02 02 02 02
   02 02 02 02 02 02 02 10 02 02 02 02 02 02 02 02
   </map>
   </ctype>
   ```

4. Reinicie o server.
5. Para empregar a nova Collation, inclua-a na definição das columns que devem usá-la:

   ```sql
   mysql> DROP TABLE IF EXISTS t1;
   Query OK, 0 rows affected (0.13 sec)

   mysql> CREATE TABLE t1 (
       a TEXT CHARACTER SET latin1 COLLATE latin1_fulltext_ci,
       FULLTEXT INDEX(a)
       ) ENGINE=InnoDB;
   Query OK, 0 rows affected (0.47 sec)
   ```

6. Teste a Collation para verificar se o hífen é considerado como um caractere de palavra:

   ```sql
   mysql> INSERT INTO t1 VALUEs ('----'),('....'),('abcd');
   Query OK, 3 rows affected (0.22 sec)
   Records: 3  Duplicates: 0  Warnings: 0

   mysql> SELECT * FROM t1 WHERE MATCH a AGAINST ('----' IN BOOLEAN MODE);
   +------+
   | a    |
   +------+
   | ---- |
   +------+
   1 row in set (0.00 sec)
   ```