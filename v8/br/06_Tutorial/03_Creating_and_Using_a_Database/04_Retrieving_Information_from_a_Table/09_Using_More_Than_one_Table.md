#### 5.3.4.9 Usar mais de uma tabela

A tabela `pet` mantém o registro de quais animais de estimação você tem. Se você quiser registrar outras informações sobre eles, como eventos em suas vidas, como visitas ao veterinário ou quando os ninhadas nascem, você precisa de outra tabela. Como essa tabela deve ser? Ela precisa conter as seguintes informações:

- O nome do animal para que você saiba a que animal cada evento pertence.

- Uma data para que você saiba quando o evento ocorreu.

- Um campo para descrever o evento.

- Um campo de tipo de evento, se você quiser ser capaz de categorizar eventos.

Dadas essas considerações, a declaração `CREATE TABLE` para a tabela `event` pode parecer assim:

```
mysql> CREATE TABLE event (name VARCHAR(20), date DATE,
       type VARCHAR(15), remark VARCHAR(255));
```

Assim como na tabela `pet`, é mais fácil carregar os registros iniciais ao criar um arquivo de texto delimitado por tabulação contendo as seguintes informações.

<table summary="Os dados do registro de animais aparecem em um arquivo de texto delimitado por tabulação, conforme descrito no texto anterior."><thead><tr> <th scope="col">nome</th> <th scope="col">data</th> <th scope="col">tipo</th> <th scope="col">remarcar</th> </tr></thead><tbody><tr> <th>Fofo</th> <td>15/05/1995</td> <td>lixa</td> <td>4 gatinhos, 3 fêmeas, 1 macho</td> </tr><tr> <th>Buffy</th> <td>1993-06-23</td> <td>lixa</td> <td>5 filhotes, 2 fêmeas, 3 machos</td> </tr><tr> <th>Buffy</th> <td>1994-06-19</td> <td>lixa</td> <td>3 filhotes, 3 fêmeas</td> </tr><tr> <th>Chirpy</th> <td>1999-03-21</td> <td>veterinário</td> <td>necessitava de bico alinhado</td> </tr><tr> <th>Magro</th> <td>1997-08-03</td> <td>veterinário</td> <td>costela quebrada</td> </tr><tr> <th>Bowser</th> <td>12/10/1991</td> <td>canil</td> <td></td> </tr><tr> <th>Fang</th> <td>12/10/1991</td> <td>canil</td> <td></td> </tr><tr> <th>Fang</th> <td>18/08/1998</td> <td>aniversário</td> <td>Deu-lhe um novo brinquedo para mastigar</td> </tr><tr> <th>Garras</th> <td>17/03/1998</td> <td>aniversário</td> <td>Deu-lhe um novo colar de pulgas</td> </tr><tr> <th>Whistler</th> <td>1998-12-09</td> <td>aniversário</td> <td>Primeiro aniversário</td> </tr></tbody></table>

Carregue os registros da seguinte forma:

```
mysql> LOAD DATA LOCAL INFILE 'event.txt' INTO TABLE event;
```

Com base no que você aprendeu com as consultas que você realizou na tabela `pet`, você deve ser capaz de realizar recuperações dos registros na tabela `event`; os princípios são os mesmos. Mas quando a tabela `event` por si só é insuficiente para responder às perguntas que você pode fazer?

Suponha que você queira descobrir as idades em que cada animal de estimação teve seus ninhadas. Vimos anteriormente como calcular idades a partir de duas datas. A data da ninhada da mãe está na tabela `event`, mas para calcular sua idade naquela data, você precisa de sua data de nascimento, que está armazenada na tabela `pet`. Isso significa que a consulta requer ambas as tabelas:

```
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

Há várias coisas a serem observadas sobre essa consulta:

- A cláusula `FROM` une duas tabelas porque a consulta precisa extrair informações de ambas.

- Ao combinar (juntar) informações de várias tabelas, você precisa especificar como os registros de uma tabela podem ser correspondidos aos registros da outra. Isso é fácil porque ambas as tabelas têm uma coluna `name`. A consulta usa uma cláusula `ON` para combinar os registros das duas tabelas com base nos valores de `name`.

  A consulta usa um `INNER JOIN` para combinar as tabelas. Um `INNER JOIN` permite que as linhas de qualquer uma das tabelas apareçam no resultado se e somente se ambas as tabelas atenderem às condições especificadas na cláusula `ON`. Neste exemplo, a cláusula `ON` especifica que a coluna `name` na tabela `pet` deve corresponder à coluna `name` na tabela `event`. Se um nome aparecer em uma tabela, mas não na outra, a linha não aparecerá no resultado porque a condição na cláusula `ON` falha.

- Como a coluna `name` ocorre em ambas as tabelas, você deve ser específico sobre qual tabela você está se referindo quando se refere à coluna. Isso é feito prefixando o nome da tabela ao nome da coluna.

Você não precisa ter duas tabelas diferentes para realizar uma junção. Às vezes, é útil unir uma tabela a si mesma, se você quiser comparar registros em uma tabela com outros registros na mesma tabela. Por exemplo, para encontrar pares de reprodução entre seus animais de estimação, você pode unir a tabela `pet` a si mesma para produzir pares de machos e fêmeas vivos de espécies semelhantes:

```
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

Nesta consulta, especificamos aliases para o nome da tabela para referir-se às colunas e manter claro qual instância da tabela cada referência de coluna está associada.
