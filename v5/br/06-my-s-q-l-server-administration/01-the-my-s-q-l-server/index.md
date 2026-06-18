## 5.1 O Servidor MySQL

5.1.1 Configurando o servidor

5.1.2 Configurações Padrão de Configuração do Servidor

Referência da opção do servidor, variável do sistema e variável de status

5.1.4 Referência de variável do sistema do servidor

5.1.5 Referência da variável de status do servidor

5.1.6 Opções de comando do servidor

5.1.7 Variáveis do Sistema do Servidor

5.1.8 Usando variáveis do sistema

5.1.9 Variáveis de Status do Servidor

5.1.10 Modos do servidor SQL

5.1.11 Gerenciamento de Conexão

5.1.12 Suporte ao IPv6

Suporte de Fuso Horário do MySQL Server

Suporte de Ajuda no Servidor

5.1.15 Rastreamento do servidor do estado da sessão do cliente

5.1.16 O processo de desligamento do servidor

**mysqld** é o servidor MySQL. A discussão a seguir aborda esses tópicos de configuração do servidor MySQL:

- Opções de inicialização que o servidor suporta. Você pode especificar essas opções na linha de comando, por meio de arquivos de configuração ou por meio de ambas.

- Variáveis do sistema do servidor. Essas variáveis refletem o estado atual e os valores das opções de inicialização, algumas das quais podem ser modificadas enquanto o servidor estiver em execução.

- Variáveis de status do servidor. Essas variáveis contêm contadores e estatísticas sobre a operação em execução.

- Como definir o modo SQL do servidor. Esta configuração modifica certos aspectos da sintaxe e semântica do SQL, por exemplo, para compatibilidade com código de outros sistemas de banco de dados ou para controlar o tratamento de erros em situações específicas.

- Como o servidor gerencia as conexões dos clientes.

- Configurando e usando o suporte ao IPv6.

- Configurar e usar o suporte de fuso horário.

- Capacidades de ajuda no lado do servidor.

- O processo de desligamento do servidor. Existem considerações de desempenho e confiabilidade, dependendo do tipo de tabela (transacional ou não transacional) e se você usa replicação.

Para ver as listagens das variáveis e opções do servidor MySQL que foram adicionadas, descontinuadas ou removidas no MySQL 5.7, consulte Seção 1.4, “Variáveis e opções do servidor e de status adicionadas, descontinuadas ou removidas no MySQL 5.7”.

Nota

Nem todos os motores de armazenamento são suportados por todos os binários e configurações do servidor MySQL. Para descobrir como determinar quais motores de armazenamento sua instalação do MySQL suporta, consulte Seção 13.7.5.16, “Instrução SHOW ENGINES”.
