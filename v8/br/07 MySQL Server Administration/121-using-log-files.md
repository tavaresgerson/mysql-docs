#### 7.9.1.6 Usando logs do servidor para encontrar as causas de erros no `mysqld`

Observe que, antes de iniciar o `mysqld` com o log de consulta geral habilitado, você deve verificar todas as suas tabelas com `myisamchk`. Consulte o Capítulo 7, *Administração do Servidor MySQL*.

Se o `mysqld` morrer ou ficar parado, você deve iniciar o `mysqld` com o log de consulta geral habilitado. Consulte a Seção 7.4.3, “O Log de Consulta Geral”. Quando o `mysqld` morrer novamente, você pode examinar o final do arquivo de log para a consulta que matou o `mysqld`.

Se você usar o arquivo de log de consulta geral padrão, o log é armazenado no diretório do banco de dados como `host_name.log`. Na maioria dos casos, é a última consulta no arquivo de log que matou o `mysqld`, mas, se possível, você deve verificar isso reiniciando o `mysqld` e executando a consulta encontrada a partir das ferramentas de linha de comando do `mysql`. Se isso funcionar, você também deve testar todas as consultas complicadas que não foram concluídas.

Você também pode tentar o comando `EXPLAIN` em todas as declarações `SELECT` que levam muito tempo para garantir que o `mysqld` esteja usando índices corretamente. Consulte a Seção 15.8.2, “Declaração EXPLAIN”.

Você pode encontrar as consultas que levam muito tempo para executar iniciando o `mysqld` com o log de consulta lenta habilitado. Consulte a Seção 7.4.5, “O Log de Consulta Lenta”.

Se você encontrar o texto `mysqld reiniciou` no log de erro (normalmente um arquivo chamado `host_name.err`), provavelmente encontrou uma consulta que faz com que o `mysqld` falhe. Se isso acontecer, você deve verificar todas as suas tabelas com `myisamchk` (consulte o Capítulo 7, *Administração do Servidor MySQL*), e testar as consultas nos arquivos de log do MySQL para ver se uma falha. Se você encontrar tal consulta, tente primeiro atualizar para a versão mais recente do MySQL. Se isso não ajudar, informe um bug, consulte a Seção 1.6, “Como relatar bugs ou problemas”.

Se você iniciou o `mysqld` com a variável de sistema `myisam_recover_options` definida, o MySQL verifica automaticamente e tenta reparar as tabelas `MyISAM` se elas estiverem marcadas como 'não fechadas corretamente' ou 'quebradas'. Se isso acontecer, o MySQL escreve uma entrada no arquivo `hostname.err` com a mensagem `'Aviso: Verificando tabela ...'` seguida de `Aviso: Reparando tabela` se a tabela precisar ser reparada. Se você receber muitos desses erros, sem que o `mysqld` tenha falhado inesperadamente pouco antes, então algo está errado e precisa ser investigado mais a fundo. Veja a Seção 7.1.7, “Opções de Comando do Servidor”.

Quando o servidor detecta a corrupção da tabela `MyISAM`, ele escreve informações adicionais no log de erro, como o nome e o número da linha do arquivo fonte e a lista de threads acessando a tabela. Exemplo: `Recebi um erro do thread_id=1, mi_dynrec.c:368`. Essas são informações úteis para incluir em relatórios de bugs.

Não é um bom sinal se o `mysqld` falhou inesperadamente, mas, neste caso, você não deve investigar as mensagens `Verificando tabela...`, mas sim tentar descobrir por que o `mysqld` falhou.