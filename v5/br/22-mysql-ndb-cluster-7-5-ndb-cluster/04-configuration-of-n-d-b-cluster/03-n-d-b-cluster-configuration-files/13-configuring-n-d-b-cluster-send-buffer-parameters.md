#### 21.4.3.13 Configurando Parâmetros do Send Buffer do NDB Cluster

O kernel do `NDB` emprega um send buffer unificado cuja memória é alocada dinamicamente a partir de um pool compartilhado por todos os transporters. Isso significa que o tamanho do send buffer pode ser ajustado conforme necessário. A configuração do send buffer unificado pode ser realizada definindo os seguintes parâmetros:

*   **TotalSendBufferMemory.** Este parâmetro pode ser definido para todos os tipos de nodes do NDB Cluster—ou seja, pode ser definido nas seções `[ndbd]`, `[mgm]` e `[api]` (ou `[mysql]`) do arquivo `config.ini`. Ele representa a quantidade total de memória (em bytes) a ser alocada por cada node para o qual está definido para uso entre todos os transporters configurados. Se definido, seu mínimo é 256KB; o máximo é 4294967039.

    Para ser compatível com versões anteriores e com as configurações existentes, este parâmetro assume como valor padrão a soma dos tamanhos máximos do send buffer de todos os transporters configurados, mais 32KB adicionais (uma page) por transporter. O máximo depende do tipo de transporter, conforme mostrado na tabela a seguir:

    **Tabela 21.21 Tipos de Transporter com tamanhos máximos de Send Buffer**

    <table><thead><tr> <th>Transporter</th> <th>Tamanho Máximo do Send Buffer (bytes)</th> </tr></thead><tbody><tr> <td>TCP</td> <td><code>SendBufferMemory</code> (padrão = 2M)</td> </tr><tr> <td>SHM</td> <td>20K</td> </tr></tbody></table>

    Isso permite que as configurações existentes funcionem de forma semelhante à que operavam com o NDB Cluster 6.3 e anteriores, com a mesma quantidade de memória e espaço de send buffer disponível para cada transporter. No entanto, a memória que não é usada por um transporter não fica disponível para outros transporters.

*   **OverloadLimit.** Este parâmetro é usado na seção `[tcp]` do arquivo `config.ini` e denota a quantidade de dados não enviados (em bytes) que deve estar presente no send buffer antes que a connection seja considerada sobrecarregada (overloaded). Quando tal condição de overload ocorre, as transactions que afetam a connection sobrecarregada falham com o NDB API Error 1218 (Send Buffers overloaded in NDB kernel) até que o status de overload termine. O valor padrão é 0, caso em que o limite de overload efetivo é calculado como `SendBufferMemory * 0.8` para uma determinada connection. O valor máximo para este parâmetro é 4G.

*   **SendBufferMemory.** Este valor denota um limite rígido (hard limit) para a quantidade de memória que pode ser usada por um único transporter do pool inteiro especificado por [`TotalSendBufferMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-totalsendbuffermemory). No entanto, a soma de `SendBufferMemory` para todos os transporters configurados pode ser maior do que o [`TotalSendBufferMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-totalsendbuffermemory) definido para um determinado node. Esta é uma forma de economizar memória quando muitos nodes estão em uso, desde que a quantidade máxima de memória nunca seja exigida por todos os transporters ao mesmo tempo.

*   **ReservedSendBufferMemory.** Removido antes da versão NDB 7.5 GA.

  <table frame="box" rules="all" summary="ReservedSendBufferMemory data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>bytes</td> </tr><tr> <th>Padrão</th> <td>256K</td> </tr><tr> <th>Intervalo</th> <td>0 - 4294967039 (0xFFFFFEFF)</td> </tr><tr> <th>Removido</th> <td>NDB 7.5.2</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Node Restart: </strong></span> Requer um rolling restart do cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Anteriormente, este parâmetro de data node estava presente, mas não era de fato utilizado (Bug #77404, Bug #21280428).

Você pode usar a tabela [`ndbinfo.transporters`](mysql-cluster-ndbinfo-transporters.html "21.6.15.44 The ndbinfo transporters Table") para monitorar o uso de memória do send buffer e detectar condições de lentidão (slowdown) e overload que podem afetar negativamente a performance.