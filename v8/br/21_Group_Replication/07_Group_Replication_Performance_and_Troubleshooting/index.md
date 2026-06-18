## 20.7 Desempenho e solução de problemas da replicação em grupo

20.7.1 Ajuste fino do tópico de comunicação do grupo

20.7.2 Controle de fluxo

20.7.3 Líder de Consenso Único

20.7.4 Compressão de Mensagens

20.7.5 Fragmentação de Mensagens

20.7.6 Gerenciamento de Cache do XCom

20.7.7 Respostas à Detecção de Falhas e Partição de Rede

20.7.8 Gerenciamento de Partição de Rede e Perda de Quórum

20.7.9 Monitoramento do uso da memória de replicação do grupo com o Instrumento de Memória do Schema de Desempenho

A Replicação em Grupo é projetada para criar sistemas resistentes a falhas com detecção automática de falhas e recuperação automatizada. Se uma instância do servidor membro sair voluntariamente ou parar de se comunicar com o grupo, os membros restantes concordam em reconfigurar o grupo entre si e escolhem um novo primário, se necessário. Os membros expulsos tentam automaticamente se reinserir no grupo e são atualizados pela recuperação distribuída. Se um grupo enfrentar um nível de dificuldades em que não consiga contatar a maioria de seus membros para chegar a uma decisão, ele identifica que perdeu o quórum e para de processar transações. A Replicação em Grupo também possui mecanismos e configurações embutidos para ajudar o grupo a se adaptar e gerenciar variações na carga de trabalho e no tamanho das mensagens, além de permanecer dentro das limitações do sistema subjacente e dos recursos de rede.

As configurações padrão das variáveis do sistema da Replicação em Grupo são projetadas para maximizar o desempenho e a autonomia de um grupo. As informações nesta seção são para ajudá-lo a configurar um grupo de replicação para otimizar o gerenciamento automático de quaisquer problemas recorrentes que você encontrar em seus sistemas específicos, como interrupções transitórias na rede ou cargas de trabalho e transações que excedam os recursos de uma instância do servidor.

Se você perceber que os membros do grupo estão sendo expulsos e retornando ao grupo com mais frequência do que você gostaria, é possível que as configurações padrão de detecção de falhas da Replicação de Grupo sejam muito sensíveis para o seu sistema. Isso pode ocorrer em redes ou máquinas mais lentas, redes com uma alta taxa de interrupções transitórias inesperadas ou durante interrupções planejadas da rede. Para obter conselhos sobre como lidar com essa situação ajustando as configurações, consulte a Seção 20.7.7, “Respostas à Detecção de Falhas e Partição de Rede”.

Você só precisará intervir manualmente em uma configuração de replicação em grupo se algo acontecer que o grupo não puder lidar automaticamente. Alguns problemas importantes que podem exigir intervenção do administrador são quando um membro está no status `ERROR` e não consegue se reiniciar no grupo ou quando uma partição de rede faz com que o grupo perca o quórum.

- Se um membro que funciona e está configurado corretamente, mas não consegue se juntar ou se reiniciar no grupo usando a recuperação distribuída e permanece no status `ERROR`, a Seção 20.5.4.4, “Tolerância a Falhas para Recuperação Distribuída”, explica os possíveis problemas. Uma causa provável é que o membro que está se juntando tenha transações extras que não estão presentes nos membros existentes do grupo. Para obter conselhos sobre como lidar com essa situação, consulte a Seção 20.4.1, “GTIDs e Replicação de Grupo”.

- Se um grupo perdeu o quórum, isso pode ser devido a uma partição de rede que divide o grupo em duas partes, ou possivelmente devido ao mau funcionamento da maioria dos servidores. Para obter conselhos sobre como lidar com essa situação, consulte a Seção 20.7.8, “Lidando com uma Partição de Rede e Perda de Quórum”.
