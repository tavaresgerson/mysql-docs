#### 17.9.5.3 Alterações de View

Esta seção explica o processo que controla como o identificador de alteração de View (view change identifier) é incorporado em um evento de binary log e escrito no log. As seguintes etapas são seguidas:

##### Início: Grupo Estável

Todos os Servers estão online e processando transações recebidas do grupo. Alguns Servers podem estar ligeiramente atrasados em termos de transações replicadas, mas eventualmente eles convergem. O grupo atua como um Database distribuído e replicado.

**Figura 17.10 Grupo Estável**

Os Servers S1, S2 e S3 são membros do grupo. O item mais recente em todos os seus binary logs é a transação T20.

##### Alteração de View: Um Membro Entra

Sempre que um novo membro se junta ao grupo e, portanto, uma alteração de View (view change) é realizada, cada Server online enfileira um evento de log de alteração de View para execução. Isso é enfileirado porque, antes da alteração de View, várias transações podem estar enfileiradas no Server para serem aplicadas e, como tal, pertencem à View antiga. Enfileirar o evento de alteração de View após elas garante uma marcação correta de quando isso ocorreu.

Enquanto isso, o Server que está entrando no grupo seleciona o *donor* (doador) da lista de Servers online, conforme estabelecido pelo serviço de *membership* através da abstração de View. Um membro entra na View 4 e os membros online escrevem um evento de View change no binary log.

**Figura 17.11 Um Membro Entra**

O Server S4 se junta ao grupo e procura por um *donor*. Os Servers S1, S2 e S3 enfileiram o registro de alteração de View VC4 em seus binary logs. Enquanto isso, o Server S1 está recebendo a nova transação T21.

##### State Transfer: Alcançando o Estado Atual

Assim que o Server que está entrando no grupo escolhe qual Server do grupo será o *donor*, uma nova conexão de replicação assíncrona é estabelecida entre os dois e o *state transfer* começa (fase 1). Esta interação com o *donor* continua até que o *applier thread* do Server que está entrando no grupo processe o evento de log de alteração de View que corresponde à alteração de View acionada quando o Server que está entrando no grupo se juntou ao grupo. Em outras palavras, o Server que está entrando no grupo replica do *donor* até atingir o marcador com o identificador de View que corresponde ao marcador de View em que ele já se encontra.

**Figura 17.12 State Transfer: Alcançando o Estado Atual**

O Server S4 escolheu o Server S2 como o *donor*. O *state transfer* é executado do Server S2 para o Server S4 até que o registro de alteração de View VC4 seja alcançado (view_id = VC4). O Server S4 usa um *applier buffer* temporário para o *state transfer*, e seu binary log está atualmente vazio.

Como os identificadores de View são transmitidos a todos os membros do grupo no mesmo tempo lógico, o Server que está entrando no grupo sabe em qual identificador de View deve parar de replicar. Isso evita cálculos complexos de GTID set, pois o view id marca claramente quais dados pertencem a cada View do grupo.

Enquanto o Server que está entrando no grupo está replicando a partir do *donor*, ele também está fazendo *caching* das transações recebidas do grupo. Eventualmente, ele para de replicar do *donor* e começa a aplicar aquelas que estão em *cache*.

**Figura 17.13 Transações Enfileiradas**

O *state transfer* está completo. O Server S4 aplicou as transações até T20 e as escreveu em seu binary log. O Server S4 armazenou em *cache* a transação T21, que chegou após a alteração de View, em um *applier buffer* temporário durante a recuperação.

##### Fim: Estado Alcançado

Quando o Server que está entrando no grupo reconhece um evento de log de alteração de View com o identificador de View esperado, a conexão com o *donor* é encerrada e ele começa a aplicar as transações em *cache*. Um ponto importante a entender é o procedimento final de recuperação. Embora atue como um marcador no binary log, delimitando as alterações de View, o evento de log de alteração de View também desempenha outro papel. Ele transmite as informações de certificação percebidas por todos os Servers quando o Server que está entrando no grupo ingressou no grupo, ou seja, a última alteração de View. Sem ele, o Server que está entrando no grupo não teria as informações necessárias para poder certificar (detectar conflitos) transações subsequentes.

A duração da sincronização (*catch up*, fase 2) não é determinística, pois depende da *workload* (carga de trabalho) e da taxa de transações de entrada para o grupo. Este processo é totalmente online e o Server que está entrando no grupo não bloqueia nenhum outro Server no grupo enquanto está alcançando o estado atual. Portanto, o número de transações em que o Server que está entrando no grupo está atrasado ao passar para a fase 2 pode, por este motivo, variar e, assim, aumentar ou diminuir de acordo com a *workload*.

Quando o Server que está entrando no grupo atinge zero transações enfileiradas e seus dados armazenados são iguais aos dos outros membros, seu estado público muda para *online*.

**Figura 17.14 Instância Online**

O Server S4 agora é um membro online do grupo. Ele aplicou a transação T21 em *cache*, de modo que seu binary log mostra os mesmos itens que os binary logs dos outros membros do grupo, e ele não precisa mais do *applier buffer* temporário. A nova transação T22 recebida agora é recebida e aplicada por todos os membros do grupo.