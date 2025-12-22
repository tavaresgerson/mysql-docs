#### 7.9.1.4 Debugging mysqld sob gdb

Na maioria dos sistemas, você também pode iniciar o `mysqld` do **gdb** para obter mais informações se o `mysqld` falhar.

Com algumas versões mais antigas do **gdb** no Linux, você deve usar `run --one-thread` se quiser ser capaz de depurar `mysqld` threads. Neste caso, você só pode ter um thread ativo de cada vez.

Os threads NPTL (a nova biblioteca de threads no Linux) podem causar problemas ao executar `mysqld` sob **gdb**. Alguns sintomas são:

- `mysqld` pendura durante a inicialização (antes de escrever `ready for connections`).
- `mysqld` falha durante uma chamada `pthread_mutex_lock()` ou `pthread_mutex_unlock()`.

Neste caso, você deve definir a seguinte variável de ambiente no shell antes de iniciar **gdb**:

```
LD_ASSUME_KERNEL=2.4.1
export LD_ASSUME_KERNEL
```

Ao executar `mysqld` sob **gdb**, você deve desativar o rastreamento de pilha com `--skip-stack-trace` para ser capaz de capturar segfaults dentro de **gdb**.

Use a opção `--gdb` para `mysqld` para instalar um manipulador de interrupção para `SIGINT` (necessário parar `mysqld` com `^C` para definir breakpoints) e desativar o rastreamento de pilha e o processamento de arquivos do núcleo.

É muito difícil depurar o MySQL com **gdb** se você fizer muitas novas conexões o tempo todo, pois **gdb** não libera a memória para tópicos antigos. Você pode evitar esse problema iniciando `mysqld` com o valor de `thread_cache_size` definido como igual a `max_connections`.

- 1. Na maioria dos casos, o uso de \[`--thread_cache_size=5'`] ajuda muito!

Se você quiser obter um core dump no Linux se `mysqld` morrer com um sinal SIGSEGV, você pode iniciar `mysqld` com a opção `--core-file`. Este arquivo de núcleo pode ser usado para fazer um backtrace que pode ajudá-lo a descobrir por que `mysqld` morreu:

```
$> gdb mysqld core
gdb>   backtrace full
gdb>   quit
```

Ver Secção B.3.3.3, "O que fazer se o MySQL continuar a falhar".

Se você estiver usando **gdb** no Linux, você deve instalar um arquivo `.gdb`, com as seguintes informações, em seu diretório atual:

```
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

Aqui está um exemplo de como depurar `mysqld`:

```
$> gdb /usr/local/libexec/mysqld
gdb> run
...
backtrace full # Do this when mysqld crashes
```

Incluir a saída anterior em um relatório de bug, que você pode arquivar usando as instruções na Seção 1.6, "Como relatar bugs ou problemas".

Se `mysqld` estiver pendurado, você pode tentar usar algumas ferramentas do sistema como `strace` ou `/usr/proc/bin/pstack` para examinar onde `mysqld` está pendurado.

```
strace /tmp/log libexec/mysqld
```

Se você estiver usando a interface Perl `DBI`, você pode ativar as informações de depuração usando o método `trace` ou definindo a variável de ambiente `DBI_TRACE`.
