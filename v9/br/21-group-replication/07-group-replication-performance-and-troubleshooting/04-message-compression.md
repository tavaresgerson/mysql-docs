### 20.7.4 Compressão de Mensagens

Para mensagens enviadas entre membros do grupo online, a Replicação de Grupo permite a compressão de mensagens por padrão. Se uma mensagem específica é comprimida depende do limiar que você configura usando a variável de sistema `group_replication_compression_threshold`. Mensagens que têm um payload maior que o número especificado de bytes são comprimidas.

O limiar de compressão padrão é de 1.000.000 de bytes. Você poderia usar as seguintes instruções para aumentar o limiar de compressão para 2 MB, por exemplo:

```
STOP GROUP_REPLICATION;
SET GLOBAL group_replication_compression_threshold = 2097152;
START GROUP_REPLICATION;
```

Se você definir `group_replication_compression_threshold` para zero, a compressão de mensagens é desativada.

A Replicação de Grupo usa o algoritmo de compressão LZ4 para comprimir mensagens enviadas no grupo. Note que o tamanho de entrada máximo suportado pelo algoritmo de compressão LZ4 é de 2113929216 bytes. Esse limite é menor que o valor máximo possível para a variável de sistema `group_replication_compression_threshold`, que é igual ao tamanho máximo de mensagem aceito pelo XCom. O tamanho de entrada máximo do LZ4 é, portanto, um limite prático para a compressão de mensagens, e as transações acima desse tamanho não podem ser confirmadas quando a compressão de mensagens está habilitada. Com o algoritmo de compressão LZ4, não defina um valor maior que 2113929216 bytes para `group_replication_compression_threshold`.

O valor de `group_replication_compression_threshold` não é necessário que seja o mesmo em todos os membros do grupo pela Replicação de Grupo. No entanto, é aconselhável definir o mesmo valor em todos os membros do grupo para evitar o rollback desnecessário de transações, falha na entrega de mensagens ou falha na recuperação de mensagens.

Você também pode configurar a compressão para mensagens enviadas para recuperação distribuída pelo método de transferência de estado de um log binário de um doador. A compressão dessas mensagens, que são enviadas de um doador já no grupo para um membro que está se juntando, é controlada separadamente usando as variáveis de sistema `group_replication_recovery_compression_algorithms` e `group_replication_recovery_zstd_compression_level`. Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

A compressão de transações de log binário, habilitada pela variável de sistema `binlog_transaction_compression`, também pode ser usada para economizar largura de banda. Os payloads das transações permanecem comprimidos quando são transferidos entre membros do grupo. Se você usar a compressão de transações de log binário em combinação com a compressão de mensagens da Replicação em Grupo, a compressão de mensagens tem menos oportunidade de agir sobre os dados, mas ainda pode comprimir cabeçalhos e aqueles eventos e payloads de transações que não estão comprimidos. Para mais informações sobre a compressão de transações de log binário, consulte a Seção 7.4.4.5, “Compressão de Transações de Log Binário”.

A compressão para mensagens enviadas no grupo ocorre no nível do motor de comunicação do grupo, antes de os dados serem entregues ao fio de comunicação do grupo, portanto, ocorre dentro do contexto do fio de sessão do usuário `mysql`. Se o tamanho do payload da mensagem exceder o limite definido por `group_replication_compression_threshold`, o payload da transação é comprimido antes de ser enviado para o grupo e descomprimido quando é recebido. Ao receber uma mensagem, o membro verifica o envelope da mensagem para verificar se ela está comprimida ou não. Se necessário, então o membro descomprime a transação, antes de entregá-la à camada superior. Esse processo é mostrado na figura a seguir.

**Figura 20.13 Suporte à Compressão**

![A arquitetura do plugin de replicação em grupo do MySQL é mostrada conforme descrito em um tópico anterior, com as cinco camadas do plugin posicionadas entre o servidor MySQL e o grupo de replicação. A compressão e a descompressão são gerenciadas pelo Sistema de Comunicação de Grupo API, que é a quarta camada do plugin de replicação em grupo. O motor de comunicação do grupo (a quinta camada do plugin) e os membros do grupo usam as transações comprimidas com o tamanho de dados menor. O núcleo do MySQL Server e as três camadas superiores do plugin de replicação em grupo (as APIs, os componentes de captura, aplicação e recuperação e o módulo do protocolo de replicação) usam as transações originais com o tamanho de dados maior.](images/gr-compress-decompress.png)

Quando a largura de banda da rede é um gargalo, a compressão de mensagens pode proporcionar uma melhoria de até 30-40% no desempenho no nível da comunicação do grupo. Isso é especialmente importante no contexto de grandes grupos de servidores sob carga. A natureza peer-to-peer (igual para igual) das interconexões entre *N* participantes no grupo faz com que o remetente envie a mesma quantidade de dados *N* vezes. Além disso, os logs binários provavelmente apresentarão uma alta taxa de compressão. Isso torna a compressão uma característica atraente para cargas de trabalho de replicação em grupo que contêm transações grandes.