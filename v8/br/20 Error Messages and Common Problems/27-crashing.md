#### B.3.3.3 O que fazer se o MySQL continuar a falhar

Cada versão do MySQL é testada em muitas plataformas antes de ser lançada. Isso não significa que não haja bugs no MySQL, mas se houver, eles devem ser muito poucos e podem ser difíceis de encontrar. Se você tiver um problema, sempre ajuda se você tentar descobrir exatamente o que faz o seu sistema falhar, porque você tem uma chance muito maior de resolver o problema rapidamente.

Primeiro, você deve tentar descobrir se o problema é que o servidor  `mysqld` morre ou se o seu problema tem a ver com o seu cliente. Você pode verificar quanto tempo o seu servidor  `mysqld` está em funcionamento executando  `mysqladmin version`. Se o  `mysqld` morreu e reiniciou, você pode encontrar a razão olhando no log de erro do servidor. Veja  Seção 7.4.2, “O Log de Erro”.

Em alguns sistemas, você pode encontrar no log de erro uma traça de pilha de onde o  `mysqld` morreu. Note que os valores das variáveis escritos no log de erro nem sempre são 100% corretos.

Se você descobrir que o  `mysqld` falha ao iniciar durante a recuperação do  `InnoDB`, consulte  Seção 17.20.2, “Soluções para Falhas de Recuperação”.

Muitas saídas inesperadas do servidor são causadas por arquivos de dados ou arquivos de índice corrompidos. O MySQL atualiza os arquivos no disco com a chamada de sistema  `write()` após cada instrução SQL e antes que o cliente seja notificado sobre o resultado. (Isso não é verdade se você estiver executando com a variável de sistema  `delay_key_write` habilitada, caso em que os arquivos de dados são escritos, mas não os arquivos de índice.) Isso significa que o conteúdo dos arquivos de dados está seguro mesmo se o  `mysqld` falhar, porque o sistema operacional garante que os dados não descarregados sejam escritos no disco. Você pode forçar o MySQL a descarregar tudo no disco após cada instrução SQL iniciando o  `mysqld` com a opção  `--flush`.

O que precede significa que, normalmente, você não deve obter tabelas corrompidas, a menos que uma das seguintes situações ocorra:

* O servidor MySQL ou o host do servidor foi interrompido durante uma atualização.
* Você encontrou um erro no `mysqld` que causou sua interrupção durante uma atualização.
* Um programa externo está manipulando arquivos de dados ou arquivos de índice ao mesmo tempo que o `mysqld`, sem bloquear a tabela corretamente.
* Você está executando muitos servidores `mysqld` usando o mesmo diretório de dados em um sistema que não suporta bons bloqueios de sistema de arquivos (normalmente gerenciados pelo gerenciador de bloqueios `lockd`), ou está executando múltiplos servidores com bloqueio externo desativado.
* Você tem um arquivo de dados ou arquivo de índice quebrado que contém dados muito corrompidos que confundiram o `mysqld`.
* Você encontrou um erro no código de armazenamento de dados. Isso não é provável, mas pelo menos é possível. Nesse caso, você pode tentar alterar o motor de armazenamento para outro motor usando `ALTER TABLE` em uma cópia reparada da tabela.

Como é muito difícil saber por que algo está travando, primeiro tente verificar se as coisas que funcionam para outros resultam em uma saída inesperada para você. Experimente as seguintes coisas:

* Parar o servidor `mysqld` com `mysqladmin shutdown`, executar **myisamchk --silent --force \*/\*.MYI** a partir do diretório de dados para verificar todas as tabelas `MyISAM`, e reiniciar `mysqld`. Isso garante que você esteja executando em um estado limpo. Veja o Capítulo 7, *Administração do Servidor MySQL*.
* Iniciar o `mysqld` com o log de consultas geral habilitado (veja a Seção 7.4.3, “O Log de Consultas Geral”). Em seguida, tente determinar, com base nas informações escritas no log, se alguma consulta específica está matando o servidor. Cerca de 95% de todos os bugs estão relacionados a uma consulta específica. Normalmente, essa é uma das últimas consultas no arquivo de log logo antes do servidor ser reiniciado. Veja a Seção 7.4.3, “O Log de Consultas Geral”. Se você puder matar o MySQL repetidamente com uma consulta específica, mesmo quando verificou todas as tabelas logo antes de executá-la, então você isolou o bug e deve enviar um relatório de bug para ele. Veja a Seção 1.6, “Como Relatar Bugs ou Problemas”.
* Tente criar um caso de teste que possamos usar para repetir o problema. Veja a Seção 7.9, “Depuração do MySQL”.
* Tente o script `fork_big.pl`. (Ele está localizado no diretório `tests` das distribuições de código-fonte.)
* Configurar o MySQL para depuração facilita muito a coleta de informações sobre possíveis erros se algo der errado. Reconfigurar o MySQL com a opção  `-DWITH_DEBUG=1` para o `CMake` e depois recompilar. Veja a Seção 7.9, “Depuração do MySQL”.
* Certifique-se de que você aplicou os últimos patches para o seu sistema operacional.
* Use a opção  `--skip-external-locking` no `mysqld`. Em alguns sistemas, o gerenciador de bloqueio `lockd` não funciona corretamente; a opção  `--skip-external-locking` instrui o `mysqld` a não usar bloqueio externo. (Isso significa que você não pode executar dois servidores `mysqld` no mesmo diretório de dados e que você deve ter cuidado ao usar `myisamchk`. No entanto, pode ser instrutivo tentar a opção como um teste.)
* Se o `mysqld` parecer estar rodando, mas não respondendo, tente **mysqladmin -u root processlist**. Às vezes, o `mysqld` não fica parado, mesmo que pareça não responder. O problema pode ser que todas as conexões estão em uso, ou pode haver algum problema interno de bloqueio. **mysqladmin -u root processlist** geralmente consegue fazer uma conexão mesmo nesses casos, e pode fornecer informações úteis sobre o número atual de conexões e seu status.
* Execute o comando **mysqladmin -i 5 status** ou **mysqladmin -i 5 -r status** em uma janela separada para produzir estatísticas enquanto executa outras consultas.
* Tente o seguinte:

1. Inicie o `mysqld` a partir do `gdb` (ou outro depurador). Veja a Seção 7.9, “Depuração do MySQL”.
2. Execute seus scripts de teste.
3. Imprima a backtrace e as variáveis locais nos três níveis mais baixos. No `gdb`, você pode fazer isso com os seguintes comandos quando o `mysqld` caiu dentro do `gdb`:

     ```
     backtrace
     info local
     up
     info local
     up
     info local
     ```

     Com o `gdb`, você também pode examinar quais threads existem com `info threads` e alternar para um thread específico com `thread N`, onde *`N`* é o ID do thread.
* Tente simular sua aplicação com um script Perl para forçar o MySQL a sair ou se comportar mal.
* Envie um relatório de bug normal. Veja a Seção 1.6, “Como Relatar Bugs ou Problemas”. Seja ainda mais detalhado do que o usual. Como o MySQL funciona para muitas pessoas, o crash pode resultar de algo que existe apenas no seu computador (por exemplo, um erro relacionado às suas bibliotecas de sistema específicas).
* Se você tiver um problema com tabelas que contêm linhas de comprimento dinâmico e estiver usando apenas colunas `VARCHAR` (não colunas `BLOB` ou `TEXT`), você pode tentar alterar todas as `VARCHAR` para `CHAR` com `ALTER TABLE`. Isso força o MySQL a usar linhas de tamanho fixo. Linhas de tamanho fixo ocupam um pouco mais de espaço, mas são muito mais tolerantes à corrupção.
* O código de linha dinâmica atual tem sido usado por vários anos com poucos problemas, mas linhas de comprimento dinâmico são, por natureza, mais propensas a erros, então pode ser uma boa ideia tentar essa estratégia para ver se ajuda.
* Considere a possibilidade de falhas de hardware ao diagnosticar problemas. Hardware defeituoso pode ser a causa da corrupção de dados. Preste atenção especial à sua memória e subsistemas de disco ao solucionar problemas de hardware.