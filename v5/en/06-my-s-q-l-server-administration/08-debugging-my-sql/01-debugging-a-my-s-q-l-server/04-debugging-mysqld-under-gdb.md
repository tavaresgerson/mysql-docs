#### 5.8.1.4 Debugging mysqld sob gdb

Na maioria dos sistemas, você também pode iniciar o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") a partir do **gdb** para obter mais informações caso o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") falhe (crash).

Com algumas versões mais antigas do **gdb** no Linux, você deve usar `run --one-thread` se quiser ser capaz de depurar Threads do [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"). Neste caso, você só pode ter uma Thread ativa por vez.

As Threads NPTL (a nova biblioteca de Threads no Linux) podem causar problemas ao executar o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") sob o **gdb**. Alguns sintomas são:

* O [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") trava durante a inicialização (antes de escrever `ready for connections`).

* O [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") falha durante uma chamada `pthread_mutex_lock()` ou `pthread_mutex_unlock()`.

Neste caso, você deve definir a seguinte variável de ambiente no shell antes de iniciar o **gdb**:

```sql
LD_ASSUME_KERNEL=2.4.1
export LD_ASSUME_KERNEL
```

Ao executar o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") sob o **gdb**, você deve desabilitar o stack trace com [`--skip-stack-trace`](server-options.html#option_mysqld_skip-stack-trace) para poder capturar segfaults dentro do **gdb**.

Use a opção [`--gdb`](server-options.html#option_mysqld_gdb) para o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") para instalar um manipulador de interrupção para `SIGINT` (necessário para parar o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") com `^C` para definir breakpoints) e desabilitar o stack tracing e o tratamento de core file.

É muito difícil depurar o MySQL sob o **gdb** se você fizer muitas conexões novas o tempo todo, pois o **gdb** não libera a memória para Threads antigas. Você pode evitar esse problema iniciando o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") com [`thread_cache_size`](server-system-variables.html#sysvar_thread_cache_size) definido para um valor igual a [`max_connections`](server-system-variables.html#sysvar_max_connections) + 1. Na maioria dos casos, apenas usar [`--thread_cache_size=5'`](server-system-variables.html#sysvar_thread_cache_size) ajuda bastante!

Se você deseja obter um core dump no Linux caso o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") morra com um sinal SIGSEGV, você pode iniciar o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") com a opção [`--core-file`](server-options.html#option_mysqld_core-file). Este core file pode ser usado para fazer um backtrace que pode ajudar você a descobrir por que o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") morreu:

```sql
$> gdb mysqld core
gdb>   backtrace full
gdb>   quit
```

Veja [Seção B.3.3.3, “O que Fazer se o MySQL Continuar Falhando”](crashing.html "B.3.3.3 What to Do If MySQL Keeps Crashing").

Se você estiver usando o **gdb** no Linux, você deve instalar um arquivo `.gdb`, com as seguintes informações, em seu diretório atual:

```sql
set print sevenbit off
handle SIGUSR1 nostop noprint
handle SIGUSR2 nostop noprint
handle SIGWAITING nostop noprint
handle SIGLWP nostop noprint
handle SIGPIPE nostop
handle SIGALRM nostop
handle SIGHUP nostop
handle SIGTERM nostop noprint
```

Aqui está um exemplo de como depurar o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"):

```sql
$> gdb /usr/local/libexec/mysqld
gdb> run
...
backtrace full # Do this when mysqld crashes
```

Inclua a saída precedente em um relatório de bug, que você pode registrar usando as instruções na [Seção 1.5, “Como Relatar Bugs ou Problemas”](bug-reports.html "1.5 How to Report Bugs or Problems").

Se o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") travar, você pode tentar usar algumas ferramentas do sistema como `strace` ou `/usr/proc/bin/pstack` para examinar onde o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") travou.

```sql
strace /tmp/log libexec/mysqld
```

Se você estiver usando a interface Perl `DBI`, você pode ativar as informações de debugging usando o método `trace` ou definindo a variável de ambiente `DBI_TRACE`.