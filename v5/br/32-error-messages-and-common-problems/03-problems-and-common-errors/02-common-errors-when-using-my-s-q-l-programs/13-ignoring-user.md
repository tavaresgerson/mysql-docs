#### B.3.2.13 Ignorando usuário

Se você receber o seguinte erro, significa que quando o **mysqld** foi iniciado ou quando recarregou as *grant tables*, ele encontrou uma conta na tabela `user` que possuía uma senha inválida (*invalid password*).

`Found wrong password for user 'some_user'@'some_host'; ignoring user`

Como resultado, a conta é simplesmente ignorada pelo sistema de permissões.

A lista a seguir indica as possíveis causas e correções para este problema:

* Você pode estar executando uma nova versão do **mysqld** com uma tabela `user` antiga. Verifique se a coluna `Password` dessa tabela tem menos de 16 caracteres. Caso afirmativo, corrija essa condição executando o **mysql_upgrade**.

* A conta possui uma senha antiga (com oito caracteres de comprimento). Atualize a conta na tabela `user` para que tenha uma nova senha.

* Você especificou uma senha na tabela `user` sem usar a função `PASSWORD()`. Use o **mysql** para atualizar a conta na tabela `user` com uma nova senha, certificando-se de usar a função `PASSWORD()`:

  ```sql
  mysql> UPDATE user SET Password=PASSWORD('new_password')
      -> WHERE User='some_user' AND Host='some_host';
  ```