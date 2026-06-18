#### 17.1.3.3 Tolerância a falhas

O MySQL Group Replication é construído sobre uma implementação do algoritmo distribuído Paxos para fornecer coordenação distribuída entre servidores. Como tal, ele requer que uma maioria de servidores esteja ativa para atingir o *quorum* e, assim, tomar uma decisão. Isso tem impacto direto no número de falhas que o sistema pode tolerar sem comprometer a si mesmo e sua funcionalidade geral. O número de servidores (n) necessários para tolerar `f` falhas é então `n = 2 x f + 1`.

Na prática, isso significa que, para tolerar uma falha, o grupo deve ter três servidores. Assim, se um servidor falhar, ainda restam dois servidores para formar uma maioria (dois de três) e permitir que o sistema continue a tomar decisões automaticamente e a progredir. No entanto, se um segundo servidor falhar *involuntariamente*, o grupo (com um servidor restante) bloqueia, pois não há maioria para se chegar a uma decisão.

A tabela a seguir ilustra a fórmula acima.

<table summary="Relação entre o tamanho do grupo de replicação, o número de servidores que constituem uma maioria e o número de falhas instantâneas que podem ser toleradas."><col style="width: 23%"/><col style="width: 18%"/><col style="width: 59%"/><thead><tr> <th><p> Tamanho do Grupo </p></th> <th><p> Maioria </p></th> <th><p> Falhas Instantâneas Toleradas </p></th> </tr></thead><tbody><tr> <th><p> 1 </p></th> <td><p> 1 </p></td> <td><p> 0 </p></td> </tr><tr> <th><p> 2 </p></th> <td><p> 2 </p></td> <td><p> 0 </p></td> </tr><tr> <th><p> 3 </p></th> <td><p> 2 </p></td> <td><p> 1 </p></td> </tr><tr> <th><p> 4 </p></th> <td><p> 3 </p></td> <td><p> 1 </p></td> </tr><tr> <th><p> 5 </p></th> <td><p> 3 </p></td> <td><p> 2 </p></td> </tr><tr> <th><p> 6 </p></th> <td><p> 4 </p></td> <td><p> 2 </p></td> </tr><tr> <th><p> 7 </p></th> <td><p> 4 </p></td> <td><p> 3 </p></td> </tr> </tbody></table>

O próximo Capítulo aborda aspectos técnicos do Group Replication.