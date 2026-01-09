#### 19.5.1.28 Replicação e Pesquisas por Linha

Quando uma replica que utiliza o formato de replicação por linha aplica uma operação `UPDATE` ou `DELETE`, ela deve pesquisar a tabela relevante para encontrar as linhas correspondentes. O algoritmo utilizado para realizar esse processo usa um dos índices da tabela como primeira escolha para a pesquisa, e uma tabela hash se não houver índices adequados.

O algoritmo primeiro avalia os índices disponíveis na definição da tabela para ver se há algum índice adequado a ser usado, e se houver várias possibilidades, qual índice é o melhor para a operação. O algoritmo ignora os seguintes tipos de índice:

* Índices de full-text.
* Índices ocultos.
* Índices gerados.
* Índices de múltiplos valores.
* Qualquer índice onde a imagem anterior do evento da linha não contém todas as colunas do índice.

Se não houver índices adequados após descartar esses tipos de índice, o algoritmo não usa um índice para a pesquisa. Se houver índices adequados, um índice é selecionado entre os candidatos, na seguinte ordem de prioridade:

1. Uma chave primária.
2. Um índice único onde cada coluna do índice tem um atributo `NOT NULL`. Se houver mais de um índice desse tipo disponível, o algoritmo escolhe o mais à esquerda desses índices.

3. Qualquer outro índice. Se houver mais de um índice desse tipo disponível, o algoritmo escolhe o mais à esquerda desses índices.

Se o algoritmo conseguir selecionar uma chave primária ou um índice único onde cada coluna do índice tem um atributo `NOT NULL`, ele usa esse índice para iterar sobre as linhas na operação `UPDATE` ou `DELETE`. Para cada linha no evento da linha, o algoritmo busca a linha no índice para localizar o registro da tabela a ser atualizado. Se nenhum registro correspondente for encontrado, ele retorna o erro ER_KEY_NOT_FOUND e interrompe o fio do aplicável de replicação.

Se o algoritmo não conseguiu encontrar um índice adequado ou conseguiu encontrar apenas um índice que não era único ou continha nulos, uma tabela hash é usada para auxiliar na identificação dos registros da tabela. O algoritmo cria uma tabela hash contendo as linhas da operação `UPDATE` ou `DELETE`, com a chave como a imagem anterior completa da linha. O algoritmo então itera sobre todos os registros da tabela de destino, usando o índice selecionado, se encontrado, ou realizando uma varredura completa da tabela. Para cada registro na tabela de destino, ele determina se essa linha existe na tabela hash. Se a linha for encontrada na tabela hash, o registro na tabela de destino é atualizado e a linha é excluída da tabela hash. Quando todos os registros da tabela de destino tiverem sido verificados, o algoritmo verifica se a tabela hash está agora vazia. Se houver alguma linha não correspondente restante na tabela hash, o algoritmo retorna o erro ER_KEY_NOT_FOUND e interrompe o fio do aplicável de replicação.