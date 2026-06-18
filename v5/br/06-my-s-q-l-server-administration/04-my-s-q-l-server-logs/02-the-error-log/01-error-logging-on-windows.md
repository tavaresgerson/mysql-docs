#### 5.4.2.1 Registro de erros no Windows

No Windows, o **mysqld** usa as opções `--log-error`, `--pid-file` e `--console` para determinar se o **mysqld** escreve o log de erro na consola ou num ficheiro, e, se para um ficheiro, o nome do ficheiro:

- Se `--console` for fornecido, o **mysqld** escreve o log de erro no console. (`--console` tem precedência sobre `--log-error` se ambos forem fornecidos, e os seguintes itens sobre `--log-error` não se aplicam. Antes do MySQL 5.7, isso é invertido: `--log-error` tem precedência sobre `--console`.)

- Se `--log-error` não for fornecido ou for fornecido sem nomear um arquivo, o **mysqld** escreve o log de erro em um arquivo chamado `host_name.err` no diretório de dados, a menos que a opção `--pid-file` seja especificada. Nesse caso, o nome do arquivo é o nome de base do arquivo PID com um sufixo de `.err` no diretório de dados.

- Se `--log-error` for fornecido para nomear um arquivo, o **mysqld** escreve o log de erro nesse arquivo (com o sufixo `.err` adicionado se o nome não tiver sufixo). A localização do arquivo está sob o diretório de dados, a menos que um nome de caminho absoluto seja fornecido para especificar uma localização diferente.

Se o servidor escrever o log de erro no console, ele define a variável de sistema `log_error` para `stderr`. Caso contrário, o servidor escreve o log de erro em um arquivo e define `log_error` para o nome do arquivo.

Além disso, o servidor escreve, por padrão, eventos e mensagens de erro no Registro de Eventos do Windows, dentro do log de Aplicação:

- As entradas marcadas como `Erro`, `Aviso` e `Nota` são escritas no Registro de Eventos, mas não as mensagens, como declarações de informações de motores de armazenamento individuais.

- As entradas do Registro de Eventos têm uma fonte de `MySQL`.

- As informações escritas no Log de Eventos são controladas usando a variável de sistema `log_syslog`, que, no Windows, está habilitada por padrão. Veja Seção 5.4.2.3, “Registro de Erros no Log do Sistema”.
