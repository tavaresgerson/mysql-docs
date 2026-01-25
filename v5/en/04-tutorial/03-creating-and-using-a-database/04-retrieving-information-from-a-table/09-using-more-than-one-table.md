#### 3.3.4.9 Usando Mais de uma Tabela

A tabela `pet` rastreia quais pets você possui. Se você quiser registrar outras informações sobre eles, como eventos em suas vidas (visitas ao veterinário ou nascimento de ninhadas), você precisará de outra tabela. Como essa tabela deve ser? Ela precisa conter as seguintes informações:

* O nome do pet para que você saiba a qual animal cada evento se refere.
* Uma data para que você saiba quando o evento ocorreu.
* Um campo para descrever o evento.
* Um campo de tipo de evento, caso você queira categorizar os eventos.

Dadas estas considerações, o comando [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") para a tabela `event` pode ser assim:

```sql
mysql> CREATE TABLE event (name VARCHAR(20), date DATE,
       type VARCHAR(15), remark VARCHAR(255));
```

Assim como na tabela `pet`, é mais fácil carregar os registros iniciais criando um arquivo de texto delimitado por tabulações (tab-delimited) contendo as seguintes informações.

<table summary="Dados de registro de pet que aparecem em um arquivo de texto delimitado por tabulações, conforme descrito no texto anterior.">
   <col style="width: 15%"/>
   <col style="width: 15%"/>
   <col style="width: 15%"/>
   <col style="width: 35%"/>
   <thead>
      <tr>
         <th>name</th>
         <th>date</th>
         <th>type</th>
         <th>remark</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <th>Fluffy</th>
         <td>1995-05-15</td>
         <td>litter</td>
         <td>4 gatinhos, 3 fêmeas, 1 macho</td>
      </tr>
      <tr>
         <th>Buffy</th>
         <td>1993-06-23</td>
         <td>litter</td>
         <td>5 filhotes, 2 fêmeas, 3 machos</td>
      </tr>
      <tr>
         <th>Buffy</th>
         <td>1994-06-19</td>
         <td>litter</td>
         <td>3 filhotes, 3 fêmeas</td>
      </tr>
      <tr>
         <th>Chirpy</th>
         <td>1999-03-21</td>
         <td>vet</td>
         <td>precisou de bico endireitado</td>
      </tr>
      <tr>
         <th>Slim</th>
         <td>1997-08-03</td>
         <td>vet</td>
         <td>costela quebrada</td>
      </tr>
      <tr>
         <th>Bowser</th>
         <td>1991-10-12</td>
         <td>kennel</td>
         <td></td>
      </tr>
      <tr>
         <th>Fang</th>
         <td>1991-10-12</td>
         <td>kennel</td>
         <td></td>
      </tr>
      <tr>
         <th>Fang</th>
         <td>1998-08-28</td>
         <td>birthday</td>
         <td>Dei a ele um novo brinquedo de mastigar</td>
      </tr>
      <tr>
         <th>Claws</th>
         <td>1998-03-17</td>
         <td>birthday</td>
         <td>Dei a ele uma nova coleira antipulgas</td>
      </tr>
      <tr>
         <th>Whistler</th>
         <td>1998-12-09</td>
         <td>birthday</td>
         <td>Primeiro aniversário</td>
      </tr>
   </tbody>
</table>

Carregue os registros desta forma:

```sql
mysql> LOAD DATA LOCAL INFILE 'event.txt' INTO TABLE event;
```

Com base no que você aprendeu com as Querys que executou na tabela `pet`, você deve ser capaz de realizar recuperações (retrievals) nos registros da tabela `event`; os princípios são os mesmos. Mas quando a tabela `event` por si só é insuficiente para responder às perguntas que você possa fazer?

Suponha que você queira descobrir as idades em que cada pet teve suas ninhadas. Vimos anteriormente como calcular idades a partir de duas datas. A data da ninhada da mãe está na tabela `event`, mas para calcular a idade dela nessa data, você precisa da data de nascimento dela, que está armazenada na tabela `pet`. Isso significa que a Query requer ambas as tabelas:

```sql
mysql> SELECT pet.name,
       TIMESTAMPDIFF(YEAR,birth,date) AS age,
       remark
       FROM pet INNER JOIN event
         ON pet.name = event.name
       WHERE event.type = 'litter';
+--------+------+-----------------------------+
| name   | age  | remark                      |
+--------+------+-----------------------------+
| Fluffy |    2 | 4 kittens, 3 female, 1 male |
| Buffy  |    4 | 5 puppies, 2 female, 3 male |
| Buffy  |    5 | 3 puppies, 3 female         |
+--------+------+-----------------------------+
```

Há várias coisas a serem observadas sobre esta Query:

* A cláusula `FROM` faz um JOIN em duas tabelas porque a Query precisa extrair informações de ambas.

* Ao combinar (joining) informações de múltiplas tabelas, você precisa especificar como os registros em uma tabela podem ser combinados com os registros na outra. Isso é fácil porque ambas têm uma coluna `name`. A Query usa uma cláusula `ON` para combinar os registros nas duas tabelas com base nos valores de `name`.

  A Query usa um `INNER JOIN` para combinar as tabelas. Um `INNER JOIN` permite que linhas de ambas as tabelas apareçam no resultado se, e somente se, ambas as tabelas satisfizerem as condições especificadas na cláusula `ON`. Neste exemplo, a cláusula `ON` especifica que a coluna `name` na tabela `pet` deve corresponder à coluna `name` na tabela `event`. Se um nome aparecer em uma tabela, mas não na outra, a linha não aparecerá no resultado porque a condição na cláusula `ON` falha.

* Como a coluna `name` ocorre em ambas as tabelas, você deve ser específico sobre qual tabela você se refere ao mencionar a coluna. Isso é feito prefixando o nome da tabela ao nome da coluna.

Você não precisa ter duas tabelas diferentes para realizar um JOIN. Às vezes, é útil unir uma tabela a si mesma, caso você queira comparar registros em uma tabela com outros registros nessa mesma tabela. Por exemplo, para encontrar pares de reprodução (breeding pairs) entre seus pets, você pode fazer um JOIN da tabela `pet` com ela mesma para produzir pares candidatos de machos e fêmeas vivos da mesma espécie:

```sql
mysql> SELECT p1.name, p1.sex, p2.name, p2.sex, p1.species
       FROM pet AS p1 INNER JOIN pet AS p2
         ON p1.species = p2.species
         AND p1.sex = 'f' AND p1.death IS NULL
         AND p2.sex = 'm' AND p2.death IS NULL;
+--------+------+-------+------+---------+
| name   | sex  | name  | sex  | species |
+--------+------+-------+------+---------+
| Fluffy | f    | Claws | m    | cat     |
| Buffy  | f    | Fang  | m    | dog     |
+--------+------+-------+------+---------+
```

Nesta Query, especificamos aliases para o nome da tabela para nos referirmos às colunas e mantermos claro qual instância da tabela está associada a cada referência de coluna.