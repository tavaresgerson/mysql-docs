#### 25.4.3.14 Configurando Parâmetros do Buffer de Envio do NDB Cluster

O kernel `NDB` utiliza um buffer de envio unificado cuja memória é alocada dinamicamente de um pool compartilhado por todos os transportadores. Isso significa que o tamanho do buffer de envio pode ser ajustado conforme necessário. A configuração do buffer de envio unificado pode ser realizada definindo os seguintes parâmetros:

* **TotalSendBufferMemory.** Este parâmetro pode ser definido para todos os tipos de nós do NDB Cluster, ou seja, pode ser definido nas seções `[ndbd]`, `[mgm]` e `[api]` (ou `[mysql]`) do arquivo `config.ini`. Ele representa a quantidade total de memória (em bytes) a ser alocada por cada nó para o qual é definido para uso entre todos os transportadores configurados. Se definido, seu valor mínimo é de 256KB; o máximo é de 4294967039.

Para ser compatível com configurações existentes, este parâmetro assume como valor padrão a soma dos tamanhos máximos dos buffers de envio de todos os transportadores configurados, mais 32KB (uma página) por transportador. O máximo depende do tipo de transportador, conforme mostrado na tabela a seguir:

**Tabela 25.22 Tipos de transportadores com tamanhos máximos de buffers de envio**

<table><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Transportador</th> <th>Tamanho Máximo do Buffer de Envio (bytes)</th> </tr></thead><tbody><tr> <td>TCP</td> <td><a class="link" href="mysql-cluster-tcp-definition.html#ndbparam-tcp-sendbuffermemory"><code class="literal">SendBufferMemory</code></a> (padrão = 2M)</td> </tr><tr> <td>SHM</td> <td>20K</td> </tr></tbody></table>

Isso permite que as configurações existentes funcionem de maneira quase idêntica àquelas do NDB Cluster 6.3 e versões anteriores, com a mesma quantidade de memória e espaço de buffer de envio disponível para cada transportador. No entanto, a memória que não é usada por um transportador não está disponível para outros transportadores.

* **OverloadLimit.** Este parâmetro é usado na seção `[tcp]` do arquivo `config.ini` e indica a quantidade de dados não enviados (em bytes) que devem estar presentes no buffer de envio antes que a conexão seja considerada sobrecarregada. Quando ocorre uma condição de sobrecarga, as transações que afetam a conexão sobrecarregada falham com o erro da API NDB 1218 (Buffers de envio sobrecarregados no kernel NDB) até que o status de sobrecarga seja resolvido. O valor padrão é 0, caso em que o limite de sobrecarga efetivo é calculado como `SendBufferMemory * 0,8` para uma conexão específica. O valor máximo para este parâmetro é de 4G.

* **SendBufferMemory.** Este valor indica um limite rígido para a quantidade de memória que um único transportador pode usar de toda a reserva especificada por `TotalSendBufferMemory`. No entanto, a soma de `SendBufferMemory` para todos os transportadores configurados pode ser maior que o `TotalSendBufferMemory` definido para um nó específico. Essa é uma maneira de economizar memória quando muitos nós estão em uso, desde que a quantidade máxima de memória nunca seja exigida por todos os transportadores ao mesmo tempo.

Você pode usar a tabela `ndbinfo.transporters` para monitorar o uso da memória do buffer de envio e detectar condições de lentidão e sobrecarga que podem afetar negativamente o desempenho.