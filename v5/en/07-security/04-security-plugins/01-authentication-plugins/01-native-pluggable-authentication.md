#### 6.4.1.1 Autenticação Pluggable Nativa

O MySQL inclui dois plugins que implementam a autenticação nativa; isto é, autenticação baseada nos métodos de password hashing em uso antes da introdução da autenticação pluggable. Esta seção descreve `mysql_native_password`, que implementa a autenticação contra a tabela de sistema `mysql.user` usando o método de password hashing nativo. Para obter informações sobre `mysql_old_password`, que implementa a autenticação usando o método de password hashing nativo mais antigo (pré-4.1), consulte [Section 6.4.1.2, “Old Native Pluggable Authentication”](old-native-pluggable-authentication.html "6.4.1.2 Old Native Pluggable Authentication"). Para obter informações sobre esses métodos de password hashing, consulte [Section 6.1.2.4, “Password Hashing in MySQL”](password-hashing.html "6.1.2.4 Password Hashing in MySQL").

A tabela a seguir mostra os nomes dos plugins nos lados do Server e do Client.

**Tabela 6.8 Nomes de Plugins e Bibliotecas para Autenticação de Password Nativa**

<table summary="Nomes para os plugins e o arquivo de biblioteca usados para autenticação de password nativa."><thead><tr> <th>Plugin ou Arquivo</th> <th>Nome do Plugin ou Arquivo</th> </tr></thead><tbody><tr> <td>Plugin do lado do Server</td> <td><code>mysql_native_password</code></td> </tr><tr> <td>Plugin do lado do Client</td> <td><code>mysql_native_password</code></td> </tr><tr> <td>Arquivo de biblioteca</td> <td>Nenhum (os plugins são integrados)</td> </tr></tbody></table>

As seções a seguir fornecem informações de instalação e uso específicas para a autenticação pluggable nativa:

* [Instalando a Autenticação Pluggable Nativa](native-pluggable-authentication.html#native-pluggable-authentication-installation "Instalando a Autenticação Pluggable Nativa")
* [Usando a Autenticação Pluggable Nativa](native-pluggable-authentication.html#native-pluggable-authentication-usage "Usando a Autenticação Pluggable Nativa")

Para informações gerais sobre autenticação pluggable no MySQL, consulte [Section 6.2.13, “Pluggable Authentication”](pluggable-authentication.html "6.2.13 Pluggable Authentication").

##### Instalando a Autenticação Pluggable Nativa

O plugin `mysql_native_password` existe nas formas Server e Client:

* O plugin do lado do Server é integrado ao Server, não precisa ser carregado explicitamente e não pode ser desabilitado pelo seu descarregamento.

* O plugin do lado do Client é integrado à biblioteca Client `libmysqlclient` e está disponível para qualquer programa lincado contra `libmysqlclient`.

##### Usando a Autenticação Pluggable Nativa

Programas Client do MySQL usam `mysql_native_password` por padrão. A opção [`--default-auth`](mysql-command-options.html#option_mysql_default-auth) pode ser usada como uma dica sobre qual plugin do lado do Client o programa pode esperar usar:

```sql
$> mysql --default-auth=mysql_native_password ...
```