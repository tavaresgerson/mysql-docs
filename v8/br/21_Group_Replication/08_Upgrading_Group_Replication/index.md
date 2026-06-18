## 20.8 Atualização da Replicação em Grupo

20.8.1 Combinando diferentes versões do membro em um grupo

20.8.2 Atualização de Replicação em Grupo Off-line

20.8.3 Atualização de Replicação em Grupo Online

Esta seção explica como atualizar uma configuração de Replicação em Grupo. O processo básico de atualização dos membros de um grupo é o mesmo que a atualização de instâncias autônomas, consulte o Capítulo 3, *Atualizando o MySQL* para o processo real de atualização e os tipos disponíveis. A escolha entre uma atualização local ou lógica depende da quantidade de dados armazenados no grupo. Geralmente, uma atualização local é mais rápida e, portanto, é recomendada. Você também deve consultar a Seção 19.5.3, “Atualizando uma Topologia de Replicação”.

Enquanto você estiver atualizando um grupo online, para maximizar a disponibilidade, você pode precisar ter membros com diferentes versões do MySQL Server rodando ao mesmo tempo. A Replicação de Grupo inclui políticas de compatibilidade que permitem combinar membros com diferentes versões do MySQL no mesmo grupo de forma segura durante o procedimento de atualização. Dependendo do seu grupo, os efeitos dessas políticas podem afetar a ordem em que você deve atualizar os membros do grupo. Para obter detalhes, consulte a Seção 20.8.1, “Combinando Diferentes Versões de Membros em um Grupo”.

Se o seu grupo puder ser desativado completamente, consulte a Seção 20.8.2, “Atualização de Replicação de Grupo Offline”. Se o seu grupo precisar permanecer online, como é comum em implantações de produção, consulte a Seção 20.8.3, “Atualização de Replicação de Grupo Online” para as diferentes abordagens disponíveis para atualizar um grupo com o menor tempo de inatividade possível.
