### 3.3.2 Criando uma Tabela

Criar o Database é a parte fácil, mas neste ponto ele está vazio, como o comando [`SHOW TABLES`](show-tables.html "13.7.5.37 SHOW TABLES Statement") demonstra:

```sql
mysql> SHOW TABLES;
Empty set (0.00 sec)
```

A parte mais difícil é decidir qual deve ser a estrutura do seu Database: quais Tabelas você precisa e quais Columns devem estar em cada uma delas.

Você deseja uma Tabela que contenha um registro para cada um dos seus animais de estimação. Esta pode ser chamada de Tabela `pet`, e deve conter, no mínimo, o nome de cada animal. Como o nome por si só não é muito interessante, a Tabela deve conter outras informações. Por exemplo, se mais de uma pessoa na sua família tem animais de estimação, você pode querer listar o dono de cada animal. Você também pode querer registrar algumas informações descritivas básicas, como espécie e sexo.

Que tal a idade? Isso pode ser de interesse, mas não é algo bom de se armazenar em um Database. A idade muda com o passar do tempo, o que significa que você teria que atualizar seus registros frequentemente. Em vez disso, é melhor armazenar um valor fixo, como a data de nascimento. Então, sempre que precisar da idade, você pode calculá-la como a diferença entre a data atual e a data de nascimento. O MySQL oferece Functions para realizar aritmética de datas, então isso não é difícil. Armazenar a data de nascimento em vez da idade também tem outras vantagens:

* Você pode usar o Database para tarefas como gerar lembretes para aniversários de animais de estimação que se aproximam. (Se você achar que este tipo de Query é um tanto bobo, observe que é a mesma pergunta que você faria no contexto de um Database de negócios para identificar clientes para os quais você precisa enviar cumprimentos de aniversário na semana ou mês atual, para aquele toque pessoal assistido por computador.)

* Você pode calcular a idade em relação a datas diferentes da data atual. Por exemplo, se você armazena a data de falecimento no Database, você pode calcular facilmente quantos anos um animal de estimação tinha quando morreu.

Você provavelmente pode pensar em outros tipos de informação que seriam úteis na Tabela `pet`, mas as identificadas até agora são suficientes: nome, dono, espécie, sexo, nascimento e falecimento.

Use um comando [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") para especificar o layout da sua Tabela:

```sql
mysql> CREATE TABLE pet (name VARCHAR(20), owner VARCHAR(20),
       species VARCHAR(20), sex CHAR(1), birth DATE, death DATE);
```

O [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") é uma boa escolha para as Columns `name`, `owner` e `species` porque os valores das Columns variam em comprimento. Os comprimentos nessas definições de Column não precisam ser todos iguais, nem precisam ser `20`. Você pode normalmente escolher qualquer comprimento de `1` a `65535`, o que parecer mais razoável para você. Se você fizer uma escolha inadequada e descobrir mais tarde que precisa de um campo mais longo, o MySQL fornece um comando [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement").

Vários tipos de valores podem ser escolhidos para representar o sexo em registros de animais, como `'m'` e `'f'`, ou talvez `'male'` e `'female'`. É mais simples usar os caracteres únicos `'m'` e `'f'`.

O uso do tipo de dado [`DATE`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") para as Columns `birth` e `death` é uma escolha bastante óbvia.

Assim que você tiver criado uma Tabela, [`SHOW TABLES`](show-tables.html "13.7.5.37 SHOW TABLES Statement") deve produzir alguma saída:

```sql
mysql> SHOW TABLES;
+---------------------+
| Tables in menagerie |
+---------------------+
| pet                 |
+---------------------+
```

Para verificar se sua Tabela foi criada da maneira que você esperava, use um comando [`DESCRIBE`](describe.html "13.8.1 DESCRIBE Statement"):

```sql
mysql> DESCRIBE pet;
+---------+-------------+------+-----+---------+-------+
| Field   | Type        | Null | Key | Default | Extra |
+---------+-------------+------+-----+---------+-------+
| name    | varchar(20) | YES  |     | NULL    |       |
| owner   | varchar(20) | YES  |     | NULL    |       |
| species | varchar(20) | YES  |     | NULL    |       |
| sex     | char(1)     | YES  |     | NULL    |       |
| birth   | date        | YES  |     | NULL    |       |
| death   | date        | YES  |     | NULL    |       |
+---------+-------------+------+-----+---------+-------+
```

Você pode usar o [`DESCRIBE`](describe.html "13.8.1 DESCRIBE Statement") a qualquer momento, por exemplo, se você esquecer os nomes das Columns em sua Tabela ou quais tipos elas possuem.

Para mais informações sobre tipos de dados MySQL, consulte [Capítulo 11, *Data Types*](data-types.html "Chapter 11 Data Types").