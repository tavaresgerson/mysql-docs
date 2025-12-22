## 7.1 O servidor MySQL

`mysqld` é o servidor MySQL. A discussão a seguir abrange esses tópicos de configuração do servidor MySQL:

- Opções de inicialização suportadas pelo servidor. Pode especificar estas opções na linha de comando, através de ficheiros de configuração ou ambos.
- Variaveis do sistema do servidor. Estas variáveis refletem o estado atual e os valores das opções de inicialização, algumas das quais podem ser modificadas enquanto o servidor está em execução.
- As variáveis de estado do servidor contêm contadores e estatísticas sobre a operação em tempo de execução.
- Como definir o modo SQL do servidor. Esta configuração modifica certos aspectos da sintaxe e semântica SQL, por exemplo, para compatibilidade com código de outros sistemas de banco de dados ou para controlar o tratamento de erros para situações específicas.
- Como o servidor gerencia as conexões do cliente.
- Configuração e utilização do suporte ao IPv6 e ao espaço de nomes de rede.
- Configuração e utilização do suporte de fusos horários.
- Usando grupos de recursos.
- Capacidades de ajuda do lado do servidor.
- Capacidades fornecidas para permitir alterações de estado de sessão do cliente.
- O processo de desligamento do servidor. Existem considerações de desempenho e confiabilidade dependendo do tipo de tabela (transacional ou não transacional) e se você usa replicação.

Para listas de variáveis e opções do servidor MySQL que foram adicionadas, depreciadas ou removidas no MySQL 8.4, consulte \[Seção 1.5, Variáveis e opções de status e servidor adicionados, depreciados ou removidos no MySQL 8.4 desde 8.0] (added-deprecated-removed.html).

::: info Note

Nem todos os motores de armazenamento são suportados por todos os binários e configurações do servidor MySQL. Para saber como determinar quais motores de armazenamento são suportados pela instalação do seu servidor MySQL, consulte a Seção 15.7.7.17, SHOW ENGINES Statement.

:::
