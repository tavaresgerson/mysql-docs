### 19.5.2 Compatibilidade de Replicação Entre Versões do MySQL

O MySQL suporta a replicação de uma versão mais antiga para uma replica mais recente para combinações de versões onde suportamos atualizações da versão da fonte para a versão da replica, conforme descrito na Seção 1.3, “Lançamentos do MySQL: Inovação e LTS” e na Seção 3.2, “Caminhos de Atualização”. No entanto, você pode encontrar dificuldades ao replicar de uma fonte mais antiga para uma replica mais recente se a fonte usar instruções ou depender de comportamentos que não são mais suportados na versão do MySQL usada na replica.

O uso de mais de duas versões do MySQL Server não é suportado em configurações de replicação que envolvem múltiplas fontes, independentemente do número de servidores MySQL fonte ou replica. Por exemplo, se você estiver usando uma configuração de replicação em cadeia ou circular, não pode usar MySQL X.Y.1, MySQL X.Y.2 e MySQL X.Y.3 simultaneamente, embora você possa usar qualquer uma dessas versões juntas.

Importante

É altamente recomendável usar a versão mais recente disponível dentro de uma série de lançamentos do MySQL, pois as capacidades de replicação (e outras) estão sendo continuamente aprimoradas. Também é recomendável atualizar fontes e réplicas que usam versões iniciais de uma série de lançamentos do MySQL para lançamentos GA (produção) quando estes últimos estiverem disponíveis para a série de lançamentos.

A versão do servidor é registrada no log binário para cada transação no servidor que originalmente fechou a transação (`original_server_version`) e no servidor que é a fonte imediata do servidor atual na topologia de replicação (`immediate_server_version`).

A replicação de fontes mais recentes para réplicas mais antigas pode ser possível, mas geralmente não é suportada. Isso ocorre devido a vários fatores:

* **Alterações no formato do log binário.** O formato do log binário pode mudar entre as versões principais. Embora tentemos manter a compatibilidade reversa, isso nem sempre é possível. Uma fonte também pode ter recursos opcionais habilitados que não são compreendidos por réplicas mais antigas, como a compressão de transações do log binário, onde os payloads de transações compactados resultantes não podem ser lidos por uma réplica de uma versão anterior ao MySQL 8.0.20.

Isso também tem implicações significativas para a atualização dos servidores de replicação; consulte a Seção 19.5.3, “Atualizando ou Desatualizando uma Topologia de Replicação”, para obter mais informações.

* **Incompatibilidades SQL.** Você não pode replicar de uma fonte mais nova para uma réplica mais antiga usando a replicação baseada em instruções se as instruções a serem replicadas usarem recursos SQL disponíveis na fonte, mas não na réplica.

No entanto, se tanto a fonte quanto a réplica suportam a replicação baseada em linhas, e não houver declarações de definição de dados a serem replicadas que dependem de recursos SQL encontrados na fonte, mas não na réplica, você pode usar a replicação baseada em linhas para replicar os efeitos das declarações de modificação de dados, mesmo que a execução de DDL na fonte não seja suportada na réplica.

Para mais informações sobre a replicação baseada em linhas, consulte a Seção 19.2.1, “Formatos de Replicação”.

Para obter mais informações sobre possíveis problemas de replicação, consulte a Seção 19.5.1, “Recursos e Problemas de Replicação”.