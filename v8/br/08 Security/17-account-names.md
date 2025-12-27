### 8.2.4 Especificando Nomes de Conta

Os nomes de conta do MySQL consistem em um nome de usuário e um nome de host, o que permite a criação de contas distintas para usuários com o mesmo nome de usuário que se conectam a partir de hosts diferentes. Esta seção descreve a sintaxe para os nomes de conta, incluindo valores especiais e regras de caracteres curinga.

Na maioria dos aspectos, os nomes de conta são semelhantes aos nomes de papel do MySQL, com algumas diferenças descritas na Seção 8.2.5, “Especificando Nomes de Papel”.

Os nomes de conta aparecem em declarações SQL, como `CREATE USER`, `GRANT` e `SET PASSWORD`, e seguem estas regras:

* A sintaxe do nome de conta é `'user_name'@'host_name'`.
* A parte `@'host_name'` é opcional. Um nome de conta que consiste apenas em um nome de usuário é equivalente a `'user_name'@'%'`. Por exemplo, `'me'` é equivalente a `'me'@'%'`.
* O nome de usuário e o nome de host não precisam ser entre aspas se forem identificadores legais sem aspas. As aspas devem ser usadas se uma string `user_name` contiver caracteres especiais (como espaço ou `-`) ou se uma string `host_name` contiver caracteres especiais ou caracteres curinga (como `.` ou `%`). Por exemplo, no nome de conta `'test-user'@'%.com'`, tanto a parte do nome de usuário quanto a parte do nome de host requerem aspas.
* Citar nomes de usuário e nomes de host como identificadores ou como strings, usando aspas simples (`'`), aspas duplas (`"`) ou aspas traseiras (`` ` ``). Para diretrizes de citação de strings e citação de identificadores, consulte a Seção 11.1.1, “Letras de String”, e a Seção 11.2, “Nomes de Objetos de Esquema”. Nos resultados da declaração `SHOW`, os nomes de usuário e nomes de host são citados usando aspas traseiras (```
  CREATE USER 'david'@'198.51.100.0/255.255.255.0';
  ```QOw3UQAPUO```
  client_ip & netmask = host_ip
  ```7fRCTksj3g```
  client_ip & 255.255.255.0 = 198.51.100.0
  ```17HUWBNOHe```

Os endereços IP que satisfazem essa condição variam de `198.51.100.0` a `198.51.100.255`.

Um netmask geralmente começa com bits definidos como 1, seguidos por bits definidos como 0. Exemplos:

+ `198.0.0.0/255.0.0.0`: Qualquer host na rede de classe A 198
+ `198.51.0.0/255.255.0.0`: Qualquer host na rede de classe B 198.51
+ `198.51.100.0/255.255.255.0`: Qualquer host na rede de classe C 198.51.100
+ `198.51.100.1`: Apenas o host com esse endereço IP específico
* Um valor de host especificado como um endereço IPv4 pode ser escrito usando a notação CIDR, como `198.51.100.44/24`.

O servidor realiza a correspondência dos valores de host nos nomes de contas contra o host do cliente usando o valor retornado pelo resolutor de DNS do sistema para o nome ou endereço IP do cliente. Exceto no caso em que o valor de host da conta é especificado usando a notação netmask, o servidor realiza essa comparação como uma correspondência de string, mesmo para um valor de host da conta dado como um endereço IP. Isso significa que você deve especificar valores de host da conta no mesmo formato usado pelo DNS. Aqui estão exemplos de problemas a serem observados:

* Suponha que um host na rede local tenha um nome completo de `host1.example.com`. Se o DNS retornar pesquisas de nome para esse host como `host1.example.com`, use esse nome nos valores de host da conta. Se o DNS retornar apenas `host1`, use `host1` em vez disso.
* Se o DNS retornar o endereço IP para um host dado como `198.51.100.2`, isso corresponde a um valor de host da conta de `198.51.100.2`, mas não `198.051.100.2`. Da mesma forma, corresponde a um padrão de host da conta como `198.51.100.%`, mas não `198.051.100.%`.

Para evitar problemas como esses, é aconselhável verificar o formato no qual seu DNS retorna nomes e endereços de hosts. Use valores no mesmo formato nos nomes de contas do MySQL.