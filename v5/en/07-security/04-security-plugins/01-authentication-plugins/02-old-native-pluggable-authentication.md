#### 6.4.1.2 Autenticação Plugável Nativa Antiga

O MySQL inclui dois **plugins** que implementam **authentication** nativa; isto é, **authentication** baseada nos **password hashing methods** em uso antes da introdução da **pluggable authentication**. Esta seção descreve `mysql_old_password`, que implementa **authentication** contra a tabela de sistema `mysql.user` usando o **password hashing method** nativo mais antigo (pré-4.1). Para informações sobre `mysql_native_password`, que implementa **authentication** usando o **password hashing method** nativo, consulte [Seção 6.4.1.1, “Native Pluggable Authentication”](native-pluggable-authentication.html "6.4.1.1 Native Pluggable Authentication"). Para informações sobre esses **password hashing methods**, consulte [Seção 6.1.2.4, “Password Hashing in MySQL”](password-hashing.html "6.1.2.4 Password Hashing in MySQL").

Nota

Senhas que utilizam o **hashing method** pré-4.1 são menos seguras do que senhas que utilizam o **password hashing method** nativo e devem ser evitadas. As senhas pré-4.1 estão obsoletas (**deprecated**) e o suporte a elas (incluindo o **plugin** `mysql_old_password`) foi removido no MySQL 5.7.5. Para instruções de **upgrade** de contas, consulte [Seção 6.4.1.3, “Migrating Away from Pre-4.1 Password Hashing and the mysql_old_password Plugin”](account-upgrades.html "6.4.1.3 Migrating Away from Pre-4.1 Password Hashing and the mysql_old_password Plugin").

A tabela a seguir mostra os nomes dos **plugins** nos lados do **server** e do **client**.

**Tabela 6.9 Nomes de Plugin e Library para Autenticação Nativa de Senha Antiga**

<table summary="Nomes para os plugins e o arquivo de library usados para autenticação nativa de senha antiga."><thead><tr> <th>Plugin ou Arquivo</th> <th>Nome do Plugin ou Arquivo</th> </tr></thead><tbody><tr> <td>Plugin do lado do Server</td> <td><code>mysql_old_password</code></td> </tr><tr> <td>Plugin do lado do Client</td> <td><code>mysql_old_password</code></td> </tr><tr> <td>Arquivo de Library</td> <td>Nenhum (plugins são embutidos)</td> </tr> </tbody></table>

As seções a seguir fornecem informações de instalação e uso específicas para a **old native pluggable authentication**:

* [Instalando a Old Native Pluggable Authentication](old-native-pluggable-authentication.html#old-native-pluggable-authentication-installation "Instalando a Old Native Pluggable Authentication")
* [Usando a Old Native Pluggable Authentication](old-native-pluggable-authentication.html#old-native-pluggable-authentication-usage "Usando a Old Native Pluggable Authentication")

Para informações gerais sobre **pluggable authentication** no MySQL, consulte [Seção 6.2.13, “Pluggable Authentication”](pluggable-authentication.html "6.2.13 Pluggable Authentication").

##### Instalando a Old Native Pluggable Authentication

O **plugin** `mysql_old_password` existe nas formas de **server** e **client**:

* O **plugin server-side** é embutido no **server**, não precisa ser carregado explicitamente e não pode ser desabilitado por descarregamento.

* O **plugin client-side** é embutido na **client library** `libmysqlclient` e está disponível para qualquer programa linkado contra `libmysqlclient`.

##### Usando a Old Native Pluggable Authentication

Os programas **client** do MySQL podem usar a opção [`--default-auth`](mysql-command-options.html#option_mysql_default-auth) para especificar o **plugin** `mysql_old_password` como uma dica sobre qual **plugin client-side** o programa pode esperar usar:

```sql
$> mysql --default-auth=mysql_old_password ...
```
