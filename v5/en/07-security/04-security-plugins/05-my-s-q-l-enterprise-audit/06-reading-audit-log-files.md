#### 6.4.5.6 Lendo Arquivos de Audit Log

O plugin de audit log suporta funções que fornecem uma interface SQL para leitura de arquivos de audit log em formato JSON. (Essa capacidade não se aplica a arquivos log escritos em outros formatos.)

Quando o plugin de audit log inicializa e está configurado para logging JSON, ele usa o diretório que contém o arquivo de audit log atual como o local para pesquisar arquivos de audit log legíveis. O plugin determina o local do arquivo, o nome base (base name) e o sufixo a partir do valor da System Variable [`audit_log_file`](audit-log-reference.html#sysvar_audit_log_file) e, em seguida, procura arquivos com nomes que correspondam ao seguinte padrão, onde `[...]` indica partes opcionais do nome do arquivo:

```sql
basename[.timestamp].suffix[.gz][.enc]
```

Se um nome de arquivo terminar com `.enc`, o arquivo está criptografado e a leitura de seu conteúdo não criptografado requer uma senha de decriptografia obtida do keyring. Para mais informações sobre arquivos de audit log criptografados, veja [Encrypting Audit Log Files](audit-log-logging-configuration.html#audit-log-file-encryption "Encrypting Audit Log Files").

O plugin ignora arquivos que foram renomeados manualmente e não correspondem ao padrão, e arquivos que foram criptografados com uma senha que não está mais disponível no keyring. O plugin abre cada arquivo candidato restante, verifica se o arquivo realmente contém audit events em [`JSON`](json.html "11.5 The JSON Data Type") e classifica os arquivos usando os timestamps do primeiro event de cada arquivo. O resultado é uma sequência de arquivos sujeitos a acesso usando as funções de leitura de log:

* [`audit_log_read()`](audit-log-reference.html#function_audit-log-read) lê events do audit log ou encerra o processo de leitura.

* [`audit_log_read_bookmark()`](audit-log-reference.html#function_audit-log-read-bookmark) retorna um bookmark para o audit log event escrito mais recentemente. Este bookmark é adequado para ser passado a [`audit_log_read()`](audit-log-reference.html#function_audit-log-read) para indicar onde começar a leitura.

A função [`audit_log_read()`](audit-log-reference.html#function_audit-log-read) aceita um argumento opcional de string [`JSON`](json.html "11.5 The JSON Data Type"), e o resultado retornado de uma chamada bem-sucedida a qualquer uma das funções é uma string [`JSON`](json.html "11.5 The JSON Data Type").

Para usar as funções para ler o audit log, siga estes princípios:

* Chame [`audit_log_read()`](audit-log-reference.html#function_audit-log-read) para ler events começando de uma determinada posição ou da posição atual, ou para fechar a leitura:

  + Para inicializar uma sequência de leitura do audit log, passe um argumento que indique a posição na qual começar. Uma maneira de fazer isso é passar o bookmark retornado por [`audit_log_read_bookmark()`](audit-log-reference.html#function_audit-log-read-bookmark):

    ```sql
    SELECT audit_log_read(audit_log_read_bookmark());
    ```

  + Para continuar lendo a partir da posição atual na sequência, chame [`audit_log_read()`](audit-log-reference.html#function_audit-log-read) sem especificar a posição:

    ```sql
    SELECT audit_log_read();
    ```

  + Para fechar explicitamente a sequência de leitura, passe um argumento `null` em [`JSON`](json.html "11.5 The JSON Data Type"):

    ```sql
    SELECT audit_log_read('null');
    ```

    Não é necessário fechar a leitura explicitamente. A leitura é fechada implicitamente quando a session termina ou uma nova sequência de leitura é inicializada chamando [`audit_log_read()`](audit-log-reference.html#function_audit-log-read) com um argumento que indica a posição na qual começar.

* Uma chamada bem-sucedida a [`audit_log_read()`](audit-log-reference.html#function_audit-log-read) para ler events retorna uma string [`JSON`](json.html "11.5 The JSON Data Type") contendo um array de audit events:

  + Se o valor final do array retornado não for um valor `null` em [`JSON`](json.html "11.5 The JSON Data Type"), há mais events seguindo aqueles que acabaram de ser lidos e [`audit_log_read()`](audit-log-reference.html#function_audit-log-read) pode ser chamado novamente para ler mais deles.

  + Se o valor final do array retornado for um valor `null` em [`JSON`](json.html "11.5 The JSON Data Type"), não há mais events restantes para serem lidos na sequência de leitura atual.

  Cada elemento non-`null` do array é um event representado como um hash [`JSON`](json.html "11.5 The JSON Data Type"). Por exemplo:

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

  Para mais informações sobre o conteúdo dos audit events em formato JSON, veja [JSON Audit Log File Format](audit-log-file-formats.html#audit-log-file-json-format "JSON Audit Log File Format").

* Uma chamada a [`audit_log_read()`](audit-log-reference.html#function_audit-log-read) para ler events que não especifica uma posição produz um erro sob qualquer uma destas condições:

  + Uma sequência de leitura ainda não foi inicializada passando uma posição para [`audit_log_read()`](audit-log-reference.html#function_audit-log-read).

  + Não há mais events restantes para serem lidos na sequência de leitura atual; ou seja, [`audit_log_read()`](audit-log-reference.html#function_audit-log-read) retornou anteriormente um array terminando com um valor `null` em [`JSON`](json.html "11.5 The JSON Data Type").

  + A sequência de leitura mais recente foi fechada passando um valor `null` em [`JSON`](json.html "11.5 The JSON Data Type") para [`audit_log_read()`](audit-log-reference.html#function_audit-log-read).

  Para ler events sob essas condições, é necessário primeiro inicializar uma sequência de leitura chamando [`audit_log_read()`](audit-log-reference.html#function_audit-log-read) com um argumento que especifique uma posição.

Para especificar uma posição para [`audit_log_read()`](audit-log-reference.html#function_audit-log-read), passe um bookmark, que é um hash [`JSON`](json.html "11.5 The JSON Data Type") contendo elementos `timestamp` e `id` que identificam unicamente um event específico. Aqui está um exemplo de bookmark, obtido chamando a função [`audit_log_read_bookmark()`](audit-log-reference.html#function_audit-log-read-bookmark):

```sql
mysql> SELECT audit_log_read_bookmark();
+-------------------------------------------------+
| audit_log_read_bookmark()                       |
+-------------------------------------------------+
| { "timestamp": "2020-05-18 21:03:44", "id": 0 } |
+-------------------------------------------------+
```

Passar o bookmark atual para [`audit_log_read()`](audit-log-reference.html#function_audit-log-read) inicializa a leitura de events começando na posição do bookmark:

```sql
mysql> SELECT audit_log_read(audit_log_read_bookmark());
+-----------------------------------------------------------------------+
| audit_log_read(audit_log_read_bookmark())                             |
+-----------------------------------------------------------------------+
| [ {"timestamp":"2020-05-18 22:41:24","id":0,"class":"connection", ... |
+-----------------------------------------------------------------------+
```

O argumento para [`audit_log_read()`](audit-log-reference.html#function_audit-log-read) é opcional. Se presente, pode ser um valor `null` em [`JSON`](json.html "11.5 The JSON Data Type") para fechar a sequência de leitura, ou um hash [`JSON`](json.html "11.5 The JSON Data Type").

Dentro de um argumento hash para [`audit_log_read()`](audit-log-reference.html#function_audit-log-read), os itens são opcionais e controlam aspectos da operação de leitura, como a posição na qual começar a ler ou quantos events ler. Os seguintes itens são significativos (outros itens são ignorados):

* `timestamp`, `id`: A posição dentro do audit log do primeiro event a ser lido. Se a posição for omitida do argumento, a leitura continua a partir da posição atual. Os itens `timestamp` e `id` juntos compreendem um bookmark que identifica unicamente um event específico. Se um argumento para [`audit_log_read()`](audit-log-reference.html#function_audit-log-read) incluir um dos itens, ele deve incluir ambos para especificar completamente uma posição, ou um erro ocorrerá.

* `max_array_length`: O número máximo de events a serem lidos do log. Se este item for omitido, o default é ler até o final do log ou até que o read buffer esteja cheio, o que ocorrer primeiro.

Exemplos de argumentos aceitos por [`audit_log_read()`](audit-log-reference.html#function_audit-log-read):

* Ler events começando com o event que tem o timestamp e ID de event exatos:

  ```sql
  audit_log_read('{ "timestamp": "2020-05-24 12:30:00", "id": 0 }')
  ```

* Como no exemplo anterior, mas ler no máximo 3 events:

  ```sql
  audit_log_read('{ "timestamp": "2020-05-24 12:30:00", "id": 0, "max_array_length": 3 }')
  ```

* Ler events a partir da posição atual na sequência de leitura:

  ```sql
  audit_log_read()
  ```

* Ler no máximo 5 events começando na posição atual na sequência de leitura:

  ```sql
  audit_log_read('{ "max_array_length": 5 }')
  ```

* Fechar a sequência de leitura atual:

  ```sql
  audit_log_read('null')
  ```

Para usar a string [`JSON`](json.html "11.5 The JSON Data Type") binária com funções que exigem uma string não binária (como funções que manipulam valores [`JSON`](json.html "11.5 The JSON Data Type")), execute uma conversão para `utf8mb4`. Suponha que uma chamada para obter um bookmark produza este valor:

```sql
mysql> SET @mark := audit_log_read_bookmark();
mysql> SELECT @mark;
+-------------------------------------------------+
| @mark                                           |
+-------------------------------------------------+
| { "timestamp": "2020-05-18 16:10:28", "id": 2 } |
+-------------------------------------------------+
```

Chamar [`audit_log_read()`](audit-log-reference.html#function_audit-log-read) com esse argumento pode retornar múltiplos events. Para limitar [`audit_log_read()`](audit-log-reference.html#function_audit-log-read) à leitura de no máximo *`N`* events, converta a string para `utf8mb4` e, em seguida, adicione a ela um item `max_array_length` com esse valor. Por exemplo, para ler um único event, modifique a string da seguinte forma:

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

A string modificada, quando passada para [`audit_log_read()`](audit-log-reference.html#function_audit-log-read), produz um resultado contendo no máximo um event, independentemente de quantos estejam disponíveis.

Para ler um número específico de events começando na posição atual, passe um hash [`JSON`](json.html "11.5 The JSON Data Type") que inclua um valor `max_array_length`, mas sem posição. Esta instrução invocada repetidamente retorna cinco events a cada vez até que não haja mais events disponíveis:

```sql
SELECT audit_log_read('{"max_array_length": 5}');
```

Para definir um limite no número de bytes que [`audit_log_read()`](audit-log-reference.html#function_audit-log-read) lê, defina a System Variable [`audit_log_read_buffer_size`](audit-log-reference.html#sysvar_audit_log_read_buffer_size). A partir do MySQL 5.7.23, esta variável tem um default de 32KB e pode ser definida em tempo de execução (runtime). Cada client deve definir seu valor de session de [`audit_log_read_buffer_size`](audit-log-reference.html#sysvar_audit_log_read_buffer_size) de forma apropriada para seu uso de [`audit_log_read()`](audit-log-reference.html#function_audit-log-read). Antes do MySQL 5.7.23, [`audit_log_read_buffer_size`](audit-log-reference.html#sysvar_audit_log_read_buffer_size) tinha um default de 1MB, afetava todos os clients e só podia ser alterado na inicialização do server (server startup).

Para informações adicionais sobre as funções de leitura do audit log, veja [Audit Log Functions](audit-log-reference.html#audit-log-routines "Audit Log Functions").