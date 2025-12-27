#### 7.4.2.2 Configuração da Destinação do Log de Erros Padrão

Esta seção descreve quais opções do servidor configuram a destino padrão do log de erros, que pode ser a console ou um arquivo nomeado. Também indica quais componentes de destino de log baseiam seu próprio destino de saída no destino padrão.

Neste contexto, “console” significa `stderr`, a saída de erro padrão. Isso é o seu terminal ou janela de console, a menos que a saída de erro padrão tenha sido redirecionada para um destino diferente.

O servidor interpreta as opções que determinam a destino padrão do log de erros de maneira um pouco diferente para sistemas Windows e Unix. Certifique-se de configurar o destino usando as informações apropriadas para sua plataforma. Após o servidor interpretar as opções de destino padrão do log de erros, ele define a variável de sistema `log_error` para indicar o destino padrão, o que afeta onde vários componentes de destino de log escrevem mensagens de erro. As seções seguintes abordam esses tópicos.

* Destino Padrão do Log de Erros em Windows
* Destino Padrão do Log de Erros em Sistemas Unix e Unix-Like
* Como o Destino Padrão do Log de Erros Afeta os Destinos de Log

##### Destino Padrão do Log de Erros em Windows

Em Windows, o `mysqld` usa as opções `--log-error`, `--pid-file` e `--console` para determinar se o destino padrão do log de erros é a console ou um arquivo, e, se for um arquivo, o nome do arquivo:

* Se `--console` for fornecido, o destino padrão é o console. (`--console` tem precedência sobre `--log-error` se ambos forem fornecidos, e os seguintes itens sobre `--log-error` não se aplicam.)
* Se `--log-error` não for fornecido, ou for fornecido sem nomear um arquivo, o destino padrão é um arquivo chamado `host_name.err` no diretório de dados, a menos que a opção `--pid-file` seja especificada. Nesse caso, o nome do arquivo é o nome de base do arquivo PID com um sufixo de `.err` no diretório de dados.
* Se `--log-error` for fornecido para nomear um arquivo, o destino padrão é esse arquivo (com um sufixo `.err` adicionado se o nome não tiver sufixo). A localização do arquivo está sob o diretório de dados, a menos que um nome de caminho absoluto seja fornecido para especificar uma localização diferente.

Se o destino padrão do log de erro for o console, o servidor define a variável de sistema `log_error` para `stderr`. Caso contrário, o destino padrão é um arquivo e o servidor define `log_error` para o nome do arquivo.

##### Destino Padrão do Log de Erro em Sistemas Unix e Unix-Like

Em sistemas Unix e Unix-like, o `mysqld` usa a opção `--log-error` para determinar se o destino padrão do log de erro é o console ou um arquivo, e, se for um arquivo, o nome do arquivo:

* Se `--log-error` não for fornecido, o destino padrão é o console.
* Se `--log-error` for fornecido sem nomear um arquivo, o destino padrão é um arquivo chamado `host_name.err` no diretório de dados.
* Se `--log-error` for fornecido para nomear um arquivo, o destino padrão é esse arquivo (com um sufixo `.err` adicionado se o nome não tiver sufixo). A localização do arquivo está sob o diretório de dados, a menos que um nome de caminho absoluto seja fornecido para especificar uma localização diferente.
* Se `--log-error` for fornecido em um arquivo de opções em uma seção `[mysqld]`, `[server]` ou `[mysqld_safe]`, em sistemas que usam `mysqld_safe` para iniciar o servidor, `mysqld_safe` encontra e usa a opção e a passa para o `mysqld`.

::: info Nota


É comum que as instalações de pacotes Yum ou APT configurem um local de arquivo de log de erro em `/var/log` com uma opção como `log-error=/var/log/mysqld.log` em um arquivo de configuração do servidor. Remover o nome do caminho da opção faz com que o arquivo `host_name.err` no diretório de dados seja usado.

:::

Se o destino padrão do log de erro for a console, o servidor define a variável de sistema `log_error` para `stderr`. Caso contrário, o destino padrão é um arquivo e o servidor define `log_error` para o nome do arquivo.

##### Como o Destino Padrão do Log de Erro Afeta os Canais de Registro

Após o servidor interpretar as opções de configuração do destino do log de erro, ele define a variável de sistema `log_error` para indicar o destino padrão do log de erro. Os componentes dos canais de registro podem basear seu próprio destino de saída no valor de `log_error`, ou determinar seu destino de forma independente de `log_error`.

Se `log_error` é `stderr`, o destino padrão do log de erro é a console, e os canais de registro que baseiam seu destino de saída no destino padrão também escrevem na console:

* `log_sink_internal`, `log_sink_json`, `log_sink_test`: Esses canais escrevem na console. Isso é verdade mesmo para canais como `log_sink_json` que podem ser habilitados várias vezes; todas as instâncias escrevem na console.
* `log_sink_syseventlog`: Esse canal escreve no log do sistema, independentemente do valor de `log_error`.

Se `log_error` não for `stderr`, o destino padrão do log de erro é um arquivo e `log_error` indica o nome do arquivo. Os canais de registro que baseiam seu destino de saída no destino padrão baseiam o nome de arquivo de saída no nome desse arquivo. (Um canal pode usar exatamente esse nome, ou pode usar alguma variação dele.) Suponha que o valor de `log_error` seja `file_name`. Então, os canais de registro usam o nome assim:

* `log_sink_internal`, `log_sink_test`: Esses sinks escrevem em *`file_name`*.
* `log_sink_json`: Instâncias sucessivas desse sink nomeadas no valor `log_error_services` escrevem em arquivos nomeados *`file_name`* mais um sufixo numerado `.NN.json`: `file_name.00.json`, `file_name.01.json`, e assim por diante.
* `log_sink_syseventlog`: Esse sink escreve no log do sistema, independentemente do valor `log_error`.