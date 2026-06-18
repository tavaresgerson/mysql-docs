#### B.3.2.5 Too many connections

Se os clientes encontrarem erros de `Too many connections` ao tentar se conectar ao servidor **mysqld**, significa que todas as conexões disponíveis estão em uso por outros clientes.

O número permitido de conexões é controlado pela variável de sistema `max_connections`. Para suportar mais conexões, defina `max_connections` para um valor maior.

Na verdade, o **mysqld** permite `max_connections` + 1 conexões de cliente. A conexão extra é reservada para uso por contas que possuem o privilégio `SUPER`. Ao conceder o privilégio a administradores e não a usuários normais (que não deveriam precisar dele), um administrador que também possua o privilégio `PROCESS` pode se conectar ao servidor e usar `SHOW PROCESSLIST` para diagnosticar problemas, mesmo que o número máximo de clientes não privilegiados esteja conectado. Consulte Seção 13.7.5.29, “SHOW PROCESSLIST Statement”.

Para mais informações sobre como o servidor lida com conexões de cliente, consulte Seção 5.1.11.1, “Connection Interfaces”.