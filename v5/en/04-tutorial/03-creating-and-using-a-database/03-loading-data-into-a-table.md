### 3.3.3 Carregando Dados em uma Tabela

Após criar sua tabela, você precisa preenchê-la. As instruções [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") e [`INSERT`](insert.html "13.2.5 INSERT Statement") são úteis para isso.

Suponha que os registros de seus animais de estimação possam ser descritos conforme mostrado aqui. (Observe que o MySQL espera que as datas estejam no formato `'YYYY-MM-DD'`; isso pode diferir do formato ao qual você está acostumado.)

<table summary="Exemplo de registros de animais de estimação mencionados no texto precedente."><col style="width: 10%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 05%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th>nome</th> <th>dono</th> <th>espécie</th> <th>sexo</th> <th>nascimento</th> <th>morte</th> </tr></thead><tbody><tr> <th>Fluffy</th> <td>Harold</td> <td>cat</td> <td>f</td> <td>1993-02-04</td> <td></td> </tr><tr> <th>Claws</th> <td>Gwen</td> <td>cat</td> <td>m</td> <td>1994-03-17</td> <td></td> </tr><tr> <th>Buffy</th> <td>Harold</td> <td>dog</td> <td>f</td> <td>1989-05-13</td> <td></td> </tr><tr> <th>Fang</th> <td>Benny</td> <td>dog</td> <td>m</td> <td>1990-08-27</td> <td></td> </tr><tr> <th>Bowser</th> <td>Diane</td> <td>dog</td> <td>m</td> <td>1979-08-31</td> <td>1995-07-29</td> </tr><tr> <th>Chirpy</th> <td>Gwen</td> <td>bird</td> <td>f</td> <td>1998-09-11</td> <td></td> </tr><tr> <th>Whistler</th> <td>Gwen</td> <td>bird</td> <td></td> <td>1997-12-09</td> <td></td> </tr><tr> <th>Slim</th> <td>Benny</td> <td>snake</td> <td>m</td> <td>1996-04-29</td> <td></td> </tr> </tbody></table>

Como você está começando com uma tabela vazia, uma maneira fácil de preenchê-la é criar um arquivo de texto contendo uma linha para cada um de seus animais e, em seguida, carregar o conteúdo do arquivo na tabela com uma única instrução.

Você pode criar um arquivo de texto `pet.txt` contendo um registro por linha, com valores separados por tabulações (tabs) e fornecidos na ordem em que as colunas foram listadas na instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement"). Para valores ausentes (como sexos desconhecidos ou datas de óbito para animais que ainda estão vivos), você pode usar valores `NULL`. Para representá-los em seu arquivo de texto, use `\N` (barra invertida, N maiúsculo). Por exemplo, o registro para o pássaro Whistler se pareceria com isto (onde o espaço em branco entre os valores é um único caractere de tabulação):

```sql
Whistler        Gwen    bird    \N      1997-12-09      \N
```

Para carregar o arquivo de texto `pet.txt` na tabela `pet`, use esta instrução:

```sql
mysql> LOAD DATA LOCAL INFILE '/path/pet.txt' INTO TABLE pet;
```

Se você criou o arquivo no Windows com um editor que usa `\r\n` como terminador de linha, você deve usar esta instrução:

```sql
mysql> LOAD DATA LOCAL INFILE '/path/pet.txt' INTO TABLE pet
       LINES TERMINATED BY '\r\n';
```

(Em uma máquina Apple executando macOS, você provavelmente usaria `LINES TERMINATED BY '\r'`.)

Você pode especificar explicitamente o separador de valores de coluna e o marcador de fim de linha na instrução [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") se desejar, mas os padrões são tabulação (tab) e linefeed. Estes são suficientes para que a instrução leia o arquivo `pet.txt` corretamente.

Se a instrução falhar, é provável que sua instalação MySQL não tenha o recurso de arquivo local (local file capability) habilitado por padrão. Consulte [Seção 6.1.6, “Considerações de Segurança para LOAD DATA LOCAL”](load-data-local-security.html "6.1.6 Security Considerations for LOAD DATA LOCAL"), para obter informações sobre como alterar isso.

Quando você deseja adicionar novos registros um de cada vez, a instrução [`INSERT`](insert.html "13.2.5 INSERT Statement") é útil. Em sua forma mais simples, você fornece valores para cada coluna, na ordem em que as colunas foram listadas na instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement"). Suponha que Diane ganhe um novo hamster chamado “Puffball”. Você pode adicionar um novo registro usando uma instrução [`INSERT`](insert.html "13.2.5 INSERT Statement") como esta:

```sql
mysql> INSERT INTO pet
       VALUES ('Puffball','Diane','hamster','f','1999-03-30',NULL);
```

Valores de string e data são especificados como strings entre aspas aqui. Além disso, com [`INSERT`](insert.html "13.2.5 INSERT Statement"), você pode inserir `NULL` diretamente para representar um valor ausente. Você não usa `\N` como faria com [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement").

A partir deste exemplo, você deve ser capaz de perceber que seria necessário digitar muito mais para carregar seus registros inicialmente usando várias instruções [`INSERT`](insert.html "13.2.5 INSERT Statement") em vez de uma única instrução [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement").