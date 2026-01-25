## 10.4 Conjuntos de Caracteres e Colações de Conexão

Uma "conexão" é o que um programa cliente estabelece quando se conecta ao servidor, para iniciar uma sessão na qual interage com o servidor. O cliente envia instruções SQL, como Queries, através da conexão da sessão. O servidor envia respostas, como Result Sets ou mensagens de erro, de volta ao cliente através da conexão.

* Variáveis de Sistema de Conjunto de Caracteres e Colação de Conexão
* Conjuntos de Caracteres de Cliente Não Permitidos
* Configuração do Conjunto de Caracteres de Conexão do Programa Cliente
* Instruções SQL para Configuração do Conjunto de Caracteres de Conexão
* Tratamento de Erros de Conjunto de Caracteres de Conexão

### Variáveis de Sistema de Conjunto de Caracteres e Colação de Conexão

Várias variáveis de sistema de conjunto de caracteres e Colação estão relacionadas à interação de um cliente com o servidor. Algumas delas foram mencionadas em seções anteriores:

* As variáveis de sistema `character_set_server` e `collation_server` indicam o conjunto de caracteres e a Colação do servidor. Consulte a Seção 10.3.2, "Conjunto de Caracteres e Colação do Servidor".

* As variáveis de sistema `character_set_database` e `collation_database` indicam o conjunto de caracteres e a Colação do Database padrão. Consulte a Seção 10.3.3, "Conjunto de Caracteres e Colação do Database".

Variáveis de sistema adicionais de conjunto de caracteres e Colação estão envolvidas no tratamento do tráfego para a conexão entre um cliente e o servidor. Cada cliente possui variáveis de sistema de conjunto de caracteres e Colação específicas da sessão e relacionadas à conexão. Esses valores de variáveis de sistema de sessão são inicializados no momento da conexão, mas podem ser alterados dentro da sessão.

Várias questões sobre o tratamento de conjunto de caracteres e Colação para conexões de clientes podem ser respondidas em termos de variáveis de sistema:

* Em qual conjunto de caracteres as instruções estão quando deixam o cliente?

  O servidor assume que a variável de sistema `character_set_client` é o conjunto de caracteres no qual as instruções são enviadas pelo cliente.

  Note

  Alguns conjuntos de caracteres não podem ser usados como o conjunto de caracteres do cliente. Consulte Conjuntos de Caracteres de Cliente Não Permitidos.

* Para qual conjunto de caracteres o servidor deve traduzir as instruções após recebê-las?

  Para determinar isso, o servidor usa as variáveis de sistema `character_set_connection` e `collation_connection`:

  + O servidor converte as instruções enviadas pelo cliente de `character_set_client` para `character_set_connection`. Exceção: Para literais de string que possuem um *introducer* como `_utf8mb4` ou `_latin2`, o *introducer* determina o conjunto de caracteres. Consulte a Seção 10.3.8, "Introducers de Conjunto de Caracteres".

  + `collation_connection` é importante para comparações de literais de string. Para comparações de strings com valores de coluna, `collation_connection` não importa porque as colunas têm sua própria Colação, que tem uma precedência de Colação maior (consulte a Seção 10.8.4, "Coercibilidade de Colação em Expressões").

* Para qual conjunto de caracteres o servidor deve traduzir os resultados da Query antes de enviá-los de volta ao cliente?

  A variável de sistema `character_set_results` indica o conjunto de caracteres no qual o servidor retorna os resultados da Query ao cliente. Isso inclui dados de resultado, como valores de coluna, metadados de resultado, como nomes de coluna, e mensagens de erro.

  Para instruir o servidor a não realizar nenhuma conversão de Result Sets ou mensagens de erro, defina `character_set_results` como `NULL` ou `binary`:

  ```sql
  SET character_set_results = NULL;
  SET character_set_results = binary;
  ```

  Para mais informações sobre conjuntos de caracteres e mensagens de erro, consulte a Seção 10.6, "Conjunto de Caracteres de Mensagens de Erro".

Para ver os valores das variáveis de sistema de conjunto de caracteres e Colação que se aplicam à sessão atual, use esta instrução:

```sql
SELECT * FROM performance_schema.session_variables
WHERE VARIABLE_NAME IN (
'character_set_client', 'character_set_connection',
'character_set_results', 'collation_connection'
) ORDER BY VARIABLE_NAME;
```

As seguintes instruções mais simples também exibem as variáveis de conexão, mas incluem outras variáveis relacionadas. Elas podem ser úteis para ver *todas* as variáveis de sistema de conjunto de caracteres e Colação:

```sql
SHOW SESSION VARIABLES LIKE 'character_set_%';
SHOW SESSION VARIABLES LIKE 'collation_%';
```

Os clientes podem ajustar as configurações dessas variáveis ou depender dos padrões (caso em que você pode pular o restante desta seção). Se você não usar os padrões, deverá alterar as configurações de caracteres *para cada conexão com o servidor.*

### Conjuntos de Caracteres de Cliente Não Permitidos

A variável de sistema `character_set_client` não pode ser definida para certos conjuntos de caracteres:

```sql
ucs2
utf16
utf16le
utf32
```

A tentativa de usar qualquer um desses conjuntos de caracteres como conjunto de caracteres do cliente produz um erro:

```sql
mysql> SET character_set_client = 'ucs2';
ERROR 1231 (42000): Variable 'character_set_client'
can't be set to the value of 'ucs2'
```

O mesmo erro ocorre se qualquer um desses conjuntos de caracteres for usado nos seguintes contextos, todos os quais resultam em uma tentativa de definir `character_set_client` para o conjunto de caracteres nomeado:

* A opção de comando `--default-character-set=charset_name` usada por programas clientes MySQL como **mysql** e **mysqladmin**.

* A instrução `SET NAMES 'charset_name'`.

* A instrução `SET CHARACTER SET 'charset_name'`.

### Configuração do Conjunto de Caracteres de Conexão do Programa Cliente

Quando um cliente se conecta ao servidor, ele indica qual conjunto de caracteres deseja usar para a comunicação com o servidor. (Na verdade, o cliente indica a Colação padrão para esse conjunto de caracteres, a partir da qual o servidor pode determinar o conjunto de caracteres.) O servidor usa esta informação para definir as variáveis de sistema `character_set_client`, `character_set_results`, `character_set_connection` para o conjunto de caracteres, e `collation_connection` para a Colação padrão do conjunto de caracteres. Na prática, o servidor executa o equivalente a uma operação `SET NAMES`.

Se o servidor não suportar o conjunto de caracteres ou a Colação solicitada, ele recorre ao uso do conjunto de caracteres e Colação do servidor para configurar a conexão. Para detalhes adicionais sobre esse comportamento de *fallback*, consulte Tratamento de Erros de Conjunto de Caracteres de Conexão.

Os programas clientes **mysql**, **mysqladmin**, **mysqlcheck**, **mysqlimport** e **mysqlshow** determinam o conjunto de caracteres padrão a ser usado da seguinte forma:

* Na ausência de outras informações, cada cliente usa o conjunto de caracteres padrão embutido na compilação, geralmente `latin1`.

* Cada cliente pode autodetectar qual conjunto de caracteres usar com base na configuração do sistema operacional, como o valor da variável de ambiente de localidade `LANG` ou `LC_ALL` em sistemas Unix ou a configuração da página de código (code page) em sistemas Windows. Para sistemas nos quais a localidade está disponível a partir do SO, o cliente a usa para definir o conjunto de caracteres padrão, em vez de usar o padrão embutido na compilação. Por exemplo, definir `LANG` como `ru_RU.KOI8-R` faz com que o conjunto de caracteres `koi8r` seja usado. Assim, os usuários podem configurar a localidade em seu ambiente para uso pelos clientes MySQL.

  O conjunto de caracteres do SO é mapeado para o conjunto de caracteres MySQL mais próximo se não houver uma correspondência exata. Se o cliente não suportar o conjunto de caracteres correspondente, ele usará o padrão embutido na compilação. Por exemplo, `ucs2` não é suportado como um conjunto de caracteres de conexão, então ele mapeia para o padrão embutido na compilação.

  Aplicações C podem usar a autodeteção de conjunto de caracteres baseada na configuração do SO invocando `mysql_options()` da seguinte forma antes de se conectar ao servidor:

  ```sql
  mysql_options(mysql,
                MYSQL_SET_CHARSET_NAME,
                MYSQL_AUTODETECT_CHARSET_NAME);
  ```

* Cada cliente suporta uma opção `--default-character-set`, que permite aos usuários especificar o conjunto de caracteres explicitamente para anular qualquer padrão que o cliente determine de outra forma.

  Note

  Alguns conjuntos de caracteres não podem ser usados como o conjunto de caracteres do cliente. A tentativa de usá-los com `--default-character-set` produz um erro. Consulte Conjuntos de Caracteres de Cliente Não Permitidos.

Com o cliente **mysql**, para usar um conjunto de caracteres diferente do padrão, você pode executar explicitamente uma instrução `SET NAMES` toda vez que se conectar ao servidor (consulte Configuração do Conjunto de Caracteres de Conexão do Programa Cliente). Para obter o mesmo resultado mais facilmente, especifique o conjunto de caracteres no seu arquivo de opções. Por exemplo, a seguinte configuração de arquivo de opções altera as três variáveis de sistema de conjunto de caracteres relacionadas à conexão para `koi8r` toda vez que você invoca **mysql**:

```sql
[mysql]
default-character-set=koi8r
```

Se você estiver usando o cliente **mysql** com a reconexão automática ativada (o que não é recomendado), é preferível usar o comando `charset` em vez de `SET NAMES`. Por exemplo:

```sql
mysql> charset koi8r
Charset changed
```

O comando `charset` emite uma instrução `SET NAMES` e também altera o conjunto de caracteres padrão que **mysql** usa quando se reconecta após a queda da conexão.

Ao configurar programas clientes, você também deve considerar o ambiente no qual eles são executados. Consulte a Seção 10.5, "Configurando o Conjunto de Caracteres e a Colação da Aplicação".

### Instruções SQL para Configuração do Conjunto de Caracteres de Conexão

Depois que uma conexão é estabelecida, os clientes podem alterar as variáveis de sistema de conjunto de caracteres e Colação para a sessão atual. Essas variáveis podem ser alteradas individualmente usando instruções `SET`, mas duas instruções mais convenientes afetam as variáveis de sistema de conjunto de caracteres relacionadas à conexão como um grupo:

* `SET NAMES 'charset_name' [COLLATE 'collation_name']`

  `SET NAMES` indica qual conjunto de caracteres o cliente usa para enviar instruções SQL ao servidor. Assim, `SET NAMES 'cp1251'` diz ao servidor: "futuras mensagens de entrada deste cliente estão no conjunto de caracteres `cp1251`." Ele também especifica o conjunto de caracteres que o servidor deve usar para enviar resultados de volta ao cliente. (Por exemplo, ele indica qual conjunto de caracteres usar para valores de coluna se você usar uma instrução `SELECT` que produza um Result Set).

  Uma instrução `SET NAMES 'charset_name'` é equivalente a estas três instruções:

  ```sql
  SET character_set_client = charset_name;
  SET character_set_results = charset_name;
  SET character_set_connection = charset_name;
  ```

  Definir `character_set_connection` para *`charset_name`* também define implicitamente `collation_connection` para a Colação padrão para *`charset_name`*. Não é necessário definir essa Colação explicitamente. Para especificar uma Colação particular a ser usada para `collation_connection`, adicione uma cláusula `COLLATE`:

  ```sql
  SET NAMES 'charset_name' COLLATE 'collation_name'
  ```

* `SET CHARACTER SET 'charset_name`'

  `SET CHARACTER SET` é semelhante a `SET NAMES`, mas define `character_set_connection` e `collation_connection` para `character_set_database` e `collation_database` (que, conforme mencionado anteriormente, indicam o conjunto de caracteres e a Colação do Database padrão).

  Uma instrução `SET CHARACTER SET charset_name` é equivalente a estas três instruções:

  ```sql
  SET character_set_client = charset_name;
  SET character_set_results = charset_name;
  SET collation_connection = @@collation_database;
  ```

  Definir `collation_connection` também define implicitamente `character_set_connection` para o conjunto de caracteres associado à Colação (equivalente a executar `SET character_set_connection = @@character_set_database`). Não é necessário definir `character_set_connection` explicitamente.

Note

Alguns conjuntos de caracteres não podem ser usados como o conjunto de caracteres do cliente. A tentativa de usá-los com `SET NAMES` ou `SET CHARACTER SET` produz um erro. Consulte Conjuntos de Caracteres de Cliente Não Permitidos.

Exemplo: Suponha que `column1` seja definido como `CHAR(5) CHARACTER SET latin2`. Se você não disser `SET NAMES` ou `SET CHARACTER SET`, então para `SELECT column1 FROM t`, o servidor enviará de volta todos os valores para `column1` usando o conjunto de caracteres que o cliente especificou quando se conectou. Por outro lado, se você disser `SET NAMES 'latin1'` ou `SET CHARACTER SET 'latin1'` antes de emitir a instrução `SELECT`, o servidor converte os valores `latin2` para `latin1` pouco antes de enviar os resultados de volta. A conversão pode ser com perda de dados (*lossy*) para caracteres que não estão em ambos os conjuntos de caracteres.

### Tratamento de Erros de Conjunto de Caracteres de Conexão

Tentativas de usar um conjunto de caracteres ou Colação de conexão inapropriada podem produzir um erro, ou fazer com que o servidor recorra ao seu conjunto de caracteres e Colação padrão para uma determinada conexão. Esta seção descreve os problemas que podem ocorrer ao configurar o conjunto de caracteres de conexão. Esses problemas podem ocorrer ao estabelecer uma conexão ou ao alterar o conjunto de caracteres dentro de uma conexão estabelecida.

* Tratamento de Erros no Tempo de Conexão
* Tratamento de Erros em Tempo de Execução (Runtime)

#### Tratamento de Erros no Tempo de Conexão

Alguns conjuntos de caracteres não podem ser usados como o conjunto de caracteres do cliente; consulte Conjuntos de Caracteres de Cliente Não Permitidos. Se você especificar um conjunto de caracteres que é válido, mas não permitido como um conjunto de caracteres do cliente, o servidor retornará um erro:

```sql
$> mysql --default-character-set=ucs2
ERROR 1231 (42000): Variable 'character_set_client' can't be set to
the value of 'ucs2'
```

Se você especificar um conjunto de caracteres que o cliente não reconhece, ele produz um erro:

```sql
$> mysql --default-character-set=bogus
mysql: Character set 'bogus' is not a compiled character set and is
not specified in the '/usr/local/mysql/share/charsets/Index.xml' file
ERROR 2019 (HY000): Can't initialize character set bogus
(path: /usr/local/mysql/share/charsets/)
```

Se você especificar um conjunto de caracteres que o cliente reconhece, mas o servidor não, o servidor recorre ao seu conjunto de caracteres e Colação padrão. Suponha que o servidor esteja configurado para usar `latin1` e `latin1_swedish_ci` como seus padrões, e que ele não reconheça `gb18030` como um conjunto de caracteres válido. Um cliente que especifica `--default-character-set=gb18030` é capaz de se conectar ao servidor, mas o conjunto de caracteres resultante não é o que o cliente deseja:

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

Você pode ver que as variáveis de sistema de conexão foram definidas para refletir um conjunto de caracteres e Colação de `latin1` e `latin1_swedish_ci`. Isso ocorre porque o servidor não pode satisfazer a solicitação de conjunto de caracteres do cliente e recorre aos seus padrões.

Neste caso, o cliente não pode usar o conjunto de caracteres que deseja porque o servidor não o suporta. O cliente deve estar disposto a usar um conjunto de caracteres diferente, ou conectar-se a um servidor diferente que suporte o conjunto de caracteres desejado.

O mesmo problema ocorre em um contexto mais sutil: quando o cliente diz ao servidor para usar um conjunto de caracteres que o servidor reconhece, mas a Colação padrão para esse conjunto de caracteres no lado do cliente não é conhecida no lado do servidor. Isso ocorre, por exemplo, quando um cliente MySQL 8.0 deseja se conectar a um servidor MySQL 5.7 usando `utf8mb4` como o conjunto de caracteres do cliente. Um cliente que especifica `--default-character-set=utf8mb4` é capaz de se conectar ao servidor. No entanto, como no exemplo anterior, o servidor recorre ao seu conjunto de caracteres e Colação padrão, e não ao que o cliente solicitou:

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

Por que isso ocorre? Afinal, `utf8mb4` é conhecido tanto pelo cliente 8.0 quanto pelo servidor 5.7, então ambos o reconhecem. Para entender esse comportamento, é necessário entender que quando o cliente informa ao servidor qual conjunto de caracteres ele deseja usar, ele na verdade informa ao servidor a Colação padrão para aquele conjunto de caracteres. Portanto, o comportamento mencionado acima ocorre devido a uma combinação de fatores:

* A Colação padrão para `utf8mb4` difere entre MySQL 5.7 e 8.0 (`utf8mb4_general_ci` para 5.7, `utf8mb4_0900_ai_ci` para 8.0).

* Quando o cliente 8.0 solicita um conjunto de caracteres `utf8mb4`, o que ele envia ao servidor é a Colação `utf8mb4` padrão do 8.0; ou seja, a `utf8mb4_0900_ai_ci`.

* `utf8mb4_0900_ai_ci` é implementado apenas a partir do MySQL 8.0, então o servidor 5.7 não o reconhece.

* Como o servidor 5.7 não reconhece `utf8mb4_0900_ai_ci`, ele não pode satisfazer a solicitação de conjunto de caracteres do cliente e recorre ao seu conjunto de caracteres e Colação padrão (`latin1` e `latin1_swedish_ci`).

Neste caso, o cliente ainda pode usar `utf8mb4` emitindo uma instrução `SET NAMES 'utf8mb4'` após a conexão. A Colação resultante é a Colação `utf8mb4` padrão do 5.7; ou seja, `utf8mb4_general_ci`. Se o cliente desejar adicionalmente uma Colação `utf8mb4_0900_ai_ci`, ele não poderá alcançá-la porque o servidor não reconhece essa Colação. O cliente deve estar disposto a usar uma Colação `utf8mb4` diferente, ou conectar-se a um servidor MySQL 8.0 ou superior.

#### Tratamento de Erros em Tempo de Execução (Runtime)

Dentro de uma conexão estabelecida, o cliente pode solicitar uma mudança do conjunto de caracteres e Colação de conexão com `SET NAMES` ou `SET CHARACTER SET`.

Alguns conjuntos de caracteres não podem ser usados como o conjunto de caracteres do cliente; consulte Conjuntos de Caracteres de Cliente Não Permitidos. Se você especificar um conjunto de caracteres que é válido, mas não permitido como um conjunto de caracteres do cliente, o servidor retornará um erro:

```sql
mysql> SET NAMES 'ucs2';
ERROR 1231 (42000): Variable 'character_set_client' can't be set to
the value of 'ucs2'
```

Se o servidor não reconhecer o conjunto de caracteres (ou a Colação), ele produz um erro:

```sql
mysql> SET NAMES 'bogus';
ERROR 1115 (42000): Unknown character set: 'bogus'

mysql> SET NAMES 'utf8mb4' COLLATE 'bogus';
ERROR 1273 (HY000): Unknown collation: 'bogus'
```

Dica

Um cliente que deseja verificar se o seu conjunto de caracteres solicitado foi respeitado pelo servidor pode executar a seguinte instrução após a conexão e verificar se o resultado é o conjunto de caracteres esperado:

```sql
SELECT @@character_set_client;
```