### 10.15.6 Verificação de privilégios

Em cenários complexos em que a consulta utiliza vistas SQL SECURITY DEFINER ou rotinas armazenadas, pode ocorrer que um usuário seja negado de ver o registro da sua consulta porque não possui alguns privilégios extras nesses objetos. Nesse caso, o registro será exibido como vazio e a coluna INSUFFICIENT_PRIVILEGES mostrará "1".