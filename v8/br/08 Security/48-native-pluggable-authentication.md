#### 8.4.1.1 Autenticação Native Plugável

O MySQL inclui um plugin `mysql_native_password` que implementa a autenticação nativa; ou seja, a autenticação baseada no método de hash de senha utilizado antes da introdução da autenticação plugável.

::: info Nota

O plugin de autenticação `mysql_native_password` é desatualizado a partir do MySQL 8.0.34, desabilitado por padrão no MySQL 8.4 e removido a partir do MySQL 9.0.0.

:::

A tabela a seguir mostra os nomes dos plugins no lado do servidor e do cliente.

**Tabela 8.14 Nomes de Plugins e Bibliotecas para Autenticação de Senha Nativa**

<table><thead><tr> <th>Plugin ou Arquivo</th> <th>Nome do Plugin ou Arquivo</th> </tr></thead><tbody><tr> <td>Plugin no lado do servidor</td> <td><code>mysql_native_password</code></td> </tr><tr> <td>Plugin no lado do cliente</td> <td><code>mysql_native_password</code></td> </tr><tr> <td>Arquivo de biblioteca</td> <td>Nenhum (os plugins são construídos internamente)</td> </tr></tbody></table>

As seções a seguir fornecem informações de instalação e uso específicas para a autenticação plugável nativa:

*  Instalando Autenticação Nativa Plugável
*  Usando Autenticação Nativa Plugável
*  Desabilitando Autenticação Nativa Plugável

Para informações gerais sobre autenticação plugável no MySQL, consulte  Seção 8.2.17, “Autenticação Plugável”.

##### Instalando Autenticação Nativa Plugável

O plugin `mysql_native_password` existe em formas de servidor e cliente:

* O plugin no lado do servidor é construído no servidor, mas é desabilitado por padrão. Para ativá-lo, inicie o MySQL Server com `--mysql-native-password=ON` ou incluindo `mysql_native-password=ON` na seção `[mysqld]` do seu arquivo de configuração do MySQL.
* O plugin no lado do cliente é construído na biblioteca de cliente `libmysqlclient` e está disponível para qualquer programa vinculado ao `libmysqlclient`.

Os programas clientes do MySQL no MySQL 8.4 (e versões posteriores) usam `caching_sha2_password` para autenticação por padrão. Use a opção `--default-auth` para definir `mysql_native_password` como o plugin de autenticação do lado do cliente padrão, se isso for o que se deseja, da seguinte forma:

```
$> mysql --default-auth=mysql_native_password ...
```

##### Desativando a Autenticação Pluggable Native

No MySQL 8.4, o plugin `mysql_native_password` do lado do servidor é desativado por padrão. Para mantê-lo desativado, certifique-se de que o servidor seja iniciado sem especificar a opção `--mysql-native-password`. Usar `--mysql-native-password=OFF` também funciona para esse propósito, mas não é necessário. Além disso, não habilite `mysql_native_password` no seu arquivo de configuração do MySQL para mantê-lo desativado.

Quando o plugin é desativado, todas as operações que dependem do plugin ficam inacessíveis. Especificamente:

* Contas de usuário definidas que autenticam com `mysql_native_password` encontram um erro quando tentam se conectar.

  ```
  $> MYSQL -u userx -p
  ERROR 1045 (28000): Access denied for user 'userx'@'localhost' (using password: NO)
  ```

  O servidor escreve esses erros no log do servidor.
* Tentativas de criar uma nova conta de usuário ou alterar uma conta de usuário existente identificada com `mysql_native_password` também falham e emitem um erro.

  ```
  mysql> CREATE USER userxx@localhost IDENTIFIED WITH 'mysql_native_password';
  ERROR 1524 (HY000): Plugin 'mysql_native_password' is not loaded
  mysql> ALTER USER userxy@localhost IDENTIFIED WITH 'mysql_native_password';
  ERROR 1524 (HY000): Plugin 'mysql_native_password' is not loaded
  ```

Para obter instruções sobre como habilitar o plugin, consulte Instalação de Autenticação Pluggable Native.