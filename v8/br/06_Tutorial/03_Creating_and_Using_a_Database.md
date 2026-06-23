## 5.3 Criando e usando um banco de dados

Uma vez que você saiba como inserir instruções SQL, você está pronto para acessar um banco de dados.

Suponha que você tenha vários animais em sua casa (sua manada) e que queira acompanhar vários tipos de informações sobre eles. Você pode fazer isso criando tabelas para armazenar seus dados e carregá-las com as informações desejadas. Em seguida, você pode responder diferentes tipos de perguntas sobre seus animais, recuperando dados das tabelas. Esta seção mostra como realizar as seguintes operações:

* Crie um banco de dados
* Crie uma tabela
* Carregue dados na tabela
* Recupere dados da tabela de várias maneiras
* Use múltiplas tabelas

O banco de dados da menagerie é simples (de propósito), mas não é difícil pensar em situações do mundo real em que um banco de dados semelhante poderia ser usado. Por exemplo, um banco de dados como este poderia ser usado por um fazendeiro para acompanhar o gado, ou por um veterinário para acompanhar os registros dos pacientes. Uma distribuição de menagerie contendo algumas das consultas e dados de amostra usados nas seções a seguir pode ser obtida do site MySQL. Está disponível tanto em arquivos **tar** comprimidos quanto em formatos Zip em https://dev.mysql.com/doc/.

Use a declaração `SHOW` para descobrir quais bancos de dados existem atualmente no servidor:

```
mysql> SHOW DATABASES;
+----------+
| Database |
+----------+
| mysql    |
| test     |
| tmp      |
+----------+
```

O banco de dados `mysql` descreve os privilégios de acesso do usuário. O banco de dados `test` geralmente está disponível como um espaço de trabalho para que os usuários testem coisas.

A lista de bancos de dados exibida pela declaração pode ser diferente na sua máquina; `SHOW DATABASES` não exibe bancos de dados para os quais você não tem privilégios, se você não tiver o privilégio `SHOW DATABASES`. Veja a Seção 15.7.7.14, “Declaração SHOW DATABASES”.

Se o banco de dados `test` existir, tente acessá-lo:

```
mysql> USE test
Database changed
```

`USE`, assim como `QUIT`, não exige ponto e vírgula. (Você pode terminar tais declarações com ponto e vírgula, se preferir; isso não faz mal a ninguém.) A declaração `USE` é especial de outra maneira também: ela deve ser dada em uma única linha.

Você pode usar o banco de dados `test` (se você tiver acesso a ele) para os exemplos que se seguem, mas qualquer coisa que você criar nesse banco de dados pode ser removida por qualquer outra pessoa que tenha acesso a ele. Por esse motivo, você provavelmente deve pedir permissão ao administrador do MySQL para usar um banco de dados próprio. Suponha que você queira chamar o seu `menagerie`. O administrador precisa executar uma declaração como esta:

```
mysql> GRANT ALL ON menagerie.* TO 'your_mysql_name'@'your_client_host';
```

onde `your_mysql_name` é o nome do usuário do MySQL atribuído a você e `your_client_host` é o host a partir do qual você se conecta ao servidor.

### 5.3.1 Criando e selecionando um banco de dados

Se o administrador criar o seu banco de dados para você ao configurar suas permissões, você pode começar a usá-lo. Caso contrário, você precisa criá-lo você mesmo:

```
mysql> CREATE DATABASE menagerie;
```

Sob Unix, os nomes dos bancos de dados são sensíveis ao caso (ao contrário das palavras-chave do SQL), então você deve sempre se referir ao seu banco de dados como `menagerie`, e não como `Menagerie`, `MENAGERIE` ou alguma outra variante. Isso também é válido para os nomes das tabelas. (Sob Windows, essa restrição não se aplica, embora você deva se referir aos bancos de dados e às tabelas usando a mesma letra em maiúsculas em toda uma consulta dada. No entanto, por várias razões, a melhor prática recomendada é sempre usar a mesma letra maiúscula que foi usada quando o banco de dados foi criado.)

Nota

Se você receber um erro como o ERRO 1044 (42000): Acesso negado ao usuário 'micah'@'localhost' para o banco de dados 'menagerie' ao tentar criar um banco de dados, isso significa que sua conta de usuário não tem os privilégios necessários para isso. Discuta isso com o administrador ou consulte a Seção 8.2, “Controle de Acesso e Gerenciamento de Conta”.

Criar um banco de dados não o seleciona para uso; você deve fazer isso explicitamente. Para tornar o `menagerie` o banco de dados atual, use esta declaração:

```
mysql> USE menagerie
Database changed
```

Seu banco de dados precisa ser criado apenas uma vez, mas você deve selecioná-lo para uso cada vez que iniciar uma sessão **mysql**. Você pode fazer isso emitindo uma declaração `USE` como mostrado no exemplo. Alternativamente, você pode selecionar o banco de dados na linha de comando quando invocar **mysql**. Basta especificar seu nome após quaisquer parâmetros de conexão que você possa precisar fornecer. Por exemplo:

```
$> mysql -h host -u user -p menagerie
Enter password: ********
```

Importante

`menagerie` no comando mostrado acima **não é** sua senha. Se você deseja fornecer sua senha na linha de comando após a opção `-p`, você deve fazê-lo sem espaço intermediário (por exemplo, como `-ppassword`, não como `-p password`). No entanto, colocar sua senha na linha de comando não é recomendado, pois isso a expõe a espiões de outros usuários conectados à sua máquina.

Nota

Você pode ver a qualquer momento qual banco de dados está selecionado atualmente usando `SELECT` `DATABASE()`.

### 5.3.2 Criando uma Tabela

Criar o banco de dados é a parte fácil, mas, neste momento, ele está vazio, como o `SHOW TABLES` lhe diz:

```
mysql> SHOW TABLES;
Empty set (0.00 sec)
```

A parte mais difícil é decidir qual deve ser a estrutura do seu banco de dados: quais tabelas você precisa e quais colunas devem estar em cada uma delas.

Você quer uma tabela que contenha um registro para cada um de seus animais de estimação. Isso pode ser chamado de tabela `pet`, e ela deve conter, como mínimo, o nome de cada animal. Como o nome por si só não é muito interessante, a tabela deve conter outras informações. Por exemplo, se mais de uma pessoa em sua família mantém animais de estimação, você pode querer listar o proprietário de cada animal. Você também pode querer registrar algumas informações descritivas básicas, como espécie e sexo.

E quanto à idade? Isso pode ser interessante, mas não é uma boa ideia armazená-la em um banco de dados. A idade muda com o passar do tempo, o que significa que você teria que atualizar seus registros com frequência. Em vez disso, é melhor armazenar um valor fixo, como a data de nascimento. Então, sempre que você precisar da idade, pode calcular a diferença entre a data atual e a data de nascimento. O MySQL oferece funções para realizar cálculos de data, então isso não é difícil. Armazenar a data de nascimento em vez da idade também tem outras vantagens:

* Você pode usar o banco de dados para tarefas como gerar lembretes para os próximos aniversários dos pets. (Se você acha que esse tipo de consulta é um tanto bobo, note que é a mesma pergunta que você pode fazer no contexto de um banco de dados de negócios para identificar clientes para os quais você precisa enviar saudações de aniversário na semana ou mês atual, para aquele toque pessoal assistido por computador.)

* Você pode calcular a idade em relação a datas diferentes da data atual. Por exemplo, se você armazenar a data de morte no banco de dados, você pode facilmente calcular quão velho um animal de estimação estava quando morreu.

Você provavelmente pode pensar em outros tipos de informações que seriam úteis na tabela `pet`, mas as identificadas até agora são suficientes: nome, proprietário, espécie, sexo, nascimento e morte.

Use uma declaração `CREATE TABLE` para especificar o layout da sua tabela:

```
mysql> CREATE TABLE pet (name VARCHAR(20), owner VARCHAR(20),
       species VARCHAR(20), sex CHAR(1), birth DATE, death DATE);
```

`VARCHAR` é uma boa escolha para as colunas `name`, `owner` e `species`, porque os valores das colunas variam em comprimento. Os comprimentos nessas definições de coluna não precisam ser todos iguais e não precisam ser `20`. Você pode normalmente escolher qualquer comprimento de `1` a `65535`, o que for mais razoável para você. Se você fizer uma escolha ruim e descobrir mais tarde que precisa de um campo mais longo, o MySQL fornece uma declaração [`ALTER TABLE`(alter-table.html "15.1.9 ALTER TABLE Statement")].

Vários tipos de valores podem ser escolhidos para representar o sexo em registros de animais, como `'m'` e `'f'`, ou talvez `'male'` e `'female'`. É mais simples usar os caracteres únicos `'m'` e `'f'`.

O uso do tipo de dados `DATE` para as colunas `birth` e `death` é uma escolha bastante óbvia.

Depois de criar uma tabela, `SHOW TABLES` (show-tables.html "15.7.7.39 SHOW TABLES Statement") deve produzir algum resultado:

```
mysql> SHOW TABLES;
+---------------------+
| Tables in menagerie |
+---------------------+
| pet                 |
+---------------------+
```

Para verificar se sua tabela foi criada conforme o esperado, use uma declaração `DESCRIBE`:

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

Você pode usar `DESCRIBE` a qualquer momento, por exemplo, se você esquecer os nomes das colunas em sua tabela ou quais tipos elas têm.

Para mais informações sobre os tipos de dados do MySQL, consulte o Capítulo 13, *Tipos de dados*.

### 5.3.3 Carregamento de dados em uma tabela

Depois de criar sua tabela, você precisa preenchê-la. As declarações `LOAD DATA` e `INSERT` são úteis para isso.

Suponha que seus registros de animais de estimação possam ser descritos como mostrado aqui. (Observe que o MySQL espera datas no formato `'YYYY-MM-DD'`; isso pode diferir do que você está acostumado.)

<table summary="Example of pet records mentioned in the preceding text."><col style="width: 10%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 05%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th scope="col">name</th> <th scope="col">owner</th> <th scope="col">species</th> <th scope="col">sex</th> <th scope="col">birth</th> <th scope="col">death</th> </tr></thead><tbody><tr> <th scope="row">Fluffy</th> <td>Harold</td> <td>cat</td> <td>f</td> <td>1993-02-04</td> <td></td> </tr><tr> <th scope="row">Claws</th> <td>Gwen</td> <td>cat</td> <td>m</td> <td>1994-03-17</td> <td></td> </tr><tr> <th scope="row">Buffy</th> <td>Harold</td> <td>dog</td> <td>f</td> <td>1989-05-13</td> <td></td> </tr><tr> <th scope="row">Fang</th> <td>Benny</td> <td>dog</td> <td>m</td> <td>1990-08-27</td> <td></td> </tr><tr> <th scope="row">Bowser</th> <td>Diane</td> <td>dog</td> <td>m</td> <td>1979-08-31</td> <td>1995-07-29</td> </tr><tr> <th scope="row">Chirpy</th> <td>Gwen</td> <td>bird</td> <td>f</td> <td>1998-09-11</td> <td></td> </tr><tr> <th scope="row">Whistler</th> <td>Gwen</td> <td>bird</td> <td></td> <td>1997-12-09</td> <td></td> </tr><tr> <th scope="row">Slim</th> <td>Benny</td> <td>snake</td> <td>m</td> <td>1996-04-29</td> <td></td> </tr></tbody></table>

Como você está começando com uma tabela vazia, uma maneira fácil de preencher é criar um arquivo de texto contendo uma linha para cada um dos seus animais, e depois carregar o conteúdo do arquivo na tabela com uma única declaração.

Você pode criar um arquivo de texto `pet.txt` contendo um registro por linha, com valores separados por tabs, e fornecendo-o na ordem em que as colunas foram listadas na declaração `CREATE TABLE`. Para valores ausentes (como sexos desconhecidos ou datas de morte de animais que ainda estão vivos), você pode usar os valores de `NULL`. Para representá-los em seu arquivo de texto, use `\N` (barra invertida, N maiúsculo). Por exemplo, o registro para Whistler, o pássaro, ficaria assim (onde o espaço em branco entre os valores é um único caractere de tabulação):

```
Whistler        Gwen    bird    \N      1997-12-09      \N
```

Para carregar o arquivo de texto `pet.txt` na tabela `pet`, use esta declaração:

```
mysql> LOAD DATA LOCAL INFILE '/path/pet.txt' INTO TABLE pet;
```

Se você criou o arquivo no Windows com um editor que usa `\r\n` como terminador de linha, você deve usar esta declaração em vez disso:

```
mysql> LOAD DATA LOCAL INFILE '/path/pet.txt' INTO TABLE pet
       LINES TERMINATED BY '\r\n';
```

(Em uma máquina Apple com macOS, você provavelmente vai querer usar `LINES TERMINATED BY '\r'`.

Você pode especificar o separador de valor da coluna e o marcador de fim de linha explicitamente na declaração `LOAD DATA`(load-data.html "15.2.9 LOAD DATA Statement"), se desejar, mas os padrões são tabulação e retorno de linha. Estes são suficientes para que a declaração leia o arquivo `pet.txt` corretamente.

Se a declaração falhar, é provável que sua instalação do MySQL não tenha a capacidade de arquivo local habilitada por padrão. Consulte a Seção 8.1.6, “Considerações de segurança para LOAD DATA LOCAL”, para obter informações sobre como alterar isso.

Quando você deseja adicionar novos registros um de cada vez, a declaração `INSERT` é útil. Na sua forma mais simples, você fornece valores para cada coluna, na ordem em que as colunas foram listadas na declaração `CREATE TABLE`. Suponha que Diane adquira um novo hamster chamado “Puffball”. Você poderia adicionar um novo registro usando uma declaração `INSERT` como esta:

```
mysql> INSERT INTO pet
       VALUES ('Puffball','Diane','hamster','f','1999-03-30',NULL);
```

Os valores de cadeia e data são especificados como cadeias de caracteres citadas aqui. Além disso, com `INSERT`, você pode inserir `NULL` diretamente para representar um valor ausente. Você não usa `\N` como você faz com `LOAD DATA`.

Com este exemplo, você deve ser capaz de perceber que haveria muito mais digitação envolvida para carregar seus registros inicialmente usando várias declarações `INSERT` em vez de uma única declaração `LOAD DATA`.

### 5.3.4 Recuperação de informações de uma tabela

A declaração `SELECT` é usada para extrair informações de uma tabela. A forma geral da declaração é:

```
SELECT what_to_select
FROM which_table
WHERE conditions_to_satisfy;
```

*`what_to_select`* indica o que você deseja ver. Isso pode ser uma lista de colunas, ou `*` para indicar “todas as colunas”. *`which_table`* indica a tabela a partir da qual você deseja recuperar dados. A cláusula `WHERE` é opcional. Se estiver presente, *`conditions_to_satisfy`* especifica uma ou mais condições que as linhas devem satisfazer para se qualificar para recuperação.

#### 5.3.4.1 Selecionando todos os dados

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

Este formulário de `SELECT` utiliza `*`, que é uma abreviação para “selecionar todas as colunas”. Isso é útil se você quiser revisar toda a tabela, por exemplo, depois de ter carregado apenas seu conjunto de dados inicial. Por exemplo, você pode pensar que a data de nascimento de Bowser não parece certa. Consultando seus papéis originais de pedigree, você descobre que o ano correto de nascimento deve ser 1989, não 1979.

Existem pelo menos duas maneiras de corrigir isso:

* Editar o arquivo `pet.txt` para corrigir o erro, em seguida, esvazie a tabela e recarregue-a usando `DELETE` e `LOAD DATA`:

  ```
  mysql> DELETE FROM pet;
  mysql> LOAD DATA LOCAL INFILE 'pet.txt' INTO TABLE pet;
  ```

No entanto, se você fizer isso, também deve redigitar o registro para Puffball.

* Considere corrigir apenas o registro errôneo com uma declaração `UPDATE`:

  ```
  mysql> UPDATE pet SET birth = '1989-08-31' WHERE name = 'Bowser';
  ```

As alterações do `UPDATE` apenas alteram o registro em questão e não exige que você recarregue a tabela.

Há uma exceção ao princípio de que `SELECT *` seleciona todas as colunas. Se uma tabela contiver colunas invisíveis, `*` não as inclui. Para mais informações, consulte a Seção 15.1.20.10, “Colunas invisíveis”.

#### 5.3.4.2 Selecionando Linhas Específicas

Como mostrado na seção anterior, é fácil recuperar uma tabela inteira. Basta omitir a cláusula `WHERE` da declaração `SELECT`. Mas, normalmente, você não quer ver a tabela inteira, especialmente quando ela se torna grande. Em vez disso, você geralmente está mais interessado em responder a uma pergunta específica, caso em que você especifica algumas restrições sobre as informações que você deseja. Vamos analisar algumas consultas de seleção em termos de perguntas sobre seus animais de estimação que elas respondem.

Você pode selecionar apenas determinadas linhas da sua tabela. Por exemplo, se você deseja verificar a alteração que você fez na data de nascimento de Bowser, selecione o registro de Bowser da seguinte forma:

```
mysql> SELECT * FROM pet WHERE name = 'Bowser';
+--------+-------+---------+------+------------+------------+
| name   | owner | species | sex  | birth      | death      |
+--------+-------+---------+------+------------+------------+
| Bowser | Diane | dog     | m    | 1989-08-31 | 1995-07-29 |
+--------+-------+---------+------+------------+------------+
```

A saída confirma que o ano está corretamente registrado como 1989, não 1979.

As comparações de strings normalmente são insensíveis ao caso, então você pode especificar o nome como `'bowser'`, `'BOWSER'`, e assim por diante. O resultado da consulta é o mesmo.

Você pode especificar condições em qualquer coluna, não apenas a `name`. Por exemplo, se você quiser saber quais animais nasceram durante ou após 1998, teste a coluna `birth`:

```
mysql> SELECT * FROM pet WHERE birth >= '1998-1-1';
+----------+-------+---------+------+------------+-------+
| name     | owner | species | sex  | birth      | death |
+----------+-------+---------+------+------------+-------+
| Chirpy   | Gwen  | bird    | f    | 1998-09-11 | NULL  |
| Puffball | Diane | hamster | f    | 1999-03-30 | NULL  |
+----------+-------+---------+------+------------+-------+
```

Você pode combinar condições, por exemplo, para localizar cães fêmeas:

```
mysql> SELECT * FROM pet WHERE species = 'dog' AND sex = 'f';
+-------+--------+---------+------+------------+-------+
| name  | owner  | species | sex  | birth      | death |
+-------+--------+---------+------+------------+-------+
| Buffy | Harold | dog     | f    | 1989-05-13 | NULL  |
+-------+--------+---------+------+------------+-------+
```

A consulta anterior utiliza o operador lógico `AND`. Há também um operador `OR`:

```
mysql> SELECT * FROM pet WHERE species = 'snake' OR species = 'bird';
+----------+-------+---------+------+------------+-------+
| name     | owner | species | sex  | birth      | death |
+----------+-------+---------+------+------------+-------+
| Chirpy   | Gwen  | bird    | f    | 1998-09-11 | NULL  |
| Whistler | Gwen  | bird    | NULL | 1997-12-09 | NULL  |
| Slim     | Benny | snake   | m    | 1996-04-29 | NULL  |
+----------+-------+---------+------+------------+-------+
```

`AND` e `OR` podem ser misturados, embora `AND` tenha precedência maior do que `OR`. Se você estiver usando ambos os operadores, é uma boa ideia usar parênteses para indicar explicitamente como as condições devem ser agrupadas:

```
mysql> SELECT * FROM pet WHERE (species = 'cat' AND sex = 'm')
       OR (species = 'dog' AND sex = 'f');
+-------+--------+---------+------+------------+-------+
| name  | owner  | species | sex  | birth      | death |
+-------+--------+---------+------+------------+-------+
| Claws | Gwen   | cat     | m    | 1994-03-17 | NULL  |
| Buffy | Harold | dog     | f    | 1989-05-13 | NULL  |
+-------+--------+---------+------+------------+-------+
```

#### 5.3.4.3 Selecionando Colunas Específicas

Se você não quiser ver linhas inteiras da sua tabela, basta nomear as colunas nas quais você está interessado, separadas por vírgulas. Por exemplo, se você quiser saber quando seus animais nasceram, selecione as colunas `name` e `birth`:

```
mysql> SELECT name, birth FROM pet;
+----------+------------+
| name     | birth      |
+----------+------------+
| Fluffy   | 1993-02-04 |
| Claws    | 1994-03-17 |
| Buffy    | 1989-05-13 |
| Fang     | 1990-08-27 |
| Bowser   | 1989-08-31 |
| Chirpy   | 1998-09-11 |
| Whistler | 1997-12-09 |
| Slim     | 1996-04-29 |
| Puffball | 1999-03-30 |
+----------+------------+
```

Para descobrir quem possui animais de estimação, use esta consulta:

```
mysql> SELECT owner FROM pet;
+--------+
| owner  |
+--------+
| Harold |
| Gwen   |
| Harold |
| Benny  |
| Diane  |
| Gwen   |
| Gwen   |
| Benny  |
| Diane  |
+--------+
```

Observe que a consulta simplesmente recupera a coluna `owner` de cada registro, e alguns deles aparecem mais de uma vez. Para minimizar a saída, retorne cada registro de saída único apenas uma vez, adicionando a palavra-chave `DISTINCT`:

```
mysql> SELECT DISTINCT owner FROM pet;
+--------+
| owner  |
+--------+
| Benny  |
| Diane  |
| Gwen   |
| Harold |
+--------+
```

Você pode usar uma cláusula `WHERE` para combinar a seleção de linha com a seleção de coluna. Por exemplo, para obter datas de nascimento apenas de cães e gatos, use esta consulta:

```
mysql> SELECT name, species, birth FROM pet
       WHERE species = 'dog' OR species = 'cat';
+--------+---------+------------+
| name   | species | birth      |
+--------+---------+------------+
| Fluffy | cat     | 1993-02-04 |
| Claws  | cat     | 1994-03-17 |
| Buffy  | dog     | 1989-05-13 |
| Fang   | dog     | 1990-08-27 |
| Bowser | dog     | 1989-08-31 |
+--------+---------+------------+
```

#### 5.3.4.4 Ordenação de Linhas

Você pode ter notado nos exemplos anteriores que as linhas de resultado são exibidas sem ordem específica. É muitas vezes mais fácil examinar a saída da consulta quando as linhas são ordenadas de alguma maneira significativa. Para ordenar um resultado, use uma cláusula `ORDER BY`.

Aqui estão os aniversários dos animais, classificados por data:

```
mysql> SELECT name, birth FROM pet ORDER BY birth;
+----------+------------+
| name     | birth      |
+----------+------------+
| Buffy    | 1989-05-13 |
| Bowser   | 1989-08-31 |
| Fang     | 1990-08-27 |
| Fluffy   | 1993-02-04 |
| Claws    | 1994-03-17 |
| Slim     | 1996-04-29 |
| Whistler | 1997-12-09 |
| Chirpy   | 1998-09-11 |
| Puffball | 1999-03-30 |
+----------+------------+
```

Em colunas de tipo de personagem, a classificação, como todas as outras operações de comparação, é normalmente realizada de forma não sensível ao caso. Isso significa que a ordem é indefinida para colunas que são idênticas, exceto por sua grafia. Você pode forçar uma classificação sensível ao caso para uma coluna usando `BINARY` da seguinte forma: `ORDER BY BINARY col_name`.

O padrão de ordem de classificação é ascendente, com os menores valores em primeiro lugar. Para classificar em ordem inversa (descendente), adicione a palavra-chave `DESC` ao nome da coluna que você está classificando:

```
mysql> SELECT name, birth FROM pet ORDER BY birth DESC;
+----------+------------+
| name     | birth      |
+----------+------------+
| Puffball | 1999-03-30 |
| Chirpy   | 1998-09-11 |
| Whistler | 1997-12-09 |
| Slim     | 1996-04-29 |
| Claws    | 1994-03-17 |
| Fluffy   | 1993-02-04 |
| Fang     | 1990-08-27 |
| Bowser   | 1989-08-31 |
| Buffy    | 1989-05-13 |
+----------+------------+
```

Você pode ordenar em várias colunas e pode ordenar diferentes colunas em direções diferentes. Por exemplo, para ordenar por tipo de animal em ordem crescente, em seguida, por data de nascimento dentro do tipo de animal em ordem decrescente (animais mais jovens primeiro), use a seguinte consulta:

```
mysql> SELECT name, species, birth FROM pet
       ORDER BY species, birth DESC;
+----------+---------+------------+
| name     | species | birth      |
+----------+---------+------------+
| Chirpy   | bird    | 1998-09-11 |
| Whistler | bird    | 1997-12-09 |
| Claws    | cat     | 1994-03-17 |
| Fluffy   | cat     | 1993-02-04 |
| Fang     | dog     | 1990-08-27 |
| Bowser   | dog     | 1989-08-31 |
| Buffy    | dog     | 1989-05-13 |
| Puffball | hamster | 1999-03-30 |
| Slim     | snake   | 1996-04-29 |
+----------+---------+------------+
```

A palavra-chave `DESC` se aplica apenas ao nome da coluna imediatamente anterior a ela (`birth`); ela não afeta a ordem de classificação da coluna `species`.

#### 5.3.4.5 Cálculos de data

O MySQL oferece várias funções que você pode usar para realizar cálculos em datas, por exemplo, para calcular idades ou extrair partes de datas.

Para determinar quantos anos cada um dos seus animais de estimação tem, use a função `TIMESTAMPDIFF()`. Seus argumentos são a unidade na qual você deseja que o resultado seja expresso e as duas datas para as quais se deve calcular a diferença. A consulta a seguir mostra, para cada animal de estimação, a data de nascimento, a data atual e a idade em anos. Uma *alias* (`age`) é usada para tornar a etiqueta da coluna de saída final mais significativa.

```
mysql> SELECT name, birth, CURDATE(),
       TIMESTAMPDIFF(YEAR,birth,CURDATE()) AS age
       FROM pet;
+----------+------------+------------+------+
| name     | birth      | CURDATE()  | age  |
+----------+------------+------------+------+
| Fluffy   | 1993-02-04 | 2003-08-19 |   10 |
| Claws    | 1994-03-17 | 2003-08-19 |    9 |
| Buffy    | 1989-05-13 | 2003-08-19 |   14 |
| Fang     | 1990-08-27 | 2003-08-19 |   12 |
| Bowser   | 1989-08-31 | 2003-08-19 |   13 |
| Chirpy   | 1998-09-11 | 2003-08-19 |    4 |
| Whistler | 1997-12-09 | 2003-08-19 |    5 |
| Slim     | 1996-04-29 | 2003-08-19 |    7 |
| Puffball | 1999-03-30 | 2003-08-19 |    4 |
+----------+------------+------------+------+
```

A consulta funciona, mas o resultado poderia ser analisado mais facilmente se as linhas fossem apresentadas em algum tipo de ordem. Isso pode ser feito adicionando uma cláusula `ORDER BY name` para ordenar a saída por nome:

```
mysql> SELECT name, birth, CURDATE(),
       TIMESTAMPDIFF(YEAR,birth,CURDATE()) AS age
       FROM pet ORDER BY name;
+----------+------------+------------+------+
| name     | birth      | CURDATE()  | age  |
+----------+------------+------------+------+
| Bowser   | 1989-08-31 | 2003-08-19 |   13 |
| Buffy    | 1989-05-13 | 2003-08-19 |   14 |
| Chirpy   | 1998-09-11 | 2003-08-19 |    4 |
| Claws    | 1994-03-17 | 2003-08-19 |    9 |
| Fang     | 1990-08-27 | 2003-08-19 |   12 |
| Fluffy   | 1993-02-04 | 2003-08-19 |   10 |
| Puffball | 1999-03-30 | 2003-08-19 |    4 |
| Slim     | 1996-04-29 | 2003-08-19 |    7 |
| Whistler | 1997-12-09 | 2003-08-19 |    5 |
+----------+------------+------------+------+
```

Para ordenar a saída por `age` em vez de `name`, basta usar uma cláusula diferente de `ORDER BY`:

```
mysql> SELECT name, birth, CURDATE(),
       TIMESTAMPDIFF(YEAR,birth,CURDATE()) AS age
       FROM pet ORDER BY age;
+----------+------------+------------+------+
| name     | birth      | CURDATE()  | age  |
+----------+------------+------------+------+
| Chirpy   | 1998-09-11 | 2003-08-19 |    4 |
| Puffball | 1999-03-30 | 2003-08-19 |    4 |
| Whistler | 1997-12-09 | 2003-08-19 |    5 |
| Slim     | 1996-04-29 | 2003-08-19 |    7 |
| Claws    | 1994-03-17 | 2003-08-19 |    9 |
| Fluffy   | 1993-02-04 | 2003-08-19 |   10 |
| Fang     | 1990-08-27 | 2003-08-19 |   12 |
| Bowser   | 1989-08-31 | 2003-08-19 |   13 |
| Buffy    | 1989-05-13 | 2003-08-19 |   14 |
+----------+------------+------------+------+
```

Uma consulta semelhante pode ser usada para determinar a idade na morte de animais que morreram. Você determina quais são esses animais, verificando se o valor `death` é `NULL`. Em seguida, para aqueles com valores não `NULL`, calcule a diferença entre os valores `death` e `birth`:

```
mysql> SELECT name, birth, death,
       TIMESTAMPDIFF(YEAR,birth,death) AS age
       FROM pet WHERE death IS NOT NULL ORDER BY age;
+--------+------------+------------+------+
| name   | birth      | death      | age  |
+--------+------------+------------+------+
| Bowser | 1989-08-31 | 1995-07-29 |    5 |
+--------+------------+------------+------+
```

A consulta utiliza `death IS NOT NULL` em vez de `death <> NULL`, porque `NULL` é um valor especial que não pode ser comparado usando os operadores de comparação usuais. Isso é discutido mais adiante. Veja a Seção 5.3.4.6, “Trabalhando com Valores NULL”.

E se você quiser saber quais animais têm aniversários no próximo mês? Para esse tipo de cálculo, ano e dia são irrelevantes; você simplesmente quer extrair a parte do mês da coluna `birth`. O MySQL fornece várias funções para extrair partes de datas, como `YEAR()`, `MONTH()` e `DAYOFMONTH()`. `MONTH()` é a função apropriada aqui. Para ver como funciona, execute uma consulta simples que exiba o valor de ambos `birth` e `MONTH(birth)`:

```
mysql> SELECT name, birth, MONTH(birth) FROM pet;
+----------+------------+--------------+
| name     | birth      | MONTH(birth) |
+----------+------------+--------------+
| Fluffy   | 1993-02-04 |            2 |
| Claws    | 1994-03-17 |            3 |
| Buffy    | 1989-05-13 |            5 |
| Fang     | 1990-08-27 |            8 |
| Bowser   | 1989-08-31 |            8 |
| Chirpy   | 1998-09-11 |            9 |
| Whistler | 1997-12-09 |           12 |
| Slim     | 1996-04-29 |            4 |
| Puffball | 1999-03-30 |            3 |
+----------+------------+--------------+
```

Encontrar animais com aniversários no mês a seguir também é simples. Suponha que o mês atual seja abril. Então, o valor do mês é `4` e você pode procurar animais nascidos em maio (mês `5`) da seguinte forma:

```
mysql> SELECT name, birth FROM pet WHERE MONTH(birth) = 5;
+-------+------------+
| name  | birth      |
+-------+------------+
| Buffy | 1989-05-13 |
+-------+------------+
```

Há uma pequena complicação se o mês atual for dezembro. Não basta adicionar um ao número do mês (`12`) e procurar por animais nascidos no mês `13`, porque não existe tal mês. Em vez disso, você procura por animais nascidos em janeiro (mês `1`).

Você pode escrever a consulta para que ela funcione independentemente do mês atual, para que você não precise usar o número para um mês específico. `DATE_ADD()` permite que você adicione um intervalo de tempo a uma data dada. Se você adicionar um mês ao valor de `CURDATE()`, então extraia a parte do mês com `MONTH()`, o resultado produz o mês em que procurar por aniversários:

```
mysql> SELECT name, birth FROM pet
       WHERE MONTH(birth) = MONTH(DATE_ADD(CURDATE(),INTERVAL 1 MONTH));
```

Uma maneira diferente de realizar a mesma tarefa é adicionar `1` para obter o próximo mês após o atual, após usar a função módulo (`MOD`) para embalar o valor do mês para `0`, se ele estiver atualmente em `12`:

```
mysql> SELECT name, birth FROM pet
       WHERE MONTH(birth) = MOD(MONTH(CURDATE()), 12) + 1;
```

`MONTH()` retorna um número entre `1` e `12`. E `MOD(something,12)` retorna um número entre `0` e `11`. Portanto, a adição deve ser após o `MOD()`, caso contrário, iremos de novembro (`11`) a janeiro (`1`).

Se um cálculo utilizar datas inválidas, o cálculo falha e produz avisos:

```
mysql> SELECT '2018-10-31' + INTERVAL 1 DAY;
+-------------------------------+
| '2018-10-31' + INTERVAL 1 DAY |
+-------------------------------+
| 2018-11-01                    |
+-------------------------------+
mysql> SELECT '2018-10-32' + INTERVAL 1 DAY;
+-------------------------------+
| '2018-10-32' + INTERVAL 1 DAY |
+-------------------------------+
| NULL                          |
+-------------------------------+
mysql> SHOW WARNINGS;
+---------+------+----------------------------------------+
| Level   | Code | Message                                |
+---------+------+----------------------------------------+
| Warning | 1292 | Incorrect datetime value: '2018-10-32' |
+---------+------+----------------------------------------+
```

#### 5.3.4.6 Trabalhando com valores NULL

O valor `NULL` pode ser surpreendente até que você se acostume com ele. Conceitualmente, `NULL` significa “um valor desconhecido ausente” e é tratado de maneira um pouco diferente dos outros valores.

Para testar o `NULL`, use os operadores `IS NULL` e [`IS NOT NULL`](comparison-operators.html#operator_is-not-null) como mostrado aqui:

```
mysql> SELECT 1 IS NULL, 1 IS NOT NULL;
+-----------+---------------+
| 1 IS NULL | 1 IS NOT NULL |
+-----------+---------------+
|         0 |             1 |
+-----------+---------------+
```

Você não pode usar operadores de comparação aritmética, como `=`, `<` ou `<>`, para testar `NULL`. Para demonstrar isso por si mesmo, tente a seguinte consulta:

```
mysql> SELECT 1 = NULL, 1 <> NULL, 1 < NULL, 1 > NULL;
+----------+-----------+----------+----------+
| 1 = NULL | 1 <> NULL | 1 < NULL | 1 > NULL |
+----------+-----------+----------+----------+
|     NULL |      NULL |     NULL |     NULL |
+----------+-----------+----------+----------+
```

Como o resultado de qualquer comparação aritmética com `NULL` também é `NULL`, não é possível obter resultados significativos a partir dessas comparações.

Em MySQL, `0` ou `NULL` significa falso e qualquer outra coisa significa verdadeiro. O valor de verdade padrão de uma operação booleana é `1`.

Esse tratamento especial do `NULL` é o motivo pelo qual, na seção anterior, foi necessário determinar quais animais não estão mais vivos usando `death IS NOT NULL` em vez de `death <> NULL`.

Dois valores de `NULL` são considerados iguais em um `GROUP BY`.

Ao realizar um `ORDER BY`, os valores de `NULL` são apresentados primeiro se você realizar o `ORDER BY ... ASC` e por último se você realizar o `ORDER BY ... DESC`.

Um erro comum ao trabalhar com `NULL` é assumir que não é possível inserir um zero ou uma string vazia em uma coluna definida como `NOT NULL`, mas isso não é o caso. Esses são, na verdade, valores, enquanto `NULL` significa “não tendo um valor”. Você pode testar isso facilmente usando `IS [NOT] NULL` como mostrado:

```
mysql> SELECT 0 IS NULL, 0 IS NOT NULL, '' IS NULL, '' IS NOT NULL;
+-----------+---------------+------------+----------------+
| 0 IS NULL | 0 IS NOT NULL | '' IS NULL | '' IS NOT NULL |
+-----------+---------------+------------+----------------+
|         0 |             1 |          0 |              1 |
+-----------+---------------+------------+----------------+
```

Assim, é perfeitamente possível inserir um zero ou uma string vazia em uma coluna `NOT NULL`, pois essas são, na verdade, `NOT NULL`. Veja a Seção B.3.4.3, “Problemas com valores NULL”.

#### 5.3.4.7 Contagem de Padrões

O MySQL oferece padrões de correspondência padrão SQL, bem como uma forma de correspondência de padrões baseada em expressões regulares extensas, semelhantes às utilizadas por utilitários Unix, como **vi**, **grep** e **sed**.

O rastreamento de padrões SQL permite que você use `_` para corresponder a qualquer caractere único e `%` para corresponder a um número arbitrário de caracteres (incluindo zero caracteres). No MySQL, os padrões SQL são sensíveis ao caso por padrão. Alguns exemplos são mostrados aqui. Não use `=` ou `<>` quando usar padrões SQL. Use os operadores de comparação `LIKE` ou `NOT LIKE` em vez disso.

Para encontrar nomes que começam com `b`:

```
mysql> SELECT * FROM pet WHERE name LIKE 'b%';
+--------+--------+---------+------+------------+------------+
| name   | owner  | species | sex  | birth      | death      |
+--------+--------+---------+------+------------+------------+
| Buffy  | Harold | dog     | f    | 1989-05-13 | NULL       |
| Bowser | Diane  | dog     | m    | 1989-08-31 | 1995-07-29 |
+--------+--------+---------+------+------------+------------+
```

Para encontrar nomes que terminem com `fy`:

```
mysql> SELECT * FROM pet WHERE name LIKE '%fy';
+--------+--------+---------+------+------------+-------+
| name   | owner  | species | sex  | birth      | death |
+--------+--------+---------+------+------------+-------+
| Fluffy | Harold | cat     | f    | 1993-02-04 | NULL  |
| Buffy  | Harold | dog     | f    | 1989-05-13 | NULL  |
+--------+--------+---------+------+------------+-------+
```

Para encontrar nomes que contenham um `w`:

```
mysql> SELECT * FROM pet WHERE name LIKE '%w%';
+----------+-------+---------+------+------------+------------+
| name     | owner | species | sex  | birth      | death      |
+----------+-------+---------+------+------------+------------+
| Claws    | Gwen  | cat     | m    | 1994-03-17 | NULL       |
| Bowser   | Diane | dog     | m    | 1989-08-31 | 1995-07-29 |
| Whistler | Gwen  | bird    | NULL | 1997-12-09 | NULL       |
+----------+-------+---------+------+------------+------------+
```

Para encontrar nomes que contenham exatamente cinco caracteres, use cinco instâncias do caractere do padrão `_`:

```
mysql> SELECT * FROM pet WHERE name LIKE '_____';
+-------+--------+---------+------+------------+-------+
| name  | owner  | species | sex  | birth      | death |
+-------+--------+---------+------+------------+-------+
| Claws | Gwen   | cat     | m    | 1994-03-17 | NULL  |
| Buffy | Harold | dog     | f    | 1989-05-13 | NULL  |
+-------+--------+---------+------+------------+-------+
```

O outro tipo de correspondência de padrões fornecido pelo MySQL utiliza expressões regulares extensas. Quando você testa uma correspondência para este tipo de padrão, use a função `REGEXP_LIKE()` (ou os operadores `REGEXP` ou `RLIKE`, que são sinônimos de `REGEXP_LIKE()`).

A lista a seguir descreve algumas características das expressões regulares estendidas:

* `.` corresponde a qualquer caracter único.
* A classe de caracteres `[...]` corresponde a qualquer caracter dentro dos colchetes. Por exemplo, `[abc]` corresponde a `a`, `b` ou `c`. Para nomear uma faixa de caracteres, use uma barra. `[a-z]` corresponde a qualquer letra, enquanto `[0-9]` corresponde a qualquer dígito.

* `*` corresponde a zero ou mais instâncias da coisa que o precede. Por exemplo, `x*` corresponde a qualquer número de caracteres `x`, `[0-9]*` corresponde a qualquer número de dígitos e `.*` corresponde a qualquer número de qualquer coisa.

* Uma correspondência com um padrão de expressão regular é bem-sucedida se o padrão corresponder em qualquer lugar no valor que está sendo testado. (Isso difere de uma correspondência com um padrão `LIKE`, que é bem-sucedida apenas se o padrão corresponder ao valor inteiro.)

* Para ancorar um padrão de modo que ele deva corresponder ao início ou ao fim do valor que está sendo testado, use `^` no início ou `$` no fim do padrão.

Para demonstrar como as expressões regulares extensas funcionam, as consultas `LIKE` mostradas anteriormente são reescritas aqui para usar `REGEXP_LIKE()`.

Para encontrar nomes que comecem com `b`, use `^` para corresponder ao início do nome:

```
mysql> SELECT * FROM pet WHERE REGEXP_LIKE(name, '^b');
+--------+--------+---------+------+------------+------------+
| name   | owner  | species | sex  | birth      | death      |
+--------+--------+---------+------+------------+------------+
| Buffy  | Harold | dog     | f    | 1989-05-13 | NULL       |
| Bowser | Diane  | dog     | m    | 1979-08-31 | 1995-07-29 |
+--------+--------+---------+------+------------+------------+
```

Para forçar uma comparação de expressão regular a ser sensível ao caso, use uma ordenação sensível ao caso, ou use a palavra-chave `BINARY` para tornar uma das cadeias de caracteres uma cadeia binária, ou especifique o caractere de controle de correspondência `c`. Cada uma dessas consultas corresponde apenas a `b` minúsculas no início de um nome:

```
SELECT * FROM pet WHERE REGEXP_LIKE(name, '^b' COLLATE utf8mb4_0900_as_cs);
SELECT * FROM pet WHERE REGEXP_LIKE(name, BINARY '^b');
SELECT * FROM pet WHERE REGEXP_LIKE(name, '^b', 'c');
```

Para encontrar nomes que terminem com `fy`, use `$` para corresponder ao final do nome:

```
mysql> SELECT * FROM pet WHERE REGEXP_LIKE(name, 'fy$');
+--------+--------+---------+------+------------+-------+
| name   | owner  | species | sex  | birth      | death |
+--------+--------+---------+------+------------+-------+
| Fluffy | Harold | cat     | f    | 1993-02-04 | NULL  |
| Buffy  | Harold | dog     | f    | 1989-05-13 | NULL  |
+--------+--------+---------+------+------------+-------+
```

Para encontrar nomes que contenham `w`, use esta consulta:

```
mysql> SELECT * FROM pet WHERE REGEXP_LIKE(name, 'w');
+----------+-------+---------+------+------------+------------+
| name     | owner | species | sex  | birth      | death      |
+----------+-------+---------+------+------------+------------+
| Claws    | Gwen  | cat     | m    | 1994-03-17 | NULL       |
| Bowser   | Diane | dog     | m    | 1989-08-31 | 1995-07-29 |
| Whistler | Gwen  | bird    | NULL | 1997-12-09 | NULL       |
+----------+-------+---------+------+------------+------------+
```

Como um padrão de expressão regular corresponde se ocorrer em qualquer lugar no valor, não é necessário colocar um caractere curinga em qualquer lado do padrão na consulta anterior para que ele corresponda ao valor inteiro, como seria verdadeiro com um padrão SQL.

Para encontrar nomes que contenham exatamente cinco caracteres, use `^` e `$` para corresponder ao início e ao fim do nome, e cinco instâncias de `.` entre eles:

```
mysql> SELECT * FROM pet WHERE REGEXP_LIKE(name, '^.....$');
+-------+--------+---------+------+------------+-------+
| name  | owner  | species | sex  | birth      | death |
+-------+--------+---------+------+------------+-------+
| Claws | Gwen   | cat     | m    | 1994-03-17 | NULL  |
| Buffy | Harold | dog     | f    | 1989-05-13 | NULL  |
+-------+--------+---------+------+------------+-------+
```

Você também pode escrever a consulta anterior usando o operador `{n}` (“repetir-*`n`*-vezes”):

```
mysql> SELECT * FROM pet WHERE REGEXP_LIKE(name, '^.{5}$');
+-------+--------+---------+------+------------+-------+
| name  | owner  | species | sex  | birth      | death |
+-------+--------+---------+------+------------+-------+
| Claws | Gwen   | cat     | m    | 1994-03-17 | NULL  |
| Buffy | Harold | dog     | f    | 1989-05-13 | NULL  |
+-------+--------+---------+------+------------+-------+
```

Para mais informações sobre a sintaxe de expressões regulares, consulte a Seção 14.8.2, “Expressões Regulares”.

#### 5.3.4.8 Contagem de Linhas

Os bancos de dados são frequentemente usados para responder à pergunta: “Com que frequência um determinado tipo de dado ocorre em uma tabela?” Por exemplo, você pode querer saber quantos animais de estimação você tem, ou quantos animais de estimação cada proprietário tem, ou você pode querer realizar vários tipos de operações de censo em seus animais.

Contar o número total de animais que você tem é a mesma pergunta que "Quantas linhas estão na tabela `pet`?", porque há um registro por animal. `COUNT(*)` conta o número de linhas, então a consulta para contar seus animais parece assim:

```
mysql> SELECT COUNT(*) FROM pet;
+----------+
| COUNT(*) |
+----------+
|        9 |
+----------+
```

Anteriormente, você recuperou os nomes das pessoas que possuíam animais de estimação. Você pode usar `COUNT()` se quiser descobrir quantos animais de estimação cada proprietário tem:

```
mysql> SELECT owner, COUNT(*) FROM pet GROUP BY owner;
+--------+----------+
| owner  | COUNT(*) |
+--------+----------+
| Benny  |        2 |
| Diane  |        2 |
| Gwen   |        3 |
| Harold |        2 |
+--------+----------+
```

A consulta anterior utiliza `GROUP BY` para agrupar todos os registros para cada `owner`. O uso de `COUNT()` em conjunto com `GROUP BY` é útil para caracterizar seus dados sob vários agrupamentos. Os exemplos a seguir mostram diferentes maneiras de realizar operações de censo de animais.

Número de animais por espécie:

```
mysql> SELECT species, COUNT(*) FROM pet GROUP BY species;
+---------+----------+
| species | COUNT(*) |
+---------+----------+
| bird    |        2 |
| cat     |        2 |
| dog     |        3 |
| hamster |        1 |
| snake   |        1 |
+---------+----------+
```

Número de animais por sexo:

```
mysql> SELECT sex, COUNT(*) FROM pet GROUP BY sex;
+------+----------+
| sex  | COUNT(*) |
+------+----------+
| NULL |        1 |
| f    |        4 |
| m    |        4 |
+------+----------+
```

(Neste resultado, `NULL` indica que o sexo é desconhecido.)

Número de animais por combinação de espécies e sexo:

```
mysql> SELECT species, sex, COUNT(*) FROM pet GROUP BY species, sex;
+---------+------+----------+
| species | sex  | COUNT(*) |
+---------+------+----------+
| bird    | NULL |        1 |
| bird    | f    |        1 |
| cat     | f    |        1 |
| cat     | m    |        1 |
| dog     | f    |        1 |
| dog     | m    |        2 |
| hamster | f    |        1 |
| snake   | m    |        1 |
+---------+------+----------+
```

Você não precisa recuperar uma tabela inteira quando usa `COUNT()`. Por exemplo, a consulta anterior, quando realizada apenas em cães e gatos, parece assim:

```
mysql> SELECT species, sex, COUNT(*) FROM pet
       WHERE species = 'dog' OR species = 'cat'
       GROUP BY species, sex;
+---------+------+----------+
| species | sex  | COUNT(*) |
+---------+------+----------+
| cat     | f    |        1 |
| cat     | m    |        1 |
| dog     | f    |        1 |
| dog     | m    |        2 |
+---------+------+----------+
```

Ou, se você quisesse o número de animais por sexo apenas para animais cujos sexos são conhecidos:

```
mysql> SELECT species, sex, COUNT(*) FROM pet
       WHERE sex IS NOT NULL
       GROUP BY species, sex;
+---------+------+----------+
| species | sex  | COUNT(*) |
+---------+------+----------+
| bird    | f    |        1 |
| cat     | f    |        1 |
| cat     | m    |        1 |
| dog     | f    |        1 |
| dog     | m    |        2 |
| hamster | f    |        1 |
| snake   | m    |        1 |
+---------+------+----------+
```

Se você nomear colunas para selecionar além do valor `COUNT()`, uma cláusula `GROUP BY` deve estar presente que nomeie as mesmas colunas. Caso contrário, o seguinte ocorre:

* Se o modo SQL `ONLY_FULL_GROUP_BY` estiver habilitado, ocorrerá um erro:

  ```
  mysql> SET sql_mode = 'ONLY_FULL_GROUP_BY';
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT owner, COUNT(*) FROM pet;
  ERROR 1140 (42000): In aggregated query without GROUP BY, expression
  #1 of SELECT list contains nonaggregated column 'menagerie.pet.owner';
  this is incompatible with sql_mode=only_full_group_by
  ```

* Se `ONLY_FULL_GROUP_BY` não estiver habilitado, a consulta é processada tratando todas as linhas como um único grupo, mas o valor selecionado para cada coluna nomeada é não determinístico. O servidor é livre para selecionar o valor de qualquer linha:

  ```
  mysql> SET sql_mode = '';
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT owner, COUNT(*) FROM pet;
  +--------+----------+
  | owner  | COUNT(*) |
  +--------+----------+
  | Harold |        8 |
  +--------+----------+
  1 row in set (0.00 sec)
  ```

Veja também a Seção 14.19.3, “Tratamento do MySQL do GROUP BY”. Veja a Seção 14.19.1, “Descrição das Funções Agregadas” para informações sobre o comportamento do `COUNT(expr)` e otimizações relacionadas.

#### 5.3.4.9 Usando mais de uma tabela

A tabela `pet` mantém o controle de quais animais de estimação você tem. Se você quiser registrar outras informações sobre eles, como eventos em suas vidas, como visitas ao veterinário ou quando os ninhadas nascem, você precisa de outra tabela. Como essa tabela deve ser? Ela precisa conter as seguintes informações:

* O nome do animal para que você saiba a que animal cada evento se refere.

* Uma data para que você saiba quando o evento ocorreu. * Um campo para descrever o evento. * Um campo de tipo de evento, se você quiser ser capaz de categorizar eventos.

Dadas essas considerações, a declaração `CREATE TABLE` (create-table.html "15.1.20 CREATE TABLE Statement") para a tabela `event` pode parecer assim:

```
mysql> CREATE TABLE event (name VARCHAR(20), date DATE,
       type VARCHAR(15), remark VARCHAR(255));
```

Assim como na tabela `pet`, é mais fácil carregar os registros iniciais ao criar um arquivo de texto delimitado por tabulação contendo as seguintes informações.

<table summary="pet record data that appears in a tab delimited text file, as described in the preceding text."><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 35%"/><thead><tr> <th scope="col">name</th> <th scope="col">date</th> <th scope="col">type</th> <th scope="col">remark</th> </tr></thead><tbody><tr> <th scope="row">Fluffy</th> <td>1995-05-15</td> <td>litter</td> <td>4 kittens, 3 female, 1 male</td> </tr><tr> <th scope="row">Buffy</th> <td>1993-06-23</td> <td>litter</td> <td>5 puppies, 2 female, 3 male</td> </tr><tr> <th scope="row">Buffy</th> <td>1994-06-19</td> <td>litter</td> <td>3 puppies, 3 female</td> </tr><tr> <th scope="row">Chirpy</th> <td>1999-03-21</td> <td>vet</td> <td>needed beak straightened</td> </tr><tr> <th scope="row">Slim</th> <td>1997-08-03</td> <td>vet</td> <td>broken rib</td> </tr><tr> <th scope="row">Bowser</th> <td>1991-10-12</td> <td>kennel</td> <td></td> </tr><tr> <th scope="row">Fang</th> <td>1991-10-12</td> <td>kennel</td> <td></td> </tr><tr> <th scope="row">Fang</th> <td>1998-08-28</td> <td>birthday</td> <td>Gave him a new chew toy</td> </tr><tr> <th scope="row">Claws</th> <td>1998-03-17</td> <td>birthday</td> <td>Gave him a new flea collar</td> </tr><tr> <th scope="row">Whistler</th> <td>1998-12-09</td> <td>birthday</td> <td>First birthday</td> </tr></tbody></table>

Carregue os registros da seguinte forma:

```
mysql> LOAD DATA LOCAL INFILE 'event.txt' INTO TABLE event;
```

Com base no que você aprendeu com as consultas que você realizou na tabela `pet`, você deve ser capaz de realizar recuperações nos registros na tabela `event`; os princípios são os mesmos. Mas quando a tabela `event` por si só é insuficiente para responder às perguntas que você pode fazer?

Suponha que você queira descobrir as idades em que cada animal de estimação teve seus ninhadas. Vimos anteriormente como calcular idades a partir de duas datas. A data da ninhada da mãe está na tabela `event`, mas para calcular sua idade naquela data, você precisa do seu aniversário, que está armazenado na tabela `pet`. Isso significa que a consulta requer ambas as tabelas:

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

Há várias coisas a notar sobre essa consulta:

* A cláusula `FROM` une duas tabelas porque a consulta precisa extrair informações de ambas.

* Ao combinar (juntar) informações de várias tabelas, você precisa especificar como os registros em uma tabela podem ser correspondidos com os registros da outra. Isso é fácil porque ambos têm uma coluna `name`. A consulta usa uma cláusula `ON` para corresponder os registros nas duas tabelas com base nos valores `name`.

A consulta utiliza um `INNER JOIN` para combinar as tabelas. Um `INNER JOIN` permite que as linhas de uma das tabelas apareçam no resultado se e somente se ambas as tabelas atenderem às condições especificadas na cláusula `ON`. Neste exemplo, a cláusula `ON` especifica que a coluna `name` na tabela `pet` deve corresponder à coluna `name` na tabela `event`. Se um nome aparecer em uma tabela, mas não na outra, a linha não aparecerá no resultado porque a condição na cláusula `ON` falha.

* Como a coluna `name` ocorre em ambas as tabelas, você deve ser específico sobre qual tabela você se refere quando se refere à coluna. Isso é feito ao prependere o nome da tabela ao nome da coluna.

Você não precisa ter duas tabelas diferentes para realizar uma junção. Às vezes, é útil unir uma tabela a si mesma, se você quiser comparar registros em uma tabela com outros registros na mesma tabela. Por exemplo, para encontrar pares de reprodução entre seus animais de estimação, você pode unir a tabela `pet` a si mesma para produzir pares de candidatos de machos e fêmeas de espécies semelhantes:

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

Nesta consulta, especificamos aliases para o nome da tabela para se referir às colunas e manter claro qual instância da tabela cada referência de coluna está associada.