## 10.4 Conjuntos de caracteres e codificações de conexão

Uma "conexão" é o que um programa cliente faz quando se conecta ao servidor, para iniciar uma sessão na qual ele interage com o servidor. O cliente envia instruções SQL, como consultas, sobre a conexão da sessão. O servidor envia respostas, como conjuntos de resultados ou mensagens de erro, de volta ao cliente sobre a conexão.

* Conjunto de caracteres de conexão e variáveis do sistema de codificação
* Conjuntos de caracteres de cliente impermissíveis
* Configuração do conjunto de caracteres de conexão do programa do cliente
* Declarações SQL para configuração do conjunto de caracteres de conexão
* Gerenciamento de erros do conjunto de caracteres de conexão

### Variáveis de Conjunto de Caracteres e Sistema de Colaboração de Conexão ###

Várias variáveis de conjunto de caracteres e sistemas de ordenação estão relacionadas à interação do cliente com o servidor. Algumas dessas variáveis foram mencionadas em seções anteriores:

* As variáveis de sistema `character_set_server` e `collation_server` indicam o conjunto de caracteres e a correção do servidor. Veja a Seção 10.3.2, “Conjunto de caracteres e correção do servidor”.

* As variáveis de sistema `character_set_database` e `collation_database` indicam o conjunto de caracteres e a ordenação do banco de dados padrão. Veja a Seção 10.3.3, “Conjunto de caracteres e ordenação do banco de dados”.

Variáveis adicionais do conjunto de caracteres e do sistema de ordenação estão envolvidas no manuseio do tráfego para a conexão entre um cliente e o servidor. Cada cliente tem variáveis de conjunto de caracteres e sistema de ordenação relacionadas à conexão específicas para a sessão. Esses valores das variáveis do sistema de sessão são inicializados no momento da conexão, mas podem ser alterados dentro da sessão.

Várias perguntas sobre o conjunto de caracteres e o tratamento de ordenação para conexões de clientes podem ser respondidas em termos de variáveis do sistema:

* Qual conjunto de caracteres os enunciados recebem quando saem do cliente?

O servidor considera a variável de sistema `character_set_client` como o conjunto de caracteres no qual as declarações são enviadas pelo cliente.

Nota

Alguns conjuntos de caracteres não podem ser usados como conjunto de caracteres do cliente. Consulte Conjuntos de caracteres de cliente impermissíveis.

* Que conjunto de caracteres o servidor deve traduzir as declarações após recebê-las?

Para determinar isso, o servidor utiliza as variáveis de sistema `character_set_connection` e `collation_connection`:

+ O servidor converte as declarações enviadas pelo cliente de `character_set_client` para `character_set_connection`. Exceção: Para as referências de cadeia que têm um introducer, como `_utf8mb4` ou `_latin2`, o introducer determina o conjunto de caracteres. Ver Seção 10.3.8, “Introdutores de Conjunto de Caracteres”.

+ `collation_connection` é importante para comparações de strings literais. Para comparações de strings com valores de coluna, `collation_connection` não importa porque as colunas têm sua própria collation, que tem uma precedência de collation mais alta (veja Seção 10.8.4, “Coercibilidade de collation em expressões”).

* Qual conjunto de caracteres o servidor deve traduzir os resultados da consulta antes de enviá-los de volta ao cliente?

A variável de sistema `character_set_results` indica o conjunto de caracteres no qual o servidor retorna os resultados da consulta ao cliente. Isso inclui dados de resultado, como valores de coluna, metadados de resultado, como nomes de coluna e mensagens de erro.

Para dizer ao servidor que não realize nenhuma conversão de conjuntos de resultados ou mensagens de erro, defina `character_set_results` para `NULL` ou `binary`:

  ```sql
  SET character_set_results = NULL;
  SET character_set_results = binary;
  ```

Para mais informações sobre conjuntos de caracteres e mensagens de erro, consulte a Seção 10.6, “Conjunto de caracteres de mensagem de erro”.

Para ver os valores das variáveis do conjunto de caracteres e do sistema de ordenação que se aplicam à sessão atual, use esta declaração:

```sql
SELECT * FROM performance_schema.session_variables
WHERE VARIABLE_NAME IN (
'character_set_client', 'character_set_connection',
'character_set_results', 'collation_connection'
) ORDER BY VARIABLE_NAME;
```

As seguintes declarações mais simples também exibem as variáveis de conexão, mas incluem outras variáveis relacionadas também. Elas podem ser úteis para ver *todas* as variáveis de conjunto de caracteres e sistema de collation:

```sql
SHOW SESSION VARIABLES LIKE 'character\_set\_%';
SHOW SESSION VARIABLES LIKE 'collation\_%';
```

Os clientes podem ajustar as configurações dessas variáveis, ou depender dos padrões (neste caso, você pode ignorar o restante desta seção). Se você não usar os padrões, você deve alterar as configurações de caracteres *para cada conexão com o servidor.*

### Conjuntos de caracteres de cliente impermissíveis

A variável de sistema `character_set_client` não pode ser definida para determinados conjuntos de caracteres:

```sql
ucs2
utf16
utf16le
utf32
```

Tentar usar qualquer um desses conjuntos de caracteres como conjunto de caracteres do cliente produz um erro:

```sql
mysql> SET character_set_client = 'ucs2';
ERROR 1231 (42000): Variable 'character_set_client'
can't be set to the value of 'ucs2'
```

O mesmo erro ocorre se qualquer um desses conjuntos de caracteres for usado nos seguintes contextos, todos os quais resultam em uma tentativa de definir `character_set_client` para o conjunto de caracteres nomeado:

* A opção de comando `--default-character-set=charset_name` usada por programas clientes do MySQL, como **mysql** e **mysqladmin**.

* A declaração `SET NAMES 'charset_name'`(set-names.html "13.7.4.3 SET NAMES Statement").

* A declaração `SET CHARACTER SET 'charset_name'`(set-character-set.html "13.7.4.2 SET CHARACTER SET Statement").

### Configuração do Conjunto de Caracteres da Conexão do Programa do Cliente

Quando um cliente se conecta ao servidor, ele indica qual conjunto de caracteres deseja usar para a comunicação com o servidor. (Na verdade, o cliente indica a collation padrão para esse conjunto de caracteres, a partir da qual o servidor pode determinar o conjunto de caracteres.) O servidor usa essas informações para definir as variáveis do sistema `character_set_client`, `character_set_results`, `character_set_connection` para o conjunto de caracteres e `collation_connection` para a collation padrão do conjunto de caracteres. Na verdade, o servidor realiza o equivalente a uma operação `SET NAMES`.

Se o servidor não suportar o conjunto de caracteres ou a ordenação solicitados, ele volta a usar o conjunto de caracteres e a ordenação do servidor para configurar a conexão. Para obter informações adicionais sobre esse comportamento de fallback, consulte Gerenciamento de Erro de Conjunto de Caracteres de Conexão.

Os programas cliente **mysql**, **mysqladmin**, **mysqlcheck**, **mysqlimport** e **mysqlshow** determinam o conjunto de caracteres padrão a ser usado da seguinte forma:

* Na ausência de outras informações, cada cliente utiliza o conjunto de caracteres padrão compilado, geralmente `latin1`.

* Cada cliente pode autodetectar qual conjunto de caracteres usar com base na configuração do sistema operacional, como o valor da variável de ambiente `LANG` ou `LC_ALL` do locale em sistemas Unix ou a configuração da página de código em sistemas Windows. Para sistemas em que o locale está disponível a partir do sistema operacional, o cliente usa-o para definir o conjunto de caracteres padrão em vez de usar o padrão incorporado. Por exemplo, definir `LANG` para `ru_RU.KOI8-R` faz com que o conjunto de caracteres `koi8r` seja usado. Assim, os usuários podem configurar o locale em seu ambiente para uso por clientes MySQL.

O conjunto de caracteres do sistema operacional é mapeado para o conjunto de caracteres MySQL mais próximo, se não houver correspondência exata. Se o cliente não suportar o conjunto de caracteres correspondente, ele usa o padrão compilado. Por exemplo, `ucs2` não é suportado como um conjunto de caracteres de conexão, então ele é mapeado para o padrão compilado.

As aplicações C podem usar detecção automática de conjunto de caracteres com base no ajuste do sistema operacional, invocando `mysql_options()` da seguinte forma antes de se conectar ao servidor:

  ```sql
  mysql_options(mysql,
                MYSQL_SET_CHARSET_NAME,
                MYSQL_AUTODETECT_CHARSET_NAME);
  ```

* Cada cliente suporta uma opção `--default-character-set`, que permite aos usuários especificar explicitamente o conjunto de caracteres para substituir qualquer padrão que o cliente determine de outra forma.

Nota

Alguns conjuntos de caracteres não podem ser usados como conjunto de caracteres do cliente. Tentar usá-los com `--default-character-set` produz um erro. Veja Conjuntos de caracteres do cliente impermissíveis.

Com o cliente **mysql**, para usar um conjunto de caracteres diferente do padrão, você pode executar explicitamente uma declaração `SET NAMES` toda vez que se conectar ao servidor (veja Configuração do Conjunto de Caracteres do Programa de Conexão do Cliente). Para realizar o mesmo resultado mais facilmente, especifique o conjunto de caracteres em seu arquivo de opções. Por exemplo, o seguinte ajuste do arquivo de opções altera as três variáveis de sistema de conjunto de caracteres relacionadas à conexão definidas como `koi8r` toda vez que você invoca o **mysql**:

```sql
[mysql]
default-character-set=koi8r
```

Se você estiver usando o cliente **mysql** com auto-reconexão habilitada (o que não é recomendado), é preferível usar o comando `charset` em vez de `SET NAMES`. Por exemplo:

```sql
mysql> charset koi8r
Charset changed
```

O comando `charset` emite uma declaração `SET NAMES`, e também altera o conjunto de caracteres padrão que o **mysql** usa quando se reconecta após a conexão ter sido perdida.

Ao configurar programas cliente, você também deve considerar o ambiente em que eles são executados. Veja a Seção 10.5, “Configurando o Conjunto de Caracteres e Codificação de Aplicativos”.

### Declarações SQL para Configuração do Conjunto de Caracteres de Conexão

Após a conexão ter sido estabelecida, os clientes podem alterar as variáveis do conjunto de caracteres e do sistema de ordenação para a sessão atual. Essas variáveis podem ser alteradas individualmente usando as declarações `SET`, mas duas declarações mais convenientes afetam as variáveis do sistema de caracteres relacionadas à conexão como um grupo:

* `SET NAMES 'charset_name' [COLLATE 'collation_name']`

`SET NAMES` indica qual conjunto de caracteres o cliente usa para enviar declarações SQL para o servidor. Assim, (set-names.html "13.7.4.3 SET NAMES Statement") `SET NAMES 'cp1251'` informa ao servidor: “mensagens futuras recebidas deste cliente estão no conjunto de caracteres `cp1251`”. Também especifica o conjunto de caracteres que o servidor deve usar para enviar resultados de volta para o cliente. (Por exemplo, indica qual conjunto de caracteres usar para os valores das colunas se você usar uma declaração `SELECT` que produz um conjunto de resultados.)

Uma declaração `SET NAMES 'charset_name'`(set-names.html "13.7.4.3 SET NAMES Statement") é equivalente a estas três declarações:

  ```sql
  SET character_set_client = charset_name;
  SET character_set_results = charset_name;
  SET character_set_connection = charset_name;
  ```

Definir `character_set_connection` para *`charset_name`* também define implicitamente `collation_connection` para a collation padrão para *`charset_name`*. Não é necessário definir explicitamente essa collation. Para especificar uma collation particular a ser usada para `collation_connection`, adicione uma cláusula `COLLATE`:

  ```sql
  SET NAMES 'charset_name' COLLATE 'collation_name'
  ```

* `SET CHARACTER SET 'charset_name`

`SET CHARACTER SET` é semelhante a `SET NAMES`, mas define `character_set_connection` e `collation_connection` para `character_set_database` e `collation_database` (que, como mencionado anteriormente, indicam o conjunto de caracteres e a ordenação do banco de dados padrão).

Uma declaração `SET CHARACTER SET charset_name`(set-character-set.html "13.7.4.2 SET CHARACTER SET Statement") é equivalente a estas três declarações:

  ```sql
  SET character_set_client = charset_name;
  SET character_set_results = charset_name;
  SET collation_connection = @@collation_database;
  ```

Definindo `collation_connection`, também implicitamente define `character_set_connection` para o conjunto de caracteres associado à correção (equivalente à execução de `SET character_set_connection = @@character_set_database`). Não é necessário definir explicitamente `character_set_connection`.

Nota

Alguns conjuntos de caracteres não podem ser usados como conjunto de caracteres do cliente. Tentar usá-los com `SET NAMES`(set-names.html "13.7.4.3 SET NAMES Statement") ou `SET CHARACTER SET`(set-character-set.html "13.7.4.2 SET CHARACTER SET Statement") produz um erro. Veja Conjuntos de caracteres do cliente impermissíveis.

Exemplo: Suponha que `column1` seja definido como `CHAR(5) CHARACTER SET latin2`. Se você não disser `SET NAMES` ou `SET CHARACTER SET`, então para `SELECT column1 FROM t`, o servidor envia de volta todos os valores para `column1` usando o conjunto de caracteres que o cliente especificou quando se conectou. Por outro lado, se você disser `SET NAMES 'latin1'` ou `SET CHARACTER SET 'latin1'` antes de emitir a declaração `SELECT`, o servidor converte os valores de `latin2` para `latin1` logo antes de enviar os resultados de volta. A conversão pode ser perda de dados para caracteres que não estão em ambos os conjuntos de caracteres.

### Gerenciamento de Erros de Conjunto de Caracteres de Conexão

As tentativas de usar um conjunto de caracteres de conexão ou codificação de dados inadequado podem produzir um erro ou fazer com que o servidor retorne ao seu conjunto de caracteres e codificação de dados padrão para uma conexão específica. Esta seção descreve os problemas que podem ocorrer ao configurar o conjunto de caracteres de conexão. Esses problemas podem ocorrer ao estabelecer uma conexão ou ao alterar o conjunto de caracteres dentro de uma conexão estabelecida.

* Gerenciamento de Erros de Tempo de Conexão
* Gerenciamento de Erros de Tempo de Execução

#### Gerenciamento de Erros de Tempo de Conexão

Alguns conjuntos de caracteres não podem ser usados como conjunto de caracteres do cliente; veja Conjuntos de caracteres do cliente impermissíveis. Se você especificar um conjunto de caracteres válido, mas não permitido como um conjunto de caracteres do cliente, o servidor retorna um erro:

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

Se você especificar um conjunto de caracteres que o cliente reconhece, mas o servidor não, o servidor volta ao seu conjunto de caracteres e ordenação padrão. Suponha que o servidor esteja configurado para usar `latin1` e `latin1_swedish_ci` como seus padrões, e que ele não reconheça `gb18030` como um conjunto de caracteres válido. Um cliente que especifica `--default-character-set=gb18030` é capaz de se conectar ao servidor, mas o conjunto de caracteres resultante não é o que o cliente deseja:

```sql
mysql> SHOW SESSION VARIABLES LIKE 'character\_set\_%';
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

Você pode ver que as variáveis do sistema de conexão foram configuradas para refletir um conjunto de caracteres e uma ordenação de `latin1` e `latin1_swedish_ci`. Isso ocorre porque o servidor não pode atender à solicitação de conjunto de caracteres do cliente e volta para seus padrões.

Neste caso, o cliente não pode usar o conjunto de caracteres que deseja, porque o servidor não o suporta. O cliente deve estar disposto a usar um conjunto de caracteres diferente ou se conectar a um servidor diferente que suporte o conjunto de caracteres desejado.

O mesmo problema ocorre em um contexto mais sutil: Quando o cliente informa ao servidor que deve usar um conjunto de caracteres que o servidor reconhece, mas a collation padrão desse conjunto de caracteres no lado do cliente não é conhecida no lado do servidor. Isso ocorre, por exemplo, quando um cliente MySQL 8.0 deseja se conectar a um servidor MySQL 5.7 usando `utf8mb4` como conjunto de caracteres do cliente. Um cliente que especifica `--default-character-set=utf8mb4` é capaz de se conectar ao servidor. No entanto, como no exemplo anterior, o servidor retorna ao seu conjunto de caracteres e collation padrão, não o que o cliente solicitou:

```sql
mysql> SHOW SESSION VARIABLES LIKE 'character\_set\_%';
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

Por que isso ocorre? Afinal, o `utf8mb4` é conhecido pelo cliente 8.0 e pelo servidor 5.7, então ambos os sistemas o reconhecem. Para entender esse comportamento, é necessário entender que, quando o cliente informa ao servidor qual conjunto de caracteres ele deseja usar, na verdade, ele informa ao servidor a collation padrão para esse conjunto de caracteres. Portanto, o comportamento mencionado ocorre devido a uma combinação de fatores:

* A agregação padrão para `utf8mb4` difere entre MySQL 5.7 e 8.0 (`utf8mb4_general_ci` para 5.7, `utf8mb4_0900_ai_ci` para 8.0).

* Quando o cliente 8.0 solicita um conjunto de caracteres de `utf8mb4`, o que ele envia para o servidor é a collation padrão 8.0 `utf8mb4`; ou seja, o `utf8mb4_0900_ai_ci`.

* `utf8mb4_0900_ai_ci` é implementado apenas a partir do MySQL 8.0, portanto, o servidor 5.7 não o reconhece.

* Como o servidor 5.7 não reconhece `utf8mb4_0900_ai_ci`, ele não pode atender à solicitação do conjunto de caracteres do cliente e volta ao seu conjunto de caracteres e ordenação padrão (`latin1` e `latin1_swedish_ci`).

Neste caso, o cliente ainda pode usar `utf8mb4` ao emitir uma declaração `SET NAMES 'utf8mb4'` após a conexão. A collation resultante é a collation padrão `utf8mb4` 5.7; ou seja, `utf8mb4_general_ci`. Se o cliente também desejar uma collation de `utf8mb4_0900_ai_ci`, não conseguirá obtê-la, pois o servidor não reconhece essa collation. O cliente deve estar disposto a usar uma collation diferente `utf8mb4`, ou conectar-se a um servidor do MySQL 8.0 ou superior.

#### Gerenciamento de Erros de Execução

Dentro de uma conexão estabelecida, o cliente pode solicitar uma mudança do conjunto de caracteres e da correção de dados da conexão com `SET NAMES` ou `SET CHARACTER SET`.

Alguns conjuntos de caracteres não podem ser usados como conjunto de caracteres do cliente; veja Conjuntos de caracteres do cliente impermissíveis. Se você especificar um conjunto de caracteres válido, mas não permitido como um conjunto de caracteres do cliente, o servidor retorna um erro:

```sql
mysql> SET NAMES 'ucs2';
ERROR 1231 (42000): Variable 'character_set_client' can't be set to
the value of 'ucs2'
```

Se o servidor não reconhecer o conjunto de caracteres (ou a correção de texto), ele produz um erro:

```sql
mysql> SET NAMES 'bogus';
ERROR 1115 (42000): Unknown character set: 'bogus'

mysql> SET NAMES 'utf8mb4' COLLATE 'bogus';
ERROR 1273 (HY000): Unknown collation: 'bogus'
```

Dica

Um cliente que deseja verificar se seu conjunto de caracteres solicitado foi respeitado pelo servidor pode executar a seguinte declaração após se conectar e verificar que o resultado é o conjunto de caracteres esperado:

```sql
SELECT @@character_set_client;
```