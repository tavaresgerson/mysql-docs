#### B.3.2.17 Problemas de corrupção de tabela

Se você iniciou o [**mysqld**](mysqld.html) com a variável de sistema [`myisam_recover_options`](server-system-variables.html#sysvar_myisam_recover_options) definida, o MySQL verifica automaticamente e tenta reparar as tabelas `MyISAM` se elas estiverem marcadas como 'não fechadas corretamente' ou 'quebradas'. Se isso acontecer, o MySQL escreve uma entrada no arquivo `hostname.err` `'Aviso: Verificando tabela ...'` seguida de `Aviso: Reparando tabela` se a tabela precisar ser reparada. Se você receber muitos desses erros, sem que o [**mysqld**](mysqld.html) tenha falhado inesperadamente pouco antes, então algo está errado e precisa ser investigado mais a fundo.

Quando o servidor detecta a corrupção da tabela `MyISAM`, ele escreve informações adicionais no log de erro, como o nome e o número da linha do arquivo de origem e a lista de threads acessando a tabela. Exemplo: `Recebi um erro do thread_id=1, mi_dynrec.c:368`. Essas são informações úteis para incluir em relatórios de bugs.

Veja também [Seção 5.1.6, “Opções de Comando do Servidor”](server-options.html) e [Seção 5.8.1.7, “Criando um Caso de Teste Se Você Experimenta Corrupção na Tabela”](reproducible-test-case.html).
