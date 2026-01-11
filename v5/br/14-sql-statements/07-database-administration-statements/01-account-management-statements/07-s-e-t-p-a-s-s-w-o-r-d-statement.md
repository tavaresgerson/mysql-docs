#### 13.7.1.7 Declaração de definir senha

```sql
SET PASSWORD [FOR user] = password_option

password_option: {
    'auth_string'
  | PASSWORD('auth_string')
}
```

A instrução `SET PASSWORD` atribui uma senha a uma conta de usuário do MySQL. `'auth_string'` representa uma senha em texto claro (não criptografada).

Nota

- A sintaxe `SET PASSWORD ... = PASSWORD('auth_string')` é desatualizada no MySQL 5.7 e será removida no MySQL 8.0.

- A sintaxe `SET PASSWORD ... = 'auth_string'` não está desatualizada, mas `ALTER USER` é a declaração preferida para alterações de contas, incluindo a atribuição de senhas. Por exemplo:

  ```sql
  ALTER USER user IDENTIFIED BY 'auth_string';
  ```

Importante

Em algumas circunstâncias, `SET PASSWORD` pode ser registrado nos logs do servidor ou no lado do cliente em um arquivo de histórico, como `~/.mysql_history`, o que significa que senhas em texto claro podem ser lidas por qualquer pessoa que tenha acesso de leitura a essas informações. Para obter informações sobre as condições sob as quais isso ocorre para os logs do servidor e como controlá-lo, consulte Seção 6.1.2.3, “Senhas e Registro”. Para informações semelhantes sobre o registro no lado do cliente, consulte Seção 4.5.1.3, “Registro do Cliente do MySQL”.

`SET PASSWORD` pode ser usado com ou sem uma cláusula `FOR` que nomeia explicitamente uma conta de usuário:

- Com uma cláusula `FOR user`, a declaração define a senha para a conta nomeada, que deve existir:

  ```sql
  SET PASSWORD FOR 'jeffrey'@'localhost' = 'auth_string';
  ```

- Sem a cláusula `FOR user`, a declaração define a senha para o usuário atual:

  ```sql
  SET PASSWORD = 'auth_string';
  ```

  Qualquer cliente que se conecte ao servidor usando uma conta não anônima pode alterar a senha dessa conta. (Em particular, você pode alterar sua própria senha.) Para ver qual conta o servidor autenticou você, invoque a função `CURRENT_USER()`:

  ```sql
  SELECT CURRENT_USER();
  ```

Se uma cláusula `FOR user` for fornecida, o nome da conta usa o formato descrito na Seção 6.2.4, “Especificação de Nomes de Conta”. Por exemplo:

```sql
SET PASSWORD FOR 'bob'@'%.example.org' = 'auth_string';
```

A parte do nome do host do nome da conta, se omitida, tem como padrão `'%'.`

Definir a senha para uma conta nomeada (com uma cláusula `FOR`) requer o privilégio `UPDATE` para o banco de dados do sistema `mysql`. Definir a senha para si mesmo (para uma conta não anônima sem a cláusula `FOR`) não requer privilégios especiais. Quando a variável de sistema `read_only` está habilitada, `SET PASSWORD` requer o privilégio `SUPER`, além de quaisquer outros privilégios necessários.

A senha pode ser especificada das seguintes maneiras:

- Use uma string sem [`PASSWORD()`](https://docs.djangoproject.com/en/3.1/ref/cryptography/functions/#function_password)

  ```sql
  SET PASSWORD FOR 'jeffrey'@'localhost' = 'password';
  ```

  `SET PASSWORD` interpreta a string como uma string em texto claro, passa-a para o plugin de autenticação associado à conta e armazena o resultado retornado pelo plugin na linha da conta na tabela `mysql.user` do sistema. (O plugin tem a oportunidade de hashar o valor no formato de criptografia que ele espera. O plugin pode usar o valor conforme especificado, nesse caso, não ocorre hash.)

- Use a função [`PASSWORD()`](https://pt.wikipedia.org/wiki/Fun%C3%A7%C3%A3o_PASSWORD_\(MySQL\)#fun%C3%A7%C3%A3o_PASSWORD) (desatualizada no MySQL 5.7)

  ```sql
  SET PASSWORD FOR 'jeffrey'@'localhost' = PASSWORD('password');
  ```

  O argumento [`PASSWORD()`](https://pt.docs.oracle.com/database/12/ENCRYPT/ENCRYPT.HTM#function_password) é a senha em texto claro (não criptografada). [`PASSWORD()`](https://pt.docs.oracle.com/database/12/ENCRYPT/ENCRYPT.HTM#function_password) criptografa a senha e retorna a string criptografada da senha para armazenamento na linha de conta na tabela `mysql.user` do sistema.

  A função `PASSWORD()` encripta a senha usando o método de encriptação determinado pelo valor da variável de sistema `old_passwords`. Certifique-se de que `old_passwords` tenha o valor correspondente ao método de encriptação esperado pelo plugin de autenticação associado à conta. Por exemplo, se a conta usa o plugin `mysql_native_password`, o valor de `old_passwords` deve ser 0:

  ```sql
  SET old_passwords = 0;
  SET PASSWORD FOR 'jeffrey'@'localhost' = PASSWORD('password');
  ```

  Se o valor de `old_passwords` for diferente do exigido pelo plugin de autenticação, o valor da senha criptografada retornado por `PASSWORD()` não poderá ser usado pelo plugin e a autenticação correta das conexões do cliente não poderá ocorrer.

A tabela a seguir mostra, para cada método de hashing de senha, o valor permitido de `old_passwords` e quais plugins de autenticação usam o método de hashing.

<table summary="Para cada método de hashing de senha, o valor permitido de old_passwords e quais plugins de autenticação usam o método de hashing"><col style="width: 40%"/><col style="width: 20%"/><col style="width: 40%"/><thead><tr> <th>Método de Hashing de Senha</th> <th>senhas antigas Valor</th> <th>Plugin de Autenticação Associada</th> </tr></thead><tbody><tr> <th>Hashing nativo do MySQL 4.1</th> <td>0</td> <td><code>mysql_native_password</code></td> </tr><tr> <th>Hashing SHA-256</th> <td>2</td> <td><code>sha256_password</code></td> </tr></tbody></table>

Para obter informações adicionais sobre a configuração de senhas e plugins de autenticação, consulte Seção 6.2.10, “Atribuição de Senhas de Conta” e Seção 6.2.13, “Autenticação Personalizável”.
