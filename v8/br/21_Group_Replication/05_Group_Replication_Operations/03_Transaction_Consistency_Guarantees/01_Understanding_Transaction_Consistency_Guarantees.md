#### 20.5.3.1 Entendendo as Garantias de Consistência de Transações

Em termos de garantias de consistência distribuída, tanto em operações de reparo normais quanto em operações de reparo em caso de falha, a Replicação em Grupo sempre foi um sistema de consistência eventual. Isso significa que, assim que o tráfego de entrada desacelera ou para, todos os membros do grupo têm o mesmo conteúdo de dados. Os eventos que se relacionam à consistência de um sistema podem ser divididos em operações de controle, sejam elas manuais ou acionadas automaticamente por falhas; e operações de fluxo de dados.

Para a Replicação em Grupo, as operações de controle que podem ser avaliadas em termos de consistência são:

- Um membro que se junta ou sai, o que está coberto pela Seção 20.5.4, “Recuperação Distribuída” e proteção de escrita, do Grupo de Replicação.

- falhas na rede, que são cobertas pelos modos de proteção.

- nos grupos de primário único, o failover primário, que também pode ser uma operação acionada pelo `group_replication_set_as_primary()`.

##### Garantias de Consistência e Failover Primário

Em um grupo de primário único, no caso de uma falha no primário, quando um secundário é promovido ao primário, o novo primário pode ser disponibilizado imediatamente para o tráfego de aplicativos, independentemente de quão grande seja o atraso de replicação, ou, como alternativa, o acesso pode ser restringido até que o atraso seja aplicado.

Com a primeira abordagem, o grupo leva o tempo mínimo possível para garantir a estabilidade da associação do grupo após uma falha primária, elege um novo primário e, em seguida, permite o acesso aos dados imediatamente, enquanto ainda está aplicando qualquer atraso possível do antigo primário. A consistência de escrita é garantida, mas as leituras podem recuperar temporariamente dados desatualizados enquanto o novo primário aplica o atraso. Por exemplo, se o cliente C1 escreveu `A=2 WHERE A=1` no antigo primário logo antes de sua falha, quando o cliente C1 se reconectar ao novo primário, ele poderia potencialmente ler `A=1` até que o novo primário aplique seu atraso e alcance o estado do antigo primário antes de ele sair do grupo.

Com a segunda alternativa, o sistema garante a permanência de um grupo estável após a falha primária e elege um novo primário da mesma forma que na primeira alternativa, mas, neste caso, o grupo aguarda até que o novo primário aplique todo o atraso e, só então, permite o acesso aos dados. Isso garante que, em uma situação como a descrita anteriormente, quando o cliente C1 é reconectado ao novo primário, ele lê `A=2`. No entanto, o desvantagem é que o tempo necessário para a falha de migração é então proporcional ao tamanho do atraso, que, em um grupo corretamente configurado, deve ser pequeno.

Antes do MySQL 8.0.14, não havia como definir a política de falha; por padrão, a disponibilidade era maximizada, conforme descrito na primeira abordagem. Em um grupo com membros executando o MySQL 8.0.14 ou superior, você pode determinar o nível de garantias de consistência de transações fornecidas pelos membros durante o falha primária usando a variável `group_replication_consistency`. Veja o Impacto da Consistência na Eleição Primária.

##### Operações de fluxo de dados

O fluxo de dados é relevante para as garantias de consistência do grupo devido às leituras e escritas executadas contra um grupo, especialmente quando essas operações são distribuídas entre todos os membros. As operações de fluxo de dados se aplicam a ambos os modos de Replicação de Grupo: único-primário e multi-primário, no entanto, para tornar essa explicação mais clara, ela é restrita ao modo único-primário. A maneira usual de dividir as transações de leitura ou escrita recebidas entre os membros de um grupo único-primário é encaminhar as escritas para o primário e distribuir as leituras de forma uniforme entre os secundários. Como o grupo deve se comportar como uma única entidade, é razoável esperar que as escritas no primário estejam instantaneamente disponíveis nos secundários. Embora a Replicação de Grupo seja escrita usando protocolos do Sistema de Comunicação de Grupo (GCS) que implementam o algoritmo Paxos, algumas partes da Replicação de Grupo são assíncronas, o que implica que os dados são aplicados de forma assíncrona aos secundários. Isso significa que um cliente C2 pode escrever `B=2 WHERE B=1` no primário, se conectar imediatamente a um secundário e ler `B=1`. Isso ocorre porque o secundário ainda está aplicando backlog e não aplicou a transação que foi aplicada pelo primário.

##### Pontos de sincronização de transações

Você configura a garantia de consistência de um grupo com base no ponto em que deseja sincronizar as transações em todo o grupo. Para ajudá-lo a entender o conceito, esta seção simplifica os pontos de sincronização das transações em todo o grupo para o momento de uma operação de leitura ou para o momento de uma operação de escrita. Se os dados forem sincronizados no momento de uma leitura, a sessão atual do cliente aguarda até um determinado ponto, que é o momento em que todas as transações de atualização anteriores foram aplicadas, antes de poder começar a executar. Com essa abordagem, apenas essa sessão é afetada, todas as outras operações de dados concorrentes não são afetadas.

Se os dados forem sincronizados no momento da escrita, a sessão de escrita aguarda até que todos os secundários tenham escrito seus dados. A replicação em grupo usa uma ordem total para as escritas, e, portanto, isso implica em esperar que essa e todas as escritas anteriores que estão nas filas dos secundários sejam aplicadas. Portanto, ao usar esse ponto de sincronização, a sessão de escrita aguarda que todas as filas dos secundários sejam aplicadas.

Qualquer alternativa garante que, na situação descrita para o cliente C2, sempre leia `B=2` mesmo se estiver imediatamente conectado a um secundário. Cada alternativa tem suas vantagens e desvantagens, que estão diretamente relacionadas à carga de trabalho do seu sistema. Os exemplos seguintes descrevem diferentes tipos de cargas de trabalho e aconselham qual ponto de sincronização é apropriado.

Imagine as seguintes situações:

- Se você deseja equilibrar a carga de leituras sem implementar restrições adicionais sobre qual servidor você deve ler para evitar ler dados desatualizados, os grupos de escritas são muito menos comuns do que os grupos de leituras.

- Para um grupo que tem dados predominantemente de leitura apenas, você deseja que as transações de leitura/escrita sejam aplicadas em todos os lugares uma vez que sejam confirmadas, para que as leituras subsequentes sejam feitas em dados atualizados que incluam a última escrita. Isso garante que você não pague o custo de sincronização para cada transação de leitura apenas, mas apenas para transações de leitura/escrita.

Nesses casos, você deve optar por sincronizar em gravações.

Imagine as seguintes situações:

- Você deseja equilibrar a carga de leituras sem implementar restrições adicionais sobre qual servidor você lê para evitar ler dados desatualizados. Grupos de escritas são muito mais comuns do que grupos de leituras.

- Você deseja que transações específicas em sua carga de trabalho sempre leiam dados atualizados do grupo, por exemplo, sempre que dados sensíveis forem atualizados (como credenciais para um arquivo ou dados semelhantes) e que você defina que as leituras obtenham o valor mais atualizado.

Nesses casos, você deve optar por sincronizar em leituras.
