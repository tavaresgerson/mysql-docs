### 5.3.3 Carregando Dados em uma Tabela

Após criar sua tabela, você precisa preenchê-la. As instruções `LOAD DATA` e `INSERT` são úteis para isso.

Suponha que os registros de seus animais de estimação possam ser descritos da seguinte forma. (Observe que o MySQL espera datas no formato `'YYYY-MM-DD'; isso pode diferir do que você está acostumado.)

<table summary="Exemplo de registros de animais de estimação mencionados no texto anterior."><col style="width: 10%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 05%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th scope="col">nome</th> <th scope="col">proprietário</th> <th scope="col">espécie</th> <th scope="col">sexo</th> <th scope="col">nascimento</th> <th scope="col">morte</th> </tr></thead><tbody><tr> <th scope="row">Fluffy</th> <td>Harold</td> <td>gato</td> <td>f</td> <td>1993-02-04</td> <td></td> </tr><tr> <th scope="row">Claws</th> <td>Gwen</td> <td>gato</td> <td>m</td> <td>1994-03-17</td> <td></td> </tr><tr> <th scope="row">Buffy</th> <td>Harold</td> <td>cão</td> <td>f</td> <td>1989-05-13</td> <td></td> </tr><tr> <th scope="row">Fang</th> <td>Benny</td> <td>cão</td> <td>m</td> <td>1990-08-27</td> <td></td> </tr><tr> <th scope="row">Bowser</th> <td>Diane</td> <td>cão</td> <td>m</td> <td>1979-08-31</td> <td>1995-07-29</td> </tr><tr> <th scope="row">Chirpy</th> <td>Gwen</td> <td>pássaro</td> <td>f</td> <td>1998-09-11</td> <td></td> </tr><tr> <th scope="row">Whistler</th> <td>Gwen</td> <td>pássaro</td> <td></td> <td>1997-12-09</td> <td></td> </tr><tr> <th scope="row">Slim</th> <td>Benny</td> <td>serpenteio</td> <td>m</td> <td>1996-04-29</td> <td></td> </tr></tbody></table>

Como você está começando com uma tabela vazia, uma maneira fácil de preencher é criar um arquivo de texto contendo uma linha para cada um dos seus animais, e depois carregar o conteúdo do arquivo na tabela com uma única instrução.

Você pode criar um arquivo de texto `pet.txt` contendo um registro por linha, com valores separados por tabs, e fornecendo a ordem em que as colunas foram listadas na instrução `CREATE TABLE`. Para valores ausentes (como sexos desconhecidos ou datas de morte para animais que ainda estão vivos), você pode usar valores `NULL`. Para representá-los em seu arquivo de texto, use `\N` (barra invertida, maiúscula N). Por exemplo, o registro para Whistler, o pássaro, ficaria assim (onde o espaço em branco entre os valores é um único caractere de tabulação):

```
Whistler        Gwen    bird    \N      1997-12-09      \N
```

Para carregar o arquivo de texto `pet.txt` na tabela `pet`, use esta instrução:

```
mysql> LOAD DATA LOCAL INFILE '/path/pet.txt' INTO TABLE pet;
```

Se você criou o arquivo no Windows com um editor que usa `\r\n` como marcador de linha, você deve usar esta instrução:

```
mysql> LOAD DATA LOCAL INFILE '/path/pet.txt' INTO TABLE pet
       LINES TERMINATED BY '\r\n';
```

(Em uma máquina Apple executando macOS, você provavelmente gostaria de usar `LINES TERMINATED BY '\r'`. )

Você pode especificar o separador de valor da coluna e o marcador de fim de linha explicitamente na instrução `LOAD DATA` se desejar, mas os valores padrão são tabulação e retorno de carro. Estes são suficientes para que a instrução leia o arquivo `pet.txt` corretamente.

Se a instrução falhar, é provável que sua instalação do MySQL não tenha a capacidade de arquivo local habilitada por padrão. Veja a Seção 8.1.6, “Considerações de Segurança para LOAD DATA LOCAL”, para informações sobre como alterar isso.

Quando você deseja adicionar novos registros um de cada vez, a instrução `INSERT` é útil. Em sua forma mais simples, você fornece valores para cada coluna, na ordem em que as colunas foram listadas na instrução `CREATE TABLE`. Suponha que Diane adquira um novo hamster chamado “Puffball”. Você poderia adicionar um novo registro usando uma instrução `INSERT` assim:

```
mysql> INSERT INTO pet
       VALUES ('Puffball','Diane','hamster','f','1999-03-30',NULL);
```

Aqui, os valores de string e data são especificados como strings entre aspas. Além disso, com `INSERT`, você pode inserir `NULL` diretamente para representar um valor ausente. Você não usa `\N` como faz com `LOAD DATA`.

A partir deste exemplo, você deve ser capaz de ver que haveria muito mais digitação envolvida para carregar seus registros inicialmente usando várias instruções `INSERT` em vez de uma única instrução `LOAD DATA`.