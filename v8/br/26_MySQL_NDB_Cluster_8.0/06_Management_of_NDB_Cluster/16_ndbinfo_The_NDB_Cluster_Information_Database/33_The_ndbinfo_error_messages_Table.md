#### 25.6.16.33 Tabela de mensagens de erro ndbinfo\_messages

A tabela `error_messages` fornece informações sobre

A tabela `error_messages` contém as seguintes colunas:

- `error_code`

  Código de erro numérico

- `error_description`

  Descrição do erro

- `error_status`

  Código de status de erro

- `error_classification`

  Código de classificação de erro

##### Notas

`error_code` é um código de erro numérico do NDB. Este é o mesmo código de erro que pode ser fornecido ao **ndb\_perror**.

`error_description` fornece uma descrição básica da condição que está causando o erro.

A coluna `error_status` fornece informações de status relacionadas ao erro. Os valores possíveis para esta coluna estão listados aqui:

- `No error`

- `Illegal connect string`

- `Illegal server handle`

- `Illegal reply from server`

- `Illegal number of nodes`

- `Illegal node status`

- `Out of memory`

- `Management server not connected`

- `Could not connect to socket`

- `Start failed`

- `Stop failed`

- `Restart failed`

- `Could not start backup`

- `Could not abort backup`

- `Could not enter single user mode`

- `Could not exit single user mode`

- `Failed to complete configuration change`

- `Failed to get configuration`

- `Usage error`

- `Success`

- `Permanent error`

- `Temporary error`

- `Unknown result`

- `Temporary error, restart node`

- `Permanent error, external action needed`

- `Ndbd file system error, restart node initial`

- `Unknown`

A coluna error\_classification mostra a classificação do erro. Consulte Classificações de Erros do NDB para obter informações sobre os códigos de classificação e seus significados.
