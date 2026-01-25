#### 17.9.5.1 Conceitos Básicos de Recuperação Distribuída

Sempre que um *member* se junta a um *replication group*, ele se conecta a um *member* existente para realizar a *state transfer* (transferência de estado). O *Server* que está se juntando ao *Group* transfere todas as *transactions* que ocorreram no *Group* antes de ele se juntar, que são fornecidas pelo *member* existente (chamado de *donor*). Em seguida, o *Server* que está se juntando ao *Group* aplica as *transactions* que ocorreram no *Group* enquanto essa *state transfer* estava em andamento. Quando o *Server* que está se juntando ao *Group* alcança os *Servers* restantes no *Group*, ele começa a participar normalmente no *Group*. Este processo é chamado de *distributed recovery*.

##### Fase 1

Na primeira fase, o *Server* que está se juntando ao *Group* seleciona um dos *Servers online* no *Group* para ser o *donor* do *state* que está faltando. O *donor* é responsável por fornecer ao *Server* que está se juntando ao *Group* todos os dados que estão faltando até o momento em que ele se juntou ao *Group*. Isso é alcançado confiando em um *replication channel* assíncrono padrão, estabelecido entre o *donor* e o *Server* que está se juntando ao *Group*, consulte [Section 16.2.2, “Replication Channels”](replication-channels.html "16.2.2 Replication Channels"). Através deste *replication channel*, os *binary logs* do *donor* são replicados até o ponto em que ocorreu o *view change* quando o *Server* que está se juntando ao *Group* se tornou parte do *Group*. O *Server* que está se juntando ao *Group* aplica os *binary logs* do *donor* à medida que os recebe.

Enquanto o *binary log* está sendo replicado, o *Server* que está se juntando ao *Group* também armazena em *cache* toda *transaction* que é trocada dentro do *Group*. Em outras palavras, ele está escutando por *transactions* que estão ocorrendo após ele ter se juntado ao *Group* e enquanto está aplicando o *state* ausente do *donor*. Quando a primeira fase termina e o *replication channel* para o *donor* é fechado, o *Server* que está se juntando ao *Group* então inicia a fase dois: o *catch up* (alcance).

##### Fase 2

Nesta fase, o *Server* que está se juntando ao *Group* prossegue para a execução das *transactions* armazenadas em *cache*. Quando o número de *transactions* enfileiradas para execução finalmente chega a zero, o *member* é declarado *online*.

##### Resiliência

O procedimento de *recovery* suporta falhas do *donor* enquanto o *Server* que está se juntando ao *Group* está buscando *binary logs* dele. Nesses casos, sempre que um *donor* falha durante a Fase 1, o *Server* que está se juntando ao *Group* realiza um *failover* para um novo *donor* e retoma a partir dele. Quando isso acontece, o *Server* que está se juntando ao *Group* fecha explicitamente a conexão com o *Server* que falhou e abre uma conexão para um novo *donor*. Isso acontece automaticamente.