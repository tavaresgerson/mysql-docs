#### B.3.3.3 O que fazer se o MySQL continuar a falhar

Cada versão do MySQL é testada em muitas plataformas antes de ser lançada. Isso não significa que não haja bugs no MySQL, mas se houver, eles devem ser muito poucos e podem ser difíceis de encontrar. Se você tiver um problema, sempre ajuda se você tentar descobrir exatamente o que faz o seu sistema falhar, porque você tem uma chance muito maior de resolver o problema rapidamente.

Primeiro, você deve tentar descobrir se o problema é que o servidor **mysqld** morre ou se o seu problema tem a ver com o seu cliente. Você pode verificar quanto tempo o seu servidor **mysqld** está em funcionamento executando **mysqladmin versão**. Se o **mysqld** morreu e reiniciou, você pode encontrar a razão olhando no log de erro do servidor. Veja a Seção 7.4.2, “O Log de Erro”.

Em alguns sistemas, você pode encontrar no log de erro uma traça de pilha de onde o **mysqld** morreu. Note que os valores das variáveis escritos no log de erro nem sempre são 100% corretos.

Se você descobrir que o **mysqld** falha ao iniciar durante a recuperação do `InnoDB`, consulte a Seção 17.20.2, “Soluções de Problemas de Falhas de Recuperação”.

Muitas saídas inesperadas do servidor são causadas por arquivos de dados ou arquivos de índice corrompidos. O MySQL atualiza os arquivos no disco com a chamada de sistema `write()` após cada instrução SQL e antes que o cliente seja notificado sobre o resultado. (Isso não é verdade se você estiver executando com a variável de sistema `delay_key_write` habilitada, caso em que os arquivos de dados são escritos, mas não os arquivos de índice.) Isso significa que o conteúdo dos arquivos de dados está seguro mesmo se o **mysqld** falhar, porque o sistema operacional garante que os dados não descarregados sejam escritos no disco. Você pode forçar o MySQL a descarregar tudo no disco após cada instrução SQL iniciando o **mysqld** com a opção `--flush`.

O que precede significa que, normalmente, você não deve obter tabelas corrompidas, a menos que uma das seguintes situações ocorra:

* O servidor MySQL ou o host do servidor foi interrompido no meio de uma atualização.

* Você encontrou um bug no **mysqld** que causou sua morte no meio de uma atualização.

* Alguns programas externos estão manipulando arquivos de dados ou arquivos de índice ao mesmo tempo que o **mysqld** sem bloquear a tabela corretamente.

* Você está executando muitos servidores **mysqld** usando o mesmo diretório de dados em um sistema que não suporta bons bloqueios de sistema de arquivos (normalmente gerenciados pelo gerenciador de bloqueios `lockd`), ou você está executando vários servidores com bloqueio externo desativado.

* Você tem um arquivo de dados ou arquivo de índice quebrado que contém dados muito corrompidos que confundiram o **mysqld**.

* Você encontrou um bug no código de armazenamento de dados. Isso não é provável, mas pelo menos é possível. Nesse caso, você pode tentar alterar o motor de armazenamento para outro motor usando `ALTER TABLE` em uma cópia reparada da tabela.

Como é muito difícil saber por que algo está travando, primeiro tente verificar se as coisas que funcionam para outros resultam em uma saída inesperada para você. Tente as seguintes coisas:

* Pare o servidor **mysqld** com **mysqladmin shutdown**, execute **myisamchk --silent --force \*/\*.MYI** a partir do diretório de dados para verificar todas as tabelas `MyISAM` e reinicie o **mysqld**. Isso garante que você esteja executando em um estado limpo. Veja o Capítulo 7, *Administração do Servidor MySQL*.

* Inicie o **mysqld** com o log de consultas gerais habilitado (consulte a Seção 7.4.3, “O Log de Consultas Gerais”). Em seguida, tente determinar, com base nas informações escritas no log, se alguma consulta específica está causando o desligamento do servidor. Cerca de 95% de todos os bugs estão relacionados a uma consulta específica. Normalmente, essa é uma das últimas consultas no arquivo de log logo antes do servidor ser reiniciado. Consulte a Seção 7.4.3, “O Log de Consultas Gerais”. Se você conseguir interromper repetidamente o MySQL com uma consulta específica, mesmo depois de ter verificado todas as tabelas antes de executá-la, você isolou o bug e deve enviar um relatório de bug para ele. Consulte a Seção 1.6, “Como Relatar Bugs ou Problemas”.

* Tente criar um caso de teste que possamos usar para repetir o problema. Consulte a Seção 7.9, “Depuração do MySQL”.

* Tente o script `fork_big.pl`. (Ele está localizado no diretório `tests` das distribuições de código-fonte.)

* Configurar o MySQL para depuração facilita muito a coleta de informações sobre possíveis erros, caso algo dê errado. Reconfigure o MySQL com a opção `-DWITH_DEBUG=1` para o **CMake** e depois recompile. Consulte a Seção 7.9, “Depuração do MySQL”.

* Certifique-se de que você aplicou os patches mais recentes para o seu sistema operacional.

* Use a opção `--skip-external-locking` para o **mysqld**. Em alguns sistemas, o gerenciador de bloqueio `lockd` não funciona corretamente; a opção `--skip-external-locking` informa ao **mysqld** para não usar bloqueio externo. (Isso significa que você não pode executar dois servidores **mysqld** no mesmo diretório de dados e que você deve ter cuidado ao usar o **myisamchk**. No entanto, pode ser instrutivo tentar a opção como um teste.)

* Se o **mysqld** estiver em execução, mas não respondendo, tente **mysqladmin -u root processlist**. Às vezes, o **mysqld** não fica parado, mesmo que pareça não responder. O problema pode ser que todas as conexões estejam em uso ou que haja algum problema interno de bloqueio. **mysqladmin -u root processlist** geralmente consegue fazer uma conexão mesmo nesses casos e pode fornecer informações úteis sobre o número atual de conexões e seu status.

* Execute o comando **mysqladmin -i 5 status** ou **mysqladmin -i 5 -r status** em uma janela separada para obter estatísticas enquanto executa outras consultas.

* Tente o seguinte:

  1. Inicie o **mysqld** a partir do **gdb** (ou outro depurador). Veja a Seção 7.9, “Depuração do MySQL”.

  2. Execute seus scripts de teste.
  3. Imprima a backtrace e as variáveis locais nos três níveis mais baixos. No **gdb**, você pode fazer isso com os seguintes comandos quando o **mysqld** caiu dentro do **gdb**:

     ```
     backtrace
     info local
     up
     info local
     up
     info local
     ```

     Com o **gdb**, você também pode examinar quais threads existem com `info threads` e alternar para um thread específico com `thread N`, onde *`N`* é o ID do thread.

* Tente simular sua aplicação com um script Perl para forçar o MySQL a sair ou se comportar de forma incorreta.

* Envie um relatório de bug normal. Veja a Seção 1.6, “Como Relatar Bugs ou Problemas”. Seja ainda mais detalhado do que o usual. Como o MySQL funciona para muitas pessoas, o crash pode resultar de algo que existe apenas no seu computador (por exemplo, um erro relacionado às suas bibliotecas de sistema específicas).

* Se você tem um problema com tabelas que contêm linhas de comprimento dinâmico e está usando apenas colunas `VARCHAR` (não `BLOB` ou colunas `TEXT`), você pode tentar alterar todas as `VARCHAR` para `CHAR` com `ALTER TABLE`. Isso força o MySQL a usar linhas de tamanho fixo. Linhas de tamanho fixo ocupam um pouco mais de espaço, mas são muito mais tolerantes à corrupção.

O código atual de linha dinâmica tem sido usado por vários anos com poucos problemas, mas as linhas de comprimento dinâmico são, por natureza, mais propensas a erros, então pode ser uma boa ideia tentar essa estratégia para ver se ajuda.

* Considere a possibilidade de falhas de hardware ao diagnosticar problemas. Hardware defeituoso pode ser a causa da corrupção de dados. Preste atenção especial à sua memória e subsistemas de disco ao solucionar problemas de hardware.