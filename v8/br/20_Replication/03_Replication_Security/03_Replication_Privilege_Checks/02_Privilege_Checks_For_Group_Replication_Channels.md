#### 19.3.3.2 Verificação de privilégios para canais de replicação em grupo

A partir do MySQL 8.0.19, além de garantir a replicação assíncrona e semi-síncrona, você pode optar por usar uma conta `PRIVILEGE_CHECKS_USER` para proteger os dois threads do aplicador de replicação usados pela Replicação por Grupo. O thread `group_replication_applier` em cada membro do grupo é usado para aplicar as transações do grupo, e o thread `group_replication_recovery` em cada membro do grupo é usado para transferir o estado do log binário como parte da recuperação distribuída quando o membro se junta ou se reintegra ao grupo.

Para garantir um desses fios, pare a Replicação em Grupo, em seguida, emita a declaração `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou a declaração `CHANGE MASTER TO` (antes do MySQL 8.0.23) com a opção `PRIVILEGE_CHECKS_USER`, especificando `group_replication_applier` ou `group_replication_recovery` como o nome do canal. Por exemplo:

```
mysql> STOP GROUP_REPLICATION;
mysql> CHANGE MASTER TO PRIVILEGE_CHECKS_USER = 'gr_repl'@'%.example.com'
          FOR CHANNEL 'group_replication_recovery';
mysql> FLUSH PRIVILEGES;
mysql> START GROUP_REPLICATION;

Or from MySQL 8.0.23:
mysql> STOP GROUP_REPLICATION;
mysql> CHANGE REPLICATION SOURCE TO PRIVILEGE_CHECKS_USER = 'gr_repl'@'%.example.com'
          FOR CHANNEL 'group_replication_recovery';
mysql> FLUSH PRIVILEGES;
mysql> START GROUP_REPLICATION;
```

Para os canais de replicação em grupo, o ajuste `REQUIRE_ROW_FORMAT` é ativado automaticamente quando o canal é criado e não pode ser desativado, portanto, você não precisa especiá-lo.

Importante

No MySQL 8.0.19, certifique-se de não emitir a instrução `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` com a opção `PRIVILEGE_CHECKS_USER` enquanto a Replicação por Grupo estiver em execução. Essa ação faz com que os arquivos de log de retransmissão do canal sejam limpos, o que pode causar a perda de transações que foram recebidas e colocadas em fila no log de retransmissão, mas ainda não aplicadas.

A replicação em grupo exige que todas as tabelas que devem ser replicadas pelo grupo tenham uma chave primária definida ou um equivalente de chave primária, onde o equivalente é uma chave única não nula. Em vez de usar as verificações realizadas pela variável de sistema `sql_require_primary_key`, a replicação em grupo tem seu próprio conjunto de verificações embutidas para chaves primárias ou equivalentes de chave primária. Você pode definir a opção `REQUIRE_TABLE_PRIMARY_KEY_CHECK` da declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` para `ON` para um canal de replicação em grupo. No entanto, esteja ciente de que você pode encontrar algumas transações que são permitidas nas verificações embutidas da replicação em grupo, mas não são permitidas nas verificações realizadas quando você define `sql_require_primary_key = ON` ou `REQUIRE_TABLE_PRIMARY_KEY_CHECK = ON`. Por essa razão, novos e canais de replicação em grupo atualizados a partir do MySQL 8.0.20 (quando a opção foi introduzida) têm `REQUIRE_TABLE_PRIMARY_KEY_CHECK` definido como o padrão de `STREAM`, em vez de `ON`.

Se uma operação de clonagem remota for usada para recuperação distribuída na Replicação em Grupo (consulte a Seção 20.5.4.2, “Clonagem para Recuperação Distribuída”), a partir do MySQL 8.0.19, a conta `PRIVILEGE_CHECKS_USER` e as configurações relacionadas do doador são clonadas para o membro que está se juntando. Se o membro que está se juntando estiver configurado para iniciar a Replicação em Grupo ao inicializar, ele usará automaticamente a conta para verificações de privilégios nos canais de replicação apropriados.

No MySQL 8.0.18, devido a várias limitações, recomenda-se que você não use uma conta `PRIVILEGE_CHECKS_USER` com canais de replicação por grupo.
