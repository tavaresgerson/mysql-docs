### 20.7.1 Ajuste fino do fio de comunicação do grupo

O fio de comunicação do grupo (GCF) roda em um loop enquanto o plugin de replicação de grupo está carregado. O GCF recebe mensagens do grupo e do plugin, lida com tarefas relacionadas ao quorum e detecção de falhas, envia algumas mensagens de manutenção e também lida com as transações de entrada e saída do/para o servidor/grupo. O GCF aguarda mensagens de entrada em uma fila. Quando não há mensagens, o GCF aguarda. Configurar essa espera para ser um pouco mais longa (fazendo uma espera ativa) antes de realmente dormir pode ser benéfico em alguns casos. Isso ocorre porque a alternativa é o sistema operacional trocar o GCF do processador e fazer uma troca de contexto.

Para forçar o GCF a fazer uma espera ativa, use a opção `group_replication_poll_spin_loops`, que faz o GCF rodar, sem fazer nada relevante para o número configurado de loops, antes de realmente coletar a fila para a próxima mensagem.

Por exemplo:

```
mysql> SET GLOBAL group_replication_poll_spin_loops= 10000;
```