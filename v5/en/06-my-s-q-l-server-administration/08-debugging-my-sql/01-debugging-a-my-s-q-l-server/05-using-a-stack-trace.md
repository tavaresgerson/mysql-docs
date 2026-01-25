#### 5.8.1.5 Usando um Stack Trace

Em alguns sistemas operacionais, o error log contém um stack trace se o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") for encerrado inesperadamente. Você pode usar isso para descobrir onde (e talvez por que) o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") foi encerrado. Consulte [Seção 5.4.2, “The Error Log”](error-log.html "5.4.2 The Error Log"). Para obter um stack trace, você não deve compilar o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") com a opção `-fomit-frame-pointer` do gcc. Consulte [Seção 5.8.1.1, “Compiling MySQL for Debugging”](compiling-for-debugging.html "5.8.1.1 Compiling MySQL for Debugging").

Um stack trace no error log se parece com o seguinte:

```sql
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

Se a resolução dos nomes das function para o trace falhar, o trace conterá menos informações:

```sql
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

Neste último caso, você pode usar a utility [**resolve_stack_dump**](resolve-stack-dump.html "4.7.3 resolve_stack_dump — Resolve Numeric Stack Trace Dump to Symbols") para determinar onde o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") foi encerrado, seguindo o procedimento abaixo:

1. Copie os números do stack trace para um arquivo, por exemplo, `mysqld.stack`. Os números não devem incluir os colchetes circundantes:

   ```sql
   0x9da402
   0x6648e9
   0x7f1a5af000f0
   0x7f1a5a10f0f2
   0x7412cb
   0x688354
   0x688494
   0x67a170
   0x67f0ad
   0x67fdf8
   0x6811b6
   0x66e05e
   ```

2. Crie um symbol file para o servidor [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"):

   ```sql
   $> nm -n libexec/mysqld > /tmp/mysqld.sym
   ```

   Se o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") não estiver ligado estaticamente, use o seguinte comando:

   ```sql
   $> nm -D -n libexec/mysqld > /tmp/mysqld.sym
   ```

   Se você quiser decodificar symbols C++, use a opção `--demangle`, se disponível, para o **nm**. Se a sua versão do **nm** não tiver esta option, você deve usar o comando **c++filt** depois que o stack dump for produzido para fazer o demangle dos nomes C++.

3. Execute o seguinte comando:

   ```sql
   $> resolve_stack_dump -s /tmp/mysqld.sym -n mysqld.stack
   ```

   Se você não conseguiu incluir nomes C++ com demangle no seu symbol file, processe a saída do [**resolve_stack_dump**](resolve-stack-dump.html "4.7.3 resolve_stack_dump — Resolve Numeric Stack Trace Dump to Symbols") usando **c++filt**:

   ```sql
   $> resolve_stack_dump -s /tmp/mysqld.sym -n mysqld.stack | c++filt
   ```

   Isso exibe onde o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") foi encerrado. Se isso não ajudar você a descobrir por que o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") foi encerrado, você deve criar um relatório de bug e incluir a saída do comando anterior no relatório.

   No entanto, na maioria dos casos, ter apenas um stack trace não nos ajuda a encontrar a razão do problema. Para podermos localizar o bug ou fornecer uma solução alternativa (workaround), na maioria dos casos, precisamos saber o statement que encerrou o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") e, de preferência, um caso de teste para que possamos repetir o problema! Consulte [Seção 1.5, “How to Report Bugs or Problems”](bug-reports.html "1.5 How to Report Bugs or Problems").

Versões mais recentes das function de stack trace do `glibc` também imprimem o address como relativo ao objeto. Em sistemas baseados em `glibc` (Linux), o trace para um encerramento inesperado dentro de um plugin se parece com:

```sql
plugin/auth/auth_test_plugin.so(+0x9a6)[0x7ff4d11c29a6]
```

Para traduzir o relative address (`+0x9a6`) para um file name e line number, use este comando:

```sql
$> addr2line -fie auth_test_plugin.so 0x9a6
auth_test_plugin
mysql-trunk/plugin/auth/test_plugin.c:65
```

A utility **addr2line** faz parte do pacote `binutils` no Linux.

No Solaris, o procedimento é semelhante. O `printstack()` do Solaris já imprime relative addresses:

```sql
plugin/auth/auth_test_plugin.so:0x1510
```

Para traduzir, use este comando:

```sql
$> gaddr2line -fie auth_test_plugin.so 0x1510
mysql-trunk/plugin/auth/test_plugin.c:88
```

O Windows já imprime o address, function name e line:

```sql
000007FEF07E10A4 auth_test_plugin.dll!auth_test_plugin()[test_plugin.c:72]
```