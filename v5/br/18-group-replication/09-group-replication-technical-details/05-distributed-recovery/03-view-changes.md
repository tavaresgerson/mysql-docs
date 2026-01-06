#### 17.9.5.3 Ver alterações

Esta seção explica o processo que controla como o identificador de mudança de visualização é incorporado em um evento de log binário e escrito no log. As seguintes etapas são realizadas:

##### Comece: Grupo estável

Todos os servidores estão online e processando as transações recebidas do grupo. Alguns servidores podem estar um pouco atrasados em termos de transações replicadas, mas eventualmente eles convergem. O grupo atua como um banco de dados distribuído e replicado.

**Figura 17.10 Grupo estável**

![Os servidores S1, S2 e S3 são membros do grupo. O item mais recente em todos os seus logs binários é a transação T20.](images/gr-recovery-1.png)

##### Visualizar Alteração: um Membro se junta

Sempre que um novo membro se junta ao grupo e, portanto, uma alteração de visualização é realizada, cada servidor online enfileira um evento de registro de alteração de visualização para execução. Isso é enfileirado porque, antes da alteração de visualização, várias transações podem ser enfileiradas no servidor para serem aplicadas e, como tal, pertencem à visualização antiga. Enfileirar o evento de alteração de visualização depois deles garante uma marcação correta de quando isso aconteceu.

Enquanto isso, o servidor que se junta ao grupo seleciona o doador da lista de servidores online, conforme declarado pelo serviço de associação através da abstração de visualização. Um membro se junta na visualização 4 e os membros online escrevem um evento de alteração de visualização no log binário.

**Figura 17.11 Amembro se junta**

![O servidor S4 se junta ao grupo e procura um doador. Os servidores S1, S2 e S3 enfileiram a entrada de alteração de visualização VC4 para seus logs binários. Enquanto isso, o servidor S1 está recebendo a nova transação T21.](images/gr-recovery-2.png)

##### Transferência de Estado: Atingindo o Desempenho

Assim que o servidor que está se juntando ao grupo escolhe qual servidor no grupo será o doador, uma nova conexão de replicação assíncrona é estabelecida entre os dois e a transferência de estado começa (fase 1). Essa interação com o doador continua até que o servidor que está se juntando ao thread do aplicável do grupo processe o evento de registro de alteração de visualização que corresponde à alteração de visualização acionada quando o servidor que está se juntando ao grupo entrou no grupo. Em outras palavras, o servidor que está se juntando ao grupo replica do doador até chegar ao marcador com o identificador da visualização que corresponde ao marcador da visualização em que ele já está.

**Figura 17.12 Transferência de Estado: Atingindo o Tempo**

![O servidor S4 escolheu o servidor S2 como doador. A transferência de estado é executada do servidor S2 para o servidor S4 até que a entrada de alteração de visualização VC4 seja alcançada (view\_id = VC4). O servidor S4 usa um buffer temporário de aplicação para a transferência de estado, e seu log binário está atualmente vazio.](images/gr-recovery-3.png)

Como os identificadores de visualização são transmitidos a todos os membros do grupo no mesmo momento lógico, o servidor que se junta ao grupo sabe em qual identificador de visualização deve parar de replicar. Isso evita cálculos complexos de conjuntos de GTID, pois o ID de visualização marca claramente quais dados pertencem a cada visualização do grupo.

Enquanto o servidor que está se juntando ao grupo está replicando do doador, ele também está armazenando transações recebidas do grupo. Eventualmente, ele para de replicar do doador e passa a aplicar as que estão armazenadas.

**Figura 17.13 Transações em fila**

![A transferência de estado está concluída. O servidor S4 aplicou as transações até o T20 e as escreveu em seu log binário. O servidor S4 armazenou a transação T21, que chegou após a alteração da visualização, em um buffer temporário de aplicador enquanto se recupera.](images/gr-recovery-4.png)

##### Finalizado: Pego no meio

Quando o servidor que está se juntando ao grupo reconhece um evento de registro de alterações de visualização com o identificador de visualização esperado, a conexão com o doador é encerrada e ele começa a aplicar as transações armazenadas. Um ponto importante a ser entendido é o procedimento de recuperação final. Embora atue como um marcador no log binário, delimitando as alterações de visualização, o evento de registro de alterações de visualização também desempenha outro papel. Ele transmite as informações de certificação percebidas por todos os servidores quando o servidor que está se juntando ao grupo entrou no grupo, ou seja, a última alteração de visualização. Sem ele, o servidor que está se juntando ao grupo não teria as informações necessárias para poder certificar (detectar conflitos) as transações subsequentes.

A duração do processo de recuperação (fase 2) não é determinística, pois depende da carga de trabalho e da taxa de transações recebidas pelo grupo. Esse processo é totalmente online e o servidor que se junta ao grupo não bloqueia nenhum outro servidor do grupo enquanto está realizando a recuperação. Portanto, o número de transações que o servidor que se junta ao grupo está atrasado ao passar para a fase 2 pode, por isso, variar e, assim, aumentar ou diminuir de acordo com a carga de trabalho.

Quando o servidor que está se juntando ao grupo atingir zero transações em fila e seus dados armazenados forem iguais aos dos outros membros, seu estado público será alterado para online.

**Figura 17.14 Instância Online**

![O servidor S4 agora é um membro online do grupo. Ele aplicou a transação em cache T21, então seu log binário mostra os mesmos itens que os logs binários dos outros membros do grupo, e ele não precisa mais do buffer temporário do aplicador. A nova transação entrante T22 agora é recebida e aplicada por todos os membros do grupo.](images/gr-recovery-5.png)
