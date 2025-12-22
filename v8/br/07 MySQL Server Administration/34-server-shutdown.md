### 7.1.19 Processo de desligamento do servidor

O processo de desligamento do servidor ocorre da seguinte forma:

1. O processo de desligamento foi iniciado.

   Isso pode ser iniciado de várias maneiras. Por exemplo, um usuário com o privilégio `SHUTDOWN` pode executar um comando **mysqladmin shutdown**. `mysqladmin` pode ser usado em qualquer plataforma suportada pelo MySQL. Outros métodos de iniciação de desligamento específicos do sistema operacional também são possíveis: O servidor desliga no Unix quando recebe um sinal `SIGTERM`. Um servidor executado como um serviço no Windows desliga quando o gerente de serviços o diz.
2. O servidor cria um thread de desligamento, se necessário.

   Dependendo de como o desligamento foi iniciado, o servidor pode criar um thread para lidar com o processo de desligamento. Se o desligamento foi solicitado por um cliente, um thread de desligamento é criado. Se o desligamento é o resultado de receber um sinal `SIGTERM`, o thread de sinal pode lidar com o desligamento em si, ou pode criar um thread separado para fazê-lo. Se o servidor tentar criar um thread de desligamento e não puder (por exemplo, se a memória estiver esgotada), ele emite uma mensagem de diagnóstico que aparece no registro de erros:

   ```
   Error: Can't create thread to kill server
   ```
3. O servidor pára de aceitar novas conexões.

   Para evitar que novas atividades sejam iniciadas durante o desligamento, o servidor para de aceitar novas conexões de clientes, fechando os manipuladores para as interfaces de rede para as quais normalmente escuta conexões: a porta TCP / IP, o arquivo de soquete Unix, o tubo nomeado do Windows e a memória compartilhada no Windows.
4. O servidor encerra a atividade atual.

   Para cada thread associado a uma conexão de cliente, o servidor interrompe a conexão com o cliente e marca o thread como morto. Os threads morrem quando percebem que estão marcados assim. Os threads para conexões ociosas morrem rapidamente. Os threads que atualmente estão processando instruções verificam seu estado periodicamente e levam mais tempo para morrer. Para informações adicionais sobre o término do thread, consulte a Seção 15.7.8.4, KILL Statement, em particular para as instruções sobre as operações `REPAIR TABLE` ou `OPTIMIZE TABLE` mortas nas tabelas `MyISAM`.

   Se um thread estiver atualizando uma tabela não transacional, uma operação como uma `UPDATE` de várias linhas ou `INSERT` pode deixar a tabela parcialmente atualizada porque a operação pode terminar antes de ser concluída.

   Se o servidor é um servidor de origem de replicação, ele trata threads associados a réplicas atualmente conectadas como outros threads do cliente.

   Se o servidor é um servidor de réplica, ele interrompe os tópicos de replicação I/O e SQL, se estiverem ativos, antes de marcar os tópicos do cliente como mortos. O tópico SQL tem permissão para terminar sua instrução atual (para evitar problemas de replicação), e então para. Se o tópico SQL estiver no meio de uma transação neste ponto, o servidor espera até que o grupo de eventos de replicação atual (se houver) tenha terminado de executar, ou até que o usuário emita uma instrução `KILL QUERY` ou `KILL CONNECTION`.

   ::: info Note

   Para garantir a segurança de colisão na réplica, você deve executar a réplica com o `--relay-log-recovery` habilitado.

   :::

   "Capacitor de transmissão de dados"
5. O servidor desliga ou fecha os motores de armazenamento.

   Nesta fase, o servidor limpa o cache da tabela e fecha todas as tabelas abertas.

   Cada mecanismo de armazenamento executa todas as ações necessárias para as tabelas que gerencia. `InnoDB` envia seu pool de buffer para o disco (a menos que `innodb_fast_shutdown` seja 2), escreve o LSN atual para o espaço de tabelas e termina seus próprios threads internos. `MyISAM` envia qualquer índice pendente escreve para uma tabela.
6. O servidor sai.

Para fornecer informações aos processos de gerenciamento, o servidor retorna um dos códigos de saída descritos na lista a seguir.

- 0 = término bem sucedido (não foi reiniciado)
- 1 = término não bem sucedido (não foi reiniciado)
- 2 = término sem sucesso (reinicialização feita)
