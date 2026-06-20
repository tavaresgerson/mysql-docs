## 5.8 Depuração do MySQL

Esta seção descreve técnicas de depuração que auxiliam nos esforços para localizar problemas no MySQL.

### 5.8.1 Depuração de um servidor MySQL

Se você está usando alguma funcionalidade que é muito nova no MySQL, você pode tentar executar `mysqld` com a opção `--skip-new` (que desativa todas as novas funcionalidades potencialmente inseguras). Veja a Seção B.3.3.3, “O que fazer se o MySQL continuar a falhar”.

Se o `mysqld` não quiser começar, verifique se você não tem nenhum arquivo `my.cnf` que interfira em sua configuração! Você pode verificar seus argumentos `my.cnf` com **mysqld --print-defaults** e evitar usá-los iniciando com **mysqld --no-defaults ...**.

Se o `mysqld` começar a consumir CPU ou memória ou se "parar", você pode usar **mysqladmin processlist status** para descobrir se alguém está executando uma consulta que leva um longo tempo. Pode ser uma boa ideia executar **mysqladmin -i10 processlist status** em alguma janela se você estiver enfrentando problemas de desempenho ou problemas quando novos clientes não conseguem se conectar.

O comando **mysqladmin debug** exibe algumas informações sobre as chaves de acesso em uso, memória usada e uso de consultas no arquivo de registro do MySQL. Isso pode ajudar a resolver alguns problemas. Esse comando também fornece algumas informações úteis mesmo que você não tenha compilado o MySQL para depuração!

Se o problema for que algumas tabelas estão ficando cada vez mais lentas, você deve tentar otimizar a tabela com `OPTIMIZE TABLE` ou **myisamchk**. Veja o Capítulo 5, *Administração do Servidor MySQL*. Você também deve verificar as consultas lentas com `EXPLAIN`.

Você também deve ler a seção específica do sistema operacional neste manual para problemas que podem ser exclusivos do seu ambiente. Veja a Seção 2.1, “Orientações Gerais de Instalação”.

#### 5.8.1.1 Compilando o MySQL para depuração

Se você tiver um problema muito específico, sempre pode tentar depurar o MySQL. Para fazer isso, você deve configurar o MySQL com a opção `-DWITH_DEBUG=1`. Você pode verificar se o MySQL foi compilado com depuração fazendo: **mysqld --help**. Se a bandeira `--debug` estiver listada com as opções, então você tem a depuração habilitada. **mysqladmin ver** também lista a versão `mysqld` como **mysql ... --debug** neste caso.

Se o `mysqld` parar de falhar quando você o configura com a opção `-DWITH_DEBUG=1` do CMake, provavelmente você encontrou um bug no compilador ou um bug de temporização dentro do MySQL. Neste caso, você pode tentar adicionar o `-g` usando as opções `CMAKE_C_FLAGS` e `CMAKE_CXX_FLAGS` do CMake e não usar o `-DWITH_DEBUG=1`. Se o `mysqld` morrer, pelo menos você pode anexá-lo com **gdb** ou usar **gdb** no arquivo do núcleo para descobrir o que aconteceu.

Quando você configura o MySQL para depuração, você automaticamente habilita muitas funções de verificação de segurança extra que monitoram a saúde do `mysqld`. Se eles encontrarem algo “inesperado”, uma entrada é escrita no `stderr`, que `mysqld_safe` direciona para o log de erro! Isso também significa que, se você está tendo alguns problemas inesperados com o MySQL e está usando uma distribuição de fonte, a primeira coisa que você deve fazer é configurar o MySQL para depuração. Se você acredita que encontrou um bug, use as instruções na Seção 1.5, “Como relatar bugs ou problemas”.

Na distribuição do MySQL para Windows, `mysqld.exe` é compilado por padrão com suporte para arquivos de rastreamento.

#### 5.8.1.2 Criando arquivos de rastreamento

Se o servidor `mysqld` não começar ou se quebrar facilmente, você pode tentar criar um arquivo de rastreamento para encontrar o problema.

Para fazer isso, você deve ter um `mysqld` que foi compilado com suporte de depuração. Você pode verificar isso executando `mysqld -V`. Se o número da versão terminar com `-debug`, ele foi compilado com suporte para arquivos de rastreamento. (No Windows, o servidor de depuração é chamado **mysqld-debug** em vez de `mysqld`.)

Inicie o servidor `mysqld` com um registro de rastreamento no `/tmp/mysqld.trace` no Unix ou no `\mysqld.trace` no Windows:

```sql
$> mysqld --debug
```

Em Windows, você também deve usar a bandeira `--standalone` para não iniciar o `mysqld` como um serviço. Em uma janela do console, use este comando:

```sql
C:\> mysqld-debug --debug --standalone
```

Depois disso, você pode usar a ferramenta de string de comando `mysql.exe` em uma segunda janela do console para reproduzir o problema. Você pode parar o servidor `mysqld` com **mysqladmin shutdown**.

O arquivo de rastreamento pode se tornar **muito grande!** Para gerar um arquivo de rastreamento menor, você pode usar opções de depuração como esta:

**mysqld --debug=d,info,error,query,general,where:O,/tmp/mysqld.trace**

Isso apenas imprime informações com as tags mais interessantes no arquivo de registro.

Se você enviar um relatório de erro, por favor, adicione apenas as strings do arquivo de registro que indicam onde algo parece estar errado. Se você não conseguir localizar o local errado, abra um relatório de erro e faça o upload de todo o arquivo de registro ao relatório, para que um desenvolvedor do MySQL possa examiná-lo. Para instruções, consulte a Seção 1.5, “Como relatar erros ou problemas”.

O arquivo de rastreamento é feito com o pacote DBUG por Fred Fish. Veja a Seção 5.8.3, “O pacote DBUG”.

#### 5.8.1.3 Usando o WER com PDB para criar um crashdump do Windows

Os arquivos de banco de dados do programa (com o sufixo `pdb`) estão incluídos na distribuição de **ARQUIVO ZIP de Binários de Depuração e Conjunto de Teste** do MySQL. Esses arquivos fornecem informações para depuração da sua instalação do MySQL, no caso de um problema. Este é um download separado do arquivo padrão MSI ou Zip.

Nota

Os arquivos PDB estão disponíveis em um arquivo separado rotulado "ZIP Archive Debug Binaries & Test Suite".

O arquivo PDB contém informações mais detalhadas sobre `mysqld` e outras ferramentas que permitem a criação de arquivos de depuração e de depuração mais detalhados. Você pode usar esses arquivos com **WinDbg** ou Visual Studio para depurar `mysqld`.

Para mais informações sobre arquivos PDB, consulte o artigo da Base de Conhecimento da Microsoft 121366. Para mais informações sobre as opções de depuração disponíveis, consulte Ferramentas de depuração para Windows.

Para usar o WinDbg, instale o Kit de drivers completos do Windows (WDK) ou instale a versão independente.

Importante

Os arquivos `.exe` e `.pdb` devem corresponder exatamente (ambos o número da versão e a edição do servidor MySQL) ou o WinDBG reclamará ao tentar carregar os símbolos.

1. Para gerar um minidump `mysqld.dmp`, habilite a opção `core-file` na seção [mysqld] em `my.ini`. Reinicie o servidor MySQL após fazer essas alterações.

2. Crie um diretório para armazenar os arquivos gerados, como `c:\symbols`

3. Determine o caminho para o seu executável **windbg.exe** usando o Find GUI ou a partir da string de comando, por exemplo: `dir /s /b windbg.exe` -- um padrão comum é *C:\Program Files\Debugging Tools for Windows (x64)\windbg.exe*

4. Inicie `windbg.exe`, fornecendo as permissões para `mysqld-debug.exe`, `mysqld.pdb`, `mysqld.dmp` e o código-fonte. Alternativamente, insira cada caminho na interface gráfica do WinDbg. Por exemplo:

   ```sql
   windbg.exe -i "C:\mysql-5.7.44-winx64\bin\"^
    -z "C:\mysql-5.7.44-winx64\data\mysqld.dmp"^
    -srcpath "E:\ade\mysql_archives\5.7\5.7.44\mysql-5.7.44"^
    -y "C:\mysql-5.7.44-winx64\bin;SRV*c:\symbols*http://msdl.microsoft.com/download/symbols"^
    -v -n -c "!analyze -vvvvv"
   ```

Nota

O caractere `^` e a nova string são removidos pelo processador de string de comando do Windows, então certifique-se de que os espaços permaneçam intactos.

#### 5.8.1.4 Depuração do mysqld sob o gdb

Na maioria dos sistemas, você também pode iniciar `mysqld` a partir do **gdb** para obter mais informações se o `mysqld` falhar.

Com algumas versões mais antigas do **gdb** no Linux, você deve usar `run --one-thread` se quiser ser capaz de depurar `mysqld` threads. Nesse caso, você só pode ter um thread ativo de cada vez.

Os threads NPTL (a nova biblioteca de threads no Linux) podem causar problemas ao executar `mysqld` sob **gdb**. Alguns sintomas são:

* `mysqld` fica parado durante o arranque (antes de escrever `ready for connections`).

* `mysqld` trava durante uma chamada de `pthread_mutex_lock()` ou `pthread_mutex_unlock()`.

Neste caso, você deve definir a seguinte variável de ambiente no shell antes de iniciar o **gdb**:

```sql
LD_ASSUME_KERNEL=2.4.1
export LD_ASSUME_KERNEL
```

Ao executar `mysqld` sob o **gdb**, você deve desabilitar a depuração de pilha com `--skip-stack-trace` para poder capturar segfaults dentro do **gdb**.

Utilize a opção `--gdb` para `mysqld` para instalar um manipulador de interrupção para `SIGINT` (necessário para parar `mysqld` com `^C` para definir pontos de interrupção) e desabilitar o rastreamento de pilha e o gerenciamento de arquivos de núcleo.

É muito difícil depurar o MySQL sob **gdb** se você fizer muitas novas conexões o tempo todo, pois o **gdb** não libera a memória para os threads antigos. Você pode evitar esse problema iniciando `mysqld` com `thread_cache_size` definido para um valor igual a `max_connections`.

+ 1. Na maioria dos casos, o uso apenas de `--thread_cache_size=5'` ajuda muito!

Se você deseja obter um dump de núcleo no Linux se `mysqld` morrer com um sinal SIGSEGV, você pode iniciar `mysqld` com a opção `--core-file`. Esse arquivo de núcleo pode ser usado para fazer um backtrace que pode ajudá-lo a descobrir por que `mysqld` morreu:

```sql
$> gdb mysqld core
gdb>   backtrace full
gdb>   quit
```

Veja a Seção B.3.3.3, “O que fazer se o MySQL continuar a falhar”.

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

Aqui está um exemplo de como depurar `mysqld`:

```sql
$> gdb /usr/local/libexec/mysqld
gdb> run
...
backtrace full # Do this when mysqld crashes
```

Inclua o resultado anterior em um relatório de erro, que você pode enviar seguindo as instruções na Seção 1.5, “Como relatar erros ou problemas”.

Se o `mysqld` estiver parado, você pode tentar usar algumas ferramentas do sistema, como `strace` ou `/usr/proc/bin/pstack`, para examinar onde o `mysqld` ficou parado.

```sql
strace /tmp/log libexec/mysqld
```

Se você estiver usando a interface Perl `DBI`, pode ativar as informações de depuração usando o método `trace` ou definindo a variável de ambiente `DBI_TRACE`.

#### 5.8.1.5 Usando uma depuração em pilha

Em alguns sistemas operacionais, o log de erro contém uma traçada de pilha se `mysqld` morrer de forma inesperada. Você pode usar isso para descobrir onde (e talvez por que) `mysqld` morreu. Veja a Seção 5.4.2, “O Log de Erro”. Para obter uma traçada de pilha, você não deve compilar `mysqld` com a opção `-fomit-frame-pointer` para o gcc. Veja a Seção 5.8.1.1, “Compilando o MySQL para Depuração”.

Um registro de depuração em um log de erro parece algo assim:

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

Se a resolução dos nomes de função para o rastreamento falhar, o rastreamento contém menos informações:

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

No último caso, você pode usar o utilitário **resolve_stack_dump** para determinar onde o `mysqld` morreu, usando o seguinte procedimento:

1. Copie os números do registro de depuração para um arquivo, por exemplo, `mysqld.stack`. Os números não devem incluir os colchetes ao redor:

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

2. Crie um arquivo de símbolo para o servidor `mysqld`:

   ```sql
   $> nm -n libexec/mysqld > /tmp/mysqld.sym
   ```

Se `mysqld` não estiver vinculado estaticamente, use o seguinte comando em vez disso:

   ```sql
   $> nm -D -n libexec/mysqld > /tmp/mysqld.sym
   ```

Se você deseja decodificar símbolos em C++, use o `--demangle`, se disponível, para **nm**. Se sua versão do **nm** não tiver essa opção, você deve usar o comando **c++filt** após a produção do dump de pilha para desmascarar os nomes em C++.

3. Execute o seguinte comando:

   ```sql
   $> resolve_stack_dump -s /tmp/mysqld.sym -n mysqld.stack
   ```

Se você não conseguiu incluir nomes de C++ não modificados em seu arquivo de símbolos, processe a saída de **resolve_stack_dump** usando **c++filt**:

   ```sql
   $> resolve_stack_dump -s /tmp/mysqld.sym -n mysqld.stack | c++filt
   ```

Isso imprime onde `mysqld` morreu. Se isso não ajudar a descobrir por que `mysqld` morreu, você deve criar um relatório de erro e incluir a saída do comando anterior com o relatório de erro.

No entanto, na maioria dos casos, não nos ajuda ter apenas uma pilha de depuração para encontrar a razão do problema. Para ser capaz de localizar o bug ou fornecer uma solução, na maioria dos casos, precisamos saber a declaração que matou `mysqld` e, de preferência, um caso de teste para que possamos repetir o problema! Veja a Seção 1.5, “Como Relatar Bugs ou Problemas”.

Versões mais recentes das funções de depuração de pilha `glibc` também imprimem o endereço em relação ao objeto. Em sistemas baseados em `glibc` (Linux), o rastreamento para uma saída inesperada dentro de um plugin parece algo assim:

```sql
plugin/auth/auth_test_plugin.so(+0x9a6)[0x7ff4d11c29a6]
```

Para traduzir o endereço relativo (`+0x9a6`) em um nome de arquivo e número de string, use este comando:

```sql
$> addr2line -fie auth_test_plugin.so 0x9a6
auth_test_plugin
mysql-trunk/plugin/auth/test_plugin.c:65
```

A utilidade **addr2line** faz parte do pacote `binutils` no Linux.

Em Solaris, o procedimento é semelhante. O Solaris `printstack()` já imprime endereços relativos:

```sql
plugin/auth/auth_test_plugin.so:0x1510
```

Para traduzir, use este comando:

```sql
$> gaddr2line -fie auth_test_plugin.so 0x1510
mysql-trunk/plugin/auth/test_plugin.c:88
```

O Windows já imprime o endereço, o nome da função e a string:

```sql
000007FEF07E10A4 auth_test_plugin.dll!auth_test_plugin()[test_plugin.c:72]
```

#### 5.8.1.6 Usando logs do servidor para encontrar causas de erros no mysqld

Observe que, antes de começar a usar `mysqld` com o log de consulta geral habilitado, você deve verificar todas as suas tabelas com **myisamchk**. Veja o Capítulo 5, * Administração do Servidor MySQL *.

Se o `mysqld` morrer ou ficar parado, você deve começar a `mysqld` com o log de consulta geral habilitado. Veja a Seção 5.4.3, “O log de consulta geral”. Quando o `mysqld` morrer novamente, você pode examinar o final do arquivo de log para a consulta que matou o `mysqld`.

Se você usar o arquivo de log de consulta geral padrão, o log é armazenado no diretório do banco de dados como `host_name.log`. Na maioria dos casos, é a última consulta no arquivo de log que interrompeu `mysqld`, mas, se possível, você deve verificar isso reiniciando `mysqld` e executando a consulta encontrada a partir das ferramentas de string de comando do **mysql**. Se isso funcionar, você também deve testar todas as consultas complicadas que não foram concluídas.

Você também pode tentar o comando `EXPLAIN` em todas as declarações `SELECT` que levam um longo tempo para garantir que o `mysqld` esteja usando índices corretamente. Veja a Seção 13.8.2, “Declaração EXPLAIN”.

Você pode encontrar as consultas que levam muito tempo para executar, iniciando `mysqld` com o registro de consultas lentas habilitado. Veja a Seção 5.4.5, “O Registro de Consultas Lentas”.

Se você encontrar o texto `mysqld restarted` no log de erro (normalmente um arquivo chamado `host_name.err`), provavelmente encontrou uma consulta que faz com que o `mysqld` falhe. Se isso acontecer, você deve verificar todas as suas tabelas com **myisamchk** (veja o Capítulo 5, *Administração do Servidor MySQL*), e testar as consultas nos arquivos de log do MySQL para ver se uma delas falha. Se você encontrar tal consulta, tente primeiro atualizar para a versão mais recente do MySQL. Se isso não ajudar, reporte um erro, veja a Seção 1.5, “Como Relatar Erros ou Problemas”.

Se você iniciou `mysqld` com a variável de sistema `myisam_recover_options` definida, o MySQL verifica automaticamente e tenta reparar as tabelas `MyISAM` se elas estiverem marcadas como 'não fechadas corretamente' ou 'quebradas'. Se isso acontecer, o MySQL escreve uma entrada no arquivo `hostname.err` `'Warning: Checking table ...'` que é seguida por `Warning: Repairing table` se a tabela precisar ser reparada. Se você receber muitos desses erros, sem que o `mysqld` tenha morrido inesperadamente pouco antes, então algo está errado e precisa ser investigado mais a fundo. Veja a Seção 5.1.6, “Opções de Comando do Servidor”.

Quando o servidor detecta a corrupção da tabela `MyISAM`, ele escreve informações adicionais no log de erro, como o nome e o número da string do arquivo de origem e a lista de threads acessando a tabela. Exemplo: `Got an error from thread_id=1, mi_dynrec.c:368`. Essas são informações úteis para incluir em relatórios de bugs.

Não é um bom sinal se o `mysqld` morreu de forma inesperada, mas, neste caso, você não deve investigar as mensagens do `Checking table...`, mas sim tentar descobrir por que o `mysqld` morreu.

#### 5.8.1.7 Criando um Caso de Teste Se Você Experiências Corrupção de Tabela

O procedimento a seguir se aplica às tabelas `MyISAM`. Para informações sobre os passos a serem tomados ao encontrar corrupção na tabela `InnoDB`, consulte a Seção 1.5, “Como relatar erros ou problemas”.

Se você encontrar tabelas `MyISAM` corrompidas ou se o `mysqld` sempre falhar após algumas declarações de atualização, você pode testar se o problema é reprodutível fazendo o seguinte:

1. Parar o daemon do MySQL com **mysqladmin shutdown**.

2. Faça um backup das tabelas para se proteger contra o caso muito improvável de que a reparação faça algo errado.

3. Verifique todas as tabelas com **myisamchk -s database/\*.MYI**. Repare quaisquer tabelas corrompidas com **myisamchk -r database/*`table`*.MYI**.

4. Faça um segundo backup das tabelas. 5. Remova (ou afaste) quaisquer arquivos de registro antigos do diretório de dados do MySQL, se você precisar de mais espaço.

6. Inicie `mysqld` com o log binário habilitado. Se você deseja encontrar uma declaração que causa falha em `mysqld`, você deve iniciar o servidor com o log de consulta geral habilitado também. Veja a Seção 5.4.3, “O Log de Consulta Geral”, e a Seção 5.4.4, “O Log Binário”.

7. Quando você tiver obtido uma tabela quebrada, pare o servidor `mysqld`.

8. Restaure o backup. 9. Reinicie o servidor `mysqld` *sem* o log binário ativado.

10. Reexecute as declarações com **mysqlbinlog binary-log-file | mysql**. O log binário é salvo no diretório do banco de dados MySQL com o nome `hostname-bin.NNNNNN`.

11. Se as tabelas forem corrompidas novamente ou você conseguir fazer o `mysqld` morrer com o comando acima, você encontrou um erro reprodutível. Faça o upload das tabelas e do log binário para o nosso banco de bugs usando as instruções fornecidas na Seção 1.5, “Como relatar bugs ou problemas”. Se você é um cliente de suporte, pode usar o Centro de Suporte ao Cliente do MySQL (<https://www.mysql.com/support/>) para alertar a equipe do MySQL sobre o problema e fazê-lo corrigido o mais rápido possível.

### 5.8.2 Depuração de um cliente MySQL

Para poder depurar um cliente MySQL com o pacote de depuração integrado, você deve configurar o MySQL com `-DWITH_DEBUG=1`. Veja a Seção 2.8.7, “Opções de Configuração de Fonte MySQL”.

Antes de executar um cliente, você deve definir a variável de ambiente `MYSQL_DEBUG`:

```sql
$> MYSQL_DEBUG=d:t:O,/tmp/client.trace
$> export MYSQL_DEBUG
```

Isso faz com que os clientes gerem um arquivo de rastreamento em `/tmp/client.trace`.

Se você tiver problemas com seu próprio código de cliente, tente se conectar ao servidor e executar sua consulta usando um cliente que é conhecido por funcionar. Faça isso executando o **mysql** no modo de depuração (assumindo que você compilou o MySQL com depuração ativada):

```sql
$> mysql --debug=d:t:O,/tmp/client.trace
```

Isso fornece informações úteis caso você envie um relatório de bug. Veja a Seção 1.5, “Como relatar bugs ou problemas”.

Se o seu cliente falhar em algum código que parece legal, você deve verificar se o arquivo do seu `mysql.h` corresponde ao arquivo da sua biblioteca MySQL. Um erro muito comum é usar um arquivo antigo do `mysql.h` de uma instalação antiga do MySQL com a nova biblioteca MySQL.

### 5.8.3 O pacote DBUG

O servidor MySQL e a maioria dos clientes MySQL são compilados com o pacote `DBUG`, originalmente criado por Fred Fish. Quando você configurou o MySQL para depuração, este pacote permite obter um arquivo de rastreamento do que o programa está fazendo. Veja a Seção 5.8.1.2, “Criando arquivos de rastreamento”.

Esta seção resume os valores de argumento que você pode especificar nas opções de depuração na string de comando para os programas MySQL que foram construídos com suporte de depuração.

O pacote `DBUG` pode ser usado ao invocar um programa com a opção `--debug[=debug_options]` ou `-# [debug_options]`. Se você especificar a opção `--debug` ou `-#` sem um valor de *`debug_options`*, a maioria dos programas do MySQL usa um valor padrão. O padrão do servidor é `d:t:i:o,/tmp/mysqld.trace` no Unix e `d:t:i:O,\mysqld.trace` no Windows. O efeito desse padrão é:

* `d`: Habilitar saída para todas as macros de depuração
* `t`: Rastrear chamadas de função e saídas
* `i`: Adicionar PID às strings de saída
* `o,/tmp/mysqld.trace`, `O,\mysqld.trace`: Definir o arquivo de saída de depuração.

A maioria dos programas de cliente usa um valor padrão *`debug_options`* de `d:t:o,/tmp/program_name.trace`, independentemente da plataforma.

Aqui estão algumas strings de controle de depuração como elas podem ser especificadas em uma string de comando de shell:

```sql
--debug=d:t
--debug=d:f,main,subr1:F:L:t,20
--debug=d,input,output,files:n
--debug=d:t:i:O,\\mysqld.trace
```

Para `mysqld`, também é possível alterar as configurações de `DBUG` em tempo de execução, definindo a variável de sistema `debug`. Essa variável tem valores globais e de sessão:

```sql
mysql> SET GLOBAL debug = 'debug_options';
mysql> SET SESSION debug = 'debug_options';
```

Para alterar o valor global `debug`, são necessários privilégios suficientes para definir variáveis de sistema globais. Para alterar o valor da sessão `debug`, são necessários privilégios suficientes para definir variáveis de sistema de sessão restritas. Consulte a Seção 5.1.8.1, “Privilégios de variáveis de sistema”.

O valor *`debug_options`* é uma sequência de campos separados por vírgula:

```sql
field_1:field_2:...:field_N
```

Cada campo dentro do valor consiste em um caractere de sinal obrigatório, opcionalmente precedido por um caractere `+` ou `-`, e opcionalmente seguido por uma lista de modificadores separados por vírgula:

```sql
[+|-]flag[,modifier,modifier,...,modifier]
```

A tabela a seguir descreve os caracteres de bandeira permitidos. Os caracteres de bandeira não reconhecidos são ignorados silenciosamente.

<table frame="all" summary="Descriptions of permitted debug_options flag characters.">
<col style="width: 8%"/>
<col style="width: 92%"/>
<thead>
<tr>
<th>Flag*</th>
<th>Descrição</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>d</code>
</td>
<td>Ative a saída de<code>DBUG_<code>XXX</code></code>macros para o estado atual. Pode ser seguido por uma lista de palavras-chave, que permite a saída apenas para o<code>DBUG</code>macro com essa palavra-chave. Uma lista vazia de palavras-chave permite a saída para todas as macros.  
No MySQL, as palavras-chave comuns de macro de depuração para ativar são<code>enter</code>,<code>exit</code>,<code>error</code>,<code>warning</code>,<code>info</code>, e<code>loop</code>. 
      </td>
</tr>
<tr>
<td>
<code>D</code>
</td>
<td>Atraso após cada string de saída do depurador. O argumento é o atraso, em décimos de segundo, sujeito às capacidades da máquina. Por exemplo,<code>D,20</code>especifica um atraso de dois segundos.</td>
</tr>
<tr>
<td>
<code>f</code>
</td>
<td>Limite o depuração, o rastreamento e a perfilagem à lista de funções nomeadas. Uma lista vazia permite que todas as funções sejam executadas. O apropriado<code>d</code>ou<code>t</code>as bandeiras ainda devem ser dadas; essa bandeira apenas limita suas ações se estiverem habilitadas.</td>
</tr>
<tr>
<td>
<code>F</code>
</td>
<td>Identifique o nome do arquivo de origem para cada string de saída de depuração ou rastreamento.</td>
</tr>
<tr>
<td>
<code>i</code>
</td>
<td>Identifique o processo com o PID ou ID de thread para cada string de saída de depuração ou rastreamento.</td>
</tr>
<tr>
<td>
<code>L</code>
</td>
<td>Identifique o número de string do arquivo fonte para cada string de saída de depuração ou rastreamento.</td>
</tr>
<tr>
<td>
<code>n</code>
</td>
<td>Imprima a profundidade atual da função de encaixe para cada string de saída de depuração ou rastreamento.</td>
</tr>
<tr>
<td>
<code>N</code>
</td>
<td>Numerar cada string de saída de depuração.</td>
</tr>
<tr>
<td>
<code>o</code>
</td>
<td>Redirecione a saída da ferramenta de depuração para o arquivo especificado. A saída padrão é<code>stderr</code>. 
      </td>
</tr>
<tr>
<td>
<code>O</code>
</td>
<td>Como<code>o</code>, mas o arquivo é realmente apagado entre cada escrita. Quando necessário, o arquivo é fechado e reaberto entre cada escrita.</td>
</tr>
<tr>
<td>
<code>a</code>
</td>
<td>Como<code>o</code>, mas abre para adição.</td>
</tr>
<tr>
<td>
<code>A</code>
</td>
<td>Como<code>O</code>, mas abre para adição.</td>
</tr>
<tr>
<td>
<code>p</code>
</td>
<td>Limitar as ações do depurador a processos especificados. Um processo deve ser identificado com o<code>DBUG_PROCESS</code>Faça uma macro e selecione uma na lista para que as ações do depurador ocorram.</td>
</tr>
<tr>
<td>
<code>P</code>
</td>
<td>Imprima o nome do processo atual para cada string de saída de depuração ou rastreamento.</td>
</tr>
<tr>
<td>
<code>r</code>
</td>
<td>Ao empurrar um novo estado, não herde o nível de encadernação de funções do estado anterior. Útil quando o resultado deve começar na margem esquerda.</td>
</tr>
<tr>
<td>
<code>t</code>
</td>
<td>Ative strings de rastreamento de chamadas de função/saída. Pode ser seguido por uma lista (contendo apenas um modificador) que fornece um nível máximo numérico de rastreamento, além do qual não há saída para depuração ou macros de rastreamento. O padrão é uma opção de tempo de compilação.</td>
</tr>
<tr>
<td>
<code>T</code>
</td>
<td>Imprima o timestamp atual para cada string de saída.</td>
</tr>
</tbody>
</table>

O caractere principal `+` ou `-` e a lista de modificadores finais são usados para caracteres de bandeira, como `d` ou `f`, que podem permitir uma operação de depuração para todos os modificadores aplicáveis ou apenas alguns deles:

* Sem os valores de `+` ou `-` em destaque, o valor da bandeira é definido exatamente na lista de modificadores conforme fornecida.

* Com um `+` ou `-` principal, os modificadores na lista são adicionados ou subtraídos da lista atual de modificadores.

Os exemplos a seguir mostram como isso funciona para a bandeira `d`. Uma lista `d` vazia habilitou a saída para todas as macros de depuração. Uma lista não vazia habilita a saída apenas para as palavras-chave da macro na lista.

Essas declarações definem o valor `d` na lista de modificadores conforme fornecido:

```sql
mysql> SET debug = 'd';
mysql> SELECT @@debug;
+---------+
| @@debug |
+---------+
| d       |
+---------+
mysql> SET debug = 'd,error,warning';
mysql> SELECT @@debug;
+-----------------+
| @@debug         |
+-----------------+
| d,error,warning |
+-----------------+
```

Um líder `+` ou `-` adiciona ou subtrai do valor atual `d`:

```sql
mysql> SET debug = '+d,loop';
mysql> SELECT @@debug;
+----------------------+
| @@debug              |
+----------------------+
| d,error,warning,loop |
+----------------------+
mysql> SET debug = '-d,error,loop';
mysql> SELECT @@debug;
+-----------+
| @@debug   |
+-----------+
| d,warning |
+-----------+
```

Adicionar “todas as macros habilitadas” não resulta em nenhuma alteração:

```sql
mysql> SET debug = 'd';
mysql> SELECT @@debug;
+---------+
| @@debug |
+---------+
| d       |
+---------+
mysql> SET debug = '+d,loop';
mysql> SELECT @@debug;
+---------+
| @@debug |
+---------+
| d       |
+---------+
```

Desabilitando todas as macros habilitadas, a bandeira `d` é totalmente desativada:

```sql
mysql> SET debug = 'd,error,loop';
mysql> SELECT @@debug;
+--------------+
| @@debug      |
+--------------+
| d,error,loop |
+--------------+
mysql> SET debug = '-d,error,loop';
mysql> SELECT @@debug;
+---------+
| @@debug |
+---------+
|         |
+---------+
```

### 5.8.4 Rastreamento do mysqld usando DTrace

5.8.4.1 Referência da sonda DTrace mysqld

O suporte para DTrace é descontinuado no MySQL 5.7 e é removido no MySQL 8.0.

As sondas DTrace no servidor MySQL são projetadas para fornecer informações sobre a execução de consultas no MySQL e as diferentes áreas do sistema que estão sendo utilizadas durante esse processo. A organização e o disparo das sondas significam que a execução de uma consulta inteira pode ser monitorada com um nível de sondas (`query-start` e `query-done`) mas, ao monitorar outras sondas, você pode obter informações sucessivamente mais detalhadas sobre a execução da consulta em termos de os bloqueios utilizados, métodos de ordenação e até mesmo informações de execução nível de string por string e nível de banco de dados.

As sondas DTrace são organizadas de modo que você possa acompanhar todo o processo de consulta, desde o ponto de conexão de um cliente, passando pela execução da consulta, operações em nível de string e voltando novamente. Você pode pensar nas sondas como sendo disparadas dentro de uma sequência específica durante uma sequência típica de conexão/execução/desconexão do cliente, conforme mostrado na figura a seguir.

**Figura 5.1 Sequência de sonda DTrace**

![Example of a DTrace probe sequence during a typical client connect, execute, disconnect sequence.](images/dtrace-groups.png)

As informações globais são fornecidas nos argumentos das sondagens DTrace em vários níveis. As informações globais, ou seja, o ID de conexão e o usuário/host e, quando relevante, a string de consulta, são fornecidas em níveis chave (`connection-start`, `command-start`, `query-start` e `query-exec-start`). À medida que você se aprofunda nas sondagens, presume-se que você esteja interessado apenas nas execuções individuais (sondagens de nível de string fornecem informações apenas sobre o nome do banco de dados e da tabela), ou que você pretenda combinar as sondagens de nível de string com as sondagens parentais conceituais para fornecer as informações sobre uma consulta específica. Exemplos disso são fornecidos, pois o formato e os argumentos de cada sonda são fornecidos.

O MySQL inclui suporte para sondagens DTrace nessas plataformas:

* Solaris 10 Update 5 (Solaris 5/08) em plataformas SPARC, x86 e x86_64

* OS X/macOS 10.4 e superior * Oracle Linux 6 e superior com kernel UEK (a partir do MySQL 5.7.5)

A ativação das sondas deve ser automática nessas plataformas. Para habilitar ou desabilitar explicitamente as sondas durante a construção, use a opção `-DENABLE_DTRACE=1` ou `-DENABLE_DTRACE=0` no **CMake**.

Se uma plataforma que não é Solaris incluir suporte ao DTrace, a construção do `mysqld` nessa plataforma inclui suporte ao DTrace.

#### Recursos adicionais

* Para mais informações sobre o DTrace e a escrita de scripts DTrace, leia o Guia do Usuário do DTrace.

* Para uma introdução ao DTrace, consulte o artigo MySQL Dev Zone "Começando com DTracing MySQL".

#### 5.8.4.1 Referência do Probe mysqld DTrace

O MySQL suporta as seguintes sondagens estáticas, organizadas em grupos de funcionalidade.

**Tabela 5.5 Provas DTrace do MySQL**

<table>
<thead>
<tr>
<th>Group</th>
<th>Sondas</th>
</tr>
</thead>
<tbody>
<tr>
<td>Connection</td>
<td><code>connection-start</code>,<code>connection-done</code></td>
</tr>
<tr>
<td>Command</td>
<td><code>command-start</code>,<code>command-done</code></td>
</tr>
<tr>
<td>Query</td>
<td><code>query-start</code>,<code>query-done</code></td>
</tr>
<tr>
<td>Query Parsing</td>
<td><code>query-parse-start</code>,<code>query-parse-done</code></td>
</tr>
<tr>
<td>Query Cache</td>
<td><code>query-cache-hit</code>,<code>query-cache-miss</code></td>
</tr>
<tr>
<td>Query Execution</td>
<td><code>query-exec-start</code>,<code>query-exec-done</code></td>
</tr>
<tr>
<td>Row Level</td>
<td><code>insert-row-start</code>,<code>insert-row-done</code></td>
</tr>
<tr>
<td></td>
<td><code>update-row-start</code>,<code>update-row-done</code></td>
</tr>
<tr>
<td></td>
<td><code>delete-row-start</code>,<code>delete-row-done</code></td>
</tr>
<tr>
<td>Row Reads</td>
<td><code>read-row-start</code>,<code>read-row-done</code></td>
</tr>
<tr>
<td>Index Reads</td>
<td><code>index-read-row-start</code>,<code>index-read-row-done</code></td>
</tr>
<tr>
<td>Lock</td>
<td><code>handler-rdlock-start</code>,<code>handler-rdlock-done</code></td>
</tr>
<tr>
<td></td>
<td><code>handler-wrlock-start</code>,<code>handler-wrlock-done</code></td>
</tr>
<tr>
<td></td>
<td><code>handler-unlock-start</code>,<code>handler-unlock-done</code></td>
</tr>
<tr>
<td>Filesort</td>
<td><code>filesort-start</code>,<code>filesort-done</code></td>
</tr>
<tr>
<td>Statement</td>
<td><code>select-start</code>,<code>select-done</code></td>
</tr>
<tr>
<td></td>
<td><code>insert-start</code>,<code>insert-done</code></td>
</tr>
<tr>
<td></td>
<td><code>insert-select-start</code>,<code>insert-select-done</code></td>
</tr>
<tr>
<td></td>
<td><code>update-start</code>,<code>update-done</code></td>
</tr>
<tr>
<td></td>
<td><code>multi-update-start</code>,<code>multi-update-done</code></td>
</tr>
<tr>
<td></td>
<td><code>delete-start</code>,<code>delete-done</code></td>
</tr>
<tr>
<td></td>
<td><code>multi-delete-start</code>,<code>multi-delete-done</code></td>
</tr>
<tr>
<td>Network</td>
<td><code>net-read-start</code>,<code>net-read-done</code>,<code>net-write-start</code>,<code>net-write-done</code></td>
</tr>
<tr>
<td>Keycache</td>
<td><code>keycache-read-start</code>,<code>keycache-read-block</code>,<code>keycache-read-done</code>,<code>keycache-read-hit</code>,<code>keycache-read-miss</code>,<code>keycache-write-start</code>,<code>keycache-write-block</code>,<code>keycache-write-done</code></td>
</tr>
</tbody>
</table>

Nota

Ao extrair os dados do argumento das sondas, cada argumento está disponível como `argN`, começando com `arg0`. Para identificar cada argumento dentro das definições, eles são fornecidos com um nome descritivo, mas você deve acessar as informações usando o parâmetro correspondente `argN`.

##### 5.8.4.1.1 Provas de conexão

As sondas `connection-start` e `connection-done` encerram uma conexão de um cliente, independentemente de a conexão ser feita por meio de uma conexão de soquete ou rede.

```sql
connection-start(connectionid, user, host)
connection-done(status, connectionid)
```

* `connection-start`: Desempenha-se após uma conexão e login/autenticação bem-sucedidos terem sido concluídos por um cliente. Os argumentos contêm as informações de conexão:

+ `connectionid`: Um `unsigned long` contendo o ID de conexão. Isso é o mesmo que o ID de processo mostrado como o valor `Id` na saída de `SHOW PROCESSLIST`.

+ `user`: O nome de usuário usado na autenticação. O valor é em branco para o usuário anônimo.

+ `host`: O hospedeiro da conexão do cliente. Para uma conexão feita usando sockets Unix, o valor é em branco.

* `connection-done`: Desencambrado logo após a conexão com o cliente ter sido fechada. Os argumentos são:

+ `status`: O estado da conexão quando ela foi fechada. Uma operação de logout tem um valor de 0; qualquer outra terminação da conexão tem um valor não nulo.

+ `connectionid`: O ID de conexão da conexão que foi fechada.

O seguinte script D quantifica e resume a duração média das conexões individuais e fornece um contador, descarregando as informações a cada 60 segundos:

```sql
#!/usr/sbin/dtrace -s


mysql*:::connection-start
{
  self->start = timestamp;
}

mysql*:::connection-done
/self->start/
{
  @ = quantize(((timestamp - self->start)/1000000));
  self->start = 0;
}

tick-60s
{
  printa(@);
}
```

Quando executado em um servidor com um grande número de clientes, você pode ver uma saída semelhante a esta:

```sql
  1  57413                        :tick-60s

           value  ------------- Distribution ------------- count
              -1 |                                         0
               0 |@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 30011
               1 |                                         59
               2 |                                         5
               4 |                                         20
               8 |                                         29
              16 |                                         18
              32 |                                         27
              64 |                                         30
             128 |                                         11
             256 |                                         10
             512 |                                         1
            1024 |                                         6
            2048 |                                         8
            4096 |                                         9
            8192 |                                         8
           16384 |                                         2
           32768 |                                         1
           65536 |                                         1
          131072 |                                         0
          262144 |                                         1
524288 |                                         0
```

##### 5.8.4.1.2 Provas de comando

Os comandos de sondagem são executados antes e depois de um comando do cliente ser executado, incluindo qualquer declaração SQL que possa ser executada durante esse período. Os comandos incluem operações como a inicialização do banco de dados, o uso da operação `COM_CHANGE_USER` (suportada pelo protocolo MySQL) e a manipulação de declarações preparadas. Muitos desses comandos são usados apenas pela API do cliente MySQL de vários conectores, como PHP e Java.

```sql
command-start(connectionid, command, user, host)
command-done(status)
```

* `command-start`: Descarregado quando um comando é enviado ao servidor.

+ `connectionid`: O ID de conexão do cliente que executa o comando.

+ `command`: Um número inteiro que representa o comando que foi executado. Os valores possíveis estão mostrados na tabela a seguir.

<table summary="Possible command-start command values and a name and description for each.">
<thead>
<tr>
<th>Value*</th>
<th>Name*</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<th>00</th>
<td>COM_SLEEP</td>
<td>Internal thread state</td>
</tr>
<tr>
<th>01</th>
<td>COM_QUIT</td>
<td>Close connection</td>
</tr>
<tr>
<th>02</th>
<td>COM_INIT_DB</td>
<td>Selecionar banco de dados (<code>USE ...</code>)</td>
</tr>
<tr>
<th>03</th>
<td>COM_QUERY</td>
<td>Execute a query</td>
</tr>
<tr>
<th>04</th>
<td>COM_FIELD_LIST</td>
<td>Get a list of fields</td>
</tr>
<tr>
<th>05</th>
<td>COM_CREATE_DB</td>
<td>Create a database (deprecated)</td>
</tr>
<tr>
<th>06</th>
<td>COM_DROP_DB</td>
<td>Drop a database (deprecated)</td>
</tr>
<tr>
<th>07</th>
<td>COM_REFRESH</td>
<td>Refresh connection</td>
</tr>
<tr>
<th>08</th>
<td>COM_SHUTDOWN</td>
<td>Shutdown server</td>
</tr>
<tr>
<th>09</th>
<td>COM_STATISTICS</td>
<td>Get statistics</td>
</tr>
<tr>
<th>10</th>
<td>COM_PROCESS_INFO</td>
<td>Obtenha processos (<code>SHOW PROCESSLIST</code>)</td>
</tr>
<tr>
<th>11</th>
<td>COM_CONNECT</td>
<td>Initialize connection</td>
</tr>
<tr>
<th>12</th>
<td>COM_PROCESS_KILL</td>
<td>Kill process</td>
</tr>
<tr>
<th>13</th>
<td>COM_DEBUG</td>
<td>Get debug information</td>
</tr>
<tr>
<th>14</th>
<td>COM_PING</td>
<td>Ping</td>
</tr>
<tr>
<th>15</th>
<td>COM_TIME</td>
<td>Internal thread state</td>
</tr>
<tr>
<th>16</th>
<td>COM_DELAYED_INSERT</td>
<td>Internal thread state</td>
</tr>
<tr>
<th>17</th>
<td>COM_CHANGE_USER</td>
<td>Change user</td>
</tr>
<tr>
<th>18</th>
<td>COM_BINLOG_DUMP</td>
<td>Utilizado por uma réplica ou<strong>mysqlbinlog</strong>para iniciar uma leitura de registro binário</td>
</tr>
<tr>
<th>19</th>
<td>COM_TABLE_DUMP</td>
<td>Utilizado por uma réplica para obter as informações da tabela de origem</td>
</tr>
<tr>
<th>20</th>
<td>COM_CONNECT_OUT</td>
<td>Utilizado por uma réplica para registrar uma conexão com o servidor</td>
</tr>
<tr>
<th>21</th>
<td>COM_REGISTER_SLAVE</td>
<td>Utilizado por uma réplica durante o registro</td>
</tr>
<tr>
<th>22</th>
<td>COM_STMT_PREPARE</td>
<td>Prepare a statement</td>
</tr>
<tr>
<th>23</th>
<td>COM_STMT_EXECUTE</td>
<td>Execute a statement</td>
</tr>
<tr>
<th>24</th>
<td>COM_STMT_SEND_LONG_DATA</td>
<td>Utilizado por um cliente ao solicitar dados estendidos</td>
</tr>
<tr>
<th>25</th>
<td>COM_STMT_CLOSE</td>
<td>Close a prepared statement</td>
</tr>
<tr>
<th>26</th>
<td>COM_STMT_RESET</td>
<td>Reset a prepared statement</td>
</tr>
<tr>
<th>27</th>
<td>COM_SET_OPTION</td>
<td>Set a server option</td>
</tr>
<tr>
<th>28</th>
<td>COM_STMT_FETCH</td>
<td>Fetch a prepared statement</td>
</tr>
</tbody>
</table>

+ `user`: O usuário que executa o comando.

+ `host`: O host do cliente.
* `command-done`: Desempenha quando a execução do comando é concluída. O argumento `status` contém 0 se o comando foi executado com sucesso, ou 1 se a declaração foi encerrada antes da conclusão normal.

As sondas `command-start` e `command-done` são as melhores quando usadas em conjunto com as sondas de declaração para obter uma ideia do tempo de execução geral.

##### 5.8.4.1.3 Provas de consulta

As sondas `query-start` e `query-done` são acionadas quando uma consulta específica é recebida pelo servidor e quando a consulta foi concluída e as informações foram enviadas com sucesso ao cliente.

```sql
query-start(query, connectionid, database, user, host)
query-done(status)
```

* `query-start`: Desenvolvido após a string de consulta ter sido recebida do cliente. Os argumentos são:

+ `query`: O texto completo da consulta enviada.

+ `connectionid`: O ID de conexão do cliente que enviou a consulta. O ID de conexão é igual ao ID de conexão retornado quando o cliente se conecta pela primeira vez e ao valor do `Id` na saída do `SHOW PROCESSLIST`.

+ `database`: O nome do banco de dados no qual a consulta está sendo executada.

+ `user`: O nome de usuário usado para se conectar ao servidor.

+ `host`: O nome de domínio do cliente.
* `query-done`: Desacelera uma vez que a consulta foi executada e as informações foram devolvidas ao cliente. A sonda inclui um único argumento, `status`, que retorna 0 quando a consulta é executada com sucesso e 1 se houve um erro.

Você pode obter um relatório simples do tempo de execução para cada consulta usando o seguinte script D:

```sql
#!/usr/sbin/dtrace -s

#pragma D option quiet

dtrace:::BEGIN
{
   printf("%-20s %-20s %-40s %-9s\n", "Who", "Database", "Query", "Time(ms)");
}

mysql*:::query-start
{
   self->query = copyinstr(arg0);
   self->connid = arg1;
   self->db    = copyinstr(arg2);
   self->who   = strjoin(copyinstr(arg3),strjoin("@",copyinstr(arg4)));
   self->querystart = timestamp;
}

mysql*:::query-done
{
   printf("%-20s %-20s %-40s %-9d\n",self->who,self->db,self->query,
          (timestamp - self->querystart) / 1000000);
}
```

Ao executar o script acima, você deve obter uma ideia básica do tempo de execução de suas consultas:

```sql
$> ./query.d
Who                  Database             Query                                    Time(ms)
root@localhost       test                 select * from t1 order by i limit 10     0
root@localhost       test                 set global query_cache_size=0            0
root@localhost       test                 select * from t1 order by i limit 10     776
root@localhost       test                 select * from t1 order by i limit 10     773
root@localhost       test                 select * from t1 order by i desc limit 10 795
```

##### 5.8.4.1.4 Análise de Provas de Particionamento de Consulta

As inspeções de análise de consulta são acionadas antes da declaração SQL original ser analisada e quando a análise da declaração e a determinação do modelo de execução necessário para processar a declaração são concluídas:

```sql
query-parse-start(query)
query-parse-done(status)
```

* `query-parse-start`: Desencaminhado logo antes da declaração ser analisada pelo analisador de consultas do MySQL. O único argumento, `query`, é uma string que contém o texto completo da consulta original.

* `query-parse-done`: Desempenha-se quando a análise da declaração original foi concluída. O `status` é um número inteiro que descreve o status da operação. Um `0` indica que a consulta foi analisada com sucesso. Um `1` indica que a análise da consulta falhou.

Por exemplo, você pode monitorar o tempo de execução para a análise de uma consulta específica usando o seguinte script D:

```sql
#!/usr/sbin/dtrace -s

#pragma D option quiet

mysql*:::query-parse-start
{
   self->parsestart = timestamp;
   self->parsequery = copyinstr(arg0);
}

mysql*:::query-parse-done
/arg0 == 0/
{
   printf("Parsing %s: %d microseconds\n", self->parsequery,((timestamp - self->parsestart)/1000));
}

mysql*:::query-parse-done
/arg0 != 0/
{
   printf("Error parsing %s: %d microseconds\n", self->parsequery,((timestamp - self->parsestart)/1000));
}
```

No script acima, um predicado é usado em `query-parse-done` para gerar uma saída diferente com base no valor de status da sonda.

Ao executar o script e monitorar a execução:

```sql
$> ./query-parsing.d
Error parsing select from t1 join (t2) on (t1.i = t2.i) order by t1.s,t1.i limit 10: 36 ms
Parsing select * from t1 join (t2) on (t1.i = t2.i) order by t1.s,t1.i limit 10: 176 ms
```

##### 5.8.4.1.5 Provas do cache de consulta

Os testes de cache de consulta são executados ao executar qualquer consulta. A consulta `query-cache-hit` é acionada quando uma consulta existe no cache de consulta e pode ser usada para retornar as informações do cache de consulta. Os argumentos contêm o texto da consulta original e o número de strings devolvidas a partir do cache de consulta para a consulta. Se a consulta não estiver no cache de consulta, ou o cache de consulta não estiver habilitado, então o teste `query-cache-miss` é acionado em vez disso.

```sql
query-cache-hit(query, rows)
query-cache-miss(query)
```

* `query-cache-hit`: Desempenha quando a consulta foi encontrada no cache de consulta. O primeiro argumento, `query`, contém o texto original da consulta. O segundo argumento, `rows`, é um número inteiro que contém o número de strings na consulta cacheada.

* `query-cache-miss`: Desencaminhado quando a consulta não é encontrada no cache de consultas. O primeiro argumento, `query`, contém o texto original da consulta.

Os testes de cache de consulta são melhor combinados com um teste da consulta principal, para que você possa determinar as diferenças nos tempos entre o uso ou não do cache de consulta para consultas especificadas. Por exemplo, no seguinte script D, as informações da consulta e do cache de consulta são combinadas na saída de informações durante o monitoramento:

```sql
#!/usr/sbin/dtrace -s

#pragma D option quiet

dtrace:::BEGIN
{
   printf("%-20s %-20s %-40s %2s %-9s\n", "Who", "Database", "Query", "QC", "Time(ms)");
}

mysql*:::query-start
{
   self->query = copyinstr(arg0);
   self->connid = arg1;
   self->db    = copyinstr(arg2);
   self->who   = strjoin(copyinstr(arg3),strjoin("@",copyinstr(arg4)));
   self->querystart = timestamp;
   self->qc = 0;
}

mysql*:::query-cache-hit
{
   self->qc = 1;
}

mysql*:::query-cache-miss
{
   self->qc = 0;
}

mysql*:::query-done
{
   printf("%-20s %-20s %-40s %-2s %-9d\n",self->who,self->db,self->query,(self->qc ? "Y" : "N"),
          (timestamp - self->querystart) / 1000000);
}
```

Ao executar o script, você pode ver os efeitos do cache de consulta. Inicialmente, o cache de consulta está desativado. Se você definir o tamanho do cache de consulta e, em seguida, executar a consulta várias vezes, você deve ver que o cache de consulta está sendo usado para retornar os dados da consulta:

```sql
$> ./query-cache.d
root@localhost       test                 select * from t1 order by i limit 10     N  1072
root@localhost                            set global query_cache_size=262144       N  0
root@localhost       test                 select * from t1 order by i limit 10     N  781
root@localhost       test                 select * from t1 order by i limit 10     Y  0
```

##### 5.8.4.1.6 Análise de execução de consultas

A sonda de execução da consulta é acionada quando a execução real da consulta começa, após a análise e verificação do cache da consulta, mas antes de quaisquer verificações de privilégio ou otimização. Ao comparar a diferença entre as sondas de início e término, você pode monitorar o tempo realmente gasto atendendo à consulta (em vez de apenas lidar com a análise e outros elementos da consulta).

```sql
query-exec-start(query, connectionid, database, user, host, exec_type)
query-exec-done(status)
```

Nota

As informações fornecidas nos argumentos para `query-start` e `query-exec-start` são quase idênticas e projetadas para que você possa optar por monitorar o processo de consulta inteira (usando `query-start`) ou apenas a execução (usando `query-exec-start`) enquanto expõe as informações principais sobre o usuário, o cliente e a consulta que está sendo executada.

* `query-exec-start`: Desencaminhado quando a execução de uma consulta individual é iniciada. Os argumentos são:

+ `query`: O texto completo da consulta enviada.

+ `connectionid`: O ID de conexão do cliente que enviou a consulta. O ID de conexão é igual ao ID de conexão retornado quando o cliente se conecta pela primeira vez e ao valor do `Id` na saída do `SHOW PROCESSLIST`.

+ `database`: O nome do banco de dados no qual a consulta está sendo executada.

+ `user`: O nome de usuário usado para se conectar ao servidor.

+ `host`: O nome de domínio do cliente.  
  + `exec_type`: O tipo de execução. Os tipos de execução são determinados com base no conteúdo da consulta e no local em que ela foi enviada. Os valores para cada tipo estão mostrados na tabela a seguir.

    <table summary="exec_type values."><col style="width: 10%"/><col style="width: 90%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Consulta executada a partir de sql_parse, consulta de nível superior.</td> </tr><tr> <td>1</td> <td>Declaração preparada executada</td> </tr><tr> <td>2</td> <td>Instrução de cursor executada</td> </tr><tr> <td>3</td> <td>Consulta executada em procedimento armazenado</td> </tr></tbody></table>

* `query-exec-done`: Desencaminhado quando a execução da consulta foi concluída. A sonda inclui um único argumento, `status`, que retorna 0 quando a consulta é executada com sucesso e 1 se houve um erro.

##### 5.8.4.1.7 Sondas de nível de string

As `*row-{start,done}` são acionadas sempre que uma operação de string é empurrada para um motor de armazenamento. Por exemplo, se você executar uma declaração `INSERT` com 100 strings de dados, então as `insert-row-start` e `insert-row-done` são acionadas 100 vezes cada, para cada inserção de string.

```sql
insert-row-start(database, table)
insert-row-done(status)

update-row-start(database, table)
update-row-done(status)

delete-row-start(database, table)
delete-row-done(status)
```

* `insert-row-start`: Ativado antes de uma string ser inserida em uma tabela.

* `insert-row-done`: Descoberto após uma string ser inserida em uma tabela.

* `update-row-start`: Ativado antes de uma string ser atualizada em uma tabela.

* `update-row-done`: Ativado antes de uma string ser atualizada em uma tabela.

* `delete-row-start`: Ativado antes de uma string ser excluída de uma tabela.

* `delete-row-done`: Ativado antes de uma string ser excluída de uma tabela.

Os argumentos suportados pelas sondas são consistentes para as sondas correspondentes `start` e `done` em cada caso:

* `database`: O nome do banco de dados.  
* `table`: O nome da tabela.  
* `status`: O status; 0 para sucesso ou 1 para falha.

Como as sondagens de nível de string são acionadas para cada acesso individual à string, essas sondagens podem ser acionadas muitas milhares de vezes por segundo, o que pode ter um efeito prejudicial tanto no script de monitoramento quanto no MySQL. O ambiente DTrace deve limitar o acionamento dessas sondagens para evitar que o desempenho seja afetado negativamente. Ou use as sondagens com parcimônia, ou use funções de contagem ou agregação para relatar essas sondagens e, em seguida, forneça um resumo quando o script termina ou como parte de uma sondagem `query-done` ou `query-exec-done`.

O seguinte exemplo de script resume a duração de cada operação de string dentro de uma consulta maior:

```sql
#!/usr/sbin/dtrace -s

#pragma D option quiet

dtrace:::BEGIN
{
   printf("%-2s %-10s %-10s %9s %9s %-s \n",
          "St", "Who", "DB", "ConnID", "Dur ms", "Query");
}

mysql*:::query-start
{
   self->query = copyinstr(arg0);
   self->who   = strjoin(copyinstr(arg3),strjoin("@",copyinstr(arg4)));
   self->db    = copyinstr(arg2);
   self->connid = arg1;
   self->querystart = timestamp;
   self->rowdur = 0;
}

mysql*:::query-done
{
   this->elapsed = (timestamp - self->querystart) /1000000;
   printf("%2d %-10s %-10s %9d %9d %s\n",
          arg0, self->who, self->db,
          self->connid, this->elapsed, self->query);
}

mysql*:::query-done
/ self->rowdur /
{
   printf("%34s %9d %s\n", "", (self->rowdur/1000000), "-> Row ops");
}

mysql*:::insert-row-start
{
   self->rowstart = timestamp;
}

mysql*:::delete-row-start
{
   self->rowstart = timestamp;
}

mysql*:::update-row-start
{
   self->rowstart = timestamp;
}

mysql*:::insert-row-done
{
   self->rowdur += (timestamp-self->rowstart);
}

mysql*:::delete-row-done
{
   self->rowdur += (timestamp-self->rowstart);
}

mysql*:::update-row-done
{
   self->rowdur += (timestamp-self->rowstart);
}
```

Ao executar o script acima com uma consulta que insere dados em uma tabela, você pode monitorar o tempo exato gasto na inserção de string bruta:

```sql
St Who        DB            ConnID    Dur ms Query
 0 @localhost test              13     20767 insert into t1(select * from t2)
                                        4827 -> Row ops
```

##### 5.8.4.1.8 Leitura de sondagens de string

As sondas de string de leitura são acionadas em nível do mecanismo de armazenamento a cada vez que ocorre uma operação de leitura de string. Essas sondas são especificadas dentro de cada mecanismo de armazenamento (ao contrário das sondas `*row-start` que estão na interface do mecanismo de armazenamento). Portanto, essas sondas podem ser usadas para monitorar operações individuais de nível de string do mecanismo de armazenamento e desempenho. Como essas sondas são acionadas ao redor da interface de leitura de string do mecanismo de armazenamento, elas podem ser atingidas em um número significativo de vezes durante uma consulta básica.

```sql
read-row-start(database, table, scan_flag)
read-row-done(status)
```

* `read-row-start`: Desencaminhado quando uma string é lida pelo motor de armazenamento a partir do especificado `database` e `table`. O `scan_flag` é definido como 1 (verdadeiro) quando a leitura faz parte de uma varredura de tabela (ou seja, uma leitura sequencial), ou 0 (falso) quando a leitura é de um registro específico.

* `read-row-done`: Desempenha quando uma operação de leitura de string dentro de um motor de armazenamento é concluída. O `status` retorna 0 em caso de sucesso, ou um valor positivo em caso de falha.

##### 5.8.4.1.9 Sondas de índice

Os índices de sondagem são acionados sempre que uma string é lida usando um dos índices para a tabela especificada. A sonda é acionada dentro do motor de armazenamento correspondente à tabela.

```sql
index-read-row-start(database, table)
index-read-row-done(status)
```

* `index-read-row-start`: Desencaminhado quando uma string é lida pelo motor de armazenamento a partir do especificado `database` e `table`.

* `index-read-row-done`: Desempenha quando uma operação de leitura de string indexada dentro de um mecanismo de armazenamento é concluída. O `status` retorna 0 em caso de sucesso, ou um valor positivo em caso de falha.

##### 5.8.4.1.10 Provas de bloqueio

As sondagens de bloqueio são chamadas sempre que um bloqueio externo é solicitado pelo MySQL para uma tabela usando o mecanismo de bloqueio correspondente na tabela, conforme definido pelo tipo do motor da tabela. Existem três tipos diferentes de bloqueio, o bloqueio de leitura, o bloqueio de escrita e as operações de desbloqueio. Usando as sondagens, você pode determinar a duração da rotina de bloqueio externo (ou seja, o tempo necessário para o motor de armazenamento implementar o bloqueio, incluindo qualquer tempo de espera para que outro bloqueio se torne livre) e a duração total do processo de bloqueio/desbloqueio.

```sql
handler-rdlock-start(database, table)
handler-rdlock-done(status)

handler-wrlock-start(database, table)
handler-wrlock-done(status)

handler-unlock-start(database, table)
handler-unlock-done(status)
```

* `handler-rdlock-start`: Desempenha quando um bloqueio de leitura é solicitado no especificado `database` e `table`.

* `handler-wrlock-start`: Desempenha quando um bloqueio de escrita é solicitado no especificado `database` e `table`.

* `handler-unlock-start`: Desacelera quando um pedido de desbloqueio é feito nos especificados `database` e `table`.

* `handler-rdlock-done`: Desacelera quando um pedido de bloqueio de leitura é concluído. O `status` é 0 se a operação de bloqueio tiver sido bem-sucedida, ou `>0` em caso de falha.

* `handler-wrlock-done`: Desacelera quando um pedido de bloqueio de escrita é concluído. O `status` é 0 se a operação de bloqueio tiver sido bem-sucedida, ou `>0` em caso de falha.

* `handler-unlock-done`: Desencaminhado quando um pedido de desbloqueio é concluído. O `status` é 0 se a operação de desbloqueio tiver sido bem-sucedida, ou `>0` em caso de falha.

Você pode usar arrays para monitorar o bloqueio e o desbloqueio de tabelas individuais e, em seguida, calcular a duração do bloqueio completo da tabela usando o seguinte script:

```sql
#!/usr/sbin/dtrace -s

#pragma D option quiet

mysql*:::handler-rdlock-start
{
   self->rdlockstart = timestamp;
   this->lockref = strjoin(copyinstr(arg0),strjoin("@",copyinstr(arg1)));
   self->lockmap[this->lockref] = self->rdlockstart;
   printf("Start: Lock->Read   %s.%s\n",copyinstr(arg0),copyinstr(arg1));
}

mysql*:::handler-wrlock-start
{
   self->wrlockstart = timestamp;
   this->lockref = strjoin(copyinstr(arg0),strjoin("@",copyinstr(arg1)));
   self->lockmap[this->lockref] = self->rdlockstart;
   printf("Start: Lock->Write  %s.%s\n",copyinstr(arg0),copyinstr(arg1));
}

mysql*:::handler-unlock-start
{
   self->unlockstart = timestamp;
   this->lockref = strjoin(copyinstr(arg0),strjoin("@",copyinstr(arg1)));
   printf("Start: Lock->Unlock %s.%s (%d ms lock duration)\n",
          copyinstr(arg0),copyinstr(arg1),
          (timestamp - self->lockmap[this->lockref])/1000000);
}

mysql*:::handler-rdlock-done
{
   printf("End:   Lock->Read   %d ms\n",
          (timestamp - self->rdlockstart)/1000000);
}

mysql*:::handler-wrlock-done
{
   printf("End:   Lock->Write  %d ms\n",
          (timestamp - self->wrlockstart)/1000000);
}

mysql*:::handler-unlock-done
{
   printf("End:   Lock->Unlock %d ms\n",
          (timestamp - self->unlockstart)/1000000);
}
```

Quando executado, você deve obter informações tanto sobre a duração do próprio processo de bloqueio quanto sobre os bloqueios em uma tabela específica:

```sql
Start: Lock->Read   test.t2
End:   Lock->Read   0 ms
Start: Lock->Unlock test.t2 (25743 ms lock duration)
End:   Lock->Unlock 0 ms
Start: Lock->Read   test.t2
End:   Lock->Read   0 ms
Start: Lock->Unlock test.t2 (1 ms lock duration)
End:   Lock->Unlock 0 ms
Start: Lock->Read   test.t2
End:   Lock->Read   0 ms
Start: Lock->Unlock test.t2 (1 ms lock duration)
End:   Lock->Unlock 0 ms
Start: Lock->Read   test.t2
End:   Lock->Read   0 ms
```

##### 5.8.4.1.11 Provas de Filesort

As verificações de filesort são acionadas sempre que uma operação de filesort é aplicada a uma tabela. Para mais informações sobre filesort e as condições sob as quais ele ocorre, consulte a Seção 8.2.1.14, “Otimização de ORDER BY”.

```sql
filesort-start(database, table)
filesort-done(status, rows)
```

* `filesort-start`: Desencaminhado quando a operação de filesort começa em uma tabela. Os dois argumentos da sonda, `database` e `table`, identificam a tabela que está sendo ordenada.

* `filesort-done`: Desempenha quando a operação de filesort é concluída. Dois argumentos são fornecidos, o `status` (0 para sucesso, 1 para falha) e o número de strings ordenadas durante o processo de filesort.

Um exemplo disso é o seguinte script, que acompanha a duração do processo de filesort, além da duração da consulta principal:

```sql
#!/usr/sbin/dtrace -s

#pragma D option quiet

dtrace:::BEGIN
{
   printf("%-2s %-10s %-10s %9s %18s %-s \n",
          "St", "Who", "DB", "ConnID", "Dur microsec", "Query");
}

mysql*:::query-start
{
   self->query = copyinstr(arg0);
   self->who   = strjoin(copyinstr(arg3),strjoin("@",copyinstr(arg4)));
   self->db    = copyinstr(arg2);
   self->connid = arg1;
   self->querystart = timestamp;
   self->filesort = 0;
   self->fsdb = "";
   self->fstable = "";
}

mysql*:::filesort-start
{
  self->filesort = timestamp;
  self->fsdb = copyinstr(arg0);
  self->fstable = copyinstr(arg1);
}

mysql*:::filesort-done
{
   this->elapsed = (timestamp - self->filesort) /1000;
   printf("%2d %-10s %-10s %9d %18d Filesort on %s\n",
          arg0, self->who, self->fsdb,
          self->connid, this->elapsed, self->fstable);
}

mysql*:::query-done
{
   this->elapsed = (timestamp - self->querystart) /1000;
   printf("%2d %-10s %-10s %9d %18d %s\n",
          arg0, self->who, self->db,
          self->connid, this->elapsed, self->query);
}
```

Executando uma consulta em uma tabela grande com uma cláusula `ORDER BY` que desencadeia um filesort, e depois criando um índice na tabela e repetindo a mesma consulta, você pode ver a diferença na velocidade de execução:

```sql
St Who        DB            ConnID       Dur microsec Query
 0 @localhost test              14           11335469 Filesort on t1
 0 @localhost test              14           11335787 select * from t1 order by i limit 100
 0 @localhost test              14          466734378 create index t1a on t1 (i)
 0 @localhost test              14              26472 select * from t1 order by i limit 100
```

##### 5.8.4.1.12 Provas de sonda

As declarações individuais de sondagem são fornecidas para fornecer informações específicas sobre diferentes tipos de declarações. Para as sondagens de início, a string da consulta é fornecida como o único argumento. Dependendo do tipo de declaração, as informações fornecidas pela sonda correspondente podem diferir. Para todas as sondagens de término, o status da operação (`0` para sucesso, `>0` para falha) é fornecido. Para as operações `SELECT`, `INSERT`, `INSERT ... (SELECT FROM ...)`, `DELETE` e `DELETE FROM t1,t2`, o número de strings afetadas é retornado.

Para as declarações `UPDATE` e `UPDATE t1,t2 ...`, o número de strings correspondentes e o número de strings que realmente foram alteradas são fornecidos. Isso ocorre porque o número de strings que realmente correspondem à cláusula correspondente `WHERE` e o número de strings que foram alteradas podem diferir. O MySQL não atualiza o valor de uma string se o valor já corresponder ao novo ajuste.

```sql
select-start(query)
select-done(status,rows)

insert-start(query)
insert-done(status,rows)

insert-select-start(query)
insert-select-done(status,rows)

update-start(query)
update-done(status,rowsmatched,rowschanged)

multi-update-start(query)
multi-update-done(status,rowsmatched,rowschanged)

delete-start(query)
delete-done(status,rows)

multi-delete-start(query)
multi-delete-done(status,rows)
```

* `select-start`: Ativado antes de uma declaração `SELECT`.

* `select-done`: Desatado no final de uma declaração `SELECT`.

* `insert-start`: Ativado antes de uma declaração `INSERT`.

* `insert-done`: Desatado no final de uma declaração `INSERT`.

* `insert-select-start`: Ativado antes de uma declaração `INSERT ... SELECT`.

* `insert-select-done`: Desatado no final de uma declaração `INSERT ... SELECT`.

* `update-start`: Ativado antes de uma declaração `UPDATE`.

* `update-done`: Desatado no final de uma declaração de `UPDATE`.

* `multi-update-start`: Ativado antes de uma declaração `UPDATE` que envolve várias tabelas.

* `multi-update-done`: Desatado no final de uma declaração `UPDATE` que envolve várias tabelas.

* `delete-start`: Ativado antes de uma declaração `DELETE`.

* `delete-done`: Desatado no final de uma declaração `DELETE`.

* `multi-delete-start`: Ativado antes de uma declaração `DELETE` que envolve várias tabelas.

* `multi-delete-done`: Desatado no final de uma declaração `DELETE` que envolve várias tabelas.

Os argumentos para as estações de inspeção são:

* `query`: A string de consulta. * `status`: O status da consulta. `0` para sucesso e `>0` para falha.

* `rows`: O número de strings afetadas pela declaração. Isso retorna o número de strings encontradas para `SELECT`, o número de strings excluídas para `DELETE` e o número de strings inseridas com sucesso para `INSERT`.

* `rowsmatched`: O número de strings correspondentes à cláusula `WHERE` de uma operação `UPDATE`.

* `rowschanged`: O número de strings que realmente foram alteradas durante uma operação de `UPDATE`.

Você usa essas sondas para monitorar a execução desses tipos de declaração sem precisar monitorar o usuário ou cliente que executa as declarações. Um exemplo simples disso é acompanhar os tempos de execução:

```sql
#!/usr/sbin/dtrace -s

#pragma D option quiet

dtrace:::BEGIN
{
   printf("%-60s %-8s %-8s %-8s\n", "Query", "RowsU", "RowsM", "Dur (ms)");
}

mysql*:::update-start, mysql*:::insert-start,
mysql*:::delete-start, mysql*:::multi-delete-start,
mysql*:::multi-delete-done, mysql*:::select-start,
mysql*:::insert-select-start, mysql*:::multi-update-start
{
    self->query = copyinstr(arg0);
    self->querystart = timestamp;
}

mysql*:::insert-done, mysql*:::select-done,
mysql*:::delete-done, mysql*:::multi-delete-done, mysql*:::insert-select-done
/ self->querystart /
{
    this->elapsed = ((timestamp - self->querystart)/1000000);
    printf("%-60s %-8d %-8d %d\n",
           self->query,
           0,
           arg1,
           this->elapsed);
    self->querystart = 0;
}

mysql*:::update-done, mysql*:::multi-update-done
/ self->querystart /
{
    this->elapsed = ((timestamp - self->querystart)/1000000);
    printf("%-60s %-8d %-8d %d\n",
           self->query,
           arg1,
           arg2,
           this->elapsed);
    self->querystart = 0;
}
```

Quando executado, você pode ver os tempos básicos de execução e as correspondências de strings:

```sql
Query                                                        RowsU    RowsM    Dur (ms)
select * from t2                                             0        275      0
insert into t2 (select * from t2)                            0        275      9
update t2 set i=5 where i > 75                               110      110      8
update t2 set i=5 where i < 25                               254      134      12
delete from t2 where i < 5                                   0        0        0
```

Outra alternativa é usar as funções de agregação no DTrace para agregar o tempo de execução de declarações individuais:

```sql
#!/usr/sbin/dtrace -s

#pragma D option quiet


mysql*:::update-start, mysql*:::insert-start,
mysql*:::delete-start, mysql*:::multi-delete-start,
mysql*:::multi-delete-done, mysql*:::select-start,
mysql*:::insert-select-start, mysql*:::multi-update-start
{
    self->querystart = timestamp;
}

mysql*:::select-done
{
        @statements["select"] = sum(((timestamp - self->querystart)/1000000));
}

mysql*:::insert-done, mysql*:::insert-select-done
{
        @statements["insert"] = sum(((timestamp - self->querystart)/1000000));
}

mysql*:::update-done, mysql*:::multi-update-done
{
        @statements["update"] = sum(((timestamp - self->querystart)/1000000));
}

mysql*:::delete-done, mysql*:::multi-delete-done
{
        @statements["delete"] = sum(((timestamp - self->querystart)/1000000));
}

tick-30s
{
        printa(@statements);
}
```

O roteiro que foi mostrado acaba agregando os tempos gastos em cada operação, o que poderia ser usado para ajudar a estabelecer uma suíte padrão de testes.

```sql
 delete                                                            0
  update                                                            0
  insert                                                           23
  select                                                         2484

  delete                                                            0
  update                                                            0
  insert                                                           39
  select                                                        10744

  delete                                                            0
  update                                                           26
  insert                                                           56
  select                                                        10944

  delete                                                            0
  update                                                           26
  insert                                                         2287
  select                                                        15985
```

##### 5.8.4.1.13 Provas de rede

Os dispositivos de monitoramento da rede monitoram a transferência de informações do servidor MySQL e dos clientes de todos os tipos pela rede. Os dispositivos são definidos da seguinte forma:

```sql
net-read-start()
net-read-done(status, bytes)
net-write-start(bytes)
net-write-done(status)
```

* `net-read-start`: Desencambrado quando uma operação de leitura de rede é iniciada.

* `net-read-done`: Desencaminhado quando a operação de leitura da rede é concluída. O `status` é um `integer` que representa o estado de retorno para a operação, `0` para sucesso e `1` para falha. O argumento `bytes` é um número inteiro que especifica o número de bytes lidos durante o processo.

* `net-start-bytes`: Desencaminhado quando os dados são escritos em um soquete de rede. O único argumento, `bytes`, especifica o número de bytes escritos no soquete de rede.

* `net-write-done`: Desencaminhado quando a operação de escrita na rede foi concluída. O único argumento, `status`, é um número inteiro que representa o status de retorno da operação, `0` para sucesso e `1` para falha.

Você pode usar as sondas de rede para monitorar o tempo gasto lendo e escrevendo em clientes de rede durante a execução. O seguinte script D fornece um exemplo disso. O tempo cumulativo para leitura ou escrita é calculado, bem como o número de bytes. Observe que o tamanho da variável dinâmica foi aumentado (usando a opção `dynvarsize` para lidar com o disparo rápido das sondas individuais para leituras/escritas na rede.

```sql
#!/usr/sbin/dtrace -s

#pragma D option quiet
#pragma D option dynvarsize=4m

dtrace:::BEGIN
{
   printf("%-2s %-30s %-10s %9s %18s %-s \n",
          "St", "Who", "DB", "ConnID", "Dur microsec", "Query");
}

mysql*:::query-start
{
   self->query = copyinstr(arg0);
   self->who   = strjoin(copyinstr(arg3),strjoin("@",copyinstr(arg4)));
   self->db    = copyinstr(arg2);
   self->connid = arg1;
   self->querystart = timestamp;
   self->netwrite = 0;
   self->netwritecum = 0;
   self->netwritebase = 0;
   self->netread = 0;
   self->netreadcum = 0;
   self->netreadbase = 0;
}

mysql*:::net-write-start
{
   self->netwrite += arg0;
   self->netwritebase = timestamp;
}

mysql*:::net-write-done
{
   self->netwritecum += (timestamp - self->netwritebase);
   self->netwritebase = 0;
}

mysql*:::net-read-start
{
   self->netreadbase = timestamp;
}

mysql*:::net-read-done
{
   self->netread += arg1;
   self->netreadcum += (timestamp - self->netreadbase);
   self->netreadbase = 0;
}

mysql*:::query-done
{
   this->elapsed = (timestamp - self->querystart) /1000000;
   printf("%2d %-30s %-10s %9d %18d %s\n",
          arg0, self->who, self->db,
          self->connid, this->elapsed, self->query);
   printf("Net read: %d bytes (%d ms) write: %d bytes (%d ms)\n",
               self->netread, (self->netreadcum/1000000),
               self->netwrite, (self->netwritecum/1000000));
}
```

Ao executar o script acima em uma máquina com um cliente remoto, você pode perceber que aproximadamente um terço do tempo gasto na execução da consulta está relacionado à escrita dos resultados da consulta de volta ao cliente.

```sql
St Who                            DB            ConnID       Dur microsec Query
 0 root@::ffff:198.51.100.108      test              31               3495 select * from t1 limit 1000000
Net read: 0 bytes (0 ms) write: 10000075 bytes (1220 ms)
```

##### 5.8.4.1.14 Provas de Keycache

As verificações do keycache são acionadas quando se usa o cache de chave de índice usado com o mecanismo de armazenamento MyISAM. Existem verificações para monitorar quando os dados são lidos no keycache, quando os dados de chave cache são escritos do cache em um arquivo cache, ou quando acessa-se o keycache.

O uso do Keycache indica quando os dados são lidos ou escritos dos arquivos de índice para o cache, e pode ser usado para monitorar a eficiência da memória alocada para o keycache. Um número elevado de leituras do keycache em uma série de consultas pode indicar que o keycache é muito pequeno para o tamanho dos dados acessados.

```sql
keycache-read-start(filepath, bytes, mem_used, mem_free)
keycache-read-block(bytes)
keycache-read-hit()
keycache-read-miss()
keycache-read-done(mem_used, mem_free)
keycache-write-start(filepath, bytes, mem_used, mem_free)
keycache-write-block(bytes)
keycache-write-done(mem_used, mem_free)
```

Ao ler dados dos arquivos de índice para o keycache, o processo primeiro inicializa a operação de leitura (indicada por `keycache-read-start`), então carrega blocos de dados (`keycache-read-block`) e, em seguida, o bloco de leitura corresponde aos dados que estão sendo identificados (`keycache-read-hit`) ou mais dados precisam ser lidos (`keycache-read-miss`). Uma vez que a operação de leitura foi concluída, a leitura para o fim é feita com o `keycache-read-done`.

Os dados podem ser lidos do arquivo de índice para o keycache apenas quando a chave especificada não estiver já dentro do keycache.

* `keycache-read-start`: Desencaminhado quando a operação de leitura do keycache é iniciada. Os dados são lidos a partir do especificado `filepath`, lendo o número especificado de `bytes`. O `mem_used` e `mem_avail` indicam a memória atualmente utilizada pelo keycache e a quantidade de memória disponível dentro do keycache.

* `keycache-read-block`: Desacelera quando a keycache lê um bloco de dados, do número especificado de `bytes`, do arquivo de índice para a keycache.

* `keycache-read-hit`: Desencaminhado quando o bloco de dados lido do arquivo de índice corresponde aos dados da chave solicitados.

* `keycache-read-miss`: Desencaminhado quando o bloco de dados lido do arquivo de índice não corresponde aos dados da chave necessários.

* `keycache-read-done`: Desempenha quando a operação de leitura do keycache é concluída. Os `mem_used` e `mem_avail` indicam a memória atualmente utilizada pelo keycache e a quantidade de memória disponível dentro do keycache.

As escritas de Keycache ocorrem quando as informações do índice são atualizadas durante uma operação de `INSERT`, `UPDATE` ou `DELETE`, e as informações de chave em cache são descarregadas de volta ao arquivo do índice.

* `keycache-write-start`: Desencaminhado quando a operação de escrita do keycache é iniciada. Os dados são escritos no `filepath` especificado, lendo o número especificado de `bytes`. O `mem_used` e `mem_avail` indicam a memória atualmente utilizada pelo keycache e a quantidade de memória disponível dentro do keycache.

* `keycache-write-block`: Desacelera quando a chave de cache escreve um bloco de dados, do número especificado de `bytes`, no arquivo de índice a partir da chave de cache.

* `keycache-write-done`: Desempenha quando a operação de escrita do keycache é concluída. Os `mem_used` e `mem_avail` indicam a memória atualmente utilizada pelo keycache e a quantidade de memória disponível dentro do keycache.

