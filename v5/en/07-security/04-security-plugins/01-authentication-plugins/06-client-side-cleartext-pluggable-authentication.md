#### 6.4.1.6 Autenticação Pluggable Cleartext do Lado do Cliente

Um Plugin de autenticação do lado do cliente está disponível, o qual permite que os clientes enviem senhas para o servidor como cleartext, sem Hashing ou Encryption. Este Plugin é integrado à biblioteca de cliente do MySQL.

A tabela a seguir mostra o nome do Plugin.

**Tabela 6.12 Nomes de Plugin e Biblioteca para Autenticação Cleartext**

<table summary="Nomes para os Plugins e o arquivo de biblioteca usados para autenticação de senha cleartext."><thead><tr> <th>Plugin ou Arquivo</th> <th>Nome do Plugin ou Arquivo</th> </tr></thead><tbody><tr> <td>Plugin do lado do Servidor</td> <td>Nenhum, veja a discussão</td> </tr><tr> <td>Plugin do lado do Cliente</td> <td><code>mysql_clear_password</code></td> </tr><tr> <td>Arquivo de Biblioteca</td> <td>Nenhum (o Plugin é integrado)</td> </tr></tbody></table>

Muitos Plugins de autenticação do lado do cliente realizam Hashing ou Encryption de uma senha antes que o cliente a envie para o servidor. Isso permite que os clientes evitem o envio de senhas como cleartext.

Hashing ou Encryption não podem ser feitos para esquemas de autenticação que exigem que o servidor receba a senha conforme digitada no lado do cliente. Nesses casos, o Plugin `mysql_clear_password` do lado do cliente é usado, o qual permite que o cliente envie a senha para o servidor como cleartext. Não há um Plugin correspondente do lado do servidor. Em vez disso, `mysql_clear_password` pode ser usado no lado do cliente em conjunto com qualquer Plugin do lado do servidor que necessite de uma senha cleartext. (Exemplos são os Plugins de autenticação PAM e LDAP simples; consulte [Section 6.4.1.7, “PAM Pluggable Authentication”](pam-pluggable-authentication.html "6.4.1.7 PAM Pluggable Authentication"), e [Section 6.4.1.9, “LDAP Pluggable Authentication”](ldap-pluggable-authentication.html "6.4.1.9 LDAP Pluggable Authentication").)

A discussão a seguir fornece informações de uso específicas para a autenticação pluggable cleartext. Para obter informações gerais sobre autenticação pluggable no MySQL, consulte [Section 6.2.13, “Pluggable Authentication”](pluggable-authentication.html "6.2.13 Pluggable Authentication").

Nota

O envio de senhas como cleartext pode ser um problema de segurança em algumas configurações. Para evitar problemas caso haja alguma possibilidade de a senha ser interceptada, os clientes devem se conectar ao MySQL Server usando um método que proteja a senha. As possibilidades incluem SSL (consulte [Section 6.3, “Using Encrypted Connections”](encrypted-connections.html "6.3 Using Encrypted Connections")), IPsec, ou uma rede privada.

Para tornar o uso inadvertido do Plugin `mysql_clear_password` menos provável, os clientes MySQL devem habilitá-lo explicitamente. Isso pode ser feito de várias maneiras:

* Defina a Environment Variable `LIBMYSQL_ENABLE_CLEARTEXT_PLUGIN` para um valor que comece com `1`, `Y`, ou `y`. Isso habilita o Plugin para todas as conexões de cliente.

* Os programas de cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"), [**mysqladmin**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program"), e [**mysqlslap**](mysqlslap.html "4.5.8 mysqlslap — A Load Emulation Client") (também [**mysqlcheck**](mysqlcheck.html "4.5.3 mysqlcheck — A Table Maintenance Program"), [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program"), e [**mysqlshow**](mysqlshow.html "4.5.7 mysqlshow — Display Database, Table, and Column Information") para MySQL 5.7.10 e posterior) suportam uma opção `--enable-cleartext-plugin` que habilita o Plugin em uma base por invocação.

* A função C API [`mysql_options()`](/doc/c-api/5.7/en/mysql-options.html) suporta uma opção `MYSQL_ENABLE_CLEARTEXT_PLUGIN` que habilita o Plugin em uma base por conexão. Além disso, qualquer programa que use `libmysqlclient` e leia arquivos de opção pode habilitar o Plugin incluindo uma opção `enable-cleartext-plugin` em um grupo de opções lido pela biblioteca de cliente.