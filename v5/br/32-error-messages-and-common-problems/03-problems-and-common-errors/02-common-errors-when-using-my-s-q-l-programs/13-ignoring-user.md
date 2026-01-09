#### B.3.2.13 Ignorar o usuário

Se você receber o seguinte erro, isso significa que, quando o [**mysqld**](mysqld.html) foi iniciado ou quando ele recarregou as tabelas de concessão, ele encontrou uma conta na tabela `user` com uma senha inválida.

`Senha incorreta encontrada para o usuário 'some_user'@'some_host'; ignorando o usuário`

Como resultado, a conta é simplesmente ignorada pelo sistema de permissões.

A lista a seguir indica as possíveis causas e as soluções para esse problema:

- Você pode estar executando uma nova versão do [**mysqld**](mysqld.html) com uma tabela `user` antiga. Verifique se a coluna `Password` dessa tabela tem menos de 16 caracteres. Se sim, corrija essa condição executando [**mysql\_upgrade**](mysql-upgrade.html).

- A conta tem uma senha antiga (com oito caracteres). Atualize a conta na tabela `user` para ter uma nova senha.

- Você especificou uma senha na tabela `user` sem usar a função [`PASSWORD()`](encryption-functions.html#function_password). Use [**mysql**](mysql.html) para atualizar a conta na tabela `user` com uma nova senha, garantindo que você use a função [`PASSWORD()`](encryption-functions.html#function_password):

  ```sql
  mysql> UPDATE user SET Password=PASSWORD('new_password')
      -> WHERE User='some_user' AND Host='some_host';
  ```
