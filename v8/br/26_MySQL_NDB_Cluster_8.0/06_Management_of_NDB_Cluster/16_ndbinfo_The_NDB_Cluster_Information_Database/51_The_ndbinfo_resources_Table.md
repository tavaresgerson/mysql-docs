#### 25.6.16.51 A tabela de recursos ndbinfo

Esta tabela fornece informações sobre a disponibilidade e o uso dos recursos do nó de dados.

Esses recursos são, por vezes, conhecidos como super-pools.

A tabela `resources` contém as seguintes colunas:

- `node_id`

  O ID único do nó deste nó de dados.

- `resource_name`

  Nome do recurso; veja o texto.

- `reserved`

  O valor reservado para este recurso, em número de páginas de 32 KB.

- `used`

  O valor realmente utilizado por este recurso, como número de páginas de 32 KB.

- `max`

  O valor máximo (número de páginas de 32 KB) deste recurso disponível para este nó de dados.

##### Notas

O `resource_name` pode ser qualquer um dos nomes mostrados na tabela a seguir:

- `RESERVED`: Reservado pelo sistema; não pode ser sobrescrito.

- `TRANSACTION_MEMORY`: Memória alocada para transações neste nó de dados. No NDB 8.0.19 e versões posteriores, isso pode ser controlado usando o parâmetro de configuração `TransactionMemory`.

- `DISK_OPERATIONS`: Se um grupo de arquivo de registro for alocado, o tamanho do buffer do log de desfazer é usado para definir o tamanho deste recurso. Este recurso é usado apenas para alocar o buffer do log de desfazer para um grupo de arquivo de log de desfazer; pode haver apenas um grupo desse tipo. A sobrealocção ocorre conforme necessário por `CREATE LOGFILE GROUP`.

- `DISK_RECORDS`: Registros alocados para operações de dados do disco.

- `DATA_MEMORY`: Usado para tuplas de memória principal, índices e índices de hash. Soma de DataMemory e IndexMemory, mais 8 páginas de 32 KB cada, se o IndexMemory tiver sido definido. Não pode ser sobrealocionado.

- `JOBBUFFER`: Usado para alocar buffers de trabalho pelo planejador NDB; não pode ser sobrealocionado. Isso é aproximadamente 2 MB por thread, mais um buffer de 1 MB em ambas as direções para todos os threads que podem se comunicar. Para configurações grandes, isso consome vários GB.

- `FILE_BUFFERS`: Usado pelo manipulador do log de refazer no bloco do kernel `DBLQH`; não pode ser sobredimensionado. O tamanho é `NoOfFragmentLogParts` \* `RedoBuffer`, mais 1 MB por parte do arquivo de log.

- `TRANSPORTER_BUFFERS`: Usado para buffers de envio por \*\*ndbmtd"); a soma de `TotalSendBufferMemory` e `ExtraSendBufferMemory`. Este recurso pode ser sobrealocável em até 25 por cento. `TotalSendBufferMemory` é calculado somando a memória do buffer de envio por nó, cujo valor padrão é de 2 MB. Assim, em um sistema com quatro nós de dados e oito nós de API, os nós de dados têm 12 \* 2 MB de memória do buffer de envio. `ExtraSendBufferMemory` é usado por \*\*ndbmtd") e equivale a 2 MB de memória extra por thread. Assim, com 4 threads LDM, 2 threads TC, 1 thread principal, 1 thread de replicação e 2 threads de recebimento, `ExtraSendBufferMemory` é 10 \* 2 MB. A sobrealocar deste recurso pode ser realizada definindo o parâmetro de configuração do nó de dados `SharedGlobalMemory`.

- `DISK_PAGE_BUFFER`: Usado para o buffer de página de disco; determinado pelo parâmetro de configuração `DiskPageBufferMemory`. Não pode ser sobrealocionado.

- `QUERY_MEMORY`: Usado pelo bloco de kernel `DBSPJ`.

- `SCHEMA_TRANS_MEMORY`: O mínimo é de 2 MB; pode ser sobrealocionado para usar qualquer memória disponível restante.
