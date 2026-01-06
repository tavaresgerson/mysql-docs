### 8.15.6 Verificação de privilégios

Em cenários complexos em que a consulta utiliza vistas SQL SECURITY DEFINER ou rotinas armazenadas, pode acontecer de um usuário ser negado a ver o registro da sua consulta porque não possui alguns privilégios extras nesses objetos. Nesse caso, o registro será exibido como vazio e a coluna INSUFFICIENT\_PRIVILEGES mostrará "1".
