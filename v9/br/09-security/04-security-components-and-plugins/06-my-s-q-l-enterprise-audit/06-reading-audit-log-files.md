#### 8.4.6.6 Leitura de Arquivos de Registro de Auditoria

O plugin de registro de auditoria suporta funções que fornecem uma interface SQL para ler arquivos de registro de auditoria no formato JSON. (Essa capacidade não se aplica a arquivos de log escritos em outros formatos.)

Quando o plugin de registro de auditoria é inicializado e configurado para registro JSON, ele usa o diretório que contém o arquivo de registro de auditoria atual como local para procurar arquivos de registro de auditoria legíveis. O plugin determina a localização do arquivo, o nome base e o sufixo a partir do valor da variável de sistema `audit_log_file`, e então procura por arquivos com nomes que correspondem ao seguinte padrão, onde `[...]` indica partes opcionais do nome do arquivo:

```
basename[.timestamp].suffix[.gz][[.pwd_id].enc]
```

Se o nome do arquivo terminar com `.enc`, o arquivo está criptografado e a leitura de seu conteúdo não criptografado requer uma senha de descriptografia obtida do chaveiro. O plugin de registro de auditoria determina o ID do chaveiro da senha de descriptografia da seguinte forma:

* Se `.enc` é precedido por *`pwd_id`*, o ID do chaveiro é `audit_log-pwd_id`.

* Se `.enc` não é precedido por *`pwd_id`*, o arquivo tem um nome antigo antes que a senha de descriptografia do registro de auditoria fosse implementada. O ID do chaveiro é `audit_log`.

Para mais informações sobre arquivos de registro de auditoria criptografados, consulte Criptografar Arquivos de Registro de Auditoria.

O plugin ignora arquivos que foram renomeados manualmente e não correspondem ao padrão, e arquivos que foram criptografados com uma senha que não está mais disponível no chaveiro. O plugin abre cada arquivo candidato restante, verifica se o arquivo realmente contém eventos `JSON` de auditoria e ordena os arquivos usando os timestamps do primeiro evento de cada arquivo. O resultado é uma sequência de arquivos que estão sujeitos ao acesso usando as funções de leitura de log:

* `audit_log_read()` lê eventos do registro de auditoria ou fecha o processo de leitura.

* `audit_log_read_bookmark()` retorna um marcador para o evento de log de auditoria mais recentemente escrito. Esse marcador é adequado para ser passado para `audit_log_read()` para indicar onde começar a leitura.

`audit_log_read()` aceita um argumento opcional `JSON`, e o resultado retornado por uma chamada bem-sucedida a qualquer uma dessas funções é uma string `JSON`.

Para usar as funções para ler o log de auditoria, siga esses princípios:

* Chame `audit_log_read()` para ler eventos a partir de uma posição dada ou da posição atual, ou para fechar a leitura:

  + Para inicializar uma sequência de leitura de log de auditoria, passe um argumento que indique a posição em que começar. Uma maneira de fazer isso é passar o marcador retornado por `audit_log_read_bookmark()`:

    ```
    SELECT audit_log_read(audit_log_read_bookmark());
    ```

  + Para continuar lendo a partir da posição atual na sequência, chame `audit_log_read()` sem especificar uma posição:

    ```
    SELECT audit_log_read();
    ```

  + Para fechar explicitamente a sequência de leitura, passe um argumento `JSON` `null`:

    ```
    SELECT audit_log_read('null');
    ```

    Não é necessário fechar explicitamente a leitura. A leitura é fechada implicitamente quando a sessão termina ou uma nova sequência de leitura é iniciada chamando `audit_log_read()` com um argumento que indique a posição em que começar.

* Uma chamada bem-sucedida a `audit_log_read()` para ler eventos retorna uma string `JSON` contendo um array de eventos de auditoria:

  + Se o valor final do array retornado não for um valor `JSON` `null`, há mais eventos após os que foram lidos e `audit_log_read()` pode ser chamado novamente para ler mais deles.

  + Se o valor final do array retornado for um valor `JSON` `null`, não há mais eventos para serem lidos na sequência de leitura atual.

Cada elemento de array não `null` é um evento representado como um hash `JSON`. Por exemplo:

```
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

Para obter mais informações sobre o conteúdo dos eventos de auditoria no formato JSON, consulte o Formato de Arquivo de Registro de Auditoria JSON.

* Uma chamada `audit_log_read()` para ler eventos que não especifica uma posição produz um erro em qualquer uma dessas condições:

  + Uma sequência de leitura ainda não foi iniciada passando uma posição para `audit_log_read()`.

  + Não restam mais eventos para serem lidos na sequência de leitura atual; ou seja, `audit_log_read()` anteriormente retornou um array que termina com um valor `JSON` `null`.

  + A sequência de leitura mais recente foi fechada passando um valor `JSON` `null` para `audit_log_read()`.

Para ler eventos nessas condições, é necessário primeiro inicializar uma sequência de leitura chamando `audit_log_read()` com um argumento que especifique uma posição.

Para especificar uma posição para `audit_log_read()`, inclua um argumento que indique onde começar a leitura. Por exemplo, passe um marcador, que é um hash `JSON` contendo elementos `timestamp` e `id` que identificam de forma única um evento particular. Aqui está um exemplo de marcador, obtido chamando a função `audit_log_read_bookmark()`:

```
mysql> SELECT audit_log_read_bookmark();
+-------------------------------------------------+
| audit_log_read_bookmark()                       |
+-------------------------------------------------+
| { "timestamp": "2020-05-18 21:03:44", "id": 0 } |
+-------------------------------------------------+
```

Passar o marcador atual para `audit_log_read()` inicia a leitura de eventos a partir da posição do marcador:

```
mysql> SELECT audit_log_read(audit_log_read_bookmark());
+-----------------------------------------------------------------------+
| audit_log_read(audit_log_read_bookmark())                             |
+-----------------------------------------------------------------------+
| [ {"timestamp":"2020-05-18 22:41:24","id":0,"class":"connection", ... |
+-----------------------------------------------------------------------+
```

O argumento para `audit_log_read()` é opcional. Se presente, pode ser um valor `JSON` `null` para fechar a sequência de leitura, ou um hash `JSON`.

Dentro de um argumento hash para `audit_log_read()`, os itens são opcionais e controlam aspectos da operação de leitura, como a posição em que começar a leitura ou quantos eventos ler. Os seguintes itens são significativos (outros itens são ignorados):

* `start`: A posição dentro do log de auditoria do primeiro evento a ser lido. A posição é fornecida como um timestamp e a leitura começa a partir do primeiro evento que ocorre no ou após o valor do timestamp. O item `start` tem este formato, onde *`valor`* é um valor literal de timestamp:

  ```
  "start": { "timestamp": "value" }
  ```

* `timestamp`, `id`: A posição dentro do log de auditoria do primeiro evento a ser lido. Os itens `timestamp` e `id` juntos compõem um marcador que identifica de forma única um evento particular. Se um argumento `audit_log_read()` incluir qualquer um desses itens, ele deve incluir ambos para especificar completamente uma posição ou ocorrerá um erro.

* `max_array_length`: O número máximo de eventos a serem lidos do log. Se esse item for omitido, o padrão é ler até o final do log ou até que o buffer de leitura esteja cheio, o que ocorrer primeiro.

Para especificar uma posição de início para `audit_log_read()`, passe um argumento hash que inclua o item `start` ou um marcador composto pelos itens `timestamp` e `id`. Se um argumento hash incluir tanto um item `start` quanto um marcador, ocorrerá um erro.

Se um argumento hash especificar nenhuma posição de início, a leitura continua a partir da posição atual.

Se um valor de timestamp não incluir nenhuma parte de hora, uma parte de hora de `00:00:00` é assumida.

Exemplos de argumentos aceitos por `audit_log_read()`:

* Ler eventos que começam com o primeiro evento que ocorre no ou após o timestamp fornecido:

  ```
  audit_log_read('{ "start": { "timestamp": "2020-05-24 12:30:00" } }')
  ```

* Como o exemplo anterior, mas ler no máximo 3 eventos:

  ```
  audit_log_read('{ "start": { "timestamp": "2020-05-24 12:30:00" }, "max_array_length": 3 }')
  ```

* Ler eventos que começam com o primeiro evento que ocorre no ou após `2020-05-24 00:00:00` (o timestamp não inclui nenhuma parte de hora, então `00:00:00` é assumido):

  ```
  audit_log_read('{ "start": { "timestamp": "2020-05-24" } }')
  ```

* Ler eventos que começam com o evento que tem o timestamp exato e o ID do evento:

  ```
  audit_log_read('{ "timestamp": "2020-05-24 12:30:00", "id": 0 }')
  ```

* Como no exemplo anterior, mas leia no máximo 3 eventos:

  ```
  audit_log_read('{ "timestamp": "2020-05-24 12:30:00", "id": 0, "max_array_length": 3 }')
  ```

* Leia eventos a partir da posição atual na sequência de leitura:

  ```
  audit_log_read()
  ```

* Leia no máximo 5 eventos a partir da posição atual na sequência de leitura:

  ```
  audit_log_read('{ "max_array_length": 5 }')
  ```

* Feche a sequência de leitura atual:

  ```
  audit_log_read('null')
  ```

Uma string `JSON` retornada por qualquer função de leitura de log pode ser manipulada conforme necessário. Suponha que uma chamada para obter um marcador produza este valor:

```
mysql> SET @mark := audit_log_read_bookmark();
mysql> SELECT @mark;
+-------------------------------------------------+
| @mark                                           |
+-------------------------------------------------+
| { "timestamp": "2020-05-18 16:10:28", "id": 2 } |
+-------------------------------------------------+
```

Chamar `audit_log_read()` com esse argumento pode retornar vários eventos. Para limitar `audit_log_read()` a ler no máximo *`N`* eventos, adicione à string um item `max_array_length` com esse valor. Por exemplo, para ler um único evento, modifique a string da seguinte forma:

```
mysql> SET @mark := JSON_SET(@mark, '$.max_array_length', 1);
mysql> SELECT @mark;
+----------------------------------------------------------------------+
| @mark                                                                |
+----------------------------------------------------------------------+
| {"id": 2, "timestamp": "2020-05-18 16:10:28", "max_array_length": 1} |
+----------------------------------------------------------------------+
```

A string modificada, quando passada para `audit_log_read()`, produz um resultado contendo no máximo um evento, independentemente de quantos estejam disponíveis.

Se uma função de log de auditoria for invocada dentro do cliente **mysql**, os resultados em string binária são exibidos usando notação hexadecimal, dependendo do valor da variável `--binary-as-hex`. Para obter mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando do MySQL”.

Para definir um limite no número de bytes que `audit_log_read()` lê, defina a variável de sistema `audit_log_read_buffer_size`. Essa variável tem um valor padrão de 32KB e pode ser definida em tempo de execução. Cada cliente deve definir seu valor de sessão de `audit_log_read_buffer_size` de forma apropriada para seu uso de `audit_log_read()`.

Cada chamada para `audit_log_read()` retorna tantos eventos disponíveis quanto cabem no tamanho do buffer. Eventos que não cabem dentro do tamanho do buffer são ignorados e geram avisos. Dadas essas características, considere esses fatores ao avaliar o tamanho adequado do buffer para uma aplicação:

* Há um compromisso entre o número de chamadas à `audit_log_read()` e os eventos retornados por chamada:

  + Com um tamanho de buffer menor, as chamadas retornam menos eventos, então são necessárias mais chamadas.

  + Com um tamanho de buffer maior, as chamadas retornam mais eventos, então são necessárias menos chamadas.

* Com um tamanho de buffer menor, como o tamanho padrão de 32 KB, há uma maior chance de os eventos ultrapassarem o tamanho do buffer e, assim, serem ignorados.

Para obter informações adicionais sobre as funções de leitura de log de auditoria, consulte Funções de Log de Auditoria.