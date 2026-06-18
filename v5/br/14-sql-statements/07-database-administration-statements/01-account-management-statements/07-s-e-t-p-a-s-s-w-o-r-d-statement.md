#### 13.7.1.7 Instrução SET PASSWORD

```sql
SET PASSWORD [FOR user] = password_option

password_option: {
    'auth_string'
  | PASSWORD('auth_string')
}
```

A instrução `SET PASSWORD` atribui uma senha a uma conta de usuário MySQL. `'auth_string'` representa uma senha em *cleartext* (não criptografada).

Nota

* A sintaxe `SET PASSWORD ... = PASSWORD('auth_string')` está obsoleta (deprecated) no MySQL 5.7 e foi removida no MySQL 8.0.

* A sintaxe `SET PASSWORD ... = 'auth_string'` não está obsoleta, mas `ALTER USER` é a instrução preferida para alterações de conta, incluindo a atribuição de senhas. Por exemplo:

  ```sql
  ALTER USER user IDENTIFIED BY 'auth_string';
  ```

Importante

Sob algumas circunstâncias, `SET PASSWORD` pode ser registrado nos *logs* do servidor ou no lado do *client* em um arquivo de histórico, como `~/.mysql_history`, o que significa que as senhas em *cleartext* podem ser lidas por qualquer pessoa que tenha acesso de leitura a essa informação. Para obter informações sobre as condições em que isso ocorre para os *logs* do servidor e como controlá-lo, consulte Seção 6.1.2.3, “Senhas e Logging”. Para informações semelhantes sobre *logging* no lado do *client*, consulte Seção 4.5.1.3, “mysql Client Logging”.

`SET PASSWORD` pode ser usado com ou sem uma cláusula `FOR` que nomeia explicitamente uma conta de usuário:

* Com uma cláusula `FOR user`, a instrução define a senha para a conta nomeada, que deve existir:

  ```sql
  SET PASSWORD FOR 'jeffrey'@'localhost' = 'auth_string';
  ```

* Sem uma cláusula `FOR user`, a instrução define a senha para o usuário atual:

  ```sql
  SET PASSWORD = 'auth_string';
  ```

  Qualquer *client* que se conecta ao servidor usando uma conta não anônima pode alterar a senha dessa conta. (Em particular, você pode alterar sua própria senha.) Para ver como o servidor autenticou você, chame a função `CURRENT_USER()`:

  ```sql
  SELECT CURRENT_USER();
  ```

Se uma cláusula `FOR user` for fornecida, o nome da conta usa o formato descrito na Seção 6.2.4, “Especificando Nomes de Contas”. Por exemplo:

```sql
SET PASSWORD FOR 'bob'@'%.example.org' = 'auth_string';
```

A parte do nome do *host* do nome da conta, se omitida, assume o padrão `'%'`.

Definir a senha para uma conta nomeada (com uma cláusula `FOR`) requer o *privilege* `UPDATE` para o *database* de sistema `mysql`. Definir a senha para você mesmo (para uma conta não anônima sem uma cláusula `FOR`) não requer *privileges* especiais. Quando a *system variable* `read_only` está habilitada, `SET PASSWORD` requer o *privilege* `SUPER` além de quaisquer outros *privileges* requeridos.

A senha pode ser especificada das seguintes maneiras:

* Use uma string sem `PASSWORD()`

  ```sql
  SET PASSWORD FOR 'jeffrey'@'localhost' = 'password';
  ```

  `SET PASSWORD` interpreta a *string* como uma *string cleartext*, a passa para o *authentication plugin* associado à conta e armazena o resultado retornado pelo *plugin* na linha da conta na tabela de sistema `mysql.user`. (O *plugin* tem a oportunidade de fazer o *hash* do valor no formato de criptografia que ele espera. O *plugin* pode usar o valor conforme especificado, caso em que nenhum *hashing* ocorre.)

* Use a função `PASSWORD()` (obsoleta no MySQL 5.7)

  ```sql
  SET PASSWORD FOR 'jeffrey'@'localhost' = PASSWORD('password');
  ```

  O argumento de `PASSWORD()` é a senha em *cleartext* (não criptografada). `PASSWORD()` faz o *hash* da senha e retorna a *string* de senha criptografada para armazenamento na linha da conta na tabela de sistema `mysql.user`.

  A função `PASSWORD()` faz o *hash* da senha usando o método de *hashing* determinado pelo valor da *system variable* `old_passwords`. Certifique-se de que `old_passwords` tenha o valor correspondente ao método de *hashing* esperado pelo *authentication plugin* associado à conta. Por exemplo, se a conta usar o *plugin* `mysql_native_password`, o valor de `old_passwords` deve ser 0:

  ```sql
  SET old_passwords = 0;
  SET PASSWORD FOR 'jeffrey'@'localhost' = PASSWORD('password');
  ```

  Se o valor de `old_passwords` for diferente do exigido pelo *authentication plugin*, o valor da senha com *hash* retornado por `PASSWORD()` não poderá ser usado pelo *plugin* e a autenticação correta das conexões do *client* não poderá ocorrer.

A tabela a seguir mostra, para cada método de *hashing* de senha, o valor permitido de `old_passwords` e quais *authentication plugins* usam o método de *hashing*.

<table summary="Para cada método de hashing de senha, o valor permitido de old_passwords e quais plugins de autenticação usam o método de hashing"><col style="width: 40%"/><col style="width: 20%"/><col style="width: 40%"/><thead><tr> <th>Método de Hashing da Senha</th> <th>Valor de old_passwords</th> <th>Authentication Plugin Associado</th> </tr></thead><tbody><tr> <th>Hashing nativo do MySQL 4.1</th> <td>0</td> <td><code>mysql_native_password</code></td> </tr><tr> <th>Hashing SHA-256</th> <td>2</td> <td><code>sha256_password</code></td> </tr> </tbody></table>

Para informações adicionais sobre a definição de senhas e *authentication plugins*, consulte Seção 6.2.10, “Atribuindo Senhas de Conta”, e Seção 6.2.13, “Autenticação Pluggable”.
