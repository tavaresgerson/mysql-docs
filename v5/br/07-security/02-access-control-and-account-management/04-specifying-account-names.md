### 6.2.4 Especificação de Nomes de Conta

Os nomes de contas do MySQL consistem em um nome de usuário e um nome de host, o que permite a criação de contas distintas para usuários com o mesmo nome de usuário que se conectam a partir de hosts diferentes. Esta seção descreve a sintaxe para os nomes de contas, incluindo valores especiais e regras de asterisco.

Os nomes das contas aparecem em declarações SQL, como `CREATE USER`, `GRANT` e `SET PASSWORD` e seguem estas regras:

- A sintaxe do nome da conta é `'user_name'@'host_name'`.

- A parte `@host_name` é opcional. Um nome de conta composto apenas por um nome de usuário é equivalente a `'user_name'@'%'. Por exemplo, `'me'`é equivalente a`'me'@'%'.

- O nome do usuário e o nome do host não precisam ser entre aspas se forem identificadores legais sem aspas. As aspas devem ser usadas se uma string `*`user_name`* contiver caracteres especiais (como espaço ou `-`) ou se uma string `*`host_name`* contiver caracteres especiais ou caracteres curinga (como `.` ou `%`). Por exemplo, no nome da conta `'test-user'@'%.com'`, tanto a parte do nome do usuário quanto a do host precisam de aspas.

- Cite nomes de usuários e nomes de hosts como identificadores ou como strings, usando aspas duplas (\`\`\`), aspas simples (`'`) ou aspas duplas (`"`). Para diretrizes de citação de strings e identificadores, consulte Seção 9.1.1, “Letras de String” e Seção 9.2, “Nomes de Objetos de Esquema”.

- As partes do nome de usuário e do nome do host, se estiverem entre aspas, devem ser entre aspas separadamente. Ou seja, escreva `'me'@'localhost'`, não `'me@localhost'`. Este último é, na verdade, equivalente a \`'me\@localhost'@'%'.

- Uma referência à função `CURRENT_USER` ou `CURRENT_USER()` é equivalente a especificar o nome de usuário e o nome do host do cliente atual literalmente.

O MySQL armazena os nomes de contas em tabelas de concessão no banco de dados do sistema `mysql`, usando colunas separadas para as partes do nome do usuário e do nome do host:

- A tabela `user` contém uma linha para cada conta. As colunas `User` e `Host` armazenam o nome do usuário e o nome do host. Esta tabela também indica quais privilégios globais a conta possui.

- Outras tabelas de concessão indicam os privilégios que uma conta tem para bases de dados e objetos dentro das bases de dados. Essas tabelas têm as colunas `User` e `Host` para armazenar o nome da conta. Cada linha dessas tabelas está associada à conta na tabela `user` que tem os mesmos valores de `User` e `Host`.

- Para fins de verificação de acesso, as comparações dos valores do Usuário são sensíveis ao caso. As comparações dos valores do Host não são sensíveis ao caso.

Para obter informações adicionais sobre as propriedades dos nomes de usuário e nomes de host armazenados nas tabelas de concessão, como o comprimento máximo, consulte Propriedades das Colunas de Alcance das Tabelas de Concessão.

Os nomes de usuário e nomes de host têm certos valores especiais ou convenções de caracteres curinga, conforme descrito a seguir.

A parte do nome de usuário de um nome de conta é um valor que não está em branco que corresponde literalmente ao nome de usuário para tentativas de conexão de entrada, ou um valor em branco (a string vazia) que corresponde a qualquer nome de usuário. Uma conta com um nome de usuário em branco é um usuário anônimo. Para especificar um usuário anônimo em declarações SQL, use uma parte de nome de usuário vazia entre aspas, como `''@'localhost'`.

A parte do nome do host de um nome de conta pode assumir várias formas, e os caracteres curinga são permitidos:

- Um valor de host pode ser um nome de host ou um endereço IP (IPv4 ou IPv6). O nome `'localhost'` indica o host local. O endereço IP `'127.0.0.1'` indica a interface de loopback IPv4. O endereço IP `'::1'` indica a interface de loopback IPv6.

- Os caracteres `%` e `_` são permitidos nos valores de nome de host ou endereço IP. Eles têm o mesmo significado que as operações de correspondência de padrões realizadas com o operador `LIKE`. Por exemplo, um valor de host de `'%'` corresponde a qualquer nome de host, enquanto um valor de `'%.mysql.com'` corresponde a qualquer host no domínio `mysql.com`. `'198.51.100.%'` corresponde a qualquer host na rede de classe C 198.51.100.

  Como os valores de wildcard de IP são permitidos nos valores de host (por exemplo, `'198.51.100.%'` para corresponder a qualquer host em uma sub-rede), alguém poderia tentar explorar essa capacidade ao nomear um host como `198.51.100.alguma_página.com`. Para impedir tais tentativas, o MySQL não realiza correspondência em nomes de host que comecem com dígitos e um ponto. Por exemplo, se um host for nomeado como `1.2.example.com`, seu nome nunca corresponderá à parte do host dos nomes de conta. Um valor de wildcard de IP pode corresponder apenas a endereços IP, não a nomes de host.

- Para um valor de host especificado como um endereço IPv4, pode-se fornecer uma máscara de rede para indicar quantos bits de endereço devem ser usados para o número de rede. A notação de máscara de rede não pode ser usada para endereços IPv6.

  A sintaxe é `host_ip/netmask`. Por exemplo:

  ```sql
  CREATE USER 'david'@'198.51.100.0/255.255.255.0';
  ```

  Isso permite que `david` se conecte a qualquer host cliente que tenha um endereço IP *`client_ip`* para o qual a seguinte condição seja verdadeira:

  ```sh
  client_ip & netmask = host_ip
  ```

  Ou seja, para a declaração `CREATE USER` que acabou de ser mostrada:

  ```sh
  client_ip & 255.255.255.0 = 198.51.100.0
  ```

  Os endereços IP que satisfazem essa condição variam de `198.51.100.0` a `198.51.100.255`.

  Uma máscara de rede geralmente começa com bits definidos para 1, seguidos por bits definidos para 0. Exemplos:

  - `198.0.0.0/255.0.0.0`: Qualquer host na rede classe A 198

  - `198.51.0.0/255.255.0.0`: Qualquer host na rede de classe B 198.51

  - `198.51.100.0/255.255.255.0`: Qualquer host na rede de classe C 198.51.100

  - `198.51.100.1`: Apenas o host com este endereço IP específico

O servidor realiza a correspondência dos valores de host nos nomes de contas contra o host do cliente usando o valor retornado pelo resolutor de DNS do sistema para o nome de host ou endereço IP do cliente. Exceto no caso em que o valor de host da conta é especificado usando a notação de máscara de rede, o servidor realiza essa comparação como uma correspondência de string, mesmo para um valor de host de conta fornecido como um endereço IP. Isso significa que você deve especificar valores de host de conta no mesmo formato usado pelo DNS. Aqui estão exemplos de problemas a serem observados:

- Suponha que um host na rede local tenha um nome totalmente qualificado de `host1.example.com`. Se o DNS retornar pesquisas de nome para esse host como `host1.example.com`, use esse nome nos valores de host da conta. Se o DNS retornar apenas `host1`, use `host1` em vez disso.

- Se o DNS retornar o endereço IP para um determinado host como `198.51.100.2`, isso corresponde a um valor de host de conta `198.51.100.2`, mas não a `198.051.100.2`. Da mesma forma, ele corresponde a um padrão de host de conta como `198.51.100.%`, mas não a `198.051.100.%`.

Para evitar problemas como esses, é aconselhável verificar o formato no qual seu DNS retorna nomes e endereços de hosts. Use valores no mesmo formato nos nomes das contas do MySQL.
