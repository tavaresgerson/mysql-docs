## 7.1 O Servidor MySQL

7.1.1 Configurando o servidor

7.1.2 Configurações Padrão do Servidor

7.1.3 Validação da Configuração do Servidor

7.1.4 Referência à Opção do Servidor, à Variável do Sistema e à Variável de Status

7.1.5 Referência de variável do sistema do servidor

7.1.6 Referência da variável de status do servidor

7.1.7 Opções de comando do servidor

7.1.8 Variáveis do Sistema de Servidor

7.1.9 Uso de variáveis do sistema

7.1.10 Variáveis de Status do Servidor

7.1.11 Modos do SQL do servidor

7.1.12 Gerenciamento de Conexão

7.1.13 Suporte ao IPv6

7.1.14 Suporte ao Namespace de Rede

7.1.15 Suporte de Fuso Horário do MySQL Server

7.1.16 Grupos de recursos

7.1.17 Suporte de Ajuda no Servidor

7.1.18 Rastreamento do servidor do estado da sessão do cliente

7.1.19 O processo de desligamento do servidor

**mysqld** é o servidor MySQL. A discussão a seguir aborda esses tópicos de configuração do servidor MySQL:

- Opções de inicialização que o servidor suporta. Você pode especificar essas opções na linha de comando, por meio de arquivos de configuração ou por meio de ambas.

- Variáveis do sistema do servidor. Essas variáveis refletem o estado atual e os valores das opções de inicialização, algumas das quais podem ser modificadas enquanto o servidor estiver em execução.

- Variáveis de status do servidor. Essas variáveis contêm contadores e estatísticas sobre a operação em execução.

- Como definir o modo SQL do servidor. Esta configuração modifica certos aspectos da sintaxe e semântica do SQL, por exemplo, para compatibilidade com código de outros sistemas de banco de dados ou para controlar o tratamento de erros em situações específicas.

- Como o servidor gerencia as conexões dos clientes.

- Configurando e usando suporte para IPv6 e namespace de rede.

- Configurar e usar o suporte de fuso horário.

- Usando grupos de recursos.

- Capacidades de ajuda no lado do servidor.

- Capacidades fornecidas para permitir alterações no estado da sessão do cliente.

- O processo de desligamento do servidor. Existem considerações de desempenho e confiabilidade, dependendo do tipo de tabela (transacional ou não transacional) e se você usa replicação.

Para ver as listagens das variáveis e opções do servidor MySQL que foram adicionadas, descontinuadas ou removidas no MySQL 8.0, consulte a Seção 1.4, “Variáveis e opções do servidor e de status adicionadas, descontinuadas ou removidas no MySQL 8.0”.

Nota

Nem todos os motores de armazenamento são suportados por todos os binários e configurações do servidor MySQL. Para descobrir como determinar quais motores de armazenamento sua instalação do MySQL suporta, consulte a Seção 15.7.7.16, “Instrução SHOW ENGINES”.
