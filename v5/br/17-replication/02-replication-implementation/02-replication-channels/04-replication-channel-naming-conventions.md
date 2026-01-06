#### 16.2.2.4 Convenções de Nomenclatura de Canais de Replicação

Esta seção descreve como as convenções de nomenclatura são afetadas pelos canais de replicação.

Cada canal de replicação tem um nome único, que é uma string com um comprimento máximo de 64 caracteres e é case-insensitive. Como os nomes dos canais são usados em repositórios de metadados de replicação, o conjunto de caracteres usado para esses é sempre UTF-8. Embora você geralmente possa usar qualquer nome para os canais, os seguintes nomes estão reservados:

- `group_replication_applier`
- `grupo_replication_recovery`

O nome que você escolher para um canal de replicação também influencia os nomes dos arquivos usados por uma replica de várias fontes. Os arquivos de log de retransmissão e os arquivos de índice para cada canal são nomeados `relay_log_basename-channel.xxxxxx`, onde *`relay_log_basename`* é um nome base especificado usando a variável de sistema `relay_log` e *`channel`* é o nome do canal registrado neste arquivo. Se você não especificar a variável de sistema `relay_log`, um nome de arquivo padrão é usado que também inclui o nome do canal.
