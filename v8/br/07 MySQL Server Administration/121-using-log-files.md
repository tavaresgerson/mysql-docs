#### 7.9.1.6 Usando logs do servidor para encontrar causas de erros em mysqld

Observe que antes de iniciar `mysqld` com o registro de consultas gerais habilitado, você deve verificar todas as suas tabelas com `myisamchk`. Veja Capítulo 7, *Administração do Servidor MySQL*.

Se `mysqld` morrer ou ficar pendurado, você deve iniciar `mysqld` com o log de consulta geral habilitado. Veja Seção 7.4.3, O Log de consulta geral. Quando `mysqld` morrer novamente, você pode examinar o final do arquivo de log para a consulta que matou `mysqld`.

Se você usar o arquivo de registro de consulta geral padrão, o registro é armazenado no diretório do banco de dados como `host_name.log` Na maioria dos casos, é a última consulta no arquivo de registro que matou `mysqld`, mas se possível, você deve verificar isso reiniciando `mysqld` e executando a consulta encontrada a partir das ferramentas de linha de comando `mysql`. Se isso funcionar, você também deve testar todas as consultas complicadas que não foram concluídas.

Você também pode tentar o comando `EXPLAIN` em todas as instruções `SELECT` que levam muito tempo para garantir que `mysqld` está usando índices corretamente. Veja Seção 15.8.2, EXPLAIN Statement.

Você pode encontrar as consultas que levam muito tempo para serem executadas iniciando `mysqld` com o registro de consultas lentas ativado.

Se você encontrar o texto `mysqld restarted` no registro de erros (normalmente um arquivo chamado `host_name.err`), provavelmente encontrou uma consulta que faz com que `mysqld` falhe. Se isso acontecer, você deve verificar todas as suas tabelas com `myisamchk` (ver Capítulo 7, *Administração do Servidor MySQL*), e testar as consultas nos arquivos de log do MySQL para ver se uma falha. Se você encontrar tal consulta, tente primeiro atualizar para a versão mais recente do MySQL. Se isso não ajudar, informe um bug, veja Seção 1.6, Como Reportar Bugs ou Problemas.

Se você iniciou `mysqld` com o conjunto de variáveis do sistema `myisam_recover_options`, o MySQL verifica automaticamente e tenta reparar as tabelas `MyISAM` se elas estiverem marcadas como 'não fechadas corretamente' ou 'crashed'. Se isso acontecer, o MySQL escreve uma entrada no arquivo `hostname.err` `'Warning: Checking table ...'` que é seguido por `Warning: Repairing table` se a tabela precisar ser reparada. Se você receber muitos desses erros, sem que `mysqld` tenha morrido inesperadamente pouco antes, então algo está errado e precisa ser investigado mais a fundo. Veja Seção 7.1.7, Opções de Comando do Servidor.

Quando o servidor detecta a corrupção da tabela `MyISAM`, ele escreve informações adicionais para o registro de erros, como o nome e o número de linha do arquivo de origem, e a lista de tópicos que acessam a tabela. Exemplo: `Got an error from thread_id=1, mi_dynrec.c:368`. Esta é uma informação útil para incluir em relatórios de erros.

Não é um bom sinal se `mysqld` morreu inesperadamente, mas neste caso, você não deve investigar as mensagens `Checking table...`, mas em vez disso tentar descobrir por que `mysqld` morreu.
