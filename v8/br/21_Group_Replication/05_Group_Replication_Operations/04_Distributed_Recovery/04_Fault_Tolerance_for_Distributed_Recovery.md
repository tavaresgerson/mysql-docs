#### 20.5.4.4 Tolerância a Falhas para Recuperação Distribuída

O processo de recuperação distribuída do Grupo de Replicação possui várias medidas integradas para garantir a tolerância a falhas em caso de qualquer problema durante o processo.

O doador para a recuperação distribuída é selecionado aleatoriamente da lista existente de membros do grupo online adequados na visualização atual. Selecionar um doador aleatório significa que há uma boa chance de que o mesmo servidor não seja selecionado mais de uma vez quando vários membros entram no grupo. No MySQL 8.0.17 e versões posteriores, para a transferência de estado do log binário, o adere é selecionado apenas um doador que esteja executando uma versão de patch menor ou igual ao MySQL Server em comparação com ele mesmo. Para versões anteriores, todos os membros online podem ser doadores. Para uma operação de clonagem remota, o adere seleciona um doador que esteja executando a mesma versão de patch que ele mesmo. Quando o membro que está se juntando é reiniciado no final da operação, ele estabelece uma conexão com um novo doador para a transferência de estado do log binário, que pode ser um membro diferente do doador original usado para a operação de clonagem remota.

Nas situações a seguir, a Replicação em Grupo detecta um erro na recuperação distribuída, troca automaticamente para um novo doador e tenta novamente a transferência de estado:

- *Erro de conexão* - Há um problema de autenticação ou outro problema com a conexão com um doador candidato.

- *Erros de replicação* - Um dos threads de replicação (os threads de receptor ou aplicador) está sendo usado para a transferência de estado do log binário e falha. Como esse método de transferência de estado usa o framework de replicação MySQL existente, é possível que alguns erros transitórios possam causar erros nos threads de receptor ou aplicador.

- *Erros na operação de clonagem remota* - A operação de clonagem remota falha ou é interrompida antes de ser concluída.

- *Doador sai do grupo* - O doador sai do grupo, ou a replicação do grupo é interrompida no doador, enquanto a transferência de estado está em andamento.

A tabela do Schema de Desempenho `replication_applier_status_by_worker` exibe o erro que causou a última tentativa. Nessas situações, a nova conexão após o erro é realizada com um novo doador candidato. Selecionar um doador diferente em caso de erro significa que há a chance de o novo doador candidato não ter o mesmo erro. Se o plugin de clone estiver instalado, a Replicação em Grupo tenta uma operação de clonagem remota com cada um dos doadores online compatíveis com clonagem primeiro. Se todas essas tentativas falharem, a Replicação em Grupo tenta a transferência de estado do log binário com todos os doadores compatíveis em cada vez, se isso for possível.

Aviso

Para uma operação de clonagem remota, os espaços de tabelas e os dados criados pelo usuário no destinatário (o membro que faz a junção) são eliminados antes que a operação de clonagem remota comece para transferir os dados do doador. Se a operação de clonagem remota começar, mas não for concluída, o membro que faz a junção pode ficar com um conjunto parcial de seus arquivos de dados originais ou sem dados do usuário. Os dados transferidos pelo doador são removidos do destinatário se a operação de clonagem for interrompida antes que os dados sejam totalmente clonados. Essa situação pode ser corrigida tentando novamente a operação de clonagem, o que a Replicação em Grupo faz automaticamente.

Nas seguintes situações, o processo de recuperação distribuída não pode ser concluído, e o membro que está se juntando deixa o grupo:

- *Transações excluídas* - As transações que são necessárias para a adesão do membro não estão presentes nos arquivos de registro binário de nenhum membro do grupo online, e os dados não podem ser obtidos por uma operação de clonagem remota (porque o plugin de clonagem não está instalado ou porque a clonagem foi tentada com todos os possíveis doadores, mas falhou). O membro que está se juntando, portanto, não consegue se atualizar com o grupo.

- *Transações extras* - O membro que está sendo adicionado já contém algumas transações que não estão presentes no grupo. Se uma operação de clonagem remota foi realizada, essas transações seriam excluídas e perdidas, porque o diretório de dados no membro que está sendo adicionado é apagado. Se a transferência de estado de um log binário do doador foi realizada, essas transações poderiam entrar em conflito com as transações do grupo. Para obter conselhos sobre como lidar com essa situação, consulte Transações extras.

- *Limite de tentativas de conexão atingido* - O membro que está se conectando fez todas as tentativas de conexão permitidas pelo limite de tentativas de conexão. Você pode configurar isso usando a variável de sistema `group_replication_recovery_retry_count` (consulte a Seção 20.5.4.3, “Configurando a Recuperação Distribuída”).

- *Sem mais doadores* - O membro que se juntou tentou sem sucesso uma operação de clonagem remota com cada um dos doadores online que suportam o clone, em ordem (se o plugin de clonagem estiver instalado), e depois tentou sem sucesso a transferência de estado do log binário com cada um dos doadores online adequados, se possível.

- *O membro que se junta sai do grupo* - O membro que se junta sai do grupo ou a replicação em grupo é interrompida no membro que se junta enquanto a transferência de estado está em andamento.

Se o membro que se juntou ao grupo saiu do grupo acidentalmente, então, em qualquer situação listada acima, exceto na última, ele procede a realizar a ação especificada pela variável de sistema `group_replication_exit_state_action`.
