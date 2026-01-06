### 3.3.3 Carregando dados em uma tabela

Depois de criar sua tabela, você precisa preenchê-la. As instruções `LOAD DATA` e `INSERT` são úteis para isso.

Suponha que os registros de seus animais de estimação possam ser descritos da seguinte forma. (Observe que o MySQL espera datas no formato `'YYYY-MM-DD'`; isso pode diferir do que você está acostumado.)

<table>
   <thead>
      <tr>
         <th scope="col">name</th>
         <th scope="col">owner</th>
         <th scope="col">species</th>
         <th scope="col">sex</th>
         <th scope="col">birth</th>
         <th scope="col">death</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <th>Fluffy</th>
         <td>Harold</td>
         <td>cat</td>
         <td>f</td>
         <td>1993-02-04</td>
         <td></td>
      </tr>
      <tr>
         <th>Claws</th>
         <td>Gwen</td>
         <td>cat</td>
         <td>m</td>
         <td>1994-03-17</td>
         <td></td>
      </tr>
      <tr>
         <th>Buffy</th>
         <td>Harold</td>
         <td>dog</td>
         <td>f</td>
         <td>1989-05-13</td>
         <td></td>
      </tr>
      <tr>
         <th>Fang</th>
         <td>Benny</td>
         <td>dog</td>
         <td>m</td>
         <td>1990-08-27</td>
         <td></td>
      </tr>
      <tr>
         <th>Bowser</th>
         <td>Diane</td>
         <td>dog</td>
         <td>m</td>
         <td>1979-08-31</td>
         <td>1995-07-29</td>
      </tr>
      <tr>
         <th>Chirpy</th>
         <td>Gwen</td>
         <td>bird</td>
         <td>f</td>
         <td>1998-09-11</td>
         <td></td>
      </tr>
      <tr>
         <th>Whistler</th>
         <td>Gwen</td>
         <td>bird</td>
         <td></td>
         <td>1997-12-09</td>
         <td></td>
      </tr>
      <tr>
         <th>Slim</th>
         <td>Benny</td>
         <td>snake</td>
         <td>m</td>
         <td>1996-04-29</td>
         <td></td>
      </tr>
   </tbody>
</table>

Como você está começando com uma tabela vazia, uma maneira fácil de preencher é criar um arquivo de texto contendo uma linha para cada um dos seus animais, e depois carregar o conteúdo do arquivo na tabela com uma única instrução.

Você pode criar um arquivo de texto `pet.txt` contendo um registro por linha, com valores separados por tabs, e fornecidos na ordem em que as colunas foram listadas na declaração `CREATE TABLE`. Para valores ausentes (como sexos desconhecidos ou datas de morte para animais que ainda estão vivos), você pode usar valores `NULL`. Para representá-los em seu arquivo de texto, use `\N` (barra invertida, maiúscula N). Por exemplo, o registro para Whistler, o pássaro, ficaria assim (onde o espaço em branco entre os valores é um único caractere de tabulação):

```sql
Whistler        Gwen    bird    \N      1997-12-09      \N
```

Para carregar o arquivo de texto `pet.txt` na tabela `pet`, use esta instrução:

```sql
mysql> LOAD DATA LOCAL INFILE '/path/pet.txt' INTO TABLE pet;
```

Se você criou o arquivo no Windows com um editor que usa `\r\n` como delimitador de linha, você deve usar esta declaração em vez disso:

```sql
mysql> LOAD DATA LOCAL INFILE '/path/pet.txt' INTO TABLE pet
       LINES TERMINATED BY '\r\n';
```

(Em uma máquina Apple com o macOS, você provavelmente vai querer usar `LINHAS TERMINADAS POR '\r'`.

Você pode especificar o separador de valor da coluna e o marcador de fim de linha explicitamente na instrução `LOAD DATA` se desejar, mas os valores padrão são tabulação e retorno de carro. Estes são suficientes para que a instrução leia o arquivo `pet.txt` corretamente.

Se a declaração falhar, é provável que sua instalação do MySQL não tenha a capacidade de arquivo local habilitada por padrão. Consulte Seção 6.1.6, “Considerações de segurança para LOAD DATA LOCAL” para obter informações sobre como alterar isso.

Quando você deseja adicionar novos registros um de cada vez, a instrução `INSERT` é útil. Em sua forma mais simples, você fornece valores para cada coluna, na ordem em que as colunas foram listadas na instrução `CREATE TABLE`. Suponha que Diane adquira um novo hamster chamado “Puffball”. Você poderia adicionar um novo registro usando uma instrução `INSERT` assim:

```sql
mysql> INSERT INTO pet
       VALUES ('Puffball','Diane','hamster','f','1999-03-30',NULL);
```

Os valores de cadeia e data são especificados como cadeias de caracteres entre aspas aqui. Além disso, com `INSERT`, você pode inserir `NULL` diretamente para representar um valor ausente. Você não usa `\N` como faz com `LOAD DATA`.

Com base neste exemplo, você deve conseguir perceber que seria necessário digitar muito mais para carregar seus registros inicialmente usando várias instruções `INSERT` em vez de uma única instrução `LOAD DATA`.
