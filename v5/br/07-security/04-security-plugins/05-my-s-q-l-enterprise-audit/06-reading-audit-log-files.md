#### 6.4.5.6 Leitura de arquivos de registro de auditoria

O plugin de registro de auditoria suporta funções que fornecem uma interface SQL para ler arquivos de registro de auditoria no formato JSON. (Essa capacidade não se aplica a arquivos de log escritos em outros formatos.)

Quando o plugin de registro de auditoria é inicializado e configurado para registro JSON, ele usa o diretório que contém o arquivo de registro de auditoria atual como local para procurar arquivos de registro de auditoria legíveis. O plugin determina a localização do arquivo, o nome base e o sufixo a partir do valor da variável de sistema `audit_log_file`, e então procura por arquivos com nomes que correspondem ao seguinte padrão, onde `[...]` indica partes opcionais do nome do arquivo:

```sql
basename[.timestamp].suffix[.gz][.enc]
```

Se o nome do arquivo terminar com `.enc`, o arquivo está criptografado e a leitura de seu conteúdo não criptografado requer uma senha de descriptografia obtida do chaveiro. Para obter mais informações sobre arquivos de registro de auditoria criptografados, consulte Criptografar arquivos de registro de auditoria.

O plugin ignora arquivos que foram renomeados manualmente e não correspondem ao padrão, e arquivos que foram criptografados com uma senha que não está mais disponível no chaveiro. O plugin abre cada arquivo candidato restante, verifica se o arquivo realmente contém eventos de auditoria `JSON` e ordena os arquivos usando os timestamps do primeiro evento de cada arquivo. O resultado é uma sequência de arquivos que estão sujeitos ao acesso usando as funções de leitura de log:

- `audit_log_read()` lê eventos do log de auditoria ou fecha o processo de leitura.

- `audit_log_read_bookmark()` retorna um marcador para o evento de registro de auditoria mais recentemente escrito. Esse marcador é adequado para ser passado para `audit_log_read()` para indicar onde começar a leitura.

`audit_log_read()` aceita um argumento opcional de string `JSON`, e o resultado retornado de uma chamada bem-sucedida a qualquer uma dessas funções é uma string `JSON`.

Para usar as funções para ler o log de auditoria, siga esses princípios:

- Chame `audit_log_read()` para ler eventos a partir de uma posição específica ou da posição atual, ou para encerrar a leitura:

  - Para inicializar uma sequência de leitura de log de auditoria, passe um argumento que indique a posição a partir da qual deseja começar. Uma maneira de fazer isso é passar o marcador retornado por `audit_log_read_bookmark()`:

    ```sql
    SELECT audit_log_read(audit_log_read_bookmark());
    ```

  - Para continuar lendo a partir da posição atual na sequência, chame `audit_log_read()` sem especificar nenhuma posição:

    ```sql
    SELECT audit_log_read();
    ```

  - Para fechar explicitamente a sequência de leitura, passe um argumento `null` de `JSON` (json.html):

    ```sql
    SELECT audit_log_read('null');
    ```

    Não é necessário fechar a leitura explicitamente. A leitura é fechada implicitamente quando a sessão termina ou uma nova sequência de leitura é iniciada chamando `audit_log_read()` com um argumento que indica a posição a partir da qual se deve começar.

- Uma chamada bem-sucedida para `audit_log_read()` para ler eventos retorna uma string de `JSON` contendo um array de eventos de auditoria:

  - Se o valor final da matriz retornada não for um valor `null` de `JSON` ([json.html]), há mais eventos após os que foram lidos e `audit_log_read()` ([audit-log-reference.html#function_audit-log-read]) pode ser chamado novamente para lê-los.

  - Se o valor final da matriz retornada for um valor `null` de tipo `JSON` (json.html), não há mais eventos para serem lidos na sequência atual de leitura.

  Cada elemento de array que não seja `null` é um evento representado como um hash em formato `JSON` (json.html). Por exemplo:

  ```sql
  [
    {
      "timestamp": "2020-05-18 13:39:33", "id": 0,
      "class": "connection", "event": "connect",
      ...
    },
    {
      "timestamp": "2020-05-18 13:39:33", "id": 1,
      "class": "general", "event": "status",
      ...
    },
    {
      "timestamp": "2020-05-18 13:39:33", "id": 2,
      "class": "connection", "event": "disconnect",
      ...
    },
    null
  ]
  ```

  Para obter mais informações sobre o conteúdo dos eventos de auditoria no formato JSON, consulte Formato de arquivo de registro de auditoria JSON.

- Uma chamada `audit_log_read()` para ler eventos que não especifica uma posição produz um erro em qualquer uma dessas condições:

  - Uma sequência de leitura ainda não foi iniciada ao passar uma posição para `audit_log_read()`.

  - Não há mais eventos para serem lidos na sequência atual de leitura; ou seja, `audit_log_read()` retornou anteriormente um array que termina com um valor `null` de `JSON` (`json.html`).

  - A sequência de leitura mais recente foi encerrada ao passar um valor `null` de `JSON` para `audit_log_read()` (`audit-log-reference.html#function_audit-log-read`).

  Para ler eventos nessas condições, é necessário inicializar uma sequência de leitura chamando `audit_log_read()` com um argumento que especifique uma posição.

Para especificar uma posição para `audit_log_read()`, passe um marcador, que é um hash de `JSON` (json.html) contendo os elementos `timestamp` e `id` que identificam de forma única um evento específico. Aqui está um exemplo de marcador, obtido ao chamar a função `audit_log_read_bookmark()`:

```sql
mysql> SELECT audit_log_read_bookmark();
+-------------------------------------------------+
| audit_log_read_bookmark()                       |
+-------------------------------------------------+
| { "timestamp": "2020-05-18 21:03:44", "id": 0 } |
+-------------------------------------------------+
```

A passagem do marcador atual para `audit_log_read()` inicia a leitura de eventos a partir da posição do marcador:

```sql
mysql> SELECT audit_log_read(audit_log_read_bookmark());
+-----------------------------------------------------------------------+
| audit_log_read(audit_log_read_bookmark())                             |
+-----------------------------------------------------------------------+
| [ {"timestamp":"2020-05-18 22:41:24","id":0,"class":"connection", ... |
+-----------------------------------------------------------------------+
```

O argumento de `audit_log_read()` é opcional. Se presente, pode ser um valor `null` de `JSON` para fechar a sequência de leitura ou um hash de `JSON`.

Dentro de um argumento hash para `audit_log_read()`, os itens são opcionais e controlam aspectos da operação de leitura, como a posição em que começar a ler ou quantos eventos ler. Os seguintes itens são significativos (outros itens são ignorados):

- `timestamp`, `id`: A posição dentro do log de auditoria do primeiro evento a ser lido. Se a posição for omitida do argumento, a leitura continua a partir da posição atual. Os itens `timestamp` e `id` juntos compõem um marcador que identifica de forma única um evento específico. Se um argumento de `audit_log_read()` incluir qualquer um desses itens, ele deve incluir ambos para especificar completamente uma posição, caso contrário, ocorrerá um erro.

- `max_array_length`: O número máximo de eventos a serem lidos do log. Se este item for omitido, o padrão é ler até o final do log ou até que o buffer de leitura esteja cheio, o que ocorrer primeiro.

Exemplos de argumentos aceitos por `audit_log_read()`:

- Leia eventos que começam com o evento que tem o horário exato e o ID do evento:

  ```sql
  audit_log_read('{ "timestamp": "2020-05-24 12:30:00", "id": 0 }')
  ```

- Como o exemplo anterior, mas leia no máximo 3 eventos:

  ```sql
  audit_log_read('{ "timestamp": "2020-05-24 12:30:00", "id": 0, "max_array_length": 3 }')
  ```

- Leia eventos a partir da posição atual na sequência de leitura:

  ```sql
  audit_log_read()
  ```

- Leia no máximo 5 eventos que começam na posição atual na sequência de leitura:

  ```sql
  audit_log_read('{ "max_array_length": 5 }')
  ```

- Fechar a sequência de leitura atual:

  ```sql
  audit_log_read('null')
  ```

Para usar a string binária `JSON` com funções que exigem uma string não binária (como funções que manipulam valores de `JSON`), realize uma conversão para `utf8mb4`. Suponha que uma chamada para obter um marcador produza esse valor:

```sql
mysql> SET @mark := audit_log_read_bookmark();
mysql> SELECT @mark;
+-------------------------------------------------+
| @mark                                           |
+-------------------------------------------------+
| { "timestamp": "2020-05-18 16:10:28", "id": 2 } |
+-------------------------------------------------+
```

Chamar `audit_log_read()` com esse argumento pode retornar vários eventos. Para limitar `audit_log_read()` para ler no máximo *`N`* eventos, converta a string para `utf8mb4`, depois adicione ao mesmo um item `max_array_length` com esse valor. Por exemplo, para ler um único evento, modifique a string da seguinte forma:

```sql
mysql> SET @mark = CONVERT(@mark USING utf8mb4);
mysql> SET @mark := JSON_SET(@mark, '$.max_array_length', 1);
mysql> SELECT @mark;
+----------------------------------------------------------------------+
| @mark                                                                |
+----------------------------------------------------------------------+
| {"id": 2, "timestamp": "2020-05-18 16:10:28", "max_array_length": 1} |
+----------------------------------------------------------------------+
```

A string modificada, quando passada para `audit_log_read()`, produz um resultado contendo no máximo um evento, independentemente de quantos estejam disponíveis.

Para ler um número específico de eventos a partir da posição atual, passe um hash `JSON` que inclua um valor `max_array_length`, mas não uma posição. Essa declaração é invocada repetidamente e retorna cinco eventos cada vez, até que não haja mais eventos disponíveis:

```sql
SELECT audit_log_read('{"max_array_length": 5}');
```

Para definir um limite para o número de bytes que a função `audit_log_read()` lê, defina a variável de sistema `audit_log_read_buffer_size`. A partir do MySQL 5.7.23, essa variável tem um valor padrão de 32 KB e pode ser definida em tempo de execução. Cada cliente deve definir o valor de sessão de `audit_log_read_buffer_size` de forma apropriada para o uso da função `audit_log_read()`. Antes do MySQL 5.7.23, `audit_log_read_buffer_size` tem um valor padrão de 1 MB, afeta todos os clientes e pode ser alterado apenas na inicialização do servidor.

Para obter informações adicionais sobre as funções de leitura do log de auditoria, consulte Funções de Log de Auditoria.
