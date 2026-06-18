#### 7.4.2.2 Configuração de destino do log de erro padrão

Esta seção descreve quais opções de servidor configuram o destino padrão do log de erro, que pode ser o console ou um arquivo nomeado. Também indica quais componentes de destino de log baseiam seu próprio destino de saída no destino padrão.

Nessa discussão, “console” significa `stderr`, a saída padrão de erro. Esse é o seu terminal ou janela de console, a menos que a saída padrão de erro tenha sido redirecionada para um destino diferente.

O servidor interpreta as opções que determinam o destino padrão do log de erros de maneira um pouco diferente para sistemas Windows e Unix. Certifique-se de configurar o destino usando as informações apropriadas para sua plataforma. Após o servidor interpretar as opções de destino padrão do log de erros, ele define a variável de sistema `log_error` para indicar o destino padrão, o que afeta onde vários componentes de destino de log escrevem mensagens de erro. As seções a seguir abordam esses tópicos.

- Destino padrão do log de erros no Windows
- Destino padrão do log de erros no Unix e sistemas semelhantes
- Como o destino padrão do log de erro afeta os pontos de destino do log

##### Destino padrão do log de erros no Windows

No Windows, o **mysqld** usa as opções `--log-error`, `--pid-file` e `--console` para determinar se o destino padrão do log de erro é o console ou um arquivo, e, se for um arquivo, o nome do arquivo:

- Se `--console` for fornecido, o destino padrão é o console. (`--console` tem precedência sobre `--log-error` se ambos forem fornecidos, e os seguintes itens sobre `--log-error` não se aplicam.)

- Se `--log-error` não for fornecido ou for fornecido sem nomear um arquivo, o destino padrão é um arquivo chamado `host_name.err` no diretório de dados, a menos que a opção `--pid-file` seja especificada. Nesse caso, o nome do arquivo é o nome de base do arquivo PID com um sufixo de `.err` no diretório de dados.

- Se `--log-error` for fornecido para nomear um arquivo, o destino padrão é esse arquivo (com um sufixo `.err` adicionado se o nome não tiver sufixo). A localização do arquivo está sob o diretório de dados, a menos que um nome de caminho absoluto seja fornecido para especificar uma localização diferente.

Se o destino padrão do log de erros for o console, o servidor define a variável de sistema `log_error` para `stderr`. Caso contrário, o destino padrão é um arquivo e o servidor define `log_error` com o nome do arquivo.

##### Destino padrão do log de erros no Unix e sistemas semelhantes

Nos sistemas Unix e Unix-like, o **mysqld** usa a opção `--log-error` para determinar se o destino padrão do log de erros é a consola ou um ficheiro, e, se for um ficheiro, o nome do ficheiro:

- Se `--log-error` não for fornecido, o destino padrão é o console.

- Se `--log-error` for fornecido sem nomear um arquivo, o destino padrão é um arquivo chamado `host_name.err` no diretório de dados.

- Se `--log-error` for fornecido para nomear um arquivo, o destino padrão é esse arquivo (com um sufixo `.err` adicionado se o nome não tiver sufixo). A localização do arquivo está sob o diretório de dados, a menos que um nome de caminho absoluto seja fornecido para especificar uma localização diferente.

- Se `--log-error` for fornecido em um arquivo de opções em uma seção de `[mysqld]`, `[server]` ou `[mysqld_safe]`, em sistemas que usam **mysqld\_safe** para iniciar o servidor, o **mysqld\_safe** encontra e usa a opção e a passa para o **mysqld**.

Nota

É comum que as instalações de pacotes Yum ou APT configurem um local para o arquivo de registro de erros em `/var/log` com uma opção como `log-error=/var/log/mysqld.log` em um arquivo de configuração do servidor. Remover o nome do caminho da opção faz com que o arquivo `host_name.err` no diretório de dados seja usado.

Se o destino padrão do log de erros for o console, o servidor define a variável de sistema `log_error` para `stderr`. Caso contrário, o destino padrão é um arquivo e o servidor define `log_error` com o nome do arquivo.

##### Como o destino padrão do log de erro afeta os pontos de destino do log

Após o servidor interpretar as opções de configuração do destino do log de erro, ele define a variável de sistema `log_error` para indicar o destino padrão do log de erro. Os componentes de destino do log podem basear seu próprio destino de saída no valor `log_error`, ou determinar seu destino independentemente de `log_error`

Se `log_error` for `stderr`, o destino padrão do log de erro é o console, e os pontos de destino do log que baseiam seu destino de saída no destino padrão também escrevem no console:

- `log_sink_internal`, `log_sink_json`, `log_sink_test`: Esses ralos escrevem no console. Isso é verdade mesmo para ralos como `log_sink_json` que podem ser habilitados várias vezes; todas as instâncias escrevem no console.

- `log_sink_syseventlog`: Este retângulo escreve no log do sistema, independentemente do valor de `log_error`.

Se `log_error` não for `stderr`, o destino padrão do log de erro é um arquivo e `log_error` indica o nome do arquivo. Os pontos de destino de log que baseiam seu destino de saída no arquivo de nomeação de saída da base do destino padrão usam esse nome. (Um ponto de destino pode usar exatamente esse nome ou pode usar uma variação dele.) Suponha que o valor `log_error` `file_name`. Então, os pontos de destino de log usam o nome da seguinte forma:

- `log_sink_internal`, `log_sink_test`: Esses ralos escrevem para `file_name`.

- `log_sink_json`: Instâncias sucessivas deste repositório nomeadas no valor `log_error_services` escrevem em arquivos com nomes como `file_name` mais um sufixo numerado `.NN.json`: `file_name.00.json`, `file_name.01.json` e assim por diante.

- `log_sink_syseventlog`: Este retângulo escreve no log do sistema, independentemente do valor de `log_error`.
