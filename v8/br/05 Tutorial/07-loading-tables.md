### 5.3.3 Carregamento de dados numa tabela

Depois de criar sua tabela, você precisa preenchê-la. As instruções `LOAD DATA` e `INSERT` são úteis para isso.

Suponha que seus registros de animais de estimação possam ser descritos como mostrado aqui. (Observe que o MySQL espera datas no formato `'YYYY-MM-DD'`; isso pode diferir do que você está acostumado.)

<table><col style="width: 10%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 05%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th scope="col">nome</th> <th scope="col">proprietário</th> <th scope="col">espécies</th> <th scope="col">Sexo</th> <th scope="col">nascimento</th> <th scope="col">Morte</th> </tr></thead><tbody><tr> <th>Peluchoso</th> <td>Harold .</td> <td>gato</td> <td>f f</td> <td>1993-02-04 (em inglês)</td> <td></td> </tr><tr> <th>Armadilhas</th> <td>Gwen .</td> <td>gato</td> <td>m</td> <td>1994-03-17 Comissão</td> <td></td> </tr><tr> <th>Buffy ,</th> <td>Harold .</td> <td>cão</td> <td>f f</td> <td>1989-05-13 Comissão</td> <td></td> </tr><tr> <th>Fang</th> <td>Benny , por favor .</td> <td>cão</td> <td>m</td> <td>1990 - 27 de Agosto</td> <td></td> </tr><tr> <th>Bowser .</th> <td>Diane .</td> <td>cão</td> <td>m</td> <td>1979 - 31 de Agosto</td> <td>Relatório da Comissão</td> </tr><tr> <th>Alegria</th> <td>Gwen .</td> <td>aveira</td> <td>f f</td> <td>11 de Setembro de</td> <td></td> </tr><tr> <th>Whistler</th> <td>Gwen .</td> <td>aveira</td> <td></td> <td>1997-12-09 (em inglês)</td> <td></td> </tr><tr> <th>Escasso</th> <td>Benny , por favor .</td> <td>serpente</td> <td>m</td> <td>1996-04-29 (em inglês)</td> <td></td> </tr></tbody></table>

Como você está começando com uma tabela vazia, uma maneira fácil de preenchê-la é criar um arquivo de texto contendo uma linha para cada um dos seus animais, em seguida, carregar o conteúdo do arquivo na tabela com uma única instrução.

Você pode criar um arquivo de texto `pet.txt` contendo um registro por linha, com valores separados por guias, e dado na ordem em que as colunas foram listadas na instrução `CREATE TABLE`. Para valores ausentes (como sexos desconhecidos ou datas de morte de animais que ainda estão vivos), você pode usar valores `NULL`. Para representá-los em seu arquivo de texto, use `\N` (retrocesso, maiúscula-N). Por exemplo, o registro para Whistler o pássaro seria assim (onde o espaço em branco entre os valores é um único caracter de guia):

```
Whistler        Gwen    bird    \N      1997-12-09      \N
```

Para carregar o arquivo de texto `pet.txt` na tabela `pet`, use esta instrução:

```
mysql> LOAD DATA LOCAL INFILE '/path/pet.txt' INTO TABLE pet;
```

Se você criou o arquivo no Windows com um editor que usa `\r\n` como terminador de linha, você deve usar esta instrução em vez disso:

```
mysql> LOAD DATA LOCAL INFILE '/path/pet.txt' INTO TABLE pet
       LINES TERMINATED BY '\r\n';
```

(Em uma máquina Apple com macOS, você provavelmente gostaria de usar `LINES TERMINATED BY '\r'`.)

Você pode especificar o separador de valores de coluna e o marcador de fim de linha explicitamente na instrução `LOAD DATA` se desejar, mas os padrões são tabulação e linefeed. Estes são suficientes para que a instrução leia o arquivo `pet.txt` corretamente.

Se a instrução falhar, é provável que a sua instalação do MySQL não tenha a capacidade de arquivo local habilitada por padrão. Ver Secção 8.1.6, "Considerações de segurança para LOAD DATA LOCAL", para obter informações sobre como alterar isso.

Quando você quer adicionar novos registros um de cada vez, a instrução `INSERT` é útil. Em sua forma mais simples, você fornece valores para cada coluna, na ordem em que as colunas foram listadas na instrução `CREATE TABLE`.

```
mysql> INSERT INTO pet
       VALUES ('Puffball','Diane','hamster','f','1999-03-30',NULL);
```

Os valores de string e data são especificados como strings de citações aqui. Além disso, com \[`INSERT`], você pode inserir \[`NULL`]] diretamente para representar um valor em falta. Você não usa \[`\N`]] como você faz com \[`LOAD DATA`].

A partir deste exemplo, você deve ser capaz de ver que haveria muito mais digitação envolvida para carregar seus registros inicialmente usando várias instruções `INSERT` em vez de uma única instrução `LOAD DATA`.
