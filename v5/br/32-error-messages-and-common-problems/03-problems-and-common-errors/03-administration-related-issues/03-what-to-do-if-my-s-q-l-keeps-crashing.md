#### B.3.3.3 O que fazer se o MySQL continuar a falhar

Cada versão do MySQL é testada em muitas plataformas antes de ser lançada. Isso não significa que não haja bugs no MySQL, mas se houver, eles devem ser muito poucos e difíceis de encontrar. Se você tiver um problema, sempre ajuda se você tentar descobrir exatamente o que faz seu sistema falhar, porque você tem uma chance muito maior de resolver o problema rapidamente.

Primeiro, você deve tentar descobrir se o problema é que o servidor [**mysqld**](mysqld.html) está morrendo ou se o seu problema tem a ver com o seu cliente. Você pode verificar quanto tempo o seu servidor [**mysqld**](mysqld.html) está ativo executando [**mysqladmin versão**](mysqladmin.html). Se o [**mysqld**](mysqld.html) morreu e reiniciou, você pode encontrar a razão olhando no log de erro do servidor. Veja [Seção 5.4.2, “O Log de Erro”](error-log.html).

Em alguns sistemas, você pode encontrar no log de erro uma traça de pilha de onde o [**mysqld**](mysqld.html) morreu, que você pode resolver com o programa `resolve_stack_dump`. Veja [Seção 5.8, “Depuração do MySQL”](debugging-mysql.html). Observe que os valores das variáveis escritos no log de erro nem sempre serão 100% corretos.

Muitas saídas inesperadas do servidor são causadas por arquivos de dados ou arquivos de índice corrompidos. O MySQL atualiza os arquivos no disco com a chamada de sistema `write()` após cada instrução SQL e antes que o cliente seja notificado sobre o resultado. (Isso não é verdade se você estiver executando com a variável de sistema [`delay_key_write`](server-system-variables.html#sysvar_delay_key_write) habilitada, caso em que os arquivos de dados são escritos, mas não os arquivos de índice.) Isso significa que o conteúdo dos arquivos de dados está seguro mesmo se o [**mysqld**](mysqld.html) falhar, porque o sistema operacional garante que os dados não descarregados sejam escritos no disco. Você pode forçar o MySQL a descarregar tudo no disco após cada instrução SQL iniciando o [**mysqld**](mysqld.html) com a opção [`--flush`](server-options.html#option_mysqld_flush).

O que precede significa que, normalmente, você não deve obter tabelas corrompidas, a menos que uma das seguintes situações ocorra:

- O servidor MySQL ou o host do servidor foi interrompido durante uma atualização.

- Você encontrou um erro em [**mysqld**](mysqld.html) que fez com que ele morresse no meio de uma atualização.

- Alguns programas externos estão manipulando arquivos de dados ou arquivos de índice ao mesmo tempo que o [**mysqld**](mysqld.html) sem bloquear a tabela corretamente.

- Você está executando muitos servidores [**mysqld**](mysqld.html) usando o mesmo diretório de dados em um sistema que não suporta bons bloqueios de sistema de arquivos (normalmente gerenciados pelo gerenciador de bloqueios `lockd`), ou você está executando vários servidores com bloqueio externo desativado.

- Você tem um arquivo de dados ou arquivo de índice que contém dados muito corrompidos que confundiram [**mysqld**](mysqld.html).

- Você encontrou um erro no código de armazenamento de dados. Isso não é provável, mas é pelo menos possível. Nesse caso, você pode tentar alterar o mecanismo de armazenamento para outro mecanismo usando [`ALTER TABLE`](alter-table.html) em uma cópia reparada da tabela.

Porque é muito difícil saber por que algo está travando, tente primeiro verificar se as coisas que funcionam para outras pessoas resultam em uma saída inesperada para você. Experimente as seguintes coisas:

- Pare o servidor [**mysqld**](mysqld.html) com [**mysqladmin shutdown**](mysqladmin.html), execute [**myisamchk --silent --force */*.MYI**](myisamchk.html) no diretório de dados para verificar todas as tabelas `MyISAM` e reinicie [**mysqld**](mysqld.html). Isso garante que você esteja executando em um estado limpo. Veja [Capítulo 5, *Administração do Servidor MySQL*](server-administration.html).

- Inicie o [**mysqld**](mysqld.html) com o log de consultas gerais habilitado (consulte [Seção 5.4.3, “O Log de Consultas Gerais”](query-log.html)). Em seguida, tente determinar, com base nas informações escritas no log, se alguma consulta específica está causando o desligamento do servidor. Cerca de 95% de todos os erros estão relacionados a uma consulta específica. Normalmente, essa é uma das últimas consultas no arquivo de log logo antes do servidor ser reiniciado. Consulte [Seção 5.4.3, “O Log de Consultas Gerais”](query-log.html). Se você conseguir interromper o MySQL repetidamente com uma consulta específica, mesmo depois de ter verificado todas as tabelas antes de executá-la, então você isolou o erro e deve enviar um relatório de erro para ele. Consulte [Seção 1.5, “Como Relatar Erros ou Problemas”](bug-reports.html).

- Tente criar um caso de teste que possamos usar para repetir o problema. Veja [Seção 5.8, “Depuração do MySQL”](debugging-mysql.html).

- Experimente o script `fork_big.pl`. (Ele está localizado no diretório `tests` das distribuições de código-fonte.)

- Configurar o MySQL para depuração facilita muito a coleta de informações sobre possíveis erros caso algo dê errado. Reconfigure o MySQL com a opção [`-DWITH_DEBUG=1`](source-configuration-options.html#option_cmake_with_debug) para o **CMake** e, em seguida, recompile-o. Veja a [Seção 5.8, “Depuração do MySQL”](debugging-mysql.html).

- Certifique-se de que você aplicou os últimos patches do seu sistema operacional.

- Use a opção [`--skip-external-locking`](server-options.html#option_mysqld_external-locking) para o [**mysqld**](mysqld.html). Em alguns sistemas, o gerenciador de bloqueio `lockd` não funciona corretamente; a opção [`--skip-external-locking`](server-options.html#option_mysqld_external-locking) informa ao [**mysqld**](mysqld.html) para não usar bloqueio externo. (Isso significa que você não pode executar dois servidores [**mysqld**](mysqld.html) no mesmo diretório de dados e que você deve ter cuidado se usar [**myisamchk**](myisamchk.html). No entanto, pode ser instrutivo tentar a opção como um teste.)

- Se o [**mysqld**](mysqld.html) parecer estar rodando, mas não respondendo, tente [**mysqladmin -u root processlist**](mysqladmin.html). Às vezes, o [**mysqld**](mysqld.html) não fica parado, mesmo que pareça não responder. O problema pode ser que todas as conexões estejam sendo usadas ou que haja algum problema de bloqueio interno. O [**mysqladmin -u root processlist**](mysqladmin.html) geralmente consegue fazer uma conexão mesmo nesses casos e pode fornecer informações úteis sobre o número atual de conexões e seu status.

- Execute o comando [**mysqladmin -i 5 status**](mysqladmin.html) ou [**mysqladmin -i 5 -r status**](mysqladmin.html) em uma janela separada para obter estatísticas enquanto executa outras consultas.

- Experimente o seguinte:

  1. Comece [**mysqld**](mysqld.html) a partir do **gdb** (ou outro depurador). Veja [Seção 5.8, “Depuração do MySQL”](debugging-mysql.html).

  2. Execute seus scripts de teste.

  3. Imprima o backtrace e as variáveis locais nos três níveis mais baixos. No **gdb**, você pode fazer isso com os seguintes comandos quando o [**mysqld**](mysqld.html) caiu dentro do **gdb**:

     ```sql
     backtrace
     info local
     up
     info local
     up
     info local
     ```

     Com o **gdb**, você também pode verificar quais threads existem com `info threads` e alternar para uma thread específica com `thread N`, onde *`N`* é o ID da thread.

- Tente simular sua aplicação com um script Perl para forçar o MySQL a sair ou a se comportar de forma inadequada.

- Envie um relatório de erro normal. Veja [Seção 1.5, “Como relatar erros ou problemas”](bug-reports.html). Seja ainda mais detalhado do que o habitual. Como o MySQL funciona para muitas pessoas, o travamento pode resultar de algo que existe apenas no seu computador (por exemplo, um erro relacionado às suas bibliotecas de sistema específicas).

- Se você tem um problema com tabelas que contêm linhas de comprimento dinâmico e está usando apenas colunas de tipo [`VARCHAR`](char.html) (não colunas de tipo [`BLOB`](blob.html) ou [`TEXT`](blob.html)), você pode tentar alterar todas as colunas de tipo [`VARCHAR`](char.html) para colunas de tipo [`CHAR`](char.html) com [`ALTER TABLE`](alter-table.html). Isso obriga o MySQL a usar linhas de tamanho fixo. Linhas de tamanho fixo ocupam um pouco mais de espaço, mas são muito mais tolerantes à corrupção.

  O código de linha dinâmico atual tem sido usado por vários anos com poucos problemas, mas as linhas de comprimento dinâmico são, por natureza, mais propensas a erros, então pode ser uma boa ideia tentar essa estratégia para ver se ajuda.

- Considere a possibilidade de falhas de hardware ao diagnosticar problemas. O hardware defeituoso pode ser a causa da corrupção de dados. Preste atenção especial aos seus subsistemas de memória e disco ao solucionar problemas de hardware.
