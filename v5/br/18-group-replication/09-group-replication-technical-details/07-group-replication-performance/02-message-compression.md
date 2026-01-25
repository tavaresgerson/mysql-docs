#### 17.9.7.2 Compressão de Mensagens

Para mensagens enviadas entre membros online do grupo, o Group Replication habilita a compressão de mensagens por padrão. Se uma mensagem específica é comprimida depende do *threshold* que você configura usando a variável de sistema [`group_replication_compression_threshold`](group-replication-system-variables.html#sysvar_group_replication_compression_threshold). Mensagens que possuem um *payload* maior que o número de bytes especificado são comprimidas.

O *compression threshold* padrão é de 1000000 bytes. Você pode usar as seguintes instruções para aumentar o *compression threshold* para 2MB, por exemplo:

```sql
STOP GROUP_REPLICATION;
SET GLOBAL group_replication_compression_threshold = 2097152;
START GROUP_REPLICATION;
```

Se você definir [`group_replication_compression_threshold`](group-replication-system-variables.html#sysvar_group_replication_compression_threshold) como zero, a compressão de mensagens é desabilitada.

O Group Replication utiliza o algoritmo de compressão LZ4 para comprimir mensagens enviadas no grupo. Note que o tamanho máximo de *input* suportado para o algoritmo de compressão LZ4 é de 2113929216 bytes. Esse limite é menor do que o valor máximo possível para a variável de sistema [`group_replication_compression_threshold`](group-replication-system-variables.html#sysvar_group_replication_compression_threshold), que corresponde ao tamanho máximo de mensagem aceito pelo XCom. O tamanho máximo de *input* do LZ4 é, portanto, um limite prático para a compressão de mensagens, e *transactions* acima desse tamanho não podem ser *committed* quando a compressão de mensagens está habilitada. Com o algoritmo de compressão LZ4, não defina um valor maior que 2113929216 bytes para [`group_replication_compression_threshold`](group-replication-system-variables.html#sysvar_group_replication_compression_threshold).

Não é exigido pelo Group Replication que o valor de [`group_replication_compression_threshold`](group-replication-system-variables.html#sysvar_group_replication_compression_threshold) seja o mesmo em todos os membros do grupo. No entanto, é aconselhável definir o mesmo valor em todos os membros do grupo para evitar *rollback* desnecessário de *transactions*, falha na entrega de mensagens ou falha na recuperação de mensagens.

A compressão para mensagens enviadas no grupo ocorre no nível do *group communication engine*, antes que os dados sejam entregues ao *group communication thread*, de modo que ela acontece dentro do contexto do *user session thread* do `mysql`. Se o tamanho do *payload* da mensagem exceder o *threshold* definido por [`group_replication_compression_threshold`](group-replication-system-variables.html#sysvar_group_replication_compression_threshold), o *payload* da *transaction* é comprimido antes de ser enviado ao grupo, e descomprimido quando é recebido. Ao receber uma mensagem, o membro verifica o envelope da mensagem para verificar se ela está comprimida ou não. Se necessário, o membro então descomprime a *transaction*, antes de entregá-la à camada superior. Este processo é mostrado na figura a seguir.

**Figura 17.15 Suporte à Compressão**

![A arquitetura do plugin MySQL Group Replication é mostrada conforme descrito em um tópico anterior, com as cinco camadas do plugin posicionadas entre o servidor MySQL e o grupo de replicação. A compressão e descompressão são tratadas pela Group Communication System API, que é a quarta camada do plugin Group Replication. O group communication engine (a quinta camada do plugin) e os membros do grupo usam as transactions comprimidas com o tamanho de dados menor. O core do MySQL Server e as três camadas superiores do plugin Group Replication (as APIs, os componentes de captura, aplicação e recuperação, e o módulo de protocolo de replicação) usam as transactions originais com o tamanho de dados maior.](images/gr-compress-decompress.png)

Quando a largura de banda da rede é um *bottleneck*, a compressão de mensagens pode fornecer uma melhoria de *throughput* de até 30-40% no nível de comunicação do grupo. Isso é especialmente importante no contexto de grandes grupos de servidores sob *load*. A natureza *peer-to-peer* do TCP das interconexões entre *N* participantes no grupo faz com que o remetente envie a mesma quantidade de dados *N* vezes. Além disso, os *binary logs* tendem a exibir uma alta taxa de compressão. Isso torna a compressão um recurso atraente para *workloads* do Group Replication que contêm *transactions* grandes.