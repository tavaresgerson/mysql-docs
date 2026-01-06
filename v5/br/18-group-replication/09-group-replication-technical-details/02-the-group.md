### 17.9.2 O Grupo

No MySQL Group Replication, um conjunto de servidores forma um grupo de replicação. Um grupo tem um nome, que assume a forma de um UUID. O grupo é dinâmico e os servidores podem sair (voluntariamente ou involuntariamente) e se juntar a ele a qualquer momento. O grupo se ajusta sempre que servidores se juntam ou saem.

Se um servidor se juntar ao grupo, ele se atualiza automaticamente, obtendo o estado faltante de um servidor existente. Esse estado é transferido por meio da replicação MySQL assíncrona. Se um servidor sair do grupo, por exemplo, ele foi desligado para manutenção, os servidores restantes percebem que ele saiu e reconfiguram o grupo automaticamente. O serviço de associação ao grupo descrito em Seção 17.1.3.1, “Associação ao Grupo” impulsiona tudo isso.
