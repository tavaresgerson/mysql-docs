### 6.2.5 Controle de Acesso, Estágio 1: Verificação de Conexão

Quando você tenta se conectar a um MySQL Server, o Server aceita ou rejeita a conexão com base nestas condições:

* Sua identidade e se você pode verificá-la fornecendo as credentials (credenciais) apropriadas.
* Se sua conta está bloqueada (locked) ou desbloqueada (unlocked).

O Server verifica as credentials primeiro e, em seguida, o estado de locking da conta. Uma falha em qualquer etapa faz com que o Server negue completamente o acesso. Caso contrário, o Server aceita a conexão e, em seguida, entra no Estágio 2 e aguarda por requests (solicitações).

O Server realiza a verificação de identidade e credentials usando colunas na Table `user`, aceitando a conexão apenas se estas condições forem satisfeitas:

* O nome do Host e o nome do User do Client correspondem às colunas `Host` e `User` em alguma linha da Table `user`. Para as regras que regem os valores permissíveis de `Host` e `User`, consulte [Section 6.2.4, “Specifying Account Names”](account-names.html "6.2.4 Specifying Account Names").

* O Client fornece as credentials especificadas na linha (por exemplo, uma password), conforme indicado pela coluna `authentication_string`. As credentials são interpretadas usando o authentication plugin nomeado na coluna `plugin`.

* A linha indica que a conta está unlocked. O estado de locking é registrado na coluna `account_locked`, que deve ter o valor de `'N'`. O account locking pode ser definido ou alterado com as instruções [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") ou [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement").

Sua identidade é baseada em duas informações:

* Seu nome de MySQL User.
* O Host do Client a partir do qual você se conecta.

Se o valor da coluna `User` não estiver em branco, o nome do User em uma conexão de entrada deve corresponder exatamente. Se o valor de `User` estiver em branco, ele corresponderá a qualquer nome de User. Se a linha da Table `user` que corresponde a uma conexão de entrada tiver um nome de User em branco, o User será considerado um anonymous user (usuário anônimo), sem nome, e não um User com o nome que o Client realmente especificou. Isso significa que um nome de User em branco é usado para todas as verificações de acesso futuras durante a conexão (ou seja, durante o Estágio 2).

A coluna `authentication_string` pode estar em branco. Isso não é um wildcard e não significa que qualquer password corresponde. Significa que o User deve se conectar sem especificar uma password. O método de authentication implementado pelo Plugin que autentica o Client pode ou não usar a password na coluna `authentication_string`. Nesse caso, é possível que uma password externa também seja usada para autenticar no MySQL Server.

Valores de password não em branco armazenados na coluna `authentication_string` da Table `user` são encrypted (criptografados). O MySQL não armazena passwords como cleartext para que qualquer pessoa possa vê-las. Em vez disso, a password fornecida por um User que está tentando se conectar é encrypted (usando o método de password hashing implementado pelo account authentication plugin). A password encrypted é então usada durante o processo de conexão ao verificar se a password está correta. Isso é feito sem que a password encrypted nunca trafegue pela conexão. Consulte [Section 6.2.1, “Account User Names and Passwords”](user-names.html "6.2.1 Account User Names and Passwords").

Do ponto de vista do MySQL Server, a password encrypted é a password *real*, então você nunca deve dar acesso a ela a ninguém. Em particular, *não dê a Users não administrativos acesso de leitura a Tables no system Database `mysql`*.

A tabela a seguir mostra como várias combinações de valores de `User` e `Host` na Table `user` se aplicam a conexões de entrada.

<table summary="Como várias combinações de valores de User e Host na Table user se aplicam a conexões de entrada para um MySQL Server."><col style="width: 15%"/><col style="width: 35%"/><col style="width: 50%"/><thead><tr> <th><code>Valor de User</code></th> <th><code>Valor de Host</code></th> <th>Conexões Permitidas</th> </tr></thead><tbody><tr> <th><code>'fred'</code></th> <td><code>'h1.example.net'</code></td> <td><code>fred</code>, conectando-se de <code>h1.example.net</code></td> </tr><tr> <th><code>''</code></th> <td><code>'h1.example.net'</code></td> <td>Qualquer User, conectando-se de <code>h1.example.net</code></td> </tr><tr> <th><code>'fred'</code></th> <td><code>'%'</code></td> <td><code>fred</code>, conectando-se de qualquer Host</td> </tr><tr> <th><code>''</code></th> <td><code>'%'</code></td> <td>Qualquer User, conectando-se de qualquer Host</td> </tr><tr> <th><code>'fred'</code></th> <td><code>'%.example.net'</code></td> <td><code>fred</code>, conectando-se de qualquer Host no domain <code>example.net</code></td> </tr><tr> <th><code>'fred'</code></th> <td><code>'x.example.%'</code></td> <td><code>fred</code>, conectando-se de <code>x.example.net</code>, <code>x.example.com</code>, <code>x.example.edu</code>, e assim por diante; isso provavelmente não é útil</td> </tr><tr> <th><code>'fred'</code></th> <td><code>'198.51.100.177'</code></td> <td><code>fred</code>, conectando-se do Host com IP address <code>198.51.100.177</code></td> </tr><tr> <th><code>'fred'</code></th> <td><code>'198.51.100.%'</code></td> <td><code>fred</code>, conectando-se de qualquer Host no Subnet de classe C <code>198.51.100</code></td> </tr><tr> <th><code>'fred'</code></th> <td><code>'198.51.100.0/255.255.255.0'</code></td> <td>O mesmo que o exemplo anterior</td> </tr> </tbody></table>

É possível que o nome do Host e o nome do User do Client de uma conexão de entrada correspondam a mais de uma linha na Table `user`. O conjunto de exemplos anterior demonstra isso: Várias das entradas mostradas correspondem a uma conexão de `h1.example.net` por `fred`.

Quando são possíveis múltiplas correspondências, o Server deve determinar qual delas usar. Ele resolve essa questão da seguinte forma:

* Sempre que o Server lê a Table `user` para a memória, ele ordena as linhas.

* Quando um Client tenta se conectar, o Server examina as linhas na ordem classificada.

* O Server usa a primeira linha que corresponde ao nome do Host e ao nome do User do Client.

O Server usa regras de ordenação que classificam as linhas com os valores de `Host` mais específicos primeiro:

* IP Addresses literais e nomes de Host são os mais específicos.
* A especificidade de um IP Address literal não é afetada pelo fato de ter ou não um Netmask, portanto `198.51.100.13` e `198.51.100.0/255.255.255.0` são considerados igualmente específicos.

* O padrão `'%'` significa “qualquer Host” e é o menos específico.

* A string vazia `''` também significa “qualquer Host”, mas é classificada após `'%'`.

Conexões Non-TCP (socket file, named pipe e shared memory) são tratadas como conexões locais e correspondem a uma parte do Host de `localhost` se houver alguma conta desse tipo, ou a partes do Host com wildcards que correspondam a `localhost`, caso contrário (por exemplo, `local%`, `l%`, `%`).

Linhas com o mesmo valor de `Host` são ordenadas com os valores de `User` mais específicos primeiro. Um valor de `User` em branco significa “qualquer User” e é o menos específico, portanto, para linhas com o mesmo valor de `Host`, nonanonymous users (Users não anônimos) são classificados antes dos anonymous users.

Para linhas com valores de `Host` e `User` igualmente específicos, a ordem é não determinística.

Para ver como isso funciona, suponha que a Table `user` se pareça com isto:

```sql
+-----------+----------+-
| Host      | User     | ...
+-----------+----------+-
| %         | root     | ...
| %         | jeffrey  | ...
| localhost | root     | ...
| localhost |          | ...
+-----------+----------+-
```

Quando o Server lê a Table para a memória, ele ordena as linhas usando as regras que acabamos de descrever. O resultado após a ordenação é o seguinte:

```sql
+-----------+----------+-
| Host      | User     | ...
+-----------+----------+-
| localhost | root     | ...
| localhost |          | ...
| %         | jeffrey  | ...
| %         | root     | ...
+-----------+----------+-
```

Quando um Client tenta se conectar, o Server examina as linhas ordenadas e usa a primeira correspondência encontrada. Para uma conexão de `localhost` por `jeffrey`, duas das linhas da Table correspondem: a com valores de `Host` e `User` de `'localhost'` e `''`, e a com valores de `'%'` e `'jeffrey'`. A linha `'localhost'` aparece primeiro na ordem classificada, então é essa que o Server usa.

Aqui está outro exemplo. Suponha que a Table `user` se pareça com isto:

```sql
+----------------+----------+-
| Host           | User     | ...
+----------------+----------+-
| %              | jeffrey  | ...
| h1.example.net |          | ...
+----------------+----------+-
```

A Table ordenada é a seguinte:

```sql
+----------------+----------+-
| Host           | User     | ...
+----------------+----------+-
| h1.example.net |          | ...
| %              | jeffrey  | ...
+----------------+----------+-
```

A primeira linha corresponde a uma conexão de qualquer User de `h1.example.net`, enquanto a segunda linha corresponde a uma conexão de `jeffrey` de qualquer Host.

Nota

É um erro comum de percepção pensar que, para um determinado nome de User, todas as linhas que explicitamente nomeiam esse User são usadas primeiro quando o Server tenta encontrar uma correspondência para a conexão. Isso não é verdade. O exemplo anterior ilustra isso, onde uma conexão de `h1.example.net` por `jeffrey` é correspondida primeiro não pela linha que contém `'jeffrey'` como valor da coluna `User`, mas pela linha sem nome de User. Como resultado, `jeffrey` é authenticated (autenticado) como um anonymous user, mesmo que ele tenha especificado um nome de User ao se conectar.

Se você conseguir se conectar ao Server, mas seus privileges (privilégios) não forem o que você espera, você provavelmente está sendo authenticated como alguma outra conta. Para descobrir qual conta o Server usou para autenticá-lo, use a função [`CURRENT_USER()`](information-functions.html#function_current-user). (Consulte [Section 12.15, “Information Functions”](information-functions.html "12.15 Information Functions").) Ela retorna um valor no formato `user_name@host_name` que indica os valores de `User` e `Host` da linha correspondente da Table `user`. Suponha que `jeffrey` se conecte e execute a seguinte Query:

```sql
mysql> SELECT CURRENT_USER();
+----------------+
| CURRENT_USER() |
+----------------+
| @localhost     |
+----------------+
```

O resultado mostrado aqui indica que a linha correspondente da Table `user` tinha um valor de coluna `User` em branco. Em outras palavras, o Server está tratando `jeffrey` como um anonymous user.

Outra forma de diagnosticar problemas de authentication é imprimir a Table `user` e ordená-la manualmente para ver onde a primeira correspondência está sendo feita.