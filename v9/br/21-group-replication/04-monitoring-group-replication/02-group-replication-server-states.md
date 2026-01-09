### 20.4.2 Estados dos Servidores de Replicação em Grupo

O estado de um membro do grupo de replicação em grupo mostra seu papel atual no grupo. A tabela do Schema de Desempenho `replication_group_members` mostra o estado de cada membro em um grupo. Se o grupo estiver totalmente funcional e todos os membros estarem se comunicando corretamente, todos os membros relatarão o mesmo estado para todos os outros membros. No entanto, um membro que tenha deixado o grupo ou faça parte de uma partição de rede não pode relatar informações precisas sobre os outros servidores. Nessa situação, o membro não tenta adivinhar o status dos outros servidores e, em vez disso, os relata como inacessíveis.

Um membro do grupo pode estar nos seguintes estados:

`ONLINE` :   O servidor é um membro ativo de um grupo e em um estado totalmente funcional. Outros membros do grupo podem se conectar a ele, assim como os clientes, se aplicável. Um membro está totalmente sincronizado com o grupo e participando dele quando está no estado `ONLINE`.

`RECOVERING` :   O servidor se juntou a um grupo e está no processo de se tornar um membro ativo. A recuperação distribuída está ocorrendo atualmente, onde o membro está recebendo a transferência de estado de um doador usando uma operação de clonagem remota ou o log binário do doador. Esse estado é

    Para mais informações, consulte a Seção 20.5.4, “Recuperação Distribuída”.

`OFFLINE` :   O plugin de replicação em grupo está carregado, mas o membro não pertence a nenhum grupo. Esse status pode ocorrer brevemente enquanto um membro está se juntando ou se reiniciando a um grupo.

`ERRO` :   O membro está em um estado de erro e não está funcionando corretamente como membro do grupo. Um membro pode entrar em estado de erro durante a aplicação de transações ou durante a fase de recuperação. Um membro neste estado não participa das transações do grupo. Para mais informações sobre possíveis razões para estados de erro, consulte a Seção 20.7.7, “Respostas à Detecção de Falha e Partição de Rede”.

Dependendo da ação de saída definida por `group_replication_exit_state_action`, o membro está no modo de leitura apenas (`super_read_only=ON`) e também pode estar no modo offline (`offline_mode=ON`). Note que um servidor no modo offline após a ação de saída `OFFLINE_MODE` é exibido com o status `ERRO`, não `OFFLINE`. Um servidor com a ação de saída `ABORT_SERVER` é desligado e removido da visualização do grupo. Para mais informações, consulte a Seção 20.7.7.4, “Ação de Saída”.

Enquanto um membro está se juntando ou se reiniciando em um grupo de replicação, seu status pode ser exibido como `ERRO` antes que o grupo complete as verificações de compatibilidade e o aceite como membro.

`IRRECONHECÍVEL` :   O detector de falha local suspeita que o membro não pode ser contatado, porque as mensagens do grupo estão expirando. Isso pode acontecer se um membro for desconectado involuntariamente, por exemplo. Se você vir este status para outros servidores, também pode significar que o membro onde você consulta esta tabela faz parte de uma partição, onde um subconjunto dos servidores do grupo pode se comunicar entre si, mas não pode se comunicar com os outros servidores do grupo. Para mais informações, consulte a Seção 20.7.8, “Tratamento de uma Partição de Rede e Perda de Quórum”.

Consulte a Seção 20.4.3, “A tabela replication_group_members” para um exemplo do conteúdo da tabela do Schema de Desempenho.