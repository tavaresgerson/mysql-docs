### 20.6.3 Segurança das conexões de recuperação distribuída

20.6.3.1 Credenciais de Usuário Seguras para Recuperação Distribuída

20.6.3.2 Conexões SSL (Secure Socket Layer) para Recuperação Distribuída

Importante

Ao usar a pilha de comunicação MySQL (`group_replication_communication_stack=MYSQL`) E conexões seguras entre os membros (`group_replication_ssl_mode` não está definido como `DISABLED`), as configurações de segurança discutidas nesta seção são aplicadas não apenas às conexões de recuperação distribuídas, mas às comunicações em grupo entre os membros em geral.

Quando um membro se junta ao grupo, a recuperação distribuída é realizada usando uma combinação de uma operação de clonagem remota, se disponível e apropriada, e uma conexão de replicação assíncrona. Para uma descrição completa da recuperação distribuída, consulte a Seção 20.5.4, “Recuperação Distribuída”.

Até o MySQL 8.0.20, os membros do grupo oferecem sua conexão padrão com o cliente SQL para os membros que fazem parte da recuperação distribuída, conforme especificado pelas variáveis de sistema `hostname` e `port` do MySQL Server. A partir do MySQL 8.0.21, os membros do grupo podem anunciar uma lista alternativa de pontos de extremidade de recuperação distribuída como conexões de cliente dedicadas para os membros que fazem parte da recuperação distribuída. Para mais detalhes, consulte a Seção 20.5.4.1, “Conexões para Recuperação Distribuída”. Observe que essas conexões oferecidas a um membro que faz parte da recuperação distribuída *não* são as mesmas conexões que são usadas pela Replicação em Grupo para a comunicação entre os membros online quando a pilha de comunicação XCom é usada para comunicações em grupo (`group_replication_communication_stack=XCOM`).

Para garantir conexões de recuperação distribuídas no grupo, certifique-se de que as credenciais do usuário para o usuário de replicação estejam adequadamente protegidas e use SSL para conexões de recuperação distribuídas, se possível.
