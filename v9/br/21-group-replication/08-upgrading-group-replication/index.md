## 20.8 Atualização da Replicação em Grupo

20.8.1 Combinando Diferentes Versões de Membros em um Grupo

20.8.2 Atualização Offline da Replicação em Grupo

20.8.3 Atualização Online da Replicação em Grupo

Esta seção explica como atualizar uma configuração de Replicação em Grupo. O processo básico de atualização dos membros de um grupo é o mesmo que a atualização de instâncias autônomas, consulte o Capítulo 3, *Atualização do MySQL* para o processo real de atualização e os tipos disponíveis. A escolha entre uma atualização local ou lógica depende da quantidade de dados armazenados no grupo. Geralmente, uma atualização local é mais rápida e, portanto, é recomendada. Você também deve consultar a Seção 19.5.3, “Atualização ou Downgrade de uma Topologia de Replicação”.

Nota

Antes do MySQL 8.4, um servidor não se juntaria a um grupo se estivesse executando uma versão do MySQL Server menor que a versão do membro do grupo mais baixo. Por exemplo, para um grupo com S1 (8.0.30), S2 (8.0.31) e S3 (8.0.32), o membro que se junta precisa ser 8.0.30 ou superior. O MySQL 8.4 permite que todas as versões da série 8.4 se juntem. Por exemplo, um servidor 8.4.0 poderia se juntar a um grupo composto por S1 (8.4.1) e S2 (8.4.2).

Enquanto você está no processo de atualizar um grupo online, para maximizar a disponibilidade, você pode precisar ter membros com diferentes versões do MySQL Server rodando ao mesmo tempo. A Replicação em Grupo inclui políticas de compatibilidade que permitem combinar membros rodando diferentes versões do MySQL no mesmo grupo durante o procedimento de atualização. Dependendo do seu grupo, os efeitos dessas políticas podem afetar a ordem em que você deve atualizar os membros do grupo. Para detalhes, consulte a Seção 20.8.1, “Combinando Diferentes Versões de Membros em um Grupo”.

Se o seu grupo puder ser desativado completamente, consulte a Seção 20.8.2, “Atualização de Replicação de Grupo Offline”. Se o seu grupo precisar permanecer online, como é comum em implantações de produção, consulte a Seção 20.8.3, “Atualização de Replicação de Grupo Online” para as diferentes abordagens disponíveis para atualizar um grupo com o menor tempo de inatividade possível.