### 8.2.6 Controle de Acesso, Etapa 1: Verificação de Conexão

Quando você tenta se conectar a um servidor MySQL, o servidor aceita ou rejeita a conexão com base nessas condições:

- Sua identidade e se você pode verificá-la fornecendo as credenciais corretas.

- Se sua conta está bloqueada ou desbloqueada.

O servidor verifica as credenciais primeiro, depois o estado de bloqueio da conta. Uma falha em qualquer um desses passos faz com que o servidor negue o acesso completamente. Caso contrário, o servidor aceita a conexão e, em seguida, entra na Etapa 2 e aguarda por solicitações.

O servidor realiza a verificação de identidade e credenciais usando colunas na tabela `user`, aceitando a conexão apenas se essas condições forem atendidas:

- O nome do host do cliente e o nome do usuário correspondem às colunas `Host` e `User` em algumas linhas da tabela `user`. Para as regras que regem os valores permitidos de `Host` e `User`, consulte a Seção 8.2.4, “Especificação de Nomes de Conta”.

- O cliente fornece as credenciais especificadas na linha (por exemplo, uma senha), conforme indicado pela coluna `authentication_string`. As credenciais são interpretadas usando o plugin de autenticação nomeado na coluna `plugin`.

- A linha indica que a conta está desbloqueada. O estado de bloqueio é registrado na coluna `account_locked`, que deve ter um valor de `'N'`. O bloqueio da conta pode ser definido ou alterado com as instruções `CREATE USER` ou `ALTER USER`.

Sua identidade é baseada em dois tipos de informações:

- Seu nome de usuário do MySQL.
- O host do cliente do qual você se conecta.

Se o valor da coluna `User` não estiver em branco, o nome do usuário em uma conexão de entrada deve corresponder exatamente. Se o valor da tabela `User` estiver em branco, ele corresponderá a qualquer nome de usuário. Se a linha da tabela `user` que corresponde a uma conexão de entrada tiver um nome de usuário em branco, o usuário será considerado um usuário anônimo sem nome, e não um usuário com o nome especificado pelo cliente. Isso significa que um nome de usuário em branco será usado para todas as verificações de acesso subsequentes durante a duração da conexão (ou seja, durante a Etapa 2).

A coluna `authentication_string` pode estar em branco. Isso não é um caractere curinga e não significa que qualquer senha corresponda. Isso significa que o usuário deve se conectar sem especificar uma senha. O método de autenticação implementado pelo plugin que autentica o cliente pode ou não usar a senha na coluna `authentication_string`. Nesse caso, é possível que uma senha externa também seja usada para autenticar-se no servidor MySQL.

Os valores de senha não em branco armazenados na coluna `authentication_string` da tabela `user` são criptografados. O MySQL não armazena senhas em texto claro para que qualquer pessoa possa vê-las. Em vez disso, a senha fornecida por um usuário que está tentando se conectar é criptografada (usando o método de hash de senha implementado pelo plugin de autenticação de conta). A senha criptografada é então usada durante o processo de conexão ao verificar se a senha está correta. Isso é feito sem que a senha criptografada viaje pela conexão. Veja a Seção 8.2.1, “Nomes e Senhas de Usuários da Conta”.

Do ponto de vista do servidor MySQL, a senha criptografada é a *real* senha, então você nunca deve dar acesso a ela a ninguém. Em particular, *não dê acesso de leitura a tabelas no banco de dados do sistema `mysql` a usuários que não sejam administradores*.

A tabela a seguir mostra como várias combinações dos valores de `User` e `Host` na tabela `user` se aplicam às conexões recebidas.

<table summary="Como as várias combinações de valores de Usuário e Host na tabela de usuários se aplicam às conexões recebidas em um servidor MySQL."><thead><tr> <th scope="col">[[PH_HTML_CODE_<code>'%'</code>] Valor</th> <th scope="col">[[PH_HTML_CODE_<code>'%'</code>] Valor</th> <th scope="col">Conexões Permitidas</th> </tr></thead><tbody><tr> <th>[[PH_HTML_CODE_<code>''</code>]</th> <td>[[PH_HTML_CODE_<code>'%'</code>]</td> <td>[[PH_HTML_CODE_<code>'fred'</code>], conectando-se a partir de [[PH_HTML_CODE_<code>'%.example.net'</code>]</td> </tr><tr> <th>[[PH_HTML_CODE_<code>fred</code>]</th> <td>[[PH_HTML_CODE_<code>example.net</code>]</td> <td>Qualquer usuário, conectando-se a partir de [[PH_HTML_CODE_<code>'fred'</code>]</td> </tr><tr> <th>[[PH_HTML_CODE_<code>'x.example.%'</code>]</th> <td>[[<code>'%'</code>]]</td> <td>[[<code>Host</code><code>'%'</code>], conectando-se a partir de qualquer host</td> </tr><tr> <th>[[<code>''</code>]]</th> <td>[[<code>'%'</code>]]</td> <td>Qualquer usuário, conectando-se a partir de qualquer host</td> </tr><tr> <th>[[<code>'fred'</code>]]</th> <td>[[<code>'%.example.net'</code>]]</td> <td>[[<code>fred</code>]], conectando-se a partir de qualquer host no domínio [[<code>example.net</code>]]</td> </tr><tr> <th>[[<code>'fred'</code>]]</th> <td>[[<code>'x.example.%'</code>]]</td> <td>[[<code>'fred'</code><code>'%'</code>], conectando-se a partir de [[<code>'fred'</code><code>'%'</code>], [[<code>'fred'</code><code>''</code>], [[<code>'fred'</code><code>'%'</code>], e assim por diante; isso provavelmente não é útil</td> </tr><tr> <th>[[<code>'fred'</code><code>'fred'</code>]</th> <td>[[<code>'fred'</code><code>'%.example.net'</code>]</td> <td>[[<code>'fred'</code><code>fred</code>], conectando-se do host com o endereço IP [[<code>'fred'</code><code>example.net</code>]</td> </tr><tr> <th>[[<code>'fred'</code><code>'fred'</code>]</th> <td>[[<code>'fred'</code><code>'x.example.%'</code>]</td> <td>[[<code>'h1.example.net'</code><code>'%'</code>], conectando-se a partir de qualquer host na sub-rede classe C [[<code>'h1.example.net'</code><code>'%'</code>]</td> </tr><tr> <th>[[<code>'h1.example.net'</code><code>''</code>]</th> <td>[[<code>'h1.example.net'</code><code>'%'</code>]</td> <td>O mesmo que no exemplo anterior</td> </tr></tbody></table>

É possível que o nome do host do cliente e o nome do usuário de uma conexão de entrada correspondam a mais de uma linha na tabela `user`. O conjunto de exemplos anteriores demonstra isso: Várias das entradas mostradas correspondem a uma conexão de `h1.example.net` por `fred`.

Quando há várias opções de jogos, o servidor deve determinar qual deles deve ser usado. Ele resolve esse problema da seguinte forma:

- Sempre que o servidor lê a tabela `user` na memória, ele ordena as linhas.

- Quando um cliente tenta se conectar, o servidor examina as linhas em ordem alfabética.

- O servidor usa a primeira linha que corresponde ao nome do host do cliente e ao nome do usuário.

O servidor utiliza regras de classificação que ordenam as linhas com os valores `Host` mais específicos primeiro:

- Os endereços IP e nomes de host literais são os mais específicos.

- Antes do MySQL 8.0.23, a especificidade de um endereço IP literal não é afetada pelo fato de ele ter uma máscara de rede, portanto, `198.51.100.13` e `198.51.100.0/255.255.255.0` são considerados igualmente específicos. A partir do MySQL 8.0.23, as contas com um endereço IP na parte do host têm essa ordem de especificidade:

  - Contas que têm a parte do host fornecida como um endereço IP:

    ```
    CREATE USER 'user_name'@'127.0.0.1';
    CREATE USER 'user_name'@'198.51.100.44';
    ```

  - Contas que têm a parte do host fornecida como um endereço IP usando a notação CIDR:

    ```
    CREATE USER 'user_name'@'192.0.2.21/8';
    CREATE USER 'user_name'@'198.51.100.44/16';
    ```

  - Contas que têm a parte do host fornecida como um endereço IP com uma máscara de sub-rede:

    ```
    CREATE USER 'user_name'@'192.0.2.0/255.255.255.0';
    CREATE USER 'user_name'@'198.51.0.0/255.255.0.0';
    ```

- O padrão `'%'` significa “qualquer host” e é o menos específico.

- A string vazia `''` também significa “qualquer host”, mas é ordenada após `'%'`.

As conexões não TCP (arquivo de soquete, canal nomeado e memória compartilhada) são tratadas como conexões locais e correspondem a uma parte do host de `localhost` se houver contas desse tipo, ou partes do host com caracteres curinga que correspondem a `localhost` caso contrário (por exemplo, `local%`, `l%`, `%`).

O tratamento do `'%'` como equivalente ao `localhost` é desaconselhável a partir do MySQL 8.0.35, e você deve esperar que esse comportamento seja removido de uma versão futura do MySQL.

As linhas com o mesmo valor de `Host` são ordenadas com os valores de `User` mais específicos primeiro. Um valor em branco de `User` significa “qualquer usuário” e é o menos específico, então, para linhas com o mesmo valor de `Host`, os usuários não anônimos são ordenados antes dos usuários anônimos.

Para linhas com valores igualmente específicos de `Host` e `User`, a ordem é não determinística.

Para ver como isso funciona, vamos supor que a tabela `user` tenha a seguinte aparência:

```
+-----------+----------+-
| Host      | User     | ...
+-----------+----------+-
| %         | root     | ...
| %         | jeffrey  | ...
| localhost | root     | ...
| localhost |          | ...
+-----------+----------+-
```

Quando o servidor lê a tabela na memória, ele ordena as linhas usando as regras descritas acima. O resultado após a ordenação é o seguinte:

```
+-----------+----------+-
| Host      | User     | ...
+-----------+----------+-
| localhost | root     | ...
| localhost |          | ...
| %         | jeffrey  | ...
| %         | root     | ...
+-----------+----------+-
```

Quando um cliente tenta se conectar, o servidor examina as linhas ordenadas e usa a primeira correspondência encontrada. Para uma conexão de `localhost` por `jeffrey`, duas das linhas da tabela correspondem: a que tem os valores `Host` e `User` de `'localhost'` e `''`, e a que tem os valores de `'%'` e `'jeffrey'`. A linha `'localhost'` aparece primeiro na ordem ordenada, então é a que o servidor usa.

Aqui está outro exemplo. Suponha que a tabela `user` tenha a seguinte aparência:

```
+----------------+----------+-
| Host           | User     | ...
+----------------+----------+-
| %              | jeffrey  | ...
| h1.example.net |          | ...
+----------------+----------+-
```

A tabela ordenada parece assim:

```
+----------------+----------+-
| Host           | User     | ...
+----------------+----------+-
| h1.example.net |          | ...
| %              | jeffrey  | ...
+----------------+----------+-
```

A primeira linha corresponde a uma conexão por qualquer usuário de `h1.example.net`, enquanto a segunda linha corresponde a uma conexão por `jeffrey` de qualquer host.

Nota

É um equívoco comum pensar que, para um nome de usuário específico, todas as linhas que explicitamente nomeiam esse usuário são usadas primeiro quando o servidor tenta encontrar uma correspondência para a conexão. Isso não é verdade. O exemplo anterior ilustra isso, onde uma conexão de `h1.example.net` por `jeffrey` é primeiro correspondida não pela linha que contém `'jeffrey'` como o valor da coluna `User`, mas pela linha sem nome de usuário. Como resultado, `jeffrey` é autenticado como um usuário anônimo, mesmo que ele tenha especificado um nome de usuário ao se conectar.

Se você conseguir se conectar ao servidor, mas seus privilégios não forem os que você espera, provavelmente você está sendo autenticado como outra conta. Para descobrir qual conta o servidor usou para autenticar você, use a função `CURRENT_USER()`. (Veja a Seção 14.15, “Funções de Informação”.) Ela retorna um valor no formato `user_name@host_name` que indica os valores `User` e `Host` da linha da tabela `user` correspondente. Suponha que `jeffrey` se conecte e emite a seguinte consulta:

```
mysql> SELECT CURRENT_USER();
+----------------+
| CURRENT_USER() |
+----------------+
| @localhost     |
+----------------+
```

O resultado mostrado aqui indica que a linha da tabela `user` correspondente tinha um valor em branco na coluna `User`. Em outras palavras, o servidor está tratando `jeffrey` como um usuário anônimo.

Outra maneira de diagnosticar problemas de autenticação é imprimir a tabela `user` e classificá-la manualmente para ver onde a primeira correspondência está sendo feita.
