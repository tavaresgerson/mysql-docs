#### 17.1.3.3 Tolerância a falhas

O MySQL Group Replication se baseia em uma implementação do algoritmo distribuído Paxos para fornecer coordenação distribuída entre servidores. Como tal, ele exige que a maioria dos servidores esteja ativa para alcançar o quórum e, assim, tomar uma decisão. Isso tem um impacto direto no número de falhas que o sistema pode tolerar sem comprometer-se e sua funcionalidade geral. O número de servidores (n) necessário para tolerar `f` falhas é então `n = 2 x f + 1`.

Na prática, isso significa que, para tolerar uma falha, o grupo deve ter três servidores. Assim, se um servidor falhar, ainda há dois servidores para formar uma maioria (dois em três) e permitir que o sistema continue a tomar decisões automaticamente e progredir. No entanto, se um segundo servidor falhar *involuntariamente*, o grupo (com um servidor restante) é bloqueado, porque não há maioria para tomar uma decisão.

A seguir, uma pequena tabela que ilustra a fórmula acima.

<table summary="Relação entre o tamanho do grupo de replicação, o número de servidores que compõem a maioria e o número de falhas instantâneas que podem ser toleradas."><col style="width: 23%"/><col style="width: 18%"/><col style="width: 59%"/><thead><tr> <th><p>Tamanho do grupo</p></th> <th><p>Maioria</p></th> <th><p>Falhas instantâneas toleradas</p></th> </tr></thead><tbody><tr> <th><p>1</p></th> <td><p>1</p></td> <td><p>0</p></td> </tr><tr> <th><p>2</p></th> <td><p>2</p></td> <td><p>0</p></td> </tr><tr> <th><p>3</p></th> <td><p>2</p></td> <td><p>1</p></td> </tr><tr> <th><p>4</p></th> <td><p>3</p></td> <td><p>1</p></td> </tr><tr> <th><p>5</p></th> <td><p>3</p></td> <td><p>2</p></td> </tr><tr> <th><p>6</p></th> <td><p>4</p></td> <td><p>2</p></td> </tr><tr> <th><p>7</p></th> <td><p>4</p></td> <td><p>3</p></td> </tr></tbody></table>

O próximo capítulo aborda os aspectos técnicos da replicação em grupo.
