### 16.4.2 Compatibilidade de replicação entre versões do MySQL

O MySQL suporta a replicação de uma série de versões para a série de versões seguinte. Por exemplo, você pode replicar de uma fonte que executa o MySQL 5.6 para uma réplica que executa o MySQL 5.7, de uma fonte que executa o MySQL 5.7 para uma réplica que executa o MySQL 8.0, e assim por diante. No entanto, você pode encontrar dificuldades ao replicar de uma fonte mais antiga para uma réplica mais nova se a fonte usar instruções ou depender de comportamentos que não são mais suportados na versão do MySQL usada na réplica. Por exemplo, os nomes de chaves estrangeiras mais longos que 64 caracteres não são mais suportados a partir do MySQL 8.0.

O uso de mais de duas versões do MySQL Server não é suportado em configurações de replicação que envolvem múltiplas fontes, independentemente do número de servidores MySQL de origem ou replica. Esta restrição se aplica não apenas às séries de lançamento, mas também aos números de versão dentro da mesma série de lançamento. Por exemplo, se você estiver usando uma configuração de replicação em cadeia ou circular, não poderá usar o MySQL 5.7.22, MySQL 5.7.23 e MySQL 5.7.24 simultaneamente, embora você possa usar qualquer uma das duas versões juntas.

Importante

É altamente recomendável usar a versão mais recente disponível dentro de uma determinada série de lançamentos do MySQL, pois as capacidades de replicação (e outras) estão sendo continuamente aprimoradas. Também é recomendável atualizar fontes e réplicas que utilizam versões iniciais de uma série de lançamentos do MySQL para versões GA (produção) quando estas últimas estiverem disponíveis para essa série de lançamentos.

A replicação de fontes mais recentes para réplicas mais antigas pode ser possível, mas geralmente não é suportada. Isso ocorre devido a vários fatores:

- **Alterações no formato do log binário.** O formato do log binário pode mudar entre as versões principais. Embora tentemos manter a compatibilidade reversa, isso nem sempre é possível.

  Isso também tem implicações significativas para a atualização dos servidores de replicação; consulte Seção 16.4.3, “Atualizando uma Topologia de Replicação”, para mais informações.

- Para obter mais informações sobre a replicação baseada em linhas, consulte Seção 16.2.1, “Formatos de replicação”.

- **Incompatibilidades do SQL.** Você não pode replicar de uma fonte mais recente para uma réplica mais antiga usando a replicação baseada em instruções se as instruções a serem replicadas utilizarem recursos do SQL disponíveis na fonte, mas não na réplica.

  No entanto, se tanto a fonte quanto a réplica suportam a replicação baseada em linhas e não houver declarações de definição de dados a serem replicadas que dependam de recursos do SQL encontrados na fonte, mas não na réplica, você pode usar a replicação baseada em linhas para replicar os efeitos das declarações de modificação de dados, mesmo que a execução do DDL na fonte não seja suportada na réplica.

Para obter mais informações sobre possíveis problemas de replicação, consulte Seção 16.4.1, “Recursos e problemas de replicação”.
