### 8.2.6 Controle de Acesso, Etapa 1: Verificação de Credenciais

Quando você tenta se conectar a um servidor MySQL, o servidor aceita ou rejeita a conexão com base nessas condições:

* Sua identidade e se você pode verificá-la fornecendo as credenciais corretas.
* Se sua conta está bloqueada ou desbloqueada.

O servidor verifica as credenciais primeiro, depois o estado de bloqueio da conta. Uma falha em qualquer etapa faz com que o servidor negue o acesso completamente. Caso contrário, o servidor aceita a conexão e, em seguida, entra na Etapa 2 e aguarda por solicitações.

O servidor realiza a verificação de identidade e credenciais usando colunas na tabela `user`, aceitando a conexão apenas se essas condições forem atendidas:

* O nome do host do cliente e o nome do usuário correspondem às colunas `Host` e `User` em alguma linha da tabela `user`. Para as regras que regem os valores `Host` e `User` permitidos, consulte a Seção 8.2.4, “Especificação de Nomes de Conta”.
* O cliente fornece as credenciais especificadas na linha (por exemplo, uma senha), conforme indicado pela coluna `authentication_string`. As credenciais são interpretadas usando o plugin de autenticação nomeado na coluna `plugin`.
* A linha indica que a conta está desbloqueada. O estado de bloqueio é registrado na coluna `account_locked`, que deve ter um valor de `'N'`. O bloqueio da conta pode ser definido ou alterado com a declaração `CREATE USER` ou `ALTER USER`.

Sua identidade é baseada em duas informações:

* Seu nome de usuário MySQL.
* O nome do host do cliente a partir do qual você se conecta.

Se o valor da coluna `User` não estiver em branco, o nome do usuário em uma conexão entrante deve corresponder exatamente. Se o valor de `User` estiver em branco, ele corresponderá a qualquer nome de usuário. Se a linha da tabela `user` que corresponde a uma conexão entrante tiver um nome de usuário em branco, o usuário é considerado um usuário anônimo sem nome, não um usuário com o nome especificado pelo cliente. Isso significa que um nome de usuário em branco é usado para todas as verificações de acesso subsequentes durante a duração da conexão (ou seja, durante a Etapa 2).

A coluna `authentication_string` pode estar em branco. Isso não é um caractere curinga e não significa que qualquer senha corresponda. Isso significa que o usuário deve se conectar sem especificar uma senha. O método de autenticação implementado pelo plugin que autentica o cliente pode ou não usar a senha na coluna `authentication_string`. Neste caso, é possível que uma senha externa também seja usada para autenticar-se no servidor MySQL.

Valores de senha não em branco armazenados na coluna `authentication_string` da tabela `user` são criptografados. O MySQL não armazena senhas em texto claro para que qualquer pessoa possa vê-las. Em vez disso, a senha fornecida por um usuário que está tentando se conectar é criptografada (usando o método de hash de senha implementado pelo plugin de autenticação de conta). A senha criptografada é então usada durante o processo de conexão ao verificar se a senha está correta. Isso é feito sem que a senha criptografada viaje pela conexão. Veja a Seção 8.2.1, “Nomes e Senhas de Usuários de Conta”.

Do ponto de vista do servidor MySQL, a senha criptografada é a *real* senha, então você nunca deve dar acesso a ninguém a ela. Em particular, *não dê acesso de leitura a usuários não administrativos às tabelas no banco de dados do sistema `mysql*`.

A tabela a seguir mostra como várias combinações de valores de `User` e `Host` na tabela `user` se aplicam a conexões recebidas.

<table>
   <thead>
      <tr>
         <th>Valor do Usuário</th>
         <th>Valor do Host</th>
         <th>Conexões Permitidas</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <th><code>'fred'</code></th>
         <td><code>'h1.example.net'</code></td>
         <td><code>fred</code>, conectando-se a partir de <code>h1.example.net</code></td>
      </tr>
      <tr>
         <th><code>''</code></th>
         <td><code>'h1.example.net'</code></td>
         <td>Qualquer usuário, conectando-se a partir de <code>h1.example.net</code></td>
      </tr>
      <tr>
         <th><code>'fred'</code></th>
         <td><code>'%'</code></td>
         <td><code>fred</code>, conectando-se a partir de qualquer host</td>
      </tr>
      <tr>
         <th><code>''</code></th>
         <td><code>'%'</code></td>
         <td>Qualquer usuário, conectando-se a partir de qualquer host</td>
      </tr>
      <tr>
         <th><code>'fred'</code></th>
         <td><code>'%.example.net'</code></td>
         <td><code>fred</code>, conectando-se a partir de qualquer host no domínio <code>example.net</code></td>
      </tr>
      <tr>
         <th><code>'fred'</code></th>
         <td><code>'x.example.%'</code></td>
         <td><code>fred</code>, conectando-se a partir de <code>x.example.net</code>, <code>x.example.com</code>, <code>x.example.edu</code>, e assim por diante; isso provavelmente não é útil</td>
      </tr>
      <tr>
         <th><code>'fred'</code></th>
         <td><code>'198.51.100.177'</code></td>
         <td><code>fred</code>, conectando-se ao host com o endereço IP <code>198.51.100.177</code></td>
      </tr>
      <tr>
         <th><code>'fred'</code></th>
         <td><code>'198.51.100.%'</code></td>
         <td><code>fred</code>, conectando-se a partir de qualquer host na sub-rede de classe C <code>198.51.100</code></td>
      </tr>
      <tr>
         <th><code>'fred'</code></th>
         <td><code>'198.51.100.0/255.255.255.0'</code></td>
         <td>O mesmo que o exemplo anterior</td>
      </tr>
   </tbody>
</table>

É possível que o nome do host do cliente e o nome de usuário de uma conexão entrante correspondam a mais de uma linha na tabela `user`. O conjunto de exemplos anteriores demonstra isso: Várias das entradas mostradas correspondem a uma conexão de `h1.example.net` por `fred`.

Quando há múltiplos possíveis correspondências, o servidor deve determinar qual delas usar. Ele resolve esse problema da seguinte forma:

* Sempre que o servidor lê a tabela `user` na memória, ele ordena as linhas.
* Quando um cliente tenta se conectar, o servidor examina as linhas em ordem ordenada.
* O servidor usa a primeira linha que corresponde ao nome do host e ao nome de usuário do cliente.

O servidor usa regras de ordenação que ordenam as linhas com os valores de `Host` mais específicos primeiro:

* Endereços IP literais e nomes de host são os mais específicos.
* Contas com um endereço IP na parte do host têm essa ordem de especificidade:

  + Contas que têm a parte do host dada como um endereço IP:

    ```
    CREATE USER 'user_name'@'127.0.0.1';
    CREATE USER 'user_name'@'198.51.100.44';
    ```
  + Contas que têm a parte do host dada como um endereço IP usando notação CIDR:

    ```
    CREATE USER 'user_name'@'192.0.2.21/8';
    CREATE USER 'user_name'@'198.51.100.44/16';
    ```
  + Contas que têm a parte do host dada como um endereço IP com uma máscara de sub-rede:

    ```
    CREATE USER 'user_name'@'192.0.2.0/255.255.255.0';
    CREATE USER 'user_name'@'198.51.0.0/255.255.0.0';
    ```
* O padrão `'%'` significa “qualquer host” e é o menos específico.
* A string vazia `''` também significa “qualquer host”, mas é ordenada depois de `'%'`.

Conexões não TCP (socket de arquivo, pipe nomeado e memória compartilhada) são tratadas como conexões locais e correspondem a uma parte do host de `localhost` se houver contas com essa parte, ou partes do host com caracteres curinga que correspondem a `localhost` caso contrário (por exemplo, `local%`, `l%`, `%`).

O tratamento de `'%'` como equivalente a `localhost` é desatualizado; você deve esperar que esse comportamento seja removido de uma versão futura do MySQL.

Linhas com o mesmo valor de `Host` são ordenadas com os valores de `User` mais específicos primeiro. Um valor de `User` em branco significa “qualquer usuário” e é o menos específico, então, para linhas com o mesmo valor de `Host`, os usuários não anônimos são ordenados antes dos usuários anônimos.

Para linhas com valores de `Host` e `User` igualmente específicos, a ordem é não determinística.

Para ver como isso funciona, suponha que a tabela `user` tenha este formato:

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

Quando o servidor lê a tabela na memória, ele ordena as linhas usando as regras descritas anteriormente. O resultado após a ordenação é o seguinte:

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

Quando um cliente tenta se conectar, o servidor examina as linhas ordenadas e usa a primeira correspondência encontrada. Para uma conexão de `localhost` por `jeffrey`, duas das linhas da tabela correspondem: a que tem os valores de `Host` e `User` de `'localhost'` e `''`, e a que tem os valores de `'%'` e `'jeffrey'`. A linha `'localhost'` aparece primeiro na ordem ordenada, então é a que o servidor usa.

Aqui está outro exemplo. Suponha que a tabela `user` tenha este formato:

```
+----------------+----------+-
| Host           | User     | ...
+----------------+----------+-
| %              | jeffrey  | ...
| h1.example.net |          | ...
+----------------+----------+-
```

A tabela ordenada tem este formato:

```
+----------------+----------+-
| Host           | User     | ...
+----------------+----------+-
| h1.example.net |          | ...
| %              | jeffrey  | ...
+----------------+----------+-
```

A primeira linha corresponde a uma conexão de qualquer usuário de `h1.example.net`, enquanto a segunda linha corresponde a uma conexão de `jeffrey` de qualquer host.

::: info Nota

É um equívoco comum pensar que, para um nome de usuário dado, todas as linhas que explicitamente nomeiam esse usuário são usadas primeiro quando o servidor tenta encontrar uma correspondência para a conexão. Isso não é verdade. O exemplo anterior ilustra isso, onde uma conexão de `h1.example.net` por `jeffrey` é correspondida primeiro não pela linha que contém `'jeffrey'` como valor da coluna `User`, mas pela linha sem nome de usuário. Como resultado, `jeffrey` é autenticado como um usuário anônimo, mesmo que ele tenha especificado um nome de usuário ao se conectar.

Se você conseguir se conectar ao servidor, mas seus privilégios não forem os esperados, provavelmente está sendo autenticado como outra conta. Para descobrir qual conta o servidor usou para autenticá-lo, use a função `CURRENT_USER()`. (Veja a Seção 14.15, “Funções de Informação”.) Ela retorna um valor no formato `user_name@host_name` que indica os valores `User` e `Host` da linha correspondente da tabela `user`. Suponha que `jeffrey` se conecte e execute a seguinte consulta:

```
mysql> SELECT CURRENT_USER();
+----------------+
| CURRENT_USER() |
+----------------+
| @localhost     |
+----------------+
```

O resultado mostrado aqui indica que a linha correspondente da tabela `user` tinha um valor em branco na coluna `User`. Em outras palavras, o servidor está tratando `jeffrey` como um usuário anônimo.

Outra maneira de diagnosticar problemas de autenticação é imprimir a tabela `user` e ordená-la manualmente para ver onde a primeira correspondência está sendo feita.