## 17.9 Detalhes técnicos da replicação em grupo

Esta seção fornece mais detalhes técnicos sobre a Replicação de Grupo do MySQL.

### 17.9.1 Arquitetura do Plugin de Replicação em Grupo

O MySQL Group Replication é um plugin do MySQL e se baseia na infraestrutura de replicação existente do MySQL, aproveitando recursos como o log binário, o registro baseado em linhas e os identificadores de transação global. Ele se integra a frameworks MySQL atuais, como o esquema de desempenho ou infraestruturas de plugins e serviços. A figura a seguir apresenta um diagrama de bloco que ilustra a arquitetura geral do MySQL Group Replication.

**Figura 17.9 Diagrama de bloco do plugin de replicação de grupo**

![The text following the figure describes the content of the diagram.](images/gr-plugin-blocks.png)

O plugin de replicação em grupo do MySQL inclui um conjunto de APIs para captura, aplicação e ciclo de vida, que controlam como o plugin interage com o MySQL Server. Existem interfaces para fazer o fluxo de informações do servidor para o plugin e vice-versa. Essas interfaces isolam o núcleo do MySQL Server do plugin de replicação em grupo e são, na maioria, pontos de conexão colocados na linha de execução da transação. Numa direção, do servidor para o plugin, há notificações para eventos como o servidor iniciando, o servidor recuperando, o servidor estando pronto para aceitar conexões e o servidor prestes a comprometer uma transação. Na outra direção, o plugin instrui o servidor a realizar ações como comprometer ou abortar transações em andamento ou agrupar transações no log de retransmissão.

A próxima camada da arquitetura do plugin de replicação de grupo é um conjunto de componentes que reagem quando uma notificação é encaminhada para eles. O componente de captura é responsável por manter o controle do contexto relacionado às transações que estão sendo executadas. O componente aplicável é responsável por executar transações remotas no banco de dados. O componente de recuperação gerencia a recuperação distribuída e é responsável por obter um servidor que está se juntando ao grupo atualizado, selecionando o doador, orquestrando o procedimento de recuperação e reagindo a falhas do doador.

Continuando na pilha, o módulo do protocolo de replicação contém a lógica específica do protocolo de replicação. Ele lida com a detecção de conflitos e recebe e propaga transações para o grupo.

As duas últimas camadas da arquitetura do plugin de replicação de grupo são o Sistema de Comunicação de Grupo (GCS) API e uma implementação de um motor de comunicação de grupo baseado em Paxos (XCom). A API GCS é uma API de alto nível que abstrai as propriedades necessárias para construir uma máquina de estado replicada (ver Seção 17.1, “Contexto da Replicação de Grupo”). Portanto, ela desvincula a implementação da camada de mensagens das camadas superiores restantes do plugin. O motor de comunicação de grupo lida com comunicações com os membros do grupo de replicação.

### 17.9.2 O Grupo

No MySQL Group Replication, um conjunto de servidores forma um grupo de replicação. Um grupo tem um nome, que assume a forma de uma UUID. O grupo é dinâmico e os servidores podem sair (voluntariamente ou involuntariamente) e se juntar a ele a qualquer momento. O grupo se ajusta sempre que servidores se juntam ou saem.

Se um servidor se juntar ao grupo, ele se atualiza automaticamente, obtendo o estado ausente de um servidor existente. Esse estado é transferido por meio da replicação MySQL assíncrona. Se um servidor deixar o grupo, por exemplo, ele foi desativado para manutenção, os servidores restantes percebem que ele deixou e reconfiguram o grupo automaticamente. O serviço de associação de grupos descrito na Seção 17.1.3.1, “Associação de Grupos”, controla tudo isso.

### 17.9.3 Ensaios de Manipulação de Dados

Como não há servidores primários (fontes) para nenhum conjunto de dados específico, todos os servidores do grupo têm permissão para executar transações a qualquer momento, mesmo transações que alteram o estado (transações RW).

Qualquer servidor pode executar uma transação sem qualquer *a priori* coordenação. Mas, no momento do commit, ele coordena com o resto dos servidores do grupo para tomar uma decisão sobre o destino dessa transação. Essa coordenação serve a dois propósitos: (i) verificar se a transação deve ser confirmada ou não; (ii) e propagar as alterações para que outros servidores também possam aplicar a transação.

Como uma transação é enviada através de uma transmissão atômica, todos os servidores do grupo recebem a transação ou nenhum deles. Se eles a recebem, então todos recebem a transação na mesma ordem em relação a outras transações que foram enviadas anteriormente. A detecção de conflitos é realizada inspecionando e comparando os conjuntos de escrita das transações. Assim, elas são detectadas no nível da linha. A resolução de conflitos segue a regra de que o primeiro committer vence. Se t1 e t2 são executados concorrentemente em locais diferentes, porque t2 é ordenado antes de t1, e ambos alteraram a mesma linha, então t2 vence o conflito e t1 é abortado. Em outras palavras, t1 estava tentando alterar dados que haviam sido tornados obsoletos por t2.

Nota

Se duas transações costumam entrar em conflito com mais frequência, é uma boa prática iniciá-las no mesmo servidor. Elas têm a chance de se sincronizar no gerenciador de bloqueio local, em vez de abortar mais tarde no protocolo de replicação.

### 17.9.4 Declarações de definição de dados

Em uma topologia de replicação em grupo, é preciso ter cuidado ao executar declarações de definição de dados, também comumente conhecidas como linguagem de definição de dados (DDL). Como o MySQL não suporta DDL atômica ou transacional, não se pode executar otimisticamente declarações de DDL e, posteriormente, reverter se necessário. Consequentemente, a falta de atomicidade não se encaixa diretamente no paradigma de replicação otimista em que a Replicação em Grupo se baseia.

Portanto, é necessário ter mais cuidado ao replicar declarações de definição de dados. Alterações no esquema e alterações nos dados que o objeto contém precisam ser tratadas pelo mesmo servidor enquanto a operação de esquema ainda não tiver sido concluída e replicada em todos os lugares. Não fazer isso pode resultar em inconsistência de dados.

Nota

Se o grupo estiver configurado no modo de primário único, então isso não é um problema, porque todas as alterações são realizadas através do mesmo servidor, o primário.

Aviso

A execução de DDL do MySQL não é atômica ou transacional. O servidor executa e confirma sem garantir o acordo do grupo primeiro. Como tal, você deve encaminhar DDL e DML para o mesmo objeto através do mesmo servidor, enquanto o DDL está sendo executado e ainda não foi replicado em todos os lugares.

### 17.9.5 Recuperação Distribuída

Esta seção descreve o processo pelo qual um membro que se junta a um grupo recupera as transações restantes do grupo, chamado recuperação distribuída. A recuperação distribuída pode ser resumida como o processo pelo qual um servidor obtém transações ausentes do grupo, para que ele possa então se juntar ao grupo após ter processado o mesmo conjunto de transações que os outros membros do grupo.

#### 17.9.5.1 Básico de Recuperação Distribuída

Sempre que um membro se junta a um grupo de replicação, ele se conecta a um membro existente para realizar a transferência de estado. O servidor que se junta ao grupo transfere todas as transações que ocorreram no grupo antes de se juntar, que são fornecidas pelo membro existente (chamado de *doador*). Em seguida, o servidor que se junta ao grupo aplica as transações que ocorreram no grupo enquanto essa transferência de estado estava em andamento. Quando o servidor que se junta ao grupo alcança os servidores restantes no grupo, ele começa a participar normalmente no grupo. Esse processo é chamado de recuperação distribuída.

##### Fase 1

Na primeira fase, o servidor que se junta ao grupo seleciona um dos servidores online do grupo para ser o *doador* do estado que está faltando. O doador é responsável por fornecer ao servidor que se junta ao grupo todos os dados que está faltando até o momento em que se junta ao grupo. Isso é alcançado confiando em um canal de replicação assíncrona padrão, estabelecido entre o doador e o servidor que se junta ao grupo, veja a Seção 16.2.2, “Canais de Replicação”. Por meio desse canal de replicação, os logs binários do doador são replicados até o ponto em que a mudança de visão ocorreu quando o servidor que se junta ao grupo se tornou parte do grupo. O servidor que se junta ao grupo aplica os logs binários do doador à medida que os recebe.

Enquanto o log binário está sendo replicado, o servidor que está se juntando ao grupo também armazena em cache cada transação que é trocada dentro do grupo. Em outras palavras, ele está ouvindo transações que estão acontecendo depois que se juntou ao grupo e enquanto está aplicando o estado ausente do doador. Quando a primeira fase termina e o canal de replicação para o doador é fechado, o servidor que está se juntando ao grupo então começa a segunda fase: o acréscimo.

##### Fase 2

Nesta fase, o servidor que se junta ao grupo passa à execução das transações armazenadas. Quando o número de transações em fila para execução finalmente atinge zero, o membro é declarado online.

##### Resiliência

O procedimento de recuperação suporta falhas do doador enquanto o servidor que se junta ao grupo está obtendo logs binários dele. Nesses casos, sempre que um doador falha durante a fase 1, o servidor que se junta ao grupo passa para um novo doador e retoma a partir desse. Quando isso acontece, o servidor que se junta ao grupo fecha explicitamente a conexão com o servidor que falhou e abre uma conexão com um novo doador. Isso acontece automaticamente.

#### 17.9.5.2 Recuperação de um ponto no tempo

Para sincronizar o servidor que está se juntando ao grupo com o doador até um ponto específico no tempo, o servidor que está se juntando ao grupo e o doador utilizam o mecanismo de Identificadores Globais de Transação (GTIDs) do MySQL. Veja a Seção 16.1.3, “Replicação com Identificadores Globais de Transação”. No entanto, os GTIDs apenas fornecem um meio para perceber quais transações o servidor que está se juntando ao grupo está faltando, eles não ajudam a marcar um ponto específico no tempo para o qual o servidor que está se juntando ao grupo deve se atualizar, nem ajudam a transmitir informações de certificação. Este é o trabalho dos marcadores de visualização de registro binário, que marcam as mudanças de visualização no fluxo de registro binário e também contêm informações de metadados adicionais, fornecendo ao servidor que está se juntando ao grupo os dados relacionados à certificação que estão faltando.

Visualizar e Visualizar Alterações

Para explicar o conceito de marcadores de mudança de visão, é importante entender o que é uma visão e uma mudança de visão.

Um *visual* corresponde a um grupo de membros que participam ativamente na configuração atual, ou seja, em um ponto específico no tempo. Eles estão corretos e online no sistema.

Uma *mudança de visão* ocorre quando há uma modificação na configuração do grupo, como a adesão ou saída de um membro. Qualquer mudança na associação do grupo resulta em uma mudança de visão independente comunicada a todos os membros no mesmo ponto lógico de tempo.

Um *identificador de visualização* identifica de forma única uma visualização. Ele é gerado sempre que ocorre uma mudança na visualização

Na camada de comunicação de grupo, as alterações de visualização com seus respectivos IDs de visualização são, então, os limites entre os dados trocados antes e depois de um membro se juntar. Esse conceito é implementado por meio de um novo evento de registro binário: o "evento de registro de alteração de visualização". O ID de visualização, portanto, também se torna um marcador para as transações transmitidas antes e depois de ocorrerem alterações na adesão ao grupo.

O identificador de visualização em si é construído a partir de duas partes: *(i)* uma que é gerada aleatoriamente e *(ii)* um número inteiro monotinicamente crescente. A primeira parte é gerada quando o grupo é criado e permanece inalterada enquanto houver pelo menos um membro no grupo. A segunda parte é incrementada toda vez que ocorre uma mudança de visualização.

A razão para essa combinação heterogênea que compõe o id de visualização é a necessidade de marcar de forma inequívoca as mudanças de grupo sempre que um membro se junta ou sai, mas também sempre que todos os membros saem do grupo e não há informações sobre qual visualização o grupo estava. De fato, o uso exclusivo de identificadores incrementais e monótonos poderia levar à reutilização do mesmo id após o desligamento completo do grupo, destruindo a singularidade dos marcadores de dados de log binário de que a recuperação depende. Para resumir, a primeira parte identifica sempre que o grupo foi iniciado desde o início e a parte incremental quando o grupo mudou a partir desse ponto.

#### 17.9.5.3 Visualizar Alterações

Esta seção explica o processo que controla como o identificador de mudança de visualização é incorporado a um evento de registro binário e escrito no log. Os seguintes passos são tomados:

##### Início: Grupo estável

Todos os servidores estão online e processando transações recebidas do grupo. Alguns servidores podem estar um pouco atrasados em termos de transações replicadas, mas eventualmente convergem. O grupo atua como um banco de dados distribuído e replicado.

**Figura 17.10 Grupo estável**

![Servers S1, S2, and S3 are members of the group. The most recent item in all of their binary logs is transaction T20.](images/gr-recovery-1.png)

Visualizar Alteração: um Membro se junta

Sempre que um novo membro se junta ao grupo e, portanto, uma mudança de visão é realizada, cada servidor online coloca um evento de registro de mudança de visão para execução. Isso é colocado em fila porque, antes da mudança de visão, várias transações podem ser colocadas na fila no servidor para serem aplicadas e, como tal, pertencem à visão antiga. A colocação do evento de mudança de visão após elas garante uma marcação correta de quando isso aconteceu.

Enquanto isso, o servidor que se junta ao grupo seleciona o doador da lista de servidores online, conforme declarado pelo serviço de associação, através da abstração de visualização. Um membro se junta na visualização 4 e os membros online escrevem um evento de alteração de visualização no log binário.

**Figura 17.11 A Membro se Junta**

![Server S4 joins the group and looks for a donor. Servers S1, S2, and S3 each queue the view change entry VC4 for their binary logs. Meanwhile, server S1 is receiving new transaction T21.](images/gr-recovery-2.png)

##### Transmissão Estadual: Atingindo o Desempenho
(A tradução do texto em inglês para o português brasileiro foi feita automaticamente e pode ter algumas imperfeições)

Assim que o servidor que está se juntando ao grupo escolhe qual servidor no grupo será o doador, uma nova conexão de replicação assíncrona é estabelecida entre os dois e a transferência de estado começa (fase 1). Essa interação com o doador continua até que o servidor que está se juntando ao thread do aplicativo do grupo processe o evento do registro de alteração de visão que corresponde à alteração de visão que foi acionada quando o servidor que está se juntando ao grupo entrou no grupo. Em outras palavras, o servidor que está se juntando ao grupo replica do doador, até chegar ao marcador com o identificador de visão que corresponde ao marcador de visão em que ele já está.

**Figura 17.12 Transmissão do Estado: Acompanhamento**

![Server S4 has chosen server S2 as the donor. State transfer is executed from server S2 to server S4 until the view change entry VC4 is reached (view_id = VC4). Server S4 uses a temporary applier buffer for state transfer, and its binary log is currently empty.](images/gr-recovery-3.png)

Como os identificadores de visualização são transmitidos a todos os membros do grupo no mesmo momento lógico, o servidor que se junta ao grupo sabe em qual identificador de visualização deve parar de replicar. Isso evita cálculos complexos de conjunto GTID, pois o identificador de visualização marca claramente quais dados pertencem a cada visualização do grupo.

Enquanto o servidor que se junta ao grupo está replicando a partir do doador, ele também está cacheando transações recebidas do grupo. Eventualmente, ele para de replicar a partir do doador e passa a aplicar as que estão cacheadas.

**Figura 17.13 Transações em fila**

![State transfer is complete. Server S4 has applied the transactions up to T20 and written them to its binary log. Server S4 has cached transaction T21, which arrived after the view change, in a temporary applier buffer while recovering.](images/gr-recovery-4.png)

##### Finalizado: Achado de Pela Máquina

Quando o servidor que está se juntando ao grupo reconhece um evento de registro de alterações de visão com o identificador de visão esperado, a conexão com o doador é terminada e ele começa a aplicar as transações armazenadas. Um ponto importante a entender é o procedimento de recuperação final. Embora atue como um marcador no log binário, delimitando as alterações de visão, o evento de registro de alterações de visão também desempenha outro papel. Ele transmite as informações de certificação percebidas por todos os servidores quando o servidor que está se juntando ao grupo entra no grupo, em outras palavras, a última alteração de visão. Sem ele, o servidor que está se juntando ao grupo não teria as informações necessárias para ser capaz de certificar (detectar conflitos) as transações subsequentes.

A duração do acréscimo (fase 2) não é determinada, pois depende da carga de trabalho e da taxa de transações recebidas pelo grupo. Esse processo é completamente online e o servidor que se junta ao grupo não bloqueia nenhum outro servidor do grupo enquanto está realizando o acréscimo. Portanto, o número de transações que o servidor que se junta ao grupo está atrasado ao passar para a fase 2 pode, por essa razão, variar e, assim, aumentar ou diminuir de acordo com a carga de trabalho.

Quando o servidor que se junta ao grupo atinge zero transações em fila e seus dados armazenados são iguais aos dos outros membros, seu estado público muda para online.

**Figura 17.14 Instância Online**

![Server S4 is now an online member of the group. It has applied cached transaction T21, so its binary log shows the same items as the binary logs of the other group members, and it no longer needs the temporary applier buffer. New incoming transaction T22 is now received and applied by all group members.](images/gr-recovery-5.png)

#### 17.9.5.4 Recomendações de uso e limitações da recuperação distribuída

A recuperação distribuída tem algumas limitações. Ela é baseada na replicação clássica assíncrona e, como tal, pode ser lenta se o servidor que está participando do grupo não estiver configurado ou estiver configurado com uma imagem de backup muito antiga. Isso significa que, se os dados a serem transferidos forem muito grandes na fase 1, o servidor pode levar muito tempo para se recuperar. Assim, a recomendação é que, antes de adicionar um servidor ao grupo, ele deve ser configurado com um instantâneo bastante recente de um servidor já no grupo. Isso minimiza o comprimento da fase 1 e reduz o impacto no servidor doador, uma vez que ele precisa salvar e transferir menos logs binários.

Aviso

Recomenda-se que um servidor seja provisionado antes de ser adicionado a um grupo. Dessa forma, o tempo gasto na etapa de recuperação é minimizado.

### 17.9.6 Observabilidade

Há uma grande quantidade de automação embutida no plugin de Replicação de Grupo. No entanto, às vezes você pode precisar entender o que está acontecendo nos bastidores. É aí que a instrumentação da Replicação de Grupo e do Schema de Desempenho se torna importante. Todo o estado do sistema (incluindo a visão, estatísticas de conflitos e estados dos serviços) pode ser consultado através das tabelas do performance\_schema. A natureza distribuída do protocolo de replicação e o fato de que as instâncias do servidor concordam e, portanto, sincronizam em transações e metadados tornam mais simples inspecionar o estado do grupo. Por exemplo, você pode se conectar a um único servidor no grupo e obter informações locais e globais ao emitir declarações select nas tabelas relacionadas ao Schema de Desempenho de Replicação do Grupo. Para mais informações, consulte a Seção 17.4, “Monitoramento da Replicação de Grupo”.

### 17.9.7 Desempenho da Replicação em Grupo

Esta seção explica como usar as opções de configuração disponíveis para obter o melhor desempenho do seu grupo.

#### 17.9.7.1 Ajustando o fio de comunicação do grupo

O fio de comunicação de grupo (GCT) funciona em um loop enquanto o plugin de replicação de grupo está carregado. O GCT recebe mensagens do grupo e do plugin, lida com tarefas relacionadas ao quórum e detecção de falhas, envia algumas mensagens de manutenção em atividade e também lida com as transações de entrada e saída de/para o servidor/grupo. O GCT aguarda mensagens de entrada em uma fila. Quando não há mensagens, o GCT aguarda. Configurar essa espera para ser um pouco mais longa (fazendo uma espera ativa) antes de realmente dormir pode ser benéfico em alguns casos. Isso ocorre porque a alternativa é o sistema operacional trocar o GCT do processador e fazer uma troca de contexto.

Para forçar o GCT a realizar uma espera ativa, use a opção `group_replication_poll_spin_loops`, que faz o loop do GCT, sem realizar nada relevante para o número configurado de loops, antes de realmente coletar a fila para a próxima mensagem.

Por exemplo:

```sql
mysql> SET GLOBAL group_replication_poll_spin_loops= 10000;
```

#### 17.9.7.2 Compressão de Mensagens

Para mensagens enviadas entre membros do grupo online, a Replicação de Grupo permite a compressão de mensagens por padrão. Se uma mensagem específica é comprimida depende do limite que você configura usando a variável de sistema `group_replication_compression_threshold`. Mensagens que têm um payload maior que o número especificado de bytes são comprimidas.

O limite de compressão padrão é de 1.000.000 de bytes. Você pode usar as seguintes declarações para aumentar o limite de compressão para 2 MB, por exemplo:

```sql
STOP GROUP_REPLICATION;
SET GLOBAL group_replication_compression_threshold = 2097152;
START GROUP_REPLICATION;
```

Se você definir `group_replication_compression_threshold` como zero, a compressão de mensagens será desativada.

A Replicação em Grupo usa o algoritmo de compressão LZ4 para comprimir as mensagens enviadas no grupo. Observe que o tamanho máximo de entrada suportado pelo algoritmo de compressão LZ4 é de 2113929216 bytes. Esse limite é menor que o valor máximo possível para a variável de sistema `group_replication_compression_threshold`, que é compatível com o tamanho máximo de mensagem aceito pelo XCom. O tamanho máximo de entrada do LZ4 é, portanto, um limite prático para a compressão de mensagens, e as transações acima desse tamanho não podem ser comprometidas quando a compressão de mensagens está habilitada. Com o algoritmo de compressão LZ4, não defina um valor maior que 2113929216 bytes para `group_replication_compression_threshold`.

O valor de `group_replication_compression_threshold` não é necessário que seja o mesmo em todos os membros do grupo. No entanto, é aconselhável definir o mesmo valor em todos os membros do grupo para evitar o descarte desnecessário de transações, falha na entrega de mensagens ou falha na recuperação de mensagens.

A compressão das mensagens enviadas no grupo ocorre no nível do motor de comunicação do grupo, antes de os dados serem entregues ao fio de comunicação do grupo, portanto, ocorre no contexto do fio de sessão do usuário `mysql`. Se o tamanho do payload da mensagem exceder o limite definido por `group_replication_compression_threshold`, o payload da transação é comprimido antes de ser enviado para o grupo e descomprimido quando é recebido. Ao receber uma mensagem, o membro verifica o envelope da mensagem para verificar se ela está comprimida ou não. Se necessário, o membro descomprime a transação, antes de entregá-la à camada superior. Esse processo é mostrado na figura a seguir.

**Figura 17.15 Suporte à compressão**

![The MySQL Group Replication plugin architecture is shown as described in an earlier topic, with the five layers of the plugin positioned between the MySQL server and the replication group. Compression and decompression are handled by the Group Communication System API, which is the fourth layer of the Group Replication plugin. The group communication engine (the fifth layer of the plugin) and the group members use the compressed transactions with the smaller data size. The MySQL Server core and the three higher layers of the Group Replication plugin (the APIs, the capture, applier, and recovery components, and the replication protocol module) use the original transactions with the larger data size.](images/gr-compress-decompress.png)

Quando a largura de banda da rede é um gargalo, a compressão de mensagens pode proporcionar até 30-40% de melhoria no desempenho no nível de comunicação de grupo. Isso é especialmente importante no contexto de grandes grupos de servidores sob carga. A natureza peer-to-peer das interconexões entre os *N* participantes do grupo faz com que o remetente envie a mesma quantidade de dados *N* vezes. Além disso, os logs binários provavelmente apresentarão uma alta taxa de compressão. Isso torna a compressão uma característica atraente para cargas de trabalho de Replicação de Grupo que contêm grandes transações.

#### 17.9.7.3 Controle de fluxo

A Replicação em Grupo garante que uma transação só seja confirmada após a maioria dos membros de um grupo a terem recebido e concordado com a ordem relativa entre todas as transações que foram enviadas simultaneamente.

Essa abordagem funciona bem se o número total de escritas no grupo não exceder a capacidade de escrita de qualquer membro do grupo. Se isso acontecer e alguns dos membros tiverem menos throughput de escrita do que outros, especialmente menos do que os membros que escrevem, esses membros podem começar a ficar para trás dos escritores.

Ter alguns membros atrasados em relação ao grupo traz algumas consequências problemáticas, especialmente, as leituras desses membros podem externalizar dados muito antigos. Dependendo do motivo pelo qual o membro está atrasado, outros membros do grupo podem ter que salvar mais ou menos contexto de replicação para poder atender a potenciais solicitações de transferência de dados do membro lento.

Há, no entanto, um mecanismo no protocolo de replicação para evitar que haja uma distância excessiva, em termos de transações aplicadas, entre membros rápidos e lentos. Isso é conhecido como mecanismo de controle de fluxo. Ele tenta atender a vários objetivos:

1. manter os membros próximos o suficiente para tornar o bufferamento e a des-sincronização entre os membros um problema pequeno;

2. se adaptar rapidamente a condições em mudança, como diferentes cargas de trabalho ou mais escritores no grupo;

3. dar a cada membro uma parte justa da capacidade de escrita disponível;

4. não reduzir o desempenho mais do que o estritamente necessário para evitar o desperdício de recursos.

Dada a concepção do Grupo de Replicação, a decisão de aplicar ou não o controle pode ser tomada considerando duas filas de trabalho: *(i)* a fila de *certificação*; *(ii)* e a fila de *aplicador* do log binário. Sempre que o tamanho de uma dessas filas exceder o limite definido pelo usuário, o mecanismo de controle é acionado. Configure apenas: *(i)* se o controle de fluxo deve ser feito no nível do certificador ou no nível do aplicador, ou em ambos; e *(ii)* qual é o limite para cada fila.

O controle do fluxo depende de dois mecanismos básicos:

1. o monitoramento dos membros para coletar algumas estatísticas sobre o desempenho e o tamanho da fila de todos os membros do grupo, para fazer suposições informadas sobre qual é a pressão máxima de escrita que cada membro deve ser submetido;

2. o controle dos membros que tentam escrever além de sua parte justa da capacidade disponível em cada momento.

##### 17.9.7.3.1 Sondas e Estatísticas

O mecanismo de monitoramento funciona com cada membro implantando um conjunto de sondas para coletar informações sobre suas filas de trabalho e desempenho. Em seguida, propaga essas informações periodicamente para o grupo para compartilhar esses dados com os outros membros.

Tais sensores estão espalhados por toda a pilha do plugin e permitem estabelecer métricas, como:

* o tamanho da fila de certificação; * o tamanho da fila de aplicação de replicação; * o número total de transações certificadas; * o número total de transações remotas aplicadas no membro;

* o número total de transações locais.

Assim que um membro recebe uma mensagem com estatísticas de outro membro, ele calcula métricas adicionais sobre quantas transações foram certificadas, aplicadas e executadas localmente no último período de monitoramento.

Os dados de monitoramento são compartilhados com outros membros do grupo periodicamente. O período de monitoramento deve ser suficientemente longo para permitir que os outros membros decidam sobre as solicitações de escrita atuais, mas suficientemente curto para que tenha um impacto mínimo na largura de banda do grupo. As informações são compartilhadas a cada segundo, e esse período é suficiente para atender a ambas as preocupações.

##### 17.9.7.3.2 Limitação da replicação em grupo

Com base nas métricas coletadas em todos os servidores do grupo, um mecanismo de controle é ativado e decide se deve limitar a taxa na qual um membro pode executar/comprometer novas transações.

Portanto, as métricas adquiridas de todos os membros são a base para calcular a capacidade de cada membro: se um membro tiver uma fila grande (para certificação ou para o fio de aplicação), então a capacidade para executar novas transações deve estar próxima àquelas certificadas ou aplicadas no último período.

A menor capacidade de todos os membros do grupo determina a capacidade real do grupo, enquanto o número de transações locais determina quantos membros estão escrevendo nela e, consequentemente, quantos membros essa capacidade disponível deve ser compartilhada.

Isso significa que cada membro tem uma quota de escrita estabelecida com base na capacidade disponível, ou seja, um número de transações que pode emitir com segurança para o próximo período. A quota de escritor é aplicada pelo mecanismo de controle se o tamanho da fila do certificador ou do aplicativo de registro binário exceder um limite definido pelo usuário.

A quota é reduzida pelo número de transações que foram atrasadas no último período, e depois ainda reduzida em 10% para permitir que a fila que desencadeou o problema reduza seu tamanho. Para evitar grandes saltos no desempenho assim que o tamanho da fila ultrapassar o limite, o desempenho só é permitido crescer em 10% por período após esse.

O mecanismo atual de controle não penaliza as transações abaixo da quota, mas retarda o término das transações que a excedem até o final do período de monitoramento. Como consequência, se a quota for muito pequena para as solicitações de escrita emitidas, algumas transações podem ter latências próximas ao período de monitoramento.