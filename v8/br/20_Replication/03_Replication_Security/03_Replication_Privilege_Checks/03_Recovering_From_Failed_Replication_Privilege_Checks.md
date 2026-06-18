#### 19.3.3.3 Recuperação após verificações de privilégios de replicação falhas

Se uma verificação de privilégio contra a conta `PRIVILEGE_CHECKS_USER` falhar, a transação não é executada e a replicação é interrompida para o canal. Os detalhes do erro e da última transação aplicada são registrados na tabela do Schema de Desempenho `replication_applier_status_by_worker`. Siga este procedimento para recuperar do erro:

1. Identifique o evento replicado que causou o erro e verifique se o evento é esperado ou não e se vem de uma fonte confiável. Você pode usar o **mysqlbinlog** para recuperar e exibir os eventos que foram registrados na época do erro. Para obter instruções sobre como fazer isso, consulte a Seção 9.5, “Recuperação Ponto no Tempo (Incremental)”).

2. Se o evento replicado não for esperado ou não vier de uma fonte conhecida e confiável, investigue a causa. Se você puder identificar por que o evento ocorreu e não houver considerações de segurança, prossiga para corrigir o erro conforme descrito abaixo.

3. Se a conta `PRIVILEGE_CHECKS_USER` deveria ter sido permitida para executar a transação, mas foi mal configurada, conceda os privilégios ausentes à conta, use uma declaração `FLUSH PRIVILEGES` ou execute um comando **mysqladmin flush-privileges** ou **mysqladmin reload** para recarregar as tabelas de concessão, e, em seguida, reinicie a replicação para o canal.

4. Se a transação precisar ser executada e você tiver verificado que ela é confiável, mas a conta `PRIVILEGE_CHECKS_USER` não deveria ter esse privilégio normalmente, você pode conceder o privilégio necessário à conta `PRIVILEGE_CHECKS_USER` temporariamente. Após a aplicação do evento replicado, remova o privilégio da conta e tome as medidas necessárias para garantir que o evento não ocorra novamente, se for evitável.

5. Se a transação for uma ação administrativa que só deveria ter ocorrido na fonte e não na replica, ou só deveria ter ocorrido em um único membro do grupo de replicação, ignore a transação no(s) servidor(es) onde ela parou a replicação, em seguida, emita `START REPLICA` para reiniciar a replicação no canal. Para evitar essa situação no futuro, você pode emitir tais declarações administrativas com `SET sql_log_bin = 0` antes delas e `SET sql_log_bin = 1` depois delas, para que elas não sejam registradas na fonte.

6. Se a transação for uma instrução DDL ou DML que não deveria ter ocorrido no banco de origem ou na réplica, ignore a transação no(s) servidor(es) onde ela parou a replicação, desfaça a transação manualmente no servidor onde ela ocorreu originalmente e, em seguida, emita `START REPLICA` para reiniciar a replicação.

Para pular uma transação, se os GTIDs estiverem em uso, commit uma transação vazia que tenha o GTID da transação que falhou, por exemplo:

```
SET GTID_NEXT='aaa-bbb-ccc-ddd:N';
BEGIN;
COMMIT;
SET GTID_NEXT='AUTOMATIC';
```

Se os GTIDs não estiverem em uso, emita uma declaração `SET GLOBAL sql_replica_skip_counter` ou `SET GLOBAL sql_slave_skip_counter` para pular o evento. Para obter instruções sobre como usar esse método alternativo e mais detalhes sobre como pular transações, consulte a Seção 19.1.7.3, “Pular Transações”.
