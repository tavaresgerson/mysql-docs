## 7.1 O Servidor MySQL

`mysqld` é o servidor MySQL. A discussão a seguir aborda os seguintes tópicos de configuração do servidor MySQL:

* Opções de inicialização que o servidor suporta. Você pode especificar essas opções na linha de comando, por meio de arquivos de configuração ou ambos.
* Variáveis de sistema do servidor. Essas variáveis refletem o estado atual e os valores das opções de inicialização, algumas das quais podem ser modificadas enquanto o servidor estiver em execução.
* Variáveis de status do servidor. Essas variáveis contêm contadores e estatísticas sobre a operação em tempo de execução.
* Como definir o modo SQL do servidor. Essa configuração modifica certos aspectos da sintaxe e semântica do SQL, por exemplo, para compatibilidade com código de outros sistemas de banco de dados, ou para controlar o tratamento de erros para situações particulares.
* Como o servidor gerencia conexões de clientes.
* Configuração e uso do suporte ao namespace de rede e IPv6.
* Configuração e uso do suporte ao fuso horário.
* Uso de grupos de recursos.
* Capacidades do servidor de ajuda.
* Capacidades fornecidas para permitir mudanças no estado das sessões do cliente.
* O processo de desligamento do servidor. Existem considerações de desempenho e confiabilidade dependendo do tipo de tabela (transacional ou não transacional) e se você usa replicação.

::: info Nota

Nem todos os motores de armazenamento são suportados por todos os binários e configurações do servidor MySQL. Para descobrir como determinar quais motores de armazenamento sua instalação do MySQL suporta, consulte a Seção 15.7.7.17, “`SHOW ENGINES` Statement”.