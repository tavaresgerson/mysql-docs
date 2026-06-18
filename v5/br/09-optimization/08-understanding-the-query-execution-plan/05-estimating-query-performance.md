### 8.8.5 Estimativa do desempenho da consulta

Na maioria dos casos, você pode estimar o desempenho da consulta contando os acessos ao disco. Para tabelas pequenas, geralmente é possível encontrar uma linha em um único acesso ao disco (porque o índice provavelmente está em cache). Para tabelas maiores, você pode estimar que, usando índices de árvore B, você precisa desse número de acessos para encontrar uma linha: `log(número_de_linhas) / log(tamanho_do_bloco_do_índice / 3 * 2 / (tamanho_do_índice + tamanho_do_ponteiro_de_dados)) + 1`.

No MySQL, um bloco de índice geralmente tem 1.024 bytes e o ponteiro de dados geralmente tem quatro bytes. Para uma tabela de 500.000 linhas com um comprimento do valor da chave de três bytes (o tamanho de `MEDIUMINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT), a fórmula indica `log(500,000)/log(1024/3*2/(3+4)) + 1` = `4` buscas.

Esse índice exigiria o armazenamento de cerca de 500.000 * 7 * 3/2 = 5,2 MB (assumindo uma taxa típica de preenchimento do buffer do índice de 2/3), então você provavelmente tem grande parte do índice na memória e, portanto, precisa de apenas uma ou duas chamadas para ler os dados para encontrar a linha.

Para os escritores, no entanto, você precisa de quatro solicitações de busca para encontrar onde colocar um novo valor de índice e normalmente duas buscas para atualizar o índice e escrever a linha.

A discussão anterior não significa que o desempenho da sua aplicação diminua lentamente ao log *`N`*. Enquanto tudo estiver armazenado em cache pelo sistema operacional ou pelo servidor MySQL, as coisas só se tornam ligeiramente mais lentas à medida que a tabela cresce. Depois que os dados se tornam grandes demais para serem armazenados em cache, as coisas começam a ficar muito mais lentas até que suas aplicações sejam limitadas apenas por buscas no disco (que aumentam ao log *`N`*). Para evitar isso, aumente o tamanho do cache de chaves à medida que os dados crescem. Para tabelas `MyISAM`, o tamanho do cache de chaves é controlado pela variável de sistema `key_buffer_size`. Veja a Seção 5.1.1, “Configurando o Servidor”.
