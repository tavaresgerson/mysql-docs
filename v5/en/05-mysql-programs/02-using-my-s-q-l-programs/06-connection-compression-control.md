### 4.2.6 Controle de Compressão de Conexão

Conexões com o *server* podem usar *compression* no tráfego entre o *client* e o *server* para reduzir o número de *bytes* enviados pela conexão. Por padrão, as conexões não são comprimidas, mas podem ser comprimidas se tanto o *server* quanto o *client* suportarem *compression*.

Conexões comprimidas são iniciadas no lado do *client*, mas afetam a carga de *CPU* em ambos os lados (*client* e *server*), pois ambos realizam operações de *compression* e descompressão. Como habilitar a *compression* diminui a *performance*, seus benefícios ocorrem principalmente quando há baixa *network bandwidth*, o tempo de transferência de rede domina o custo das operações de *compression* e descompressão, e os *result sets* são grandes.

O controle de *compression* se aplica a conexões com o *server* por programas *client* e por *servers* que participam da replicação *source/replica*. O controle de *compression* não se aplica a conexões de Group Replication, conexões X *Protocol*, ou conexões para tabelas `FEDERATED`.

Estes parâmetros de configuração estão disponíveis para controlar a *compression* da conexão:

*   Programas *client* suportam uma opção de linha de comando `--compress` para especificar o uso de *compression* para a conexão com o *server*.

*   Para programas que usam a C *API* do MySQL, habilitar a opção `MYSQL_OPT_COMPRESS` para a função `mysql_options()` especifica o uso de *compression* para a conexão com o *server*.

*   Para replicação *source/replica*, habilitar a variável de sistema `slave_compressed_protocol` especifica o uso de *compression* para conexões da *replica* com o *source*.

Em cada caso, quando o uso de *compression* é especificado, a conexão utiliza o algoritmo de *compression* `zlib` se ambos os lados o suportarem, com *fallback* para uma conexão não comprimida caso contrário.