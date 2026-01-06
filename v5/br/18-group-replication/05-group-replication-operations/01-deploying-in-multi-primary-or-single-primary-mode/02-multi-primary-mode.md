#### 17.5.1.2 Modo Multi-Primario

No modo multi-primario, não há a noção de um único primário. Não há necessidade de envolver um procedimento eleitoral, pois não há nenhum servidor desempenhando um papel especial.

**Figura 17.6 Failover do cliente**

![Cinco instâncias de servidor, S1, S2, S3, S4 e S5, são implantadas como um grupo interconectado. Todos os servidores são primárias. Os clientes de escrita estão se comunicando com os servidores S1 e S2, e um cliente de leitura está se comunicando com o servidor S4. O servidor S1 então falha, interrompendo a comunicação com seu cliente de escrita. Esse cliente se reconecta ao servidor S3.](images/multi-primary.png)

Todos os servidores estão configurados no modo de leitura e escrita ao se juntarem ao grupo.
