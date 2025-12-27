### 7.1.19 O processo de desligamento do servidor

O processo de desligamento do servidor ocorre da seguinte forma:

1. O processo de desligamento é iniciado.

   Isso pode ocorrer de várias maneiras. Por exemplo, um usuário com o privilégio `SHUTDOWN` pode executar o comando `mysqladmin shutdown`. O `mysqladmin` pode ser usado em qualquer plataforma suportada pelo MySQL. Outros métodos de iniciação de desligamento específicos para o sistema operacional também são possíveis: o servidor desliga-se no Unix quando recebe um sinal `SIGTERM`. Um servidor que está rodando como serviço no Windows desliga-se quando o gerenciador de serviços o instrui.
2. O servidor cria um fio de desligamento, se necessário.

   Dependendo de como o desligamento foi iniciado, o servidor pode criar um fio para lidar com o processo de desligamento. Se o desligamento foi solicitado por um cliente, um fio de desligamento é criado. Se o desligamento for o resultado da recepção de um sinal `SIGTERM`, o fio de sinal pode lidar com o desligamento por si só ou pode criar um fio separado para fazer isso. Se o servidor tentar criar um fio de desligamento e não conseguir (por exemplo, se a memória estiver esgotada), ele emite uma mensagem de diagnóstico que aparece no log de erro:

   ```
   Error: Can't create thread to kill server
   ```
3. O servidor para de aceitar novas conexões.

   Para impedir que novas atividades sejam iniciadas durante o desligamento, o servidor para de aceitar novas conexões de clientes, fechando os manipuladores das interfaces de rede para as quais ele normalmente escuta conexões: a porta TCP/IP, o arquivo de socket Unix, o tubo nomeado do Windows e a memória compartilhada no Windows.
4. O servidor termina a atividade atual.

Para cada fio associado a uma conexão com o cliente, o servidor interrompe a conexão com o cliente e marca o fio como morto. Os fios morrem quando percebem que foram marcados como mortos. Os fios de conexões ociosas morrem rapidamente. Os fios que estão processando instruções verificam periodicamente seu estado e demoram mais para morrer. Para obter informações adicionais sobre a finalização de fios, consulte a Seção 15.7.8.4, “Instrução KILL”, em particular para as instruções sobre operações `REPAIR TABLE` ou `OPTIMIZE TABLE` terminadas com sucesso em tabelas `MyISAM`.

   Para fios que têm uma transação aberta, a transação é revertida. Se um fio está atualizando uma tabela não transacional, uma operação como uma atualização múltipla de linha `UPDATE` ou `INSERT` pode deixar a tabela parcialmente atualizada porque a operação pode terminar antes de ser concluída.

   Se o servidor for um servidor de origem de replicação, ele trata os fios associados às réplicas atualmente conectadas como outros fios de cliente. Ou seja, cada um deles é marcado como morto e sai quando verifica seu estado novamente.

   Se o servidor for um servidor de réplica, ele para os fios de I/O de replicação e SQL, se estiverem ativos, antes de marcar os fios de cliente como mortos. O fio de SQL é permitido terminar sua declaração atual (para evitar causar problemas de replicação) e depois para. Se o fio de SQL estiver no meio de uma transação neste ponto, o servidor espera até que o grupo de eventos de replicação atual (se houver) tenha terminado de ser executado, ou até que o usuário emita uma instrução `KILL QUERY` ou `KILL CONNECTION`. Veja também a Seção 15.4.2.5, “Instrução STOP REPLICA”. Como as instruções não transacionais não podem ser revertidas, para garantir uma replicação segura em caso de falha, apenas tabelas transacionais devem ser usadas.

   ::: info Nota

   Para garantir a segurança em caso de falha na replica, você deve executar a replica com `--relay-log-recovery` habilitado.

   :::

   Veja também a Seção 19.2.4, “Repositórios de Log de Relay e Metadados de Replicação”).

Nesta fase, o servidor esvazia o cache da tabela e fecha todas as tabelas abertas.

Cada mecanismo de armazenamento executa as ações necessárias para as tabelas que ele gerencia. O `InnoDB` esvazia seu pool de buffers no disco (a menos que `innodb_fast_shutdown` seja 2), escreve o LSN atual no espaço de tabelas e termina seus próprios threads internos. O `MyISAM` esvazia quaisquer escritas de índices pendentes para uma tabela.

6. O servidor sai.

Para fornecer informações aos processos de gerenciamento, o servidor retorna um dos códigos de saída descritos na lista a seguir. A frase entre parênteses indica a ação realizada pelo systemd em resposta ao código, para plataformas em que o systemd é usado para gerenciar o servidor.

* 0 = término bem-sucedido (nenhum reinício feito)
* 1 = término não bem-sucedido (nenhum reinício feito)
* 2 = término não bem-sucedido (reinício feito)