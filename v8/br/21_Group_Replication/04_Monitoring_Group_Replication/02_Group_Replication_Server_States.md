### 20.4.2 Estados do servidor de replicação em grupo

O estado de um membro do grupo de replicação em grupo mostra seu papel atual no grupo. A tabela do Schema de Desempenho `replication_group_members` mostra o estado de cada membro em um grupo. Se o grupo estiver totalmente funcional e todos os membros estiverem se comunicando corretamente, todos os membros relatarão o mesmo estado para todos os outros membros. No entanto, um membro que saiu do grupo ou faz parte de uma partição de rede não pode relatar informações precisas sobre os outros servidores. Nessa situação, o membro não tenta adivinhar o status dos outros servidores e, em vez disso, os relata como inatingíveis.

Um membro do grupo pode estar nos seguintes estados:

`ONLINE` :   O servidor é um membro ativo de um grupo e em um estado totalmente funcional. Outros membros do grupo podem se conectar a ele, assim como os clientes, se aplicável. Um membro só está totalmente sincronizado com o grupo e participando dele quando está no estado `ONLINE`.

`RECOVERING` :   O servidor se juntou a um grupo e está no processo de se tornar um membro ativo. A recuperação distribuída está ocorrendo atualmente, onde o membro está recebendo a transferência de estado de um doador usando uma operação de clonagem remota ou o log binário do doador. Este estado é

```
For more information, see Section 20.5.4, “Distributed Recovery”.
```

`OFFLINE` : O plugin de replicação de grupo está carregado, mas o membro não pertence a nenhum grupo. Esse status pode ocorrer brevemente enquanto um membro está se juntando ou retornando a um grupo.

`ERROR` :   O membro está em um estado de erro e não está funcionando corretamente como membro do grupo. Um membro pode entrar em estado de erro durante a aplicação de transações ou durante a fase de recuperação. Um membro neste estado não participa das transações do grupo. Para obter mais informações sobre as possíveis razões para os estados de erro, consulte a Seção 20.7.7, “Respostas à Detecção de Falha e Partição de Rede”.

```
Depending on the exit action set by `group_replication_exit_state_action`, the member is in read-only mode (`super_read_only=ON`) and could also be in offline mode (`offline_mode=ON`). Note that a server in offline mode following the `OFFLINE_MODE` exit action is displayed with `ERROR` status, not `OFFLINE`. A server with the exit action `ABORT_SERVER` shuts down and is removed from the view of the group. For more information, see Section 20.7.7.4, “Exit Action”.

While a member is joining or rejoining a replication group, its status can be displayed as `ERROR` before the group completes the compatibility checks and accepts it as a member.
```

`UNREACHABLE` :   O detector de falhas local suspeita que o membro não pode ser contatado, porque as mensagens do grupo estão expirando. Isso pode acontecer, por exemplo, se um membro for desconectado involuntariamente. Se você ver esse status em outros servidores, também pode significar que o membro onde você consulta essa tabela faz parte de uma partição, onde um subconjunto dos servidores do grupo pode se comunicar entre si, mas não pode se comunicar com os outros servidores do grupo. Para mais informações, consulte a Seção 20.7.8, “Tratamento de uma Partição de Rede e Perda de Quórum”.

Consulte a Seção 20.4.3, “A tabela replication\_group\_members”, para obter um exemplo do conteúdo da tabela do Gerenciamento de Desempenho.
