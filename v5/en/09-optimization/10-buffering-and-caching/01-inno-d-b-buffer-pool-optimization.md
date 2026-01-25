### 8.10.1 Otimização do InnoDB Buffer Pool

O `InnoDB` mantém uma área de armazenamento chamada *buffer pool* para armazenar em cache dados e *indexes* na memória. Saber como o `InnoDB` Buffer Pool funciona e aproveitá-lo para manter dados acessados frequentemente na memória é um aspecto importante do *tuning* do MySQL.

Para uma explicação do funcionamento interno do `InnoDB` Buffer Pool, uma visão geral do seu algoritmo de substituição LRU e informações gerais de configuração, consulte a Seção 14.5.1, “Buffer Pool”.

Para informações adicionais de configuração e *tuning* do `InnoDB` Buffer Pool, consulte estas seções:

* Seção 14.8.3.4, “Configurando o Prefetching (Read-Ahead) do InnoDB Buffer Pool”
* Seção 14.8.3.5, “Configurando o Flushing do Buffer Pool”
* Seção 14.8.3.3, “Tornando o Buffer Pool Scan Resistant”
* Seção 14.8.3.2, “Configurando Múltiplas Buffer Pool Instances”
* Seção 14.8.3.6, “Salvando e Restaurando o Buffer Pool State”
* Seção 14.8.3.1, “Configurando o Tamanho do InnoDB Buffer Pool”