#### B.3.2.5 Muitas conexões

Se os clientes encontrarem erros de "Existem muitas conexões" ao tentarem se conectar ao servidor [**mysqld**](mysqld.html), todas as conexões disponíveis estão sendo usadas por outros clientes.

O número permitido de conexões é controlado pela variável de sistema [`max_connections`](server-system-variables.html#sysvar_max_connections). Para suportar mais conexões, defina [`max_connections`](server-system-variables.html#sysvar_max_connections) para um valor maior.

[**mysqld**](mysqld.html) permite, na verdade, [`max_connections`](server-system-variables.html#sysvar_max_connections)

- 1 conexão de cliente. A conexão extra é reservada para uso por contas que possuem o privilégio [`SUPER`](privilegios-fornecidos.html#priv_super). Ao conceder o privilégio aos administradores e não aos usuários normais (que não deveriam precisar dele), um administrador que também possui o privilégio [`PROCESS`](privilegios-fornecidos.html#priv_process) pode se conectar ao servidor e usar [`SHOW PROCESSLIST`](show-processlist.html) para diagnosticar problemas, mesmo que o número máximo de clientes não privilegiados esteja conectado. Veja [Seção 13.7.5.29, “Instrução SHOW PROCESSLIST”](show-processlist.html).

Para obter mais informações sobre como o servidor lida com as conexões do cliente, consulte [Seção 5.1.11.1, “Interfaces de Conexão”](connection-interfaces.html).
