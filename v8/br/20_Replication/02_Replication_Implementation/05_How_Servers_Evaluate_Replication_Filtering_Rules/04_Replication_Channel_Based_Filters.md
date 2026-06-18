#### 19.2.5.4 Filtros baseados em canais de replicação

Esta seção explica como trabalhar com filtros de replicação quando existem vários canais de replicação, por exemplo, em uma topologia de replicação de múltiplas fontes. Antes do MySQL 8.0, todos os filtros de replicação eram globais, então os filtros eram aplicados a todos os canais de replicação. A partir do MySQL 8.0, os filtros de replicação podem ser globais ou específicos de canal, permitindo que você configure réplicas de múltiplas fontes com filtros de replicação em canais de replicação específicos. Os filtros de replicação específicos de canal são particularmente úteis em uma topologia de replicação de múltiplas fontes quando o mesmo banco de dados ou tabela está presente em várias fontes e a replicação é necessária apenas para replicá-lo de uma fonte.

Para obter instruções sobre como configurar canais de replicação, consulte a Seção 19.1.5, “Replicação de Multi-Fonte MySQL”, e, para obter mais informações sobre como eles funcionam, consulte a Seção 19.2.2, “Canais de Replicação”.

Importante

Cada canal em uma replica multi-fonte deve replicar a partir de uma fonte diferente. Você não pode configurar vários canais de replicação a partir de uma única replica para uma única fonte, mesmo que você use filtros de replicação para selecionar dados diferentes a serem replicados em cada canal. Isso ocorre porque os IDs dos servidores das réplicas devem ser únicos em uma topologia de replicação. A fonte distingue as réplicas apenas por seus IDs de servidor, não pelos nomes dos canais de replicação, então ela não pode reconhecer diferentes canais de replicação da mesma replica.

Importante

Em uma instância do servidor MySQL configurada para a Replicação por Grupo, os filtros de replicação específicos de canal podem ser usados em canais de replicação que não estão diretamente envolvidos com a Replicação por Grupo, como quando um membro do grupo também atua como replica para uma fonte que está fora do grupo. Eles não podem ser usados nos canais `group_replication_applier` ou `group_replication_recovery`. Filtrar esses canais tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente.

Importante

Para uma replica multi-fonte em uma topologia de diamante (onde a replica se replica a partir de duas ou mais fontes, que por sua vez se replicam a partir de uma fonte comum), quando a replicação baseada em GTID está em uso, certifique-se de que quaisquer filtros de replicação ou outras configurações de canal são idênticos em todos os canais da replica multi-fonte. Com a replicação baseada em GTID, os filtros são aplicados apenas aos dados da transação, e os GTIDs não são filtrados. Isso acontece para que o conjunto de GTIDs da replica permaneça consistente com o da fonte, o que significa que a autoposição de GTIDs pode ser usada sem precisar adquirir novamente as transações filtradas cada vez. No caso em que a replica descendente é multi-fonte e recebe a mesma transação de múltiplas fontes em uma topologia de diamante, a replica descendente agora tem múltiplas versões da transação, e o resultado depende do canal que aplicar a transação primeiro. O segundo canal a tentar isso ignora a transação usando a autodescontagem de GTID, porque o GTID da transação foi adicionado ao conjunto `gtid_executed` pelo primeiro canal. Com a filtragem idêntica nos canais, não há problema, pois todas as versões da transação contêm os mesmos dados, então os resultados são os mesmos. No entanto, com a filtragem diferente nos canais, o banco de dados pode se tornar inconsistente e a replicação pode ficar presa.

##### Visão geral dos filtros e canais de replicação

Quando existem vários canais de replicação, por exemplo, em uma topologia de replicação de múltiplas fontes, os filtros de replicação são aplicados da seguinte forma:

- Qualquer filtro de replicação global especificado é adicionado aos filtros de replicação global do tipo de filtro (`do_db`, `do_ignore_table` e assim por diante).

- Qualquer filtro de replicação específico de canal adiciona o filtro aos filtros de replicação do canal especificado para o tipo de filtro especificado.

- Cada canal de replicação copia os filtros de replicação globais para os filtros de replicação específicos do canal, se nenhum filtro de replicação específico do canal desse tipo for configurado.

- Cada canal usa seus filtros de replicação específicos para filtrar o fluxo de replicação.

A sintaxe para criar filtros de replicação específicos para um canal estende as declarações SQL e as opções de comando existentes. Quando um canal de replicação não é especificado, o filtro de replicação global é configurado para garantir a compatibilidade reversa. A declaração `CHANGE REPLICATION FILTER` suporta a cláusula `FOR CHANNEL` para configurar filtros específicos para um canal online. As opções de comando `--replicate-*` para configurar filtros podem especificar um canal de replicação usando o formato `--replicate-filter_type=channel_name:filter_details`. Suponha que os canais `channel_1` e `channel_2` existam antes do servidor começar; nesse caso, iniciar a replica com as opções de linha de comando `--replicate-do-db=db1` `--replicate-do-db=channel_1:db2` `--replicate-do-db=db3` `--replicate-ignore-db=db4` `--replicate-ignore-db=channel_2:db5` `--replicate-wild-do-table=channel_1:db6.t1%` resultaria em:

- *Filtros de replicação global*: `do_db=db1,db3`; `ignore_db=db4`

- *Filtros específicos do canal em channel\_1*: `do_db=db2`; `ignore_db=db4`; `wild-do-table=db6.t1%`

- *Filtros específicos do canal no canal\_2*: `do_db=db1,db3`; `ignore_db=db5`

Essas mesmas regras poderiam ser aplicadas na inicialização quando incluídas no arquivo `my.cnf` da réplica, assim:

```
replicate-do-db=db1
replicate-do-db=channel_1:db2
replicate-ignore-db=db4
replicate-ignore-db=channel_2:db5
replicate-wild-do-table=channel_1:db6.t1%
```

Para monitorar os filtros de replicação nessa configuração, use as tabelas `replication_applier_global_filters` e `replication_applier_filters`.

##### Configurar filtros de replicação específicos de canal na inicialização

As opções de comando relacionadas ao filtro de replicação podem ter um `channel` opcional seguido de um ponto e vírgula, seguido da especificação do filtro. O primeiro ponto e vírgula é interpretado como um separador, os pontos e vírgulas subsequentes são interpretados como colchetes. As seguintes opções de comando suportam filtros de replicação específicos de canal usando este formato:

- `--replicate-do-db=channel:database_id`

- `--replicate-ignore-db=channel:database_id`

- `--replicate-do-table=channel:table_id`

- `--replicate-ignore-table=channel:table_id`

- `--replicate-rewrite-db=channel:db1-db2`

- `--replicate-wild-do-table=channel:table pattern`

- `--replicate-wild-ignore-table=channel:table pattern`

Todas as opções listadas acima podem ser usadas no arquivo `my.cnf` da replica, assim como na maioria das outras opções de inicialização do servidor MySQL, omitindo as duas barras iniciais. Veja a seção "Visão geral dos filtros e canais de replicação" para um breve exemplo, bem como a seção 6.2.2.2, "Usando arquivos de opção".

Se você usar um ponto e vírgula, mas não especificar um `channel` para a opção de filtro, por exemplo `--replicate-do-db=:database_id`, a opção configura o filtro de replicação para o canal de replicação padrão. O canal de replicação padrão é o canal de replicação que sempre existe uma vez que a replicação tenha sido iniciada e difere dos canais de replicação de múltiplas fontes que você cria manualmente. Quando nem o ponto e vírgula nem um `channel` são especificados, a opção configura os filtros de replicação global, por exemplo, `--replicate-do-db=database_id` configura o filtro global `--replicate-do-db`.

Se você configurar várias opções `rewrite-db=from_name->to_name` com o mesmo banco de dados `from_name`, todos os filtros são somados (colocados na lista `rewrite_do`) e o primeiro deles entra em vigor.

O `pattern` usado para as opções `--replicate-wild-*-table` pode incluir quaisquer caracteres permitidos em identificadores, bem como os caracteres especiais `%` e `_`. Eles funcionam da mesma maneira quando usados com o operador `LIKE`; por exemplo, `tbl%` corresponde a qualquer nome de tabela que comece com `tbl`, e `tbl_` corresponde a qualquer nome de tabela que corresponda a `tbl` mais um caractere adicional.

##### Alterar filtros de replicação específicos de canal online

Além das opções `--replicate-*`, os filtros de replicação podem ser configurados usando a instrução `CHANGE REPLICATION FILTER`. Isso elimina a necessidade de reiniciar o servidor, mas o fio de SQL de replicação deve ser interrompido enquanto a alteração é feita. Para fazer com que essa instrução aplique o filtro a um canal específico, use a cláusula `FOR CHANNEL channel`. Por exemplo:

```
CHANGE REPLICATION FILTER REPLICATE_DO_DB=(db1) FOR CHANNEL channel_1;
```

Quando uma cláusula `FOR CHANNEL` é fornecida, a instrução atua nos filtros de replicação do canal especificado. Se forem especificados vários tipos de filtros (`do_db`, `do_ignore_table`, `wild_do_table` e assim por diante), apenas os tipos de filtro especificados são substituídos pela instrução. Em uma topologia de replicação com vários canais, por exemplo, em uma replica de múltiplos fontes, quando não é fornecida nenhuma cláusula `FOR CHANNEL`, a instrução atua nos filtros de replicação global e nos filtros de replicação de todos os canais, usando uma lógica semelhante à do caso `FOR CHANNEL`. Para mais informações, consulte a Seção 15.4.2.2, “Instrução de Mudança de Filtro de Replicação”.

##### Remover filtros de replicação específicos de canal

Quando os filtros de replicação específicos do canal foram configurados, você pode remover o filtro emitindo uma declaração de tipo de filtro vazio. Por exemplo, para remover todos os filtros `REPLICATE_REWRITE_DB` de um canal de replicação chamado `channel_1`, emita:

```
CHANGE REPLICATION FILTER REPLICATE_REWRITE_DB=() FOR CHANNEL channel_1;
```

Quaisquer filtros `REPLICATE_REWRITE_DB` previamente configurados, usando opções de comando ou `CHANGE REPLICATION FILTER`, são removidos.

A declaração `RESET REPLICA ALL` remove os filtros de replicação específicos de canal que foram definidos em canais excluídos pela declaração. Quando o canal ou canais excluídos são recriados, quaisquer filtros de replicação globais especificados para a replica são copiados para eles, e nenhum filtro de replicação específico de canal é aplicado.
