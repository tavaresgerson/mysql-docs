### 19.5.2 Compatibilidade de replicação entre versões do MySQL

O MySQL suporta a replicação de uma série de versões para a série de versões seguinte. Por exemplo, você pode replicar de uma fonte que executa o MySQL 5.6 para uma réplica que executa o MySQL 5.7, de uma fonte que executa o MySQL 5.7 para uma réplica que executa o MySQL 8.0, e assim por diante. No entanto, você pode encontrar dificuldades ao replicar de uma fonte mais antiga para uma réplica mais nova se a fonte usar instruções ou depender de comportamentos que não são mais suportados na versão do MySQL usada na réplica. Por exemplo, os nomes de chaves estrangeiras mais longos que 64 caracteres não são mais suportados a partir do MySQL 8.0.

O uso de mais de duas versões do MySQL Server não é suportado em configurações de replicação que envolvem múltiplas fontes, independentemente do número de servidores MySQL de origem ou replica. Esta restrição se aplica não apenas às séries de lançamento, mas também aos números de versão dentro da mesma série de lançamento. Por exemplo, se você estiver usando uma configuração de replicação em cadeia ou circular, não poderá usar o MySQL 8.0.22, MySQL 8.0.24 e MySQL 8.0.28 simultaneamente, embora você possa usar qualquer uma das duas versões juntas.

Importante

É altamente recomendável usar a versão mais recente disponível dentro de uma determinada série de lançamentos do MySQL, pois as capacidades de replicação (e outras) estão sendo continuamente aprimoradas. Também é recomendável atualizar fontes e réplicas que utilizam versões iniciais de uma série de lançamentos do MySQL para versões GA (produção) quando estas últimas estiverem disponíveis para essa série de lançamentos.

A partir do MySQL 8.0.14, a versão do servidor é registrada no log binário para cada transação no servidor que originalmente executou a transação (`original_server_version`), e no servidor que é a fonte imediata do servidor atual na topologia de replicação (`immediate_server_version`).

A replicação de fontes mais recentes para réplicas mais antigas pode ser possível, mas geralmente não é suportada. Isso ocorre devido a vários fatores:

- **Alterações no formato do log binário.** O formato do log binário pode mudar entre as versões principais. Embora tentemos manter a compatibilidade reversa, isso nem sempre é possível. Uma fonte também pode ter recursos opcionais habilitados que não são compreendidos por réplicas mais antigas, como a compressão de transações do log binário, onde os payloads de transações compactados resultantes não podem ser lidos por uma réplica em uma versão anterior ao MySQL 8.0.20.

  Isso também tem implicações significativas para a atualização dos servidores de replicação; consulte a Seção 19.5.3, “Atualizando uma Topologia de Replicação”, para obter mais informações.

- Para obter mais informações sobre a replicação baseada em linhas, consulte a Seção 19.2.1, “Formatos de replicação”.

- **Incompatibilidades do SQL.** Você não pode replicar de uma fonte mais recente para uma réplica mais antiga usando a replicação baseada em instruções se as instruções a serem replicadas utilizarem recursos do SQL disponíveis na fonte, mas não na réplica.

  No entanto, se tanto a fonte quanto a réplica suportam a replicação baseada em linhas e não houver declarações de definição de dados a serem replicadas que dependam de recursos do SQL encontrados na fonte, mas não na réplica, você pode usar a replicação baseada em linhas para replicar os efeitos das declarações de modificação de dados, mesmo que a execução do DDL na fonte não seja suportada na réplica.

No MySQL 8.0.26, foram feitas alterações incompatíveis nos nomes das ferramentas de replicação, incluindo os nomes das etapas de thread, que contêm os termos “master”, que foi alterado para “source”, “slave”, que foi alterado para “replica”, e “mts” (para “multithreaded slave”), que foi alterado para “mta” (para “multithreaded applier”). Ferramentas de monitoramento que trabalham com esses nomes de instrumentação podem ser afetadas. Se as alterações incompatíveis tiverem um impacto para você, defina a variável de sistema `terminology_use_previous` para `BEFORE_8_0_26` para fazer o MySQL Server usar as versões antigas dos nomes para os objetos especificados na lista anterior. Isso permite que as ferramentas de monitoramento que dependem dos nomes antigos continuem funcionando até que possam ser atualizadas para usar os novos nomes.

Para obter mais informações sobre possíveis problemas de replicação, consulte a Seção 19.5.1, “Recursos e problemas de replicação”.
