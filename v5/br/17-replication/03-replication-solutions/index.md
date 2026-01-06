## 16.3 Soluções de Replicação

16.3.1 Uso da replicação para backups

16.3.2 Gerenciamento de um Parada Inesperada de uma Replicação

16.3.3 Uso da replicação com diferentes motores de armazenamento de origem e réplica

16.3.4 Uso da replicação para expansão em escala

16.3.5 Replicação de diferentes bancos de dados em diferentes réplicas

16.3.6 Melhoria do desempenho da replicação

16.3.7 Alterar fontes durante o failover

16.3.8 Configurando a replicação para usar conexões criptografadas

16.3.9 Replicação semiesincronizada

16.3.10 Replicação atrasada

A replicação pode ser usada em muitos ambientes diferentes para uma variedade de propósitos. Esta seção fornece notas gerais e conselhos sobre o uso da replicação para tipos específicos de soluções.

Para obter informações sobre o uso da replicação em um ambiente de backup, incluindo notas sobre a configuração, o procedimento de backup e os arquivos a serem protegidos, consulte Seção 16.3.1, “Usando a Replicação para Backups”.

Para obter conselhos e dicas sobre o uso de diferentes motores de armazenamento na fonte e nas réplicas, consulte Seção 16.3.3, “Usando replicação com diferentes motores de armazenamento de fonte e réplica”.

Para usar a replicação como solução de expansão, é necessário fazer algumas alterações na lógica e no funcionamento das aplicações que utilizam a solução. Consulte Seção 16.3.4, “Usar replicação para expansão”.

Por razões de desempenho ou distribuição de dados, você pode querer replicar diferentes bancos de dados para diferentes réplicas. Consulte Seção 16.3.5, “Replicação de Diferentes Bancos de Dados para Diferentes Réplicas”

À medida que o número de réplicas aumenta, a carga na fonte pode aumentar e levar a um desempenho reduzido (devido à necessidade de replicar o log binário para cada réplica). Para obter dicas sobre como melhorar o desempenho da replicação, incluindo o uso de um único servidor secundário como servidor de origem de replicação, consulte Seção 16.3.6, “Melhorando o Desempenho da Replicação”.

Para obter orientações sobre a troca de fontes ou a conversão de réplicas em fontes como parte de uma solução de falha de emergência, consulte Seção 16.3.7, “Troca de Fontes Durante a Falha de Emergência”.

Para garantir a comunicação de replicação, você pode criptografar o canal de comunicação. Para obter instruções passo a passo, consulte Seção 16.3.8, “Configurando a Replicação para Usar Conexões Criptografadas”.
