#### B.3.2.17 Problemas de corrupção de tabela

Se você iniciou o **mysqld** com a variável de sistema `myisam_recover_options` definida, o MySQL verifica automaticamente e tenta reparar as tabelas `MyISAM` marcadas como 'não fechadas corretamente' ou 'quebras'. Se isso acontecer, o MySQL escreve uma entrada no arquivo `hostname.err` `'Warning: Checking table ...'` que é seguida por `Warning: Repairing table` se a tabela precisar ser reparada. Se você receber muitos desses erros, sem que o **mysqld** tenha falhado inesperadamente pouco antes, então algo está errado e precisa ser investigado mais a fundo.

Quando o servidor detecta a corrupção da tabela `MyISAM`, ele escreve informações adicionais no log de erro, como o nome e o número da linha do arquivo de origem e a lista de threads acessando a tabela. Exemplo: `Got an error from thread_id=1, mi_dynrec.c:368`. Essas são informações úteis para incluir em relatórios de bugs.

Veja também a Seção 7.1.7, “Opções de Comando do Servidor”, e a Seção 7.9.1.7, “Criando um Caso de Teste Se Você Experimenta Corrupção na Tabela”.
