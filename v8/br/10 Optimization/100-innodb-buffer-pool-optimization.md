### 10.10.1 Otimização do Pool de Armazenamento do InnoDB

O `InnoDB` mantém uma área de armazenamento chamada pool de armazenamento para cachear dados e índices na memória. Conhecer como o pool de armazenamento do `InnoDB` funciona e aproveitar isso para manter os dados acessados com frequência na memória é um aspecto importante do ajuste do MySQL.

Para uma explicação sobre o funcionamento interno do pool de armazenamento do `InnoDB`, uma visão geral de seu algoritmo de substituição LRU (Least Recently Used) e informações gerais de configuração, consulte a Seção 17.5.1, “Pool de Armazenamento”.

Para informações adicionais sobre a configuração e o ajuste do pool de armazenamento do `InnoDB`, consulte estas seções:

*  Seção 17.8.3.4, “Configurando a Pré-visualização do Pool de Armazenamento do InnoDB (Leitura Antecipada”)")
*  Seção 17.8.3.5, “Configurando o Limpeza do Pool de Armazenamento”
*  Seção 17.8.3.3, “Tornando o Scan do Pool de Armazenamento Resistente”
*  Seção 17.8.3.2, “Configurando Múltiplas Instâncias do Pool de Armazenamento”
*  Seção 17.8.3.6, “Salvando e Restaurando o Estado do Pool de Armazenamento”
*  Seção 17.8.3.1, “Configurando o Tamanho do Pool de Armazenamento do InnoDB”