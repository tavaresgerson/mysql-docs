### 5.1.16 Processo de Desligamento do Servidor

O processo de desligamento do servidor ocorre da seguinte forma:

1. O processo de desligamento está sendo iniciado.

   Isso pode ocorrer de várias maneiras. Por exemplo, um usuário com o privilégio `SHUTDOWN` pode executar o comando **mysqladmin shutdown**. **mysqladmin** pode ser usado em qualquer plataforma suportada pelo MySQL. Outros métodos de iniciação de desligamento específicos para o sistema operacional também são possíveis: o servidor é desligado no Unix quando recebe um sinal `SIGTERM`. Um servidor que está rodando como um serviço no Windows é desligado quando o gerenciador de serviços o indica.

2. O servidor cria um fio de desligamento, se necessário.

   Dependendo de como o desligamento foi iniciado, o servidor pode criar um fio para lidar com o processo de desligamento. Se o desligamento foi solicitado por um cliente, um fio de desligamento é criado. Se o desligamento for o resultado da recepção de um sinal `SIGTERM`, o fio de sinal pode lidar com o desligamento por si só ou pode criar um fio separado para fazer isso. Se o servidor tentar criar um fio de desligamento e não conseguir (por exemplo, se a memória estiver esgotada), ele emite uma mensagem de diagnóstico que aparece no log de erro:

   ```sql
   Error: Can't create thread to kill server
   ```

3. O servidor para de aceitar novas conexões.

   Para impedir que uma nova atividade seja iniciada durante o desligamento, o servidor para de aceitar novas conexões de clientes fechando os manipuladores das interfaces de rede para as quais ele normalmente escuta as conexões: a porta TCP/IP, o arquivo de soquete Unix, o tubo nomeado do Windows e a memória compartilhada no Windows.

4. O servidor termina a atividade atual.

   Para cada fio associado a uma conexão com o cliente, o servidor interrompe a conexão com o cliente e marca o fio como morto. Os fios morrem quando percebem que foram marcados como tal. Os fios de conexões ociosas morrem rapidamente. Os fios que estão processando instruções verificam periodicamente seu estado e demoram mais para morrer. Para obter informações adicionais sobre a terminação de fios, consulte Seção 13.7.6.4, “Instrução KILL”, em particular para as instruções sobre as operações `REPAIR TABLE` (`REPAIR TABLE`) ou `OPTIMIZE TABLE` (`OPTIMIZE TABLE`) em tabelas `MyISAM`.

   Para os threads que têm uma transação aberta, a transação é revertida. Se um thread estiver atualizando uma tabela não transacional, uma operação como uma atualização múltipla de várias linhas (`UPDATE` ou `INSERT`) pode deixar a tabela parcialmente atualizada, pois a operação pode ser encerrada antes de ser concluída.

   Se o servidor for um servidor de replicação de origem, ele trata os threads associados às réplicas atualmente conectadas como outros threads de cliente. Ou seja, cada um deles é marcado como morto e sai quando verifica seu estado na próxima vez.

   Se o servidor for uma replica, ele interrompe os threads de I/O e SQL, se estiverem ativos, antes de marcar os threads do cliente como mortos. O thread SQL é permitido terminar sua declaração atual (para evitar causar problemas de replicação) e, em seguida, é interrompido. Se o thread SQL estiver em meio a uma transação neste ponto, o servidor aguarda até que o grupo de eventos de replicação atual (se houver) tenha terminado de executar ou até que o usuário emita uma declaração `KILL QUERY` ou `KILL CONNECTION`. Veja também Seção 13.4.2.6, “Declaração STOP SLAVE”. Como declarações não transacionais não podem ser revertidas, para garantir uma replicação segura em caso de falha, apenas tabelas transacionais devem ser usadas.

   Nota

   Para garantir a segurança em caso de falha na replica, você deve executar a replica com o `--relay-log-recovery` habilitado.

   Veja também Seção 16.2.4, "Repositórios de Log de Relé e Metadados de Replicação").

5. O servidor desliga ou fecha os motores de armazenamento.

   Nesta etapa, o servidor descarrega o cache da tabela e fecha todas as tabelas abertas.

   Cada mecanismo de armazenamento executa as ações necessárias para as tabelas que ele gerencia. O `InnoDB` esvazia seu pool de buffers no disco (a menos que `innodb_fast_shutdown` (innodb-parameters.html#sysvar_innodb_fast_shutdown) seja 2), escreve o LSN atual no espaço de tabelas e termina seus próprios threads internos. O `MyISAM` esvazia quaisquer escritas de índices pendentes para uma tabela.

6. O servidor sai.

Para fornecer informações aos processos de gerenciamento, o servidor retorna um dos códigos de saída descritos na lista a seguir. A frase entre parênteses indica a ação realizada pelo systemd em resposta ao código, para plataformas em que o systemd é usado para gerenciar o servidor.

- 0 = término bem-sucedido (nenhum reinício feito)
- 1 = término não bem-sucedido (nenhum reinício feito)
- 2 = término não bem-sucedido (reinício feito)
