#### 19.3.3.2 Verificação de privilégios para canais de replicação em grupo

Você também pode usar uma conta `PRIVILEGE_CHECKS_USER` para proteger os dois tópicos de aplicação de replicação usados pela replicação em grupo. O tópico `group_replication_applier` em cada membro do grupo é usado para aplicar transações de grupo, e o tópico `group_replication_recovery` em cada membro do grupo é usado para transferir o estado do log binário como parte da recuperação distribuída quando o membro se junta ou retorna ao grupo.

Para proteger um desses tópicos, pare a replicação em grupo e, em seguida, execute a declaração `CHANGE REPLICATION SOURCE TO` com a opção `PRIVILEGE_CHECKS_USER`, especificando `group_replication_applier` ou `group_replication_recovery` como o nome do canal. Por exemplo:

```
mysql> STOP GROUP_REPLICATION;
mysql> CHANGE REPLICATION SOURCE TO PRIVILEGE_CHECKS_USER = 'gr_repl'@'%.example.com'
          FOR CHANNEL 'group_replication_recovery';
mysql> FLUSH PRIVILEGES;
mysql> START GROUP_REPLICATION;
```

Para os canais de replicação em grupo, o ajuste `REQUIRE_ROW_FORMAT` é habilitado automaticamente quando o canal é criado e não pode ser desativado, portanto, você não precisa especiﬁcar isso.

A replicação em grupo exige que todas as tabelas que devem ser replicadas pelo grupo tenham uma chave primária definida ou um equivalente de chave primária, onde o equivalente é uma chave única não nula. Em vez de usar as verificações realizadas pela variável de sistema `sql_require_primary_key`, a replicação em grupo tem seu próprio conjunto de verificações embutidas para chaves primárias ou equivalentes de chave primária. Você pode definir a opção `REQUIRE_TABLE_PRIMARY_KEY_CHECK` da instrução `CHANGE REPLICATION SOURCE TO` para `ON` para um canal de replicação em grupo. No entanto, esteja ciente de que você pode encontrar algumas transações que são permitidas pelas verificações embutidas da replicação em grupo, mas não são permitidas pelas verificações realizadas quando você define `sql_require_primary_key = ON` ou `REQUIRE_TABLE_PRIMARY_KEY_CHECK = ON`. Por essa razão, novos e canais de replicação em grupo atualizados têm `REQUIRE_TABLE_PRIMARY_KEY_CHECK` definido para o valor padrão `STREAM`, em vez de `ON`.

Se uma operação de clonagem remota for usada para recuperação distribuída na replicação em grupo (veja a Seção 20.5.4.2, “Clonagem para Recuperação Distribuída”), a conta `PRIVILEGE_CHECKS_USER` e as configurações relacionadas do doador são clonadas para o membro que está se juntando. Se o membro que está se juntando for configurado para iniciar a replicação em grupo no boot, ele usará automaticamente a conta para verificações de privilégios nos canais de replicação apropriados.