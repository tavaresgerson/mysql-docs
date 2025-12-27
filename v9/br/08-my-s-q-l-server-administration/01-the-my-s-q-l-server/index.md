## 7.1 O Servidor MySQL

7.1.1 Configurando o Servidor

7.1.2 Definições Padrão de Configuração do Servidor

7.1.3 Validação da Configuração do Servidor

7.1.4 Referência de Opções do Servidor, Variáveis de Sistema e Variáveis de Status

7.1.5 Referência de Variáveis de Sistema do Servidor

7.1.6 Referência de Variáveis de Status do Servidor

7.1.7 Opções de Comando do Servidor

7.1.8 Variáveis de Sistema do Servidor

7.1.9 Usando Variáveis de Sistema

7.1.10 Variáveis de Status do Servidor

7.1.11 Modos SQL do Servidor

7.1.12 Gerenciamento de Conexão

7.1.13 Suporte ao IPv6

7.1.14 Suporte ao Namespace de Rede

7.1.15 Suporte ao Fuso Horário do Servidor MySQL

7.1.16 Grupos de Recursos

7.1.17 Suporte ao Rastreamento de Sessões do Cliente pelo Servidor

7.1.18 Processo de Fechamento do Servidor

**mysqld** é o servidor MySQL. A discussão a seguir aborda esses tópicos de configuração do servidor MySQL:

* Opções de inicialização que o servidor suporta. Você pode especificar essas opções na linha de comando, por meio de arquivos de configuração ou ambos.

* Variáveis de sistema do servidor. Essas variáveis refletem o estado atual e os valores das opções de inicialização, algumas das quais podem ser modificadas enquanto o servidor estiver em execução.

* Variáveis de status do servidor. Essas variáveis contêm contadores e estatísticas sobre a operação em tempo de execução.

* Como definir o modo SQL do servidor. Essa configuração modifica certos aspectos da sintaxe e semântica do SQL, por exemplo, para compatibilidade com código de outros sistemas de banco de dados ou para controlar o tratamento de erros para situações particulares.

* Como o servidor gerencia as conexões dos clientes.
* Configuração e uso do suporte ao IPv6 e ao espaço de rede.
* Configuração e uso do suporte às zonas horárias.
* Uso de grupos de recursos.
* Capacidades de ajuda no lado do servidor.
* Capacidades fornecidas para permitir alterações no estado das sessões do cliente.
* O processo de desligamento do servidor. Existem considerações de desempenho e confiabilidade dependendo do tipo de tabela (transacional ou não transacional) e se você usa replicação.

Para ver as listagens das variáveis e opções do servidor MySQL que foram adicionadas, descontinuadas ou removidas no MySQL 9.5, consulte a Seção 1.5, “Variáveis e opções de servidor e status adicionadas, descontinuadas ou removidas no MySQL 9.5”.

Observação

Nem todos os motores de armazenamento são suportados por todos os binários e configurações do servidor MySQL. Para descobrir como determinar quais motores de armazenamento sua instalação do MySQL suporta, consulte a Seção 15.7.7.18, “Instrução SHOW ENGINES”.