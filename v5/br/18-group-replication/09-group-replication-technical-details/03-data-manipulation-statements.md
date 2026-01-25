### 17.9.3 Instruções de Manipulação de Dados

Como não há servers primários (sources) para nenhum conjunto de dados (data set) específico, todo server no grupo tem permissão para executar transactions a qualquer momento, mesmo transactions que alteram o estado (RW transactions).

Qualquer server pode executar uma transaction sem nenhuma coordenação *a priori*. Mas, no momento do commit, ele coordena com o restante dos servers no grupo para chegar a uma decisão sobre o destino dessa transaction. Essa coordenação serve a dois propósitos: (i) verificar se a transaction deve fazer commit ou não; (ii) e propagar as mudanças para que outros servers também possam aplicar a transaction.

Como uma transaction é enviada através de um broadcast atômico, ou todos os servers no grupo recebem a transaction, ou nenhum a recebe. Se eles a recebem, então todos a recebem na mesma ordem em relação a outras transactions que foram enviadas anteriormente. A detecção de conflitos (Conflict detection) é realizada inspecionando e comparando os *write sets* (conjuntos de escrita) das transactions. Assim, eles são detectados no nível da linha (row level). A resolução de conflitos segue a regra do "primeiro a fazer commit vence" (*first committer wins*). Se t1 e t2 executam concorrentemente em sites diferentes, e t2 é ordenada antes de t1, e ambas alteraram a mesma linha (row), então t2 vence o conflito e t1 aborta. Em outras palavras, t1 estava tentando alterar dados que haviam sido invalidados (*stale*) por t2.

Nota

Se duas transactions estão fadadas a conflitar na maioria das vezes, é uma boa prática iniciá-las no mesmo server. Elas terão, então, a chance de sincronizar no gerenciador de lock (lock manager) local, em vez de abortar mais tarde no protocolo de Replication.