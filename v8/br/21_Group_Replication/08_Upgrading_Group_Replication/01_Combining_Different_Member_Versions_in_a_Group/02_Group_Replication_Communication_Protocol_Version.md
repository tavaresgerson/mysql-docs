#### 20.8.1.2 Protocolo de Comunicação de Replicação em Grupo Versão

Um grupo de replicação usa uma versão do protocolo de comunicação de Replicação em Grupo que pode diferir da versão do MySQL Server dos membros. Para verificar a versão do protocolo de comunicação do grupo, execute a seguinte instrução em qualquer membro:

```
SELECT group_replication_get_communication_protocol();
```

O valor de retorno mostra a versão mais antiga do MySQL Server que pode se juntar a este grupo e usar o protocolo de comunicação do grupo. As versões do MySQL 5.7.14 permitem a compressão de mensagens, e as versões do MySQL 8.0.16 também permitem a fragmentação de mensagens. Note que a função `group_replication_get_communication_protocol()` retorna a versão mínima do MySQL que o grupo suporta, o que pode diferir do número de versão que foi passado para a função `group_replication_set_communication_protocol()` e da versão do MySQL Server que está instalada no membro onde você usa a função.

Quando você atualizar todos os membros de um grupo de replicação para uma nova versão do MySQL Server, o protocolo de comunicação da Replicação de Grupo não é atualizado automaticamente, caso haja a necessidade de permitir que membros de versões anteriores se juntem. Se você não precisar suportar membros mais antigos e deseja permitir que os membros atualizados usem quaisquer funcionalidades de comunicação adicionadas, após a atualização, use a função `group_replication_set_communication_protocol()` para atualizar o protocolo de comunicação, especificando a nova versão do MySQL Server para a qual você atualizou os membros. Para mais informações, consulte a Seção 20.5.1.4, “Definir a Versão do Protocolo de Comunicação de um Grupo”.
