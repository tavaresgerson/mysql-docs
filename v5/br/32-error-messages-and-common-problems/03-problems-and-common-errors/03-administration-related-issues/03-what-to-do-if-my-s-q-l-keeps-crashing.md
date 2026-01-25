#### B.3.3.3 O que Fazer Se o MySQL Continuar Crashando

Cada versão do MySQL é testada em muitas plataformas antes de ser lançada. Isso não significa que não existam bugs no MySQL, mas se houver, eles devem ser muito poucos e podem ser difíceis de encontrar. Se você tiver um problema, sempre ajuda se você tentar descobrir exatamente o que está causando o crash do seu sistema, pois você terá uma chance muito melhor de ter o problema corrigido rapidamente.

Primeiro, você deve tentar descobrir se o problema é que o servidor [**mysqld**] morre (die) ou se o seu problema está relacionado ao seu client. Você pode verificar há quanto tempo seu servidor [**mysqld**] está ativo executando [**mysqladmin version**]. Se o [**mysqld**] tiver morrido e reiniciado, você poderá encontrar o motivo examinando o Error Log do servidor. Consulte [Seção 5.4.2, “The Error Log”].

Em alguns sistemas, você pode encontrar no Error Log um Stack Trace de onde o [**mysqld**] morreu, que você pode resolver com o programa `resolve_stack_dump`. Consulte [Seção 5.8, “Debugging MySQL”]. Observe que os valores das variáveis escritos no Error Log podem nem sempre estar 100% corretos.

Muitas saídas inesperadas do servidor são causadas por data files ou Index files corrompidos. O MySQL atualiza os arquivos em disco com a chamada de sistema `write()` após cada instrução SQL e antes que o client seja notificado sobre o resultado. (Isso não é verdade se você estiver executando com a variável de sistema [`delay_key_write`] habilitada, caso em que os data files são escritos, mas não os Index files.) Isso significa que o conteúdo dos data files está seguro mesmo que o [**mysqld**] sofra um crash, porque o sistema operacional garante que os dados não liberados (unflushed) sejam gravados no disco. Você pode forçar o MySQL a fazer o flush de tudo para o disco após cada instrução SQL iniciando o [**mysqld**] com a opção [`--flush`].

O que precede significa que, normalmente, você não deve ter Tables corrompidas, a menos que uma das seguintes situações ocorra:

* O servidor MySQL ou o host do servidor foi encerrado no meio de um update.

* Você encontrou um bug no [**mysqld**] que o fez morrer (die) no meio de um update.

* Algum programa externo está manipulando data files ou Index files ao mesmo tempo que o [**mysqld**] sem aplicar o Lock na Table corretamente.

* Você está executando muitos servidores [**mysqld**] usando o mesmo data directory em um sistema que não suporta bons File System Locks (normalmente gerenciados pelo Lock Manager `lockd`), ou você está executando múltiplos servidores com External Locking desabilitado.

* Você tem um data file ou Index file que sofreu crash e que contém dados muito corrompidos que confundiram o [**mysqld**].

* Você encontrou um bug no código de Storage. Isso não é provável, mas é pelo menos possível. Neste caso, você pode tentar mudar o Storage Engine para outro Engine usando [`ALTER TABLE`] em uma cópia reparada da Table.

Como é muito difícil saber por que algo está crashando, primeiro tente verificar se coisas que funcionam para outros resultam em uma saída inesperada para você. Tente o seguinte:

* Pare o servidor [**mysqld**] com [**mysqladmin shutdown**], execute [**myisamchk --silent --force \*/\*.MYI**] a partir do data directory para verificar todas as Tables `MyISAM`, e reinicie o [**mysqld**]. Isso garante que você esteja executando a partir de um estado limpo. Consulte [Capítulo 5, *MySQL Server Administration*].

* Inicie o [**mysqld**] com o General Query Log habilitado (consulte [Seção 5.4.3, “The General Query Log”]). Em seguida, tente determinar a partir das informações escritas no Log se alguma Query específica está derrubando o servidor. Cerca de 95% de todos os bugs estão relacionados a uma Query específica. Normalmente, esta é uma das últimas Queries no Log file logo antes de o servidor reiniciar. Consulte [Seção 5.4.3, “The General Query Log”]. Se você conseguir derrubar o MySQL repetidamente com uma Query específica, mesmo tendo verificado todas as Tables logo antes de emiti-la, então você isolou o bug e deve enviar um Bug Report. Consulte [Seção 1.5, “How to Report Bugs or Problems”].

* Tente criar um Test Case que possamos usar para repetir o problema. Consulte [Seção 5.8, “Debugging MySQL”].

* Tente o script `fork_big.pl`. (Ele está localizado no diretório `tests` das distribuições source.)

* Configurar o MySQL para Debugging torna muito mais fácil coletar informações sobre possíveis erros se algo der errado. Reconfigure o MySQL com a opção [`-DWITH_DEBUG=1`] para o **CMake** e, em seguida, recompile. Consulte [Seção 5.8, “Debugging MySQL”].

* Certifique-se de ter aplicado os patches mais recentes para o seu sistema operacional.

* Use a opção [`--skip-external-locking`] para o [**mysqld**]. Em alguns sistemas, o Lock Manager `lockd` não funciona corretamente; a opção [`--skip-external-locking`] instrui o [**mysqld**] a não usar External Locking. (Isso significa que você não pode executar dois servidores [**mysqld**] no mesmo data directory e que você deve ter cuidado se usar [**myisamchk**]. No entanto, pode ser instrutivo tentar a opção como um teste.)

* Se o [**mysqld**] parecer estar em execução, mas não estiver respondendo, tente [**mysqladmin -u root processlist**]. Às vezes, o [**mysqld**] não está travado (hung), embora pareça sem resposta. O problema pode ser que todas as connections estão em uso, ou pode haver algum problema de Internal Lock. [**mysqladmin -u root processlist**] geralmente consegue fazer uma connection mesmo nesses casos e pode fornecer informações úteis sobre o número atual de connections e seu status.

* Execute o comando [**mysqladmin -i 5 status**] ou [**mysqladmin -i 5 -r status**] em uma janela separada para produzir estatísticas enquanto executa outras Queries.

* Tente o seguinte:

  1. Inicie o [**mysqld**] a partir do **gdb** (ou outro Debugger). Consulte [Seção 5.8, “Debugging MySQL”].
  2. Execute seus Test Scripts.
  3. Imprima o Backtrace e as variáveis locais nos três níveis mais baixos. No **gdb**, você pode fazer isso com os seguintes comandos quando o [**mysqld**] tiver sofrido crash dentro do **gdb**:

     ```sql
     backtrace
     info local
     up
     info local
     up
     info local
     ```

     Com o **gdb**, você também pode examinar quais Threads existem com `info threads` e mudar para uma Thread específica com `thread N`, onde *`N`* é o ID da Thread.

* Tente simular sua aplicação com um script Perl para forçar o MySQL a sair ou apresentar comportamento inadequado.

* Envie um Bug Report normal. Consulte [Seção 1.5, “How to Report Bugs or Problems”]. Seja ainda mais detalhado do que o normal. Como o MySQL funciona para muitas pessoas, o crash pode ser resultado de algo que existe apenas no seu computador (por exemplo, um erro relacionado às suas bibliotecas de sistema específicas).

* Se você tiver um problema com Tables contendo linhas de comprimento dinâmico e estiver usando apenas colunas [`VARCHAR`] (e não colunas [`BLOB`] ou [`TEXT`]), você pode tentar mudar todas as [`VARCHAR`] para [`CHAR`] com [`ALTER TABLE`]. Isso força o MySQL a usar linhas de tamanho fixo (fixed-size rows). Linhas de tamanho fixo ocupam um pouco mais de espaço, mas são muito mais tolerantes à corrupção.

  O código atual de linhas dinâmicas tem sido usado por vários anos com pouquíssimos problemas, mas linhas de comprimento dinâmico são por natureza mais propensas a erros, então pode ser uma boa ideia tentar esta estratégia para ver se ajuda.

* Considere a possibilidade de falhas de hardware ao diagnosticar problemas. Hardware defeituoso pode ser a causa de corrupção de dados. Preste atenção especial aos seus subsistemas de memória e disco ao fazer o Troubleshooting de hardware.
