### 10.10.1 Otimização do Banco de Armazenamento de Buffer do InnoDB

O `InnoDB` mantém uma área de armazenamento chamada pool de buffers para armazenar dados e índices na memória. Saber como o pool de buffers `InnoDB` funciona e aproveitar isso para manter os dados acessados com frequência na memória é um aspecto importante do ajuste do MySQL.

Para uma explicação sobre o funcionamento interno do pool de buffers `InnoDB`, uma visão geral de seu algoritmo de substituição LRU e informações gerais de configuração, consulte a Seção 17.5.1, “Pool de Buffers”.

Para obter informações adicionais sobre a configuração e o ajuste do pool de buffers `InnoDB`, consulte estas seções:

- Seção 17.8.3.4, “Configurando a pré-visualização do pool de buffers InnoDB (leitura antecipada)”)
- Seção 17.8.3.5, “Configurando o esvaziamento do pool de buffers”
- Seção 17.8.3.3, “Tornar a varredura do pool de tampão resistente”
- Seção 17.8.3.2, “Configurando múltiplas instâncias do pool de buffers”
- Seção 17.8.3.6, “Salvar e restaurar o estado do pool de buffers”
- Seção 17.8.3.1, “Configurando o tamanho do pool de buffers do InnoDB”
