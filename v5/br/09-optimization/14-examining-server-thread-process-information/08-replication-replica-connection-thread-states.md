### 8.14.8 Estados de Conexão de Replicação de Fila de Conexão de Replicação

Estes estados de fio ocorrem em um servidor de replicação, mas estão associados a threads de conexão, e não a threads de E/S ou SQL.

- `Mudar mestre`

  O fio está processando uma declaração `CHANGE MASTER TO`.

- "Assassinar escravo"

  O fio está processando uma declaração `STOP SLAVE`.

- `Abrir a tabela mestre do dump`

  Esse estado ocorre após a criação da tabela a partir do backup mestre.

- `Ler dados da tabela mestre de dump`

  Esse estado ocorre após a "Abertura da tabela de dump mestre".

- `Reestruturar o índice na tabela de descargas mestre`

  Esse estado ocorre após a leitura dos dados da tabela de dump mestre.
