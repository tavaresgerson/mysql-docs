### 17.9.3 Declarações de manipulação de dados

Como não há servidores primários (fontes) para nenhum conjunto de dados específico, qualquer servidor do grupo pode executar transações a qualquer momento, mesmo transações que alteram o estado (transações RW).

Qualquer servidor pode executar uma transação sem qualquer *a priori* coordenação. Mas, no momento do commit, ele coordena com o resto dos servidores do grupo para tomar uma decisão sobre o destino dessa transação. Essa coordenação serve a dois propósitos: (i) verificar se a transação deve ser confirmada ou não; (ii) e propagar as alterações para que outros servidores também possam aplicar a transação.

Como uma transação é enviada por meio de uma transmissão atômica, todos os servidores do grupo recebem a transação ou nenhum deles. Se eles a receberem, todos receberão a transação na mesma ordem em relação a outras transações que foram enviadas anteriormente. A detecção de conflitos é realizada inspecionando e comparando os conjuntos de escrita das transações. Assim, eles são detectados no nível da linha. A resolução de conflitos segue a regra de quem fizer o primeiro commit ganhar. Se t1 e t2 são executados simultaneamente em locais diferentes, porque t2 é executado antes de t1, e ambos alteraram a mesma linha, então t2 vence o conflito e t1 é abortado. Em outras palavras, t1 estava tentando alterar dados que haviam sido tornados obsoletos por t2.

Nota

Se duas transações estiverem mais frequentemente em conflito, é uma boa prática iniciá-las no mesmo servidor. Elas terão então a chance de se sincronizar no gerenciador de bloqueio local, em vez de serem abortadas mais tarde no protocolo de replicação.
