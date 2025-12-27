#### B.3.2.17 Problemas de corrupção de tabelas

Se você iniciou o `mysqld` com a variável de sistema `myisam_recover_options` definida, o MySQL verifica automaticamente e tenta reparar as tabelas `MyISAM` se elas estiverem marcadas como 'não fechadas corretamente' ou 'quebradas'. Se isso acontecer, o MySQL escreve uma entrada no arquivo `hostname.err` com a mensagem `'Aviso: Verificando tabela ...'` seguida de `Aviso: Reparando tabela` se a tabela precisar ser reparada. Se você receber muitos desses erros, sem que o `mysqld` tenha falhado inesperadamente pouco antes, então algo está errado e precisa ser investigado mais a fundo.

Quando o servidor detecta a corrupção de tabelas `MyISAM`, ele escreve informações adicionais no log de erro, como o nome e o número da linha do arquivo fonte e a lista de threads acessando a tabela. Exemplo: `Obteve um erro do thread_id=1, mi_dynrec.c:368`. Essas são informações úteis para incluir em relatórios de bugs.

Veja também a Seção 7.1.7, “Opções de comando do servidor”, e a Seção 7.9.1.7, “Criando um caso de teste se você experimentar corrupção de tabela”.