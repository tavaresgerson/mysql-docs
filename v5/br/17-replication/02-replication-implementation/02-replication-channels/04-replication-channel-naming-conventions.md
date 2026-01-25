#### 16.2.2.4 Convenções de Nomenclatura para Canais de Replicação

Esta seção descreve como as convenções de nomenclatura são afetadas pelos canais de replicação.

Cada canal de replicação possui um nome exclusivo, que é uma string com um comprimento máximo de 64 caracteres e não diferencia maiúsculas de minúsculas (case-insensitive). Como os nomes dos canais são utilizados em repositórios de metadata de replicação, o character set usado para eles é sempre UTF-8. Embora você seja geralmente livre para usar qualquer nome para os canais, os seguintes nomes são reservados:

* `group_replication_applier`
* `group_replication_recovery`

O nome que você escolhe para um canal de replicação também influencia os nomes de arquivo usados por uma replica multi-source. Os arquivos Relay Log e Index Files para cada canal são nomeados `relay_log_basename-channel.xxxxxx`, onde *`relay_log_basename`* é um nome base especificado usando a System Variable [`relay_log`](replication-options-replica.html#sysvar_relay_log), e *`channel`* é o nome do canal logado neste arquivo. Se você não especificar a System Variable [`relay_log`](replication-options-replica.html#sysvar_relay_log), um nome de arquivo padrão é usado que também inclui o nome do canal.