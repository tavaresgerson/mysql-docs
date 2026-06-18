#### 5.8.1.4 Depuração do mysqld no gdb

Na maioria dos sistemas, você também pode iniciar **mysqld** a partir do **gdb** para obter mais informações se o **mysqld** falhar.

Com algumas versões mais antigas do **gdb** no Linux, você deve usar `run --one-thread` se quiser ser capaz de depurar threads do **mysqld**. Nesse caso, você só pode ter um thread ativo de cada vez.

Os threads do NPTL (a nova biblioteca de threads no Linux) podem causar problemas ao executar o **mysqld** no **gdb**. Alguns sintomas são:

- **mysqld** trava durante o início (antes de escrever `pronto para conexões`).

- **mysqld** trava durante uma chamada de `pthread_mutex_lock()` ou `pthread_mutex_unlock()`.

Nesse caso, você deve definir a seguinte variável de ambiente no shell antes de iniciar o **gdb**:

```sql
LD_ASSUME_KERNEL=2.4.1
export LD_ASSUME_KERNEL
```

Ao executar **mysqld** sob o **gdb**, você deve desabilitar a depuração em pilha com `--skip-stack-trace` para poder capturar falhas de segmentação dentro do **gdb**.

Use a opção `--gdb` para o **mysqld** para instalar um manipulador de interrupção para `SIGINT` (necessário para parar o **mysqld** com `^C` para definir pontos de interrupção) e desativar o rastreamento de pilha e o gerenciamento de arquivos de núcleo.

É muito difícil depurar o MySQL no **gdb** se você fizer muitas novas conexões o tempo todo, pois o **gdb** não libera a memória para os threads antigos. Você pode evitar esse problema iniciando o **mysqld** com o valor de `thread_cache_size` definido como igual a `max_connections`

- 1. Na maioria dos casos, o uso de `--thread_cache_size=5` ajuda muito!

Se você quiser obter um dump do núcleo no Linux caso o **mysqld** morra com um sinal SIGSEGV, você pode iniciar o **mysqld** com a opção `--core-file`. Esse arquivo de núcleo pode ser usado para gerar um backtrace que pode ajudar a descobrir por que o **mysqld** morreu:

```sql
$> gdb mysqld core
gdb>   backtrace full
gdb>   quit
```

Veja Seção B.3.3.3, “O que fazer se o MySQL continuar a falhar”.

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

Aqui está um exemplo de como depurar **mysqld**:

```sql
$> gdb /usr/local/libexec/mysqld
gdb> run
...
backtrace full # Do this when mysqld crashes
```

Inclua a saída anterior em um relatório de erro, que você pode enviar seguindo as instruções na Seção 1.5, “Como relatar erros ou problemas”.

Se o **mysqld** ficar parado, você pode tentar usar algumas ferramentas do sistema, como `strace` ou `/usr/proc/bin/pstack`, para examinar onde o **mysqld** ficou parado.

```sql
strace /tmp/log libexec/mysqld
```

Se você estiver usando a interface `DBI` do Perl, você pode ativar as informações de depuração usando o método `trace` ou configurando a variável de ambiente `DBI_TRACE`.
