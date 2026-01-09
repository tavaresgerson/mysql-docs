## 12.4 Conjuntos de Caracteres de Conexão e Colagens

Uma "conexão" é o que um programa cliente faz ao se conectar ao servidor, para iniciar uma sessão na qual ele interage com o servidor. O cliente envia instruções SQL, como consultas, através da conexão de sessão. O servidor envia respostas, como conjuntos de resultados ou mensagens de erro, de volta ao cliente através da conexão.

* Variáveis de Conjuntos de Caracteres de Conexão e Colagens
* Conjuntos de Caracteres de Cliente Impermeáveis
* Configuração do Conjunto de Caracteres de Conexão do Programa Cliente
* Instruções SQL para Configuração do Conjunto de Caracteres de Conexão
* Gerenciamento de Erros do Conjunto de Caracteres de Conexão

### Variáveis de Conjuntos de Caracteres de Conexão e Colagens

Várias variáveis de sistemas de conjuntos de caracteres e colagens estão relacionadas à interação de um cliente com o servidor. Algumas dessas variáveis foram mencionadas em seções anteriores:

* As variáveis de sistema `character_set_server` e `collation_server` indicam o conjunto de caracteres e a colagem do servidor. Veja a Seção 12.3.2, “Conjunto de Caracteres e Colagem do Servidor”.

* As variáveis de sistema `character_set_database` e `collation_database` indicam o conjunto de caracteres e a colagem do banco de dados padrão. Veja a Seção 12.3.3, “Conjunto de Caracteres e Colagem do Banco de Dados”.

Variáveis adicionais de sistemas de conjuntos de caracteres e colagens estão envolvidas no gerenciamento de tráfego para a conexão entre um cliente e o servidor. Cada cliente tem variáveis de sistema de conjuntos de caracteres e colagens relacionadas à conexão específicas da sessão. Esses valores das variáveis de sistema de sessão são inicializados no momento da conexão, mas podem ser alterados dentro da sessão.

Várias perguntas sobre o gerenciamento de conjuntos de caracteres e colagens para conexões de clientes podem ser respondidas em termos de variáveis de sistema:

* Que conjunto de caracteres as instruções têm quando saem do cliente?

O servidor assume que a variável de sistema `character_set_client` é o conjunto de caracteres no qual as instruções são enviadas pelo cliente.

Nota

Alguns conjuntos de caracteres não podem ser usados como o conjunto de caracteres do cliente. Consulte Conjuntos de caracteres do cliente impermissíveis.

* Que conjunto de caracteres o servidor deve traduzir as instruções após recebê-las?

  Para determinar isso, o servidor usa as variáveis de sistema `character_set_connection` e `collation_connection`:

  + O servidor converte as instruções enviadas pelo cliente do `character_set_client` para `character_set_connection`. Exceção: Para literais de string que têm um introduzir, como `_utf8mb4` ou `_latin2`, o introduzir determina o conjunto de caracteres. Consulte Seção 12.3.8, “Introdutores de conjunto de caracteres”.

  + `collation_connection` é importante para comparações de strings literais. Para comparações de strings com valores de coluna, `collation_connection` não importa porque as colunas têm sua própria collation, que tem precedência de collation mais alta (consulte Seção 12.8.4, “Coercibilidade de collation em expressões”).

* Que conjunto de caracteres o servidor deve traduzir os resultados da consulta antes de enviá-los de volta ao cliente?

  A variável de sistema `character_set_results` indica o conjunto de caracteres no qual o servidor retorna os resultados da consulta ao cliente. Isso inclui dados de resultado, como valores de coluna, metadados de resultado, como nomes de coluna, e mensagens de erro.

  Para informar ao servidor que não deve realizar nenhuma conversão de conjuntos de resultados ou mensagens de erro, defina `character_set_results` para `NULL` ou `binary`:

  ```
  SET character_set_results = NULL;
  SET character_set_results = binary;
  ```

  Para obter mais informações sobre conjuntos de caracteres e mensagens de erro, consulte Seção 12.6, “Conjunto de caracteres de mensagens de erro”.

Para ver os valores das variáveis de sistema de conjunto de caracteres e collation que se aplicam à sessão atual, use esta instrução:

```
SELECT * FROM performance_schema.session_variables
WHERE VARIABLE_NAME IN (
  'character_set_client', 'character_set_connection',
  'character_set_results', 'collation_connection'
) ORDER BY VARIABLE_NAME;
```

As seguintes declarações mais simples também exibem as variáveis de conexão, mas incluem outras variáveis relacionadas também. Elas podem ser úteis para ver *todas* as variáveis do conjunto de caracteres e do sistema de ordenação:

```
SHOW SESSION VARIABLES LIKE 'character_set_%';
SHOW SESSION VARIABLES LIKE 'collation_%';
```

Os clientes podem ajustar as configurações dessas variáveis ou depender dos padrões (neste caso, você pode pular o restante desta seção). Se você não usar os padrões, deve alterar as configurações de caracteres *para cada conexão com o servidor*.

### Conjuntos de Caracteres de Cliente Imperativos

A variável de sistema `character_set_client` não pode ser definida para certos conjuntos de caracteres:

```
ucs2
utf16
utf16le
utf32
```

Tentar usar qualquer um desses conjuntos de caracteres como o conjunto de caracteres do cliente produz um erro:

```
mysql> SET character_set_client = 'ucs2';
ERROR 1231 (42000): Variable 'character_set_client'
can't be set to the value of 'ucs2'
```

O mesmo erro ocorre se qualquer um desses conjuntos de caracteres for usado nos seguintes contextos, todos os quais resultam em uma tentativa de definir `character_set_client` para o conjunto de caracteres nomeado:

* A opção de comando `--default-character-set=charset_name` usada por programas clientes MySQL, como **mysql** e **mysqladmin**.

* A instrução `SET NAMES 'charset_name'`.

* A instrução `SET CHARACTER SET 'charset_name'`.

### Configuração do Conjunto de Caracteres de Conexão do Programa de Cliente

Quando um cliente se conecta ao servidor, ele indica qual conjunto de caracteres ele deseja usar para a comunicação com o servidor. (Na verdade, o cliente indica a ordenação padrão para esse conjunto de caracteres, a partir da qual o servidor pode determinar o conjunto de caracteres.) O servidor usa essas informações para definir as variáveis de sistema `character_set_client`, `character_set_results`, `character_set_connection` para o conjunto de caracteres e `collation_connection` para a ordenação padrão do conjunto de caracteres. Na verdade, o servidor realiza o equivalente a uma operação `SET NAMES`.

Se o servidor não suportar o conjunto de caracteres ou a ordenação solicitados, ele retorna ao uso do conjunto de caracteres e da ordenação do servidor para configurar a conexão. Para obter mais detalhes sobre esse comportamento de fallback, consulte Gerenciamento de Erros de Conjunto de Caracteres de Conexão.

Os programas clientes **mysql**, **mysqladmin**, **mysqlcheck**, **mysqlimport** e **mysqlshow** determinam o conjunto de caracteres padrão a ser usado da seguinte forma:

* Na ausência de outras informações, cada cliente usa o conjunto de caracteres padrão integrado, geralmente `utf8mb4`.

* Cada cliente pode autodetectar qual conjunto de caracteres usar com base na configuração do sistema operacional, como o valor da variável de ambiente `LANG` ou `LC_ALL` no Unix ou a configuração da página de código no sistema Windows. Para sistemas em que o local é disponível pelo SO, o cliente usa-o para definir o conjunto de caracteres padrão em vez de usar o padrão integrado. Por exemplo, definir `LANG` para `ru_RU.KOI8-R` faz com que o conjunto de caracteres `koi8r` seja usado. Assim, os usuários podem configurar o local em seu ambiente para uso pelos clientes MySQL.

O conjunto de caracteres do SO é mapeado ao conjunto de caracteres MySQL mais próximo se não houver correspondência exata. Se o cliente não suportar o conjunto de caracteres correspondente, ele usa o padrão integrado. Por exemplo, `utf8` e `utf-8` mapeiam para `utf8mb4`, e `ucs2` não é suportado como conjunto de caracteres de conexão, então ele mapeia para o padrão integrado.

As aplicações do sistema operacional podem usar a autodetecção de conjuntos de caracteres com base na configuração do SO invocando `mysql_options()` da seguinte forma antes de se conectar ao servidor:

```
  mysql_options(mysql,
                MYSQL_SET_CHARSET_NAME,
                MYSQL_AUTODETECT_CHARSET_NAME);
  ```

* Cada cliente suporta a opção `--default-character-set`, que permite que os usuários especifiquem explicitamente o conjunto de caracteres para substituir qualquer padrão que o cliente determine de outra forma.

Nota

Alguns conjuntos de caracteres não podem ser usados como o conjunto de caracteres do cliente. Tentar usá-los com `--default-character-set` produz um erro. Veja Conjuntos de Caracteres do Cliente Impermeáveis.

Com o cliente **mysql**, para usar um conjunto de caracteres diferente do padrão, você pode executar explicitamente uma declaração `SET NAMES` toda vez que se conectar ao servidor (veja Configuração do Conjunto de Caracteres do Programa do Cliente). Para obter o mesmo resultado mais facilmente, especifique o conjunto de caracteres em seu arquivo de opções. Por exemplo, o seguinte ajuste de arquivo de opção altera as três variáveis de sistema de conjunto de caracteres relacionadas à conexão para `koi8r` toda vez que você invoca **mysql**:

```
[mysql]
default-character-set=koi8r
```

Se você estiver usando o cliente **mysql** com o auto-reconexão habilitada (o que não é recomendado), é preferível usar o comando `charset` em vez de `SET NAMES`. Por exemplo:

```
mysql> charset koi8r
Charset changed
```

O comando `charset` emite uma declaração `SET NAMES` e também altera o conjunto de caracteres padrão que o **mysql** usa quando se reconecta após a conexão ter sido perdida.

Ao configurar programas cliente, você também deve considerar o ambiente em que eles são executados. Veja Seção 12.5, “Configurando Conjunto de Caracteres e Colagem de Aplicativos”.

### Declarações SQL para Configuração do Conjunto de Caracteres do Cliente

Após a conexão ter sido estabelecida, os clientes podem alterar as variáveis de sistema de conjunto de caracteres e colagem para a sessão atual. Essas variáveis podem ser alteradas individualmente usando declarações `SET`, mas duas declarações mais convenientes afetam as variáveis de sistema de conjunto de caracteres relacionadas à conexão como um grupo:

* `SET NAMES 'charset_name' [COLLATE 'collation_name']`

`SET NAMES` indica qual conjunto de caracteres o cliente usa para enviar instruções SQL para o servidor. Assim, `SET NAMES 'cp1251'` informa ao servidor: “futuras mensagens recebidas deste cliente estão no conjunto de caracteres `cp1251`”. Também especifica o conjunto de caracteres que o servidor deve usar para enviar resultados de volta ao cliente. (Por exemplo, indica qual conjunto de caracteres usar para os valores das colunas se você usar uma instrução `SELECT` que produz um conjunto de resultados.)

Uma declaração `SET NAMES 'charset_name'` é equivalente a estas três declarações:

```
  SET character_set_client = charset_name;
  SET character_set_results = charset_name;
  SET character_set_connection = charset_name;
  ```

Definir `character_set_connection` para *`charset_name`* também define implicitamente `collation_connection` para a collation padrão para *`charset_name`*. Não é necessário definir explicitamente essa collation. Para especificar uma collation particular a ser usada para `collation_connection`, adicione uma cláusula `COLLATE`:

```
  SET NAMES 'charset_name' COLLATE 'collation_name'
  ```

* `SET CHARACTER SET 'charset_name`'

`SET CHARACTER SET` é semelhante a `SET NAMES`, mas define `character_set_connection` e `collation_connection` para `character_set_database` e `collation_database` (que, como mencionado anteriormente, indicam o conjunto de caracteres e a collation da base de dados padrão).

Uma declaração `SET CHARACTER SET charset_name` é equivalente a estas três declarações:

```
  SET character_set_client = charset_name;
  SET character_set_results = charset_name;
  SET collation_connection = @@collation_database;
  ```

Definir `collation_connection` também define implicitamente `character_set_connection` para o conjunto de caracteres associado à collation (equivalente a executar `SET character_set_connection = @@character_set_database`). Não é necessário definir explicitamente `character_set_connection`.

Observação

Alguns conjuntos de caracteres não podem ser usados como conjunto de caracteres do cliente. Tentar usá-los com `SET NAMES` ou `SET CHARACTER SET` produz um erro. Veja Conjuntos de Caracteres do Cliente Impermeáveis.

Exemplo: Suponha que `column1` seja definido como `CHAR(5) CHARACTER SET latin2`. Se você não disser `SET NAMES` ou `SET CHARACTER SET`, então para `SELECT column1 FROM t`, o servidor envia de volta todos os valores para `column1` usando o conjunto de caracteres que o cliente especificou quando se conectou. Por outro lado, se você disser `SET NAMES 'latin1'` ou `SET CHARACTER SET 'latin1'` antes de emitir a instrução `SELECT`, o servidor converte os valores `latin2` para `latin1` logo antes de enviar os resultados de volta. A conversão pode ser perda de dados para caracteres que não estão em ambos os conjuntos de caracteres.

### Gerenciamento de Erros de Conjunto de Caracteres de Conexão

Tentativas de usar um conjunto de caracteres de conexão ou uma codificação inadequados podem produzir um erro ou fazer com que o servidor volte para seu conjunto de caracteres e codificação padrão para uma conexão dada. Esta seção descreve problemas que podem ocorrer ao configurar o conjunto de caracteres de conexão. Esses problemas podem ocorrer ao estabelecer uma conexão ou ao alterar o conjunto de caracteres dentro de uma conexão estabelecida.

* Gerenciamento de Erros de Tempo de Conexão
* Gerenciamento de Erros de Tempo de Execução

#### Gerenciamento de Erros de Tempo de Conexão

Alguns conjuntos de caracteres não podem ser usados como conjunto de caracteres do cliente; veja Conjuntos de Caracteres de Cliente Imperfeitos. Se você especificar um conjunto de caracteres que é válido, mas não permitido como conjunto de caracteres do cliente, o servidor retorna um erro:

```
$> mysql --default-character-set=ucs2
ERROR 1231 (42000): Variable 'character_set_client' can't be set to
the value of 'ucs2'
```

Se você especificar um conjunto de caracteres que o cliente não reconhece, ele produz um erro:

```
$> mysql --default-character-set=bogus
mysql: Character set 'bogus' is not a compiled character set and is
not specified in the '/usr/local/mysql/share/charsets/Index.xml' file
ERROR 2019 (HY000): Can't initialize character set bogus
(path: /usr/local/mysql/share/charsets/)
```

Se você especificar um conjunto de caracteres que o cliente reconhece, mas o servidor não, o servidor retorna ao seu conjunto de caracteres e ordenação padrão. Suponha que o servidor esteja configurado para usar `latin1` e `latin1_swedish_ci` como seus padrões, e que ele não reconheça `gb18030` como um conjunto de caracteres válido. Um cliente que especifica `--default-character-set=gb18030` consegue se conectar ao servidor, mas o conjunto de caracteres resultante não é o que o cliente deseja:

```
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

Você pode ver que as variáveis de sistema de conexão foram configuradas para refletir um conjunto de caracteres e ordenação de `latin1` e `latin1_swedish_ci`. Isso ocorre porque o servidor não pode atender à solicitação de conjunto de caracteres do cliente e retorna ao seu padrão.

Neste caso, o cliente não pode usar o conjunto de caracteres que deseja porque o servidor não o suporta. O cliente deve estar disposto a usar um conjunto de caracteres diferente ou se conectar a um servidor diferente que suporte o conjunto de caracteres desejado.

O mesmo problema ocorre quando o cliente instrui o servidor a usar um conjunto de caracteres que o servidor reconhece, mas a ordenação padrão para esse conjunto de caracteres no lado do cliente não é conhecida no lado do servidor.

#### Gerenciamento de Erros em Tempo de Execução

Dentro de uma conexão estabelecida, o cliente pode solicitar uma mudança no conjunto de caracteres e ordenação de conexão com `SET NAMES` ou `SET CHARACTER SET`.

Alguns conjuntos de caracteres não podem ser usados como conjunto de caracteres do cliente; veja Conjuntos de Caracteres do Cliente Impermeáveis. Se você especificar um conjunto de caracteres válido, mas não permitido como conjunto de caracteres do cliente, o servidor retorna um erro:

```
mysql> SET NAMES 'ucs2';
ERROR 1231 (42000): Variable 'character_set_client' can't be set to
the value of 'ucs2'
```

Se o servidor não reconhecer o conjunto de caracteres (ou a ordenação), ele produz um erro:

```
mysql> SET NAMES 'bogus';
ERROR 1115 (42000): Unknown character set: 'bogus'

mysql> SET NAMES 'utf8mb4' COLLATE 'bogus';
ERROR 1273 (HY000): Unknown collation: 'bogus'
```

Dica
Portuguese (Brazilian):

Um cliente que deseja verificar se o conjunto de caracteres solicitado foi atendido pelo servidor pode executar a seguinte instrução após se conectar e verificar que o resultado é o conjunto de caracteres esperado:

```
SELECT @@character_set_client;
```