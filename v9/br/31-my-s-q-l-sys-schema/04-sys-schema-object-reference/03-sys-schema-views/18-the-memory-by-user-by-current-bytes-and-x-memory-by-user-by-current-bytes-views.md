#### 30.4.3.18 Memória por usuário por bytes atuais e x$Memória por usuário por bytes atuais

Esses pontos de vista resumem o uso da memória, agrupados por usuário. Por padrão, as linhas são ordenadas em ordem decrescente de quantidade de memória usada.

Os pontos de vista `memória_por_usuario_por_bytes_atuais` e `x$memória_por_usuario_por_bytes_atuais` têm as seguintes colunas:

* `usuario`

  O nome do usuário do cliente. As linhas para as quais a coluna `USER` na tabela subjacente do Schema de Desempenho é `NULL` são assumidas como pertencentes a threads de segundo plano e são relatadas com o nome do host `background`.

* `contagem_atual_usada`

  O número atual de blocos de memória alocados que ainda não foram liberados para o usuário.

* `total_alocado`

  O total de alocações de memória em bytes para o usuário.

* `média_alocada_por_bloco`

  O número atual de bytes alocados por bloco de memória para o usuário.

* `max_alocado_atual`

  A maior alocação de memória atual em bytes para o usuário.