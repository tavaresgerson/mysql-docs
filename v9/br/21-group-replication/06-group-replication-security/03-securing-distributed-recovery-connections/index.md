### 20.6.3 Segurança de Conexões de Recuperação Distribuída

20.6.3.1 Credenciais de Usuário Seguras para Recuperação Distribuída

20.6.3.2 Conexões Secure Socket Layer (SSL) para Recuperação Distribuída

Importante

Ao usar a pilha de comunicação MySQL (`group_replication_communication_stack=MYSQL`) E conexões seguras entre membros (`group_replication_ssl_mode` não está definido como `DISABLED`), as configurações de segurança discutidas nesta seção são aplicadas não apenas às conexões de recuperação distribuída, mas às comunicações em grupo entre os membros em geral.

Quando um membro se junta ao grupo, a recuperação distribuída é realizada usando uma combinação de uma operação de clonagem remota, se disponível e apropriada, e uma conexão de replicação assíncrona. Para uma descrição completa da recuperação distribuída, consulte a Seção 20.5.4, “Recuperação Distribuída”.

Os membros do grupo oferecem suas conexões padrão de cliente SQL para membros que se juntam para recuperação distribuída, conforme especificado pelas variáveis de sistema `hostname` e `port` do MySQL Server, e podem (também) anunciar uma lista alternativa de pontos de extremidade de recuperação distribuída como conexões de cliente dedicadas para membros que se juntam. Para mais detalhes, consulte a Seção 20.5.4.1, “Conexões para Recuperação Distribuída”. Observe que tais conexões oferecidas a um membro que se junta para recuperação distribuída *não* são as mesmas conexões que são usadas pela Replicação em Grupo para comunicação entre membros online quando a pilha de comunicação XCom é usada para comunicações em grupo (`group_replication_communication_stack=XCOM`).

Para garantir conexões de recuperação distribuída no grupo, certifique-se de que as credenciais de usuário para o usuário de replicação estejam adequadamente seguras e use SSL para conexões de recuperação distribuída, se possível.