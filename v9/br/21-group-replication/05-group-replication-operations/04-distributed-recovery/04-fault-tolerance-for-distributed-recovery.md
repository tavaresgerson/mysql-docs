#### 20.5.4.4 Tolerância a Falhas para Recuperação Distribuída

O processo de recuperação distribuída da Replicação por Grupo tem várias medidas integradas para garantir a tolerância a falhas em caso de problemas durante o processo.

O doador para a recuperação distribuída é selecionado aleatoriamente da lista existente de membros do grupo online adequados na visualização atual. Selecionar um doador aleatório significa que há uma boa chance de que o mesmo servidor não seja selecionado mais de uma vez quando vários membros entram no grupo. Para a transferência de estado do log binário, o membro que se junta seleciona um doador que está executando uma versão de correção menor ou igual ao MySQL Server em comparação com ele mesmo. Para versões anteriores, todos os membros online podem ser doadores. Para uma operação de clonagem remota, o membro que se junta seleciona um doador que está executando a mesma versão de correção que ele mesmo. Quando o membro que está se juntando é reiniciado no final da operação, ele estabelece uma conexão com um novo doador para a transferência de estado do log binário, que pode ser um membro diferente do doador original usado para a operação de clonagem remota.

Nas seguintes situações, a Replicação por Grupo detecta um erro na recuperação distribuída, troca automaticamente para um novo doador e tenta novamente a transferência de estado:

* *Erro de conexão* - Há um problema de autenticação ou outro problema para fazer a conexão com um doador candidato.

* *Erros de replicação* - Um dos threads de replicação (os threads de recebimento ou aplicação) usados para a transferência de estado do log binário falha. Como esse método de transferência de estado usa a estrutura de replicação MySQL existente, é possível que alguns erros transitórios possam causar erros nos threads de recebimento ou aplicação.

* Erros na operação de clonagem remota* - A operação de clonagem remota falha ou é interrompida antes de ser concluída.

* O doador sai do grupo* - O doador sai do grupo ou a Replicação em Grupo é interrompida no doador, enquanto a transferência de estado está em andamento.

A tabela do Schema de Desempenho `replication_applier_status_by_worker` exibe o erro que causou a última tentativa. Nessas situações, a nova conexão após o erro é tentada com um novo doador candidato. Selecionar um doador diferente em caso de erro significa que há a chance de o novo doador candidato não ter o mesmo erro. Se o plugin de clonagem estiver instalado, a Replicação em Grupo tenta uma operação de clonagem remota com cada um dos doadores online adequados que suportam clonagem primeiro. Se todas essas tentativas falharem, a Replicação em Grupo tenta a transferência de estado do log binário com todos os doadores adequados, se possível.

Aviso

Para uma operação de clonagem remota, os espaços de tabelas e os dados criados pelo usuário no destinatário (o membro que está se juntando) são eliminados antes que a operação de clonagem remota comece para transferir os dados do doador. Se a operação de clonagem remota começar, mas não for concluída, o membro que está se juntando pode ficar com um conjunto parcial de seus arquivos de dados originais ou sem dados do usuário. Os dados transferidos pelo doador são removidos do destinatário se a operação de clonagem for interrompida antes que os dados sejam totalmente clonados. Essa situação pode ser corrigida tentando novamente a operação de clonagem, o que a Replicação em Grupo faz automaticamente.

Nas seguintes situações, o processo de recuperação distribuída não pode ser concluído, e o membro que está se juntando sai do grupo:

* *Transações excluídas* - As transações que são necessárias para o membro que está se juntando não estão presentes nos arquivos de log binário de nenhum membro do grupo online, e os dados não podem ser obtidos por uma operação de clonagem remota (porque o plugin de clonagem não está instalado ou porque a clonagem foi tentada com todos os possíveis doadores, mas falhou). O membro que está se juntando, portanto, não consegue se atualizar com o grupo.

* *Transações extras* - O membro que está se juntando já contém algumas transações que não estão presentes no grupo. Se uma operação de clonagem remota foi realizada, essas transações seriam excluídas e perdidas, porque o diretório de dados no membro que está se juntando é apagado. Se a transferência de estado de um log binário de um doador foi realizada, essas transações poderiam entrar em conflito com as transações do grupo. Para obter conselhos sobre como lidar com essa situação, consulte Transações Extras.

* *Limite de tentativas de conexão atingido* - O membro que está se juntando fez todas as tentativas de conexão permitidas pelo limite de tentativas de recuperação de conexão. Você pode configurar isso usando a variável de sistema `group_replication_recovery_retry_count` (veja Seção 20.5.4.3, “Configurando a Recuperação Distribuída”).

* *Mais doadores não disponíveis* - O membro que está se juntando tentou sem sucesso uma operação de clonagem remota com cada um dos doadores que suportam clonagem online, uma após a outra (se o plugin de clonagem estiver instalado), e então tentou sem sucesso a transferência de estado do log binário com cada um dos doadores online adequados, se possível.

* *O membro que está se juntando deixa o grupo* - O membro que está se juntando deixa o grupo ou a Replicação do Grupo é interrompida no membro que está se juntando enquanto a transferência de estado está em andamento.

Se o membro que se juntou deixou o grupo acidentalmente, então, em qualquer situação listada acima, exceto na última, ele prossegue para executar a ação especificada pela variável de sistema `group_replication_exit_state_action`.