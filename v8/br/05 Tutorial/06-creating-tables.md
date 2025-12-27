### 5.3.2 Criando uma Tabela

Criar o banco de dados é a parte fácil, mas, neste momento, ele está vazio, como o comando `SHOW TABLES` mostra:

```
mysql> SHOW TABLES;
Empty set (0.00 sec)
```

A parte mais difícil é decidir qual deve ser a estrutura do seu banco de dados: quais tabelas você precisa e quais colunas devem estar em cada uma delas.

Você quer uma tabela que contenha um registro para cada um de seus animais de estimação. Esta pode ser chamada de tabela `pet` e deve conter, no mínimo, o nome de cada animal. Como o nome por si só não é muito interessante, a tabela deve conter outras informações. Por exemplo, se mais de uma pessoa na sua família mantém animais de estimação, você pode querer listar o dono de cada animal. Você também pode querer registrar algumas informações descritivas básicas, como espécie e sexo.

E a idade? Isso pode ser interessante, mas não é uma boa ideia armazenar em um banco de dados. A idade muda com o passar do tempo, o que significa que você teria que atualizar seus registros frequentemente. Em vez disso, é melhor armazenar um valor fixo, como a data de nascimento. Então, sempre que você precisar da idade, pode calculá-la como a diferença entre a data atual e a data de nascimento. O MySQL fornece funções para realizar cálculos de data, então isso não é difícil. Armazenar a data de nascimento em vez da idade tem outras vantagens também:

* Você pode usar o banco de dados para tarefas como gerar lembretes para aniversários de animais de estimação futuros. (Se você acha que esse tipo de consulta é um pouco boba, note que é a mesma pergunta que você pode fazer no contexto de um banco de dados de negócios para identificar clientes a quem você precisa enviar saudações de aniversário na semana ou mês atual, para dar um toque pessoal assistido por computador.)
* Você pode calcular a idade em relação a datas diferentes da data atual. Por exemplo, se você armazenar a data de morte no banco de dados, pode facilmente calcular quão velho um animal de estimação tinha quando morreu.
Você provavelmente pode pensar em outros tipos de informações que seriam úteis na tabela `pet`, mas as identificadas até agora são suficientes: nome, dono, espécie, sexo, nascimento e morte.

Use uma instrução `CREATE TABLE` para especificar o layout da sua tabela:

```
mysql> CREATE TABLE pet (name VARCHAR(20), owner VARCHAR(20),
       species VARCHAR(20), sex CHAR(1), birth DATE, death DATE);
```

`VARCHAR` é uma boa escolha para as colunas `name`, `owner` e `species` porque os valores das colunas variam em comprimento. Os comprimentos nessas definições de colunas não precisam ser todos iguais e não precisam ser `20`. Você normalmente pode escolher qualquer comprimento de `1` a `65535`, o que for mais razoável para você. Se você fizer uma escolha ruim e descobrir mais tarde que precisa de um campo mais longo, o MySQL fornece uma instrução `ALTER TABLE`.

Vários tipos de valores podem ser escolhidos para representar o sexo em registros de animais, como `'m'` e `'f'`, ou talvez `'male'` e `'female'`. É mais simples usar os caracteres únicos `'m'` e `'f'`.

O uso do tipo de dados `DATE` para as colunas `birth` e `death` é uma escolha bastante óbvia.

Depois de criar uma tabela, `SHOW TABLES` deve produzir algum resultado:

```
mysql> SHOW TABLES;
+---------------------+
| Tables in menagerie |
+---------------------+
| pet                 |
+---------------------+
```

Para verificar se sua tabela foi criada da maneira que você esperava, use uma instrução `DESCRIBE`:

```
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

Você pode usar `DESCRIBE` a qualquer momento, por exemplo, se esquecer os nomes das colunas da sua tabela ou quais tipos elas têm.

Para mais informações sobre os tipos de dados do MySQL, consulte o Capítulo 13, *Tipos de Dados*.