### 8.10.1 Otimização do Pool de Buffer do InnoDB

O `InnoDB` mantém uma área de armazenamento chamada buffer pool para armazenar dados e índices em memória. Saber como o buffer pool do `InnoDB` funciona e aproveitar isso para manter dados acessados com frequência na memória é um aspecto importante do ajuste do MySQL.

Para uma explicação sobre o funcionamento interno do pool de buffers do `InnoDB`, uma visão geral de seu algoritmo de substituição LRU e informações gerais de configuração, consulte a Seção 14.5.1, “Pool de Buffers”.

Para obter informações adicionais sobre a configuração e o ajuste do pool de buffers do `InnoDB`, consulte estas seções:

- Seção 14.8.3.4, “Configurando a pré-visualização do pool de buffers InnoDB (leitura antecipada)”)
- Seção 14.8.3.5, “Configurando o esvaziamento do pool de buffers”
- Seção 14.8.3.3, “Tornar a varredura do pool de tampão resistente”
- Seção 14.8.3.2, “Configurando múltiplas instâncias do pool de buffers”
- Seção 14.8.3.6, “Salvar e restaurar o estado do pool de buffers”
- Seção 14.8.3.1, “Configurando o tamanho do pool de buffers do InnoDB”
