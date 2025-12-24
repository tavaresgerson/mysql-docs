#### 7.4.2.2 Configuração padrão do destino do registo de erros

Esta seção descreve quais opções de servidor configuram o destino padrão do registro de erros, que pode ser o console ou um arquivo nomeado.

Nesta discussão, console significa `stderr`, a saída de erro padrão. Esta é a janela do seu terminal ou console, a menos que a saída de erro padrão tenha sido redirecionada para um destino diferente.

O servidor interpreta as opções que determinam o destino padrão do log de erros de forma um pouco diferente para sistemas Windows e Unix. Certifique-se de configurar o destino usando as informações apropriadas para sua plataforma. Depois que o servidor interpreta as opções de destino padrão do log de erros, ele define a variável do sistema `log_error` para indicar o destino padrão, o que afeta onde vários componentes do sink de log escrevem mensagens de erro. As seções seguintes abordam esses tópicos.

- Destino padrão do log de erro no Windows
- Destino do registo de erros padrão em sistemas Unix e similares a Unix
- Como o destino do log de erro padrão afeta os sinks de log

##### Destino padrão do log de erro no Windows

No Windows, `mysqld` usa as opções `--log-error`, `--pid-file`, e `--console` para determinar se o destino padrão do log de erros é o console ou um arquivo, e, se um arquivo, o nome do arquivo:

- Se `--console` for fornecido, o destino padrão é o console. (`--console` tem precedência sobre `--log-error` se ambos forem fornecidos, e os seguintes itens sobre `--log-error` não se aplicam.)
- Se `--log-error` não for dado, ou for dado sem nomear um arquivo, o destino padrão é um arquivo chamado `host_name.err` no diretório de dados, a menos que a opção `--pid-file` seja especificada. Nesse caso, o nome do arquivo é o nome do arquivo de base PID com um sufixo de `.err` no diretório de dados.
- Se `--log-error` é dado para nomear um arquivo, o destino padrão é esse arquivo (com um sufixo `.err` adicionado se o nome não tiver sufixo).

Se o destino padrão do registro de erros for o console, o servidor define a variável de sistema `log_error` como `stderr`.

##### Destino do registo de erros padrão em sistemas Unix e similares a Unix

Em sistemas Unix e Unix-like, `mysqld` usa a opção `--log-error` para determinar se o destino padrão do log de erros é o console ou um arquivo, e, se um arquivo, o nome do arquivo:

- Se `--log-error` não for fornecido, o destino padrão é o console.
- Se `--log-error` é dado sem nomear um arquivo, o destino padrão é um arquivo chamado `host_name.err` no diretório de dados.
- Se `--log-error` é dado para nomear um arquivo, o destino padrão é esse arquivo (com um sufixo `.err` adicionado se o nome não tiver sufixo).
- Se `--log-error` é dado em um arquivo de opção em uma `[mysqld]`, `[server]`, ou `[mysqld_safe]` seção, em sistemas que usam `mysqld_safe` para iniciar o servidor, `mysqld_safe` encontra e usa a opção, e passa para `mysqld`.

::: info Note

É comum que as instalações de pacotes Yum ou APT configurem um local de arquivo de registro de erros em `/var/log` com uma opção como `log-error=/var/log/mysqld.log` em um arquivo de configuração de servidor. Remover o nome do caminho da opção faz com que o arquivo `host_name.err` no diretório de dados seja usado.

:::

Se o destino padrão do registro de erros for o console, o servidor define a variável de sistema `log_error` como `stderr`.

##### Como o destino do log de erro padrão afeta os sinks de log

Depois que o servidor interpreta as opções de configuração de destino do registro de erros, ele define a variável do sistema `log_error` para indicar o destino de registro de erros padrão. Os componentes do sink de registro podem basear seu próprio destino de saída no valor `log_error` ou determinar seu destino independentemente do `log_error`.

Se `log_error` é `stderr`, o destino padrão do log de erro é o console, e os sinks de log que baseiam seu destino de saída no destino padrão também escrevem para o console:

- `log_sink_internal`, `log_sink_json`, `log_sink_test`: Esses sumidouros escrevem para o console. Isso é verdade mesmo para sumidouros como `log_sink_json` que podem ser habilitados várias vezes; todas as instâncias escrevem para o console.
- `log_sink_syseventlog`: Este sink escreve no log do sistema, independentemente do valor `log_error`.

Se `log_error` não for `stderr`, o destino padrão do log de erro é um arquivo e `log_error` indica o nome do arquivo.

- `log_sink_internal`, `log_sink_test`: Esses sumidouros escrevem para `file_name`.
- `log_sink_json`: As instâncias sucessivas deste sumidouro nomeadas no valor `log_error_services` escrevem para arquivos nomeados `file_name` mais um sufixo `.NN.json` numerado: `file_name.00.json`, `file_name.01.json`, e assim por diante.
- `log_sink_syseventlog`: Este sink escreve no log do sistema, independentemente do valor `log_error`.
