#### B.3.2.13 Ignorar o usuário

Se você receber o seguinte erro, isso significa que, quando o **mysqld** foi iniciado ou quando ele recarregou as tabelas de concessão, ele encontrou uma conta na tabela `user` que tinha uma senha inválida.

`Found wrong password for user 'some_user'@'some_host'; ignoring user`

Como resultado, a conta é simplesmente ignorada pelo sistema de permissões. Para corrigir esse problema, atribua uma nova senha válida à conta.
