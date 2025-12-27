## Soluções de Replicação

19.4.1 Usando a Replicação para Backup

19.4.2 Lidando com um Parada Inesperada de uma Replicação

19.4.3 Monitorando a Replicação Baseada em Linhas

19.4.4 Usando a Replicação com Diferentes Motores de Armazenamento de Fonte e Replicação

19.4.5 Usando a Replicação para Expansão

19.4.6 Replicando Diferentes Bancos de Dados para Diferentes Replicações

19.4.7 Melhorando o Desempenho da Replicação

19.4.8 Trocando Fontes Durante o Failover

19.4.9 Trocando Fontes e Replicações com Failover de Conexão Assíncrona

19.4.10 Replicação Semisíncrona

A replicação pode ser usada em muitos ambientes diferentes para uma variedade de propósitos. Esta seção fornece notas gerais e conselhos sobre o uso da replicação para tipos específicos de soluções.

Para informações sobre o uso da replicação em um ambiente de backup, incluindo notas sobre a configuração, o procedimento de backup e os arquivos para fazer backup, consulte a Seção 19.4.1, “Usando a Replicação para Backup”.

Para conselhos e dicas sobre o uso de diferentes motores de armazenamento na fonte e na replica, consulte a Seção 19.4.4, “Usando a Replicação com Diferentes Motores de Armazenamento de Fonte e Replicação”.

Usar a replicação como uma solução de expansão requer algumas mudanças na lógica e operação das aplicações que usam a solução. Consulte a Seção 19.4.5, “Usando a Replicação para Expansão”.

Por razões de desempenho ou distribuição de dados, você pode querer replicar diferentes bancos de dados para diferentes replicações. Consulte a Seção 19.4.6, “Replicando Diferentes Bancos de Dados para Diferentes Replicações”

À medida que o número de réplicas aumenta, a carga na fonte pode aumentar e levar a um desempenho reduzido (devido à necessidade de replicar o log binário para cada réplica). Para obter dicas sobre como melhorar o desempenho da replicação, incluindo o uso de um único servidor secundário como fonte, consulte a Seção 19.4.7, “Melhorando o Desempenho da Replicação”.

Para obter orientações sobre a troca de fontes ou a conversão de réplicas em fontes como parte de uma solução de falha de emergência, consulte a Seção 19.4.8, “Troca de Fontes Durante a Falha de Emergência”.

Para obter informações sobre as medidas de segurança específicas para servidores em uma topologia de replicação, consulte a Seção 19.3, “Segurança da Replicação”.