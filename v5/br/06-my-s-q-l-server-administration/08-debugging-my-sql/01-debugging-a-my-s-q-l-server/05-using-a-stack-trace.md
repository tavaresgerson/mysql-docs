#### 5.8.1.5 Usar uma Traça de Pilha

Em alguns sistemas operacionais, o log de erros contém uma traça de pilha se o **mysqld** morrer inesperadamente. Você pode usar isso para descobrir onde (e talvez por que) o **mysqld** morreu. Veja Seção 5.4.2, “O Log de Erros”. Para obter uma traça de pilha, você não deve compilar o **mysqld** com a opção `-fomit-frame-pointer` no gcc. Veja Seção 5.8.1.1, “Compilação do MySQL para Depuração”.

Uma traça de pilha no log de erro parece algo assim:

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

Se a resolução dos nomes de funções para o registro falhar, o registro conterá menos informações:

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

No último caso, você pode usar o utilitário **resolve\_stack\_dump** para determinar onde o **mysqld** morreu, seguindo o procedimento a seguir:

1. Copie os números da traça de pilha para um arquivo, por exemplo, `mysqld.stack`. Os números não devem incluir as chaves quadradas ao redor:

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

2. Crie um arquivo de símbolo para o servidor **mysqld**:

   ```sql
   $> nm -n libexec/mysqld > /tmp/mysqld.sym
   ```

   Se o **mysqld** não estiver vinculado estática e dinamicamente, use o seguinte comando:

   ```sql
   $> nm -D -n libexec/mysqld > /tmp/mysqld.sym
   ```

   Se você deseja decodificar símbolos em C++, use a opção `--demangle`, se disponível, para o **nm**. Se a versão do **nm** não tiver essa opção, você deve usar o comando **c++filt** após a produção do dump de pilha para decodificar os nomes em C++.

3. Execute o seguinte comando:

   ```sql
   $> resolve_stack_dump -s /tmp/mysqld.sym -n mysqld.stack
   ```

   Se você não conseguiu incluir nomes C++ desambiguais em seu arquivo de símbolos, processe a saída do **resolve\_stack\_dump** usando **c++filt**:

   ```sql
   $> resolve_stack_dump -s /tmp/mysqld.sym -n mysqld.stack | c++filt
   ```

   Isso imprimirá onde o **mysqld** morreu. Se isso não ajudar você a descobrir por que o **mysqld** morreu, você deve criar um relatório de erro e incluir a saída do comando anterior no relatório de erro.

   No entanto, na maioria dos casos, não nos ajuda ter apenas uma traça de pilha para encontrar a razão do problema. Para poder localizar o bug ou fornecer uma solução alternativa, na maioria dos casos, precisamos saber a declaração que matou **mysqld** e, de preferência, um caso de teste para que possamos repetir o problema! Veja Seção 1.5, “Como Relatar Bugs ou Problemas”.

Novas versões das funções de registro de pilha da `glibc` também imprimem o endereço em relação ao objeto. Em sistemas baseados na `glibc` (Linux), o registro de uma saída inesperada dentro de um plugin parece algo assim:

```sql
plugin/auth/auth_test_plugin.so(+0x9a6)[0x7ff4d11c29a6]
```

Para traduzir o endereço relativo (`+0x9a6`) em um nome de arquivo e número de linha, use este comando:

```sql
$> addr2line -fie auth_test_plugin.so 0x9a6
auth_test_plugin
mysql-trunk/plugin/auth/test_plugin.c:65
```

A ferramenta **addr2line** faz parte do pacote `binutils` no Linux.

No Solaris, o procedimento é semelhante. O `printstack()` do Solaris já imprime endereços relativos:

```sql
plugin/auth/auth_test_plugin.so:0x1510
```

Para traduzir, use este comando:

```sql
$> gaddr2line -fie auth_test_plugin.so 0x1510
mysql-trunk/plugin/auth/test_plugin.c:88
```

O Windows já imprime o endereço, o nome da função e a linha:

```sql
000007FEF07E10A4 auth_test_plugin.dll!auth_test_plugin()[test_plugin.c:72]
```
