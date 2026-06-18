#### 20.8.3.2 Atualização de um membro da replicação em grupo

Esta seção explica os passos necessários para atualizar um membro de um grupo. Esse procedimento faz parte dos métodos descritos na Seção 20.8.3.3, “Métodos de Atualização Online de Replicação de Grupo”. O processo de atualização de um membro de um grupo é comum a todos os métodos e é explicado primeiro. A maneira como você se junta aos membros atualizados pode depender do método que você está seguindo e de outros fatores, como se o grupo está operando no modo de primário único ou multi-primário. A forma como você atualiza a instância do servidor, usando a abordagem de implantação ou provisionamento, não afeta os métodos descritos aqui.

O processo de atualização de um membro consiste em removê-lo do grupo, seguir o método escolhido para atualizar o membro e, em seguida, reincorporá-lo ao grupo atualizado. A ordem recomendada para atualizar membros em um grupo de primário único é atualizar todos os secundários e, em seguida, atualizar o primário por último. Se o primário for atualizado antes de um secundário, um novo primário usando a versão mais antiga do MySQL é escolhido, mas não há necessidade desse passo.

Para atualizar um membro de um grupo:

- Conecte um cliente ao membro do grupo e emita `STOP GROUP_REPLICATION`. Antes de prosseguir, verifique se o status do membro é `OFFLINE` monitorando a tabela `replication_group_members`.

- Desative a replicação em grupo para que você possa se conectar ao membro com segurança após a atualização e configurá-lo sem que ele se reinicie ao grupo, definindo `group_replication_start_on_boot=0`.

  Importante

  Se um membro atualizado tiver `group_replication_start_on_boot=1`, ele poderá se reiniciar no grupo antes que você possa realizar o procedimento de atualização do MySQL, o que pode causar problemas. Por exemplo, se a atualização falhar e o servidor reiniciar novamente, um servidor possivelmente danificado poderá tentar se reiniciar no grupo.

- Pare o membro, por exemplo, usando **mysqladmin shutdown** ou a instrução `SHUTDOWN`. Qualquer outro membro do grupo continua em execução.

- Atualize o membro usando a abordagem de implantação ou provisionamento. Consulte o Capítulo 3, *Atualizando o MySQL*, para obter detalhes. Ao reiniciar o membro atualizado, como o `group_replication_start_on_boot` está definido como 0, a Replicação de Grupo não é iniciada na instância e, portanto, não se reinicia no grupo.

- Depois que o procedimento de atualização do MySQL for executado no membro, o `group_replication_start_on_boot` deve ser definido como 1 para garantir que a Replicação em Grupo seja iniciada corretamente após o reinício. Reinicie o membro.

- Conecte-se ao membro atualizado e emita `START GROUP_REPLICATION`. Isso reconecta o membro ao grupo. Os metadados da Replicação de Grupo estão em vigor no servidor atualizado, portanto, geralmente não é necessário reconfigurar a Replicação de Grupo. O servidor precisa recuperar quaisquer transações processadas pelo grupo enquanto o servidor estava offline. Uma vez que ele tenha recuperado o grupo, ele se torna um membro online do grupo.

  Nota

  Quanto mais tempo demorar para atualizar um servidor, mais tempo o membro estará offline e, portanto, mais tempo levará para o servidor se atualizar quando voltar a ser adicionado ao grupo.

Quando um membro atualizado se junta a um grupo que tem algum membro executando uma versão anterior do MySQL Server, o membro atualizado se junta com `super_read_only=on`. Isso garante que nenhuma escrita seja feita em membros atualizados até que todos os membros estejam executando a versão mais recente. Em um grupo de modo multi-primário, quando a atualização for concluída com sucesso e o grupo estiver pronto para processar transações, os membros que são destinados como primárias de escrita devem ser configurados no modo de leitura e escrita. A partir do MySQL 8.0.17, quando todos os membros de um grupo forem atualizados para a mesma versão, eles todos voltam automaticamente para o modo de leitura e escrita. Para versões anteriores, você deve configurar manualmente cada membro no modo de leitura e escrita. Conecte-se a cada membro e execute:

```
SET GLOBAL super_read_only=OFF;
```
