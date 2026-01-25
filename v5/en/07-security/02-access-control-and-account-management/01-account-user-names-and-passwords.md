### 6.2.1 Nomes de Usuários e Senhas de Contas

O MySQL armazena contas na tabela `user` do `mysql` system Database. Uma conta é definida em termos de um nome de usuário e o host ou hosts cliente a partir dos quais o usuário pode se conectar ao server. Para informações sobre a representação de contas na tabela `user`, veja [Section 6.2.3, “Grant Tables”](grant-tables.html "6.2.3 Grant Tables").

Uma conta também pode ter credenciais de autenticação, como uma password. As credenciais são tratadas pelo authentication Plugin da conta. O MySQL suporta múltiplos authentication Plugins. Alguns deles usam métodos de autenticação integrados, enquanto outros habilitam a autenticação usando métodos de autenticação externos. Veja [Section 6.2.13, “Pluggable Authentication”](pluggable-authentication.html "6.2.13 Pluggable Authentication").

Existem várias distinções entre a maneira como nomes de usuário e passwords são utilizados pelo MySQL e pelo seu sistema operacional:

* Nomes de usuário, conforme usados pelo MySQL para fins de autenticação, não têm relação alguma com nomes de usuário (nomes de login) usados pelo Windows ou Unix. No Unix, a maioria dos clientes MySQL, por padrão, tenta fazer login usando o nome de usuário Unix atual como nome de usuário MySQL, mas isso é apenas por conveniência. O padrão pode ser facilmente substituído, pois os programas cliente permitem que qualquer nome de usuário seja especificado com uma opção `-u` ou `--user`. Isso significa que qualquer pessoa pode tentar se conectar ao server usando qualquer nome de usuário, então você não pode proteger um Database de forma alguma, a menos que todas as contas MySQL tenham passwords. Qualquer pessoa que especifique um nome de usuário para uma conta que não possui password pode se conectar com sucesso ao server.

* Nomes de usuário MySQL têm até 32 caracteres de comprimento. Os nomes de usuário do sistema operacional podem ter um comprimento máximo diferente.

  Advertência

  O limite de comprimento do nome de usuário MySQL é codificado ("hardcoded") nos servers e clientes MySQL, e tentar contorná-lo modificando as definições das tabelas no `mysql` Database *não funciona*.

  Você nunca deve alterar a estrutura das tabelas no `mysql` Database de forma alguma, exceto por meio do procedimento descrito em [Section 2.10, “Upgrading MySQL”](upgrading.html "2.10 Upgrading MySQL"). Tentar redefinir as tabelas do sistema MySQL de qualquer outra forma resulta em comportamento indefinido e não suportado. O server está livre para ignorar linhas que se tornem malformadas como resultado de tais modificações.

* Para autenticar conexões de clientes para contas que usam métodos de autenticação integrados, o server usa passwords armazenadas na tabela `user`. Essas passwords são distintas das passwords usadas para fazer login no seu sistema operacional. Não há conexão necessária entre a password "externa" que você usa para fazer login em uma máquina Windows ou Unix e a password que você usa para acessar o MySQL server nessa máquina.

  Se o server autenticar um cliente usando algum outro Plugin, o método de autenticação que o Plugin implementa pode ou não usar uma password armazenada na tabela `user`. Neste caso, é possível que uma password externa também seja usada para autenticar no MySQL server.

* Passwords armazenadas na tabela `user` são criptografadas usando algoritmos específicos do Plugin. Para informações sobre o hashing nativo de password do MySQL, veja [Section 6.1.2.4, “Password Hashing in MySQL”](password-hashing.html "6.1.2.4 Password Hashing in MySQL").

* Se o nome de usuário e a password contiverem apenas caracteres ASCII, é possível conectar-se ao server independentemente das configurações de conjunto de caracteres. Para habilitar conexões quando o nome de usuário ou a password contiverem caracteres não-ASCII, as aplicações cliente devem chamar a função [`mysql_options()`](/doc/c-api/5.7/en/mysql-options.html) da C API com a opção `MYSQL_SET_CHARSET_NAME` e o nome do conjunto de caracteres apropriado como argumentos. Isso faz com que a autenticação ocorra usando o conjunto de caracteres especificado. Caso contrário, a autenticação falha, a menos que o conjunto de caracteres padrão do server seja o mesmo que a codificação nos padrões de autenticação.

  Programas cliente MySQL padrão suportam a opção `--default-character-set`, que faz com que [`mysql_options()`](/doc/c-api/5.7/en/mysql-options.html) seja chamado conforme descrito. Além disso, a autodeteção de conjunto de caracteres é suportada conforme descrito em [Section 10.4, “Connection Character Sets and Collations”](charset-connection.html "10.4 Connection Character Sets and Collations"). Para programas que usam um Connector que não é baseado na C API, o Connector pode fornecer um equivalente a [`mysql_options()`](/doc/c-api/5.7/en/mysql-options.html) que pode ser usado em seu lugar. Verifique a documentação do Connector.

  As notas precedentes não se aplicam a `ucs2`, `utf16` e `utf32`, que não são permitidos como conjuntos de caracteres cliente.

O processo de instalação do MySQL preenche as grant tables com uma conta `root` inicial, conforme descrito em [Section 2.9.4, “Securing the Initial MySQL Account”](default-privileges.html "2.9.4 Securing the Initial MySQL Account"), que também discute como atribuir uma password a ela. Depois disso, você normalmente configura, modifica e remove contas MySQL usando comandos como [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement"), [`DROP USER`](drop-user.html "13.7.1.3 DROP USER Statement"), [`GRANT`](grant.html "13.7.1.4 GRANT Statement") e [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement"). Veja [Section 6.2.7, “Adding Accounts, Assigning Privileges, and Dropping Accounts”](creating-accounts.html "6.2.7 Adding Accounts, Assigning Privileges, and Dropping Accounts") e [Section 13.7.1, “Account Management Statements”](account-management-statements.html "13.7.1 Account Management Statements").

Para se conectar a um MySQL server com um client de linha de comando, especifique as opções de nome de usuário e password conforme necessário para a conta que você deseja usar:

```sql
$> mysql --user=finley --password db_name
```

Se você preferir opções curtas, o comando se parece com isto:

```sql
$> mysql -u finley -p db_name
```

Se você omitir o valor da password após a opção [`--password`](connection-options.html#option_general_password) ou `-p` na linha de comando (como mostrado acima), o client solicitará uma. Alternativamente, a password pode ser especificada na linha de comando:

```sql
$> mysql --user=finley --password=password db_name
$> mysql -u finley -ppassword db_name
```

Se você usar a opção `-p`, *não* deve haver *espaço* entre `-p` e o valor da password subsequente.

Especificar uma password na linha de comando deve ser considerado inseguro. Veja [Section 6.1.2.1, “End-User Guidelines for Password Security”](password-security-user.html "6.1.2.1 End-User Guidelines for Password Security"). Para evitar fornecer a password na linha de comando, use um option file ou um login path file. Veja [Section 4.2.2.2, “Using Option Files”](option-files.html "4.2.2.2 Using Option Files") e [Section 4.6.6, “mysql_config_editor — MySQL Configuration Utility”](mysql-config-editor.html "4.6.6 mysql_config_editor — MySQL Configuration Utility").

Para informações adicionais sobre como especificar nomes de usuário, passwords e outros parâmetros de conexão, veja [Section 4.2.4, “Connecting to the MySQL Server Using Command Options”](connecting.html "4.2.4 Connecting to the MySQL Server Using Command Options").