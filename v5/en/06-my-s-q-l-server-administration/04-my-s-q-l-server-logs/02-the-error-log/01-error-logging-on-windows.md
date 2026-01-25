#### 5.4.2.1 Registro de Erros no Windows

No Windows, o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") utiliza as opções [`--log-error`], [`--pid-file`] e [`--console`] para determinar se o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") deve gravar o error log no console ou em um arquivo e, se for em um arquivo, qual será o nome do arquivo:

* Se [`--console`] for fornecido, o [**mysqld**] grava o error log no console. ([`--console`] tem precedência sobre [`--log-error`] se ambos forem fornecidos, e os itens a seguir relacionados a [`--log-error`] não se aplicam. Antes do MySQL 5.7, isso era invertido: [`--log-error`] tinha precedência sobre [`--console`].)

* Se [`--log-error`] não for fornecido, ou se for fornecido sem especificar um arquivo, o [**mysqld**] grava o error log em um arquivo chamado `host_name.err` no `data directory`, a menos que a opção [`--pid-file`] seja especificada. Nesse caso, o nome do arquivo é o nome base do PID file com um `suffix` de `.err` no `data directory`.

* Se [`--log-error`] for fornecido para nomear um arquivo, o [**mysqld**] grava o error log nesse arquivo (com um `suffix` `.err` adicionado se o nome não tiver um `suffix`). O local do arquivo fica sob o `data directory`, a menos que um `absolute path name` seja fornecido para especificar um local diferente.

Se o server gravar o error log no console, ele define a variável de sistema [`log_error`] como `stderr`. Caso contrário, o server grava o error log em um arquivo e define [`log_error`] como o nome do arquivo.

Além disso, por padrão, o server grava eventos e mensagens de erro no Windows Event Log, dentro do Application log:

* Entradas marcadas como `Error`, `Warning` e `Note` são gravadas no Event Log, mas não mensagens como declarações de informação de `storage engines` individuais.

* As entradas do Event Log têm um `source` de `MySQL`.
* As informações gravadas no Event Log são controladas usando a variável de sistema [`log_syslog`], que no Windows é habilitada por padrão. Veja [Seção 5.4.2.3, “Registro de Erros no Log do Sistema”](error-log-syslog.html "5.4.2.3 Error Logging to the System Log").