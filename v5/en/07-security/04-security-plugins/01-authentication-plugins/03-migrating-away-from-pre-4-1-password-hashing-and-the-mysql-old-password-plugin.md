#### 6.4.1.3 Migrando do Hashing de Senha Pré-4.1 e do Plugin mysql_old_password

O servidor MySQL autentica tentativas de conexão para cada conta listada na tabela de sistema `mysql.user` usando o authentication plugin nomeado na coluna `plugin`. Se a coluna `plugin` estiver vazia, o servidor autentica a conta da seguinte forma:

* Antes do MySQL 5.7, o servidor utiliza o `mysql_native_password` ou `mysql_old_password` plugin implicitamente, dependendo do formato do password hash na coluna `Password`. Se o valor de `Password` estiver vazio ou for um password hash 4.1 (41 caracteres), o servidor utiliza `mysql_native_password`. Se o valor da senha for um password hash pré-4.1 (16 caracteres), o servidor utiliza `mysql_old_password`. (Para informações adicionais sobre esses formatos hash, consulte [Section 6.1.2.4, “Password Hashing in MySQL”](password-hashing.html "6.1.2.4 Password Hashing in MySQL").)

* A partir do MySQL 5.7, o servidor exige que a coluna `plugin` não esteja vazia e desabilita contas que possuem um valor `plugin` vazio.

Os password hashes pré-4.1 e o `mysql_old_password` plugin são descontinuados (deprecated) no MySQL 5.6 e o suporte a eles foi removido no MySQL 5.7. Eles fornecem um nível de segurança inferior ao oferecido pelo password hashing 4.1 e pelo `mysql_native_password` plugin.

Dado o requisito no MySQL 5.7 de que a coluna `plugin` deve ser não vazia, juntamente com a remoção do suporte a `mysql_old_password`, os DBAs são aconselhados a atualizar as contas da seguinte forma:

* Atualizar contas que usam `mysql_native_password` implicitamente para usá-lo explicitamente

* Atualizar contas que usam `mysql_old_password` (seja implícita ou explicitamente) para usar `mysql_native_password` explicitamente

As instruções nesta seção descrevem como realizar essas atualizações. O resultado é que nenhuma conta terá um valor `plugin` vazio e nenhuma conta usará password hashing pré-4.1 ou o `mysql_old_password` plugin.

Como uma variação dessas instruções, os DBAs podem oferecer aos usuários a opção de atualizar para o `sha256_password` plugin, que autentica usando SHA-256 password hashes. Para obter informações sobre este plugin, consulte [Section 6.4.1.5, “SHA-256 Pluggable Authentication”](sha256-pluggable-authentication.html "6.4.1.5 SHA-256 Pluggable Authentication").

A tabela a seguir lista os tipos de contas `mysql.user` consideradas nesta discussão.

<table summary="Características das contas MySQL e o que deve ser feito para atualizá-las."><col style="width: 30%"/><col style="width: 20%"/><col style="width: 30%"/><col style="width: 20%"/><thead><tr> <th>Coluna <code>plugin</code></th> <th>Coluna <code>Password</code></th> <th>Resultado da Autenticação</th> <th>Ação de Upgrade</th> </tr></thead><tbody><tr> <th>Vazio</th> <td>Vazio</td> <td>Usa <code>mysql_native_password</code> implicitamente</td> <td>Atribuir plugin</td> </tr><tr> <th>Vazio</th> <td>Hash 4.1</td> <td>Usa <code>mysql_native_password</code> implicitamente</td> <td>Atribuir plugin</td> </tr><tr> <th>Vazio</th> <td>Hash Pré-4.1</td> <td>Usa <code>mysql_old_password</code> implicitamente</td> <td>Atribuir plugin, rehash password</td> </tr><tr> <th><code>mysql_native_password</code></th> <td>Vazio</td> <td>Usa <code>mysql_native_password</code> explicitamente</td> <td>Nenhuma</td> </tr><tr> <th><code>mysql_native_password</code></th> <td>Hash 4.1</td> <td>Usa <code>mysql_native_password</code> explicitamente</td> <td>Nenhuma</td> </tr><tr> <th><code>mysql_old_password</code></th> <td>Vazio</td> <td>Usa <code>mysql_old_password</code> explicitamente</td> <td>Upgrade do plugin</td> </tr><tr> <th><code>mysql_old_password</code></th> <td>Hash Pré-4.1</td> <td>Usa <code>mysql_old_password</code> explicitamente</td> <td>Upgrade do plugin, rehash password</td> </tr> </tbody></table>

Contas correspondentes às linhas para o `mysql_native_password` plugin não requerem nenhuma ação de upgrade (porque nenhuma alteração de plugin ou formato hash é necessária). Para contas correspondentes às linhas nas quais a senha está vazia, considere pedir aos proprietários da conta que escolham uma senha (ou exija isso usando [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") para expirar senhas de contas vazias).

##### Atualizando Contas do Uso Implícito para Explícito de mysql_native_password

Contas que possuem um plugin vazio e um password hash 4.1 usam `mysql_native_password` implicitamente. Para atualizar essas contas para usar `mysql_native_password` explicitamente, execute estas instruções:

```sql
UPDATE mysql.user SET plugin = 'mysql_native_password'
WHERE plugin = '' AND (Password = '' OR LENGTH(Password) = 41);
FLUSH PRIVILEGES;
```

Antes do MySQL 5.7, você pode executar essas instruções para atualizar as contas proativamente. A partir do MySQL 5.7, você pode executar [**mysql_upgrade**](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables"), que realiza a mesma operação entre suas ações de upgrade.

Notas:

* A operação de upgrade recém-descrita é segura para ser executada a qualquer momento, pois torna o `mysql_native_password` plugin explícito apenas para contas que já o utilizam implicitamente.

* Esta operação não requer alterações de senha, portanto, pode ser realizada sem afetar os usuários ou exigir o envolvimento deles no processo de upgrade.

##### Atualizando Contas de mysql_old_password para mysql_native_password

Contas que usam `mysql_old_password` (seja implícita ou explicitamente) devem ser atualizadas para usar `mysql_native_password` explicitamente. Isso requer a alteração do plugin *e* a alteração da senha do formato hash pré-4.1 para o 4.1.

Para as contas abrangidas nesta etapa que devem ser atualizadas, uma destas condições é verdadeira:

* A conta usa `mysql_old_password` implicitamente porque a coluna `plugin` está vazia e a senha está no formato hash pré-4.1 (16 caracteres).

* A conta usa `mysql_old_password` explicitamente.

Para identificar essas contas, use esta Query:

```sql
SELECT User, Host, Password FROM mysql.user
WHERE (plugin = '' AND LENGTH(Password) = 16)
OR plugin = 'mysql_old_password';
```

A discussão a seguir fornece dois métodos para atualizar esse conjunto de contas. Eles têm características diferentes, portanto, leia ambos e decida qual é o mais adequado para uma determinada instalação MySQL.

**Método 1.**

Características deste método:

* Requer que o servidor e os clients sejam executados com `secure_auth=0` até que todos os usuários tenham sido atualizados para `mysql_native_password`. (Caso contrário, os usuários não poderão se conectar ao servidor usando seus hashes de senha de formato antigo para fins de upgrade para um hash de novo formato.)

* Funciona para MySQL 5.5 e 5.6. No 5.7, ele não funciona porque o servidor exige que as contas tenham um plugin não vazio e as desabilita caso contrário. Portanto, se você já atualizou para 5.7, escolha o Método 2, descrito mais adiante.

Você deve garantir que o servidor esteja sendo executado com [`secure_auth=0`](server-system-variables.html#sysvar_secure_auth).

Para todas as contas que usam `mysql_old_password` explicitamente, defina-as para o plugin vazio:

```sql
UPDATE mysql.user SET plugin = ''
WHERE plugin = 'mysql_old_password';
FLUSH PRIVILEGES;
```

Para também expirar a senha das contas afetadas, use estas instruções:

```sql
UPDATE mysql.user SET plugin = '', password_expired = 'Y'
WHERE plugin = 'mysql_old_password';
FLUSH PRIVILEGES;
```

Agora, os usuários afetados podem redefinir sua senha para usar o hashing 4.1. Peça a cada usuário que agora tem um plugin vazio para se conectar ao servidor e executar estas instruções:

```sql
SET old_passwords = 0;
SET PASSWORD = PASSWORD('user-chosen-password');
```

Note

A opção client-side [`--secure-auth`](mysql-command-options.html#option_mysql_secure-auth) é habilitada por padrão, portanto, lembre os usuários de desativá-la; caso contrário, eles não conseguirão se conectar:

```sql
$> mysql -u user_name -p --secure-auth=0
```

Depois que um usuário afetado executar essas instruções, você poderá definir o plugin da conta correspondente como `mysql_native_password` para tornar o plugin explícito. Ou você pode periodicamente executar estas instruções para encontrar e corrigir quaisquer contas para as quais os usuários afetados redefiniram sua senha:

```sql
UPDATE mysql.user SET plugin = 'mysql_native_password'
WHERE plugin = '' AND (Password = '' OR LENGTH(Password) = 41);
FLUSH PRIVILEGES;
```

Quando não houver mais contas com um plugin vazio, esta Query retornará um resultado vazio:

```sql
SELECT User, Host, Password FROM mysql.user
WHERE plugin = '' AND LENGTH(Password) = 16;
```

Nesse ponto, todas as contas foram migradas do password hashing pré-4.1 e o servidor não precisa mais ser executado com [`secure_auth=0`](server-system-variables.html#sysvar_secure_auth).

**Método 2.**

Características deste método:

* Ele atribui a cada conta afetada uma nova senha, então você deve informar a cada usuário a nova senha e pedir que ele escolha uma nova. A comunicação de senhas aos usuários está fora do escopo do MySQL, mas deve ser feita com cautela.

* Não requer que o servidor ou os clients sejam executados com `secure_auth=0`.

* Funciona para qualquer versão do MySQL 5.5 ou posterior (e para 5.7 tem uma variante mais fácil).

Com este método, você atualiza cada conta separadamente devido à necessidade de definir senhas individualmente. *Escolha uma senha diferente para cada conta.*

Suponha que `'user1'@'localhost'` seja uma das contas a serem atualizadas. Modifique-a da seguinte forma:

* No MySQL 5.7, o `ALTER USER` fornece a capacidade de modificar tanto a senha da conta quanto seu authentication plugin, portanto, você não precisa modificar a tabela de sistema `mysql.user` diretamente:

  ```sql
  ALTER USER 'user1'@'localhost'
  IDENTIFIED WITH mysql_native_password BY 'DBA-chosen-password';
  ```

  Para também expirar a senha da conta, use esta instrução:

  ```sql
  ALTER USER 'user1'@'localhost'
  IDENTIFIED WITH mysql_native_password BY 'DBA-chosen-password'
  PASSWORD EXPIRE;
  ```

  Em seguida, informe ao usuário a nova senha e peça-lhe que se conecte ao servidor com essa senha e execute esta instrução para escolher uma nova senha:

  ```sql
  ALTER USER USER() IDENTIFIED BY 'user-chosen-password';
  ```

* Antes do MySQL 5.7, você deve modificar a tabela de sistema `mysql.user` diretamente usando estas instruções:

  ```sql
  SET old_passwords = 0;
  UPDATE mysql.user SET plugin = 'mysql_native_password',
  Password = PASSWORD('DBA-chosen-password')
  WHERE (User, Host) = ('user1', 'localhost');
  FLUSH PRIVILEGES;
  ```

  Para também expirar a senha da conta, use estas instruções:

  ```sql
  SET old_passwords = 0;
  UPDATE mysql.user SET plugin = 'mysql_native_password',
  Password = PASSWORD('DBA-chosen-password'), password_expired = 'Y'
  WHERE (User, Host) = ('user1', 'localhost');
  FLUSH PRIVILEGES;
  ```

  Em seguida, informe ao usuário a nova senha e peça-lhe que se conecte ao servidor com essa senha e execute estas instruções para escolher uma nova senha:

  ```sql
  SET old_passwords = 0;
  SET PASSWORD = PASSWORD('user-chosen-password');
  ```

Repita para cada conta a ser atualizada.