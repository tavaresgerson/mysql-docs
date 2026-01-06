### 4.2.6 Controle de compressão da conexão

As conexões com o servidor podem usar compressão no tráfego entre o cliente e o servidor para reduzir o número de bytes enviados pela conexão. Por padrão, as conexões não são comprimidas, mas podem ser comprimidas se o servidor e o cliente suportarem a compressão.

As conexões compactadas têm origem no lado do cliente, mas afetam a carga da CPU tanto no lado do cliente quanto no do servidor, pois ambos os lados realizam operações de compressão e descompactação. Como a ativação da compressão diminui o desempenho, seus benefícios ocorrem principalmente quando há baixa largura de banda da rede, o tempo de transferência de rede domina o custo das operações de compressão e descompactação, e os conjuntos de resultados são grandes.

O controle de compressão se aplica às conexões ao servidor por programas de cliente e por servidores que participam da replicação de origem/replica. O controle de compressão não se aplica às conexões de replicação em grupo, às conexões do protocolo X ou às conexões para tabelas `FEDERATED`.

Esses parâmetros de configuração estão disponíveis para controlar a compressão da conexão:

- Os programas do cliente suportam a opção de linha de comando `--compress` para especificar o uso da compressão para a conexão com o servidor.

- Para programas que utilizam a API C do MySQL, a opção `MYSQL_OPT_COMPRESS` para a função `mysql_options()` especifica o uso da compressão para a conexão com o servidor.

- Para a replicação de origem/replica, a ativação da variável de sistema `slave_compressed_protocol` especifica o uso da compressão para as conexões de replica à origem.

Em cada caso, quando o uso de compressão é especificado, a conexão usa o algoritmo de compressão `zlib` se ambas as partes o suportam, com fallback para uma conexão não comprimida caso contrário.
