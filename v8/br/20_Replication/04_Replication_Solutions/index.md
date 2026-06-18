## 19.4 Soluções de Replicação

19.4.1 Uso da replicação para backups

19.4.2 Tratamento de um Parada Inesperada de uma Replicação

19.4.3 Monitoramento da Replicação Baseada em Linha

19.4.4 Uso da replicação com diferentes motores de armazenamento de origem e réplica

19.4.5 Usar a replicação para expansão em escala

19.4.6 Replicação de diferentes bancos de dados em diferentes réplicas

19.4.7 Melhoria do desempenho da replicação

19.4.8 Alteração de fontes durante o failover

19.4.9 Alteração de fontes e réplicas com falha de transição de conexão assíncrona

19.4.10 Replicação semiesincronizada

19.4.11 Replicação atrasada

A replicação pode ser usada em muitos ambientes diferentes para uma variedade de propósitos. Esta seção fornece notas gerais e conselhos sobre o uso da replicação para tipos específicos de soluções.

Para obter informações sobre o uso da replicação em um ambiente de backup, incluindo notas sobre a configuração, o procedimento de backup e os arquivos a serem protegidos, consulte a Seção 19.4.1, “Usando a Replicação para Backups”.

Para obter conselhos e dicas sobre o uso de diferentes motores de armazenamento na fonte e na replica, consulte a Seção 19.4.4, “Usando a Replicação com Diferentes Motores de Armazenamento de Fonte e Replicação”.

Para usar a replicação como solução de expansão, é necessário fazer algumas alterações na lógica e no funcionamento das aplicações que utilizam a solução. Consulte a Seção 19.4.5, “Usar a replicação para expansão”.

Por razões de desempenho ou distribuição de dados, você pode querer replicar diferentes bancos de dados para diferentes réplicas. Consulte a Seção 19.4.6, “Replicação de Diferentes Bancos de Dados para Diferentes Réplicas”.

À medida que o número de réplicas aumenta, a carga na fonte pode aumentar e levar a um desempenho reduzido (devido à necessidade de replicar o log binário para cada réplica). Para obter dicas sobre como melhorar o desempenho da replicação, incluindo o uso de um único servidor secundário como fonte, consulte a Seção 19.4.7, “Melhorando o Desempenho da Replicação”.

Para obter orientações sobre a troca de fontes ou a conversão de réplicas em fontes como parte de uma solução de falha de emergência, consulte a Seção 19.4.8, “Troca de Fontes Durante a Falha de Emergência”.

Para obter informações sobre as medidas de segurança específicas para servidores em uma topologia de replicação, consulte a Seção 19.3, “Segurança da replicação”.
