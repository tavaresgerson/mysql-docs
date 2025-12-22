### 6.2.5 Conexão ao servidor usando strings semelhantes a URI ou pares de chave-valor

Esta seção descreve o uso de strings de conexão semelhantes a URI ou pares de valores-chave para especificar como estabelecer conexões com o servidor MySQL, para clientes como o MySQL Shell. Para informações sobre como estabelecer conexões usando opções de linha de comando, para clientes como `mysql` ou `mysqldump`, consulte a Seção 6.2.4, Conectando-se ao servidor MySQL usando opções de comando. Para informações adicionais se você não conseguir se conectar, consulte a Seção 8.2.22, Solução de problemas conectando-se ao MySQL.

::: info Note

O termo URI-like significa sintaxe de cadeia de conexão que é semelhante, mas não idêntica, à sintaxe URI (Uniform Resource Identifier) definida pelo \[RFC 3986]

:::

Os seguintes clientes MySQL suportam a conexão a um servidor MySQL usando uma string de conexão semelhante a URI ou pares chave-valor:

- Shell do MySQL
- Conectores MySQL que implementam X DevAPI

Esta seção documenta todos os parâmetros válidos de conexão de pares de strings e de valores-chave semelhantes a URI, muitos dos quais são semelhantes aos especificados com as opções de linha de comando:

- Os parâmetros especificados com uma string semelhante a URI usam uma sintaxe como `myuser@example.com:3306/main-schema`.
- Parâmetros especificados com pares chave-valor usam uma sintaxe como `{user:'myuser', host:'example.com', port:3306, schema:'main-schema'}`.

Os parâmetros de conexão não são sensíveis a maiúsculas e minúsculas. Cada parâmetro, se especificado, pode ser dado apenas uma vez. Se um parâmetro for especificado mais de uma vez, ocorre um erro.

Esta secção abrange os seguintes temas:

- Parâmetros de ligação à base
- Parâmetros adicionais de ligação
- Conexão usando strings de conexão semelhantes a URI
- Conexão usando pares de chaves e valores

#### Parâmetros de ligação à base

A discussão a seguir descreve os parâmetros disponíveis ao especificar uma conexão com o MySQL. Esses parâmetros podem ser fornecidos usando uma string que esteja em conformidade com a sintaxe de URI de base (ver Conectar Usando Strings de Conexão do Tipo URI), ou como pares de chave-valor (ver Conectar Usando Pares de Chave-Valor).

- `scheme`: O protocolo de transporte a ser usado. Use `mysqlx` para conexões de protocolo X e `mysql` para conexões clássicas de protocolo MySQL. Se nenhum protocolo for especificado, o servidor tentará adivinhar o protocolo. Conectores que suportam o DNS SRV podem usar o esquema `mysqlx+srv` (veja Conexões usando registros DNS SRV).
- `user`: A conta de utilizador do MySQL para fornecer o processo de autenticação.
- `password`: A senha a utilizar para o processo de autenticação.

  Advertência

  Especificar uma senha explícita na especificação de conexão é inseguro e não é recomendado.
- `host`: O host em que a instância do servidor está sendo executada. O valor pode ser um nome de host, endereço IPv4 ou endereço IPv6. Se nenhum host for especificado, o padrão é `localhost`.
- `port`: A porta de rede TCP/IP na qual o servidor MySQL de destino está ouvindo para conexões. Se nenhuma porta for especificada, o padrão é 33060 para conexões de protocolo X e 3306 para conexões clássicas de protocolo MySQL.
- `socket`: O caminho para um arquivo de soquete do Unix ou o nome de um tubo nomeado do Windows. Os valores são caminhos de arquivo locais. Em strings semelhantes a URI, eles devem ser codificados, usando codificação de porcentagem ou cercando o caminho com parênteses. Parênteses eliminam a necessidade de codificar caracteres de porcentagem, como o separador de diretório `/`. Por exemplo, para se conectar como `root@localhost` usando o soquete do Unix `/tmp/mysql.sock`, especifique o caminho usando codificação de porcentagem como `root@localhost?socket=%2Ftmp%2Fmysql.sock`, ou usando parênteses como `root@localhost?socket=(/tmp/mysql.sock)`.
- `schema`: O banco de dados padrão para a conexão. Se nenhum banco de dados for especificado, a conexão não tem banco de dados padrão.

A manipulação de `localhost` no Unix depende do tipo de protocolo de transporte. Conexões usando o protocolo clássico do MySQL lidam com `localhost` da mesma forma que outros clientes do MySQL, o que significa que `localhost` é assumido para conexões baseadas em soquetes. Para conexões usando o protocolo X, o comportamento de `localhost` difere em que é assumido para representar o endereço de loopback, por exemplo, endereço IPv4 127.0.0.1.

#### Parâmetros adicionais de ligação

Você pode especificar opções para a conexão, seja como atributos em uma string semelhante a URI, adicionando `?attribute=value`, ou como pares chave-valor. As seguintes opções estão disponíveis:

- `ssl-mode`: O estado de segurança desejado para a conexão. Os seguintes modos são permitidos:

  - `DISABLED`
  - `PREFERRED`
  - `REQUIRED`
  - `VERIFY_CA`
  - `VERIFY_IDENTITY`Importante

  `VERIFY_CA` e `VERIFY_IDENTITY` são melhores escolhas do que o padrão `PREFERRED`, porque ajudam a evitar ataques man-in-the-middle.

  Para obter informações sobre esses modos, consulte a descrição da opção `--ssl-mode` em Opções de comando para conexões criptografadas.

- `ssl-ca`: Caminho para o ficheiro da autoridade de certificação X.509 no formato PEM.

- `ssl-capath`: O caminho para o diretório que contém os arquivos de autoridade de certificados X.509 no formato PEM.

- `ssl-cert`: O caminho para o ficheiro de certificado X.509 no formato PEM.

- `ssl-cipher`: A cifra de criptografia a ser usada para conexões que usam protocolos TLS até TLSv1.2.

- `ssl-crl`: O caminho para o ficheiro que contém listas de revogação de certificados no formato PEM.

- `ssl-crlpath`: Caminho para o diretório que contém ficheiros de lista de revogação de certificados no formato PEM.

- `ssl-key`: O caminho para o arquivo de chave X.509 no formato PEM.

- `tls-version`: Os protocolos TLS permitidos para conexões criptografadas clássicas do protocolo MySQL. Esta opção é suportada apenas pelo MySQL Shell. O valor de `tls-version` (singular) é uma lista separada por vírgulas, por exemplo `TLSv1.2,TLSv1.3`. Para detalhes, veja Seção 8.3.2, Encrypted Connection TLS Protocols and Ciphers. Esta opção depende da opção `ssl-mode` não ser definida como `DISABLED`.

- `tls-versions`: Os protocolos TLS permitidos para conexões de protocolo X criptografadas. O valor de `tls-versions` (plural) é uma matriz como `[TLSv1.2,TLSv1.3]`. Para detalhes, consulte a Seção 8.3.2, Encrypted Connection TLS Protocols and Ciphers. Esta opção depende da opção `ssl-mode` não ser definida como `DISABLED`.

- `tls-ciphersuites`: As suítes de criptografia TLS permitidas. O valor de `tls-ciphersuites` é uma lista de nomes de suítes de criptografia da IANA, conforme listado em \[TLS Ciphersuites] ((<https://www.iana.org/assignments/tls-parameters/tls-parameters.xhtml#tls-parameters-4>). Para detalhes, consulte a Seção 8.3.2, Encrypted Connection TLS Protocols and Ciphers. Esta opção depende da opção `ssl-mode` não estar definida como `DISABLED`.

- `auth-method`: O método de autenticação a ser usado para a conexão. O padrão é `AUTO`, o que significa que o servidor tenta adivinhar. Os seguintes métodos são permitidos:

  - `AUTO`
  - `MYSQL41`
  - `SHA256_MEMORY`
  - `FROM_CAPABILITIES`
  - `FALLBACK`
  - `PLAIN`

  Para conexões do Protocolo X, qualquer `auth-method` configurado é substituído por esta sequência de métodos de autenticação: `MYSQL41`, `SHA256_MEMORY`, `PLAIN`.

- `get-server-public-key`: Solicite do servidor a chave pública necessária para a troca de senhas baseada em pares de chaves RSA. Use quando se conectar a servidores MySQL 8+ por meio do protocolo MySQL clássico com o modo SSL `DISABLED`. Você deve especificar o protocolo neste caso. Por exemplo:

  ```
  mysql://user@localhost:3306?get-server-public-key=true
  ```

  Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senhas baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `server-public-key-path=file_name` é dado e especifica um arquivo de chave pública válido, ele tem precedência sobre `get-server-public-key`.

  Para obter informações sobre o plug-in `caching_sha2_password`, consulte a Seção 8.4.1.2, Caching SHA-2 Pluggable Authentication.

- `server-public-key-path`: O nome do caminho para um arquivo no formato PEM contendo uma cópia do lado do cliente da chave pública necessária pelo servidor para troca de senha baseada em pares de chaves RSA. Use quando se conectar a servidores MySQL 8+ através do protocolo MySQL clássico com modo SSL `DISABLED`.

  Esta opção se aplica a clientes que se autenticam com o plug-in de autenticação `sha256_password` (desatualizado) ou `caching_sha2_password`.

  Se `server-public-key-path=file_name` é dado e especifica um arquivo de chave pública válido, ele tem precedência sobre `get-server-public-key`.

  Para obter informações sobre os plugins `sha256_password` (obsoleto) e `caching_sha2_password`, consulte a Seção 8.4.1.3, SHA-256 Pluggable Authentication, e a Seção 8.4.1.2, Caching SHA-2 Pluggable Authentication.

- `ssh`: O URI para conexão a um servidor SSH para acessar uma instância do servidor MySQL usando o túnel SSH. O formato do URI é `[user@]host[:port]`. Use a opção `uri` para especificar o URI da instância do servidor MySQL de destino. Para informações sobre conexões de túnel SSH a partir do MySQL Shell, consulte Usando um túnel SSH.

- `uri`: O URI para uma instância de servidor MySQL que deve ser acessado através de um túnel SSH a partir do servidor especificado pela opção `ssh`. O formato do URI é `[scheme://][user@]host[:port]`. Não use os parâmetros de conexão base (`scheme`, `user`, `host`, `port`) para especificar a conexão do servidor MySQL para o túnel SSH, apenas use a opção `uri`.

- `ssh-password`: A senha para a ligação ao servidor SSH.

  Advertência

  Especificar uma senha explícita na especificação de conexão é inseguro e não é recomendado.

- `ssh-config-file`: O arquivo de configuração SSH para a conexão com o servidor SSH. Você pode usar a opção de configuração do MySQL Shell `ssh.configFile` para definir um arquivo personalizado como o padrão se esta opção não for especificada. Se `ssh.configFile` não tiver sido definido, o padrão é o arquivo de configuração SSH padrão `~/.ssh/config`.

- `ssh-identity-file`: O arquivo de identidade a ser usado para a conexão com o servidor SSH. O padrão, se esta opção não for especificada, é qualquer arquivo de identidade configurado em um agente SSH (se usado), ou no arquivo de configuração SSH, ou o arquivo de chave privada padrão na pasta de configuração SSH (`~/.ssh/id_rsa`).

- `ssh-identity-pass`: A frase de senha para o arquivo de identidade especificado pela opção `ssh-identity-file`.

  Advertência

  Especificar uma senha explícita na especificação de conexão é inseguro e não é recomendado.

- `connect-timeout`: Um valor inteiro usado para configurar o número de segundos que os clientes, como o MySQL Shell, esperam até parar de tentar se conectar a um servidor MySQL que não responde.

- `compression`: Esta opção solicita ou desativa a compressão para a conexão.

  Os valores disponíveis para esta opção são: `required`, que solicita compressão e falha se o servidor não o suporta; `preferred`, que solicita compressão e retorna a uma conexão não comprimida; e `disabled`, que solicita uma conexão não comprimida e falha se o servidor não as permitir. `preferred` é o padrão para conexões do protocolo X, e `disabled` é o padrão para conexões clássicas do protocolo MySQL. Para informações sobre o controle de compressão de conexão do X Plugin, consulte a Seção 22.5.5, Compressão de conexão com o X Plugin.

  ::: info Note

  Diferentes clientes MySQL implementam seu suporte para compressão de conexão de forma diferente. Consulte a documentação do seu cliente para obter detalhes.

  :::

- `compression-algorithms` e `compression-level`: Essas opções estão disponíveis no MySQL Shell para mais controle sobre a compressão de conexão. Você pode especificá-las para selecionar o algoritmo de compressão usado para a conexão e o nível de compressão numérica usado com esse algoritmo. Você também pode usar `compression-algorithms` em vez de `compression` para solicitar compressão para a conexão. Para informações sobre o controle de compressão de conexão do MySQL Shell, consulte Usando conexões compactadas.

- `connection-attributes`: Controla os pares chave-valor que os programas de aplicativos passam para o servidor no momento da conexão. Para informações gerais sobre atributos de conexão, consulte a Seção 29.12.9, "Performance Schema Connection Attribute Tables". Os clientes geralmente definem um conjunto padrão de atributos, que podem ser desativados ou ativados. Por exemplo:

  ```
  mysqlx://user@host?connection-attributes
  mysqlx://user@host?connection-attributes=true
  mysqlx://user@host?connection-attributes=false
  ```

  O comportamento padrão é enviar o conjunto de atributos padrão. Os aplicativos podem especificar atributos a serem passados além dos atributos padrão. Você especifica atributos de conexão adicionais como um parâmetro `connection-attributes` em uma string de conexão. O valor do parâmetro `connection-attributes` deve ser vazio (o mesmo que especificar `true`), um valor `Boolean` (`true` ou `false` para habilitar ou desativar o conjunto de atributos padrão), ou uma lista ou zero ou mais especificadores `key=value` separados por vírgulas (a serem enviados além do conjunto de atributos padrão). Dentro de uma lista, um valor de chave em falta é avaliado como vazio. Outros exemplos:

  ```
  mysqlx://user@host?connection-attributes=[attr1=val1,attr2,attr3=]
  mysqlx://user@host?connection-attributes=[]
  ```

  Os nomes de atributo definidos pela aplicação não podem começar com `_` porque tais nomes são reservados para atributos internos.

#### Conexão usando strings de conexão semelhantes a URI

Você pode especificar uma conexão com o MySQL Server usando uma string semelhante a URI. Tais strings podem ser usadas com o MySQL Shell com a opção de comando `--uri`, o comando MySQL Shell `\connect` e os MySQL Connectors que implementam o X DevAPI.

::: info Note

O termo URI-like significa sintaxe de cadeia de conexão que é semelhante, mas não idêntica, à sintaxe URI (Uniform Resource Identifier) definida pelo \[RFC 3986]

:::

Uma cadeia de conexão semelhante a URI tem a seguinte sintaxe:

```
[scheme://][user[:[password]]@]host[:port][/schema][?attribute1=value1&attribute2=value2...
```

Importância

Por exemplo, se você especificar uma string que inclui o caractere `@`, o caractere deve ser substituído por `%40`. Se você incluir um ID de zona em um endereço IPv6, o caractere `%` usado como separador deve ser substituído por `%25`.

Os parâmetros que você pode usar em uma string de conexão semelhante a URI são descritos em Parâmetros de conexão de base.

Os métodos `shell.parseUri()` e `shell.unparseUri()` do MySQL Shell podem ser usados para desconstruir e montar uma string de conexão semelhante a URI. Dado uma string de conexão semelhante a URI, `shell.parseUri()` retorna um dicionário contendo cada elemento encontrado na string. `shell.unparseUri()` converte um dicionário de componentes de URI e opções de conexão em uma string de conexão semelhante a URI válida para se conectar ao MySQL, que pode ser usada no MySQL Shell ou por MySQL Connectors que implementam o XAPI Dev.

Se nenhuma senha for especificada na string semelhante a URI, o que é recomendado, os clientes interativos solicitam a senha. Os exemplos a seguir mostram como especificar strings semelhantes a URI com o nome de usuário `user_name`. Em cada caso, a senha é solicitada.

- Uma ligação de protocolo X a uma instância de servidor local a ouvir na porta 33065.

  ```
  mysqlx://user_name@localhost:33065
  ```
- Uma conexão clássica de protocolo MySQL para uma instância de servidor local ouvindo na porta 3333.

  ```
  mysql://user_name@localhost:3333
  ```
- Uma conexão do protocolo X com uma instância de servidor remoto, usando um nome de host, um endereço IPv4 e um endereço IPv6.

  ```
  mysqlx://user_name@server.example.com/
  mysqlx://user_name@198.51.100.14:123
  mysqlx://user_name@[2001:db8:85a3:8d3:1319:8a2e:370:7348]
  ```
- Uma conexão do Protocolo X usando um soquete, com o caminho fornecido usando codificação de porcentagem ou parênteses.

  ```
  mysqlx://user_name@/path%2Fto%2Fsocket.sock
  mysqlx://user_name@(/path/to/socket.sock)
  ```
- Pode ser especificado um caminho opcional, que representa uma base de dados.

  ```
  # use 'world' as the default database
  mysqlx://user_name@198.51.100.1/world

  # use 'world_x' as the default database, encoding _ as %5F
  mysqlx://user_name@198.51.100.2:33060/world%5Fx
  ```
- Uma consulta opcional pode ser especificada, consistindo de valores dados como um par de `key=value` ou como um único \* `key` \*. Para especificar múltiplos valores, separe-os por caracteres `,`. Uma mistura de valores `key=value` e `key` é permitida. Os valores podem ser do tipo lista, com valores de lista ordenados por aparência. As cadeias de caracteres devem ser codificadas em porcentagem ou cercadas por parênteses. Os seguintes são equivalentes.

  ```
  ssluser@127.0.0.1?ssl-ca=%2Froot%2Fclientcert%2Fca-cert.pem\
  &ssl-cert=%2Froot%2Fclientcert%2Fclient-cert.pem\
  &ssl-key=%2Froot%2Fclientcert%2Fclient-key

  ssluser@127.0.0.1?ssl-ca=(/root/clientcert/ca-cert.pem)\
  &ssl-cert=(/root/clientcert/client-cert.pem)\
  &ssl-key=(/root/clientcert/client-key)
  ```
- Para especificar uma versão TLS e um ciphersuite a utilizar para conexões criptografadas:

  ```
  mysql://user_name@198.51.100.2:3306/world%5Fx?\
  tls-versions=[TLSv1.2,TLSv1.3]&tls-ciphersuites=[TLS_DHE_PSK_WITH_AES_128_\
  GCM_SHA256, TLS_CHACHA20_POLY1305_SHA256]
  ```

Os exemplos anteriores assumem que as conexões exigem uma senha. Com os clientes interativos, a senha do usuário especificado é solicitada no prompt de login. Se a conta de usuário não tiver senha (o que é inseguro e não recomendado), ou se a autenticação de credenciais de soquete for usada (por exemplo, com conexões de soquete Unix), você deve especificar explicitamente na string de conexão que nenhuma senha está sendo fornecida e a senha não é necessária. Para fazer isso, coloque um `:` após o *\[\[`user_name`*]] na string, mas não especifique uma senha depois dela. Por exemplo:

```
mysqlx://user_name:@localhost
```

#### Conexão usando pares de chaves e valores

No MySQL Shell e em alguns MySQL Connectors que implementam o X DevAPI, você pode especificar uma conexão com o MySQL Server usando pares de valores-chave, fornecidos em construções de linguagem natural para a implementação. Por exemplo, você pode fornecer parâmetros de conexão usando pares de valores-chave como um objeto JSON no JavaScript ou como um dicionário no Python. Independentemente da forma como os pares de valores-chave são fornecidos, o conceito permanece o mesmo: as chaves descritas nesta seção podem ser atribuídas valores que são usados para especificar uma conexão. Você pode especificar conexões usando pares de valores-chave no método `shell.connect()` do MySQL Shell ou no método \[\[PH\_CODE\_CODE\_1]] do InnoDB Cluster, e com alguns dos MySQL Connectors que implementam o X DevAPI.

Geralmente, os pares chave-valor são cercados por caracteres `{` e `}` e o caractere `,` é usado como separador entre pares chave-valor. O caractere `:` é usado entre chaves e valores, e as cadeias devem ser delimitadas (por exemplo, usando o caractere `'`).

Uma conexão especificada como pares chave-valor tem o seguinte formato:

```
{ key: value, key: value, ...}
```

Os parâmetros que pode utilizar como chaves para uma ligação são descritos em Parâmetros de ligação de base.

Se nenhuma senha for especificada nos pares chave-valor, o que é recomendado, os clientes interativos solicitam a senha. Os exemplos a seguir mostram como especificar conexões usando pares chave-valor com o nome de usuário `'user_name'`.

- Uma ligação de protocolo X a uma instância de servidor local a ouvir na porta 33065.

  ```
  {user:'user_name', host:'localhost', port:33065}
  ```
- Uma conexão clássica de protocolo MySQL para uma instância de servidor local ouvindo na porta 3333.

  ```
  {user:'user_name', host:'localhost', port:3333}
  ```
- Uma conexão do protocolo X com uma instância de servidor remoto, usando um nome de host, um endereço IPv4 e um endereço IPv6.

  ```
  {user:'user_name', host:'server.example.com'}
  {user:'user_name', host:198.51.100.14:123}
  {user:'user_name', host:[2001:db8:85a3:8d3:1319:8a2e:370:7348]}
  ```
- Uma conexão de protocolo X usando um soquete.

  ```
  {user:'user_name', socket:'/path/to/socket/file'}
  ```
- Pode ser especificado um esquema opcional, que representa uma base de dados.

  ```
  {user:'user_name', host:'localhost', schema:'world'}
  ```

Os exemplos anteriores assumem que as conexões requerem uma senha. Com os clientes interativos, a senha do usuário especificado é solicitada no prompt de login. Se a conta de usuário não tiver senha (o que é inseguro e não recomendado), ou se a autenticação de credenciais de soquete for usada (por exemplo, com conexões de soquete Unix), você deve especificar explicitamente que nenhuma senha está sendo fornecida e a senha não é necessária. Para fazer isso, forneça uma string vazia usando `''` após a chave `password`. Por exemplo:

```
{user:'user_name', password:'', host:'localhost'}
```
