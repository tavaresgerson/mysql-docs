#### B.3.3.3 O que fazer se o MySQL continuar a falhar

Cada versão do MySQL é testada em muitas plataformas antes de ser lançada. Isso não significa que não haja bugs no MySQL, mas se houver, eles devem ser muito poucos e difíceis de encontrar. Se você tiver um problema, sempre ajuda se você tentar descobrir exatamente o que faz seu sistema falhar, porque você tem uma chance muito maior de resolver o problema rapidamente.

Primeiro, você deve tentar descobrir se o problema é que o servidor **mysqld** está morrendo ou se o seu problema está relacionado ao seu cliente. Você pode verificar quanto tempo o seu servidor **mysqld** está ativo executando **mysqladmin versão**. Se o **mysqld** morreu e reiniciou, você pode encontrar a razão olhando no log de erro do servidor. Veja a Seção 7.4.2, “O Log de Erro”.

Em alguns sistemas, você pode encontrar no log de erro uma cadeia de depuração de onde o **mysqld** morreu. Observe que os valores das variáveis escritos no log de erro nem sempre podem ser 100% corretos.

Se você perceber que o **mysqld** falha durante a recuperação do `InnoDB`, consulte a Seção 17.21.2, “Soluções para falhas de recuperação”.

Muitas saídas inesperadas do servidor são causadas por arquivos de dados ou arquivos de índice corrompidos. O MySQL atualiza os arquivos no disco com a chamada de sistema `write()` após cada instrução SQL e antes que o cliente seja notificado sobre o resultado. (Isso não é verdade se você estiver executando com a variável de sistema `delay_key_write` habilitada, caso em que os arquivos de dados são escritos, mas não os arquivos de índice.) Isso significa que o conteúdo dos arquivos de dados está seguro mesmo se o **mysqld** falhar, porque o sistema operacional garante que os dados não descarregados sejam escritos no disco. Você pode forçar o MySQL a descarregar tudo no disco após cada instrução SQL, iniciando o **mysqld** com a opção `--flush`.

O que precede significa que, normalmente, você não deve obter tabelas corrompidas, a menos que uma das seguintes situações ocorra:

- O servidor MySQL ou o host do servidor foi interrompido durante uma atualização.

- Você encontrou um erro no **mysqld** que fez com que ele morresse no meio de uma atualização.

- Alguns programas externos estão manipulando arquivos de dados ou arquivos de índice ao mesmo tempo que o **mysqld** sem bloquear a tabela corretamente.

- Você está executando muitos servidores **mysqld** usando o mesmo diretório de dados em um sistema que não suporta bons bloqueios de sistema de arquivos (normalmente gerenciados pelo gerenciador de bloqueio `lockd`), ou você está executando vários servidores com bloqueio externo desativado.

- Você tem um arquivo de dados ou arquivo de índice que contém dados muito corrompidos que confundiram o **mysqld**.

- Você encontrou um erro no código de armazenamento de dados. Isso não é provável, mas é pelo menos possível. Nesse caso, você pode tentar alterar o mecanismo de armazenamento para outro mecanismo usando `ALTER TABLE` em uma cópia reparada da tabela.

Porque é muito difícil saber por que algo está travando, tente primeiro verificar se as coisas que funcionam para outras pessoas resultam em uma saída inesperada para você. Experimente as seguintes coisas:

- Pare o servidor **mysqld** com **mysqladmin shutdown**, execute **myisamchk --silent --force */*.MYI** a partir do diretório de dados para verificar todas as tabelas `MyISAM` e reinicie o **mysqld**. Isso garante que você esteja executando em um estado limpo. Veja o Capítulo 7, *Administração do Servidor MySQL*.

- Inicie o **mysqld** com o log de consultas gerais habilitado (consulte a Seção 7.4.3, “O Log de Consultas Gerais”). Em seguida, tente determinar, com base nas informações escritas no log, se alguma consulta específica está causando o desligamento do servidor. Cerca de 95% de todos os erros estão relacionados a uma consulta específica. Normalmente, essa é uma das últimas consultas no arquivo de log logo antes do reinício do servidor. Consulte a Seção 7.4.3, “O Log de Consultas Gerais”. Se você puder reiniciar o MySQL repetidamente com uma consulta específica, mesmo depois de ter verificado todas as tabelas antes de executá-la, então você isolou o erro e deve enviar um relatório de erro para ele. Consulte a Seção 1.5, “Como Relatar Erros ou Problemas”.

- Tente criar um caso de teste que possamos usar para repetir o problema. Veja a Seção 7.9, “Depuração do MySQL”.

- Experimente o script `fork_big.pl`. (Ele está localizado no diretório `tests` das distribuições de código-fonte.)

- Configurar o MySQL para depuração facilita muito a coleta de informações sobre possíveis erros caso algo dê errado. Reconfigurar o MySQL com a opção `-DWITH_DEBUG=1` para o **CMake** e, em seguida, recompilar. Veja a Seção 7.9, “Depuração do MySQL”.

- Certifique-se de que você aplicou os últimos patches do seu sistema operacional.

- Use a opção `--skip-external-locking` para o **mysqld**. Em alguns sistemas, o gerenciador de bloqueio `lockd` não funciona corretamente; a opção `--skip-external-locking` instrui o **mysqld** a não usar bloqueio externo. (Isso significa que você não pode executar dois servidores **mysqld** no mesmo diretório de dados e que você deve ter cuidado ao usar o **myisamchk**. No entanto, pode ser instrutivo tentar a opção como um teste.)

- Se o **mysqld** estiver rodando, mas não respondendo, tente **mysqladmin -u root processlist**. Às vezes, o **mysqld** não fica parado, mesmo que pareça não responder. O problema pode ser que todas as conexões estejam sendo usadas ou que haja algum problema de bloqueio interno. O **mysqladmin -u root processlist** geralmente consegue fazer uma conexão mesmo nesses casos e pode fornecer informações úteis sobre o número atual de conexões e seu status.

- Execute o comando **mysqladmin -i 5 status** ou **mysqladmin -i 5 -r status** em uma janela separada para obter estatísticas enquanto executa outras consultas.

- Experimente o seguinte:

  1. Inicie o **mysqld** a partir do **gdb** (ou outro depurador). Veja a Seção 7.9, “Depuração do MySQL”.

  2. Execute seus scripts de teste.

  3. Imprima o backtrace e as variáveis locais nos três níveis mais baixos. No **gdb**, você pode fazer isso com os seguintes comandos quando o **mysqld** caiu dentro do **gdb**:

     ```
     backtrace
     info local
     up
     info local
     up
     info local
     ```

     Com o **gdb**, você também pode verificar quais threads existem com `info threads` e alternar para um thread específico com `thread N`, onde `N` é o ID do thread.

- Tente simular sua aplicação com um script Perl para forçar o MySQL a sair ou a se comportar de forma inadequada.

- Envie um relatório de erro normal. Veja a Seção 1.5, “Como relatar erros ou problemas”. Seja ainda mais detalhado do que o habitual. Como o MySQL funciona para muitas pessoas, o travamento pode resultar de algo que existe apenas no seu computador (por exemplo, um erro relacionado às suas bibliotecas de sistema específicas).

- Se você tem um problema com tabelas que contêm linhas de comprimento dinâmico e está usando apenas colunas `VARCHAR` (não colunas `BLOB` ou `TEXT`), você pode tentar alterar todos os `VARCHAR` para `CHAR` com `ALTER TABLE`. Isso força o MySQL a usar linhas de tamanho fixo. Linhas de tamanho fixo ocupam um pouco mais de espaço, mas são muito mais tolerantes à corrupção.

  O código de linha dinâmico atual tem sido usado por vários anos com poucos problemas, mas as linhas de comprimento dinâmico são, por natureza, mais propensas a erros, então pode ser uma boa ideia tentar essa estratégia para ver se ajuda.

- Considere a possibilidade de falhas de hardware ao diagnosticar problemas. O hardware defeituoso pode ser a causa da corrupção de dados. Preste atenção especial aos seus subsistemas de memória e disco ao solucionar problemas de hardware.
