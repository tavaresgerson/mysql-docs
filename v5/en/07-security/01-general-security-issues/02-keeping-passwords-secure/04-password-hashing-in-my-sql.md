#### 6.1.2.4 Hashing de Senha no MySQL

Nota

As informações nesta seção se aplicam integralmente apenas antes do MySQL 5.7.5 e somente para contas que usam os *authentication plugins* `mysql_native_password` ou `mysql_old_password`. O suporte para *password hashes* pré-4.1 foi removido no MySQL 5.7.5. Isso inclui a remoção do *authentication plugin* `mysql_old_password` e da função `OLD_PASSWORD()`. Além disso, [`secure_auth`](server-system-variables.html#sysvar_secure_auth) não pode ser desativado, e [`old_passwords`](server-system-variables.html#sysvar_old_passwords) não pode ser definido como 1.

A partir do MySQL 5.7.5, apenas as informações sobre *password hashes* 4.1 e o *authentication plugin* `mysql_native_password` permanecem relevantes.

O MySQL lista as contas de *user* na tabela `user` do *Database* `mysql`. Cada conta MySQL pode ter uma *password* atribuída, embora a tabela `user` não armazene a versão em texto puro (*cleartext*) da *password*, mas sim um *hash value* computado a partir dela.

O MySQL usa *passwords* em duas fases da comunicação *client*/server:

* Quando um *client* tenta se conectar ao *server*, há uma etapa inicial de autenticação na qual o *client* deve apresentar uma *password* que tenha um *hash value* correspondente ao *hash value* armazenado na tabela `user` para a conta que o *client* deseja usar.

* Após o *client* se conectar, ele pode (se tiver privilégios suficientes) definir ou alterar o *password hash* para contas listadas na tabela `user`. O *client* pode fazer isso usando a função [`PASSWORD()`](encryption-functions.html#function_password) para gerar um *password hash*, ou usando uma *statement* de geração de *password* ([`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement"), [`GRANT`](grant.html "13.7.1.4 GRANT Statement"), ou [`SET PASSWORD`](set-password.html "13.7.1.7 SET PASSWORD Statement")).

Em outras palavras, o *server* *verifica* os *hash values* durante a autenticação quando um *client* tenta se conectar pela primeira vez. O *server* *gera* os *hash values* se um *client* conectado invocar a função [`PASSWORD()`](encryption-functions.html#function_password) ou usar uma *statement* de geração de *password* para definir ou alterar uma *password*.

Os métodos de *password hashing* no MySQL têm o histórico descrito a seguir. Essas mudanças são ilustradas por alterações no resultado da função [`PASSWORD()`](encryption-functions.html#function_password) que computa os *password hash values* e na estrutura da tabela `user` onde as *passwords* são armazenadas.

##### O Método de Hashing Original (Pré-4.1)

O método de *hashing* original produzia uma *string* de 16 *bytes*. Tais *hashes* se parecem com isto:

```sql
mysql> SELECT PASSWORD('mypass');
+--------------------+
| PASSWORD('mypass') |
+--------------------+
| 6f8c114b58f2ce9e   |
+--------------------+
```

Para armazenar *passwords* de contas, a coluna `Password` da tabela `user` tinha, neste ponto, 16 *bytes* de comprimento.

##### O Método de Hashing 4.1

O MySQL 4.1 introduziu o *password hashing* que forneceu melhor segurança e reduziu o risco de *passwords* serem interceptadas. Houve vários aspectos nesta mudança:

* Formato diferente dos *password values* produzidos pela função [`PASSWORD()`](encryption-functions.html#function_password)
* Alargamento da coluna `Password`
* Controle sobre o método de *hashing* padrão
* Controle sobre os métodos de *hashing* permitidos para *clients* que tentam se conectar ao *server*

As mudanças no MySQL 4.1 ocorreram em duas etapas:

* O MySQL 4.1.0 usou uma versão preliminar do método de *hashing* 4.1. Este método teve vida curta e a discussão a seguir não menciona mais nada sobre ele.

* No MySQL 4.1.1, o método de *hashing* foi modificado para produzir um *hash value* mais longo, de 41 *bytes*:

  ```sql
  mysql> SELECT PASSWORD('mypass');
  +-------------------------------------------+
  | PASSWORD('mypass')                        |
  +-------------------------------------------+
  | *6C8989366EAF75BB670AD8EA7A7FC1176A95CEF4 |
  +-------------------------------------------+
  ```

  O formato de *password hash* mais longo tem melhores propriedades criptográficas, e a autenticação de *client* baseada em *long hashes* é mais segura do que a baseada em *short hashes* mais antigos.

  Para acomodar *password hashes* mais longos, a coluna `Password` na tabela `user` foi alterada neste ponto para ter 41 *bytes*, seu comprimento atual.

  Uma coluna `Password` alargada pode armazenar *password hashes* nos formatos pré-4.1 e 4.1. O formato de qualquer *hash value* pode ser determinado de duas maneiras:

  + O comprimento: *hashes* 4.1 e pré-4.1 são de 41 e 16 *bytes*, respectivamente.

  + *Password hashes* no formato 4.1 sempre começam com um caractere `*`, enquanto *passwords* no formato pré-4.1 nunca começam.

  Para permitir a geração explícita de *password hashes* pré-4.1, duas mudanças adicionais foram feitas:

  + A função `OLD_PASSWORD()` foi adicionada, que retorna *hash values* no formato de 16 *bytes*.

  + Para fins de compatibilidade, a *system variable* [`old_passwords`](server-system-variables.html#sysvar_old_passwords) foi adicionada, para permitir que DBAs e aplicações controlem o método de *hashing*. O valor padrão de 0 para [`old_passwords`](server-system-variables.html#sysvar_old_passwords) faz com que o *hashing* use o método 4.1 (*hash values* de 41 *bytes*), mas definir [`old_passwords=1`](server-system-variables.html#sysvar_old_passwords) faz com que o *hashing* use o método pré-4.1. Neste caso, [`PASSWORD()`](encryption-functions.html#function_password) produz valores de 16 *bytes* e é equivalente a `OLD_PASSWORD()`.

  Para permitir que os DBAs controlem como os *clients* têm permissão para se conectar, a *system variable* [`secure_auth`](server-system-variables.html#sysvar_secure_auth) foi adicionada. Iniciar o *server* com esta variável desativada ou ativada permite ou proíbe que *clients* se conectem usando o método de *password hashing* pré-4.1 mais antigo. Antes do MySQL 5.6.5, [`secure_auth`](server-system-variables.html#sysvar_secure_auth) é desativado por padrão. A partir do 5.6.5, [`secure_auth`](server-system-variables.html#sysvar_secure_auth) é ativado por padrão para promover uma configuração padrão mais segura. Os DBAs podem desativá-lo a seu critério, mas isso não é recomendado, e os *password hashes* pré-4.1 estão descontinuados (*deprecated*) e devem ser evitados. (Para instruções de atualização de conta, consulte [Section 6.4.1.3, “Migrating Away from Pre-4.1 Password Hashing and the mysql_old_password Plugin”](account-upgrades.html "6.4.1.3 Migrating Away from Pre-4.1 Password Hashing and the mysql_old_password Plugin").)

  Além disso, o *client* [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") suporta a opção [`--secure-auth`](mysql-command-options.html#option_mysql_secure-auth) que é análoga a [`secure_auth`](server-system-variables.html#sysvar_secure_auth), mas do lado do *client*. Ela pode ser usada para evitar conexões com contas menos seguras que usam *password hashing* pré-4.1. Esta opção é desativada por padrão antes do MySQL 5.6.7, sendo ativada a partir de então.

##### Problemas de Compatibilidade Relacionados aos Métodos de Hashing

O alargamento da coluna `Password` no MySQL 4.1 de 16 *bytes* para 41 *bytes* afeta as operações de instalação ou *upgrade* da seguinte forma:

* Se você realizar uma nova instalação do MySQL, a coluna `Password` é automaticamente definida com 41 *bytes* de comprimento.

* *Upgrades* do MySQL 4.1 ou posterior para versões atuais do MySQL não devem gerar quaisquer problemas em relação à coluna `Password` porque ambas as versões usam o mesmo comprimento de coluna e método de *password hashing*.

* Para *upgrades* de uma versão pré-4.1 para 4.1 ou posterior, você deve atualizar as tabelas do sistema após o *upgrade*. (Consulte [Section 4.4.7, “mysql_upgrade — Check and Upgrade MySQL Tables”](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables").)

O método de *hashing* 4.1 é compreendido apenas por *servers* e *clients* MySQL 4.1 (e superiores), o que pode resultar em alguns problemas de compatibilidade. Um *client* 4.1 ou superior pode se conectar a um *server* pré-4.1, porque o *client* entende ambos os métodos de *password hashing*, pré-4.1 e 4.1. No entanto, um *client* pré-4.1 que tenta se conectar a um *server* 4.1 ou superior pode encontrar dificuldades. Por exemplo, um *client* [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") 4.0 pode falhar com a seguinte mensagem de erro:

```sql
$> mysql -h localhost -u root
Client does not support authentication protocol requested
by server; consider upgrading MySQL client
```

A discussão a seguir descreve as diferenças entre os métodos de *hashing* pré-4.1 e 4.1 e o que você deve fazer se atualizar seu *server*, mas precisar manter a compatibilidade retroativa (*backward compatibility*) com *clients* pré-4.1. (No entanto, permitir conexões por *clients* antigos não é recomendado e deve ser evitado, se possível.) Esta informação é de particular importância para programadores PHP que estão migrando *Databases* MySQL de versões anteriores a 4.1 para 4.1 ou superiores.

As diferenças entre *short* e *long password hashes* são relevantes tanto para como o *server* usa *passwords* durante a autenticação quanto para como ele gera *password hashes* para *clients* conectados que realizam operações de alteração de *password*.

A forma como o *server* usa *password hashes* durante a autenticação é afetada pela largura da coluna `Password`:

* Se a coluna for *short* (curta), apenas a autenticação por *short hash* é usada.

* Se a coluna for *long* (longa), ela pode conter *short* ou *long hashes*, e o *server* pode usar qualquer um dos formatos:

  + *Clients* pré-4.1 podem se conectar, mas como eles conhecem apenas o método de *hashing* pré-4.1, eles só podem se autenticar usando contas que tenham *short hashes*.

  + *Clients* 4.1 e posteriores podem se autenticar usando contas que tenham *short* ou *long hashes*.

  Mesmo para contas com *short hash*, o processo de autenticação é, na verdade, um pouco mais seguro para *clients* 4.1 e posteriores do que para *clients* mais antigos. Em termos de segurança, o gradiente do menos para o mais seguro é:

  * *Client* pré-4.1 autenticando com *short password hash*
  * *Client* 4.1 ou posterior autenticando com *short password hash*
  * *Client* 4.1 ou posterior autenticando com *long password hash*

A forma como o *server* gera *password hashes* para *clients* conectados é afetada pela largura da coluna `Password` e pela *system variable* [`old_passwords`](server-system-variables.html#sysvar_old_passwords). Um *server* 4.1 ou posterior gera *long hashes* apenas se certas condições forem atendidas: A coluna `Password` deve ser larga o suficiente para armazenar valores *long* e [`old_passwords`](server-system-variables.html#sysvar_old_passwords) não deve estar definido como 1.

Essas condições se aplicam da seguinte forma:

* A coluna `Password` deve ser larga o suficiente para conter *long hashes* (41 *bytes*). Se a coluna não tiver sido atualizada e ainda tiver a largura pré-4.1 de 16 *bytes*, o *server* percebe que os *long hashes* não cabem nela e gera apenas *short hashes* quando um *client* realiza operações de alteração de *password* usando a função [`PASSWORD()`](encryption-functions.html#function_password) ou uma *statement* de geração de *password*. Este é o comportamento que ocorre se você tiver feito *upgrade* de uma versão do MySQL mais antiga que 4.1 para 4.1 ou posterior, mas ainda não executou o programa [**mysql_upgrade**](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables") para alargar a coluna `Password`.

* Se a coluna `Password` for larga, ela pode armazenar *short* ou *long password hashes*. Neste caso, a função [`PASSWORD()`](encryption-functions.html#function_password) e as *statements* de geração de *password* geram *long hashes*, a menos que o *server* tenha sido iniciado com a *system variable* [`old_passwords`](server-system-variables.html#sysvar_old_passwords) definida como 1 para forçar o *server* a gerar *short password hashes* em vez disso.

O propósito da *system variable* [`old_passwords`](server-system-variables.html#sysvar_old_passwords) é permitir a compatibilidade retroativa com *clients* pré-4.1 em circunstâncias onde o *server* de outra forma geraria *long password hashes*. A opção não afeta a autenticação (*clients* 4.1 e posteriores ainda podem usar contas que têm *long password hashes*), mas impede a criação de um *long password hash* na tabela `user` como resultado de uma operação de alteração de *password*. Se isso fosse permitido, a conta não poderia mais ser usada por *clients* pré-4.1. Com [`old_passwords`](server-system-variables.html#sysvar_old_passwords) desativado, o seguinte cenário indesejável é possível:

* Um *client* pré-4.1 antigo se conecta a uma conta que tem um *short password hash*.

* O *client* altera sua própria *password*. Com [`old_passwords`](server-system-variables.html#sysvar_old_passwords) desativado, isso resulta na conta passando a ter um *long password hash*.

* Na próxima vez que o *client* antigo tentar se conectar à conta, ele não conseguirá, porque a conta tem um *long password hash* que exige o método de *hashing* 4.1 durante a autenticação. (Uma vez que uma conta tem um *long password hash* na tabela *user*, apenas *clients* 4.1 e posteriores podem se autenticar para ela, pois *clients* pré-4.1 não entendem *long hashes*.)

Este cenário ilustra que, se você precisar dar suporte a *clients* pré-4.1 mais antigos, é problemático executar um *server* 4.1 ou superior sem [`old_passwords`](server-system-variables.html#sysvar_old_passwords) definido como 1. Ao executar o *server* com [`old_passwords=1`](server-system-variables.html#sysvar_old_passwords), as operações de alteração de *password* não geram *long password hashes* e, portanto, não fazem com que as contas se tornem inacessíveis para *clients* mais antigos. (Esses *clients* não podem se bloquear inadvertidamente alterando sua *password* e terminando com um *long password hash*.)

A desvantagem de [`old_passwords=1`](server-system-variables.html#sysvar_old_passwords) é que quaisquer *passwords* criadas ou alteradas usam *short hashes*, mesmo para *clients* 4.1 ou posteriores. Assim, você perde a segurança adicional fornecida pelos *long password hashes*. Para criar uma conta que tenha um *long hash* (por exemplo, para uso por *clients* 4.1) ou para alterar uma conta existente para usar um *long password hash*, um administrador pode definir o valor de sessão de [`old_passwords`](server-system-variables.html#sysvar_old_passwords) como 0, mantendo o valor global definido como 1:

```sql
mysql> SET @@SESSION.old_passwords = 0;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT @@SESSION.old_passwords, @@GLOBAL.old_passwords;
+-------------------------+------------------------+
| @@SESSION.old_passwords | @@GLOBAL.old_passwords |
+-------------------------+------------------------+
|                       0 |                      1 |
+-------------------------+------------------------+
1 row in set (0.00 sec)

mysql> CREATE USER 'newuser'@'localhost' IDENTIFIED BY 'newpass';
Query OK, 0 rows affected (0.03 sec)

mysql> SET PASSWORD FOR 'existinguser'@'localhost' = PASSWORD('existingpass');
Query OK, 0 rows affected (0.00 sec)
```

Os seguintes cenários são possíveis no MySQL 4.1 ou posterior. Os fatores são se a coluna `Password` é *short* ou *long* e, se for *long*, se o *server* é iniciado com [`old_passwords`](server-system-variables.html#sysvar_old_passwords) ativado ou desativado.

**Cenário 1:** Coluna `Password` *short* na tabela *user*:

* Apenas *short hashes* podem ser armazenados na coluna `Password`.

* O *server* usa apenas *short hashes* durante a autenticação do *client*.

* Para *clients* conectados, as operações de geração de *password hash* que envolvem a função [`PASSWORD()`](encryption-functions.html#function_password) ou *statements* de geração de *password* usam *short hashes* exclusivamente. Qualquer alteração na *password* de uma conta resulta nessa conta ter um *short password hash*.

* O valor de [`old_passwords`](server-system-variables.html#sysvar_old_passwords) é irrelevante, pois com uma coluna `Password` *short*, o *server* gera apenas *short password hashes* de qualquer maneira.

Este cenário ocorre quando uma instalação MySQL pré-4.1 foi atualizada para 4.1 ou posterior, mas [**mysql_upgrade**](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables") não foi executado para atualizar as tabelas do sistema no *Database* `mysql`. (Esta não é uma configuração recomendada porque não permite o uso do *password hashing* 4.1 mais seguro.)

**Cenário 2:** Coluna `Password` *long*; *server* iniciado com [`old_passwords=1`](server-system-variables.html#sysvar_old_passwords):

* *Short* ou *long hashes* podem ser armazenados na coluna `Password`.

* *Clients* 4.1 e posteriores podem se autenticar para contas que têm *short* ou *long hashes*.

* *Clients* pré-4.1 podem se autenticar apenas para contas que têm *short hashes*.

* Para *clients* conectados, as operações de geração de *password hash* que envolvem a função [`PASSWORD()`](encryption-functions.html#function_password) ou *statements* de geração de *password* usam *short hashes* exclusivamente. Qualquer alteração na *password* de uma conta resulta nessa conta ter um *short password hash*.

Neste cenário, as contas recém-criadas têm *short password hashes* porque [`old_passwords=1`](server-system-variables.html#sysvar_old_passwords) impede a geração de *long hashes*. Além disso, se você criar uma conta com um *long hash* antes de definir [`old_passwords`](server-system-variables.html#sysvar_old_passwords) como 1, a alteração da *password* da conta enquanto [`old_passwords=1`](server-system-variables.html#sysvar_old_passwords) resulta na conta receber uma *password* *short*, fazendo com que ela perca os benefícios de segurança de um *hash* mais longo.

Para criar uma nova conta que tenha um *long password hash*, ou para alterar a *password* de qualquer conta existente para usar um *long hash*, primeiro defina o valor de sessão de [`old_passwords`](server-system-variables.html#sysvar_old_passwords) como 0, mantendo o valor global definido como 1, conforme descrito anteriormente.

Neste cenário, o *server* tem uma coluna `Password` atualizada, mas está sendo executado com o método de *password hashing* padrão definido para gerar *hash values* pré-4.1. Esta não é uma configuração recomendada, mas pode ser útil durante um período de transição no qual *clients* e *passwords* pré-4.1 são atualizados para 4.1 ou posterior. Quando isso for feito, é preferível executar o *server* com [`old_passwords=0`](server-system-variables.html#sysvar_old_passwords) e [`secure_auth=1`](server-system-variables.html#sysvar_secure_auth).

**Cenário 3:** Coluna `Password` *long*; *server* iniciado com [`old_passwords=0`](server-system-variables.html#sysvar_old_passwords):

* *Short* ou *long hashes* podem ser armazenados na coluna `Password`.

* *Clients* 4.1 e posteriores podem se autenticar usando contas que têm *short* ou *long hashes*.

* *Clients* pré-4.1 podem se autenticar apenas usando contas que têm *short hashes*.

* Para *clients* conectados, as operações de geração de *password hash* que envolvem a função [`PASSWORD()`](encryption-functions.html#function_password) ou *statements* de geração de *password* usam *long hashes* exclusivamente. Uma alteração na *password* de uma conta resulta nessa conta ter um *long password hash*.

Conforme indicado anteriormente, um perigo neste cenário é que é possível que contas que têm um *short password hash* se tornem inacessíveis para *clients* pré-4.1. Uma alteração na *password* de tal conta feita usando a função [`PASSWORD()`](encryption-functions.html#function_password) ou uma *statement* de geração de *password* resulta na conta receber um *long password hash*. A partir desse ponto, nenhum *client* pré-4.1 pode se conectar ao *server* usando essa conta. O *client* deve fazer *upgrade* para 4.1 ou posterior.

Se isso for um problema, você pode alterar uma *password* de uma maneira especial. Por exemplo, normalmente você usa [`SET PASSWORD`](set-password.html "13.7.1.7 SET PASSWORD Statement") da seguinte forma para alterar a *password* de uma conta:

```sql
SET PASSWORD FOR 'some_user'@'some_host' = PASSWORD('password');
```

Para alterar a *password*, mas criar um *short hash*, use a função `OLD_PASSWORD()` em vez disso:

```sql
SET PASSWORD FOR 'some_user'@'some_host' = OLD_PASSWORD('password');
```

`OLD_PASSWORD()` é útil para situações em que você deseja gerar explicitamente um *short hash*.

As desvantagens para cada um dos cenários anteriores podem ser resumidas da seguinte forma:

No cenário 1, você não pode tirar proveito de *hashes* mais longos que fornecem autenticação mais segura.

No cenário 2, [`old_passwords=1`](server-system-variables.html#sysvar_old_passwords) impede que contas com *short hashes* se tornem inacessíveis, mas as operações de alteração de *password* fazem com que contas com *long hashes* revertam para *short hashes*, a menos que você tome cuidado para alterar o valor de sessão de [`old_passwords`](server-system-variables.html#sysvar_old_passwords) para 0 primeiro.

No cenário 3, contas com *short hashes* tornam-se inacessíveis para *clients* pré-4.1 se você alterar suas *passwords* sem usar explicitamente `OLD_PASSWORD()`.

A melhor maneira de evitar problemas de compatibilidade relacionados a *short password hashes* é não usá-los:

* Faça o *upgrade* de todos os programas *client* para MySQL 4.1 ou posterior.
* Execute o *server* com [`old_passwords=0`](server-system-variables.html#sysvar_old_passwords).

* Redefina a *password* para qualquer conta com um *short password hash* para usar um *long password hash*.

* Para segurança adicional, execute o *server* com [`secure_auth=1`](server-system-variables.html#sysvar_secure_auth).