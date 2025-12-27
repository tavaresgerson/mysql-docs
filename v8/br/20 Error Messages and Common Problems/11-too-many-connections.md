#### B.3.2.5 Conexões em excesso

Se os clientes encontrarem erros de "Conexões em excesso" ao tentarem se conectar ao servidor `mysqld`, todas as conexões disponíveis estão sendo usadas por outros clientes.

O número permitido de conexões é controlado pela variável de sistema `max_connections`. Para suportar mais conexões, defina `max_connections` para um valor maior.

O `mysqld` permite, na verdade, `max_connections`
+ 1 conexão de cliente. A conexão extra é reservada para uso por contas que têm o privilégio `CONNECTION_ADMIN` (ou o privilégio desatualizado `SUPER`). Ao conceder o privilégio aos administradores e não aos usuários normais (que não deveriam precisar dele), um administrador pode se conectar ao servidor e usar `SHOW PROCESSLIST` para diagnosticar problemas, mesmo que o número máximo de clientes não privilegiados estejam conectados. Veja a Seção 15.7.7.31, “Instrução SHOW PROCESSLIST”.

O servidor também permite conexões administrativas em uma interface dedicada. Para obter mais informações sobre como o servidor lida com as conexões dos clientes, consulte a Seção 7.1.12.1, “Interfaces de Conexão”.