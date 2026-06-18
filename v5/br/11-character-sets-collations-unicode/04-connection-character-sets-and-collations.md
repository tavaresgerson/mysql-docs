## 10.4 Character Sets e Collations de Conexão

Uma "conexão" é o que um programa cliente estabelece ao se conectar ao servidor, para iniciar uma session na qual ele interage com o servidor. O cliente envia instruções SQL, como Queries, através da conexão da session. O servidor envia respostas, como result sets ou mensagens de erro, através da conexão de volta ao cliente.

* Variáveis de Sistema de Character Set e Collation de Conexão
* Character Sets de Cliente Não Permitidos
* Configuração de Character Set de Conexão de Programas Cliente
* Instruções SQL para Configuração de Character Set de Conexão
* Tratamento de Erros de Character Set de Conexão

### Variáveis de Sistema de Character Set e Collation de Conexão

Várias system variables de character set e collation se relacionam com a interação do cliente com o servidor. Algumas delas foram mencionadas em seções anteriores:

* As system variables `character_set_server` e `collation_server` indicam o character set e a collation do servidor. Veja Seção 10.3.2, “Server Character Set and Collation”.

* As system variables `character_set_database` e `collation_database` indicam o character set e a collation do Database default. Veja Seção 10.3.3, “Database Character Set and Collation”.

System variables adicionais de character set e collation estão envolvidas no tratamento do tráfego para a conexão entre um cliente e o servidor. Cada cliente tem system variables de character set e collation relacionadas à conexão e específicas da session. Esses valores de system variables de session são inicializados no momento da conexão, mas podem ser alterados dentro da session.

Várias perguntas sobre o tratamento de character set e collation para conexões de cliente podem ser respondidas em termos de system variables:

* Em qual character set as instruções estão quando deixam o cliente?

  O servidor considera que a system variable `character_set_client` é o character set no qual as instruções são enviadas pelo cliente.

  Note

  Alguns character sets não podem ser usados como o character set do cliente. Veja Character Sets de Cliente Não Permitidos.

* Para qual character set o servidor deve traduzir as instruções após recebê-las?

  Para determinar isso, o servidor usa as system variables `character_set_connection` e `collation_connection`:

  + O servidor converte as instruções enviadas pelo cliente de `character_set_client` para `character_set_connection`. Exceção: Para literais de string que têm um introducer como `_utf8mb4` ou `_latin2`, o introducer determina o character set. Veja Seção 10.3.8, “Character Set Introducers”.

  + `collation_connection` é importante para comparações de strings literais. Para comparações de strings com valores de coluna, `collation_connection` não importa porque as colunas têm sua própria collation, que tem uma precedência de collation mais alta (veja Seção 10.8.4, “Collation Coercibility in Expressions”).

* Para qual character set o servidor deve traduzir os resultados da Query antes de enviá-los de volta ao cliente?

  A system variable `character_set_results` indica o character set no qual o servidor retorna os resultados da Query ao cliente. Isso inclui dados de resultado, como valores de coluna, metadata de resultado, como nomes de coluna, e mensagens de erro.

  Para instruir o servidor a não realizar conversão de result sets ou mensagens de erro, defina `character_set_results` como `NULL` ou `binary`:

  ```sql
  SET character_set_results = NULL;
  SET character_set_results = binary;
  ```

  Para mais informações sobre character sets e mensagens de erro, veja Seção 10.6, “Error Message Character Set”.

Para ver os valores das system variables de character set e collation que se aplicam à session atual, use esta instrução:

```sql
SELECT * FROM performance_schema.session_variables
WHERE VARIABLE_NAME IN (
'character_set_client', 'character_set_connection',
'character_set_results', 'collation_connection'
) ORDER BY VARIABLE_NAME;
```

As seguintes instruções mais simples também exibem as variáveis de conexão, mas incluem outras variáveis relacionadas. Elas podem ser úteis para ver *todas* as system variables de character set e collation:

```sql
SHOW SESSION VARIABLES LIKE 'character_set_%';
SHOW SESSION VARIABLES LIKE 'collation_%';
```

Os clientes podem refinar as configurações para essas variáveis, ou depender dos defaults (caso em que você pode pular o restante desta seção). Se você não usar os defaults, você deve alterar as configurações de character set *para cada conexão ao servidor.*

### Character Sets de Cliente Não Permitidos

A system variable `character_set_client` não pode ser definida para certos character sets:

```sql
ucs2
utf16
utf16le
utf32
```

A tentativa de usar qualquer um desses character sets como o character set do cliente produz um erro:

```sql
mysql> SET character_set_client = 'ucs2';
ERROR 1231 (42000): Variable 'character_set_client'
can't be set to the value of 'ucs2'
```

O mesmo erro ocorre se qualquer um desses character sets for usado nos seguintes contextos, todos os quais resultam em uma tentativa de definir `character_set_client` para o character set nomeado:

* A opção de comando `--default-character-set=charset_name` usada por programas clientes MySQL como **mysql** e **mysqladmin**.

* A instrução `SET NAMES 'charset_name'`.

* A instrução `SET CHARACTER SET 'charset_name'`.

### Configuração de Character Set de Conexão de Programas Cliente

Quando um cliente se conecta ao servidor, ele indica qual character set ele deseja usar para a comunicação com o servidor. (Na verdade, o cliente indica a collation default para esse character set, a partir da qual o servidor pode determinar o character set.) O servidor usa esta informação para definir as system variables `character_set_client`, `character_set_results`, `character_set_connection` para o character set, e `collation_connection` para a collation default do character set. Na verdade, o servidor executa o equivalente a uma operação `SET NAMES`.

Se o servidor não suportar o character set ou collation solicitados, ele recorrerá ao uso do character set e collation do servidor para configurar a conexão. Para detalhes adicionais sobre esse comportamento de fallback, veja Tratamento de Erros de Character Set de Conexão.

Os programas cliente **mysql**, **mysqladmin**, **mysqlcheck**, **mysqlimport** e **mysqlshow** determinam o character set default a ser usado da seguinte forma:

* Na ausência de outras informações, cada cliente usa o character set default compilado, geralmente `latin1`.

* Cada cliente pode autodetectar qual character set usar com base na configuração do sistema operacional, como o valor da variável de ambiente de locale `LANG` ou `LC_ALL` em sistemas Unix ou a configuração de code page em sistemas Windows. Para sistemas nos quais o locale está disponível no OS, o cliente o usa para definir o character set default em vez de usar o default compilado. Por exemplo, definir `LANG` como `ru_RU.KOI8-R` faz com que o character set `koi8r` seja usado. Assim, os usuários podem configurar o locale em seu ambiente para uso pelos clientes MySQL.

  O character set do OS é mapeado para o character set MySQL mais próximo, se não houver uma correspondência exata. Se o cliente não suportar o character set correspondente, ele usa o default compilado. Por exemplo, `ucs2` não é suportado como um character set de conexão, então ele mapeia para o default compilado.

  Aplicações C podem usar a autodeteção de character set baseada na configuração do OS invocando `mysql_options()` da seguinte forma antes de se conectar ao servidor:

  ```sql
  mysql_options(mysql,
                MYSQL_SET_CHARSET_NAME,
                MYSQL_AUTODETECT_CHARSET_NAME);
  ```

* Cada cliente suporta uma opção `--default-character-set`, que permite aos usuários especificar o character set explicitamente para sobrescrever qualquer default que o cliente determine de outra forma.

  Note

  Alguns character sets não podem ser usados como o character set do cliente. A tentativa de usá-los com `--default-character-set` produz um erro. Veja Character Sets de Cliente Não Permitidos.

Com o cliente **mysql**, para usar um character set diferente do default, você pode executar explicitamente uma instrução `SET NAMES` toda vez que se conectar ao servidor (veja Configuração de Character Set de Conexão de Programas Cliente). Para alcançar o mesmo resultado mais facilmente, especifique o character set em seu arquivo de opção. Por exemplo, a seguinte configuração de arquivo de opção altera as três system variables de character set relacionadas à conexão para `koi8r` toda vez que você invoca **mysql**:

```sql
[mysql]
default-character-set=koi8r
```

Se você estiver usando o cliente **mysql** com auto-reconnect ativado (o que não é recomendado), é preferível usar o comando `charset` em vez de `SET NAMES`. Por exemplo:

```sql
mysql> charset koi8r
Charset changed
```

O comando `charset` emite uma instrução `SET NAMES` e também altera o character set default que o **mysql** usa quando se reconecta após a queda da conexão.

Ao configurar programas cliente, você também deve considerar o ambiente no qual eles são executados. Veja Seção 10.5, “Configuring Application Character Set and Collation”.

### Instruções SQL para Configuração de Character Set de Conexão

Depois que uma conexão é estabelecida, os clientes podem alterar as system variables de character set e collation para a session atual. Essas variáveis podem ser alteradas individualmente usando instruções `SET`, mas duas instruções mais convenientes afetam as system variables de character set relacionadas à conexão como um grupo:

* `SET NAMES 'charset_name' [COLLATE 'collation_name']`

  `SET NAMES` indica qual character set o cliente usa para enviar instruções SQL ao servidor. Assim, `SET NAMES 'cp1251'` diz ao servidor: “futuras mensagens de entrada deste cliente estão no character set `cp1251`.” Ele também especifica o character set que o servidor deve usar para enviar resultados de volta ao cliente. (Por exemplo, ele indica qual character set usar para valores de coluna se você usar uma instrução `SELECT` que produz um result set.)

  Uma instrução `SET NAMES 'charset_name'` é equivalente a estas três instruções:

  ```sql
  SET character_set_client = charset_name;
  SET character_set_results = charset_name;
  SET character_set_connection = charset_name;
  ```

  A definição de `character_set_connection` para *`charset_name`* também define implicitamente `collation_connection` para a collation default para *`charset_name`*. É desnecessário definir essa collation explicitamente. Para especificar uma collation particular a ser usada para `collation_connection`, adicione uma cláusula `COLLATE`:

  ```sql
  SET NAMES 'charset_name' COLLATE 'collation_name'
  ```

* `SET CHARACTER SET 'charset_name`'

  `SET CHARACTER SET` é semelhante a `SET NAMES`, mas define `character_set_connection` e `collation_connection` para `character_set_database` e `collation_database` (que, como mencionado anteriormente, indicam o character set e a collation do Database default).

  Uma instrução `SET CHARACTER SET charset_name` é equivalente a estas três instruções:

  ```sql
  SET character_set_client = charset_name;
  SET character_set_results = charset_name;
  SET collation_connection = @@collation_database;
  ```

  A definição de `collation_connection` também define implicitamente `character_set_connection` para o character set associado à collation (equivalente à execução de `SET character_set_connection = @@character_set_database`). É desnecessário definir `character_set_connection` explicitamente.

Note

Alguns character sets não podem ser usados como o character set do cliente. A tentativa de usá-los com `SET NAMES` ou `SET CHARACTER SET` produz um erro. Veja Character Sets de Cliente Não Permitidos.

Exemplo: Suponha que `column1` seja definida como `CHAR(5) CHARACTER SET latin2`. Se você não usar `SET NAMES` ou `SET CHARACTER SET`, então para `SELECT column1 FROM t`, o servidor envia de volta todos os valores para `column1` usando o character set que o cliente especificou quando se conectou. Por outro lado, se você usar `SET NAMES 'latin1'` ou `SET CHARACTER SET 'latin1'` antes de emitir a instrução `SELECT`, o servidor converte os valores `latin2` para `latin1` pouco antes de enviar os resultados de volta. A conversão pode ser com perda (lossy) para caracteres que não estão em ambos os character sets.

### Tratamento de Erros de Character Set de Conexão

Tentativas de usar um character set ou collation de conexão inapropriados podem produzir um erro, ou fazer com que o servidor recorra ao seu character set e collation default para uma dada conexão. Esta seção descreve problemas que podem ocorrer ao configurar o character set de conexão. Esses problemas podem ocorrer ao estabelecer uma conexão ou ao alterar o character set dentro de uma conexão estabelecida.

* Tratamento de Erros no Tempo de Conexão
* Tratamento de Erros em Tempo de Execução

#### Tratamento de Erros no Tempo de Conexão

Alguns character sets não podem ser usados como o character set do cliente; veja Character Sets de Cliente Não Permitidos. Se você especificar um character set que é válido, mas não permitido como um character set do cliente, o servidor retorna um erro:

```sql
$> mysql --default-character-set=ucs2
ERROR 1231 (42000): Variable 'character_set_client' can't be set to
the value of 'ucs2'
```

Se você especificar um character set que o cliente não reconhece, ele produz um erro:

```sql
$> mysql --default-character-set=bogus
mysql: Character set 'bogus' is not a compiled character set and is
not specified in the '/usr/local/mysql/share/charsets/Index.xml' file
ERROR 2019 (HY000): Can't initialize character set bogus
(path: /usr/local/mysql/share/charsets/)
```

Se você especificar um character set que o cliente reconhece, mas o servidor não, o servidor recorre ao seu character set e collation default. Suponha que o servidor esteja configurado para usar `latin1` e `latin1_swedish_ci` como seus defaults, e que ele não reconheça `gb18030` como um character set válido. Um cliente que especifica `--default-character-set=gb18030` consegue se conectar ao servidor, mas o character set resultante não é o que o cliente deseja:

```sql
mysql> SHOW SESSION VARIABLES LIKE 'character_set_%';
+--------------------------+--------+
| Variable_name            | Value  |
+--------------------------+--------+
| character_set_client     | latin1 |
| character_set_connection | latin1 |
...
| character_set_results    | latin1 |
...
+--------------------------+--------+
mysql> SHOW SESSION VARIABLES LIKE 'collation_connection';
+----------------------+-------------------+
| Variable_name        | Value             |
+----------------------+-------------------+
| collation_connection | latin1_swedish_ci |
+----------------------+-------------------+
```

Você pode ver que as system variables de conexão foram definidas para refletir um character set e collation de `latin1` e `latin1_swedish_ci`. Isso ocorre porque o servidor não pode satisfazer a solicitação do character set do cliente e recorre aos seus defaults.

Neste caso, o cliente não pode usar o character set que deseja porque o servidor não o suporta. O cliente deve estar disposto a usar um character set diferente ou conectar-se a um servidor diferente que suporte o character set desejado.

O mesmo problema ocorre em um contexto mais sutil: Quando o cliente informa ao servidor para usar um character set que o servidor reconhece, mas a collation default para esse character set no lado do cliente não é conhecida no lado do servidor. Isso ocorre, por exemplo, quando um cliente MySQL 8.0 deseja se conectar a um servidor MySQL 5.7 usando `utf8mb4` como o character set do cliente. Um cliente que especifica `--default-character-set=utf8mb4` consegue se conectar ao servidor. No entanto, assim como no exemplo anterior, o servidor recorre ao seu character set e collation default, não ao que o cliente solicitou:

```sql
mysql> SHOW SESSION VARIABLES LIKE 'character_set_%';
+--------------------------+--------+
| Variable_name            | Value  |
+--------------------------+--------+
| character_set_client     | latin1 |
| character_set_connection | latin1 |
...
| character_set_results    | latin1 |
...
+--------------------------+--------+
mysql> SHOW SESSION VARIABLES LIKE 'collation_connection';
+----------------------+-------------------+
| Variable_name        | Value             |
+----------------------+-------------------+
| collation_connection | latin1_swedish_ci |
+----------------------+-------------------+
```

Por que isso ocorre? Afinal, `utf8mb4` é conhecido pelo cliente 8.0 e pelo servidor 5.7, então ambos o reconhecem. Para entender esse comportamento, é necessário entender que quando o cliente informa ao servidor qual character set ele deseja usar, ele, na verdade, informa ao servidor a collation default para esse character set. Portanto, o comportamento mencionado ocorre devido a uma combinação de fatores:

* A collation default para `utf8mb4` difere entre MySQL 5.7 e 8.0 (`utf8mb4_general_ci` para 5.7, `utf8mb4_0900_ai_ci` para 8.0).

* Quando o cliente 8.0 solicita um character set de `utf8mb4`, o que ele envia ao servidor é a collation `utf8mb4` default do 8.0; ou seja, a `utf8mb4_0900_ai_ci`.

* `utf8mb4_0900_ai_ci` é implementada apenas a partir do MySQL 8.0, então o servidor 5.7 não a reconhece.

* Como o servidor 5.7 não reconhece `utf8mb4_0900_ai_ci`, ele não pode satisfazer a solicitação do character set do cliente e recorre ao seu character set e collation default (`latin1` e `latin1_swedish_ci`).

Neste caso, o cliente ainda pode usar `utf8mb4` emitindo uma instrução `SET NAMES 'utf8mb4'` após a conexão. A collation resultante é a collation `utf8mb4` default do 5.7; ou seja, `utf8mb4_general_ci`. Se o cliente desejar adicionalmente uma collation de `utf8mb4_0900_ai_ci`, ele não pode conseguir isso porque o servidor não reconhece essa collation. O cliente deve estar disposto a usar uma collation `utf8mb4` diferente, ou conectar-se a um servidor MySQL 8.0 ou superior.

#### Tratamento de Erros em Tempo de Execução

Dentro de uma conexão estabelecida, o cliente pode solicitar uma mudança de character set e collation de conexão com `SET NAMES` ou `SET CHARACTER SET`.

Alguns character sets não podem ser usados como o character set do cliente; veja Character Sets de Cliente Não Permitidos. Se você especificar um character set que é válido, mas não permitido como um character set do cliente, o servidor retorna um erro:

```sql
mysql> SET NAMES 'ucs2';
ERROR 1231 (42000): Variable 'character_set_client' can't be set to
the value of 'ucs2'
```

Se o servidor não reconhecer o character set (ou a collation), ele produz um erro:

```sql
mysql> SET NAMES 'bogus';
ERROR 1115 (42000): Unknown character set: 'bogus'

mysql> SET NAMES 'utf8mb4' COLLATE 'bogus';
ERROR 1273 (HY000): Unknown collation: 'bogus'
```

Dica

Um cliente que deseja verificar se o seu character set solicitado foi atendido pelo servidor pode executar a seguinte instrução após a conexão e verificar se o resultado é o character set esperado:

```sql
SELECT @@character_set_client;
```