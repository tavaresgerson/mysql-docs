#### B.3.2.13 Ignorar o usuário

Se você receber o seguinte erro, significa que, quando o `mysqld` foi iniciado ou quando ele recarregou as tabelas de concessão, ele encontrou uma conta na tabela `user` que tinha uma senha inválida.

`Encontrou senha errada para o usuário 'some_user'@'some_host'; ignorando o usuário`

Como resultado, a conta é simplesmente ignorada pelo sistema de permissão. Para corrigir esse problema, atribua uma nova senha válida à conta.