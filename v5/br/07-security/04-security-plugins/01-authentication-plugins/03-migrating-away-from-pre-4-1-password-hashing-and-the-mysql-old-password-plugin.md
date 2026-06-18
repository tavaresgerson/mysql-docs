#### 6.4.1.3 Migrando para fora da hashing de senhas pré-4.1 e do plugin mysql_old_password

O servidor MySQL autentica as tentativas de conexão para cada conta listada na tabela de sistema `mysql.user` usando o plugin de autenticação nomeado na coluna `plugin`. Se a coluna `plugin` estiver vazia, o servidor autentica a conta da seguinte forma:

- Antes do MySQL 5.7, o servidor usa o plugin `mysql_native_password` ou `mysql_old_password` implicitamente, dependendo do formato do hash da senha na coluna `Password`. Se o valor de `Password` estiver vazio ou for um hash de senha pré-4.1 (41 caracteres), o servidor usa `mysql_native_password`. Se o valor da senha for um hash de senha pré-4.1 (16 caracteres), o servidor usa `mysql_old_password`. (Para informações adicionais sobre esses formatos de hash, consulte Seção 6.1.2.4, “Hash de Senha no MySQL”).

- A partir do MySQL 5.7, o servidor exige que a coluna `plugin` esteja preenchida e desabilita as contas que têm um valor `plugin` vazio.

Os hashes de senhas anteriores à versão 4.1 e o plugin `mysql_old_password` estão desatualizados no MySQL 5.6 e o suporte a eles é removido no MySQL 5.7. Eles oferecem um nível de segurança inferior ao oferecido pelo hashing de senhas da versão 4.1 e pelo plugin `mysql_native_password`.

Dada a exigência no MySQL 5.7 de que a coluna `plugin` deve ser não vazia, juntamente com a remoção do suporte ao `mysql_old_password`, os administradores de banco de dados são aconselhados a atualizar as contas da seguinte forma:

- Atualize as contas que usam `mysql_native_password` implicitamente para usá-lo explicitamente

- Atualize as contas que utilizam `mysql_old_password` (implicitamente ou explicitamente) para usar `mysql_native_password` explicitamente

As instruções nesta seção descrevem como realizar essas atualizações. O resultado é que nenhuma conta tem o valor `plugin` vazio e nenhuma conta usa hashing de senha pré-4.1 ou o plugin `mysql_old_password`.

Como uma variante dessas instruções, os administradores de banco de dados podem oferecer aos usuários a opção de atualizar para o plugin `sha256_password`, que autentica usando hashes de senhas SHA-256. Para obter informações sobre este plugin, consulte Seção 6.4.1.5, “Autenticação Pluggable SHA-256”.

A tabela a seguir lista os tipos de contas `mysql.user` considerados nesta discussão.

<table summary="Características das contas do MySQL e o que deve ser feito para atualizá-las."><thead><tr><th>Coluna <code>plugin</code></th><th>Coluna <code>password</code></th><th>Resultado da Autenticação</th><th>Ação de Atualização</th></tr></thead><tbody><tr><th>Vazio</th><td>Vazio</td><td>Utiliza implicitamente <code>mysql_native_password</code></td><td>Atribuir plugin</td></tr><tr><th>Vazio</th><td>4.1 hash</td><td>Utiliza implicitamente <code>mysql_native_password</code></td><td>Atribuir plugin</td></tr><tr><th>Vazio</th><td>Pre-4.1 hash</td><td>Usa implicitamente <code>mysql_old_password</code></td><td>Atribuir plugin, recalcular senha</td></tr><tr><th><code>mysql_native_password</code></th><td>Vazio</td><td>Usa explicitamente <code>mysql_native_password</code></td><td>Nenhum</td></tr><tr><th><code>mysql_native_password</code></th><td>4.1 hash</td><td>Usa explicitamente <code>mysql_native_password</code></td><td>Nenhum</td></tr><tr><th><code>mysql_old_password</code></th><td>Vazio</td><td>Usa explicitamente <code>mysql_old_password</code></td><td>Atualizar plugin</td></tr><tr><th><code>mysql_old_password</code></th><td>Pre-4.1 hash</td><td>Usa explicitamente <code>mysql_old_password</code></td><td>Atualizar plugin, recalcular senha</td></tr></tbody></table>

As contas correspondentes às linhas do plugin `mysql_native_password` não requerem nenhuma ação de atualização (porque não é necessário alterar o plugin ou o formato do hash). Para contas correspondentes a linhas nas quais a senha está vazia, considere pedir aos proprietários das contas que escolham uma senha (ou exija-a usando `ALTER USER` para expirar senhas de contas vazias).

##### Atualizar contas de implicitas para explícitas usando mysql_native_password Use

Contas que têm um plugin vazio e um hash de senha 4.1 usam implicitamente `mysql_native_password`. Para atualizar essas contas para usar `mysql_native_password` explicitamente, execute essas instruções:

```sql
UPDATE mysql.user SET plugin = 'mysql_native_password'
WHERE plugin = '' AND (Password = '' OR LENGTH(Password) = 41);
FLUSH PRIVILEGES;
```

Antes do MySQL 5.7, você pode executar essas instruções para atualizar as contas de forma proativa. A partir do MySQL 5.7, você pode executar **mysql_upgrade**, que realiza a mesma operação entre suas ações de atualização.

::: info Notas:
- A operação de atualização descrita acima é segura para ser executada a qualquer momento, pois torna o plugin `mysql_native_password` explícito apenas para contas que já o usam implicitamente.

- Essa operação não requer alterações de senha, portanto, pode ser realizada sem afetar os usuários ou exigir seu envolvimento no processo de atualização.
:::
##### Atualizando contas de mysql_old_password para mysql_native_password

As contas que usam `mysql_old_password` (implicitamente ou explicitamente) devem ser atualizadas para usar `mysql_native_password` explicitamente. Isso requer a alteração do plugin *e* a alteração da senha do formato de hash anterior a 4.1 para o formato de hash 4.1.

Para as contas cobertas nesta etapa que precisam ser atualizadas, uma dessas condições é verdadeira:

- A conta usa `mysql_old_password` implicitamente porque a coluna `plugin` está vazia e a senha tem o formato de hash pré-4.1 (16 caracteres).

- A conta usa explicitamente `mysql_old_password`.

Para identificar essas contas, use esta consulta:

```sql
SELECT User, Host, Password FROM mysql.user
WHERE (plugin = '' AND LENGTH(Password) = 16)
OR plugin = 'mysql_old_password';
```

A discussão a seguir apresenta dois métodos para atualizar esse conjunto de contas. Eles têm características diferentes, então leia ambos e decida qual é mais adequado para uma instalação MySQL específica.

**Método 1.**

Características desse método:

- É necessário que o servidor e os clientes sejam executados com `secure_auth=0` até que todos os usuários tenham sido atualizados para `mysql_native_password`. (Caso contrário, os usuários não poderão se conectar ao servidor usando suas senhas de formato antigo para a finalidade de atualização para um hash de formato novo.)

- Funciona para MySQL 5.5 e 5.6. No 5.7, ele não funciona porque o servidor exige que as contas tenham um plugin não vazio e desabilita-as caso contrário. Portanto, se você já tiver atualizado para o 5.7, escolha o Método 2, descrito mais adiante.

Você deve garantir que o servidor esteja rodando com `secure_auth=0`.

Para todas as contas que usam explicitamente `mysql_old_password`, configure-as para o plugin vazio:

```sql
UPDATE mysql.user SET plugin = ''
WHERE plugin = 'mysql_old_password';
FLUSH PRIVILEGES;
```

Para expirar também a senha das contas afetadas, use essas declarações:

```sql
UPDATE mysql.user SET plugin = '', password_expired = 'Y'
WHERE plugin = 'mysql_old_password';
FLUSH PRIVILEGES;
```

Agora, os usuários afetados podem redefinir sua senha para usar o hashing 4.1. Peça a cada usuário que agora tem um plugin vazio para se conectar ao servidor e executar essas instruções:

```sql
SET old_passwords = 0;
SET PASSWORD = PASSWORD('user-chosen-password');
```

Nota

A opção `--secure-auth` do lado do cliente (mysql-command-options.html#option_mysql_secure-auth) está habilitada por padrão, então lembre os usuários de desabilitá-la; caso contrário, eles não poderão se conectar:

```sh
$> mysql -u user_name -p --secure-auth=0
```

Depois que um usuário afetado tiver executado essas declarações, você pode configurar o plugin de conta correspondente para `mysql_native_password` para tornar o plugin explícito. Ou você pode executar periodicamente essas declarações para encontrar e corrigir quaisquer contas para as quais os usuários afetados tenham redefinido sua senha:

```sql
UPDATE mysql.user SET plugin = 'mysql_native_password'
WHERE plugin = '' AND (Password = '' OR LENGTH(Password) = 41);
FLUSH PRIVILEGES;
```

Quando não houver mais contas com um plugin vazio, essa consulta retornará um resultado vazio:

```sql
SELECT User, Host, Password FROM mysql.user
WHERE plugin = '' AND LENGTH(Password) = 16;
```

Nesse ponto, todas as contas foram migradas para a geração de senhas antes da versão 4.1 e o servidor não precisa mais ser executado com `secure_auth=0`.

**Método 2.**

Características desse método:

- Ele atribui uma nova senha a cada conta afetada, então você deve informar cada usuário sobre a nova senha e pedir que ele escolha uma nova. A comunicação de senhas aos usuários está fora do escopo do MySQL, mas deve ser feita com cuidado.

- Não é necessário que o servidor ou os clientes sejam executados com `secure_auth=0`.

- Funciona para qualquer versão do MySQL 5.5 ou posterior (e para o 5.7 tem uma variante mais fácil).

Com esse método, você atualiza cada conta separadamente, devido à necessidade de definir senhas individualmente. *Escolha uma senha diferente para cada conta.*

Suponha que `'user1'@'localhost'` seja uma das contas a serem atualizadas. Modifique-a da seguinte forma:

- No MySQL 5.7, a opção `ALTER USER` permite modificar tanto a senha da conta quanto seu plugin de autenticação, então você não precisa modificar diretamente a tabela `mysql.user`:

  ```sql
  ALTER USER 'user1'@'localhost'
  IDENTIFIED WITH mysql_native_password BY 'DBA-chosen-password';
  ```

  Para expirar também a senha da conta, use esta declaração:

  ```sql
  ALTER USER 'user1'@'localhost'
  IDENTIFIED WITH mysql_native_password BY 'DBA-chosen-password'
  PASSWORD EXPIRE;
  ```

  Em seguida, informe ao usuário a nova senha e peça que ele se conecte ao servidor com essa senha e execute essa instrução para escolher uma nova senha:

  ```sql
  ALTER USER USER() IDENTIFIED BY 'user-chosen-password';
  ```

- Antes do MySQL 5.7, você deve modificar a tabela de sistema `mysql.user` diretamente usando essas instruções:

  ```sql
  SET old_passwords = 0;
  UPDATE mysql.user SET plugin = 'mysql_native_password',
  Password = PASSWORD('DBA-chosen-password')
  WHERE (User, Host) = ('user1', 'localhost');
  FLUSH PRIVILEGES;
  ```

  Para expirar também a senha da conta, use essas declarações:

  ```sql
  SET old_passwords = 0;
  UPDATE mysql.user SET plugin = 'mysql_native_password',
  Password = PASSWORD('DBA-chosen-password'), password_expired = 'Y'
  WHERE (User, Host) = ('user1', 'localhost');
  FLUSH PRIVILEGES;
  ```

  Em seguida, informe ao usuário a nova senha e peça que ele se conecte ao servidor com essa senha e execute essas instruções para escolher uma nova senha:

  ```sql
  SET old_passwords = 0;
  SET PASSWORD = PASSWORD('user-chosen-password');
  ```

Repita para cada conta que precisa ser atualizada.
