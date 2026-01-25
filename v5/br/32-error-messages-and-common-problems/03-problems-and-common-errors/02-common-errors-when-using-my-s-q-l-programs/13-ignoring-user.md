#### B.3.2.13 Ignorando usuário

Se você receber o seguinte erro, significa que quando o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") foi iniciado ou quando recarregou as *grant tables*, ele encontrou uma conta na tabela `user` que possuía uma senha inválida (*invalid password*).

`Found wrong password for user 'some_user'@'some_host'; ignoring user`

Como resultado, a conta é simplesmente ignorada pelo sistema de permissões.

A lista a seguir indica as possíveis causas e correções para este problema:

* Você pode estar executando uma nova versão do [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") com uma tabela `user` antiga. Verifique se a coluna `Password` dessa tabela tem menos de 16 caracteres. Caso afirmativo, corrija essa condição executando o [**mysql_upgrade**](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables").

* A conta possui uma senha antiga (com oito caracteres de comprimento). Atualize a conta na tabela `user` para que tenha uma nova senha.

* Você especificou uma senha na tabela `user` sem usar a função [`PASSWORD()`](encryption-functions.html#function_password). Use o [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") para atualizar a conta na tabela `user` com uma nova senha, certificando-se de usar a função [`PASSWORD()`](encryption-functions.html#function_password):

  ```sql
  mysql> UPDATE user SET Password=PASSWORD('new_password')
      -> WHERE User='some_user' AND Host='some_host';
  ```