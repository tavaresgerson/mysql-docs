#### 17.9.7.1 Ajuste fino do tópico de comunicação do grupo

O fio de comunicação de grupo (GCT) funciona em um loop enquanto o plugin de replicação de grupo está carregado. O GCT recebe mensagens do grupo e do plugin, lida com tarefas relacionadas ao quórum e à detecção de falhas, envia algumas mensagens de manutenção em atividade e também lida com as transações de entrada e saída do/para o servidor/grupo. O GCT aguarda mensagens de entrada em uma fila. Quando não há mensagens, o GCT aguarda. Configurar essa espera para ser um pouco mais longa (fazendo uma espera ativa) antes de realmente dormir pode ser benéfico em alguns casos. Isso ocorre porque a alternativa é o sistema operacional trocar o GCT do processador e fazer uma mudança de contexto.

Para forçar o GCT a realizar uma espera ativa, use a opção `group_replication_poll_spin_loops`, que faz o loop do GCT, sem realizar nenhuma ação relevante para o número configurado de loops, antes de realmente coletar a fila para a próxima mensagem.

Por exemplo:

```sql
mysql> SET GLOBAL group_replication_poll_spin_loops= 10000;
```
