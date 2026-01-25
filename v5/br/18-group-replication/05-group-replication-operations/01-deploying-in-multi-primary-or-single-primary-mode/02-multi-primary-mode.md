#### 17.5.1.2 Modo Multi-Primary

No modo multi-primary, não há a noção de um Primary único. Não há necessidade de iniciar um procedimento de eleição porque não há nenhum Server desempenhando qualquer função especial.

**Figura 17.6 Client Failover**

![Cinco instâncias de Server, S1, S2, S3, S4 e S5, são implantadas como um grupo interconectado. Todos os Servers são Primaries. Clients de escrita (write clients) estão se comunicando com os Servers S1 e S2, e um Client de leitura (read client) está se comunicando com o Server S4. O Server S1 falha em seguida, interrompendo a comunicação com o seu client de escrita. Este client se reconecta ao Server S3.](images/multi-primary.png)

Todos os Servers são definidos para o modo read-write ao ingressarem no grupo.