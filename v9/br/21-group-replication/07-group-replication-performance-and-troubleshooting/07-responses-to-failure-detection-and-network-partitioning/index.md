### 20.7.7 Respostas à Detecção de Falha e Partição da Rede

20.7.7.1 Timeout de Expulsão

20.7.7.2 Timeout de Maioridade Inatingível

20.7.7.3 Auto-Rejoin

20.7.7.4 Ação de Saída

O mecanismo de detecção de falhas da replicação em grupo é projetado para identificar os membros do grupo que não estão mais comunicando-se com o grupo e expulsá-los quando parece provável que tenham falhado. Ter um mecanismo de detecção de falhas aumenta a chance de que o grupo contenha uma maioria de membros que estão funcionando corretamente e que os pedidos dos clientes sejam processados corretamente.

Normalmente, todos os membros do grupo trocam regularmente mensagens com todos os outros membros do grupo. Se um membro do grupo não receber nenhuma mensagem de um membro específico por 5 segundos, quando esse período de detecção terminar, isso cria uma suspeita sobre o membro. Quando uma suspeita expira, o membro suspeito é considerado falhado e é expulso do grupo. Um membro expulso é removido da lista de membros vista pelos outros membros, mas ele não sabe que foi expulso do grupo, então ele se vê como online e os outros membros como inatingíveis. Se o membro não falhou de fato (por exemplo, porque foi apenas desconectado devido a um problema de rede temporário) e consegue retomar a comunicação com os outros membros, ele recebe uma visualização contendo as informações de que foi expulso do grupo.

As respostas dos membros do grupo, incluindo o próprio membro falhado, a essas situações podem ser configuradas em vários pontos do processo. Por padrão, os seguintes comportamentos acontecem se um membro for suspeito de ter falhado:

1. No MySQL 9.5, quando uma suspeita é criada, um período de espera de 5 segundos é adicionado antes que a suspeita expire e o membro suspeito seja responsável pela expulsão.

2. Se um membro expulso retoma a comunicação e percebe que foi expulso, ele automaticamente faz três tentativas de voltar ao grupo (com 5 minutos entre cada tentativa); se esse procedimento de auto-reentrada não funcionar, ele então para de tentar voltar ao grupo.

3. Quando um membro expulso não tenta voltar ao grupo, ele passa para o modo de leitura apenas super e aguarda a atenção do operador.

Você pode usar as opções de configuração de replicação de grupo descritas nesta seção para alterar esses comportamentos permanentemente ou temporariamente, de acordo com as necessidades do seu sistema e suas prioridades. Se você está enfrentando expulsões desnecessárias causadas por redes ou máquinas mais lentas, redes com uma alta taxa de interrupções transitórias inesperadas ou interrupções planejadas de rede, considere aumentar o tempo de expiração e as tentativas de auto-reentrada. Enquanto um membro estiver passando por algum dos comportamentos padrão descritos anteriormente, embora não aceite escritas, leituras ainda podem ser realizadas se o membro ainda estiver comunicando com clientes, com uma probabilidade crescente de leituras desatualizadas ao longo do tempo. Se evitar leituras desatualizadas é uma prioridade maior para você do que evitar a intervenção do operador, considere reduzir o tempo de expiração e as tentativas de auto-reentrada ou configurá-las para zero.

Os membros que não falharam podem perder o contato com parte, mas não com toda, do grupo de replicação devido a uma partição de rede. Por exemplo, em um grupo de 5 servidores (S1, S2, S3, S4, S5), se houver uma desconexão entre (S1, S2) e (S3, S4, S5), há uma partição de rede. O primeiro grupo (S1, S2) agora está em minoria porque não pode entrar em contato com mais da metade do grupo. Quaisquer transações processadas pelos membros do grupo minoritário são bloqueadas, porque a maioria do grupo é inatingível, portanto, o grupo não pode alcançar o quórum. Para uma descrição detalhada deste cenário, consulte a Seção 20.7.8, “Tratamento de uma Partição de Rede e Perda de Quórum”. Nesta situação, o comportamento padrão é que os membros tanto da minoria quanto da maioria permaneçam no grupo, continuem a aceitar transações (embora sejam bloqueadas nos membros da minoria) e esperem pela intervenção do operador. Esse comportamento também é configurável.

Observe que, quando os membros do grupo estão em uma versão mais antiga do MySQL Server que não suporta uma configuração relevante, ou em uma versão com um comportamento padrão diferente, eles agem em relação a si mesmos e aos outros membros do grupo de acordo com os comportamentos padrão mencionados acima. Por exemplo, um membro que não suporta a variável de sistema `group_replication_member_expel_timeout` expulsa outros membros assim que uma suspeita expirada é detectada, e essa expulsão é aceita por outros membros, mesmo que eles suportem a variável de sistema e tenham um tempo de espera mais longo configurado.