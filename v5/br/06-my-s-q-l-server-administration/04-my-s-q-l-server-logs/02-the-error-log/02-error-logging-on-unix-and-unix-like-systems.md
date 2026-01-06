#### 5.4.2.2 Registro de erros em sistemas Unix e Unix-like

Nos sistemas Unix e similares, o **mysqld** usa a opção `--log-error` para determinar se o **mysqld** escreve o log de erro na consola ou num ficheiro, e, se para um ficheiro, o nome do ficheiro:

- Se `--log-error` não for fornecido, o **mysqld** escreve o log de erro no console.

- Se `--log-error` for fornecido sem nomear um arquivo, o **mysqld** escreve o log de erro em um arquivo chamado `host_name.err` no diretório de dados.

- Se `--log-error` for fornecido para nomear um arquivo, o **mysqld** escreve o log de erro nesse arquivo (com o sufixo `.err` adicionado se o nome não tiver sufixo). A localização do arquivo está sob o diretório de dados, a menos que um nome de caminho absoluto seja fornecido para especificar uma localização diferente.

- Se `--log-error` for fornecido em um arquivo de opções em uma seção de `[mysqld]`, `[server]` ou `[mysqld_safe]`, em sistemas que usam **mysqld\_safe** para iniciar o servidor, o **mysqld\_safe** encontra e usa a opção e a passa para o **mysqld**.

Nota

É comum que as instalações de pacotes Yum ou APT configurem um local de arquivo de log de erro em `/var/log` com uma opção como `log-error=/var/log/mysqld.log` em um arquivo de configuração do servidor. Remover o nome do caminho da opção faz com que o arquivo `host_name.err` no diretório de dados seja usado.

Se o servidor escrever o log de erro no console, ele define a variável de sistema `log_error` para `stderr`. Caso contrário, o servidor escreve o log de erro em um arquivo e define `log_error` para o nome do arquivo.
