### 20.7.4 Compressão de Mensagens

Para mensagens enviadas entre membros do grupo online, a Replicação de Grupo permite a compressão de mensagens por padrão. Se uma mensagem específica é comprimida depende do limite que você configura usando a variável de sistema `group_replication_compression_threshold`. Mensagens que têm um payload maior que o número especificado de bytes são comprimidas.

O limite de compressão padrão é de 1.000.000 de bytes. Você pode usar as seguintes instruções para aumentar o limite de compressão para 2 MB, por exemplo:

```
STOP GROUP_REPLICATION;
SET GLOBAL group_replication_compression_threshold = 2097152;
START GROUP_REPLICATION;
```

Se você definir `group_replication_compression_threshold` para zero, a compressão de mensagens será desativada.

A replicação em grupo usa o algoritmo de compressão LZ4 para comprimir as mensagens enviadas no grupo. Observe que o tamanho máximo de entrada suportado pelo algoritmo de compressão LZ4 é de 2113929216 bytes. Esse limite é menor que o valor máximo possível para a variável de sistema `group_replication_compression_threshold`, que é igual ao tamanho máximo de mensagem aceito pelo XCom. O tamanho máximo de entrada do LZ4 é, portanto, um limite prático para a compressão de mensagens, e as transações acima desse tamanho não podem ser confirmadas quando a compressão de mensagens está habilitada. Com o algoritmo de compressão LZ4, não defina um valor maior que 2113929216 bytes para `group_replication_compression_threshold`.

O valor de `group_replication_compression_threshold` não é necessário que seja o mesmo em todos os membros do grupo na replicação em grupo. No entanto, é aconselhável definir o mesmo valor em todos os membros do grupo para evitar o descarte desnecessário de transações, falha na entrega de mensagens ou falha na recuperação de mensagens.

A partir do MySQL 8.0.18, você também pode configurar a compressão para mensagens enviadas para recuperação distribuída pelo método de transferência de estado de um log binário de um doador. A compressão dessas mensagens, que são enviadas de um doador já no grupo para um membro que está se juntando, é controlada separadamente usando as variáveis de sistema `group_replication_recovery_compression_algorithms` e `group_replication_recovery_zstd_compression_level`. Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

A compressão de transações de log binário (disponível a partir do MySQL 8.0.20), que é ativada pela variável de sistema `binlog_transaction_compression`, também pode ser usada para economizar largura de banda. Os payloads das transações permanecem comprimidos quando são transferidos entre os membros do grupo. Se você usar a compressão de transações de log binário em combinação com a compressão de mensagens da Replicação em Grupo, a compressão de mensagens terá menos oportunidade de agir sobre os dados, mas ainda poderá comprimir cabeçalhos e aqueles eventos e payloads de transações que não estiverem comprimidos. Para obter mais informações sobre a compressão de transações de log binário, consulte a Seção 7.4.4.5, “Compressão de Transações de Log Binário”.

A compressão das mensagens enviadas no grupo ocorre no nível do motor de comunicação do grupo, antes de os dados serem entregues ao fio de comunicação do grupo, portanto, ocorre dentro do contexto do fio de sessão do usuário `mysql`. Se o tamanho do payload da mensagem exceder o limite definido por `group_replication_compression_threshold`, o payload da transação é comprimido antes de ser enviado para o grupo e descomprimido quando é recebido. Ao receber uma mensagem, o membro verifica o envelope da mensagem para verificar se ela está comprimida ou não. Se necessário, o membro descomprime a transação antes de entregá-la à camada superior. Esse processo é mostrado na figura a seguir.

**Figura 20.13 Suporte à compressão**

![The MySQL Group Replication plugin architecture is shown as described in an earlier topic, with the five layers of the plugin positioned between the MySQL server and the replication group. Compression and decompression are handled by the Group Communication System API, which is the fourth layer of the Group Replication plugin. The group communication engine (the fifth layer of the plugin) and the group members use the compressed transactions with the smaller data size. The MySQL Server core and the three higher layers of the Group Replication plugin (the APIs, the capture, applier, and recovery components, and the replication protocol module) use the original transactions with the larger data size.](images/gr-compress-decompress.png)

Quando a largura de banda da rede é um gargalo, a compressão de mensagens pode proporcionar uma melhoria de até 30-40% no desempenho no nível da comunicação em grupo. Isso é especialmente importante no contexto de grandes grupos de servidores sob carga. A natureza peer-to-peer (igual para igual) das interconexões entre *N* participantes no grupo faz com que o remetente envie a mesma quantidade de dados *N* vezes. Além disso, os logs binários provavelmente apresentarão uma alta taxa de compressão. Isso torna a compressão uma característica atraente para cargas de trabalho de Replicação em Grupo que contêm grandes transações.
