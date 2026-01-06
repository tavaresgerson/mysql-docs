### 8.10.3 Cache de consultas MySQL

8.10.3.1 Como o Cache de Consultas Funciona

8.10.3.2 Opções de cache de consulta SELECT

8.10.3.3 Configuração do Cache de Consultas

8.10.3.4 Verificar o status e a manutenção do cache de consultas

Nota

O cache de consultas é descontinuado a partir do MySQL 5.7.20 e é removido no MySQL 8.0.

O cache de consultas armazena o texto de uma instrução `SELECT` juntamente com o resultado correspondente que foi enviado ao cliente. Se uma instrução idêntica for recebida posteriormente, o servidor recupera os resultados do cache de consultas em vez de analisar e executar a instrução novamente. O cache de consultas é compartilhado entre as sessões, portanto, um conjunto de resultados gerado por um cliente pode ser enviado em resposta à mesma consulta emitida por outro cliente.

O cache de consultas pode ser útil em um ambiente onde você tem tabelas que não mudam com muita frequência e para as quais o servidor recebe muitas consultas idênticas. Esta é uma situação típica para muitos servidores web que geram muitas páginas dinâmicas com base no conteúdo do banco de dados.

O cache de consultas não retorna dados desatualizados. Quando as tabelas são modificadas, todas as entradas relevantes no cache de consultas são descartadas.

Nota

O cache de consultas não funciona em um ambiente onde você tem vários servidores **mysqld** atualizando as mesmas tabelas `MyISAM`.

O cache de consulta é usado para instruções preparadas nas condições descritas na Seção 8.10.3.1, “Como o Cache de Consulta Funciona”.

Nota

O cache de consultas não é suportado para tabelas particionadas e é desativado automaticamente para consultas que envolvem tabelas particionadas. O cache de consultas não pode ser ativado para essas consultas.

Segue alguns dados de desempenho do cache de consultas. Esses resultados foram gerados executando o conjunto de benchmarks do MySQL em um sistema Linux Alpha 2×500MHz com 2GB de RAM e um cache de consultas de 64MB.

- Se todas as consultas que você está executando forem simples (como selecionar uma linha de uma tabela com uma única linha), mas ainda assim forem diferentes, de modo que as consultas não possam ser armazenadas no cache, o custo adicional de manter o cache de consultas ativo é de 13%. Isso pode ser considerado o pior cenário possível. Na vida real, as consultas tendem a ser muito mais complicadas, então o custo adicional normalmente é significativamente menor.

- As pesquisas por uma única linha em uma tabela de uma única linha são 238% mais rápidas com o cache de consulta do que sem ele. Isso pode ser considerado próximo à velocidade mínima esperada para uma consulta que está em cache.

Para desativar o cache de consultas na inicialização do servidor, defina a variável de sistema `query_cache_size` para 0. Ao desativar o código do cache de consultas, não há sobrecarga perceptível.

O cache de consultas oferece o potencial para uma melhoria substancial do desempenho, mas não se espere que isso aconteça em todas as circunstâncias. Com algumas configurações de cache de consultas ou cargas de trabalho do servidor, você pode, na verdade, observar uma diminuição do desempenho:

- Tenha cuidado para dimensionar o cache de consulta de forma excessivamente grande, o que aumenta o custo adicional necessário para manter o cache, possivelmente ultrapassando o benefício de ativá-lo. Tamanhos em dezenas de megabytes geralmente são benéficos. Tamanhos de centenas de megabytes podem não ser.

- A carga de trabalho do servidor tem um efeito significativo na eficiência do cache de consultas. Uma mistura de consultas que consiste quase inteiramente em um conjunto fixo de instruções `SELECT` é muito mais propensa a se beneficiar da ativação do cache do que uma mistura na qual instruções `INSERT` frequentes causam invalidação contínua dos resultados no cache. Em alguns casos, uma solução alternativa é usar a opção `SQL_NO_CACHE` para impedir que os resultados entrem até mesmo no cache para instruções `SELECT` que utilizam tabelas frequentemente modificadas. (Veja a Seção 8.10.3.2, “Opções de Cache de Consulta SELECT”.)

Para verificar se a ativação do cache de consultas é benéfica, teste o funcionamento do seu servidor MySQL com o cache ativado e desativado. Em seguida, reteste periodicamente, pois a eficiência do cache de consultas pode mudar conforme as mudanças na carga de trabalho do servidor.
