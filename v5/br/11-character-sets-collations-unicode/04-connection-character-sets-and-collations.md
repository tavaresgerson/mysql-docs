## 10.4 Conjuntos de caracteres de conexão e codificações

Uma "conexão" é o que um programa cliente faz ao se conectar ao servidor, para iniciar uma sessão na qual ele interage com o servidor. O cliente envia instruções SQL, como consultas, através da conexão da sessão. O servidor envia respostas, como conjuntos de resultados ou mensagens de erro, de volta ao cliente através da conexão.

- Variáveis de Conjunto de Caracteres e Sistema de Cotação de Conexão
- Conjunto de caracteres de cliente impermissível
- Configuração do Conjunto de Caracteres da Conexão do Programa do Cliente
- Instruções SQL para configuração do conjunto de caracteres de conexão
- Tratamento de Erros no Conjunto de Caracteres de Conexão

### Variáveis de Conjunto de Caracteres e Sistema de Cotação de Conexão

Várias variáveis de conjuntos de caracteres e sistemas de ordenação estão relacionadas à interação do cliente com o servidor. Algumas dessas variáveis foram mencionadas em seções anteriores:

- As variáveis de sistema `character_set_server` e `collation_server` indicam o conjunto de caracteres do servidor e a colagem. Consulte a Seção 10.3.2, “Conjunto de caracteres do servidor e colagem”.

- As variáveis de sistema `character_set_database` e `collation_database` indicam o conjunto de caracteres e a collation do banco de dados padrão. Veja a Seção 10.3.3, “Conjunto de caracteres e collation do banco de dados”.

Variáveis adicionais do conjunto de caracteres e do sistema de ordenação estão envolvidas no gerenciamento do tráfego para a conexão entre um cliente e o servidor. Cada cliente tem variáveis específicas de conjunto de caracteres e sistema de ordenação relacionadas à conexão. Esses valores das variáveis do sistema de sessão são inicializados no momento da conexão, mas podem ser alterados durante a sessão.

Várias perguntas sobre o conjunto de caracteres e o tratamento de ordenação para conexões de clientes podem ser respondidas em termos de variáveis do sistema:

- Que conjunto de caracteres os comandos têm quando saem do cliente?

  O servidor considera a variável de sistema `character_set_client` como o conjunto de caracteres no qual as instruções são enviadas pelo cliente.

  Nota

  Alguns conjuntos de caracteres não podem ser usados como conjunto de caracteres do cliente. Veja Conjuntos de caracteres do cliente impermissíveis.

- Que conjunto de caracteres o servidor deve traduzir as declarações após recebê-las?

  Para determinar isso, o servidor usa as variáveis de sistema `character_set_connection` e `collation_connection`:

  - O servidor converte as declarações enviadas pelo cliente de `character_set_client` para `character_set_connection`. Exceção: Para as cadeias de caracteres literais que têm um introducer, como `_utf8mb4` ou `_latin2`, o introducer determina o conjunto de caracteres. Veja a Seção 10.3.8, “Introdutores de Conjunto de Caracteres”.

  - `collation_connection` é importante para comparações de strings literais. Para comparações de strings com valores de coluna, `collation_connection` não importa, pois as colunas têm sua própria collation, que tem precedência de collation mais alta (veja a Seção 10.8.4, “Coercibilidade de collation em expressões”).

- Qual conjunto de caracteres o servidor deve usar para traduzir os resultados da consulta antes de enviá-los de volta ao cliente?

  A variável de sistema `character_set_results` indica o conjunto de caracteres no qual o servidor retorna os resultados da consulta ao cliente. Isso inclui dados de resultado, como valores de coluna, metadados de resultado, como nomes de colunas e mensagens de erro.

  Para indicar ao servidor que não realize nenhuma conversão de conjuntos de resultados ou mensagens de erro, defina `character_set_results` para `NULL` ou `binary`:

  ```sql
  SET character_set_results = NULL;
  SET character_set_results = binary;
  ```

  Para obter mais informações sobre conjuntos de caracteres e mensagens de erro, consulte a Seção 10.6, “Conjunto de caracteres de mensagens de erro”.

Para ver os valores das variáveis de conjunto de caracteres e sistema de ordenação que se aplicam à sessão atual, use esta instrução:

```sql
SELECT * FROM performance_schema.session_variables
WHERE VARIABLE_NAME IN (
'character_set_client', 'character_set_connection',
'character_set_results', 'collation_connection'
) ORDER BY VARIABLE_NAME;
```

As seguintes declarações mais simples também exibem as variáveis de conexão, mas incluem outras variáveis relacionadas também. Elas podem ser úteis para ver *todas* as variáveis do conjunto de caracteres e do sistema de ordenação:

```sql
SHOW SESSION VARIABLES LIKE 'character_set_%';
SHOW SESSION VARIABLES LIKE 'collation_%';
```

Os clientes podem ajustar as configurações dessas variáveis ou depender dos padrões (neste caso, você pode pular o restante desta seção). Se você não usar os padrões, você deve alterar as configurações de caracteres *para cada conexão com o servidor.*

### Conjunto de caracteres de cliente impermissível

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

O mesmo erro ocorre se algum desses conjuntos de caracteres for usado nos seguintes contextos, todos os quais resultam em uma tentativa de definir `character_set_client` para o conjunto de caracteres nomeado:

- A opção de comando `--default-character-set=charset_name`, usada por programas clientes do MySQL, como **mysql** e **mysqladmin**.

- A declaração `SET NAMES 'charset_name'`.

- A declaração `SET CHARACTER SET 'charset_name'`.

### Configuração do Conjunto de Caracteres da Conexão do Programa do Cliente

Quando um cliente se conecta ao servidor, ele indica qual conjunto de caracteres deseja usar para a comunicação com o servidor. (Na verdade, o cliente indica a collation padrão para esse conjunto de caracteres, a partir da qual o servidor pode determinar o conjunto de caracteres.) O servidor usa essas informações para definir as variáveis de sistema `character_set_client`, `character_set_results` e `character_set_connection` para o conjunto de caracteres e `collation_connection` para a collation padrão do conjunto de caracteres. Na prática, o servidor realiza o equivalente a uma operação `SET NAMES`.

Se o servidor não suportar o conjunto de caracteres ou a ordem de classificação solicitados, ele usa o conjunto de caracteres e a ordem de classificação do servidor para configurar a conexão. Para obter informações adicionais sobre esse comportamento de fallback, consulte Gerenciamento de Erros de Conjunto de Caracteres de Conexão.

Os programas clientes **mysql**, **mysqladmin**, **mysqlcheck**, **mysqlimport** e **mysqlshow** determinam o conjunto de caracteres padrão a ser usado da seguinte forma:

- Na ausência de outras informações, cada cliente usa o conjunto de caracteres padrão incorporado, geralmente `latin1`.

- Cada cliente pode autodetectar qual conjunto de caracteres usar com base na configuração do sistema operacional, como o valor da variável de ambiente `LANG` ou `LC_ALL` em sistemas Unix ou a configuração da página de código em sistemas Windows. Para sistemas nos quais o local é disponível a partir do sistema operacional, o cliente usa-o para definir o conjunto de caracteres padrão em vez de usar o padrão embutido. Por exemplo, definir `LANG` para `ru_RU.KOI8-R` faz com que o conjunto de caracteres `koi8r` seja usado. Assim, os usuários podem configurar o local em seu ambiente para uso pelos clientes MySQL.

  O conjunto de caracteres do sistema operacional é mapeado para o conjunto de caracteres MySQL mais próximo, se não houver correspondência exata. Se o cliente não suportar o conjunto de caracteres de correspondência, ele usa o padrão predefinido compilado. Por exemplo, `ucs2` não é suportado como conjunto de caracteres de conexão, então ele é mapeado para o padrão predefinido compilado.

  As aplicações C podem usar a autodetecção de conjuntos de caracteres com base na configuração do sistema operacional, invocando `mysql_options()` da seguinte forma antes de se conectar ao servidor:

  ```sql
  mysql_options(mysql,
                MYSQL_SET_CHARSET_NAME,
                MYSQL_AUTODETECT_CHARSET_NAME);
  ```

- Cada cliente suporta a opção `--default-character-set`, que permite aos usuários especificar explicitamente o conjunto de caracteres para substituir qualquer padrão que o cliente determine de outra forma.

  Nota

  Alguns conjuntos de caracteres não podem ser usados como conjunto de caracteres do cliente. Tentar usá-los com `--default-character-set` produz um erro. Veja Conjuntos de caracteres do cliente impermissíveis.

Com o cliente **mysql**, para usar um conjunto de caracteres diferente do padrão, você pode executar explicitamente uma instrução `SET NAMES` toda vez que se conectar ao servidor (veja Configuração de Conjunto de Caracteres do Programa de Cliente). Para obter o mesmo resultado de forma mais fácil, especifique o conjunto de caracteres em seu arquivo de opções. Por exemplo, o seguinte ajuste no arquivo de opções altera as três variáveis de sistema de conjunto de caracteres relacionadas à conexão para `koi8r` toda vez que você invoca **mysql**:

```sql
[mysql]
default-character-set=koi8r
```

Se você estiver usando o cliente **mysql** com o recurso de reconexão automática habilitado (o que não é recomendado), é preferível usar o comando `charset` em vez de `SET NAMES`. Por exemplo:

```sql
mysql> charset koi8r
Charset changed
```

O comando `charset` emite uma declaração `SET NAMES` e também altera o conjunto de caracteres padrão que o **mysql** usa quando ele se reconecta após a conexão ter sido perdida.

Ao configurar programas cliente, você também deve considerar o ambiente em que eles serão executados. Consulte a Seção 10.5, “Configurando o Conjunto de Caracteres e a Codificação da Aplicação”.

### Instruções SQL para configuração do conjunto de caracteres de conexão

Após a conexão ser estabelecida, os clientes podem alterar as variáveis de conjunto de caracteres e sistema de ordenação para a sessão atual. Essas variáveis podem ser alteradas individualmente usando instruções `SET`, mas duas instruções mais convenientes afetam as variáveis de sistema de conjunto de caracteres relacionadas à conexão como um grupo:

- `SET NAMES 'charset_name' [COLLATE 'collation_name']`

  `SET NAMES` indica qual conjunto de caracteres o cliente usa para enviar instruções SQL para o servidor. Assim, `SET NAMES 'cp1251'` informa ao servidor: “mensagens futuras recebidas deste cliente estão no conjunto de caracteres `cp1251`”. Também especifica o conjunto de caracteres que o servidor deve usar para enviar resultados de volta ao cliente. (Por exemplo, indica qual conjunto de caracteres usar para os valores das colunas se você usar uma instrução `SELECT` que produz um conjunto de resultados.)

  Uma declaração `SET NAMES 'charset_name'` é equivalente a estas três declarações:

  ```sql
  SET character_set_client = charset_name;
  SET character_set_results = charset_name;
  SET character_set_connection = charset_name;
  ```

  Definir `character_set_connection` para *`charset_name`* também define implicitamente `collation_connection` para a collation padrão para *`charset_name`*. Não é necessário definir explicitamente essa collation. Para especificar uma collation particular a ser usada para `collation_connection`, adicione uma cláusula `COLLATE`:

  ```sql
  SET NAMES 'charset_name' COLLATE 'collation_name'
  ```

- `SET CHARACTER SET 'nome_do_charset'`

  `SET CHARACTER SET` é semelhante a `SET NAMES`, mas define `character_set_connection` e `collation_connection` para `character_set_database` e `collation_database` (que, como mencionado anteriormente, indicam o conjunto de caracteres e a collation do banco de dados padrão).

  Uma declaração `SET CHARACTER SET charset_name` é equivalente a estas três declarações:

  ```sql
  SET character_set_client = charset_name;
  SET character_set_results = charset_name;
  SET collation_connection = @@collation_database;
  ```

  Definir `collation_connection` também define implicitamente `character_set_connection` para o conjunto de caracteres associado à collation (equivalente a executar `SET character_set_connection = @@character_set_database`). Não é necessário definir `character_set_connection` explicitamente.

Nota

Alguns conjuntos de caracteres não podem ser usados como conjunto de caracteres do cliente. Tentar usá-los com `SET NAMES` ou `SET CHARACTER SET` produz um erro. Veja Conjuntos de caracteres do cliente impermissíveis.

Exemplo: Suponha que `column1` seja definido como `CHAR(5) CHARACTER SET latin2`. Se você não disser `SET NAMES` ou `SET CHARACTER SET`, então para `SELECT column1 FROM t`, o servidor envia de volta todos os valores para `column1` usando o conjunto de caracteres especificado pelo cliente quando ele se conectou. Por outro lado, se você disser `SET NAMES 'latin1'` ou `SET CHARACTER SET 'latin1'` antes de emitir a instrução `SELECT`, o servidor converte os valores `latin2` para `latin1` logo antes de enviar os resultados de volta. A conversão pode ser perda de dados para caracteres que não estão em ambos os conjuntos de caracteres.

### Tratamento de Erros no Conjunto de Caracteres de Conexão

Tentativas de usar um conjunto de caracteres de conexão ou uma ordem de classificação inadequados podem produzir um erro ou fazer com que o servidor volte ao conjunto de caracteres e à ordem de classificação padrão para uma conexão específica. Esta seção descreve os problemas que podem ocorrer ao configurar o conjunto de caracteres de conexão. Esses problemas podem ocorrer ao estabelecer uma conexão ou ao alterar o conjunto de caracteres dentro de uma conexão estabelecida.

- Tratamento de Erros de Tempo de Conexão
- Tratamento de Erros em Tempo de Execução

#### Tratamento de Erros de Tempo de Conexão

Alguns conjuntos de caracteres não podem ser usados como conjunto de caracteres do cliente; veja Conjuntos de caracteres do cliente impermissíveis. Se você especificar um conjunto de caracteres válido, mas não permitido como conjunto de caracteres do cliente, o servidor retorna um erro:

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

Se você especificar um conjunto de caracteres que o cliente reconhece, mas o servidor não, o servidor retorna ao seu conjunto de caracteres e ordenação padrão. Suponha que o servidor esteja configurado para usar `latin1` e `latin1_swedish_ci` como seus padrões, e que ele não reconheça `gb18030` como um conjunto de caracteres válido. Um cliente que especifica `--default-character-set=gb18030` consegue se conectar ao servidor, mas o conjunto de caracteres resultante não é o que o cliente deseja:

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

Você pode ver que as variáveis do sistema de conexão foram configuradas para refletir um conjunto de caracteres e uma ordenação de `latin1` e `latin1_swedish_ci`. Isso ocorre porque o servidor não consegue atender à solicitação do conjunto de caracteres do cliente e retorna aos valores padrão.

Nesse caso, o cliente não pode usar o conjunto de caracteres que deseja, porque o servidor não o suporta. O cliente deve estar disposto a usar um conjunto de caracteres diferente ou se conectar a um servidor diferente que suporte o conjunto de caracteres desejado.

O mesmo problema ocorre em um contexto mais sutil: quando o cliente instrui o servidor a usar um conjunto de caracteres que o servidor reconhece, mas a collation padrão para esse conjunto de caracteres no lado do cliente não é conhecida no lado do servidor. Isso ocorre, por exemplo, quando um cliente MySQL 8.0 deseja se conectar a um servidor MySQL 5.7 usando `utf8mb4` como o conjunto de caracteres do cliente. Um cliente que especifica `--default-character-set=utf8mb4` consegue se conectar ao servidor. No entanto, como no exemplo anterior, o servidor retorna ao seu conjunto de caracteres e collation padrão, e não ao solicitado pelo cliente:

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

Por que isso ocorre? Afinal, o `utf8mb4` é conhecido pelo cliente 8.0 e pelo servidor 5.7, então ambos o reconhecem. Para entender esse comportamento, é necessário entender que, quando o cliente informa ao servidor qual conjunto de caracteres ele deseja usar, ele realmente está informando ao servidor a collation padrão para esse conjunto de caracteres. Portanto, o comportamento mencionado acima ocorre devido a uma combinação de fatores:

- A collation padrão para `utf8mb4` difere entre o MySQL 5.7 e 8.0 (`utf8mb4_general_ci` para 5.7, `utf8mb4_0900_ai_ci` para 8.0).

- Quando o cliente 8.0 solicita um conjunto de caracteres de `utf8mb4`, o que ele envia para o servidor é a collation padrão 8.0 `utf8mb4`, ou seja, `utf8mb4_0900_ai_ci`.

- `utf8mb4_0900_ai_ci` é implementado apenas a partir do MySQL 8.0, então o servidor 5.7 não o reconhece.

- Como o servidor 5.7 não reconhece `utf8mb4_0900_ai_ci`, ele não pode atender à solicitação do conjunto de caracteres do cliente e retorna ao seu conjunto de caracteres e ordenação padrão (`latin1` e `latin1_swedish_ci`).

Nesse caso, o cliente ainda pode usar `utf8mb4` ao emitir uma declaração `SET NAMES 'utf8mb4'` após a conexão. A collation resultante é a collation padrão `utf8mb4` da versão 5.7; ou seja, `utf8mb4_general_ci`. Se o cliente também quiser uma collation de `utf8mb4_0900_ai_ci`, não conseguirá alcançá-la porque o servidor não reconhece essa collation. O cliente deve estar disposto a usar uma collation `utf8mb4` diferente ou se conectar a um servidor do MySQL 8.0 ou superior.

#### Tratamento de Erros em Tempo de Execução

Dentro de uma conexão estabelecida, o cliente pode solicitar uma mudança do conjunto de caracteres e da ordenação da conexão com `SET NAMES` ou `SET CHARACTER SET`.

Alguns conjuntos de caracteres não podem ser usados como conjunto de caracteres do cliente; veja Conjuntos de caracteres do cliente impermissíveis. Se você especificar um conjunto de caracteres válido, mas não permitido como conjunto de caracteres do cliente, o servidor retorna um erro:

```sql
mysql> SET NAMES 'ucs2';
ERROR 1231 (42000): Variable 'character_set_client' can't be set to
the value of 'ucs2'
```

Se o servidor não reconhecer o conjunto de caracteres (ou a ordenação), ele produzirá um erro:

```sql
mysql> SET NAMES 'bogus';
ERROR 1115 (42000): Unknown character set: 'bogus'

mysql> SET NAMES 'utf8mb4' COLLATE 'bogus';
ERROR 1273 (HY000): Unknown collation: 'bogus'
```

Dica

Um cliente que deseja verificar se o conjunto de caracteres solicitado foi atendido pelo servidor pode executar a seguinte instrução após se conectar e verificar que o resultado é o conjunto de caracteres esperado:

```sql
SELECT @@character_set_client;
```
