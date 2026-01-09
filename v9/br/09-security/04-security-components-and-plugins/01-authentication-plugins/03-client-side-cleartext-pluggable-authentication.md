#### 8.4.1.3 Autenticação de Texto Claro no Lado do Cliente

Está disponível um plugin de autenticação no lado do cliente que permite que os clientes enviem senhas para o servidor como texto claro, sem hashing ou criptografia. Este plugin está integrado à biblioteca do cliente MySQL.

A tabela a seguir mostra o nome do plugin.

**Tabela 8.16 Nomes de Plugins e Bibliotecas para Autenticação de Texto Claro**

<table summary="Nomes dos plugins e arquivos da biblioteca usados para autenticação de senhas em texto claro."><thead><tr> <th>Plugin ou Arquivo</th> <th>Nome do Plugin ou Arquivo</th> </tr></thead><tbody><tr> <td>Plugin no lado do servidor</td> <td>Nenhum, veja a discussão</td> </tr><tr> <td>Plugin no lado do cliente</td> <td><code class="literal">mysql_clear_password</code></td> </tr><tr> <td>Arquivo da biblioteca</td> <td>Nenhum (o plugin é embutido)</td> </tr></tbody></table>

Muitos plugins de autenticação no lado do cliente realizam hashing ou criptografia de uma senha antes que o cliente a envie para o servidor. Isso permite que os clientes evitem enviar senhas como texto claro.

O hashing ou criptografia não pode ser feito para esquemas de autenticação que exigem que o servidor receba a senha conforme inserida no lado do cliente. Nesses casos, o plugin `mysql_clear_password` no lado do cliente é usado, que permite que o cliente envie a senha para o servidor como texto claro. Não há um plugin correspondente no lado do servidor. Em vez disso, o `mysql_clear_password` pode ser usado no lado do cliente em conjunto com qualquer plugin no lado do servidor que precise de uma senha em texto claro. (Exemplos são os plugins de autenticação PAM e LDAP simples; veja a Seção 8.4.1.4, “Autenticação de Texto Claro Pluggable”, e a Seção 8.4.1.6, “Autenticação LDAP Pluggable”.)

A discussão a seguir fornece informações de uso específicas para a autenticação plugável em texto claro. Para informações gerais sobre autenticação plugável no MySQL, consulte a Seção 8.2.17, “Autenticação Plugável”.

Observação

Enviar senhas em texto claro pode ser um problema de segurança em algumas configurações. Para evitar problemas se houver a possibilidade de a senha ser interceptada, os clientes devem se conectar ao MySQL Server usando um método que proteja a senha. As possibilidades incluem SSL (consulte a Seção 8.3, “Usando Conexões Encriptadas”), IPsec ou uma rede privada.

Para tornar menos provável o uso acidental do plugin `mysql_clear_password`, os clientes MySQL devem habilitá-lo explicitamente. Isso pode ser feito de várias maneiras:

* Defina a variável de ambiente `LIBMYSQL_ENABLE_CLEARTEXT_PLUGIN` para um valor que comece com `1`, `Y` ou `y`. Isso habilita o plugin para todas as conexões do cliente.

* Os programas de cliente **mysql**, **mysqladmin**, **mysqlcheck**, **mysqldump**, **mysqlshow** e **mysqlslap** suportam a opção `--enable-cleartext-plugin` que habilita o plugin por solicitação.

* A função C `mysql_options()` suporta a opção `MYSQL_ENABLE_CLEARTEXT_PLUGIN` que habilita o plugin por solicitação. Além disso, qualquer programa que use `libmysqlclient` e leia arquivos de opção pode habilitar o plugin incluindo uma opção `enable-cleartext-plugin` em um grupo de opções lido pela biblioteca do cliente.