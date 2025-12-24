#### 5.3.4.9 Utilização de mais de uma tabela

A tabela `pet` mantém o controle de quais animais de estimação você tem. Se você quiser registrar outras informações sobre eles, como eventos em suas vidas, como visitas ao veterinário ou quando os filhotes nascem, você precisa de outra tabela. Como deve ser essa tabela? Ela precisa conter as seguintes informações:

- O nome do animal de estimação para que saiba a que animal cada evento pertence.
- Uma data para saber quando o evento ocorreu.
- Um campo para descrever o evento.
- Um tipo de evento campo, se você quiser ser capaz de categorizar eventos.

Dadas essas considerações, a instrução `CREATE TABLE` para a tabela `event` pode ser assim:

```
mysql> CREATE TABLE event (name VARCHAR(20), date DATE,
       type VARCHAR(15), remark VARCHAR(255));
```

Tal como acontece com a tabela `pet`, é mais fácil carregar os registros iniciais criando um arquivo de texto delimitado por abas contendo as seguintes informações.

<table><thead><tr> <th>nome</th> <th>data</th> <th>tipo de</th> <th>observação</th> </tr></thead><tbody><tr> <th>Peluchoso</th> <td>Relatório da Comissão</td> <td>Lixo</td> <td>4 gatinhos, 3 fêmeas, 1 macho</td> </tr><tr> <th>Buffy .</th> <td>23 de Junho de 1993</td> <td>Lixo</td> <td>5 filhotes, 2 fêmeas, 3 machos</td> </tr><tr> <th>Buffy .</th> <td>1994-19 de Junho</td> <td>Lixo</td> <td>3 filhotes, 3 fêmeas</td> </tr><tr> <th>Alegria</th> <td>1999-03-21 Comissão</td> <td>veterinário</td> <td>O bico precisa de ser endireitado.</td> </tr><tr> <th>Escasso</th> <td>1997-08-03</td> <td>veterinário</td> <td>costela partida</td> </tr><tr> <th>Bowser .</th> <td>1991-10-12</td> <td>canil</td> <td></td> </tr><tr> <th>Finga</th> <td>1991-10-12</td> <td>canil</td> <td></td> </tr><tr> <th>Finga</th> <td>1998-08-28</td> <td>aniversário</td> <td>Dei-lhe um novo brinquedo para mastigar</td> </tr><tr> <th>Armadilhas</th> <td>1998-03-17 Comissão</td> <td>aniversário</td> <td>Dei-lhe um novo colar para pulgas.</td> </tr><tr> <th>Whistler</th> <td>1998-12-09 (em inglês)</td> <td>aniversário</td> <td>Primeiro aniversário</td> </tr></tbody></table>

Carregar os registos assim:

```
mysql> LOAD DATA LOCAL INFILE 'event.txt' INTO TABLE event;
```

Com base no que você aprendeu com as consultas que você executou na tabela `pet`, você deve ser capaz de realizar recuperações nos registros na tabela `event`; os princípios são os mesmos. Mas quando a tabela `event` por si só é insuficiente para responder perguntas que você pode fazer?

Suponha que você queira descobrir as idades em que cada animal de estimação teve suas crias. Vimos anteriormente como calcular idades a partir de duas datas. A data da ninhada da mãe está na tabela `event`, mas para calcular sua idade nessa data, você precisa de sua data de nascimento, que é armazenada na tabela `pet`. Isso significa que a consulta requer ambas as tabelas:

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

Há várias coisas a notar sobre esta consulta:

- A cláusula `FROM` junta duas tabelas porque a consulta precisa extrair informações de ambas.
- Ao combinar (unir) informações de várias tabelas, você precisa especificar como os registros em uma tabela podem ser correspondidos aos registros na outra. Isso é fácil porque ambos têm uma coluna `name`. A consulta usa uma cláusula `ON` para combinar registros nas duas tabelas com base nos valores `name`.

  A consulta usa um `INNER JOIN` para combinar as tabelas. Um `INNER JOIN` permite que linhas de qualquer tabela apareçam no resultado se e somente se ambas as tabelas atenderem às condições especificadas na cláusula `ON`. Neste exemplo, a cláusula `ON` especifica que a coluna `name` na tabela `pet` deve corresponder à coluna `name` na tabela `event`. Se um nome aparece em uma tabela, mas não na outra, a linha não aparece no resultado porque a condição na cláusula `ON` falha.
- Como a coluna `name` ocorre em ambas as tabelas, você deve ser específico sobre qual tabela você quer dizer quando se refere à coluna. Isso é feito prependendo o nome da tabela ao nome da coluna.

Você não precisa ter duas tabelas diferentes para realizar uma junção. Às vezes é útil juntar uma tabela a si mesma, se você quiser comparar registros em uma tabela com outros registros na mesma tabela. Por exemplo, para encontrar pares de reprodução entre seus animais de estimação, você pode unir a tabela `pet` consigo mesma para produzir pares de candidatos de machos e fêmeas vivos de espécies semelhantes:

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

Nesta consulta, especificamos aliases para o nome da tabela para referir-se às colunas e manter direta qual instância da tabela cada referência de coluna está associada.
