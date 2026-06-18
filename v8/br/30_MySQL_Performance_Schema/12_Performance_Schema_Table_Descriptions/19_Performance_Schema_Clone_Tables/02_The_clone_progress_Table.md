#### 29.12.19.2 A tabela clone\_progress

Nota

A tabela Schema de Desempenho descrita aqui está disponível a partir do MySQL 8.0.17.

A tabela `clone_progress` mostra informações de progresso apenas para a operação de clonagem atual ou a última executada.

As etapas de uma operação de clonagem incluem `DROP DATA`, `FILE COPY`, `PAGE_COPY`, `REDO_COPY`, `FILE_SYNC`, `RESTART` e `RECOVERY`. Uma operação de clonagem produz um registro para cada etapa. Portanto, a tabela contém apenas sete linhas de dados ou está vazia.

A tabela `clone_progress` tem essas colunas:

- `ID`

  Um identificador único de operação de clonagem na instância atual do servidor MySQL.

- `STAGE`

  O nome da etapa atual de clonagem. As etapas incluem `DROP DATA`, `FILE COPY`, `PAGE_COPY`, `REDO_COPY`, `FILE_SYNC`, `RESTART` e `RECOVERY`.

- `STATE`

  O estado atual da fase de clonagem. Os estados incluem `Not Started`, `In Progress` e `Completed`.

- `BEGIN_TIME`

  Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a fase de clonagem começou. Representa NULL se a fase não tiver começado.

- `END_TIME`

  Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a fase de clonagem terminou. Representa NULL se a fase não tiver terminado.

- `THREADS`

  O número de threads concorrentes usadas na etapa.

- `ESTIMATE`

  O valor estimado de dados para a etapa atual, em bytes.

- `DATA`

  A quantidade de dados transferidos no estado atual, em bytes.

- `NETWORK`

  A quantidade de dados de rede transferidos no estado atual, em bytes.

- `DATA_SPEED`

  A velocidade atual de transferência de dados, em bytes por segundo. Esse valor pode diferir da taxa máxima de transferência de dados solicitada definida por `clone_max_data_bandwidth`.

- `NETWORK_SPEED`

  A velocidade atual da transferência de rede em bytes por segundo.

A tabela `clone_progress` é de leitura somente. DDL, incluindo `TRUNCATE TABLE`, não é permitido.
