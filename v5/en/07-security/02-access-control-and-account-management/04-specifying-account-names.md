### 6.2.4 Especificando Nomes de Conta

Nomes de conta MySQL consistem em um nome de usuário (`user name`) e um nome de host (`host name`), o que permite a criação de contas distintas para usuários com o mesmo nome de usuário que se conectam a partir de hosts diferentes. Esta seção descreve a sintaxe para nomes de conta, incluindo valores especiais e regras de *wildcard*.

Nomes de conta aparecem em instruções SQL como [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement"), [`GRANT`](grant.html "13.7.1.4 GRANT Statement") e [`SET PASSWORD`](set-password.html "13.7.1.7 SET PASSWORD Statement"), e seguem estas regras:

* A sintaxe do nome de conta é `'user_name'@'host_name'`.

* A parte `@'host_name'` é opcional. Um nome de conta que consiste apenas em um nome de usuário é equivalente a `'user_name'@'%'`. Por exemplo, `'me'` é equivalente a `'me'@'%'`.

* O nome de usuário e o nome de host não precisam ser citados (delimitados por aspas ou apóstrofos) se forem identificadores não citados válidos. Aspas devem ser usadas se uma string *`user_name`* contiver caracteres especiais (como espaço ou `-`), ou se uma string *`host_name`* contiver caracteres especiais ou caracteres *wildcard* (como `.` ou `%`). Por exemplo, no nome de conta `'test-user'@'%.com'`, ambas as partes de nome de usuário e nome de host exigem aspas.

* Cite (delimite) nomes de usuário e nomes de host como identificadores ou como strings, usando tanto *backticks* (`` ` ``), aspas simples (`'`) ou aspas duplas (`"`). Para diretrizes de delimitação de strings e identificadores, consulte [Section 9.1.1, “String Literals”](string-literals.html "9.1.1 String Literals"), e [Section 9.2, “Schema Object Names”](identifiers.html "9.2 Schema Object Names").

* As partes de nome de usuário e nome de host, se citadas, devem ser citadas separadamente. Ou seja, escreva `'me'@'localhost'`, não `'me@localhost'`. O último é, na verdade, equivalente a `'me@localhost'@'%'`.

* Uma referência à função [`CURRENT_USER`](information-functions.html#function_current-user) ou [`CURRENT_USER()`](information-functions.html#function_current-user) é equivalente a especificar o nome de usuário e o nome de host do cliente atual literalmente.

O MySQL armazena nomes de conta nas *grant tables* no *Database* de sistema `mysql`, usando colunas separadas para as partes de nome de usuário e nome de host:

* A tabela `user` contém uma linha para cada conta. As colunas `User` e `Host` armazenam o nome de usuário e o nome de host. Esta tabela também indica quais privilégios globais a conta possui.

* Outras *grant tables* indicam os privilégios que uma conta possui para *Databases* e objetos dentro dos *Databases*. Essas tabelas possuem colunas `User` e `Host` para armazenar o nome de conta. Cada linha nessas tabelas se associa à conta na tabela `user` que possui os mesmos valores de `User` e `Host`.

* Para fins de verificação de acesso, as comparações dos valores de User diferenciam maiúsculas de minúsculas (*case-sensitive*). As comparações dos valores de Host não diferenciam maiúsculas de minúsculas (*not case-sensitive*).

Para detalhes adicionais sobre as propriedades de nomes de usuário e nomes de host conforme armazenados nas *grant tables*, como o comprimento máximo, consulte [Grant Table Scope Column Properties](grant-tables.html#grant-tables-scope-column-properties "Grant Table Scope Column Properties").

Nomes de usuário e nomes de host possuem certos valores especiais ou convenções de *wildcard*, conforme descrito a seguir.

A parte de nome de usuário de um nome de conta é um valor não vazio que corresponde literalmente ao nome de usuário para tentativas de conexão de entrada, ou um valor vazio (*blank value*) (a string vazia) que corresponde a qualquer nome de usuário. Uma conta com um nome de usuário vazio é um usuário anônimo. Para especificar um usuário anônimo em instruções SQL, use uma parte de nome de usuário vazia entre aspas, como `''@'localhost'`.

A parte de nome de host de um nome de conta pode assumir diversas formas, e *wildcards* são permitidos:

* Um valor de host pode ser um nome de host ou um endereço IP (IPv4 ou IPv6). O nome `'localhost'` indica o host local. O endereço IP `'127.0.0.1'` indica a interface de *loopback* IPv4. O endereço IP `'::1'` indica a interface de *loopback* IPv6.

* Os caracteres *wildcard* `%` e `_` são permitidos em valores de nome de host ou endereço IP. Eles têm o mesmo significado que nas operações de correspondência de padrão (*pattern-matching*) executadas com o operador [`LIKE`](string-comparison-functions.html#operator_like). Por exemplo, um valor de host de `'%'` corresponde a qualquer nome de host, enquanto um valor de `'%.mysql.com'` corresponde a qualquer host no domínio `mysql.com`. `'198.51.100.%'` corresponde a qualquer host na rede classe C 198.51.100.

  Como valores *wildcard* de IP são permitidos em valores de host (por exemplo, `'198.51.100.%'` para corresponder a todos os hosts em uma sub-rede), alguém poderia tentar explorar essa capacidade nomeando um host como `198.51.100.somewhere.com`. Para frustrar tais tentativas, o MySQL não executa a correspondência em nomes de host que começam com dígitos e um ponto. Por exemplo, se um host for nomeado `1.2.example.com`, seu nome nunca corresponderá à parte do host de nomes de conta. Um valor *wildcard* de IP só pode corresponder a endereços IP, e não a nomes de host.

* Para um valor de host especificado como um endereço IPv4, uma *netmask* (máscara de rede) pode ser fornecida para indicar quantos bits de endereço devem ser usados para o número de rede. A notação de *Netmask* não pode ser usada para endereços IPv6.

  A sintaxe é `host_ip/netmask`. Por exemplo:

  ```sql
  CREATE USER 'david'@'198.51.100.0/255.255.255.0';
  ```

  Isso permite que `david` se conecte de qualquer host cliente que tenha um endereço IP *`client_ip`* para o qual a seguinte condição seja verdadeira:

  ```sql
  client_ip & netmask = host_ip
  ```

  Ou seja, para a instrução [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") mostrada acima:

  ```sql
  client_ip & 255.255.255.0 = 198.51.100.0
  ```

  Endereços IP que satisfazem esta condição variam de `198.51.100.0` a `198.51.100.255`.

  Uma *netmask* tipicamente começa com bits definidos como 1, seguidos por bits definidos como 0. Exemplos:

  + `198.0.0.0/255.0.0.0`: Qualquer host na rede classe A 198

  + `198.51.0.0/255.255.0.0`: Qualquer host na rede classe B 198.51

  + `198.51.100.0/255.255.255.0`: Qualquer host na rede classe C 198.51.100

  + `198.51.100.1`: Apenas o host com este endereço IP específico

O servidor executa a correspondência de valores de host em nomes de conta em relação ao host cliente usando o valor retornado pelo resolvedor DNS do sistema para o nome de host ou endereço IP do cliente. Exceto no caso em que o valor do host da conta é especificado usando a notação *netmask*, o servidor realiza esta comparação como uma correspondência de string, mesmo para um valor de host de conta fornecido como um endereço IP. Isso significa que você deve especificar os valores de host da conta no mesmo formato usado pelo DNS. Aqui estão exemplos de problemas a serem observados:

* Suponha que um host na rede local tenha um nome totalmente qualificado de `host1.example.com`. Se o DNS retornar pesquisas de nome para este host como `host1.example.com`, use esse nome nos valores de host da conta. Se o DNS retornar apenas `host1`, use `host1` em vez disso.

* Se o DNS retornar o endereço IP para um determinado host como `198.51.100.2`, isso corresponde a um valor de host de conta de `198.51.100.2`, mas não a `198.051.100.2`. Da mesma forma, corresponde a um padrão de host de conta como `198.51.100.%`, mas não a `198.051.100.%`.

Para evitar problemas como esses, é aconselhável verificar o formato em que seu DNS retorna nomes de host e endereços. Use valores no mesmo formato nos nomes de conta MySQL.