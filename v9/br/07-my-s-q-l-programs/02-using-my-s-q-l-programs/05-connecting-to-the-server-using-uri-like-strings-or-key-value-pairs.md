### 6.2.5 Conectando ao Servidor Usando Strings Tipo URI ou Pares de Chave-Valor

Esta seção descreve o uso de strings tipo URI ou pares de chave-valor para especificar como estabelecer conexões com o servidor MySQL, para clientes como o MySQL Shell. Para informações sobre como estabelecer conexões usando opções de linha de comando, para clientes como **mysql** ou **mysqldump**, consulte a Seção 6.2.4, “Conectando ao Servidor MySQL Usando Opções de Comando”. Para informações adicionais se você não conseguir se conectar, consulte a Seção 8.2.22, “Resolvendo Problemas de Conexão com o MySQL”.

Nota

O termo “tipo URI” indica a sintaxe de strings de conexão que é semelhante, mas não idêntica, à sintaxe URI (identificador de recurso uniforme) definida por [RFC 3986](https://tools.ietf.org/html/rfc3986).

Os seguintes clientes MySQL suportam a conexão com um servidor MySQL usando uma string de conexão tipo URI ou pares de chave-valor:

* MySQL Shell
* Conectadores MySQL que implementam X DevAPI

Esta seção documenta todos os parâmetros de conexão válidos de strings tipo URI e pares de chave-valor, muitos dos quais são semelhantes aos especificados com opções de linha de comando:

* Parâmetros especificados com uma string tipo URI usam uma sintaxe como `myuser@example.com:3306/main-schema`. Para a sintaxe completa, consulte Conectando Usando Strings de Conexão Tipo URI.

* Parâmetros especificados com pares de chave-valor usam uma sintaxe como `{user:'myuser', host:'example.com', port:3306, schema:'main-schema'}`. Para a sintaxe completa, consulte Conectando Usando Pares de Chave-Valor.

Os parâmetros de conexão não são case-sensitive. Cada parâmetro, se especificado, pode ser dado apenas uma vez. Se um parâmetro for especificado mais de uma vez, ocorre um erro.

Esta seção abrange os seguintes tópicos:

* Parâmetros de Conexão Básica
* Parâmetros Adicionais de Conexão
* Conectando Usando Strings de Conexão Tipo URI
* Conectando Usando Pares Chave-Valor

#### Parâmetros de Conexão Básica

A discussão a seguir descreve os parâmetros disponíveis ao especificar uma conexão com o MySQL. Esses parâmetros podem ser fornecidos usando uma string que siga a sintaxe tipo URI básica (consulte Conectando Usando Strings de Conexão Tipo URI) ou como pares chave-valor (consulte Conectando Usando Pares Chave-Valor).

* *`scheme`*: O protocolo de transporte a ser usado. Use `mysqlx` para conexões com o protocolo X e `mysql` para conexões com o protocolo MySQL clássico. Se nenhum protocolo for especificado, o servidor tentará adivinhar o protocolo. Conectadores que suportam registros DNS SRV podem usar o esquema `mysqlx+srv` (consulte Conexões Usando Registros DNS SRV).

* *`user`*: A conta de usuário do MySQL a ser fornecida para o processo de autenticação.

* *`password`*: A senha a ser usada para o processo de autenticação.

  Aviso

  Especificar uma senha explícita na especificação da conexão é inseguro e não é recomendado. A discussão posterior mostra como fazer com que um prompt interativo para a senha ocorra.

* *`host`*: O host no qual a instância do servidor está em execução. O valor pode ser um nome de host, endereço IPv4 ou endereço IPv6. Se nenhum host for especificado, o padrão é `localhost`.

* *`port`*: A porta de rede TCP/IP na qual o servidor MySQL alvo está ouvindo conexões. Se nenhuma porta for especificada, o padrão é 33060 para conexões com o protocolo X e 3306 para conexões com o protocolo MySQL clássico.

* *`socket`*: O caminho para um arquivo de soquete Unix ou o nome de um tubo nomeado do Windows. Os valores são caminhos de arquivos locais. Em strings semelhantes a URIs, eles devem ser codificados, usando codificação por porcentagem ou envolvendo o caminho em parênteses. Os parênteses eliminam a necessidade de codificar caracteres como o caractere de separador de diretório `/` com codificação por porcentagem. Por exemplo, para se conectar como `root@localhost` usando o soquete Unix `/tmp/mysql.sock`, especifique o caminho usando codificação por porcentagem como `root@localhost?socket=%2Ftmp%2Fmysql.sock`, ou usando parênteses como `root@localhost?socket=(/tmp/mysql.sock)`.

* *`schema`*: O banco de dados padrão para a conexão. Se nenhum banco de dados for especificado, a conexão não tem banco de dados padrão.

O tratamento de `localhost` no Unix depende do tipo de protocolo de transporte. Conexões que usam o protocolo MySQL clássico tratam `localhost` da mesma maneira que outros clientes MySQL, o que significa que `localhost` é assumido para conexões baseadas em soquete. Para conexões que usam o Protocolo X, o comportamento de `localhost` difere, pois é assumido que ele representa o endereço de loopback, por exemplo, o endereço IPv4 127.0.0.1.

#### Parâmetros de Conexão adicionais

Você pode especificar opções para a conexão, seja como atributos em uma string semelhante a URI anexando `?attribute=value`, ou como pares chave-valor. As seguintes opções estão disponíveis:

* `ssl-mode`: O estado de segurança desejado para a conexão. Os seguintes modos são permitidos:

  + `DISABLED`
  + `PREFERRED`
  + `REQUIRED`
  + `VERIFY_CA`
  + `VERIFY_IDENTITY`

  Importante

  `VERIFY_CA` e `VERIFY_IDENTITY` são melhores escolhas do que o padrão `PREFERRED`, porque ajudam a prevenir ataques de intermediário.

  Para informações sobre esses modos, consulte a descrição da opção `--ssl-mode` nas Opções de Comando para Conexões Encriptadas.

* `ssl-ca`: O caminho para o arquivo da autoridade de certificação X.509 no formato PEM.

* `ssl-capath`: O caminho para o diretório que contém os arquivos da autoridade de certificação X.509 no formato PEM.

* `ssl-cert`: O caminho para o arquivo de certificado X.509 no formato PEM.

* `ssl-cipher`: O algoritmo de criptografia a ser usado para conexões que utilizam protocolos TLS até o TLSv1.2.

* `ssl-crl`: O caminho para o arquivo que contém listas de revogação de certificados no formato PEM.

* `ssl-crlpath`: O caminho para o diretório que contém arquivos de listas de revogação de certificados no formato PEM.

* `ssl-key`: O caminho para o arquivo de chave X.509 no formato PEM.

* `tls-version`: Os protocolos TLS permitidos para conexões criptografadas do protocolo clássico MySQL. Esta opção é suportada apenas pelo MySQL Shell. O valor de `tls-version` (singular) é uma lista separada por vírgula, por exemplo, `TLSv1.2,TLSv1.3`. Para detalhes, consulte a Seção 8.3.2, “Protocolos e Algoritmos de Criptografia TLS de Conexão Criptografada”. Esta opção depende de a opção `ssl-mode` não estar definida como `DISABLED`.

* `tls-versions`: Os protocolos TLS permitidos para conexões criptografadas do X Protocol. O valor de `tls-versions` (plural) é um array, como `[TLSv1.2,TLSv1.3]`. Para detalhes, consulte a Seção 8.3.2, “Protocolos e Algoritmos de Criptografia TLS de Conexão Criptografada”. Esta opção depende de a opção `ssl-mode` não estar definida como `DISABLED`.

[Suítes de Algoritmos de Criptografia TLS](https://www.iana.org/assignments/tls-parameters/tls-parameters.xhtml#tls-parameters-4). Para detalhes, consulte a Seção 8.3.2, “Protocolos e Algoritmos de Criptografia TLS de Conexão Criptografada”. Esta opção depende de a opção `ssl-mode` não estar definida como `DISABLED`.

* `auth-method`: O método de autenticação a ser usado para a conexão. O padrão é `AUTO`, o que significa que o servidor tenta adivinhar. Os seguintes métodos são permitidos:

+ `AUTO`
+ `MYSQL41`
+ `SHA256_MEMORY`
+ `FROM_CAPABILITIES`
+ `FALLBACK`
+ `PLAIN`

Para conexões com o X Protocol, qualquer método de autenticação configurado é substituído por esta sequência de métodos de autenticação: `MYSQL41`, `SHA256_MEMORY`, `PLAIN`.

* `get-server-public-key`: Solicitar ao servidor a chave pública necessária para a troca de senhas baseada em pares de chaves RSA. Use quando se conectar a servidores MySQL 8+ através do protocolo MySQL clássico com o modo SSL `DESABILITADO`. Você deve especificar o protocolo neste caso. Por exemplo:

  ```
  mysql://user@localhost:3306?get-server-public-key=true
  ```

  Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `get-server-public-key`.

  Para informações sobre o plugin `caching_sha2_password`, consulte a Seção 8.4.1.1, “Caching SHA-2 Pluggable Authentication”.

* `server-public-key-path`: O nome do caminho de um arquivo em formato PEM contendo uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senhas baseada em pares de chaves RSA. Use quando se conectar a servidores MySQL 8+ através do protocolo MySQL clássico com o modo SSL `DESABILITADO`.

Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `sha256_password` (desatualizado) ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `get-server-public-key`.

Para obter informações sobre os plugins `sha256_password` (desatualizado) e `caching_sha2_password`, consulte a Seção 8.4.1.2, “Autenticação Personalizável SHA-256”, e a Seção 8.4.1.1, “Autenticação Personalizável SHA-2”.

* `ssh`: O URI para conexão a um servidor SSH para acessar uma instância de servidor MySQL usando tunelamento SSH. O formato do URI é `[user@]host[:port]`. Use a opção `uri` para especificar o URI da instância de servidor MySQL alvo. Para obter informações sobre conexões de túnel SSH a partir do MySQL Shell, consulte Usando um Túnel SSH.

* `uri`: O URI para uma instância de servidor MySQL que deve ser acessada através de um túnel SSH a partir do servidor especificado pela opção `ssh`. O formato do URI é `[scheme://][user@]host[:port]`. Não use os parâmetros de conexão básicos (`scheme`, `user`, `host`, `port`) para especificar a conexão do servidor MySQL para o tunelamento SSH, basta usar a opção `uri`.

* `ssh-password`: A senha para a conexão com o servidor SSH.

Aviso

Especificar uma senha explícita na especificação da conexão é inseguro e não é recomendado. O MySQL Shell solicita uma senha interativamente quando uma é necessária.

* `ssh-config-file`: O arquivo de configuração SSH para a conexão com o servidor SSH. Você pode usar a opção de configuração do Shell MySQL `ssh.configFile` para definir um arquivo personalizado como padrão, se essa opção não for especificada. Se `ssh.configFile` não for definido, o padrão é o arquivo de configuração SSH padrão `~/.ssh/config`.

* `ssh-identity-file`: O arquivo de identidade a ser usado para a conexão com o servidor SSH. O padrão, se essa opção não for especificada, é qualquer arquivo de identidade configurado em um agente SSH (se usado), ou no arquivo de configuração SSH, ou o arquivo de chave privada padrão na pasta de configuração SSH (`~/.ssh/id_rsa`).

* `ssh-identity-pass`: A senha da senha para o arquivo de identidade especificado pela opção `ssh-identity-file`.

  Aviso

  Especificar uma senha explícita na especificação da conexão é inseguro e não é recomendado. O Shell MySQL solicita uma senha interativamente quando uma é necessária.

* `connect-timeout`: Um valor inteiro usado para configurar o número de segundos que clientes, como o Shell MySQL, esperam para parar de tentar se conectar a um servidor MySQL não responsivo.

* `compression`: Esta opção solicita ou desativa a compressão para a conexão.

  Os valores disponíveis para essa opção são: `required`, que solicita compressão e falha se o servidor não a suportar; `preferred`, que solicita compressão e fallback para uma conexão não comprimida; e `disabled`, que solicita uma conexão não comprimida e falha se o servidor não permitir isso. `preferred` é o padrão para conexões com o Protocolo X, e `disabled` é o padrão para conexões com o protocolo MySQL clássico. Para informações sobre o controle de compressão de conexão com o Plugin X, consulte a Seção 22.5.5, “Compressão de Conexão com o Plugin X”.

  Nota

Diferentes clientes do MySQL implementam seu suporte à compressão de conexão de maneira diferente. Consulte a documentação do seu cliente para obter detalhes.

* `compression-algorithms` e `compression-level`: Essas opções estão disponíveis no MySQL Shell para ter mais controle sobre a compressão de conexão. Você pode especificá-las para selecionar o algoritmo de compressão usado para a conexão e o nível de compressão numérico usado com esse algoritmo. Você também pode usar `compression-algorithms` no lugar de `compression` para solicitar compressão para a conexão. Para informações sobre o controle de compressão de conexão do MySQL Shell, consulte Usar Conexões Compressas.

* `connection-attributes`: Controla os pares chave-valor que os programas de aplicativo passam para o servidor no momento da conexão. Para informações gerais sobre atributos de conexão, consulte a Seção 29.12.9, “Tabelas de Atributos de Conexão do Schema de Desempenho”. Os clientes geralmente definem um conjunto padrão de atributos, que podem ser desabilitados ou habilitados. Por exemplo:

  ```
  mysqlx://user@host?connection-attributes
  mysqlx://user@host?connection-attributes=true
  mysqlx://user@host?connection-attributes=false
  ```

  O comportamento padrão é enviar o conjunto de atributos padrão. Os aplicativos podem especificar atributos a serem passados além dos atributos padrão. Você especifica atributos de conexão adicionais como um parâmetro `connection-attributes` em uma string de conexão. O valor do parâmetro `connection-attributes` deve ser vazio (o mesmo que especificar `true`), um valor `Boolean` (`true` ou `false` para habilitar ou desabilitar o conjunto de atributos padrão), ou uma lista ou zero ou mais especificadores `key=value` separados por vírgulas (a serem enviados além do conjunto de atributos padrão). Dentro de uma lista, um valor de chave ausente é avaliado como uma string vazia. Exemplos adicionais:

  ```
  mysqlx://user@host?connection-attributes=[attr1=val1,attr2,attr3=]
  mysqlx://user@host?connection-attributes=[]
  ```

  Os nomes de atributos definidos pelo aplicativo não podem começar com `_` porque tais nomes são reservados para atributos internos.

#### Conectando Usando Strings de Conexão Tipo URI

Você pode especificar uma conexão ao Servidor MySQL usando uma string semelhante a URI. Essas strings podem ser usadas com o MySQL Shell usando a opção de comando `--uri`, o comando `\connect` do MySQL Shell e os Conectadores MySQL que implementam a X DevAPI.

Nota

O termo “tipo URI” indica a sintaxe de string de conexão que é semelhante, mas não idêntica, à sintaxe de URI (identificador de recurso uniforme) definida por [RFC 3986](https://tools.ietf.org/html/rfc3986).

Uma string de conexão tipo URI tem a seguinte sintaxe:

```
[scheme://][user[:[password]]@]host[:port][/schema][?attribute1=value1&attribute2=value2...
```

Importante

O codificação por porcentagem deve ser usada para caracteres reservados nos elementos da string tipo URI. Por exemplo, se você especificar uma string que inclui o caractere `@`, o caractere deve ser substituído por `%40`. Se você incluir um ID de zona em um endereço IPv6, o caractere `%` usado como separador deve ser substituído por `%25`.

Os parâmetros que você pode usar em uma string de conexão tipo URI são descritos em Parâmetros de Conexão Básicos.

Os métodos `shell.parseUri()` e `shell.unparseUri()` do MySQL Shell podem ser usados para decompor e montar uma string de conexão tipo URI. Dada uma string de conexão tipo URI, `shell.parseUri()` retorna um dicionário contendo cada elemento encontrado na string. `shell.unparseUri()` converte um dicionário de componentes de URI e opções de conexão em uma string de conexão tipo URI válida para conectar-se ao MySQL, que pode ser usada no MySQL Shell ou por Conectadores MySQL que implementam a X DevAPI.

Se nenhuma senha for especificada na string tipo URI, o que é recomendado, os clientes interativos solicitam a senha. Os seguintes exemplos mostram como especificar strings tipo URI com o nome de usuário *`user_name`*. Em cada caso, a senha é solicitada.

* Uma conexão com o protocolo X a uma instância de servidor local que está ouvindo na porta 33065.

  ```
  mysqlx://user_name@localhost:33065
  ```

* Uma conexão com o protocolo MySQL clássica a uma instância de servidor local que está ouvindo na porta 3333.

  ```
  mysql://user_name@localhost:3333
  ```

* Uma conexão com o protocolo X a uma instância de servidor remoto, usando um nome de host, um endereço IPv4 e um endereço IPv6.

  ```
  mysqlx://user_name@server.example.com/
  mysqlx://user_name@198.51.100.14:123
  mysqlx://user_name@[2001:db8:85a3:8d3:1319:8a2e:370:7348]
  ```

* Uma conexão com o protocolo X usando um socket, com o caminho fornecido usando codificação por porcentagem ou entre parênteses.

  ```
  mysqlx://user_name@/path%2Fto%2Fsocket.sock
  mysqlx://user_name@(/path/to/socket.sock)
  ```

* Um caminho opcional pode ser especificado, que representa um banco de dados.

  ```
  # use 'world' as the default database
  mysqlx://user_name@198.51.100.1/world

  # use 'world_x' as the default database, encoding _ as %5F
  mysqlx://user_name@198.51.100.2:33060/world%5Fx
  ```

* Um query opcional pode ser especificado, consistindo de valores cada um dado como uma `chave=valor` ou como um único *`chave`*. Para especificar múltiplos valores, separe-os por caracteres `,`. Uma mistura de valores `chave=valor` e *`chave`* é permitida. Os valores podem ser do tipo lista, com valores de lista ordenados por aparência. As strings devem ser codificadas por porcentagem ou cercadas por parênteses. O seguinte é equivalente.

  ```
  ssluser@127.0.0.1?ssl-ca=%2Froot%2Fclientcert%2Fca-cert.pem\
  &ssl-cert=%2Froot%2Fclientcert%2Fclient-cert.pem\
  &ssl-key=%2Froot%2Fclientcert%2Fclient-key

  ssluser@127.0.0.1?ssl-ca=(/root/clientcert/ca-cert.pem)\
  &ssl-cert=(/root/clientcert/client-cert.pem)\
  &ssl-key=(/root/clientcert/client-key)
  ```

* Para especificar uma versão TLS e um conjunto de cifra a serem usados para conexões criptografadas:

  ```
  mysql://user_name@198.51.100.2:3306/world%5Fx?\
  tls-versions=[TLSv1.2,TLSv1.3]&tls-ciphersuites=[TLS_DHE_PSK_WITH_AES_128_\
  GCM_SHA256, TLS_CHACHA20_POLY1305_SHA256]
  ```

Os exemplos anteriores assumem que as conexões requerem uma senha. Com clientes interativos, a senha do usuário especificado é solicitada no prompt de login. Se a conta de usuário não tiver senha (o que é inseguro e não recomendado), ou se a autenticação de credencial do peer do socket estiver em uso (por exemplo, com conexões de socket Unix), você deve especificar explicitamente na string de conexão que nenhuma senha está sendo fornecida e o prompt de senha não é necessário. Para fazer isso, coloque um `:` após o *`user_name`* na string, mas não especifique uma senha após ele. Por exemplo:

```
mysqlx://user_name:@localhost
```

#### Conectando Usando Pares de Chave-Valor

No MySQL Shell e em alguns Conectores MySQL que implementam a X DevAPI, você pode especificar uma conexão ao Servidor MySQL usando pares chave-valor, fornecidos em construções naturais do idioma para a implementação. Por exemplo, você pode fornecer parâmetros de conexão usando pares chave-valor como um objeto JSON em JavaScript ou como um dicionário em Python. Independentemente da maneira como os pares chave-valor são fornecidos, o conceito permanece o mesmo: as chaves descritas nesta seção podem ser atribuídas valores que são usados para especificar uma conexão. Você pode especificar conexões usando pares chave-valor no método `shell.connect()` do MySQL Shell ou no método `dba.createCluster()` do InnoDB Cluster, e com alguns dos Conectores MySQL que implementam a X DevAPI.

Geralmente, os pares chave-valor são cercados pelos caracteres `{` e `}` e o caractere `,` é usado como separador entre os pares chave-valor. O caractere `:` é usado entre as chaves e os valores, e as strings devem ser delimitadas (por exemplo, usando o caractere `'`). Não é necessário codificar as strings em porcentagem, ao contrário das strings de conexão semelhantes a URI.

Uma conexão especificada como pares chave-valor tem o seguinte formato:

```
{ key: value, key: value, ...}
```

Os parâmetros que você pode usar como chaves para uma conexão são descritos em Parâmetros de Conexão Básica.

Se nenhuma senha for especificada nos pares chave-valor, o que é recomendado, os clientes interativos solicitam a senha. Os seguintes exemplos mostram como especificar conexões usando pares chave-valor com o nome de usuário `'user_name'`. Em cada caso, a senha é solicitada.

* Uma conexão X Protocol para uma instância de servidor local que está ouvindo na porta 33065.

  ```
  {user:'user_name', host:'localhost', port:33065}
  ```

* Uma conexão clássica do protocolo MySQL para uma instância de servidor local que está ouvindo na porta 3333.

  ```
  {user:'user_name', host:'localhost', port:3333}
  ```

* Uma conexão X Protocol com uma instância de servidor remoto, usando um nome de host, um endereço IPv4 e um endereço IPv6.

  ```
  {user:'user_name', host:'server.example.com'}
  {user:'user_name', host:198.51.100.14:123}
  {user:'user_name', host:[2001:db8:85a3:8d3:1319:8a2e:370:7348]}
  ```

* Uma conexão X Protocol usando um socket.

  ```
  {user:'user_name', socket:'/path/to/socket/file'}
  ```

* Um esquema opcional pode ser especificado, que representa um banco de dados.

  ```
  {user:'user_name', host:'localhost', schema:'world'}
  ```

Os exemplos anteriores assumem que as conexões exigem uma senha. Com clientes interativos, a senha do usuário especificado é solicitada na prompt de login. Se a conta de usuário não tiver senha (o que é inseguro e não recomendado), ou se a autenticação de credencial de peer de socket estiver em uso (por exemplo, com conexões de socket Unix), você deve especificar explicitamente que nenhuma senha está sendo fornecida e a prompt de senha não é necessária. Para fazer isso, forneça uma string vazia usando `''` após a chave `password`. Por exemplo:

```
{user:'user_name', password:'', host:'localhost'}
```