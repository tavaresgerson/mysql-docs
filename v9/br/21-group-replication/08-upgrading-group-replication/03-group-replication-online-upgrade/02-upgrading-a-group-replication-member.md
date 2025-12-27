#### 20.8.3.2 Atualizando um Membro da Replicação em Grupo

Esta seção explica os passos necessários para atualizar um membro de um grupo. Este procedimento faz parte dos métodos descritos na Seção 20.8.3.3, “Métodos de Atualização Online da Replicação em Grupo”. O processo de atualização de um membro de um grupo é comum a todos os métodos e é explicado primeiro. A maneira como você se junta aos membros atualizados pode depender do método que você está seguindo, e outros fatores, como se o grupo está operando no modo único ou multiúnico. A forma como você atualiza a instância do servidor, usando a abordagem de implantação ou provisionamento, não afeta os métodos descritos aqui.

O processo de atualização de um membro consiste em removê-lo do grupo, seguir seu método escolhido de atualização do membro e, em seguida, reconectar o membro atualizado a um grupo. A ordem recomendada de atualização de membros em um grupo único é atualizar todos os secundários e, em seguida, atualizar o primário por último. Se o primário for atualizado antes de um secundário, um novo primário usando a versão mais antiga do MySQL é escolhido, mas não há necessidade dessa etapa.

Para atualizar um membro de um grupo:

* Conecte um cliente ao membro do grupo e execute `STOP GROUP_REPLICATION`. Antes de prosseguir, certifique-se de que o status do membro é `OFFLINE` monitorando a tabela `replication_group_members`.

* Desative a Replicação em Grupo de iniciar automaticamente para que você possa se conectar com segurança ao membro após a atualização e configurá-lo sem que ele se reconecte ao grupo, definindo `group_replication_start_on_boot=0`.

Importante

Se um membro atualizado tiver `group_replication_start_on_boot=1`, ele poderá se reiniciar no grupo antes que você possa realizar o procedimento de atualização do MySQL e isso pode causar problemas. Por exemplo, se a atualização falhar e o servidor reiniciar novamente, um servidor possivelmente quebrado poderá tentar se reiniciar no grupo.

* Parar o membro, por exemplo, usando **mysqladmin shutdown** ou a instrução `SHUTDOWN`. Todos os outros membros do grupo continuam em execução.

* Atualizar o membro, usando a abordagem de implantação ou provisionamento. Veja o Capítulo 3, *Atualizando o MySQL* para detalhes. Ao reiniciar o membro atualizado, como `group_replication_start_on_boot` está definido como 0, a Replicação em Grupo não é iniciada na instância e, portanto, não se reinicia no grupo.

* Após a execução do procedimento de atualização do MySQL no membro, `group_replication_start_on_boot` deve ser definido como 1 para garantir que a Replicação em Grupo seja iniciada corretamente após o reinício. Reinicie o membro.

* Conecte-se ao membro atualizado e execute `START GROUP_REPLICATION`. Isso reinicia o membro no grupo. Os metadados da Replicação em Grupo estão no lugar no servidor atualizado, portanto, geralmente não é necessário reconfigurar a Replicação em Grupo. O servidor precisa recuperar quaisquer transações processadas pelo grupo enquanto o servidor estava offline. Uma vez que tenha recuperado o grupo, ele se torna um membro online do grupo.

* Nota

* Quanto mais tempo levar para atualizar um servidor, mais tempo o membro estará offline e, portanto, mais tempo o servidor levará para se recuperar ao ser adicionado ao grupo.

Quando um membro atualizado se junta a um grupo que tem algum membro executando uma versão anterior do Servidor MySQL, o membro atualizado se junta com `super_read_only=on`. Isso garante que nenhuma escrita seja feita nos membros atualizados até que todos os membros estejam executando a versão mais recente. Em um grupo de modo multi-primário, quando a atualização for concluída com sucesso e o grupo estiver pronto para processar transações, os membros que são destinados a serem primárias legítimas devem ser configurados no modo de leitura/escrita. Quando todos os membros de um grupo forem atualizados para a mesma versão, eles todos voltam automaticamente para o modo de leitura/escrita.