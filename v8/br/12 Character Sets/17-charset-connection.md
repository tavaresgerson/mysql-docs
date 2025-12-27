## 12.4 Conjuntos de Caracteres de Conexão e Colagens

Uma "conexão" é o que um programa cliente faz ao se conectar ao servidor, para iniciar uma sessão na qual ele interage com o servidor. O cliente envia instruções SQL, como consultas, através da conexão de sessão. O servidor envia respostas, como conjuntos de resultados ou mensagens de erro, através da conexão de volta ao cliente.

*  Variáveis de Conjuntos de Caracteres de Conexão e Colagens
*  Conjuntos de Caracteres de Cliente Impermeáveis
*  Configuração do Conjunto de Caracteres de Conexão do Programa Cliente
*  Instruções SQL para Configuração do Conjunto de Caracteres de Conexão
*  Tratamento de Erros do Conjunto de Caracteres de Conexão

### Variáveis de Conjuntos de Caracteres de Conexão e Colagens

Várias variáveis de sistemas de conjuntos de caracteres e colagens estão relacionadas com a interação de um cliente com o servidor. Algumas dessas variáveis foram mencionadas em seções anteriores:

* As variáveis de sistema `character_set_server` e `collation_server` indicam o conjunto de caracteres e a colagem do servidor. Consulte a Seção 12.3.2, “Conjunto de Caracteres e Colagem do Servidor”.
* As variáveis de sistema `character_set_database` e `collation_database` indicam o conjunto de caracteres e a colagem do banco de dados padrão. Consulte a Seção 12.3.3, “Conjunto de Caracteres e Colagem do Banco de Dados”.

Variáveis adicionais de sistemas de conjuntos de caracteres e colagens estão envolvidas no tratamento do tráfego para a conexão entre um cliente e o servidor. Cada cliente tem variáveis de sistema de conjuntos de caracteres e colagens relacionadas à conexão específicas da sessão. Esses valores das variáveis de sistema de sessão são inicializados no momento da conexão, mas podem ser alterados dentro da sessão.

Várias perguntas sobre o tratamento de conjuntos de caracteres e colagens para conexões de clientes podem ser respondidas em termos de variáveis de sistema:

* Que conjunto de caracteres as instruções têm quando saem do cliente?

  O servidor toma a variável de sistema `character_set_client` como o conjunto de caracteres no qual as instruções são enviadas pelo cliente.

  ::: info Nota

Alguns conjuntos de caracteres não podem ser usados como o conjunto de caracteres do cliente. Veja Conjuntos de Caracteres do Cliente Impermitidos.


  :::
* Que conjunto de caracteres o servidor deve traduzir as declarações para após recebê-las?

  Para determinar isso, o servidor usa as variáveis de sistema `character_set_connection` e `collation_connection`:

  + O servidor converte as declarações enviadas pelo cliente do `character_set_client` para `character_set_connection`. Exceção: Para literais de string que têm um introduzir, como `_utf8mb4` ou `_latin2`, o introduzir determina o conjunto de caracteres. Veja Seção 12.3.8, “Introdutores de Conjunto de Caracteres”.
  +  `collation_connection` é importante para comparações de strings literais. Para comparações de strings com valores de coluna, `collation_connection` não importa porque as colunas têm sua própria collation, que tem precedência de collation mais alta (veja Seção 12.8.4, “Coercibilidade de Collation em Expressões”).
* Que conjunto de caracteres o servidor deve traduzir os resultados da consulta antes de enviá-los de volta ao cliente?

  A variável de sistema `character_set_results` indica o conjunto de caracteres no qual o servidor retorna os resultados da consulta ao cliente. Isso inclui dados de resultado, como valores de coluna, metadados de resultado, como nomes de coluna, e mensagens de erro.

  Para dizer ao servidor que não deve realizar nenhuma conversão de conjuntos de resultados ou mensagens de erro, defina `character_set_results` para `NULL` ou `binary`:

  ```
  SET character_set_results = NULL;
  SET character_set_results = binary;
  ```

  Para mais informações sobre conjuntos de caracteres e mensagens de erro, veja Seção 12.6, “Conjunto de Caracteres de Mensagens de Erro”.

Para ver os valores das variáveis de sistema de conjuntos de caracteres e collation que se aplicam à sessão atual, use esta declaração:

```
SELECT * FROM performance_schema.session_variables
WHERE VARIABLE_NAME IN (
  'character_set_client', 'character_set_connection',
  'character_set_results', 'collation_connection'
) ORDER BY VARIABLE_NAME;
```

As seguintes declarações mais simples também exibem as variáveis de conexão, mas incluem outras variáveis relacionadas também. Elas podem ser úteis para ver *todos* os conjuntos de caracteres e variáveis de collation:

```
SHOW SESSION VARIABLES LIKE 'character\_set\_%';
SHOW SESSION VARIABLES LIKE 'collation\_%';
```

Os clientes podem ajustar as configurações dessas variáveis ou depender dos padrões (neste caso, você pode ignorar o restante desta seção). Se você não usar os padrões, deve alterar as configurações de caracteres *para cada conexão com o servidor*.

### Conjuntos de Caracteres de Cliente Impermitidos

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

* A opção de comando `--default-character-set=charset_name` usada por programas clientes MySQL, como `mysql` e `mysqladmin`.
* A instrução `SET NAMES 'charset_name'` .
* A instrução `SET CHARACTER SET 'charset_name'` .

### Configuração do Conjunto de Caracteres de Conexão do Programa de Cliente

Quando um cliente se conecta ao servidor, ele indica qual conjunto de caracteres ele deseja usar para a comunicação com o servidor. (Na verdade, o cliente indica a collation padrão para esse conjunto de caracteres, a partir da qual o servidor pode determinar o conjunto de caracteres.) O servidor usa essas informações para definir as variáveis de sistema `character_set_client`, `character_set_results`, `character_set_connection` para o conjunto de caracteres e `collation_connection` para a collation padrão do conjunto de caracteres. Na prática, o servidor realiza o equivalente a uma operação `SET NAMES`.

Se o servidor não suportar o conjunto de caracteres ou collation solicitados, ele retorna ao uso do conjunto de caracteres e collation do servidor para configurar a conexão. Para obter detalhes adicionais sobre esse comportamento de fallback, consulte Gerenciamento de Erros de Conjunto de Caracteres de Conexão.

Os programas clientes `mysql`, `mysqladmin`, `mysqlcheck`, `mysqlimport` e `mysqlshow` determinam o conjunto de caracteres padrão a usar da seguinte forma:

* Na ausência de outras informações, cada cliente usa o conjunto de caracteres padrão embutido, geralmente `utf8mb4`.
* Cada cliente pode autodetectar qual conjunto de caracteres usar com base na configuração do sistema operacional, como o valor da variável de ambiente `LANG` ou `LC_ALL` em sistemas Unix ou a configuração da página de código em sistemas Windows. Para sistemas nos quais o local é disponível pelo sistema operacional, o cliente usa-o para definir o conjunto de caracteres padrão em vez de usar o padrão embutido. Por exemplo, definir `LANG` para `ru_RU.KOI8-R` faz com que o conjunto de caracteres `koi8r` seja usado. Assim, os usuários podem configurar o local em seu ambiente para uso pelos clientes MySQL.

  O conjunto de caracteres do sistema operacional é mapeado para o conjunto de caracteres MySQL mais próximo se não houver correspondência exata. Se o cliente não suportar o conjunto de caracteres correspondente, ele usa o padrão embutido. Por exemplo, `utf8` e `utf-8` mapeiam para `utf8mb4`, e `ucs2` não é suportado como conjunto de caracteres de conexão, então ele mapeia para o padrão embutido.

  Aplicações C podem usar a autodetecção de conjuntos de caracteres com base na configuração do sistema operacional invocando `mysql_options()` da seguinte forma antes de se conectar ao servidor:

  ```
  mysql_options(mysql,
                MYSQL_SET_CHARSET_NAME,
                MYSQL_AUTODETECT_CHARSET_NAME);
  ```
* Cada cliente suporta a opção `--default-character-set`, que permite que os usuários especifiquem explicitamente o conjunto de caracteres para substituir qualquer padrão que o cliente determine de outra forma.

  ::: info Nota

  Alguns conjuntos de caracteres não podem ser usados como conjunto de caracteres do cliente. Tentar usá-los com `--default-character-set` produz um erro. Veja Conjuntos de Caracteres de Cliente Impermeáveis.

Com o cliente `mysql`, para usar um conjunto de caracteres diferente do padrão, você pode executar explicitamente uma instrução `SET NAMES` toda vez que se conectar ao servidor (veja Configuração do Conjunto de Caracteres do Programa de Cliente). Para obter o mesmo resultado mais facilmente, especifique o conjunto de caracteres no seu arquivo de opções. Por exemplo, o seguinte ajuste no arquivo de opções altera as três variáveis de sistema de conjunto de caracteres relacionadas à conexão para `koi8r` toda vez que você invoca o `mysql`:

```
[mysql]
default-character-set=koi8r
```

Se você estiver usando o cliente `mysql` com o auto-reconexão habilitada (o que não é recomendado), é preferível usar o comando `charset` em vez de `SET NAMES`. Por exemplo:

```
mysql> charset koi8r
Charset changed
```

O comando `charset` emite uma instrução `SET NAMES`, e também altera o conjunto de caracteres padrão que o `mysql` usa quando se reconecta após a conexão ter sido perdida.

Ao configurar programas cliente, você também deve considerar o ambiente em que eles são executados. Veja a Seção 12.5, “Configurando Conjunto de Caracteres e Colagem de Aplicativos”.

### Instruções SQL para Configuração do Conjunto de Caracteres da Conexão

Após a conexão ter sido estabelecida, os clientes podem alterar as variáveis de sistema de conjunto de caracteres e colagem para a sessão atual. Essas variáveis podem ser alteradas individualmente usando instruções `SET`, mas duas instruções mais convenientes afetam as variáveis de sistema de conjunto de caracteres relacionadas à conexão como um grupo:

* `SET NAMES 'charset_name' [COLLATE 'collation_name']`

   `SET NAMES` indica que conjunto de caracteres o cliente usa para enviar instruções SQL para o servidor. Assim, `SET NAMES 'cp1251'` diz ao servidor: “mensagens futuras recebidas deste cliente estão no conjunto de caracteres `cp1251`.” Também especifica o conjunto de caracteres que o servidor deve usar para enviar resultados de volta ao cliente. (Por exemplo, indica que conjunto de caracteres usar para valores de coluna se você usar uma instrução `SELECT` que produz um conjunto de resultados.)

Uma declaração `SET NAMES 'charset_name'` é equivalente a estas três declarações:

```
  SET character_set_client = charset_name;
  SET character_set_results = charset_name;
  SET character_set_connection = charset_name;
  ```

Definir `character_set_connection` para *`charset_name`* também define implicitamente `collation_connection` para a collation padrão para *`charset_name`*. Não é necessário definir explicitamente essa collation. Para especificar uma collation particular a ser usada para `collation_connection`, adicione uma cláusula `COLLATE`:

```
  SET NAMES 'charset_name' COLLATE 'collation_name'
  ```Xpol3IzNOH```
  SET character_set_client = charset_name;
  SET character_set_results = charset_name;
  SET collation_connection = @@collation_database;
  ```lQogILx7JK```
$> mysql --default-character-set=ucs2
ERROR 1231 (42000): Variable 'character_set_client' can't be set to
the value of 'ucs2'
```hAOrts8bN6```
$> mysql --default-character-set=bogus
mysql: Character set 'bogus' is not a compiled character set and is
not specified in the '/usr/local/mysql/share/charsets/Index.xml' file
ERROR 2019 (HY000): Can't initialize character set bogus
(path: /usr/local/mysql/share/charsets/)
```zWiKhe5rnG```
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
```YBwuC35RqA```
mysql> SET NAMES 'ucs2';
ERROR 1231 (42000): Variable 'character_set_client' can't be set to
the value of 'ucs2'
```zjZcbZo71Q```
mysql> SET NAMES 'bogus';
ERROR 1115 (42000): Unknown character set: 'bogus'

mysql> SET NAMES 'utf8mb4' COLLATE 'bogus';
ERROR 1273 (HY000): Unknown collation: 'bogus'
```sks1ZYsqAO```