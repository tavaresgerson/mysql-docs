#### 7.9.1.4 Depuração do mysqld no `gdb`

Na maioria dos sistemas, você também pode iniciar o `mysqld` a partir do `gdb` para obter mais informações se o `mysqld` falhar.

Com algumas versões mais antigas do `gdb` no Linux, você deve usar `run --one-thread` se quiser ser capaz de depurar os threads do `mysqld`. Nesse caso, você só pode ter um thread ativo de cada vez.

Os threads NPTL (a nova biblioteca de threads no Linux) podem causar problemas ao executar o `mysqld` no `gdb`. Alguns sintomas são:

* O `mysqld` fica parado durante o inicialização (antes de escrever `pronto para conexões`).
* O `mysqld` falha durante uma chamada de `pthread_mutex_lock()` ou `pthread_mutex_unlock()`.

Nesse caso, você deve definir a seguinte variável de ambiente no shell antes de iniciar o `gdb`:

```
LD_ASSUME_KERNEL=2.4.1
export LD_ASSUME_KERNEL
```

Ao executar o `mysqld` no `gdb`, você deve desabilitar a depuração em pilha com `--skip-stack-trace` para ser capaz de capturar falhas de segmentação dentro do `gdb`.

Use a opção `--gdb` para o `mysqld` para instalar um manipulador de interrupção para `SIGINT` (necessário para parar o `mysqld` com `^C` para definir pontos de interrupção) e desabilitar a depuração em pilha e o gerenciamento de arquivos de registro.

É muito difícil depurar o MySQL no `gdb` se você fizer muitas novas conexões o tempo todo, pois o `gdb` não libera a memória para os threads antigos. Você pode evitar esse problema iniciando o `mysqld` com `thread_cache_size` definido para um valor igual a `max_connections`
+ 1. Na maioria dos casos, usar apenas `--thread_cache_size=5` ajuda muito!

Se você quiser obter um dump de núcleo no Linux se o `mysqld` morrer com um sinal SIGSEGV, você pode iniciar o `mysqld` com a opção `--core-file`. Esse arquivo de núcleo pode ser usado para fazer uma depuração que pode ajudá-lo a descobrir por que o `mysqld` morreu:

```
$> gdb mysqld core
gdb>   backtrace full
gdb>   quit
```

Veja a Seção B.3.3.3, “O que fazer se o MySQL continuar a falhar”.

Se você estiver usando o `gdb` no Linux, você deve instalar um arquivo `.gdb`, com as seguintes informações, em seu diretório atual:

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

Aqui está um exemplo de como depurar o `mysqld`:

```
$> gdb /usr/local/libexec/mysqld
gdb> run
...
backtrace full # Do this when mysqld crashes
```

Inclua a saída anterior em um relatório de erro, que você pode enviar seguindo as instruções na Seção 1.6, “Como relatar erros ou problemas”.

Se o `mysqld` ficar parado, você pode tentar usar algumas ferramentas do sistema, como `strace` ou `/usr/proc/bin/pstack`, para examinar onde o `mysqld` ficou parado.

```
strace /tmp/log libexec/mysqld
```

Se você estiver usando a interface `DBI` do Perl, você pode ativar as informações de depuração usando o método `trace` ou configurando a variável de ambiente `DBI_TRACE`.