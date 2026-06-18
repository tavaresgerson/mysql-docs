#### 8.4.1.4 Autenticação de texto em claro plugável no lado do cliente

Um plugin de autenticação no lado do cliente está disponível, que permite que os clientes enviem senhas para o servidor como texto simples, sem hashing ou criptografia. Esse plugin está integrado à biblioteca de clientes MySQL.

A tabela a seguir mostra o nome do plugin.

**Tabela 8.19 Nomes de plugins e bibliotecas para autenticação em texto claro**

<table summary="Nomes para os plugins e o arquivo de biblioteca usados para autenticação de senha em texto claro."><thead><tr> <th>Plugin ou arquivo</th> <th>Nome do Plugin ou do Arquivo</th> </tr></thead><tbody><tr> <td>Plugin no lado do servidor</td> <td>Nenhum, veja a discussão</td> </tr><tr> <td>Plugin no lado do cliente</td> <td>[[<code>mysql_clear_password</code>]]</td> </tr><tr> <td>Arquivo da biblioteca</td> <td>Nenhum (o plugin está embutido)</td> </tr></tbody></table>

Muitos plugins de autenticação no lado do cliente realizam a hash ou criptografia de uma senha antes que o cliente a envie para o servidor. Isso permite que os clientes evitem enviar senhas em texto claro.

A hashing ou criptografia não pode ser realizada para esquemas de autenticação que exigem que o servidor receba a senha conforme digitada no lado do cliente. Nesses casos, o plugin `mysql_clear_password` do lado do cliente é usado, que permite que o cliente envie a senha para o servidor como texto claro. Não há um plugin correspondente do lado do servidor. Em vez disso, o `mysql_clear_password` pode ser usado do lado do cliente em conjunto com qualquer plugin do lado do servidor que precise de uma senha em texto claro. (Exemplos são os plugins de autenticação PAM e LDAP simples; veja a Seção 8.4.1.5, “Autenticação Conectada a PAM” e a Seção 8.4.1.7, “Autenticação Conectada a LDAP”).

A discussão a seguir fornece informações de uso específicas para autenticação plugável em texto claro. Para informações gerais sobre autenticação plugável no MySQL, consulte a Seção 8.2.17, “Autenticação Plugável”.

Nota

Enviar senhas em texto claro pode ser um problema de segurança em algumas configurações. Para evitar problemas se houver a possibilidade de a senha ser interceptada, os clientes devem se conectar ao MySQL Server usando um método que proteja a senha. As possibilidades incluem SSL (consulte a Seção 8.3, “Usando Conexões Encriptadas”), IPsec ou uma rede privada.

Para tornar menos provável o uso acidental do plugin `mysql_clear_password`, os clientes do MySQL devem habilitá-lo explicitamente. Isso pode ser feito de várias maneiras:

- Defina a variável de ambiente `LIBMYSQL_ENABLE_CLEARTEXT_PLUGIN` para um valor que comece com `1`, `Y` ou `y`. Isso habilita o plugin para todas as conexões do cliente.

- Os programas clientes **mysql**, **mysqladmin**, **mysqlcheck**, **mysqldump**, **mysqlshow** e **mysqlslap** suportam a opção `--enable-cleartext-plugin`, que habilita o plugin por solicitação.

- A função API `mysql_options()` C suporta uma opção `MYSQL_ENABLE_CLEARTEXT_PLUGIN` que habilita o plugin em uma base por conexão. Além disso, qualquer programa que use `libmysqlclient` e leia arquivos de opções pode habilitar o plugin incluindo uma opção `enable-cleartext-plugin` em um grupo de opções lido pela biblioteca do cliente.
