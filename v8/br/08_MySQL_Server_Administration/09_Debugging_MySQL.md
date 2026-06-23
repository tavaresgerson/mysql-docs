## 7.9 Depuração do MySQL

Esta seção descreve técnicas de depuração que auxiliam nos esforços para localizar problemas no MySQL.

### 7.9.1 Depuração de um servidor MySQL

Se você está usando alguma funcionalidade que é muito nova no MySQL, você pode tentar executar o **mysqld** com a opção `--skip-new` (que desativa todas as novas funcionalidades, potencialmente inseguras). Veja a Seção B.3.3.3, “O que fazer se o MySQL continuar a falhar”.

Se o **mysqld** não quiser iniciar, verifique se não tem arquivos `my.cnf` que interfiram em sua configuração! Você pode verificar seus argumentos `my.cnf` com **mysqld --print-defaults** e evitar usá-los iniciando com [**mysqld --no-defaults ...**](mysqld.html "6.3.1 mysqld — The MySQL Server").

Se o **mysqld** começar a consumir CPU ou memória ou se "parar", você pode usar [**mysqladmin processlist status**][(mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program")] para descobrir se alguém está executando uma consulta que leva um longo tempo. Pode ser uma boa ideia executar **mysqladmin -i10 processlist status** em alguma janela se você estiver enfrentando problemas de desempenho ou problemas quando novos clientes não conseguem se conectar.

O comando **mysqladmin debug** exibe algumas informações sobre as chaves de acesso em uso, memória usada e uso de consultas no arquivo de registro do MySQL. Isso pode ajudar a resolver alguns problemas. Esse comando também fornece algumas informações úteis mesmo que você não tenha compilado o MySQL para depuração!

Se o problema for que algumas tabelas estão ficando cada vez mais lentas, você deve tentar otimizar a tabela com `OPTIMIZE TABLE` ou **myisamchk**. Veja o Capítulo 7, *Administração do Servidor MySQL*. Você também deve verificar as consultas lentas com `EXPLAIN`.

Você também deve ler a seção específica do sistema operacional neste manual para problemas que podem ser exclusivos do seu ambiente. Veja a Seção 2.1, “Orientações Gerais de Instalação”.

#### 7.9.1.1 Compilando o MySQL para depuração

Se você tiver um problema muito específico, sempre pode tentar depurar o MySQL. Para fazer isso, você deve configurar o MySQL com a opção `-DWITH_DEBUG=1`. Você pode verificar se o MySQL foi compilado com depuração fazendo: **mysqld --help**. Se a bandeira `--debug` estiver listada com as opções, então você tem a depuração habilitada. [**mysqladmin ver**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program") também lista a versão do **mysqld** como **mysql ... --debug** neste caso.

Se o **mysqld** parar de falhar quando você o configura com a opção `-DWITH_DEBUG=1` do CMake, provavelmente você encontrou um bug de compilador ou um bug de temporização dentro do MySQL. Neste caso, você pode tentar adicionar `-g` usando as opções `CMAKE_C_FLAGS` e `CMAKE_CXX_FLAGS` do CMake e não usar `-DWITH_DEBUG=1`. Se o **mysqld** morrer, você pode, pelo menos, anexar a ele com o **gdb** ou usar o **gdb** no arquivo do núcleo para descobrir o que aconteceu.

Quando você configura o MySQL para depuração, você automaticamente habilita muitas funções de verificação de segurança adicionais que monitoram a saúde do **mysqld**. Se eles encontrarem algo “inesperado”, uma entrada é escrita em `stderr`, que o **mysqld_safe** direciona para o log de erro! Isso também significa que, se você está tendo alguns problemas inesperados com o MySQL e está usando uma distribuição de fonte, a primeira coisa que você deve fazer é configurar o MySQL para depuração. Se você acredita que encontrou um bug, use as instruções na Seção 1.5, “Como relatar bugs ou problemas”.

Na distribuição do MySQL para Windows, `mysqld.exe` é compilado por padrão com suporte para arquivos de rastreamento.

#### 7.9.1.2 Criando Arquivos de Rastreamento

Se o servidor **mysqld** não iniciar ou se quebrar facilmente, você pode tentar criar um arquivo de rastreamento para encontrar o problema.

Para fazer isso, você deve ter um **mysqld** que foi compilado com suporte de depuração. Você pode verificar isso executando `mysqld -V`. Se o número da versão terminar com `-debug`, ele foi compilado com suporte para arquivos de rastreamento. (No Windows, o servidor de depuração é chamado **mysqld-debug** em vez de **mysqld**.)

Inicie o servidor **mysqld** com um registro de rastreamento em `/tmp/mysqld.trace` em Unix ou `\mysqld.trace` em Windows:

```
$> mysqld --debug
```

Em Windows, você também deve usar a bandeira `--standalone` para não iniciar o **mysqld** como um serviço. Em uma janela de console, use este comando:

```
C:\> mysqld-debug --debug --standalone
```

Depois disso, você pode usar a ferramenta de linha de comando `mysql.exe` em uma segunda janela do console para reproduzir o problema. Você pode parar o servidor **mysqld** com **mysqladmin shutdown**.

O arquivo de rastreamento pode se tornar **muito grande!** Para gerar um arquivo de rastreamento menor, você pode usar opções de depuração como esta:

[**mysqld --debug=d,info,error,query,general,where:O,/tmp/mysqld.trace**](mysqld.html "6.3.1 mysqld — The MySQL Server")

Isso apenas imprime informações com as tags mais interessantes no arquivo de registro.

Se você enviar um relatório de erro, por favor, adicione apenas as linhas do arquivo de registro que indicam onde algo parece estar errado. Se você não conseguir localizar o local errado, abra um relatório de erro e faça o upload de todo o arquivo de registro ao relatório, para que um desenvolvedor do MySQL possa examiná-lo. Para instruções, consulte a Seção 1.5, “Como relatar erros ou problemas”.

O arquivo de rastreamento é feito com o pacote `DBUG` por Fred Fish. Veja a Seção 7.9.4, “O pacote DBUG”.

#### 7.9.1.3 Usando o WER com PDB para criar um crashdump do Windows

Os arquivos de banco de dados do programa (com o sufixo `pdb`) estão incluídos na distribuição de **ARQUIVO ZIP de Binários de Depuração e Conjunto de Teste** do MySQL. Esses arquivos fornecem informações para depuração da sua instalação do MySQL, no caso de um problema. Este é um download separado do arquivo padrão MSI ou Zip.

Nota

Os arquivos PDB estão disponíveis em um arquivo separado rotulado "ZIP Archive Debug Binaries & Test Suite".

O arquivo PDB contém informações mais detalhadas sobre `mysqld` e outras ferramentas que permitem a criação de arquivos de depuração e de depuração mais detalhados. Você pode usar essas ferramentas com **WinDbg** ou o Visual Studio para depurar o **mysqld**.

Para mais informações sobre arquivos PDB e as opções de depuração disponíveis, consulte [Ferramentas de depuração para Windows][(https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/)].

Para usar o WinDbg, instale o Kit de drivers completos do Windows (WDK) ou instale a versão independente.

Importante

Os arquivos `.exe` e `.pdb` devem corresponder exatamente (ambos o número da versão e a edição do servidor MySQL); caso contrário, o WinDBG reclamará ao tentar carregar os símbolos.

1. Para gerar um minidump `mysqld.dmp`, habilite a opção `core-file` na seção [mysqld] em `my.ini`. Reinicie o servidor MySQL após fazer essas alterações.

2. Crie um diretório para armazenar os arquivos gerados, como `c:\symbols`

3. Determine o caminho para o seu executável **windbg.exe** usando o Find GUI ou a partir da linha de comando, por exemplo: `dir /s /b windbg.exe` -- um padrão comum é *C:\Program Files\Debugging Tools for Windows (x64)\windbg.exe*

4. Inicie `windbg.exe`, dando-lhe as permissões para `mysqld.exe`, `mysqld.pdb`, `mysqld.dmp` e o código-fonte. Alternativamente, passe cada caminho a partir da interface gráfica do WinDbg. Por exemplo:

   ```
   windbg.exe -i "C:\mysql-8.0.44-winx64\bin\"^
    -z "C:\mysql-8.0.44-winx64\data\mysqld.dmp"^
    -srcpath "E:\ade\mysql_archives\8.0\8.0.44\mysql-8.0.44"^
    -y "C:\mysql-8.0.44-winx64\bin;SRV*c:\symbols*http://msdl.microsoft.com/download/symbols"^
    -v -n -c "!analyze -vvvvv"
   ```

Nota

O caractere `^` e a nova linha são removidos pelo processador de linha de comando do Windows, então certifique-se de que os espaços permaneçam intactos.

#### 7.9.1.4 Depuração do mysqld sob o gdb

Na maioria dos sistemas, você também pode iniciar o **mysqld** a partir do **gdb** para obter mais informações se o **mysqld** falhar.

Com algumas versões mais antigas do **gdb** no Linux, você deve usar `run --one-thread` se quiser ser capaz de depurar os threads do **mysqld**. Nesse caso, você só pode ter um thread ativo de cada vez.

Os fios NPTL (a nova biblioteca de fios no Linux) podem causar problemas ao executar o **mysqld** sob o **gdb**. Alguns sintomas são:

* **mysqld** fica parado durante o arranque (antes de escrever `ready for connections`).

* O * mysqld* trava durante uma chamada de `pthread_mutex_lock()` ou `pthread_mutex_unlock()`.

Neste caso, você deve definir a seguinte variável de ambiente no shell antes de iniciar o **gdb**:

```
LD_ASSUME_KERNEL=2.4.1
export LD_ASSUME_KERNEL
```

Ao executar o **mysqld** sob o **gdb**, você deve desabilitar a depuração de pilha com `--skip-stack-trace` para poder capturar falhas de segmentação dentro do **gdb**.

Use a opção `--gdb` no **mysqld** para instalar um manipulador de interrupção para `SIGINT` (necessário para parar o **mysqld** com `^C` para definir pontos de interrupção) e desabilitar o rastreamento de pilha e o gerenciamento de arquivos de núcleo.

É muito difícil depurar o MySQL sob **gdb** se você fizer muitas novas conexões o tempo todo, pois o **gdb** não libera a memória para os threads antigos. Você pode evitar esse problema iniciando o **mysqld** com `thread_cache_size` definido com um valor igual a `max_connections`.

+ 1. Na maioria dos casos, o uso apenas de `--thread_cache_size=5'` ajuda muito!

Se você deseja obter um core dump no Linux se o **mysqld** morrer com um sinal SIGSEGV, você pode iniciar o **mysqld** com a opção `--core-file`. Esse arquivo de núcleo pode ser usado para criar um backtrace que pode ajudá-lo a descobrir por que o **mysqld** morreu:

```
$> gdb mysqld core
gdb>   backtrace full
gdb>   quit
```

Veja a Seção B.3.3.3, “O que fazer se o MySQL continuar a falhar”.

Se você estiver usando o **gdb** no Linux, você deve instalar um arquivo `.gdb`, com as seguintes informações, em seu diretório atual:

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

Aqui está um exemplo de como depurar o **mysqld**:

```
$> gdb /usr/local/libexec/mysqld
gdb> run
...
backtrace full # Do this when mysqld crashes
```

Inclua o resultado anterior em um relatório de erro, que você pode enviar seguindo as instruções na Seção 1.5, “Como relatar erros ou problemas”.

Se o **mysqld** ficar parado, você pode tentar usar algumas ferramentas do sistema, como `strace` ou `/usr/proc/bin/pstack`, para examinar onde o **mysqld** ficou parado.

```
strace /tmp/log libexec/mysqld
```

Se você estiver usando a interface Perl `DBI`, pode ativar as informações de depuração usando o método `trace` ou definindo a variável de ambiente `DBI_TRACE`.

#### 7.9.1.5 Usando uma depuração em pilha

Em alguns sistemas operacionais, o log de erro contém uma traçada de pilha se o **mysqld** morrer inesperadamente. Você pode usar isso para descobrir onde (e talvez por que) o **mysqld** morreu. Veja a Seção 7.4.2, “O Log de Erro”. Para obter uma traçada de pilha, você não deve compilar o **mysqld** com a opção `-fomit-frame-pointer` para o gcc. Veja a Seção 7.9.1.1, “Compilando MySQL para Depuração”.

Um registro de depuração em um log de erro parece algo assim:

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

Se a resolução dos nomes de função para o rastreamento falhar, o rastreamento contém menos informações:

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

Versões mais recentes das funções de depuração de pilha `glibc` também imprimem o endereço em relação ao objeto. Em sistemas baseados em `glibc` (Linux), o rastreamento para uma saída inesperada dentro de um plugin parece algo assim:

```
plugin/auth/auth_test_plugin.so(+0x9a6)[0x7ff4d11c29a6]
```

Para traduzir o endereço relativo (`+0x9a6`) em um nome de arquivo e número de linha, use este comando:

```
$> addr2line -fie auth_test_plugin.so 0x9a6
auth_test_plugin
mysql-trunk/plugin/auth/test_plugin.c:65
```

A utilidade **addr2line** faz parte do pacote `binutils` no Linux.

Em Solaris, o procedimento é semelhante. O Solaris `printstack()` já imprime endereços relativos:

```
plugin/auth/auth_test_plugin.so:0x1510
```

Para traduzir, use este comando:

```
$> gaddr2line -fie auth_test_plugin.so 0x1510
mysql-trunk/plugin/auth/test_plugin.c:88
```

O Windows já imprime o endereço, o nome da função e a linha:

```
000007FEF07E10A4 auth_test_plugin.dll!auth_test_plugin()[test_plugin.c:72]
```

#### 7.9.1.6 Usando logs do servidor para encontrar causas de erros no mysqld

Observe que, antes de iniciar o **mysqld** com o log de consulta geral habilitado, você deve verificar todas as suas tabelas com **myisamchk**. Veja o Capítulo 7, *Administração do Servidor MySQL*.

Se o **mysqld** morrer ou ficar parado, você deve iniciar o **mysqld** com o log de consulta geral habilitado. Veja a Seção 7.4.3, “O Log de Consulta Geral”. Quando o **mysqld** morrer novamente, você pode examinar o final do arquivo de log para a consulta que matou o **mysqld**.

Se você usar o arquivo de log de consulta geral padrão, o log é armazenado no diretório do banco de dados como `host_name.log` Na maioria dos casos, é a última consulta no arquivo de log que matou o **mysqld**, mas se possível, você deve verificar isso reiniciando o **mysqld** e executando a consulta encontrada a partir das ferramentas de linha de comando do **mysql**. Se isso funcionar, você também deve testar todas as consultas complicadas que não foram concluídas.

Você também pode tentar o comando `EXPLAIN` em todas as declarações `SELECT` que levam um longo tempo para garantir que o **mysqld** esteja usando índices corretamente. Veja a Seção 15.8.2, “Declaração EXPLAIN”.

Você pode encontrar as consultas que levam muito tempo para executar, iniciando o **mysqld** com o registro de consultas lentas habilitado. Veja a Seção 7.4.5, “O Registro de Consultas Lentas”.

Se você encontrar o texto `mysqld restarted` no log de erro (normalmente um arquivo chamado `host_name.err`) você provavelmente encontrou uma consulta que faz com que o **mysqld** falhe. Se isso acontecer, você deve verificar todas as suas tabelas com **myisamchk** (veja o Capítulo 7, *Administração do Servidor MySQL*), e testar as consultas nos arquivos de log do MySQL para ver se uma delas falha. Se você encontrar tal consulta, tente primeiro atualizar para a versão mais recente do MySQL. Se isso não ajudar, reporte um erro, veja a Seção 1.5, “Como Relatar Erros ou Problemas”.

Se você iniciou o **mysqld** com a variável de sistema `myisam_recover_options` definida, o MySQL verifica automaticamente e tenta reparar as tabelas `MyISAM` se elas estiverem marcadas como 'não fechadas corretamente' ou 'quebradas'. Se isso acontecer, o MySQL escreve uma entrada no arquivo `hostname.err` `'Warning: Checking table ...'` que é seguida por `Warning: Repairing table` se a tabela precisar ser reparada. Se você receber muitos desses erros, sem que o **mysqld** tenha morrido inesperadamente pouco antes, então algo está errado e precisa ser investigado mais a fundo. Veja a Seção 7.1.7, “Opções de comando do servidor”.

Quando o servidor detecta a corrupção da tabela `MyISAM`, ele escreve informações adicionais no log de erro, como o nome e o número da linha do arquivo de origem e a lista de threads acessando a tabela. Exemplo: `Got an error from thread_id=1, mi_dynrec.c:368`. Essas são informações úteis para incluir em relatórios de bugs.

Não é um bom sinal se o **mysqld** morreu inesperadamente, mas, neste caso, você não deve investigar as mensagens `Checking table...`, mas sim tentar descobrir por que o **mysqld** morreu.

#### 7.9.1.7 Criando um Caso de Teste Se Você Experiências Corrupção de Tabela

O procedimento a seguir se aplica às tabelas `MyISAM`. Para informações sobre os passos a serem tomados ao encontrar corrupção na tabela `InnoDB`, consulte a Seção 1.5, “Como relatar erros ou problemas”.

Se você encontrar tabelas corrompidas do `MyISAM` ou se o **mysqld** sempre falha após algumas declarações de atualização, você pode testar se o problema é reprodutível fazendo o seguinte:

1. Parar o daemon do MySQL com [**mysqladmin shutdown**][(mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program")].

2. Faça um backup das tabelas para se proteger contra o caso muito improvável de que a reparação faça algo errado.

3. Verifique todas as tabelas com [**myisamchk -s banco de dados/\*.MYI**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility"). Repare quaisquer tabelas corrompidas com [**myisamchk -r banco de dados/*`table`*.MYI**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility").

4. Faça um segundo backup das tabelas. 5. Remova (ou afaste) quaisquer arquivos de registro antigos do diretório de dados do MySQL, se você precisar de mais espaço.

6. Inicie o **mysqld** com o log binário habilitado. Se você deseja encontrar uma declaração que causa o crash do **mysqld**, você deve iniciar o servidor com o log de consulta geral habilitado também. Veja a Seção 7.4.3, “O Log de Consulta Geral”, e a Seção 7.4.4, “O Log Binário”.

7. Quando você tiver obtido uma tabela quebrada, pare o servidor **mysqld**.

8. Restaure o backup. 9. Reinicie o servidor **mysqld** *sem* o log binário ativado.

10. Reexecute as declarações com [**mysqlbinlog binary-log-file | mysql**](mysqlbinlog.html "6.6.9 mysqlbinlog — Utility for Processing Binary Log Files"). O log binário é salvo no diretório do banco de dados MySQL com o nome `hostname-bin.NNNNNN`.

11. Se as tabelas forem corrompidas novamente ou você conseguir fazer o **mysqld** morrer com o comando acima, você encontrou um erro reprodutível. Faça o upload das tabelas e do log binário para o nosso banco de bugs usando as instruções fornecidas na Seção 1.5, “Como relatar bugs ou problemas”. Se você é um cliente de suporte, pode usar o Centro de Suporte ao Cliente do MySQL (<https://www.mysql.com/support/>), para alertar a equipe do MySQL sobre o problema e fazê-lo corrigido o mais rápido possível.

### 7.9.2 Depuração de um cliente MySQL

Para poder depurar um cliente MySQL com o pacote de depuração integrado, você deve configurar o MySQL com `-DWITH_DEBUG=1`. Veja a Seção 2.8.7, “Opções de Configuração de Fonte MySQL”.

Antes de executar um cliente, você deve definir a variável de ambiente `MYSQL_DEBUG`:

```
$> MYSQL_DEBUG=d:t:O,/tmp/client.trace
$> export MYSQL_DEBUG
```

Isso faz com que os clientes gerem um arquivo de rastreamento em `/tmp/client.trace`.

Se você tiver problemas com seu próprio código de cliente, tente se conectar ao servidor e executar sua consulta usando um cliente que é conhecido por funcionar. Faça isso executando o **mysql** no modo de depuração (assumindo que você compilou o MySQL com depuração ativada):

```
$> mysql --debug=d:t:O,/tmp/client.trace
```

Isso fornece informações úteis caso você envie um relatório de bug. Veja a Seção 1.5, “Como relatar bugs ou problemas”.

Se o seu cliente falhar em algum código que parece legal, você deve verificar se o arquivo do seu `mysql.h` corresponde ao arquivo da sua biblioteca MySQL. Um erro muito comum é usar um arquivo antigo do `mysql.h` de uma instalação antiga do MySQL com a nova biblioteca MySQL.

### 7.9.3 A Ferramenta LOCK_ORDER

O servidor MySQL é uma aplicação multithread que utiliza inúmeros primitivos internos de bloqueio e relacionados a bloqueio, como mútuos, rwlocks (incluindo prlocks e sxlocks), condições e arquivos. Dentro do servidor, o conjunto de objetos relacionados a bloqueio muda com a implementação de novos recursos e refatoração de código para melhorias de desempenho. Como em qualquer aplicação multithread que utiliza primitivos de bloqueio, sempre há o risco de encontrar um impasse durante a execução quando múltiplos bloqueios são mantidos de uma vez. Para o MySQL, o efeito de um impasse é catastrófico, causando uma perda completa do serviço.

A partir do MySQL 8.0.17, para habilitar a detecção de deadlocks de aquisição de bloqueio e a garantia de que a execução em tempo real esteja livre deles, o MySQL suporta a ferramenta `LOCK_ORDER`. Isso permite definir um gráfico de dependência de ordem de bloqueio como parte do projeto do servidor e verificação do tempo real do servidor para garantir que a aquisição de bloqueio seja acíclica e que as trajetórias de execução estejam em conformidade com o gráfico.

Esta seção fornece informações sobre o uso da ferramenta `LOCK_ORDER`, mas apenas em um nível básico. Para detalhes completos, consulte a seção Ordem de bloqueio da documentação do MySQL Server Doxygen, disponível em https://dev.mysql.com/doc/index-other.html.

A ferramenta `LOCK_ORDER` é destinada a depuração do servidor, não para uso em produção.

Para usar a ferramenta `LOCK_ORDER`, siga este procedimento:

1. Construa o MySQL a partir da fonte, configurando-o com a opção `-DWITH_LOCK_ORDER=ON` **CMake** para que a construção inclua as ferramentas `LOCK_ORDER`.

Nota

Com a opção `WITH_LOCK_ORDER` habilitada, as exigências de MySQL exigem o programa **flex**.

2. Para executar o servidor com a ferramenta `LOCK_ORDER` habilitada, habilite a variável de sistema `lock_order` na inicialização do servidor. Várias outras variáveis de sistema para a configuração do `LOCK_ORDER` também estão disponíveis.

3. Para a operação da suíte de testes do MySQL, o **mysql-test-run.pl** tem uma opção `--lock-order` que controla se deve habilitar a ferramenta `LOCK_ORDER` durante a execução do caso de teste.

As variáveis do sistema descritas a seguir configuram a operação da ferramenta `LOCK_ORDER`, assumindo que o MySQL foi construído para incluir a ferramenta `LOCK_ORDER`. A variável principal é `lock_order`, que indica se a ferramenta `LOCK_ORDER` deve ser habilitada no runtime:

* Se `lock_order` estiver desativado (o padrão), nenhuma outra variável do sistema `LOCK_ORDER` terá efeito.

* Se `lock_order` estiver habilitado, as outras variáveis do sistema configuram quais recursos do `LOCK_ORDER` devem ser habilitados.

Nota

Em geral, pretende-se que a ferramenta `LOCK_ORDER` seja configurada executando o **mysql-test-run.pl** com a opção `--lock-order`, e que o **mysql-test-run.pl** defina as variáveis de sistema `LOCK_ORDER` com os valores apropriados.

Todas as variáveis do sistema `LOCK_ORDER` devem ser definidas na inicialização do servidor. No momento da execução, seus valores são visíveis, mas não podem ser alterados.

Algumas variáveis do sistema existem em pares, como `lock_order_debug_loop` e `lock_order_trace_loop`. Para tais pares, as variáveis são distinguidas da seguinte forma quando a condição ocorre com a qual estão associadas:

* Se a variável `_debug_` estiver habilitada, uma asserção de depuração é levantada.

* Se a variável `_trace_` estiver habilitada, um erro será impresso nos logs.

**Tabela 7.8 Resumo da variável de sistema LOCK_ORDER**

<table frame="box" rules="all" summary="Reference for LOCK_ORDER system variables."><col style="width: 40%"/><col style="width: 20%"/><col align="center" style="width: 20%"/><thead><tr><th scope="col">Variable Name</th> <th scope="col">Variable Type</th> <th scope="col">Variable Scope</th> </tr></thead><tbody><tr><th scope="row">lock_order</th> <td>Boolean</td> <td>Global</td> </tr><tr><th scope="row">lock_order_debug_loop</th> <td>Boolean</td> <td>Global</td> </tr><tr><th scope="row">lock_order_debug_missing_arc</th> <td>Boolean</td> <td>Global</td> </tr><tr><th scope="row">lock_order_debug_missing_key</th> <td>Boolean</td> <td>Global</td> </tr><tr><th scope="row">lock_order_debug_missing_unlock</th> <td>Boolean</td> <td>Global</td> </tr><tr><th scope="row">lock_order_dependencies</th> <td>File name</td> <td>Global</td> </tr><tr><th scope="row">lock_order_extra_dependencies</th> <td>File name</td> <td>Global</td> </tr><tr><th scope="row">lock_order_output_directory</th> <td>Directory name</td> <td>Global</td> </tr><tr><th scope="row">lock_order_print_txt</th> <td>Boolean</td> <td>Global</td> </tr><tr><th scope="row">lock_order_trace_loop</th> <td>Boolean</td> <td>Global</td> </tr><tr><th scope="row">lock_order_trace_missing_arc</th> <td>Boolean</td> <td>Global</td> </tr><tr><th scope="row">lock_order_trace_missing_key</th> <td>Boolean</td> <td>Global</td> </tr><tr><th scope="row">lock_order_trace_missing_unlock</th> <td>Boolean</td> <td>Global</td> </tr></tbody></table>

* `lock_order`

  <table frame="box" rules="all" summary="Properties for lock_order"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--lock-order[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>8.0.17</td> </tr><tr><th>System Variable</th> <td><code>lock_order</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

Se deve habilitar a ferramenta `LOCK_ORDER` no momento da execução. Se `lock_order` estiver desativado (o padrão), nenhuma outra variável do sistema `LOCK_ORDER` terá efeito. Se `lock_order` estiver habilitado, as outras variáveis do sistema configuram quais recursos do `LOCK_ORDER` devem ser habilitados.

Se `lock_order` estiver habilitado, um erro será exibido se o servidor encontrar uma sequência de aquisição de bloqueio que não esteja declarada no gráfico de ordem de bloqueio.

* `lock_order_debug_loop`

  <table frame="box" rules="all" summary="Properties for lock_order_debug_loop"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--lock-order-debug-loop[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>8.0.17</td> </tr><tr><th>System Variable</th> <td><code>lock_order_debug_loop</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

Se a ferramenta `LOCK_ORDER` causa uma falha na asserção de depuração quando ela encontra uma dependência que é marcada como um laço no gráfico de ordem de bloqueio.

* `lock_order_debug_missing_arc`

  <table frame="box" rules="all" summary="Properties for lock_order_debug_missing_arc"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--lock-order-debug-missing-arc[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>8.0.17</td> </tr><tr><th>System Variable</th> <td><code>lock_order_debug_missing_arc</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

Se a ferramenta `LOCK_ORDER` causa uma falha na asserção de depuração quando ela encontra uma dependência que não é declarada no gráfico de ordem de bloqueio.

* `lock_order_debug_missing_key`

  <table frame="box" rules="all" summary="Properties for lock_order_debug_missing_key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--lock-order-debug-missing-key[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>8.0.17</td> </tr><tr><th>System Variable</th> <td><code>lock_order_debug_missing_key</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

Se a ferramenta `LOCK_ORDER` causa uma falha na asserção de depuração quando ela encontra um objeto que não está adequadamente instrumentado com o Schema de Desempenho.

* `lock_order_debug_missing_unlock`

  <table frame="box" rules="all" summary="Properties for lock_order_debug_missing_unlock"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--lock-order-debug-missing-unlock[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>8.0.17</td> </tr><tr><th>System Variable</th> <td><code>lock_order_debug_missing_unlock</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

Se a ferramenta `LOCK_ORDER` causa uma falha de afirmação de depuração quando ela encontra um bloqueio que é destruído, ainda sendo mantido.

* `lock_order_dependencies`

  <table frame="box" rules="all" summary="Properties for lock_order_dependencies"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--lock-order-dependencies=file_name</code></td> </tr><tr><th>Introduced</th> <td>8.0.17</td> </tr><tr><th>System Variable</th> <td><code>lock_order_dependencies</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>empty string</code></td> </tr></tbody></table>

O caminho para o arquivo `lock_order_dependencies.txt` que define o gráfico de dependência do pedido de bloqueio do servidor.

É permitido especificar nenhuma dependência. Um gráfico de dependência vazio é usado neste caso.

* `lock_order_extra_dependencies`

  <table frame="box" rules="all" summary="Properties for lock_order_extra_dependencies"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--lock-order-extra-dependencies=file_name</code></td> </tr><tr><th>Introduced</th> <td>8.0.17</td> </tr><tr><th>System Variable</th> <td><code>lock_order_extra_dependencies</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>empty string</code></td> </tr></tbody></table>

O caminho para um arquivo contendo dependências adicionais para o gráfico de dependência de ordem de bloqueio. Isso é útil para alterar o gráfico de dependência do servidor primário, definido no arquivo `lock_order_dependencies.txt`, com dependências adicionais que descrevem o comportamento do código de terceiros. (A alternativa é modificar o próprio `lock_order_dependencies.txt`, o que não é recomendado.)

Se essa variável não for definida, nenhum arquivo secundário será usado.

* `lock_order_output_directory`

  <table frame="box" rules="all" summary="Properties for lock_order_output_directory"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--lock-order-output-directory=dir_name</code></td> </tr><tr><th>Introduced</th> <td>8.0.17</td> </tr><tr><th>System Variable</th> <td><code>lock_order_output_directory</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>empty string</code></td> </tr></tbody></table>

O diretório onde a ferramenta `LOCK_ORDER` escreve seus registros. Se essa variável não for definida, o padrão é o diretório atual.

* `lock_order_print_txt`

  <table frame="box" rules="all" summary="Properties for lock_order_print_txt"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--lock-order-print-txt[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>8.0.17</td> </tr><tr><th>System Variable</th> <td><code>lock_order_print_txt</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

Se a ferramenta `LOCK_ORDER` realiza uma análise de gráfico de ordem de bloqueio e imprime um relatório textual. O relatório inclui quaisquer ciclos de aquisição de bloqueio detectados.

* `lock_order_trace_loop`

  <table frame="box" rules="all" summary="Properties for lock_order"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--lock-order[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>8.0.17</td> </tr><tr><th>System Variable</th> <td><code>lock_order</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>0

Se a ferramenta `LOCK_ORDER` imprime uma traçada no arquivo de registro quando encontra uma dependência marcada como um laço no gráfico de ordem de bloqueio.

* `lock_order_trace_missing_arc`

  <table frame="box" rules="all" summary="Properties for lock_order"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--lock-order[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>8.0.17</td> </tr><tr><th>System Variable</th> <td><code>lock_order</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>1

Se a ferramenta `LOCK_ORDER` imprime uma traçada no arquivo de registro quando encontra uma dependência que não é declarada no gráfico de ordem de bloqueio.

* `lock_order_trace_missing_key`

  <table frame="box" rules="all" summary="Properties for lock_order"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--lock-order[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>8.0.17</td> </tr><tr><th>System Variable</th> <td><code>lock_order</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>2

Se a ferramenta `LOCK_ORDER` imprime uma traçada no arquivo de registro quando encontra um objeto que não está adequadamente instrumentado com o Schema de Desempenho.

* `lock_order_trace_missing_unlock`

  <table frame="box" rules="all" summary="Properties for lock_order"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--lock-order[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>8.0.17</td> </tr><tr><th>System Variable</th> <td><code>lock_order</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>3

Se a ferramenta `LOCK_ORDER` imprime uma traçada no arquivo de registro quando encontra um bloqueio que é destruído, mas ainda está sendo mantido.

### 7.9.4 O pacote DBUG

O servidor MySQL e a maioria dos clientes MySQL são compilados com o pacote `DBUG`, originalmente criado por Fred Fish. Quando você configurou o MySQL para depuração, este pacote permite obter um arquivo de rastreamento do que o programa está fazendo. Veja a Seção 7.9.1.2, “Criando arquivos de rastreamento”.

Esta seção resume os valores de argumento que você pode especificar nas opções de depuração na linha de comando para os programas MySQL que foram construídos com suporte de depuração.

O pacote `DBUG` pode ser usado ao invocar um programa com a opção `--debug[=debug_options]` ou `-# [debug_options]`. Se você especificar a opção `--debug` ou `-#` sem um valor de *`debug_options`*, a maioria dos programas do MySQL usa um valor padrão. O padrão do servidor é `d:t:i:o,/tmp/mysqld.trace` no Unix e `d:t:i:O,\mysqld.trace` no Windows. O efeito desse padrão é:

* `d`: Habilitar a saída para todas as macros de depuração
* `t`: Rastrear chamadas de função e saídas
* `i`: Adicionar PID às linhas de saída
* `o,/tmp/mysqld.trace`, `O,\mysqld.trace`: Definir o arquivo de saída de depuração.

A maioria dos programas de cliente usa um valor padrão *`debug_options`* de `d:t:o,/tmp/program_name.trace`, independentemente da plataforma.

Aqui estão algumas strings de controle de depuração como elas podem ser especificadas em uma linha de comando de shell:

```
--debug=d:t
--debug=d:f,main,subr1:F:L:t,20
--debug=d,input,output,files:n
--debug=d:t:i:O,\\mysqld.trace
```

Para o **mysqld**, também é possível alterar as configurações de `DBUG` em tempo de execução, definindo a variável de sistema `debug`. Essa variável tem valores globais e de sessão:

```
mysql> SET GLOBAL debug = 'debug_options';
mysql> SET SESSION debug = 'debug_options';
```

Para alterar o valor global `debug`, são necessários privilégios suficientes para definir variáveis de sistema globais. Para alterar o valor da sessão `debug`, são necessários privilégios suficientes para definir variáveis de sistema de sessão restritas. Veja a Seção 7.1.9.1, “Privilégios de variáveis de sistema”.

O valor *`debug_options`* é uma sequência de campos separados por vírgula:

```
field_1:field_2:...:field_N
```

Cada campo dentro do valor consiste em um caractere de sinal obrigatório, opcionalmente precedido por um caractere `+` ou `-`, e opcionalmente seguido por uma lista de modificadores separados por vírgula:

```
[+|-]flag[,modifier,modifier,...,modifier]
```

A tabela a seguir descreve os caracteres de bandeira permitidos. Os caracteres de bandeira não reconhecidos são ignorados silenciosamente.

<table frame="all" summary="Descriptions of permitted debug_options flag characters."><col style="width: 8%"/><col style="width: 92%"/><thead><tr> <th><p> Flag </p></th> <th><p>Descrição</p></th> </tr></thead><tbody><tr> <td><p> <code>d</code> </p></td> <td><p>Ative a saída de<code>DBUG_<em class="replaceable"><code>XXX</code></em></code>macros para o estado atual. Pode ser seguido por uma lista de palavras-chave, que permite a saída apenas para o<code>DBUG</code>macro com essa palavra-chave. Uma lista vazia de palavras-chave permite a saída para todas as macros.</p><p>Em MySQL, as palavras-chave comuns de macro de depuração que podem ser ativadas são<code>enter</code>,<code>exit</code>,<code>error</code>,<code>warning</code>,<code>info</code>, e<code>loop</code>. </p></td> </tr><tr> <td><p> <code>D</code> </p></td> <td><p>Atraso após cada linha de saída do depurador. O argumento é o atraso, em décimos de segundo, sujeito às capacidades da máquina. Por exemplo,<code>D,20</code>especifica um atraso de dois segundos.</p></td> </tr><tr> <td><p> <code>f</code> </p></td> <td><p>Limite o depuração, o rastreamento e a perfilagem à lista de funções nomeadas. Uma lista vazia permite que todas as funções sejam executadas. O apropriado<code>d</code>ou<code>t</code>as bandeiras ainda devem ser dadas; essa bandeira apenas limita suas ações se estiverem habilitadas.</p></td> </tr><tr> <td><p> <code>F</code> </p></td> <td><p>Identifique o nome do arquivo de origem para cada linha de saída de depuração ou rastreamento.</p></td> </tr><tr> <td><p> <code>i</code> </p></td> <td><p>Identifique o processo com o PID ou ID de thread para cada linha de saída de depuração ou rastreamento.</p></td> </tr><tr> <td><p> <code>L</code> </p></td> <td><p>Identifique o número de linha do arquivo fonte para cada linha de saída de depuração ou rastreamento.</p></td> </tr><tr> <td><p> <code>n</code> </p></td> <td><p>Imprima a profundidade atual da função de encaixe para cada linha de saída de depuração ou rastreamento.</p></td> </tr><tr> <td><p> <code>N</code> </p></td> <td><p>Numerar cada linha de saída de depuração.</p></td> </tr><tr> <td><p> <code>o</code> </p></td> <td><p>Redirecione a saída da ferramenta de depuração para o arquivo especificado. A saída padrão é<code>stderr</code>. </p></td> </tr><tr> <td><p> <code>O</code> </p></td> <td><p>Como<code>o</code>, mas o arquivo é realmente apagado entre cada escrita. Quando necessário, o arquivo é fechado e reaberto entre cada escrita.</p></td> </tr><tr> <td><p> <code>a</code> </p></td> <td><p>Como<code>o</code>, mas abre para adição.</p></td> </tr><tr> <td><p> <code>A</code> </p></td> <td><p>Como<code>O</code>, mas abre para adição.</p></td> </tr><tr> <td><p> <code>p</code> </p></td> <td><p>Limitar as ações do depurador a processos especificados. Um processo deve ser identificado com o<code>DBUG_PROCESS</code>Faça uma macro e selecione uma na lista para que as ações do depurador ocorram.</p></td> </tr><tr> <td><p> <code>P</code> </p></td> <td><p>Imprima o nome do processo atual para cada linha de saída de depuração ou rastreamento.</p></td> </tr><tr> <td><p> <code>r</code> </p></td> <td><p>Ao empurrar um novo estado, não herde o nível de encadernação de funções do estado anterior. Útil quando o resultado deve começar na margem esquerda.</p></td> </tr><tr> <td><p> <code>t</code> </p></td> <td><p>Ative linhas de rastreamento de chamadas de função/saída. Pode ser seguido por uma lista (contendo apenas um modificador) que fornece um nível máximo numérico de rastreamento, além do qual não há saída para depuração ou macros de rastreamento. O padrão é uma opção de tempo de compilação.</p></td> </tr><tr> <td><p> <code>T</code> </p></td> <td><p>Imprima o timestamp atual para cada linha de saída.</p></td> </tr></tbody></table>

O caractere principal `+` ou `-` e a lista de modificadores finais são usados para caracteres de bandeira, como `d` ou `f`, que podem permitir uma operação de depuração para todos os modificadores aplicáveis ou apenas alguns deles:

* Sem os valores de `+` ou `-` em destaque, o valor da bandeira é definido exatamente na lista de modificadores conforme fornecida.

* Com um `+` ou `-` principal, os modificadores na lista são adicionados ou subtraídos da lista atual de modificadores.

Os exemplos a seguir mostram como isso funciona para a bandeira `d`. Uma lista `d` vazia habilitou a saída para todas as macros de depuração. Uma lista não vazia habilita a saída apenas para as palavras-chave da macro na lista.

Essas declarações definem o valor `d` na lista de modificadores conforme fornecido:

```
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

```
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

```
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

```
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
