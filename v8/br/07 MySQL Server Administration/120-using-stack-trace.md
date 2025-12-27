#### 7.9.1.5 Usando uma Traça de Pilha

Em alguns sistemas operacionais, o log de erros contém uma traça de pilha se o `mysqld` morrer inesperadamente. Você pode usar isso para descobrir onde (e talvez por que) o `mysqld` morreu. Veja a Seção 7.4.2, “O Log de Erros”. Para obter uma traça de pilha, você não deve compilar o `mysqld` com a opção `-fomit-frame-pointer` para o gcc. Veja a Seção 7.9.1.1, “Compilando o MySQL para Depuração”.

Uma traça de pilha no log de erros parece assim:

```
mysqld got signal 11;
Attempting backtrace. You can use the following information
to find out where mysqld died. If you see no messages after
this, something went terribly wrong...

stack_bottom = 0x41fd0110 thread_stack 0x40000
mysqld(my_print_stacktrace+0x32)[0x9da402]
mysqld(handle_segfault+0x28a)[0x6648e9]
/lib/libpthread.so.0[0x7f1a5af000f0]
/lib/libc.so.6(strcmp+0x2)[0x7f1a5a10f0f2]
mysqld(_Z21check_change_passwordP3THDPKcS2_Pcj+0x7c)[0x7412cb]
mysqld(_ZN16set_var_password5checkEP3THD+0xd0)[0x688354]
mysqld(_Z17sql_set_variablesP3THDP4ListI12set_var_baseE+0x68)[0x688494]
mysqld(_Z21mysql_execute_commandP3THD+0x41a0)[0x67a170]
mysqld(_Z11mysql_parseP3THDPKcjPS2_+0x282)[0x67f0ad]
mysqld(_Z16dispatch_command19enum_server_commandP3THDPcj+0xbb7[0x67fdf8]
mysqld(_Z10do_commandP3THD+0x24d)[0x6811b6]
mysqld(handle_one_connection+0x11c)[0x66e05e]
```

Se a resolução dos nomes de funções para a traça falhar, a traça contém menos informações:

```
mysqld got signal 11;
Attempting backtrace. You can use the following information
to find out where mysqld died. If you see no messages after
this, something went terribly wrong...

stack_bottom = 0x41fd0110 thread_stack 0x40000
[0x9da402]
[0x6648e9]
[0x7f1a5af000f0]
[0x7f1a5a10f0f2]
[0x7412cb]
[0x688354]
[0x688494]
[0x67a170]
[0x67f0ad]
[0x67fdf8]
[0x6811b6]
[0x66e05e]
```

Novas versões das funções de traça de pilha da `glibc` também imprimem o endereço como relativo ao objeto. Em sistemas baseados em `glibc` (Linux), a traça para uma saída inesperada dentro de um plugin parece assim:

```
plugin/auth/auth_test_plugin.so(+0x9a6)[0x7ff4d11c29a6]
```

Para traduzir o endereço relativo (`+0x9a6`) para um nome de arquivo e número de linha, use este comando:

```
$> addr2line -fie auth_test_plugin.so 0x9a6
auth_test_plugin
mysql-trunk/plugin/auth/test_plugin.c:65
```

A utilidade `addr2line` faz parte do pacote `binutils` em Linux.

Em Solaris, o procedimento é semelhante. O `printstack()` de Solaris já imprime endereços relativos:

```
plugin/auth/auth_test_plugin.so:0x1510
```

Para traduzir, use este comando:

```
$> gaddr2line -fie auth_test_plugin.so 0x1510
mysql-trunk/plugin/auth/test_plugin.c:88
```

O Windows já imprime o endereço, o nome da função e o número de linha:

```
000007FEF07E10A4 auth_test_plugin.dll!auth_test_plugin()[test_plugin.c:72]
```