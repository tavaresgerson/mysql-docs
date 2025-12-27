#### 15.4.3.1 Declaração de REPLICAÇÃO EM GRUPO

```
  START GROUP_REPLICATION
          [USER='user_name']
          [, PASSWORD='user_pass']
          [, DEFAULT_AUTH='plugin_name']
```

Inicia a replicação em grupo. Esta declaração requer o privilégio `GROUP_REPLICATION_ADMIN` (ou o privilégio desatualizado `SUPER`). Se `super_read_only=ON` estiver definido e o membro deve se juntar como primário, `super_read_only` é definido como `OFF` assim que a Replicação em Grupo começar com sucesso.

Um servidor que participa de um grupo no modo de único primário deve usar `skip_replica_start=ON`. Caso contrário, o servidor não é permitido se juntar a um grupo como secundário.

Você pode especificar credenciais de usuário para recuperação distribuída na declaração `START GROUP_REPLICATION` usando as opções `USER`, `PASSWORD` e `DEFAULT_AUTH`, conforme segue:

* `USER`: O usuário de replicação para recuperação distribuída. Para obter instruções sobre como configurar essa conta, consulte a Seção 20.2.1.3, “Credenciais de Usuário para Recuperação Distribuída”. Você não pode especificar uma string vazia ou nula, ou omitir a opção `USER` se `PASSWORD` for especificado.

* `PASSWORD`: A senha da conta de usuário de replicação. A senha não pode ser criptografada, mas é mascarada no log de consulta.

* `DEFAULT_AUTH`: O nome do plugin de autenticação usado para a conta de usuário de replicação. Se você não especificar essa opção, o plugin `caching_sha2_password` é assumido. Esta opção atua como um indício para o servidor, e o doador para recuperação distribuída o substitui se um plugin diferente for associado à conta de usuário nesse servidor. O plugin de autenticação usado por padrão ao criar contas de usuário no MySQL 9.5 é o plugin de autenticação caching SHA-2 (`caching_sha2_password`). Consulte a Seção 8.2.17, “Autenticação Personalizável” para obter mais informações sobre plugins de autenticação.

Essas credenciais são usadas para recuperação distribuída no canal `group_replication_recovery`. Quando você especifica credenciais de usuário no `START GROUP_REPLICATION`, as credenciais são salvas na memória apenas e são removidas por uma declaração `STOP GROUP_REPLICATION` ou desligamento do servidor. Você deve emitir uma declaração `START GROUP_REPLICATION` para fornecer as credenciais novamente. Esse método, portanto, não é compatível com o início automático da Replicação de Grupo ao iniciar o servidor, conforme especificado pela variável de sistema `group_replication_start_on_boot`.

As credenciais de usuário especificadas no `START GROUP_REPLICATION` têm precedência sobre quaisquer credenciais de usuário definidas para o canal `group_replication_recovery` usando uma declaração `CHANGE REPLICATION SOURCE TO`. Note que as credenciais de usuário definidas usando essas declarações são armazenadas nos repositórios de metadados de replicação e são usadas quando `START GROUP_REPLICATION` é especificado sem credenciais de usuário, incluindo iniciais automáticas se a variável de sistema `group_replication_start_on_boot` for definida como `ON`. Para obter os benefícios de segurança de especificar credenciais de usuário no `START GROUP_REPLICATION`, certifique-se de que `group_replication_start_on_boot` esteja definido como `OFF` (o padrão é `ON`) e exclua quaisquer credenciais de usuário previamente definidas para o canal `group_replication_recovery`, seguindo as instruções na Seção 20.6.3, “Segurando Conexões de Recuperação Distribuída”.

Enquanto um membro está retornando a um grupo de replicação, seu status pode ser exibido como `OFFLINE` ou `ERROR` antes que o grupo complete as verificações de compatibilidade e o aceite como membro. Quando o membro está recuperando as transações do grupo, seu status é `RECOVERING`.