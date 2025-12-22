### 5.3.2 Criação de uma tabela

Criar o banco de dados é a parte mais fácil, mas neste momento ele está vazio, como \[`SHOW TABLES`] diz:

```
mysql> SHOW TABLES;
Empty set (0.00 sec)
```

A parte mais difícil é decidir qual deve ser a estrutura do seu banco de dados: quais tabelas você precisa e quais colunas devem estar em cada uma delas.

Você quer uma tabela que contenha um registro para cada um de seus animais de estimação. Isso pode ser chamado de tabela `pet` e deve conter, como mínimo, o nome de cada animal. Como o nome por si só não é muito interessante, a tabela deve conter outras informações. Por exemplo, se mais de uma pessoa em sua família mantém animais de estimação, você pode querer listar o proprietário de cada animal. Você também pode querer registrar algumas informações descritivas básicas, como espécies e sexo.

E quanto à idade? Isso pode ser interessante, mas não é uma coisa boa para armazenar em um banco de dados. A idade muda com o passar do tempo, o que significa que você teria que atualizar seus registros com frequência. Em vez disso, é melhor armazenar um valor fixo, como data de nascimento. Então, sempre que você precisar de idade, você pode calculá-lo como a diferença entre a data atual e a data de nascimento. O MySQL fornece funções para fazer aritmética de data, então isso não é difícil. Armazenar data de nascimento em vez de idade também tem outras vantagens:

- Você pode usar o banco de dados para tarefas como gerar lembretes para aniversários próximos de animais de estimação. (Se você acha que esse tipo de consulta é um pouco bobo, observe que é a mesma pergunta que você pode fazer no contexto de um banco de dados de negócios para identificar clientes a quem você precisa enviar saudações de aniversário na semana ou mês atual, para esse toque pessoal assistido por computador.)
- Por exemplo, se você armazenar a data de morte no banco de dados, você pode facilmente calcular a idade de um animal de estimação quando ele morreu.

Você provavelmente pode pensar em outros tipos de informações que seriam úteis na tabela `pet`, mas as identificadas até agora são suficientes: nome, proprietário, espécie, sexo, nascimento e morte.

Use uma instrução `CREATE TABLE` para especificar o layout da sua tabela:

```
mysql> CREATE TABLE pet (name VARCHAR(20), owner VARCHAR(20),
       species VARCHAR(20), sex CHAR(1), birth DATE, death DATE);
```

`VARCHAR` é uma boa escolha para as colunas `name`, `owner`, e `species` porque os valores das colunas variam em comprimento. Os comprimentos nessas definições de coluna não precisam ser todos iguais, e não precisam ser `20`. Você pode normalmente escolher qualquer comprimento de `1` a `65535`, o que parecer mais razoável para você. Se você fizer uma escolha ruim e mais tarde descobrir que precisa de um campo mais longo, o MySQL fornece uma instrução \[`ALTER TABLE`]] ((alter-table.html).

Vários tipos de valores podem ser escolhidos para representar o sexo em registros de animais, como `'m'` e `'f'`, ou talvez `'male'` e `'female'`.

O uso do tipo de dados `DATE` para as colunas `birth` e `death` é uma escolha bastante óbvia.

Uma vez que você criou uma tabela, \[`SHOW TABLES`] (show-tables.html) deve produzir alguma saída:

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

Você pode usar `DESCRIBE` a qualquer momento, por exemplo, se você esquecer os nomes das colunas em sua tabela ou quais tipos eles têm.

Para mais informações sobre os tipos de dados MySQL, ver Capítulo 13, "Tipos de dados".
